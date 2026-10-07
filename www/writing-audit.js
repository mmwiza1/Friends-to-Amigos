(function(root){
'use strict';
function apply(C){const audit=[];
 const communicative=new Set(['a12u0write-q5','a12u1write-q4','a12u3write-q5','a12u5write-q5','a12u6write-q5','a12u7write-q2','a12u7write-q3','a12u7write-q5','a21u0write-q5','a21u1write-q5','a21u3write-q5','a21u4write-q4','a21u6write-q2','a21u6write-q5','a21u7write-q2','a21u7write-q3','a21u7write-q4','a21u7write-q5']);
 for(const l of C.lessons.filter(l=>!/^b/.test(l.id)&&/write$/.test(l.id)))for(const q of l.questions){
  // Early prompts name a fixed role/number/object. Later connected tasks allow rephrasing.
  const guided=q.type==='text'&&q.language==='es'&&(communicative.has(q.id)||(l.stage==='A2.2'&&q.answer.split(/[.!?]/).filter(x=>x.trim()).length>=2)||(l.stage==='A2.1'&&q.answer.includes('porque')&&q.answer.length>65));
  q.writing={mode:guided?'guided':'controlled',stage:l.stage,unit:l.unit,multiline:guided,maxLength:guided?1500:160,requirements:[]};
  audit.push({stage:l.stage,activity:l.id,question:q.id,objective:l.goal,mode:q.writing.mode,diagnostics:'Authored variants; conservative learner rules; contextual morphology; model comparison',change:'Assessment metadata only; prompts, models, variants and IDs retained',rationale:guided?'Connected communicative task: valid rephrasing must not be failed.':'Named role/details or narrow retrieval target allows controlled grading.'});
 }
 return audit;
}
root.WritingAudit={apply};if(typeof module!=='undefined')module.exports=root.WritingAudit;
})(typeof window==='undefined'?globalThis:window);
