// Teste 2.2.0: filtru pe tip de media aplicat rezultatelor deja încărcate (și favoritelor). Rețeaua archive.org e simulată.
// Rulare: node tests/v22.test.mjs
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const FILE = 'file://' + path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
let ok = 0, bad = 0;
const check = (n, c, x) => { if (c) { ok++; console.log('  ok   ' + n); } else { bad++; console.log('  FAIL ' + n + (x !== undefined ? '  → ' + JSON.stringify(x) : '')); } };
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});
const DOCS = [
  {identifier: 't1', title: 'Carte 1', mediatype: 'texts'}, {identifier: 't2', title: 'Carte 2', mediatype: 'texts'}, {identifier: 't3', title: 'Carte 3', mediatype: 'texts'},
  {identifier: 'm1', title: 'Film 1', mediatype: 'movies'}, {identifier: 'm2', title: 'Film 2', mediatype: 'movies'},
  {identifier: 'a1', title: 'Audio 1', mediatype: 'audio'}, {identifier: 'x1', title: 'Cont <b>x</b>', mediatype: 'account'}];
async function open(init) {
  const ctx = await b.newContext({viewport: {width: 1100, height: 900}, locale: 'ro-RO'});
  const net = [];
  await ctx.route(/^https?:/, (r) => { const u = r.request().url(); net.push(u);
    if (/archive\.org\/advancedsearch\.php/.test(u)) return r.fulfill({status: 200, contentType: 'application/json', headers: {'access-control-allow-origin': '*'}, body: JSON.stringify({response: {numFound: DOCS.length, docs: DOCS}})});
    r.abort(); });
  if (init) await ctx.addInitScript(init);
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => { if (/Content Security|Refused to/i.test(m.text())) errs.push(m.text()); });
  await p.goto(FILE); await p.waitForTimeout(400); return {ctx, p, net, errs};
}
const visible = (p) => p.$$eval('#resultsGrid .card:not([hidden])', (els) => els.map((e) => e.getAttribute('data-identifier')));
const chips = (p) => p.$$eval('#facetBar .facet-btn', (els) => els.map((e) => e.textContent + (e.getAttribute('aria-pressed') === 'true' ? '*' : '')));
{
  const {ctx, p, net, errs} = await open();
  check('bara de filtre ascunsă înainte de căutare', await p.$eval('#facetBar', (e) => e.hidden));
  await p.fill('#identifierInput', 'prelinger'); await p.click('#searchSubmitBtn'); await p.waitForSelector('#resultsGrid .card'); await p.waitForTimeout(200);
  check('chip-uri cu număr: Toate (7) activ, Texte (3), Video (2), account (1), Audio (1)', JSON.stringify(await chips(p)) === JSON.stringify(['Toate (7)*', 'Texte / Cărți (3)', 'Video (2)', 'account (1)', 'Audio (1)']), await chips(p));
  const n0 = net.length;
  await p.click('#facetBar [data-facet="movies"]'); await p.waitForTimeout(100);
  check('filtrare: doar Video vizibil', JSON.stringify(await visible(p)) === JSON.stringify(['m1', 'm2']), await visible(p));
  check('aria-pressed pe chip-ul activ', (await chips(p)).includes('Video (2)*'), await chips(p));
  check('filtrul nu face nicio cerere nouă', net.length === n0, net.slice(n0));
  await p.click('#facetBar [data-facet="account"]'); await p.waitForTimeout(100);
  check('tip necunoscut: afișat ca text, fără HTML injectat', JSON.stringify(await visible(p)) === JSON.stringify(['x1']) && (await p.$$('#resultsGrid b')).length === 0, await visible(p));
  await p.selectOption('#uiLangSelect', 'en'); await p.waitForTimeout(200);
  check('limba engleză: etichete traduse, filtrul activ păstrat', (await chips(p))[0] === 'All (7)' && (await chips(p)).includes('account (1)*'), await chips(p));
  await p.click('#facetBar [data-facet=""]'); await p.waitForTimeout(100);
  check('„Toate” readuce toate cardurile', (await visible(p)).length === 7);
  await p.click('#facetBar [data-facet="texts"]'); await p.waitForTimeout(100);
  await p.fill('#identifierInput', 'altceva'); await p.click('#searchSubmitBtn'); await p.waitForSelector('#resultsGrid .card'); await p.waitForTimeout(200);
  check('o căutare nouă resetează filtrul', (await visible(p)).length === 7 && (await chips(p)).filter((x) => x.endsWith('*')).length === 1 && (await chips(p))[0].endsWith('*'), await chips(p));
  check('0 erori / CSP', errs.length === 0, errs);
  await ctx.close();
}
{ // favorite: același filtru, resetat la schimbarea vizualizării
  const favs = DOCS.map((d) => ({identifier: d.identifier, title: d.title, mediatype: d.mediatype}));
  const {ctx, p, errs} = await open(() => { try { localStorage.setItem('arhiva-ff-favorite-v1', JSON.stringify(window.__FAVS)); } catch (e) {} });
  await ctx.addInitScript((f) => { window.__FAVS = f; try { localStorage.setItem('arhiva-ff-favorite-v1', JSON.stringify(f)); } catch (e) {} }, favs);
  await p.reload(); await p.waitForTimeout(400);
  await p.click('#favoritesToggleBtn'); await p.waitForSelector('#resultsGrid .card'); await p.waitForTimeout(150);
  check('favorite: chip-uri pe tipuri', (await chips(p)).length === 5 && (await chips(p))[1] === 'Texte / Cărți (3)', await chips(p));
  await p.click('#facetBar [data-facet="audio"]'); await p.waitForTimeout(100);
  check('favorite: filtrare pe Audio', JSON.stringify(await visible(p)) === JSON.stringify(['a1']), await visible(p));
  await p.click('#favoritesToggleBtn'); await p.waitForTimeout(150);
  check('0 erori / CSP (favorite)', errs.length === 0, errs);
  await ctx.close();
}
await b.close();
console.log(`\n${ok} ok, ${bad} eșuate`); process.exit(bad ? 1 : 0);
