(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
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
  // One frame per scroll event: a thin reading indicator and bounded image drift.
  const hero = document.querySelector('.home-hero');
  let scrollFrame = 0;
  const updateScroll = () => {
    scrollFrame = 0;
    const y = window.scrollY;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    header?.classList.toggle('scrolled', y > 10);
    document.documentElement.style.setProperty('--scroll-progress', distance > 0 ? String(Math.min(1, y / distance)) : '0');
    if (hero) hero.style.setProperty('--image-shift', reducedMotion.matches ? '0px' : `${Math.min(40, y * .075)}px`);
  };
  const scheduleScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); };
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  reducedMotion.addEventListener('change', scheduleScroll);
  updateScroll();

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.querySelectorAll('.expertise-grid, .service-grid, .steps, .contact-grid, .intro-grid').forEach(group => {
      [...group.children].filter(child => child.classList.contains('reveal')).forEach((child, i) => {
        child.style.setProperty('--reveal-delay', `${Math.min(i, 3) * 90}ms`);
      });
    });
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.documentElement.classList.add('motion-ready');
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {
        document.documentElement.classList.remove('motion-ready');
        observer.disconnect();
      }
    });
  }

  // The location explorer reads the same details as the full location cards.
  const hubTabs = [...document.querySelectorAll('[data-hub]')];
  const hubPreview = document.querySelector('.hub-preview');
  hubTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      const card = document.getElementById(tab.dataset.hub);
      if (!card || !hubPreview) return;
      hubTabs.forEach(button => button.setAttribute('aria-pressed', String(button === tab)));
      hubPreview.querySelector('[data-hub-city]').textContent = card.dataset.city;
      hubPreview.querySelector('[data-hub-type]').textContent = card.dataset.type;
      hubPreview.querySelector('[data-hub-description]').textContent = card.dataset.description;
      hubPreview.querySelector('[data-hub-link]').href = `#${card.id}`;
      hubPreview.classList.remove('is-changing');
      // Restart a short, local transition; no layout work during scrolling.
      void hubPreview.offsetWidth;
      hubPreview.classList.add('is-changing');
    });
    tab.addEventListener('keydown', event => {
      const next = event.key === 'ArrowRight' ? (index + 1) % hubTabs.length : event.key === 'ArrowLeft' ? (index - 1 + hubTabs.length) % hubTabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? hubTabs.length - 1 : -1;
      if (next < 0) return;
      event.preventDefault();
      hubTabs[next].focus();
      hubTabs[next].click();
    });
  });

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
      const digits = phone.value.replace(/\D/g, '');
      phone.setCustomValidity(digits.length >= 7 && digits.length <= 15 ? '' : 'Enter a phone number with 7 to 15 digits.');
    };
    phone.addEventListener('input', validatePhone);
    form.addEventListener('submit', event => {
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
      if (data.get('service')) lines.push(`Service: ${service.options[service.selectedIndex].textContent}`);
      const message = lines.join('\n');
      const result = form.querySelector('.enquiry-result');
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
    });
    // Changing details invalidates the prepared send links.
    form.addEventListener('input', () => {
      form.querySelector('.enquiry-result').hidden = true;
      document.querySelectorAll('[data-form-step]').forEach(step => {
        const current = step.dataset.formStep === '1';
        step.classList.toggle('is-current', current);
        if (current) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
    });
    form.querySelector('button[type="submit"]').disabled = false;
  });
})();
