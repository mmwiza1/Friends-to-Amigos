'use strict';
module.exports=async function materialChecks({assert,frame}){
 const saved=state;state={...E.fresh(),onboarded:true,completed:['u0l0','u0l1','u0l2']};quiz=null;
 const visible=el=>!!el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
 for(const destination of ['Home','Learn','Games','Review','Profile']){
  actions.tab({dataset:{tab:destination}});render();await frame();
  const buttons=[...document.querySelectorAll('nav button')],names=buttons.map(b=>b.getAttribute('aria-label'));
  assert(names.join('|')==='Home|Learn|Practice|Review|Profile','Material visible destination names/order');
  assert(buttons.filter(b=>b.getAttribute('aria-current')==='page').length===1,'one current navigation destination');
  assert(buttons.find(b=>b.getAttribute('aria-current')==='page').dataset.tab===destination,'current destination matches route');
  for(const b of document.querySelectorAll('button,input:not([type=file]),select,textarea'))if(visible(b)&&!b.matches('.dictionary-word')){
   const r=b.getBoundingClientRect();assert(r.height>=47.5&&r.width>=47.5,'48px control target '+b.className);
   const name=b.getAttribute('aria-label')||b.textContent?.trim()||b.labels?.[0]?.textContent?.trim()||document.getElementById(b.getAttribute('aria-labelledby'))?.textContent?.trim();
   assert(!!name,'interactive control has accessible name: '+b.outerHTML.slice(0,150));
  }
  assert(document.documentElement.scrollWidth<=innerWidth+1,'Material screen has no horizontal overflow');
 }
 const active=document.querySelector('nav button.active span');assert(parseFloat(getComputedStyle(active).height)>=32,'navigation has a sized icon indicator');
 actions.lesson({dataset:{id:'u0l0'}});render();await frame();const oldOutline=document.querySelector('.choice-select');oldOutline?.focus();assert(document.activeElement===oldOutline||!oldOutline,'answer control keyboard focus');
 for(const b of document.querySelectorAll('.primary,.choice-select')){const r=b.getBoundingClientRect();assert(r.height>=48&&r.width>=48,'lesson primary/choice touch target');}
 const word=document.querySelector('[data-dictionary-token]');word?.scrollIntoView({block:'center'});word?.click();await frame();
 const close=document.querySelector('.dictionary-close'),popup=document.querySelector('.dictionary-popup');assert(!!close&&!!popup,'dictionary exposes its dismiss control');
 const cr=close.getBoundingClientRect(),pr=popup.getBoundingClientRect();assert(cr.width>=48&&cr.height>=48,'dictionary close has 48px target');assert(cr.left>=pr.left&&cr.right<=pr.right+1&&cr.top>=pr.top&&cr.bottom<=pr.bottom+1,'dictionary dismiss target stays inside popup');close.click();
 state=saved;quiz=null;actions.home();render();await frame();
};
