# Friends to Amigos v1.6.0

Optional practice now has a home of its own. The new Practice hub brings sentence games, vocabulary, listening, speaking and targeted repairs together while Learn remains the course and Review remains scheduled retrieval. The existing A1.1–B2.2 course, stories and learner history are preserved.

## Download the application

When an APK is attached to a GitHub Release, download the Android debug APK under **Assets**. This source update does not itself publish a GitHub Release. Android requirements remain unchanged.

## Installation and first launch

Version 1.6.0 uses Android versionCode 17 and the existing schema-v2 storage. An in-place update preserves progress when signatures match. CI debug signing keys can differ; export a backup before any uninstall. Android may ask permission to install from the browser/file manager used for sideloading. No microphone or account is required.

## New in v1.6.0

### Practice and navigation

- Practice replaces the Games tab label; its underlying saved routes remain compatible. Review stays a separate tab.
- A prominent recommendation uses unfinished sessions, meaningful weaknesses, repeated mistakes and neglected listening/speaking, then current-path reinforcement.
- Home keeps Continue Learning, Today, relevant Needs Attention and one Practice shortcut instead of a full optional-practice catalogue.
- Bundled vector target, controller, headphones, book, star and tools icons render consistently without platform emoji.

### Games and vocabulary

- **Verb in Context** retains the Conjugations engine, ten-question rounds, adaptive weighting, diagnostic per-blank feedback, challenge and mistake practice.
- **Sentence Builder** uses tap-to-order Spanish tiles and existing structured-answer validation.
- **Spot the Mistake** uses authored single-error contrasts and explanations from A1 to B2.
- **Numbers & Time** combines numbers, prices, dates, visual clocks and occasional audio-first items.
- **Word Match** presents Spanish-to-English matching; **Rapid Recall** gives immediate feedback on a chosen meaning. Both use encountered course dictionary vocabulary and a small opening-unit starter.
- **Fix My Mistakes** offers on-demand eligible snapshots and related material; it does not replace scheduled Review.

### Grammar, listening and speaking

- **Verb Trainer** preserves the Verb Tables engine and six-person Spain-first paradigms, recommended three-table progression, hints, mastery-gated recall, saved sessions and custom counts.
- Detailed grammar ceilings, scope, filters and answer styles are inside individual Custom practice disclosures, not on the hub.
- Listening, Speaking and Shadowing retain existing playback and evidence rules. A bounded greeting/name starter makes early practice usable before larger focused banks unlock.
- Speaking remains self-assessed; Shadowing is assisted/model-based. Neither verifies pronunciation or grammar accuracy.

### Reliability and accessibility

- New practice snapshots/history are optional bounded schema-v2 fields. Historical lesson/review snapshots are not regenerated or repurposed.
- Practice evidence cannot complete a course lesson, checkpoint or placement.
- Touch-sized cards, keyboard controls, dictionary-before-answer and responsive grid fallbacks are retained/extended.

### Bug fixes

- Returning from completed practice cannot recreate an invalid unfinished snapshot.
- Valid B1/B2 Conjugations best scores survive sanitisation and import even when their source rounds have left bounded history.

## Previous release highlights

v1.5 introduced clearer learner journeys, a searchable bidirectional offline dictionary, local answer reports, three-character standalone story editions and stronger B-level distractor validation. Those changes remain intact.

## Known issues and limitations

- Practice is reinforcement, not CEFR certification. Early sessions have a deliberately small greeting/name pool; variety increases with course exposure.
- Vocabulary matching uses finite authored meanings and conservative distractors, not unrestricted translation grading. Word Match is a paired multiple-choice activity, not a drag-and-drop board.
- Speech is synthetic and device-dependent. There is no ASR, recording, microphone permission, cloud grader or pronunciation score.
- Simulated browser/device checks do not establish physical-device or acoustic quality. Independent educator/native-speaker and real-learner validation remain necessary.
- See BUILD_STATUS.md for exact performed validation and APK readiness. No C1/C2 or new course stages were added.
