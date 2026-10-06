(function(root){
'use strict';
const Bank=typeof module!=='undefined'?require('./conjugations-bank.js'):root.ConjugationsBank;
const Path=typeof module!=='undefined'?require('./course-path.js'):root.CoursePath;
const clone=x=>JSON.parse(JSON.stringify(x)),object=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const byId=new Map(Bank.questions.map(q=>[q.id,q]));
const empty=()=>({recent:[],questions:{},concepts:{},rounds:[],active:null});
function eligible(state,course){
 const assumed=Path.inferStart(state,course)==='A1.2',done=new Set(state.completed);
 return Bank.questions.filter(q=>q.requiredActivities.every(id=>done.has(id)||assumed&&!id.startsWith('a12')));
}
function available(state,course){const pool=eligible(state,course),later=pool.filter(q=>q.stage==='A1.2');return {stage:later.length>=10?'A1.2':'A1.1',pool,challenge:pool.length>=20&&pool.some(q=>q.blanks.length>1)};}
function shuffle(array,rng=Math.random){const result=array.slice();for(let i=result.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
function weight(q,data,now=Date.now()){
 const s=data.questions[q.id]||{},weak=q.concepts.reduce((sum,c)=>{const x=data.concepts[c];return sum+(x?Math.max(0,1-(x.correct||0)/Math.max(1,x.attempts||0)):0);},0)/q.concepts.length;
 const errors=Math.max(0,(s.attempts||0)-(s.correct||0)),streak=s.streak||0;
 return (1+weak*4+Math.min(errors,5)*.5)/(1+Math.min(streak,6)*.3)*(s.lastSeen&&now-s.lastSeen<86400000?.8:1);
}
function build(state,course,mode='normal',mistakes=[],rng=Math.random,now=Date.now()){
 const data=state.games||empty(),info=available(state,course);let pool=info.pool;
 if(pool.length<10)return null;
 if(info.stage==='A1.1'||mode==='challenge')pool=pool.filter(q=>q.stage===info.stage);
 if(mode==='challenge'){
  if(!info.challenge)return null;
  const maximum=Math.max(...pool.map(q=>q.difficulty));const hard=pool.filter(q=>q.difficulty>=maximum-1);if(hard.length>=10)pool=hard;
 }
 if(mode==='mistakes'){
  const ids=new Set(mistakes),concepts=new Set(mistakes.flatMap(id=>byId.get(id)?.concepts||[]));
  const related=info.pool.filter(q=>q.concepts.some(c=>concepts.has(c)));
  if(related.length)pool=related; // Focused correction may mix eligible stages.
  if(!ids.size)return null;
 }
 const limit=mode==='mistakes'?Math.min(5,pool.length):10,chosen=[],used={},recent=new Set(data.recent.slice(-30));
 for(let slot=0;slot<limit;slot++){
  let remaining=pool.filter(q=>!chosen.includes(q));
  // A1.2 normal rounds retain foundations: six current-stage items and
  // four earlier eligible situations, rather than permanently retiring A1.1.
  if(mode==='normal'&&info.stage==='A1.2'){const target=slot<6?'A1.2':'A1.1',sameStage=remaining.filter(q=>q.stage===target);if(sameStage.length)remaining=sameStage;}
  const fresh=remaining.filter(q=>!recent.has(q.id)&&!(mode==='mistakes'&&mistakes.includes(q.id)));
  let candidates=fresh.length?fresh:remaining;
  // Cover available subject persons before repeating them. Multi-blank items
  // can supply several persons; weighting then balances verbs/concepts.
  const unseen=candidates.filter(q=>q.blanks.some(b=>!used['person-'+b.person]));
  if(unseen.length)candidates=unseen;
  const weights=candidates.map(q=>{
   const variety=q.concepts.reduce((factor,c)=>factor/(1+(used[c]||0)*.8),1);
   const verbs=q.blanks.reduce((factor,b)=>factor/(1+(used['verb-'+b.verb]||0)),1);
   const size=1/(1+(used['blanks-'+q.blanks.length]||0)*.25);
   return weight(q,data,now)*variety*verbs*size;
  });
  let ticket=rng()*weights.reduce((a,b)=>a+b,0),index=weights.length-1;
  for(let i=0;i<weights.length;i++){ticket-=weights[i];if(ticket<=0){index=i;break;}}
  const q=candidates[index];chosen.push(q);for(const c of [...q.concepts,...q.blanks.map(b=>'verb-'+b.verb),'blanks-'+q.blanks.length])used[c]=(used[c]||0)+1;
 }
 const questions=shuffle(chosen,rng).map(q=>({...clone(q),blanks:q.blanks.map(b=>({...clone(b),options:shuffle(b.options,rng)}))}));
 return {mode,stage:info.stage,difficulty:info.stage+' · unit '+(Math.max(...info.pool.filter(q=>q.stage===info.stage).map(q=>q.unit))+1),questions,index:0,selected:questions[0].blanks.map(()=>null),checked:false,results:[],started:now};
}
function rememberShown(state){const data=state.games,q=data?.active?.questions[data.active.index];if(q&&data.recent.at(-1)!==q.id)data.recent=[...data.recent,q.id].slice(-30);}
function evaluate(q,selected){return q.blanks.map((b,i)=>({selected:selected[i],answer:b.answer,correct:selected[i]===b.answer,explanation:selected[i]===b.answer?'Well done. '+b.explanation:b.mistakes[selected[i]]||b.explanation}));}
function check(state){const a=state.games?.active,q=a?.questions[a.index];if(!q||a.checked||a.selected.length!==q.blanks.length||a.selected.some((value,i)=>!q.blanks[i].options.includes(value)))return null;const details=evaluate(q,a.selected);a.checked=true;a.results.push({id:q.id,correct:details.every(b=>b.correct),details});return details;}
function advance(state,now=Date.now()){
 const data=state.games,a=data?.active;if(!a?.checked)return null;
 const q=a.questions[a.index],result=a.results.at(-1);
 const update=(records,key,correct)=>{const x=records[key]||{attempts:0,correct:0,streak:0,lastSeen:0};x.attempts++;x.correct+=correct?1:0;x.streak=correct?x.streak+1:0;x.lastSeen=now;records[key]=x;};
 update(data.questions,q.id,result.correct);
 // A concept is one observation per item, not inflated by repeated tags/blanks.
 for(const concept of q.concepts){const relevant=q.blanks.filter(b=>b.concept===concept||'person-'+b.person===concept);update(data.concepts,concept,relevant.every(b=>a.selected[q.blanks.indexOf(b)]===b.answer));}
 rememberShown(state);a.index++;a.checked=false;
 if(a.index<a.questions.length){a.selected=a.questions[a.index].blanks.map(()=>null);rememberShown(state);return null;}
 const observations={};
 for(let i=0;i<a.questions.length;i++)for(const concept of a.questions[i].concepts){
  const q=a.questions[i],details=a.results[i].details,relevant=q.blanks.map((b,j)=>b.concept===concept||'person-'+b.person===concept?details[j]:null).filter(Boolean),entry=observations[concept]||{attempts:0,correct:0};entry.attempts++;entry.correct+=relevant.every(d=>d.correct)?1:0;observations[concept]=entry;
 }
 const round={observations,mode:a.mode,stage:a.stage,difficulty:a.difficulty,score:a.results.filter(r=>r.correct).length,total:a.questions.length,at:now,mistakes:a.results.filter(r=>!r.correct).map(r=>r.id),concepts:[...new Set(a.questions.flatMap(q=>q.concepts))]};
 data.rounds=[...data.rounds,round].slice(-40);data.active=null;return round;
}
function summary(data,round){return round.concepts.map(id=>{const s=data.concepts[id]||{attempts:0,correct:0};return {id,label:id.startsWith('person-')?Bank.persons[id.slice(7)]:({'regular-ar':'Regular -ar','regular-er':'Regular -er','regular-ir':'Regular -ir','gustar-singular':'Gusta: one thing or activity','gustar-plural':'Gustan: plural things',reflexive:'Daily routine forms',irregular:'Common irregulars',names:'Giving and asking names',prices:'Singular/plural prices',existence:'There is/are'})[id]||id,status:(round.observations?.[id]||s).correct/(round.observations?.[id]||s).attempts>=.8?'Strong today':(round.observations?.[id]||s).correct/(round.observations?.[id]||s).attempts>=.5?'Improving':'Needs more practice',attempts:s.attempts};});}
function sanitize(raw,state=null,course=null){
 const data=empty(),warnings=[];if(!object(raw))return {data,warnings:['Some damaged game data was preserved for recovery.']};
 const validNumber=x=>Number.isInteger(x)&&x>=0&&x<=1000000,validTime=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=4102444800000;
 for(const kind of ['questions','concepts'])if(object(raw[kind]))for(const [key,s] of Object.entries(raw[kind])){
  const known=kind==='questions'?byId.has(key):Bank.questions.some(q=>q.concepts.includes(key));
  if(known&&object(s)&&validNumber(s.attempts)&&validNumber(s.correct)&&s.correct<=s.attempts&&validNumber(s.streak)&&s.streak<=s.correct&&validTime(s.lastSeen))data[kind][key]={attempts:s.attempts,correct:s.correct,streak:s.streak,lastSeen:s.lastSeen};
 }
 data.recent=Array.isArray(raw.recent)?raw.recent.filter(id=>byId.has(id)).slice(-30):[];
 data.rounds=Array.isArray(raw.rounds)?raw.rounds.filter(r=>object(r)&&['normal','challenge','mistakes'].includes(r.mode)&&['A1.1','A1.2'].includes(r.stage)&&typeof r.difficulty==='string'&&r.difficulty.length<100&&validNumber(r.total)&&r.total>0&&r.total<=10&&validNumber(r.score)&&r.score<=r.total&&validTime(r.at)&&Array.isArray(r.mistakes)&&r.mistakes.every(id=>byId.has(id))&&Array.isArray(r.concepts)&&r.concepts.every(id=>Bank.questions.some(q=>q.concepts.includes(id)))).slice(-40).map(r=>({mode:r.mode,stage:r.stage,difficulty:r.difficulty,score:r.score,total:r.total,at:r.at,mistakes:r.mistakes.slice(),concepts:r.concepts.slice(),...(object(r.observations)?{observations:Object.fromEntries(Object.entries(r.observations).filter(([id,x])=>r.concepts.includes(id)&&object(x)&&validNumber(x.attempts)&&x.attempts>0&&x.attempts<=r.total&&validNumber(x.correct)&&x.correct<=x.attempts).map(([id,x])=>[id,{attempts:x.attempts,correct:x.correct}]))}:{})})):[];
 if(raw.active!==null&&raw.active!==undefined){
  const a=raw.active;let valid=object(a)&&['normal','challenge','mistakes'].includes(a.mode)&&['A1.1','A1.2'].includes(a.stage)&&typeof a.difficulty==='string'&&a.difficulty.length<100&&validTime(a.started)&&Array.isArray(a.questions)&&(a.mode==='mistakes'?a.questions.length>=1&&a.questions.length<=5:a.questions.length===10)&&new Set(a.questions.map(q=>q?.id)).size===a.questions.length&&Number.isInteger(a.index)&&a.index>=0&&a.index<a.questions.length&&typeof a.checked==='boolean'&&Array.isArray(a.results)&&a.results.length===a.index+(a.checked?1:0);
  // Resume the stored wording/options, but accept only known, unchanged targets.
  valid=valid&&a.questions.every(q=>{const authored=byId.get(q?.id);return authored&&q.stage===authored.stage&&typeof q.sentence==='string'&&q.sentence.length<2000&&(q.sentence.match(/___/g)||[]).length===q.blanks?.length&&Array.isArray(q.blanks)&&q.blanks.length===authored.blanks.length&&q.blanks.every((b,i)=>object(b)&&b.answer===authored.blanks[i].answer&&b.person===authored.blanks[i].person&&b.concept===authored.blanks[i].concept&&b.verb===authored.blanks[i].verb&&(b.infinitive===null||typeof b.infinitive==='string'&&b.infinitive.length<100)&&typeof b.explanation==='string'&&b.explanation.length<3000&&object(b.mistakes)&&Object.entries(b.mistakes).every(([k,v])=>typeof k==='string'&&typeof v==='string'&&v.length<3000)&&Array.isArray(b.options)&&b.options.length===authored.blanks[i].options.length&&new Set(b.options).size===b.options.length&&b.options.every(v=>authored.blanks[i].options.includes(v)))&&Array.isArray(q.concepts)&&JSON.stringify(q.concepts)===JSON.stringify(authored.concepts);});
  valid=valid&&Array.isArray(a.selected)&&a.selected.length===a.questions[a.index].blanks.length&&a.selected.every((v,i)=>v===null||a.questions[a.index].blanks[i].options.includes(v))&&(!a.checked||a.selected.every(v=>v!==null));
  valid=valid&&a.results.every((r,i)=>{const q=a.questions[i];return object(r)&&r.id===q.id&&typeof r.correct==='boolean'&&Array.isArray(r.details)&&r.details.length===q.blanks.length&&r.details.every((d,j)=>object(d)&&q.blanks[j].options.includes(d.selected)&&d.answer===q.blanks[j].answer&&d.correct===(d.selected===d.answer)&&typeof d.explanation==='string'&&d.explanation.length<3000)&&r.correct===r.details.every(d=>d.correct)&&(!a.checked||i!==a.index||r.details.every((d,j)=>d.selected===a.selected[j]));});
  if(valid&&state&&course){const allowed=new Set(eligible(state,course).map(q=>q.id));valid=a.questions.every(q=>allowed.has(q.id));}
  if(valid)data.active=clone(a);else warnings.push('Some damaged game data was preserved for recovery.');
 }
 return {data,warnings};
}
root.Conjugations={empty,eligible,available,shuffle,weight,build,rememberShown,evaluate,check,advance,summary,sanitize};if(typeof module!=='undefined')module.exports=root.Conjugations;
})(typeof window==='undefined'?globalThis:window);
