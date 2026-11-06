const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const app=require('./helpers/v12-app.cjs');
const {startAt,escapeHTML,go,locateQuestion,gameLearner,answerGame,finishLesson,tableLearner,fillTable,startFocusedTest,finishFocusedTest}=require('./helpers/app-scenarios.cjs');
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
test('gap feedback shows the completed sentence and a missed gap survives resume',()=>{
 const a=app();locateQuestion(a,q=>q.type==='gap'&&/^Me llamo Ana[.!]?$/.test(q.spanish)&&/needs me/.test(q.explanation));
 assert.match(a.el.innerHTML,/Complete:/);assert.match(a.el.innerHTML,/fills all gaps, in order/);
 a.answer(false);a.click('check');assert.match(a.el.innerHTML.replace(/<\/?mark>/g,''),/Me llamo Ana/);assert.match(a.el.innerHTML,/needs me/);
 const review=Object.values(a.state().reviews)[0];assert.equal(review.question.type,'gap');
 const resumed=app({},a.state());resumed.click('continue');assert.match(resumed.el.innerHTML.replace(/<\/?mark>/g,''),/Me llamo Ana/);
});
test('recall answers cannot be heard before answering; both TTS paths remain available afterwards',()=>{
 const spoken=[],a=app({AndroidSpeech:{speak:text=>spoken.push(text)}});
 locateQuestion(a,q=>q.type==='text'&&q.answer==='Me llamo Ana'&&q.mode==='recall');
 assert.match(a.el.innerHTML,/From memory/);assert.doesNotMatch(a.el.innerHTML,/data-action="speak"/);
 a.answer();a.click('check');assert.match(a.el.innerHTML,/data-action="speak"/);a.click('speak');assert.deepEqual(spoken,['Me llamo Ana']);
 a.click('leave');a.click('lesson',{id:'u0story0'});a.click('speakStory');assert.equal(spoken[1],a.ctx.Curriculum.lessons.find(l=>l.id==='u0story0').reading.text);
 const utterances=[],b=app({SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES'}],cancel(){},speak(u){utterances.push(u);u.onstart?.();}}});
 b.click('begin');b.answer();b.click('check');b.click('speak');assert.equal(utterances[0].lang,'es-ES');assert.equal(utterances[0].text,'Hola');
});
test('A1.2 plan feedback teaches missing a and does not reveal the recall model early',()=>{
 const a=app();a.click('lesson',{id:'a12u2l0'});for(let i=0;i<2;i++){a.answer();a.click('check');a.click('next');}
 assert.doesNotMatch(a.el.innerHTML,/data-action="speak"/);a.input('Voy leer mañana');a.click('check');assert.match(a.el.innerHTML,/Keep a between voy/);assert.match(a.el.innerHTML,/data-action="speak"/);
});
test('historical future-stage recommendations stay valid and fall back to playable content',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.stage='B2.1';const a=app({},initial);a.click('continue');assert.equal(a.state().active.lesson.stage,'A1.1');assert.equal(a.state().stage,'B2.1');
});
test('listening plays on browser speech path and replay does not inflate answer statistics',()=>{
 const played=[],a=app({SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak:u=>{played.push(u);u.onstart?.();}}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='a12u1l2');startAt(a,l,5);
 a.click('answer',{index:'0'});assert.equal(a.state().active.selected,null);a.click('listen');a.click('listen');assert.equal(played.length,2);assert.equal(played[0].lang,'es-ES');assert.equal(played[0].rate,.75);
 a.answer();a.click('check');const count=a.state().events.length;a.click('listen');a.click('check');assert.equal(a.state().events.length,count);
});
test('speaking requires deliberate reveal, has no automatic grading and needs-practice enters spaced review',()=>{
 const heard=[],a=app({AndroidSpeech:{speak:text=>heard.push(text)}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='a12u2l2');startAt(a,l,6);heard.length=0;const q=a.current();assert.match(a.el.innerHTML,/self-assessed|Tú evalúas/);assert.ok(!a.el.innerHTML.includes(escapeHTML(q.spanish)));
 a.click('selfAssess',{result:'got'});a.click('speak');a.click('check');assert.equal(a.state().active.checked,false);assert.equal(heard.length,0);
 a.click('revealModel');assert.ok(a.el.innerHTML.includes(escapeHTML(q.spanish)));a.click('speak');assert.deepEqual(heard,[q.spanish]);a.click('selfAssess',{result:'needs'});a.click('selfAssess',{result:'got'});assert.equal(a.state().events.filter(e=>e.questionId===q.id).length,1);assert.equal(a.state().events.at(-1).selfAssessed,true);assert.ok(a.state().reviews[q.id]);a.click('next');assert.match(a.el.innerHTML,/6 of 6 correct/);assert.ok(a.state().completed.includes(l.id));
 a.click('home');a.click('review');assert.equal(a.current().type,'speaking');assert.ok(!a.el.innerHTML.includes(escapeHTML(q.spanish)));a.click('revealModel');a.click('selfAssess',{result:'got'});assert.equal(a.state().reviews[q.id].success,1);a.click('next');a.click('retry');a.click('revealModel');a.click('selfAssess',{result:'got'});assert.equal(a.state().reviews[q.id].success,1);
});
test('native background/resume events stop media and exclude background time from learning statistics',()=>{
 let time=Date.parse('2026-10-06T12:00:00Z'),stopped=0;class Clock extends Date{constructor(...args){super(...(args.length?args:[time]));}static now(){return time;}}
 const a=app({Date:Clock,AndroidSpeech:{stop(){stopped++;}}});a.click('begin');time+=5000;a.lifecycle['fta-pause']();const seconds=Object.values(a.state().sessions).reduce((n,s)=>n+s.seconds,0);assert.equal(seconds,5);assert.ok(stopped>0);
 time+=3600000;a.ctx.tick();assert.equal(Object.values(a.state().sessions).reduce((n,s)=>n+s.seconds,0),5);a.lifecycle['fta-resume']();a.click('answer',{index:'0'});time+=2000;a.ctx.tick();assert.equal(Object.values(a.state().sessions).reduce((n,s)=>n+s.seconds,0),7);assert.equal(a.state().active.index,0);
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
test('wrong typed feedback shows the learner response, a natural model and why while escaping supplied HTML',()=>{
 const a=app();a.click('lesson',{id:'u0write'});const value='Mi <img src=x onerror=alert(1)> & nombre';go(a,value);
 assert.match(a.el.innerHTML,/Your answer/);assert.match(a.el.innerHTML,/A natural answer/);assert.match(a.el.innerHTML,/<summary>Why\?/);
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
test('Games is the fifth main navigation target with Home Back behavior and intact review badge',()=>{
 const a=app({},gameLearner());a.click('tab',{tab:'Games'});assert.match(a.el.innerHTML,/class="practice-hub"/);assert.match(a.el.innerHTML,/data-tab="Games"/);assert.equal((a.el.innerHTML.match(/data-action="tab"/g)||[]).length,5);assert.match(a.el.innerHTML,/class="active" data-action="tab" data-tab="Games"/);assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Today’s session/);assert.equal(a.ctx.FriendsToAmigos.handleBack(),false);
});
test('saved game survives native Back and reload without replacing a saved course lesson',()=>{
 const a=app({},gameLearner());a.click('lesson',{id:'u7l0'});a.answer();a.click('check');a.click('leave');const course=a.state().active;
 a.click('tab',{tab:'Games'});a.click('gameNew');answerGame(a,0);const game=a.state().games.active;assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Continue playing/);assert.deepEqual(a.state().active,course);
 const reloaded=app({},a.state());reloaded.click('tab',{tab:'Games'});reloaded.click('gameResume');assert.deepEqual(reloaded.state().games.active,game);assert.match(reloaded.el.innerHTML,/Let’s learn from this/);reloaded.click('gameNext');assert.match(reloaded.el.innerHTML,/Question 2 of 10/);assert.deepEqual(reloaded.state().active,require('../www/storage').migrateState(a.state(),require('../www/curriculum')).state.active);
});
test('Back to Home still leaves passed and failed lesson results safely',()=>{
 for(const correct of [true,false]){const a=app();a.click('begin');finishLesson(a,correct);a.click('home');assert.match(a.el.innerHTML,/Today’s session/);assert.equal(a.state().active,null);}
});
test('incorrect table feedback shows each choice, corrected form, wrong-person diagnosis and mistake practice',()=>{const a=app({},tableLearner());a.click('blanksNormal');fillTable(a,false);const r=a.state().blanks.active.results[0];assert.match(a.el.innerHTML,/You wrote\/chose/);assert.match(a.el.innerHTML,/A natural answer/);assert.match(a.el.innerHTML,/belongs to/);for(const d of r.details){assert.ok(a.el.innerHTML.includes(d.selected));assert.ok(a.el.innerHTML.includes(d.answer));}a.click('blanksNext');for(let i=1;i<3;i++){fillTable(a);a.click('blanksNext');}assert.match(a.el.innerHTML,/Practice mistakes/);a.click('blanksMistakes');assert.equal(a.state().blanks.active.mode,'practice');assert.equal(a.state().blanks.active.entry,'text');assert.ok(a.state().blanks.active.tables.every(t=>r.id===t.target.id));});
test('table written Go checks once, empty Go is inert, diagnostic feedback escapes entered HTML',()=>{const a=app({},tableLearner());a.nodes['table-entry']={value:'text'};a.click('blanksPractice');const target=value=>({id:'form-0',value,dataset:{cell:'0'},classList:{contains:x=>x==='table-input'}});const before=a.el.innerHTML;a.key('Enter',{target:target('')});assert.equal(a.el.innerHTML,before);vm.runInContext('state.blanks.active.selected=state.blanks.active.tables[0].rows.map(row=>state.blanks.active.tables[0].target.forms[row])',a.ctx);a.key('Enter',{target:target('<img src=x onerror=alert(1)>')});assert.equal(a.state().blanks.active.checked,true);assert.match(a.el.innerHTML,/&lt;img src=x/);assert.doesNotMatch(a.el.innerHTML,/<img src=x/);const count=a.state().blanks.active.results.length;a.key('Enter',{target:target('changed')});assert.equal(a.state().blanks.active.results.length,count);});
test('Weak Areas presents readable repeated mistakes and launches only unlocked focused practice; Back returns Review',()=>{const initial=tableLearner(),M=require('../www/mastery');for(let i=0;i<2;i++)M.record(initial,[{verb:'tener',tense:'present',person:'vosotros'}],false,{session:'s',item:'i'+i},100+i);const a=app({},initial);a.click('weakAreas');assert.match(a.el.innerHTML,/tener/);assert.match(a.el.innerHTML,/vosotros\/as/);assert.match(a.el.innerHTML,/Needs practice/);assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Review &amp; grow|Review & grow/);a.click('weakAreas');a.click('weakPractice',{key:'form:tener:present:vosotros'});assert.ok(a.state().blanks.active.tables.every(t=>t.target.verb==='tener'&&t.rows.includes(4)));});
test('focused speaking hides models and alternatives until reveal; both can use existing Spanish TTS',()=>{const heard=[],a=app({AndroidSpeech:{speak:text=>heard.push(text)}},tableLearner());startFocusedTest(a,'speaking','A1.1');const q=a.current();for(const model of q.models)assert.ok(!a.el.innerHTML.includes(escapeHTML(model)));a.click('speak');a.click('selfAssess',{result:'got'});assert.equal(heard.length,0);assert.equal(a.state().focused.active.checked,false);a.click('revealModel');assert.match(a.el.innerHTML,/One possible response|Una respuesta posible/);a.click('speak');assert.equal(heard[0],q.spanish);if(q.models.length>1){a.click('speakModel',{model:'1'});assert.equal(heard[1],q.models[1]);}a.click('selfAssess',{result:'needs'});a.click('selfAssess',{result:'got'});assert.equal(a.state().events.filter(e=>e.questionId===q.id).length,1);assert.equal(a.state().focused.active.answers[0],false);});
test('delayed focused playback keeps answer controls locked until actual native acknowledgement',()=>{let pending;const a=app({AndroidSpeech:{isReady:()=>true,listen(text,rate,id){pending=id;},stop(){}}},tableLearner());startFocusedTest(a,'listening');const q=a.current();a.click('listen');assert.equal(a.state().focused.active.audioPlayed,false);assert.match(a.el.innerHTML,/Starting audio/);a.answer();a.click('check');assert.equal(a.state().focused.active.answers.length,0);a.ctx.FriendsToAmigosSpeechResult(pending,true);assert.equal(a.state().focused.active.audioPlayed,true);a.answer();a.click('check');assert.match(a.el.innerHTML,/summary>Spanish transcript/);assert.ok(a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));});
test('complete focused TTS failure stays locked, offers guidance and supports saved review skip',()=>{const a=app({speechSynthesis:null},tableLearner());startFocusedTest(a,'listening');a.click('listen');assert.equal(a.state().focused.active.audioPlayed,false);assert.match(a.el.innerHTML,/Audio is unavailable/);a.answer();a.click('check');assert.equal(a.state().focused.active.answers.length,0);const q=a.current();a.click('skipListening');assert.equal(a.state().focused.active.answers[0],null);assert.ok(a.state().reviews[q.id]);});
test('focused Slow/Normal playback passes 0.75 and 1 to native speech without answering',()=>{const calls=[],a=app({AndroidSpeech:{isReady:()=>true,stop(){},listen(text,rate,id){calls.push(rate);a.ctx.FriendsToAmigosSpeechResult(id,true);}}},tableLearner());startFocusedTest(a,'listening');a.click('listen');a.click('listenSpeed',{rate:'1'});a.click('listen');assert.deepEqual(calls,[.75,1]);assert.equal(a.state().focused.active.answers.length,0);});
test('pending playback canceled by Back cannot later unlock a different focused question',()=>{let id;const a=app({AndroidSpeech:{isReady:()=>true,listen(t,r,i){id=i;},stop(){}}},tableLearner());startFocusedTest(a,'listening');a.click('listen');a.ctx.FriendsToAmigos.handleBack();a.click('focusedResume');a.ctx.FriendsToAmigosSpeechResult(id,true);assert.equal(a.state().focused.active.audioPlayed,false);assert.equal(a.state().focused.active.answers.length,0);});
test('background/foreground interruptions retain a focused attempt and stop active speech',()=>{let stops=0;const a=app({AndroidSpeech:{speak(){},stop(){stops++;}}},tableLearner());startFocusedTest(a,'speaking');a.click('revealModel');const before=a.state().focused.active,n=stops;a.lifecycle['fta-pause']();assert.ok(stops>n);a.lifecycle['fta-resume']();assert.deepEqual(a.state().focused.active,before);});
test('focused errors resurface through ordinary and Today review with hidden audio/models',()=>{const a=app({},tableLearner());startFocusedTest(a,'speaking');const q=a.current();a.click('revealModel');a.click('selfAssess',{result:'needs'});a.click('leave');a.click('dailyReview');assert.equal(a.current().id,q.id);assert.ok(!a.el.innerHTML.includes(escapeHTML(q.spanish)));a.click('revealModel');a.click('selfAssess',{result:'got'});assert.equal(a.state().reviews[q.id].success,1);});
test('practice again generates a new ten-item round and Back safely leaves its results destination',()=>{const a=app({},tableLearner());startFocusedTest(a,'listening');const ids=a.state().focused.active.questions.map(q=>q.id);finishFocusedTest(a);a.click('focusedAgain');assert.equal(a.state().focused.active.questions.length,10);assert.ok(a.state().focused.active.questions.every(q=>!ids.includes(q.id)));assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.match(a.el.innerHTML,/Friends to/);});
test('focused writing Go uses existing checking without duplicate submission',()=>{const a=app({},tableLearner()),q=a.ctx.FocusedBank.items.find(q=>q.listening&&q.type==='text');vm.runInContext(`startQuiz('practice',[FocusedBank.items.find(q=>q.id===${JSON.stringify(q.id)})]);`,a.ctx);a.click('listen');a.key('Enter',{target:{id:'written-answer',value:q.answer}});assert.equal(vm.runInContext('quiz.answers.length',a.ctx),1);a.key('Enter',{target:{id:'written-answer',value:q.answer}});assert.equal(vm.runInContext('quiz.answers.length',a.ctx),1);});
test('every focused bank item renders and completes with original speech/answer controls',()=>{const a=app({},tableLearner());for(let i=0;i<a.ctx.FocusedBank.items.length;i++){vm.runInContext(`startQuiz('practice',[FocusedBank.items[${i}]]);`,a.ctx);const q=a.current();assert.ok(a.el.innerHTML.includes(escapeHTML(q.promptEs||q.prompt)),q.id);a.answer();a.click('check');a.click('next');assert.match(a.el.innerHTML,/Session complete/);}assert.equal(a.state().completed.length,a.ctx.Curriculum.lessons.length);assert.equal(a.state().capabilities.length,0);});
