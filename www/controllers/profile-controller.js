(function(root){


  'use strict';

// Explicit injected capabilities; no controller-owned learner progress.

  const dependencies=["AndroidSpeech","C","D","LearningQuality","Recommendations","X","activeStage","dictionaryUI","document","filter","grammarEntryId","grammarFocus","grammarMicro","grammarOrigin","media","profileStatsOpen","quiz","render","save","savedFilter","screen","speak","state","storageContext","tab","toast","window"];


  function create(ctx){


    function refreshSavedSearch(target){
      const caret=target.selectionStart;
      ctx.render();
      const input=ctx.document.getElementById('saved-word-search');
      input?.focus();
      if(Number.isInteger(caret))input?.setSelectionRange?.(caret,caret);
    }


    const handlers={
vocabulary:()=>{
      ctx.media.stop();
      ctx.screen='vocabulary';
      ctx.tab='Profile';
      ctx.quiz=null;
    },
dictionary:()=>{
      ctx.media.stop();
      ctx.screen='dictionary';
      ctx.tab='Profile';
      ctx.quiz=null;
    },
dictionaryHear:el=>{
      const e=ctx.D.get(el.dataset.id);
      if(e)ctx.speak(e.lemma);
    },
dictionaryMore:el=>{
      const e=ctx.X.entry(ctx.D,el.dataset.id);
      if(e)ctx.dictionaryUI.open(e,el);
    },
dictionarySave:el=>{
      if(ctx.storageContext.readOnly){
        ctx.toast('Your original progress is protected.');
        return;
      }
      const e=ctx.D.get(el.dataset.id);
      if(!e)return;
      ctx.state.savedWords=ctx.D.isSaved(ctx.state,e.id)?ctx.D.removeSaved(ctx.state.savedWords,e.id):ctx.D.addSaved(ctx.state.savedWords,e);
      ctx.save();
    },
pronunciation:()=>{
      ctx.media.stop();
      ctx.screen='pronunciation';
      ctx.tab='Profile';
      ctx.quiz=null;
    },
pronunciationHear:el=>{
      const row=ctx.X.sounds[Number(el.dataset.index)];
      if(row)ctx.speak(row[2]);
    },
dismissSpanishNotice:()=>{
      if(!ctx.storageContext.readOnly){
        ctx.state.spanishTransitionSeen=true;
        ctx.save();
      }
    },
dismissDictionaryTip:()=>{
      if(!ctx.storageContext.readOnly){
        ctx.state.dictionaryTipSeen=true;
        ctx.save();
      }
    },
grammarReference:()=>{
      ctx.media.stop();
      if(!['grammar','grammarEntry'].includes(ctx.screen))ctx.grammarOrigin={tab:ctx.tab,screen:ctx.screen==='weak'?'weak':'main'};
      ctx.grammarMicro=false;
      ctx.screen='grammar';
    },
grammarClose:()=>{
      ctx.media.stop();
      ctx.tab=ctx.grammarOrigin.tab;
      ctx.screen=ctx.grammarOrigin.screen;
    },
grammarEntry:el=>{
      if(ctx.LearningQuality.reference(el.dataset.id,ctx.C)){
        ctx.grammarEntryId=el.dataset.id;
        ctx.grammarMicro=false;
        ctx.grammarFocus='';
        ctx.screen='grammarEntry';
        ctx.media.stop();
      }
    },
refresher:el=>{
      const entry=ctx.LearningQuality.resolve(el.dataset.key,ctx.C,ctx.state);
      if(entry){
        ctx.grammarEntryId=entry.id;
        ctx.grammarMicro=true;
        ctx.grammarFocus=el.dataset.key;
        ctx.screen='grammarEntry';
        ctx.media.stop();
      }
    },
content:()=>{
      ctx.media.stop();
      ctx.quiz=null;
      ctx.tab='Profile';
      ctx.screen='content';
    },
externalContent:el=>{
      const item=ctx.Recommendations.catalogue.find(r=>r.id===el.dataset.id);
      if(!item||!ctx.Recommendations.forStage(ctx.activeStage()).some(r=>r.id===item.id)||!ctx.Recommendations.safeURL(item.url))return;
      ctx.media.stop();
      if(ctx.window.AndroidSpeech?.openExternal)ctx.AndroidSpeech.openExternal(item.url);else ctx.window.open?.(item.url,'_blank','noopener,noreferrer');
    },
savedWords:()=>{
      ctx.screen='savedWords';
      ctx.tab='Profile';
      ctx.quiz=null;
    },
savedFilter:el=>{
      if(['all','words','phrases','recent'].includes(el.dataset.filter))ctx.savedFilter=el.dataset.filter;
    },
savedOpen:el=>ctx.dictionaryUI.openSaved(el.dataset.id,el),
savedPronounce:el=>ctx.dictionaryUI.pronounceSaved(el.dataset.id),
savedRemove:el=>ctx.dictionaryUI.removeSaved(el.dataset.id),
achievements:()=>{
      ctx.screen='achievements';
    },
filter:el=>{
      if(['week','month','all'].includes(el.dataset.filter)){
        ctx.filter=el.dataset.filter;
        ctx.profileStatsOpen=true;
      }
    }
};


    return {refreshSavedSearch,actions:handlers};


  }


  root.ProfileController={dependencies,create};
  if(typeof module!=='undefined')module.exports=root.ProfileController;


})(typeof window==='undefined'?globalThis:window);
