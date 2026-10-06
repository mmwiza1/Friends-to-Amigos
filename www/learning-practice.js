(function(root){
'use strict';
const M=typeof module!=='undefined'?require('./mastery.js'):root.Mastery;
const B=typeof module!=='undefined'?require('./blanks.js'):root.ConjugationBlanks;
const Bank=typeof module!=='undefined'?require('./conjugations-bank.js'):root.ConjugationsBank;
function tags(q,C){const lesson=C.lessons.find(l=>l.questions.some(x=>x.id===(q.sourceQuestionId||q.id)))||C.lessons.find(l=>l.questions.some(x=>x.id===q.id));if(!lesson)return [];
 const result=[{key:'outcome:'+lesson.outcomeId},{key:'concept:'+q.topic.toLowerCase().replace(/[^a-z0-9]+/g,'-')}];
 // Only positive Spanish answers receive form evidence; distractors and English
 // comprehension answers must not manufacture knowledge of a conjugation.
 if(q.language==='es'){
  const value=q.answer.toLowerCase();const positive=form=>{const escaped=form.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(?:^|[.!?]\\s*|\\b(?:yo|tú|él|ella|usted|nosotros|vosotros|ellos|ellas|ustedes|ana|luis|marta|diego|hoy|ayer|mañana|después|luego|entonces|porque|pero|y|no|esta semana)\\s+)'+escaped+'(?=\\s|[.!?,;:]|$)').test(value);};
  for(const b of Bank.questions.flatMap(x=>x.blanks).filter(b=>b.source===lesson.id))if(positive(b.answer))result.push({verb:b.verb,tense:'present',person:b.person,pattern:b.concept});
  for(const target of (typeof module!=='undefined'?require('./conjugation-targets.js'):root.ConjugationTargets).targets.filter(t=>C.playableStages.indexOf(t.stage)<C.playableStages.indexOf(lesson.stage)||t.stage===lesson.stage&&t.unit<=lesson.unit))target.forms.forEach((form,i)=>{if(positive(form))result.push({verb:target.verb,tense:target.tense,person:['yo','tu','third','nosotros','vosotros','plural'][i],pattern:target.pattern});});
 }
 return result;
}
function recordCourse(state,q,correct,C,details={},now=Date.now()){M.record(state,tags(q,C),correct,{...details,item:q.sourceQuestionId||q.id,recall:q.type==='text'&&q.language==='es',selfAssessed:q.type==='speaking'},now);}
function today(state,C,now=Date.now()){
 const due=Object.values(state.reviews).filter(r=>r.due<=now&&!r.question.id?.startsWith('placement-')).sort((a,b)=>a.due-b.due).slice(0,8).map(r=>r.question),seen=new Set(due.map(q=>q.id));
 const focus=M.areas(state,C).find(a=>a.status==='Needs practice'&&B.pool(state,C,'all',a.key).length)?.key||'';
 const last={};for(const e of state.events)if(e.questionId)last[e.questionId]=Math.max(last[e.questionId]||0,e.at||0);
 const retrieval=C.lessons.filter(l=>state.completed.includes(l.id)&&!l.checkpoint).flatMap(l=>l.questions).filter(q=>!seen.has(q.id)&&(q.type==='text'||q.listening)&&!q.reading&&now-(last[q.id]||0)>=86400000).sort((a,b)=>(last[a.id]||0)-(last[b.id]||0)).slice(0,due.length?2:4);
 return {questions:[...due,...retrieval],focus,items:due.length+retrieval.length+(focus?3:0),minutes:Math.max(1,Math.ceil((due.length+retrieval.length+(focus?6:0))*.45))};
}
function focusedQuestions(state,C,key){const known=new Set(C.lessons.filter(l=>state.completed.includes(l.id)).flatMap(l=>l.questions.map(q=>q.id)));return Object.values(state.reviews).map(r=>r.question).filter(q=>tags(q,C).some(t=>M.keys(t).includes(key))||known.has(q.id)&&key==='concept:'+q.topic.toLowerCase().replace(/[^a-z0-9]+/g,'-')).slice(0,8);}
root.LearningPractice={tags,recordCourse,today,focusedQuestions};if(typeof module!=='undefined')module.exports=root.LearningPractice;
})(typeof window==='undefined'?globalThis:window);
