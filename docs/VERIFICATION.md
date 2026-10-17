# Controle van de ombouw

Uitgevoerd op 17 oktober 2026 met Astro 7.4.0 en Node 24.19.0.

- `npm run verify`: geslaagd, 0 TypeScript-/Astro-fouten, waarschuwingen of hints; 12 HTML-pagina's en 243 interne verwijzingen gecontroleerd, inclusief assets, ankers, sitemap en het Netlify-formuliercontract.
- `npm audit --audit-level=low`: 0 gemelde kwetsbaarheden.
- Browser: homepage, diensten, projecten, projectdetail, contact, privacy, bedankpagina en 404 bekeken. Desktop- en mobiele screenshots staan lokaal in `output/playwright/` (niet gepubliceerd).
- Geen horizontale overflow op de hoofdpagina's bij 320, 390, 768, 1024 en 1440px breedte.
- Mobiel menu opent; Escape sluit het menu en brengt focus terug naar de knop.
- Navigatie is zichtbaar zonder JavaScript. Verminderde beweging schakelt de hero-animatie uit.
- Formulier: Nederlandse verplichte-veldvalidatie, gesimuleerde 503-fout met behoud van invoer, geslaagde retry, blokkering van dubbele verzending en interesse-/UTM-velden gecontroleerd met onderschepte requests. Geen echte lead aangemaakt tijdens deze lokale controle.
- Mechanische ontwerpdetector op pagina's, componenten en CSS: geen meldingen.
- Netlify-draftdeploy gecontroleerd: homepage, diensten, projecten, projectdetail, contact, privacy, sitemap en social-sharebeeld geven HTTP 200; onbekende pagina geeft de eigen 404. Preview heeft `X-Robots-Tag: noindex`. Netlify heeft het formulier verwerkt (detectie-attributen verwijderd, formuliernaam en hidden `form-name` behouden). Ontvangst van een echte inzending en notificaties zijn hiermee niet getest.
- Hoofddomein na previewpublicatie gecontroleerd: vorige productieversie blijft actief.

De social-shareafbeelding is een browserrender van de eigen homepage met de bestaande Peak-assets; geen stockfoto of AI-generatie. Overige afbeeldingen en fonts komen uit de bewaarde Webflow-export.

## Productielancering, 17 oktober 2026

- Productie-deployment `6ad3a8c1c86e13ecacbc1e06` staat op peak-automations.com; oude productie-deployment voor herstel bewaard.
- Privacytekst en KBO-bedrijfsgegevens afgerond. Actuele rechtsvorm: CommV; btw BE 1024.865.574.
- Volledige verificatie opnieuw geslaagd na de inhoudelijke wijzigingen. De canonicalcontrole bewaakt nu exact de publieke route, ook wanneer Astro tijdens een file-build een `.html`-pad gebruikt.
- HTTP- en www-doorverwijzing naar HTTPS getest. Live hoofdpagina's, sitemap en social-sharebeeld geven 200; onbekende pagina geeft 404. Productie heeft geen noindexheader. Canonicals komen overeen met de sitemap.
- Echte JavaScript-inzending op de preview als geverifieerde aanvraag teruggevonden in Netlify, inclusief interesse en campagnevelden.
- Echte browserinzending zonder JavaScript op het productiedomein als geverifieerde aanvraag teruggevonden in Netlify; eigen bedankpagina getoond. Interesse handmatig gekozen; queryvelden worden zonder JavaScript niet automatisch ingevuld.
- Alleen de twee eigen lancerings-testrecords na controle verwijderd. De twee bestaande inzendingen blijven behouden. Bewijs met markers en record-ID's staat in `hosting/form-tests.json`.
- Formulierspecifieke e-mailmelding naar maxim@peak-automations.com aangemaakt en actief teruggelezen.
- Privacy en gewijzigde footer op desktop en mobiel bekeken; geen horizontale overflow. Live screenshots en successtaten staan in `output/playwright/`.

## Grenzen en opvolging

Ontvangst door Netlify Forms is echt getest. E-mailmeldingen zijn ingeschakeld, maar aflevering in Maxims inbox is niet onafhankelijk bevestigd omdat deze werkomgeving geen toegang tot die mailbox heeft.

Het Netlify-account staat op `past_due`, met 26 dagen tot mogelijke uitschakeling bij de controle. De site en publicaties werken. De accounteigenaar moet de openstaande betaling opvolgen; er is geen betaling uitgevoerd. Zie `LAUNCH.md`.
