import React, { useState } from "react";

/**
 * Enkel UI för att testa /api/analyze
 * – Klistra in (eller behåll) exempel-JSON
 * – Klicka "Analysera"
 * – Se resultatet direkt
 */
export default function AnalyzeTest() {
  const [input, setInput] = useState(`{
  "licenses": [
    { "Leverantör":"Microsoft 365","Kategori":"Programvara","Antal licenser":15,"Aktiva användare":10,"Pris per licens (SEK/mån)":120 },
    { "Leverantör":"Slack","Kategori":"Kommunikation","Antal licenser":20,"Aktiva användare":15,"Pris per licens (SEK/mån)":85 },
    { "Leverantör":"Zoom","Kategori":"Möten","Antal licenser":10,"Aktiva användare":5,"Pris per licens (SEK/mån)":150 }
  ],
  "projects": [
    { "Projekt":"Projekt Alfa","Uppgift":"Rapportskrivning","Tidsåtgång (timmar)":50 },
    { "Projekt":"Projekt Gamma","Uppgift":"Implementering","Tidsåtgång (timmar)":60 }
  ]
}`);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setErr("");
    setResult(null);
    try {
      // Validera att texten är giltig JSON
      const payload = JSON.parse(input);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error ${res.status}: ${txt}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setErr(e.message || "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setInput(`{
  "licenses": [
    { "Leverantör":"Microsoft 365","Kategori":"Programvara","Antal licenser":15,"Aktiva användare":10,"Pris per licens (SEK/mån)":120 },
    { "Leverantör":"Slack","Kategori":"Kommunikation","Antal licenser":20,"Aktiva användare":15,"Pris per licens (SEK/mån)":85 },
    { "Leverantör":"Zoom","Kategori":"Möten","Antal licenser":10,"Aktiva användare":5,"Pris per licens (SEK/mån)":150 }
  ],
  "projects": [
    { "Projekt":"Projekt Alfa","Uppgift":"Rapportskrivning","Tidsåtgång (timmar)":50 },
    { "Projekt":"Projekt Gamma","Uppgift":"Implementering","Tidsåtgång (timmar)":60 }
  ]
}`);
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12" id="analyze">
      <h2 className="text-2xl font-bold">Testa AI-analysen</h2>
      <p className="text-slate-600 mt-2">
        Klistra in data (JSON) eller använd exemplet och klicka{" "}
        <b>Analysera</b>. Resultatet visas nedan.
      </p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={loadExample}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
        >
          Ladda exempel
        </button>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Analyserar…" : "Analysera"}
        </button>
      </div>

      <textarea
        className="mt-4 w-full border border-slate-300 rounded-xl p-3 font-mono text-sm"
        rows={12}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {err && (
        <div className="mt-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700">
          {err}
        </div>
      )}

      {result && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold">Summering</h3>
            <ul className="mt-2 text-sm text-slate-700 space-y-1">
              <li>SEK/år: <b>{result?.totals?.sek_per_year ?? 0}</b></li>
              <li>Timmar/mån: <b>{result?.totals?.hours_per_month ?? 0}</b></li>
              <li>Guard OK: <b>{String(result?.guard?.meets)}</b></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold">Topp-förslag</h3>
            <ul className="mt-2 text-sm text-slate-700 space-y-2">
              {(result?.top || []).map((t, i) => (
                <li key={i} className="p-2 rounded bg-slate-50 border">
                  <div className="font-medium">{t.title}</div>
                  <div className="text-slate-600">{t.detail}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mb-2">Rådata</h3>
            <pre className="rounded-2xl border border-slate-200 p-4 bg-slate-50 overflow-auto text-xs">
{JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
