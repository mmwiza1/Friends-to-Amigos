# Build and validation status

Full-course writing user-testing candidate **1.0.0**, Android **versionCode 11**, storage schema **v2**.
Baseline inspected: latest main `f482893bb55dfd4cfb2ced923a1f2b6cef3763e7`, version 0.10.0/code 10.

## Baseline actually checked

Local `npm run check` and `npm test` passed before changes: Node 24 reported 15 file-isolated suites, zero failures/skips. Baseline CI contained 481 individual cases; 5,368 rendered assertions / 11 layouts; Android 11 unit cases, lint zero errors / 12 warnings.

## Current validation gate

- `npm run check`: passed, 576 activities / 3,328 slots / 3,367 course/special permanent IDs / 592 separate game items / 896 focused media items.
- Full individual-case local run: 645 passed, zero failures/cancelled/skipped/todo, before the final additional open-reflection scheduling case.
- Final writing/B targeted run: 130 passed, zero failures/cancelled/skipped/todo.
- Versioned local `npm test`: 17 file-isolated suites passed, zero failed/cancelled/skipped/todo. Final writing/B checks: 130 individual cases passed.
- Rendered CI and Android compilation/lint/unit validation are pending the validation branch. Exact results will be recorded before main is advanced.
- Local rendered browser attempt was blocked: `net::ERR_BLOCKED_BY_ADMINISTRATOR` on file navigation. No bypass or local rendered pass is claimed. The established GitHub Actions environment performs browser validation.
- Local Gradle/Android SDK/adb/emulator are unavailable. Native checks use the existing workflow, not a claimed local build.

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
