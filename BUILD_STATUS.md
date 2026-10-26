# Build and validation status — 1.4.0

Android versionCode **15**; progress storage remains **schema v2**. Starting main: `77ff528a6dd13f5cbc6d03b08c5a17c4b9b93191`. The course ceiling stays A1.1–B2.2: 576 activities / 3,328 slots / 256 stories. No permanent identity/order/target changes; two B1 live glossary supports and a documented -ER practice metadata move are the only curriculum amendments. See [quality report](docs/release/V1_4_REPORT.md), [content manifest](docs/release/v14-content-support.json) and [recommendation review](docs/release/V1_4_RECOMMENDATIONS.md).

## Current release validation

Final gate results will be recorded here after the current candidate completes. The previous rendered candidate passed all fifteen layouts / 29,126 assertions; the new candidate adds phrase-replay assertions and final snapshot fixes. The screenshot guard deliberately blocks promotion until current-build images have been captured. No failed assertion or profile is removed.

Local syntax/content, full audit, learner contract, recommendation metadata and learning-load checks have passed. The new quality test file passes **85 / 85** cases. All **1,506** original JS cases remain; the expected final combined count is **1,591**, to be confirmed by the performed final gate.

## Validation scope and device limits

Rendered Chromium tests cover fifteen simulated viewport/inset/IME/theme/text profiles, including S22 light three-button, S24 dark gesture overlay-keyboard, S25 dark large-text/cutout and light landscape/cutout; 320px, resized keyboards, long content, dictionary, saved words, writing and games remain. New reference, refresher, Spanish support, confidence, shadowing and review summary screens are checked. Developer visual review inspects representative normal, large-text and landscape renders. These are not physical Samsung captures.

No physical-device, emulator, acoustic TTS, independent native-speaker or educator testing occurred. Local Chromium/Gradle/SDK/adb are unavailable or blocked by the managed sandbox; the established GitHub Actions workflow supplies real rendered-browser and Android compile/lint/JUnit checks. New external-provider policy tests are native JVM tests, not proof of regional website playback.

## Physical-device checklist

1. Export a backup before installing; a fresh debug signing key may differ from an installed APK. Do not uninstall without a verified recovery plan.
2. On S22/S24/S25-class phones test light/dark, normal/large text, portrait/landscape, gesture/three-button and cutouts; inspect final buttons/popups above system UI.
3. Exercise Spanish Help then English Hint, optional confidence, reference/refresher and continuing practice. Scores stay objective; no course completion is fabricated.
4. Test live device TTS start/delay/failure, normal/slow, post-attempt chunks and Shadowing. Reveal/self-assessment must stay locked until audio actually starts. Check sound quality by listening; a bridge callback is insufficient.
5. Background/foreground and Back during lessons, listening/shadowing, dictionary and refreshers. Saved attempts must resume; leaving must cancel speech.
6. Exercise Samsung IME Go, multiline writing, Saved Words search, Review, Today, placement, games/Tables and export/import with an old backup. Confirm historical passage/question snapshots remain intact.
7. Validate recommendation access, language tracks, region/account/paid caveats on actual intended devices before purchase.

Freeze feature expansion for serious learner/educator validation. Automated checks do not certify curriculum quality or CEFR attainment.

<details><summary>Historical 1.3 build record</summary>

# Build and validation status — 1.3.0

Android versionCode **14**; progress storage remains **schema v2**. Baseline main is `3af8d73b0a25c40bc8802122c4ad068ba0ebf6c8` (1.2.0 / code 13). No stage, activity order, permanent ID, canonical course target, story or historical fixture is removed/replaced. See [the release report](docs/release/V1_3_REPORT.md) and [assessment audit](docs/release/v13-assessment-audit.json).

## Performed validation

The complete code gate passed in [run 40257313103](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40257313103), candidate `71def79d40a3f510634db5acbd45b3e628096729`.

- `npm run check`: passed. Syntax, 576 activities, 3,328 course slots, 3,367 authored question IDs, 592 game questions, 896 focused items and 1,212 dictionary entries / 1,564 known forms validated.
- `npm test` on CI Node 22: **1,506 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**, including the final screenshot guard (the earlier code gate contained 1,505). All 838 original compatibility cases remain; 668 release cases were added. Local Node 24 independently passed 31 file-isolated suites (0 failures/skips, 171,297ms).
- `npm run audit`: passed locally; 15 A1 anchor constructions / 16 units, with eight literal-form gaps retained for educator interpretation. `node scripts/learner-release-audit.cjs` also passed: original payload/ID/order contracts, all current structured models, controlled-media adaptation and recommendation quotas.
- `npm run check:browser`: **28,556 assertions / 15 layouts**, 0 failed layouts. The previous 20,640 assertions remain; 7,916 new assertions cover v1.3. All 3,328 live questions render without horizontal overflow on the S24 profile; structured interactions, dictionary isolation, hierarchy, palette contrast, progress, recommendations and completion are covered across all layouts.
- `gradle -p android assembleDebug lintDebug testDebugUnitTest`: **BUILD SUCCESSFUL**, 47 tasks executed. JUnit XML: **14 passed, 0 failures, 0 errors, 0 skipped** (eight native inset, four native policy, two launcher tests). Lint XML: **0 errors / 12 warnings**, the same warning count as v1.2.
- Built APK: **1,757,599 bytes**. All **67** bundled web assets match this worktree byte for byte.

The final README showcase adds an integrity test: 15 unmodified validated PNGs, relative README references and exact runtime-asset hashes. The combined JavaScript gate passed in [run 40258240808](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40258240808). Its runtime assets are identical to the complete code gate above; the final validation branch also repeats rendered/native checks before main promotion. Two additional screenshot subjects document the first A2.2 guided-writing bridge and B1 guided expression. The five-tab navigation and all original browser assertions/profiles remain.

The browser fixture fixes preserve all assertions/profiles: isolated lexical scope, scroll a vocabulary anchor into the usable viewport before tapping, and initialize optional focused state after resetting an illustrative screenshot profile. No product error is suppressed.

## Rendered review and Samsung profiles

Developer visual review covered light/dark Home/Profile, recommendations, all three opening teaching lessons, first story, structured recall/transfer, word banks, multi-gap Spanish, diagnostic feedback, pre-answer dictionary, Saved Words, completion, games, Review, A2.2 guided writing and B-level expression. Phone-size renders were inspected at normal and large text; S24 overlay-keyboard and S25 landscape/cutout scenarios were also inspected. [Fifteen showcase images](docs/screenshots/manifest.json) come from the validated browser artifact; these use illustrative test progress, not learner data.

Named profiles vary actual layout conditions rather than physical device resolution:

| Profile | Conditions | Result |
| --- | --- | --- |
| S22 | 360×780, light, three-button inset, right cutout | Passed |
| S24 | 360×800, dark, gesture inset, simulated overlay IME | Passed |
| S25 portrait | 360×800, dark, 1.35× text, bilateral cutouts | Passed |
| S25 landscape | 760×360, light, 1.2× text, asymmetric cutouts | Passed |

Eleven additional profiles retain 320px, resized/overlap keyboards, gesture/three-button, dark/light, landscape and large-text checks. Insets/IME and speech acknowledgement are simulated. No physical-device, emulator, acoustic TTS or independent native-speaker/educator test is claimed. Local Chromium cannot launch under the managed sandbox; Gradle/Android SDK/adb are unavailable locally. The established CI supplies the real Android compile/lint/JUnit validation.

## Physical-device release checklist

1. Export and verify a backup before installation. A fresh CI debug signing key can differ from an installed APK; never uninstall without a recovery plan.
2. On real S22/S24/S25, verify portrait/landscape, gesture/three-button, large text, light/dark, status/cutouts and bottom controls. Scroll to every final control.
3. Try word/phrase Add/Remove/reset, duplicate words, multi-gap selection, checking and per-gap feedback; dictionary lookup must not select, hint or score.
4. Complete a lesson, Continue directly to the next story/checkpoint/unit, and Finish for now. Test Today precedence, later starting path and historical active-attempt recovery.
5. Test Saved Words search and open writing with Samsung keyboard: short historical Go submits once, multiline Enter adds a newline, popup stays above IME and navigation restores after close.
6. Verify Review, games/tables, placement, import/export and installed offline es-ES audio. Check external recommendations open a separate browser and return safely.
7. Obtain beginner/educator feedback on structured task ambiguity, distractor quality, safe alternate orders and the A2.2 writing bridge; check B-level pacing and naturalness.

The APK is suitable for this physical-device testing, not a claim of hardware validation or CEFR certification. Recommendations may change availability; the catalogue documents near-term RTVE expiries and partial YouTube verification. Existing [user-testing guidance](docs/release/USER_TESTING.md) still applies.

Historical v1.2 results: 838 JS cases / 20,640 browser assertions / 13 native tests, lint 0 errors / 12 warnings. They remain baseline evidence rather than current-release totals. See [the baseline build record](https://github.com/mmwiza1/Friends-to-Amigos/blob/3af8d73b0a25c40bc8802122c4ad068ba0ebf6c8/BUILD_STATUS.md).

</details>
