/* Raqam — site interactions */
(function () {
  'use strict';

  // Where the contact form sends requests (FormSubmit, no backend needed).
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/sherzodbobojonov077';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Smooth scroll ---------------------------------------------------- */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  /* Header: border once scrolled, hide on the way down -------------- */
  const header = $('.header');
  let lastY = 0;
  const onScroll = (y) => {
    header.classList.toggle('is-scrolled', y > 8);
    if (!document.body.classList.contains('menu-open')) header.classList.toggle('is-hidden', y > 400 && y > lastY);
    lastY = y;
  };
  if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
  else window.addEventListener('scroll', () => onScroll(window.scrollY), { passive: true });

  /* Mobile menu ------------------------------------------------------ */
  const burger = $('.burger');
  const menu = $('#menu');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', String(!open));
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    header.classList.remove('is-hidden');
  }
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* Anchor links ----------------------------------------------------- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      setMenu(false);
      if (lenis) lenis.scrollTo(target, { offset: target === 0 ? 0 : -72, duration: 1.4 });
      else if (target === 0) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* Reveal on scroll, staggered within a row ------------------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.cases, .svc, .why__grid, .steps, .faq__list').forEach((group) => {
    $$('.reveal', group).forEach((el, i) => el.style.setProperty('--d', `${(i % 3) * 0.08}s`));
  });
  $$('.reveal').forEach((el) => io.observe(el));

  /* FAQ: one answer open at a time ----------------------------------- */
  $$('.faq__item').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) $$('.faq__item').forEach((o) => { if (o !== d) o.open = false; });
  }));

  /* Tashkent clock --------------------------------------------------- */
  const fmt = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tashkent' });
  const tick = () => { const t = fmt.format(new Date()); $$('.js-time').forEach((el) => { el.textContent = t; }); };
  tick(); setInterval(tick, 15000);

  /* Contact form ----------------------------------------------------- */
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
      status.textContent = 'Укажите имя и контакт, чтобы мы могли ответить.';
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
      status.textContent = 'Спасибо! Мы ответим в течение дня.';
      form.reset();
    } catch (err) {
      status.className = 'form__status is-err';
      status.textContent = 'Не получилось отправить. Попробуйте ещё раз чуть позже.';
    } finally {
      btn.disabled = false;
      label.textContent = 'Отправить заявку';
    }
  });
})();
