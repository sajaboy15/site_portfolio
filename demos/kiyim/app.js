/* KIYIM — concept store · SAJA BOYS · vanilla JS */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var EASE = 'cubic-bezier(.22,1,.36,1)';
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = function () { return mqReduce.matches; };
  var NB = ' ';

  function money(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, NB) + NB + 'сум'; }
  function plural(n, forms) {
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return forms[2];
    if (b > 1 && b < 5) return forms[1];
    if (b === 1) return forms[0];
    return forms[2];
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ---------- colour helpers ---------- */
  function hexToRgb(h) { h = h.replace('#', ''); return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]; }
  function rgbToHex(r) { return '#' + r.map(function (v) { return Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); }).join(''); }
  function mix(a, b, t) { var x = hexToRgb(a), y = hexToRgb(b); return rgbToHex([0, 1, 2].map(function (i) { return x[i] + (y[i] - x[i]) * t; })); }
  function lum(h) {
    var c = hexToRgb(h).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function tint(h) { var L = lum(h); return mix(h, '#ebe9e3', L > 0.6 ? 0.55 : L < 0.05 ? 0.9 : 0.85); }
  function colorVars(h) {
    var L = lum(h), dark = L < 0.12;
    var g2 = dark ? mix(h, '#ffffff', 0.12) : mix(h, '#000000', 0.1);
    var g3 = dark ? mix(h, '#ffffff', 0.26) : mix(h, '#000000', 0.26);
    var p = L > 0.42 ? '#2f4bff' : '#f5f4f0';
    var cd = L < 0.3 ? '#efece5' : mix(h, '#000000', 0.38);
    return '--g:' + h + ';--g2:' + g2 + ';--g3:' + g3 + ';--p:' + p + ';--cd:' + cd;
  }
  function applyColor(svg, h) {
    if (!svg) return;
    colorVars(h).split(';').forEach(function (kv) { var i = kv.indexOf(':'); svg.style.setProperty(kv.slice(0, i), kv.slice(i + 1)); });
  }

  /* ---------- data ---------- */
  var COLORS = {
    black: { n: 'Чёрный', h: '#1d1d1f' },
    milk: { n: 'Молочный', h: '#ede6d8' },
    electric: { n: 'Электрик', h: '#2f4bff' },
    olive: { n: 'Олива', h: '#6f7350' },
    terra: { n: 'Терракота', h: '#b65a3c' },
    graphite: { n: 'Графит', h: '#46494f' },
    sand: { n: 'Песочный', h: '#cdb995' },
    bordo: { n: 'Бордо', h: '#6d2333' },
    melange: { n: 'Серый меланж', h: '#b5b5b1' },
    sage: { n: 'Шалфей', h: '#9cab8f' }
  };
  var CATS = {
    hoodie: { n: 'Худи', long: 'Худи и свитшоты' },
    tee: { n: 'Футболки', long: 'Футболки' },
    pants: { n: 'Брюки', long: 'Брюки' },
    acc: { n: 'Аксессуары', long: 'Аксессуары' }
  };
  var SIZES = ['XS', 'S', 'M', 'L', 'XL'];

  var PRODUCTS = [
    { id: 'h-chorsu', name: 'Худи «Чорсу»', cat: 'hoodie', type: 'hoodie', price: 549000, pop: 1, isNew: true, colors: ['black', 'milk', 'electric'], sold: ['XS'],
      fit: 'Оверсайз', desc: 'Оверсайз-худи из плотного футера с начёсом. Двойной капюшон, карман-кенгуру и спущенное плечо — тепло и без лишнего.',
      comp: '80% хлопок, 20% полиэстер. Футер 3-нитка с начёсом, 420 г/м². Стирка при 30 °C, наизнанку.', kw: 'худи толстовка капюшон оверсайз' },
    { id: 'h-ipak', name: 'Худи «Ипак»', cat: 'hoodie', type: 'hoodie', ikat: true, price: 649000, pop: 3, isNew: true, colors: ['milk', 'black', 'sage'], sold: ['XL'],
      fit: 'Оверсайз', desc: 'Капсула «Ипак»: узор икат по мотивам маргиланского шёлка на кармане и подкладке капюшона.',
      comp: '80% хлопок, 20% полиэстер, 420 г/м². Принт — водная печать, не трескается. Стирка при 30 °C.', kw: 'худи икат ипак капсула принт' },
    { id: 's-toshkent', name: 'Свитшот «Toshkent»', cat: 'hoodie', type: 'sweat', print: 'TOSHKENT', price: 429000, pop: 4, colors: ['graphite', 'sand', 'electric'], sold: ['S'],
      fit: 'Свободный', desc: 'Свитшот с вышитой надписью на груди. Мягкий футер, рибана на манжетах и поясе.',
      comp: '100% хлопок, футер 2-нитка петля, 340 г/м². Вышивка гладью.', kw: 'свитшот ташкент надпись вышивка' },
    { id: 's-base', name: 'Свитшот базовый', cat: 'hoodie', type: 'sweat', price: 379000, pop: 7, colors: ['melange', 'olive', 'bordo'], sold: [],
      fit: 'Свободный', desc: 'Тот самый свитшот на каждый день. Без принтов, без логотипов — только крой и плотная ткань.',
      comp: '100% хлопок, футер 2-нитка петля, 340 г/м².', kw: 'свитшот базовый' },
    { id: 't-over', name: 'Футболка Oversize', cat: 'tee', type: 'tee', price: 189000, pop: 2, colors: ['black', 'milk', 'electric', 'terra'], sold: ['XS', 'XL'],
      fit: 'Оверсайз', desc: 'Плотная футболка свободного кроя со спущенным плечом и узкой горловиной. Держит форму после стирок.',
      comp: '100% хлопок, кулирная гладь 220 г/м². Стирка при 30 °C.', kw: 'футболка оверсайз база' },
    { id: 't-suzani', name: 'Футболка «Сузани»', cat: 'tee', type: 'tee', ikat: true, price: 229000, pop: 6, isNew: true, colors: ['milk', 'black'], sold: ['XS'],
      fit: 'Оверсайз', desc: 'Футболка из капсулы «Ипак» с принтом-икатом на груди. Яркие цвета не выгорают на солнце.',
      comp: '100% хлопок, 220 г/м². Принт — водная печать.', kw: 'футболка икат сузани ипак принт' },
    { id: 't-heavy', name: 'Футболка Heavy 240', cat: 'tee', type: 'tee', price: 209000, pop: 9, colors: ['sand', 'olive', 'graphite'], sold: [],
      fit: 'Прямой', desc: 'Самая плотная футболка коллекции. Жёсткая фактура, которая с каждой ноской становится мягче.',
      comp: '100% хлопок, 240 г/м², предварительная усадка.', kw: 'футболка плотная heavy' },
    { id: 't-logo', name: 'Футболка «KIYIM»', cat: 'tee', type: 'tee', print: 'KIYIM', price: 199000, pop: 5, colors: ['electric', 'black', 'milk'], sold: ['XL'],
      fit: 'Оверсайз', desc: 'Футболка с крупным логотипом. «Kiyim» по-узбекски — «одежда». Просто и по делу.',
      comp: '100% хлопок, 220 г/м². Шелкография.', kw: 'футболка логотип kiyim' },
    { id: 'p-yunus', name: 'Карго «Юнусабад»', cat: 'pants', type: 'cargo', price: 489000, pop: 8, isNew: true, colors: ['olive', 'black', 'sand'], sold: ['XS'],
      fit: 'Свободный', desc: 'Карго с объёмными карманами и манжетами на резинке. Пояс с кулиской — ремень не нужен.',
      comp: '98% хлопок, 2% эластан. Твил 280 г/м².', kw: 'карго брюки штаны джоггеры' },
    { id: 'p-chilan', name: 'Брюки «Чиланзар»', cat: 'pants', type: 'wide', price: 439000, pop: 11, colors: ['graphite', 'milk', 'black'], sold: ['XL'],
      fit: 'Широкий', desc: 'Широкие брюки с защипами и стрелками. Сидят на талии, длина — в пол.',
      comp: '65% полиэстер, 35% вискоза. Не мнутся в дороге.', kw: 'брюки широкие штаны' },
    { id: 'p-nylon', name: 'Карго нейлон', cat: 'pants', type: 'cargo', price: 529000, old: 659000, pop: 12, colors: ['black', 'electric'], sold: ['XS', 'S'],
      fit: 'Свободный', desc: 'Лёгкие карго из нейлона с водоотталкивающей пропиткой. Шуршат ровно настолько, насколько нужно.',
      comp: '100% нейлон, водоотталкивающая пропитка DWR.', kw: 'карго нейлон брюки штаны скидка' },
    { id: 'a-cap', name: 'Кепка «KIYIM»', cat: 'acc', type: 'cap', print: 'KIYIM', price: 149000, pop: 10, colors: ['black', 'electric', 'sand'], one: true,
      desc: 'Шестиклинка с вышитым логотипом и регулируемой застёжкой сзади.', comp: '100% хлопок, твил. Обхват 56–60 см.', kw: 'кепка бейсболка аксессуары' },
    { id: 'a-ipak-cap', name: 'Кепка «Ипак»', cat: 'acc', type: 'cap', ikat: true, price: 169000, pop: 13, colors: ['black', 'milk', 'olive'], one: true,
      desc: 'Кепка из капсулы «Ипак»: передние клинья — с узором икат.', comp: '100% хлопок. Обхват 56–60 см.', kw: 'кепка икат ипак' },
    { id: 'a-tote', name: 'Шопер «Бозор»', cat: 'acc', type: 'tote', print: 'KIYIM', price: 119000, pop: 14, colors: ['milk', 'black'], one: true,
      desc: 'Вместительный шопер из плотного канваса. Влезает ноутбук, продукты с базара и ещё худи сверху.', comp: '100% хлопок, канвас 340 г/м². 38 × 42 см.', kw: 'шопер сумка аксессуары бозор' },
    { id: 'a-ipak-tote', name: 'Шопер «Ипак»', cat: 'acc', type: 'tote', ikat: true, price: 139000, pop: 15, isNew: true, colors: ['milk', 'sand'], one: true,
      desc: 'Шопер с панелью-икатом. Внутри карман на молнии для ключей и телефона.', comp: '100% хлопок, канвас 340 г/м². 38 × 42 см.', kw: 'шопер сумка икат ипак' }
  ];
  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  /* ---------- garment SVGs ---------- */
  var uid = 0;
  function ikatPattern(id, s) {
    s = s || 1;
    var w = 36 * s, h = 52 * s;
    return '<pattern id="' + id + '" width="' + w + '" height="' + h + '" patternUnits="userSpaceOnUse">' +
      '<g transform="scale(' + s + ')">' +
      '<rect width="36" height="52" fill="#f1e5cc"/>' +
      '<path d="M18 2 L32 26 L18 50 L4 26Z" fill="#2f4bff"/>' +
      '<path d="M18 11 L26.5 26 L18 41 L9.5 26Z" fill="#f2b33a"/>' +
      '<path d="M18 19 L22 26 L18 33 L14 26Z" fill="#d23a52"/>' +
      '<path d="M0 -9 L7 0 L0 9 L-7 0Z M36 -9 L43 0 L36 9 L29 0Z M0 43 L7 52 L0 61 L-7 52Z M36 43 L43 52 L36 61 L29 52Z" fill="#1d1d1f"/>' +
      '<path d="M1 23h7M28 29h7M7 12h4M25 40h4M25 12h4M7 40h4M15 5h2M19 47h2" stroke="#2f4bff" stroke-width="2.2"/>' +
      '<path d="M12 24h3M21 28h3" stroke="#f2b33a" stroke-width="1.8"/>' +
      '</g></pattern>';
  }

  var SHAPES = {
    tee: function (o, id) {
      var chest = '';
      if (o.ikat) chest = '<rect x="158" y="128" width="84" height="96" rx="6" fill="url(#' + id + 'i)"/><rect x="158" y="128" width="84" height="96" rx="6" fill="none" stroke="rgba(0,0,0,.12)"/>';
      else if (o.print) chest = '<text class="pr" x="200" y="176" text-anchor="middle" font-size="40">' + o.print + '</text><text class="pr" x="200" y="198" text-anchor="middle" font-size="9.5" letter-spacing="4">TOSHKENT · 2026</text>';
      return '<path class="g1" d="M152 50 Q200 96 248 50 L318 74 L372 150 L334 178 L304 152 L306 356 Q200 368 94 356 L96 152 L66 178 L28 150 L82 74Z"/>' +
        '<path class="g3" d="M152 50 Q200 36 248 50 Q200 96 152 50Z"/>' +
        '<path class="sh" d="M96 152 L94 356 Q102 357 112 358 Q122 252 104 160Z"/>' +
        '<path class="sh" d="M304 152 L306 356 Q298 357 288 358 Q278 252 296 160Z"/>' +
        '<path class="sh" d="M66 178 L96 152 L92 170Z"/><path class="sh" d="M334 178 L304 152 L308 170Z"/>' +
        '<path class="g2" d="M144 51 Q200 110 256 51 L248 50 Q200 96 152 50Z"/>' +
        '<path class="s3" d="M86 77 Q103 116 96 152 M314 77 Q297 116 304 152"/>' +
        '<path class="s3d" d="M37 141 L74 168 M363 141 L326 168 M97 343 Q200 353 305 343"/>' + chest;
    },
    hoodie: function (o, id) {
      var inner = o.ikat ? 'fill="url(#' + id + 'i)"' : 'class="g3"';
      var pocket = o.ikat
        ? '<path d="M138 258 L262 258 L286 338 L114 338Z" fill="url(#' + id + 'i)"/><path d="M138 258 L262 258 L286 338 L114 338Z" class="s3" stroke-width="2.5"/>'
        : '<path class="g1" d="M138 258 L262 258 L286 338 L114 338Z"/><path class="s3" d="M138 258 L262 258 L286 338 L114 338Z"/>';
      return '<path class="g1" d="M138 92 C128 40 160 18 200 18 C240 18 272 40 262 92Z"/>' +
        '<path class="sh" d="M138 92 C128 40 160 18 200 18 C176 30 158 52 156 92Z"/>' +
        '<path class="g1" d="M150 78 L100 90 C74 98 62 120 58 150 L34 318 L76 328 L96 172 L96 362 L304 362 L304 172 L324 328 L366 318 L342 150 C338 120 326 98 300 90 L250 78 Q200 100 150 78Z"/>' +
        '<path class="sh" d="M96 172 L76 328 L62 325 Q74 240 96 172Z"/><path class="sh" d="M304 172 L324 328 L338 325 Q326 240 304 172Z"/>' +
        '<path class="sh" d="M96 172 L96 340 L110 340 Q114 250 100 172Z"/><path class="sh" d="M304 172 L304 340 L290 340 Q286 250 300 172Z"/>' +
        '<path class="g2" d="M37 300 L78 310 L76 328 L34 318Z M363 300 L322 310 L324 328 L366 318Z M96 340 H304 V362 H96Z"/>' +
        '<path class="s3d" d="M38 296 L79 306 M362 296 L321 306"/>' +
        '<path class="s3" d="M150 80 Q118 118 96 172 M250 80 Q282 118 304 172"/>' +
        pocket +
        '<path class="sh" d="M138 258 L114 338 L128 338 L147 262Z"/><path class="sh" d="M262 258 L286 338 L272 338 L253 262Z"/>' +
        '<path ' + inner + ' d="M156 92 C152 54 172 36 200 36 C228 36 248 54 244 92 C232 104 216 110 200 110 C184 110 168 104 156 92Z"/>' +
        (o.ikat ? '<path class="sh" style="opacity:.18" d="M156 92 C152 54 172 36 200 36 C228 36 248 54 244 92 C232 104 216 110 200 110 C184 110 168 104 156 92Z"/>' : '') +
        '<path class="rim" d="M156 92 C152 54 172 36 200 36 C228 36 248 54 244 92 C232 104 216 110 200 110 C184 110 168 104 156 92Z"/>' +
        '<path class="s3" stroke-width="1.4" d="M156 92 C152 54 172 36 200 36 C228 36 248 54 244 92 C232 104 216 110 200 110 C184 110 168 104 156 92Z"/>' +
        '<path class="cord" d="M186 110 Q181 150 184 196 M214 110 Q219 150 216 196"/>' +
        '<rect class="g3" x="180.5" y="192" width="7" height="14" rx="3"/><rect class="g3" x="212.5" y="192" width="7" height="14" rx="3"/>';
    },
    sweat: function (o) {
      var chest = o.print ? '<text class="pr" x="200" y="178" text-anchor="middle" font-size="25">' + o.print + '</text><text class="pr" x="200" y="198" text-anchor="middle" font-size="10" letter-spacing="5">EST · 2026</text>' : '';
      return '<path class="g1" d="M158 74 L100 90 C74 98 62 120 58 150 L34 318 L76 328 L96 172 L96 362 L304 362 L304 172 L324 328 L366 318 L342 150 C338 120 326 98 300 90 L242 74 Q200 112 158 74Z"/>' +
        '<path class="g3" d="M158 74 Q200 60 242 74 Q200 112 158 74Z"/>' +
        '<path class="sh" d="M96 172 L76 328 L62 325 Q74 240 96 172Z"/><path class="sh" d="M304 172 L324 328 L338 325 Q326 240 304 172Z"/>' +
        '<path class="sh" d="M96 172 L96 340 L110 340 Q114 250 100 172Z"/><path class="sh" d="M304 172 L304 340 L290 340 Q286 250 300 172Z"/>' +
        '<path class="g2" d="M150 77 Q200 126 250 77 L242 74 Q200 112 158 74Z"/>' +
        '<path class="g2" d="M37 300 L78 310 L76 328 L34 318Z M363 300 L322 310 L324 328 L366 318Z M96 340 H304 V362 H96Z"/>' +
        '<path class="s3d" d="M38 296 L79 306 M362 296 L321 306 M98 336 H302"/>' +
        '<path class="s3" d="M155 80 Q120 118 96 172 M245 80 Q280 118 304 172"/>' + chest;
    },
    cargo: function () {
      return '<path class="g1" d="M120 34 L280 34 L298 362 L214 366 L200 140 L186 366 L102 362Z"/>' +
        '<path class="sh" d="M200 140 L186 366 L174 366 L195 150Z"/><path class="sh" d="M200 140 L214 366 L226 366 L205 150Z"/>' +
        '<path class="g2" d="M120 34 L280 34 L281 58 L119 58Z"/>' +
        '<path class="s3d" d="M121 52 H279"/>' +
        '<path class="g2" d="M137 30 h9 v32 h-9Z M195.5 30 h9 v32 h-9Z M254 30 h9 v32 h-9Z"/>' +
        '<path class="s3" d="M200 58 L200 124 M213 58 L213 108 Q213 124 202 130 M122 96 Q152 92 166 58 M278 96 Q248 92 234 58"/>' +
        '<path class="g1" d="M114 206 L162 206 L163 270 L117 272Z"/><path class="s3" d="M114 206 L162 206 L163 270 L117 272Z M138 216 V266"/>' +
        '<path class="g2" d="M112 194 L164 194 L164 214 L113 214Z"/><path class="s3" d="M112 194 L164 194 L164 214 L113 214Z"/>' +
        '<path class="g1" d="M286 206 L238 206 L237 270 L283 272Z"/><path class="s3" d="M286 206 L238 206 L237 270 L283 272Z M262 216 V266"/>' +
        '<path class="g2" d="M288 194 L236 194 L236 214 L287 214Z"/><path class="s3" d="M288 194 L236 194 L236 214 L287 214Z"/>' +
        '<circle class="g3" cx="138" cy="208" r="3"/><circle class="g3" cx="262" cy="208" r="3"/>' +
        '<path class="s3" d="M146 300 Q154 308 146 318 M254 300 Q246 308 254 318"/>' +
        '<path class="g2" d="M103 344 L187 348 L186 366 L102 362Z M297 344 L213 348 L214 366 L298 362Z"/>';
    },
    wide: function () {
      return '<path class="g1" d="M122 34 L278 34 L312 362 L210 366 L200 150 L190 366 L88 362Z"/>' +
        '<path class="sh" d="M200 150 L190 366 L176 366 L196 160Z"/><path class="sh" d="M200 150 L210 366 L224 366 L204 160Z"/>' +
        '<path class="g2" d="M122 34 L278 34 L279 60 L121 60Z"/>' +
        '<path class="s3" d="M200 60 L200 128 M212 60 L212 112 Q212 126 202 132 M124 98 Q150 92 162 60 M276 98 Q250 92 238 60"/>' +
        '<path class="s3" stroke-width="1.6" d="M156 60 L140 362 M244 60 L260 362"/>' +
        '<path class="g3" d="M148 60 h6 v14 h-6Z M246 60 h6 v14 h-6Z"/>' +
        '<path class="s3d" d="M90 350 L189 354 M310 350 L211 354"/>';
    },
    cap: function (o, id) {
      var front = o.ikat
        ? '<path d="M200 96 C160 130 148 186 150 236 L250 236 C252 186 240 130 200 96Z" fill="url(#' + id + 'i)"/>'
        : '';
      var logo = o.print ? '<text class="pr" x="200" y="190" text-anchor="middle" font-size="22">' + o.print + '</text>' : '';
      return '<g transform="translate(0 22)">' +
        '<path class="g1" d="M92 236 C88 150 134 96 200 94 C266 96 312 150 308 236Z"/>' + front +
        '<path class="sh" d="M92 236 C88 150 134 96 200 94 C152 112 122 160 126 236Z"/>' +
        '<path class="s3" d="M200 96 C160 130 148 186 150 232 M200 96 C240 130 252 186 250 232 M200 96 C126 120 102 176 98 222 M200 96 C274 120 298 176 302 222"/>' +
        '<circle class="g3" cx="152" cy="148" r="3.2"/><circle class="g3" cx="248" cy="148" r="3.2"/>' +
        '<ellipse class="g2" cx="200" cy="96" rx="12" ry="6"/>' + logo +
        '<path class="sh" style="opacity:.14" d="M92 236 Q200 208 308 236 L308 224 Q200 196 92 224Z"/>' +
        '<path class="g2" d="M78 228 Q200 198 322 228 C352 240 360 268 340 290 Q200 322 60 290 C40 268 48 240 78 228Z"/>' +
        '<path class="g3" d="M60 290 Q200 322 340 290 Q336 300 326 305 Q200 336 74 305 Q64 300 60 290Z"/>' +
        '<path class="s3d" d="M88 242 Q200 214 312 242 M78 260 Q200 230 322 260"/>' +
        '</g>';
    },
    tote: function (o, id) {
      var art = '';
      if (o.ikat) art = '<path d="M93 236 L307 236 L314 372 L86 372Z" fill="url(#' + id + 'i)"/><path d="M93 236 L307 236" class="s3" stroke-width="3"/>' +
        '<text class="pr" x="200" y="204" text-anchor="middle" font-size="30">IPAK</text>';
      else if (o.print) art = '<text class="pr" x="200" y="262" text-anchor="middle" font-size="44">' + o.print + '</text><text class="pr" x="200" y="288" text-anchor="middle" font-size="10" letter-spacing="5">TOSHKENT · 2026</text>';
      return '<path class="s3" style="stroke:var(--g3);stroke-width:14" d="M162 140 C162 74 238 74 238 140"/>' +
        '<path class="g1" d="M96 136 L304 136 L314 372 L86 372Z"/>' +
        '<path class="sh" d="M96 136 L118 136 L112 372 L86 372Z"/><path class="sh" d="M304 136 L284 136 L292 372 L314 372Z"/>' +
        art +
        '<path class="g2" d="M96 136 L304 136 L305 154 L95 154Z"/>' +
        '<path class="s3d" d="M96 160 H304 M88 360 H312"/>' +
        '<path style="fill:none;stroke:var(--g2);stroke-width:15;stroke-linecap:round;transition:stroke .55s" d="M144 150 C144 46 256 46 256 150"/>' +
        '<path class="s3d" d="M144 148 C144 52 256 52 256 148"/>' +
        '<rect class="g2" x="134" y="146" width="20" height="26" rx="2"/><rect class="g2" x="246" y="146" width="20" height="26" rx="2"/>' +
        '<path class="s3" stroke-width="1.4" d="M134 146 l20 26 M154 146 l-20 26 M246 146 l20 26 M266 146 l-20 26"/>';
    }
  };

  function garment(p, h) {
    var id = 'kg' + (++uid);
    var defs = p.ikat ? '<defs>' + ikatPattern(id + 'i', p.type === 'cap' ? 0.7 : 0.8) + '</defs>' : '';
    return '<svg class="garment" viewBox="0 0 400 400" aria-hidden="true" focusable="false" style="' + colorVars(h) + '">' + defs + SHAPES[p.type](p, id) + '</svg>';
  }

  /* ---------- storage ---------- */
  function load(key, fb) { try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fb : v; } catch (e) { return fb; } }
  function save(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) { /* private mode */ } }

  var state = {
    filter: 'all',
    sort: 'pop',
    cart: [],
    wish: [],
    sel: {}
  };
  (function restore() {
    var c = load('kiyim_cart', []), w = load('kiyim_wish', []);
    if (Array.isArray(c)) state.cart = c.filter(function (l) {
      var p = l && byId[l.id];
      return p && p.colors.indexOf(l.color) > -1 && typeof l.size === 'string' && l.qty > 0;
    }).map(function (l) { return { id: l.id, color: l.color, size: l.size, qty: Math.min(10, Math.max(1, parseInt(l.qty, 10) || 1)) }; });
    if (Array.isArray(w)) state.wish = w.filter(function (id) { return byId[id]; });
  })();
  PRODUCTS.forEach(function (p) { state.sel[p.id] = p.colors[0]; });

  /* ---------- toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg, color) {
    toastEl.innerHTML = '<i style="--c:' + (color || 'var(--accent)') + '"></i><span>' + esc(msg) + '</span>';
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
  }

  /* ---------- counters ---------- */
  function cartQty() { return state.cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function cartSum() { return state.cart.reduce(function (s, l) { return s + byId[l.id].price * l.qty; }, 0); }
  function setCount(el, n, bump) {
    el.textContent = n > 99 ? '99+' : n;
    el.classList.toggle('on', n > 0);
    if (bump && n > 0 && !reduced()) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
  }
  function updateCounters(bumpCart, bumpWish) {
    var cq = cartQty(), wq = state.wish.length;
    setCount($('#cartCount'), cq, bumpCart);
    setCount($('#wishCount'), wq, bumpWish);
    $('#cartBtn').setAttribute('aria-label', 'Корзина: ' + cq + ' ' + plural(cq, ['товар', 'товара', 'товаров']));
    $('#wishBtn').setAttribute('aria-label', 'Избранное: ' + wq);
    $('#chipWishN').textContent = wq;
  }

  /* ---------- wishlist ---------- */
  function isWished(id) { return state.wish.indexOf(id) > -1; }
  function toggleWish(id) {
    var on = !isWished(id);
    if (on) state.wish.push(id); else state.wish = state.wish.filter(function (x) { return x !== id; });
    save('kiyim_wish', state.wish);
    $$('[data-wish="' + id + '"]').forEach(function (b) {
      b.setAttribute('aria-pressed', on);
      if (b.classList.contains('qv__wish')) b.lastChild.textContent = on ? ' В избранном' : ' В избранное';
      if (on && !reduced()) { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
    });
    updateCounters(false, on);
    toast(on ? 'Добавлено в избранное' : 'Удалено из избранного');
    if (state.filter === 'wish') renderGrid(true);
  }

  /* ---------- category tiles ---------- */
  function renderCats() {
    var tiles = [
      { k: 'hoodie', p: 'h-chorsu', c: 'graphite' },
      { k: 'tee', p: 't-over', c: 'electric' },
      { k: 'pants', p: 'p-yunus', c: 'olive' },
      { k: 'acc', p: 'a-cap', c: 'sand' }
    ];
    $('#catTiles').innerHTML = tiles.map(function (t, i) {
      var n = PRODUCTS.filter(function (p) { return p.cat === t.k; }).length;
      var h = COLORS[t.c].h;
      return '<a class="cat reveal" style="--d:' + (i * 0.07) + 's;--bg-tile:' + tint(h) + '" href="#catalog" data-filter="' + t.k + '">' +
        '<span class="cat__art">' + garment(byId[t.p], h) + '</span>' +
        '<span class="cat__meta"><span><span class="cat__name">' + CATS[t.k].n + '</span><span class="cat__n">' + n + ' ' + plural(n, ['модель', 'модели', 'моделей']) + '</span></span>' +
        '<span class="cat__go" aria-hidden="true"><svg><use href="#i-arrow"/></svg></span></span></a>';
    }).join('');
  }

  /* ---------- product grid ---------- */
  var grid = $('#grid');
  var cardEls = {};

  function priceHTML(p) {
    return p.old ? '<span class="sale">' + money(p.price) + '</span><s>' + money(p.old) + '</s>' : '<span>' + money(p.price) + '</span>';
  }
  function tagsHTML(p) {
    var t = '';
    if (p.isNew) t += '<span class="tag tag--new">NEW</span>';
    if (p.old) t += '<span class="tag tag--sale">−' + Math.round((1 - p.price / p.old) * 100) + '%</span>';
    return t ? '<div class="tags">' + t + '</div>' : '';
  }
  function swatchesHTML(p, cur, lg) {
    return '<div class="swatches' + (lg ? ' swatches--lg' : '') + '" role="group" aria-label="Цвет">' + p.colors.map(function (k) {
      return '<button type="button" class="sw" style="--c:' + COLORS[k].h + '" data-color="' + k + '" aria-pressed="' + (k === cur) + '" aria-label="' + COLORS[k].n + '" title="' + COLORS[k].n + '"></button>';
    }).join('') + '</div>';
  }

  function buildCard(p) {
    var el = document.createElement('article');
    var cur = state.sel[p.id], h = COLORS[cur].h;
    el.className = 'card';
    el.dataset.id = p.id;
    el.innerHTML =
      '<div class="card__media" style="--bg-tile:' + tint(h) + '">' + tagsHTML(p) +
        '<button type="button" class="card__open" aria-label="' + esc(p.name) + ' — открыть">' + garment(p, h) + '</button>' +
        '<button type="button" class="heart" data-wish="' + p.id + '" aria-pressed="' + isWished(p.id) + '" aria-label="В избранное: ' + esc(p.name) + '">' +
          '<svg class="h-off"><use href="#i-heart"/></svg><svg class="h-on"><use href="#i-heart-f"/></svg></button>' +
        '<button type="button" class="card__quick" tabindex="-1" aria-hidden="true">Быстрый просмотр <svg><use href="#i-arrow"/></svg></button>' +
      '</div>' +
      '<div class="card__info"><h3 class="card__name">' + esc(p.name) + '</h3><p class="card__price">' + priceHTML(p) + '</p></div>' +
      swatchesHTML(p, cur);
    return el;
  }

  function setCardColor(el, p, k) {
    state.sel[p.id] = k;
    var h = COLORS[k].h;
    applyColor($('.garment', el), h);
    $('.card__media', el).style.setProperty('--bg-tile', tint(h));
    $$('.sw', el).forEach(function (s) { s.setAttribute('aria-pressed', s.dataset.color === k); });
  }

  function filtered() {
    var f = state.filter;
    var list = PRODUCTS.filter(function (p) {
      if (f === 'all') return true;
      if (f === 'new') return p.isNew;
      if (f === 'ikat') return p.ikat;
      if (f === 'wish') return isWished(p.id);
      return p.cat === f;
    });
    list.sort(function (a, b) {
      if (state.sort === 'asc') return a.price - b.price || a.pop - b.pop;
      if (state.sort === 'desc') return b.price - a.price || a.pop - b.pop;
      return a.pop - b.pop;
    });
    return list;
  }

  function renderGrid(animate) {
    var list = filtered();
    var first = new Map();
    if (animate && !reduced()) {
      Object.keys(cardEls).forEach(function (id) {
        var el = cardEls[id];
        if (el.isConnected && !el.hidden) first.set(el, el.getBoundingClientRect());
      });
    }
    var ids = list.map(function (p) { return p.id; });
    PRODUCTS.forEach(function (p) {
      if (!cardEls[p.id]) cardEls[p.id] = buildCard(p);
      cardEls[p.id].hidden = ids.indexOf(p.id) < 0;
    });
    list.forEach(function (p) { grid.appendChild(cardEls[p.id]); });
    PRODUCTS.forEach(function (p) { if (ids.indexOf(p.id) < 0) grid.appendChild(cardEls[p.id]); });

    var n = list.length;
    var label = { all: 'Вся коллекция', 'new': 'Новинки', ikat: 'Капсула «Ипак»', wish: 'Избранное' }[state.filter] || CATS[state.filter].long;
    $('#resultCount').textContent = label + ' · ' + n + ' ' + plural(n, ['товар', 'товара', 'товаров']);
    $('#gridEmpty').hidden = n > 0;

    if (animate && !reduced()) {
      list.forEach(function (p, i) {
        var el = cardEls[p.id];
        el.classList.add('in');
        var f = first.get(el), l = el.getBoundingClientRect();
        if (f) {
          var dx = f.left - l.left, dy = f.top - l.top;
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            el.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 700, easing: EASE });
          }
        } else {
          el.animate([{ opacity: 0, transform: 'translateY(24px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 650, easing: EASE, delay: Math.min(i, 8) * 40, fill: 'backwards' });
        }
      });
    }
  }

  function setFilter(f, opts) {
    opts = opts || {};
    if (!(f in CATS) && ['all', 'new', 'ikat', 'wish'].indexOf(f) < 0) f = 'all';
    state.filter = f;
    $$('#chips .chip').forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.chip === f); });
    $$('.nav a').forEach(function (a) { a.classList.toggle('is-active', a.dataset.filter === f); });
    renderGrid(opts.animate !== false);
    var chip = $('#chips [data-chip="' + f + '"]');
    if (chip && window.innerWidth < 900) {
      var box = $('#chips'), br = box.getBoundingClientRect(), cr = chip.getBoundingClientRect();
      box.scrollTo({ left: box.scrollLeft + (cr.left - br.left) - box.clientWidth / 2 + cr.width / 2, behavior: reduced() ? 'auto' : 'smooth' });
    }
  }

  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (!card) return;
    var p = byId[card.dataset.id];
    var sw = e.target.closest('.sw');
    if (sw) { setCardColor(card, p, sw.dataset.color); return; }
    var heart = e.target.closest('.heart');
    if (heart) { toggleWish(p.id); return; }
    if (e.target.closest('.card__open, .card__quick')) openQuick(p.id, e.target.closest('button'));
  });

  $('#chips').addEventListener('click', function (e) {
    var c = e.target.closest('.chip');
    if (c) setFilter(c.dataset.chip);
  });
  $('[data-chip-go]').addEventListener('click', function () { setFilter('all'); });
  $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; renderGrid(true); });

  // links that set a filter & go to catalog
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-filter]');
    if (!a) return;
    e.preventDefault();
    var f = a.dataset.filter;
    var closeFirst = a.closest('.layer');
    if (closeFirst) closeLayer(closeFirst, true);
    setFilter(f, { animate: $('#catalog').getBoundingClientRect().top < window.innerHeight });
    var target = $('#catalog');
    var y = target.getBoundingClientRect().top + window.scrollY - (parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 64) - 8;
    window.scrollTo({ top: y, behavior: reduced() ? 'auto' : 'smooth' });
    target.focus({ preventScroll: true });
  });

  $('#wishBtn').addEventListener('click', function () {
    setFilter('wish');
    var target = $('#catalog');
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 76, behavior: reduced() ? 'auto' : 'smooth' });
  });

  /* ---------- layers (modal / drawer / menu / search) ---------- */
  var stack = [];
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  function scrollbarW() { return window.innerWidth - document.documentElement.clientWidth; }
  function openLayer(el, opener) {
    if (stack.indexOf(el) > -1) return;
    if (!stack.length) {
      var sw = scrollbarW();
      document.documentElement.style.overflow = 'hidden';
      if (sw) document.body.style.paddingRight = sw + 'px';
    }
    el._opener = opener || document.activeElement;
    stack.push(el);
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('is-open');
    var focusT = el.querySelector('[data-autofocus]') || $$(FOCUSABLE, el).filter(function (n) { return n.offsetParent !== null; })[0];
    setTimeout(function () { if (focusT) focusT.focus({ preventScroll: true }); }, 60);
  }
  function closeLayer(el, noRestore) {
    var i = stack.indexOf(el);
    if (i < 0) return;
    stack.splice(i, 1);
    el.classList.remove('is-open');
    setTimeout(function () { if (!el.classList.contains('is-open')) el.hidden = true; }, reduced() ? 0 : 520);
    if (!stack.length) {
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    if (el === $('#mnav')) { $('#burger').setAttribute('aria-expanded', 'false'); }
    if (!noRestore && el._opener && el._opener.focus && el._opener.isConnected) el._opener.focus({ preventScroll: true });
  }
  $$('.layer').forEach(function (layer) {
    layer.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeLayer(layer);
    });
  });
  document.addEventListener('keydown', function (e) {
    var top = stack[stack.length - 1];
    if (!top) return;
    if (e.key === 'Escape') { e.preventDefault(); closeLayer(top); return; }
    if (e.key === 'Tab') {
      var f = $$(FOCUSABLE, top).filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
      if (!f.length) return;
      var a = f[0], z = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === a || !top.contains(document.activeElement))) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && (document.activeElement === z || !top.contains(document.activeElement))) { e.preventDefault(); a.focus(); }
    }
  });

  // mobile menu
  $('#burger').addEventListener('click', function () { this.setAttribute('aria-expanded', 'true'); openLayer($('#mnav'), this); });

  /* ---------- search ---------- */
  var sInput = $('#searchInput'), sRes = $('#searchResults');
  function runSearch() {
    var q = sInput.value.trim().toLowerCase();
    $('#searchHints').hidden = !!q;
    if (!q) { sRes.innerHTML = ''; return; }
    var words = q.split(/\s+/);
    var res = PRODUCTS.filter(function (p) {
      var hay = (p.name + ' ' + CATS[p.cat].long + ' ' + (p.kw || '') + ' ' + p.colors.map(function (k) { return COLORS[k].n; }).join(' ')).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) > -1; });
    }).sort(function (a, b) { return a.pop - b.pop; }).slice(0, 8);
    if (!res.length) { sRes.innerHTML = '<li class="sr-empty">Ничего не нашлось по запросу «' + esc(sInput.value.trim()) + '». Попробуйте «худи» или «карго».</li>'; return; }
    sRes.innerHTML = res.map(function (p, i) {
      var h = COLORS[state.sel[p.id]].h;
      return '<li><button type="button" class="sr" data-id="' + p.id + '" style="animation-delay:' + (i * 30) + 'ms">' +
        '<span class="sr__img" style="--bg-tile:' + tint(h) + '">' + garment(p, h) + '</span>' +
        '<span><span class="sr__name">' + esc(p.name) + '</span><br><span class="sr__price">' + money(p.price) + ' · ' + CATS[p.cat].n + '</span></span></button></li>';
    }).join('');
  }
  sInput.addEventListener('input', runSearch);
  sInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var b = $('.sr', sRes); if (b) { e.preventDefault(); b.click(); } }
  });
  sRes.addEventListener('click', function (e) {
    var b = e.target.closest('.sr');
    if (!b) return;
    closeLayer($('#search'), true);
    openQuick(b.dataset.id, $('#searchBtn'));
  });
  $('#searchHints').addEventListener('click', function (e) {
    var b = e.target.closest('[data-q]');
    if (b) { sInput.value = b.dataset.q; runSearch(); sInput.focus(); }
  });
  $('#searchBtn').addEventListener('click', function () {
    sInput.setAttribute('data-autofocus', '');
    openLayer($('#search'), this);
    runSearch();
  });

  /* ---------- quick view ---------- */
  var qv = { id: null, color: null, size: null, qty: 1 };
  var qvPanel = $('#qvPanel');
  function openQuick(id, opener) {
    var p = byId[id];
    qv = { id: id, color: state.sel[id], size: p.one ? 'One size' : null, qty: 1 };
    var h = COLORS[qv.color].h;
    var sizes = p.one ? ['One size'] : SIZES;
    qvPanel.innerHTML =
      '<button type="button" class="icon-btn modal__close" data-close aria-label="Закрыть"><svg><use href="#i-close"/></svg></button>' +
      '<div class="qv">' +
        '<div class="qv__media" style="--bg-tile:' + tint(h) + '">' + tagsHTML(p) + garment(p, h) + '</div>' +
        '<div class="qv__body">' +
          '<p class="qv__cat">' + CATS[p.cat].n + (p.fit ? ' · ' + p.fit : '') + '</p>' +
          '<h2 class="qv__title" id="qvTitle">' + esc(p.name) + '</h2>' +
          '<p class="qv__price">' + priceHTML(p) + '</p>' +
          '<p class="qv__label"><span>Цвет: <b id="qvColorName">' + COLORS[qv.color].n + '</b></span></p>' +
          swatchesHTML(p, qv.color, true) +
          '<p class="qv__label"><span>Размер' + (p.one ? '' : ': <b id="qvSizeName">не выбран</b>') + '</span>' + (p.one ? '' : '<small>Посадка: ' + p.fit.toLowerCase() + '</small>') + '</p>' +
          '<div class="sizes' + (p.one ? ' sizes--one' : '') + '" id="qvSizes" role="group" aria-label="Размер" aria-describedby="qvErr">' + sizes.map(function (s) {
            var out = (p.sold || []).indexOf(s) > -1;
            return '<button type="button" class="size" data-size="' + s + '" aria-pressed="' + (p.one) + '"' + (out ? ' disabled aria-label="' + s + ' — нет в наличии" title="Нет в наличии"' : '') + '>' + s + '</button>';
          }).join('') + '</div>' +
          '<p class="field-error" id="qvErr" role="alert"></p>' +
          '<div class="qv__buy">' +
            '<div class="qty" role="group" aria-label="Количество"><button type="button" data-q="-1" aria-label="Меньше"><svg><use href="#i-minus"/></svg></button><output id="qvQty" aria-live="polite">1</output><button type="button" data-q="1" aria-label="Больше"><svg><use href="#i-plus"/></svg></button></div>' +
            '<button type="button" class="btn btn--primary btn--lg" id="qvAdd">В корзину <svg class="btn__arrow"><use href="#i-bag"/></svg></button>' +
          '</div>' +
          '<button type="button" class="qv__wish" data-wish="' + p.id + '" aria-pressed="' + isWished(p.id) + '"><svg><use href="#i-heart"/></svg><span> ' + (isWished(p.id) ? 'В избранном' : 'В избранное') + '</span></button>' +
          '<p class="qv__desc">' + esc(p.desc) + '</p>' +
          '<div class="qv__details"><details open><summary>Состав и уход</summary><p>' + esc(p.comp) + '</p></details>' +
          '<details><summary>Доставка и обмен</summary><p>Курьером по Ташкенту за 1 день — бесплатно от 500 000 сум, иначе 25 000 сум. Самовывоз — бесплатно. Обмен и возврат в течение 14 дней.</p></details></div>' +
        '</div>' +
      '</div>';
    qvPanel.scrollTop = 0;
    var b = $('.qv__body', qvPanel); if (b) b.scrollTop = 0;
    updateQtyButtons();
    openLayer($('#qv'), opener);
  }
  function updateQtyButtons() {
    var m = $('[data-q="-1"]', qvPanel), pl = $('[data-q="1"]', qvPanel);
    if (m) m.disabled = qv.qty <= 1;
    if (pl) pl.disabled = qv.qty >= 10;
    var o = $('#qvQty'); if (o) o.textContent = qv.qty;
  }
  qvPanel.addEventListener('click', function (e) {
    var p = byId[qv.id];
    var sw = e.target.closest('.sw');
    if (sw) {
      qv.color = sw.dataset.color;
      var h = COLORS[qv.color].h;
      applyColor($('.qv__media .garment', qvPanel), h);
      $('.qv__media', qvPanel).style.setProperty('--bg-tile', tint(h));
      $$('.sw', qvPanel).forEach(function (s) { s.setAttribute('aria-pressed', s === sw); });
      $('#qvColorName').textContent = COLORS[qv.color].n;
      if (cardEls[p.id]) setCardColor(cardEls[p.id], p, qv.color);
      return;
    }
    var sz = e.target.closest('.size');
    if (sz && !sz.disabled) {
      qv.size = sz.dataset.size;
      $$('.size', qvPanel).forEach(function (s) { s.setAttribute('aria-pressed', s === sz); });
      var sn = $('#qvSizeName'); if (sn) sn.textContent = qv.size;
      $('#qvErr').textContent = '';
      $('#qvSizes').classList.remove('err');
      return;
    }
    var q = e.target.closest('[data-q]');
    if (q && !q.disabled && q.closest('.qty')) { qv.qty = Math.max(1, Math.min(10, qv.qty + parseInt(q.dataset.q, 10))); updateQtyButtons(); return; }
    if (e.target.closest('.qv__wish')) { toggleWish(p.id); return; }
    if (e.target.closest('#qvAdd')) {
      if (!qv.size) {
        var err = $('#qvErr');
        err.textContent = 'Выберите размер, чтобы добавить в корзину';
        err.classList.remove('shake'); void err.offsetWidth; err.classList.add('shake');
        $('#qvSizes').classList.add('err');
        var firstSize = $('.size:not(:disabled)', qvPanel); if (firstSize) firstSize.focus();
        return;
      }
      addToCart(p.id, qv.color, qv.size, qv.qty, true);
      closeLayer($('#qv'), true);
      setTimeout(function () { openCart(); }, reduced() ? 0 : 260);
    }
  });

  /* ---------- cart ---------- */
  var FREE = 500000, COURIER = 25000;
  function keyOf(l) { return l.id + '|' + l.color + '|' + l.size; }
  var lastAddedKey = null;
  function addToCart(id, color, size, qty, silent) {
    var ex = state.cart.filter(function (l) { return l.id === id && l.color === color && l.size === size; })[0];
    if (ex) ex.qty = Math.min(10, ex.qty + qty);
    else state.cart.unshift({ id: id, color: color, size: size, qty: qty });
    lastAddedKey = id + '|' + color + '|' + size;
    save('kiyim_cart', state.cart);
    updateCounters(true, false);
    renderCart();
    if (!silent) toast('В корзине: ' + byId[id].name + ', ' + size, COLORS[color].h);
  }
  function renderCart() {
    var list = $('#cartList'), n = cartQty(), sum = cartSum();
    $('#cartTitleN').textContent = n ? '(' + n + ')' : '';
    $('#cartEmpty').hidden = n > 0;
    $('#cartFoot').hidden = n === 0;
    $('#ship').hidden = n === 0;
    list.innerHTML = state.cart.map(function (l) {
      var p = byId[l.id], c = COLORS[l.color], k = keyOf(l);
      return '<li class="ci' + (k === lastAddedKey ? ' new' : '') + '" data-key="' + esc(k) + '">' +
        '<div class="ci__img" style="--bg-tile:' + tint(c.h) + '">' + garment(p, c.h) + '</div>' +
        '<div><p class="ci__name">' + esc(p.name) + '</p><p class="ci__meta"><i style="--c:' + c.h + '"></i>' + c.n + ' · ' + l.size + '</p>' +
        '<div class="ci__row"><div class="qty qty--sm" role="group" aria-label="Количество"><button type="button" data-d="-1" aria-label="Меньше"' + (l.qty <= 1 ? ' disabled' : '') + '><svg><use href="#i-minus"/></svg></button><output>' + l.qty + '</output><button type="button" data-d="1" aria-label="Больше"' + (l.qty >= 10 ? ' disabled' : '') + '><svg><use href="#i-plus"/></svg></button></div>' +
        '<span class="ci__price">' + money(p.price * l.qty) + '</span></div></div>' +
        '<button type="button" class="icon-btn ci__rm" data-rm aria-label="Удалить ' + esc(p.name) + '"><svg><use href="#i-trash"/></svg></button></li>';
    }).join('');
    lastAddedKey = null;
    $('#subtotal').textContent = money(sum);
    var left = FREE - sum, pct = Math.min(1, sum / FREE);
    var ship = $('#ship'), txt = $('#shipText');
    ship.classList.toggle('done', left <= 0);
    txt.classList.toggle('done', left <= 0);
    txt.innerHTML = left > 0 ? 'До бесплатной доставки осталось <b>' + money(left) + '</b>' : 'Доставка по Ташкенту — бесплатно';
    $('#shipFill').style.setProperty('--p', pct.toFixed(3));
    $('#shipBar').setAttribute('aria-valuenow', Math.round(pct * 100));
    updateSummary();
  }
  $('#cartList').addEventListener('click', function (e) {
    var li = e.target.closest('.ci');
    if (!li) return;
    var k = li.dataset.key;
    var line = state.cart.filter(function (l) { return keyOf(l) === k; })[0];
    if (!line) return;
    var d = e.target.closest('[data-d]');
    if (d && !d.disabled) {
      line.qty = Math.max(1, Math.min(10, line.qty + parseInt(d.dataset.d, 10)));
      save('kiyim_cart', state.cart); updateCounters(false, false); renderCart();
      var again = $('.ci[data-key="' + CSS.escape(k) + '"] [data-d="' + d.dataset.d + '"]');
      if (again && !again.disabled) again.focus(); else { var o = $('.ci[data-key="' + CSS.escape(k) + '"] .qty button:not(:disabled)'); if (o) o.focus(); }
      return;
    }
    if (e.target.closest('[data-rm]')) {
      li.classList.add('out');
      setTimeout(function () {
        state.cart = state.cart.filter(function (l) { return keyOf(l) !== k; });
        save('kiyim_cart', state.cart); updateCounters(false, false); renderCart();
        var next = $('#cartList .ci__rm') || $('#cartEmpty .btn'); if (next) next.focus();
      }, reduced() ? 0 : 300);
    }
  });

  function showView(name) {
    $$('#cart .drawer__view').forEach(function (v) { v.hidden = v.dataset.view !== name; });
    $('#cartBack').hidden = name !== 'checkout';
    $('#cartTitle').firstChild.textContent = name === 'checkout' ? 'Оформление ' : name === 'success' ? 'Готово ' : 'Корзина ';
    $('#cartTitleN').hidden = name !== 'cart';
    var v = $('#cart [data-view="' + name + '"] .drawer__scroll'); if (v) v.scrollTop = 0;
  }
  function openCart() {
    showView('cart');
    renderCart();
    openLayer($('#cart'), $('#cartBtn'));
  }
  $('#cartBtn').addEventListener('click', openCart);
  $('#toCheckout').addEventListener('click', function () { showView('checkout'); updateSummary(); setTimeout(function () { $('#fName').focus(); }, 50); });
  $('#cartBack').addEventListener('click', function () { showView('cart'); $('#toCheckout').focus(); });
  $('#backToShop').addEventListener('click', function () { closeLayer($('#cart')); setTimeout(function () { showView('cart'); }, 600); });
  $('[data-close-cart]').addEventListener('click', function () { closeLayer($('#cart'), true); });

  /* ---------- checkout ---------- */
  var form = $('#checkout');
  function deliveryMode() { return form.elements.delivery.value; }
  function shipCost() { return deliveryMode() === 'pickup' || cartSum() >= FREE ? 0 : COURIER; }
  function updateSummary() {
    var s = cartSum(), sh = shipCost();
    $('#sumN').textContent = cartQty();
    $('#sumItems').textContent = money(s);
    $('#sumShip').textContent = sh ? money(sh) : 'бесплатно';
    $('#sumTotal').textContent = money(s + sh);
    $('#placeOrder').textContent = 'Подтвердить заказ · ' + money(s + sh);
    $('#courierPrice').textContent = s >= FREE ? 'бесплатно, 1 день' : money(COURIER) + ', 1 день';
    var pick = deliveryMode() === 'pickup';
    $('#addrField').hidden = pick;
    $('#pickupNote').hidden = !pick;
  }
  form.addEventListener('change', function (e) { if (e.target.name === 'delivery') { updateSummary(); clearErr($('#fAddr')); } });

  var phone = $('#fPhone'), prevDigits = '';
  function phoneDigits(v) { var d = v.replace(/\D/g, ''); if (d.indexOf('998') === 0) d = d.slice(3); return d.slice(0, 9); }
  function fmtPhone(d) {
    if (!d) return '+998 ';
    var o = '+998 (' + d.slice(0, 2);
    if (d.length >= 2) o += ')';
    if (d.length > 2) o += ' ' + d.slice(2, 5);
    if (d.length > 5) o += '-' + d.slice(5, 7);
    if (d.length > 7) o += '-' + d.slice(7, 9);
    return o;
  }
  phone.addEventListener('focus', function () { if (!phone.value) { phone.value = '+998 '; prevDigits = ''; } });
  phone.addEventListener('blur', function () { if (!phoneDigits(phone.value)) phone.value = ''; });
  phone.addEventListener('input', function (e) {
    var d = phoneDigits(phone.value);
    if (e.inputType && e.inputType.indexOf('delete') === 0 && d === prevDigits && d.length) d = d.slice(0, -1);
    prevDigits = d;
    phone.value = fmtPhone(d);
    if (phone.getAttribute('aria-invalid') === 'true' && d.length === 9) clearErr(phone);
  });

  function setErr(input, msg) {
    input.setAttribute('aria-invalid', 'true');
    var el = $('#' + input.getAttribute('aria-describedby'));
    el.textContent = msg;
    el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
  }
  function clearErr(input) {
    input.removeAttribute('aria-invalid');
    var el = $('#' + input.getAttribute('aria-describedby')); if (el) el.textContent = '';
  }
  ['#fName', '#fAddr'].forEach(function (s) { $(s).addEventListener('input', function () { if (this.value.trim().length >= 2) clearErr(this); }); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [];
    var name = $('#fName'), addr = $('#fAddr');
    if (name.value.trim().length < 2) { setErr(name, 'Введите имя'); bad.push(name); } else clearErr(name);
    var d = phoneDigits(phone.value);
    if (d.length !== 9) { setErr(phone, d.length ? 'Номер неполный: нужно 9 цифр после +998' : 'Введите номер телефона'); bad.push(phone); } else clearErr(phone);
    if (deliveryMode() === 'courier' && addr.value.trim().length < 5) { setErr(addr, 'Укажите адрес: район, улицу и дом'); bad.push(addr); } else clearErr(addr);
    if (bad.length) { bad[0].focus(); return; }
    if (!state.cart.length) { showView('cart'); return; }

    var num = 'KY-' + String(Math.floor(10000 + Math.random() * 90000));
    var total = cartSum() + shipCost();
    var items = cartQty();
    $('#orderNum').textContent = '№ ' + num;
    $('#orderLead').textContent = 'Спасибо, ' + name.value.trim() + '! Мы свяжемся с вами по номеру ' + fmtPhone(d).replace(/ /g, NB) + ', чтобы подтвердить заказ.';
    var rows = [
      ['Товары', items + ' ' + plural(items, ['шт.', 'шт.', 'шт.'])],
      ['Получение', deliveryMode() === 'pickup' ? 'Самовывоз' : 'Курьер, 1 день'],
      ['Оплата', form.elements.pay.value],
      ['Итого', money(total)]
    ];
    $('#orderDl').innerHTML = rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
    state.cart = [];
    save('kiyim_cart', state.cart);
    updateCounters(false, false);
    renderCart();
    form.reset(); prevDigits = '';
    showView('success');
    setTimeout(function () { $('#backToShop').focus(); }, 50);
  });

  /* ---------- newsletter ---------- */
  $('#newsForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var inp = $('#newsEmail'), err = $('#newsErr');
    var v = inp.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      inp.setAttribute('aria-invalid', 'true');
      err.textContent = v ? 'Похоже, в адресе ошибка' : 'Введите электронную почту';
      err.classList.remove('shake'); void err.offsetWidth; err.classList.add('shake');
      inp.focus();
      return;
    }
    inp.removeAttribute('aria-invalid'); err.textContent = '';
    $('#newsDoneText').textContent = 'Это демо — на реальном сайте письма о новых дропах будут приходить на ' + v + '.';
    this.hidden = true;
    var done = $('#newsDone'); done.hidden = false; done.focus();
  });
  $('#newsEmail').addEventListener('input', function () { if (this.getAttribute('aria-invalid')) { this.removeAttribute('aria-invalid'); $('#newsErr').textContent = ''; } });

  /* ---------- hero + capsule art ---------- */
  function renderArt() {
    $('#heroMain').innerHTML = garment(byId['h-chorsu'], COLORS.milk.h);
    $('#heroSub').innerHTML = garment(byId['a-cap'], COLORS.black.h);
    $('#heroMini').innerHTML = garment(byId['t-over'], COLORS.terra.h);
    $('#capsuleGarment').innerHTML = garment(byId['h-ipak'], COLORS.milk.h);
    var pid = 'capIkat';
    $('#capsulePattern').innerHTML = '<svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>' + ikatPattern(pid, 2.2) + '</defs><rect width="600" height="600" fill="url(#' + pid + ')"/><rect width="600" height="600" fill="#111" opacity=".18"/></svg>';
  }

  // pointer parallax on hero
  (function () {
    var art = $('#heroArt');
    if (!art || !window.matchMedia('(pointer: fine)').matches) return;
    var raf = 0;
    $('.hero').addEventListener('pointermove', function (e) {
      if (reduced()) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var r = art.getBoundingClientRect();
        var x = ((e.clientX - r.left) / r.width - 0.5) * 2, y = ((e.clientY - r.top) / r.height - 0.5) * 2;
        art.style.setProperty('--mx', Math.max(-1, Math.min(1, x)).toFixed(3));
        art.style.setProperty('--my', Math.max(-1, Math.min(1, y)).toFixed(3));
      });
    });
    $('.hero').addEventListener('pointerleave', function () { art.style.setProperty('--mx', 0); art.style.setProperty('--my', 0); });
  })();

  /* ---------- header scroll state ---------- */
  var header = $('.header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- reveal ---------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduced()) {
      els.forEach(function (el) { el.classList.add('in'); });
      Object.keys(cardEls).forEach(function (id) { cardEls[id].classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });

    // grid cards: staggered reveal on first view
    var gio = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (en) { return en.isIntersecting; });
      vis.forEach(function (en, i) {
        var el = en.target;
        gio.unobserve(el);
        if (el.classList.contains('in')) return;
        el.classList.add('in');
        el.animate([{ opacity: 0, transform: 'translateY(32px)' }, { opacity: 1, transform: 'none' }], { duration: 900, easing: EASE, delay: i * 70, fill: 'backwards' });
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    Object.keys(cardEls).forEach(function (id) { gio.observe(cardEls[id]); });
  }

  /* ---------- init ---------- */
  renderArt();
  renderCats();
  renderGrid(false);
  renderCart();
  updateCounters(false, false);
  onScroll();
  initReveal();
  requestAnimationFrame(function () { requestAnimationFrame(function () { document.documentElement.classList.add('loaded'); }); });
})();
