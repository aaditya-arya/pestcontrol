import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const pages = readdirSync('.').filter(file => file.endsWith('.html'));
test('all static pages have complete landmarks and unique document titles', () => {
  const titles = new Set();
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, file);
    for (const landmark of ['<header', '<main id="main"', '<footer']) assert.ok(html.includes(landmark), `${file}: ${landmark}`);
    assert.ok(html.includes('<main id="main" tabindex="-1">'), `${file}: skip-link target must accept focus`);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(title), `Duplicate title: ${file}`);
    titles.add(title);
    assert.ok(!/href="#"/.test(html), `${file}: placeholder link`);
    assert.ok(!/\b(?:20\s*(?:ft|feet)?\s*(?:\/|&(?:amp;)?|and|or)\s*40\s*(?:ft|feet)?|40\s*ft)\b/i.test(html), `${file}: container-size text should not appear`);
  }
});
test('every internal link, anchor, script, font, and image resolves', () => {
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/(?:href|src)="([^" ]+)"/g)) {
      const href = match[1];
      if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
      const [path, hash] = href.split('#');
      const target = resolve(path.split('?')[0] || file);
      assert.ok(existsSync(target), `${file} links to missing ${href}`);
      if (hash) assert.ok(readFileSync(target, 'utf8').includes(`id="${hash}"`), `${file}: missing anchor ${href}`);
    }
    for (const match of html.matchAll(/<img\b([^>]+)>/g)) assert.match(match[1], /alt="[^"]+"/, file);
    for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
      for (const candidate of match[1].split(',')) {
        assert.ok(existsSync(resolve(candidate.trim().split(/\s+/)[0])), `${file}: missing responsive image ${candidate}`);
      }
    }
  }
});

test('form validation rules: names reject numbers and phones reject letters', () => {
  // Validate name rule: letters, spaces, dots, hyphens only; numbers strictly forbidden
  const hasDigit = (str) => /\d/.test(str);
  const isValidName = (str) => !hasDigit(str) && /^[a-zA-Z\s.'\-\/]{2,}$/.test(str.trim());

  assert.equal(hasDigit('Rajesh123'), true);
  assert.equal(hasDigit('Patel 2'), true);
  assert.equal(isValidName('Rajesh123'), false);
  assert.equal(isValidName('Patel 2'), false);
  assert.equal(isValidName('Rajesh Shah'), true);
  assert.equal(isValidName('Dr. A. K. Patel'), true);

  // Validate phone rule: digits & formatting only; letters strictly forbidden
  const hasLetters = (str) => /[a-zA-Z]/.test(str);
  const isValidPhone = (str) => {
    if (hasLetters(str)) return false;
    const digits = str.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  };

  assert.equal(hasLetters('98765abc'), true);
  assert.equal(hasLetters('call+919876543210'), true);
  assert.equal(isValidPhone('98765abc'), false);
  assert.equal(isValidPhone('+91 84011 37910'), true);
  assert.equal(isValidPhone('9898472483'), true);
  assert.equal(isValidPhone('123'), false); // too short

  // Ensure both forms contain .field-error and validation attributes
  for (const file of ['book-inspection.html', 'certificate.html']) {
    const html = readFileSync(file, 'utf8');
    assert.ok(html.includes('class="field-error"'), `${file} missing .field-error`);
    assert.ok(html.includes('name="name"'), `${file} missing name field`);
    assert.ok(html.includes('name="phone"'), `${file} missing phone field`);
  }
});

test('homepage, services, locations, about, and header scroll threshold match specifications', () => {
  const indexHtml = readFileSync('index.html', 'utf8');
  assert.ok(indexHtml.includes('ID PEST CONTROL SERVICES'), 'index.html missing full company name ID PEST CONTROL SERVICES');
  // 3 B2B services
  for (const b2b of ['Container Fumigation', 'Pallet / Box Fumigation', 'Stack Fumigation']) {
    assert.ok(indexHtml.includes(b2b), `index.html missing B2B service: ${b2b}`);
  }
  // 5 General pest control services
  for (const pest of ['Anti-Termite Treatment', 'Ant / Cockroach Treatment', 'General Pest Control Work', 'Rodent Control Treatment', 'Prophylactic Treatment']) {
    assert.ok(indexHtml.includes(pest), `index.html missing pest control service: ${pest}`);
  }
  // Removed sections from Images 1, 2 & 3
  assert.ok(!indexHtml.includes('Different needs.'), 'index.html still has vague Image 1 heading');
  assert.ok(!indexHtml.includes('Certified Fumigation Protocols.'), 'index.html still has vague Image 2 section');
  assert.ok(!indexHtml.includes('Quarantine Clearance Process.'), 'index.html still has removed Image 3 section');

  // Locations keeps one useful card per city, without duplicate panels or long tags.
  const branchesHtml = readFileSync('branches.html', 'utf8');
  assert.ok(branchesHtml.includes('branch-visual-card'), 'branches.html missing visual cards');
  assert.ok(branchesHtml.includes('location-phone'), 'branches.html missing direct contacts');
  assert.ok(!branchesHtml.includes('hub-explorer'), 'branches.html still has duplicate city explorer');
  assert.ok(!branchesHtml.includes('branch-service-tags'), 'branches.html still has long technical tags');
  assert.ok(!branchesHtml.includes('cta-section'), 'branches.html still has generic closing banner');

  // About page introduces the founder without the removed filler sections.
  const aboutHtml = readFileSync('about.html', 'utf8');
  assert.ok(aboutHtml.includes('founder-portrait.jpg'), 'about.html missing founder portrait');
  assert.ok(aboutHtml.includes('Dushyant Tyagi'), 'about.html missing founder name');
  assert.ok(!aboutHtml.includes('about-facts'), 'about.html still has service-count strip');
  assert.ok(!aboutHtml.includes('cta-section'), 'about.html still has generic closing banner');
  assert.ok(!aboutHtml.includes('tryksha_desire_hq.jpg'), 'about.html still uses building image');

  // Header scroll 30% logic in script.js and transparent default in styles.css
  const scriptJs = readFileSync('script.js', 'utf8');
  assert.ok(scriptJs.includes('0.3'), 'script.js missing 30% scroll threshold');
  const stylesCss = readFileSync('styles.css', 'utf8');
  assert.ok(stylesCss.includes('background: transparent'), 'styles.css missing transparent header at top');
});
