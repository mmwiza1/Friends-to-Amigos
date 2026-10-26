(function(root){
'use strict';
const data=typeof module!=='undefined'?require('./learner-dictionary-data.js'):root.LearnerDictionaryData;
(typeof module!=='undefined'?require('./story-vocabulary'):root.StoryVocabulary).apply(data);
// Dictionary lookup is separate from assessment. Exact accents distinguish esta/está,
// si/sí etc.; a vowel-folded fallback is used only when there is one lexical analysis.
const exact=x=>String(x||'').normalize('NFC').toLowerCase().trim().replace(/[¿?¡!.,;:«»“”"'…]/g,'').replace(/\s+/g,' ');
const fold=x=>exact(x).normalize('NFD').replace(/[\u0300\u0301\u0308]/g,'').normalize('NFC');
const entries=data.entries,byId=new Map(entries.map(e=>[e.id,e])),byAlias=new Map(),formMap=new Map(),foldedAlias=new Map(),foldedForms=new Map();
function index(map,key,value){const a=map.get(key)||[];if(!a.includes(value))a.push(value);map.set(key,a);}
for(const e of entries)for(const a of e.aliases||[e.lemma]){index(byAlias,exact(a),e);index(foldedAlias,fold(a),e);}
for(const f of data.forms){index(formMap,exact(f.surface),f);index(foldedForms,fold(f.surface),f);}
const tokenise=text=>[...String(text||'').matchAll(/[\p{L}\p{M}\p{N}]+(?:[-’'][\p{L}\p{M}]+)*/gu)].map(m=>({word:exact(m[0]),start:m.index,end:m.index+m[0].length}));
const compoundEnds=new Map(),literalWords=new Map();
for(const f of data.forms.filter(f=>f.surface.includes(' ')))index(compoundEnds,tokenise(f.surface).at(-1).word,f);
for(const e of entries.filter(e=>e.kind==='phrase'&&e.sources[0]!=='original-course-phrase-bank'))for(const alias of e.aliases){const words=tokenise(alias).map(t=>t.word);if(words.length<2||words.length>12)continue;for(const word of new Set(words))index(literalWords,word,{e,words});}
const wordEntry=lemma=>byId.get('lex-word-'+lemma);
const phraseEntry=lemma=>byId.get('lex-phrase-'+exact(lemma).replace(/ /g,'-'));
function atLevel(e,stage){const stages=['A1.1','A1.2','A2.1','A2.2','B1.1','B1.2','B2.1','B2.2'],level=stages.indexOf(stage);return level<0?e:{...e,senses:e.senses.filter(s=>!s.stage||stages.indexOf(s.stage)<=level)};}
function phraseResult(e,span,tokens,context){e=atLevel(e,context.stage);return {...e,surface:context.sentence.slice(tokens[span[0]].start,tokens[span[1]-1].end),meaning:e.meaning,contextNote:e.notes?.[0]||'',grammar:'useful expression',pronunciation:context.sentence.slice(tokens[span[0]].start,tokens[span[1]-1].end),match:{start:tokens[span[0]].start,end:tokens[span[1]-1].end},forms:[]};}
function phraseHit(tokens,at,context){const hits=[];
 function hit(lemma,start,end,priority=100){if(at<start||at>=end||/[.;:!?¿¡]/.test(context.sentence.slice(tokens[start].start,tokens[end-1].end)))return;const e=phraseEntry(lemma);if(e)hits.push({e,span:[start,end],priority});}
 const list=tokens.map(x=>x.word);
 const knownVerb=(word,verb)=>(formMap.get(word)||[]).some(f=>f.lemma===verb)||word===verb;
 const infinitive=w=>{const e=byAlias.get(w)?.find(e=>e.pos==='verb'&&exact(e.lemma)===w);return !!e;};
 for(let i=0;i<list.length;i++){
  if(knownVerb(list[i],'tener')){if(list[i+1]==='ganas'&&list[i+2]==='de')hit('tener ganas de',i,i+3);if(['hambre','sed'].includes(list[i+1]))hit('tener '+list[i+1],i,i+2);if(list[i+1]==='que'&&infinitive(list[i+2]))hit('tener que',i,i+3);const age=list.indexOf('años',i+1);if(age>i+1&&age<=i+5&&list.slice(i+1,age).every(w=>w==='y'||/^\d+$/.test(w)||byAlias.get(w)?.some(e=>e.pos==='number')))hit('tener años',i,age+1);}
  if(knownVerb(list[i],'ir')&&list[i+1]==='a'&&infinitive(list[i+2]))hit('ir a',i,i+3);
  if(knownVerb(list[i],'quedar')&&list[i+1]==='con')hit('quedar con',i,i+2);
  if(list[i]==='me'&&['gusta','gustan','duele','duelen'].includes(list[i+1]))hit('me '+list[i+1],i,i+2);
  if(knownVerb(list[i],'hacer')&&list[i+1]==='la'&&list[i+2]==='compra')hit('hacer la compra',i>0&&knownVerb(list[i-1],'haber')?i-1:i,i+3);
 }
 // Literal glossary expressions retain their authored phrase-level translations.
 // Explicit curated constructions beat whole-sentence phrase-bank examples.
 for(const {e,words} of literalWords.get(list[at])||[]){if(e.lemma==='ir a')continue;for(let i=Math.max(0,at-words.length+1);i<=at;i++)if(i+words.length<=list.length&&words.every((w,j)=>w===list[i+j]))hit(e.lemma,i,i+words.length,e.sources[0]==='original-curated'?90:20);}
 hits.sort((a,b)=>b.priority-a.priority||(b.span[1]-b.span[0])-(a.span[1]-a.span[0])||a.e.id.localeCompare(b.e.id));
 return hits.length?phraseResult(hits[0].e,hits[0].span,tokens,context):null;
}
function details(e){if(!e)return null;const phrases=entries.filter(p=>p.kind==='phrase'&&p.lemma.startsWith(e.lemma+' ')).slice(0,3).map(p=>({es:p.lemma,en:p.meaning}));const forms=data.forms.filter(f=>f.entry===e.id&&f.tense==='present').slice(0,6).map(f=>({...f,form:f.surface}));return {...e,pronunciation:e.lemma,phrases,forms};}
function get(id){if(typeof id==='object'&&id){const known=byId.get(id.id);return known?details(known):savedFallback(id);}return details(byId.get(String(id||'')));}
function savedFallback(s){if(!s||typeof s.id!=='string'||typeof s.lemma!=='string'||typeof s.meaning!=='string')return null;return {id:s.id,kind:s.kind==='phrase'?'phrase':'word',surface:s.display||s.lemma,lemma:s.lemma,pos:'saved entry',meaning:s.meaning,contextNote:'This saved meaning is retained from your vocabulary list; current dictionary analysis is unavailable.',pronunciation:s.display||s.lemma,examples:s.context?[s.context]:[],senses:[],forms:[],notes:[]};}
function pickSense(e,sentence){const text=exact(sentence),matching=e.senses?.filter(s=>s.example&&(exact(s.example)===text||text.includes(exact(s.example))))||[],meanings=[...new Set(matching.map(s=>s.meaning))];return meanings.length===1?meanings[0]:e.meaning;}
function finiteCandidates(surface,tokens,at,sentence=''){let found=formMap.get(exact(surface))||[];
 if(!found.length&&!byAlias.has(exact(surface))){const xs=foldedForms.get(fold(surface))||[];if(new Set(xs.map(x=>x.surface)).size===1)found=xs;}
 // Reflexive/compound forms are analysed only where their complete known phrase is present.
 if(tokens&&at>=0)for(const f of compoundEnds.get(tokens[at].word)||[]){const words=tokenise(f.surface).map(t=>t.word),i=at-words.length+1;if(i>=0&&words.every((w,j)=>w===tokens[i+j].word)&&!/[.;:!?¿¡]/.test(sentence.slice(tokens[i].start,tokens[at].end)))found=[f];}
 return found;
}
function lookup(surface,context={}){
 if(typeof surface!=='string'||!surface.trim()||surface.length>200)return null;
 const sentence=typeof context.sentence==='string'?context.sentence:'';const tokens=tokenise(sentence);let at=-1;
 if(Number.isInteger(context.offset))at=tokens.findIndex(t=>context.offset>=t.start&&context.offset<t.end&&exact(surface)===t.word);
 else{const matches=tokens.map((t,i)=>t.word===exact(surface)?i:-1).filter(i=>i>=0);if(matches.length===1)at=matches[0];}
 if(at>=0){const phrase=phraseHit(tokens,at,{...context,sentence});if(phrase)return phrase;}
 if(surface==='Clara'&&at>=0&&(['dice','dijo','explica','explicó','pregunta','preguntó','escribe','escribió','ha','había','va','está','tiene','propone','acepta'].includes(tokens[at+1]?.word)||sentence.slice(tokens[at].end).trim().startsWith(':')))return {id:'lex-name-clara',kind:'word',surface,lemma:'Clara',pos:'proper name',meaning:'Clara (a personal name)',contextNote:'A character’s name in this sentence.',grammar:'',pronunciation:'Clara',forms:[],senses:[],examples:[]};
 let forms=finiteCandidates(surface,tokens,at,sentence),aliases=byAlias.get(exact(surface))||[];
 if(!aliases.length){const a=foldedAlias.get(fold(surface))||[];if(new Set(a.map(e=>e.id)).size===1)aliases=a;}
 const before=at>=0?tokens[at-1]?.word:'',after=at>=0?tokens[at+1]?.word:'';
 const nounContext=['el','la','los','las','un','una','unos','unas','mi','mis','tu','tus','su','sus','nuestro','nuestra'].includes(before);
 let e;
 if(nounContext)e=aliases.find(e=>e.pos.includes('noun')||e.pos.includes('adjective'));
 if(!e&&forms.length){
  // Ser/ir have identical preterites. Select only a clear destination/identity cue.
  if(new Set(forms.map(f=>f.lemma)).size>1&&forms.some(f=>f.lemma==='ir')&&forms.some(f=>f.lemma==='ser')){
   if(['a','al','hacia'].includes(after))forms=forms.filter(f=>f.lemma==='ir');
   else if(['profesor','profesora','médico','médica','estudiante','camarero','camarera'].includes(after)||(['el','la','un','una'].includes(after)&&['profesor','profesora','médico','médica','estudiante','camarero','camarera','viaje','experiencia','problema'].includes(tokens[at+2]?.word)))forms=forms.filter(f=>f.lemma==='ser');
   else return {id:'lex-ambiguous-ser-ir',kind:'word',surface,lemma:'ir / ser',pos:'verb',meaning:'went / was (context decides)',grammar:[...new Set(forms.map(f=>f.person))].join(' / ')+' • preterite',contextNote:'Ir and ser share these past forms. A destination suggests ir; identity or description suggests ser. This sentence does not resolve the meaning confidently.',pronunciation:surface,senses:[],examples:[],forms:[],ambiguous:true};
  }
  // Como/trabajo/reserva can also be non-verbs; do not claim a verb analysis without a cue.
  const nonVerbRaw=aliases.find(e=>!e.pos.includes('verb')&&e.pos!=='course expression'&&e.kind==='word'),nonVerb=nonVerbRaw?atLevel(nonVerbRaw,context.stage):null;
  if(nonVerb&&!['yo','tú','él','ella','usted','nosotros','nosotras','vosotros','vosotras','ellos','ellas','ustedes','ana','luis','marta','diego','elena','clara'].includes(before)){
   if(exact(surface)==='como'&&!['pan','arroz','pasta','fruta','en','con'].includes(after))e=nonVerb;
   else if(nounContext)e=nonVerb;
   else if(exact(surface)!=='como')return {...details(nonVerb),surface,meaning:nonVerb.meaning,contextNote:'This form can also be a verb. The short context does not identify its use confidently.',grammar:'',pronunciation:surface,forms:[],ambiguous:true};
  }
  if(!e){const ids=[...new Set(forms.map(f=>f.entry))];if(ids.length!==1)return null;e=byId.get(ids[0]);}
 }
 if(!e)e=aliases.find(e=>e.kind==='word')||aliases[0];if(!e)return null;
 e=atLevel(e,context.stage);
 const fs=e.pos.includes('verb')?forms.filter(f=>f.entry===e.id):[],analyses=[...new Set(fs.map(f=>(f.person?f.person+' • ':'')+f.tense.replace(/-/g,' ')))];
 const selectedForms=fs.length?fs:[];let meaning=fs.length&&new Set(fs.map(f=>f.meaning).filter(Boolean)).size===1?fs.find(f=>f.meaning)?.meaning||pickSense(e,sentence):pickSense(e,sentence);if(fs.length&&fs.every(f=>f.tense==='preterite')&&['ir','ser'].includes(e.lemma)){const prefix=fs[0].person==='yo'?'I':fs[0].person==='tú'?'you':fs[0].person==='nosotros/as'?'we':fs[0].person==='vosotros/as'?'you (informal plural)':fs[0].person==='él / ella / usted'?'he/she; you (formal)':'they; you (plural)';meaning=prefix+' '+(e.lemma==='ir'?'went':fs[0].person==='yo'||fs[0].person==='él / ella / usted'?'was':'were');}
 const contextNote=analyses.length>1?'This spelling is shared by more than one person or tense; use the sentence to decide.':e.notes?.[0]||'';
 const canonicalSurface=byAlias.has(exact(surface))||formMap.has(exact(surface))?surface:fs.find(f=>fold(f.surface)===fold(surface))?.surface||e.aliases.find(a=>fold(a)===fold(surface))||surface;
 return {...details(e),surface:canonicalSurface,meaning,baseMeaning:e.meaning,pos:e.lemma==='haber'?'auxiliary verb':e.pos,grammar:analyses.join(' / '),contextNote,pronunciation:canonicalSurface,forms:selectedForms.map(f=>({...f,form:f.surface})),match:at>=0?{start:tokens[at].start,end:tokens[at].end}:undefined};
}
function sanitizeSaved(raw){if(!Array.isArray(raw))return [];const out=[],seen=new Set();for(const x of raw.slice(0,2000)){if(!x||typeof x!=='object'||typeof x.id!=='string'||!/^lex-[\p{L}\p{N}-]{1,180}$/u.test(x.id)||seen.has(x.id))continue;const current=byId.get(x.id),lemma=typeof x.lemma==='string'?x.lemma:current?.lemma,meaning=typeof x.meaning==='string'?x.meaning:current?.meaning;if(!lemma||!meaning||lemma.length>200||meaning.length>600)continue;const display=typeof x.display==='string'&&x.display.length<=200?x.display:lemma;const savedAt=Number.isFinite(x.savedAt)&&x.savedAt>=0&&x.savedAt<=4102444800000?Math.floor(x.savedAt):0;const s={id:x.id,kind:x.kind==='phrase'||current?.kind==='phrase'?'phrase':'word',lemma,display,meaning,savedAt};if(typeof x.context==='string'&&x.context.trim())s.context=x.context.slice(0,600);out.push(s);seen.add(x.id);if(out.length>=1000)break;}return out;}
function addSaved(raw,e,now=Date.now(),context=''){const xs=sanitizeSaved(raw);if(!e||!e.id||xs.some(x=>x.id===e.id))return xs;const s={id:e.id,kind:e.kind,lemma:e.lemma,display:e.kind==='phrase'?e.lemma:(e.surface||e.lemma),meaning:e.baseMeaning||byId.get(e.id)?.meaning||e.meaning,savedAt:now};if(context)s.context=context;return sanitizeSaved([...xs,s]);}
function removeSaved(raw,id){if(raw&&!Array.isArray(raw)&&typeof raw==='object'){raw.savedWords=removeSaved(raw.savedWords,id);return raw.savedWords;}return sanitizeSaved(raw).filter(x=>x.id!==id);}
function search(raw,options={}){const {query='',filter='all'}=options||{},q=fold(query);return sanitizeSaved(raw).filter(x=>(!q||fold(x.lemma+' '+x.display+' '+x.meaning+' '+(x.context||'')).includes(q))&&(filter==='words'||filter==='word'?x.kind==='word':filter==='phrases'||filter==='phrase'?x.kind==='phrase':true)).sort((a,b)=>filter==='recent'||filter==='recently'||filter==='recently-saved'?b.savedAt-a.savedAt||a.id.localeCompare(b.id):a.lemma.localeCompare(b.lemma,'es')).map(x=>({...get(x),...x}));}
function isSaved(state,id){return sanitizeSaved(state?.savedWords).some(x=>x.id===id);}
function saveEntry(state,e,now=Date.now(),context=''){state.savedWords=addSaved(state.savedWords,e,now,context);return state.savedWords;}
function savedList(state,options={}){return search(state?.savedWords,options);}
const api={entries,lookup,get,sanitizeSaved,addSaved,removeSaved,search,isSaved,saveEntry,savedList,tokenise,stats:{entries:entries.length,words:entries.filter(e=>e.kind==='word').length,phrases:entries.filter(e=>e.kind==='phrase').length,formMappings:data.forms.length}};
root.LearnerDictionary=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
