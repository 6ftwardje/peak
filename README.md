# Peak Automations — main website

Static site (vanilla HTML/CSS/JS), rebuilt from the Webflow design.

## Local preview
```sh
python3 -m http.server 8000
```
Then open http://127.0.0.1:8000

## Structure
- `index.html` — Home
- `cases.html` — Cases (founder + philosophy + selected work)
- `contact.html` — Contact (Netlify Forms)
- `styles.css` — all styling (design tokens at top)
- `script.js` — Lenis smooth scroll + scroll reveals
- `assets/` — fonts (Clash Grotesk), logo, hero background

## Deploy
Static host (Netlify recommended for built-in form handling).
