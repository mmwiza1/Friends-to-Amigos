# Build and validation status

Dictionary / Saved Words / Spanish QA candidate **1.1.0**, Android **versionCode 12**, storage schema **v2**.
Baseline: latest main `baa70640135207a1a44f20cdfef355348d3c6028` (1.0.0/code 11).

## Baseline and preserved contracts

The immutable baseline was checked with local `npm run check` and `npm test`: Node 24 reported **17 file-isolated suites passed**, 0 failures/skips. Its prior full CI release had **649 individual cases**, **13,981 browser assertions / 11 layouts**, and **11 Android unit tests**, with lint **0 errors / 12 warnings**.

All 576 activities, 3,328 slots, permanent course/game/table/media IDs, activity order, objectives and historical snapshots remain protected. The [explicit correction manifest](docs/release/dictionary-content-corrections.json) records the requested minimal Spanish edits. Existing immutable fixtures are retained; tests reverse only those declared changes (and assert their new values) before comparing historical hashes. No assertion is silently dropped or fixture blindly regenerated.

## Current validation

Local syntax/course checks and the exposure audit pass. The complete JS regression run, rendered mobile/browser suite and established Android CI workflow form the final release gate. Final exact results and the successful workflow link will be recorded here before publication to main.

Local Chromium failed to launch under the execution sandbox (`ECONNRESET`, crashpad socket operation not permitted); no local rendered pass is claimed. Local Gradle/Android SDK/adb/emulator are unavailable. Rendered-browser and native validation therefore run in the established GitHub Actions workflow. No emulator, physical-device, acoustic TTS or independent native-speaker validation is claimed.

## Device checklist

Before wider distribution:

1. Export a verified backup and confirm signing-key compatibility before installing; never uninstall an existing APK without a recovery plan.
2. On S24 gesture and three-button navigation, portrait/landscape, light/dark and large text: open/scroll/dismiss the popup near each screen edge, show More, verify toasts and final controls above the keyboard/system bars.
3. Tap the representative constructions listed in [dictionary documentation](docs/LEARNER_DICTIONARY.md), replay pronunciation using the installed offline es-ES voice, and check ambiguous/unknown words are honest.
4. Save words/phrases, reopen Profile Saved Words, search/filter/remove, background/relaunch and export/import a backup.
5. Verify a popup Back closes it first, the next Back saves/leaves, and unfinished lessons/Today/review resume exactly. Check keyboard Go and multiline newline retain their existing behaviour.
6. Review the selective café/clothing/transport/plural-instruction corrections with a Spanish educator. Existing taking-transport alternatives remain valid.

The eight-stage course remains a user-testing course milestone, not CEFR certification. See the historical [1.0 quality report](docs/release/V1_REPORT.md), [new dictionary architecture](docs/LEARNER_DICTIONARY.md), and [coverage report](docs/release/dictionary-coverage.json). No third-party dictionary/audio corpus, framework or runtime dependency was added.
