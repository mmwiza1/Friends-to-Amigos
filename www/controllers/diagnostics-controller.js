(function(root){


  'use strict';


  function create({store,getContext,download,notify}){


    let seconds=0;


    function diagnostic(type,details={}){
      return store.record(type,{...getContext(),...details});
    }


    function diagnosticDuration(){
      if(seconds>0){
        diagnostic('session_duration',{duration:Math.floor(seconds)});
        seconds=0;
      }
    }


    function addDuration(elapsed){
      if(store.enabled)seconds+=elapsed;
    }


    const actions={exportDiagnostics:()=>download(store.export()),resetDiagnostics:()=>{
      seconds=0;
      notify(store.reset()?'Local beta diagnostics cleared. Learning progress is unchanged.':'Diagnostics could not be reset because storage is unavailable.');
    },toggleDiagnostics:()=>{
      seconds=0;
      store.toggle();
    }};


    return {diagnostic,diagnosticDuration,addDuration,actions};


  }


  root.DiagnosticsController={create};
  if(typeof module!=='undefined')module.exports=root.DiagnosticsController;


})(typeof window==='undefined'?globalThis:window);
