(function(root){
'use strict';
// Word comparison describes this authored model; it is not a general grammar grader.
function build(q,value,normalize,isCorrect){
 const learner=String(value??''),models=[...new Set([q.answer,...(q.accepted||[])])].filter(x=>typeof x==='string');
 const split=text=>(text.match(/\S+|\s+/g)||[]).map(text=>({text,word:/\S/.test(text),changed:false}));
 function align(a,b){
  const table=Array.from({length:a.length+1},()=>Array(b.length+1).fill(0));
  for(let i=a.length-1;i>=0;i--)for(let j=b.length-1;j>=0;j--)table[i][j]=a[i]===b[j]?1+table[i+1][j+1]:Math.max(table[i+1][j],table[i][j+1]);
  const sameA=new Set(),sameB=new Set();let i=0,j=0;
  while(i<a.length&&j<b.length){if(a[i]===b[j]){sameA.add(i++);sameB.add(j++);}else if(table[i+1][j]>=table[i][j+1])i++;else j++;}
  return {sameA,sameB,cost:a.length+b.length-2*sameA.size};
 }
 const learnerParts=split(learner),a=learnerParts.filter(p=>p.word).map(p=>normalize(p.text));
 let target=q.answer,best=Infinity,comparison;
 for(const model of models.slice(0,20)){
  const b=split(model).filter(p=>p.word).map(p=>normalize(p.text));
  if(a.length>60||b.length>60)continue;
  const result=align(a,b);if(result.cost<best){best=result.cost;target=model;comparison=result;}
 }
 const targetParts=split(target),b=targetParts.filter(p=>p.word).map(p=>normalize(p.text));
 if(comparison){let i=0;for(const p of learnerParts)if(p.word)p.changed=!comparison.sameA.has(i++);i=0;for(const p of targetParts)if(p.word)p.changed=!comparison.sameB.has(i++);}
 const authored=q.mistakes?.find(m=>normalize(m.answer)===normalize(learner));
 let diagnosis='',kind='compare';
 if(!authored&&q.type==='text'&&!isCorrect(q,learner)&&comparison){
  const missing=b.filter((_,i)=>!comparison.sameB.has(i)),extra=a.filter((_,i)=>!comparison.sameA.has(i));
  if(a.length===b.length&&a.slice().sort().join('|')===b.slice().sort().join('|')){kind='order';diagnosis='The words match this model, but their order differs. Follow the order shown in the model.';}
  else if(missing.length===1&&extra.length===0){kind='missing';diagnosis='This model includes “'+targetParts.filter(p=>p.word)[b.indexOf(missing[0])].text+'”, which is missing from your version.';}
  else if(extra.length===1&&missing.length===0){kind='extra';diagnosis='Your version adds “'+learnerParts.filter(p=>p.word)[a.indexOf(extra[0])].text+'” compared with this model.';}
  else if(missing.length===1&&extra.length===1){
   kind='word';diagnosis='One word differs from this model. Compare the underlined words.';
   if(q.language==='es'){
    const wanted=missing[0],written=extra[0],position=b.indexOf(wanted),verb=b[position+1];
    if(wanted==='me'&&written==='mi'&&verb==='llamo')diagnosis='Me llamo means “my name is”. Me refers to you in this phrase. Mi means “my”, so it cannot replace me before llamo.';
    else if(wanted==='me'&&written==='mi'&&['levanto','ducho','visto','acuesto','despierto'].includes(verb))diagnosis='Use me when you describe doing this routine yourself. Mi means “my” and normally goes before a noun.';
    else if(wanted==='tengo'&&['soy','estoy'].includes(written)&&b.includes('años'))diagnosis='Spanish uses tener (to have) for age: tengo … años. English “I am …” does not translate with soy or estoy here.';
    else if(wanted==='tengo'&&['soy','estoy'].includes(written)&&b.includes('hambre'))diagnosis='Use tengo hambre: literally “I have hunger”. Hunger uses tener, not soy or estoy.';
    else if(['el','la','los','las','un','una','unos','unas'].includes(wanted)&&['el','la','los','las','un','una','unos','unas'].includes(written)&&
     (['la','las','una','unas'].includes(wanted)!==['la','las','una','unas'].includes(written)||['los','las','unos','unas'].includes(wanted)!==['los','las','unos','unas'].includes(written)))diagnosis='The model uses “'+wanted+'” with this noun. Match the article to the noun’s gender and to whether there is one or more than one.';
    else if(['gusta','gustan'].includes(wanted)&&['gusta','gustan'].includes(written))diagnosis=wanted==='gustan'?'Use gustan when the things liked are plural. The verb follows the things, not the person who likes them.':'Use gusta for one thing or an activity. The verb follows what is liked, not the person.';
   }
  }
 }
 const fallback=(comparison?'Compare the underlined words with this model.':'Compare your answer with this model.')+' Your answer is outside the accepted examples; another phrasing may still be valid. Try saying the model aloud once.';
 return {learner,target,learnerParts,targetParts,kind:authored?'authored':kind,explanation:authored?authored.explanation:q.type!=='text'?q.explanation:[diagnosis||fallback,q.explanation].filter(Boolean).join(' ')};
}
root.AnswerFeedback={build};if(typeof module!=='undefined')module.exports=root.AnswerFeedback;
})(typeof window==='undefined'?globalThis:window);
