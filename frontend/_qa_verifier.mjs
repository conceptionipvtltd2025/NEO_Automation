import puppeteer from "puppeteer-core";

const BASE = "http://localhost:5173/neo-website";
const SHOTS =
  "C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/f820648c-d2bb-4475-81f5-756537445d3a/scratchpad/shots2";
const INSIGHTS = [
  "safety-first",
  "heat-pump-precision",
  "wind-smart-bolting",
  "defence-smart-assembly",
  "vibration-standard",
  "hand-arm-vibration",
  "vibration-pocket-guide",
  "powerful-ergonomics",
  "bolt-tensioning-safety",
  "mechatronic-system",
];
const ROUTES = ["/", "/safety", "/about", "/csr", "/nsw", ...INSIGHTS.map((i) => `/safety/insights/${i}`)];
const WIDTHS = [390, 1440];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: "new",
  args: ["--no-sandbox"],
});

const report = [];

for (const width of WIDTHS) {
  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument((t) => localStorage.setItem("neo-theme", t), "dark");
    await page.setViewport({ width, height: 900 });
    const errors = [];
    const bad = [];
    const consoleErr = [];
    page.on("pageerror", (e) => errors.push(String(e.message || e)));
    page.on("console", (m) => {
      if (m.type() === "error") consoleErr.push(m.text().slice(0, 200));
    });
    page.on("response", (r) => {
      const u = r.url();
      if (r.status() >= 400) bad.push(`${r.status()} ${u}`);
    });
    page.on("requestfailed", (r) => {
      const u = r.url();
      const f = r.failure()?.errorText || "";
      if (f.includes("ERR_ABORTED")) return;
      bad.push(`FAILED ${f} ${u}`);
    });
    await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 60000 });
    await sleep(500);
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h + 900; y += 300) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(120);
    }
    await sleep(800);
    const info = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const sw = document.documentElement.scrollWidth;
      const bodySw = document.body.scrollWidth;
      const offenders = [];
      if (sw > vw || bodySw > vw) {
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.right > vw + 1 && r.width > 0) {
            offenders.push(
              `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)} right=${Math.round(r.right)}`
            );
            if (offenders.length > 6) break;
          }
        }
      }
      const brokenImgs = [...document.querySelectorAll("img")]
        .filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("src"))
        .map((i) => i.getAttribute("src"));
      const links = [...document.querySelectorAll("a[href]")].map((a) => a.href);
      const external = links.filter((l) => {
        try {
          const u = new URL(l);
          return (u.protocol === "http:" || u.protocol === "https:") && u.host !== location.host;
        } catch {
          return false;
        }
      });
      const insightLinks = links.filter((l) => l.includes("/safety/insights/"));
      const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
      const notFound = /page not found|404/i.test(document.querySelector("main")?.innerText?.slice(0, 400) || "");
      return { vw, sw, bodySw, offenders, brokenImgs, external: [...new Set(external)], insightLinks: [...new Set(insightLinks)], ids, notFound, title: document.title };
    });
    if (width === 1440 || route === "/safety" || route === "/about") {
      const name = (route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "")) + `-${width}`;
      await page.evaluate(() => window.scrollTo(0, 0));
      await sleep(300);
      await page.screenshot({ path: `${SHOTS}/verify-${name}.png`, fullPage: false });
    }
    report.push({ route, width, errors, bad: [...new Set(bad)], consoleErr: [...new Set(consoleErr)].slice(0, 5), ...info, ids: undefined, _ids: info.ids });
    await page.close();
  }
}

// Anchor ids that search entries deep-link to
const anchorsNeeded = {
  "/safety": ["disciplines", "hazards", "in-service", "training", "insights", "vibration"],
  "/csr": ["water-for-all-global"],
  "/about": ["story", "co2-calculator", "mission-vision", "timeline", "values", "credentials", "certificates"],
  "/nsw": ["what-we-service", "torque-calibration", "hydraulic-tools", "repair-spares", "inside-the-workshop", "service-promise"],
};
const anchorReport = {};
for (const [route, ids] of Object.entries(anchorsNeeded)) {
  const r = report.find((x) => x.route === route && x.width === 1440);
  anchorReport[route] = ids.filter((id) => !r._ids.includes(id));
}

for (const r of report) {
  delete r._ids;
}
console.log(JSON.stringify({ report, missingAnchors: anchorReport }, null, 1));
await browser.close();
