# Spanish learning resource research

Last reviewed: 2026-10-06

This directory tracks external Spanish-learning material that may improve Friends to Amigos. It separates resources we can reasonably adapt or integrate from material that should be used only as pedagogical reference.

The project is currently Spain-first and offline-first. Resource choices should therefore favour European Spanish, clear provenance, downloadable/offline-friendly formats, and licences compatible with future redistribution.

> This is an engineering/content review, not legal advice. Re-check the source licence and the licence of the exact item before shipping third-party material.

## Status key

- **Preferred integration** — public domain, CC0, CC BY, or similarly permissive material with clear provenance.
- **Conditional integration** — usable only after item-level licence checks or with share-alike obligations.
- **Reference only** — non-commercial/no-derivatives terms, unclear redistribution rights, restrictive service terms, or official frameworks we should map against rather than copy.

## Shortlist

| Resource | Type | Licence / status | Best use in Friends to Amigos | Recommendation |
| --- | --- | --- | --- | --- |
| [Semillas: Elementary Spanish I](https://pressbooks.uiowa.edu/elementary-spanish-i/) | Beginner curriculum, reading, listening, speaking, writing | CC BY 4.0 except where otherwise noted | Model contextual lessons, can-do objectives, communicative tasks, selected reusable text/media after item checks | **Preferred integration** |
| [FSI Spanish courses](https://www.fsi-language-courses.org/spanish/) | Course books + many hours of recorded drills/dialogues | U.S. government course material is widely distributed as public domain; verify provenance for each file | Pronunciation drills, dialogue patterns, listening exercises; especially Headstart for Spain | **Preferred integration with provenance check** |
| [Multilingual LibriSpeech — Spanish](https://www.openslr.org/94/) | Aligned Spanish speech + transcripts | CC BY 4.0 | Peninsular-Spanish listening, dictation, audio pipeline, later-level comprehension | **Preferred integration** |
| [FLEURS — Spanish (`es_419`)](https://huggingface.co/datasets/google/fleurs) | Multispeaker speech + transcripts | CC BY 4.0 | Controlled Latin-American accent exposure after the Spain-first foundation | **Preferred integration** |
| [Tatoeba](https://tatoeba.org/en/downloads) | Sentence/translation corpus; optional audio | Text CC BY 2.0 FR; audio licence is per recording | Sentence mining, translations, distractors, review examples; selected audio only when its licence permits | **Conditional integration** |
| [SpanishPod newbie audio via Wikimedia/Wikibooks](https://en.wikibooks.org/wiki/Spanish_by_Choice) | Short beginner dialogues and lesson material | Many archived SpanishPod audio files are CC BY 3.0; Wikibooks text is generally CC BY-SA | Short natural dialogues and lesson-design reference; verify each media file | **Conditional integration** |
| [Hola a Todos: Elementary Spanish I](https://oer.galileo.usg.edu/languages-textbooks/3/) | Introductory Spanish textbook | CC BY 4.0 | Grammar/vocabulary sequencing, beginner activities, source material for rewritten exercises | **Preferred integration** |
| [Trayectos](https://coerll.utexas.edu/coerll/oer/trayectos/) | Full beginner Spanish curriculum | CC BY-SA | Multimodal and multiliteracies design reference; reuse only if share-alike obligations are acceptable | **Conditional / reference** |
| [The Daily Lesson](https://github.com/nicoletterankin/the-daily-lesson) | Short editorial lesson pattern | CC BY 4.0 | Inspiration for concise lesson rhythm and retrieval; not currently a strong Spanish corpus in the public repo | **Reference / selective reuse** |
| [Instituto Cervantes Plan Curricular](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/) | Official Spanish curriculum framework | Copyrighted reference material | Validate lexical, functional and cultural scope by level; author our own implementation | **Reference only** |
| [CEFR descriptors](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors) | Proficiency framework | Official framework/reference | Define can-do outcomes and assessment targets | **Reference only** |
| [Mozilla Common Voice](https://commonvoice.mozilla.org/dav/datasets) | Large crowdsourced speech corpus | CC0 dataset, but current Common Voice terms ask users not to mirror the dataset, in whole or in part, on other platforms/services | Local research, ASR/listening experiments, quality benchmarking | **Reference/evaluation; do not vendor clips into this repo by default** |

## Recommended first sources

For the current A1.1 course, prioritise these in order:

1. **Semillas** for modern communicative lesson design and meaningful four-skill activities.
2. **FSI Headstart for Spain / Spanish Basic** for pronunciation drills, dialogue structures and public-domain audio patterns.
3. **Multilingual LibriSpeech Spanish** for future individually curated human Peninsular speech; audio-first TTS questions already exist.
4. **Tatoeba** for carefully filtered sentence examples and translation variants.
5. **SpanishPod/Wikimedia** for short beginner dialogue clips where the exact file has a clear CC BY licence.

Do not bulk-copy any corpus into the repository. Curate only the small subset that a lesson actually uses and store source/licence metadata beside every imported item.

See [AUDIO.md](./AUDIO.md), [WRITTEN.md](./WRITTEN.md), and [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for details.

## Implementation status

The documented can-do, communicative, contextual and four-skill recommendations are now implemented through original A1.1/A1.2 course material, rather than remaining only a link list. Units/activities carry practical outcome/original-authorship metadata; stories support rereading and bilingual comprehension; writing requires short Spanish production with teaching feedback. New audio-first listening and deliberate self-assessed speaking retrieval supplement the written course.

CEFR/Cervantes remain reference-only. Semillas, Hola a Todos, Trayectos and other OERs are pedagogical references in this implementation, not shipped adaptations. The collection licences below are not blanket item-level approval. All recorded-audio sources remain future/research-only; no corpus is shipped. Exact-item verification and attribution are prerequisites for a later curated recording.

## A1 stability implementation status

A1.1 and A1.2 remain playable: 16 practical units, 144 activities, 64 original stories and 832 question slots (416 per stage), including 240 Spanish-writing slots, 48 audio-first listening questions and 16 self-assessed speaking chunks. The JavaScript suite now covers 350 individual cases; exact native/browser validation is recorded in BUILD_STATUS.md. Stable question IDs, validated schema-v2 migration/import, original historical snapshots, practical checkpoints and an A1 completion experience are implemented. A2.1 is now playable; A2.2–B2.2 remain planned/unavailable.

All new passages, listening transcripts, exercises and feedback are original Friends to Amigos content informed by documented teaching references. No third-party wording was copied/closely adapted, and no third-party recording or dataset was downloaded/vendored. Listening uses synthetic es-ES speech; speaking does not record or automatically grade pronunciation. Curated human recordings require exact-item review/attribution and remain future work. Native Android build/lint/unit validation is recorded in BUILD_STATUS.md; physical-device retest and independent educator review remain release gates. See [the A1 audit](../A1_STABILITY_REPORT.md) and [BUILD_STATUS.md](../../BUILD_STATUS.md).

## Learner-clarity implementation (0.5.0)

All 832 A1 prompts and 240 Spanish-writing slots were audited. Presentation-only wording amendments and 342 new exact misconception examples improve learner instructions/feedback without changing targets or accepted answers. Incorrect writing displays the learner response, a natural model and a cautious deterministic comparison. Original authorship/reference-only policy remains unchanged; no third-party text, recordings or datasets were incorporated.

Conjugations now adds a separate local bank of 208 original scenarios, with course-linked form prerequisites, varied retrieval, per-blank distractor feedback and adaptive practice. It does not expand or replace the course, reuse third-party exercises, download audio or expose A2.1.

## Connected practice and A2.1 implementation (0.7.0)

A2.1 now ships eight practical units, 72 activities, 416 question slots and 32 original stories. The whole course has 216 activities / 1,248 slots. The original A1 payloads/IDs remain unchanged. Curated Conjugation Blanks, 3–20-table practice, hints, shared mastery evidence, Today’s Review and Weak Areas are implemented offline. [The implementation record](../A2_AND_PRACTICE.md) describes progression, unlocks, finite grading and limitations. CEFR/Cervantes/OER sources remain pedagogical references: no third-party text was copied or closely adapted. Future reuse still requires item-level licence/attribution verification. No recording corpus was imported. A2.2 and B stages remain unavailable.

## Implemented focused-media release (0.8.0)

Listening and Speaking each ship 56 original Friends to Amigos items per A1.1/A1.2/A2.1 stage (168 per mode), in balanced ten-item taught-material sessions. The banks combine 248 newly authored scenarios/prompts and 88 carefully reused original course items with independent stable practice identities/source-question provenance. Mistakes feed existing review and shared topic/outcome evidence; speaking remains self-assessed. Synthetic es-ES TTS, playback-start checks, .75×/1× replay and hidden transcripts/models are retained. First-use guidance has compact repeat-use presentation.

CEFR/Cervantes/OER resources remain pedagogical references only. No external text/audio was copied or closely adapted, so no new third-party attribution entry is required. Large corpora and curated human recordings remain future work; no download, microphone, ASR or cloud grading was added. The four A2.1 corrections and full status are recorded in [the quality report](../LISTENING_SPEAKING_QUALITY.md); [BUILD_STATUS](../../BUILD_STATUS.md) contains actual validation results.
