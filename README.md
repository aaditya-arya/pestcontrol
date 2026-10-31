# ID Pest Control & Ecomax Industrial

A responsive static website for pest management and export fumigation across Gujarat.

## Preview and check

Use Node.js 22+ and Python 3. Run `npm ci`, `npm run build`, then `npm start`. Open http://127.0.0.1:4173.

- `npm test` checks all internal routes, anchors, assets, landmarks, and page titles.
- `npm run test:browser` checks all pages at desktop, tablet, and mobile widths, accessibility, navigation, forms, and reduced motion. It uses locally installed Google Chrome. Set a different Playwright channel in `playwright.config.js` if needed.

## Editing

`scripts/build.mjs` contains the service catalogue and interior-page content. `scripts/components.mjs` contains the home page, shared header/footer, location explorer, and reusable templates. Run `npm run build` after editing either file. Commit the generated root HTML files as well; any static web host can serve them directly without Node.js.

`styles.css` defines the shared color, spacing, typography, button, and responsive styles. `script.js` handles navigation, staggered scroll reveals, bounded hero image movement, the keyboard-accessible location explorer, and enquiries. Motion respects the device’s reduced-motion setting, including changes during a visit. Cross-page transitions enhance supported browsers; ordinary links work everywhere. Fonts are served locally with their license files in `assets/fonts`.

The five original page URLs are preserved. Dedicated pages cover all seven treatments, inspections/quotes, certificate enquiries, About, and privacy. Existing phone numbers, email, and branch details are retained from the original source.

## Enquiries

There is no backend or automatic booking. Forms validate locally and prepare WhatsApp and email links; visitors choose how to send their message. The team confirms pricing and availability directly. Certificate enquiries go to the documentation team; the site does not claim to verify records automatically.

No API keys, third-party analytics, external font requests, or embedded maps are required.
