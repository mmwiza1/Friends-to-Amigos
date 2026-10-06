const {test}=require('node:test'),assert=require('node:assert/strict');const Speech=require('../www/speech');
function browser(){const utterances=[],voice={lang:'es-ES',localService:true};return {utterances,voice,env:{SpeechSynthesisUtterance:class{constructor(text){this.text=text;}},speechSynthesis:{getVoices:()=>[voice],cancel(){},speak:u=>utterances.push(u)}}};}
test('Android listening waits for actual start acknowledgement and readiness failures are explicit',async()=>{
 const spoken=[],messages=[],env={AndroidSpeech:{isReady:()=>true,speak:t=>spoken.push(t),listen:(text,rate,id)=>spoken.push({text,rate,id})}};const s=Speech.create(env,t=>messages.push(t));let result=null;const p=s.listen({transcript:'Hola',rate:.9},v=>result=v);assert.equal(result,null);assert.equal(spoken[0].text,'Hola');assert.equal(spoken[0].rate,.9);env.FriendsToAmigosSpeechResult(spoken[0].id,true);assert.equal(await p,true);env.AndroidSpeech.isReady=()=>false;assert.equal(s.speak('Adiós'),false);assert.match(messages[0],/offline Spanish/);
});
test('browser playback selects Spain Spanish, sets rate, waits for onstart and reports speech errors',async()=>{
 const {env,utterances,voice}=browser(),messages=[],s=Speech.create(env,t=>messages.push(t));let result=null;const p=s.listen({transcript:'Nos vemos mañana',rate:1},v=>result=v);assert.equal(result,null);assert.equal(utterances[0].lang,'es-ES');assert.equal(utterances[0].rate,1);assert.equal(utterances[0].voice,voice);utterances[0].onstart();assert.equal(await p,true);utterances[0].onerror();assert.match(messages[0],/could not play/);
});
test('unsupported speech returns false without depending on a cloud service',async()=>{
 const messages=[],s=Speech.create({},t=>messages.push(t));assert.equal(await s.listen({transcript:'Hola'}),false);assert.match(messages[0],/unavailable/);
});
test('a future local recording can replay and falls back to TTS only after the recording fails',async()=>{
 const {env,utterances}=browser(),played=[];env.Audio=class{constructor(src){this.src=src;}play(){played.push(this.src);return Promise.reject(Error('missing'));}pause(){}};const s=Speech.create(env,()=>{});let started=null;const p=s.listen({audio:'audio/learning/sample.mp3',transcript:'Hola',rate:.75},v=>started=v);assert.equal(started,null);await Promise.resolve();assert.equal(started,null);assert.deepEqual(played,['audio/learning/sample.mp3']);assert.equal(utterances[0].text,'Hola');utterances[0].onstart();assert.equal(await p,true);
});
test('stop cancels browser/native speech without breaking unsupported environments',()=>{
 let browser=0,native=0;const s=Speech.create({speechSynthesis:{cancel:()=>browser++},AndroidSpeech:{stop:()=>native++}},()=>{});s.stop();assert.equal(browser,1);assert.equal(native,1);Speech.create({},()=>{}).stop();
});
test('explicitly remote browser voices are refused instead of making listening require the internet',()=>{
 let spoken=0;const messages=[],env={SpeechSynthesisUtterance:class{},speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:false}],speak(){spoken++;}}};
 assert.equal(Speech.create(env,t=>messages.push(t)).speak('Hola'),false);assert.equal(spoken,0);assert.match(messages[0],/offline Spanish/);
});
test('new native bridge uses listening rate; old bridge still supports model speech but cannot falsely confirm listening',async()=>{
 const played=[],env={AndroidSpeech:{speak:text=>played.push(text),speakAtRate:(text,rate)=>played.push({text,rate})}};
 const s=Speech.create(env,()=>{});assert.equal(s.speak('¿Qué tal mañana?',1),true);assert.deepEqual(played,[{text:'¿Qué tal mañana?',rate:1}]);assert.equal(await s.listen({transcript:'Hola'}),false);
});
test('an uninitialised browser voice list does not fall through to a possibly network-backed default',()=>{
 let spoken=0;const messages=[],env={SpeechSynthesisUtterance:class{},speechSynthesis:{getVoices:()=>[],speak(){spoken++;}}};
 const s=Speech.create(env,t=>messages.push(t));assert.equal(s.speak('Hola'),false);assert.equal(spoken,0);assert.match(messages[0],/Try Play again/);
});
test('bundled recording unlocks only after play promise resolves, propagates rate and supports replay',async()=>{
 let resolvePlay;const clips=[],env={Audio:class{constructor(src){this.src=src;clips.push(this);}pause(){}play(){return new Promise(r=>resolvePlay=r);}}},s=Speech.create(env,()=>{});let started=null;const item={audio:'audio/learning/sample.mp3',transcript:'Hola',rate:.75},p=s.listen(item,v=>started=v);assert.equal(started,null);assert.equal(clips[0].playbackRate,.75);resolvePlay();assert.equal(await p,true);const replay=s.listen({...item,rate:1});assert.equal(clips.length,1);assert.equal(clips[0].playbackRate,1);resolvePlay();assert.equal(await replay,true);
});
test('recording rejection and TTS onerror settle complete failure without any successful start',async()=>{
 const {env,utterances}=browser();env.Audio=class{pause(){}play(){return Promise.reject(Error('blocked'));}};const s=Speech.create(env,()=>{}),results=[],p=s.listen({audio:'audio/learning/sample.mp3',transcript:'Hola'},v=>results.push(v));await Promise.resolve();assert.deepEqual(results,[]);utterances[0].onerror();assert.equal(await p,false);assert.deepEqual(results,[false]);
});
test('cancelled recording cannot launch fallback TTS or report stale success',async()=>{
 const {env,utterances}=browser();let reject;env.Audio=class{pause(){}play(){return new Promise((_,r)=>reject=r);}};const s=Speech.create(env,()=>{}),p=s.listen({audio:'audio/learning/sample.mp3',transcript:'Hola'});s.stop();reject(Error('cancelled'));assert.equal(await p,false);await Promise.resolve();assert.equal(utterances.length,0);
});
test('native error and start timeout cannot unlock a listener',async()=>{
 const env={AndroidSpeech:{isReady:()=>true,listen(text,rate,id){this.id=id;}},setTimeout(fn){this.timeout=fn;return 1;},clearTimeout(){}};let timer;env.setTimeout=fn=>{timer=fn;return 1;};const s=Speech.create(env,()=>{}),p=s.listen({transcript:'Hola'});env.FriendsToAmigosSpeechResult(env.AndroidSpeech.id,false);assert.equal(await p,false);const p2=s.listen({transcript:'Hola'});timer();assert.equal(await p2,false);
});
