'use strict';
// Validate authored material and report surface-word recycling. No corpus/dependencies.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../www/curriculum'),E=require('../www/engine'),P=require('../www/storage');
const fixtures=name=>JSON.parse(fs.readFileSync(path.join(__dirname,'../tests/fixtures',name),'utf8'));
const groups=Object.fromEntries([...C.lessons.map(l=>[l.id,l.questions]),...['placement','numbers','time'].map(k=>[k,C[k]])]);
assert.deepEqual(C.lessons.filter(l=>l.stage!=='A2.1').map(l=>l.id),fixtures('a1-activity-ids.json'),'Activity IDs/order changed');
assert.deepEqual(Object.fromEntries(Object.entries(groups).filter(([k])=>!k.startsWith('a21')).map(([k,qs])=>[k,qs.map(q=>q.id)])),fixtures('question-ids.json'),'Question IDs/order changed');
assert.deepEqual(C.playableStages,['A1.1','A1.2','A2.1']);assert.deepEqual(C.lessons.filter(l=>l.stage==='A2.1').map(l=>l.id),fixtures('a21-activity-ids.json'));assert.deepEqual(Object.fromEntries(C.lessons.filter(l=>l.stage==='A2.1').map(l=>[l.id,l.questions.map(q=>q.id)])),fixtures('a21-question-ids.json'));assert.ok(C.lessons.every(l=>C.playableStages.includes(l.stage)));
const ids=new Set();for(const [activity,qs] of Object.entries(groups))for(const q of qs){
 assert.ok(q.id.startsWith(activity+'-'));assert.ok(!ids.has(q.id),q.id);ids.add(q.id);
 assert.ok(P.question(q),'Invalid snapshot: '+q.id);
 if(q.type==='text'){
  assert.ok(q.accepted.every(a=>a.length<=160),'Answer too long: '+q.id);
  assert.equal(new Set(q.accepted.map(E.normalizeAnswer)).size,q.accepted.length,'Accepted variants collide: '+q.id);
  if(q.language==='es')assert.ok(E.isCorrect(q,q.answer),'Model not accepted: '+q.id);
 }
 for(const m of q.mistakes||[])assert.ok(!E.isCorrect(q,m.answer),'Misconception accepted: '+q.id);
}
const Bank=require('../www/conjugations-bank');
assert.deepEqual(Bank.questions.map(q=>q.id),fixtures('conjugations-ids.json'),'Permanent game question IDs/order changed');
const gameIds=new Set();for(const q of Bank.questions){
 assert.ok(!ids.has(q.id)&&!gameIds.has(q.id),'Game ID collision: '+q.id);gameIds.add(q.id);
 assert.ok(C.playableStages.includes(q.stage));assert.ok(q.blanks.length>=1&&q.blanks.length<=3);
 assert.equal(q.sentence.split('___').length-1,q.blanks.length);
 assert.ok(q.requiredActivities.every(id=>C.lessons.some(l=>l.id===id)));
 assert.ok(q.blanks.every(b=>b.options.filter(x=>x===b.answer).length===1&&new Set(b.options).size===b.options.length&&b.explanation&&b.options.filter(x=>x!==b.answer).every(x=>b.mistakes[x])));
}for(const stage of ['A1.1','A1.2'])assert.ok(Bank.questions.filter(q=>q.stage===stage).length>=100,'Too few authored '+stage+' game items');
const Targets=require('../www/conjugation-targets');const targetIds=new Set();for(const t of Targets.targets){assert.ok(!targetIds.has(t.id));targetIds.add(t.id);assert.equal(t.forms.length,6);assert.ok(t.forms.every(Boolean));assert.ok(C.playableStages.includes(t.stage));assert.ok(C.lessons.some(l=>l.id===t.source&&l.stage===t.stage&&l.unit===t.unit));assert.ok(Targets.pattern(t));assert.ok(t.requiredActivities.every(id=>C.lessons.some(l=>l.id===id)));}
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of [...files(path.join(__dirname,'../www')),...files(path.join(__dirname,'../tests')),...files(__dirname)].filter(f=>/\.(js|cjs)$/.test(f)))new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
const tokens=text=>(text.normalize('NFC').toLowerCase().match(/[a-záéíóúüñ]+/g)||[]);
const units=C.playableStages.flatMap(stage=>C.stageUnits[stage].map((unit,index)=>{
 const lessons=C.lessons.filter(l=>l.stage===stage&&l.unit===index);
 // Positive Spanish models only: exclude English, distractors, accepted variants,
 // checkpoints (copied retrieval), and repeated story text attached to questions.
 const texts=[...unit.phrases.map(x=>x[0]),...lessons.filter(l=>l.reading).map(l=>l.reading.text),...lessons.filter(l=>!l.reading&&!l.checkpoint).flatMap(l=>l.questions).map(q=>q.listening?.transcript||q.spanish||(q.language==='es'?q.answer:''))];
 return {id:unit.id,stage,index,title:unit.title,words:new Set(tokens(texts.join(' ')))};
}));
const vocabulary={};for(const term of ['hola','gracias','por','favor','café','pan','agua','hambre','años','móvil','ordenador','ordenadores','libro','libros','llaves','mesa','parque','mañana','porque','después'])vocabulary[term]=units.filter(u=>u.words.has(term)).map(u=>u.id);
const stageStats=C.playableStages.map(stage=>{
 const lessons=C.lessons.filter(l=>l.stage===stage),stories=lessons.filter(l=>l.reading),qs=lessons.flatMap(l=>l.questions),words=stories.map(l=>tokens(l.reading.text).length);
 return {stage,activities:lessons.length,questions:qs.length,units:C.stageUnits[stage].length,stories:stories.length,storyWords:{min:Math.min(...words),mean:Number((words.reduce((a,b)=>a+b,0)/words.length).toFixed(1)),max:Math.max(...words)},spanishWriting:qs.filter(q=>q.language==='es').length,listening:qs.filter(q=>q.listening).length,speaking:qs.filter(q=>q.type==='speaking').length,misconceptionExamples:qs.reduce((sum,q)=>sum+(q.mistakes||[]).length,0)};
});
const allWords=[...new Set(units.flatMap(u=>[...u.words]))],histogram={};for(const word of allWords){const count=units.filter(u=>u.words.has(word)).length;histogram[count]=(histogram[count]||0)+1;}
const report={method:'Surface forms in positive Spanish teaching models, unit phrase banks and unique stories; excludes distractors, English, accepted variants and checkpoints. Unit coverage is exposure, not a measure of mastery. Inflections are not lemmatised.',stageStats,authoredQuestionIds:ids.size,vocabulary,unitCoverageHistogram:histogram};
if(process.argv.includes('--report'))console.log(JSON.stringify(report,null,2));else console.log('Syntax and curriculum checks passed: '+C.lessons.length+' activities, '+C.lessons.flatMap(l=>l.questions).length+' course questions, '+ids.size+' permanent IDs; '+gameIds.size+' separate game questions.');
module.exports=report;
