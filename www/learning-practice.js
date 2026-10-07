(function(root){
'use strict';
const M=typeof module!=='undefined'?require('./mastery.js'):root.Mastery;
const B=typeof module!=='undefined'?require('./blanks.js'):root.ConjugationBlanks;
const S=typeof module!=='undefined'?require('./grammar-syllabus.js'):root.GrammarSyllabus;
const T=typeof module!=='undefined'?require('./conjugation-targets.js'):root.ConjugationTargets;
const Bank=typeof module!=='undefined'?require('./conjugations-bank.js'):root.ConjugationsBank;
const indexes=new WeakMap();function index(C){if(!indexes.has(C))indexes.set(C,new Map(C.lessons.flatMap(l=>l.questions.map(q=>[q.id,l]))));return indexes.get(C);}
const bankBlanks=Bank.questions.flatMap(q=>q.blanks);
function tags(q,C){const lesson=index(C).get(q.sourceQuestionId||q.id)||index(C).get(q.id);if(!lesson)return [];
 // A2.2 imperfect yo/third forms can be identical. Without a labelled row,
 // record the pattern rather than infer two different grammatical persons.
 const formTag=(verb,tense,pattern,person,form)=>({verb,tense,pattern,...(T.targets.some(t=>t.verb===verb&&t.tense===tense&&t.forms.filter(f=>f===form).length>1)?{}:{person})});
 const result=[{key:'outcome:'+lesson.outcomeId},{key:'concept:'+q.topic.toLowerCase().replace(/[^a-z0-9]+/g,'-')},...(q.supportConcept?[{key:'concept:'+q.supportConcept}]:[])];
 // Only positive Spanish answers receive form evidence; distractors and English
 // comprehension answers must not manufacture knowledge of a conjugation.
 if(q.language==='es'){
  const value=q.answer.toLowerCase();const positive=form=>{const escaped=form.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return new RegExp('(?:^|[.!?]\\s*|\\b(?:yo|tú|él|ella|usted|nosotros|vosotros|ellos|ellas|ustedes|ana|luis|marta|diego|hoy|ayer|mañana|después|luego|entonces|porque|pero|y|no|esta semana)\\s+)'+escaped+'(?=\\s|[.!?,;:]|$)').test(value);};
  for(const b of bankBlanks.filter(b=>b.source===lesson.id))if(positive(b.answer))result.push(formTag(b.verb,b.tense||'present',b.concept,b.person,b.answer));
  for(const target of T.targets.filter(t=>C.playableStages.indexOf(t.stage)<C.playableStages.indexOf(lesson.stage)||t.stage===lesson.stage&&t.unit<=lesson.unit))target.forms.forEach((form,i)=>{if(positive(form))result.push(formTag(target.verb,target.tense,target.pattern,T.persons[i],form));});
 }
 return result;
}
function recordCourse(state,q,correct,C,details={},now=Date.now()){M.record(state,tags(q,C).filter(t=>(!details.skipped||t.key!=='concept:'+q.supportConcept)&&(!details.selfAssessed||!!t.key)),correct,{...details,item:q.sourceQuestionId||q.id,recall:q.type==='text'&&q.language==='es',selfAssessed:details.selfAssessed===true||q.type==='speaking'},now);}
function today(state,C,now=Date.now()){
 const due=Object.values(state.reviews).filter(r=>r.due<=now&&!r.question.id?.startsWith('placement-')&&withinLevel(r.question,state,C)).sort((a,b)=>a.due-b.due).slice(0,8).map(r=>r.question),seen=new Set(due.map(q=>q.id));
 const focus=M.areas(state,C).find(a=>a.status==='Needs practice'&&B.pool(state,C,'all',a.key).length)?.key||'';
 const last={};for(const e of state.events)if(e.questionId)last[e.questionId]=Math.max(last[e.questionId]||0,e.at||0);
 const support=M.areas(state,C).filter(a=>a.key.startsWith('concept:english-support-')&&a.status==='Practise without English support').flatMap(a=>focusedQuestions(state,C,a.key)).filter(q=>withinLevel(q,state,C)&&!seen.has(q.id)&&now-(last[q.id]||0)>=86400000).slice(0,2);for(const q of support)seen.add(q.id);
 const retrieval=C.lessons.filter(l=>state.completed.includes(l.id)&&!l.checkpoint).flatMap(l=>l.questions).filter(q=>withinLevel(q,state,C)&&!seen.has(q.id)&&(q.type==='text'||q.listening)&&!q.reading&&now-(last[q.id]||0)>=86400000).sort((a,b)=>(last[a.id]||0)-(last[b.id]||0)).slice(0,due.length?2:4);
 return {questions:[...due,...support,...retrieval],focus,items:due.length+support.length+retrieval.length+(focus?3:0),minutes:Math.max(1,Math.ceil((due.length+support.length+retrieval.length+(focus?6:0))*.45))};
}
function withinLevel(q,state,C){const lesson=index(C).get(q.sourceQuestionId||q.id),stage=q.practice?.stage||lesson?.stage;return !stage||S.allowed(state,stage);}
function focusedQuestions(state,C,key){const attempted=new Set((state.events||[]).filter(e=>e.type==='answer').map(e=>e.questionId)),snapshots=Object.values(state.reviews).map(r=>r.question),seen=new Set(snapshots.map(q=>q.id));const support=key.startsWith('concept:english-support-')?C.lessons.flatMap(l=>l.questions).filter(q=>attempted.has(q.id)&&!seen.has(q.id)&&'concept:'+q.supportConcept===key):[];return [...snapshots,...support].filter(q=>withinLevel(q,state,C)).filter(q=>tags(q,C).some(t=>M.keys(t).includes(key))).slice(0,8);}

root.LearningPractice={tags,recordCourse,today,focusedQuestions};if(typeof module!=='undefined')module.exports=root.LearningPractice;
})(typeof window==='undefined'?globalThis:window);
