'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const app=require('./helpers/app.cjs'),P=require('../www/storage.js'),E=require('../www/engine.js'),C=require('../www/curriculum.js');
const clone=x=>JSON.parse(JSON.stringify(x));
function popup(a){
 a.ctx.document.createElement=tag=>({tagName:tag.toUpperCase(),style:{},dataset:{},hidden:false,innerHTML:'',setAttribute(){},append(){},addEventListener(){},querySelector(){return null;},querySelectorAll(){return [];},getBoundingClientRect(){return {top:0,left:0,bottom:240,right:300,width:300,height:240};},contains(){return false;},remove(){}});
 a.ctx.document.removeEventListener=()=>{};
}
const run=(a,code)=>vm.runInContext(code,a.ctx);
function discover(a,surface='Hola'){popup(a);return run(a,'dictionaryUI.open(D.lookup('+JSON.stringify(surface)+')||{surface:'+JSON.stringify(surface)+'})');}
test('early Unit 0 product tip is visible before answering and is not a hint',()=>{
 const a=app();a.click('begin');assert.match(a.el.innerHTML,/id="dictionary-discovery-tip"/);assert.equal(a.state().active.hintRevealed,false);assert.deepEqual(a.state().events,[]);assert.deepEqual(a.state().reviews,{});
});
test('successful dictionary discovery changes only the optional product flag',()=>{
 const a=app();a.click('begin');const before=clone(a.state()),question=clone(a.current());let removed=0;a.nodes['dictionary-discovery-tip']={remove(){removed++;}};
 assert.equal(discover(a),true);const after=a.state();assert.equal(after.dictionaryTipSeen,true);delete after.dictionaryTipSeen;assert.deepEqual(after,before);assert.deepEqual(clone(a.current()),question);assert.equal(removed,1);assert.equal(run(a,'dictionaryUI.isOpen()'),true);
 a.ctx.FriendsToAmigos.handleBack();assert.equal(run(a,'screen'),'quiz');assert.equal(a.state().active.checked,false);assert.equal(a.state().active.hintRevealed,false);run(a,'render()');assert.doesNotMatch(a.el.innerHTML,/id="dictionary-discovery-tip"/);
});
test('acknowledged product tip stays hidden after resume and schema-v2 import',()=>{
 const a=app();a.click('begin');discover(a);a.ctx.FriendsToAmigos.handleBack();a.click('leave');const save=a.state();const resumed=app({},save);resumed.click('continue');assert.equal(resumed.state().dictionaryTipSeen,true);assert.doesNotMatch(resumed.el.innerHTML,/id="dictionary-discovery-tip"/);
 const migrated=P.parse(JSON.stringify(save),C,{import:true}).state;assert.equal(migrated.dictionaryTipSeen,true);assert.deepEqual(P.migrateState(migrated,C).state,migrated);
});
test('unknown entries do not acknowledge successful dictionary discovery',()=>{
 const a=app();a.click('begin');assert.equal(discover(a,'zznotincoursedict'),true);assert.equal(a.state().dictionaryTipSeen,undefined);run(a,'dictionaryUI.close();render()');assert.match(a.el.innerHTML,/id="dictionary-discovery-tip"/);
});
test('protected saves are unchanged by product discovery',()=>{
 const old={version:99,name:'Preserve original'},a=app({},old);a.click('lesson',{id:'u0l0'});const before=clone(run(a,'state')),raw=a.storage[P.KEY];discover(a);assert.deepEqual(clone(run(a,'state')),before);assert.equal(a.storage[P.KEY],raw);
});
test('optional tip state defaults safely and only explicit true is retained',()=>{
 const base=E.fresh();for(const value of [undefined,false,'true',{},1]){const raw={...base,dictionaryTipSeen:value},out=P.migrateState(raw,C).state;assert.equal(out.dictionaryTipSeen,undefined);for(const key of ['completed','reviews','active','events','capabilities','sessions'])assert.deepEqual(out[key],base[key]);}
 assert.equal(P.migrateState({...base,dictionaryTipSeen:true},C).state.dictionaryTipSeen,true);
});
test('opening teaching models and Spanish boundaries survive save/resume without regeneration',()=>{
 const s=E.fresh(),lesson=C.lessons.find(l=>l.id==='u0l0'),questions=clone(lesson.questions);questions[0].teachingModel={spanish:'Hola.',meaning:'Hello.'};questions[0].spanishFragments=[{text:'Hola',start:0}];questions[0].optionsLanguage='es';questions[0].optionLanguages=questions[0].options.map(()=>null);questions[0].optionSpanishFragments=questions[0].options.map(x=>[x]);
 s.active={kind:'lesson',lesson:clone(lesson),questions,index:0,answers:[],selected:null,checked:false,readingReady:false,hintRevealed:false};const out=P.migrateState(s,C).state;
 for(const field of ['teachingModel','spanishFragments','optionsLanguage','optionLanguages','optionSpanishFragments'])assert.deepEqual(out.active.questions[0][field],questions[0][field]);assert.deepEqual(out.active.questions.map(q=>q.id),questions.map(q=>q.id));assert.deepEqual(P.migrateState(out,C).state,out);
});
test('malformed optional teaching boundaries are discarded without discarding a valid question',()=>{
 const q=clone(C.lessons[0].questions[0]);q.teachingModel={spanish:4,meaning:'x'};q.spanishFragments=[null,2,{text:'Hola',start:-1},'Hola'];q.optionsLanguage='javascript';q.optionLanguages=['xx'];q.optionSpanishFragments=[{}];const out=P.question(q);assert.ok(out);assert.equal(out.id,q.id);assert.equal(out.teachingModel,undefined);assert.deepEqual(out.spanishFragments,['Hola']);assert.equal(out.optionsLanguage,undefined);assert.equal(out.optionLanguages,undefined);assert.equal(out.optionSpanishFragments,undefined);
});
test('an easier replacement task cannot correct an older independent-recall review under the same ID',()=>{
 const s=E.fresh(),old={id:'u0l0-q3',type:'text',prompt:'Write your name.',answer:'Me llamo Ana',accepted:['Me llamo Ana'],topic:'Introductions',explanation:'Give your name.'};E.recordAnswer(s,old,false,1000);const before=clone(s.reviews[old.id]);
 E.recordAnswer(s,C.lessons.find(l=>l.id==='u0l0').questions[2],true,2000);assert.deepEqual(s.reviews[old.id],before);assert.equal(s.events.at(-1).correct,true);assert.equal(s.events.filter(e=>e.type==='corrected').length,0);
 E.recordAnswer(s,old,true,3000);assert.equal(s.reviews[old.id].success,1);assert.ok(s.reviews[old.id].due>3000);assert.deepEqual(s.reviews[old.id].question,before.question);
});
test('a changed target cannot correct an old review but canonical punctuation edits retain scheduling',()=>{
 const s=E.fresh(),old={id:'u0l2-q5',type:'text',prompt:'Ask for repetition.',answer:'¿Puedes repetir, por favor?',accepted:['¿Puedes repetir, por favor?'],topic:'Introductions',explanation:'Ask politely.'};E.recordAnswer(s,old,false,1000);const before=clone(s.reviews[old.id]);
 E.recordAnswer(s,{...old,answer:'Me llamo Luis',accepted:['Me llamo Luis']},true,2000);assert.deepEqual(s.reviews[old.id],before);
 E.recordAnswer(s,{...old,prompt:'Ask someone to say it again.',answer:'puedes repetir por favor'},true,3000);assert.equal(s.reviews[old.id].success,1);assert.ok(s.reviews[old.id].due>3000);assert.deepEqual(s.reviews[old.id].question,before.question);
});
