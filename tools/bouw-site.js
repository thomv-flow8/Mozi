// Bouwt de publiceerbare site in _site/ (voor GitHub Pages).
// 1. Genereert tarieven- en behandelpagina's uit docs/*.json
// 2. Kopieert de pagina's, stijl, script, gebruikte afbeeldingen en reviewdata
// 3. Zet paden om: ../assets/ → assets/, ../docs/reviews.json → data/reviews.json
// Gebruik: node tools/bouw-site.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const uit = path.join(root, '_site');

// 1. Genereren (zelfde scripts als lokaal)
// genereer-producten.js eerst: dat werkt index.html bij, waar de andere scripts kop en voet uit halen.
for (const s of ['genereer-producten.js', 'genereer-tarieven.js', 'genereer-behandelingen.js', 'genereer-over.js', 'genereer-juridisch.js']) {
  execFileSync(process.execPath, [path.join(__dirname, s)], { stdio: 'inherit' });
}

// 2. Schone uitvoermap
fs.rmSync(uit, { recursive: true, force: true });
fs.mkdirSync(uit, { recursive: true });
const kopieer = (van, naar) => fs.cpSync(path.join(root, van), path.join(uit, naar), { recursive: true });

// Alleen de pagina's van de site zelf (geen werkbestanden zoals materiaal.html of v1)
const paginas = fs.readdirSync(path.join(root, 'preview'))
  .filter(f => ['index.html', 'tarieven.html', 'over-mozi.html', 'privacy.html', 'cookies.html', 'algemene-voorwaarden.html'].includes(f) || /^behandeling-[a-z0-9-]+\.html$/.test(f));
kopieer('preview/css', 'css');
kopieer('preview/js', 'js');
kopieer('preview/fonts', 'fonts');
for (const map of ['web', 'logos', 'resultaten', 'bewerkt']) kopieer('assets/' + map, 'assets/' + map);
fs.mkdirSync(path.join(uit, 'data'));
kopieer('docs/reviews.json', 'data/reviews.json');

// 3. Paden omzetten en de link naar v1 uit de previewbalk halen
let telling = 0;
for (const p of paginas) {
  let html = fs.readFileSync(path.join(root, 'preview', p), 'utf8');
  html = html.replace(/\.\.\/assets\//g, () => { telling++; return 'assets/'; })
             .replace(/\.\.\/docs\/reviews\.json/g, 'data/reviews.json')
             .replace(/ · <a href="v1\/">bekijk v1<\/a>/g, '');
  if (/\.\.\//.test(html)) throw new Error('Onverwacht pad met ../ in ' + p);
  fs.writeFileSync(path.join(uit, p), html);
}
// Geen Jekyll-verwerking door GitHub Pages
fs.writeFileSync(path.join(uit, '.nojekyll'), '');

// Controle: bestaat elke verwijzing?
const mis = [];
for (const p of paginas) {
  const html = fs.readFileSync(path.join(uit, p), 'utf8');
  for (const m of html.matchAll(/(?:src|href)="([^"#:?]+\.(?:jpg|png|webp|css|js|html|json))"/g)) {
    if (!fs.existsSync(path.join(uit, m[1]))) mis.push(p + ' → ' + m[1]);
  }
  for (const m of html.matchAll(/"(?:voor|na)":"([^"]+)"/g)) {
    if (!fs.existsSync(path.join(uit, m[1]))) mis.push(p + ' → ' + m[1]);
  }
}
if (mis.length) throw new Error('Ontbrekende bestanden:\n' + mis.join('\n'));
console.log(`_site/ gebouwd: ${paginas.length} pagina's, ${telling} paden omgezet, alle verwijzingen gevonden.`);
