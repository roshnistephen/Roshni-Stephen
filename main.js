/* ==========================================================================
   Roshni Stephen — portfolio / résumé
   Nav drawer · header state · scroll spy · reveals · project filters ·
   floating WhatsApp · print · hero particles

   No dependencies, no build step.
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * 1. Mobile navigation drawer
   * ------------------------------------------------------------------ */
  (() => {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const scrim = document.getElementById('navScrim');
    if (!nav || !toggle || !scrim) return;

    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      scrim.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';

      // hidden must lag the class so the scrim can fade out before it leaves the box tree.
      if (open) scrim.hidden = false;
      else setTimeout(() => { scrim.hidden = true; }, 200);
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    scrim.addEventListener('click', () => setOpen(false));

    // Any in-drawer link or the résumé button closes it.
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Leaving the mobile breakpoint must not strand the drawer open.
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => {
      if (e.matches) setOpen(false);
    });
  })();

  /* ------------------------------------------------------------------ *
   * 2. Header shadow once the page leaves the top
   * ------------------------------------------------------------------ */
  (() => {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        header.classList.toggle('is-stuck', window.scrollY > 12);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ------------------------------------------------------------------ *
   * 3. Scroll spy — highlight the nav link for the section in view
   * ------------------------------------------------------------------ */
  (() => {
    const links = [...document.querySelectorAll('.nav__link')];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const setActive = (id) => {
      links.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
      });
    };

    // Watch a band across the middle of the viewport so the active link
    // changes when a section genuinely occupies the screen.
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach((section) => observer.observe(section));
  })();

  /* ------------------------------------------------------------------ *
   * 4. Reveal on scroll
   * ------------------------------------------------------------------ */
  (() => {
    const items = [...document.querySelectorAll('.reveal')];
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // Stagger siblings that enter together, but cap it so nothing lags.
        entry.target.style.transitionDelay = `${Math.min(i * 70, 280)}ms`;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach((el) => observer.observe(el));
  })();

  /* ------------------------------------------------------------------ *
   * 5. Project filters
   * ------------------------------------------------------------------ */
  (() => {
    const buttons = [...document.querySelectorAll('.filter')];
    const projects = [...document.querySelectorAll('#workGrid .project')];
    const empty = document.getElementById('workEmpty');
    if (!buttons.length || !projects.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        buttons.forEach((b) => {
          const active = b === button;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });

        let shown = 0;
        projects.forEach((project) => {
          const match = filter === 'all' || project.dataset.category === filter;
          project.classList.toggle('is-hidden', !match);
          if (match) shown += 1;
        });

        if (empty) empty.hidden = shown > 0;
      });
    });
  })();

  /* ------------------------------------------------------------------ *
   * 6. Résumé — the page's own print stylesheet does the formatting
   * ------------------------------------------------------------------ */
  document.querySelectorAll('[data-print]').forEach((button) => {
    button.addEventListener('click', () => window.print());
  });

  /* ------------------------------------------------------------------ *
   * 7. Footer year
   * ------------------------------------------------------------------ */
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ------------------------------------------------------------------ *
   * 8. Hero particles
   *
   * Slow-drifting translucent sky-blue discs. Deliberately quiet: low count,
   * low opacity, sub-pixel speeds, no connecting lines. Skipped entirely for
   * reduced-motion, and paused whenever the hero scrolls away or the tab is
   * hidden so it never burns battery in the background.
   * ------------------------------------------------------------------ */
  (() => {
    const canvas = document.getElementById('particles');
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const TINTS = ['56, 189, 248', '2, 132, 199', '125, 211, 252'];

    let particles = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = null;
    let onScreen = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area, capped so a wide monitor stays calm.
      const count = Math.min(Math.round((width * height) / 26000), 42);
      particles = Array.from({ length: count }, () => spawn());
    };

    const spawn = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 4.5,
      // Mostly upward drift, with a lazy sideways wander.
      vx: (Math.random() - 0.5) * 0.14,
      vy: -(0.05 + Math.random() * 0.16),
      alpha: 0.12 + Math.random() * 0.22,
      tint: TINTS[Math.floor(Math.random() * TINTS.length)],
      // Phase offset so the fade-breathing never syncs up across particles.
      phase: Math.random() * Math.PI * 2,
      drift: 0.15 + Math.random() * 0.4
    });

    const draw = (time) => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + Math.sin(time / 3200 + p.phase) * 0.06 * p.drift;
        p.y += p.vy;

        // Wrap rather than respawn, so density never visibly dips.
        if (p.y < -p.r * 2) { p.y = height + p.r * 2; p.x = Math.random() * width; }
        if (p.x < -p.r * 2) p.x = width + p.r * 2;
        if (p.x > width + p.r * 2) p.x = -p.r * 2;

        // Slow breathing keeps it alive without ever drawing the eye.
        const breathe = 0.75 + Math.sin(time / 2400 + p.phase) * 0.25;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        gradient.addColorStop(0, `rgba(${p.tint}, ${p.alpha * breathe})`);
        gradient.addColorStop(1, `rgba(${p.tint}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    const start = () => { if (frame === null) frame = requestAnimationFrame(draw); };
    const stop = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    };

    const sync = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };

    resize();
    sync();

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    }, { passive: true });

    document.addEventListener('visibilitychange', sync);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      }, { threshold: 0 }).observe(canvas);
    }
  })();
})();
