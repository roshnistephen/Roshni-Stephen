/* ==========================================================================
   Roshni Stephen — Portfolio
   UI behaviour: navigation, scroll state, reveals, project filters, hero canvas.
   ========================================================================== */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Run a callback at most once per animation frame. */
  const onFrame = (fn) => {
    let queued = false;
    return (...args) => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        fn(...args);
      });
    };
  };

  /* ------------------------------------------------------------------
     Header: stuck state + reading progress
     ------------------------------------------------------------------ */
  const header = $('#header');
  const progress = $('#progress');
  const toTop = $('#toTop');

  const updateScrollState = onFrame(() => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-stuck', y > 8);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : '0');
    }

    if (toTop) toTop.classList.toggle('is-visible', y > 500);
  });

  /* ------------------------------------------------------------------
     Back to top
     ------------------------------------------------------------------ */
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  updateScrollState();

  /* ------------------------------------------------------------------
     Mobile navigation drawer
     ------------------------------------------------------------------ */
  const nav = $('#nav');
  const navToggle = $('#navToggle');
  const navScrim = $('#navScrim');

  if (nav && navToggle && navScrim) {
    let lastFocused = null;

    const setNav = (open) => {
      nav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';

      if (open) {
        lastFocused = document.activeElement;
        navScrim.hidden = false;
        requestAnimationFrame(() => {
          navScrim.classList.add('is-open');
          // The drawer is `visibility: hidden` until `.is-open` is applied, and
          // focus() is a no-op on a hidden subtree — so wait for the next frame.
          const first = nav.querySelector('a, button');
          if (first) first.focus({ preventScroll: true });
        });
      } else {
        navScrim.classList.remove('is-open');
        // Wait for the fade-out before removing it from the a11y tree.
        setTimeout(() => { if (!nav.classList.contains('is-open')) navScrim.hidden = true; }, 320);
        // Return focus where it came from, falling back to the toggle so keyboard
        // users never get dumped back at the top of the document.
        const restore = lastFocused instanceof HTMLElement && lastFocused !== document.body
          ? lastFocused
          : navToggle;
        restore.focus({ preventScroll: true });
      }
    };

    const isOpen = () => nav.classList.contains('is-open');

    navToggle.addEventListener('click', () => setNav(!isOpen()));
    navScrim.addEventListener('click', () => setNav(false));

    // Close on link tap so the target section is actually visible.
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a') && isOpen()) setNav(false);
    });

    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;

      if (e.key === 'Escape') {
        setNav(false);
        return;
      }

      // Keep Tab inside the open drawer — it behaves as a modal.
      if (e.key === 'Tab') {
        const focusables = $$('a[href], button:not([disabled])', nav);
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Reset drawer state if the viewport grows past the mobile breakpoint.
    const desktop = window.matchMedia('(min-width: 861px)');
    const syncBreakpoint = (e) => { if (e.matches && isOpen()) setNav(false); };
    desktop.addEventListener('change', syncBreakpoint);
  }

  /* ------------------------------------------------------------------
     Active section highlighting
     ------------------------------------------------------------------ */
  const navLinks = $$('.nav__link');
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute('href');
      return id && id.startsWith('#') ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      // Pick the entry closest to the top of the viewport that is on screen.
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ------------------------------------------------------------------
     Reveal on scroll, with a stagger inside each grid
     ------------------------------------------------------------------ */
  const revealables = $$('.reveal');

  if (!('IntersectionObserver' in window) || prefersReducedMotion.matches) {
    revealables.forEach((el) => el.classList.add('is-visible'));
  } else {
    // Stagger siblings so grids cascade instead of popping in all at once.
    const groups = new Map();
    revealables.forEach((el) => {
      const parent = el.parentElement;
      const index = groups.get(parent) ?? 0;
      groups.set(parent, index + 1);
      el.style.setProperty('--reveal-delay', `${Math.min(index, 6) * 70}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------
     Project filters
     ------------------------------------------------------------------ */
  const filters = $$('.filter');
  const workCards = $$('#workGrid .card--work');
  const workEmpty = $('#workEmpty');

  if (filters.length && workCards.length) {
    filters.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.dataset.filter;

        filters.forEach((other) => {
          const active = other === button;
          other.classList.toggle('is-active', active);
          other.setAttribute('aria-pressed', String(active));
        });

        let shown = 0;
        workCards.forEach((card) => {
          const match = target === 'all' || card.dataset.category === target;
          card.classList.toggle('is-hidden', !match);
          if (match) shown += 1;
        });

        if (workEmpty) workEmpty.hidden = shown > 0;
      });
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------
     Hero particle field
     Scoped to the hero only, DPR-aware, and paused whenever it is off
     screen or the tab is hidden so it costs nothing below the fold.
     ------------------------------------------------------------------ */
  const canvas = $('#heroCanvas');
  const hero = $('.hero');

  if (canvas && hero && !prefersReducedMotion.matches) {
    const ctx = canvas.getContext('2d', { alpha: true });

    if (ctx) {
      const CONFIG = {
        density: 22000,   // one particle per N css pixels of hero area
        maxParticles: 46,
        linkDistance: 130,
        speed: 0.22,
        dotColor: 'rgba(0, 151, 167, ',
        lineColor: 'rgba(0, 188, 212, '
      };

      let particles = [];
      let width = 0;
      let height = 0;
      let dpr = 1;
      let rafId = null;
      let running = false;

      const seed = () => {
        const count = Math.min(Math.floor((width * height) / CONFIG.density), CONFIG.maxParticles);
        particles = Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * CONFIG.speed,
          vy: (Math.random() - 0.5) * CONFIG.speed,
          r: Math.random() * 1.8 + 1,
          a: Math.random() * 0.35 + 0.18
        }));
      };

      const resize = () => {
        const rect = hero.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        seed();
      };

      const draw = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < -10) p.x = width + 10;
          else if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          else if (p.y > height + 10) p.y = -10;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `${CONFIG.dotColor}${p.a})`;
          ctx.fill();

          // Only look forward so each pair is linked once.
          for (let j = i + 1; j < particles.length; j += 1) {
            const q = particles[j];
            const dx = p.x - q.x;
            const dy = p.y - q.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < CONFIG.linkDistance * CONFIG.linkDistance) {
              const alpha = (1 - Math.sqrt(distSq) / CONFIG.linkDistance) * 0.16;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.strokeStyle = `${CONFIG.lineColor}${alpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }

        rafId = requestAnimationFrame(draw);
      };

      const start = () => {
        if (running) return;
        running = true;
        rafId = requestAnimationFrame(draw);
      };

      const stop = () => {
        running = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
      };

      resize();
      start();

      const onResize = onFrame(resize);
      window.addEventListener('resize', onResize, { passive: true });

      // Stop the loop once the hero scrolls away.
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          entries[0].isIntersecting ? start() : stop();
        }, { threshold: 0 }).observe(hero);
      }

      document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : start();
      });

      // Drop the animation entirely if the user turns motion off mid-session.
      prefersReducedMotion.addEventListener('change', (e) => {
        if (e.matches) {
          stop();
          ctx.clearRect(0, 0, width, height);
        } else {
          start();
        }
      });
    }
  }
})();
