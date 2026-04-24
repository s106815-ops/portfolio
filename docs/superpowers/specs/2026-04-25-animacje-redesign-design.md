# Design Spec: Animacje & Redesign Portfolio

**Data:** 2026-04-25
**Projekt:** damian/portfolio (pure HTML/CSS/JS)
**Podejście:** B — pełny refresh animacji, bez przebudowy struktury HTML

---

## Cel

Ożywienie portfolio przez dodanie subtelnych, eleganckich animacji w stylu Apple/Linear oraz custom cursora. Układ HTML pozostaje bez zmian — ulepszamy to co jest.

---

## 1. Custom Cursor

**Plik:** `script.js` (nowy moduł na górze), `style.css`

- Dwa elementy DOM: `#cursor-ring` (pierścień 28px, border 1.5px accent) i `#cursor-dot` (kropka 5px, filled accent)
- Cursor-ring śledzi mysz z opóźnieniem (lerp, ~0.12 factor) przez `requestAnimationFrame`
- Cursor-dot śledzi natychmiastowo
- Na hover `a, button`: ring skaluje się do 1.6× przez `transform: scale(1.6)` + `transition`
- `cursor: none` na `body`
- Wyłączony na urządzeniach dotykowych (`@media (pointer: coarse)`)

---

## 2. Hero — dot grid + animowany glow + reveal tekstu

**Plik:** `style.css`, `index.html` (dodanie klas na słowach h1), `script.js`

### Tło hero
- Dot grid: `background-image: radial-gradient(circle, rgba(43,143,224,0.18) 1px, transparent 1px)` z `background-size: 28px 28px` na `.hero`
- Glow blob: nowy `div.hero__glow` absolutnie pozycjonowany, top: -60px, center, `radial-gradient` niebieski, animacja `breathe` (scale 1→1.08, opacity 0.7→1, 4s infinite ease-in-out)

### Reveal tekstu przy ładowaniu
- Obecne h1: `Buduję Twój autorytet<br/>przez content, który <em>sprzedaje.</em>` — nie owijamy słów, zamiast tego animujemy całe **linie**: linia 1 (`Buduję Twój autorytet`) i linia 2 (`przez content, który sprzedaje.`) jako dwa `<span class="hero__line">` z `display: block`
- `.hero__line` — opacity:0, translateY(20px), transition: none na start; `<em>` zostaje wewnątrz bez zmian
- JS po `DOMContentLoaded`: sekwencja z `setTimeout`, każdy element dostaje klasę `.visible`
- Kolejność: badge (0ms) → linia 1 h1 (150ms) → linia 2 h1 (300ms) → `.hero__sub` (480ms) → `.hero__actions` (630ms)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`, duration `0.7s`

### Marquee edge fade
- `.marquee-wrap`: dodać `mask-image: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)`

---

## 3. Stats — glow pulse po count-up

**Plik:** `script.js` (modyfikacja istniejącego count-up)

- Po zakończeniu count-up na danym `.stats__number` → dodaj klasę `.stats__number--glowing`
- `.stats__number--glowing`: `animation: statGlow 2.5s ease-in-out infinite`
- `@keyframes statGlow`: oscylacja `text-shadow` między słabym (0 0 16px rgba(43,143,224,0.4)) a mocnym (0 0 28px rgba(43,143,224,0.7))

---

## 4. Porównanie — staggered reveal listy

**Plik:** `script.js`, `style.css`

- Każde `li` w `.porownanie__col` dostaje `data-stagger` (indeks)
- IntersectionObserver na `.porownanie__grid` — gdy widoczny, iteruje po `li` i dodaje `.visible` z opóźnieniem `index * 100ms`
- `.porownanie__col--bad li`: start `translateX(-12px)`, opacity 0
- `.porownanie__col--good li`: start `translateX(12px)`, opacity 0
- `.visible`: opacity 1, translateX(0), transition `0.5s cubic-bezier(0.16,1,0.3,1)`

---

## 5. FAQ — płynna animacja (zastąpienie `<details>`)

**Plik:** `index.html` (refaktor `<details>` → `<div>`), `style.css`, `script.js`

- Zamiana `<details>`/`<summary>` na `<div class="faq__item">` z `<button class="faq__summary">` i `<div class="faq__body">`
- `.faq__body`: `max-height: 0`, `overflow: hidden`, `transition: max-height 0.4s cubic-bezier(0.16,1,0.3,1)`
- JS: klik na `.faq__summary` → toggle klasy `.open` na `.faq__item`, ustawia `max-height` na `scrollHeight` elementu body
- `button.faq__summary` ma `aria-expanded="false/true"` i `aria-controls` wskazujące na `.faq__body` (z `id`)
- Ikona `+` obraca się 45° przez CSS transition gdy `.open`

---

## 6. Footer — DAMED hover stroke

**Plik:** `style.css`

- `.footer__big-text:hover`: `color: transparent`, `-webkit-text-stroke: 2px var(--accent)`
- `transition: color 0.4s ease, -webkit-text-stroke-color 0.4s ease`

---

## 7. Wzmocnienie .reveal przez całą stronę

**Plik:** `style.css`

- Obecne `.reveal`: `translateY(24px)`, `blur(4px)`, `opacity 0.6s ease`
- Po zmianie: `translateY(32px)`, `blur(6px)`, duration `0.7s`, easing `cubic-bezier(0.16, 1, 0.3, 1)` (bardziej sprężysty)
- Efekt jest silniejszy ale wciąż subtelny

---

## Scope — co NIE wchodzi w zakres

- Brak zmian w strukturze sekcji (kolejność, nowe sekcje)
- Brak parallax/noise texture (to podejście C)
- Brak zmian w treści (copy, liczby, klienci, filmy)
- Brak przebudowy sekcji Proces (działa dobrze)
- Brak nowych zależności npm / zewnętrznych bibliotek (czyste CSS + vanilla JS)

---

## Dostępność

- `@media (prefers-reduced-motion: reduce)`: wyłącza cursor lag, hero reveal animacje (pokazuje od razu widoczne), glow pulse, stagger — wszystko statyczne
- Cursor wyłączony na touch devices
- FAQ dostępne z klawiatury (button + aria-expanded)
