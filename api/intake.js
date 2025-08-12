// api/intake.js
// MVP-intag av data från Make/Zapier/egent klient.
// Stödjer POST (spara dataset) och GET (hämta dataset).
//
// SÄKERHET:
//  - Skicka Authorization: Bearer <INTAKE_KEY> vid POST.
//  - Ange ett konto-id (account) så vi kan separera kunder.
//
// LAGRING:
//  - Om Vercel KV är konfigurerat (KV_REST_API_URL + KV_REST_API_TOKEN)
//    sparas dataset i KV. Annars skippar vi lagring men returnerar 200 OK
//    (bra för lokal test). Rek. att sätta KV för produktion.

const INTAKE_KEY = process.env.INTAKE_KEY || "";
const KV_URL = process.env.KV_REST_API_URL || "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN || "";

// Enkelt schema-validering (MVP)
function validatePayload(p) {
  if (!p || typeof p !== "object") return "Bad JSON";
  if (!p.account || typeof p.account !== "string") return "Missing 'account'";
  if (!Array.isArray(p.licenses)) p.licenses = [];
  if (!Array.isArray(p.projects)) p.projects = [];
  if (!Array.isArray(p.costs)) p.costs = [];
  // Normalisera fältnamn för licenses
  p.licenses = p.licenses.map((r) => ({
    leverantor: (r.leverantor ?? r.Leverantör ?? r.vendor ?? "").toString(),
    licenser: Number(r.licenser ?? r["Antal licenser"] ?? r.seats ?? 0) || 0,
    aktiva: Number(r.aktiva ?? r["Aktiva användare"] ?? r.active ?? 0) || 0,
    pris: Number(r.pris ?? r["Pris per licens (SEK/mån)"] ?? r.price ?? 0) || 0,
  }));
  // Normalisera projects
  p.projects = p.projects.map((r, i) => ({
    uppgift: (r.uppgift ?? r.Uppgift ?? r.task ?? `Uppgift ${i + 1}`).toString(),
    timmar: Number(r.timmar ?? r["Tidsåtgång (timmar)"] ?? r.hours ?? 0) || 0,
  }));
  // Normalisera costs (frivilligt)
  p.costs = p.costs.map((r) => ({
    leverantor: (r.leverantor ?? r.vendor ?? "").toString(),
    belopp_per_manad:
      Number(r.belopp_per_manad ?? r.amount_per_month ?? r.amount ?? 0) || 0,
  }));
  return null;
}

// Upstash KV REST helpers (inga extra npm-deps behövs)
async function kvSet(key, value, ttlSeconds = 60 * 60 * 24 * 30) {
  if (!KV_URL || !KV_TOKEN) return { ok: false, skipped: true };
  const url = `${KV_URL}/set/${encodeURIComponent(key)}?ex=${ttlSeconds}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    body: JSON.stringify(value),
  });
  return { ok: r.ok, status: r.status };
}

async function kvGet(key) {
  if (!KV_URL || !KV_TOKEN) return { ok: false, skipped: true, value: null };
  const url = `${KV_URL}/get/${encodeURIComponent(key)}`;
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!r.ok) return { ok: false, status: r.status, value: null };
  const text = await r.text();
  // Upstash KV returnerar värdet som sträng (det vi postade ovan)
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: true, value: text };
  }
}

function json(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.statusCode = 204;
    return res.end();
  }

  if (req.method === "POST") {
    // Säkerhet: enkel bearer-nyckel
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    if (!INTAKE_KEY || token !== INTAKE_KEY) {
      return json(res, 401, { ok: false, error: "Unauthorized" });
    }

    // Läs body
    const chunks = [];
    for await (const c of req) chunks.push(c);
    let payload = {};
    try {
      payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      return json(res, 400, { ok: false, error: "Bad JSON" });
    }

    // Validera + normalisera
    const err = validatePayload(payload);
    if (err) return json(res, 400, { ok: false, error: err });

    // Nyckel per kundkonto
    const key = `intake:${payload.account}`;

    // Spara till KV om konfigurerat
    const kv = await kvSet(key, {
      receivedAt: new Date().toISOString(),
      source: payload.source || "external",
      licenses: payload.licenses,
      projects: payload.projects,
      costs: payload.costs,
    });

    return json(res, 200, {
      ok: true,
      stored: kv.ok || false,
      storage: kv.skipped ? "skipped" : "kv",
    });
  }

  if (req.method === "GET") {
    // GET /api/intake?account=acme
    const url = new URL(req.url, "http://localhost");
    const account = url.searchParams.get("account") || "";
    if (!account) return json(res, 400, { ok: false, error: "Missing account" });
    const key = `intake:${account}`;
    const kv = await kvGet(key);
    if (!kv.ok || !kv.value) return json(res, 404, { ok: false, error: "Not found" });
    return json(res, 200, { ok: true, data: kv.value });
  }

  return json(res, 405, { ok: false, error: "Method not allowed" });
}
