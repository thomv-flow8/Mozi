// Genereert preview/tarieven.html uit docs/tarieven.json.
// Kop en voet komen via tools/sjabloon.js uit preview/index.html.
// Gebruik: node tools/genereer-tarieven.js
const { lees, esc, pagina, schrijf } = require('./sjabloon');
const data = JSON.parse(lees('docs/tarieven.json'));

const klasse = p => /gratis/i.test(p) ? 'amt free' : /aanvraag/i.test(p) ? 'amt ask' : 'amt';

// Rijen van één tarievenblok; ook gebruikt op de behandelpagina's.
function rijenHtml(g) {
  return g.rijen.map(r => `          <div class="prow"><b>${esc(r.naam)}</b><span class="${klasse(r.prijs)}">${esc(r.prijs)}</span>${r.info ? `<small>${esc(r.info)}</small>` : ''}</div>`).join('\n');
}

function bouw() {
  const navLinks = data.groepen.map(g => `<a href="#${g.id}">${esc(g.naam)}</a>`).join('\n      ');
  const groepen = data.groepen.map((g, i) => `
      <details class="price-group reveal" id="${g.id}"${i === 0 ? ' open' : ''}>
        <summary><div><h2>${esc(g.naam)}</h2><div class="meta">${esc(g.intro)} · ${g.rijen.length} ${g.rijen.length === 1 ? 'tarief' : 'tarieven'}</div></div><span class="chev"><svg class="ico"><use href="#i-chev"/></svg></span></summary>
        <div class="rows">
${rijenHtml(g)}
          <div class="group-foot"><a class="link-arrow" href="${g.pagina || './#behandelingen'}">Meer over deze behandeling <svg class="ico"><use href="#i-arrow"/></svg></a><a class="btn btn-primary" href="#" data-book><svg class="ico"><use href="#i-cal"/></svg>Afspraak maken</a></div>
        </div>
      </details>`).join('');

  const inhoud = `
<section class="page-head">
  <div class="wrap">
    <p class="eyebrow reveal">Tarieven</p>
    <h1 class="reveal" style="font-size:clamp(44px,7vw,84px)">Heldere <em>prijzen</em>,<br>zonder verrassingen</h1>
    <p class="lead reveal d1">Alle tarieven zijn per behandeling. We beginnen altijd met een gratis intakegesprek van 30 minuten, waarin we samen bepalen wat jouw huid nodig heeft.</p>
  </div>
</section>

<div class="wrap price-layout">
  <nav class="price-nav" id="priceNav" aria-label="Categorieën">
      ${navLinks}
  </nav>
  <div>${groepen}
    <p class="price-note">Prijswijzigingen voorbehouden. Twijfel je welke behandeling bij je past? Plan een gratis intake, dan maken we samen een plan.</p>
  </div>
</div>
`;
  schrijf('preview/tarieven.html', pagina({
    titel: 'Tarieven — Huidzorg Mozi',
    omschrijving: 'Alle tarieven van Huidzorg Mozi: acnetherapie, SkinPen, peelings, laser, laserontharing en meer. Het intakegesprek is gratis.',
    actief: 'tarieven.html',
    notitie: 'Ontwerpvoorstel v2 — tarieven overgenomen van de huidige site · <a href="./">terug naar home</a>',
    inhoud
  }));
  console.log('preview/tarieven.html geschreven: ' + data.groepen.length + ' groepen, ' +
    data.groepen.reduce((n, g) => n + g.rijen.length, 0) + ' tarieven');
}

module.exports = { data, rijenHtml };
if (require.main === module) bouw();
