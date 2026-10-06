'use strict';
// Validate authored material and report surface-word recycling. No corpus/dependencies.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../www/curriculum'),E=require('../www/engine'),P=require('../www/storage');
const fixtures=name=>JSON.parse(fs.readFileSync(path.join(__dirname,'../tests/fixtures',name),'utf8'));
const groups=Object.fromEntries([...C.lessons.map(l=>[l.id,l.questions]),...['placement','numbers','time'].map(k=>[k,C[k]])]);
assert.deepEqual(C.lessons.map(l=>l.id),fixtures('a1-activity-ids.json'),'Activity IDs/order changed');
assert.deepEqual(Object.fromEntries(Object.entries(groups).map(([k,qs])=>[k,qs.map(q=>q.id)])),fixtures('question-ids.json'),'Question IDs/order changed');
assert.deepEqual(C.playableStages,['A1.1','A1.2']);assert.ok(C.lessons.every(l=>C.playableStages.includes(l.stage)));
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
if(process.argv.includes('--report'))console.log(JSON.stringify(report,null,2));else console.log('Syntax and curriculum checks passed: '+C.lessons.length+' activities, '+C.lessons.flatMap(l=>l.questions).length+' course questions, '+ids.size+' permanent IDs.');
module.exports=report;
