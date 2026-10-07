// Build-time adaptation of original, reviewed Friends to Amigos B-stage material.
// Outputs are committed static records; never generate exercises at runtime.
const fs=require('node:fs'),C=require('../../www/curriculum'),T=require('../../www/conjugation-targets');
const stages=['B1.1','B1.2','B2.1','B2.2'],code=s=>s.replace('.','').toLowerCase(),clone=x=>JSON.parse(JSON.stringify(x));
const games=[],media=[];const clean=x=>x.replace(/\s+/g,' ').trim();
for(const stage of stages)for(let unit=0;unit<8;unit++){
 const prefix=code(stage)+'u'+unit,lessons=C.lessons.filter(l=>l.stage===stage&&l.unit===unit),cores=lessons.filter(l=>/l[012]$/.test(l.id)),stories=lessons.filter(l=>l.reading),write=lessons.find(l=>/write$/.test(l.id)),topic=C.stageUnits[stage][unit].title,requiredActivities=cores.map(l=>l.id);
 const attach=(q,kind,category)=>({...q,topic,supportConcept:'english-support-'+code(stage)+'-'+unit,instructionLanguage:'es',practice:{kind,stage,unit,category,level:stage.startsWith('B2')?'extended':'connected',outcomeId:code(stage)+'-'+unit,requiredActivities:q.prerequisiteStory?[...requiredActivities,q.prerequisiteStory]:requiredActivities,authorship:'original Friends to Amigos'}});
 // Sixteen course clips and eight course speaking prompts per stage preserve
 // their source identities; 40 narrative/dialogue clips and 48 productive tasks
 // provide distinct retrieval contexts rather than city/name substitutions.
 for(const l of cores)for(const q of l.questions){if(q.listening)media.push(attach({...clone(q),id:'focus-listen-'+q.id,sourceQuestionId:q.id},'listening',['sequence','contrast','intention','reason','viewpoint','dialogue','inference','summary'][unit]));if(q.type==='speaking')media.push(attach({...clone(q),id:'focus-speak-'+q.id,sourceQuestionId:q.id,models:[q.spanish]},'speaking','course-response'));}
 for(let j=0;j<4;j++){
  const l=stories[j],source=l.questions[j];
  const transcript=l.reading.text;
  media.push(attach({id:'focus-listen-'+prefix+'-narrative'+j,prerequisiteStory:l.id,type:source.type,mode:'listening',prompt:source.prompt,promptEs:source.promptEs,englishHint:source.englishHint,answer:source.answer,...(source.options?{options:source.options.slice()}:{accepted:source.accepted.slice(),language:'en-or-es'}),explanation:source.explanation,spanish:transcript,listening:{transcript,lang:'es-ES',rate:.9}},'listening',['explicit-detail','reason','inference','viewpoint'][j]));
  if(j<3){const sentences=l.reading.text.match(/[^.!?]+[.!?](?:[»”])?/g)||[l.reading.text];const model=clean(sentences.slice(0,3).concat(sentences.slice(-2)).join(' '));
   media.push(attach({id:'focus-speak-'+prefix+'-account'+j,prerequisiteStory:l.id,type:'speaking',mode:'speaking',prompt:'Summarise the situation '+l.reading.title+': explain the context, a difficulty and the outcome. Use connected Spanish; your account can differ from the model.',promptEs:'Resume «'+l.reading.title+'»: explica el contexto, una dificultad y el resultado con tus propias palabras.',englishHint:'Explain the situation, a difficulty and the outcome in connected Spanish. The model is one possible account.',answer:model,spanish:model,models:[model],explanation:'One possible account of an original course scenario. Compare the meaning and organisation; this self-assessment does not verify pronunciation.'},'speaking','narration-and-reflection'));
  }
 }
 const model=cores[0].questions[3];
 const transcript=model.promptEs+' «'+model.answer+'».';
 const alternatives=[model.answer,...model.options.filter(x=>x!==model.answer)].slice(0,3);
 media.push(attach({id:'focus-listen-'+prefix+'-exchange',type:'choice',mode:'listening',prompt:'Which response does the second speaker give?',promptEs:'¿Qué respuesta da la segunda persona?',englishHint:'Identify the response to the first speaker, not the question itself.',answer:model.answer,options:alternatives,explanation:model.explanation,spanish:transcript,listening:{transcript,lang:'es-ES',rate:.9}},'listening','speaker-position'));
 for(const q of write.questions.filter(q=>q.writing.mode!=='controlled'))media.push(attach({id:'focus-speak-'+q.id+'-oral',type:'speaking',mode:'speaking',prompt:'Respond aloud to the following task: '+q.prompt,promptEs:q.promptEs.replace(/^Escribe|^Redacta/,'Explica en voz alta').replace(/párrafos/g,'partes'),englishHint:'Respond aloud to this writing scenario. Use connected ideas; the model is only one possible response.',answer:q.answer,spanish:q.answer,models:[q.answer],explanation:'Speaking is self-assessed. Compare content, connections and register; the app neither records nor assesses pronunciation.'},'speaking','connected-production'));
 const allowed=T.targets.filter(t=>C.stages.indexOf(t.stage)<C.stages.indexOf(stage)||t.stage===stage&&t.unit<=unit);
 // Candidate sentences come from authored models, constrained tasks and stories.
 // Each stored target records its selected paradigm; inspect the generated audit
 // whenever authoring changes, rather than allowing IDs to move at runtime.
 const candidates=[...cores.flatMap(l=>l.questions.filter(q=>q.type==='text'&&q.language==='es').map(q=>q.answer)),...write.questions.filter(q=>q.writing.mode==='controlled').map(q=>q.answer),...stories.flatMap(l=>l.reading.text.match(/[^.!?]+[.!?]/g)||[])].map(clean);
 let count=0;const used=new Set(),openings=new Set();
 for(const sentence of candidates){if(count===8)break;const opening=sentence.toLowerCase().split(/\s+/).slice(0,3).join(' ');if(sentence.split(/\s+/).length<6||openings.has(opening))continue;if(sentence.length>230||sentence.includes('«')||sentence.includes('»')||used.has(sentence.toLowerCase()))continue;
  const matches=[];for(const t of allowed)for(let row=0;row<6;row++){
   const form=t.forms[row];const pattern=new RegExp('(?<![\\p{L}])'+form.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}])','giu');for(const m of sentence.matchAll(pattern)){
    const before=sentence.slice(0,m.index).trim().toLowerCase(),after=sentence.slice(m.index+m[0].length).trim().toLowerCase();
    // Homographs are not all verbs. Curated noun/conjunction exclusions avoid
    // turning trabajo/reserva/como into conjugation drills.
    if(['como','trabajo','reserva','reservas'].includes(form.toLowerCase()))continue;
    if(['trabajo','reserva','reservas'].includes(form.toLowerCase())&&/(?:el|la|las|un|una|mismo|de|mi|su|y) $/.test(before+' '))continue;
    if(t.verb==='ir'&&t.tense==='preterite'&&!/^(?:a |al |hacia )/.test(after))continue;
    if(t.verb==='llevar'&&/(?:me|te|se|nos|os)$/.test(before))continue;
    matches.push({start:m.index,end:m.index+m[0].length,t,row});
   }
  }
  matches.sort((a,b)=>(b.end-b.start)-(a.end-a.start)||C.stages.indexOf(b.t.stage)-C.stages.indexOf(a.t.stage));const selected=[];
  for(const m of matches){if(selected.length>=Math.min(3,1+Math.floor(count/3)))break;if(selected.some(x=>m.start<x.end&&m.end>x.start))continue;
   // Disambiguate identical first/third forms only when an explicit subject is
   // available. Otherwise the options intentionally contain distinct forms,
   // and the tense label supplies a constrained paradigm task.
   if(selected.some(x=>x.t.id===m.t.id))continue;selected.push(m);
  }
  if(!selected.length)continue;selected.sort((a,b)=>a.start-b.start);let masked=sentence;for(const m of selected.slice().reverse())masked=masked.slice(0,m.start)+'___'+masked.slice(m.end);
  const blanks=selected.map(({t,row})=>{const answer=t.forms[row],options=[answer,...[...new Set(t.forms)].filter(x=>x!==answer).slice(0,3)];return {verb:t.verb,tense:t.tense,person:T.persons[row],ambiguousPerson:t.forms.filter(f=>f===answer).length>1,answer,infinitive:t.verb,source:t.source,concept:t.tense==='present'?t.pattern:t.tense,options,explanation:T.explain(t,row,answer),mistakes:Object.fromEntries(options.filter(x=>x!==answer).map(x=>[x,T.explain(t,row,x)]))};});
  games.push({id:'conj-'+code(stage)+'-'+String(unit*8+(++count)).padStart(3,'0'),stage,unit,difficulty:stage.startsWith('B2')?5:4,sentence:masked,blanks,concepts:[...new Set(blanks.flatMap(b=>[b.concept,...(b.ambiguousPerson?[]:['person-'+b.person])]))],explanation:'Use the stated tense and the sentence context. The table forms supply the person endings; meaning determines their use.',requiredActivities:[...new Set([...requiredActivities,...blanks.map(b=>b.source)])],authorship:'original Friends to Amigos; adapted from own authored scenarios'});used.add(sentence.toLowerCase());openings.add(opening);
 }
 if(count!==8)throw Error('Not enough meaningful contexts '+prefix+': '+count);
}
for(const q of media)delete q.prerequisiteStory;
const emit=(path,name,value)=>fs.writeFileSync(path,"(function(root){'use strict';const data="+JSON.stringify(value,null,1)+";root."+name+"=data;if(typeof module!=='undefined')module.exports=data;})(typeof window==='undefined'?globalThis:window);\n");
emit('www/b-focused-data.js','BFocusedData',media);emit('www/b-conjugations-data.js','BConjugationsData',games);
console.log('Authored-context adaptations:',games.length,'sentence items;',media.length,'focused items');
