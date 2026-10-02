// Tekent de SVG's voor de lichaamskaart (gezicht, voorkant, achterkant) en zet ze in preview/lichaamskaart.html.
// Stijl: neutraal silhouet, lichtgrijze vulling, grijze contour, subtiele anatomische lijntjes.
// De zones worden uitgeknipt op het silhouet (clipPath), zodat ze de vorm van het lichaam volgen.
// Eén helft wordt getekend; het script spiegelt die rond de middenlijn, zodat de figuur symmetrisch is.
// Gebruik: node tools/teken-lichaamskaart.js
const fs = require('fs');
const path = require('path');
const bestand = path.resolve(__dirname, '../preview/lichaamskaart.html');

const r = n => Math.round(n * 10) / 10;
// Halve contour: startpunt + reeks kubische segmenten [c1x,c1y, c2x,c2y, x,y]; gespiegeld rond xm.
function silhouet(start, segs, xm) {
  let d = `M${start[0]},${start[1]}`;
  segs.forEach(s => { d += ` C${s[0]},${s[1]} ${s[2]},${s[3]} ${s[4]},${s[5]}`; });
  // Spiegelen en in omgekeerde volgorde terug naar het startpunt
  const pts = [start, ...segs.map(s => [s[4], s[5]])];
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i], p0 = pts[i];
    const m = x => r(2 * xm - x);
    d += ` C${m(s[2])},${s[3]} ${m(s[0])},${s[1]} ${m(p0[0])},${p0[1]}`;
  }
  return d + ' Z';
}
const spiegelRect = (x, y, w, h, xm) => [[x, y, w, h], [r(2 * xm - x - w), y, w, h]];

// ---------- Lichaam (viewBox 0 0 300 680), rechterhelft vanaf de kruin ----------
const LICHAAM = silhouet([150, 22], [
  [171, 22, 182, 38, 182, 60],       // schedel
  [182, 82, 172, 98, 162, 103],      // kaak
  [162, 108, 162, 114, 163, 119],    // hals
  [170, 128, 194, 131, 209, 138],    // schouderlijn
  [221, 145, 226, 165, 226, 190],    // schouder / deltaspier
  [228, 228, 230, 260, 232, 286],    // bovenarm buitenkant
  [235, 320, 237, 346, 238, 368],    // onderarm buitenkant
  [242, 380, 245, 396, 242, 409],    // hand buitenkant
  [239, 421, 228, 423, 225, 410],    // vingertoppen
  [222, 396, 221, 382, 222, 370],    // hand binnenkant
  [221, 348, 218, 320, 214, 289],    // onderarm binnenkant
  [210, 252, 204, 216, 198, 186],    // bovenarm binnenkant tot oksel
  [195, 182, 193, 186, 192, 192],    // oksel
  [190, 222, 186, 250, 186, 270],    // flank tot taille
  [186, 296, 196, 316, 198, 342],    // heup
  [200, 392, 191, 442, 186, 482],    // bovenbeen buitenkant tot knie
  [191, 522, 187, 572, 177, 616],    // kuit
  [177, 630, 187, 644, 185, 652],    // enkel / voet
  [182, 661, 161, 661, 157, 652],    // voetzool
  [155, 640, 158, 628, 158, 615],    // binnenenkel
  [158, 570, 160, 520, 158, 483],    // binnenkant onderbeen
  [158, 440, 156, 392, 150, 364]     // binnenkant bovenbeen tot kruis
], 150);

const lijnVoor = [
  'M128,132 Q140,128 147,131', 'M172,132 Q160,128 153,131',         // sleutelbeenderen
  'M150,282 m-2,0 a2,2 0 1,0 4,0 a2,2 0 1,0 -4,0',                  // navel
  'M150,364 L150,352',                                               // kruis
  'M166,486 Q172,490 178,486', 'M134,486 Q128,490 122,486'           // knieën
];
const lijnAchter = [
  'M150,128 L150,296',                                               // wervelkolom
  'M126,160 Q132,178 128,196', 'M174,160 Q168,178 172,196',          // schouderbladen
  'M118,330 Q134,352 150,344 Q166,352 182,330',                      // billen
  'M150,344 L150,362',
  'M166,476 Q172,472 178,476', 'M134,476 Q128,472 122,476'           // knieholtes
];

// Zones (rechthoeken/ellipsen, uitgeknipt op het silhouet) + positie van het stipje
const zonesVoor = {
  hals:      { rect: [[136, 100, 28, 24]], stip: [150, 112] },
  borst:     { rect: [[104, 124, 92, 90]], stip: [150, 168] },
  buik:      { rect: [[106, 214, 88, 86]], stip: [132, 250] },
  navel:     { rect: [[145, 288, 10, 30]], stip: [150, 304] },
  bikini:    { rect: [[108, 300, 84, 64]], stip: [150, 332] },
  oksels:    { ell: [[197, 190, 8, 12], [103, 190, 8, 12]], stip: [196, 196], stip2: [104, 196] },
  bovenarm:  { rect: spiegelRect(198, 136, 40, 150, 150), stip: [216, 220], stip2: [84, 220] },
  onderarm:  { rect: spiegelRect(200, 286, 50, 84, 150), stip: [226, 330], stip2: [74, 330] },
  bovenbeen: { rect: spiegelRect(150, 364, 52, 118, 150), stip: [176, 420], stip2: [124, 420] },
  onderbeen: { rect: spiegelRect(150, 482, 48, 134, 150), stip: [172, 548], stip2: [128, 548] },
  voeten:    { rect: spiegelRect(150, 616, 40, 48, 150), stip: [172, 642], stip2: [128, 642] }
};
const zonesAchter = {
  hals:      { rect: [[136, 100, 28, 24]], stip: [150, 112] },
  rug:       { rect: [[104, 122, 92, 178]], stip: [150, 230] },
  bovenarm:  zonesVoor.bovenarm, onderarm: zonesVoor.onderarm,
  bovenbeen: { rect: spiegelRect(150, 364, 52, 118, 150), stip: [176, 410], stip2: [124, 410] },
  onderbeen: zonesVoor.onderbeen, voeten: zonesVoor.voeten
};

// ---------- Gezicht (viewBox 0 0 320 380) ----------
const HOOFD = silhouet([160, 34], [
  [198, 34, 226, 58, 230, 100],      // schedel tot slaap
  [233, 128, 232, 152, 228, 178],    // slaap tot jukbeen
  [224, 206, 214, 232, 200, 250],    // wang tot kaakhoek
  [186, 268, 174, 281, 160, 282]     // kaaklijn tot kin
], 160);
const NEK = 'M118,250 C120,276 117,298 108,318 C86,332 56,338 30,352 L30,380 L290,380 L290,352 C264,338 234,332 212,318 C203,298 200,276 202,250 Z';
const OOR_R = 'M231,140 C244,134 254,148 252,168 C250,188 242,202 230,198 C232,180 233,160 231,140 Z';
const OOR_L = 'M89,140 C76,134 66,148 68,168 C70,188 78,202 90,198 C88,180 87,160 89,140 Z';
const lijnGezicht = [
  'M118,140 Q132,132 148,138', 'M172,138 Q188,132 202,140',                     // wenkbrauwen
  'M120,162 Q133,153 146,162 Q133,168 120,162 Z', 'M174,162 Q187,153 200,162 Q187,168 174,162 Z', // ogen
  'M157,170 C155,190 150,198 152,204 Q160,210 168,204 C170,198 165,190 163,170', // neus
  'M141,236 Q151,230 160,234 Q169,230 179,236 Q160,247 141,236 Z',             // lippen
  'M240,154 Q246,166 240,182', 'M80,154 Q74,166 80,182',                         // oorschelp
  'M130,268 Q138,300 152,332', 'M190,268 Q182,300 168,332',                       // halsspieren
  'M150,344 Q122,338 94,343', 'M170,344 Q198,338 226,343'                         // sleutelbeenderen
];
const zonesGezicht = {
  wenkbrauwen:      { rect: [[148, 126, 24, 24]], rx: 11, stip: [160, 138], clip: 'hoofd' },
  bakkebaarden:     { rect: spiegelRect(206, 128, 26, 74, 160), rx: 12, stip: [219, 160], stip2: [101, 160], clip: 'hoofd' },
  jukbeen:          { ell: [[204, 214, 20, 24], [116, 214, 20, 24]], stip: [206, 214], stip2: [114, 214], clip: 'hoofd' },
  bovenlip:         { rect: [[140, 210, 40, 22]], rx: 11, stip: [160, 221], clip: 'hoofd' },
  kin:              { rect: [[132, 248, 56, 40]], rx: 18, stip: [160, 266], clip: 'hoofd' },
  oren:             { pad: [OOR_R, OOR_L], stip: [242, 168], stip2: [78, 168] },
  'baardlijn-hals': { rect: [[108, 250, 104, 44]], stip: [160, 292], clip: 'nek' },
  hals:             { pad: ['M112,294 L208,294 C209,306 210,316 213,322 Q160,338 107,322 C110,316 111,306 112,294 Z'], stip: [160, 312], clip: 'nek' }
};

// ---------- SVG opbouwen ----------
function zoneVormen(id, z) {
  const v = [];
  (z.rect || []).forEach(([x, y, w, h]) => v.push(`<rect class="z" data-zone="${id}" x="${x}" y="${y}" width="${w}" height="${h}"${z.rx ? ` rx="${z.rx}"` : ''}/>`));
  (z.ell || []).forEach(([cx, cy, rx, ry]) => v.push(`<ellipse class="z" data-zone="${id}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}"/>`));
  (z.pad || []).forEach(d => v.push(`<path class="z" data-zone="${id}" d="${d}"/>`));
  return v.join('');
}
// Breedtefactor voor het lichaam (figuur iets breder dan getekend; lijndikte blijft gelijk)
const BREED = 1.18;
const stippen = (zones, f = 1, xm = 150) => Object.entries(zones).map(([id, z]) =>
  [z.stip, z.stip2].filter(Boolean).map(([x, y]) => `<circle class="stip" data-zone="${id}" cx="${r(xm + (x - xm) * f)}" cy="${y}" r="3.6"/>`).join('')).join('');
const lijnen = l => l.map(d => `<path class="lijn" d="${d}"/>`).join('');

function lichaamSvg(view, label, zones, extraLijnen, hoofdKlik) {
  const clip = `clip-${view}`;
  return `<svg data-view="${view}" viewBox="26 10 248 664" role="img" aria-label="${label}">
            <defs><clipPath id="${clip}"><path d="${LICHAAM}"/></clipPath></defs>
            <g transform="translate(150 0) scale(${BREED} 1) translate(-150 0)">
              <path class="sil" d="${LICHAAM}"/>
              <g clip-path="url(#${clip})">${Object.entries(zones).map(([id, z]) => zoneVormen(id, z)).join('')}</g>
              ${lijnen(extraLijnen)}
              ${hoofdKlik ? '<ellipse class="bk-hoofd" cx="150" cy="62" rx="32" ry="40"><title>Naar het gezicht</title></ellipse>' : ''}
            </g>
            ${stippen(zones, BREED)}
          </svg>`;
}
const gezichtZonesHoofd = Object.fromEntries(Object.entries(zonesGezicht).filter(([, z]) => z.clip === 'hoofd'));
const gezichtZonesNek = Object.fromEntries(Object.entries(zonesGezicht).filter(([, z]) => z.clip === 'nek'));
const gezichtSvg = `<svg data-view="gezicht" class="on" viewBox="30 24 260 356" role="img" aria-label="Tekening van het gezicht met aanklikbare zones">
            <defs><clipPath id="clip-hoofd"><path d="${HOOFD}"/></clipPath><clipPath id="clip-nek"><path d="${NEK}"/></clipPath></defs>
            <path class="sil" d="${NEK}"/>
            <g clip-path="url(#clip-nek)">${Object.entries(gezichtZonesNek).map(([id, z]) => zoneVormen(id, z)).join('')}</g>
            <path class="sil" d="${OOR_R}"/><path class="sil" d="${OOR_L}"/>
            ${zoneVormen('oren', zonesGezicht.oren)}
            <path class="sil" d="${HOOFD}"/>
            <g clip-path="url(#clip-hoofd)">${Object.entries(gezichtZonesHoofd).map(([id, z]) => zoneVormen(id, z)).join('')}</g>
            ${lijnen(lijnGezicht)}
            ${stippen(zonesGezicht)}
          </svg>`;

const svgs = [
  gezichtSvg,
  lichaamSvg('voorkant', 'Tekening van de voorkant van het lichaam met aanklikbare zones', zonesVoor, lijnVoor, true),
  lichaamSvg('achterkant', 'Tekening van de achterkant van het lichaam met aanklikbare zones', zonesAchter, lijnAchter, false)
].join('\n\n          ');

module.exports = { svgs };

if (require.main === module) {
  let html = fs.readFileSync(bestand, 'utf8');
  const begin = html.indexOf('<div class="bk-fig">');
  const eind = html.indexOf('</div>\n\n        <aside class="bk-panel"');
  if (begin < 0 || eind < 0 || eind < begin) throw new Error('Markeringen in lichaamskaart.html niet gevonden');
  html = html.slice(0, begin) + '<div class="bk-fig">\n          ' + svgs + '\n        ' + html.slice(eind);
  fs.writeFileSync(bestand, html);
  console.log('Lichaamskaart getekend: 3 weergaven, ' + (Object.keys(zonesVoor).length + Object.keys(zonesAchter).length + Object.keys(zonesGezicht).length) + ' zone-indelingen');
}
