'use strict';
// Runs in the real browser. Baseline CSS is developer evidence, never shipped.
module.exports=async function foundationsChecks({assert,frame,styles}){
 const preserved=state;
 const properties=['width','height','paddingTop','paddingRight','paddingBottom','paddingLeft','fontSize','lineHeight','marginTop','marginBottom'];
 const snapshots=()=>[...document.querySelectorAll('#app h1,#app h2,#app h3,#app .card,#app .primary,#app .choice,#app .tile,#app input,#app nav,#app p,#app small')].slice(0,45).map(el=>{const c=getComputedStyle(el);return {el,values:Object.fromEntries(properties.map(p=>[p,c[p]]))};});
 async function equivalent(label){const before=snapshots(),links=[...document.querySelectorAll('link[rel=stylesheet]')],sheet=document.createElement('style');links.forEach(l=>l.disabled=true);sheet.textContent=styles.join('\n');document.head.append(sheet);await frame();try{const differences=[];for(const row of before){const c=getComputedStyle(row.el);for(const p of properties){const actual=c[p],expected=row.values[p],a=parseFloat(actual),b=parseFloat(expected);if(!(Number.isFinite(a)&&Number.isFinite(b)?Math.abs(a-b)<.7:actual===expected))differences.push(row.el.tagName+'.'+row.el.className+' '+p+': old '+actual+' / new '+expected);}}for(const row of before){const c=getComputedStyle(row.el);for(const p of properties){const actual=c[p],expected=row.values[p],a=parseFloat(actual),b=parseFloat(expected);assert(Number.isFinite(a)&&Number.isFinite(b)?Math.abs(a-b)<.7:actual===expected,label+' v1.8 layout equivalence: '+differences.join('; '));}}}finally{sheet.remove();links.forEach(l=>l.disabled=false);await frame();}}
 state={...E.fresh(),onboarded:true,completed:['u0l0','u0l1','u0l2']};quiz=null;actions.home();render();await frame();await equivalent('Home');
 actions.practiceHub();render();await frame();await equivalent('Practice');
 actions.profile();render();await frame();await equivalent('Profile');
 let dictionaryCalls=0;const original=actions.dictionary;actions.dictionary=el=>{dictionaryCalls++;original(el);};inputController.mount();inputController.mount();document.querySelector('[data-action=dictionary]').click();assert(dictionaryCalls===1,'idempotent input mounting dispatches exactly one action');actions.dictionary=original;
 actions.lesson({dataset:{id:'a12u0l1'}});quiz.index=2;quiz.answers=[true,true];render();await frame();await equivalent('Sentence construction');
 const enabled=[...document.querySelectorAll('.primary:not(:disabled)')];for(const button of enabled){const rgb=s=>(s.match(/[\d.]+/g)||[]).slice(0,3).map(Number),lum=v=>v.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}).reduce((n,x,i)=>n+x*[.2126,.7152,.0722][i],0),c=getComputedStyle(button),a=lum(rgb(c.color)),b=lum(rgb(c.backgroundColor));assert((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,'rendered enabled primary text contrast');}
 state=preserved;quiz=null;actions.home();render();await frame();
};
