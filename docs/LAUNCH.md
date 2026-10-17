# Livegang Peak Automations — 17 oktober 2026

De nieuwe versie staat live op https://peak-automations.com.

## Afgerond
- AI-consultancy en agentic automatisering als centrale propositie, met diensten, aanpak en vijf bestaande projecten.
- Productiepublicatie op de bestaande Netlify-site: deployment `6ad3a8c1c86e13ecacbc1e06`.
- Homepage, diensten, projecten, contact, privacy, bedankpagina, sitemap en social-sharebeeld bereikbaar; eigen 404 actief.
- HTTP en www verwijzen naar het HTTPS-hoofddomein. DNS en mailinstellingen zijn niet gewijzigd.
- Productie heeft geen preview-noindexheader. Canonical- en Open Graph-URL's gebruiken de publieke adressen zonder `.html`; de buildcontrole bewaakt dit nu expliciet.
- Netlify Forms-naam `wf-form-Formulier`, veldnamen en honeypot behouden. E-mailmelding voor dit specifieke formulier ingeschakeld naar `maxim@peak-automations.com`, onderwerp `Nieuwe aanvraag via Peak Automations`.
- Echte browserinzending via JavaScript op de preview en echte inzending zonder JavaScript op het hoofddomein als geverifieerde inzending teruggevonden in Netlify. Dienstkeuze en, bij de JavaScript-test, campagnevelden ontvangen. Testrecords na controle verwijderd; bestaande inzendingen behouden.
- Privacytekst aangevuld met verantwoordelijke, gegevens, doelen, grondslagen, Netlify/Microsoft 365, internationale doorgiften, bewaartermijncriteria en rechten. Er is geen vaste termijn of juridische audit verzonnen.
- Bedrijfsgegevens bij KBO geverifieerd en gecorrigeerd: **Peak Automations CommV**, ondernemingsnummer **1024.865.574**, btw **BE 1024.865.574**. De oude VOF-vermelding was achterhaald; de rechtsvorm is sinds 8 juni 2026 commanditaire vennootschap.
- `npm run verify` geslaagd: 12 HTML-pagina's, 243 interne verwijzingen, geen Astro-/TypeScript-fouten, waarschuwingen of hints.

## Eén actie voor de accounteigenaar
**Volg de openstaande Netlify-betaling op.** Bij controle op 17 oktober stond het Creative Motion-account op `past_due`, met `days_until_disabled: 26`. De site is actief en beide productiepublicaties zijn geslaagd. Er is geen betaling uitgevoerd en er zijn geen betaalgegevens gewijzigd.

[Netlify billing](https://app.netlify.com/teams/ward-janssen2020/billing)

## E-mail en privacy in de dagelijkse werking
De melding is via de Netlify-API aangemaakt en teruggelezen als actief voor het juiste formulier en adres. Een echte testinzending is opgeslagen terwijl de melding actief was. Ontvangst in Maxims inbox is niet onafhankelijk vastgesteld: deze werkomgeving heeft geen toegang tot die mailbox. De eigenaar kan de technische testmail eventueel ook in ongewenste e-mail controleren.

Pas de bewaartermijncriteria uit de privacyverklaring toe bij het afsluiten van aanvragen, zowel in Netlify Forms als in de mailbox. Verwijder wat niet meer nodig is; houd noodzakelijke offerte-, contract- of bewijsstukken apart. Reageer op privacyverzoeken via het contactadres. De verklaring geldt voor deze website en het contactformulier; latere CRM-, nieuwsbrief- of trackingintegraties vereisen een nieuwe controle.

## Deployment en herstel
```sh
nvm use
npm ci
npm run verify
npx netlify-cli deploy --site 240ceca8-2810-438b-b1d2-5028dce4a391 --dir dist --no-build
# Voor een volgende, gevraagde productiepublicatie:
npx netlify-cli deploy --site 240ceca8-2810-438b-b1d2-5028dce4a391 --dir dist --no-build --prod
```

De productie-deployment en vorige versie staan in `hosting/deployment.json` en `hosting/deployment-before-launch.json`. Herstel indien nodig de vorige productie-deployment `6ad386e2e51c39df176b8385` via Netlify. Formulierinstellingen en notificaties horen bij de site en staan los van een rollback van HTML.

## Outreach-links
```text
https://peak-automations.com/contact?interesse=agentic-automatisering&utm_source=linkedin&utm_medium=outreach&utm_campaign=eerste-gesprek
```
Toegestane interesses: `ai-consultancy`, `agentic-automatisering`, `koppelingen-en-software`. Alleen UTM-waarden op de contact-URL worden meegestuurd; ze worden niet bewaard bij navigatie tussen pagina's. Zonder JavaScript kan het formulier verstuurd worden, maar worden queryparameters niet automatisch ingevuld.

## Verder werken met agents
- Diensten, contactgegevens en FAQ: `src/content/site.ts`.
- Project toevoegen: één Markdown-bestand in `src/content/cases/`; overzicht, detailpagina en sitemap volgen automatisch.
- Campagnepagina: gebruik `BaseLayout`, bestaand bewijs en één contactactie. Verzin geen resultaten of klantnamen.
- Er is nog geen CRM-koppeling, Git-remote of automatische Git-deployment ingesteld. Die zijn geen vereisten voor deze livegang.

## Bronnen en bewijs
- [KBO Public Search](https://kbopub.economie.fgov.be/kbopub/toonondernemingps.html?ondernemingsnummer=1024865574), databanktoestand 16 oktober 2026.
- [AVG, met name artikelen 6, 12 en 13](https://eur-lex.europa.eu/legal-content/NL/TXT/?uri=CELEX:32016R0679).
- [Netlify DPA](https://www.netlify.com/pdf/netlify-dpa.pdf), [verwerkersinformatie](https://www.netlify.com/legal/subprocessors/), [formuliermeldingen](https://docs.netlify.com/manage/forms/notifications/).
- Technisch bewijs: `hosting/form-tests.json`, `hosting/form-notification.json`, `hosting/company-verification.json`, `hosting/account-launch-status.json`, `hosting/production-http-verification.json`.
