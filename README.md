# Peak Automations

Onderhoudbare consultancywebsite in Astro. Positionering: AI-consultancy en agentic automatisering voor Belgische ondernemingen. De bestaande Peak-identiteit en projectinhoud zijn behouden.

## Lokaal starten

Node.js 24 aanbevolen (minimaal 22.22). `nvm use` gebruikt de versie uit `.nvmrc`.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4321`. Productie-output testen: `npm run build` en `npm run preview`.

## Waar pas je wat aan?

| Wijziging | Bestand |
| --- | --- |
| Propositie, diensten, FAQ, contactgegevens | `src/content/site.ts` |
| Projecten | `src/content/cases/*.md` |
| Pagina's | `src/pages/` |
| Herbruikbare onderdelen | `src/components/` |
| Metadata en paginaopbouw | `src/layouts/BaseLayout.astro` |
| Kleuren, typografie, responsive styling | `src/styles/global.css` |

Een nieuw project krijgt automatisch een detailpagina, een rij op het overzicht en een sitemapvermelding. Het inhoudsschema controleert de verplichte velden tijdens de build.

## Verificatie

```sh
npm run verify
```

Dit controleert Astro/TypeScript, bouwt alle pagina's en controleert de geproduceerde HTML op kapotte interne links, ontbrekende assets, metadata en het Netlify-formuliercontract. Bekijk UI-wijzigingen daarnaast op desktop en mobiel.

## Publiceren

Build: `npm run build`, publicatiemap: `dist/`. `netlify.toml` is ingesteld voor de bestaande site. De nieuwe versie staat sinds 17 oktober 2026 live op https://peak-automations.com. De geverifieerde productie-deployment staat in `hosting/deployment.json`; de vorige productieversie is vastgelegd in `hosting/deployment-before-launch.json`.

Zie `docs/LAUNCH.md` voor previewcommando's, de lanceringspunten, formuliernotificaties en outreach-links. Site-ID: `240ceca8-2810-438b-b1d2-5028dce4a391`.

## Werken met agents

Start bij `AGENTS.md`, `PRODUCT.md` en `DESIGN.md`. Inhoud en presentatielogica staan apart, zodat kleine aanpassingen geen complete pagina-export meer vereisen. Er is geen externe CMS-, AI-API- of Webflow-verbinding nodig om aan de site te werken.

## Bewaarde export en hosting

`legacy/webflow/` bewaart de oorspronkelijke bron en README. `hosting/` bevat de bestaande DNS- en deploymentnotities. Beide blijven buiten de build. Er is nog geen Git-remote of automatische deployment vanuit Git ingesteld.

## Homepage en ontbrekende content

De homepage bevat een eigen contactformulier, de bestaande projecten, een HTML-procesillustratie met voorbeelddata en de bestaande foto van Maxim. `/contact` gebruikt hetzelfde `ContactForm.astro` en behoudt Netlify Forms-naam, veldnamen en spambeveiliging.

Aanleverlijst en nog te bevestigen bedrijfsafspraken: `CONTENT_NEEDED.md`. De ontwikkelserver toont onderaan de homepage de ontbrekende beelden en reviewslots; de productiebuild verbergt interne contentkeys en de reviewplaceholder. Tijdelijke casefoto’s en logoplaatsen zijn herkenbaar gelabeld. Voeg alleen goedgekeurde reviews toe aan `testimonials` en echte media aan `workflowMedia` in `src/content/site.ts`.

Er is geen trackingdienst toegevoegd. De lokale events en mogelijke latere aansluiting staan in `docs/MEASUREMENT.md`.


## React-bentogrid en shadcn-structuur

De homepage gebruikt `src/components/ui/conditiongrid.tsx`, gebaseerd op het aangeleverde React-voorbeeld. De bestaande Astro-website blijft statisch. Alleen het grid wordt met `client:visible` gehydrateerd; alle cases, afbeeldingen en tekst worden al tijdens de build als HTML gerenderd. Hover, toetsenbordfocus en de zichtbare mobiele informatie werken met CSS, ook zonder JavaScript. Motion voegt een kleine hoverbeweging toe en respecteert reduced motion.

- **UI-componenten:** `src/components/ui/` (import `@/components/ui/conditiongrid`). `@/*` verwijst in `tsconfig.json` naar `src/*`. Dit is dus de `/components/ui`-locatie binnen de bestaande `src`-structuur; de map en `components.json` geven shadcn CLI een vaste bestemming, zonder een tweede componentenboom aan de projectroot.
- **Stijlen:** algemene Peak-stijlen in `src/styles/global.css`, Tailwind 4-thema/utilities in `src/styles/tailwind.css`, gridinteracties in `src/styles/conditiongrid.css`. Tailwind Preflight is weggelaten om de bestaande pagina’s en formulieren te behouden. Importeer `tailwind.css` ook op andere pagina’s als daar later shadcn-componenten worden gebruikt.
- **Dependencies:** `@astrojs/react`, React/React DOM, `motion`, `lucide-react`, Tailwind met Vite-plugin, React-types, `clsx` en `tailwind-merge`. TypeScript was al aanwezig. `src/lib/utils.ts` biedt de gebruikelijke `cn()`-helper. Er zijn geen externe state store, extra contextproviders of API nodig; `MotionConfig` zit in de component.
- **Afbeeldingen:** de bestaande lokale WebP-placeholderfoto’s en logo’s uit de casecontent. De Next.js-specifieke `next/image` is vervangen door een responsieve `<img>` met `srcSet`, afmetingen en lazy loading; een Next.js-installatie is voor deze Astro-integratie niet nodig.
- **Props:** `projects: ConditionProject[]`, optioneel `className`. De homepage vertaalt de op `featured` geselecteerde casecontent naar deze props. Bij drie cases is de eerste tegel groter; bij meer cases volgt het grid de 5/7–7/5-verhouding uit het voorbeeld. Er is geen aparte demopagina nodig: de homepage is de werkende integratie.

Alles is ingesteld. Nieuwe shadcn-componenten kunnen via `npx shadcn@latest add <component>` worden toegevoegd; beoordeel gegenereerde themawijzigingen tegen de bestaande Peak-stijlen. Voor een nieuw project is de officiële start `npx shadcn@latest init -t astro`. De huidige repository hoeft niet opnieuw geïnitialiseerd te worden.

Setupreferenties: [Astro React-integratie](https://docs.astro.build/en/guides/integrations-guide/react/), [Tailwind voor Astro](https://tailwindcss.com/docs/installation/framework-guides/astro), [shadcn voor Astro](https://ui.shadcn.com/docs/installation/astro).
