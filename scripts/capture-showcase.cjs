'use strict';
// Public images are a separate pass: no simulated OS bands, keyboards, edited
// screenshots or injected product CSS. Existing stress screenshots stay intact.
const fs=require('node:fs'),path=require('node:path');
const Config=require('./showcase/config.cjs'),PNG=require('./showcase/png.cjs');
async function capture({send,evaluate,fixture,sessionId,output}){
 const root=path.resolve(__dirname,'..'),dir=path.join(output,'showcase');fs.mkdirSync(dir,{recursive:true});let assertions=0;
 const assert=(ok,msg)=>{assertions++;if(!ok)throw Error('Showcase: '+msg);};
 const shots=[];
 for(const recipe of Config.screens){
  await send('Emulation.setDeviceMetricsOverride',{width:384,height:824,deviceScaleFactor:1,mobile:true},sessionId);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:recipe.theme},{name:'prefers-reduced-motion',value:'reduce'}]},sessionId);
  const n=await send('Page.navigate',{url:'file://'+path.join(root,'www/index.html')},sessionId);assert(!n.errorText,'current app loads');
  await evaluate(sessionId,"new Promise((resolve,reject)=>{const at=Date.now();const ready=()=>window.FriendsToAmigos?resolve(true):Date.now()-at>5000?reject(Error('App load timeout')):setTimeout(ready,10);ready();})");
  await fixture(sessionId,`localStorage.clear();storageContext=P.load(localStorage,C);state={...storageContext.state,name:'Alex',onboarded:true,dictionaryTipSeen:true,spanishTransitionSeen:true};tab='Home';screen='main';quiz=null;todaySession=null;profileStatsOpen=false;viewStage='A1.1';dictionaryUI.close();window.FriendsToAmigosInsets(0,0,0,0,false,0);let seed=733;Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);render();window.scrollTo(0,0);`);
  const setup={
   home:"actions.home();",
   learn:"actions.tab({dataset:{tab:'Learn'}});",
   beginner:"actions.lesson({dataset:{id:'u0l0'}});",
   cloze:"const l=C.lessons.filter(l=>l.stage==='A1.2'&&!l.reading).find(l=>l.questions.some(q=>q.type==='cloze'));startQuiz('lesson',l.questions,l);quiz.index=l.questions.findIndex(q=>q.type==='cloze');quiz.answers=Array(quiz.index).fill(true);",
   tiles:"const l=C.lessons.find(l=>l.id==='u0l1');startQuiz('lesson',l.questions,l);quiz.index=l.questions.findIndex(q=>q.type==='tiles');quiz.answers=Array(quiz.index).fill(true);",
   dictionary:"actions.lesson({dataset:{id:'u0l0'}});quiz.index=3;quiz.answers=[true,true,true];",
   story:"actions.lesson({dataset:{id:'u0story0'}});",
   feedback:"const l=C.lessons.find(l=>l.id==='u0l1');startQuiz('lesson',l.questions,l);quiz.index=4;quiz.answers=Array(4).fill(true);quiz.selected=JSON.stringify(Structured.selection(Structured.canonical(currentQuestion())).reverse());actions.check();",
   practice:"actions.practiceHub();render();document.querySelector('.practice-catalogue summary')?.click();",
   context:"state.completed=C.lessons.filter(l=>l.stage==='A1.1').map(l=>l.id);state.grammarLevel='A1.1';state.games=G.empty();actions.gameNew();const a=state.games.active,i=a.questions.findIndex(q=>q.blanks.length===1);if(i<0)throw Error('No single-blank game fixture');[a.questions[0],a.questions[i]]=[a.questions[i],a.questions[0]];a.selected=[null];",
   review:"E.recordAnswer(state,C.lessons[0].questions[0],false);actions.reviewHome();",
   profile:"actions.profile();",
   saved:"actions.lesson({dataset:{id:'u0l0'}});quiz.index=3;quiz.answers=[true,true,true];",
   content:"actions.content();",
   completion:"actions.lesson({dataset:{id:'u0l0'}});for(let i=0;i<5;i++){const q=currentQuestion();quiz.selected=Structured.active(q)?Structured.canonical(q):q.answer;actions.check();actions.next();}"
  }[recipe.screen];
  await fixture(sessionId,setup+'render();window.scrollTo(0,0);');
  // Natural card boundaries define the viewport. Long activities use a semantic
  // anchor; no card/text is removed or masked to manufacture a layout.
  const anchor=recipe.anchor||null;
  let end=recipe.end;
  if(recipe.screen==='saved'){
   // Use the same dictionary save interaction as the product, with a known form.
   await fixture(sessionId,"dictionaryUI.close();const w=[...document.querySelectorAll('.choice [data-dictionary-token]')].find(w=>w.textContent==='llamo');w.click();dictionaryUI.saveCurrent();dictionaryUI.close();actions.savedWords();render();");
   await evaluate(sessionId,'new Promise(r=>setTimeout(r,3600))');
  }
  await evaluate(sessionId,'document.fonts.ready');
  const metric=await evaluate(sessionId,`(()=>{const a=${JSON.stringify(anchor)},end=${JSON.stringify(end)},anchor=a?document.querySelector(a):null,target=end?document.querySelector(end):null;const nav=document.querySelector('nav');return {anchor:anchor?anchor.getBoundingClientRect().top+scrollY-24:0,bottom:target?target.getBoundingClientRect().bottom+scrollY:null,nav:nav?nav.getBoundingClientRect().height:0};})()`);
  assert(!end||metric.bottom!==null,recipe.screen+' has capture boundary '+end);
  let height=Math.ceil(metric.bottom===null?824:metric.bottom-metric.anchor+metric.nav+8);height=Math.max(480,height);
  assert(height<=1600,recipe.screen+' needs a shorter meaningful capture boundary ('+height+'px)');
  await send('Emulation.setDeviceMetricsOverride',{width:384,height,deviceScaleFactor:1,mobile:true},sessionId);
  await fixture(sessionId,`document.activeElement?.blur();window.FriendsToAmigosInsets(0,0,0,0,false,0);window.scrollTo(0,${Math.max(0,metric.anchor)});viewport.refresh();`);
  if(recipe.screen==='dictionary')await fixture(sessionId,"const w=[...document.querySelectorAll('.choice [data-dictionary-token]')].find(w=>w.textContent==='llamo');w.click();");
  await evaluate(sessionId,'new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(r,200))))');
  const layout=await evaluate(sessionId,`(()=>{const nav=document.querySelector('nav'),nr=nav?.getBoundingClientRect(),popup=document.querySelector('.dictionary-popup:not([hidden])'),pr=popup?.getBoundingClientRect(),end=${JSON.stringify(end)},target=end?document.querySelector(end):null,r=target?.getBoundingClientRect();const labels=nav?[...nav.querySelectorAll('button')].map(b=>{const c=b.cloneNode(true);c.querySelectorAll('[aria-hidden],.badge').forEach(n=>n.remove());return c.textContent.trim();}):[];return {width:innerWidth,height:innerHeight,scrollY,overflow:document.documentElement.scrollWidth>innerWidth+1,keyboard:document.documentElement.classList.contains('keyboard-open'),insets:['top','bottom','left','right'].map(k=>getComputedStyle(document.documentElement).getPropertyValue('--android-inset-'+k).trim()),navigationLabels:labels,active:nav?.querySelector('.active')?.textContent.trim(),navBottom:nr?.bottom??null,navTop:nr?.top??innerHeight,targetBottom:r?.bottom??null,popupFits:!pr||pr.left>=0&&pr.right<=innerWidth&&pr.top>=0&&pr.bottom<=innerHeight,animations:document.getAnimations().filter(a=>a.playState==='running').length};})()`);
  assert(!layout.overflow,recipe.screen+' no horizontal overflow');assert(!layout.keyboard,recipe.screen+' no accidental keyboard');assert(layout.insets.every(v=>v==='0px'),recipe.screen+' no fake system bar bands');assert(layout.animations===0,recipe.screen+' animations settled');assert(layout.popupFits,recipe.screen+' popup fits');
  assert(JSON.stringify(layout.navigationLabels)===JSON.stringify(recipe.active?Config.navigation:[]),recipe.screen+' visible navigation matches product');if(recipe.active){assert(Math.abs(layout.navBottom-height)<=1,recipe.screen+' nav meets usable viewport edge');assert(layout.active.includes(recipe.active),recipe.screen+' active visible tab');}
  if(end)assert(layout.targetBottom<=layout.navTop+1,recipe.screen+' complete boundary clears nav');
  if(recipe.screen==='profile')assert(await evaluate(sessionId,"document.querySelector('[data-profile-section=vocabulary]').getBoundingClientRect().bottom<=document.querySelector('nav').getBoundingClientRect().top"),'Profile vocabulary fully visible above opaque nav');
  const result=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId),bytes=Buffer.from(result.data,'base64'),dims=PNG.inspect(bytes);assert(dims.width===384&&dims.height===height,recipe.screen+' exact usable viewport');fs.writeFileSync(path.join(dir,recipe.filename),bytes);
  shots.push({filename:recipe.filename,screen:recipe.screen,description:recipe.description,theme:recipe.theme,profile:{name:'clean-app-portrait',width:384,height,deviceScaleFactor:1,insets:{top:0,bottom:0,left:0,right:0},keyboard:false},simulated:true,firstGeneratedVersion:Config.versions(root).appVersion,refreshedInVersion:Config.versions(root).appVersion,reviewedForVersion:Config.versions(root).appVersion,sha256:Config.hash(bytes),layout});
 }
 const manifest={schemaVersion:1,...Config.versions(root),generatedAt:new Date().toISOString(),sourceCommit:/^[a-f0-9]{40}$/.test(process.env.GITHUB_SHA||'')?process.env.GITHUB_SHA:null,validationRun:process.env.GITHUB_RUN_ID?Number(process.env.GITHUB_RUN_ID):null,captureMode:'clean-app-viewport',sourceFingerprint:Config.fingerprint(root),screenshotCount:shots.length,navigationLabels:Config.navigation,screenshots:shots,manualReview:{status:'pending'}};
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log('Showcase capture passed: '+shots.length+' clean app viewports, '+assertions+' semantic/geometry assertions. Review/adopt these images before publishing.');
}
module.exports={capture};
if(require.main===module){process.argv.push('--showcase-only');require('./browser-check.cjs');}
