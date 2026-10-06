# Friends to Amigos A1 course design

A1.1 and A1.2 form the playable A1 course. This design uses CEFR-style can-do outcomes and the Spanish-specific scope guidance documented for Instituto Cervantes, with communicative/OER teaching principles. It is not formal CEFR certification. A2.1–B2.2 remain planned, not playable.

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

Per unit: teaching activities have 5/6/7 questions; four stories and the writing activity have five each; checkpoint has nine. Total: **52 slots per unit, 416 per stage, 832 overall**, across the unchanged 144 activities. There are 240 scored Spanish-writing slots, 48 listening slots and 16 self-assessed speaking slots. Added media occupies existing teaching activities rather than inflating activity counts. One earlier checkpoint slot per unit is replaced by listening.

The first five teaching questions retain the recognition/model → completion → recall → contextual response → transfer structure. New listening follows familiar models; speaking follows high-value communicative practice. A1.2 moves toward connected responses without extensive past narration or A2 grammar. Answer lists remain short and finite.

## Reading and vocabulary load

All 64 stories have three specific choices and two short English/Spanish responses. Questions include facts, meaning, character, supported inference, sequence, contextual response and light transfer. The learner reads at their own pace before questions, and can reread during questions/review. Glossaries support unfamiliar scenario chunks rather than requiring their independent production immediately.

With the audit's Spanish surface-token method, A1.1 stories average 28.4 words (21–35); A1.2 averages 48.4 (34–65). These counts exclude numerals and are a pacing indicator, not a proficiency measure. The audit retained natural original passages and changed three A1.2 stories only to recycle familiar water/food/hunger within plausible breakfast, shopping and outing contexts.

Recycling also uses quantities, coffee/bills, keys/phones, home locations, invitations and changed times across units. [The audit report](docs/A1_STABILITY_REPORT.md) records baseline-to-final surface-word unit coverage. `npm run audit` reproduces it; inflections, names and function words are not lemmatised and exposure is not evidence of mastery.

## Listening

Every unit has two teaching listens and one checkpoint listen. Both recognition and short typed comprehension are present. The full Spanish transcript is absent from the DOM before attempting; play/replay controls and the comprehension prompt appear first. Checking or deliberately skipping reveals the transcript with evidence-based feedback. Review hides the transcript again.

Early tasks identify a name, origin, drink or quantity. Later tasks distinguish a rejected alternative, current/meeting time, person/possession, changed day, preference/reason, fit or sequence. A1.2 can contain several familiar details. Vocabulary is introduced before it is used to test listening: size comprehension follows the size model; early location/time listening avoids later al lado de/delante del chunks.

Speech is synthetic es-ES using Android TextToSpeech or browser SpeechSynthesis with an offline voice. Content stores teaching rates of approximately .8–.95 and checkpoint rates up to 1.0; the learner’s Slow (0.75×, default) / Normal (1×) session choice currently overrides those rates. The native bridge honours the selected rate; older bridges remain compatible at their default rate. Platform errors may still require retry/skip. Skipping records a scored miss and retains the item for review; the unchanged 80% threshold means a learner can still pass a lesson while missing one question.

The model accepts an optional curated local recording path with TTS fallback, but none is populated. Human-speaker variability, natural overlapping dialogue and acoustic validation remain future work. No corpus, cloud speech service or microphone is added.

## Speak-aloud retrieval

One selected chunk per unit practises a useful utterance: greeting/introduction, personal details, ordering, price, family, object location, directions, meeting time, preferences, refusal/alternative, arranging a meeting, garment/size, trying on, home directions, routine and refusal with a reason.

The learner tries aloud, deliberately reveals one possible model, optionally hears it, then self-assesses. Different natural equivalents may also be considered successful. “Needs practice” enters spaced review. Speaking attempts are explicitly self-assessed, excluded from scored accuracy and cannot on their own earn a checkpoint/capability. The app neither records voice nor verifies pronunciation.

Completion and Home practice sessions rotate through units already practised (or introductory chunks for a new learner), favouring less recently retrieved items. This supports continued retrieval after the course is completed rather than offering an unavailable A2 lesson.

## Assessment and teaching feedback

Every checkpoint still has nine questions and four distinct constrained Spanish responses, plus one listening question, contextual response/recognition and controlled completion. Some deliberate prior retrieval remains; new contexts change names, objects, quantity, place, time or required response. Duplicate written model answers within checkpoints were removed. Threshold stays 80% (eight of nine); achievements/completion events remain unique.

The audit adds models before thirty-two and quarter-to clock recall, simplifies an unsupported two-hundred-euro gap, models después de desayunar before writing, supports Sunday in a transferred plan, and teaches a practical request for repetition. Required porque prompts no longer accept a por eso alternative that misses the explicit connector requirement. Three punctuation/hyphen duplicate answer-list entries were removed without changing which input is accepted.

Feedback explains concepts and reading evidence. There are 413 authored misconception examples across course slots (71 before the 0.5.0 learner-clarity pass), covering tener for age/hunger, ser/estar, gusta/gustan, adjective/article/number agreement, person endings, missing a in plans, reflexives/stem changes, clock versus activity time, and al versus a la. Other incorrect replies receive a transparent comparison with the nearest authored model plus the task’s explanation; this is not a general grammar grader. Valid unlisted paraphrases can still be rejected.

Matching tolerates case, punctuation, spaces, vowel accents and Unicode equivalence; ñ and negation remain meaningful. There is no substring matching, cloud grader or LLM. Longer free-form writing needs a separate assessment design, particularly before B1.

## European Spanish and references

Móvil, ordenador, piso, probador, vosotros/vosotras and supported queréis remain Spain-first targets; TTS uses es-ES. Brief regional/register notes explain common alternatives without multiplying beginner targets. Some relevant regional writing variants remain valid. No Latin-American voice pool is introduced.

CEFR/Cervantes provide reference scope; Semillas and documented OERs inform communicative sequencing, contextual grammar, comprehension and production. All new scenarios, transcripts, questions, distractors and explanations are original Friends to Amigos material. No third-party text/audio is copied or closely adapted. Future reuse requires exact-item licensing/provenance under [the attribution policy](docs/resources/ATTRIBUTION_TEMPLATE.md).

## State and architecture

Activity IDs, tuple-style A1.1 units, stage APIs, existing completion/capability records and intentional ordering remain compatible. New permanent question IDs decouple review from wording. Schema-v2 validation/migration preserves valid v1 saves and historical snapshots; incompatible or corrupt roots are protected, and unsafe imports cannot overwrite valid progress. See [STATE_AND_QUESTIONS.md](docs/STATE_AND_QUESTIONS.md).

Stage source/story modules remain small local data modules. New `a1-review.js` records justified amendments after capturing the compatibility archive; `a1-practice.js` adds selective media. Rendering, storage and speech are separated from `app.js` without a framework/rewrite. Question ID manifests and fixtures must be extended deliberately when authoring new content.

The Learn selector remains ungated for playable stages. Continue respects active historical attempts first, then onboarding/preferred-stage progression. Future placement recommendations are labelled provisional and cannot launch an unavailable course.

## Later stages and release boundary

| Planned stage | Future practical progression |
| --- | --- |
| A2.1 | Recent experiences, travel choices, health needs |
| A2.2 | Routine problems, changed habits, practical requests |
| B1.1 | Connected narratives, reasons, main-point summaries |
| B1.2 | Discuss options, negotiate solutions, coherent complaints |
| B2.1 | Compare perspectives, develop arguments, adjust register |
| B2.2 | Interpret stance, synthesise accounts, defend proposals |

These remain provisional authoring targets. No later-stage lessons are playable. The A1 audit found no major unresolved gap within this course's stated everyday task scope, but broader A1 proficiency is not certified. Dates/contact information and unfamiliar human conversation are partial, not independently demonstrated.

Freeze the activity/identity contracts and reviewed content as an **A1 v1.0 release candidate**. Do not declare an unconditional stable release solely from simulated tests: native build/device upgrade/storage/TTS checks and a concise Spanish educator/native-speaker review remain release gates. The architecture can support A2.1 next, but complete those gates before expanding content. [BUILD_STATUS.md](BUILD_STATUS.md) distinguishes performed checks from remaining work.

## Mobile path and daily practice (0.4.0)

A1.2 placement defines a starting path with earlier foundations assumed, not marked completed. Optional A1.1 revision remains available; finishing the required path earns the course milestone with actual completion counts and accurate assumed-foundation wording. Ordinary A1.1 learners retain the full A1.1→A1.2 path. No course content or permanent identities changed in this product update.

Today integrates saved-attempt resume, bounded due review, the next required lesson and one short listening/speaking retrieval. It adds no new curriculum or grading. Listening now waits for verified playback start and offers 0.75×/1× replay; self-assessment, finite grading, Spain Spanish and offline voice requirements remain unchanged.

## Learner clarity and teaching feedback (0.5.0)

All 832 playable prompts were audited: 363 choice, 64 gap, 389 text and 16 speaking slots. Of 548 amended slots, 80 have clearer task wording and 517 lose redundant context prefixes (49 overlap). Early tasks give an explicit phrase to write; later tasks retain contextual retrieval. Typed tasks say “write”, speaking tasks say “say aloud”, and the UI labels recognition/completion/listening/production clearly. Spanish targets, accepted answers, passages, objectives, activities, permanent identities and ordering remain unchanged.

All 240 Spanish-writing slots were reviewed. Added 342 exact mistake examples across 171 slots, with 96 distinct explanations for predictable English-speaker errors: names/me vs mi, age, verb person/infinitive, agreement, gustar, reflexives, future-intention a, destination contractions, orders and times. Three existing destination explanations now correctly teach going to a place instead of describing an infinitive; one name explanation is clearer.

Wrong feedback shows the learner’s exact response, a natural finite authored model and why. Word-level underlining supports comparison. Exact authored mistakes take precedence; missing/extra/substituted/reordered words are described conservatively. Known grammar diagnoses require supporting target context. Unknown paraphrases are transparently outside the finite answer list and may still be valid. No LLM, fuzzy scoring or cloud grader was added. Historical snapshots retain their older prompts/explanations.


## Conjugations practice (implemented)

Games supplement the unchanged A1 course; they do not add activities, change objectives or constitute checkpoint evidence. The local bank contains 104 original A1.1 and 104 original A1.2 scenarios. Early items use one blank/explicit subject/infinitive; later items mix subjects, reduce hints and use up to three blanks. Contexts recycle introductions, café, family, possessions, directions/time, preferences, plans, clothes/home and routines. Correct forms are explicitly linked to positive course models; no past-tense or A2 targets are added.

Completed course activities determine eligibility. Placement assumes earlier-stage foundations, not earlier-stage mastery. The first new A1.2 forms still need their models. The limited early taught-form inventory intentionally delays a varied ten-item game until personal-information practice. Distractors contrast grammatical person, infinitive vs conjugation and singular/plural patterns. Feedback treats each blank independently and names the pattern to remember.

A1.2 normal rounds revisit four eligible A1.1 situations alongside six current-stage items, keeping foundational chunks in retrieval. Selection covers available persons before repetitions, weights verb/concept diversity and weakness, and rotates around a bounded recent history. Mistake practice uses up to five related eligible alternatives; Challenge favours harder unlocked items. Current-round concept signals say Strong today/Improving/Needs more practice; cumulative attempts guide future selection but are not certification or reliable mastery claims.

Normal passed lessons now continue along the required starting path, then review/listening maintenance. Failed lessons retain retry/mistake review. The 80% pass threshold, Today orchestration and all permanent course identifiers are unchanged.
