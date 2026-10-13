'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const V=require('../www/viewport');
function fixture(height){
 const properties={},classes=new Set(),queue=[],events={},visualEvents={};let scroll=0;
 const field={disabled:false,isConnected:true,matches:()=>true,scrollIntoView(){},getBoundingClientRect:()=>({bottom:height-20})};
 const doc={activeElement:field,documentElement:{style:{setProperty:(key,value)=>properties[key]=value},classList:{add:value=>classes.add(value),toggle:(value,on)=>on?classes.add(value):classes.delete(value)}},addEventListener:(name,fn)=>events[name]=fn,querySelector:()=>({getBoundingClientRect:()=>({height:104})})};
 const env={document:doc,innerHeight:height,visualViewport:{height,offsetTop:0,addEventListener:(name,fn)=>visualEvents[name]=fn},requestAnimationFrame:fn=>queue.push(fn),setTimeout:fn=>queue.push(fn),addEventListener(){},scrollBy:(x,y)=>scroll+=y};
 const api=V.create(env);return {env,doc,field,properties,classes,api,flush(){while(queue.length)queue.shift()();},get scroll(){return scroll;}};
}
for(const profile of [
 {name:'S22-class portrait three-button',height:780,top:28,bottom:48,left:0,right:4,ime:300},
 {name:'S24-class portrait gesture',height:800,top:28,bottom:24,left:0,right:0,ime:310},
 {name:'S25-class portrait cutout',height:800,top:36,bottom:24,left:8,right:8,ime:310},
 {name:'S25-class landscape cutout',height:360,top:20,bottom:24,left:34,right:16,ime:140}
])test(profile.name+' preserves native geometry and focused input across keyboard open/close',()=>{
 const h=fixture(profile.height);h.env.FriendsToAmigosInsets(profile.top,profile.bottom,profile.left,profile.right,false,0);
 for(const side of ['top','bottom','left','right'])assert.equal(h.properties['--android-inset-'+side],profile[side]+'px');
 h.env.FriendsToAmigosInsets(profile.top,profile.bottom,profile.left,profile.right,true,profile.ime);h.flush();assert.ok(h.classes.has('keyboard-open'));assert.equal(h.properties['--app-nav-height'],'0px');assert.equal(h.doc.activeElement,h.field);assert.equal(h.scroll,profile.ime+4);
 h.env.FriendsToAmigosInsets(profile.top,profile.bottom,profile.left,profile.right,false,0);assert.ok(!h.classes.has('keyboard-open'));assert.equal(h.properties['--app-nav-height'],'104px');assert.equal(h.properties['--android-keyboard-overlap'],'0px');assert.equal(h.doc.activeElement,h.field);
});
test('resized native viewport does not reserve an additional overlay keyboard height',()=>{
 const h=fixture(470);h.env.FriendsToAmigosInsets(28,24,0,0,true,0);h.flush();assert.equal(h.properties['--android-keyboard-overlap'],'0px');assert.equal(h.scroll,4);assert.ok(h.classes.has('keyboard-open'));
});
test('choice wrapping and selection targets retain fixed touch size with flexible Spanish text',()=>{
 const css=fs.readFileSync('www/style.css','utf8');assert.match(css,/\.choice-select\{[^}]*width:44px[^}]*min-width:44px[^}]*min-height:44px/);assert.match(css,/\.option-text\{[^}]*min-width:0[^}]*overflow-wrap:break-word/);assert.match(css,/\.question\{font-size:1\.5625rem/);assert.match(css,/\.story p\{font-size:1\.25rem/);assert.doesNotMatch(css,/Galaxy|Samsung|S22|S24|S25/);
});
test('dictionary large-text and keyboard behaviour retain a scrollable compact overlay',()=>{
 const css=fs.readFileSync('www/dictionary.css','utf8');assert.match(css,/\.dictionary-popup\{[^}]*overflow:auto/);assert.match(css,/\.dictionary-popup\{font-size:\.9375rem/);assert.match(css,/\.dictionary-actions button\{[^}]*min-height:44px/);
 const source=fs.readFileSync('www/dictionary-ui.js','utf8');assert.match(source,/--android-keyboard-overlap/);assert.match(source,/visualViewport/);assert.match(source,/maxHeight=availableHeight/);
});
test('rendered profiles vary usable geometry without changing permanent five-tab navigation',()=>{
 const source=fs.readFileSync('scripts/browser-check.cjs','utf8');for(const name of ['galaxy-s22-light-three-button','galaxy-s24-dark-gesture-overlay-ime','galaxy-s25-dark-large-text-cutout','galaxy-s25-light-landscape-cutout'])assert.ok(source.includes(name));assert.match(source,/Home\|Learn\|Games\|Review\|Profile/);assert.match(source,/simulatedKeyboard:Boolean\(config.keyboard\)/);
});
test('screenshot setup isolates lexical declarations across repeated DevTools evaluations',()=>{
 const source=fs.readFileSync('scripts/browser-check.cjs','utf8');assert.ok(source.includes("async function fixture(session,statements){return evaluate(session,'(()=>{'+statements+'})()');}"));assert.doesNotMatch(source,/^\s*if\(view===.*await evaluate\(sessionId,/m);
 const vm=require('node:vm'),context=vm.createContext({result:0});for(let n=0;n<3;n++)vm.runInContext('(()=>{const l=1,word="hola";result+=l+word.length;})()',context);assert.equal(context.result,15);
});
