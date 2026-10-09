'use strict';
const assert=require('node:assert/strict');
const manifest=require('../../docs/release/dictionary-content-corrections.json');
// Historical fixtures stay immutable. Reconstruct only the explicitly requested
// edits, checking their new value first, before comparing to those fixtures.
function beforeRequestedCorrections(item,kind='course'){
 const copy=JSON.parse(JSON.stringify(item));
 if(kind==='course')for(const record of manifest.course){const q=copy.questions?.find(q=>q.id===record.id);if(!q)continue;for(const change of record.changes){assert.deepEqual(q[change.field],change.after,record.id+' approved '+change.field);q[change.field]=JSON.parse(JSON.stringify(change.before));}}
 if(kind==='games'){const record=manifest.games.find(q=>q.id===copy.id);if(record){for(const change of record.changes||[{field:'sentence',before:record.before,after:record.after}]){assert.deepEqual(copy[change.field],change.after,record.id+' approved '+change.field);copy[change.field]=JSON.parse(JSON.stringify(change.before));}}}
 return copy;
}
function beforeRequestedSourceCorrections(file,source){
 for(const record of manifest.sourceCorrections||[])if(record.file===file)for(const change of record.changes){
  assert.equal(source.split(change.after).length-1,1,file+' approved source correction');
  source=source.replace(change.after,change.before);
 }
 return source;
}
module.exports={beforeRequestedCorrections,beforeRequestedSourceCorrections,manifest};
