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
    for (const landmark of ['<header', '<main id="main">', '<footer']) assert.ok(html.includes(landmark), `${file}: ${landmark}`);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(title), `Duplicate title: ${file}`);
    titles.add(title);
    assert.ok(!/href="#"/.test(html), `${file}: placeholder link`);
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
  }
});
