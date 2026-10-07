const vm=require('node:vm'),fs=require('node:fs');
function app(extra={},initial=null){
 const handlers={},lifecycle={},storage=initial?{'friends-to-amigos-v1':JSON.stringify(initial)}:{},effects={blobs:[],links:[],toasts:[],focused:[]};
 const el={innerHTML:'',addEventListener:(type,fn)=>handlers[type]=fn,querySelector:selector=>{const match=selector.match(/^\[data-action="answer"\]\[data-index="(\d+)"\]$/);return match?{focus(){effects.focused.push(match[1]);}}:null;}};
 const nodes={app:el,stage:{value:'A2.2'},'check-answer':{disabled:true},importfile:{click(){}}};
 const ctx={console,Date,JSON,Math,String,Number,Object,Array,Set,Map,Blob,
  // Simulated installed voice. Individual failure tests override this explicitly.
  SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:true}],cancel(){},speak(u){u.onstart?.();}},
  URL:{createObjectURL(blob){effects.blobs.push(blob);return 'blob:backup';},revokeObjectURL(){}},
  setInterval:()=>{},setTimeout:()=>{},confirm:()=>true,
  localStorage:{getItem:k=>storage[k]||null,setItem:(k,v)=>storage[k]=v},
  document:{hidden:false,getElementById:id=>nodes[id]||null,addEventListener:()=>{},createElement:tag=>({className:'',textContent:'',remove(){},click(){effects.links.push(this);}}),body:{append(el){effects.toasts.push(el);}}}
 };
 Object.assign(ctx,extra);
 // The current Android wrapper acknowledges actual TTS start by request ID.
 if(ctx.AndroidSpeech?.speak&&!ctx.AndroidSpeech.listen){ctx.AndroidSpeech={...ctx.AndroidSpeech,isReady:ctx.AndroidSpeech.isReady||(()=>true),listen(text,rate,id){this.speak(text);ctx.FriendsToAmigosSpeechResult(id,true);}};}
 ctx.window=ctx;ctx.globalThis=ctx;ctx.addEventListener=(name,fn)=>lifecycle[name]=fn;vm.createContext(ctx);
 for(const f of [...fs.readFileSync('www/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]))vm.runInContext(fs.readFileSync('www/'+f,'utf8'),ctx);
 const api={el,ctx,effects,nodes,storage,lifecycle,click:(action,data={})=>handlers.click({target:{closest:()=>({dataset:{action,...data}})}}),
  change:target=>handlers.change({target}),
  input:value=>handlers.input({target:{id:'written-answer',value}}),
  key:(key,details={})=>{let prevented=false;handlers.keydown({key,target:{id:'written-answer',value:''},preventDefault(){prevented=true;},...details});return prevented;},
  current:()=>vm.runInContext('quiz?.questions[quiz.index]',ctx),
  state:()=>JSON.parse(storage['friends-to-amigos-v1']),
  import:async data=>handlers.change({target:{id:'importfile',files:[{text:async()=>typeof data==='string'?data:JSON.stringify(data)}]}})
 };
 api.answer=(correct=true)=>{const q=api.current();if(q.listening)api.click('listen');if(q.type==='speaking'){api.click('revealModel');api.click('selfAssess',{result:correct?'got':'needs'});return;}if(q.type==='text')api.input(correct?q.accepted[0]:'incorrect response');else api.click('answer',{index:String(q.options.findIndex(x=>correct?x===q.answer:x!==q.answer))});};
 return api;
}

module.exports=app;
