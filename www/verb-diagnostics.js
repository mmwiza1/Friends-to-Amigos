(function(root){
'use strict';
// First-party curated forms behind the documented adapter. No general sentence grading.
const tables=()=>typeof module!=='undefined'?require('./conjugation-targets.js'):root.ConjugationTargets;
function analyseVerbForm({lemma,learnerForm,expectedPerson,expectedNumber,tense='present',mood='indicative',variety='castillano'},normalize){
 if(variety!=='castillano')return null;
 const person=expectedNumber==='plural'?{first:3,second:4,third:5}[expectedPerson]:{first:0,second:1,third:2}[expectedPerson];
 const T=tables(),tenseKey=mood==='subjunctive'&&tense==='present'?'present-subjunctive':tense;const target=T.targets.find(t=>t.verb===lemma&&t.tense===tenseKey);if(!target||person===undefined)return null;
 const expected=target.forms[person];if(normalize(expected)===normalize(learnerForm))return null;
 const indices=target.forms.flatMap((form,i)=>normalize(form)===normalize(learnerForm)?[i]:[]);
 if(!indices.length){const alternate=T.targets.find(t=>t.verb===lemma&&t.tense!==tenseKey&&t.forms.some(f=>normalize(f)===normalize(learnerForm)));if(!alternate)return null;return {category:'verb-tense',confidence:'high',provenance:'first-party-curated-paradigm',expected,learnerForm,explanation:T.explain(target,person,learnerForm)};}
 return {category:'verb-person',confidence:'high',provenance:'first-party-curated-paradigm',expected,learnerForm,explanation:T.explain(target,person,learnerForm)};
}
function explicitSubject(value,stage,normalize){
 const T=tables();const order=['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2'],words=normalize(value).split(' '),subjects={yo:0,tu:1,el:2,ella:2,usted:2,nosotros:3,nosotras:3,vosotros:4,vosotras:4,ellos:5,ellas:5,ustedes:5};
 const observations=[];
 for(let i=0;i<words.length-1;i++){if(subjects[words[i]]===undefined)continue;const row=subjects[words[i]],next=words[i+1];
  // El may be an article, tú/tu can be possessive under the established accent policy.
  if(['el','tu'].includes(words[i]))continue;
  // Normalisation removes punctuation. A comma can instead introduce an imperative
  // (“Usted, venga”); require an uninterrupted subject/form pair in the source.
  const rawPair=new RegExp('(?:^|[.!?;]\\s*)'+words[i]+'\\s+'+next+'(?:\\s|[.!?,;:]|$)','iu');
  if(!rawPair.test(String(value).normalize('NFC').replace(/[áéíóúü]/g,c=>({á:'a',é:'e',í:'i',ó:'o',ú:'u',ü:'u'}[c]))))continue;
  const candidates=T.targets.filter(t=>order.indexOf(t.stage)<=order.indexOf(stage)&&t.tense==='present'&&t.forms.some(f=>normalize(f)===next));
  if(!candidates.length||candidates.some(t=>normalize(t.forms[row])===next))continue;
  const lemmas=[...new Set(candidates.map(t=>t.verb))];if(lemmas.length!==1)continue;
  observations.push(analyseVerbForm({lemma:lemmas[0],learnerForm:next,expectedPerson:['first','second','third'][row%3],expectedNumber:row<3?'singular':'plural'},normalize));
 }return observations.filter(Boolean);
}
root.VerbDiagnostics={analyseVerbForm,explicitSubject};if(typeof module!=='undefined')module.exports=root.VerbDiagnostics;
})(typeof window==='undefined'?globalThis:window);
