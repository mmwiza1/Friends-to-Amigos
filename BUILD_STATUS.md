# Verification and release gates

Spanish-first / level-based grammar release **0.9.0**, Android version code **9**.
Baseline reviewed: main `ec15c4cbfd991aae3798c6d9547c50c3e67776ce` (0.8.0).

## Baseline and local checks

- Baseline static checks and complete suite rerun before editing: 351 individual JavaScript tests, 13 files, zero failures/skips. Previous CI baseline: 2,189 browser assertions, 11 Android unit cases, lint zero errors / 12 warnings.
- Current static validation: 216 unchanged activities / 1,248 course slots / 1,287 permanent course/practice IDs; 272 sentence-game questions (208 preserved + 64 A2.1); 35 unchanged table targets; 336 unchanged focused-media items.
- Expanded JavaScript regression suite: 408 individual tests / 14 files. Original course payload hashes exclude only the four deliberately additive language fields; all original targets, accepted answers, passages, objectives, IDs and order stay protected. Original 208 game payloads and appended A2.1 game IDs have frozen fixtures.
- New coverage: Spanish-first display, hidden/revealed/resumed English support, hint-safe audio, assisted scoring/evidence, fresh game access at every level, recommendations, custom scopes, lower-ceiling history retention, and game-only Today/Weak Areas. All previous scoring, migration, review, mobile, placement and Today guarantees remain.

## Browser and Android validation boundary

Local browser launch was attempted and fails with sandbox `setsockopt: Operation not permitted` / ECONNRESET. Local Gradle validation was attempted, exit 127 (`gradle: command not found`); no SDK/adb/emulator/device is attached. The existing GitHub workflow validated source `8f95e1aec06fe08d0915eb5c2159239dfc07a27a` using Node 22, real Chromium and Gradle 8.9 / Java 17 / SDK 35: [successful run](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/37599458595). Documentation-only results recording follows that validated source.

Rendered checks retain the existing 11 phone/landscape/light/dark/keyboard/large-text layouts and add fresh game-only levels, custom past practice, level switching, saved higher attempts, Spanish prompts, hint reveal/resume, assisted answers and audio concealment. Native insets/keyboard and speech-start acknowledgements are simulated; this is not acoustic or physical S24 validation.

### Exact release results

| Validation | Result |
| --- | --- |
| `npm run check` | Passed syntax, curriculum structure and identity checks |
| `npm test` (Node 22 CI) | 408 individual tests passed; 0 failed, skipped or cancelled; 14 test files |
| `npm run check:browser` | 3,003 assertions passed in 11 layouts; 67 screenshots; no failed layouts |
| `assembleDebug` | Passed; debug APK artifact produced |
| `lintDebug` | Passed; 0 errors, 12 existing warnings |
| `testDebugUnitTest` | 11 passed; 0 failures, errors or skips across 3 native suites |

The 57 additional JavaScript cases preserve the original behavioural guarantees while explicitly replacing the old course-completion game gate with selected-level access. All 216 activities remain renderable/completable; original payload hashes, old question snapshots, v1/v2 import/export, review, Today, placement, Back and viewport tests pass. Four screenshot sets include Spanish-first tasks, English hints and concealed listening. Screenshots were visually reviewed at narrow-phone, S24 and large-text layouts. No emulator, physical-device, acoustic TTS or native-speaker validation was performed for this release.

## Physical release checklist

The previous APK was tested by the maintainer on a Galaxy S24. This update still requires an in-place physical retest. Export/verify a backup and preserve the signing key first; CI debug keys may differ from an installed APK.

- [ ] Update old v1/v2 progress: saved questions/passages, reviews/dates, placement path, streaks and capabilities survive; table/game saves remain independent.
- [ ] S24 button/gesture navigation, cutouts/landscape, light/dark and larger text: header, toasts, five tabs and final controls clear the system bars.
- [ ] Samsung keyboard Go checks course text once; table Go moves to the next missing cell or checks a complete table. Empty/repeated/composing Go is inert. Inputs/controls remain reachable above the IME.
- [ ] Both games work offline; Back saves to Games; relaunch and import resume the same shuffled/checked table without replacing a course attempt.
- [ ] Six-person rows and long compound forms remain readable. TalkBack identifies person + field/choice, selected forms and per-cell ✓/✗ feedback.
- [ ] Hints/guide are assisted; repeated one-session practice does not create spaced mastery. Normal games contain three tables; Practice offers 3/5/10/15/20.
- [ ] Weak Areas/Today’s Review use grammar up to the selected ceiling and eligible prior content and old mistake snapshots; practice never completes a lesson, checkpoint or skipped stage.
- [ ] A1.1 → A1.2 → A2.1 continuation; later placement never forces backwards. A1 milestone lists only actually practised capabilities. A2.2/B lessons remain unavailable.
- [ ] A2.1 recent/finished events, travel, accommodation and health units: story rereading, constrained writing, 80% checkpoints and non-duplicating capabilities.
- [ ] Offline es-ES voice, playback-start locking/fallback/skip, Slow/Normal, hidden/revealed transcript and self-assessed speaking.
- [ ] Android/browser export/import includes optional evidence/table data; bad imports preserve valid progress. Bull-face launcher remains unchanged.


Additional physical checks: ten-item media Save & leave/relaunch alongside a saved course lesson; repeated-session rotation; long A2.1 prompts/models; first-use versus compact information; Speaking Needs practice in review/Weak Areas; installed offline es-ES voice after background/foreground.

## Release limits

See [the amendment quality report](docs/SPANISH_FIRST_AND_GRAMMAR_LEVEL.md) for level access, Spanish instructions and hint evidence, and [the prior media report](docs/LISTENING_SPEAKING_QUALITY.md) for unchanged focused-media behaviour. Schema stays v2 with optional grammar-level/language/hint fields. No frameworks, cloud services, runtime dependencies, microphone, speech recognition, recordings, external corpora or LLM grading were added. A2.2 remains unavailable. Physical upgrade/accessibility/acoustic checks and native educator review remain required; this release does not establish CEFR certification.

- [ ] Fresh A1.2/A2.1 zero-completion profiles can play both games and Practice. Lower the ceiling, verify higher snapshots are kept, then raise and resume.
- [ ] Spanish-first A1.2/A2.1 instructions: English hidden, explicit hint, saved reveal, audio transcript separate, hinted checkpoint can pass. Repeated hint use leads to readable support practice without false mastery.
