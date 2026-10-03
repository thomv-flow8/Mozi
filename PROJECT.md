# Huidzorg Mozi — nieuwe website + webshop

Huidtherapiepraktijk in Gezondheidscentrum Zorglinie, Hoog Dalemseweg 3, 4208 CA Gorinchem.
Huidige site: https://www.huidzorgmozi.nl (JouwWeb). Instagram: @huidzorg_mozi.

## Doel
- Nieuw premium design, kleuren behouden (zwart + goud/beige).
- Webshop toevoegen.
- Eigenaresse moet zelf teksten en producten kunnen wijzigen.
- Voor/na-slider bij resultaten.
- Portretfoto eigenaresse: achtergrond weg, fris wit, Apple-stijl.

## Gekozen aanpak
1. Design maken als losse HTML-preview (hier), laten beoordelen.
2. Daarna omzetten naar een **Shopify-thema** (Online Store 2.0, Liquid-secties), zodat teksten,
   afbeeldingen en producten via de Shopify-editor aan te passen zijn.

## Bestaande koppelingen (van de huidige site gehaald)
Reviews en afspraken lopen allebei via **Salonized** (onderdeel van Treatwell, vandaar "powered by treatwell").

Boekwidget (zwevende knop "Maak afspraak"):
```html
<div class="salonized-booking" data-company="TEDTda42R5tfBZjpSw3Hfynv" data-color="#a19778"
     data-language="nl" data-height="700" data-position="right"></div>
<script src="https://static-widget.salonized.com/loader.js"></script>
```

Reviewwidget:
```html
<script src="https://cdn.salonized.com/widget.js" data-name="salonized"
        data-microsite-url="https://huidzorg-mozi.salonized.com"></script>
<div class="salonized-reviews"></div>
```

## Huisstijl (eerste inventaris)
- Logo: "HUIDZORG" in een ruim gespatieerd schreefloos lettertype, "MOZI" in een serif met veel contrast,
  goud/beige letters (~#D6C89C) op vier zwarte vierkanten.
- Accentkleur in de huidige boekwidget: `#a19778`.

## Bestanden
- `assets/origineel/` — aangeleverd logo en portretfoto (niet bewerken; bewerkte versies apart).

## Stand van zaken (1 oktober 2026)
- **Preview v2**: `preview/index.html` + `preview/tarieven.html`, gedeelde stijl `preview/css/mozi.css`
  en script `preview/js/mozi.js`. Lokaal bekijken: `node tools/serve.js` → http://localhost:5173/preview/
- **v1** bewaard in `preview/v1/`.
- **Tarieven**: één bron `docs/tarieven.json` (straks ook voor Shopify). Pagina opnieuw maken:
  `node tools/genereer-tarieven.js` (neemt kop en voet over uit index.html).
- **Boeken**: eigen venster met de Salonized-widget-URL
  (`widget.salonized.com/widget?company=…&inline=true`), geen landingspagina meer.
  Let op: de officiële `loader.js` werkt niet op localhost (gebruikt dan de eigen origin).
  Later mogelijk: dienst vooraf selecteren (vereist Salonized dienst-ID's).
- **Intake** is 30 minuten (huidige site zegt ten onrechte 45).

## Materiaal
- `assets/huidige-site/` — alle 66 afbeeldingen van de huidige site (`preview/materiaal.html` = overzicht).
- `assets/web/` — webversies (verkleind) van de gebruikte foto's.
- `assets/logos/` — Dermaceutic, Renophase, Theraderm, SkinPen, Clarity II, Clearlight IPL (aangeleverd),
  NVH, KP, VvAA (van de huidige site).
- `assets/resultaten/` — voor/na uit klinische foto's van SkinPen/Bellus Medical (gesplitst). Altijd met
  bronvermelding tonen; het zijn géén cliënten van Mozi.
- Instagram vraagt om in te loggen → originele foto's/video's via Emine aanleveren.
- Nog nodig: eigen video (filmband), productfoto's per artikel, echte voor/na-foto's met schriftelijke
  toestemming, eventueel een Lumi8-logo.

## Update 2 oktober 2026
- **Behandelpagina's**: inhoud in `docs/behandelingen.json`, genereren met `node tools/genereer-behandelingen.js`
  → `preview/behandeling-<slug>.html`. Voorbeeld: SkinPen. Prijzen komen uit `docs/tarieven.json`.
  Kop/voet gedeeld via `tools/sjabloon.js` (ook gebruikt door de tarievengenerator).
- **Reviews**: bron is de bestaande Salonized-reviewpagina (`huidzorg-mozi.salonized.com/reviews`, powered by
  Treatwell). `node tools/haal-reviews.js` → `docs/reviews.json` (5,0 uit 71). De browser mag die pagina niet
  rechtstreeks uitlezen (geen CORS) → in productie een kleine serverfunctie die dit dagelijks ververst.
  "Lees alle reviews" opent de live Salonized-widget in het eigen venster.
- **Kleurenvergelijking**: schakelaar Ivoor/Wit in de previewbalk; "Wit" volgt de kleuren van dermaceutic.com
  (wit, zand #F5EBDF, bijna-zwart #1D1D1D).
- **Logo's** zonder witte achtergrond: `node`-vrij via `swift tools/wit-naar-transparant.swift in out.png`.

## Online en beheer (2 oktober 2026)
- **Live (tijdelijk adres):** https://thomv-flow8.github.io/Mozi/ — GitHub Pages, bron "GitHub Actions".
- **Bouwen:** `node tools/bouw-site.js` → `_site/` (niet in git). De workflow `.github/workflows/site.yml`
  draait bij elke push naar main, elke nacht om 04:00 UTC (verse reviews) en handmatig.
- **Beheer:** Pages CMS (`.pages.yml`) bewerkt `docs/tarieven.json` en `docs/behandelingen.json`.
  In koppen: `*woord*` wordt schuingedrukt. Lege velden uit het CMS worden in de generator genegeerd.
- **Nog niet via het CMS:** de homepage-teksten en de kaarten op de homepage (staan nog in `preview/index.html`).

## Producten en merken (2 oktober 2026)
- **Eén bron:** `docs/producten.json` (merken + producten). `node tools/genereer-producten.js` zet ze in
  `preview/index.html` tussen de markeringen `<!-- merken -->`, `<!-- merklogos -->`, `<!-- merkenvoet -->`
  en `<!-- producten -->`. Dit script draait als eerste in `tools/bouw-site.js`, want de andere generatoren
  nemen kop en voet uit index.html over.
- **Dermasence** toegevoegd als vierde merk, met drie producten (Mousse, Seborra serum, Hyalusome Night).
  Een klik op een product opent een venster met omschrijving, eigenschappen, huidtype en gebruik.
- **Prijzen** zijn overgenomen van een andere praktijkwebshop en moeten door Emine worden bevestigd.
- **Beeld vrijmaken:** `swift tools/achtergrond-weg.swift <in> <uit.png> [drempel]` haalt alleen de
  achtergrond weg die aan de rand vastzit, dus een wit flesje blijft heel (anders dan
  `wit-naar-transparant.swift`, dat voor logo's is). `swift tools/bijsnijden.swift <in> <uit> [maxBreedte]`
  snijdt de doorzichtige rand weg.
- **Nog te doen:** webshop koppelen (zie hieronder), productfoto's van de leverancier in hoge resolutie.

## Beeld op de behandelpagina's (2 oktober 2026)
- Negen te kleine stockfoto's zijn vervangen door gegenereerd beeld van 1600 px breed.
  Zie `docs/beeld-generatie.md` voor welke, de afspraken, en wat nog echte foto's nodig heeft.
  De oude foto's staan in `assets/stock/vervangen/`.
- **Tekeningen**: `tools/illustraties.js` bevat vier doorsneden (porie, haarzakje, licht,
  wratje) in dezelfde lijn als de huidlagen bij SkinPen. Ze zijn beeldtypes in de generator
  en in het CMS. Bekijken: `node tools/illustraties.js` → `preview/illustraties.html`.

## Beheer: homepage in het CMS (3 oktober 2026)
- **Homepage, deel A**: de aankondigingsbalk, de opening, de 12 behandelkaarten, de drie stappen van
  de werkwijze en de contactgegevens staan in `docs/home.json`. `tools/genereer-home.js` zet ze in
  `preview/index.html` tussen de markeringen `<!-- home:… -->`. Draait als eerste in `bouw-site.js`
  (de aankondigingsbalk staat in de kop van elke pagina).
- **Deel B nog te doen**: de rij met reviews en logo's, de voor/na-resultaten, het blok over Emine,
  de logostrook onder de opening en de koppen van de overige blokken.
- **CMS-onderdelen**: Homepage, Tarieven, Merken & producten, Behandelingen, Over Mozi, Privacy/cookies/
  voorwaarden. Pages CMS is gekoppeld (app geïnstalleerd op alleen de repository Mozi).
- **Controleren na een wijziging aan `.pages.yml`**: valideer met de schemacode van Pages CMS zelf en
  controleer dat elk veld in de data gedeclareerd is (anders gooit het CMS het weg bij opslaan) en dat
  bestaande waarden in de keuzelijsten passen (anders weigert het CMS op te slaan).
