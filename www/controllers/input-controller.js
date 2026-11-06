(function(root){


  'use strict';

// Explicit injected capabilities; no controller-owned learner progress.

  const dependencies=["actions","answerAllowed","app","currentQuestion","dataController","diagnostic","diagnosticDuration","dictionaryDirection","dictionaryQuery","document","lastInteraction","media","persistQuiz","profileStatsOpen","quiz","refreshSavedSearch","render","save","savedQuery","screen","state"];


  function create(ctx){


    let mounted=false;
    const subscriptions=[];


    function listen(target,type,fn,options){
      target.addEventListener(type,fn,options);
      subscriptions.push(()=>target.removeEventListener?.(type,fn,options));
    }


    function dispose(){
      subscriptions.splice(0).forEach(remove=>remove());
      mounted=false;
    }


    function mount(){
      if(mounted)return;
      mounted=true;


      listen(ctx.app,'click',event=>{
        ctx.lastInteraction=Date.now();
        const el=event.target.closest('[data-action]');
        if(!el||!Object.prototype.hasOwnProperty.call(ctx.actions,el.dataset.action))return;
        if(['viewStage','tab','home','profile'].includes(el.dataset.action))ctx.media.stop();
        if(['englishHint','spanishHelp','qualitySupport'].includes(el.dataset.action)&&ctx.answerAllowed())ctx.diagnostic('support_used',{mode:ctx.quiz.kind,support:el.dataset.action==='englishHint'?'english':'spanish'});
        if(['home','tab','practiceHub','profile'].includes(el.dataset.action)&&ctx.screen==='quiz'&&ctx.quiz.index<ctx.quiz.questions.length){
          ctx.diagnosticDuration();
          ctx.diagnostic('activity_left',{mode:ctx.quiz.kind,completed:false});
        }
        ctx.actions[el.dataset.action](el);
        if(el.dataset.action==='answer'&&ctx.quiz?.kind==='skill'&&ctx.quiz.skillKind==='rapid'&&ctx.answerAllowed()&&ctx.quiz.selected!==null)ctx.actions.check();
        if(['savedOpen','savedPronounce','dictionaryMore','dictionaryHear','pronunciationHear'].includes(el.dataset.action))return;
        ctx.render();
        if(el.dataset.action==='clozePick')ctx.app.querySelector?.(`[data-action=clozePick][data-blank="${el.dataset.blank}"][data-index="${el.dataset.index}"]`)?.focus();else if(['tileAdd','tileRemove','structuredReset'].includes(el.dataset.action))ctx.app.querySelector?.('[data-action=tileAdd]:not([disabled])')?.focus();
        if(el.dataset.action==='gameAnswer')ctx.app.querySelector?.(`[data-action="gameAnswer"][data-blank="${el.dataset.blank}"][data-index="${el.dataset.index}"]`)?.focus();
        if(el.dataset.action==='answer')ctx.app.querySelector?.(`[data-action="answer"][data-index="${el.dataset.index}"][role="radio"]`)?.focus();
      });


      listen(ctx.app,'keydown',event=>{


        if(event.target.closest?.('[data-dictionary-token]'))return;


        if(ctx.screen==='blanks'&&event.target.classList?.contains('table-input')&&(event.key==='Enter'||event.keyCode===13)){
          if(event.isComposing||event.keyCode===229||event.repeat)return;
          event.preventDefault();
          if(!String(event.target.value).trim())return;
          const a=ctx.state.blanks?.active,i=Number(event.target.dataset.cell);
          if(a&&!a.checked&&Number.isInteger(i)&&i>=0&&i<a.selected.length){
            a.selected[i]=event.target.value.slice(0,100);
            ctx.save();
            if(a.selected.some(x=>!x?.trim())){
              const next=a.selected.findIndex((x,j)=>j>i&&!x?.trim());
              if(next>=0)ctx.document.getElementById('form-'+next)?.focus();
              return;
            }
            ctx.actions.blanksCheck();
            ctx.render();
          }
          return;
        }


        if(event.target.id==='written-answer'&&(event.key==='Enter'||event.keyCode===13)){


          if(event.isComposing||event.keyCode===229||event.repeat)return;


          if(ctx.currentQuestion()?.writing?.multiline)return;


          event.preventDefault();


          if(!ctx.answerAllowed()||ctx.currentQuestion()?.type!=='text')return;


          if(!String(event.target.value).trim())return;


          ctx.quiz.selected=event.target.value;


          ctx.actions.check();
          ctx.render();
          return;


        }


        const gameOption=event.target.closest?.('[data-action="gameAnswer"]');


        if(gameOption&&ctx.screen==='game'&&!ctx.state.games?.active?.checked){


          const keys=['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'];
          if(!keys.includes(event.key))return;


          event.preventDefault();
          const blank=Number(gameOption.dataset.blank),options=ctx.state.games.active.questions[ctx.state.games.active.index].blanks[blank]?.options;
          if(!options)return;


          const old=Number(gameOption.dataset.index),index=event.key==='Home'?0:event.key==='End'?options.length-1:(old+(['ArrowUp','ArrowLeft'].includes(event.key)?-1:1)+options.length)%options.length;


          ctx.actions.gameAnswer({dataset:{blank:String(blank),index:String(index)}});
          ctx.render();
          ctx.app.querySelector?.(`[data-action="gameAnswer"][data-blank="${blank}"][data-index="${index}"]`)?.focus();
          return;


        }


        const option=event.target.closest?.('[data-action="answer"]');


        if(!option||!ctx.answerAllowed()||!ctx.currentQuestion()?.options)return;


        const keys=['ArrowDown','ArrowRight','ArrowUp','ArrowLeft','Home','End'];
        if(!keys.includes(event.key))return;


        event.preventDefault();
        const count=ctx.currentQuestion().options.length,old=Number(option.dataset.index);


        const index=event.key==='Home'?0:event.key==='End'?count-1:(old+(['ArrowUp','ArrowLeft'].includes(event.key)?-1:1)+count)%count;


        ctx.actions.answer({dataset:{index:String(index)}});
        ctx.render();
        ctx.app.querySelector?.(`[data-action="answer"][data-index="${index}"][role="radio"]`)?.focus();


      });


      listen(ctx.app,'compositionend',event=>{
        if(event.target.id==='dictionary-search'){
          ctx.dictionaryQuery=event.target.value.slice(0,120);
          ctx.render();
          ctx.document.getElementById('dictionary-search')?.focus();
          return;
        }
        if(event.target.id==='saved-word-search'){
          ctx.savedQuery=event.target.value.slice(0,120);
          ctx.refreshSavedSearch(event.target);
        }
      });


      listen(ctx.app,'input',event=>{


        if(event.target.id==='dictionary-search'){
          ctx.dictionaryQuery=event.target.value.slice(0,120);
          if(!event.isComposing){
            const caret=event.target.selectionStart;
            ctx.render();
            const input=ctx.document.getElementById('dictionary-search');
            input?.focus();
            input?.setSelectionRange?.(caret,caret);
          }
          return;
        }
        if(event.target.id==='saved-word-search'){
          ctx.savedQuery=event.target.value.slice(0,120);
          if(!event.isComposing)ctx.refreshSavedSearch(event.target);
          return;
        }


        if(ctx.screen==='blanks'&&event.target.dataset?.cell!==undefined){
          const a=ctx.state.blanks?.active,i=Number(event.target.dataset.cell);
          if(a&&!a.checked&&i>=0&&i<a.selected.length){
            a.selected[i]=event.target.value.slice(0,100);
            ctx.save();
            const check=ctx.app.querySelector?.('[data-action="blanksCheck"]');
            if(check)check.disabled=a.selected.some(x=>!x?.trim());
          }
          return;
        }


        if(event.target.id!=='written-answer'||!ctx.answerAllowed()||ctx.currentQuestion().type!=='text')return;


        ctx.lastInteraction=Date.now();
        ctx.quiz.selected=event.target.value;
        ctx.persistQuiz();


        const check=ctx.document.getElementById('check-answer');
        if(check)check.disabled=!ctx.quiz.selected.trim();


      });


      listen(ctx.app,'change',async event=>{
        if(event.target.id==='dictionary-direction'){
          ctx.dictionaryDirection=event.target.value==='en-es'?'en-es':'es-en';
          ctx.render();
          return;
        }


        if(ctx.screen==='blanks'&&event.target.dataset?.cell!==undefined){
          const a=ctx.state.blanks?.active,i=Number(event.target.dataset.cell),t=a?.tables[a.index];
          if(a&&!a.checked&&a.entry==='choice'&&Number.isInteger(i)&&t.options[i]?.includes(event.target.value)){
            a.selected[i]=event.target.value;
            ctx.save();
            ctx.render();
            ctx.document.getElementById('form-'+i)?.focus();
          }
          return;
        }


        if(event.target.id==='name'){
          ctx.state.name=event.target.value.slice(0,40);
          ctx.save();
        }


        if(event.target.id==='importfile'){
          await ctx.dataController.importFile(event.target);


        }


      });


      listen(ctx.app,'toggle',event=>{
        if(event.target.id==='profile-period-stats')ctx.profileStatsOpen=event.target.open===true;
        if(ctx.screen==='blanks'&&event.target.open&&event.target.tagName==='DETAILS'){
          ctx.actions.blanksGuide();
        }
      },true);


    }


    return {mount,dispose};


  }


  root.InputController={dependencies,create};
  if(typeof module!=='undefined')module.exports=root.InputController;


})(typeof window==='undefined'?globalThis:window);
