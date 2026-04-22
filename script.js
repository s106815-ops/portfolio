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
const procesBgNum = document.getElementById('procesBgNum');
const procesProgressFill = document.getElementById('procesProgressFill');
const procesSteps = document.querySelectorAll('.proces__step');
const procesDotBtns = document.querySelectorAll('.proces__dot');

if (procesScrollWrap && window.matchMedia('(min-width: 769px)').matches) {
  let currentStepIdx = 0;
  let lastScrollStepIdx = -1;

  function goToStep(idx) {
    if (idx === currentStepIdx) return;

    const oldStep = procesSteps[currentStepIdx];
    const newStep = procesSteps[idx];

    oldStep.classList.remove('active');
    oldStep.classList.add('exiting');
    const captured = oldStep;
    setTimeout(() => captured.classList.remove('exiting'), 450);

    newStep.classList.add('active');
    currentStepIdx = idx;

    procesBgNum.classList.add('fading');
    setTimeout(() => {
      procesBgNum.textContent = String(idx + 1).padStart(2, '0');
      procesBgNum.classList.remove('fading');
    }, 220);

    procesDotBtns.forEach((dot, i) => dot.classList.toggle('active', i === idx));
    procesProgressFill.style.width = `${((idx + 1) / 5) * 100}%`;
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

  procesDotBtns.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.idx, 10);
      const stepHeight = procesScrollWrap.offsetHeight / 5;
      const wrapTop = procesScrollWrap.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: wrapTop + idx * stepHeight, behavior: 'smooth' });
    });
  });
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
