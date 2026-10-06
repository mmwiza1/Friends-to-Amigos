'use strict';
// Real Chromium layout/interaction checks using its native DevTools pipe.
// No browser automation package or server is required.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(p=>fs.existsSync(p));
if(!chrome)throw Error('Install Chromium/Chrome or set CHROME_BIN to run browser checks.');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'fta-browser-')),output=path.resolve('browser-reports');fs.mkdirSync(output,{recursive:true});
const child=spawn(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-background-networking','--no-first-run','--remote-debugging-pipe','--user-data-dir='+profile],{stdio:['ignore','ignore','pipe','pipe','pipe']});
let counter=0,buffer='',errors='';const pending=new Map();
child.stderr.on('data',chunk=>{errors=(errors+chunk).slice(-4000);});
for(const pipe of [child.stdio[3],child.stdio[4]])pipe.on('error',error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(Error(error.message+': '+errors));}pending.clear();});
child.on('error',error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(error);}pending.clear();});
child.stdio[4].on('data',chunk=>{buffer+=chunk;let end;while((end=buffer.indexOf('\0'))!==-1){const part=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!part)continue;const message=JSON.parse(part),entry=pending.get(message.id);if(entry){clearTimeout(entry.timer);pending.delete(message.id);message.error?entry.reject(Error(JSON.stringify(message.error))):entry.resolve(message.result);}}});
child.on('exit',code=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(Error('Chrome exited '+code+': '+errors));}pending.clear();});
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++counter,timer=setTimeout(()=>{pending.delete(id);reject(Error('DevTools timeout: '+method));},15000);pending.set(id,{resolve,reject,timer});child.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');});}
async function evaluate(session,expression){const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},session);if(result.exceptionDetails)throw Error(result.exceptionDetails.text+': '+(result.exceptionDetails.exception?.description||''));return result.result.value;}
async function run(){
 const {targetId}=await send('Target.createTarget',{url:'about:blank'}),{sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});await send('Page.enable',{},sessionId);
 const scenarios=[
  {name:'narrow-light-buttons',width:320,height:740,dark:false,bottom:48},
  {name:'small-dark-gesture',width:360,height:800,dark:true,bottom:24},
  {name:'s24-light-buttons',width:384,height:824,dark:false,bottom:48},
  {name:'s24-dark-buttons',width:384,height:824,dark:true,bottom:48},
  {name:'s24-dark-gesture',width:384,height:824,dark:true,bottom:24},
  {name:'large-light-gesture',width:480,height:920,dark:false,bottom:24},
  {name:'landscape-dark-cutout',width:780,height:384,dark:true,bottom:24,left:32},
  {name:'s24-dark-keyboard-resized',width:384,height:470,dark:true,bottom:48,keyboard:true},
  {name:'narrow-light-keyboard-resized',width:320,height:430,dark:false,bottom:24,keyboard:true},
  {name:'s24-dark-keyboard-overlap',width:384,height:824,dark:true,bottom:48,keyboard:true,overlap:340}
 ];
 let totalChecks=0;
 for(const config of scenarios){
  await send('Emulation.setDeviceMetricsOverride',{width:config.width,height:config.height,deviceScaleFactor:1,mobile:true},sessionId);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:config.dark?'dark':'light'}]},sessionId);
  await send('Page.navigate',{url:'file://'+path.resolve('www/index.html')},sessionId);
  await evaluate(sessionId,`new Promise((resolve,reject)=>{const started=Date.now();function ready(){if(window.FriendsToAmigos&&window.ViewportTools)resolve(true);else if(Date.now()-started>5000)reject(Error('App did not load'));else setTimeout(ready,10);}ready();})`);
  const report=await evaluate(sessionId,`(async()=>{
   let checks=0;const config=${JSON.stringify(config)},assert=(ok,message)=>{checks++;if(!ok)throw Error(config.name+': '+message);},frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   localStorage.clear();state=E.fresh();state.onboarded=true;storageContext={readOnly:false};screen='main';tab='Learn';viewStage='A1.2';quiz=null;render();
   window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,false,0);await frame();
   assert(innerWidth===config.width&&innerHeight===config.height,'exact phone viewport');
   const nav=document.querySelector('nav'),rect=nav.getBoundingClientRect();assert(Math.abs(rect.bottom-(innerHeight-config.bottom))<2,'navigation clears native system bar');
   assert(document.querySelector('header').getBoundingClientRect().top>=24,'header clears status bar');
   assert(document.documentElement.scrollWidth<=innerWidth+1,'no horizontal overflow');
   window.scrollTo(0,document.documentElement.scrollHeight);await frame();
   const last=[...document.querySelectorAll('#app button')].filter(e=>!e.closest('nav')).at(-1);assert(last.getBoundingClientRect().bottom<=rect.top+1,'last content reachable above fixed navigation');
   toast('Layout check');assert(document.querySelector('.toast').getBoundingClientRect().top>=24,'toast clears status bar');
   const lesson=C.lessons[0],textIndex=lesson.questions.findIndex(q=>q.type==='text');startQuiz('lesson',lesson.questions,lesson);quiz.index=textIndex;render();window.scrollTo(0,0);
   let input=document.querySelector('#written-answer');assert(input.enterKeyHint==='go','Go keyboard hint');input.focus();input.value='Mi llamo Ana';input.dispatchEvent(new Event('input',{bubbles:true}));
   window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,Boolean(config.keyboard),config.overlap||0);await frame();
   assert(document.documentElement.classList.contains('keyboard-open'),'focused input uses keyboard layout');
   assert(input.getBoundingClientRect().bottom<=innerHeight-(config.overlap||0)+1,'focused answer visible above keyboard');
   const check=document.querySelector('#check-answer');window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert(check.getBoundingClientRect().bottom<=innerHeight-(config.overlap||0)+1,'Check button can scroll above keyboard');
   input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));await frame();assert(quiz.checked&&quiz.answers.length===1,'Go uses existing check flow');
   document.querySelector('#written-answer').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(quiz.answers.length===1,'Go cannot double submit');
   const feedback=document.querySelector('.feedback');assert(feedback.textContent.includes('Mi llamo Ana')&&feedback.textContent.includes('Me llamo Ana'),'learner and model feedback');assert(feedback.querySelector('mark'),'difference underlined');
   window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,false,0);actions.home();render();await frame();assert(!document.documentElement.classList.contains('keyboard-open'),'removed input does not leave keyboard layout stuck');assert(getComputedStyle(document.querySelector('nav')).display!=='none','main navigation restored');
   startQuiz('lesson',lesson.questions,lesson);let radio=document.querySelector('[role=radio]');radio.focus();radio.click();await frame();assert(document.activeElement.matches('[role=radio]'),'selection retains radio focus');
   assert(document.querySelector('[aria-checked=true][role=radio]'),'choice selection is explicit');document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}));assert(document.activeElement.dataset.index==='1','radio arrow navigation after selection');
   assert(getComputedStyle(document.querySelector('.option-indicator')).width==='22px','visible radio indicator');assert(document.querySelector('#exercise-instruction').textContent==='Choose one answer','explicit choice action');
   assert(matchMedia('(prefers-color-scheme: dark)').matches===config.dark,'system colour preference');
   // Leave a representative written question ready for visual inspection.
   quiz.index=textIndex;quiz.selected=null;quiz.checked=false;quiz.answers=[];render();window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,Boolean(config.keyboard),config.overlap||0);
   if(config.keyboard){document.querySelector('#written-answer').focus();await frame();}else window.scrollTo(0,0);
   return {scenario:config.name,width:innerWidth,height:innerHeight,dark:config.dark,nativeInsets:true,simulatedKeyboard:Boolean(config.keyboard),checks};
  })()`);
  const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);fs.writeFileSync(path.join(output,config.name+'.png'),Buffer.from(screenshot.data,'base64'));totalChecks+=report.checks;console.log('PASS '+config.name+' ('+report.checks+' checks)');fs.writeFileSync(path.join(output,config.name+'.json'),JSON.stringify(report,null,2));
 }
 console.log('Browser checks passed: '+scenarios.length+' layouts, '+totalChecks+' layout/interaction assertions. Native insets/keyboard are simulated, not device-tested.');
}
run().catch(error=>{console.error(error.stack);process.exitCode=1;}).finally(()=>{child.kill();fs.rmSync(profile,{recursive:true,force:true});});
