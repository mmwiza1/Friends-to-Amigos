const {test}=require('node:test'),assert=require('node:assert/strict');
const C=require('../www/curriculum.js'),S=require('../www/structured.js');
const choices=()=>C.lessons.flatMap(l=>l.questions).filter(q=>q.type==='choice'&&Array.isArray(q.options));
test('multiple-choice answers are not guessable from their displayed position',()=>{
 for(const size of [3,4]){
  const qs=choices().filter(q=>q.options.length===size),counts=Array(size).fill(0);
  for(const q of qs)counts[S.optionOrder(q).indexOf(q.options.indexOf(q.answer))]++;
  // Every position stays within 40% of a uniform share across the whole course.
  for(const n of counts)assert.ok(Math.abs(n-qs.length/size)<qs.length/size*.4,size+': '+counts);
 }
});
test('display order is a stable permutation and never alters authored options',()=>{
 for(const q of choices().slice(0,300)){
  const before=JSON.stringify(q.options),order=S.optionOrder(q);
  assert.deepEqual([...order].sort((a,b)=>a-b),q.options.map((_,i)=>i));
  assert.deepEqual(S.optionOrder(q),order);assert.equal(JSON.stringify(q.options),before);
 }
 assert.deepEqual(S.optionOrder({id:'x',options:['only']}),[0]);assert.deepEqual(S.optionOrder({}),[]);
});
const E=require('../www/engine.js'),M=require('../www/mastery.js');
const DAY=86400000;
test('corrected mistakes keep spacing out to two and four months instead of returning monthly',()=>{
 const q=C.lessons[0].questions[0],s=E.fresh();let now=Date.UTC(2026,0,1);
 E.recordAnswer(s,q,false,now);const key=Object.keys(s.reviews)[0],gaps=[];
 for(let i=0;i<8;i++){now=s.reviews[key].due;E.recordAnswer(s,q,true,now);gaps.push((s.reviews[key].due-now)/DAY);}
 assert.deepEqual(gaps,[1,3,7,14,30,60,120,120]);assert.equal(s.reviews[key].corrected,true);
});
test('well-established concepts are retrieved again after one and two months',()=>{
 const state={},gaps=[];let now=Date.UTC(2026,0,1);
 for(let i=0;i<7;i++){M.record(state,[{key:'concept:sentence-building'}],true,{recall:true,item:'q'+i},now);const r=Object.values(state.mastery.records)[0];gaps.push(Math.round((r.due-now)/DAY));now+=2*DAY;}
 assert.deepEqual(gaps,[1,7,7,14,30,60,60]);
});
