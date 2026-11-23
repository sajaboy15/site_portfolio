/* Raqam — site interactions */
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
    orchestra: {
      kind: 'real',
      title: 'Национальный оркестр',
      eyebrow: 'Проект 01 · Госсектор и культура',
      lead: 'Официальный сайт Национального оркестра Филармонии Узбекистана. Проект сделан для Министерства культуры Республики Узбекистан.',
      facts: [['Заказчик', 'Министерство культуры РУз'], ['Тип', 'Официальный сайт'], ['Сфера', 'Культура'], ['Платформа', 'Веб, адаптив']],
      task: 'Оркестру нужен официальный сайт, который достойно представляет коллектив государственного уровня и даёт зрителям и партнёрам понятный источник информации о нём.',
      solution: 'Сделали официальный сайт оркестра в торжественном классическом стиле, адаптированный под телефоны и компьютеры.',
      features: [],
      links: [],
    },
    'scopos-app': {
      kind: 'real',
      title: 'Scopos',
      eyebrow: 'Проект 02 · AI-продукт',
      lead: 'AI-коуч для Windows. Сотрудник спрашивает своими словами — например, «как создать счёт?» — и Scopos показывает курсором, куда нажать дальше, шаг за шагом прямо в рабочей CRM или ERP.',
      facts: [['Тип', 'Десктоп + AI'], ['Платформа', 'Windows'], ['Языки', 'RU, UZ, EN'], ['Статус', 'Пилот с U VENDOR']],
      task: 'В CRM и ERP сотни меню и форм. В пилотной компании новому сотруднику нужно около двух недель, чтобы работать без помощи, а опытных коллег постоянно отвлекают вопросами «куда нажать?». Инструкции и видео быстро устаревают.',
      solution: 'Приложение читает живой экран и структуру открытого окна, Claude строит план шагов, а прозрачный слой показывает курсором нужную кнопку. Scopos работает поверх уже внедрённой системы — ничего не нужно переделывать. Выученные маршруты сохраняются и повторяются без обращения к AI.',
      features: [
        ['Видит экран', 'Скриншот и Windows UI Automation: названия и положение кнопок в открытом окне.'],
        ['Шаг за шагом', 'Вопрос своими словами превращается в маршрут из шагов с курсором на нужной кнопке.'],
        ['Запоминает', 'Сохранённые маршруты и база знаний компании: повторные вопросы — без вызова AI.'],
        ['Тяга', 'Пилот с U VENDOR, контракт на 5 лет с New Uzbekistan University, соглашение с Uncle Chill, акселератор IDROCK.'],
      ],
      stack: ['Electron', 'React', 'TypeScript', 'Windows UI Automation', 'Claude vision', 'Python'],
      links: [{ href: 'https://github.com/sajaboy15/scopos/releases/latest', label: 'Скачать для Windows' }],
    },
    'scopos-site': {
      kind: 'real',
      title: 'Сайт Scopos',
      eyebrow: 'Проект 03 · Сайт продукта',
      lead: 'Сайт AI-продукта Scopos для клиентов и инвесторов: за несколько минут объясняет проблему, показывает продукт в деле и убеждает, что команда доведёт его до рынка.',
      facts: [['Тип', 'Сайт продукта'], ['Аудитория', 'Клиенты и инвесторы'], ['Платформа', 'Веб, адаптив'], ['Хостинг', 'Vercel']],
      task: 'Десктоп-продукт трудно объяснить словами: человек должен увидеть, как курсор ведёт по интерфейсу. К Pitch Day сайт должен был отвечать на вопросы инвестора: какая проблема, кто команда, что уже сделано и как продукт будет расти.',
      solution: 'Тёплый минималистичный стиль с терракотовым акцентом. Первый экран окружён «парящими» скриншотами реального интерфейса. Дальше — проблема и решение, команда, преимущества, дорожная карта, план внедрения по этапам, бизнес-модель и демо-видео.',
      features: [
        ['Парящие скриншоты', 'Окна реального интерфейса плавают вокруг заголовка и увеличиваются при наведении.'],
        ['Питч-структура', 'Проблема → решение → команда → почему мы → дорожная карта → план → демо.'],
        ['Партнёры', 'U VENDOR, New Uzbekistan University, Uncle Chill, IDROCK и Ipsilon Group.'],
        ['Формы без бэкенда', 'Заявки и вопросы приходят на почту команды.'],
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
      links: [],
    },
    'scopos-route': {
      kind: 'real',
      title: 'Scopos Route',
      eyebrow: 'Проект 04 · Цифровизация продаж',
      lead: 'Мобильный сайт для выездных визитов: показывает компании на карте, строит самый выгодный маршрут и ведёт по нему как навигатор. Маршрут можно попросить голосом.',
      facts: [['Тип', 'PWA + AI'], ['Данные', '155 компаний'], ['Платформа', 'Телефон'], ['Защита', 'AES-256-GCM']],
      task: 'Команда продаж объезжает десятки компаний в Ташкенте. Данные лежали в двух Excel-таблицах, и каждое утро приходилось вручную решать, к кому ехать сначала и как не потерять полдня в пробках.',
      solution: '155 компаний из таблиц на карте: цвет — категория, буква — приоритет A/B/C. Оптимизатор выбирает компании и порядок так, чтобы время в пути было минимальным, а ценность визитов — максимальной. Фраза «4 ближайших колл-центра, сначала приоритет A» — и ассистент сам строит маршрут.',
      features: [
        ['Умный маршрут', 'Расстояния по дорогам с поправкой на пробки, режимы «Ближе / Баланс / Приоритет».'],
        ['Голосовой AI-ассистент', 'Ищет по категориям и расстоянию, отмечает визиты и запускает навигацию.'],
        ['Навигатор', 'Живая стрелка по компасу и GPS, голосовые подсказки, пересчёт при съезде с маршрута.'],
        ['Данные под замком', 'Таблицы клиентов зашифрованы AES-256-GCM и открываются только ключом.'],
      ],
      stack: ['JavaScript', 'Leaflet', 'OSRM', 'Claude API', 'Web Speech', 'Web Crypto', 'PWA', 'Vercel'],
      links: [],
    },
    oshxona: {
      kind: 'concept',
      media: '--m1:#16405f;--m2:#0f2a3f;--m3:#e8b04b',
      title: "Oshxona Navro'z",
      eyebrow: 'Отраслевое решение · Ресторан',
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
      kind: 'concept',
      media: '--m1:#ffd9bf;--m2:#f3e9dc;--m3:#ff6b2c',
      title: 'Tong Coffee',
      eyebrow: 'Отраслевое решение · Кофейня',
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
      kind: 'concept',
      media: '--m1:#ffe27a;--m2:#ffd23f;--m3:#e63b2e',
      title: 'Burger Lab',
      eyebrow: 'Отраслевое решение · Доставка',
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
      kind: 'concept',
      media: '--m1:#ffffff;--m2:#e9e8e3;--m3:#2f4bff',
      title: 'KIYIM',
      eyebrow: 'Отраслевое решение · Интернет-магазин',
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
  const CASE_ORDER = ['orchestra', 'scopos-app', 'scopos-site', 'scopos-route', 'oshxona', 'tong-coffee', 'burger-lab', 'kiyim'];
  const DEMOS = CASE_ORDER.filter((id) => CASES[id].kind === 'concept');

  /* ------------------------------------------------------------------ */
  /* Showreel: desktop shots alternate with phone shots of another demo  */
  /* ------------------------------------------------------------------ */
  const shot = (f, tall) => `<figure class="reel__item${tall ? ' reel__item--tall' : ''}"><img src="assets/work/${f}.webp" alt=""></figure>`;
  const reelHtml = [
    shot('scopos-site-desktop'), shot('scopos-route-mobile', true),
    ...DEMOS.flatMap((id, i) => [shot(`${id}-desktop`), shot(`${DEMOS[(i + 2) % DEMOS.length]}-mobile`, true)]),
    shot('scopos-feature-2'), shot('scopos-site-mobile', true),
  ].join('');
  $$('.js-reel').forEach((g) => { g.innerHTML = reelHtml; });

  /* ------------------------------------------------------------------ */
  /* Rotating words                                                      */
  /* ------------------------------------------------------------------ */
  const ROTATOR = ['работают на бизнес', 'приводят клиентов', 'экономят часы', 'продают 24/7'];
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
