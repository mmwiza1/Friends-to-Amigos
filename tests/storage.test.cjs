const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../www/curriculum'),E=require('../www/engine'),P=require('../www/storage');
const fixture=()=>JSON.parse(fs.readFileSync('tests/fixtures/v1-mixed-progress.json','utf8'));
const clone=x=>JSON.parse(JSON.stringify(x));
function memory(raw){const values=raw?{[P.KEY]:raw}:{};return {values,getItem:k=>values[k]||null,setItem:(k,v)=>values[k]=v};}
test('v1 migration preserves profile, placement, completion, capabilities and streak/time records',()=>{
 const old=fixture(),s=P.migrateState(old,C).state;assert.equal(s.version,2);for(const key of ['name','onboarded','stage','placement','completed','capabilities','events','sessions'])assert.deepEqual(s[key],old[key]);assert.deepEqual(E.streak(s,'2026-10-05'),{current:3,best:3});
});
test('matching v1 reviews map safely to permanent IDs and retain all scheduling counters',()=>{
 const old=fixture(),s=P.migrateState(old,C).state;assert.ok(s.reviews['a12u1l2-q3']);assert.ok(s.reviews['u5story0-q2']);
 for(const r of Object.values(old.reviews)){const saved=Object.values(s.reviews).find(x=>x.question.prompt===r.question.prompt);for(const field of ['wrong','success','due','corrected'])assert.equal(saved[field],r[field]);assert.ok(E.isCorrect(saved.question,saved.question.accepted[0]));}
});
test('unmatched ancient reviews retain their passage and usable legacy identities',()=>{
 const old=require('./fixtures/legacy-progress.json'),s=P.migrateState(old,C).state,r=Object.values(s.reviews)[0];assert.match(r.question.id,/^legacy-/);const passage=old.reviews[Object.keys(old.reviews)[0]].question.reading;assert.equal(r.question.reading.text,passage.text);assert.equal(r.question.reading.title,passage.title);assert.deepEqual(r.question.reading.glossary,passage.glossary||[]);assert.equal(s.active.questions[1].prompt,old.active.questions[1].prompt);
});
test('migration is deterministic, deeply idempotent and does not mutate its input',()=>{
 const old=fixture(),before=clone(old),a=P.migrateState(old,C).state,b=P.migrateState(old,C).state;assert.deepEqual(a,b);assert.deepEqual(P.migrateState(a,C).state,a);assert.deepEqual(old,before);
});
test('historical active snapshots retain question meaning, selected answer and position',()=>{
 const old=fixture(),s=P.migrateState(old,C).state;assert.equal(s.active.index,2);assert.equal(s.active.selected,old.active.selected);assert.deepEqual(s.active.answers,old.active.answers);for(let i=0;i<old.active.questions.length;i++)assert.equal(P.signature(s.active.questions[i]),P.signature(old.active.questions[i]));assert.equal(s.active.lesson.questions.length,5);
});
test('partially damaged local data defaults optional fields while preserving valid progress',()=>{
 const old=fixture();old.name=4;old.stage='A9';old.completed.push('u0l0',null);old.sessions.bad={seconds:99,practised:true};old.sessions['2026-10-03'].seconds=-1;old.events.push({type:'answer',date:'2026-02-30',at:Infinity,correct:true});const s=P.migrateState(old,C).state;assert.equal(s.name,'');assert.equal(s.stage,'A1.1');assert.equal(s.completed.length,3);assert.equal(s.sessions['2026-10-03'].seconds,0);assert.ok(!s.sessions.bad);assert.equal(s.events.length,2);
});
test('bad local review snapshots are quarantined, never silently erase other records',()=>{
 const old=fixture();old.reviews.damaged={question:{prompt:'broken'},due:-1};const {state:s,warnings}=P.migrateState(old,C);assert.equal(Object.keys(s.reviews).length,2);assert.equal(s.recovery.length,1);assert.equal(s.recovery[0].key,'damaged');assert.ok(warnings.length);assert.deepEqual(P.migrateState(s,C).state,s);
});
test('corrupt unfinished attempts are quarantined as a whole rather than shifting answers',()=>{
 for(const damage of [a=>a.index=999,a=>a.answers=[],a=>a.questions[0].accepted=[],a=>a.selected={},a=>a.checked=true]){const old=fixture();damage(old.active);const s=P.migrateState(old,C).state;assert.equal(s.active,null);assert.equal(s.recovery[0].kind,'active attempt');assert.deepEqual(s.completed,old.completed);}
});
test('unsafe imports reject damaged questions or attempts before replacing anything',()=>{
 const bad=fixture();bad.active.questions[0].accepted=[];assert.throws(()=>P.parse(JSON.stringify(bad),C,{import:true}),/damaged/);const review=fixture();review.reviews.bad={question:null};assert.throws(()=>P.migrateState(review,C,{import:true}),/damaged/);
});
test('malformed JSON, wrong roots, missing core import fields and future versions reject clearly',()=>{
 for(const raw of ['{broken','null','[]','{"version":1}','{"version":3}'])assert.throws(()=>P.parse(raw,C,{import:true}));assert.throws(()=>P.parse(JSON.stringify({...fixture(),version:99}),C),/newer version/);assert.throws(()=>P.parse('x'.repeat(10*1024*1024+1),C),/too large/);
});
test('unreadable or unsupported saved state is protected from automatic overwrite',()=>{
 for(const raw of ['{broken',JSON.stringify({...fixture(),version:99})]){const mem=memory(raw),ctx=P.load(mem,C);assert.equal(ctx.readOnly,true);assert.equal(ctx.raw,raw);assert.equal(P.save(mem,E.fresh(),ctx),false);assert.equal(mem.values[P.KEY],raw);}
});
test('migration writes one v1 recovery backup before saving schema v2',()=>{
 const raw=JSON.stringify(fixture()),mem=memory(raw),ctx=P.load(mem,C);assert.ok(P.save(mem,ctx.state,ctx));assert.equal(mem.values[P.KEY+'-backup-v1'],raw);assert.equal(JSON.parse(mem.values[P.KEY]).version,2);ctx.state.name='New name';P.save(mem,ctx.state,ctx);assert.equal(mem.values[P.KEY+'-backup-v1'],raw);
});
test('storage failures never claim that progress was saved',()=>{
 const mem={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};assert.equal(P.load(mem,C).readOnly,true);assert.equal(P.save(mem,E.fresh()),false);
});
test('v2 serialization and migration round-trip active listening and speaking reveal state',()=>{
 for(const id of ['u0l1','a12u0l2']){const s=E.fresh(),l=C.lessons.find(l=>l.id===id),index=l.questions.length-1;s.active={kind:'lesson',lesson:l,questions:l.questions,index,answers:Array(index).fill(true),selected:null,checked:false,readingReady:false,modelRevealed:true,audioPlayed:true,audioUnavailable:false};const a=P.migrateState(s,C).state;assert.equal(a.active.modelRevealed,true);assert.equal(a.active.audioPlayed,true);assert.deepEqual(P.migrateState(a,C).state,a);}
});
test('unknown fields and prototype-like records do not enter runtime state',()=>{
 const raw=fixture();raw.backendToken='discard me';raw.active.lesson.untrusted={a:1};raw.reviews=JSON.parse('{"__proto__":{"question":null}}');const s=P.migrateState(raw,C).state;assert.ok(!('backendToken' in s));assert.ok(!('untrusted' in s.active.lesson));assert.equal({}.polluted,undefined);
});
test('invalid timestamps and optional counters repair deterministically',()=>{
 const raw=fixture(),r=Object.values(raw.reviews)[0];r.due=-3;r.success='two';r.wrong=NaN;raw.events[0].at=-Infinity;const s=P.migrateState(raw,C).state;const repaired=s.reviews['a12u1l2-q3'];assert.equal(repaired.due,0);assert.equal(repaired.success,0);assert.equal(repaired.wrong,1);assert.equal(s.events[0].at,0);assert.deepEqual(P.migrateState(s,C).state,s);
});
test('duplicate claimed review IDs preserve both distinct historical snapshots',()=>{
 const raw=fixture(),reviews=Object.values(raw.reviews);for(const q of reviews)q.question.id='custom-shared';const s=P.migrateState(raw,C).state;assert.equal(Object.keys(s.reviews).length,2);assert.equal(new Set(Object.values(s.reviews).map(r=>r.question.id)).size,2);assert.deepEqual(P.migrateState(s,C).state,s);
});
test('completed and capability duplicates never inflate retained statistics',()=>{
 const raw=fixture();raw.completed.push(raw.completed[0]);raw.capabilities.push(clone(raw.capabilities[0]));const s=P.migrateState(raw,C).state;assert.equal(s.completed.length,3);assert.equal(s.capabilities.length,2);
});
test('duplicate lesson events are repaired without deleting streak days or learning time',()=>{
 const raw=fixture();raw.events.push(clone(raw.events.find(e=>e.type==='lesson')));const s=P.migrateState(raw,C).state;
 assert.equal(s.events.filter(e=>e.type==='lesson').length,1);assert.deepEqual(s.sessions,raw.sessions);assert.deepEqual(P.migrateState(s,C).state,s);
});
test('checked answers must agree with the selected snapshot and cannot be blank or fabricated',()=>{
 const q=C.lessons[0].questions[0];for(const selected of ['',q.answer]){const s=E.fresh();s.active={kind:'lesson',lesson:C.lessons[0],questions:[q],index:0,answers:[false],selected,checked:true};assert.equal(P.migrateState(s,C).state.active,null);}
});
test('wrong-type local containers retain original data in recovery without erasing valid sections',()=>{
 const raw=fixture();raw.reviews=[{historical:'unrecognised layout'}];const s=P.migrateState(raw,C).state;assert.deepEqual(s.reviews,{});assert.deepEqual(s.recovery[0].data,raw.reviews);assert.deepEqual(s.completed,raw.completed);assert.deepEqual(P.migrateState(s,C).state,s);
});
test('replaced legacy targets keep independent review IDs rather than colliding with new content',()=>{
 for(const id of ['u0l2-q5','u3l1-q1','u3l2-q2','u7l2-q1']){
  const old=C.legacyQuestions.find(q=>q.id===id),q=clone(old);delete q.id;delete q.sourceQuestionId;
  const s=P.migrateState({...E.fresh(),version:1,reviews:{[q.prompt]:{question:q,wrong:2,success:2,due:3456,corrected:false}}},C).state;
  const r=Object.values(s.reviews)[0];assert.match(r.question.id,/^legacy-/);assert.equal(r.question.answer,old.answer);assert.equal(r.success,2);
  E.recordAnswer(s,C.lessons.flatMap(l=>l.questions).find(q=>q.id===id),true,10000);assert.equal(r.success,2);assert.equal(r.due,3456);
 }
});
test('a missing onboarding flag is restored from valid progress without losing the active snapshot',()=>{
 const raw=fixture();delete raw.onboarded;const s=P.migrateState(raw,C).state;assert.equal(s.onboarded,true);assert.equal(s.active.index,raw.active.index);assert.deepEqual(P.migrateState(s,C).state,s);
 const explicit=fixture();explicit.onboarded=false;assert.equal(P.migrateState(explicit,C).state.onboarded,false);
});
test('unmatched emoji-bearing historical prompts receive distinct deterministic fallback identities',()=>{
 const a={...C.lessons[0].questions[0],prompt:'A historical greeting 🙂'},b={...a,prompt:'A historical greeting 😊'};delete a.id;delete b.id;delete a.sourceQuestionId;delete b.sourceQuestionId;
 assert.notEqual(E.reviewKey(a),E.reviewKey(b));const raw={...E.fresh(),version:1,reviews:{a:{question:a},b:{question:b}}},s=P.migrateState(raw,C).state;
 assert.equal(Object.keys(s.reviews).length,2);assert.ok(s.reviews[E.reviewKey(a)]);assert.ok(s.reviews[E.reviewKey(b)]);assert.deepEqual(P.migrateState(s,C).state,s);
});
test('checked listening needs a playback request unless explicitly skipped, and mixed modality snapshots reject',()=>{
 const l=C.lessons.find(l=>l.id==='u0l1'),q=l.questions.at(-1),s=E.fresh();s.active={kind:'lesson',lesson:l,questions:[q],index:0,answers:[true],selected:q.answer,checked:true,audioPlayed:false};assert.equal(P.migrateState(s,C).state.active,null);
 assert.equal(P.question({...C.speakingPractice[0],listening:q.listening}),null);
});
test('corrupt known story/listening snapshots cannot lose their required context silently',()=>{
 for(const original of [C.lessons.find(l=>l.reading).questions[0],C.listeningPractice[0]]){
  const q=clone(original);delete q.reading;delete q.listening;const raw={...E.fresh(),reviews:{[q.id]:{question:q,wrong:1,success:0,due:0,corrected:false}}};
  const s=P.migrateState(raw,C).state;assert.equal(Object.keys(s.reviews).length,0);assert.equal(s.recovery.length,1);assert.throws(()=>P.migrateState(raw,C,{import:true}),/damaged/);
 }
 const reading=C.lessons.find(l=>l.reading).questions[0];assert.equal(P.question({...reading,reading:false}),null);
});

test('an actual pre-mobile v2 backup retains all progress and gains its accepted placement starting path',()=>{
 const old=JSON.parse(fs.readFileSync('tests/fixtures/v2-before-mobile.json','utf8')),result=P.migrateState(old,C),s=result.state;assert.equal(result.migrated,false);assert.equal(s.version,2);assert.equal(s.startStage,'A1.2');for(const key of ['completed','reviews','active','capabilities','events','sessions','name','placement','stage'])assert.deepEqual(s[key],old[key]);assert.deepEqual(P.migrateState(s,C).state,s);assert.deepEqual(P.parse(JSON.stringify(old),C,{import:true}).state,s);
});
test('v2 A1.2 placement infers assumed foundations without fake completions, including previous optional revision',()=>{
 const old=JSON.parse(fs.readFileSync('tests/fixtures/v2-before-mobile.json','utf8'));old.stage='A1.2';old.active=null;const s=P.migrateState(old,C).state;assert.equal(s.startStage,'A1.2');for(const key of ['completed','capabilities','events','reviews','sessions'])assert.deepEqual(s[key],old[key]);assert.deepEqual(P.migrateState(s,C).state,s);
});
test('A1.1 users and A1.2 users without accepted placement retain the full normal path',()=>{
 for(const stage of ['A1.1','A1.2']){const old=E.fresh();delete old.startStage;old.stage=stage;old.placement=null;const s=P.migrateState(old,C).state;assert.equal(s.startStage,'A1.1');assert.equal(s.stage,stage);assert.deepEqual(s.completed,[]);}
});
test('explicit starting path survives manual earlier revision and v2 export/import; invalid fields default safely',()=>{
 const old=E.fresh();old.startStage='A1.2';old.stage='A1.1';old.completed=['u0l0'];old.active=null;const s=P.parse(JSON.stringify(old),C,{import:true}).state;assert.equal(s.startStage,'A1.2');assert.equal(s.stage,'A1.1');assert.deepEqual(s.completed,['u0l0']);assert.deepEqual(P.migrateState(s,C).state,s);for(const value of ['B1.1',false,{},null]){const bad=P.migrateState({...old,startStage:value},C).state;assert.equal(bad.startStage,'A1.1');assert.deepEqual(bad.completed,['u0l0']);}
});
