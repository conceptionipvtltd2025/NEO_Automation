const puppeteer = require("puppeteer-core");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:5173/neo-website";
const OUT = "C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/18d08b3c-cf27-4620-a05b-a341693aa384/scratchpad/shots";
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--force-device-scale-factor=1"] });

  // ---- ABOUT timeline card: is text really clipped? ----
  for (const vw of [320, 360, 390, 430]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vw, height: 900, isMobile: true, hasTouch: true });
    await page.goto(BASE + "/about", { waitUntil: "networkidle2", timeout: 60000 });
    // kill animations so measurements are steady state
    await page.addStyleTag({ content: "*,*::before,*::after{animation:none!important;transition:none!important;}" });
    await sleep(1200);
    await page.evaluate(() => { const t = document.querySelector("#timeline"); if (t) t.scrollIntoView(); });
    await sleep(1400);
    // force framer reveals visible
    await page.evaluate(() => { document.querySelectorAll("#timeline *").forEach(e => { if (getComputedStyle(e).opacity !== "1" && e.style) { e.style.opacity = "1"; e.style.transform = "none"; } }); });
    await sleep(600);
    const r = await page.evaluate(() => {
      const cards = [...document.querySelectorAll("#timeline .shine-sweep")];
      return cards.slice(0, 3).map(c => {
        const cs = getComputedStyle(c);
        const kids = [...c.children].map(k => { const kr = k.getBoundingClientRect(); const cr = c.getBoundingClientRect(); return { cls: (k.className||"").toString().slice(0,60), pos: getComputedStyle(k).position, overBottom: +(kr.bottom - cr.bottom).toFixed(1), overRight: +(kr.right - cr.right).toFixed(1), h: Math.round(kr.height) }; });
        const cr = c.getBoundingClientRect();
        return { w: Math.round(cr.width), h: Math.round(cr.height), sw: c.scrollWidth, cw: c.clientWidth, sh: c.scrollHeight, ch: c.clientHeight, ovf: cs.overflow, transform: cs.transform, kids, txt: c.textContent.trim().slice(0,60) };
      });
    });
    console.log("TIMELINE @" + vw, JSON.stringify(r, null, 1));
    await page.evaluate(() => { const t = document.querySelector("#timeline"); if (t) t.scrollIntoView(); });
    await sleep(500);
    await page.screenshot({ path: OUT + "/verify-timeline-" + vw + ".png" });
    await page.close();
  }
  await browser.close();
})();
