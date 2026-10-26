'use strict';
// Test/developer contract inverse only. Never loaded by the app or save migration.
const {isDeepStrictEqual}=require('node:util'),assert=require('node:assert/strict'),manifest=require('../../docs/release/v15-content-changes.json'),episodes=require('../../www/story-editions');
function beforeExperience(item,kind='course'){
 if(kind==='focused'){const row=manifest.focused?.find(r=>r.id===item.id);if(!row)return item;assert.deepEqual(item,row.after,'Unapproved focused distractor edit');return JSON.parse(JSON.stringify(row.before));}if(kind!=='course')return item;
 const copy=JSON.parse(JSON.stringify(item));
 for(const reading of [copy.reading,...(copy.questions||[]).map(q=>q.reading)].filter(Boolean))if(reading.episode){assert.deepEqual(reading.episode,episodes.catalogue[item.id],'Unapproved story metadata: '+item.id);delete reading.episode;}
 const record=manifest.changes.find(r=>r.id===copy.id);if(!record)return copy;
 if(isDeepStrictEqual(copy,record.before))return copy;assert.deepEqual(copy,record.after,'Unapproved v1.5 content edit: '+copy.id);return JSON.parse(JSON.stringify(record.before));
}
module.exports={beforeExperience,manifest};
