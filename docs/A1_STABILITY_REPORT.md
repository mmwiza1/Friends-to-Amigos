# A1 stability and pedagogical audit

Reviewed 2026-10-06. This report records the earlier A1 stability revision; the subsequent mobile update leaves its curriculum unchanged. Current validation is in [BUILD_STATUS.md](../BUILD_STATUS.md). This records implemented changes and remaining validation, not an independent CEFR assessment.

## Baseline and resulting course

Latest main `94612c7920fbe25426388bd4b54c9b36f6edbb7d` had 144 activities, 784 question slots, 16 practical units, 64 stories and 240 Spanish-writing slots. All 54 original tests passed. Local state was v1; review identity primarily depended on prompt text; TTS exposed already visible models/stories rather than dedicated listening comprehension.

The result retains all 144 activity IDs/order, 16 units, 64 stories and 240 writing slots. It has 832 course slots: 32 added teaching listens and 16 added speaking chunks; 16 checkpoint listens replace existing slots. There are 871 permanent authored question IDs including special practice/placement. A1.1/A1.2 each have 72 activities, 416 questions, 24 listens and eight speaking chunks. A2.1–B2.2 are still unavailable.

The complete suite now has 116 passing cases versus 54 at baseline. Every playable activity/question is rendered/completed in simulated DOM; every checked course attempt is validated through import/export round-trip. These checks do not substitute for physical Android, acoustic or independent teaching review.

## Technical corrections implemented

- Permanent question namespaces distinguish duplicate prompts/stages/checkpoint slots. Legacy exact signatures are reference-only migration aids, not new review identity.
- Deterministic/idempotent v1→v2 migration preserves valid learner history and original question/passage snapshots. Mapping requires an unambiguous unchanged type/model target; replaced targets retain their own legacy IDs.
- Invalid local records are retained for recovery where possible; unsupported/malformed roots remain untouched and exportable. Unsafe imports cannot overwrite current progress. Completion/capability/event duplicates and impossible counters/dates are repaired conservatively.
- Active question alignment, selected result and model/playback flags are validated without substituting new questions. Existing attempts take priority over incomplete onboarding; missing flags can be inferred from valid progress.
- Storage, speech and screen/quiz rendering were separated from the controller through small vanilla modules. No framework, cloud/API, account or runtime dependency was added.
- Playback cancellation, labelled synthetic speech, explicit voice failures/skip, keyboard focus, progress/input labels and status feedback improve the learning UX. Native code adds offline voice/rate/readiness/stop support and fixes the hardware-back double action.
- A1 completion now offers practical skills, statistics, reviews and continued media retrieval, rather than an unavailable next stage.

## Significant content changes and reasons

| Implemented correction | Reason / protected evidence |
| --- | --- |
| Teach ¿Puedes repetir, por favor? through a model, contextual response, Spanish transfer and checkpoint | Missing high-value repair skill: a beginner needs to ask for help/repetition, not only give a rehearsed answer |
| Replace a two-hundred-euro completion with a twenty-euro completion | Avoid an unsupported number jump in a small-price unit; retain price/plural agreement |
| Model treinta y dos before recall; model menos cuarto before clock recall | Recognition/model must precede independent retrieval, rather than expecting an unseen form |
| Support Sunday with domingo in an initial transferred plan | Changing time/day should test a familiar pattern, not silently require an unintroduced word |
| Replace a routine gap with primero me ducho y después me visto; add después de desayunar to phrase support | Separate reflexive/person/stem practice from an unmodelled preposition + infinitive construction |
| Require porque consistently where the prompt explicitly requests it | A semantically related por eso response can be valid Spanish but misses that task's explicit connector target |
| Remove three normalisation-equivalent punctuation/hyphen variants | Keep exactly the same accepted input while reducing duplicate authoring entries |
| Add optional yo to suitable first-person production models and practical alternatives to new tasks | Accept natural finite alternatives without negation/substring errors |
| Extend misconception feedback from 37 to 71 course-slot examples | Teach predictable age/hunger, person, agreement, location, future and reflexive mistakes rather than only a solution |
| Recycle hunger/bread/water in a shopping-to-café scene, water at breakfast, bread in a final outing, age in a family listen and phone at home | Useful A1 vocabulary was too confined to its introduction unit; these familiar items fit later situations naturally |
| Author 48 listening tasks, with early/late scaffolding checks | TTS beside visible text was not listening comprehension; hide transcripts and test meaning before reveal |
| Author 16 self-assessed spoken chunks | Reading/typing alone did not give a learner deliberate spoken retrieval; avoid unsupported pronunciation/ASR claims |
| Replace weak checkpoint repetition with contextual tasks/listening and four distinct written models in every checkpoint | The stated capability should require several usable responses and transfer, while retaining spaced retrieval and the 80% threshold |

The audit did not rewrite correct Spanish simply for stylistic variety, or mass-generate new units. Core stories and cast remain intact. Three A1.2 passages were amended for familiar vocabulary recycling; their existing comprehension evidence remains valid. Stable identity fixtures and the pre-amendment archive protect compatibility separately from current corrections.

## Vocabulary findings

`npm run audit` reports surface forms in positive Spanish teaching models, phrase banks and unique passages. It excludes English, distractors, accepted variants, repeated per-question reading text and checkpoint copies. It is an exposure count, not a mastery score or a lemmatised frequency analysis. Numerals are excluded from word counts; function words/proper names are included.

| Surface form | Units at baseline | Units now | Interpretation |
| --- | ---: | ---: | --- |
| pan | 1 | 3 | Café → shopping meal → final outing |
| agua | 1 | 3 | Café → shopping meal → routine breakfast |
| hambre | 1 | 2 | Recalled naturally before a later café visit |
| años | 1 | 2 | Personal details → family description in listening |
| móvil | 1 | 2 | Personal object → locating it at home |
| llaves | 2 | 2 | Already recurs across objects/home searches |
| café | 12 | 12 | Already strongly recycled; more repetitions were unnecessary |
| parque | 8 | 8 | Already connects directions, meetings, outings and routines |
| porque | 4 | 4 | Reason connector appears across preferences/clothes/routines/messages |
| después | 8 | 8 | Sequence connector is already reused widely in A1.2 |

There are 341 positive surface forms in the selected texts: 156 appear in one unit and 185 in at least two. This includes inflections, names and scene-specific items; it is not a claim that 341 vocabulary items define CEFR A1. Singular ordenador appears in two units; its plural only in a checkpoint, intentionally excluded from this metric. Glossed one-off scene words were not mechanically deleted, and every word was not forced into every unit. A future curated lexical inventory should track lemmas/chunks and learner retrieval, not confuse textual exposure with retention.

## Grammar/scaffolding findings

- Ser/estar: origin/characteristics vs present state/location remains supported; targeted mistaken forms explain the distinction.
- Tener: age and hunger precede independent production and recur in feedback/listening.
- Hay: presence/absence contrasts with locating known objects; later rooms/furniture consolidate it without conjugating hay for plural nouns.
- Present person endings: hablo/vivo/desayuno and relevant quiero/puedo/voy/prefiero are modelled as practical forms. Broad conjugation tables are not required to use the task.
- Articles/gender/number/adjectives: greetings, relatives, objects and clothes recycle agreement. Azul/azules and marrón/marrones are supported; accepted regional nouns keep appropriate articles.
- Gustar: singular noun/infinitive first, plural gustan later; te→me responses, no, también/tampoco are contextualised.
- Plans/time/prepositions: ir a + infinitive and al/a la/del distinctions remain explicit. Models now support number/quarter-hour recall; activity time differs from current clock time.
- Reflexives/stem changes: me levanto/ducho, visto and acuesto are modelled before transfer. Después de + infinitive is now supported separately.
- Connectors: A1.2 actually requires connected responses using y/pero/porque/después/entonces, with explicit prompts honoured by the finite grader.
- Address: supported vosotras/queréis and polite usted clothing requests maintain Spain usage. Complex por/para analysis and past-tense narration are deliberately outside this A1 course's grammar targets.

No clear unresolved grammar error was found in the reviewed passages/models after these changes. That is an authoring review, not native-speaker sign-off.

## Reading, writing and listening findings

All 64 passages/comprehension sets were reviewed. A1.1 has compact greetings, orders, purchases, family/object/direction/time scenes; A1.2 has choices, invitations, changed plans, fit, home searches, routines and messages. Glossaries support occasional lexical stretches. Facts are not the majority of story questions; character, meaning, next action and light inference stay text-supported. Passages remain rereadable in review.

A1.1 passages average 28.4 positive tokens (21–35); A1.2 averages 48.4 (34–65). A1.2 thus increases connected reading demands without a past-tense jump. Three amended passages keep their original question evidence and stage appropriateness.

Writing retains 120 constrained Spanish slots per stage. A1.1 prioritises chunks/simple sentences; A1.2 combines preference/contrast/reason, day/time/place, routine sequences and plans. Realistic alternatives include optional pronouns, time placement, purchase phrasing and both probarme/me puedo probar positions. The audit fixed connector-constraint mismatches and normalisation-equivalent duplicates. Every authored answer remains finite/exact after normalisation; a valid unlisted paraphrase can still fail.

Listening uses familiar language, both choice and bilingual typed comprehension, and progresses from a single detail toward contrasts, alternatives, multi-detail plans and reasons/sequences. Earlier listeners avoid later prepositional chunks; size listening follows size models. Synthetic speech is explicitly labelled and does not represent natural speaker variability. The browser/native bridge tests confirm requested playback/metadata and UI hiding, not acoustic pronunciation quality.

## European Spanish and licensing

Móvil, ordenador, piso, probador, vosotros/vosotras and queréis remain primary/supporting targets; native/browser speech selects es-ES. Short regional notes and relevant accepted alternatives are retained. No new dialect inventory or imported speaker pool is added.

CEFR and Cervantes are scope references, not copied descriptors/tables. Semillas/Hola a Todos/Trayectos and the other documented OERs inform pedagogy only. New passages/transcripts/questions/feedback are original Friends to Amigos authorship. No third-party wording was copied/closely adapted; no new external asset attribution is required. Exact-item licences must be verified for future reuse. No MLS, Common Voice, FLEURS, CSS10, FSI archive or Tatoeba collection was downloaded or vendored.

## Practical A1 coverage

“Adequate” below means repeated authored practice within the stated beginner scenario, not proof of independent real-world proficiency.

| Ability | Status / evidence |
| --- | --- |
| Introduce yourself / exchange names | Adequate: greeting/dialogue/recall, story, writing, listening and spoken chunk |
| Give basic personal details | Adequate for age/origin/home city/languages; broader address/contact forms partial |
| Basic social interaction | Adequate: courtesy, farewell, help/repetition request, agreement and polite refusal |
| Order food/drink / request bill | Adequate: café choices, hunger, changed order, production, listening and speaking |
| Numbers/prices / simple purchases | Adequate for small totals/quantities and supported amounts; separate numbers practice also available |
| Family/people | Adequate: relationships, introductions, physical/personality description and agreement |
| Possessions/everyday objects | Adequate: identify, distinguish colour/owner, search and locate |
| Location/directions | Adequate for nearby/far, right/left/straight and familiar destinations |
| Time/routines | Adequate for clocks/meeting times and simple reflexive sequences |
| Preferences | Adequate: likes/dislikes, shared interest, contrast and reason |
| Invitations/accepting/refusing | Adequate: polite acceptance/refusal, changed day/time and availability |
| Plans/future intention | Adequate: ir a + infinitive with day/time/place and sequence |
| Clothing/basic shopping | Adequate: item/colour/size, try on, fit, choice and card payment |
| Home/rooms | Adequate: presence/description/location and helping a visitor |
| Simple connected messages | Adequate within short authored responses; broader free writing partial |
| Read familiar everyday Spanish | Adequate authored stories/messages/glossaries; unseen authentic material partial |
| Listen to familiar Spanish | Implemented throughout, adequate controlled synthetic practice; unfamiliar human conversation partial |
| Produce useful spoken chunks | Implemented across all units; independent conversation/pronunciation assessment deliberately deferred |
| Calendar/contact detail breadth | Partial: selected weekdays, times and personal-form context; months/full addresses/telephone exchanges are not course claims |
| Sustained free-form/interactive assessment | Deliberately deferred: reliable evaluation is outside finite A1 answers and the excluded ASR/cloud scope |

The clear implementable core gap—asking for repetition—was corrected, along with listening/speaking retrieval and stronger checkpoint transfer. This bounded course is not an exhaustive CEFR examination syllabus; forcing every broader topic into the existing 16 units would change their deliberate practical scope. The partial areas remain explicit rather than being advertised as mastered. Native educator review should decide whether another small contact/calendar extension is warranted before an unconditional content freeze.

## Checkpoints and completion

All 16 checkpoints were reviewed. Each now has one audio-first task, contextual response evidence, controlled completion and four distinct Spanish model targets. Some taught chunks intentionally recur for retrieval; a checkpoint no longer consists solely of preceding questions copied verbatim. The 80% pass threshold is retained and tested at seven/eight of nine; earned capability text and statistics remain unique and historical records are preserved.

Completing all 144 A1 activities produces a congratulatory Home state, practical-skill list, minutes/capabilities, outstanding/due review counts, and dedicated listening/speaking practice. No unavailable A2 launch or CEFR certificate is offered. Speaking evidence remains self-assessed and excluded from scored completion.

## Validation, limitations and deferrals

See [BUILD_STATUS.md](../BUILD_STATUS.md) for executed commands and the physical-device checklist. JavaScript syntax/static checks and all 116 tests pass. Native compilation/Gradle checks, physical WebView storage upgrades, picker/lifecycle/TTS tests and acoustic evaluation remain unperformed because SDK/Gradle/device tools are absent. The manual workflow is configured to build/lint/test, not claimed executed.

Deferred deliberately:

- Curated human voices: require exact recording-level licensing, selection and acoustic review; current task uses original TTS and forbids bulk corpora.
- ASR/pronunciation scoring/cloud/LLM grading: explicitly excluded; speaking remains self-assessed.
- Generalised lemma/retention analytics: would add disproportionate linguistic tooling for this small course; current reproducible exposure statistics are transparent.
- Broader free-form production, especially before B1: needs an assessment design beyond finite authored matching.
- Native-speaker/educator validation and real-device/build checks: unavailable in the current environment; these remain release gates, not claimed passes.
- Maintained Android release signing: current manual debug builds use runner/local debug signing. A stable signing key is needed for repeatable in-place distribution; no private signing material is introduced by this task.


## File manifest

This update adds 17 files and modifies 20; it deletes none. Original stage/story source files and compressed feedback/artwork assets are unchanged. Playable amendments are assembled by the new reviewed modules.

Added:

- `docs/A1_STABILITY_REPORT.md`
- `docs/a1-vocabulary.json`
- `docs/STATE_AND_QUESTIONS.md`
- `scripts/check-course.cjs`
- `tests/fixtures/a1-activity-ids.json`
- `tests/fixtures/question-ids.json`
- `tests/fixtures/v1-mixed-progress.json`
- `tests/identity.test.cjs`
- `tests/speech.test.cjs`
- `tests/storage.test.cjs`
- `www/a1-practice.js`
- `www/a1-review.js`
- `www/question-ids.js`
- `www/quiz-view.js`
- `www/screens.js`
- `www/speech.js`
- `www/storage.js`

Modified:

- `.github/workflows/android.yml`
- `android/app/build.gradle`
- `android/app/src/main/java/com/friendstoamigos/app/MainActivity.java`
- `BUILD_STATUS.md`
- `COURSE_DESIGN.md`
- `docs/resources/ATTRIBUTION_TEMPLATE.md`
- `docs/resources/AUDIO.md`
- `docs/resources/CURRICULUM_REFERENCE.md`
- `docs/resources/INTEGRATION_GUIDE.md`
- `docs/resources/README.md`
- `docs/resources/WRITTEN.md`
- `package.json`
- `README.md`
- `tests/app.test.cjs`
- `tests/engine.test.cjs`
- `www/app.js`
- `www/curriculum.js`
- `www/engine.js`
- `www/index.html`
- `www/style.css`



## Freeze and A2 recommendation

The codebase has stronger migration/import protection, permanent question identity, meaningful listening/speaking and tested checkpoints. Preserve these activity/identity contracts and stop ad-hoc A1 churn by treating this as an **A1 v1.0 release candidate**.

Do not declare an unconditional stable A1 release or proceed immediately into A2.1 solely because tests pass. First run the native build/device upgrade/import/TTS checklist and obtain a focused native Spanish educator review of pacing, naturalness, accepted alternatives and the partial coverage above. If those gates find no major issue, freeze A1 v1.0 and begin A2.1 using the existing module/identity/state model. No A2 curriculum has been implemented here.
