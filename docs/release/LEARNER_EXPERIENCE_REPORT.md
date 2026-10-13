# 1.2.0 learner-experience quality report

Baseline: main `e6a4eaed045c255beb6e663b46d24e9d81d0b8a5` (1.1.0/code 12). Release: **1.2.0/code 13**, storage schema **v2**. This release refines the existing learner experience; it adds no course stage or navigation tab.

## Beginner confidence without a lower A1 standard

Exactly three regular Unit 0 teaching activities change structurally, retaining every permanent activity/question ID and their original ordering among the stories:

| Activity | Before | After |
| --- | --- | --- |
| `u0l0` | Greeting, subtle name completion, independent name recall at question 3, name response and immediate Luis role transfer | All five core questions have visible bilingual models. Three recognition items, one easy `Me ___ Ana` completion and one supported name-question response. No typed recall or role switching. |
| `u0l1` | Morning greeting, name-question completion, independent name-question recall, thanks response and thank-you transfer | Four supported choice/completion items; the first independent short name recall appears at core question 5. The sixth-slot listening question is unchanged. |
| `u0l2` | Farewell, greeting completion, farewell recall, repetition request and repetition transfer | Familiar farewell recall remains at question 3; the repetition request gets a visible model; question 5 restores Luis introduction transfer. Existing listening and self-assessed speaking remain. |

Meaning precedes grammar labels at the start. Early distractors distinguish familiar chunks rather than near-conjugations, and explanations are brief. The name retrieval/transfer accepted variants move to the later tasks. Historical saved questions keep their original types, variants and explanations; the current bank is not substituted on resume or review.

Review credit also protects the original learning burden: answering a newly easier task under the same permanent ID cannot correct an old independent-recall review. The task type and normalised canonical target must match the saved review before scheduled-success credit is added. Original review snapshots still use the established 1/3/7-day schedule, and benign punctuation/accent or prompt-wording changes remain compatible. This guard adds no identity or schema change.

There are still **144 A1 activities / 832 question slots** and **576 activities / 3,328 slots** across the full course. A1 Spanish text-production slots change from 240 to **237** (117 A1.1, 120 A1.2); 48 A1 listens and 16 self-assessed speaking slots remain. The dedicated `u0write` activity and every A1 checkpoint are unchanged. The usual recall/context/transfer pattern resumes after the on-ramp; objectives and the 80% checkpoint rule are intact.

## Meaningful anchor recycling

Only two later existing passages receive one short natural addition each:

- `u4story0`: Ana meets Marta and says **“Hola, Marta. Me llamo Ana.”**
- `a12u5story0`: Ana shows her flat and begins **“Vivo en este piso. Este es el salón.”** before **hay** describes the room.

The story questions, answers, glossary, objective and identities stay unchanged. The [exact content manifest](learner-experience-content-corrections.json) records **five changed activities / 23 compiled question payloads**, including the ten per-question copies of these two passages. Historical fixtures remain unchanged; compatibility tests assert the approved current values, then reverse only this explicit manifest for historical comparisons. A2/B content, games, tables and focused media banks are unchanged.

[The recurrence report](a1-anchor-recurrence.json) audits fifteen anchors over sixteen A1 units, with activity IDs, examples, task modes and literal-form gaps. It counts an activity once, excludes distractors/explanations/English and does not multiply the same embedded passage. The observations are:

| Construction | Activities containing it | Units containing it |
| --- | ---: | ---: |
| Hola | 12 | 4 |
| Buenos días | 4 | 1 |
| Me llamo… | 10 | 3 |
| Soy de… | 7 | 1 |
| Vivo en… | 7 | 2 |
| Tengo… | 22 | 11 |
| Quiero… | 16 | 7 |
| Me gusta… / Me gustan… | 18 | 4 |
| ¿Dónde está…? | 15 | 5 |
| Hay… | 21 | 8 |
| Voy… | 33 | 9 |
| Voy a + infinitive | 20 | 5 |
| por favor | 24 | 7 |
| gracias | 25 | 11 |
| a las… | 30 | 5 |

Eight literal-form gaps of four or more intervening units remain flagged. Names/origin/morning greetings cluster naturally around first meetings; requests, preferences and location phrases also have some long gaps. These are useful educator-review prompts, not fixed exposure quotas, proof of retrieval or a mastery score. Existing natural reuse was retained rather than forcing friends to repeatedly re-introduce themselves. Personalised SRS and separate focused media provide additional retrieval, outside this main-course audit.

## Dictionary before answering

`SpanishFragments` sees visible text only. It prefers explicit `spanishFragments`, `optionSpanishFragments`, `optionsLanguage` and `optionLanguages`. Without metadata, it conservatively recognises known Spanish quotations/inverted-punctuation fragments and clearly Spanish option text. Surrounding English and ambiguous English/Spanish homographs remain plain. This is a small language-boundary helper, not NLP translation or a correctness detector.

For **“Luis says ‘¿Cómo te llamas?’ What answers his question?”**, Spanish words in both the prompt and all Spanish options are explorable before selection. The card is a container with a dedicated radio button and sibling vocabulary text. Word tap/Enter/Space opens the dictionary and stops propagation; radio/card/padding selects. No invalid nested interactive buttons are created. Radios retain accessible option names, `aria-checked`, roving focus, arrow keys and Home/End; tokens have separate keyboard access and dotted underlines. Closing a popup returns to the same unanswered question.

Dictionary lookup never receives hidden correctness data, answers a question, reveals a hidden listening transcript/speaking model, changes `hintRevealed`, adds a review event or changes mastery/streak/score. Contextual phrase priority, form/lemma lookup, ambiguity, unknown handling, es-ES Hear, More and Profile Saved Words remain. The 1,212-entry bank and all 1,564 known form mappings retain their identities; regeneration refreshes only the salón example derived from the amended flat passage. A private 512-entry visible-string classification cache supports repeat rendering without caching answers, learner state or dictionary context. Input normalisation still tolerates vowel accents, ü and punctuation while **ñ remains distinct**.

An early Unit 0 discovery tip disappears after a successful known-entry lookup. Optional **true-only `dictionaryTipSeen`** records that product preference; unknown lookup does not acknowledge it and protected read-only state cannot be changed. Old schema-v2 and migrated v1 saves safely default to unacknowledged discovery. Saved question validation preserves optional visible bilingual `teachingModel` and Spanish-boundary metadata without replacing historical snapshots. Saved Words/import/export/review remain compatible.

## Samsung-style responsive hardening

The existing eleven rendered profiles gain four distinct named scenarios, for **fifteen profiles**. They simulate CSS viewports and native bridge values rather than asserting physical model equivalence:

| Named scenario | CSS viewport | Relevant variation |
| --- | --- | --- |
| Galaxy S22 light three-button | 360×780 | Top 28, bottom 48 and right 4 insets; normal text |
| Galaxy S24 dark gesture overlay IME | 360×800 | Top 28/bottom 24; overlay keyboard 310px |
| Galaxy S25 dark large-text cutout | 360×800 | Top 36/bottom 24, 8px side insets; text scale 1.35 |
| Galaxy S25 light landscape cutout | 760×360 | Top 20/bottom 24, left 34/right 16; text scale 1.2 |

Existing 320px, portrait/landscape, light/dark and resized-keyboard profiles remain. Native WindowInsets remain the sole safe-area source; no model detection, physical-pixel hard-coding or double padding is added. Choice radios have independent 44px targets, while sibling Spanish text wraps with zero horizontal overflow. Question/story/popup font sizing follows user text scaling without changing the palette. The popup/More uses available viewport/insets, avoids overlay keyboards, can scroll and closes on outside tap/Escape/Back. Saved Words search has scalable label clearance so its focus ring does not obscure text. Existing keyboard Go, multiline newline, focused-input scrolling, Today, placement and Android Back stay intact.

Regression subjects include all three opening lessons, first story, first written recall/transfer, mixed prompts, word lookup before selection, popup dismissal and later selection, Saved Words/search with IME, long options, dictionary More and multiline writing with IME. Native arithmetic tests cover density, gesture/three-button/cutout insets and resized-versus-overlay keyboards. Exact performed results and rendered manual review are recorded below and in [BUILD_STATUS.md](../../BUILD_STATUS.md).

## Validation

The final code gate is [run 38480352996](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/38480352996), source `616247d825fb1a78be639b5255401c2b0d8d7bb4` followed only by final documentation updates. `npm run check` and local `npm run audit` pass. CI `npm test` reports **838 passed, 0 failed/cancelled/skipped/todo**, +84 over baseline. The local Node 24 runner reports **28 file-isolated suites passed**, zero failed/skipped.

Rendered validation reports **20,640 assertions across all 15 layouts** (1,376 each), including all four named Samsung variations. `assembleDebug`, `lintDebug` and `testDebugUnitTest` succeed: **13 native tests passed**, zero failures/errors/skips; lint **0 errors / 12 existing warnings**. The downloaded **1,738,585-byte** debug APK contains all **64** web assets exactly as validated. See [BUILD_STATUS.md](../../BUILD_STATUS.md) for detailed results and the physical-device checklist.

The resumed work retained the implementation and recovered the existing GitHub validation branch. The workspace has no `.git` directory, so existing commits/trees and byte-level comparisons supplied branch/diff verification instead of recreating a checkout. The completed fixture fix scopes every injected screenshot command in its own function; this eliminates the duplicated `const l` declarations without suppressing exceptions, skipping layouts or deleting assertions. Manual rendered review also caught a search focus ring crowding its label; a scoped scalable margin and a rendered clearance check fix it. The entire gate was rerun afterwards.

Developer inspection included all opening lesson/story/recall/transfer screens, mixed prompts, answer-word popup/close/card selection, Saved Words, the named S22/S24/S25 layouts, large text, keyboard and landscape/cutout variants. Search labels are clear in the refreshed normal/large-text screenshots. No physical-device, emulator, acoustic TTS or native-speaker validation occurred.

## File inventory

42 tracked files: 12 added and 30 modified. No existing compatibility fixture was edited.

### Added

- `docs/release/LEARNER_EXPERIENCE_REPORT.md`
- `docs/release/a1-anchor-recurrence.json`
- `docs/release/learner-experience-baseline-contract.json`
- `docs/release/learner-experience-content-corrections.json`
- `scripts/content/audit-a1-anchors.cjs`
- `tests/beginner-ramp.test.cjs`
- `tests/learner-product-tip.test.cjs`
- `tests/learner-release-compatibility.test.cjs`
- `tests/preanswer-dictionary.test.cjs`
- `tests/samsung-responsive.test.cjs`
- `tests/spanish-fragments.test.cjs`
- `www/spanish-fragments.js`

### Modified

- `BUILD_STATUS.md`
- `COURSE_DESIGN.md`
- `README.md`
- `android/app/build.gradle`
- `android/app/src/test/java/com/friendstoamigos/app/NativeInsetsTest.java`
- `docs/LEARNER_DICTIONARY.md`
- `docs/release/dictionary-coverage.json`
- `docs/resources/CODEX_REFERENCE.md`
- `package.json`
- `scripts/browser-check.cjs`
- `scripts/check-course.cjs`
- `tests/app.test.cjs`
- `tests/dictionary-app.test.cjs`
- `tests/dictionary-ui.test.cjs`
- `tests/engine.test.cjs`
- `tests/helpers/app.cjs`
- `tests/helpers/content-corrections.cjs`
- `tests/identity.test.cjs`
- `tests/learner-clarity.test.cjs`
- `tests/spanish-level.test.cjs`
- `www/a1-review.js`
- `www/app.js`
- `www/dictionary-ui.js`
- `www/dictionary.css`
- `www/engine.js`
- `www/index.html`
- `www/learner-dictionary-data.js`
- `www/quiz-view.js`
- `www/storage.js`
- `www/style.css`

## Release boundaries and remaining human review

Home / Learn / Games / Review / Profile remains exactly the five-tab navigation. Review remains present; Saved Words remains inside Profile. No framework, account/backend, cloud service, speech recognition, microphone, commercial dictionary or third-party corpus is added. The first-party dictionary is a bounded vocabulary aid, not a solution button or general writing grader. Controlled/guided/free assessment, meaningful negation and the existing accent policy are preserved.

The on-ramp needs actual beginner feedback; literal recurrence gaps need pedagogical interpretation, not automatic insertion. Real Samsung S22/S24/S25 keyboard, large-text, screen-reader, upgrade/storage and acoustic offline-TTS checks remain necessary. Export and verify a backup before testing an APK with a different signing key. Automated tests can support readiness for physical-device testing; they cannot certify learner competence or Spanish naturalness.
