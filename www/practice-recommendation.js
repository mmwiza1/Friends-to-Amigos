(function(root){


  'use strict';

// Pure deterministic learner-evidence policy; no DOM or diagnostics dependency.

  const K=typeof module!=='undefined'?require('./practice-skills'):root.PracticeSkills;


  function contextReady(state,C){
    const level=C.playableStages.indexOf(K.stage(state,C)),known=new Set(K.lessons(state,C).map(l=>l.id)),bank=typeof module!=='undefined'?require('./conjugations-bank'):root.ConjugationsBank;
    return bank.questions.filter(q=>C.playableStages.indexOf(q.stage)<=level).every(q=>q.requiredActivities.every(id=>known.has(id)));
  }


  function eligibleWeak(state,C,area){
    const key=typeof area==='string'?area:area.key,Q=typeof module!=='undefined'?require('./learning-quality'):root.LearningQuality,D=typeof module!=='undefined'?require('./learner-dictionary'):root.LearnerDictionary;
    if(/^concept:(?:vocabulary|sentence-building|numbers-time|spot-correction|practice-(?:numbers|time|prices|dates))$/.test(key)){
      const kind=key==='concept:vocabulary'?'rapid':key==='concept:sentence-building'?'builder':key==='concept:spot-correction'?'spot':'numbers',pool=K.pool(kind,state,C,D),category=key.match(/^concept:practice-(numbers|time|prices|dates)$/)?.[1];
      return pool.length>=10&&(!category||pool.some(q=>q.practiceCategory===category));
    }
    const entry=Q.resolve(key,C,state);
    return !!entry&&K.reached(state,C,C.lessons.find(l=>l.id===entry.source));
  }


  function recommendation(state,C,now=Date.now()){


    const stage=K.stage(state,C),resume=state.practiceHub?.active;
    if(resume)return {kind:'resume',title:K.names[resume.skillKind],reason:'Continue your saved practice, exactly where you stopped.',meta:(resume.index+1)+' of '+resume.questions.length+' · '+resume.skillStage};


    if(state.games?.active)return {kind:'contextResume',title:'Verb in Context',reason:'Your saved sentence round is ready to continue.',meta:(state.games.active.index+1)+' of 10 · '+state.games.active.stage};


    if(state.blanks?.active)return {kind:'trainerResume',title:'Verb Trainer',reason:'Keep building your saved verb patterns.',meta:(state.blanks.active.index+1)+' of '+state.blanks.active.tables.length+' tables · '+state.blanks.active.stage};


    if(state.focused?.active)return {kind:'focusedResume',title:state.focused.active.questions[0]?.shadowing?'Shadowing':state.focused.active.mediaKind==='speaking'?'Speaking':'Listening',reason:'Continue your saved focused session.',meta:(state.focused.active.index+1)+' of '+state.focused.active.questions.length+' · '+state.focused.active.stage};


    const M=typeof module!=='undefined'?require('./mastery'):root.Mastery,Q=typeof module!=='undefined'?require('./learning-quality'):root.LearningQuality;


    const weak=M.areas(state,C).find(a=>a.status==='Needs practice'&&a.priority>=3&&eligibleWeak(state,C,a));


    if(weak){
      const kind=weak.key==='concept:vocabulary'?'rapid':weak.key==='concept:sentence-building'?'builder':weak.key==='concept:spot-correction'?'spot':weak.key==='concept:numbers-time'||weak.key.startsWith('concept:practice-')?'numbers':'fix';
      return {kind,focus:weak.key,title:K.names[kind],reason:weak.label+' · '+(state.mastery.records[weak.key].errors||0)+' recorded mistakes. Practise this pattern with related examples.',meta:'Short targeted practice · '+stage};
    }


    const repeat=Object.values(state.reviews).filter(r=>!r.corrected&&r.wrong>=2&&C.lessons.some(l=>K.reached(state,C,l)&&l.questions.some(q=>q.id===(r.question.sourceQuestionId||r.question.id)))).sort((a,b)=>b.wrong-a.wrong)[0];
    if(repeat)return {kind:'fix',title:'Fix My Mistakes',reason:'Revisit '+repeat.topic+' with examples and related contrasts.',meta:'10 questions · ~4 min · '+stage};


    if(state.completed.length>=3){
      const focused=state.focused?.history||[];
      for(const kind of ['listening','speaking'])if(!focused.some(r=>r.kind===kind&&now-r.at<7*86400000)&&!(state.practiceHub?.history||[]).some(r=>r.kind===kind&&now-r.at<7*86400000))return {kind,title:K.names[kind],reason:kind==='listening'?'You haven’t practised listening recently. Revisit familiar Spanish.':'Say familiar Spanish aloud. Speaking is self-assessed.',meta:'10 items · ~5 min · '+stage};
    }


    if(stage==='A1.1'&&state.completed.length<3)return {kind:'builder',title:'Sentence Builder',reason:'Build familiar greetings and names from your opening lessons.',meta:'10 questions · ~4 min · A1.1'};


    if(!contextReady(state,C))return {kind:'builder',title:'Sentence Builder',reason:'Build Spanish from course material you have already reached.',meta:'10 questions · ~4 min · '+stage};


    return {kind:'context',title:'Verb in Context',reason:'Strengthen the sentence patterns from your current course path.',meta:'10 questions · ~4 min · '+stage};


  }


  root.PracticeRecommendation={contextReady,eligibleWeak,recommendation};
  if(typeof module!=='undefined')module.exports=root.PracticeRecommendation;


})(typeof window==='undefined'?globalThis:window);
