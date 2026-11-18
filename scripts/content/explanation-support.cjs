'use strict';
// Developer-only inverse for the v1.11 explanation corrections. Never loaded by the app or a
// save migration: historical attempts keep their own snapshots. Only an item whose explanation
// exactly matches the approved "after" text is restored; anything else is rejected.
const assert = require('node:assert/strict');
const manifest = require('../../docs/release/v111-explanation-corrections.json');
const course = new Map(manifest.course.map(row => [row.id, row]));
const focused = new Map(manifest.focused.map(row => [row.id, row]));
function restore(q, row) {
  if (!row || q.explanation === row.before) return q;
  assert.equal(q.explanation, row.after, 'Unapproved v1.11 explanation edit: ' + q.id);
  return { ...q, explanation: row.before };
}
function beforeExplanations(item, kind = 'course') {
  if (kind === 'focused') return restore(item, focused.get(item.id));
  if (!item?.questions) return item;
  const questions = item.questions.map(q => restore(q, course.get(q.id)));
  return questions.every((q, i) => q === item.questions[i]) ? item : { ...item, questions };
}
module.exports = { beforeExplanations, manifest };
