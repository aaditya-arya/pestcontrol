import { writeFileSync } from 'node:fs';
import { layout, mark, arrow, btn, img, sectionHead, pageIntro, cta, cards, steps, faq, homePage, hubExplorer } from './components.mjs';

// Shared templates generate complete HTML for hosting without a build server.
export const services = [
  {
    slug: 'container-fumigation',
    title: 'Container fumigation (20ft & 40ft)',
    short: 'Export containers & cargo',
    category: 'Export fumigation',
    image: 'container-fumigation.jpg',
    alt: 'Shipping containers at Mundra port terminal ready for fumigation treatment',
    description: 'NSPM & international quarantine compliant fumigation for 20ft, 40ft GP, and 40ft High Cube containers. Coordinated on-wheel at your factory stuffing docks or Mundra CFS yards.',
    intro: 'Eliminate quarantine risks, prevent demurrage, and maintain vessel schedules with certified container fumigation planned around your stuffing and shipping line cut-offs.',
    includes: [
      'On-wheel container treatment at your factory loading dock or CFS facility',
      'Certified Methyl Bromide (MBr) or Aluminium Phosphide (ALP) application',
      'Gas-tight door gasket sealing and calibrated PPM concentration monitoring',
      'Controlled mechanical aeration below 1.0 ppm TLV safety clearance standard',
      'Same-day issuance of official Fumigation, Sealing, and Gas-Free Certificates',
      'Customs and shipping line documentation coordinated directly with your export desk'
    ],
    prepare: 'Share container count, container numbers & sizes (20\'/40\'/HQ), commodity type, stuffing location address, destination port quarantine requirements (e.g., Australia BMSB, US-APHIS, EU), and shipping line vessel cut-off. Our port operations desk will confirm the treatment schedule immediately.',
    hub: 'Ahmedabad, Mundra Port & across Gujarat',
    kind: 'export'
  },
  {
    slug: 'pallet-treatment',
    title: 'Pallet & wood packaging treatment (ISPM-15)',
    short: 'Pallets, crates & dunnage',
    category: 'Export fumigation',
    image: 'pallet-box-fumigation.jpg',
    alt: 'ISPM-15 compliant wooden pallets and export packaging crates with IPPC marking',
    description: 'ISPM-15 certified Heat Treatment (HT 56°C) and Methyl Bromide (MB) fumigation for wooden pallets, crates, boxes, and dunnage with permanent IPPC stamping.',
    intro: 'Ensure immediate overseas customs clearance for export packaging. Certified treatments with accredited IPPC stamping accepted across 180+ countries worldwide.',
    includes: [
      'Technical assessment of raw wood, debarking status, and moisture levels',
      'ISPM-15 Heat Treatment (HT 56°C / 30 min core) or Methyl Bromide (MB) treatment',
      'Permanent IPPC official stamp (IN - XXX - MB/HT) applied to all treated pieces',
      'Accredited treatment certificates issued for customs and shipping lines',
      'Mobile treatment at client facilities in Morbi/Ahmedabad or chamber processing'
    ],
    prepare: 'Provide the quantity, dimensions, and wood type of pallets, boxes, or dunnage, overseas destination country, and required dispatch date. We will confirm treatment scheduling and documentation.',
    hub: 'Morbi, Ahmedabad & Mundra',
    kind: 'export'
  },
  {
    slug: 'warehouse-fumigation',
    title: 'Warehouse & commodity stack fumigation',
    short: 'Commodity stacks & silos',
    category: 'Export fumigation',
    image: 'stack-fumigation.jpg',
    alt: 'Hermetically sealed commodity stacks inside an agricultural warehouse',
    description: 'Gas-tight enclosure fumigation for bulk and bagged agricultural commodities—spices, cumin, fennel, sesame, grains, and pulses across Gujarat\'s storage corridors.',
    intro: 'Safeguard stored agricultural commodities against destructive stored-grain pests with hermetically sealed phosphine stack fumigation engineered for export quality.',
    includes: [
      'Pre-fumigation commodity inspection, moisture testing, and pest identification',
      '500-micron multilayer gas-tight enclosure with sand-snake hermetic sealing',
      'Calibrated Aluminium Phosphide dosing and continuous phosphine gas monitoring',
      'Extended gas exposure protocol ensuring 100% mortality of eggs, larvae, and adults',
      'Controlled degassing, residue-free commodity clearance, and safe re-entry certification'
    ],
    prepare: 'Tell us the commodity type (cumin, fennel, sesame, castor, grains, pulses), total tonnage or bag count, godown location, and export dispatch timeline. Our Unjha or regional squad will mobilize.',
    hub: 'Unjha, Saurashtra & across Gujarat',
    kind: 'export'
  },
  {
    slug: 'commercial-pest-management',
    title: 'Commercial & industrial facility IPM',
    short: 'Industrial IPM & audits',
    category: 'Pest management',
    image: 'cleanroom_pharma_ipm.jpg',
    alt: 'Industrial technician inspecting an audit-ready pest monitoring station in a cleanroom facility',
    description: 'Audit-ready Integrated Pest Management (IPM) for pharmaceutical manufacturing, food processing facilities, ceramic plants, and high-tech warehouses.',
    intro: 'Pass stringent regulatory audits (USFDA, HACCP, BRCGS, GMP, FSSAI) with an inspection-driven IPM program designed around sensitive manufacturing zones.',
    includes: [
      'Facility hazard mapping: zoning into red, yellow, and green hygiene areas',
      'Barcoded tamper-resistant exterior rodent stations with digital trend analysis',
      'Insect Light Traps (ILTs), pheromone monitors, and cleanroom glue boards',
      'Zero-chemical interventions for sensitive formulation and packaging lines',
      'Comprehensive audit file maintenance, SDS sheets, and monthly trend reports'
    ],
    prepare: 'Share facility square footage, industry sector, current audit framework (USFDA, BRCGS, GMP, FSSAI), and high-sensitivity production areas. Our technical manager will schedule an initial facility audit.',
    hub: 'Across all four hubs',
    kind: 'pest'
  },
  {
    slug: 'termite-control',
    title: 'Anti-termite structural protection',
    short: 'Structural termite defense',
    category: 'Pest management',
    image: 'img_termite.jpg',
    alt: 'Certified termite barrier treatment at a commercial industrial property',
    description: 'Pre-construction chemical barrier treatment as per IS 6313 with multi-year warranty and post-construction drill-fill-seal protection for factories and commercial buildings.',
    intro: 'Protect industrial factories, warehouses, and commercial developments against destructive subterranean termite damage with BIS-compliant chemical barriers.',
    includes: [
      'Comprehensive subterranean termite runway mapping and risk assessment',
      'Pre-construction soil barrier treatment conforming strictly to IS 6313 (Part II)',
      'Post-construction DRILL-FILL-SEAL floor-wall joint chemical barrier treatment',
      'Non-repellent, odorless advanced termiticides ensuring complete colony elimination',
      'Official Multi-Year Service Warranty Certificate with annual re-inspections'
    ],
    prepare: 'Indicate whether the site is under construction (foundation/plinth stage) or occupied, built-up square footage, and current termite activity.',
    hub: 'Across Gujarat',
    kind: 'pest'
  },
  {
    slug: 'rodent-control',
    title: 'Industrial rodent control & exclusion',
    short: 'Rodent exclusion & monitoring',
    category: 'Pest management',
    image: 'img_rodent.jpg',
    alt: 'Industrial tamper-resistant rodent monitoring equipment at a logistics facility',
    description: 'Exterior perimeter baiting, mechanical multi-catch trapping, and building exclusion to safeguard export cargo, electrical wiring, and goods against rodent contamination.',
    intro: 'Defend large-scale warehouses, logistics parks, and manufacturing plants against rodent ingress with systematic perimeter containment and proofing.',
    includes: [
      'Exterior perimeter anchor-bolted, tamper-resistant bait stations',
      'Interior non-toxic mechanical multi-catch traps and runway glue boards',
      'Burrow identification, active harborage eradication, and perimeter mapping',
      'Structural rodent exclusion: brush seals for dock doors and wire mesh proofing',
      'Digital station logs, bait consumption records, and audit trend analysis'
    ],
    prepare: 'Provide facility area, perimeter length, stored goods type (food, grains, electrical), and observed rodent signs. Treatment plan will be configured after perimeter survey.',
    hub: 'Across Gujarat',
    kind: 'pest'
  },
  {
    slug: 'general-pest-control',
    title: 'Commercial general pest control',
    short: 'Facility pest defense',
    category: 'Pest management',
    image: 'img_general_pest.jpg',
    alt: 'Professional pest control technician treating the perimeter of a commercial facility',
    description: 'Targeted multi-pest protection for industrial canteens, corporate offices, processing floors, worker dormitories, and commercial establishments.',
    intro: 'Maintain high hygiene and worker comfort across industrial and commercial facilities with targeted treatments for cockroaches, flies, ants, and crawling insects.',
    includes: [
      'Comprehensive inspection of factory canteens, pantries, and crawl spaces',
      'Odorless cockroach gel baiting in electrical panels and food prep areas',
      'Micron ULV cold fogging and residual perimeter barrier treatments',
      'Drain bio-cleansing and fly breeding source elimination',
      'Flexible off-shift scheduling ensuring zero production plant downtime'
    ],
    prepare: 'Share premises square footage, number of floors, canteen presence, and primary pest concerns. Appointments can be scheduled during off-shift hours.',
    hub: 'Across Gujarat',
    kind: 'pest'
  },
];
const pages = new Map();
const add = (file, title, description, content) => pages.set(file, layout(file, title, description, content));

add('index.html', 'Container Fumigation & Industrial Pest Management', 'Accredited export container fumigation, ISPM-15 wood packaging treatment, and audit-ready commercial IPM across Gujarat.', homePage());

add('b2b-fumigation.html', 'Export container & cargo fumigation', 'NSPM & ISPM-15 compliant container fumigation, wood packaging, and warehouse stack treatments across Ahmedabad, Mundra Port, Morbi, and Unjha.', `${pageIntro('Export fumigation', 'Export cargo.<br><em>Engineered for global clearance.</em>', 'NSPM & ISPM-15 compliant fumigation support for exporters, manufacturers, logistics coordinators, and shipping lines. Precision treatment planned around container stuffing, ICD movement, and vessel cut-offs.')}<div class="container wide-photo reveal">${img('hero_b2b_page.jpg', 'Export shipping containers at terminal in warm morning light', '', true)}<span>FROM FACTORY STUFFING DOCKS TO MUNDRA PORT TERMINALS</span></div><section class="section container">${sectionHead('Built around your shipping schedule', 'Certified export services.<br>Zero quarantine delays.', 'Select a service to inspect approved gases, dosage standards, exposure times, and documentation.')}${cards(services.filter(s => s.kind === 'export'))}</section><section class="section section-tinted"><div class="container split-section"><div class="reveal"><span class="eyebrow">Before you book</span><h2>Key export parameters.<br>For fast turnaround.</h2><p>Fumigation protocols differ by commodity, destination country quarantine requirements, packaging material, and shipping line gate-in timelines. Sharing these parameters ensures instant mobilization.</p></div><ul class="check-list reveal"><li>Container count, size (20\' GP, 40\' GP, 40\' HQ, Reefer) and container numbers</li><li>Commodity description, HS code, and packaging type (bulk, bagged, wooden pallets)</li><li>Destination country and specific quarantine protocol (e.g. Australia BMSB, US-APHIS, EU)</li><li>Stuffing location address (factory premises or port CFS terminal)</li><li>Shipping line vessel cut-off date and required documentation delivery time</li></ul></div></section><section class="section container narrow">${sectionHead('Export logistics answers', 'Technical queries & port clearance.')}${faq([['Can container fumigation be performed on-wheel at our factory premises?', 'Yes. Our licensed technical squads operate mobile fumigation units across Gujarat. We treat containers on-wheel at your factory loading dock immediately upon stuffing completion, apply certified seals, and conduct gas monitoring before container dispatch.'], ['Which international quarantine documents will we receive?', 'We issue official Fumigation Certificates recognized by global plant quarantine agencies, Container Sealing Records, and Gas-Free / Aeration Clearance Certificates for port customs. For verifying existing certificates, visit our certificate enquiries desk.'], ['What is the treatment and aeration window for shipping containers?', 'Methyl Bromide treatments typically require a 24-hour gas exposure period followed by 2–4 hours of forced mechanical aeration until residual gas drops below 1.0 ppm TLV. Phosphine treatments for bulk agricultural commodities generally require 5 to 7 days depending on temperature.']])}</section>${cta()}`);

add('pest-control.html', 'Commercial & industrial pest management', 'Inspection-led, audit-ready IPM for manufacturing facilities, pharmaceutical cleanrooms, food processing plants, and commercial properties across Gujarat.', `${pageIntro('Pest management', 'Industrial IPM.<br><em>Audit-ready facility care.</em>', 'Inspection-led Integrated Pest Management for pharmaceutical plants, food processing facilities, warehouses, and commercial properties. Engineered to pass strict USFDA, HACCP, BRCGS, and GMP audits.')}<div class="container wide-photo reveal">${img('cleanroom_pharma_ipm.jpg', 'Industrial technician inspecting pest monitoring station in clean facility', '', true)}<span>AUDIT-COMPLIANT IPM • USFDA, HACCP &amp; BRCGS READY</span></div><section class="section container">${sectionHead('Facility pest defense', 'Specialized protocols.<br>Zero production downtime.', 'Select a service to view technical specifications, monitoring hardware, and audit documentation.')}${cards(services.filter(s => s.kind === 'pest'))}</section><section class="section section-tinted"><div class="container">${sectionHead('Systematic commercial IPM', 'Assess. Monitor. Protect.', 'We eliminate pest risks at the source, install barcoded monitoring stations, and maintain audit-compliant documentation.')}${steps()}</div></section><section class="section container narrow">${sectionHead('Facility manager FAQ', 'Industrial IPM answers.')}${faq([['Do treatments cause downtime for manufacturing or packaging lines?', 'No. Our commercial IPM programs utilize non-chemical physical exclusions, odorless baiting, and targeted applications scheduled during off-shift hours or plant maintenance shutdowns to ensure continuous operations.'], ['Are your IPM programs compliant with USFDA and BRCGS audits?', 'Yes. We supply comprehensive audit files including SDS safety sheets, technician licenses, floorplan station layouts, barcoded trap inspection logs, and digital pest trend analysis graphs.'], ['What if we encounter an urgent pest issue between scheduled visits?', 'All commercial contracts include dedicated emergency response coverage. Our regional mobile technician will mobilize to your site within 2 to 4 hours.']])}</section>${cta()}`);

function relatedServices(current) {
  const related = services.filter(s => s.kind === current.kind && s.slug !== current.slug).slice(0, 2);
  return `<section class="section container related-services">${sectionHead('Complementary industrial services', 'Coordinated B2B care.')}${cards(related)}</section>`;
}
for (const s of services) {
  add(`${s.slug}.html`, s.title, s.description, `${pageIntro(s.category, `${s.short}.<br><em>Engineered protocol.</em>`, s.intro)}<section class="container detail-grid"><div class="detail-image reveal">${img(s.image, s.alt, '', true)}<p>${s.hub}</p></div><div class="detail-content reveal"><span class="eyebrow">Technical scope</span><h2>Compliant execution.<br>Verified results.</h2><p>${s.description}</p><ul class="check-list">${s.includes.map(x => `<li>${x}</li>`).join('')}</ul><div class="detail-actions">${btn(`book-inspection.html?service=${s.slug}`, 'Enquire about this service')}<button type="button" class="button button-secondary" data-open-specs="${s.slug}"><span>Inspect technical protocol</span><span class="button-arrow">${arrow}</span></button></div></div></section><section class="section section-tinted"><div class="container split-section"><div class="reveal"><span class="eyebrow">Parameters to share</span><h2>What our operations desk<br>needs to confirm.</h2></div><div class="reveal"><p class="large-text">${s.prepare}</p><a class="text-link" href="${s.kind === 'export' ? 'b2b-fumigation' : 'pest-control'}.html">See all ${s.kind === 'export' ? 'fumigation' : 'pest management'} services ${arrow}</a></div></div></section>${relatedServices(s)}${cta()}`);
}

const hubs = [
  ['ahmedabad', 'Ahmedabad', 'Headquarters & Pharma IPM', '405, Tryksha Desire, Opp. Shivshakti Nagar BRTS, Chandkheda, Ahmedabad 382424', 'Central operations coordination, industrial cleanroom IPM, and export documentation desk.', '84011 37910', '918401137910'],
  ['mundra', 'Mundra', 'Port SEZ & CFS Logistics Desk', 'Port Road CFS Corridor, Adani Port SEZ, Mundra, Kutch', '20ft & 40ft container fumigation, on-wheel factory stuffing support, and port customs clearance.', '98984 72483', '919898472483'],
  ['morbi', 'Morbi', 'Ceramic Export & Wood Packaging', 'National Highway 8-A, Ceramic Association Zone, Morbi', 'Wood packaging treatment and support for the ceramic industry.', '84011 37910', '918401137910'],
  ['unjha', 'Unjha', 'APMC Agricultural Trade Hub', 'APMC Market Yard Corridor, Godown Area, Unjha 384170', 'Warehouse stack fumigation and hermetic phosphine treatment for spices, seeds, and grains.', '98984 72483', '919898472483'],
];
add('branches.html', 'Operational hubs across Gujarat', 'Direct access to ID Pest Control and Ecomax teams in Ahmedabad, Mundra Port, Morbi, and Unjha. Contact your local operations desk.', `${pageIntro('Our locations', 'Logistics presence.<br><em>Close to your operations.</em>', 'Four strategic hubs across Gujarat, placing our licensed squads directly along primary export corridors, port terminals, and manufacturing belts.')}${hubExplorer(hubs)}<section class="container branches-layout"><aside class="branches-aside reveal"><span class="eyebrow">Operations desks</span><h2>Direct<br>contacts.</h2><p>Connect with your nearest operations desk for immediate deployment. 24/7 coordination available for urgent container cut-offs.</p><div class="branch-jump">${hubs.map(([id, city]) => `<a href="#${id}">${city}${arrow}</a>`).join('')}</div></aside><div class="branch-cards">${hubs.map(([id, city, type, address, text, phone, raw], i) => `<article class="branch-card reveal" id="${id}" data-city="${city}" data-type="${type}" data-description="${text}"><span class="eyebrow">0${i + 1} / ${type}</span><h2>${city}</h2><p>${text}</p><address>${address}</address><div class="branch-actions"><a class="text-link" href="tel:+${raw}">+91 ${phone}${arrow}</a><a class="subtle-link" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(address)}" target="_blank" rel="noopener noreferrer">${id === 'ahmedabad' ? 'Get directions' : 'View service area'} ↗</a></div></article>`).join('')}</div></section>${cta()}`);

add('about.html', 'About ID Pest Control & Ecomax Industrial', 'Commercial pest management and export fumigation across Gujarat. Decades of combined technical experience supporting exporters and industrial facilities.', `${pageIntro('About us', 'Industrial compliance.<br><em>Experienced field teams.</em>', 'ID Pest Control & Ecomax Industrial brings accredited export fumigation and audit-ready commercial pest management together under one rigorous, accountable approach.')}<section class="container about-grid"><div class="about-image reveal">${img('ahmedabad_central_hq.jpg', 'Office and operations space in Ahmedabad', '', true)}</div><div class="reveal"><span class="eyebrow">Our approach</span><h2>Good service should<br>feel straightforward.</h2><p>Whether you are protecting a high-sensitivity pharmaceutical cleanroom or preparing 40ft export containers for vessel cut-off at Mundra, you need a team that understands strict quarantine standards and communicates with operational clarity.</p><p>From our headquarters in Ahmedabad and dedicated field hubs in Mundra, Morbi, and Unjha, we coordinate treatments directly around your stuffing docks, manufacturing shifts, and port movements.</p><p>We start by assessing technical requirements, define the exact treatment protocol, and deliver verified documentation on time, every time.</p>${btn('contact.html', 'Connect with our operations desk', true)}</div></section><section class="section section-tinted"><div class="container">${sectionHead('Operational standards', 'Precision dosing.<br>Verified documentation.')}${steps()}</div></section>${cta()}`);

const serviceOptions = `<option value="">Select a service</option>${services.map(s => `<option value="${s.slug}">${s.title}</option>`).join('')}<option value="not-sure">I’m not sure yet</option>`;
const form = () => `<form class="enquiry-form" data-enquiry="inspection"><div class="form-row"><div class="field"><label for="full-name">Your name <span>(required)</span></label><input id="full-name" name="name" autocomplete="name" placeholder="Full name" maxlength="100" required></div><div class="field"><label for="phone">Phone number <span>(required)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="Your contact number" pattern="[+0-9() .-]{7,22}" title="Enter a phone number with 7 to 15 digits." required></div></div><div class="form-row"><div class="field"><label for="email">Email <span>(optional)</span></label><input id="email" name="email" type="email" autocomplete="email" placeholder="you@company.com" maxlength="150"></div><div class="field"><label for="company">Company <span>(optional)</span></label><input id="company" name="company" autocomplete="organization" placeholder="Company or organisation" maxlength="150"></div></div><div class="field"><label for="service">How can we help? <span>(required)</span></label><select id="service" name="service" required>${serviceOptions}</select></div><div class="form-row"><div class="field"><label for="location">Location <span>(required)</span></label><input id="location" name="location" autocomplete="address-level2" placeholder="City or treatment location" maxlength="200" required></div><div class="field"><label for="preferred-date">Preferred date <span>(optional)</span></label><input id="preferred-date" name="date" type="date" aria-describedby="date-help"></div></div><p class="field-help" id="date-help">Your preferred date is a request. The team will confirm availability.</p><div class="field"><label for="message">A few details <span>(optional)</span></label><textarea id="message" name="message" rows="4" maxlength="2000" placeholder="Tell us about your space, pest concern, or shipment requirements."></textarea></div><label class="checkbox-field"><input type="checkbox" name="consent" required><span>I agree to share these details with the team to respond to my enquiry. <a href="privacy.html">Privacy details</a>.</span></label><button class="button" type="submit"><span>Prepare my enquiry</span><span class="button-arrow">${arrow}</span></button><p class="form-note">We’ll prepare your message for WhatsApp or email. Nothing is sent until you send it.</p><div class="enquiry-result" hidden tabindex="-1" aria-labelledby="result-title"><h3 id="result-title">Your message is ready.</h3><p>Choose how to send it. Your request is confirmed only after the team replies.</p><div class="result-actions"><a class="button" data-whatsapp target="_blank" rel="noopener noreferrer"><span>Continue on WhatsApp</span><span class="button-arrow">${arrow}</span></a><a class="text-link" data-email>Send by email ${arrow}</a></div></div></form>`;

add('book-inspection.html', 'Book container fumigation or request quote', 'Request export container fumigation, ISPM-15 wood packaging treatment, or commercial pest inspection across Gujarat.', `${pageIntro('Arrange service', 'The first step<br><em>is a conversation.</em>', 'Request container fumigation, ISPM-15 wood treatment, or an industrial IPM quote. A few operational details help our technical team dispatch promptly.')}<section class="container form-layout"><aside class="form-aside reveal"><span class="eyebrow">Direct coordination</span><h2>Tell us a little.<br>We’ll handle the rest.</h2><p>No generic automated quotes. Every proposal is calibrated to your container count, commodity, facility layout, and destination quarantine rules.</p><div class="contact-mini"><span>Direct Ops Hotline</span><a href="tel:+918401137910">+91 84011 37910 ${arrow}</a><span>Documentation Desk</span><a href="mailto:docs@ecomax.co.in">docs@ecomax.co.in ${arrow}</a></div><div class="aside-note">Immediate dispatch available for urgent vessel cut-offs across Ahmedabad, Mundra, Morbi, and Unjha.</div></aside><div class="form-panel reveal"><div class="form-steps" aria-label="Enquiry steps"><span class="form-step is-current" data-form-step="1" aria-current="step"><b>01</b> Your details</span><span class="form-step" data-form-step="2"><b>02</b> Send your message</span></div><h2 data-form-heading>Request container fumigation or inspection</h2><p class="form-intro">Fields marked required help our operations desk respond within 30 minutes.</p>${form()}<noscript><p>Please <a href="tel:+918401137910">call +91 84011 37910</a> or <a href="mailto:docs@ecomax.co.in">email docs@ecomax.co.in</a> to arrange a visit.</p></noscript></div></section>`);

add('contact.html', 'Contact ID Pest Control & Ecomax Industrial', 'Contact our operations desks in Ahmedabad, Mundra, Morbi, and Unjha for container fumigation, ISPM-15, and industrial IPM.', `${pageIntro('Contact', 'Operations desks.<br><em>Direct industrial support.</em>', 'Have an export shipment approaching cut-off, a facility audit to prepare for, or a certificate question? Reach our central operations team immediately.')}<section class="container contact-grid"><a class="contact-card reveal" href="tel:+918401137910"><span class="eyebrow">01 / Direct telephone</span><h2>Call operations desk.</h2><p>Speak directly with our technical coordinator for urgent container cut-offs and facility emergencies.</p><span class="text-link">+91 84011 37910 ${arrow}</span></a><a class="contact-card reveal" href="https://wa.me/918401137910" target="_blank" rel="noopener noreferrer"><span class="eyebrow">02 / WhatsApp dispatch</span><h2>Start instant chat.</h2><p>Share container numbers, stuffing locations, and photos directly with our dispatch manager.</p><span class="text-link">Chat on WhatsApp ${arrow}</span></a><a class="contact-card reveal" href="mailto:docs@ecomax.co.in"><span class="eyebrow">03 / Documentation</span><h2>Email export desk.</h2><p>Certificate requests, formal RFQs, and vendor audit questionnaires.</p><span class="text-link">docs@ecomax.co.in ${arrow}</span></a></section><section class="section container"><div class="contact-location reveal"><div><span class="eyebrow">Central headquarters</span><h2>Ahmedabad<br>HQ office.</h2><address>405, Tryksha Desire<br>Opp. Shivshakti Nagar BRTS<br>Chandkheda, Ahmedabad 382424<br>Gujarat, India</address><div class="hero-actions">${btn('https://www.google.com/maps/search/?api=1&amp;query=405%20Tryksha%20Desire%20Chandkheda%20Ahmedabad', 'Get directions', true)}<a class="text-link" href="branches.html">All four logistics hubs ${arrow}</a></div></div>${img('ahmedabad_central_hq.jpg', 'Ahmedabad central headquarters building')}</div></section>${cta()}`);

add('certificate.html', 'Fumigation certificate enquiries & verification', 'Track, verify, or request duplicate copies of your export container fumigation and ISPM-15 treatment certificates.', `${pageIntro('Certificate enquiries', 'Official documentation.<br><em>Clarity when it matters.</em>', 'Need a copy of an export fumigation certificate or help verifying treatment documentation for customs? Submit your reference to our documentation desk.')}<section class="container form-layout"><aside class="form-aside reveal"><span class="eyebrow">Documentation desk</span><h2>Verified by specialists.<br>With complete context.</h2><p>Our dedicated documentation desk in Ahmedabad reviews your certificate reference against treatment logs and container records, responding directly with verified copies.</p><ul class="check-list"><li>Have your certificate reference number or container number ready</li><li>Include treatment date and port of loading if available</li><li>Attach shipping bill or bill of lading copy in WhatsApp or email after submission</li></ul><a class="text-link" href="mailto:docs@ecomax.co.in">docs@ecomax.co.in ${arrow}</a></aside><div class="form-panel reveal"><h2>Request document verification</h2><form class="enquiry-form" data-enquiry="certificate"><div class="field"><label for="reference">Certificate or container reference <span>(required)</span></label><input id="reference" name="reference" maxlength="100" placeholder="Certificate number or container number (e.g. EC-2026-XXXX / MEDU1234567)" required></div><div class="field"><label for="full-name">Your name &amp; company <span>(required)</span></label><input id="full-name" name="name" autocomplete="name" maxlength="100" placeholder="Full name and company name" required></div><div class="field"><label for="phone">Phone number <span>(required)</span></label><input id="phone" name="phone" type="tel" autocomplete="tel" pattern="[+0-9() .-]{7,22}" title="Enter a phone number with 7 to 15 digits." required></div><div class="field"><label for="message">Shipment details <span>(optional)</span></label><textarea id="message" name="message" rows="4" maxlength="2000" placeholder="Treatment date, vessel name, port of discharge, or specific documentation requested by buyer."></textarea></div><label class="checkbox-field"><input type="checkbox" name="consent" required><span>I agree to share these details for a response. <a href="privacy.html">Privacy details</a>.</span></label><button class="button" type="submit"><span>Prepare document enquiry</span><span class="button-arrow">${arrow}</span></button><p class="form-note">This prepares an enquiry for our documentation team. It does not fabricate automated verification.</p><div class="enquiry-result" hidden tabindex="-1" aria-labelledby="result-title"><h3 id="result-title">Ready to contact the documentation team.</h3><p>Send your prepared message using one of the options below.</p><div class="result-actions"><a class="button" data-whatsapp target="_blank" rel="noopener noreferrer"><span>Continue on WhatsApp</span><span class="button-arrow">${arrow}</span></a><a class="text-link" data-email>Send by email ${arrow}</a></div></div></form><noscript><p>Please email your certificate reference to <a href="mailto:docs@ecomax.co.in">docs@ecomax.co.in</a>.</p></noscript></div></section>`);

add('privacy.html', 'Privacy', 'How enquiries and personal details are handled on the ID Pest Control and Ecomax Industrial website.', `${pageIntro('Privacy', 'Your details.<br><em>Handled with care.</em>', 'A straightforward explanation of how this website handles enquiries.')}<article class="container prose"><h2>Information you choose to share</h2><p>The enquiry forms let you prepare a message containing your name, contact details, location, and service requirements. Form entries are not saved by this website or submitted to a website database.</p><h2>Sending an enquiry</h2><p>After preparing a message, you choose whether to send it through WhatsApp or your email application. The relevant provider handles information according to its own terms and privacy policy. Details you send are used by our team to respond to and coordinate your enquiry.</p><h2>External links</h2><p>WhatsApp and Google Maps links take you to external services. Maps are not embedded on this site. We do not set analytics or advertising cookies in the website code.</p><h2>Hosting</h2><p>The hosting provider may process technical request information, such as IP addresses and browser information, when serving website pages.</p><h2>Questions about your information</h2><p>To ask about information you have shared with our team, contact <a href="mailto:docs@ecomax.co.in">docs@ecomax.co.in</a> or <a href="tel:+918401137910">+91 84011 37910</a>.</p></article>`);

// Match downloadable brand assets and favicon to the shared header mark.
for (const [file, color] of [['logo.svg', '#163b32'], ['logo-icon.svg', '#163b32'], ['logo-light.svg', '#f8f8f0'], ['favicon.svg', '#163b32']]) {
  const svg = mark.replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" style="color:${color}" `).replace(' aria-hidden="true"', ' role="img" aria-label="ID Pest Control"');
  writeFileSync(`assets/images/${file}`, svg + '\n');
}
for (const [file, content] of pages) writeFileSync(file, content + '\n');
console.log(`Built ${pages.size} static pages.`);
