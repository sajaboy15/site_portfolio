# Raqam Studio — разработка сайтов в Ташкенте

Сайт веб-студии Raqam Studio: работы (bysohiba couture, Национальный оркестр), услуги, процесс, вопросы и форма заявки.
Статический сайт без сборки: HTML, CSS и JavaScript, плавная прокрутка на [Lenis](https://github.com/darkroom-engineering/lenis) (MIT, лежит в `assets/vendor`).
Все пути относительные, поэтому `index.html` открывается и с диска, и с любого хостинга.

## Структура

```
index.html     главная: первый экран, работы, услуги, преимущества, процесс, вопросы, заявка
styles.css     стили
main.js        прокрутка, меню, анимации появления, форма заявки
assets/        логотип, картинка для соцсетей, Lenis
vercel.json    настройки Vercel (статический сайт из корня)
```

## Как добавить работу

Каждая работа — блок `<article class="case">` в разделе `#work` в `index.html`.
Пока нет скриншота, у карточки типографская обложка (`cover--…`). Когда скриншот готов:

1. Положите его в `assets/work/` (лучше `.webp`, ширина 1600–2000 px).
2. Замените содержимое `<div class="case__media …">` на `<img src="assets/work/имя.webp" alt="…">` и уберите классы `cover cover--…`.
3. Добавьте ссылку на сайт в `.case__body`: `<a class="case__link" href="https://…" target="_blank" rel="noopener">Открыть сайт ↗</a>`.

## Форма заявки

Заявки уходят на почту через FormSubmit — адрес задан в `FORM_ENDPOINT` в начале `main.js`.
При первой заявке с нового домена FormSubmit присылает письмо с подтверждением — его нужно открыть один раз.

## Локальный запуск

```
python3 -m http.server 8000
```

и откройте http://localhost:8000.

## Деплой на Vercel

1. vercel.com → **Add New… → Project** → импортируйте репозиторий `sajaboy15/site_portfolio`.
2. Framework Preset — **Other**, Build Command и Output Directory оставьте пустыми (всё задано в `vercel.json`).
3. **Deploy**. Дальше каждый push публикуется автоматически.
