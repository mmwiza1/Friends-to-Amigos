'use strict';
const C=Curriculum,E=Engine,P=ProgressStore,storeKey=P.KEY;let storageContext=P.load(localStorage,C),state=storageContext.state;
let tab='Home',screen='main',quiz=null,filter='all',topicFilter=null,lastTick=Date.now(),lastInteraction=Date.now(),viewStage=C.playableStages.includes(state.active?.lesson?.stage)?state.active.lesson.stage:C.playableStages.includes(state.stage)?state.stage:'A1.1';const app=document.getElementById('app'),viewport=ViewportTools.create(window);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Saved attempts and review items are snapshots. Never substitute rewritten
// questions mid-attempt, even when a previous app version had fewer questions.
let gameResult=null;const G=Conjugations;
let media,nativePaused=false,listenRate=.75,todaySession=null,quizReturn={tab:'Home',screen:'main'};
function save(){if(!P.save(localStorage,state,storageContext))toast(storageContext.readOnly?'The original save is protected. Export it before recovery.':'Storage is unavailable. Export your progress from Profile.');}

function toast(t){const el=document.createElement('div');el.className='toast';el.textContent=t;document.body.append(el);setTimeout(()=>el.remove(),3500);}
function b(label,action,cls='pill',extra=''){return `<button class="${cls}" data-action="${action}" ${extra}>${label}</button>`;}
media=SpeechTools.create(window,toast);
const playFeedback=correct=>media.playFeedback(correct),speak=text=>media.speak(text);
function due(){return Object.values(state.reviews).filter(r=>r.due<=Date.now());}
function nextLesson(){return CoursePath.next(state,C);}
function header(){return '<header><div><h1>Friends to<br>Amigos<span style="color:var(--coral)"> ✦</span></h1><p class="tagline">A little Spanish, every day.</p></div><span class="flag" aria-label="Spanish flag">🇪🇸</span></header>';}
function nav(){return `<nav aria-label="Main navigation">${['Home','Learn','Games','Review','Profile'].map((t,i)=>b(`<span aria-hidden="true">${['⌂','▤','⚄','↻','☺'][i]}</span>${t}${t==='Review'&&due().length?`<strong class="badge">${due().length}</strong>`:''}`,'tab',''+(tab===t?'active':''),`data-tab="${t}"`)).join('')}</nav>`;}
function render(){if(screen==='game'){renderGame();return;}if(screen==='gameResult'){app.innerHTML=header()+GamesView.result({state,C,G,round:gameResult,b,esc});viewport.refresh();return;}if(screen==='quiz'){renderQuiz();return;}let html=header()+(storageContext.readOnly?'<p class="notice" role="status">Your saved progress needs recovery and is protected from changes. Export the original file from Profile before updating or recovering it.</p>':'');if(screen==='onboard')html+=onboard();else if(screen==='placementResult')html+=placementScreen();else if(screen==='practice')html+=practiceScreen();else if(screen==='achievements')html+=achievements();else html+={Home:home,Learn:learn,Games:()=>GamesView.hub({state,C,G,b,esc}),Review:review,Profile:profile}[tab]();app.innerHTML=html+(screen==='main'?nav():'');viewport.refresh();}
function activeStage(){return state.active?.lesson?.stage||nextLesson()?.stage||(C.playableStages.includes(state.stage)?state.stage:'A1.1');}
function startQuiz(kind,questions,lesson=null){quizReturn={tab,screen:screen==='quiz'?'main':screen};media.stop();if(!questions.length){toast('No practice questions are ready.');return;}if(lesson)viewStage=lesson.stage;quiz={kind,questions,lesson,index:0,answers:[],selected:null,checked:false,readingReady:false,modelRevealed:false,audioPlayed:false,audioUnavailable:false,audioLoading:false,listenRate};screen='quiz';persistQuiz();render();}
function persistQuiz(){if(quiz&&quiz.kind==='lesson'){state.active=JSON.parse(JSON.stringify(quiz));delete state.active.audioLoading;delete state.active.listenRate;save();}}
function renderQuiz(){if(quiz.index>=quiz.questions.length){finishQuiz();return;}app.innerHTML=(storageContext.readOnly?'<p class="notice" role="status">Temporary practice: your original save is protected. Export it from Profile before recovery; these attempts cannot be saved.</p>':'')+QuizView.render({quiz,E,b,esc,readingCard,lessonGoal});viewport.refresh();}

function finishQuiz(){const scored=quiz.answers.filter((_,i)=>quiz.questions[i].type!=='speaking'),score=scored.filter(Boolean).length,total=scored.length;if(quiz.kind==='placement'){state.placement={answers:quiz.answers,stage:E.placementResult(quiz.answers),date:E.dayKey()};state.onboarded=true;screen='placementResult';quiz=null;save();render();return;}if(quiz.kind==='lesson'){E.complete(state,quiz.lesson,score,total);state.active=null;}else E.markDay(state);save();screen='main';const passed=total===0||score/total>=.8;app.innerHTML=header()+`<div class="card empty">${quiz.kind==='lesson'?`<div class="lesson-bull ${passed?'happy':'sad'}" role="img" aria-label="${passed?'Happy bull celebrating your lesson':'Sad bull encouraging you to try again'}"></div>`:`<div class="icon">${passed?'🎉':'🌱'}</div>`}<h2>${passed?'Session complete':'Keep building confidence'}</h2><p>${total?`${score} of ${total} correct`:'Speaking practice complete · self-assessed'}</p>${quiz.questions.some(q=>q.type==='speaking')?'<p>Speaking responses are self-assessed and excluded from the scored result.</p>':''}<p>${quiz.kind==='lesson'&&!passed?'Reach 80% to complete this lesson. Your mistakes are ready for review.':'Every practice session helps your Spanish grow.'}</p>${todaySession?b(todaySession.steps.length?'Continue today’s session':'Finish today’s session','todayNext','primary'):quiz.kind==='lesson'?passed?b('Continue learning','continueLearning','primary')+b('Back to Home','home','pill'):b('Try again','retry','primary')+b('Review mistakes','lessonMistakes','pill')+b('Back to Home','home','pill'):b('Back to Home','home','primary')}${quiz.kind==='lesson'&&!passed&&!todaySession?'':b('Try again','retry','pill')}</div>`;viewport.refresh();}
function renderGame(){const attempt=state.games?.active;if(!attempt){screen='main';tab='Games';render();return;}app.innerHTML=GamesView.round({attempt,b,esc});viewport.refresh();}
function startGame(mode='normal',mistakes=[]){if(state.games?.active&&mode!=='mistakes'&&!confirm('Replace your saved unfinished game?'))return;const attempt=G.build(state,C,mode,mistakes);if(!attempt){toast('Complete more course activities to unlock this practice.');return;}state.games=state.games||G.empty();state.games.active=attempt;gameResult=null;quiz=null;todaySession=null;media.stop();screen='game';tab='Games';save();}
function currentQuestion(){return quiz?.questions[quiz.index];}
function answerAllowed(){const q=currentQuestion();return q&&!quiz.checked&&(!quiz.lesson?.reading||quiz.readingReady)&&(!q.listening||quiz.audioPlayed);}
function record(correct,selected,skipped=false){const q=currentQuestion();quiz.selected=selected;quiz.checked=true;quiz.answers.push(skipped?null:correct);playFeedback(correct);E.recordAnswer(state,q,correct,Date.now(),skipped?{skipped:true}:{});save();persistQuiz();}
function practiceQuestions(kind,stage){
 const stageLessons=C.lessons.filter(l=>l.stage===stage),practised=new Set(stageLessons.filter(l=>state.completed.includes(l.id)).map(l=>l.unit));
 if(!practised.size)practised.add(0);
 const qs=stageLessons.filter(l=>!l.checkpoint&&practised.has(l.unit)).flatMap(l=>l.questions).filter(q=>kind==='listening'?q.listening:q.type==='speaking');
 const latest={};for(const e of state.events)if(e.questionId)latest[e.questionId]=e.at;
 return qs.sort((a,b)=>(latest[a.id]||0)-(latest[b.id]||0)).slice(0,6);
}
function todayMedia(){const stage=nextLesson()?.stage||C.playableStages.at(-1),kind=E.dayKey().charCodeAt(9)%2?'speaking':'listening';return {kind:'practice',questions:practiceQuestions(kind,stage).slice(0,1)};}
function launchTodayStep(step){if(step.kind==='resume'){actions.continue();return;}if(step.kind==='onboard'){todaySession=null;screen='onboard';return;}if(step.kind==='lesson'){startQuiz('lesson',step.lesson.questions,step.lesson);return;}startQuiz(step.kind,step.questions);}
const actions={
 gameNew:()=>startGame(),
 gameChallenge:()=>startGame('challenge'),
 gameResume:()=>{if(state.games?.active){screen='game';tab='Games';quiz=null;todaySession=null;media.stop();}},
 gameLeave:()=>{save();screen='main';tab='Games';gameResult=null;},
 gameAnswer:el=>{const a=state.games?.active,q=a?.questions[a.index],i=Number(el.dataset.blank),j=Number(el.dataset.index);if(screen!=='game'||!q||a.checked||!Number.isInteger(i)||!Number.isInteger(j)||!q.blanks[i]?.options[j])return;a.selected[i]=q.blanks[i].options[j];save();},
 gameCheck:()=>{if(screen!=='game')return;const details=G.check(state);if(details){playFeedback(details.every(x=>x.correct));save();}},
 gameNext:()=>{if(screen!=='game'||!state.games?.active?.checked)return;const result=G.advance(state);if(result){E.markDay(state);gameResult=result;screen='gameResult';}save();},
 gameMistakes:()=>{if(gameResult?.mistakes.length)startGame('mistakes',gameResult.mistakes);},
 continueLearning:()=>{if(todaySession){actions.todayNext();return;}if(quiz?.kind!=='lesson')return;const scored=quiz.answers.filter((_,i)=>quiz.questions[i].type!=='speaking');if(scored.length&&scored.filter(Boolean).length/scored.length<.8)return;quiz=null;const lesson=nextLesson();if(lesson){startQuiz('lesson',lesson.questions,lesson);return;}if(due().length){startQuiz('review',due().map(r=>r.question));return;}tab='Review';screen='main';const practice=practiceQuestions('listening',C.playableStages.at(-1)).slice(0,3);if(practice.length)startQuiz('practice',practice);toast('Your required A1 path is complete. Keep practising listening, speaking and review.');},
 lessonMistakes:()=>{if(quiz?.kind!=='lesson')return;const questions=quiz.questions.filter((q,i)=>quiz.answers[i]!==true);if(questions.length)startQuiz('review',questions);},
 today:()=>{const first=CoursePath.today(state,C);if(first.kind==='resume'){todaySession={steps:[todayMedia()]};launchTodayStep(first);return;}if(first.kind==='onboard'){launchTodayStep(first);return;}const steps=[];if(first.kind==='review'){const lesson=nextLesson();if(lesson)steps.push({kind:'lesson',lesson});}steps.push(todayMedia());todaySession={steps};launchTodayStep(first.kind==='maintenance'?todaySession.steps.shift():first);},
 todayNext:()=>{const step=todaySession?.steps.shift();if(step)launchTodayStep(step);else{todaySession=null;quiz=null;tab='Home';screen='main';}},
 viewStage:el=>{if(!C.playableStages.includes(el.dataset.stage))return;quiz=null;todaySession=null;viewStage=el.dataset.stage;tab='Learn';screen='main';},
 tab:el=>{if(!['Home','Learn','Games','Review','Profile'].includes(el.dataset.tab))return;quiz=null;todaySession=null;tab=el.dataset.tab;screen='main';topicFilter=null;},
 home:()=>{quiz=null;todaySession=null;tab='Home';screen='main';},profile:()=>{tab='Profile';screen='main';},
 continue:()=>{if(state.active){quiz=JSON.parse(JSON.stringify(state.active));screen='quiz';quiz.audioLoading=false;quiz.listenRate=listenRate;quizReturn={tab:'Home',screen:'main'};}else if(!state.onboarded)screen='onboard';else{const l=nextLesson();if(l)startQuiz('lesson',l.questions,l);else tab='Review';}},
 begin:()=>{state.onboarded=true;state.stage='A1.1';state.startStage='A1.1';save();const l=nextLesson()||C.lessons[0];startQuiz('lesson',l.questions,l);},
 placement:()=>startQuiz('placement',C.placement),
 acceptPlacement:()=>{const selected=document.getElementById('stage').value;state.stage=C.playableStages.includes(selected)?selected:'A1.2';state.startStage=state.stage;viewStage=state.stage;save();screen='main';tab='Learn';},
 lesson:el=>{const l=C.lessons.find(l=>l.id===el.dataset.id);if(!l||!C.playableStages.includes(l.stage))return;if(state.active&&state.active.lesson.id!==l.id&&!confirm('Replace your saved unfinished lesson?'))return;state.onboarded=true;startQuiz('lesson',l.questions,l);},
 goal:()=>{tab='Learn';screen='main';},numbers:()=>startQuiz('practice',C.numbers),time:()=>startQuiz('practice',C.time),
 topic:el=>{topicFilter=el.dataset.topic;screen='practice';},
 startPractice:()=>startQuiz('review',Object.values(state.reviews).filter(r=>r.topic===topicFilter&&!r.corrected).map(r=>r.question)),
 review:()=>{if(due().length)startQuiz('review',due().map(r=>r.question));},
 mediaPractice:el=>{if(!C.playableStages.includes(el.dataset.stage)||!['listening','speaking'].includes(el.dataset.kind))return;startQuiz('practice',practiceQuestions(el.dataset.kind,el.dataset.stage));},
 readStory:()=>{if(quiz?.lesson?.reading){quiz.readingReady=true;persistQuiz();}},
 answer:el=>{if(!answerAllowed())return;const q=currentQuestion(),index=Number(el.dataset.index);if(q.options&&Number.isInteger(index)&&index>=0&&index<q.options.length){quiz.selected=q.options[index];persistQuiz();}},
 check:()=>{const q=currentQuestion();if(!answerAllowed()||q.type==='speaking'||quiz.selected===null||!String(quiz.selected).trim())return;record(E.isCorrect(q,quiz.selected),quiz.selected);},
 listen:()=>{const q=currentQuestion(),attempt=quiz;if(!q?.listening||quiz.audioLoading)return;quiz.audioLoading=true;quiz.audioUnavailable=false;media.listen({...q.listening,rate:listenRate},started=>{if(quiz!==attempt||currentQuestion()!==q||screen!=='quiz')return;quiz.audioLoading=false;quiz.audioPlayed=quiz.audioPlayed||started;quiz.audioUnavailable=!started;persistQuiz();render();});},
 listenSpeed:el=>{const rate=Number(el.dataset.rate);if(![.75,1].includes(rate)||!currentQuestion()?.listening)return;listenRate=rate;quiz.listenRate=rate;if(quiz.audioLoading){media.stop();quiz.audioLoading=false;quiz.audioUnavailable=false;}},
 skipListening:()=>{if(currentQuestion()?.listening&&!quiz.checked)record(false,null,true);},
 revealModel:()=>{if(currentQuestion()?.type==='speaking'&&!quiz.checked){quiz.modelRevealed=true;persistQuiz();}},
 selfAssess:el=>{if(currentQuestion()?.type!=='speaking'||!quiz.modelRevealed||quiz.checked||!['got','needs'].includes(el.dataset.result))return;record(el.dataset.result==='got',el.dataset.result);},
 next:()=>{if(!quiz?.checked)return;media.stop();quiz.index++;quiz.checked=false;quiz.selected=null;quiz.modelRevealed=false;quiz.audioPlayed=false;quiz.audioUnavailable=false;persistQuiz();},
 leave:()=>{todaySession=null;media.stop();if(quiz)quiz.audioLoading=false;persistQuiz();quiz=null;screen='main';},retry:()=>{if(quiz)startQuiz(quiz.kind,quiz.questions,quiz.lesson);},
 speakStory:()=>{const reading=quiz?.lesson?.reading||currentQuestion()?.reading;if(reading)speak(reading.text);},
 speak:()=>{const q=currentQuestion();if(q&&(quiz.checked||q.type==='speaking'&&quiz.modelRevealed))speak(q.spanish);},
 achievements:()=>{screen='achievements';},filter:el=>{if(['week','month','all'].includes(el.dataset.filter))filter=el.dataset.filter;},
 export:()=>{if(storageContext.readOnly&&!storageContext.raw){toast('The original save cannot be read. Restore storage access before exporting.');return;}const json=storageContext.readOnly&&storageContext.raw?storageContext.raw:JSON.stringify(state,null,2);if(window.AndroidSpeech?.exportProgress){AndroidSpeech.exportProgress(json);return;}const blob=new Blob([json],{type:'application/json'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='friends-to-amigos-progress.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
 import:()=>document.getElementById('importfile').click(),
 reset:()=>{if(confirm('Delete all learning progress on this device? Export a backup first.')){media.stop();state=E.fresh();storageContext={readOnly:false};quiz=null;todaySession=null;save();screen='main';tab='Home';}}
};
app.addEventListener('click',event=>{lastInteraction=Date.now();const el=event.target.closest('[data-action]');if(!el||!Object.prototype.hasOwnProperty.call(actions,el.dataset.action))return;if(['viewStage','tab','home','profile'].includes(el.dataset.action))media.stop();actions[el.dataset.action](el);render();if(el.dataset.action==='gameAnswer')app.querySelector?.(`[data-action="gameAnswer"][data-blank="${el.dataset.blank}"][data-index="${el.dataset.index}"]`)?.focus();if(el.dataset.action==='answer')app.querySelector?.(`[data-action="answer"][data-index="${el.dataset.index}"]`)?.focus();});

app.addEventListener('keydown',event=>{
 if(event.target.id==='written-answer'&&(event.key==='Enter'||event.keyCode===13)){
  if(event.isComposing||event.keyCode===229||event.repeat)return;
  event.preventDefault();
  if(!answerAllowed()||currentQuestion()?.type!=='text')return;
  if(!String(event.target.value).trim())return;
  quiz.selected=event.target.value;
  actions.check();render();return;
 }
 const gameOption=event.target.closest?.('[data-action="gameAnswer"]');
 if(gameOption&&screen==='game'&&!state.games?.active?.checked){
  const keys=['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'];if(!keys.includes(event.key))return;
  event.preventDefault();const blank=Number(gameOption.dataset.blank),options=state.games.active.questions[state.games.active.index].blanks[blank]?.options;if(!options)return;
  const old=Number(gameOption.dataset.index),index=event.key==='Home'?0:event.key==='End'?options.length-1:(old+(['ArrowUp','ArrowLeft'].includes(event.key)?-1:1)+options.length)%options.length;
  actions.gameAnswer({dataset:{blank:String(blank),index:String(index)}});render();app.querySelector?.(`[data-action="gameAnswer"][data-blank="${blank}"][data-index="${index}"]`)?.focus();return;
 }
 const option=event.target.closest?.('[data-action="answer"]');
 if(!option||!answerAllowed()||!currentQuestion()?.options)return;
 const keys=['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'];if(!keys.includes(event.key))return;
 event.preventDefault();const count=currentQuestion().options.length,old=Number(option.dataset.index);
 const index=event.key==='Home'?0:event.key==='End'?count-1:(old+(['ArrowUp','ArrowLeft'].includes(event.key)?-1:1)+count)%count;
 actions.answer({dataset:{index:String(index)}});render();app.querySelector?.(`[data-action="answer"][data-index="${index}"]`)?.focus();
});

app.addEventListener('input',event=>{
 if(event.target.id!=='written-answer'||!answerAllowed()||currentQuestion().type!=='text')return;
 lastInteraction=Date.now();quiz.selected=event.target.value;persistQuiz();
 const check=document.getElementById('check-answer');if(check)check.disabled=!quiz.selected.trim();
});
app.addEventListener('change',async event=>{
 if(event.target.id==='name'){state.name=event.target.value.slice(0,40);save();}
 if(event.target.id==='importfile'){
  if(!event.target.files?.length)return;
  try{const result=P.parse(await event.target.files[0].text(),C,{import:true});
   if(confirm('Replace current progress with this backup?')){
    media.stop();state=result.state;storageContext={readOnly:false};quiz=null;todaySession=null;viewStage=C.playableStages.includes(state.active?.lesson?.stage)?state.active.lesson.stage:C.playableStages.includes(state.stage)?state.stage:'A1.1';screen='main';save();render();if(result.warnings.length)toast(result.warnings.join(' '));
   }
  }catch(error){toast(error.message+' Your current progress has not changed.');}
 }
});
['pointerdown','keydown'].forEach(type=>document.addEventListener(type,()=>lastInteraction=Date.now()));
function tick(){const now=Date.now(),elapsed=Math.min((now-lastTick)/1000,15);lastTick=now;if(['quiz','game'].includes(screen)&&!nativePaused&&!document.hidden&&now-lastInteraction<60000){const key=E.dayKey();state.sessions[key]=state.sessions[key]||{seconds:0,practised:false};state.sessions[key].seconds+=elapsed;save();}}
// Android asks app state, never arbitrary DOM buttons. False means native may background Home.
window.FriendsToAmigos={handleBack(){lastInteraction=Date.now();if(screen==='game'||screen==='gameResult'){actions.gameLeave();render();return true;}if(screen==='quiz'){const destination=quiz.kind==='lesson'?{tab,screen:'main'}:quizReturn;actions.leave();tab=destination.tab;screen=destination.screen==='quiz'?'main':destination.screen;render();return true;}if(screen!=='main'){const previous=screen;media.stop();screen='main';if(previous==='achievements')tab='Profile';render();return true;}if(quiz){quiz=null;todaySession=null;tab='Home';render();return true;}if(tab!=='Home'){tab='Home';render();return true;}return false;}};
const screens=AppScreens.create({C,E,esc,b,due,nextLesson,activeStage,header,get state(){return state;},get filter(){return filter;},get quiz(){return quiz;},get viewStage(){return viewStage;},get topicFilter(){return topicFilter;}});
const {home,onboard,stageOverview,lessonGoal,learn,review,profile,achievements,practiceScreen,glossary,unitReference,readingCard,placementScreen}=screens;
window.addEventListener('fta-pause',()=>{tick();nativePaused=true;media.stop();save();});window.addEventListener('fta-resume',()=>{nativePaused=false;lastTick=Date.now();});
setInterval(tick,10000);document.addEventListener('visibilitychange',()=>{tick();lastTick=Date.now();});window.addEventListener('pagehide',()=>{media.stop();tick();save();});if(storageContext.migrated)save();render();if(storageContext.warnings.length)toast(storageContext.warnings.join(' '));
