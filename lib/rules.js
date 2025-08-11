import { licenseSavings, timeSavings } from "./roi.js";

// 80/20-regler: returnerar en lista med fynd (money/time)
export function analyzeLicenses(licenses = []) {
  const findings = [];
  for (const row of licenses) {
    const vendor = row["Leverantör"] ?? row.vendor;
    const category = row["Kategori"] ?? row.category;
    const totalLicenses = num(row["Antal licenser"] ?? row.totalLicenses);
    const activeUsers = num(row["Aktiva användare"] ?? row.activeUsers);
    const pricePerLicense = num(row["Pris per licens (SEK/mån)"] ?? row.pricePerLicense);

    if (isNumber(totalLicenses) && isNumber(activeUsers) && isNumber(pricePerLicense)) {
      const { unused, annual } = licenseSavings({ totalLicenses, activeUsers, pricePerLicense });
      if (unused > 0 && annual > 0) {
        findings.push({
          type: "money",
          title: `Minska onyttjade licenser (${vendor})`,
          detail: `${unused} onyttjade × ${pricePerLicense} kr/mån → ~${formatSEK(annual)} kr/år`,
          effect_sek_year: annual,
          meta: { vendor, category, unused, pricePerLicense }
        });
      }
    }
  }
  return findings.sort((a, b) => b.effect_sek_year - a.effect_sek_year);
}

export function analyzeProjects(projects = []) {
  const findings = [];
  for (const row of projects) {
    const project = row["Projekt"] ?? row.project;
    const task = row["Uppgift"] ?? row.task;
    const hours = num(row["Tidsåtgång (timmar)"] ?? row.hours);

    // Heuristik: långa uppgifter har automationspotential (30%)
    if (isNumber(hours) && hours >= 45) {
      const { savedHours } = timeSavings({ hours, automationRate: 0.30 });
      if (savedHours > 0) {
        findings.push({
          type: "time",
          title: `Automatisera steg i '${task}' (${project})`,
          detail: `Tidsåtgång ${hours} h → antagen automationsgrad 30% → ~${savedHours} h`,
          effect_hours_month: savedHours,
          meta: { project, task, hours }
        });
      }
    }
  }
  return findings.sort((a, b) => (b.effect_hours_month ?? 0) - (a.effect_hours_month ?? 0));
}

// Helpers
function num(v){ if(v === null || v === undefined || v === "") return undefined; const n = Number(v); return Number.isFinite(n) ? n : undefined; }
function isNumber(n){ return Number.isFinite(n); }
function formatSEK(n){ return new Intl.NumberFormat("sv-SE").format(Math.round(n)) }
