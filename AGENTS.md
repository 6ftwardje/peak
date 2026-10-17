# Werken aan Peak Automations

## Eerst lezen
Lees `PRODUCT.md` voor positionering en bewijs, en `DESIGN.md` voor de bestaande visuele keuzes. Zie `docs/LAUNCH.md` voor resterende lanceringsbeslissingen.

## Architectuur
- Astro met statische HTML-output, TypeScript en gewone CSS; geen React-runtime of CMS nodig.
- `src/content/site.ts`: bedrijfsgegevens, navigatie, homepage, diensten, aanpak en FAQ.
- `src/content/cases/*.md`: één project per Markdown-bestand; het bestand bepaalt de URL.
- `src/content.config.ts`: schema voor projectvelden; fouten moeten de build stoppen.
- `src/components/`: gedeelde navigatie, knoppen, projectenlijst, CTA en footer.
- `src/layouts/BaseLayout.astro`: metadata, canonical, structured data en algemene paginaopbouw.
- `src/styles/global.css`: tokens en responsive vormgeving.
- `src/pages/`: pagina's; bestaande routes `/`, `/cases` en `/contact` behouden.
- `public/`: publiek bereikbare assets. Zet hier nooit hostingnotities, persoonsgegevens of secrets.
- `legacy/webflow/`: bewaarde export, alleen als historische referentie. Niet aanpassen of publiceren.

## Inhoud
Schrijf in helder Nederlands voor Belgische ondernemingen. De propositie is AI-consultancy en agentic automatisering. Beschrijf de concrete taak, systemen en menselijke controle. Verzin geen klantnamen, rendement, doorlooptijden, tarieven, certificaten of testimonials. Houd projecten in ontwikkeling herkenbaar.

## Uitvoeren en controleren
Gebruik Node 24 (`.nvmrc`) en `npm ci`, `npm run dev`, `npm run verify`. Controleer na UI-wijzigingen minstens desktop en mobiel, toetsenbordnavigatie en de primaire contactroute. Alle inhoud moet ook zonder JavaScript leesbaar blijven.

## Formulieren
Behoud Netlify Forms-naam `wf-form-Formulier`, veldnamen en honeypot. Verander geen bestaande inzendingen of notificaties als onderdeel van een UI-aanpassing. Test lokaal met onderschepte requests; verstuur alleen een echte testinzending als die nodig is en markeer die duidelijk. Toon succes uitsluitend na een geslaagde response. De site heeft geen eigen backend voor formulieren; lokaal is het succespad alleen te simuleren.

## Publiceren
Standaard opleveren met lokale verificatie. Publiceer alleen binnen de door de gebruiker gevraagde scope. Gebruik bij Netlify het expliciete site-ID `240ceca8-2810-438b-b1d2-5028dce4a391` en `dist/`. Hosting- en DNS-bestanden horen nooit in `dist/`. E-mail en DNS niet wijzigen voor een website-aanpassing.
