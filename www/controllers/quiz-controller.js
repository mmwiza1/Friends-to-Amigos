(function(root){


  'use strict';

// Explicit injected capabilities; no controller-owned learner progress.

  const dependencies=["C","D","E","F","FocusedView","K","L","LearningQuality","M","PracticeHub","QuizView","Structured","Writing","app","b","completionView","diagnostic","diagnosticDuration","dictionaryTipLast","esc","focusedResult","header","lessonGoal","listenRate","media","nextLesson","playFeedback","quiz","quizReturn","readingCard","refresh","render","reviewFollowup","save","screen","skillsResult","speak","startFocused","startSkill","state","storageContext","tab","toast","todaySession","viewStage"];


  function create(ctx){


    const diagnosticFinished=new WeakSet();


    function startQuiz(kind,questions,lesson=null,snapshot=null){
      ctx.quizReturn={tab:ctx.tab,screen:ctx.screen==='quiz'?'main':ctx.screen};
      ctx.media.stop();
      if(!questions.length){
        ctx.toast('No practice questions are ready.');
        return;
      }
      if(kind!=='review')ctx.reviewFollowup='';
      if(lesson)ctx.viewStage=lesson.stage;
      ctx.quiz={kind,questions,lesson,index:0,answers:[],selected:null,checked:false,readingReady:false,modelRevealed:false,audioPlayed:false,audioUnavailable:false,audioLoading:false,listenRate:ctx.listenRate,...(kind==='lesson'?{hintRevealed:false}:{}),spanishHelpRevealed:false,scaffoldRevealed:false,confidence:null,...(snapshot||{})};
      ctx.screen='quiz';
      ctx.diagnostic(kind==='lesson'?'lesson_opened':kind==='review'?'review_started':'practice_opened',{mode:kind});
      persistQuiz();
      ctx.render();
    }


    function persistQuiz(){
      if(!ctx.quiz||ctx.quiz.index>=ctx.quiz.questions.length)return;
      if(ctx.quiz?.kind==='skill'){
        ctx.state.practiceHub=ctx.state.practiceHub||ctx.K.empty();
        ctx.state.practiceHub.active=JSON.parse(JSON.stringify(ctx.quiz));
        delete ctx.state.practiceHub.active.audioLoading;
        delete ctx.state.practiceHub.active.listenRate;
        ctx.save();
        return;
      }
      if(ctx.quiz?.kind==='focused'){
        ctx.state.focused=ctx.state.focused||ctx.F.empty();
        ctx.state.focused.active=JSON.parse(JSON.stringify(ctx.quiz));
        delete ctx.state.focused.active.audioLoading;
        delete ctx.state.focused.active.listenRate;
        ctx.save();
        return;
      }
      if(ctx.quiz&&ctx.quiz.kind==='lesson'){
        ctx.state.active=JSON.parse(JSON.stringify(ctx.quiz));
        delete ctx.state.active.audioLoading;
        delete ctx.state.active.listenRate;
        ctx.save();
      }
    }


    function renderQuiz(){
      if(ctx.quiz.index>=ctx.quiz.questions.length){
        finishQuiz();
        return;
      }
      const tipEligible=ctx.quiz.kind==='lesson'&&ctx.quiz.lesson?.stage==='A1.1'&&ctx.quiz.lesson?.unit===0&&!ctx.quiz.lesson.reading&&!ctx.quiz.lesson.checkpoint&&ctx.state.dictionaryTipSeen!==true,showTip=tipEligible&&((ctx.state.dictionaryTipViews||0)<3||ctx.dictionaryTipLast===currentQuestion().id);
      if(showTip&&ctx.dictionaryTipLast!==currentQuestion().id){
        ctx.dictionaryTipLast=currentQuestion().id;
        ctx.state.dictionaryTipViews=Math.min(3,(ctx.state.dictionaryTipViews||0)+1);
        ctx.save();
      }
      ctx.app.innerHTML=(ctx.storageContext.readOnly?'<p class="notice" role="status">Temporary practice: your original save is protected. Export it from Profile before recovery; these attempts cannot be saved.</p>':'')+ctx.QuizView.render({quiz:ctx.quiz,E:ctx.E,b:ctx.b,esc:ctx.esc,state:ctx.state,readingCard:ctx.readingCard,lessonGoal:ctx.lessonGoal,showDictionaryTip:showTip,compactMedia:currentQuestion()?.practice&&ctx.state.focused?.seenInstructions[currentQuestion().practice.kind]===true});
      ctx.refresh();
    }


    function finishQuiz(){
      if(!diagnosticFinished.has(ctx.quiz)){
        diagnosticFinished.add(ctx.quiz);
        ctx.diagnosticDuration();
        ctx.diagnostic(ctx.quiz.kind==='lesson'?'lesson_completed':ctx.quiz.kind==='review'?'review_completed':'practice_completed',{mode:ctx.quiz.kind,selfAssessed:ctx.quiz.questions.every(q=>q.type==='speaking'||ctx.Writing.open(q)),wrongCount:ctx.quiz.answers.filter((a,i)=>a===false&&ctx.quiz.questions[i].type!=='speaking'&&!ctx.Writing.open(ctx.quiz.questions[i])).length,completed:ctx.quiz.kind!=='lesson'||ctx.quiz.answers.filter((a,i)=>ctx.quiz.questions[i].type!=='speaking'&&!ctx.Writing.open(ctx.quiz.questions[i])).filter(Boolean).length/Math.max(1,ctx.quiz.answers.filter((a,i)=>ctx.quiz.questions[i].type!=='speaking'&&!ctx.Writing.open(ctx.quiz.questions[i])).length)>=.8||!ctx.quiz.lesson?.checkpoint&&ctx.quiz.questions.every(ctx.Writing.open)&&Object.keys(ctx.quiz.writingResponses||{}).length===ctx.quiz.questions.length});
      }
      if(ctx.quiz.kind==='skill'){
        ctx.skillsResult=ctx.K.finish(ctx.state,ctx.quiz);
        ctx.E.markDay(ctx.state);
        ctx.save();
        ctx.screen='skillResult';
        ctx.app.innerHTML=ctx.header()+ctx.PracticeHub.result({quiz:ctx.quiz,round:ctx.skillsResult,b:ctx.b,esc:ctx.esc,C:ctx.C});
        ctx.refresh();
        return;
      }
      if(ctx.quiz.kind==='focused'){
        ctx.focusedResult=ctx.F.finish(ctx.state,ctx.quiz);
        ctx.E.markDay(ctx.state);
        ctx.save();
        ctx.screen='focusedResult';
        ctx.app.innerHTML=ctx.header()+ctx.FocusedView.result({result:ctx.focusedResult,b:ctx.b,esc:ctx.esc});
        ctx.refresh();
        return;
      }
      const scored=ctx.quiz.answers.filter((_,i)=>ctx.quiz.questions[i].type!=='speaking'&&!ctx.Writing.open(ctx.quiz.questions[i])),score=scored.filter(Boolean).length,total=scored.length;
      if(ctx.quiz.kind==='placement'){
        ctx.state.placement={answers:ctx.quiz.answers,stage:ctx.E.placementResult(ctx.quiz.answers),date:ctx.E.dayKey()};
        ctx.state.onboarded=true;
        ctx.screen='placementResult';
        ctx.quiz=null;
        ctx.save();
        ctx.render();
        return;
      }
      if(ctx.quiz.kind==='lesson'){
        const previouslyComplete=ctx.state.completed.includes(ctx.quiz.lesson.id),requiredBefore=ctx.nextLesson()?.id;
        ctx.E.complete(ctx.state,ctx.quiz.lesson,score,total,{reflected:Object.keys(ctx.quiz.writingResponses||{}).length});
        if(requiredBefore===ctx.quiz.lesson.id&&!previouslyComplete&&ctx.state.completed.includes(ctx.quiz.lesson.id)&&ctx.nextLesson()?.stage!==ctx.quiz.lesson.stage)ctx.diagnostic('stage_progressed',{stage:ctx.quiz.lesson.stage});
        ctx.state.active=null;
      }else ctx.E.markDay(ctx.state);
      ctx.save();
      ctx.screen='main';
      const passed=total===0||score/total>=.8;
      ctx.app.innerHTML=ctx.completionView.render({score,total,passed});
      ctx.refresh();
    }


    function currentQuestion(){
      return ctx.quiz?.questions[ctx.quiz.index];
    }


    function answerAllowed(){
      const q=currentQuestion();
      return q&&!ctx.quiz.checked&&(!ctx.quiz.lesson?.reading||ctx.quiz.readingReady)&&(!q.listening||ctx.quiz.audioPlayed);
    }


    function record(correct,selected,skipped=false){
      const q=currentQuestion(),concept=ctx.LearningQuality.concepts(q,ctx.C)[0],beforeStatus=concept?ctx.M.status(ctx.state.mastery?.records['concept:'+concept.id]):'',support=ctx.quiz.hintRevealed?'english':ctx.quiz.spanishHelpRevealed||ctx.quiz.scaffoldRevealed||ctx.quiz.kind==='lesson'&&q.teachingModel?'spanish':'independent',confidence=ctx.quiz.confidence;
      const last=ctx.state.events.filter(e=>e.questionId===q.id&&e.correct&&!e.assisted&&e.confidence!=='unsure').at(-1);
      ctx.quiz.retentionDays=ctx.quiz.retentionDays||{};
      ctx.quiz.retentionDays[ctx.quiz.index]=last&&support==='independent'&&confidence!=='unsure'&&q.type!=='speaking'&&!ctx.Writing.open(q)?Math.max(0,Math.floor((Date.now()-last.at)/86400000)):0;
      ctx.quiz.selected=selected;
      ctx.quiz.checked=true;
      ctx.quiz.answers.push(skipped?null:correct);
      ctx.diagnostic('answer_checked',{questionId:q.id,mode:ctx.quiz.kind,skipped,correct:skipped?false:correct,assisted:support!=='independent'||!!q.shadowing,selfAssessed:q.type==='speaking',support,wrongCount:correct&&!skipped?0:1});
      ctx.playFeedback(correct);
      ctx.E.recordAnswer(ctx.state,q,correct,Date.now(),{...(skipped?{skipped:true}:{}),...(support!=='independent'||q.shadowing?{assisted:true}:{}),support,confidence,scaffolded:ctx.quiz.scaffoldRevealed===true||ctx.quiz.kind==='lesson'&&!!q.teachingModel});
      if(ctx.quiz.kind==='skill'){
        ctx.K.record(ctx.state,ctx.quiz,q,correct,ctx.C,{skipped,assisted:support!=='independent'||q.shadowing,support,confidence});
        if(!correct&&!skipped)ctx.K.reinforce(ctx.state,ctx.quiz,q,ctx.C,ctx.D);
      }else if(q.practice)ctx.F.record(ctx.state,q,correct,{session:ctx.quiz.sessionId,skipped,assisted:support!=='independent'||q.shadowing,support,confidence,modelAssisted:q.shadowing===true});else if(ctx.quiz.kind!=='placement')ctx.L.recordCourse(ctx.state,q,correct,ctx.C,{session:'course-'+ctx.E.dayKey(),assisted:support!=='independent',support,confidence,skipped,modelAssisted:ctx.quiz.kind==='lesson'&&!!q.teachingModel});
      const afterRecord=concept&&ctx.state.mastery?.records['concept:'+concept.id];
      ctx.quiz.learningMessage=correct&&afterRecord?.attempts>=3&&ctx.M.status(afterRecord)!==beforeStatus?concept.label+': '+beforeStatus+' → '+ctx.M.status(afterRecord):'';
      ctx.save();
      persistQuiz();
    }


    const handlers={
storyPredict:el=>{
      if(ctx.quiz?.lesson?.reading&&!ctx.quiz.readingReady){
        ctx.quiz.storyPrediction=String(el.dataset.value||'').slice(0,160);
        persistQuiz();
      }
    },
qualityConfidence:el=>{
      if(answerAllowed()&&['review','practice'].includes(ctx.quiz.kind)&&['sure','unsure'].includes(el.dataset.value)){
        ctx.quiz.confidence=el.dataset.value;
        persistQuiz();
      }
    },
spanishHelp:()=>{
      const q=currentQuestion();
      if(q?.instructionLanguage==='es'&&!ctx.quiz.checked){
        ctx.quiz.spanishHelpRevealed=true;
        persistQuiz();
      }
    },
qualitySupport:()=>{
      const q=currentQuestion();
      if(!answerAllowed()||!ctx.Structured.active(q)||q.listening)return;
      ctx.quiz.scaffoldRevealed=true;
      if(q.type==='cloze'&&q.cloze.blanks.length>1){
        const a=ctx.Structured.selection(ctx.quiz.selected);
        for(let i=0;i<q.cloze.blanks.length;i++)if(a[i]===undefined)a[i]=999;
        a[0]=q.cloze.blanks[0].options.indexOf(q.cloze.blanks[0].answer);
        ctx.quiz.selected=JSON.stringify(a);
      }
      persistQuiz();
    },
chunkReplay:el=>{
      const q=currentQuestion(),attempt=ctx.quiz,i=Number(el.dataset.chunk);
      if(!ctx.quiz?.checked||!q?.listening)return;
      const chunk=ctx.LearningQuality.chunks(q.listening.transcript)[i];
      if(chunk)ctx.media.listen({transcript:chunk,rate:ctx.listenRate},started=>{
        if(started&&ctx.quiz===attempt&&currentQuestion()===q&&ctx.screen==='quiz'){
          ctx.quiz.replayedChunk=i;
          persistQuiz();
          ctx.render();
        }
      });
    },
tileAdd:el=>{
      const q=currentQuestion();
      if(!answerAllowed()||q.type!=='tiles')return;
      const a=ctx.Structured.selection(ctx.quiz.selected),i=Number(el.dataset.index);
      if(Number.isInteger(i)&&i>=0&&i<q.tiles.length&&!a.includes(i)){
        ctx.quiz.selected=JSON.stringify([...a,i]);
        persistQuiz();
      }
    },
tileRemove:el=>{
      if(!answerAllowed()||currentQuestion().type!=='tiles')return;
      const a=ctx.Structured.selection(ctx.quiz.selected),i=Number(el.dataset.position);
      if(Number.isInteger(i)&&i>=0&&i<a.length){
        a.splice(i,1);
        ctx.quiz.selected=a.length?JSON.stringify(a):null;
        persistQuiz();
      }
    },
clozePick:el=>{
      const q=currentQuestion();
      if(!answerAllowed()||q.type!=='cloze')return;
      const a=ctx.Structured.selection(ctx.quiz.selected),i=Number(el.dataset.blank),j=Number(el.dataset.index);
      if(Number.isInteger(i)&&Number.isInteger(j)&&q.cloze.blanks[i]?.options[j]!==undefined){
        for(let k=0;k<q.cloze.blanks.length;k++)if(a[k]===undefined)a[k]=999;
        a[i]=j;
        ctx.quiz.selected=JSON.stringify(a);
        persistQuiz();
      }
    },
structuredReset:()=>{
      if(answerAllowed()&&ctx.Structured.active(currentQuestion())){
        ctx.quiz.selected=null;
        persistQuiz();
      }
    },
readStory:()=>{
      if(ctx.quiz?.lesson?.reading){
        ctx.quiz.readingReady=true;
        persistQuiz();
      }
    },
answer:el=>{
      if(!answerAllowed())return;
      const q=currentQuestion(),index=Number(el.dataset.index);
      if(q.options&&Number.isInteger(index)&&index>=0&&index<q.options.length){
        ctx.quiz.selected=q.options[index];
        persistQuiz();
      }
    },
check:()=>{
      const q=currentQuestion();
      if(!answerAllowed()||ctx.Structured.active(q)&&!ctx.Structured.ready(q,ctx.quiz.selected)||q.type==='speaking'||ctx.quiz.selected===null||!String(ctx.quiz.selected).trim())return;
      if(ctx.Writing.open(q)){
        ctx.quiz.checked=true;
        persistQuiz();
        return;
      }
      record(ctx.E.isCorrect(q,ctx.quiz.selected),ctx.quiz.selected);
    },
writingRevise:()=>{
      const q=currentQuestion();
      if(!ctx.Writing.open(q)||!ctx.quiz.checked||ctx.quiz.answers.length!==ctx.quiz.index)return;
      ctx.quiz.checked=false;
      ctx.quiz.hintRevealed=true;
      ctx.quiz.modelAssisted=true;
      persistQuiz();
    },
writingReflect:el=>{
      const q=currentQuestion();
      if(!ctx.Writing.open(q)||!ctx.quiz.checked||ctx.quiz.answers.length!==ctx.quiz.index||!['got','needs'].includes(el.dataset.result))return;
      const support=ctx.quiz.englishHelpUsed||ctx.quiz.hintRevealed&&!ctx.quiz.modelAssisted?'english':ctx.quiz.spanishHelpRevealed?'spanish':ctx.quiz.modelAssisted?undefined:'independent';
      const a=ctx.Writing.assess(q,ctx.quiz.selected),got=el.dataset.result==='got';
      ctx.diagnostic('answer_checked',{questionId:q.id,mode:ctx.quiz.kind,selfAssessed:!a.verified,assisted:support!=='independent',support,...(a.verified?{correct:got&&!a.issues.length}:{})});
      ctx.quiz.answers.push(null);
      ctx.quiz.writingResponses=ctx.quiz.writingResponses||{};
      ctx.quiz.writingResponses[ctx.quiz.index]={response:ctx.quiz.selected,reflection:got?'got':'needs',outcome:a.outcome};
      ctx.E.recordAnswer(ctx.state,{...q,previousResponse:ctx.quiz.selected},got&&!a.issues.length,Date.now(),{unverified:!a.verified,assisted:ctx.quiz.hintRevealed===true||ctx.quiz.spanishHelpRevealed===true,support});
      ctx.L.recordCourse(ctx.state,q,got&&!a.issues.length,ctx.C,{session:'course-'+ctx.E.dayKey(),assisted:ctx.quiz.hintRevealed===true||ctx.quiz.spanishHelpRevealed===true,support,modelAssisted:ctx.quiz.modelAssisted===true,selfAssessed:!a.verified,recall:a.verified,item:q.id});
      persistQuiz();
      ctx.save();
    },
listen:()=>{
      const q=currentQuestion(),attempt=ctx.quiz;
      if((!q?.listening&&!q?.shadowing)||ctx.quiz.audioLoading)return;
      ctx.quiz.audioLoading=true;
      ctx.quiz.audioUnavailable=false;
      ctx.media.listen({...q.listening,...(q.shadowing?{transcript:q.spanish}:{}),rate:ctx.listenRate},started=>{
        if(ctx.quiz!==attempt||currentQuestion()!==q||ctx.screen!=='quiz')return;
        ctx.quiz.audioLoading=false;
        ctx.quiz.audioPlayed=ctx.quiz.audioPlayed||started;
        ctx.quiz.audioUnavailable=!started;
        persistQuiz();
        ctx.render();
      });
    },
listenSpeed:el=>{
      const rate=Number(el.dataset.rate);
      if(![.75,1].includes(rate)||(!currentQuestion()?.listening&&!currentQuestion()?.shadowing))return;
      ctx.listenRate=rate;
      ctx.quiz.listenRate=rate;
      if(ctx.quiz.audioLoading){
        ctx.media.stop();
        ctx.quiz.audioLoading=false;
        ctx.quiz.audioUnavailable=false;
      }
    },
skipListening:()=>{
      if(currentQuestion()?.listening&&!ctx.quiz.checked)record(false,null,true);
    },
englishHint:()=>{
      const q=currentQuestion();
      if(q?.instructionLanguage==='es'&&q.englishHint){
        ctx.quiz.hintRevealed=true;
        ctx.quiz.englishHelpUsed=true;
        persistQuiz();
      }
    },
revealModel:()=>{
      if(currentQuestion()?.type==='speaking'&&!ctx.quiz.checked&&(!currentQuestion().shadowing||ctx.quiz.audioPlayed)){
        ctx.quiz.modelRevealed=true;
        persistQuiz();
      }
    },
selfAssess:el=>{
      if(currentQuestion()?.type!=='speaking'||currentQuestion()?.shadowing&&!ctx.quiz.audioPlayed||!ctx.quiz.modelRevealed||ctx.quiz.checked||!['got','needs'].includes(el.dataset.result))return;
      record(el.dataset.result==='got',el.dataset.result);
    },
next:()=>{
      if(!ctx.quiz?.checked||ctx.quiz.answers.length!==ctx.quiz.index+1)return;
      ctx.media.stop();
      ctx.quiz.index++;
      ctx.quiz.checked=false;
      ctx.quiz.selected=null;
      ctx.quiz.modelRevealed=false;
      ctx.quiz.spanishHelpRevealed=false;
      ctx.quiz.scaffoldRevealed=false;
      ctx.quiz.modelAssisted=false;
      ctx.quiz.englishHelpUsed=false;
      ctx.quiz.confidence=null;
      ctx.quiz.learningMessage='';
      delete ctx.quiz.replayedChunk;
      ctx.quiz.hintRevealed=false;
      ctx.quiz.audioPlayed=false;
      ctx.quiz.audioUnavailable=false;
      if(ctx.quiz.kind==='focused'&&currentQuestion())ctx.F.remember(ctx.state,currentQuestion());
      persistQuiz();
    },
leave:()=>{
      if(ctx.quiz&&ctx.quiz.index<ctx.quiz.questions.length){
        ctx.diagnosticDuration();
        ctx.diagnostic('activity_left',{mode:ctx.quiz.kind,completed:false});
      }
      ctx.todaySession=null;
      ctx.media.stop();
      if(ctx.quiz)ctx.quiz.audioLoading=false;
      persistQuiz();
      ctx.quiz=null;
      ctx.screen='main';
    },
retry:()=>{
      if(ctx.quiz?.kind==='focused')ctx.startFocused(ctx.quiz.mediaKind,ctx.quiz.stage);else if(ctx.quiz?.kind==='skill')ctx.startSkill(ctx.quiz.skillKind);else if(ctx.quiz)startQuiz(ctx.quiz.kind,ctx.quiz.questions,ctx.quiz.lesson);
    },
speakStory:()=>{
      const reading=ctx.quiz?.lesson?.reading||currentQuestion()?.reading;
      if(reading)ctx.speak(reading.text);
    },
speak:()=>{
      const q=currentQuestion();
      if(q&&(ctx.quiz.checked||q.type==='speaking'&&ctx.quiz.modelRevealed))ctx.speak(q.spanish);
    },
speakModel:el=>{
      const q=currentQuestion(),model=q?.models?.[Number(el.dataset.model)];
      if(q?.type==='speaking'&&ctx.quiz.modelRevealed&&model)ctx.speak(model);
    }
};


    return {startQuiz,persistQuiz,renderQuiz,finishQuiz,currentQuestion,answerAllowed,record,actions:handlers};


  }


  root.QuizController={dependencies,create};
  if(typeof module!=='undefined')module.exports=root.QuizController;


})(typeof window==='undefined'?globalThis:window);
