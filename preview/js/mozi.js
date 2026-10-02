/* ============================================================
   Huidzorg Mozi — gedeeld script (preview v2)
   Elk onderdeel controleert zelf of het op de pagina staat.
   ============================================================ */
(function(){
  'use strict';

  var $ = function(s, r){ return (r || document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    star:'<path d="M12 2.8l2.8 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17l-5.7 3.1 1.2-6.3L2.9 9.4l6.3-.8z"/>'
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
      var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); };
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
    kids.slice(kids.length / 2).forEach(function(k){ k.setAttribute('aria-hidden', 'true'); $$('a,button', k).forEach(function(a){ a.tabIndex = -1; }); });
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
    function setPos(p){
      p = Math.max(0, Math.min(100, p));
      ba.style.setProperty('--pos', p + '%');
      range.value = p;
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

  /* ---------- Webshop-teaser (voorbeeldproducten) ---------- */
  var shopGrid = $('#shopGrid');
  if (shopGrid){
    var producten = JSON.parse($('#shopData').textContent);
    function fles(vorm){
      var s = 'stroke="#1C1B19" stroke-width="1.2" fill="none"';
      if (vorm === 'tube')  return '<svg viewBox="0 0 80 160" aria-hidden="true"><path d="M18 20h44l-4 120H22z" fill="#FFFFFF" '+s+'/><rect x="26" y="140" width="28" height="14" rx="3" fill="#000"/><rect x="28" y="60" width="24" height="2" fill="#8A7A4E"/><rect x="30" y="68" width="20" height="1.5" fill="#C9C1AF"/></svg>';
      if (vorm === 'pipet') return '<svg viewBox="0 0 80 160" aria-hidden="true"><rect x="20" y="62" width="40" height="88" rx="8" fill="#EADFC2" '+s+'/><rect x="30" y="38" width="20" height="24" rx="3" fill="#000"/><path d="M34 14c0-6 12-6 12 0v24H34z" fill="#1C1B19"/><rect x="28" y="96" width="24" height="2" fill="#8A7A4E"/></svg>';
      if (vorm === 'pomp')  return '<svg viewBox="0 0 80 160" aria-hidden="true"><rect x="18" y="56" width="44" height="96" rx="10" fill="#FFFFFF" '+s+'/><rect x="30" y="40" width="20" height="16" fill="#000"/><path d="M36 40V24h22v6H42v10" fill="#000"/><rect x="28" y="92" width="24" height="2" fill="#8A7A4E"/><rect x="30" y="100" width="20" height="1.5" fill="#C9C1AF"/></svg>';
      return '<svg viewBox="0 0 80 160" aria-hidden="true"><rect x="12" y="92" width="56" height="52" rx="10" fill="#FFFFFF" '+s+'/><rect x="10" y="74" width="60" height="20" rx="6" fill="#000"/><rect x="28" y="114" width="24" height="2" fill="#8A7A4E"/></svg>';
    }
    shopGrid.innerHTML = producten.map(function(p, i){
      return '<a class="product reveal d' + (i % 4) + '" href="#">' +
        '<div class="img"><span class="tag">' + p.tag + '</span>' + fles(p.vorm) +
        '<button class="add" type="button" aria-label="' + p.naam + ' in winkelmand"><svg class="ico"><use href="#i-plus"/></svg></button></div>' +
        '<div class="brand-n">' + p.merk + '</div><div class="name">' + p.naam + '</div><div class="pr">' + p.prijs + '</div></a>';
    }).join('');
    $$('.reveal', shopGrid).forEach(observe);
    var mand = 0, teller = $('#cartCount');
    shopGrid.addEventListener('click', function(e){
      if (!e.target.closest('.add')) return;
      e.preventDefault();
      mand++; teller.textContent = mand; teller.hidden = false;
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
