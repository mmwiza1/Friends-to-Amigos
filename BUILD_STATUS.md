# Verification and release gates

Focused Listening/Speaking quality release **0.8.0**, Android version code **8**.
Baseline reviewed: main `390e3eccbb06fb011bde186a5c98da6255d40523` (0.7.0).

## Baseline and current checks

- Baseline: 292 individual JavaScript tests; 850 browser assertions across ten layouts; Android 11 unit tests and lint 0 errors/12 existing warnings in the previous release. Baseline local full suite and syntax checks were rerun before edits.
- Current `npm run check`: passed, 216 activities / 1,248 course slots / 1,287 existing permanent course/practice IDs / unchanged 208 game questions / 336 separate focused-media items.
- Current `npm test`: 13 file suites passed locally. Individual expanded run: **351 passed, 0 failed, 0 skipped**, adding 59 regressions. All 216 course activities and all 336 focused items render/complete in simulated DOM tests. Stable manifests, original A1 payload hashes, targeted A2.1 hashes, v1/v2 saves, historical passages, independent attempts, review, Today, placement and both games are protected.
- Content banks: 56 Listening and 56 Speaking items per playable stage; all metadata, accepted answers/options, uniqueness and prerequisites validated. A dedicated Spanish/scope scan checked original new scenarios plus all 32 A2.1 stories/associated material. No native-speaker review is claimed.

## Browser and Android boundary

Local `npm run check:browser` was attempted and cannot launch Chromium: sandbox socket restrictions produce `setsockopt: Operation not permitted` / `ECONNRESET`.
Local `gradle -p android assembleDebug lintDebug testDebugUnitTest` was attempted, exit 127: Gradle is not installed. No attached SDK/adb/emulator/physical device is available.

The final code revision `20cb53e386e4b48aec4cfd61972eea39118a0a7d` passed the complete [validation run 37584766683](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/37584766683) using Node 22 and Gradle 8.9 / Java 17 / SDK 35:

- `npm run check`: passed.
- `npm test`: **351 passed, 0 failed, 0 skipped** (59 added regressions).
- `npm run check:browser`: **2,189 assertions passed, 0 failed**, across **11 layouts**, with **55 screenshots**. Original browser checks remain intact; an initial new fixture used a bilingual display answer instead of an accepted response and was corrected without changing scoring.
- `assembleDebug`: passed; version 0.8.0 / code 8 debug APK uploaded.
- `lintDebug`: passed, **0 errors / 12 existing warnings**. Reports retain existing API targeting, unused/obsolete attributes, WebView JavaScript, backup-rule and launcher-mask/monochrome warnings.
- `testDebugUnitTest`: **11 passed, 0 failures/errors/skips**, confirmed from XML reports (six inset, three native-policy and two launcher tests).

Reports and screenshots were downloaded and inspected. The final source revision also passed local `npm test` (13 file suites) and an individual run of all 351 cases. Documentation updates after validation only record these results.


Rendered coverage adds ten-item media sessions, first/compact instruction screens, delayed simulated speech start, transcript/model concealment/reveal, rates, Back/resume, completion, independent course progress and readable weakness. Eleven layouts include 320px, S24-class, larger/landscape, light/dark, larger text and simulated native/keyboard insets. TTS start is simulated: this cannot establish acoustic voice quality, physical Samsung IME behaviour or TalkBack.

## Physical release checklist

The previous APK was tested by the maintainer on a Galaxy S24. This update still requires an in-place physical retest. Export/verify a backup and preserve the signing key first; CI debug keys may differ from an installed APK.

- [ ] Update old v1/v2 progress: saved questions/passages, reviews/dates, placement path, streaks and capabilities survive; table/game saves remain independent.
- [ ] S24 button/gesture navigation, cutouts/landscape, light/dark and larger text: header, toasts, five tabs and final controls clear the system bars.
- [ ] Samsung keyboard Go checks course text once; table Go moves to the next missing cell or checks a complete table. Empty/repeated/composing Go is inert. Inputs/controls remain reachable above the IME.
- [ ] Both games work offline; Back saves to Games; relaunch and import resume the same shuffled/checked table without replacing a course attempt.
- [ ] Six-person rows and long compound forms remain readable. TalkBack identifies person + field/choice, selected forms and per-cell ✓/✗ feedback.
- [ ] Hints/guide are assisted; repeated one-session practice does not create spaced mastery. Normal games contain three tables; Practice offers 3/5/10/15/20.
- [ ] Weak Areas/Today’s Review use eligible prior content and old mistake snapshots; practice never completes a lesson, checkpoint or skipped stage.
- [ ] A1.1 → A1.2 → A2.1 continuation; later placement never forces backwards. A1 milestone lists only actually practised capabilities. A2.2/B lessons remain unavailable.
- [ ] A2.1 recent/finished events, travel, accommodation and health units: story rereading, constrained writing, 80% checkpoints and non-duplicating capabilities.
- [ ] Offline es-ES voice, playback-start locking/fallback/skip, Slow/Normal, hidden/revealed transcript and self-assessed speaking.
- [ ] Android/browser export/import includes optional evidence/table data; bad imports preserve valid progress. Bull-face launcher remains unchanged.


Additional physical checks: ten-item media Save & leave/relaunch alongside a saved course lesson; repeated-session rotation; long A2.1 prompts/models; first-use versus compact information; Speaking Needs practice in review/Weak Areas; installed offline es-ES voice after background/foreground.

## Release limits

See [the quality report](docs/LISTENING_SPEAKING_QUALITY.md) for exact course corrections and selection rules. Schema stays v2 with optional focused-media fields. No frameworks, cloud services, runtime dependencies, microphone, speech recognition, recordings, external corpora or LLM grading were added. A2.2 remains unavailable. Physical upgrade/accessibility/acoustic checks and native educator review remain required; this release does not establish CEFR certification.
