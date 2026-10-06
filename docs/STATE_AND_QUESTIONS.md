# State, question and media contracts

## Schema and discovery

`ProgressStore.VERSION` is 2. `ProgressStore.KEY` remains `friends-to-amigos-v1` so installed learners' data is found. Exported JSON includes the version. The new app reads v1/v2; older apps need not understand v2. Never downgrade a migrated install without exporting and preserving its original v1 backup.

Top-level fields remain name, onboarded, stage, placement, completed, capabilities, reviews, events, sessions and active. `recovery` adds preserved unusable local sections. Dates use real local-calendar YYYY-MM-DD keys; epoch timestamps are finite nonnegative milliseconds through 2100. Session seconds are bounded to one day; counters are finite nonnegative values.

## Migration

`migrateState(raw, Curriculum, options)` returns `{state, warnings, migrated}` and does not mutate input. `parse` handles JSON/size errors; `load` protects unreadable data; `save` handles storage failures. Migration runs on local loads and imports, is deterministic and deeply idempotent, and never regenerates an active lesson from current content.

1. Verify a supported root/version. Import requires essential arrays/maps.
2. Whitelist valid profile/stage/placement fields. Default optional malformed fields.
3. Deduplicate completed IDs, capabilities and lesson-completion events. Preserve valid unknown historical activity IDs, rather than deleting old achievements.
4. Preserve valid sessions, answer/correction events and historical learning time. Invalid dates/counters cannot poison statistics.
5. Validate each review snapshot. Resolve exact legacy signatures against an indexed pre-amendment archive, including intentional checkpoint/source aliases. Map to a canonical ID only if it is unambiguous and the current type/model answer still matches. A changed teaching target must not clear the old review.
6. Preserve unmatched/replaced reviews under deterministic `legacy-…` identities. Preserve both snapshots if claimed IDs collide. Retain wrong/success counters, due dates and corrected status.
7. Validate the active snapshot as a whole: questions, position, answer alignment, selected value, checked result, lesson/passage and modality flags. Never drop one question and shift answers. Historical two-question attempts remain two questions.
8. Quarantine unusable local records in `recovery`, preserving valid sections. Unsafe imported questions/attempts reject before adoption. Missing optional passage glossaries default to an empty list without changing the passage.

Before the first successful local v1→v2 write, save the original JSON at `friends-to-amigos-v1-backup-v1` once. Unsupported versions or malformed root JSON run in explicit temporary/read-only mode; the original file remains exportable untouched. Storage read/write/quota errors produce a learner message. Reset/valid import require the existing explicit confirmation. The UI validates an import before that confirmation, then clears stale in-memory quiz state.

Recovery data is exported but never interpreted or rendered as executable content. It is for maintainer-assisted recovery, not a promise that corrupt data can be played. Unknown runtime fields are discarded. Backup/recovery data may contain the learner's own records; keep exports private.

## Permanent question identity

`question-ids.js` contains an explicit permanent manifest for the original authored slots. Assembly assigns these names once before reviewed amendments; `a1-practice.js` explicitly names additional media slots. Examples: `u0story0-q2`, `a12u2check-q3`, `u0l1-listen1`, `a12u2l2-speak1`, `placement-q1`, `numbers-q1`, `time-q1`.

There are 871 unique authored IDs: 832 course slots and 39 special-practice/placement questions. Activity IDs and intentional A1.1/A1.2 ordering are unchanged. Checkpoint slots have their own ID even when their content initially shares a source. `sourceQuestionId` is migration provenance, not the primary runtime review key.

`Engine.reviewKey` uses `question.id`. Prompt text is presentation. Historical unidentified content alone uses a deterministic signature/hash fallback. Reviews are snapshots with the assigned ID; retries/scheduled successes continue using that identity. A wording edit cannot create another review or overwrite an unfinished historical snapshot.

Authoring rules:

- Keep an ID when revising wording/accepted variants for the same teaching target.
- Give a new teaching item a new unused ID; do not reuse retired IDs for unrelated future content.
- IDs were first introduced in this update; old id-less replaced targets migrate to independent legacy IDs. After release, never reuse an existing ID for a different target.
- When deliberately reordering authored source slots, move the permanent manifest entries with their questions. Never generate IDs from current prompt text or runtime shuffled position.
- Extend the explicit manifest and protected fixtures deliberately when adding content. Do not renumber existing IDs.
- Preserve historical snapshots and the migration reference/archive policy. This update captures the original source before amendments so exact old signatures remain identifiable; if a future source edit removes a reference, unmatched snapshots still remain usable under legacy IDs.

`tests/fixtures/a1-activity-ids.json` and `question-ids.json` protect these contracts. The older A1.1 source hash still protects the pre-amendment compatibility archive; current playable changes are separately tested.

## Question/media model

Choice, gap and finite text types remain supported. Listening wraps a choice/text question:

```js
{
  id: 'a12u1l2-listen1', type: 'choice', mode: 'listening',
  prompt: 'Which alternative day is suggested?',
  answer: 'Saturday', options: ['Saturday', 'Tomorrow', 'Monday'],
  explanation: 'Tomorrow is refused; Saturday is proposed.', topic: 'Invitations',
  listening: { transcript: 'Lo siento, mañana no puedo. ¿Qué tal el sábado?', lang: 'es-ES', rate: .95 }
}
```

The transcript is absent from the initial DOM. Verified playback start unlocks answering; an unavailable/error result permits only retry/explicit skip, not guessing for credit; submit/check or explicit skip reveals it. Replay remains available. Skip records a missed scored slot (`answers` entry null, answer event `skipped: true`) and queues review. A later review hides the transcript afresh.

Future `listening.audio: 'audio/learning/a1/example.mp3'` may reference a curated local recording. Validation disallows remote paths; failed recording playback falls back to TTS. There are no such shipped recordings. Exact-item provenance/sidecars remain mandatory before third-party files are added.

Speaking uses `type: 'speaking'`, `mode: 'speaking'`, a communicative prompt, `answer`/`spanish` model and explanation. The learner reveals the model, optionally plays it, and explicitly self-assesses `got`/`needs`. The model is one possible response; a different natural equivalent can be self-assessed successfully. Needs-practice records a speaking review. Events identify `selfAssessed: true`; speaking is excluded from scored totals/checkpoint evidence. Zero scored evidence cannot earn completion/capabilities. No microphone, recognition, recording or pronunciation score exists.

Active snapshots preserve `readingReady`, `modelRevealed`, `audioPlayed` and `audioUnavailable`. `audioPlayed` means the native/browser/recording path acknowledged playback start, not acoustic verification that the learner heard it. Failed initial playback keeps answering locked and permits skip/retry.

## Module responsibilities

| Module | Responsibility |
| --- | --- |
| `curriculum.js`, `a12.js`, story modules | Original stage data and shared stage/unit metadata |
| `question-ids.js` | Permanent IDs, pre-amendment legacy references |
| `a1-review.js` | Small justified curriculum/checkpoint corrections |
| `a1-practice.js` | Authored listening and speaking integration |
| `engine.js` | Finite grading, feedback lookup, review schedules, streak/completion logic |
| `learner-clarity.js` | Presentation-only prompt and authored misconception amendments after legacy archiving |
| `answer-feedback.js` | Bounded word comparison against authored models; never changes grading |
| `viewport.js` | Native inset CSS bridge, browser visual viewport, focus/keyboard layout |
| `storage.js` | Versioned migration, validation, sanitisation and guarded writes |
| `speech.js` | Native/browser TTS, future local clips, feedback audio, cancellation |
| `screens.js` | Home/Learn/Review/Profile/onboarding/placement/completion rendering |
| `quiz-view.js` | Reading gate, text/choice/gap/listening/speaking rendering |
| `app.js` | Actions, live state/navigation, sessions, import/export orchestration |

Modules use local scripts and small vanilla globals/CommonJS test exports. No runtime dependencies or framework were added. Rendering receives live state getters so import/reset cannot leave stale screen state. The Android bridge retains `speak`, adds readiness/stop/rate support, chooses an installed non-network es-ES voice, and explicitly pauses/resumes WebView timers/learning-time tracking on backgrounding through fta-pause/fta-resume events. Background time is excluded. The browser requires a suitable non-remote voice and can ask for retry while voices initialise.

Known identified story and listening snapshots must retain their reading/audio context. Corrupted snapshots are quarantined on local recovery and rejected on import rather than silently becoming ordinary questions.

## Mobile update: optional v2 starting path

`startStage` is a playable starting stage, separate from the recommended/viewed stage. Choosing placement persists it; A1.2 means assumed earlier foundations, with no synthetic completions/events/capabilities. For an old save without the field, a saved accepted A1.2 stage plus placement result infers A1.2, including learners who revised earlier lessons. Other legacy saves use A1.1. Invalid values are defaulted conservatively. Explicit valid values survive manual revision and import/export. The schema version, discovery key, IDs and old snapshots remain unchanged.

`CoursePath` supplies required lessons, next lesson, completion and Today’s first step. Today queues are transient orchestration over existing quizzes, not another persisted history. Listening speed/loading are transient too; persisted `audioPlayed` records a successful start. A pending request never persists success, and cancelled/stale callbacks cannot unlock a different question.

Native Back delegates to `window.FriendsToAmigos.handleBack()`. Only a literal `true` consumes Back; Home returns false so Android backgrounds the task. Listening uses request IDs and native `UtteranceProgressListener.onStart`, browser utterance `onstart`, or the recording play promise/playing event. Missing/error/timeout/cancel results cannot unlock initial answers.

## Galaxy S24 polish: no schema change

The 0.5.0 clarity/mobile pass retains schema v2, the existing discovery key, migrations, startStage, all stable IDs, answer targets and progress structures. New feedback is rendered from the current question snapshot without mutating it. Old reviews and active lessons therefore retain their original authored explanations; deterministic comparison still works on those snapshots. Go/Enter delegates to the existing check action, with empty/locked/checked/composing/repeat guards.

`window.FriendsToAmigosInsets(top,bottom,left,right,keyboardOpen,keyboardOverlap)` receives CSS pixels computed from actual Android system bars, cutouts and WebView scale. Native WebView padding is zero; CSS is the single safe-area owner. IME overlap excludes space already removed by resize. Browser visualViewport supplies an overlay fallback. Focus/native keyboard temporarily hide fixed app navigation and preserve scrollable controls. These values are transient and never exported. The native Back and speech bridges are unchanged.


## Optional schema-v2 game records

`games` is absent from older saves and created on first play. It contains `recent` (last 30 shown question IDs), `questions` and `concepts` (attempt/correct/streak/lastSeen counters), `bests` (personal bests retained beyond the recent-round window), `rounds` (last 40 scored rounds, difficulty/mode/mistakes/incorrect verb-person targets/current-round observations) and `active` (snapshot of selected/shuffled authored questions, position, choices, checked feedback and results). It never reuses course `active`, review IDs or completion records. There is no schema bump or discovery-key change.

Game IDs use the permanent `conj-a11-001` / `conj-a12-001` namespaces, protected by `conjugations-ids.json`. Explicit authored numbers remain stable across runtime randomisation. Each blank has its own options, answer, person, grammar concept, explanation and distractor explanations; prerequisite activity IDs link it to the main course.

Imports validate targets, IDs, unique options, result/selection agreement, bounded counters/timestamps and active shape before adoption. Stored sentence/explanation wording and shuffled options remain snapshots; targets must still belong to the known bank. Unsafe game attempts reject an import; a damaged local attempt is quarantined in recovery without discarding course progress. Optional malformed summary fields default safely. Missing game fields leave old v1/v2 saves usable. Whole-state export includes games on both browser and Android paths.

`games.js` is pure for eligibility/selection and mutates only its optional namespace for checking/advancing. `app.js` alone marks a completed practice day/counts active time through existing engine/session mechanisms. No course answer events, reviews, achievements or placement are manufactured. Native Back delegates to web state as before; games save before returning to the Games tab.
