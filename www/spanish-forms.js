(function(root){
'use strict';
// Replace an authored whole form, never the same letters inside another word.
function replaceForm(sentence,form,replacement){if(typeof sentence!=='string'||typeof form!=='string'||!form.trim())throw Error('Missing authored Spanish form');const escaped=form.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),pattern=new RegExp('(?<![\\p{L}\\p{N}_])'+escaped+'(?![\\p{L}\\p{N}_])','u'),match=pattern.exec(sentence);if(!match)throw Error('Authored form not found as a whole token: '+form);return sentence.slice(0,match.index)+replacement+sentence.slice(match.index+match[0].length);}
root.SpanishForms={replaceForm};if(typeof module!=='undefined')module.exports=root.SpanishForms;
})(typeof window==='undefined'?globalThis:window);
