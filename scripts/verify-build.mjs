import { readFile, readdir, access } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('dist');
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root);
const pages = new Map();
for (const path of files.filter(file => file.endsWith('.html'))) pages.set(path, await readFile(path, 'utf8'));
const exists = async path => { try { await access(path); return true; } catch { return false; } };
const routeFile = async pathname => {
  const path = resolve(root, `.${decodeURIComponent(pathname)}`);
  for (const candidate of [path, `${path}.html`, resolve(path, 'index.html')]) {
    if (pages.has(candidate) || (files.includes(candidate) && await exists(candidate))) return candidate;
  }
  return null;
};
let references = 0;
for (const [path, html] of pages) {
  const name = relative(root, path);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${name}: expected one h1`);
  assert.match(html, /<html[^>]+lang="nl-BE"/, `${name}: page language`);
  assert.match(html, /<title>[^<]+<\/title>/, `${name}: title`);
  assert.match(html, /name="description" content="[^"]+"/, `${name}: description`);
  assert.match(html, /rel="canonical" href="https:\/\/peak-automations\.com\//, `${name}: canonical`);
  const expectedCanonical = `https://peak-automations.com${name === 'index.html' ? '/' : `/${name.replace(/\.html$/, '')}`}`;
  assert.ok(html.includes(`rel="canonical" href="${expectedCanonical}"`), `${name}: canonical must match the public route`);
  assert.doesNotMatch(html, /<script[^>]+src="https?:|slater\.app|jquery|webflow-script/, `${name}: legacy runtime`);
  assert.doesNotMatch(html, /\[(?:TEAM|PORTRET|KLANTLOGO|ECHTE_REVIEW|CASE_SCREENSHOT|DEMO_VIDEO|RESULTAAT|PRIJSRICHTING|BEHEERAFSPRAKEN)[A-Z_]*\]|Contentpreview|preview-slot/, `${name}: contentplaceholder in production`);
  assert.doesNotMatch(html, /testimonial-placeholder|Reviewplaceholder|review-placeholder\.webp/, `${name}: unapproved review in production`);
  for (const match of html.matchAll(/\ssrcset="([^"]+)"/g)) {
    for (const candidate of match[1].split(',')) {
      const value = candidate.trim().split(/\s+/)[0];
      if (/^(?:data:|https?:\/\/)/.test(value)) continue;
      assert.ok(await routeFile(value), `${name}: missing responsive image ${value}`);
      references++;
    }
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${name}: duplicate IDs`);
  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const value = match[1].replaceAll('&amp;', '&');
    if (/^(?:mailto:|tel:|data:|https?:\/\/)/.test(value)) continue;
    const url = new URL(value, `https://peak-automations.com/${name}`);
    const target = await routeFile(url.pathname);
    assert.ok(target, `${name}: missing ${value}`);
    if (url.hash && pages.has(target)) {
      const targetHTML = pages.get(target);
      assert.ok(targetHTML.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${name}: missing anchor ${value}`);
    }
    references++;
  }
}
for (const path of files.filter(file => file.endsWith('.css'))) {
  const css = await readFile(path, 'utf8');
  for (const match of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
    if (/^(?:data:|https?:)/.test(match[1])) continue;
    const target = match[1].startsWith('/') ? resolve(root, `.${match[1]}`) : resolve(dirname(path), match[1]);
    assert.ok(await exists(target), `${relative(root, path)}: missing CSS asset ${match[1]}`);
  }
}
for (const route of ['/', '/diensten', '/cases', '/contact', '/bedankt', '/privacy', '/404']) assert.ok(await routeFile(route), `Missing route ${route}`);
for (const route of ['/', '/contact']) {
const contact = pages.get(await routeFile(route));
assert.match(contact, /name="wf-form-Formulier"/);
assert.match(contact, /data-netlify="true"/);
assert.match(contact, /netlify-honeypot="bot-field"/);
assert.match(contact, /method="POST" action="\/bedankt"/);
for (const field of ['form-name', 'Naam', 'Bedrijf', 'email', 'Telefoonnummer', 'Interesse', 'Context', 'bot-field', 'utm_source', 'utm_medium', 'utm_campaign']) assert.ok(contact.includes(`name="${field}"`), `${route}: missing preserved form field ${field}`);
const requiredFields = [...contact.matchAll(/<(?:input|textarea|select)\b[^>]*\brequired\b[^>]*>/g)].map(match => match[0].match(/\bname="([^"]+)"/)?.[1]).sort();
assert.deepEqual(requiredFields, ['Context', 'Naam', 'email'], `${route}: only essential fields are required`);
}
assert.ok(await exists(resolve(root, 'images/social-share.jpg')), 'Missing social-share image');
const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
for (const match of sitemap.matchAll(/<loc>https:\/\/peak-automations\.com([^<]*)<\/loc>/g)) assert.ok(await routeFile(match[1]), `Broken sitemap route ${match[1]}`);
for (const file of files) assert.doesNotMatch(relative(root, file), /^(?:legacy|hosting|src|docs)\/|(?:AGENTS|PRODUCT|DESIGN|README|CONTENT_NEEDED)\.md|\.env/, 'Private source in published output');
console.log(`Verified ${pages.size} HTML pages, ${references} internal references, CSS assets, sitemap and Netlify form contract.`);
