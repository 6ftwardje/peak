// Secure proxy between the browser and the Google Apps Script webhook.
// The browser NEVER sees GOOGLE_SHEETS_WEBHOOK_URL (it holds the secret ?token=...).
// Set that env var in Netlify → Site settings → Environment variables.

// Hosts allowed to POST to this function (same-origin in production).
// Add your custom domain here once DNS is pointed at Netlify.
const ALLOWED_HOSTS = [
  "call.peak-automations.com",
  "peak-automations.com",
  "www.peak-automations.com",
];

const MAX_BODY = 20 * 1024; // 20 KB cap

const json = (statusCode, obj) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(obj),
});

// Allow requests whose Origin/Referer host is in the allowlist, plus Netlify
// preview subdomains (*.netlify.app) so deploy previews work.
function originAllowed(event) {
  const ref = event.headers.origin || event.headers.referer || "";
  if (!ref) return true; // some browsers omit these on same-origin POST
  try {
    const host = new URL(ref).hostname;
    return ALLOWED_HOSTS.includes(host) || host.endsWith(".netlify.app");
  } catch (e) {
    return false;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { ok: false, reason: "method" });
  if (!originAllowed(event)) return json(403, { ok: false, reason: "origin" });

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhook) return json(500, { ok: false, reason: "not_configured" });

  const raw = event.body || "";
  if (raw.length > MAX_BODY) return json(413, { ok: false, reason: "too_large" });

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (e) {
    return json(400, { ok: false, reason: "bad_json" });
  }

  // Honeypot: real people leave this empty.
  if (payload.hp) return json(200, { ok: true, skipped: "bot" });
  // Consent is required before anything is stored.
  if (payload.consent !== true) return json(200, { ok: false, reason: "no_consent" });

  try {
    // Apps Script /exec responds with a 302 to script.googleusercontent.com;
    // fetch must follow redirects (the default) to read the real JSON body.
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({ ok: false, reason: "upstream_parse" }));
    return json(res.ok ? 200 : 502, data);
  } catch (e) {
    return json(502, { ok: false, reason: "upstream" });
  }
};
