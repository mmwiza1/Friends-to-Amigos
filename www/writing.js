(function(root){
'use strict';
const R=typeof module!=='undefined'?require('./writing-rules.js'):root.WritingRules;
const V=typeof module!=='undefined'?require('./verb-diagnostics.js'):root.VerbDiagnostics;
const modes=['controlled','guided','free'];
const normalize=value=>String(value??'').normalize('NFC').toLowerCase().replace(/[áéíóúü]/g,c=>({á:'a',é:'e',í:'i',ó:'o',ú:'u',ü:'u'}[c])).replace(/[¿?¡!.,;:”“"']/g,' ').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim();
const open=q=>q.writing&&q.writing.mode!=='controlled';
function edit(a,b){if(Math.abs(a.length-b.length)>2||a.length>500||b.length>500)return 100;let row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,row[j]+1,row[j-1]+(a[i-1]!==b[j-1]));row=next;}return row[b.length];}
function assess(q,value){
 const learner=String(value??''),clean=normalize(learner),mode=q.writing?.mode||'controlled',stage=q.writing?.stage||'A1.1',model=q.answer;
 const result=(outcome,confidence,issues=[],features=[])=>({mode,outcome,confidence,learner,model,issues,features,verified:mode!=='free'&&['correct-natural','correct-acceptable'].includes(outcome)});
 if(!clean)return result('off-task','high',[{category:'empty',explanation:'Write a response before comparing it with the task.',confidence:'high',provenance:'task-structure'}]);
 if(mode!=='free'&&q.accepted?.some(a=>normalize(a)===clean))return result(clean===normalize(model)?'correct-natural':'correct-acceptable','high');
 const authored=q.mistakes?.find(m=>normalize(m.answer)===clean);
 const issues=authored?[{category:'authored-misconception',explanation:authored.explanation,confidence:'high',provenance:'authored-question'}]:[];
 // Quoted examples in an open response may intentionally contain someone else's error.
 const diagnosticText=mode==='controlled'?learner:learner.replace(/«[^»]*»|“[^”]*”|"[^"]*"/g,' ');
 if(q.language==='es'){issues.push(...R.diagnose(diagnosticText,stage,normalize,q.writing?.unit));issues.push(...V.explicitSubject(diagnosticText,stage,normalize));
  for(const context of q.writing?.verbs||[]){const form=clean.match(new RegExp(context.prefix+' ([a-zñ]+)\\b'))?.[1];if(form){const observation=V.analyseVerbForm({...context,learnerForm:form},normalize);if(observation)issues.push(observation);}}
 }
 if(mode==='controlled'){
  if(!issues.length&&clean!==normalize(model)&&edit(clean,normalize(model))<=2)issues.push({category:'near-miss',confidence:'medium',provenance:'edit-distance',explanation:'Your response is close to this model. Compare the changed letters; this comparison is not a general spelling check.'});
  return result('incorrect','high',issues);
 }
 const requirements=q.writing?.requirements||[],features=requirements.map(r=>({label:r.label,found:r.any.some(term=>new RegExp('(?:^| )'+normalize(term).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?: |$)').test(clean))}));
 if(issues.length)return result('meaning-clear-needs-fix','high',issues,features);
 // Task features are evidence of coverage, never proof of grammaticality.
 // Only an authored equivalent can receive verified correctness. No dictionary guesses.
 if(q.writing?.offTask?.some(term=>normalize(term)===clean))return result('off-task','high',[],features);
 return result('uncertain-show-model','low',[],features);
}
function metadata(raw){if(!raw||!modes.includes(raw.mode)||!['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2'].includes(raw.stage))return null;
 if(raw.requirements!==undefined&&(!Array.isArray(raw.requirements)||raw.requirements.length>8||raw.requirements.some(r=>!r||typeof r.label!=='string'||r.label.length>500||!Array.isArray(r.any)||r.any.length>20||r.any.some(x=>typeof x!=='string'||x.length>150))))return null;
 const copy={mode:raw.mode,stage:raw.stage,multiline:raw.multiline===true,maxLength:Math.min(6000,Math.max(160,Number(raw.maxLength)||160)),...(Number.isInteger(raw.unit)&&raw.unit>=0&&raw.unit<=7?{unit:raw.unit}:{}),requirements:(raw.requirements||[]).map(r=>({label:r.label,any:r.any.slice()}))};
 if(Array.isArray(raw.verbs))copy.verbs=raw.verbs.filter(v=>v&&typeof v.lemma==='string'&&/^[a-zñ ]{1,50}$/.test(v.prefix||'')&&['first','second','third'].includes(v.expectedPerson)&&['singular','plural'].includes(v.expectedNumber)&&typeof v.tense==='string').map(v=>({...v}));
 if(Array.isArray(raw.offTask))copy.offTask=raw.offTask.filter(x=>typeof x==='string').slice(0,10);return copy;
}
function summary(a){return {'correct-natural':'A natural response','correct-acceptable':'An accepted alternative','incorrect':'Let’s improve this response','meaning-clear-needs-fix':'Check these points in your response','uncertain-show-model':'Compare your response with one possible model','off-task':'Return to the task'}[a.outcome];}
root.Writing={modes,normalize,open,edit,assess,metadata,summary};if(typeof module!=='undefined')module.exports=root.Writing;
})(typeof window==='undefined'?globalThis:window);
