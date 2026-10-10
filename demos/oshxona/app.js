/* Oshxona Navro‘z — concept site interactions (vanilla JS) */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var NBSP = ' ';
  function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP) + NBSP + 'сум'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ------------------------------------------------------------------
     Menu data (concept: dishes and prices are illustrative)
  ------------------------------------------------------------------ */
  var TILES = { plov: '#f3dfb5', shashlik: '#f4d3c3', samsa: '#f6e1bd', soup: '#d6ebe7', salad: '#e3ead2', drinks: '#d9e5ef' };
  var MENU = {
    plov: [
      { id: 'p1', name: 'Ташкентский плов', desc: 'Рис девзира, баранина, жёлтая морковь, нут и перепелиное яйцо.', w: '400 г', price: 55000, icon: 'plov', tag: 'Фирменный' },
      { id: 'p2', name: 'Самаркандский плов', desc: 'Морковь и мясо слоями, рис не перемешивается — по-самаркандски.', w: '400 г', price: 52000, icon: 'plov' },
      { id: 'p3', name: 'Плов с казы', desc: 'С конской колбасой казы, чесноком и перепелиными яйцами.', w: '420 г', price: 68000, icon: 'lagan' },
      { id: 'p4', name: 'Свадебный плов', desc: 'Тўй оши: с изюмом, нутом и целой головкой чеснока.', w: '400 г', price: 58000, icon: 'plov' },
      { id: 'p5', name: 'Ляган на компанию', desc: 'Большое блюдо плова на 4–5 персон, с ачичуком и лепёшкой.', w: '2 кг', price: 260000, icon: 'lagan', tag: 'На компанию', tagType: 'blue' },
      { id: 'p6', name: 'Плов с айвой и нутом', desc: 'Без мяса: айва, нут, изюм и барбарис на хлопковом масле.', w: '350 г', price: 42000, icon: 'veg', tag: 'Без мяса', tagType: 'green' }
    ],
    shashlik: [
      { id: 's1', name: 'Шашлык из баранины', desc: 'Мякоть на углях, маринованный лук и щепотка зиры.', w: '180 г', price: 32000, icon: 'skewer', tag: 'Фирменный' },
      { id: 's2', name: 'Люля-кебаб', desc: 'Рубленая баранина с курдючным жиром, зира и кориандр.', w: '160 г', price: 28000, icon: 'lula' },
      { id: 's3', name: 'Шашлык из говядины', desc: 'Вырезка в маринаде с кинзой и молотым чёрным перцем.', w: '180 г', price: 30000, icon: 'skewer' },
      { id: 's4', name: 'Жигар', desc: 'Печень, прослоенная курдюком, — классика чайханы.', w: '150 г', price: 26000, icon: 'liver' },
      { id: 's5', name: 'Куриные крылышки', desc: 'На мангале, в маринаде с паприкой и чесноком.', w: '220 г', price: 27000, icon: 'wings' },
      { id: 's6', name: 'Овощи на мангале', desc: 'Помидор, сладкий перец, баклажан и лук с дымком.', w: '250 г', price: 22000, icon: 'vegskewer', tag: 'Без мяса', tagType: 'green' }
    ],
    samsa: [
      { id: 'b1', name: 'Самса тандырная', desc: 'Хрустящее тесто, рубленая баранина с луком и курдюком.', w: '180 г', price: 15000, icon: 'samsa', tag: 'Из тандыра' },
      { id: 'b2', name: 'Самса с тыквой', desc: 'Сладковатая тыква, лук и немного зиры.', w: '160 г', price: 12000, icon: 'pumpkin', tag: 'Без мяса', tagType: 'green' },
      { id: 'b3', name: 'Слоёная самса', desc: 'Тонкие слои теста, говядина и чёрный перец.', w: '170 г', price: 14000, icon: 'sloyka' },
      { id: 'b4', name: 'Патыр-нон', desc: 'Пышная тандырная лепёшка на курдючном жире.', w: '450 г', price: 10000, icon: 'non' },
      { id: 'b5', name: 'Нон с кунжутом', desc: 'Классическая лепёшка с узором-чекичем.', w: '350 г', price: 6000, icon: 'non' },
      { id: 'b6', name: 'Гумма', desc: 'Жареные пирожки с картофелем и зеленью, 2 шт.', w: '200 г', price: 12000, icon: 'gumma' }
    ],
    soup: [
      { id: 'u1', name: 'Шурпа из баранины', desc: 'Прозрачный бульон, крупные овощи и мясо на кости.', w: '450 мл', price: 38000, icon: 'soup', tag: 'Фирменный' },
      { id: 'u2', name: 'Лагман суюк', desc: 'Тянутая вручную лапша, говядина, перец и редька.', w: '450 мл', price: 40000, icon: 'lagman' },
      { id: 'u3', name: 'Мастава', desc: 'Рисовый суп с томатом, подаётся с катыком и зеленью.', w: '400 мл', price: 34000, icon: 'mastava' },
      { id: 'u4', name: 'Мошхурда', desc: 'Маш, рис и говядина, сверху — ложка катыка.', w: '400 мл', price: 33000, icon: 'mastava' },
      { id: 'u5', name: 'Чучвара в бульоне', desc: 'Маленькие пельмени с бараниной, укроп и уксус.', w: '400 мл', price: 36000, icon: 'chuchvara' }
    ],
    salad: [
      { id: 'a1', name: 'Ачичук', desc: 'Помидоры, тонкий лук, острый перец и райхон.', w: '250 г', price: 22000, icon: 'salad', tag: 'К плову' },
      { id: 'a2', name: 'Салат «Ташкент»', desc: 'Зелёная редька, отварная говядина, яйцо и жареный лук.', w: '230 г', price: 32000, icon: 'tashkent' },
      { id: 'a3', name: 'Сузьма с зеленью', desc: 'Густой катык, укроп, чеснок и хлопья перца.', w: '200 г', price: 18000, icon: 'suzma' },
      { id: 'a4', name: 'Баклажаны по-узбекски', desc: 'Жареные баклажаны с томатом, чесноком и кинзой.', w: '220 г', price: 28000, icon: 'eggplant' },
      { id: 'a5', name: 'Овощи с базара', desc: 'Огурцы, помидоры, перец, редис и пучок зелени.', w: '300 г', price: 26000, icon: 'salad', tag: 'Без мяса', tagType: 'green' }
    ],
    drinks: [
      { id: 'd1', name: 'Зелёный чай', desc: 'Кук-чой в чайнике — наливаем в пиалы по традиции.', w: '800 мл', price: 12000, icon: 'teapot', tag: 'Кайтарма' },
      { id: 'd2', name: 'Чёрный чай с чабрецом', desc: 'Крепкий, ароматный, с набатом — кристаллами сахара.', w: '800 мл', price: 14000, icon: 'teapot' },
      { id: 'd3', name: 'Пиала чая', desc: 'Если хочется просто одну пиалу к самсе.', w: '200 мл', price: 5000, icon: 'piyola' },
      { id: 'd4', name: 'Компот из сухофруктов', desc: 'Урюк, кишмиш, яблоко и айва, без лишнего сахара.', w: '1 л', price: 20000, icon: 'jug' },
      { id: 'd5', name: 'Лимонад с райхоном', desc: 'Домашний: лимон, фиолетовый базилик, мёд.', w: '1 л', price: 30000, icon: 'lemonade' },
      { id: 'd6', name: 'Айран', desc: 'Холодный катык с водой, солью и мятой.', w: '300 мл', price: 10000, icon: 'ayran' }
    ]
  };
  var ITEMS = {};
  Object.keys(MENU).forEach(function (cat) { MENU[cat].forEach(function (it) { it.cat = cat; ITEMS[it.id] = it; }); });

  /* ------------------------------------------------------------------
     Header: scrolled state, burger, active link
  ------------------------------------------------------------------ */
  var hdr = $('#hdr');
  var burger = $('#burger');
  var nav = $('#nav');

  function onScroll() { hdr.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var desktopMQ = window.matchMedia('(min-width: 960px)');
  function setNav(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) { var first = $('a', nav); if (first) first.focus({ preventScroll: true }); }
  }
  burger.addEventListener('click', function () { setNav(burger.getAttribute('aria-expanded') !== 'true'); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { if (!desktopMQ.matches) setNav(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setNav(false); burger.focus(); }
  });
  var onMQ = function () { if (desktopMQ.matches) setNav(false); };
  if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', onMQ); else desktopMQ.addListener(onMQ);

  // active section highlight
  var navLinks = $$('.nav__list a');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          a.classList.toggle('is-active', on);
          if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['menu', 'about', 'booking', 'contacts'].forEach(function (id) { var el = document.getElementById(id); if (el) secObs.observe(el); });
  }

  /* ------------------------------------------------------------------
     Hero: generate rice on the plate, load-in
  ------------------------------------------------------------------ */
  (function rice() {
    var g = document.getElementById('rice');
    if (!g) return;
    var seed = 20260310;
    function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
    function inDisc(R) { var a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * R; return [300 + Math.cos(a) * r, 300 + Math.sin(a) * r, r]; }
    var NS = 'http://www.w3.org/2000/svg';
    var frag = document.createDocumentFragment();
    var grainCols = ['#f8e6b6', '#f3d696', '#fcefcb', '#ebc277', '#f6dc9f'];
    var i, p, el;
    for (i = 0; i < 760; i++) {
      p = inDisc(194);
      el = document.createElementNS(NS, 'ellipse');
      el.setAttribute('cx', p[0].toFixed(1)); el.setAttribute('cy', p[1].toFixed(1));
      el.setAttribute('rx', (5.6 + rnd() * 1.6).toFixed(1)); el.setAttribute('ry', '2.2');
      el.setAttribute('fill', grainCols[(rnd() * grainCols.length) | 0]);
      el.setAttribute('transform', 'rotate(' + (rnd() * 180).toFixed(0) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')');
      frag.appendChild(el);
    }
    var carrotCols = ['#e8762f', '#d9611f', '#f08a3c', '#f2b53a', '#eda233'];
    for (i = 0; i < 80; i++) {
      p = inDisc(186);
      el = document.createElementNS(NS, 'rect');
      var len = 16 + rnd() * 12;
      el.setAttribute('x', (p[0] - len / 2).toFixed(1)); el.setAttribute('y', (p[1] - 2.4).toFixed(1));
      el.setAttribute('width', len.toFixed(1)); el.setAttribute('height', '4.8'); el.setAttribute('rx', '2.4');
      el.setAttribute('fill', carrotCols[(rnd() * carrotCols.length) | 0]);
      el.setAttribute('transform', 'rotate(' + (rnd() * 180).toFixed(0) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')');
      frag.appendChild(el);
    }
    for (i = 0; i < 26; i++) {
      p = inDisc(180);
      if (p[2] < 100) { i--; continue; }
      el = document.createElementNS(NS, 'circle');
      el.setAttribute('cx', p[0].toFixed(1)); el.setAttribute('cy', p[1].toFixed(1)); el.setAttribute('r', '7');
      el.setAttribute('fill', '#e9c27f'); el.setAttribute('stroke', '#c99a55'); el.setAttribute('stroke-width', '1.4');
      frag.appendChild(el);
      el = document.createElementNS(NS, 'circle');
      el.setAttribute('cx', (p[0] - 2).toFixed(1)); el.setAttribute('cy', (p[1] - 2).toFixed(1)); el.setAttribute('r', '2.2');
      el.setAttribute('fill', '#f8e3b4');
      frag.appendChild(el);
    }
    for (i = 0; i < 34; i++) {
      p = inDisc(190);
      el = document.createElementNS(NS, 'circle');
      el.setAttribute('cx', p[0].toFixed(1)); el.setAttribute('cy', p[1].toFixed(1)); el.setAttribute('r', (2.4 + rnd() * 1.2).toFixed(1));
      el.setAttribute('fill', i % 3 ? '#b3262c' : '#4a2030');
      frag.appendChild(el);
    }
    g.appendChild(frag);
  })();

  var hero = $('#hero');
  requestAnimationFrame(function () { requestAnimationFrame(function () { hero.classList.add('is-loaded'); }); });

  /* ------------------------------------------------------------------
     Scroll reveal
  ------------------------------------------------------------------ */
  var revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var rObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); rObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { rObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ------------------------------------------------------------------
     Cart state
  ------------------------------------------------------------------ */
  var STORE_KEY = 'oshxona-demo-cart';
  var cart = {};
  try {
    var saved = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    Object.keys(saved).forEach(function (id) { if (ITEMS[id] && saved[id] > 0) cart[id] = Math.min(99, saved[id] | 0); });
  } catch (e) { /* storage unavailable — fine */ }
  function persist() { try { localStorage.setItem(STORE_KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ } }

  function cartCount() { return Object.keys(cart).reduce(function (s, id) { return s + cart[id]; }, 0); }
  function cartSum() { return Object.keys(cart).reduce(function (s, id) { return s + cart[id] * ITEMS[id].price; }, 0); }
  var FREE_FROM = 150000, DELIVERY = 15000;

  function plural(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  /* ------------------------------------------------------------------
     Menu rendering + tabs
  ------------------------------------------------------------------ */
  var grid = $('#menu-panel');
  var tabs = $$('.tab');
  var ink = $('.tabs__ink');
  var current = 'plov';
  var plusSvg = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var minusSvg = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M3 8h10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';

  function dishHTML(it, i) {
    var q = cart[it.id] || 0;
    var tag = it.tag ? '<span class="dish__tag' + (it.tagType ? ' dish__tag--' + it.tagType : '') + '">' + esc(it.tag) + '</span>' : '';
    return '<article class="dish enter" style="--i:' + i + '">' + tag +
      '<div class="dish__art" style="--tile:' + TILES[it.cat] + '"><svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><use href="#i-' + it.icon + '"/></svg></div>' +
      '<div class="dish__body">' +
        '<h3 class="dish__name">' + esc(it.name) + '</h3>' +
        '<p class="dish__desc">' + esc(it.desc) + '</p>' +
        '<div class="dish__foot">' +
          '<span class="dish__weight">' + esc(it.w) + '</span>' +
          '<span class="dish__price">' + money(it.price) + '</span>' +
          '<button class="add' + (q ? ' in-cart' : '') + '" type="button" data-add="' + it.id + '" aria-label="Добавить в заказ: ' + esc(it.name) + (q ? ' (в заказе: ' + q + ')' : '') + '">' + plusSvg + '<span class="add__qty" aria-hidden="true">' + (q || '') + '</span></button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderMenu(cat) {
    grid.innerHTML = MENU[cat].map(dishHTML).join('');
  }

  function moveInk(tab, instant) {
    if (!ink || !tab) return;
    if (instant) ink.style.transition = 'none';
    ink.style.width = tab.offsetWidth + 'px';
    ink.style.transform = 'translateX(' + tab.offsetLeft + 'px)';
    if (instant) { void ink.offsetWidth; ink.style.transition = ''; }
  }

  var switchTimer = null;
  function selectTab(tab, focus) {
    var cat = tab.getAttribute('data-cat');
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tab.focus();
    moveInk(tab);
    // keep the active tab visible in the scrollable strip
    var strip = tab.closest('.tabs');
    if (strip && strip.scrollWidth > strip.clientWidth) {
      var target = tab.offsetLeft - (strip.clientWidth - tab.offsetWidth) / 2;
      strip.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    grid.setAttribute('aria-labelledby', tab.id);
    if (cat === current) return;
    current = cat;
    clearTimeout(switchTimer);
    if (reduceMotion) { renderMenu(cat); return; }
    grid.style.minHeight = grid.offsetHeight + 'px';
    grid.classList.add('is-leaving');
    switchTimer = setTimeout(function () {
      renderMenu(cat);
      grid.classList.remove('is-leaving');
      requestAnimationFrame(function () { grid.style.minHeight = ''; });
    }, 220);
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { selectTab(t); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') n = tabs[0];
      else if (e.key === 'End') n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); selectTab(n, true); }
    });
  });

  renderMenu(current);
  moveInk(tabs[0], true);
  window.addEventListener('resize', function () { moveInk($('.tab[aria-selected="true"]'), true); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveInk($('.tab[aria-selected="true"]'), true); });

  /* ------------------------------------------------------------------
     Cart UI
  ------------------------------------------------------------------ */
  var cartBtn = $('#cartBtn');
  var pill = $('#cartPill');
  var sheet = $('#cart');
  var list = $('#cartList');
  var empty = $('#cartEmpty');
  var foot = $('#cartFoot');

  function updateBadges(bump) {
    var n = cartCount(), sum = cartSum();
    $$('[data-cart-count]').forEach(function (el) { el.textContent = n; });
    $$('[data-cart-sum]').forEach(function (el) { el.textContent = money(sum); });
    cartBtn.classList.toggle('has-items', n > 0);
    cartBtn.setAttribute('aria-label', n ? 'Корзина: ' + n + ' ' + plural(n, 'позиция', 'позиции', 'позиций') + ' на ' + money(sum) : 'Корзина: пусто');
    pill.setAttribute('aria-label', 'Открыть заказ: ' + n + ' ' + plural(n, 'позиция', 'позиции', 'позиций') + ', ' + money(sum));
    pill.hidden = n === 0;
    if (bump && !reduceMotion) {
      [cartBtn, pill].forEach(function (el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); });
    }
  }

  function updateAddButtons() {
    $$('[data-add]', grid).forEach(function (b) {
      var id = b.getAttribute('data-add'), q = cart[id] || 0;
      b.classList.toggle('in-cart', q > 0);
      b.querySelector('.add__qty').textContent = q || '';
      b.setAttribute('aria-label', 'Добавить в заказ: ' + ITEMS[id].name + (q ? ' (в заказе: ' + q + ')' : ''));
    });
  }

  function renderCart(animateNew) {
    var ids = Object.keys(cart);
    empty.hidden = ids.length > 0;
    foot.hidden = ids.length === 0;
    list.innerHTML = ids.map(function (id) {
      var it = ITEMS[id], q = cart[id];
      return '<li class="ci' + (animateNew ? ' enter' : '') + '" data-id="' + id + '">' +
        '<div class="ci__art" style="--tile:' + TILES[it.cat] + '"><svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><use href="#i-' + it.icon + '"/></svg></div>' +
        '<div><p class="ci__name">' + esc(it.name) + '</p><p class="ci__unit">' + money(it.price) + ' · ' + esc(it.w) + '</p></div>' +
        '<span class="ci__sum">' + money(it.price * q) + '</span>' +
        '<div class="qty" role="group" aria-label="Количество: ' + esc(it.name) + '">' +
          '<button type="button" data-dec="' + id + '" aria-label="Убрать одну порцию: ' + esc(it.name) + '">' + minusSvg + '</button>' +
          '<output aria-live="polite">' + q + '</output>' +
          '<button type="button" data-inc="' + id + '" aria-label="Добавить ещё порцию: ' + esc(it.name) + '">' + plusSvg + '</button>' +
        '</div>' +
      '</li>';
    }).join('');
    var sub = cartSum();
    var del = sub >= FREE_FROM || sub === 0 ? 0 : DELIVERY;
    $('#tSub').textContent = money(sub);
    $('#tDel').textContent = del ? money(del) : 'бесплатно';
    $('#tTotal').textContent = money(sub + del);
    var hint = $('#tHint');
    if (sub >= FREE_FROM) { hint.textContent = 'Доставка за наш счёт'; hint.classList.add('is-free'); }
    else { hint.textContent = 'До бесплатной доставки: ' + money(FREE_FROM - sub); hint.classList.remove('is-free'); }
  }

  function setQty(id, q) {
    if (q <= 0) delete cart[id]; else cart[id] = Math.min(99, q);
    persist();
    updateBadges(false);
    updateAddButtons();
  }

  function flyFrom(btn) {
    if (reduceMotion || !btn.animate) return;
    var target = (pill.hidden || getComputedStyle(pill).display === 'none') ? cartBtn : pill;
    var a = btn.getBoundingClientRect(), b = target.getBoundingClientRect();
    var x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
    var x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    var dot = document.createElement('span');
    dot.className = 'fly';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    var mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 90;
    var anim = dot.animate([
      { transform: 'translate(' + x0 + 'px,' + y0 + 'px) scale(1)', opacity: 1 },
      { transform: 'translate(' + mx + 'px,' + my + 'px) scale(1.25)', opacity: 1, offset: 0.45 },
      { transform: 'translate(' + x1 + 'px,' + y1 + 'px) scale(.45)', opacity: .5 }
    ], { duration: 720, easing: 'cubic-bezier(.22,1,.36,1)' });
    anim.onfinish = function () { dot.remove(); };
  }

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (!b) return;
    var id = b.getAttribute('data-add');
    cart[id] = Math.min(99, (cart[id] || 0) + 1);
    persist();
    if (!reduceMotion) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
    updateBadges(false);
    updateAddButtons();
    flyFrom(b);
    setTimeout(function () { updateBadges(true); }, reduceMotion ? 0 : 600);
  });

  list.addEventListener('click', function (e) {
    var inc = e.target.closest('[data-inc]'), dec = e.target.closest('[data-dec]');
    if (!inc && !dec) return;
    var id = (inc || dec).getAttribute(inc ? 'data-inc' : 'data-dec');
    var removing = dec && (cart[id] || 0) <= 1;
    setQty(id, (cart[id] || 0) + (inc ? 1 : -1));
    renderCart(false);
    // restore focus to the same control after re-render
    var sel = removing ? null : (inc ? '[data-inc="' + id + '"]' : '[data-dec="' + id + '"]');
    var nextFocus = sel ? list.querySelector(sel) : (list.querySelector('button') || $('[data-close]', sheet));
    if (nextFocus) nextFocus.focus();
  });

  var lastOpener = null;
  function openCart(opener) {
    lastOpener = opener || document.activeElement;
    renderCart(true);
    if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', '');
    document.body.style.overflow = 'hidden';
  }
  function closeCart(after) {
    if (!sheet.open) { if (after) after(); return; }
    var finish = function () {
      sheet.classList.remove('is-closing');
      if (typeof sheet.close === 'function') sheet.close(); else sheet.removeAttribute('open');
      document.body.style.overflow = '';
      if (after) after();
    };
    if (reduceMotion) { finish(); return; }
    sheet.classList.add('is-closing');
    setTimeout(finish, 330);
  }
  sheet.addEventListener('close', function () {
    document.body.style.overflow = '';
    if (lastOpener && document.contains(lastOpener)) lastOpener.focus({ preventScroll: true });
  });
  sheet.addEventListener('cancel', function (e) { e.preventDefault(); closeCart(); });
  sheet.addEventListener('click', function (e) {
    if (e.target === sheet) { closeCart(); return; } // backdrop click
    var c = e.target.closest('[data-close]');
    if (!c) return;
    var go = c.getAttribute('data-goto');
    closeCart(go ? function () { var t = $(go); if (t) t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); } : null);
  });
  cartBtn.addEventListener('click', function () { openCart(cartBtn); });
  pill.addEventListener('click', function () { openCart(pill); });

  $('#checkout').addEventListener('click', function () {
    closeCart(function () {
      cart = {};
      persist();
      updateBadges(false);
      updateAddButtons();
      toast('Это демо — на реальном сайте заказ придёт в Telegram ресторана');
    });
  });

  updateBadges(false);

  /* ------------------------------------------------------------------
     Toast
  ------------------------------------------------------------------ */
  var toastEl = $('#toast'), toastText = $('#toastText'), toastTimer = null;
  function toast(msg) {
    toastText.textContent = msg;
    toastEl.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-shown'); }, 4600);
  }
  $$('[data-demo-link]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); toast('Это концепт — ссылки на соцсети появятся на реальном сайте'); });
  });

  /* ------------------------------------------------------------------
     Booking form
  ------------------------------------------------------------------ */
  var form = $('#bookingForm');
  var fName = $('#f-name'), fPhone = $('#f-phone'), fDate = $('#f-date'), fTime = $('#f-time');
  var fGuests = $('#f-guests'), guestsOut = $('#guestsOut'), fComment = $('#f-comment');
  var MIN_G = 1, MAX_G = 20;

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  var today = new Date();
  fDate.min = isoDate(today);
  var maxD = new Date(today); maxD.setDate(maxD.getDate() + 60);
  fDate.max = isoDate(maxD);

  // time slots 11:00–22:00 every 30 min
  for (var h = 11; h <= 22; h++) {
    ['00', '30'].forEach(function (m) {
      if (h === 22 && m === '30') return;
      var o = document.createElement('option');
      o.value = o.textContent = h + ':' + m;
      fTime.appendChild(o);
    });
  }
  function refreshSlots() {
    var isToday = fDate.value === isoDate(new Date());
    var now = new Date(), minMinutes = now.getHours() * 60 + now.getMinutes() + 60;
    $$('option', fTime).forEach(function (o) {
      if (!o.value) return;
      var p = o.value.split(':'), mins = (+p[0]) * 60 + (+p[1]);
      o.disabled = isToday && mins < minMinutes;
    });
    if (fTime.selectedOptions[0] && fTime.selectedOptions[0].disabled) fTime.value = '';
  }
  fDate.addEventListener('change', refreshSlots);

  // phone mask: +998 (XX) XXX-XX-XX
  function formatPhone(v) {
    var d = v.replace(/\D/g, '');
    if (d.indexOf('998') === 0) d = d.slice(3);
    d = d.slice(0, 9);
    var out = '+998';
    if (d.length) out += ' (' + d.slice(0, 2);
    if (d.length >= 2) out += ')';
    if (d.length > 2) out += ' ' + d.slice(2, 5);
    if (d.length > 5) out += '-' + d.slice(5, 7);
    if (d.length > 7) out += '-' + d.slice(7, 9);
    return out;
  }
  fPhone.addEventListener('focus', function () { if (!fPhone.value) fPhone.value = '+998 '; });
  fPhone.addEventListener('blur', function () { if (fPhone.value.replace(/\D/g, '') === '998') fPhone.value = ''; });
  fPhone.addEventListener('input', function (e) {
    if (e.inputType && e.inputType.indexOf('delete') === 0) return; // let users erase freely
    fPhone.value = formatPhone(fPhone.value);
  });

  // guests stepper
  function setGuests(n) {
    n = Math.max(MIN_G, Math.min(MAX_G, n));
    fGuests.value = n;
    guestsOut.textContent = n;
    $$('[data-step]', form).forEach(function (b) {
      var s = +b.getAttribute('data-step');
      b.disabled = (s < 0 && n <= MIN_G) || (s > 0 && n >= MAX_G);
    });
  }
  $$('[data-step]', form).forEach(function (b) {
    b.addEventListener('click', function () { setGuests(+fGuests.value + (+b.getAttribute('data-step'))); });
  });
  setGuests(2);

  fComment.addEventListener('input', function () { $('[data-count]').textContent = fComment.value.length; });

  var RULES = {
    name: function () {
      var v = fName.value.trim();
      if (!v) return 'Укажите имя';
      if (v.length < 2) return 'Имя слишком короткое';
      return '';
    },
    phone: function () {
      var d = fPhone.value.replace(/\D/g, '');
      if (!d || d === '998') return 'Укажите телефон для подтверждения';
      if (d.length !== 12 || d.indexOf('998') !== 0) return 'Номер в формате +998 (XX) XXX-XX-XX';
      return '';
    },
    date: function () {
      if (!fDate.value) return 'Выберите дату';
      if (fDate.value < fDate.min) return 'Эта дата уже прошла';
      if (fDate.value > fDate.max) return 'Бронируем не дальше чем на 60 дней';
      return '';
    },
    time: function () { return fTime.value ? '' : 'Выберите время'; }
  };
  var FIELDS = { name: fName, phone: fPhone, date: fDate, time: fTime };
  var touched = {};

  function check(key, shake) {
    var msg = RULES[key]();
    var input = FIELDS[key];
    var field = input.closest('.field');
    var err = document.getElementById('e-' + key);
    err.textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    field.classList.remove('has-error');
    if (msg) { if (shake && !reduceMotion) void field.offsetWidth; field.classList.add('has-error'); }
    return !msg;
  }
  Object.keys(FIELDS).forEach(function (k) {
    var el = FIELDS[k];
    el.addEventListener('blur', function () { if (el.value && el.value !== '+998 ') touched[k] = true; if (touched[k]) check(k); });
    el.addEventListener(k === 'time' || k === 'date' ? 'change' : 'input', function () { if (touched[k]) check(k); });
  });

  var success = $('#bookingSuccess');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Object.keys(FIELDS).forEach(function (k) {
      touched[k] = true;
      if (!check(k, true) && !firstBad) firstBad = FIELDS[k];
    });
    if (firstBad) { firstBad.focus(); return; }

    var n = +fGuests.value;
    var d = new Date(fDate.value + 'T12:00:00');
    var dateStr = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' });
    var place = (form.querySelector('input[name="place"]:checked') || {}).value || 'Зал';
    $('#successText').textContent = fName.value.trim() + ', ждём вас ' + dateStr + ' в ' + fTime.value + ' — ' +
      n + ' ' + plural(n, 'гость', 'гостя', 'гостей') + ', место: ' + place.toLowerCase() + '.';
    form.hidden = true;
    success.hidden = false;
    success.classList.remove('is-shown'); void success.offsetWidth; success.classList.add('is-shown');
    success.focus({ preventScroll: true });
    var card = success.closest('.booking__card');
    var r = card.getBoundingClientRect();
    if (r.top < 0 || r.top > window.innerHeight * 0.5) card.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  });

  $('#bookingAgain').addEventListener('click', function () {
    form.reset();
    touched = {};
    Object.keys(FIELDS).forEach(function (k) {
      FIELDS[k].removeAttribute('aria-invalid');
      FIELDS[k].closest('.field').classList.remove('has-error');
      document.getElementById('e-' + k).textContent = '';
    });
    setGuests(2);
    $('[data-count]').textContent = '0';
    success.hidden = true;
    form.hidden = false;
    fName.focus();
  });

  /* ------------------------------------------------------------------
     Open/closed status (Tashkent time, UTC+5)
  ------------------------------------------------------------------ */
  (function status() {
    var el = $('#openStatus');
    if (!el) return;
    var now = new Date();
    var tashMin = ((now.getUTCHours() + 5) % 24) * 60 + now.getUTCMinutes();
    var open = tashMin >= 10 * 60 && tashMin < 23 * 60;
    el.classList.add(open ? 'is-open' : 'is-closed');
    $('span', el).textContent = open ? 'Сейчас открыто · до 23:00' : 'Сейчас закрыто · откроемся в 10:00';
  })();

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
