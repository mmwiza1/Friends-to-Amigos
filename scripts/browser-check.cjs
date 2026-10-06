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
   actions.profile();render();document.querySelector('#name').focus();window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,true,0);await frame();assert(getComputedStyle(document.querySelector('nav')).display==='none','navigation hidden while native keyboard open');
   window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,false,0);await frame();assert(getComputedStyle(document.querySelector('nav')).display!=='none','native keyboard close restores navigation even with field focus');document.querySelector('#name').blur();
   const lesson=C.lessons[0],textIndex=lesson.questions.findIndex(q=>q.type==='text');startQuiz('lesson',lesson.questions,lesson);quiz.index=textIndex;render();window.scrollTo(0,0);
   let input=document.querySelector('#written-answer');assert(input.enterKeyHint==='go','Go keyboard hint');input.focus();input.value='Mi llamo Ana';input.dispatchEvent(new Event('input',{bubbles:true}));
   window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,Boolean(config.keyboard),config.overlap||0);await frame();
   assert(document.documentElement.classList.contains('keyboard-open')===Boolean(config.keyboard),'native keyboard state controls focused input layout');
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
   // Exercise five-tab navigation and a saved game in the same real layout.
   window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,false,0);actions.leave();
   state.completed=C.lessons.map(l=>l.id);actions.tab({dataset:{tab:'Games'}});render();window.scrollTo(0,0);await frame();
   const tabs=[...document.querySelectorAll('nav button')];assert(tabs.length===5,'five navigation tabs');assert(tabs.every(e=>e.getBoundingClientRect().width>=44&&e.getBoundingClientRect().height>=44),'five nav touch targets');
   assert(document.querySelector('nav').getBoundingClientRect().bottom<=innerHeight-config.bottom+1,'Games navigation clears system bar');
   assert(FriendsToAmigos.handleBack()&&tab==='Home','Games Back returns Home');actions.tab({dataset:{tab:'Games'}});actions.gameNew();render();await frame();
   assert(state.games.active.questions.length===10,'10-question game');assert(document.querySelectorAll('[role=radiogroup]').length===state.games.active.questions[0].blanks.length,'labelled groups for all blanks');
   let option=document.querySelector('[data-action=gameAnswer]');option.click();await frame();assert(document.activeElement.matches('[data-action=gameAnswer]'),'game selection retains focus');
   document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));assert(document.activeElement.dataset.index==='1','game radio keyboard navigation');
   assert(FriendsToAmigos.handleBack()&&tab==='Games'&&screen==='main','game Back saves and returns Games');assert(document.querySelector('[data-action=gameResume]'),'saved game resume action');actions.gameResume();render();
   for(let i=0;i<10;i++){
    const q=state.games.active.questions[state.games.active.index];q.blanks.forEach((blank,j)=>{const wanted=i===0&&j===0?blank.options.find(x=>x!==blank.answer):blank.answer;document.querySelector('[data-action=gameAnswer][data-blank="'+j+'"][data-index="'+blank.options.indexOf(wanted)+'"]').click();});
    document.querySelector('[data-action=gameCheck]').click();if(i===0){assert(document.querySelector('.feedback').textContent.includes('You chose:'),'game feedback shows chosen verb');assert(document.querySelector('.feedback').textContent.includes('A natural answer:'),'game feedback shows correct verb');}
    window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert(document.querySelector('[data-action=gameNext]').getBoundingClientRect().bottom<=innerHeight-config.bottom+1,'game feedback Next remains reachable');document.querySelector('[data-action=gameNext]').click();
   }
   assert(screen==='gameResult'&&gameResult.score===9,'complete game score');assert(document.querySelector('[data-action=gameMistakes]'),'focused mistake practice offered');
   assert(state.completed.length===144,'game leaves course completion unchanged');actions.gameMistakes();render();assert(state.games.active.mode==='mistakes'&&state.games.active.questions.length>0&&state.games.active.questions.length<=5,'short eligible mistake practice');FriendsToAmigos.handleBack();
   state.games.active=null;actions.gameChallenge();render();assert(state.games.active.mode==='challenge','Challenge launches');FriendsToAmigos.handleBack();
   assert(document.documentElement.scrollWidth<=innerWidth+1,'game has no horizontal overflow');
   actions.home();startQuiz('lesson',lesson.questions,lesson);quiz.answers=quiz.questions.map(()=>true);quiz.index=quiz.questions.length;render();assert(document.querySelector('[data-action=continueLearning]'),'passed lesson Continue learning');actions.continueLearning();render();assert(quiz.kind==='review','completed course gives due review priority');state.reviews={};startQuiz('lesson',lesson.questions,lesson);quiz.answers=quiz.questions.map(()=>true);quiz.index=quiz.questions.length;render();actions.continueLearning();render();assert(quiz.kind==='practice'&&quiz.questions[0].listening,'completed course continues to listening maintenance');
   startQuiz('lesson',lesson.questions,lesson);quiz.answers=quiz.questions.map(()=>false);quiz.index=quiz.questions.length;render();assert(!document.querySelector('[data-action=continueLearning]'),'failed lesson has no forward Continue');assert(document.querySelector('[data-action=lessonMistakes]'),'failed lesson offers mistake review');
   startQuiz('lesson',lesson.questions,lesson);
   // Leave a representative written question ready for visual inspection.
   quiz.index=textIndex;quiz.selected=null;quiz.checked=false;quiz.answers=[];render();window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,Boolean(config.keyboard),config.overlap||0);
   if(config.keyboard){document.querySelector('#written-answer').focus();await frame();}else window.scrollTo(0,0);
   return {scenario:config.name,width:innerWidth,height:innerHeight,dark:config.dark,nativeInsets:true,simulatedKeyboard:Boolean(config.keyboard),checks};
  })()`);
  const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);fs.writeFileSync(path.join(output,config.name+'.png'),Buffer.from(screenshot.data,'base64'));totalChecks+=report.checks;console.log('PASS '+config.name+' ('+report.checks+' checks)');fs.writeFileSync(path.join(output,config.name+'.json'),JSON.stringify(report,null,2));
  if(['s24-dark-buttons','narrow-light-buttons'].includes(config.name)){
   await evaluate(sessionId,`(async()=>{window.FriendsToAmigosInsets(24,${config.bottom},${config.left||0},0,false,0);actions.leave();actions.tab({dataset:{tab:'Games'}});render();window.scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));})()`);
   for(const view of ['games','round','feedback']){
    if(view==='round')await evaluate(sessionId,"actions.gameResume();render();window.scrollTo(0,0);");
    if(view==='feedback')await evaluate(sessionId,"state.games.active.selected=state.games.active.questions[state.games.active.index].blanks.map(b=>b.options.find(x=>x!==b.answer));actions.gameCheck();render();window.scrollTo(0,document.documentElement.scrollHeight);");
    await evaluate(sessionId,"document.querySelectorAll('.toast').forEach(e=>e.remove());new Promise(r=>setTimeout(r,250))");
    const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);fs.writeFileSync(path.join(output,config.name+'-'+view+'.png'),Buffer.from(shot.data,'base64'));
   }
  }

 }
 console.log('Browser checks passed: '+scenarios.length+' layouts, '+totalChecks+' layout/interaction assertions. Native insets/keyboard are simulated, not device-tested.');
}
run().catch(error=>{console.error(error.stack);process.exitCode=1;}).finally(async()=>{
 // Chrome must stop writing its profile before cleanup removes it.
 if(child.pid&&child.exitCode===null&&child.signalCode===null)await new Promise(resolve=>{child.once('close',resolve);child.kill();});
 fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
});
