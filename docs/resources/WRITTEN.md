# Written and curriculum resources

Last reviewed: 2026-10-06

The goal here is not to copy a textbook wholesale. It is to identify high-quality, openly licensed material that can improve the pedagogy, sequencing and authenticity of Friends to Amigos while we continue to author a distinct course.

## 1. Semillas: Elementary Spanish I

- Source: https://pressbooks.uiowa.edu/elementary-spanish-i/
- Licence: **CC BY 4.0**, except where individual items indicate otherwise.
- Publisher: University of Iowa Pressbooks/Open Educational Resources.

**Why it stands out**

- Modern, communicative beginner course design.
- Strong integration of reading, listening, writing and speaking.
- Activities are built around purposeful language use rather than isolated translation drills.
- Useful examples of contextualised cultural material and task sequencing.

**Best use in Friends to Amigos**

- Reference model for redesigning A1.1 units around can-do outcomes.
- Adapt selected openly licensed texts/activities where their exact item licence permits.
- Use its task patterns to improve our own stories, dialogues, written production and checkpoints.

**Recommendation:** highest-priority written/curriculum resource.

## 2. Hola a Todos: Elementary Spanish I

- OER page: https://oer.galileo.usg.edu/languages-textbooks/3/
- Licence: **CC BY 4.0**.

**Why it is useful**

- Introductory Spanish textbook with a conventional but well-structured beginner progression.
- Good source for checking coverage of core grammar, vocabulary and beginner communicative situations.

**Best use**

- Coverage audit against our A1.1/A1.2 roadmap.
- Inspiration for new examples, review activities and grammar explanations.
- Selective adaptation where useful, with attribution.

**Recommendation:** strong secondary curriculum source.

## 3. Trayectos

- Source: https://coerll.utexas.edu/coerll/oer/trayectos/
- Publisher: COERLL, University of Texas at Austin.
- Licence: **CC BY-SA** for the openly licensed course material unless a component is marked otherwise.

**Why it is useful**

- Multimodal and multiliteracies approach.
- Good model for mixing authentic texts, cultural knowledge and language tasks.
- Stronger than many beginner apps at treating language as something learners use socially.

**Caveat**

CC BY-SA imposes share-alike conditions on adapted material. That may be perfectly acceptable, but we should make that an explicit project decision before importing/adapting substantial parts.

**Recommendation:** use heavily as design reference; selectively reuse only after deciding how we want to handle share-alike content.

## 4. Tatoeba sentence corpus

- Downloads: https://tatoeba.org/en/downloads
- Reuse guidance: https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus
- Text licence: **CC BY 2.0 FR** (with attribution expectations described by Tatoeba).

**Why it is useful**

- Huge bank of short Spanish sentences and translations.
- Excellent source for sentence mining, alternate phrasings, distractor design and spaced-review examples.
- Helpful for checking whether authored beginner phrases resemble naturally contributed language.

**Quality rules**

Do not automatically ingest sentences into lessons. A candidate sentence must be reviewed for:

- correctness;
- naturalness;
- target dialect/region;
- CEFR appropriateness;
- useful context;
- translation quality.

**Recommendation:** build a small curated sentence bank rather than depending on Tatoeba dynamically.

## 5. Spanish by Choice / SpanishPod material on Wikibooks

- Index: https://en.wikibooks.org/wiki/Spanish_by_Choice
- Wikibooks licensing: generally **CC BY-SA 4.0** for current text, with historical content carrying compatible attribution/share-alike terms; individual media files may use different licences.

**Why it is useful**

- Beginner lessons centred on short dialogues.
- Helpful pairing of audio and explanatory text.
- Offers examples of teaching practical conversational language in small chunks.

**Caveat**

Treat text and media as separately licensed assets. Verify the exact page/file licence before adapting anything.

**Recommendation:** useful reference and selective source, especially for dialogue-based lesson ideas.

## 6. The Daily Lesson

- Repository: https://github.com/nicoletterankin/the-daily-lesson
- Licence: **CC BY 4.0** for lesson content in the project.

**Why it is interesting**

Its value to us is the compact editorial format: brief lessons, manageable daily chunks, explanations and retrieval rather than a giant textbook flow.

The public repository should not currently be treated as a rich Spanish corpus. Use it primarily as **product/content-architecture inspiration** unless a specific Spanish lesson is located and reviewed.

**Recommendation:** reference for lesson cadence and presentation.

## 7. Instituto Cervantes — Plan Curricular

- Source: https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/

This is one of the most important **reference** resources for our project because it is specifically about Spanish and organises communicative functions, grammar, vocabulary, cultural knowledge and pragmatic skills by proficiency level.

**Use it to**

- audit whether an A1/A2 unit is teaching an appropriate function;
- verify when grammatical concepts should broadly appear;
- improve Spain-specific cultural/pragmatic coverage;
- define what “progress” means beyond vocabulary counts.

**Do not** bulk-copy its prose or tables into the product. Author our own curriculum mapping and learner-facing explanations.

**Recommendation:** primary Spanish-specific scope reference.

## 8. CEFR descriptors

- Council of Europe: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors

Use CEFR to define learner outcomes such as what a learner can understand, say, write and interactively accomplish. It should shape checkpoints and capability statements, not become copied lesson content.

**Recommendation:** primary level/outcome reference.

## Content-authoring workflow

For every new unit:

1. Define a **can-do outcome** using CEFR/Cervantes as references.
2. Check Semillas/Hola a Todos/Trayectos for strong ways to teach the same function.
3. Author an original Friends to Amigos scenario, dialogue and story.
4. Use Tatoeba or other corpora only to sanity-check phrasing and discover natural variants.
5. Add recognition, controlled recall, free recall and contextual-use questions.
6. Validate grammar, vocabulary and pragmatics against the intended stage.
7. Record provenance only when third-party wording/media is actually adapted.

This keeps the product distinctive while benefitting from mature open educational resources.

## Implemented written-course recommendations

The app now uses practical unit outcomes, a small recurring cast, natural mini-dialogues, supported reading with varied comprehension, and recognition → completion → recall → response → transfer practice. Short Spanish production uses authored accepted variants and misconception feedback; story comprehension retains English/Spanish answers. Limited regional/register notes preserve Spain-first usage without multiplying beginner targets. Lessons carry an outcome ID and original-authorship reference record. The eight-stage map has distinct future communicative targets and language-focus metadata, while A2.1 now has original playable exercises and A2.2–B2.2 remain unimplemented.

These are original Friends to Amigos exercises informed by this research. No source exercise, story or translation was copied or closely adapted. Future reuse remains subject to exact-item licensing; the research shortlist alone does not authorise redistribution. See [COURSE_DESIGN.md](../../COURSE_DESIGN.md) for actual course structure and assessment limits.

## A1 stability implementation status

A1.1 and A1.2 remain playable: 16 practical units, 144 activities, 64 original stories and 832 question slots (416 per stage), including 240 Spanish-writing slots, 48 audio-first listening questions and 16 self-assessed speaking chunks. The JavaScript suite now covers 351 individual cases; exact native/browser validation is recorded in BUILD_STATUS.md. Stable question IDs, validated schema-v2 migration/import, original historical snapshots, practical checkpoints and an A1 completion experience are implemented. A2.1 is now playable; A2.2–B2.2 remain planned/unavailable.

All new passages, listening transcripts, exercises and feedback are original Friends to Amigos content informed by documented teaching references. No third-party wording was copied/closely adapted, and no third-party recording or dataset was downloaded/vendored. Listening uses synthetic es-ES speech; speaking does not record or automatically grade pronunciation. Curated human recordings require exact-item review/attribution and remain future work. Native Android build/lint/unit validation is recorded in BUILD_STATUS.md; physical-device retest and independent educator review remain release gates. See [the A1 audit](../A1_STABILITY_REPORT.md) and [BUILD_STATUS.md](../../BUILD_STATUS.md).

## Learner-clarity implementation (0.5.0)

All 832 A1 prompts and 240 Spanish-writing slots were audited. Presentation-only wording amendments and 342 new exact misconception examples improve learner instructions/feedback without changing targets or accepted answers. Incorrect writing displays the learner response, a natural model and a cautious deterministic comparison. Original authorship/reference-only policy remains unchanged; no third-party text, recordings or datasets were incorporated.

## Connected practice and A2.1 implementation (0.7.0)

A2.1 now ships eight practical units, 72 activities, 416 question slots and 32 original stories. The whole course has 216 activities / 1,248 slots. The original A1 payloads/IDs remain unchanged. Curated Conjugation Blanks, 3–20-table practice, hints, shared mastery evidence, Today’s Review and Weak Areas are implemented offline. [The implementation record](../A2_AND_PRACTICE.md) describes progression, unlocks, finite grading and limitations. CEFR/Cervantes/OER sources remain pedagogical references: no third-party text was copied or closely adapted. Future reuse still requires item-level licence/attribution verification. No recording corpus was imported. A2.2 and B stages remain unavailable.

## Implemented focused-media release (0.8.0)

Listening and Speaking each ship 56 original Friends to Amigos items per A1.1/A1.2/A2.1 stage (168 per mode), in balanced ten-item taught-material sessions. The banks combine 248 newly authored scenarios/prompts and 88 carefully reused original course items with independent stable practice identities/source-question provenance. Mistakes feed existing review and shared topic/outcome evidence; speaking remains self-assessed. Synthetic es-ES TTS, playback-start checks, .75×/1× replay and hidden transcripts/models are retained. First-use guidance has compact repeat-use presentation.

CEFR/Cervantes/OER resources remain pedagogical references only. No external text/audio was copied or closely adapted, so no new third-party attribution entry is required. Large corpora and curated human recordings remain future work; no download, microphone, ASR or cloud grading was added. The four A2.1 corrections and full status are recorded in [the quality report](../LISTENING_SPEAKING_QUALITY.md); [BUILD_STATUS](../../BUILD_STATUS.md) contains actual validation results.
