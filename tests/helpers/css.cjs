'use strict';
const fs=require('node:fs'),{parse,split}=require('../../scripts/lib/css.cjs');
function properties(file,selector,condition=r=>r.at.length===0){return Object.fromEntries(parse(fs.readFileSync(file,'utf8')).filter(r=>condition(r)&&split(r.selector,',').includes(selector)).flatMap(r=>r.declarations.map(d=>[d.property,d.value])));}
module.exports={properties};
