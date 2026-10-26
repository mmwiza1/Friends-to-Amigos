'use strict';
// Real Chromium layout/interaction checks using its native DevTools pipe.
// No browser automation package or server is required.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(p=>fs.existsSync(p));
if(!chrome)throw Error('Install Chromium/Chrome or set CHROME_BIN to run browser checks.');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'fta-browser-')),output=path.resolve('browser-reports');fs.mkdirSync(output,{recursive:true});
const child=spawn(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--no-first-run','--remote-debugging-pipe','--user-data-dir='+profile],{stdio:['ignore','ignore','pipe','pipe','pipe']});
let counter=0,buffer='',errors='';const pending=new Map();
child.stderr.on('data',chunk=>{errors=(errors+chunk).slice(-4000);});
for(const pipe of [child.stdio[3],child.stdio[4]])pipe.on('error',error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(Error(error.message+': '+errors));}pending.clear();});
child.on('error',error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(error);}pending.clear();});
child.stdio[4].on('data',chunk=>{buffer+=chunk;let end;while((end=buffer.indexOf('\0'))!==-1){const part=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!part)continue;const message=JSON.parse(part);if(message.method==='Runtime.exceptionThrown')console.error('Browser exception:',message.params.exceptionDetails.exception?.description||message.params.exceptionDetails.text);const entry=pending.get(message.id);if(entry){clearTimeout(entry.timer);pending.delete(message.id);message.error?entry.reject(Error(JSON.stringify(message.error))):entry.resolve(message.result);}}});
child.on('exit',code=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(Error('Chrome exited '+code+': '+errors));}pending.clear();});
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++counter,timer=setTimeout(()=>{pending.delete(id);reject(Error('DevTools timeout: '+method+': '+errors));},['Browser.getVersion','Target.createTarget','Runtime.evaluate'].includes(method)?120000:15000);pending.set(id,{resolve,reject,timer});child.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');});}
async function evaluate(session,expression){const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},session);if(result.exceptionDetails)throw Error(result.exceptionDetails.text+': '+(result.exceptionDetails.exception?.description||''));return result.result.value;}
// Screenshot setup has a private lexical scope on every evaluation; CDP retains
// top-level const declarations between calls, so shared names must never leak.
async function fixture(session,statements){return evaluate(session,'(()=>{'+statements+'})()');}
async function run(){ // Wait for the browser process before creating its first page; UI assertions retain their existing timeout.
 await send('Browser.getVersion');
 const {targetId}=await send('Target.createTarget',{url:'about:blank'}),{sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});await send('Page.enable',{},sessionId);await send('Runtime.enable',{},sessionId);
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
  {name:'s24-dark-keyboard-overlap',width:384,height:824,dark:true,bottom:48,keyboard:true,overlap:340},
  {name:'s24-dark-large-text',width:384,height:824,dark:true,bottom:48,fontScale:1.25},
  // Named Samsung profiles exercise CSS viewports and actual environment variations, not device resolutions.
  {name:'galaxy-s22-light-three-button',width:360,height:780,dark:false,top:28,bottom:48,right:4},
  {name:'galaxy-s24-dark-gesture-overlay-ime',width:360,height:800,dark:true,top:28,bottom:24,keyboard:true,overlap:310},
  {name:'galaxy-s25-dark-large-text-cutout',width:360,height:800,dark:true,top:36,bottom:24,left:8,right:8,fontScale:1.35},
  {name:'galaxy-s25-light-landscape-cutout',width:760,height:360,dark:false,top:20,bottom:24,left:34,right:16,fontScale:1.2}
 ];
 let totalChecks=0;
 for(const config of scenarios){
  await send('Emulation.setDeviceMetricsOverride',{width:config.width,height:config.height,deviceScaleFactor:1,mobile:true},sessionId);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:config.dark?'dark':'light'}]},sessionId);
  const navigation=await send('Page.navigate',{url:'file://'+path.resolve('www/index.html')},sessionId);if(navigation.errorText)throw Error('Navigation failed: '+navigation.errorText);
  await evaluate(sessionId,`new Promise((resolve,reject)=>{const started=Date.now();function ready(){if(window.FriendsToAmigos&&window.ViewportTools)resolve(true);else if(Date.now()-started>5000)reject(Error('App did not load'));else setTimeout(ready,10);}ready();})`);
  const report=await evaluate(sessionId,`(async()=>{
   const liveCourse={numbers:C.numbers,time:C.time,lessons:C.lessons,listeningPractice:C.listeningPractice,speakingPractice:C.speakingPractice,assessmentChanges:C.assessmentChanges};delete C.assessmentChanges;C.numbers=C.numbers.map(AssessmentPolicy.prior);C.time=C.time.map(AssessmentPolicy.prior);C.lessons=C.lessons.map(l=>({...l,questions:l.questions.map(AssessmentPolicy.prior)}));C.listeningPractice=C.listeningPractice.map(AssessmentPolicy.prior);C.speakingPractice=C.speakingPractice.map(AssessmentPolicy.prior);
   let checks=0;const config=${JSON.stringify(config)},assert=(ok,message)=>{checks++;if(!ok)throw Error(config.name+': '+message);},frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   document.documentElement.style.fontSize=((config.fontScale||1)*16)+'px';document.body.style.fontSize=((config.fontScale||1)*16)+'px';localStorage.clear();state=E.fresh();state.onboarded=true;storageContext={readOnly:false};screen='main';tab='Learn';viewStage='A1.2';quiz=null;render();
   window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);await frame();
   assert(innerWidth===config.width&&innerHeight===config.height,'exact phone viewport');
   const nav=document.querySelector('nav'),rect=nav.getBoundingClientRect();assert(Math.abs(rect.bottom-(innerHeight-config.bottom))<2,'navigation clears native system bar');
   assert(document.querySelector('header').getBoundingClientRect().top>=(config.top||24),'header clears status bar');
   assert(document.documentElement.scrollWidth<=innerWidth+1,'no horizontal overflow');
   window.scrollTo(0,document.documentElement.scrollHeight);await frame();
   const last=[...document.querySelectorAll('#app button')].filter(e=>!e.closest('nav')).at(-1);assert(last.getBoundingClientRect().bottom<=rect.top+1,'last content reachable above fixed navigation');
   toast('Layout check');assert(document.querySelector('.toast').getBoundingClientRect().top>=(config.top||24),'toast clears status bar');
   actions.profile();render();document.querySelector('#name').focus();window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,true,0);await frame();assert(getComputedStyle(document.querySelector('nav')).display==='none','navigation hidden while native keyboard open');
   window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);await frame();assert(getComputedStyle(document.querySelector('nav')).display!=='none','native keyboard close restores navigation even with field focus');document.querySelector('#name').blur();
   const lesson=C.lessons[0],textLesson=C.lessons.find(l=>l.stage==='A1.1'&&l.questions.some(q=>q.type==='text'&&q.answer==='Me llamo Ana')),textIndex=textLesson.questions.findIndex(q=>q.type==='text'&&q.answer==='Me llamo Ana');startQuiz('lesson',textLesson.questions,textLesson);quiz.index=textIndex;render();window.scrollTo(0,0);
   let input=document.querySelector('#written-answer');assert(input.enterKeyHint==='go','Go keyboard hint');input.focus();input.value='Mi llamo Ana';input.dispatchEvent(new Event('input',{bubbles:true}));
   window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,Boolean(config.keyboard),config.overlap||0);await frame();
   assert(document.documentElement.classList.contains('keyboard-open')===Boolean(config.keyboard),'native keyboard state controls focused input layout');
   assert(input.getBoundingClientRect().bottom<=innerHeight-(config.overlap||0)+1,'focused answer visible above keyboard');
   const check=document.querySelector('#check-answer');window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert(check.getBoundingClientRect().bottom<=innerHeight-(config.overlap||0)+1,'Check button can scroll above keyboard');
   input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));await frame();assert(quiz.checked&&quiz.answers.length===1,'Go uses existing check flow');
   document.querySelector('#written-answer').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(quiz.answers.length===1,'Go cannot double submit');
   const feedback=document.querySelector('.feedback');assert(feedback.textContent.includes('Mi llamo Ana')&&feedback.textContent.includes('Me llamo Ana'),'learner and model feedback');assert(feedback.querySelector('mark'),'difference underlined');
   window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);actions.home();render();await frame();assert(!document.documentElement.classList.contains('keyboard-open'),'removed input does not leave keyboard layout stuck');assert(getComputedStyle(document.querySelector('nav')).display!=='none','main navigation restored');
   startQuiz('lesson',lesson.questions,lesson);let radio=document.querySelector('[role=radio]');radio.focus();radio.click();await frame();assert(document.activeElement.matches('[role=radio]'),'selection retains radio focus');
   assert(document.querySelector('[aria-checked=true][role=radio]'),'choice selection is explicit');document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}));assert(document.activeElement.dataset.index==='1','radio arrow navigation after selection');
   assert(getComputedStyle(document.querySelector('.option-indicator')).width==='22px','visible radio indicator');assert(document.querySelector('#exercise-instruction').textContent==='Choose one answer','explicit choice action');
   assert(matchMedia('(prefers-color-scheme: dark)').matches===config.dark,'system colour preference');
   // Exercise five-tab navigation and a saved game in the same real layout.
   window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);actions.leave();
   state.completed=C.lessons.map(l=>l.id);state.stage='A2.1';actions.tab({dataset:{tab:'Games'}});render();window.scrollTo(0,0);await frame();
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
   assert(state.completed.length===C.lessons.length,'game leaves course completion unchanged');actions.gameMistakes();render();assert(state.games.active.mode==='mistakes'&&state.games.active.questions.length>0&&state.games.active.questions.length<=5,'short eligible mistake practice');FriendsToAmigos.handleBack();
   state.games.active=null;actions.gameChallenge();render();assert(state.games.active.mode==='challenge','Challenge launches');FriendsToAmigos.handleBack();
   assert(document.documentElement.scrollWidth<=innerWidth+1,'game has no horizontal overflow');
   actions.home();startQuiz('lesson',lesson.questions,lesson);quiz.answers=quiz.questions.map(()=>true);quiz.index=quiz.questions.length;render();assert(document.querySelector('[data-action=continueLearning]'),'passed lesson Continue learning');actions.continueLearning();render();assert(quiz.kind==='review','completed course gives due review priority');state.reviews={};startQuiz('lesson',lesson.questions,lesson);quiz.answers=quiz.questions.map(()=>true);quiz.index=quiz.questions.length;render();actions.continueLearning();render();assert(quiz.kind==='practice'&&quiz.questions[0].listening,'completed course continues to listening maintenance');
   startQuiz('lesson',lesson.questions,lesson);quiz.answers=quiz.questions.map(()=>false);quiz.index=quiz.questions.length;render();assert(!document.querySelector('[data-action=continueLearning]'),'failed lesson has no forward Continue');assert(document.querySelector('[data-action=lessonMistakes]'),'failed lesson offers mistake review');
   actions.home();actions.blanksOpen();render();await frame();assert(document.querySelector('#table-count').options.length===5,'five bounded practice sizes');assert(document.querySelector('#table-scope').options.length===5,'recommended, current, all, unit and custom practice scopes');assert(document.documentElement.scrollWidth<=innerWidth+1,'table config does not overflow');
   actions.blanksNormal();render();await frame();assert(state.blanks.active.tables.length===3,'normal game has three tables');assert(document.querySelectorAll('[role=rowheader]').length===6,'six fixed person rows');assert([...document.querySelectorAll('[role=rowheader]')].some(e=>e.textContent==='vosotros/as'),'Spain plural person visible');assert(document.querySelector('[data-action=blanksCheck]').disabled,'unfilled table locked');assert(document.documentElement.scrollWidth<=innerWidth+1,'table fits phone without horizontal scroll');
   const beforeCourse=state.completed.length,beforeEvents=state.events.length;
   for(let tableIndex=0;tableIndex<3;tableIndex++){
    const a=state.blanks.active,t=a.tables[a.index];a.selected=t.rows.map((row,j)=>tableIndex===0&&j===0?t.options[j].find(v=>v!==t.target.forms[row]):t.target.forms[row]);actions.blanksCheck();render();await frame();
    if(tableIndex===0){assert(document.querySelector('.feedback').textContent.includes('You wrote/chose:'),'table feedback retains own answer');assert(document.querySelector('.feedback').textContent.includes('A natural answer:'),'table feedback shows model');assert(document.querySelector('.feedback').textContent.includes('belongs to'),'table feedback identifies wrong person');assert(FriendsToAmigos.handleBack()&&screen==='main'&&tab==='Games','table Back saves to Games');actions.blanksResume();render();assert(state.blanks.active.checked,'checked table resumes exactly');}
    window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert(document.querySelector('[data-action=blanksNext]').getBoundingClientRect().bottom<=innerHeight-config.bottom+1,'table Next is scrollably reachable');actions.blanksNext();render();
   }
   assert(screen==='blanksResult'&&blanksResult.tables===3,'normal table session completes');assert(document.querySelector('[data-action=blanksMistakes]'),'table mistake practice offered');assert(state.completed.length===beforeCourse&&state.events.length===beforeEvents,'tables do not manufacture course progress');
   actions.blanksLeave();actions.blanksOpen();render();document.querySelector('#table-count').value='20';document.querySelector('#table-scope').value='all';document.querySelector('#table-entry').value='text';actions.blanksPractice();render();assert(state.blanks.active.tables.length===20,'twenty-table maximum practice');
   const table=state.blanks.active.tables[0];let tableInput=document.querySelector('.table-input');tableInput.focus();window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,Boolean(config.keyboard),config.overlap||0);await frame();assert(tableInput.getBoundingClientRect().bottom<=innerHeight-(config.overlap||0)+1,'table recall stays above keyboard');
   const htmlBefore=document.querySelector('#app').innerHTML;tableInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(!state.blanks.active.checked&&document.querySelector('#app').innerHTML===htmlBefore,'empty table Go does not submit or replace input');
   table.rows.forEach((row,j)=>{const input=document.querySelector('#form-'+j);input.value=j===0?'wrong form':table.target.forms[row];input.dispatchEvent(new Event('input',{bubbles:true}));});tableInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(state.blanks.active.checked,'table Go checks populated recall');assert(document.querySelector('.feedback').textContent.includes('wrong form'),'typed table feedback keeps answer');
   const resultCount=state.blanks.active.results.length;document.querySelector('[data-action=blanksCheck]')?.click();assert(state.blanks.active.results.length===resultCount,'table cannot double check');FriendsToAmigos.handleBack();window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);
   actions.weakAreas();render();assert(document.querySelector('h2').textContent==='Weak Areas / Mistakes','connected weakness screen');assert(FriendsToAmigos.handleBack()&&tab==='Review','weakness Back returns Review');actions.home();render();assert(document.querySelector('[data-action=dailyReview]'),'daily review is easy to find');
   startQuiz('lesson',lesson.questions,lesson);
   // Preserve the independent written-answer journey after the intentional beginner ramp.
   startQuiz('lesson',textLesson.questions,textLesson);quiz.index=textIndex;quiz.selected=null;quiz.checked=false;quiz.answers=[];render();window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,Boolean(config.keyboard),config.overlap||0);
   if(config.keyboard){document.querySelector('#written-answer').focus();await frame();}else window.scrollTo(0,0);
   // Focused media uses the actual browser DOM; synthetic speech start is simulated, not acoustically assessed.
   const utterances=[];media.stop();media=SpeechTools.create({SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak(u){utterances.push(u);}}},toast);
   state.focused=F.empty();quiz=null;screen='main';tab='Home';listenRate=.75;actions.mediaPractice({dataset:{kind:'listening',stage:'A2.1'}});render();window.scrollTo(0,0);await frame();
   assert(quiz.questions.length===10&&new Set(quiz.questions.map(q=>q.id)).size===10,'ten unique focused listening questions');
   assert(document.querySelector('.listening').textContent.includes('Listen to familiar Spanish'),'first-use listening guidance');assert(!document.querySelector('details>summary')?.textContent.includes('Spanish transcript'),'no initial transcript');
   for(let i=0;i<10;i++){
    const q=currentQuestion();assert(!document.querySelector('.listening').textContent.includes(q.listening.transcript),'transcript hidden before attempt '+i);
    actions.listen();render();assert(!quiz.audioPlayed,'delayed speech does not unlock '+i);utterances.at(-1).onstart();assert(quiz.audioPlayed,'actual simulated start unlocks '+i);
    if(i===0){assert(utterances.at(-1).lang==='es-ES'&&utterances.at(-1).rate===.75,'Spain slow listening');actions.listenSpeed({dataset:{rate:'1'}});actions.listen();render();utterances.at(-1).onstart();assert(utterances.at(-1).rate===1,'normal listening rate');assert(!document.querySelector('.listening').textContent.includes(q.listening.transcript),'audio start alone does not reveal transcript');}
    const value=i<8?(q.type==='text'?q.accepted[0]:q.answer):q.type==='text'?'wrong response':q.options.find(x=>x!==q.answer);
    if(q.type==='text'){const input=document.querySelector('#written-answer');input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));}else {actions.answer({dataset:{index:String(q.options.indexOf(value))}});actions.check();render();}
    assert(quiz.checked,'focused listening answer checks '+i);assert(document.querySelector('.listening').textContent.includes(q.listening.transcript),'transcript revealed after attempt '+i);
    if(i===0){const id=q.id;assert(FriendsToAmigos.handleBack(),'focused listening Back handled');assert(state.focused.active.checked,'listening checked attempt saved');actions.focusedResume();render();assert(currentQuestion().id===id&&quiz.checked,'listening resumes same snapshot');}
    if(i===1)assert(document.querySelector('.compact-media')&&document.querySelector('.media-info'),'compact listening keeps information access');
    actions.next();render();
   }
   assert(screen==='focusedResult'&&document.querySelector('#app').textContent.includes('8/10 correct'),'listening result summary');assert(state.focused.history.at(-1).needs===2,'listening errors reinforced');
   window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert(document.querySelector('[data-action=home]').getBoundingClientRect().bottom<=innerHeight-config.bottom+1,'focused result Home reachable');actions.home();render();assert(document.querySelector('nav').getBoundingClientRect().bottom<=innerHeight-config.bottom+1,'focused Home restores safe navigation');
   actions.mediaPractice({dataset:{kind:'speaking',stage:'A2.1'}});render();assert(quiz.questions.length===10,'ten speaking prompts');assert(document.querySelector('#app').textContent.includes('does not record'),'first-use no-recording explanation');
   for(let i=0;i<10;i++){
    const q=currentQuestion();assert(![...document.querySelectorAll('[lang=es]')].some(e=>e.textContent===q.spanish),'speaking model hidden '+i);actions.revealModel();render();assert(document.querySelector('#app').textContent.includes('One possible response'),'speaking model labelled as possible '+i);
    if(i===0){actions.speak();assert(utterances.at(-1).text===q.spanish,'model uses existing speech');assert(FriendsToAmigos.handleBack(),'speaking Back handled');actions.focusedResume();render();assert(quiz.modelRevealed&&currentQuestion().id===q.id,'speaking reveal resumes');}
    actions.selfAssess({dataset:{result:i<7?'got':'needs'}});render();assert(quiz.answers.length===i+1,'speaking single self-assessment '+i);actions.selfAssess({dataset:{result:'got'}});assert(quiz.answers.length===i+1,'speaking cannot double submit '+i);actions.next();render();
    if(i===0)assert(document.querySelector('#app').textContent.includes('Say it aloud, then reveal')&&document.querySelector('.media-info'),'compact speaking retains self-assessment info');
   }
   assert(screen==='focusedResult'&&document.querySelector('#app').textContent.includes('7 “I got it”')&&document.querySelector('#app').textContent.includes('3 “Needs practice”'),'speaking judgment summary');assert(!document.querySelector('#app').textContent.includes('/10 correct'),'no fake speaking accuracy');assert(state.completed.length===beforeCourse,'focused modes cannot complete course activities');
   state.mastery=M.empty();FocusedBank.items.filter(q=>q.practice.kind==='speaking'&&q.practice.stage==='A1.2'&&q.practice.unit===0).slice(0,2).forEach((q,i)=>F.record(state,q,false,{session:'browser-weak-'+i}));actions.weakAreas();render();assert(document.querySelector('#app').textContent.includes('Speaking ·'),'speaking weaknesses readable');actions.home();render();
   // Amendment journeys: no teaching prerequisites; actual DOM controls on
   // every phone/landscape/theme layout. Native speech start stays simulated.
   window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);window.confirm=()=>true;
   for(const level of ['A1.1','A1.2','A2.1','A2.2']){
    state={...E.fresh(),stage:level,onboarded:true};quiz=null;screen='main';tab='Games';render();window.scrollTo(0,0);await frame();
    assert(document.querySelector('#grammar-level').value===level,'explicit grammar ceiling '+level);
    assert(!document.querySelector('[data-action=gameNew]').disabled,'fresh playable sentence card '+level);
    document.querySelector('[data-action=gameNew]').click();assert(state.games.active.questions.length===10,'zero-completion ten questions '+level);
    assert(state.games.active.questions.every(q=>GrammarSyllabus.allowed(state,q.stage)),'sentence ceiling '+level);
    assert(state.completed.length===0&&state.capabilities.length===0,'no fabricated course progress '+level);
    FriendsToAmigos.handleBack();document.querySelector('[data-action=blanksOpen]').click();
    assert(!document.querySelector('[data-action=blanksNormal]').disabled,'fresh playable table card '+level);
    document.querySelector('[data-action=blanksNormal]').click();assert(state.blanks.active.tables.length===3,'fresh three tables '+level);
    assert(state.blanks.active.tables.every(t=>t.rows.length===2),'selected level does not imply mastery '+level);
    assert(state.blanks.active.tables.some(t=>t.target.stage===level),'current-level table represented '+level);
    assert(document.querySelectorAll('[role=rowheader]').length===6,'six-person table on fresh profile '+level);
    assert(document.documentElement.scrollWidth<=innerWidth+1,'fresh table mobile width '+level);FriendsToAmigos.handleBack();
   }
   // Lowering a ceiling pauses higher snapshots without erasing them.
   const savedGame=JSON.stringify(state.games.active),savedTables=JSON.stringify(state.blanks.active);
   document.querySelector('#grammar-level').value='A1.1';document.querySelector('[data-action=grammarLevel]').click();
   assert(state.grammarLevel==='A1.1','lowered grammar level saved');document.querySelector('[data-action=gameResume]').click();
   assert(screen==='main'&&JSON.stringify(state.games.active)===savedGame,'higher game kept while lowered');actions.blanksResume();render();
   assert(screen==='main'&&JSON.stringify(state.blanks.active)===savedTables,'higher tables kept while lowered');
   document.querySelector('#grammar-level').value='A2.2';document.querySelector('[data-action=grammarLevel]').click();actions.gameResume();render();assert(screen==='game','raise level resumes saved game');FriendsToAmigos.handleBack();state.games.active=null;state.blanks.active=null;
   for(let n=0;n<2;n++)M.record(state,[{verb:'comer',tense:'present',person:'vosotros',pattern:'regular-er'}],false,{session:'browser-game-only',item:'g'+n},Date.now());
   actions.weakAreas();render();assert(document.querySelector('#app').textContent.includes('vosotros'),'game-only weakness visible');actions.dailyReview();render();assert(screen==='blanks'&&state.completed.length===0,'game-only Today review launches');FriendsToAmigos.handleBack();state.blanks.active=null;
   actions.blanksOpen();render();document.querySelector('#table-count').value='5';document.querySelector('#table-scope').value='custom';document.querySelector('#table-level').value='A2.1';document.querySelector('#table-grammar').value='preterite';actions.blanksPractice();render();assert(state.blanks.active.tables.length===5&&state.blanks.active.tables.every(t=>t.target.tense==='preterite'),'custom past practice within selected level');FriendsToAmigos.handleBack();
   for(const stage of ['A1.2','A2.1','A2.2']){
    const l=C.lessons.find(l=>l.stage===stage&&!l.reading),q=l.questions[0];actions.lesson({dataset:{id:l.id}});render();window.scrollTo(0,0);await frame();
    assert(document.querySelector('.question').textContent===q.promptEs,'Spanish question default '+stage);
    assert(document.querySelector('#exercise-instruction').textContent==='Elige una respuesta','Spanish action '+stage);
    assert(!document.querySelector('#english-hint'),'English hidden '+stage);
    document.querySelector('[data-action=englishHint]').click();assert(document.querySelector('#english-hint').textContent.includes(q.englishHint),'deliberate English reveal '+stage);
    assert(document.querySelector('[data-action=englishHint]').getAttribute('aria-expanded')==='true','accessible hint expanded '+stage);
    assert(FriendsToAmigos.handleBack()&&state.active.hintRevealed,'hint saved on Back '+stage);actions.continue();render();assert(document.querySelector('#english-hint'),'hint restored '+stage);
    actions.answer({dataset:{index:String(q.options.indexOf(q.answer))}});actions.check();render();assert(quiz.answers.at(-1)===true&&state.events.at(-1).assisted,'hinted answer correct and assisted '+stage);
    assert(document.querySelector('[data-action=next]'),'Spanish feedback Next remains available '+stage);
    window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert(document.querySelector('[data-action=next]').getBoundingClientRect().bottom<=innerHeight-config.bottom+1,'hint feedback controls scroll above bars '+stage);
    actions.next();render();assert(!document.querySelector('#english-hint'),'hint resets on next question '+stage);
    // Listening help translates the question, never the audio.
    const heard=C.lessons.find(l=>l.stage===stage&&l.questions.some(q=>q.listening));startQuiz('lesson',heard.questions,heard);quiz.index=heard.questions.findIndex(q=>q.listening);quiz.answers=quiz.questions.slice(0,quiz.index).map(()=>true);render();actions.englishHint();render();const audio=currentQuestion();
    assert(!document.querySelector('.listening').textContent.includes(audio.listening.transcript),'English help keeps transcript concealed '+stage);
    assert(!quiz.audioPlayed&&document.querySelector('#check-answer').disabled,'hint cannot unlock audio '+stage);
    actions.listen();render();assert(!quiz.audioPlayed,'delayed audio still locked with hint '+stage);utterances.at(-1).onstart();assert(quiz.audioPlayed,'speech-start acknowledgement unlocks '+stage);
    if(audio.type==='text'){const input=document.querySelector('#written-answer');input.value=audio.accepted[0];input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));}else{actions.answer({dataset:{index:String(audio.options.indexOf(audio.answer))}});actions.check();render();}
    assert(document.querySelector('.listening').textContent.includes(audio.listening.transcript),'transcript revealed separately after attempt '+stage);FriendsToAmigos.handleBack();
   }
   // A2.2 retains the familiar mobile controls; every new activity has a real rendered entry.
   state.completed=C.lessons.map(l=>l.id);state.stage='A2.2';state.grammarLevel='A2.2';quiz=null;
   for(const l of C.lessons.filter(l=>l.stage==='A2.2')){
    actions.lesson({dataset:{id:l.id}});render();if(l.reading){assert(document.querySelector('#app').textContent.includes(l.reading.title),'A2.2 read-first entry '+l.id);actions.readStory();render();}
    assert(document.querySelector('.question').textContent===l.questions[0].promptEs,'A2.2 rendered Spanish entry '+l.id);
    assert(document.documentElement.scrollWidth<=innerWidth+1,'A2.2 activity width '+l.id);
   }
   actions.lesson({dataset:{id:'a22u7write'}});render();const written=currentQuestion(),field=document.querySelector('#written-answer');
   field.value=written.answer;field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));
   assert(quiz.answers.length===0&&!quiz.checked,'A2.2 multiline Enter is a newline');actions.check();render();actions.writingReflect({dataset:{result:'got'}});render();assert(quiz.answers.length===1&&quiz.answers[0]===null,'A2.2 open response reflected without fake accuracy');field.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(quiz.answers.length===1,'A2.2 reflection deduplicated');FriendsToAmigos.handleBack();
   actions.blanksOpen();render();document.querySelector('#table-count').value='3';document.querySelector('#table-scope').value='custom';document.querySelector('#table-level').value='A2.2';document.querySelector('#table-grammar').value='imperfect';actions.blanksPractice();render();
   assert(state.blanks.active.tables.every(t=>t.target.tense==='imperfect'&&t.target.stage==='A2.2'),'A2.2 custom imperfect targets');assert(document.querySelectorAll('[role=rowheader]').length===6,'imperfect six-person mobile rows');FriendsToAmigos.handleBack();
   for(const kind of ['listening','speaking']){
    state.focused=F.empty();quiz=null;actions.mediaPractice({dataset:{kind,stage:'A2.2'}});render();
    assert(quiz.questions.length===10&&new Set(quiz.questions.map(q=>q.id)).size===10,'A2.2 ten unique '+kind);
    assert(JSON.stringify(C.playableStages.map(st=>quiz.questions.filter(q=>q.practice.stage===st).length))==='[1,1,2,6,0,0,0,0]','A2.2 recycled stage quota '+kind);
    const snapshot=JSON.stringify(quiz.questions);FriendsToAmigos.handleBack();actions.focusedResume();render();assert(JSON.stringify(quiz.questions)===snapshot,'A2.2 saved media snapshot '+kind);FriendsToAmigos.handleBack();
   }
   state.active=null;quiz=null;actions.home();render();assert(document.querySelector('#app').textContent.includes('course through B2'),'B2 course milestone');assert(!document.querySelector('#app').textContent.includes('Continue to C'),'no C course offer');
   actions.lesson({dataset:{id:'a22u0l0'}});render();actions.englishHint();render();
   // Browser import follows the same validated snapshot route as Android.
   const backup=JSON.stringify(state),expected=state.active.questions[state.active.index].id;
   const restored=P.parse(backup,C,{import:true}).state;state=restored;actions.continue();render();assert(currentQuestion().id===expected&&quiz.hintRevealed,'browser backup retains current hint and stable question');
   assert(document.documentElement.scrollWidth<=innerWidth+1,'Spanish listening/hint fits narrow and large text layouts');
   // Every B entry, extended writing, safe reflection and historical recovery.
   for(const stage of ['B1.1','B1.2','B2.1','B2.2']){
    state.stage=state.grammarLevel=stage;state.completed=C.lessons.map(l=>l.id);state.active=null;quiz=null;
    for(const l of C.lessons.filter(l=>l.stage===stage)){
     actions.lesson({dataset:{id:l.id}});render();if(l.reading){assert(document.querySelector('#app').textContent.includes(l.reading.text),stage+' full passage '+l.id);actions.readStory();render();}
     assert(document.querySelector('.question').textContent===l.questions[0].promptEs,stage+' Spanish entry '+l.id);assert(document.documentElement.scrollWidth<=innerWidth+1,stage+' no horizontal overflow '+l.id);
    }
    const lesson=C.lessons.find(l=>l.stage===stage&&l.id.endsWith('u7write'));
    startQuiz('lesson',lesson.questions,lesson);quiz.index=1;quiz.answers=[true];persistQuiz();render();
    let area=document.querySelector('textarea');assert(area&&area.enterKeyHint==='enter',stage+' multiline field');
    area.value='Una alternativa natural.\\nQuiero explicarla con mis propias palabras.';area.dispatchEvent(new Event('input',{bubbles:true}));area.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(quiz.answers.length===1&&!quiz.checked,stage+' newline does not submit');
    actions.check();render();assert(document.querySelector('.feedback').textContent.includes('could not confidently assess'),stage+' uncertainty coaches');assert(!document.querySelector('[data-action=next]'),stage+' reflection required');
    FriendsToAmigos.handleBack();actions.continue();render();assert(document.querySelector('.feedback').textContent.includes('Una alternativa natural'),stage+' comparison survives Back/resume');
    actions.writingRevise();render();area=document.querySelector('textarea');assert(!area.disabled,stage+' revision field unlocked');area.value='Mi llamo Ana.';area.dispatchEvent(new Event('input',{bubbles:true}));actions.check();render();assert(document.querySelector('.writing-why').textContent.includes('Mi means'),stage+' high confidence Why teaches');
    actions.writingReflect({dataset:{result:'needs'}});render();assert(quiz.answers[1]===null&&state.reviews[currentQuestion().id].question.previousResponse==='Mi llamo Ana.',stage+' reflection retained for review');
    assert(state.active.hintRevealed,stage+' model-assisted revision tracked');FriendsToAmigos.handleBack();
    startQuiz('lesson',lesson.questions,lesson);quiz.index=4;quiz.answers=[true,null,true,null];quiz.writingResponses={1:{response:'Otra respuesta.',reflection:'got',outcome:'uncertain-show-model'},3:{response:'Otra respuesta.',reflection:'got',outcome:'uncertain-show-model'}};render();
    area=document.querySelector('textarea');area.value=currentQuestion().answer;area.dispatchEvent(new Event('input',{bubbles:true}));actions.check();render();assert(!Writing.assess(currentQuestion(),quiz.selected).verified,stage+' free model never grammar certified');actions.writingReflect({dataset:{result:'got'}});render();actions.next();render();assert(document.querySelector('#app').textContent.includes('excluded from verified accuracy'),stage+' completion distinguishes reflection');
    for(const kind of ['listening','speaking']){state.focused=F.empty();quiz=null;actions.mediaPractice({dataset:{kind,stage}});render();assert(quiz.questions.length===10&&new Set(quiz.questions.map(q=>q.id)).size===10,stage+' ten unique '+kind);assert(quiz.questions.filter(q=>q.practice.stage===stage).length===6,stage+' current-stage retrieval majority '+kind);assert(quiz.questions.every(q=>C.stages.indexOf(q.practice.stage)<=C.stages.indexOf(stage)),stage+' no future practice leakage '+kind);FriendsToAmigos.handleBack();}
    state.games.active=null;actions.gameNew();render();assert(state.games.active.stage===stage&&state.games.active.questions.length===10,stage+' contextual game level');actions.gameLeave();state.blanks.active=null;actions.blanksNormal();render();assert(state.blanks.active.tables.length===3&&document.querySelectorAll('[role=rowheader]').length===6,stage+' six person adaptive tables');FriendsToAmigos.handleBack();
   }
   state.completed=C.lessons.map(l=>l.id);state.active=null;quiz=null;actions.home();render();assert(document.querySelector('#app').textContent.includes('course through B2'), 'final B2 course milestone');assert(!document.querySelector('#app').textContent.includes('Continue to C'),'no invented C curriculum');
   // The additive dictionary preserves the five-tab navigation and learning state.
   window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);
   state=E.fresh();state.onboarded=true;quiz=null;actions.home();render();
   const navOrder=()=>[...document.querySelectorAll('nav [data-tab]')].map(e=>e.dataset.tab).join('|');
   assert(navOrder()==='Home|Learn|Games|Review|Profile','dictionary preserves permanent navigation order');
   // Zero-beginner confidence ramp and visible-Spanish assistance use the actual DOM.
   for(const id of ['u0l0','u0l1','u0l2']){
    const opening=C.lessons.find(l=>l.id===id);actions.lesson({dataset:{id}});render();window.scrollTo(0,0);await frame();
    assert(document.querySelector('.question'),'opening teaching activity renders '+id);
    assert(document.querySelector('#check-answer'),'opening teaching keeps visible Check '+id);
    if(id==='u0l0'){assert(opening.questions.every(q=>q.type!=='text'&&q.type!=='speaking'),'first lesson has no unsupported typed or spoken transfer');assert(document.querySelector('#app').textContent.includes('Hello'),'first model teaches meaning before recall');}
    if(id==='u0l1')assert(opening.questions.some(q=>q.type==='text'),'second lesson restores easy recall');
    if(id==='u0l2')assert(opening.questions.some(q=>q.type==='text'&&q.answer.includes('Luis')),'third lesson restores simple role transfer');
    assert(document.documentElement.scrollWidth<=innerWidth+1,'opening lesson wraps without overflow '+id);FriendsToAmigos.handleBack();
   }
   const firstStory=C.lessons.find(l=>l.id==='u0story0');actions.lesson({dataset:{id:firstStory.id}});render();assert(document.querySelector('.story'),'opening read-first story remains present');actions.readStory();render();assert(document.querySelector('.question'),'first story comprehension remains playable');FriendsToAmigos.handleBack();
   const nameQuestion={...C.lessons.find(l=>l.id==='u0l0').questions[3],type:'choice',prompt:'Luis says “¿Cómo te llamas?” What answers his question?',options:['Hasta luego','Me llamo Ana','Soy de Inglaterra'],answer:'Me llamo Ana',explanation:'Me llamo Ana gives your name.'};
   delete nameQuestion.promptEs;delete nameQuestion.teachingModel;delete nameQuestion.listening;delete nameQuestion.spanishFragments;delete nameQuestion.optionsLanguage;delete nameQuestion.optionLanguages;delete nameQuestion.optionSpanishFragments;
   const fixtureLesson={...C.lessons.find(l=>l.id==='u0l0'),questions:[nameQuestion]};startQuiz('lesson',fixtureLesson.questions,fixtureLesson);render();window.scrollTo(0,0);await frame();
   const learningOnly=()=>{const copy=JSON.parse(JSON.stringify(state));delete copy.savedWords;delete copy.dictionaryTipSeen;return JSON.stringify(copy);};
   const beforeLookup=learningOnly(),beforeAnswers=JSON.stringify(quiz.answers),beforeHint=quiz.hintRevealed,unansweredQuestion=currentQuestion();
   const promptTokens=[...document.querySelectorAll('.question [data-dictionary-token]')];
   for(const word of ['Cómo','te','llamas'])assert(promptTokens.some(t=>t.textContent===word),'mixed prompt Spanish word enabled before attempt '+word);
   assert(promptTokens.every(t=>['Cómo','te','llamas'].includes(t.textContent)),'surrounding English and proper name remain plain');
   const cards=[...document.querySelectorAll('.quiz-choices .choice')];assert(cards.length===3,'all explicit scenario choices rendered');
   assert(cards.every(card=>card.querySelector('[data-dictionary-token]')),'Spanish inside every answer choice is discoverable before selection');
   assert(document.querySelectorAll('[role=radio] button,[role=radio] [role=button]').length===0,'choice radio has no nested interactive dictionary control');
   assert(cards.every(card=>card.querySelector('.choice-select[role=radio]').getBoundingClientRect().width>=44),'radio selection has its own accessible touch target');
   const answerWord=[...cards[1].querySelectorAll('[data-dictionary-token]')].find(t=>t.textContent==='llamo');answerWord.scrollIntoView({block:'center'});await frame();answerWord.click();await frame();
   assert(!document.querySelector('.dictionary-popup').hidden,'answer-choice word opens dictionary before submission');
   assert(quiz.selected===null&&!quiz.checked&&quiz.answers.length===0,'dictionary word does not select or check answer');
   assert(!document.querySelector('[role=radio][aria-checked=true]'),'no radio selected by dictionary word');
   assert(quiz.hintRevealed===beforeHint&&JSON.stringify(quiz.answers)===beforeAnswers&&learningOnly()===beforeLookup,'dictionary changes no hint score review mastery progress or active snapshot');
   assert(currentQuestion()===unansweredQuestion,'dictionary retains identical unanswered question object');
   const helpPopup=document.querySelector('.dictionary-popup'),helpBounds=helpPopup.getBoundingClientRect();assert(helpBounds.left>=(config.left||0)+9&&helpBounds.right<=innerWidth-(config.right||0)-9,'pre-answer popup stays horizontally in safe viewport');
   assert(helpBounds.top>=(config.top||24)+9&&helpBounds.bottom<=innerHeight-config.bottom-9,'pre-answer popup clears system bars');
   helpPopup.querySelector('[data-dict-action=close]').click();assert(helpPopup.hidden&&quiz.selected===null&&learningOnly()===beforeLookup,'close restores same unanswered state');
   cards[1].click();await frame();assert(quiz.selected===nameQuestion.answer&&document.querySelector('[role=radio][aria-checked=true]'),'card padding selects separately');
   document.querySelector('#check-answer').click();assert(quiz.checked&&quiz.answers[0]===true,'normal Check scoring still works after dictionary exploration');
   assert(state.dictionaryTipSeen===true,'successful dictionary use acknowledges product discovery tip');
   const mixedExamples=[
    {prompt:'She says “Tengo hambre”. What does she need?',words:['Tengo','hambre'],options:['Food','A ticket','A room'],answer:'Food'},
    {prompt:'Luis asks “¿Dónde está la estación?” Choose the useful reply.',words:['Dónde','está','la','estación'],options:['Está aquí','Hasta luego','Soy de Inglaterra'],answer:'Está aquí'},
    {prompt:'You hear “Hasta luego”. What kind of expression is this?',words:['Hasta','luego'],options:['A goodbye','A number','A price'],answer:'A goodbye'}
   ];
   for(const example of mixedExamples){
    const question={...nameQuestion,...example};startQuiz('lesson',[question],{...fixtureLesson,questions:[question]});render();const tokens=[...document.querySelectorAll('.question [data-dictionary-token]')];
    for(const word of example.words)assert(tokens.some(t=>t.textContent===word),'mixed quoted Spanish recognized '+word);
    assert(tokens.every(t=>example.words.includes(t.textContent)),'English words and homographs are not decorated '+example.prompt);
   }
   // Long choices, multiline writing and saved-search use the same inset/IME source of truth.
   const longQuestion={...nameQuestion,prompt:'Choose the invitation you would like to accept.',options:['Hola, me llamo Ana y quiero ir al café con Luis mañana a las seis, por favor.','Me gusta este café porque es barato, pero hoy voy a quedar con Marta en la estación.','Hasta luego, Ana. Gracias por venir al café con nosotros.'],answer:'Hola, me llamo Ana y quiero ir al café con Luis mañana a las seis, por favor.'};
   startQuiz('lesson',[longQuestion],{...fixtureLesson,questions:[longQuestion]});render();await frame();assert(document.documentElement.scrollWidth<=innerWidth+1,'long Spanish choices wrap with large text and cutout insets');
   const longCard=document.querySelector('.choice'),longRadio=longCard.querySelector('[role=radio]'),longText=longCard.querySelector('.option-text');assert(longRadio.getBoundingClientRect().right<=longText.getBoundingClientRect().left+1,'radio remains separate from wrapped word targets');
   actions.lesson({dataset:{id:'b22u7write'}});quiz.index=4;quiz.answers=[true,null,true,null];render();const multiline=document.querySelector('textarea');multiline.focus();window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,true,config.overlap||0);await frame();
   assert(getComputedStyle(document.querySelector('nav')||document.createElement('nav')).display==='none'||!document.querySelector('nav'),'multiline writing does not overlay native keyboard with app nav');
   window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert(document.querySelector('#check-answer').getBoundingClientRect().bottom<=innerHeight-(config.overlap||0)+1,'multiline Check can scroll above keyboard');
   window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);FriendsToAmigos.handleBack();state=E.fresh();state.onboarded=true;quiz=null;actions.home();render();
   const dictionaryLesson=C.lessons.find(l=>l.stage==='A1.1'&&l.reading&&l.reading.text.includes('Tengo hambre.'));
   assert(Boolean(dictionaryLesson),'authored hunger story available for contextual lookup');
   actions.lesson({dataset:{id:dictionaryLesson.id}});render();window.scrollTo(0,0);await frame();
   const dictionaryBefore=()=>{const value=JSON.parse(JSON.stringify(state));delete value.savedWords;delete value.dictionaryTipSeen;return JSON.stringify(value);};
   const untouched=dictionaryBefore(),snapshot=JSON.stringify(state.active),storyText=document.querySelector('.story p[data-dictionary]').textContent;
   assert(storyText===dictionaryLesson.reading.text,'dictionary tokenisation preserves authored story text');
   let token=[...document.querySelectorAll('.story p [data-dictionary-token]')].find(e=>e.textContent==='Tengo');
   assert(token&&token.getAttribute('role')==='button'&&token.tabIndex===0,'Spanish words have accessible delegated lookup');
   token.scrollIntoView({block:'center'});await frame();token.click();await frame();
   let popup=document.querySelector('.dictionary-popup');
   assert(popup&&!popup.hidden&&popup.getAttribute('role')==='dialog','contextual popup opens without lesson navigation');
   assert(popup.textContent.includes('tener hambre')&&popup.textContent.includes('to be hungry'),'phrase meaning takes priority over isolated hunger');
   assert(popup.querySelector('[data-dict-action=save]').textContent==='Save phrase','recognized construction saves useful phrase');
   const bounded=label=>{const bounds=popup.getBoundingClientRect();assert(bounds.left>=(config.left||0)+9&&bounds.right<=innerWidth-(config.right||0)-9,label+' horizontal usable viewport');assert(bounds.top>=(config.top||24)+9&&bounds.bottom<=innerHeight-config.bottom-9,label+' clears Android system bars');};
   bounded('compact dictionary');assert(popup.querySelectorAll('button').length===4,'compact dictionary actions retained');
   assert([...popup.querySelectorAll('button')].every(e=>e.getBoundingClientRect().height>=44),'dictionary controls meet mobile touch targets');
   const utteranceCount=utterances.length;popup.querySelector('[data-dict-action=pronounce]').click();assert(utterances.length===utteranceCount+1&&utterances.at(-1).lang==='es-ES','dictionary uses existing Spain speech path');
   popup.querySelector('[data-dict-action=more]').click();await frame();assert(popup.querySelector('#dictionary-more')&&popup.querySelector('[data-dict-action=more]').getAttribute('aria-expanded')==='true','More expands level-appropriate entry');bounded('expanded dictionary');
   popup.querySelector('[data-dict-action=save]').click();await frame();assert(state.savedWords.length===1&&state.savedWords[0].kind==='phrase','phrase persists from popup');
   popup.querySelector('[data-dict-action=save]').click();assert(state.savedWords.length===1,'repeat Save cannot duplicate vocabulary');assert(popup.querySelector('[data-dict-action=save]').getAttribute('aria-pressed')==='true','saved popup state is explicit');
   assert(dictionaryBefore()===untouched&&JSON.stringify(state.active)===snapshot,'dictionary does not change score hint evidence SRS or active snapshot');
   assert(JSON.parse(localStorage.getItem(P.KEY)).savedWords.length===1,'saved phrase written offline to existing backup schema');
   popup.querySelector('[data-dict-action=close]').click();assert(popup.hidden&&document.activeElement===token,'closing dictionary restores selected word focus');
   token.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(!popup.hidden,'keyboard Enter opens dictionary');
   document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));assert(popup.hidden,'Escape dismisses dictionary');
   token.click();document.querySelector('.eyebrow').dispatchEvent(new Event('pointerdown',{bubbles:true}));assert(popup.hidden,'outside tap dismisses dictionary');
   token.click();assert(FriendsToAmigos.handleBack()&&screen==='quiz'&&popup.hidden,'Android Back closes dictionary before leaving lesson');
   assert(FriendsToAmigos.handleBack()&&screen==='main'&&state.active.lesson.id===dictionaryLesson.id,'next Back safely saves unchanged lesson');actions.continue();render();assert(JSON.stringify(state.active)===snapshot,'dictionary course snapshot resumes exactly');
   token=[...document.querySelectorAll('.story p [data-dictionary-token]')].find(e=>e.textContent==='pan');token.click();await frame();popup=document.querySelector('.dictionary-popup');assert(popup.textContent.includes('bread'),'known noun context lookup');popup.querySelector('[data-dict-action=save]').click();assert(state.savedWords.length===2,'individual word saves alongside phrase');FriendsToAmigos.handleBack();FriendsToAmigos.handleBack();
   actions.profile();render();assert(document.querySelector('#app').textContent.includes('2 saved words and phrases'),'Profile exposes saved vocabulary count');assert(navOrder()==='Home|Learn|Games|Review|Profile','Profile retains Review and all tab positions');
   document.querySelector('[data-action=savedWords]').click();assert(screen==='savedWords'&&tab==='Profile'&&!document.querySelector('nav'),'Saved Words lives within Profile rather than new tab');
   assert(document.querySelectorAll('.saved-word-row').length===2,'saved list renders both entry kinds');
   document.querySelector('[data-action=savedFilter][data-filter=words]').click();assert(document.querySelectorAll('.saved-word-row').length===1&&document.querySelector('.saved-word-row h3').textContent==='pan','Words filter');
   document.querySelector('[data-action=savedFilter][data-filter=phrases]').click();assert(document.querySelectorAll('.saved-word-row').length===1&&document.querySelector('.saved-word-row h3').textContent==='tener hambre','Phrases filter');
   document.querySelector('[data-action=savedFilter][data-filter=all]').click();let search=document.querySelector('#saved-word-search');search.value='hungry';search.dispatchEvent(new Event('input',{bubbles:true}));assert(document.querySelectorAll('.saved-word-row').length===1&&document.querySelector('.saved-word-row h3').textContent==='tener hambre','saved meanings searchable');assert(document.activeElement.id==='saved-word-search','search focus survives results rendering');
   const searchOverlap=config.overlap||Math.round(innerHeight*.38);search=document.querySelector('#saved-word-search');search.focus();window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,true,searchOverlap);await frame();
   assert(search.getBoundingClientRect().bottom<=innerHeight-searchOverlap+1,'Saved Words search remains above Samsung-style keyboard');
   const searchStyle=getComputedStyle(search),focusOutset=Math.max(0,(parseFloat(searchStyle.outlineWidth)||0)+(parseFloat(searchStyle.outlineOffset)||0));
   assert(search.getBoundingClientRect().top-document.querySelector('label[for="saved-word-search"]').getBoundingClientRect().bottom>=focusOutset,'Saved Words focus ring clears its readable label');
   search.value='hungry';search.dispatchEvent(new Event('input',{bubbles:true}));await frame();assert(document.activeElement.id==='saved-word-search','Saved Words keyboard search retains focused field');
   const keyboardMore=document.querySelector('[data-action=savedOpen]');keyboardMore.scrollIntoView({block:'center'});await frame();window.scrollBy(0,keyboardMore.getBoundingClientRect().top-((config.top||24)+70));await frame();keyboardMore.click();await frame();
   popup=document.querySelector('.dictionary-popup');assert(!popup.hidden,'saved entry popup opens with keyboard visible');let imeBounds=popup.getBoundingClientRect();assert(imeBounds.top>=(config.top||24)+9&&imeBounds.bottom<=innerHeight-searchOverlap-9,'popup avoids native overlay keyboard');
   popup.querySelector('[data-dict-action=more]').click();await frame();imeBounds=popup.getBoundingClientRect();assert(imeBounds.bottom<=innerHeight-searchOverlap-9&&getComputedStyle(popup).overflowY==='auto','More remains internally scrollable above keyboard');FriendsToAmigos.handleBack();
   window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);await frame();
   search=document.querySelector('#saved-word-search');search.value='no match at all';search.dispatchEvent(new Event('input',{bubbles:true}));assert(document.querySelector('#app').textContent.includes('No saved words match'),'empty search explained');search=document.querySelector('#saved-word-search');search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));
   const recentTimes=state.savedWords.map((row,i)=>({...row,savedAt:i+100}));state.savedWords=recentTimes;render();document.querySelector('[data-action=savedFilter][data-filter=recent]').click();assert(document.querySelector('.saved-word-row h3').textContent==='pan','Recently saved orders latest first');
   const savedSpeech=utterances.length;document.querySelector('[data-action=savedPronounce]').click();assert(utterances.length===savedSpeech+1&&utterances.at(-1).lang==='es-ES','saved vocabulary pronunciation uses es-ES');
   const savedOpen=document.querySelector('[data-action=savedOpen]');savedOpen.scrollIntoView({block:'center'});await frame();savedOpen.click();assert(!document.querySelector('.dictionary-popup').hidden,'saved row reopens full dictionary');assert(FriendsToAmigos.handleBack()&&screen==='savedWords','Back closes saved entry first');
   document.querySelector('[data-action=savedRemove]').click();assert(state.savedWords.length===1&&document.querySelectorAll('.saved-word-row').length===1,'Remove persists without changing course');
   assert(document.documentElement.scrollWidth<=innerWidth+1,'Saved Words fits narrow large-text and landscape screens');window.scrollTo(0,0);assert(FriendsToAmigos.handleBack()&&tab==='Profile'&&screen==='main','Saved Words Back returns Profile');
   actions.tab({dataset:{tab:'Review'}});render();assert(document.querySelector('[data-action=review]'),'Review remains directly accessible after saved words');
   const listenLesson=C.lessons.find(l=>l.stage==='A2.1'&&l.questions.some(q=>q.listening));startQuiz('lesson',listenLesson.questions,listenLesson);quiz.index=listenLesson.questions.findIndex(q=>q.listening);quiz.answers=Array(quiz.index).fill(true);render();
   assert(!document.querySelector('.listening [data-dictionary-token]'),'dictionary cannot expose hidden listening transcript');assert(!quiz.checked&&!document.querySelector('.feedback'),'listening choices expose no correctness or future feedback before attempt');
   const speakLesson=C.lessons.find(l=>l.questions.some(q=>q.type==='speaking'));startQuiz('lesson',speakLesson.questions,speakLesson);quiz.index=speakLesson.questions.findIndex(q=>q.type==='speaking');render();assert(![...document.querySelectorAll('[data-dictionary]')].some(e=>e.textContent===currentQuestion().spanish),'dictionary cannot expose unrevealed speaking model');
   actions.revealModel();render();assert([...document.querySelectorAll('[data-dictionary]')].some(e=>e.textContent===currentQuestion().spanish&&e.querySelector('[data-dictionary-token]')),'revealed model offers dictionary safely');FriendsToAmigos.handleBack();
   // Leave original screenshot subjects eligible; this does not grant game mastery.
   state.completed=C.lessons.map(l=>l.id);state.stage='A2.1';state.grammarLevel='A2.1';state.games=G.empty();state.blanks=B.empty();state.focused=F.empty();quiz=null;actions.home();render();
   // Restore the LIVE v1.3 catalogue after the explicit historical-snapshot journey.
   C.numbers=liveCourse.numbers;C.time=liveCourse.time;C.lessons=liveCourse.lessons;C.listeningPractice=liveCourse.listeningPractice;C.speakingPractice=liveCourse.speakingPractice;C.assessmentChanges=liveCourse.assessmentChanges;
   state={...E.fresh(),onboarded:true};state.completed=[];state.active=null;quiz=null;actions.home();render();window.scrollTo(0,0);await frame();
   assert([...document.querySelectorAll('[data-home-section]')].map(e=>e.dataset.homeSection).join('|')==='continue|today|attention|practice','v1.3 Home hierarchy');
   assert(document.querySelector('[data-home-section=continue] .primary'),'Continue Learning is primary');
   const primaryStyle=getComputedStyle(document.querySelector('[data-home-section=continue] .primary')),probe=document.createElement('span');probe.style.color='var(--teal)';document.body.append(probe);const expectedTeal=getComputedStyle(probe).color;probe.remove();assert(primaryStyle.backgroundColor===expectedTeal,'teal primary replaces coral');
   const luminance=color=>{const channels=color.match(/[0-9.]+/g).slice(0,3).map(Number).map(n=>{const c=n/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;},contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
   assert(contrast(primaryStyle.color,primaryStyle.backgroundColor)>=4.5,'primary text contrast');const continueStyle=getComputedStyle(document.querySelector('.continue-card'));assert(contrast(continueStyle.color,continueStyle.backgroundColor)>=4.5,'Continue card text contrast');
   assert(document.documentElement.scrollWidth<=innerWidth+1,'new Home wraps in viewport');
   actions.profile();render();await frame();assert([...document.querySelectorAll('[data-profile-section]')].map(e=>e.dataset.profileSection).join('|')==='summary|level-streak|capabilities|content|vocabulary|progress|settings','v1.3 Profile hierarchy');
   assert(navOrder()==='Home|Learn|Games|Review|Profile','new Profile retains all five tabs');assert(document.documentElement.scrollWidth<=innerWidth+1,'new Profile fits large text');const statsPanel=document.querySelector('#profile-period-stats');statsPanel.open=true;await frame();document.querySelector('[data-action=filter][data-filter=week]').click();await frame();assert(document.querySelector('#profile-period-stats').open&&document.querySelector('[data-action=filter][data-filter=week]').getAttribute('aria-pressed')==='true','period stats remain open after filtering');assert(document.querySelector('.weekchart')&&document.querySelectorAll('.period-stats tr').length===8,'detailed statistics and chart retained');
   document.querySelector('[data-action=content]').click();await frame();assert(screen==='content'&&tab==='Profile','recommendations are secondary');assert(document.querySelectorAll('.recommendation').length===15,'fifteen level-filtered recommendations');assert(document.querySelectorAll('.recommendation-category').length===5,'five recommendation categories');assert(document.documentElement.scrollWidth<=innerWidth+1,'recommendations fit landscape and large text');
   window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert([...document.querySelectorAll('[data-action=externalContent]')].at(-1).getBoundingClientRect().bottom<=innerHeight-config.bottom+1,'last external action clears system navigation');assert(FriendsToAmigos.handleBack()&&tab==='Profile'&&screen==='main','recommendation Back returns Profile');
   const liveExamples=[C.lessons.find(l=>l.id==='u0l1').questions[4],C.lessons.find(l=>l.stage==='A1.2'&&l.questions.some(q=>q.type==='cloze')).questions.find(q=>q.type==='cloze'),C.lessons.find(l=>l.stage==='A2.1'&&l.questions.some(q=>q.type==='cloze'&&q.cloze.blanks.length===3)).questions.find(q=>q.type==='cloze'&&q.cloze.blanks.length===3),C.lessons.find(l=>l.stage==='B1.1'&&l.questions.some(q=>q.type==='tiles'&&q.tileKind==='phrase')).questions.find(q=>q.type==='tiles'&&q.tileKind==='phrase')];
   for(const liveQuestion of liveExamples){
    const owner=C.lessons.find(l=>l.questions.includes(liveQuestion));startQuiz('lesson',[liveQuestion],{...owner,questions:[liveQuestion],reading:null});quiz.readingReady=true;render();window.scrollTo(0,0);await frame();
    assert(document.querySelector('.structured-task')&&!document.querySelector('#written-answer'),'structured production has no misleading textbox '+liveQuestion.id);assert(document.querySelector('#check-answer').disabled,'empty construction locked '+liveQuestion.id);assert(document.documentElement.scrollWidth<=innerWidth+1,'structured task wraps '+liveQuestion.id);
    const beforeLookup=JSON.stringify({selected:quiz.selected,answers:quiz.answers,hint:quiz.hintRevealed,events:state.events,mastery:state.mastery,reviews:state.reviews,completed:state.completed});
    const word=[...document.querySelectorAll('.structured-task [data-dictionary-token]')].find(e=>['Me','me','he','porque','de','un','en','tengo'].includes(e.textContent))||document.querySelector('.structured-task [data-dictionary-token]');assert(word,'visible construction vocabulary is explorable');word.scrollIntoView({block:'center'});await frame();word.click();await frame();assert(!document.querySelector('.dictionary-popup').hidden,'word opens before construction');assert(beforeLookup===JSON.stringify({selected:quiz.selected,answers:quiz.answers,hint:quiz.hintRevealed,events:state.events,mastery:state.mastery,reviews:state.reviews,completed:state.completed}),'dictionary never fills a gap/tile or records evidence');FriendsToAmigos.handleBack();assert(screen==='quiz','dictionary Back stays in task');
    if(liveQuestion.type==='tiles'){
     const indices=Structured.selection(Structured.canonical(liveQuestion));const first=document.querySelector('[data-action=tileAdd][data-index="'+indices[0]+'"]');first.focus();first.dispatchEvent(new MouseEvent('click',{bubbles:true}));assert(Structured.selection(quiz.selected).length===1,'tile Add uses a separate accessible control');assert(document.querySelector('.tile.used'),'used tile has explicit state');document.querySelector('[data-action=tileRemove]').click();assert(quiz.selected===null,'remove returns blank builder');
     indices.forEach(index=>document.querySelector('[data-action=tileAdd][data-index="'+index+'"]').click());assert(Structured.ready(liveQuestion,quiz.selected),'assembled response ready');
    }else{
     liveQuestion.cloze.blanks.forEach((blank,i)=>{document.querySelector('[data-action=clozePick][data-blank="'+i+'"][data-index="'+blank.options.indexOf(blank.answer)+'"]').click();assert(document.activeElement.dataset.blank===String(i)&&document.activeElement.dataset.index===String(blank.options.indexOf(blank.answer)),'cloze selection keeps keyboard focus');});assert(document.querySelectorAll('[data-action=clozePick][aria-pressed=true]').length===liveQuestion.cloze.blanks.length,'each gap selected accessibly');
    }
    const unsubmitted=JSON.stringify(state.active);FriendsToAmigos.handleBack();actions.continue();render();assert(JSON.stringify(state.active)===unsubmitted,'structured interruption resumes original snapshot');document.querySelector('#check-answer').click();assert(quiz.answers[0]===true,'structured response uses shared scorer');assert(document.querySelector('.feedback').textContent.includes('Correct'),'teaching feedback confirms construction');
    const answerEvents=state.events.length;actions.check();assert(state.events.length===answerEvents,'structured check deduplicated');window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert(document.querySelector('[data-action=next]').getBoundingClientRect().bottom<=innerHeight-config.bottom+1,'structured feedback Next reachable');
   }
   // Exhaustive live rendering once, plus representative interactions on ALL layouts.
   if(config.name==='s24-dark-buttons')for(const liveLesson of C.lessons){startQuiz('lesson',liveLesson.questions,liveLesson);quiz.readingReady=true;for(let i=0;i<liveLesson.questions.length;i++){quiz.index=i;quiz.checked=false;quiz.selected=null;quiz.answers=Array(i).fill(true);render();assert(document.querySelector('.question'),'every live question renders '+liveLesson.questions[i].id);assert(document.documentElement.scrollWidth<=innerWidth+1,'every live question wraps '+liveLesson.questions[i].id);}}
   state={...E.fresh(),onboarded:true};quiz=null;actions.begin();quiz.answers=quiz.questions.map(()=>true);quiz.index=quiz.questions.length;render();await frame();assert(document.querySelector('.up-next').textContent.includes(C.lessons[1].title),'completion previews actual next story');assert(document.querySelector('[data-action=continueLearning]')&&document.querySelector('[data-action=home]').textContent==='Finish for now','Continue and Finish for now coexist');document.querySelector('[data-action=continueLearning]').click();assert(quiz.lesson.id===C.lessons[1].id&&quiz.lesson.reading,'Continue goes directly to story without Home');
   state.active=null;quiz=null;actions.home();state.completed=C.lessons.map(l=>l.id);actions.profile();render();actions.content();render();assert(document.querySelector('#app').textContent.includes('Recommended for B2.2'),'graduate gets current-level recommendations');
   state.active=null;quiz=null;actions.home();render();window.scrollTo(0,0);

   // Quality release: the previous 28,556 checks remain above, unchanged.
   state={...E.fresh(),onboarded:true,grammarLevel:'B2.2',completed:C.lessons.map(l=>l.id)};state.focused=F.empty();quiz=null;actions.home();window.FriendsToAmigosInsets(config.top||24,config.bottom,config.left||0,config.right||0,false,0);render();
   const protectedCourse=JSON.stringify({completed:state.completed,capabilities:state.capabilities,stage:state.stage,startStage:state.startStage});
   actions.grammarReference();render();assert(document.querySelectorAll('[data-action=grammarEntry]').length===GrammarSyllabus.concepts.length,'every syllabus concept has a reference');assert(document.documentElement.scrollWidth<=innerWidth+1,'grammar index wraps');
   actions.grammarEntry({dataset:{id:'present-regular-er'}});render();assert(document.querySelector('#app').textContent.includes('coméis'),'reference includes vosotros -ER');document.querySelector('article details').open=true;await frame();assert(document.querySelectorAll('article dt').length===6,'reference has six Spain-first rows');window.scrollTo(0,document.documentElement.scrollHeight);await frame();assert(document.querySelector('[data-action=qualityPractice]').getBoundingClientRect().bottom<=innerHeight-config.bottom+1,'reference practice control reachable');
   actions.qualityPractice({dataset:{id:'present-regular-er'}});render();assert(quiz.questions.length===5&&quiz.kind==='practice','reference starts bounded mini-practice');assert(document.querySelector('.confidence'),'recall practice offers optional confidence');const firstMini=currentQuestion();actions.qualityConfidence({dataset:{value:'unsure'}});actions.answer({dataset:{index:String(firstMini.options.indexOf(firstMini.answer))}});actions.check();render();assert(quiz.answers[0]===true,'unsure never changes objective correctness');assert(state.events.at(-1).confidence==='unsure','confidence evidence recorded');assert(JSON.stringify({completed:state.completed,capabilities:state.capabilities,stage:state.stage,startStage:state.startStage})===protectedCourse,'reference practice cannot complete or place course');
   state.active=null;quiz=null;actions.lesson({dataset:{id:'a12u0l0'}});render();const originalTarget=currentQuestion().answer;assert(document.querySelector('[data-action=spanishHelp]'),'Spanish help before English');assert(!quiz.spanishHelpRevealed&&!quiz.hintRevealed,'support ladder starts hidden');actions.spanishHelp();render();assert(quiz.spanishHelpRevealed&&!quiz.hintRevealed,'Spanish help is separate');assert(!document.querySelector('#english-hint'),'English remains hidden after Spanish help');assert(currentQuestion().answer===originalTarget,'support preserves target');actions.englishHint();render();assert(document.querySelector('#english-hint'),'English remains available');assert(document.documentElement.scrollWidth<=innerWidth+1,'support ladder fits large text');
   state.active=null;quiz=null;M.record(state,[{key:'concept:present-regular-er'}],false,{item:'one',session:'weak1'},Date.now());M.record(state,[{key:'concept:present-regular-er'}],false,{item:'two',session:'weak2'},Date.now());actions.weakAreas();render();assert(document.querySelector('[data-action=refresher]'),'weak concept offers refresher');actions.refresher({dataset:{key:'concept:present-regular-er'}});render();assert(document.querySelector('#app').textContent.includes('60–90 second refresher'),'micro-lesson explains before practice');assert(document.documentElement.scrollWidth<=innerWidth+1,'micro-lesson fits');assert(FriendsToAmigos.handleBack()&&screen==='weak','Back from micro-lesson returns Weak Areas');
   state.focused=F.empty();quiz=null;actions.shadowing();render();const shadowModel=currentQuestion().spanish;assert(currentQuestion().shadowing,'shadowing reuses eligible speaking material');assert(!document.querySelector('#app').textContent.includes(shadowModel),'shadowing phrase hidden until listen/reveal');actions.revealModel();actions.selfAssess({dataset:{result:'got'}});assert(!quiz.modelRevealed&&!quiz.answers.length,'shadowing cannot self-assess before audio');actions.listen();await frame();render();assert(quiz.audioPlayed,'shadowing waits for successful speech start');actions.listenSpeed({dataset:{rate:'1'}});assert(quiz.listenRate===1&&!quiz.answers.length,'shadowing normal speed does not answer');actions.listenSpeed({dataset:{rate:'.75'}});assert(quiz.listenRate===.75,'shadowing slow speed');actions.revealModel();render();assert(document.querySelector('#app').textContent.includes(shadowModel),'phrasing reveals only after audio');actions.selfAssess({dataset:{result:'needs'}});render();assert(state.events.at(-1).selfAssessed,'shadowing is self-assessed evidence');assert(state.reviews[currentQuestion().id],'shadowing need returns to review');const shadowSnapshot=JSON.stringify(state.focused.active);FriendsToAmigos.handleBack();actions.focusedResume();render();assert(JSON.stringify(state.focused.active)===shadowSnapshot,'shadowing interruption resumes safe snapshot');assert(document.documentElement.scrollWidth<=innerWidth+1,'shadowing controls fit');
   quiz.index=quiz.questions.length;quiz.answers=quiz.questions.map(()=>false);render();assert(document.querySelector('[data-action=focusedMistakes]'),'focused sessions offer mistake-only retry');
   quiz=null;state.active=null;actions.dailyReview();render();assert(quiz&&quiz.kind==='review','Today Review includes due shadowing and course evidence');quiz.answers=quiz.questions.map(()=>true);quiz.index=quiz.questions.length;render();assert(document.querySelector('.review-summary'),'daily review provides a meaningful summary');assert(document.querySelector('.review-summary').textContent.includes('Course completion'),'review distinguishes mastery from completion');assert(document.documentElement.scrollWidth<=innerWidth+1,'review summary fits');
   quiz=null;actions.home();render();window.scrollTo(0,0);

   return {scenario:config.name,width:innerWidth,height:innerHeight,dark:config.dark,nativeInsets:true,simulatedKeyboard:Boolean(config.keyboard),insets:{top:config.top||24,bottom:config.bottom,left:config.left||0,right:config.right||0},fontScale:config.fontScale||1,checks};
  })()`);
  await evaluate(sessionId,"document.querySelectorAll('.toast').forEach(e=>e.remove());");
  const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);fs.writeFileSync(path.join(output,config.name+'.png'),Buffer.from(screenshot.data,'base64'));totalChecks+=report.checks;console.log('PASS '+config.name+' ('+report.checks+' checks)');fs.writeFileSync(path.join(output,config.name+'.json'),JSON.stringify(report,null,2));
  if(['s24-dark-buttons','narrow-light-buttons','landscape-dark-cutout','s24-dark-large-text'].includes(config.name)||config.name.startsWith('galaxy-')){
   await evaluate(sessionId,`(async()=>{window.FriendsToAmigosInsets(${config.top||24},${config.bottom},${config.left||0},${config.right||0},false,0);actions.leave();actions.tab({dataset:{tab:'Games'}});actions.gameNew();actions.gameLeave();render();window.scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));})()`);
   for(const view of ['home-v13','profile-v13','recommendations-v13','cloze-v13','tiles-v13','completion-v13','learn-v13','structured-feedback-v13','review-v13','grammar-reference','weak-refresher','spanish-support','confidence-review','shadowing-quality','quality-review-summary','games','round','feedback','tables','table-feedback','listening-first','listening-compact','listening-result','speaking-first','speaking-compact','speaking-result','spanish-course','spanish-hint','spanish-listening','a22-writing','a22-transition','b11-writing','a22-story','a22-tables','b22-writing','b22-story','b22-writing-feedback','dictionary-popup','saved-words','opening-first','opening-second','opening-third','opening-story','opening-recall','opening-transfer','mixed-question','choice-dictionary','choice-selected','dictionary-more','saved-keyboard','writing-keyboard']){
    if(view==='home-v13')await fixture(sessionId,"state={...E.fresh(),name:'Alex',onboarded:true};quiz=null;actions.home();render();window.scrollTo(0,0);");
    if(view==='profile-v13')await fixture(sessionId,"actions.profile();render();window.scrollTo(0,0);");
    if(view==='recommendations-v13')await fixture(sessionId,"actions.content();render();window.scrollTo(0,0);");
    if(view==='cloze-v13')await fixture(sessionId,"const l=C.lessons.find(l=>l.stage==='A2.1'&&l.questions.some(q=>q.type==='cloze'));startQuiz('lesson',l.questions,l);quiz.index=l.questions.findIndex(q=>q.type==='cloze');quiz.answers=Array(quiz.index).fill(true);render();window.scrollTo(0,0);");
    if(view==='tiles-v13')await fixture(sessionId,"const l=C.lessons.find(l=>l.id==='a12u0l0');startQuiz('lesson',l.questions,l);quiz.index=l.questions.findIndex(q=>q.type==='tiles');quiz.answers=Array(quiz.index).fill(true);render();window.scrollTo(0,0);");
    if(view==='completion-v13')await fixture(sessionId,"state.active=null;state.completed=[];actions.begin();quiz.answers=quiz.questions.map(()=>true);quiz.index=quiz.questions.length;render();window.scrollTo(0,0);");
    if(view==='learn-v13')await fixture(sessionId,"actions.home();actions.tab({dataset:{tab:'Learn'}});viewStage='A1.1';render();window.scrollTo(0,0);");
    if(view==='structured-feedback-v13')await fixture(sessionId,"const l=C.lessons.find(l=>l.id==='u0l1');startQuiz('lesson',l.questions,l);quiz.index=4;quiz.answers=Array(4).fill(true);quiz.selected=JSON.stringify(Structured.selection(Structured.canonical(currentQuestion())).reverse());actions.check();render();window.scrollTo(0,document.documentElement.scrollHeight);");
    if(view==='review-v13')await fixture(sessionId,"actions.leave();actions.reviewHome();render();window.scrollTo(0,0);");
    if(view==='grammar-reference')await fixture(sessionId,"actions.grammarReference();actions.grammarEntry({dataset:{id:'present-regular-er'}});render();document.querySelector('article details').open=true;window.scrollTo(0,0);");
    if(view==='weak-refresher')await fixture(sessionId,"actions.refresher({dataset:{key:'concept:present-regular-er'}});render();window.scrollTo(0,0);");
    if(view==='spanish-support')await fixture(sessionId,"actions.lesson({dataset:{id:'a12u0l0'}});actions.spanishHelp();render();window.scrollTo(0,0);");
    if(view==='confidence-review')await fixture(sessionId,"startQuiz('review',LearningQuality.practice(state,C,'present-regular-er'));actions.qualityConfidence({dataset:{value:'unsure'}});render();window.scrollTo(0,0);");
    if(view==='shadowing-quality')await fixture(sessionId,"state.focused=F.empty();state.completed=C.lessons.map(l=>l.id);quiz=null;actions.shadowing();actions.listen();");
    if(view==='quality-review-summary')await fixture(sessionId,"quiz=null;startQuiz('review',LearningQuality.practice(state,C,'present-regular-er'));quiz.answers=quiz.questions.map((q,i)=>i<3);quiz.index=quiz.questions.length;render();window.scrollTo(0,0);");
    if(view==='games')await fixture(sessionId,"state.completed=C.lessons.map(l=>l.id);state.grammarLevel='A2.1';state.games=G.empty();state.blanks=B.empty();quiz=null;actions.tab({dataset:{tab:'Games'}});actions.gameNew();actions.gameLeave();render();window.scrollTo(0,0);");
    if(view==='round')await fixture(sessionId,"actions.gameResume();render();window.scrollTo(0,0);");
    if(view==='tables')await fixture(sessionId,"state.blanks.active=null;actions.blanksNormal();render();window.scrollTo(0,0);");
    if(view==='table-feedback')await fixture(sessionId,"const a=state.blanks.active,t=a.tables[0];a.selected=t.rows.map((row,j)=>j===0?t.options[j].find(v=>v!==t.target.forms[row]):t.target.forms[row]);actions.blanksCheck();render();window.scrollTo(0,document.documentElement.scrollHeight);");
    if(view==='feedback')await fixture(sessionId,"state.games.active.selected=state.games.active.questions[state.games.active.index].blanks.map(b=>b.options.find(x=>x!==b.answer));actions.gameCheck();render();window.scrollTo(0,document.documentElement.scrollHeight);");
    if(view==='listening-first')await fixture(sessionId,"quiz=null;state.focused=F.empty();state.focused.seenInstructions.listening=false;actions.mediaPractice({dataset:{kind:'listening',stage:'A2.1'}});render();window.scrollTo(0,0);");
    if(view==='listening-compact')await fixture(sessionId,"state.focused.seenInstructions.listening=true;render();window.scrollTo(0,0);");
    if(view==='listening-result')await fixture(sessionId,"quiz.answers=quiz.questions.map((q,i)=>i<8);quiz.index=10;finishQuiz();render();window.scrollTo(0,0);");
    if(view==='speaking-first')await fixture(sessionId,"state.focused.seenInstructions.speaking=false;actions.mediaPractice({dataset:{kind:'speaking',stage:'A2.1'}});quiz.questions[0]=FocusedBank.items.filter(q=>q.practice.kind==='speaking'&&q.practice.stage==='A2.1').sort((a,b)=>b.prompt.length-a.prompt.length)[0];render();window.scrollTo(0,0);");
    if(view==='speaking-compact')await fixture(sessionId,"state.focused.seenInstructions.speaking=true;actions.revealModel();render();window.scrollTo(0,0);");
    if(view==='speaking-result')await fixture(sessionId,"quiz.answers=quiz.questions.map((q,i)=>i<7);quiz.index=10;finishQuiz();render();window.scrollTo(0,0);");
    if(view==='spanish-course')await fixture(sessionId,"actions.lesson({dataset:{id:'a12u0l0'}});render();window.scrollTo(0,0);");
    if(view==='spanish-hint')await fixture(sessionId,"actions.englishHint();render();window.scrollTo(0,0);");
    if(view==='spanish-listening')await fixture(sessionId,"const l=C.lessons.find(l=>l.stage==='A2.1'&&l.questions.some(q=>q.listening));startQuiz('lesson',l.questions,l);quiz.index=l.questions.findIndex(q=>q.listening);quiz.answers=quiz.questions.slice(0,quiz.index).map(()=>true);actions.englishHint();render();window.scrollTo(0,0);");
    if(view==='a22-writing')await fixture(sessionId,"actions.lesson({dataset:{id:'a22u7write'}});render();actions.englishHint();render();window.scrollTo(0,0);");
    if(view==='a22-transition')await fixture(sessionId,"actions.lesson({dataset:{id:'a22u0write'}});quiz.index=quiz.questions.findIndex(q=>q.type==='text');quiz.answers=Array(quiz.index).fill(true);render();actions.englishHint();render();window.scrollTo(0,0);");
    if(view==='b11-writing')await fixture(sessionId,"actions.lesson({dataset:{id:'b11u0write'}});quiz.index=quiz.questions.findIndex(q=>q.type==='text');quiz.answers=Array(quiz.index).fill(true);render();actions.englishHint();render();window.scrollTo(0,0);");
    if(view==='a22-story')await fixture(sessionId,"actions.lesson({dataset:{id:'a22u7story3'}});render();window.scrollTo(0,0);");
    if(view==='a22-tables')await fixture(sessionId,"state.grammarLevel='A2.2';state.blanks.active=null;state.blanks.active=B.build(state,C,{mode:'practice',count:3,scope:'custom',filters:{level:'A2.2',grammar:'imperfect'}});screen='blanks';render();window.scrollTo(0,0);");
    if(view==='b22-writing')await fixture(sessionId,"actions.lesson({dataset:{id:'b22u7write'}});quiz.index=4;quiz.answers=[true,null,true,null];render();window.scrollTo(0,0);");
    if(view==='b22-story')await fixture(sessionId,"actions.lesson({dataset:{id:'b22u7story3'}});render();window.scrollTo(0,0);");
    if(view==='b22-writing-feedback')await fixture(sessionId,"actions.lesson({dataset:{id:'b22u7write'}});quiz.index=4;quiz.answers=[true,null,true,null];quiz.selected='Mi llamo Ana. Tengo una propuesta distinta.';actions.check();render();window.scrollTo(0,document.documentElement.scrollHeight);");
    if(view==='dictionary-popup')await fixture(sessionId,"actions.lesson({dataset:{id:C.lessons.find(l=>l.stage==='A1.1'&&l.reading&&l.reading.text.includes('Tengo hambre.')).id}});render();window.scrollTo(0,0);const token=[...document.querySelectorAll('.story p [data-dictionary-token]')].find(e=>e.textContent==='Tengo');token.scrollIntoView({block:'center'});token.click();");
    if(view==='saved-words')await fixture(sessionId,"dictionaryUI.saveCurrent();dictionaryUI.close();actions.profile();actions.savedWords();render();window.scrollTo(0,0);");
    if(view==='opening-first'||view==='opening-second'||view==='opening-third')await fixture(sessionId,"dictionaryUI.close();state.dictionaryTipSeen="+(view!=='opening-first')+";window.FriendsToAmigosInsets("+(config.top||24)+","+config.bottom+","+(config.left||0)+","+(config.right||0)+",false,0);actions.lesson({dataset:{id:'"+({ 'opening-first':'u0l0','opening-second':'u0l1','opening-third':'u0l2' }[view])+"'}});render();window.scrollTo(0,0);");
    if(view==='opening-story')await fixture(sessionId,"actions.lesson({dataset:{id:'u0story0'}});render();window.scrollTo(0,0);");
    if(view==='opening-recall')await fixture(sessionId,"actions.lesson({dataset:{id:'u0l1'}});quiz.index=quiz.questions.findIndex(q=>Structured.active(q));quiz.answers=Array(quiz.index).fill(true);render();window.scrollTo(0,0);");
    if(view==='opening-transfer')await fixture(sessionId,"actions.lesson({dataset:{id:'u0l2'}});quiz.index=quiz.questions.findIndex(q=>Structured.active(q)&&q.answer.includes('Luis'));quiz.answers=Array(quiz.index).fill(true);render();window.scrollTo(0,0);");
    if(view==='mixed-question')await fixture(sessionId,"const l=C.lessons.find(l=>l.id==='u0l0'),q={...l.questions[3],type:'choice',prompt:'Luis says “¿Cómo te llamas?” What answers his question?',options:['Hasta luego','Me llamo Ana','Soy de Inglaterra'],answer:'Me llamo Ana',explanation:'Me llamo Ana gives your name.'};delete q.promptEs;delete q.teachingModel;delete q.spanishFragments;delete q.optionsLanguage;delete q.optionLanguages;delete q.optionSpanishFragments;startQuiz('lesson',[q],{...l,questions:[q]});render();window.scrollTo(0,0);");
    if(view==='choice-dictionary')await fixture(sessionId,"const word=[...document.querySelectorAll('.choice [data-dictionary-token]')].find(t=>t.textContent==='llamo');word.scrollIntoView({block:'center'});word.click();");
    if(view==='choice-selected')await fixture(sessionId,"dictionaryUI.close();document.querySelectorAll('.quiz-choices .choice')[1].click();window.scrollTo(0,0);");
    if(view==='dictionary-more')await fixture(sessionId,"const word=[...document.querySelectorAll('.choice [data-dictionary-token]')].find(t=>t.textContent==='llamo');word.scrollIntoView({block:'center'});word.click();document.querySelector('[data-dict-action=more]').click();");
    if(view==='saved-keyboard')await fixture(sessionId,"dictionaryUI.close();actions.profile();actions.savedWords();render();const field=document.querySelector('#saved-word-search');field.focus();window.FriendsToAmigosInsets("+(config.top||24)+","+config.bottom+","+(config.left||0)+","+(config.right||0)+",true,"+(config.overlap||Math.round(config.height*.38))+");");
    if(view==='writing-keyboard')await fixture(sessionId,"actions.lesson({dataset:{id:'b22u7write'}});quiz.index=4;quiz.answers=[true,null,true,null];render();document.querySelector('textarea').focus();window.FriendsToAmigosInsets("+(config.top||24)+","+config.bottom+","+(config.left||0)+","+(config.right||0)+",true,"+(config.overlap||Math.round(config.height*.38))+");window.scrollTo(0,document.documentElement.scrollHeight);");
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
