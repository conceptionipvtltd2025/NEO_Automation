import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:false,args:['--no-sandbox','--window-size=420,900']});
const p=await b.newPage(); await p.setViewport({width:390,height:844});
await p.goto('http://localhost:5177/neo-website/',{waitUntil:'domcontentloaded'});
for(let i=0;i<50;i++){
  const r=await p.evaluate(()=>{
    const c=[...document.body.children].find(el=>el.tagName==='DIV'&&el.id&&el.id!=='root'&&el.querySelector('iframe'));
    if(!c)return null;
    const painted=[...c.querySelectorAll('iframe')].some(f=>{const r=f.getBoundingClientRect();return getComputedStyle(f).display!=='none'&&r.width>0});
    if(!painted)return null;
    const cs=getComputedStyle(c);
    return {
      zIndexRaw: cs.zIndex,
      zParsed: Number.parseInt(cs.zIndex,10),
      passesZ: Number.isFinite(Number.parseInt(cs.zIndex,10)) && Number.parseInt(cs.zIndex,10)>=1000000000,
      hasIframe: !!c.querySelector('iframe'),
      isBodyChild: c.parentElement===document.body,
      position: cs.position,
      marker: c.dataset.neoTawkHidden||'-',
      inline: c.getAttribute('style')||'(none)',
    };
  });
  if(r){ console.log(JSON.stringify(r,null,1)); break; }
  await new Promise(x=>setTimeout(x,350));
}
await b.close();
