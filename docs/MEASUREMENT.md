# Meting van contact en inhoud

De inspectie van de huidige Astro-broncode vond geen analyticsdienst, tags of bestaande eventbus. Er is geen nieuwe dienst geïnstalleerd. De website plaatst hiervoor geen cookies en bewaart geen bezoekersprofiel.

`src/scripts/analytics.ts` verstuurt alleen een `CustomEvent` op `window` met naam `peak:interaction`. Zonder een bewust aangesloten listener blijven deze events lokaal en worden ze niet opgeslagen of over het netwerk verzonden.

| `detail.name` | Trigger | Veilige velden |
| --- | --- | --- |
| `primary_cta_click` | Klik op contactactie in navigatie, hero of inhoud. | `location` (sectie-ID, navigation, footer of page) |
| `case_click` | Klik op link naar een specifieke case. | `location`, `target` (alleen intern casepad) |
| `demo_started` | Eerste play van een werkelijk toegevoegde demo-video. | `location: praktijkvoorbeeld` |
| `form_success` | Eén geslaagde HTTP-response op de formulier-POST. | `location: homepage` of `contact-page` |
| `form_error` | Netwerkfout, timeout of niet-geslaagde HTTP-response. | dezelfde formulierlocatie |
| `email_click`, `phone_click` | Klik op mail- of telefoonlink. | alleen `location` |

De statische procesillustratie heeft geen startactie en vuurt daarom geen `demo_started` af. Een klik op de verzendknop is geen succesvolle lead. Een HTTP-bevestiging bewijst evenmin ontvangst in de mailbox of kwaliteit van een lead. Zonder JavaScript is het formulier bruikbaar, maar worden er geen browser-events verstuurd en queryparameters niet ingevuld.

Een centrale kliklistener voorkomt dubbele events door meerdere overlappende CTA-handlers. Het gedeelde formulier publiceert per afgeronde request één succes- of foutevent. De video publiceert eenmaal per paginalading. De scripts gebruiken geen namen, e-mails, telefoonwaarden, formulierinhoud, querystrings of UTM-waarden in eventdetails.

Bij een latere providerkoppeling: sluit één listener aan, bepaal de privacyvereisten en documenteer de configuratie. Gebruik `form_success` als formulierconversie; combineer dit niet met een tweede conversie op de verzendklik of bedankpagina. De huidige privacyverklaring moet opnieuw worden beoordeeld zodra tracking wordt toegevoegd.
