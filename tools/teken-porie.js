// Tekent de illustratie "gezonde porie naast verstopte porie" voor de pagina Acnetherapie.
// Zelfde idioom als de huidlagen-illustratie bij SkinPen: vlakke huidtinten, dunne lijnen,
// geen kleur buiten de huisstijl. Verhouding 5:4, gelijk aan .t-visual (4/3.2).
// Gebruik: node tools/teken-porie.js   → schrijft preview/porie.html om los te bekijken.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

// Huidtinten uit de bestaande illustratie, zodat de twee bij elkaar passen.
const EPIDERMIS = '#E7C9B4';
const DERMIS = '#F1DACB';
const SUBCUTIS = '#F7E8DD';
const LUMEN = '#FBF3EA';
const LIJN = '#C98A7A';
const TALG = '#E8D3B2';
const PROP = '#C7A379';
const DONKER = '#1C1B19';

// De huidlagen worden over elkaar heen getekend (dermis eerst, epidermis erbovenop),
// zodat er geen lichte streep tussen de twee vlakken kan ontstaan.
const lagen = `
  <rect y="188" width="600" height="220" fill="${DERMIS}"/>
  <rect y="404" width="600" height="76" fill="${SUBCUTIS}"/>
  <g fill="#EFD9C9"><circle cx="56" cy="448" r="21"/><circle cx="124" cy="462" r="16"/><circle cx="492" cy="450" r="23"/><circle cx="560" cy="466" r="15"/></g>
  <path d="M0,122 C120,116 200,126 300,120 S470,114 600,122 L600,206 C470,200 380,212 300,206 S120,200 0,210 Z" fill="${EPIDERMIS}"/>`;

// Het kanaal van het huidoppervlak naar de talgklier.
function kanaal(mid, hals, buik, bodem) {
  return `M${mid - hals - 14},120 C${mid - hals - 10},142 ${mid - buik},150 ${mid - buik},166` +
    ` L${mid - buik},${bodem - 14} Q${mid - buik},${bodem} ${mid},${bodem}` +
    ` Q${mid + buik},${bodem} ${mid + buik},${bodem - 14} L${mid + buik},166` +
    ` C${mid + buik},150 ${mid + hals + 10},142 ${mid + hals + 14},120 Z`;
}

// Talgklier: drie lobjes die tegen het kanaal aan liggen.
function klier(mid, y, maat) {
  return `<g fill="${SUBCUTIS}" stroke="${LIJN}" stroke-width="1.5">
      <ellipse cx="${mid - maat - 3}" cy="${y}" rx="${maat + 3}" ry="${maat}"/>
      <ellipse cx="${mid + maat + 3}" cy="${y}" rx="${maat + 3}" ry="${maat}"/>
      <ellipse cx="${mid}" cy="${y + maat * 0.8}" rx="${maat + 1}" ry="${maat * 0.85}"/>
    </g>`;
}

// Lettergroottes staan in mozi.css, niet hier: op een smal scherm krimpt de hele tekening
// mee en zou 13 eenheden op zo'n 8 px uitkomen. Daar wordt de tekst groter gezet, en dan
// past het lange bijschrift niet meer naast het andere — vandaar een korte variant.
const kop = (x, t, lang, kort) =>
  `<text class="lab" x="${x}" y="54" text-anchor="middle">${t}</text>
   <text class="cap cap-lang" x="${x}" y="80" text-anchor="middle">${lang}</text>
   <text class="cap cap-kort" x="${x}" y="82" text-anchor="middle">${kort}</text>`;

const svg = `<svg class="porie" viewBox="0 0 600 480" role="img" aria-label="Doorsnede van de huid: links een gezonde porie waar talg vrij naar buiten loopt, rechts een porie die verstopt is met talg en afgestorven huidcellen, met een ontsteking eromheen">
  <defs>
    <radialGradient id="po-ontsteking" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D4806B" stop-opacity=".40"/>
      <stop offset="60%" stop-color="#D4806B" stop-opacity=".14"/>
      <stop offset="100%" stop-color="#D4806B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="480" fill="#F9F7F6"/>
${lagen}

  <!-- links: gezonde porie -->
  <path d="${kanaal(180, 7, 13, 292)}" fill="${LUMEN}" stroke="${LIJN}" stroke-width="1.5"/>
  ${klier(180, 300, 16)}
  <g fill="${TALG}"><circle cx="180" cy="268" r="4"/><circle cx="178" cy="242" r="3.4"/><circle cx="182" cy="216" r="2.8"/><circle cx="180" cy="190" r="2.4"/></g>
  <path d="M180,290 C178,244 182,182 180,122 C179,106 176,96 171,88" fill="none" stroke="${DONKER}" stroke-width="1.7" stroke-linecap="round"/>

  <!-- rechts: verstopte porie -->
  <circle cx="418" cy="160" r="112" fill="url(#po-ontsteking)"/>
  <path d="${kanaal(418, 14, 24, 292)}" fill="${TALG}" stroke="${LIJN}" stroke-width="1.5"/>
  ${klier(418, 300, 21)}
  <g fill="${LIJN}" opacity=".55"><circle cx="411" cy="214" r="2.4"/><circle cx="426" cy="232" r="2.4"/><circle cx="413" cy="252" r="2.4"/><circle cx="427" cy="270" r="2.4"/></g>
  <path d="M398,152 C398,134 438,134 438,152 Z" fill="${PROP}"/>
  <path d="M394,121 C396,99 440,99 442,121 Z" fill="#E3A08B" stroke="${LIJN}" stroke-width="1.5"/>
  <ellipse cx="418" cy="105" rx="7" ry="4.5" fill="${TALG}" opacity=".9"/>

  ${kop(180, 'GEZONDE PORIE', 'talg loopt vrij naar buiten', 'talg loopt vrij')}
  ${kop(418, 'VERSTOPTE PORIE', 'talg hoopt zich op en ontsteekt', 'talg hoopt op')}
</svg>`;

const pagina = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Illustratie porie — Huidzorg Mozi</title>
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="css/mozi.css">
<style>
  .proef{max-width:720px;margin:0 auto;padding:40px var(--gutter) 80px}
  .kader{border-radius:var(--r-media);overflow:hidden;aspect-ratio:4/3.2;background:var(--surface)}
  .kader svg{width:100%;height:100%;display:block}
</style>
</head>
<body>
<div class="preview-note">Illustratie "wat is acne" &middot; <a href="./">terug naar home</a></div>
<div class="proef">
  <div class="kader">${svg}</div>
</div>
</body>
</html>
`;

if (require.main === module) {
  fs.writeFileSync(path.join(root, 'preview/porie.html'), pagina);
  console.log('preview/porie.html geschreven');
}
module.exports = { svg };
