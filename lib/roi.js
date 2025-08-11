// Gemensamma, standardiserade beräkningar (vår "OptimAI-standard")
export function licenseSavings({ totalLicenses, activeUsers, pricePerLicense }) {
  const unused = Math.max(0, (totalLicenses ?? 0) - (activeUsers ?? 0));
  const annual = unused * (pricePerLicense ?? 0) * 12;
  return { unused, annual: Math.round(annual) };
}

export function timeSavings({ hours, automationRate = 0.30 }) {
  const saved = Math.max(0, (hours ?? 0) * automationRate);
  return { savedHours: Math.round(saved * 10) / 10 };
}

export function cashflowEffect({ amount, improvedDays, capitalCost = 0.08 }) {
  // Enkel modell: (belopp × dagar förbättring / 365) × kapitalkostnad
  const effect = (amount ?? 0) * (improvedDays ?? 0) / 365.0 * (capitalCost ?? 0.08);
  return Math.round(effect);
}
