'use strict';
// Pedagogical exposure QA only: this does not estimate memory or mastery.
const fs=require('node:fs'),path=require('node:path');
const definitions=[
 ['hola','Hola',/\bhola\b/iu],
 ['buenos-dias','Buenos días',/\bbuenos días\b/iu],
 ['me-llamo','Me llamo…',/\bme llamo\b/iu],
 ['soy-de','Soy de…',/\bsoy de\b/iu],
 ['vivo-en','Vivo en…',/\bvivo en\b/iu],
 ['tengo','Tengo…',/\btengo\b/iu],
 ['quiero','Quiero…',/\bquiero\b/iu],
 ['me-gusta','Me gusta… / Me gustan…',/\bme gusta(?:n)?\b/iu],
 ['donde-esta','¿Dónde está…?',/¿dónde está(?:n)?(?=$|[^\p{L}])/iu],
 ['hay','Hay…',/\bhay\b/iu],
 ['voy','Voy…',/\bvoy\b/iu],
 ['voy-a','Voy a + infinitive',/\bvoy a (?:ir|leer|trabajar|quedar|caminar|comprar|desayunar|llevar|salir|pasar|preparar)\b/iu],
 ['por-favor','por favor',/\bpor favor\b/iu],
 ['gracias','gracias',/\bgracias\b/iu],
 ['a-las','a las…',/\ba las\b/iu]
];
function quotedFragments(q){return [...String(q.prompt||'').matchAll(/[“«"]([^”»"]+)[”»"]/gu)].map(match=>match[1]);}
function exposureTexts(lesson){
 // Count one activity once, even when every comprehension question stores the
 // same passage. Distractors, explanations and surrounding English instructions do not count.
 return [...new Set([lesson.reading?.text,...lesson.questions.flatMap(q=>[q.teachingModel?.spanish,q.spanish,q.sentence,q.listening?.transcript,q.answer,q.promptEs,...quotedFragments(q)])].filter(t=>typeof t==='string'&&t))];
}
function audit(course){
 const stages=['A1.1','A1.2'],units=stages.flatMap(stage=>course.stageUnits[stage].map((unit,index)=>({id:stage+'-u'+index,stage,unit:index,title:unit.title})));
 const records=definitions.map(([id,label,pattern])=>{
  const activities=course.lessons.filter(lesson=>stages.includes(lesson.stage)).flatMap(lesson=>{
   const text=exposureTexts(lesson).find(text=>pattern.test(text));
   if(!text)return [];
   return [{id:lesson.id,stage:lesson.stage,unit:lesson.unit,title:lesson.title,modes:[...new Set(lesson.questions.filter(q=>[q.teachingModel?.spanish,q.spanish,q.sentence,q.listening?.transcript,q.answer,q.reading?.text,q.promptEs,...quotedFragments(q)].some(t=>typeof t==='string'&&pattern.test(t))).map(q=>q.mode||q.type))],example:text.split('\n').find(line=>pattern.test(line))||text}];
  });
  const observed=units.map((u,index)=>activities.some(a=>a.stage===u.stage&&a.unit===u.unit)?index:-1).filter(index=>index>=0);
  const gaps=[];
  for(let n=1;n<observed.length;n++){const missing=observed[n]-observed[n-1]-1;if(missing>=4)gaps.push({kind:'between-exposures',from:units[observed[n-1]].id,to:units[observed[n]].id,interveningUnits:missing});}
  if(observed.length&&units.length-observed.at(-1)-1>=4)gaps.push({kind:'to-end-of-A1',from:units[observed.at(-1)].id,to:units.at(-1).id,interveningUnits:units.length-observed.at(-1)-1});
  return {id,label,activityCount:activities.length,unitCount:observed.length,units:observed.map(index=>units[index].id),activities,longExposureGaps:gaps};
 });
 return {policy:'Original Friends to Amigos A1 anchor-language exposure audit. Flags are author-review prompts, not fixed frequency requirements or learner mastery claims.',method:'Unit presence and activity examples of canonical answers, authored Spanish sentences, visible teaching models, quoted task fragments containing the Spanish anchor, explicit Spanish prompts, listening transcripts and story passages. One activity counts once; the same passage embedded in each question is not multiplied. Excludes wrong options, English instructions and explanatory feedback. This audit covers the main A1 course, not personalised SRS or separate focused-practice banks.',gapFlag:'Four or more intervening practical units without the literal anchor. A repeated form does not imply retrieval or mastery; communicative suitability matters more than counts.',units,anchors:records,flags:records.flatMap(a=>a.longExposureGaps.map(gap=>({anchor:a.id,...gap}))),qualityDecisions:[
  'Most needs, café requests, preferences, locations, movement, time and politeness already recur across A1.1/A1.2; their valid content was retained.',
  'An existing family introduction now reuses me llamo; an existing flat visit now reuses vivo en before introducing rooms with hay.',
  'Literal name and origin chunks remain concentrated around first meetings. Their later gaps stay visible for educator review; familiar friends are not made to re-introduce themselves just to hit counts. Personalised review and focused speaking provide additional retrieval separately.'
 ]};
}
module.exports={audit,definitions,exposureTexts};
if(require.main===module){
 const report=audit(require('../../www/curriculum')),output=path.join(__dirname,'../../docs/release/a1-anchor-recurrence.json');
 fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 console.log(`A1 anchor audit: ${report.anchors.length} constructions across ${report.units.length} units; ${report.flags.length} exposure-gap flags for educator review. Report: docs/release/a1-anchor-recurrence.json`);
}
