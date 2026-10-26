(function(root){
'use strict';
const sources=typeof module!=='undefined'?[require('./b11-data.js'),require('./b12-data.js'),require('./b21-data.js'),require('./b22-data.js')]:[root.B11Data,root.B12Data,root.B21Data,root.B22Data];
const Forms=typeof module!=='undefined'?require('./spanish-forms'):root.SpanishForms;
const clone=x=>JSON.parse(JSON.stringify(x));
const norm=x=>x.normalize('NFC').toLowerCase().replace(/[áéíóúü]/g,c=>({á:'a',é:'e',í:'i',ó:'o',ú:'u',ü:'u'}[c])).replace(/[¿?¡!.,;:”“"']/g,' ').replace(/\s+/g,' ').trim();
const uniq=xs=>xs.filter((x,i)=>xs.findIndex(y=>norm(x)===norm(y))===i);
const choice=(es,en,answer,wrong,why,mode='recognition')=>{const options=[answer,...wrong];for(let i=(es.length+answer.length)%options.length;i>0;i--)options.push(options.shift());return {type:'choice',prompt:en,promptEs:es,englishHint:en,instructionLanguage:'es',answer,spanish:answer,options,explanation:why,mode};};
const text=(es,en,answer,variants,why,mode='contextual',language='es')=>({type:'text',prompt:en,promptEs:es,englishHint:en,instructionLanguage:'es',answer,spanish:answer,accepted:uniq([answer,...variants]),explanation:why,mode,language});
function create(){const stages={};
 for(const data of sources){const {stage,code}=data,lessons=[],units=data.units.map((u,n)=>({id:code+'-'+n,title:u.title,goal:u.goal,grammar:u.grammar,phrases:u.core.map(r=>[r.model,r.translation]),note:'Original Spain-first material. Open writing receives cautious coaching, not automatic essay grading.'}));
 data.units.forEach((u,n)=>{
  const make=(suffix,title,questions,extra={})=>({id:code+'u'+n+suffix,stage,unit:n,unitId:code+'-'+n,outcomeId:code+'-'+n,title,goal:u.goal,checkpoint:false,authorship:{kind:'original',referenceRecord:'docs/resources/CURRICULUM_REFERENCE.md'},questions:questions.map((q,i)=>({...clone(q),...(q.writing?{writing:{...clone(q.writing),unit:n}}:{}),...(q.type==='text'&&q.language==='es'&&!q.writing?{writing:{mode:q.mode==='transfer'?'guided':'controlled',stage,unit:n,multiline:q.mode==='transfer',maxLength:q.mode==='transfer'?1500:160,requirements:[]}}:{}),id:code+'u'+n+suffix+'-q'+(i+1),sourceQuestionId:code+'u'+n+suffix+'-q'+(i+1),topic:u.title,supportConcept:'english-support-'+code+'-'+n})),...extra});
  const core=u.core.map((r,j)=>{
   const sentence=Forms.replaceForm(r.model,r.gap,'___');
   const qs=[choice(r.ask,r.help,r.model,r.gapWrong.map(w=>Forms.replaceForm(r.model,r.gap,w)),r.why),{...choice('Completa: '+sentence,'Complete the sentence with the taught form.',r.gap,r.gapWrong,r.why,'completion'),type:'gap',sentence,meaning:r.translation,spanish:r.model},text('Escribe en español: «'+r.translation+'».','Write the taught meaning in Spanish: '+r.translation,r.model,r.variants||[],r.why,'recall'),choice(r.dialogue[0],r.dialogue[1],r.dialogue[2],r.dialogue[3],r.dialogue[4]||r.why,'response'),text(r.transfer[0],r.transfer[1],r.transfer[2],r.transfer[3]||[],r.transfer[4]||r.why,'transfer')];
   if(j<2){const a=u.audio[j];const q=j===0?choice(a[1],a[2],a[3],a[4],a[5],'listening'):text(a[1],a[2],a[3],a[4],a[5],'listening','en-or-es');qs.push({...q,spanish:a[0],listening:{transcript:a[0],lang:'es-ES',rate:.9}});}
   else {const q=text(r.transfer[0],r.transfer[1],r.transfer[2],[],r.why);delete q.accepted;delete q.language;qs.push({...q,type:'speaking',mode:'speaking'});}
   return make('l'+j,['Descubre','Practica','Comunica'][j]+': '+u.title,qs);
  });
  const stories=u.stories.map((s,j)=>{const reading={title:s.title,text:s.text,glossary:s.glossary,stage};const qs=s.questions.map((r,i)=>({...i===1||i===3?text(r[0],r[1],r[2],r[3],r[4],['context','cause','inference','viewpoint','response'][i],'en-or-es'):choice(r[0],r[1],r[2],r[3],r[4],['context','cause','inference','viewpoint','response'][i]),reading}));return make('story'+j,'Lectura '+(j+1)+': '+s.title,qs,{reading});});
  const writing=make('write','Escribe: '+u.title,u.writing.map((r,i)=>({...text(r.es,r.en,r.model,r.variants||[],r.why,'written-production'),writing:{mode:r.mode,stage,multiline:r.mode!=='controlled',maxLength:r.mode==='free'?6000:r.mode==='guided'?3000:160,requirements:r.requirements||[],...(r.verbs?{verbs:r.verbs}:{})}})));
  const scene=u.stories[3],sentences=scene.text.match(/[^.!?]+[.!?](?:[»”])?/g)||[scene.text],model=sentences.slice(0,3).concat(sentences.slice(-2)).join(' ').replace(/\s+/g,' ').trim();
  const final=text('Resume el problema de «'+scene.title+'» y explica cómo se puede actuar en un mensaje breve para alguien que no conoce el caso.','Summarise the problem in '+scene.title+' and explain a reasonable next step to someone unfamiliar with the case.',model,[],'Explain the problem, connect a reason to a useful next step and compare with this possible account. Other natural summaries are possible.','transfer');
  final.writing={mode:'guided',stage,unit:n,multiline:true,maxLength:3000,requirements:[{label:'Explica el contexto',any:scene.text.split(/\s+/).filter(w=>/^[A-ZÁÉÍÓÚ][a-záéíóúñ]+$/.test(w)).slice(0,8)},{label:'Conecta las ideas',any:['porque','pero','después','sin embargo','por eso','aunque']}]};

  const checkpoint=make('check','Checkpoint: '+u.title,[core[0].questions[0],core[1].questions[1],core[0].questions[5],stories[3].questions[0],core[0].questions[4],core[1].questions[4],core[2].questions[3],core[2].questions[4],final],{checkpoint:true,capability:u.goal});
  lessons.push(core[0],stories[0],core[1],stories[1],core[2],stories[2],writing,stories[3],checkpoint);
 });stages[stage]={units,lessons};
 }return stages;
}
root.BCourse={create};if(typeof module!=='undefined')module.exports=root.BCourse;
})(typeof window==='undefined'?globalThis:window);
