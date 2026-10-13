(function(root){
'use strict';
// This helper sees visible strings only. It does not read answers, grading data,
// hidden audio transcripts or speaking models. Metadata is preferred to guessing.
const dictionary=typeof module!=='undefined'?require('./learner-dictionary.js'):root.LearnerDictionary;
const wordPattern=/[\p{L}\p{M}]+(?:[’'][\p{L}\p{M}]+)*/gu;
const englishSignals=new Set(('i you we they she it my your his her their this that these those is are am was were be been being will would can could should do does did have had to from of for with in on at as the an and or but because after before then what where when who which why how say says said write choose answer ask asks asked tells telling name age country lives live hello goodbye thanks thank morning afternoon evening hungry thirsty needs need want wants like likes prefer prefers tomorrow yesterday today please right wrong one two three four five six seven eight nine ten first second third next previous sentence word words missing complete means meaning match matching response reply question questions useful suitable friend friends classmate introduce introduction greeting greetings instruction instructions read reading correct incorrect following station home work school hospital ticket train bus price time pounds dollars only').split(' '));
// These can be ordinary English words. A standalone homograph is never enough
// evidence that an unspecified-language label is Spanish.
const sharedWords=new Set(('a no me he has hay solo pie pan red sale plan hotel bar taxi radio video animal idea normal total central local final general social hospital capital familiar principal interior exterior chocolate café cafe color menu simple original metal motor doctor actor actual fatal legal piano alcohol ideal error control flexible informal material natural personal regular similar terrible visible').split(' '));
const spanishFunctions=new Set(('el la los las un una unos unas de del al con por para sin desde hasta entre hacia en y o pero porque que se te nos os mi mis tu tus su sus nuestro nuestra nuestros nuestras vuestro vuestra vuestros vuestras soy eres es somos sois son estoy estás está estamos estáis están tengo tienes tiene tenemos tenéis tienen voy vas va vamos vais van quiero quieres quiere queremos queréis quieren gusta gustan llamo llamas llama llamamos llamáis llaman').split(' '));
const exact=x=>String(x||'').normalize('NFC').toLowerCase();
function classifySpanish(value){
 if(typeof value!=='string'||!value.trim())return false;
 const words=[...value.matchAll(wordPattern)].map(m=>({surface:m[0],word:exact(m[0]),start:m.index}));
 if(!words.length)return false;
 // Accented Spanish still appears in English directions about Spanish. Do not
 // let one known word decorate the surrounding instruction.
 if(words.some(t=>englishSignals.has(t.word)))return false;
 const phrase=dictionary?.lookup(value);
 if(phrase?.kind==='phrase'&&words.some(t=>!sharedWords.has(t.word)))return true;
 let known=0,strong=0,functionCount=0,unknown=0;
 for(const t of words){
  const entry=dictionary?.lookup(t.surface,{sentence:value,offset:t.start});
  const functional=spanishFunctions.has(t.word),shared=sharedWords.has(t.word);
  if(entry||functional)known++;else unknown++;
  if(functional&&!shared)functionCount++;
  if((entry||functional)&&!shared)strong++;
 }
 if(words.length===1)return strong===1;
 // Proper names/places and beginner blanks may be absent from the lexicon.
 // One such word is fine alongside unmistakable Spanish, not beside a shared
 // English/Spanish word such as "me", "no" or "hotel" alone.
 return (strong>=2&&known/words.length>=0.6&&unknown<=Math.max(1,Math.floor(words.length/4)))||
  (strong>=1&&functionCount>=1&&known/words.length>=0.65&&unknown<=1)||
  (words.length===2&&known===1&&words.some(t=>dictionary?.lookup(t.surface)?.pos==='greeting')&&words.some(t=>!dictionary?.lookup(t.surface)&&/^\p{Lu}/u.test(t.surface)));
}
// The local lexicon is immutable for a running app. Cache only visible-text
// classifications, never questions, answers, popup context or learner state.
// A small FIFO bound also limits memory for imported historical wording.
const classificationCache=new Map(),classificationCacheLimit=512;
function isSpanish(value){
 if(typeof value!=='string'||!value.trim())return false;
 if(classificationCache.has(value))return classificationCache.get(value);
 const result=classifySpanish(value);
 if(value.length<=2000){
  if(classificationCache.size>=classificationCacheLimit)classificationCache.delete(classificationCache.keys().next().value);
  classificationCache.set(value,result);
 }
 return result;
}
function segments(value,options={}){
 options=options&&typeof options==='object'?options:{};
 const text=typeof value==='string'?value:String(value??'');
 if(!text)return [];
 // An explicit Spanish boundary already identifies every visible character.
 // Avoid reclassifying quotations inside it on each quiz redraw.
 if(/^es(?:-|$)/i.test(String(options.language||'')))return [{text,spanish:true,start:0,end:text.length}];
 const intervals=[];
 const add=(start,end)=>{if(Number.isInteger(start)&&Number.isInteger(end)&&start>=0&&end<=text.length&&start<end)intervals.push({start,end});};
 for(const fragment of Array.isArray(options.fragments)?options.fragments:[]){
  const word=typeof fragment==='string'?fragment:fragment&&typeof fragment.text==='string'?fragment.text:'';
  if(!word)continue;
  if(fragment&&typeof fragment==='object'&&Number.isInteger(fragment.start)){
   if(text.slice(fragment.start,fragment.start+word.length)===word)add(fragment.start,fragment.start+word.length);
  }else{
   let at=text.indexOf(word);while(at>=0){add(at,at+word.length);at=text.indexOf(word,at+word.length);}
  }
 }
 if(!options.language&&isSpanish(text))add(0,text.length);
 // Quotation marks remain outside the Spanish boundary, preserving original
 // punctuation and providing the dictionary only with the quoted sentence.
 const quoted=/(?:«[^»\n]+»|“[^”\n]+”|‘[^’\n]+’|"[^"\n]+"|'[^'\n]+')/g;
 for(const match of text.matchAll(quoted)){
  const content=match[0].slice(1,-1);if(isSpanish(content))add(match.index+1,match.index+match[0].length-1);
 }
 // Spanish inverted question/exclamation punctuation also provides a generic
 // visible boundary when an English prompt does not use quotation marks.
 for(const match of text.matchAll(/[¿¡][^¿¡?!\n]+[?!]/g))if(isSpanish(match[0]))add(match.index,match.index+match[0].length);
 intervals.sort((a,b)=>a.start-b.start||a.end-b.end);
 const merged=[];for(const interval of intervals){const last=merged[merged.length-1];if(last&&interval.start<=last.end)last.end=Math.max(last.end,interval.end);else merged.push({...interval});}
 const out=[];let at=0;
 for(const span of merged){if(at<span.start)out.push({text:text.slice(at,span.start),spanish:false,start:at,end:span.start});out.push({text:text.slice(span.start,span.end),spanish:true,start:span.start,end:span.end});at=span.end;}
 if(at<text.length)out.push({text:text.slice(at),spanish:false,start:at,end:text.length});
 return out;
}
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(text,esc=escape,options={}){if(typeof esc!=='function')esc=escape;return segments(text,options).map(s=>s.spanish?'<span lang="es" data-dictionary>'+esc(s.text)+'</span>':esc(s.text)).join('');}
const api={isSpanish,segments,render};root.SpanishFragments=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
