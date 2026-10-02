// Gedeelde bouwstenen voor gegenereerde previewpagina's (tarieven, behandelingen).
// Kop en voet komen uit preview/index.html, zodat alle pagina's gelijk blijven.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const lees = p => fs.readFileSync(path.join(root, p), 'utf8');
const index = lees('preview/index.html');

function stuk(begin, eind) {
  const a = index.indexOf(begin), b = index.indexOf(eind, a);
  if (a < 0 || b < 0) throw new Error('Markering niet gevonden: ' + begin + ' / ' + eind);
  return index.slice(a, b);
}
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Ankers naar de homepage laten wijzen. Alleen links (<a>), niet de icoonverwijzingen (<use href="#i-...">).
const naarHome = s => s.replace(/(<a\b[^>]*\bhref=")#(?=[a-z])/g, '$1./#');

function pagina({ titel, omschrijving, actief, notitie, inhoud }) {
  let kop = naarHome(stuk('<div class="announce">', '<main>'));
  if (actief) kop = kop.replace(new RegExp('<a href="' + actief.replace('.', '\\.') + '">', 'g'), '<a href="' + actief + '" aria-current="page">');
  const voet = naarHome(stuk('<footer>', '<script src="js/mozi.js">'));
  const head = stuk('<!doctype html>', '<body>')
    .replace(/<title>[^<]*<\/title>/, '<title>' + esc(titel) + '</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(omschrijving) + '">');
  return `${head}<body>

<div class="preview-note">${notitie}</div>

${kop}<main>
${inhoud}
</main>

${voet}<script src="js/mozi.js"></script>
</body>
</html>
`;
}

function schrijf(rel, html) {
  fs.writeFileSync(path.join(root, rel), html);
}

module.exports = { root, lees, esc, pagina, schrijf };
