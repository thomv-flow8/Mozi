/* ============================================================
   Huidzorg Mozi — gedeeld script (preview v2)
   Elk onderdeel controleert zelf of het op de pagina staat.
   ============================================================ */
(function(){
  'use strict';

  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Tekst veilig in HTML zetten, ook binnen attributen.
  var esc = function(s){ return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); };

  /* ---------- Salonized-instellingen (uit de huidige site) ---------- */
  var SALONIZED = {
    company: 'TEDTda42R5tfBZjpSw3Hfynv',
    kleur: '#000000',
    microsite: 'https://huidzorg-mozi.salonized.com'
  };
  function boekUrl(){
    return 'https://widget.salonized.com/widget?color=' + encodeURIComponent(SALONIZED.kleur) +
      '&language=nl&company=' + encodeURIComponent(SALONIZED.company) + '&inline=true';
  }

  /* ---------- SVG-iconenset (één bron voor alle pagina's) ---------- */
  var ICONS = {
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    cal:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    bag:'<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>',
    menu:'<path d="M4 8h16M4 16h16"/>',
    close:'<path d="M6 6l12 12M18 6L6 18"/>',
    check:'<circle cx="12" cy="12" r="9"/><path d="M8 12.3l2.7 2.7L16 9.7"/>',
    shield:'<path d="M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    pin:'<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    phone:'<path d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2 4 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
    insta:'<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17 7h.01"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    truck:'<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
    chat:'<path d="M4 5h16v11H9l-5 4V5z"/><path d="M8 9.5h8M8 12.5h5"/>',
    lr:'<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    pause:'<path d="M9 6v12M15 6v12"/>',
    play:'<path d="M8 5.5v13l10.5-6.5z"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    chev:'<path d="M6 9l6 6 6-6"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    star:'<path d="M12 2.8l2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17l-5.7 3.1 1.2-6.3L2.9 9.4l6.3-.8z"/>',
    // Huid-iconen voor "Geschikt bij" (behandelpagina's)
    'h-acne':'<path d="M3 17h3.5c.9-3.4 2.9-5.4 5.5-5.4s4.6 2 5.5 5.4H21"/><circle cx="12" cy="11.4" r="1.7"/><path d="M8.5 20h7"/>',
    'h-litteken':'<path d="M4 16c4-6 12-6 16-8"/><path d="M7 10.5l1.6 3M11 9l1.3 3.2M15 8l1 3"/>',
    'h-vaatjes':'<path d="M3 18c3-1 5-3 7-6s4-5 8-6"/><path d="M10 12c1 2 1 4 3 6M14 8c2 0 3 1 5 3M6.5 16.2c-1-1.5-1.5-3-1-5"/>',
    'h-roodheid':'<circle cx="12" cy="14" r="6"/><path d="M8.5 6c.8-1 .8-2 0-3M12 5.5c.8-1 .8-2 0-3M15.5 6c.8-1 .8-2 0-3"/>',
    'h-pigment':'<path d="M5.5 6.5c2-2 6-1.4 6.6 1.4s-1.4 5-4.2 4.6S3.6 8.4 5.5 6.5z"/><path d="M13.6 13.4c2.4-1.8 6.4-.6 6.4 2.2s-3.2 4.4-5.8 3.4-3-4-.6-5.6z"/>',
    'h-lijntjes':'<path d="M4 8c2.5-2 5-2 8 0s5.5 2 8 0M4 13c2.5-2 5-2 8 0s5.5 2 8 0M6 18c2-1.5 4-1.5 6 0s4 1.5 6 0"/>',
    'h-porien':'<circle cx="10" cy="10" r="6.5"/><path d="M15 15l5.5 5.5"/><circle cx="8" cy="8.5" r=".9"/><circle cx="12" cy="8.5" r=".9"/><circle cx="8" cy="12" r=".9"/><circle cx="12" cy="12" r=".9"/>',
    'h-glans':'<path d="M11 3l1.8 5.6L18.5 10l-5.7 1.6L11 17l-1.8-5.4L3.5 10l5.7-1.4z"/><path d="M18.5 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>',
    'h-gevoelig':'<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14"/><path d="M5 19c3-4 6-7 10-9"/>',
    'h-druppel':'<path d="M12 3.5c3 3.6 6 7.2 6 10.5a6 6 0 0 1-12 0c0-3.3 3-6.9 6-10.5z"/><path d="M6.6 15.2c1.8-1 3.6 1 5.4 0s3.6-1 5.4 0"/>',
    'h-oog':'<path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12z"/><circle cx="12" cy="12" r="2.6"/>',
    'h-bultje':'<path d="M3 19h18"/><path d="M12 19v-3"/><path d="M12 16c-2.3 0-3.6-1.7-3.6-3.6S10 8.3 12 6c2 2.3 3.6 4.4 3.6 6.4S14.3 16 12 16z"/>',
    'h-nagel':'<path d="M8 21V9a4 4 0 0 1 8 0v12"/><path d="M9.6 10.2a2.4 2.4 0 0 1 4.8 0V13H9.6z"/>',
    'h-striae':'<path d="M5 7l6 10M9 5l6 12M13 4l6 12"/>',
    'h-herstel':'<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-35 12 12)"/><path d="M10.6 11.4h.01M13.4 12.6h.01M11.4 13.4h.01M12.6 10.6h.01"/>',
    'h-tinten':'<circle cx="9" cy="10" r="4.5"/><circle cx="15" cy="10" r="4.5"/><circle cx="12" cy="15" r="4.5"/>',
    'h-gezicht':'<path d="M12 3c-4 0-7 3.2-7 8 0 5.5 3.4 10 7 10s7-4.5 7-10c0-4.8-3-8-7-8z"/><path d="M9.5 11h.01M14.5 11h.01M10 15.5c1.2.8 2.8.8 4 0"/>',
    'h-lichaam':'<circle cx="12" cy="4.5" r="2"/><path d="M8 9h8l-1 6h-1.5l-.5 6h-2l-.5-6H9z"/>',
    'h-flesje':'<rect x="7" y="9" width="10" height="12" rx="2.5"/><path d="M10 9V6h4v3M9.5 3.5h5V6h-5z"/><path d="M10 14h4"/>'
  };
  (function(){
    var s = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>';
    Object.keys(ICONS).forEach(function(k){ s += '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>'; });
    document.body.insertAdjacentHTML('afterbegin', s + '</defs></svg>');
  })();

  /* ---------- Navigatie ---------- */
  var nav = $('#nav');
  var bookFloat = $('#bookFloat');
  var drempel = $('[data-float-after]');
  function onScroll(){
    var y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (bookFloat){
      var na = drempel ? drempel.offsetTop + drempel.offsetHeight - 120 : 400;
      var bijnaEinde = (window.innerHeight + y) > (document.body.scrollHeight - 420);
      bookFloat.classList.toggle('show', y > na && !bijnaEinde);
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------- Mobiel menu ---------- */
  var menu = $('#mobileMenu'), openBtn = $('#menuOpen');
  function setMenu(open){
    if (!menu) return;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (openBtn) openBtn.addEventListener('click', function(){ setMenu(true); });
  if ($('#menuClose')) $('#menuClose').addEventListener('click', function(){ setMenu(false); });
  if (menu) $$('a', menu).forEach(function(a){ a.addEventListener('click', function(){ setMenu(false); }); });

  /* ---------- Reveal + 'play' voor mini-animaties ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.classList.contains('reveal') ? 'in' : 'play');
      if (e.target.hasAttribute('data-play')) e.target.classList.add('play');
      io.unobserve(e.target);
    });
  }, {rootMargin:'0px 0px -12% 0px'}) : null;
  function observe(el){
    if (io) io.observe(el);
    else { el.classList.add('in'); el.classList.add('play'); }
  }
  $$('.reveal, [data-play]').forEach(observe);

  /* ---------- Lichaamskaart laserontharing (zones aanklikbaar met tarief) ---------- */
  (function(){
    'use strict';
    // Zones per weergave en hun naam
    var NAMEN = {
      bovenlip:'Bovenlip', kin:'Kin', wenkbrauwen:'Tussen de wenkbrauwen', bakkebaarden:'Bakkebaarden',
      jukbeen:'Baardlijn jukbeen', 'baardlijn-hals':'Baardlijn hals', oren:'Oren', hals:'Hals',
      oksels:'Oksels', bovenarm:'Bovenarmen', onderarm:'Onderarmen', borst:'Borst', buik:'Buik',
      navel:'Navelstreepje', bikini:'Bikinilijn', bovenbeen:'Bovenbenen', onderbeen:'Onderbenen',
      voeten:'Voeten', rug:'Rug'
    };
    var WEERGAVE = { gezicht:'Gezicht', voorkant:'Voorkant', achterkant:'Achterkant' };
    var bk = document.getElementById('bk');
    if (!bk) return;
    var paneel = document.getElementById('bkPanel');
    var chips = document.getElementById('bkChips');
    var rijen = [], view = 'gezicht', zone = null, rijSel = null;
  
    function svgVan(v){ return bk.querySelector('svg[data-view="' + v + '"]'); }
    function zonesIn(v){
      var s = {}; svgVan(v).querySelectorAll('.z').forEach(function(p){ s[p.dataset.zone] = 1; });
      return Object.keys(s).sort(function(a, b){ return NAMEN[a].localeCompare(NAMEN[b]); });
    }
    function soort(r){ return (r.zones.length > 1 && !r.keuze) ? 'Combinatie' : 'Tarief'; }
  
    function markeer(lijst){
      bk.querySelectorAll('.z, .stip').forEach(function(p){ p.classList.toggle('sel', lijst.indexOf(p.dataset.zone) >= 0); });
    }
  
    function toonPaneel(){
      if (!zone){
        paneel.innerHTML = '<div class="bk-leeg"><p class="eyebrow">Laserontharing · Clarity II</p><h3>Kies een zone</h3><p>Tik op de tekening of kies hieronder een zone. Je ziet direct het tarief en voordeligere combinaties.</p></div>';
        markeer([]);
        return;
      }
      var passend = rijen.filter(function(r){ return r.zones.indexOf(zone) >= 0; });
      // Eerst losse tarieven, dan combinaties (kleinste eerst)
      passend.sort(function(a, b){ return (soort(a) === 'Combinatie') - (soort(b) === 'Combinatie') || a.zones.length - b.zones.length; });
      var buiten = rijSel ? rijSel.zones.filter(function(z){ return !svgVan(view).querySelector('.z[data-zone="' + z + '"]'); }) : [];
      paneel.innerHTML =
        '<p class="eyebrow">' + WEERGAVE[view] + '</p><h3>' + esc(NAMEN[zone]) + '</h3>' +
        '<div class="bk-opties">' + passend.map(function(r, i){
          return '<button type="button" class="bk-optie' + (rijSel === r ? ' sel' : '') + '" data-i="' + rijen.indexOf(r) + '">' +
            '<span class="lbl">' + soort(r) + '</span><b>' + esc(r.naam) + '</b><span class="amt">' + esc(r.prijs) + '</span>' +
            (r.info ? '<small>' + esc(r.info) + '</small>' : '') + '</button>';
        }).join('') + '</div>' +
        (buiten.length ? '<p class="bk-noot">Deze combinatie omvat ook: ' + buiten.map(function(z){ return esc(NAMEN[z]); }).join(', ') + '.</p>' : '') +
        '<p class="bk-noot">Andere combinaties zijn op aanvraag.</p>' +
        '<a class="btn btn-primary" href="#" data-book><svg class="ico"><use href="#i-cal"/></svg>Afspraak maken</a>';
      markeer(rijSel ? rijSel.zones : [zone]);
    }
  
    function toonChips(){
      chips.innerHTML = zonesIn(view).map(function(z){
        return '<button type="button" class="bk-chip' + (z === zone ? ' on' : '') + '" data-zone="' + z + '">' + esc(NAMEN[z]) + '</button>';
      }).join('');
    }
  
    function kies(z, scroll){
      zone = z; rijSel = null;
      toonPaneel(); toonChips();
      if (scroll && window.innerWidth < 900) paneel.scrollIntoView({behavior:'smooth', block:'nearest'});
    }
  
    function zetView(v){
      view = v;
      bk.querySelectorAll('.bk-tab').forEach(function(t){ t.setAttribute('aria-selected', String(t.dataset.view === v)); });
      bk.querySelectorAll('.bk-fig svg').forEach(function(s){ s.classList.toggle('on', s.dataset.view === v); });
      if (zone && zonesIn(v).indexOf(zone) < 0){ zone = null; rijSel = null; }
      toonPaneel(); toonChips();
    }
  
    // Interactie
    bk.querySelectorAll('.bk-tab').forEach(function(t){ t.addEventListener('click', function(){ zetView(t.dataset.view); }); });
    bk.querySelectorAll('.z').forEach(function(p){
      p.addEventListener('click', function(){ kies(p.dataset.zone, true); });
      p.addEventListener('mouseenter', function(){ bk.querySelectorAll('.z[data-zone="' + p.dataset.zone + '"]').forEach(function(q){ q.classList.add('hover'); }); });
      p.addEventListener('mouseleave', function(){ bk.querySelectorAll('.z.hover').forEach(function(q){ q.classList.remove('hover'); }); });
    });
    bk.querySelector('.bk-hoofd').addEventListener('click', function(){ zetView('gezicht'); });
    chips.addEventListener('click', function(e){ var c = e.target.closest('.bk-chip'); if (c) kies(c.dataset.zone, true); });
    paneel.addEventListener('click', function(e){
      var o = e.target.closest('.bk-optie'); if (!o) return;
      var r = rijen[+o.dataset.i];
      rijSel = (rijSel === r) ? null : r;
      toonPaneel();
    });
  
    // Gegevens uit de prijslijst (één bron): ingebed door de generator, of opgehaald (preview)
    var ingebed = document.getElementById('bkData');
    (ingebed ? Promise.resolve(JSON.parse(ingebed.textContent)) :
      fetch(bk.dataset.src).then(function(r){ return r.json(); }).then(function(d){
        return d.groepen.filter(function(x){ return x.id === 'ontharing'; })[0].rijen;
      })
    ).then(function(alle){
      var g = { rijen: alle };
      rijen = g.rijen.filter(function(r){ return r.zones && r.zones.length; });
      document.getElementById('bkAlles').innerHTML = g.rijen.map(function(r){
        var k = /gratis/i.test(r.prijs) ? 'amt free' : /aanvraag/i.test(r.prijs) ? 'amt ask' : 'amt';
        return '<div class="prow"><b>' + esc(r.naam) + '</b><span class="' + k + '">' + esc(r.prijs) + '</span>' + (r.info ? '<small>' + esc(r.info) + '</small>' : '') + '</div>';
      }).join('');
      toonPaneel(); toonChips();
    });
  })();

  /* ---------- Venster (Salonized): agenda of alle reviews, zonder landingspagina ---------- */
  var VENSTERS = {
    boek: { url: boekUrl, titel: 'Afspraak maken', sub: 'Kies je behandeling en een moment', frameTitel: 'Afspraak maken bij Huidzorg Mozi', nood: 'Laadt de agenda niet?', noodLink: 'Open de online agenda', noodUrl: function(){ return SALONIZED.microsite; } },
    reviews: { url: function(){ return SALONIZED.microsite + '/reviews?layout=embed'; }, titel: 'Alle reviews', sub: 'Via Salonized · powered by Treatwell', frameTitel: 'Reviews van Huidzorg Mozi', nood: 'Laden de reviews niet?', noodLink: 'Bekijk ze op Salonized', noodUrl: function(){ return SALONIZED.microsite + '/reviews'; } }
  };
  var modal = $('#bookModal');
  var frameWrap = modal ? $('.book-frame', modal) : null;
  var frames = {};
  var laatsteFocus = null;
  function openVenster(soort, e){
    if (!modal) return;
    if (e) e.preventDefault();
    var v = VENSTERS[soort];
    laatsteFocus = document.activeElement;
    setMenu(false);
    $('#bookTitle', modal).textContent = v.titel;
    $('.book-top span:not(.grip)', modal).textContent = v.sub;
    var nood = $('.book-fallback', modal);
    if (nood) nood.innerHTML = v.nood + ' <a href="' + v.noodUrl() + '" target="_blank" rel="noopener">' + v.noodLink + '</a>';
    Object.keys(frames).forEach(function(k){ frames[k].hidden = k !== soort; });
    if (!frames[soort]){
      // Pas laden bij de eerste klik: geen externe scripts of cookies vóór die tijd.
      var lader = document.createElement('div');
      lader.className = 'book-loading';
      lader.innerHTML = '<i></i>Laden…';
      frameWrap.appendChild(lader);
      var f = document.createElement('iframe');
      f.title = v.frameTitel;
      f.allow = 'geolocation';
      f.src = v.url();
      // Het eerste load-event komt van het lege startvenster (about:blank); dat negeren we.
      // Pas als het venster van Salonized is (cross-origin, dus niet uitleesbaar) telt het, en
      // ook dan tekent de agenda zich nog even na. Uiterlijk na 15 seconden verdwijnt de lader.
      var weg = function(){ if (lader.parentNode) lader.remove(); };
      f.addEventListener('load', function(){
        try { if (f.contentWindow.location.href) return; } catch (err) { /* externe pagina geladen */ }
        setTimeout(weg, 2200);
      });
      setTimeout(weg, 15000);
      frameWrap.appendChild(f);
      frames[soort] = f;
    }
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){ var c = $('.book-close', modal); if (c) c.focus(); }, 50);
  }
  function sluitVenster(){
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (laatsteFocus) laatsteFocus.focus();
  }
  if (modal){
    var oudeLader = $('.book-loading', frameWrap); if (oudeLader) oudeLader.remove();
    document.addEventListener('click', function(e){
      var a = e.target.closest('[data-book],[data-reviews]');
      if (a) openVenster(a.hasAttribute('data-reviews') ? 'reviews' : 'boek', e);
    });
    $$('[data-book-close]', modal).forEach(function(b){ b.addEventListener('click', sluitVenster); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && modal.classList.contains('open')) sluitVenster(); });
  }

  /* ---------- Reviews uit docs/reviews.json (later: dagelijks ververst door een serverfunctie) ---------- */
  var revCards = $('#revCards');
  if (revCards && window.fetch){
    var ster = '<svg viewBox="0 0 24 24"><use href="#i-star"/></svg>';
    fetch(revCards.dataset.src).then(function(r){ return r.json(); }).then(function(d){
      var score = String(d.score.toFixed ? d.score.toFixed(1) : d.score).replace('.', ',');
      $$('[data-rev-score]').forEach(function(el){ el.textContent = score; });
      $$('[data-rev-count]').forEach(function(el){ el.textContent = d.aantal; });
      var max = +(revCards.dataset.max || 6);
      // Nieuwste reviews met een inhoudelijke tekst; de lijst staat al op datum (nieuwste eerst).
      var keuze = d.reviews.filter(function(r){ return r.tekst && r.tekst.length >= 45; }).slice(0, max);
      revCards.innerHTML = keuze.map(function(r, i){
        return '<figure class="rev-card reveal d' + (i % 3) + '">' +
          '<div class="stars" aria-label="' + r.sterren + ' van 5 sterren">' + new Array(Math.round(r.sterren) + 1).join(ster) + '</div>' +
          '<q>' + esc(r.tekst) + '</q>' +
          '<figcaption class="by"><span class="av">' + esc(r.naam.charAt(0)) + '</span><div><b>' + esc(r.naam) + '</b><span>' + esc(r.wanneer) + '</span></div></figcaption></figure>';
      }).join('');
      $$('.reveal', revCards).forEach(observe);
    }).catch(function(){ /* zonder data blijft de knop naar alle reviews werken */ });
  }

  /* ---------- Subnavigatie op behandelpagina's ---------- */
  var subnav = $('.t-subnav');
  if (subnav && 'IntersectionObserver' in window){
    var sublinks = $$('a', subnav);
    var sio = new IntersectionObserver(function(en){
      en.forEach(function(e){
        if (!e.isIntersecting) return;
        sublinks.forEach(function(a){
          var on = a.getAttribute('href') === '#' + e.target.id;
          a.classList.toggle('on', on);
          if (on) subnav.firstElementChild.scrollTo({left: a.offsetLeft - 16, behavior: 'smooth'});
        });
      });
    }, {rootMargin:'-35% 0px -55% 0px'});
    sublinks.forEach(function(a){ var s = document.getElementById(a.getAttribute('href').slice(1)); if (s) sio.observe(s); });
  }

  /* ---------- Filmband: video als die er is, anders bewegende foto's ---------- */
  var film = $('.film');
  if (film){
    var frame = $('.film-frame', film);
    var video = $('video', frame);
    var slides = $$('.film-slide', frame);
    var dots = $('.film-dots', frame);
    var ctrl = $('.film-ctrl', frame);
    var idx = 0, timer = null, gepauzeerd = reduceMotion;
    if (dots) dots.innerHTML = slides.map(function(){ return '<i></i>'; }).join('');
    function toon(i){
      slides.forEach(function(s, n){ s.classList.toggle('on', n === i); });
      if (dots) $$('i', dots).forEach(function(d, n){
        d.classList.remove('on'); void d.offsetWidth; if (n === i) d.classList.add('on');
      });
    }
    function volgende(){ idx = (idx + 1) % slides.length; toon(idx); }
    function start(){ stop(); if (!video && slides.length > 1) timer = setInterval(volgende, 6000); if (video) video.play().catch(function(){}); }
    function stop(){ clearInterval(timer); timer = null; if (video) video.pause(); }
    function zetKnop(){
      film.classList.toggle('paused', gepauzeerd);
      if (ctrl){
        ctrl.innerHTML = '<svg class="ico"><use href="#i-' + (gepauzeerd ? 'play' : 'pause') + '"/></svg>';
        ctrl.setAttribute('aria-label', gepauzeerd ? 'Beweging afspelen' : 'Beweging pauzeren');
      }
    }
    if (slides.length) toon(0);
    if (ctrl) ctrl.addEventListener('click', function(){ gepauzeerd = !gepauzeerd; gepauzeerd ? stop() : start(); zetKnop(); });
    // Alleen afspelen als de band in beeld is (scheelt batterij op mobiel).
    if ('IntersectionObserver' in window){
      new IntersectionObserver(function(en){
        en.forEach(function(e){ if (e.isIntersecting && !gepauzeerd) start(); else stop(); });
      }, {threshold:.25}).observe(frame);
    } else if (!gepauzeerd) start();
    zetKnop();
  }

  /* ---------- Doorschuivende rijen (dubbele inhoud voor een naadloze lus) ---------- */
  $$('.marquee-track').forEach(function(t){
    var kopie = t.innerHTML;
    t.insertAdjacentHTML('beforeend', kopie);
    // Tweede helft is decoratief herhaald: verberg voor schermlezers.
    var kids = Array.prototype.slice.call(t.children);
    kids.slice(kids.length / 2).forEach(function(k){ k.setAttribute('aria-hidden', 'true'); $$('a,button', k).forEach(function(a){ a.tabIndex = -1; }); if (k.hasAttribute('data-play')) observe(k); });
  });
  var proof = $('.proof'), motionBtn = $('#motionBtn');
  if (proof && motionBtn){
    var stil = reduceMotion;
    function zetMotion(){
      proof.classList.toggle('paused', stil);
      motionBtn.innerHTML = '<svg class="ico"><use href="#i-' + (stil ? 'play' : 'pause') + '"/></svg>' + (stil ? 'Beweging afspelen' : 'Beweging pauzeren');
    }
    motionBtn.addEventListener('click', function(){ stil = !stil; zetMotion(); });
    zetMotion();
  }

  /* ---------- Behandelingen: filter op categorie of huidklacht ---------- */
  var tgrid = $('#treatGrid');
  if (tgrid){
    var kaarten = $$('.treat', tgrid);
    var knoppen = $$('.filter');
    var note = $('#concernNote');
    function filter(cat, klacht){
      kaarten.forEach(function(k){
        var ok = klacht ? (k.dataset.concerns || '').split(',').indexOf(klacht) >= 0
                        : (cat === 'alle' || k.dataset.cat === cat);
        k.hidden = !ok;
      });
      knoppen.forEach(function(b){ b.setAttribute('aria-pressed', String(!klacht && b.dataset.filter === cat)); });
      if (note){
        note.classList.toggle('on', !!klacht);
        if (klacht) $('b', note).textContent = klacht;
      }
    }
    knoppen.forEach(function(b){ b.addEventListener('click', function(){ filter(b.dataset.filter); }); });
    $$('[data-concern]').forEach(function(c){
      c.addEventListener('click', function(e){
        e.preventDefault();
        filter(null, c.dataset.concern);
        $('#behandelingen').scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
      });
    });
    if (note) $('button', note).addEventListener('click', function(){ filter('alle'); });
  }

  /* ---------- Voor/na-slider ---------- */
  var ba = $('#ba');
  if (ba){
    var range = $('#baRange');
    var imgV = $('.before', ba), imgN = $('.after', ba);
    var info = $('#caseInfo'), credit = $('#caseCredit');
    var cases = JSON.parse($('#baCases').textContent);
    // Labels: een label vervaagt zodra de schuiflijn eroverheen gaat en is weg als de lijn
    // er voorbij is. Staat de slider helemaal links, dan zie je alleen "Na"; helemaal
    // rechts alleen "Voor". Gerekend met de echte maat van de labels, dus op elke breedte.
    var lblV = $('.lbl.l', ba), lblN = $('.lbl.r', ba), maat = null;
    function meet(){
      maat = { w: ba.clientWidth,
        vL: lblV.offsetLeft, vR: lblV.offsetLeft + lblV.offsetWidth,
        nL: lblN.offsetLeft, nR: lblN.offsetLeft + lblN.offsetWidth };
    }
    function labels(p){
      if (!lblV || !lblN) return;
      if (!maat || !maat.w) meet();
      if (!maat.w) return;                       // nog niet zichtbaar: niets aanpassen
      var x = p / 100 * maat.w, ruimte = 8;
      var v = (x - maat.vL) / (maat.vR + ruimte - maat.vL);
      var n = (maat.nR - x) / (maat.nR - (maat.nL - ruimte));
      lblV.style.opacity = Math.max(0, Math.min(1, v));
      lblN.style.opacity = Math.max(0, Math.min(1, n));
    }
    window.addEventListener('resize', function(){ maat = null; labels(+range.value); });
    function setPos(p){
      p = Math.max(0, Math.min(100, p));
      ba.style.setProperty('--pos', p + '%');
      range.value = p;
      labels(p);
    }
    function posFromEvent(e){ var r = ba.getBoundingClientRect(); return (e.clientX - r.left) / r.width * 100; }
    var slepen = false, sx = 0, sy = 0, besloten = false;
    ba.addEventListener('pointerdown', function(e){
      slepen = true; besloten = e.pointerType !== 'touch'; sx = e.clientX; sy = e.clientY;
      if (besloten){ ba.setPointerCapture(e.pointerId); ba.classList.add('dragging'); setPos(posFromEvent(e)); }
    });
    ba.addEventListener('pointermove', function(e){
      if (!slepen) return;
      if (!besloten){
        // Touch: alleen meeschuiven bij een vooral horizontale beweging, anders scrollt de pagina.
        var dx = Math.abs(e.clientX - sx), dy = Math.abs(e.clientY - sy);
        if (dx < 6 && dy < 6) return;
        if (dy > dx){ slepen = false; return; }
        besloten = true; ba.setPointerCapture(e.pointerId); ba.classList.add('dragging');
      }
      setPos(posFromEvent(e));
    });
    function stopSlepen(){ slepen = false; ba.classList.remove('dragging'); }
    ba.addEventListener('pointerup', function(e){ if (slepen && !besloten) setPos(posFromEvent(e)); stopSlepen(); });
    ba.addEventListener('pointercancel', stopSlepen);
    range.addEventListener('input', function(){ setPos(+range.value); });

    function toonCase(i){
      var c = cases[i];
      ba.classList.add('loading');
      var geladen = 0;
      function klaar(){ if (++geladen === 2) ba.classList.remove('loading'); }
      imgV.onload = klaar; imgN.onload = klaar;
      imgV.src = c.voor; imgN.src = c.na;
      imgV.alt = c.naam + ', voor de behandeling'; imgN.alt = c.naam + ', na de behandeling';
      info.innerHTML = c.info.map(function(r){ return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('');
      if (credit) credit.textContent = c.bron;
      $$('.tab').forEach(function(t){ t.setAttribute('aria-selected', String(+t.dataset.case === i)); });
      setPos(50);
    }
    $$('.tab').forEach(function(t){ t.addEventListener('click', function(){ toonCase(+t.dataset.case); }); });
    toonCase(0);
  }

  /* ---------- Webshop: producten uit docs/producten.json ---------- */
  var shopGrid = $('#shopGrid');
  var prodModal = $('#prodModal');
  if (shopGrid){
    var producten = JSON.parse($('#shopData').textContent);
    shopGrid.innerHTML = producten.map(function(p, i){
      return '<a class="product reveal d' + (i % 4) + '" href="#" data-prod="' + i + '">' +
        '<div class="img">' + (p.tag ? '<span class="tag">' + esc(p.tag) + '</span>' : '') +
        '<img src="' + esc(p.beeld) + '" alt="' + esc(p.merk + ' ' + p.naam) + '" loading="lazy"' +
          (p.schaal ? ' style="--s:' + p.schaal + '"' : '') + '>' +
        '<span class="add" aria-hidden="true"><svg class="ico"><use href="#i-arrow"/></svg></span></div>' +
        '<div class="brand-n">' + esc(p.merk) + '</div>' +
        '<div class="name">' + esc(p.naam) + '</div>' +
        '<div class="pr">' + [p.inhoud, p.prijs].filter(Boolean).map(esc).join(' &middot; ') + '</div></a>';
    }).join('') +
      '<a class="shop-cta reveal d3" href="behandeling-productadvies.html">' +
      '<p class="eyebrow">Meer in de praktijk</p>' +
      '<b>Welke verzorging past bij jouw huid?</b>' +
      '<p>We werken met vier merken. Tijdens een huidanalyse kiezen we samen wat jouw huid nodig heeft.</p>' +
      '<span class="link-arrow">Naar productadvies <svg class="ico"><use href="#i-arrow"/></svg></span></a>';
    $$('.reveal', shopGrid).forEach(observe);
  }

  /* ---------- Productvenster ---------- */
  if (shopGrid && prodModal){
    var prodBody = $('#prodBody'), prodFocus = null;
    function toonProduct(p){
      $('#prodTitle').textContent = p.merk + ' ' + p.naam;
      $('#prodSub').textContent = [p.ondertitel, p.inhoud].filter(Boolean).join(' \u00b7 ');
      $('#prodPrijs').textContent = p.prijs || '';
      prodBody.innerHTML =
        (p.beeld ? '<div class="prod-beeld"><img src="' + esc(p.beeld) + '" alt=""></div>' : '') +
        (p.kort ? '<p>' + esc(p.kort) + '</p>' : '') +
        (p.punten && p.punten.length ? '<ul class="prod-punten">' + p.punten.map(function(t){
          return '<li><svg class="ico"><use href="#i-check"/></svg><span>' + esc(t) + '</span></li>';
        }).join('') + '</ul>' : '') +
        (p.huidtype ? '<div class="prod-rij"><b>Voor welke huid</b><span>' + esc(p.huidtype) + '</span></div>' : '') +
        (p.gebruik ? '<div class="prod-rij"><b>Gebruik</b><span>' + esc(p.gebruik) + '</span></div>' : '');
      prodBody.scrollTop = 0;
    }
    function openProduct(p, e){
      if (e) e.preventDefault();
      prodFocus = document.activeElement;
      setMenu(false);
      toonProduct(p);
      prodModal.classList.add('open');
      prodModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(function(){ var c = $('.book-close', prodModal); if (c) c.focus(); }, 50);
    }
    function sluitProduct(){
      prodModal.classList.remove('open');
      prodModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (prodFocus) prodFocus.focus();
    }
    shopGrid.addEventListener('click', function(e){
      var kaart = e.target.closest('[data-prod]');
      if (kaart) openProduct(producten[+kaart.getAttribute('data-prod')], e);
    });
    $$('[data-prod-close]', prodModal).forEach(function(b){ b.addEventListener('click', sluitProduct); });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && prodModal.classList.contains('open')) sluitProduct();
    });
  }

  /* ---------- Tarieven: actieve categorie + openklappen ---------- */
  var priceNav = $('#priceNav');
  if (priceNav){
    var links = $$('a', priceNav);
    links.forEach(function(a){
      a.addEventListener('click', function(){
        var d = document.getElementById(a.getAttribute('href').slice(1));
        if (d && d.tagName === 'DETAILS') d.open = true;
      });
    });
    if ('IntersectionObserver' in window){
      var pio = new IntersectionObserver(function(en){
        en.forEach(function(e){
          if (!e.isIntersecting) return;
          links.forEach(function(a){
            var on = a.getAttribute('href') === '#' + e.target.id;
            a.classList.toggle('on', on);
            // Mobiel: houd de actieve categorie zichtbaar in de horizontale balk.
            if (on && window.innerWidth < 1000) priceNav.scrollTo({left: a.offsetLeft - 16, behavior: 'smooth'});
          });
        });
      }, {rootMargin:'-30% 0px -60% 0px'});
      $$('.price-group').forEach(function(g){ pio.observe(g); });
    }
  }
})();
