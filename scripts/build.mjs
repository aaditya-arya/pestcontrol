import { writeFileSync } from 'node:fs';
import { layout, mark, arrow, btn, img, sectionHead, pageIntro, cta, cards, faq, homePage, serviceHero, contactIcon } from './components.mjs';

import { serviceContent } from './service-content.mjs';

// Shared templates generate complete HTML for hosting without a build server.
export const services = [
  { slug: 'container-fumigation', title: 'Container fumigation', short: 'Container Fumigation', image: 'container-fumigation.jpg', alt: 'Indian field technicians working on a shipping container at a container yard', kind: 'export' },
  { slug: 'pallet-treatment', title: 'Pallet and box fumigation', short: 'Pallet / Box Fumigation', image: 'pallet-box-fumigation.jpg', alt: 'Indian field technician inspecting wooden pallets and boxes in a warehouse', kind: 'export' },
  { slug: 'warehouse-fumigation', title: 'Stack fumigation', short: 'Stack Fumigation', image: 'stack-fumigation.jpg', alt: 'Indian technician monitoring a covered commodity stack inside a godown', kind: 'export' },
  { slug: 'termite-control', title: 'Anti-termite treatment', short: 'Anti-Termite Treatment', image: 'img_termite.jpg', alt: 'Indian technician carrying out anti-termite treatment at a warehouse', kind: 'pest' },
  { slug: 'ant-cockroach-treatment', title: 'Ant and cockroach treatment', short: 'Ant / Cockroach Treatment', image: 'img_cockroach.jpg', alt: 'Indian technician applying cockroach gel treatment in a commercial kitchen', kind: 'pest' },
  { slug: 'general-pest-control', title: 'General pest control', short: 'General Pest Control Work', image: 'img_general_pest.jpg', alt: 'Indian field technician inspecting pest monitoring equipment', kind: 'pest' },
  { slug: 'rodent-control', title: 'Rodent control treatment', short: 'Rodent Control Treatment', image: 'img_rodent.jpg', alt: 'Indian technician inspecting a rodent control station outside a godown', kind: 'pest' },
  { slug: 'prophylactic-treatment', title: 'Prophylactic treatment', short: 'Prophylactic Treatment', image: 'img_prophylactic.jpg', alt: 'Pest control technician preparing an empty warehouse for preventive treatment', kind: 'pest' }
];

// Use clear summaries throughout the customer journey.
for (const service of services) {
  const copy = serviceContent[service.slug];
  Object.assign(service, { category: service.kind === 'export' ? 'Business fumigation' : 'Pest control', description: copy.summary, intro: copy.summary, twoLiner: copy.summary, includes: copy.includes, prepare: copy.prepare });
}

const pages = new Map();
const add = (file, title, description, content) => pages.set(file, layout(file, title, description, content));

add('index.html', 'B2B Container Fumigation & General Pest Control in Gujarat', 'ID Pest Control Services provides B2B container fumigation, pallet/box fumigation, stack fumigation, and complete anti-termite, cockroach, rodent, and general pest control across Gujarat.', homePage(services));

add('b2b-fumigation.html', 'Container, Pallet & Stack Fumigation in Gujarat', 'Business fumigation for containers, wooden pallets, boxes and commodity stacks across Gujarat.', `${serviceHero({label: 'Business fumigation', title: 'Container, pallet &amp;<br><em>stack fumigation.</em>', summary: 'Container, pallet, box and stack fumigation for exporters, manufacturers and warehouse teams across Gujarat.', image: 'container-fumigation.jpg', alt: 'Indian field technicians working at a shipping container in a Gujarat container yard', tags: ['Shipping containers', 'Wooden packaging', 'Commodity stacks'], action: '#fumigation-services', actionText: 'Find your service'})}<section class="section container catalogue-section" id="fumigation-services">${sectionHead('Three focused services', 'Three services.<br><em>Three clear applications.</em>', 'Choose your cargo type to see what the service covers and the details to share with our team.')}${cards(services.filter(s => s.kind === 'export'))}</section><section class="section section-tinted"><div class="container booking-note"><div><span class="eyebrow">PLANNING A SHIPMENT?</span><h2>Start with the<br><em>essentials.</em></h2></div><div><p>Have your cargo type, quantity, location and dispatch date ready. Include the destination and any treatment documentation requirements, so our team can discuss the right service.</p><a class="text-link" href="book-inspection.html?request=quote">Discuss your cargo ${arrow}</a></div></div></section><section class="section container narrow">${sectionHead('Before you enquire', 'A little more clarity.')}${faq([['Which fumigation service should I choose?', 'Choose container fumigation for shipping containers, pallet/box fumigation for wooden packaging, and stack fumigation for stored commodity stacks. If you are unsure, tell us about your cargo.'], ['What should I share for a quote?', 'Include the cargo or packaging type, container or pallet count or stack tonnage, treatment location, destination and preferred date. Our team confirms the scope and availability directly.'], ['Can I discuss documentation for my shipment?', 'Yes. Share the destination, shipment details and the records requested by your buyer or shipping team. Our documentation desk can discuss your requirements.']])}</section>${cta()}`);

add('pest-control.html', 'Pest Control for Homes & Businesses in Gujarat', 'Anti-termite, ant and cockroach, rodent, general pest control and prophylactic treatment across Gujarat.', `${serviceHero({label: 'Pest control', title: 'Pest control for<br><em>homes &amp; businesses.</em>', summary: 'Five focused treatments for homes, kitchens, offices, factories and warehouses. Choose the service that matches your concern.', image: 'img_cockroach.jpg', alt: 'Indian technician applying targeted cockroach treatment in a commercial kitchen', tags: ['Homes & offices', 'Factories & warehouses', 'Preventive care'], action: '#pest-services', actionText: 'Explore treatments'})}<section class="section container catalogue-section" id="pest-services">${sectionHead('Find the right treatment', 'Find your pest.<br><em>Choose your treatment.</em>', 'Start with the pest or the space. Each service explains what to expect and how to enquire.')}${cards(services.filter(s => s.kind === 'pest'))}</section><section class="section section-tinted"><div class="container booking-note"><div><span class="eyebrow">NOT SURE WHICH SERVICE?</span><h2>Tell us what<br><em>you are seeing.</em></h2></div><div><p>Share the pest concern, property type and approximate area. Our team can help you identify a suitable treatment and discuss preparation for your space.</p><a class="text-link" href="book-inspection.html?service=not-sure">Ask our team ${arrow}</a></div></div></section><section class="section container narrow">${sectionHead('Common questions', 'Before your visit.')}${faq([['How do I choose a treatment?', 'Start with the pest you have noticed. If you cannot identify it, choose the unsure option on the enquiry form and describe the affected area.'], ['How should I prepare my property?', 'Preparation depends on the treatment and the space. Discuss access, cleaning, food storage and re-entry instructions with our team before your visit.'], ['What is prophylactic treatment?', 'It is preventive pest treatment for empty godowns, warehouses and storage spaces before fresh goods arrive. General pest control addresses pest concerns in spaces already in use.']])}</section>${cta()}`);

function relatedServices(current) {
  const related = services.filter(s => s.kind === current.kind && s.slug !== current.slug).slice(0, 2);
  return `<section class="section container related-services">${sectionHead('Other services in this division', 'Explore related services.')}${cards(related)}</section>`;
}
for (const s of services) {
  const copy = serviceContent[s.slug];
  add(`${s.slug}.html`, s.title, s.description, `${serviceHero({label: s.kind === 'export' ? 'Business fumigation' : 'Pest control', title: s.short, summary: copy.summary, image: s.image, alt: s.alt, tags: copy.tags, action: `book-inspection.html?service=${s.slug}`, actionText: 'Enquire about this service'})}<div class="container service-page-nav"><a href="#service-overview">What is included</a><a href="#enquiry-details">Before you enquire</a><a href="${s.kind === 'export' ? 'b2b-fumigation' : 'pest-control'}.html">All ${s.kind === 'export' ? 'fumigation' : 'pest control'} services ${arrow}</a></div><section class="section container service-overview-grid" id="service-overview"><div><span class="eyebrow">THE SERVICE AT A GLANCE</span><h2>What this<br><em>treatment covers.</em></h2><ul class="check-list">${copy.includes.map(x => `<li>${x}</li>`).join('')}</ul></div><aside class="service-fit-card"><span class="fit-icon">${mark}</span><span class="eyebrow">IS THIS FOR YOU?</span><h3>Designed around<br>your requirement.</h3><p>${copy.audience}</p><div class="fit-note">${copy.note}</div><button type="button" class="card-spec-link" data-open-specs="${s.slug}">Technical specifications ${arrow}</button></aside></section><section class="section section-tinted" id="enquiry-details"><div class="container booking-note"><div><span class="eyebrow">A USEFUL HEAD START</span><h2>What to share<br><em>with our team.</em></h2></div><div><p>${copy.prepare}</p><a class="text-link" href="book-inspection.html?service=${s.slug}">Send a service enquiry ${arrow}</a></div></div></section>${relatedServices(s)}${cta()}`);
}

const locations = [
  { id: 'ahmedabad', city: 'Ahmedabad', type: 'Headquarters', area: '405, Tryksha Desire, Opp. Shivshakti Nagar BRTS, Chandkheda, Ahmedabad 382424', phone: '84011 37910', raw: '918401137910', photo: 'tryksha_desire_hq.jpg', alt: 'Tryksha Desire, our Ahmedabad headquarters', service: 'Fumigation &amp; pest control', href: 'index.html#services' },
  { id: 'mundra', city: 'Mundra', type: 'Service area', area: 'Mundra, Kutch', phone: '98984 72483', raw: '919898472483', photo: 'location-mundra.jpg', alt: 'Illustrative view of the Mundra port and logistics region', service: 'Container fumigation', href: 'container-fumigation.html' },
  { id: 'morbi', city: 'Morbi', type: 'Service area', area: 'Morbi, Gujarat', phone: '84011 37910', raw: '918401137910', photo: 'location-morbi.jpg', alt: 'Illustrative view of the Morbi ceramic industry region', service: 'Pallet / box fumigation', href: 'pallet-treatment.html' },
  { id: 'unjha', city: 'Unjha', type: 'Service area', area: 'Unjha, North Gujarat', phone: '98984 72483', raw: '919898472483', photo: 'location-unjha.jpg', alt: 'Illustrative view of the Unjha agricultural market region', service: 'Stack fumigation', href: 'warehouse-fumigation.html' }
];

add('branches.html', 'Locations Across Gujarat', 'Find ID Pest Control Services in Ahmedabad, Mundra, Morbi and Unjha. Call, WhatsApp or send an enquiry to the team for your location.', `${pageIntro('Our locations', 'Our Gujarat<br><em>locations.</em>', 'Choose your city to call, WhatsApp or enquire with our team.')}
  <section class="container branch-visual-grid location-grid" aria-label="Service locations">
    ${locations.map(l => `<article class="branch-visual-card location-card reveal" id="${l.id}" aria-labelledby="${l.id}-heading">
      <div class="branch-card-media">${img(l.photo, l.alt, '', l.id === 'ahmedabad', '(max-width: 680px) 100vw, 50vw')}</div>
      <div class="location-card-content">
        <span class="eyebrow">${l.type}</span><h2 id="${l.id}-heading">${l.city}</h2>
        <a class="location-service" href="${l.href}">${l.service} ${arrow}</a>
        ${l.id === 'ahmedabad' ? `<address><a href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(l.area)}" target="_blank" rel="noopener noreferrer" aria-label="${l.area} ? Open in Google Maps">${l.area}</a></address>` : `<p class="location-area">${l.area}</p>`}
        <div class="location-card-contact"><a class="location-phone" href="tel:+${l.raw}">Call +91 ${l.phone}</a><div class="location-card-links"><a class="text-link" href="https://wa.me/${l.raw}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp our ${l.city} team">WhatsApp ${arrow}</a><a class="text-link" href="book-inspection.html?location=${encodeURIComponent(l.city)}" aria-label="Enquire in ${l.city}">Enquire ${arrow}</a></div></div>
      </div>
    </article>`).join('')}
  </section>`);

add('about.html', 'About ID Pest Control Services', 'Meet founder Dushyant Tyagi and ID Pest Control Services, an Ahmedabad-based company focused on business fumigation and pest control across Gujarat.', `${pageIntro('About us', 'About our<br><em>company.</em>', 'ID PEST CONTROL SERVICES provides cargo fumigation and pest control from Ahmedabad, serving businesses and homes across Gujarat.')}
  <section class="container about-founder-layout" aria-labelledby="company-focus-heading">
    <figure class="founder-portrait reveal">
      <img src="assets/images/founder-portrait.jpg" srcset="assets/images/founder-portrait-640.webp 640w, assets/images/founder-portrait.webp 1194w" sizes="(max-width: 680px) calc(100vw - 40px), (max-width: 960px) 60vw, 40vw" width="1194" height="1317" alt="Dushyant Tyagi, founder of ID Pest Control Services, seated in his office" fetchpriority="high" decoding="async">
      <figcaption><strong>Dushyant Tyagi</strong><span>Founder, ID PEST CONTROL SERVICES</span></figcaption>
    </figure>
    <div class="company-focus reveal">
      <span class="eyebrow"><span class="eyebrow-line"></span>WHAT WE DO</span>
      <h2 id="company-focus-heading">Fumigation is<br><em>our core business.</em></h2>
      <p>We work with exporters, manufacturers and warehouse operators on container fumigation, pallet and box fumigation, and stack fumigation for stored goods.</p>
      <p>We also provide anti-termite, ant and cockroach, rodent, general pest control and prophylactic (preventive) treatments for homes and workplaces.</p>
      <nav class="company-service-routes" aria-label="Explore our services">
        <a href="b2b-fumigation.html"><span><small>FOR CARGO &amp; BUSINESSES</small><strong>Fumigation services</strong></span><span class="company-route-arrow">${arrow}</span></a>
        <a href="pest-control.html"><span><small>FOR HOMES &amp; WORKPLACES</small><strong>Pest control services</strong></span><span class="company-route-arrow">${arrow}</span></a>
      </nav>
    </div>
  </section>
  <section class="container company-coverage reveal" aria-label="Our service locations"><div><span class="eyebrow">BASED IN AHMEDABAD</span><p>Serving Ahmedabad, Mundra, Morbi &amp; Unjha.</p></div><a class="text-link" href="branches.html">View locations &amp; contacts ${arrow}</a></section>`);

const serviceOptions = `<option value="">Select a service</option><optgroup label="B2B Fumigation Services (Primary)">${services.filter(s => s.kind === 'export').map(s => `<option value="${s.slug}">${s.title}</option>`).join('')}</optgroup><optgroup label="General Pest Control Work">${services.filter(s => s.kind === 'pest').map(s => `<option value="${s.slug}">${s.title}</option>`).join('')}</optgroup><option value="not-sure">I’m not sure yet — need guidance</option>`;
const form = () => `<form class="enquiry-form" data-enquiry="inspection" novalidate>
  <!-- Step 1: Required Coordination Details -->
  <div class="form-section form-section-required">
    <div class="form-section-header">
      <span class="form-section-badge required-badge">START HERE</span>
      <h3>Your service enquiry</h3>
      <p>Four details to help our team understand your request.</p>
    </div>

    <div class="form-fields-grid">
      <div class="field" data-field="name">
        <label for="full-name">Your Full Name <span class="req-star" aria-hidden="true">*</span></label>
        <input id="full-name" name="name" autocomplete="name" placeholder="e.g. Rajesh Shah" maxlength="100" required>
        <span class="field-error" aria-live="polite"></span>
      </div>

      <div class="field" data-field="phone">
        <label for="phone">Direct Phone Number <span class="req-star" aria-hidden="true">*</span></label>
        <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="e.g. +91 98765 43210" maxlength="22" required>
        <span class="field-error" aria-live="polite"></span>
      </div>

      <div class="field" data-field="service">
        <label for="service">Service Required <span class="req-star" aria-hidden="true">*</span></label>
        <select id="service" name="service" required>${serviceOptions}</select>
        <span class="field-error" aria-live="polite"></span>
      </div>

      <div class="field" data-field="location">
        <label for="location">Treatment Location / City <span class="req-star" aria-hidden="true">*</span></label>
        <input id="location" name="location" autocomplete="address-level2" placeholder="e.g. Mundra Port CFS, Ahmedabad GIDC, Morbi" maxlength="200" required>
        <span class="field-error" aria-live="polite"></span>
      </div>
    </div>
  </div>

  <!-- Step 2: Optional Context -->
  <details class="form-section form-section-optional"><summary class="optional-form-summary"><span><strong>Add a few more details</strong><small>Company, email, preferred date and notes (optional)</small></span><span class="optional-plus" aria-hidden="true">+</span></summary>
    <div class="form-section-header optional-heading">
      <span class="form-section-badge optional-badge">OPTIONAL INFORMATION</span>
      <h3>Shipment &amp; Facility Context</h3>
      <p>Share these optional details so we better understand your shipment or facility requirements beforehand.</p>
    </div>

    <div class="form-fields-grid">
      <div class="field" data-field="email">
        <label for="email">Work Email</label>
        <input id="email" name="email" type="email" autocomplete="email" placeholder="operations@yourcompany.com" maxlength="150">
        <span class="field-error" aria-live="polite"></span>
      </div>

      <div class="field" data-field="company">
        <label for="company">Company / Exporter Name</label>
        <input id="company" name="company" autocomplete="organization" placeholder="e.g. Shanti Logistics Ltd" maxlength="150">
        <span class="field-error" aria-live="polite"></span>
      </div>

      <div class="field" data-field="date">
        <label for="preferred-date">Preferred Treatment Date</label>
        <input id="preferred-date" name="date" type="date" aria-describedby="date-help">
        <p class="field-help" id="date-help">Target date for factory stuffing or pest control visit.</p>
      </div>

      <div class="field" data-field="message">
        <label for="message">Cargo, Container or Facility Notes</label>
        <textarea id="message" name="message" rows="3" maxlength="2000" placeholder="e.g. shipping containers, pallet count, stack tonnage, or building sq. ft."></textarea>
      </div>
    </div>
  </details>

  <!-- Step 3: Consent & Action -->
  <div class="form-footer-action">
    <div class="field" data-field="consent">
      <label class="checkbox-field">
        <input type="checkbox" name="consent" id="consent-check" required>
        <span>I agree to share these details with the ID Pest Control Services team to respond to my enquiry. <a href="privacy.html">Privacy details</a>.</span>
      </label>
      <span class="field-error" aria-live="polite"></span>
    </div>

    <div class="form-submit-row">
      <button class="button button-submit" type="submit">
        <span>Prepare my enquiry</span>
        <span class="button-arrow">${arrow}</span>
      </button>
      <div class="form-guarantee">
        <span class="status-dot"></span>
        <span>You choose how to send your message.</span>
      </div>
    </div>
  </div>

  <div class="enquiry-result" role="region" hidden tabindex="-1" aria-labelledby="result-title">
    <h3 id="result-title">Your message is ready.</h3>
    <p>Choose how to send it. Your request is confirmed directly once our operations team replies.</p>
    <div class="result-actions">
      <a class="button button-whatsapp" data-whatsapp target="_blank" rel="noopener noreferrer">
        <span>Continue on WhatsApp</span>
        <span class="button-arrow">${arrow}</span>
      </a>
      <a class="text-link" data-email>Send by email ${arrow}</a>
    </div>
  </div>
</form>`;

add('book-inspection.html', 'Book Container Fumigation or Pest Control Service', 'Request container fumigation, pallet/box fumigation, stack fumigation, or general pest control across Gujarat with ID Pest Control Services.', `<section class="container enquiry-intro"><a class="breadcrumb" href="index.html">Home <span>/ Send inquiry</span></a><div class="enquiry-intro-grid"><div><span class="eyebrow"><span class="eyebrow-line"></span>LET'S TALK</span><h1>Your requirement.<br><em>Our next conversation.</em></h1><p>Container fumigation, pest control or a quick question. Reach our team directly, or share the details below.</p></div><div class="enquiry-direct-panel" role="region" aria-labelledby="direct-contact-heading"><span class="eyebrow">NO FORM NEEDED</span><h2 id="direct-contact-heading">Talk to us directly.</h2><div class="enquiry-direct-actions"><a class="button direct-call" href="tel:+918401137910"><span class="direct-action-label">${contactIcon('phone')}<span>Call our team<small>+91 84011 37910</small></span></span><span class="button-arrow">${arrow}</span></a><a class="button button-whatsapp direct-whatsapp" href="https://wa.me/918401137910" target="_blank" rel="noopener noreferrer"><span class="direct-action-label">${contactIcon('chat')}<span>Chat on WhatsApp<small>Start a conversation</small></span></span><span class="button-arrow">${arrow}</span></a></div><p>Choose what works best for you.</p></div></div></section><div class="container enquiry-form-divider"><span>Prefer to send your requirements?</span><a class="text-link" href="#enquiry-form">Use the enquiry form ${arrow}</a></div><section class="container form-layout" id="enquiry-form"><aside class="form-aside reveal"><span class="eyebrow">Direct coordination</span><h2>A conversation.<br>A clear next step.</h2><p>Tell us what you need, prepare your message and send it through WhatsApp or email. No booking is made until you agree the details with our team.</p><div class="contact-mini"><span>Direct Ops Hotline</span><a href="tel:+918401137910">+91 84011 37910 ${arrow}</a><span>Documentation Desk</span><a href="mailto:docs@ecomax.co.in">docs@ecomax.co.in ${arrow}</a></div><div class="aside-note">Share your location and preferred schedule so our team can confirm availability.</div></aside><div class="form-panel reveal"><div class="form-steps" role="group" aria-label="Enquiry steps"><span class="form-step is-current" data-form-step="1" aria-current="step"><b>01</b> Your details</span><span class="form-step" data-form-step="2"><b>02</b> Send your message</span></div><h2 data-form-heading>Tell us about your requirement</h2><p class="form-intro">Complete the required fields, then choose WhatsApp or email to send your message.</p><div class="selected-service-note" data-service-note hidden><span class="eyebrow">YOUR SELECTED SERVICE</span><strong data-service-name></strong><p data-service-guidance></p></div>${form()}<noscript><p>Please <a href="tel:+918401137910">call +91 84011 37910</a> or <a href="mailto:docs@ecomax.co.in">email docs@ecomax.co.in</a> to arrange a visit.</p></noscript></div></section>`);

add('contact.html', 'Contact ID Pest Control Services', 'Contact ID Pest Control Services in Ahmedabad, Mundra, Morbi, and Unjha for B2B container fumigation, pallet/stack fumigation, and general pest control.', `${pageIntro('Inquiry & Contact', 'Good service starts<br><em>with a conversation.</em>', 'Need urgent container fumigation before vessel cut-off, pallet/stack fumigation, or pest control treatment? Reach ID Pest Control Services directly.')}<section class="container contact-grid"><a class="contact-card reveal" href="tel:+918401137910"><span class="contact-method-icon">${contactIcon('phone')}</span><span class="eyebrow">01 / CALL US</span><h2>Talk to our team.</h2><p>Speak directly with our coordinator for container fumigation bookings and pest control visits.</p><span class="text-link">+91 84011 37910 ${arrow}</span></a><a class="contact-card reveal" href="https://wa.me/918401137910" target="_blank" rel="noopener noreferrer"><span class="contact-method-icon">${contactIcon('chat')}</span><span class="eyebrow">02 / MESSAGE US</span><h2>Share your requirement.</h2><p>Share container numbers, stuffing locations, or pest control requirements on WhatsApp.</p><span class="text-link">Chat on WhatsApp ${arrow}</span></a><a class="contact-card reveal" href="mailto:docs@ecomax.co.in"><span class="contact-method-icon">${contactIcon('mail')}</span><span class="eyebrow">03 / EMAIL US</span><h2>Keep it in writing.</h2><p>Send service requirements, quote requests or questions about treatment documentation.</p><span class="text-link">docs@ecomax.co.in ${arrow}</span></a></section><section class="section container"><div class="contact-location reveal"><div><span class="eyebrow">Central headquarters</span><h2>Ahmedabad<br>HQ office.</h2><address><strong>ID PEST CONTROL SERVICES</strong><br>405, Tryksha Desire<br>Opp. Shivshakti Nagar BRTS<br>Chandkheda, Ahmedabad 382424<br>Gujarat, India</address><div class="hero-actions">${btn('https://www.google.com/maps/search/?api=1&amp;query=405%20Tryksha%20Desire%20Chandkheda%20Ahmedabad', 'Get directions', true)}<a class="text-link" href="branches.html">View all 4 Gujarat hubs ${arrow}</a></div></div>${img('tryksha_desire_hq.jpg', 'Tryksha Desire commercial building, Chandkheda, Ahmedabad - ID Pest Control Services Headquarters')}</div></section>${cta()}`);

add('certificate.html', 'Fumigation Certificate Verification & Enquiries', 'Verify or request copies of your export container fumigation, pallet ISPM-15, and stack fumigation certificates from ID Pest Control Services.', `${pageIntro('Certificate enquiries', 'Your treatment records.<br><em>A little help finding them.</em>', 'Need a duplicate copy of an export container fumigation certificate or help verifying treatment documentation for customs? Submit your reference to our documentation desk.')}<section class="container form-layout"><aside class="form-aside reveal"><span class="eyebrow">Documentation desk</span><h2>A reference number.<br>A helpful starting point.</h2><p>Share your certificate or container reference with our documentation desk. The team will respond directly about the records you need.</p><ul class="check-list"><li>Have your certificate reference number or container number ready</li><li>Include treatment date and port of loading if available</li><li>Attach shipping bill or bill of lading copy in WhatsApp or email after submission</li></ul><a class="text-link" href="mailto:docs@ecomax.co.in">docs@ecomax.co.in ${arrow}</a></aside><div class="form-panel reveal"><h2>Request document verification</h2><p class="form-intro">Prepare an enquiry for our documentation team. Your reference is reviewed by the team after you send your message.</p><form class="enquiry-form" data-enquiry="certificate" novalidate>
  <div class="form-section form-section-required">
    <div class="form-section-header">
      <span class="form-section-badge required-badge">YOUR DOCUMENT ENQUIRY</span>
      <h3>Help us identify your record</h3>
      <p>Share the reference and your contact details for a direct response.</p>
    </div>

    <div class="form-fields-grid">
      <div class="field" data-field="reference">
        <label for="reference">Certificate or Container Reference <span class="req-star" aria-hidden="true">*</span></label>
        <input id="reference" name="reference" maxlength="100" placeholder="e.g. ID-2026-XXXX or MEDU1234567" required>
        <span class="field-error" aria-live="polite"></span>
      </div>

      <div class="field" data-field="name">
        <label for="full-name">Your Full Name <span class="req-star" aria-hidden="true">*</span></label>
        <input id="full-name" name="name" autocomplete="name" maxlength="100" placeholder="e.g. Rajesh Shah" required>
        <span class="field-error" aria-live="polite"></span>
      </div>

      <div class="field" data-field="phone">
        <label for="phone">Phone Number <span class="req-star" aria-hidden="true">*</span></label>
        <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="e.g. +91 98765 43210" maxlength="22" required>
        <span class="field-error" aria-live="polite"></span>
      </div>

      <div class="field" data-field="company">
        <label for="company">Company / Exporter Name</label>
        <input id="company" name="company" autocomplete="organization" maxlength="150" placeholder="e.g. Patel Exports Ltd">
        <span class="field-error" aria-live="polite"></span>
      </div>
    </div>
  </div>

  <details class="form-section form-section-optional"><summary class="optional-form-summary"><span><strong>Add a few more details</strong><small>Treatment date, shipment and document notes (optional)</small></span><span class="optional-plus" aria-hidden="true">+</span></summary>
    <div class="form-section-header optional-heading">
      <span class="form-section-badge optional-badge">OPTIONAL DETAILS</span>
      <h3>Shipment Notes &amp; Discharge Port</h3>
      <p>Share these optional details to help our team locate archival records faster.</p>
    </div>

    <div class="field field-full" data-field="message">
      <label for="message">Shipment Details &amp; Notes</label>
      <textarea id="message" name="message" rows="4" maxlength="2000" placeholder="Treatment date, vessel name, port of discharge, or specific documentation requested by buyer."></textarea>
    </div>
  </details>

  <div class="form-footer-action">
    <div class="field" data-field="consent">
      <label class="checkbox-field">
        <input type="checkbox" name="consent" id="cert-consent-check" required>
        <span>I agree to share these details with the ID Pest Control Services team for document verification. <a href="privacy.html">Privacy details</a>.</span>
      </label>
      <span class="field-error" aria-live="polite"></span>
    </div>

    <div class="form-submit-row">
      <button class="button button-submit" type="submit">
        <span>Prepare document enquiry</span>
        <span class="button-arrow">${arrow}</span>
      </button>
      <div class="form-guarantee">
        <span class="status-dot"></span>
        <span>Reviewed directly by our documentation team</span>
      </div>
    </div>
  </div>

  <div class="enquiry-result" role="region" hidden tabindex="-1" aria-labelledby="result-title">
    <h3 id="result-title">Ready to contact the documentation team.</h3>
    <p>Send your prepared message using one of the options below.</p>
    <div class="result-actions">
      <a class="button button-whatsapp" data-whatsapp target="_blank" rel="noopener noreferrer">
        <span>Continue on WhatsApp</span>
        <span class="button-arrow">${arrow}</span>
      </a>
      <a class="text-link" data-email>Send by email ${arrow}</a>
    </div>
  </div>
</form><noscript><p>Please email your certificate reference to <a href="mailto:docs@ecomax.co.in">docs@ecomax.co.in</a>.</p></noscript></div></section>`);

add('privacy.html', 'Privacy Policy', 'How enquiries and contact details are handled on the ID Pest Control Services website.', `${pageIntro('Privacy', 'Your details.<br><em>Handled with care.</em>', 'A straightforward explanation of how ID Pest Control Services handles your enquiries.')}<article class="container prose"><h2>Information you choose to share</h2><p>The enquiry forms let you prepare a message containing your name, contact details, location, and service requirements. Form entries are not saved by this website or submitted to a website database.</p><h2>Sending an enquiry</h2><p>After preparing a message, you choose whether to send it through WhatsApp or your email application. The relevant provider handles information according to its own terms and privacy policy. Details you send are used by the ID Pest Control Services team to respond to and coordinate your enquiry.</p><h2>External links</h2><p>WhatsApp and Google Maps links take you to external services. Maps are not embedded on this site. We do not set analytics or advertising cookies in the website code.</p><h2>Hosting</h2><p>The hosting provider may process technical request information, such as IP addresses and browser information, when serving website pages.</p><h2>Questions about your information</h2><p>To ask about information you have shared with our team, contact <a href="mailto:docs@ecomax.co.in">docs@ecomax.co.in</a> or <a href="tel:+918401137910">+91 84011 37910</a>.</p></article>`);

// Match downloadable brand assets and favicon to the shared header mark.
for (const [file, color] of [['logo.svg', '#163b32'], ['logo-icon.svg', '#163b32'], ['logo-light.svg', '#f8f8f0'], ['favicon.svg', '#163b32']]) {
  try {
    const svg = mark.replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" style="color:${color}" `).replace(' aria-hidden="true"', ' role="img" aria-label="ID Pest Control Services"');
    writeFileSync(`assets/images/${file}`, svg + '\n');
  } catch (err) {
    // Graceful recovery if file is transiently locked by live preview
  }
}
for (const [file, content] of pages) writeFileSync(file, content.replace(/[ \t]+$/gm, '') + '\n');
console.log(`Built ${pages.size} static pages.`);
