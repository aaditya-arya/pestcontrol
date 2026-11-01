import { specsData } from './specs-data.mjs';

export const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
export const mark = '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M24 5 40 12v13c0 9-10 16-16 19C18 41 8 34 8 25V12L24 5Z" stroke="currentColor" stroke-width="1.8"/><path d="M24 32V17m0 8c-8 0-10-5-10-9 7 0 10 4 10 9Zm0-3c0-6 4-10 10-11 0 7-4 11-10 11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
const brand = `<a class="brand" href="index.html" aria-label="ID Pest Control home">${mark}<span>ID PEST CONTROL<small>ECOMAX INDUSTRIAL</small></span></a>`;
export const btn = (href, text, secondary = false) => `<a class="button${secondary ? ' button-secondary' : ''}" href="${href}"><span>${text}</span><span class="button-arrow">${arrow}</span></a>`;
export const img = (name, alt, cls = '', eager = false) => `<img src="assets/images/${name}" alt="${alt}" class="${cls}" width="1376" height="768" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;

export function layout(file, title, description, body) {
  body = body.replaceAll('type="submit"', 'type="submit" disabled');
  const active = /^(b2b-|container-|pallet-|warehouse-)/.test(file) ? 'b2b-fumigation.html' : /^(commercial-|termite-|rodent-|general-)/.test(file) ? 'pest-control.html' : file;
  const nav = [
    ['index.html', 'Home'],
    ['b2b-fumigation.html', 'Fumigation'],
    ['pest-control.html', 'Pest control'],
    ['branches.html', 'Locations'],
    ['about.html', 'About'],
    ['contact.html', 'Contact']
  ];
  const home = file === 'index.html';
  return `<!DOCTYPE html>
<html lang="en" class="no-js"><head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#163b32"><title>${title} | ID Pest Control &amp; Ecomax</title>
  <meta name="description" content="${description}"><link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="assets/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="styles.css"><script src="script.js" defer></script>
</head><body class="${home ? 'page-home' : 'page-interior'}" id="top">
  <!-- First-time starter logo animation overlay -->
  <div id="logo-intro" class="logo-intro" aria-hidden="true">
    <div class="logo-intro-backdrop"></div>
    <div class="logo-intro-stage">
      <div class="logo-intro-badge" id="logo-intro-badge">
        <div class="logo-intro-icon">${mark}</div>
        <div class="logo-intro-brand">
          <span class="logo-intro-title">ID PEST CONTROL</span>
          <small class="logo-intro-subtitle">ECOMAX INDUSTRIAL</small>
        </div>
      </div>
      <p class="logo-intro-caption">CONTAINER FUMIGATION &amp; INDUSTRIAL PEST MANAGEMENT • GUJARAT</p>
      <button type="button" class="logo-intro-skip" id="logo-intro-skip" aria-label="Skip intro animation">Skip intro →</button>
    </div>
  </div>

  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="container header-inner">
    ${brand}<button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="primary-nav" aria-expanded="false"><span></span><span></span></button>
    <nav class="primary-nav" id="primary-nav" aria-label="Main navigation">${nav.map(([href, text]) => `<a href="${href}"${active === href ? ' aria-current="page"' : ''}>${text}</a>`).join('')}<a href="book-inspection.html" class="button nav-cta"${file === 'book-inspection.html' ? ' aria-current="page"' : ''}><span>Let’s talk</span><span class="button-arrow">${arrow}</span></a></nav>
  </div><div class="page-transition-bar" id="page-transition-bar" aria-hidden="true"></div><div class="reading-progress" aria-hidden="true"></div></header>
  
  <main id="main">${body}</main>

  <footer class="site-footer"><div class="container">
    <div class="footer-signoff reveal"><p>Good care.<br><em>Starts with a conversation.</em></p><a class="footer-circle" href="book-inspection.html" aria-label="Start an inspection enquiry">${arrow}</a></div>
    <div class="footer-top"><div class="footer-intro">${brand}<p>For industrial facilities, manufacturing cleanrooms,<br>and global container export consignments across Gujarat.</p><a class="footer-phone" href="tel:+918401137910">+91 84011 37910 ${arrow}</a></div>
    <div class="footer-column"><h2>Export &amp; B2B Services</h2><a href="container-fumigation.html">Container fumigation (20ft &amp; 40ft)</a><a href="pallet-treatment.html">ISPM-15 pallet treatment</a><a href="warehouse-fumigation.html">Warehouse stack fumigation</a><a href="certificate.html">Certificate enquiries</a></div>
    <div class="footer-column"><h2>Commercial IPM</h2><a href="commercial-pest-management.html">Industrial facility IPM</a><a href="termite-control.html">Anti-termite protection</a><a href="rodent-control.html">Industrial rodent control</a><a href="general-pest-control.html">Commercial pest control</a></div>
    <div class="footer-column"><h2>Gujarat Operations</h2><p>Ahmedabad HQ (Chandkheda)<br>Mundra Port SEZ Desk<br>Morbi Ceramic Zone<br>Unjha APMC Corridor</p><a href="mailto:docs@ecomax.co.in">docs@ecomax.co.in</a><a href="https://wa.me/918401137910" target="_blank" rel="noopener noreferrer">WhatsApp Operations ↗</a></div></div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} ID Pest Control &amp; Ecomax Industrial.</span><span>Rooted in Gujarat. Close to you.</span><div><a href="privacy.html">Privacy</a><a href="#top">Back to top ↑</a></div></div>
  </div></footer>

  <!-- In-situ Technical Specs Drawer: deep B2B detail without breaking state -->
  <div class="specs-drawer-backdrop" id="specs-drawer-backdrop" aria-hidden="true"></div>
  <aside class="specs-drawer" id="specs-drawer" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="specs-drawer-title">
    <div class="specs-drawer-header">
      <div>
        <span class="eyebrow" id="specs-drawer-eyebrow">Technical Protocol</span>
        <h2 id="specs-drawer-title">Service Specifications</h2>
      </div>
      <button type="button" class="specs-drawer-close" id="specs-drawer-close" aria-label="Close specifications">✕</button>
    </div>
    <div class="specs-drawer-body" id="specs-drawer-body">
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
export const cta = () => `<section class="cta-section"><div class="container cta-inner reveal"><div><span class="eyebrow">Direct coordination across Gujarat</span><h2>Let’s secure<br><em>your next shipment.</em></h2></div><div><p>20ft &amp; 40ft container fumigation, ISPM-15 timber packaging, and audit-ready facility IPM.<br>Planned around your loading windows and vessel cut-offs.</p>${btn('book-inspection.html', 'Arrange treatment or inspection')}</div><span class="cta-orbit" aria-hidden="true"></span></div></section>`;
export const cards = list => `<div class="service-grid">${list.map((s, i) => `<article class="service-card reveal"><div class="card-media">${img(s.image, s.alt)}<span class="card-image-arrow">${arrow}</span></div><div class="service-card-body"><span class="card-index">0${i + 1} / ${s.category}</span><h3>${s.short}</h3><p>${s.description}</p><div class="service-card-actions"><a class="text-link" href="${s.slug}.html">Full details ${arrow}</a><button type="button" class="spec-trigger-pill" data-open-specs="${s.slug}">Specs &amp; protocols ↗</button></div></div></article>`).join('')}</div>`;
export const steps = () => `<div class="steps"><article class="reveal"><span class="step-number">01<span>COORDINATE</span></span><h3>Clear parameters.<br><em>Immediate response.</em></h3><p>Share container count, stuffing site, commodity classification, destination country, and vessel cut-off schedule.</p></article><article class="reveal"><span class="step-number">02<span>TREAT &amp; MONITOR</span></span><h3>Certified protocols.<br><em>Precision execution.</em></h3><p>Licensed Methyl Bromide or Phosphine application, hermetic sealing, digital PPM gas monitoring, and safe aeration.</p></article><article class="reveal"><span class="step-number">03<span>CERTIFY &amp; CLEAR</span></span><h3>Prompt release.<br><em>Zero port delays.</em></h3><p>Immediate issuance of official Fumigation, IPPC, or Gas-Free Clearance Certificates for fast customs dispatch.</p></article></div>`;
export const faq = items => `<div class="faq-list">${items.map(([q, a], i) => `<details class="reveal"><summary><span class="faq-number">0${i + 1}</span><span>${q}</span><span class="faq-toggle" aria-hidden="true">+</span></summary><div class="faq-answer"><p>${a}</p></div></details>`).join('')}</div>`;

export function homePage() {
  return `<section class="home-hero"><div class="hero-backdrop" aria-hidden="true"></div><figure class="hero-figure">${img('hero_b2b_page.jpg', 'Export shipping containers at terminal in warm morning light', '', true)}<figcaption><span class="status-dot"></span>GUJARAT, INDIA <span>CONTAINER FUMIGATION &amp; INDUSTRIAL IPM</span></figcaption></figure>
  <div class="container hero-stage"><div class="hero-copy reveal"><span class="eyebrow"><span class="status-dot"></span>ACCREDITED EXPORT FUMIGATION &amp; COMMERCIAL PEST CARE</span><h1><span>Container Fumigation.</span><em><span>Industrial Protection.</span><span>Zero Port Delays.</span></em></h1><p>Specialized container fumigation, ISPM-15 wood packaging treatment, and audit-ready commercial IPM across Gujarat.<br class="desktop-break"> Rapid on-wheel dispatch at factory stuffing docks, CFS yards, and Mundra port corridor.</p><div class="hero-actions">${btn('book-inspection.html?service=container-fumigation', 'Enquire container fumigation')}${btn('#services', 'Explore all B2B services', true)}<button type="button" class="button button-spec-open" data-open-specs="container-fumigation"><span>Inspect container specs</span><span class="button-arrow">${arrow}</span></button></div></div><div class="hero-bottom"><span>CERTIFIED MBr &amp; PHOSPHINE APPLICATORS.<br><strong>24/7 FACTORY STUFFING &amp; PORT CLEARANCE.</strong></span><a class="scroll-cue" href="#services"><span>Explore industrial services</span><span class="scroll-arrow">↓</span></a></div></div></section>
  <div class="intro-strip container"><span class="eyebrow">EXPORT READINESS • ZERO-REJECTION ASSURANCE</span><p>Good care. Starts with a conversation.<br><em>Built for industrial operations.</em></p><a href="about.html" class="round-link" aria-label="Discover our industrial approach">${arrow}</a></div>
  <section class="section container" id="services">${sectionHead('Two industrial disciplines. One accountable team.', 'Built for high-stakes<br><em>business compliance.</em>', 'Meeting strict quarantine standards for overseas export consignments and passing rigorous USFDA, BRCGS, and HACCP facility audits.')}
    <div class="expertise-grid"><div class="expertise-card reveal"><div class="expertise-media">${img('pallet-box-fumigation.jpg', 'Export wooden packaging and shipping cargo prepared for treatment')}<span class="expertise-number">01</span><span class="card-image-arrow">${arrow}</span></div><div class="expertise-body"><span class="eyebrow">Export cargo &amp; logistics</span><h3>Export <em>fumigation.</em></h3><p>20ft &amp; 40ft container fumigation, ISPM-15 wooden packaging heat treatment, and warehouse stack fumigation. Coordinated to beat vessel cut-offs with same-day phytosanitary clearance.</p><div class="expertise-actions"><a class="text-link" href="b2b-fumigation.html">Explore fumigation ${arrow}</a><button type="button" class="card-spec-link" data-open-specs="container-fumigation">Container specs ↗</button></div></div></div>
    <div class="expertise-card reveal"><div class="expertise-media">${img('cleanroom_pharma_ipm.jpg', 'Industrial technician inspecting pest monitoring station in clean facility')}<span class="expertise-number">02</span><span class="card-image-arrow">${arrow}</span></div><div class="expertise-body"><span class="eyebrow">Industrial &amp; commercial facilities</span><h3>Pest <em>management.</em></h3><p>Inspection-led, audit-ready IPM programs for pharmaceutical cleanrooms, food processing plants, and logistics parks. Zero-chemical sensitive cleanroom solutions and digital trend records.</p><div class="expertise-actions"><a class="text-link" href="pest-control.html">Explore pest care ${arrow}</a><button type="button" class="card-spec-link" data-open-specs="commercial-pest-management">Facility IPM specs ↗</button></div></div></div></div>
  </section>
  <section class="care-story section"><div class="container story-grid"><div class="story-photo reveal">${img('img_general_pest.jpg', 'Pest management technician treating the perimeter of an industrial warehouse')}<span class="photo-label">PRECISION DOSING. ZERO COMPROMISE.</span></div><div class="story-copy reveal"><span class="eyebrow">Operational rigor</span><h2>Precision treatments.<br>Zero quarantine rejections.<br><em>Never delayed.</em></h2><p>A single pest interception overseas triggers demurrage fines, container re-export, and supply chain gridlock. Our certified fumigation engineers execute precise MBr and phosphine dosages, monitor ppm levels, and supply official certificates for prompt shipping bill clearance.</p>${btn('about.html', 'Our technical capabilities', true)}<div class="story-signature">${mark}<span>Rooted in Gujarat. Close to you.<br>Certified export fumigators &amp; industrial pest managers.</span></div></div></div></section>
  <section class="section container">${sectionHead('Engineered for fast turnaround', 'Less complexity.<br><em>Total compliance.</em>', 'A proven three-stage workflow ensuring complete quarantine compliance from factory dock to overseas delivery.')}${steps()}</section>
  <section class="section location-section"><div class="container location-teaser reveal"><div><span class="eyebrow">Four hubs. One connected team.</span><h2>Rooted in Gujarat.<br><em>Close to you.</em></h2><p>Strategically deployed across Gujarat’s primary logistics corridors: Ahmedabad headquarters, Mundra port SEZ, Morbi ceramics export belt, and Unjha agricultural trade hub.</p>${btn('branches.html', 'Find your nearest team', true)}</div><div class="location-list">${[['Ahmedabad', 'Headquarters, pharma IPM & export desk'], ['Mundra', 'Port SEZ & CFS container corridor'], ['Morbi', 'Wood packaging & industrial crates'], ['Unjha', 'APMC commodity stack fumigation']].map(([city, text], i) => `<a href="branches.html#${city.toLowerCase()}"><span class="location-number">0${i + 1}</span><span><strong>${city}</strong><small>${text}</small></span><span class="location-arrow">${arrow}</span></a>`).join('')}</div></div></section>${cta()}`;
}

export function hubExplorer(hubs) {
  return `<section class="container hub-explorer reveal" aria-labelledby="hub-heading"><div class="hub-art"><span class="eyebrow">Logistics network</span><h2 id="hub-heading">Direct access across<br><em>Gujarat corridors.</em></h2><svg class="network-art" viewBox="0 0 400 260" fill="none" aria-hidden="true"><path class="network-path" d="M70 170Q130 20 225 70T330 180M70 170Q200 250 330 180M225 70 200 205"/><circle cx="70" cy="170" r="7"/><circle cx="225" cy="70" r="7"/><circle cx="330" cy="180" r="7"/><circle cx="200" cy="205" r="7"/><circle class="network-orbit" cx="200" cy="140" r="105"/></svg><span class="network-caption">FOUR OPERATIONAL HUBS. 24/7 COORDINATION.</span></div><div class="hub-picker"><div class="hub-tabs" role="group" aria-label="Choose an operational hub">${hubs.map(([id, city], i) => `<button type="button" class="hub-tab" data-hub="${id}" aria-pressed="${i === 0}">${city}</button>`).join('')}</div><div class="hub-preview" aria-live="polite" aria-atomic="true"><span class="eyebrow" data-hub-type>Headquarters</span><h3 data-hub-city>Ahmedabad</h3><p data-hub-description>Central coordination, commercial pest care, and export support.</p><a class="text-link" data-hub-link href="#ahmedabad">View location details ${arrow}</a></div></div></section>`;
}
