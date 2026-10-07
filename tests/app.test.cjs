const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const app=require('./helpers/app.cjs');
test('new learner starts, misses a question, sees review and resumes correctly',()=>{
 const a=app();assert.match(a.el.innerHTML,/Start learning/);a.click('continue');assert.match(a.el.innerHTML,/Where shall we begin/);a.click('begin');
 a.answer(false);a.click('check');assert.match(a.el.innerHTML,/Let’s learn from this/);a.click('leave');assert.match(a.el.innerHTML,/Resume lesson/);assert.equal(Object.keys(a.state().reviews).length,1);
 a.click('continue');assert.match(a.el.innerHTML,/Let’s learn from this/);a.click('next');
 for(let i=1;i<5;i++){a.answer(i===1);a.click('check');a.click('next');}
 assert.match(a.el.innerHTML,/Keep building confidence/);assert.equal(a.state().completed.length,0);
 a.click('home');a.click('tab',{tab:'Review'});assert.match(a.el.innerHTML,/4<\/div>/);
});
test('all main tabs, unit goals, phrase support and focused practice render',()=>{
 const a=app();for(const tab of ['Learn','Review','Profile','Home']){a.click('tab',{tab});assert.match(a.el.innerHTML,/Friends to/);}
 a.click('tab',{tab:'Learn'});assert.match(a.el.innerHTML,/introduce yourself/);assert.match(a.el.innerHTML,/Useful phrases/);assert.match(a.el.innerHTML,/celular/i);assert.match(a.el.innerHTML,/La puerta de clase/);
 a.click('numbers');assert.match(a.el.innerHTML,/quince/);a.click('leave');a.click('time');assert.match(a.el.innerHTML,/one o’clock/);
});
test('placement accepts recommended start',()=>{
 const a=app();a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}
 assert.match(a.el.innerHTML,/B2.1/);a.click('acceptPlacement');assert.equal(a.state().stage,'A2.1');assert.match(a.el.innerHTML,/Lessons are not yet available/);assert.match(a.el.innerHTML,/This week so far/);assert.doesNotMatch(a.el.innerHTML,/<option[^>]*>A2.2/);
});
test('answer audio plays once, stops the previous clip and does not replay on resume',()=>{
 const played=[],paused=[];
 class Audio{constructor(src){this.src=src;this.currentTime=0;}play(){played.push(this.src);return Promise.resolve();}pause(){paused.push(this.src);}}
 const a=app({Audio});a.click('begin');a.answer(false);a.click('check');a.click('check');assert.deepEqual(played,['audio/failure.mp3']);
 a.click('leave');a.click('continue');assert.equal(played.length,1);a.click('next');a.answer();a.click('check');
 assert.deepEqual(played,['audio/failure.mp3','audio/success.mp3']);assert.deepEqual(paused,['audio/failure.mp3','audio/failure.mp3','audio/failure.mp3']);
});
test('unavailable audio does not block progress',async()=>{
 class Audio{play(){return Promise.reject(new Error('Playback blocked'));}pause(){}}
 const a=app({Audio});a.click('begin');a.answer(false);a.click('check');await Promise.resolve();
 assert.match(a.el.innerHTML,/Let’s learn from this/);assert.equal(Object.keys(a.state().reviews).length,1);
});
test('five-question lessons show the correct bull result',()=>{
 for(const [correct,mood] of [[true,'happy'],[false,'sad']]){
  const a=app();a.click('begin');for(let i=0;i<5;i++){a.answer(correct);a.click('check');a.click('next');}
  assert.match(a.el.innerHTML,new RegExp('lesson-bull '+mood));
 }
});
test('gap feedback shows the completed sentence and a missed gap survives resume',()=>{
 const a=app();a.click('begin');a.answer();a.click('check');a.click('next');
 assert.match(a.el.innerHTML,/Complete:/);assert.match(a.el.innerHTML,/fills all gaps, in order/);
 a.answer(false);a.click('check');assert.match(a.el.innerHTML.replace(/<\/?mark>/g,''),/Me llamo Ana/);assert.match(a.el.innerHTML,/needs me/);
 const review=Object.values(a.state().reviews)[0];assert.equal(review.question.type,'gap');
 const resumed=app({},a.state());resumed.click('continue');assert.match(resumed.el.innerHTML.replace(/<\/?mark>/g,''),/Me llamo Ana/);
});
test('story reading waits for the learner, provides glossary and supports bilingual short answers',()=>{
 const a=app(),story=a.ctx.Curriculum.lessons.find(l=>l.id==='u0story0');a.click('lesson',{id:story.id});
 assert.match(a.el.innerHTML,/Ready for questions/);assert.match(a.el.innerHTML,/Word help/);assert.doesNotMatch(a.el.innerHTML,/Check answer/);
 a.click('check');assert.equal(a.state().active.answers.length,0);a.click('leave');a.click('continue');assert.match(a.el.innerHTML,/Ready for questions/);
 a.click('readStory');assert.match(a.el.innerHTML,/Read the story again|Volver a leer el texto/);a.answer();a.click('check');a.click('next');
 assert.match(a.el.innerHTML,/Answer in English or Spanish/);a.input('su nombre');a.click('leave');
 const resumed=app({},a.state());resumed.click('continue');assert.match(resumed.el.innerHTML,/value="su nombre"/);resumed.click('check');assert.match(resumed.el.innerHTML,/✓ Correct/);resumed.click('next');
 resumed.answer();resumed.click('check');resumed.click('next');resumed.input('Ana');resumed.click('check');resumed.click('next');resumed.answer();resumed.click('check');resumed.click('next');
 assert.ok(resumed.state().completed.includes(story.id));assert.equal(resumed.state().active,null);
});
test('Spanish production rejects English, teaches the rule and retains context in review',()=>{
 const a=app();a.click('lesson',{id:'u2write'});a.input('a coffee with milk please');a.click('check');assert.match(a.el.innerHTML,/Let’s learn from this/);assert.match(a.el.innerHTML,/masculine/);
 a.click('next');a.input('agua por favor');a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);a.click('leave');a.click('lesson',{id:'u0story0'});a.click('readStory');a.answer(false);a.click('check');a.click('leave');a.click('review');
 a.answer();a.click('check');a.click('next');assert.match(a.el.innerHTML,/Read the story again|Volver a leer el texto/);assert.match(a.el.innerHTML,/Los dos entran en clase/);
});
test('recall answers cannot be heard before answering; both TTS paths remain available afterwards',()=>{
 const spoken=[],a=app({AndroidSpeech:{speak:text=>spoken.push(text)}});a.click('begin');
 for(let i=0;i<2;i++){a.answer();a.click('check');a.click('next');}
 assert.match(a.el.innerHTML,/From memory/);assert.doesNotMatch(a.el.innerHTML,/data-action="speak"/);
 a.answer();a.click('check');assert.match(a.el.innerHTML,/data-action="speak"/);a.click('speak');assert.deepEqual(spoken,['Me llamo Ana']);
 a.click('leave');a.click('lesson',{id:'u0story0'});a.click('speakStory');assert.equal(spoken[1],a.ctx.Curriculum.lessons.find(l=>l.id==='u0story0').reading.text);
 const utterances=[],b=app({SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES'}],cancel(){},speak(u){utterances.push(u);u.onstart?.();}}});
 b.click('begin');b.answer();b.click('check');b.click('speak');assert.equal(utterances[0].lang,'es-ES');assert.equal(utterances[0].text,'Hola');
});
test('empty typed input stays unchecked and checked text cannot be altered',()=>{
 const a=app();a.click('lesson',{id:'u0write'});a.input('   ');a.click('check');assert.equal(a.state().active.answers.length,0);assert.equal(a.nodes['check-answer'].disabled,true);
 a.input('hola soy Ana');assert.equal(a.nodes['check-answer'].disabled,false);a.click('check');a.input('wrong');assert.equal(a.state().active.selected,'hola soy Ana');
});
test('legacy active lessons, reviews, completions, streaks and capabilities survive a content update',()=>{
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8'));const a=app({},legacy);
 a.click('continue');assert.match(a.el.innerHTML,/Ana y Luis/);assert.match(a.el.innerHTML,/value="Inglaterra"/);assert.doesNotMatch(a.el.innerHTML,/La puerta de clase/);
 a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);a.click('leave');
 assert.deepEqual(a.state().completed,legacy.completed);assert.deepEqual(a.state().capabilities,legacy.capabilities);assert.deepEqual(a.state().sessions,legacy.sessions);
 assert.equal(a.state().active.lesson.id,'u0story0');assert.equal(a.state().active.questions[1].prompt,legacy.active.questions[1].prompt);
 const reviewApp=app({},legacy);reviewApp.click('review');assert.match(reviewApp.el.innerHTML,/Ana y Luis/);assert.match(reviewApp.el.innerHTML,/Mi amigo se llama Luis/);
});
test('two-question historical snapshots stay intact and can complete with their stable ID',()=>{
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8'));
 const questions=[{prompt:'Say “Hello”.',answer:'Hola',options:['Hola','Adiós','Gracias'],explanation:'The h in hola is silent.',topic:'Pronunciation',spanish:'Hola'},{prompt:'Say “My name is Ana”.',answer:'Me llamo Ana',options:['Me llamo Ana','Soy llamo Ana','Me llama Ana'],explanation:'Use me llamo.',topic:'Introductions',spanish:'Me llamo Ana'}];
 legacy.completed=[];legacy.active={kind:'lesson',lesson:{id:'u0l0',title:'Old Discover',checkpoint:false},questions,index:0,answers:[],selected:null,checked:false};
 const a=app({},legacy);a.click('continue');assert.equal(a.state().active.questions.length,2);
 for(let i=0;i<2;i++){a.answer();a.click('check');a.click('next');}assert.ok(a.state().completed.includes('u0l0'));
});
test('Android and browser exports round-trip through import with old saved questions',async()=>{
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8')),migrated=app({},legacy).ctx.ProgressStore.migrateState(legacy,app().ctx.Curriculum).state;let json;
 const native=app({AndroidSpeech:{exportProgress:data=>json=data}},legacy);native.click('export');assert.deepEqual(JSON.parse(json),JSON.parse(JSON.stringify(migrated)));
 const browser=app({},legacy);browser.click('export');assert.equal(browser.effects.links[0].download,'friends-to-amigos-progress.json');assert.deepEqual(JSON.parse(await browser.effects.blobs[0].text()),JSON.parse(JSON.stringify(migrated)));
 const target=app();target.click('begin');await target.import(json);assert.deepEqual(target.state(),JSON.parse(JSON.stringify(migrated)));target.click('continue');assert.match(target.el.innerHTML,/Ana y Luis/);
 const cancelled=app({confirm:()=>false},legacy);await cancelled.import({...legacy,name:'Replacement'});assert.equal(cancelled.state().name,legacy.name);
 const invalid=app({},legacy);await invalid.import('{broken');assert.equal(invalid.state().name,legacy.name);assert.ok(invalid.effects.toasts.length>0);
});
test('every revised activity and question renders, completes and can be retried',()=>{
 const a=app();for(const lesson of a.ctx.Curriculum.lessons){
  a.click('lesson',{id:lesson.id});if(lesson.reading)a.click('readStory');
  for(const q of lesson.questions){assert.ok(a.el.innerHTML.includes((q.promptEs||q.prompt).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))));a.answer();a.click('check');assert.match(a.el.innerHTML,q.type==='speaking'?/You marked: I got it|Lo he conseguido/:/✓ Correct/);const roundTrip=a.ctx.ProgressStore.parse(JSON.stringify(a.state()),a.ctx.Curriculum,{import:true}).state;assert.ok(roundTrip.active);assert.equal(roundTrip.active.questions[roundTrip.active.index].id,q.id);assert.equal(roundTrip.active.checked,true);a.click('next');}
  assert.ok(a.state().completed.includes(lesson.id));a.click('retry');assert.equal(a.state().active.lesson.id,lesson.id);a.click('leave');
 }
 assert.equal(new Set(a.state().completed).size,a.ctx.Curriculum.lessons.length);
});
test('course map shows practical future progression without exposing unavailable lessons',()=>{
 const a=app();a.click('tab',{tab:'Learn'});
 for(const stage of a.ctx.Curriculum.stageInfo){assert.ok(a.el.innerHTML.includes(stage.goal));for(const task of stage.tasks)assert.ok(a.el.innerHTML.includes(task));}
 assert.equal((a.el.innerHTML.match(/data-action="lesson"/g)||[]).length,72);
 assert.equal((a.el.innerHTML.match(/Lessons are not yet available/g)||[]).length,5);
});
test('practical goals appear in regular lessons and stories and survive legacy resume',()=>{
 const a=app();a.click('lesson',{id:'u2write'});assert.match(a.el.innerHTML,/Your practical goal/);assert.match(a.el.innerHTML,/Order a simple breakfast/);
 a.click('leave');a.click('lesson',{id:'u6story0'});assert.match(a.el.innerHTML,/follow a simple direction/);a.click('readStory');assert.match(a.el.innerHTML,/Your practical goal/);
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8')),resumed=app({},legacy);resumed.click('continue');assert.match(resumed.el.innerHTML,/Your practical goal/);assert.match(resumed.el.innerHTML,/Introduce yourself/);
});
test('stage selector switches both playable courses and never launches planned stages',()=>{
 const a=app();a.click('tab',{tab:'Learn'});assert.match(a.el.innerHTML,/data-id="u0l0"/);assert.doesNotMatch(a.el.innerHTML,/data-id="a12/);
 a.click('viewStage',{stage:'A1.2'});assert.match(a.el.innerHTML,/data-id="a12u0l0"/);assert.match(a.el.innerHTML,/Free time &amp; preferences/);assert.doesNotMatch(a.el.innerHTML,/data-id="u0l0"/);
 assert.equal((a.el.innerHTML.match(/data-action="lesson"/g)||[]).length,72);
 const before=a.el.innerHTML;a.click('viewStage',{stage:'A2.2'});a.click('lesson',{id:'a22u0l0'});assert.equal(a.el.innerHTML,before);
 a.click('viewStage',{stage:'A1.1'});assert.match(a.el.innerHTML,/data-id="u0l0"/);
 const saved=a.ctx.Engine.fresh();saved.stage='A1.2';const loaded=app({},saved);loaded.click('tab',{tab:'Learn'});assert.match(loaded.el.innerHTML,/data-id="a12u0l0"/);
});
test('A1.2 story responses survive resume and missed comprehension retains its passage in review',()=>{
 const a=app();a.click('lesson',{id:'a12u5story1'});assert.match(a.el.innerHTML,/Las llaves de Luis/);assert.match(a.el.innerHTML,/Word help/);assert.match(a.el.innerHTML,/help a visitor/);
 a.click('readStory');a.answer();a.click('check');a.click('next');a.input('un libro');a.click('leave');
 const resumed=app({},a.state());resumed.click('continue');assert.match(resumed.el.innerHTML,/value="un libro"/);resumed.click('check');assert.match(resumed.el.innerHTML,/✓ Correct/);resumed.click('next');resumed.answer(false);resumed.click('check');resumed.click('leave');resumed.click('review');assert.match(resumed.el.innerHTML,/Read the story again|Volver a leer el texto/);assert.match(resumed.el.innerHTML,/No encuentro mis llaves/);
});
test('A1.2 plan feedback teaches missing a and does not reveal the recall model early',()=>{
 const a=app();a.click('lesson',{id:'a12u2l0'});for(let i=0;i<2;i++){a.answer();a.click('check');a.click('next');}
 assert.doesNotMatch(a.el.innerHTML,/data-action="speak"/);a.input('Voy leer mañana');a.click('check');assert.match(a.el.innerHTML,/Keep a between voy/);assert.match(a.el.innerHTML,/data-action="speak"/);
});
test('all A1.2 checkpoints fail at seven, pass at eight and never duplicate capabilities',()=>{
 const a=app();for(const lesson of a.ctx.Curriculum.lessons.filter(l=>l.stage==='A1.2'&&l.checkpoint)){
  a.click('lesson',{id:lesson.id});for(let i=0;i<9;i++){a.answer(i<7);a.click('check');a.click('next');}assert.ok(!a.state().completed.includes(lesson.id));
  a.click('retry');for(let i=0;i<9;i++){a.answer(i<8);a.click('check');a.click('next');}assert.ok(a.state().completed.includes(lesson.id));
  a.click('retry');for(let i=0;i<9;i++){a.answer();a.click('check');a.click('next');}assert.equal(a.state().capabilities.filter(c=>c.id===lesson.id).length,1);
 }
 assert.equal(a.state().capabilities.length,8);assert.equal(a.state().events.filter(e=>e.type==='lesson').length,8);
});
test('A1.2 export/import preserves connected answers, old progress and active story state',async()=>{
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8')),a=app({},legacy);a.click('lesson',{id:'a12u7story0'});a.click('readStory');a.answer();a.click('check');a.click('next');a.input('ir a clase');a.click('export');
 const exported=JSON.parse(await a.effects.blobs[0].text()),b=app();await b.import(exported);assert.deepEqual(b.state(),exported);assert.deepEqual(b.state().completed,legacy.completed);assert.deepEqual(b.state().capabilities,legacy.capabilities);b.click('tab',{tab:'Learn'});assert.match(b.el.innerHTML,/data-id="a12u0l0"/);
 b.click('continue');assert.match(b.el.innerHTML,/Un mensaje para Marta/);assert.match(b.el.innerHTML,/value="ir a clase"/);b.click('check');assert.match(b.el.innerHTML,/✓ Correct/);
});
test('placement recommendations offer only implemented courses and chosen A1.2 starts there',()=>{
 const a=app();a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}
 assert.match(a.el.innerHTML,/B2.1/);assert.match(a.el.innerHTML,/remain unavailable/);assert.doesNotMatch(a.el.innerHTML,/<option[^>]*>A2.2|<option[^>]*>B/);
 a.nodes.stage.value='A1.2';a.click('acceptPlacement');assert.equal(a.state().stage,'A1.2');a.click('home');a.click('continue');assert.equal(a.state().active.lesson.id,'a12u0l0');
});
test('completing A1.1 continues into A1.2 without resetting the old stage progress',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.completed=JSON.parse(fs.readFileSync('tests/fixtures/a11-lesson-ids.json','utf8'));
 const a=app({},initial);assert.match(a.el.innerHTML,/A1.2 progress/);assert.match(a.el.innerHTML,/0%/);a.click('continue');assert.equal(a.state().active.lesson.id,'a12u0l0');
 for(let i=0;i<5;i++){a.answer();a.click('check');a.click('next');}assert.equal(a.state().completed.length,73);a.click('home');assert.match(a.el.innerHTML,/1%/);
 a.click('tab',{tab:'Learn'});a.click('viewStage',{stage:'A1.1'});assert.match(a.el.innerHTML,/✓ Discover: Greetings/);
});
test('historical future-stage recommendations stay valid and fall back to playable content',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.stage='B2.1';const a=app({},initial);a.click('continue');assert.equal(a.state().active.lesson.stage,'A1.1');assert.equal(a.state().stage,'B2.1');
});
function startAt(a,lesson,index){a.click('lesson',{id:lesson.id});for(let i=0;i<index;i++){a.answer();a.click('check');a.click('next');}}
const escapeHTML=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
test('all 48 listening transcripts are absent from the initial DOM and revealed only after submission',()=>{
 const heard=[],a=app({AndroidSpeech:{speak:text=>heard.push(text)}});for(const l of a.ctx.Curriculum.lessons)for(let i=0;i<l.questions.length;i++)if(l.questions[i].listening){
  startAt(a,l,i);const q=a.current();assert.doesNotMatch(a.el.innerHTML,/Spanish transcript|Texto del audio/);assert.ok(!a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));
  a.click('check');assert.equal(a.state().active.checked,false);a.click('next');assert.equal(a.current().id,q.id);
  a.answer();assert.ok(!a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));a.click('check');assert.match(a.el.innerHTML,/Spanish transcript|Texto del audio/);assert.ok(a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));assert.ok(heard.includes(q.listening.transcript));
 }
});
test('listening plays on browser speech path and replay does not inflate answer statistics',()=>{
 const played=[],a=app({SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak:u=>{played.push(u);u.onstart?.();}}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='a12u1l2');startAt(a,l,5);
 a.click('answer',{index:'0'});assert.equal(a.state().active.selected,null);a.click('listen');a.click('listen');assert.equal(played.length,2);assert.equal(played[0].lang,'es-ES');assert.equal(played[0].rate,.75);
 a.answer();a.click('check');const count=a.state().events.length;a.click('listen');a.click('check');assert.equal(a.state().events.length,count);
});
test('skipped unavailable listening reveals context and queues a scored miss for later review',()=>{
 const a=app({speechSynthesis:null}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='u1l1');startAt(a,l,5);const q=a.current();a.click('listen');assert.match(a.el.innerHTML,/Audio is unavailable/);a.click('skipListening');assert.match(a.el.innerHTML,/Listening saved for review/);assert.equal(a.state().active.answers.at(-1),null);assert.equal(a.state().events.at(-1).skipped,true);assert.equal(a.state().reviews[q.id].question.listening.transcript,q.listening.transcript);
 const b=app({},a.state());b.click('continue');assert.match(b.el.innerHTML,/Spanish transcript|Texto del audio/);b.click('next');assert.match(b.el.innerHTML,/5 of 6 correct/);assert.ok(b.state().completed.includes(l.id));
});
test('unanswered and checked listening reveal states survive save/resume and review hides again',()=>{
 const a=app({AndroidSpeech:{speak(){}}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='u0l1');startAt(a,l,5);a.click('listen');a.click('leave');
 const b=app({AndroidSpeech:{speak(){}}},a.state());b.click('continue');assert.doesNotMatch(b.el.innerHTML,/Spanish transcript|Texto del audio/);assert.equal(b.state().active.audioPlayed,true);b.answer(false);b.click('check');b.click('leave');
 const c=app({},b.state());c.click('continue');assert.match(c.el.innerHTML,/Spanish transcript|Texto del audio/);c.click('leave');c.click('review');assert.doesNotMatch(c.el.innerHTML,/Spanish transcript|Texto del audio/);c.click('skipListening');assert.match(c.el.innerHTML,/Spanish transcript|Texto del audio/);
});
test('speaking requires deliberate reveal, has no automatic grading and needs-practice enters spaced review',()=>{
 const heard=[],a=app({AndroidSpeech:{speak:text=>heard.push(text)}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='a12u2l2');startAt(a,l,6);heard.length=0;const q=a.current();assert.match(a.el.innerHTML,/self-assessed|Tú evalúas/);assert.ok(!a.el.innerHTML.includes(escapeHTML(q.spanish)));
 a.click('selfAssess',{result:'got'});a.click('speak');a.click('check');assert.equal(a.state().active.checked,false);assert.equal(heard.length,0);
 a.click('revealModel');assert.ok(a.el.innerHTML.includes(escapeHTML(q.spanish)));a.click('speak');assert.deepEqual(heard,[q.spanish]);a.click('selfAssess',{result:'needs'});a.click('selfAssess',{result:'got'});assert.equal(a.state().events.filter(e=>e.questionId===q.id).length,1);assert.equal(a.state().events.at(-1).selfAssessed,true);assert.ok(a.state().reviews[q.id]);a.click('next');assert.match(a.el.innerHTML,/6 of 6 correct/);assert.ok(a.state().completed.includes(l.id));
 a.click('home');a.click('review');assert.equal(a.current().type,'speaking');assert.ok(!a.el.innerHTML.includes(escapeHTML(q.spanish)));a.click('revealModel');a.click('selfAssess',{result:'got'});assert.equal(a.state().reviews[q.id].success,1);a.click('next');a.click('retry');a.click('revealModel');a.click('selfAssess',{result:'got'});assert.equal(a.state().reviews[q.id].success,1);
});
test('speaking model/self-assessment snapshots resume in both stages',()=>{
 for(const id of ['u0l2','a12u6l2']){const a=app(),l=a.ctx.Curriculum.lessons.find(l=>l.id===id);startAt(a,l,6);a.click('revealModel');a.click('leave');const b=app({},a.state());b.click('continue');assert.match(b.el.innerHTML,/One possible response|Una respuesta posible/);assert.equal(b.state().active.modelRevealed,true);b.click('selfAssess',{result:'got'});b.click('leave');const c=app({},b.state());c.click('continue');assert.match(c.el.innerHTML,/You marked: I got it|Lo he conseguido/);c.click('next');assert.ok(c.state().completed.includes(id));}
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
test('complete A1 home celebrates capabilities, review and practice while offering the playable A2.1 continuation',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.completed=JSON.parse(fs.readFileSync('tests/fixtures/a1-activity-ids.json','utf8'));initial.sessions['2026-10-05']={seconds:120,practised:true};
 const a=app({},initial);assert.match(a.el.innerHTML,/completed the Friends to Amigos A1 course/);assert.match(a.el.innerHTML,/144 activities completed/);assert.match(a.el.innerHTML,/2 minutes practised/);assert.match(a.el.innerHTML,/not formal CEFR certification/);assert.match(a.el.innerHTML,/Continue to A2.1/);assert.match(a.el.innerHTML,/Listening practice/);assert.match(a.el.innerHTML,/Speak aloud/);assert.doesNotMatch(a.el.innerHTML,/data-stage="A2.2/);
 a.click('mediaPractice',{kind:'speaking',stage:'A1.2'});for(let i=0;i<10;i++){a.answer();a.click('next');}assert.match(a.el.innerHTML,/self-assessed|Tú evalúas/);assert.equal(a.state().completed.length,144);assert.equal(a.state().capabilities.length,0);
 a.click('home');a.click('mediaPractice',{kind:'listening',stage:'A2.2'});assert.match(a.el.innerHTML,/completed the Friends/);
});
test('completion practice recycles less recently retrieved familiar chunks rather than always the first ten',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.completed=JSON.parse(fs.readFileSync('tests/fixtures/a1-activity-ids.json','utf8'));const a=app({},initial);a.click('mediaPractice',{kind:'speaking',stage:'A1.1'});const first=[];for(let i=0;i<10;i++){first.push(a.current().id);a.answer();a.click('next');}a.click('home');a.click('mediaPractice',{kind:'speaking',stage:'A1.1'});assert.ok(!first.includes(a.current().id));
});
test('all 24 checkpoints assess listening and pass at eight of nine without duplicate completion events',()=>{
 const a=app();for(const l of a.ctx.Curriculum.lessons.filter(l=>l.checkpoint)){
  a.click('lesson',{id:l.id});for(let i=0;i<9;i++){a.answer(i<7);a.click('check');a.click('next');}assert.ok(!a.state().completed.includes(l.id));a.click('retry');for(let i=0;i<9;i++){a.answer(i<8);a.click('check');a.click('next');}assert.ok(a.state().completed.includes(l.id));assert.equal(a.state().capabilities.filter(c=>c.id===l.id).length,1);
 }
 assert.equal(a.state().events.filter(e=>e.type==='lesson').length,24);
});
test('a valid historical attempt can resume even with an explicit incomplete onboarding flag',()=>{
 const old=JSON.parse(fs.readFileSync('tests/fixtures/v1-mixed-progress.json','utf8'));old.onboarded=false;const a=app({},old);assert.match(a.el.innerHTML,/Resume lesson/);a.click('continue');assert.equal(a.current().prompt,old.active.questions[old.active.index].prompt);assert.equal(a.state().onboarded,false);
});
test('native background/resume events stop media and exclude background time from learning statistics',()=>{
 let time=Date.parse('2026-10-06T12:00:00Z'),stopped=0;class Clock extends Date{constructor(...args){super(...(args.length?args:[time]));}static now(){return time;}}
 const a=app({Date:Clock,AndroidSpeech:{stop(){stopped++;}}});a.click('begin');time+=5000;a.lifecycle['fta-pause']();const seconds=Object.values(a.state().sessions).reduce((n,s)=>n+s.seconds,0);assert.equal(seconds,5);assert.ok(stopped>0);
 time+=3600000;a.ctx.tick();assert.equal(Object.values(a.state().sessions).reduce((n,s)=>n+s.seconds,0),5);a.lifecycle['fta-resume']();a.click('answer',{index:'0'});time+=2000;a.ctx.tick();assert.equal(Object.values(a.state().sessions).reduce((n,s)=>n+s.seconds,0),7);assert.equal(a.state().active.index,0);
});
test('unavailable listening cannot be guessed for credit; only retry or an explicit missed skip is allowed',()=>{
 const a=app({AndroidSpeech:{isReady:()=>false,speak(){throw Error('should not speak');}}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='u0l1');startAt(a,l,5);a.click('listen');a.click('answer',{index:'0'});a.click('check');assert.equal(a.state().active.selected,null);assert.equal(a.state().active.checked,false);assert.equal(a.state().active.answers.length,5);a.click('skipListening');assert.equal(a.state().active.answers.at(-1),null);assert.match(a.el.innerHTML,/Spanish transcript|Texto del audio/);
});

test('system back saves lessons and returns secondary screens and tabs before allowing Home exit',()=>{
 const a=app(),back=()=>a.ctx.FriendsToAmigos.handleBack();assert.equal(back(),false);
 for(const tab of ['Learn','Review','Profile']){a.click('tab',{tab});assert.equal(back(),true);assert.match(a.el.innerHTML,/Today’s session/);assert.equal(back(),false);}
 a.click('tab',{tab:'Profile'});a.click('achievements');assert.equal(back(),true);assert.match(a.el.innerHTML,/Your profile/);assert.equal(back(),true);assert.equal(back(),false);
 a.click('topic',{topic:'Greetings'});assert.equal(back(),true);assert.match(a.el.innerHTML,/Today’s session/);
 a.click('lesson',{id:'u0write'});a.input('hola soy Ana');const before=a.state().active;assert.equal(back(),true);assert.deepEqual(a.state().active,before);assert.equal(back(),false);a.click('continue');assert.match(a.el.innerHTML,/value="hola soy Ana"/);a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);
});
test('system back handles review, focused practice, placement and placement result without losing a saved lesson',()=>{
 const a=app();a.click('begin');a.answer(false);a.click('check');a.click('leave');const saved=a.state().active;
 a.click('tab',{tab:'Review'});a.click('review');assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Review & grow/);assert.deepEqual(a.state().active,saved);
 a.click('topic',{topic:'Greetings'});a.click('startPractice');assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Short practice to strengthen/);assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);
 a.click('numbers');assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.deepEqual(a.state().active,saved);
 a.click('tab',{tab:'Profile'});a.click('placement');assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Your profile/);
 a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}assert.match(a.el.innerHTML,/Your suggested starting point/);assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Your profile/);assert.deepEqual(a.state().active,saved);
});
test('listening controls wait for a real browser start, propagate selected speed and reject stale start callbacks',()=>{
 const played=[],a=app({speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak:u=>played.push(u)}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='u0l1');startAt(a,l,5);a.click('listen');assert.equal(a.state().active.audioPlayed,false);a.answer();a.click('check');assert.equal(a.state().active.checked,false);assert.equal(played.length,1);
 played[0].onerror();assert.match(a.el.innerHTML,/Audio is unavailable/);assert.equal(a.state().active.audioPlayed,false);
 const eventCount=a.state().events.length;a.click('listenSpeed',{rate:'1'});assert.equal(a.state().events.length,eventCount);a.click('listen');assert.equal(played[1].rate,1);assert.match(a.el.innerHTML,/Starting audio/);played[1].onstart();assert.equal(a.state().active.audioPlayed,true);assert.doesNotMatch(a.el.innerHTML,/Spanish transcript|Texto del audio/);a.answer();played.at(-1).onstart();a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);
 a.click('next');a.click('home');a.click('lesson',{id:'u1l1'});startAt(a,a.ctx.Curriculum.lessons.find(l=>l.id==='u1l1'),5);a.click('listen');const stale=played.at(-1);a.click('leave');a.click('begin');stale.onstart();assert.equal(a.state().active.audioPlayed,false);assert.equal(a.state().active.lesson.id,'u0l0');
});
test('bundled playback rejection never unlocks answers; successful TTS fallback does',async()=>{
 let reject,utterance;class Audio{pause(){}play(){return new Promise((_,r)=>reject=r);}}
 const a=app({Audio,speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak:u=>utterance=u}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='u0l1');startAt(a,l,5);vm.runInContext("quiz.questions[quiz.index].listening.audio='audio/learning/sample.mp3'",a.ctx);a.click('listen');assert.equal(a.state().active.audioPlayed,false);reject(Error('missing'));await Promise.resolve();assert.equal(a.state().active.audioPlayed,false);utterance.onerror();assert.equal(a.state().active.audioPlayed,false);a.answer();a.click('check');assert.equal(a.state().active.checked,false);
 // Retry the same recording: only the fallback onstart grants access.
 reject(Error('missing'));await Promise.resolve();utterance.onstart();assert.equal(a.state().active.audioPlayed,true);a.input(a.current().accepted?.[0]||a.current().answer);if(a.current().options)a.click('answer',{index:String(a.current().options.indexOf(a.current().answer))});a.click('check');assert.equal(a.state().active.checked,true);
});
test('A1.2 placement completes its required path with accurate counts, optional A1.1 revision and no fabricated rewards',()=>{
 const a=app();a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}a.nodes.stage.value='A1.2';a.click('acceptPlacement');assert.equal(a.state().startStage,'A1.2');assert.equal(a.state().completed.length,0);assert.equal(a.state().capabilities.length,0);assert.equal(a.state().events.filter(e=>e.type==='lesson').length,0);
 const initial=a.state();initial.completed=a.ctx.Curriculum.lessons.filter(l=>l.stage==='A1.2').map(l=>l.id);const completed=app({},initial);assert.match(completed.el.innerHTML,/completed the Friends to Amigos A1 course/);assert.match(completed.el.innerHTML,/72 activities completed/);assert.match(completed.el.innerHTML,/earlier foundations were assumed/);completed.click('continue');assert.equal(completed.state().active.lesson.id,'a21u0l0');assert.doesNotMatch(completed.el.innerHTML,/data-id="u0l0"/);
 completed.click('tab',{tab:'Learn'});completed.click('viewStage',{stage:'A1.1'});completed.click('lesson',{id:'u0l0'});for(let i=0;i<5;i++){completed.answer();completed.click('check');completed.click('next');}completed.click('home');assert.match(completed.el.innerHTML,/73 activities completed/);assert.equal(completed.state().startStage,'A1.2');completed.click('continue');assert.equal(completed.state().active.lesson.id,'a21u0l0');
});
test('Today guides due reviews then next lesson then one media item through existing progress systems',()=>{
 const seed=app(),s=seed.ctx.Engine.fresh();s.onboarded=true;seed.ctx.Engine.recordAnswer(s,seed.ctx.Curriculum.lessons[0].questions[0],false);const a=app({},s);a.click('today');assert.equal(a.current().id,seed.ctx.Curriculum.lessons[0].questions[0].id);a.answer();a.click('check');a.click('next');assert.match(a.el.innerHTML,/Continue today’s session/);a.click('todayNext');assert.equal(a.state().active.lesson.id,'u0l0');for(let i=0;i<5;i++){a.answer();a.click('check');a.click('next');}a.click('todayNext');const q=a.current();assert.ok(q.listening||q.type==='speaking');a.answer();a.click('check');a.click('next');assert.match(a.el.innerHTML,/Finish today’s session/);a.click('todayNext');assert.match(a.el.innerHTML,/Today’s session/);assert.deepEqual(a.state().completed,['u0l0']);assert.equal(a.state().reviews[s.reviews[Object.keys(s.reviews)[0]].question.id].success,1);
});
test('Today skips absent reviews, respects A1.2 placement, and maintains completed courses without new lessons',()=>{
 const seed=app();for(const stage of ['A1.1','A1.2']){const s=seed.ctx.Engine.fresh();s.onboarded=true;s.startStage=stage;s.stage=stage;const a=app({},s);a.click('today');assert.equal(a.state().active.lesson.stage,stage);assert.equal(a.current().id,seed.ctx.Curriculum.lessons.find(l=>l.stage===stage).questions[0].id);}
 const s=seed.ctx.Engine.fresh();s.onboarded=true;s.startStage='A1.2';s.stage='A1.2';s.completed=seed.ctx.Curriculum.lessons.filter(l=>l.stage==='A1.2').map(l=>l.id);const a=app({},s);a.click('today');assert.equal(a.state().active.lesson.id,'a21u0l0');assert.equal(a.state().completed.length,72);
});
test('Today resumes the exact unfinished snapshot before due reviews or new material',()=>{
 const a=app();a.click('lesson',{id:'u2write'});a.input('un café con leche');a.click('leave');const saved=a.state().active;assert.match(a.el.innerHTML,/Resume your saved lesson/);a.click('today');assert.deepEqual(a.state().active,saved);assert.match(a.el.innerHTML,/value="un café con leche"/);assert.equal(a.current().id,saved.questions[saved.index].id);
});
test('question progress uses current position with accurate labels and never exceeds the final question',()=>{
 const a=app();a.click('begin');assert.match(a.el.innerHTML,/<progress aria-label="Question 1 of 5" max="5" value="1"/);for(let i=0;i<4;i++){a.answer();a.click('check');a.click('next');}assert.match(a.el.innerHTML,/<progress aria-label="Question 5 of 5" max="5" value="5"/);a.click('leave');a.click('lesson',{id:'u0story0'});assert.doesNotMatch(a.el.innerHTML,/<progress/);a.click('readStory');assert.match(a.el.innerHTML,/Question 1 of 5/);
});

test('Today maintains the final chapter for a normal A1.1 graduate instead of returning only to beginner chunks',()=>{
 const seed=app(),s=seed.ctx.Engine.fresh();s.onboarded=true;s.completed=seed.ctx.Curriculum.lessons.map(l=>l.id);const a=app({},s);a.click('today');assert.ok(a.current().id.startsWith('a21'));assert.equal(a.state().active,null);assert.equal(a.state().completed.length,216);
});

function go(a,value,details={}){return a.key('Enter',{target:{id:'written-answer',value},...details});}
function locateQuestion(a,predicate){
 for(const lesson of a.ctx.Curriculum.lessons){const index=lesson.questions.findIndex(predicate);if(index>=0){a.click('lesson',{id:lesson.id});if(lesson.reading)a.click('readStory');for(let i=0;i<index;i++){a.answer();a.click('check');a.click('next');}return a.current();}}
 throw new Error('No authored question matched the test scenario');
}
test('written answers advertise Go and Enter follows the same correct scoring flow as Check answer',()=>{
 const keyboard=app(),button=app();keyboard.click('lesson',{id:'u0write'});button.click('lesson',{id:'u0write'});
 assert.match(keyboard.el.innerHTML,/id="written-answer"[^>]*enterkeyhint="go"/);
 const value=keyboard.current().accepted[0];assert.equal(go(keyboard,value),true);button.input(value);button.click('check');
 assert.match(keyboard.el.innerHTML,/✓ Correct/);assert.deepEqual(keyboard.state().active,button.state().active);
 assert.equal(keyboard.state().events.filter(e=>e.type==='answer').length,1);assert.equal(keyboard.state().events.at(-1).correct,true);
 assert.equal(Object.keys(keyboard.state().reviews).length,0);
});
test('empty Go leaves the text question and saved attempt untouched without a rerender',()=>{
 const a=app();a.click('lesson',{id:'u0write'});a.input('   ');const before=JSON.stringify(a.state()),html=a.el.innerHTML;
 for(const value of ['', '   ', '\t'])assert.equal(go(a,value),true);
 assert.equal(JSON.stringify(a.state()),before);assert.equal(a.el.innerHTML,html);assert.equal(a.state().active.checked,false);
});
test('Enter cannot submit an already checked question or overwrite its learner answer',()=>{
 const a=app();a.click('lesson',{id:'u0write'});const value=a.current().accepted[0];go(a,value);const before=JSON.stringify(a.state()),html=a.el.innerHTML;
 for(let i=0;i<3;i++)go(a,'different response');assert.equal(JSON.stringify(a.state()),before);assert.equal(a.el.innerHTML,html);
 assert.equal(a.state().active.selected,value);assert.equal(a.state().active.answers.length,1);
});
test('IME composition, repeat and non-Enter keys do not submit written answers',()=>{
 const a=app();a.click('lesson',{id:'u0write'});const value=a.current().accepted[0],before=JSON.stringify(a.state());
 assert.equal(go(a,value,{isComposing:true}),false);assert.equal(go(a,value,{keyCode:229}),false);assert.equal(go(a,value,{repeat:true}),false);
 assert.equal(a.key('a',{target:{id:'written-answer',value}}),false);assert.equal(JSON.stringify(a.state()),before);
 assert.equal(go(a,value,{keyCode:13}),true);assert.equal(a.state().active.answers.length,1);assert.match(a.el.innerHTML,/✓ Correct/);
});
test('Go remains locked for a listening text question until audio genuinely starts',()=>{
 const played=[],a=app({speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak:u=>played.push(u)}});
 const q=locateQuestion(a,q=>q.type==='text'&&q.listening),value=q.accepted[0],before=JSON.stringify(a.state());
 assert.match(a.el.innerHTML,/Listen, then write your answer/);assert.match(a.el.innerHTML,/id="written-answer"[^>]*disabled/);
 go(a,value);assert.equal(JSON.stringify(a.state()),before);a.click('listen');go(a,value);assert.equal(a.state().active.checked,false);
 played.at(-1).onstart();go(a,value);assert.equal(a.state().active.checked,true);assert.match(a.el.innerHTML,/✓ Correct/);
 assert.equal(a.state().events.filter(e=>e.questionId===q.id).length,1);
});
test('multiple choice exposes a radio group, clear selection and the unchanged select-then-check flow',()=>{
 const a=app();a.click('begin');const q=a.current(),index=q.options.indexOf(q.answer),events=a.state().events.length;
 assert.match(a.el.innerHTML,/Choose one answer/);assert.match(a.el.innerHTML,/class="choices quiz-choices" role="radiogroup"/);
 assert.equal((a.el.innerHTML.match(/role="radio" aria-checked="false"/g)||[]).length,q.options.length);
 assert.equal((a.el.innerHTML.match(/class="option-indicator" aria-hidden="true"/g)||[]).length,q.options.length);
 a.click('answer',{index:String(index)});assert.equal(a.state().active.checked,false);assert.equal(a.state().events.length,events);
 assert.equal(a.effects.focused.at(-1),String(index));
 assert.match(a.el.innerHTML,new RegExp('data-index="'+index+'" role="radio" aria-checked="true" tabindex="0"'));
 assert.equal((a.el.innerHTML.match(/aria-checked="true"/g)||[]).length,1);a.click('check');assert.equal(a.state().active.answers.at(-1),true);
 assert.equal(a.state().events.length,events+1);assert.match(a.el.innerHTML,/✓ Correct/);
});
test('radio arrow, Home and End keys select options without prematurely scoring',()=>{
 const a=app();a.click('begin');const q=a.current(),events=a.state().events.length;
 const key=(key,index)=>a.key(key,{target:{closest:()=>({dataset:{index:String(index)}})}});
 assert.equal(key('ArrowRight',0),true);assert.equal(a.state().active.selected,q.options[1]);assert.equal(a.effects.focused.at(-1),'1');
 assert.equal(key('ArrowLeft',0),true);assert.equal(a.state().active.selected,q.options.at(-1));
 assert.equal(key('Home',q.options.length-1),true);assert.equal(a.state().active.selected,q.options[0]);assert.equal(a.effects.focused.at(-1),'0');
 assert.equal(key('End',0),true);assert.equal(a.state().active.selected,q.options.at(-1));assert.equal(a.state().events.length,events);
 a.click('check');const before=JSON.stringify(a.state());assert.equal(key('ArrowDown',0),false);assert.equal(JSON.stringify(a.state()),before);
});
test('all exercise interactions show their concise required-action instruction',()=>{
 const a=app();for(const [predicate,label] of [
  [q=>q.type==='text'&&q.language==='es'&&!q.listening,'Write in Spanish'],
  [q=>q.type==='text'&&q.language==='en-or-es'&&!q.listening,'Write your answer'],
  [q=>q.type==='gap','Complete the sentence'],
  [q=>q.type==='choice'&&q.listening,'Listen, then choose one answer'],
  [q=>q.type==='text'&&q.listening,'Listen, then write your answer'],
  [q=>q.type==='speaking','Say your answer aloud']
 ]){locateQuestion(a,predicate);assert.ok(a.el.innerHTML.includes('<p id="exercise-instruction" class="exercise-instruction">'+label+'</p>'));}
});
test('wrong typed feedback shows the learner response, a natural model and why while escaping supplied HTML',()=>{
 const a=app();a.click('lesson',{id:'u0write'});const value='Mi <img src=x onerror=alert(1)> & nombre';go(a,value);
 assert.match(a.el.innerHTML,/Your answer/);assert.match(a.el.innerHTML,/A natural answer/);assert.match(a.el.innerHTML,/feedback-label">Why/);
 assert.match(a.el.innerHTML,/&lt;img/);assert.match(a.el.innerHTML,/onerror=alert\(1\)&gt;/);assert.match(a.el.innerHTML,/&amp;/);assert.doesNotMatch(a.el.innerHTML,/<img src=x/);
 assert.equal(a.state().active.selected,value);assert.equal(a.state().active.answers.at(-1),false);
 const feedback=a.ctx.Engine.answerFeedback(a.current(),value);assert.equal(feedback.learner,value);assert.ok(a.el.innerHTML.includes(escapeHTML(feedback.explanation)));
 assert.equal(Object.values(a.state().reviews)[0].question.answer,a.current().answer);
});
test('authored common mistakes take precedence over deterministic comparison feedback in the quiz',()=>{
 const a=app(),q=locateQuestion(a,q=>q.type==='text'&&q.language==='es'&&q.mistakes?.some(m=>/^mi llamo/i.test(m.answer)));
 const mistake=q.mistakes.find(m=>/^mi llamo/i.test(m.answer));go(a,mistake.answer);
 assert.match(a.el.innerHTML,/Let’s learn from this/);assert.ok(a.el.innerHTML.includes(escapeHTML(mistake.explanation)));
 assert.equal(a.ctx.Engine.answerFeedback(q,mistake.answer).kind,'authored');assert.equal(a.ctx.Engine.answerExplanation(q,mistake.answer),mistake.explanation);
 assert.equal(a.state().active.selected,mistake.answer);assert.equal(a.state().events.at(-1).correct,false);
});
test('unexpected wrong answers receive transparent comparison without changing accepted-answer scoring',()=>{
 const a=app();a.click('lesson',{id:'u0write'});go(a,'xyz unfamiliar phrase');
 const q=a.current(),feedback=a.ctx.Engine.answerFeedback(q,'xyz unfamiliar phrase');
 assert.match(feedback.explanation,/outside the accepted examples/);assert.match(feedback.explanation,/another phrasing may still be valid/);
 assert.ok(a.el.innerHTML.includes(escapeHTML(feedback.explanation)));assert.match(a.el.innerHTML,/<mark>/);assert.equal(a.state().active.answers.at(-1),false);
 a.click('leave');a.click('review');a.input(q.accepted[0]);a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);assert.equal(a.state().reviews[q.id].success,1);
});
test('historical written snapshots retain their own prompts, targets and explanations in improved feedback and review',()=>{
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8')),original=legacy.active.questions[1];
 const a=app({},legacy),before=JSON.parse(JSON.stringify(a.state().active.questions[1]));
 for(const field of ['prompt','answer','accepted','explanation'])assert.deepEqual(before[field],original[field]);
 for(const field of ['title','text','stage'])assert.equal(before.reading[field],original.reading[field]);
 a.click('continue');go(a,'France');assert.match(a.el.innerHTML,/Your answer/);assert.match(a.el.innerHTML,/France/);
 const saved=a.state().active.questions[1];for(const field of ['prompt','answer','accepted','reading','explanation'])assert.deepEqual(saved[field],before[field]);
 assert.ok(a.el.innerHTML.includes(escapeHTML(before.explanation)));a.click('leave');a.click('review');const review=a.current();
 for(const field of ['prompt','answer','accepted','reading','explanation'])assert.deepEqual(JSON.parse(JSON.stringify(review[field])),before[field]);
 a.input('Inglaterra');a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);
});
function gameLearner(stage='A1.1',unit=7){const C=require('../www/curriculum'),E=require('../www/engine'),s=E.fresh();s.onboarded=true;s.stage=stage;s.completed=C.lessons.filter(l=>l.stage==='A1.1'&&(stage==='A1.2'||l.unit<=unit)||l.stage===stage&&l.unit<=unit).map(l=>l.id);return s;}
function answerGame(a,wrongBlank=-1){const active=a.state().games.active,q=active.questions[active.index];q.blanks.forEach((b,i)=>a.click('gameAnswer',{blank:String(i),index:String(b.options.findIndex(v=>i===wrongBlank?v!==b.answer:v===b.answer))}));a.click('gameCheck');}
function finishLesson(a,correct=true){while(a.current()){a.answer(correct);a.click('check');a.click('next');if(a.el.innerHTML.includes('Session complete')||a.el.innerHTML.includes('Keep building confidence'))break;}}
test('Games is the fifth main navigation target with Home Back behavior and intact review badge',()=>{
 const a=app({},gameLearner());a.click('tab',{tab:'Games'});assert.match(a.el.innerHTML,/Fill the missing verb forms/);assert.match(a.el.innerHTML,/data-tab="Games"/);assert.equal((a.el.innerHTML.match(/data-action="tab"/g)||[]).length,5);assert.match(a.el.innerHTML,/class="active" data-action="tab" data-tab="Games"/);assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Today’s session/);assert.equal(a.ctx.FriendsToAmigos.handleBack(),false);
});
test('game options are selected per blank, locked after checking and never duplicate submissions',()=>{
 const a=app({},gameLearner('A1.2'));a.click('tab',{tab:'Games'});a.click('gameNew');assert.match(a.el.innerHTML,/Question 1 of 10/);assert.match(a.el.innerHTML,/Choose a verb for each blank/);a.click('gameCheck');assert.equal(a.state().games.active.checked,false);answerGame(a,0);assert.match(a.el.innerHTML,/You chose/);assert.match(a.el.innerHTML,/A natural answer/);assert.match(a.el.innerHTML,/Blank 1 · ✗ Needs practice/);const before=JSON.stringify(a.state().games.active);a.click('gameCheck');a.click('gameAnswer',{blank:'0',index:'0'});assert.equal(JSON.stringify(a.state().games.active),before);
});
test('saved game survives native Back and reload without replacing a saved course lesson',()=>{
 const a=app({},gameLearner());a.click('lesson',{id:'u7l0'});a.answer();a.click('check');a.click('leave');const course=a.state().active;
 a.click('tab',{tab:'Games'});a.click('gameNew');answerGame(a,0);const game=a.state().games.active;assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Resume saved game/);assert.deepEqual(a.state().active,course);
 const reloaded=app({},a.state());reloaded.click('tab',{tab:'Games'});reloaded.click('gameResume');assert.deepEqual(reloaded.state().games.active,game);assert.match(reloaded.el.innerHTML,/Let’s learn from this/);reloaded.click('gameNext');assert.match(reloaded.el.innerHTML,/Question 2 of 10/);assert.deepEqual(reloaded.state().active,require('../www/storage').migrateState(a.state(),require('../www/curriculum')).state.active);
});
test('a complete ten-item game records only its own performance and supports mistake practice',()=>{
 const initial=gameLearner('A1.2'),a=app({},initial);a.click('tab',{tab:'Games'});a.click('gameNew');for(let i=0;i<10;i++){answerGame(a,i===0?0:-1);a.click('gameNext');}
 assert.match(a.el.innerHTML,/9 \/ 10 correct/);assert.match(a.el.innerHTML,/Best at this practice level: 9 \/ 10/);assert.match(a.el.innerHTML,/Practise my mistakes/);assert.match(a.el.innerHTML,/Happy bull/);assert.equal(a.state().games.active,null);assert.equal(a.state().games.rounds.length,1);
 for(const field of ['completed','stage','startStage','capabilities','placement','reviews','events','active'])assert.deepEqual(a.state()[field],initial[field]);
 a.click('gameMistakes');assert.match(a.el.innerHTML,/Mistake practice/);const length=a.state().games.active.questions.length;assert.ok(length>0&&length<=5);assert.ok(a.el.innerHTML.includes('Question 1 of '+length));for(let i=0;i<length;i++){answerGame(a);a.click('gameNext');}assert.ok(a.el.innerHTML.includes(length+' / '+length+' correct'));a.click('gameLeave');assert.match(a.el.innerHTML,/Fill the missing verb forms/);
});
test('a perfect game cannot complete or unlock course lessons or change placement',()=>{
 const s=gameLearner('A1.1',1),a=app({},s);a.click('tab',{tab:'Games'});a.click('gameNew');for(let i=0;i<10;i++){answerGame(a);a.click('gameNext');}assert.deepEqual(a.state().completed,s.completed);assert.equal(a.state().stage,'A1.1');assert.equal(a.state().startStage,s.startStage);assert.deepEqual(a.state().capabilities,s.capabilities);a.click('gameNew');assert.ok(a.state().games.active.questions.every(q=>q.stage==='A1.1'));
});
test('Games uses the selected level and placement without requiring completed units',()=>{const s=gameLearner('A1.1',1);s.stage='A1.2';const a=app({},s);a.click('tab',{tab:'Games'});assert.match(a.el.innerHTML,/Practising A1.2 grammar/);a.click('gameNew');assert.equal(a.state().games.active.questions.filter(q=>q.stage==='A1.2').length,6);const placed=require('../www/engine').fresh();placed.onboarded=true;placed.startStage='A1.2';placed.stage='A1.2';const p=app({},placed);p.click('tab',{tab:'Games'});p.click('gameNew');assert.equal(p.state().games.active.questions.length,10);assert.deepEqual(p.state().completed,[]);});
test('challenge is optional and cannot exceed the selected grammar level',()=>{const a=app({},gameLearner('A1.1',1));a.click('tab',{tab:'Games'});assert.match(a.el.innerHTML,/Challenge me/);a.click('gameChallenge');assert.ok(a.state().games.active.questions.every(q=>q.stage==='A1.1'));const b=app({},gameLearner('A1.2',4));b.click('gameChallenge');assert.ok(b.state().games.active.questions.every(q=>q.stage==='A1.2'));});
test('game progress exports and imports through browser and Android without changing main progress',async()=>{
 const a=app({},gameLearner());a.click('tab',{tab:'Games'});a.click('gameNew');answerGame(a);a.click('gameLeave');a.click('export');const json=await a.effects.blobs.at(-1).text();const imported=app();await imported.import(json);assert.deepEqual(imported.state(),a.state());
 let native;const android=app({AndroidSpeech:{exportProgress(json){native=json;}}},a.state());android.click('export');assert.deepEqual(JSON.parse(native),a.state());
});
test('unsafe game import never overwrites current valid progress',async()=>{
 const a=app({},gameLearner()),before=a.state(),damaged=gameLearner();damaged.games={active:{mode:'normal',questions:[]}};await a.import(damaged);assert.deepEqual(a.state(),before);assert.match(a.effects.toasts.at(-1).textContent,/current progress has not changed/);
});
test('passed normal lesson offers Continue learning and starts the next required lesson',()=>{
 const a=app();a.click('begin');finishLesson(a);assert.match(a.el.innerHTML,/Continue learning/);assert.match(a.el.innerHTML,/Back to Home/);assert.equal(a.state().completed[0],'u0l0');a.click('continueLearning');assert.equal(a.state().active.lesson.id,require('../www/curriculum').lessons[1].id);
});
test('failed normal lesson offers retry and mistake review and cannot jump forwards',()=>{
 const a=app();a.click('begin');finishLesson(a,false);assert.doesNotMatch(a.el.innerHTML,/Continue learning/);assert.match(a.el.innerHTML,/Try again/);assert.match(a.el.innerHTML,/Review mistakes/);a.click('continueLearning');assert.equal(a.state().active,null);assert.deepEqual(a.state().completed,[]);a.click('lessonMistakes');assert.equal(vm.runInContext('quiz.kind',a.ctx),'review');assert.match(a.el.innerHTML,/Question 1/);
});
test('passed final required lesson continues into due review rather than optional earlier material',()=>{
 const C=require('../www/curriculum'),E=require('../www/engine'),s=gameLearner('A1.2');s.startStage='A1.2';s.stage='A1.2';s.completed=C.lessons.filter(l=>l.stage!=='A1.1').slice(0,-1).map(l=>l.id);E.recordAnswer(s,C.lessons[0].questions[0],false,0);
 const a=app({},s);a.click('lesson',{id:C.lessons.at(-1).id});finishLesson(a);a.click('continueLearning');assert.equal(vm.runInContext('quiz.kind',a.ctx),'review');assert.equal(a.state().active,null);assert.ok(a.state().completed.every(id=>id.startsWith('a12')||id.startsWith('a21')));
});
test('completed playable path continues to maintenance without advertising A2.2 or fake lesson completions',()=>{
 const C=require('../www/curriculum'),s=gameLearner('A1.2');s.completed=C.lessons.slice(0,-1).map(l=>l.id);const a=app({},s);a.click('lesson',{id:C.lessons.at(-1).id});finishLesson(a);a.click('continueLearning');assert.equal(vm.runInContext('quiz.kind',a.ctx),'practice');assert.ok(a.current().listening);assert.doesNotMatch(a.el.innerHTML,/data-action="lesson"/);assert.match(a.effects.toasts.at(-1).textContent,/required playable path is complete/);
});
test('Today continuation wins over normal lesson Continue learning and keeps the saved course path',()=>{
 const s=require('../www/engine').fresh();s.onboarded=true;const a=app({},s);a.click('today');finishLesson(a);assert.match(a.el.innerHTML,/Continue today’s session/);assert.doesNotMatch(a.el.innerHTML,/data-action="continueLearning"/);a.click('todayNext');assert.equal(vm.runInContext('quiz.kind',a.ctx),'practice');assert.deepEqual(a.state().completed,['u0l0']);
});
test('Back to Home still leaves passed and failed lesson results safely',()=>{
 for(const correct of [true,false]){const a=app();a.click('begin');finishLesson(a,correct);a.click('home');assert.match(a.el.innerHTML,/Today’s session/);assert.equal(a.state().active,null);}
});
test('a partial lesson cannot trigger result continuation or overwrite the resumable attempt',()=>{
 const a=app();a.click('begin');a.answer();a.click('check');const before=a.state();a.click('continueLearning');assert.deepEqual(a.state(),before);assert.equal(a.state().active.lesson.id,'u0l0');assert.equal(a.state().active.answers.length,1);
});

function tableLearner(){const C=require('../www/curriculum'),s=require('../www/engine').fresh();s.onboarded=true;s.stage='A2.1';s.completed=C.lessons.map(l=>l.id);return s;}
function fillTable(a,correct=true){const attempt=a.state().blanks.active,table=attempt.tables[attempt.index];for(let i=0;i<table.rows.length;i++){const value=correct?table.target.forms[table.rows[i]]:table.options[i].find(x=>x!==table.target.forms[table.rows[i]]);if(attempt.entry==='text')vm.runInContext(`state.blanks.active.selected[${i}]=${JSON.stringify(value)}`,a.ctx);else a.change({dataset:{cell:String(i)},value});}a.click('blanksCheck');}
test('Games contains both distinct activities and table practice configuration exposes all sizes and scopes',()=>{const a=app({},tableLearner());a.click('tab',{tab:'Games'});assert.match(a.el.innerHTML,/Fill the missing verb forms/);assert.match(a.el.innerHTML,/Conjugation Blanks/);a.click('blanksOpen');assert.match(a.el.innerHTML,/Normal|normal game/);for(const n of [3,5,10,15,20])assert.ok(a.el.innerHTML.includes('<option>'+n+'</option>'));assert.match(a.el.innerHTML,/Prioritise current course unit/);assert.match(a.el.innerHTML,/Current level/);assert.match(a.el.innerHTML,/All up to current level/);});
test('three-table normal game renders six fixed person labels and accessible selection controls',()=>{const a=app({},tableLearner());a.click('blanksNormal');assert.equal(a.state().blanks.active.tables.length,3);for(const label of ['yo','tú','él / ella / usted','nosotros/as','vosotros/as','ellos / ellas / ustedes'])assert.ok(a.el.innerHTML.includes(label));assert.equal((a.el.innerHTML.match(/role="rowheader"/g)||[]).length,6);assert.match(a.el.innerHTML,/role="table"/);assert.match(a.el.innerHTML,/for="form-0"/);assert.match(a.el.innerHTML,/data-action="blanksCheck" disabled/);});
test('every curated target renders and completes in table practice without changing the main course',()=>{const a=app({},tableLearner()),C=a.ctx.Curriculum;for(const t of a.ctx.ConjugationTargets.targets){vm.runInContext(`state.blanks=B.empty();state.blanks.active=B.build(state,C,{mode:'practice',focus:${JSON.stringify('form:'+t.verb+':'+t.tense+':yo')}});screen='blanks';save();render();`,a.ctx);assert.match(a.el.innerHTML,/Table 1 of 3/);for(let i=0;i<3;i++){fillTable(a);assert.match(a.el.innerHTML,/Well done/);a.click('blanksNext');}assert.match(a.el.innerHTML,/3 tables completed/);assert.match(a.el.innerHTML,/forms correct/);a.click('blanksLeave');}assert.equal(a.state().completed.length,C.lessons.length);assert.equal(a.state().events.length,0);});
test('incorrect table feedback shows each choice, corrected form, wrong-person diagnosis and mistake practice',()=>{const a=app({},tableLearner());a.click('blanksNormal');fillTable(a,false);const r=a.state().blanks.active.results[0];assert.match(a.el.innerHTML,/You wrote\/chose/);assert.match(a.el.innerHTML,/A natural answer/);assert.match(a.el.innerHTML,/belongs to/);for(const d of r.details){assert.ok(a.el.innerHTML.includes(d.selected));assert.ok(a.el.innerHTML.includes(d.answer));}a.click('blanksNext');for(let i=1;i<3;i++){fillTable(a);a.click('blanksNext');}assert.match(a.el.innerHTML,/Practice mistakes/);a.click('blanksMistakes');assert.equal(a.state().blanks.active.mode,'practice');assert.equal(a.state().blanks.active.entry,'text');assert.ok(a.state().blanks.active.tables.every(t=>r.id===t.target.id));});
test('table hints/guide are saved as assistance and affect evidence rather than course completion',()=>{const a=app({},tableLearner());a.click('blanksNormal');a.click('blanksHint',{cell:'0'});assert.equal(a.state().blanks.active.assisted[0],true);assert.match(a.el.innerHTML,/For /);fillTable(a);assert.ok(Object.values(a.state().mastery.records).some(r=>r.assisted===1));assert.equal(a.state().capabilities.length,0);});
test('Back saves checked table state to Games, resume/import preserves it alongside an unfinished historical lesson',async()=>{const a=app({},tableLearner());a.click('lesson',{id:'u0write'});a.input('historical learner text');a.click('leave');const lesson=a.state().active;a.click('blanksNormal');fillTable(a);const tables=a.state().blanks.active;assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Conjugation Blanks/);assert.deepEqual(a.state().active,lesson);a.click('blanksResume');assert.deepEqual(a.state().blanks.active,tables);assert.match(a.el.innerHTML,/Well done/);a.click('export');const out=JSON.parse(await a.effects.blobs.at(-1).text()),b=app();await b.import(out);b.click('blanksResume');assert.deepEqual(b.state().blanks.active,tables);assert.deepEqual(b.state().active,lesson);});
test('practice config launches twenty recall tables using only the chosen unlocked scope',()=>{const a=app({},tableLearner());a.nodes['table-count']={value:'20'};a.nodes['table-scope']={value:'stage'};a.nodes['table-entry']={value:'text'};a.click('blanksPractice');assert.equal(a.state().blanks.active.tables.length,20);assert.ok(a.state().blanks.active.tables.every(t=>t.target.stage==='A2.1'));assert.match(a.el.innerHTML,/enterkeyhint="go"/);assert.match(a.el.innerHTML,/Write the missing forms/);});
test('table written Go checks once, empty Go is inert, diagnostic feedback escapes entered HTML',()=>{const a=app({},tableLearner());a.nodes['table-entry']={value:'text'};a.click('blanksPractice');const target=value=>({id:'form-0',value,dataset:{cell:'0'},classList:{contains:x=>x==='table-input'}});const before=a.el.innerHTML;a.key('Enter',{target:target('')});assert.equal(a.el.innerHTML,before);vm.runInContext('state.blanks.active.selected=state.blanks.active.tables[0].rows.map(row=>state.blanks.active.tables[0].target.forms[row])',a.ctx);a.key('Enter',{target:target('<img src=x onerror=alert(1)>')});assert.equal(a.state().blanks.active.checked,true);assert.match(a.el.innerHTML,/&lt;img src=x/);assert.doesNotMatch(a.el.innerHTML,/<img src=x/);const count=a.state().blanks.active.results.length;a.key('Enter',{target:target('changed')});assert.equal(a.state().blanks.active.results.length,count);});
test('Weak Areas presents readable repeated mistakes and launches only unlocked focused practice; Back returns Review',()=>{const initial=tableLearner(),M=require('../www/mastery');for(let i=0;i<2;i++)M.record(initial,[{verb:'tener',tense:'present',person:'vosotros'}],false,{session:'s',item:'i'+i},100+i);const a=app({},initial);a.click('weakAreas');assert.match(a.el.innerHTML,/tener/);assert.match(a.el.innerHTML,/vosotros\/as/);assert.match(a.el.innerHTML,/Needs practice/);assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Review &amp; grow|Review & grow/);a.click('weakAreas');a.click('weakPractice',{key:'form:tener:present:vosotros'});assert.ok(a.state().blanks.active.tables.every(t=>t.target.verb==='tener'&&t.rows.includes(4)));});
test('Today’s Review is visible, handles an empty learner and uses the existing scheduled review checker',()=>{const seed=app();assert.match(seed.el.innerHTML,/Today’s Review/);seed.click('dailyReview');assert.equal(seed.current(),undefined);const s=seed.ctx.Engine.fresh(),q=seed.ctx.Curriculum.lessons[0].questions[0];seed.ctx.Engine.recordAnswer(s,q,false,0);const a=app({},s);a.click('dailyReview');assert.equal(a.current().id,q.id);a.answer();a.click('check');assert.equal(a.state().reviews[q.id].success,1);assert.ok(a.state().mastery);assert.equal(a.state().completed.length,0);});
test('Today’s Review offers weak-table follow-up after the scheduled questions and never fetches locked targets',()=>{const s=tableLearner(),M=require('../www/mastery'),E=require('../www/engine'),C=require('../www/curriculum');E.recordAnswer(s,C.lessons[0].questions[0],false,0);for(let i=0;i<2;i++)M.record(s,[{verb:'tener',tense:'present',person:'vosotros'}],false,{session:'s',item:'w'+i},100+i);const a=app({},s);a.click('dailyReview');while(a.current()){a.answer();a.click('check');a.click('next');if(vm.runInContext('screen',a.ctx)!=='quiz')break;}assert.match(a.el.innerHTML,/Practise a weak conjugation/);a.click('reviewFollowup');assert.equal(a.state().blanks.active.mode,'practice');});
test('A2.1 placement starts the playable new stage and retains earlier course revision without invented rewards',()=>{const a=app();a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}a.nodes.stage.value='A2.1';a.click('acceptPlacement');assert.equal(a.state().startStage,'A2.1');assert.match(a.el.innerHTML,/data-id="a21u0l0"/);a.click('home');a.click('continue');assert.equal(a.state().active.lesson.id,'a21u0l0');assert.deepEqual(a.state().completed,[]);a.click('leave');a.click('blanksNormal');assert.ok(a.state().blanks.active.tables.some(t=>t.target.stage==='A2.1'));assert.ok(a.state().blanks.active.tables.every(t=>t.rows.length===2));});
test('A1 milestone remains accurate while the next required lesson becomes A2.1; completing A2.1 never exposes A2.2',()=>{const s=tableLearner(),a=app({},s);assert.match(a.el.innerHTML,/course through A2.1/);assert.match(a.el.innerHTML,/216 activities completed/);assert.match(a.el.innerHTML,/A2.2 remains planned/);assert.match(a.el.innerHTML,/not formal CEFR certification/);a.click('continue');assert.equal(a.state().active,null);assert.match(a.el.innerHTML,/Review & grow/);});
test('A1 milestone summarises only personally practised outcomes and keeps an unfinished A2.1 lesson resumable',()=>{const s=tableLearner();s.completed=s.completed.filter(id=>!id.startsWith('a21'));const a=app({},s);assert.match(a.el.innerHTML,/A1 course/);assert.doesNotMatch(a.el.innerHTML,/Explain basic symptoms and say what you need/);a.click('continue');a.input('A2 draft');a.click('leave');assert.match(a.el.innerHTML,/Resume your saved lesson/);a.click('continue');assert.equal(a.state().active.lesson.id,'a21u0l0');});
test('advanced recognition placement recommends the highest playable start while retaining the provisional screening result',()=>{const a=app();a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}assert.match(a.el.innerHTML,/<div class="stat">A2.1<\/div>/);assert.match(a.el.innerHTML,/suggested B2.1/);assert.doesNotMatch(a.el.innerHTML,/<option[^>]*>B/);assert.equal(a.state().placement.stage,'B2.1');});
test('A2.1 listening stays audio-first before checking, reveals afterwards and resets on spaced review',()=>{const a=app();a.click('lesson',{id:'a21u0l0'});for(let i=0;i<5;i++){a.answer();a.click('check');a.click('next');}assert.ok(a.current().listening);assert.doesNotMatch(a.el.innerHTML,/Hoy he visitado el museo con Marta/);a.answer(false);a.click('check');assert.match(a.el.innerHTML,/Hoy he visitado el museo con Marta/);a.click('leave');a.click('review');assert.doesNotMatch(a.el.innerHTML,/Hoy he visitado el museo con Marta/);assert.equal(a.current().id,'a21u0l0-q6');});

function startFocusedTest(a,kind,stage='A2.1'){a.click('mediaPractice',{kind,stage});assert.equal(vm.runInContext('quiz.kind',a.ctx),'focused');assert.equal(a.state().focused.active.questions.length,10);}
function finishFocusedTest(a,got=10){for(let i=0;i<10;i++){a.answer(i<got);a.click('check');a.click('next');}}
test('focused modes expose independent ten-item sessions and do not replace an unfinished course lesson',()=>{const a=app({},tableLearner());a.click('lesson',{id:'u0write'});a.input('course draft');a.click('leave');const course=a.state().active,writes=[],set=a.ctx.localStorage.setItem;a.ctx.localStorage.setItem=(k,v)=>{writes.push(v);set(k,v);};startFocusedTest(a,'listening');assert.ok(writes.length);for(const saved of writes){const checked=a.ctx.ProgressStore.parse(saved,a.ctx.Curriculum,{import:true});assert.equal(checked.state.focused.active.questions.length,10);}assert.match(a.el.innerHTML,/Question 1 of 10/);assert.deepEqual(a.state().active,course);assert.equal(a.state().focused.active.mediaKind,'listening');});
test('normal focused listening completes ten items with a scored summary and future review actions',()=>{const a=app({},tableLearner());startFocusedTest(a,'listening');finishFocusedTest(a,8);assert.match(a.el.innerHTML,/Focused Listening complete/);assert.match(a.el.innerHTML,/8\/10 correct/);assert.match(a.el.innerHTML,/2 items saved or reinforced/);assert.match(a.el.innerHTML,/Practice again/);assert.match(a.el.innerHTML,/Review weak areas/);assert.equal(a.state().focused.active,null);assert.equal(a.state().focused.history.length,1);assert.equal(a.state().completed.length,216);assert.equal(a.state().capabilities.length,0);});
test('normal focused speaking summarizes self-assessments without fake scored accuracy',()=>{const a=app({},tableLearner());startFocusedTest(a,'speaking');finishFocusedTest(a,7);assert.match(a.el.innerHTML,/7 “I got it”/);assert.match(a.el.innerHTML,/3 “Needs practice”/);assert.match(a.el.innerHTML,/self-assessed|Tú evalúas/);assert.doesNotMatch(a.el.innerHTML,/\d+\/10 correct|\d+ of \d+ correct|pronunciation score|mastered/i);assert.equal(Object.keys(a.state().reviews).length,3);assert.ok(Object.values(a.state().mastery.records).every(r=>r.spaced===0));});
test('focused speaking hides models and alternatives until reveal; both can use existing Spanish TTS',()=>{const heard=[],a=app({AndroidSpeech:{speak:text=>heard.push(text)}},tableLearner());startFocusedTest(a,'speaking','A1.1');const q=a.current();for(const model of q.models)assert.ok(!a.el.innerHTML.includes(escapeHTML(model)));a.click('speak');a.click('selfAssess',{result:'got'});assert.equal(heard.length,0);assert.equal(a.state().focused.active.checked,false);a.click('revealModel');assert.match(a.el.innerHTML,/One possible response|Una respuesta posible/);a.click('speak');assert.equal(heard[0],q.spanish);if(q.models.length>1){a.click('speakModel',{model:'1'});assert.equal(heard[1],q.models[1]);}a.click('selfAssess',{result:'needs'});a.click('selfAssess',{result:'got'});assert.equal(a.state().events.filter(e=>e.questionId===q.id).length,1);assert.equal(a.state().focused.active.answers[0],false);});
test('successful use enables compact listening controls while retaining offline guidance, replay, speed and transcript rules',()=>{const a=app({},tableLearner());startFocusedTest(a,'listening');assert.match(a.el.innerHTML,/Listen to familiar Spanish, then answer/);a.answer();a.click('check');a.click('next');assert.match(a.el.innerHTML,/compact-media/);assert.doesNotMatch(a.el.innerHTML,/Play \/ replay Spanish \(TTS\)/);assert.doesNotMatch(a.el.innerHTML,/Listen to familiar Spanish, then answer/);assert.match(a.el.innerHTML,/About listening practice/);assert.match(a.el.innerHTML,/offline Spanish voice/);assert.match(a.el.innerHTML,/Spanish \(Spain\) · synthetic voice/);assert.match(a.el.innerHTML,/0.75×/);assert.match(a.el.innerHTML,/Normal · 1×/);assert.match(a.el.innerHTML,/Skip for now/);assert.doesNotMatch(a.el.innerHTML,/summary>Spanish transcript/);});
test('deliberate speaking self-assessment enables compact instructions with accessible full explanation',()=>{const a=app({},tableLearner());startFocusedTest(a,'speaking');assert.match(a.el.innerHTML,/does not record your voice or assess pronunciation/);a.click('revealModel');a.click('selfAssess',{result:'needs'});a.click('next');assert.match(a.el.innerHTML,/Say it aloud, then reveal/);assert.match(a.el.innerHTML,/About speaking practice/);assert.match(a.el.innerHTML,/self-assessed|Tú evalúas/);assert.ok(!a.el.innerHTML.includes(escapeHTML(a.current().spanish)));});
test('skipping a first focused listen does not falsely acknowledge successful use, but saves its stable snapshot',()=>{const a=app({},tableLearner());startFocusedTest(a,'listening');const q=a.current();a.click('skipListening');assert.equal(a.state().focused.seenInstructions.listening,false);assert.ok(a.state().reviews[q.id].question.listening);a.click('next');assert.match(a.el.innerHTML,/Listen to familiar Spanish, then answer/);});
test('delayed focused playback keeps answer controls locked until actual native acknowledgement',()=>{let pending;const a=app({AndroidSpeech:{isReady:()=>true,listen(text,rate,id){pending=id;},stop(){}}},tableLearner());startFocusedTest(a,'listening');const q=a.current();a.click('listen');assert.equal(a.state().focused.active.audioPlayed,false);assert.match(a.el.innerHTML,/Starting audio/);a.answer();a.click('check');assert.equal(a.state().focused.active.answers.length,0);a.ctx.FriendsToAmigosSpeechResult(pending,true);assert.equal(a.state().focused.active.audioPlayed,true);a.answer();a.click('check');assert.match(a.el.innerHTML,/summary>Spanish transcript/);assert.ok(a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));});
test('complete focused TTS failure stays locked, offers guidance and supports saved review skip',()=>{const a=app({speechSynthesis:null},tableLearner());startFocusedTest(a,'listening');a.click('listen');assert.equal(a.state().focused.active.audioPlayed,false);assert.match(a.el.innerHTML,/Audio is unavailable/);a.answer();a.click('check');assert.equal(a.state().focused.active.answers.length,0);const q=a.current();a.click('skipListening');assert.equal(a.state().focused.active.answers[0],null);assert.ok(a.state().reviews[q.id]);});
test('focused Slow/Normal playback passes 0.75 and 1 to native speech without answering',()=>{const calls=[],a=app({AndroidSpeech:{isReady:()=>true,stop(){},listen(text,rate,id){calls.push(rate);a.ctx.FriendsToAmigosSpeechResult(id,true);}}},tableLearner());startFocusedTest(a,'listening');a.click('listen');a.click('listenSpeed',{rate:'1'});a.click('listen');assert.deepEqual(calls,[.75,1]);assert.equal(a.state().focused.active.answers.length,0);});
test('focused Back saves its checked snapshot, cancels speech and resumes exactly after reload/import',async()=>{let stops=0;const a=app({AndroidSpeech:{speak(){},stop(){stops++;}}},tableLearner());startFocusedTest(a,'speaking');a.click('revealModel');a.click('selfAssess',{result:'needs'});const snapshot=a.state().focused.active;const n=stops;assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.ok(stops>n);assert.match(a.el.innerHTML,/Resume focused speaking/);const reload=app({},a.state());reload.click('focusedResume');assert.deepEqual(reload.state().focused.active,snapshot);assert.match(reload.el.innerHTML,/You marked: Needs practice/);reload.click('export');const backup=JSON.parse(await reload.effects.blobs.at(-1).text()),copy=app();await copy.import(backup);copy.click('focusedResume');assert.deepEqual(copy.state().focused.active,snapshot);});
test('pending playback canceled by Back cannot later unlock a different focused question',()=>{let id;const a=app({AndroidSpeech:{isReady:()=>true,listen(t,r,i){id=i;},stop(){}}},tableLearner());startFocusedTest(a,'listening');a.click('listen');a.ctx.FriendsToAmigos.handleBack();a.click('focusedResume');a.ctx.FriendsToAmigosSpeechResult(id,true);assert.equal(a.state().focused.active.audioPlayed,false);assert.equal(a.state().focused.active.answers.length,0);});
test('background/foreground interruptions retain a focused attempt and stop active speech',()=>{let stops=0;const a=app({AndroidSpeech:{speak(){},stop(){stops++;}}},tableLearner());startFocusedTest(a,'speaking');a.click('revealModel');const before=a.state().focused.active,n=stops;a.lifecycle['fta-pause']();assert.ok(stops>n);a.lifecycle['fta-resume']();assert.deepEqual(a.state().focused.active,before);});
test('focused errors resurface through ordinary and Today review with hidden audio/models',()=>{const a=app({},tableLearner());startFocusedTest(a,'speaking');const q=a.current();a.click('revealModel');a.click('selfAssess',{result:'needs'});a.click('leave');a.click('dailyReview');assert.equal(a.current().id,q.id);assert.ok(!a.el.innerHTML.includes(escapeHTML(q.spanish)));a.click('revealModel');a.click('selfAssess',{result:'got'});assert.equal(a.state().reviews[q.id].success,1);});
test('repeated speaking mistakes surface an understandable weak area and launch eligible related practice',()=>{const a=app({},tableLearner());const qs=a.ctx.FocusedBank.items.filter(q=>q.practice.kind==='speaking'&&q.practice.stage==='A1.2'&&q.practice.unit===0);for(let i=0;i<2;i++)vm.runInContext(`F.record(state,FocusedBank.items.find(q=>q.id===${JSON.stringify(qs[i].id)}),false,{session:'mistake${i}'});save();`,a.ctx);a.click('weakAreas');assert.match(a.el.innerHTML,/Speaking · Free time/);a.click('weakPractice',{key:'concept:speaking-a12-0'});assert.equal(a.state().focused.active.mediaKind,'speaking');assert.ok(a.state().focused.active.questions.every(q=>q.practice.stage!=='A2.2'));});
test('practice again generates a new ten-item round and Back safely leaves its results destination',()=>{const a=app({},tableLearner());startFocusedTest(a,'listening');const ids=a.state().focused.active.questions.map(q=>q.id);finishFocusedTest(a);a.click('focusedAgain');assert.equal(a.state().focused.active.questions.length,10);assert.ok(a.state().focused.active.questions.every(q=>!ids.includes(q.id)));assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Friends to/);});
test('focused writing Go uses existing checking without duplicate submission',()=>{const a=app({},tableLearner()),q=a.ctx.FocusedBank.items.find(q=>q.listening&&q.type==='text');vm.runInContext(`startQuiz('practice',[FocusedBank.items.find(q=>q.id===${JSON.stringify(q.id)})]);`,a.ctx);a.click('listen');a.key('Enter',{target:{id:'written-answer',value:q.answer}});assert.equal(vm.runInContext('quiz.answers.length',a.ctx),1);a.key('Enter',{target:{id:'written-answer',value:q.answer}});assert.equal(vm.runInContext('quiz.answers.length',a.ctx),1);});
test('every focused bank item renders and completes with original speech/answer controls',()=>{const a=app({},tableLearner());for(let i=0;i<a.ctx.FocusedBank.items.length;i++){vm.runInContext(`startQuiz('practice',[FocusedBank.items[${i}]]);`,a.ctx);const q=a.current();assert.ok(a.el.innerHTML.includes(escapeHTML(q.prompt)),q.id);a.answer();a.click('check');a.click('next');assert.match(a.el.innerHTML,/Session complete/);}assert.equal(a.state().completed.length,216);assert.equal(a.state().capabilities.length,0);});
test('damaged focused imports preserve current course progress and valid saved practice',async()=>{const a=app({},tableLearner());startFocusedTest(a,'listening');const good=a.state(),bad=JSON.parse(JSON.stringify(good));bad.focused.active.questions[0].listening.transcript=null;await a.import(bad);assert.deepEqual(a.state(),good);assert.match(a.effects.toasts.at(-1).textContent,/has not changed/);});
test('very early learner receives clear taught-material guidance rather than a short or future-grammar session',()=>{const a=app();a.click('mediaPractice',{kind:'listening',stage:'A2.1'});assert.equal(a.current(),undefined);assert.match(a.effects.toasts.at(-1).textContent,/Ten taught items/);assert.equal(vm.runInContext('state.focused',a.ctx),undefined);});
