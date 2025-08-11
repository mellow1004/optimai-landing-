import React, { useState } from "react";

export default function App() {
  const [cookieOk, setCookieOk] = useState(false);
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />
      <Hero />
      <SocialProof />
      <HowItWorks />
      <Benefits />
      <Integrations />
      <PilotOffer />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
      {!cookieOk && (
        <div className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-50 max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-lg p-4 md:p-5">
          <h3 className="font-semibold text-lg">Cookies & integritet</h3>
          <p className="text-sm text-slate-600 mt-1">
            Vi använder endast nödvändiga cookies för att sidan ska fungera. När du klickar
            "Godkänn" sparar vi ditt val i din webbläsare. Läs mer i vår{" "}
            <a href="#privacy" className="underline">Integritetspolicy</a>.
          </p>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setCookieOk(true)} className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Godkänn</button>
            <button onClick={() => setCookieOk(true)} className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200">Endast nödvändiga</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Navbar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-x
