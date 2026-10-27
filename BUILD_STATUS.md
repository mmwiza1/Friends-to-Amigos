# v1.8.0 consolidation — Android versionCode 19

Starting main: `7504f49d740d13fbfd60237e510cf6716f534923`. A1.1–B2.2, 576 activities and all eleven Practice activities remain. This release adds beginner support, targeted recommendations, surgical language/glossary polish and private bounded beta diagnostics; no major feature expansion, participant programme or KPI framework.

The current [implementation/report](docs/release/V1_8_REPORT.md), [GitHub-style release notes](docs/release/V1_8_RELEASE_NOTES.md) and [manual QA](docs/release/V1_8_MANUAL_QA.md) distinguish automated, agent visual/editorial and outstanding actual-device/native review. All fifteen 1.8 screenshots have a current manifest/fingerprint and recorded image review. Final performed test/native totals will be recorded after the complete gate succeeds. Historical evidence below does not substitute for that gate.

# Current GitHub showcase process hardening — app 1.7.0

The app/runtime remains 1.7.0 / Android versionCode 18, based on main `37761ab9e8375f6476dbb950f83918f589b8d5f2`. All fifteen public images were regenerated and visually reviewed as clean, simulated app viewports. The permanent manifest gate binds UI/capture source fingerprints, versions, image bytes and manual review. See the [performed validation and per-image review](docs/release/SHOWCASE_HARDENING_REPORT.md), [policy](docs/SCREENSHOT_POLICY.md) and [checklist](docs/RELEASE_SHOWCASE_CHECKLIST.md).

Performed hardening gate: [run 40424118507](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40424118507) passed checks/capture/Android build. **2,116 JS tests passed, 0 failed/skipped/cancelled/todo; 17 browser layouts / 39,327 assertions; 15 public captures / 176 assertions; Android 15 unit tests / 0 failures, lint 0 errors / 12 existing warnings.** All 77 APK web assets match source. Local course/showcase/recommendation/learning/story/depth/learner audits passed. The final documentation/test-portability commit repeats the complete hosted gate before main promotion.

The following v1.7 release evidence is historical; the new process gate results are recorded in the report above. No physical-device capture/testing is claimed.

# Build and validation status — 1.7.0

Base main: `d69d64f727ea9eee5520057e5ac2bb4df00b94ab`. Version **1.7.0**, Android **versionCode 18**. Same eleven Practice activities and A1.1–B2.2 course; no course-content, ID, schema or dependency expansion.

## Performed release gate

The complete runtime gate passed in [run 40418035901](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40418035901), commit `6a1de1f17ca64ed1ea47411efe91e70d658772a4`:

- `npm run check`, `npm run audit`, recommendation/learning/story audits and `node scripts/learner-release-audit.cjs`: passed (report audit also performed locally).
- `npm test` (CI Node 22): **2,069 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**. All previous cases remain; **335** focused Practice-depth cases cover the new formatters, explicit errors, source gates, replay, snapshots and evidence.
- `npm run audit:practice-depth`: passed. Twenty rounds for each activity/stage: **4,800 questions**. Builder/Numbers show zero exact repeats at every stage. Spot exhausts eligible authored contexts before repetition, with 15 necessary repeats over 200 questions at full B2.2 eligibility. Tests also complete **800 Builder rounds / 8,000 questions**.
- `npm run check:browser`: **17 layouts, 38,868 assertions, 0 failed layouts**. Retains Samsung profiles and generic Pixel-class widths; adds generated clocks/dates, granular mixed rounds and related-challenge resume. Conditions are simulated, not real device/keyboard/acoustic validation.
- `gradle -p android assembleDebug lintDebug testDebugUnitTest`: **BUILD SUCCESSFUL in 23s, 47 tasks executed**. Downloaded JUnit XML confirms **15 tests, 0 failures/errors/skips** (launcher 2, insets 8, native policy 5). Downloaded lint XML confirms **0 errors/fatal issues, 12 existing warnings**.
- Downloaded APK integrity: **all 77 web files exactly match** the runtime/showcase SHA-256 manifest. Fifteen README PNGs were copied unmodified from this run; every PNG and every web asset is checked by the showcase regression.

The documentation/showcase release commit repeats the complete workflow before main promotion. The runtime is unchanged from the validated capture. The new [implementation report](docs/release/V1_7_REPORT.md), [replay data](docs/release/v17-practice-depth.json), [release notes](docs/release/V1_7_RELEASE_NOTES.md) and [manual QA](docs/release/V1_7_MANUAL_QA.md) describe exact boundaries.

**Ready for physical-device testing after the final main gate.** No physical device, emulator, acoustic TTS, independent educator or native-speaker validation is claimed. Finite reconstruction, a bounded early correction pool, twelve-hour clock tasks and non-leap dates are intentional limits. Preserve an exported backup if CI debug signing differs and an uninstall is necessary.

<details><summary>Historical validation through v1.6</summary>

# Build and validation status — 1.6.0

Android versionCode **17**; schema-v2 retained. Base main: `36352bdca18c1ed397c3bd9634e801301b501cb5`. Course identities, order and content remain unchanged: A1.1–B2.2, 576 activities / 3,328 course slots / 256 stories. See [implementation](docs/release/V1_6_REPORT.md), [release notes](docs/release/V1_6_RELEASE_NOTES.md) and [manual QA](docs/release/V1_6_MANUAL_QA.md).

## Complete performed gate

The complete combined gate passed in [run 40402480567](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40402480567), candidate `43d68f85bfffd4c585a4994bba4c99d9201e50d3`. The final documentation commit repeats the established gate before main promotion. All 76 runtime assets remain frozen and exactly match the validated showcase and packaged APK.

- `npm run check`: passed — syntax, 576 activities, 3,328 course slots / 3,367 permanent authored IDs, 592 existing Conjugations contexts, 896 focused items, 82 table targets and 1,230 dictionary entries / 1,564 forms.
- `npm test` (hosted Node 22): **1,734 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**. Local Node 24 independently passed **34 file-isolated suites, 0 failures/skips**, 267,728.678213ms. The new Practice suite passes **59 cases**; combined Practice/historical-compatibility coverage also passes. An additional 100 randomized Builder rounds (1,000 selected questions) produced no invalid snapshots.
- `npm run audit`, `node scripts/learner-release-audit.cjs`, `npm run audit:recommendations`, `npm run audit:learning`, and `npm run audit:stories`: passed. Existing identity/payload contracts, historic fixtures, story editions, B-level whole-form substitution checks and curriculum objectives remain protected. Eight anchor recurrence flags remain editorial prompts, not mastery claims.
- `npm run check:browser`: **38,630 assertions / 17 layouts, 0 failed layouts**. All original fifteen scenarios remain, plus two generic Pixel-class width/text scenarios. Coverage includes all 3,328 live course slots, real DOM practice rounds, result navigation/import safety, legacy engine resume, keyboard/radio controls, dictionary separation, final-action reachability, 320px/large-text/landscape, Samsung insets/IME and light/dark modes.
- Fifteen unmodified showcase PNGs and the complete **76-file** runtime hash manifest pass the integrity test. Capture source: [run 40400907561](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40400907561), runtime `9eaacf35d4e326b0f028ad7c12b84ca4be1d0435`. Relevant light/dark, narrow, large-text and landscape rendered screens were visually inspected; these are simulated browser captures.
- `gradle -p android assembleDebug lintDebug testDebugUnitTest`: **BUILD SUCCESSFUL in 21s; 47 tasks executed**. JUnit: **15 tests, 0 failures/errors/skips** (launcher 2, insets 8, native policy 5). Lint: **0 errors, 12 existing warnings**. The downloaded APK contains all 76 runtime files with exact manifest hashes.

## Shipped scope and limits

Practice replaces the visible Games tab; internal Games routes, existing Conjugations/Verb Tables data, historical Review snapshots and unfinished lessons remain compatible. New optional `practiceHub` data is bounded and validated. B1/B2 best scores now survive strict sanitisation without source round history. No practice path completes a course activity or changes placement.

The hub has eleven working activities: Verb in Context, Sentence Builder, Spot the Mistake, Numbers & Time, Listening, Speaking, Shadowing, Verb Trainer, Word Match, Rapid Recall and Fix My Mistakes. A bounded opening-unit starter makes early practice usable; variety grows with course exposure. Word Match is paired multiple-choice recognition, not a drag-and-drop board. Vocabulary distractor selection is conservative deterministic curation, not a semantic translator.

**Ready for physical-device test distribution, with release notes prepared.** No physical-device, emulator, acoustic TTS, independent native-speaker or educator validation is claimed. Generic Pixel-class browser profiles do not claim Pixel/Gboard hardware testing. Speech remains synthetic/device-dependent; speaking is self-assessed and shadowing assisted. No microphone, ASR, cloud grader, accounts, backend, dependencies or new course stages were introduced. Human review of new authored error contrasts and vocabulary distractors remains advisable. CI debug signing keys may differ; preserve a backup before any uninstall.

<details><summary>Historical 1.5 validation record</summary>

# Build and validation status — 1.5.0

Android versionCode **16**; schema-v2 compatibility retained. Starting main: `39ad8188e985277468619326e9ddbf5bdf3f8d67`. The course remains 576 activities / 3,328 slots / 256 stories, A1.1–B2.2. [Implementation report](docs/release/V1_5_REPORT.md), [release notes](docs/release/V1_5_RELEASE_NOTES.md), [Story Bible](docs/STORY_BIBLE.md) and [manual QA](docs/release/V1_5_MANUAL_QA.md) record scope and limits.

## Complete performed gate

The complete combined gate passed in [run 40363368277](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40363368277), candidate `14052d517b0c3fcaba3b89c400b7cadccc3421d2`. The final documentation commit repeats that gate; all 73 runtime assets remain frozen and exactly match the validated showcase and APK.

- `npm run check`: passed — syntax, 576 activities, 3,328 course slots / 3,367 authored question IDs, 592 game questions, 896 focused items, 82 curated table targets and 1,230 dictionary entries / 1,564 forms.
- `npm test` (CI Node 22): **1,675 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**. Local Node 24 independently passed all **33 file-isolated suites, 0 failed/skipped**, 242,753.678411ms. The focused experience/Samsung run passed 69 cases, including the 60-case experience suite.
- `npm run audit` and `node scripts/learner-release-audit.cjs`: passed locally. Permanent identities/order, strict before/after content contracts, historical snapshots, current assessment policies, recommendation quotas and anchor-language audit remain. Eight literal-anchor gaps remain editorial QA prompts, not mastery claims.
- `npm run audit:recommendations`: passed — 30 records / 29 links, no metadata warnings. Catalogue/provider availability notes remain in the v1.4 review; no new runtime fetch is introduced.
- `npm run audit:learning`: passed — all 360 A2.2–B2.2 activities / 160 stories and 44 references; structural QA does not certify naturalness or cognitive load.
- `npm run audit:stories`: passed — all 256 story records/snapshots, 24 revised editions (8 everyday / 8 social / 8 comedy), all 96 B core substitution rows and known-malformation scans across course, game and focused banks.
- `npm run check:browser`: **29,818 assertions / 15 layouts, 0 failed layouts**. All 3,328 live course slots render on S24. All original profiles/assertion intentions remain; additional checks cover the new UX, dictionary, report export, story interaction, title wrapping and stacked-action reachability. Fifteen unmodified v1.5 PNGs / all 73 hashes pass the showcase integrity guard; capture source is [run 40361789202](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40361789202).
- `gradle -p android assembleDebug lintDebug testDebugUnitTest`: **BUILD SUCCESSFUL in 22s, 47 tasks executed** in CI. Native JUnit reports: **15 tests, 0 failures/errors/skips** (policy 5, insets 8, launcher resources 2). Lint: **0 errors, 12 existing warnings** (target/attribute/API/WebView/data-extraction and launcher-shape/monochrome advisories). The downloaded APK contains all 73 runtime files with exact validated hashes.

The dictionary has 954 words / 276 expressions; all prior 1,212 lexical identities remain, with 18 original episode nouns appended. Existing source fixtures are unchanged. Seventy release files cover the implementation, compatibility tests, documentation and showcase.

**Ready for merge and physical-device test distribution, with release notes prepared.** No physical-device, emulator, acoustic TTS, independent native-speaker or educator validation is claimed. No Pixel/Gboard-specific infrastructure is added. Exactly 24 story editions were revised; the other 232 original stories are retained. Human/editorial/real-learner QA remains necessary before broad release. Debug signing keys may differ between CI builds; verify a backup before any uninstall.

<details><summary>Historical 1.4 validation record</summary>

# Build and validation status — 1.4.0

Android versionCode **15**; progress storage remains **schema v2**. Starting main: `77ff528a6dd13f5cbc6d03b08c5a17c4b9b93191`. The course ceiling stays A1.1–B2.2: 576 activities / 3,328 slots / 256 stories. No permanent identity/order/target changes; two B1 live glossary supports and a documented -ER practice metadata move are the only curriculum amendments. See [quality report](docs/release/V1_4_REPORT.md), [content manifest](docs/release/v14-content-support.json) and [recommendation review](docs/release/V1_4_RECOMMENDATIONS.md).

## Current release validation

The complete combined gate passed JavaScript, rendered and Android checks in [run 40325727162](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40325727162), candidate `dbfce17213df69644588496c61bef944b996d9a0`. Its 69 runtime assets exactly match the source of the current showcase. The final documentation commit repeats the established gate before main promotion; runtime assets remain frozen.

- `npm run check`: passed — syntax, 576 activities, 3,328 course slots, 3,367 permanent authored IDs, 592 separate game questions, 896 focused items, 1,212 dictionary entries / 1,564 forms.
- `npm test` (CI Node 22): **1,591 passed, 0 failed, 0 cancelled, 0 skipped, 0 todo**. All 1,506 baseline cases remain, with 85 quality cases added. Local Node 24 independently passed all **32 file-isolated suites, 0 failed/skipped**, 203,353.730614ms.
- `npm run audit`, `node scripts/learner-release-audit.cjs`: passed locally. Original ID/order/content contracts, live structured models, media adaptation, recommendation quotas and the fifteen-anchor / sixteen-unit recurrence audit remain. Eight literal-anchor gaps are QA prompts, not mastery claims.
- `npm run audit:recommendations`: passed — 30 records / 29 URLs, no metadata warnings at the 2026-10-26 review date. Public first-party availability verification is documented separately; optional developer network diagnostics were not used as proof of playback.
- `npm run audit:learning`: passed — all 360 A2.2–B2.2 activities / 160 stories, all 44 references, no structural threshold/duplicate-word flags. This is not automated naturalness or cognitive-load certification.
- `npm run check:browser`: **29,156 assertions / 15 layouts, 0 failed layouts**. All previous 28,556 assertions/profiles remain; 600 assertions cover quality surfaces. All 3,328 course questions still render on the S24 profile. Fifteen current-build showcase PNGs and all 69 runtime hashes pass the screenshot integrity guard.

- `gradle -p android assembleDebug lintDebug testDebugUnitTest`: **BUILD SUCCESSFUL**, 47 tasks executed. JUnit XML: **15 passed, 0 failures, 0 errors, 0 skipped** (eight inset, five policy, two launcher tests). Lint XML: **0 errors / 12 warnings**, matching the baseline warning count.
- Validated code-gate APK: **1,776,875 bytes**, SHA-256 `212c527f7a03d9c1258f5ab40a826d1fd1dc91cf2269fe578aa3199b52b0bc83`. All **69** packaged `assets/` files match the current web source byte for byte. Debug signing keys and APK container bytes may differ on subsequent equivalent builds; compare runtime hashes and retain backup/signing precautions.
- The final diff was reviewed: original fixtures/identity manifests are unchanged; five-tab navigation, dictionary isolation, accent/ñ policy, course/placement/Today/review/game/writing compatibility remain covered. No new stage, runtime dependency, cloud service or app permission was introduced.

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

</details>

</details>

</details>
