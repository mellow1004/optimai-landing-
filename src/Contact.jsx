import React from "react";

function Contact() {
  return (
    <section id="contact" className="py-12 px-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Boka 30-min demo</h2>
      <p className="text-slate-700 mb-6">
        Fyll i formuläret så skickas du vidare till bokningssidan.
      </p>

      <form
        action="https://formspree.io/f/xqalwjoy"
        method="POST"
        className="space-y-4"
      >
        {/* Dolda fält */}
        <input
          type="hidden"
          name="_subject"
          value="Ny demo-förfrågan från OptimAI"
        />
        <input type="hidden" name="_redirect" value="/thanks.html" />

{/* Enkel spamfälla (användare ser inte detta fält) */}
<input
  type="text"
  name="honeypot"
  style={{ display: "none" }}
  tabIndex="-1"
  autoComplete="off"
/>

        />

        {/* Synliga fält */}
        <label className="block">
          Din e-post
          <input
            type="email"
            name="email"
            required
            className="mt-1 border border-slate-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="namn@foretag.se"
          />
        </label>

        <label className="block">
          Meddelande (valfritt)
          <textarea
            name="message"
            rows={4}
            className="mt-1 border border-slate-300 p-3 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300"
            placeholder="Berätta kort vad ni vill fokusera på"
          />
        </label>

        <button
          type="submit"
          className="bg-slate-900 text-white px-5 py-3 rounded-2xl hover:opacity-90"
        >
          Skicka & gå till bokning
        </button>
      </form>

      <p className="text-sm text-slate-500 mt-4">
        Genom att skicka godkänner du vår hantering av uppgifter enligt
        Integritetspolicyn.
      </p>
    </section>
  );
}

export default Contact;
