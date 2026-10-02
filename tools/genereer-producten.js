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

// De merklogo's die de behandelpagina's gebruiken, moeten wel bestaan.
for (const m of merken) {
  const p = path.join(root, 'preview', m.logo);
  if (!fs.existsSync(p)) throw new Error('Logo ontbreekt: ' + m.logo);
}
for (const p of producten) {
  if (p.beeld && !fs.existsSync(path.join(root, 'preview', p.beeld))) throw new Error('Productfoto ontbreekt: ' + p.beeld);
  if (!p.prijs) console.warn('Let op: geen prijs bij ' + p.naam);
}

const pijl = '<svg class="ico"><use href="#i-arrow"/></svg>';

// --- Flesjes even groot laten lijken -------------------------------------
// De foto's worden op hoogte ingepast, maar een breed flesje oogt dan groter dan een smal.
// Daarom schalen we elke foto zo dat het beeldvlak even groot is als dat van het smalste
// flesje. Dat gaat vanzelf: de maten komen uit de bestanden, dus een nieuwe foto telt mee.
function afmeting(bestand) {
  const b = fs.readFileSync(bestand);
  if (b.length > 24 && b.toString('latin1', 1, 4) === 'PNG') {
    return { b: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {        // JPEG: eerste SOF-blok
    for (let i = 2; i + 9 < b.length;) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
        return { h: b.readUInt16BE(i + 5), b: b.readUInt16BE(i + 7) };
      }
      i += 2 + b.readUInt16BE(i + 2);
    }
  }
  return null;                                                  // onbekend formaat: niet schalen
}

function metSchaal(lijst) {
  const vorm = lijst.map(p => {
    if (!p.beeld) return null;
    const m = afmeting(path.join(root, 'preview', p.beeld));
    return m && m.h ? m.b / m.h : null;
  });
  const smalste = Math.min.apply(null, vorm.filter(v => v));
  return lijst.map((p, i) => {
    if (!vorm[i] || !smalste) return p;
    const s = Math.sqrt(smalste / vorm[i]);
    return s > 0.98 ? p : Object.assign({}, p, { schaal: +s.toFixed(3) });
  });
}

const tegels = merken.map((m, i) =>
  `      <a class="brand-tile reveal${i ? ' d' + Math.min(i, 3) : ''}" href="#"><img${m.hoog ? ' class="tall"' : ''} src="${esc(m.logo)}" alt="${esc(m.naam)}"><p>${esc(m.tekst)}</p><span class="link-arrow">Bekijk assortiment ${pijl}</span></a>`
).join('\n');

const logos = merken.map(m =>
  `      <img${m.hoog ? ' class="tall"' : ''} src="${esc(m.logo)}" alt="${esc(m.naam)}" loading="lazy">`
).join('\n');

const voet = merken.map(m => `<li><a href="#">${esc(m.naam)}</a></li>`).join('');

const json = JSON.stringify(metSchaal(producten), null, 2).split('\n').map(r => '      ' + r).join('\n').trim();

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

console.log('preview/index.html bijgewerkt: ' + merken.length + ' merken, ' + producten.length + ' producten');

module.exports = { merken, producten };
