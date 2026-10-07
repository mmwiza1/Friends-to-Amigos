# Listening, speaking and A2.1 quality release — 0.8.0

## Content and selection

Baseline: main `390e3eccbb06fb011bde186a5c98da6255d40523`, 216 course activities/1,248 slots/1,287 permanent course and special-practice IDs, 208 contextual game questions and 35 curated table targets. All remain structurally unchanged. A1 payload hashes remain exact; only four existing A2.1 activity payloads intentionally change.

| Bank | A1.1 | A1.2 | A2.1 | Total |
|---|---:|---:|---:|---:|
| Focused Listening | 56 | 56 | 56 | 168 |
| Focused Speaking | 56 | 56 | 56 | 168 |

There are 248 newly authored items and 88 reused original course items with independent stable IDs/source provenance. Listening varies explicit facts, numbers/times/prices, person/place/action, preferences, intentions, reasons, sequence, dialogue, form contrasts and supported inference. Speaking develops retrieval, combined sentences, contextual responses, reasons and connected messages. All new material is original, informed by pedagogical references; no external datasets or recordings were imported.

Each unit’s three core teaching activities must be completed before its bank becomes eligible. Placement can assume earlier stages, but selecting a profile stage alone cannot unlock material. A1.1 takes ten eligible A1.1 items; A1.2 normally takes six A1.2/four A1.1; A2.1 takes six A2.1/two A1.2/two A1.1. Shortfalls redistribute within the eligible pool only. Below ten eligible items, guidance asks the learner to complete teaching activities rather than starting a short or untaught session.

Weighted draws consider item/topic weakness, unresolved existing reviews, requested weak area and topic/task diversity. Fresh eligible questions are preferred over the last 30 shown per mode; when necessary, least-recent items return. Questions and choice options are shuffled, with no within-session duplicates. Weakness does not override prerequisites. Repeated practice can favour related topics before exact-item retrieval later.

## Feedback, evidence and UX

Listening is audio-first: transcript hidden until attempted, playback-start locking, replay and .75×/1× rates, synthetic Spain-Spanish voice status, failure guidance and skip-to-review. No acoustic comprehension is inferred merely from a bridge success.

Speaking requires saying an answer aloud before revealing **One possible response**, sometimes with a natural alternative. Optional model TTS follows reveal. **I got it / Needs practice** are self-assessments, not automatically verified accuracy. No microphone permissions, recording, ASR or pronunciation scoring exist.

Both modes update existing item/topic/outcome evidence and SRS mistakes. Needs practice increases future selection priority and can surface a readable Weak Area. Existing evidence caps prevent same-session successes creating spaced mastery; speaking evidence remains deliberately low-weight. Session summaries show listening correct/needs-review counts or speaking got-it/needs-practice judgments, with observed topic support rather than mastery claims.

First-use guidance becomes compact after a successful listening answer or deliberate speaking assessment. Expandable information preserves voice limitations and self-assessment transparency. Home provides resume for an independent saved ten-item snapshot. Course attempts remain separate. Back/background/navigation stop speech and preserve the attempt; current snapshots remain authoritative on resume/import.

## Intentional A2.1 corrections

1. `a21u5story2`: “Marta va a dejar la compra en la puerta. Ana va a descansar sin salir de casa.” Adds the missing sentence boundary only.
2. `a21u6write` pharmacy question: prompt becomes “Ask if there is a pharmacy nearby.” Canonical answer becomes “¿Hay una farmacia cerca?”. The actual old main answer was “¿Dónde hay una farmacia cerca?”; it remains an accepted alternative, preserving the accepted-answer set and older snapshots.
3. `a21u4story0`: past narration uses “La recepcionista dijo: «La habitación ya está lista».” Direct speech remains present, naturally.
4. `a21u4story1`: “Esta vez la puerta se abrió.” The matching glossary becomes `se abrió` (“opened”). Meaning, activity/question identities and difficulty are retained.

A narrow scan covered all 32 A2.1 stories and associated core, writing and listening material: punctuation, duplicates, finite alternatives, tense context, agreement, prompts/targets, glossary alignment and Spain-first usage. No further clear course errors justified edits. Tests freeze the revised full A2.1 activity hashes and prove historical pre-correction passages/answers still load. No native-speaker or educator review is claimed.

## Validation and limits

Exact results, CI links and device checklist are in [BUILD_STATUS](../BUILD_STATUS.md). New tests cover bank integrity/identity, taught eligibility/recycling/rotation/weighting, hints-free self-assessment evidence, malformed/stale snapshots, first/compact UI, ten-item completion, all 336 bank items, legacy saves and course content hashes.

A1.1/A1.2/A2.1 remain playable. A2.2/B stages remain planned. Course completion is not CEFR certification. Synthetic voices vary by platform; human voices/listener variation are future work. Speaking does not establish pronunciation quality. Finite typed answer matching can reject valid unlisted paraphrases. First-use learners need two taught units before ten-item sessions are available. Native Spanish educator review and physical Android/TalkBack/acoustic checks are still required before a wider release.
