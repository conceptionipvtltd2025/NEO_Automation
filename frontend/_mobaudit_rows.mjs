import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://127.0.0.1:5173/neo-website';
const OUT = 'C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/18d08b3c-cf27-4620-a05b-a341693aa384/scratchpad/shots';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const probe = () => {
  const out = { rows: [], clamp: [], desc: [] };
  const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const cards = Array.from(document.querySelectorAll('a[href*="/products/"]')).filter(a => a.querySelector('img') && vis(a));
  // group into visual rows by top
  const items = cards.map(c => { const r = c.getBoundingClientRect(); const h3 = c.querySelector('h3'); const cs3 = h3 ? getComputedStyle(h3) : null; return { top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width), left: Math.round(r.left), name: h3 ? h3.textContent.trim() : '', nameFS: cs3 ? cs3.fontSize : '', nameLH: cs3 ? cs3.lineHeight : '', clamp: cs3 ? cs3.webkitLineClamp : '', nameScrollH: h3 ? h3.scrollHeight : 0, nameClientH: h3 ? h3.clientHeight : 0, cut: h3 ? h3.scrollHeight - h3.clientHeight : 0 }; });
  const rowsMap = new Map();
  for (const it of items) { const k = it.top; if (!rowsMap.has(k)) rowsMap.set(k, []); rowsMap.get(k).push(it); }
  for (const [top, arr] of rowsMap) {
    if (arr.length < 2) continue;
    const hs = arr.map(a => a.h);
    const min = Math.min(...hs), max = Math.max(...hs);
    if (max - min > 2) out.rows.push({ top, heights: hs, diff: max - min, names: arr.map(a => a.name.slice(0, 40)) });
  }
  for (const it of items) if (it.cut > 1) out.clamp.push({ name: it.name, fontSize: it.nameFS, lineHeight: it.nameLH, clamp: it.clamp, scrollH: it.nameScrollH, clientH: it.nameClientH, cutPx: it.cut });
  // short desc visibility
  const descs = Array.from(document.querySelectorAll('a[href*="/products/"] p')).slice(0, 3).map(p => ({ display: getComputedStyle(p).display, text: p.textContent.trim().slice(0, 40) }));
  out.desc = descs;
  out.cardCount = cards.length;
  return out;
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
for (const p of ['/industries/ev-assembly', '/brands/atlas-copco', '/products/atlas-copco-tensor-str-nutrunner']) {
  for (const w of [320, 360, 390, 430]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    await page.goto(BASE + p, { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => { });
    await sleep(2200);
    await page.evaluate(async () => { for (const s of document.querySelectorAll('section, main>div, footer')) { s.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 150)); } });
    await sleep(1200);
    const r = await page.evaluate(probe);
    console.log('\n===', p, '@', w, 'cards=' + r.cardCount, 'desc=', JSON.stringify(r.desc[0] || null));
    for (const row of r.rows) console.log('  RAGGED row heights=' + JSON.stringify(row.heights), 'diff=' + row.diff + 'px', JSON.stringify(row.names));
    for (const c of r.clamp) console.log('  TITLECUT', JSON.stringify(c.name), c.fontSize + '/' + c.lineHeight, 'clamp=' + c.clamp, c.scrollH + '>' + c.clientH, 'cut=' + c.cutPx + 'px');
    // screenshot the grid region
    if (r.rows.length || r.clamp.length) {
      await page.evaluate(() => { const a = document.querySelector('a[href*="/products/"] img'); if (a) a.closest('section')?.scrollIntoView({ block: 'start' }); });
      await sleep(700);
      await page.screenshot({ path: OUT + '/grid' + p.replace(/\//g, '_') + '_' + w + '.png' });
    }
    await page.close();
  }
}
await browser.close();
console.log('DONE');
