(function(root){
  'use strict';
  // Retain live accessors. Object spreading here would create stale UI/progress copies.
  function inject(source,names){
    const descriptors={};
    for(const name of names){
      const d=Object.getOwnPropertyDescriptor(source,name);
      if(!d)throw Error('Missing runtime capability: '+name);
      descriptors[name]=d;
    }
    return Object.seal(Object.defineProperties({},descriptors));
  }
  function actions(...groups){
    const out={};
    for(const group of groups)for(const [name,fn] of Object.entries(group)){
      if(Object.hasOwn(out,name))throw Error('Duplicate application action: '+name);
      out[name]=fn;
    }
    return out;
  }
  root.RuntimeContext={inject,actions};
  if(typeof module!=='undefined')module.exports=root.RuntimeContext;
})(typeof window==='undefined'?globalThis:window);
