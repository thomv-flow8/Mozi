// Haalt de gebruikte Google Fonts op en zet ze in preview/fonts/ (zelf hosten: geen verzoeken meer naar Google).
// Alleen de tekensets latin en latin-ext. Licentie: SIL Open Font License (zelf hosten toegestaan).
// Gebruik: node tools/haal-lettertypes.js
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
const uitMap = path.join(root, 'preview/fonts');

(async () => {
  const css = await (await fetch(URL, { headers: { 'User-Agent': UA } })).text();
  // Blokken: "/* subset */\n@font-face { ... }"
  const blokken = [...css.matchAll(/\/\* ([a-z-]+) \*\/\s*(@font-face\s*\{[^}]+\})/g)]
    .filter(m => m[1] === 'latin' || m[1] === 'latin-ext');
  fs.mkdirSync(uitMap, { recursive: true });
  const gedownload = new Map();
  let uit = '/* Zelf gehoste lettertypes (gegenereerd door tools/haal-lettertypes.js). Licentie: SIL Open Font License. */\n';
  for (const [, subset, blok] of blokken) {
    const familie = blok.match(/font-family:\s*'([^']+)'/)[1];
    const stijl = blok.match(/font-style:\s*(\w+)/)[1];
    const bron = blok.match(/url\((https:[^)]+\.woff2)\)/)[1];
    if (!gedownload.has(bron)) {
      const naam = `${familie.toLowerCase().replace(/\s+/g, '-')}-${stijl}-${subset}-${gedownload.size}.woff2`;
      const buf = Buffer.from(await (await fetch(bron)).arrayBuffer());
      fs.writeFileSync(path.join(uitMap, naam), buf);
      gedownload.set(bron, naam);
    }
    uit += `/* ${subset} */\n` + blok.replace(bron, gedownload.get(bron)) + '\n';
  }
  fs.writeFileSync(path.join(uitMap, 'fonts.css'), uit);
  const kb = [...gedownload.values()].reduce((n, f) => n + fs.statSync(path.join(uitMap, f)).size, 0) / 1024;
  console.log(`${blokken.length} @font-face-regels, ${gedownload.size} bestanden, ${Math.round(kb)} kB → preview/fonts/`);
})().catch(e => { console.error('Mislukt:', e.message); process.exit(1); });
