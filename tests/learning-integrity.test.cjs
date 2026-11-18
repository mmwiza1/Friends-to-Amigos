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
