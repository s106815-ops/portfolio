# Proces Redesign + Assets z damians.me

**Data:** 2026-04-23  
**Status:** Zatwierdzony

---

## Zakres

Dwie niezależne zmiany w `index.html`, `style.css`, `script.js`:

1. **Sekcja Procesu** — nowy layout z boczną osią czasu i staggered reveal
2. **Sekcja Realizacje** — prawdziwe thumbnails klientów + miniatury YouTube

---

## 1. Sekcja Procesu — Boczna Oś Czasu

### Layout

Zamiana obecnego układu (tekst centralnie, duży ghost number w tle) na dwukolumnowy grid:

```
[ 72px timeline ] [ 1fr content ]
```

**Lewa kolumna — oś czasu:**
- 5 węzłów (01–05), każdy `32×32px`, `border-radius: 50%`
- Pionowe linie między węzłami (`1px`, `background: #1a1a1a`)
- Aktywny węzeł: `background: #2B8FE0`, `border-color: #2B8FE0`, `color: #fff`, `box-shadow: 0 0 0 6px rgba(43,143,224,0.12), 0 0 20px rgba(43,143,224,0.4)`
- Ukończone węzły (poniżej aktywnego): `border-color: #2B8FE0`, `color: #2B8FE0`
- Linie między ukończonymi węzłami: `background: linear-gradient(to bottom, #2B8FE0, rgba(43,143,224,0.15))`
- Węzły są klikalne (nawigacja do danego kroku)

**Prawa kolumna — treść kroku:**
- `padding-left: 28px`
- Elementy w kolejności: step-tag, step-title, step-desc
- Brak panelu wizualnego po prawej
- Brak dotów i progress-bara na dole (zastąpione przez oś czasu)

### Przejście — Staggered Reveal

Każdy element treści animuje się osobno z opóźnieniem:

| Element | delay | właściwości |
|---------|-------|-------------|
| `.step-tag` | 0ms | `opacity`, `translateY(14px → 0)` |
| `.step-title` | 80ms | `opacity`, `translateY(18px → 0)` |
| `.step-desc` | 180ms | `opacity`, `translateY(16px → 0)` |

Czas trwania: `0.4–0.45s ease`. Wyjście aktualnego kroku: natychmiastowe reset (`transition: none`), następnie nowy krok dostaje klasę `.active` i animuje się in.

### Sticky scroll — bez zmian

Mechanizm sticky scroll (`.proces__scroll-wrap` = `5 × 100vh`, `.proces__sticky-panel` = `position: sticky`) pozostaje bez zmian. JS oblicza `stepIdx` z `scrollProgress` i wywołuje `goToStep(idx)`.

### Usuwane elementy

- `.proces__bg-num-clip` / `.proces__bg-num` — duży ghost number w tle
- `.proces__dots` — dot-navigation na dole
- `.proces__progress-bar` / `.proces__progress-fill` — pasek postępu
- Powiązany CSS i JS dla tych elementów

### Mobile (≤768px)

Bez zmian w zachowaniu — statyczne kroki jeden pod drugim, timeline ukryta.

---

## 2. Sekcja Realizacje — Thumbnails

### Klienci ("Zaufali mi") — okrągłe avatary

Zamiana tekstowego marquee na rząd pill-kapsułek:

```html
<div class="client-pill">
  <img class="client-avatar" src="..." alt="...">
  <div>
    <span class="client-name">...</span>
    <span class="client-stat">... obserwujących</span>
  </div>
</div>
```

Styl: `border-radius: 50%`, `width/height: 40px`, `object-fit: cover`, `border: 2px solid #222`. Pill: `background: #111`, `border: 1px solid #1e1e1e`, `border-radius: 40px`.

**Źródła avatarów (z damians.me):**

| Klient | URL |
|--------|-----|
| lalahorosz | `https://damians.me/assets/lala-B45sWAN9.jpg` |
| wyjdzdoswiata | `https://damians.me/assets/wyjdz-C2HFFaFj.jpg` |
| Marketing HERO | `https://damians.me/assets/mar-CmwDAcJn.jpg` |
| lecenawakacje.pl | `https://damians.me/assets/lece-BgXUQydX.jpeg` |

Marquee animacja zostaje (pills scrollują automatycznie), zduplikowane pozycje dla seamless loop.

### Video karty — thumbnails

Każda `.video-card__thumb` otrzymuje `<img>` jako tło zamiast pustego div:

| Film | Źródło |
|------|--------|
| Nauka. To Lubię | `https://img.youtube.com/vi/gRyYbjvCSIg/maxresdefault.jpg` |
| BezPlanu | `https://damians.me/assets/bezplanu-DpYNCjSC.jpg` |
| Podróże Wojownika | `https://damians.me/assets/podroze-wojownika-Dw4hbbQk.png` |
| Nauka. To Lubię #2 | `https://img.youtube.com/vi/U08aU-D08I8/maxresdefault.jpg` |
| Nauka. To Lubię #3 | `https://img.youtube.com/vi/A8CXzBEvY-w/maxresdefault.jpg` |

Styl: `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;`. Overlay gradient i przycisk play pozostają na wierzchu.

---

## Pliki do zmiany

- `index.html` — HTML sekcji Procesu + HTML sekcji Realizacje
- `style.css` — CSS timeline, staggered reveal, client pills, video thumb img
- `script.js` — JS dla procesu (nowa logika goToStep z timeline nodes)
