const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function app(extra={},initial=null){
 const handlers={},lifecycle={},storage=initial?{'friends-to-amigos-v1':JSON.stringify(initial)}:{},effects={blobs:[],links:[],toasts:[]};
 const el={innerHTML:'',addEventListener:(type,fn)=>handlers[type]=fn};
 const nodes={app:el,stage:{value:'A2.1'},'check-answer':{disabled:true},importfile:{click(){}}};
 const ctx={console,Date,JSON,Math,String,Number,Object,Array,Set,Map,Blob,
  // Simulated installed voice. Individual failure tests override this explicitly.
  SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak(){}},
  URL:{createObjectURL(blob){effects.blobs.push(blob);return 'blob:backup';},revokeObjectURL(){}},
  setInterval:()=>{},setTimeout:()=>{},confirm:()=>true,
  localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},
  document:{hidden:false,getElementById:id=>nodes[id]||null,addEventListener:()=>{},createElement:tag=>({className:'',textContent:'',remove(){},click(){effects.links.push(this);}}),body:{append(el){effects.toasts.push(el);}}}
 };
 Object.assign(ctx,extra);ctx.window=ctx;ctx.globalThis=ctx;ctx.addEventListener=(name,fn)=>lifecycle[name]=fn;vm.createContext(ctx);
 for(const f of [...fs.readFileSync('www/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]))vm.runInContext(fs.readFileSync('www/'+f,'utf8'),ctx);
 const api={el,ctx,effects,nodes,storage,lifecycle,click:(action,data={})=>handlers.click({target:{closest:()=>({dataset:{action,...data}})}}),
  input:value=>handlers.input({target:{id:'written-answer',value}}),
  current:()=>vm.runInContext('quiz?.questions[quiz.index]',ctx),
  state:()=>JSON.parse(storage['friends-to-amigos-v1']),
  import:async data=>handlers.change({target:{id:'importfile',files:[{text:async()=>typeof data==='string'?data:JSON.stringify(data)}]}})
 };
 api.answer=(correct=true)=>{const q=api.current();if(q.listening)api.click('listen');if(q.type==='speaking'){api.click('revealModel');api.click('selfAssess',{result:correct?'got':'needs'});return;}if(q.type==='text')api.input(correct?q.accepted[0]:'incorrect response');else api.click('answer',{index:String(q.options.findIndex(x=>correct?x===q.answer:x!==q.answer))});};
 return api;
}
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
 assert.match(a.el.innerHTML,/B2.1/);a.click('acceptPlacement');assert.equal(a.state().stage,'A1.2');assert.match(a.el.innerHTML,/Lessons are not yet available/);assert.match(a.el.innerHTML,/Free time &amp; preferences/);assert.doesNotMatch(a.el.innerHTML,/<option[^>]*>A2/);
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
 a.answer(false);a.click('check');assert.match(a.el.innerHTML,/Me llamo Ana/);assert.match(a.el.innerHTML,/needs me/);
 const review=Object.values(a.state().reviews)[0];assert.equal(review.question.type,'gap');
 const resumed=app({},a.state());resumed.click('continue');assert.match(resumed.el.innerHTML,/Me llamo Ana/);
});
test('story reading waits for the learner, provides glossary and supports bilingual short answers',()=>{
 const a=app(),story=a.ctx.Curriculum.lessons.find(l=>l.id==='u0story0');a.click('lesson',{id:story.id});
 assert.match(a.el.innerHTML,/Ready for questions/);assert.match(a.el.innerHTML,/Word help/);assert.doesNotMatch(a.el.innerHTML,/Check answer/);
 a.click('check');assert.equal(a.state().active.answers.length,0);a.click('leave');a.click('continue');assert.match(a.el.innerHTML,/Ready for questions/);
 a.click('readStory');assert.match(a.el.innerHTML,/Read the story again/);a.answer();a.click('check');a.click('next');
 assert.match(a.el.innerHTML,/Answer in English or Spanish/);a.input('su nombre');a.click('leave');
 const resumed=app({},a.state());resumed.click('continue');assert.match(resumed.el.innerHTML,/value="su nombre"/);resumed.click('check');assert.match(resumed.el.innerHTML,/✓ Correct/);resumed.click('next');
 resumed.answer();resumed.click('check');resumed.click('next');resumed.input('Ana');resumed.click('check');resumed.click('next');resumed.answer();resumed.click('check');resumed.click('next');
 assert.ok(resumed.state().completed.includes(story.id));assert.equal(resumed.state().active,null);
});
test('Spanish production rejects English, teaches the rule and retains context in review',()=>{
 const a=app();a.click('lesson',{id:'u2write'});a.input('a coffee with milk please');a.click('check');assert.match(a.el.innerHTML,/Let’s learn from this/);assert.match(a.el.innerHTML,/masculine/);
 a.click('next');a.input('agua por favor');a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);a.click('leave');a.click('lesson',{id:'u0story0'});a.click('readStory');a.answer(false);a.click('check');a.click('leave');a.click('review');
 a.answer();a.click('check');a.click('next');assert.match(a.el.innerHTML,/Read the story again/);assert.match(a.el.innerHTML,/Los dos entran en clase/);
});
test('recall answers cannot be heard before answering; both TTS paths remain available afterwards',()=>{
 const spoken=[],a=app({AndroidSpeech:{speak:text=>spoken.push(text)}});a.click('begin');
 for(let i=0;i<2;i++){a.answer();a.click('check');a.click('next');}
 assert.match(a.el.innerHTML,/From memory/);assert.doesNotMatch(a.el.innerHTML,/data-action="speak"/);
 a.answer();a.click('check');assert.match(a.el.innerHTML,/data-action="speak"/);a.click('speak');assert.deepEqual(spoken,['Me llamo Ana']);
 a.click('leave');a.click('lesson',{id:'u0story0'});a.click('speakStory');assert.equal(spoken[1],a.ctx.Curriculum.lessons.find(l=>l.id==='u0story0').reading.text);
 const utterances=[],b=app({SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES'}],cancel(){},speak(u){utterances.push(u);}}});
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
  for(const q of lesson.questions){assert.ok(a.el.innerHTML.includes(q.prompt.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))));a.answer();a.click('check');assert.match(a.el.innerHTML,q.type==='speaking'?/You marked: I got it/:/✓ Correct/);const roundTrip=a.ctx.ProgressStore.parse(JSON.stringify(a.state()),a.ctx.Curriculum,{import:true}).state;assert.ok(roundTrip.active);assert.equal(roundTrip.active.questions[roundTrip.active.index].id,q.id);assert.equal(roundTrip.active.checked,true);a.click('next');}
  assert.ok(a.state().completed.includes(lesson.id));a.click('retry');assert.equal(a.state().active.lesson.id,lesson.id);a.click('leave');
 }
 assert.equal(new Set(a.state().completed).size,a.ctx.Curriculum.lessons.length);
});
test('course map shows practical future progression without exposing unavailable lessons',()=>{
 const a=app();a.click('tab',{tab:'Learn'});
 for(const stage of a.ctx.Curriculum.stageInfo){assert.ok(a.el.innerHTML.includes(stage.goal));for(const task of stage.tasks)assert.ok(a.el.innerHTML.includes(task));}
 assert.equal((a.el.innerHTML.match(/data-action="lesson"/g)||[]).length,72);
 assert.equal((a.el.innerHTML.match(/Lessons are not yet available/g)||[]).length,6);
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
 const before=a.el.innerHTML;a.click('viewStage',{stage:'A2.1'});a.click('lesson',{id:'a2u0l0'});assert.equal(a.el.innerHTML,before);
 a.click('viewStage',{stage:'A1.1'});assert.match(a.el.innerHTML,/data-id="u0l0"/);
 const saved=a.ctx.Engine.fresh();saved.stage='A1.2';const loaded=app({},saved);loaded.click('tab',{tab:'Learn'});assert.match(loaded.el.innerHTML,/data-id="a12u0l0"/);
});
test('A1.2 story responses survive resume and missed comprehension retains its passage in review',()=>{
 const a=app();a.click('lesson',{id:'a12u5story1'});assert.match(a.el.innerHTML,/Las llaves de Luis/);assert.match(a.el.innerHTML,/Word help/);assert.match(a.el.innerHTML,/help a visitor/);
 a.click('readStory');a.answer();a.click('check');a.click('next');a.input('un libro');a.click('leave');
 const resumed=app({},a.state());resumed.click('continue');assert.match(resumed.el.innerHTML,/value="un libro"/);resumed.click('check');assert.match(resumed.el.innerHTML,/✓ Correct/);resumed.click('next');resumed.answer(false);resumed.click('check');resumed.click('leave');resumed.click('review');assert.match(resumed.el.innerHTML,/Read the story again/);assert.match(resumed.el.innerHTML,/No encuentro mis llaves/);
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
 assert.match(a.el.innerHTML,/B2.1/);assert.match(a.el.innerHTML,/not available/);assert.doesNotMatch(a.el.innerHTML,/<option[^>]*>A[2]|<option[^>]*>B/);
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
  startAt(a,l,i);const q=a.current();assert.doesNotMatch(a.el.innerHTML,/Spanish transcript/);assert.ok(!a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));
  a.click('check');assert.equal(a.state().active.checked,false);a.click('next');assert.equal(a.current().id,q.id);
  a.answer();assert.ok(!a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));a.click('check');assert.match(a.el.innerHTML,/Spanish transcript/);assert.ok(a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));assert.ok(heard.includes(q.listening.transcript));
 }
});
test('listening plays on browser speech path and replay does not inflate answer statistics',()=>{
 const played=[],a=app({SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak:u=>played.push(u)}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='a12u1l2');startAt(a,l,5);
 a.click('answer',{index:'0'});assert.equal(a.state().active.selected,null);a.click('listen');a.click('listen');assert.equal(played.length,2);assert.equal(played[0].lang,'es-ES');assert.equal(played[0].rate,.95);
 a.answer();a.click('check');const count=a.state().events.length;a.click('listen');a.click('check');assert.equal(a.state().events.length,count);
});
test('skipped unavailable listening reveals context and queues a scored miss for later review',()=>{
 const a=app({speechSynthesis:null}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='u1l1');startAt(a,l,5);const q=a.current();a.click('listen');assert.match(a.el.innerHTML,/Audio is unavailable/);a.click('skipListening');assert.match(a.el.innerHTML,/Listening saved for review/);assert.equal(a.state().active.answers.at(-1),null);assert.equal(a.state().events.at(-1).skipped,true);assert.equal(a.state().reviews[q.id].question.listening.transcript,q.listening.transcript);
 const b=app({},a.state());b.click('continue');assert.match(b.el.innerHTML,/Spanish transcript/);b.click('next');assert.match(b.el.innerHTML,/5 of 6 correct/);assert.ok(b.state().completed.includes(l.id));
});
test('unanswered and checked listening reveal states survive save/resume and review hides again',()=>{
 const a=app({AndroidSpeech:{speak(){}}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='u0l1');startAt(a,l,5);a.click('listen');a.click('leave');
 const b=app({AndroidSpeech:{speak(){}}},a.state());b.click('continue');assert.doesNotMatch(b.el.innerHTML,/Spanish transcript/);assert.equal(b.state().active.audioPlayed,true);b.answer(false);b.click('check');b.click('leave');
 const c=app({},b.state());c.click('continue');assert.match(c.el.innerHTML,/Spanish transcript/);c.click('leave');c.click('review');assert.doesNotMatch(c.el.innerHTML,/Spanish transcript/);c.click('skipListening');assert.match(c.el.innerHTML,/Spanish transcript/);
});
test('speaking requires deliberate reveal, has no automatic grading and needs-practice enters spaced review',()=>{
 const heard=[],a=app({AndroidSpeech:{speak:text=>heard.push(text)}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='a12u2l2');startAt(a,l,6);heard.length=0;const q=a.current();assert.match(a.el.innerHTML,/self-assessed/);assert.ok(!a.el.innerHTML.includes(escapeHTML(q.spanish)));
 a.click('selfAssess',{result:'got'});a.click('speak');a.click('check');assert.equal(a.state().active.checked,false);assert.equal(heard.length,0);
 a.click('revealModel');assert.ok(a.el.innerHTML.includes(escapeHTML(q.spanish)));a.click('speak');assert.deepEqual(heard,[q.spanish]);a.click('selfAssess',{result:'needs'});a.click('selfAssess',{result:'got'});assert.equal(a.state().events.filter(e=>e.questionId===q.id).length,1);assert.equal(a.state().events.at(-1).selfAssessed,true);assert.ok(a.state().reviews[q.id]);a.click('next');assert.match(a.el.innerHTML,/6 of 6 correct/);assert.ok(a.state().completed.includes(l.id));
 a.click('home');a.click('review');assert.equal(a.current().type,'speaking');assert.ok(!a.el.innerHTML.includes(escapeHTML(q.spanish)));a.click('revealModel');a.click('selfAssess',{result:'got'});assert.equal(a.state().reviews[q.id].success,1);a.click('next');a.click('retry');a.click('revealModel');a.click('selfAssess',{result:'got'});assert.equal(a.state().reviews[q.id].success,1);
});
test('speaking model/self-assessment snapshots resume in both stages',()=>{
 for(const id of ['u0l2','a12u6l2']){const a=app(),l=a.ctx.Curriculum.lessons.find(l=>l.id===id);startAt(a,l,6);a.click('revealModel');a.click('leave');const b=app({},a.state());b.click('continue');assert.match(b.el.innerHTML,/One possible response/);assert.equal(b.state().active.modelRevealed,true);b.click('selfAssess',{result:'got'});b.click('leave');const c=app({},b.state());c.click('continue');assert.match(c.el.innerHTML,/You marked: I got it/);c.click('next');assert.ok(c.state().completed.includes(id));}
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
test('complete A1 home celebrates capabilities, review and practice without exposing A2',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.completed=JSON.parse(fs.readFileSync('tests/fixtures/a1-activity-ids.json','utf8'));initial.sessions['2026-10-05']={seconds:120,practised:true};
 const a=app({},initial);assert.match(a.el.innerHTML,/completed the Friends to Amigos A1 course/);assert.match(a.el.innerHTML,/144 activities completed/);assert.match(a.el.innerHTML,/2 minutes practised/);assert.match(a.el.innerHTML,/not formal CEFR certification/);assert.match(a.el.innerHTML,/A2.1 is planned and unavailable/);assert.match(a.el.innerHTML,/Listening practice/);assert.match(a.el.innerHTML,/Speak aloud/);assert.doesNotMatch(a.el.innerHTML,/data-stage="A2/);
 a.click('mediaPractice',{kind:'speaking',stage:'A1.2'});for(let i=0;i<6;i++){a.answer();a.click('next');}assert.match(a.el.innerHTML,/self-assessed/);assert.equal(a.state().completed.length,144);assert.equal(a.state().capabilities.length,0);
 a.click('home');a.click('mediaPractice',{kind:'listening',stage:'A2.1'});assert.match(a.el.innerHTML,/completed the Friends/);
});
test('completion practice recycles less recently retrieved familiar chunks rather than always the first six',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.completed=JSON.parse(fs.readFileSync('tests/fixtures/a1-activity-ids.json','utf8'));const a=app({},initial);a.click('mediaPractice',{kind:'speaking',stage:'A1.1'});const first=[];for(let i=0;i<6;i++){first.push(a.current().id);a.answer();a.click('next');}a.click('home');a.click('mediaPractice',{kind:'speaking',stage:'A1.1'});assert.ok(!first.includes(a.current().id));
});
test('all 16 checkpoints assess listening and pass at eight of nine without duplicate completion events',()=>{
 const a=app();for(const l of a.ctx.Curriculum.lessons.filter(l=>l.checkpoint)){
  a.click('lesson',{id:l.id});for(let i=0;i<9;i++){a.answer(i<7);a.click('check');a.click('next');}assert.ok(!a.state().completed.includes(l.id));a.click('retry');for(let i=0;i<9;i++){a.answer(i<8);a.click('check');a.click('next');}assert.ok(a.state().completed.includes(l.id));assert.equal(a.state().capabilities.filter(c=>c.id===l.id).length,1);
 }
 assert.equal(a.state().events.filter(e=>e.type==='lesson').length,16);
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
 const a=app({AndroidSpeech:{isReady:()=>false,speak(){throw Error('should not speak');}}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='u0l1');startAt(a,l,5);a.click('listen');a.click('answer',{index:'0'});a.click('check');assert.equal(a.state().active.selected,null);assert.equal(a.state().active.checked,false);assert.equal(a.state().active.answers.length,5);a.click('skipListening');assert.equal(a.state().active.answers.at(-1),null);assert.match(a.el.innerHTML,/Spanish transcript/);
});
