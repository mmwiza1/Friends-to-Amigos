'use strict';
// Developer-only inverse for three canonical glossary corrections. Never a save migration.
const assert=require('node:assert/strict'),crypto=require('node:crypto'),rows=require('../../docs/release/v19-editorial-corrections.json').corrections;
function beforeReading(id,reading){if(!reading)return reading;const row=rows.find(r=>r.activity===id||r.title===reading.title);if(!row)return reading;assert.equal(crypto.createHash('sha256').update(reading.text).digest('hex'),row.passageSHA256,'Unapproved foundations passage: '+id);if(JSON.stringify(reading.glossary)===JSON.stringify(row.before))return reading;assert.deepEqual(reading.glossary,row.after,'Unapproved foundations glossary: '+id);return {...reading,glossary:JSON.parse(JSON.stringify(row.before))};}
function beforeFoundations(item){const reading=beforeReading(item.id,item.reading),questions=item.questions.map(q=>q.reading?{...q,reading:beforeReading(item.id,q.reading)}:q);if(reading===item.reading&&questions.every((q,i)=>q===item.questions[i]||q.reading===item.questions[i].reading))return item;return {...item,...(item.reading?{reading}:{}),questions};}
module.exports={beforeReading,beforeFoundations};
