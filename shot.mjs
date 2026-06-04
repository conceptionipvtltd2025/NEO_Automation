import puppeteer from "puppeteer-core";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const b = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
await p.goto("http://localhost:5173/", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 1000));
await p.evaluate(() => {
  const a = [...document.querySelectorAll("header a")].find((x) => x.getAttribute("href") === "/products");
  a && a.click();
});
await new Promise((r) => setTimeout(r, 2500));
await p.screenshot({ path: "products_shot.png" });
await b.close();
console.log("saved products_shot.png");
