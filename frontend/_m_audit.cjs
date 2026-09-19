const puppeteer = require("puppeteer-core");
const fs = require("fs");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:5173/neo-website";
const OUT = "C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/18d08b3c-cf27-4620-a05b-a341693aa384/scratchpad/shots";
const PAGES = ["/about", "/csr", "/sustainability"];
const VIEWPORTS = [[320,800],[360,800],[390,844],[430,932]];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const MEASURE = function (vw) {
  var selOf = function (el) {
    var p = [], n = el;
    while (n && n.nodeType === 1 && p.length < 5) {
      var s = n.tagName.toLowerCase();
      if (n.id) { s += "#" + n.id; p.unshift(s); break; }
      if (n.className && typeof n.className === "string") {
        var c = n.className.trim().split(/\s+/).slice(0,4).join(".");
        if (c) s += "." + c;
      }
      p.unshift(s); n = n.parentElement;
    }
    return p.join(" > ");
  };
  var de = document.documentElement;
  var out = { sw: de.scrollWidth, cw: de.clientWidth, culprits: [], clipped: [], tiny: [], contrast: [], cut: [] };
  var all = [].slice.call(document.querySelectorAll("body *"));
  var visible = function (el) {
    var cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    if (parseFloat(cs.opacity) < 0.05) return false;
    var r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  var parseC = function (c) { var m = c && c.match(/[\d.]+/g); if (!m) return null; return { r:+m[0], g:+m[1], b:+m[2], a: m[3] !== undefined ? +m[3] : 1 }; };
  var lum = function (c) { var f = function (v) { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }; return 0.2126*f(c.r)+0.7152*f(c.g)+0.0722*f(c.b); };
  var bgOf = function (el) { var n = el; while (n && n.nodeType === 1) { var c = parseC(getComputedStyle(n).backgroundColor); if (c && c.a > 0.9) return c; n = n.parentElement; } return { r:255,g:255,b:255,a:1 }; };

  for (var i = 0; i < all.length; i++) {
    var el = all[i];
    if (!visible(el)) continue;
    var cs = getComputedStyle(el);
    var r = el.getBoundingClientRect();
    if (out.sw > out.cw && (r.right > vw + 1 || r.left < -1) && r.width < vw * 4) {
      out.culprits.push({ sel: selOf(el), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width), pos: cs.position, txt: (el.textContent||"").trim().slice(0,50) });
    }
    var direct = "";
    for (var k = 0; k < el.childNodes.length; k++) { var n = el.childNodes[k]; if (n.nodeType === 3 && n.textContent.trim()) direct += n.textContent.trim() + " "; }
    direct = direct.trim();
    if (direct) {
      var fsz = parseFloat(cs.fontSize);
      if (fsz < 12) out.tiny.push({ sel: selOf(el), fs: +fsz.toFixed(2), txt: direct.slice(0,70) });
      var fg = parseC(cs.color), bg = bgOf(el);
      if (fg && fg.a > 0.05) {
        var af = fg.a < 1 ? { r: fg.r*fg.a + bg.r*(1-fg.a), g: fg.g*fg.a + bg.g*(1-fg.a), b: fg.b*fg.a + bg.b*(1-fg.a) } : fg;
        var L1 = lum(af), L2 = lum(bg);
        var ratio = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
        var big = fsz >= 24 || (fsz >= 18.66 && parseInt(cs.fontWeight) >= 700);
        if (ratio < (big ? 3 : 4.5)) out.contrast.push({ sel: selOf(el), ratio: +ratio.toFixed(2), fs: +fsz.toFixed(1), color: cs.color, bg: "rgb("+Math.round(bg.r)+","+Math.round(bg.g)+","+Math.round(bg.b)+")", txt: direct.slice(0,60) });
      }
    }
    if (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 1 && cs.overflowX === "hidden") {
      out.clipped.push({ sel: selOf(el), sw: el.scrollWidth, cw: el.clientWidth, txt: (el.textContent||"").trim().slice(0,70) });
    }
    if (el.clientHeight > 0 && el.scrollHeight > el.clientHeight + 1 && cs.overflowY === "hidden") {
      out.cut.push({ sel: selOf(el), sh: el.scrollHeight, ch: el.clientHeight, css_h: cs.height, css_maxh: cs.maxHeight, txt: (el.textContent||"").trim().slice(0,70) });
    }
  }
  return out;
};

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--disable-setuid-sandbox","--force-device-scale-factor=1"] });
  const report = {};
  for (const pth of PAGES) {
    for (const vp of VIEWPORTS) {
      const vw = vp[0], vh = vp[1];
      const key = pth.replace("/","") + "@" + vw;
      const page = await browser.newPage();
      await page.setViewport({ width: vw, height: vh, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
      const errs = [];
      page.on("pageerror", e => errs.push(String(e).slice(0,160)));
      try { await page.goto(BASE + pth, { waitUntil: "networkidle2", timeout: 60000 }); } catch (e) { errs.push("nav:"+String(e).slice(0,120)); }
      await sleep(2500);
      const total = await page.evaluate(() => document.documentElement.scrollHeight);
      const steps = Math.min(16, Math.ceil(total / vh) + 1);
      for (let s = 1; s <= steps; s++) {
        await page.evaluate((idx, h) => {
          const y = idx * h * 0.85;
          const els = document.querySelectorAll("body *");
          for (const e of els) {
            const r = e.getBoundingClientRect();
            if (r.top + window.scrollY >= y) { e.scrollIntoView(); break; }
          }
        }, s, vh);
        await sleep(420);
      }
      await page.evaluate(() => { const f = document.querySelector("main") || document.body.firstElementChild; if (f) f.scrollIntoView(); });
      await sleep(1000);
      const r = await page.evaluate(MEASURE, vw);
      r.errors = errs; r.viewport = vw + "x" + vh; r.page = pth;
      report[key] = r;
      await page.screenshot({ path: OUT + "/" + key + ".png", fullPage: true });
      console.log("--- " + key + "  overflow=" + (r.sw - r.cw) + " culprits=" + r.culprits.length + " tiny=" + r.tiny.length + " clipped=" + r.clipped.length + " cut=" + r.cut.length + " contrast=" + r.contrast.length + " errs=" + errs.length);
      await page.close();
    }
  }
  fs.writeFileSync(OUT + "/report.json", JSON.stringify(report, null, 1));
  await browser.close();
  console.log("DONE");
})();
