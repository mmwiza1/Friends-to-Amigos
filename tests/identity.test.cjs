const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../www/curriculum'),E=require('../www/engine'),P=require('../www/storage');
const groups=Object.fromEntries([...C.lessons.map(l=>[l.id,l.questions]),...['placement','numbers','time'].map(id=>[id,C[id]])]);
test('all 144 activity IDs and their intentional stage ordering match the protected baseline',()=>{
 assert.deepEqual(C.lessons.map(l=>l.id),JSON.parse(fs.readFileSync('tests/fixtures/a1-activity-ids.json','utf8')));
 assert.equal(C.lessons.slice(0,72).every(l=>l.stage==='A1.1'),true);assert.equal(C.lessons.slice(72).every(l=>l.stage==='A1.2'),true);
});
test('every authored question has a permanent globally unique activity namespace',()=>{
 const ids=[];for(const [name,qs] of Object.entries(groups))for(const q of qs){assert.ok(q.id.startsWith(name+'-'),q.id);assert.match(q.id,/^[a-zA-Z0-9-]+$/);ids.push(q.id);}
 assert.equal(new Set(ids).size,ids.length);assert.equal(ids.length,871);
});
test('question identity/order manifest is a frozen contract independent of prompt wording',()=>{
 assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([id,qs])=>[id,qs.map(q=>q.id)])),JSON.parse(fs.readFileSync('tests/fixtures/question-ids.json','utf8')));
 for(const q of Object.values(groups).flat()){assert.equal(E.reviewKey({...q,prompt:'Edited wording'}),q.id);}
});
test('duplicate prompts belonging to different questions cannot collide in new reviews',()=>{
 const s=E.fresh(),a={...C.lessons[0].questions[0],id:'u0l0-test-a'},b={...a,id:'a12u0l0-test-b',answer:'Different answer'};
 E.recordAnswer(s,a,false,100);E.recordAnswer(s,b,false,200);assert.equal(Object.keys(s.reviews).length,2);assert.equal(s.reviews[a.id].question.answer,a.answer);assert.equal(s.reviews[b.id].question.answer,b.answer);
});
test('wording edits retain review identity without replacing an unfinished historical snapshot',()=>{
 const s=E.fresh(),old=C.lessons[0].questions[0];E.recordAnswer(s,old,false,100);E.recordAnswer(s,{...old,prompt:'New greeting wording'},false,200);
 assert.equal(Object.keys(s.reviews).length,1);assert.equal(s.reviews[old.id].question.prompt,old.prompt);assert.equal(s.reviews[old.id].wrong,2);
});
test('checkpoint aliases have distinct slot IDs while old exact duplicates map to their canonical source',()=>{
 const old=C.legacyQuestions.find(q=>q.id==='u0check-q1');assert.notEqual(old.id,old.sourceQuestionId);assert.ok(C.legacyQuestions.some(q=>q.id===old.sourceQuestionId));
 const s={...E.fresh(),version:1,reviews:{[old.prompt]:{question:{...old,id:undefined,sourceQuestionId:undefined},wrong:2,success:1,due:123,corrected:false}}};
 const migrated=P.migrateState(s,C).state;assert.equal(Object.keys(migrated.reviews)[0],old.sourceQuestionId);assert.equal(migrated.reviews[old.sourceQuestionId].due,123);
});
test('both stages include two teaching listens, one checkpoint listen and one speaking chunk per unit',()=>{
 for(const stage of C.playableStages)for(let unit=0;unit<8;unit++){
  const lessons=C.lessons.filter(l=>l.stage===stage&&l.unit===unit),qs=lessons.flatMap(l=>l.questions);
  assert.equal(qs.filter(q=>q.listening).length,3);assert.equal(qs.filter(q=>q.type==='speaking').length,1);assert.ok(lessons.find(l=>l.checkpoint).questions[2].listening);
 }
 assert.equal(C.listeningPractice.length,32);assert.equal(C.speakingPractice.length,16);assert.ok(C.listeningPractice.some(q=>q.type==='text'));assert.ok(C.listeningPractice.some(q=>q.type==='choice'));
});
test('audio-first transcripts have coherent offline metadata and no initial reading passage',()=>{
 for(const q of C.lessons.flatMap(l=>l.questions).filter(q=>q.listening)){assert.equal(q.mode,'listening');assert.equal(q.listening.lang,'es-ES');assert.ok(q.listening.rate>=.8&&q.listening.rate<=1);assert.ok(q.listening.transcript);assert.ok(!q.reading);assert.notEqual(q.prompt,q.listening.transcript);assert.equal(P.question(q).listening.transcript,q.listening.transcript);}
});
test('all misconception examples remain incorrect and have targeted nonempty feedback',()=>{
 let examples=0;for(const q of C.lessons.flatMap(l=>l.questions))for(const m of q.mistakes||[]){assert.ok(!E.isCorrect(q,m.answer),q.id+': '+m.answer);assert.equal(E.answerExplanation(q,m.answer),m.explanation);examples++;}assert.equal(examples,71);
});
test('checkpoint transfer is not just a repeat of the preceding writing activity',()=>{
 for(const l of C.lessons.filter(l=>l.checkpoint)){
  const write=C.lessons.find(x=>x.stage===l.stage&&x.unit===l.unit&&x.id.endsWith('write'));
  assert.equal(l.questions.length,9);assert.equal(l.questions.filter(q=>q.language==='es').length,4);
  for(const index of [4,5,8])assert.ok(!write.questions.some(q=>q.prompt===l.questions[index].prompt));
 }
});
test('repair requests, price scaffolding, routine scaffolding and connector constraints are implemented',()=>{
 const find=id=>C.lessons.find(l=>l.id===id);assert.match(find('u0l2').questions[4].answer,/repetir/);assert.equal(find('u3l2').questions[1].answer,'veinte euros');assert.equal(find('a12u6l1').questions[1].answer,'me visto');
 const q=find('a12u7l1').questions[2];assert.ok(q.accepted.every(a=>a.includes('porque')));assert.ok(!E.isCorrect(q,'Estoy cansada, por eso me quedo en casa'));
});
test('spoken self-assessment cannot earn a checkpoint or a lesson with zero scored evidence',()=>{
 const s=E.fresh(),q=C.speakingPractice[0];E.recordAnswer(s,q,false,100);assert.equal(s.events[0].selfAssessed,true);assert.equal(s.reviews[q.id].question.type,'speaking');E.complete(s,C.lessons.find(l=>l.checkpoint),0,0);assert.equal(s.completed.length,0);assert.equal(s.capabilities.length,0);
});
test('number/time recall is scaffolded, required connectors cannot be bypassed and food is recycled later',()=>{
 const lesson=id=>C.lessons.find(l=>l.id===id);assert.equal(lesson('u3l1').questions[0].answer,'Treinta y dos euros');assert.equal(lesson('u7l2').questions[0].answer,'Son las tres menos cuarto');
 const reason=lesson('a12u3write').questions[1];assert.ok(reason.accepted.every(a=>a.includes('porque')));assert.ok(!E.isCorrect(reason,'Hace frío, por eso necesito una chaqueta negra'));
 assert.match(lesson('a12u4story3').reading.text,/tengo hambre/);assert.match(lesson('a12u4story3').reading.text,/pan y agua/);assert.match(lesson('a12u7story3').reading.text,/comer pan/);
 for(const id of ['u3l1','u7l2'])assert.equal(lesson(id).questions[0].spanish,lesson(id).questions[0].answer);
});
test('all checkpoints now require four distinct Spanish responses instead of duplicate written answers',()=>{
 for(const l of C.lessons.filter(l=>l.checkpoint)){const qs=l.questions.filter(q=>q.language==='es');assert.equal(new Set(qs.map(q=>E.normalizeAnswer(q.answer))).size,4,l.id);}
});
