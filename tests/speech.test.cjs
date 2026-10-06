const {test}=require('node:test'),assert=require('node:assert/strict');const Speech=require('../www/speech');
test('Android bridge playback uses existing Spanish TTS and readiness failures are explicit',()=>{
 const spoken=[],messages=[],env={AndroidSpeech:{isReady:()=>true,speak:t=>spoken.push(t)}};const s=Speech.create(env,t=>messages.push(t));assert.equal(s.listen({transcript:'Hola',rate:.9}),true);assert.deepEqual(spoken,['Hola']);env.AndroidSpeech.isReady=()=>false;assert.equal(s.speak('Adiós'),false);assert.match(messages[0],/offline Spanish/);
});
test('browser playback selects Spain Spanish, sets rate and reports speech errors',()=>{
 const utterances=[],messages=[],voice={lang:'es-ES',localService:true};const env={SpeechSynthesisUtterance:class{constructor(t){this.text=t;}},speechSynthesis:{getVoices:()=>[voice],cancel(){},speak:u=>utterances.push(u)}};const s=Speech.create(env,t=>messages.push(t));assert.equal(s.listen({transcript:'Nos vemos mañana',rate:1}),true);assert.equal(utterances[0].lang,'es-ES');assert.equal(utterances[0].rate,1);assert.equal(utterances[0].voice,voice);utterances[0].onerror();assert.match(messages[0],/could not play/);
});
test('unsupported speech returns false without depending on a cloud service',()=>{
 const messages=[],s=Speech.create({},t=>messages.push(t));assert.equal(s.listen({transcript:'Hola'}),false);assert.match(messages[0],/unavailable/);
});
test('a future local recording can replay and falls back to TTS if the file fails',async()=>{
 const played=[],spoken=[];const env={AndroidSpeech:{speak:t=>spoken.push(t)},Audio:class{constructor(src){this.src=src;}play(){played.push(this.src);return Promise.reject(Error('missing'));}pause(){}}};const s=Speech.create(env,()=>{});assert.equal(s.listen({audio:'audio/learning/sample.mp3',transcript:'Hola'}),true);await Promise.resolve();assert.deepEqual(played,['audio/learning/sample.mp3']);assert.deepEqual(spoken,['Hola']);
});
test('stop cancels browser/native speech without breaking unsupported environments',()=>{
 let browser=0,native=0;const s=Speech.create({speechSynthesis:{cancel:()=>browser++},AndroidSpeech:{stop:()=>native++}},()=>{});s.stop();assert.equal(browser,1);assert.equal(native,1);Speech.create({},()=>{}).stop();
});
test('explicitly remote browser voices are refused instead of making listening require the internet',()=>{
 let spoken=0;const messages=[],env={SpeechSynthesisUtterance:class{},speechSynthesis:{getVoices:()=>[{lang:'es-ES',localService:false}],speak(){spoken++;}}};
 assert.equal(Speech.create(env,t=>messages.push(t)).speak('Hola'),false);assert.equal(spoken,0);assert.match(messages[0],/offline Spanish/);
});
test('new native bridge uses authored listening rate and old bridge remains supported',()=>{
 const played=[],env={AndroidSpeech:{speak(){throw Error('wrong path');},speakAtRate:(text,rate)=>played.push({text,rate})}};
 assert.equal(Speech.create(env,()=>{}).listen({transcript:'¿Qué tal mañana?',rate:1}),true);assert.deepEqual(played,[{text:'¿Qué tal mañana?',rate:1}]);
});
test('an uninitialised browser voice list does not fall through to a possibly network-backed default',()=>{
 let spoken=0;const messages=[],env={SpeechSynthesisUtterance:class{},speechSynthesis:{getVoices:()=>[],speak(){spoken++;}}};
 const s=Speech.create(env,t=>messages.push(t));assert.equal(s.speak('Hola'),false);assert.equal(spoken,0);assert.match(messages[0],/Try Play again/);
});
