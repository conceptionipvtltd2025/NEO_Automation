import puppeteer from "puppeteer-core";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const b = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--no-sandbox"] });
for (const [name, w, theme] of [["hdr-light-1440", 1440, "light"], ["hdr-dark-1440", 1440, "dark"], ["hdr-dark-1280", 1280, "dark"]]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 900 });
  await p.evaluateOnNewDocument((t) => { try { localStorage.setItem("neo-theme", t); } catch (e) {} }, theme);
  await p.goto("http://localhost:5199/neo-website/products", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2500));
  await p.screenshot({ path: `hdr/${name}.png`, clip: { x: 0, y: 0, width: w, height: 130 } });
  console.log("saved", name);
  await p.close();
}
await b.close();
