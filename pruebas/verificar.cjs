const {chromium} = require('playwright');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = path.resolve(__dirname,'..');
const output = path.join(root,'evidencias');
fs.mkdirSync(output,{recursive:true});
(async()=>{
 const server=require('http').createServer((req,res)=>{const name=decodeURIComponent(req.url.split('?')[0]);const target=path.join(root,name==='/'?'index.html':name);try{const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'};res.setHeader('Content-Type',types[path.extname(target)]||'application/octet-stream');res.end(fs.readFileSync(target));}catch{res.statusCode=404;res.end('Not found');}});
 await new Promise(resolve=>server.listen(8766,'127.0.0.1',resolve));
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
 const page=await browser.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const results=[];
 for(const [width,height,label] of [[390,844,'movil-390'],[768,1024,'tablet-768'],[1440,1000,'escritorio-1440']]){
  await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:8766/');
  await page.screenshot({path:path.join(output,label+'.png'),fullPage:true});
  const sizes=await page.evaluate(()=>({viewport:innerWidth,content:document.documentElement.scrollWidth}));
  assert.ok(sizes.content<=width,JSON.stringify(sizes));
  results.push({prueba:'Sin desbordamiento '+width+'px',resultado:'Correcto',...sizes});
 }
 await page.setViewportSize({width:390,height:844});await page.reload();
 await page.keyboard.press('Tab');
 assert.equal(await page.evaluate(()=>document.activeElement.className),'skip-link');
 const focus=await page.evaluate(()=>getComputedStyle(document.activeElement).outlineWidth);
 assert.notEqual(focus,'0px');
 await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'contenido');
 results.push({prueba:'Tab, foco visible y salto al contenido',resultado:'Correcto'});
 const menu=page.getByRole('button',{name:/Menú/});await menu.click();
 assert.equal(await menu.getAttribute('aria-expanded'),'true');
 await page.getByRole('navigation').getByRole('link').first().focus();await page.keyboard.press('Escape');
 assert.equal(await menu.getAttribute('aria-expanded'),'false');
 assert.equal(await page.evaluate(()=>document.activeElement.className),'menu-button');
 results.push({prueba:'Menú móvil, Escape y devolución del foco',resultado:'Correcto'});
 await page.getByRole('button',{name:'Diseño',exact:true}).click();
 assert.equal(await page.locator('.workshop-card:visible').count(),1);
 assert.equal(await page.locator('#resultados').textContent(),'1 taller disponible');
 await page.getByRole('button',{name:'Todos',exact:true}).click();
 assert.equal(await page.locator('.workshop-card:visible').count(),3);
 results.push({prueba:'Filtro por área y restablecimiento',resultado:'Correcto'});
 await page.locator('[data-workshop="web"]').click();assert.equal(await page.locator('#taller').inputValue(),'web');
 await page.locator('#taller').selectOption('');await page.getByRole('button',{name:/Validar mi interés/}).click();
 assert.equal(await page.locator('[aria-invalid="true"]').count(),3);
 assert.equal(await page.evaluate(()=>document.activeElement.id),'nombre');
 await page.locator('#nombre').fill('Ana Pérez');await page.locator('#correo').fill('incorrecto');await page.locator('#taller').selectOption('web');
 await page.getByRole('button',{name:/Validar mi interés/}).click();
 assert.equal(await page.locator('#correo').getAttribute('aria-invalid'),'true');
 await page.locator('#correo').fill('ana@example.com');await page.getByRole('button',{name:/Validar mi interés/}).click();
 assert.match(await page.locator('#form-status').textContent(),/Validación completada/);
 results.push({prueba:'Formulario vacío, correo inválido, selección y confirmación',resultado:'Correcto'});
 const structural=await page.evaluate(()=>({
  h1:document.querySelectorAll('h1').length,
  sections:document.querySelectorAll('main section').length,
  brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).length,
  missingAlt:document.querySelectorAll('img:not([alt])').length,
  missingLabels:[...document.querySelectorAll('input,select')].filter(e=>!document.querySelector('label[for="'+e.id+'"]')).length,
  duplicateIds:[...document.querySelectorAll('[id]')].map(e=>e.id).filter((v,i,a)=>a.indexOf(v)!==i)
 }));
 assert.equal(structural.h1,1);assert.ok(structural.sections>=4);assert.equal(structural.brokenAnchors,0);assert.equal(structural.missingAlt,0);assert.equal(structural.missingLabels,0);assert.equal(structural.duplicateIds.length,0);
 results.push({prueba:'Estructura, anclas, alternativas, etiquetas e IDs',resultado:'Correcto',...structural});
 // Reflow equivalente a 400% sobre un escritorio de 1280px.
 await page.setViewportSize({width:320,height:800});await page.goto('http://127.0.0.1:8766/');
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.addStyleTag({content:'html{font-size:200%}'});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 results.push({prueba:'Reflow a 320px y ampliación de texto al 200%',resultado:'Correcto'});
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const fallback=await nojs.newPage();await fallback.goto('http://127.0.0.1:8766/');
 assert.ok(await fallback.locator('nav').isVisible());assert.equal(await fallback.locator('.workshop-card:visible').count(),3);
 results.push({prueba:'Contenido y navegación sin JavaScript',resultado:'Correcto'});
 assert.equal(errors.length,0);results.push({prueba:'Errores JavaScript en navegador',resultado:'Ninguno'});
 function luminance(hex){const values=hex.match(/\w\w/g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return .2126*values[0]+.7152*values[1]+.0722*values[2];}
 const pairs=[['172c27','f8f7f2'],['4d6058','f8f7f2'],['ffffff','174c3e'],['dcf4a4','174c3e'],['9e2222','f8f7f2'],['e0ebd6','174c3e']];
 const contrast=pairs.map(([a,b])=>{const x=luminance(a),y=luminance(b);const ratio=(Math.max(x,y)+.05)/(Math.min(x,y)+.05);assert.ok(ratio>=4.5);return {texto:'#'+a,fondo:'#'+b,ratio:Number(ratio.toFixed(2))};});
 results.push({prueba:'Contraste de seis pares principales, mínimo 4.5:1',resultado:'Correcto',pares:contrast});
 const report={fecha:'2026-10-14',navegador:'Chromium / Playwright',resultados:results,limites:'Revisión estructural básica, no validación completa W3C. No se realizó auditoría con lector de pantalla ni certificación WCAG.'};
 fs.writeFileSync(path.join(output,'resultados-pruebas.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));await browser.close();server.close();
})().catch(e=>{console.error(e);process.exit(1)});

