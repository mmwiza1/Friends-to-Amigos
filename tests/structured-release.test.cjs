'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),crypto=require('node:crypto');
const C=require('../www/curriculum'),E=require('../www/engine'),S=require('../www/structured'),P=require('../www/storage'),W=require('../www/writing'),Policy=require('../www/assessment-policy'),app=require('./helpers/app.cjs');
const baseline=require('./helpers/v12-course.cjs'),clone=x=>JSON.parse(JSON.stringify(x));
const questions=C.lessons.flatMap(l=>l.questions),baseQuestions=baseline.lessons.flatMap(l=>l.questions);
const byStage=stage=>C.lessons.filter(l=>l.stage===stage).flatMap(l=>l.questions);
const run=(a,code)=>vm.runInContext(code,a.ctx);
const stageRows=C.playableStages;
for(const stage of stageRows)test(stage+' retains every activity, identity, target, context and objective while applying its assessment policy',()=>{
 const old=baseline.lessons.filter(l=>l.stage===stage),live=C.lessons.filter(l=>l.stage===stage);
 assert.deepEqual(live.map(l=>l.id),old.map(l=>l.id));
 live.forEach((l,i)=>{assert.equal(l.goal,old[i].goal);assert.deepEqual(l.reading,old[i].reading);assert.deepEqual(l.questions.map(q=>q.id),old[i].questions.map(q=>q.id));l.questions.forEach((q,j)=>{const source=old[i].questions[j];assert.equal(q.answer,source.answer);assert.equal(q.explanation,source.explanation);assert.deepEqual(q.reading,source.reading);assert.deepEqual(q.listening,source.listening);assert.equal(q.sourceQuestionId,source.sourceQuestionId);if(q.type==='text')assert.ok(W.open(q),'A textbox must mean genuine expression: '+q.id);});});
});
test('A1.1–A2.1 have zero graded textboxes and retain active construction, media and checkpoint production',()=>{
 for(const stage of stageRows.slice(0,3)){const qs=byStage(stage);assert.equal(qs.filter(q=>q.type==='text').length,0);assert.ok(qs.filter(S.active).length>=110);assert.ok(qs.some(q=>q.listening));assert.ok(qs.some(q=>q.type==='speaking'));for(const l of C.lessons.filter(l=>l.stage===stage&&l.checkpoint)){assert.ok(l.questions.filter(S.active).length>=3);assert.ok(l.questions.filter(q=>q.language==='es').length>=4);}}
 assert.ok(byStage('A1.1').some(q=>q.type==='gap'));assert.ok(byStage('A1.2').some(q=>q.type==='cloze'));assert.ok(byStage('A2.1').some(q=>q.type==='tiles'&&q.tileKind==='phrase'));
});
test('A2.2 bridges structured work and genuine guided writing; B stages retain expression and structure',()=>{
 for(const stage of stageRows.slice(3)){const qs=byStage(stage);assert.ok(qs.some(q=>q.type==='text'&&W.open(q)&&q.writing.multiline));assert.ok(qs.some(S.active));assert.ok(qs.every(q=>q.type!=='text'||W.open(q)));}
 for(const stage of stageRows.slice(4))assert.ok(byStage(stage).filter(q=>q.type==='text'&&W.open(q)).length>=70);
});
test('A1.1 opening remains supported meaning-first, then builds names before transfer; later goals and 80% stay intact',()=>{
 const l=id=>C.lessons.find(l=>l.id===id);assert.ok(l('u0l0').questions.every(q=>q.teachingModel&&['choice','gap'].includes(q.type)));assert.equal(l('u0l1').questions[4].type,'tiles');assert.equal(l('u0l2').questions[4].type,'tiles');assert.equal(l('u0l2').questions[4].mode,'transfer');
 for(const lesson of C.lessons.filter(l=>l.checkpoint)){const s=E.fresh();E.complete(s,lesson,7,9);assert.ok(!s.completed.includes(lesson.id));E.complete(s,lesson,8,9);E.complete(s,lesson,8,9);assert.deepEqual(s.completed,[lesson.id]);assert.equal(s.capabilities.length,1);}
});
test('the café time question is precise, typed-format instructions disappear and original passages are unchanged',()=>{
 assert.equal(questions.find(q=>q.id==='u0story1-q2').prompt,'What time of day is it when Ana enters the café?');
 for(const l of C.lessons.filter(l=>l.reading&&l.stage.startsWith('A'))){assert.ok(l.questions.every(q=>q.type!=='text'));assert.ok(l.questions.every(q=>q.reading.text===l.reading.text));for(const q of l.questions)assert.doesNotMatch(q.prompt,/A word or number is enough/);}
});
for(const q of questions.filter(S.active))test('structured snapshot/model/answer validity '+q.id,()=>{
 assert.ok(S.validate(q));assert.ok(P.question(q));const answer=S.canonical(q);assert.ok(S.ready(q,answer));assert.ok(E.isCorrect(q,answer));assert.equal(E.normalizeAnswer(S.response(q,answer)),E.normalizeAnswer(q.answer));assert.deepEqual(P.question(q)[q.type==='tiles'?'tiles':'cloze'],q[q.type==='tiles'?'tiles':'cloze']);
 assert.ok(!E.isCorrect(q,'[]'));assert.ok(!E.isCorrect(q,'not json'));assert.ok(!E.isCorrect(q,'[10000]'));
});
test('single/multi-gap, duplicate word/phrase tokens, alternatives and accents remain deterministic and ñ distinct',()=>{
 const base={id:'test-q1',answer:'Me gusta mi casa y mi café.',accepted:['Me gusta mi casa y mi café.'],prompt:'Build',topic:'Home',explanation:'Use me gusta.'};const q=S.tiles(base,'A1.2');assert.equal(q.tiles.filter(t=>t==='mi').length,2);assert.ok(E.isCorrect(q,S.canonical(q)));const bad=S.selection(S.canonical(q));bad[1]=bad[0];assert.ok(!E.isCorrect(q,JSON.stringify(bad)));
 const alt={...q,accepted:[...q.accepted,'Mi casa y mi café me gusta.']};const used=new Set(),order='Mi casa y mi café me gusta'.split(' ').map(t=>{const i=alt.tiles.findIndex((s,j)=>!used.has(j)&&E.normalizeAnswer(s)===E.normalizeAnswer(t));used.add(i);return i;});assert.ok(E.isCorrect(alt,JSON.stringify(order)));
 const accents={...S.tiles({...base,answer:'Tengo veinte años',accepted:['Tengo veinte años']},'A1.1')};const normalized={...accents,tiles:accents.tiles.map(t=>t.replace('veinte','veinte').replace('años','anos'))};assert.ok(!E.isCorrect(normalized,S.canonical(accents)));assert.notEqual(E.normalizeAnswer('año'),E.normalizeAnswer('ano'));const cafe=S.tiles({...base,answer:'Quiero un café',accepted:['Quiero un café']},'A1.1'),without={...cafe,tiles:cafe.tiles.map(t=>t.replace('café','cafe'))};assert.ok(E.isCorrect(without,S.canonical(cafe)));
 const cloze={...base,type:'cloze',cloze:{segments:['Tengo ',' años.'],blanks:[{answer:'veinte',options:['veinte','veintiuno'],explanation:'Twenty is veinte.'}]}};assert.ok(S.validate(cloze));assert.ok(E.isCorrect(cloze,'[0]'));assert.ok(!E.isCorrect(cloze,'[1]'));assert.ok(questions.some(q=>q.type==='cloze'&&q.cloze.blanks.length===3));
});
test('live tiles select, remove, reset, check once and survive unchecked/checked save, leave and import',async()=>{
 const a=app();a.click('lesson',{id:'u0l1'});run(a,'quiz.index=4;quiz.answers=Array(4).fill(true);render()');const q=a.current();assert.equal(q.type,'tiles');const ids=S.selection(S.canonical(q));a.click('tileAdd',{index:String(ids[0])});a.click('tileAdd',{index:String(ids[0])});assert.equal(S.selection(a.state().active.selected).length,1);a.click('tileRemove',{position:'0'});assert.equal(a.state().active.selected,null);a.click('structuredReset');a.click('tileAdd',{index:String(ids[0])});a.click('leave');const b=app({},a.state());b.click('continue');assert.equal(b.current().type,'tiles');assert.equal(S.selection(b.state().active.selected).length,1);for(const index of ids.slice(1))b.click('tileAdd',{index:String(index)});b.click('check');assert.equal(b.state().active.answers.at(-1),true);const count=b.state().events.length;b.click('check');assert.equal(b.state().events.length,count);const c=app({},b.state());c.click('continue');assert.match(c.el.innerHTML,/✓ Correct/);await c.import(b.state());c.click('continue');assert.ok(c.state().active.checked);
});
test('partial multi-gap selections persist; incomplete or playback-locked tasks cannot be checked',()=>{
 const q=questions.find(q=>q.type==='cloze'),l=C.lessons.find(l=>l.questions.includes(q)),a=app();a.click('lesson',{id:l.id});run(a,'quiz.index='+l.questions.indexOf(q)+';quiz.answers=Array(quiz.index).fill(true);render()');a.click('clozePick',{blank:'0',index:String(q.cloze.blanks[0].options.indexOf(q.cloze.blanks[0].answer))});a.click('check');assert.equal(a.state().active.checked,false);a.click('leave');const b=app({},a.state());b.click('continue');assert.equal(S.selection(b.state().active.selected)[1],999);q.cloze.blanks.forEach((blank,i)=>b.click('clozePick',{blank:String(i),index:String(blank.options.indexOf(blank.answer))}));b.click('check');assert.ok(b.state().active.checked);assert.match(b.el.innerHTML,/Gap 1: ✓ Correct/);
});
test('new structured success never clears an old typed review snapshot; original review still corrects normally',()=>{
 const q=questions.find(q=>q.type==='tiles'),old=Policy.prior(q),state=E.fresh();E.recordAnswer(state,old,false,1000);const snapshot=clone(state.reviews[q.id]);E.recordAnswer(state,q,true,2000);assert.equal(state.reviews[q.id].success,0);assert.deepEqual(state.reviews[q.id].question,snapshot.question);const loaded=P.parse(JSON.stringify(state),C,{import:true}).state;assert.deepEqual(loaded.reviews[q.id].question,snapshot.question);E.recordAnswer(loaded,old,true,2000);assert.equal(loaded.reviews[q.id].success,1);assert.equal(loaded.reviews[q.id].due,2000+86400000);
});
test('malformed structured imports are rejected atomically; legacy v1/v2 backups and unfinished text remain usable',()=>{
 const live=questions.find(q=>q.type==='tiles'),l=C.lessons.find(l=>l.questions.includes(live)),state=E.fresh();state.active={kind:'lesson',lesson:l,questions:[live],index:0,answers:[],selected:'[9999]',checked:false};assert.equal(P.migrateState(state,C).state.active,null);assert.throws(()=>P.migrateState(state,C,{import:true}),/damaged/);
 for(const file of ['v1-mixed-progress.json','v2-before-mobile.json','legacy-progress.json']){const old=JSON.parse(fs.readFileSync('tests/fixtures/'+file));const loaded=P.migrateState(old,C).state;assert.deepEqual(loaded.completed,[...new Set(old.completed)]);assert.deepEqual(P.migrateState(loaded,C).state,loaded);if(old.active)assert.equal(loaded.active.questions.length,old.active.questions.length);}
});
test('structured text/feedback escapes HTML, exposes controls separately from dictionary and has no textbox',()=>{
 const q=S.tiles({id:'x',answer:'<script> café',accepted:['<script> café']},'A1.1'),html=S.render(q,null,false,x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'));assert.doesNotMatch(html,/<script>/);assert.doesNotMatch(html,/<input|<textarea/);assert.match(html,/data-dictionary/);assert.match(html,/aria-label="Add/);assert.ok(html.indexOf('</span><button')>0);
});

test('Numbers/Time and new focused listening rounds use controlled interactions; historical focused text remains resumable',()=>{
 assert.ok([...C.numbers,...C.time].every(q=>q.type!=='text'));const F=require('../www/focused-practice'),Bank=require('../www/focused-bank');
 for(const stage of C.playableStages){const state={...E.fresh(),onboarded:true,stage,startStage:stage,completed:C.lessons.map(l=>l.id)},round=F.select(state,C,'listening',stage);assert.equal(round.questions.length,10);assert.ok(round.questions.every(q=>q.type==='choice'));state.focused=F.empty();state.focused.active=round;assert.ok(P.migrateState(state,C).state.focused.active);}
 for(const original of Bank.items.filter(q=>q.type==='text')){const adapted=Policy.media(original,C,Bank.items);assert.equal(adapted.type,'choice');assert.equal(adapted.id,original.id);assert.equal(adapted.answer,original.answer);assert.deepEqual(adapted.listening,original.listening);assert.deepEqual(adapted.practice,original.practice);assert.ok(P.question(adapted));}
});
for(const stage of C.playableStages)test(stage+' live activities actually render, answer, reflect, finish and retry without missing questions',()=>{
 const a=app(),lessons=a.ctx.Curriculum.lessons.filter(l=>l.stage===stage);a.ctx.confirm=()=>true;
 for(const l of lessons){a.click('lesson',{id:l.id});if(l.reading)a.click('readStory');for(let i=0;i<l.questions.length;i++){const q=a.current();assert.equal(q.id,l.questions[i].id);assert.match(a.el.innerHTML,/class="question"/);a.answer();a.click('check');if(W.open(q))a.click('writingReflect',{result:'got'});a.click('next');}assert.ok(a.state().completed.includes(l.id),l.id);assert.equal(a.state().active,null);a.click('retry');assert.equal(a.state().active.index,0);assert.equal(a.current().id,l.questions[0].id);a.click('home');}
});
test('safe familiar time-adjunct alternates are accepted without loosening negation or arbitrary word order',()=>{
 const q=S.tiles({id:'time-order-q1',answer:'Mañana voy al cine.',accepted:['Mañana voy al cine.']},'A1.2'),order=['voy','al','cine','mañana'].map(t=>q.tiles.findIndex(s=>E.normalizeAnswer(s)===t));assert.ok(E.isCorrect(q,JSON.stringify(order)));const neg=S.tiles({id:'time-order-q2',answer:'Hoy no voy al cine.',accepted:['Hoy no voy al cine.']},'A1.2');assert.ok(!neg.accepted.some(s=>E.normalizeAnswer(s)==='voy al cine hoy'));assert.equal(new Set(q.accepted.map(E.normalizeAnswer)).size,q.accepted.length);
});
test('id-less structured snapshots have structural identities and easier replacement scaffolding cannot correct a harder review',()=>{
 const q=S.tiles({id:'structure-q1',answer:'Hoy voy al parque con mis amigos y después como en casa.',accepted:['Hoy voy al parque con mis amigos y después como en casa.'],prompt:'Build',topic:'Plans',explanation:'Connect two actions.'},'A1.1'),phrase=S.tiles(q,'A2.1'),s=E.fresh();assert.notEqual(S.contract(q),S.contract(phrase));E.recordAnswer(s,q,false,1000);E.recordAnswer(s,phrase,true,2000);assert.equal(s.reviews[q.id].success,0);const a={...q},b={...phrase};delete a.id;delete b.id;assert.notEqual(E.reviewKey(a),E.reviewKey(b));assert.notEqual(P.signature(a),P.signature(b));const reordered={...q,tiles:q.tiles.slice().reverse()};E.recordAnswer(s,reordered,true,2000);assert.equal(s.reviews[q.id].success,1);
});
