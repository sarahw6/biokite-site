/* ═══════════════════════════════════════════════
   BioKite Labs · Marketing Engine v2.0
   Premium interactions, animations, and engagement
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── PAGE LOAD ANIMATION ─── */
  window.addEventListener('load', () => {
    document.documentElement.classList.add('js-loaded');
  });

  /* ─── READING PROGRESS BAR ─── */
  const progressBar = document.getElementById('readingProgress');
  if (progressBar) {
    const updateProgress = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      progressBar.style.width = Math.min(pct, 100) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ─── ANIMATED NUMBER COUNTERS ─── */
  function animateCounter(el) {
    const raw = el.dataset.count;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const target = parseFloat(raw.replace(/,/g, ''));
    const decimals = (raw.includes('.') ? raw.split('.')[1].length : 0);
    const duration = 2200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      let display = current.toFixed(decimals);
      if (target >= 1000 && decimals === 0) {
        display = Math.round(current).toLocaleString('en-US');
      }
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    el.classList.add('counted');
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.classList.contains('counted')) {
        animateCounter(e.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ─── BACK TO TOP WITH PROGRESS RING ─── */
  const backToTop = document.getElementById('backToTopBtn');
  if (backToTop) {
    const circle = backToTop.querySelector('.progress-ring-circle');
    const radius = circle ? parseFloat(circle.getAttribute('r')) : 0;
    const circumference = 2 * Math.PI * radius;
    if (circle) {
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = circumference;
    }

    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = h.scrollTop / (h.scrollHeight - h.clientHeight);
      backToTop.classList.toggle('visible', h.scrollTop > 400);
      if (circle) {
        circle.style.strokeDashoffset = circumference - (pct * circumference);
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── PARTNER LOGO INFINITE MARQUEE ─── */
  document.querySelectorAll('.logo-marquee-track').forEach(track => {
    const clone = track.innerHTML;
    track.innerHTML = clone + clone;
  });


  /* ─── COOKIE CONSENT ─── */
  const cookieBanner = document.getElementById('cookieConsent');
  if (cookieBanner && !localStorage.getItem('bk-cookies')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 2500);
    const acceptBtn = cookieBanner.querySelector('.cookie-accept');
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('bk-cookies', '1');
        cookieBanner.classList.remove('visible');
      });
    }
  }

  /* ─── MAGNETIC BUTTON EFFECT ─── */
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.12) + 'px,' + (y * 0.12) + 'px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      btn.style.transform = 'translate(0,0)';
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });

  /* ─── TILT CARDS ─── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = 'perspective(800px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  /* ─── STAGGERED REVEAL ─── */
  const staggerObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const children = e.target.querySelectorAll('.stagger-child');
        children.forEach((child, i) => {
          child.style.transitionDelay = (i * 0.08) + 's';
          child.classList.add('visible');
        });
        staggerObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-parent').forEach(el => staggerObs.observe(el));

  /* ─── FAQ ACCORDION ─── */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ─── NEWSLETTER FORM HANDLING ─── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      const origText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.innerHTML = '<p class="newsletter-success">You\'re in! Watch your inbox for impact updates from Narok County.</p>';
        } else {
          btn.textContent = origText;
          btn.disabled = false;
        }
      } catch {
        btn.textContent = origText;
        btn.disabled = false;
      }
    });
  });

  /* ─── PARALLAX ELEMENTS ─── */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length) {
    window.addEventListener('scroll', () => {
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (rect.top - window.innerHeight / 2) * speed;
          el.style.transform = 'translateY(' + offset + 'px)';
        }
      });
    }, { passive: true });
  }

  /* ─── TYPEWRITER EFFECT ─── */
  document.querySelectorAll('[data-typewriter]').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    el.style.borderRight = '2px solid var(--lime-green)';

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          let i = 0;
          const speed = parseInt(el.dataset.typewriter) || 40;
          const interval = setInterval(() => {
            el.textContent = text.slice(0, ++i);
            if (i >= text.length) {
              clearInterval(interval);
              setTimeout(() => { el.style.borderRight = 'none'; }, 800);
            }
          }, speed);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  });

  /* ─── ENHANCED FORM SUBMIT FEEDBACK ─── */
  document.querySelectorAll('.contact-form, .gate-form').forEach(form => {
    if (form.dataset.enhanced) return;
    form.dataset.enhanced = '1';
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      if (!btn || btn.disabled) return;
      const origHTML = btn.innerHTML;
      btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10" stroke-dasharray="50" stroke-dashoffset="20"/></svg>' +
        'Sending...</span>';
      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          form.innerHTML = '<div style="text-align:center;padding:2rem 0;">' +
            '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--lime-green)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="16 8 10 16 7 13"/></svg>' +
            '<p style="color:var(--lime-green);font-size:1.1rem;font-weight:600;margin-top:12px;">Thank you! We\'ll be in touch within 24 hours.</p></div>';
        } else {
          btn.innerHTML = origHTML;
          btn.disabled = false;
        }
      } catch {
        btn.innerHTML = origHTML;
        btn.disabled = false;
      }
    });
  });

  /* ─── FUNDRAISING PROGRESS BAR ANIMATION ─── */
  const progressFills = document.querySelectorAll('.progress-bar-fill[data-target]');
  if (progressFills.length) {
    const progressObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const target = e.target.dataset.target || '0';
          setTimeout(() => { e.target.style.width = target + '%'; }, 300);
          progressObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    progressFills.forEach(el => progressObs.observe(el));
  }

  /* ─── COUNTER FOR AMINA SECTION (homepage only) ─── */
  const liveLost = document.getElementById('liveLost');
  const liveChildLost = document.getElementById('liveChildLost');
  if (liveLost && liveChildLost) {
    const pageLoadTime = Date.now();
    const MOTHER_RATE = 2.9 * 60 * 1000;
    const CHILD_RATE = 11 * 1000;
    function updateLiveCounters() {
      const elapsed = Date.now() - pageLoadTime;
      liveLost.textContent = Math.floor(elapsed / MOTHER_RATE);
      liveChildLost.textContent = Math.floor(elapsed / CHILD_RATE);
      requestAnimationFrame(updateLiveCounters);
    }
    updateLiveCounters();
  }

})();
