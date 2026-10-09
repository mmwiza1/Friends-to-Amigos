'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const app=require('./helpers/app.cjs');
const evaluate=(a,source)=>vm.runInContext(source,a.ctx);
const clone=value=>JSON.parse(JSON.stringify(value));
function popupDOM(a){
 const nodes=[],listeners={};
 const element=tag=>({tagName:tag.toUpperCase(),style:{},dataset:{},hidden:false,children:[],innerHTML:'',attrs:{},
  setAttribute(name,value){this.attrs[name]=String(value);},append(node){this.children.push(node);},addEventListener(type,fn){(this.listeners||={})[type]=fn;},removeEventListener(){},
  getBoundingClientRect(){return {top:50,bottom:280,left:10,right:310,width:300,height:230};},querySelector(){return null;},querySelectorAll(){return [];},contains(node){return this===node||this.children.includes(node);},remove(){},focus(){}});
 a.ctx.document.createElement=tag=>{const node=element(tag);nodes.push(node);return node;};
 a.ctx.document.addEventListener=(type,fn)=>listeners[type]=fn;a.ctx.document.removeEventListener=()=>{};
 return {nodes,listeners,popup:()=>nodes.find(n=>n.className==='dictionary-popup')};
}
function open(a,word='Tengo',sentence='Tengo hambre.'){
 return evaluate(a,'dictionaryUI.open(D.lookup('+JSON.stringify(word)+',{sentence:'+JSON.stringify(sentence)+',offset:'+sentence.toLocaleLowerCase('es').indexOf(word.toLocaleLowerCase('es'))+',stage:"A1.1"}))');
}
function learningState(a){const s=clone(evaluate(a,'state'));delete s.savedWords;return s;}
function nav(html){return html.match(/<nav aria-label="Main navigation">([\s\S]*?)<\/nav>/)?.[1];}

test('Saved Words is additive inside Profile; existing navigation labels, order and Review badge remain intact',()=>{
 const a=app();a.click('begin');a.answer(false);a.click('check');a.click('leave');
 const before=nav(a.el.innerHTML),tabs=[...before.matchAll(/data-tab="([^"]+)"/g)].map(m=>m[1]);
 assert.deepEqual(tabs,['Home','Learn','Games','Review','Profile']);assert.match(before,/data-tab="Review"[\s\S]*?<strong class="badge">1<\/strong>/);
 a.click('tab',{tab:'Profile'});assert.match(a.el.innerHTML,/Saved Words/);assert.match(a.el.innerHTML,/data-action="savedWords"/);
 assert.equal(nav(a.el.innerHTML).replace('class="active"','class=""'),before.replace('class="active"','class=""'));
 a.click('savedWords');assert.equal(evaluate(a,'screen'),'savedWords');assert.equal(evaluate(a,'tab'),'Profile');assert.doesNotMatch(a.el.innerHTML,/<nav/);
 assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.equal(evaluate(a,'screen'),'main');assert.equal(evaluate(a,'tab'),'Profile');
 a.click('tab',{tab:'Review'});assert.match(a.el.innerHTML,/Review &amp; grow|Review & grow/);assert.match(a.el.innerHTML,/Start review/);
});

test('opening, pronouncing and saving a phrase do not answer, hint, score, review or restart a lesson',()=>{
 const a=app();popupDOM(a);a.click('lesson',{id:'u0write'});a.input('Hola, soy Ana');
 const before=learningState(a),active=clone(a.state().active),question=a.current().id;
 assert.equal(open(a),true);assert.equal(evaluate(a,'dictionaryUI.isOpen()'),true);
 assert.equal(evaluate(a,'dictionaryUI.saveCurrent()'),true);assert.equal(a.state().savedWords.length,1);assert.equal(a.state().savedWords[0].kind,'phrase');
 assert.deepEqual(learningState(a),before);assert.deepEqual(a.state().active,active);assert.equal(a.current().id,question);assert.equal(a.state().active.hintRevealed,false);
 assert.equal(a.state().active.selected,'Hola, soy Ana');assert.equal(a.state().active.answers.length,0);assert.equal(a.state().active.checked,false);
});

test('dictionary Back closes the popup before Save & leave and preserves unfinished input',()=>{
 const a=app();popupDOM(a);a.click('lesson',{id:'u0write'});a.input('Hola, soy Ana');open(a);
 assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.equal(evaluate(a,'screen'),'quiz');assert.equal(evaluate(a,'dictionaryUI.isOpen()'),false);
 assert.equal(a.state().active.selected,'Hola, soy Ana');assert.equal(a.ctx.FriendsToAmigos.handleBack(),true);assert.equal(evaluate(a,'screen'),'main');
 const resumed=app({},a.state());resumed.click('continue');assert.match(resumed.el.innerHTML,/value="Hola, soy Ana"/);assert.equal(resumed.current().id,a.state().active.questions[0].id);
});

test('saving a phrase twice is idempotent and already-saved state is explicit',()=>{
 const a=app(),dom=popupDOM(a);a.click('lesson',{id:'u0write'});open(a);
 assert.equal(evaluate(a,'dictionaryUI.saveCurrent()'),true);const first=clone(a.state().savedWords);
 assert.equal(evaluate(a,'dictionaryUI.saveCurrent()'),false);assert.deepEqual(a.state().savedWords,first);
 assert.match(dom.popup().innerHTML,/aria-pressed="true"/);assert.match(dom.popup().innerHTML,/✓ Saved/);
 evaluate(a,'dictionaryUI.close()');open(a,'hambre','Tengo hambre.');assert.equal(evaluate(a,'dictionaryUI.saveCurrent()'),false);assert.deepEqual(a.state().savedWords,first);
});

test('dictionary saves persist across launch and reopen through Saved Words without replacing historical question snapshots',()=>{
 const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8')),a=app({},legacy);popupDOM(a);a.click('continue');
 const historical=clone(a.state().active);open(a);evaluate(a,'dictionaryUI.saveCurrent()');
 const resumed=app({},a.state());popupDOM(resumed);assert.equal(resumed.state().savedWords.length,1);assert.deepEqual(resumed.state().active,historical);
 resumed.click('tab',{tab:'Profile'});resumed.click('savedWords');assert.match(resumed.el.innerHTML,/tener hambre/);
 const id=resumed.state().savedWords[0].id;resumed.click('savedOpen',{id});assert.equal(evaluate(resumed,'dictionaryUI.isOpen()'),true);
 assert.equal(resumed.ctx.FriendsToAmigos.handleBack(),true);assert.equal(evaluate(resumed,'screen'),'savedWords');assert.equal(resumed.ctx.FriendsToAmigos.handleBack(),true);assert.equal(evaluate(resumed,'tab'),'Profile');
 assert.deepEqual(resumed.state().active,historical);
});

test('Saved Words supports meaning search, Words/Phrases filters, removal and reopening',()=>{
 const a=app();popupDOM(a);open(a);evaluate(a,'dictionaryUI.saveCurrent()');evaluate(a,'dictionaryUI.close()');
 open(a,'móvil','Mi móvil está aquí.');evaluate(a,'dictionaryUI.saveCurrent()');a.click('savedWords');
 assert.match(a.el.innerHTML,/2 saved entries/);assert.match(a.el.innerHTML,/tener hambre/);assert.match(a.el.innerHTML,/móvil/);
 a.click('savedFilter',{filter:'words'});assert.match(a.el.innerHTML,/móvil/);assert.doesNotMatch(a.el.innerHTML,/<h3 lang="es">tener hambre<\/h3>/);
 a.click('savedFilter',{filter:'phrases'});assert.match(a.el.innerHTML,/tener hambre/);assert.doesNotMatch(a.el.innerHTML,/<h3 lang="es">móvil<\/h3>/);
 a.click('savedFilter',{filter:'all'});evaluate(a,'savedQuery="hungry";render()');assert.match(a.el.innerHTML,/tener hambre/);assert.doesNotMatch(a.el.innerHTML,/<h3 lang="es">móvil<\/h3>/);
 evaluate(a,'savedQuery="nothing matches";render()');assert.match(a.el.innerHTML,/No saved words match/);
 evaluate(a,'savedQuery="";render()');const id=a.state().savedWords.find(row=>row.kind==='phrase').id;a.click('savedRemove',{id});assert.equal(a.state().savedWords.length,1);assert.doesNotMatch(a.el.innerHTML,/<h3 lang="es">tener hambre<\/h3>/);
 a.click('savedRemove',{id});assert.equal(a.state().savedWords.length,1);
});

test('dictionary pronunciation and Saved Words pronunciation reuse the es-ES speech path',()=>{
 const utterances=[],a=app({SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak(u){utterances.push(u);}}});
 const dom=popupDOM(a);open(a);evaluate(a,'dictionaryUI.saveCurrent()');dom.popup().listeners.click({target:{closest:()=>({dataset:{dictAction:'pronounce'}})},stopPropagation(){},preventDefault(){}});
 assert.equal(utterances.length,1);assert.equal(utterances[0].lang,'es-ES');assert.match(utterances[0].text,/[Tt](?:engo|ener) hambre/);
 a.click('savedPronounce',{id:a.state().savedWords[0].id});assert.equal(utterances.length,2);assert.equal(utterances[1].lang,'es-ES');
});

test('Saved Words round-trips browser and Android exports while reviews, placement, games and Today stay intact',async()=>{
 let nativeJSON;const legacy=JSON.parse(fs.readFileSync('tests/fixtures/legacy-progress.json','utf8')),a=app({AndroidSpeech:{exportProgress:text=>nativeJSON=text}},legacy);popupDOM(a);open(a);evaluate(a,'dictionaryUI.saveCurrent()');
 const before=learningState(a);a.click('export');const exported=JSON.parse(nativeJSON),target=app();await target.import(exported);
 assert.deepEqual(target.state(),exported);assert.deepEqual(learningState(target),before);assert.equal(target.state().savedWords.length,1);
 const browser=app({},exported);browser.click('export');assert.deepEqual(JSON.parse(await browser.effects.blobs[0].text()),exported);
});

test('read-only protected saves reject dictionary additions/removals without modifying recovery state or raw storage',()=>{
 const original={version:99,name:'Keep original',savedWords:[]},a=app({},original);popupDOM(a);open(a);
 const before=learningState(a),raw=a.storage['friends-to-amigos-v1'];assert.equal(evaluate(a,'dictionaryUI.saveCurrent()'),false);assert.deepEqual(learningState(a),before);
 assert.equal(evaluate(a,'state.savedWords.length'),0);assert.equal(a.storage['friends-to-amigos-v1'],raw);assert.ok(a.effects.toasts.some(t=>/protected|recovery/.test(t.textContent)));
});

test('dictionary is never inferred as an answer grader or hidden-model reveal action',()=>{
 const a=app();a.click('lesson',{id:'u0write'});const before=learningState(a);assert.doesNotMatch(a.el.innerHTML,/data-dictionary[^>]*>Hola, soy Ana/);
 a.click('dictionaryAnswer',{answer:'Hola, soy Ana'});assert.deepEqual(learningState(a),before);assert.equal(a.state().active.answers.length,0);
 const speaking=a.ctx.Curriculum.lessons.find(l=>l.questions.some(q=>q.type==='speaking'));a.click('lesson',{id:speaking.id});evaluate(a,'quiz.index=quiz.questions.findIndex(q=>q.type==="speaking");render()');
 assert.equal(evaluate(a,'quiz.modelRevealed'),false);assert.doesNotMatch(a.el.innerHTML,/<p lang="es" data-dictionary>/);
});

test('dictionary vocabulary additions leave Today orchestration and saved Conjugations rounds untouched',()=>{
 const today=app();popupDOM(today);today.click('begin');today.click('leave');today.click('today');
 const before=learningState(today),steps=evaluate(today,'JSON.stringify(todaySession)');open(today);evaluate(today,'dictionaryUI.saveCurrent()');
 assert.deepEqual(learningState(today),before);assert.equal(evaluate(today,'JSON.stringify(todaySession)'),steps);assert.equal(evaluate(today,'screen'),'quiz');
 const game=app();popupDOM(game);game.click('tab',{tab:'Games'});game.click('gameNew');const gameBefore=learningState(game),round=clone(game.state().games.active);
 open(game);evaluate(game,'dictionaryUI.saveCurrent()');assert.deepEqual(learningState(game),gameBefore);assert.deepEqual(game.state().games.active,round);assert.equal(evaluate(game,'screen'),'game');
});

test('native interruption closes the dictionary and preserves both vocabulary and the current authored snapshot',()=>{
 const a=app();popupDOM(a);a.click('lesson',{id:'u0write'});a.input('Hola, soy Ana');open(a);evaluate(a,'dictionaryUI.saveCurrent()');
 const active=clone(a.state().active),saved=clone(a.state().savedWords);a.lifecycle['fta-pause']();assert.equal(evaluate(a,'dictionaryUI.isOpen()'),false);
 assert.deepEqual(a.state().active,active);assert.deepEqual(a.state().savedWords,saved);a.lifecycle['fta-resume']();
 const resumed=app({},a.state());resumed.click('continue');assert.equal(resumed.current().id,active.questions[0].id);assert.match(resumed.el.innerHTML,/value="Hola, soy Ana"/);assert.deepEqual(resumed.state().savedWords,saved);
});

test('only canonical Spanish feedback and game carrier text receive dictionary boundaries; choices and learner mistakes do not',()=>{
 const a=app();a.click('lesson',{id:'u0write'});a.input('Hola, mi llamo Ana');a.click('check');
 const feedback=[...a.el.innerHTML.matchAll(/<p class="feedback-answer"([^>]*)>([\s\S]*?)<\/p>/g)];assert.equal(feedback.length,2);
 assert.doesNotMatch(feedback[0][1],/data-dictionary/);assert.match(feedback[1][1],/lang="es" data-dictionary/);assert.match(feedback[1][2],/Me|me/);
 a.click('lesson',{id:'u0story0'});a.click('readStory');a.answer(false);a.click('check');assert.doesNotMatch(a.el.innerHTML,/<p class="feedback-answer"[^>]*data-dictionary/);
 a.click('tab',{tab:'Games'});a.click('gameNew');assert.match(a.el.innerHTML,/<h2 class="question" lang="es" data-dictionary>/);
 for(const option of a.el.innerHTML.matchAll(/<button[^>]*data-action="gameAnswer"[^>]*>([\s\S]*?)<\/button>/g))assert.doesNotMatch(option[1],/data-dictionary/);
 const q=evaluate(a,'state.games.active.questions[0]');q.blanks.forEach((blank,i)=>a.click('gameAnswer',{blank:String(i),index:String(blank.options.findIndex(x=>x!==blank.answer))}));a.click('gameCheck');
 assert.match(a.el.innerHTML,/A natural answer: <strong lang="es" data-dictionary>/);
});

test('full vocabulary capacity cannot falsely report a saved word or change lesson progress',()=>{
 const a=app(),dom=popupDOM(a);a.click('lesson',{id:'u0write'});
 evaluate(a,'state.savedWords=Array.from({length:1000},(_,i)=>({id:"lex-capacity-"+i,lemma:"palabra "+i,kind:"word",meaning:"word "+i,savedAt:i}));save()');
 const before=learningState(a),saved=clone(a.state().savedWords);open(a);assert.equal(evaluate(a,'dictionaryUI.saveCurrent()'),false);
 assert.deepEqual(learningState(a),before);assert.deepEqual(a.state().savedWords,saved);assert.doesNotMatch(dom.popup().innerHTML,/aria-pressed="true"/);
 assert.ok(a.effects.toasts.some(t=>/1000|1,000|full|capacity/.test(t.textContent)));
});

test('Saved Words search preserves an active IME composition and applies its committed text with focus and caret intact',()=>{
 // Capture the actual app listeners on a local DOM stub; the established helper
 // keeps its compact API for the existing regression suite.
 const handlers={},node={innerHTML:'',addEventListener:(type,fn)=>handlers[type]=fn,querySelector:()=>null};
 const document={hidden:false,getElementById:id=>id==='app'?node:null,addEventListener(){},createElement:()=>({remove(){}}),body:{append(){}}};
 const a=app({document});a.el=node;a.click=(action,data={})=>handlers.click({target:{closest:()=>({dataset:{action,...data}})}});a.dispatch=(type,event)=>handlers[type](event);
 popupDOM(a);open(a);evaluate(a,'dictionaryUI.saveCurrent();dictionaryUI.close()');open(a,'móvil','Mi móvil está aquí.');evaluate(a,'dictionaryUI.saveCurrent()');a.click('savedWords');
 const learning=learningState(a);let html=a.el.innerHTML,renders=0,focuses=0,selection;
 Object.defineProperty(a.el,'innerHTML',{configurable:true,get:()=>html,set:value=>{html=value;renders++;}});
 const search={focus(){focuses++;},setSelectionRange(...range){selection=range;}};document.getElementById=id=>id==='app'?node:id==='saved-word-search'?search:null;
 const target={id:'saved-word-search',value:'mó',selectionStart:2};a.dispatch('input',{target,isComposing:true});assert.equal(renders,0);assert.equal(focuses,0);assert.equal(evaluate(a,'savedQuery'),'mó');
 target.value='móvi';target.selectionStart=4;a.dispatch('input',{target,isComposing:true});assert.equal(renders,0);
 target.value='móvil';target.selectionStart=5;a.dispatch('compositionend',{target});assert.equal(renders,1);assert.equal(focuses,1);assert.deepEqual(selection,[5,5]);
 assert.match(a.el.innerHTML,/<h3 lang="es">móvil<\/h3>/);assert.doesNotMatch(a.el.innerHTML,/<h3 lang="es">tener hambre<\/h3>/);assert.deepEqual(learningState(a),learning);
});
