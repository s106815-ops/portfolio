// ─── NAVBAR: scroll effect + mobile menu ───
const navbar = document.getElementById('navbar');
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

burgerBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Zamknij mobile menu po kliknięciu linku
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

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

// ─── SCROLL REVEAL ───
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
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
