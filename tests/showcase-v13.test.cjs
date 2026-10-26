'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
test('README showcase uses 15 validated v1.7 PNGs and exactly the validated web assets',()=>{
 const root=path.join(__dirname,'..'),dir=path.join(root,'docs/screenshots'),manifest=require('../docs/screenshots/manifest.json'),readme=fs.readFileSync(path.join(root,'README.md'),'utf8'),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
 assert.equal(manifest.version,require('../package.json').version);assert.equal(manifest.screenshots.length,15);assert.equal(new Set(manifest.screenshots.map(x=>x.file)).size,15);assert.equal(manifest.validationRun,40415569843);assert.match(manifest.sourceCommit,/^[a-f0-9]{40}$/);
 for(const shot of manifest.screenshots){assert.match(shot.file,/^[a-z-]+\.png$/);const png=fs.readFileSync(path.join(dir,shot.file));assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');assert.ok(png.readUInt32BE(16)>=320&&png.readUInt32BE(20)>=600);assert.equal(hash(png),shot.sha256);assert.ok(readme.includes('docs/screenshots/'+shot.file));assert.ok(shot.caption);}
 const files=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(d,e.name)):[path.join(d,e.name)]),web=path.join(root,'www'),actual=Object.fromEntries(files(web).sort().map(p=>[path.relative(web,p).replaceAll(path.sep,'/'),hash(fs.readFileSync(p))]));assert.deepEqual(actual,manifest.webAssets,'showcase must be recaptured/reviewed after runtime changes');
});
