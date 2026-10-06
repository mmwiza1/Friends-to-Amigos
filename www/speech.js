(function(root){
'use strict';
function create(env,notify){
 const feedback={},clips={},pending=new Map();let sequence=0,generation=0;
 env.FriendsToAmigosSpeechResult=(id,started)=>pending.get(id)?.(started===true);
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
 function stop(){generation++;for(const settle of [...pending.values()])settle(false);try{env.speechSynthesis?.cancel();env.AndroidSpeech?.stop?.();for(const audio of [...Object.values(feedback),...Object.values(clips)]){audio.pause();audio.currentTime=0;}}catch{}}
 function playFeedback(correct){if(typeof env.Audio!=='function')return;try{for(const audio of Object.values(feedback)){audio.pause();audio.currentTime=0;}const name=correct?'success':'failure',audio=feedback[name]||(feedback[name]=new env.Audio(`audio/${name}.mp3`));audio.play()?.catch(()=>{});}catch{}}
 function listen(item,onStarted=()=>{}){
  stop();const attempt=generation;
  return new Promise(resolve=>{
   let finished=false,timer,id='listen-'+(++sequence);
   const settle=started=>{if(finished)return;finished=true;pending.delete(id);if(timer)(env.clearTimeout||clearTimeout)(timer);onStarted(started);resolve(started);};
   pending.set(id,settle);
   timer=(env.setTimeout||setTimeout)(()=>{notify('Audio did not start. Try again or skip this item for review.');settle(false);stop();},10000);
   const tts=()=>{
    if(attempt!==generation){settle(false);return;}
    try{
     if(env.AndroidSpeech){
      if(typeof env.AndroidSpeech.listen!=='function'||!env.AndroidSpeech.isReady?.()){notify('Install an offline Spanish (Spain) voice and use the latest Android app.');settle(false);return;}
      env.AndroidSpeech.listen(item.transcript,item.rate||.75,id);return;
     }
     if(!env.speechSynthesis||typeof env.SpeechSynthesisUtterance!=='function'){notify('Spanish speech is unavailable. Install an offline Spanish voice.');settle(false);return;}
     const voice=env.speechSynthesis.getVoices().find(v=>v.lang==='es-ES'&&v.localService!==false);
     if(!voice){notify('Install an offline Spanish (Spain) voice, or try Play again when voices are ready.');settle(false);return;}
     const u=new env.SpeechSynthesisUtterance(item.transcript);u.lang='es-ES';u.voice=voice;u.rate=item.rate||.75;
     u.onstart=()=>settle(attempt===generation);
     u.onerror=()=>{notify('Speech could not play. Check your offline Spanish voice.');settle(false);};
     env.speechSynthesis.speak(u);
    }catch{notify('Audio is unavailable. Check your offline Spanish voice.');settle(false);}
   };
   if(item.audio&&typeof env.Audio==='function'){
    try{
     const audio=clips[item.audio]||(clips[item.audio]=new env.Audio(item.audio));audio.currentTime=0;audio.playbackRate=item.rate||.75;
     audio.onplaying=()=>settle(attempt===generation);
     let fallback=false;const failed=()=>{if(finished||fallback||attempt!==generation)return;fallback=true;audio.onplaying=null;audio.pause();notify('Recording unavailable; using Spanish TTS.');tts();};
     audio.onerror=failed;
     const playing=audio.play();if(playing&&typeof playing.then==='function')playing.then(()=>settle(attempt===generation),failed);
    }catch{tts();}
   }else tts();
  });
 }
 return {speak,listen,stop,playFeedback};
}
root.SpeechTools={create};if(typeof module!=='undefined')module.exports=root.SpeechTools;
})(typeof window==='undefined'?globalThis:window);
