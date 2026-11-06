'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm');
function startAt(a,lesson,index){a.click('lesson',{id:lesson.id});for(let i=0;i<index;i++){const q=a.current();a.answer();a.click('check');if(q.writing&&q.writing.mode!=='controlled')a.click('writingReflect',{result:'got'});a.click('next');}}
const escapeHTML=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function go(a,value,details={}){return a.key('Enter',{target:{id:'written-answer',value},...details});}
function locateQuestion(a,predicate){
 for(const lesson of a.ctx.Curriculum.lessons){const index=lesson.questions.findIndex(predicate);if(index>=0){a.click('lesson',{id:lesson.id});if(lesson.reading)a.click('readStory');for(let i=0;i<index;i++){a.answer();a.click('check');a.click('next');}return a.current();}}
 throw new Error('No authored question matched the test scenario');
}
function gameLearner(stage='A1.1',unit=7){const C=require('../../www/curriculum'),E=require('../../www/engine'),s=E.fresh();s.onboarded=true;s.stage=stage;s.completed=C.lessons.filter(l=>l.stage==='A1.1'&&(stage==='A1.2'||l.unit<=unit)||l.stage===stage&&l.unit<=unit).map(l=>l.id);return s;}
function answerGame(a,wrongBlank=-1){const active=a.state().games.active,q=active.questions[active.index];q.blanks.forEach((b,i)=>a.click('gameAnswer',{blank:String(i),index:String(b.options.findIndex(v=>i===wrongBlank?v!==b.answer:v===b.answer))}));a.click('gameCheck');}
function finishLesson(a,correct=true){let turns=0;while(a.current()){assert.ok(++turns<30,'Lesson must advance after every submitted answer');const q=a.current();a.answer(correct);a.click('check');if(q.writing&&q.writing.mode!=='controlled')a.click('writingReflect',{result:correct?'got':'needs'});a.click('next');if(a.el.innerHTML.includes('Session complete')||a.el.innerHTML.includes('Keep building confidence'))break;}}
function tableLearner(){const C=require('../../www/curriculum'),s=require('../../www/engine').fresh();s.onboarded=true;s.stage='A2.1';s.completed=C.lessons.map(l=>l.id);return s;}
function fillTable(a,correct=true){const attempt=a.state().blanks.active,table=attempt.tables[attempt.index];for(let i=0;i<table.rows.length;i++){const value=correct?table.target.forms[table.rows[i]]:table.options[i].find(x=>x!==table.target.forms[table.rows[i]]);if(attempt.entry==='text')vm.runInContext(`state.blanks.active.selected[${i}]=${JSON.stringify(value)}`,a.ctx);else a.change({dataset:{cell:String(i)},value});}a.click('blanksCheck');}
function startFocusedTest(a,kind,stage='A2.1'){a.click('mediaPractice',{kind,stage});assert.equal(vm.runInContext('quiz.kind',a.ctx),'focused');assert.equal(a.state().focused.active.questions.length,10);}
function finishFocusedTest(a,got=10){for(let i=0;i<10;i++){a.answer(i<got);a.click('check');a.click('next');}}
module.exports={startAt,escapeHTML,go,locateQuestion,gameLearner,answerGame,finishLesson,tableLearner,fillTable,startFocusedTest,finishFocusedTest};
