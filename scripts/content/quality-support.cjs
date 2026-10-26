'use strict';
// Explicit inverse for historical audits only. Never used when loading learner saves.
const assert=require('node:assert/strict'),manifest=require('../../docs/release/v14-content-support.json');
function beforeQualitySupport(item,kind='course'){if(kind!=='course')return item;const row=manifest.changes.find(r=>r.activity===item.id);if(!row)return item;const copy=JSON.parse(JSON.stringify(item));for(const reading of [copy.reading,...copy.questions.map(q=>q.reading)].filter(Boolean)){assert.equal(reading.text,row.text,'Unapproved story-text edit');assert.deepEqual(reading.glossary,row.after,'Unapproved glossary edit');reading.glossary=JSON.parse(JSON.stringify(row.before));}return copy;}
module.exports={beforeQualitySupport,manifest};
