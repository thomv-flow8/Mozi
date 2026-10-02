// Zet de merken en producten uit docs/producten.json in preview/index.html.
// De pagina blijft handgeschreven; alleen de stukken tussen de markeringen worden vervangen,
// zodat Emine de merken en producten via het CMS kan beheren.
// Let op: dit script draait vóór de andere generatoren, want die nemen de kop en voet
// van index.html over.
// Gebruik: node tools/genereer-producten.js
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const bestand = path.join(root, 'preview/index.html');
const data = JSON.parse(fs.readFileSync(path.join(root, 'docs/producten.json'), 'utf8'));
const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Lege velden uit het CMS niet meenemen.
const schoon = o => Object.fromEntries(Object.entries(o).filter(([, v]) =>
  v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)));

const merken = data.merken.map(schoon);
const producten = data.producten.map(schoon);

const pijl = '<svg class="ico"><use href="#i-arrow"/></svg>';

const tegels = merken.map((m, i) =>
  `      <a class="brand-tile reveal${i ? ' d' + Math.min(i, 3) : ''}" href="#"><img${m.hoog ? ' class="tall"' : ''} src="${esc(m.logo)}" alt="${esc(m.naam)}"><p>${esc(m.tekst)}</p><span class="link-arrow">Bekijk assortiment ${pijl}</span></a>`
).join('\n');

const logos = merken.map(m =>
  `      <img${m.hoog ? ' class="tall"' : ''} src="${esc(m.logo)}" alt="${esc(m.naam)}" loading="lazy">`
).join('\n');

const voet = merken.map(m => `<li><a href="#">${esc(m.naam)}</a></li>`).join('');

const json = JSON.stringify(producten, null, 2).split('\n').map(r => '      ' + r).join('\n').trim();

const blokken = {
  merken: '\n' + tegels + '\n    ',
  merklogos: '\n' + logos + '\n    ',
  merkenvoet: voet,
  producten: '\n      <script type="application/json" id="shopData">' + json + '</script>\n    '
};

let html = fs.readFileSync(bestand, 'utf8');
for (const [naam, inhoud] of Object.entries(blokken)) {
  const re = new RegExp('(<!-- ' + naam + ' -->)[\\s\\S]*?(<!-- /' + naam + ' -->)');
  if (!re.test(html)) throw new Error('Markering niet gevonden in index.html: ' + naam);
  html = html.replace(re, (_, a, b) => a + inhoud + b);
}
fs.writeFileSync(bestand, html);

// De merklogo's die de behandelpagina's gebruiken, moeten wel bestaan.
for (const m of merken) {
  const p = path.join(root, 'preview', m.logo);
  if (!fs.existsSync(p)) throw new Error('Logo ontbreekt: ' + m.logo);
}
for (const p of producten) {
  if (p.beeld && !fs.existsSync(path.join(root, 'preview', p.beeld))) throw new Error('Productfoto ontbreekt: ' + p.beeld);
  if (!p.prijs) console.warn('Let op: geen prijs bij ' + p.naam);
}

console.log('preview/index.html bijgewerkt: ' + merken.length + ' merken, ' + producten.length + ' producten');

module.exports = { merken, producten };
