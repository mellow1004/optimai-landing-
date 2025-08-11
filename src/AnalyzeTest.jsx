import React, { useState } from "react";

export default function AnalyzeTest() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/analyze");
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult("Fel vid analys: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", marginTop: "20px" }}>
      <h3>Testa AI-analys</h3>
      <button onClick={runAnalysis} disabled={loading}>
        {loading ? "Analyserar..." : "Kör analys"}
      </button>
      {result && (
        <pre style={{ background: "#f4f4f4", padding: "10px", marginTop: "10px" }}>
          {result}
        </pre>
      )}
    </div>
  );
}
