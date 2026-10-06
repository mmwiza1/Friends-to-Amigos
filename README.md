# Friends to Amigos

A personal European Spanish learning app for Android, with a shared offline HTML/CSS/JavaScript interface wrapped in a native Android WebView. No account, backend, paid service or API key is required.

## Playable course

- Cream, coral and teal home screen with Friends to Amigos branding.
- Real daily/longest streak, start/continue/resume button and next practical goal.
- 144 playable activities across A1.1 and A1.2, with eight practical units per stage. Each stage has 24 five-question teaching lessons, 32 five-question stories, eight five-question writing activities and eight nine-question checkpoints: 392 questions per stage, 784 overall.
- Practical can-do goals and a recurring cast across both stages. A1.2 adds preferences, invitations, plans, clothes shopping, home and reflexive routines, progressing to short connected messages.
- Four original mini-scenarios per unit, spaced between learning activities. Read at your own pace before opening five comprehension questions (three choices and two short typed answers), with optional glossary help and passage rereading.
- Recognition → controlled completion → recall → dialogue/contextual response → transfer. Spanish production appears in regular lessons, writing activities and checkpoints: 120 short response slots per stage, 240 overall.
- Feedback explains common misconceptions and the evidence behind story answers, rather than only revealing a solution.
- Story comprehension accepts English or Spanish. Writing activities require Spanish and accept authored variants, punctuation/case differences, and missing vowel accents. The letter ñ remains distinct.
- Missed story questions retain their passage in spaced review.
- Dedicated numbers/prices and time practice.
- Eight-question provisional placement screening. A recommendation may point to a future stage, but only A1.1 or A1.2 can be selected as a playable starting stage.
- Eight-stage A1.1–B2.2 course map. A1.1/A1.2 stage buttons switch playable lessons; A2.1–B2.2 remain planned. No unlock gate prevents revisiting either playable stage.
- Mistakes generated from actual answers and spaced review at 1/3/7/14/30-day intervals.
- Profile capability statement, achievements, unique lessons completed, active learning time, mistakes corrected and seven-day activity chart.
- Export/import progress and local storage. Android export uses the system file picker.
- Spanish (Spain) speech using Android TextToSpeech, or browser speech synthesis. Model answers become audible after checking; stories have an explicitly labelled TTS playback option. Install an es-ES voice on Android for offline speech.
- Spain vocabulary is the default; brief regional notes introduce common alternatives without overwhelming beginners.
- Stable lesson IDs and historical question/passage snapshots preserve saved attempts, reviews, capabilities and export/import compatibility.

## Run a local browser preview

Requires Python 3. No npm dependencies are needed.

```sh
npm start
```

Open http://localhost:4173. For a standalone offline preview, open www/index.html in a browser. Browser file-origin storage and speech support vary.

## Tests

```sh
npm test
node tests/engine.test.cjs
node tests/app.test.cjs
```

The suite covers all lesson IDs and ordering, required question fields, unique correct choices, bilingual comprehension, short Spanish production, misconception feedback, checkpoints, delayed review, and all 784 questions rendering/completing. Legacy fixtures test saved attempts, old two-question lessons, streak/capability records, and Android/browser export/import. Simulated-DOM tests are not a substitute for Android device testing.

## Build Android

Requirements: Java 17+, Gradle 8.9, Android SDK with platform 35 and its build tools. Configure ANDROID_HOME or put sdk.dir in android/local.properties.

```sh
gradle -p android assembleDebug
```

APK: android/app/build/outputs/apk/debug/app-debug.apk. Android 8.0+ is supported. This is a debug build for personal testing, not a Play Store release.

The included `.github/workflows/android.yml` runs tests on pushes and pull requests. APK builds run only when manually requested: Actions → Check and build Android app → Run workflow. After a successful manual run, download friends-to-amigos-android. Unzip it and transfer app-debug.apk to your phone. Allow installation from the chosen file source when Android asks.

## Current limitations

This is a first functional starter version, not the complete proposed course. A1.1 and A1.2 are playable; A2.1–B2.2 content remains to be authored and reviewed. See COURSE_DESIGN.md for the reading and writing progression. Current checkpoints combine recognition with short authored Spanish responses rather than independently assessed conversation, so capability statements should be treated as narrow course milestones. The placement screen is a provisional grammar/vocabulary screening, not adaptive CEFR certification; it does not assess listening, writing or speaking. Listening uses synthetic speech rather than recorded speakers. Progress is per device; exports are manual backups, not cloud sync.

JavaScript syntax checks and 54 engine/simulated-DOM tests pass for the revised course. Earlier Android builds passed on GitHub Actions; no new APK is produced during the current curriculum work. Real-device validation of these new activities is still needed.

Typed answers use a finite, authored answer list, not an open-ended language model grader. Learners are asked for short answers; not every valid paraphrase will be recognised.

## Curriculum references and licensing

The material is original Friends to Amigos content informed by the resource research in [docs/resources](docs/resources/README.md): CEFR can-do principles, Instituto Cervantes scope guidance, and communicative design patterns documented for Semillas and other OERs. See [COURSE_DESIGN.md](COURSE_DESIGN.md) for the unit goals, cast, progression and European Spanish policy, and [the reference record](docs/resources/CURRICULUM_REFERENCE.md) for the source policy.

No third-party exercise or story was imported or closely adapted in this revision. Any future adaptation must verify its exact licence and use the attribution template. No speech corpus has been added: recorded human listening, individual-asset provenance and A2.1–B2.2 remain future work. Existing TTS and the two feedback sound effects remain in place.

Lessons display their practical unit goal while practising. Structured stage targets and original-authorship/outcome metadata support future authoring without adding dependencies or changing saved progress. [Resource implementation status](docs/resources/README.md#implementation-status) distinguishes shipped improvements from reference-only sources and future curated audio.

## A1.2 implementation

A1.2 moves from likes and invitations to shopping, home, routines and a connected daily message. Its original stories average about 48 words (A1.1: 29), with glossary support and English/Spanish short comprehension answers. New IDs use `a12u0l0`, `a12u0story0`, `a12u0write`, `a12u0check`, and the corresponding unit/activity numbers. Existing A1.1 content and IDs are unchanged.

The Home progress bar covers the next/resumed stage rather than halving an A1.1 learner’s percentage when a new stage is added. Continue prefers the selected playable starting stage, then the next unfinished activity in course order. Switching the Learn view or revisiting a lesson does not overwrite the placement recommendation. All current progress, active snapshots and exports still use storage version 1.

A1.2 data lives in `www/a12.js` and `www/a12-stories.js`; `Curriculum.stageUnits`, `getUnit` and `playableStages` provide small shared navigation hooks. The original A1.1 `units`/`unitInfo` APIs remain supported. Finite matching intentionally rejects unlisted paraphrases; native-speaker/educator review and real-device validation remain valuable before wider release.
