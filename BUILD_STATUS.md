# Build and validation status

Full-course writing user-testing candidate **1.0.0**, Android **versionCode 11**, storage schema **v2**.
Baseline inspected: latest main `f482893bb55dfd4cfb2ced923a1f2b6cef3763e7`, version 0.10.0/code 10.

## Baseline actually checked

Local `npm run check` and `npm test` passed before changes: Node 24 reported 15 file-isolated suites, zero failures/skips. Baseline CI contained 481 individual cases; 5,368 rendered assertions / 11 layouts; Android 11 unit cases, lint zero errors / 12 warnings.

## Final validation gate

Validated implementation commit `7d4f4d84bf9174f33ae7e9fc4402ebf357f4afe7` on the validation branch; the release commit adds final documentation only. [Successful full workflow 37644212496](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/37644212496) includes the debug APK, browser screenshots and native reports.

| Validation | Exact result |
| --- | --- |
| `npm run check` | Passed: syntax, 576 activities / 3,328 slots / 3,367 course/special permanent IDs / 592 game items / 896 focused items. |
| `npm test` in CI, Node 22 | **649 passed**, 0 failed/cancelled/skipped/todo. Baseline 481; 168 additional individual cases. |
| Local `npm test`, Node 24 | **17 file-isolated suites passed**, 0 failed/cancelled/skipped/todo. |
| Local `node --test --test-isolation=none tests/*.test.cjs` | **649 passed**, 0 failed/cancelled/skipped/todo. |
| `npm run check:browser` in CI | **13,981 assertions / 11 layouts passed** (1,271 per layout); baseline 5,368 / 11. |
| Android `assembleDebug` | Passed; 1.0.0 / versionCode 11 test APK produced. |
| Android `lintDebug` | Passed, **0 errors / 12 existing warnings**. |
| Android `testDebugUnitTest` | **11 passed**, 0 failures/errors/skips: native policy 3, insets 6, launcher resources 2. |
| Writing content safeguards | 30 unexpected-valid regression responses and 480 new B model diagnostic checks pass. Not a population error-rate estimate. |

All 576 activity entries and all playable question rendering/completion are covered by the regression harness. Browser coverage adds every new B activity, full passages, multiline writing/newline, uncertainty/revision/reflection/resume, stage navigation, B media/games/tables and the final milestone. Eleven layouts cover 320px, S24-class and larger widths, portrait/landscape, light/dark, large text and simulated native keyboard/insets. Representative S24 dark/large-text writing, narrow light feedback and landscape B2 story screenshots were visually inspected.

An initial validation-branch run caught a multiline sample escape error in the browser test; it was fixed and the complete workflow rerun successfully. No behavioural assertion was bypassed. The final mastery safeguard prevents unverified reflections from inferring model verb knowledge.

Local Chromium file navigation is blocked by `net::ERR_BLOCKED_BY_ADMINISTRATOR`; no bypass or local rendered pass is claimed. Local Gradle/SDK/adb/emulator are unavailable; actual native validation ran in the established GitHub Actions workflow. **No emulator, physical-device, acoustic TTS or independent native-speaker/educator validation occurred.** CI bridge success does not prove audible voice quality.

Lint warnings are unchanged from baseline: target API age, unused/obsolete API attributes, JavaScript-enabled WebView review, data-extraction configuration, launcher-mask and monochrome-icon heuristics. They remain documented rather than misreported as a warning-free build.

The changed product is reviewed against preserved A1–A2 hashes/identities. New B IDs have a frozen manifest. The writing audit and content/performance facts are in [docs/release](docs/release). No third-party audio/text corpus or new runtime dependency was added.

## Physical-device checklist

No physical-device/emulator/acoustic/native-speaker testing occurred for this release. The earlier maintainer S24 test is not a test of the new B/writing content. Before wider distribution use [USER_TESTING.md](docs/release/USER_TESTING.md), including:

1. Verify a backup and signing key before upgrading; do not uninstall without backup recovery.
2. S24 gesture/three-button portrait/landscape, large text, 320px-class width and light/dark: status/system navigation/cutout, final controls and keyboard.
3. Short-answer Go versus multiline newline, long B2 writing, model/Why, revision and Save/Back/resume before and after reflection.
4. All eight stages, placement/start path, Today/review/Weak Areas, games/level changes and B2 milestone; no C continuation.
5. Audible offline es-ES .75×/1×, failure/skip, background/Back cancellation; automated bridge tests do not prove acoustic quality.
6. Deliberately submit valid unlisted Spanish, wrong person, spelling/word-order changes, incomplete/off-task answers and quoted errors; record false acceptance and rejection separately.
7. Native Spanish educator review of B pacing, grammar, naturalness, glossaries, register, inference support and task/model alignment.

Freeze expansion for user testing; this is not formal CEFR certification.
