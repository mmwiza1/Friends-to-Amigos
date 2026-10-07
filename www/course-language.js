(function(root){
'use strict';
const D=typeof module!=='undefined'?require('./course-language-data.js'):root.CourseLanguageData;
function apply(C){for(const stage of Object.keys(D))for(let unit=0;unit<8;unit++){
 const data=D[stage][unit],prefix=stage==='A1.2'?'a12u':'a21u',lessons=C.lessons.filter(l=>l.stage===stage&&l.unit===unit),byPrompt=new Map();
 const key=prompt=>prompt.replace(/^Checkpoint: /,'');
 for(const lesson of lessons.filter(l=>!l.checkpoint))for(const q of lesson.questions){const suffix=q.id.slice((prefix+unit).length);let prompt;
  const core=suffix.match(/^l([0-2])-q([1345])$/),story=suffix.match(/^story([0-3])-q([1-5])$/),writing=suffix.match(/^write-q([1-5])$/);
  if(core)prompt=data.core[Number(core[1])][[1,3,4,5].indexOf(Number(core[2]))];
  if(story)prompt=data.stories[Number(story[1])][Number(story[2])-1];
  if(writing)prompt=data.writing[Number(writing[1])-1];
  prompt=data.extras[suffix]||prompt;
  if(q.type==='gap')prompt='Completa la frase: '+q.sentence;
  // Speaking additions have their own stable authored communicative prompt.
  if(q.type==='speaking'&&!prompt){prompt='Habla: '+byPrompt.get(key(q.prompt));if(!byPrompt.has(key(q.prompt)))throw Error('Missing speaking instruction '+q.id);}
  if(!prompt)throw Error('Missing Spanish instruction: '+q.id);
  q.promptEs=prompt;q.englishHint=hint(q);q.instructionLanguage='es';q.supportConcept='english-support-'+(stage==='A1.2'?'a12':'a21')+'-'+unit;byPrompt.set(key(q.prompt),prompt);
 }
 for(const lesson of lessons.filter(l=>l.checkpoint))for(const q of lesson.questions){const suffix=q.id.slice((prefix+unit).length),prompt=q.type==='gap'?'Completa la frase: '+q.sentence:data.extras[suffix]||byPrompt.get(key(q.prompt));if(!prompt)throw Error('Missing checkpoint Spanish: '+q.id);q.promptEs=prompt;q.englishHint=hint(q);q.instructionLanguage='es';q.supportConcept='english-support-'+(stage==='A1.2'?'a12':'a21')+'-'+unit;}
}}
function hint(q){
 // Only task wording is translated. Never interpolate a transcript, model,
 // accepted response or feedback into the hint.
 if(q.type==='gap')return 'Complete the Spanish sentence. Choose the option that fills the missing words in order.';
 return q.prompt.replace(/^Checkpoint: /,'').replace(/^From memory, write /,'Write a short Spanish response meaning ').replace(/\bUse (?:no puedo hoy|me llevo and pago|estoy libre and quieres)\./g,'Use the familiar expressions from the lesson.');
}
root.CourseLanguage={apply,hint};if(typeof module!=='undefined')module.exports=root.CourseLanguage;
})(typeof window==='undefined'?globalThis:window);
