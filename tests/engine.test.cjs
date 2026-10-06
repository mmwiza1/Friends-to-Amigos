const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const E=require('../www/engine.js');
const C=require('../www/curriculum.js');
const allQuestions=[...C.lessons.flatMap(l=>l.questions),...C.placement,...C.numbers,...C.time];
test('all playable lesson IDs remain valid and in their original course order',()=>{
 const previous=JSON.parse(fs.readFileSync('tests/fixtures/a11-lesson-ids.json','utf8'));
 assert.deepEqual(C.lessons.map(l=>l.id),previous);assert.equal(new Set(previous).size,72);
 for(const l of C.lessons){assert.match(l.id,/^u[0-7](l[0-2]|story[0-3]|write|check)$/);assert.equal(l.stage,'A1.1');assert.ok(l.title);assert.ok(l.questions.length>=5);assert.equal(new Set(l.questions.map(q=>q.prompt)).size,l.questions.length);}
});
test('every exercise has required content and choices have exactly one correct answer',()=>{
 for(const q of allQuestions){
  for(const field of ['prompt','answer','explanation','topic','mode'])assert.ok(typeof q[field]==='string'&&q[field].trim(),`${field}: ${q.prompt}`);
  assert.ok(['choice','gap','text'].includes(q.type));
  if(q.type==='text'){
   assert.ok(['es','en-or-es'].includes(q.language));assert.ok(q.accepted.length>0);
   assert.equal(new Set(q.accepted).size,q.accepted.length);for(const answer of q.accepted)assert.ok(E.isCorrect(q,answer));
   if(q.language==='es')assert.ok(q.accepted.includes(q.answer));
  }else{
   assert.equal(q.options.length,3);assert.equal(q.options.filter(x=>x===q.answer).length,1);
   assert.equal(new Set(q.options.map(E.normalizeAnswer)).size,3,q.prompt);
  }
 }
});
test('each regular lesson progresses through completion, recall, contextual response and transfer',()=>{
 for(const l of C.lessons.filter(l=>/^u\dl\d$/.test(l.id))){
  assert.equal(l.questions.length,5);assert.equal(l.questions[1].type,'gap');assert.equal(l.questions[2].mode,'recall');assert.equal(l.questions[2].language,'es');assert.equal(l.questions[4].type,'text');assert.equal(l.questions[4].language,'es');
  assert.ok(['response','context','inference','transfer','recognition'].includes(l.questions[3].mode));
 }
 const spanish=C.lessons.flatMap(l=>l.questions).filter(q=>q.type==='text'&&q.language==='es');assert.equal(spanish.length,120);
});
test('completion gaps have two or three words, matched distractor lengths and complete pronunciation text',()=>{
 for(const q of allQuestions.filter(q=>q.type==='gap')){
  const count=(q.sentence.match(/___/g)||[]).length;assert.ok(count===2||count===3,q.prompt);
  for(const option of q.options)assert.equal(option.split(' ').length,count,q.prompt);
  assert.ok(!q.spanish.includes('___'));let index=0;assert.equal(q.spanish,q.sentence.replace(/___/g,()=>q.answer.split(' ')[index++]));
 }
});
test('every unit has a practical goal, four interleaved scenarios and Spanish writing before its checkpoint',()=>{
 assert.equal(C.unitInfo.length,8);assert.equal(Object.keys(C.cast).length,4);assert.equal(C.unitInfo.filter(u=>u.note).length,2);
 for(let i=0;i<8;i++){
  const u=C.unitInfo[i],ls=C.lessons.filter(l=>l.unit===i);assert.ok(u.goal.length>30);assert.ok(u.phrases.length>=5);assert.equal(C.units[i][1],u.goal);
  assert.deepEqual(ls.map(l=>l.id),[`u${i}l0`,`u${i}story0`,`u${i}l1`,`u${i}story1`,`u${i}l2`,`u${i}story2`,`u${i}write`,`u${i}check`,`u${i}story3`]);
  for(const story of ls.filter(l=>l.reading)){
   assert.equal(story.reading.stage,'A1.1');assert.ok(story.reading.glossary.length>0);assert.ok(story.reading.text.length>50);
   assert.equal(story.questions.filter(q=>q.type==='text').length,2);assert.equal(story.questions.filter(q=>q.type==='choice').length,3);
   assert.ok(story.questions.some(q=>['response','inference','sequence','transfer','character'].includes(q.mode)));
   for(const q of story.questions){assert.equal(q.reading,story.reading);if(q.type==='text')assert.equal(q.language,'en-or-es');}
  }
  assert.ok(ls[6].questions.every(q=>q.type==='text'&&q.language==='es'));
  assert.equal(ls[7].questions.filter(q=>q.type==='text'&&q.language==='es').length,4);
 }
});
test('story choices use targeted alternatives and facts are not the majority of comprehension',()=>{
 const qs=C.lessons.filter(l=>l.reading).flatMap(l=>l.questions);assert.ok(qs.filter(q=>q.mode==='fact').length<qs.length/2);
 assert.ok(new Set(C.lessons.filter(l=>l.reading).map(l=>l.reading.text)).size===32);
 assert.ok(qs.some(q=>q.mode==='inference'));assert.ok(qs.some(q=>q.mode==='character'));assert.ok(qs.some(q=>q.mode==='sequence'));
});
test('typed matching tolerates case, punctuation, spaces and vowel accents, but preserves ñ and negation',()=>{
 const q=C.lessons.find(l=>l.id==='u1story0').questions[1];assert.ok(E.isCorrect(q,'  ENGLAND!  '));assert.ok(E.isCorrect(q,'Inglaterra'));assert.ok(!E.isCorrect(q,'not England'));assert.ok(!E.isCorrect(q,'Spain'));assert.ok(!E.isCorrect(q,''));
 const write=C.lessons.find(l=>l.id==='u0write').questions[1];assert.ok(E.isCorrect(write,'como te llamas'));assert.ok(E.isCorrect(write,'¿Cómo  te llamas?'));assert.ok(!E.isCorrect(write,'What is your name?'));
 const age=C.lessons.find(l=>l.id==='u1write').questions[2];assert.ok(E.isCorrect(age,'tengo veintiun años'));assert.ok(!E.isCorrect(age,'tengo veintiun anos'));assert.notEqual(E.normalizeAnswer('años'),E.normalizeAnswer('anos'));
});
test('practical Spanish answers accept realistic authored alternatives without broad substring grading',()=>{
 const coffee=C.lessons.find(l=>l.id==='u2write').questions[0];assert.ok(E.isCorrect(coffee,'para mí un café con leche por favor'));assert.ok(!E.isCorrect(coffee,'no quiero un café con leche por favor'));
 const object=C.lessons.find(l=>l.id==='u5write').questions[2];assert.ok(E.isCorrect(object,'Mi celular está aquí'));assert.ok(!E.isCorrect(object,'My phone is here'));
 const location=C.lessons.find(l=>l.id==='u6write').questions[2];assert.ok(E.isCorrect(location,'no está lejos'));
});
test('incorrect feedback explains the targeted age, hunger and gustar misconceptions',()=>{
 const age=C.lessons.find(l=>l.id==='u1l1').questions[2];assert.match(E.answerExplanation(age,'Soy veinte años'),/Spanish uses tener/);
 const hunger=C.lessons.find(l=>l.id==='u2l1').questions[2];assert.match(E.answerExplanation(hunger,'Estoy hambre'),/Hambre is a noun/);
 const gustar=C.lessons.find(l=>l.id==='u2write').questions[3];assert.match(E.answerExplanation(gustar,'Yo gusto el té'),/thing liked takes gusta/);
});
test('mistakes need three scheduled successes; immediate retries do not inflate the correction',()=>{
 const s=E.fresh(),q=C.numbers[0],now=Date.now();E.recordAnswer(s,q,false,now);E.recordAnswer(s,q,true,now+1);assert.equal(s.reviews[q.prompt].success,1);E.recordAnswer(s,q,true,now+2);assert.equal(s.reviews[q.prompt].success,1);
 E.recordAnswer(s,q,true,now+86400002);assert.equal(s.reviews[q.prompt].corrected,false);E.recordAnswer(s,q,true,now+4*86400000+3);assert.equal(s.reviews[q.prompt].corrected,true);assert.equal(s.events.filter(e=>e.type==='corrected').length,1);
});
test('story review snapshots retain passage, bilingual variants, glossary and explanation',()=>{
 const s=E.fresh(),q=C.lessons.find(l=>l.id==='u0story0').questions[1];E.recordAnswer(s,q,false,0);const reloaded=JSON.parse(JSON.stringify(s));const review=reloaded.reviews[q.prompt];
 assert.deepEqual(review.question,q);assert.ok(E.isCorrect(review.question,'nombre'));E.recordAnswer(reloaded,review.question,true,1000);assert.equal(reloaded.reviews[q.prompt].success,1);
});
test('checkpoints retain the 80 percent threshold and earn capabilities once',()=>{
 for(const l of C.lessons.filter(l=>l.checkpoint)){
  const s=E.fresh();E.complete(s,l,7,9);assert.equal(s.capabilities.length,0);assert.equal(s.completed.length,0);
  E.complete(s,l,8,9);E.complete(s,l,9,9);assert.equal(s.capabilities.length,1);assert.equal(s.capabilities[0].text,C.unitInfo[l.unit].goal);assert.equal(s.events.filter(e=>e.type==='lesson').length,1);
 }
});
test('existing earned capability text is not overwritten by a revised unit goal',()=>{
 const s=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8'));const old=JSON.parse(JSON.stringify(s.capabilities));E.complete(s,C.lessons.find(l=>l.id==='u0check'),9,9);assert.deepEqual(s.capabilities,old);
});
test('repeat completion does not inflate totals',()=>{
 const s=E.fresh(),l=C.lessons[0];E.complete(s,l,3,5);assert.equal(s.completed.length,0);E.complete(s,l,4,5);E.complete(s,l,5,5);assert.equal(s.completed.length,1);assert.equal(s.events.filter(e=>e.type==='lesson').length,1);
});
test('streak permits today still to be completed and breaks after a missed day',()=>{
 const s=E.fresh();for(const k of ['2026-10-01','2026-10-02','2026-10-03'])s.sessions[k]={practised:true,seconds:10};assert.deepEqual(E.streak(s,'2026-10-04'),{current:3,best:3});assert.deepEqual(E.streak(s,'2026-10-05'),{current:0,best:3});
});
test('placement remains provisional and needs consecutive demonstrated foundations',()=>{
 assert.equal(E.placementResult([false,false,true,true,true,true,true,true]),'A1.1');assert.equal(E.placementResult([true,true,false,true]),'A1.2');assert.equal(E.placementResult(Array(8).fill(true)),'B2.1');
});
test('stage authoring targets are ordered, explicit and never make planned content playable',()=>{
 assert.deepEqual(C.stages,['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2']);
 assert.deepEqual(C.stageInfo.map(s=>s.id),C.stages);
 for(const stage of C.stageInfo){
  assert.ok(stage.goal.length>30);assert.equal(stage.tasks.length,3);assert.ok(stage.languageSupport);assert.ok(stage.languageFocus);
  assert.equal(stage.status,stage.id==='A1.1'?'playable':'planned');
  assert.equal(C.lessons.some(l=>l.stage===stage.id),stage.status==='playable');
 }
 for(const lesson of C.lessons){assert.equal(lesson.goal,C.unitInfo[lesson.unit].goal);assert.equal(lesson.outcomeId,C.unitInfo[lesson.unit].id);assert.equal(lesson.authorship.kind,'original');assert.ok(fs.existsSync(lesson.authorship.referenceRecord));}
});
