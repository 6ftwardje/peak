# Mascotte op de homepage

Uitgewerkt op 17 oktober 2026 met de door de eigenaar aangeleverde character sheet. Drie Higgsfield-generaties met GPT Image 2.5, high, 2k, 3:4 en transparante achtergrond. Iedere generatie gebruikte daadwerkelijk dezelfde geüploade afbeeldingsreferentie. Alle drie de eerste outputs zijn na controle aanvaard; er zijn geen extra varianten gegenereerd.

| Sectie | Communicatiedoel en pose | Compositie |
| --- | --- | --- |
| Hero | Vriendelijke, competente introductie; driekwart naar links met een ingetogen presentatiegebaar | Rechts van de tekst, maximaal 420 px breed inclusief transparante marge; tekst en primaire CTA blijven dominant |
| Diensten | Verbonden systemen begrijpelijk maken; drie abstracte modules met groene verbindingen | Naast de takenlijst op desktop; op tablet en mobiel compact naast de introductie |
| Contact | Uitnodigen tot een gesprek; open hand naar het formulier rechts | Naast de contactgegevens, maximaal 180 px; het formulier blijft vrij |

Projecten, Maxim en FAQ krijgen geen extra mascotte. Het bestaande projectbeeld en de echte contactpersoon behouden hun eigen rol. De inhoud en het formuliercontract zijn behouden. Er is geen nieuwe animatie of clientruntime toegevoegd.

## Assets en hergebruik

- `assets/mascot/reference.png`: ongewijzigde referentie.
- `assets/mascot/originals/`: originele PNG-outputs van Higgsfield, 1744 × 2336 pixels met echte alpha.
- `assets/mascot/generations.json`: volledige prompts, modelinstellingen, referentie-ID, job-ID en sectie per pose.
- `scripts/prepare-mascot.mjs`: reproduceerbare alpha-controle, resizing en WebP-encoding via de reeds aanwezige Sharp-afhankelijkheid. Uitvoeren met `node scripts/prepare-mascot.mjs` onder Node 24.
- `public/images/mascot/`: uitsluitend geoptimaliseerde lokale webbestanden; 18–123 KiB per variant. Originelen en prompts worden niet mee gepubliceerd.
- `src/components/Mascot.astro`: gedeelde statische picture-component, responsive bronnen, vaste beeldverhouding, lege alt-tekst. De afbeeldingen ondersteunen inhoud die volledig in tekst staat.

De hero laadt eager; diensten en contact lazy. Tot en met 1000 px worden de decoratieve hero- en contactpose verborgen en kiest picture een transparante SVG van 1 pixel. De browser haalt dan die grote beelden niet op. De dienstenpose blijft zichtbaar op 136 px op tablet en 112 px op mobiel. WebP behoudt de alpha; de PNG's worden niet opnieuw uitgesneden of van een andere achtergrond voorzien.

## Controle

- Alle drie de silhouetten naast elkaar op donker `#040404` en licht `#eef0e9` beoordeeld: geen ingebakken achtergrond, zichtbare matte-randen, afgebroken handen/voeten, extra ledematen of grote afwijkingen in verhoudingen. Kleuren, hoofdvorm, materialen en belichting sluiten aan op de referentie. Beoordeling is visueel; generatie blijft een interpretatie van de sheet.
- Browsercontrole van de gebouwde site op 320, 390, 768, 1024, 1440 en 1920 px: geen horizontale overflow; primaire hero-CTA zichtbaar binnen de eerste 900 px. Desktop, tablet en mobiel visueel nagekeken. Op tablet is de uitleg boven de takenlijst geplaatst om smalle tekstkolommen te voorkomen.
- Toetsenbord: skiplink, mobiel menu openen, Escape met focusterugkeer, primaire CTA naar het formulier en tabvolgorde van de velden.
- Zonder JavaScript: kop, alle taken, native formulier en FAQ leesbaar/bruikbaar.
- Homepageformulier: uitsluitend onderschepte lokale POST-requests. Een 500-response behoudt de invoer; tijdens wachten is geen succes zichtbaar; pas na een gesimuleerde 200-response verschijnt succes met focus. Geen echte inzending of notificatie verstuurd. `/contact?interesse=agentic-automatisering` kiest de juiste dienst.
- Mobiele controle met DPR 2 en reduced motion: uitsluitend `empty.svg` en `workflow-320.webp` opgehaald voor de mascotte; hero en contact niet. Lokale gemeten CLS tijdens laden en scrollen naar diensten: 0. Dit is een lokale browsermeting, geen productiebenchmark.
- `npm ci` uitgevoerd met Node 24 en een afzonderlijke tijdelijke npm-cache wegens rechten op de bestaande systeemcache. `npm run verify`: 29 bronbestanden zonder errors/warnings/hints; 12 HTML-pagina's en 308 interne verwijzingen gecontroleerd, inclusief het Netlify-formuliercontract. Impeccable-detector: geen bevindingen.

Controlebeelden en lokale browserresultaten staan in de genegeerde map `output/playwright/`. Deze oplevering is lokaal en niet gepubliceerd.
