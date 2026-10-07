(function(root){
'use strict';
const T=typeof module!=='undefined'?require('./conjugation-targets.js'):root.ConjugationTargets;
const levels=['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2'];
// Curriculum references document where a concept is modelled, not access gates.
const rows=[
 ['present-regular-ar','A1.1','conjugation','present','regular-ar','Regular -AR present','u1l2',['hablar','trabajar','desayunar']],
 ['present-regular-er','A1.2','conjugation','present','regular-er','Regular -ER present consolidation','a12u7l2',['comer']],
 ['present-regular-ir','A1.1','conjugation','present','regular-ir','Regular -IR present','u1l0',['vivir']],
 ['present-ser','A1.1','conjugation','present','irregular','Identity and description with ser','u1l0',['ser']],
 ['present-estar','A1.1','conjugation','present','irregular','Feelings and location with estar','u5l2',['estar']],
 ['present-tener','A1.1','conjugation','present','stem-e-ie','Age, hunger and possessions with tener','u1l1',['tener']],
 ['present-ir','A1.1','conjugation','present','irregular','Going somewhere with ir','u6l2',['ir']],
 ['present-querer','A1.1','conjugation','present','stem-e-ie','Requests with querer','u2l0',['querer']],
 ['present-names','A1.1','conjugation','present','reflexive-ar','Names with llamarse','u0l1',['llamarse']],
 ['agreement','A1.1','structure',null,null,'Articles, gender and number','u4l1',[]],
 ['basic-questions','A1.1','structure',null,null,'Names, prices, places and times','u3l0',[]],
 ['ser-estar-hay','A1.1','structure',null,null,'Description, location and existence','u5l2',['ser','estar']],
 ['gustar-singular','A1.1','structure','present','gustar-singular','Gusta with one thing or an activity','u2l1',['gustar']],
 ['gustar-plural','A1.2','structure','present','gustar-plural','Gustan with plural things','a12u0l1',['gustar']],
 ['present-stem-changes','A1.2','conjugation','present','stem-changing','Preferir, poder and familiar stem changes','a12u0l2',['preferir','poder']],
 ['reflexive-routines','A1.2','conjugation','present','reflexive','Getting ready and daily routines','a12u6l0',['levantarse','ducharse','vestirse','acostarse']],
 ['ir-a-infinitive','A1.2','structure','present',null,'Plans with ir a + infinitive','a12u2l0',['ir']],
 ['present-shopping','A1.2','conjugation','present',null,'Clothes, purchases and arrangements','a12u4l2',['necesitar','llevar','pagar','quedar']],
 ['present-consolidation','A1.2','conjugation','present',null,'Connected present-tense responses','a12u7l0',['comer','tomar','escuchar','salir']],
 ['simple-connectors','A1.2','structure',null,null,'Y, pero, porque, después and entonces','a12u7l2',[]],
 ['present-perfect','A2.1','conjugation','present-perfect','perfect','Recent / open-period experiences','a21u0l0',['visitar','comer','hacer','necesitar','volver']],
 ['selected-preterite','A2.1','conjugation','preterite',null,'Selected completed-event forms','a21u1l0',['visitar','ir','hacer','llegar','tomar']],
 ['comparisons','A2.1','structure',null,null,'Más / menos que and tan como','a21u2l0',[]],
 ['practical-modals','A2.1','structure','present',null,'Practical needs, obligations and requests','a21u6l0',['tener','necesitar','poder','querer']],
 ['linked-messages','A2.1','structure',null,null,'Sequence, reason and practical plans','a21u7l0',[]],
 ['imperfect-background','A2.2','conjugation','imperfect',null,'Past routines and background','a22u0l0',['vivir','trabajar','ser','tener','ir','hacer','estudiar']],
 ['past-event-background','A2.2','structure',null,null,'What was happening and what happened','a22u1l2',[]],
 ['preterite-er-ir','A2.2','conjugation','preterite',null,'Completed -ER / -IR events','a22u1l0',['comer','vivir','salir','perder']],
 ['preterite-practical-irregulars','A2.2','conjugation','preterite','irregular','Travel, service and plan changes','a22u2l1',['tener','poder','decir','venir','querer','estar','ver']],
 ['routine-problems','A2.2','structure',null,null,'Clarifying directions, meals and purchases','a22u3l1',[]],
 ['opinions-agreement','A2.2','structure',null,null,'Opinions, reasons, también and tampoco','a22u6l0',[]],
 ['connected-past-plans','A2.2','structure',null,null,'Background, events, result and a new plan','a22u7l2',[]],
 ['health-doler','A2.1','structure','present',null,'Me duele / me duelen in health requests','a21u5l0',['doler']]
];
rows.push(...[
['future-plans','B1.1','conjugation','future',null,'Future plans and intentions','b11u2l0',['ir','tener','hacer','poder']],
['conditional-advice','B1.1','conjugation','conditional',null,'Advice and possible solutions','b11u3l0',['deber','poder','pedir']],
['past-duration','B1.1','structure',null,null,'Changes, duration and connected narration','b11u1l0',[]],
['wishes-necessity','B1.2','conjugation','present-subjunctive',null,'Wishes, reactions and necessity','b12u6l0',['venir','tener','estar']],
['prior-past-events','B2.1','conjugation','pluperfect',null,'Earlier events within a past account','b21u0l0',['empezar']],
['uncertainty-viewpoints','B2.1','structure',null,null,'Sources, evidence and qualified viewpoints','b21u2l0',[]],
['imagined-present','B2.1','conjugation','imperfect-subjunctive',null,'Imagined conditions and consequences','b21u6l0',['tener','poder']],
['register-reporting','B2.2','structure',null,null,'Register and faithful reported information','b22u4l0',[]],
['past-alternatives','B2.2','conjugation','conditional-perfect',null,'Past alternatives and reflection','b22u1l1',['pedir']],
['imagined-past-condition','B2.2','conjugation','pluperfect-subjunctive',null,'Imagined past conditions','b22u6l0',['comprobar']],
['possible-completed-change','B2.2','conjugation','present-perfect-subjunctive',null,'Possible completed changes','b22u6l1',['cambiar']]
]);
const concepts=rows.map(([id,level,category,tense,pattern,label,source,exampleVerbs])=>({id,level,category,tense,pattern,label,source,exampleVerbs,authorship:'original Friends to Amigos'}));
// Forms/irregular explanations have one source of truth: the curated table data.
const targets=T.targets.map(t=>({...t,level:t.stage,persons:T.persons,regional:'Spain-first; vosotros/as included'}));
function level(state){if(levels.includes(state.grammarLevel))return state.grammarLevel;if(levels.includes(state.stage)&&state.stage!=='A1.1')return state.stage;if(levels.includes(state.startStage))return state.startStage;return levels.includes(state.stage)?state.stage:'A1.1';}
function allowed(state,stage){return levels.includes(stage)&&levels.indexOf(stage)<=levels.indexOf(level(state));}
const lookup=new WeakMap();function courseMap(C){if(!lookup.has(C))lookup.set(C,new Map(C.lessons.flatMap(l=>[[l.id,l],...l.questions.map(q=>[q.id,l])])));return lookup.get(C);}
function recentLessons(state,C,now=Date.now()){const matched=(state.events||[]).filter(e=>['lesson','answer'].includes(e.type)&&now-e.at>=0&&now-e.at<=7*86400000).slice(-30).map(e=>courseMap(C).get(e.type==='lesson'?e.id:e.questionId)).filter(Boolean);return [...new Map(matched.map(l=>[l.id,l])).values()].slice(-6);}
const contexts=new WeakMap();
function recommendation(state,C,target,now=Date.now()){
 let context=contexts.get(state);if(!context||context.C!==C||context.now!==now||context.events!==state.events.length||context.level!==level(state)){context={C,now,level:level(state),events:state.events.length,recent:recentLessons(state,C,now),due:Object.values(state.reviews||{}).filter(r=>r.due<=now),values:new Map()};contexts.set(state,context);}
 const key=target.stage+':'+target.unit+':'+target.verb;if(context.values.has(key))return context.values.get(key);
 let factor=target.stage===level(state)?1.3:1;
 if(context.recent.some(l=>l.stage===target.stage&&l.unit===target.unit))factor+=1.5;
 if(context.recent.some(l=>T.unitVerbs[l.stage]?.[l.unit]?.includes(target.verb)))factor+=.8;
 if(context.due.some(r=>{const lesson=courseMap(C).get(r.question.sourceQuestionId||r.question.id);return lesson?.stage===target.stage&&lesson.unit===target.unit||(target.forms||[]).some(form=>r.question.spanish?.includes(form));}))factor+=.5;
 context.values.set(key,factor);return factor;
}

root.GrammarSyllabus={levels,concepts,targets,level,allowed,recentLessons,recommendation};if(typeof module!=='undefined')module.exports=root.GrammarSyllabus;
})(typeof window==='undefined'?globalThis:window);
