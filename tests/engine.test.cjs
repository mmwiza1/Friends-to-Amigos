const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const E=require('../www/engine.js');
const C=require('../www/curriculum.js');
const a11=C.lessons.filter(l=>l.stage==='A1.1');
const allQuestions=[...C.lessons.flatMap(l=>l.questions),...C.placement,...C.numbers,...C.time];
test('all playable lesson IDs remain valid and in their original course order',()=>{
 const previous=JSON.parse(fs.readFileSync('tests/fixtures/a11-lesson-ids.json','utf8'));
 assert.deepEqual(a11.map(l=>l.id),previous);assert.equal(new Set(previous).size,72);
 for(const l of a11){assert.match(l.id,/^u[0-7](l[0-2]|story[0-3]|write|check)$/);assert.equal(l.stage,'A1.1');assert.ok(l.title);assert.ok(l.questions.length>=5);assert.equal(new Set(l.questions.map(q=>q.prompt)).size,l.questions.length);}
});
test('every exercise has required content and choices have exactly one correct answer',()=>{
 for(const q of allQuestions){
  for(const field of ['prompt','answer','explanation','topic','mode'])assert.ok(typeof q[field]==='string'&&q[field].trim(),`${field}: ${q.prompt}`);
  assert.ok(['choice','gap','text','speaking'].includes(q.type));
  if(q.type==='speaking'){assert.ok(q.spanish);assert.equal(q.mode,'speaking');}
  else if(q.type==='text'){
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
  assert.equal(l.questions.length,l.id.endsWith('l0')?5:l.id.endsWith('l1')?6:7);assert.equal(l.questions[1].type,'gap');assert.equal(l.questions[2].mode,'recall');assert.equal(l.questions[2].language,'es');assert.equal(l.questions[4].type,'text');assert.equal(l.questions[4].language,'es');
  assert.ok(['response','context','inference','transfer','recognition'].includes(l.questions[3].mode));
 }
 const spanish=a11.flatMap(l=>l.questions).filter(q=>q.type==='text'&&q.language==='es');assert.equal(spanish.length,120);
});
test('completion gaps have two or three words, matched distractor lengths and complete pronunciation text',()=>{
 for(const q of C.lessons.filter(l=>l.stage!=='A2.1').flatMap(l=>l.questions).filter(q=>q.type==='gap')){
  const count=(q.sentence.match(/___/g)||[]).length;assert.ok(count===2||count===3,q.prompt);
  for(const option of q.options)assert.equal(option.split(' ').length,count,q.prompt);
  assert.ok(!q.spanish.includes('___'));let index=0;assert.equal(q.spanish,q.sentence.replace(/___/g,()=>q.answer.split(' ')[index++]));
 }
});
test('every unit has a practical goal, four interleaved scenarios and Spanish writing before its checkpoint',()=>{
 assert.equal(C.unitInfo.length,8);assert.equal(Object.keys(C.cast).length,4);assert.equal(C.unitInfo.filter(u=>u.note).length,2);
 for(let i=0;i<8;i++){
  const u=C.unitInfo[i],ls=a11.filter(l=>l.unit===i);assert.ok(u.goal.length>30);assert.ok(u.phrases.length>=5);assert.equal(C.units[i][1],u.goal);
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
 const qs=a11.filter(l=>l.reading).flatMap(l=>l.questions);assert.ok(qs.filter(q=>q.mode==='fact').length<qs.length/2);
 assert.ok(new Set(a11.filter(l=>l.reading).map(l=>l.reading.text)).size===32);
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
 const s=E.fresh(),q=C.numbers[0],now=Date.now();E.recordAnswer(s,q,false,now);E.recordAnswer(s,q,true,now+1);assert.equal(s.reviews[q.id].success,1);E.recordAnswer(s,q,true,now+2);assert.equal(s.reviews[q.id].success,1);
 E.recordAnswer(s,q,true,now+86400002);assert.equal(s.reviews[q.id].corrected,false);E.recordAnswer(s,q,true,now+4*86400000+3);assert.equal(s.reviews[q.id].corrected,true);assert.equal(s.events.filter(e=>e.type==='corrected').length,1);
});
test('story review snapshots retain passage, bilingual variants, glossary and explanation',()=>{
 const s=E.fresh(),q=C.lessons.find(l=>l.id==='u0story0').questions[1];E.recordAnswer(s,q,false,0);const reloaded=JSON.parse(JSON.stringify(s));const review=reloaded.reviews[q.id];
 assert.deepEqual(review.question,q);assert.ok(E.isCorrect(review.question,'nombre'));E.recordAnswer(reloaded,review.question,true,1000);assert.equal(reloaded.reviews[q.id].success,1);
});
test('checkpoints retain the 80 percent threshold and earn capabilities once',()=>{
 for(const l of C.lessons.filter(l=>l.checkpoint)){
  const s=E.fresh();E.complete(s,l,7,9);assert.equal(s.capabilities.length,0);assert.equal(s.completed.length,0);
  E.complete(s,l,8,9);E.complete(s,l,9,9);assert.equal(s.capabilities.length,1);assert.equal(s.capabilities[0].text,C.getUnit(l).goal);assert.equal(s.events.filter(e=>e.type==='lesson').length,1);
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
  assert.equal(stage.status,['A1.1','A1.2','A2.1'].includes(stage.id)?'playable':'planned');
  assert.equal(C.lessons.some(l=>l.stage===stage.id),stage.status==='playable');
 }
 for(const lesson of C.lessons){assert.equal(lesson.goal,C.getUnit(lesson).goal);assert.equal(lesson.outcomeId,C.getUnit(lesson).id);assert.equal(lesson.authorship.kind,'original');assert.ok(fs.existsSync(lesson.authorship.referenceRecord));}
});
const a12=C.lessons.filter(l=>l.stage==='A1.2');
test('original A1.1 snapshots remain byte-equivalent to the compatibility baseline',()=>{
 const crypto=require('node:crypto');assert.equal(crypto.createHash('sha256').update(JSON.stringify(C.legacyLessons.filter(l=>l.stage==='A1.1'))).digest('hex'),fs.readFileSync('tests/fixtures/a11-content.sha256','utf8'));
});
test('A1.2 retains 72 activities and has 416 question slots with integrated audio/speech',()=>{
 assert.equal(a12.length,72);assert.equal(a12.flatMap(l=>l.questions).length,416);assert.equal(C.lessons.length,216);
 assert.equal(new Set(C.lessons.map(l=>l.id)).size,216);assert.deepEqual(C.lessons.slice(0,72),a11);
 for(const lesson of a12){assert.match(lesson.id,/^a12u[0-7](l[0-2]|story[0-3]|write|check)$/);assert.ok(lesson.questions.length>=5);assert.equal(new Set(lesson.questions.map(q=>q.prompt)).size,lesson.questions.length);}
});
test('A1.2 has eight distinct practical units and stable interleaving ending in checkpoints',()=>{
 const units=C.stageUnits['A1.2'];assert.equal(units.length,8);assert.equal(new Set(units.map(u=>u.id)).size,8);
 for(let i=0;i<8;i++){
  const unit=units[i],lessons=a12.filter(l=>l.unit===i);
  assert.ok(unit.goal.length>40);assert.ok(unit.phrases.length>=5);
  assert.deepEqual(lessons.map(l=>l.id),[`a12u${i}l0`,`a12u${i}story0`,`a12u${i}l1`,`a12u${i}story1`,`a12u${i}l2`,`a12u${i}story2`,`a12u${i}write`,`a12u${i}story3`,`a12u${i}check`]);
  assert.ok(lessons.at(-1).checkpoint);for(const l of lessons){assert.equal(l.unitId,unit.id);assert.equal(C.getUnit(l),unit);}
 }
 assert.equal(C.unitInfo.length,8);assert.equal(C.units.length,8);assert.equal(C.getUnit({unit:0}),C.unitInfo[0]);
});
test('all 24 A1.2 teaching lessons require recall and a practical transferred response',()=>{
 const regular=a12.filter(l=>/l[0-2]$/.test(l.id));assert.equal(regular.length,24);
 for(const l of regular){assert.deepEqual(l.questions.slice(0,5).map(q=>q.mode),['recognition','completion','recall','response','transfer']);assert.deepEqual(l.questions.slice(0,5).map(q=>q.type),['choice','gap','text','choice','text']);assert.equal(l.questions[2].language,'es');assert.equal(l.questions[4].language,'es');}
 assert.equal(a12.flatMap(l=>l.questions).filter(q=>q.language==='es').length,120);
});
test('A1.2 writing is bounded, connected and authored rather than loosely matched',()=>{
 const qs=a12.filter(l=>l.id.endsWith('write')).flatMap(l=>l.questions);assert.equal(qs.length,40);
 for(const q of qs){assert.equal(q.language,'es');for(const a of q.accepted){assert.ok(a.length<=160);assert.ok(E.isCorrect(q,a));}assert.equal(new Set(q.accepted.map(E.normalizeAnswer)).size,q.accepted.length);assert.ok(!E.isCorrect(q,'unrelated '+q.answer+' unrelated'));}
 assert.ok(qs.filter(q=>/\b(y|pero|porque|después|entonces)\b/.test(q.answer)).length>=16);
});
test('all A1.2 stories have unique longer passages, glossaries and bilingual comprehension',()=>{
 const stories=a12.filter(l=>l.reading);assert.equal(stories.length,32);assert.equal(new Set(stories.map(l=>l.reading.text)).size,32);
 const mean=ls=>ls.reduce((sum,l)=>sum+l.reading.text.split(/\s+/).length,0)/ls.length;
 assert.ok(mean(stories)>mean(a11.filter(l=>l.reading)));
 for(const l of stories){assert.ok(l.reading.glossary.length>=2);assert.equal(l.reading.stage,'A1.2');assert.equal(l.questions.filter(q=>q.type==='choice').length,3);assert.equal(l.questions.filter(q=>q.language==='en-or-es').length,2);for(const q of l.questions)assert.equal(q.reading,l.reading);}
 const qs=stories.flatMap(l=>l.questions);assert.ok(qs.filter(q=>q.mode==='fact').length<qs.length/2);for(const mode of ['inference','sequence','context','response','character'])assert.ok(qs.some(q=>q.mode===mode));
});
test('A1.2 short answers preserve ñ, negation and finite realistic alternatives',()=>{
 const find=(id,index)=>a12.find(l=>l.id===id).questions[index];
 const bathroom=find('a12u5write',1);assert.ok(E.isCorrect(bathroom,'el BAÑO esta al lado de la cocina!'));assert.ok(!E.isCorrect(bathroom,'el bano esta al lado de la cocina'));
 const invitation=find('a12u1write',2);assert.ok(E.isCorrect(invitation,'No puedo venir, lo siento'));assert.ok(!E.isCorrect(invitation,'Lo siento, puedo venir'));
 const tryOn=find('a12u4write',1);assert.ok(E.isCorrect(tryOn,'me puedo probar estos pantalones'));assert.ok(!E.isCorrect(tryOn,'No me puedo probar estos pantalones'));
 const home=find('a12u5write',0);assert.ok(E.isCorrect(home,'en mi apartamento hay dos dormitorios'));
});
test('A1.2 predictable errors receive specific explanations for gustar, plans and reflexives',()=>{
 const q=id=>a12.find(l=>l.id===id).questions[2];
 assert.match(E.answerExplanation(q('a12u0l1'),'Me gusta los libros'),/Plural things/);
 assert.match(E.answerExplanation(q('a12u2l0'),'Voy leer mañana'),/Keep a/);
 assert.match(E.answerExplanation(q('a12u6l0'),'Levanto a las siete'),/getting yourself up/);
 assert.match(E.answerExplanation(q('a12u6l2'),'Me acosto a las once'),/changes o to ue/);
});
test('review identities never combine different A1.2 answers or passages',()=>{
 const seen=new Map();for(const q of a12.flatMap(l=>l.questions)){
  if(seen.has(q.id))assert.deepEqual(q,seen.get(q.id));else seen.set(q.id,q);
  assert.ok(!a11.flatMap(l=>l.questions).some(old=>old.id===q.id));
 }
});
test('A1.2 story review retains context across serialization and scheduled correction',()=>{
 const s=E.fresh(),q=a12.find(l=>l.id==='a12u5story1').questions[3];E.recordAnswer(s,q,false,0);
 const restored=JSON.parse(JSON.stringify(s)),saved=restored.reviews[q.id].question;assert.deepEqual(saved,q);assert.ok(E.isCorrect(saved,'salir'));
 E.recordAnswer(restored,saved,true,1);E.recordAnswer(restored,saved,true,86400001);E.recordAnswer(restored,saved,true,4*86400000+1);
 assert.equal(restored.reviews[q.id].corrected,true);assert.ok(restored.reviews[q.id].question.reading.text.includes('No encuentro mis llaves'));
});
test('each A1.2 checkpoint retrieves four Spanish responses and retains any reading evidence',()=>{
 const checks=a12.filter(l=>l.checkpoint);assert.equal(checks.length,8);
 for(const l of checks){assert.equal(l.questions.length,9);assert.equal(l.questions.filter(q=>q.language==='es').length,4);assert.equal(l.capability,C.getUnit(l).goal);assert.ok(l.questions[2].listening);for(const q of l.questions.filter(q=>q.reading))assert.ok(q.reading.text);const s=E.fresh();E.complete(s,l,8,9);E.complete(s,l,9,9);assert.deepEqual(s.completed,[l.id]);assert.equal(s.capabilities.length,1);assert.equal(s.events.filter(e=>e.type==='lesson').length,1);}
});
test('new course modules load offline in browser order without new runtime dependencies',()=>{
 const html=fs.readFileSync('www/index.html','utf8'),scripts=[...html.matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]);
 assert.ok(scripts.indexOf('a12-stories.js')<scripts.indexOf('a12.js'));assert.ok(scripts.indexOf('a12.js')<scripts.indexOf('curriculum.js'));for(const src of scripts)assert.ok(fs.existsSync('www/'+src));
 assert.equal(Object.keys(require('../package.json').dependencies||{}).length,0);
});
