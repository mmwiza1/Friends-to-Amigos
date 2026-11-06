(function(root){


  'use strict';

// Explicit injected capabilities; no controller-owned learner progress.

  const dependencies=["E","diagnosticDuration","diagnosticsController","dictionaryUI","document","lastInteraction","lastTick","media","nativePaused","persistQuiz","save","screen","setInterval","state","window"];


  function create(ctx){


    let mounted=false,interval;
    const subscriptions=[];


    function listen(target,type,fn,options){
      target.addEventListener(type,fn,options);
      subscriptions.push(()=>target.removeEventListener?.(type,fn,options));
    }


    function dispose(){
      subscriptions.splice(0).forEach(remove=>remove());
      ctx.window.clearInterval?.(interval);
      mounted=false;
    }


    function tick(){
      const now=Date.now(),elapsed=Math.max(0,Math.min((now-ctx.lastTick)/1000,15));
      ctx.lastTick=now;
      if(['quiz','game','blanks'].includes(ctx.screen)&&!ctx.nativePaused&&!ctx.document.hidden&&now-ctx.lastInteraction<60000){
        const key=ctx.E.dayKey();
        ctx.state.sessions[key]=ctx.state.sessions[key]||{seconds:0,practised:false};
        ctx.state.sessions[key].seconds+=elapsed;
        ctx.diagnosticsController.addDuration(elapsed);
        ctx.save();
      }
    }


    function mount(){
      if(mounted)return;
      mounted=true;


      ['pointerdown','keydown'].forEach(type=>listen(ctx.document,type,()=>ctx.lastInteraction=Date.now()));


      listen(ctx.window,'fta-pause',()=>{
        ctx.dictionaryUI.close();
        tick();
        ctx.diagnosticDuration();
        ctx.nativePaused=true;
        ctx.media.stop();
        ctx.save();
      });


      listen(ctx.window,'fta-resume',()=>{
        ctx.nativePaused=false;
        ctx.lastTick=Date.now();
      });


      interval=ctx.setInterval(tick,10000);


      listen(ctx.document,'visibilitychange',()=>{
        tick();
        ctx.lastTick=Date.now();
        if(ctx.document.hidden){
          ctx.dictionaryUI.close();
          ctx.media.stop();
          ctx.persistQuiz();
        }
      });


      listen(ctx.window,'pagehide',()=>{
        ctx.dictionaryUI.close();
        ctx.media.stop();
        tick();
        ctx.diagnosticDuration();
        ctx.save();
      });


    }


    return {mount,tick,dispose};


  }


  root.LifecycleController={dependencies,create};
  if(typeof module!=='undefined')module.exports=root.LifecycleController;


})(typeof window==='undefined'?globalThis:window);
