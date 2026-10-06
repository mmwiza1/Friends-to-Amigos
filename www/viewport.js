(function(root){
'use strict';
function create(env){
 const doc=env.document,html=doc?.documentElement;
 if(!html)return {refresh(){},ensureInputVisible(){}};
 let native=false,keyboard=false,overlap=0,focused=false;
 const pixel=value=>Math.max(0,Math.min(2000,Number(value)||0));
 function ensureInputVisible(){
  const input=doc.activeElement;
  if(!input||input.disabled||!input.matches?.('input:not([type=file]),textarea,select'))return;
  // Layout changes must not replace the focused input or steal its focus.
  (env.requestAnimationFrame||env.setTimeout).call(env,()=>{
   if(doc.activeElement!==input||input.disabled||input.isConnected===false)return;
   input.scrollIntoView?.({block:'center',inline:'nearest',behavior:'auto'});
   const visual=env.visualViewport,rect=input.getBoundingClientRect?.();
   if(!rect)return;
   const bottom=native?env.innerHeight-overlap:visual?visual.height+visual.offsetTop:env.innerHeight;
   // Some WebViews keep a full-height layout viewport behind an overlay IME.
   if(rect.bottom>bottom-24)env.scrollBy?.(0,rect.bottom-bottom+24);
  });
 }
 function refresh(){
  // Replacing a quiz input may remove focus without firing focusout.
  focused=Boolean(doc.activeElement&&!doc.activeElement.disabled&&doc.activeElement.isConnected!==false&&doc.activeElement.matches?.('input:not([type=file]),textarea,select'));
  const visual=env.visualViewport;
  const browserOverlap=!native&&focused&&visual?Math.max(0,env.innerHeight-visual.height-visual.offsetTop):0;
  const browserKeyboard=browserOverlap>120;
  const open=keyboard||browserKeyboard||focused;
  html.classList.toggle('keyboard-open',Boolean(open));
  html.style.setProperty('--android-keyboard-overlap',(native?overlap:browserKeyboard?browserOverlap:0)+'px');
  const nav=doc.querySelector('nav[aria-label="Main navigation"]');
  html.style.setProperty('--app-nav-height',!open&&nav?nav.getBoundingClientRect().height+'px':'0px');
 }
 env.FriendsToAmigosInsets=(top,bottom,left,right,keyboardOpen,keyboardOverlap=0)=>{
  native=true;keyboard=keyboardOpen===true;overlap=pixel(keyboardOverlap);
  html.classList.add('android-insets');
  for(const [side,value] of Object.entries({top,bottom,left,right}))html.style.setProperty('--android-inset-'+side,pixel(value)+'px');
  refresh();if(keyboard)ensureInputVisible();
 };
 doc.addEventListener('focusin',event=>{
  if(!event.target.matches?.('input:not([type=file]),textarea,select'))return;
  focused=true;refresh();ensureInputVisible();
 });
 doc.addEventListener('focusout',()=>{
  // Defer until a possible replacement input has received focus.
  env.setTimeout(()=>{focused=Boolean(doc.activeElement?.matches?.('input:not([type=file]),textarea,select'));refresh();},0);
 });
 env.addEventListener('resize',()=>{refresh();ensureInputVisible();});
 visualEvents(env.visualViewport);
 function visualEvents(view){view?.addEventListener('resize',()=>{refresh();ensureInputVisible();});view?.addEventListener('scroll',refresh);}
 refresh();return {refresh,ensureInputVisible};
}
root.ViewportTools={create};if(typeof module!=='undefined')module.exports=root.ViewportTools;
})(typeof window==='undefined'?globalThis:window);
