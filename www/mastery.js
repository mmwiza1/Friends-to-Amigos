(function(root){
'use strict';
// Evidence is deliberately modest: at most one positive update per concept/session,
// and a spaced recall needs another calendar day AND at least twenty hours.
const DAY=86400000, validKey=k=>typeof k==='string'&&/^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ:._-]{1,180}$/.test(k)&&!['__proto__','prototype','constructor'].includes(k);
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const bounded=(v,max=1000000)=>Number.isFinite(v)&&v>=0&&v<=max?v:0;
const empty=()=>({records:{}});
function sanitize(raw){const result=empty();if(!object(raw)||!object(raw.records))return result;
 for(const [key,r] of Object.entries(raw.records).slice(0,6000))if(validKey(key)&&object(r)){
  result.records[key]={attempts:bounded(r.attempts),errors:bounded(r.errors),success:bounded(r.success),assisted:bounded(r.assisted),spaced:bounded(r.spaced),strength:bounded(r.strength,10),last:bounded(r.last,4102444800000),lastRecall:bounded(r.lastRecall,4102444800000),due:bounded(r.due,4102444800000),session:typeof r.session==='string'?r.session.slice(0,100):'',seen:Array.isArray(r.seen)?r.seen.filter(x=>typeof x==='string').slice(-20):[],recent:Array.isArray(r.recent)?r.recent.filter(x=>typeof x==='boolean').slice(-8):[]};
 }return result;
}
const keys=t=>[t.key,...(t.verb?['verb:'+t.verb]:[]),...(t.tense?['tense:'+t.tense]:[]),...(t.person?['person:'+t.person]:[]),...(t.pattern?['pattern:'+t.pattern]:[]),...(t.verb&&t.tense&&t.person?['form:'+t.verb+':'+t.tense+':'+t.person]:[])].filter(Boolean);
function record(state,tags,correct,details={},now=Date.now()){
 state.mastery=state.mastery||empty();const session=String(details.session||Math.floor(now/DAY)),source=String(details.item||'');
 const recall=details.recall===true&&!details.assisted&&details.selfAssessed!==true;
 const effort=details.density?(.8+Math.min(6,Math.max(1,details.density))/6*.2+Math.min(3,Math.max(0,details.difficulty||0))*.03):1;
 const weight=(details.selfAssessed?.25:details.assisted?.35:recall?1.2:.6)*effort;
 for(const key of new Set(tags.flatMap(keys).filter(validKey))){
  const r=state.mastery.records[key]||{attempts:0,errors:0,success:0,assisted:0,spaced:0,strength:0,last:0,lastRecall:0,due:0,session:'',seen:[],recent:[]};
  // Rechecking/resuming the same item cannot manufacture additional evidence.
  const token=session+'|'+source;if(r.seen.includes(token))continue;r.seen=[...r.seen,token].slice(-20);
  r.attempts++;r.last=now;r.recent=[...r.recent,!!correct].slice(-8);
  if(details.assisted)r.assisted++;
  if(correct){r.success++;if(r.session!==session){r.strength=Math.min(10,r.strength+weight);r.session=session;}
   if(recall&&(!r.lastRecall||now-r.lastRecall>=20*3600000&&Math.floor(now/DAY)!==Math.floor(r.lastRecall/DAY))){r.spaced++;r.lastRecall=now;}
   r.due=now+DAY*(r.spaced>=4?14:r.spaced>=2?7:1);
  }else{r.errors++;r.strength=Math.max(0,r.strength-.8);r.due=now;}
  state.mastery.records[key]=r;
 }
}
function priority(state,key,now=Date.now()){const r=state.mastery?.records[key];if(!r)return 1;const failures=r.recent.filter(x=>!x).length/Math.max(1,r.recent.length);return Math.max(.2,1+failures*4+(r.due<=now?1:0)-Math.min(r.spaced,5)*.2);}
function status(r){if(!r||!r.attempts)return 'Not enough practice yet';const accuracy=r.recent.filter(Boolean).length/Math.max(1,r.recent.length);return accuracy<.7?'Needs practice':r.spaced>=3&&accuracy>=.85?'Strong across spaced practice':'Improving';}
function label(key,C){const persons={yo:'yo forms',tu:'tú forms',third:'él / ella / usted forms',nosotros:'nosotros/as forms',vosotros:'vosotros/as forms',plural:'ellos / ellas / ustedes forms'};const [kind,...parts]=key.split(':');if(kind==='outcome'&&C){const unit=Object.values(C.stageUnits).flat().find(u=>u.id===parts[0]);if(unit)return unit.title;}if(kind==='person')return persons[parts[0]]||parts[0];if(kind==='form')return parts[0]+' · '+parts[1].replace(/-/g,' ')+' · '+(persons[parts[2]]||parts[2]);return parts.join(' · ').replace(/-/g,' ');}
function areas(state,C){return Object.entries(state.mastery?.records||{}).filter(([key,r])=>r.attempts>=2&&(key.startsWith('concept:')||key.startsWith('person:')||key.startsWith('form:')||key.startsWith('outcome:'))).map(([key,r])=>({key,label:label(key,C),status:status(r),priority:priority(state,key)})).sort((a,b)=>b.priority-a.priority).slice(0,16);}
root.Mastery={empty,sanitize,record,keys,priority,status,label,areas};if(typeof module!=='undefined')module.exports=root.Mastery;
})(typeof window==='undefined'?globalThis:window);
