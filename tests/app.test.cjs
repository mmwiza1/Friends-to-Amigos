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
 for(const f of ['stories.js','curriculum.js','engine.js','app.js'])vm.runInContext(fs.readFileSync('www/'+f,'utf8'),ctx);
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
 assert.match(a.el.innerHTML,/B2.1/);a.click('acceptPlacement');assert.equal(a.state().stage,'A2.1');assert.match(a.el.innerHTML,/Lessons are not yet available/);
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
 assert.equal((a.el.innerHTML.match(/Lessons are not yet available/g)||[]).length,7);
});
test('practical goals appear in regular lessons and stories and survive legacy resume',()=>{
 const a=app();a.click('lesson',{id:'u2write'});assert.match(a.el.innerHTML,/Your practical goal/);assert.match(a.el.innerHTML,/Order a simple breakfast/);
 a.click('leave');a.click('lesson',{id:'u6story0'});assert.match(a.el.innerHTML,/follow a simple direction/);a.click('readStory');assert.match(a.el.innerHTML,/Your practical goal/);
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8')),resumed=app({},legacy);resumed.click('continue');assert.match(resumed.el.innerHTML,/Your practical goal/);assert.match(resumed.el.innerHTML,/Introduce yourself/);
});
