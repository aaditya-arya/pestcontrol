(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const progressBar = document.getElementById('page-transition-bar');

  // --- Mobile Menu ---
  const setMenu = (open) => {
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('is-open', open);
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!header?.contains(event.target)) setMenu(false);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  window.matchMedia('(min-width: 961px)').addEventListener('change', () => setMenu(false));

  // --- Scroll & Reading Progress ---
  let scrollFrame = 0;
  const updateScroll = () => {
    scrollFrame = 0;
    const y = window.scrollY;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    header?.classList.toggle('scrolled', y > 10);
    document.documentElement.style.setProperty('--scroll-progress', distance > 0 ? String(Math.min(1, y / distance)) : '0');
    const hero = document.querySelector('.home-hero');
    if (hero) hero.style.setProperty('--image-shift', reducedMotion.matches ? '0px' : `${Math.min(40, y * .075)}px`);
  };
  const scheduleScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  reducedMotion.addEventListener('change', scheduleScroll);
  updateScroll();

  // --- Reveal Animations ---
  let revealObserver = null;
  const initReveal = () => {
    if (!('IntersectionObserver' in window) || reducedMotion.matches) return;
    document.querySelectorAll('.expertise-grid, .service-grid, .steps, .contact-grid, .intro-grid').forEach(group => {
      [...group.children].filter(child => child.classList.contains('reveal')).forEach((child, i) => {
        child.style.setProperty('--reveal-delay', `${Math.min(i, 3) * 90}ms`);
      });
    });
    revealObserver?.disconnect();
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.documentElement.classList.add('motion-ready');
    document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
  };
  initReveal();
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      document.documentElement.classList.remove('motion-ready');
      revealObserver?.disconnect();
    } else {
      initReveal();
    }
  });

  // --- Location Explorer ---
  const initLocationExplorer = () => {
    const hubTabs = [...document.querySelectorAll('[data-hub]')];
    const hubPreview = document.querySelector('.hub-preview');
    if (!hubTabs.length || !hubPreview) return;
    hubTabs.forEach((tab, index) => {
      tab.onclick = () => {
        const card = document.getElementById(tab.dataset.hub);
        if (!card) return;
        hubTabs.forEach(button => button.setAttribute('aria-pressed', String(button === tab)));
        hubPreview.querySelector('[data-hub-city]').textContent = card.dataset.city;
        hubPreview.querySelector('[data-hub-type]').textContent = card.dataset.type;
        hubPreview.querySelector('[data-hub-description]').textContent = card.dataset.description;
        hubPreview.querySelector('[data-hub-link]').href = `#${card.id}`;
        hubPreview.classList.remove('is-changing');
        void hubPreview.offsetWidth;
        hubPreview.classList.add('is-changing');
      };
      tab.onkeydown = event => {
        const next = event.key === 'ArrowRight' ? (index + 1) % hubTabs.length : event.key === 'ArrowLeft' ? (index - 1 + hubTabs.length) % hubTabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? hubTabs.length - 1 : -1;
        if (next < 0) return;
        event.preventDefault();
        hubTabs[next].focus();
        hubTabs[next].click();
      };
    });
  };
  initLocationExplorer();

  // --- Enquiry & Certificate Forms ---
  const initForms = () => {
    const params = new URLSearchParams(window.location.search);
    const service = document.querySelector('#service');
    if (service && [...service.options].some(option => option.value === params.get('service'))) {
      service.value = params.get('service');
    }
    const isQuote = params.get('request') === 'quote';
    const heading = document.querySelector('[data-form-heading]');
    if (heading && isQuote) heading.textContent = 'Request a service quote';
    const dateInput = document.querySelector('#preferred-date');
    const now = new Date();
    if (dateInput) dateInput.min = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    document.querySelectorAll('[data-enquiry]').forEach(form => {
      const phone = form.querySelector('[name="phone"]');
      const validatePhone = () => {
        if (!phone) return;
        const digits = phone.value.replace(/\D/g, '');
        phone.setCustomValidity(digits.length >= 7 && digits.length <= 15 ? '' : 'Enter a phone number with 7 to 15 digits.');
      };
      phone?.addEventListener('input', validatePhone);
      form.onsubmit = event => {
        event.preventDefault();
        validatePhone();
        ['name', 'location', 'reference'].forEach(name => {
          const field = form.elements.namedItem(name);
          if (field) field.value = field.value.trim();
        });
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const lines = [form.dataset.enquiry === 'certificate' ? 'Certificate enquiry — ID Pest Control & Ecomax' : isQuote ? 'Service quote request — ID Pest Control & Ecomax' : 'Inspection request — ID Pest Control & Ecomax'];
        const labels = { reference: 'Certificate reference', name: 'Name', phone: 'Phone', email: 'Email', company: 'Company', location: 'Location', date: 'Preferred date', message: 'Details' };
        for (const [name, label] of Object.entries(labels)) {
          const value = data.get(name)?.toString().trim();
          if (value) lines.push(`${label}: ${value}`);
        }
        if (data.get('service') && service) lines.push(`Service: ${service.options[service.selectedIndex].textContent}`);
        const message = lines.join('\n');
        const result = form.querySelector('.enquiry-result');
        if (!result) return;
        result.querySelector('[data-whatsapp]').href = `https://wa.me/918401137910?text=${encodeURIComponent(message)}`;
        result.querySelector('[data-email]').href = `mailto:docs@ecomax.co.in?subject=${encodeURIComponent(lines[0])}&body=${encodeURIComponent(message)}`;
        result.hidden = false;
        document.querySelectorAll('[data-form-step]').forEach(step => {
          const current = step.dataset.formStep === '2';
          step.classList.toggle('is-current', current);
          if (current) step.setAttribute('aria-current', 'step');
          else step.removeAttribute('aria-current');
        });
        result.focus({ preventScroll: true });
        result.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
      };
      form.oninput = () => {
        const res = form.querySelector('.enquiry-result');
        if (res) res.hidden = true;
        document.querySelectorAll('[data-form-step]').forEach(step => {
          const current = step.dataset.formStep === '1';
          step.classList.toggle('is-current', current);
          if (current) step.setAttribute('aria-current', 'step');
          else step.removeAttribute('aria-current');
        });
      };
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = false;
    });
  };
  initForms();

  // --- In-situ Technical Specs Drawer ---
  let specsData = null;
  try {
    const raw = document.getElementById('specs-data')?.textContent;
    if (raw) specsData = JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse specs data', err);
  }

  const drawer = document.getElementById('specs-drawer');
  const drawerBackdrop = document.getElementById('specs-drawer-backdrop');
  const drawerClose = document.getElementById('specs-drawer-close');
  const drawerEyebrow = document.getElementById('specs-drawer-eyebrow');
  const drawerTitle = document.getElementById('specs-drawer-title');
  const drawerOverview = document.getElementById('specs-drawer-overview');
  const drawerGrid = document.getElementById('specs-drawer-grid');
  const drawerCta = document.getElementById('specs-drawer-cta');
  const drawerCtaText = document.getElementById('specs-drawer-cta-text');
  let lastActiveTrigger = null;

  const openSpecs = (slug, trigger) => {
    if (!specsData || !drawer || !drawerBackdrop) return;
    const item = specsData[slug] || specsData['container-fumigation'];
    if (!item) return;

    lastActiveTrigger = trigger || document.activeElement;
    if (drawerEyebrow) drawerEyebrow.textContent = item.badge || 'Technical Protocol';
    if (drawerTitle) drawerTitle.textContent = item.title;
    if (drawerOverview) drawerOverview.textContent = item.overview;
    if (drawerGrid) {
      drawerGrid.innerHTML = item.parameters.map(p => `
        <div class="spec-item">
          <span class="spec-label">${p.label}</span>
          <span class="spec-val">${p.value}</span>
        </div>
      `).join('');
    }
    if (drawerCta) drawerCta.href = item.actionHref;
    if (drawerCtaText) drawerCtaText.textContent = item.actionText;

    drawerBackdrop.classList.add('is-open');
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.setAttribute('aria-hidden', 'false');
    drawerClose?.focus();
  };

  const closeSpecs = () => {
    if (!drawer || !drawerBackdrop) return;
    drawerBackdrop.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      lastActiveTrigger.focus();
    }
  };

  drawerClose?.addEventListener('click', closeSpecs);
  drawerBackdrop?.addEventListener('click', closeSpecs);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer?.classList.contains('is-open')) {
      closeSpecs();
    }
  });

  // Delegated listener for specs triggers
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-specs]');
    if (trigger) {
      event.preventDefault();
      openSpecs(trigger.dataset.openSpecs, trigger);
    }
  });

  // --- Initial Starter Logo Animation (First Visit Only, ~3s) ---
  const initLogoIntro = () => {
    const intro = document.getElementById('logo-intro');
    const introBadge = document.getElementById('logo-intro-badge');
    const skipBtn = document.getElementById('logo-intro-skip');
    const headerBrand = document.querySelector('.site-header .brand');
    if (!intro || !introBadge || !headerBrand) return;

    // Check if previously seen in this session or prefers reduced motion
    const seen = sessionStorage.getItem('id_pest_intro_seen');
    if (seen === '1' || reducedMotion.matches) {
      intro.classList.add('is-settled');
      intro.style.display = 'none';
      return;
    }

    const settleIntro = () => {
      sessionStorage.setItem('id_pest_intro_seen', '1');
      intro.classList.add('is-settled');
      setTimeout(() => { intro.style.display = 'none'; }, 750);
    };

    skipBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      settleIntro();
    });

    intro.addEventListener('click', settleIntro);

    // Sequence: Hold center stage for 1.1s, then fly to top-left header logo over 1.4s
    setTimeout(() => {
      if (intro.classList.contains('is-settled')) return;
      const targetRect = headerBrand.getBoundingClientRect();
      const badgeRect = introBadge.getBoundingClientRect();
      const deltaX = targetRect.left - badgeRect.left;
      const deltaY = targetRect.top - badgeRect.top;
      const scale = Math.max(0.35, Math.min(0.65, targetRect.height / badgeRect.height));

      introBadge.style.transition = 'transform 1.35s cubic-bezier(.16, 1, .3, 1), opacity .5s ease';
      introBadge.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;

      const caption = intro.querySelector('.logo-intro-caption');
      if (caption) caption.style.opacity = '0';
      const backdrop = intro.querySelector('.logo-intro-backdrop');
      if (backdrop) backdrop.style.opacity = '0';

      // Settle smoothly
      setTimeout(() => {
        settleIntro();
      }, 1450);
    }, 1100);
  };
  initLogoIntro();

  // --- Fluid Page Navigation Router (Eliminating Quick Snaps) ---
  const rebindPage = () => {
    updateScroll();
    initReveal();
    initLocationExplorer();
    initForms();
    setMenu(false);
  };

  const navigateTo = async (url, push = true) => {
    if (reducedMotion.matches) {
      window.location.href = url;
      return;
    }
    try {
      if (progressBar) {
        progressBar.classList.add('is-loading');
        progressBar.style.width = '65%';
      }
      const main = document.querySelector('#main');
      if (main) main.classList.add('page-transition-exit');

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const newMain = doc.querySelector('#main');
      if (!newMain || !main) {
        window.location.href = url;
        return;
      }

      document.title = doc.title;
      if (push) history.pushState(null, '', url);

      // Update primary navigation active state
      const targetPath = new URL(url).pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('.primary-nav a').forEach(a => {
        const href = a.getAttribute('href');
        const isActive = (href === targetPath) ||
          (/^(b2b-|container-|pallet-|warehouse-)/.test(targetPath) && href === 'b2b-fumigation.html') ||
          (/^(commercial-|termite-|rodent-|general-)/.test(targetPath) && href === 'pest-control.html');
        if (isActive) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      });

      // Swap main content
      main.innerHTML = newMain.innerHTML;
      main.className = newMain.className;

      // Smoothly place viewport
      const targetHash = new URL(url).hash;
      if (targetHash) {
        const targetEl = document.querySelector(targetHash);
        if (targetEl) targetEl.scrollIntoView({ behavior: 'instant' });
        else window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 0);
      }

      if (progressBar) progressBar.style.width = '100%';
      main.classList.remove('page-transition-exit');
      main.classList.add('page-transition-enter');

      setTimeout(() => {
        main.classList.remove('page-transition-enter');
        if (progressBar) {
          progressBar.classList.remove('is-loading');
          progressBar.style.width = '0%';
        }
      }, 380);

      rebindPage();
    } catch (err) {
      console.warn('Navigation transition fallback:', err);
      window.location.href = url;
    }
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;

    if (
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('https://') ||
      href.startsWith('http://') ||
      href.startsWith('//') ||
      href.startsWith('#') ||
      href.startsWith('javascript:')
    ) {
      return;
    }

    const targetUrl = new URL(link.href, window.location.href);
    if (targetUrl.origin !== window.location.origin) return;

    // Same-page link with no hash: smoothly scroll to top
    if (targetUrl.pathname === window.location.pathname && !targetUrl.hash && !targetUrl.search) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Intercept internal page navigation for fluid transition
    event.preventDefault();
    closeSpecs();
    navigateTo(targetUrl.href);
  });

  window.addEventListener('popstate', () => {
    closeSpecs();
    navigateTo(window.location.href, false);
  });
})();
