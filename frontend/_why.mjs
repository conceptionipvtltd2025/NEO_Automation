import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:false,args:['--no-sandbox','--window-size=420,900']});
const p=await b.newPage(); await p.setViewport({width:390,height:844});
await p.goto('http://localhost:5177/neo-website/',{waitUntil:'domcontentloaded'});
// wait until painted, then interrogate the selector
for(let i=0;i<40;i++){
  const hit=await p.evaluate(()=>{
    const c=[...document.body.children].find(el=>el.tagName==='DIV'&&el.id&&el.id!=='root'&&el.querySelector('iframe'));
    if(!c)return null;
    const painted=[...c.querySelectorAll('iframe')].some(f=>{const r=f.getBoundingClientRect();return getComputedStyle(f).display!=='none'&&r.width>0});
    if(!painted)return null;
    return {
      id:c.id, disp:getComputedStyle(c).display,
      directIframes:[...c.children].filter(k=>k.tagName==='IFRAME').length,
      childTags:[...c.children].map(k=>k.tagName),
      matchesHas: c.matches('body > div[id]:not(#root):has(> iframe)'),
      supportsHas: CSS.supports('selector(:has(> iframe))'),
      htmlCls: document.documentElement.className,
      inlineStyle: c.getAttribute('style')||'(none)',
      styleTagPresent: !!document.getElementById('neo-tawk-suppress'),
    };
  });
  if(hit){ console.log(JSON.stringify(hit,null,1)); break; }
  await new Promise(r=>setTimeout(r,400));
}
await b.close();
