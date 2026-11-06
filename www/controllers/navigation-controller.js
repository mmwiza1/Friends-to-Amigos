(function(root){
  'use strict';
  // Explicit injected capabilities; no controller-owned learner progress.
  const dependencies=["C","X","actions","dictionaryUI","focusedResult","grammarMicro","lastInteraction","media","quiz","quizReturn","render","reviewFollowup","save","screen","state","tab","todaySession","topicFilter","viewStage"];
  function create(ctx){
    const handlers={
      weakAreas:()=>{
        ctx.quiz=null;
        ctx.screen='weak';
        ctx.tab='Review';
      },
      reviewHome:()=>{
        ctx.screen='main';
        ctx.tab='Review';
      },
      viewStage:el=>{
        if(!ctx.C.playableStages.includes(el.dataset.stage))return;
        ctx.quiz=null;
        ctx.todaySession=null;
        ctx.viewStage=el.dataset.stage;
        ctx.tab='Learn';
        ctx.screen='main';
      },
      tab:el=>{
        if(!['Home','Learn','Games','Review','Profile'].includes(el.dataset.tab))return;
        ctx.quiz=null;
        ctx.todaySession=null;
        ctx.tab=el.dataset.tab;
        if(ctx.tab==='Games'&&!ctx.state.grammarLevel){
          ctx.state.grammarLevel=ctx.X.recommended(ctx.state,ctx.C);
          ctx.save();
        }
        ctx.screen='main';
        ctx.topicFilter=null;
      },
      home:()=>{
        ctx.reviewFollowup='';
        ctx.quiz=null;
        ctx.todaySession=null;
        ctx.tab='Home';
        ctx.screen='main';
      },
      profile:()=>{
        ctx.tab='Profile';
        ctx.screen='main';
      },
      goal:()=>{
        ctx.tab='Learn';
        ctx.screen='main';
      }
    };
    function handleBack(){
      ctx.lastInteraction=Date.now();
      if(ctx.dictionaryUI.back()){
        ctx.media.stop();
        return true;
      }
      if(ctx.screen==='grammarEntry'){
        ctx.media.stop();
        ctx.screen=ctx.grammarMicro?'weak':'grammar';
        ctx.render();
        return true;
      }
      if(ctx.screen==='grammar'){
        ctx.actions.grammarClose();
        ctx.render();
        return true;
      }
      if(ctx.screen==='dictionary'||ctx.screen==='pronunciation'){
        ctx.media.stop();
        ctx.screen='vocabulary';
        ctx.render();
        return true;
      }
      if(['savedWords','content','vocabulary'].includes(ctx.screen)){
        ctx.media.stop();
        ctx.screen='main';
        ctx.tab='Profile';
        ctx.render();
        return true;
      }
      if(['blanks','blanksResult','blanksConfig'].includes(ctx.screen)){
        ctx.actions.blanksLeave();
        ctx.render();
        return true;
      }
      if(ctx.screen==='weak'){
        ctx.actions.reviewHome();
        ctx.render();
        return true;
      }
      if(ctx.screen==='game'||ctx.screen==='gameResult'||ctx.screen==='gameConfig'){
        ctx.actions.gameLeave();
        ctx.render();
        return true;
      }
      if(ctx.screen==='quiz'){
        const destination=ctx.quiz.kind==='lesson'?{tab:ctx.tab,screen:'main'}:ctx.quizReturn;
        ctx.actions.leave();
        ctx.tab=destination.tab;
        ctx.screen=destination.screen==='quiz'?'main':destination.screen;
        ctx.render();
        return true;
      }
      if(ctx.screen==='skillResult'){
        ctx.media.stop();
        ctx.quiz=null;
        ctx.screen='main';
        ctx.tab='Games';
        ctx.render();
        return true;
      }
      if(ctx.screen==='focusedResult'){
        ctx.media.stop();
        ctx.quiz=null;
        ctx.focusedResult=null;
        ctx.screen='main';
        ctx.tab='Home';
        ctx.render();
        return true;
      }
      if(ctx.screen!=='main'){
        const previous=ctx.screen;
        ctx.media.stop();
        ctx.screen='main';
        if(previous==='achievements')ctx.tab='Profile';
        ctx.render();
        return true;
      }
      if(ctx.quiz){
        ctx.quiz=null;
        ctx.todaySession=null;
        ctx.tab='Home';
        ctx.render();
        return true;
      }
      if(ctx.tab!=='Home'){
        ctx.tab='Home';
        ctx.render();
        return true;
      }
      return false;
    }
    return {handleBack,actions:handlers};
  }
  root.NavigationController={dependencies,create};
  if(typeof module!=='undefined')module.exports=root.NavigationController;
})(typeof window==='undefined'?globalThis:window);
