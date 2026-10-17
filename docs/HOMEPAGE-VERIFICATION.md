# Homepageverbetering — lokale verificatie op 17 oktober 2026

## Inspectie en uitvoering

De bestaande live website en repository zijn vergeleken op homepage, diensten, projecten en contact. Behouden: Astro met statische output, lokale Clash Grotesk, Peak-logo's, zwart/groen, bestaande achtergrond, vijf anonieme caseroutes, metadata/canonical/sitemap en de bestaande Netlify Forms-koppeling. Geen dependencies, trackingdienst of CMS toegevoegd.

De homepage geeft nu concrete taken en controlepunten, vroege verwijzingen naar drie projecten, drie herkenbare problemen, een HTML-procesillustratie met expliciete voorbeelddata, uitgebreidere cases, aanpak met klantinbreng, de bestaande foto en contactpersoon, tien FAQ-antwoorden en een eigen formulier. De gedeelde formuliercomponent wordt ook op `/contact` gebruikt. Reviewcomponent en optionele workflowmedia zijn beschikbaar; zonder echte content worden ze in productie verborgen.

De aannames, bronnen, contentlocaties en bedrijfsafspraken staan in `CONTENT_NEEDED.md`. De ontwikkelserver toont gelabelde placeholders; `npm run preview` toont de productie-output zonder interne contentkeys of reviewplaceholder. Zie de aanvullende verificatie hieronder voor de bewust zichtbare casebeeld- en logoplaceholders.

## Uitgevoerde controles

- Node 24.22.0 en `npm ci` (337 packages; geen auditkwetsbaarheden gemeld).
- `npm run verify`: Astro/TypeScript, volledige statische build, interne verwijzingen, CSS-assets, sitemap en formuliercontract. Laatste resultaat: 12 HTML-pagina's, 266 interne verwijzingen; nul errors, warnings of hints.
- Buildbewaking uitgebreid voor beide formulieren, alle behouden veldnamen en UTM-velden, exact drie verplichte velden en het ontbreken van contentplaceholders of interne documenten in productie.
- Visuele controle desktop 1440 × 1000 en mobiel 390 × 844. Responsieve overflowcontrole op 320, 390, 768 en 1440 px.
- Skiplink, menu met toetsenbord en Escape, focusherstel, CTA-anker, native FAQ en reduced motion gecontroleerd. De skiplink kreeg een focusbaar hoofdinhoudsdoel. De navigatie normaliseert nu ook de statische `/index.html`-route, zodat de homepage-CTA naar het inline formulier gaat.
- Beide formulieren getest op ontbrekende verplichte velden en ongeldig e-mailadres, pending/disabled-status, dubbele inzending, HTTP-fout, netwerkfout, behoud van invoer, retry, succesvolle HTTP-response, fout-/succesfocus en campagne-/interessevelden.
- Acht POST-requests volledig onderschept: zes via JavaScript en twee native formulierinzendingen zonder JavaScript. Geen echte aanvragen, opgeslagen Netlify-records of notificaties veroorzaakt.
- Zonder JavaScript: tekst, procesvoorbeeld, navigatie, FAQ en formulier bruikbaar; native POST via toetsenbord met gesimuleerde ontvangst getest op `/` en `/contact`.
- CTA- en formulier-events op dubbeltelling en afwezigheid van formulierinhoud/persoonsgegevens/UTM-data gecontroleerd. Geen analyticsprovider aangesloten.
- Ontwikkelplaceholders aanwezig op de ontwikkelserver; afwezig op de productiepreview, ook met een preview-queryparameter.
- Geen JavaScript-runtimefouten tijdens de geslaagde browsercontrole. De gesimuleerde HTTP-/netwerkfouten veroorzaken wel de verwachte browsernetwerkmeldingen.
- Mechanische Impeccable-controle: geen deterministische bevindingen.

## Prestaties

Geen video of externe embed wordt geladen zolang er geen goedgekeurd bestand is ingevuld. De homepage gebruikt responsieve WebP-versies van het bestaande hero-beeld: circa 6 KB en 35 KB, tegenover circa 524 KB voor de oorspronkelijke JPEG-fallback. Het portret heeft vaste afmetingen, lazy loading en asynchrone decodering. De gebouwde JS bestaat uit kleine lokale scripts; er is geen frameworkruntime toegevoegd. Er is geen Lighthouse- of veldmetingsscore geclaimd.

## Reproduceren

Gebruik Node 24. Start de devserver met `npm run dev` op poort 4321 en de gebouwde preview met `npm run preview -- --port 4322`. De functionele browsercheck staat in `scripts/verify-browser.cjs` en wordt uitgevoerd met de Playwright CLI:

```sh
playwright-cli open http://127.0.0.1:4322/
playwright-cli run-code --filename scripts/verify-browser.cjs
```

Gebruik eventueel de gebundelde wrapper `~/.codex/skills/playwright/scripts/playwright_cli.sh` via `bash`. Screenshots staan in `output/playwright/` (niet gepubliceerd). De check heeft standaard screenshotopname uit; `capture` kan voor een gebundelde visuele controle ingeschakeld worden.

## Grenzen en vóór publicatie

Er is niets gedeployed. Productie-ontvangst in Netlify Forms en in Maxims mailbox is voor deze wijziging niet getest. Een lokale gesimuleerde succesresponse bewijst die aflevering niet. De eerdere productiecontroles in `docs/LAUNCH.md` horen bij de vorige versie.

Laat de verantwoordelijke de teksten over projectafspraken bevestigen, controleer het bestaande hostingbetaalpunt en voer bij een afzonderlijk gevraagde publicatie de aflevercontrole uit. Klantlogo's, reviews, gemeten resultaten, video en nieuwe foto's zijn optioneel en vereisen echte bronnen/toestemming; de pagina heeft daarvoor al correcte fallbacks.


## Aanvulling: visuele cases, reviewplek en geanimeerde aanpak

Lokale wijziging op 17 oktober 2026, niet gepubliceerd:

- Alle vijf cases hebben een eigen lokale WebP-sfeerfoto in 1280 en 640 px, een logoplaats en expliciete placeholderlabels. Verplichte `image`- en `client`-velden in het contentschema. Dezelfde componenten werken op homepage, overzicht en detailpagina’s.
- De homepage opent na de hero met één groot project en twee compactere visuele cases. De oorspronkelijke dubbele tekstselectie is vervallen. De reviewplek met klein voorbeeldportret staat direct na de cases in development; productie toont alleen goedgekeurde inhoud uit `testimonials`.
- Aanpak wisselt elke 6,5 seconden tussen drie stappen en bouwt een geometrische tekening op. Handmatige keuze en pauzeknop werken; muis, toetsenbordfocus, verborgen tab en buiten-beeldstand stoppen de cyclus. Reduced motion schakelt automatisch wisselen uit; zonder JavaScript blijven alle stappen leesbaar.
- Het offertevoorbeeld staat op donker, de aanpak op licht. Dit doorbreekt de herhaling van gelijkvormige secties. Bestaande Peak-kleuren, fonts en contactformulier blijven behouden.
- `npm ci` uitgevoerd met Node 24.22.0 (aparte tijdelijke npm-cache wegens lokale cachepermissies). `npm run verify`: 12 HTML-pagina’s, 334 interne verwijzingen inclusief `srcset`; geen Astro-/TypeScript-errors, warnings of hints. Buildbewaking controleert ook afwezigheid van de reviewplaceholder in productie.
- Browsercontrole op desktop 1440 × 1000 en mobiel 390 × 844: beelden geladen, geen horizontale overflow, alle vijf detailroutes, overzicht en contact gecontroleerd. Automatisch wisselen, pauzeren, handmatige stapkeuze, bediening met Enter, menu met toetsenbord/Escape en reduced motion geslaagd. Zonder JavaScript zijn drie stappen, drie uitgelichte cases en het formulier aanwezig.
- Primaire homepage-CTA bereikt het inline formulier. Twee lokale POST-requests onderschept: HTTP 500 toont een fout met behoud van invoer; HTTP 200 toont succes. Geen echte inzendingen of notificaties verstuurd. Geen JavaScript-runtimefouten.
- Mechanische Impeccable-detector: geen bevindingen. Desktop en mobiel in één gebundelde inspectie bekeken, gevolgd door één bevestigingsronde.
- Browsercheck voor deze aanvulling: `output/playwright/verify-experience.js`; screenshots met suffix `-final.png` in dezelfde map. Deze lokale hulpmiddelen vallen buiten `dist/`.

Beeldbronnen en instructies voor het vervangen van foto’s, logo’s en review staan in `CONTENT_NEEDED.md`. De gebruiker levert goedgekeurde klantgegevens later aan. De reviewplaceholder is uitsluitend een vormgevingsvoorbeeld en bevat geen klantgetuigenis.


## Aanvulling: React-bentogrid op de homepage

Lokale wijziging op 17 oktober 2026, niet gepubliceerd:

- Het aangeleverde React-voorbeeld is geïntegreerd als `src/components/ui/conditiongrid.tsx`. Astro React-integratie, Tailwind 4 via Vite, Motion, Lucide, React-types en shadcn-mappenconfiguratie zijn toegevoegd. `next/image` is aangepast naar responsieve HTML-afbeeldingen voor Astro; er is geen Next.js-app opgezet.
- De drie bestaande uitgelichte cases vormen een bentogrid: één grote tegel links, twee kleinere rechts. Titels en ontwikkelstatus blijven zichtbaar. Hover of toetsenbordfocus toont logo, samenvatting en de projectlink. Onder 1024px en op touchscreens is alle informatie direct zichtbaar onder de foto.
- Alle inhoud staat in de statische HTML. De React-island hydrateert wanneer het grid in beeld komt en voegt alleen een kleine hoverbeweging toe. Reduced motion schakelt de beweging uit; CSS-interacties werken zonder JavaScript. Tailwind laadt zonder globale Preflight-reset.
- `npm run verify` met Node 24.22.0 geslaagd: 28 gecontroleerde bronbestanden; geen errors, warnings of hints; 12 HTML-pagina’s en 322 gecontroleerde interne verwijzingen. Formuliercontract en routes behouden.
- Gebouwde preview op poort 4322 gecontroleerd op 320, 390, 768, 1024, 1440 en 1920px. Geen horizontale overflow of overlap tussen logo en case-inhoud. Desktophover en toetsenbordfocus onthullen de juiste informatie; Enter opent de juiste caseroute.
- React-hydratatie en Motion-hover werken. Mobiele en brede touchapparaten tonen logo en details zonder hover. Zonder JavaScript werken mobiel lezen en desktophover. Reduced motion, primaire contactroute en het overzicht met vijf cases gecontroleerd. Geen runtimefouten tijdens deze controle. Geen echte formulierinzendingen uitgevoerd.
- Mechanische Impeccable-controle: geen bevindingen. Eén gebundelde visuele inspectie en één bevestigingsronde. Browsercheck: `output/playwright/verify-bento.js`; screenshots `bento-*-final.png` in dezelfde niet-gepubliceerde map.

Setup, componentpaden, props en uitbreiding met de shadcn CLI staan in `README.md`. De bestaande placeholders blijven herkenbaar; echte klantlogo’s en reviews wachten op goedgekeurde gegevens.

De bestaande `scripts/verify-browser.cjs`-controle is eveneens geslaagd: routes, toetsenbord/menu/FAQ, beide formulieren met validatie, fout-, retry- en succespad en native POST zonder JavaScript. Acht requests onderschept; geen echte inzendingen of notificaties. De ontwikkelserver is na de dependencywijziging herstart; React-hydratatie opnieuw bevestigd zonder console- of runtimefouten.
