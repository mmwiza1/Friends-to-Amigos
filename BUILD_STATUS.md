# Verification and release gates

Mobile/product update 0.4.0, Android version code 4. Baseline: main `d7c8bec143a383262813a56bbec8e66dc7761ac2`, with 116 passing individual JavaScript tests.

## Performed JavaScript checks

- `npm run check`: passed; 144 activities, 832 course question slots, 871 permanent authored IDs.
- `npm test`: passed; 141 individual cases (29 engine, 49 app, 14 identity/curriculum, 30 storage, 12 speech, 7 mobile). The local test wrapper summarises six file groups; direct file runs verify the individual counts.
- `node --check`: all 21 JS/CJS files passed.
- Every playable activity/question renders and completes in the simulated DOM. Historical v1/v2 migration/import, active snapshots, review scheduling and 80% checkpoints remain tested.
- All seven authored curriculum/identity sources remain byte-for-byte unchanged; persistent ID/order manifests remain unchanged.
- New coverage exercises Back/secondary navigation, placement and accurate completion counts, Today resume/review/lesson/maintenance, delayed/rejected/started playback and stale callbacks, session speed, current-question progress and dark-palette contrast.
- Native policy tests cover explicit Back consumption and safe speech rates. JavaScript tests also protect bridge wiring and local theme/icon resources.

## Android validation

The local `gradle -p android assembleDebug lintDebug testDebugUnitTest` attempt could not run: Gradle and the Android SDK are unavailable (`gradle: command not found`, exit 127). OpenJDK 21 is present. Downloading tooling through the configured proxy was unavailable. GitHub Actions now runs build, lint and unit tests on pushes/PRs and manual dispatch; the exact CI result will be recorded after validation.

No physical-device/emulator or acoustic testing has been performed. A local headless Chromium screenshot attempt failed because required socket operations were sandbox-blocked; dark-mode validation here uses explicit palette contrast and structural checks, not a rendered-device claim.

## Physical-device checklist

Export and verify a backup first. Keep the application ID and maintained signing key for an in-place upgrade; fresh CI debug keys may differ. Do not uninstall an app containing learner progress without a verified export. Android automatic backup remains disabled.

- [ ] Install/update with maintained signing; confirm genuine v1/v2 profile, lessons, snapshots, review dates, streaks and capabilities survive.
- [ ] Test button/gesture Back during every quiz type, achievements, focused practice and placement result; main tabs return Home, then Home backgrounds.
- [ ] In airplane mode, check early/later listening, actual start acknowledgement, failed/missing voice, slow/normal replay, transcript reveal and skip-to-review.
- [ ] Background/resume during a pending playback; verify stale callbacks cannot unlock another question or lose the lesson.
- [ ] Verify A1.2 placement, optional A1.1 revision, accurate required-path completion, and normal A1.1→A1.2 progression.
- [ ] Run Today with due/no reviews, completed course and a saved attempt; check manual navigation remains available.
- [ ] Check light/dark launcher/splash/system bars, portrait/landscape insets, large text, keyboard and TalkBack labels on Android 8 and modern gesture-navigation Android.
- [ ] Exercise native export/import, picker cancellation, invalid/future files, and review/checkpoint deduplication.

## Release boundary

Course content remains unchanged and A2.1 remains unavailable. CI/build success is not a physical-device, signing-upgrade, acoustic or independent educator review. These remain release gates before declaring an unconditional A1 v1.0 freeze. Listening is synthetic unless later curated recordings are supplied; speaking remains self-assessed and finite matching can reject valid unlisted paraphrases.
