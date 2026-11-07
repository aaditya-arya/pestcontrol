import { specsData } from './specs-data.mjs';
import { serviceContent, serviceVisuals } from './service-content.mjs';

export const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
export const mark = '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5 40 12v13c0 9-10 16-16 19C18 41 8 34 8 25V12L24 5Z" stroke="currentColor" stroke-width="1.8"/><path d="M24 32V17m0 8c-8 0-10-5-10-9 7 0 10 4 10 9Zm0-3c0-6 4-10 10-11 0 7-4 11-10 11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const brand = `<a class="brand" href="index.html" aria-label="ID Pest Control Services home">${mark}<span>ID PEST CONTROL SERVICES<small>CONTAINER FUMIGATION &amp; PEST CONTROL</small></span></a>`;
export const btn = (href, text, secondary = false) => `<a class="button${secondary ? ' button-secondary' : ''}" href="${href}"><span>${text}</span><span class="button-arrow">${arrow}</span></a>`;
export const img = (name, alt, cls = '', eager = false, sizes = '(max-width: 680px) 100vw, 50vw') => {
  const stem = name.replace(/\.jpg$/, '');
  return `<img src="assets/images/${name}" srcset="assets/images/${stem}-640.webp 640w, assets/images/${stem}.webp 1376w" sizes="${sizes}" alt="${alt}" class="${cls}" width="1376" height="768" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
};

export function layout(file, title, description, body) {
  body = body.replaceAll('type="submit"', 'type="submit" disabled');
  const active = /^(b2b-|container-|pallet-|warehouse-)/.test(file)
    ? 'b2b-fumigation.html'
    : /^(pest-control|termite-|ant-cockroach-|rodent-|general-|prophylactic-)/.test(file)
      ? 'pest-control.html'
      : file;
  const nav = [
    ['index.html', 'Home'],
    ['b2b-fumigation.html', 'Fumigation'],
    ['pest-control.html', 'Pest control'],
    ['branches.html', 'Locations'],
    ['about.html', 'About'],
  ];
  const home = file === 'index.html';
  return `<!DOCTYPE html>
<html lang="en" class="no-js"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#163b32"><title>${title} | ID Pest Control Services</title>
  <meta name="description" content="${description}"><meta name="color-scheme" content="light"><meta property="og:type" content="website"><meta property="og:site_name" content="ID Pest Control Services"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="assets/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="styles.css"><script src="script.js" defer></script>
</head><body class="${home ? 'page-home' : 'page-interior'}" id="top">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="container header-inner">
    ${brand}<button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="primary-nav" aria-expanded="false"><span></span><span></span></button>
    <nav class="primary-nav" id="primary-nav" aria-label="Main navigation">${nav.map(([href, text]) => `<a href="${href}"${active === href ? ' aria-current="page"' : ''}>${text}</a>`).join('')}<span class="nav-indicator" id="nav-indicator" aria-hidden="true"></span><a href="book-inspection.html" class="button nav-cta"${file === 'book-inspection.html' ? ' aria-current="page"' : ''}><span>Send inquiry</span><span class="button-arrow">${arrow}</span></a></nav>
  </div><div class="reading-progress" aria-hidden="true"></div></header>
  
  <main id="main" tabindex="-1">${body}</main>

  <footer class="site-footer"><div class="container">
    <div class="footer-simple-grid">
      <div><a class="brand" href="index.html" aria-label="ID Pest Control Services home">${mark}<span>ID PEST CONTROL SERVICES<small>FUMIGATION &amp; PEST CONTROL</small></span></a><p>Container, pallet, box and stack fumigation.<br>Pest control for homes and businesses across Gujarat.</p></div>
      <div><span class="footer-label">LET'S TALK</span><a class="footer-simple-phone" href="tel:+918401137910">+91 84011 37910</a><a href="mailto:docs@ecomax.co.in">docs@ecomax.co.in</a><a href="contact.html">Contact details ${arrow}</a></div>
      <div><span class="footer-label">AHMEDABAD HEADQUARTERS</span><address>405, Tryksha Desire, Opp. Shivshakti Nagar BRTS,<br>Chandkheda, Ahmedabad 382424</address><div class="footer-simple-links"><a href="branches.html">Locations</a><a href="about.html">About us</a><a href="certificate.html">Certificates</a></div></div>
    </div>

    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} ID Pest Control Services. All rights reserved.</span>
      <span class="footer-tagline">Ahmedabad • Mundra • Morbi • Unjha</span>
      <div>
        <a href="privacy.html">Privacy</a>
        <a href="#top">Back to top ↑</a>
      </div>
    </div>
  </div></footer>

  <!-- In-situ Technical Specs Drawer: deep B2B detail without breaking state -->
  <div class="specs-drawer-backdrop" id="specs-drawer-backdrop" aria-hidden="true"></div>
  <aside class="specs-drawer" id="specs-drawer" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="specs-drawer-title" inert>
    <div class="specs-drawer-header">
      <div>
        <span class="eyebrow" id="specs-drawer-eyebrow">Technical Protocol</span>
        <h2 id="specs-drawer-title">Service Specifications</h2>
      </div>
      <button type="button" class="specs-drawer-close" id="specs-drawer-close" aria-label="Close specifications">✕</button>
    </div>
    <div class="specs-drawer-body" id="specs-drawer-body" tabindex="0" role="region" aria-label="Service specification details">
      <p class="specs-overview" id="specs-drawer-overview">Select a service to view industrial specifications and protocols.</p>
      <div class="specs-grid" id="specs-drawer-grid"></div>
    </div>
    <div class="specs-drawer-footer">
      <a href="book-inspection.html" class="button" id="specs-drawer-cta">
        <span id="specs-drawer-cta-text">Book this service</span>
        <span class="button-arrow">${arrow}</span>
      </a>
      <a href="tel:+918401137910" class="specs-drawer-call">Call Ops Desk: +91 84011 37910 ↗</a>
    </div>
  </aside>

  <script id="specs-data" type="application/json">${JSON.stringify(specsData)}</script>
</body></html>`;
}

export const sectionHead = (label, title, text = '') => `<div class="section-heading reveal"><div><span class="eyebrow"><span class="eyebrow-line"></span>${label}</span><h2>${title}</h2></div>${text ? `<p>${text}</p>` : ''}</div>`;
export const pageIntro = (label, title, description) => `<section class="page-intro container"><a class="breadcrumb" href="index.html">Home <span>/ ${label}</span></a><div class="intro-grid"><div class="reveal"><span class="eyebrow"><span class="eyebrow-line"></span>${label}</span><h1>${title}</h1></div><div class="intro-note reveal"><span class="intro-mark" aria-hidden="true">${mark}</span><p class="intro-description">${description}</p></div></div></section>`;
export const cta = () => `<section class="cta-section"><div class="container cta-inner reveal"><div><span class="eyebrow">TELL US WHAT YOU NEED</span><h2>Let's plan your<br><em>next treatment.</em></h2></div><div><p>Share your service requirement and location.<br>Our team will help you with the next step.</p><div class="cta-actions">${btn('book-inspection.html', 'Send an inquiry')}<a class="cta-phone-link" href="tel:+918401137910">Call +91 84011 37910</a></div></div></div></section>`;
const hoverImage = s => img(`${s.slug}-hover.jpg`, `Alternate view of ${s.short}`, 'service-hover-image').replace('<img ', '<img aria-hidden="true" ');
export const cards = (list, compact = false) => `<div class="service-grid visual-service-grid${compact ? ' compact-service-grid' : ''}">${list.map(s => {
  const visual = serviceVisuals[s.slug];
  return `<article class="service-card expertise-card reveal"><a class="service-card-link" href="${s.slug}.html"><div class="card-media service-photo">${img(s.image, s.alt, 'service-base-image')}${hoverImage(s)}<div class="service-photo-label"><h3>${s.short}</h3><span class="service-card-arrow">${arrow}</span></div></div>${compact ? '' : `<div class="service-card-body"><p>${visual.description}</p><div class="service-use-case"><span>FOR</span>${visual.use}</div><span class="text-link">View service ${arrow}</span></div>`}</a></article>`;
}).join('')}</div>`;
export const faq = items => `<div class="faq-list">${items.map(([q, a], i) => `<details class="reveal"><summary><span class="faq-number">0${i + 1}</span><span>${q}</span><span class="faq-toggle" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${a}</p></div></details>`).join('')}</div>`;

export function homePage(services) {
  const fumigation = services.filter(s => s.kind === 'export');
  const pestControl = services.filter(s => s.kind === 'pest');
  const locations = [
    ['ahmedabad', 'Ahmedabad', 'Headquarters', 'tryksha_desire_hq.jpg', 'Ahmedabad headquarters at Tryksha Desire'],
    ['mundra', 'Mundra', 'Port & logistics region', 'location-mundra.jpg', 'Illustrative view of the Mundra port and logistics region'],
    ['morbi', 'Morbi', 'Ceramic industry region', 'location-morbi.jpg', 'Illustrative view of the Morbi ceramic industry region'],
    ['unjha', 'Unjha', 'Agricultural market region', 'location-unjha.jpg', 'Illustrative view of the Unjha agricultural market region']
  ];
  const route = (href, label) => btn(href, label).replace('class="button"', 'class="button section-route-button"');
  return `<section class="home-hero clean-home-hero" aria-labelledby="home-heading">
    <figure class="hero-figure">${img('hero_b2b_page.jpg', 'Shipping containers, Indian freight trucks and cranes at a container terminal', '', true, '100vw')}</figure>
    <div class="container hero-stage"><div class="hero-copy reveal">
      <span class="eyebrow"><span class="eyebrow-line"></span>ID PEST CONTROL SERVICES / GUJARAT</span>
      <h1 id="home-heading">Fumigation &amp;<br><em>pest control services.</em></h1>
      <p class="hero-summary"><span>Container, pallet, box and stack fumigation for businesses.</span><span>Pest treatments for homes, factories and warehouses.</span></p>
      <div class="hero-quick-nav">${btn('#services', 'Services')}<a class="hero-call-link" href="tel:+918401137910">Call +91 84011 37910</a></div>
    </div></div>
    <div class="container hero-footnote"><span>CARGO / PACKAGING / COMMODITIES / PROPERTIES</span><span>Ahmedabad / Mundra / Morbi / Unjha</span></div>
  </section>

  <section class="section container home-services-section" id="services" aria-labelledby="fumigation-heading">
    <div class="section-heading home-category-heading reveal"><div><span class="eyebrow"><span class="eyebrow-line"></span>01 / BUSINESS FUMIGATION</span><h2 id="fumigation-heading">Fumigation<br><em>services.</em></h2></div>${route('b2b-fumigation.html', 'All fumigation services')}</div>
    ${cards(fumigation, true)}
  </section>

  <section class="section property-services" aria-labelledby="pest-heading"><div class="container"><div class="section-heading home-category-heading reveal"><div><span class="eyebrow"><span class="eyebrow-line"></span>02 / PROPERTY PEST CONTROL</span><h2 id="pest-heading">Pest control<br><em>services.</em></h2></div>${route('pest-control.html', 'All pest control services')}</div><div class="home-pest-catalogue">${cards(pestControl, true)}</div></div></section>

  <section class="section container home-locations" aria-labelledby="locations-heading"><div class="section-heading home-category-heading reveal"><div><span class="eyebrow"><span class="eyebrow-line"></span>03 / OUR LOCATIONS</span><h2 id="locations-heading">Across<br><em>Gujarat.</em></h2></div>${route('branches.html', 'Explore our locations')}</div><div class="home-location-grid">${locations.map(([id,city,desc,photo,alt]) => `<a class="home-location-card reveal" href="branches.html#${id}">${img(photo, alt)}<div><h3>${city}</h3>${arrow}</div><p>${desc}</p></a>`).join('')}</div></section>
  ${cta()}`;
}


export const contactIcon = kind => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${kind === 'phone' ? '<path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z"/>' : kind === 'mail' ? '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>' : '<path d="M21 11.5a9 9 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.5-4.5a9 9 0 1 1 16.5-5Z"/><path d="M8 11h8M8 14h5"/>'}</svg>`;

export function serviceHero({ label, title, summary, image, alt, tags, action, actionText = 'Explore services' }) {
  return `<section class="container service-hero"><a class="breadcrumb" href="index.html">Home <span>/ ${label}</span></a><div class="service-hero-grid"><div class="service-hero-copy"><span class="eyebrow"><span class="eyebrow-line"></span>${label}</span><h1>${title}</h1><p>${summary}</p><div class="service-tags">${tags.map(tag => `<span>${tag}</span>`).join('')}</div><div class="service-hero-actions">${btn(action, actionText)}<a class="text-link" href="tel:+918401137910">Speak to our team ${arrow}</a></div></div><figure class="service-hero-image">${img(image, alt, '', true)}<figcaption>${mark}<span>ID PEST CONTROL SERVICES<span>AHMEDABAD / MUNDRA / MORBI / UNJHA</span></span></figcaption></figure></div></section>`;
}
