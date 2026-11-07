(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');

  // Grow each circle only as far as its button needs, so the full hover duration
  // stays visible instead of an oversized circle covering the pill immediately.
  const fillButtons = [...document.querySelectorAll('.button')].filter(button => button.querySelector('.button-arrow'));
  const sizeButtonFill = button => {
    const bounds = button.getBoundingClientRect();
    const arrow = button.querySelector('.button-arrow').getBoundingClientRect();
    if (!bounds.width || !arrow.width) return;
    const x = arrow.left + arrow.width / 2 - bounds.left;
    const y = arrow.top + arrow.height / 2 - bounds.top;
    const radius = Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y)) + 2;
    button.style.setProperty('--button-fill-scale', String(radius / (arrow.width / 2)));
  };
  fillButtons.forEach(sizeButtonFill);
  document.fonts.ready.then(() => fillButtons.forEach(sizeButtonFill));
  if ('ResizeObserver' in window) {
    const fillObserver = new ResizeObserver(entries => {
      const changed = new Set(entries.map(entry => entry.target.closest('.button')));
      changed.forEach(sizeButtonFill);
    });
    fillButtons.forEach(button => {
      fillObserver.observe(button);
      fillObserver.observe(button.querySelector('.button-arrow'));
    });
  }

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

  // --- Sliding Active Navigation Indicator ---
  const indicator = document.querySelector('.nav-indicator');
  const getActiveNavLink = () => nav?.querySelector('a[aria-current="page"]:not(.button)');

  const moveIndicatorTo = (target) => {
    if (!indicator || !nav || window.innerWidth <= 960) return;
    if (!target || !nav.contains(target)) {
      indicator.style.setProperty('--nav-opacity', '0');
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const x = targetRect.left - navRect.left;
    const w = targetRect.width;
    indicator.style.setProperty('--nav-x', `${x}px`);
    indicator.style.setProperty('--nav-w', `${w}px`);
    indicator.style.setProperty('--nav-opacity', '1');
  };

  const updateNavIndicator = () => {
    const active = getActiveNavLink();
    moveIndicatorTo(active);
  };

  if (nav && indicator) {
    const regularLinks = nav.querySelectorAll('a:not(.button)');
    regularLinks.forEach(link => {
      link.addEventListener('mouseenter', () => moveIndicatorTo(link));
      link.addEventListener('focus', () => moveIndicatorTo(link));
    });
    nav.addEventListener('mouseleave', updateNavIndicator);
    window.addEventListener('resize', updateNavIndicator);
    document.fonts.ready.then(updateNavIndicator);
  }

  // Keep native page navigation, with a short press/exit response before leaving.
  let pageNavigationPending = false;
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
    const next = new URL(link.href, location.href);
    if (next.origin !== location.origin || !['http:', 'https:', 'file:'].includes(next.protocol)) return;
    if (next.pathname === location.pathname && next.search === location.search) return;
    if (reducedMotion.matches) return;
    event.preventDefault();
    if (pageNavigationPending) return;
    pageNavigationPending = true;
    link.classList.add('is-pressed');
    document.querySelector('#main')?.classList.add('is-leaving');
    setTimeout(() => location.assign(next.href), 160);
  });
  window.addEventListener('pageshow', () => {
    pageNavigationPending = false;
    document.querySelector('#main')?.classList.remove('is-leaving');
    document.querySelectorAll('.is-pressed').forEach(link => link.classList.remove('is-pressed'));
  });

  // --- Scroll & Reading Progress ---
  let scrollFrame = 0;
  const updateScroll = () => {
    scrollFrame = 0;
    const y = window.scrollY;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const threshold = window.innerHeight * 0.3;
    header?.classList.toggle('scrolled', y >= threshold);
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
    document.querySelectorAll('.expertise-grid, .home-b2b-grid, .home-pest-grid, .service-grid, .branch-visual-grid, .about-divisions-grid, .steps, .contact-grid, .intro-grid').forEach(group => {
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

  // --- Enquiry & Certificate Forms: Robust Validation & Clean UX ---
  const initForms = () => {
    const params = new URLSearchParams(window.location.search);
    const service = document.querySelector('#service');
    if (service && [...service.options].some(option => option.value === params.get('service'))) {
      service.value = params.get('service');
    }
    const location = document.querySelector('#location');
    if (location && params.get('location')) location.value = params.get('location').slice(0, 200);
    const serviceNote = document.querySelector('[data-service-note]');
    let serviceGuides = {};
    try { serviceGuides = JSON.parse(document.getElementById('specs-data')?.textContent || '{}'); } catch { /* The form still works without service hints. */ }
    const updateServiceNote = () => {
      if (!service || !serviceNote) return;
      const selected = serviceGuides[service.value];
      serviceNote.hidden = !selected;
      if (selected) {
        serviceNote.querySelector('[data-service-name]').textContent = selected.title;
        serviceNote.querySelector('[data-service-guidance]').textContent = selected.guidance;
      }
    };
    service?.addEventListener('change', updateServiceNote);
    updateServiceNote();
    const isQuote = params.get('request') === 'quote';
    const heading = document.querySelector('[data-form-heading]');
    if (heading && isQuote) heading.textContent = 'Request a service quote';
    const dateInput = document.querySelector('#preferred-date');
    if (dateInput) dateInput.min = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

    // Field Error Helpers
    const setError = (input, errorEl, msg) => {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
      input.setCustomValidity(msg);
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.add('is-visible');
      }
    };

    const clearError = (input, errorEl, markValid = false) => {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
      input.setCustomValidity('');
      const val = input.type === 'checkbox' ? input.checked : input.value.trim();
      if (markValid && val) {
        input.classList.add('is-valid');
      } else {
        input.classList.remove('is-valid');
      }
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
      }
    };

    // Single Field Validator
    const validateField = (input, showError = true) => {
      const errorEl = input.closest('.field')?.querySelector('.field-error');
      const name = input.name;
      const rawVal = input.value || '';
      const val = rawVal.trim();

      // Full Name Validation: Letters, spaces, dots, hyphens only - NO NUMBERS ALLOWED
      if (name === 'name') {
        if (!val) {
          if (input.required && showError) {
            setError(input, errorEl, 'Please enter your full name.');
            return false;
          }
          clearError(input, errorEl);
          return !input.required;
        }
        if (/\d/.test(val)) {
          setError(input, errorEl, 'Name cannot contain numbers. Please use letters only.');
          return false;
        }
        if (val.length < 2) {
          if (showError) setError(input, errorEl, 'Name must be at least 2 characters.');
          return false;
        }
        if (!/^[\p{L}\p{M}\s.'\-\/]+$/u.test(val)) {
          setError(input, errorEl, 'Please enter a valid name using letters only.');
          return false;
        }
        clearError(input, errorEl, true);
        return true;
      }

      // Phone Number Validation: Digits and formatting symbols only - NO LETTERS ALLOWED
      if (name === 'phone') {
        if (!val) {
          if (input.required && showError) {
            setError(input, errorEl, 'Please enter your direct phone number.');
            return false;
          }
          clearError(input, errorEl);
          return !input.required;
        }
        if (/[a-zA-Z]/.test(rawVal)) {
          setError(input, errorEl, 'Phone number cannot contain letters. Please enter digits only.');
          return false;
        }
        const digits = rawVal.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) {
          if (showError) setError(input, errorEl, 'Please enter a valid phone number (7 to 15 digits, e.g. +91 98765 43210).');
          return false;
        }
        clearError(input, errorEl, true);
        return true;
      }

      // Email Validation (Optional or Required)
      if (name === 'email') {
        if (!val) {
          if (input.required && showError) {
            setError(input, errorEl, 'Please enter a work email address.');
            return false;
          }
          clearError(input, errorEl);
          return !input.required;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
          if (showError) setError(input, errorEl, 'Please enter a valid email address (e.g. operations@company.com).');
          return false;
        }
        clearError(input, errorEl, true);
        return true;
      }

      // Treatment Location Validation
      if (name === 'location') {
        if (!val) {
          if (input.required && showError) {
            setError(input, errorEl, 'Please enter the treatment location or city.');
            return false;
          }
          clearError(input, errorEl);
          return !input.required;
        }
        if (val.length < 3) {
          if (showError) setError(input, errorEl, 'Location must be at least 3 characters.');
          return false;
        }
        if (!/[a-zA-Z]/.test(val)) {
          setError(input, errorEl, 'Location must include a city or facility name (e.g. Mundra Port CFS).');
          return false;
        }
        clearError(input, errorEl, true);
        return true;
      }

      // Certificate / Container Reference Validation
      if (name === 'reference') {
        if (!val) {
          if (input.required && showError) {
            setError(input, errorEl, 'Please enter the certificate or container reference.');
            return false;
          }
          clearError(input, errorEl);
          return !input.required;
        }
        if (val.length < 3) {
          if (showError) setError(input, errorEl, 'Reference must be at least 3 characters.');
          return false;
        }
        clearError(input, errorEl, true);
        return true;
      }

      // Service Select Validation
      if (name === 'service') {
        if (input.required && !val) {
          if (showError) setError(input, errorEl, 'Please select a required service.');
          return false;
        }
        clearError(input, errorEl, true);
        return true;
      }

      // Consent Checkbox Validation
      if (name === 'consent') {
        if (input.required && !input.checked) {
          if (showError) setError(input, errorEl, 'Please check this box to agree to proceed.');
          return false;
        }
        clearError(input, errorEl, true);
        return true;
      }

      // Generic required field fallback
      if (input.required && !val) {
        if (showError) setError(input, errorEl, 'This field is required.');
        return false;
      }
      clearError(input, errorEl, Boolean(val));
      return true;
    };

    document.querySelectorAll('[data-enquiry]').forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');

      // Attach live validation on typing & blur
      inputs.forEach(input => {
        // Immediate feedback on typing if forbidden character or previously invalid
        input.addEventListener('input', () => {
          const val = input.value || '';
          const hasForbidden = (input.name === 'name' && /\d/.test(val)) ||
                               (input.name === 'phone' && /[a-zA-Z]/.test(val));
          if (hasForbidden || input.classList.contains('is-invalid')) {
            validateField(input, true);
          } else {
            validateField(input, false);
          }
        });

        // Thorough validation on leaving field
        input.addEventListener('blur', () => {
          if (input.value || input.required) {
            validateField(input, true);
          }
        });

        // For select dropdowns and checkboxes, validate on change
        input.addEventListener('change', () => {
          validateField(input, true);
        });
      });

      form.onsubmit = event => {
        event.preventDefault();

        // Validate all form fields
        let isFormValid = true;
        let firstInvalid = null;

        inputs.forEach(input => {
          const valid = validateField(input, true);
          if (!valid) {
            isFormValid = false;
            if (!firstInvalid) firstInvalid = input;
          }
        });

        if (!isFormValid) {
          if (firstInvalid) {
            const optionalSection = firstInvalid.closest('details');
            if (optionalSection) optionalSection.open = true;
            firstInvalid.focus({ preventScroll: false });
            firstInvalid.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
          }
          return;
        }

        const data = new FormData(form);
        const lines = [form.dataset.enquiry === 'certificate' ? 'Certificate enquiry — ID Pest Control Services' : isQuote ? 'Service quote request — ID Pest Control Services' : 'Service enquiry — ID Pest Control Services'];
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
        if (res && !res.hidden) {
          res.hidden = true;
          document.querySelectorAll('[data-form-step]').forEach(step => {
            const current = step.dataset.formStep === '1';
            step.classList.toggle('is-current', current);
            if (current) step.setAttribute('aria-current', 'step');
            else step.removeAttribute('aria-current');
          });
        }
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
    drawer.inert = false;
    drawer.setAttribute('aria-hidden', 'false');
    drawerBackdrop.setAttribute('aria-hidden', 'false');
    document.querySelector('main').inert = true;
    document.querySelector('.site-header').inert = true;
    document.querySelector('.site-footer').inert = true;
    document.body.classList.add('drawer-open');
    requestAnimationFrame(() => {
      if (drawer.classList.contains('is-open')) drawerClose?.focus({ preventScroll: true });
    });
  };

  const closeSpecs = () => {
    if (!drawer || !drawerBackdrop) return;
    drawerBackdrop.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.inert = true;
    drawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.setAttribute('aria-hidden', 'true');
    document.querySelector('main').inert = false;
    document.querySelector('.site-header').inert = false;
    document.querySelector('.site-footer').inert = false;
    document.body.classList.remove('drawer-open');
    if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
      lastActiveTrigger.focus();
    }
  };

  drawerClose?.addEventListener('click', closeSpecs);
  drawerBackdrop?.addEventListener('click', closeSpecs);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && drawer?.classList.contains('is-open')) {
      const controls = [...drawer.querySelectorAll('button, a[href], [tabindex="0"]')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
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

})();
