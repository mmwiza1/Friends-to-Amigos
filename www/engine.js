(function(root){
const W=typeof module!=='undefined'?require('./writing.js'):root.Writing;
const Feedback=typeof module!=='undefined'?require('./answer-feedback.js'):root.AnswerFeedback;
const dayKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const previousDay=(key)=>{const [y,m,d]=key.split('-').map(Number);return dayKey(new Date(y,m-1,d-1));};
function fresh(){return {version:2,name:'',onboarded:false,stage:'A1.1',startStage:'A1.1',placement:null,completed:[],capabilities:[],reviews:{},events:[],sessions:{},active:null,recovery:[],savedWords:[]};}
function reviewKey(q){if(q.id)return q.id;const raw=JSON.stringify({type:q.type||'choice',prompt:q.prompt,answer:q.answer,accepted:q.accepted||null,options:q.options||null,reading:q.reading?{title:q.reading.title,text:q.reading.text}:null});let a=2166136261,b=5381;for(const c of raw){a=Math.imul(a^c.codePointAt(0),16777619);b=Math.imul(b,33)^c.codePointAt(0);}return 'legacy-'+(a>>>0).toString(16)+'-'+(b>>>0).toString(16);}
function recordAnswer(s,q,correct,now=Date.now(),details={}) {
 const key=reviewKey(q),r=Object.prototype.hasOwnProperty.call(s.reviews,key)?s.reviews[key]:null;
 s.events.push({date:dayKey(new Date(now)),at:now,type:'answer',correct,topic:q.topic,questionId:key,...(details.skipped?{skipped:true}:{}),...(details.assisted?{assisted:true}:{}),...(q.type==='speaking'||details.unverified?{selfAssessed:true}:{})});
 if(details.unverified&&correct){if(r&&!r.corrected&&now>=r.due)r.due=now+86400000;return;}
 if(!correct){const snapshot=r&&!r.corrected?r.question:JSON.parse(JSON.stringify({...q,id:key}));s.reviews[key]={question:snapshot,topic:snapshot.topic,wrong:(r?.wrong||0)+1,success:0,due:now,corrected:false};}
 // A permanent slot can receive a gentler task in a later release. Its saved
 // harder/different review must be corrected using that original task, not by
 // success on the replacement recognition item. Wording/accents remain safe.
 else if(r&&now>=r.due&&r.question&&(r.question.type||'choice')===(q.type||'choice')&&normalizeAnswer(r.question.type==='speaking'?r.question.spanish:r.question.answer)===normalizeAnswer(q.type==='speaking'?q.spanish:q.answer)){r.success++;r.due=now+[1,3,7,14,30][Math.min(r.success-1,4)]*86400000;if(r.success>=3&&!r.corrected){r.corrected=true;s.events.push({date:dayKey(new Date(now)),at:now,type:'corrected',topic:q.topic,questionId:key});}}
}

function complete(s,lesson,score,count,details={}){const reflectionOnly=count===0&&!lesson.checkpoint&&lesson.questions?.length>0&&lesson.questions.every(q=>W.open(q))&&details.reflected===lesson.questions.length;
 if(reflectionOnly||Number.isFinite(score)&&Number.isFinite(count)&&count>0&&score>=0&&score<=count&&score/count>=.8){if(!s.completed.includes(lesson.id)){s.completed.push(lesson.id);s.events.push({date:dayKey(),at:Date.now(),type:'lesson',id:lesson.id,...(reflectionOnly?{selfAssessed:true}:{})});}if(lesson.checkpoint&&!s.capabilities.some(c=>c.id===lesson.id)){s.capabilities.push({id:lesson.id,text:lesson.capability,date:dayKey()});}}markDay(s);}
function markDay(s){const d=dayKey();s.sessions[d]=s.sessions[d]||{seconds:0,practised:false};s.sessions[d].practised=true;}
function streak(s,today=dayKey()){const keys=Object.keys(s.sessions).filter(k=>s.sessions[k].practised).sort();let cur=s.sessions[today]?.practised?today:previousDay(today),n=0;while(s.sessions[cur]?.practised){n++;cur=previousDay(cur);}let best=0,run=0,last='';for(const k of keys){run=last===previousDay(k)?run+1:1;best=Math.max(best,run);last=k;}return {current:n,best};}
function placementResult(answers){let pairs=0;for(let i=0;i<answers.length;i+=2){if(answers[i]&&answers[i+1])pairs++;else break;}return ['A1.1','A1.2','A2.1','B1.1','B2.1'][pairs];}
function normalizeAnswer(value){return String(value??'').normalize('NFC').toLowerCase().replace(/[áéíóúü]/g,c=>({'á':'a','é':'e','í':'i','ó':'o','ú':'u','ü':'u'}[c])).replace(/[¿?¡!.,;:”“"']/g,' ').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim();}
function isCorrect(q,value){
 if(q.writing)return W.assess(q,value).verified;
 if(q.type!=='text')return value===q.answer;
 const answer=normalizeAnswer(value);
 return answer.length>0&&q.accepted.some(v=>normalizeAnswer(v)===answer);
}
function answerExplanation(q,value){
 const key=normalizeAnswer(value);
 const mistake=q.mistakes?.find(item=>normalizeAnswer(item.answer)===key);
 return mistake?mistake.explanation:q.type==='text'&&!isCorrect(q,value)?answerFeedback(q,value).explanation:q.explanation;
}
function answerFeedback(q,value){return Feedback.build(q,value,normalizeAnswer,isCorrect);}
const api={writingAssessment:W.assess,answerFeedback,reviewKey,answerExplanation,normalizeAnswer,isCorrect,dayKey,previousDay,fresh,recordAnswer,complete,markDay,streak,placementResult};root.Engine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
