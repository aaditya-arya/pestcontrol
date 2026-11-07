# Website responsiveness and standards audit

**ID PEST CONTROL SERVICES · 7 November 2026**

The 17-page website passed the responsive layout checks in installed Google Chrome. The audit found and corrected keyboard navigation, accessible-name and photograph-overlay contrast issues. Automated checks support WCAG 2.2 AA readiness; this is not a full conformance certification.

[Mobile, tablet and desktop preview](output/qa/responsive-preview.jpg)

| Check | Result | Evidence and scope |
| --- | --- | --- |
| Responsive layouts | Pass | 289 checks: all 17 pages at 17 widths, from 320px to 1920px. No horizontal page overflow. |
| Phone and tablet layouts | Pass | 320, 360, 390, 414, 600, 640, 680, 681, 768, 820, 960, 961 and 1024px, including the breakpoint boundaries. |
| Desktop layouts | Pass | 1150, 1280, 1440 and 1920px. |
| Automated accessibility | Pass | 34 page scans: every page at 390px and 1440px, using axe WCAG 2.0 A/AA, 2.1 AA and 2.2 AA tags. Zero detected violations. |
| Expanded text spacing | Pass | All pages at 320, 390 and 1440px with 1.5 line height, .12em letter spacing, .16em word spacing and 2em paragraph spacing. No page overflow or detected control clipping. |
| Keyboard navigation | Pass | Skip link, visible focus, mobile menu Escape handling, specifications focus trap, return focus and scrollable technical details. Tab traversal across home, service and enquiry templates found no wholly obscured focused controls. |
| Touch and short landscape screens | Pass | Touch navigation through service pages; scrollable menu at 844×390; specifications drawer at 320×568 and 844×390. |
| Forms and enquiries | Pass | Field labels, validation, consent, city/service selection, encoded WhatsApp/email messages and accessible error/result states. Messages were prepared without sending them. |
| Images and links | Pass | Internal pages, anchors, responsive image sources, image decoding, font/script references and image alternative text. No detected broken requests or JavaScript errors. |
| Motion and fallback | Pass | Reduced-motion preference, keyboard-operated FAQs, and useful navigation/contact content with JavaScript disabled. |
| Basic search metadata | Pass | A unique title, description, language, unrestricted viewport and one H1 per page. |

The 320px and 640px layouts also exercise the layout space equivalent to a 1280px desktop viewport at 400% and 200% zoom. Native browser/OS zoom and assistive-technology combinations remain part of manual device validation.

## Fixes made during the audit

- **Skip navigation:** made the main content target programmatically focusable. Activating “Skip to content” now moves keyboard focus past the header.
- **Accessible names:** supplied appropriate region/group/navigation semantics for labelled blocks, corrected required-field indicators and retained the visible address in its accessible map-link name.
- **Photo contrast:** strengthened the homepage image overlay behind the transparent header. Sampled desktop navigation contrast improved from as low as **2.73:1** to at least **7.02:1**, measured at the top and before the header background appears. Tablet navigation controls received the same contrast protection.
- **Small-screen technical details:** made the scrollable specifications body keyboard-focusable, included it in the dialog focus trap and deferred initial focus until the open panel is rendered. Reduced-motion transitions are immediate so inherited visibility cannot delay focus when the panel opens.

All 16 browser checks passed across the final pre-push run and an isolated recheck of the comprehensive all-pages scan. Running that scan alongside the separate responsive audit exhausted its earlier 120-second allowance; the isolated recheck passed in 1.4 minutes. Its allowance is now 180 seconds for busy hosts. The four static tests and the complete 289-layout responsive audit also pass. Focused tests cover the small-screen specifications panel and skip-link behavior. The repository includes repeatable responsive and performance audit scripts.

## Mobile loading measurements

These are single local Chrome lab runs, with a cold cache, a 390×844 mobile viewport, DPR 2, 1.6 Mbps download, 150ms latency and 4× CPU slowdown.

| Page | Largest Contentful Paint | Initial layout shift (CLS) |
| --- | ---: | ---: |
| Homepage | 2.30s | 0.000 |
| Container fumigation | 1.95s | 0.000 |
| Send inquiry | 1.65s | 0.000 |

These samples fall within Google's good LCP (≤2.5s) and CLS (≤0.1) ranges. They do not establish a field Core Web Vitals pass: INP and real-user percentile data were not measured. Lighthouse could not be installed because the local npm cache lock failed; raw Chrome measurements were used instead of inventing a Lighthouse score.

## Remaining verification limits

- Screens were emulated in Windows Google Chrome. Physical iPhones/iPads, Safari, Firefox and other operating systems were not tested.
- Automated accessibility checks cannot establish full WCAG conformance. A real screen-reader review and broader manual assessment are still needed. Image-overlaid text requires human review; representative headings and the transparent navigation were reviewed and sampled.
- This is a local-source audit. Production HTTPS, redirects, compression/cache headers, the final canonical domain, sitemap/indexing and real network performance need checking on the deployed site.

## Reproduce the checks

Start a local server in one terminal:

```powershell
python -m http.server 4180 --bind 127.0.0.1
```

In another terminal:

```powershell
npm run build
npm test
npm run test:browser
npm run audit:responsive
npm run audit:performance
```

The audit scripts use installed Google Chrome. Set `AUDIT_URL` to use another local server. Full screenshots and raw results are written to `.local/qa/responsive-audit/`.

Saved evidence: [responsive results](output/qa/responsive-results.json), [text spacing at 320px](output/qa/text-spacing-320.json), [navigation contrast](output/qa/navigation-contrast.json), [mobile performance](output/qa/performance.json).

Assessment references: [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/), [W3C text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [W3C target size and spacing exceptions](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [Google Web Vitals](https://web.dev/articles/vitals).
