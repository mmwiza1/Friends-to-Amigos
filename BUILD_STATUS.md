# Verification and release gates

Conjugations / lesson-continuation update **0.6.0**, Android version code **6**. Baseline: main `2c0431fa92a43e05f95ccf5adca03b6994d1782e`, with 186 passing individual JavaScript tests, 144 course activities, 832 course question slots and 871 permanent course/practice IDs.

## Performed checks

- `node --check`: all 33 JS/CJS files passed.
- `npm run check`: passed; unchanged 144 activities / 832 course slots / 871 IDs, plus 208 separate permanent game IDs. Syntax, ordering, finite answers, prerequisites and unavailable future stages validated.
- `npm test`: passed all eleven files locally. Direct individual runs verify **232 cases**, 0 failed/skipped: the original 186 plus 30 game-bank/engine/persistence cases and 16 app/game/continuation regressions.
- All 144 course activities / 832 questions still render and complete. All 208 game questions render and complete through check/advance. Game rounds have ten unique items; focused correction has up to five eligible related items.
- Seeded selection tests protect person/verb diversity, six-current/four-foundation A1.2 rounds, 30-item recent rotation including abandoned items, weak-concept weighting, Challenge limits and course-linked eligibility. Optional game persistence, personal bests beyond the 40-round history, interrupted games alongside saved lessons, import rejection, both export paths and independent course progression are covered.
- Existing migration/snapshots, review schedules, Today, placement, Back, keyboard Go, radio feedback and 80% checkpoints remain protected. Partial or failed lessons cannot trigger forward continuation.
- Byte comparison against the baseline confirms curriculum/story/identity sources, engine, course-path, speech, diagnostic course feedback, viewport, native Java/inset logic and all launcher resources are unchanged. No Spanish course target, accepted answer, goal, passage or permanent identifier was rewritten.

## CI and Android validation

[Full validation run](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/37523983405) passed on `d66ddb89e95fccab5af19f5174c714d64ff04cda`:

- `npm run check`: passed.
- `npm test`: **232 passed, 0 failed, 0 skipped**.
- `npm run check:browser`: **10 layouts / 570 rendered layout and interaction assertions passed**. Includes five-tab touch targets, saved-game Back/resume, full rounds, per-blank feedback, mistake/Challenge modes and lesson continuation. Narrow 320px, 360px, S24-class 384px, 480px and landscape/cutout geometries cover light/dark, button/gesture system insets and resized/overlap keyboard simulations.
- `assembleDebug`: passed; APK artifact `friends-to-amigos-android` produced.
- `lintDebug`: passed with **0 errors / 12 existing non-blocking warnings**. Categories: old-target/API qualifiers, local JavaScript-enabled WebView, backup-policy modernization and launcher qualifier/monochrome/legacy-mask recognition. No suppression or lint baseline was added.
- `testDebugUnitTest`: **11 passed, 0 failures/errors/skipped** (3 Back/rate policy, 6 inset arithmetic, 2 launcher packaging).
- Gradle 8.9 / Java 17 / Android SDK 35 were used.

`mobile-browser-reports` retains ten JSON summaries and sixteen screenshots, including Games, a round and feedback in narrow light/S24 dark layouts. `android-check-reports` retains lint/JUnit reports. The final revision keeps the validated application/native/test logic; screenshot capture additionally waits for animations and removes transient test toasts for inspection. Main reruns the complete workflow.

Local Chromium is blocked by sandbox socket restrictions (`setsockopt: Operation not permitted`). The local Android command returned exit 127 (`gradle: command not found`); there is no Android SDK, adb or emulator here. Rendered/native results above were performed in GitHub CI, not on this workspace or a physical device.

The maintainer tested the preceding APK on a physical Galaxy S24. This Games update has not been physically tested. Browser simulations do not establish Samsung IME, acoustic speech, TalkBack or real launcher behavior.

## Physical-device checklist

Export and verify a backup first; preserve the signing key for an in-place upgrade. CI debug keys may differ from the installed app.

- [ ] Update a v1/v2 learner: saved lesson/passages, profile, reviews/dates, streaks, capabilities and starting path survive; missing game fields are harmless.
- [ ] S24 button/gesture navigation, landscape/cutouts and larger text: five tabs fit; header/toast/app navigation clear system bars; every last control remains reachable in light/dark.
- [ ] Samsung keyboard Go checks once; empty/repeated Go is inert. Input/Check remain reachable and closing the keyboard restores navigation.
- [ ] Games → Back → Home; in-round Back saves to Games; app relaunch/import resumes the same shuffled/checked game without replacing a saved course lesson.
- [ ] Fill one/two/three blanks; TalkBack distinguishes groups/options/selected states and per-blank correct/incorrect feedback. Repeat after an incorrect answer.
- [ ] Complete ten questions; check score, best, concept signals, mistake practice, another round and Challenge. Course completions/checkpoints/placement must not change.
- [ ] A1.1, A1.2 placement and partial-unit progress: only taught eligible forms appear; new forms open through course work, never a high game score.
- [ ] Passed lesson Continue learning starts the next required lesson, then due review, then listening maintenance. Failed lessons offer retry/mistake review. Today retains its continuation.
- [ ] Airplane-mode es-ES listening: playback-start lock, failure fallback, slow/normal replay, transcript reveal and skip-to-review.
- [ ] Native/browser backup export/import includes games; malformed/future imports preserve current progress.
- [ ] Existing bull-face launcher and themed/circle/Samsung masks remain recognizable.

## Release boundary

No A2.1, new CEFR stage, framework, cloud service, runtime dependency or downloaded dataset. Course targets/content/IDs are unchanged; schema stays v2 with an optional separate `games` namespace. New-game question IDs and ordering are protected by a fixture. Limited early exposure deliberately postpones a varied first round until introductory/personal-information teaching is complete. A small eligible bank may require recent repeats, and focused correction may have fewer than five alternatives.

Game concept signals are practice observations, not certification or a reliable estimate of mastery. Listening is synthetic; speaking remains self-assessed; finite course matching can reject valid unlisted paraphrases. Original authored game scenarios would benefit from a native Spanish educator's review. Physical S24/TalkBack retesting remains a release gate.
