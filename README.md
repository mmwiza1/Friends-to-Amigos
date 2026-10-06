# Friends to Amigos

A personal European Spanish learning app for Android, with a shared offline HTML/CSS/JavaScript interface wrapped in a native Android WebView. No account, backend, paid service or API key is required.

## Included in this first version

- Cream, coral and teal home screen with Friends to Amigos branding.
- Real daily/longest streak, start/continue/resume button and next practical goal.
- 32 playable A1.1 starter lessons/checkpoints across eight units; 48 distinct questions.
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

The included `.github/workflows/android.yml` runs tests and builds the APK on GitHub Actions. After pushing, open Actions → Check and build Android app → successful run → download friends-to-amigos-android. Unzip it and transfer app-debug.apk to your phone. Allow installation from the chosen file source when Android asks.

## Connect to your GitHub repository

Provide the intended repository URL and authenticate via a secure GitHub connection or GitHub CLI's browser flow. Do not paste personal access tokens into chat or commit them.

The project is an independent local Git repository. Before pushing to an existing repository, fetch and inspect its default branch and preserve existing files/history. Do not force-push.

## Current limitations

This is a first functional starter version, not the complete proposed course. The expanded 60-lesson A1.1 course, roughly 100 capability lines, and playable A1.2–B2.2 content remain to be authored and reviewed. Current checkpoints test answer recognition rather than independent conversation, so capability statements should be treated as narrow course milestones. The placement screen is a provisional grammar/vocabulary screening, not adaptive CEFR certification; it does not assess listening, writing or speaking. Listening uses synthetic speech rather than recorded speakers. Progress is per device; exports are manual backups, not cloud sync.

In the development environment, JavaScript checks and automated engine/simulated-DOM tests passed. Browser visual testing and Android compilation/device testing could not be run because socket/network access and Android tools were unavailable. The included build workflow has not yet run. Validate the APK on a real device before sharing it with friends.
