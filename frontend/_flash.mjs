import puppeteer from 'puppeteer-core';
const CH='C:/Program Files/Google/Chrome/Application/chrome.exe';
const b=await puppeteer.launch({executablePath:CH,headless:false,args:['--no-sandbox','--window-size=420,900']});
const p=await b.newPage();
await p.setViewport({width:390,height:844});
const t0=Date.now();
await p.goto('http://localhost:5177/neo-website/',{waitUntil:'domcontentloaded'});
// poll every 100ms for visible tawk chrome
const seen=[];
for(let i=0;i<90;i++){
  const r=await p.evaluate(()=>{
    const out=[];
    document.querySelectorAll('iframe[src*="tawk.to"],iframe[title*="chat" i]').forEach(f=>{
      let el=f; while(el.parentElement&&el.parentElement!==document.body) el=el.parentElement;
      const rc=el.getBoundingClientRect(); const cs=getComputedStyle(el);
      const visible = cs.display!=='none' && cs.visibility!=='hidden' && rc.width>0 && rc.height>0;
      out.push({t:(f.getAttribute('title')||'').slice(0,34), visible, w:Math.round(rc.width), h:Math.round(rc.height), disp:cs.display});
    });
    return out;
  }).catch(()=>[]);
  const vis=r.filter(x=>x.visible);
  if(vis.length) seen.push({ms:Date.now()-t0, items:vis.map(v=>`${v.t}:${v.w}x${v.h}`)});
  await new Promise(r=>setTimeout(r,100));
}
const diag=await p.evaluate(()=>({script:!!document.getElementById('tawk-script'),api:typeof window.Tawk_API?.maximize,iframes:document.querySelectorAll('iframe').length,tawkIframes:document.querySelectorAll('iframe[src*="tawk.to"]').length,bodyKids:document.body.children.length}));
console.log('diag:',JSON.stringify(diag));
if(!seen.length) console.log('No visible Tawk chrome observed.');
else {
  console.log(`VISIBLE from +${seen[0].ms}ms to +${seen[seen.length-1].ms}ms  (${seen.length} samples of 100ms)`);
  seen.slice(0,3).forEach(s=>console.log(`  +${s.ms}ms  ${s.items.join(' | ')}`));
  console.log('  ...');
  seen.slice(-2).forEach(s=>console.log(`  +${s.ms}ms  ${s.items.join(' | ')}`));
}
await b.close();
