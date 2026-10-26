'use strict';
const app=require('./app.cjs');
module.exports=(extra={},initial=null)=>app({...extra,testLegacyCurriculum:true},initial);
