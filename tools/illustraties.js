// Tekeningen voor de uitleg op de behandelpagina's: doorsneden van de huid in dezelfde
// lijn als de huidlagen-illustratie bij SkinPen. Vlakke huidtinten, dunne lijnen, geen
// kleur buiten de huisstijl behalve waar de kleur zelf de uitleg is (rood en blauw licht).
// Verhouding 5:4, gelijk aan .t-visual (4/3.2).
// Gebruik: node tools/illustraties.js   → schrijft preview/illustraties.html om te bekijken.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

// Huidtinten uit de bestaande illustratie, zodat alles bij elkaar past.
const EPIDERMIS = '#E7C9B4';
const DERMIS = '#F1DACB';
const SUBCUTIS = '#F7E8DD';
const LUMEN = '#FBF3EA';
const LIJN = '#C98A7A';
const TALG = '#E8D3B2';
const PROP = '#C7A379';
const DONKER = '#1C1B19';
const ROOD = '#C4584A';
const BLAUW = '#5B6E93';

// De huidlagen worden over elkaar heen getekend (dermis eerst, epidermis erbovenop),
// zodat er geen lichte streep tussen de twee vlakken kan ontstaan.
// top = waar het huidoppervlak ligt.
function lagen(top) {
  const grens = top + 84;
  const onder = top + 292;
  return `
  <rect y="${grens - 18}" width="600" height="${onder - grens + 18}" fill="${DERMIS}"/>
  <rect y="${onder}" width="600" height="${480 - onder}" fill="${SUBCUTIS}"/>
  <g fill="#EFD9C9"><circle cx="56" cy="${onder + 44}" r="21"/><circle cx="124" cy="${onder + 58}" r="16"/><circle cx="492" cy="${onder + 46}" r="23"/><circle cx="560" cy="${onder + 62}" r="15"/></g>
  <path d="M0,${top} C120,${top - 6} 200,${top + 4} 300,${top - 2} S470,${top - 8} 600,${top}
    L600,${grens} C470,${grens - 6} 380,${grens + 6} 300,${grens} S120,${grens - 6} 0,${grens + 4} Z" fill="${EPIDERMIS}"/>`;
}

// Lettergroottes staan in mozi.css, niet hier: op een smal scherm krimpt de hele tekening
// mee en zou 13 eenheden op zo'n 8 px uitkomen. Daar wordt de tekst groter gezet, en dan
// past het lange bijschrift niet meer naast het andere — vandaar een korte variant.
const kop = (x, t, lang, kort, y = 54) =>
  `<text class="lab" x="${x}" y="${y}" text-anchor="middle">${t}</text>` +
  (lang ? `<text class="cap cap-lang" x="${x}" y="${y + 26}" text-anchor="middle">${lang}</text>
   <text class="cap cap-kort" x="${x}" y="${y + 28}" text-anchor="middle">${kort || lang}</text>` : '');

const omhul = (etiket, inhoud) =>
  `<svg class="ill" viewBox="0 0 600 480" role="img" aria-label="${etiket}">${inhoud}</svg>`;

/* ---------------------------------------------- Acne: porie ---------------------------- */

function kanaal(mid, hals, buik, bodem) {
  return `M${mid - hals - 14},120 C${mid - hals - 10},142 ${mid - buik},150 ${mid - buik},166` +
    ` L${mid - buik},${bodem - 14} Q${mid - buik},${bodem} ${mid},${bodem}` +
    ` Q${mid + buik},${bodem} ${mid + buik},${bodem - 14} L${mid + buik},166` +
    ` C${mid + buik},150 ${mid + hals + 10},142 ${mid + hals + 14},120 Z`;
}

function klier(mid, y, maat) {
  return `<g fill="${SUBCUTIS}" stroke="${LIJN}" stroke-width="1.5">
      <ellipse cx="${mid - maat - 3}" cy="${y}" rx="${maat + 3}" ry="${maat}"/>
      <ellipse cx="${mid + maat + 3}" cy="${y}" rx="${maat + 3}" ry="${maat}"/>
      <ellipse cx="${mid}" cy="${y + maat * 0.8}" rx="${maat + 1}" ry="${maat * 0.85}"/>
    </g>`;
}

const porie = omhul(
  'Doorsnede van de huid: links een gezonde porie waar talg vrij naar buiten loopt, rechts een porie die verstopt is met talg en afgestorven huidcellen, met een ontsteking eromheen',
  `
  <defs>
    <radialGradient id="po-ontsteking" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D4806B" stop-opacity=".40"/>
      <stop offset="60%" stop-color="#D4806B" stop-opacity=".14"/>
      <stop offset="100%" stop-color="#D4806B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="480" fill="#F9F7F6"/>
${lagen(122)}

  <path d="${kanaal(180, 7, 13, 292)}" fill="${LUMEN}" stroke="${LIJN}" stroke-width="1.5"/>
  ${klier(180, 300, 16)}
  <g fill="${TALG}"><circle cx="180" cy="268" r="4"/><circle cx="178" cy="242" r="3.4"/><circle cx="182" cy="216" r="2.8"/><circle cx="180" cy="190" r="2.4"/></g>
  <path d="M180,290 C178,244 182,182 180,122 C179,106 176,96 171,88" fill="none" stroke="${DONKER}" stroke-width="1.7" stroke-linecap="round"/>

  <circle cx="418" cy="160" r="112" fill="url(#po-ontsteking)"/>
  <path d="${kanaal(418, 14, 24, 292)}" fill="${TALG}" stroke="${LIJN}" stroke-width="1.5"/>
  ${klier(418, 300, 21)}
  <g fill="${LIJN}" opacity=".55"><circle cx="411" cy="214" r="2.4"/><circle cx="426" cy="232" r="2.4"/><circle cx="413" cy="252" r="2.4"/><circle cx="427" cy="270" r="2.4"/></g>
  <path d="M398,152 C398,134 438,134 438,152 Z" fill="${PROP}"/>
  <path d="M394,121 C396,99 440,99 442,121 Z" fill="#E3A08B" stroke="${LIJN}" stroke-width="1.5"/>
  <ellipse cx="418" cy="105" rx="7" ry="4.5" fill="${TALG}" opacity=".9"/>

  ${kop(180, 'GEZONDE PORIE', 'talg loopt vrij naar buiten', 'talg loopt vrij')}
  ${kop(418, 'VERSTOPTE PORIE', 'talg hoopt zich op en ontsteekt', 'talg hoopt op')}`);

/* ---------------------------------------------- Ontharen: haarzakje -------------------- */
// Eén haarzakje in doorsnede. De bundel licht valt in, het pigment in de haar neemt het op
// en de warmte komt uit bij de haarwortel. Daarnaast een zakje zonder haar, dat laat zien
// waarom er meer behandelingen nodig zijn: alleen een haar in de groeifase reageert.

function haarzakjeVorm(mid, diep, hoek) {
  const b = 15;
  return `M${mid - b - 10},146 C${mid - b - 6},168 ${mid - b},176 ${mid - b + hoek * 0.2},196` +
    ` L${mid - b + hoek},${diep - 16} Q${mid - b + hoek},${diep} ${mid + hoek},${diep}` +
    ` Q${mid + b + hoek},${diep} ${mid + b + hoek},${diep - 16} L${mid + b + hoek * 0.2},196` +
    ` C${mid + b},176 ${mid + b + 6},168 ${mid + b + 10},146 Z`;
}

const haarzakje = omhul(
  'Doorsnede van de huid met twee haarzakjes: in het linker zakje neemt het pigment van de haar het laserlicht op, waardoor de haarwortel verhit wordt; het rechter zakje is leeg en reageert niet',
  `
  <defs>
    <radialGradient id="hz-warmte" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D4806B" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#D4806B" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="hz-inval" cx="50%" cy="100%" r="80%">
      <stop offset="0%" stop-color="${DONKER}" stop-opacity=".13"/>
      <stop offset="100%" stop-color="${DONKER}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hz-straal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${DONKER}" stop-opacity=".14"/>
      <stop offset="100%" stop-color="${DONKER}" stop-opacity=".58"/>
    </linearGradient>
  </defs>
  <rect width="600" height="480" fill="#F9F7F6"/>

  <ellipse cx="190" cy="146" rx="96" ry="62" fill="url(#hz-inval)"/>
  <g stroke="url(#hz-straal)" stroke-width="1.5" stroke-linecap="round">
    <line x1="118" y1="84" x2="124" y2="144"/><line x1="142" y1="84" x2="146" y2="144"/>
    <line x1="166" y1="84" x2="168" y2="144"/><line x1="190" y1="84" x2="190" y2="144"/>
    <line x1="214" y1="84" x2="212" y2="144"/><line x1="238" y1="84" x2="234" y2="144"/>
    <line x1="262" y1="84" x2="256" y2="144"/>
  </g>
${lagen(146)}

  <circle cx="196" cy="368" r="74" fill="url(#hz-warmte)"/>
  <path d="${haarzakjeVorm(190, 364, 14)}" fill="${LUMEN}" stroke="${LIJN}" stroke-width="1.5"/>
  <ellipse cx="204" cy="366" rx="19" ry="15" fill="${SUBCUTIS}" stroke="${LIJN}" stroke-width="1.5"/>
  <path d="M203,372 C200,320 192,250 188,196 C186,170 184,158 182,146 C180,130 177,118 172,108"
    fill="none" stroke="${DONKER}" stroke-width="4" stroke-linecap="round"/>
  ${klier(234, 262, 13)}

  <path d="${haarzakjeVorm(430, 330, 10)}" fill="${LUMEN}" stroke="${LIJN}" stroke-width="1.5" stroke-dasharray="5 5"/>
  <ellipse cx="440" cy="332" rx="15" ry="12" fill="${SUBCUTIS}" stroke="${LIJN}" stroke-width="1.5" stroke-dasharray="5 5"/>
  ${klier(468, 246, 11)}

  ${kop(190, 'HAAR IN GROEI', 'het pigment neemt het licht op', 'neemt licht op')}
  ${kop(434, 'ZAKJE IN RUST', 'reageert niet, komt later aan de beurt', 'komt later')}`);

/* ---------------------------------------------- LED: indringdiepte --------------------- */
// Waarom twee kleuren licht: blauw blijft in de opperhuid, rood komt tot in de lederhuid.

const licht = omhul(
  'Doorsnede van de huid die laat zien hoe diep licht doordringt: blauw licht blijft in de opperhuid, rood licht komt tot in de lederhuid',
  `
  <defs>
    <radialGradient id="li-blauw" cx="50%" cy="0%" r="100%">
      <stop offset="0%" stop-color="${BLAUW}" stop-opacity=".42"/>
      <stop offset="65%" stop-color="${BLAUW}" stop-opacity=".16"/>
      <stop offset="100%" stop-color="${BLAUW}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="li-rood" cx="50%" cy="0%" r="100%">
      <stop offset="0%" stop-color="${ROOD}" stop-opacity=".38"/>
      <stop offset="65%" stop-color="${ROOD}" stop-opacity=".15"/>
      <stop offset="100%" stop-color="${ROOD}" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="li-huid"><rect y="150" width="600" height="330"/></clipPath>
  </defs>
  <rect width="600" height="480" fill="#F9F7F6"/>
${lagen(150)}

  <g clip-path="url(#li-huid)">
    <ellipse cx="173" cy="150" rx="104" ry="98" fill="url(#li-blauw)"/>
    <ellipse cx="427" cy="150" rx="112" ry="244" fill="url(#li-rood)"/>
  </g>

  <g stroke="${BLAUW}" stroke-width="2.4" stroke-linecap="round">
    <line x1="110" y1="100" x2="110" y2="150"/><line x1="152" y1="100" x2="152" y2="150"/>
    <line x1="194" y1="100" x2="194" y2="150"/><line x1="236" y1="100" x2="236" y2="150"/>
  </g>
  <g stroke="${ROOD}" stroke-width="2.4" stroke-linecap="round">
    <line x1="364" y1="100" x2="364" y2="150"/><line x1="406" y1="100" x2="406" y2="150"/>
    <line x1="448" y1="100" x2="448" y2="150"/><line x1="490" y1="100" x2="490" y2="150"/>
  </g>

  <g stroke-dasharray="4 5" stroke-width="1.6" fill="none">
    <path d="M96,244 L250,244" stroke="${BLAUW}"/>
    <path d="M348,390 L506,390" stroke="${ROOD}"/>
  </g>
  <text class="cap" x="173" y="266" text-anchor="middle" fill="${BLAUW}" opacity=".95">tot in de opperhuid</text>
  <text class="cap" x="427" y="412" text-anchor="middle" fill="${ROOD}" opacity=".95">tot in de lederhuid</text>

  ${kop(173, 'BLAUW LICHT', 'pakt de bacterie bij acne aan', 'bij acne')}
  ${kop(427, 'ROOD LICHT', 'stimuleert herstel en collageen', 'voor herstel')}`);

/* ---------------------------------------------- Huidverhevenheden: wratjes ------------- */
// Twee verhevenheden die er heel verschillend uitzien en allebei veilig weg te halen zijn.

const wratje = omhul(
  'Doorsnede van de huid met links een steelwratje op een dun steeltje en rechts een ouderdomswratje dat als een ruw plaatje op de huid ligt',
  `
  <rect width="600" height="480" fill="#F9F7F6"/>
${lagen(236)}

  <path d="M176,240 C173,212 170,196 173,176" fill="none" stroke="${EPIDERMIS}" stroke-width="15" stroke-linecap="round"/>
  <path d="M176,240 C173,212 170,196 173,176" fill="none" stroke="${LIJN}" stroke-width="1.5" stroke-linecap="round" opacity=".55"/>
  <path d="M176,236 C174,210 171,196 173,180" fill="none" stroke="#C9736A" stroke-width="2" stroke-linecap="round" opacity=".7"/>
  <ellipse cx="168" cy="140" rx="44" ry="38" fill="${EPIDERMIS}" stroke="${LIJN}" stroke-width="1.6"/>
  <path d="M142,126 C154,118 162,124 170,114" fill="none" stroke="${LIJN}" stroke-width="1.3" opacity=".6"/>
  <path d="M146,152 C160,142 176,150 192,138" fill="none" stroke="${LIJN}" stroke-width="1.3" opacity=".6"/>

  <path d="M352,238 C354,190 380,162 428,162 C476,162 504,186 506,238 Z" fill="${PROP}" stroke="${LIJN}" stroke-width="1.6"/>
  <g stroke="${DONKER}" stroke-width="1.3" opacity=".3" stroke-linecap="round">
    <line x1="374" y1="226" x2="384" y2="200"/><line x1="398" y1="230" x2="406" y2="192"/>
    <line x1="424" y1="232" x2="430" y2="186"/><line x1="450" y1="230" x2="456" y2="190"/>
    <line x1="476" y1="226" x2="482" y2="200"/>
  </g>
  <path d="M356,210 C382,196 402,206 426,192 C450,180 478,192 502,204" fill="none" stroke="${LIJN}" stroke-width="1.3" opacity=".75"/>
  <path d="M360,228 C388,216 408,224 432,212 C456,202 480,210 502,220" fill="none" stroke="${LIJN}" stroke-width="1.3" opacity=".5"/>

  ${kop(166, 'STEELWRATJE', 'zacht velletje op een dun steeltje', 'op een steeltje')}
  ${kop(430, 'OUDERDOMSWRATJE', 'ruw plaatje dat op de huid ligt', 'ligt op de huid')}`);

/* ---------------------------------------------- Laser: vaatje en pigment --------------- */
// Waarom laserlicht selectief werkt: het wordt opgenomen door wat donker of rood is,
// en laat de huid eromheen met rust.

// Bundel fijne stralen die naar het midden toe knijpen, met een zachte gloed waar ze
// de huid raken. Elke tekening heeft een eigen voorvoegsel, anders botsen de id's
// zodra er meer tekeningen op één pagina staan.
function bundel(mid, breed, top, tot, id) {
  const n = 7, stap = (breed * 2) / (n - 1);
  let l = '';
  for (let i = 0; i < n; i++) {
    const x = mid - breed + i * stap;
    l += '<line x1="' + x + '" y1="' + top + '" x2="' + (mid - (mid - x) * 0.86) + '" y2="' + tot + '"/>';
  }
  return `<ellipse cx="${mid}" cy="${tot}" rx="${breed + 8}" ry="${(tot - top) * 0.8}" fill="url(#${id}-inval)"/>
  <g stroke="url(#${id}-straal)" stroke-width="1.5" stroke-linecap="round">${l}</g>`;
}

const straalDefs = id => `
    <radialGradient id="${id}-inval" cx="50%" cy="100%" r="80%">
      <stop offset="0%" stop-color="${DONKER}" stop-opacity=".12"/>
      <stop offset="100%" stop-color="${DONKER}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="${id}-straal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${DONKER}" stop-opacity=".12"/>
      <stop offset="100%" stop-color="${DONKER}" stop-opacity=".52"/>
    </linearGradient>`;

const vaatje = omhul(
  'Doorsnede van de huid: links neemt een verwijd bloedvaatje het laserlicht op en sluit het, rechts valt een pigmentvlek in de opperhuid uiteen',
  `
  <defs>${straalDefs('va')}
    <radialGradient id="va-warm" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D4806B" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#D4806B" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="480" fill="#F9F7F6"/>
  ${bundel(168, 74, 84, 150, 'va')}
  ${bundel(432, 74, 84, 150, 'va')}
${lagen(150)}

  <circle cx="186" cy="290" r="58" fill="url(#va-warm)"/>
  <path d="M34,298 C80,292 112,310 152,302" fill="none" stroke="#C9736A" stroke-width="13" stroke-linecap="round" opacity=".85"/>
  <path d="M152,302 C178,296 198,292 216,294" fill="none" stroke="#C9736A" stroke-width="5" stroke-linecap="round" opacity=".6"/>
  <path d="M216,294 C246,296 270,290 298,286" fill="none" stroke="#C9736A" stroke-width="2" stroke-linecap="round" opacity=".4" stroke-dasharray="6 7"/>

  <g fill="#8C6B52">
    <circle cx="396" cy="188" r="5.4"/><circle cx="416" cy="198" r="6.4"/><circle cx="438" cy="190" r="5"/>
    <circle cx="458" cy="200" r="6"/><circle cx="406" cy="212" r="4.6"/><circle cx="446" cy="214" r="5.2"/>
    <circle cx="470" cy="184" r="4.2"/>
  </g>
  <g fill="#8C6B52" opacity=".45">
    <circle cx="398" cy="138" r="3.4"/><circle cx="424" cy="126" r="2.8"/><circle cx="452" cy="134" r="3"/><circle cx="470" cy="120" r="2.4"/>
  </g>

  ${kop(168, 'VERWIJD VAATJE', 'het licht sluit het vaatje', 'vaatje sluit')}
  ${kop(432, 'PIGMENTVLEK', 'het pigment valt uiteen en komt los', 'pigment valt uiteen')}`);

/* ---------------------------------------------- Schimmelnagels: de nagel --------------- */
// Crème en lak komen niet door de nagelplaat heen; licht wel. Teen van opzij gezien.

const nagel = omhul(
  'Doorsnede van een teen van opzij: het laserlicht gaat door de nagelplaat heen en bereikt de schimmel die daaronder zit',
  `
  <defs>${straalDefs('na')}
    <radialGradient id="na-warm" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D4806B" stop-opacity=".5"/>
      <stop offset="100%" stop-color="#D4806B" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="na-teen">
      <path d="M60,238 L396,238 A93,93 0 0 1 396,424 L60,424 Z"/>
    </clipPath>
  </defs>
  <rect width="600" height="480" fill="#F9F7F6"/>
  ${bundel(330, 96, 114, 238, 'na')}

  <path d="M60,238 L396,238 A93,93 0 0 1 396,424 L60,424 Z" fill="${DERMIS}"/>
  <g clip-path="url(#na-teen)">
    <rect y="336" width="600" height="110" fill="${SUBCUTIS}"/>
    <rect x="60" y="316" width="540" height="22" fill="${LUMEN}"/>
    <path d="M600,286 L600,318 L190,318 C290,314 450,300 600,286 Z" fill="${PROP}"/>
    <g fill="${DONKER}" opacity=".26"><circle cx="300" cy="308" r="3.2"/><circle cx="360" cy="304" r="3.6"/><circle cx="418" cy="300" r="3.2"/><circle cx="468" cy="297" r="3.8"/><circle cx="518" cy="295" r="3.2"/></g>
    <circle cx="430" cy="302" r="74" fill="url(#na-warm)"/>
    <rect x="60" y="236" width="540" height="52" fill="#FDFAF5" opacity=".95"/>
    <path d="M60,288 L600,288" stroke="${LIJN}" stroke-width="1.6" fill="none"/>
    <path d="M86,252 L560,252" stroke="#FFFFFF" stroke-width="5" opacity=".7" fill="none"/>
    <g stroke="${DONKER}" stroke-width="1.5" stroke-linecap="round" opacity=".26">
      <line x1="272" y1="240" x2="270" y2="306"/><line x1="330" y1="240" x2="328" y2="302"/><line x1="388" y1="240" x2="386" y2="299"/>
    </g>
  </g>
  <path d="M60,238 L396,238 A93,93 0 0 1 396,424 L60,424" fill="none" stroke="${LIJN}" stroke-width="1.6"/>

  ${kop(300, 'DOOR DE NAGEL HEEN', 'cr&egrave;me komt er niet door, licht wel', 'licht komt er wel door')}`);

/* --------------------------------------------------------------------------------------- */

const alle = { porie, haarzakje, licht, wratje, vaatje, nagel };

const titels = {
  porie: ['Acnetherapie', 'Gezonde porie naast een verstopte porie'],
  haarzakje: ['Laserontharing', 'Waarom het licht alleen een haar in de groeifase pakt'],
  licht: ['LED-therapie Lumi8', 'Hoe diep blauw en rood licht komen'],
  wratje: ['Huidverhevenheden', 'Steelwratje naast een ouderdomswratje'],
  vaatje: ['Laser bij vaatjes & pigment', 'Waarom het licht alleen het vaatje en het pigment raakt'],
  nagel: ['Schimmelnagels', 'Licht komt wel door de nagelplaat, cr&egrave;me niet']
};

const pagina = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Illustraties — Huidzorg Mozi</title>
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="css/mozi.css">
<style>
  .vgl{max-width:1240px;margin:0 auto;padding:36px var(--gutter) 90px;display:grid;gap:34px}
  @media (min-width:880px){.vgl{grid-template-columns:repeat(2,minmax(0,1fr));gap:40px}}
  .vgl h2{font-family:var(--font-display);font-size:24px;font-weight:500;margin:0 0 2px;color:var(--ink)}
  .vgl .uitleg{margin:0 0 14px;font-size:14px;color:var(--muted);min-height:2.6em}
</style>
</head>
<body>
<div class="preview-note">Illustraties voor de uitleg op de behandelpagina's &middot; <a href="./">terug naar home</a></div>
<div class="vgl">
${Object.keys(alle).map(k => `  <section>
    <h2>${titels[k][0]}</h2>
    <p class="uitleg">${titels[k][1]}</p>
    <div class="t-visual">${alle[k]}</div>
  </section>`).join('\n')}
</div>
</body>
</html>
`;

if (require.main === module) {
  fs.writeFileSync(path.join(root, 'preview/illustraties.html'), pagina);
  console.log('preview/illustraties.html geschreven: ' + Object.keys(alle).length + ' illustraties');
}
module.exports = alle;
