// Teste 2.1.0: filtru de licență, licență în fișa articolului, verificare Wayback (opțional), export favorite CSV/Markdown. Rețeaua archive.org e simulată.
// Rulare: node tests/v21.test.mjs
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const FILE = 'file://' + path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
let ok = 0, bad = 0;
const check = (n, c, x) => { if (c) { ok++; console.log('  ok   ' + n); } else { bad++; console.log('  FAIL ' + n + (x !== undefined ? '  → ' + JSON.stringify(x) : '')); } };
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
const ctx = await b.newContext({viewport: {width: 1100, height: 900}, locale: 'ro-RO', acceptDownloads: true});
const net = []; const hosts = new Set();
const cors = {'access-control-allow-origin': '*'};
await ctx.route(/^https?:/, (r) => {
  const u = r.request().url(); net.push(u); hosts.add(new URL(u).host);
  const json = (o, s = 200) => r.fulfill({status: s, contentType: 'application/json', headers: cors, body: JSON.stringify(o)});
  if (/archive\.org\/advancedsearch\.php/.test(u)) return json({response: {numFound: 2, docs: [
    {identifier: 'item-a', title: '=SUM(1)+1', mediatype: 'texts', creator: ['Ana, Popescu', '@Ion'], date: '1999-01-01'},
    {identifier: 'item-b', title: 'Film | "special" *x*', mediatype: 'movies', creator: 'Studio', date: '2001-05-05'}]}});
  if (/archive\.org\/metadata\/item-a/.test(u)) return json({metadata: {identifier: 'item-a', title: 'Carte', mediatype: 'texts', licenseurl: 'https://creativecommons.org/licenses/by-sa/4.0/'}, files: []});
  if (/archive\.org\/metadata\/item-b/.test(u)) return json({metadata: {identifier: 'item-b', title: 'Film', mediatype: 'movies', licenseurl: 'http://creativecommons.org/publicdomain/mark/1.0/'}, files: []});
  if (/archive\.org\/wayback\/available\?url=https%3A%2F%2Fexemplu\.ro%2Fok/.test(u)) return json({archived_snapshots: {closest: {available: true, url: 'http://web.archive.org/web/20200102030405/https://exemplu.ro/ok', timestamp: '20200102030405', status: '200'}}});
  if (/archive\.org\/wayback\/available\?url=https%3A%2F%2Fexemplu\.ro%2Fevil/.test(u)) return json({archived_snapshots: {closest: {available: true, url: 'javascript:alert(1)', timestamp: '20200102030405'}}});
  if (/archive\.org\/wayback\/available\?url=https%3A%2F%2Fexemplu\.ro%2Fnone/.test(u)) return json({archived_snapshots: {}});
  if (/archive\.org\/wayback\/available/.test(u)) return json({err: 1}, 500);
  r.abort();
});
const page = await ctx.newPage(); const errs = [], dlgs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('dialog', (d) => { dlgs.push(d.message()); d.dismiss(); });
await page.goto(FILE); await page.waitForTimeout(400);

// --- filtru de licență
const search = async (lic) => { net.length = 0; await page.fill('#identifierInput', 'prelinger'); await page.selectOption('#licenseSelect', lic); await page.evaluate(() => document.querySelector('#searchSubmitBtn').click()); await page.waitForSelector('#resultsGrid .card'); return decodeURIComponent(net.find((u) => /advancedsearch/.test(u)).replace(/\+/g, ' ')); };
let q = await search('');
check('fără licență: nicio condiție licenseurl', !/licenseurl/.test(q), q);
q = await search('pd');
check('domeniu public: licenseurl:http*publicdomain*', /AND licenseurl:http\*publicdomain\*/.test(q), q);
q = await search('by');
check('CC BY exclude variantele by-*', /\(licenseurl:http\*by\* AND NOT licenseurl:http\*by-\*\)/.test(q), q);
q = await search('by-nc-sa');
check('CC BY-NC-SA', /licenseurl:http\*by-nc-sa\*/.test(q), q);
await page.selectOption('#licenseSelect', ''); 
// --- licența în fișa articolului
await page.click('#resultsGrid .card[data-identifier="item-a"]'); await page.waitForSelector('#modalOverlay:not([hidden])'); await page.waitForTimeout(400);
let meta = await page.textContent('#modalMeta');
check('fișă: licență CC BY-SA 4.0', /Licență declarată: CC BY-SA 4\.0/.test(meta), meta);
await page.keyboard.press('Escape'); await page.waitForTimeout(200);
await page.click('#resultsGrid .card[data-identifier="item-b"]'); await page.waitForSelector('#modalOverlay:not([hidden])'); await page.waitForTimeout(400);
meta = await page.textContent('#modalMeta');
check('fișă: domeniu public', /Licență declarată: Domeniu public/.test(meta), meta);
await page.keyboard.press('Escape');
// --- Wayback
net.length = 0;
check('nicio cerere Wayback înainte de apăsare', !net.some((u) => /wayback/.test(u)));
await page.evaluate(() => { document.getElementById('wbBox').open = true; });
await page.fill('#wbInput', 'https://exemplu.ro/ok'); await page.click('#wbBtn'); await page.waitForFunction(() => /Cea mai apropiată/.test(document.getElementById('wbOut').textContent));
let a = await page.$eval('#wbOut a', (e) => e.href);
check('Wayback: copie găsită, link https către web.archive.org', a === 'https://web.archive.org/web/20200102030405/https://exemplu.ro/ok', a);
check('Wayback: data afișată', /2020-01-02/.test(await page.textContent('#wbOut')));
await page.fill('#wbInput', 'https://exemplu.ro/evil'); await page.click('#wbBtn'); await page.waitForFunction(() => /Nu am găsit/.test(document.getElementById('wbOut').textContent));
check('Wayback: URL nesigur din răspuns respins', !(await page.$$eval('#wbOut a', (l) => l.some((x) => /^javascript:/i.test(x.getAttribute('href'))))));
await page.fill('#wbInput', 'https://exemplu.ro/none'); await page.click('#wbBtn'); await page.waitForFunction(() => /Nu am găsit/.test(document.getElementById('wbOut').textContent));
a = await page.$eval('#wbOut a', (e) => e.href);
check('Wayback: fără copie → link către calendar', /^https:\/\/web\.archive\.org\/web\/\*\/https:\/\/exemplu\.ro\/none/.test(a), a);
await page.fill('#wbInput', 'https://exemplu.ro/boom'); await page.click('#wbBtn'); await page.waitForFunction(() => /Nu am putut/.test(document.getElementById('wbOut').textContent));
check('Wayback: eroare HTTP → mesaj + calendar', await page.locator('#wbOut a').count() === 1);
await page.fill('#wbInput', 'javascript:alert(1)'); await page.click('#wbBtn');
check('Wayback: schema javascript: respinsă', /nevalidă/.test(await page.textContent('#wbOut')));
check('Wayback: doar gazde archive.org', [...hosts].every((h) => /(^|\.)archive\.org$/.test(h)), [...hosts]);
// --- export favorite
const before = await page.evaluate(() => document.getElementById('favoritesToggleBtn').textContent);
await page.click('#exportFavCsvBtn');
check('export CSV fără favorite: mesaj', /Nu ai favorite/.test(await page.textContent('#statusLine')));
await page.evaluate(() => { document.querySelectorAll('.card .fav-btn').forEach((b) => b.click()); });
await page.waitForTimeout(200);
const [d1] = await Promise.all([page.waitForEvent('download'), page.click('#exportFavCsvBtn')]);
const csv = fs.readFileSync(await d1.path(), 'utf8');
check('CSV: nume fișier și antet', d1.suggestedFilename() === 'arhiva-fara-frontiere-favorite.csv' && /^﻿"identifier","title"/.test(csv), csv.slice(0, 80));
check('CSV: formulă neutralizată', /"'=SUM\(1\)\+1"/.test(csv), csv);
check('CSV: autori multipli într-o celulă', /"Ana, Popescu; @Ion"/.test(csv), csv);
check('CSV: URL item', /https:\/\/archive\.org\/details\/item-a/.test(csv));
const [d2] = await Promise.all([page.waitForEvent('download'), page.click('#exportFavMdBtn')]);
const md = fs.readFileSync(await d2.path(), 'utf8');
check('Markdown: titlu și linkuri', /^# Favorite din/.test(md) && /\]\(https:\/\/archive\.org\/details\/item-a\)/.test(md), md);
check('Markdown: caractere speciale scăpate', /Film \\\| "special" \\\*x\\\*/.test(md), md);
// --- limbi
const keys = await page.evaluate(() => 0);
const txt = fs.readFileSync(FILE.replace('file://', ''), 'utf8');
const ks = ['licAny','licPD','modalLicensePrefix','exportFavCsvBtn','exportFavMdBtn','wbSummary','wbNote','wbBtn','wbFound','wbNone','wbError','wbCalendar','statusNoFavoritesExport','favoritesMdTitle'];
const langs = ['ro','en','fr','it','es','pt','de','hu'];
check('chei noi în toate cele 8 limbi', langs.every((l) => { const i = txt.indexOf('\n  "' + l + '": {\n'); const j = txt.indexOf('\n  },', i); const seg = txt.slice(i, j); return ks.every((k) => seg.includes('"' + k + '":')); }));
await page.setViewportSize({width: 360, height: 800});
check('fără depășire orizontală la 360 px', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
check('fără dialoguri native', dlgs.length === 0, dlgs);
check('fără erori JS', errs.length === 0, errs);
await b.close(); console.log(`\nArhiva 2.1.0: ${ok} ok, ${bad} eșuate`); process.exit(bad ? 1 : 0);
