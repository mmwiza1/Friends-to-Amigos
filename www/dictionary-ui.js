(function(root){
'use strict';
const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const wordPattern=/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:['’][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*/g;
function tokenParts(text){
 const source=String(text||''),parts=[];let end=0;
 for(const match of source.matchAll(wordPattern)){
  if(match.index>end)parts.push({text:source.slice(end,match.index),word:false,offset:end});
  parts.push({text:match[0],word:true,offset:match.index});end=match.index+match[0].length;
 }
 if(end<source.length)parts.push({text:source.slice(end),word:false,offset:end});
 return parts;
}
function grammarText(grammar){
 if(typeof grammar==='string')return grammar;
 if(!grammar||typeof grammar!=='object')return '';
 return [grammar.person,grammar.tense,grammar.number,grammar.gender,grammar.note].filter(x=>typeof x==='string'&&x).join(' · ');
}
function exampleText(example){
 if(typeof example==='string')return {es:example,en:''};
 return example&&typeof example==='object'?{es:example.es||example.spanish||example.text||'',en:example.en||example.english||example.meaning||''}:{es:'',en:''};
}
function expandedHTML(entry){
 const senses=(entry.senses||[]).slice(0,3).map(s=>typeof s==='string'?s:s.meaning||s.en||'').filter(Boolean);
 const examples=(entry.examples||[]).slice(0,3).map(exampleText).filter(e=>e.es);
 const phrases=(entry.phrases||[]).slice(0,3).map(p=>typeof p==='string'?{es:p,en:''}:exampleText(p)).filter(p=>p.es);
 const forms=(entry.forms||[]).slice(0,6).map(f=>typeof f==='string'?f:[f.person,f.form].filter(Boolean).join(': ')).filter(Boolean);
 const notes=(Array.isArray(entry.notes)?entry.notes:[entry.note||entry.notes]).filter(n=>typeof n==='string'&&n).slice(0,2);
 let html='';
 if(senses.length)html+='<h4>Other useful meanings</h4><ul>'+senses.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul>';
 if(examples.length)html+='<h4>Examples</h4>'+examples.map(e=>'<p class="dictionary-example" lang="es">'+esc(e.es)+'</p>'+(e.en?'<p class="dictionary-example-meaning">'+esc(e.en)+'</p>':'')).join('');
 if(phrases.length)html+='<h4>Common uses</h4>'+phrases.map(p=>'<p><span lang="es">'+esc(p.es)+'</span>'+(p.en?' — '+esc(p.en):'')+'</p>').join('');
 if(forms.length)html+='<h4>Useful forms</h4><ul>'+forms.map(f=>'<li lang="es">'+esc(f)+'</li>').join('')+'</ul>';
 if(notes.length)html+=notes.map(note=>'<p class="dictionary-note">'+esc(note)+'</p>').join('');
 return html||'<p>That is the course meaning available for this entry.</p>';
}
function popupHTML(entry,{saved=false,expanded=false,sessionOnly=false}={}){
 const surface=entry.surface||entry.display||entry.lemma||'',known=!!entry.id;
 return '<div class="dictionary-heading"><h3 id="dictionary-title" lang="es">'+esc(surface)+'</h3><button type="button" class="dictionary-close" data-dict-action="close" aria-label="Close dictionary">×</button></div>'+
  (known?'<p class="dictionary-lemma"><span lang="es">'+esc(entry.lemma||surface)+'</span>'+(entry.pos?' · '+esc(entry.pos):'')+'</p><p class="dictionary-meaning">'+esc(entry.meaning||'')+'</p>'+(entry.contextNote?'<p class="dictionary-context"><strong>Here:</strong> '+esc(entry.contextNote)+'</p>':'')+(grammarText(entry.grammar)?'<p class="dictionary-grammar">'+esc(grammarText(entry.grammar))+'</p>':'')+
   '<div class="dictionary-actions"><button type="button" class="pill" data-dict-action="pronounce" aria-label="Hear '+esc(entry.pronunciation||surface)+' in Spanish">Hear</button><button type="button" class="pill" data-dict-action="save" aria-pressed="'+saved+'">'+(saved?(sessionOnly?'✓ Saved this session':'✓ Saved'):entry.kind==='phrase'?'Save phrase':'Save word')+'</button><button type="button" class="plain" data-dict-action="more" aria-expanded="'+expanded+'" aria-controls="dictionary-more">'+(expanded?'Less':'More')+'</button></div>'+(sessionOnly?'<p class="dictionary-note" role="status">Saved in this session only. Export a backup to keep it if local storage is unavailable.</p>':'')+(expanded?'<section id="dictionary-more" class="dictionary-more">'+expandedHTML(entry)+'</section>':''):
   '<p class="dictionary-meaning">No course dictionary entry yet.</p><p class="dictionary-note">This word has not been added to the local learner dictionary. No meaning or grammar analysis is being guessed.</p>');
}
function savedHTML(items,{query='',filter='all'}={}){
 const filters=[['all','All'],['words','Words'],['phrases','Phrases'],['recent','Recently saved']];
 return '<h2>Saved Words</h2><p class="muted">'+items.total+' saved '+(items.total===1?'entry':'entries')+'</p><label for="saved-word-search">Search your words and phrases</label><input id="saved-word-search" type="search" value="'+esc(query)+'" placeholder="Spanish or English" autocomplete="off"><div class="filters saved-word-filters" aria-label="Filter saved words">'+filters.map(([value,label])=>'<button type="button" class="pill" data-action="savedFilter" data-filter="'+value+'" aria-pressed="'+(filter===value)+'">'+label+'</button>').join('')+'</div>'+
  (items.rows.length?'<div class="saved-word-list">'+items.rows.map(entry=>{
   const lemma=entry.lemma||entry.display||entry.surface||'',example=exampleText((entry.examples||[])[0]),context=entry.contextNote||entry.context||'';
   return '<article class="card saved-word-row"><h3 lang="es">'+esc(lemma)+'</h3><p class="saved-word-meaning">'+esc(entry.meaning||'')+'</p>'+(context?'<p class="muted">'+esc(context)+'</p>':example.es?'<p class="muted"><span lang="es">'+esc(example.es)+'</span></p>':'')+'<div class="saved-word-actions"><button type="button" class="pill" data-action="savedPronounce" data-id="'+esc(entry.id)+'" aria-label="Hear '+esc(lemma)+' in Spanish">Hear</button><button type="button" class="plain" data-action="savedOpen" data-id="'+esc(entry.id)+'" aria-label="Open dictionary for '+esc(lemma)+'">More</button><button type="button" class="plain danger" data-action="savedRemove" data-id="'+esc(entry.id)+'" aria-label="Remove '+esc(lemma)+' from Saved Words">Remove</button></div></article>';
  }).join('')+'</div>':'<div class="card empty"><p>'+esc(query?'No saved words match your search.':filter==='phrases'?'No phrases saved yet.':filter==='words'?'No words saved yet.':'Tap a Spanish word in the course, then choose Save word or Save phrase.')+'</p></div>');
}
function create({window:win=root,document:doc=win.document,lexicon=win.LearnerDictionary,getState=()=>({}),save=()=>{},canSave=()=>true,speak=()=>false,toast=()=>{},getStage=()=>undefined,onDiscover=()=>{}}={}){
 let layer=null,popup=null,current=null,anchor=null,expanded=false,returnFocus=null,positionPending=false;
 const installed=new WeakSet(),tokens=new WeakMap(),cleanup=[],sessionOnly=new Set();
 const state=()=>getState()||{},savedRows=()=>Array.isArray(state().savedWords)?state().savedWords:[];
 const isSaved=id=>savedRows().some(row=>row&&row.id===id);
 function addListener(target,type,handler,options){if(target?.addEventListener){target.addEventListener(type,handler,options);cleanup.push(()=>target.removeEventListener?.(type,handler,options));}}
 function ensurePopup(){
  if(popup)return true;
  if(!doc?.createElement||!doc.body?.append||!doc.addEventListener)return false;
  layer=doc.createElement('div');layer.className='dictionary-layer';
  popup=doc.createElement('section');popup.className='dictionary-popup';popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','false');popup.setAttribute('aria-labelledby','dictionary-title');popup.hidden=true;
  layer.append(popup);doc.body.append(layer);
  addListener(popup,'click',event=>{
   const control=event.target.closest?.('[data-dict-action]');
   event.stopPropagation();
   if(!control)return;
   event.preventDefault();
   if(control.dataset.dictAction==='close')close();
   else if(control.dataset.dictAction==='save')saveCurrent();
   else if(control.dataset.dictAction==='pronounce')pronounce(current);
   else if(control.dataset.dictAction==='more'){expanded=!expanded;renderPopup();popup.querySelector?.('[data-dict-action="more"]')?.focus?.({preventScroll:true});}
  });
  addListener(popup,'pointerdown',event=>event.stopPropagation());
  addListener(doc,'pointerdown',event=>{if(current&&!popup.contains(event.target)&&!event.target.closest?.('[data-dictionary-token]'))close();},true);
  addListener(doc,'keydown',event=>{
   if(!current)return;
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return;}
   if(event.key==='Tab'&&popup.contains(doc.activeElement)){
    const controls=Array.from(popup.querySelectorAll('button:not([disabled]), [href], [tabindex="0"]'));
    if(!controls.length)return;
    const first=controls[0],last=controls[controls.length-1];
    if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus();}
   }
  },true);
  addListener(win,'resize',schedulePosition);addListener(win,'scroll',schedulePosition,true);
  addListener(win.visualViewport,'resize',schedulePosition);addListener(win.visualViewport,'scroll',schedulePosition);
  if(win.MutationObserver&&doc.documentElement){
   const observer=new win.MutationObserver(schedulePosition);observer.observe(doc.documentElement,{attributes:true,attributeFilter:['style','class']});cleanup.push(()=>observer.disconnect());
  }
  return true;
 }
 function renderPopup(){
  if(!popup||!current)return;
  popup.innerHTML=popupHTML(current,{saved:!!current.id&&isSaved(current.id),expanded,sessionOnly:sessionOnly.has(current.id)});popup.hidden=false;position();
 }
 function metric(name){
  if(!win.getComputedStyle||!doc.documentElement)return 0;
  return Math.max(0,parseFloat(win.getComputedStyle(doc.documentElement).getPropertyValue(name))||0);
 }
 function position(){
  positionPending=false;
  if(!current||!popup)return;
  if(anchor&&anchor.isConnected===false){close(false);return;}
  const viewport=win.visualViewport,width=viewport?.width||win.innerWidth||doc.documentElement?.clientWidth||320,height=viewport?.height||win.innerHeight||doc.documentElement?.clientHeight||640,leftOffset=viewport?.offsetLeft||0,topOffset=viewport?.offsetTop||0;
  // Android overlay keyboards can occlude a full-height WebView without changing visualViewport.
  // Its native overlap is zero when WebView has already resized, so this does not double-apply it.
  const layoutBottom=(win.innerHeight||doc.documentElement?.clientHeight||height)-metric('--android-keyboard-overlap');
  const leftBound=leftOffset+metric('--safe-left')+10,rightBound=leftOffset+width-metric('--safe-right')-10,topBound=topOffset+metric('--safe-top')+10,bottomBound=Math.min(topOffset+height,layoutBottom)-metric('--safe-bottom')-10;
  const rect=anchor?.getBoundingClientRect?.()||{left:leftOffset+width/2,right:leftOffset+width/2,top:topOffset+height/2,bottom:topOffset+height/2,width:0};
  if(anchor&&(rect.bottom<topBound||rect.top>bottomBound||rect.right<leftBound||rect.left>rightBound)){close(false);return;}
  popup.style.width=Math.max(1,Math.min(340,rightBound-leftBound))+'px';
  const availableHeight=Math.max(1,bottomBound-topBound);
  popup.style.maxHeight=availableHeight+'px';
  const measured=popup.getBoundingClientRect(),preferredHeight=Math.min(measured.height||240,availableHeight),popupWidth=measured.width||parseFloat(popup.style.width);
  const below=bottomBound-rect.bottom-8,above=rect.top-topBound-8;
  const useBelow=below>=preferredHeight||below>=above,sideSpace=useBelow?below:above;
  // Long More panels scroll on the roomier side instead of covering the selected word.
  const popupHeight=Math.min(preferredHeight,sideSpace>=96?sideSpace:availableHeight);
  popup.style.maxHeight=popupHeight+'px';
  let top=useBelow?rect.bottom+8:rect.top-popupHeight-8;
  top=Math.max(topBound,Math.min(top,bottomBound-popupHeight));
  let left=(rect.left+rect.right-popupWidth)/2;left=Math.max(leftBound,Math.min(left,rightBound-popupWidth));
  popup.style.top=top+'px';popup.style.left=left+'px';
 }
 function schedulePosition(){
  if(!current||positionPending)return;
  positionPending=true;(win.requestAnimationFrame||win.setTimeout||setTimeout).call(win,position);
 }
 function close(restore=true){
  if(!current)return false;
  anchor?.classList?.remove('dictionary-active');current=null;expanded=false;
  if(popup)popup.hidden=true;
  const previous=returnFocus;returnFocus=null;anchor=null;
  if(restore&&previous?.isConnected!==false)previous?.focus?.({preventScroll:true});
  return true;
 }
 function open(entry,target){
  if(!entry||!ensurePopup())return false;
  anchor?.classList?.remove('dictionary-active');returnFocus=target||doc.activeElement;anchor=target||null;anchor?.classList?.add('dictionary-active');current=entry;expanded=false;renderPopup();popup.querySelector?.('.dictionary-close')?.focus?.({preventScroll:true});if(entry.id){onDiscover(entry);position();}return true;
 }
 function lookup(token){
  const context=tokens.get(token);if(!context)return false;
  const entry=lexicon?.lookup?.(context.surface,{sentence:context.sentence,offset:context.offset,stage:context.stage});
  return open(entry||{surface:context.surface},token);
 }
 function decorate(container){
  if(!container?.querySelectorAll||!doc?.createTreeWalker||!doc.createDocumentFragment)return;
  if(!installed.has(container)){
   installed.add(container);
   // Capture before the application action handler: a word inside a choice is vocabulary help,
   // while its sibling radio/card area keeps the normal select-then-check flow.
   addListener(container,'click',event=>{const token=event.target.closest?.('[data-dictionary-token]');if(!token||!container.contains(token))return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();lookup(token);},true);
   addListener(container,'keydown',event=>{const token=event.target.closest?.('[data-dictionary-token]');if(!token||!container.contains(token)||!['Enter',' '].includes(event.key))return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation?.();if(!event.repeat)lookup(token);},true);
  }
  if(anchor&&anchor.isConnected===false)close(false);
  for(const section of container.querySelectorAll('[data-dictionary]')){
   if(section.hidden||section.closest?.('[hidden], [aria-hidden="true"]')||section.closest?.('button, input, textarea, select, [contenteditable="true"]'))continue;
   const sentence=section.textContent||'',stage=section.dataset.dictionaryStage||getStage();
   const walker=doc.createTreeWalker(section,4),nodes=[];let node,offset=0;
   while((node=walker.nextNode())){nodes.push({node,offset});offset+=node.nodeValue.length;}
   for(const {node,offset:start} of nodes){
    if(!node.parentElement||node.parentElement.closest?.('[data-dictionary-token], button, input, textarea, select, script, style, [data-dictionary-skip], [contenteditable="true"]'))continue;
    // The document is English; an inner Spanish boundary overrides its language.
    // Only the nearest explicit language matters, including an English gloss inside it.
    const language=node.parentElement.closest?.('[lang]')?.getAttribute?.('lang');
    if(language&&!/^es(?:-|$)/i.test(language))continue;
    const parts=tokenParts(node.nodeValue);if(!parts.some(p=>p.word))continue;
    const fragment=doc.createDocumentFragment();
    for(const part of parts){
     if(!part.word){fragment.append(doc.createTextNode(part.text));continue;}
     const word=doc.createElement('span');word.className='dictionary-word';word.textContent=part.text;word.dataset.dictionaryToken='';word.setAttribute('role','button');word.setAttribute('tabindex','0');word.setAttribute('aria-label','Look up '+part.text);word.setAttribute('aria-haspopup','dialog');
     tokens.set(word,{surface:part.text,sentence,offset:start+part.offset,stage});fragment.append(word);
    }
    node.replaceWith(fragment);
   }
  }
 }
 function saveCurrent(){
  if(!current?.id||isSaved(current.id))return false;
  if(!canSave()){toast('This protected save is read-only. Export a backup before changing saved words.');return false;}
  const saved=savedRows();
  if(!lexicon?.addSaved)return false;
  const result=lexicon.addSaved(saved,current,Date.now(),current.contextNote||'');
  const next=Array.isArray(result)?result:Array.isArray(result?.items)?result.items:saved;
  if(!next.some(row=>row?.id===current.id)){
   toast(next.length>=1000?'Saved Words is full (1,000 entries). Remove an entry before saving another.':'This entry could not be saved. Your existing saved words are unchanged.');return false;
  }
  state().savedWords=next;
  const persisted=save();if(persisted===false)sessionOnly.add(current.id);renderPopup();popup.querySelector?.('[data-dict-action="save"]')?.focus?.({preventScroll:true});toast(persisted===false?'Saved for this session. Export a backup to keep it.':current.kind==='phrase'?'Phrase saved':'Word saved');return true;
 }
 async function pronounce(entry){
  if(!entry)return false;
  try{const result=await speak(entry.pronunciation||entry.surface||entry.lemma);if(result===false)toast('Spanish audio is unavailable. An installed Spanish voice is needed.');return result!==false;}catch(_){toast('Spanish audio is unavailable. An installed Spanish voice is needed.');return false;}
 }
 function savedEntry(id){
  const saved=savedRows().find(row=>row?.id===id);if(!saved)return null;
  const entry=lexicon?.get?.(saved)||lexicon?.get?.(id);return entry?{...entry,...saved,examples:entry.examples||[],phrases:entry.phrases||[],forms:entry.forms||[],notes:entry.notes||[]}:saved;
 }
 function savedView({query='',filter='all'}={}){
  const validFilter=['all','words','phrases','recent'].includes(filter)?filter:'all';
  const hasSearch=typeof lexicon?.search==='function'||typeof lexicon?.savedList==='function';
  let rows=lexicon?.search?lexicon.search(savedRows(),{query,filter:validFilter}):lexicon?.savedList?lexicon.savedList(state(),{query,filter:validFilter}):savedRows();
  if(!Array.isArray(rows))rows=rows?.items||[];
  if(!hasSearch){
   const normalized=String(query).toLocaleLowerCase('es');rows=rows.filter(row=>(validFilter!=='words'||row.kind!=='phrase')&&(validFilter!=='phrases'||row.kind==='phrase')&&(!normalized||[row.lemma,row.meaning,row.display].some(x=>String(x||'').toLocaleLowerCase('es').includes(normalized))));
   rows=rows.slice().sort((a,b)=>(b.savedAt||0)-(a.savedAt||0));
  }
  return savedHTML({total:savedRows().length,rows:rows.map(row=>savedEntry(row.id)||row)},{query,filter:validFilter});
 }
 function removeSaved(id){
  const before=savedRows();if(!before.some(row=>row?.id===id))return false;
  if(!canSave()){toast('This protected save is read-only. Export a backup before changing saved words.');return false;}
  const result=lexicon?.removeSaved?lexicon.removeSaved(before,id):before.filter(row=>row.id!==id);
  state().savedWords=Array.isArray(result)?result:result?.items||before.filter(row=>row.id!==id);sessionOnly.delete(id);const persisted=save();toast(persisted===false?'Removed for this session only. Export a backup to keep the change.':'Removed from Saved Words');return true;
 }
 function destroy(){close(false);for(const remove of cleanup)remove();layer?.remove();layer=null;popup=null;}
 return {decorate,open,close,isOpen:()=>!!current,back:()=>close(),savedView,saveCurrent,openSaved:(id,target)=>open(savedEntry(id),target),pronounceSaved:id=>pronounce(savedEntry(id)),removeSaved,destroy};
}
root.DictionaryUI={create,tokenParts,popupHTML,savedHTML,grammarText};if(typeof module!=='undefined')module.exports=root.DictionaryUI;
})(typeof window==='undefined'?globalThis:window);
