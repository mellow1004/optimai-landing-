import * as XLSX from "xlsx";
import React, { useMemo, useState } from "react";

const fmt = new Intl.NumberFormat("sv-SE");
{/* Filuppladdning */}
<div className="mt-4">
  <label className="block text-sm font-medium text-slate-700 mb-1">
    Ladda upp Excel med licenser
  </label>
  <input
    type="file"
    accept=".xlsx,.xls"
    onChange={(e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        
        // Här sätter vi filens data till licenserna
        setLicenses(
          json.map((row) => ({
            leverantor: row["Leverantör"] || "",
            licenser: row["Antal licenser"] || 0,
            aktiva: row["Aktiva användare"] || 0,
            pris: row["Pris per licens (SEK/mån)"] || 0,
          }))
        );
      };
      reader.readAsArrayBuffer(file);
    }}
    className="px-3 py-2 border rounded-xl"
  />
</div>

export default function AnalyzeTest() {
  // Enkel startdata
  const [licenses, setLicenses] = useState([
    { leverantor: "Microsoft 365", licenser: 15, aktiva: 10, pris: 120 },
  ]);
  const [projects, setProjects] = useState([{ uppgift: "Rapportskrivning", timmar: 10 }]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [result, setResult] = useState(null);

  // Admin-läge: öppna sidan med ?admin=1 för att se rå-JSON-fält
  const admin = useMemo(
    () => typeof window !== "undefined" && window.location.search.includes("admin=1"),
    []
  );
  const [raw, setRaw] = useState(""); // endast admin

  // Helpers
  const addLicense = () =>
    setLicenses((l) => [...l, { leverantor: "", licenser: 0, aktiva: 0, pris: 0 }]);
  const addProject = () => setProjects((p) => [...p, { uppgift: "", timmar: 0 }]);

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
      // Bygg payload i samma format som backend väntar sig
      const payload = {
        licenses: licenses.map((r) => ({
          Leverantör: r.leverantor?.trim() || "Okänt",
          Kategori: "Programvara",
          "Antal licenser": Math.max(0, Number(r.licenser || 0)),
          "Aktiva användare": Math.max(0, Number(r.aktiva || 0)),
          "Pris per licens (SEK/mån)": Math.max(0, Number(r.pris || 0)),
        })),
        projects: projects.map((r, i) => ({
          Projekt: `Projekt ${i + 1}`,
          Uppgift: r.uppgift?.trim() || "Uppgift",
          "Tidsåtgång (timmar)": Math.max(0, Number(r.timmar || 0)),
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
        Fyll i era licenser och ungefärlig tidsåtgång – klicka <b>Analysera</b>. Vi räknar ut potential i
        <b> SEK/år</b> och <b>timmar/mån</b> och visar de bäst prioriterade åtgärderna.
      </p>

      {/* -------------------- Licenser -------------------- */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Licenser</h3>
        <p className="text-slate-600 text-sm mt-1">
          <b>Antal licenser</b> = totala köpta platser. <b>Aktiva användare</b> = de som använder verktyget minst 1 gång/månad.
          <b> Pris per licens</b> i SEK per månad.
        </p>

        {/* Kolumnrubriker */}
        <div className="grid md:grid-cols-4 gap-3 mt-4 text-xs text-slate-500">
          <div>Leverantör</div>
          <div>Antal licenser (st)</div>
          <div>Aktiva användare (st)</div>
          <div>Pris per licens (SEK/mån)</div>
        </div>

        {/* Rader */}
        <div className="mt-1 grid gap-3">
          {licenses.map((row, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-3">
              <div>
                <input
                  className="px-3 py-2 border rounded-xl w-full"
                  placeholder="ex. Microsoft 365"
                  value={row.leverantor}
                  onChange={(e) => updateLicense(i, "leverantor", e.target.value)}
                  aria-label="Leverantör"
                />
                <div className="text-xs text-slate-500 mt-1">Exempel: Slack, Zoom, Visma</div>
              </div>

              <div>
                <input
                  className="px-3 py-2 border rounded-xl w-full"
                  type="number"
                  min="0"
                  placeholder="ex. 20"
                  value={row.licenser}
                  onChange={(e) => updateLicense(i, "licenser", Math.max(0, Number(e.target.value || 0)))}
                  aria-label="Antal licenser"
                />
                <div className="text-xs text-slate-500 mt-1">Totalt köpta platser</div>
              </div>

              <div>
                <input
                  className="px-3 py-2 border rounded-xl w-full"
                  type="number"
                  min="0"
                  placeholder="ex. 14"
                  value={row.aktiva}
                  onChange={(e) => updateLicense(i, "aktiva", Math.max(0, Number(e.target.value || 0)))}
                  aria-label="Aktiva användare"
                />
                <div className="text-xs text-slate-500 mt-1">Faktiskt använda platser</div>
              </div>

              <div>
                <input
                  className="px-3 py-2 border rounded-xl w-full"
                  type="number"
                  min="0"
                  placeholder="ex. 120"
                  value={row.pris}
                  onChange={(e) => updateLicense(i, "pris", Math.max(0, Number(e.target.value || 0)))}
                  aria-label="Pris per licens i SEK per månad"
                />
                <div className="text-xs text-slate-500 mt-1">SEK per licens och månad</div>
              </div>
            </div>
          ))}

          <button
            onClick={addLicense}
            className="w-max px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
          >
            + Lägg till licens
          </button>
        </div>
      </div>

      {/* -------------------- Tidsåtgång -------------------- */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold">Tidsåtgång</h3>
        <p className="text-slate-600 text-sm mt-1">
          Återkommande uppgifter ni lägger tid på. <b>Timmar/mån</b> = ungefärligt snitt per månad.
        </p>

        {/* Kolumnrubriker */}
        <div className="grid md:grid-cols-2 gap-3 mt-4 text-xs text-slate-500">
          <div>Uppgift</div>
          <div>Timmar/mån</div>
        </div>

        {/* Rader */}
        <div className="mt-1 grid gap-3">
          {projects.map((row, i) => (
            <div key={i} className="grid md:grid-cols-2 gap-3">
              <div>
                <input
                  className="px-3 py-2 border rounded-xl w-full"
                  placeholder="ex. Rapportskrivning"
                  value={row.uppgift}
                  onChange={(e) => updateProject(i, "uppgift", e.target.value)}
                  aria-label="Uppgift"
                />
                <div className="text-xs text-slate-500 mt-1">Ex: månadsrapport, kundsupport, onboarding</div>
              </div>

              <div>
                <input
                  className="px-3 py-2 border rounded-xl w-full"
                  type="number"
                  min="0"
                  placeholder="ex. 10"
                  value={row.timmar}
                  onChange={(e) => updateProject(i, "timmar", Math.max(0, Number(e.target.value || 0)))}
                  aria-label="Timmar per månad"
                />
                <div className="text-xs text-slate-500 mt-1">Ungefärliga timmar per månad</div>
              </div>
            </div>
          ))}

          <button
            onClick={addProject}
            className="w-max px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200"
          >
            + Lägg till uppgift
          </button>
        </div>
      </div>

      {/* -------------------- Actions -------------------- */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-5 py-3 rounded-2xl bg-slate-900 text-white hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Analyserar…" : "Analysera"}
        </button>

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

      {/* -------------------- Resultat -------------------- */}
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

            {/* CTA efter resultat */}
            <div className="mt-4">
              <a
                href="https://calendly.com/melker-lowenbrand-lmo9/30min"
                className="inline-block px-5 py-3 rounded-2xl bg-slate-900 text-white hover:opacity-90"
              >
                Boka genomgång av resultat
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Integritetssnutt */}
      <p className="mt-8 text-xs text-slate-500">
        Vi sparar inte innehållet du matar in i detta demotest. För pilot/produktion används säkra anslutningar och minimerad datamängd.
      </p>
    </section>
  );
}
