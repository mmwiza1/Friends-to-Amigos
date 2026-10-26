(function(root){
'use strict';
const W=typeof module!=='undefined'?require('./writing.js'):root.Writing;
const E=typeof module!=='undefined'?require('./engine.js'):root.Engine;
const Path=typeof module!=='undefined'?require('./course-path.js'):root.CoursePath;
const Games=typeof module!=='undefined'?require('./games.js'):root.Conjugations;
const Mastery=typeof module!=='undefined'?require('./mastery.js'):root.Mastery;
const Focused=typeof module!=='undefined'?require('./focused-practice.js'):root.FocusedPractice;
const Blanks=typeof module!=='undefined'?require('./blanks.js'):root.ConjugationBlanks;
const Dictionary=typeof module!=='undefined'?require('./learner-dictionary.js'):root.LearnerDictionary;
const Structured=typeof module!=='undefined'?require('./structured.js'):root.Structured;
const VERSION=2,KEY='friends-to-amigos-v1'; // Keep the discovery key; version lives in the value.
const object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const text=(x,max=500)=>typeof x==='string'&&x.length<=max?x:null;
const safeId=x=>typeof x==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,159}$/.test(x)&&!['constructor','prototype','__proto__'].includes(x);
const number=(x,fallback=0,max=4102444800000)=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=max?x:fallback;
const count=(x,fallback=0)=>Number.isInteger(x)&&x>=0&&x<=1000000?x:fallback;
function date(x){if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x))return null;const d=new Date(x+'T12:00:00Z');return Number.isFinite(d.getTime())&&d.getUTCFullYear()>=1970&&d.getUTCFullYear()<=2100&&d.toISOString().slice(0,10)===x?x:null;}
function hash(value){let a=2166136261,b=5381;for(const c of value){a=Math.imul(a^c.codePointAt(0),16777619);b=Math.imul(b,33)^c.codePointAt(0);}return (a>>>0).toString(16)+'-'+(b>>>0).toString(16);}
function signature(q){return JSON.stringify({type:q.type||'choice',prompt:q.prompt,answer:q.answer,accepted:q.accepted||null,options:q.options||null,...(Structured.active(q)?{structure:Structured.contract(q)}:{}),reading:q.reading?{title:q.reading.title,text:q.reading.text}:null});}
function reading(r){if(!object(r)||!text(r.title,200)||!text(r.text,20000))return null;return {title:r.title,text:r.text,...(text(r.stage,10)?{stage:r.stage}:{}),glossary:Array.isArray(r.glossary)?r.glossary.filter(x=>Array.isArray(x)&&x.length===2&&text(x[0],200)&&text(x[1],300)).map(x=>x.slice()):[]};}
function question(raw){
 if(!object(raw)||!text(raw.prompt,2000)||!text(raw.answer,6000)||!text(raw.explanation,3000)||!text(raw.topic,200))return null;
 const type=raw.type||'choice';if(!['choice','gap','text','speaking','tiles','cloze'].includes(type))return null;
 const q={type,prompt:raw.prompt,answer:raw.answer,explanation:raw.explanation,topic:raw.topic,mode:text(raw.mode,80)||'recognition'};
 if(Structured.active(raw)){
  if(!Structured.validate(raw)||!Array.isArray(raw.accepted)||!raw.accepted.length||raw.accepted.length>100||raw.accepted.some(x=>!text(x,6000)))return null;
  q.accepted=[...new Set(raw.accepted)];q.language='es';
  if(type==='tiles'){q.tiles=raw.tiles.slice();q.tileKind=raw.tileKind;if(raw.solution)q.solution=raw.solution.slice();}
  else q.cloze=JSON.parse(JSON.stringify(raw.cloze));
  if(!Structured.correct(q,Structured.canonical(q))||Structured.normalize(Structured.response(q,Structured.canonical(q)))!==Structured.normalize(q.answer))return null;
 }else if(type==='text'){
  if(!Array.isArray(raw.accepted)||!raw.accepted.length||raw.accepted.length>100)return null;
  if(raw.accepted.some(a=>!text(a,6000)))return null;
  q.accepted=[...new Set(raw.accepted)];q.language=['es','en-or-es'].includes(raw.language)?raw.language:'en-or-es';
 }else if(type==='speaking'){
  if(!text(raw.spanish,6000))return null;q.spanish=raw.spanish;
 }else{
  if(!Array.isArray(raw.options)||raw.options.length<2||raw.options.length>12||raw.options.some(a=>!text(a,6000))||raw.options.filter(a=>a===raw.answer).length!==1||new Set(raw.options.map(E.normalizeAnswer)).size!==raw.options.length)return null;
  q.options=raw.options.slice();
 }
 if(raw.instructionLanguage!==undefined){if(raw.instructionLanguage!=='es'||!text(raw.promptEs,2000)||!text(raw.englishHint,2000)||!safeId(raw.supportConcept))return null;q.instructionLanguage='es';q.promptEs=raw.promptEs;q.englishHint=raw.englishHint;q.supportConcept=raw.supportConcept;}
 if(type==='gap'){if(!text(raw.sentence,2000)||!text(raw.meaning,1000))return null;q.sentence=raw.sentence;q.meaning=raw.meaning;}
 // Optional, visible teaching support belongs to the saved question snapshot.
 // Never rebuild it from the current curriculum when a historical attempt resumes.
 if(object(raw.teachingModel)&&text(raw.teachingModel.spanish,2000)&&text(raw.teachingModel.meaning,2000))q.teachingModel={spanish:raw.teachingModel.spanish,meaning:raw.teachingModel.meaning};
 const fragments=items=>Array.isArray(items)&&items.length<=20?items.filter(x=>text(x,2000)||(object(x)&&text(x.text,2000)&&Number.isInteger(x.start)&&x.start>=0&&x.start<=2000)).map(x=>typeof x==='string'?x:{text:x.text,start:x.start}):null;
 const promptFragments=fragments(raw.spanishFragments);if(promptFragments)q.spanishFragments=promptFragments;
 if(['es','en'].includes(raw.optionsLanguage))q.optionsLanguage=raw.optionsLanguage;
 if(Array.isArray(raw.optionLanguages)&&raw.optionLanguages.length===q.options?.length&&raw.optionLanguages.every(x=>x===null||['es','en'].includes(x)))q.optionLanguages=raw.optionLanguages.slice();
 if(Array.isArray(raw.optionSpanishFragments)&&raw.optionSpanishFragments.length===q.options?.length){const rows=raw.optionSpanishFragments.map(fragments);if(rows.every(x=>x!==null))q.optionSpanishFragments=rows;}
 for(const key of ['id','sourceQuestionId'])if(safeId(raw[key]))q[key]=raw[key];
 if(text(raw.spanish,6000))q.spanish=raw.spanish;
 if(raw.reading!==undefined&&raw.reading!==null){q.reading=reading(raw.reading);if(!q.reading)return null;}
 if(raw.listening){if(!['choice','text','tiles','cloze'].includes(type)||!object(raw.listening)||!text(raw.listening.transcript,2000))return null;q.listening={transcript:raw.listening.transcript,lang:'es-ES',rate:number(raw.listening.rate,.85,1.25)||.85};if(text(raw.listening.audio,250)&&/^audio\/learning\/[a-zA-Z0-9/_-]+\.(mp3|ogg|wav)$/.test(raw.listening.audio))q.listening.audio=raw.listening.audio;}
 if(raw.writing!==undefined){q.writing=W.metadata(raw.writing);if(type!=='text'||!q.writing)return null;}
 if(text(raw.previousResponse,6000))q.previousResponse=raw.previousResponse;
 if(raw.models!==undefined){if(type!=='speaking'||!Array.isArray(raw.models)||!raw.models.length||raw.models.length>3||raw.models.some(x=>!text(x,2000))||raw.models[0]!==q.spanish)return null;q.models=[...new Set(raw.models)];}
 if(raw.practice!==undefined){const p=raw.practice;if(!object(p)||!['listening','speaking'].includes(p.kind)||!['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2'].includes(p.stage)||!Number.isInteger(p.unit)||p.unit<0||p.unit>7||!text(p.category,80)||!text(p.level,80)||!Array.isArray(p.requiredActivities)||!p.requiredActivities.length||p.requiredActivities.length>12||!p.requiredActivities.every(safeId)||!(q.id?.startsWith(p.kind==='listening'?'focus-listen-':'focus-speak-')||q.id?.startsWith('legacy-'))||(p.kind==='listening'?!q.listening:type!=='speaking'))return null;q.practice={kind:p.kind,stage:p.stage,unit:p.unit,category:p.category,level:p.level,...(safeId(p.outcomeId)?{outcomeId:p.outcomeId}:{}),requiredActivities:p.requiredActivities.slice(),authorship:'original Friends to Amigos'};}
 if(q.mode==='listening'&&!q.listening)return null;
 if(Array.isArray(raw.mistakes))q.mistakes=raw.mistakes.filter(m=>object(m)&&text(m.answer,2000)&&text(m.explanation,3000)).map(m=>({answer:m.answer,explanation:m.explanation}));
 return q;
}
const courseIndexes=new WeakMap();function courseIndex(course){if(!courseIndexes.has(course))courseIndexes.set(course,{lessons:new Map(course.lessons.map(l=>[l.id,l])),questions:new Map([...course.lessons.flatMap(l=>l.questions),...course.placement,...course.numbers,...course.time].map(q=>[q.id,q]))});return courseIndexes.get(course);}
function migrateState(raw,course,options={}){
 const warnings=[];if(!object(raw))throw Error('This file is not a progress backup.');
 if(![1,2].includes(raw.version))throw Error(raw.version>VERSION?'This backup needs a newer version of Friends to Amigos.':'Unsupported progress format.');
 if(options.import&&(!Array.isArray(raw.completed)||!Array.isArray(raw.events)||!Array.isArray(raw.capabilities)||!object(raw.sessions)||!object(raw.reviews)))throw Error('This backup is missing essential progress records.');
 const state={version:VERSION,name:text(raw.name,40)||'',onboarded:raw.onboarded===true,stage:course.stages.includes(raw.stage)?raw.stage:'A1.1',placement:null,completed:[],capabilities:[],reviews:{},events:[],sessions:{},active:null,recovery:Array.isArray(raw.recovery)?JSON.parse(JSON.stringify(raw.recovery)):[]};
 state.savedWords=Dictionary.sanitizeSaved(raw.savedWords);
 // Product discovery is not a hint, answer, mastery or SRS record.
 if(raw.dictionaryTipSeen===true)state.dictionaryTipSeen=true;
 const archive=course.legacyQuestions||[],completedEvents=new Set(),current=courseIndex(course).questions;

 function snapshot(rawQuestion){const q=question(rawQuestion),authored=q&&current.get(q.id);return q&&((authored?.reading&&!q.reading)||(authored?.listening&&!q.listening))?null:q;}
 let signatures;
 function identify(q){
  if(safeId(q.id))return q.id;
  if(!signatures){signatures=new Map();for(const old of archive){const key=signature(old);if(!signatures.has(key))signatures.set(key,new Set());signatures.get(key).add(old.sourceQuestionId||old.id);}}
  const ids=[...(signatures.get(signature(q))||[])];
  const candidate=ids.length===1?current.get(ids[0]):null;
  // Wording/variant edits are safe; a replaced teaching target is not the same item.
  return candidate&&candidate.type===q.type&&(!Structured.active(q)||Structured.contract(candidate)===Structured.contract(q))&&E.normalizeAnswer(candidate.answer)===E.normalizeAnswer(q.answer)?ids[0]:'legacy-'+hash(signature(q));
 }
 const quarantine=(kind,key,data)=>{warnings.push('Some damaged '+kind+' data was preserved for recovery.');state.recovery.push({kind,key,data:data===undefined?null:JSON.parse(JSON.stringify(data))});};
 for(const key of ['completed','events','capabilities'])if(raw[key]!==undefined&&!Array.isArray(raw[key]))quarantine('saved records',key,raw[key]);
 for(const key of ['sessions','reviews'])if(raw[key]!==undefined&&!object(raw[key]))quarantine('saved records',key,raw[key]);
 if(raw.stage!==state.stage)warnings.push('An invalid course stage was repaired.');
 state.completed=[...new Set((Array.isArray(raw.completed)?raw.completed:[]).filter(safeId))];
 if(object(raw.placement)&&course.stages.includes(raw.placement.stage)&&Array.isArray(raw.placement.answers)&&raw.placement.answers.every(x=>typeof x==='boolean')&&date(raw.placement.date))state.placement={stage:raw.placement.stage,answers:raw.placement.answers.slice(0,8),date:raw.placement.date};
 for(const c of Array.isArray(raw.capabilities)?raw.capabilities:[]){if(object(c)&&safeId(c.id)&&text(c.text,1000)&&date(c.date)&&!state.capabilities.some(x=>x.id===c.id))state.capabilities.push({id:c.id,text:c.text,date:c.date});}
 for(const [key,s] of Object.entries(object(raw.sessions)?raw.sessions:{})){if(date(key)&&object(s))state.sessions[key]={seconds:number(s.seconds,0,86400),practised:s.practised===true};}
 for(const e of Array.isArray(raw.events)?raw.events:[]){
  if(!object(e)||!date(e.date)||!['answer','lesson','corrected'].includes(e.type))continue;
  const copy={date:e.date,at:number(e.at),type:e.type};
  if(e.type==='answer'){if(typeof e.correct!=='boolean')continue;copy.correct=e.correct;if(text(e.topic,200))copy.topic=e.topic;if(e.selfAssessed===true)copy.selfAssessed=true;if(e.skipped===true)copy.skipped=true;if(e.assisted===true)copy.assisted=true;}
  if(e.type==='lesson'){if(!safeId(e.id)||completedEvents.has(e.id))continue;completedEvents.add(e.id);copy.id=e.id;}
  if(e.type==='corrected'&&text(e.topic,200))copy.topic=e.topic;
  if(safeId(e.questionId))copy.questionId=e.questionId;state.events.push(copy);
 }
 for(const [key,r] of Object.entries(object(raw.reviews)?raw.reviews:{})){
  const q=object(r)?snapshot(r.question):null;if(!q){quarantine('review',key,r);continue;}
  const id=identify(q);q.id=id;
  const record={question:q,topic:text(r.topic,200)||q.topic,wrong:count(r.wrong,1),success:count(r.success),due:number(r.due),corrected:r.corrected===true};
  // Do not overwrite a second valid snapshot with the same claimed ID.
  let target=id;if(Object.prototype.hasOwnProperty.call(state.reviews,target)){const base='legacy-'+hash(key+'|'+signature(q));target=base;let n=1;while(Object.prototype.hasOwnProperty.call(state.reviews,target))target=base+'-copy-'+n++;record.question.id=target;}
  state.reviews[target]=record;
 }
 if(raw.active!==null&&raw.active!==undefined){
  const a=raw.active,qs=object(a)&&Array.isArray(a.questions)?a.questions.map(snapshot):[];
  const valid=object(a)&&a.kind==='lesson'&&object(a.lesson)&&safeId(a.lesson.id)&&text(a.lesson.title,500)&&qs.length>0&&qs.length<=100&&qs.every(Boolean)&&Number.isInteger(a.index)&&a.index>=0&&a.index<=qs.length&&(!a.checked||a.index<qs.length)&&Array.isArray(a.answers)&&a.answers.every((x,i)=>typeof x==='boolean'||x===null&&(qs[i]?.listening||W.open(qs[i])))&&typeof a.checked==='boolean'&&(a.answers.length===a.index+(a.checked?1:0)||a.checked&&W.open(qs[a.index])&&a.answers.length===a.index)&&(a.selected===null||typeof a.selected==='string');
  if(!valid)quarantine('active attempt','active',a);
  else{
   const lesson={id:a.lesson.id,title:a.lesson.title,checkpoint:a.lesson.checkpoint===true};
   const now=courseIndex(course).lessons.get(lesson.id);
   lesson.stage=course.stages.includes(a.lesson.stage)?a.lesson.stage:now?.stage||'A1.1';lesson.unit=Number.isInteger(a.lesson.unit)?a.lesson.unit:now?.unit||0;
   for(const key of ['goal','capability','outcomeId','unitId'])if(text(a.lesson[key],1000))lesson[key]=a.lesson[key];
   if(Array.isArray(a.lesson.questions)){const snapshots=a.lesson.questions.map(snapshot);if(snapshots.every(Boolean)){for(const q of snapshots)q.id=identify(q);lesson.questions=snapshots;}else {quarantine('active attempt','active',a);}}
   if(object(a.lesson.authorship)&&text(a.lesson.authorship.kind,100)&&text(a.lesson.authorship.referenceRecord,300))lesson.authorship={kind:a.lesson.authorship.kind,referenceRecord:a.lesson.authorship.referenceRecord};
   if(a.lesson.reading){lesson.reading=reading(a.lesson.reading);if(!lesson.reading)quarantine('active attempt','active',a);}
   if((!a.lesson.reading||lesson.reading)&&(!Array.isArray(a.lesson.questions)||lesson.questions)){
    for(const q of qs)q.id=identify(q);
    const selected=a.selected===null?null:text(a.selected,6000);const currentQ=qs[a.index];
    const submitted=a.checked?a.answers.at(-1):undefined;
    const pendingWriting=a.checked&&W.open(currentQ)&&a.answers.length===a.index;
    const writingDone=a.checked&&W.open(currentQ)&&submitted===null&&object(a.writingResponses)&&object(a.writingResponses[a.index])&&a.writingResponses[a.index].response===selected&&['got','needs'].includes(a.writingResponses[a.index].reflection);
    const inconsistent=a.checked&&!pendingWriting&&!writingDone&&((currentQ?.listening&&submitted!==null&&a.audioPlayed!==true)||(submitted===null?(!currentQ?.listening||selected!==null):(!selected?.trim()||submitted!==(currentQ?.type==='speaking'?selected==='got':E.isCorrect(currentQ,selected)))));
    if(inconsistent||a.checked&&W.open(currentQ)&&!selected?.trim()||a.checked&&currentQ?.type==='speaking'&&(!a.modelRevealed||!['got','needs'].includes(selected))||selected===null&&a.selected!==null||currentQ&&currentQ.options&&selected!==null&&!currentQ.options.includes(selected)||Structured.active(currentQ)&&selected!==null&&(!Structured.partial(currentQ,selected)||!Structured.ready(currentQ,selected)&&a.checked)||a.checked&&selected===null&&a.answers.at(-1)!==null)quarantine('active attempt','active',a);
    else state.active={kind:'lesson',lesson,questions:qs,index:a.index,answers:a.answers.slice(),selected,checked:a.checked,readingReady:a.readingReady===true,modelRevealed:a.modelRevealed===true,audioPlayed:a.audioPlayed===true,audioUnavailable:a.audioUnavailable===true,...(typeof a.hintRevealed==='boolean'?{hintRevealed:a.hintRevealed}:{}),...(object(a.writingResponses)?{writingResponses:Object.fromEntries(Object.entries(a.writingResponses).filter(([k,v])=>Number.isInteger(Number(k))&&Number(k)>=0&&Number(k)<qs.length&&W.open(qs[Number(k)])&&object(v)&&text(v.response,6000)&&['got','needs'].includes(v.reflection)).map(([k,v])=>[k,{response:v.response,reflection:v.reflection,outcome:W.assess(qs[Number(k)],v.response).outcome}]))}:{})};
   }
  }
 }
 if(typeof raw.onboarded!=='boolean'&&(state.active||state.completed.length)){state.onboarded=true;warnings.push('Your existing learning progress restored the onboarding status.');}
 if(['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2'].includes(raw.grammarLevel))state.grammarLevel=raw.grammarLevel;
 state.startStage=Path.inferStart({...state,startStage:raw.startStage},course);
 if(raw.mastery!==undefined)state.mastery=Mastery.sanitize(raw.mastery);
 if(raw.blanks!==undefined){const result=Blanks.sanitize(raw.blanks,state,course);state.blanks=result.data;if(result.warnings.length)quarantine('table practice','blanks',raw.blanks);}
 if(raw.focused!==undefined){const result=Focused.sanitize(raw.focused,state,course,question);state.focused=result.data;if(result.warnings.length)quarantine('focused practice','focused',raw.focused);}
 if(raw.games!==undefined){const result=Games.sanitize(raw.games,state,course);state.games=result.data;if(result.warnings.length)quarantine('game','games',raw.games);}
 if(options.import&&warnings.some(message=>message.includes('damaged')))throw Error('This backup contains damaged questions or an unsafe unfinished attempt.');
 // Unknown fields never enter runtime state. Quarantine is exported, never rendered as code.
 return {state,warnings:[...new Set(warnings)],migrated:raw.version!==VERSION};
}
function parse(raw,course,options={}){if(typeof raw!=='string'||raw.length>10*1024*1024)throw Error('This progress file is empty or too large.');let value;try{value=JSON.parse(raw);}catch{throw Error('This file is not valid JSON. Your progress has not changed.');}return migrateState(value,course,options);}
function load(storage,course){
 let raw;try{try{raw=storage.getItem(KEY);}catch{throw Error('Device storage could not be read.');}if(!raw)return {state:E.fresh(),warnings:[],readOnly:false};const result=parse(raw,course);return {...result,raw,readOnly:false};}
 catch(error){return {state:E.fresh(),warnings:[error.message+' The original save is kept untouched; export it from Profile before recovery.'],raw,readOnly:true};}
}
function save(storage,state,context={}){if(context.readOnly)return false;try{if(context.migrated&&context.raw&&!storage.getItem(KEY+'-backup-v1'))storage.setItem(KEY+'-backup-v1',context.raw);storage.setItem(KEY,JSON.stringify(state));context.migrated=false;return true;}catch{return false;}}
root.ProgressStore={VERSION,KEY,migrateState,parse,load,save,question,signature};if(typeof module!=='undefined')module.exports=root.ProgressStore;
})(typeof window==='undefined'?globalThis:window);
