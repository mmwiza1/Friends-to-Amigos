'use strict';
// Validate authored material and report surface-word recycling. No corpus/dependencies.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../www/curriculum'),E=require('../www/engine'),P=require('../www/storage');
const fixtures=name=>JSON.parse(fs.readFileSync(path.join(__dirname,'../tests/fixtures',name),'utf8'));
const groups=Object.fromEntries([...C.lessons.map(l=>[l.id,l.questions]),...['placement','numbers','time'].map(k=>[k,C[k]])]);
assert.deepEqual(C.lessons.filter(l=>['A1.1','A1.2'].includes(l.stage)).map(l=>l.id),fixtures('a1-activity-ids.json'),'Activity IDs/order changed');
assert.deepEqual(Object.fromEntries(Object.entries(groups).filter(([k])=>! /^(?:a2[12]|b[12][12])/.test(k)).map(([k,qs])=>[k,qs.map(q=>q.id)])),fixtures('question-ids.json'),'Question IDs/order changed');
assert.deepEqual(C.playableStages,['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2']);assert.deepEqual(C.lessons.filter(l=>l.stage==='A2.1').map(l=>l.id),fixtures('a21-activity-ids.json'));assert.deepEqual(Object.fromEntries(C.lessons.filter(l=>l.stage==='A2.1').map(l=>[l.id,l.questions.map(q=>q.id)])),fixtures('a21-question-ids.json'));assert.ok(C.lessons.every(l=>C.playableStages.includes(l.stage)));
const ids=new Set();for(const [activity,qs] of Object.entries(groups))for(const q of qs){
 assert.ok(q.id.startsWith(activity+'-'));assert.ok(!ids.has(q.id),q.id);ids.add(q.id);
 assert.ok(P.question(q),'Invalid snapshot: '+q.id);
 if(q.teachingModel){const saved=P.question(q);assert.deepEqual(saved.teachingModel,q.teachingModel,'Teaching model lost from snapshot: '+q.id);assert.ok(!q.listening&&q.type!=='speaking','Visible teaching model must not reveal a hidden media model: '+q.id);}
 if(q.type==='text'){
  assert.ok(q.accepted.every(a=>a.length<=(q.writing?.maxLength||160)),'Answer too long: '+q.id);
  assert.equal(new Set(q.accepted.map(E.normalizeAnswer)).size,q.accepted.length,'Accepted variants collide: '+q.id);
  if(q.language==='es'&&q.writing?.mode!=='free')assert.ok(E.isCorrect(q,q.answer),'Model not accepted: '+q.id);
 }
 for(const m of q.mistakes||[])assert.ok(!E.isCorrect(q,m.answer),'Misconception accepted: '+q.id);
}
const Bank=require('../www/conjugations-bank');
assert.deepEqual(Bank.questions.filter(q=>['A1.1','A1.2'].includes(q.stage)).map(q=>q.id),fixtures('conjugations-ids.json'),'Permanent game question IDs/order changed');
assert.deepEqual(Bank.questions.filter(q=>q.stage==='A2.1').map(q=>q.id),fixtures('conjugations-a21-ids.json'),'Appended A2.1 game identities/order changed');
const gameIds=new Set();for(const q of Bank.questions){
 assert.ok(!ids.has(q.id)&&!gameIds.has(q.id),'Game ID collision: '+q.id);gameIds.add(q.id);
 assert.ok(C.playableStages.includes(q.stage));assert.ok(q.blanks.length>=1&&q.blanks.length<=3);
 assert.equal(q.sentence.split('___').length-1,q.blanks.length);
 assert.ok(q.requiredActivities.every(id=>C.lessons.some(l=>l.id===id)));
 assert.ok(q.blanks.every(b=>b.options.filter(x=>x===b.answer).length===1&&new Set(b.options).size===b.options.length&&b.explanation&&b.options.filter(x=>x!==b.answer).every(x=>b.mistakes[x])));
}for(const stage of ['A1.1','A1.2'])assert.ok(Bank.questions.filter(q=>q.stage===stage).length>=100,'Too few authored '+stage+' game items');
const Targets=require('../www/conjugation-targets');const targetIds=new Set();for(const t of Targets.targets){assert.ok(!targetIds.has(t.id));targetIds.add(t.id);assert.equal(t.forms.length,6);assert.ok(t.forms.every(Boolean));assert.ok(C.playableStages.includes(t.stage));assert.ok(C.lessons.some(l=>l.id===t.source&&l.stage===t.stage&&l.unit===t.unit));assert.ok(Targets.pattern(t));assert.ok(t.requiredActivities.every(id=>C.lessons.some(l=>l.id===id)));}
const Focused=require('../www/focused-bank');assert.deepEqual(Focused.items.filter(q=>['A1.1','A1.2','A2.1'].includes(q.practice.stage)).map(q=>q.id),fixtures('focused-question-ids.json'));for(const stage of C.playableStages)for(const kind of ['listening','speaking'])assert.ok(Focused.items.filter(q=>q.practice.stage===stage&&q.practice.kind===kind).length>=50);const focusedIds=new Set();for(const q of Focused.items){assert.ok(!ids.has(q.id)&&!gameIds.has(q.id)&&!targetIds.has(q.id)&&!focusedIds.has(q.id));focusedIds.add(q.id);assert.ok(P.question(q),q.id);assert.ok(q.practice.requiredActivities.every(id=>C.lessons.some(l=>l.id===id&&l.stage===q.practice.stage&&l.unit===q.practice.unit)));}
const Lex=require('../www/learner-dictionary'),LexData=require('../www/learner-dictionary-data');
const lexicalIds=new Set();for(const entry of Lex.entries){
 assert.ok(entry.id.startsWith('lex-')&&!lexicalIds.has(entry.id),'Dictionary identity collision: '+entry.id);
 assert.ok(!ids.has(entry.id)&&!gameIds.has(entry.id)&&!targetIds.has(entry.id)&&!focusedIds.has(entry.id));lexicalIds.add(entry.id);
 assert.ok(['word','phrase'].includes(entry.kind)&&entry.lemma&&entry.meaning&&entry.pos&&entry.sources.length,'Invalid dictionary entry: '+entry.id);
 assert.ok(entry.senses.length<=3);
}for(const form of LexData.forms)assert.ok(lexicalIds.has(form.entry)&&form.surface&&form.lemma&&form.tense,'Invalid known dictionary form');
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of [...files(path.join(__dirname,'../www')),...files(path.join(__dirname,'../tests')),...files(__dirname)].filter(f=>/\.(js|cjs)$/.test(f)))new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
const tokens=text=>(text.normalize('NFC').toLowerCase().match(/[a-záéíóúüñ]+/g)||[]);
const units=C.playableStages.flatMap(stage=>C.stageUnits[stage].map((unit,index)=>{
 const lessons=C.lessons.filter(l=>l.stage===stage&&l.unit===index);
 // Positive Spanish models only: exclude English, distractors, accepted variants,
 // checkpoints (copied retrieval), and repeated story text attached to questions.
 const texts=[...unit.phrases.map(x=>x[0]),...lessons.filter(l=>l.reading).map(l=>l.reading.text),...lessons.filter(l=>!l.reading&&!l.checkpoint).flatMap(l=>l.questions).flatMap(q=>[q.teachingModel?.spanish||'',q.listening?.transcript||q.spanish||(q.language==='es'?q.answer:'')])];
 return {id:unit.id,stage,index,title:unit.title,words:new Set(tokens(texts.join(' ')))};
}));
const vocabulary={};for(const term of ['hola','gracias','por','favor','café','pan','agua','hambre','años','móvil','ordenador','ordenadores','libro','libros','llaves','mesa','parque','mañana','porque','después'])vocabulary[term]=units.filter(u=>u.words.has(term)).map(u=>u.id);
const stageStats=C.playableStages.map(stage=>{
 const lessons=C.lessons.filter(l=>l.stage===stage),stories=lessons.filter(l=>l.reading),qs=lessons.flatMap(l=>l.questions),words=stories.map(l=>tokens(l.reading.text).length);
 return {stage,activities:lessons.length,questions:qs.length,units:C.stageUnits[stage].length,stories:stories.length,storyWords:{min:Math.min(...words),mean:Number((words.reduce((a,b)=>a+b,0)/words.length).toFixed(1)),max:Math.max(...words)},spanishWriting:qs.filter(q=>q.language==='es').length,listening:qs.filter(q=>q.listening).length,speaking:qs.filter(q=>q.type==='speaking').length,misconceptionExamples:qs.reduce((sum,q)=>sum+(q.mistakes||[]).length,0)};
});
const allWords=[...new Set(units.flatMap(u=>[...u.words]))],histogram={};for(const word of allWords){const count=units.filter(u=>u.words.has(word)).length;histogram[count]=(histogram[count]||0)+1;}
const anchors=require('./content/audit-a1-anchors.cjs').audit(C);
assert.equal(anchors.anchors.length,15);assert.equal(anchors.units.length,16);assert.ok(anchors.anchors.every(a=>a.activityCount>0),'An A1 anchor has no authored exposure');
const report={method:'Surface forms in positive Spanish teaching models, unit phrase banks and unique stories; excludes distractors, English, accepted variants and checkpoints. Unit coverage is exposure, not a measure of mastery. Inflections are not lemmatised.',stageStats,authoredQuestionIds:ids.size,dictionary:Lex.stats,vocabulary,unitCoverageHistogram:histogram,a1Anchors:{method:anchors.method,report:'docs/release/a1-anchor-recurrence.json',constructions:anchors.anchors.length,units:anchors.units.length,flags:anchors.flags,coverage:anchors.anchors.map(a=>({id:a.id,label:a.label,activityCount:a.activityCount,unitCount:a.unitCount}))}};
if(process.argv.includes('--report'))console.log(JSON.stringify(report,null,2));else console.log('Syntax and curriculum checks passed: '+C.lessons.length+' activities, '+C.lessons.flatMap(l=>l.questions).length+' course questions, '+ids.size+' permanent IDs; '+gameIds.size+' separate game questions; '+focusedIds.size+' focused Listening/Speaking items; '+Lex.stats.entries+' dictionary entries / '+Lex.stats.formMappings+' known form mappings.');
module.exports=report;
