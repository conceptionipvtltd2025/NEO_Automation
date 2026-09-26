import puppeteer from "puppeteer-core";

const BASE = "http://localhost:5173/neo-website";
const SHOTS =
  "C:/Users/tankk/AppData/Local/Temp/claude/d--neo-automation/f820648c-d2bb-4475-81f5-756537445d3a/scratchpad/shots2";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: "new",
  args: ["--no-sandbox"],
});
const out = {};

// ── Search dropdown ──────────────────────────────────────────────────────
for (const [q, theme] of [["vibration", "dark"], ["founder", "light"]]) {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument((t) => localStorage.setItem("neo-theme", t), theme);
  await page.setViewport({ width: 1440, height: 900 });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e.message)));
  await page.goto(BASE + "/", { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(600);
  await page.click('button[aria-label="Search the site"]');
  await sleep(400);
  await page.type('input[role="combobox"]', q, { delay: 40 });
  await sleep(900);
  const results = await page.evaluate(() => {
    const input = document.querySelector('input[role="combobox"]');
    let panel = input;
    for (let i = 0; i < 8 && panel; i++) {
      panel = panel.parentElement;
      if (panel && panel.querySelectorAll("a[href]").length > 0) break;
    }
    return [...(panel?.querySelectorAll("a[href]") ?? [])].map((a) => ({
      text: a.innerText.replace(/\s+/g, " ").trim().slice(0, 90),
      href: a.getAttribute("href"),
    }));
  });
  await page.screenshot({ path: `${SHOTS}/verify-search-${q}.png` });
  // Follow each distinct result href, check it lands on a non-404 page and the hash exists.
  const checked = [];
  for (const r of results) {
    if (!r.href || r.href.endsWith(".pdf")) continue;
    const p2 = await browser.newPage();
    await p2.setViewport({ width: 1280, height: 800 });
    const url = r.href.startsWith("http") ? r.href : `http://localhost:5173${r.href}`;
    await p2.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    await sleep(700);
    const res = await p2.evaluate(() => {
      const main = document.querySelector("main")?.innerText?.slice(0, 600) || "";
      const hash = location.hash.slice(1);
      return {
        path: location.pathname + location.hash,
        notFound: /page not found|not found|404/i.test(main),
        hashOk: !hash || Boolean(document.getElementById(decodeURIComponent(hash))),
        h1: document.querySelector("h1")?.innerText?.slice(0, 80),
      };
    });
    checked.push({ href: r.href, ...res });
    await p2.close();
  }
  out[`search-${q}`] = { errs, results, checked };
  await page.close();
}

// ── CO2 lightbox: open, then browser Back must close it and stay on /about ──
{
  const page = await browser.newPage();
  await page.evaluateOnNewDocument((t) => localStorage.setItem("neo-theme", t), "dark");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e.message)));
  await page.goto(BASE + "/", { waitUntil: "networkidle2" });
  await sleep(400);
  await page.goto(BASE + "/about#co2-calculator", { waitUntil: "networkidle2" });
  await sleep(1500);
  const steps = [];
  const state = async (label) => {
    const s = await page.evaluate(() => ({
      path: location.pathname + location.hash,
      dialog: Boolean(document.querySelector('[role="dialog"][aria-modal="true"]')),
      closeBtnVisible: (() => {
        const b = document.querySelector('button[aria-label="Close image viewer"]');
        if (!b) return false;
        const r = b.getBoundingClientRect();
        return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth;
      })(),
      htmlOverflow: document.documentElement.style.overflow,
    }));
    steps.push({ label, ...s });
  };
  const triggers = await page.$$('button[aria-label^="Enlarge"]');
  steps.push({ label: "triggers", count: triggers.length });
  // open slide via click
  await page.evaluate(() => document.querySelector('button[aria-label^="Enlarge slide"]')?.scrollIntoView({ block: "center" }));
  await sleep(600);
  await page.evaluate(() => document.querySelector('button[aria-label^="Enlarge slide"]')?.click());
  await sleep(700);
  await state("after open");
  await page.screenshot({ path: `${SHOTS}/verify-lightbox-open-390.png` });
  await page.goBack();
  await sleep(700);
  await state("after browser Back");
  // open again, close via X, then Back should go to home (no stale entry)
  await page.evaluate(() => document.querySelector('button[aria-label^="Enlarge"]')?.click());
  await sleep(700);
  await state("reopen");
  await page.evaluate(() => document.querySelector('button[aria-label="Close image viewer"]')?.click());
  await sleep(700);
  await state("after X");
  // Escape path
  await page.evaluate(() => document.querySelector('button[aria-label^="Enlarge"]')?.click());
  await sleep(700);
  await page.keyboard.press("Escape");
  await sleep(700);
  await state("after Esc");
  await page.goBack();
  await sleep(1200);
  await state("Back after closes (expect home)");
  out.lightbox = { errs, steps };
  await page.close();
}

console.log(JSON.stringify(out, null, 1));
await browser.close();
