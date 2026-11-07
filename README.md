# ID Pest Control Services

A responsive static website for pest management and export fumigation across Gujarat.

## Preview and check

Use Node.js 22+ and Python 3. Run `npm ci`, `npm run build`, then `npm start`. Open http://127.0.0.1:4173.

- `npm test` checks all internal routes, anchors, assets, landmarks, and page titles.
- `npm run test:browser` checks all pages at desktop, tablet, and mobile widths, accessibility, navigation, forms, and reduced motion. It uses locally installed Google Chrome. Set a different Playwright channel in `playwright.config.js` if needed.
- `npm run audit:responsive` checks all pages at 17 widths, WCAG 2.2 AA rules, text spacing, landscape menus and keyboard focus. Start a separate Python server on port 4180 first, or set `AUDIT_URL`.
- `npm run audit:performance` records throttled mobile Chrome loading measurements against that server.
- See [WEBSITE-AUDIT.md](WEBSITE-AUDIT.md) for the audit results, saved evidence and testing limits.

## Editing

`scripts/build.mjs` contains the service catalogue and interior-page content. `scripts/service-content.mjs` is the shared source for plain-language service descriptions, scope and enquiry prompts. `scripts/components.mjs` contains the home page, shared header/footer, service cards, and reusable templates. Run `npm run build` after editing either file. Commit the generated root HTML files as well; any static web host can serve them directly without Node.js.

`styles.css` defines the shared color, spacing, typography, button, and responsive styles. `script.js` handles navigation, staggered scroll reveals, bounded hero image movement, the keyboard-accessible specifications drawer, and enquiries. Motion respects the device’s reduced-motion setting, including changes during a visit. Browser-native links preserve history, page metadata, anchors and opening pages in new tabs. CSS view transitions enhance supported browsers. Fonts are served locally with their license files in `assets/fonts`.

The five original page URLs are preserved. Dedicated pages cover all eight services, inspections/quotes, certificate enquiries, About, and privacy. Existing phone numbers, email, and the Ahmedabad headquarters address are retained from the original source.

## Enquiries

There is no backend or automatic booking. Forms validate locally and prepare WhatsApp and email links; visitors choose how to send their message. The team confirms pricing and availability directly. Certificate enquiries go to the documentation team; the site does not claim to verify records automatically.

No API keys, third-party analytics, external font requests, or embedded maps are required.

The homepage introduces the business briefly, followed by a visual catalogue of container, pallet/box and stack fumigation, five pest treatment cards, and four location links. The header is transparent at the top and gains a background after scrolling 30% of the viewport height. The locations page has one card per city with its main service, address or service area, and direct call, WhatsApp and city-specific enquiry links. There is no introductory splash screen.

## Images and enquiries

JPEG originals are retained as fallbacks. Responsive 640px and full-size WebP copies are selected through image srcset attributes. To regenerate them after replacing a JPEG, run `python scripts/optimize-images.py` (requires Pillow), then `npm run build`.

Location enquiries prefill the selected city. Service enquiries show relevant preparation prompts. Additional company, email, date and message fields expand on request. Names accept Indian scripts; the specifications panel traps focus and returns it to its trigger on close. Neither service nor certificate enquiries submit automatically.
