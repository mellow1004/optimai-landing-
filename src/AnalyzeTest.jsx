import React, { useState } from "react";

export default function AnalyzeTest() {
  const [input, setInput] = useState(`{
    "licenses": [
      { "Leverantör":"Microsoft 365","Kategori":"Programvara","Antal licenser":15,"Aktiva användare":10,"Pris per licens (SEK/mån)":120 },
      { "Leverantör":"Slack","Kategori":"Kommunikation","Antal licenser":20,"Aktiva användare":15,"Pris per licens (SEK/mån)":85 }
    ],
    "projects": [
      { "Projekt":"Projekt Alfa","Uppgift":"Rapportskrivning","Tidsåtgång (timmar)":50 }
    ]
  }`);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: input,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Fel vid anrop");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Testa AI-analysen</h2>
      <textarea
        rows={12}
        cols={80}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <button onClick={handleAnalyze}>Analysera</button>

      {result && (
        <pre style={{ background: "#f0f0f0", padding: 10 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
