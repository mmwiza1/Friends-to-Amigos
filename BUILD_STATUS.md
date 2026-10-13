# Build and validation status

Learner-experience candidate **1.2.0**, Android **versionCode 13**, storage schema **v2**.
Baseline: latest main `e6a4eaed045c255beb6e663b46d24e9d81d0b8a5` (1.1.0/code 12).

## Baseline and preserved contracts

The immutable main copy passed local `npm run check` and `npm test`: Node 24 reported **22 file-isolated suites passed**, 0 failures/skips. Published baseline CI reported **754 individual cases**, **14,531 browser assertions / 11 layouts**, **11 Android unit tests**, and lint **0 errors / 12 warnings**.

All 576 activities, 3,328 course slots and permanent course/game/table/media identities and ordering remain protected. The new [baseline contract](docs/release/learner-experience-baseline-contract.json) also protects all 23 historical fixtures, navigation, 592 Conjugations items, 82 table targets and 896 focused media items. The [explicit on-ramp/recycling manifest](docs/release/learner-experience-content-corrections.json) records five intentionally amended activities and 23 question payloads. Tests assert the exact new values before reversing only those explicit changes for historical hashes; immutable fixtures are not regenerated.

The supported opening preserves the original checkpoints, objectives, writing practice and later expectations. Historical attempts use their saved questions. Review success on an easier/different replacement task cannot clear an original harder review under the same ID. Original snapshot practice retains the established schedule. Schema remains v2 with optional true-only product discovery `dictionaryTipSeen`, separate from hints/evidence/score.

## Current release gate

Local syntax/structural checks, the anchor audit and targeted compatibility/review tests pass. The final complete `npm test`, rendered mobile/browser and Android compile/lint/unit runs are in progress; exact counts and the successful workflow link will be recorded before publishing main.

Local Chromium fails to launch under the execution sandbox (`ECONNRESET`, crashpad socket operation not permitted), so no local rendered pass is claimed. Local Gradle/Android SDK/adb/emulator are unavailable. The established GitHub Actions workflow runs `npm run check`, `npm test`, `npm run check:browser`, then `gradle -p android assembleDebug lintDebug testDebugUnitTest`. No emulator, physical-device, acoustic TTS or independent native-speaker validation is claimed.

## Responsive / device checklist

The rendered suite retains eleven previous profiles and adds four named Samsung scenarios: S22 360px light/three-button, S24 360px dark/gesture with overlay IME, S25 360px large text/bilateral cutouts, and S25 760×360 landscape/asymmetric cutouts. These vary CSS viewports and native inset values, not physical model resolution. Existing WindowInsets remain the single source of truth.

Before wider distribution:

1. Export a verified backup and confirm signing-key compatibility before installing; never uninstall an existing APK without a recovery plan.
2. On real S22/S24/S25, try portrait/landscape, gesture/three-button, light/dark and large text. Open and scroll dictionary/More near each screen edge; verify final controls and navigation above system UI.
3. In all three opening lessons, tap Spanish in the bilingual model, mixed prompt and options before answering. Word tap must open help; card/radio/padding must select. Back/Escape/outside closes help without answering. Check the product tip disappears only after successful dictionary use.
4. Focus written responses and Saved Words search using the Samsung keyboard. Check Go submits once, multiline Enter adds a newline, inputs and Check remain reachable, and closing the IME restores layout.
5. Save/remove/search/filter vocabulary, background/relaunch, resume a historical lesson and export/import. Verify Today, Review, placement, games/tables, accents and distinct ñ.
6. Listen to dictionary pronunciation using an installed offline es-ES voice and obtain complete-beginner/educator feedback on the ramp and recurrence gaps.

See [the learner-experience quality report](docs/release/LEARNER_EXPERIENCE_REPORT.md), [dictionary architecture](docs/LEARNER_DICTIONARY.md), [anchor recurrence](docs/release/a1-anchor-recurrence.json) and historical [1.1.0 report](docs/release/DICTIONARY_REPORT.md). This is a course/user-testing milestone, not CEFR certification. No framework, cloud service, runtime dependency, microphone or third-party corpus is added.
