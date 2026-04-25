# Design Spec: Sekcja Proces — nawigacja klikiem

**Data:** 2026-04-25
**Projekt:** damian/portfolio (pure HTML/CSS/JS)
**Problem:** Sekcja Proces używa `height: 5×100vh` ze sticky panelem sterowanym scrollem — strona czuje się "zablokowana" przez 5 ekranów zanim można przejść dalej.

---

## Cel

Usunąć blokowanie scrolla przy zachowaniu wyglądu panelu. Sekcja ma zajmować jeden ekran i scrollować się przez nią normalnie. Zmiana kroków odbywa się wyłącznie przez klik.

---

## Zmiany

### CSS

- `.proces__scroll-wrap`: `height: calc(5 * 100vh)` → `height: 100vh`
- Nowe style `.proces__nav`, `.proces__nav-btn`, `.proces__nav-btn--primary` — przyciski tekstowe ze strzałką, styl zgodny z portfolio (ciemne tło, border, hover accent)
- Mobile: `.proces__nav` display flex, gap 12px, margin-top auto

### HTML

- Dodać `<div class="proces__nav">` z dwoma buttonami (`#processPrev`, `#processNext`) po `.step-area`, wewnątrz `.proces__panel-inner`

### JS

- Usunąć `window.addEventListener('scroll', ...)` wewnątrz bloku `if (procesScrollWrap ...)` — ten handler mapuje scroll progress na indeks kroku
- Zachować `goToStep()`, klik na węzły, `currentStepIdx`
- Dodać click listenery na `#processPrev` / `#processNext`
- Aktualizować stan disabled przycisków: Wstecz disabled na kroku 0, Dalej disabled na kroku 4

---

## Zakres — co NIE wchodzi

- Brak zmian w treści kroków
- Brak zmian w animacji staggered reveal przy zmianie kroku
- Brak zmian w mobile layout (nodes-col już ukryty na mobile)
- Brak keyboard navigation (poza domyślnym Tab/Enter na buttonach)
