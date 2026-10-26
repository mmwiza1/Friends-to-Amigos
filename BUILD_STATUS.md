# v1.3 candidate validation

Version 1.3.0 / Android versionCode 14 is in validation; main remains the verified 1.2.0 baseline until the full gate is green. The candidate adds structured assessment, seamless continuation, local recommendations and Home/Profile semantic cards. See [the release report](docs/release/V1_3_REPORT.md). Final test, rendered-browser, Android and screenshot results will replace this candidate notice after actual validation.

The original v1.2 results below are historical baseline evidence, not a claim that v1.3 has already passed.

# Build and validation status

Learner-experience release **1.2.0**, Android **versionCode 13**, storage schema **v2**.
Baseline: latest main `e6a4eaed045c255beb6e663b46d24e9d81d0b8a5` (1.1.0/code 12).

## Baseline and preserved contracts

The immutable main copy passed local `npm run check` and `npm test`: Node 24 reported **22 file-isolated suites passed**, 0 failures/skips. Published baseline CI reported **754 individual cases**, **14,531 browser assertions / 11 layouts**, **11 Android unit tests**, and lint **0 errors / 12 warnings**.

All 576 activities, 3,328 course slots and permanent course/game/table/media identities and ordering remain protected. The new [baseline contract](docs/release/learner-experience-baseline-contract.json) also protects all 23 historical fixtures, navigation, 592 Conjugations items, 82 table targets and 896 focused media items. The [explicit on-ramp/recycling manifest](docs/release/learner-experience-content-corrections.json) records five intentionally amended activities and 23 question payloads. Tests assert the exact new values before reversing only those explicit changes for historical hashes; immutable fixtures are not regenerated.

The supported opening preserves the original checkpoints, objectives, writing practice and later expectations. Historical attempts use their saved questions. Review success on an easier/different replacement task cannot clear an original harder review under the same ID. Original snapshot practice retains the established schedule. Schema remains v2 with optional true-only product discovery `dictionaryTipSeen`, separate from hints/evidence/score.

## Current release gate

Final code gate: [GitHub Actions run 38480352996](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/38480352996), validated source `616247d825fb1a78be639b5255401c2b0d8d7bb4` (followed only by final release-documentation updates).

- `npm run check`: **passed**; 576 activities, 3,328 slots, 3,367 permanent authored IDs, 592 game items, 896 focused items and the existing 1,212-entry/1,564-form dictionary checked.
- `npm test` on CI Node 22: **838 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**, +84 individual cases over baseline. Local Node 24 reports **28 file-isolated suites passed**, with no failures/skips, in the full resumed/final reruns.
- `npm run audit`: **passed locally**; the retained deterministic A1 report covers 15 anchors / 16 units and flags eight literal exposure gaps for educator interpretation, not automatic content insertion.
- `npm run check:browser`: **20,640 assertions / 15 layouts**, 1,376 per layout. All eleven old profiles and four named Samsung profiles pass; the additional focus-ring/label clearance check is included in every layout.
- `gradle -p android assembleDebug lintDebug testDebugUnitTest`: **BUILD SUCCESSFUL**, 47 tasks executed. JUnit XML: **13 passed, 0 failures, 0 errors, 0 skips** (eight inset, three native-policy and two launcher tests). Lint XML: **0 errors, 12 warnings**, the same warning count as baseline.
- Test APK: **1,738,585 bytes**. All **64** bundled web assets match the validated workspace byte for byte, including the fixture-independent product code, CSS, dictionary, course, games and audio/mascot assets.

The original screenshot failure was a DevTools lexical-scope collision, not a product exception. Every screenshot setup now runs in its own IIFE, with a regression guard; no layout or product assertion was removed. Manual review then found a search focus ring crowding its label. A scoped `.5rem` gap and real rendered geometry assertion fix that issue. The complete gate was rerun after this correction.

Developer inspection covered opening lesson 1/2/3, first story, recall/transfer, the mixed-language prompt, pre-answer choice lookup/dismissal/selection, Saved Words, normal/large text, dark/light, keyboard and landscape/cutout renders. The refreshed S24/S25 search renders show label clearance. This is simulated rendered review, not physical-device testing.

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
