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

// ---- Email (Resend) ----
const FROM = "Peak Automations <maxim@peak-automations.com>";
const NOTIFY_TO = "maxim@peak-automations.com"; // where intake notifications land
const REPLY_TO = "maxim@peak-automations.com";
const CALENDLY = "https://calendly.com/maxim-peak-automations/30min";
const IG = "https://www.instagram.com/maxim.vandycke/";
const TIKTOK = "https://www.tiktok.com/@maxim.vandycke";

const isEmail_ = (v) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const firstName_ = (v) => (String(v || "there").trim().split(/\s+/)[0] || "there");
const esc_ = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const NOTIF_FIELDS = [
  ["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["company", "Company"],
  ["website", "Website"], ["role", "Role"], ["business", "Business"], ["team_size", "Team size"],
  ["time_loss", "Time/money lost"], ["tools", "Tools"], ["ai_experience", "AI experience"],
  ["timeline", "Timeline"], ["budget", "Budget"],
];

function notificationHtml_(payload) {
  const a = payload.answers || {};
  const rows = NOTIF_FIELDS.filter(([k]) => a[k]).map(([k, label]) =>
    `<tr><td style="padding:4px 14px 4px 0;color:#7b766c;vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:4px 0;">${esc_(a[k])}</td></tr>`
  ).join("");
  const meta =
    `<tr><td style="padding:4px 14px 4px 0;color:#7b766c;">Source</td><td style="padding:4px 0;">${esc_(payload.source || "")}</td></tr>` +
    `<tr><td style="padding:4px 14px 4px 0;color:#7b766c;">Intake ID</td><td style="padding:4px 0;color:#7b766c;font-size:12px;">${esc_(payload.intake_id || "")}</td></tr>`;
  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#111;font-size:14px;">
    <h2 style="font-size:18px;margin:0 0 14px;">New intake completed</h2>
    <table style="border-collapse:collapse;font-size:14px;line-height:1.5;">${rows}${meta}</table>
  </div>`;
}

function confirmationHtml_(a) {
  const name = esc_(firstName_(a.name));
  const company = a.company ? esc_(a.company) : "your business";
  return `<div style="background:#f4f1ea;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#111;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px 28px;">
      <p style="margin:0 0 18px;font-size:16px;line-height:1.55;">Hi ${name},</p>
      <p style="margin:0 0 18px;font-size:16px;line-height:1.55;">Thanks for filling in the intake. I'll go through it, look at where AI actually fits for ${company}, and get back to you personally.</p>
      <p style="margin:0 0 22px;font-size:16px;line-height:1.55;">No rush on your end. If you'd rather lock in a time now:</p>
      <p style="margin:0 0 28px;"><a href="${CALENDLY}" style="display:inline-block;background:#20e383;color:#04140b;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:10px;font-size:15px;">Book a call</a></p>
      <p style="margin:0 0 10px;font-size:16px;line-height:1.55;">In the meantime, this is where I break down what I build for businesses, and how:</p>
      <p style="margin:0 0 24px;font-size:16px;line-height:1.9;">
        <a href="${IG}" style="color:#0a7d47;font-weight:700;text-decoration:none;">Instagram</a> &nbsp;&middot;&nbsp;
        <a href="${TIKTOK}" style="color:#0a7d47;font-weight:700;text-decoration:none;">TikTok</a>
      </p>
      <p style="margin:0;font-size:16px;line-height:1.55;">Talk soon,<br>Maxim<br><span style="color:#7b766c;">Peak Automations</span></p>
    </div>
  </div>`;
}

async function resendSend_(msg) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(msg),
  });
  if (!res.ok) throw new Error("resend_" + res.status);
}

// Fire the two emails once, when an intake first reaches "new". Best-effort:
// a failure here must never fail the (already saved) intake.
async function sendEmails_(payload) {
  if (!process.env.RESEND_API_KEY) return;
  const a = payload.answers || {};
  const tasks = [];

  tasks.push(resendSend_({
    from: FROM,
    to: [NOTIFY_TO],
    reply_to: isEmail_(a.email) ? a.email : REPLY_TO, // reply straight to the prospect
    subject: `New intake: ${a.name || "unknown"}${a.company ? ", " + a.company : ""}`,
    html: notificationHtml_(payload),
  }));

  if (isEmail_(a.email)) {
    tasks.push(resendSend_({
      from: FROM,
      to: [a.email],
      reply_to: REPLY_TO,
      subject: `Thanks ${firstName_(a.name)}, I'll be in touch`,
      html: confirmationHtml_(a),
    }));
  }

  await Promise.allSettled(tasks);
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

    // Send the notification + confirmation once, the first time this intake completes.
    if (res.ok && data && data.ok && data.first_new === true) {
      try {
        await sendEmails_(payload);
      } catch (e) {
        // Intake is already saved; email is best-effort. Never fail the response for it.
      }
    }

    return json(res.ok ? 200 : 502, data);
  } catch (e) {
    return json(502, { ok: false, reason: "upstream" });
  }
};
