(function(root){
'use strict';
const T=typeof module!=='undefined'?require('./conjugation-targets.js'):root.ConjugationTargets;
const M=typeof module!=='undefined'?require('./mastery.js'):root.Mastery;
const S=typeof module!=='undefined'?require('./grammar-syllabus.js'):root.GrammarSyllabus;
const Path=typeof module!=='undefined'?require('./course-path.js'):root.CoursePath;
const clone=x=>JSON.parse(JSON.stringify(x)),empty=()=>({steps:{},recent:[],history:[],active:null});
function eligible(state,C){return T.targets.filter(t=>S.allowed(state,t.stage));}
function current(state,C){const stage=S.level(state),next=Path.next(state,C);return {stage,unit:next?.stage===stage?next.unit:next?0:7};}
function pool(state,C,scope='all',focus='',filters={}){const cur=current(state,C);return eligible(state,C).filter(t=>(!['stage','current'].includes(scope)||t.stage===cur.stage)&&(!focus||tagMatch(t,focus))&&(!filters.level||t.stage===filters.level)&&(!filters.grammar||filters.grammar==='all'||(filters.grammar==='reflexive'?t.pattern.startsWith('reflexive'):t.tense===filters.grammar)));}
function tagMatch(t,key){return ['verb:'+t.verb,'tense:'+t.tense,'pattern:'+t.pattern,...T.persons.map(p=>'form:'+t.verb+':'+t.tense+':'+p),...T.persons.map(p=>'person:'+p)].includes(key);}
function shuffle(xs,rng){const a=xs.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function fullReady(state,t){return T.persons.every(p=>{const r=state.mastery?.records['form:'+t.verb+':'+t.tense+':'+p];return r&&r.spaced>=3&&r.recent.length>=3&&r.recent.filter(Boolean).length/r.recent.length>=.85;});}
function weight(state,t,now){return T.persons.reduce((n,p)=>n+M.priority(state,'form:'+t.verb+':'+t.tense+':'+p,now),0)/6;}
function build(state,C,options={},rng=Math.random,now=Date.now()){
 const mode=options.mode==='practice'?'practice':'normal',count=mode==='normal'?3:Number(options.count||3);if(![3,5,10,15,20].includes(count))return null;
 const scope=['recommended','current','unit','stage','all','custom'].includes(options.scope)?options.scope:'recommended';let available=pool(state,C,scope,options.focus||'',options.filters||{});if(options.mistakes?.length){const related=available.filter(t=>options.mistakes.includes(t.id));if(related.length)available=related;}if(!available.length)return null;
 const cur=current(state,C),phase=mode==='normal'?Math.min(3,state.blanks?.steps[cur.stage+'-'+cur.unit]||0):2,chosen=[],recent=new Set(state.blanks?.recent||[]);
 for(let n=0;n<count;n++){
  let choices=available.filter(t=>!chosen.slice(-Math.min(2,available.length-1)).includes(t));if(!choices.length)choices=available;if(n===0&&scope==='recommended'){const currentLevel=choices.filter(t=>t.stage===cur.stage);if(currentLevel.length)choices=currentLevel;}if(n===2&&scope==='recommended'&&S.levels.indexOf(cur.stage)>0){const earlier=choices.filter(t=>S.levels.indexOf(t.stage)<S.levels.indexOf(cur.stage));if(earlier.length)choices=earlier;}
  const fresh=choices.filter(t=>!recent.has(t.id));if(fresh.length)choices=fresh;
  const weights=choices.map(t=>weight(state,t,now)*(['recommended','unit'].includes(scope)?S.recommendation(state,C,t,now):1)*(scope==='unit'&&T.unitVerbs[cur.stage]?.[cur.unit]?.includes(t.verb)?2.5:1)*(options.mistakes?.includes(t.id)?4:1));let ticket=rng()*weights.reduce((a,b)=>a+b,0),t=choices.at(-1);for(let i=0;i<choices.length;i++){ticket-=weights[i];if(ticket<=0){t=choices[i];break;}}chosen.push(t);recent.add(t.id);
 }
 const entry=options.recall===true||phase>=2?'text':'choice';
 const tables=chosen.map(t=>{const full=(phase===3||mode==='practice'&&entry==='text')&&fullReady(state,t),density=full?6:mode==='practice'?4:[2,3,4,5][phase];const ranked=shuffle([0,1,2,3,4,5],rng).map(row=>({row,rank:rng()*M.priority(state,'form:'+t.verb+':'+t.tense+':'+T.persons[row],now)})).sort((a,b)=>b.rank-a.rank).map(x=>x.row);const focusPerson=options.focus?.split(':').at(-1),focusRow=T.persons.indexOf(focusPerson);if(focusRow>=0){ranked.splice(ranked.indexOf(focusRow),1);ranked.unshift(focusRow);}const rows=ranked.slice(0,density).sort((a,b)=>a-b);return {target:clone(t),rows,options:rows.map(()=>shuffle([...new Set(t.forms)],rng))};});
 return {mode,scope,phase,entry,stage:cur.stage,unit:cur.unit,started:now,tables,index:0,selected:tables[0].rows.map(()=>null),assisted:tables[0].rows.map(()=>false),checked:false,results:[]};
}
function hint(t,row){const ending=T.pattern(t);return 'For '+T.labels[row]+': '+ending+(t.pattern.startsWith('irregular')?' Try starting with “'+t.forms[row].slice(0,-2)+'…”.':'');}
function isCorrect(table,row,value){const E=typeof module!=='undefined'?require('./engine.js'):root.Engine;return E.isCorrect({type:'text',accepted:table.target.accepted[row]},value);}
function details(table,selected,assisted){return table.rows.map((row,i)=>({row,person:T.persons[row],selected:selected[i],answer:table.target.forms[row],correct:isCorrect(table,row,selected[i]),assisted:!!assisted[i],explanation:T.explain(table.target,row,isCorrect(table,row,selected[i])?table.target.forms[row]:selected[i])}));}
function check(state,now=Date.now()){
 const a=state.blanks?.active,table=a?.tables[a.index];if(!table||a.checked||a.selected.some((v,i)=>a.entry==='text'?typeof v!=='string'||!v.trim():!table.options[i].includes(v)))return null;
 const result={id:table.target.id,details:details(table,a.selected,a.assisted)};a.results.push(result);a.checked=true;
 for(const d of result.details)M.record(state,[{verb:table.target.verb,tense:table.target.tense,pattern:table.target.pattern,person:d.person}],d.correct,{item:table.target.id+'-'+d.person,session:'blanks-'+a.started,assisted:d.assisted,recall:a.entry==='text',density:table.rows.length,difficulty:a.phase},now);
 // Selectable forms are recognition; only deliberate typed retrieval counts as recall.
 return result;
}
function next(state,now=Date.now()){
 const data=state.blanks,a=data?.active;if(!a?.checked)return null;data.recent=[...data.recent,a.tables[a.index].target.id].slice(-8);a.index++;a.checked=false;
 if(a.index<a.tables.length){a.selected=a.tables[a.index].rows.map(()=>null);a.assisted=a.selected.map(()=>false);return null;}
 const ds=a.results.flatMap(r=>r.details),round={at:now,mode:a.mode,stage:a.stage,unit:a.unit,tables:a.tables.length,forms:ds.length,correct:ds.filter(d=>d.correct).length,assisted:ds.filter(d=>d.assisted).length,mistakes:[...new Set(a.results.filter(r=>r.details.some(d=>!d.correct)).map(r=>r.id))],signals:summary(ds)};
 data.history=[...data.history,round].slice(-30);if(a.mode==='normal'&&round.correct/round.forms>=.8)data.steps[a.stage+'-'+a.unit]=Math.max(data.steps[a.stage+'-'+a.unit]||0,Math.min(3,a.phase+1));data.active=null;return round;
}
function summary(ds){return T.persons.flatMap(person=>{const relevant=ds.filter(d=>d.person===person);return relevant.length?[{label:M.label('person:'+person),correct:relevant.filter(d=>d.correct).length,total:relevant.length,status:relevant.every(d=>d.correct)?'Strong today':'Needs practice'}]:[];});}
// Deliberate written recall (with meaning-safe Engine matching) unlocks full tables.
function recordRecall(state,table,row,value,assisted,session,now=Date.now()){const E=typeof module!=='undefined'?require('./engine.js'):root.Engine;const q={type:'text',accepted:table.target.accepted[row]};const correct=E.isCorrect(q,value);M.record(state,[{verb:table.target.verb,tense:table.target.tense,pattern:table.target.pattern,person:T.persons[row]}],correct,{item:table.target.id+'-'+T.persons[row],session,assisted,recall:true},now);return correct;}
function sanitize(raw,state,C){
 const data=empty(),warnings=[];if(!raw||typeof raw!=='object'||Array.isArray(raw))return {data,warnings:['Invalid table practice records']};
 const targets=new Map(T.targets.map(t=>[t.id,t]));if(raw.steps&&typeof raw.steps==='object')for(const [k,v] of Object.entries(raw.steps))if(/^(A1\.[12]|A2\.[12])-[0-7]$/.test(k)&&Number.isInteger(v)&&v>=0&&v<=3)data.steps[k]=v;
 data.recent=Array.isArray(raw.recent)?raw.recent.filter(x=>targets.has(x)).slice(-8):[];
 data.history=Array.isArray(raw.history)?raw.history.filter(r=>r&&['normal','practice'].includes(r.mode)&&C.playableStages.includes(r.stage)&&Number.isInteger(r.tables)&&r.tables>=1&&r.tables<=20&&Number.isInteger(r.forms)&&r.forms>=r.tables&&r.forms<=120&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.forms&&Number.isFinite(r.at)&&r.at>=0&&r.at<=4102444800000).slice(-30).map(r=>({at:r.at,mode:r.mode,stage:r.stage,unit:Number.isInteger(r.unit)&&r.unit>=0&&r.unit<8?r.unit:0,tables:r.tables,forms:r.forms,correct:r.correct,assisted:Number.isInteger(r.assisted)&&r.assisted>=0&&r.assisted<=r.forms?r.assisted:0,mistakes:Array.isArray(r.mistakes)?r.mistakes.filter(id=>targets.has(id)):[],signals:[]})):[];
 if(raw.active){try{
  const a=raw.active;if(!['choice','text'].includes(a.entry)||!['normal','practice'].includes(a.mode)||!['recommended','current','unit','stage','all','custom'].includes(a.scope)||!Number.isInteger(a.phase)||a.phase<0||a.phase>3||!C.playableStages.includes(a.stage)||!Number.isInteger(a.unit)||a.unit<0||a.unit>7||!Number.isFinite(a.started)||a.started<0||a.started>4102444800000||!Array.isArray(a.tables)||!([3,5,10,15,20].includes(a.tables.length))||a.mode==='normal'&&a.tables.length!==3)throw Error();
  const tables=a.tables.map(table=>{const authored=targets.get(table?.target?.id);if(!authored||JSON.stringify(table.target.forms)!==JSON.stringify(authored.forms)||!Array.isArray(table.rows)||table.rows.length<1||table.rows.length>6||new Set(table.rows).size!==table.rows.length||!table.rows.every(n=>Number.isInteger(n)&&n>=0&&n<6)||!Array.isArray(table.options)||table.options.length!==table.rows.length||table.options.some(os=>!Array.isArray(os)||JSON.stringify(os.slice().sort())!==JSON.stringify([...new Set(authored.forms)].sort())))throw Error();if(table.target.note!==undefined&&(typeof table.target.note!=='string'||table.target.note.length>3000))throw Error();return {target:{...clone(authored),...(typeof table.target.note==='string'?{note:table.target.note}:{})},rows:table.rows.slice(),options:clone(table.options)};});
  if(!Number.isInteger(a.index)||a.index<0||a.index>=tables.length||typeof a.checked!=='boolean'||!Array.isArray(a.selected)||a.selected.length!==tables[a.index].rows.length||a.selected.some((x,i)=>x!==null&&(a.entry==='text'?typeof x!=='string'||x.length>100:!tables[a.index].options[i].includes(x)))||!Array.isArray(a.assisted)||a.assisted.length!==a.selected.length||a.assisted.some(x=>typeof x!=='boolean')||!Array.isArray(a.results)||a.results.length!==a.index+(a.checked?1:0))throw Error();
  const results=a.results.map((r,i)=>{if(r.id!==tables[i].target.id||!Array.isArray(r.details)||r.details.length!==tables[i].rows.length||r.details.some((d,j)=>(a.entry==='text'?typeof d.selected!=='string'||d.selected.length>100:!tables[i].options[j].includes(d.selected))||typeof d.assisted!=='boolean'||d.correct!==isCorrect(tables[i],tables[i].rows[j],d.selected)))throw Error();return {id:r.id,details:details(tables[i],r.details.map(d=>d.selected),r.details.map(d=>d.assisted))};});
  if(a.checked&&(a.selected.some(x=>x===null)||JSON.stringify(details(tables[a.index],a.selected,a.assisted))!==JSON.stringify(results.at(-1).details)))throw Error();
  data.active={mode:a.mode,scope:a.scope,phase:a.phase,entry:a.entry,stage:a.stage,unit:a.unit,started:a.started,tables,index:a.index,selected:a.selected.slice(),assisted:a.assisted.slice(),checked:a.checked,results};
 }catch{warnings.push('Damaged unfinished table practice');}}
 return {data,warnings};
}
root.ConjugationBlanks={empty,eligible,current,pool,tagMatch,build,fullReady,weight,hint,details,check,next,summary,recordRecall,sanitize};if(typeof module!=='undefined')module.exports=root.ConjugationBlanks;
})(typeof window==='undefined'?globalThis:window);
