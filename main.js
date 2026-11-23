/* Raqam Studio — site interactions */
(function () {
  'use strict';

  // Where the contact form sends requests (FormSubmit, no backend needed).
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/sherzodbobojonov077';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ------------------------------------------------------------------ */
  /* Case studies                                                        */
  /* ------------------------------------------------------------------ */
  const CASES = {
    bysohiba: {
      kind: 'real',
      title: 'bysohiba couture',
      eyebrow: 'Проект 01 · Мода',
      lead: 'Сайт бренда вечерних платьев в Ташкенте. Платье можно взять в аренду, купить или сшить на заказ, а записаться на примерку — прямо с сайта.',
      facts: [['Клиент', 'bysohiba couture'], ['Тип', 'Сайт бренда и каталог'], ['Языки', 'RU · UZ'], ['Платформа', 'Веб, адаптив']],
      task: 'Платья бренда — штучные, многие в единственном экземпляре. Сайт должен передать уровень кутюрного бренда, показать коллекцию и привести девушку на примерку, а не в долгую переписку в директе.',
      solution: 'Светлая палитра цвета шампанского и кофе, крупная антиква и арочные кадры, как в зеркале примерочной. Каталог с метками «1 of 1» и Limited Edition, разделы аренды, продажи и пошива, часы работы и заметная кнопка «Записаться на примерку» на каждом экране.',
      features: [
        ['Каталог платьев', 'Карточки с фото, названием и метками «1 of 1» и Limited Edition.'],
        ['Аренда, продажа и пошив', 'Три сценария на отдельных страницах, чтобы клиентка сразу нашла свой.'],
        ['Запись на примерку', 'Главное действие сайта всегда под рукой — в шапке и на первом экране.'],
        ['Два языка', 'Русский и узбекский с переключателем RU · UZ.'],
      ],
      gallery: ['assets/work/bysohiba-hero.webp', 'assets/work/bysohiba-catalog.webp'],
      links: [],
    },
    orchestra: {
      kind: 'real',
      title: 'Национальный оркестр',
      eyebrow: 'Проект 02 · Госсектор и культура',
      lead: 'Официальный сайт Национального оркестра Филармонии Узбекистана. Проект сделан для Министерства культуры Республики Узбекистан.',
      facts: [['Заказчик', 'Министерство культуры РУз'], ['Тип', 'Официальный сайт'], ['Сфера', 'Культура'], ['Платформа', 'Веб, адаптив']],
      task: 'Оркестру нужен официальный сайт, который достойно представляет коллектив государственного уровня и даёт зрителям и партнёрам понятный источник информации.',
      solution: 'Сделали официальный сайт оркестра в торжественном классическом стиле, адаптированный под телефоны и компьютеры.',
      features: [],
      links: [],
    },
  };
  const CASE_ORDER = ['bysohiba', 'orchestra'];

  /* ------------------------------------------------------------------ */
  /* Clock                                                               */
  /* ------------------------------------------------------------------ */
  const fmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tashkent' });
  const tick = () => { const s = fmt.format(new Date()); $$('.js-time').forEach((el) => { el.textContent = s; }); };
  tick(); setInterval(tick, 15000);

  /* ------------------------------------------------------------------ */
  /* Smooth scroll                                                       */
  /* ------------------------------------------------------------------ */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.stop();
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : -70, duration: 1.6 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      setMenu(false);
      scrollToTarget(target);
    });
  });

  /* ------------------------------------------------------------------ */
  /* Header + menu                                                       */
  /* ------------------------------------------------------------------ */
  const header = $('.header');
  let lastY = 0;
  function onScroll(y) {
    header.classList.toggle('is-scrolled', y > 20);
    lastY = y;
  }

  const burger = $('.burger');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    $('.menu').setAttribute('aria-hidden', String(!open));
    if (lenis) { if (open) lenis.stop(); else if (!openCase) lenis.start(); }
  }
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));

  /* ------------------------------------------------------------------ */
  /* Parallax                                                            */
  /* ------------------------------------------------------------------ */
  const parallaxEls = $$('[data-parallax]');
  function updateParallax() {
    if (reduceMotion) return;
    const vh = window.innerHeight;
    for (const el of parallaxEls) {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const d = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
      el.style.translate = `0 ${d.toFixed(1)}px`;
    }
  }

  function frame(time) {
    if (lenis) lenis.raf(time);
    updateParallax();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

  /* ------------------------------------------------------------------ */
  /* Reveal                                                              */
  /* ------------------------------------------------------------------ */
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  function observeReveals() {
    // stagger siblings that enter together
    $$('.stats, .svc, .steps, .why__grid, .faq__list, .concept-grid').forEach((group) => {
      $$('[data-reveal]', group).forEach((el, i) => el.style.setProperty('--d', `${(i % 4) * 0.08}s`));
    });
    $$('[data-reveal]').forEach((el) => io.observe(el));
    io.observe($('.contact__top'));
  }

  /* ------------------------------------------------------------------ */
  /* Cursor + magnetic                                                   */
  /* ------------------------------------------------------------------ */
  if (finePointer) {
    const cursor = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', (e) => {
      const view = e.target.closest('[data-cursor="view"]');
      const link = !view && e.target.closest('a, button, label.chip, .svc__item, .case__next, summary');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-link', !!link);
    });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

    $$('[data-magnetic]').forEach((el) => {
      const strength = el.classList.contains('totop') ? 0.45 : 0.3;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.transition = 'transform .2s ease-out';
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)';
        el.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* FAQ: one answer open at a time                                      */
  /* ------------------------------------------------------------------ */
  $$('.faq__item').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) $$('.faq__item').forEach((o) => { if (o !== d) o.open = false; });
  }));

  /* ------------------------------------------------------------------ */
  /* Case study overlay                                                  */
  /* ------------------------------------------------------------------ */
  const caseEl = $('.case'), caseContent = $('#caseContent'), casePanel = $('.case__panel');
  let openCase = null, lastFocus = null;

  function renderCase(id) {
    const c = CASES[id];
    const nextId = CASE_ORDER[(CASE_ORDER.indexOf(id) + 1) % CASE_ORDER.length];
    let media;
    if (c.kind === 'concept') {
      media = document.createElement('div');
      media.className = 'project__media';
      media.setAttribute('style', c.media);
      media.innerHTML = `<div class="browser"><div class="browser__bar"><span></span><span></span><span></span><em>${esc(c.title)}</em></div><img src="assets/work/${id}-desktop.webp" alt="${esc(c.title)} — компьютер"></div>` +
        `<div class="phone phone--float"><img src="assets/work/${id}-mobile.webp" alt="${esc(c.title)} — телефон"></div>`;
    } else {
      media = $(`[data-case="${id}"] .project__media`).cloneNode(true);
    }
    media.classList.add('case__hero');
    $$('[data-parallax]', media).forEach((n) => { n.style.translate = ''; n.removeAttribute('data-parallax'); });
    $$('img', media).forEach((n) => n.removeAttribute('loading'));

    caseContent.innerHTML = `
      <div>
        <p class="case__eyebrow">${esc(c.eyebrow)}</p>
        <h2 class="case__title" id="caseTitle">${esc(c.title)}</h2>
        <p class="case__lead">${esc(c.lead)}</p>
      </div>
      <dl class="case__facts">
        ${c.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
      </dl>
      <div class="js-hero-slot"></div>
      <div class="case__cols">
        <div><h3>Задача</h3><p>${esc(c.task)}</p></div>
        <div><h3>Решение</h3><p>${esc(c.solution)}</p></div>
      </div>
      ${c.features.length ? `<div class="case__features">
        ${c.features.map(([b, s]) => `<div class="case__feature"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join('')}
      </div>` : ''}
      ${c.gallery ? `<div class="case__gallery">${c.gallery.map((g) => `<figure><img src="${g}" alt="${esc(c.title)}"></figure>`).join('')}</div>` : ''}
      ${c.stack ? `<p class="case__eyebrow">Технологии</p><ul class="case__stack">${c.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      <div class="case__actions">
        ${c.kind === 'concept' ? `<a class="btn btn--light" href="demos/${id}/index.html" target="_blank" rel="noopener"><span>Открыть демо-сайт</span><i class="btn__arrow">↗</i></a>` : ''}
        ${(c.links || []).map((l) => `<a class="btn btn--light" href="${l.href}" target="_blank" rel="noopener"><span>${esc(l.label)}</span><i class="btn__arrow">↗</i></a>`).join('')}
        <a class="btn btn--accent js-case-contact" href="#contact"><span>${c.kind === 'concept' ? 'Хочу такой сайт' : 'Обсудить похожий проект'}</span><i class="btn__arrow">→</i></a>
      </div>
      ${c.kind === 'concept' ? '<p class="case__demo-note">Это концепт: заведение вымышленное, а все функции на демо-сайте работают по-настоящему.</p>' : ''}
      <div class="case__next" role="button" tabindex="0">
        <div><small>Следующий проект</small><strong>${esc(CASES[nextId].title)}</strong></div>
        <i class="btn__arrow">→</i>
      </div>`;
    $('.js-hero-slot', caseContent).replaceWith(media);
    const video = $('video', media);
    if (video) { video.preload = 'auto'; video.muted = true; if (!reduceMotion) video.play().catch(() => {}); }

    $('.js-case-contact', caseContent).addEventListener('click', (e) => {
      e.preventDefault();
      closeCase();
      setTimeout(() => scrollToTarget($('#contact')), 500);
    });
    const nx = $('.case__next', caseContent);
    const goNext = () => {
      casePanel.scrollTo({ top: 0, behavior: 'auto' });
      openCase = nextId;
      renderCase(nextId);
      history.replaceState(null, '', `#case/${nextId}`);
    };
    nx.addEventListener('click', goNext);
    nx.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goNext(); } });
  }

  function showCase(id, push = true) {
    if (!CASES[id]) return;
    lastFocus = document.activeElement;
    openCase = id;
    renderCase(id);
    casePanel.scrollTop = 0;
    caseEl.classList.add('is-open');
    caseEl.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
    if (push) history.pushState({ case: id }, '', `#case/${id}`);
    setTimeout(() => $('.case__close').focus({ preventScroll: true }), 400);
  }

  function closeCase(fromPop = false) {
    if (!openCase) return;
    openCase = null;
    caseEl.classList.remove('is-open');
    caseEl.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
    if (!fromPop && location.hash.startsWith('#case/')) history.pushState(null, '', location.pathname + location.search);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  $$('[data-case]').forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Открыть кейс ${CASES[card.dataset.case].title}`);
    card.addEventListener('click', (e) => { if (!e.target.closest('a')) showCase(card.dataset.case); });
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showCase(card.dataset.case); } });
  });
  $$('[data-close]').forEach((el) => el.addEventListener('click', () => closeCase()));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (openCase) closeCase(); else setMenu(false); }
  });
  window.addEventListener('popstate', () => {
    const m = location.hash.match(/^#case\/([\w-]+)/);
    if (m) showCase(m[1], false); else closeCase(true);
  });

  /* ------------------------------------------------------------------ */
  /* Contact form                                                        */
  /* ------------------------------------------------------------------ */
  const form = $('#contactForm');
  const status = $('.form__status', form);
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    if (fd.get('_honey')) return;
    const name = String(fd.get('name') || '').trim();
    const contact = String(fd.get('contact') || '').trim();
    $$('.field', form).forEach((f) => f.classList.remove('is-invalid'));
    if (!name || !contact) {
      if (!name) form.elements.name.closest('.field').classList.add('is-invalid');
      if (!contact) form.elements.contact.closest('.field').classList.add('is-invalid');
      status.className = 'form__status is-err';
      status.textContent = 'Заполните имя и контакт, чтобы мы могли ответить.';
      return;
    }
    const label = $('.js-submit-label', form);
    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    label.textContent = 'Отправляем…';
    status.className = 'form__status';
    status.textContent = '';
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Raqam — новая заявка от ${name}`,
          _template: 'table',
          name,
          contact,
                    need: fd.getAll('type').join(', ') || '—',
          message: String(fd.get('message') || '').trim() || '—',
          source: 'Сайт Raqam',
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      status.className = 'form__status is-ok';
      status.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
      form.reset();
    } catch (err) {
      status.className = 'form__status is-err';
      status.textContent = 'Не получилось отправить. Попробуйте ещё раз чуть позже.';
    } finally {
      btn.disabled = false;
      label.textContent = 'Отправить заявку';
    }
  });

  /* ------------------------------------------------------------------ */
  /* Loader → start                                                      */
  /* ------------------------------------------------------------------ */
  const countEl = $('#loaderCount'), bar = $('#loaderBar');
  const minTime = reduceMotion ? 0 : 1400;
  const t0 = performance.now();
  let loaded = document.readyState === 'complete';
  window.addEventListener('load', () => { loaded = true; });
  const hardStop = t0 + 3500;

  function loaderTick(now) {
    const p = Math.min(1, (now - t0) / Math.max(1, minTime));
    // hold at 90% until the page has loaded (or the hard stop hits)
    const v = Math.min(p, loaded || now > hardStop ? 1 : 0.9);
    const eased = 1 - Math.pow(1 - v, 3);
    countEl.textContent = Math.round(eased * 100);
    bar.style.transform = `scaleX(${eased})`;
    if (v < 1) requestAnimationFrame(loaderTick);
    else start();
  }
  requestAnimationFrame(loaderTick);

  function start() {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
    if (lenis) lenis.start();
    observeReveals();
    setTimeout(() => { $('.loader').style.display = 'none'; }, 1300);
    const m = location.hash.match(/^#case\/([\w-]+)/);
    if (m) setTimeout(() => showCase(m[1], false), 600);
  }
})();
