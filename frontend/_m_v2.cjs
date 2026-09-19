const puppeteer = require("puppeteer-core");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:5173/neo-website";
const OUT = "C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/18d08b3c-cf27-4620-a05b-a341693aa384/scratchpad/shots";
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--force-device-scale-factor=1"] });
  for (const vw of [320,360,390,430]) {
    const page = await browser.newPage();
    await page.setViewport({ width: vw, height: 844, isMobile: true, hasTouch: true });
    await page.goto(BASE + "/about", { waitUntil: "networkidle2", timeout: 60000 });
    await sleep(2000);
    await page.evaluate(() => { const m = document.querySelector("#mission-vision"); if (m) m.scrollIntoView(); });
    await sleep(2200);
    const r = await page.evaluate(() => {
      const mv = document.querySelector("#mission-vision");
      const grid = mv && mv.querySelector(".grid");
      const cards = grid ? [...grid.children] : [];
      const gr = grid && grid.getBoundingClientRect();
      // stat cards
      const statGrid = [...document.querySelectorAll(".grid")].find(g => /YEARS OF|19\+/i.test(g.textContent) && g.children.length >= 3);
      const stats = statGrid ? [...statGrid.children].map(c => { const b = c.getBoundingClientRect(); return { h: Math.round(b.height), w: Math.round(b.width), txt: c.textContent.trim().replace(/\s+/g," ").slice(0,44) }; }) : null;
      return {
        mvCols: grid ? getComputedStyle(grid).gridTemplateColumns : null,
        mvGridH: gr ? Math.round(gr.height) : null,
        cards: cards.map(c => { const b = c.getBoundingClientRect(); const cs = getComputedStyle(c); return { h: Math.round(b.height), top: Math.round(b.top), opacity: cs.opacity, transform: cs.transform, txt: c.textContent.trim().replace(/\s+/g," ").slice(0,44) }; }),
        statCols: statGrid ? getComputedStyle(statGrid).gridTemplateColumns : null,
        stats
      };
    });
    console.log("@" + vw, JSON.stringify(r, null, 1));
    await page.evaluate(() => { const m = document.querySelector("#mission-vision"); if (m) m.scrollIntoView(); });
    await sleep(400);
    await page.screenshot({ path: OUT + "/mv-" + vw + ".png" });
    await page.close();
  }
  await browser.close();
})();
