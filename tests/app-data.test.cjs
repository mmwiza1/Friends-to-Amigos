const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const app=require('./helpers/v12-app.cjs');
const {startAt,escapeHTML,go,locateQuestion,gameLearner,answerGame,finishLesson,tableLearner,fillTable,startFocusedTest,finishFocusedTest}=require('./helpers/app-scenarios.cjs');
test('Android and browser exports round-trip through import with old saved questions',async()=>{
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8')),migrated=app({},legacy).ctx.ProgressStore.migrateState(legacy,app().ctx.Curriculum).state;let json;
 const native=app({AndroidSpeech:{exportProgress:data=>json=data}},legacy);native.click('export');assert.deepEqual(JSON.parse(json),JSON.parse(JSON.stringify(migrated)));
 const browser=app({},legacy);browser.click('export');assert.equal(browser.effects.links[0].download,'friends-to-amigos-progress.json');assert.deepEqual(JSON.parse(await browser.effects.blobs[0].text()),JSON.parse(JSON.stringify(migrated)));
 const target=app();target.click('begin');await target.import(json);assert.deepEqual(target.state(),JSON.parse(JSON.stringify(migrated)));target.click('continue');assert.match(target.el.innerHTML,/Ana y Luis/);
 const cancelled=app({confirm:()=>false},legacy);await cancelled.import({...legacy,name:'Replacement'});assert.equal(cancelled.state().name,legacy.name);
 const invalid=app({},legacy);await invalid.import('{broken');assert.equal(invalid.state().name,legacy.name);assert.ok(invalid.effects.toasts.length>0);
});
test('A1.2 export/import preserves connected answers, old progress and active story state',async()=>{
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8')),a=app({},legacy);a.click('lesson',{id:'a12u7story0'});a.click('readStory');a.answer();a.click('check');a.click('next');a.input('ir a clase');a.click('export');
 const exported=JSON.parse(await a.effects.blobs[0].text()),b=app();await b.import(exported);assert.deepEqual(b.state(),exported);assert.deepEqual(b.state().completed,legacy.completed);assert.deepEqual(b.state().capabilities,legacy.capabilities);b.click('tab',{tab:'Learn'});assert.match(b.el.innerHTML,/data-id="a12u0l0"/);
 b.click('continue');assert.match(b.el.innerHTML,/Un mensaje para Marta/);assert.match(b.el.innerHTML,/value="ir a clase"/);b.click('check');assert.match(b.el.innerHTML,/✓ Correct/);
});
test('completing A1.1 continues into A1.2 without resetting the old stage progress',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.completed=JSON.parse(fs.readFileSync('tests/fixtures/a11-lesson-ids.json','utf8'));
 const a=app({},initial);assert.match(a.el.innerHTML,/A1.2 progress/);assert.match(a.el.innerHTML,/0%/);a.click('continue');assert.equal(a.state().active.lesson.id,'a12u0l0');
 for(let i=0;i<5;i++){a.answer();a.click('check');a.click('next');}assert.equal(a.state().completed.length,73);a.click('home');assert.match(a.el.innerHTML,/1%/);
 a.click('tab',{tab:'Learn'});a.click('viewStage',{stage:'A1.1'});assert.match(a.el.innerHTML,/✓ Discover: Greetings/);
});
test('invalid and newer imports never overwrite existing valid progress or a historical active attempt',async()=>{
 const old=JSON.parse(fs.readFileSync('tests/fixtures/v1-mixed-progress.json','utf8'));const a=app({},old),before=JSON.stringify(a.state());
 for(const damage of [s=>s.version=99,s=>s.active.questions[0].accepted=[],s=>s.reviews.bad={question:null},s=>s.completed={}] ){
  const bad=JSON.parse(JSON.stringify(old));damage(bad);await a.import(bad);assert.equal(JSON.stringify(a.state()),before);
 }
 assert.ok(a.effects.toasts.some(t=>/current progress has not changed/.test(t.textContent)));
});
test('unsupported local schema remains exportable untouched and ordinary app actions cannot erase it',async()=>{
 const old={version:99,futureRecords:{important:true}},a=app({},old);assert.match(a.el.innerHTML,/protected from changes/);a.click('begin');a.answer();a.click('check');assert.deepEqual(a.state(),old);a.click('leave');a.click('export');assert.deepEqual(JSON.parse(await a.effects.blobs[0].text()),old);
});
test('game progress exports and imports through browser and Android without changing main progress',async()=>{
 const a=app({},gameLearner());a.click('tab',{tab:'Games'});a.click('gameNew');answerGame(a);a.click('gameLeave');a.click('export');const json=await a.effects.blobs.at(-1).text();const imported=app();await imported.import(json);assert.deepEqual(imported.state(),a.state());
 let native;const android=app({AndroidSpeech:{exportProgress(json){native=json;}}},a.state());android.click('export');assert.deepEqual(JSON.parse(native),a.state());
});
test('unsafe game import never overwrites current valid progress',async()=>{
 const a=app({},gameLearner()),before=a.state(),damaged=gameLearner();damaged.games={active:{mode:'normal',questions:[]}};await a.import(damaged);assert.deepEqual(a.state(),before);assert.match(a.effects.toasts.at(-1).textContent,/current progress has not changed/);
});
test('Back saves checked table state to Games, resume/import preserves it alongside an unfinished historical lesson',async()=>{const a=app({},tableLearner());a.click('lesson',{id:'u0write'});a.input('historical learner text');a.click('leave');const lesson=a.state().active;a.click('blanksNormal');fillTable(a);const tables=a.state().blanks.active;assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Verb Trainer/);assert.deepEqual(a.state().active,lesson);a.click('blanksResume');assert.deepEqual(a.state().blanks.active,tables);assert.match(a.el.innerHTML,/Well done/);a.click('export');const out=JSON.parse(await a.effects.blobs.at(-1).text()),b=app();await b.import(out);b.click('blanksResume');assert.deepEqual(b.state().blanks.active,tables);assert.deepEqual(b.state().active,lesson);});
test('A2.1 listening stays audio-first before checking, reveals afterwards and resets on spaced review',()=>{const a=app();a.click('lesson',{id:'a21u0l0'});for(let i=0;i<5;i++){a.answer();a.click('check');a.click('next');}assert.ok(a.current().listening);assert.doesNotMatch(a.el.innerHTML,/Hoy he visitado el museo con Marta/);a.answer(false);a.click('check');assert.match(a.el.innerHTML,/Hoy he visitado el museo con Marta/);a.click('leave');a.click('review');assert.doesNotMatch(a.el.innerHTML,/Hoy he visitado el museo con Marta/);assert.equal(a.current().id,'a21u0l0-q6');});
test('focused Back saves its checked snapshot, cancels speech and resumes exactly after reload/import',async()=>{let stops=0;const a=app({AndroidSpeech:{speak(){},stop(){stops++;}}},tableLearner());startFocusedTest(a,'speaking');a.click('revealModel');a.click('selfAssess',{result:'needs'});const snapshot=a.state().focused.active;const n=stops;assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.ok(stops>n);assert.match(a.el.innerHTML,/Continue your saved focused session/);const reload=app({},a.state());reload.click('focusedResume');assert.deepEqual(reload.state().focused.active,snapshot);assert.match(reload.el.innerHTML,/You marked: Needs practice/);reload.click('export');const backup=JSON.parse(await reload.effects.blobs.at(-1).text()),copy=app();await copy.import(backup);copy.click('focusedResume');assert.deepEqual(copy.state().focused.active,snapshot);});
test('damaged focused imports preserve current course progress and valid saved practice',async()=>{const a=app({},tableLearner());startFocusedTest(a,'listening');const good=a.state(),bad=JSON.parse(JSON.stringify(good));bad.focused.active.questions[0].listening.transcript=null;await a.import(bad);assert.deepEqual(a.state(),good);assert.match(a.effects.toasts.at(-1).textContent,/has not changed/);});
test('B focused English support survives leave/resume, reduces evidence and resets on the next item',()=>{const C=require('../www/curriculum'),E=require('../www/engine'),s={...E.fresh(),onboarded:true,completed:C.lessons.map(l=>l.id),stage:'B2.2',grammarLevel:'B2.2'},a=app({},s);a.click('mediaPractice',{kind:'speaking',stage:'B2.2'});for(let n=0;n<10&&!a.current().practice.stage.startsWith('B');n++){a.answer();a.click('next');}const q=a.current();assert.ok(q.practice.stage.startsWith('B'));a.click('englishHint');a.click('leave');const restored=app({},a.state());restored.click('focusedResume');assert.match(restored.el.innerHTML,/English help:/);restored.answer();const state=restored.state();assert.equal(state.mastery.records['skill:'+q.id].assisted,1);assert.equal(state.mastery.records['skill:'+q.id].spaced,0);restored.click('next');if(restored.current())assert.equal(restored.state().focused.active.hintRevealed,false);});
