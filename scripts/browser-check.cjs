'use strict';
// Real Chromium layout/interaction checks using its native DevTools pipe.
// No browser automation package or server is required.
const fs=require('node:fs'),path=require('node:path');
const historicalEpisodeSources=Object.fromEntries(JSON.parse(fs.readFileSync('docs/release/v15-content-changes.json','utf8')).changes.map(r=>[r.id,r.before]));
const browser=require('./browser/devtools.cjs').create(),{send,evaluate,fixture}=browser,output=path.resolve('browser-reports');fs.mkdirSync(output,{recursive:true});
async function run(){ // Wait for the browser process before creating its first page; UI assertions retain their existing timeout.
 await send('Browser.getVersion');
 const {targetId}=await send('Target.createTarget',{url:'about:blank'}),{sessionId}=await send('Target.attachToTarget',{targetId,flatten:true});await send('Page.enable',{},sessionId);await send('Runtime.enable',{},sessionId);
 const scenarios=require('./browser/profiles.cjs');
 let totalChecks=0;
 for(const config of process.argv.includes('--showcase-only')?[]:scenarios){
  await send('Emulation.setDeviceMetricsOverride',{width:config.width,height:config.height,deviceScaleFactor:1,mobile:true},sessionId);
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:config.dark?'dark':'light'}]},sessionId);
  const navigation=await send('Page.navigate',{url:'file://'+path.resolve('www/index.html')},sessionId);if(navigation.errorText)throw Error('Navigation failed: '+navigation.errorText);
  await evaluate(sessionId,`new Promise((resolve,reject)=>{const started=Date.now();function ready(){if(window.FriendsToAmigos&&window.ViewportTools)resolve(true);else if(Date.now()-started>5000)reject(Error('App did not load'));else setTimeout(ready,10);}ready();})`);
  const report=await evaluate(sessionId,require('./browser/interaction-assertions.cjs')(config,historicalEpisodeSources));
  await evaluate(sessionId,"document.querySelectorAll('.toast').forEach(e=>e.remove());");
  const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sessionId);fs.writeFileSync(path.join(output,config.name+'.png'),Buffer.from(screenshot.data,'base64'));totalChecks+=report.checks;console.log('PASS '+config.name+' ('+report.checks+' checks)');fs.writeFileSync(path.join(output,config.name+'.json'),JSON.stringify(report,null,2));
  await require('./browser/stress-captures.cjs')({config,fixture,evaluate,send,sessionId,output,fs,path});

 }
 browser.assertNoExceptions();
 await require('./capture-showcase.cjs').capture({send,evaluate,fixture,sessionId,output});
 browser.assertNoExceptions();
 if(!process.argv.includes('--showcase-only'))console.log('Browser checks passed: '+scenarios.length+' layouts, '+totalChecks+' layout/interaction assertions. Native insets/keyboard are simulated, not device-tested.');
}
run().catch(error=>{console.error(error.stack);process.exitCode=1;}).finally(async()=>{
 await browser.close();
});
