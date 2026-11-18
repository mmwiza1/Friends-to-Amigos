# Friends to Amigos v1.11.0

A learning-quality release. It makes answers harder to guess, brings review back over months instead of weeks, corrects explanations that described the wrong sentence, and adds two Practice activities where you produce Spanish yourself: **Write from Memory** and **Listen & Write**.

It also makes the Android app sturdier: rotating the phone no longer reloads the app, and saving a progress backup survives Android restarting the app. The app also starts faster.

The A1.1–B2.2 course, its 576 activities, your saved progress and the offline-first design are unchanged. No account, network service or new permission is added.

## Download the application

Download the Android APK attached to this release under **Assets**. There is one APK for all supported phones. The minimum Android version is unchanged: Android 8.0 (API 26).

## Installation and first launch

- Install over your existing copy: progress, settings, saved words and Practice history are kept. The save format is unchanged and no migration runs.
- No new permissions are requested.
- If you sideload the APK, Android may ask you to allow installs from your browser or file manager the first time.
- As with every test build, export a progress backup from **Profile** first. If Android refuses to update because the APK was signed with a different key, keep that backup before uninstalling, then import it into the new install.

## New in v1.11.0

### Learning and course content

- **Answers can no longer be guessed from their position.** The correct answer used to be the first option in half of A1.1 multiple-choice questions. Options now appear in a fixed shuffled order for each question, so the correct answer is spread evenly across positions. Keyboard arrow keys follow the order on screen.
- **Corrected explanations.** In 38 lesson and checkpoint questions (from A2.2 to B2.1), and in 3 Practice listening and speaking items, the "Why?" explanation described a different sentence from the answer shown. For example, a directions answer was explained with a sentence about a stopped train. Each now explains its own answer. Only the English explanations changed; no Spanish answer, question or option was altered.
- **Review reaches further.** Corrected mistakes used to return every 30 days indefinitely. They now return after 1, 3, 7, 14, 30, 60 and then 120 days. Grammar concepts you know well are re-tested after one and then two months, where the old maximum was two weeks. This keeps material fresh over the long term without over-reviewing it.

### Practice

Practice now has **13 activities**.

- **Write from Memory** (under Vocabulary): see the meaning or situation, then type the Spanish yourself.
  - It reuses the course's own short "write from memory" questions, with their accepted alternatives and common-mistake feedback.
  - It only uses lessons you have completed, never the lesson you haven't reached yet. Complete beginners start with the opening greetings.
- **Listen & Write** (under Listen & Speak): hear a short phrase you have already studied, then type what you heard.
  - The text stays hidden until you answer, and the feedback shows **What you heard** next to your answer.
- **How typed answers are marked in both:**
  - Missing accents, capital letters and punctuation are accepted.
  - **ñ must be typed as ñ**, because *año* and *ano* are different words.
  - If you think a different answer should count, use **I think my answer may also be valid**.
- **Mistakes come back in Review.** A wrong answer in either activity returns in Review and Fix My Mistakes as the same typed question. Lesson questions keep their existing tap-and-build format.

### Audio, listening and speaking

- Listen & Write uses the same rules as other listening questions: the answer box stays locked until the Spanish audio has actually started, and you can replay it at slow or normal speed.
- Audio still uses your phone's offline Spanish (Spain) text-to-speech voice.

### Reliability and technical improvements

- **Rotation keeps your place.** Rotating the phone, folding or unfolding it, or resizing the window no longer reloads the app, so a half-typed answer stays where it is. Switching between light and dark mode still restarts the screen so the colours update correctly; your progress is saved as before.
- **Faster start-up.** The app spends less time preparing the course when it opens. In a browser simulation of a slower phone, the first screen appeared after about 1.25 s instead of 1.77 s (roughly 29% faster). This is a simulation, not a measurement on a real phone.
- **Up-to-date Android behaviour.** The app now uses current Android 11+ and Android 15 system APIs for status-bar and navigation-bar appearance and for speech-engine error reporting. Older approaches are kept only on the older Android versions that need them.

### Bug fixes

- **Backups no longer silently fail.** If Android restarted the app while you were choosing where to save a progress, diagnostics or answer-report export, the save produced nothing. The export is now kept safely until you pick a location, and completes normally.
- **Import after a restart.** If the app restarted while the import file picker was open, the chosen file used to be ignored without explanation. You now see a message asking you to choose the file again.
- **Keyboard detection after rotation (Android 8–10).** The app kept the portrait screen height after you rotated the phone, so it could mistake the shorter landscape screen for an open keyboard and hide the bottom navigation. It now re-measures after rotation.
- **Mismatched explanations** in 38 questions and 3 Practice items, as described above.

## Previous release highlights

### New in v1.10

Material 3-inspired visual consistency: shared light/dark colours, scalable text, 48px touch targets and a clearer active tab, with the same five-tab navigation.

### New in v1.9

Behind-the-scenes restructuring for safer future changes: clearer separation between the app's parts, one owner for your progress data, and consistent light/dark colours.

## Known issues and limitations

- The correct option is still the longest one in about half of multiple-choice questions. Fixing this means rewriting wrong options by hand, which is planned as reviewed content work.
- Typed answers are checked against a list of accepted answers. A natural alternative that isn't on the list can be marked wrong; use **I think my answer may also be valid** to flag it.
- Listen & Write needs an offline Spanish (Spain) voice installed in Android's text-to-speech settings. Recorded native-speaker audio is not included.
- The corrected explanations have had internal review only; independent native-speaker or educator review is still pending.
- Testing used automated checks, browser simulations and the Android build and unit tests. Physical-device and TalkBack testing still needs to be done.

## Validation

<!-- validation:start -->
Pending the final release-commit CI run.
<!-- validation:end -->
