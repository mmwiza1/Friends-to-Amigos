'use strict';
// Explicit compatibility fixture: exercise v1.2 authored snapshots with the new
// runtime. Live v1.3 policy and every live activity are tested separately.
const C=require('../../www/curriculum'),Policy=require('../../www/assessment-policy');
const course={...C,numbers:C.numbers.map(Policy.prior),time:C.time.map(Policy.prior),lessons:C.lessons.map(l=>({...l,questions:l.questions.map(Policy.prior)})),listeningPractice:C.listeningPractice.map(Policy.prior),speakingPractice:C.speakingPractice.map(Policy.prior)};
delete course.assessmentChanges;
module.exports=course;
