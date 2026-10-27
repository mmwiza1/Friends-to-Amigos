(function(root){
'use strict';
const APP_VERSION='1.8.0',indexes=new WeakMap();
const KEY='friends-to-amigos-beta-diagnostics-v1',LIMIT=500,DAYS=30;
const types=['lesson_opened','lesson_completed','activity_left','answer_checked','support_used','dictionary_opened','review_started','review_completed','practice_opened','practice_completed','stage_progressed','session_duration'];
const skills=['context','trainer','builder','spot','numbers','match','rapid','fix','listening','speaking','shadowing'];
const modes=['lesson','review','practice','focused','skill','context','trainer','placement'];
function empty(){return {schemaVersion:1,enabled:true,events:[]};}
function sanitize(raw,C,now=Date.now()){
 const out=empty();if(!raw||raw.schemaVersion!==1)return out;out.enabled=raw.enabled!==false;
 if(!indexes.has(C))indexes.set(C,{lessons:new Set(C.lessons.map(l=>l.id)),questions:new Set(C.lessons.flatMap(l=>l.questions.map(q=>q.id)))});const {lessons,questions}=indexes.get(C);
 for(const e of (Array.isArray(raw.events)?raw.events:[]).slice(-LIMIT)){if(!e||!types.includes(e.type)||!Number.isFinite(e.at)||e.at<now-DAYS*86400000||e.at>now+300000)continue;const r={type:e.type,at:e.at};if(/^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(e.appVersion||''))r.appVersion=e.appVersion;if(C.playableStages.includes(e.stage))r.stage=e.stage;if(Number.isInteger(e.unit)&&e.unit>=0&&e.unit<8)r.unit=e.unit;if(lessons.has(e.activityId))r.activityId=e.activityId;if(questions.has(e.questionId))r.questionId=e.questionId;if(modes.includes(e.mode))r.mode=e.mode;if(skills.includes(e.skill))r.skill=e.skill;if(['spanish','english','independent'].includes(e.support))r.support=e.support;for(const k of ['correct','assisted','selfAssessed','completed','resumed'])if(typeof e[k]==='boolean')r[k]=e[k];for(const k of ['duration','wrongCount'])if(Number.isInteger(e[k])&&e[k]>=0&&e[k]<=86400)r[k]=e[k];if(r.selfAssessed){delete r.correct;delete r.wrongCount;}out.events.push(r);}return out;
}
function create(storage,C,clock=Date.now){let data;try{const raw=storage.getItem(KEY);data=sanitize(raw&&raw.length<=256000?JSON.parse(raw):null,C,clock());}catch{data=empty();}let writable=true;function save(){try{storage.setItem(KEY,JSON.stringify(data));writable=true;}catch{writable=false;}return writable;}
 return {record(type,details={}){if(!data.enabled)return false;data=sanitize({...data,events:[...data.events,{...details,type,at:clock(),appVersion:APP_VERSION}]},C,clock());return save();},reset(){data={...empty(),enabled:data.enabled};return save();},toggle(){data.enabled=!data.enabled;save();return data.enabled;},snapshot(){return sanitize(data,C,clock());},export(){return JSON.stringify({format:'friends-to-amigos-beta-diagnostics-v1',appVersion:APP_VERSION,...sanitize(data,C,clock())},null,2);},get enabled(){return data.enabled;},get writable(){return writable;}};
}
root.BetaDiagnostics={APP_VERSION,KEY,LIMIT,DAYS,types,empty,sanitize,create};if(typeof module!=='undefined')module.exports=root.BetaDiagnostics;
})(typeof window==='undefined'?globalThis:window);
