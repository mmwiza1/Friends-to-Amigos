const {test}=require('node:test'),assert=require('node:assert/strict');
const Forms=require('../www/spanish-forms.js'),S=require('../www/structured.js'),C=require('../www/curriculum.js');
// The original definition; replaceForm must keep exactly this whole-token behaviour.
function reference(sentence,form,replacement){const escaped=form.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),match=new RegExp('(?<![\\p{L}\\p{N}_])'+escaped+'(?![\\p{L}\\p{N}_])','u').exec(sentence);if(!match)throw Error('Authored form not found as a whole token: '+form);return sentence.slice(0,match.index)+replacement+sentence.slice(match.index+match[0].length);}
const outcome=(fn,...args)=>{try{return fn(...args);}catch(error){return 'error:'+error.message;}};
test('whole-form replacement matches the original Unicode regex, including edge boundaries',()=>{
 const cases=[['Él habla y hablamos','habla'],['hablamos y habla','habla'],['hablamos','habla'],['_la_ la','la'],['lá la','la'],['𝐀la𝐀 la','la'],['😀la😀','la'],['á a','a'],['x.y x','x.y'],['(x) x','(x'],['la','la'],['La casa','la'],['niño ñ','ñ'],['1a 1','1']];
 for(const [sentence,form] of cases)assert.equal(outcome(Forms.replaceForm,sentence,form,'#'),outcome(reference,sentence,form,'#'),JSON.stringify([sentence,form]));
 assert.throws(()=>Forms.replaceForm('texto',' ','#'),/Missing authored Spanish form/);
});
test('whole-form replacement matches the original on real course sentences and words',()=>{
 const sentences=[...new Set(C.lessons.flatMap(l=>l.questions.flatMap(q=>[q.answer,q.spanish]).filter(x=>typeof x==='string'&&x)))].slice(0,400);
 const forms=[...new Set(sentences.flatMap(s=>s.split(/[\s,.;:!?¿¡]+/)).filter(Boolean))].slice(0,400);
 for(const sentence of sentences)for(const form of forms)assert.equal(outcome(Forms.replaceForm,sentence,form,'#'),outcome(reference,sentence,form,'#'));
});
test('cached answer normalisation returns the same value for repeated and non-string input',()=>{
 for(let i=0;i<3;i++){assert.equal(S.normalize('¿Cómo  te—llamas?'),'como te llamas');assert.equal(S.normalize(null),'');assert.equal(S.normalize(5),'5');assert.equal(S.normalize('Ñandú'),'ñandu');}
});
