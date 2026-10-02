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

## Illustratie in plaats van foto

De uitleg bij Acnetherapie ("Wat is acne") gebruikt nu een tekening in plaats van een foto:
`node tools/teken-porie.js` — gezonde porie naast verstopte porie, in dezelfde lijn als de
huidlagen bij SkinPen. In het CMS is dat het beeldtype **porie**. De oude `acne-close.jpg`
staat in `assets/stock/vervangen/`.

Hetzelfde idee is herbruikbaar voor rosacea (verwijd vaatje) en huidverhevenheden.

## Opdrachten

De gebruikte opdrachten staan in de gespreksgeschiedenis. Kern van elke opdracht:

> \[onderwerp\]. Clean clinical skincare aesthetic in the style of premium medical skincare
> brand photography: soft diffused studio light, gentle shadows, shallow depth of field,
> calm off-white and warm sand palette, generous negative space, muted natural colours.
> No text, no logos, no branding, no jewellery. Photorealistic, high detail.

Voor een hoge resolutie met dezelfde compositie: hergenereren met het eerdere resultaat als
`image_references` en "recreate the reference image: same composition, crop, pose and
lighting" in de opdracht. Kwaliteit `high`, resolutie `2k`.
