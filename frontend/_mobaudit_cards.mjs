import puppeteer from 'puppeteer-core';
import fs from 'fs';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://127.0.0.1:5173/neo-website';
const OUT = 'C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/18d08b3c-cf27-4620-a05b-a341693aa384/scratchpad/shots';
const PAGES = ['/products/atlas-copco-tensor-str-nutrunner', '/industries/ev-assembly', '/brands/atlas-copco'];
const VPS = [320, 360, 390, 430];
const sleep = ms => new Promise(r => setTimeout(r, ms));

const probe = () => {
  const out = { grids: [], truncated: [], logo: null, cardName: [], overlapping: [] };
  const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  // logo "Automation" span
  const logoSpans = Array.from(document.querySelectorAll('span')).filter(s => s.textContent.trim() === 'Automation');
  out.logo = logoSpans.map(s => { const cs = getComputedStyle(s); const r = s.getBoundingClientRect(); return { fontSize: cs.fontSize, display: cs.display, visible: vis(s), rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], cls: s.getAttribute('class') }; });

  // product card grids
  const cards = Array.from(document.querySelectorAll('a[href*="/products/"]')).filter(a => a.querySelector('img') && vis(a));
  const byParent = new Map();
  for (const c of cards) { const p = c.parentElement?.parentElement; if (!p) continue; if (!byParent.has(p)) byParent.set(p, []); byParent.get(p).push(c); }
  for (const [p, list] of byParent) {
    if (list.length < 2) continue;
    const cs = getComputedStyle(p);
    const rects = list.map(c => { const r = c.getBoundingClientRect(); return { l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom), w: Math.round(r.width), h: Math.round(r.height) }; });
    const heights = rects.map(r => r.h);
    // row grouping by top
    const rows = {};
    rects.forEach(r => { const k = r.t; (rows[k] = rows[k] || []).push(r); });
    out.grids.push({ sel: (p.tagName + '.' + (p.getAttribute('class') || '')).slice(0, 180), display: cs.display, cols: cs.gridTemplateColumns, gap: cs.gap, n: list.length, rects, minH: Math.min(...heights), maxH: Math.max(...heights), rowCount: Object.keys(rows).length });
  }

  // card title overflow / clamp
  for (const c of cards) {
    const h3 = c.querySelector('h3');
    if (!h3) continue;
    const cs = getComputedStyle(h3);
    const r = h3.getBoundingClientRect();
    const clamped = h3.scrollHeight > h3.clientHeight + 1;
    out.cardName.push({ text: h3.textContent.trim().slice(0, 60), fontSize: cs.fontSize, lineClamp: cs.webkitLineClamp, scrollH: h3.scrollHeight, clientH: h3.clientHeight, clamped, h: Math.round(r.height) });
    // badges truncated?
    for (const sp of c.querySelectorAll('span.truncate')) {
      if (sp.scrollWidth > sp.clientWidth + 1) out.truncated.push({ text: sp.textContent.trim(), scrollW: sp.scrollWidth, clientW: sp.clientWidth, fontSize: getComputedStyle(sp).fontSize });
    }
  }
  out.cardName = out.cardName.slice(0, 10);
  return out;
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
const rep = {};
for (const p of PAGES) for (const w of VPS) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  await page.goto(BASE + p, { waitUntil: 'networkidle2', timeout: 60000 }).catch(() => { });
  await sleep(2200);
  await page.evaluate(async () => { for (const s of document.querySelectorAll('section, main>div, footer')) { s.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 150)); } });
  await sleep(1200);
  const r = await page.evaluate(probe);
  rep[p + '@' + w] = r;
  console.log('\n===', p, '@', w);
  console.log(' logo:', JSON.stringify(r.logo));
  for (const g of r.grids) console.log('  GRID n=' + g.n, 'display=' + g.display, 'cols=' + g.cols, 'gap=' + g.gap, 'rows=' + g.rowCount, 'h ' + g.minH + '-' + g.maxH, JSON.stringify(g.rects.slice(0, 4)));
  for (const t of r.truncated) console.log('  TRUNC', JSON.stringify(t.text), t.scrollW + '>' + t.clientW, t.fontSize);
  for (const c of r.cardName) if (c.clamped) console.log('  NAMECLAMP', JSON.stringify(c.text), c.scrollH + '>' + c.clientH, c.fontSize, 'clamp=' + c.lineClamp);
  await page.close();
}
fs.writeFileSync(OUT + '/report-cards.json', JSON.stringify(rep, null, 1));
await browser.close();
console.log('DONE');
