document.documentElement.classList.add('js');

// ─── CUSTOM CURSOR ───
(function () {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button')) ring.classList.add('cursor-ring--hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button')) ring.classList.remove('cursor-ring--hover');
  });
})();

// ─── NAVBAR: scroll effect + mobile menu ───
const navbar = document.getElementById('navbar');
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (navbar) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });
}

if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ─── STATS: animowane liczniki ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
      el.classList.add('stats__number--glowing');
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stats__number').forEach(el => counterObserver.observe(el));

// ─── VIDEO CAROUSEL: strzałki ───
const carousel = document.getElementById('videoCarousel');
const prevBtn  = document.getElementById('carouselPrev');
const nextBtn  = document.getElementById('carouselNext');

if (carousel && prevBtn && nextBtn) {
  const scrollAmount = () => carousel.querySelector('.video-card').offsetWidth + 16;

  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });
}

// ─── PROCES: sticky scroll ───
const procesScrollWrap = document.getElementById('procesScrollWrap');
const procesNodes = Array.from(document.querySelectorAll('.tl-node'));
const procesLines = Array.from(document.querySelectorAll('.node-line'));
const procesBlocks = Array.from(document.querySelectorAll('.step-block'));

if (procesScrollWrap && window.matchMedia('(min-width: 769px)').matches) {
  let currentStepIdx = 0;
  let lastScrollStepIdx = -1;

  procesNodes.forEach((node, i) => {
    node.addEventListener('click', () => goToStep(i));
  });

  function goToStep(idx) {
    if (idx === currentStepIdx) return;

    // Instant-hide old step — kill transitions so exit has no animation
    const oldBlock = procesBlocks[currentStepIdx];
    oldBlock.querySelectorAll(':scope > .proces__step-num, :scope > h3, :scope > p').forEach(el => {
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
    newBlock.querySelectorAll(':scope > .proces__step-num, :scope > h3, :scope > p').forEach(el => {
      el.style.transition = '';
    });
    void newBlock.offsetHeight;
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

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Staggered delay dla elementów w tej samej sekcji
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (el === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

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
