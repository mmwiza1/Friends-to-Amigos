'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),UI=require('../www/dictionary-ui.js');
const entry={id:'verb-tener',kind:'word',surface:'tengo',lemma:'tener',pos:'verb',meaning:'I have',contextNote:'tengo que = I have to / must',grammar:'yo · present',pronunciation:'tengo',examples:[{es:'Tengo hambre.',en:'I am hungry.'}]};
function environment({readOnly=false,persisted=true,width=320,height=640,capacity=Infinity,insets={},overlap=0,visualViewport=null,onDiscover=()=>{}}={}){
 const listeners=new Map(),nodes=[];
 function node(tag){const handlers={};const value={tagName:tag.toUpperCase(),children:[],style:{},dataset:{},attributes:{},innerHTML:'',hidden:false,isConnected:true,
  setAttribute(name,value){this.attributes[name]=String(value);},append(child){this.children.push(child);},contains(child){return child===this||this.children.some(c=>c.contains?.(child)||c===child);},
  addEventListener(name,fn){handlers[name]=fn;},removeEventListener(name){delete handlers[name];},querySelector(){return null;},querySelectorAll(){return [];},focus(){document.activeElement=this;},
  getBoundingClientRect(){const measuredHeight=Math.min(220,parseFloat(this.style.maxHeight)||Infinity);return {width:parseFloat(this.style.width)||340,height:measuredHeight,left:0,right:340,top:0,bottom:measuredHeight};},remove(){this.isConnected=false;}};nodes.push(value);return value;}
 const document={documentElement:{clientWidth:width,clientHeight:height},createElement:node,body:node('body'),activeElement:null,addEventListener(name,fn){listeners.set(name,fn);},removeEventListener(name){listeners.delete(name);}};
 const properties={'--safe-top':'24px','--safe-bottom':'20px','--safe-left':'0px','--safe-right':'0px','--android-keyboard-overlap':overlap+'px',...insets};
 const window={document,innerWidth:width,innerHeight:height,visualViewport,addEventListener(name,fn){listeners.set('window:'+name,fn);},removeEventListener(name){listeners.delete('window:'+name);},getComputedStyle(){return {getPropertyValue:name=>properties[name]||'0px'};},setTimeout:fn=>fn()};
 const state={savedWords:[],active:{index:2,answers:[true,false]},completed:{u0l0:1},mastery:{},placement:'A1.1'},effects={save:0,toasts:[],speech:[]};
 const lexicon={get:id=>id===entry.id?entry:null,addSaved:(rows,item)=>rows.concat({id:item.id,lemma:item.lemma,meaning:item.meaning,kind:item.kind,savedAt:123}).slice(0,capacity),removeSaved:(rows,id)=>rows.filter(row=>row.id!==id)};
 const ui=UI.create({window,document,lexicon,onDiscover,getState:()=>state,canSave:()=>!readOnly,save(){effects.save++;return persisted;},speak:text=>{effects.speech.push(text);return true;},toast:text=>effects.toasts.push(text)});
 const anchor=node('span');anchor.getBoundingClientRect=()=>({left:130,right:170,top:280,bottom:300});
 return {ui,state,effects,anchor,listeners,nodes,document,window,popup:()=>nodes.find(n=>n.attributes.role==='dialog')};
}
test('dictionary word tokenization preserves all visible punctuation, whitespace and Spanish letters',()=>{
 for(const text of ['¿Habéis comido?','Tengo hambre.\nTengo que trabajar.','Me gustan los libros.','¡Sí, mañana!']){
  const parts=UI.tokenParts(text);assert.equal(parts.map(p=>p.text).join(''),text);
  for(const part of parts)assert.equal(text.slice(part.offset,part.offset+part.text.length),part.text);
 }
 assert.deepEqual(UI.tokenParts('año, pingüino').filter(p=>p.word).map(p=>p.text),['año','pingüino']);
});
test('compact dictionary popup displays contextual meaning, grammatical metadata and saved state',()=>{
 const html=UI.popupHTML(entry,{saved:true});
 assert.match(html,/tengo/);assert.match(html,/tener/);assert.match(html,/I have/);assert.match(html,/tengo que = I have to \/ must/);assert.match(html,/yo · present/);assert.match(html,/aria-pressed="true"/);assert.match(html,/✓ Saved/);assert.doesNotMatch(html,/dictionary-more" class=/);
});
test('dictionary markup escapes dictionary, saved snapshot and query strings',()=>{
 const unsafe={...entry,surface:'<img onerror="oops">',meaning:'<script>bad</script>',contextNote:'<b>unsafe</b>'};
 const popup=UI.popupHTML(unsafe);assert.doesNotMatch(popup,/<img|<script|<b>/);assert.match(popup,/&lt;img/);
 const saved=UI.savedHTML({total:1,rows:[unsafe]},{query:'"><script>bad</script>'});assert.doesNotMatch(saved,/<script>/);assert.match(saved,/&quot;&gt;&lt;script&gt;/);
});
test('unknown words receive an explicit conservative message without invented meaning or Save action',()=>{
 const html=UI.popupHTML({surface:'desconocida'});assert.match(html,/No course dictionary entry yet/);assert.match(html,/No meaning or grammar analysis is being guessed/);assert.doesNotMatch(html,/data-dict-action="save"/);
});
test('More view limits learner-dictionary detail and preserves model accents',()=>{
 const html=UI.popupHTML({...entry,senses:['one','two','three','four'],examples:[{es:'¿Habéis comido?',en:'Have you eaten?'}],forms:['tengo','tienes','tiene','tenemos','tenéis','tienen','unwanted']},{expanded:true});
 assert.match(html,/aria-expanded="true"/);assert.match(html,/¿Habéis comido\?/);assert.match(html,/tenéis/);assert.doesNotMatch(html,/>four<|unwanted/);
});
test('Saved Words exposes existing Profile actions, search and four filters without navigation tabs',()=>{
 const html=UI.savedHTML({total:1,rows:[entry]},{filter:'phrases'});
 assert.match(html,/id="saved-word-search"/);assert.match(html,/1 saved entry/);for(const action of ['savedPronounce','savedOpen','savedRemove','savedFilter'])assert.match(html,new RegExp('data-action="'+action+'"'));
 assert.match(html,/data-filter="phrases" aria-pressed="true"/);assert.match(html,/Recently saved/);assert.doesNotMatch(html,/<nav|data-action="nav"/);
});
test('popup open, Escape and Back close the overlay while keeping course state intact',()=>{
 const {ui,state,anchor,listeners}=environment(),before=JSON.stringify(state);assert.equal(ui.open(entry,anchor),true);assert.equal(ui.isOpen(),true);let prevented=false;
 listeners.get('keydown')({key:'Escape',preventDefault(){prevented=true;},stopPropagation(){}});assert.equal(prevented,true);assert.equal(ui.isOpen(),false);assert.equal(JSON.stringify(state),before);
 ui.open(entry,anchor);assert.equal(ui.back(),true);assert.equal(ui.back(),false);assert.equal(JSON.stringify(state),before);
});
test('popup fits a narrow viewport above system bars and keeps detail scrollable',()=>{
 const {ui,anchor,popup}=environment();ui.open(entry,anchor);const shown=popup();assert.equal(shown.style.width,'300px');assert.ok(parseFloat(shown.style.left)>=10);assert.ok(parseFloat(shown.style.top)>=34);assert.ok(parseFloat(shown.style.top)+220<=610);assert.ok(parseFloat(shown.style.maxHeight)<=576);
});
test('native overlay keyboard bounds the popup even when visualViewport retains its full height',()=>{
 const {ui,anchor,popup}=environment({width:384,height:800,overlap:360,insets:{'--safe-bottom':'0px'}});anchor.getBoundingClientRect=()=>({left:140,right:180,top:180,bottom:200});ui.open(entry,anchor);const shown=popup();assert.ok(parseFloat(shown.style.top)>=34);assert.ok(parseFloat(shown.style.top)+shown.getBoundingClientRect().height<=430);assert.ok(parseFloat(shown.style.left)+parseFloat(shown.style.width)<=374);
});
test('landscape popup respects left and right display cutouts without horizontal scrolling',()=>{
 const {ui,anchor,popup}=environment({width:800,height:360,insets:{'--safe-top':'0px','--safe-bottom':'20px','--safe-left':'48px','--safe-right':'24px'}});anchor.getBoundingClientRect=()=>({left:60,right:110,top:100,bottom:120});ui.open(entry,anchor);const shown=popup();assert.ok(parseFloat(shown.style.left)>=58);assert.ok(parseFloat(shown.style.left)+parseFloat(shown.style.width)<=766);assert.ok(parseFloat(shown.style.top)+shown.getBoundingClientRect().height<=330);
});
test('scrolling the selected word out of the usable viewport dismisses its floating popup',()=>{
 const {ui,anchor,listeners}=environment();ui.open(entry,anchor);anchor.getBoundingClientRect=()=>({left:140,right:180,top:-60,bottom:-40});listeners.get('window:scroll')();assert.equal(ui.isOpen(),false);
});
test('dictionary saving deduplicates entries without changing answers, hints, mastery or completion',()=>{
 const {ui,state,effects,anchor}=environment(),before=JSON.stringify({...state,savedWords:undefined});ui.open(entry,anchor);assert.equal(ui.saveCurrent(),true);assert.equal(ui.saveCurrent(),false);assert.equal(state.savedWords.length,1);assert.equal(effects.save,1);assert.equal(JSON.stringify({...state,savedWords:undefined}),before);assert.equal(ui.isOpen(),true);
});
test('a full Saved Words list cannot claim a new entry was saved or replace existing entries',()=>{
 const {ui,state,effects,anchor,popup}=environment({capacity:1000});state.savedWords=Array.from({length:1000},(_,i)=>({id:'lex-word-old-'+i,lemma:'old '+i,meaning:'previous word',kind:'word',savedAt:i}));const before=JSON.stringify(state);
 ui.open(entry,anchor);assert.equal(ui.saveCurrent(),false);assert.equal(JSON.stringify(state),before);assert.equal(effects.save,0);assert.match(effects.toasts[0],/full \(1,000 entries\)/);assert.match(popup().innerHTML,/aria-pressed="false"/);assert.doesNotMatch(popup().innerHTML,/✓ Saved/);
});
test('invalid dictionary save results fail transparently without a success claim or mutation',()=>{
 const {ui,state,effects,anchor}=environment({capacity:0}),before=JSON.stringify(state);ui.open(entry,anchor);assert.equal(ui.saveCurrent(),false);assert.equal(JSON.stringify(state),before);assert.equal(effects.save,0);assert.match(effects.toasts[0],/could not be saved/);
});
test('protected read-only saves refuse dictionary additions and removals before any mutation',()=>{
 const {ui,state,effects,anchor}=environment({readOnly:true});ui.open(entry,anchor);assert.equal(ui.saveCurrent(),false);assert.equal(state.savedWords.length,0);state.savedWords=[{id:entry.id}];assert.equal(ui.removeSaved(entry.id),false);assert.equal(state.savedWords.length,1);assert.equal(effects.save,0);assert.ok(effects.toasts.every(text=>/read-only/.test(text)));
});
test('failed local persistence clearly reports a session-only saved word',()=>{
 const {ui,state,effects,anchor,popup}=environment({persisted:false});ui.open(entry,anchor);assert.equal(ui.saveCurrent(),true);assert.equal(state.savedWords.length,1);assert.match(popup().innerHTML,/Saved this session/);assert.match(popup().innerHTML,/Export a backup/);assert.match(effects.toasts[0],/this session/);
});
test('saved pronunciation reuses the supplied speech helper and removal changes only saved words',async()=>{
 const {ui,state,effects,anchor}=environment();ui.open(entry,anchor);ui.saveCurrent();const before=JSON.stringify({...state,savedWords:undefined});await ui.pronounceSaved(entry.id);assert.deepEqual(effects.speech,['tengo']);assert.equal(ui.removeSaved(entry.id),true);assert.equal(state.savedWords.length,0);assert.equal(JSON.stringify({...state,savedWords:undefined}),before);
});
test('DOM-less test/native startup can construct the dictionary without eagerly mounting UI',()=>{
 const ui=UI.create({window:{},document:{},getState:()=>({})});assert.doesNotThrow(()=>ui.decorate({}));assert.equal(ui.open(entry),false);assert.equal(ui.isOpen(),false);assert.match(ui.savedView(),/Saved Words/);assert.doesNotThrow(()=>ui.destroy());
});

test('nearest Spanish language overrides an English document; inner English glosses stay undecorated',()=>{
 const fixture=environment(),doc=fixture.document;
 const section={hidden:false,textContent:'Tengo hambre.',dataset:{},closest:()=>null};
 const englishDocument={getAttribute:()=> 'en'};
 const spanish={getAttribute:()=> 'es',closest(selector){return selector==='[lang]'?this:selector.includes('[lang="en"]')?englishDocument:null;}};
 const english={getAttribute:()=> 'en',closest(selector){return selector==='[lang]'?this:null;}};
 let replaced=0,fragment;
 const source={nodeValue:'Tengo hambre.',parentElement:spanish,replaceWith(value){replaced++;fragment=value;}};
 const gloss={nodeValue:'I am hungry.',parentElement:english,replaceWith(){throw Error('English gloss must stay unchanged');}};
 doc.createTreeWalker=()=>{let index=0;return {nextNode:()=>[source,gloss][index++]||null};};
 doc.createDocumentFragment=()=>({children:[],append(child){this.children.push(child);}});
 doc.createTextNode=text=>({textContent:text});
 const container={querySelectorAll:()=>[section],addEventListener(){},contains:()=>true};
 fixture.ui.decorate(container);assert.equal(replaced,1);
 assert.equal(fragment.children.map(n=>n.textContent).join(''),'Tengo hambre.');
 assert.equal(fragment.children.filter(n=>n.dataset?.dictionaryToken==='').length,2);
 assert.ok(fragment.children.filter(n=>n.dataset).every(n=>n.attributes.role==='button'&&n.attributes.tabindex==='0'));
});


test('successful discovery repositions after the one-time tip is removed, without changing learning state',()=>{
 let moved=false,called=0;const f=environment({onDiscover(){moved=true;called++;}});
 f.anchor.getBoundingClientRect=()=>({left:130,right:170,top:moved?180:280,bottom:moved?200:300});
 const before=JSON.stringify(f.state);f.ui.open(entry,f.anchor);assert.equal(called,1);assert.equal(f.popup().style.top,'208px');assert.equal(JSON.stringify(f.state),before);
 f.ui.close();f.ui.open({surface:'unknown'},f.anchor);assert.equal(called,1);
});
