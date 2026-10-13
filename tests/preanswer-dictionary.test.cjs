'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../www/engine.js'),UI=require('../www/dictionary-ui.js'),D=require('../www/learner-dictionary.js');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function rendered(q,extra={}){
 require('../www/spanish-fragments.js');
 const V=require('../www/quiz-view.js');
 const quiz={kind:'lesson',lesson:{id:'u0l0',stage:'A1.1',title:'Greetings'},questions:[q],index:0,selected:null,checked:false,answers:[],...extra};
 const b=(label,action,cls,attrs='')=>`<button type="button" class="${cls}" data-action="${action}" ${attrs}>${label}</button>`;
 return V.render({quiz,E,b,esc,readingCard:()=>'',lessonGoal:()=>'',showDictionaryTip:extra.showDictionaryTip});
}
const question={id:'fixture-mixed-prompt-q1',type:'choice',prompt:'Luis says “¿Cómo te llamas?” What answers his question?',options:['Hasta luego','Me llamo Ana','Soy de Inglaterra'],answer:'Me llamo Ana',spanish:'Me llamo Ana.',explanation:'Me llamo gives your name.'};
function tokens(html){return [...html.matchAll(/<span lang="es" data-dictionary>([\s\S]*?)<\/span>/g)].map(m=>m[1]);}

test('pre-answer mixed prompt and all Spanish choices are available without surrounding English decoration',()=>{
 const html=rendered(question),spans=tokens(html);
 assert.ok(spans.includes('¿Cómo te llamas?'));
 for(const option of question.options)assert.ok(spans.includes(option),option);
 assert.doesNotMatch(html,/<span lang="es" data-dictionary>[^<]*(?:Luis says|What answers his question)/);
 assert.doesNotMatch(html,/Correct answer|✓ Correct|Let’s learn from this/);
});
test('answer card radios and vocabulary regions are siblings, with no nested interactive buttons',()=>{
 const html=rendered(question),cards=[...html.matchAll(/<div class="choice(?: selected)?"[^>]*>([\s\S]*?)<\/div>/g)];
 assert.equal(cards.length,3);
 for(const [i,match]of cards.entries()){
  const radio=match[1].match(/<button[^>]*role="radio"[^>]*>([\s\S]*?)<\/button>/);
  assert.ok(radio);assert.doesNotMatch(radio[1],/<button|data-dictionary|role="button"/);
  assert.match(match[1],/<\/button><span class="option-text">/);
  assert.match(match[1],/aria-checked="false"/);
  assert.match(match[1],new RegExp('aria-label="'+question.options[i]+'"'));
  assert.match(match[1],new RegExp('tabindex="'+(i===0?0:-1)+'"'));
 }
});
test('Spanish answer vocabulary stays available while locked but its selection button is disabled',()=>{
 const html=rendered({...question,listening:{transcript:'Hola, me llamo Ana.'}});
 assert.match(html,/<div class="choice"[^>]*aria-disabled="true"/);
 assert.equal((html.match(/class="choice-select"[^>]*disabled/g)||[]).length,3);
 assert.ok(tokens(html).includes('Me llamo Ana'));
 assert.doesNotMatch(html,/Hola, me llamo Ana\./);
});
test('selection state and completed-answer semantics retain normal select then check flow',()=>{
 const selected=rendered(question,{selected:question.options[1]});
 assert.equal((selected.match(/aria-checked="true"/g)||[]).length,1);
 assert.match(selected,/data-index="1" role="radio" aria-checked="true" tabindex="0"/);
 assert.doesNotMatch(selected,/id="check-answer"[^>]*disabled/);
 const checked=rendered(question,{selected:question.answer,checked:true,answers:[true]});
 assert.match(checked,/✓ Correct/);assert.equal((checked.match(/class="choice-select"[^>]*disabled/g)||[]).length,3);
 assert.equal(E.isCorrect(question,question.answer),true);assert.equal(E.isCorrect(question,'Hasta luego'),false);
});
test('English choices and English homographs are not dictionary-enabled',()=>{
 const q={...question,prompt:'Which word means “Hello”?',options:['Hello','Her name','No thank you'],answer:'Hello'};
 const html=rendered(q);assert.equal(tokens(html).length,0);
 assert.match(html,/<span class="option-text">Her name<\/span>/);
});
test('explicit Spanish fragment metadata safely handles a short mixed instruction without answer inspection',()=>{
 const q={...question,prompt:'Complete me llamo with the name shown.',spanishFragments:['me llamo'],options:['Ana','Luis','Marta'],answer:'Ana'};
 const a=rendered(q),b=rendered({...q,answer:'Luis'});
 assert.deepEqual(tokens(a),tokens(b));assert.ok(tokens(a).includes('me llamo'));
 assert.doesNotMatch(a,/<span lang="es" data-dictionary>Complete/);
});
test('visible teaching models and the optional product tip never expose hidden media models',()=>{
 const q={...question,teachingModel:{spanish:'Me llamo Ana.',meaning:'My name is Ana.'}};
 const html=rendered(q,{showDictionaryTip:true});
 assert.match(html,/<div class="teaching-model"><p lang="es" data-dictionary>Me llamo Ana\.<\/p><p lang="en">My name is Ana\.<\/p>/);
 assert.match(html,/id="dictionary-discovery-tip"/);
 assert.doesNotMatch(rendered(q),/dictionary-discovery-tip/);
 const speaking={...question,type:'speaking',prompt:'Introduce yourself.',spanish:'Me llamo Ana.',options:undefined,teachingModel:q.teachingModel};
 assert.doesNotMatch(rendered(speaking),/<p lang="es" data-dictionary>Me llamo Ana\.<\/p>/);
 assert.match(rendered(speaking,{modelRevealed:true}),/<p lang="es" data-dictionary>Me llamo Ana\.<\/p>/);
 const listening={...q,listening:{transcript:'Me llamo Ana.'}};assert.doesNotMatch(rendered(listening),/<div class="teaching-model"|<p lang="es" data-dictionary>Me llamo Ana\.<\/p>/);
});
test('all learner-facing fragment, choice and model strings remain safely escaped',()=>{
 const html=rendered({...question,prompt:'Luis says “¿Cómo te llamas?” <script>bad</script>',options:['Hola <img src=x>','Hello'],answer:'Hello',teachingModel:{spanish:'Hola <script>bad</script>',meaning:'<img src=x>'}});
 assert.doesNotMatch(html,/<script>|<img /);assert.match(html,/&lt;script&gt;/);assert.match(html,/&lt;img/);
});

// A small document fixture exercises DictionaryUI's real decoration and delegated
// capture listeners. The later app listener represents answer selection: no
// learner state may change when dictionary vocabulary owns the interaction.
function decoratedChoice({unknown=false}={}){
 const state={version:2,active:{index:0,selected:null,checked:false,answers:[],hintRevealed:false},completed:{},reviews:[],events:[],mastery:{},sessions:[],games:{},savedWords:[]};
 const handlers=[],docHandlers={},created=[];let selected=0,discoveries=0;
 const doc={activeElement:null,documentElement:{clientWidth:360,clientHeight:780}};
 function node(tag){const value={tagName:tag.toUpperCase(),style:{},dataset:{},attributes:{},children:[],classList:{add(){},remove(){}},textContent:'',isConnected:true,
  setAttribute(n,v){this.attributes[n]=String(v);},append(n){this.children.push(n);},contains(n){return this===n||this.children.some(c=>c===n||c.contains?.(n));},getAttribute(n){return this.attributes[n];},
  addEventListener(){},removeEventListener(){},querySelector(){return null;},querySelectorAll(){return [];},focus(){doc.activeElement=this;},getBoundingClientRect(){return {left:20,right:300,top:180,bottom:210,width:300,height:200};},remove(){}};created.push(value);return value;}
 doc.body=node('body');doc.createElement=node;doc.createTextNode=text=>({textContent:text});doc.createDocumentFragment=()=>({children:[],append(n){this.children.push(n);}});
 doc.addEventListener=(type,fn)=>docHandlers[type]=fn;doc.removeEventListener=()=>{};
 const spanish={getAttribute:n=>n==='lang'?'es':null,closest(selector){return selector==='[lang]'?this:null;}};
 const source={nodeValue:unknown?'palabrafuera':'Me llamo Ana',parentElement:spanish,replaceWith(fragment){section.children=fragment.children;}};
 const section={textContent:source.nodeValue,dataset:{},hidden:false,children:[],closest:()=>null};
 doc.createTreeWalker=()=>{let first=true;return {nextNode:()=>first?(first=false,source):null};};
 const container={contains:()=>true,querySelectorAll:()=>[section],addEventListener(type,fn,capture){handlers.push({type,fn,capture:!!capture});},removeEventListener(){}};
 handlers.push({type:'click',capture:false,fn(){selected++;state.active.selected='Me llamo Ana';}});
 const win={document:doc,innerWidth:360,innerHeight:780,addEventListener(){},removeEventListener(){},getComputedStyle:()=>({getPropertyValue:()=> '0px'})};
 const ui=UI.create({window:win,document:doc,lexicon:D,getState:()=>state,onDiscover(){discoveries++;}});ui.decorate(container);
 const token=section.children.find(n=>n.textContent===(unknown?'palabrafuera':'llamo'));
 token.closest=selector=>selector==='[data-dictionary-token]'?token:null;
 const dispatch=(type,key)=>{const event={target:token,key,repeat:false,preventDefault(){this.defaultPrevented=true;},stopPropagation(){this.stopped=true;},stopImmediatePropagation(){this.immediate=true;}};
  for(const h of handlers.filter(h=>h.type===type).sort((a,b)=>Number(b.capture)-Number(a.capture))){h.fn(event);if(event.immediate)break;}return event;};
 return {ui,state,token,dispatch,selected:()=>selected,discoveries:()=>discoveries,docHandlers,section};
}
test('tapping a choice word opens contextual help in capture before selection and leaves every learning field intact',()=>{
 const f=decoratedChoice(),before=JSON.stringify(f.state),event=f.dispatch('click');
 assert.equal(event.defaultPrevented,true);assert.equal(event.immediate,true);assert.equal(f.ui.isOpen(),true);assert.equal(f.selected(),0);
 assert.equal(JSON.stringify(f.state),before);assert.equal(f.discoveries(),1);
 assert.equal(f.ui.close(),true);assert.equal(JSON.stringify(f.state),before);assert.equal(f.state.active.selected,null);
});
test('dictionary word Enter and Space open help without selecting, scoring or creating review evidence',()=>{
 for(const key of ['Enter',' ']){
  const f=decoratedChoice(),before=JSON.stringify(f.state),event=f.dispatch('keydown',key);
  assert.equal(event.defaultPrevented,true);assert.equal(f.ui.isOpen(),true);assert.equal(f.selected(),0);assert.equal(JSON.stringify(f.state),before);
 }
});
test('unknown entries remain conservative and do not trigger the successful-discovery acknowledgement',()=>{
 const f=decoratedChoice({unknown:true});f.dispatch('click');assert.equal(f.ui.isOpen(),true);assert.equal(f.discoveries(),0);
});
test('Spanish token labels expose useful individual words without flattening the full phrase',()=>{
 const f=decoratedChoice();assert.deepEqual(f.section.children.filter(n=>n.dataset?.dictionaryToken==='').map(n=>n.textContent),['Me','llamo','Ana']);
 for(const n of f.section.children.filter(n=>n.dataset?.dictionaryToken==='')){
  assert.equal(n.attributes.role,'button');assert.equal(n.attributes.tabindex,'0');assert.equal(n.attributes['aria-haspopup'],'dialog');assert.equal(n.attributes['aria-label'],'Look up '+n.textContent);
 }
});


test('Spanish gap options use their established task contract even for English homographs',()=>{
 const gap={...question,type:'gap',prompt:'Complete the Spanish sentence.',options:['Soy','Ha','He'],answer:'He',spanish:'He comido hoy.'};
 const html=rendered(gap);assert.deepEqual(tokens(html),['Soy','Ha','He']);
 const English={...question,options:['Yes','No'],answer:'Yes'};assert.equal(tokens(rendered(English)).filter(x=>x==='No').length,0);
});
