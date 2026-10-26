# v1.6 Practice implementation and QA

Base: `36352bdca18c1ed397c3bd9634e801301b501cb5` (latest main at start). Version 1.6.0 / Android 17. Runtime remains local vanilla JavaScript, no new dependencies.

## Architecture and content

`practice-hub.js` owns reusable cards, vector artwork and transparent recommendation priority: resumable activity → meaningful taught weakness → repeated current-course mistakes → neglected Listening/Speaking after some course experience → Verb in Context. No speech self-assessment is treated as verified accuracy. Home reuses this recommendation. The first A1.1 recommendation is greeting/name construction, before broad grammar practice.

`practice-skills.js` builds ten unique snapshots, prefers unseen IDs in bounded recent history (100), gives six current-stage slots when available, balances topics, and weights real errors/shared evidence. Builder reuses live structured course sentences; vocabulary uses eligible lesson-linked dictionary entries, conservative non-overlapping meaning choices and a bounded greeting/name starter. Cache keys include encountered activity IDs, with eight retained configurations. Vocabulary identities use the earliest canonical curriculum source, so manual revision or later exposure cannot rename a practice item. An internal content pass adds explicit intention/context where another grammatical reading is possible, keeps A1 family vocabulary familiar, and ties hunger practice to its café introduction. Spot the Mistake has 51 original explicit error/correction records in `practice-errors.js`; no runtime corruption creates learner Spanish. Numbers reuse 31 existing items, four authored dates and four listening counterparts; four items include accessible local SVG clocks.

New drills use the shared quiz, dictionary, audio, feedback and structured controls. Rapid Recall auto-checks explicit clicks only; arrow navigation never submits. Word Match has a separate Spanish/English matching panel. Fix My Mistakes combines eligible finite snapshots, related contrasts and course-safe reconstruction; uncertainty/open reflection is not converted into verified accuracy. Sessions can be saved/resumed and retried without changing a course snapshot.

Conjugations/Verb Tables engines are retained as Verb in Context/Verb Trainer. Recommended starts infer current course stage; deliberate advanced grammar choices remain available inside Custom practice. Existing independent grammar-level policy remains for these two established engines. New builder/spot/vocabulary pools use actual reached activities, never the manual grammar override. Focused media retains its stricter taught-bank prerequisites; the early starter uses opening-unit chunks only.

Optional `practiceHub` contains recent IDs, up to 40 summaries and one fully validated active ten-item snapshot. New `practiceVisual` question metadata validates clock bounds. Schema version/key and every course/game/table/focused/dictionary identity remain unchanged. Import rejects damaged attempts; local recovery quarantines originals. Practice success never calls course completion. Recognition has weaker evidence than recall; speaking is self-assessed, shadowing assisted, skips do not create mastery, repeated same-day success cannot manufacture spaced recall.

The B-level best-key fix allows only existing A/B playable-stage keys, modes, bounds and legitimate totals; no weakening of score validation.

## Validation policy

Keep all legacy fixtures/content manifests. The old navigation function is archived in `v16-navigation-baseline.txt` with its original hash, while live tests assert the intentional Practice label and unchanged internal route order/review badge. Presentation expectations change only where this release deliberately replaces old Games/Home UI. Browser profiles retain every original scenario and add two generic Pixel-class width/text profiles, not ASR/Gboard/device-model hacks. Tests cover full playable rounds, real DOM controls, saved snapshots and course safety.

Exact performed results and final screenshot capture are recorded in BUILD_STATUS.md after the release gate. Local browser execution is restricted by socket policy; hosted workflow performs rendered/native checks. No physical device, emulator, acoustic TTS, human educator or native-speaker review is claimed.
