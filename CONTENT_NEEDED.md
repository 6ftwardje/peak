# Aan te leveren en te bevestigen inhoud

Deze homepage bouwt voort op de bestaande projectteksten en contactgegevens. Er zijn geen nieuwe klantnamen, resultaten, reviews, tarieven of teamkwalificaties ingevuld. De site blijft bruikbaar zolang onderstaande optionele content ontbreekt.

## Weergave en invullen

- Productie (`npm run build`): de gevraagde tijdelijke casefoto’s en logoplaatsen zijn zichtbaar en gelabeld. De reviewplaceholder, interne contentkeys en lege videospelers worden niet gepubliceerd.
- Ontwikkelpreview: start `npm run dev` en open de lokale URL uit de terminal. In development staat de reviewplaceholder met voorbeeldportret op zijn uiteindelijke plek na de projecten. Onderaan staan interne contentkeys. Beide worden niet in de productiebuild opgenomen.
- Teksten, mensen, media en reviews: `src/content/site.ts`. Cases: `src/content/cases/*.md`. Geen CMS nodig.
- De aanwezige foto van Maxim wordt al gebruikt op de bestaande contact- en projectpagina. Er wordt geen nieuw portret of teambeeld verzonnen.
- “Project” betekent een bestaande projectbeschrijving, zonder extra claim over livegang, klantacceptatie of gemeten rendement. “In ontwikkeling” blijft zichtbaar voor circulaire IT.

## Bedrijfsafspraken

| Sectie / contentkey | Aanleveren of bevestigen | Formaat / lengte | Toestemming / controle | Prioriteit | Invullen in | Zolang het ontbreekt |
| --- | --- | --- | --- | --- | --- | --- |
| Aanpak / `[BEHEERAFSPRAKEN_BEVESTIGEN]` | Wie beheert en ondersteunt na oplevering; bereikbaarheid, inbegrepen werk, betaalde wijzigingen en eventuele responstijden. | Korte afsprakenlijst, daarna 2–4 zinnen voor de site. | Bevestiging door verantwoordelijke van Peak. | Vereist vóór publicatie: bevestig dat de huidige tekst “per project afspreken” de werkwijze correct beschrijft. | `process`, `faqs` in `src/content/site.ts` | Geen supportbelofte; beheer en ondersteuning worden expliciet als af te spreken onderdelen genoemd. |
| FAQ / `[EIGENAARSCHAP_BEVESTIGEN]` | Standaardregeling of projectafspraken voor code, accounts, data, licenties en overdracht. | 1 antwoord van 50–90 woorden. | Laat aansluiten op daadwerkelijke offertes en contracten. | Vereist vóór publicatie: controleer de huidige tekst over expliciete projectafspraken. | `faqs` | Geen garantie over eigendom; de FAQ benoemt dat dit in het voorstel moet staan. |
| Kennismaking en aanpak / `[PRIJSRICHTING_BEVESTIGEN]` | Eventueel prijsmodel, analysevoorwaarden en terugkerende kosten. Is de eerste analyse betalend? | Model + wat is inbegrepen; alleen bevestigde bedragen. | Commerciële goedkeuring. | Vereist vóór publicatie: bevestig scope, timing en budget vooraf; bedragen kunnen later. | `home.firstConversation`, `faqs`, scope-uitleg in `src/components/Approach.astro` | Geen vanafprijs, gratis audit, duur of antwoordtermijn. Kosten worden per scope besproken. |
| Mensen / `[TEAMROLLEN_BEVESTIGEN]` | Wie vanuit Peak analyse, bouw en ondersteuning doet; Maxims bevestigde rol en relevante expertise. | Naam + rol + 40–70 woorden per betrokkene. | Goedkeuring door betrokkene; bewijs voor diploma's, ervaring of certificaten indien vermeld. | Vereist vóór publicatie voor nieuwe rolclaims; huidige aanspreekpunttekst ter controle. | `people` in `src/content/site.ts` | Maxim als bestaand aanspreekpunt; bezetting wordt tijdens kennismaking besproken. Geen verzonnen ervaring of teamleden. |
| FAQ / `[GEGEVENSAFSPRAKEN_BEVESTIGEN]` | Gebruikelijke AI-diensten, toegangsbeheer, gegevensverwerking en afspraken per project. | 60–100 woorden; technisch overzicht mag apart. | Controle door verantwoordelijke; geen generieke AVG-, hosting- of modeltrainingsclaims. | Vereist vóór publicatie: controleer of de beschreven bespreking vooraf klopt. | `faqs` | Alleen bespreking van benodigde gegevens, tools, toegang en derden vóór uitvoering. Bestaande websiteprivacy blijft gelden voor het formulier. |
| Circulaire IT / `[CONTROLEPUNTEN_BEVESTIGEN]` | Beoogde menselijke rol, welke CRM-acties automatisch mogen en ontwikkelstatus. | 2–3 zinnen; geen commercieel resultaat. | Projectverantwoordelijke; anonimiteit behouden. | Later toe te voegen; controleer huidige beoogde rol bij publicatiereview. | `humanRole` en body in `src/content/cases/verkoopsignalen.md` | “In ontwikkeling”; menselijke rol expliciet als beoogd, precieze controlepunten nog uit te werken. |

## Beelden, bewijs en reviews

| Sectie / contentkey | Aanleveren of bevestigen | Formaat / afmetingen / lengte | Toestemming / anonimisering | Prioriteit | Invullen in | Zolang het ontbreekt |
| --- | --- | --- | --- | --- | --- | --- |
| Vroeg bewijs / `[KLANTLOGO_TOESTEMMING_NODIG]` | Logo en toegestane formulering van de klantrelatie. | SVG of transparante WebP, circa 320 × 120 px. | Schriftelijke toestemming; softwarelogo's zijn geen klantlogo's. | Later toe te voegen. | Goedgekeurde logo-array toevoegen bij bewijs in `site.ts`; renderen in `src/pages/index.astro`. | Drie concrete projectlinks, zonder logo's of partnerschapsclaim. |
| Mensen / `[PORTRET_MAXIM_AANLEVEREN]` | Alleen nodig indien het bestaande portret vervangen moet worden. | WebP/AVIF, vierkant 800 × 800 px of groter; gezicht met uitsnedemarge. | Toestemming geportretteerde en gebruiksrechten fotograaf. | Later toe te voegen. | `people.portrait` | Bestaande echte foto `/images/1726411517872.webp`. |
| Mensen / `[TEAMFOTO_AANLEVEREN]` | Optionele echte teamfoto met correcte namen en rollen. | Liggend 1600 × 1000 px, WebP/AVIF. | Toestemming van alle betrokkenen en fotograaf. | Later toe te voegen. | `people` uitbreiden en mensencomponent in `src/pages/index.astro`. | Compacte sectie met Maxim; geen lege teamfoto. |
| Praktijkvoorbeeld / `[CASE_SCREENSHOT_ANONIMISEREN]` | Beeld van aanvraag, controle of calculatie; korte uitleg wat zichtbaar is. | WebP/AVIF, circa 1440 × 900 px; liefst < 200 KB. Werkelijke verhouding ook in component bijwerken. | Verwijder klantnamen, e-mails, bedragen, dossiernummers en andere herkenbare informatie; toestemming voor publicatie. | Later toe te voegen. | `workflowMedia.screenshot`, `screenshotAlt` in `site.ts`; `WorkflowExample.astro`. | Verzorgde procesillustratie met expliciete voorbeelddata. |
| Praktijkvoorbeeld / `[DEMO_VIDEO_AANLEVEREN]` | Korte schermopname van één proces, met menselijke controle. | MP4, 30–60 seconden als richtlijn; 1280 × 720; posterbeeld en ondertitels bij gesproken uitleg. | Gebruik testdata of anonimiseer; laat klant publicatie goedkeuren. | Later toe te voegen. | `workflowMedia.video` en `poster`; voeg zo nodig `<track>` toe in `WorkflowExample.astro`. | Geen lege speler. De complete uitleg is HTML; video laadt pas op verzoek (`preload="none"`). |
| Cases / `[RESULTAAT_EN_MEETPERIODE_BEVESTIGEN]` | Per case: aantoonbare uitkomst, beginsituatie, meetperiode, methode en grenzen. Bevestig ook operationele status. | 1–3 zinnen + interne bron; geen cijfer zonder basis. | Klantgoedkeuring en anonimisering. | Later toe te voegen. | `result` in het case-Markdownbestand; statusinformatie in body. | Beschrijving van taak, oplossing en menselijke rol; geen besparingscijfers. Schema weigert een behaald `result` bij “in ontwikkeling”. |
| Reviews / `[ECHTE_REVIEW_AANLEVEREN]` | Twee of drie echte inhoudelijke quotes, naam, functie, bedrijf, context; optioneel foto en bron/caselink. | Quote 30–60 woorden, foto vierkant 128 × 128 px; absolute bron-URL of bestaande caseroute. | Expliciete publicatietoestemming en juiste dienstcontext. Reviews over andere diensten ook zo benoemen. | Later toe te voegen. | `testimonials` in `src/content/site.ts`; gedeeld `Testimonials.astro`. | Reviewsectie verborgen in productie; één vormgegeven reviewplaceholder met gelabeld voorbeeldportret in ontwikkelpreview, direct na de projectselectie. |

## Techniek en meting

| Item | Wat nog nodig is | Locatie / fallback | Prioriteit |
| --- | --- | --- | --- |
| `[ANALYTICS_CONFIGURATIE_BEVESTIGEN]` | Bepalen of meting gewenst is, welke provider en welke privacyconfiguratie daarbij hoort. Er was geen analyticsdienst in de actuele broncode. | `src/scripts/analytics.ts` publiceert alleen lokale `peak:interaction`-events. Er wordt niets verzonden of opgeslagen. Zie `docs/MEASUREMENT.md`. | Later toe te voegen; geen trackinginstallatie nodig voor deze wijziging. |
| Formulieraflevering na publicatie | Deze wijziging is uitsluitend lokaal getest met onderschepte requests. Controleer bij een afzonderlijk gevraagde publicatie Netlify-detectie en, alleen indien nodig, één duidelijk gemarkeerde test. Inboxontvangst vraagt toegang tot de mailbox. | Naam, bestaande veldnamen, honeypot, UTM-velden, POST-actie en bestaande notificatie blijven behouden. De vorige livegang is beschreven in `docs/LAUNCH.md`; dat is geen bewijs voor deze ongepubliceerde versie. | Vereist bij publicatiecontrole. |
| Hostingbetaling | Bestaand open punt uit `docs/LAUNCH.md` opvolgen in het Netlify-account. Status is in deze opdracht niet opnieuw opgevraagd. | Geen hosting-, DNS-, mail- of betaalinstellingen aangepast. | Vereist vóór publicatie door accounteigenaar. |

## Aannames en publicatiereview

- Positionering blijft Belgische ondernemingen met terugkerend administratief en commercieel werk. Er is geen nieuwe sectorfocus gekozen.
- Bestaande anonieme projectteksten zijn inhoudelijk bewijs voor de beschreven oplossing, niet voor omzet, tijdwinst of klanttevredenheid.
- De bestaande contactgegevens en foto van Maxim blijven de bron. Geen extra functietitel, diploma of teambezetting aangenomen.
- Nieuwe FAQ-antwoorden wijzen op te maken projectafspraken. Laat de verantwoordelijke vóór publicatie bevestigen dat dit aansluit op de offerte- en uitvoeringspraktijk.
- Review lokaal zowel `/` als `/contact`, inclusief contentpreview. Publiceer uitsluitend na een afzonderlijke opdracht; deze taak voert geen deployment uit.


## Casefoto’s en klantlogo’s vervangen

Elke case heeft nu `image` en `client` in het Markdown-frontmatter. Beide velden zijn verplicht in het contentschema. Foto, logo en status worden gedeeld door de homepage, het caseoverzicht en de detailpagina.

```yaml
image:
  src: /images/cases/goedgekeurde-foto.webp
  srcSmall: /images/cases/goedgekeurde-foto-640.webp
  alt: Beschrijf wat er op de goedgekeurde foto te zien is.
  placeholder: false
client:
  name: Goedgekeurde bedrijfsnaam
  logo: /images/klanten/goedgekeurd-logo.svg
  placeholder: false
```

Gebruik een foto van 1280 px breed en optioneel een versie van 640 px breed (`srcSmall`); houd dezelfde uitsnede aan. Zonder `srcSmall` wordt alleen `src` gebruikt. Logo’s worden op een licht vlak getoond, zonder vervorming. Zet `placeholder` pas op `false` na toestemming en vervang de alttekst. De centrale logoplaceholder is geen verzonnen klantlogo. `featured: true` bepaalt welke cases op de homepage verschijnen; `order` bepaalt hun volgorde.

De homepage toont drie bestaande cases vlak na de hero in een bentogrid. Desktophover of toetsenbordfocus toont logo en samenvatting; op mobiele en touchapparaten is deze informatie direct zichtbaar. De quoteplek eronder bevat geen voorbeeldclaim: ze blijft verborgen in productie zolang `testimonials` leeg is. Voeg de goedgekeurde quote, naam, functie, bedrijf, context, `photo` en optioneel `source` toe in `src/content/site.ts`; daarna verschijnt de echte review ook in de statische build.

### Bronnen van tijdelijke beelden

Alle onderstaande foto’s dienen uitsluitend als sfeerbeeld of voorbeeldportret; ze tonen geen klanten, medewerkers of vestigingen van Peak Automations. Lokale WebP-versies voorkomen verzoeken naar externe beelddiensten tijdens een bezoek.

| Gebruik | Bron |
| --- | --- |
| Bouwproducten | [Tiger Lily / Pexels](https://www.pexels.com/photo/men-standing-in-a-warehouse-talking-4480982/) |
| Installatiebedrijf | [Elite Power Group / Pexels](https://www.pexels.com/photo/electrician-working-on-solar-battery-installation-36085816/) |
| Circulaire IT | [Tima Miroshnichenko / Pexels](https://www.pexels.com/photo/man-fixing-a-computer-6754846/) |
| Ondernemersnetwerk | [Mikhail Nilov / Pexels](https://www.pexels.com/photo/people-having-a-business-meeting-in-the-office-7988219/) |
| Internationaal B2B-bureau | [Mizuno K / Pexels](https://www.pexels.com/photo/three-people-at-office-while-planning-12902905/) |
| Reviewvoorbeeld | [Daniel & Hannah Snipes / Pexels](https://www.pexels.com/photo/professional-headshot-of-smiling-businessman-30004315/) |
