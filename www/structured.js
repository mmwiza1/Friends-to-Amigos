(function(root){
'use strict';
const normalize=s=>String(s??'').normalize('NFC').toLowerCase().replace(/[áéíóúü]/g,c=>({á:'a',é:'e',í:'i',ó:'o',ú:'u',ü:'u'}[c])).replace(/[¿?¡!.,;:”“"']/g,' ').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim();
const active=q=>q?.type==='tiles'||q?.type==='cloze';
function selection(value){try{const a=JSON.parse(value);return Array.isArray(a)&&a.length<=100&&a.every(x=>Number.isInteger(x)&&x>=0)?a:[];}catch{return [];}}
function response(q,value){const picked=selection(value);if(q.type==='tiles')return picked.map(i=>q.tiles[i]||'').join(' ');if(q.type==='cloze')return q.cloze.segments.map((s,i)=>s+(i<q.cloze.blanks.length?(q.cloze.blanks[i].options[picked[i]]||'___'):'')).join('');return String(value||'');}
function ready(q,value){const a=selection(value);return q.type==='tiles'?a.length===q.tiles.length&&new Set(a).size===a.length&&a.every(i=>i<q.tiles.length):a.length===q.cloze.blanks.length&&a.every((v,i)=>v<q.cloze.blanks[i].options.length);}
function partial(q,value){if(value===null)return true;const a=selection(value);return a.length>0&&(q.type==='tiles'?new Set(a).size===a.length&&a.every(i=>i<q.tiles.length):a.length===q.cloze.blanks.length&&a.every((v,i)=>v===999||v<q.cloze.blanks[i].options.length));}
function correct(q,value){if(!ready(q,value))return false;const a=selection(value);if(q.type==='cloze')return a.every((v,i)=>normalize(q.cloze.blanks[i].options[v])===normalize(q.cloze.blanks[i].answer));const s=normalize(response(q,value));return (q.accepted||[q.answer]).some(x=>normalize(x)===s);}
function canonical(q){if(q.type==='cloze')return JSON.stringify(q.cloze.blanks.map(b=>b.options.indexOf(b.answer)));const used=new Set(),tokens=q.answer.split(/\s+/);if(q.tileKind==='phrase'){return JSON.stringify(q.solution.map(text=>{const i=q.tiles.findIndex((x,j)=>x===text&&!used.has(j));used.add(i);return i;}));}return JSON.stringify(tokens.map(t=>{const i=q.tiles.findIndex((x,j)=>x===t&&!used.has(j));used.add(i);return i;}));}
function contract(q){if(q?.type==='tiles')return JSON.stringify({type:q.type,kind:q.tileKind,bank:q.tiles.map(normalize).sort()});if(q?.type==='cloze')return JSON.stringify({type:q.type,segments:q.cloze.segments.map(normalize),answers:q.cloze.blanks.map(b=>normalize(b.answer))});return ''; }
function shuffle(items,seed){let n=2166136261;for(const c of seed)n=Math.imul(n^c.charCodeAt(0),16777619);const a=items.slice();for(let i=a.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function tiles(q,stage){const words=q.answer.split(/\s+/);let phrase=!stage.startsWith('A1')&&words.length>(stage.startsWith('B')?5:10);const parts=[];if(phrase){for(const clause of q.answer.split(/ (?=(?:y después|y luego|y ahora|pero|porque|aunque|por eso|sin embargo|después|luego|entonces)\b)|(?<=[.!?,;:])\s+/i)){let remaining=clause.split(/\s+/);while(remaining.length>8){let cut=remaining.findIndex((w,i)=>i>=3&&i<=6&&/^(?:en|con|para|al|a|sin|de)$/i.test(w));if(cut<0)cut=6;if(/^(?:el|la|los|las|un|una)$/i.test(remaining[cut-1]))cut--;parts.push(remaining.slice(0,cut).join(' '));remaining=remaining.slice(cut);}if(remaining.length)parts.push(remaining.join(' '));}}else parts.push(...words);if(phrase&&parts.length===1){const single=parts[0].split(/\s+/),cut=single.findIndex((w,i)=>i>=2&&i<single.length-1&&/^(?:en|con|para|al|a|sin|de|que)$/i.test(w));if(cut>0)parts.splice(0,1,single.slice(0,cut).join(' '),single.slice(cut).join(' '));else{phrase=false;parts.splice(0,1,...words);}}const accepted=(q.accepted||[q.answer]).slice();
 // A short, single-clause time adjunct can naturally lead or finish a sentence.
 // Do not invent reorderings across negation, linked clauses or complex prose.
 if(words.length<=12&&!/[!?¿¡]/.test(q.answer)&&!/[.!;:].+[a-záéíóúñ]/i.test(q.answer)&&!/(?:^| )(?:y|pero|porque|aunque|si)(?: |$)/i.test(q.answer)){
  const clean=q.answer.replace(/[.]$/,'');let alternate='';const first=clean.match(/^(Hoy|Ayer|Mañana) (.+)$/i),last=clean.match(/^(.+) (hoy|ayer|mañana)$/i);
  if(first)alternate=first[2]+' '+first[1].toLowerCase();else if(last&&!/(?:por la|esta|la|de|desde|hasta|para|del|el|cada)$/i.test(last[1]))alternate=last[2]+' '+last[1];if(alternate&&!accepted.some(a=>normalize(a)===normalize(alternate)))accepted.push(alternate);
 }
 return {...q,type:'tiles',tiles:shuffle(parts,q.id),tileKind:phrase?'phrase':'word',...(phrase?{solution:parts}:{}),accepted};}
const persons=['yo','tú','él / ella / usted','nosotros/as','vosotros/as','ellos / ellas / ustedes'];
const families=[
 ['ser',['soy','eres','es','somos','sois','son']],['estar',['estoy','estás','está','estamos','estáis','están']],
 ['tener',['tengo','tienes','tiene','tenemos','tenéis','tienen']],['ir',['voy','vas','va','vamos','vais','van']],
 ['haber',['he','has','ha','hemos','habéis','han']],['hablar',['hablo','hablas','habla','hablamos','habláis','hablan']],
 ['comer',['como','comes','come','comemos','coméis','comen']],['vivir',['vivo','vives','vive','vivimos','vivís','viven']],
 ['querer',['quiero','quieres','quiere','queremos','queréis','quieren']],['poder',['puedo','puedes','puede','podemos','podéis','pueden']],
 ['vivir · imperfect',['vivía','vivías','vivía','vivíamos','vivíais','vivían']],['ser / ir · completed past',['fui','fuiste','fue','fuimos','fuisteis','fueron']],
 ['hacer · completed past',['hice','hiciste','hizo','hicimos','hicisteis','hicieron']],
 ['pronouns',['me','te','se','nos','os']],['articles',['el','la','los','las','un','una','unos','unas']],
 ['prepositions',['a','de','en','con','por','para','sin']],['connectors',['y','pero','porque','aunque','después','entonces']],
 ['body parts',['garganta','cabeza','espalda','pierna','mano']],['food and drink',['café','té','agua','leche','pan']],
 ['colours',['blanca','negra','roja','azul','verde']],['participle of hacer',['hecho','hacer','hice','hago']],
 ['one or several things hurt',['duele','duelen']]
];
function gapOptions(answer,cross,known,q){const family=families.find(([,forms])=>forms.some(f=>f.normalize('NFC').toLowerCase()===answer.normalize('NFC').toLowerCase())),available=family?family[1].filter(f=>normalize(f)!==normalize(answer)&&(!known||known.has(f.normalize('NFC').toLowerCase()))):[];
 const pool=[answer,...available,...cross,...['soy','tengo','voy','porque'].filter(f=>!known||known.has(f.normalize('NFC').toLowerCase()))],options=pool.filter((v,i)=>pool.findIndex(y=>normalize(y)===normalize(v))===i).slice(0,4);
 const verbFamily=family&&family[1].length===6&&!['articles','prepositions','connectors','colours'].includes(family[0]);
 const mistakes=options.filter(x=>x!==answer).map(option=>{let explanation=q.explanation;
  if(verbFamily&&family[1].some(f=>normalize(f)===normalize(option))){const who=persons.filter((_,i)=>normalize(family[1][i])===normalize(option)).join(' or ');explanation='“'+option+'” is the '+who+' form of '+family[0]+'. This message needs “'+answer+'”. '+q.explanation;}
  else if(family?.[0]==='one or several things hurt')explanation='Use duele for one thing that hurts and duelen for several. Check the body-part phrase. '+q.explanation;
  return {answer:option,explanation};
 });return {options:shuffle(options,q.id+'-'+answer),mistakes};
}

function cloze(q,known,focus=[],stage='A1.2'){const words=q.answer.split(/\s+/),focused=new Set(focus.map(x=>x.normalize('NFC').toLowerCase()));
 const grammar=/^(?:me|te|se|soy|eres|es|somos|son|estoy|está|están|tengo|tiene|tenemos|quiero|quiere|voy|va|vamos|he|has|ha|hemos|fui|fue|fuimos|porque|pero|después|aunque|había|habían|habíamos|sea|fuera|si|de|a|duele|duelen)$/i;
 const priority=x=>focused.has(x.w.toLowerCase())?0:grammar.test(x.w)?1:x.w.length>5?2:3;
 const candidates=words.map((w,i)=>({w,i})).filter(x=>/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+$/.test(x.w)&&priority(x)<3).sort((a,b)=>priority(a)-priority(b)||a.i-b.i);
 const selected=candidates.slice(0,Math.min(3,words.length>8?3:2)).sort((a,b)=>a.i-b.i);if(selected.length<2)return tiles(q,stage);
 const segments=[],blanks=[];let start=0;for(const x of selected){segments.push(words.slice(start,x.i).join(' ')+(start<x.i?' ':''));const answer=x.w;const choices=gapOptions(answer,selected.map(y=>y.w).filter(y=>normalize(y)!==normalize(answer)),known,q);blanks.push({answer,options:choices.options,explanation:q.explanation,mistakes:choices.mistakes});start=x.i+1;}segments.push((start<words.length?' ':'')+words.slice(start).join(' '));for(let i=1;i<segments.length-1;i++)segments[i]=' '+segments[i];
 return {...q,type:'cloze',cloze:{segments,blanks},accepted:q.accepted||[q.answer]};
}
function validate(q){if(q.type==='tiles')return Array.isArray(q.tiles)&&q.tiles.length>0&&q.tiles.length<=100&&q.tiles.every(x=>typeof x==='string'&&x.trim().length>0&&x.length<=300)&&['word','phrase'].includes(q.tileKind)&&(!q.solution||Array.isArray(q.solution)&&q.solution.length<=100&&q.solution.every(x=>typeof x==='string'&&x.length<=300));
 if(q.type!=='cloze'||!q.cloze||!Array.isArray(q.cloze.segments)||!Array.isArray(q.cloze.blanks)||q.cloze.blanks.length<1||q.cloze.blanks.length>6||q.cloze.segments.length!==q.cloze.blanks.length+1||!q.cloze.segments.every(x=>typeof x==='string'&&x.length<=2000))return false;
 return q.cloze.blanks.every(b=>b&&typeof b.answer==='string'&&typeof b.explanation==='string'&&b.explanation.trim().length>0&&b.explanation.length<=3000&&Array.isArray(b.options)&&b.options.length>=2&&b.options.length<=8&&b.options.every(x=>typeof x==='string'&&x.trim().length>0&&x.length<=300)&&b.options.filter(x=>x===b.answer).length===1&&new Set(b.options.map(normalize)).size===b.options.length&&(!b.mistakes||Array.isArray(b.mistakes)&&b.mistakes.length<=8&&new Set(b.mistakes.map(m=>m?.answer)).size===b.mistakes.length&&b.mistakes.every(m=>m&&typeof m.answer==='string'&&b.options.includes(m.answer)&&m.answer!==b.answer&&typeof m.explanation==='string'&&m.explanation.trim().length>0&&m.explanation.length<=3000)));
}
function render(q,value,locked,esc){const a=selection(value);const token=(text)=>'<span lang="es" data-dictionary>'+esc(text)+'</span>';
 if(q.type==='tiles'){return '<section class="structured-task" aria-label="Sentence builder"><p class="muted">Build one response with these '+(q.tileKind==='phrase'?'phrases':'words')+'. Tap a word for dictionary help; use Add to build.</p><ol class="built-sentence" aria-label="Your sentence">'+a.map((index,i)=>'<li>'+token(q.tiles[index]||'')+'<button type="button" class="tile-control" data-action="tileRemove" data-position="'+i+'" aria-label="Remove part '+(i+1)+'" '+(locked?'disabled':'')+'>×</button></li>').join('')+'</ol><div class="tile-bank" aria-label="Available '+(q.tileKind==='phrase'?'phrases':'words')+'">'+q.tiles.map((t,i)=>'<div class="tile '+(a.includes(i)?'used':'')+'">'+token(t)+'<button type="button" class="tile-control" data-action="tileAdd" data-index="'+i+'" aria-label="Add '+esc(t)+' · tile '+(i+1)+' of '+q.tiles.length+'" '+(locked||a.includes(i)?'disabled':'')+'>Add</button></div>').join('')+'</div><button type="button" class="plain" data-action="structuredReset" '+(locked||!a.length?'disabled':'')+'>Start sentence again</button><p class="muted" role="status">'+a.length+' of '+q.tiles.length+' parts selected</p></section>';}
 return '<section class="structured-task" aria-label="Contextual cloze"><p class="cloze-passage" lang="es">'+q.cloze.segments.map((s,i)=>'<span data-dictionary>'+esc(s)+'</span>'+(i<q.cloze.blanks.length?'<strong class="cloze-value">['+((a[i]===undefined||a[i]===999)?'Gap '+(i+1):'<span data-dictionary>'+esc(q.cloze.blanks[i].options[a[i]])+'</span>')+']</strong>':'')).join('')+'</p>'+q.cloze.blanks.map((blank,i)=>'<fieldset class="cloze-blank"><legend>Gap '+(i+1)+'</legend>'+blank.options.map((text,j)=>'<div class="cloze-option">'+token(text)+'<button type="button" class="pill" data-action="clozePick" data-blank="'+i+'" data-index="'+j+'" aria-pressed="'+(a[i]===j)+'" aria-label="Gap '+(i+1)+': choose '+esc(text)+'" '+(locked?'disabled':'')+'>'+(a[i]===j?'✓ Selected':'Choose')+'</button></div>').join('')+'</fieldset>').join('')+'</section>';
}
root.Structured={active,normalize,selection,response,ready,partial,correct,canonical,contract,shuffle,tiles,cloze,validate,render};if(typeof module!=='undefined')module.exports=root.Structured;
})(typeof window==='undefined'?globalThis:window);
