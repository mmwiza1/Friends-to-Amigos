(function(root){
'use strict';
// Starting stage describes the required path, not the stage being viewed for revision.
function inferStart(state,course){
 if(course.playableStages.includes(state.startStage))return state.startStage;
 return state.stage==='A1.2'&&state.placement?'A1.2':'A1.1';
}
function required(state,course){const start=course.playableStages.indexOf(inferStart(state,course));return course.lessons.filter(l=>course.playableStages.indexOf(l.stage)>=start);}
function next(state,course){return required(state,course).find(l=>!state.completed.includes(l.id));}
function complete(state,course){return required(state,course).every(l=>state.completed.includes(l.id));}
function today(state,course,now=Date.now()){
 if(state.active)return {kind:'resume',label:'Resume your saved lesson'};
 if(!state.onboarded)return {kind:'onboard',label:'Choose your starting point'};
 const reviews=Object.values(state.reviews).filter(r=>r.due<=now);
 if(reviews.length)return {kind:'review',label:'Review up to five due items',questions:reviews.slice(0,5).map(r=>r.question)};
 const lesson=next(state,course);return lesson?{kind:'lesson',label:lesson.stage+' · '+lesson.title,lesson}:{kind:'maintenance',label:'A short listening or speaking practice'};
}
root.CoursePath={inferStart,required,next,complete,today};if(typeof module!=='undefined')module.exports=root.CoursePath;
})(typeof window==='undefined'?globalThis:window);
