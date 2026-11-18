'use strict';
// v1.11 typed retrieval in Practice: Write from Memory and Listen & Write.
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const C=require('../www/curriculum'),E=require('../www/engine'),K=require('../www/practice-skills'),D=require('../www/learner-dictionary'),app=require('./helpers/app.cjs');
const fresh=()=>({...E.fresh(),onboarded:true}),run=(a,s)=>vm.runInContext(s,a.ctx);
const reachedA21=()=>({...fresh(),completed:C.lessons.filter(l=>['A1.1','A1.2','A2.1'].includes(l.stage)).map(l=>l.id)});
const check=(a,value)=>{a.input(value);a.click('check');return run(a,'quiz.answers.at(-1)');};
test('new learners can already use both typed activities from the opening greetings',()=>{
 for(const kind of ['write','dictation']){const pool=K.pool(kind,fresh(),C,D);assert.ok(pool.length>=10,kind);assert.ok(pool.every(q=>q.type==='text'&&q.language==='es'),kind);}
});
test('Write from Memory reuses authored typed-recall items with their accepted variants and only reached material',()=>{
 const s=reachedA21(),pool=K.pool('write',s,C,D),ids=new Set(s.completed);
 assert.ok(pool.length>=150,String(pool.length));
 for(const q of pool.filter(q=>q.sourceQuestionId)){
  const lesson=C.lessons.find(l=>l.questions.some(x=>x.id===q.sourceQuestionId));
  assert.ok(ids.has(lesson.id),q.id);assert.ok(q.accepted.includes(q.answer),q.id);assert.ok(!q.listening&&!q.teachingModel&&!q.spanish,q.id);
 }
 assert.ok(!pool.some(q=>q.answer.split(/\s+/).length>9));
});
test('Write from Memory never shows the Spanish answer before checking and accepts missing accents',()=>{
 const a=app({},reachedA21());a.click('practiceLaunch',{kind:'write'});assert.equal(run(a,'quiz.skillKind'),'write');
 const q=a.current();assert.match(a.el.innerHTML,/id="written-answer"/);
 if(q.answer.length>6)assert.ok(!a.el.innerHTML.includes(q.answer),'answer visible before checking: '+q.answer);
 const plain=q.accepted[0].normalize('NFD').replace(/[́̈]/g,'').normalize('NFC');
 assert.equal(check(a,plain),true);
});
test('Listen & Write keeps the transcript hidden until checked and keeps ñ distinct',()=>{
 const s=reachedA21(),pool=K.pool('dictation',s,C,D);assert.ok(pool.length>=150);
 const target=pool.find(q=>/ñ/.test(q.answer));assert.ok(target,'a sentence with ñ exists');
 const a=app({},s);a.click('practiceLaunch',{kind:'dictation'});const q=a.current();
 assert.ok(q.listening&&q.listening.transcript===q.answer);assert.ok(!a.el.innerHTML.includes(q.answer),'transcript leaked before answering');
 a.click('listen');assert.equal(check(a,q.answer.toUpperCase().replace(/[¿?¡!.,]/g,'')),true);
 assert.ok(E.isCorrect(target,target.answer.replace(/ñ/g,'n'))===false,'ñ must not be accepted as n');
 assert.ok(E.isCorrect(target,target.answer.normalize('NFD').replace(/[́]/g,'').normalize('NFC')));
});
test('typed Practice mistakes return in Review as the same typed question',()=>{
 const a=app({},reachedA21());a.click('practiceLaunch',{kind:'write'});const q=a.current();
 assert.equal(check(a,'incorrect response'),false);
 const review=a.state().reviews[q.id];assert.ok(review,'review created');assert.equal(review.question.type,'text');assert.deepEqual(review.question.accepted,q.accepted);
 const b=app({},{...a.state(),practiceHub:{...a.state().practiceHub,active:null},reviews:{[q.id]:{...review,due:0}}});
 b.click('tab',{tab:'Review'});b.click('review');assert.equal(b.current().id,q.id);assert.equal(b.current().type,'text');assert.match(b.el.innerHTML,/id="written-answer"/);
});
test('dictation feedback labels the model as what the learner heard',()=>{
 const a=app({},reachedA21());a.click('practiceLaunch',{kind:'dictation'});a.click('listen');check(a,'incorrect response');
 assert.match(a.el.innerHTML,/What you heard/);assert.doesNotMatch(a.el.innerHTML,/A natural answer/);
});
