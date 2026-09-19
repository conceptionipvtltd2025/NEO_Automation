import puppeteer from 'puppeteer-core';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://127.0.0.1:5173/neo-website';
const OUT = 'C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/18d08b3c-cf27-4620-a05b-a341693aa384/scratchpad/shots';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const probe = () => {
  const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const cards = Array.from(document.querySelectorAll('a[href*="/products/"]')).filter(a => a.querySelector('img') && vis(a));
  const out = { cards: [], rows: [], tabs: [] };
  for (const c of cards) {
    const r = c.getBoundingClientRect();
    const h3 = c.querySelector('h3');
    const cs3 = h3 ? getComputedStyle(h3) : null;
    const badge = c.querySelector('span.truncate.rounded-full');
    out.cards.push({
      name: h3 ? h3.textContent.trim() : '', top: Math.round(r.top + window.scrollY), h: Math.round(r.height),
      titleH: h3 ? Math.round(h3.getBoundingClientRect().height) : 0,
      titleScrollH: h3 ? h3.scrollHeight : 0, titleClientH: h3 ? h3.clientHeight : 0,
      titleCut: h3 ? h3.scrollHeight - h3.clientHeight : 0,
      clamp: cs3 ? cs3.webkitLineClamp : '', fs: cs3 ? cs3.fontSize : '', lh: cs3 ? cs3.lineHeight : '',
      hasBadge: !!badge, badgeText: badge ? badge.textContent.trim() : '',
      badgeTrunc: badge ? badge.scrollWidth - badge.clientWidth : 0,
    });
  }
  // row grouping on absolute doc y
  const m = new Map();
  for (const c of out.cards) { if (!m.has(c.top)) m.set(c.top, []); m.get(c.top).push(c); }
  for (const [top, arr] of m) {
    const hs = arr.map(a => a.h); const min = Math.min(...hs), max = Math.max(...hs);
    out.rows.push({ top, n: arr.length, heights: hs, diff: max - min, names: arr.map(a => a.name.slice(0, 34)), badges: arr.map(a => a.hasBadge) });
  }
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
    await sleep(1400);
    const r = await page.evaluate(probe);
    console.log('\n===', p, '@', w);
    for (const row of r.rows) if (row.diff > 2) console.log('  RAGGED top=' + row.top, 'heights=' + JSON.stringify(row.heights), 'diff=' + row.diff, 'badges=' + JSON.stringify(row.badges), JSON.stringify(row.names));
    for (const c of r.cards) if (c.titleCut > 1) console.log('  TITLECUT', JSON.stringify(c.name), c.fs + '/' + c.lh, 'clamp=' + c.clamp, c.titleScrollH + '>' + c.titleClientH, 'cut=' + c.titleCut + 'px');
    for (const c of r.cards) if (c.badgeTrunc > 1) console.log('  BADGETRUNC', JSON.stringify(c.badgeText), c.badgeTrunc + 'px hidden');
    await page.close();
  }
}
await browser.close();
console.log('DONE');
