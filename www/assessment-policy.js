(function(root){
'use strict';
const S=typeof module!=='undefined'?require('./structured.js'):root.Structured;
const sources=new WeakMap();
function prior(q){return sources.get(q)||q;}
function precisePrompt(prompt,answer){if(!/^When\b/.test(prompt))return prompt;
 const target=S.normalize(answer);
 if(/^(at (?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)|a las |las |half past|after (?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve))/.test(target)||/^\d{1,2}:\d{2}/.test(target))return prompt.replace(/^When/,'At what time');
 if(/in the morning|in the afternoon|in the evening|por la manana|por la tarde|por la noche|this morning/.test(target))return prompt.replace(/^When/,'What time of day');
 if(/yesterday|tomorrow|on (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|^ayer$|^manana$/.test(target))return prompt.replace(/^When/,'On which day');
 return prompt;
}
function comprehension(q,lesson,original){const answers=lesson.questions.filter(x=>x.type==='text'&&x.language!=='es').map(x=>x.answer);
    // The existing authored bilingual equivalents remain the semantic target.
    // Distractors are other authored comprehension responses, never guessed translations.
    const norm=S.normalize,accepted=new Set((q.accepted||[q.answer]).map(norm));
    const local=original.filter(l=>l.stage===lesson.stage&&l.unit===lesson.unit).flatMap(l=>l.questions).filter(x=>x.type==='text'&&x.language!=='es').map(x=>x.answer);
    const stem=precisePrompt(q.prompt,q.answer).toLowerCase(),spanish=!/[a-z]+ \/ [a-z]+/i.test(q.answer)&&lesson.stage==='A2.2';
    let authored=[];
    if(/^(who|whose)|which (person|character)/.test(stem))authored=['Ana','Luis','Marta','Diego','Ana and Luis','Marta and Diego'];
    else if(/time of day/.test(stem))authored=spanish?['Por la mañana','Por la tarde','Por la noche']:['In the morning','In the afternoon','At night'];
    else if(/what time|at what time|when.*(arrive|leave|finish|appointment|meet|breakfast|bed)|until what time/.test(stem))authored=spanish?['A las ocho','A las nueve','A las diez','A las doce','Por la mañana','Por la tarde']:['At eight','At nine','At ten','At twelve','In the morning','In the afternoon'];
    else if(/^when|which day|what day/.test(stem))authored=spanish?['Ayer','Hoy','Mañana','Por la mañana','Por la tarde']:['Yesterday','Today','Tomorrow','In the morning','In the afternoon'];
    else if(/how many|how much|price|cost/.test(stem))authored=spanish?['Dos','Tres','Cinco','Diez','Veinte']:['Two','Three','Five','Ten','Twenty'];
    else if(/^where|which place/.test(stem))authored=spanish?['En casa','En el café','En la estación','En el parque']:['At home','At the café','At the station','In the park'];
    const lead=x=>norm(x.split(' / ')[0]).replace(/^(?:at the|in the|to the|on the|the|at|in|to) /,''),positive=[...accepted].flatMap(x=>x.split(' / '));
    const pool=[...authored,...answers,...local].filter(x=>!positive.some(a=>lead(a)===lead(x)||a.length>3&&lead(x).length>3&&(a.includes(lead(x))||lead(x).includes(a))));
    const alternatives=[...new Map(pool.map(x=>[lead(x),x])).values()].slice(0,3);
    if(alternatives.length<2)throw Error('Author comprehension distractors for '+q.id);
    const result={...q,type:'choice',options:S.shuffle([q.answer,...alternatives],q.id),optionsLanguage:lesson.stage==='A2.2'||lesson.stage.startsWith('B')?'es':'en'};delete result.writing;delete result.accepted;
    if(result.options.some(x=>x.includes(' / ')))result.optionSpanishFragments=result.options.map(x=>x.includes(' / ')?[x.split(' / ').slice(1).join(' / ')]:[]);
    return result;
}
function apply(C){const changes=[],original=C.lessons.map(l=>({...l,questions:l.questions.slice()}));
 for(const lesson of C.lessons){const early=['A1.1','A1.2','A2.1'].includes(lesson.stage),answers=lesson.questions.filter(q=>q.type==='text'&&q.language!=='es').map(q=>q.answer);
  lesson.questions=lesson.questions.map((q,index)=>{if(q.type!=='text')return q;
   if(!early&&['guided','free'].includes(q.writing?.mode)&&q.language==='es'){
    const result={...q,prompt:q.prompt+' Use your own wording. Compare with one possible model; other natural responses are possible.'};
    if(q.id==='a22u0write-q1')result.prompt='Write two short sentences about where you used to live and where you live now. Use your own places, or Toledo and Madrid. Compare with one possible model.';
    if(q.promptEs)result.promptEs=q.promptEs+' Puedes usar tus propias palabras. Compara con un modelo posible.';
    if(q.id==='a22u0write-q1')result.promptEs='Escribe dos frases: ¿dónde vivías antes y dónde vives ahora? Puedes usar tus propios lugares o Toledo y Madrid. Compara con un modelo posible.';
    if(q.englishHint)result.englishHint=result.prompt;
    sources.set(result,q);changes.push({id:q.id,activity:lesson.id,stage:lesson.stage,from:q.type,to:q.type,language:q.language,mode:q.writing.mode,answerUnchanged:true,reason:'Explicit model comparison and independent wording'});return result;
   }
   let result;
   if(q.language==='es'){
    result=q.answer==='Gracias'?{...q,type:'choice',options:S.shuffle(['Gracias','Por favor','De nada','Hasta luego'],q.id),optionsLanguage:'es'}:!q.listening&&q.answer.split(/\s+/).length>=5&&(index+lesson.unit)%3===0?S.cloze(q):S.tiles(q,lesson.stage);
    result.prompt=q.prompt.replace(/^From memory,?\s*/i,'').replace(/\bWrite\b/gi,'Build').replace(/\bType\b/gi,'Build')+' Use the supplied '+(result.type==='tiles'?'parts.':result.type==='cloze'?'gap options.':'reply options.');
    if(q.promptEs)result.promptEs=q.promptEs.replace(/\bEscribe\b/g,'Construye').replace(/\bRedacta\b/g,'Construye')+' Usa las opciones.';
    delete result.writing;if(result.type==='choice')delete result.accepted;
   }else{
    result=comprehension(q,lesson,original);
   }
   // The live interaction changes; the original target and snapshot are retained for the
   // explicit release audit and legacy comparisons, never substituted on resume.
   if(result.prompt==='When does Ana enter the café?')result.prompt='What time of day is it when Ana enters the café?';
   result.prompt=precisePrompt(result.prompt,q.answer).replace(/ A word or number is enough\./g,'').replace(/ A word or short phrase is enough\./g,'');if(result.englishHint)result.englishHint=result.prompt;
   sources.set(result,q);changes.push({id:q.id,activity:lesson.id,stage:lesson.stage,from:q.type,to:result.type,language:q.language,mode:q.writing?.mode||'finite',answerUnchanged:result.answer===q.answer});return result;
  });
 }
 // Media collections reference current authored objects; historical snapshots do not.
 const byId=new Map(C.lessons.flatMap(l=>l.questions.map(q=>[q.id,q])));
 C.listeningPractice=C.listeningPractice.map(q=>byId.get(q.id)||q);C.speakingPractice=C.speakingPractice.map(q=>byId.get(q.id)||q);
 for(const kind of ['numbers','time'])C[kind]=C[kind].map(q=>{if(q.type!=='text')return q;const result=S.tiles(q,'A1.1');delete result.writing;result.prompt=q.prompt.replace(/\bWrite\b/gi,'Build')+' Use the supplied parts.';sources.set(result,q);changes.push({id:q.id,activity:kind,stage:'A1.1',from:'text',to:result.type,language:q.language,mode:'finite',answerUnchanged:true});return result;});
 C.assessmentChanges=changes;return changes;
}
const mediaCache=new WeakMap(),mediaSources=new WeakMap();
function media(q,C,bank){if(q.type!=='text'||!C.assessmentChanges)return q;if(mediaCache.has(q))return mediaCache.get(q);if(!mediaSources.has(C))mediaSources.set(C,new Map(C.lessons.flatMap(l=>l.questions.map(q=>[q.id,q]))));const source=mediaSources.get(C).get(q.sourceQuestionId);let result;
 if(source?.type==='choice'&&source.answer===q.answer){result={...q,type:'choice',options:source.options.slice(),optionsLanguage:source.optionsLanguage||'en',...(source.optionSpanishFragments?{optionSpanishFragments:source.optionSpanishFragments.map(x=>x.slice())}:{})};delete result.accepted;delete result.writing;}
 else {const group={stage:q.practice.stage,unit:q.practice.unit,questions:bank.filter(x=>x.practice.stage===q.practice.stage&&x.practice.unit===q.practice.unit)};result=comprehension(q,group,[group]);}mediaCache.set(q,result);return result;}
root.AssessmentPolicy={apply,prior,media};if(typeof module!=='undefined')module.exports=root.AssessmentPolicy;
})(typeof window==='undefined'?globalThis:window);
