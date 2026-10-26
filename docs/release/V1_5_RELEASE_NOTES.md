# Friends to Amigos v1.5.0

A clearer learning journey and more memorable Spanish stories. This release simplifies Games, Home, Learn, Profile and Review while preserving the existing A1.1–B2.2 course, progress and offline practice.

Find English or Spanish words in the new searchable learner dictionary, follow standalone episodes with Ana, Luis and Marta, and privately report an answer that may deserve editorial review. No new CEFR stage or major game has been added.

## Download the application

For a published GitHub Release, download the Android APK under **Assets**. Normal Android users need the APK, not the source-code archives. The minimum Android version remains Android 8.0; no new architecture requirement is introduced.

## Installation and first launch

Your existing progress, unfinished lessons, scheduled reviews and Saved Words remain compatible; no progress reset is required. Android may ask you to allow installation from the browser/file manager used for sideloading. An in-place update requires a compatible signing key. CI debug builds may use a different key, so export and verify a backup before any uninstall/reinstall. The pronunciation primer uses the existing installed Spanish voice; there is no microphone permission.

## New in v1.5.0

### Games

- Two compact cards: **Conjugations** for sentence practice and **Verb Tables** for focused six-person drills. Cards sit side by side when there is room and stack on narrow/large-text layouts.
- One shared grammar-level control recommends a starting point without locking later levels. A friendly warning explains when a chosen level is ahead of course progress.
- Challenge and detailed table settings live inside their game setup. Saved rounds have compact Continue playing actions.
- Existing question banks, ten-question Conjugations rounds, three-table normal rounds, adaptive support and mistake practice remain.

### UX and navigation

- Home prioritises Continue Learning, Today and Quick Practice. Extra tools use disclosure and become more visible after meaningful practice history.
- Learn puts the current unit and its practical goal first, with one Continue action. All unit activities and earlier lessons remain available through expandable lists.
- Course-position labels connect Home, lessons and completion. Ordinary successful lessons use a compact celebration; the bull marks milestones and encouragement after difficulties.
- Profile prioritises level/streak, Vocabulary and progress. Placement and backup controls remain available lower down.
- Review groups Due Today, Weak Areas and Past Mistakes. Empty states explain what to do next.
- A dismissible Spanish-first reassurance appears once; word-lookup discovery appears only briefly or until acknowledged/used.
- The five main tabs remain Home, Learn, Games, Review and Profile.

### Dictionary and pronunciation

- Profile → Vocabulary offers a searchable **English ⇄ Spanish learner dictionary** and Saved Words. It reuses the existing local course vocabulary, including form-to-lemma information, examples, senses and regional notes where available.
- Ambiguous English searches can show multiple entries: “to know” explains saber versus conocer. Selected frequent nouns receive curated gender/example support. This is a bounded learner dictionary, not an exhaustive general dictionary.
- Hear, Save/Remove and More reuse the existing offline dictionary/TTS tools. Searching or looking up words never counts as a hint or changes assessment.
- An optional, approximately five-minute Spain-Spanish pronunciation primer covers vowels, j, r/rr, ñ, ll/y and c/z, with synthetic examples. It does not record or assess pronunciation.

### Stories and learning content

- A maintained **Story Bible** establishes exactly three primary recurring characters: curious Ana, optimistic Luis and practical Marta. Existing supporting characters remain.
- All 256 story slots gain reading metadata and more comfortable presentation. **24 existing episodes receive carefully authored new editions**, three per stage: eight everyday, eight social and eight comedy/chaos episodes.
- The revised episodes include a missing mobile, a plant occupying the sofa, the wrong wedding venue, a misleading flat photograph and a supposedly talking toaster. They are standalone; callbacks never require another story.
- Chat, dialogue, notices, reviews and different perspectives vary the reading experience. Controlled questions include supported inference, sequence/viewpoint and supplied-message construction. Some episodes offer an optional ungraded prediction.
- The other 232 original episodes remain, with presentation/metadata improvements. This release does not claim the whole catalogue has been rewritten or evenly category-balanced.

### Writing, feedback and reliability

- Incorrect answers foreground the learner response, natural answer and a concise explanation, with fuller teaching behind Why.
- “I think my answer may also be valid” saves an editorial report locally. Export reports from Profile → Data & backup only when you choose. Reports never automatically change correctness or upload writing.
- B1/B2 distractor corrections replace malformed or contradictory alternatives with more plausible learner confusions. Whole-form substitution prevents an `es` replacement from corrupting `Desde`.
- Permanent course/game/media/table IDs and schema-v2 saves remain. Historical review passages stay authoritative; success on a different new story cannot silently clear an older passage-based review.
- Existing Samsung/Android insets, keyboard, Back, dark/light mode and accessibility protections remain. No new Pixel/Gboard-specific test infrastructure is included.

## Previous release highlights

### New in v1.4

- Grammar Reference, short weak-area refreshers, Spanish Help before English Hint, optional confidence and richer mixed review.
- Self-assessed shadowing and post-attempt listening phrase replay.

## Known issues and limitations

- Speech is synthetic Spanish (Spain), depends on the installed voice and does not provide human-speaker variation. Speaking remains self-assessed; there is no recording, recognition or pronunciation score.
- Controlled tasks use authored responses. Open writing receives conservative coaching/model comparison, not arbitrary grammar checking or CEFR certification. Use local answer reports for suspected rejection issues.
- The new episodes and editorial changes still need independent educator/native-speaker review and real learner feedback. Category balance applies to the revised 24, not every retained episode.
- Device-size browser simulations do not prove physical Samsung/IME/acoustic behaviour. Follow the release QA checklist when testing the APK.
