import puppeteer from "puppeteer-core";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--no-sandbox"] });

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const errors = [];
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

async function clickNav(href) {
  await page.evaluate((h) => {
    const a = [...document.querySelectorAll("header a")].find((x) => x.getAttribute("href") === h);
    a && a.click();
  }, href);
  await new Promise((r) => setTimeout(r, 1400));
}

async function report(label) {
  const r = await page.evaluate(() => {
    const main = document.querySelector("main");
    const cs = main ? getComputedStyle(main) : null;
    const rect = main ? main.getBoundingClientRect() : null;
    // first visible heading inside main
    const h = main ? main.querySelector("h1") : null;
    const hcs = h ? getComputedStyle(h) : null;
    return {
      path: location.pathname,
      mainOpacity: cs ? cs.opacity : "n/a",
      mainHeight: rect ? Math.round(rect.height) : 0,
      mainTextLen: (main?.innerText || "").trim().length,
      h1: h ? h.innerText.trim().slice(0, 40) : "(none)",
      h1Opacity: hcs ? hcs.opacity : "n/a",
    };
  });
  console.log(`${label}: path=${r.path} mainOpacity=${r.mainOpacity} mainH=${r.mainHeight} textLen=${r.mainTextLen} h1="${r.h1}" h1Op=${r.h1Opacity}`);
}

await page.goto("http://localhost:5173/", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 1200));
await report("HOME(load)   ");
await clickNav("/products");
await report("->Products   ");
await clickNav("/industries");
await report("->Industries ");
await clickNav("/about");
await report("->About      ");
await clickNav("/swf");
await report("->SWF        ");
await clickNav("/contact");
await report("->Contact    ");
await clickNav("/");
await report("->Home       ");

console.log(errors.length ? "\nERRORS:\n" + errors.slice(0, 6).join("\n") : "\nno console errors");
await browser.close();
