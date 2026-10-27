(function(root){
'use strict';
const C=typeof module!=='undefined'?require('./curriculum.js'):root.Curriculum;
const D=typeof module!=='undefined'?require('./focused-bank-data.js'):root.FocusedBankData;
const A22=typeof module!=='undefined'?require('./a22-focused-data.js'):root.A22FocusedData;
const Policy=typeof module!=='undefined'?require('./assessment-policy.js'):root.AssessmentPolicy;
const source={listening:{...D.listening,'A2.2':A22.listening},speaking:{...D.speaking,'A2.2':A22.speaking}};
const clone=x=>JSON.parse(JSON.stringify(x)),code=s=>s.replace('.','').toLowerCase();
const items=[];
for(const stage of C.playableStages.filter(s=>s.startsWith('A')))for(let unit=0;unit<8;unit++){
 const lessons=C.lessons.filter(l=>l.stage===stage&&l.unit===unit),title=C.stageUnits[stage][unit].title;
 const requiredActivities=lessons.filter(l=>/l[012]$/.test(l.id)).map(l=>l.id);
 const attach=(original,kind,category,level)=>{const q={...original};for(const key of ['promptEs','englishHint','instructionLanguage','supportConcept'])delete q[key];return ({...q,practice:{kind,stage,unit,category,level,outcomeId:C.stageUnits[stage][unit].id,requiredActivities:requiredActivities.slice(),authorship:'original Friends to Amigos'},topic:title});};
 const heard=new Set();for(const l of lessons)for(const authored of l.questions){const q=Policy.prior(authored);
  if(q.listening&&!heard.has(q.listening.transcript)){heard.add(q.listening.transcript);items.push((typeof module!=='undefined'?require('./consolidation'):root.Consolidation).trackSource(attach({...clone(q),id:'focus-listen-'+q.id,sourceQuestionId:q.id},'listening','course-comprehension','supported'),q));}
  if(q.type==='speaking')items.push(attach({...clone(q),id:'focus-speak-'+q.id,sourceQuestionId:q.id,models:[q.spanish]},'speaking','course-response','contextual'));
 }
 for(const [key,transcript,prompt,answer,a,b,explanation,category] of source.listening[stage][unit])items.push(attach({id:`focus-listen-${code(stage)}-u${unit}-${key}`,type:'choice',mode:'listening',prompt,answer,options:[answer,a,b],explanation,spanish:transcript,listening:{transcript,lang:'es-ES',rate:.75}},'listening',category,stage==='A1.1'?'short':stage==='A1.2'?'connected':'linked'));
 for(const [key,prompt,model,alternative] of source.speaking[stage][unit])items.push(attach({id:`focus-speak-${code(stage)}-u${unit}-${key}`,type:'speaking',mode:'speaking',prompt,answer:model,spanish:model,models:[model,...(alternative?[alternative]:[])],explanation:'This is one possible response. Compare the message and useful phrase; pronunciation is not assessed.'},'speaking','response',/[Bb]ecause|[Ee]xplain/.test(prompt)?'reason':/[Tt]hen|[Aa]nd|[Bb]ut/.test(prompt)?'connected':'contextual'));
}
items.push(...(typeof module!=='undefined'?require('./b-focused-data.js'):root.BFocusedData));
for(let i=0;i<items.length;i++)items[i]=(typeof module!=='undefined'?require('./consolidation'):root.Consolidation).polishExternal(items[i]);
root.FocusedBank={items};if(typeof module!=='undefined')module.exports=root.FocusedBank;
})(typeof window==='undefined'?globalThis:window);
