(function(root){


  'use strict';

// Explicit injected capabilities; no controller-owned learner progress.

  const dependencies=["B","C","D","E","F","G","GamesView","GrammarSyllabus","K","L","LearningQuality","PracticeHub","actions","activeStage","app","b","blanksResult","confirm","currentQuestion","diagnostic","diagnosticDuration","document","esc","focusedResult","gameResult","grammarEntryId","grammarFocus","grammarMicro","listenRate","media","persistQuiz","playFeedback","quiz","quizReturn","refresh","render","save","screen","skillsResult","startQuiz","state","storageContext","tab","toast","todaySession"];


  function create(ctx){


    function renderGame(){
      const attempt=ctx.state.games?.active;
      if(!attempt){
        ctx.screen='main';
        ctx.tab='Games';
        ctx.render();
        return;
      }
      ctx.app.innerHTML=(ctx.storageContext.readOnly?'<p class="notice">Temporary practice: your original save is protected; this game cannot be saved.</p>':'')+ctx.GamesView.round({attempt,b:ctx.b,esc:ctx.esc});
      ctx.refresh();
    }


    function startGame(mode='normal',mistakes=[]){
      if(ctx.state.games?.active&&mode!=='mistakes'&&!ctx.confirm('Replace your saved unfinished game?'))return;
      const attempt=ctx.G.build(ctx.state,ctx.C,mode,mistakes);
      if(!attempt){
        ctx.toast('No questions match this grammar level. Choose a level in Custom practice.');
        return;
      }
      ctx.state.games=ctx.state.games||ctx.G.empty();
      ctx.state.games.active=attempt;
      ctx.diagnostic('practice_opened',{mode:'context',skill:'context',stage:attempt.stage});
      ctx.G.rememberShown(ctx.state);
      ctx.gameResult=null;
      ctx.quiz=null;
      ctx.todaySession=null;
      ctx.media.stop();
      ctx.screen='game';
      ctx.tab='Games';
      ctx.save();
    }


    function startBlanks(options={}){
      if(ctx.state.blanks?.active&&!ctx.confirm('Replace your saved unfinished table practice?'))return;
      const attempt=ctx.B.build(ctx.state,ctx.C,options);
      if(!attempt){
        ctx.toast('No curated targets match these filters at your grammar level. Try Recommended or All up to current level.');
        return;
      }
      ctx.state.blanks=ctx.state.blanks||ctx.B.empty();
      ctx.state.blanks.active=attempt;
      ctx.diagnostic('practice_opened',{mode:'trainer',skill:'trainer',stage:attempt.stage});
      ctx.blanksResult=null;
      ctx.quiz=null;
      ctx.todaySession=null;
      ctx.media.stop();
      ctx.screen='blanks';
      ctx.tab='Games';
      ctx.save();
    }


    function startFocused(kind,stage,focus=''){


      if(ctx.state.focused?.active&&!ctx.confirm('Replace your saved unfinished focused practice?'))return;


      const attempt=ctx.F.select(ctx.state,ctx.C,kind,stage,focus);
      if(!attempt){
        ctx.toast('Ten taught items are not ready yet. Complete the first two units’ teaching activities, then try this mode.');
        return;
      }


      ctx.todaySession=null;
      ctx.focusedResult=null;
      ctx.startQuiz('focused',attempt.questions,null,attempt);
      if(ctx.quizReturn.screen==='focusedResult')ctx.quizReturn={tab:'Home',screen:'main'};
      ctx.F.remember(ctx.state,ctx.currentQuestion());
      ctx.persistQuiz();
      ctx.render();


    }


    function startSkill(kind){
      if(ctx.state.practiceHub?.active&&!ctx.confirm('Replace your saved unfinished practice?'))return;
      const a=ctx.K.build(ctx.state,ctx.C,ctx.D,kind);
      if(!a){
        ctx.toast('No suitable practice is ready. Continue your course first.');
        return;
      }
      ctx.media.stop();
      ctx.tab='Games';
      ctx.screen='main';
      ctx.quiz=null;
      ctx.todaySession=null;
      ctx.skillsResult=null;
      ctx.K.remember(ctx.state,a);
      ctx.startQuiz('skill',a.questions,null,a);
    }


    function launchPractice(kind){
      ctx.media.stop();
      ctx.persistQuiz();
      ctx.quiz=null;
      ctx.todaySession=null;
      ctx.tab='Games';
      ctx.screen='main';
      if(kind==='context'){
        ctx.actions.gameOpen();
        return;
      }
      if(kind==='trainer'){
        ctx.actions.blanksOpen();
        return;
      }
      if(['listening','speaking','shadowing'].includes(kind)){
        const mediaKind=kind==='shadowing'?'speaking':kind;
        if(ctx.F.eligible(ctx.state,ctx.C,mediaKind,ctx.K.stage(ctx.state,ctx.C)).length>=10){
          if(kind==='shadowing')ctx.actions.shadowing();else startFocused(mediaKind,ctx.K.stage(ctx.state,ctx.C));
        }else startSkill(kind);
        return;
      }
      startSkill(kind);
    }


    function practiceQuestions(kind,stage){


      const stageLessons=ctx.C.lessons.filter(l=>l.stage===stage),practised=new Set(stageLessons.filter(l=>ctx.state.completed.includes(l.id)).map(l=>l.unit));


      if(!practised.size)practised.add(0);


      const qs=stageLessons.filter(l=>!l.checkpoint&&practised.has(l.unit)).flatMap(l=>l.questions).filter(q=>kind==='listening'?q.listening:q.type==='speaking');


      const latest={};
      for(const e of ctx.state.events)if(e.questionId)latest[e.questionId]=e.at;


      return qs.sort((a,b)=>(latest[a.id]||0)-(latest[b.id]||0)).slice(0,6);


    }


    function recommendFocus(key){
      if(!ctx.PracticeHub.eligibleWeak(ctx.state,ctx.C,key)){
        ctx.toast('Build this area in your current course first. Custom practice remains available.');
        ctx.actions.continue();
        return;
      }
      const entry=ctx.LearningQuality.resolve(key,ctx.C,ctx.state);
      if(entry){
        const qs=ctx.LearningQuality.practice(ctx.state,ctx.C,entry.id,key).filter(q=>ctx.C.lessons.some(l=>ctx.K.reached(ctx.state,ctx.C,l)&&l.questions.some(x=>x.id===(q.sourceQuestionId||q.id))));
        if(qs.length){
          ctx.startQuiz('practice',qs);
          return;
        }
      }
      if(/^concept:(?:vocabulary|sentence-building|numbers-time|spot-correction|practice-(?:numbers|time|prices|dates))$/.test(key)){
        ctx.actions.weakPractice({dataset:{key}});
        return;
      }
      launchPractice('fix');
    }


    const handlers={
recommendedFocus:el=>recommendFocus(el.dataset.key),
practiceHub:()=>{
      ctx.media.stop();
      ctx.persistQuiz();
      ctx.quiz=null;
      ctx.todaySession=null;
      ctx.screen='main';
      ctx.tab='Games';
    },
practiceLaunch:el=>launchPractice(el.dataset.kind),
practiceRecommended:()=>{
      const r=ctx.PracticeHub.recommendation(ctx.state,ctx.C);
      if(r.kind==='resume'){
        ctx.actions.skillResume();
        return;
      }
      if(r.kind==='contextResume'||r.kind==='trainerResume'){
        ctx.actions.practiceResume({dataset:{kind:r.kind==='contextResume'?'context':'trainer'}});
        return;
      }
      if(r.kind==='focusedResume'){
        ctx.actions.focusedResume();
        return;
      }
      if(r.focus){
        recommendFocus(r.focus);
        return;
      }
      if(r.kind==='context'){
        ctx.state.grammarLevel=ctx.K.stage(ctx.state,ctx.C);
        startGame();
        return;
      }
      launchPractice(r.kind);
    },
practiceResume:el=>{
      if(el.dataset.kind==='context'&&ctx.state.games?.active){
        ctx.state.grammarLevel=ctx.state.games.active.stage;
        ctx.actions.gameResume();
        ctx.save();
      }else if(el.dataset.kind==='trainer'&&ctx.state.blanks?.active){
        ctx.state.grammarLevel=ctx.state.blanks.active.tables.map(t=>t.target.stage).sort((a,b)=>ctx.C.playableStages.indexOf(b)-ctx.C.playableStages.indexOf(a))[0];
        ctx.actions.blanksResume();
        ctx.save();
      }
    },
contextRecommended:()=>{
      ctx.state.grammarLevel=ctx.K.stage(ctx.state,ctx.C);
      startGame();
    },
trainerRecommended:()=>{
      ctx.state.grammarLevel=ctx.K.stage(ctx.state,ctx.C);
      startBlanks();
    },
skillResume:()=>{
      if(ctx.state.practiceHub?.active){
        ctx.quiz=JSON.parse(JSON.stringify(ctx.state.practiceHub.active));
        ctx.quiz.audioLoading=false;
        ctx.quiz.listenRate=ctx.listenRate;
        ctx.quizReturn={tab:'Games',screen:'main'};
        ctx.tab='Games';
        ctx.screen='quiz';
        ctx.diagnostic('practice_opened',{resumed:true});
        ctx.media.stop();
      }
    },
skillAgain:()=>{
      if(ctx.skillsResult)startSkill(ctx.skillsResult.kind);
    },
skillMistakes:()=>{
      if(ctx.quiz?.kind==='skill'){
        const missed=ctx.quiz.questions.filter((q,i)=>ctx.quiz.answers[i]!==true);
        if(!missed.length)return;
        const next=ctx.K.build(ctx.state,ctx.C,ctx.D,ctx.quiz.questions.every(q=>q.type==='speaking')?ctx.quiz.skillKind:'fix');
        if(next){
          const qs=[...missed,...next.questions.filter(q=>!missed.some(m=>m.id===q.id))].slice(0,10);
          next.questions=qs;
          next.skillStage=ctx.quiz.skillStage;
          ctx.K.remember(ctx.state,next);
          ctx.tab='Games';
          ctx.screen='main';
          ctx.startQuiz('skill',qs,null,next);
        }
      }
    },
gameOpen:()=>{
      ctx.media.stop();
      ctx.screen='gameConfig';
      ctx.tab='Games';
      ctx.quiz=null;
    },
qualityPractice:el=>{
      const qs=ctx.LearningQuality.practice(ctx.state,ctx.C,el.dataset.id,el.dataset.key||'');
      if(qs.length)ctx.startQuiz('practice',qs,null,{microConcept:el.dataset.id,microFocus:el.dataset.key||''});else ctx.toast('Select the appropriate grammar level before practising this concept.');
    },
qualityMore:()=>{
      if(!ctx.quiz?.microConcept)return;
      const id=ctx.quiz.microConcept,entry=ctx.LearningQuality.reference(id,ctx.C),focus=ctx.quiz.microFocus||'concept:'+id;
      if(!entry||!ctx.GrammarSyllabus.allowed(ctx.state,entry.level))return;
      if(ctx.B.pool(ctx.state,ctx.C,'all',focus).length){
        startBlanks({mode:'practice',count:3,scope:'all',focus,recall:true});
        return;
      }
      const seen=new Set(ctx.quiz.questions.map(q=>q.id)),source=ctx.C.lessons.find(l=>l.id===entry.source),qs=ctx.C.lessons.filter(l=>l.stage===source.stage&&l.unit===source.unit).flatMap(l=>l.questions).filter(q=>!q.writing&&q.type!=='speaking'&&!q.listening&&!q.reading&&ctx.LearningQuality.concepts(q,ctx.C).some(c=>c.id===id)).sort((a,b)=>Number(seen.has(a.id))-Number(seen.has(b.id))).slice(0,5);
      if(qs.length)ctx.startQuiz('practice',qs,null,{microConcept:id,microFocus:focus});
    },
reinforceLesson:()=>{
      const cs=ctx.quiz?.lesson?.questions.flatMap(q=>ctx.LearningQuality.concepts(q,ctx.C)).filter(c=>ctx.state.completed.includes(c.source));
      if(cs?.length){
        ctx.grammarEntryId=cs[0].id;
        ctx.grammarFocus='';
        ctx.grammarMicro=false;
        ctx.screen='grammarEntry';
        ctx.media.stop();
      }
    },
practiseMistakes:()=>{
      if(!ctx.quiz||ctx.quiz.index<ctx.quiz.questions.length)return;
      const qs=ctx.LearningQuality.retry(ctx.quiz,ctx.state,ctx.C);
      if(qs.length)ctx.startQuiz('review',qs);
    },
shadowing:()=>{
      if(ctx.state.focused?.active&&!ctx.confirm('Replace your saved unfinished focused practice?'))return;
      const a=ctx.F.select(ctx.state,ctx.C,'speaking',ctx.activeStage());
      if(!a){
        ctx.toast('Complete the first teaching units to unlock shadowing.');
        return;
      }
      a.questions=a.questions.map(q=>{
        const copy={...q,id:q.id.replace('focus-speak-','focus-speak-shadow-'),shadowing:true,prompt:'Listen to the phrase, then repeat it aloud.'};
        delete copy.instructionLanguage;
        delete copy.promptEs;
        delete copy.englishHint;
        delete copy.supportConcept;
        delete copy.spanishFragments;
        return copy;
      });
      a.sessionId='shadow-'+a.sessionId;
      ctx.startQuiz('focused',a.questions,null,a);
      ctx.F.remember(ctx.state,ctx.currentQuestion());
      ctx.persistQuiz();
    },
blanksConfidence:el=>{
      const a=ctx.state.blanks?.active;
      if(a&&!a.checked&&['sure','unsure'].includes(el.dataset.value)){
        a.confidence=el.dataset.value;
        ctx.save();
      }
    },
focusedResume:()=>{
      if(ctx.state.focused?.active){
        ctx.media.stop();
        ctx.quizReturn={tab:ctx.tab,screen:'main'};
        ctx.quiz=JSON.parse(JSON.stringify(ctx.state.focused.active));
        ctx.quiz.audioLoading=false;
        ctx.quiz.listenRate=ctx.listenRate;
        ctx.todaySession=null;
        ctx.screen='quiz';
        ctx.diagnostic('practice_opened',{resumed:true});
        ctx.persistQuiz();
      }
    },
focusedMistakes:()=>{
      const qs=ctx.quiz?ctx.LearningQuality.retry(ctx.quiz,ctx.state,ctx.C):[];
      if(qs.length)ctx.startQuiz('review',qs);else ctx.actions.weakAreas();
    },
focusedAgain:()=>{
      if(ctx.focusedResult?.shadowing)ctx.actions.shadowing();else if(ctx.focusedResult)startFocused(ctx.focusedResult.kind,ctx.focusedResult.stage);
    },
grammarLevel:()=>{
      const level=ctx.document.getElementById('grammar-level')?.value;
      if(ctx.GrammarSyllabus.levels.includes(level)){
        ctx.state.grammarLevel=level;
        ctx.media.stop();
        ctx.save();
        ctx.toast('Grammar practice now includes '+level+' and earlier levels. Your course progress is unchanged.');
      }
    },
blanksOpen:()=>{
      ctx.quiz=null;
      ctx.screen='blanksConfig';
      ctx.tab='Games';
    },
blanksNormal:()=>startBlanks(),
blanksPractice:()=>startBlanks({mode:'practice',count:Number(ctx.document.getElementById('table-count')?.value||3),scope:ctx.document.getElementById('table-scope')?.value||'recommended',filters:ctx.document.getElementById('table-scope')?.value==='custom'?{level:ctx.document.getElementById('table-level')?.value||'',grammar:ctx.document.getElementById('table-grammar')?.value||'all'}:{},recall:ctx.document.getElementById('table-entry')?.value==='text'}),
blanksResume:()=>{
      if(ctx.state.blanks?.active){
        if(ctx.state.blanks.active.tables.some(t=>!ctx.GrammarSyllabus.allowed(ctx.state,t.target.stage))){
          ctx.toast('Your saved tables are kept. Raise your grammar level to resume them.');
          return;
        }
        ctx.quiz=null;
        ctx.todaySession=null;
        ctx.screen='blanks';
        ctx.tab='Games';
        ctx.diagnostic('practice_opened',{resumed:true});
      }
    },
blanksLeave:()=>{
      if(ctx.screen==='blanks'&&ctx.state.blanks?.active){
        ctx.diagnosticDuration();
        ctx.diagnostic('activity_left',{mode:'trainer',completed:false});
      }
      ctx.save();
      ctx.screen='main';
      ctx.tab='Games';
    },
blanksHint:el=>{
      const a=ctx.state.blanks?.active,i=Number(el.dataset.cell);
      if(ctx.screen==='blanks'&&a&&!a.checked&&Number.isInteger(i)&&i>=0&&i<a.assisted.length){
        a.assisted[i]=true;
        ctx.save();
      }
    },
blanksGuide:()=>{
      const a=ctx.state.blanks?.active;
      if(a&&!a.checked){
        a.assisted=a.assisted.map(()=>true);
        ctx.save();
      }
    },
blanksCheck:()=>{
      if(ctx.screen==='blanks'){
        const r=ctx.B.check(ctx.state);
        if(r){
          for(const x of r.details)ctx.diagnostic('answer_checked',{mode:'trainer',correct:x.correct,assisted:x.assisted===true});
          ctx.playFeedback(r.details.every(x=>x.correct));
          ctx.save();
        }
      }
    },
blanksNext:()=>{
      if(ctx.screen==='blanks'&&ctx.state.blanks?.active?.checked){
        const r=ctx.B.next(ctx.state);
        if(r){
          ctx.E.markDay(ctx.state);
          ctx.blanksResult=r;
          ctx.diagnosticDuration();
          ctx.diagnostic('practice_completed',{mode:'trainer'});
          ctx.screen='blanksResult';
        }
        ctx.save();
      }
    },
blanksMistakes:()=>{
      if(ctx.blanksResult?.mistakes.length)startBlanks({mode:'practice',count:3,mistakes:ctx.blanksResult.mistakes,scope:'all',recall:true});
    },
blanksAgain:()=>startBlanks({mode:'practice',count:3,scope:'all'}),
weakPractice:el=>{
      const key=el.dataset.key;
      if(/^concept:(?:vocabulary|sentence-building|numbers-time|spot-correction|practice-(?:numbers|time|prices|dates))$/.test(key)){
        launchPractice(key==='concept:vocabulary'?'rapid':(key==='concept:numbers-time'||key.startsWith('concept:practice-'))?'numbers':key==='concept:spot-correction'?'spot':'builder');
        return;
      }
      if(key.startsWith('concept:')&&ctx.GrammarSyllabus.concepts.some(c=>key==='concept:'+c.id)){
        const qs=ctx.LearningQuality.practice(ctx.state,ctx.C,key.slice(8)).filter(q=>ctx.C.lessons.some(l=>ctx.K.reached(ctx.state,ctx.C,l)&&l.questions.some(x=>x.id===(q.sourceQuestionId||q.id))));
        if(qs.length){
          ctx.startQuiz('practice',qs);
          return;
        }
      }
      const mediaItems=ctx.F.focused(ctx.state,ctx.C,key);
      if(mediaItems.length){
        startFocused(mediaItems[0].practice.kind,ctx.C.playableStages.at(-1),key);
        return;
      }
      if(ctx.B.pool(ctx.state,ctx.C,'all',key).length)startBlanks({mode:'practice',count:3,scope:'all',focus:key,recall:true});else{
        const qs=ctx.L.focusedQuestions(ctx.state,ctx.C,key);
        if(qs.length)ctx.startQuiz('review',qs);else ctx.toast('No eligible focused items yet. Try the course or due review.');
      }
    },
gameNew:()=>startGame(),
gameChallenge:()=>startGame('challenge'),
gameResume:()=>{
      if(ctx.state.games?.active){
        if(ctx.state.games.active.questions.some(q=>!ctx.GrammarSyllabus.allowed(ctx.state,q.stage))){
          ctx.toast('Your saved game is kept. Raise your grammar level to resume it.');
          return;
        }
        ctx.screen='game';
        ctx.tab='Games';
        ctx.quiz=null;
        ctx.todaySession=null;
        ctx.diagnostic('practice_opened',{resumed:true});
        ctx.media.stop();
      }
    },
gameLeave:()=>{
      if(ctx.screen==='game'&&ctx.state.games?.active){
        ctx.diagnosticDuration();
        ctx.diagnostic('activity_left',{mode:'context',completed:false});
      }
      ctx.save();
      ctx.screen='main';
      ctx.tab='Games';
      ctx.gameResult=null;
    },
gameAnswer:el=>{
      const a=ctx.state.games?.active,q=a?.questions[a.index],i=Number(el.dataset.blank),j=Number(el.dataset.index);
      if(ctx.screen!=='game'||!q||a.checked||!Number.isInteger(i)||!Number.isInteger(j)||!q.blanks[i]?.options[j])return;
      a.selected[i]=q.blanks[i].options[j];
      ctx.save();
    },
gameCheck:()=>{
      if(ctx.screen!=='game')return;
      const details=ctx.G.check(ctx.state);
      if(details){
        for(const x of details)ctx.diagnostic('answer_checked',{mode:'context',correct:x.correct});
        ctx.playFeedback(details.every(x=>x.correct));
        ctx.save();
      }
    },
gameNext:()=>{
      if(ctx.screen!=='game'||!ctx.state.games?.active?.checked)return;
      const result=ctx.G.advance(ctx.state);
      if(result){
        ctx.E.markDay(ctx.state);
        ctx.gameResult=result;
        ctx.diagnosticDuration();
        ctx.diagnostic('practice_completed',{mode:'context'});
        ctx.screen='gameResult';
      }
      ctx.save();
    },
gameMistakes:()=>{
      if(ctx.gameResult?.mistakes.length)startGame('mistakes',ctx.gameResult.mistakes);
    },
numbers:()=>ctx.startQuiz('practice',ctx.C.numbers),
time:()=>ctx.startQuiz('practice',ctx.C.time),
mediaPractice:el=>{
      if(!ctx.C.playableStages.includes(el.dataset.stage)||!['listening','speaking'].includes(el.dataset.kind))return;
      startFocused(el.dataset.kind,el.dataset.stage);
    }
};


    return {renderGame,startGame,startBlanks,startFocused,startSkill,launchPractice,practiceQuestions,recommendFocus,actions:handlers};


  }


  root.PracticeController={dependencies,create};
  if(typeof module!=='undefined')module.exports=root.PracticeController;


})(typeof window==='undefined'?globalThis:window);
