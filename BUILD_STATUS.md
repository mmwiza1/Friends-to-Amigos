# Verification and release gates

Galaxy S24 clarity/mobile update 0.5.0, Android version code 5. Baseline: main `1a5803aa327fbc8aa1f8fb9713eb088cd0ca4a8c`, with 141 passing individual JavaScript tests.

## Performed JavaScript checks

- `npm run check`: passed; 144 activities, 832 course slots, 871 permanent IDs. Syntax, IDs, ordering, finite answers and unavailable future stages validated.
- `npm test`: passed all ten test files. Direct individual runs verify 186 cases: 29 engine, 61 app, 14 identity, 30 storage, 12 speech, 7 mobile, 8 learner clarity, 12 answer feedback, 10 viewport and 3 launcher.
- All 144 playable activities / 832 questions render and complete in simulated DOM tests. Historical v1/v2 migration/import, active snapshots, review schedules, Today, placement, Back and 80% checkpoints remain protected.
- New regressions cover Go/Enter guards, radio selection/focus, explicit action labels, escaped learner-answer feedback, authored-explanation priority, bounded cautious comparison, native/browser keyboard geometry, focus removal, density/icon resources and adaptive safe-zone pixels.
- Original curriculum and identity sources are unchanged beneath the assembly overlay. Tests compare every target, accepted answer, choice, passage, goal, ID and ordering against the pre-clarity course; historical snapshots remain unchanged.

## Android and rendered-browser validation

Local Android command could not run: `gradle -p android assembleDebug lintDebug testDebugUnitTest` returned exit 127 (`gradle: command not found`). This workspace has no Android SDK, adb or emulator.

Local Chromium launch was blocked by sandbox socket restrictions; `npm run check:browser` therefore cannot establish local rendered results. GitHub CI runs Chrome with native DevTools pipe, without automation dependencies, across ten narrow/normal/large/landscape light/dark layouts. System inset and resized/overlap-keyboard scenarios are simulated. Assertions check navigation/header/toast spacing, reachable final controls, focused input/check visibility, Go submission, radio focus/selection and keyboard-close restoration. Screenshots/JSON reports are retained as `mobile-browser-reports`.

Current update CI build/lint/unit and browser results will be recorded here after the validation run. No result is claimed in advance.

The maintainer tested the preceding APK on a physical Samsung Galaxy S24 and reported the issues addressed here. This new update has not yet been tested on a physical device or emulator. Simulated keyboard/inset geometry and headless Chrome are not proof of Samsung IME, acoustic speech, TalkBack or launcher rendering.

## Physical-device checklist

Export and verify a backup first. Use the maintained signing key for an in-place upgrade; CI debug keys may differ. Do not uninstall an app containing learner progress without a verified export. Android automatic backup remains disabled.

- [ ] Update a real v1/v2 learner: profile, saved lessons/passages, reviews/dates, streaks/capabilities and start stage survive.
- [ ] On S24, test both three-button and gesture navigation: header/toast clear status bar, app navigation clears system navigation, final cards scroll fully above it.
- [ ] Portrait/landscape and cutouts: no clipped title or primary button; verify light/dark and larger text.
- [ ] Samsung keyboard Go checks once; empty Go is inert. Input and Check remain reachable. Keyboard close/Home restore navigation. Repeat with a physical keyboard.
- [ ] Test visible radio selection and TalkBack radio labels; choose → Check scoring remains unchanged.
- [ ] Wrong writing: learner response/model/why and underlines are readable; historical review retains original snapshot feedback.
- [ ] Inspect full-colour bull-face launcher under Samsung/circle/squircle masks; Android 13 themed icon remains recognisable.
- [ ] Button/gesture Back saves every quiz type and returns secondary screens/main tabs; Home backgrounds.
- [ ] Airplane-mode es-ES listening, playback-start lock, failure fallback, slow/normal replay, transcript reveal and skip-to-review.
- [ ] Today with due/no review, completed course and saved attempt; A1.2 placement never forces earlier revision.
- [ ] Native export/import, cancellation, invalid/future backups and completion/review deduplication.

## Release boundary

No A2.1, new stages, altered Spanish targets, cloud service or runtime dependency. Schema remains v2; discovery key, migrations, historical snapshots, progress and identifiers are preserved. Listening is synthetic; speaking is self-assessed; finite matching can reject valid unlisted paraphrases. Cautious comparison is model feedback, not general grammar assessment. Device retest and a Spanish educator’s review remain useful release gates.
