'use strict';
const fs=require('node:fs'),path=require('node:path'),C=require('./showcase/config.cjs'),PNG=require('./showcase/png.cjs');
const fail=msg=>{throw Error(msg+' See docs/SCREENSHOT_POLICY.md; run npm run capture:showcase, inspect the candidate images, then adopt the reviewed set.');};
const iso=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}T/.test(x)&&Number.isFinite(Date.parse(x))&&Date.parse(x)<=Date.now()+300000;
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
function validate(root=path.resolve(__dirname,'..')){
 const file=path.join(root,'docs/screenshots/manifest.json');if(!fs.existsSync(file))fail('Screenshot manifest is missing.');let m;try{m=JSON.parse(fs.readFileSync(file,'utf8'));}catch{fail('Screenshot manifest is not valid JSON.');}
 if(!object(m)||m.schemaVersion!==1)fail('Unsupported screenshot manifest schemaVersion; migrate the old one-off manifest.');const v=C.versions(root);
 if(m.appVersion!==v.appVersion)fail('README/app release is '+v.appVersion+' but docs/screenshots/manifest.json contains '+m.appVersion+'. Regenerate or review the unchanged showcase before release.');
 if(m.androidVersionCode!==v.androidVersionCode)fail('Screenshot Android versionCode '+m.androidVersionCode+' disagrees with '+v.androidVersionCode+'.');
 if(!iso(m.generatedAt)||m.sourceCommit!==null&&!/^[a-f0-9]{40}$/.test(m.sourceCommit||''))fail('Invalid screenshot generation date or capture commit. Use null for an unknown commit; never invent one.');
 if(m.captureMode!=='clean-app-viewport'||JSON.stringify(m.navigationLabels)!==JSON.stringify(C.navigation))fail('Showcase must use clean app viewports and visible Home / Learn / Practice / Review / Profile labels.');
 const fingerprint=C.fingerprint(root);if(!object(m.sourceFingerprint)||m.sourceFingerprint.algorithm!=='sha256'||m.sourceFingerprint.sha256!==fingerprint.sha256||JSON.stringify(m.sourceFingerprint.sources)!==JSON.stringify(fingerprint.sources)){
  const old=m.sourceFingerprint?.sources||{},changed=fingerprint.sources&&Object.keys({...old,...fingerprint.sources}).filter(k=>old[k]!==fingerprint.sources[k]);fail('Showcased UI/capture sources changed without a refreshed manifest: '+changed.join(', ')+'. Regenerate affected screenshots from the final UI.');
 }
 if(!Array.isArray(m.screenshots)||m.screenshotCount!==m.screenshots.length||m.screenshotCount<10||m.screenshotCount>15)fail('Showcase needs 10–15 representative screenshots with matching screenshotCount.');
 if(m.validationRun!==null&&(!Number.isSafeInteger(m.validationRun)||m.validationRun<=0))fail('Invalid screenshot validationRun.');
 if(new Set(m.screenshots.map(r=>r?.filename)).size!==m.screenshots.length)fail('Duplicate screenshot filename in manifest.');
 const readme=fs.readFileSync(path.join(root,'README.md'),'utf8'),advertised=readme.match(/\*\*(\d+\.\d+\.\d+)(?:\s|\s*·)/)?.[1];
 if(advertised!==v.appVersion)fail('README advertised app version '+advertised+' disagrees with '+v.appVersion+'.');
 const preview=readme.match(/<!-- app-showcase:start -->([\s\S]*?)<!-- app-showcase:end -->/)?.[1];if(!preview)fail('README needs explicit app-showcase:start/end markers.');
 for(const found of preview.matchAll(/(?:screens?(?:hots)?|UI|version|release|build)(?:\s+[A-Za-z]+){0,5}\s+v?(\d+\.\d+(?:\.\d+)?)/gi)){const claimed=found[1].split('.').length===2?found[1]+'.0':found[1];if(claimed!==v.appVersion)fail('README screenshot prose claims older/different UI '+found[1]+' while the app is '+v.appVersion+'.');}
 const described=preview.match(/Showcase UI:\s*\*\*(\d+\.\d+\.\d+)\*\*/)?.[1];if(described!==v.appVersion)fail('README showcase describes '+described+' but the app is '+v.appVersion+'. Do not publish an older UI description.');
 const references=[...readme.matchAll(/(?:src=["']|\]\()(?:\.\/)?docs\/screenshots\/([^"')\s>]+)/g)].map(x=>x[1]),files=new Set(),screens=new Set();
 if(!references.length||new Set(references).size!==references.length)fail('README screenshot references are empty or duplicated.');
 const manual=m.manualReview;if(!object(manual)||manual.status!=='approved'||!iso(manual.reviewedAt)||manual.appVersion!==v.appVersion||manual.sourceFingerprint!==fingerprint.sha256||typeof manual.reviewer!=='string'||!manual.reviewer.trim()||!/^docs\/release\/[A-Za-z0-9_.-]+\.md$/.test(manual.report||''))fail('Screenshot visual review is missing, pending or stale. Review every image and record the current version/fingerprint.');
 if(Date.parse(manual.reviewedAt)<Date.parse(m.generatedAt))fail('Visual review predates the generated screenshots.');
 if(JSON.stringify(manual.images)!==JSON.stringify(Object.fromEntries(m.screenshots.map(r=>[r.filename,r.sha256]))))fail('Visual review does not bind the current screenshot bytes.');
 const reportPath=path.join(root,manual.report);if(!fs.existsSync(reportPath))fail('Manual screenshot review report is missing.');const review=fs.readFileSync(reportPath,'utf8');if(!review.includes('<!-- showcase-review: '+fingerprint.sha256+' -->'))fail('Manual screenshot review report does not attest this UI fingerprint.');
 for(const row of m.screenshots){
  if(!object(row)||!/^[-a-z0-9]+\.png$/.test(row.filename||'')||files.has(row.filename))fail('Duplicate or unsafe screenshot filename: '+row?.filename);files.add(row.filename);
  if(typeof row.screen!=='string'||!C.screens.some(s=>s.screen===row.screen)||screens.has(row.screen)||typeof row.description!=='string'||!row.description.trim()||!['light','dark'].includes(row.theme)||row.simulated!==true)fail('Invalid screen/description/theme/simulation metadata for '+row.filename);screens.add(row.screen);
  const p=row.profile;if(!object(p)||p.name!=='clean-app-portrait'||p.deviceScaleFactor!==1||p.keyboard!==false||JSON.stringify(p.insets)!==JSON.stringify({top:0,bottom:0,left:0,right:0}))fail('Invalid usable-viewport metadata for '+row.filename);
  if(!/^\d+\.\d+\.\d+$/.test(row.firstGeneratedVersion||'')||!/^\d+\.\d+\.\d+$/.test(row.refreshedInVersion||'')||row.reviewedForVersion!==v.appVersion)fail('Stale screenshot release metadata for '+row.filename);
  if(row.refreshedInVersion!==v.appVersion&&(typeof row.retainedReason!=='string'||row.retainedReason.trim().length<20))fail('Older image '+row.filename+' needs an explicit unchanged-UI retention reason.');
  const image=path.join(root,'docs/screenshots',row.filename);if(!fs.existsSync(image))fail('Missing screenshot '+row.filename);const bytes=fs.readFileSync(image);let dims;try{dims=PNG.inspect(bytes);}catch(e){fail(row.filename+': '+e.message);}
  if(C.hash(bytes)!==row.sha256||dims.width!==p.width||dims.height!==p.height)fail('Screenshot bytes/dimensions differ from the reviewed manifest: '+row.filename);
  if(!object(row.layout)||row.layout.overflow||row.layout.keyboard||row.layout.animations!==0||!row.layout.popupFits||row.layout.width!==p.width||row.layout.height!==p.height||!row.layout.insets?.every(x=>x==='0px'))fail('Invalid or failed captured geometry for '+row.filename);
  const expected=C.screens.find(s=>s.screen===row.screen);if(JSON.stringify(row.layout.navigationLabels)!==JSON.stringify(expected.active?C.navigation:[])||expected.active&&(Math.abs(row.layout.navBottom-p.height)>1||!row.layout.active?.includes(expected.active)))fail('Wrong learner-visible navigation/system-bar gap in '+row.filename);
  if(row.layout.targetBottom!==null&&row.layout.targetBottom>row.layout.navTop+1)fail('Clipped capture boundary in '+row.filename);
  if(!references.includes(row.filename)||!preview.includes('docs/screenshots/'+row.filename)||(!review.includes('`'+row.filename+'`')||!review.includes(row.sha256)))fail('Screenshot is absent from README showcase or manual review: '+row.filename);
 }
 for(const screen of ['home','learn','practice','review','profile'])if(!screens.has(screen))fail('Showcase is missing the primary '+screen+' screen.');
 for(const ref of references)if(!files.has(ref))fail('README screenshot '+ref+' is missing from the manifest.');
 return {appVersion:v.appVersion,androidVersionCode:v.androidVersionCode,count:files.size,sourceFingerprint:fingerprint.sha256,manualReview:manual.report};
}
module.exports={validate};if(require.main===module){try{const r=validate();console.log('Screenshot validation passed: '+r.count+' images · app '+r.appVersion+' / Android '+r.androidVersionCode+' · current UI fingerprint and visual review verified.');}catch(e){console.error('Screenshot validation failed: '+e.message);process.exitCode=1;}}
