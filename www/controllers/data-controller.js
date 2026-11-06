(function(root){
  'use strict';
  // Explicit injected capabilities; no controller-owned learner progress.
  const dependencies=["AndroidSpeech","Blob","C","E","P","Structured","URL","X","confirm","currentQuestion","document","media","quiz","render","save","screen","setTimeout","state","storageContext","tab","toast","todaySession","viewStage","window"];
  function create(ctx){
    const handlers={
      reportAnswer:()=>{
        if(!ctx.quiz?.checked||ctx.storageContext.readOnly)return;
        const q=ctx.currentQuestion(),response=ctx.Structured.active(q)?ctx.Structured.response(q,ctx.quiz.selected):ctx.quiz.selected;
        if(ctx.X.report(ctx.state,ctx.quiz,response)){
          ctx.save();
          ctx.toast('Saved privately on this device. Export answer reports from Profile → Data & backup.');
        }else ctx.toast('This answer report is already saved.');
      },
      exportReports:()=>{
        const json=JSON.stringify({format:'friends-to-amigos-editorial-feedback-v1',reports:ctx.X.sanitizeReports(ctx.state.contentReports)},null,2);
        if(ctx.window.AndroidSpeech?.exportAnswerReports){
          ctx.AndroidSpeech.exportAnswerReports(json);
          return;
        }
        if(ctx.window.AndroidSpeech?.exportProgress){
          ctx.AndroidSpeech.exportProgress(json);
          return;
        }
        const url=ctx.URL.createObjectURL(new ctx.Blob([json],{type:'application/json'})),link=ctx.document.createElement('a');
        link.href=url;
        link.download='friends-to-amigos-answer-reports.json';
        link.click();
        ctx.setTimeout(()=>ctx.URL.revokeObjectURL(url),1000);
      },
      export:()=>{
        if(ctx.storageContext.readOnly&&!ctx.storageContext.raw){
          ctx.toast('The original save cannot be read. Restore storage access before exporting.');
          return;
        }
        const json=ctx.storageContext.readOnly&&ctx.storageContext.raw?ctx.storageContext.raw:JSON.stringify(ctx.state,null,2);
        if(ctx.window.AndroidSpeech?.exportProgress){
          ctx.AndroidSpeech.exportProgress(json);
          return;
        }
        const blob=new ctx.Blob([json],{type:'application/json'}),url=ctx.URL.createObjectURL(blob),link=ctx.document.createElement('a');
        link.href=url;
        link.download='friends-to-amigos-progress.json';
        link.click();
        ctx.setTimeout(()=>ctx.URL.revokeObjectURL(url),1000);
      },
      import:()=>ctx.document.getElementById('importfile').click(),
      reset:()=>{
        if(ctx.confirm('Delete all learning progress on this device? Export a backup first.')){
          ctx.media.stop();
          ctx.state=ctx.E.fresh();
          ctx.storageContext={readOnly:false};
          ctx.quiz=null;
          ctx.todaySession=null;
          ctx.save();
          ctx.screen='main';
          ctx.tab='Home';
        }
      }
    };
    function download(json,filename,method){
      if(ctx.window.AndroidSpeech?.[method]){
        ctx.window.AndroidSpeech[method](json);
        return;
      }
      const url=ctx.URL.createObjectURL(new ctx.Blob([json],{type:'application/json'})),link=ctx.document.createElement('a');
      link.href=url;
      link.download=filename;
      link.click();
      ctx.setTimeout(()=>ctx.URL.revokeObjectURL(url),1000);
    }
    async function importFile(target){
      if(!target.files?.length)return;
      try{
        const result=ctx.P.parse(await target.files[0].text(),ctx.C,{import:true});
        if(ctx.confirm('Replace current progress with this backup?')){
          ctx.media.stop();
          ctx.state=result.state;
          ctx.storageContext={readOnly:false};
          ctx.quiz=null;
          ctx.todaySession=null;
          ctx.viewStage=ctx.C.playableStages.includes(ctx.state.active?.lesson?.stage)?ctx.state.active.lesson.stage:ctx.C.playableStages.includes(ctx.state.stage)?ctx.state.stage:'A1.1';
          ctx.screen='main';
          ctx.save();
          ctx.render();
          if(result.warnings.length)ctx.toast(result.warnings.join(' '));
        }
      }catch(error){
        ctx.toast(error.message+' Your current progress has not changed.');
      }
    }
    return {download,importFile,actions:handlers};
  }
  root.DataTransferController={dependencies,create};
  if(typeof module!=='undefined')module.exports=root.DataTransferController;
})(typeof window==='undefined'?globalThis:window);
