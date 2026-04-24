# Animation Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dodać custom cursor, animowany hero (dot grid + glow + reveal tekstu), glow pulse na statystykach, stagger na porównaniu, płynne FAQ, stroke na stopce DAMED — bez zmiany struktury sekcji ani dodawania zewnętrznych bibliotek.

**Architecture:** Czysty HTML/CSS/JS (vanilla). Zmiany rozproszone po 3 plikach: `index.html` (dodanie elementów DOM), `style.css` (nowe keyframes i klasy), `script.js` (nowe moduły dopisywane na koniec). Każde zadanie jest samodzielne — można commitować po każdym. Brak frameworka testów — weryfikacja przez przeładowanie `http://localhost:8080` po każdej zmianie.

**Tech Stack:** Vanilla JS, CSS animations/transitions, IntersectionObserver, requestAnimationFrame

---

## Mapa plików

- Modify: `index.html` — kursor DOM, hero glow blob, hero linie h1, FAQ refaktor
- Modify: `style.css` — cursor, hero grid/glow/reveal, marquee mask, stats glow, porównanie stagger, FAQ animacja, footer stroke, strengthen .reveal, reduced-motion
- Modify: `script.js` — cursor loop, hero reveal sequence, stats glow trigger, porównanie stagger observer, FAQ toggle

---

## Task 1: Custom cursor

**Files:**
- Modify: `index.html` — dodanie `#cursor-ring` i `#cursor-dot` na początku `<body>`
- Modify: `style.css` — sekcja `─── CURSOR ───`
- Modify: `script.js` — sekcja `─── CUSTOM CURSOR ───` na górze pliku

- [ ] **Step 1: Dodaj elementy DOM kursora do `index.html`**

Wstaw zaraz po `<body>` (przed `<nav>`):

```html
<div id="cursor-ring" aria-hidden="true"></div>
<div id="cursor-dot"  aria-hidden="true"></div>
```

- [ ] **Step 2: Dodaj CSS kursora do `style.css`**

Wstaw przed sekcją `─── NAVBAR ───`:

```css
/* ─── CURSOR ─── */
@media (pointer: fine) {
  body, a, button { cursor: none; }
}

#cursor-ring {
  position: fixed;
  top: 0; left: 0;
  width: 28px; height: 28px;
  margin: -14px 0 0 -14px;
  border: 1.5px solid rgba(43, 143, 224, 0.7);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
  transition: width 0.2s ease, height 0.2s ease, margin 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
  opacity: 0;
}

#cursor-dot {
  position: fixed;
  top: 0; left: 0;
  width: 6px; height: 6px;
  margin: -3px 0 0 -3px;
  background: #2B8FE0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 10000;
  will-change: transform;
  opacity: 0;
  transition: opacity 0.2s ease;
}

#cursor-ring.cursor-ring--hover {
  width: 44px; height: 44px;
  margin: -22px 0 0 -22px;
  border-color: rgba(43, 143, 224, 0.4);
}

@media (prefers-reduced-motion: reduce) {
  #cursor-ring, #cursor-dot { display: none; }
}
```

- [ ] **Step 3: Dodaj JS kursora na początku `script.js`** (przed linią `// ─── NAVBAR`)

```js
// ─── CUSTOM CURSOR ───
(function () {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
  let visible = false;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    if (!visible) {
      visible = true;
      ring.style.opacity = '1';
      dot.style.opacity  = '1';
    }
  });

  document.addEventListener('mouseleave', () => {
    ring.style.opacity = '0';
    dot.style.opacity  = '0';
    visible = false;
  });

  function tick() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(tick);
  }
  tick();

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor-ring--hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor-ring--hover'));
  });
})();
```

- [ ] **Step 4: Zweryfikuj w przeglądarce**

Otwórz `http://localhost:8080`. Przesuń mysz — niebieski pierścień śledzi z lekkim opóźnieniem, kropka natychmiast. Najedź na "Napisz do mnie" — pierścień powiększa się do ~44px.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: custom cursor — ring + dot, expands on hover"
```

---

## Task 2: Hero dot grid + animowany glow blob

**Files:**
- Modify: `index.html` — `div.hero__glow` wewnątrz `.hero`
- Modify: `style.css` — sekcja `─── HERO ───`

- [ ] **Step 1: Dodaj glow blob do `index.html`**

Wewnątrz `<section class="hero" id="hero">`, jako **pierwsze dziecko** (przed `div.hero__inner`):

```html
<div class="hero__glow" aria-hidden="true"></div>
```

- [ ] **Step 2: Dodaj CSS do `style.css` — rozszerz sekcję `─── HERO ───`**

Dopisz po istniejącym `.hero { ... }`:

```css
.hero {
  background-image: radial-gradient(circle, rgba(43, 143, 224, 0.15) 1px, transparent 1px);
  background-size: 28px 28px;
}

.hero__inner {
  position: relative;
  z-index: 1;
}

.hero__glow {
  position: absolute;
  width: 640px;
  height: 400px;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(43, 143, 224, 0.18) 0%, transparent 68%);
  pointer-events: none;
  z-index: 0;
  animation: heroGlow 4s ease-in-out infinite;
}

@keyframes heroGlow {
  0%, 100% { opacity: 0.7; transform: translateX(-50%) scale(1); }
  50%       { opacity: 1;   transform: translateX(-50%) scale(1.1); }
}

@media (prefers-reduced-motion: reduce) {
  .hero__glow { animation: none; opacity: 0.7; }
  .hero { background-image: none; }
}
```

- [ ] **Step 3: Zweryfikuj w przeglądarce**

`http://localhost:8080` — hero ma subtelną siatkę kropek, niebieski glow nad nagłówkiem delikatnie pulsuje. Siatka nie powinna być nachalna (bardzo ciemna).

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: hero dot grid background + animated glow blob"
```

---

## Task 3: Hero text reveal przy ładowaniu

**Files:**
- Modify: `index.html` — owinięcie linii h1 w spany
- Modify: `style.css` — stany startowe + `.hero--visible`
- Modify: `script.js` — sekwencja reveal po DOMContentLoaded

- [ ] **Step 1: Przepisz h1 w `index.html`**

Znajdź:
```html
<h1 class="hero__heading">Buduję Twój autorytet<br />przez content, który <em>sprzedaje.</em></h1>
```

Zamień na (bez `<br/>` — blokowe spany same robią łamanie):
```html
<h1 class="hero__heading">
  <span class="hero__line">Buduję Twój autorytet</span>
  <span class="hero__line">przez content, który <em>sprzedaje.</em></span>
</h1>
```

- [ ] **Step 2: Dodaj CSS stanów startowych do `style.css`** (w sekcji `─── HERO ───`)

```css
/* Hero reveal — stany startowe */
.hero__line {
  display: block; /* potrzebne żeby transform działał na span */
}

.hero__badge,
.hero__line,
.hero__sub,
.hero__actions {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.hero--visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

@media (prefers-reduced-motion: reduce) {
  .hero__badge, .hero__line, .hero__sub, .hero__actions {
    opacity: 1; transform: none; transition: none;
  }
}
```

- [ ] **Step 3: Dodaj JS sekwencji reveal do `script.js`** (na końcu pliku)

```js
// ─── HERO REVEAL ───
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lines = document.querySelectorAll('.hero__line');
  const seq = [
    { el: document.querySelector('.hero__badge'),   delay: 0   },
    { el: lines[0],                                 delay: 150 },
    { el: lines[1],                                 delay: 300 },
    { el: document.querySelector('.hero__sub'),     delay: 480 },
    { el: document.querySelector('.hero__actions'), delay: 630 },
  ];

  seq.forEach(({ el, delay }) => {
    if (!el) return;
    setTimeout(() => el.classList.add('hero--visible'), delay);
  });
})();
```

- [ ] **Step 4: Zweryfikuj w przeglądarce**

Przeładuj `http://localhost:8080` — badge pojawia się pierwszy, potem linia po linii nagłówka, sub, przyciski. Każdy element wjeżdża płynnie od dołu.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: hero text reveal animation on page load"
```

---

## Task 4: Marquee edge fade

**Files:**
- Modify: `style.css` — `.marquee-wrap`

- [ ] **Step 1: Dodaj mask-image do `.marquee-wrap` w `style.css`**

Znajdź blok `.marquee-wrap { ... }` i dodaj wewnątrz:

```css
-webkit-mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
```

- [ ] **Step 2: Zweryfikuj w przeglądarce**

Scrollbar marquee w hero — tekst zanika na krawędziach lewo/prawo. Środek widoczny w pełni.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: marquee edge fade via mask-image"
```

---

## Task 5: Stats — glow pulse po count-up

**Files:**
- Modify: `style.css` — nowy keyframe `statGlow` i klasa `.stats__number--glowing`
- Modify: `script.js` — modyfikacja `animateCounter`

- [ ] **Step 1: Dodaj CSS do `style.css`** (w sekcji `─── STATS ───`)

```css
.stats__number--glowing {
  animation: statGlow 2.5s ease-in-out infinite;
}

@keyframes statGlow {
  0%, 100% {
    text-shadow: 0 0 16px rgba(43, 143, 224, 0.4), 0 0 32px rgba(43, 143, 224, 0.15);
  }
  50% {
    text-shadow: 0 0 28px rgba(43, 143, 224, 0.7), 0 0 56px rgba(43, 143, 224, 0.3);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stats__number--glowing { animation: none; }
}
```

- [ ] **Step 2: Zmodyfikuj `animateCounter` w `script.js`**

Znajdź linię `clearInterval(timer);` wewnątrz `animateCounter` i dopisz po niej:

```js
el.classList.add('stats__number--glowing');
```

Cały blok `if (current >= target)` po zmianie:

```js
if (current >= target) {
  el.textContent = target + suffix;
  clearInterval(timer);
  el.classList.add('stats__number--glowing');
} else {
```

- [ ] **Step 3: Zweryfikuj w przeglądarce**

Przewiń do sekcji Statystyki — po zakończeniu animacji liczb (ok. 1.5s) każda liczba zaczyna delikatnie "świecić" niebieskim glow.

- [ ] **Step 4: Commit**

```bash
git add style.css script.js
git commit -m "feat: stats numbers glow pulse after count-up completes"
```

---

## Task 6: Porównanie — staggered reveal listy

**Files:**
- Modify: `index.html` — usunięcie `reveal` z `.porownanie__grid`
- Modify: `style.css` — stany startowe li + `.por-visible`
- Modify: `script.js` — nowy IntersectionObserver

- [ ] **Step 1: Usuń klasę `reveal` z `.porownanie__grid` w `index.html`**

Znajdź:
```html
<div class="porownanie__grid reveal">
```

Zamień na:
```html
<div class="porownanie__grid">
```

- [ ] **Step 2: Dodaj CSS do `style.css`** (w sekcji `─── PORÓWNANIE ───`)

```css
/* Stagger reveal — stany startowe */
.porownanie__col--bad li {
  opacity: 0;
  transform: translateX(-14px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.porownanie__col--good li {
  opacity: 0;
  transform: translateX(14px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.por-visible {
  opacity: 1 !important;
  transform: translateX(0) !important;
}

@media (prefers-reduced-motion: reduce) {
  .porownanie__col--bad li,
  .porownanie__col--good li {
    opacity: 1; transform: none; transition: none;
  }
}
```

- [ ] **Step 3: Dodaj JS do `script.js`** (na końcu pliku)

```js
// ─── PORÓWNANIE: staggered list ───
(function () {
  const grid = document.querySelector('.porownanie__grid');
  if (!grid) return;

  const badLis  = Array.from(grid.querySelectorAll('.porownanie__col--bad li'));
  const goodLis = Array.from(grid.querySelectorAll('.porownanie__col--good li'));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      badLis.forEach((li, i) => {
        setTimeout(() => li.classList.add('por-visible'), i * 100);
      });
      goodLis.forEach((li, i) => {
        setTimeout(() => li.classList.add('por-visible'), i * 100 + 60);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  obs.observe(grid);
})();
```

- [ ] **Step 4: Zweryfikuj w przeglądarce**

Przewiń do sekcji "Dlaczego ja?" — pozycje lewej kolumny wjeżdżają z lewej, prawej z prawej, jedna po drugiej z 100ms interwałem.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: comparison list items stagger in from sides"
```

---

## Task 7: FAQ — płynna animacja (refaktor details → div)

**Files:**
- Modify: `index.html` — zamiana `<details>`/`<summary>` na `<div>`/`<button>`
- Modify: `style.css` — nowe style FAQ (zastąpienie starych)
- Modify: `script.js` — toggle handler

- [ ] **Step 1: Zastąp cały blok 5 `<details>` w `index.html`**

Znajdź `<div class="faq__grid">` i zastąp całą jego zawartość:

```html
<div class="faq__item reveal">
  <button class="faq__summary" aria-expanded="false" aria-controls="faq-body-1">
    Jak wygląda proces współpracy?
    <span class="faq__icon" aria-hidden="true">+</span>
  </button>
  <div class="faq__body" id="faq-body-1">
    <p>Zaczynamy od krótkiego briefu — poznaję Twoje cele i markę. Następnie proponuję koncepcję, realizuję montaż i dostarczam gotowe materiały z możliwością 2 rund poprawek.</p>
  </div>
</div>
<div class="faq__item reveal">
  <button class="faq__summary" aria-expanded="false" aria-controls="faq-body-2">
    Ile trwa realizacja pierwszych materiałów?
    <span class="faq__icon" aria-hidden="true">+</span>
  </button>
  <div class="faq__body" id="faq-body-2">
    <p>Standardowo 3–5 dni roboczych od dostarczenia materiałów. Przy większej ilości filmów uzgadniamy harmonogram z wyprzedzeniem.</p>
  </div>
</div>
<div class="faq__item reveal">
  <button class="faq__summary" aria-expanded="false" aria-controls="faq-body-3">
    Na jakich platformach pracujesz?
    <span class="faq__icon" aria-hidden="true">+</span>
  </button>
  <div class="faq__body" id="faq-body-3">
    <p>Specjalizuję się w krótkiej formie: Instagram Reels, TikTok, YouTube Shorts. Realizuję też długie formy na YouTube oraz materiały reklamowe.</p>
  </div>
</div>
<div class="faq__item reveal">
  <button class="faq__summary" aria-expanded="false" aria-controls="faq-body-4">
    Czy mogę zobaczyć materiały przed publikacją?
    <span class="faq__icon" aria-hidden="true">+</span>
  </button>
  <div class="faq__body" id="faq-body-4">
    <p>Tak, zawsze. Każdy film trafia do Ciebie do akceptacji przed publikacją. Wprowadzam poprawki do momentu, gdy będziesz w pełni zadowolony.</p>
  </div>
</div>
<div class="faq__item reveal">
  <button class="faq__summary" aria-expanded="false" aria-controls="faq-body-5">
    Jaki budżet jest potrzebny na start?
    <span class="faq__icon" aria-hidden="true">+</span>
  </button>
  <div class="faq__body" id="faq-body-5">
    <p>Wycena zależy od liczby filmów, ich długości i zakresu współpracy. Napisz do mnie — przygotuję ofertę dopasowaną do Twoich potrzeb.</p>
  </div>
</div>
```

- [ ] **Step 2: Zastąp CSS FAQ w `style.css`**

Znajdź i usuń cały blok od `/* ─── FAQ ───*/` do `@media (max-width: 768px) { .faq__grid { ... } }` włącznie, wklej:

```css
/* ─── FAQ ─── */
.faq {
  padding: 100px 0;
  background: var(--bg-2);
}

.faq__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px;
}

.faq__item {
  background: var(--bg-3);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.faq__summary {
  width: 100%;
  padding: 20px 24px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;
  color: var(--text);
  background: none;
  border: none;
  cursor: pointer; /* nadpisuje cursor:none z body na touch devices */
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  text-align: left;
  transition: color var(--transition);
}

.faq__summary:hover { color: var(--accent); }

.faq__icon {
  font-size: 20px;
  font-weight: 300;
  color: var(--text-muted);
  flex-shrink: 0;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease;
  display: block;
  line-height: 1;
}

.faq__item.open .faq__icon {
  transform: rotate(45deg);
  color: var(--accent);
}

.faq__item.open .faq__summary { color: var(--accent); }

.faq__body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq__body p {
  padding: 0 24px 20px;
  color: var(--text-muted);
  font-size: 14px;
  line-height: 1.7;
  margin: 0;
}

@media (max-width: 768px) {
  .faq { padding: 60px 0; }
  .faq__grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Dodaj JS toggle do `script.js`** (na końcu pliku)

```js
// ─── FAQ: smooth toggle ───
document.querySelectorAll('.faq__item').forEach(item => {
  const btn  = item.querySelector('.faq__summary');
  const body = item.querySelector('.faq__body');
  if (!btn || !body) return;

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(!isOpen));
    body.style.maxHeight = isOpen ? '0' : body.scrollHeight + 'px';
  });
});
```

- [ ] **Step 4: Zweryfikuj w przeglądarce**

Sekcja FAQ — klik na pytanie: odpowiedź płynnie otwiera się z cubic-bezier, ikona `+` obraca się na `×`. Drugi klik: płynnie zamyka. Klawiatura: Tab → Enter działa.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: FAQ smooth max-height animation, accessible button markup"
```

---

## Task 8: Footer — DAMED hover stroke

**Files:**
- Modify: `style.css` — sekcja `─── FOOTER ───`

- [ ] **Step 1: Dodaj hover do `.footer__big-text` w `style.css`**

W sekcji `─── FOOTER ───` znajdź `.footer__big-text { ... }` i zmodyfikuj:

```css
.footer__big-text {
  font-size: clamp(4rem, 12vw, 9rem);
  font-weight: 800;
  letter-spacing: -4px;
  color: var(--bg-3);
  line-height: 1;
  margin-bottom: 32px;
  user-select: none;
  transition: color 0.4s ease, -webkit-text-stroke-color 0.4s ease;
  -webkit-text-stroke: 2px transparent;
}

.footer__big-text:hover {
  color: transparent;
  -webkit-text-stroke-color: var(--accent);
}
```

- [ ] **Step 2: Zweryfikuj w przeglądarce**

Stopka — najedź na "DAMED": białe wypełnienie zanika, zostaje niebieski obrys. Smooth transition.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: footer DAMED text stroke reveal on hover"
```

---

## Task 9: Wzmocnienie .reveal przez całą stronę

**Files:**
- Modify: `style.css` — blok `.reveal` i `.reveal.visible`

- [ ] **Step 1: Zaktualizuj `.reveal` w `style.css`**

Znajdź:
```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  filter: blur(4px);
  transition: opacity 0.6s ease, transform 0.6s ease, filter 0.6s ease;
}
```

Zamień na:
```css
.reveal {
  opacity: 0;
  transform: translateY(32px);
  filter: blur(6px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
```

- [ ] **Step 2: Zweryfikuj w przeglądarce**

Przewiń przez całą stronę — sekcje wjeżdżają z nieco mocniejszym blur i dłuższym ruchem, ale wciąż elegancko. Nagłówki sekcji, karty FAQ, stopka — wszystko powinno być płynne.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "refactor: strengthen reveal animation — deeper translateY + blur, spring easing"
```

---

## Uwagi końcowe

- Serwer lokalny działa na `http://localhost:8080` (uruchomiony przez `python3 -m http.server 8080` z katalogu `/Users/damian/portfolio`)
- Wszystkie zmiany są w CSS i vanilla JS — brak budowania, przeładowanie strony wystarczy do weryfikacji
- Kolejność zadań 1–9 jest sugerowana ale niezależna (każde można commitować osobno)
- `.superpowers/` można dodać do `.gitignore` jeśli nie jest tam jeszcze
