# Bestaande Peak-identiteit, onderhoudbare uitvoering

Deze ombouw behoudt de visuele wereld van de aanwezige Webflow-export: de Peak-logo's, bijna zwart, helder groen, Clash Grotesk en het groene abstracte achtergrondbeeld. Geen rebranding.

## Ontwerpwaarden
- Achtergrond `#040404`, tekst `#f4f5f2`, ondersteunende tekst `#a8afaa`, accent `#20e387`.
- Lichte uitlegvlakken: `#eef0e9` met tekst `#111b15` en ondersteunend `#4b574f`.
- Clash Grotesk, lokaal geladen: regular en medium. Geen externe font- of animatiediensten.
- Maximale inhoudsbreedte 1320px. Marges schalen van 22px op mobiel tot 80px op breed desktop.
- Sectieruimte 72–128px. Hoofdtitels maximaal 86px; headings hebben maximaal -0.035em tracking.
- Hero loopt over de volle breedte; inhoud ligt op een donker deel van het bestaande beeld.
- Diensten zijn open tekstrijen. Cases krijgen ruime foto-tekstcomposities met klantlogo. Op de homepage staat een fotogedreven bentogrid met één grote tegel links en twee kleinere rechts, 16px tussenruimte en 12px hoekradius. Titels blijven zichtbaar; desktophover en toetsenbordfocus onthullen logo en uitleg. Onder 1024px en op touchscreens staan de kaarten onder elkaar met alle informatie zichtbaar onder de foto.
- Groene knoppen voor de primaire actie; tekstlinks voor verdieping.
- Aanpak is een groeiende geometrische lijntekening naast één actieve stap, met drie genummerde keuzeknoppen. Automatisch wisselen om de 6,5 seconden; pauzeren, zelf kiezen en reduced motion worden ondersteund. Zonder JavaScript staan alle stappen onder elkaar. Projectstatus wordt expliciet geschreven.

## Gedrag
Sticky navigatie, een mobiel menu met Escape en correcte expanded-status, native FAQ-details. De hero heeft een korte entree; links reageren subtiel op hover. `prefers-reduced-motion` schakelt beweging uit. Leesbaarheid is nooit afhankelijk van animatie of JavaScript.

## Pagina-intentie
De marketingpagina's helpen bezoekers begrijpen wat Peak kan oplossen en een eerste gesprek aanvragen. Volgorde homepage: concrete belofte → fotogedreven projectselectie → echte reviews indien beschikbaar (gelabelde placeholder in development) → herkenbaar werk en diensten → Maxim → praktische vragen → inline contactformulier. Gebruik de bestaande projectinhoud als bewijs; geen losse marketingcijfers.

## React-component op de homepage

Het aangeleverde ConditionGrid-voorbeeld is geïntegreerd in `src/components/ui/conditiongrid.tsx`, met React, Motion en Lucide. Tailwind 4 wordt zonder globale reset geladen op de homepage. De bestaande Peak-tokens sturen het thema. Statische HTML blijft volledig leesbaar; `client:visible` voegt uitsluitend de Motion-hoverbeweging toe.

## Tijdelijk verborgen onderdelen

Op verzoek zijn het offerteproces (`WorkflowExample.astro`) en de geanimeerde aanpak (`Approach.astro`) voorlopig van de homepage gehaald. De componenten en hun inhoud blijven bewaard voor later. De hero verwijst naar de cases; de navigatielink “Onze aanpak” is tijdelijk verwijderd.

## Mascotte

De vaste robotreferentie is op drie plekken geïntegreerd: de hero (uitnodigend naar links), diensten (drie verbonden modules) en contact (open gebaar naar het formulier). Gebroken witte behuizing, donker mechaniek en groene accenten blijven consistent. Geen kaders, extra decoratie of beweging rond de robot. De tekst en primaire actie blijven dominant.

De gedeelde `Mascot.astro` gebruikt lokale WebP's met echte alpha, vaste verhoudingen en responsive bronnen. Op schermen tot 1000 px vervallen de hero- en contactpose ook als grote download. Diensten houdt een compacte illustratie naast de introductie; vanaf tablet staan de taken daaronder. Originelen, referentie en volledige generatieprompts blijven buiten `public/` bewaard. Zie `docs/MASCOT.md` voor plaatsing, hergebruik en controles.
