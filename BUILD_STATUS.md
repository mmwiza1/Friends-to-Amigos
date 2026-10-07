# Verification and release gates

A2.2 quality expansion **0.10.0**, Android version code **10**.
Baseline reviewed: main `eea54ae0f78695f1eeadc96e2f4e16932ed55650` (0.9.0).

## Baseline

Before edits, `npm run check` and `npm test` passed. The Node 24 file-isolated summary reports 14 passing files; the prior release contains 408 individual cases. Previous verified CI: 3,003 rendered assertions / 11 layouts; Android 11 unit cases, lint zero errors / 12 warnings.

## Current implementation and compatibility

- 288 course activities / 1,664 slots / 1,703 permanent authored course/special IDs; 336 sentence-game items; 55 table targets; 448 focused-media items (224 Listening + 224 Speaking).
- A2.2 contributes eight units, 72 activities, 416 slots, 32 stories, eight writing activities, eight checkpoints, 56 Listening items, 56 Speaking prompts, 64 sentence contexts and 20 curated targets.
- Schema remains 2. All 0.9.0 course/game/table/focused payloads and order are frozen byte-for-byte, including language metadata, accepted answers and reading passages. Earlier fixtures continue protecting original identities and historical saves.
- Full existing behaviour plus dedicated A2.2 validation covers story review, task hints, finite variants, meaning-based tense contrast, source-linked paradigms, grammar ceilings, focused-media teaching gates/rotation/6–2–1–1 recycling, checkpoint rewards, placement, Today, milestones, Back and Go.

## Executed validation

The final implementation source `a42482d3c571068ee34099f6416c0806154a1717` was validated before publishing main: [successful CI run](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/37608549703). This release records those results and makes documentation-only clarifications on the same validated code tree.

| Check | Exact result |
| --- | --- |
| `npm run check` | Passed: syntax, structure, IDs, accepted variants and content checks |
| `npm test` (CI Node 22) | 481 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo |
| `npm test` (local Node 24) | 15 passing file-isolated suites; separate individual-case run: 481 passed, 0 failed/skipped |
| `npm run check:browser` (real Chromium in CI) | 11 layouts × 488 checks = 5,368 assertions passed; 79 screenshots produced |
| `assembleDebug` (Gradle 8.9 / Java 17 / SDK 35) | Passed; APK artifact produced |
| `lintDebug` | Passed; XML confirms 0 errors/fatal issues, 12 existing warnings |
| `testDebugUnitTest` | 11 passed, 0 failures/errors/skips across native policy, insets and launcher resource cases |

Baseline comparison: 408 → 481 individual JavaScript cases; 3,003 → 5,368 browser assertions. Sixty-five dedicated A2.2 cases plus eight newly exercised focused-media stage cases were added. Existing behavioural tests were retained; stage counts/availability assertions were deliberately extended while original scopes/fixtures remain protected.

The diff review confirms earlier course/game/table/focused payloads are unchanged and no B stage is playable. Rendered tests cover all 72 A2.2 activity entry screens, Spanish tasks/hints/audio concealment, connected writing Go, save/Back/resume, custom imperfect tables, ten-item sessions and completion. DOM tests render/complete every one of the 288 activities and every focused item; old migrations/imports/reviews/progression, Today, games and mobile contracts still pass. Screenshots reviewed include S24 dark writing, 320px light tables and landscape story entry. Safe areas and keyboard insets are simulated rather than real device signals.

Local Chromium was attempted and blocked by sandbox `setsockopt: Operation not permitted` / ECONNRESET. Local Gradle was attempted and is absent (exit 127). Real browser/native checks above ran in CI, not locally. No emulator, physical Android device or acoustic TTS evaluation was used. Lint warnings remain the baseline target/API/resource/icon/WebView configuration warnings; no new warning was introduced and unrelated packaging was not changed.

## Physical maintainer checklist

1. Install/upgrade over 0.9.0 with real progress; resume an older course question, story, review, game and table. Export/import without losing records.
2. On Samsung gesture and three-button navigation, test portrait/landscape, large text, light/dark, status/nav/cutout insets, keyboard opening/closing and Go submission.
3. Enter A2.2 from normal continuation and a later chosen start. Confirm earlier revision remains manual and counts are actual, not assumed completions.
4. Complete one teaching activity, story, writing and checkpoint; fail/retry without duplicate rewards. Confirm Spanish hints persist and audio/models stay hidden before attempts.
5. Install a local es-ES voice and test audible playback, .75×/1×, unavailable-voice skip, replay, interruption/background and Back cancellation.
6. Run ten-item A2.2 Listening/Speaking; Needs practice should enter review and Weak Areas. Confirm no microphone permission or pronunciation score.
7. Test A2.2 sentence rounds and imperfect/custom table practice, hints and resume; lowering the grammar ceiling keeps higher attempts safe.
8. Verify A1 milestone, A2.2 completion, Today maintenance, launcher bull and no playable B stage.

Independent native-speaker/educator review remains advisable before treating the new content as a stable teaching release. Course milestones are not formal CEFR certification.
