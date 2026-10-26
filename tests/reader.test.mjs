// Teste 2.0.0: cititor de text integral (căutare în carte, semne de carte, „unde am rămas”). Rețeaua archive.org e simulată prin route.
// Rulare: node tests/reader.test.mjs  (Playwright din /opt/node-tools, Chromium local)
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require = createRequire(process.env.PW_ROOT || import.meta.url);
const {chromium} = require('playwright');
const FILE = 'file://' + path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'index.html');
let ok = 0, bad = 0;
const check = (n, c, x) => { if (c) { ok++; console.log('  ok   ' + n); } else { bad++; console.log('  FAIL ' + n + (x !== undefined ? '  → ' + JSON.stringify(x) : '')); } };
const b = await chromium.launch({executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox']});

const paras = [];
for (let i = 0; i < 80; i++) paras.push(`Paragraful ${i}. ` + 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(6) + (i === 40 ? 'Ștefan cel Mare a domnit mult timp. ' : '') + (i === 70 ? 'Ștefan a revenit. ' : ''));
const TEXT = paras.join('\n\n');
const PAGES = ['Pagina unu cu cuvântul albastru.', 'Pagina doi.', 'Pagina trei cu Albastru din nou.', 'Pagina patru.'].join('\f');
const meta = (id, txtName) => ({metadata: {identifier: id, title: 'Carte de test ' + id, mediatype: 'texts', creator: 'Autor'}, item_size: 1000,
  files: [{name: id + '.pdf', format: 'Text PDF', size: '1000'}, {name: txtName, format: 'DjVuTXT', size: String(TEXT.length)}]});

async function open(extra = {}) {
  const ctx = await b.newContext({viewport: {width: 1100, height: 900}, locale: 'ro-RO'});
  const net = [];
  await ctx.route(/^https?:/, (r) => {
    const u = r.request().url(); net.push(u);
    const cors = {'access-control-allow-origin': '*'};
    if (/archive\.org\/metadata\/book1/.test(u)) return r.fulfill({status: 200, contentType: 'application/json', headers: cors, body: JSON.stringify(meta('book1', 'book1_djvu.txt'))});
    if (/archive\.org\/metadata\/book2/.test(u)) return r.fulfill({status: 200, contentType: 'application/json', headers: cors, body: JSON.stringify(meta('book2', 'book2_djvu.txt'))});
    if (/archive\.org\/metadata\/nobook/.test(u)) return r.fulfill({status: 200, contentType: 'application/json', headers: cors, body: JSON.stringify({metadata: {identifier: 'nobook', title: 'Fără text', mediatype: 'texts'}, files: [{name: 'nobook.pdf', format: 'Text PDF'}]})});
    if (/archive\.org\/metadata\/bigbook/.test(u)) return r.fulfill({status: 200, contentType: 'application/json', headers: cors, body: JSON.stringify({metadata: {identifier: 'bigbook', title: 'Mare', mediatype: 'texts'}, files: [{name: 'bigbook_djvu.txt', format: 'DjVuTXT', size: '99999999'}]})});
    if (/archive\.org\/download\/book1\/book1_djvu\.txt/.test(u)) return extra.fail ? r.fulfill({status: 500, body: 'x'}) : r.fulfill({status: 200, contentType: 'text/plain', headers: cors, body: TEXT});
    if (/archive\.org\/download\/book2\/book2_djvu\.txt/.test(u)) return r.fulfill({status: 200, contentType: 'text/plain', headers: cors, body: PAGES});
    r.abort();
  });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(FILE); await page.waitForTimeout(300);
  return {ctx, page, errs, net};
}
const openBook = async (page, id) => {
  await page.fill('#identifierInput', 'https://archive.org/details/' + id);
  await page.evaluate(() => document.querySelector('#searchSubmitBtn').click());
  await page.waitForSelector('#modalOverlay:not([hidden])'); await page.waitForTimeout(300);
};

{
  const {ctx, page, errs, net} = await open();
  await openBook(page, 'book1');
  check('butonul „Citește textul integral” apare pentru o carte cu _djvu.txt', await page.isVisible('#readerOpenBtn'));
  await page.click('#readerOpenBtn'); await page.waitForSelector('#readerBody:not([hidden])');
  const n = await page.$eval('#readerOf', (e) => e.textContent);
  check('textul e împărțit în secțiuni', /^Secțiunea 1 din (\d+)$/.test(n) && +n.match(/din (\d+)/)[1] > 5, n);
  check('prima secțiune afișată', /Paragraful 0\./.test(await page.$eval('#readerText', (e) => e.textContent)));
  check('descărcarea a mers la archive.org/download', net.some((u) => /archive\.org\/download\/book1\/book1_djvu\.txt/.test(u)));
  await page.click('#readerNext');
  check('„Înainte” trece la secțiunea 2', /^Secțiunea 2 /.test(await page.$eval('#readerOf', (e) => e.textContent)));
  // căutare fără diacritice găsește „Ștefan”
  await page.fill('#readerQ', 'stefan cel mare'); await page.click('#readerSearchForm button[type=submit]');
  const info = await page.$eval('#readerHitsInfo', (e) => e.textContent);
  check('căutare fără diacritice: 1 potrivire', /^1 potriviri/.test(info), info);
  await page.click('#readerHits button');
  const cur = await page.$eval('#readerText', (e) => e.textContent);
  check('click pe potrivire duce la secțiunea cu textul', /Ștefan cel Mare/.test(cur));
  check('potrivirea e evidențiată (mark.active)', (await page.$$eval('#readerText mark.active', (e) => e.map((x) => x.textContent))).join() === 'Ștefan cel Mare');
  await page.fill('#readerQ', 'ștefan'); await page.click('#readerSearchForm button[type=submit]');
  check('căutare cu diacritice: 2 potriviri', /^2 potriviri/.test(await page.$eval('#readerHitsInfo', (e) => e.textContent)));
  await page.fill('#readerQ', 'inexistentzzz'); await page.click('#readerSearchForm button[type=submit]');
  check('fără potriviri: mesaj', /Nicio potrivire/.test(await page.$eval('#readerHitsInfo', (e) => e.textContent)));
  // semn de carte
  await page.fill('#readerGo', '4'); await page.$eval('#readerGo', (e) => e.dispatchEvent(new Event('change')));
  check('„Mergi la secțiunea” funcționează', /^Secțiunea 4 /.test(await page.$eval('#readerOf', (e) => e.textContent)));
  await page.click('#readerMarkBtn');
  check('semn de carte adăugat', (await page.$$('#readerMarks .mk-go')).length === 1 && (await page.getAttribute('#readerMarkBtn', 'aria-pressed')) === 'true');
  await page.click('#readerNext'); await page.click('#readerNext');
  await page.click('#readerMarks .mk-go');
  check('click pe semn duce la secțiunea 4', /^Secțiunea 4 /.test(await page.$eval('#readerOf', (e) => e.textContent)));
  await page.click('#readerNext'); // acum la 5
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('arhiva-ff-lectura-v1')));
  check('progresul e salvat local (poziție 4, 1 semn)', stored.items[0].id === 'book1' && stored.items[0].p === 4 && stored.items[0].m.length === 1, stored);
  check('niciun pageerror', errs.length === 0, errs);
  // reluare după reîncărcare
  await page.reload(); await page.waitForTimeout(300);
  check('lista „Lecturi (1)” după reîncărcare', /Lecturi \(1\)/.test(await page.textContent('#readingToggleBtn')));
  await page.click('#readingToggleBtn');
  check('lista de lecturi arată progresul', /secțiunea 5 din/.test(await page.textContent('#readingListUl')), await page.textContent('#readingListUl'));
  await page.click('#readingListUl .rl-open'); await page.waitForSelector('#modalOverlay:not([hidden])'); await page.waitForTimeout(300);
  await page.click('#readerOpenBtn'); await page.waitForSelector('#readerBody:not([hidden])');
  check('„unde am rămas”: reluare la secțiunea 5', /^Secțiunea 5 /.test(await page.$eval('#readerOf', (e) => e.textContent)));
  check('mesaj de reluare', /Reluat de unde ai rămas/.test(await page.textContent('#readerStatus')));
  check('semnul de carte supraviețuiește', (await page.$$('#readerMarks .mk-go')).length === 1);
  // schimbarea limbii nu pierde cititorul
  await page.selectOption('#uiLangSelect', 'en'); await page.waitForTimeout(200);
  check('limba EN: cititorul rămâne și se traduce', /^Section 5 of/.test(await page.$eval('#readerOf', (e) => e.textContent)) && (await page.isVisible('#readerBody')));
  // închiderea modalului resetează; uitarea șterge
  await page.keyboard.press('Escape');
  await page.click('#readingToggleBtn'); await page.click('#readingToggleBtn');
  await page.click('#readingListUl .rl-forget');
  check('„Uită” șterge lectura', (await page.evaluate(() => JSON.parse(localStorage.getItem('arhiva-ff-lectura-v1')).items.length)) === 0);
  check('niciun pageerror (2)', errs.length === 0, errs);
  await ctx.close();
}
{ // pagini separate prin \f
  const {ctx, page, errs} = await open();
  await openBook(page, 'book2'); await page.click('#readerOpenBtn'); await page.waitForSelector('#readerBody:not([hidden])');
  check('paginile \\f devin secțiuni (4)', /din 4$/.test(await page.$eval('#readerOf', (e) => e.textContent)));
  await page.fill('#readerQ', 'ALBASTRU'); await page.click('#readerSearchForm button[type=submit]');
  check('căutare insensibilă la majuscule: 2 potriviri', /^2 potriviri/.test(await page.$eval('#readerHitsInfo', (e) => e.textContent)));
  check('niciun pageerror', errs.length === 0, errs);
  await ctx.close();
}
{ // fără text, text prea mare, eroare de rețea, fără HTML injectat
  const {ctx, page, errs} = await open();
  await openBook(page, 'nobook');
  check('fără fișier de text: butonul nu apare', !(await page.isVisible('#readerOpenBtn')));
  await page.keyboard.press('Escape');
  await openBook(page, 'bigbook'); await page.click('#readerOpenBtn');
  check('text > 30 MB: mesaj, fără descărcare', /prea mare/.test(await page.textContent('#readerStatus')));
  await page.keyboard.press('Escape'); await ctx.close();
  const c2 = await open({fail: true});
  await openBook(c2.page, 'book1'); await c2.page.click('#readerOpenBtn'); await c2.page.waitForTimeout(500);
  check('eroare HTTP: mesaj de eroare, butonul revine', /Nu am putut încărca/.test(await c2.page.textContent('#readerStatus')) && await c2.page.isVisible('#readerOpenBtn'));
  check('fără pageerror pe eroare', errs.length === 0 && c2.errs.length === 0, [errs, c2.errs]);
  await c2.ctx.close();
}
await b.close();
console.log(`Arhiva reader: ${ok} ok, ${bad} eșuate`); process.exit(bad ? 1 : 0);
