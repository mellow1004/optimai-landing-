import React, { useState } from "react";
import AnalyzeTest from "./AnalyzeTest";

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

      {/* ⬇️ Nytt: testkomponenten för AI-analysen visas här */}
      <AnalyzeTest />

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
          <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">O</div>
          <span className="font-semibold">OptimAI</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <a href="#how" className="hover:text-slate-900">Så funkar det</a>
          <a href="#benefits" className="hover:text-slate-900">Fördelar</a>
          <a href="#pricing" className="hover:text-slate-900">Priser</a>
          <a href="#faq" className="hover:text-slate-900">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="https://calendly.com/melker-lowenbrand-lmo9/30min" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm hover:opacity-90">Boka 15-min demo</a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-slate-100 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-slate-100 blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Upptäck dolda besparingar med <span className="text-slate-900">svensk AI</span>
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            OptimAI analyserar era arbetsflöden och pengaflöden och ger konkreta åtgärder
            som sparar tid och pengar – på bara några veckor.
          </p>
          <ul className="mt-6 space-y-2 text-slate-700">
            <li>• Pilot med garanti: hittar vi inte minst <b>50 000 kr</b> i potential → <b>gratis</b>.</li>
            <li>• Klara rekommendationer i SEK och timmar – inte bara dashboards.</li>
            <li>• Integrerar med Fortnox/Visma, HubSpot och Asana/Trello.</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="px-5 py-3 rounded-2xl bg-slate-900 text-white hover:opacity-90">Boka 15-min demo</a>
            <a href="#pilot" className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200">Starta pilot</a>
          </div>
        </div>
        <div className="md:pl-8">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-6">
            <h3 className="font-semibold text-lg">Snabb översikt</h3>
            <p className="text-slate-600 mt-1">Så här ser en typisk åtgärdsrapport ut:</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-slate-900"/> Konsolidera 3 licenser → spara <b>120 000 kr/år</b>.</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-slate-900"/> Automatisera månadsrapport → frigör <b>15 h/mån</b>.</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-slate-900"/> Förhandla betalvillkor → frigör <b>300 000 kr</b> i kassaflöde.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const cards = [
    { kpi: "2–4 veckor", label: "till första resultat" },
    { kpi: "50 000 kr", label: "garanterad potential annars gratis" },
    { kpi: "3–5", label: "konkreta åtgärdsförslag/leverans" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 p-6">
            <div className="text-2xl font-bold">{c.kpi}</div>
            <div className="text-slate-600">{c.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "Koppla dina system", text: "Fortnox/Visma, HubSpot och Asana/Trello. Read-only via säkra API-anslutningar." },
    { title: "AI-analys", text: "Vi identifierar kostnadsdrivare, tidstjuvar och flaskhalsar – och räknar hemvärde i SEK och timmar." },
    { title: "Åtgärdsplan", text: "Du får 3–5 prioriterade rekommendationer och en 30-min genomgång. Löpande uppföljning vid abonnemang." },
  ];
  return (
    <section id="how" className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold">Så funkar det</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="rounded-2xl bg-white border border-slate-200 p-6">
              <div className="h-10 w-10 rounded-xl bg-slate-900 text-white grid place-items-center font-semibold">{i+1}</div>
              <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
              <p className="mt-1 text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const list = [
    "Snabb payoff: se värde inom 2–4 veckor",
    "Klar ROI i kronor och timmar",
    "Minimal insats för ditt team",
    "GDPR-först: minimerad datamängd och krypterade anslutningar",
  ];
  return (
    <section id="benefits" className="mx-auto max-w-7xl px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold">Varför OptimAI?</h2>
          <p className="mt-3 text-slate-700">
            Alla har data – få har tid att hitta åtgärderna. Vi levererar konkreta beslut, inte bara diagram.
          </p>
          <ul className="mt-6 space-y-2 text-slate-700">
            {list.map((i) => <li key={i}>• {i}</li>)}
          </ul>
        </div>
        <div className="rounded-3xl border border-slate-200 p-6">
          <h3 className="font-semibold">Exempelutfall</h3>
          <ul className="mt-3 text-sm space-y-2">
            <li>• Konsolidera verktyg → spara 8–15% av mjukvarukostnad</li>
            <li>• Automatisera rapportering → frigör 10–20 h/månad</li>
            <li>• Betalvillkor → +200–400 tkr i kassaflöde</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function Integrations() {
  const logos = ["Fortnox", "Visma", "HubSpot", "Asana", "Trello"];
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-3xl font-bold">Integrerar med</h2>
        <p className="text-slate-600 mt-2">Fler integrationer läggs till löpande.</p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {logos.map((l) => (
            <div key={l} className="h-16 rounded-2xl border border-slate-200 grid place-items-center bg-white text-slate-600">
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PilotOffer() {
  return (
    <section id="pilot" className="mx-auto max-w-7xl px-4 py-16">
      <div className="rounded-3xl bg-slate-900 text-white p-8 md:p-10">
        <h2 className="text-3xl font-bold">Pilot med garanti</h2>
        <p className="mt-2 text-slate-200">
          Hittar vi inte minst <b>50 000 kr</b> i möjlig besparing/effektivisering på 2–4 veckor –
          du betalar <b>inget</b>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#contact" className="px-5 py-3 rounded-2xl bg-white text-slate-900 hover:opacity-90">Boka 15-min demo</a>
          <a href="#contact" className="px-5 py-3 rounded-2xl bg-white/10 border border-white/30 hover:bg-white/5">Starta pilot</a>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-3xl font-bold">Priser</h2>
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-lg">Pilot</h3>
            <div className="mt-2 text-3xl font-bold">5 000–10 000 kr</div>
            <ul className="mt-4 text-slate-700 space-y-2 text-sm">
              <li>• 2–4 veckors analys</li>
              <li>• 3–5 åtgärdsförslag med beräknad besparing</li>
              <li>• 30-min genomgång</li>
            </ul>
            <a href="#contact" className="mt-6 inline-block px-5 py-3 rounded-2xl bg-slate-900 text-white hover:opacity-90">Starta pilot</a>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-lg">Prenumeration</h3>
            <div className="mt-2 text-3xl font-bold">2 500–5 000 kr/mån</div>
            <ul className="mt-4 text-slate-700 space-y-2 text-sm">
              <li>• Månadsanalys och uppföljning</li>
              <li>• Löpande rekommendationer</li>
              <li>• Prioriteringsstöd</li>
            </ul>
            <a href="#contact" className="mt-6 inline-block px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900">Boka demo</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Behöver vi dela känslig data?", a: "Vi börjar med kostnadsposter, tidsrapporter och processdata. Persondata minimeras och anslutningar är krypterade." },
    { q: "Hur snabbt ser vi resultat?", a: "Vanligtvis inom 2–4 veckor från onboarding." },
    { q: "Vilka system stöds?", a: "Fortnox, Visma, HubSpot, Asana/Trello vid start. Fler läggs till löpande." },
    { q: "Är vi låsta?", a: "Nej, piloten är fristående. Ni väljer själva om ni vill fortsätta som prenumeration." },
    { q: "GDPR?", a: "Ja – vi följer GDPR, använder krypterade anslutningar och lagrar minsta möjliga datamängd." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-7xl px-4 py-16">
      <h2 className="text-3xl font-bold">FAQ</h2>
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {items.map((it) => (
          <div key={it.q} className="rounded-2xl border border-slate-200 p-6">
            <h3 className="font-semibold">{it.q}</h3>
            <p className="mt-2 text-slate-700">{it.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-3xl font-bold">Boka 15-min demo</h2>
        <p className="mt-2 text-slate-700">
          Fyll i formuläret så återkommer vi med kalenderlänk. Alternativt: maila
          <a href="mailto:hello@dindoman.se" className="underline"> hello@dindoman.se</a>.
        </p>
        <form method="POST" action="ACTION_URL_REPLACE_ME" className="mt-6 grid grid-cols-1 gap-4">
          <input name="namn" required placeholder="Ditt namn" className="px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none" />
          <input name="email" type="email" required placeholder="E-post" className="px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none" />
          <input name="foretag" placeholder="Företag" className="px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none" />
          <div className="grid md:grid-cols-2 gap-4">
            <select name="system" className="px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none">
              <option>Nuvarande system</option>
              <option>Fortnox</option>
              <option>Visma</option>
              <option>HubSpot</option>
              <option>Asana</option>
              <option>Trello</option>
              <option>Annat</option>
            </select>
            <select name="mål" className="px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none">
              <option>Huvudmål</option>
              <option>Spara pengar</option>
              <option>Frigöra tid</option>
              <option>Öka vinst</option>
            </select>
          </div>
          <textarea name="beskrivning" rows={4} placeholder="Beskriv kort er situation eller utmaning" className="px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none" />
          <label className="text-sm text-slate-600 flex items-start gap-2">
            <input type="checkbox" required className="mt-1" /> Jag godkänner att OptimAI lagrar mina uppgifter för att kunna kontakta mig enligt Integritetspolicyn.
          </label>
          <button className="mt-2 px-5 py-3 rounded-2xl bg-slate-900 text-white hover:opacity-90">Skicka</button>
        </form>

        <div id="privacy" className="mt-12">
          <h3 className="font-semibold text-lg">Kort integritetspolicy (sammanfattning)</h3>
          <p className="text-sm text-slate-600 mt-2">
            Vi samlar in kontaktuppgifter och uppgifter om era system i syfte att boka demo och starta pilot.
            Rättslig grund: berättigat intresse/samtycke. Vi delar inte dina uppgifter med tredje part för
            marknadsföring. Full policy & villkor skickas på begäran och publiceras inför lansering.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-600 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold text-slate-900">OptimAI</div>
          <p className="mt-2">AI-driven affärsoptimering för svenska SME-bolag.</p>
        </div>
        <div>
          <div className="font-semibold text-slate-900">Kontakt</div>
          <a href="mailto:hello@dindoman.se" className="underline">hello@dindoman.se</a>
        </div>
        <div>
          <div className="font-semibold text-slate-900">Länkar</div>
          <ul className="mt-2 space-y-1">
            <li><a href="#faq" className="underline">FAQ</a></li>
            <li><a href="#privacy" className="underline">Integritet</a></li>
            <li><a href="#pricing" className="underline">Priser</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-slate-500 pb-8">© {new Date().getFullYear()} OptimAI. Alla rättigheter förbehållna.</div>
    </footer>
  );
}
