const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../www/engine');
const question=(answer,extra={})=>({id:'feedback-test',type:'text',language:'es',answer,accepted:[answer],explanation:'Remember the model for this task.',...extra});
const words=parts=>parts.filter(p=>p.changed).map(p=>p.text);
test('feedback preserves the exact learner response and highlights deterministic word differences',()=>{
 const q=question('Me llamo Ana'),input='  Mi  llamo Ana! ';const f=E.answerFeedback(q,input);
 assert.equal(f.learner,input);assert.equal(f.learnerParts.map(p=>p.text).join(''),input);assert.equal(f.targetParts.map(p=>p.text).join(''),q.answer);
 assert.deepEqual(words(f.learnerParts),['Mi']);assert.deepEqual(words(f.targetParts),['Me']);assert.match(f.explanation,/Mi means/);
});
test('exact authored mistake explanations take precedence over comparison diagnoses',()=>{
 const q=question('Me llamo Ana',{mistakes:[{answer:'Mi llamo Ana',explanation:'A reviewed explanation takes priority.'}]});
 assert.equal(E.answerFeedback(q,'MI LLAMO ANA!').explanation,q.mistakes[0].explanation);assert.equal(E.answerExplanation(q,'MI LLAMO ANA!'),q.mistakes[0].explanation);
});
test('missing and extra words describe the authored model rather than claiming universal grammar rules',()=>{
 const q=question('Voy a leer mañana');const missing=E.answerFeedback(q,'Voy leer mañana'),extra=E.answerFeedback(q,'Voy a leer aquí mañana');
 assert.equal(missing.kind,'missing');assert.match(missing.explanation,/includes “a”.*missing/);assert.deepEqual(words(missing.targetParts),['a']);
 assert.equal(extra.kind,'extra');assert.match(extra.explanation,/adds “aquí” compared with this model/);assert.deepEqual(words(extra.learnerParts),['aquí']);
});
test('different order is compared transparently without pretending to grade all valid Spanish word order',()=>{
 const f=E.answerFeedback(question('Hoy voy al cine'),'Voy hoy al cine');assert.equal(f.kind,'order');assert.match(f.explanation,/words match this model/);assert.doesNotMatch(f.explanation,/ungrammatical|never|always/);
});
test('closest finite accepted model is used without making an unaccepted response correct',()=>{
 const q=question('Quiero un café, por favor',{accepted:['Quiero un café, por favor','Un café, por favor']});const f=E.answerFeedback(q,'Una café, por favor');
 assert.equal(f.target,'Un café, por favor');assert.equal(E.isCorrect(q,'Una café, por favor'),false);assert.match(f.explanation,/article/);
});
test('unexpected wrong answers receive a cautious useful fallback, including bilingual comprehension',()=>{
 for(const q of [question('Quiero agua'),question('At the café',{language:'English or Spanish',accepted:['At the café','En el café']})]){
  const f=E.answerFeedback(q,'something completely different');assert.equal(f.kind,'compare');assert.match(f.explanation,/outside the accepted examples/);assert.match(f.explanation,/another phrasing may still be valid/);assert.ok(f.learnerParts.some(p=>p.changed));
 }
});
test('comparison remains bounded for very long malformed input and never promises nonexistent highlighting',()=>{
 const f=E.answerFeedback(question('Hola'),Array(100).fill('word').join(' '));assert.match(f.explanation,/Compare your answer/);assert.doesNotMatch(f.explanation,/underlined/);assert.ok(!f.learnerParts.some(p=>p.changed));
});
test('known grammar substitutions are diagnosed only with supporting Spanish target context',()=>{
 for(const [answer,input,pattern] of [['Tengo veinte años','Soy veinte años',/age/],['Tengo hambre','Estoy hambre',/Hunger uses tener/],['Me gustan los libros','Me gusta los libros',/plural/],['Me gusta leer','Me gustan leer',/one thing or an activity/]])assert.match(E.answerFeedback(question(answer),input).explanation,pattern);
 assert.doesNotMatch(E.answerFeedback(question('Tengo un libro'),'Soy un libro').explanation,/age|Hunger/);
 const bilingual=question('Me llamo Ana',{language:'English or Spanish'});assert.doesNotMatch(E.answerFeedback(bilingual,'Mi llamo Ana').explanation,/Mi means/);
});
test('same-gender article alternatives are not misdiagnosed as gender or number errors',()=>{
 const f=E.answerFeedback(question('Quiero un café'),'Quiero el café');assert.match(f.explanation,/One word differs/);assert.doesNotMatch(f.explanation,/gender|number/);
});
test('feedback does not mutate authored answers, historical question snapshots or review counters',()=>{
 const q=question('Me llamo Ana',{mistakes:[{answer:'Soy llamo Ana',explanation:'Use me llamo.'}]}),before=JSON.stringify(q),s=E.fresh();E.recordAnswer(s,q,false,100);const state=JSON.stringify(s);
 E.answerFeedback(s.reviews[q.id].question,'Mi llamo Ana');assert.equal(JSON.stringify(q),before);assert.equal(JSON.stringify(s),state);
});
test('scoring still tolerates case punctuation vowel accents and spacing while preserving negation and ñ',()=>{
 const q=question('Tengo veinte años');assert.equal(E.isCorrect(q,' TENGO  veinte años! '),true);assert.equal(E.isCorrect(q,'Tengo veinte anos'),false);assert.equal(E.isCorrect(q,'No tengo veinte años'),false);assert.equal(E.isCorrect(question('Quiero café'),'quiero cafe.'),true);
});
test('choice feedback uses the authored explanation and does not introduce finite-writing caveats',()=>{
 const q={type:'choice',answer:'Spain',options:['Spain','England'],explanation:'España means Spain.'};const f=E.answerFeedback(q,'England');assert.equal(f.explanation,q.explanation);assert.equal(f.learner,'England');assert.equal(f.target,'Spain');
});
