(function(root){
'use strict';
// Live authored amendments only. Never applied by storage or to historical attempts.
const oldQuestions=new WeakMap(),oldReadings=new WeakMap(),externalChanges=new Map();
const edits=[
 ['Antes tu casa era en Toledo; ahora, Madrid. Escribe dos frases.','Antes vivías en Toledo; ahora vives en Madrid. Escribe dos frases.'],
 ['Hemos comido en el café de Diego después','Después hemos comido en el café de Diego'],
 ['¿Una película de música?','¿Una película sobre música?'],
 ['pero hoy prefiero el cine también.','pero hoy también prefiero el cine.'],
 ['Ana llegó tarde al parque y Luis preguntó si venía andando.','Ana llegó tarde al parque y Luis le preguntó si había venido a pie.'],
 ['llegaron al cine antes de empezar la película','llegaron al cine antes de que empezara la película'],
 ['___ al cine antes de empezar la película','___ al cine antes de que empezara la película'],
 ['no sé si responde a todos','no sé si responde a las necesidades de todos'],
 ['no sabes si responde a todos','no sabes si responde a las necesidades de todos'],
 ['Una experiencia positiva no implica necesariamente que funcione para todos.','Que una persona tenga una experiencia positiva no implica necesariamente que el método funcione para todos.'],
 ['Una experiencia positiva no implico necesariamente que funcione para todos.','Que una persona tenga una experiencia positiva no implico necesariamente que el método funcione para todos.'],
 ['Una experiencia positiva no implican necesariamente que funcione para todos.','Que una persona tenga una experiencia positiva no implican necesariamente que el método funcione para todos.'],
 ['A positive experience does not necessarily mean it works for everyone.','One person’s positive experience does not necessarily mean the method works for everyone.']
];
function polish(value){if(typeof value==='string')return edits.reduce((s,[a,b])=>s.split(a).join(b),value);if(Array.isArray(value))return value.map(polish);if(value&&typeof value==='object'){const result=Object.fromEntries(Object.entries(value).map(([k,v])=>[k,polish(v)]));if(result.text?.includes('si había venido a pie')&&Array.isArray(result.glossary)&&!result.glossary.some(x=>x[0]==='había venido a pie'))result.glossary.push(['había venido a pie','had come on foot']);return result;}return value;}
const examples={
 u1l0:[['¿De dónde eres?','Where are you from?'],['Soy de Inglaterra.','I am from England.'],['Vivo en Madrid.','I live in Madrid.']],
 u2l0:[['¿Qué quieres tomar?','What would you like to drink?'],['Un café, por favor.','A coffee, please.'],['Un café con leche, por favor.','A coffee with milk, please.'],['Un té.','A tea.']],
 u3l0:[['¿Cuánto cuesta?','How much is it?'],['Son dos euros.','It is two euros.'],['¿Cuánto cuesta?','How much is it?']],
 u4l0:[['Esta es mi hermana.','This is my sister.'],['Esta es mi hermana.','This is my sister.'],['Este es mi hermano.','This is my brother.'],['Mis padres.','My parents.']],
 u5l0:[['Mi móvil está aquí.','My mobile phone is here.'],['Es un libro rojo.','It is a red book.'],['Un libro rojo.','A red book.'],['Una carpeta.','A folder.']],
 u6l0:[['¿Dónde está la estación?','Where is the station?'],['¿Dónde está la farmacia?','Where is the pharmacy?'],['¿Dónde está la estación?','Where is the station?'],['La farmacia está cerca.','The pharmacy is nearby.']],
 u7l0:[['Es la una.','It is one o’clock.'],['Son las dos.','It is two o’clock.'],['Es la una.','It is one o’clock.'],['Son las dos y media.','It is half past two.']]
};
const glossaryEdits={u0story2:['más','de nada','you’re welcome'],u2story3:['juntos','la cuenta','the bill'],u3story3:['suficiente','libreta','notebook'],u4story0:['viene','entra','comes in'],u5story0:['¿cuál?','en clase','in class'],u7story3:['un cambio','nos vemos','see you']};
function apply(C){if(C.consolidationAudit)return;const changes=[],targets=new Set([...Object.keys(examples),...Object.keys(glossaryEdits),'a12u0story2','a21u0story1','a22u0write','b11u0story0','b22u0l0','b22u0l2','b22u0check']);for(const l of C.lessons){if(!targets.has(l.id))continue;const readingBefore=l.reading;if(l.reading){const next=polish(l.reading),edit=glossaryEdits[l.id];if(edit)next.glossary=next.glossary.map(pair=>pair[0]===edit[0]?[edit[1],edit[2]]:pair);if(JSON.stringify(next)!==JSON.stringify(l.reading)){oldReadings.set(next,l.reading);l.reading=next;}}
 l.questions=l.questions.map((q,i)=>{const next=polish(q),model=examples[l.id]?.[i];if(q.reading&&q.reading.text===readingBefore?.text)next.reading=l.reading;if(model&&!q.listening&&q.type!=='speaking')next.teachingModel={spanish:model[0],meaning:model[1]};if(JSON.stringify(next)===JSON.stringify(q))return q;oldQuestions.set(next,q);changes.push({id:q.id,activity:l.id,stage:l.stage,before:q,after:next});return next;});}
 const byId=new Map(C.lessons.flatMap(l=>l.questions.map(q=>[q.id,q])));for(const key of ['listeningPractice','speakingPractice'])C[key]=C[key].map(q=>byId.get(q.id)||q);C.consolidationAudit=changes;}
function polishExternal(q){const next=polish(q);if(JSON.stringify(next)!==JSON.stringify(q)){externalChanges.set(q.id,{before:q,after:next});return next;}return q;}
function externalPrior(q){const row=externalChanges.get(q.id);if(!row)return q;if(JSON.stringify(q)===JSON.stringify(row.before))return q;if(JSON.stringify(q)!==JSON.stringify(row.after))throw Error('Unapproved consolidation external edit: '+q.id);return row.before;}
function prior(q){return oldQuestions.get(q)||q;}
function readingPrior(r){return oldReadings.get(r)||r;}
root.Consolidation={apply,prior,readingPrior,polish,polishExternal,externalPrior,edits,examples,glossaryEdits};if(typeof module!=='undefined')module.exports=root.Consolidation;
})(typeof window==='undefined'?globalThis:window);
