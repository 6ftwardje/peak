# Intake → Google Sheets setup

The intake form saves every submission (including abandoned drafts) into a Google Sheet.
The browser talks to a Netlify Function (`/.netlify/functions/intake`), which holds the secret
webhook URL + token and forwards to a Google Apps Script bound to your Sheet. The secret is never
exposed to the browser.

```
Browser ──POST /.netlify/functions/intake──▶ Netlify Function ──POST (token)──▶ Apps Script ──▶ Sheet
```

## 1. Create the Google Sheet + Apps Script

1. Create a new Google Sheet, name it **Intakes**.
2. **Extensions → Apps Script**.
3. Delete the boilerplate and paste the contents of [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
4. At the top, replace `REPLACE_WITH_A_LONG_RANDOM_TOKEN` with a long random string
   (e.g. run `openssl rand -hex 24` or use a password generator). Keep it secret.
5. In the editor's function dropdown pick **setupSheet** and click **Run**. Approve the permission
   prompt the first time. This creates the `Intakes` tab with all column headers.

## 2. Deploy the Apps Script as a web app

1. **Deploy → New deployment → (gear) Web app**.
2. **Execute as: Me**.
3. **Who has access: Anyone**  (the `?token=` is the real auth; anonymous access lets the Netlify
   server call it).
4. **Deploy**, authorise, and **copy the Web app URL** — it ends in `/exec`.
5. Append your token: `https://script.google.com/macros/s/AKfy.../exec?token=YOUR_LONG_RANDOM_TOKEN`.

> To update the script later, use **Deploy → Manage deployments → edit (pencil) → New version** so
> the `/exec` URL stays the same.

## 3. Point the site at it (Netlify)

1. Netlify → your site → **Site settings → Environment variables → Add**.
2. Key: `GOOGLE_SHEETS_WEBHOOK_URL`  ·  Value: the full `/exec?token=...` URL from step 2.5.
3. Redeploy the site so the function picks up the variable.

That's it. The Calendly link is public and already set in `script.js` (`CALENDLY_URL`).

## 4. Verify

- Open the site, click **Let's talk**, fill a couple of steps, close it → a **draft** row appears in
  the Sheet within a second.
- Finish the intake → the row's `status` flips to **new**.
- Click **Ik plan nu een gesprek** → `status` becomes **calendly_opened** and Calendly opens with the
  name + email prefilled.
- Click **Laat mij eerst contacteren** → `status` becomes **follow_up_requested**.

## Columns written

`updated_at, created_at, intake_id, last_seq, status, follow_up_status, consent, source, step,`
`name, email, phone, company, website, role, business, team_size, time_loss, tools, ai_experience,`
`timeline, budget`

- One row per `intake_id`; every step updates the same row (never a new row).
- Out-of-order/late saves can't overwrite newer data (`last_seq` guard); completed/booking statuses
  always win.

## Optional: mark real bookings (`appointment_booked`)

Calendly can notify you when a call is actually booked. To flip a row to `appointment_booked`:

1. Calendly → **Integrations → Webhooks** (or the API) → subscribe to `invitee.created`, pointing at
   a second small endpoint (a new Netlify function or Apps Script `doPost` branch).
2. Match on the invitee email, find the row, set `status = appointment_booked`.

This is optional and not required for the intake to work.

## Email notifications (Resend)

When an intake completes, the function sends two emails via [Resend](https://resend.com): a
notification to you and a confirmation to the visitor (with Instagram + TikTok links). Setup:

1. Create a free Resend account.
2. **Add a domain** → `peak-automations.com`. Resend shows a few DNS records (SPF/DKIM, DMARC).
   Add them at your DNS host (Combell) and wait until Resend shows the domain **Verified**.
   Until verified, Resend can only send to your own address, not to visitors.
3. Create an **API key** (Resend → API Keys).
4. Netlify → Site settings → Environment variables → add `RESEND_API_KEY` = that key → redeploy.
5. Re-deploy the Apps Script (**Manage deployments → edit → New version**) so the new `emailed`
   column + `first_new` flag are live, and re-run `setupSheet()` once.

The sending address is `maxim@peak-automations.com` (set in `netlify/functions/intake.js`, constant
`FROM`); replies to the visitor confirmation go to that mailbox. Emails fire exactly once per intake
(the `emailed` column guards against the front-end's retry).

## Notes

- **Get email alerts too (optional):** add `MailApp.sendEmail('maxim@peak-automations.com', 'New
  intake', JSON.stringify(payload))` inside `doPost` when `status === 'new'`.
- **GDPR:** abandoned drafts contain real personal data of people who consented but didn't finish.
  The privacy policy (`privacy.html`) covers this; delete old drafts periodically.
- **Rotate the token** by changing it in `Code.gs` and in the Netlify env var together.
