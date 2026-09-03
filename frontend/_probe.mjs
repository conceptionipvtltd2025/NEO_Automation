import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:false,args:['--no-sandbox','--window-size=420,900']});
const p=await b.newPage(); await p.setViewport({width:390,height:844});
await p.goto('http://localhost:5177/neo-website/',{waitUntil:'networkidle2'});
await new Promise(r=>setTimeout(r,6000));
const r=await p.evaluate(()=>{
  const frames=[...document.querySelectorAll('iframe')].map(f=>{
    const rc=f.getBoundingClientRect(); const cs=getComputedStyle(f);
    return {src:(f.getAttribute('src')||'(none)').slice(0,60), title:(f.getAttribute('title')||'(none)').slice(0,40),
            id:f.id||'(none)', cls:(f.className||'(none)').slice(0,40),
            w:Math.round(rc.width),h:Math.round(rc.height),disp:cs.display,vis:cs.visibility};
  });
  const kids=[...document.body.children].map(el=>{
    const rc=el.getBoundingClientRect(); const cs=getComputedStyle(el);
    return {tag:el.tagName,id:el.id||'-',cls:(typeof el.className==='string'?el.className:'').slice(0,50),
            w:Math.round(rc.width),h:Math.round(rc.height),disp:cs.display,z:cs.zIndex,
            frames:el.querySelectorAll('iframe').length};
  });
  return {frames,kids};
});
console.log('=== IFRAMES ==='); r.frames.forEach(f=>console.log(JSON.stringify(f)));
console.log('=== BODY CHILDREN ==='); r.kids.forEach(k=>console.log(JSON.stringify(k)));
await b.close();
