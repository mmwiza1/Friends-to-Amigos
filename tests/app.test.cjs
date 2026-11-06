const {test}=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const app=require('./helpers/v12-app.cjs');
const {startAt,escapeHTML,go,locateQuestion,gameLearner,answerGame,finishLesson,tableLearner,fillTable,startFocusedTest,finishFocusedTest}=require('./helpers/app-scenarios.cjs');
test('new learner starts, misses a question, sees review and resumes correctly',()=>{
 const a=app();assert.match(a.el.innerHTML,/Start learning/);a.click('continue');assert.match(a.el.innerHTML,/Where shall we begin/);a.click('begin');
 a.answer(false);a.click('check');assert.match(a.el.innerHTML,/Let’s learn from this/);a.click('leave');assert.match(a.el.innerHTML,/Resume lesson/);assert.equal(Object.keys(a.state().reviews).length,1);
 a.click('continue');assert.match(a.el.innerHTML,/Let’s learn from this/);a.click('next');
 for(let i=1;i<5;i++){a.answer(i===1);a.click('check');a.click('next');}
 assert.match(a.el.innerHTML,/Keep building confidence/);assert.equal(a.state().completed.length,0);
 a.click('home');a.click('tab',{tab:'Review'});assert.match(a.el.innerHTML,/4 items ready for spaced review/);
});
test('placement accepts recommended start',()=>{
 const a=app();a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}
 assert.match(a.el.innerHTML,/B2.1/);a.click('acceptPlacement');assert.equal(a.state().stage,'A2.2');assert.doesNotMatch(a.el.innerHTML,/Lessons are not yet available/);assert.match(a.el.innerHTML,/How things used to be/);assert.match(a.el.innerHTML,/B2.2/);
});
test('five-question lessons show the correct bull result',()=>{
 for(const [correct,mood] of [[true,'happy'],[false,'sad']]){
  const a=app();a.click('begin');for(let i=0;i<5;i++){a.answer(correct);a.click('check');a.click('next');}
  if(correct){assert.match(a.el.innerHTML,/Lesson complete/);assert.doesNotMatch(a.el.innerHTML,/lesson-bull/);}else assert.match(a.el.innerHTML,new RegExp('lesson-bull '+mood));
 }
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
test('every revised activity and question renders, completes and can be retried',()=>{
 const a=app();for(const lesson of a.ctx.Curriculum.lessons){
  a.click('lesson',{id:lesson.id});if(lesson.reading)a.click('readStory');
  for(const q of lesson.questions){assert.equal(a.el.innerHTML.match(/<h2 class="question"[^>]*>([\s\S]*?)<\/h2>/)?.[1].replace(/<[^>]*>/g,''),escapeHTML(q.promptEs||q.prompt),q.id+' visible prompt');a.answer();a.click('check');assert.match(a.el.innerHTML,q.type==='speaking'?/You marked: I got it|Lo he conseguido/:q.writing?.mode&&q.writing.mode!=='controlled'?/natural response|possible model|accepted alternative/:/✓ Correct/);if(q.writing&&q.writing.mode!=='controlled')a.click('writingReflect',{result:'got'});const roundTrip=a.ctx.ProgressStore.parse(JSON.stringify(a.state()),a.ctx.Curriculum,{import:true}).state;assert.ok(roundTrip.active);assert.equal(roundTrip.active.questions[roundTrip.active.index].id,q.id);assert.equal(roundTrip.active.checked,true);a.click('next');}
  assert.ok(a.state().completed.includes(lesson.id));a.click('retry');assert.equal(a.state().active.lesson.id,lesson.id);a.click('leave');
 }
 assert.equal(new Set(a.state().completed).size,a.ctx.Curriculum.lessons.length);
});
test('course map shows practical future progression without exposing unavailable lessons',()=>{
 const a=app();a.click('tab',{tab:'Learn'});
 for(const stage of a.ctx.Curriculum.stageInfo){a.click('viewStage',{stage:stage.id});assert.ok(a.el.innerHTML.includes(stage.goal));for(const task of stage.tasks)assert.ok(a.el.innerHTML.includes(task));}
 assert.equal((a.el.innerHTML.match(/data-action="lesson"/g)||[]).length,72);
 assert.equal((a.el.innerHTML.match(/Lessons are not yet available/g)||[]).length,0);
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
 const before=a.el.innerHTML;a.click('viewStage',{stage:'C1.1'});a.click('lesson',{id:'c11u0l0'});assert.equal(a.el.innerHTML,before);
 a.click('viewStage',{stage:'A1.1'});assert.match(a.el.innerHTML,/data-id="u0l0"/);
 const saved=a.ctx.Engine.fresh();saved.stage='A1.2';const loaded=app({},saved);loaded.click('tab',{tab:'Learn'});assert.match(loaded.el.innerHTML,/data-id="a12u0l0"/);
});
test('A1.2 story responses survive resume and missed comprehension retains its passage in review',()=>{
 const a=app();a.click('lesson',{id:'a12u5story1'});assert.match(a.el.innerHTML,/Las llaves de Luis/);assert.match(a.el.innerHTML,/Word help/);assert.match(a.el.innerHTML,/help a visitor/);
 a.click('readStory');a.answer();a.click('check');a.click('next');a.input('un libro');a.click('leave');
 const resumed=app({},a.state());resumed.click('continue');assert.match(resumed.el.innerHTML,/value="un libro"/);resumed.click('check');assert.match(resumed.el.innerHTML,/✓ Correct/);resumed.click('next');resumed.answer(false);resumed.click('check');resumed.click('leave');resumed.click('review');assert.match(resumed.el.innerHTML,/Read the story again|Volver a leer el texto/);assert.match(resumed.el.innerHTML,/No encuentro mis llaves/);
});
test('all A1.2 checkpoints fail at seven, pass at eight and never duplicate capabilities',()=>{
 const a=app();for(const lesson of a.ctx.Curriculum.lessons.filter(l=>l.stage==='A1.2'&&l.checkpoint)){
  a.click('lesson',{id:lesson.id});for(let i=0;i<9;i++){a.answer(i<7);a.click('check');a.click('next');}assert.ok(!a.state().completed.includes(lesson.id));
  a.click('retry');for(let i=0;i<9;i++){a.answer(i<8);a.click('check');a.click('next');}assert.ok(a.state().completed.includes(lesson.id));
  a.click('retry');for(let i=0;i<9;i++){a.answer();a.click('check');a.click('next');}assert.equal(a.state().capabilities.filter(c=>c.id===lesson.id).length,1);
 }
 assert.equal(a.state().capabilities.length,8);assert.equal(a.state().events.filter(e=>e.type==='lesson').length,8);
});
test('placement recommendations offer only implemented courses and chosen A1.2 starts there',()=>{
 const a=app();a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}
 assert.match(a.el.innerHTML,/B2.1/);assert.match(a.el.innerHTML,/cannot certify/);assert.match(a.el.innerHTML,/<option[^>]*>B2.2/);
 a.nodes.stage.value='A1.2';a.click('acceptPlacement');assert.equal(a.state().stage,'A1.2');a.click('home');a.click('continue');assert.equal(a.state().active.lesson.id,'a12u0l0');
});
test('all 48 listening transcripts are absent from the initial DOM and revealed only after submission',()=>{
 const heard=[],a=app({AndroidSpeech:{speak:text=>heard.push(text)}});for(const l of a.ctx.Curriculum.lessons)for(let i=0;i<l.questions.length;i++)if(l.questions[i].listening){
  startAt(a,l,i);const q=a.current();assert.doesNotMatch(a.el.innerHTML,/Spanish transcript|Texto del audio/);assert.ok(!a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));
  a.click('check');assert.equal(a.state().active.checked,false);a.click('next');assert.equal(a.current().id,q.id);
  a.answer();assert.ok(!a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));a.click('check');assert.match(a.el.innerHTML,/Spanish transcript|Texto del audio/);assert.ok(a.el.innerHTML.includes(escapeHTML(q.listening.transcript)));assert.ok(heard.includes(q.listening.transcript));
 }
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
test('speaking model/self-assessment snapshots resume in both stages',()=>{
 for(const id of ['u0l2','a12u6l2']){const a=app(),l=a.ctx.Curriculum.lessons.find(l=>l.id===id);startAt(a,l,6);a.click('revealModel');a.click('leave');const b=app({},a.state());b.click('continue');assert.match(b.el.innerHTML,/One possible response|Una respuesta posible/);assert.equal(b.state().active.modelRevealed,true);b.click('selfAssess',{result:'got'});b.click('leave');const c=app({},b.state());c.click('continue');assert.match(c.el.innerHTML,/You marked: I got it|Lo he conseguido/);c.click('next');assert.ok(c.state().completed.includes(id));}
});
test('complete A1 home celebrates capabilities, review and practice while offering the playable A2.1 continuation',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.completed=JSON.parse(fs.readFileSync('tests/fixtures/a1-activity-ids.json','utf8'));initial.sessions['2026-10-05']={seconds:120,practised:true};
 const a=app({},initial);assert.match(a.el.innerHTML,/completed the Friends to Amigos A1 course/);assert.match(a.el.innerHTML,/144 activities completed/);assert.match(a.el.innerHTML,/2 minutes practised/);assert.match(a.el.innerHTML,/not formal CEFR certification/);assert.match(a.el.innerHTML,/Continue to A2.1/);assert.match(a.el.innerHTML,/Recommended practice/);assert.match(a.el.innerHTML,/Browse all practice/);assert.doesNotMatch(a.el.innerHTML,/data-stage="B1.1/);
 a.click('mediaPractice',{kind:'speaking',stage:'A1.2'});for(let i=0;i<10;i++){a.answer();a.click('next');}assert.match(a.el.innerHTML,/self-assessed|Tú evalúas/);assert.equal(a.state().completed.length,144);assert.equal(a.state().capabilities.length,0);
 a.click('home');a.click('mediaPractice',{kind:'listening',stage:'B1.1'});assert.ok(a.ctx.FocusedPractice.eligible(a.state(),a.ctx.Curriculum,'listening').every(q=>q.practice.stage.startsWith('A')));assert.ok(a.current().practice.stage.startsWith('A'));assert.equal(a.state().completed.length,144);
});
test('completion practice recycles less recently retrieved familiar chunks rather than always the first ten',()=>{
 const initial=app().ctx.Engine.fresh();initial.onboarded=true;initial.completed=JSON.parse(fs.readFileSync('tests/fixtures/a1-activity-ids.json','utf8'));const a=app({},initial);a.click('mediaPractice',{kind:'speaking',stage:'A1.1'});const first=[];for(let i=0;i<10;i++){first.push(a.current().id);a.answer();a.click('next');}a.click('home');a.click('mediaPractice',{kind:'speaking',stage:'A1.1'});assert.ok(!first.includes(a.current().id));
});
test('all 32 checkpoints assess listening and pass at eight of nine without duplicate completion events',()=>{
 const a=app();for(const l of a.ctx.Curriculum.lessons.filter(l=>l.stage.startsWith('A')&&l.checkpoint)){
  a.click('lesson',{id:l.id});for(let i=0;i<9;i++){a.answer(i<7);a.click('check');a.click('next');}assert.ok(!a.state().completed.includes(l.id));a.click('retry');for(let i=0;i<9;i++){a.answer(i<8);a.click('check');a.click('next');}assert.ok(a.state().completed.includes(l.id));assert.equal(a.state().capabilities.filter(c=>c.id===l.id).length,1);
 }
 assert.equal(a.state().events.filter(e=>e.type==='lesson').length,32);
});
test('a valid historical attempt can resume even with an explicit incomplete onboarding flag',()=>{
 const old=JSON.parse(fs.readFileSync('tests/fixtures/v1-mixed-progress.json','utf8'));old.onboarded=false;const a=app({},old);assert.match(a.el.innerHTML,/Resume lesson/);a.click('continue');assert.equal(a.current().prompt,old.active.questions[old.active.index].prompt);assert.equal(a.state().onboarded,false);
});
test('unavailable listening cannot be guessed for credit; only retry or an explicit missed skip is allowed',()=>{
 const a=app({AndroidSpeech:{isReady:()=>false,speak(){throw Error('should not speak');}}}),l=a.ctx.Curriculum.lessons.find(l=>l.id==='u0l1');startAt(a,l,5);a.click('listen');a.click('answer',{index:'0'});a.click('check');assert.equal(a.state().active.selected,null);assert.equal(a.state().active.checked,false);assert.equal(a.state().active.answers.length,5);a.click('skipListening');assert.equal(a.state().active.answers.at(-1),null);assert.match(a.el.innerHTML,/Spanish transcript|Texto del audio/);
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
 const seed=app(),s=seed.ctx.Engine.fresh();s.onboarded=true;s.completed=seed.ctx.Curriculum.lessons.map(l=>l.id);const a=app({},s);a.click('today');assert.ok(a.current().id.startsWith('b22'));assert.equal(a.state().active,null);assert.equal(a.state().completed.length,a.ctx.Curriculum.lessons.length);
});
test('multiple choice exposes a radio group, clear selection and the unchanged select-then-check flow',()=>{
 const a=app();a.click('begin');const q=a.current(),index=q.options.indexOf(q.answer),events=a.state().events.length;
 assert.match(a.el.innerHTML,/Choose one answer/);assert.match(a.el.innerHTML,/class="choices quiz-choices" role="radiogroup"/);
 const options=[...a.el.innerHTML.matchAll(/<button\b([^>]*\brole="radio"[^>]*)>/g)];assert.equal(options.length,q.options.length);for(const [,attrs] of options)assert.match(attrs,/aria-checked="false"/);
 assert.equal((a.el.innerHTML.match(/class="option-indicator" aria-hidden="true"/g)||[]).length,q.options.length);
 a.click('answer',{index:String(index)});assert.equal(a.state().active.checked,false);assert.equal(a.state().events.length,events);
 assert.equal(a.effects.focused.at(-1),String(index));
 const selected=[...a.el.innerHTML.matchAll(/<button\b([^>]*\brole="radio"[^>]*)>/g)].find(([,attrs])=>attrs.includes('data-index="'+index+'"'));assert.ok(selected);assert.match(selected[1],/aria-checked="true"/);assert.match(selected[1],/tabindex="0"/);
 assert.equal((a.el.innerHTML.match(/aria-checked="true"/g)||[]).length,1);a.click('check');assert.equal(a.state().active.answers.at(-1),true);
 assert.equal(a.state().events.length,events+1);assert.match(a.el.innerHTML,/✓ Correct/);
});
test('radio arrow, Home and End keys select options without prematurely scoring',()=>{
 const a=app();a.click('begin');const q=a.current(),events=a.state().events.length;
 const key=(key,index)=>a.key(key,{target:{closest:selector=>selector==='[data-action="answer"]'?{dataset:{index:String(index)}}:null}});
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
test('unexpected wrong answers receive transparent comparison without changing accepted-answer scoring',()=>{
 const a=app();a.click('lesson',{id:'u0write'});go(a,'xyz unfamiliar phrase');
 const q=a.current(),feedback=a.ctx.Engine.answerFeedback(q,'xyz unfamiliar phrase');
 assert.match(feedback.explanation,/outside the accepted examples/);assert.match(feedback.explanation,/another phrasing may still be valid/);
 assert.ok(a.el.innerHTML.includes(escapeHTML(feedback.explanation)));assert.match(a.el.innerHTML,/<mark>/);assert.equal(a.state().active.answers.at(-1),false);
 a.click('leave');a.click('review');a.input(q.accepted[0]);a.click('check');assert.match(a.el.innerHTML,/✓ Correct/);assert.equal(a.state().reviews[q.id].success,1);
});
test('passed normal lesson offers Continue learning and starts the next required lesson',()=>{
 const a=app();a.click('begin');finishLesson(a);assert.match(a.el.innerHTML,/Continue to story/);assert.match(a.el.innerHTML,/Finish for now/);assert.equal(a.state().completed[0],'u0l0');a.click('continueLearning');assert.equal(a.state().active.lesson.id,require('../www/curriculum').lessons[1].id);
});
test('failed normal lesson offers retry and mistake review and cannot jump forwards',()=>{
 const a=app();a.click('begin');finishLesson(a,false);assert.doesNotMatch(a.el.innerHTML,/Continue learning/);assert.match(a.el.innerHTML,/Try again/);assert.match(a.el.innerHTML,/Review mistakes/);a.click('continueLearning');assert.equal(a.state().active,null);assert.deepEqual(a.state().completed,[]);a.click('lessonMistakes');assert.equal(vm.runInContext('quiz.kind',a.ctx),'review');assert.match(a.el.innerHTML,/Question 1/);
});
test('passed final required lesson continues into due review rather than optional earlier material',()=>{
 const C=require('../www/curriculum'),E=require('../www/engine'),s=gameLearner('A1.2');s.startStage='A1.2';s.stage='A1.2';s.completed=C.lessons.filter(l=>l.stage!=='A1.1').slice(0,-1).map(l=>l.id);E.recordAnswer(s,C.lessons[0].questions[0],false,0);
 const a=app({},s);a.click('lesson',{id:C.lessons.at(-1).id});finishLesson(a);a.click('continueLearning');assert.equal(vm.runInContext('quiz.kind',a.ctx),'review');assert.equal(a.state().active,null);assert.ok(a.state().completed.every(id=>id.startsWith('a12')||id.startsWith('a21')||id.startsWith('a22')||/^b[12][12]/.test(id)));
});
test('completed playable path continues to maintenance without advertising A2.2 or fake lesson completions',()=>{
 const C=require('../www/curriculum'),s=gameLearner('A1.2');s.completed=C.lessons.slice(0,-1).map(l=>l.id);const a=app({},s);a.click('lesson',{id:C.lessons.at(-1).id});finishLesson(a);a.click('continueLearning');assert.equal(vm.runInContext('quiz.kind',a.ctx),'practice');assert.ok(a.current().listening);assert.doesNotMatch(a.el.innerHTML,/data-action="lesson"/);assert.match(a.effects.toasts.at(-1).textContent,/required playable path is complete/);
});
test('Today continuation wins over normal lesson Continue learning and keeps the saved course path',()=>{
 const s=require('../www/engine').fresh();s.onboarded=true;const a=app({},s);a.click('today');finishLesson(a);assert.match(a.el.innerHTML,/Continue today’s session/);assert.doesNotMatch(a.el.innerHTML,/data-action="continueLearning"/);a.click('todayNext');assert.equal(vm.runInContext('quiz.kind',a.ctx),'practice');assert.deepEqual(a.state().completed,['u0l0']);
});
test('a partial lesson cannot trigger result continuation or overwrite the resumable attempt',()=>{
 const a=app();a.click('begin');a.answer();a.click('check');const before=a.state();a.click('continueLearning');assert.deepEqual(a.state(),before);assert.equal(a.state().active.lesson.id,'u0l0');assert.equal(a.state().active.answers.length,1);
});
test('Today’s Review is visible, handles an empty learner and uses the existing scheduled review checker',()=>{const seed=app();assert.match(seed.el.innerHTML,/Today’s Review/);seed.click('dailyReview');assert.equal(seed.current(),undefined);const s=seed.ctx.Engine.fresh(),q=seed.ctx.Curriculum.lessons[0].questions[0];seed.ctx.Engine.recordAnswer(s,q,false,0);const a=app({},s);a.click('dailyReview');assert.equal(a.current().id,q.id);a.answer();a.click('check');assert.equal(a.state().reviews[q.id].success,1);assert.ok(a.state().mastery);assert.equal(a.state().completed.length,0);});
test('A2.1 placement starts the playable new stage and retains earlier course revision without invented rewards',()=>{const a=app();a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}a.nodes.stage.value='A2.1';a.click('acceptPlacement');assert.equal(a.state().startStage,'A2.1');assert.match(a.el.innerHTML,/data-id="a21u0l0"/);a.click('home');a.click('continue');assert.equal(a.state().active.lesson.id,'a21u0l0');assert.deepEqual(a.state().completed,[]);a.click('leave');a.click('blanksNormal');assert.ok(a.state().blanks.active.tables.some(t=>t.target.stage==='A2.1'));assert.ok(a.state().blanks.active.tables.every(t=>t.rows.length===2));});
test('A1 milestone remains accurate while the next required lesson becomes A2.1; completing the playable path ends at B2 without exposing C1',()=>{const s=tableLearner(),a=app({},s);assert.match(a.el.innerHTML,/course through B2/);assert.match(a.el.innerHTML,/576 activities completed/);assert.match(a.el.innerHTML,/end of the playable course/);assert.match(a.el.innerHTML,/not formal CEFR certification/);a.click('continue');assert.equal(a.state().active,null);assert.match(a.el.innerHTML,/Review & grow/);});
test('A1 milestone summarises only personally practised outcomes and keeps an unfinished A2.1 lesson resumable',()=>{const s=tableLearner();s.completed=s.completed.filter(id=>!/^a2[12]/.test(id));const a=app({},s);assert.match(a.el.innerHTML,/A1 course/);assert.doesNotMatch(a.el.innerHTML,/Explain basic symptoms and say what you need/);a.click('continue');a.input('A2 draft');a.click('leave');assert.match(a.el.innerHTML,/Resume your saved lesson/);a.click('continue');assert.equal(a.state().active.lesson.id,'a21u0l0');});
test('advanced recognition placement recommends the highest playable start while retaining the provisional screening result',()=>{const a=app();a.click('placement');for(let i=0;i<8;i++){a.answer();a.click('check');a.click('next');}assert.match(a.el.innerHTML,/<div class="stat">B2.1<\/div>/);assert.match(a.el.innerHTML,/cannot certify/);assert.match(a.el.innerHTML,/B2.2/);assert.equal(a.state().placement.stage,'B2.1');});
test('successful use enables compact listening controls while retaining offline guidance, replay, speed and transcript rules',()=>{const a=app({},tableLearner());startFocusedTest(a,'listening');assert.match(a.el.innerHTML,/Listen to familiar Spanish, then answer/);a.answer();a.click('check');a.click('next');assert.match(a.el.innerHTML,/compact-media/);assert.doesNotMatch(a.el.innerHTML,/Play \/ replay Spanish \(TTS\)/);assert.doesNotMatch(a.el.innerHTML,/Listen to familiar Spanish, then answer/);assert.match(a.el.innerHTML,/About listening practice/);assert.match(a.el.innerHTML,/offline Spanish voice/);assert.match(a.el.innerHTML,/Spanish \(Spain\) · synthetic voice/);assert.match(a.el.innerHTML,/0.75×/);assert.match(a.el.innerHTML,/Normal · 1×/);assert.match(a.el.innerHTML,/Skip for now/);assert.doesNotMatch(a.el.innerHTML,/summary>Spanish transcript/);});
test('deliberate speaking self-assessment enables compact instructions with accessible full explanation',()=>{const a=app({},tableLearner());startFocusedTest(a,'speaking');assert.match(a.el.innerHTML,/does not record your voice or assess pronunciation/);a.click('revealModel');a.click('selfAssess',{result:'needs'});a.click('next');assert.match(a.el.innerHTML,/Say it aloud, then reveal/);assert.match(a.el.innerHTML,/About speaking practice/);assert.match(a.el.innerHTML,/self-assessed|Tú evalúas/);assert.ok(!a.el.innerHTML.includes(escapeHTML(a.current().spanish)));});
test('very early learner receives clear taught-material guidance rather than a short or future-grammar session',()=>{const a=app();a.click('mediaPractice',{kind:'listening',stage:'A2.1'});assert.equal(a.current(),undefined);assert.match(a.effects.toasts.at(-1).textContent,/Ten taught items/);assert.equal(vm.runInContext('state.focused',a.ctx),undefined);});
test('guided writing supports multiline comparison, revision, resume and one assisted reflection',()=>{
 const a=app();a.click('lesson',{id:'b11u0write'});for(let i=0;i<3;i++){const q=a.current();a.answer();a.click('check');if(q.writing?.mode!=='controlled')a.click('writingReflect',{result:'got'});a.click('next');}
 assert.equal(a.current().writing.mode,'guided');assert.match(a.el.innerHTML,/<textarea/);a.input('Tengo una idea diferente.\nQuiero explicarla.');a.key('Enter');assert.equal(a.state().active.answers.length,3);a.click('check');assert.match(a.el.innerHTML,/could not confidently assess/);assert.equal(a.state().active.answers.length,3);a.click('leave');const restored=app({},a.state());restored.click('continue');assert.match(restored.el.innerHTML,/Tengo una idea diferente/);restored.click('writingRevise');restored.input('Otra formulación natural.');restored.click('check');restored.click('writingReflect',{result:'needs'});restored.click('writingReflect',{result:'needs'});const s=restored.state();assert.equal(s.active.answers.length,4);assert.equal(s.active.answers[3],null);assert.equal(s.active.hintRevealed,true);assert.equal(s.active.writingResponses[3].response,'Otra formulación natural.');assert.equal(s.reviews[restored.current().id].question.previousResponse,'Otra formulación natural.');assert.equal(s.events.filter(e=>e.questionId===restored.current().id).length,1);assert.match(restored.el.innerHTML,/Continue/);
});
test('unknown open response with HTML characters is escaped and never awarded verified accuracy',()=>{
 const a=app();a.click('lesson',{id:'b22u7write'});for(let i=0;i<3;i++){const q=a.current();a.answer();a.click('check');if(q.writing?.mode!=='controlled')a.click('writingReflect',{result:'got'});a.click('next');}a.input('<script>alert(1)</script> Una alternativa.');a.click('check');assert.doesNotMatch(a.el.innerHTML,/<script>alert/);assert.match(a.el.innerHTML,/&lt;script&gt;/);a.click('writingReflect',{result:'got'});assert.equal(a.state().active.answers[3],null);assert.ok(a.state().events.at(-1).selfAssessed);
});
test('failed lesson mistake practice does not label an uncertain positive reflection as incorrect',()=>{const a=app();a.click('lesson',{id:'b11u0write'});for(let i=0;i<5;i++){const q=a.current();a.answer(false);a.click('check');if(q.writing?.mode!=='controlled')a.click('writingReflect',{result:'got'});a.click('next');}assert.match(a.el.innerHTML,/Keep building confidence/);a.click('lessonMistakes');assert.equal(vm.runInContext('quiz.questions.length',a.ctx),2);assert.ok(vm.runInContext('quiz.questions.every(q=>q.writing.mode===\'controlled\')',a.ctx));});
