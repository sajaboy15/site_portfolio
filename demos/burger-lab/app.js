/* Burger Lab — concept demo by SAJA BOYS. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = reduceMQ.matches;
  if (reduceMQ.addEventListener) reduceMQ.addEventListener('change', function (e) { reduced = e.matches; });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NBSP = ' ';
  function money(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP) + NBSP + 'сум'; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* =========================================================
     ART — flat SVG illustrations, all drawn in a 240×260 box
     ========================================================= */
  var C = {
    bun: '#f2a93b', bunHi: '#ffc760', bunSh: '#d4861c', bunCut: '#ffd98c', sesame: '#fff3d1',
    black: '#2b2521', blackHi: '#48403a', blackSh: '#181412', blackCut: '#4a413a',
    patty: '#6a321d', pattyHi: '#8d4c2c', pattySh: '#46200f',
    cheese: '#ffc21a', cheeseHi: '#ffe066',
    lettuce: '#5cc23c', lettuceSh: '#2f8f2a',
    tomato: '#e63b2e', tomatoIn: '#ff7b62',
    onion: '#b866c6', onionIn: '#f7e3fa',
    pickle: '#8cb83c', pickleSh: '#557f1b',
    bacon: '#b4412f', baconFat: '#f5b5a0',
    chicken: '#eaa33e', chickenSh: '#c37620', chickenHi: '#f9cd75',
    red: '#e63b2e', redSh: '#bf2c21', ink: '#111', yellow: '#ffd23f'
  };

  function drip(y, x1, x2, base, drips, r) {
    // band from x1..x2 at height `base`, with rounded drips hanging down
    var d = 'M' + x1 + ' ' + y + ' H' + x2 + ' V' + (y + base);
    drips.slice().sort(function (a, b) { return b[0] - a[0]; }).forEach(function (dp) {
      var x = dp[0], len = dp[1];
      d += ' L' + (x + r) + ' ' + (y + base) + ' V' + (y + base + len) + ' a' + r + ' ' + r + ' 0 0 1 ' + (-2 * r) + ' 0 V' + (y + base);
    });
    return d + ' L' + x1 + ' ' + (y + base) + ' Z';
  }

  var SEEDS = [[66, 40, -25], [82, 26, -10], [102, 16, 5], [124, 12, -8], [146, 16, 14], [166, 26, 22], [180, 40, 30],
    [92, 38, 15], [114, 30, -15], [136, 32, 8], [158, 42, -12], [76, 52, 20], [104, 50, -5], [128, 48, 18], [150, 54, -20], [174, 52, 10]];

  var LAYERS = {
    top: { adv: 62, vis: 70, draw: function (y, o) {
      var bl = o && o.black;
      var base = bl ? C.black : C.bun, sh = bl ? C.blackSh : C.bunSh, hi = bl ? C.blackHi : C.bunHi;
      return '<path d="M26 ' + (y + 60) + ' C26 ' + (y + 16) + ' 70 ' + y + ' 120 ' + y + ' S214 ' + (y + 16) + ' 214 ' + (y + 60) + ' Q214 ' + (y + 70) + ' 204 ' + (y + 70) + ' H36 Q26 ' + (y + 70) + ' 26 ' + (y + 60) + 'Z" fill="' + base + '"/>' +
        '<path d="M26 ' + (y + 58) + ' H214 V' + (y + 60) + ' Q214 ' + (y + 70) + ' 204 ' + (y + 70) + ' H36 Q26 ' + (y + 70) + ' 26 ' + (y + 60) + 'Z" fill="' + sh + '"/>' +
        '<path d="M56 ' + (y + 36) + ' Q70 ' + (y + 16) + ' 104 ' + (y + 10) + '" fill="none" stroke="' + hi + '" stroke-width="7" stroke-linecap="round"/>' +
        SEEDS.map(function (s) { return '<ellipse cx="' + s[0] + '" cy="' + (y + s[1]) + '" rx="4.6" ry="2.3" transform="rotate(' + s[2] + ' ' + s[0] + ' ' + (y + s[1]) + ')" fill="' + (bl ? '#f4efe6' : C.sesame) + '"/>'; }).join('');
    } },
    bottom: { adv: 36, vis: 36, draw: function (y, o) {
      var bl = o && o.black;
      var base = bl ? C.black : C.bun, sh = bl ? C.blackSh : C.bunSh, cut = bl ? C.blackCut : C.bunCut;
      return '<path d="M30 ' + y + ' H210 Q214 ' + y + ' 214 ' + (y + 6) + ' V' + (y + 16) + ' Q214 ' + (y + 36) + ' 192 ' + (y + 36) + ' H48 Q26 ' + (y + 36) + ' 26 ' + (y + 16) + ' V' + (y + 6) + ' Q26 ' + y + ' 30 ' + y + 'Z" fill="' + base + '"/>' +
        '<rect x="26" y="' + y + '" width="188" height="8" rx="4" fill="' + cut + '"/>' +
        '<path d="M42 ' + (y + 27) + ' Q120 ' + (y + 37) + ' 198 ' + (y + 27) + '" stroke="' + sh + '" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>';
    } },
    mid: { adv: 20, vis: 22, draw: function (y) {
      return '<rect x="28" y="' + y + '" width="184" height="22" rx="10" fill="' + C.bun + '"/>' +
        '<rect x="28" y="' + y + '" width="184" height="7" rx="3.5" fill="' + C.bunCut + '"/>' +
        '<rect x="28" y="' + (y + 15) + '" width="184" height="7" rx="3.5" fill="' + C.bunCut + '"/>';
    } },
    patty: { adv: 24, vis: 30, draw: function (y) {
      var specks = [[46, 17], [64, 22], [84, 15], [104, 21], [124, 16], [146, 22], [166, 15], [186, 20], [56, 25], [114, 25], [174, 25], [200, 14]];
      return '<rect x="22" y="' + y + '" width="196" height="30" rx="15" fill="' + C.patty + '"/>' +
        '<rect x="36" y="' + (y + 4) + '" width="168" height="6" rx="3" fill="' + C.pattyHi + '"/>' +
        specks.map(function (s) { return '<circle cx="' + s[0] + '" cy="' + (y + s[1]) + '" r="2.1" fill="' + C.pattySh + '"/>'; }).join('') +
        '<path d="M34 ' + (y + 24) + ' Q120 ' + (y + 33) + ' 206 ' + (y + 24) + '" stroke="' + C.pattySh + '" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>';
    } },
    chicken: { adv: 26, vis: 32, draw: function (y) {
      var d = 'M24 ' + (y + 14), k;
      for (k = 0; k < 12; k++) d += ' a8 8 0 0 1 16 0';
      d += ' L218 ' + (y + 20);
      for (k = 0; k < 12; k++) d += ' a8 8 0 0 1 -16 0';
      d += 'Z';
      var crumbs = [[40, 12], [62, 18], [80, 10], [98, 17], [118, 11], [138, 18], [158, 10], [178, 17], [196, 12], [52, 22], [128, 23], [190, 22]];
      return '<path d="' + d + '" fill="' + C.chicken + '" stroke="' + C.chickenSh + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M38 ' + (y + 9) + ' Q90 ' + (y + 4) + ' 140 ' + (y + 8) + '" stroke="' + C.chickenHi + '" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        crumbs.map(function (s) { return '<circle cx="' + s[0] + '" cy="' + (y + s[1]) + '" r="2.2" fill="' + C.chickenSh + '"/>'; }).join('');
    } },
    cheese: { adv: 8, vis: 26, draw: function (y) {
      return '<path d="' + drip(y, 18, 222, 9, [[42, 9], [80, 16], [128, 7], [170, 18], [206, 6]], 6) + '" fill="' + C.cheese + '"/>' +
        '<path d="M26 ' + (y + 3) + ' H214" stroke="' + C.cheeseHi + '" stroke-width="2.5" stroke-linecap="round"/>';
    } },
    lettuce: { adv: 10, vis: 18, draw: function (y) {
      var d = 'M18 ' + (y + 9), k;
      for (k = 0; k < 12; k++) d += ' q8.5 ' + (k % 2 ? -11 : -8) + ' 17 0';
      d += ' L224 ' + (y + 12);
      for (k = 0; k < 12; k++) d += ' q-8.5 ' + (k % 2 ? 9 : 6) + ' -17 0';
      d += 'Z';
      return '<path d="' + d + '" fill="' + C.lettuce + '" stroke="' + C.lettuceSh + '" stroke-width="2.2" stroke-linejoin="round"/>' +
        '<path d="M40 ' + (y + 10) + ' l10 -3 M90 ' + (y + 11) + ' l12 -4 M146 ' + (y + 10) + ' l10 -3 M190 ' + (y + 11) + ' l10 -3" stroke="' + C.lettuceSh + '" stroke-width="2" stroke-linecap="round"/>';
    } },
    tomato: { adv: 10, vis: 13, draw: function (y) {
      return [[30, 88], [122, 88]].map(function (t) {
        var x = t[0], w = t[1];
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="13" rx="6.5" fill="' + C.tomato + '"/>' +
          '<rect x="' + (x + 7) + '" y="' + (y + 3.5) + '" width="' + (w - 14) + '" height="6" rx="3" fill="' + C.tomatoIn + '"/>' +
          '<g fill="#ffe2b0"><ellipse cx="' + (x + 24) + '" cy="' + (y + 6.5) + '" rx="3" ry="1.6"/><ellipse cx="' + (x + 44) + '" cy="' + (y + 6.5) + '" rx="3" ry="1.6"/><ellipse cx="' + (x + 64) + '" cy="' + (y + 6.5) + '" rx="3" ry="1.6"/></g>';
      }).join('');
    } },
    onion: { adv: 6, vis: 10, draw: function (y) {
      return [56, 98, 142, 184].map(function (x, i) {
        return '<ellipse cx="' + x + '" cy="' + (y + 5 + (i % 2)) + '" rx="22" ry="4.5" fill="' + C.onionIn + '" stroke="' + C.onion + '" stroke-width="3"/>';
      }).join('');
    } },
    pickles: { adv: 6, vis: 10, draw: function (y) {
      return [50, 94, 142, 188].map(function (x, i) {
        return '<ellipse cx="' + x + '" cy="' + (y + 5) + '" rx="18" ry="4.8" fill="' + C.pickle + '" stroke="' + C.pickleSh + '" stroke-width="2"/>' +
          '<circle cx="' + (x - 6) + '" cy="' + (y + 5) + '" r="1.4" fill="#e3f1b8"/><circle cx="' + (x + 6) + '" cy="' + (y + 5) + '" r="1.4" fill="#e3f1b8"/>';
      }).join('');
    } },
    bacon: { adv: 9, vis: 14, draw: function (y) {
      var d = 'M24 ' + (y + 7) + ' q12 -9 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0';
      return '<path d="' + d + '" stroke="' + C.bacon + '" stroke-width="10" fill="none" stroke-linecap="round"/>' +
        '<path d="' + d + '" stroke="' + C.baconFat + '" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-dasharray="16 8"/>';
    } },
    jalapeno: { adv: 6, vis: 10, draw: function (y) {
      return [42, 76, 110, 144, 178, 204].map(function (x, i) {
        return '<ellipse cx="' + x + '" cy="' + (y + 5 - (i % 2)) + '" rx="12" ry="4.2" fill="#a8d86c" stroke="#2c8a3a" stroke-width="3"/><circle cx="' + x + '" cy="' + (y + 5 - (i % 2)) + '" r="1.6" fill="#f3f9d8"/>';
      }).join('');
    } },
    sauce: { adv: 3, vis: 12, draw: function (y, o) {
      var col = (o && o.color) || '#fff4d6';
      return '<path d="' + drip(y, 26, 214, 4, [[58, 8], [96, 4], [132, 9], [170, 5], [198, 7]], 4) + '" fill="' + col + '"/>';
    } }
  };

  // spec: array of 'top', 'cheese', 'sauce:#hex', 'top:black' ...
  function parseLayer(s) {
    var p = s.split(':'), o = {};
    if (p[1] === 'black') o.black = true; else if (p[1]) o.color = p[1];
    return { t: LAYERS[p[0]], o: o };
  }
  function burgerLayout(spec) {
    var layers = spec.map(parseLayer), y = 0;
    layers.forEach(function (l, i) { l.y = y; y += (i === layers.length - 1 ? l.t.vis : l.t.adv); });
    return { layers: layers, total: y };
  }
  function burger(spec, H) {
    H = H || 260;
    var lay = burgerLayout(spec), off = (H - lay.total) / 2 - 6;
    var out = '<ellipse cx="120" cy="' + (off + lay.total + 8) + '" rx="104" ry="9" fill="#111" opacity=".12"/>';
    for (var i = lay.layers.length - 1; i >= 0; i--) out += lay.layers[i].t.draw(lay.layers[i].y + off, lay.layers[i].o);
    return out;
  }

  function friesBox(opts) {
    opts = opts || {};
    var sticks = [[76, 64, -10], [88, 44, -6], [100, 56, -3], [110, 34, 2], [122, 50, 5], [134, 38, 8], [146, 58, 12], [156, 48, 15], [94, 74, -8], [128, 70, 4], [140, 80, 9], [116, 82, 0]];
    var s = '<ellipse cx="120" cy="242" rx="66" ry="8" fill="#111" opacity=".12"/>';
    s += sticks.map(function (t) {
      return '<g transform="rotate(' + t[2] + ' ' + t[0] + ' 170)"><rect x="' + (t[0] - 7) + '" y="' + t[1] + '" width="14" height="' + (170 - t[1]) + '" rx="3" fill="#ffcf4a"/><rect x="' + (t[0] + 2) + '" y="' + t[1] + '" width="5" height="' + (170 - t[1]) + '" rx="2.5" fill="#f0aa2a"/><rect x="' + (t[0] - 7) + '" y="' + t[1] + '" width="14" height="4" rx="2" fill="#e8962a"/></g>';
    }).join('');
    var col = opts.color || C.red, sh = opts.shade || C.redSh;
    s += '<path d="M58 118 Q120 140 182 118 L164 234 Q163 240 156 240 H84 Q77 240 76 234Z" fill="' + col + '"/>';
    s += '<path d="M182 118 L164 234 Q163 240 156 240 H146 L166 126Z" fill="' + sh + '"/>';
    s += '<circle cx="118" cy="182" r="22" fill="' + (opts.logo || C.yellow) + '"/>';
    s += '<path d="M106 183c0-7 5-11 12-11s12 4 12 11z" fill="#111"/><rect x="104" y="185" width="28" height="4" rx="2" fill="' + col + '"/><path d="M106 191h24v1c0 2.5-2 4-4 4h-16c-2 0-4-1.5-4-4z" fill="#111"/>';
    return s;
  }

  function wedges() {
    var w = [[78, 140, -24], [122, 124, 6], [164, 140, 26], [100, 150, -6], [146, 154, 12], [122, 146, -2]];
    var s = '<ellipse cx="120" cy="236" rx="90" ry="9" fill="#111" opacity=".12"/>';
    s += '<path d="M40 150 q10 -14 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 V176 H40Z" fill="#fff"/>';
    s += w.map(function (t) {
      return '<g transform="translate(' + t[0] + ' ' + t[1] + ') rotate(' + t[2] + ')"><path d="M-36 10 Q-32 -24 0 -26 Q32 -24 36 10 Q0 0 -36 10Z" fill="#f4bb55"/><path d="M-36 10 Q-32 -24 0 -26 Q32 -24 36 10" stroke="#a9651f" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-18 -6 Q0 -14 16 -8" stroke="#ffe0a0" stroke-width="4" fill="none" stroke-linecap="round"/><g fill="#c0392b" opacity=".55"><circle cx="-10" cy="0" r="1.6"/><circle cx="8" cy="-4" r="1.6"/><circle cx="20" cy="2" r="1.4"/></g></g>';
    }).join('');
    s += '<path d="M30 160 H210 L194 226 Q192 236 182 236 H58 Q48 236 46 226Z" fill="' + C.red + '"/>';
    s += '<path d="M210 160 L194 226 Q192 236 182 236 H172 L194 160Z" fill="' + C.redSh + '"/>';
    s += '<path d="M30 160 H210 L208 170 H32Z" fill="' + C.redSh + '"/>';
    s += '<circle cx="118" cy="200" r="20" fill="' + C.yellow + '"/><path d="M107 201c0-6.5 5-10 11-10s11 3.5 11 10z" fill="#111"/><rect x="105" y="203" width="26" height="3.6" rx="1.8" fill="' + C.red + '"/><path d="M107 208.5h22v1c0 2.2-1.8 3.6-3.8 3.6h-14.4c-2 0-3.8-1.4-3.8-3.6z" fill="#111"/>';
    s += '<g fill="#3a9a2c"><circle cx="96" cy="128" r="2.2"/><circle cx="140" cy="116" r="2"/><circle cx="118" cy="134" r="1.8"/><circle cx="160" cy="132" r="2"/><circle cx="80" cy="138" r="1.8"/></g>';
    return s;
  }

  var NUG = 'M-22 -6 C-24 -18 -6 -22 4 -18 C16 -22 26 -10 22 2 C24 14 8 18 -4 16 C-18 18 -26 8 -22 -6Z';
  function nugget(x, y, r, sc) {
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + r + ') scale(' + (sc || 1) + ')"><path d="' + NUG + '" fill="#eaa63f" stroke="#bf7420" stroke-width="2.6"/><path d="M-14 -10 Q-4 -16 8 -13" stroke="#fbd27e" stroke-width="3.5" fill="none" stroke-linecap="round"/><g fill="#c47a22"><circle cx="-8" cy="2" r="1.6"/><circle cx="6" cy="-2" r="1.6"/><circle cx="12" cy="8" r="1.6"/><circle cx="-12" cy="10" r="1.5"/><circle cx="0" cy="10" r="1.4"/></g></g>';
  }
  function dipCup(x, y, sc, color) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')"><path d="M-30 0 H30 L24 34 Q23 40 16 40 H-16 Q-23 40 -24 34Z" fill="#fff"/><path d="M-27 22 H27 L24 34 Q23 40 16 40 H-16 Q-23 40 -24 34Z" fill="' + C.red + '"/><ellipse cx="0" cy="0" rx="30" ry="8" fill="' + color + '"/><path d="M-14 -1 Q0 -5 12 -1" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".55"/></g>';
  }
  function nuggets() {
    var s = '<ellipse cx="120" cy="232" rx="96" ry="9" fill="#111" opacity=".12"/>';
    s += '<path d="M44 92 H196 L186 150 H54Z" fill="' + C.red + '"/><path d="M44 92 H196 L194 104 H46Z" fill="' + C.redSh + '"/>';
    s += nugget(88, 132, -12, 1.15) + nugget(132, 126, 18, 1.2) + nugget(170, 140, -24, 1.05);
    s += nugget(70, 162, 22, 1.1) + nugget(112, 160, -6, 1.25) + nugget(156, 168, 12, 1.15);
    s += '<path d="M34 158 H206 L194 222 Q192 230 182 230 H58 Q48 230 46 222Z" fill="#111"/>';
    s += '<text x="120" y="206" text-anchor="middle" font-family="Dela Gothic One, Arial Black, sans-serif" font-size="20" fill="' + C.yellow + '">NUGGETS</text>';
    s += '<path d="M40 166 H200" stroke="' + C.yellow + '" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>';
    return s;
  }
  function onionRings() {
    var s = '<ellipse cx="120" cy="232" rx="90" ry="9" fill="#111" opacity=".12"/>';
    s += '<ellipse cx="120" cy="222" rx="96" ry="14" fill="#fff"/><ellipse cx="120" cy="222" rx="80" ry="9" fill="#f6efe0"/>';
    var rings = [[110, 204, 0], [132, 182, 6], [106, 160, -8], [128, 138, 4], [116, 114, -6], [122, 90, 3]];
    rings.forEach(function (r) {
      s += '<g transform="rotate(' + r[2] + ' ' + r[0] + ' ' + r[1] + ')"><ellipse cx="' + r[0] + '" cy="' + r[1] + '" rx="50" ry="15" fill="none" stroke="#b46c1f" stroke-width="18"/><ellipse cx="' + r[0] + '" cy="' + r[1] + '" rx="50" ry="15" fill="none" stroke="#efb04f" stroke-width="13"/><ellipse cx="' + r[0] + '" cy="' + (r[1] - 2) + '" rx="50" ry="14" fill="none" stroke="#fbd383" stroke-width="3" stroke-dasharray="3 9" stroke-linecap="round"/></g>';
    });
    return s;
  }
  function cup(opts) {
    opts = opts || {};
    var body = opts.color || C.red, sh = opts.shade || C.redSh;
    var s = '<ellipse cx="120" cy="244" rx="56" ry="7" fill="#111" opacity=".12"/>';
    s += '<g transform="rotate(14 128 60)"><rect x="123" y="4" width="10" height="66" rx="3" fill="#fff"/><g fill="' + (opts.straw || C.red) + '"><rect x="123" y="10" width="10" height="6"/><rect x="123" y="24" width="10" height="6"/><rect x="123" y="38" width="10" height="6"/></g></g>';
    s += '<path d="M76 56 Q120 30 164 56Z" fill="#f3efe6"/><path d="M98 44 Q120 38 140 42" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>';
    s += '<path d="M70 72 H170 L160 234 Q159 242 151 242 H89 Q81 242 80 234Z" fill="' + body + '"/>';
    s += '<path d="M170 72 L160 234 Q159 242 151 242 H144 L158 72Z" fill="' + sh + '"/>';
    s += '<path d="M74 132 Q120 114 166 132 L162 182 Q120 166 78 182Z" fill="' + (opts.band || '#fff') + '"/>';
    s += '<circle cx="120" cy="150" r="17" fill="' + (opts.logo || C.yellow) + '"/><text x="120" y="156" text-anchor="middle" font-family="Dela Gothic One, Arial Black, sans-serif" font-size="15" fill="#111">BL</text>';
    s += '<rect x="62" y="54" width="116" height="20" rx="10" fill="#fff"/><rect x="62" y="66" width="116" height="8" rx="4" fill="#e7e1d4"/>';
    return s;
  }
  function lemonade() {
    var s = '<ellipse cx="120" cy="244" rx="54" ry="7" fill="#111" opacity=".12"/>';
    s += '<g transform="rotate(-12 110 80)"><rect x="104" y="10" width="10" height="110" rx="3" fill="#111"/><g fill="' + C.yellow + '"><rect x="104" y="18" width="10" height="7"/><rect x="104" y="34" width="10" height="7"/><rect x="104" y="50" width="10" height="7"/></g></g>';
    s += '<path d="M72 64 H168 L158 234 Q157 242 149 242 H91 Q83 242 82 234Z" fill="#fff" opacity=".85"/>';
    s += '<path d="M75 92 H165 L157 232 Q156 238 149 238 H91 Q84 238 83 232Z" fill="#ffd23f"/>';
    s += '<path d="M75 92 H165 L164 104 Q120 112 76 104Z" fill="#ffe680"/>';
    s += '<g fill="#fff" opacity=".75"><rect x="92" y="112" width="24" height="22" rx="5" transform="rotate(-14 104 123)"/><rect x="124" y="122" width="24" height="22" rx="5" transform="rotate(12 136 133)"/><rect x="104" y="150" width="22" height="20" rx="5" transform="rotate(8 115 160)"/></g>';
    s += '<g fill="#fff" opacity=".9"><circle cx="100" cy="196" r="3"/><circle cx="132" cy="212" r="2.4"/><circle cx="142" cy="178" r="2"/><circle cx="112" cy="222" r="1.8"/></g>';
    s += '<path d="M150 70 L142 226" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>';
    s += '<g transform="translate(160 70)"><circle r="26" fill="#ffe066" stroke="#f2b705" stroke-width="5"/><g stroke="#f2b705" stroke-width="2.4"><path d="M0 -20V20M-20 0H20M-14 -14L14 14M14 -14L-14 14"/></g><circle r="4" fill="#fff6c8"/></g>';
    s += '<path d="M62 60 q14 -18 30 -6 q-12 16 -30 6z" fill="#3fae49"/><path d="M64 60 q12 -6 24 -4" stroke="#2a7f32" stroke-width="2" fill="none"/>';
    return s;
  }
  function shake(flavor) {
    var F = {
      vanilla: { liquid: '#fff0bf', deep: '#f6dd92', top: 'cherry' },
      strawberry: { liquid: '#ff8fa3', deep: '#f2667f', top: 'cherry' },
      chocolate: { liquid: '#7a4126', deep: '#5e2f1a', top: 'choco' }
    }[flavor];
    var s = '<ellipse cx="120" cy="244" rx="50" ry="7" fill="#111" opacity=".12"/>';
    s += '<g transform="rotate(10 130 70)"><rect x="128" y="8" width="11" height="90" rx="3" fill="#fff"/><g fill="' + C.red + '"><rect x="128" y="14" width="11" height="7"/><rect x="128" y="30" width="11" height="7"/><rect x="128" y="46" width="11" height="7"/></g></g>';
    s += '<path d="M76 96 H164 L152 234 Q151 242 143 242 H97 Q89 242 88 234Z" fill="' + F.liquid + '"/>';
    s += '<path d="M164 96 L152 234 Q151 242 143 242 H136 L150 96Z" fill="' + F.deep + '"/>';
    s += '<path d="M90 110 L98 230" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55"/>';
    s += '<rect x="72" y="92" width="96" height="12" rx="6" fill="#fff" opacity=".9"/>';
    var cream = [[90, 90, 17], [118, 84, 21], [146, 90, 17], [102, 68, 15], [132, 68, 16], [118, 52, 13]];
    s += cream.map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '" fill="#fffaf0"/>'; }).join('');
    s += '<path d="M84 92 q10 6 20 0 M112 86 q10 6 20 0 M98 70 q8 5 16 0" stroke="#efe3cc" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    if (F.top === 'cherry') {
      s += '<path d="M120 40 q4 -16 18 -22" stroke="#3a7d2a" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="120" cy="44" r="11" fill="' + C.red + '"/><circle cx="116" cy="40" r="3" fill="#ff8a7a"/>';
    } else {
      s += '<path d="M84 80 q8 10 14 0 t14 2 t14 -2 t16 4" stroke="#5e2f1a" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="92" y="22" width="9" height="46" rx="4.5" fill="#d48b3a" transform="rotate(-18 96 45)"/><g fill="#5e2f1a"><rect x="110" y="44" width="4" height="2" rx="1"/><rect x="126" y="52" width="4" height="2" rx="1" transform="rotate(30 128 53)"/><rect x="140" y="60" width="4" height="2" rx="1"/></g>';
    }
    if (flavor === 'strawberry') s += '<g fill="#ffd1da"><circle cx="110" cy="180" r="3"/><circle cx="130" cy="200" r="2.5"/><circle cx="118" cy="214" r="2"/></g>';
    return s;
  }
  function sauceCup(o) {
    var s = '<ellipse cx="120" cy="226" rx="68" ry="8" fill="#111" opacity=".12"/>';
    if (o.dip === 'fry') s += '<g transform="rotate(-22 150 140)"><rect x="142" y="44" width="16" height="104" rx="3" fill="#ffcf4a"/><rect x="153" y="44" width="5" height="104" rx="2.5" fill="#f0aa2a"/><path d="M142 120 h16 v28 h-16z" fill="' + o.color + '"/><path d="M142 120 q4 6 8 0 q4 8 8 0" fill="' + o.color + '"/></g>';
    if (o.dip === 'nugget') s += nugget(150, 108, -24, 1.2) + '<path d="M132 120 q10 10 26 2 q-6 10 -16 8z" fill="' + o.color + '"/>';
    s += '<path d="M56 134 H184 L172 212 Q170 222 160 222 H80 Q70 222 68 212Z" fill="#fff"/>';
    s += '<path d="M60 168 H180 L176 196 H64Z" fill="' + o.band + '"/>';
    s += '<text x="120" y="188" text-anchor="middle" font-family="Dela Gothic One, Arial Black, sans-serif" font-size="13" fill="' + (o.ink || '#fff') + '" letter-spacing="1">' + esc(o.label) + '</text>';
    s += '<path d="M184 134 L172 212 Q170 222 160 222 H154 L170 134Z" fill="#000" opacity=".06"/>';
    s += '<ellipse cx="120" cy="134" rx="64" ry="15" fill="#efe9dc"/><ellipse cx="120" cy="134" rx="58" ry="12" fill="' + o.color + '"/>';
    s += '<path d="M92 132 q14 -8 30 -2 q12 4 22 -2" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>';
    return s;
  }
  function group(inner, x, y, sc) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">' + inner + '</g>'; }
  function svg(inner, label, vb) {
    return '<svg viewBox="' + (vb || '0 0 240 260') + '" role="img" aria-label="' + esc(label) + '" focusable="false">' + inner + '</svg>';
  }

  var R = {
    classic: ['top', 'sauce', 'lettuce', 'tomato', 'pickles', 'cheese', 'patty', 'bottom'],
    double: ['top', 'onion', 'pickles', 'cheese', 'patty', 'cheese', 'patty', 'sauce:#e63b2e', 'bottom'],
    bacon: ['top', 'sauce:#7a3417', 'onion', 'bacon', 'cheese', 'patty', 'lettuce', 'bottom'],
    black: ['top:black', 'jalapeno', 'sauce:#ff5a1f', 'cheese', 'patty', 'lettuce', 'bottom:black'],
    chicken: ['top', 'lettuce', 'tomato', 'sauce:#fffaf0', 'chicken', 'pickles', 'bottom'],
    monster: ['top', 'lettuce', 'cheese', 'patty', 'bacon', 'cheese', 'patty', 'mid', 'onion', 'cheese', 'patty', 'bottom']
  };

  /* =========================================================
     DATA
     ========================================================= */
  var CATS = [
    { id: 'all', name: 'Всё меню' },
    { id: 'burgers', name: 'Бургеры' },
    { id: 'combo', name: 'Комбо' },
    { id: 'snacks', name: 'Закуски' },
    { id: 'drinks', name: 'Напитки' },
    { id: 'sauces', name: 'Соусы' }
  ];

  var P = [
    { id: 'classic', cat: 'burgers', name: 'Классик Лаб', desc: 'Говяжья котлета 150 г, чеддер, томаты, айсберг, маринованные огурцы и фирменный соус Лаб.', meta: '280 г · 620 ккал', price: 39000, tag: 'Хит', art: function () { return burger(R.classic); } },
    { id: 'double', cat: 'burgers', name: 'Дабл Чиз', desc: 'Две котлеты, двойной чеддер, красный лук, огурцы и кетчуп. Для тех, кто пришёл голодным.', meta: '340 г · 890 ккал', price: 55000, art: function () { return burger(R.double); } },
    { id: 'bacon', cat: 'burgers', name: 'Бекон BBQ', desc: 'Котлета, говяжий бекон, чеддер, лук, свежий салат и дымный соус барбекю.', meta: '310 г · 780 ккал', price: 52000, art: function () { return burger(R.bacon); } },
    { id: 'black', cat: 'burgers', name: 'Блэк Лаб', desc: 'Чёрная булочка с углём, котлета, чеддер, халапеньо и острый соус шрирача.', meta: '300 г · 710 ккал', price: 49000, tag: 'Острый', hot: true, art: function () { return burger(R.black); } },
    { id: 'chicken', cat: 'burgers', name: 'Чикен Краш', desc: 'Хрустящее куриное филе в панировке, томаты, салат, огурцы и чесночный соус.', meta: '270 г · 590 ккал', price: 42000, art: function () { return burger(R.chicken); } },
    { id: 'monster', cat: 'burgers', name: 'Лаб Монстр', desc: 'Три котлеты, тройной чеддер, бекон, лук и салат на трёхъярусной булочке.', meta: '480 г · 1240 ккал', price: 72000, tag: 'Большой', art: function () { return burger(R.monster); } },

    { id: 'combo-classic', cat: 'combo', name: 'Комбо Классик', desc: 'Классик Лаб, картофель фри и кола 0,4 л.', meta: '≈ 700 г', price: 59000, old: 64000, tag: 'Выгодно', wide: true, art: function () { return group(friesBox(), -10, 20, .78) + group(cup(), 150, 10, .78) + group(burger(R.classic), 64, 70, .78); }, vb: '0 0 340 260' },
    { id: 'combo-double', cat: 'combo', name: 'Комбо Дабл', desc: 'Дабл Чиз, большая порция фри и ванильный шейк.', meta: '≈ 860 г', price: 89000, old: 95000, tag: 'Выгодно', wide: true, art: function () { return group(friesBox(), -10, 22, .78) + group(shake('vanilla'), 150, 6, .8) + group(burger(R.double), 64, 66, .8); }, vb: '0 0 340 260' },
    { id: 'combo-duo', cat: 'combo', name: 'Комбо на двоих', desc: 'Два бургера на выбор повара, 2 фри, наггетсы 6 шт и два лимонада.', meta: '≈ 1,6 кг', price: 159000, old: 176000, tag: 'На компанию', wide: true, art: function () { return group(lemonade(), 196, 14, .7) + group(friesBox(), -14, 30, .7) + group(burger(R.bacon), 24, 84, .68) + group(burger(R.classic), 128, 90, .68); }, vb: '0 0 340 260' },

    { id: 'fries', cat: 'snacks', name: 'Картофель фри', desc: 'Тонкий хрустящий фри с морской солью.', meta: '120 г · 340 ккал', price: 16000, art: function () { return friesBox(); } },
    { id: 'wedges', cat: 'snacks', name: 'Картофель по-деревенски', desc: 'Дольки в кожуре с паприкой и травами.', meta: '150 г · 380 ккал', price: 19000, art: function () { return wedges(); } },
    { id: 'nuggets', cat: 'snacks', name: 'Наггетсы', desc: 'Куриное филе в хрустящей панировке, 6 штук. Соус — на выбор.', meta: '120 г · 290 ккал', price: 24000, art: function () { return nuggets(); } },
    { id: 'rings', cat: 'snacks', name: 'Луковые кольца', desc: 'Сладкий лук в пивном кляре без алкоголя, 8 штук.', meta: '130 г · 360 ккал', price: 21000, art: function () { return onionRings(); } },

    { id: 'cola', cat: 'drinks', name: 'Кола', desc: 'Классическая газировка со льдом.', meta: '0,4 л', price: 9000, art: function () { return cup(); } },
    { id: 'lemonade', cat: 'drinks', name: 'Лимонад Лаб', desc: 'Домашний лимонад: лимон, мята, тростниковый сахар.', meta: '0,4 л', price: 14000, tag: 'Новинка', art: function () { return lemonade(); } },
    { id: 'shake-vanilla', cat: 'drinks', name: 'Шейк Ваниль', desc: 'Пломбир, молоко, ваниль и взбитые сливки.', meta: '0,4 л · 420 ккал', price: 24000, art: function () { return shake('vanilla'); } },
    { id: 'shake-strawberry', cat: 'drinks', name: 'Шейк Клубника', desc: 'Пломбир с клубничным пюре и вишенкой.', meta: '0,4 л · 440 ккал', price: 26000, art: function () { return shake('strawberry'); } },
    { id: 'shake-choco', cat: 'drinks', name: 'Шейк Шоколад', desc: 'Пломбир, какао, шоколадный топпинг и вафельная трубочка.', meta: '0,4 л · 480 ккал', price: 26000, art: function () { return shake('chocolate'); } },

    { id: 'sauce-lab', cat: 'sauces', name: 'Фирменный Лаб', desc: 'Сливочный соус с копчёной паприкой и огурчиками.', meta: '40 г', price: 5000, art: function () { return sauceCup({ color: '#ffb36b', band: '#111', label: 'LAB', ink: '#ffd23f', dip: 'fry' }); } },
    { id: 'sauce-cheese', cat: 'sauces', name: 'Сырный', desc: 'Тягучий соус на чеддере.', meta: '40 г', price: 5000, art: function () { return sauceCup({ color: '#ffc21a', band: '#ffd23f', label: 'CHEESE', ink: '#111', dip: 'nugget' }); } },
    { id: 'sauce-bbq', cat: 'sauces', name: 'Барбекю', desc: 'Дымный, сладковатый, с томатами.', meta: '40 г', price: 5000, art: function () { return sauceCup({ color: '#7a3417', band: '#7a3417', label: 'BBQ', dip: 'fry' }); } },
    { id: 'sauce-garlic', cat: 'sauces', name: 'Чесночный', desc: 'Йогурт, чеснок и укроп.', meta: '40 г', price: 5000, art: function () { return sauceCup({ color: '#fbf6e9', band: '#5cc23c', label: 'GARLIC', dip: 'nugget' }); } },
    { id: 'sauce-sriracha', cat: 'sauces', name: 'Шрирача', desc: 'Острый соус из перца чили. Осторожно, жжётся.', meta: '40 г', price: 6000, tag: 'Острый', hot: true, art: function () { return sauceCup({ color: '#e63b2e', band: '#e63b2e', label: 'HOT', dip: 'fry' }); } }
  ];
  var byId = {};
  P.forEach(function (p) { byId[p.id] = p; p.svg = svg(p.art(), 'Иллюстрация: ' + p.name, p.vb); });

  var FREE_FROM = 120000, FEE = 12000, KEY = 'burgerlab-cart-v1';

  /* =========================================================
     CART STATE
     ========================================================= */
  var cart = {};
  try {
    var raw = window.localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      Object.keys(parsed || {}).forEach(function (k) { var q = parseInt(parsed[k], 10); if (byId[k] && q > 0) cart[k] = Math.min(q, 99); });
    }
  } catch (e) { cart = {}; }
  function save() { try { window.localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } }
  function count() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k]; }, 0); }
  function subtotal() { return Object.keys(cart).reduce(function (s, k) { return s + cart[k] * byId[k].price; }, 0); }
  function fee(sub) { return sub === 0 || sub >= FREE_FROM ? 0 : FEE; }
  function plural(n, a, b, c) { var m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? b : c); }

  function setQty(id, q, src) {
    q = Math.max(0, Math.min(99, q));
    var prev = cart[id] || 0;
    if (q === 0) delete cart[id]; else cart[id] = q;
    save();
    renderAll();
    if (q > prev) {
      announce(byId[id].name + ' — в корзине, ' + q + ' шт.');
      if (src) fly(src); else bump();
    } else if (q < prev) {
      announce(q ? byId[id].name + ': ' + q + ' шт.' : byId[id].name + ' удалён из корзины');
    }
  }

  var live = $('#live');
  function announce(t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 30); }

  /* =========================================================
     HERO — exploded burger
     ========================================================= */
  var heroSpec = ['top', 'lettuce', 'tomato', 'cheese', 'patty', 'sauce:#ff9f43', 'bottom'];
  var heroLabels = ['Булочка бриошь', 'Салат айсберг', 'Томаты', 'Чеддер', 'Говядина 150 г', 'Соус Лаб', 'Нижняя булочка'];
  (function buildHero() {
    var el = $('#heroBurger'); if (!el) return;
    var lay = burgerLayout(heroSpec), n = lay.layers.length, mid = (n - 1) / 2;
    var oy = (500 - lay.total) / 2 - 10, out = '';
    out += '<g class="ly" style="--o:' + Math.round((n - 1 - mid) * 34 * 1.3) + '"><ellipse class="shadow" cx="240" cy="' + (oy + lay.total + 26) + '" rx="100" ry="9" fill="#111" opacity=".16"/></g>';
    for (var i = n - 1; i >= 0; i--) {
      var L = lay.layers[i], cy = L.y + oy + Math.min(L.t.vis, 30) / 2;
      var left = i % 2 === 0, o = Math.round((i - mid) * 34);
      var lbl = '<g class="lbl">' + (left
        ? '<path d="M136 ' + cy + ' H114" stroke="#111" stroke-width="2" stroke-dasharray="3 4"/><circle cx="136" cy="' + cy + '" r="4" fill="#111"/><text x="102" y="' + (cy + 4.5) + '" text-anchor="end">' + esc(heroLabels[i]) + '</text>'
        : '<path d="M344 ' + cy + ' H366" stroke="#111" stroke-width="2" stroke-dasharray="3 4"/><circle cx="344" cy="' + cy + '" r="4" fill="#111"/><text x="378" y="' + (cy + 4.5) + '">' + esc(heroLabels[i]) + '</text>') + '</g>';
      out += '<g class="ly" style="--o:' + o + '"><g class="bob" style="--i:' + i + '"><g transform="translate(120 ' + oy + ')">' + L.t.draw(L.y, L.o) + '</g>' + (i === n - 1 ? '' : lbl) + '</g></g>';
    }
    el.innerHTML = out;
    // white pill behind each label (re-measured once web fonts load)
    function pills() { $$('.lbl rect', el).forEach(function (r) { r.remove(); }); $$('.lbl text', el).forEach(pill); }
    pills();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(pills);
    function pill(t) {
      try {
        var bb = t.getBBox(); if (!bb.width) return;
        var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        r.setAttribute('x', bb.x - 10); r.setAttribute('y', bb.y - 5);
        r.setAttribute('width', bb.width + 20); r.setAttribute('height', bb.height + 10);
        r.setAttribute('rx', (bb.height + 10) / 2); r.setAttribute('fill', '#fff');
        r.setAttribute('stroke', '#111'); r.setAttribute('stroke-width', '2');
        t.parentNode.insertBefore(r, t);
      } catch (e) { /* hidden or unsupported */ }
    }
  })();

  /* =========================================================
     MARQUEE
     ========================================================= */
  var star = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1l2.6 7.4L22 11l-7.4 2.6L12 21l-2.6-7.4L2 11l7.4-2.6z" fill="#ffd23f"/></svg>';
  var star2 = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="#e63b2e"/><circle cx="12" cy="12" r="3" fill="#111"/></svg>';
  var promo = ['Бесплатная доставка от 120 000 сум', 'Комбо выгоднее до 17 000 сум', 'Готовим за 15 минут', 'Принимаем заказы до 03:00', 'Оплата Payme и Click'];
  var promo2 = ['Сочно', 'Горячо', 'Быстро', 'Burger Lab', 'Ташкент'];
  function fillBand(sel, items, icon) {
    var html = items.concat(items).map(function (t) { return '<span>' + esc(t) + '</span>' + icon; }).join('');
    $$(sel).forEach(function (el) { el.innerHTML = html; });
  }
  fillBand('[data-marquee]', promo, star);
  fillBand('[data-marquee2]', promo2, star2);

  /* =========================================================
     MAP
     ========================================================= */
  (function buildMap() {
    var el = $('#map'); if (!el) return;
    var s = '<defs><clipPath id="mapClip"><rect width="560" height="440" rx="22"/></clipPath></defs><g clip-path="url(#mapClip)">';
    s += '<rect width="560" height="440" fill="#fff4cc"/>';
    s += '<g transform="rotate(-9 280 220)">';
    for (var r = -2; r < 9; r++) for (var c = -2; c < 10; c++) {
      var x = c * 74 + (r % 2 ? 18 : 0), y = r * 58, w = 56 + ((r * 7 + c * 3) % 3) * 4;
      s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="42" rx="8" fill="' + (((r * 5 + c * 3) % 7 === 0) ? '#cfeab6' : '#ffe79c') + '"/>';
    }
    s += '</g>';
    s += '<path d="M-20 300 C 90 260, 160 330, 250 280 S 420 170, 600 210" stroke="#a9dcf3" stroke-width="16" fill="none" stroke-linecap="round"/>';
    s += '<path d="M-20 300 C 90 260, 160 330, 250 280 S 420 170, 600 210" stroke="#d6effa" stroke-width="4" fill="none" stroke-dasharray="10 14"/>';
    s += '<path d="M60 -20 L 210 460 M -20 120 L 600 40 M 380 -20 L 470 460 M -20 380 L 600 330" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round"/>';
    s += '<path d="M120 460 C 200 300, 360 260, 600 120" stroke="#fff" stroke-width="10" fill="none"/>';
    s += '<circle cx="290" cy="215" r="190" fill="#111" fill-opacity=".05" stroke="#111" stroke-width="2.5" stroke-dasharray="8 8"/>';
    s += '<circle cx="290" cy="215" r="105" fill="#e63b2e" fill-opacity=".14" stroke="#e63b2e" stroke-width="3" stroke-dasharray="8 7"/>';
    s += '<g font-family="Manrope, system-ui, sans-serif" font-weight="800" font-size="13">';
    s += '<g transform="translate(330 98)"><rect x="0" y="0" width="128" height="28" rx="14" fill="#e63b2e"/><text x="64" y="19" text-anchor="middle" fill="#fff">Зона 1 · 25–35 мин</text></g>';
    s += '<g transform="translate(46 36)"><rect x="0" y="0" width="128" height="28" rx="14" fill="#111"/><text x="64" y="19" text-anchor="middle" fill="#ffd23f">Зона 2 · 35–50 мин</text></g>';
    s += '</g>';
    var route = 'M290 215 C 330 250, 360 300, 420 320 S 470 360, 480 380';
    s += '<path id="routePath" d="' + route + '" stroke="#111" stroke-width="3.5" fill="none" stroke-dasharray="2 9" stroke-linecap="round"/>';
    s += '<g transform="translate(480 380)"><circle r="10" fill="#fff" stroke="#111" stroke-width="3"/><circle r="4" fill="#e63b2e"/></g>';
    s += '<g><circle r="14" fill="#111"/><path d="M-7 1c0-5 3-7.5 7-7.5s7 2.5 7 7.5z" fill="#ffd23f"/><rect x="-8" y="2.5" width="16" height="2.6" rx="1.3" fill="#e63b2e"/><path d="M-7 6.5h14v.5c0 1.5-1 2.5-2.5 2.5h-9c-1.5 0-2.5-1-2.5-2.5z" fill="#ffd23f"/>' +
      '<animateMotion dur="7s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .55 1" path="' + route + '"/></g>';
    s += '<circle class="pulse" cx="290" cy="208" r="18" fill="#e63b2e" opacity=".5"/>';
    s += '<g transform="translate(290 208)"><path d="M0 22 C -10 10, -24 2, -24 -12 A24 24 0 0 1 24 -12 C 24 2, 10 10, 0 22Z" fill="#111"/><circle cx="0" cy="-12" r="15" fill="#ffd23f"/><path d="M-9 -12c0-6 4-9 9-9s9 3 9 9z" fill="#111"/><rect x="-10" y="-10" width="20" height="3" rx="1.5" fill="#e63b2e"/><path d="M-9 -5h18v.6c0 2-1.4 3.4-3.4 3.4H-5.6c-2 0-3.4-1.4-3.4-3.4z" fill="#111"/></g>';
    s += '</g>';
    el.innerHTML = s;
    if (reduced && el.pauseAnimations) el.pauseAnimations();
  })();

  /* =========================================================
     MENU — filters + cards
     ========================================================= */
  var grid = $('#grid'), filtersEl = $('#filters'), current = 'all';
  var ICON_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';
  var ICON_MINUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';

  filtersEl.innerHTML = CATS.map(function (c) {
    var n = c.id === 'all' ? P.length : P.filter(function (p) { return p.cat === c.id; }).length;
    return '<button class="chip" type="button" data-cat="' + c.id + '" aria-pressed="' + (c.id === current) + '">' + c.name + ' <span class="n" aria-hidden="true">' + n + '</span></button>';
  }).join('');

  grid.innerHTML = P.map(function (p) {
    return '<article class="card reveal" data-id="' + p.id + '" data-cat="' + p.cat + '">' +
      '<div class="card-art' + (p.wide ? ' wide' : '') + '">' + (p.tag ? '<span class="card-tag' + (p.hot ? ' hot' : '') + '">' + esc(p.tag) + '</span>' : '') + p.svg + '</div>' +
      '<div class="card-body"><h3>' + esc(p.name) + '</h3><p class="card-desc">' + esc(p.desc) + '</p><p class="card-meta">' + esc(p.meta) + (p.old ? ' · <s>' + money(p.old) + '</s>' : '') + '</p>' +
      '<div class="card-foot"><span class="price">' + money(p.price).replace(NBSP + 'сум', '<small>сум</small>') + '</span><span class="card-action" data-action="' + p.id + '"></span></div></div></article>';
  }).join('');

  function renderCardActions() {
    $$('.card-action', grid).forEach(function (slot) {
      var id = slot.getAttribute('data-action'), q = cart[id] || 0, p = byId[id];
      var state = q ? 'q' + q : 'add';
      if (slot.getAttribute('data-state') === state) return;
      var hadFocus = slot.contains(document.activeElement), focusSel = hadFocus && document.activeElement.getAttribute('data-op');
      slot.setAttribute('data-state', state);
      slot.innerHTML = q
        ? '<span class="stepper" role="group" aria-label="Количество: ' + esc(p.name) + '"><button type="button" data-op="dec" aria-label="Убрать одну порцию">' + ICON_MINUS + '</button><output aria-live="off">' + q + '</output><button type="button" data-op="inc" aria-label="Добавить ещё одну">' + ICON_PLUS + '</button></span>'
        : '<button class="add-btn" type="button" data-op="add" aria-label="Добавить в корзину: ' + esc(p.name) + ', ' + money(p.price) + '">' + ICON_PLUS + '<span class="t">Добавить</span></button>';
      if (hadFocus) {
        var target = slot.querySelector('[data-op="' + focusSel + '"]') || slot.querySelector('[data-op="inc"]') || slot.querySelector('[data-op="add"]');
        if (target) target.focus();
      }
    });
  }

  grid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-op]'); if (!b) return;
    var id = b.closest('.card').getAttribute('data-id'), op = b.getAttribute('data-op'), q = cart[id] || 0;
    if (op === 'add' || op === 'inc') setQty(id, q + 1, b.closest('.card').querySelector('.card-art svg'));
    else if (op === 'dec') setQty(id, q - 1);
  });

  function setFilter(cat, scroll) {
    if (cat === current) return;
    current = cat;
    $$('.chip', filtersEl).forEach(function (c) {
      var on = c.getAttribute('data-cat') === cat;
      c.setAttribute('aria-pressed', on);
      if (on && c.scrollIntoView && filtersEl.scrollWidth > filtersEl.clientWidth) {
        filtersEl.scrollTo({ left: c.offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' });
      }
    });
    var cards = $$('.card', grid);
    var swap = function () {
      var i = 0;
      cards.forEach(function (c) {
        var show = cat === 'all' || c.getAttribute('data-cat') === cat;
        c.hidden = !show;
        c.classList.remove('pop');
        if (show) { c.classList.add('is-in'); c.style.setProperty('--d', Math.min(i++, 10) * 45 + 'ms'); }
      });
      grid.classList.remove('is-switching');
      if (!reduced) {
        void grid.offsetWidth;
        cards.forEach(function (c) { if (!c.hidden) c.classList.add('pop'); });
      }
      var top = grid.getBoundingClientRect().top;
      if (scroll || top < 0) {
        var y = window.scrollY + $('#menu .filters-bar').getBoundingClientRect().top - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) - 10;
        if (window.scrollY > y || scroll) window.scrollTo({ top: Math.max(0, y), behavior: reduced ? 'auto' : 'smooth' });
      }
    };
    if (reduced) swap();
    else { grid.classList.add('is-switching'); setTimeout(swap, 220); }
    var name = CATS.filter(function (c) { return c.id === cat; })[0].name;
    var n = cat === 'all' ? P.length : P.filter(function (p) { return p.cat === cat; }).length;
    announce(name + ': ' + n + ' ' + plural(n, 'позиция', 'позиции', 'позиций'));
  }
  filtersEl.addEventListener('click', function (e) {
    var c = e.target.closest('.chip'); if (c) setFilter(c.getAttribute('data-cat'));
  });
  $$('[data-filter-link]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var cat = a.getAttribute('data-filter-link');
      var y = window.scrollY + $('#menu').getBoundingClientRect().top;
      window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
      setTimeout(function () { setFilter(cat, true); }, reduced ? 0 : 500);
    });
  });

  /* =========================================================
     HEADER / CART BUTTON
     ========================================================= */
  var header = $('.header'), cartBtn = $('#cartBtn'), cartCount = $('#cartCount'), cartSum = $('#cartSum');
  var cartBar = $('#cartBar'), cartBarText = $('#cartBarText');
  function renderHeader() {
    var n = count(), sub = subtotal();
    cartCount.textContent = n > 99 ? '99+' : n;
    cartCount.classList.toggle('has', n > 0);
    cartSum.textContent = n ? money(sub) : 'Корзина';
    cartBtn.setAttribute('aria-label', 'Открыть корзину, товаров: ' + n + (n ? ', сумма ' + money(sub) : ''));
    var showBar = n > 0 && !drawerOpen;
    cartBar.classList.toggle('show', showBar);
    cartBar.setAttribute('aria-hidden', String(!showBar));
    cartBar.tabIndex = showBar ? 0 : -1;
    document.body.classList.toggle('has-bar', showBar);
    cartBarText.textContent = n + ' ' + plural(n, 'товар', 'товара', 'товаров') + ' · ' + money(sub + fee(sub));
  }
  function bump() {
    [cartBtn].forEach(function (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
  }
  function fly(src) {
    if (reduced || !src) return bump();
    var target = cartBtn;
    var tb = target.getBoundingClientRect();
    if (cartBar.classList.contains('show') && window.innerWidth < 900) {
      // on mobile the header button is always visible; prefer it unless offscreen
      if (tb.bottom < 0) target = cartBar;
    }
    var a = src.getBoundingClientRect(), b = target.getBoundingClientRect();
    var x0 = a.left + a.width / 2, y0 = a.top + a.height / 2, x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    var outer = document.createElement('div'); outer.className = 'fly';
    var inner = document.createElement('div'); inner.className = 'fly-y';
    inner.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5z" fill="#ffd23f"/><rect x="3" y="12.5" width="18" height="3" rx="1.5" fill="#111"/><path d="M4 17h16v.5c0 1.5-1.2 2.5-2.7 2.5H6.7C5.2 20 4 19 4 17.5z" fill="#ffd23f"/></svg>';
    outer.appendChild(inner); document.body.appendChild(outer);
    var dur = 780;
    outer.animate([{ transform: 'translate(' + x0 + 'px,0)' }, { transform: 'translate(' + x1 + 'px,0)' }], { duration: dur, easing: 'cubic-bezier(.3,.1,.5,1)', fill: 'forwards' });
    var ya = inner.animate([
      { transform: 'translateY(' + y0 + 'px) scale(.4)', opacity: 0 },
      { transform: 'translateY(' + (Math.min(y0, y1) - 90) + 'px) scale(1.15)', opacity: 1, offset: .38 },
      { transform: 'translateY(' + y1 + 'px) scale(.45)', opacity: 1 }
    ], { duration: dur, easing: 'cubic-bezier(.45,0,.55,1)', fill: 'forwards' });
    ya.onfinish = function () { outer.remove(); bump(); };
  }

  var lastY = -1;
  function onScroll() {
    var y = window.scrollY;
    if ((y > 10) !== (lastY > 10)) header.classList.toggle('is-scrolled', y > 10);
    lastY = y;
    heroScroll(y);
  }

  /* hero explode on scroll + parallax floats */
  var heroArt = $('#heroArt'), heroSvg = $('#heroBurger'), floats = $$('.float'), heroEl = $('#hero');
  var baseE = 0, heroTick = false;
  function heroScroll(y) {
    if (!heroSvg || heroTick) return;
    heroTick = true;
    requestAnimationFrame(function () {
      heroTick = false;
      var h = heroEl.offsetHeight || 1;
      var p = Math.max(0, Math.min(1, y / (h * .7)));
      var e = reduced ? .62 : baseE + p * .55;
      heroSvg.style.setProperty('--e', e.toFixed(3));
      if (!reduced) floats.forEach(function (f) { f.style.transform = 'translateY(' + (-p * (+f.getAttribute('data-depth') || 30)) + 'px)'; });
    });
  }

  /* =========================================================
     DRAWER
     ========================================================= */
  var drawer = $('#cart'), overlay = $('#overlay'), drawerOpen = false, lastFocus = null, view = 'cart';
  var mainEls = [$('#main'), $('.header'), $('.footer'), $('.studio-badge'), cartBar, $('.skip')];

  function openDrawer(v) {
    if (drawerOpen) return;
    drawerOpen = true;
    lastFocus = document.activeElement;
    closeNav();
    setView(v || 'cart', true);
    drawer.classList.add('open'); overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('no-scroll');
    mainEls.forEach(function (el) { if (el) el.setAttribute('inert', ''); });
    renderHeader();
    setTimeout(function () { var f = focusables()[0]; if (f) f.focus({ preventScroll: true }); }, reduced ? 0 : 80);
  }
  function closeDrawer() {
    if (!drawerOpen) return;
    drawerOpen = false;
    drawer.classList.remove('open'); overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('no-scroll');
    mainEls.forEach(function (el) { if (el) el.removeAttribute('inert'); });
    renderHeader();
    if (view === 'success') setTimeout(function () { setView('cart'); }, 600);
    if (lastFocus && lastFocus.focus && document.contains(lastFocus) && !lastFocus.closest('[aria-hidden="true"]')) lastFocus.focus({ preventScroll: true });
    else cartBtn.focus({ preventScroll: true });
  }
  function focusables() {
    return $$('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])', drawer).filter(function (el) {
      return !el.disabled && el.offsetParent !== null && !el.closest('[hidden]');
    });
  }
  var titles = { cart: 'Корзина', checkout: 'Оформление', success: 'Готово' };
  function setView(v, instant) {
    view = v;
    $$('.view[data-view]', drawer).forEach(function (s) {
      var on = s.getAttribute('data-view') === v;
      s.hidden = !on;
      s.classList.remove('enter');
      if (on && !instant) { void s.offsetWidth; s.classList.add('enter'); }
      if (on && instant && v === 'success') s.classList.add('enter');
    });
    $('#cartTitle').textContent = titles[v];
    $('#backBtn').hidden = v !== 'checkout';
    if (v === 'checkout') renderMiniSum();
  }

  cartBtn.addEventListener('click', function () { openDrawer('cart'); });
  cartBar.addEventListener('click', function () { openDrawer('cart'); });
  $('#closeBtn').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  $('#toMenuBtn').addEventListener('click', function () { closeDrawer(); goMenu(); });
  $('#doneBtn').addEventListener('click', function () { closeDrawer(); goMenu(); });
  $('#backBtn').addEventListener('click', function () { setView('cart'); $('#checkoutBtn').focus(); });
  $('#checkoutBtn').addEventListener('click', function () {
    if (!count()) return;
    setView('checkout');
    setTimeout(function () { $('#fName').focus(); }, reduced ? 0 : 60);
  });
  function goMenu() {
    var m = $('#menu'); if (!m) return;
    window.scrollTo({ top: window.scrollY + m.getBoundingClientRect().top, behavior: reduced ? 'auto' : 'smooth' });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (drawerOpen) { e.preventDefault(); closeDrawer(); }
      else if (nav.classList.contains('open')) { closeNav(); menuToggle.focus(); }
    }
    if (e.key === 'Tab' && drawerOpen) {
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* cart rendering */
  var cartList = $('#cartList'), cartEmpty = $('#cartEmpty'), ship = $('#ship'), sumRows = $('#sumRows'), cartFoot = $('#cartFoot');
  function renderCart() {
    var ids = Object.keys(cart), sub = subtotal(), f = fee(sub);
    cartEmpty.hidden = ids.length > 0;
    ship.hidden = ids.length === 0;
    cartFoot.hidden = ids.length === 0;
    // list — keep existing rows to avoid re-animating
    var existing = {};
    $$('.ci', cartList).forEach(function (li) { existing[li.getAttribute('data-id')] = li; });
    ids.forEach(function (id) {
      var p = byId[id], q = cart[id], li = existing[id];
      if (!li) {
        li = document.createElement('li'); li.className = 'ci'; li.setAttribute('data-id', id);
        li.innerHTML = '<div class="ci-art">' + p.svg + '</div><div><div class="ci-name">' + esc(p.name) + '</div><div class="ci-price">' + money(p.price) + ' / шт.</div>' +
          '<div class="ci-actions"><span class="stepper" role="group" aria-label="Количество: ' + esc(p.name) + '"><button type="button" data-op="dec" aria-label="Уменьшить количество">' + ICON_MINUS + '</button><output></output><button type="button" data-op="inc" aria-label="Увеличить количество">' + ICON_PLUS + '</button></span>' +
          '<button class="ci-remove" type="button" data-op="del" aria-label="Удалить ' + esc(p.name) + ' из корзины">Удалить</button></div></div>' +
          '<div class="ci-right"><span class="ci-total"></span></div>';
        cartList.appendChild(li);
      }
      li.querySelector('output').textContent = q;
      li.querySelector('.ci-total').textContent = money(p.price * q);
      delete existing[id];
    });
    Object.keys(existing).forEach(function (id) {
      var li = existing[id];
      var hadFocus = li.contains(document.activeElement);
      li.remove();
      if (hadFocus) { var f2 = focusables()[0]; if (f2) f2.focus(); }
    });

    // free-delivery progress
    var left = Math.max(0, FREE_FROM - sub), pct = Math.min(100, sub / FREE_FROM * 100);
    var scoot = '<svg class="ship-scooter" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="17" r="3" fill="#111"/><circle cx="18" cy="17" r="3" fill="#111"/><path d="M6 14h7l3-6h3l-2 6" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="4" y="7" width="7" height="6" rx="1" fill="#e63b2e"/></svg>';
    ship.classList.toggle('done', left === 0);
    ship.innerHTML = scoot + (left === 0
      ? 'Ура! <b>Доставка бесплатная</b>'
      : 'До бесплатной доставки осталось <b>' + money(left) + '</b>') +
      '<div class="ship-bar" role="progressbar" aria-label="Прогресс до бесплатной доставки" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"><i style="width:' + pct + '%"></i></div>';

    sumRows.innerHTML = '<div><span>Товары (' + count() + ')</span><span>' + money(sub) + '</span></div>' +
      '<div><span>Доставка</span><span class="' + (f ? '' : 'free') + '">' + (f ? money(f) : 'бесплатно') + '</span></div>' +
      '<div class="total"><span>Итого</span><span>' + money(sub + f) + '</span></div>';
    $('#submitBtn').textContent = 'Подтвердить · ' + money(sub + f);
    if (view === 'checkout') renderMiniSum();
    if (!ids.length && view === 'checkout') setView('cart');
  }
  cartList.addEventListener('click', function (e) {
    var b = e.target.closest('[data-op]'); if (!b) return;
    var id = b.closest('.ci').getAttribute('data-id'), q = cart[id] || 0, op = b.getAttribute('data-op');
    if (op === 'inc') setQty(id, q + 1);
    else if (op === 'dec') setQty(id, q - 1);
    else if (op === 'del') setQty(id, 0);
  });
  function renderMiniSum() {
    var sub = subtotal(), f = fee(sub);
    $('#miniSum').innerHTML = Object.keys(cart).map(function (id) {
      return '<li><span>' + esc(byId[id].name) + ' × ' + cart[id] + '</span><span>' + money(byId[id].price * cart[id]) + '</span></li>';
    }).join('') + '<li><span>Доставка</span><span>' + (f ? money(f) : 'бесплатно') + '</span></li>' +
      '<li style="font-weight:800;border-top:1.5px dashed rgba(17,17,17,.15);margin-top:6px;padding-top:8px"><span style="color:#111">Итого</span><span>' + money(sub + f) + '</span></li>';
  }

  function renderAll() { renderHeader(); renderCardActions(); renderCart(); }

  /* =========================================================
     CHECKOUT FORM
     ========================================================= */
  var form = $('#orderForm'), phone = $('#fPhone');
  function digits(v) {
    var t = v.trim(), d, k = t.indexOf('+998');
    if (k > -1) d = (t.slice(0, k) + t.slice(k + 4)).replace(/\D/g, '');
    else { d = t.replace(/\D/g, ''); if (d.length > 9 && d.indexOf('998') === 0) d = d.slice(3); }
    if (d.length > 9 && d.indexOf('998') === 0) d = d.slice(3);
    return d.slice(0, 9);
  }
  function maskDigits(d) {
    if (!d.length) return '+998 ';
    var out = '+998 (' + d.slice(0, 2);
    if (d.length > 2) out += ') ' + d.slice(2, 5);
    if (d.length > 5) out += '-' + d.slice(5, 7);
    if (d.length > 7) out += '-' + d.slice(7, 9);
    return out;
  }
  var prevPhone = '';
  function caretEnd() { try { var l = phone.value.length; phone.setSelectionRange(l, l); } catch (e) { /* noop */ } }
  phone.addEventListener('focus', function () {
    if (!phone.value) { phone.value = prevPhone = '+998 '; caretEnd(); requestAnimationFrame(caretEnd); }
  });
  phone.addEventListener('blur', function () { if (!digits(phone.value).length) phone.value = prevPhone = ''; });
  phone.addEventListener('input', function (e) {
    var d = digits(phone.value);
    var isDel = e.inputType && e.inputType.indexOf('delete') === 0;
    if (isDel && d.length === digits(prevPhone).length && d.length) d = d.slice(0, -1);
    phone.value = prevPhone = maskDigits(d);
    clearErr('phone');
  });
  ['name', 'address'].forEach(function (n) { form.elements[n].addEventListener('input', function () { clearErr(n); }); });

  function fieldEl(n) { return form.querySelector('[data-field="' + n + '"]'); }
  function setErr(n, on) {
    var f = fieldEl(n), input = f.querySelector('input, textarea');
    f.classList.toggle('invalid', on);
    input.setAttribute('aria-invalid', on ? 'true' : 'false');
    if (on && !reduced) { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }
  }
  function clearErr(n) { if (fieldEl(n).classList.contains('invalid')) setErr(n, false); }
  function validate() {
    var ok = {
      name: form.elements.name.value.trim().length >= 2,
      phone: digits(phone.value).length === 9,
      address: form.elements.address.value.trim().length >= 5
    };
    var firstBad = null;
    ['name', 'phone', 'address'].forEach(function (n) { setErr(n, !ok[n]); if (!ok[n] && !firstBad) firstBad = n; });
    return firstBad;
  }
  var PAY = { cash: 'наличные', card: 'карта курьеру', payme: 'Payme', click: 'Click' };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = validate();
    if (bad) {
      var el = fieldEl(bad).querySelector('input, textarea'); el.focus();
      announce('Проверьте поле: ' + fieldEl(bad).querySelector('label').textContent);
      return;
    }
    var btn = $('#submitBtn'), sub = subtotal(), total = sub + fee(sub);
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" aria-hidden="true"></span>Отправляем…';
    setTimeout(function () {
      var no = 'BL-' + String(Math.floor(1000 + Math.random() * 9000));
      var name = form.elements.name.value.trim().split(/\s+/)[0];
      $('#successTitle').textContent = 'Спасибо, ' + name + '!';
      $('#orderNo').textContent = '№ ' + no;
      $('#etaTime').textContent = 'Доставка ≈ 30–40 мин';
      $('#etaPay').textContent = 'К оплате ' + money(total) + ' · ' + PAY[form.elements.pay.value];
      cart = {}; save();
      form.reset();
      btn.disabled = false;
      setView('success');
      renderAll();
      announce('Заказ ' + no + ' принят. Это демо.');
      $('#successBox').focus({ preventScroll: true });
    }, reduced ? 300 : 1100);
  });

  /* =========================================================
     MOBILE NAV
     ========================================================= */
  var nav = $('#nav'), menuToggle = $('#menuToggle');
  function closeNav() { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Открыть меню навигации'); }
  menuToggle.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Закрыть меню навигации' : 'Открыть меню навигации');
    header.classList.toggle('is-scrolled', open || window.scrollY > 10);
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !e.target.closest('#nav') && !e.target.closest('#menuToggle')) closeNav();
  });

  /* =========================================================
     REVEAL
     ========================================================= */
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    $$('.reveal').forEach(function (el, i) {
      if (el.classList.contains('card')) el.style.setProperty('--rd', (i % 4) * .06 + 's');
      io.observe(el);
    });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* =========================================================
     INIT
     ========================================================= */
  renderAll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { heroScroll(window.scrollY); }, { passive: true });
  onScroll();
  requestAnimationFrame(function () {
    document.body.classList.add('is-loaded');
    setTimeout(function () { baseE = .55; heroScroll(window.scrollY); }, reduced ? 0 : 350);
  });
})();
