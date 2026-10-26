'use strict';
const assert=require('node:assert/strict');
const manifest=require('../../docs/release/dictionary-content-corrections.json');
const learnerExperienceManifest=require('../../docs/release/learner-experience-content-corrections.json');
const clone=value=>JSON.parse(JSON.stringify(value));
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object,key);
// Historical fixtures stay immutable. Check the approved new field values and
// their presence before reversing only the explicitly requested release edits.
function reverseFields(target,changes,label,beforeKeys,afterKeys){
 if(afterKeys)assert.deepEqual(Object.keys(target),afterKeys,label+' approved key order');
 for(const change of changes){
  const afterPresent=change.afterPresent!==false,beforePresent=change.beforePresent!==false;
  assert.equal(own(target,change.field),afterPresent,label+' approved '+change.field+' presence');
  if(afterPresent)assert.deepEqual(target[change.field],change.after,label+' approved '+change.field);
  if(beforePresent)target[change.field]=clone(change.before);else delete target[change.field];
 }
 if(beforeKeys){
  assert.deepEqual(Object.keys(target).sort(),[...beforeKeys].sort(),label+' restored keys');
  const ordered=Object.fromEntries(beforeKeys.map(key=>[key,target[key]]));for(const key of Object.keys(target))delete target[key];Object.assign(target,ordered);
 }
}
function beforeLearnerExperienceCorrections(item,kind='course'){
 const policy=require('../../www/assessment-policy');const authored=kind==='course'&&item.questions?{...item,questions:item.questions.map(policy.prior)}:item;const source=require('../../scripts/content/quality-support.cjs').beforeQualitySupport(require('../../scripts/content/experience-support.cjs').beforeExperience(authored,kind),kind);const copy=clone(source);
 if(kind==='tables'&&copy.id==='table-a12-comer-present'){assert.equal(copy.consolidationSource,'a12u7l2');delete copy.consolidationSource;assert.equal(copy.stage,'A1.1');assert.equal(copy.unit,2);assert.equal(copy.source,'u2l1');assert.deepEqual(copy.requiredActivities,['u2l1','u1l2']);copy.stage='A1.2';copy.unit=7;copy.source='a12u7l2';copy.requiredActivities=['a12u7l2'];}
 if(kind==='course'){
  for(const record of learnerExperienceManifest.course||[]){const q=copy.questions?.find(q=>q.id===record.id);if(q)reverseFields(q,record.changes,record.id,record.beforeKeys,record.afterKeys);}
  for(const record of learnerExperienceManifest.activityChanges||[])if(copy.id===record.id)reverseFields(copy,record.changes,record.id,record.beforeKeys,record.afterKeys);
 }
 return copy;
}
function beforeRequestedCorrections(item,kind='course'){
 const copy=beforeLearnerExperienceCorrections(item,kind);
 if(kind==='course')for(const record of manifest.course){const q=copy.questions?.find(q=>q.id===record.id);if(q)reverseFields(q,record.changes,record.id);}

 if(kind==='games'){const record=manifest.games.find(q=>q.id===copy.id);if(record)reverseFields(copy,record.changes||[{field:'sentence',before:record.before,after:record.after}],record.id);}
 return copy;
}
function beforeRequestedSourceCorrections(file,source){
 const relative=file.replace(/^www\//,'');
 for(const release of [learnerExperienceManifest,manifest])for(const record of release.sourceCorrections||[])if(record.file.replace(/^www\//,'')===relative)for(const change of record.changes){
  assert.equal(source.split(change.after).length-1,1,file+' approved source correction');
  source=source.replace(change.after,change.before);
 }
 return source;
}
module.exports={beforeRequestedCorrections,beforeLearnerExperienceCorrections,beforeRequestedSourceCorrections,manifest,learnerExperienceManifest};
