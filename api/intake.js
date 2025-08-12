// /api/intake.js
import { Redis } from "@upstash/redis";

export const config = { runtime: "edge" };

// Initiera Redis med miljövariabler
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req) {
  if (req.method === "POST") {
    // Om du vill skydda med en INTAKE_KEY
    const auth = req.headers.get("authorization") || "";
    if (process.env.INTAKE_KEY && !auth.endsWith(process.env.INTAKE_KEY)) {
      return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), { status: 401 });
    }

    // Läs data från request
    const body = await req.json();
    const account = String(body.account || "default");
    const key = `intake:${account}`;

    // Spara i Redis
    await redis.set(key, body);

    return new Response(JSON.stringify({ ok: true, stored: true }), { status: 200 });
  }

  if (req.method === "GET") {
    const urlParams = new URL(req.url).searchParams;
    const account = urlParams.get("account") || "default";
    const key = `intake:${account}`;

    // Hämta från Redis
    const data = await redis.get(key);

    return new Response(JSON.stringify({ ok: true, data }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
}
