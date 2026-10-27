## v1.8 consolidation

The existing course and eleven Practice modes are under a major-feature freeze. See [consolidation strategy](docs/CONSOLIDATION_STRATEGY.md), [content governance](docs/CONTENT_REVIEW_POLICY.md), [incremental canonical schema](docs/LINGUISTIC_CONTENT_SCHEMA.md) and [local beta diagnostics](docs/BETA_DIAGNOSTICS.md). Meaning-first A1.1 support, beginner Practice disclosure and reached-source recommendations improve the existing journey. Schema-v2 snapshots/IDs remain authoritative. Language linting flags editorial work; it never supplies native-speaker approval. Manual visual/accessibility review remains separate from geometric checks. No external participant study or KPI framework is introduced.

## Current experience and Stories policy (v1.7)

One obvious next action, then optional detail. Home prioritises Continue / Today / relevant Needs Attention and one recommendation. Practice is the optional skill hub, separate from scheduled Review. Verb in Context preserves ten-question Conjugations; Verb Trainer preserves six-person table drills. Grammar controls live inside each engine’s Custom practice, with deliberate advanced choices available. New skills use reached activities and encountered vocabulary; beginners receive greeting/name construction first. Learn keeps the current unit first and revision accessible. Profile retains Vocabulary, Grammar Reference and progress. Review groups Due Today / Weak Areas / Past Mistakes. The visible five-tab order is Home / Learn / Practice / Review / Profile; internal Games routes remain compatible.

Stories use [the maintained three-character bible](docs/STORY_BIBLE.md). A bounded 24-episode conversion, balanced practical/social/comedy, improves existing slots without expanding levels or changing IDs/order/unit outcomes. All 256 slots gain metadata and reading comfort. Remaining original stories are retained for future careful editorial passes rather than uncontrolled mass rewriting. Optional predictions are ungraded; five permanent question slots remain, with supplied construction and supported comprehension. Story language aims to reuse familiar material; no automated 80–90% familiarity claim is made.

Historical passages remain snapshots. Success on a different live story cannot clear an older same-ID passage review. [The explicit content manifest](docs/release/v15-content-changes.json) and strict developer-only inverse protect original fixtures while new live tests cover the new editions. B-level substitution uses whole forms, never arbitrary substrings. See [release report](docs/release/V1_5_REPORT.md) for the editorial boundary and human-review needs.

## v1.4 connected quality policy

The content ceiling remains A1.1–B2.2. Course completion records activities; mastery records uncertain, changing evidence. Neither is certification. Relevant optional reinforcement follows passed lessons without displacing Continue. A weak concept opens a brief authored reference, 3–5 controlled questions and further eligible practice; it cannot award course completions.

Scaffolding is separate from grammar level. Missing evidence or repeated errors means high support. Low support requires at least six relevant attempts, three spaced successes, four recent correct answers and low assistance/uncertainty for every involved concept. Otherwise medium support remains. Pattern reminders and a supported first gap preserve the original objective and are recorded as assisted. No single success advances grammar or removes all cues.

Spanish-first questions offer authored simpler Spanish help before English. Neither help reveals correctness. Independent recall carries more evidence than Spanish-supported success, which carries more than English-supported success. Confidence is optional on selected recall/review tasks, never changes correctness, and uncertainty slows evidence accumulation. Repetition within one session cannot manufacture spaced mastery. Model-assisted shadowing is weaker self-assessment, never independent recall.

Today’s Review combines due historical mistakes, weak concepts, older successful completed material, recent material and known confidence items. Beginners get a smaller focused set; later learners get interleaved contexts. Summaries report actual delayed recall and provisional strengths/needs, not generic XP. Incorrect responses show the learner choice, model and authored or conservative diagnosis. Wrong-person/tense, irregularity and common contrasts are diagnosed only where the curated data supports them.

All 44 syllabus concepts have quick-reference explanations, examples, a contrast/common mistake and practice routing. Reading references is unrestricted; practice respects the existing chosen grammar-level policy. Regular -ER present moves to A1.1 with explicit comer pattern support; the permanent target `table-a12-comer-present` remains unchanged. A1.2 retains consolidation. Gustar and doler remain contextual structures, not misleading six-person paradigms.

The internal load scan covers all 360 A2.2–B2.2 activities / 160 stories; manual internal review sampled the first story of each of their 40 units plus writing/feedback/paradigms. Surface counts do not measure learner vocabulary knowledge. Only two incidental B1 chunks receive extra glossary support; no story body, answer, objective or identity changes. See [intentional supports](docs/release/v14-content-support.json) and [quality report](docs/release/V1_4_REPORT.md). Native-speaker/educator validation remains necessary, especially B-level register, inference, expository pacing and writing models.

## v1.3 interaction policy

Textbox = genuine expression; structured interaction = a specific language target. A1.1 is heavily scaffolded onboarding; A1.2 uses structured construction; A2.1 adds connected cloze/phrase control; A2.2 deliberately bridges into guided writing; B1/B2 retain increasing genuine expression. The final objectives and 80% checkpoint rule remain. Source generators retain permanent identities and original targets; the live assessment adapter changes the interaction, never historical snapshots. Open writing uses conservative diagnosis/model comparison, not finite rejection of arbitrary prose.

Continue starts the next required activity directly; Finish for now returns Home. Stories/checkpoints/unit order and placement starting path remain authoritative. Familiar A1 anchors remain natural scaffolding for new material. See [v1.3 report](docs/release/V1_3_REPORT.md) and [current assessment audit](docs/release/v13-assessment-audit.json). Older reports below describe earlier authoring/assessment snapshots; their historical counts are not the current live interaction distribution.

# Friends to Amigos course design through B2.2

A1.1 and A1.2 form the playable A1 course. This design uses CEFR-style can-do outcomes and the Spanish-specific scope guidance documented for Instituto Cervantes, with communicative/OER teaching principles. It is not formal CEFR certification. All eight stages A1.1 through B2.2 are playable for user testing; no CEFR certification is claimed.

## Practical progression

Grammar and vocabulary support a real-world task, rather than becoming the name of the achievement.

| Stage / unit | Practical outcome | Supporting language |
| --- | --- | --- |
| A1.1 Greetings & introductions | Introduce yourself, ask a name, greet/leave politely and ask for repetition | Me llamo, soy + name, te llamas, courtesy/repetition chunks |
| A1.1 About you | Give age, origin and home city; ask basic personal information | Ser/estar, tener for age, vivo/hablo, informal plural Spain pronouns |
| A1.1 At the café | Order breakfast, express hunger and ask for the bill | Quiero, tener hambre, gusta, negation, por favor |
| A1.1 Numbers & prices | Ask a price, understand a small total and request a quantity | Cuesta, son, number formation, euro/plural agreement |
| A1.1 Family & people | Introduce relatives and describe someone simply | Mi/mis, este/esta, ser, gender/number agreement, tener los ojos |
| A1.1 Everyday objects | Identify/describe an object and say where it is | Hay vs estar, colour order/agreement, articles, possessions |
| A1.1 Around town | Ask a location and follow a simple direction | Dónde está, cerca/lejos, right/left/straight, al vs a la |
| A1.1 Routines & meeting times | State an activity time and agree a meeting time | Es la/son las, a la/a las, y media/menos cuarto, desayuno, nos vemos |
| A1.2 Free time & preferences | Describe interests and choose an activity together | Gusta + infinitive, gustan + plural, prefiero, también/pero/porque |
| A1.2 Inviting & responding | Invite, accept/decline politely and propose another time | Vamos, quieres/queréis, puedo, lo siento, qué tal |
| A1.2 Making plans | Agree an activity, day, time and meeting place | Ir a + infinitive, day/time expressions, delante del |
| A1.2 Choosing clothes | Explain garment, colour and size needs | Necesito, articles, feminine/plural colours, talla |
| A1.2 In the clothes shop | Try on, explain fit, choose and pay | Puedo probarme/me puedo probar, queda/quedan, me llevo, con tarjeta |
| A1.2 At home | Describe rooms and locate things for a visitor | Hay/no hay, ser/estar, al lado de/encima de/debajo de |
| A1.2 A typical day | Describe a timed daily routine | Me levanto/ducho/visto/acuesto, stem changes, primero/después, después de + infinitive |
| A1.2 A day together | Connect routine, reason and future plan in a short message | Y, pero, porque, también, después, entonces, tengo que + infinitive |

The recurring cast remains Ana, Luis, Marta and Diego. Friends meet in class, visit Diego's café, buy something, help find objects and directions, arrange outings, shop for clothes, visit a flat and compare routines. Anonymous shop staff are roles, not extra narrative protagonists. Familiar situations provide continuity; no complicated plot is required.

## Rhythm and counts

Both stages retain their original 72 activity IDs and ordering. A1.1 deliberately retains its historical checkpoint-before-final-story order:

Discover → Story 1 → Build confidence → Story 2 → Use it → Story 3 → Write in Spanish → Checkpoint → Story 4.

A1.2 ends each unit with its checkpoint:

Discover → Story 1 → Build confidence → Story 2 → Use it → Story 3 → Write in Spanish → Story 4 → Checkpoint.

Per unit: teaching activities have 5/6/7 questions; four stories and the writing activity have five each; checkpoint has nine. Total: **52 slots per unit, 416 per stage, 832 overall**, across the unchanged 144 A1 activities. The 1.2.0 beginner ramp changes three opening Spanish-writing slots into supported recognition/completion, leaving **237 Spanish-writing slots**, 48 listening slots and 16 self-assessed speaking slots in A1. Added media occupies existing teaching activities rather than inflating activity counts. One earlier checkpoint slot per unit is replaced by listening.

After the opening confidence ramp, the first five teaching questions retain the recognition/model → completion → recall → contextual response → transfer structure. Listening follows familiar models; speaking follows high-value communicative practice. A1.2 moves toward connected responses without extensive past narration or A2 grammar. Answer lists remain short and finite.

## A1.1 confidence ramp (1.2.0)

The first three regular Unit 0 teaching activities keep their permanent activity/question IDs and their place among the original stories. The goal is a gentler first encounter, not a lower eventual A1 standard.

| Activity | Intended learning burden | Current sequence |
| --- | --- | --- |
| `u0l0` — Discover | Useful meaning first; very strong support | Visible bilingual Hola / Me llamo / name-question / farewell models; recognition and an easy Me ___ Ana completion. No typed recall or role switching. |
| `u0l1` — Build confidence | Mostly recognition/support; first short recall late | Four supported core items, then “My name is Ana” from memory. The existing familiar name-question listen remains. |
| `u0l2` — Use it | Begin recalling and using familiar chunks | Farewell recognition/completion, short farewell recall, a modelled request for repetition, Luis name transfer, the existing name listen and spoken introduction. |

The first lesson no longer asks the learner to generate Spanish from memory or switch identities before the chunks are familiar. Its distractors distinguish useful meanings rather than subtle conjugations, and feedback explains meanings without reflexive/infinitive terminology. The second lesson first retrieves **me llamo** at core question 5; the third restores simple independent transfer. Subsequent writing, stories, listening, speaking, Review and checkpoints remain. All A1 checkpoints retain their content and 80% pass rule.

Visible bilingual `teachingModel` metadata expresses deliberate support. It is not an English task hint and cannot reveal a hidden listening transcript or speaking model. New attempts use the revised opening; historical saved attempts/reviews keep their saved questions and original task types. See [the exact release record](docs/release/LEARNER_EXPERIENCE_REPORT.md).

## Reading and vocabulary load

The 64 preserved A1 stories and 32 new A2.1 stories have three specific choices and two short English/Spanish responses. Questions include facts, meaning, character, supported inference, sequence, contextual response and light transfer. The learner reads at their own pace before questions, and can reread during questions/review. Glossaries support unfamiliar scenario chunks rather than requiring their independent production immediately.

With the audit's Spanish surface-token method, A1.1 stories average 28.4 words (21–35); A1.2 averages 48.4 (34–65). These counts exclude numerals and are a pacing indicator, not a proficiency measure. The audit retained natural original passages and changed three A1.2 stories only to recycle familiar water/food/hunger within plausible breakfast, shopping and outing contexts.

Recycling also uses quantities, coffee/bills, keys/phones, home locations, invitations and changed times across units. [The audit report](docs/A1_STABILITY_REPORT.md) records baseline-to-final surface-word unit coverage. `npm run audit` reproduces it; inflections, names and function words are not lemmatised and exposure is not evidence of mastery.

For ongoing authoring, previously learned high-frequency language should become scaffolding for new language. Seeing a chunk, recognising it, completing it, retrieving it, using/responding, transferring and combining it are different tasks; recycling need not repeat the same question. The 1.2.0 change adds two selective bridges: a family introduction reuses **me llamo**, and a flat visit reuses **vivo en** before introducing rooms with **hay**. Other natural A1 contexts remain intact.

[The A1 anchor recurrence audit](docs/release/a1-anchor-recurrence.json) records fifteen constructions across sixteen units with activity examples. It deduplicates passage repetition inside an activity and excludes wrong options, surrounding English and explanations. It flags four or more intervening units without the literal anchor for pedagogical review. A flag is not a demand to re-introduce familiar characters unnaturally; planned course exposure, focused retrieval and personalised SRS serve complementary roles. Presence is neither learner recall nor mastery, and literal matching does not cover every equivalent form.

## Listening

Every unit has two teaching listens and one checkpoint listen. Both recognition and short typed comprehension are present. The full Spanish transcript is absent from the DOM before attempting; play/replay controls and the comprehension prompt appear first. Checking or deliberately skipping reveals the transcript with evidence-based feedback. Review hides the transcript again.

Early tasks identify a name, origin, drink or quantity. Later tasks distinguish a rejected alternative, current/meeting time, person/possession, changed day, preference/reason, fit or sequence. A1.2 can contain several familiar details. Vocabulary is introduced before it is used to test listening: size comprehension follows the size model; early location/time listening avoids later al lado de/delante del chunks.

Speech is synthetic es-ES using Android TextToSpeech or browser SpeechSynthesis with an offline voice. Content stores teaching rates of approximately .8–.95 and checkpoint rates up to 1.0; the learner’s Slow (0.75×, default) / Normal (1×) session choice currently overrides those rates. The native bridge honours the selected rate; older bridges remain compatible at their default rate. Platform errors may still require retry/skip. Skipping records a scored miss and retains the item for review; the unchanged 80% threshold means a learner can still pass a lesson while missing one question.

The model accepts an optional curated local recording path with TTS fallback, but none is populated. Human-speaker variability, natural overlapping dialogue and acoustic validation remain future work. No corpus, cloud speech service or microphone is added.

## Speak-aloud retrieval

One selected chunk per unit practises a useful utterance: greeting/introduction, personal details, ordering, price, family, object location, directions, meeting time, preferences, refusal/alternative, arranging a meeting, garment/size, trying on, home directions, routine and refusal with a reason.

The learner tries aloud, deliberately reveals one possible model, optionally hears it, then self-assesses. Different natural equivalents may also be considered successful. “Needs practice” enters spaced review. Speaking attempts are explicitly self-assessed, excluded from scored accuracy and cannot on their own earn a checkpoint/capability. The app neither records voice nor verifies pronunciation.

Completion and Home practice sessions rotate through units already practised (or introductory chunks for a new learner), favouring less recently retrieved items. This supports continued retrieval after the playable course is completed rather than offering an unavailable later course.

## Assessment and teaching feedback

Every checkpoint still has nine questions and four distinct constrained Spanish responses, plus one listening question, contextual response/recognition and controlled completion. Some deliberate prior retrieval remains; new contexts change names, objects, quantity, place, time or required response. Duplicate written model answers within checkpoints were removed. Threshold stays 80% (eight of nine); achievements/completion events remain unique.

The audit adds models before thirty-two and quarter-to clock recall, simplifies an unsupported two-hundred-euro gap, models después de desayunar before writing, supports Sunday in a transferred plan, and teaches a practical request for repetition. Required porque prompts no longer accept a por eso alternative that misses the explicit connector requirement. Three punctuation/hyphen duplicate answer-list entries were removed without changing which input is accepted.

Feedback explains concepts and reading evidence. There are 413 authored misconception examples across course slots (71 before the 0.5.0 learner-clarity pass), covering tener for age/hunger, ser/estar, gusta/gustan, adjective/article/number agreement, person endings, missing a in plans, reflexives/stem changes, clock versus activity time, and al versus a la. Other incorrect replies receive a transparent comparison with the nearest authored model plus the task’s explanation; this is not a general grammar grader. Valid unlisted paraphrases can still be rejected.

Matching tolerates case, punctuation, spaces, vowel accents and Unicode equivalence; ñ and negation remain meaningful. There is no substring matching, cloud grader or LLM. Guided/free writing now uses the cautious layered engine described below; controlled retrieval remains finite.

## European Spanish and references

Móvil, ordenador, piso, probador, vosotros/vosotras and supported queréis remain Spain-first targets; TTS uses es-ES. Brief regional/register notes explain common alternatives without multiplying beginner targets. Some relevant regional writing variants remain valid. No Latin-American voice pool is introduced.

CEFR/Cervantes provide reference scope; Semillas and documented OERs inform communicative sequencing, contextual grammar, comprehension and production. All new scenarios, transcripts, questions, distractors and explanations are original Friends to Amigos material. No third-party text/audio is copied or closely adapted. Future reuse requires exact-item licensing/provenance under [the attribution policy](docs/resources/ATTRIBUTION_TEMPLATE.md).

## State and architecture

Activity IDs, tuple-style A1.1 units, stage APIs, existing completion/capability records and intentional ordering remain compatible. New permanent question IDs decouple review from wording. Schema-v2 validation/migration preserves valid v1 saves and historical snapshots; incompatible or corrupt roots are protected, and unsafe imports cannot overwrite valid progress. See [STATE_AND_QUESTIONS.md](docs/STATE_AND_QUESTIONS.md).

Stage source/story modules remain small local data modules. New `a1-review.js` records justified amendments after capturing the compatibility archive; `a1-practice.js` adds selective media. Rendering, storage and speech are separated from `app.js` without a framework/rewrite. Question ID manifests and fixtures must be extended deliberately when authoring new content.

The Learn selector remains ungated for playable stages. Continue respects active historical attempts first, then onboarding/preferred-stage progression. Future placement recommendations are labelled provisional and cannot launch an unavailable course.

## Later stages and release boundary

| Stage | Practical progression / availability |
| --- | --- |
| A2.1 | Playable: recent experiences, travel choices, health needs |
| A2.2 | Playable: routine problems, changed habits, practical requests |
| B1.1 | Connected narratives, reasons, main-point summaries |
| B1.2 | Discuss options, negotiate solutions, coherent complaints |
| B2.1 | Compare perspectives, develop arguments, adjust register |
| B2.2 | Interpret stance, synthesise accounts, defend proposals |

All rows now represent playable stages. B stages add connected production and progressively deeper interpretation; their quality must still be evaluated with real learners. The A1 audit found no major unresolved gap within this course's stated everyday task scope, but broader A1 proficiency is not certified. Dates/contact information and unfamiliar human conversation are partial, not independently demonstrated.

Freeze the activity/identity contracts and reviewed content as an **A1 v1.0 release candidate**. Do not declare an unconditional stable release solely from simulated tests: native build/device upgrade/storage/TTS checks and a concise Spanish educator/native-speaker review remain release gates. All stages through B2.2 are implemented for user testing. Complete native-speaker/educator and physical-release checks before wider distribution; do not begin C1/C2. [BUILD_STATUS.md](BUILD_STATUS.md) distinguishes performed checks from remaining work.

## Mobile path and daily practice (0.4.0)

A1.2 placement defines a starting path with earlier foundations assumed, not marked completed. Optional A1.1 revision remains available; finishing the required path earns the course milestone with actual completion counts and accurate assumed-foundation wording. Ordinary A1.1 learners retain the full A1.1→A1.2 path. No course content or permanent identities changed in this product update.

Today integrates saved-attempt resume, bounded due review, the next required lesson and one short listening/speaking retrieval. It adds no new curriculum or grading. Listening now waits for verified playback start and offers 0.75×/1× replay; self-assessment, finite grading, Spain Spanish and offline voice requirements remain unchanged.

## Learner clarity and teaching feedback (0.5.0)

All 832 A1 prompts were audited: 363 choice, 64 gap, 389 text and 16 speaking slots. Of 548 amended slots, 80 have clearer task wording and 517 lose redundant context prefixes (49 overlap). Early tasks give an explicit phrase to write; later tasks retain contextual retrieval. Typed tasks say “write”, speaking tasks say “say aloud”, and the UI labels recognition/completion/listening/production clearly. Spanish targets, accepted answers, passages, objectives, activities, permanent identities and ordering remain unchanged.

All 240 Spanish-writing slots were reviewed. Added 342 exact mistake examples across 171 slots, with 96 distinct explanations for predictable English-speaker errors: names/me vs mi, age, verb person/infinitive, agreement, gustar, reflexives, future-intention a, destination contractions, orders and times. Three existing destination explanations now correctly teach going to a place instead of describing an infinitive; one name explanation is clearer.

Wrong feedback shows the learner’s exact response, a natural finite authored model and why. Word-level underlining supports comparison. Exact authored mistakes take precedence; missing/extra/substituted/reordered words are described conservatively. Known grammar diagnoses require supporting target context. Unknown paraphrases are transparently outside the finite answer list and may still be valid. No LLM, fuzzy scoring or cloud grader was added. Historical snapshots retain their older prompts/explanations.


## Conjugations practice (implemented)

Games supplement the unchanged A1 course; they do not add activities, change objectives or constitute checkpoint evidence. The local bank contains 104 A1.1, 104 A1.2 and 64 A2.1 original scenarios. Early items use one blank/explicit subject/infinitive; later items mix subjects, reduce hints and use up to three blanks. Contexts recycle introductions, café, family, possessions, directions/time, preferences, plans, clothes/home and routines. Correct forms are explicitly linked to positive course models; A2.1 practice uses only curated shipped present-perfect/selected-preterite and practical present targets.

Selected grammar level now determines eligibility, including zero-completion users. Course models/context units document provenance and influence recommendation weights. Placement/selected starting level supplies the default ceiling; manual Games changes are independent of required course progress. Distractors contrast grammatical person, infinitive vs conjugation and singular/plural patterns. Feedback treats each blank independently and names the pattern to remember.

A1.2 normal rounds revisit four eligible A1.1 situations alongside six current-stage items, keeping foundational chunks in retrieval. Selection covers available persons before repetitions, weights verb/concept diversity and weakness, and rotates around a bounded recent history. Mistake practice uses up to five related eligible alternatives; Challenge favours harder unlocked items. Current-round concept signals say Strong today/Improving/Needs more practice; cumulative attempts guide future selection but are not certification or reliable mastery claims.

Normal passed lessons now continue along the required starting path, then review/listening maintenance. Failed lessons retain retry/mistake review. The 80% pass threshold, Today orchestration and all permanent course identifiers are unchanged.

## A2.1 and connected practice (0.7.0)

A2.1 appends 72 activities / 416 slots / eight units / 32 stories / 120 Spanish-production slots / 24 listens / eight speaking chunks. The whole playable course now has 288 activities / 1,664 slots. A2.1 teaching activities each contain six questions; the unit still totals 52 slots. The exact original A1 payloads are protected.

[The A2/practice record](docs/A2_AND_PRACTICE.md) documents all eight practical units, past-tense boundaries, 35 curated table targets, four-phase three-table normal games, 3–20-table practice, teaching hints, shared evidence, Today’s Review and Weak Areas. Conjugations and Blanks reinforce grammar up to the selected level, including appropriate A2.1 compound/preterite targets. Games never unlock the course.

The measured A2.1 surface vocabulary recycles café in six units, agua in six, parque in four, mañana in six, and porque/después in all eight. Home/book vocabulary appears less often because the stage’s scenarios focus on travel and health; these exposure counts do not prove mastery. [The reproducible audit](docs/a21-vocabulary.json) records the method and stage story lengths.

The model deliberately gives more weight to unassisted recall, caps repeated session evidence and requires separated days for spaced success. Six-form empty tables require evidence of every person, not merely finishing structured games. Fully free paragraphs, automatic pronunciation grading and formal CEFR certification remain outside the product. B1 readiness needs educator/native-speaker and learner review, not just passing tests.

## Focused media quality release (0.8.0)

Focused Listening and Speaking each provide ten unique items from a 224-item bank (56 per playable stage). These are reinforcement, not new course activities or stage unlocks. Each item names its three completed unit teaching prerequisites, topic, task category, outcome, authored provenance and stable independent ID. Placement can assume earlier-stage material; the selected profile stage alone cannot unlock it.

A1.1 practises short familiar details/chunks; A1.2 adds reasons, preferences and linked exchanges; A2.1 adds recent/finished experiences, travel, health and connected messages within its existing scope. Normal A1.2 selection is 6 current + 4 A1.1; A2.1 is 6 current + 2 A1.2 + 2 A1.1, with eligible-only redistribution. Topic/task variety, recent history and shared weakness evidence influence weighted selection. Ten eligible items are required, avoiding short or untaught sessions.

Speaking remains self-assessed with one possible response and occasional alternatives. “Needs practice” feeds skill/topic/outcome evidence and existing review; repeated same-session successes cannot manufacture spaced mastery. Listening mistakes do the same. Summary labels describe observed performance, never CEFR ability. First-use guidance remains accessible in compact repeat sessions.

A2.1 retains all units, activities, ordering and permanent IDs. Four narrowly identified corrections fix health-story punctuation, a pharmacy prompt/canonical wording mismatch, past hotel narration and natural door wording. The matching door glossary changes with its phrase. Historical snapshots retain their original passages/questions. All 32 stories and associated core/writing/listening material were scanned for clear defects; no additional course rewrite was justified. Full details and validation limits are in [the quality report](docs/LISTENING_SPEAKING_QUALITY.md).

## Spanish-first tasks and level-based grammar practice (0.9.0)

A1.1 retains English beginner support. A1.2/A2.1 add simple, original Spanish task instructions on all 832 question slots, with a deliberate English hint. English task help is hidden initially and separate from listening transcript/model reveal. Hint state belongs to the saved question attempt. Correct hinted answers keep their score/pass credit but carry assisted mastery evidence; repeated support becomes an instruction-understanding Weak Area and later retrieval opportunity. Existing targets, answer options/variants, passages, goals and stable IDs remain unchanged. Old snapshots retain their original language.

Grammar availability = selected level; grammar prioritisation = recent course activity + weakness + due review + recent practice. Course completion is no longer an access requirement for either game. `grammar-syllabus.js` names actual taught concepts and reuses the curated paradigm data. The ceiling is explicit inside each grammar activity’s Custom practice and does not award skipped course work. Level controls content; mastery controls scaffolding. Three-table normal games start with two missing forms; six blanks still require spaced unassisted evidence for every form.

Conjugations now contains 104 A1.1, 104 A1.2 and 64 original A2.1 contexts using curated recent-perfect/selected-preterite and practical present forms. Later rounds mix six current-stage items with four earlier ones; weak/recent models guide weighting without excluding unrelated same-level grammar. Practice scopes are Recommended, Current level, All up to current level, current-unit prioritisation and simple custom level/tense/reflexive filters. Game-only learners can build weakness evidence and receive Today’s Review. Gustar and doler remain contextual, not full beginner tables.

The former game-prerequisite descriptions above document earlier releases and are superseded by this policy. Focused media still uses its taught-unit policy; it has not been broadened into another grammar syllabus. See [the detailed amendment record](docs/SPANISH_FIRST_AND_GRAMMAR_LEVEL.md).

## A2.2: practical past background, events and routine problems

A2.2 adds the same nine-activity unit rhythm: three six-question teaching activities interleaved with four five-question stories, one five-question writing activity and one nine-question checkpoint. Eight units give 72 activities / 416 slots / 32 stories / eight writing activities / eight checkpoints. The A1.1/A1.2/A2.1 payloads remain byte-for-byte protected against the 0.9.0 release, including Spanish-first fields.

| Unit | Communicative outcome | Language support |
| --- | --- | --- |
| How things used to be | Describe past routines, people and places | Imperfect meaning; era, tenía, vivía, trabajaba, estudiaba, iba, hacía |
| What happened | Explain a completed event against past background | Regular -ER/-IR preterite; comí, viví, salí; estaba when an event happened |
| Getting around | Clarify connections/directions and recover from a missed departure | Perdí, tuve que, pude/no pude; route sequencing and ticket validity |
| Eating out | Order several items, check ingredients and resolve an order/bill problem | Polite familiar requests; dijo; completed order versus current missing item |
| Shopping and everyday services | Explain fit/faults, show a receipt and request an exchange | Vine, no quise; condition, price and fit comparisons |
| Plans change | Explain a past cause and agree an alternative arrangement | Estuve as a bounded stay, inability/reason, familiar ir a plans |
| What do you think? | Give a simple opinion/reason and agree/disagree politely | Creo que, me parece, también/tampoco; vi; shared facts versus preferences |
| A day that did not go to plan | Connect background, problems, solutions, current result and new plans | Retrieval of imperfect/preterite/perfect/present/ir a, two–four constrained sentences |

The imperfect frames routines, descriptions or ongoing background; preterite presents completed events or bounded situations. A two-year stay may be presented as a completed whole with viví or internally as background with vivía: duration alone does not choose tense. Tenía que versus tuve que and podía versus pude are taught in specific situations without claiming all uses are interchangeable. No quise comprar describes a particular declined purchase.

Productive irregular expansion is limited to useful contexts: tuve, pude, dijo, vine, quise, estuve, vi; previous fui/hice/llegué remain available. The imperfect adds regular -aba/-ía, irregular ser/ir and familiar weather/routine chunks. Present perfect remains recycled for open-period experience (including he ido). Incidental glossed reading forms do not automatically become a full learner table. Doler remains contextual health language; there is no six-person doler table.

All A2.2 task prompts are Spanish-first with safe optional English task support. Support records assistance without changing correctness or the 80% threshold. Stories retain bilingual short comprehension and rereading; connected Spanish production still uses finite authored variants. Checkpoints include a practical new transfer task rather than duplicating the writing prompt.

A2.2 adds 56 Listening, 56 Speaking, 64 contextual Conjugations and 20 curated table targets. Focused media follows completed teaching units/earlier placement assumptions; grammar games follow the existing level ceiling independently of course completion. The new material feeds existing stable-ID reviews, outcomes, weakness signals and Today’s Review. Full tables still require spaced unassisted recall. See [the quality report](docs/A22_QUALITY_RELEASE.md) for vocabulary findings and review limits.

At the historical A2.2 release boundary, B1 was not yet implemented; the full-course release below supersedes that availability statement. Educator/native-speaker review, learner transfer evidence and a physical-device upgrade/TTS check remain important; automated completion is not a pedagogical certification.


## Full-course writing release (1.0.0 historical record)

The 1.0.0 release established A1.1–B2.2, 576 activities / 3,328 slots / 256 stories. At that release, the original 288 A1–A2 activities retained their complete content and identity contracts; the dedicated-writing audit added assessment metadata without changing their objectives, answers or prompts. All new B activities were original, Spanish-first and included optional English help. Hints and model-assisted revision carry weaker evidence. The selective 1.1.0 and 1.2.0 amendments below supersede only their explicitly documented earlier content.

Writing modes are chosen by task openness, not response length alone. Named-role retrieval remains Controlled. Guided writing accepts known variants but treats an unexpected formulation as uncertain/model comparison, not failure. Free writing is never automatically verified. Coverage markers support reflection, not grammatical certification. Only narrow high-confidence rules and explicit morphology context diagnose errors. Quoted errors, article/verb homographs and proper names receive conservative safeguards.

Each new unit retains three six-item core activities, four five-question readings, one five-item writing activity and a nine-item checkpoint. Dedicated writing progresses Controlled → Guided → Controlled retrieval → Guided revision → Free connected production (16/16/8 items per B stage). B checkpoints integrate a new summary for a reader unfamiliar with the final scenario; five objective items use the existing 80% threshold, while four open responses require reflection and are excluded from verified accuracy. Completion demonstrates course participation and objective retrieval, not verified essay competence.

Stories develop from concrete B1 situations into B2 viewpoint, qualified evidence, argument and register. They test context, causes, inference, viewpoint and response. Actual word ranges are reported in the release audit, rather than inflated to meet approximate length guidelines. Every stage has 32 original passages. Glossaries follow the actual passage form or a useful transparent lemma. Vocabulary is recycled through the same social, travel, work, service and neighbourhood situations; lexical exposure statistics are not mastery scores.

Focused B banks adapt original course scenarios into 56 Listening and 56 Speaking items per stage. Audio comprehension varies sequence, contrast, cause, intention, viewpoint, dialogue and inference. Speaking asks for accounts, reasons and connected proposals rather than only translations. Narrative/retelling items require the source story; all clips remain synthetic Spain Spanish and speaking is self-assessed.

Grammar grows deliberately: B1.1 past-event/background integration, duration, future intentions and conditional advice; B1.2 limited subject-changing wishes, reactions and necessity; B2.1 prior past, uncertainty, source attribution, register and imagined present conditions; B2.2 retrospective alternatives, qualified arguments and limited compound subjunctive. These are communication tools, not an exhaustive conjugation syllabus. Curated table sources and first-party diagnostics share reviewed paradigms. Direct third-party conjugator embedding, dictionary spelling and NLP intent scoring remain explicitly deferred for the reasons in WRITING_ENGINE.md.

The independent grammar level still controls table/sentence practice ceilings. It never changes course completion, placement or the required starting path. Spaced recall and assistance affect density and review priority. Unverified open writing only contributes modest self-assessed outcome/concept evidence, never inferred mastery of every form in the learner’s response. Needs-practice items retain historical question/model context and the previous response for revision.

The final B2 Home milestone reports actual completed activities, assumed foundations if any, practical capabilities and review/media maintenance. It offers no unavailable C course and makes no formal CEFR claim. See [the release report](docs/release/V1_REPORT.md), [facts](docs/release/v1-audit.json), [writing audit](docs/release/a1-a2-writing-audit.json) and [user-test plan](docs/release/USER_TESTING.md).

## Contextual vocabulary exploration (1.1.0)

The offline learner dictionary adds exploration without altering the course progression or objectives. Visible Spanish has contextual word/expression lookup, known form→lemma metadata and existing es-ES pronunciation. Phrase meanings take precedence where confidently recognised; unknowns/homographs remain conservative. Profile holds Saved Words. Opening/saving vocabulary never counts as a hint, answer, mastery evidence or course completion.

This release selectively improves six A1 Conjugations sentence carriers, the A2.1 plural-address instruction, natural clothing alternatives and Spain transport wording/notes. Original IDs, activity order, targets and historical accepted variants are retained; all changes are recorded in [the correction manifest](docs/release/dictionary-content-corrections.json). Tomar transport phrases stay valid; the regular Tomé teaching target is not replaced blindly. Vosotros/as is described as the usual informal plural in most of Spain, with useful Latin-American notes retained. Stories and wider learning objectives are unchanged.

See [dictionary architecture](docs/LEARNER_DICTIONARY.md) for first-party provenance, exposure coverage and safe vocabulary extension. Word lookup is not a general writing grader; the existing controlled/guided/free uncertainty policy remains.

## Visible-word help and responsive Android policy (1.2.0)

Visible Spanish may be explored before submitting an answer, including a conservatively identified Spanish quotation in an English prompt and Spanish answer-option text. Tap a word for its contextual dictionary; tap the separate radio/card/padding to choose an answer. Radio selection and token lookup have independent keyboard/focus semantics, and interactive token controls are never nested inside the answer button. Hidden models/transcripts and correctness metadata remain inaccessible to lookup. This is vocabulary exploration, not a scoring hint or mastery event. The early discovery tip stops after successful lookup; Saved Words stays in Profile and Review stays in the original five-tab navigation.

Samsung S22/S24/S25 represent responsive Android conditions rather than a physical-resolution target. CSS/native-inset tests vary portrait/landscape, gesture/three-button navigation, cutouts, overlay/resized keyboards, light/dark and large text. Safe areas still come from one native source. Long choices wrap beside a dedicated radio; the dictionary and More remain within the usable viewport and can scroll. These automated profiles do not replace real-device accessibility, acoustic TTS or educator review. Exact performed validation is recorded in [BUILD_STATUS.md](BUILD_STATUS.md).

## v1.6 Practice policy

The visible five-tab order is Home / Learn / Practice / Review / Profile. Internal Games routes stay for save compatibility. Practice is optional reinforcement; Review remains spaced retrieval. New skill pools use reached activities and encountered vocabulary. The existing two grammar engines retain learner freedom via per-activity Custom practice, with a current-course recommendation. No global Practice grammar picker. Home offers one recommendation; Profile retains Dictionary, Saved Words and Grammar Reference. See `docs/release/V1_6_REPORT.md` for evidence, selection and MVP limits.

## v1.7 Practice depth

Sentence Builder reuses reached course tiles, controlled/model sentences and short story excerpts with additive stable source identities. It never rewrites course questions or grades arbitrary prose. Spot the Mistake contains 185 explicit authored corrections (30/25/25/25/20/20/20/20 by stage); wrong Spanish is never generated by random substitution. Numbers & Time uses the local deterministic `practice-numbers.js` formatter/generator: stage-bounded 0–20 / 0–100 / 0–999 / 0–9,999, clocks at five-minute increments, valid non-leap day/month dates and integer-cent prices. Categories unlock from reached source activities; no global grammar override widens them.

Ten-item rounds prefer unseen exact models, suppress duplicate targets across sources/directions, balance concepts/categories, modestly weight recent learning and shared weakness, and retain 300 recent IDs. Different related challenges may return two questions after a mistake. Granular numeric evidence/recommendations and results remain practice signals, separate from course completion. All v1.6 IDs/snapshots remain compatible. `npm run audit:practice-depth` records stage-end depth and heavy replay; the [1.7 report](docs/release/V1_7_REPORT.md) distinguishes automated coverage from required human language/device review.
