# Build and validation status

Dictionary / Saved Words / Spanish QA release **1.1.0**, Android **versionCode 12**, storage schema **v2**.
Baseline: latest main `baa70640135207a1a44f20cdfef355348d3c6028` (1.0.0/code 11).

## Baseline and preserved contracts

The immutable baseline was checked with local `npm run check` and `npm test`: Node 24 reported **17 file-isolated suites passed**, 0 failures/skips. Its prior full CI release had **649 individual cases**, **13,981 browser assertions / 11 layouts**, and **11 Android unit tests**, with lint **0 errors / 12 warnings**.

All 576 activities, 3,328 slots, permanent course/game/table/media IDs, activity order, objectives and historical snapshots remain protected. The [explicit correction manifest](docs/release/dictionary-content-corrections.json) records the requested minimal Spanish edits. Existing immutable fixtures are retained; tests reverse only those declared changes (and assert their new values) before comparing historical hashes. No assertion is silently dropped or fixture blindly regenerated.

## Current validation

Final implementation gate: [GitHub Actions run 37888800033](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/37888800033), source head `1e41a2436b6c98f2ec9bed58e9eb288d064f23e4` (followed only by release-documentation updates).

- `npm run check`: **passed**; 576 activities, 3,328 question slots, 3,367 authored permanent question IDs, 592 Conjugations payloads, 896 focused listening/speaking items, 1,212 dictionary entries and 1,564 known form mappings checked.
- `npm test` on CI Node 22: **754 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**; **105 additional dictionary/Spanish-QA cases** compared with the 649-case baseline. The local Node 24 runner reports **22 file-isolated suites passed**, 0 failed/skipped.
- `npm run audit`: **passed locally**, including dictionary exposure coverage. The original historical v1 release audit is retained; the new dictionary coverage has its own report.
- `npm run check:browser`: **14,531 assertions passed across 11 layouts** (1,321 per layout; +550 over baseline), including dictionary and Saved Words journeys, narrow phones, S24-sized light/dark, large text, landscape/cutouts and keyboard/inset cases. Existing browser assertions remain.
- `gradle -p android assembleDebug lintDebug testDebugUnitTest`: **BUILD SUCCESSFUL**, 47 tasks executed. JUnit reports: **11 passed, 0 failures, 0 errors, 0 skipped**. Lint XML: **0 errors, 12 warnings**, unchanged from baseline (target API, WebView/security declarations and launcher-resource advisories).
- Downloaded debug APK **1,731,624 bytes**; the four dictionary runtime/data/CSS assets match the validated workspace byte for byte. No externally hosted dictionary dependency is required.

Representative rendered popup/Saved Words screenshots were inspected in narrow light mode, S24 dark mode, landscape and large-text layouts. This is simulated browser/developer review, not physical-device validation. All existing compiled course/game payloads match the immutable baseline after reversing only the explicit correction manifest; immutable progress fixtures and the five-tab navigation are unchanged.

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
