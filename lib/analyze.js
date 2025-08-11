import { analyzeLicenses, analyzeProjects } from "../lib/rules.js";
import { explain } from "../lib/explain.js";

export const config = { runtime: "nodejs" };

// POST /api/analyze
// Body (application/json):
// { "licenses": [...], "projects": [...] }
// Fieldnamn kan vara svenska rubriker (som i vårt Excel) eller engelska enligt rules.js
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Use POST" });
    }

    const { licenses = [], projects = [] } = await readJson(req);

    // 1) Kör regler
    const moneyFindings = analyzeLicenses(licenses);
    const timeFindings = analyzeProjects(projects);

    // 2) Standard-guard (minsta nivå vi lovar)
    const guard = {
      moneyCount: moneyFindings.length,
      timeCount: timeFindings.length,
      meets: moneyFindings.length >= 1 && timeFindings.length >= 1 // höj detta till 3/2 senare
    };

    // 3) Summera
    const totalSekYear = sum(moneyFindings.map(f => f.effect_sek_year));
    const totalHours = sum(timeFindings.map(f => f.effect_hours_month));

    // 4) (Valfritt) LLM-förklaring
    const combined = [...moneyFindings, ...timeFindings].sort((a,b) =>
      (b.effect_sek_year ?? 0) - (a.effect_sek_year ?? 0) || (b.effect_hours_month ?? 0) - (a.effect_hours_month ?? 0)
    );
    const summary = await explain(combined).catch(() => null);

    return res.status(200).json({
      ok: true,
      guard,
      totals: { sek_per_year: Math.round(totalSekYear), hours: Math.round(totalHours * 10)/10 },
      top: combined.slice(0, 7),
      summary
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}

function sum(arr){ return arr.filter(n => Number.isFinite(n)).reduce((a,b)=>a+b,0); }

async function readJson(req){
  return await new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end", () => {
      try { resolve(JSON.parse(data || "{}")); }
      catch(err){ reject(err); }
    });
    req.on("error", reject);
  });
}
