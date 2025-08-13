// api/intake.js (Vercel Serverless Function, Node runtime)
const { Redis } = require("@upstash/redis");

// ----- ENV & Redis -----
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const API_SECRET_KEY = process.env.API_SECRET_KEY || process.env.INTAKE_KEY || ""; // tillåt båda namnen

const redis = (REDIS_URL && REDIS_TOKEN)
  ? new Redis({ url: REDIS_URL, token: REDIS_TOKEN })
  : null;

// ----- Helpers -----
function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  // enkel CORS (om du ropar från Make/Zapier etc)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.end(JSON.stringify(obj));
}

async function readJson(req) {
  try {
    if (req.body && typeof req.body === "object") return req.body;
    const chunks = [];
    for await (const c of req) chunks.push(c);
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return {};
  }
}

// ----- Handler -----
module.exports = async (req, res) => {
  // CORS preflight
  if (req.method === "OPTIONS") return send(res, 204, {});

  // --- POST: spara dataset ---
  if (req.method === "POST") {
    // Valfri auth: kräver Authorization: Bearer <API_SECRET_KEY> om den finns
    const auth = req.headers["authorization"] || "";
    if (API_SECRET_KEY && auth !== `Bearer ${API_SECRET_KEY}`) {
      return send(res, 401, { ok: false, error: "unauthorized" });
    }

    const body = await readJson(req);
    const account = String(body.account || "").trim();
    if (!account) return send(res, 400, { ok: false, error: "missing account" });

    if (!redis) {
      // Redis ej konfigurerat – svara OK men spara inte (bra för snabbtest)
      return send(res, 200, { ok: true, stored: false, reason: "redis_missing_env" });
    }

    // Spara hela datasetet under nyckeln intake:<account>
    await redis.set(`intake:${account}`, body);

    return send(res, 200, { ok: true, stored: true, storage: "redis" });
  }

  // --- GET: hämta dataset ---
  if (req.method === "GET") {
    const url = new URL(req.url, "http://localhost");
    const account = (url.searchParams.get("account") || "").trim();
    if (!account) return send(res, 400, { ok: false, error: "missing account" });

    let data = null;
    if (redis) data = await redis.get(`intake:${account}`);

    return send(res, 200, { ok: true, data });
  }

  return send(res, 405, { ok: false, error: "method_not_allowed" });
};
