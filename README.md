# Friends to Amigos

An offline-first Android Spanish-learning app, built with vanilla HTML/CSS/JavaScript in a native WebView. It primarily teaches European Spanish. No account, backend, API key or runtime npm dependency is required.

## Playable course through A2.1

A1.1, A1.2 and A2.1 contain **216 activities, 1,248 question slots, 24 practical units and 96 original stories**. Each stage has 72 activities and 416 questions. The original A1 course is unchanged. A2.2 and B stages remain planned and unavailable.

- Practical can-do goals, a recurring cast, and recognition → completion → recall → contextual response → transfer.
- 360 constrained Spanish-writing slots, with authored alternatives and teaching feedback. Story comprehension accepts English or Spanish; writing requires Spanish. Matching tolerates punctuation, case, spaces and vowel accents, while preserving ñ and negation.
- Four short stories per unit, with glossary support, learner-paced reading and passage rereading during questions and review.
- **72 audio-first listening questions**, including one in every checkpoint. Listen to familiar Spanish before answering; the transcript appears only after submitting or deliberately skipping. Comprehension mixes choices and short typed responses.
- **24 speak-aloud retrieval chunks**. Attempt aloud, reveal one possible model, optionally hear it, then choose “I got it” or “Needs practice”. Speaking is self-assessed, excluded from scored accuracy, and never automatically assesses pronunciation. Needs-practice responses enter spaced review.
- Separate listening/speaking practice for each stage, selecting familiar units and rotating toward less recently retrieved items.
- Nine-question practical checkpoints: contextual recognition, completion, listening and four distinct Spanish responses. The 80% threshold remains; repeating completion does not duplicate capabilities or lesson totals.
- Mistake review at 1/3/7/14/30-day intervals, requiring three successful scheduled reviews to mark an item corrected. Immediate retries cannot inflate this count.
- Daily/longest streak, active learning time, achievements, import/export and resumable historical attempts.
- A completion Home screen for the whole A1 course, with practical skills, learning statistics, outstanding reviews and continued listening/speaking practice. This is a course milestone, **not formal CEFR certification**.
- All playable stages remain revisitable. The eight-question placement screening is provisional and does not assess listening, speaking or independent production. Future-stage recommendations never expose unavailable lessons.

Listening and model pronunciation use **synthetic Spanish (Spain) speech**, not recorded speakers. Install an offline es-ES voice. Android selects a local voice; the browser refuses explicitly remote voices and asks the learner to retry if the voice list is not ready. Missing speech does not trap the learner: skip the listening item as a missed question and save it for review. Optional local recording paths can later supplement TTS, but no learning recordings or speech datasets are shipped. Existing compressed success/failure sounds and lesson bull artwork remain unchanged.

## Mobile experience

Android Back saves an unfinished lesson, returns practice/placement/secondary screens to their parent, returns Learn/Games/Review/Profile to Home, then backgrounds Home. Both button and modern gesture Back delegate to app state.

Today’s session resumes a saved lesson first; otherwise it guides up to five due reviews, the next required lesson and one short listening/speaking item. It uses existing review/completion records and never hides manual navigation. The duration is a suggestion, not a timed requirement.

A chosen later-stage placement means earlier foundations are assumed and remain available for optional revision. Automatic continuation/completion follows the required starting path; it never fabricates A1.1 completion or achievements. Completion statistics count only activities actually completed.

Listening remains locked until a recording or TTS reports playback start. Failed recordings can fall back to TTS; complete failure keeps controls locked and offers skip-to-review. Slow (0.75×, default) and Normal (1×) apply within the current app session. The question bar shows the current position, including the first question.

Android now publishes real system-bar/display-cutout insets in CSS pixels; CSS alone owns safe-area spacing, including fixed navigation, final scrollable controls and toasts. Keyboard overlap is counted only if resize has not already removed it. Focused text fields scroll into view and temporarily hide app navigation. Go/Enter checks a populated unlocked answer once, using the same scoring flow as the button.

Question instructions make the action explicit. Choice cards use visible radio indicators and accessible selection states. Incorrect answers show the learner’s response, a natural model and why; authored mistake explanations take priority over cautious word comparison. The previous 832 A1 prompts and their Spanish targets/accepted answers remain unchanged; A2.1 adds original learner-facing tasks.

The launcher now shows the existing happy chibi bull’s face: full-colour adaptive/round/density assets and an Android 13 monochrome layer. The original lesson artwork is preserved. Browser/Android system dark preference selects readable dark equivalents; the existing navy/coral/teal design is retained.

## Games and lesson continuation

The Games tab offers **Conjugations: 208 original authored questions (104 A1.1, 104 A1.2)**. Select forms to fill 1–3 blanks, then check the sentence. Each blank explains the chosen form and correct pattern; options are accessible radios with large touch targets. There are no lives or penalties.

Eligibility follows completed teaching activities and context units, not the profile/viewed stage or game score. Each form names a positive course model as its prerequisite, and each context waits for its unit’s three teaching lessons. A1.2 placement assumes A1.1 foundations, without fabricating completions; new A1.2 forms require their teaching activities. A fresh learner needs introductory/personal-information practice before enough varied material is available for a ten-item round.

Rounds contain ten unique eligible items with shuffled questions/options, subject-person coverage and weighted verb/concept variety. A1.2 normal rounds mix six current-stage items with four eligible foundation items. Up to 30 recently shown items are avoided when enough alternatives exist. Mistakes increase question/concept weights; repeated success reduces weights without removing retrieval forever. Rotation relaxes when the unlocked bank is small. The result shows score/best at the unlocked unit level, modest concept signals and a happy bull. Up to five **Practise my mistakes** items favour related alternatives, concentrating on the actual incorrect verb/person rather than every concept in a multi-blank question. **Challenge me** uses the hardest already eligible material once multi-blank practice is available. A higher difficulty appears only through course progress.

Game rounds save separately, including shuffled options and checked feedback. Android Back returns to Games safely; Resume saved game preserves the attempt. Game scores never complete lessons/checkpoints, award capabilities or alter placement/start stage. Completed rounds count as practice days, and active game time uses the existing session-time records.

After a passed normal lesson, **Continue learning** starts the next required lesson, then due review, then short listening maintenance when the playable path is complete. Back to Home remains available. Failed lessons offer Try again and Review mistakes, without forward continuation. Today retains its own continuation.

## Connected practice and review

**Conjugation Blanks** adds six-person Spain-first tables beside Conjugations. Normal games contain three tables, progressing through four supported/recall phases per course unit. Practice offers 3/5/10/15/20 tables, current-unit/current-stage/all-unlocked scopes, selectable forms or typed recall, teaching hints and mistake practice. The curated pool has 35 verb/tense targets (10 A1.1, 14 A1.2, 11 A2.1); source activities control unlocks. Dense six-blank tables require demonstrated spaced unassisted recall, not clicks.

Shared local evidence connects course outcomes and verb/person/pattern weaknesses across both games, course writing and review. Assisted/recognition answers count less than independent recall; same-session repetition cannot create spaced mastery. **Today’s Review** combines due historical mistakes, older completed material and optional weak-table follow-up. **Weak Areas / Mistakes** is available from Review, including legacy mistakes without new evidence. Neither practice nor mastery can complete a course lesson or alter placement.

A2.1 teaches recent perfect and selected finished-event past forms, transport comparisons, tickets/accommodation, simple problems/symptoms and connected plans. The A1 completion milestone remains accurate; Continue now offers the new A2.1 stage. Placement can select playable A2.1 provisionally, while A2.2/B stages stay unavailable. See [the implementation/design record](docs/A2_AND_PRACTICE.md).

## Progress safety

State is now schema **version 2**, discovered under the existing `friends-to-amigos-v1` storage key. Version-1 backups remain supported. The optional `startStage`, `games`, `mastery` and `blanks` fields remain within schema v2. Missing game data defaults safely; game progress and active snapshots export/import independently of course records. Older accepted A1.2 placement saves infer A1.2; other historical saves default to the full A1.1 path. Viewing or revising a stage never changes the required starting path. Migration preserves valid profile, placement, completion, capabilities, review schedules, events, streak days, time and active question/passage snapshots. It is deterministic and idempotent. A one-time untouched v1 local backup is written before the migrated save.

Every authored question has a permanent ID. New reviews use that ID, not prompt text. Safely identifiable legacy reviews migrate to it; unmatched or semantically replaced questions retain independent legacy identities and their original content. Invalid local sections are preserved in an exported recovery area where possible. Unreadable or unsupported newer saves are protected from automatic overwrite. Imports are validated before confirmation/adoption; unsafe imports leave existing progress unchanged.

See [state and question contracts](docs/STATE_AND_QUESTIONS.md). Back up before changing devices or Android signing identities; local storage is not cloud sync.

## Browser preview and checks

Requires Python 3 for preview and Node.js 22+ for checks; no npm install is needed.

```sh
npm start
npm run check
npm test
npm run audit
npm run check:browser # requires a local Chrome/Chromium binary
```

Open http://localhost:4173, or open `www/index.html` directly. File-origin storage and offline voice availability depend on the browser. `check` validates syntax, identities, ordering, grading data and future-stage availability. `audit` emits reproducible surface-word recycling statistics, with its limitations stated in the output.

The suite has **351 individual tests**, including 59 new focused-media/content/compatibility regressions in this release. It renders and completes all 216 activities/1,248 course questions, protects exact original A1 activity payloads and legacy backups, and checks table targets, eligibility, hints, recall, weak areas and daily review. See [BUILD_STATUS.md](BUILD_STATUS.md) for exact native/browser results and their limits.

## Android build

Requirements: Java 17+, Gradle 8.9, Android SDK platform 35/build tools 35.0.0. Set `ANDROID_HOME` or `android/local.properties` (`sdk.dir`). Android 8.0+ is supported; use a current Android System WebView.

```sh
gradle -p android assembleDebug lintDebug testDebugUnitTest
```

The APK is `android/app/build/outputs/apk/debug/app-debug.apk`. Version code 8/name 0.8.0 identifies this app update; it is not a CEFR level or a declaration of course certification.

GitHub Actions runs static checks and tests on pushes/PRs. Android build, lint and unit checks now run on pushes/PRs as well as manual runs. The `friends-to-amigos-android` artifact contains the debug APK. A maintainer must preserve the signing key for in-place upgrades. Fresh CI debug keys may not match an already installed APK; do not uninstall a learner's app without first exporting and verifying a backup.

The current workspace has no Gradle, Android SDK, adb or emulator. GitHub CI performs native build/lint/unit checks and real headless-browser checks; see BUILD_STATUS.md for the exact results. The maintainer tested the previous APK on a Galaxy S24; this update still requires a physical-device retest. The [physical-device checklist](BUILD_STATUS.md#physical-device-checklist) is a release gate.

## Architecture and authorship

`app.js` coordinates state/navigation/sessions. `storage.js`, `speech.js`, `screens.js` and `quiz-view.js` separate validation/persistence, media, ordinary screen rendering and question rendering. `course-path.js` shares required-path/completion/Today selection. `conjugations-bank.js`, `games.js` and `games-view.js` hold the original game bank, eligible/adaptive session logic and game rendering. `mastery.js`, `conjugation-targets.js`, `blanks.js`, `learning-practice.js` and `practice-view.js` add shared evidence, curated paradigms, table sessions and connected review without replacing legacy queues. `a21-data.js`/`a21.js` author and assemble the new stage. `viewport.js` handles native/browser geometry; `answer-feedback.js` compares finite models without changing grading. Curriculum assembly keeps stage source modules, a permanent ID manifest, targeted reviewed amendments and original audio/speaking data. The presentation-only `learner-clarity.js` overlay runs after the legacy compatibility archive is captured. All scripts/assets load locally; there is no framework, cloud grader or automatic speech recognition.

The course material is original Friends to Amigos content, informed by the documented CEFR/Cervantes and OER pedagogical references. No third-party exercise, story, translation or recording was copied or closely adapted. Future reuse requires exact-item licence verification and attribution. See [COURSE_DESIGN.md](COURSE_DESIGN.md), [resource status](docs/resources/README.md#implementation-status) and the [A1 audit](docs/A1_STABILITY_REPORT.md).

Finite matching can reject valid unlisted paraphrases. TTS lacks human-speaker variation; speaking is self-assessed; independent conversation is not assessed. A native Spanish educator should review phrasing, pacing and accepted alternatives before a wider release. Broader free-form assessment, especially before B1, and curated human listening remain future work. A2.1 is implemented; A2.2 remains planned.

## Focused Listening and Speaking (0.8.0)

Home and course-completion maintenance offer repeatable ten-item sessions. Each mode has **168 local authored items: 56 each for A1.1, A1.2 and A2.1**. Completing a unit’s three teaching activities makes its practice eligible; earlier stages may be assumed through placement. No profile-only unlocks. A very early learner needs two taught units before ten distinct eligible items are available.

Sessions rotate recent items, diversify topics/tasks, target mistakes and recycle earlier stages (normally 6 current + 4 earlier). Listening remains audio-first, with playback-start locking, Slow/Normal replay, transcript after checking and failure/skip-to-review. Speaking shows **One possible response** only after reveal and uses **I got it / Needs practice**: no microphone, recording, speech recognition or pronunciation assessment.

Mistakes feed existing spaced review and understandable Weak Areas. Positive self-assessment is low-weight evidence, not proof of mastery. Save & leave keeps an independent ten-item snapshot without replacing your saved course lesson. First-use explanations become compact after successful listening or deliberate speaking self-assessment; expandable information remains available. See [the quality report](docs/LISTENING_SPEAKING_QUALITY.md) and [validation status](BUILD_STATUS.md).
