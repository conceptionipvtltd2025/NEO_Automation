import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:false,args:['--no-sandbox','--window-size=420,900']});
const p=await b.newPage(); await p.setViewport({width:390,height:844});
const t0=Date.now();
await p.goto('http://localhost:5177/neo-website/',{waitUntil:'domcontentloaded'});
// watch the tawk container (z-index 2000000000, body-level div) over 25s
for(let i=0;i<50;i++){
  const r=await p.evaluate(()=>{
    const c=[...document.body.children].find(el=>el.tagName==='DIV'&&el.id&&el.id!=='root'&&getComputedStyle(el).zIndex==='2000000000');
    if(!c)return null;
    const rc=c.getBoundingClientRect(); const cs=getComputedStyle(c);
    const inner=[...c.children].map(k=>{const kr=k.getBoundingClientRect();const ks=getComputedStyle(k);
      return `${k.tagName}#${k.id||'-'} ${Math.round(kr.width)}x${Math.round(kr.height)} ${ks.display}`});
    return {id:c.id,w:Math.round(rc.width),h:Math.round(rc.height),disp:cs.display,neoHidden:c.dataset.neoTawkHidden||'-',inner};
  });
  if(r && (r.disp!=='none' || r.h>0)) console.log(`+${Date.now()-t0}ms VISIBLE`, JSON.stringify(r));
  await new Promise(r=>setTimeout(r,500));
}
const fin=await p.evaluate(()=>{
  const c=[...document.body.children].find(el=>el.tagName==='DIV'&&el.id&&el.id!=='root'&&getComputedStyle(el).zIndex==='2000000000');
  return c?{disp:getComputedStyle(c).display,h:Math.round(c.getBoundingClientRect().height),neoHidden:c.dataset.neoTawkHidden||'-'}:'gone';
});
console.log('final:',JSON.stringify(fin));
await b.close();
