import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = 'http://127.0.0.1:5173/neo-website';
const OUT = 'C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/18d08b3c-cf27-4620-a05b-a341693aa384/scratchpad/shots';
fs.mkdirSync(OUT, { recursive: true });
const PAGES = ['/products/atlas-copco-tensor-str-nutrunner', '/industries/ev-assembly', '/brands/atlas-copco'];
const VPS = [[320, 800], [360, 800], [390, 844], [430, 932]];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const probe = () => {
  const vw = document.documentElement.clientWidth;
  const res = { vw, scrollW: document.documentElement.scrollWidth, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, title: document.title, h1: (document.querySelector('h1') || {}).textContent, offenders: [], clipped: [], tiny: [], contrast: [], cut: [] };
  const sel = el => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const c = (el.getAttribute && el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean).slice(0, 8).join('.');
    if (c) s += '.' + c;
    return s;
  };
  const path = el => { const p = []; let n = el; for (let i = 0; i < 4 && n && n !== document.body; i++) { p.unshift(sel(n)); n = n.parentElement; } return p.join(' > '); };
  const all = Array.from(document.querySelectorAll('body *'));
  const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  // overflow culprits
  if (res.overflow > 0) {
    const cands = [];
    for (const el of all) {
      if (!vis(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 || r.left < -1) {
        let clipped = false; let p = el.parentElement;
        while (p && p !== document.documentElement) { const pcs = getComputedStyle(p); if (/hidden|clip|auto|scroll/.test(pcs.overflowX)) { clipped = true; break; } p = p.parentElement; }
        cands.push({ sel: path(el), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), clippedByAncestor: clipped, pos: getComputedStyle(el).position, text: (el.textContent || '').trim().slice(0, 50) });
      }
    }
    cands.sort((a, b) => b.right - a.right);
    res.offenders = cands.filter(c => !c.clippedByAncestor).slice(0, 10);
    res.offendersAll = cands.slice(0, 6);
  }

  // tiny text
  const seenT = new Set();
  for (const el of all) {
    if (!vis(el)) continue;
    const own = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' ');
    if (!own) continue;
    const cs = getComputedStyle(el);
    const fsz = parseFloat(cs.fontSize);
    if (fsz < 12) { const k = sel(el) + '|' + fsz; if (!seenT.has(k)) { seenT.add(k); res.tiny.push({ sel: path(el), fontSize: +fsz.toFixed(2), letterSpacing: cs.letterSpacing, text: own.slice(0, 60) }); } }
  }

  // clipped text (no line-clamp)
  for (const el of all) {
    if (!vis(el)) continue;
    const cs = getComputedStyle(el);
    const hasOwn = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    if (!hasOwn) continue;
    const txt = (el.textContent || '').trim();
    if (el.scrollWidth > el.clientWidth + 1 && /hidden|clip/.test(cs.overflowX)) {
      res.clipped.push({ kind: 'h', sel: path(el), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, textOverflow: cs.textOverflow, text: txt.slice(0, 80) });
    }
    if (el.scrollHeight > el.clientHeight + 1 && /hidden|clip/.test(cs.overflowY)) {
      const lc = cs.webkitLineClamp;
      if (lc === 'none' || !lc) res.clipped.push({ kind: 'v', sel: path(el), scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, text: txt.slice(0, 80) });
    }
  }
  res.clipped = res.clipped.slice(0, 25);

  // cut-off sections
  for (const el of all) {
    if (!vis(el)) continue;
    const cs = getComputedStyle(el);
    if (!/hidden|clip/.test(cs.overflow) && !/hidden|clip/.test(cs.overflowY)) continue;
    const r = el.getBoundingClientRect();
    for (const ch of el.children) {
      if (!vis(ch)) continue;
      const chcs = getComputedStyle(ch);
      if (chcs.position === 'absolute' || chcs.position === 'fixed') continue;
      const txt = (ch.textContent || '').trim();
      if (!txt) continue;
      const cr = ch.getBoundingClientRect();
      const overBottom = cr.bottom - r.bottom, overTop = r.top - cr.top;
      if (overBottom > 2 || overTop > 2) {
        res.cut.push({ parent: path(el), child: sel(ch), parentTop: Math.round(r.top), parentBottom: Math.round(r.bottom), parentH: Math.round(r.height), childTop: Math.round(cr.top), childBottom: Math.round(cr.bottom), childH: Math.round(cr.height), overBottom: +overBottom.toFixed(1), overTop: +overTop.toFixed(1), text: txt.slice(0, 60) });
      }
    }
  }
  res.cut = res.cut.slice(0, 20);

  // contrast
  const parseRGB = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x.trim())); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const bgOf = el => { let n = el; const stack = []; while (n) { const c = parseRGB(getComputedStyle(n).backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; } n = n.parentElement; } let base = { r: 255, g: 255, b: 255, a: 1 }; for (let i = stack.length - 1; i >= 0; i--) base = blend(stack[i], base); return base; };
  const seenC = new Set();
  for (const el of all) {
    if (!vis(el)) continue;
    const own = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(' ');
    if (own.length < 3) continue;
    const cs = getComputedStyle(el);
    if (cs.webkitTextFillColor === 'rgba(0, 0, 0, 0)' || cs.color === 'rgba(0, 0, 0, 0)') continue;
    const fg0 = parseRGB(cs.color); if (!fg0) continue;
    const bg = bgOf(el);
    const fg = blend(fg0, bg);
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const fsz = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight) >= 700;
    const large = fsz >= 24 || (fsz >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (ratio < need) { const k = sel(el) + '|' + cs.color; if (!seenC.has(k)) { seenC.add(k); res.contrast.push({ sel: path(el), ratio: +ratio.toFixed(2), need, color: cs.color, bg: 'rgb(' + [bg.r, bg.g, bg.b].map(Math.round).join(',') + ')', fontSize: fsz, text: own.slice(0, 50) }); } }
  }
  res.contrast = res.contrast.slice(0, 20);
  return res;
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const report = {};
for (const p of PAGES) {
  for (const [w, h] of VPS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
    const errs = [];
    page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await page.goto(BASE + p, { waitUntil: 'networkidle2', timeout: 60000 }).catch(e => errs.push('nav:' + e.message));
    await sleep(2500);
    await page.evaluate(async () => {
      const secs = Array.from(document.querySelectorAll('section, main > div, footer'));
      for (const s of secs) { s.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 160)); }
    });
    await sleep(1200);
    await page.evaluate(() => { const t = document.querySelector('h1') || document.body; t.scrollIntoView({ block: 'start' }); });
    await sleep(900);
    const r = await page.evaluate(probe);
    r.errs = errs;
    const key = p + '@' + w;
    report[key] = r;
    const fname = OUT + '/' + p.replace(/\//g, '_').replace(/^_/, '') + '_' + w + '.png';
    await page.screenshot({ path: fname, fullPage: true }).catch(e => errs.push('shot:' + e.message));
    console.log('===', key, 'h1=', JSON.stringify((r.h1 || '').slice(0, 30)), 'overflow=', r.overflow, 'offenders=', r.offenders.length, 'clipped=', r.clipped.length, 'tiny=', r.tiny.length, 'contrast=', r.contrast.length, 'cut=', r.cut.length, 'errs=', errs.length);
    await page.close();
  }
}
fs.writeFileSync(OUT + '/report-detail.json', JSON.stringify(report, null, 1));
await browser.close();
console.log('DONE');
