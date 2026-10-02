// Genereert per behandeling een pagina (preview/behandeling-<slug>.html) uit docs/behandelingen.json.
// Prijzen komen uit docs/tarieven.json, zodat een prijs maar op één plek staat.
// Gebruik: node tools/genereer-behandelingen.js
const { lees, esc, pagina, schrijf } = require('./sjabloon');
const { data: tarieven, rijenHtml } = require('./genereer-tarieven');
const data = JSON.parse(lees('docs/behandelingen.json'));
const gebouwd = new Set(data.behandelingen.map(b => b.slug));

// Koppen: *woord* wordt schuingedrukt (zo hoeft niemand HTML te typen in het CMS).
const em = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

const ico = (naam, extra) => `<svg class="ico"${extra ? ' ' + extra : ''}><use href="#i-${naam}"/></svg>`;

// Illustratie: huidlagen, microkanaaltjes en nieuw collageen (animeert zodra in beeld).
const huidlagen = `<svg class="skin" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Doorsnede van de huid: microneedles maken kanaaltjes, waarna nieuw collageen ontstaat">
  <rect width="600" height="420" fill="#F9F7F6"/>
  <path d="M0,126 C100,114 200,138 300,124 S500,112 600,128 L600,178 C480,170 380,186 300,178 S120,170 0,180 Z" fill="#E7C9B4"/>
  <path d="M0,180 C120,170 220,186 300,178 S480,170 600,178 L600,334 L0,334 Z" fill="#F1DACB"/>
  <rect y="334" width="600" height="86" fill="#F7E8DD"/>
  <g fill="#EFD9C9"><circle cx="60" cy="372" r="22"/><circle cx="130" cy="384" r="18"/><circle cx="520" cy="376" r="24"/><circle cx="580" cy="392" r="16"/></g>
  <g class="chan" stroke="#C98A7A" stroke-width="2" stroke-linecap="round" stroke-dasharray="3 5">
    <line x1="220" y1="130" x2="220" y2="208"/><line x1="280" y1="127" x2="280" y2="208"/><line x1="340" y1="125" x2="340" y2="208"/><line x1="400" y1="123" x2="400" y2="208"/><line x1="460" y1="121" x2="460" y2="208"/>
  </g>
  <path class="coll" d="M150,236 C200,222 240,252 290,238 S390,222 440,238 S530,250 570,236"/>
  <path class="coll" d="M140,264 C190,250 230,280 280,266 S380,250 430,266 S520,278 575,264"/>
  <path class="coll" d="M160,292 C210,278 250,306 300,292 S400,278 450,294 S530,304 565,292"/>
  <g class="needle" style="transition-delay:0.00s"><line x1="220" y1="40" x2="220" y2="208" stroke="#1C1B19" stroke-width="2.5"/></g>
  <g class="needle" style="transition-delay:0.12s"><line x1="280" y1="40" x2="280" y2="208" stroke="#1C1B19" stroke-width="2.5"/></g>
  <g class="needle" style="transition-delay:0.24s"><line x1="340" y1="40" x2="340" y2="208" stroke="#1C1B19" stroke-width="2.5"/></g>
  <g class="needle" style="transition-delay:0.36s"><line x1="400" y1="40" x2="400" y2="208" stroke="#1C1B19" stroke-width="2.5"/></g>
  <g class="needle" style="transition-delay:0.48s"><line x1="460" y1="40" x2="460" y2="208" stroke="#1C1B19" stroke-width="2.5"/></g>
  <rect x="190" y="0" width="300" height="46" rx="12" fill="#1C1B19"/>
  <rect x="300" y="18" width="80" height="4" rx="2" fill="#D6C89C"/>
  <text class="lab" x="24" y="158">Opperhuid</text>
  <text class="lab" x="24" y="216">Lederhuid</text>
  <text class="lab" x="24" y="384">Onderhuid</text>
  <text class="lab lab-gold" x="300" y="324">Nieuw collageen &amp; elastine</text>
</svg>`;

function visual(v) {
  if (v && v.type === 'huidlagen') return `<div class="t-visual reveal d1" data-play>${huidlagen}</div>`;
  if (!v || !v.src) return '';
  return `<div class="t-visual reveal d1"><img src="${v.src}" alt="${esc(v.alt || '')}" loading="lazy"></div>`;
}

function kaart(slug) {
  const k = data.kaarten[slug];
  const href = gebouwd.has(slug) ? `behandeling-${slug}.html` : './#behandelingen';
  return `<a class="treat reveal" href="${href}">
        <div class="media"><img src="${k.beeld}" alt="" loading="lazy"><span class="cat">${esc(k.cat)}</span></div>
        <div class="body"><h3>${esc(k.titel)}</h3><p>${esc(k.tekst)}</p>
        <div class="foot"><span class="price">${k.prijs}</span><span class="go">${ico('arrow')}</span></div></div>
      </a>`;
}

// Algemeen verloop (klopt voor elke behandeling); per behandeling te vervangen door een eigen verloop.
const STANDAARD_VERLOOP = {
  kop: 'Zo *verloopt* het',
  stappen: [
    { wanneer: 'Intake', tekst: 'Een gratis gesprek van 30 minuten. We bekijken je huid en bespreken je wensen, en wat realistisch is.' },
    { wanneer: 'Plan', tekst: 'Je krijgt een behandelplan op maat, vaak een combinatie van behandelingen voor het beste resultaat.' },
    { wanneer: 'Behandeling', tekst: 'De huidtherapeut voert de behandeling uit en legt vooraf uit wat je kunt verwachten.' },
    { wanneer: 'Thuis', tekst: 'Je krijgt advies voor de verzorging thuis, met producten die bij jouw huid passen.' }
  ]
};

const vol = a => Array.isArray(a) && a.length > 0;
function schoon(b) {
  b = Object.assign({}, b);
  if (!b.waarom || !vol(b.waarom.punten)) b.waarom = null;
  if (!b.verloop || !vol(b.verloop.stappen)) b.verloop = null;
  if (!vol(b.resultaten)) b.resultaten = null;
  if (!vol(b.tarievenRijen)) b.tarievenRijen = null;
  if (!b.logo) b.logo = null;
  b.secties = (b.secties || []).filter(x => x && (x.kop || vol(x.tekst)));
  b.feiten = (b.feiten || []).filter(x => x && x.waarde);
  b.geschiktBij = (b.geschiktBij || []).filter(Boolean);
  b.vragen = (b.vragen || []).filter(x => x && x.v);
  b.gerelateerd = (b.gerelateerd || []).filter(x => data.kaarten[x]);
  return b;
}

function bouw(b) {
  b = schoon(b);
  const kort = b.kort || b.titel.split(' ')[0];
  const verloop = b.verloop || STANDAARD_VERLOOP;
  const groep = b.tarieven ? tarieven.groepen.find(g => g.id === b.tarieven) : null;
  if (b.tarieven && !groep) throw new Error('Tarievengroep niet gevonden: ' + b.tarieven);
  const prijsRijen = groep ? rijenHtml(groep) : rijenHtml({ rijen: b.tarievenRijen || [{ naam: b.titel, info: '', prijs: 'op aanvraag' }] });
  const prijsLink = groep ? 'tarieven.html#' + groep.id : 'tarieven.html';
  const sub = [
    ['uitleg', 'Uitleg'], ['geschikt', 'Geschikt bij'], b.resultaten && b.resultaten.length ? ['resultaten', 'Resultaten'] : null,
    ['verloop', b.verloop ? 'Na de behandeling' : 'Verloop'], ['tarieven', 'Tarieven'], ['vragen', 'Vragen']
  ].filter(Boolean);

  const secties = b.secties.map((s, i) => `
    <div class="t-split${i % 2 ? ' rev' : ''}"${i === 0 ? '' : ` id="${s.id}"`}>
      <div class="t-text reveal">
        <p class="eyebrow">${esc(s.eyebrow)}</p>
        <h2>${em(s.kop)}</h2>
        ${s.tekst.map(p => `<p>${esc(p)}</p>`).join('\n        ')}
      </div>
      ${visual(s.visual)}
    </div>`).join('');

  const resultaten = b.resultaten && b.resultaten.length ? `
<section class="section" id="resultaten">
  <div class="wrap results-grid">
    <div class="result-info reveal">
      <p class="eyebrow">Resultaten</p>
      <h2>Zie het <em>verschil</em></h2>
      <p class="lead" style="margin-top:22px">Sleep de lijn en vergelijk de huid voor en na het behandeltraject.</p>
      <div class="tabs" role="tablist" aria-label="Kies een resultaat">
        ${b.resultaten.map((r, i) => `<button class="tab" role="tab" aria-selected="${i === 0}" data-case="${i}">${esc(r.naam)}</button>`).join('\n        ')}
      </div>
      <dl id="caseInfo"></dl>
    </div>
    <div class="reveal d1">
      <div class="ba" id="ba">
        <img class="after" alt="">
        <img class="before" alt="">
        <span class="lbl l">Voor</span><span class="lbl r">Na</span>
        <div class="handle"><span class="knob">${ico('lr')}</span></div>
        <label class="sr-only" for="baRange">Schuif tussen voor en na</label>
        <input type="range" id="baRange" min="0" max="100" value="50">
      </div>
      <p class="ba-note">${ico('info')}<span><span id="caseCredit"></span> Resultaten verschillen per persoon.</span></p>
    </div>
  </div>
  <script type="application/json" id="baCases">${JSON.stringify(b.resultaten.map(r => Object.assign({}, r, { info: r.info.map(i => [i.label, i.waarde]) })))}</script>
</section>` : '';

  const inhoud = `
<div class="wrap">
  <nav class="crumbs" aria-label="Kruimelpad"><a href="./">Home</a><span aria-hidden="true">/</span><a href="./#behandelingen">Behandelingen</a><span aria-hidden="true">/</span><span>${esc(b.titel)}</span></nav>
</div>

<section class="t-hero" data-float-after>
  <div class="wrap">
    <div class="t-hero-grid">
      <div class="reveal">
        <p class="eyebrow">${esc(b.categorie)}</p>
        <h1>${em(b.paginaKop || b.titel)}</h1>
        <p class="lead">${esc(b.intro)}</p>
        <div class="hero-ctas">
          <a class="btn btn-primary" href="#" data-book>${ico('cal')}Plan een gratis intake</a>
          <a class="btn btn-outline" href="#tarieven">Bekijk tarieven</a>
        </div>
      </div>
      <div class="t-media reveal d1">
        <img src="${b.beeld}" alt="" fetchpriority="high">
        ${b.logo ? `<span class="badge-logo"><img src="${b.logo}" alt=""></span>` : ''}
      </div>
    </div>
    <div class="t-facts reveal">
      ${b.feiten.map(f => `<div><b>${esc(f.waarde)}</b><span>${esc(f.label)}</span></div>`).join('\n      ')}
    </div>
  </div>
</section>

<nav class="t-subnav" aria-label="Op deze pagina"><div class="wrap">
  ${sub.map(([id, naam]) => `<a href="#${id}">${naam}</a>`).join('\n  ')}
</div></nav>

<section class="section" id="uitleg">
  <div class="wrap">${secties}
  </div>
</section>

<section class="section section-alt" id="geschikt">
  <div class="wrap${b.waarom ? ' t-split' : ''}">
    <div class="reveal">
      <p class="eyebrow">Geschikt bij</p>
      <h2>Waar ${esc(kort)} <em>helpt</em></h2>
      <div class="chips-static">
        ${b.geschiktBij.map(c => `<span>${ico('check')}${esc(c)}</span>`).join('\n        ')}
      </div>
    </div>
    ${b.waarom ? `<div class="reveal d1">
      <h3 style="margin-bottom:18px">${em(b.waarom.kop)}</h3>
      <div class="why-grid">
        ${b.waarom.punten.map(p => `<div class="why">${ico('shield')}<div><b>${esc(p.titel)}</b><p>${esc(p.tekst)}</p></div></div>`).join('\n        ')}
      </div>
      ${b.logo ? `<div class="why-logo"><img src="${b.logo}" alt="">${esc(b.logoTekst || '')}</div>` : ''}
    </div>` : ''}
  </div>
</section>
${resultaten}
<section class="section${resultaten ? ' section-alt' : ''}" id="verloop">
  <div class="wrap t-split">
    <div class="reveal">
      <p class="eyebrow">Verloop</p>
      <h2>${em(verloop.kop)}</h2>
    </div>
    <ol class="timeline reveal d1">
      ${verloop.stappen.map(s => `<li><b>${esc(s.wanneer)}</b><p>${esc(s.tekst)}</p></li>`).join('\n      ')}
    </ol>
  </div>
</section>

<section class="section" id="tarieven">
  <div class="wrap t-split" style="align-items:start">
    <div class="reveal">
      <p class="eyebrow">Tarieven</p>
      <h2>Wat kost <em>${esc(kort)}</em>?</h2>
      <p class="lead" style="margin-top:20px">Alle tarieven zijn per behandeling. Het intakegesprek van 30 minuten is gratis.</p>
    </div>
    <div class="t-price reveal d1">
      <div class="rows">
${prijsRijen}
      </div>
      <div class="t-price-foot">
        <p>${esc(b.tarievenExtra || '')}</p>
        <a class="link-arrow" href="${prijsLink}">Alle tarieven ${ico('arrow')}</a>
      </div>
    </div>
  </div>
</section>

<section class="section section-alt" id="vragen">
  <div class="wrap faq-grid">
    <div class="reveal">
      <p class="eyebrow">Veelgestelde vragen</p>
      <h2>Goed om te <em>weten</em></h2>
    </div>
    <div class="reveal d1">
      ${b.vragen.map((q, i) => `<details class="faq"${i === 0 ? ' open' : ''}><summary>${esc(q.v)}<span class="chev">${ico('chev')}</span></summary><p>${esc(q.a)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="cta-band reveal">
      <div>
        <h2>Benieuwd wat <em>${esc(kort)}</em> voor jou doet?</h2>
        <p>Plan een gratis intakegesprek van 30 minuten. We bekijken je huid en maken samen een behandelplan.</p>
      </div>
      <a class="btn btn-gold" href="#" data-book>${ico('cal')}Plan een gratis intake</a>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="wrap">
    <div class="section-head reveal" style="margin-bottom:28px">
      <p class="eyebrow">Ook interessant</p>
      <h2>Gerelateerde <em>behandelingen</em></h2>
    </div>
    <div class="treat-grid">
      ${b.gerelateerd.map(kaart).join('\n      ')}
    </div>
  </div>
</section>
`;
  const bestand = `preview/behandeling-${b.slug}.html`;
  schrijf(bestand, pagina({
    titel: `${b.titel} — Huidzorg Mozi`,
    omschrijving: b.omschrijving,
    notitie: 'Ontwerpvoorstel — voorbeeld van een behandelpagina · <a href="./">terug naar home</a>',
    inhoud
  }));
  console.log(bestand + ' geschreven' + (b.aanvullen && b.aanvullen.length ? ' (aan te vullen door Emine: ' + b.aanvullen.join('; ') + ')' : ''));
}

data.behandelingen.forEach(bouw);
