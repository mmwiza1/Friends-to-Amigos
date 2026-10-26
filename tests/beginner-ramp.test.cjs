'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const C=require('./helpers/v12-course.cjs'),E=require('../www/engine'),S=require('../www/storage');
const {audit}=require('../scripts/content/audit-a1-anchors.cjs');
const corrections=require('../docs/release/learner-experience-content-corrections.json');
const lesson=id=>C.lessons.find(l=>l.id===id),question=id=>C.lessons.flatMap(l=>l.questions).find(q=>q.id===id);

test('confidence ramp preserves every permanent question slot and course ordering',()=>{
 for(const [id,size]of[['u0l0',5],['u0l1',6],['u0l2',7]]){
  assert.equal(lesson(id).questions.length,size);
  assert.deepEqual(lesson(id).questions.slice(0,5).map(q=>q.id),Array.from({length:5},(_,i)=>id+'-q'+(i+1)));
 }
 assert.deepEqual(C.lessons.slice(0,9).map(l=>l.id),['u0l0','u0story0','u0l1','u0story1','u0l2','u0story2','u0write','u0check','u0story3']);
 assert.deepEqual(lesson('u0l1').questions.slice(5).map(q=>q.id),['u0l1-listen1']);
 assert.deepEqual(lesson('u0l2').questions.slice(5).map(q=>q.id),['u0l2-listen1','u0l2-speak1']);
});

test('first lesson teaches meaning before selection and never demands unsupported typing or transfer',()=>{
 const questions=lesson('u0l0').questions;
 assert.ok(questions.every(q=>['choice','gap'].includes(q.type)));
 assert.ok(questions.every(q=>q.teachingModel?.spanish&&q.teachingModel?.meaning));
 assert.ok(questions.every(q=>q.mode!=='transfer'&&q.mode!=='recall'));
 assert.equal(questions[0].teachingModel.spanish,'Hola');
 assert.equal(questions[1].answer,'Her name');assert.equal(questions[1].teachingModel.meaning,'My name is Ana.');
 assert.equal(questions[3].teachingModel.spanish,'¿Cómo te llamas?');
 assert.equal(questions[4].answer,'Hasta luego');
});

test('first supported completion uses a whole familiar chunk and friendly early distractors',()=>{
 const q=question('u0l0-q3');assert.equal(q.type,'gap');assert.equal(q.sentence,'Me ___ Ana.');
 assert.equal(q.answer,'llamo');assert.deepEqual(q.options,['llamo','hola','gracias']);
 assert.equal(q.spanish,'Me llamo Ana.');assert.deepEqual(q.spanishFragments,['Me ___ Ana.']);
 assert.ok(!q.accepted&&!q.mistakes);
 assert.doesNotMatch(q.explanation,/reflexive|infinitive|pronoun|conjugat/i);
});

test('all earliest explanations prioritise usable meaning without technical grammar labels',()=>{
 for(const q of lesson('u0l0').questions)assert.doesNotMatch(q.explanation,/reflexive|infinitive|pronoun|conjugat|third.person/i,q.id);
 for(const q of lesson('u0l1').questions.slice(0,4))assert.doesNotMatch(q.explanation,/reflexive|infinitive|conjugat/i,q.id);
});

test('second lesson keeps support then introduces one short independent name recall near the end',()=>{
 const q=lesson('u0l1').questions;
 assert.ok(q.slice(0,4).every(item=>['choice','gap'].includes(item.type)&&item.teachingModel));
 assert.equal(q[4].type,'text');assert.equal(q[4].mode,'recall');assert.equal(q[4].answer,'Me llamo Ana');
 assert.ok(!q[4].teachingModel);assert.match(q[4].prompt,/From memory/);
 assert.equal(q.filter(item=>item.type==='text').length,1);
 assert.ok(q[5].listening);assert.equal(q[5].type,'choice');
});

test('name retrieval follows several visible encounters rather than immediate unsupported production',()=>{
 const first=lesson('u0l0'),second=lesson('u0l1');
 assert.ok(first.questions.filter(q=>q.teachingModel?.spanish.includes('Me llamo')).length>=2);
 assert.ok(first.questions.some(q=>q.mode==='completion'&&q.spanish==='Me llamo Ana.'));
 assert.equal(second.questions.findIndex(q=>q.type==='text'),4);
 assert.ok(second.questions[2].options.includes('Me llamo Ana'));
});

test('third lesson restores recall, contextual response, role transfer, listening and speaking',()=>{
 const q=lesson('u0l2').questions;
 assert.equal(q[2].type,'text');assert.equal(q[2].mode,'recall');assert.equal(q[2].answer,'Hasta luego');
 assert.ok(q[3].teachingModel);assert.equal(q[3].answer,'¿Puedes repetir, por favor?');
 assert.equal(q[4].type,'text');assert.equal(q[4].mode,'transfer');assert.equal(q[4].answer,'Me llamo Luis');
 assert.match(q[4].prompt,/You are Luis/);assert.ok(!q[4].teachingModel);
 for(const answer of ['Me llamo Luis','Soy Luis','Hola, me llamo Luis'])assert.ok(E.isCorrect(q[4],answer));
 assert.ok(q.some(item=>item.listening));assert.ok(q.some(item=>item.type==='speaking'));
});

test('the Unit 0 checkpoint retains the exact rigorous pre-ramp payload and independent production',()=>{
 const checkpoint=lesson('u0check'),hash=crypto.createHash('sha256').update(JSON.stringify(checkpoint)).digest('hex');
 assert.equal(hash,'dcb1676cc8f1b5bec1b8aae46da32e3919987199e1d1a1056f87a4ba53896716');
 assert.equal(checkpoint.questions.filter(q=>q.type==='text'&&q.language==='es').length,4);
 assert.equal(checkpoint.questions[5].answer,'Me llamo Marta');assert.equal(checkpoint.questions[8].answer,'¿Puedes repetir, por favor?');
 assert.ok(checkpoint.questions.every(q=>!q.teachingModel));
});

test('legacy snapshots retain the old first-lesson typed recall for safe historical resume',()=>{
 const old=C.legacyQuestions.find(q=>q.id==='u0l0-q3');assert.equal(old.type,'text');assert.equal(old.answer,'Me llamo Ana');
 assert.equal(question(old.id).type,'gap');
 const state=E.fresh();E.recordAnswer(state,old,false,1000);const parsed=S.parse(JSON.stringify(state),C,{import:true}).state;
 assert.equal(parsed.reviews[old.id].question.type,'text');assert.equal(parsed.reviews[old.id].question.answer,'Me llamo Ana');
 assert.ok(E.isCorrect(parsed.reviews[old.id].question,'me llamo ana'));assert.equal(parsed.reviews[old.id].due,1000);
});

test('new supported lesson snapshots retain their teaching model and visible fragments across save/resume',()=>{
 const current=lesson('u0l0'),state=E.fresh();state.active={kind:'lesson',lesson:current,questions:current.questions,index:2,answers:[true,true],selected:null,checked:false};
 const restored=S.parse(JSON.stringify(state),C,{import:true}).state;
 assert.equal(restored.active.index,2);assert.deepEqual(restored.active.questions[2].teachingModel,current.questions[2].teachingModel);assert.deepEqual(restored.active.questions[2].spanishFragments,['Me ___ Ana.']);assert.equal(restored.active.questions[2].type,'gap');
});

test('meaning-safe tolerant grading remains available when independent recall begins',()=>{
 const q=question('u0l1-q5');for(const answer of ['ME LLAMO ANA','me   llamo ana.','Mi nombre es Ana'])assert.ok(E.isCorrect(q,answer));
 assert.ok(!E.isCorrect(q,'Me llamo Luis'));assert.ok(!E.isCorrect(q,'Mi llamo Ana'));
 const age=question('u1l1-q3');assert.ok(E.isCorrect(age,'Tengo veinte anos')===false);assert.ok(E.isCorrect(age,'Tengo veinte años'));
});

test('all three ramp activities still have unique correct choices and practical completion paths',()=>{
 for(const id of ['u0l0','u0l1','u0l2'])for(const q of lesson(id).questions){
  if(q.options){assert.equal(q.options.filter(option=>option===q.answer).length,1,q.id);assert.equal(new Set(q.options).size,q.options.length);}
  if(q.type==='text'){assert.ok(q.accepted.length);assert.ok(E.isCorrect(q,q.accepted[0]));}
  if(q.type==='speaking')assert.ok(q.answer&&q.spanish);
  assert.ok(q.explanation&&q.id);
 }
});

test('two existing stories add natural anchor bridges without altering their answers or reading safety',()=>{
 const a=lesson('u4story0'),b=lesson('a12u5story0');assert.match(a.reading.text,/Ana: Hola, Marta\. Me llamo Ana\./);assert.match(b.reading.text,/Ana: Vivo en este piso\. Este es el salón\./);
 for(const l of[a,b]){assert.equal(l.questions.length,5);for(const q of l.questions){assert.deepEqual(q.reading,l.reading);const record=corrections.course.find(row=>row.id===q.id);assert.ok(record);assert.deepEqual(record.changes.map(change=>change.field),['reading']);}}
});

test('anchor audit spans all A1 units, reports real retrieval contexts and remains a QA report',()=>{
 const report=audit(C);assert.equal(report.units.length,16);assert.equal(report.anchors.length,15);
 assert.deepEqual(report,require('../docs/release/a1-anchor-recurrence.json'));
 for(const id of ['tengo','quiero','me-gusta','por-favor','gracias','donde-esta','voy','a-las']){
  const row=report.anchors.find(a=>a.id===id);assert.ok(row.units.some(unit=>unit.startsWith('A1.1')));assert.ok(row.units.some(unit=>unit.startsWith('A1.2')),id+' returns in A1.2');assert.ok(row.activities.some(a=>a.modes.some(mode=>['recall','transfer','context','contextual','listening'].includes(mode))),id+' is not only recognition');
 }
 assert.ok(report.flags.some(flag=>flag.anchor==='soy-de'));assert.match(report.policy,/not.*mastery/);
});

test('anchor audit does not inflate one passage or count wrong-option-only scaffolding as exposure',()=>{
 const mini={stageUnits:{'A1.1':[{title:'One'}],'A1.2':[{title:'Two'}]},lessons:[{id:'one',stage:'A1.1',unit:0,title:'One',reading:{text:'Hola.'},questions:[{type:'choice',answer:'Gracias',options:['Gracias','Voy a leer','Tengo hambre'],reading:{text:'Hola.'}},{type:'choice',answer:'Gracias',reading:{text:'Hola.'}}]}]};
 const result=audit(mini);assert.equal(result.anchors.find(a=>a.id==='hola').activityCount,1);assert.equal(result.anchors.find(a=>a.id==='voy-a').activityCount,0);assert.equal(result.anchors.find(a=>a.id==='tengo').activityCount,0);
});
