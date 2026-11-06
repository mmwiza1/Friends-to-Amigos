'use strict';
const C=Curriculum,E=Engine,P=ProgressStore;let storageContext=P.load(localStorage,C),state=storageContext.state;
const diagnostics=BetaDiagnostics.create(localStorage,C);

let tab='Home',screen='main',quiz=null,filter='all',profileStatsOpen=false,topicFilter=null,lastTick=Date.now(),lastInteraction=Date.now(),viewStage=C.playableStages.includes(state.active?.lesson?.stage)?state.active.lesson.stage:C.playableStages.includes(state.stage)?state.stage:'A1.1';const app=document.getElementById('app'),viewport=ViewportTools.create(window);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Saved attempts and review items are snapshots. Never substitute rewritten
// questions mid-attempt, even when a previous app version had fewer questions.
let grammarOrigin={tab:'Profile',screen:'main'},grammarEntryId='',grammarFocus='',grammarMicro=false;let skillsResult=null,focusedResult=null,gameResult=null,blanksResult=null,reviewFollowup='';const G=Conjugations,B=ConjugationBlanks,M=Mastery,L=LearningPractice,F=FocusedPractice,D=LearnerDictionary;
let dictionaryTipLast='',dictionaryUI,savedQuery='',savedFilter='all',dictionaryQuery='',dictionaryDirection='es-en';const X=LearnerExperience,K=PracticeSkills;
let media,nativePaused=false,listenRate=.75,todaySession=null,quizReturn={tab:'Home',screen:'main'};
function save(){let saved=P.save(localStorage,state,storageContext);if(!saved&&!storageContext.readOnly){diagnostics.releaseSpace();saved=P.save(localStorage,state,storageContext);}if(!saved)toast(storageContext.readOnly?'The original save is protected. Export it before recovery.':'Storage is unavailable. Export your progress from Profile.');return saved;}

function toast(t){const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.setAttribute('aria-atomic','true');el.textContent=t;document.body.append(el);setTimeout(()=>el.remove(),3500);}
function b(label,action,cls='pill',extra=''){return `<button class="${cls}" data-action="${action}" ${extra}>${label}</button>`;}
// One live capability facade: getters never snapshot or duplicate progress/UI state.
const runtime={
 get AssessmentPolicy(){return AssessmentPolicy;},
 get AndroidSpeech(){return window.AndroidSpeech;},
 get B(){return B;},
 get Blob(){return Blob;},
 get C(){return C;},
 get CoursePath(){return CoursePath;},
 get D(){return D;},
 get E(){return E;},
 get F(){return F;},
 get FocusedView(){return FocusedView;},
 get G(){return G;},
 get GamesView(){return GamesView;},
 get GrammarSyllabus(){return GrammarSyllabus;},
 get K(){return K;},
 get L(){return L;},
 get LearningQuality(){return LearningQuality;},
 get M(){return M;},
 get P(){return P;},
 get PracticeHub(){return PracticeHub;},
 get QualityView(){return QualityView;},
 get QuizView(){return QuizView;},
 get Recommendations(){return Recommendations;},
 get Structured(){return Structured;},
 get URL(){return URL;},
 get Writing(){return Writing;},
 get X(){return X;},
 get actions(){return actions;},
 get activeStage(){return activeStage;},
 get answerAllowed(){return answerAllowed;},
 get app(){return app;},
 get b(){return b;},
 get blanksResult(){return blanksResult;},set blanksResult(value){blanksResult=value;},
 get completionView(){return completionView;},
 get confirm(){return window.confirm.bind(window);},
 get currentQuestion(){return currentQuestion;},
 get dataController(){return dataController;},
 get diagnostic(){return diagnostic;},
 get diagnosticDuration(){return diagnosticDuration;},
 get diagnosticsController(){return diagnosticsController;},
 get dictionaryDirection(){return dictionaryDirection;},set dictionaryDirection(value){dictionaryDirection=value;},
 get dictionaryQuery(){return dictionaryQuery;},set dictionaryQuery(value){dictionaryQuery=value;},
 get dictionaryTipLast(){return dictionaryTipLast;},set dictionaryTipLast(value){dictionaryTipLast=value;},
 get dictionaryUI(){return dictionaryUI;},set dictionaryUI(value){dictionaryUI=value;},
 get document(){return document;},
 get esc(){return esc;},
 get filter(){return filter;},set filter(value){filter=value;},
 get focusedResult(){return focusedResult;},set focusedResult(value){focusedResult=value;},
 get gameResult(){return gameResult;},set gameResult(value){gameResult=value;},
 get grammarEntryId(){return grammarEntryId;},set grammarEntryId(value){grammarEntryId=value;},
 get grammarFocus(){return grammarFocus;},set grammarFocus(value){grammarFocus=value;},
 get grammarMicro(){return grammarMicro;},set grammarMicro(value){grammarMicro=value;},
 get grammarOrigin(){return grammarOrigin;},set grammarOrigin(value){grammarOrigin=value;},
 get header(){return header;},
 get lastInteraction(){return lastInteraction;},set lastInteraction(value){lastInteraction=value;},
 get lastTick(){return lastTick;},set lastTick(value){lastTick=value;},
 get lessonGoal(){return lessonGoal;},
 get listenRate(){return listenRate;},set listenRate(value){listenRate=value;},
 get media(){return media;},set media(value){media=value;},
 get nativePaused(){return nativePaused;},set nativePaused(value){nativePaused=value;},
 get nextLesson(){return nextLesson;},
 get persistQuiz(){return persistQuiz;},
 get playFeedback(){return playFeedback;},
 get practiceQuestions(){return practiceQuestions;},
 get profileStatsOpen(){return profileStatsOpen;},set profileStatsOpen(value){profileStatsOpen=value;},
 get quiz(){return quiz;},set quiz(value){quiz=value;},
 get quizReturn(){return quizReturn;},set quizReturn(value){quizReturn=value;},
 get readingCard(){return readingCard;},
 get refresh(){return refresh;},
 get refreshSavedSearch(){return refreshSavedSearch;},
 get render(){return render;},
 get reviewFollowup(){return reviewFollowup;},set reviewFollowup(value){reviewFollowup=value;},
 get save(){return save;},
 get savedFilter(){return savedFilter;},set savedFilter(value){savedFilter=value;},
 get savedQuery(){return savedQuery;},set savedQuery(value){savedQuery=value;},
 get screen(){return screen;},set screen(value){screen=value;},
 get setInterval(){return window.setInterval.bind(window);},
 get setTimeout(){return window.setTimeout.bind(window);},
 get skillsResult(){return skillsResult;},set skillsResult(value){skillsResult=value;},
 get speak(){return speak;},
 get startBlanks(){return startBlanks;},
 get startFocused(){return startFocused;},
 get startQuiz(){return startQuiz;},
 get startSkill(){return startSkill;},
 get state(){return state;},set state(value){state=value;},
 get storageContext(){return storageContext;},set storageContext(value){storageContext=value;},
 get tab(){return tab;},set tab(value){tab=value;},
 get toast(){return toast;},
 get todaySession(){return todaySession;},set todaySession(value){todaySession=value;},
 get topicFilter(){return topicFilter;},set topicFilter(value){topicFilter=value;},
 get viewStage(){return viewStage;},set viewStage(value){viewStage=value;},
 get window(){return window;}
};
const completionView=CompletionView.create(RuntimeContext.inject(runtime,CompletionView.dependencies));
const dataController=DataTransferController.create(RuntimeContext.inject(runtime,DataTransferController.dependencies));
const profileController=ProfileController.create(RuntimeContext.inject(runtime,ProfileController.dependencies));
const navigationController=NavigationController.create(RuntimeContext.inject(runtime,NavigationController.dependencies));
const lessonController=LessonController.create(RuntimeContext.inject(runtime,LessonController.dependencies));
const practiceController=PracticeController.create(RuntimeContext.inject(runtime,PracticeController.dependencies));
const quizController=QuizController.create(RuntimeContext.inject(runtime,QuizController.dependencies));
const diagnosticsController=DiagnosticsController.create({store:diagnostics,getContext:()=>{const mode=screen==='game'?'context':screen==='blanks'?'trainer':quiz?.kind,skill=screen==='game'?'context':screen==='blanks'?'trainer':quiz?.questions?.[0]?.shadowing?'shadowing':quiz?.skillKind||quiz?.mediaKind;return {stage:(screen==='game'?state.games?.active?.stage:screen==='blanks'?state.blanks?.active?.stage:null)||quiz?.lesson?.stage||quiz?.skillStage||quiz?.stage||activeStage(),...(mode?{mode}:{}),...(skill?{skill}:{}),...(quiz?.lesson?{activityId:quiz.lesson.id,unit:quiz.lesson.unit}:{})};},download:json=>dataController.download(json,'friends-to-amigos-beta-diagnostics.json','exportDiagnostics'),notify:toast});
const {diagnostic,diagnosticDuration}=diagnosticsController;
const inputController=InputController.create(RuntimeContext.inject(runtime,InputController.dependencies));
const lifecycleController=LifecycleController.create(RuntimeContext.inject(runtime,LifecycleController.dependencies));
// Preserve the existing runtime inspection hook; lifecycle owns the implementation.
function tick(){return lifecycleController.tick();}
const {refreshSavedSearch}=profileController;
const {due,nextLesson,activeStage,todayMedia,launchTodayStep}=lessonController;
const {renderGame,startGame,startBlanks,startFocused,startSkill,launchPractice,practiceQuestions,recommendFocus}=practiceController;
const {startQuiz,persistQuiz,renderQuiz,finishQuiz,currentQuestion,answerAllowed,record}=quizController;
media=SpeechTools.create(window,toast);
const playFeedback=correct=>media.playFeedback(correct),speak=text=>media.speak(text);
dictionaryUI=DictionaryUI.create({window,document,lexicon:D,getState:()=>state,canSave:()=>!storageContext.readOnly,save,speak,toast,getStage:()=>currentQuestion()?.practice?.stage||quiz?.lesson?.stage||viewStage,onDiscover:entry=>{if(!entry?.id)return;diagnostic('dictionary_opened');document.getElementById('dictionary-discovery-tip')?.remove();if(storageContext.readOnly||state.dictionaryTipSeen===true)return;state.dictionaryTipSeen=true;save();}});
function refresh(){dictionaryUI.decorate(app);viewport.refresh();}

function header(){return '<header><div><h1>Friends to<br>Amigos<span style="color:var(--coral)"> ✦</span></h1><p class="tagline">A little Spanish, every day.</p></div><span class="flag" aria-label="Spanish flag">🇪🇸</span></header>';}
function nav(){return `<nav aria-label="Main navigation">${['Home','Learn','Games','Review','Profile'].map((t,i)=>b(`<span aria-hidden="true">${t==='Games'?PracticeHub.icon('target'):['⌂','▤','⚄','↻','☺'][i]}</span>${t==='Games'?'Practice':t}${t==='Review'&&due().length?`<strong class="badge">${due().length}</strong>`:''}`,'tab',''+(tab===t?'active':''),`data-tab="${t}" aria-label="${t==='Games'?'Practice':t}"${tab===t?' aria-current="page"':''}`)).join('')}</nav>`;}
function render(){dictionaryUI.close();app.classList?.toggle('practice-activity-screen',['game','gameConfig','gameResult','blanks','blanksConfig','blanksResult','skillResult','focusedResult'].includes(screen)||screen==='quiz'&&['skill','focused'].includes(quiz?.kind));if(screen==='skillResult'){app.innerHTML=header()+PracticeHub.result({quiz,round:skillsResult,b,esc,C});refresh();return;}if(screen==='dictionary'){app.innerHTML=header()+X.dictionary({D,state,query:dictionaryQuery,direction:dictionaryDirection,b,esc});refresh();return;}if(screen==='vocabulary'){app.innerHTML=header()+b('‹ Back to Profile','profile','back')+'<h2>Vocabulary</h2><section class="card"><h3>Dictionary</h3><p>English ⇄ Spanish · local course vocabulary</p>'+b('Search dictionary','dictionary','primary')+'</section><section class="card"><h3>Saved Words</h3><p>'+ (state.savedWords?.length||0)+' words and expressions. Tap Spanish words in lessons to save more.</p>'+b('Open Saved Words','savedWords','pill')+'</section>'+b('Optional pronunciation primer · about 5 minutes','pronunciation','pill');refresh();return;}if(screen==='pronunciation'){app.innerHTML=header()+X.primer({b,esc});refresh();return;}if(screen==='gameConfig'){app.innerHTML=header()+GamesView.config({state,C,G,b,esc});refresh();return;}if(screen==='grammar'||screen==='grammarEntry'){app.innerHTML=header()+QualityView.reference({id:screen==='grammarEntry'?grammarEntryId:'',state,C,b,esc,micro:grammarMicro,key:grammarFocus});refresh();return;}if(screen==='content'){app.innerHTML=header()+Recommendations.render(activeStage(),{esc,b});refresh();return;}if(screen==='savedWords'){app.innerHTML=header()+b('‹ Back to Profile','profile','back')+dictionaryUI.savedView({query:savedQuery,filter:savedFilter});refresh();return;}if(screen==='focusedResult'){app.innerHTML=header()+FocusedView.result({result:focusedResult,b,esc});refresh();return;}if(screen==='blanks'){const attempt=state.blanks?.active;if(!attempt){screen='blanksConfig';render();return;}app.innerHTML=PracticeView.table({attempt,T:ConjugationTargets,B,b,esc});refresh();return;}if(screen==='blanksResult'){app.innerHTML=header()+PracticeView.result({round:blanksResult,b,esc});refresh();return;}if(screen==='blanksConfig'){app.innerHTML=header()+PracticeView.config({state,C,B,b,esc});refresh();return;}if(screen==='weak'){app.innerHTML=header()+PracticeView.weak({state,C,M,B,L,b,esc});refresh();return;}if(screen==='game'){renderGame();return;}if(screen==='gameResult'){app.innerHTML=header()+GamesView.result({state,C,G,round:gameResult,b,esc});refresh();return;}if(screen==='quiz'){renderQuiz();return;}let html=(screen==='main'&&tab==='Games'?'':header())+(storageContext.readOnly?'<p class="notice" role="status">Your saved progress needs recovery and is protected from changes. Export the original file from Profile before updating or recovering it.</p>':'');if(screen==='onboard')html+=onboard();else if(screen==='placementResult')html+=placementScreen();else if(screen==='practice')html+=practiceScreen();else if(screen==='achievements')html+=achievements();else html+={Home:home,Learn:learn,Games:()=>GamesView.hub({state,C,G,b,esc}),Review:review,Profile:profile}[tab]();app.innerHTML=html+(screen==='main'?nav():'');refresh();}


const actions=RuntimeContext.actions(dataController.actions,profileController.actions,navigationController.actions,lessonController.actions,practiceController.actions,quizController.actions,diagnosticsController.actions);

// Android asks app state, never arbitrary DOM buttons. False means native may background Home.
window.FriendsToAmigos={handleBack:navigationController.handleBack};
const screens=AppScreens.create({C,E,esc,b,due,nextLesson,activeStage,header,get diagnostics(){return diagnostics;},get state(){return state;},get filter(){return filter;},get profileStatsOpen(){return profileStatsOpen;},get quiz(){return quiz;},get viewStage(){return viewStage;},get topicFilter(){return topicFilter;}});
const {home,onboard,stageOverview,lessonGoal,learn,review,profile,achievements,practiceScreen,glossary,unitReference,readingCard,placementScreen}=screens;

inputController.mount();lifecycleController.mount();if(storageContext.migrated)save();render();if(storageContext.warnings.length)toast(storageContext.warnings.join(' '));
