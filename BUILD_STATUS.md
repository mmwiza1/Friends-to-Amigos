# Verification and release gates

Connected practice / A2.1 update **0.7.0**, Android version code **7**.
Baseline reviewed: main `877dbcd9b0486b33b5e5c0e7aa218baa23c7e269` (0.6.0).

## Baseline and local checks

- Baseline `npm run check`: 144 activities / 832 course questions / 871 permanent course/practice IDs / 208 Conjugations questions, passed.
- Baseline complete individual suite: **232 passed, 0 failed/skipped** (also eleven file-level suites under workspace Node 24).
- Current `npm run check`: **216 activities / 1,248 course slots / 1,287 permanent course/practice IDs / unchanged 208 game questions**, passed. All JS/CJS syntax, stable manifests, finite variants and target sources validated.
- Current `npm test`: twelve files passed locally. The individual suite contains **292 cases**, with 60 new course/table/mastery/connected-review/UI regressions; all 292 passed locally and in CI using Node 22 (0 failures/skips).
- Existing all-activity render/complete tests now cover all 216 activities. Full A1 payload hashes prove all 144 original activities/Spanish targets/answers/passages/IDs/order remain unchanged. Original Conjugations IDs and all native source/icon/inset assets are unchanged; Android packaging only increments the version.
- New tests cover 35 curated targets, six person rows, supported/randomised/recall tables, full-table evidence requirements, hints, 3–20-table scopes, per-cell feedback, import corruption, interrupted snapshots, shared evidence/session caps, safe Today’s Review, Weak Areas, placement and A1/A2.1 milestones. Old mobile/Back/Go/listening/review/Today tests remain.
- A dedicated Spanish/scope review checked six-person accents, reflexives, stem changes, compound participles, selected preterite forms, comparisons, agreement, finite answers and glossaries. No native-speaker/educator review is claimed.

## Browser and Android boundary

Local `npm run check:browser` cannot launch Chromium: sandbox socket restrictions produce `setsockopt: Operation not permitted` / `ECONNRESET`.
Local `gradle -p android assembleDebug lintDebug testDebugUnitTest` returns exit 127: Gradle is not installed. No SDK, adb, emulator or physical device is attached.

The repository's existing GitHub workflow runs `npm run check`, `npm test`, real Chromium browser checks, then `assembleDebug lintDebug testDebugUnitTest` with Gradle 8.9 / Java 17 / SDK 35. The full implementation passed [validation run 37531022570](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/37531022570). Final prerequisite-gating revision `b4b5250a7dbf357b0d4af7f1132bb172023f5340` passed all JavaScript and browser checks in [run 37531786329, attempt 2](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/37531786329); Android results below are confirmed from the completed reports. Attempt 1 hit a Chromium `Target.createTarget` infrastructure timeout before any browser assertions; its retry runs the checks without weakening them.

- `npm run check`: passed.
- `npm test`: **292 passed, 0 failed, 0 skipped**.
- `npm run check:browser`: **850 assertions across ten layouts passed**, with 20 screenshots.
- `assembleDebug`: passed; debug APK uploaded.
- `lintDebug`: passed, **0 errors / 12 warnings**. Existing warnings concern launcher masks/monochrome icons, API targeting, WebView JavaScript, backup rules and obsolete/unused attributes.
- `testDebugUnitTest`: **11 passed, 0 failures/errors/skips** (six inset, three native-policy and two launcher-resource tests).

Browser checks retain ten narrow/S24/large/landscape layouts, light/dark, simulated button/gesture insets and resized/overlap keyboards. They now additionally exercise six-person table controls, Back/resume, mistake teaching, 20-table configuration, typed table Go, weak areas and daily review. Screenshots include new tables/feedback. These simulations do not establish Samsung IME, acoustic speech, TalkBack or physical launcher behaviour.

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

## Release decision

No framework, cloud service, runtime dependency, audio corpus, speech recognition or LLM grading was introduced. Schema stays v2 with additive optional mastery/table fields. A2.1 is playable; A2.2 and B stages are unavailable. Source material is original; research remains pedagogical reference.

Finite grading can reject valid unlisted alternatives. Synthetic listening lacks human-speaker variation; speaking is self-assessed; shared evidence is an approximate practice signal. Thirty-five curated targets deliberately avoid padding comparison/symptom units with unrelated verbs. A native Spanish educator should review A2 pacing, accepted alternatives, travel/health register and full-paradigm scaffolding. Physical upgrade/accessibility checks and that review should precede a wider release or A2.2 development.
