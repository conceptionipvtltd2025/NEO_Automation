import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:false,args:['--no-sandbox','--window-size=420,900']});
const p=await b.newPage(); await p.setViewport({width:390,height:844});
const t0=Date.now();
await p.goto('http://localhost:5177/neo-website/',{waitUntil:'domcontentloaded'});
let flashes=0, firstSeen=null, containerSeen=false;
for(let i=0;i<64;i++){
  const r=await p.evaluate(()=>{
    const c=[...document.body.children].find(el=>el.tagName==='DIV'&&el.id&&el.id!=='root'&&el.querySelector('iframe'));
    if(!c) return {exists:false};
    const cs=getComputedStyle(c);
    // any child iframe actually painting?
    const painted=[...c.querySelectorAll('iframe')].filter(f=>{
      const fr=f.getBoundingClientRect(); const fs=getComputedStyle(f);
      return fs.display!=='none' && fr.width>0 && fr.height>0;
    }).map(f=>{const fr=f.getBoundingClientRect();return `${Math.round(fr.width)}x${Math.round(fr.height)}`});
    return {exists:true, disp:cs.display, marker:c.dataset.neoTawkHidden||'-', painted,
            visible: cs.display!=='none' && painted.length>0};
  });
  if(r.exists) containerSeen=true;
  if(r.visible){ flashes++; if(!firstSeen) firstSeen={ms:Date.now()-t0, r}; }
  await new Promise(x=>setTimeout(x,500));
}
console.log('container appeared:', containerSeen);
console.log('visible samples:', flashes, firstSeen?JSON.stringify(firstSeen):'(none)');
const fin=await p.evaluate(()=>{
  const c=[...document.body.children].find(el=>el.tagName==='DIV'&&el.id&&el.id!=='root'&&el.querySelector('iframe'));
  return {style:!!document.getElementById('neo-tawk-suppress'), gate:document.documentElement.className.includes('neo-chat-open'),
    container:c?{disp:getComputedStyle(c).display,marker:c.dataset.neoTawkHidden||'-'}:'none',
    ourLauncher:!!document.querySelector('[aria-label*="Live chat"]')};
});
console.log('final:',JSON.stringify(fin));
console.log(flashes===0?'\n>>> PASS: no Tawk flash':'\n>>> FAIL: flashed '+flashes+' samples');
await b.close();
