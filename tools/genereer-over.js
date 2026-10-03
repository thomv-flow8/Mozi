// Genereert preview/over-mozi.html uit docs/over.json.
// Gebruik: node tools/genereer-over.js
const { lees, esc, pagina, schrijf } = require('./sjabloon');
const d = JSON.parse(lees('docs/over.json'));
// Lege velden uit het CMS opvangen, zodat de bouw niet vastloopt als Emine iets leegmaakt:
// een ontbrekende lijst wordt leeg, een ontbrekende tekst ook, lege alinea's vallen weg.
for (const k of ['verhaal', 'waarden', 'aansluitingen', 'praktijk']) if (!Array.isArray(d[k])) d[k] = [];
d.verhaal = d.verhaal.filter(Boolean);
d.praktijk = d.praktijk.filter(Boolean);
for (const k of ['kop', 'intro', 'naam', 'functie', 'citaat', 'verhaalKop', 'praktijkKop', 'adres', 'praktijkBeeld']) if (d[k] == null) d[k] = '';
for (const w of d.waarden) if (!w.icoon) w.icoon = 'check';
const em = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const ico = naam => `<svg class="ico"><use href="#i-${naam}"/></svg>`;

const inhoud = `
<div class="wrap">
  <nav class="crumbs" aria-label="Kruimelpad"><a href="./">Home</a><span aria-hidden="true">/</span><span>Over Mozi</span></nav>
</div>

<section class="hero" data-float-after>
  <div class="wrap hero-grid">
    <div class="reveal">
      <p class="eyebrow">Huidtherapie · Gorinchem</p>
      <h1>${em(d.kop)}</h1>
      <p class="lead">${esc(d.intro)}</p>
      <div class="hero-ctas">
        <a class="btn btn-primary" href="#" data-book>${ico('cal')}Plan een gratis intake</a>
        <a class="btn btn-outline" href="#verhaal">Lees haar verhaal</a>
      </div>
    </div>
    <div class="portrait reveal d1">
      <div class="squares" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <img src="../assets/bewerkt/eigenaresse-portret.png" alt="${esc(d.naam)}, ${esc(d.functie.toLowerCase())}" width="941" height="1266">
      <div class="portrait-tag">
        <span class="dot">${ico('shield')}</span>
        <div><b>${esc(d.naam)}</b><span>${esc(d.functie)}</span></div>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="verhaal">
  <div class="wrap story">
    <div class="story-side reveal">
      <p class="eyebrow">Haar verhaal</p>
      <h2>${em(d.verhaalKop)}</h2>
      ${d.citaat ? `<blockquote class="pull">${esc(d.citaat)}</blockquote>` : ''}
      <p class="sig"><b>${esc(d.naam)}</b><span>${esc(d.functie)}</span></p>
    </div>
    <div class="story-text reveal d1">
      ${d.verhaal.map(p => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head reveal">
      <p class="eyebrow">Waar we voor staan</p>
      <h2>Zorg met <em>kennis</em> en aandacht</h2>
    </div>
    <div class="why-cards">
      ${d.waarden.map((w, i) => `<div class="why why-alt reveal d${i % 3}"><span class="why-ico">${ico(w.icoon)}</span><b>${esc(w.titel)}</b><p>${esc(w.tekst)}</p></div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section-alt">
  <div class="wrap">
    <div class="section-head split">
      <div class="reveal">
        <p class="eyebrow">Kwaliteit</p>
        <h2>Aangesloten <em>bij</em></h2>
      </div>
      <p class="lead reveal d1">Huidtherapeut is een beschermde titel. Deze registraties en lidmaatschappen staan voor opleiding, bijscholing en kwaliteit.</p>
    </div>
    <div class="member-grid">
      ${d.aansluitingen.map((a, i) => `<div class="member reveal d${i % 4}">
        <div class="member-logo">${a.logo ? `<img src="${a.logo}" alt="">` : `<span class="agb">${esc(a.badge || '')}</span>`}</div>
        <b>${esc(a.naam)}</b><p>${esc(a.tekst)}</p>
      </div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap t-split">
    <div class="t-text reveal">
      <p class="eyebrow">De praktijk</p>
      <h2>${em(d.praktijkKop)}</h2>
      ${d.praktijk.map(p => `<p>${esc(p)}</p>`).join('\n      ')}
      <a class="info-row" style="border:0;padding-left:0" href="https://maps.google.com/?q=${encodeURIComponent(d.adres)}" target="_blank" rel="noopener">
        ${ico('pin')}<div><b>Gezondheidscentrum Zorglinie</b><span>${esc(d.adres)}</span></div>
      </a>
    </div>
    ${d.praktijkBeeld ? `<div class="t-visual reveal d1"><img src="${d.praktijkBeeld}" alt="Behandeling in de praktijk" loading="lazy"></div>` : ''}
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="cta-band reveal">
      <div>
        <h2>Kennismaken met <em>Emine</em>?</h2>
        <p>Plan een gratis intakegesprek van 30 minuten. We bekijken je huid en maken samen een behandelplan.</p>
      </div>
      <a class="btn btn-light" href="#" data-book>${ico('cal')}Plan een gratis intake</a>
    </div>
  </div>
</section>
`;

schrijf('preview/over-mozi.html', pagina({
  titel: 'Over Mozi — Huidzorg Mozi',
  omschrijving: 'Maak kennis met Emine Elmaci-van Rossen, huidtherapeut en eigenaar van Huidzorg Mozi in Gezondheidscentrum Zorglinie, Gorinchem.',
  actief: 'over-mozi.html',
  notitie: 'Ontwerpvoorstel — pagina Over Mozi · <a href="./">terug naar home</a>',
  inhoud
}));
console.log('preview/over-mozi.html geschreven');
