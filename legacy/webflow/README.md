# Peak Automations website

Statische Webflow-export, op 17 oktober 2026 gepubliceerd op Netlify.

- Live: https://peak-automations.com
- Netlify: https://app.netlify.com/projects/peak-automations
- Project-ID: `240ceca8-2810-438b-b1d2-5028dce4a391`
- Account/team: Creative Motion (`ward-janssen2020`)

## Bestanden en publiceren

De oorspronkelijke bestanden `index`, `cases` en `contact` hebben nu een
`.html`-extensie. Bewerk deze bestanden en de bijbehorende `css/`, `images/`
en `js/`. De Webflow-vormgeving is behouden. De website heeft Nederlandstalige
copy voor middelgrote Belgische ondernemingen, met nadruk op bedrijfsprocessen,
gekoppelde systemen en software op maat. De projectbeschrijvingen bevatten geen
resultaatcijfers waarvan de meetbasis nog niet is bevestigd.

De gedeelde CSS bevat enkele gerichte aanpassingen om Nederlandse tekst passend
te tonen: projectvakken groeien mee met de tekst, de contactpagina heeft op
desktop voldoende ruimte bovenaan en de roterende hoofdtitel kan omslaan op
smallere schermen. Kleuren, lettertypes en bestaande animaties zijn behouden.

```sh
node scripts/build.mjs
npx netlify-cli deploy --site 240ceca8-2810-438b-b1d2-5028dce4a391 --dir dist --no-build
# Na controle van de preview:
npx netlify-cli deploy --site 240ceca8-2810-438b-b1d2-5028dce4a391 --dir dist --no-build --prod
```

Het buildscript maakt `dist/` opnieuw aan en kopieert uitsluitend de
websitebestanden. Hostingnotities, DNS-kopieën, screenshots en lokale
Netlify-configuratie worden niet gepubliceerd. Er is nog geen Git-remote of
automatische deployment vanuit Git ingesteld. Gebruik bij deployments altijd
het expliciete project-ID hierboven.

## Domein

DNS en nameservers blijven bij Combell. Alleen de websiteverwijzingen zijn
gewijzigd:

| Record | Voorheen | Nu | TTL |
| --- | --- | --- | --- |
| `@` A | `75.2.70.75` en `99.83.190.102` | `75.2.60.5` | 300 |
| `www` CNAME | `proxy-ssl.webflow.com` | `peak-automations.netlify.app` | 300 |

Netlify gebruikt het hoofddomein als primair adres. `www` verwijst automatisch
naar het hoofddomein. HTTP verwijst naar HTTPS. Een automatisch vernieuwbaar
Let's Encrypt-certificaat voor beide adressen is uitgegeven en gecontroleerd.

`hosting/dns-before.json` en `hosting/dns-after.json` bewaren de DNS-controle.
E-mailrecords, andere subdomeinen en nameservers bleven gelijk. De SOA-serial
wijzigde automatisch door de DNS-aanpassingen. De oude records hadden een TTL
van 3600 seconden; bestaande DNS-caches kunnen daarom tijdelijk nog naar
Webflow verwijzen.

## Contactformulier

Het formulier gebruikt Netlify Forms in plaats van de Webflow-backend.
`js/contact-form.js` bewaart de bestaande vormgeving en toont Nederlandse
succes-, fout- en validatiemeldingen, ook in een Engelstalige browser. Het
blokkeert dubbele verzending. Netlify-formulierdetectie en
de honeypot zijn actief. Een duidelijk gemarkeerde technische testinzending
is succesvol opgeslagen in formulier `wf-form-Formulier`.

Inzendingen: https://app.netlify.com/projects/peak-automations/forms

Er zijn nog geen e-mailmeldingen ingesteld. Lettertypes en animaties gebruiken
de bestaande externe Typekit-, Slater-, GSAP-, Lenis- en SplitType-scripts.
Telefoon en e-mail zijn aanklikbaar. De lege Instagram-link is verwijderd.

## Accountmelding

Netlify meldde tijdens de inrichting een openstaande betaling voor Creative
Motion. De site was actief tijdens verificatie; de accounteigenaar moet de
melding onder Usage & billing opvolgen om een onderbreking te voorkomen.
