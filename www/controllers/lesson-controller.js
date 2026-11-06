(function(root){


  'use strict';

// Explicit injected capabilities; no controller-owned learner progress.

  const dependencies=["C","CoursePath","E","L","LearningQuality","Writing","actions","confirm","diagnostic","document","listenRate","practiceQuestions","quiz","quizReturn","reviewFollowup","save","screen","startBlanks","startQuiz","state","tab","toast","todaySession","topicFilter","viewStage"];


  function create(ctx){


    function due(){
      return Object.values(ctx.state.reviews).filter(r=>r.due<=Date.now());
    }


    function nextLesson(){
      return ctx.CoursePath.next(ctx.state,ctx.C);
    }


    function activeStage(){
      return ctx.state.active?.lesson?.stage||nextLesson()?.stage||ctx.C.playableStages.slice().reverse().find(stage=>ctx.C.lessons.some(l=>l.stage===stage&&ctx.state.completed.includes(l.id)))||(ctx.C.playableStages.includes(ctx.state.stage)?ctx.state.stage:'A1.1');
    }


    function todayMedia(){
      const stage=nextLesson()?.stage||ctx.C.playableStages.at(-1),kind=ctx.E.dayKey().charCodeAt(9)%2?'speaking':'listening';
      return {kind:'practice',questions:ctx.practiceQuestions(kind,stage).slice(0,1)};
    }


    function launchTodayStep(step){
      if(step.kind==='resume'){
        ctx.actions.continue();
        return;
      }
      if(step.kind==='onboard'){
        ctx.todaySession=null;
        ctx.screen='onboard';
        return;
      }
      if(step.kind==='lesson'){
        ctx.startQuiz('lesson',step.lesson.questions,step.lesson);
        return;
      }
      ctx.startQuiz(step.kind,step.questions);
    }


    const handlers={
dailyReview:()=>{
      const plan=ctx.L.today(ctx.state,ctx.C);
      ctx.reviewFollowup=plan.focus;
      if(plan.questions.length)ctx.startQuiz('review',plan.questions);else if(plan.focus)ctx.startBlanks({mode:'practice',count:3,scope:'all',focus:plan.focus,recall:true});else ctx.toast('Nothing is due yet. Your review grows as you learn.');
    },
reviewFollowup:()=>{
      if(!ctx.quiz||ctx.quiz.kind!=='review'||ctx.quiz.index<ctx.quiz.questions.length)return;
      const focus=ctx.reviewFollowup;
      ctx.reviewFollowup='';
      ctx.startBlanks({mode:'practice',count:3,scope:'all',focus,recall:true});
    },
continueLearning:()=>{
      if(ctx.quiz?.kind!=='lesson'||ctx.quiz.index<ctx.quiz.questions.length||ctx.quiz.answers.length!==ctx.quiz.questions.length)return;
      if(ctx.todaySession){
        ctx.actions.todayNext();
        return;
      }
      const scored=ctx.quiz.answers.filter((_,i)=>ctx.quiz.questions[i].type!=='speaking'&&!ctx.Writing.open(ctx.quiz.questions[i]));
      if(scored.length&&scored.filter(Boolean).length/scored.length<.8)return;
      ctx.quiz=null;
      const lesson=nextLesson();
      if(lesson){
        ctx.startQuiz('lesson',lesson.questions,lesson);
        return;
      }
      if(due().length){
        ctx.startQuiz('review',due().map(r=>r.question));
        return;
      }
      ctx.tab='Review';
      ctx.screen='main';
      const practice=ctx.practiceQuestions('listening',ctx.C.playableStages.at(-1)).slice(0,3);
      if(practice.length)ctx.startQuiz('practice',practice);
      ctx.toast('Your required playable path is complete. Keep practising listening, speaking and review.');
    },
lessonMistakes:()=>{
      if(ctx.quiz?.kind!=='lesson')return;
      const questions=ctx.quiz.questions.filter((q,i)=>ctx.Writing.open(q)?ctx.quiz.writingResponses?.[i]?.reflection==='needs'||ctx.Writing.assess(q,ctx.quiz.writingResponses?.[i]?.response||'').issues.length>0:ctx.quiz.answers[i]!==true);
      if(questions.length){
        const contrasts=ctx.LearningQuality.retry(ctx.quiz,ctx.state,ctx.C);
        ctx.startQuiz('review',[...questions,...contrasts.filter(q=>!questions.some(x=>x.id===q.id))].slice(0,12));
      }
    },
today:()=>{
      const first=ctx.CoursePath.today(ctx.state,ctx.C);
      if(first.kind==='resume'){
        ctx.todaySession={steps:[todayMedia()]};
        launchTodayStep(first);
        return;
      }
      if(first.kind==='onboard'){
        launchTodayStep(first);
        return;
      }
      const steps=[];
      if(first.kind==='review'){
        const lesson=nextLesson();
        if(lesson)steps.push({kind:'lesson',lesson});
      }
      steps.push(todayMedia());
      ctx.todaySession={steps};
      launchTodayStep(first.kind==='maintenance'?ctx.todaySession.steps.shift():first);
    },
todayNext:()=>{
      const step=ctx.todaySession?.steps.shift();
      if(step)launchTodayStep(step);else{
        ctx.todaySession=null;
        ctx.quiz=null;
        ctx.tab='Home';
        ctx.screen='main';
      }
    },
continue:()=>{
      if(ctx.state.active){
        ctx.quiz=JSON.parse(JSON.stringify(ctx.state.active));
        ctx.screen='quiz';
        ctx.quiz.audioLoading=false;
        ctx.quiz.listenRate=ctx.listenRate;
        ctx.quizReturn={tab:'Home',screen:'main'};
        ctx.diagnostic('lesson_opened',{resumed:true});
      }else if(!ctx.state.onboarded)ctx.screen='onboard';else{
        const l=nextLesson();
        if(l)ctx.startQuiz('lesson',l.questions,l);else ctx.tab='Review';
      }
    },
begin:()=>{
      ctx.state.onboarded=true;
      ctx.state.stage='A1.1';
      ctx.state.startStage='A1.1';
      ctx.save();
      const l=nextLesson()||ctx.C.lessons[0];
      ctx.startQuiz('lesson',l.questions,l);
    },
placement:()=>ctx.startQuiz('placement',ctx.C.placement),
acceptPlacement:()=>{
      const selected=ctx.document.getElementById('stage').value;
      ctx.state.stage=ctx.C.playableStages.includes(selected)?selected:ctx.C.playableStages.at(-1);
      ctx.state.startStage=ctx.state.stage;
      ctx.viewStage=ctx.state.stage;
      ctx.save();
      ctx.screen='main';
      ctx.tab='Learn';
    },
lesson:el=>{
      const l=ctx.C.lessons.find(l=>l.id===el.dataset.id);
      if(!l||!ctx.C.playableStages.includes(l.stage))return;
      if(ctx.state.active&&ctx.state.active.lesson.id!==l.id&&!ctx.confirm('Replace your saved unfinished lesson?'))return;
      ctx.state.onboarded=true;
      ctx.startQuiz('lesson',l.questions,l);
    },
topic:el=>{
      ctx.topicFilter=el.dataset.topic;
      ctx.screen='practice';
    },
startPractice:()=>ctx.startQuiz('review',Object.values(ctx.state.reviews).filter(r=>r.topic===ctx.topicFilter&&!r.corrected).map(r=>r.question)),
review:()=>{
      ctx.reviewFollowup='';
      if(due().length)ctx.startQuiz('review',due().map(r=>r.question));
    }
};


    return {due,nextLesson,activeStage,todayMedia,launchTodayStep,actions:handlers};


  }


  root.LessonController={dependencies,create};
  if(typeof module!=='undefined')module.exports=root.LessonController;


})(typeof window==='undefined'?globalThis:window);
