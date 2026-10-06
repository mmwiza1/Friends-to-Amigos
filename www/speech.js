(function(root){
'use strict';
function create(env,notify){
 const feedback={},clips={};
 function speak(text,rate=.85){
  try{
   if(env.AndroidSpeech&&typeof env.AndroidSpeech.speak==='function'){
    if(typeof env.AndroidSpeech.isReady==='function'&&!env.AndroidSpeech.isReady()){notify('Install an offline Spanish (Spain) voice in Android speech settings.');return false;}
    if(typeof env.AndroidSpeech.speakAtRate==='function')env.AndroidSpeech.speakAtRate(text,rate);else env.AndroidSpeech.speak(text);return true;
   }
   if(!env.speechSynthesis||typeof env.SpeechSynthesisUtterance!=='function'){notify('Spanish speech is unavailable. Install a Spanish voice or use a browser with speech support.');return false;}
   const utterance=new env.SpeechSynthesisUtterance(text);utterance.lang='es-ES';utterance.rate=rate;const voices=env.speechSynthesis.getVoices();utterance.voice=voices.find(v=>v.lang==='es-ES'&&v.localService!==false)||null;
   if(!utterance.voice){notify(voices.length?'Install an offline Spanish (Spain) voice for listening practice.':'Spanish voices are not ready. Try Play again, or install an offline Spanish (Spain) voice.');return false;}
   utterance.onerror=()=>notify('Speech could not play. Check that an offline Spanish voice is installed.');env.speechSynthesis.cancel();env.speechSynthesis.speak(utterance);return true;
  }catch{notify('Speech could not play. Check your Spanish voice settings.');return false;}
 }
 function stop(){try{env.speechSynthesis?.cancel();env.AndroidSpeech?.stop?.();for(const audio of [...Object.values(feedback),...Object.values(clips)]){audio.pause();audio.currentTime=0;}}catch{}}
 function playFeedback(correct){if(typeof env.Audio!=='function')return;try{for(const audio of Object.values(feedback)){audio.pause();audio.currentTime=0;}const name=correct?'success':'failure',audio=feedback[name]||(feedback[name]=new env.Audio(`audio/${name}.mp3`));audio.play()?.catch(()=>{});}catch{}}
 function listen(item){
  if(item.audio&&typeof env.Audio==='function'){
   try{const audio=clips[item.audio]||(clips[item.audio]=new env.Audio(item.audio));audio.currentTime=0;audio.play()?.catch(()=>{notify('Recording unavailable; using Spanish TTS.');speak(item.transcript,item.rate);});return true;}catch{}
  }
  return speak(item.transcript,item.rate);
 }
 return {speak,listen,stop,playFeedback};
}
root.SpeechTools={create};if(typeof module!=='undefined')module.exports=root.SpeechTools;
})(typeof window==='undefined'?globalThis:window);
