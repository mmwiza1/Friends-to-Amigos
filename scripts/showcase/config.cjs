'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const navigation=['Home','Learn','Practice','Review','Profile'];
// These contain algorithms/storage, not the public capture fixtures. Moving
// visible rendering/labels into one requires removing it from this exemption.
const internal=new Set(['engine.js','storage.js','mastery.js','learning-practice.js','learning-quality.js','games.js','blanks.js','practice-skills.js','practice-numbers.js','speech.js']);
const screens=[
 ['home.png','home','Continue Learning and Today','dark','[data-home-section=today]','Home'],
 ['learn.png','learn','Your current course position and next activity','light','.current-unit','Learn'],
 ['beginner.png','beginner','A supported first Spanish lesson','light','#check-answer',null],
 ['cloze.png','cloze','Build a connected message with contextual gaps','dark','#check-answer',null],
 ['sentence-building.png','tiles','Construct Spanish with supplied word tiles','light','#check-answer',null],
 ['dictionary.png','dictionary','Explore a Spanish word before selecting an answer','light','.dictionary-popup',null],
 ['story.png','story','A standalone reading episode with vocabulary support','light','[data-action=readStory]',null],
 ['feedback.png','feedback','Understand a mistake and compare natural Spanish','dark','[data-action=next]',null],
 ['games.png','practice','The Practice hub and optional activities','light','[data-practice-section=games]','Practice'],
 ['conjugations.png','context','Verb in Context with separate answers for each blank','dark','.game-choices',null],
 ['review.png','review','Due Today, Weak Areas and Past Mistakes','light','#app > details.card','Review'],
 ['profile.png','profile','Your level, streak and Vocabulary tools','dark','[data-profile-section=vocabulary]','Profile'],
 ['saved-words.png','saved','Your personal saved vocabulary','light',null,null],
 ['recommendations.png','content','Content for Your Level with editorial guidance','light',null,null],
 ['lesson-complete.png','completion','Continue directly to the next required activity','dark','.up-next',null]
].map(([filename,screen,description,theme,end,active])=>({filename,screen,description,theme,end,active}));
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
function inputs(root){return [...files(path.join(root,'www')).filter(f=>!internal.has(path.relative(path.join(root,'www'),f))),...['scripts/showcase/config.cjs','scripts/capture-showcase.cjs'].map(f=>path.join(root,f))].sort().map(f=>path.relative(root,f).replaceAll(path.sep,'/'));}
function fingerprint(root){const sources=Object.fromEntries(inputs(root).map(f=>[f,hash(fs.readFileSync(path.join(root,f)))]));return {algorithm:'sha256',sources,sha256:hash(JSON.stringify(sources))};}
function versions(root){const appVersion=JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version,g=fs.readFileSync(path.join(root,'android/app/build.gradle'),'utf8'),androidVersionCode=Number(g.match(/versionCode\s+(\d+)/)?.[1]);if(!androidVersionCode||g.match(/versionName\s+'([^']+)'/)?.[1]!==appVersion)throw Error('Package and Android release versions disagree.');return {appVersion,androidVersionCode};}
module.exports={navigation,screens,hash,inputs,fingerprint,versions,files};
