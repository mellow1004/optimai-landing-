import React, { useMemo, useState } from "react";

const fmt = new Intl.NumberFormat("sv-SE");

export default function AnalyzeTest() {
  // Enkel formulärdata för prospektet
  const [licenses, setLicenses] = useState([
    { leverantor: "Microsoft 365", licenser: 15, aktiva: 10, pris: 120 },
  ]);
  const [projects, setProjects] = useState([
    { uppgift: "Rapportskrivning", timmar: 10 },
  ]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  // Admin-läge: visa avancerat om URL har ?admin=1
  const admin = useMemo(
    () => typeof window !== "undefined" && window.location.search.includes("admin=1"),
    []
  );
  const [raw, setRaw] = useState(""); // endast admin

  const addLicense = () =>
    setLicenses((l) => [...l, { leverantor: "", licenser: 0, aktiva: 0, pris: 0 }]);
  const addProject = () =>
    setProjects((p) => [...p, { uppgift: "", timmar: 0 }]);

  const updateLicense = (i, key, val) =>
    setLicenses((l) => l.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  const updateProject = (i, key, val) =>
    setProjects((p) => p.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));

  const loadExample = () => {
    const example = {
      licenses: [
        { Leverantör: "Microsoft 365", Kategori: "Programvara", "Antal licenser": 15, "Aktiva användare": 10, "Pris per licens (SEK/mån)": 120 },
        { Leverantör: "Slack", Kategori: "Kommunikation", "Antal licenser": 20, "Aktiva användare": 15, "Pris per licens (SEK/mån)": 85 },
        { Leverantör: "Zoom", Kategori: "Möten", "Antal licenser": 10, "Aktiva användare": 5, "Pris per licens (SEK/mån)": 150 }
      ],
      projects: [
        { Projekt: "Projekt Alfa", Uppgift: "Rapportskrivning", "Tidsåtgång (timmar)": 50 },
        { Projekt: "Projekt Gamma", Uppgift: "Implementering", "Tidsåtgång (timmar)": 60 }
      ]
    };
    setRaw(JSON.stringify(example, null, 2));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setErr("");
    setResult(null);
    try {
      // Bygg payload i samma format som backend-exemplet förväntar sig
      const payload = {
        licenses: licenses.map((r) => ({
          Leverantör: r.leverantor || "Okänt",
          Kategori: "Programvara",
          "Antal licenser": Number(r.licenser || 0),
          "Aktiva användare": Number(r.aktiva || 0),
          "Pris per licens (SEK/mån)": Number(r.pris || 0),
        })),
        projects: projects.map((r, i) => ({
          Projekt: `Projekt ${i + 1}`,
          Uppgift: r.uppgift || "Uppgift",
          "Tidsåtgång (timmar)": Number(r.timmar || 0),
        })),
      };

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setErr(e.message || "Något gick fel");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeAdmin = async () => {
    try {
      const parsed = JSON.parse(raw);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setErr(e.message || "Fel i admin-analys");
    }
  };

  return (
    <section id="analyze" className="mx-auto max-w-5xl px-4 py-12">
      <h2 className="text-3xl font-bold">Testa AI-analysen</h2>
      <p className="text-slate-600 mt-1">
        Fyll i era licenser och ungefärlig tidsåtgång – klicka <b>Analysera</b>.
      </p>

      {/* Licenser */}
      <div className="mt-6">
        <h3 className="font-semibold">Licenser</h3>
        <div className="mt-2 grid gap-3">
          {licenses.map((row, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-3">
              <input
                className="px-3 py-2 border rounded-xl"
                placeholder="Leverantör (t.ex. Microsoft 365)"
                value={row.leverantor}
                onChange={(e) => updateLicense(i, "leverantor", e.target.value)}
              />
              <input
                className="px-3 py-2 border rounded-xl"
                type="number"
                placeholder="Antal licenser"
                value={row.licenser}
                onChange={(e) => updateLicense(i, "licenser", e.target.value)}
              />
              <input
                className="px-3 py-2 border rounded-xl"
                type="number"
                placeholder="Aktiva användare"
                value={row.aktiva}
                onChange={(e) => updateLicense(i, "aktiva", e.target.value)}
              />
              <input
                className="px-3 py-2 border rounded-xl"
                type="number"
                placeholder="Pris per licens (SEK/mån)"
                value={row.pris}
                onChange={(e) => updateLicense(i, "pris", e.target.value)}
              />
            </div>
          ))}
          <button onClick={addLicense} className="w-max px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200">
            + Lägg till licens
          </button>
        </div>
      </div>

      {/* Tidsåtgång */}
      <div className="mt-8">
        <h3 className="font-semibold">Tidsåtgång</h3>
        <div className="mt-2 grid gap-3">
          {projects.map((row, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-3">
              <input
                className="px-3 py-2 border rounded-xl"
                placeholder="Uppgift (t.ex. Rapportskrivning)"
                value={row.uppgift}
                onChange={(e) => updateProject(i, "uppgift", e.target.value)}
              />
              <input
                className="px-3 py-2 border rounded-xl"
                type="number"
                placeholder="Timmar per månad"
                value={row.timmar}
                onChange={(e) => updateProject(i, "timmar", e.target.value)}
              />
            </div>
          ))}
          <button onClick={addProject} className="w-max px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200">
            + Lägg till uppgift
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-5 py-3 rounded-2xl bg-slate-900 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Analyserar…" : "Analysera"}
        </button>

        {/* Admin-knappar (syns endast med ?admin=1) */}
        {admin && (
          <>
            <button onClick={loadExample} className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200">
              Ladda exempel (admin)
            </button>
            <button onClick={handleAnalyzeAdmin} className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200">
              Analysera rå-JSON (admin)
            </button>
          </>
        )}
      </div>

      {/* Admin-rådata (göms för prospekt) */}
      {admin && (
        <textarea
          className="mt-3 w-full border rounded-xl p-3 font-mono text-xs"
          rows={10}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Klistra in rå JSON här (endast admin)"
        />
      )}

      {err && (
        <div className="mt-4 p-3 rounded-xl border border-red-200 bg-red-50 text-red-700">{err}</div>
      )}

      {/* Resultat – endast snyggt UI */}
      {result && (
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold">Summering</h3>
            <ul className="mt-2 text-sm text-slate-700 space-y-1">
              <li>SEK/år: <b>{fmt.format(result?.totals?.sek_per_year ?? 0)}</b></li>
              <li>Timmar/mån: <b>{fmt.format(result?.totals?.hours_per_month ?? 0)}</b></li>
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
        </div>
      )}
    </section>
  );
}
