/* Tong Coffee — concept by SAJA BOYS. Vanilla JS, no dependencies. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => reduceMotion.matches;
  const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const sum = (n) => `${fmt(n)} сум`;
  const ESP = '#2b1a12';
  let uidCounter = 0;
  const uid = () => `u${++uidCounter}`;

  /* =========================================================
     SVG illustrations
     ========================================================= */
  const heroArt = (milk, accent) => `
    <path d="M0 78C-104 14-92-92 0-44 92-92 104 14 0 78Z" fill="${milk}"/>
    <path d="M0 52C-70 8-62-62 0-30 62-62 70 8 0 52Z" fill="${accent}"/>
    <path d="M0 34C-46 6-40-40 0-18 40-40 46 6 0 34Z" fill="${milk}"/>
    <path d="M0 18C-24 4-20-20 0-8 20-20 24 4 0 18Z" fill="${accent}"/>
    <path d="M0-104V78" stroke="${milk}" stroke-width="7" stroke-linecap="round"/>`;

  function cupArt(type, o) {
    const milk = o.milk || '#fff3e3';
    const accent = o.accent || '#dd9a63';
    switch (type) {
      case 'rosetta':
        return `<g transform="translate(100 95) scale(.42 .105)">${heroArt(milk, accent)}</g>`;
      case 'heart':
        return `<g transform="translate(100 96) scale(1 .27)">
          <path d="M0 30C-44 4-38-40 0-18 38-40 44 4 0 30Z" fill="${milk}"/>
          <path d="M0-40V30" stroke="${milk}" stroke-width="5" stroke-linecap="round"/></g>`;
      case 'dust':
        return `<g transform="translate(100 95) scale(1 .27)">
          <circle r="30" fill="${milk}" opacity=".9"/>
          ${[[-14, -8], [10, -14], [4, 10], [-6, 18], [18, 6], [-20, 8], [0, -22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="#8a4520"/>`).join('')}
          </g>
          <path d="M84 90l4 3M108 92l4-2M98 97l3 2" stroke="#8a4520" stroke-width="2" stroke-linecap="round"/>`;
      case 'marsh':
        return `<g stroke="${ESP}" stroke-width="2.5" stroke-linejoin="round">
          <rect x="74" y="83" width="15" height="12" rx="4" fill="#fffaf3" transform="rotate(-12 81 89)"/>
          <rect x="92" y="80" width="15" height="12" rx="4" fill="#ffc6c6" transform="rotate(8 99 86)"/>
          <rect x="108" y="86" width="15" height="12" rx="4" fill="#fffaf3" transform="rotate(16 115 92)"/>
          <rect x="88" y="92" width="14" height="11" rx="4" fill="#fffaf3" transform="rotate(-4 95 97)"/></g>`;
      case 'leaf':
        return `<g transform="translate(100 95) scale(1 .27)"><ellipse rx="30" ry="30" fill="#e3974a" opacity=".55"/></g>
          <g stroke="${ESP}" stroke-width="2.5" stroke-linejoin="round">
          <circle cx="114" cy="94" r="8" fill="#ffe27a"/><path d="M114 87v14M107 94h14" stroke-width="1.6"/>
          <path d="M80 92c4-8 14-8 18-2-6 6-14 6-18 2Z" fill="#8fb35a"/>
          <path d="M92 98c4-6 12-5 14 0-5 4-11 4-14 0Z" fill="#a9c47f"/></g>`;
      default:
        return '';
    }
  }

  function hotCup(o = {}) {
    const id = uid();
    const cup = o.cup || '#fffaf3';
    const saucer = o.saucer || '#fffaf3';
    const drink = o.drink || '#c47c4a';
    const rim = o.rimDrink || '#8a4a27';
    const band = o.band;
    const body = 'M42 92C42 130 66 150 100 150S158 130 158 92Z';
    return `<svg viewBox="0 0 200 170" aria-hidden="true" focusable="false">
      <defs><clipPath id="cb${id}"><path d="${body}"/></clipPath></defs>
      <g class="c-steam" fill="none" stroke="#fffaf3" stroke-width="6" stroke-linecap="round">
        <path d="M86 76c-8-10 6-18 0-28s6-16 0-26"/><path d="M114 76c-8-10 6-18 0-28s6-16 0-26"/>
      </g>
      <ellipse cx="100" cy="154" rx="82" ry="15" fill="${ESP}"/>
      <ellipse cx="100" cy="149" rx="82" ry="15" fill="${saucer}" stroke="${ESP}" stroke-width="4"/>
      <path d="M152 104c32-8 34 38-4 32" fill="none" stroke="${ESP}" stroke-width="18" stroke-linecap="round"/>
      <path d="M152 104c32-8 34 38-4 32" fill="none" stroke="${cup}" stroke-width="9" stroke-linecap="round"/>
      <path d="${body}" fill="${cup}"/>
      ${band ? `<g clip-path="url(#cb${id})"><path d="M30 110Q100 128 170 110V122Q100 140 30 122Z" fill="${band}"/></g>` : ''}
      <path d="M42 92C42 130 66 150 100 150S158 130 158 92" fill="none" stroke="${ESP}" stroke-width="4"/>
      <path d="M56 108c2 13 8 22 17 29" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".75"/>
      <ellipse cx="100" cy="92" rx="58" ry="17" fill="${cup}" stroke="${ESP}" stroke-width="4"/>
      <ellipse cx="100" cy="94" rx="50" ry="13" fill="${rim}"/>
      <ellipse cx="100" cy="95" rx="46" ry="11" fill="${drink}"/>
      ${cupArt(o.art, o)}
    </svg>`;
  }

  function glass(o = {}) {
    const id = uid();
    const shape = 'M58 30H142L133 150Q132 158 124 158H76Q68 158 67 150Z';
    const layers = (o.layers || []).map((l) =>
      `<path d="M40 ${l.y}Q70 ${l.y - 6} 100 ${l.y}T160 ${l.y}V170H40Z" fill="${l.c}"/>`).join('');
    const ice = [[70, 40, -14], [102, 46, 18], [84, 70, 8]].map(([x, y, r]) =>
      `<g transform="rotate(${r} ${x + 13} ${y + 13})"><rect x="${x}" y="${y}" width="26" height="26" rx="6" fill="#fff" fill-opacity=".62" stroke="${ESP}" stroke-width="3"/><path d="M${x + 6} ${y + 8}v8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`).join('');
    const bubbles = o.bubbles ? [[80, 118, 3], [96, 132, 2.5], [112, 112, 3.5], [120, 136, 2], [88, 104, 2]].map(([x, y, r]) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="2"/>`).join('') : '';
    const garnish = o.garnish === 'orange' ? `
      <g transform="translate(142 34) rotate(-20)" stroke="${ESP}" stroke-width="3.5">
        <circle r="19" fill="#ffa23a"/><circle r="13.5" fill="#ffd27a" stroke-width="2"/>
        <path d="M0-13.5V13.5M-13.5 0H13.5M-9.5-9.5 9.5 9.5M9.5-9.5-9.5 9.5" stroke-width="1.6" stroke="#ffa23a"/>
      </g>` : '';
    return `<svg viewBox="0 0 200 170" aria-hidden="true" focusable="false">
      <defs><clipPath id="gl${id}"><path d="${shape}"/></clipPath></defs>
      <ellipse cx="100" cy="162" rx="62" ry="9" fill="${ESP}"/>
      <ellipse cx="100" cy="158" rx="62" ry="9" fill="${o.coaster || '#fffaf3'}" stroke="${ESP}" stroke-width="4"/>
      <g transform="rotate(14 118 70)">
        <rect x="112" y="2" width="13" height="128" rx="6.5" fill="${o.straw || '#ff6b2c'}" stroke="${ESP}" stroke-width="3"/>
        <path d="M113 18l11 6M113 38l11 6M113 58l11 6" stroke="#fffaf3" stroke-width="4"/>
      </g>
      <g clip-path="url(#gl${id})">
        <rect x="40" y="0" width="120" height="170" fill="#fff" fill-opacity=".55"/>
        ${layers}${bubbles}${ice}
        <rect x="40" y="30" width="120" height="140" fill="#fff" fill-opacity=".08"/>
      </g>
      <path d="${shape}" fill="none" stroke="${ESP}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M72 44l6 96" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="100" cy="30" rx="42" ry="6" fill="none" stroke="${ESP}" stroke-width="4"/>
      ${garnish}
    </svg>`;
  }

  const plate = (fill = '#fffaf3') => `
    <ellipse cx="100" cy="146" rx="84" ry="16" fill="${ESP}"/>
    <ellipse cx="100" cy="141" rx="84" ry="16" fill="${fill}" stroke="${ESP}" stroke-width="4"/>
    <ellipse cx="100" cy="139" rx="56" ry="9" fill="none" stroke="${ESP}" stroke-width="2.5" opacity=".2"/>`;

  function croissant() {
    const segs = (fillA, fillB, fillC) => `
      <ellipse cx="36" cy="92" rx="22" ry="18" transform="rotate(-38 36 92)" fill="${fillA}"/><ellipse cx="184" cy="92" rx="22" ry="18" transform="rotate(38 184 92)" fill="${fillA}"/>
      <ellipse cx="68" cy="74" rx="30" ry="34" transform="rotate(-28 68 74)" fill="${fillB}"/><ellipse cx="152" cy="74" rx="30" ry="34" transform="rotate(28 152 74)" fill="${fillB}"/>
      <ellipse cx="110" cy="64" rx="36" ry="44" fill="${fillC}"/>`;
    return `<svg viewBox="0 0 200 170" aria-hidden="true" focusable="false">
      ${plate()}
      <g transform="translate(17 28) scale(.76)">
        <g transform="translate(0 8)">${segs(ESP, ESP, ESP)}</g>
        <g stroke="${ESP}" stroke-width="5">${segs('#e08a2e', '#f2a541', '#ffbf5e')}</g>
        <path d="M96 36c8-6 20-6 28 0M92 58c10-6 26-6 36 0" fill="none" stroke="#fff3d6" stroke-width="5" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  function roll() {
    return `<svg viewBox="0 0 200 170" aria-hidden="true" focusable="false">
      ${plate('#ffe1d6')}
      <path d="M40 98V114A60 30 0 0 0 160 114V98" fill="${ESP}" transform="translate(0 6)"/>
      <path d="M40 98V114A60 30 0 0 0 160 114V98Z" fill="#c97a35" stroke="${ESP}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="100" cy="98" rx="60" ry="30" fill="#eaa456" stroke="${ESP}" stroke-width="4"/>
      <g transform="translate(100 98) scale(1 .5)">
        <path d="M0 0m-5 0a5 5 0 1 1 10 0a10 10 0 1 1-20 0a15 15 0 1 1 30 0a20 20 0 1 1-40 0a25 25 0 1 1 50 0" fill="none" stroke="#8a4520" stroke-width="7" stroke-linecap="round"/>
      </g>
      <path d="M60 90c8 10 14-8 22 2s14-8 22 2 14-8 22 2 12-6 16 0" fill="none" stroke="#fffaf3" stroke-width="6" stroke-linecap="round"/>
    </svg>`;
  }

  function cheesecake() {
    const top = 'M36 104L112 58Q154 62 164 90Z';
    const side = 'M36 104L164 90V130L36 146Z';
    return `<svg viewBox="0 0 200 170" aria-hidden="true" focusable="false">
      ${plate()}
      <g transform="translate(5 6)" fill="${ESP}"><path d="${side}"/><path d="${top}"/></g>
      <path d="${side}" fill="#f7dcae" stroke="${ESP}" stroke-width="4" stroke-linejoin="round"/>
      <path d="M38 141L162 126" stroke="#b9713a" stroke-width="7"/>
      <path d="M36 146L164 130" stroke="${ESP}" stroke-width="4" stroke-linecap="round"/>
      <path d="M42 112L158 98" stroke="#fff3d6" stroke-width="3" stroke-linecap="round" opacity=".8"/>
      <path d="${top}" fill="#6e3a1c" stroke="${ESP}" stroke-width="4" stroke-linejoin="round"/>
      <ellipse cx="114" cy="80" rx="18" ry="6" fill="#a3582a" transform="rotate(-12 114 80)"/>
      <ellipse cx="82" cy="92" rx="9" ry="3.5" fill="#a3582a"/>
      <ellipse cx="140" cy="76" rx="5" ry="2.5" fill="#c47c4a"/>
      <g fill="#ff6b2c" stroke="${ESP}" stroke-width="2.5"><circle cx="150" cy="70" r="7"/></g>
      <path d="M150 63c2-6 7-8 10-7" fill="none" stroke="#5f8a3a" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

  const illustration = (item) => {
    if (item.type === 'glass') return glass(item.art);
    if (item.type === 'croissant') return croissant();
    if (item.type === 'roll') return roll();
    if (item.type === 'cheesecake') return cheesecake();
    return hotCup(item.art);
  };

  /* =========================================================
     Menu data (concept — prices are illustrative)
     ========================================================= */
  const HOT_SIZES = [['S', '250 мл'], ['M', '350 мл'], ['L', '450 мл']];
  const COLD_SIZES = [['S', '300 мл'], ['M', '400 мл'], ['L', '500 мл']];
  const MENU = [
    { id: 'cappuccino', cat: 'coffee', name: 'Капучино', desc: 'Двойной эспрессо и шелковистая молочная пена. Классика, с которой начинается утро.', bg: '#ffe1d6', prices: [26000, 30000, 34000], art: { art: 'rosetta', band: '#ff6b2c' } },
    { id: 'flatwhite', cat: 'coffee', name: 'Флэт уайт', desc: 'Больше кофе, меньше пены: насыщенный вкус и бархатная текстура.', bg: '#ffd3b8', prices: [28000, 32000, 36000], tag: 'Выбор бариста', art: { art: 'heart', drink: '#b06a3b', rimDrink: '#7d4122', cup: '#fffaf3', band: ESP } },
    { id: 'raf', cat: 'coffee', name: 'Раф «Тонг»', desc: 'Сливки, кофе и тахинная халва с щепоткой корицы. Наш фирменный.', bg: '#f9c9c0', prices: [32000, 36000, 40000], tag: 'Фирменный', art: { art: 'dust', drink: '#e6bd8f', rimDrink: '#c48c58', milk: '#fff3e3', cup: '#ff8a50', band: ESP, saucer: '#fffaf3' } },
    { id: 'matcha', cat: 'nocoffee', name: 'Матча латте', desc: 'Японский чай матча, взбитый с молоком. Мягкая бодрость без кофе.', bg: '#dcebc4', prices: [34000, 38000, 42000], tag: 'Новинка', art: { art: 'heart', drink: '#8fb35a', rimDrink: '#6f9440', milk: '#f4f9e8', band: '#8fb35a' } },
    { id: 'cocoa', cat: 'nocoffee', name: 'Какао с маршмеллоу', desc: 'Густой горячий шоколад и тающие маршмеллоу сверху.', bg: '#ffe6dc', prices: [26000, 30000, 34000], art: { art: 'marsh', drink: '#7a4128', rimDrink: '#5b2e1b', cup: '#f9c9c0', band: '#ff6b2c' } },
    { id: 'tea', cat: 'nocoffee', name: 'Чай с чабрецом', desc: 'Чёрный чай, чабрец и ломтик лимона. Тепло, как дома.', bg: '#fde3c0', prices: [18000, 22000, 26000], art: { art: 'leaf', drink: '#c8742a', rimDrink: '#9c5420', band: '#ffb38a' } },
    { id: 'icelatte', cat: 'cold', type: 'glass', name: 'Айс латте', desc: 'Эспрессо, холодное молоко и много льда. Спасает в жаркий день.', bg: '#cfe7ec', prices: [30000, 34000, 38000], cold: true, art: { layers: [{ y: 60, c: '#f6ecdf' }, { y: 106, c: '#c98a57' }, { y: 134, c: '#9a5a30' }] } },
    { id: 'tonic', cat: 'cold', type: 'glass', name: 'Эспрессо-тоник', desc: 'Тоник, лёд и эспрессо сверху — горчинка с цитрусовой свежестью.', bg: '#ffeab0', prices: [32000, 36000, 40000], cold: true, art: { layers: [{ y: 56, c: '#7a3b1c' }, { y: 86, c: '#f4ead0' }], bubbles: true, garnish: 'orange', straw: ESP } },
    { id: 'coldbrew', cat: 'cold', type: 'glass', name: 'Колд брю с апельсином', desc: 'Кофе холодной экстракции, апельсиновый сок и цедра.', bg: '#ffd0a6', prices: [30000, 34000, 38000], tag: 'Сезонное', cold: true, art: { layers: [{ y: 58, c: '#4d2412' }, { y: 118, c: '#f08a2c' }], garnish: 'orange', coaster: '#ffb38a' } },
    { id: 'croissant', cat: 'bakery', type: 'croissant', name: 'Круассан', desc: 'Слоёный, на сливочном масле. Достаём из печи каждое утро.', bg: '#ffe1b8', price: 22000, portion: '1 шт · 80 г' },
    { id: 'roll', cat: 'bakery', type: 'roll', name: 'Булочка с корицей', desc: 'Мягкое тесто, корица и сливочная глазурь сверху.', bg: '#f9c9c0', price: 24000, portion: '1 шт · 120 г' },
    { id: 'cheesecake', cat: 'bakery', type: 'cheesecake', name: 'Баскский чизкейк', desc: 'Карамельная корочка снаружи, нежный сливочный крем внутри.', bg: '#f3e2c0', price: 36000, tag: 'К кофе', portion: '1 кусок · 130 г' },
  ];
  const byId = Object.fromEntries(MENU.map((m) => [m.id, m]));
  const sizesOf = (item) => (item.cold ? COLD_SIZES : HOT_SIZES);
  const priceOf = (item, sizeIdx) => (item.prices ? item.prices[sizeIdx] : item.price);

  /* =========================================================
     Menu rendering + filters
     ========================================================= */
  const grid = $('[data-menu-grid]');
  const PLUS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>';
  const CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function cardHTML(item) {
    const sizes = item.prices ? `
      <fieldset class="sizes" style="--idx:1">
        <legend>Размер: ${item.name}</legend>
        ${sizesOf(item).map(([s, vol], i) => `
          <input type="radio" name="size-${item.id}" id="size-${item.id}-${s}" value="${i}" ${i === 1 ? 'checked' : ''}>
          <label for="size-${item.id}-${s}">${s}<small>${vol}</small></label>`).join('')}
      </fieldset>` : `<p class="portion">${item.portion}</p>`;
    const startPrice = priceOf(item, 1);
    return `
      <article class="card" data-id="${item.id}" data-cat="${item.cat}" style="--card-bg:${item.bg}">
        <div class="card-art">${item.tag ? `<span class="card-tag">${item.tag}</span>` : ''}${illustration(item)}</div>
        <div class="card-body">
          <h3 class="card-title">${item.name}</h3>
          <p class="card-desc">${item.desc}</p>
          ${sizes}
          <div class="card-foot">
            <p class="price" aria-live="polite"><span data-price>${fmt(startPrice)}</span> <small>сум</small></p>
            <button class="add-btn" type="button" data-add aria-label="Добавить «${item.name}» в заказ">${PLUS}<span>В заказ</span></button>
          </div>
        </div>
      </article>`;
  }

  grid.innerHTML = MENU.map(cardHTML).join('');
  $$('[data-count]').forEach((el) => {
    const c = el.dataset.count;
    el.textContent = c === 'all' ? MENU.length : MENU.filter((m) => m.cat === c).length;
  });

  grid.addEventListener('change', (e) => {
    const input = e.target.closest('.sizes input');
    if (!input) return;
    const card = input.closest('.card');
    const item = byId[card.dataset.id];
    const idx = Number(input.value);
    input.closest('.sizes').style.setProperty('--idx', idx);
    const priceEl = $('[data-price]', card);
    priceEl.classList.remove('is-tick');
    void priceEl.offsetWidth;
    priceEl.classList.add('is-tick');
    setTimeout(() => { priceEl.textContent = fmt(priceOf(item, idx)); }, isReduced() ? 0 : 160);
  });

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const card = btn.closest('.card');
    const item = byId[card.dataset.id];
    const checked = $('.sizes input:checked', card);
    const sizeIdx = checked ? Number(checked.value) : -1;
    addToCart(item.id, sizeIdx);
    flyToCart(btn);
    btn.classList.add('is-added');
    btn.innerHTML = `${CHECK}<span>Добавлено</span>`;
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.classList.remove('is-added'); btn.innerHTML = `${PLUS}<span>В заказ</span>`; }, 1400);
    const sizeLabel = sizeIdx >= 0 ? ` · ${sizesOf(item)[sizeIdx][0]}` : '';
    toast(`«${item.name}»${sizeLabel} — в заказе`);
  });

  // Filters
  const chips = $$('[data-filter]');
  const filterStatus = $('[data-filter-status]');
  let filterTimer;
  chips.forEach((chip) => chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => { const on = c === chip; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on); });
    const cards = $$('.card', grid);
    const show = (c) => f === 'all' || c.dataset.cat === f;
    cards.forEach((c) => { if (!c.hidden && !show(c)) c.classList.add('is-leaving'); });
    clearTimeout(filterTimer);
    filterTimer = setTimeout(() => {
      let i = 0;
      cards.forEach((c) => {
        c.classList.remove('is-leaving', 'is-entering');
        c.hidden = !show(c);
        if (!c.hidden) {
          c.style.setProperty('--i', i++);
          void c.offsetWidth;
          c.classList.add('is-entering');
        }
      });
      filterStatus.textContent = `Показано позиций: ${i}`;
    }, isReduced() ? 0 : 220);
  }));
  grid.addEventListener('animationend', (e) => {
    if (e.target.classList.contains('card')) e.target.classList.remove('is-entering');
  });

  /* =========================================================
     Cart
     ========================================================= */
  const cart = new Map(); // key -> { id, size, qty }
  const keyOf = (id, size) => `${id}|${size}`;
  const cartCountEls = $$('[data-cart-count]');
  const cartList = $('[data-cart-list]');
  const cartEmpty = $('[data-cart-empty]');
  const cartTotalEl = $('[data-cart-total]');
  const submitBtn = $('[data-submit]');

  function addToCart(id, size, qty = 1) {
    const k = keyOf(id, size);
    const line = cart.get(k) || { id, size, qty: 0 };
    line.qty += qty;
    if (line.qty <= 0) cart.delete(k); else cart.set(k, line);
    renderCart();
  }

  const lineTotal = (l) => priceOf(byId[l.id], l.size) * l.qty;
  const cartTotal = () => Array.from(cart.values()).reduce((s, l) => s + lineTotal(l), 0);
  const cartQty = () => Array.from(cart.values()).reduce((s, l) => s + l.qty, 0);

  function cartItemHTML(k, l) {
    const item = byId[l.id];
    const meta = l.size >= 0 ? `${sizesOf(item)[l.size][0]} · ${sizesOf(item)[l.size][1]}` : item.portion;
    return `
      <div class="cart-thumb" style="background:${item.bg}">${illustration(item)}</div>
      <div class="cart-info"><p class="cart-name">${item.name}</p><p class="cart-meta">${meta}</p></div>
      <div class="cart-side">
        <div class="qty" role="group" aria-label="Количество: ${item.name}">
          <button type="button" data-qty="-1" aria-label="Убрать одну">−</button>
          <output data-qty-val aria-live="polite">${l.qty}</output>
          <button type="button" data-qty="1" aria-label="Добавить ещё">+</button>
        </div>
        <span class="cart-line" data-line-total>${sum(lineTotal(l))}</span>
      </div>`;
  }

  function renderCart() {
    const existing = new Map($$('.cart-item', cartList).map((el) => [el.dataset.key, el]));
    cart.forEach((l, k) => {
      let el = existing.get(k);
      if (!el) {
        el = document.createElement('li');
        el.className = 'cart-item';
        el.dataset.key = k;
        el.innerHTML = cartItemHTML(k, l);
        cartList.appendChild(el);
      } else {
        $('[data-qty-val]', el).textContent = l.qty;
        $('[data-line-total]', el).textContent = sum(lineTotal(l));
        existing.delete(k);
      }
    });
    existing.forEach((el) => {
      if (el.classList.contains('is-removing')) return;
      if (isReduced()) { el.remove(); return; }
      el.classList.add('is-removing');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    });

    const qty = cartQty();
    const total = cartTotal();
    cartCountEls.forEach((el) => {
      const prev = el.textContent;
      el.textContent = qty;
      el.classList.toggle('is-empty', qty === 0);
      if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', `Позиций в заказе: ${qty}`);
      if (String(qty) !== prev && qty > 0 && !isReduced()) {
        el.classList.remove('is-bump'); void el.offsetWidth; el.classList.add('is-bump');
      }
    });
    $$('.cart-mobile').forEach((b) => b.setAttribute('aria-label', qty ? `Открыть предзаказ, позиций: ${qty}` : 'Открыть предзаказ'));
    cartEmpty.hidden = cart.size > 0;
    cartTotalEl.textContent = sum(total);
    submitBtn.textContent = total ? `Отправить заказ · ${sum(total)}` : 'Отправить заказ';
    if (cart.size) setFormError('');
  }

  cartList.addEventListener('click', (e) => {
    const b = e.target.closest('[data-qty]');
    if (!b) return;
    const li = b.closest('.cart-item');
    const [id, size] = li.dataset.key.split('|');
    addToCart(id, Number(size), Number(b.dataset.qty));
  });

  // Upsell quick-add
  const UPSELL = [['croissant', -1], ['roll', -1], ['cappuccino', 1]];
  $('[data-upsell-row]').innerHTML = UPSELL.map(([id, s]) => {
    const it = byId[id];
    const label = s >= 0 ? `${it.name} ${sizesOf(it)[s][0]}` : it.name;
    return `<button class="upsell-btn" type="button" data-upsell="${id}|${s}" aria-label="Добавить «${label}» за ${fmt(priceOf(it, s))} сум">
      <span class="ub-ico" style="background:${it.bg}">${illustration(it)}</span>${label} <b>+${fmt(priceOf(it, s))}</b></button>`;
  }).join('');
  $('[data-upsell-row]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-upsell]');
    if (!b) return;
    const [id, s] = b.dataset.upsell.split('|');
    addToCart(id, Number(s));
  });

  // Flying dot micro-interaction
  function flyToCart(fromEl) {
    if (isReduced() || !fromEl.animate) return;
    const target = $$('[data-open-order] .cart-count').find((el) => el.offsetParent !== null && el.closest('.site-header'));
    if (!target) return;
    const a = fromEl.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const dot = document.createElement('span');
    dot.className = 'fly-dot';
    document.body.appendChild(dot);
    const x0 = a.left + a.width / 2 - 11, y0 = a.top + a.height / 2 - 11;
    const x1 = b.left + b.width / 2 - 11, y1 = b.top + b.height / 2 - 11;
    const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 120;
    dot.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(1)` },
      { transform: `translate(${mx}px, ${my}px) scale(1.15)`, offset: 0.45 },
      { transform: `translate(${x1}px, ${y1}px) scale(.35)`, opacity: 0.6 },
    ], { duration: 750, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => dot.remove();
  }

  /* =========================================================
     Toast
     ========================================================= */
  const toastEl = $('[data-toast]');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 2200);
  }

  /* =========================================================
     Order drawer
     ========================================================= */
  const drawer = $('[data-drawer]');
  const panel = $('.drawer-panel', drawer);
  const formView = $('[data-view="form"]', drawer);
  const successView = $('[data-view="success"]', drawer);
  const form = $('[data-order-form]');
  const pickup = $('[data-pickup]');
  let lastFocus = null;
  let orderPlaced = false;

  const tashkentNow = () => new Date(Date.now() + 5 * 3600 * 1000); // UTC+5, read with getUTC*
  const hhmm = (mins) => `${String(Math.floor(mins / 60) % 24).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

  function fillPickup() {
    const now = tashkentNow();
    const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
    let start = Math.ceil((mins + 20) / 15) * 15;
    const opts = ['<option value="asap">Как можно скорее · ~10 мин</option>'];
    for (let i = 0; i < 8; i++, start += 15) opts.push(`<option value="${hhmm(start)}">К ${hhmm(start)}</option>`);
    pickup.innerHTML = opts.join('');
  }

  const focusables = () => $$('a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])', panel)
    .filter((el) => el.offsetParent !== null || el === document.activeElement);

  function openOrder() {
    closeMobileMenu();
    if (orderPlaced) resetOrder();
    lastFocus = document.activeElement;
    fillPickup();
    drawer.inert = false;
    drawer.classList.add('is-open');
    document.body.classList.add('is-locked');
    requestAnimationFrame(() => panel.focus({ preventScroll: true }));
  }
  function closeOrder() {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.inert = true;
    document.body.classList.remove('is-locked');
    if (orderPlaced) setTimeout(resetOrder, 500);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function resetOrder() {
    orderPlaced = false;
    cart.clear();
    renderCart();
    form.reset();
    successView.hidden = true;
    formView.hidden = false;
    submitBtn.classList.remove('is-loading');
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-open-order]')) { e.preventDefault(); openOrder(); }
    else if (e.target.closest('[data-close-order]')) closeOrder();
  });
  $('[data-success-done]').addEventListener('click', closeOrder);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (drawer.classList.contains('is-open')) closeOrder();
      else closeMobileMenu(true);
    }
    if (e.key === 'Tab' && drawer.classList.contains('is-open')) {
      const f = focusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Phone mask: +998 (XX) XXX-XX-XX
  const phoneInput = $('[data-phone]');
  const phoneDigits = (v) => {
    let d = v.replace(/\D/g, '');
    if (!d.startsWith('998')) d = `998${d}`;
    return d.slice(0, 12);
  };
  function formatPhone(d) {
    const p = d.slice(3);
    let out = '+998';
    if (p.length) out += ` (${p.slice(0, 2)}`;
    if (p.length >= 2) out += ')';
    if (p.length > 2) out += ` ${p.slice(2, 5)}`;
    if (p.length > 5) out += `-${p.slice(5, 7)}`;
    if (p.length > 7) out += `-${p.slice(7, 9)}`;
    return out;
  }
  phoneInput.addEventListener('input', (e) => {
    if (e.inputType && e.inputType.startsWith('delete')) return;
    phoneInput.value = formatPhone(phoneDigits(phoneInput.value));
  });
  phoneInput.addEventListener('focus', () => { if (!phoneInput.value) phoneInput.value = '+998 '; });
  phoneInput.addEventListener('blur', () => { if (phoneInput.value.replace(/\D/g, '') === '998') phoneInput.value = ''; });

  const formError = $('[data-form-error]');
  function setFormError(msg) { formError.textContent = msg; }
  function setFieldError(name, msg) {
    const input = form.elements[name];
    const err = $(`[data-error-for="${name}"]`, form);
    err.textContent = msg;
    if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
  }
  form.elements.name.addEventListener('input', () => setFieldError('name', ''));
  phoneInput.addEventListener('input', () => setFieldError('phone', ''));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let firstBad = null;
    const name = form.elements.name.value.trim();
    const digits = phoneInput.value.replace(/\D/g, '');
    setFormError('');
    if (name.length < 2) { setFieldError('name', 'Напишите, как к вам обращаться'); firstBad = firstBad || form.elements.name; } else setFieldError('name', '');
    if (digits.length !== 12) { setFieldError('phone', 'Нужен номер в формате +998 (XX) XXX-XX-XX'); firstBad = firstBad || phoneInput; } else setFieldError('phone', '');
    if (!cart.size) { setFormError('Добавьте в заказ хотя бы одну позицию'); firstBad = firstBad || $('.upsell-btn'); }
    if (firstBad) { firstBad.focus(); return; }

    submitBtn.classList.add('is-loading');
    submitBtn.textContent = 'Отправляем';
    const total = cartTotal();
    const when = pickup.value === 'asap' ? 'через ~10 минут' : `к ${pickup.value}`;
    setTimeout(() => {
      orderPlaced = true;
      const num = 100 + Math.floor(Math.random() * 900);
      $('[data-success-title]').textContent = `${name.split(' ')[0]}, заказ №${num} принят!`;
      $('[data-success-meta]').innerHTML = `Заберите <b>${when}</b> · Итого <b>${sum(total)}</b>`;
      formView.hidden = true;
      successView.hidden = false;
      $('[data-success-title]').focus();
    }, isReduced() ? 50 : 900);
  });

  /* =========================================================
     Loyalty card
     ========================================================= */
  const stampsEl = $('[data-stamps]');
  const stampCard = $('[data-stamp-card]');
  const stampStatus = $('[data-stamp-status]');
  const stampMeter = $('[data-stamp-meter]');
  const TOTAL_STAMPS = 7;
  const stamped = new Array(TOTAL_STAMPS).fill(false);
  const STAMP_SVG = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 14h18v8a9 9 0 0 1-18 0Z" fill="none" stroke="#f3e9dc" stroke-width="3.2" stroke-linejoin="round"/><path d="M27 16c6 0 6 8 0 8" fill="none" stroke="#f3e9dc" stroke-width="3.2"/><path d="M14 9c-1.5-2 1.5-3 0-5M20 9c-1.5-2 1.5-3 0-5" fill="none" stroke="#ff6b2c" stroke-width="2.6" stroke-linecap="round"/></svg>';
  const GIFT_SVG = '<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 14h18v8a9 9 0 0 1-18 0Z" fill="#fffaf3" stroke="#2b1a12" stroke-width="3" stroke-linejoin="round"/><path d="M27 16c6 0 6 8 0 8" fill="none" stroke="#2b1a12" stroke-width="3"/><path d="M18 6l1.6 3.2 3.4.5-2.5 2.4.6 3.4-3.1-1.6-3.1 1.6.6-3.4-2.5-2.4 3.4-.5Z" fill="#2b1a12"/></svg>';

  stampsEl.innerHTML = stamped.map((_, i) => {
    const gift = i === TOTAL_STAMPS - 1;
    const rot = Math.round(Math.random() * 30 - 15);
    return `<li${gift ? ' class="gift-li"' : ''} style="${gift ? 'grid-column: span 2' : ''}">
      <button type="button" class="stamp${gift ? ' stamp--gift' : ''}" data-stamp="${i}" aria-pressed="false" style="--rot:${rot}deg"
        aria-label="${gift ? 'Седьмая отметка: этот кофе — за наш счёт' : `Отметка ${i + 1} из 7`}">
        ${gift
          ? `<span class="gift-icon" aria-hidden="true">${GIFT_SVG}</span><span class="gift-text">Этот кофе — за&nbsp;наш счёт<small>7-я отметка</small></span>`
          : `<span aria-hidden="true">${i + 1}</span>`}
        <span class="stamp-mark" aria-hidden="true">${STAMP_SVG}</span>
      </button></li>`;
  }).join('');
  const stampBtns = $$('[data-stamp]', stampsEl);

  function renderStamps() {
    const n = stamped.filter(Boolean).length;
    stampBtns.forEach((b, i) => {
      b.classList.toggle('is-stamped', stamped[i]);
      b.setAttribute('aria-pressed', stamped[i]);
    });
    stampMeter.style.transform = `scaleX(${n / TOTAL_STAMPS})`;
    const complete = stamped[TOTAL_STAMPS - 1];
    stampCard.classList.toggle('is-complete', complete);
    stampStatus.textContent = complete
      ? 'Все 7 отметок! Этот кофе — за наш счёт'
      : n === TOTAL_STAMPS - 1 ? 'Отмечено 6 из 7 — следующий кофе в подарок!' : `Отмечено ${n} из 7`;
  }

  stampsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-stamp]');
    if (!b) return;
    const i = Number(b.dataset.stamp);
    const gift = i === TOTAL_STAMPS - 1;
    if (!stamped[i]) {
      const regularDone = stamped.slice(0, TOTAL_STAMPS - 1).every(Boolean);
      if (gift && !regularDone) {
        b.classList.remove('is-shake'); void b.offsetWidth; b.classList.add('is-shake');
        stampStatus.textContent = 'Сначала соберите 6 отметок — седьмой кофе будет в подарок';
        return;
      }
      stamped[i] = true;
      b.style.setProperty('--rot', `${Math.round(Math.random() * 30 - 15)}deg`);
      if (gift) confetti();
    } else {
      stamped[i] = false;
      if (!gift) stamped[TOTAL_STAMPS - 1] = false;
    }
    renderStamps();
  });
  stampBtns.forEach((b) => b.addEventListener('animationend', () => b.classList.remove('is-shake')));
  $('[data-stamp-reset]').addEventListener('click', () => { stamped.fill(false); renderStamps(); });

  function confetti() {
    if (isReduced()) return;
    const colors = ['#ff6b2c', '#2b1a12', '#fffaf3', '#ffb38a', '#8fb35a'];
    for (let k = 0; k < 26; k++) {
      const c = document.createElement('span');
      c.className = 'confetti';
      c.style.background = colors[k % colors.length];
      c.style.borderRadius = k % 3 === 0 ? '50%' : '3px';
      stampCard.appendChild(c);
      const ang = Math.random() * Math.PI * 2;
      const dist = 120 + Math.random() * 160;
      c.animate([
        { transform: 'translate(-50%,-50%) rotate(0) scale(.6)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(ang) * dist}px), calc(-50% + ${Math.sin(ang) * dist}px)) rotate(${Math.random() * 720}deg) scale(1)`, opacity: 0 },
      ], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.22,1,.36,1)' }).onfinish = () => c.remove();
    }
  }
  renderStamps();

  /* =========================================================
     Open / closed state (Asia/Tashkent, UTC+5)
     ========================================================= */
  (function openState() {
    const box = $('[data-open-state]');
    const text = $('[data-open-text]');
    const now = tashkentNow();
    const day = now.getUTCDay();
    const mins = now.getUTCHours() * 60 + now.getUTCMinutes();
    const hours = (d) => (d === 0 || d === 6 ? [510, 1380] : [450, 1320]);
    const [o, c] = hours(day);
    if (mins >= o && mins < c) {
      box.classList.add('is-open');
      text.textContent = `Сейчас открыто · до ${hhmm(c)}`;
    } else {
      box.classList.add('is-closed');
      const nextOpen = mins < o ? o : hours((day + 1) % 7)[0];
      text.textContent = `Сейчас закрыто · откроемся ${mins < o ? 'в' : 'завтра в'} ${hhmm(nextOpen)}`;
    }
  })();

  /* =========================================================
     Header, mobile menu, nav highlight
     ========================================================= */
  const header = $('[data-header]');
  const burger = $('[data-burger]');
  const mobileMenu = $('[data-mobile-menu]');
  let menuTimer;

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function openMobileMenu() {
    clearTimeout(menuTimer);
    header.classList.add('menu-open');
    mobileMenu.inert = false;
    mobileMenu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
    document.body.classList.add('is-locked');
  }
  function closeMobileMenu(returnFocus) {
    if (!mobileMenu.classList.contains('is-open')) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.inert = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Открыть меню');
    document.body.classList.remove('is-locked');
    menuTimer = setTimeout(() => header.classList.remove('menu-open'), isReduced() ? 0 : 750);
    if (returnFocus) burger.focus();
  }
  burger.addEventListener('click', () => (mobileMenu.classList.contains('is-open') ? closeMobileMenu() : openMobileMenu()));
  $$('a', mobileMenu).forEach((a) => a.addEventListener('click', () => closeMobileMenu()));
  window.matchMedia('(min-width: 980px)').addEventListener('change', (e) => { if (e.matches) closeMobileMenu(); });

  const navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    const secObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.classList.toggle('is-current', a.getAttribute('href') === `#${en.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['menu', 'preorder', 'loyalty', 'contacts', 'top'].forEach((id) => { const s = document.getElementById(id); if (s) secObs.observe(s); });
  }

  /* =========================================================
     Marquee
     ========================================================= */
  $$('[data-marquee]').forEach((track) => {
    const text = track.dataset.marquee;
    const half = Array.from({ length: 4 }, () => `<span>${text}</span>`).join('');
    track.innerHTML = half + half;
  });

  /* =========================================================
     Scroll reveal
     ========================================================= */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !isReduced()) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* =========================================================
     Hero parallax (pointer on desktop, scroll everywhere)
     ========================================================= */
  const parallaxRoot = $('[data-parallax]');
  const layers = $$('[data-depth]', parallaxRoot).map((el) => ({ el, depth: Number(el.dataset.depth) }));
  const finePointer = window.matchMedia('(pointer: fine)');
  let tx = 0, ty = 0, cx = 0, cy = 0, sy = 0, rafId = null, heroVisible = true;

  function tick() {
    cx += (tx - cx) * 0.08;
    cy += (ty - cy) * 0.08;
    const scrollY = Math.min(window.scrollY, window.innerHeight);
    sy += (scrollY - sy) * 0.15;
    layers.forEach(({ el, depth }) => {
      const x = cx * depth;
      const y = cy * depth - sy * depth * 0.012;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)${el.classList.contains('cup-wrap') ? ` rotate(${(cx * 2.4).toFixed(2)}deg)` : ''}`;
    });
    const settled = Math.abs(tx - cx) < 0.001 && Math.abs(ty - cy) < 0.001 && Math.abs(scrollY - sy) < 0.3;
    rafId = settled ? null : requestAnimationFrame(tick);
  }
  const kick = () => { if (!rafId && heroVisible && !isReduced()) rafId = requestAnimationFrame(tick); };

  window.addEventListener('pointermove', (e) => {
    if (!finePointer.matches || e.pointerType === 'touch') return;
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
    kick();
  }, { passive: true });
  window.addEventListener('scroll', kick, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; if (heroVisible) kick(); }).observe(parallaxRoot);
  }

  /* =========================================================
     Intro
     ========================================================= */
  renderCart();
  const ready = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]) : Promise.resolve();
  ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-loaded'))));
})();
