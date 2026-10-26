const {test}=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const C=require('./helpers/v12-course.cjs'),E=require('../www/engine'),P=require('../www/storage'),G=require('../www/conjugations-bank'),T=require('../www/conjugation-targets');
const corrections=require('../docs/release/dictionary-content-corrections.json');
const questions=new Map(C.lessons.flatMap(l=>l.questions).map(q=>[q.id,q]));
const hash=l=>crypto.createHash('sha256').update(JSON.stringify(l,(k,v)=>k==='writing'?undefined:v)).digest('hex');

test('Spanish polish is an explicit bounded correction list with unchanged stable identities',()=>{
 assert.equal(corrections.games.length,6);assert.equal(corrections.activities.length,13);
 assert.deepEqual(C.lessons.slice(0,288).map(l=>l.id),Object.keys(require('./fixtures/v0100-course-hashes.json')));
 assert.deepEqual(G.questions.slice(0,208).map(q=>q.id),require('./fixtures/conjugations-ids.json'));
 for(const row of corrections.course){assert.ok(questions.has(row.id));assert.ok(!row.changes.some(change=>['id','sourceQuestionId'].includes(change.field)));for(const change of row.changes)assert.deepEqual(questions.get(row.id)[change.field],change.after,row.id+': '+change.field);}
 for(const row of corrections.activities){assert.equal(hash(C.lessons.find(l=>l.id===row.id)),row.afterHash,row.id);assert.notEqual(row.beforeHash,row.afterHash);}
});

test('six natural game carriers preserve verb, grammatical person, answers and provenance',()=>{
 const expected={
  'conj-a11-025':'___ un café, por favor.',
  'conj-a11-038':'El café con leche ___ para Ana.',
  'conj-a11-049':'¿___ cinco euros para la cuenta?',
  'conj-a12-009':'Me ___ caminar, pero no ___ caminar hoy.',
  'conj-a12-027':'Diego, mañana ___ a venir a tu café.',
  'conj-a12-075':'Mi piso ___ cerca de la estación y yo ___ al parque.'
 };
 for(const row of corrections.games){const q=G.questions.find(q=>q.id===row.id);assert.equal(q.sentence,expected[row.id]);assert.deepEqual(q.blanks.map(b=>({verb:b.verb,answer:b.answer,person:b.person,source:b.source})),row.unchangedTargets);assert.equal(q.sentence.split('___').length-1,q.blanks.length);}
 assert.equal(G.questions.find(q=>q.id==='conj-a11-025').blanks[0].answer,'quiero');
 assert.equal(G.questions.find(q=>q.id==='conj-a12-027').blanks[0].answer,'vamos');
 const money=G.questions.find(q=>q.id==='conj-a11-049').blanks[0];assert.match(money.explanation,/money.*tienes/);assert.doesNotMatch(money.explanation,/Age/);for(const why of Object.values(money.mistakes)){assert.match(why,/money.*tienes/);assert.doesNotMatch(why,/Age/);}
});

test('the A2.1 friends prompt is explicitly plural and still targets habéis comido',()=>{
 const q=questions.get('a21u0write-q2');assert.match(q.promptEs,/directamente a varios amigos/);assert.match(q.promptEs,/ya han comido/);assert.equal(q.answer,'¿Habéis comido?');assert.ok(E.isCorrect(q,'Habeis comido?'));assert.ok(!E.isCorrect(q,'Ha comido?'));assert.match(q.explanation,/most of Spain/);
});

test('clothing alternatives remain practical, authored and compatible with the original model',()=>{
 for(const [id,answers] of [
  ['a12u3l2-q3',['¿Tiene una talla M?','¿La tiene en una M?','¿La tiene en una talla M?']],
  ['a12u3write-q4',['Necesito una M, no una S','Necesito una talla M, no una S']],
  ['a12u4l1-q5',['La camiseta me queda pequeña. Necesito una talla más grande.']],
  ['a22u4l0-q5',['La camiseta me queda pequeña. Tengo el recibo. ¿La tiene en una talla más grande?','La camiseta me queda pequeña. Tengo el recibo. Necesito una talla más grande.']]
 ]){const q=questions.get(id);for(const answer of answers)assert.ok(E.isCorrect(q,answer),id+': '+answer);assert.ok(E.isCorrect(q,q.answer));assert.equal(new Set(q.accepted.map(E.normalizeAnswer)).size,q.accepted.length,id);}
});

test('transport plans prefer coger but continue accepting every historical tomar alternative',()=>{
 for(const id of ['a22u2l0-q5','a22u2write-q4','a22u2check-q5']){const q=questions.get(id);assert.match(q.answer,/coger el autobús/);assert.ok(q.accepted.some(a=>a.includes('tomar el autobús')));for(const row of corrections.course.filter(row=>row.id===id))for(const change of row.changes.filter(x=>x.field==='accepted'))for(const previous of change.before)assert.ok(E.isCorrect(q,previous),id+': '+previous);}
 assert.ok(E.isCorrect(questions.get('a21u7l1-q5'),'Ayer cogí el autobús y llegué a las nueve'));
 assert.ok(E.isCorrect(questions.get('a21u7write-q2'),'Ayer cogí el tren. El tren es más rápido que el autobús'));
 assert.equal(questions.get('a21u7l1-q2').answer,'Tomé');
 assert.match(questions.get('a21u7l1-q3').answer,/^Tomé/);
 assert.deepEqual(T.targets.find(t=>t.id==='table-a21-tomar-preterite').forms,['tomé','tomaste','tomó','tomamos','tomasteis','tomaron']);
 for(const q of G.questions.filter(q=>q.stage==='A2.1'&&q.unit===7&&q.blanks.some(b=>b.verb==='tomar')))assert.ok(q.blanks.every(b=>b.verb!=='coger'));
});

test('touched explanations teach the displayed response and do not quote absent model verbs',()=>{
 const travel=questions.get('a22u2l0-q5'),shop=questions.get('a22u4l0-q5');
 assert.match(travel.explanation,/voy a \+ infinitive/);assert.doesNotMatch(travel.explanation,/llegué/);assert.match(travel.explanation,/tomar.*valid/);
 assert.match(shop.explanation,/me queda pequeña/i);assert.match(shop.explanation,/tengo el recibo/);assert.doesNotMatch(shop.explanation,/infinitive, cambiar/);
 assert.equal(questions.get('a22u2check-q5').explanation,travel.explanation);assert.equal(questions.get('a22u4check-q5').explanation,shop.explanation);
});

test('regional notes qualify usual Spain plural usage while retaining useful alternatives',()=>{
 assert.match(C.stageUnits['A1.1'][1].note,/usual informal plural.*most of Spain/);assert.match(C.stageUnits['A1.1'][1].note,/Ustedes.*Latin America/);
 for(const unit of [2,7]){const note=C.stageUnits['A2.1'][unit].note;assert.match(note,/Coger el tren\/el autobús/);assert.match(note,/Tomar el tren\/el autobús is also valid/);}
});

test('content polishing retains all historical accepted variants and safe review snapshots',()=>{
 for(const row of corrections.course)for(const change of row.changes.filter(change=>change.field==='accepted'))for(const answer of change.before)assert.ok(E.isCorrect(questions.get(row.id),answer),row.id+': '+answer);
 const q=structuredClone(questions.get('a22u2l0-q5')),row=corrections.course.find(x=>x.id===q.id);for(const change of row.changes)q[change.field]=structuredClone(change.before);
 const s=E.fresh();E.recordAnswer(s,q,false,1000);const restored=P.parse(JSON.stringify(s),C,{import:true}).state;
 assert.equal(restored.reviews[q.id].question.answer,'Perdí el tren. Voy a tomar el autobús.');assert.equal(restored.reviews[q.id].question.promptEs,'Perdiste el tren. Vas a tomar el autobús. Explica hecho y plan.');assert.ok(E.isCorrect(restored.reviews[q.id].question,q.answer));assert.equal(restored.reviews[q.id].due,1000);
});
