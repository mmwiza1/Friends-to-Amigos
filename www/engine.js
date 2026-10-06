(function(root){
const dayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const previousDay=(key)=>{const [y,m,d]=key.split('-').map(Number);return dayKey(new Date(y,m-1,d-1));};
function fresh(){return {version:1,name:'',onboarded:false,stage:'A1.1',placement:null,completed:[],capabilities:[],reviews:{},events:[],sessions:{},active:null};}
function recordAnswer(s,q,correct,now=Date.now()) {const key=q.prompt;const r=s.reviews[key];s.events.push({date:dayKey(new Date(now)),at:now,type:'answer',correct,topic:q.topic});if(!correct){s.reviews[key]={question:q,topic:q.topic,wrong:(r?.wrong||0)+1,success:0,due:now,corrected:false};}else if(r){const eligible=now>=r.due;if(eligible){r.success++;r.due=now+[1,3,7,14,30][Math.min(r.success-1,4)]*86400000;if(r.success>=3&&!r.corrected){r.corrected=true;s.events.push({date:dayKey(new Date(now)),at:now,type:'corrected',topic:q.topic});}}}}
function complete(s,lesson,score,count){if(score/count>=.8){if(!s.completed.includes(lesson.id)){s.completed.push(lesson.id);s.events.push({date:dayKey(),at:Date.now(),type:'lesson',id:lesson.id});}if(lesson.checkpoint&&!s.capabilities.some(c=>c.id===lesson.id)){s.capabilities.push({id:lesson.id,text:lesson.capability,date:dayKey()});}}markDay(s);}
function markDay(s){const d=dayKey();s.sessions[d]=s.sessions[d]||{seconds:0,practised:false};s.sessions[d].practised=true;}
function streak(s,today=dayKey()){const keys=Object.keys(s.sessions).filter(k=>s.sessions[k].practised).sort();let cur=s.sessions[today]?.practised?today:previousDay(today),n=0;while(s.sessions[cur]?.practised){n++;cur=previousDay(cur);}let best=0,run=0,last='';for(const k of keys){run=last===previousDay(k)?run+1:1;best=Math.max(best,run);last=k;}return {current:n,best};}
function placementResult(answers){let pairs=0;for(let i=0;i<answers.length;i+=2){if(answers[i]&&answers[i+1])pairs++;else break;}return ['A1.1','A1.2','A2.1','B1.1','B2.1'][pairs];}
function normalizeAnswer(value){return String(value??'').toLowerCase().replace(/[áéíóúü]/g,c=>({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ü':'u'}[c])).replace(/[¿?¡!.,;:”“"']/g,' ').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim();}
function isCorrect(q,value){
 if(q.type!=='text')return value===q.answer;
 const answer=normalizeAnswer(value);
 return answer.length>0&&q.accepted.some(v=>normalizeAnswer(v)===answer);
}
const api={normalizeAnswer,isCorrect,dayKey,previousDay,fresh,recordAnswer,complete,markDay,streak,placementResult};root.Engine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
