const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{createRequire}=require('node:module');
const C=require('../www/curriculum'),E=require('../www/engine'),P=require('../www/storage'),Clarity=require('../www/learner-clarity');
const clone=v=>JSON.parse(JSON.stringify(v));
function beforeClarity(){
 const source=fs.readFileSync(path.resolve('www/curriculum.js'),'utf8').replace('clarity.apply(data);','').replace('language.apply(data);','');
 const box={module:{exports:{}},require:createRequire(path.resolve('www/curriculum.js'))};vm.runInNewContext(source,box);return clone(box.module.exports);
}
const before=beforeClarity(),questions=c=>c.lessons.flatMap(l=>l.questions),find=id=>questions(C).find(q=>q.id===id);
test('learner wording audit covers every playable A1 question, including reading, writing, listening and speaking',()=>{
 assert.equal(C.learnerClarityAudit.questions,832);assert.deepEqual(C.learnerClarityAudit.stages,{'A1.1':416,'A1.2':416});assert.deepEqual(C.learnerClarityAudit.types,{choice:363,gap:64,text:389,speaking:16});assert.equal(C.learnerClarityAudit.spanishProduction,240);
 assert.ok(C.learnerClarityAudit.taskRewrites>=70);assert.ok(C.learnerClarityAudit.contextLabelsRemoved>=500);
 for(const q of questions(C).filter(q=>!q.id.startsWith('a22'))){assert.ok(!/Your role|In this role-play|\(role:|Which connector|function of|consequence/i.test(q.prompt),q.id);assert.ok(q.prompt.trim());}
});
test('prompt and feedback amendments preserve every ID, learning target, accepted answer, choice, passage and objective',()=>{
 assert.deepEqual(C.lessons.map(l=>({id:l.id,stage:l.stage,goal:l.goal,outcomeId:l.outcomeId,capability:l.capability})),before.lessons.map(l=>({id:l.id,stage:l.stage,goal:l.goal,outcomeId:l.outcomeId,capability:l.capability})));
 const immutable=q=>{const copy=clone(q);delete copy.prompt;delete copy.mistakes;delete copy.explanation;for(const key of ['promptEs','englishHint','instructionLanguage','supportConcept'])delete copy[key];return copy;};assert.deepEqual(questions(C).map(immutable),questions(before).map(immutable));
 for(const old of questions(before))if(old.id!=='u0l0-q5')assert.equal(find(old.id).explanation,old.explanation,old.id);
 for(const key of ['placement','numbers','time','legacyQuestions','legacyLessons'])assert.deepEqual(clone(C[key]),before[key],key);
});
test('early name practice has direct scaffolding and later role prompts use the learner perspective',()=>{
 assert.equal(find('u0l0-q5').prompt,'You are Luis. Write “My name is Luis” in Spanish.');assert.equal(find('u0l0-q5').answer,'Me llamo Luis');assert.match(find('u4write-q1').prompt,/You are Luis/);assert.match(find('a12u6write-q4').prompt,/You are Ana/);
 assert.equal(find('a12u0l0-q3').prompt,'From memory, write “I like reading”.');assert.equal(find('a12u1story1-q3').prompt,'Why does Ana say “Lo siento” here?');
});
test('common-mistake additions remain incorrect, unique and finite while preserving earlier authored feedback',()=>{
 let added=0,affected=0;const unique=new Set();
 for(const old of questions(before)){
  const q=find(old.id),existing=old.mistakes||[],preserved=clone((q.mistakes||[]).slice(0,existing.length));assert.deepEqual(preserved.map(m=>m.answer),existing.map(m=>m.answer),q.id);
  for(let i=0;i<existing.length;i++)if(!['u6l2-q5','u6write-q5','u6check-q8'].includes(q.id)||!existing[i].explanation.includes('between ir and the infinitive'))assert.equal(preserved[i].explanation,existing[i].explanation,q.id);
  const news=(q.mistakes||[]).slice(existing.length);added+=news.length;if(news.length)affected++;
  const oldKeys=new Set(existing.map(m=>E.normalizeAnswer(m.answer))),newKeys=news.map(m=>E.normalizeAnswer(m.answer));assert.equal(new Set(newKeys).size,newKeys.length,q.id);for(const key of newKeys)assert.ok(!oldKeys.has(key),q.id);
  for(const m of news){assert.ok(!E.isCorrect(q,m.answer),q.id+': '+m.answer);assert.equal(E.answerExplanation(q,m.answer),m.explanation);assert.ok(m.explanation.length>=30);unique.add(m.explanation);}
 }
 assert.equal(added,C.learnerClarityAudit.addedMistakes);assert.equal(affected,C.learnerClarityAudit.questionsWithNewMistakes);assert.equal(unique.size,C.learnerClarityAudit.uniqueNewExplanations);
});
test('high-value beginner misconceptions explain names, age, agreement, person, future, routine, orders and time',()=>{
 const cases=[['u0l0-q3','Mi llamo Ana',/Mi means “my”/],['u1l1-q3','Soy veinte años',/tener/],['u2l1-q3','Estoy hambre',/hambre/],['a12u0l1-q3','Me gusta los libros',/Plural/],['u2l0-q3','Un café con leche, para favor',/Por favor/],['a12u3l0-q3','Necesito un camiseta azul',/feminine/],['a12u2l0-q3','Voy leer mañana',/Keep a/],['a12u6l0-q3','Mi levanto a las siete',/Mi means/],['a12u3l2-q3','¿Usted tienes la talla mediana?',/usted/],['u7write-q2','Desayuno las nueve',/Keep a/]];
 for(const [id,response,pattern] of cases){const q=find(id);assert.ok(!E.isCorrect(q,response));assert.match(E.answerExplanation(q,response),pattern,id);}
});
test('historical active attempts and review snapshots retain old prompt and explanation text after the wording update',()=>{
 const q=questions(before).find(q=>q.id==='u0l0-q5'),lesson=before.lessons[0],state=E.fresh();state.active={kind:'lesson',lesson,questions:lesson.questions,index:4,answers:[true,true,true,true],selected:null,checked:false};E.recordAnswer(state,q,false,100);
 const restored=P.parse(JSON.stringify(state),C,{import:true}).state;assert.equal(restored.active.questions[4].prompt,q.prompt);assert.equal(restored.reviews[q.id].question.prompt,q.prompt);assert.deepEqual(restored.reviews[q.id].question.mistakes,q.mistakes||[]);assert.notEqual(q.prompt,find(q.id).prompt);
 const oldSnapshot=clone(restored.reviews[q.id].question);E.recordAnswer(restored,find(q.id),false,200);assert.deepEqual(restored.reviews[q.id].question,oldSnapshot);assert.equal(restored.reviews[q.id].wrong,2);
});
test('the clarity overlay is idempotent and does not spread feedback between checkpoint or focused-practice slots',()=>{
 const data=clone(C);Clarity.apply(data);assert.deepEqual(data,clone(C));
 const independent=beforeClarity();independent.getUnit=lesson=>independent.stageUnits[lesson.stage][lesson.unit];const source=independent.lessons.find(l=>l.id==='u1l1').questions[2],checkpoint=independent.lessons.find(l=>l.id==='u1check').questions[6],oldCheckpoint=clone(checkpoint.mistakes);
 Clarity.apply(independent);source.mistakes.push({answer:'A test-only error',explanation:'This is only a test.'});assert.ok(!checkpoint.mistakes.some(m=>m.answer==='A test-only error'));assert.deepEqual(checkpoint.mistakes.slice(0,oldCheckpoint.length),oldCheckpoint);
});
test('destination feedback does not confuse going to a place with ir a plus an action, and age rules remain bounded',()=>{
 assert.equal(C.learnerClarityAudit.correctedMistakes,3);assert.equal(C.learnerClarityAudit.clarifiedExplanations,1);
 for(const [id,response] of [['u6l2-q5','Voy la estación'],['u6write-q5','Voy la farmacia'],['u6check-q8','Voy la estación']]){assert.match(E.answerExplanation(find(id),response),/before the place/);assert.doesNotMatch(E.answerExplanation(find(id),response),/infinitive/);}
 assert.match(E.answerExplanation(find('a12u2l0-q3'),'Voy leer mañana'),/next action|infinitive|between/);
 const age=questions(C).filter(q=>q.mistakes?.some(m=>m.explanation.startsWith('For your own age')));assert.equal(age.length,4);for(const q of age)assert.match(q.answer,/^Tengo (veinte|diecinueve|veintiún) años$/);
 const synthetic={...clone(find('u1l1-q3')),id:'not-playable',answer:'Tengo hambre y tengo veinte años',accepted:['Tengo hambre y tengo veinte años'],mistakes:[]},data={lessons:[{stage:'A1.1',questions:[synthetic]}]};Clarity.apply(data);assert.ok(!synthetic.mistakes.some(m=>m.explanation.startsWith('For your own age')));
});
