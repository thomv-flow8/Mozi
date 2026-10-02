// Haalt de reviews op van de bestaande Salonized-reviewpagina (dezelfde bron als de huidige site,
// "powered by Treatwell") en schrijft ze naar docs/reviews.json.
// Gebruik: node tools/haal-reviews.js
// Later in productie: dezelfde logica in een kleine serverfunctie die dit dagelijks ververst,
// want de browser mag deze pagina niet rechtstreeks uitlezen (geen CORS-toestemming).
const fs = require('fs');
const path = require('path');
const BASIS = 'https://huidzorg-mozi.salonized.com/reviews?layout=embed';

const ontsnap = s => s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();

function lees(html) {
  const blokken = html.split("<div class='review'>").slice(1);
  return blokken.map(b => {
    const sterren = +((b.match(/class="stars" title="(\d+(?:\.\d+)?)"/) || [])[1] || 0);
    const tekst = ontsnap((b.match(/<p class="review-body">([\s\S]*?)<\/p>/) || [])[1] || '');
    const det = (b.match(/<div class='review-details'>([\s\S]*?)<\/div>/) || [])[1] || '';
    const naam = ontsnap((det.match(/<b>([\s\S]*?)<\/b>/) || [])[1] || '');
    const wanneer = ontsnap(det.replace(/<b>[\s\S]*?<\/b>/, '').replace(/^\s*-\s*/, ''));
    return { naam, sterren, tekst, wanneer };
  });
}

(async () => {
  const eerste = await (await fetch(BASIS)).text();
  const score = +((eerste.match(/<div class='rating'>([\d.,]+)<\/div>/) || [])[1] || '0').replace(',', '.');
  const aantal = +((eerste.match(/gebaseerd op (\d+) reviews/) || [])[1] || 0);
  let reviews = lees(eerste);
  for (let p = 2; p <= 30; p++) {
    const r = lees(await (await fetch(BASIS + '&page=' + p)).text());
    if (!r.length) break;
    reviews = reviews.concat(r);
  }
  const data = { bron: 'https://huidzorg-mozi.salonized.com/reviews', opgehaald: new Date().toISOString().slice(0, 10),
    score, aantal, reviews };
  fs.writeFileSync(path.join(__dirname, '..', 'docs/reviews.json'), JSON.stringify(data, null, 2) + '\n');
  const metTekst = reviews.filter(r => r.tekst).length;
  console.log(`Score ${score} uit ${aantal} reviews; ${reviews.length} opgehaald, ${metTekst} met tekst.`);
})().catch(e => { console.error('Ophalen mislukt:', e.message); process.exit(1); });
