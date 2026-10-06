const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const C=require('../www/curriculum'),E=require('../www/engine'),Path=require('../www/course-path');
test('all authored Spanish curriculum sources and permanent identity definitions remain byte-for-byte unchanged',()=>{
 const hashes={"curriculum.js":"a2e3f415568568079148595416562063b9ea064015df21b61ebdd058edc84956","a12.js":"96764c50f40cb55300ed508be11ecf231eb02c797fe17af8d17510e13eb0aace","stories.js":"9ff2d21d2b1b2e7b24f5d7dce5c023e1235e5b82ece6bc379452d4001ab0aa01","a12-stories.js":"6468a83f9f9b8407ea501f6e587ac9e4a7047eb31dd0bd05cfeb42c1739b3b28","a1-review.js":"2214bf4042ab292d6d6e134527cdb43c90722da200d7f9f4d05864fcf2688fa6","a1-practice.js":"0d39beec2d894ac4ca60cd8d5ba3f46dbe8238900d5a7627128ca3aaaba78644","question-ids.js":"6e8ba0cd046e0e617f997a4f5964b439eeffe22be691152b22e37499547ec520"};
 for(const [file,hash] of Object.entries(hashes))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('www/'+file)).digest('hex'),hash,file);
});
test('normal path follows complete A1.1 then A1.2 order even when later lessons were manually attempted',()=>{
 const s=E.fresh();s.stage='A1.2';assert.equal(Path.next(s,C).id,C.lessons[0].id);s.completed=C.lessons.filter(l=>l.stage==='A1.1').map(l=>l.id);assert.equal(Path.next(s,C).id,'a12u0l0');s.completed.push('a12u1l0');assert.equal(Path.next(s,C).id,'a12u0l0');assert.equal(Path.complete(s,C),false);
});
test('placed path never falls backwards and course completion counts actual records only',()=>{
 const s=E.fresh();s.startStage='A1.2';s.stage='A1.1';assert.equal(Path.next(s,C).id,'a12u0l0');s.completed=C.lessons.filter(l=>l.stage==='A1.2').map(l=>l.id);assert.equal(Path.next(s,C),undefined);assert.equal(Path.complete(s,C),true);assert.equal(s.completed.length,72);assert.equal(s.events.length,0);assert.equal(s.capabilities.length,0);s.completed.push('u0l0');assert.equal(Path.next(s,C),undefined);
});
test('Today caps due review, ignores future dates, respects placement and prioritises active snapshots',()=>{
 const s=E.fresh();s.onboarded=true;s.startStage='A1.2';const now=10000;
 assert.equal(Path.today(s,C,now).lesson.id,'a12u0l0');for(const q of C.lessons[0].questions)E.recordAnswer(s,q,false,now);for(const q of C.lessons[1].questions)E.recordAnswer(s,q,false,now);assert.equal(Path.today(s,C,now).questions.length,5);assert.equal(Path.today(s,C,now-1).kind,'lesson');s.active={lesson:{id:'u0l0'},questions:[]};assert.equal(Path.today(s,C,now).kind,'resume');assert.equal(Path.today(s,C,now).questions,undefined);
});
function luminance(hex){const c=hex.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
test('system dark CSS preserves the existing light rules and supplies readable dark controls and feedback',()=>{
 const css=fs.readFileSync('www/style.css','utf8'),dark=css.split('@media(prefers-color-scheme:dark)')[1];assert.ok(dark);for(const selector of ['.card','.choice','input','select','nav','.primary','.feedback.wrong','.notice','.toast'])assert.ok(dark.includes(selector));
 for(const [fg,bg] of [['#f1f4f8','#151c26'],['#f1f4f8','#202a38'],['#b5c0ce','#263140'],['#67d1c7','#173d3b'],['#f1f4f8','#4b2a2a'],['#152338','#ff7669']])assert.ok(contrast(fg,bg)>=4.5,`${fg} on ${bg}`);
 const html=fs.readFileSync('www/index.html','utf8');assert.match(html,/theme-color.*prefers-color-scheme: dark/);
});
test('Android delegates Back to app state and packages local icons and day/night splash themes',()=>{
 const java=fs.readFileSync('android/app/src/main/java/com/friendstoamigos/app/MainActivity.java','utf8');assert.match(java,/FriendsToAmigos.handleBack/);assert.doesNotMatch(java,/querySelector/);assert.match(java,/registerOnBackInvokedCallback/);assert.match(java,/moveTaskToBack\(true\)/);assert.match(java,/onStart\(String id\).*speechResult\(id,true\)/);assert.match(java,/onError\(String id\).*speechResult\(id,false\)/);
 const manifest=fs.readFileSync('android/app/src/main/AndroidManifest.xml','utf8');assert.match(manifest,/@mipmap\/ic_launcher_round/);assert.match(manifest,/@string\/app_name/);assert.match(manifest,/@style\/AppTheme/);assert.doesNotMatch(manifest,/android.permission.INTERNET|RECORD_AUDIO/);
 for(const path of ['values-v31','values-night-v31'])assert.match(fs.readFileSync('android/app/src/main/res/'+path+'/styles.xml','utf8'),/windowSplashScreenAnimatedIcon/);
 assert.match(fs.readFileSync('android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml','utf8'),/adaptive-icon/);
 const workflow=fs.readFileSync('.github/workflows/android.yml','utf8');assert.match(workflow,/assembleDebug lintDebug testDebugUnitTest/);assert.doesNotMatch(workflow,/if: github.event_name == 'workflow_dispatch'/);
});
