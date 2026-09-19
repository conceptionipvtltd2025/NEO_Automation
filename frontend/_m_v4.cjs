const puppeteer = require("puppeteer-core");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:5173/neo-website";
const OUT = "C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/18d08b3c-cf27-4620-a05b-a341693aa384/scratchpad/shots";
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox","--force-device-scale-factor=1"] });
  const page = await browser.newPage();
  await page.setViewport({ width: 320, height: 844, isMobile: true, hasTouch: true });
  await page.goto(BASE + "/csr", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(2000);
  const box = await page.evaluate(() => {
    const c=[...document.querySelectorAll("p.absolute")].find(p=>/Rotary volunteers outside/.test(p.textContent));
    if(!c) return null;
    c.scrollIntoView({block:"center"});
    return true;
  });
  await sleep(2000);
  const rect = await page.evaluate(() => {
    const c=[...document.querySelectorAll("p.absolute")].find(p=>/Rotary volunteers outside/.test(p.textContent));
    const r=c.getBoundingClientRect();
    const par=c.parentElement.getBoundingClientRect();
    return {x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),px:Math.round(par.left),py:Math.round(par.top),pw:Math.round(par.width),ph:Math.round(par.height)};
  });
  console.log("rect",JSON.stringify(rect));
  await page.screenshot({ path: OUT+"/caption-crop.png", clip:{x:rect.px,y:rect.py,width:rect.pw,height:rect.ph} });
  // hide the text, screenshot backdrop only, to measure background luminance behind line 1
  await page.evaluate(()=>{const c=[...document.querySelectorAll("p.absolute")].find(p=>/Rotary volunteers outside/.test(p.textContent)); c.style.visibility="hidden";});
  await sleep(300);
  await page.screenshot({ path: OUT+"/caption-bg.png", clip:{x:rect.x,y:rect.y,width:rect.w,height:rect.h} });
  console.log("captionRect",JSON.stringify(rect));
  await browser.close();
})();
