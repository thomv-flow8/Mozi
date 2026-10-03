// Zet de teksten en foto's uit docs/home.json in preview/index.html.
// De pagina blijft handgeschreven; alleen de stukken tussen <!-- home:naam --> en
// <!-- /home:naam --> worden vervangen, zodat Emine ze via het CMS kan beheren.
// Let op: draait vóór de andere generatoren, want die nemen de kop (met de
// aankondigingsbalk) en de voet van index.html over.
// Gebruik: node tools/genereer-home.js
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const bestand = path.join(root, 'preview/index.html');
const d = JSON.parse(fs.readFileSync(path.join(root, 'docs/home.json'), 'utf8'));

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Koppen: *woord* wordt schuingedrukt, Enter wordt een nieuwe regel.
const kop = (s, schuin = 'em') => esc(s)
  .replace(/\*(.+?)\*/g, schuin === 'it' ? '<span class="it">$1</span>' : '<em>$1</em>')
  .replace(/\r?\n/g, '<br>');
const lijst = v => (Array.isArray(v) ? v : []);
const ico = n => `<svg class="ico"><use href="#i-${n}"/></svg>`;

// Categorieën liggen vast: de filterknoppen boven de kaarten horen erbij.
const CATEGORIE = { huidproblemen: 'Huidproblemen', verjonging: 'Verjonging', laser: 'Laser &amp; licht', overig: 'Advies' };

// "vanaf € 75" toont het bedrag vet met "vanaf" ervoor; alles anders helemaal vet.
const prijs = p => {
  const t = String(p || '').trim();
  const m = t.match(/^vanaf\s+(.+)$/i);
  return m ? `vanaf <b>${esc(m[1])}</b>` : `<b>${esc(t)}</b>`;
};

// 06 27 26 27 31 → +31627262731
const telLink = t => { const c = String(t || '').replace(/\D/g, ''); return c.startsWith('0') ? '+31' + c.slice(1) : '+' + c; };

const o = d.opening || {}, b = d.behandelingen || {}, w = d.werkwijze || {}, c = d.contact || {}, a = d.aankondiging || {};

const blokken = {
  aankondiging: `${esc(a.tekst)} · <a href="#" data-book>${esc(a.knop)}</a>`,

  opening: `<section class="hero" data-float-after>
  <div class="wrap hero-grid">
    <div class="reveal">
      <p class="eyebrow">${esc(o.label)}</p>
      <h1>${kop(o.kop, 'it')}</h1>
      <p class="lead">${esc(o.tekst)}</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="#" data-book>${ico('cal')}${esc(o.knopAfspraak)}</a>
        <a class="btn btn-outline" href="#behandelingen">${esc(o.knopBehandelingen)}</a>
      </div>
      <div class="hero-meta">
${lijst(o.cijfers).map(s => `        <div class="stat"><b>${esc(s.waarde)}</b><span>${esc(s.label)}</span></div>`).join('\n')}
      </div>
    </div>
    <div class="portrait reveal d1">
      <div class="squares" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <img src="${esc(o.portret)}" alt="${esc(o.portretAlt)}" width="941" height="1266">
      <div class="portrait-tag">
        <span class="dot">${ico('shield')}</span>
        <div><b>${esc(o.naam)}</b><span>${esc(o.functie)}</span></div>
      </div>
    </div>
  </div>
</section>`,

  'behandelingen-kop': `<div class="section-head split">
      <div class="reveal">
        <p class="eyebrow">${esc(b.label)}</p>
        <h2>${kop(b.kop)}</h2>
      </div>
      <p class="lead reveal d1">${esc(b.tekst)}</p>
    </div>`,

  behandelkaarten: lijst(b.kaarten).map((k, i) => `
      <a class="treat reveal${i % 3 ? ' d' + (i % 3) : ''}" href="behandeling-${esc(k.pagina)}.html" data-cat="${esc(k.categorie)}" data-concerns="${esc(lijst(k.klachten).filter(Boolean).join(','))}">
        <div class="media"><img src="${esc(k.beeld)}" alt="" loading="lazy"${k.uitsnede ? ` style="object-position:${esc(k.uitsnede)}"` : ''}><span class="cat">${CATEGORIE[k.categorie] || ''}</span></div>
        <div class="body"><h3>${esc(k.titel)}</h3><p>${esc(k.tekst)}</p>
        <div class="foot"><span class="price">${prijs(k.prijs)}</span><span class="go">${ico('arrow')}</span></div></div>
      </a>`).join(''),

  'werkwijze-kop': `<div class="section-head reveal">
      <p class="eyebrow">${esc(w.label)}</p>
      <h2>${kop(w.kop)}</h2>
    </div>`,

  contact: `
    <div class="cta-card reveal">
      <div>
        <p class="eyebrow">${esc(c.label)}</p>
        <h2>${kop(c.kop)}</h2>
      </div>
      <div>
        <p style="margin:0 0 24px;max-width:30em">${esc(c.tekst)}</p>
        <a class="btn btn-light" href="#" data-book>${ico('cal')}${esc(c.knop)}</a>
      </div>
    </div>
    <div class="info-card reveal d1">
      <a class="info-row" href="https://maps.google.com/?q=${esc(String(c.adres || '').replace(/ /g, '+'))}" target="_blank" rel="noopener">
        ${ico('pin')}
        <div><b>${esc(c.locatie)}</b><span>${esc(c.adres)}</span></div>
      </a>
      <a class="info-row" href="tel:${telLink(c.telefoon)}">
        ${ico('phone')}
        <div><b>${esc(c.telefoon)}</b><span>${esc(c.telefoonTekst)}</span></div>
      </a>
      <a class="info-row" href="mailto:${esc(c.email)}">
        ${ico('mail')}
        <div><b>${esc(c.email)}</b><span>${esc(c.emailTekst)}</span></div>
      </a>
      <a class="info-row" href="https://www.instagram.com/${esc(c.instagram)}/" target="_blank" rel="noopener">
        ${ico('insta')}
        <div><b>@${esc(c.instagram)}</b><span>${esc(c.instagramTekst)}</span></div>
      </a>
    </div>`
};

// --- Deel B -------------------------------------------------------------------------------

// Breedte en hoogte uit het bestand zelf, zodat een nieuw logo vanzelf de juiste maten krijgt.
function maat(src) {
  try {
    const b = fs.readFileSync(path.join(root, 'preview', src));
    if (b.toString('latin1', 1, 4) === 'PNG') return ` width="${b.readUInt32BE(16)}" height="${b.readUInt32BE(20)}"`;
    if (b[0] === 0xff && b[1] === 0xd8) {
      for (let i = 2; i + 9 < b.length;) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return ` width="${b.readUInt16BE(i + 7)}" height="${b.readUInt16BE(i + 5)}"`;
        i += 2 + b.readUInt16BE(i + 2);
      }
    }
  } catch (e) { /* bestand ontbreekt: wordt hieronder gemeld */ }
  return '';
}
const regels = s => esc(s).replace(/\r?\n/g, '<br>');
// JSON veilig in een <script>-blok: een "<" kan het blok nooit voortijdig sluiten.
const J = v => JSON.stringify(v).replace(/</g, '\\u003c');

const f = d.film || {}, kl = d.klachten || {}, bw = d.bewijs || {}, rs = d.resultaten || {}, rv = d.reviews || {}, ov = d.over || {}, ws = d.webshop || {};
let revData = {};
try { revData = JSON.parse(fs.readFileSync(path.join(root, 'docs/reviews.json'), 'utf8')); } catch (e) { /* geen reviews: standaardwaarden */ }
const score = typeof revData.score === 'number' ? revData.score.toFixed(1).replace('.', ',') : '5,0';
const aantal = typeof revData.aantal === 'number' ? revData.aantal : 71;

Object.assign(blokken, {
  keurmerken: lijst(d.keurmerken).map(k => `
    <div class="trust-item">${k.logo ? `<img src="${esc(k.logo)}" alt=""${maat(k.logo)}>` : `<span class="agb">${esc(k.badge)}</span>`}<span>${regels(k.tekst)}</span></div>`).join(''),

  'film-beelden': lijst(f.beelden).filter(Boolean).map(src => `
      <img class="film-slide" src="${esc(src)}" alt="">`).join(''),

  'film-tekst': `
        <p class="eyebrow">${esc(f.label)}</p>
        <h2>${kop(f.kop)}</h2>
        <p>${esc(f.tekst)}</p>
        <div class="row">
          <a class="btn btn-light" href="#" data-book>${ico('cal')}${esc(f.knopAfspraak)}</a>
          <a class="btn btn-ghost-light" href="#behandelingen">${esc(f.knopBehandelingen)}</a>
        </div>`,

  klachten: `
    <div class="reveal">
      <p class="eyebrow">${esc(kl.label)}</p>
      <h2>${kop(kl.kop)}</h2>
    </div>
    <div class="reveal d1">
      <p class="lead">${esc(kl.tekst)}</p>
      <div class="concerns">
${lijst(kl.lijst).filter(Boolean).map(k => `        <a class="chip" href="#behandelingen" data-concern="${esc(k)}">${esc(k)}</a>`).join('\n')}
      </div>
    </div>`,

  'bewijs-kop': `
    <p class="eyebrow">${esc(bw.label)}</p>
    <h2 id="proofTitle">${kop(bw.kop)}</h2>
    <p class="lead">${esc(bw.tekst)}</p>`,

  'resultaten-kop': `
      <p class="eyebrow">${esc(rs.label)}</p>
      <h2>${kop(rs.kop)}</h2>
      <p class="lead" style="margin-top:22px">${esc(rs.tekst)}</p>
      <div class="tabs" role="tablist" aria-label="Kies een resultaat">
${lijst(rs.voorbeelden).map((v, i) => `        <button class="tab" role="tab" aria-selected="${i === 0}" data-case="${i}">${esc(v.naam)}</button>`).join('\n')}
      </div>`,

  // Markeringen staan buiten het scriptblok: daarbinnen zouden ze als tekst meetellen en de
  // gegevens onleesbaar maken.
  'resultaten-data': '<script type="application/json" id="baCases">[\n    ' + lijst(rs.voorbeelden).map(v =>
    `{"naam":${J(v.naam || '')},"voor":${J(v.voor || '')},"na":${J(v.na || '')},\n     "info":${J(lijst(v.info).map(r => [r.label || '', r.waarde || '']))},\n     "bron":${J(v.bron || '')}}`
  ).join(',\n    ') + '\n  ]</script>',

  reviews: `
      <p class="eyebrow">${esc(rv.label)}</p>
      <div class="big" data-rev-score>${score}</div>
      <div class="stars" aria-label="5 van 5 sterren">${'<svg viewBox="0 0 24 24"><use href="#i-star"/></svg>'.repeat(5)}</div>
      <p>Gemiddelde score op basis van <b data-rev-count>${aantal}</b> reviews</p>
      <a class="btn btn-outline" href="#" data-reviews>${esc(rv.knop)}</a>
      <p class="src"><svg class="ico" style="width:15px;height:15px"><use href="#i-info"/></svg>${esc(rv.bron)}</p>`,

  over: `
      <p class="eyebrow">${esc(ov.label)}</p>
      <blockquote>${esc(ov.citaat)}</blockquote>
      <div class="who">
        <img src="${esc(ov.portret)}" alt="" width="56" height="56">
        <div><b>${esc(ov.naam)}</b><span>${esc(ov.functie)}</span></div>
      </div>
      <ul>
${lijst(ov.punten).filter(Boolean).map(p => `        <li>${ico('check')}${esc(p)}</li>`).join('\n')}
      </ul>
      <a class="btn btn-light" href="over-mozi.html">${esc(ov.knop)} ${ico('arrow')}</a>`,

  'webshop-kop': `
      <div class="reveal">
        <p class="eyebrow">${esc(ws.label)}</p>
        <h2>${kop(ws.kop)}</h2>
      </div>
      <p class="lead reveal d1">${esc(ws.tekst)}</p>`
});

// De vier fotokaarten in de doorschuivende rij. De logotegels ertussen liggen vast in de pagina,
// dus er zijn altijd precies vier plekken.
[1, 2, 3, 4].forEach(i => {
  const k = lijst(bw.kaarten)[i - 1] || {};
  blokken['bewijs' + i] = `<figure class="pcard photo" style="margin:0"><img src="${esc(k.beeld)}" alt="" loading="lazy">
        <figcaption class="q"><p>${esc(k.tekst)}</p><span>${esc(k.onderschrift)}</span></figcaption>`;
});

// De drie stappen van de werkwijze; de animaties eronder blijven vast in de pagina.
['01', '02', '03'].forEach((n, i) => {
  const s = lijst(w.stappen)[i] || {};
  blokken['stap' + n] = `<span class="n">${n}</span><h3>${esc(s.titel)}</h3>
        <p>${esc(s.tekst)}</p>`;
});

let html = fs.readFileSync(bestand, 'utf8');
for (const [naam, inhoud] of Object.entries(blokken)) {
  const re = new RegExp('(<!-- home:' + naam + ' -->)[\\s\\S]*?(<!-- /home:' + naam + ' -->)');
  if (!re.test(html)) throw new Error('Markering niet gevonden in index.html: ' + naam);
  html = html.replace(re, (_, x, y) => x + inhoud + y);
}
fs.writeFileSync(bestand, html);

// Foto's die het CMS noemt, moeten bestaan.
const fotos = [o.portret, ...lijst(b.kaarten).map(k => k.beeld), ...lijst(d.keurmerken).map(k => k.logo), ...lijst(f.beelden),
  ...lijst(bw.kaarten).map(k => k.beeld), ...lijst(rs.voorbeelden).flatMap(v => [v.voor, v.na]), ov.portret];
for (const x of fotos.filter(Boolean)) {
  if (!fs.existsSync(path.join(root, 'preview', x))) throw new Error('Foto ontbreekt: ' + x);
}
for (const k of lijst(b.kaarten)) {
  if (!CATEGORIE[k.categorie]) throw new Error('Onbekende categorie bij ' + k.titel + ': ' + k.categorie);
  if (!fs.existsSync(path.join(root, 'preview', 'behandeling-' + k.pagina + '.html'))) console.warn('Let op: geen pagina voor ' + k.pagina);
}

console.log('preview/index.html bijgewerkt: ' + lijst(b.kaarten).length + ' behandelkaarten, ' + lijst(w.stappen).length + ' stappen');
