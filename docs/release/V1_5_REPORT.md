# v1.5 learner experience and Stories release

Starting main: `39ad8188e985277468619326e9ddbf5bdf3f8d67`. Existing uncommitted v1.5 work was resumed and refined; v1.4 remains preserved. The main baseline workflow and 32 local test files passed before product work. Final performed results belong in BUILD_STATUS once the complete gate is green.

## UX and architecture

Small additive modules retain the vanilla offline architecture. `learner-experience.js` handles course-position labels, learner-oriented dictionary search/enrichment, the pronunciation primer and bounded local editorial reports. `story-editions.js` supplies explicit reviewed episode records and optional metadata. `spanish-forms.js` provides Unicode-aware whole-form substitution. Existing course, games, Tables, mastery, SRS, dictionary popup, speech and storage engines remain authoritative.

Games has two primary cards, one shared level selector, friendly ahead-of-course warnings and compact saved-round actions. Advanced settings move into Conjugations/Verb Tables. Explicit grammar choices remain unrestricted; they never award course completion. Home has Continue / Today / Quick Practice, with advanced tools disclosed and history-sensitive. Learn puts the current unit first with a practical goal/progress and one Continue; all revision activities remain accessible. Profile prioritises Vocabulary and progress; technical controls are lower. Review has Due Today / Weak Areas / Past Mistakes and useful empty states. The five tabs remain unchanged.

Lessons add orientation/type labels, concise wrong-answer teaching and optional fuller explanation. Completion keeps Continue strongest, secondary practice disclosed and meaningful mascot use. One-time Spanish transition and limited dictionary discovery are optional product state, not hints or mastery evidence.

## Dictionary and private feedback

The bidirectional learner dictionary reuses all 1,212 existing entries / 1,564 form mappings. No external dataset/service is added. English matching offers multiple analyses; saber/conocer have explicit original explanations. Thirty high-frequency noun notes add gender/examples in the searchable view, without changing permanent dictionary IDs or historical Saved Words. Existing senses, region notes, forms, Hear, Save/Remove and More remain. Unknown queries receive an honest bounded-dictionary message.

Answer reports store the permanent question/activity IDs, response/model, stage/unit/type and timestamp locally; 200 bounded records, short-term duplicate protection and optional safe import defaults. Export is explicit through browser JSON or the existing Android save bridge. Reporting never changes correctness, reviews, mastery or completion; no writing is uploaded.

## Stories and editorial boundaries

See [Story Bible](../STORY_BIBLE.md): exactly three primary characters, Ana/Luis/Marta, retain established relationships/early ages. Other existing characters remain supporting cast. Episodes stand alone and language matures without personality drift.

All 256 story slots receive metadata/readability improvements. Exactly 24 existing episodes are revised: three per stage, eight practical/everyday, eight social and eight comedy/chaos. Chat, dialogue, review/email, clues and multiple perspectives vary presentation; ungraded predictions and supplied-message construction vary interaction. Original activity/question IDs, order and unit goals remain. The other 232 original episodes are retained, not advertised as rewritten or evenly category-balanced. This bounded conversion follows the user's quality-over-quantity requirement; subsequent editorial passes can use the same bible/audit.

Revised B stories broaden adult-life contexts with neighbours, dates, flat searches, privacy, restaurant reviews and consumer misunderstandings alongside retained professional material. Draft audits removed premature past-perfect/imperfect-subjunctive use from lower-level new episodes and corrected glossary labels/translations. English help translates each actual Spanish question. Narrative/linguistic quality still requires independent educator/native-speaker and learner review; automated surface measures do not prove vocabulary familiarity or CEFR coverage.

## B-level corruption and distractor audit

The root defect was first-substring replacement: replacing `es` altered `Desde`. Whole-form boundaries now protect both the runtime B assembler and the Python authoring helper, and absence of a whole form raises an error. All 96 B core rows are checked against the safe substitution. Malformed/contradictory distractors were corrected in source and the three duplicated focused-listening option sets, retaining every bank/media ID. The existing 592-question game bank is preserved. `audit:stories` scans course/game/focused content for the known corruption/contradictory forms.

## Persistence and regression strategy

Schema remains 2, with optional validated `spanishTransitionSeen`, `dictionaryTipViews`, `contentReports`, reading `episode` metadata and ungraded `storyPrediction` presentation state. The discovery key, v1 migration, read-only/recovery protections, unfinished lessons, reviews, capabilities, placement, Today, games and Saved Words remain.

Historical snapshots are never rewritten. Review success now also checks the saved reading title/text before correcting a passage-based item. The explicit v1.5 content manifest records the before/after of 40 changed authored activities and three focused option sets. A strict developer-only inverse validates those exact amendments for old contracts; immutable fixtures remain untouched. The existing v1.2 fixture helpers restore original authored episodes so old finite-answer/reading tests still exercise historical content against the new runtime. New live tests separately cover revised stories and interactions.

A few presentation assertions intentionally change: compact Home/Profile hierarchy, shared grammar label, Verb Tables name, secondary game setup, collapsed stage exploration and purposeful mascot use. Original behavioural checks are retained; no layout/profile or compatibility assertion is skipped. Screenshot integrity deliberately blocks completion until current-build captures are reviewed.

## Validation and limits

The new regression file currently covers 55 cases, including every revised episode's grading/snapshot, dictionary directions/ambiguity, private export, optional preferences, Games/Back and safe substitution. Browser coverage retains the existing Samsung profiles and adds new layout/dictionary/report/story checks. Exact final totals/build results will be recorded after execution, not invented here.

No new stage, large game, cloud dictionary, backend, account, microphone/ASR, pronunciation score or Pixel-specific test infrastructure is introduced. Android/Samsung safe areas, keyboard/Go, Back and dark/light behaviour remain. [Manual QA](V1_5_MANUAL_QA.md) and [release notes](V1_5_RELEASE_NOTES.md) are prepared. No physical-device, acoustic TTS or external human validation is claimed.
