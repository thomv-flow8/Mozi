// Genereert de juridische pagina's (privacy, cookies, algemene voorwaarden) uit docs/juridisch.json.
// [[…]] wordt gemarkeerd als nog in te vullen.
// Gebruik: node tools/genereer-juridisch.js
const { lees, esc, pagina, schrijf } = require('./sjabloon');
const d = JSON.parse(lees('docs/juridisch.json'));
const em = s => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
const tekst = s => esc(s).replace(/\[\[(.+?)\]\]/g, '<mark class="todo">$1</mark>');

let open = 0;
for (const p of d.paginas) {
  const nogInTeVullen = p.secties.reduce((n, s) => n + s.tekst.join(' ').split('[[').length - 1, 0);
  open += nogInTeVullen;
  const inhoud = `
<div class="wrap">
  <nav class="crumbs" aria-label="Kruimelpad"><a href="./">Home</a><span aria-hidden="true">/</span><span>${esc(p.titel)}</span></nav>
</div>
<section class="page-head">
  <div class="wrap">
    <h1 class="reveal" style="font-size:clamp(40px,6vw,72px)">${em(p.kop)}</h1>
    <p class="lead reveal d1">${esc(p.intro)}</p>
    ${nogInTeVullen ? `<p class="concept reveal d1">Opzet: de gemarkeerde delen worden nog ingevuld en juridisch gecontroleerd.</p>` : ''}
  </div>
</section>
<section class="section" style="padding-top:0">
  <div class="wrap legal">
    ${p.secties.map(s => `<div class="legal-blok reveal"><h2>${esc(s.kop)}</h2>${s.tekst.map(t => `<p>${tekst(t)}</p>`).join('')}</div>`).join('\n    ')}
  </div>
</section>
`;
  schrijf(`preview/${p.slug}.html`, pagina({
    titel: `${p.titel} — Huidzorg Mozi`,
    omschrijving: `${p.titel} van Huidzorg Mozi, huidtherapie in Gorinchem.`,
    notitie: 'Ontwerpvoorstel — juridische pagina (opzet) · <a href="./">terug naar home</a>',
    inhoud
  }));
  console.log(`preview/${p.slug}.html geschreven (${nogInTeVullen} plekken in te vullen)`);
}
console.log(`Totaal nog in te vullen: ${open}`);
