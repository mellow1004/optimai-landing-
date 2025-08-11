export async function explain(findings) {
  if (!process.env.OPENAI_API_KEY) return null;

  // Undvik tunga prompts: skicka bara nödvändiga fält
  const compact = findings.slice(0, 8).map(f => ({
    type: f.type,
    title: f.title,
    effect_sek_year: f.effect_sek_year ?? 0,
    effect_hours_month: f.effect_hours_month ?? 0,
    detail: f.detail
  }));

  const body = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Du är en svensk affärskonsult. Svara kort, konkret och åtgärdsorienterat." },
      { role: "user", content: `Summera fynden kort (max 6 meningar) och lista topp-3 åtgärder:\n${JSON.stringify(compact)}` }
    ],
    temperature: 0.2
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }).then(r => r.json()).catch(() => null);

  return res?.choices?.[0]?.message?.content ?? null;
}
