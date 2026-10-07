# A1.1 and A1.2 curriculum reference record

Revision date: 2026-10-06

This records pedagogical reference use for the original A1.1 rewrite and A1.2 extension. It is not a third-party asset attribution record because no third-party passage, exercise, translation or audio item was incorporated or closely adapted.

| Reference documented in this repository | Design use | Reuse treatment |
| --- | --- | --- |
| CEFR descriptors | Practical learner outcomes and limited can-do checkpoints | Reference only; descriptor prose not copied |
| Instituto Cervantes Plan Curricular | Functions, contextual grammar and beginner lexical scope | Reference only; tables/prose not copied |
| Semillas: Elementary Spanish I | Communicative situations and linking comprehension with production | Design principles from the documented review; no textbook task imported |
| Hola a Todos (documented CC BY) and Trayectos (documented CC BY-SA) | Coverage and multimodal/contextual design principles in the research notes | Reference only; no source text adapted under either licence |
| FSI/SpanishPod and other AUDIO.md sources | Pedagogical awareness of pronunciation/listening; future recording selection | No recording downloaded or integrated; current transcripts are original synthetic-speech practice |

Source links and recorded licence status remain in [WRITTEN.md](WRITTEN.md), [AUDIO.md](AUDIO.md) and [README.md](README.md). The rewrite applies the existing research; it does not claim a fresh item-level audit of every external textbook.

All new scenarios, distractors, answer lists and feedback were authored for Friends to Amigos. Common everyday phrases are used to teach the course functions. No dataset export, large corpus, cloud grading or runtime resource dependency is present.

Future copied or closely adapted items must be reviewed individually under [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md), with source URL, creator, exact licence, adaptation history and required wording in [ATTRIBUTION_TEMPLATE.md](ATTRIBUTION_TEMPLATE.md). This remains necessary even if a source is listed as openly licensed at collection level.

All playable lessons now carry `authorship.kind: original` and a `referenceRecord` pointing here, plus a stable unit `outcomeId`. These fields distinguish original authorship from future adapted content; they do not claim third-party asset clearance. Future adaptations must supply their own exact-item provenance record.

## A1 stability implementation status

A1.1 and A1.2 remain playable: 16 practical units, 144 activities, 64 original stories and 832 question slots (416 per stage), including 240 Spanish-writing slots, 48 audio-first listening questions and 16 self-assessed speaking chunks. The JavaScript suite now covers 408 individual cases; exact native/browser validation is recorded in BUILD_STATUS.md. Stable question IDs, validated schema-v2 migration/import, original historical snapshots, practical checkpoints and an A1 completion experience are implemented. A2.1 is now playable; At that release, A2.2–B2.2 remained planned/unavailable.

All new passages, listening transcripts, exercises and feedback are original Friends to Amigos content informed by documented teaching references. No third-party wording was copied/closely adapted, and no third-party recording or dataset was downloaded/vendored. Listening uses synthetic es-ES speech; speaking does not record or automatically grade pronunciation. Curated human recordings require exact-item review/attribution and remain future work. Native Android build/lint/unit validation is recorded in BUILD_STATUS.md; physical-device retest and independent educator review remain release gates. See [the A1 audit](../A1_STABILITY_REPORT.md) and [BUILD_STATUS.md](../../BUILD_STATUS.md).

## Learner-clarity implementation (0.5.0)

All 832 A1 prompts and 240 Spanish-writing slots were audited. Presentation-only wording amendments and 342 new exact misconception examples improve learner instructions/feedback without changing targets or accepted answers. Incorrect writing displays the learner response, a natural model and a cautious deterministic comparison. Original authorship/reference-only policy remains unchanged; no third-party text, recordings or datasets were incorporated.

## Connected practice and A2.1 implementation (0.7.0)

A2.1 now ships eight practical units, 72 activities, 416 question slots and 32 original stories. The whole course has 216 activities / 1,248 slots. The original A1 payloads/IDs remain unchanged. Curated Conjugation Blanks, 3–20-table practice, hints, shared mastery evidence, Today’s Review and Weak Areas are implemented offline. [The implementation record](../A2_AND_PRACTICE.md) describes progression, unlocks, finite grading and limitations. CEFR/Cervantes/OER sources remain pedagogical references: no third-party text was copied or closely adapted. Future reuse still requires item-level licence/attribution verification. No recording corpus was imported. At that release, A2.2 and B stages remained unavailable.

### Implemented language/access amendment (0.9.0)

A1.2/A2.1 now use original Spanish-first task instructions with optional English help. Hint-assisted successes remain correct but provide weaker evidence. Both grammar games are immediately available by selected level (current and earlier), with course sources serving provenance and recommendation weighting rather than access gates. The 35 curated paradigms remain unchanged; 64 original A2.1 sentence contexts extend the preserved 208 A1 game items. No external text/audio was copied, adapted or downloaded. See [the quality record](../SPANISH_FIRST_AND_GRAMMAR_LEVEL.md).

## Current implementation: A2.2 quality expansion (0.10.0)

A1.1, A1.2, A2.1 and A2.2 are playable; B stages remain planned. The whole course has 288 activities / 1,664 slots / 128 original stories. A2.2 adds 72 activities / 416 slots / eight practical units, original past-background/event and routine-problem scenarios, Spanish-first tasks and optional English support. Listening and Speaking each have 224 items (56 per stage); Conjugations has 336 contexts; curated tables have 55 targets. The previous 216 course activities, 272 game items, 35 table targets and 336 focused items are payload-frozen.

All new writing, stories, distractors and explanations are original Friends to Amigos material. CEFR, Cervantes and documented OER inform design; no third-party passage or exercise was copied/closely adapted. No recording/text corpus was downloaded. Listening remains synthetic es-ES; speaking is self-assessed without recording, microphone permission or ASR. Exact-item attribution rules still apply to any future external asset. See [the A2.2 quality record](../A22_QUALITY_RELEASE.md) and [BUILD_STATUS.md](../../BUILD_STATUS.md) for validation boundaries.
