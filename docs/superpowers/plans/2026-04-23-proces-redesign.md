# Proces Redesign + Realizacje Assets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Zastąpić sekcję Procesu boczną osią czasu ze staggered reveal, dodać okrągłe avatary klientów i thumbnails do kart video.

**Architecture:** Trzy pliki statycznej strony (index.html, style.css, script.js) — bez build toolów. Zmiany podzielone na: (1) nowy HTML sekcji Procesu, (2) nowy CSS, (3) nowy JS, (4) HTML/CSS Realizacje.

**Tech Stack:** Vanilla HTML/CSS/JS, bez zależności.

---

## Mapa plików

| Plik | Co się zmienia |
|------|----------------|
| `index.html` | Sekcja `#proces` — nowy HTML timeline; sekcja `#realizacje` — klienci pills + video img |
| `style.css` | CSS timeline, stagger, client pills, video thumb img; usunięcie starego CSS |
| `script.js` | Sekcja `PROCES` — nowa logika `goToStep` z węzłami i liniami |

---

## Task 1: HTML sekcji Procesu — nowa struktura

**Files:**
- Modify: `index.html` — sekcja `<section class="proces">` (linie 188–239)

- [ ] **Krok 1: Otwórz `index.html` i znajdź sekcję `#proces`**

Obecna zawartość `.proces__scroll-wrap → .proces__sticky-panel`:
```html
<div class="proces__sticky-panel">
  <div class="proces__bg-num-clip">
    <div class="proces__bg-num" id="procesBgNum">01</div>
  </div>
  <div class="proces__steps-area">
    <div class="proces__step active" data-index="0">...</div>
    ...
  </div>
  <div class="proces__footer">
    <div class="proces__dots" id="procesDots">...</div>
    <div class="proces__progress-bar">...</div>
  </div>
</div>
```

- [ ] **Krok 2: Zastąp całą zawartość `.proces__sticky-panel` tym kodem**

```html
<div class="proces__sticky-panel">
  <div class="proces__panel-inner">

    <div class="nodes-col">
      <div class="node-group">
        <div class="tl-node active" id="pn0">01</div>
        <div class="node-line" id="pl0"></div>
      </div>
      <div class="node-group">
        <div class="tl-node" id="pn1">02</div>
        <div class="node-line" id="pl1"></div>
      </div>
      <div class="node-group">
        <div class="tl-node" id="pn2">03</div>
        <div class="node-line" id="pl2"></div>
      </div>
      <div class="node-group">
        <div class="tl-node" id="pn3">04</div>
        <div class="node-line" id="pl3"></div>
      </div>
      <div class="node-group node-group--last">
        <div class="tl-node" id="pn4">05</div>
      </div>
    </div>

    <div class="step-area">
      <div class="step-block active" id="pb0">
        <span class="proces__step-num">01 — 05</span>
        <h3>Brief & Analiza</h3>
        <p>Poznaję Twoją markę, grupę docelową i cele. Analizuję konkurencję i to, co już działa w Twojej niszy.</p>
      </div>
      <div class="step-block" id="pb1">
        <span class="proces__step-num">02 — 05</span>
        <h3>Strategia & Koncepcja</h3>
        <p>Proponuję formy video, tematy i skrypty dopasowane do Twoich celów i algorytmów platform.</p>
      </div>
      <div class="step-block" id="pb2">
        <span class="proces__step-num">03 — 05</span>
        <h3>Montaż</h3>
        <p>Realizuję materiały z uwagą na storytelling, tempo i trendy. Każdy film ma zatrzymywać scroll.</p>
      </div>
      <div class="step-block" id="pb3">
        <span class="proces__step-num">04 — 05</span>
        <h3>Korekty</h3>
        <p>2 rundy poprawek w cenie. Wprowadzam zmiany sprawnie, bez zbędnych pytań.</p>
      </div>
      <div class="step-block" id="pb4">
        <span class="proces__step-num">05 — 05</span>
        <h3>Dostawa & Optymalizacja</h3>
        <p>Dostarczam gotowe pliki w odpowiednich formatach i rozdzielczościach. Daję wskazówki do dystrybucji.</p>
      </div>
    </div>

  </div>
</div>
```

- [ ] **Krok 3: Zweryfikuj w przeglądarce**

Otwórz http://localhost:8080 — sekcja Procesu powinna być widoczna (choć bez stylów timeline jeszcze). Nie powinny być widoczne stare elementy (duży numer w tle, kropki, pasek postępu).

- [ ] **Krok 4: Commit**

```bash
git add index.html
git commit -m "feat: process section — new timeline HTML structure"
```

---

## Task 2: CSS sekcji Procesu — timeline + stagger

**Files:**
- Modify: `style.css` — sekcja `/* ─── PROCES ─── */` (linie 573–937)

- [ ] **Krok 1: Znajdź i usuń stare CSS reguły** (zastąp je w Task 2 Krok 2)

Usunąć całkowicie:
- `.proces__bg-num-clip` i `.proces__bg-num` i `.proces__bg-num.fading`
- `.proces__steps-area`
- `.proces__step`, `.proces__step.active`, `.proces__step.exiting`
- `.proces__footer`
- `.proces__dots`, `.proces__dot`, `.proces__dot.active`
- `.proces__progress-bar`, `.proces__progress-fill`

Zostawić bez zmian:
- `.proces` (padding-top: 100px)
- `.proces__header`
- `.proces__scroll-wrap`
- `.proces__sticky-panel` — ale zmienić zawartość (patrz niżej)
- `.proces__step-num` — zostawić (używane w `.step-block`)
- `.proces__step h3` → podmienić na `.step-block h3`
- `.proces__step p` → podmienić na `.step-block p`

- [ ] **Krok 2: Zastąp usuniętą sekcję nowym CSS (wklej po `.proces__scroll-wrap`)**

```css
.proces__sticky-panel {
  position: sticky;
  top: 0;
  height: 100vh;
  background: var(--bg);
}

.proces__panel-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 80px 24px 48px;
  height: 100%;
  display: grid;
  grid-template-columns: 80px 1fr;
}

/* ── Timeline column ── */
.nodes-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.node-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.node-group--last {
  flex: 0;
}

.tl-node {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 800;
  color: #444;
  flex-shrink: 0;
  transition: background 0.4s ease, border-color 0.4s ease,
              color 0.4s ease, box-shadow 0.4s ease;
  cursor: pointer;
  user-select: none;
}

.tl-node.active {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  box-shadow: 0 0 0 6px rgba(43, 143, 224, 0.12),
              0 0 20px rgba(43, 143, 224, 0.4);
}

.tl-node.done {
  border-color: var(--accent);
  color: var(--accent);
}

.node-line {
  flex: 1;
  width: 1px;
  background: var(--border);
  min-height: 16px;
  transition: background 0.5s ease;
}

.node-line.filled {
  background: linear-gradient(
    to bottom,
    var(--accent),
    rgba(43, 143, 224, 0.15)
  );
}

/* ── Content column ── */
.step-area {
  position: relative;
}

.step-block {
  position: absolute;
  top: 50%;
  left: 32px;
  right: 0;
  transform: translateY(-50%);
  max-width: 600px;
  pointer-events: none;
}

.step-block.active {
  pointer-events: auto;
}

/* Staggered reveal — default hidden */
.step-block .proces__step-num {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--accent);
  text-transform: uppercase;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(14px);
}

.step-block h3 {
  font-size: clamp(2rem, 4.5vw, 3.2rem);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.05;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(18px);
}

.step-block p {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.75;
  max-width: 500px;
  opacity: 0;
  transform: translateY(16px);
}

/* Staggered reveal — animate in when active */
.step-block.active .proces__step-num {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.step-block.active h3 {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.45s ease 0.08s, transform 0.45s ease 0.08s;
}

.step-block.active p {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.45s ease 0.18s, transform 0.45s ease 0.18s;
}
```

- [ ] **Krok 3: Zaktualizuj mobilny CSS w sekcji `@media (max-width: 768px)`**

Znajdź i usuń stary blok mobilny dla Procesu (od `.proces__scroll-wrap` do `.proces__footer`), zastąp tym:

```css
.proces__scroll-wrap { height: auto; }

.proces__sticky-panel {
  position: relative;
  height: auto;
}

.proces__panel-inner {
  display: flex;
  flex-direction: column;
  padding: 0 24px 48px;
  height: auto;
}

.nodes-col { display: none; }

.step-area {
  position: static;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.step-block {
  position: static;
  transform: none;
  max-width: 100%;
  pointer-events: auto;
}

.step-block .proces__step-num,
.step-block h3,
.step-block p {
  opacity: 1;
  transform: none;
  transition: none;
}
```

- [ ] **Krok 4: Zaktualizuj sekcję `@media (prefers-reduced-motion: reduce)`**

Usuń stare reguły dla `.proces__step`, `.proces__step.active`, `.proces__step.exiting`, `.proces__bg-num`, `.proces__progress-fill`. Dodaj:

```css
.step-block .proces__step-num,
.step-block h3,
.step-block p,
.step-block.active .proces__step-num,
.step-block.active h3,
.step-block.active p {
  transition: none;
}
.tl-node { transition: none; }
.node-line { transition: none; }
```

- [ ] **Krok 5: Sprawdź w przeglądarce**

Otwórz http://localhost:8080, przewiń do `#proces`. Powinno być widać:
- Lewą kolumnę z 5 węzłami połączonymi liniami
- Krok 01 aktywny (niebieski glow na węźle `01`)
- Tekst "Brief & Analiza" widoczny na prawo
- Na mobile: wszystkie 5 kroków widoczne jeden pod drugim, timeline ukryta

- [ ] **Krok 6: Commit**

```bash
git add style.css
git commit -m "feat: process section — timeline + staggered reveal CSS"
```

---

## Task 3: JS sekcji Procesu — nowa logika goToStep

**Files:**
- Modify: `script.js` — sekcja `// ─── PROCES: sticky scroll ───` (linie 76–131)

- [ ] **Krok 1: Zastąp całą sekcję `// ─── PROCES: sticky scroll ───` tym kodem**

```js
// ─── PROCES: sticky scroll ───
const procesScrollWrap = document.getElementById('procesScrollWrap');
const procesNodes = Array.from(document.querySelectorAll('.tl-node'));
const procesLines = Array.from(document.querySelectorAll('.node-line'));
const procesBlocks = Array.from(document.querySelectorAll('.step-block'));

if (procesScrollWrap && window.matchMedia('(min-width: 769px)').matches) {
  let currentStepIdx = 0;
  let lastScrollStepIdx = -1;

  function goToStep(idx) {
    if (idx === currentStepIdx) return;

    // Instant-hide old step — kill transitions so exit has no animation
    const oldBlock = procesBlocks[currentStepIdx];
    oldBlock.querySelectorAll('.proces__step-num, h3, p').forEach(el => {
      el.style.transition = 'none';
    });
    oldBlock.classList.remove('active');

    // Update nodes: active / done states
    procesNodes.forEach((node, i) => {
      node.classList.remove('active', 'done');
      if (i < idx) node.classList.add('done');
      if (i === idx) node.classList.add('active');
    });

    // Update lines: filled up to active node
    procesLines.forEach((line, i) => {
      line.classList.toggle('filled', i < idx);
    });

    currentStepIdx = idx;

    // Re-enable transitions on new block (clear any inline override), then activate
    const newBlock = procesBlocks[idx];
    newBlock.querySelectorAll('.proces__step-num, h3, p').forEach(el => {
      el.style.transition = '';
    });
    newBlock.classList.add('active');
  }

  window.addEventListener('scroll', () => {
    const rect = procesScrollWrap.getBoundingClientRect();
    const scrolled = -rect.top;
    const total = procesScrollWrap.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(1, scrolled / total));
    const stepIdx = Math.min(Math.floor(progress * 5), 4);
    if (stepIdx !== lastScrollStepIdx) {
      lastScrollStepIdx = stepIdx;
      goToStep(stepIdx);
    }
  }, { passive: true });
}
```

- [ ] **Krok 2: Sprawdź w przeglądarce — przewiń przez sekcję Procesu**

Spodziewany efekt:
- Scroll w dół: węzły zapalają się jeden po drugim (glow), linie między nimi stają się niebieskie, tekst staggered-reveal wślizguje się od dołu
- Scroll do tyłu: węzły gaszą się, linie szarzeją, poprzedni krok pojawia się od razu (bez animacji wyjścia)
- Na mobile: brak JS (sekcja renderuje statycznie wszystkie 5 kroków)

- [ ] **Krok 3: Commit**

```bash
git add script.js
git commit -m "feat: process section — timeline JS with staggered reveal"
```

---

## Task 4: Realizacje — klienci z okrągłymi avatarami

**Files:**
- Modify: `index.html` — sekcja `.clients-marquee-wrap` (linie 91–101)
- Modify: `style.css` — sekcja `/* Clients marquee */`

- [ ] **Krok 1: Zastąp zawartość `.clients-marquee` w `index.html`**

```html
<div class="clients-marquee-wrap">
  <div class="clients-marquee">
    <div class="clients-marquee__item">
      <div class="client-pill">
        <img class="client-avatar" src="https://damians.me/assets/lala-B45sWAN9.jpg" alt="lalahorosz">
        <div class="client-info">
          <span class="client-name">lalahorosz</span>
          <span class="client-stat">124 tys. obserwujących</span>
        </div>
      </div>
    </div>
    <div class="clients-marquee__item">
      <div class="client-pill">
        <img class="client-avatar" src="https://damians.me/assets/wyjdz-C2HFFaFj.jpg" alt="wyjdzdoswiata">
        <div class="client-info">
          <span class="client-name">wyjdzdoswiata</span>
          <span class="client-stat">3,7 tys. obserwujących</span>
        </div>
      </div>
    </div>
    <div class="clients-marquee__item">
      <div class="client-pill">
        <img class="client-avatar" src="https://damians.me/assets/mar-CmwDAcJn.jpg" alt="Marketing HERO">
        <div class="client-info">
          <span class="client-name">Marketing HERO</span>
          <span class="client-stat">17,7 tys. subskrybentów</span>
        </div>
      </div>
    </div>
    <div class="clients-marquee__item">
      <div class="client-pill">
        <img class="client-avatar" src="https://damians.me/assets/lece-BgXUQydX.jpeg" alt="lecenawakacje.pl">
        <div class="client-info">
          <span class="client-name">lecenawakacje.pl</span>
          <span class="client-stat">17,5 tys. obserwujących</span>
        </div>
      </div>
    </div>
    <!-- Duplikat dla seamless loop -->
    <div class="clients-marquee__item">
      <div class="client-pill">
        <img class="client-avatar" src="https://damians.me/assets/lala-B45sWAN9.jpg" alt="lalahorosz">
        <div class="client-info">
          <span class="client-name">lalahorosz</span>
          <span class="client-stat">124 tys. obserwujących</span>
        </div>
      </div>
    </div>
    <div class="clients-marquee__item">
      <div class="client-pill">
        <img class="client-avatar" src="https://damians.me/assets/wyjdz-C2HFFaFj.jpg" alt="wyjdzdoswiata">
        <div class="client-info">
          <span class="client-name">wyjdzdoswiata</span>
          <span class="client-stat">3,7 tys. obserwujących</span>
        </div>
      </div>
    </div>
    <div class="clients-marquee__item">
      <div class="client-pill">
        <img class="client-avatar" src="https://damians.me/assets/mar-CmwDAcJn.jpg" alt="Marketing HERO">
        <div class="client-info">
          <span class="client-name">Marketing HERO</span>
          <span class="client-stat">17,7 tys. subskrybentów</span>
        </div>
      </div>
    </div>
    <div class="clients-marquee__item">
      <div class="client-pill">
        <img class="client-avatar" src="https://damians.me/assets/lece-BgXUQydX.jpeg" alt="lecenawakacje.pl">
        <div class="client-info">
          <span class="client-name">lecenawakacje.pl</span>
          <span class="client-stat">17,5 tys. obserwujących</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Krok 2: Zaktualizuj CSS klientów w `style.css`**

Znajdź `.clients-marquee__item`, `.clients-marquee__item span`, `.clients-marquee__item small` i zastąp całą tę grupę:

```css
.clients-marquee__item {
  flex-shrink: 0;
}

.client-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-3);
  border: 1px solid var(--border);
  border-radius: 40px;
  padding: 8px 18px 8px 8px;
}

.client-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border);
  flex-shrink: 0;
  display: block;
}

.client-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.client-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  white-space: nowrap;
}

.client-stat {
  font-size: 10px;
  color: var(--text-muted);
  white-space: nowrap;
}
```

- [ ] **Krok 3: Sprawdź w przeglądarce**

Sekcja "Zaufali mi" powinna pokazywać 4 klienta jako pill-kapsułki z okrągłymi avatarami, scrollujące płynnie w pętli.

- [ ] **Krok 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: realizacje — client pills with circular avatars from damians.me"
```

---

## Task 5: Realizacje — thumbnails kart video

**Files:**
- Modify: `index.html` — sekcja `.video-carousel` (linie 106–153)
- Modify: `style.css` — sekcja `/* Video carousel */`

- [ ] **Krok 1: Dodaj `<img>` do każdej `.video-card__thumb` w `index.html`**

Zastąp całą zawartość `.video-carousel`:

```html
<div class="video-carousel" id="videoCarousel">
  <div class="video-card reveal">
    <div class="video-card__thumb">
      <img src="https://img.youtube.com/vi/gRyYbjvCSIg/maxresdefault.jpg"
           alt="Nauka. To Lubię" class="video-card__img">
      <a href="https://www.youtube.com/shorts/gRyYbjvCSIg" target="_blank" rel="noopener noreferrer" class="video-card__link">
        <div class="video-card__play">▶</div>
        <div class="video-card__overlay"><span>Nauka. To Lubię</span><small>YouTube Shorts</small></div>
      </a>
    </div>
    <p class="video-card__name">Nauka. To Lubię</p>
  </div>
  <div class="video-card reveal">
    <div class="video-card__thumb">
      <img src="https://damians.me/assets/bezplanu-DpYNCjSC.jpg"
           alt="BezPlanu" class="video-card__img">
      <a href="https://www.tiktok.com/@bezplanuvlog/video/7499474501663460630" target="_blank" rel="noopener noreferrer" class="video-card__link">
        <div class="video-card__play">▶</div>
        <div class="video-card__overlay"><span>BezPlanu</span><small>TikTok</small></div>
      </a>
    </div>
    <p class="video-card__name">BezPlanu</p>
  </div>
  <div class="video-card reveal">
    <div class="video-card__thumb">
      <img src="https://damians.me/assets/podroze-wojownika-Dw4hbbQk.png"
           alt="Podróże Wojownika" class="video-card__img">
      <a href="https://www.instagram.com/reel/C-Z5l3QPmlB/" target="_blank" rel="noopener noreferrer" class="video-card__link">
        <div class="video-card__play">▶</div>
        <div class="video-card__overlay"><span>Podróże Wojownika</span><small>Instagram Reels</small></div>
      </a>
    </div>
    <p class="video-card__name">Podróże Wojownika</p>
  </div>
  <div class="video-card reveal">
    <div class="video-card__thumb">
      <img src="https://img.youtube.com/vi/U08aU-D08I8/maxresdefault.jpg"
           alt="Nauka. To Lubię #2" class="video-card__img">
      <a href="https://www.youtube.com/shorts/U08aU-D08I8" target="_blank" rel="noopener noreferrer" class="video-card__link">
        <div class="video-card__play">▶</div>
        <div class="video-card__overlay"><span>Nauka. To Lubię</span><small>YouTube Shorts</small></div>
      </a>
    </div>
    <p class="video-card__name">Nauka. To Lubię #2</p>
  </div>
  <div class="video-card reveal">
    <div class="video-card__thumb">
      <img src="https://img.youtube.com/vi/A8CXzBEvY-w/maxresdefault.jpg"
           alt="Nauka. To Lubię #3" class="video-card__img">
      <a href="https://www.youtube.com/shorts/A8CXzBEvY-w" target="_blank" rel="noopener noreferrer" class="video-card__link">
        <div class="video-card__play">▶</div>
        <div class="video-card__overlay"><span>Nauka. To Lubię</span><small>YouTube Shorts</small></div>
      </a>
    </div>
    <p class="video-card__name">Nauka. To Lubię #3</p>
  </div>
</div>
```

- [ ] **Krok 2: Dodaj CSS dla `.video-card__img` w `style.css`** (po regule `.video-card__thumb`)

```css
.video-card__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

- [ ] **Krok 3: Sprawdź w przeglądarce**

Karty video powinny wyświetlać:
- "Nauka. To Lubię" (×3): thumbnail z YouTube, wyraźny (nie pikselowany)
- "BezPlanu": thumbnail z damians.me
- "Podróże Wojownika": thumbnail z damians.me
- Overlay gradient + przycisk ▶ widoczne na każdej karcie

- [ ] **Krok 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: realizacje — real video thumbnails (YouTube maxres + damians.me)"
```

---

## Self-review

**Pokrycie speca:**
- ✅ Boczna oś czasu z węzłami (Task 1, 2, 3)
- ✅ Staggered reveal transitions (Task 2, 3)
- ✅ Usunięcie ghost numbera, dots, progress bar (Task 1, 2, 3)
- ✅ Klienci z okrągłymi avatarami (Task 4)
- ✅ Video thumbnails — YouTube maxresdefault + damians.me (Task 5)
- ✅ Mobile — timeline ukryta, kroki statyczne (Task 2)
- ✅ Reduced motion — transitions wyłączone (Task 2)

**Placeholder scan:** Brak TBD/TODO — każdy krok zawiera pełny kod.

**Type consistency:** Klasy HTML (`tl-node`, `node-line`, `step-block`, `nodes-col`, `step-area`, `client-pill`, `client-avatar`, `video-card__img`) używane spójnie w HTML, CSS i JS.
