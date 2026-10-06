const {test}=require('node:test');const assert=require('node:assert/strict');const vm=require('node:vm');const fs=require('node:fs');
function app(extra={}){const handlers={},storage={},el={innerHTML:'',addEventListener:(type,fn)=>handlers[type]=fn};const ctx={console,Date,JSON,Math,String,Number,Object,Array,Set,Map,Blob,URL,setInterval:()=>{},setTimeout:()=>{},confirm:()=>true,localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},document:{hidden:false,getElementById:id=>id==='app'?el:{value:'A2.1'},addEventListener:()=>{},createElement:()=>({className:'',textContent:'',remove(){}}),body:{append(){}}}};Object.assign(ctx,extra);ctx.window=ctx;ctx.globalThis=ctx;ctx.addEventListener=()=>{};vm.createContext(ctx);for(const f of ['curriculum.js','engine.js','app.js'])vm.runInContext(fs.readFileSync('www/'+f,'utf8'),ctx);return {el,ctx,click:(action,data={})=>handlers.click({target:{closest:()=>({dataset:{action,...data}})}}),input:value=>handlers.input({target:{id:'written-answer',value}}),state:()=>JSON.parse(storage['friends-to-amigos-v1'])};}
test('new learner starts, misses a question, sees review and resumes correctly',()=>{const a=app();assert.match(a.el.innerHTML,/Start learning/);a.click('continue');assert.match(a.el.innerHTML,/Where shall we begin/);a.click('begin');a.click('answer',{index:'1'});a.click('check');assert.match(a.el.innerHTML,/Let’s learn from this/);a.click('leave');assert.match(a.el.innerHTML,/Resume lesson/);assert.equal(Object.keys(a.state().reviews).length,1);a.click('continue');assert.match(a.el.innerHTML,/Let’s learn from this/);a.click('next');a.click('answer',{index:'0'});a.click('check');a.click('next');for(let i=2;i<5;i++){a.click('answer',{index:'1'});a.click('check');a.click('next');}assert.match(a.el.innerHTML,/Keep building confidence/);assert.equal(a.state().completed.length,0);a.click('home');a.click('tab',{tab:'Review'});assert.match(a.el.innerHTML,/4<\/div>/);});
test('all main tabs and focused practice render',()=>{const a=app();for(const tab of ['Learn','Review','Profile','Home']){a.click('tab',{tab});assert.match(a.el.innerHTML,/Friends to/);}a.click('numbers');assert.match(a.el.innerHTML,/quince/);a.click('leave');a.click('time');assert.match(a.el.innerHTML,/one o’clock/);});
test('placement accepts recommended start',()=>{const a=app();a.click('placement');for(let i=0;i<8;i++){a.click('answer',{index:'0'});a.click('check');a.click('next');}assert.match(a.el.innerHTML,/B2.1/);a.click('acceptPlacement');assert.equal(a.state().stage,'A2.1');assert.match(a.el.innerHTML,/Lessons are not yet available/);});

test('answer feedback plays the matching recording once and stops the previous clip',()=>{
 const played=[],paused=[];
 class Audio{constructor(src){this.src=src;this.currentTime=0;}play(){played.push(this.src);return Promise.resolve();}pause(){paused.push(this.src);}}
 const a=app({Audio});a.click('continue');a.click('begin');
 a.click('answer',{index:'1'});a.click('check');a.click('check');
 assert.deepEqual(played,['audio/failure.mp3']);
 a.click('leave');a.click('continue');assert.equal(played.length,1);
 a.click('next');a.click('answer',{index:'0'});a.click('check');
 assert.deepEqual(played,['audio/failure.mp3','audio/success.mp3']);
 assert.deepEqual(paused,['audio/failure.mp3']);
});
test('unavailable audio does not block answer feedback or progress',async()=>{
 class Audio{play(){return Promise.reject(new Error('Playback blocked'));}pause(){}}
 const a=app({Audio});a.click('continue');a.click('begin');a.click('answer',{index:'1'});a.click('check');
 await Promise.resolve();assert.match(a.el.innerHTML,/Let’s learn from this/);assert.equal(Object.keys(a.state().reviews).length,1);
});

test('lesson results show the matching happy or sad bull at the pass threshold',()=>{
 for(const [answer,mood] of [['0','happy'],['1','sad']]){
  const a=app();a.click('continue');a.click('begin');
  for(let i=0;i<5;i++){a.click('answer',{index:answer});a.click('check');a.click('next');}
  assert.match(a.el.innerHTML,new RegExp('lesson-bull '+mood));
 }
});

test('gap questions show instructions, completed sentence, and save missed gaps for review',()=>{
 const a=app();a.click('continue');a.click('begin');
 for(let i=0;i<3;i++){a.click('answer',{index:'0'});a.click('check');a.click('next');}
 assert.match(a.el.innerHTML,/Fill the gaps/);assert.match(a.el.innerHTML,/fills all gaps, in order/);
 a.click('answer',{index:'1'});a.click('check');assert.match(a.el.innerHTML,/Me llamo Ana/);
 const review=Object.values(a.state().reviews)[0];assert.equal(review.question.type,'gap');
 a.click('leave');a.click('continue');assert.match(a.el.innerHTML,/Me llamo Ana/);
});

test('story reading waits for the learner and mixed answers survive leaving and resuming',()=>{
 const a=app(),story=a.ctx.Curriculum.lessons.find(l=>l.id==='u0story0');
 a.click('lesson',{id:story.id});assert.match(a.el.innerHTML,/Ready for questions/);assert.doesNotMatch(a.el.innerHTML,/Check answer/);
 a.click('check');assert.equal(a.state().active.answers.length,0);
 a.click('leave');a.click('continue');assert.match(a.el.innerHTML,/Ready for questions/);
 a.click('readStory');assert.match(a.el.innerHTML,/Read the story again/);
 a.click('answer',{index:String(story.questions[0].options.indexOf(story.questions[0].answer))});a.click('check');a.click('next');
 assert.match(a.el.innerHTML,/Answer in English or Spanish/);
 a.input('Inglaterra');a.click('leave');a.click('continue');assert.match(a.el.innerHTML,/value="Inglaterra"/);
 a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);a.click('next');
 a.click('answer',{index:String(story.questions[2].options.indexOf(story.questions[2].answer))});a.click('check');a.click('next');
 a.input('Spain');a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);a.click('next');
 a.click('answer',{index:String(story.questions[4].options.indexOf(story.questions[4].answer))});a.click('check');a.click('next');
 assert.ok(a.state().completed.includes(story.id));assert.equal(a.state().active,null);
});
test('Spanish writing rejects English, accepts normalized Spanish, and reviews keep story context',()=>{
 const a=app();a.click('lesson',{id:'u0write'});assert.match(a.el.innerHTML,/Write in Spanish/);
 a.input('My name is Ana');a.click('check');assert.match(a.el.innerHTML,/Let’s learn from this/);a.click('next');
 a.input('como te llamas');a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);
 a.click('leave');a.click('lesson',{id:'u0story0'});a.click('readStory');
 const q=a.ctx.Curriculum.lessons.find(l=>l.id==='u0story0').questions[0];
 a.click('answer',{index:String(q.options.findIndex(v=>v!==q.answer))});a.click('check');a.click('leave');a.click('review');a.input('Me llamo Ana');a.click('check');a.click('next');
 assert.match(a.el.innerHTML,/Read the story again/);assert.match(a.el.innerHTML,/Mi amigo se llama Luis/);
});
