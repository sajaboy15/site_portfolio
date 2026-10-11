/* SAJA BOYS — portfolio interactions */
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
    oshxona: {
      title: "Oshxona Navro'z",
      eyebrow: 'Концепт 01 · Ресторан',
      lead: 'Сайт ресторана узбекской кухни. Задача — передать атмосферу чайханы, показать меню с ценами и дать гостю два простых действия: заказать доставку или забронировать стол.',
      facts: [['Тип', 'Ресторан'], ['Функции', 'Меню, доставка, бронь'], ['Платформа', 'Веб, адаптив'], ['Статус', 'Концепт']],
      task: 'Гости ищут ресторан в телефоне: им нужно быстро увидеть меню, цены, адрес и часы работы. Если для этого надо писать в директ или звонить, часть гостей уходит к конкурентам.',
      solution: 'Тёплая палитра — глубокий синий, шафран и терракота, узбекский орнамент и иллюстрации блюд. Меню разбито на категории, блюда добавляются в заказ в один тап. Форма брони собирает дату, время и количество гостей.',
      features: [
        ['Меню по категориям', 'Плов, шашлык, самса, супы, салаты и напитки с ценами и весом.'],
        ['Заказ доставки', 'Корзина с количеством и итоговой суммой — заказ уходит в Telegram ресторана.'],
        ['Бронирование стола', 'Дата, время, число гостей и комментарий. Без звонков и потерянных заявок.'],
        ['Часы и адрес', 'Время работы, адрес и зона доставки всегда под рукой.'],
      ],
    },
    'tong-coffee': {
      title: 'Tong Coffee',
      eyebrow: 'Концепт 02 · Кофейня',
      lead: 'Сайт для кофейни, где гость заказывает напиток заранее и забирает его без очереди. Плюс карта лояльности прямо на сайте — седьмой кофе в подарок.',
      facts: [['Тип', 'Кофейня'], ['Функции', 'Предзаказ, лояльность'], ['Платформа', 'Веб, адаптив'], ['Статус', 'Концепт']],
      task: 'Утром у кофейни очередь, и часть гостей просто проходит мимо. Нужно, чтобы человек мог заказать по дороге и забрать готовый напиток, а ещё — возвращался снова.',
      solution: 'Яркий игривый стиль: кремовый, эспрессо и оранжевый. Меню с фильтрами и переключателем размера, где цена меняется сразу. Предзаказ со временем самовывоза и интерактивная карта лояльности со штампами.',
      features: [
        ['Меню с размерами', 'S, M, L — цена пересчитывается мгновенно.'],
        ['Заказ заранее', 'Гость выбирает время, бариста получает заказ и готовит к его приходу.'],
        ['Карта лояльности', '7 штампов — и кофе за счёт заведения.'],
        ['Атмосфера', 'Анимированная чашка с паром и зёрна, которые реагируют на курсор.'],
      ],
    },
    'burger-lab': {
      title: 'Burger Lab',
      eyebrow: 'Концепт 03 · Доставка',
      lead: 'Сайт доставки с полноценным онлайн-заказом: корзина, бесплатная доставка от суммы, адрес, оплата Payme, Click или наличными — без звонков и агрегаторов.',
      facts: [['Тип', 'Доставка еды'], ['Функции', 'Корзина, оплата'], ['Платформа', 'Веб, адаптив'], ['Статус', 'Концепт']],
      task: 'Агрегаторы забирают процент с каждого заказа, а приём заказов через Instagram отнимает время у администратора и приводит к ошибкам.',
      solution: 'Смелый жёлто-чёрный стиль и сочные иллюстрации бургеров. Меню с фильтрами, корзина с прогрессом до бесплатной доставки и оформление в одной панели. Корзина сохраняется, даже если гость закрыл страницу.',
      features: [
        ['Корзина и комбо', 'Добавление в один тап, количество, удаление, итог.'],
        ['Бесплатная доставка', 'Полоса прогресса подсказывает, сколько осталось до бесплатной доставки — средний чек растёт.'],
        ['Оплата', 'Наличные, карта, Payme или Click на выбор.'],
        ['Заказ в Telegram', 'Готовый заказ с адресом и телефоном приходит на кухню.'],
      ],
    },
    kiyim: {
      title: 'KIYIM',
      eyebrow: 'Концепт 04 · Интернет-магазин',
      lead: 'Интернет-магазин одежды в минималистичном стиле: каталог с фильтрами и сортировкой, выбор цвета и размера, избранное, корзина и оформление заказа с доставкой по Ташкенту.',
      facts: [['Тип', 'Магазин одежды'], ['Функции', 'Каталог, корзина'], ['Платформа', 'Веб, адаптив'], ['Статус', 'Концепт']],
      task: 'Продажи через Instagram упираются в переписку: «есть ли размер M?», «а в чёрном?», «сколько доставка?». Магазину нужна витрина, где покупатель сам находит ответ и оформляет заказ.',
      solution: 'Чистая редакционная типографика и спокойная палитра, чтобы главным был товар. Цвет меняется прямо на карточке, быстрый просмотр показывает размеры и наличие, корзина считает бесплатную доставку.',
      features: [
        ['Каталог и фильтры', 'Категории, сортировка по цене и популярности.'],
        ['Цвета и размеры', 'Свотчи перекрашивают товар, отсутствующие размеры недоступны.'],
        ['Избранное и корзина', 'Сохраняются в браузере покупателя.'],
        ['Оформление', 'Курьер или самовывоз, Payme, Click или наличные.'],
      ],
    },
  };
  const CASE_ORDER = ['oshxona', 'tong-coffee', 'burger-lab', 'kiyim'];

  /* ------------------------------------------------------------------ */
  /* Showreel: desktop shots alternate with phone shots of another demo  */
  /* ------------------------------------------------------------------ */
  const reelHtml = CASE_ORDER.map((id, i) => {
    const phoneOf = CASE_ORDER[(i + 2) % CASE_ORDER.length];
    return `<figure class="reel__item"><img src="assets/work/${id}-desktop.webp" alt=""></figure>` +
      `<figure class="reel__item reel__item--tall"><img src="assets/work/${phoneOf}-mobile.webp" alt=""></figure>`;
  }).join('');
  $$('.js-reel').forEach((g) => { g.innerHTML = reelHtml; });

  /* ------------------------------------------------------------------ */
  /* Rotating words                                                      */
  /* ------------------------------------------------------------------ */
  const ROTATOR = ['приводят гостей', 'принимают заказы', 'продают 24/7', 'радуют клиентов'];
  const rotEl = $('.js-rotator');
  if (rotEl && !reduceMotion) {
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      i = (i + 1) % ROTATOR.length;
      rotEl.classList.add('is-out');
      setTimeout(() => {
        rotEl.textContent = ROTATOR[i];
        rotEl.classList.remove('is-out');
        rotEl.classList.add('is-in');
        void rotEl.offsetWidth;
        rotEl.classList.remove('is-in');
      }, 450);
    }, 2800);
  }

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
    if (!document.body.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > 300 && y > lastY);
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
    $$('.stats, .svc, .steps, .why__grid, .faq__list').forEach((group) => {
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
    const media = $(`[data-case="${id}"] .project__media`).cloneNode(true);
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
      <div class="case__features">
        ${c.features.map(([b, s]) => `<div class="case__feature"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join('')}
      </div>
      <div class="case__actions">
        <a class="btn btn--light" href="demos/${id}/index.html" target="_blank" rel="noopener"><span>Открыть демо-сайт</span><i class="btn__arrow">↗</i></a>
        <a class="btn btn--accent js-case-contact" href="#contact"><span>Хочу такой сайт</span><i class="btn__arrow">→</i></a>
      </div>
      <p class="case__demo-note">Это концепт: заведение вымышленное, а все функции на демо-сайте работают по-настоящему.</p>
      <div class="case__next" role="button" tabindex="0">
        <div><small>Следующий проект</small><strong>${esc(CASES[nextId].title)}</strong></div>
        <i class="btn__arrow">→</i>
      </div>`;
    $('.js-hero-slot', caseContent).replaceWith(media);

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
    card.addEventListener('click', () => showCase(card.dataset.case));
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
          _subject: `SAJA BOYS — заявка на сайт от ${name}`,
          _template: 'table',
          name,
          contact,
          business: fd.get('business') || '—',
          need: fd.getAll('type').join(', ') || '—',
          message: String(fd.get('message') || '').trim() || '—',
          source: 'Портфолио SAJA BOYS',
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
