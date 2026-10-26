(function(root){
'use strict';
const Bank=typeof module!=='undefined'?require('./focused-bank.js'):root.FocusedBank;
const Policy=typeof module!=='undefined'?require('./assessment-policy.js'):root.AssessmentPolicy;
const E=typeof module!=='undefined'?require('./engine.js'):root.Engine;
const M=typeof module!=='undefined'?require('./mastery.js'):root.Mastery;
const Path=typeof module!=='undefined'?require('./course-path.js'):root.CoursePath;
const clone=x=>JSON.parse(JSON.stringify(x)),kinds=['listening','speaking'];
const empty=()=>({recent:{listening:[],speaking:[]},seenInstructions:{listening:false,speaking:false},history:[],active:null});
const code=s=>s.replace('.','').toLowerCase();
const topicKey=q=>'concept:'+q.practice.kind+'-'+code(q.practice.stage)+'-'+q.practice.unit;
function prerequisites(C,stage,unit){return C.lessons.filter(l=>l.stage===stage&&l.unit===unit&&/l[012]$/.test(l.id)).map(l=>l.id);}
function taught(state,C,stage,unit){const assumed=C.playableStages.indexOf(stage)<C.playableStages.indexOf(Path.inferStart(state,C));return assumed||prerequisites(C,stage,unit).every(id=>state.completed.includes(id));}
function ready(state,C,q){return taught(state,C,q.practice.stage,q.practice.unit)&&(!q.practice.stage.startsWith('B')||C.playableStages.indexOf(q.practice.stage)<C.playableStages.indexOf(Path.inferStart(state,C))||q.practice.requiredActivities.every(id=>state.completed.includes(id)));}
function validPrerequisites(C,q){const base=prerequisites(C,q.practice.stage,q.practice.unit),given=q.practice.requiredActivities;if(!q.practice.stage.startsWith('B'))return JSON.stringify(given.slice().sort())===JSON.stringify(base.sort());return base.every(id=>given.includes(id))&&given.length<=5&&new Set(given).size===given.length&&given.every(id=>C.lessons.some(l=>l.id===id&&l.stage===q.practice.stage&&l.unit===q.practice.unit));}
function eligible(state,C,kind,ceiling=C.playableStages.at(-1)){if(!kinds.includes(kind)||!C.playableStages.includes(ceiling))return [];return Bank.items.filter(q=>q.practice.kind===kind&&C.playableStages.indexOf(q.practice.stage)<=C.playableStages.indexOf(ceiling)&&ready(state,C,q));}
function matches(q,key){return !key||topicKey(q)===key||key==='skill:'+q.id||q.supportConcept&&key==='concept:'+q.supportConcept;}
function focused(state,C,key){return Bank.items.filter(q=>matches(q,key)&&ready(state,C,q));}
function weight(state,q,now=Date.now(),focus=''){const review=state.reviews[q.id]||state.reviews[q.sourceQuestionId],mistake=review&&!review.corrected?1+Math.min(review.wrong,3)*.5:1;return Math.max(.2,(M.priority(state,'skill:'+q.id,now)+M.priority(state,topicKey(q),now))/2)*mistake*(matches(q,focus)&&focus?6:1);}
function shuffle(xs,rng){const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function select(state,C,kind,ceiling,focus='',rng=Math.random,now=Date.now()){
 let pool=eligible(state,C,kind,ceiling);if(focus){const related=pool.filter(q=>matches(q,focus));if(related.length){const target=related.at(-1),index=C.playableStages.indexOf(target.practice.stage);pool=pool.filter(q=>C.playableStages.indexOf(q.practice.stage)<=index);}}if(pool.length<10)return null;
 const stage=C.playableStages.filter(s=>pool.some(q=>q.practice.stage===s)).at(-1),recent=state.focused?.recent[kind]||[],picked=[],topics={},categories={};
 const prior=C.playableStages.slice(0,C.playableStages.indexOf(stage)).filter(s=>pool.some(q=>q.practice.stage===s));
 const quotas={[stage]:prior.length?6:10};if(prior.length){quotas[prior.at(-1)]=prior.length===1?4:2;for(let n=0;n<2&&prior.length>1;n++){const s=prior[Math.max(0,prior.length-2-n)];quotas[s]=(quotas[s]||0)+1;}}
 function draw(stageFilter){let options=pool.filter(q=>!picked.includes(q)&&(!stageFilter||q.practice.stage===stageFilter));if(!options.length)return false;
  if(focus){const focused=options.filter(q=>matches(q,focus)&&!recent.includes(q.id));if(focused.length)options=focused;}
  const fresh=options.filter(q=>!recent.includes(q.id));if(fresh.length)options=fresh;else {const oldest=Math.min(...options.map(q=>recent.lastIndexOf(q.id)));options=options.filter(q=>recent.lastIndexOf(q.id)<=oldest+3);}
  const weights=options.map(q=>weight(state,q,now,focus)/(1+(topics[topicKey(q)]||0)*2)/(1+(categories[q.practice.category]||0)*.7));let ticket=rng()*weights.reduce((a,b)=>a+b,0),chosen=options.at(-1);
  for(let i=0;i<options.length;i++){ticket-=weights[i];if(ticket<=0){chosen=options[i];break;}}
  picked.push(chosen);topics[topicKey(chosen)]=(topics[topicKey(chosen)]||0)+1;categories[chosen.practice.category]=(categories[chosen.practice.category]||0)+1;return true;
 }
 for(const [s,n] of Object.entries(quotas))for(let i=0;i<n;i++)if(!draw(s))break;
 while(picked.length<10)if(!draw())return null;
 return {kind:'focused',mediaKind:kind,stage,ceiling,focus,sessionId:'focused-'+kind+'-'+now+'-'+Math.floor(rng()*1000000000),started:now,questions:shuffle(picked,rng).map(original=>{const q=Policy.media(original,C,Bank.items);return {...clone(q),...(q.options?{options:shuffle(q.options,rng)}:{})};}),lesson:null,index:0,answers:[],selected:null,checked:false,readingReady:false,modelRevealed:false,audioPlayed:false,audioUnavailable:false,hintRevealed:false};
}
function remember(state,q){state.focused=state.focused||empty();const kind=q.practice.kind;state.focused.recent[kind]=[...state.focused.recent[kind].filter(id=>id!==q.id),q.id].slice(-30);}
function record(state,q,correct,details={},now=Date.now()){
 const kind=q.practice.kind;state.focused=state.focused||empty();M.record(state,[{key:'skill:'+q.id},{key:topicKey(q)},...(q.practice.outcomeId?[{key:'outcome:'+q.practice.outcomeId}]:[]),...(!details.skipped&&q.supportConcept?[{key:'concept:'+q.supportConcept}]:[])],correct,{item:q.id,session:details.session||'media-review-'+E.dayKey(new Date(now)),selfAssessed:kind==='speaking',assisted:details.assisted===true},now);
 // A successful checked listen or deliberate model/self-assessment establishes first-use understanding.
 if(!details.skipped&&(kind==='speaking'||correct))state.focused.seenInstructions[kind]=true;
}
function summary(a){const topics={};a.questions.forEach((q,i)=>{const t=topics[q.topic]||(topics[q.topic]={topic:q.topic,got:0,needs:0,total:0});t.total++;if(a.answers[i]===true)t.got++;else t.needs++;});const observed=Object.values(topics).filter(t=>t.total>=2),strong=observed.filter(t=>t.needs===0).sort((a,b)=>b.total-a.total)[0]?.topic||'',weak=Object.values(topics).filter(t=>t.needs).sort((a,b)=>b.needs-a.needs)[0]?.topic||'';return {sessionId:a.sessionId,at:Date.now(),kind:a.mediaKind,stage:a.stage,total:a.questions.length,got:a.answers.filter(x=>x===true).length,needs:a.answers.filter(x=>x!==true).length,skipped:a.answers.filter(x=>x===null).length,strong,weak};}
function finish(state,a){if(a.index!==10||a.answers.length!==10)return null;state.focused=state.focused||empty();const old=state.focused.history.find(r=>r.sessionId===a.sessionId),result=old||summary(a);if(!old)state.focused.history=[...state.focused.history,result].slice(-30);state.focused.active=null;return result;}
function sanitize(raw,state,C,question){const data=empty(),warnings=[];if(!raw||typeof raw!=='object'||Array.isArray(raw))return {data,warnings:['Invalid focused practice records']};
 for(const k of kinds){data.recent[k]=Array.isArray(raw.recent?.[k])?raw.recent[k].filter(id=>typeof id==='string'&&/^focus-(listen|speak)-[a-zA-Z0-9._-]+$/.test(id)&&id.length<180).slice(-30):[];data.seenInstructions[k]=raw.seenInstructions?.[k]===true;}
 data.history=Array.isArray(raw.history)?raw.history.filter(r=>r&&kinds.includes(r.kind)&&C.playableStages.includes(r.stage)&&r.total===10&&Number.isInteger(r.got)&&r.got>=0&&r.got<=10&&r.needs===10-r.got&&Number.isInteger(r.skipped)&&r.skipped>=0&&r.skipped<=r.needs&&Number.isFinite(r.at)&&r.at>=0&&r.at<=4102444800000&&typeof r.sessionId==='string'&&r.sessionId.length<=100).slice(-30).map(r=>({sessionId:r.sessionId,at:r.at,kind:r.kind,stage:r.stage,total:10,got:r.got,needs:r.needs,skipped:r.skipped,strong:typeof r.strong==='string'?r.strong.slice(0,200):'',weak:typeof r.weak==='string'?r.weak.slice(0,200):''})):[];
 if(raw.active){try{const a=raw.active,qs=Array.isArray(a.questions)?a.questions.map(question):[];
  if(a.kind!=='focused'||!kinds.includes(a.mediaKind)||!C.playableStages.includes(a.stage)||!C.playableStages.includes(a.ceiling)||typeof a.sessionId!=='string'||a.sessionId.length>100||!Number.isFinite(a.started)||a.started<0||a.started>4102444800000||qs.length!==10||qs.some(q=>!q||!q.practice||q.practice.kind!==a.mediaKind||!q.id?.startsWith(a.mediaKind==='listening'?'focus-listen-':'focus-speak-')||!ready(state,C,q)||C.playableStages.indexOf(q.practice.stage)>C.playableStages.indexOf(a.ceiling)||!validPrerequisites(C,q))||new Set(qs.map(q=>q.id)).size!==10||!Number.isInteger(a.index)||a.index<0||a.index>10||typeof a.checked!=='boolean'||a.checked&&a.index===10||!Array.isArray(a.answers)||a.answers.length!==a.index+(a.checked?1:0)||a.answers.some(x=>typeof x!=='boolean'&&!(x===null&&a.mediaKind==='listening'))||a.selected!==null&&(typeof a.selected!=='string'||a.selected.length>2000))throw Error();
  const q=qs[a.index],selected=a.selected;if(q?.options&&selected!==null&&!q.options.includes(selected))throw Error();if(a.checked){const submitted=a.answers.at(-1);if(a.mediaKind==='speaking'){if(a.modelRevealed!==true||!['got','needs'].includes(selected)||submitted!==(selected==='got'))throw Error();}else if(submitted===null?selected!==null:!selected?.trim()||a.audioPlayed!==true||submitted!==E.isCorrect(q,selected))throw Error();}
  data.active={kind:'focused',mediaKind:a.mediaKind,stage:a.stage,ceiling:a.ceiling,focus:typeof a.focus==='string'?a.focus.slice(0,180):'',sessionId:a.sessionId,started:a.started,questions:qs,lesson:null,index:a.index,answers:a.answers.slice(),selected,checked:a.checked,readingReady:false,modelRevealed:a.modelRevealed===true,audioPlayed:a.audioPlayed===true,audioUnavailable:a.audioUnavailable===true,...(typeof a.hintRevealed==='boolean'?{hintRevealed:a.hintRevealed}:{})};
 }catch{warnings.push('Damaged unfinished focused practice');}}
 return {data,warnings};}
root.FocusedPractice={empty,topicKey,prerequisites,taught,ready,eligible,focused,matches,weight,select,remember,record,summary,finish,sanitize};if(typeof module!=='undefined')module.exports=root.FocusedPractice;
})(typeof window==='undefined'?globalThis:window);
