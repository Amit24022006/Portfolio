/* ============================================================
   AMIT.DEV — CINEMATIC PORTFOLIO JAVASCRIPT
   Video-type animations, scroll reveals, canvas particles, typed effect
   ============================================================ */

'use strict';

/* ===========================
   PRELOADER
   =========================== */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const preBar    = document.getElementById('preBar');
  const preText   = document.getElementById('preText');

  if (!preloader || !preBar) return;

  document.body.style.overflow = 'hidden';

  const messages = ['Loading Experience…', 'Preparing Portfolio…', 'Almost Ready…'];
  let msgIdx = 0;
  let width  = 0;

  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length;
    if (preText) preText.textContent = messages[msgIdx];
  }, 600);

  const barInterval = setInterval(() => {
    width += Math.random() * 22;
    if (width >= 100) {
      width = 100;
      clearInterval(barInterval);
      clearInterval(msgInterval);
      preBar.style.width = '100%';
      if (preText) preText.textContent = 'Ready!';

      setTimeout(() => {
        preloader.classList.add('done');
        document.body.style.overflow = '';
        initCinematicReveals();
      }, 400);
    } else {
      preBar.style.width = width + '%';
    }
  }, 70);
})();

/* ===========================
   HERO CANVAS — removed (plain background)
   =========================== */

/* ===========================
   TYPED TEXT EFFECT
   =========================== */
(function initTyped() {
  const el = document.getElementById('typedWord');
  if (!el) return;

  const words  = ['responsive', 'accessible', 'fast', 'beautiful', 'scalable', 'intuitive'];
  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let timeout;

  function type() {
    const current = words[wordIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        timeout = setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
      }
    }

    timeout = setTimeout(type, deleting ? 60 : 90);
  }

  setTimeout(type, 1800);
})();

/* ===========================
   NAVBAR — SCROLL & SHRINK
   =========================== */
(function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const obsOpts = { rootMargin: '-40% 0px -55% 0px' };
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(a => {
          a.classList.toggle('nav-item-active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, obsOpts);

  sections.forEach(s => sectionObs.observe(s));
})();

/* ===========================
   MOBILE DRAWER
   =========================== */
(function initDrawer() {
  const burger   = document.getElementById('navBurger');
  const drawer   = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const close    = document.getElementById('drawerClose');
  if (!burger || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openDrawer);
  if (close) close.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-item[data-close]').forEach(el => {
    el.addEventListener('click', closeDrawer);
  });
})();

/* ===========================
   CINEMATIC SCROLL REVEALS
   =========================== */
let revealObserver;

function initCinematicReveals() {
  const revealEls = document.querySelectorAll('.cin-reveal');

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Staggered reveal based on sibling index
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.cin-reveal'));
        const sibIdx   = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (sibIdx * 0.12) + 's';

        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);

        // Trigger skill bars and progress bars inside
        triggerBars(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  revealEls.forEach(el => revealObserver.observe(el));
}

function triggerBars(container) {
  // Skill fill bars
  container.querySelectorAll('.sk-fill[data-w]').forEach(bar => {
    setTimeout(() => {
      bar.style.width = bar.dataset.w + '%';
    }, 200);
  });

  // Education progress bar
  container.querySelectorAll('.edu-prog-fill[data-w]').forEach(bar => {
    setTimeout(() => {
      bar.style.width = bar.dataset.w + '%';
    }, 300);
  });
}

/* ===========================
   PROJECT FILTER
   =========================== */
(function initProjectFilter() {
  const buttons = document.querySelectorAll('.pf-btn');
  const cards   = document.querySelectorAll('.proj-card');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.pf;

      // Update active state
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with animation
      cards.forEach(card => {
        const cat = card.dataset.cat;
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          // Small entrance animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ===========================
   SMOOTH ANCHOR SCROLL
   =========================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 68;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===========================
   HERO SCROLL FADE
   =========================== */
(function initHeroScrollFade() {
  const heroScroll = document.getElementById('heroScroll');
  if (!heroScroll) return;

  window.addEventListener('scroll', () => {
    const opacity = Math.max(0, 1 - window.scrollY / 300);
    heroScroll.style.opacity = opacity;
  }, { passive: true });
})();

/* ===========================
   NAV ACTIVE LINK STYLE
   =========================== */
const style = document.createElement('style');
style.textContent = `
  .nav-item.nav-item-active {
    color: var(--text) !important;
    background: rgba(255,255,255,0.06) !important;
  }
`;
document.head.appendChild(style);

/* ===========================
   TILT EFFECT ON PHOTO
   =========================== */
(function initPhotoTilt() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const photo = document.getElementById('hPhoto');
  if (!photo) return;

  photo.addEventListener('mousemove', (e) => {
    const rect = photo.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    photo.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
  });

  photo.addEventListener('mouseleave', () => {
    photo.style.transform = '';
    photo.style.transition = 'transform 0.5s ease';
  });

  photo.addEventListener('mouseenter', () => {
    photo.style.transition = 'transform 0.15s ease';
  });
})();

/* ===========================
   HERO EYEBROW COUNTER ANIMATION
   =========================== */
(function initCounters() {
  // Not used in this build — stat numbers are static text
})();

/* ===========================
   SCROLL TO TOP BUTTON — auto after 400px
   =========================== */
(function initScrollTop() {
  const btn = document.getElementById('backTopBtn');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();