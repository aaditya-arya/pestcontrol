(() => {
  'use strict';
  document.documentElement.classList.remove('no-js');
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
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
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
      result.focus({ preventScroll: true });
      result.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'center' });
    });
    // Changing details invalidates the prepared send links.
    form.addEventListener('input', () => { form.querySelector('.enquiry-result').hidden = true; });
    form.querySelector('button[type="submit"]').disabled = false;
  });
})();
