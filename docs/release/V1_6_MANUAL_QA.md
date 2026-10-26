# Practice release manual QA

Use backed-up test progress, not production learner history. Browser profiles simulate conditions; real phones remain a separate release exercise.

- Home: fresh learner, established learner, due/no-due; Continue and Today first, only one Practice recommendation; no fabricated weaknesses.
- Practice: exact six-section order, all eleven activities open, unfinished session recommendation, no global grammar picker; all controls reachable after scrolling; blue CTA contrast and pastel cards in light/dark.
- Phones: 320px, S24-class, Pixel-class, large text, landscape, keyboard overlap, gesture/three-button insets; cards collapse without orphan letters, clipped controls or horizontal overflow.
- Verb in Context: ten items, per-blank feedback, challenge, mistakes, bests, explicit higher/lower custom ceiling and saved resume.
- Verb Trainer: recommended three tables, Introduction → Practice → Recall → Mastery support, six persons, hints, typed/choice, custom count/filter, saved session.
- Builder: duplicate tiles, tap add/remove/reset, keyboard, dictionary word vs tile control, correct/incorrect feedback and resume.
- Spot: one authored error, intended correction, natural full model only after attempt, explanation appropriate to actual course exposure.
- Numbers: visual clock accessible time, day/month dates, prices, playback/slow/skip/transcript after attempt.
- Vocabulary: Word Match paired panel vs Rapid immediate click feedback, four distinct meanings, no future dictionary entries, recent rotation.
- Media: first-use and compact UI, no hidden model/transcript leakage, delayed/failing TTS, Back cancellation, self-assessed/assisted evidence.
- Fix My Mistakes: due/recent and related contrasts, no future material or fake completion, retry self-assessed speaking without an accuracy score.
- Results: honest score or self-assessment counts, Strong today/Keep practising only when supported, another round, mistakes and Back to Practice.
- Compatibility: active historical lesson plus each practice session, export/import, old Games routes, B-stage best without source history, Review and Saved Words unchanged.

## Performed and remaining

Performed: full real-DOM flows on 17 simulated browser profiles, including all new rounds/results, native-inset/keyboard simulations and legacy resume. Light/dark compact hubs, narrow matching, large-text construction and landscape captures were visually inspected. The hosted Android debug build, lint and native unit tests passed; APK web-asset hashes were verified. Full exact results are in BUILD_STATUS.md.

Remaining: physical Samsung/Pixel-class phones with actual gesture/three-button navigation, real IME and installed es-ES voice; acoustic review; independent native-speaker/educator review of the authored error contrasts, translation distractors and pacing. This checklist is not a claim that physical/manual sessions were performed.
