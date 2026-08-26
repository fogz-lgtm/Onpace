// OnPace API proxy — Cloudflare Worker
// Keeps your Anthropic API key off the client. Deploy this, add your key as a
// secret named ANTHROPIC_API_KEY, then paste the worker URL into index.html.
const CORS = {
  "Access-Control-Allow-Origin": "*", // optionally lock to "https://YOURUSER.github.io"
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS });
    }
    if (request.method !== "POST") {
      return new Response("POST only", { status: 405, headers: CORS });
    }
    const body = await request.text();
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body,
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...CORS, "content-type": "application/json" },
    });
  },
};
