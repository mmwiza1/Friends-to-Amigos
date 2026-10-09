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
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++counter,timer=setTimeout(()=>{pending.delete(id);reject(Error('DevTools timeout: '+method+': '+errors));},['Browser.getVersion','Target.createTarget'].includes(method)?60000:15000);pending.set(id,{resolve,reject,timer});child.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');});}
async function evaluate(session,expression){const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},session);if(result.exceptionDetails)throw Error(result.exceptionDetails.text+': '+(result.exceptionDetails.exception?.description||''));return result.result.value;}
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
  {name:'s24-dark-large-text',width:384,height:824,dark:true,bottom:48,fontScale:1.25}
 ];
 let totalChecks=0;
 for(const config of scenarios){
  await send('Emulation.setDeviceMetricsOverride',{width:config.width,height:config.height,deviceScaleFactor:1,mobile:true},sessionId);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:config.dark?'dark':'light'}]},sessionId);
  const navigation=await send('Page.navigate',{url:'file://'+path.resolve('www/index.html')},sessionId);if(navigation.errorText)throw Error('Navigation failed: '+navigation.errorText);
  await evaluate(sessionId,`new Promise((resolve,reject)=>{const started=Date.now();function ready(){if(window.FriendsToAmigos&&window.ViewportTools)resolve(true);else if(Date.now()-started>5000)reject(Error('App did not load'));else setTimeout(ready,10);}ready();})`);
  const report=await evaluate(sessionId,`(async()=>{
   let checks=0;const config=${JSON.stringify(config)},assert=(ok,message)=>{checks++;if(!ok)throw Error(config.name+': '+message);},frame=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
   document.body.style.fontSize=((config.fontScale||1)*16)+'px';localStorage.clear();state=E.fresh();state.onboarded=true;storageContext={readOnly:false};screen='main';tab='Learn';viewStage='A1.2';quiz=null;render();
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
   const table=state.blanks.active.tables[0];let tableInput=document.querySelector('.table-input');tableInput.focus();window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,Boolean(config.keyboard),config.overlap||0);await frame();assert(tableInput.getBoundingClientRect().bottom<=innerHeight-(config.overlap||0)+1,'table recall stays above keyboard');
   const htmlBefore=document.querySelector('#app').innerHTML;tableInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(!state.blanks.active.checked&&document.querySelector('#app').innerHTML===htmlBefore,'empty table Go does not submit or replace input');
   table.rows.forEach((row,j)=>{const input=document.querySelector('#form-'+j);input.value=j===0?'wrong form':table.target.forms[row];input.dispatchEvent(new Event('input',{bubbles:true}));});tableInput.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert(state.blanks.active.checked,'table Go checks populated recall');assert(document.querySelector('.feedback').textContent.includes('wrong form'),'typed table feedback keeps answer');
   const resultCount=state.blanks.active.results.length;document.querySelector('[data-action=blanksCheck]')?.click();assert(state.blanks.active.results.length===resultCount,'table cannot double check');FriendsToAmigos.handleBack();window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,false,0);
   actions.weakAreas();render();assert(document.querySelector('h2').textContent==='Weak Areas / Mistakes','connected weakness screen');assert(FriendsToAmigos.handleBack()&&tab==='Review','weakness Back returns Review');actions.home();render();assert(document.querySelector('[data-action=dailyReview]'),'daily review is easy to find');
   startQuiz('lesson',lesson.questions,lesson);
   // Leave a representative written question ready for visual inspection.
   quiz.index=textIndex;quiz.selected=null;quiz.checked=false;quiz.answers=[];render();window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,Boolean(config.keyboard),config.overlap||0);
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
   window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,false,0);window.confirm=()=>true;
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
   window.FriendsToAmigosInsets(24,config.bottom,config.left||0,0,false,0);
   state=E.fresh();state.onboarded=true;quiz=null;actions.home();render();
   const navOrder=()=>[...document.querySelectorAll('nav [data-tab]')].map(e=>e.dataset.tab).join('|');
   assert(navOrder()==='Home|Learn|Games|Review|Profile','dictionary preserves permanent navigation order');
   const dictionaryLesson=C.lessons.find(l=>l.stage==='A1.1'&&l.reading&&l.reading.text.includes('Tengo hambre.'));
   assert(Boolean(dictionaryLesson),'authored hunger story available for contextual lookup');
   actions.lesson({dataset:{id:dictionaryLesson.id}});render();window.scrollTo(0,0);await frame();
   const dictionaryBefore=()=>{const value=JSON.parse(JSON.stringify(state));delete value.savedWords;return JSON.stringify(value);};
   const untouched=dictionaryBefore(),snapshot=JSON.stringify(state.active),storyText=document.querySelector('.story p[data-dictionary]').textContent;
   assert(storyText===dictionaryLesson.reading.text,'dictionary tokenisation preserves authored story text');
   let token=[...document.querySelectorAll('.story p [data-dictionary-token]')].find(e=>e.textContent==='Tengo');
   assert(token&&token.getAttribute('role')==='button'&&token.tabIndex===0,'Spanish words have accessible delegated lookup');
   token.scrollIntoView({block:'center'});await frame();token.click();await frame();
   let popup=document.querySelector('.dictionary-popup');
   assert(popup&&!popup.hidden&&popup.getAttribute('role')==='dialog','contextual popup opens without lesson navigation');
   assert(popup.textContent.includes('tener hambre')&&popup.textContent.includes('to be hungry'),'phrase meaning takes priority over isolated hunger');
   assert(popup.querySelector('[data-dict-action=save]').textContent==='Save phrase','recognized construction saves useful phrase');
   const bounded=label=>{const bounds=popup.getBoundingClientRect();assert(bounds.left>=(config.left||0)+9&&bounds.right<=innerWidth-9,label+' horizontal usable viewport');assert(bounds.top>=33&&bounds.bottom<=innerHeight-config.bottom-9,label+' clears Android system bars');};
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
   search=document.querySelector('#saved-word-search');search.value='no match at all';search.dispatchEvent(new Event('input',{bubbles:true}));assert(document.querySelector('#app').textContent.includes('No saved words match'),'empty search explained');search=document.querySelector('#saved-word-search');search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));
   const recentTimes=state.savedWords.map((row,i)=>({...row,savedAt:i+100}));state.savedWords=recentTimes;render();document.querySelector('[data-action=savedFilter][data-filter=recent]').click();assert(document.querySelector('.saved-word-row h3').textContent==='pan','Recently saved orders latest first');
   const savedSpeech=utterances.length;document.querySelector('[data-action=savedPronounce]').click();assert(utterances.length===savedSpeech+1&&utterances.at(-1).lang==='es-ES','saved vocabulary pronunciation uses es-ES');
   document.querySelector('[data-action=savedOpen]').click();assert(!document.querySelector('.dictionary-popup').hidden,'saved row reopens full dictionary');assert(FriendsToAmigos.handleBack()&&screen==='savedWords','Back closes saved entry first');
   document.querySelector('[data-action=savedRemove]').click();assert(state.savedWords.length===1&&document.querySelectorAll('.saved-word-row').length===1,'Remove persists without changing course');
   assert(document.documentElement.scrollWidth<=innerWidth+1,'Saved Words fits narrow large-text and landscape screens');window.scrollTo(0,0);assert(FriendsToAmigos.handleBack()&&tab==='Profile'&&screen==='main','Saved Words Back returns Profile');
   actions.tab({dataset:{tab:'Review'}});render();assert(document.querySelector('[data-action=review]'),'Review remains directly accessible after saved words');
   const listenLesson=C.lessons.find(l=>l.stage==='A2.1'&&l.questions.some(q=>q.listening));startQuiz('lesson',listenLesson.questions,listenLesson);quiz.index=listenLesson.questions.findIndex(q=>q.listening);quiz.answers=Array(quiz.index).fill(true);render();
   assert(!document.querySelector('.listening [data-dictionary-token]'),'dictionary cannot expose hidden listening transcript');assert(!document.querySelector('[role=radio] [data-dictionary-token]'),'dictionary cannot intercept answer options');
   const speakLesson=C.lessons.find(l=>l.questions.some(q=>q.type==='speaking'));startQuiz('lesson',speakLesson.questions,speakLesson);quiz.index=speakLesson.questions.findIndex(q=>q.type==='speaking');render();assert(![...document.querySelectorAll('[data-dictionary]')].some(e=>e.textContent===currentQuestion().spanish),'dictionary cannot expose unrevealed speaking model');
   actions.revealModel();render();assert([...document.querySelectorAll('[data-dictionary]')].some(e=>e.textContent===currentQuestion().spanish&&e.querySelector('[data-dictionary-token]')),'revealed model offers dictionary safely');FriendsToAmigos.handleBack();
   // Leave original screenshot subjects eligible; this does not grant game mastery.
   state.completed=C.lessons.map(l=>l.id);state.stage='A2.1';state.grammarLevel='A2.1';state.games.active=null;state.blanks.active=null;state.focused=F.empty();quiz=null;actions.home();render();
   return {scenario:config.name,width:innerWidth,height:innerHeight,dark:config.dark,nativeInsets:true,simulatedKeyboard:Boolean(config.keyboard),checks};
  })()`);
  await evaluate(sessionId,"document.querySelectorAll('.toast').forEach(e=>e.remove());");
  const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);fs.writeFileSync(path.join(output,config.name+'.png'),Buffer.from(screenshot.data,'base64'));totalChecks+=report.checks;console.log('PASS '+config.name+' ('+report.checks+' checks)');fs.writeFileSync(path.join(output,config.name+'.json'),JSON.stringify(report,null,2));
  if(['s24-dark-buttons','narrow-light-buttons','landscape-dark-cutout','s24-dark-large-text'].includes(config.name)){
   await evaluate(sessionId,`(async()=>{window.FriendsToAmigosInsets(24,${config.bottom},${config.left||0},0,false,0);actions.leave();actions.tab({dataset:{tab:'Games'}});actions.gameNew();actions.gameLeave();render();window.scrollTo(0,0);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));})()`);
   for(const view of ['games','round','feedback','tables','table-feedback','listening-first','listening-compact','listening-result','speaking-first','speaking-compact','speaking-result','spanish-course','spanish-hint','spanish-listening','a22-writing','a22-story','a22-tables','b22-writing','b22-story','b22-writing-feedback','dictionary-popup','saved-words']){
    if(view==='round')await evaluate(sessionId,"actions.gameResume();render();window.scrollTo(0,0);");
    if(view==='tables')await evaluate(sessionId,"state.blanks.active=null;actions.blanksNormal();render();window.scrollTo(0,0);");
    if(view==='table-feedback')await evaluate(sessionId,"const a=state.blanks.active,t=a.tables[0];a.selected=t.rows.map((row,j)=>j===0?t.options[j].find(v=>v!==t.target.forms[row]):t.target.forms[row]);actions.blanksCheck();render();window.scrollTo(0,document.documentElement.scrollHeight);");
    if(view==='feedback')await evaluate(sessionId,"state.games.active.selected=state.games.active.questions[state.games.active.index].blanks.map(b=>b.options.find(x=>x!==b.answer));actions.gameCheck();render();window.scrollTo(0,document.documentElement.scrollHeight);");
    if(view==='listening-first')await evaluate(sessionId,"quiz=null;state.focused.active=null;state.focused.seenInstructions.listening=false;actions.mediaPractice({dataset:{kind:'listening',stage:'A2.1'}});render();window.scrollTo(0,0);");
    if(view==='listening-compact')await evaluate(sessionId,"state.focused.seenInstructions.listening=true;render();window.scrollTo(0,0);");
    if(view==='listening-result')await evaluate(sessionId,"quiz.answers=quiz.questions.map((q,i)=>i<8);quiz.index=10;finishQuiz();render();window.scrollTo(0,0);");
    if(view==='speaking-first')await evaluate(sessionId,"state.focused.seenInstructions.speaking=false;actions.mediaPractice({dataset:{kind:'speaking',stage:'A2.1'}});quiz.questions[0]=FocusedBank.items.filter(q=>q.practice.kind==='speaking'&&q.practice.stage==='A2.1').sort((a,b)=>b.prompt.length-a.prompt.length)[0];render();window.scrollTo(0,0);");
    if(view==='speaking-compact')await evaluate(sessionId,"state.focused.seenInstructions.speaking=true;actions.revealModel();render();window.scrollTo(0,0);");
    if(view==='speaking-result')await evaluate(sessionId,"quiz.answers=quiz.questions.map((q,i)=>i<7);quiz.index=10;finishQuiz();render();window.scrollTo(0,0);");
    if(view==='spanish-course')await evaluate(sessionId,"actions.lesson({dataset:{id:'a12u0l0'}});render();window.scrollTo(0,0);");
    if(view==='spanish-hint')await evaluate(sessionId,"actions.englishHint();render();window.scrollTo(0,0);");
    if(view==='spanish-listening')await evaluate(sessionId,"const l=C.lessons.find(l=>l.stage==='A2.1'&&l.questions.some(q=>q.listening));startQuiz('lesson',l.questions,l);quiz.index=l.questions.findIndex(q=>q.listening);quiz.answers=quiz.questions.slice(0,quiz.index).map(()=>true);actions.englishHint();render();window.scrollTo(0,0);");
    if(view==='a22-writing')await evaluate(sessionId,"actions.lesson({dataset:{id:'a22u7write'}});render();actions.englishHint();render();window.scrollTo(0,0);");
    if(view==='a22-story')await evaluate(sessionId,"actions.lesson({dataset:{id:'a22u7story3'}});render();window.scrollTo(0,0);");
    if(view==='a22-tables')await evaluate(sessionId,"state.grammarLevel='A2.2';state.blanks.active=null;state.blanks.active=B.build(state,C,{mode:'practice',count:3,scope:'custom',filters:{level:'A2.2',grammar:'imperfect'}});screen='blanks';render();window.scrollTo(0,0);");
    if(view==='b22-writing')await evaluate(sessionId,"actions.lesson({dataset:{id:'b22u7write'}});quiz.index=4;quiz.answers=[true,null,true,null];render();window.scrollTo(0,0);");
    if(view==='b22-story')await evaluate(sessionId,"actions.lesson({dataset:{id:'b22u7story3'}});render();window.scrollTo(0,0);");
    if(view==='b22-writing-feedback')await evaluate(sessionId,"actions.lesson({dataset:{id:'b22u7write'}});quiz.index=4;quiz.answers=[true,null,true,null];quiz.selected='Mi llamo Ana. Tengo una propuesta distinta.';actions.check();render();window.scrollTo(0,document.documentElement.scrollHeight);");
    if(view==='dictionary-popup')await evaluate(sessionId,"actions.lesson({dataset:{id:C.lessons.find(l=>l.stage==='A1.1'&&l.reading&&l.reading.text.includes('Tengo hambre.')).id}});render();window.scrollTo(0,0);const token=[...document.querySelectorAll('.story p [data-dictionary-token]')].find(e=>e.textContent==='Tengo');token.scrollIntoView({block:'center'});token.click();");
    if(view==='saved-words')await evaluate(sessionId,"dictionaryUI.saveCurrent();dictionaryUI.close();actions.profile();actions.savedWords();render();window.scrollTo(0,0);");
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
