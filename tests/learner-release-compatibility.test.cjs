'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const C=require('../www/curriculum'),E=require('../www/engine'),P=require('../www/storage'),W=require('../www/writing');
const baseline=require('../docs/release/learner-experience-baseline-contract.json');
const {beforeLearnerExperienceCorrections,learnerExperienceManifest:corrections}=require('./helpers/content-corrections.cjs');
const clone=x=>JSON.parse(JSON.stringify(x)),sha=x=>crypto.createHash('sha256').update(x).digest('hex'),hash=x=>sha(JSON.stringify(x));
const sets={course:C.lessons,games:require('../www/conjugations-bank').questions,tables:require('../www/conjugation-targets').targets,focused:require('../www/focused-bank').items};
for(const [kind,items] of Object.entries(sets))test('latest main '+kind+' identities, order and full payloads survive outside approved confidence-ramp/recycling edits',()=>{
 const old=baseline.payloads[kind];assert.deepEqual(items.map(item=>item.id),Object.keys(old));
 for(const item of items)assert.equal(hash(beforeLearnerExperienceCorrections(item,kind)),old[item.id],item.id);
});
test('all permanent course question IDs retain exactly the latest-main activity ordering',()=>{
 assert.deepEqual(Object.fromEntries(C.lessons.map(l=>[l.id,l.questions.map(q=>q.id)])),baseline.questions);
});
test('the five-tab navigation and every established compatibility fixture are byte-identical to latest main',()=>{
 const nav=fs.readFileSync('www/app.js','utf8').split('\n').find(line=>line.startsWith('function nav(){'));assert.equal(sha(nav),baseline.navigation);
 for(const [file,expected] of Object.entries(baseline.fixtures))assert.equal(sha(fs.readFileSync('tests/fixtures/'+file)),expected,file);
});
test('the approved content inverse rejects unexpected edits rather than blessing changed snapshots',()=>{
 const record=corrections.course.find(row=>row.changes.length),lesson=clone(C.lessons.find(l=>l.id===record.activity)),q=lesson.questions.find(q=>q.id===record.id),change=record.changes.find(change=>change.afterPresent!==false);
 q[change.field]='Unapproved accidental change';assert.throws(()=>beforeLearnerExperienceCorrections(lesson),/approved/);
 assert.ok(corrections.course.every(row=>row.stage==='A1.1'||row.stage==='A1.2'));
 for(const row of corrections.course)for(const change of row.changes)assert.ok(!['id','sourceQuestionId','listening','practice','writing'].includes(change.field),row.id+' stable identity/media contract');
});
test('historical early typed snapshots retain their older question type, model, feedback and review schedule after the ramp',()=>{
 const lesson=beforeLearnerExperienceCorrections(C.lessons.find(l=>l.id==='u0l0')),q=lesson.questions.find(q=>q.id==='u0l0-q3'),s=E.fresh();assert.equal(q.type,'text');assert.equal(q.answer,'Me llamo Ana');
 for(const question of lesson.questions)if(question.spanish==='')delete question.spanish;
 s.completed=['u1l0'];s.active={kind:'lesson',lesson,questions:clone(lesson.questions),index:2,answers:[true,true],selected:'Mi llamo Ana',checked:false,hintRevealed:false,readingReady:false,modelRevealed:false,audioPlayed:false,audioUnavailable:false};E.recordAnswer(s,q,false,1000);
 const oldReview=clone(s.reviews[q.id]),out=P.parse(JSON.stringify(s),C,{import:true}).state;
 assert.deepEqual(out.active,s.active);assert.deepEqual(out.reviews[q.id],oldReview);assert.deepEqual(out.completed,['u1l0']);assert.equal(out.version,2);
 assert.equal(out.active.questions[2].type,'text');assert.equal(C.lessons.find(l=>l.id==='u0l0').questions[2].type,'gap');
 assert.ok(E.isCorrect(out.active.questions[2],'me llamo ana'));E.recordAnswer(out,out.active.questions[2],true,2000);assert.equal(out.reviews[q.id].success,1);assert.ok(out.reviews[q.id].due>2000);assert.deepEqual(out.reviews[q.id].question,oldReview.question);
 assert.deepEqual(P.migrateState(out,C).state,out);
});
test('learner spelling tolerance and cautious writing assessment retain optional accents/punctuation/ü and distinct ñ',()=>{
 for(const [target,response] of [['¿Cómo te llamas?','como te llamas'],['¡Hasta luego!','hasta luego'],['Qué vergüenza','que verguenza'],['Tengo veinte años','TENGO veinte años.']]){
  const q={type:'text',answer:target,accepted:[target],language:'es',writing:{mode:'controlled',stage:'A1.1'}};assert.ok(E.isCorrect(q,response));assert.ok(W.assess(q,response).verified);
 }
 assert.ok(!E.isCorrect({type:'text',answer:'Tengo veinte años',accepted:['Tengo veinte años']},'Tengo veinte anos'));assert.notEqual(W.normalize('año'),W.normalize('ano'));
});

test('opening meaning-first teaching models survive save/import/resume without becoming grading hints',()=>{
 for(const id of ['u0l0','u0l1','u0l2']){
  const lesson=C.lessons.find(l=>l.id===id),s=E.fresh();s.active={kind:'lesson',lesson,questions:clone(lesson.questions),index:0,answers:[],selected:null,checked:false,hintRevealed:false};
  const out=P.parse(JSON.stringify(s),C,{import:true}).state;assert.equal(out.version,2);assert.equal(out.active.hintRevealed,false);
  for(let i=0;i<lesson.questions.length;i++)assert.deepEqual(out.active.questions[i].teachingModel,lesson.questions[i].teachingModel,lesson.questions[i].id+' saved teaching model');
  assert.deepEqual(out.reviews,{});assert.deepEqual(out.events,[]);assert.deepEqual(out.completed,[]);assert.deepEqual(out.capabilities,[]);
 }
});
