const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function app(extra={},initial=null){
 const handlers={},storage=initial?{'friends-to-amigos-v1':JSON.stringify(initial)}:{},effects={blobs:[],links:[],toasts:[]};
 const el={innerHTML:'',addEventListener:(type,fn)=>handlers[type]=fn};
 const nodes={app:el,stage:{value:'A2.1'},'check-answer':{disabled:true},importfile:{click(){}}};
 const ctx={console,Date,JSON,Math,String,Number,Object,Array,Set,Map,Blob,
  URL:{createObjectURL(blob){effects.blobs.push(blob);return 'blob:backup';},revokeObjectURL(){}},
  setInterval:()=>{},setTimeout:()=>{},confirm:()=>true,
  localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},
  document:{hidden:false,getElementById:id=>nodes[id]||null,addEventListener:()=>{},createElement:tag=>({className:'',textContent:'',remove(){},click(){effects.links.push(this);}}),body:{append(el){effects.toasts.push(el);}}}
 };
 Object.assign(ctx,extra);ctx.window=ctx;ctx.globalThis=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);
 for(const f of ['stories.js','a12-stories.js','a12.js','curriculum.js','engine.js','app.js'])vm.runInContext(fs.readFileSync('www/'+f,'utf8'),ctx);
 const api={el,ctx,effects,nodes,storage,click:(action,data={})=>handlers.click({target:{closest:()=>({dataset:{action,...data}})}}),
  input:value=>handlers.input({target:{id:'written-answer',value}}),
  current:()=>vm.runInContext('quiz?.questions[quiz.index]',ctx),
  state:()=>JSON.parse(storage['friends-to-amigos-v1']),
  import:async data=>handlers.change({target:{id:'importfile',files:[{text:async()=>typeof data==='string'?data:JSON.stringify(data)}]}})
 };
 api.answer=(correct=true)=>{const q=api.current();if(q.type==='text')api.input(correct?q.accepted[0]:'incorrect response');else api.click('answer',{index:String(q.options.findIndex(x=>correct?x===q.answer:x!==q.answer))});};
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
 assert.deepEqual(played,['audio/failure.mp3','audio/success.mp3']);assert.deepEqual(paused,['audio/failure.mp3']);
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
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8'));let json;
 const native=app({AndroidSpeech:{exportProgress:data=>json=data}},legacy);native.click('export');assert.deepEqual(JSON.parse(json),legacy);
 const browser=app({},legacy);browser.click('export');assert.equal(browser.effects.links[0].download,'friends-to-amigos-progress.json');assert.deepEqual(JSON.parse(await browser.effects.blobs[0].text()),legacy);
 const target=app();target.click('begin');await target.import(json);assert.deepEqual(target.state(),legacy);target.click('continue');assert.match(target.el.innerHTML,/Ana y Luis/);
 const cancelled=app({confirm:()=>false},legacy);await cancelled.import({...legacy,name:'Replacement'});assert.equal(cancelled.state().name,legacy.name);
 const invalid=app({},legacy);await invalid.import('{broken');assert.equal(invalid.state().name,legacy.name);assert.ok(invalid.effects.toasts.length>0);
});
test('every revised activity and question renders, completes and can be retried',()=>{
 const a=app();for(const lesson of a.ctx.Curriculum.lessons){
  a.click('lesson',{id:lesson.id});if(lesson.reading)a.click('readStory');
  for(const q of lesson.questions){assert.ok(a.el.innerHTML.includes(q.prompt.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))));a.answer();a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);a.click('next');}
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
