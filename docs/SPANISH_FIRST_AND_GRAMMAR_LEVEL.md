# Spanish-first tasks and level-based grammar practice — 0.9.0

Baseline: main `ec15c4cbfd991aae3798c6d9547c50c3e67776ce` (0.8.0). Baseline check and full suite rerun: 351 individual tests / 13 test files, all passing. The previous validated browser/native results were 2,189 assertions / 11 Android unit cases; they are baseline evidence, not results for this release.

## Shipped behaviour

- A1.1 keeps its English scaffolding. All 416 A1.2 and 416 A2.1 slots gain task-specific Spanish instructions and optional English task help. The original English prompt remains reference/snapshot data, not a parallel visible question. Reading, completion, practical writing, dialogue responses, listening and self-assessed speaking use simple recurring instructions.
- The English hint reveals only the task, persists through the current question/save/resume, and resets for the next question. It never interpolates the target, audio transcript or speaking model. Comprehension answer languages and authored finite Spanish targets are unchanged.
- Hint use records assisted evidence; it does not change correctness, score, checkpoint credit or 80% passing. Repeated use appears as “Understanding Spanish instructions · [unit] / Practise without English support”. Previously attempted tasks can return later for independent retrieval. This is support dependence, not an automatic grammar diagnosis.
- Games exposes Current grammar level / Change level. A fresh A1.1/A1.2/A2.1 profile immediately receives grammar through its ceiling without completing lessons. Placement supplies the initial selected stage; an explicit grammar-level choice overrides it. Learn-stage browsing alone does not silently change the grammar ceiling. Raise/lower it independently without losing course progress, placement, history or mastery.
- Grammar availability is level-based. Recent course answers/completions (last seven days, capped recent lessons), related due mistakes, form weaknesses, practice history and diversity influence prioritisation. These signals cannot lock other same-level grammar or complete course work.
- Conjugations: 272 contexts = 104 A1.1 + 104 A1.2 + 64 A2.1. Original A1 IDs/payloads are preserved. Normal rounds have 10 unique shuffled questions/options; later levels mix 6 current + 4 earlier (A2.1: 3 A1.2 + 1 A1.1). Recent 30-item avoidance, person/verb diversity and adaptive mistakes remain. Challenge stays within the ceiling. Per-blank distractors explain valid wrong-person forms and regular/irregular patterns. A2.1 evidence uses the actual tense, not “present” for everything.
- Conjugation Blanks retains 35 curated targets: 10/14/11 by stage. Normal games have 3 tables and four supported phases. New users start with 2 blanks even at A2.1. All six forms must demonstrate spaced, unassisted written recall before completely empty tables are used. Choosing a level never creates mastery. Practice allows 3/5/10/15/20 tables: Recommended, Current level, All up to current level, unit prioritisation, or custom level and grammar filters. All scopes stay within the ceiling. Recommendations include earlier retrieval.
- Game-only errors can create readable Weak Areas and a weak-table Today’s Review with zero lessons completed. Course evidence later joins those same records. Higher-level stored evidence remains intact when the ceiling is lowered but cannot select higher-level grammar.
- Valid higher-level game/table attempts are kept on import and paused by the UI at a lower ceiling. Raise the ceiling to resume; stored wording/options/checked feedback remain authoritative. Forged forms, options and inconsistent results still fail validation.

## Grammar syllabus

`grammar-syllabus.js` centralises concept levels, teaching sources, level resolution and recommendation factors. Individual targets reuse `conjugation-targets.js` forms/notes/accepted answers so there is no conflicting second set of paradigms.

| Level | Concepts represented |
| --- | --- |
| A1.1 | Regular -AR/-IR present in familiar language, ser/estar/tener/ir/querer, names with llamarse, singular gusta, agreement, practical questions, location/existence |
| A1.2 | Regular -ER/present consolidation, plural gustan, common stem changes, reflexive routines, ir a + infinitive, shopping/arrangements, simple connectors |
| A2.1 | Recent/open-period perfect, curated completed-event preterite, comparisons, practical modal needs/obligations, linked messages, contextual health doler |

Gustar/hay/doler are contextual structures, not misleading full beginner tables. A2.2/B grammar, broad imperfect contrast and advanced moods are absent. Existing table sources describe pattern teaching, not proof that the learner knows all six forms.

## Compatibility and content review

Schema remains v2 under the existing key. `grammarLevel`, language metadata, `hintRevealed` and assisted answer-event flags are additive optional fields. V1 migration, historical passages/questions, SRS schedules, completion/capability deduplication, Today, placement, games, focused media, native Back, keyboard Go, Android insets and dark mode remain covered.

No original course target, accepted response, choice, story, objective, activity ID or question ID was changed. Payload hash checks exclude only the four deliberately added presentation fields; original fields retain their previous hashes. Original 208 sentence-game payloads and all table identities/forms are protected. Separate tests validate all new language fields and game identities.

The content pass checked instruction/task alignment, hint leakage, accents/ñ, six-person Spain forms, compound participles, selected preterite, distractors and explanations. Current-unit practice prioritises associated verbs without filtering out other grammar; fresh higher-level profiles start at the introductory unit when their course path is elsewhere. A translated story question was corrected during review to preserve “left the outing to work”, rather than “did not attend”. Instructional perfect forms were removed from early A1.2 where simpler present phrasing works. These are new presentation-copy corrections, not changes to existing Spanish course text. No native-speaker/educator review is claimed. All new copy and scenarios are original Friends to Amigos content; no third-party attribution obligation was introduced.

## Validation

Local static checks pass; the expanded individual JavaScript suite currently passes 408 tests, zero failures/skips. Final npm, rendered-browser and native CI results will be recorded in BUILD_STATUS after validation. This environment has no Gradle/Android SDK/device; Chromium launch is subject to sandbox socket limits, so the existing GitHub workflow runs real Chromium plus Gradle/Java/SDK validation.

## Remaining release checks

Physically retest an in-place S24 upgrade with a real backup, button/gesture Back, keyboard Go, light/dark/large text, offline TTS and TalkBack. Specifically try fresh A1.2/A2.1 game-only profiles, raise/lower/resume, Spanish-first stories/writing/listening, persistent hints and a hinted checkpoint. Browser speech/insets are simulated; bridge start does not establish acoustic quality.

Finite grading can reject valid paraphrases. Hint independence is a transparent support signal, not certification. Games expose level-appropriate content before course models, so guides/option support remain important; selected level is self-declared/provisional. A2.2, ASR, microphone/recording, cloud services, accounts and backend work remain out of scope.
