# Verification and release gates

Revision: A1 stability update, app 0.3.0 (Android version code 3). Baseline was latest main `94612c7920fbe25426388bd4b54c9b36f6edbb7d`, inspected before implementation.

## Performed checks

| Check | Baseline | Final |
| --- | --- | --- |
| Individual automated tests | 54 passed (29 engine/data, 25 app) | **116 passed**, 0 failed/skipped |
| Breakdown | Engine 29; app 25 | Engine 29; app 39; identity 14; storage 26; speech 8 |
| Complete `npm test` | Passed, 2 passing test-file groups in this workspace | Passed, 5 passing test-file groups here |
| JavaScript syntax | Existing sources passed | All 19 JS/CJS files passed `node --check`; `npm run check` also parses sources/tests/scripts |
| Playable activities | 144 | 144, every activity rendered, answered, completed and retried in simulated DOM |
| Course question slots | 784 | 832, every question rendered/completed; checked active snapshots validated/export-round-tripped |
| Authored question identity | Prompt-keyed review | 871 unique permanent IDs, including 39 special/placement questions |
| Curriculum validation | Existing tests | Protected activity/question manifests, required fields, exactly one choice answer, accepted variants, misconception conflicts, no later-stage lessons |
| A1.1/A1.2 compatibility | Existing fixtures passed | IDs/order preserved; old source archive hash retained; v1 fixtures, historical two-question/story/writing snapshots and both export paths passed |
| Listening/speaking | Answer/story TTS only | All 48 transcripts hidden before attempt/revealed afterwards; both speech paths, skip/replay/review, self-assessment/reveal/resume and scheduling passed |
| Completion/checkpoints | Existing 80%/dedup logic | All 16 checkpoints tested at 7/9 fail and 8/9 pass; capability/dedup and A1 completion/practice tested |
| Content review | Existing A1 course | All 64 passages/comprehension, teaching/writing sequences, 16 checkpoints and new media reviewed; recycling report generated |

These are individual `node:test` cases. The workspace's test wrapper summarises file groups, so direct file runs were also used to verify the full count. No existing test was deleted. Schema/modality assertions were adjusted to preserve their behavioural guarantee; the original source hash now checks the pre-amendment archive because intentional current curriculum corrections are separately validated.

Commands:

```sh
npm run check
npm test
npm run audit
node tests/engine.test.cjs
node tests/app.test.cjs
node tests/identity.test.cjs
node tests/storage.test.cjs
node tests/speech.test.cjs
```

The recycling output is saved in [docs/a1-vocabulary.json](docs/a1-vocabulary.json); methodology and pedagogical interpretation are in [the A1 audit](docs/A1_STABILITY_REPORT.md).

## Android status

The workspace has OpenJDK 21, but Gradle, Android SDK, adb and an emulator/device are unavailable. **No Android compilation, Gradle lint/unit-test run, emulator session, acoustic test or physical-device validation was performed for this revision.** Existing APKs do not contain these changes. Simulated bridge tests exercise JavaScript calls/exports, not Android Java compilation or JNI/WebView behaviour.

The Java wrapper was reviewed and updated for installed local es-ES voice selection, readiness, authored speech rates, stop/background cancellation and a single hardware-back action. No microphone/internet permission was added. Version code advances to support the app update.

The manual GitHub workflow is configured to run `assembleDebug lintDebug testDebugUnitTest` after static checks/tests, then upload the APK. Push/PR CI performs JavaScript checks only; the native job remains manual. A configured job is not evidence that it ran.

## Physical-device checklist

Before testing, export and verify the existing learner backup. Use the same signing key/application ID for an in-place upgrade. Fresh CI debug signing keys can differ from an installed build; do not uninstall a learner's app without a verified export. The manifest disables automatic Android backup, so exports matter.

- [ ] Run the manual workflow or local `gradle -p android assembleDebug lintDebug testDebugUnitTest`; record compiler/lint/test results.
- [ ] Install/update with the maintained signing key. Confirm a genuine v1 learner retains name, stage, completion, capabilities, reviews, streak and time.
- [ ] Launch in airplane mode using a current Android System WebView. Switch A1.1/A1.2; confirm later stages cannot start.
- [ ] Complete a regular lesson, story, writing activity and checkpoint. Verify glossary/rereading and 80% threshold.
- [ ] Install/select an offline Spanish (Spain) voice; test early/later listening rate, replay and transcript hiding/reveal.
- [ ] Test missing voice/data, delayed TTS initialisation and explicit skip. Confirm the item remains reviewable without trapping navigation.
- [ ] Attempt speaking aloud, reveal/hear model and mark both assessments. Confirm there is no recording/scoring claim; Needs practice appears in review.
- [ ] Leave/relaunch during story reading, typed input, unanswered listening and revealed/checked speaking. Confirm original questions, selected answers and reveal state resume.
- [ ] Press hardware Back while speech/feedback audio plays; background/foreground the app. Confirm it stops and saves without advancing or restarting the question.
- [ ] Export through Android's document picker; import v1/v2 through the WebView file chooser. Cancel each picker/confirmation. Reject corrupt/future files without overwriting progress.
- [ ] Verify scheduling/immediate retry, repeated checkpoint completion, streak/time, completion Home statistics and outstanding review count.
- [ ] With a completed-course fixture, verify continued listening/speaking practice and the A1 milestone wording; no A2 launch or CEFR certificate.
- [ ] Check keyboard/input, TalkBack labels, large text, focus and portrait layout.

## Release recommendation

Freeze the reviewed activity/identity contracts as an **A1 v1.0 release candidate**, with no A2 content added. Do not label it an unconditional stable release until native build/device upgrade/TTS/import checks and a focused native-speaker/educator review are signed off. The implementation is technically prepared for A2.1, but expanding now would outrun those release gates.

Known limits: finite accepted answers can reject valid paraphrases; listening remains synthetic with platform voice dependence; speaking is self-assessed; wider A1 conversation/contact/calendar coverage is not certified; progress is device-local. Curated human recordings, broader free-form grading before B1 and maintained release signing remain separate future work.
