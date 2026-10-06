# Friends to Amigos

A personal European Spanish learning app for Android, with a shared offline HTML/CSS/JavaScript interface wrapped in a native Android WebView. No account, backend, paid service or API key is required.

## Included in this first version

- Cream, coral and teal home screen with Friends to Amigos branding.
- Real daily/longest streak, start/continue/resume button and next practical goal.
- 72 playable A1.1 activities across eight topic units: 24 five-question lessons, 32 short stories, eight five-question Spanish-writing lessons, and eight nine-question checkpoints.
- Four stories per unit, spaced between learning activities. Read at your own pace before opening five comprehension questions (three choices and two short typed answers).
- Story comprehension accepts English or Spanish. Writing activities require Spanish and accept authored variants, punctuation/case differences, and missing vowel accents. The letter ñ remains distinct.
- Missed story questions retain their passage in spaced review.
- Dedicated numbers/prices and time practice.
- Eight-question provisional placement screening and selectable recommended stage.
- Eight-stage A1.1–B2.2 course map; later stages clearly marked as planned.
- Mistakes generated from actual answers and spaced review at 1/3/7/14/30-day intervals.
- Profile capability statement, achievements, unique lessons completed, active learning time, mistakes corrected and seven-day activity chart.
- Export/import progress and local storage. Android export uses the system file picker.
- Spanish (Spain) speech using Android TextToSpeech, or browser speech synthesis. Install an es-ES voice on Android for offline speech.

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

Engine tests cover curriculum validity, delayed review correction, completion deduplication, checkpoints, streaks and placement thresholds. App tests exercise rendered navigation and learning flows in a simulated DOM. They are not a substitute for Android device testing.

## Build Android

Requirements: Java 17+, Gradle 8.9, Android SDK with platform 35 and its build tools. Configure ANDROID_HOME or put sdk.dir in android/local.properties.

```sh
gradle -p android assembleDebug
```

APK: android/app/build/outputs/apk/debug/app-debug.apk. Android 8.0+ is supported. This is a debug build for personal testing, not a Play Store release.

The included `.github/workflows/android.yml` runs tests on pushes and pull requests. APK builds run only when manually requested: Actions → Check and build Android app → Run workflow. After a successful manual run, download friends-to-amigos-android. Unzip it and transfer app-debug.apk to your phone. Allow installation from the chosen file source when Android asks.

## Current limitations

This is a first functional starter version, not the complete proposed course. Playable A1.2–B2.2 content remains to be authored and reviewed. See COURSE_DESIGN.md for the reading and writing progression. Current checkpoints test recognition; writing activities assess short authored responses rather than independent conversation, so capability statements should be treated as narrow course milestones. The placement screen is a provisional grammar/vocabulary screening, not adaptive CEFR certification; it does not assess listening, writing or speaking. Listening uses synthetic speech rather than recorded speakers. Progress is per device; exports are manual backups, not cloud sync.

JavaScript engine and simulated-DOM tests cover reading-before-questions, mixed question types, bilingual comprehension, Spanish-only writing, saved answers, review context, and curriculum structure. Earlier Android builds passed on GitHub Actions; no new APK is produced during the current curriculum work. Real-device validation of these new activities is still needed.

Typed answers use a finite, authored answer list, not an open-ended language model grader. Learners are asked for short answers; not every valid paraphrase will be recognised.
