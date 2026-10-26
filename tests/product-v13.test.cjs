'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const R=require('../www/recommendations'),C=require('../www/curriculum'),E=require('../www/engine'),Path=require('../www/course-path'),app=require('./helpers/app.cjs');
const run=(a,code)=>vm.runInContext(code,a.ctx),state=()=>({...E.fresh(),onboarded:true});
for(const stage of C.playableStages)test(stage+' recommendations are offline, in range and three per category with explicit difficulty',()=>{
 const selected=R.forStage(stage);assert.equal(selected.length,15);assert.equal(new Set(selected.map(r=>r.id)).size,15);for(const category of R.categories)assert.equal(selected.filter(r=>r.category===category).length,3);
 for(const r of selected){assert.ok(R.safeURL(r.url));assert.ok(R.stages.indexOf(stage)>=R.stages.indexOf(r.minimumStage));assert.ok(R.stages.indexOf(stage)<=R.stages.indexOf(r.maximumStage));assert.ok(['Comfortable','Stretch'].includes(r.difficulty));assert.ok(r.reason&&r.note&&r.verified);assert.match(r.suitability,/Editorial/);}
});
test('catalogue identity, reuse and safe external URL validation',()=>{
 assert.equal(R.catalogue.length,30);assert.equal(new Set(R.catalogue.map(r=>r.id)).size,30);assert.equal(R.forStage('C1.1').length,0);assert.ok(R.forStage('A1.1').some(r=>R.forStage('A1.2').some(s=>s.id===r.id)));assert.ok(R.forStage('B1.1').some(r=>r.difficulty==='Stretch'));assert.ok(R.forStage('B2.2').some(r=>r.difficulty==='Comfortable'));
 for(const url of ['javascript:alert(1)','file:///android_asset/index.html','http://www.rtve.es/','https://www.rtve.es.evil.test/','https://name@www.rtve.es/','https://www.rtve.es:8443/'])assert.ok(!R.safeURL(url));
});
test('Home and Profile implement the approved hierarchy without changing five-tab navigation or Saved Words location',()=>{
 const a=app();let html=a.el.innerHTML;const order=['continue','today','attention','practice'].map(s=>html.indexOf('data-home-section="'+s+'"'));assert.ok(order.every((n,i)=>n>=0&&(!i||n>order[i-1])));assert.equal((html.match(/data-action="tab"/g)||[]).length,5);assert.ok(!html.includes('data-tab="Content"'));
 a.click('profile');html=a.el.innerHTML;const sections=['summary','level-streak','capabilities','content','vocabulary','progress','settings'].map(s=>html.indexOf('data-profile-section="'+s+'"'));assert.ok(sections.every((n,i)=>n>=0&&(!i||n>sections[i-1])));assert.match(html,/data-action="savedWords"/);assert.match(html,/data-tab="Review"/);assert.match(html,/data-action="reset"/);a.click('savedWords');assert.match(a.el.innerHTML,/Search your words/);assert.ok(a.ctx.FriendsToAmigos.handleBack());assert.match(a.el.innerHTML,/Your profile/);
});
test('Profile recommendations use actual path progress, remain secondary, open via browser or native and Back returns Profile',()=>{
 const opened=[],a=app({open:(...args)=>opened.push(args)});a.click('content');assert.match(a.el.innerHTML,/Recommended for A1.1/);assert.equal((a.el.innerHTML.match(/data-action="externalContent"/g)||[]).length,15);a.click('externalContent',{id:'ministerio'});assert.equal(opened.length,0);a.click('externalContent',{id:'pocoyo'});assert.equal(opened[0][0],R.catalogue.find(r=>r.id==='pocoyo').url);assert.deepEqual(opened[0].slice(1),['_blank','noopener,noreferrer']);assert.ok(a.ctx.FriendsToAmigos.handleBack());assert.match(a.el.innerHTML,/data-profile-section="summary"/);
 const native=[],b=app({AndroidSpeech:{openExternal:url=>native.push(url)}});b.click('content');b.click('externalContent',{id:'pocoyo'});assert.equal(native.length,1);
 const completed=state();completed.completed=C.lessons.map(l=>l.id);const c=app({},completed);c.click('content');assert.match(c.el.innerHTML,/Recommended for B2.2/);assert.doesNotMatch(c.el.innerHTML,/data-id="pocoyo"/);
});
for(const stage of C.playableStages)test(stage+' direct Continue follows every required adjacency and does not duplicate completion events',()=>{
 const a=app(),lessons=a.ctx.Curriculum.lessons.filter(l=>l.stage===stage);
 run(a,"state.onboarded=true;state.startStage='"+stage+"';state.completed=[]");
 for(let i=0;i<lessons.length;i++){
  const lesson=lessons[i],required=a.ctx.Curriculum.lessons.filter(l=>C.playableStages.indexOf(l.stage)>=C.playableStages.indexOf(stage)),position=required.findIndex(l=>l.id===lesson.id);
  run(a,'state.completed='+JSON.stringify(required.slice(0,position).map(l=>l.id))+';state.active=null');a.click('lesson',{id:lesson.id});run(a,'quiz.answers=quiz.questions.map(q=>Writing.open(q)?null:true);quiz.writingResponses=Object.fromEntries(quiz.questions.map((q,i)=>Writing.open(q)?[i,{response:q.answer,reflection:"got"}]:null).filter(Boolean));quiz.index=quiz.questions.length;render()');
  assert.ok(a.state().completed.includes(lesson.id));const before=a.state().events.filter(e=>e.type==='lesson').length;assert.match(a.el.innerHTML,/data-action="continueLearning"/);assert.match(a.el.innerHTML,/Finish for now/);a.click('continueLearning');const next=required[position+1];if(next)assert.equal(a.state().active.lesson.id,next.id);else assert.equal(a.state().active,null);assert.equal(a.state().events.filter(e=>e.type==='lesson').length,before);
 }
});
test('failed completion, Finish for now, Today and placement keep required path authoritative',()=>{
 const a=app();a.click('begin');run(a,'quiz.answers=quiz.questions.map(()=>false);quiz.index=quiz.questions.length;render()');assert.doesNotMatch(a.el.innerHTML,/data-action="continueLearning"/);a.click('continueLearning');assert.equal(a.state().completed.length,0);a.click('home');assert.match(a.el.innerHTML,/data-home-section="continue"/);
 const s=state();s.stage=s.startStage='A1.2';const b=app({},s);b.click('continue');assert.equal(b.state().active.lesson.id,'a12u0l0');b.click('leave');b.click('today');assert.equal(b.state().active.lesson.id,'a12u0l0');run(b,'quiz.answers=quiz.questions.map(()=>true);quiz.index=quiz.questions.length;render()');assert.match(b.el.innerHTML,/todayNext/);assert.doesNotMatch(b.el.innerHTML,/data-action="continueLearning"/);
});
test('the explicit v1.2 main contract and current release audit protect every source payload without rewriting fixtures',()=>{
 const audit=require('../scripts/learner-release-audit.cjs');assert.equal(audit.baseline,'3af8d73b0a25c40bc8802122c4ad068ba0ebf6c8');assert.equal(audit.schema,2);assert.equal(audit.stageStats.length,8);assert.ok(audit.stageStats.slice(0,3).every(s=>s.afterText===0));assert.equal(audit.recommendations.perStage,15);assert.equal(audit.focused.finiteTextAdapted,133);
});
test('Profile retains detailed period stats and the seven-day chart, and a filter keeps those results open',()=>{
 const a=app();a.click('profile');assert.match(a.el.innerHTML,/class="weekchart"/);assert.match(a.el.innerHTML,/Selected period/);a.click('filter',{filter:'week'});assert.match(a.el.innerHTML,/<details id="profile-period-stats" open/);assert.match(a.el.innerHTML,/aria-pressed="true" data-filter="week"/);for(const label of ['Lessons completed','Learning time','Mistakes corrected','Current streak','Longest streak','Days practised','Milestones achieved','Review points retained'])assert.ok(a.el.innerHTML.includes(label));
});
test('Home Needs Attention includes shared practice weaknesses even without a course Review item',()=>{
 const M=require('../www/mastery'),s=state();M.record(s,[{verb:'comer',tense:'present',person:'vosotros',pattern:'regular-er'}],false,{session:'g1',item:'1'},1000);M.record(s,[{verb:'comer',tense:'present',person:'vosotros',pattern:'regular-er'}],false,{session:'g2',item:'2'},2000);const a=app({},s);assert.deepEqual(a.state().reviews,{});const attention=a.el.innerHTML.split('data-home-section="attention"')[1].split('</section>')[0];assert.match(attention,/vosotros/);assert.match(attention,/weakAreas/);
});
test('new structured activities say Build in Spanish while historical typed titles and activity IDs remain intact',()=>{
 const Policy=require('../www/assessment-policy'),l=C.lessons.find(l=>l.id==='u0write'),historical={...l,questions:l.questions.map(Policy.prior)};assert.match(Policy.title(l),/^Build in Spanish/);assert.equal(Policy.title(historical),historical.title);assert.match(Policy.title(C.lessons.find(l=>l.id==='a22u0write')),/^Guided writing/);assert.equal(l.id,'u0write');const a=app();a.click('lesson',{id:l.id});assert.match(a.el.innerHTML,/Build in Spanish/);a.click('home');a.click('tab',{tab:'Learn'});assert.match(a.el.innerHTML,/Build in Spanish/);
});
