const puppeteer = require("puppeteer-core");
const fs = require("fs");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://127.0.0.1:5291/neo-website";
const OUT = "C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/18d08b3c-cf27-4620-a05b-a341693aa384/scratchpad/shots";
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  { name: "home", path: "/" },
  { name: "products", path: "/products" },
];
const VIEWPORTS = [320, 360, 390, 430].map((w) => ({ w, h: w === 430 ? 932 : w === 390 ? 844 : 800 }));

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MEASURE = () => {
  const vw = document.documentElement.clientWidth;
  const res = {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: vw,
    bodyScrollWidth: document.body.scrollWidth,
    docHeight: document.documentElement.scrollHeight,
    overflowCulprits: [],
    clippedText: [],
    tinyText: [],
    lowContrast: [],
    cutOff: [],
  };

  const all = Array.from(document.querySelectorAll("*"));
  const sel = (el) => {
    if (!el) return "";
    let s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    const cls = (el.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean).slice(0, 8).join(".");
    if (cls) s += "." + cls;
    return s;
  };
  const path = (el) => {
    const parts = [];
    let n = el;
    for (let i = 0; i < 4 && n && n !== document.body; i++) { parts.unshift(sel(n)); n = n.parentElement; }
    return parts.join(" > ");
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // --- horizontal overflow culprits ---
  if (res.scrollWidth > vw) {
    for (const el of all) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 || r.left < -1) {
        // only report if no ancestor already clips it
        let clipped = false;
        let p = el.parentElement;
        while (p) {
          const pcs = getComputedStyle(p);
          if (/hidden|clip|auto|scroll/.test(pcs.overflowX)) { clipped = true; break; }
          p = p.parentElement;
        }
        res.overflowCulprits.push({
          sel: path(el), left: Math.round(r.left), right: Math.round(r.right),
          width: Math.round(r.width), clippedByAncestor: clipped,
          text: (el.textContent || "").trim().slice(0, 60),
        });
      }
    }
    res.overflowCulprits.sort((a, b) => b.right - a.right);
    res.overflowCulprits = res.overflowCulprits.filter(c => !c.clippedByAncestor).slice(0, 12);
  }

  // --- tiny text ---
  const seenTiny = new Set();
  for (const el of all) {
    if (!visible(el)) continue;
    // only leaf-ish elements with own text
    const own = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(" ");
    if (!own) continue;
    const cs = getComputedStyle(el);
    const fs2 = parseFloat(cs.fontSize);
    if (fs2 < 12) {
      const key = sel(el) + "|" + Math.round(fs2 * 10);
      if (seenTiny.has(key)) continue;
      seenTiny.add(key);
      res.tinyText.push({ sel: path(el), fontSize: +fs2.toFixed(2), text: own.slice(0, 60) });
    }
  }

  // --- clipped text ---
  for (const el of all) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const own = (el.textContent || "").trim();
    if (!own) continue;
    const hasOwnText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim());
    if (!hasOwnText) continue;
    const ox = cs.overflowX, oy = cs.overflowY;
    if (el.scrollWidth > el.clientWidth + 1 && /hidden|clip/.test(ox)) {
      res.clippedText.push({ kind: "horizontal", sel: path(el), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, textOverflow: cs.textOverflow, text: own.slice(0, 80) });
    }
    if (el.scrollHeight > el.clientHeight + 1 && /hidden|clip/.test(oy)) {
      res.clippedText.push({ kind: "vertical", sel: path(el), scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, lineClamp: cs.webkitLineClamp, text: own.slice(0, 80) });
    }
  }
  res.clippedText = res.clippedText.filter(c => c.lineClamp === undefined || c.lineClamp === "none" || c.lineClamp === "").slice(0, 25);

  // --- cut-off: overflow:hidden box whose text child overflows vertically by >2px and no line-clamp ---
  for (const el of all) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    if (!/hidden|clip/.test(cs.overflow) && !/hidden|clip/.test(cs.overflowY)) continue;
    const r = el.getBoundingClientRect();
    for (const ch of el.children) {
      if (!visible(ch)) continue;
      const cr = ch.getBoundingClientRect();
      const overBottom = cr.bottom - r.bottom;
      const overTop = r.top - cr.top;
      const overRight = cr.right - r.right;
      if (overBottom > 2 || overTop > 2 || overRight > 2) {
        const chcs = getComputedStyle(ch);
        const txt = (ch.textContent || "").trim();
        if (!txt) continue;
        if (chcs.position === "absolute" || chcs.position === "fixed") continue;
        res.cutOff.push({ parent: path(el), child: sel(ch), parentRect: [Math.round(r.top), Math.round(r.bottom), Math.round(r.height)], childRect: [Math.round(cr.top), Math.round(cr.bottom), Math.round(cr.height)], overBottom: +overBottom.toFixed(1), overTop: +overTop.toFixed(1), overRight: +overRight.toFixed(1), text: txt.slice(0, 60) });
      }
    }
  }
  res.cutOff = res.cutOff.slice(0, 20);

  // --- contrast ---
  const parseRGB = (s) => {
    const m = s.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map(x => parseFloat(x.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const bgOf = (el) => {
    let n = el, acc = null;
    const stack = [];
    while (n) {
      const c = parseRGB(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) { stack.push(c); if (c.a === 1) break; }
      n = n.parentElement;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = blend(stack[i], base);
    return base;
  };
  const seenC = new Set();
  for (const el of all) {
    if (!visible(el)) continue;
    const own = Array.from(el.childNodes).filter(n => n.nodeType === 3 && n.textContent.trim()).map(n => n.textContent.trim()).join(" ");
    if (!own) continue;
    const cs = getComputedStyle(el);
    if (cs.webkitTextFillColor === "rgba(0, 0, 0, 0)" || cs.color === "rgba(0, 0, 0, 0)") continue;
    const fg0 = parseRGB(cs.color);
    if (!fg0) continue;
    const bg = bgOf(el);
    const fg = blend(fg0, bg);
    const L1 = lum(fg), L2 = lum(bg);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const fsz = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight) >= 700;
    const large = fsz >= 24 || (fsz >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (ratio < need) {
      const key = sel(el) + "|" + cs.color;
      if (seenC.has(key)) continue;
      seenC.add(key);
      res.lowContrast.push({ sel: path(el), color: cs.color, bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`, fontSize: fsz, ratio: +ratio.toFixed(2), need, text: own.slice(0, 50) });
    }
  }
  res.lowContrast = res.lowContrast.sort((a,b)=>a.ratio-b.ratio).slice(0, 20);

  return res;
};

(async()=>{
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-device-scale-factor=1"],
});

const report = {};
for (const pg of PAGES) {
  for (const vp of VIEWPORTS) {
    const key = `${pg.name}@${vp.w}`;
    const page = await browser.newPage();
    await page.setViewport({ width: vp.w, height: vp.h, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
    const errs = [];
    page.on("pageerror", e => errs.push(String(e).slice(0, 200)));
    try {
      await page.goto(BASE + pg.path, { waitUntil: "networkidle2", timeout: 60000 });
    } catch (e) { errs.push("nav: " + String(e).slice(0,120)); }
    await sleep(2500);
    // scroll through the whole page to trigger reveal animations
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    const steps = Math.min(14, Math.ceil(h / vp.h));
    for (let i = 1; i <= steps; i++) {
      const y = i * vp.h * 0.9;
      await page.evaluate((yy) => { if (window.lenis) window.lenis.scrollTo(yy, { immediate: true }); else document.scrollingElement.scrollTo(0, yy); }, y);
      await sleep(450);
    }
    await page.evaluate(() => window.lenis ? window.lenis.scrollTo(0, { immediate: true }) : document.scrollingElement.scrollTo(0, 0));
    await sleep(900);
    const r = await page.evaluate(MEASURE);
    r.errors = errs;
    r.viewport = `${vp.w}x${vp.h}`;
    report[key] = r;
    await page.screenshot({ path: `${OUT}/${key}-full.png`, fullPage: true });
    console.log(`--- ${key} overflow=${r.scrollWidth - r.clientWidth} culprits=${r.overflowCulprits.length} tiny=${r.tinyText.length} clipped=${r.clippedText.length} cut=${r.cutOff.length} contrast=${r.lowContrast.length} errs=${errs.length}`);
    await page.close();
  }
}
fs.writeFileSync(OUT + "/report.json", JSON.stringify(report, null, 2));
await browser.close();
console.log("DONE");

})();
