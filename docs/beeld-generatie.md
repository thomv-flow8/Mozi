# Gegenereerd beeldmateriaal

Negen foto's op de behandelpagina's zijn met AI gemaakt (GPT Image 2.5, 2240×1792,
verkleind naar 1600 px breed). Ze vervangen stockfoto's van de oude site die te klein waren
(550–1200 px) voor hoe groot ze worden getoond.

**De oude foto's staan in `assets/stock/vervangen/`**, voor het geval we terug willen.

## Afspraken

- Geen apparatuur, producten of merken genereren. Een model verzint dan een plausibel ogend
  apparaat met een verzonnen merknaam erop. Die foto's komen van de fabrikant.
- Huidaandoeningen alleen genereren als Emine ze vooraf goedkeurt. Zij beoordeelt of het
  beeld medisch klopt.
- Gegenereerd beeld nooit bij de voor/na-sectie zetten. Als illustratie bij uitleg is het
  eerlijk; naast resultaten leest het als "dit is ons werk" en dat is misleidend.
- Alles in dezelfde stijl: zacht strijklicht, offwhite of zandkleurige achtergrond, veel lege
  ruimte, gedempte kleuren, geen tekst, geen sieraden. Verhouding 5:4, minimaal 1600 px breed.

## Wat waar staat

| bestand | pagina | plek | wat het toont |
|---|---|---|---|
| `acne.jpg` | Acnetherapie | hoofdfoto | rustige close-up wang en hals, zonder make-up |
| `peeling.jpg` | Medische peelings | hoofdfoto | peeling aanbrengen met een kwast |
| `peeling-masker.jpg` | Medische peelings | uitleg | macro van peelinggel op zand |
| `masker.jpg` | Combinatiebehandelingen | hoofdfoto | masker aanbrengen |
| `peeling-2.jpg` | Combinatiebehandelingen | uitleg | serum inmasseren |
| `rosacea.jpg` | Rosacea & couperose | hoofdfoto | wang met roodheid en fijne vaatjes |
| | Laser bij vaatjes & pigment | uitleg | hetzelfde beeld |
| `huidtinten.jpg` | Laserontharing | uitleg | onderarmen in verschillende huidtinten |
| `huidverhevenheden.jpg` | Huidverhevenheden | hoofdfoto | hals en sleutelbeen |
| `schimmelnagels.jpg` | Schimmelnagels | hoofdfoto | verzorgde blote voeten |

Nog niet gebruikt: `assets/stock/schimmelnagel-aandoening.jpg` — close-up van aangetaste
teennagels. Medisch overtuigend, maar confronterend als hoofdfoto. Alleen plaatsen na
goedkeuring van Emine.

## Nog door echte foto's te vervangen

- Clarity II (staat op vier pagina's), Lumi8, SkinPen — opvragen bij de leveranciers
- Dermaceutic-producten op Huidanalyse & productadvies (`maskpeel.jpg`, `crystalpeel.jpg`)
- Steelwratjes in close-up (`huidverhevenheden-close.jpg`) — krijgt geen model goed
- `laser.jpg` op Laser bij vaatjes & pigment — toont nu apparatuur

## Tekeningen in plaats van foto's

Vier uitlegblokken gebruiken een tekening. Ze staan in `tools/illustraties.js` en delen
dezelfde huidlagen, tinten en lijndikte, zodat ze als één set lezen. Bekijken:
`node tools/illustraties.js` → `preview/illustraties.html`.

| type | pagina | wat het laat zien |
|---|---|---|
| `porie` | Acnetherapie, Wat is acne | gezonde porie naast een verstopte porie |
| `haarzakje` | Laserontharing, De behandeling | het pigment in de haar neemt het licht op; een leeg zakje reageert niet |
| `licht` | LED-therapie, De techniek | hoe diep blauw en rood licht komen |
| `wratje` | Huidverhevenheden, Wat is het | steelwratje naast een ouderdomswratje |
| `vaatje` | Laser bij vaatjes & pigment, De behandeling | het licht sluit het vaatje en laat het pigment uiteenvallen |
| `nagel` | Schimmelnagels, De behandeling | licht gaat door de nagelplaat, crème niet |

In het CMS zijn dit beeldtypes, naast foto, kaart en huidlagen. De vervangen foto's staan in
`assets/stock/vervangen/`.

**Let op bij het tekenen:** tekst in de tekening krimpt mee met de tekening. Op een smal
scherm kwam 13 eenheden op 7,8 px uit. Daarom staan de lettergroottes in `mozi.css` onder
`.ill`, met een grotere maat onder 560 px en een kort bijschrift in plaats van het lange —
anders lopen de twee bijschriften tegen elkaar aan.

Daarmee staat de Clarity II-foto nog op één pagina (Huidverbetering) in plaats van vier.

## Opdrachten

De gebruikte opdrachten staan in de gespreksgeschiedenis. Kern van elke opdracht:

> \[onderwerp\]. Clean clinical skincare aesthetic in the style of premium medical skincare
> brand photography: soft diffused studio light, gentle shadows, shallow depth of field,
> calm off-white and warm sand palette, generous negative space, muted natural colours.
> No text, no logos, no branding, no jewellery. Photorealistic, high detail.

Voor een hoge resolutie met dezelfde compositie: hergenereren met het eerdere resultaat als
`image_references` en "recreate the reference image: same composition, crop, pose and
lighting" in de opdracht. Kwaliteit `high`, resolutie `2k`.
