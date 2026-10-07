# A2.2 quality release — 0.10.0 / Android code 10

Baseline: main `eea54ae0f78695f1eeadc96e2f4e16932ed55650` (0.9.0). No earlier course payload was rewritten. A new frozen contract covers all 216 prior course activities, 272 Conjugations contexts, 35 curated targets and 336 focused-media items, including IDs, ordering, prompts, variants, passages and feedback. Earlier identity/hash fixtures remain in place.

## What ships

A2.2 is a complete fourth playable stage: eight practical units, 24 teaching activities, 32 stories, eight writing activities and eight checkpoints; 72 activities / 416 slots. The whole course now has 288 activities / 1,664 slots / 128 stories / 32 checkpoints. Each A2.2 unit retains the established interleaved nine-activity sequence and 52 slots. There are 120 Spanish-production slots, 24 audio-first listening slots and eight self-assessed speaking slots in A2.2 itself; copied checkpoint questions are assessment slots rather than new story/game identities.

| Unit | Main outcome | New productive focus |
| --- | --- | --- |
| How things used to be | Describe former routines, people and places | Imperfect era, tenía, vivía, trabajaba, estudiaba, iba, hacía |
| What happened | Explain a completed event against background | Comí, viví, salí; imperfect setting versus completed event |
| Getting around | Clarify directions/connections and solve a missed departure | Perdí, tuve que, pude/no pude; ticket validity and route sequence |
| Eating out | Resolve ingredients, missing orders and bill errors politely | Multi-item requests; dijo; past order versus current problem |
| Shopping and everyday services | Explain fit/faults and request an exchange with receipt | Vine, no quise; condition/fit/price comparisons |
| Plans change | Explain a past cause and agree an alternative | Estuve as a bounded stay; availability; familiar ir a plans |
| What do you think? | Express an opinion/reason and agree/disagree politely | Creo que, me parece, también/tampoco, vi |
| A day that did not go to plan | Link background, problems, solutions and plans | Controlled two–four-sentence messages, recycling all preceding stages |

Imperfect and preterite describe different perspectives, not automatic time-word rules. A finished two-year residence can use viví while a routine inside it uses vivía. Estaba frames a scene; estuve presents a bounded stay. No pude reports a particular failed action. No quise comprar expresses a particular refusal without claiming every wanted means quise. Earlier regular -AR preterite and selected fui/hice/llegué are deliberately recycled alongside new -ER/-IR and useful irregulars.

A2.2 does not teach a broad subjunctive, new synthetic future/conditional system or unrestricted narratives. Present perfect remains useful for open-period experiences; ir a expresses practical new plans. Incidental glossed story verbs are not automatically extracted as table targets. Gustar/hay/doler retain contextual treatment; no misleading doler paradigm has been added.

## Stories, writing and feedback

All 32 stories are original recurring-cast situations with Ana, Luis, Marta and Diego: old neighbourhood/routines, a café outing interrupted by rain, missed transport, order correction, receipt/fit problems, alternative appointments, differing opinions and one linked difficult-day sequence. Reading comprehension combines facts, meaning, light supported inference, sequence and response. Every passage remains available during questions and review; typed comprehension accepts authored English/Spanish alternatives.

Writing has eight five-item activities (40 items) plus teaching/checkpoint production. Responses progress from background/current contrasts to connected causes, practical solutions and new plans. Final constrained models reach four sentences while staying within the existing 160-character input limit. Accepted alternatives remain finite and exact-normalised; the app cannot grade unrestricted prose and may reject valid unlisted paraphrases. All new models/variants were checked for normalisation collisions, required negation/connectors, accents and ñ.

New A2.2 misconception examples target background/event viewpoint, particular ability/obligation, irregular dijo/vine, haber + ido and ir a. Their exact counts are in the vocabulary audit. Unexpected mistakes still use the existing cautious word comparison, not fabricated AI grammar analysis. Checkpoints retain nine items, one listen and four Spanish responses; a separately authored final transfer prompt tests each practical goal. Eight of nine passes the unchanged 80% threshold; repeated attempts do not duplicate rewards.

All A2.2 course tasks are Spanish-first. Optional English hints translate the task without revealing hidden audio or speaking models. Assistance persists during save/resume, counts as weaker evidence and never makes a correct response incorrect or changes the pass threshold. Earlier course language metadata remains unchanged.

## Practice integration

- **Focused Listening:** 56 A2.2 items; 224 total. Sixteen independent course listens are safely reused with focused identities and forty new clips add context, sequence, number/price, intention, alternatives and supported inference.
- **Focused Speaking:** 56 A2.2 prompts; 224 total. Eight original course prompts are reused plus 48 new contextual prompts. Models are possible responses, not unique correctness claims. Short retrieval develops into two-part and occasional controlled three-sentence production.
- **Conjugations:** 64 new numbered A2.2 contexts; 336 total. One–three blanks mix subjects, familiar verbs, background/events, requests and present/perfect/plan retrieval. Distractors are curated same-verb person forms with per-blank feedback. Identical imperfect yo/third forms are deduplicated, never incorrectly marked wrong.
- **Conjugation Tables:** 20 useful new targets; 55 total. Eight imperfect (trabajar, vivir, tener, ser, ir, hacer, estar, estudiar); eleven preterite (comer, vivir, salir, perder, tener, poder, decir, venir, querer, estar, ver); one compound ir present perfect. Six Spain-first rows include vosotros. Regular endings, accent-bearing forms and irregular explanations share one source. Existing three-table/five-phase support and 3/5/10/15/20-table practice remain, including custom imperfect selection. Empty tables still require spaced unassisted recall rather than repeated clicks.

Focused media remains **taught-material gated**: all three teaching activities in a unit must be completed, or its earlier stage must be assumed by a later placement. A selected profile stage alone is insufficient. Normal A2.2 sessions, when enough eligible inventory exists, use six A2.2 + two A2.1 + one A1.2 + one A1.1; shortages redistribute only within eligible material. The weighted selector diversifies topics/categories, avoids within-session duplicates and rotates a 30-item recent history.

Grammar games retain the 0.9.0 **independent level ceiling**: current/earlier grammar is available immediately at the selected level, with course sources used for provenance/recommendations. No game grants course completion, checkpoint achievements or a changed placement. Lowering the ceiling keeps higher unfinished snapshots for later resumption. The A2.2 sentence-game normal quota is six current + two A2.1 + one A1.2 + one A1.1 when inventory permits; weakness, diversity and recent history still influence selection.

Listening errors and Needs practice feed existing stable-ID review and shared item/topic/outcome evidence. Table/game observations feed verb/tense/person/pattern records. These signals drive Weak Areas, focused reinforcement and Today’s Review. Positive hinted or self-assessed results are weaker than independent recall; repeated session answers do not create spaced mastery. No new unrelated practice queue was introduced.

## Vocabulary/content audit

The reproducible surface-form audit is [a22-vocabulary.json](a22-vocabulary.json). Positive Spanish models and unique stories are counted; distractors, English, copied checkpoint retrieval and accepted-variant repetitions are excluded. A2.2 stories average **88.3 Spanish word tokens (81–107)**, above A2.1 while remaining short enough to reread.

Across A2.2 story text, **2,178 of 2,826 word-token occurrences (77.1%)** match a surface form already seen in earlier stories. The distinct-type comparison is 291 of 610 (47.7%); new inflections count as new types, so these are exposure statistics, not a proficiency estimate or lemma-level vocabulary claim. Familiar café, transport, home, time, family, prices, clothing, porque/después and plan language returns in new practical contexts. New background/past forms are supported by models and glossaries; independent educator review should still check vocabulary load and comprehension-option wording.

During authoring, the scope review removed unnecessary future and pluperfect forms and a stray subjunctive from drafts. A glossary mismatch and an unsupported exact-time inference were corrected; narrative teaching commentary was replaced by plausible dialogue/actions. Final glossaries refer to phrases in their own title/passage. Regular/irregular accents and vosotros forms, tense context, subject agreement, option uniqueness, finite variants, goal alignment and all checkpoint structures were reviewed. This is an authored engineering/content review, **not a claimed native-speaker review**.

## Progress, release boundaries and next stage

Schema remains **2**; no new persisted field is needed. Validators recognise A2.2 stages/ceilings in existing lesson, game, table and focused structures. v1 migration, invalid-import protection, completion/review deduplication, active historical questions/passages and hint flags remain tested. Course continuation appends A2.2. Completion reports actual records, recognises later starting paths without fake earlier rewards, and offers review/maintenance instead of unavailable B lessons. The A1 milestone remains available. The eight-question recognition placement remains provisional and does not independently establish A2.2 speaking/listening competence.

See [BUILD_STATUS.md](../BUILD_STATUS.md) for exact executed checks and browser/Android boundaries. Safe areas, Back, keyboard Go, radio-style choices, dark/light identity, launcher mascot, TTS cancellation and Today were preserved. Android insets and keyboard are simulated in browser validation, not freshly physically tested.

All new content is original Friends to Amigos material informed by documented CEFR/Cervantes/OER pedagogy. No third-party exercises, text/audio corpus, cloud dependency or recording was incorporated. Human recordings, acoustic/native-speaker review, microphone/ASR, broad free-writing grading and formal certification remain out of scope.

**B1 recommendation:** do not begin a broad B1 syllabus solely because automated checks pass. First obtain native-speaker/educator review of the new tense contrasts, service politeness, story vocabulary and accepted alternatives, plus beginner/returning-learner feedback and a physical Samsung upgrade/offline-TTS test. The architecture is ready for controlled additions; pedagogical release evidence still needs those human checks. No B1 course has been added.
