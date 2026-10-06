# Friends to Amigos

An offline-first Android Spanish-learning app, built with vanilla HTML/CSS/JavaScript in a native WebView. It primarily teaches European Spanish. No account, backend, API key or runtime npm dependency is required.

## Playable A1 course

A1.1 and A1.2 contain **144 activities, 832 question slots, 16 practical units and 64 original stories**. Each stage has 72 activities and 416 questions. A2.1–B2.2 remain planned and unavailable.

- Practical can-do goals, a recurring cast, and recognition → completion → recall → contextual response → transfer.
- 240 constrained Spanish-writing slots, with authored alternatives and teaching feedback. Story comprehension accepts English or Spanish; writing requires Spanish. Matching tolerates punctuation, case, spaces and vowel accents, while preserving ñ and negation.
- Four short stories per unit, with glossary support, learner-paced reading and passage rereading during questions and review.
- **48 audio-first listening questions**, including one in every checkpoint. Listen to familiar Spanish before answering; the transcript appears only after submitting or deliberately skipping. Comprehension mixes choices and short typed responses.
- **16 speak-aloud retrieval chunks**. Attempt aloud, reveal one possible model, optionally hear it, then choose “I got it” or “Needs practice”. Speaking is self-assessed, excluded from scored accuracy, and never automatically assesses pronunciation. Needs-practice responses enter spaced review.
- Separate listening/speaking practice for each stage, selecting familiar units and rotating toward less recently retrieved items.
- Nine-question practical checkpoints: contextual recognition, completion, listening and four distinct Spanish responses. The 80% threshold remains; repeating completion does not duplicate capabilities or lesson totals.
- Mistake review at 1/3/7/14/30-day intervals, requiring three successful scheduled reviews to mark an item corrected. Immediate retries cannot inflate this count.
- Daily/longest streak, active learning time, achievements, import/export and resumable historical attempts.
- A completion Home screen for the whole A1 course, with practical skills, learning statistics, outstanding reviews and continued listening/speaking practice. This is a course milestone, **not formal CEFR certification**.
- Both playable stages remain revisitable. The eight-question placement screening is provisional and does not assess listening, speaking or independent production. Future-stage recommendations never expose unavailable lessons.

Listening and model pronunciation use **synthetic Spanish (Spain) speech**, not recorded speakers. Install an offline es-ES voice. Android selects a local voice; the browser refuses explicitly remote voices and asks the learner to retry if the voice list is not ready. Missing speech does not trap the learner: skip the listening item as a missed question and save it for review. Optional local recording paths can later supplement TTS, but no learning recordings or speech datasets are shipped. Existing compressed success/failure sounds and bull artwork remain unchanged.

## Mobile experience

Android Back saves an unfinished lesson, returns practice/placement/secondary screens to their parent, returns Learn/Review/Profile to Home, then backgrounds Home. Both button and modern gesture Back delegate to app state.

Today’s session resumes a saved lesson first; otherwise it guides up to five due reviews, the next required lesson and one short listening/speaking item. It uses existing review/completion records and never hides manual navigation. The duration is a suggestion, not a timed requirement.

A chosen A1.2 placement means earlier foundations are assumed and remain available for optional revision. Automatic continuation/completion follows the required starting path; it never fabricates A1.1 completion or achievements. Completion statistics count only activities actually completed.

Listening remains locked until a recording or TTS reports playback start. Failed recordings can fall back to TTS; complete failure keeps controls locked and offers skip-to-review. Slow (0.75×, default) and Normal (1×) apply within the current app session. The question bar shows the current position, including the first question.

The local Android bull/speech-bubble launcher and adaptive/round icon, platform splash, system bars and WebView insets preserve the coral/teal style. Browser/Android system dark preference selects readable dark equivalents; light styling is unchanged.

## Progress safety

State is now schema **version 2**, discovered under the existing `friends-to-amigos-v1` storage key. Version-1 backups remain supported. The optional `startStage` field is added within schema v2. Older accepted A1.2 placement saves infer A1.2; other saves default to the full A1.1 path. Viewing or revising a stage never changes the required starting path. Migration preserves valid profile, placement, completion, capabilities, review schedules, events, streak days, time and active question/passage snapshots. It is deterministic and idempotent. A one-time untouched v1 local backup is written before the migrated save.

Every authored question has a permanent ID. New reviews use that ID, not prompt text. Safely identifiable legacy reviews migrate to it; unmatched or semantically replaced questions retain independent legacy identities and their original content. Invalid local sections are preserved in an exported recovery area where possible. Unreadable or unsupported newer saves are protected from automatic overwrite. Imports are validated before confirmation/adoption; unsafe imports leave existing progress unchanged.

See [state and question contracts](docs/STATE_AND_QUESTIONS.md). Back up before changing devices or Android signing identities; local storage is not cloud sync.

## Browser preview and checks

Requires Python 3 for preview and Node.js 22+ for checks; no npm install is needed.

```sh
npm start
npm run check
npm test
npm run audit
```

Open http://localhost:4173, or open `www/index.html` directly. File-origin storage and offline voice availability depend on the browser. `check` validates syntax, identities, ordering, grading data and future-stage availability. `audit` emits reproducible surface-word recycling statistics, with its limitations stated in the output.

The final suite has **141 individual tests** (29 engine/data, 49 simulated-DOM app, 14 identity/curriculum, 30 storage/migration, 12 speech, 7 mobile/product). It renders and completes all 144 activities/832 course questions, and protects old saves and both export paths. Simulated browser/bridge tests do not establish real Android or acoustic performance. See [BUILD_STATUS.md](BUILD_STATUS.md) for the exact validation boundary.

## Android build

Requirements: Java 17+, Gradle 8.9, Android SDK platform 35/build tools 35.0.0. Set `ANDROID_HOME` or `android/local.properties` (`sdk.dir`). Android 8.0+ is supported; use a current Android System WebView.

```sh
gradle -p android assembleDebug lintDebug testDebugUnitTest
```

The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. Version code 4/name 0.4.0 identifies this app update; it is not a CEFR level or a declaration of course certification.

GitHub Actions runs static checks and tests on pushes/PRs. Android build, lint and unit checks now run on pushes/PRs as well as manual runs. The `friends-to-amigos-android` artifact contains the debug APK. A maintainer must preserve the signing key for in-place upgrades. Fresh CI debug keys may not match an already installed APK; do not uninstall a learner's app without first exporting and verifying a backup.

The current workspace has Java 21 but no Gradle, Android SDK, adb or emulator. Native debug build, lint and unit tests passed in GitHub CI. No emulator/physical-device or acoustic tests were performed; see BUILD_STATUS.md for results and the remaining checklist. The [physical-device checklist](BUILD_STATUS.md#physical-device-checklist) is a release gate.

## Architecture and authorship

`app.js` coordinates state/navigation/sessions. `storage.js`, `speech.js`, `screens.js` and `quiz-view.js` separate validation/persistence, media, ordinary screen rendering and question rendering. `course-path.js` shares required-path/completion/Today selection. Curriculum assembly keeps stage source modules, a permanent ID manifest, targeted reviewed amendments and original audio/speaking data. All scripts/assets load locally; there is no framework, cloud grader or automatic speech recognition.

The course material is original Friends to Amigos content, informed by the documented CEFR/Cervantes and OER pedagogical references. No third-party exercise, story, translation or recording was copied or closely adapted. Future reuse requires exact-item licence verification and attribution. See [COURSE_DESIGN.md](COURSE_DESIGN.md), [resource status](docs/resources/README.md#implementation-status) and the [A1 audit](docs/A1_STABILITY_REPORT.md).

Finite matching can reject valid unlisted paraphrases. TTS lacks human-speaker variation; speaking is self-assessed; independent conversation is not assessed. A native Spanish educator should review phrasing, pacing and accepted alternatives before a wider release. Broader free-form assessment, especially before B1, and curated human listening remain future work. A2.1 has not been implemented.
