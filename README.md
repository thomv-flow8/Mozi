# Huidzorg Mozi — website

Nieuwe website voor Huidzorg Mozi (huidtherapie, Gorinchem). Zie `PROJECT.md` voor de achtergrond,
gemaakte keuzes en de stand van zaken.

## Bekijken
```bash
node tools/serve.js
```
Daarna: http://localhost:5173/preview/

## Pagina's opnieuw genereren
```bash
node tools/genereer-tarieven.js       # tarieven uit docs/tarieven.json
node tools/genereer-behandelingen.js  # behandelpagina's uit docs/behandelingen.json
node tools/haal-reviews.js            # reviews van Salonized naar docs/reviews.json
```
