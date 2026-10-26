'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
test('README showcase passes the permanent version, freshness, PNG and visual-review release gate',()=>{const result=require('../scripts/check-screenshots.cjs').validate();assert.equal(result.appVersion,require('../package.json').version);assert.ok(result.count>=10&&result.count<=15);});
