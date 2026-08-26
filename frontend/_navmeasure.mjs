import puppeteer from "puppeteer-core";
const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const b = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--no-sandbox"] });
for (const w of [1920, 1600, 1500, 1440, 1366, 1280, 1279, 1024]) {
  const p = await b.newPage();
  await p.setViewport({ width: w, height: 900 });
  await p.goto("http://localhost:5199/neo-website/", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2500));
  const m = await p.evaluate(() => {
    const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), w: Math.round(b.width), h: Math.round(b.height), top: Math.round(b.top), bottom: Math.round(b.bottom) }; };
    const bar = document.querySelector("header .container-px > div > div");
    const logo = document.querySelector("header a[href='/neo-website/'], header a");
    const nav = document.querySelector("header nav");
    const actions = nav?.nextElementSibling;
    const items = [...(nav?.querySelectorAll(":scope > div") ?? [])].map(d => {
      const a = d.querySelector("a");
      const bb = a.getBoundingClientRect();
      return { label: a.textContent.trim(), x: Math.round(bb.x), w: Math.round(bb.width) };
    });
    const gaps = [];
    for (let i = 1; i < items.length; i++) gaps.push(items[i].x - (items[i-1].x + items[i-1].w));
    const barEl = bar; const cs = barEl ? getComputedStyle(barEl) : null;
    const contentRight = barEl ? barEl.getBoundingClientRect().right - parseFloat(cs.paddingRight) : 0;
    const actRight = actions ? actions.getBoundingClientRect().right : 0;
    return {
      overflow: Math.round(actRight - contentRight),
      bar: r(bar), logo: r(logo), nav: r(nav), actions: r(actions),
      logoToNav: nav && logo ? Math.round(nav.getBoundingClientRect().x - logo.getBoundingClientRect().right) : null,
      navToActions: nav && actions ? Math.round(actions.getBoundingClientRect().x - nav.getBoundingClientRect().right) : null,
      items, gaps,
    };
  });
  console.log("\n=== " + w + " ===");
  console.log("OVERFLOW px (>0 = broken):", m.overflow);
  console.log("bar    ", JSON.stringify(m.bar));
  console.log("logo   ", JSON.stringify(m.logo));
  console.log("nav    ", JSON.stringify(m.nav));
  console.log("actions", JSON.stringify(m.actions));
  console.log("logo→nav gap:", m.logoToNav, " nav→actions gap:", m.navToActions);
  console.log("items  ", m.items.map(i => `${i.label}:${i.w}`).join("  "));
  console.log("gaps   ", m.gaps.join(", "));
  await p.close();
}
await b.close();
