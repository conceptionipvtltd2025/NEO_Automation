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
    await page.goto(BASE + "/csr", { waitUntil: "networkidle2", timeout: 60000 });
    await sleep(2000);
    await page.evaluate(() => { const e=[...document.querySelectorAll("h3")].find(h=>h.textContent.includes("Local first")); if(e) e.scrollIntoView({block:"center"}); });
    await sleep(2000);
    const r = await page.evaluate(() => {
      const out={};
      const h3=[...document.querySelectorAll("h3")].find(h=>h.textContent.includes("In partnership"));
      if(h3){
        const col=h3.parentElement; const card=col.parentElement;
        const p=col.querySelector("p");
        const lh=parseFloat(getComputedStyle(p).lineHeight);
        out.pillar={ cardW:Math.round(card.getBoundingClientRect().width), textColW:Math.round(col.getBoundingClientRect().width), display:getComputedStyle(card).display, flexDir:getComputedStyle(card).flexDirection, pH:Math.round(p.getBoundingClientRect().height), lineHeight:lh, lines:Math.round(p.getBoundingClientRect().height/lh), fs:getComputedStyle(p).fontSize };
      }
      // project photo caption over image
      const caps=[...document.querySelectorAll("p.absolute")].filter(p=>/Rotary volunteers outside|blood donation camp/.test(p.textContent));
      out.captions=caps.map(c=>{const cs=getComputedStyle(c);const r=c.getBoundingClientRect();
        const par=c.parentElement; const img=par.querySelector("img");
        const ir=img?img.getBoundingClientRect():null;
        return {color:cs.color,fs:cs.fontSize,w:Math.round(r.width),h:Math.round(r.height),top:Math.round(r.top),imgBottom:ir?Math.round(ir.bottom):null,capBottom:Math.round(r.bottom),overlapImgPx: ir? Math.round(ir.bottom-r.top):null, txt:c.textContent.trim().slice(0,60)};});
      return out;
    });
    console.log("@"+vw, JSON.stringify(r,null,1));
    await page.screenshot({ path: OUT+"/csr-pillars-"+vw+".png" });
    await page.close();
  }
  await browser.close();
})();
