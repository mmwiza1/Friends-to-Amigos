'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{spawn}=require('node:child_process');
function create(){
const chrome=process.env.CHROME_BIN||['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser'].find(p=>fs.existsSync(p));
if(!chrome)throw Error('Install Chromium/Chrome or set CHROME_BIN to run browser checks.');
const profile=fs.mkdtempSync(path.join(os.tmpdir(),'fta-browser-'));
const child=spawn(chrome,['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--no-first-run','--remote-debugging-pipe','--user-data-dir='+profile],{stdio:['ignore','ignore','pipe','pipe','pipe']});
let counter=0,buffer='',errors='';const exceptions=[];const pending=new Map();
child.stderr.on('data',chunk=>{errors=(errors+chunk).slice(-4000);});
for(const pipe of [child.stdio[3],child.stdio[4]])pipe.on('error',error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(Error(error.message+': '+errors));}pending.clear();});
child.on('error',error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(error);}pending.clear();});
child.stdio[4].on('data',chunk=>{buffer+=chunk;let end;while((end=buffer.indexOf('\0'))!==-1){const part=buffer.slice(0,end);buffer=buffer.slice(end+1);if(!part)continue;const message=JSON.parse(part);if(message.method==='Runtime.exceptionThrown'){const e=message.params.exceptionDetails,description=(e.exception?.description||e.text)+' '+JSON.stringify(e.stackTrace?.callFrames||[]);exceptions.push(description);console.error('Browser exception:',description);}const entry=pending.get(message.id);if(entry){clearTimeout(entry.timer);pending.delete(message.id);message.error?entry.reject(Error(JSON.stringify(message.error))):entry.resolve(message.result);}}});
child.on('exit',code=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(Error('Chrome exited '+code+': '+errors));}pending.clear();});
function send(method,params={},sessionId){return new Promise((resolve,reject)=>{const id=++counter,timer=setTimeout(()=>{pending.delete(id);reject(Error('DevTools timeout: '+method+': '+errors));},['Browser.getVersion','Target.createTarget','Runtime.evaluate'].includes(method)?120000:15000);pending.set(id,{resolve,reject,timer});child.stdio[3].write(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})})+'\0');});}
async function evaluate(session,expression){const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true},session);if(result.exceptionDetails)throw Error(result.exceptionDetails.text+': '+(result.exceptionDetails.exception?.description||''));return result.result.value;}
// Screenshot setup has a private lexical scope on every evaluation; CDP retains
// top-level const declarations between calls, so shared names must never leak.
async function fixture(session,statements){return evaluate(session,'(()=>{'+statements+'})()');}

async function close(){
 // Chrome must stop writing its profile before cleanup removes it.
 if(child.pid&&child.exitCode===null&&child.signalCode===null)await new Promise(resolve=>{child.once('close',resolve);child.kill();});
 fs.rmSync(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}
function assertNoExceptions(){if(exceptions.length)throw Error('Unexpected browser exception: '+exceptions.join(' | '));}
return {send,evaluate,fixture,close,assertNoExceptions};
}
module.exports={create};
