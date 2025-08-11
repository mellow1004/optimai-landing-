// /api/analyze.js
// Enkel, körbar MVP-analys: räknar licens-besparingar och tidsvinster

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ ok: false, error: "Use POST with JSON body { licenses:[], projects:[] }" });
    }

    const { licenses = [], projects = [] } = await readJson(req);

    // --- Analysregler ---
    const moneyFindings = analyzeLicenses(licenses);
    const timeFindings = analyzeProjects(projects);

    // Standard-guard: miniminivå för att anses “leverera värde”
    const guard = {
      moneyCount: moneyFindings.length,
      timeCount: timeFindings.length,
      meets: moneyFindings.length >= 1 && timeFindings.length >= 1, // höj till 3/2 senare
    };

    // Summeringar
    const totalSekYear = sum(moneyFindings.map((f) => f.effect_sek_year));
    const totalHours = sum(timeFindings.map((f) => f.effect_hours_month));

    // Kombinera och sortera topp-förslag
    const combined = [...moneyFindings, ...timeFindings].sort(
      (a, b) =>
        (b.effect_sek_year ?? 0) - (a.effect_sek_year ?? 0) ||
        (b.effect_hours_month ?? 0) - (a.effect_hours_month ?? 0)
    );

    return res.status(200).json({
      ok: true,
      guard,
      totals: {
        sek_per_year: Math.round(totalSekYear),
        hours_per_month: Math.round(totalHours * 10) / 10,
      },
      top: combined.slice(0, 7),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}

// ---------- Regler ----------
function analyzeLicenses(licenses = []) {
  const findings = [];
  for (const row of licenses) {
    const vendor = row["Leverantör"] ?? row.vendor;
    const category = row["Kategori"] ?? row.category;
    const totalLicenses = num(row["Antal licenser"] ?? row.totalLicenses);
    const activeUsers = num(row["Aktiva användare"] ?? row.activeUsers);
    const pricePerLicense = num(
      row["Pris per licens (SEK/mån)"] ?? row.pricePerLicense
    );

    if (isNumber(totalLicenses) && isNumber(activeUsers) && isNumber(pricePerLicense)) {
      const unused = Math.max(0, totalLicenses - activeUsers);
      const annual = Math.round(unused * pricePerLicense * 12);
      if (unused > 0 && annual > 0) {
        findings.push({
          type: "money",
          title: `Minska onyttjade licenser (${vendor})`,
          detail: `${unused} onyttjade × ${pricePerLicense} kr/mån → ~${formatSEK(
            annual
          )} kr/år`,
          effect_sek_year: annual,
          meta: { vendor, category, unused, pricePerLicense },
        });
      }
    }
  }
  return findings.sort((a, b) => b.effect_sek_year - a.effect_sek_year);
}

function analyzeProjects(projects = []) {
  const findings = [];
  for (const row of projects) {
    const project = row["Projekt"] ?? row.project;
    const task = row["Uppgift"] ?? row.task;
    const hours = num(row["Tidsåtgång (timmar)"] ?? row.hours);

    // Heuristik: långa uppgifter ⇒ automationsmöjlighet (30 %)
    if (isNumber(hours) && hours >= 45) {
      const savedHours = Math.round(hours * 0.3 * 10) / 10;
      if (savedHours > 0) {
        findings.push({
          type: "time",
          title: `Automatisera steg i '${task}' (${project})`,
          detail: `Tidsåtgång ${hours} h → antagen automationsgrad 30% → ~${savedHours} h/mån`,
          effect_hours_month: savedHours,
          meta: { project, task, hours },
        });
      }
    }
  }
  return findings.sort(
    (a, b) => (b.effect_hours_month ?? 0) - (a.effect_hours_month ?? 0)
  );
}

// ---------- Helpers ----------
function sum(arr) {
  return arr.filter((n) => Number.isFinite(n)).reduce((a, b) => a + b, 0);
}
async function readJson(req) {
  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}
function num(v) {
  if (v === null || v === undefined || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
function isNumber(n) {
  return Number.isFinite(n);
}
function formatSEK(n) {
  return new Intl.NumberFormat("sv-SE").format(Math.round(n));
}
