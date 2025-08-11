import React from "react";

function Contact() {
  return (
    <section id="contact" className="py-12 px-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Kontakta oss</h2>
      <form
        action="https://formspree.io/f/xqalwjoy"
        method="POST"
        className="space-y-4"
      >
        <label className="block">
          Din e-post:
          <input
            type="email"
            name="email"
            required
            className="border p-2 w-full rounded"
          />
        </label>
        <label className="block">
          Meddelande:
          <textarea
            name="message"
            required
            className="border p-2 w-full rounded"
          ></textarea>
        </label>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Skicka
        </button>
      </form>
    </section>
  );
}

export default Contact;
