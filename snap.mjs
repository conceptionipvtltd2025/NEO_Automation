import puppeteer from "puppeteer-core";

const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = process.argv[2] || "5174";
const TAG = process.argv[3] || "before";
const PATHS = [["/", "home"]];

const b = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  args: ["--no-sandbox", "--window-size=1440,900"],
});

for (const theme of ["dark", "light"]) {
  for (const [path, name] of PATHS) {
    const p = await b.newPage();
    await p.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
    // seed theme before paint (matches index.html anti-FOUC script)
    await p.evaluateOnNewDocument((t) => {
      localStorage.setItem("neo-theme", t);
    }, theme);
    await p.goto(`http://localhost:${PORT}${path}`, { waitUntil: "networkidle2" });
    await new Promise((r) => setTimeout(r, 1800));
    // top of page
    await p.screenshot({ path: `shots/${TAG}-${name}-${theme}-top.png` });
    // scroll mid to capture sections
    await p.evaluate(() => window.scrollTo({ top: window.innerHeight * 2.2, behavior: "instant" }));
    await new Promise((r) => setTimeout(r, 1400));
    await p.screenshot({ path: `shots/${TAG}-${name}-${theme}-mid.png` });
    await p.close();
    console.log(`saved ${TAG}-${name}-${theme}`);
  }
}

await b.close();
