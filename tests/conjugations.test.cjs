const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../www/curriculum'),E=require('../www/engine'),P=require('../www/storage'),B=require('../www/conjugations-bank'),G=require('../www/games'),V=require('../www/games-view');
function rng(seed=1){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function learner(stage='A1.1',unit=7){const s=E.fresh();s.onboarded=true;s.completed=C.lessons.filter(l=>l.stage==='A1.1'&&(stage==='A1.2'||l.unit<=unit)||l.stage===stage&&l.unit<=unit).map(l=>l.id);return s;}
const escape=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const button=(label,action,cls,extra)=>`<button class="${cls}" data-action="${action}" ${extra||''}>${label}</button>`;
function finish(s,wrong=false){const a=s.games.active;while(s.games.active){const q=a.questions[a.index];a.selected=q.blanks.map(b=>wrong?b.options.find(x=>x!==b.answer):b.answer);G.check(s);const result=G.advance(s,1000+a.index);if(result)return result;}}
test('208 stable authored game IDs: 104 for each playable stage, no course collisions',()=>{
 assert.equal(B.questions.length,208);for(const stage of ['A1.1','A1.2'])assert.equal(B.questions.filter(q=>q.stage===stage).length,104);
 assert.equal(new Set(B.questions.map(q=>q.id)).size,208);const course=new Set(C.lessons.flatMap(l=>l.questions.map(q=>q.id)));for(const q of B.questions)assert.ok(!course.has(q.id));
 assert.deepEqual(B.questions.map(q=>q.id),JSON.parse(fs.readFileSync('tests/fixtures/conjugations-ids.json','utf8')));
});
test('bank prerequisites, sentences, answer data and educational distractors are structurally valid',()=>{
 const activities=new Set(C.lessons.map(l=>l.id));const sentences=new Set();
 for(const q of B.questions){assert.ok(C.playableStages.includes(q.stage));assert.ok(q.unit>=0&&q.unit<8);assert.ok(q.blanks.length>=1&&q.blanks.length<=3);assert.equal(q.sentence.split('___').length-1,q.blanks.length);assert.ok([0,1,2].every(n=>q.requiredActivities.includes((q.stage==='A1.1'?'u':'a12u')+q.unit+'l'+n)));assert.ok(q.requiredActivities.length);assert.ok(q.concepts.length);assert.ok(q.explanation.length>20);assert.ok(q.difficulty>=1&&q.difficulty<=4);assert.ok(!sentences.has(q.sentence),q.id);sentences.add(q.sentence);
  for(const id of q.requiredActivities){assert.ok(activities.has(id),q.id+': '+id);if(q.stage==='A1.1')assert.ok(!id.startsWith('a12'));}
  for(const b of q.blanks){assert.ok(q.requiredActivities.includes(b.source));assert.ok(b.answer);assert.equal(new Set(b.options).size,b.options.length);assert.equal(b.options.filter(x=>x===b.answer).length,1);assert.ok(b.explanation.length>20);for(const wrong of b.options.filter(x=>x!==b.answer))assert.ok(b.mistakes[wrong]?.length>20);}
 }
});
test('every target form is present in its referenced positive teaching model or story',()=>{
 for(const f of Object.values(B.definitions)){const l=C.lessons.find(l=>l.id===f.source);const positive=JSON.stringify([l.reading?.text,l.questions.map(q=>[q.answer,q.spanish,q.listening?.transcript])]).toLowerCase();assert.ok(positive.includes(f.answer.toLowerCase()),f.source+': '+f.answer);}
});
test('bank varies persons, verbs, contexts and scaffolding; early material has one blank',()=>{
 for(const stage of ['A1.1','A1.2']){const qs=B.questions.filter(q=>q.stage===stage);assert.ok(new Set(qs.flatMap(q=>q.blanks.map(b=>b.verb))).size>=15);assert.ok(new Set(qs.flatMap(q=>q.blanks.map(b=>b.person))).size>=6);assert.ok(qs.some(q=>q.blanks.some(b=>!b.infinitive)));assert.equal(new Set(qs.map(q=>q.unit)).size,8);}
 assert.ok(B.questions.filter(q=>q.stage==='A1.1'&&q.unit<4).every(q=>q.blanks.length===1));assert.ok(B.questions.some(q=>q.stage==='A1.2'&&q.blanks.length===3));
});
test('course completion expands eligibility; viewed/profile stage alone cannot unlock material',()=>{
 const s=learner('A1.1',1);s.stage='A1.2';assert.equal(G.eligible(s,C).length,23);assert.ok(G.eligible(s,C).every(q=>q.stage==='A1.1'&&q.unit<=1));
 const full=learner('A1.1');assert.equal(G.eligible(full,C).length,104);const late=learner('A1.2',2);assert.equal(G.eligible(late,C).filter(q=>q.stage==='A1.2').length,39);
});
test('placement assumes A1.1 foundations without fake completions; A1.2 new forms still require lessons',()=>{
 const s=E.fresh();s.startStage='A1.2';s.stage='A1.2';assert.equal(G.eligible(s,C).length,104);assert.deepEqual(s.completed,[]);
 s.completed=C.lessons.filter(l=>l.stage==='A1.2'&&l.unit===0).map(l=>l.id);assert.equal(G.available(s,C).stage,'A1.2');assert.equal(G.eligible(s,C).filter(q=>q.stage==='A1.2').length,13);
});
test('a new learner needs enough taught material for a varied 10-item round',()=>{
 assert.equal(G.build(E.fresh(),C),null);assert.equal(G.build(learner('A1.1',0),C),null);assert.equal(G.build(learner('A1.1',1),C).questions.length,10);
});
test('100 seeded rounds are unique, balanced and contain only eligible material',()=>{
 for(const stage of ['A1.1','A1.2']){const s=learner(stage),allowed=new Set(G.eligible(s,C).map(q=>q.id));for(let seed=1;seed<=100;seed++){
  const a=G.build(s,C,'normal',[],rng(seed));assert.equal(a.questions.length,10);assert.equal(new Set(a.questions.map(q=>q.id)).size,10);for(const q of a.questions)assert.ok(allowed.has(q.id));
  const persons=new Set(a.questions.flatMap(q=>q.blanks.map(b=>b.person)));assert.ok(persons.size>=5,'balanced '+seed);assert.ok(new Set(a.questions.flatMap(q=>q.blanks.map(b=>b.verb))).size>=5);
 }}
});
test('question order and options change, while permanent IDs and answers do not',()=>{
 const s=learner('A1.2'),a=G.build(s,C,'normal',[],rng(1)),b=G.build(s,C,'normal',[],rng(2));assert.notDeepEqual(a.questions.map(q=>q.id),b.questions.map(q=>q.id));
 const q=B.questions[0];assert.notDeepEqual(G.shuffle(q.blanks[0].options,rng(1)),G.shuffle(q.blanks[0].options,rng(5)));assert.equal(q.blanks[0].options[0],q.blanks[0].answer);
});
test('recent 30 items are excluded when enough fresh material exists and older items return',()=>{
 const s=learner();s.games=G.empty();s.games.recent=B.questions.slice(0,30).map(q=>q.id);const round=G.build(s,C,'normal',[],rng(9));assert.ok(round.questions.every(q=>!s.games.recent.includes(q.id)));
 s.games.recent=B.questions.slice(30,60).map(q=>q.id);const returned=new Set();for(let seed=1;seed<=30;seed++)for(const q of G.build(s,C,'normal',[],rng(seed)).questions)returned.add(q.id);assert.ok([...returned].some(id=>B.questions.slice(0,30).some(q=>q.id===id)));
});
test('weak concepts get higher weights; repeated successes reduce but never zero the weight',()=>{
 const q=B.questions[0],weak=G.empty(),strong=G.empty();for(const c of q.concepts){weak.concepts[c]={attempts:5,correct:0};strong.concepts[c]={attempts:5,correct:5};}weak.questions[q.id]={attempts:5,correct:0,streak:0};strong.questions[q.id]={attempts:5,correct:5,streak:5};
 assert.ok(G.weight(q,weak)>G.weight(q,G.empty()));assert.ok(G.weight(q,strong)<G.weight(q,G.empty()));assert.ok(G.weight(q,strong)>0);
});
test('weak concept weighting increases selection frequency under the same seeded sampling',()=>{
 const baseline=learner(),weak=learner();weak.games=G.empty();weak.games.concepts['regular-ar']={attempts:20,correct:0,streak:0,lastSeen:0};let a=0,b=0;
 for(let seed=1;seed<=150;seed++){a+=G.build(baseline,C,'normal',[],rng(seed)).questions.filter(q=>q.concepts.includes('regular-ar')).length;b+=G.build(weak,C,'normal',[],rng(seed)).questions.filter(q=>q.concepts.includes('regular-ar')).length;}assert.ok(b>a,`${b} > ${a}`);
});
test('challenge uses hardest unlocked items without future-stage exposure',()=>{
 const s=learner('A1.1',1);assert.equal(G.build(s,C,'challenge'),null);const late=learner('A1.2',4),a=G.build(late,C,'challenge',[],rng(4));assert.equal(a.questions.length,10);assert.ok(a.questions.every(q=>G.eligible(late,C).some(x=>x.id===q.id)));assert.ok(a.questions.some(q=>q.blanks.length===3));assert.ok(a.questions.every(q=>q.unit<=4));
});
test('each blank is checked separately and uses distractor-specific explanations',()=>{
 const q=B.questions.find(q=>q.blanks.length===3),selected=q.blanks.map((b,i)=>i===1?b.options.find(x=>x!==b.answer):b.answer),feedback=G.evaluate(q,selected);assert.deepEqual(feedback.map(x=>x.correct),[true,false,true]);assert.equal(feedback[1].selected,selected[1]);assert.equal(feedback[1].answer,q.blanks[1].answer);assert.equal(feedback[1].explanation,q.blanks[1].mistakes[selected[1]]);assert.match(feedback[0].explanation,/Well done/);
});
test('game rendering exposes radio selections, blank labels and escaped feedback for every item',()=>{
 for(const q of B.questions){const selected=q.blanks.map(b=>b.options.find(x=>x!==b.answer)),a={stage:q.stage,mode:'normal',index:0,questions:[q],selected,checked:true,results:[{correct:false,details:G.evaluate(q,selected)}]};const html=V.round({attempt:a,b:button,esc:escape});assert.match(html,/role="radiogroup"/);assert.match(html,/aria-checked="true"/);assert.match(html,/You chose/);assert.match(html,/A natural answer/);for(let i=0;i<q.blanks.length;i++)assert.ok(html.includes(`Blank ${i+1} · ✗`));}
 const q=structuredClone(B.questions[0]);q.sentence='<img src=x onerror=evil> ___';q.blanks[0].mistakes[q.blanks[0].options[1]]='<script>evil</script>';const a={stage:q.stage,index:0,questions:[q],selected:[q.blanks[0].options[1]],checked:true,results:[{correct:false,details:G.evaluate(q,[q.blanks[0].options[1]])}]};const html=V.round({attempt:a,b:button,esc:escape});assert.ok(!html.includes('<script>'));assert.match(html,/&lt;img/);
});
test('round stats and concept observations are deduplicated and cannot affect course progression',()=>{
 const s=learner(),before=structuredClone(s);s.games=G.empty();s.games.active=G.build(s,C,'normal',[],rng(7));const result=finish(s);assert.equal(result.score,10);assert.equal(s.games.rounds.length,1);assert.equal(G.advance(s),null);assert.equal(s.games.rounds.length,1);
 for(const field of ['completed','startStage','stage','placement','capabilities','reviews','events','active'])assert.deepEqual(s[field],before[field]);assert.equal(Object.values(s.games.questions).reduce((a,x)=>a+x.attempts,0),10);
});
test('mistake practice selects related eligible alternatives, has five items and remains encouraging',()=>{
 const s=learner('A1.2');s.games=G.empty();s.games.active=G.build(s,C,'normal',[],rng(5));const result=finish(s,true),a=G.build(s,C,'mistakes',result.mistakes,rng(6));assert.equal(a.questions.length,5);assert.ok(a.questions.every(q=>!result.mistakes.includes(q.id)));const concepts=new Set(result.mistakes.flatMap(id=>B.questions.find(q=>q.id===id).concepts));assert.ok(a.questions.every(q=>q.concepts.some(c=>concepts.has(c))));assert.equal(G.build(s,C,'mistakes',[]),null);
});
test('schema-v2 old saves have no required game fields and game saves round-trip idempotently',()=>{
 const old=learner();assert.equal(P.migrateState(old,C).state.games,undefined);old.games=G.empty();old.games.active=G.build(old,C,'normal',[],rng(3));const q=old.games.active.questions[0];old.games.active.selected=q.blanks.map(b=>b.answer);G.check(old);
 const saved=P.migrateState(old,C).state;assert.deepEqual(saved.games.active,old.games.active);assert.deepEqual(P.migrateState(saved,C).state,saved);assert.deepEqual(P.parse(JSON.stringify(saved),C,{import:true}).state,saved);
});
test('malformed game imports are rejected and local corrupted attempts are retained for recovery',()=>{
 const s=learner();s.games=G.empty();s.games.active=G.build(s,C);s.games.active.questions[0].blanks[0].answer='tampered';assert.throws(()=>P.parse(JSON.stringify(s),C,{import:true}),/damaged/);const repaired=P.migrateState(s,C).state;assert.equal(repaired.games.active,null);assert.equal(repaired.recovery.at(-1).kind,'game');assert.deepEqual(repaired.completed,s.completed);
});
test('incorrect checked-result snapshots cannot impersonate a correct game answer',()=>{
 const s=learner();s.games=G.empty();s.games.active=G.build(s,C);const q=s.games.active.questions[0];s.games.active.selected=q.blanks.map(b=>b.options.find(x=>x!==b.answer));G.check(s);s.games.active.results[0].correct=true;assert.equal(G.sanitize(s.games).data.active,null);
});
test('fresh selection is pure and game resume preserves stored historical wording/options',()=>{
 const s=learner(),before=JSON.stringify(s);const a=G.build(s,C);assert.equal(JSON.stringify(s),before);s.games=G.empty();s.games.active=a;a.questions[0].sentence='Historical wording: '+a.questions[0].sentence;const saved=P.parse(JSON.stringify(s),C,{import:true}).state;assert.equal(saved.games.active.questions[0].sentence,a.questions[0].sentence);
});
test('recent history includes a shown question even if a game is safely abandoned before answering',()=>{
 const s=learner();s.games=G.empty();s.games.active=G.build(s,C,'normal',[],rng(8));const first=s.games.active.questions[0].id;G.rememberShown(s);G.rememberShown(s);assert.deepEqual(s.games.recent,[first]);const next=G.build(s,C,'normal',[],rng(8));assert.ok(next.questions.every(q=>q.id!==first));
});
test('a forged active game cannot bypass main-course eligibility through import',()=>{
 const s=learner('A1.2');s.games=G.empty();s.games.active=G.build(s,C);s.completed=[];assert.throws(()=>P.parse(JSON.stringify(s),C,{import:true}),/damaged/);assert.equal(P.migrateState(s,C).state.games.active,null);
});
test('next-difficulty action appears only after real course progress expands eligibility',()=>{
 const s=learner('A1.1',1);s.games=G.empty();s.games.active=G.build(s,C);const r=finish(s);const html=V.result({state:s,C,G,round:r,b:button,esc:escape});assert.ok(!html.includes('Next difficulty'));
 s.completed=C.lessons.filter(l=>l.stage==='A1.1'&&l.unit<=2).map(l=>l.id);assert.ok(V.result({state:s,C,G,round:r,b:button,esc:escape}).includes('Next difficulty'));assert.deepEqual(s.capabilities,[]);
});
test('small unlocked pools still choose every available fresh item before recent repeats',()=>{
 const s=learner('A1.1',1),pool=G.eligible(s,C);s.games=G.empty();s.games.recent=pool.slice(0,-4).map(q=>q.id);const a=G.build(s,C,'normal',[],rng(5));for(const q of pool.slice(-4))assert.ok(a.questions.some(x=>x.id===q.id));assert.equal(a.questions.length,10);
});
test('later unhinted context sometimes requires choosing both the verb and its person/number',()=>{
 const q=B.questions.find(q=>q.id==='conj-a12-039'),b=q.blanks[0];assert.equal(b.infinitive,null);assert.ok(b.options.includes('soy'));assert.ok(b.options.includes('estoy'));assert.equal(b.answer,'tengo');assert.match(b.mistakes.estoy,/tengo hambre/);
});
test('A1.2 normal rounds recycle four eligible foundations alongside six current-stage items',()=>{
 const s=learner('A1.2');for(let seed=1;seed<=30;seed++){const a=G.build(s,C,'normal',[],rng(seed));assert.equal(a.questions.filter(q=>q.stage==='A1.2').length,6);assert.equal(a.questions.filter(q=>q.stage==='A1.1').length,4);}
});
test('focused practice targets the incorrect blank rather than the other correct concepts',()=>{
 const s=learner('A1.2');s.games=G.empty();s.games.active=G.build(s,C,'normal',[],rng(13));const a=s.games.active,target=B.questions.find(q=>q.id==='conj-a12-051');a.questions[0]=structuredClone(target);a.selected=target.blanks.map((b,i)=>i===1?b.options.find(x=>x!==b.answer):b.answer);G.check(s);G.advance(s);const result=finish(s);assert.deepEqual(result.weakTargets,[{verb:'necesitar',person:'yo',concept:'regular-ar'}]);
 const focused=G.build(s,C,'mistakes',result.mistakes,rng(7));assert.ok(focused.questions.every(q=>q.blanks.some(b=>b.verb==='necesitar'||b.concept==='regular-ar'&&b.person==='yo')));
});
test('personal best survives beyond the bounded recent-round window and backup round trips',()=>{
 const s=learner();s.games=G.empty();s.games.active=G.build(s,C);const perfect=finish(s),key=G.bestKey(perfect);assert.equal(s.games.bests[key],10);
 s.games.rounds=Array.from({length:40},(_,i)=>({...perfect,score:5,at:2000+i}));const saved=P.parse(JSON.stringify(s),C,{import:true}).state;assert.equal(saved.games.bests[key],10);const html=V.result({state:saved,C,G,round:saved.games.rounds.at(-1),b:button,esc:escape});assert.match(html,/Best at this unlocked difficulty: 10 \/ 10/);
});
test('every authored game question completes through the real check/advance loop',()=>{
 const seen=new Set();for(const stage of ['A1.1','A1.2']){const s=learner(stage);s.games=G.empty();const pool=B.questions.filter(q=>q.stage===stage);
  for(let start=0;start<pool.length;start+=10){const questions=pool.slice(start,start+10);if(questions.length<10)questions.push(...pool.slice(0,10-questions.length));s.games.active=G.build(s,C);s.games.active.questions=structuredClone(questions);s.games.active.selected=questions[0].blanks.map(()=>null);const result=finish(s);assert.equal(result.total,10);assert.equal(result.score,10);for(const q of questions)seen.add(q.id);}
 }assert.equal(seen.size,208);
});
