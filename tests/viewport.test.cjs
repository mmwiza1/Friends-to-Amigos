const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const Viewport=require('../www/viewport');

function harness({height=850,navHeight=92,visualHeight=850}={}){
 const properties=new Map(),classes=new Set(),documentEvents={},windowEvents={},visualEvents={},queue=[];
 const doc={activeElement:null,documentElement:{style:{setProperty:(key,value)=>properties.set(key,value)},classList:{add:value=>classes.add(value),toggle:(value,on)=>on?classes.add(value):classes.delete(value)}},
  addEventListener:(type,callback)=>documentEvents[type]=callback,querySelector:()=>nav};
 const nav={height:navHeight,getBoundingClientRect(){return {height:this.height};}};
 const visualViewport={height:visualHeight,offsetTop:0,addEventListener:(type,callback)=>visualEvents[type]=callback};
 const env={document:doc,innerHeight:height,visualViewport,addEventListener:(type,callback)=>windowEvents[type]=callback,
  setTimeout:callback=>queue.push(callback),requestAnimationFrame:callback=>queue.push(callback)};
 const api=Viewport.create(env);
 const input=(tag='input',type='text')=>({tag,type,scrolls:[],matches:selector=>selector==='input:not([type=file]),textarea,select'&&(['textarea','select'].includes(tag)||tag==='input'&&type!=='file'),scrollIntoView(options){this.scrolls.push(options);}});
 return {env,doc,api,nav,properties,classes,input,flush(){while(queue.length)queue.shift()();},
  focus(element){doc.activeElement=element;documentEvents.focusin({target:element});},
  blur(){doc.activeElement=null;documentEvents.focusout({});},
  resize(){windowEvents.resize();},visualResize(){visualEvents.resize();},visualScroll(){visualEvents.scroll();}};
}

test('native safe areas remain CSS-pixel values with one source of layout padding',()=>{
 const h=harness();h.env.FriendsToAmigosInsets(26.5,24,12,8,false);
 assert.ok(h.classes.has('android-insets'));
 for(const [side,value] of Object.entries({top:26.5,bottom:24,left:12,right:8}))assert.equal(h.properties.get('--android-inset-'+side),value+'px');
 const java=fs.readFileSync('android/app/src/main/java/com/friendstoamigos/app/MainActivity.java','utf8'),manifest=fs.readFileSync('android/app/src/main/AndroidManifest.xml','utf8'),css=fs.readFileSync('www/style.css','utf8');
 assert.doesNotMatch(java,/\.setPadding\(/);assert.match(java,/FriendsToAmigosInsets/);assert.match(java,/setDecorFitsSystemWindows\(false\)/);assert.match(java,/WindowInsets.Type.displayCutout/);
 assert.match(manifest,/windowSoftInputMode="adjustResize"/);
 assert.match(css,/:root\.android-insets\{[^}]*--safe-top:var\(--android-inset-top/);
 assert.match(css,/nav\{bottom:var\(--safe-bottom\)/);
 assert.match(css,/\.toast\{top:calc\(12px \+ var\(--safe-top\)\)/);
});

test('native keyboard overlap hides app navigation and closing it restores the measured layout',()=>{
 const h=harness(),input=h.input();h.doc.activeElement=input;
 h.env.FriendsToAmigosInsets(26,24,0,0,true,180);h.flush();
 assert.ok(h.classes.has('keyboard-open'));assert.equal(h.properties.get('--app-nav-height'),'0px');assert.equal(h.properties.get('--android-keyboard-overlap'),'180px');
 assert.equal(input.scrolls.length,1);assert.equal(h.doc.activeElement,input);
 h.doc.activeElement=null;h.env.FriendsToAmigosInsets(26,24,0,0,false);
 assert.equal(h.classes.has('keyboard-open'),false);assert.equal(h.properties.get('--app-nav-height'),'92px');assert.equal(h.properties.get('--android-keyboard-overlap'),'0px');
});

test('text focus scrolls the existing field without stealing focus or opening file-input layout mode',()=>{
 const h=harness(),input=h.input();h.focus(input);h.flush();
 assert.ok(h.classes.has('keyboard-open'));assert.equal(h.doc.activeElement,input);assert.deepEqual(input.scrolls,[{block:'center',inline:'nearest',behavior:'auto'}]);
 h.blur();h.flush();h.focus(h.input('input','file'));h.flush();
 assert.equal(h.classes.has('keyboard-open'),false);
 for(const tag of ['textarea','select']){const field=h.input(tag);h.focus(field);h.flush();assert.equal(field.scrolls.length,1);h.blur();h.flush();}
});

test('deferred focusout keeps navigation hidden when focus moves to another input',()=>{
 const h=harness(),first=h.input(),second=h.input();h.focus(first);h.blur();h.doc.activeElement=second;h.flush();
 assert.ok(h.classes.has('keyboard-open'));assert.equal(h.properties.get('--app-nav-height'),'0px');
 h.blur();h.flush();assert.equal(h.classes.has('keyboard-open'),false);assert.equal(h.properties.get('--app-nav-height'),'92px');
});

test('overlay browser keyboards reserve visual-viewport overlap and restore layout after blur',()=>{
 const h=harness({height:850,visualHeight:400}),input=h.input();h.env.visualViewport.offsetTop=10;h.focus(input);h.flush();
 assert.ok(h.classes.has('keyboard-open'));assert.equal(h.properties.get('--android-keyboard-overlap'),'440px');
 h.env.visualViewport.height=850;h.env.visualViewport.offsetTop=0;h.visualResize();h.blur();h.flush();
 assert.equal(h.classes.has('keyboard-open'),false);assert.equal(h.properties.get('--android-keyboard-overlap'),'0px');assert.equal(h.properties.get('--app-nav-height'),'92px');
});

test('native geometry remains authoritative despite a shrunken browser visual viewport',()=>{
 const h=harness({height:850,visualHeight:350}),input=h.input();h.focus(input);h.env.FriendsToAmigosInsets(24,16,0,0,true,0);h.flush();
 assert.equal(h.properties.get('--android-keyboard-overlap'),'0px');
 h.blur();h.flush();h.env.FriendsToAmigosInsets(24,16,0,0,false,0);h.visualResize();
 assert.equal(h.classes.has('keyboard-open'),false);assert.equal(h.properties.get('--app-nav-height'),'92px');assert.equal(h.properties.get('--android-keyboard-overlap'),'0px');
});

test('navigation height follows layout changes and resize keeps focused inputs scrollable',()=>{
 const h=harness();assert.equal(h.properties.get('--app-nav-height'),'92px');h.nav.height=121;h.resize();assert.equal(h.properties.get('--app-nav-height'),'121px');
 const input=h.input();h.focus(input);h.flush();const before=input.scrolls.length;h.resize();h.visualResize();h.flush();
 assert.equal(input.scrolls.length,before+2);assert.equal(h.doc.activeElement,input);
 h.blur();h.flush();h.visualScroll();assert.equal(h.properties.get('--app-nav-height'),'121px');
 const css=fs.readFileSync('www/style.css','utf8');assert.match(css,/24px \+ var\(--app-nav-height\) \+ var\(--safe-bottom\) \+ var\(--android-keyboard-overlap\)/);
});

test('malformed inset values are bounded finite CSS lengths',()=>{
 const h=harness();h.env.FriendsToAmigosInsets(-20,Infinity,'unknown',4000,true,NaN);
 assert.equal(h.properties.get('--android-inset-top'),'0px');assert.equal(h.properties.get('--android-inset-bottom'),'2000px');assert.equal(h.properties.get('--android-inset-left'),'0px');assert.equal(h.properties.get('--android-inset-right'),'2000px');assert.equal(h.properties.get('--android-keyboard-overlap'),'0px');
 h.env.FriendsToAmigosInsets(undefined,null,{},-Infinity,1,-25);assert.equal(h.classes.has('keyboard-open'),false);
 for(const side of ['top','bottom','left','right'])assert.equal(h.properties.get('--android-inset-'+side),'0px');
});

test('viewport service can be loaded without a document',()=>{
 const api=Viewport.create({});assert.doesNotThrow(()=>api.refresh());assert.doesNotThrow(()=>api.ensureInputVisible());
});

test('quiz rerender without focusout and disabled fields cannot leave navigation hidden',()=>{
 const h=harness(),input=h.input();h.focus(input);h.flush();assert.ok(h.classes.has('keyboard-open'));
 h.doc.activeElement=null;h.api.refresh();assert.equal(h.classes.has('keyboard-open'),false);assert.equal(h.properties.get('--app-nav-height'),'92px');
 h.doc.activeElement=input;input.isConnected=false;h.api.refresh();assert.equal(h.classes.has('keyboard-open'),false);
 input.isConnected=true;input.disabled=true;const before=input.scrolls.length;h.api.refresh();h.api.ensureInputVisible();h.resize();h.flush();
 assert.equal(h.classes.has('keyboard-open'),false);assert.equal(input.scrolls.length,before);assert.equal(h.properties.get('--app-nav-height'),'92px');
});
