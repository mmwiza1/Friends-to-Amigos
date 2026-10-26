# Friends to Amigos 1.4 — connected learning quality release

Starting main: `77ff528a6dd13f5cbc6d03b08c5a17c4b9b93191` (1.3.0 / Android code 14). This release is 1.4.0 / code 15; schema remains 2. Final commit and performed validation are recorded in BUILD_STATUS and the release delivery report. No CEFR stage, main-course activity, game bank or focused-media bank was added.

## Implementation and architecture

Two small vanilla modules centralise quality behaviour: `learning-quality.js` handles concept mapping, evidence-driven support, eligible mini-practice, interleaving, summaries and bounded attempt fields; `quality-view.js` renders reference/refresher/support/confidence controls. Existing engine, mastery, practice, games, Tables, speech, storage and navigation remain authoritative. No runtime dependency or new service is introduced.

- **Learn → practise → prove:** passed course activities optionally offer relevant grammar reinforcement while Continue stays primary. Weak Areas opens a reference/refresher before 3–5 targeted questions. Continue practising routes to eligible Tables or additional same-concept controlled course contexts. Return to Review is available. These sessions never grant course activities, checkpoints, placement or capabilities.
- **Scaffolding:** high support for absent evidence/repeated errors; medium otherwise; low only with at least six attempts, three spaced successes, four recent correct responses and low assistance/uncertainty for every relevant concept. Level selection is not evidence. Guides offer the taught pattern and, for multi-gap tasks, a labelled supported first gap. The grammar objective/snapshot never changes. Tables continue adapting blank density through existing evidence rather than click counts.
- **Feedback:** authored explanations retain precedence. Bounded comparison identifies unambiguous curated person/tense/irregular forms, pronouns, article agreement, ser/estar contexts, gustar number, missing negation and connector contrasts. Ambiguous morphology/paraphrases receive conservative model comparison rather than invented grammar analysis. Existing per-gap/game/Table diagnosis stays intact. Vowel accents remain optional; ñ stays distinct.
- **Why this question:** optional concise purpose from shared concept/source metadata. It is suppressed during the unanswered earliest A1.1 Unit 0 onboarding so it does not crowd the confidence ramp.
- **Spanish Help → English Hint:** authored simpler Spanish guidance precedes English on appropriate Spanish-first questions. Both remain hidden until requested; neither is a correctness label. Independent evidence > Spanish-supported > English-supported. Visible score/80% checkpoint rule stays unchanged. Dictionary lookup remains separate and unpenalised.
- **Confidence:** optional Sure / Not sure on selected review/recall and typed Table recall, not every course question. Uncertainty changes evidence strength/priority, never correctness. Whitelisted optional state round-trips safely; older saves default without requiring it. All per-question support/confidence resets on advancing Review, while interruption preserves the current question.
- **Meaningful progress:** actual independent retrieval after at least seven days and evidence-state transitions can appear. Strength is provisional; self-assessed imitation and repeated same-session answers cannot manufacture spaced mastery. Home/Profile keep completion and knowledge separate.

## Today’s Review, weaknesses and retries

Today’s Review combines due historical snapshots, weak material, older successful completed material, recent completed content and confidence-building familiar retrieval. It keeps the first due historical item first; A1.1 remains focused, later levels alternate topic/modality through the eligible remainder. New learner sets are capped at four when no answer history exists; established sessions can contain up to twelve, with existing follow-up conjugation practice retained. Weak content is not a licence to expose future material. Related targeted practice follows the existing chosen grammar level; main-course/focused-media progress gates remain unchanged.

Summaries show reviewed count, supported strengths/needs and actual responses recalled after at least seven days. They do not show raw internal strength or claim permanent mastery. Retry uses actual misses/skipped-listening items plus a few eligible contrast questions where possible; identities/saved context remain intact. Main lessons, stories, checkpoints, focused practice and review use the shared retry path; existing Conjugations/Tables mistake sessions remain. Open-writing uncertainty stays model comparison/reflection, never fabricated objective accuracy.

## Grammar Reference and regular -ER decision

All 44 syllabus concepts have an original concise explanation, useful examples, common mistake/contrast and practice route. Curated paradigms provide the exact six Spain-first rows where pedagogically appropriate. All reference pages are readable; practice respects the already established manual grammar-level selection. The system does not infer mastery merely from that selection.

Regular -ER present is now A1.1, alongside -AR/-IR. Comer is linked to the existing A1.1 café teaching source, with an explicit first-look pattern reminder/reference before practice. Its permanent ID remains `table-a12-comer-present`; A1.2 keeps consolidation metadata. No main activity, slot or order changes. Table target counts are now A1.1 11 / A1.2 13, with 82 total unchanged. The A2.2 sentence-game payload is preserved using its consolidation dependency. Contextual gustar/doler are not expanded into misleading beginner six-person tables.

## Listening and shadowing

The existing 448 listening items already include phrase, sentence, connected utterance/dialogue, gist/detail, sequence, reason and supported inference categories. Their authored IDs and bank remain unchanged. Audio-first, actual speech-start acknowledgement, delayed/failure locking, 0.75×/1× and post-attempt transcripts remain. Post-attempt phrase replay highlights the selected suggested chunk without claiming timed acoustic alignment.

Shadowing reuses ten eligible existing speaking prompts per session: hear, repeat aloud, reveal suggested phrasing, replay normal/slow and self-assess Comfortable / Needs practice. Audio must actually start before reveal/self-assessment; delayed or failed playback stays locked. Navigation cancels speech. A separate stable shadow identity prevents assisted imitation from clearing the original harder speaking-recall review. Exposure and related weakness selection still connect them. Model-assisted evidence is deliberately weaker than self-assessed recall. There is no microphone permission, recording, recognition or pronunciation score. Speech is synthetic es-ES; installed voice availability and acoustic quality require device testing.

## Content/load audit and justified changes

The automated internal scan covers all 360 A2.2–B2.2 activities / 160 stories, with bounded instruction/passage/glossary checks and Unicode-safe duplicate-word detection. Manual internal review sampled the first story of each of the 40 units, plus writing models, feedback, syllabus/reference contrasts and paradigms. The generated report records all activities, not just samples.

| Stage | Story word range | Maximum instruction words | Maximum glossary entries |
| --- | ---: | ---: | ---: |
| A2.2 | 81–107 | 28 | 4 |
| B1.1 | 107–118 | 36 | 3 |
| B1.2 | 111–122 | 36 | 2 |
| B2.1 | 122–146 | 37 | 3 |
| B2.2 | 153–195 | 37 | 3 |

Two genuine incidental-load issues receive contextual glossary support only: `b11u2story0` explains **No los compres aún** as a fixed request; `b11u3story0` explains **no le dijera simplemente qué debía comprar** as a supported chunk whose pattern develops later. Their bodies, questions, accepted targets and objectives are unchanged. [The exact manifest](v14-content-support.json) protects those minimal additions; original historical fixtures remain untouched. No speculative naturalness rewrite or broad B2 simplification was made.

The structural scan reports no remaining threshold/adjacent-word flags. This does not prove naturalness, appropriate semantic novelty or CEFR coverage. First-seen surface forms include familiar conjugations/names and are not a vocabulary-knowledge measure. B-level expository endings, register consistency, inference ambiguity, task load, model naturalness and actual transfer still require independent educator/native-speaker and learner validation. No such review is claimed.

## External recommendations and maintenance

All 30 records / 29 URLs were checked against current public first-party information on **2026-10-26**. Known near-November-2026-expiry Simon/Peppa entries were replaced by Cleo's series catalogue and the official MUZZY Spanish collection. Linguriosa was replaced by the verified official Spanish Language Coach site because reliable current primary details were insufficient, not because disappearance was established. Dreaming, Easy Spanish and Español con Juan links now use current stable official destinations. Provider metadata distinguishes variety, listening/reading relevance, access/payment, review date, partial verification and known expiry. See [the complete item-by-item review](V1_4_RECOMMENDATIONS.md).

`npm run audit:recommendations` is offline developer QA for HTTPS/provider allowlist, metadata/ranges/dates, known expiry, stale review and intentional duplicate rationale. Optional network diagnostics never run at startup. Partial publisher crawler access, incomplete channel inventory and untested regional playback are explicitly documented. Stable series/channel/catalogue pages are preferred to disposable episodes.

## Compatibility, tests and release gate

Schema-v2 discovery, v1 migration, invalid-import protection, recovery/read-only handling, active lessons, writing reflections, all permanent course/game/Table/media IDs, historical review snapshots, scheduling, Saved Words, placement, Today, five tabs and native Back remain. New optional support/confidence/presentation fields are bounded/whitelisted. Scaffolded success cannot clear an older harder review. Original historical fixture payloads are unchanged; strict developer-only inverses recognise the two exact live glossary additions and the intentionally moved -ER metadata, never mutate learner history.

85 new JS cases cover all references, support thresholds/spacing, unsure/assisted evidence, diagnostic contrasts, retry, interleaving, snapshot isolation, safe shadow resume and speech-start gating, actual concept/form mapping, glossary whitelisting, mini-practice continuation and chunk replay. All 1,506 baseline cases remain. Browser checks retain all previous 28,556 assertions/profiles and add quality surfaces on fifteen layouts. The fifteen-image showcase was recaptured from the current runtime, and its integrity guard passes. Native tests add an allowlist/lookalike check for replacement providers. Performed combined validation: **1,591 JS cases passed / 0 failed / 0 skipped**, **29,156 browser assertions / 15 layouts**, Android **BUILD SUCCESSFUL**, **15 native tests passed / 0 failures/errors/skips**, lint **0 errors / 12 baseline warnings** in [run 40325727162](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40325727162). Syntax/content, full audit, learner contract, recommendation and load audits passed. Local Node 24 also passed all 32 file-isolated suites. All 69 APK web assets were verified byte for byte. The final documentation commit repeats the gate before main promotion. Exact evidence/limits belong in [BUILD_STATUS](../../BUILD_STATUS.md).

## Freeze recommendation and remaining validation

Freeze feature/content expansion and begin serious learner and educator validation of the existing A1.1–B2.2 product. The release supplies deterministic connected support and regression protection, not proof of learning effectiveness. Before adding course content, prioritise physical-device TTS/IME/navigation, beginner comprehension, longitudinal review effectiveness, B-level naturalness/register/inference, conservative-writing false acceptance/rejection and recommendation regional access. No C1/C2 expansion is recommended.

No physical-device/emulator/acoustic TTS test, human educator review, native-speaker review, formal CEFR assessment, arbitrary prose grammar checking or AI adaptation is claimed.

## Files in this release

- `docs/release/V1_4_RECOMMENDATIONS.md`
- `docs/release/V1_4_REPORT.md`
- `docs/release/v14-content-support.json`
- `docs/release/v14-learning-load.json`
- `scripts/audit-learning-quality.cjs`
- `scripts/audit-recommendations.cjs`
- `scripts/content/quality-support.cjs`
- `tests/quality-release.test.cjs`
- `www/learning-quality.js`
- `www/quality-view.js`
- `.github/workflows/android.yml`
- `BUILD_STATUS.md`
- `COURSE_DESIGN.md`
- `README.md`
- `android/app/build.gradle`
- `android/app/src/main/java/com/friendstoamigos/app/NativePolicy.java`
- `android/app/src/test/java/com/friendstoamigos/app/NativePolicyTest.java`
- `docs/LEARNER_DICTIONARY.md`
- `docs/STATE_AND_QUESTIONS.md`
- `docs/release/V1_3_RECOMMENDATIONS.md`
- `docs/release/V1_3_REPORT.md`
- `docs/resources/CODEX_REFERENCE.md`
- `docs/resources/INTEGRATION_GUIDE.md`
- `docs/screenshots/cloze.png`
- `docs/screenshots/conjugations.png`
- `docs/screenshots/feedback.png`
- `docs/screenshots/manifest.json`
- `docs/screenshots/profile.png`
- `docs/screenshots/review.png`
- `docs/screenshots/sentence-building.png`
- `package.json`
- `scripts/browser-check.cjs`
- `scripts/learner-release-audit.cjs`
- `tests/expansion.test.cjs`
- `tests/helpers/content-corrections.cjs`
- `tests/showcase-v13.test.cjs`
- `tests/spanish-level.test.cjs`
- `www/a22-conjugations.js`
- `www/answer-feedback.js`
- `www/app.js`
- `www/b11-data.js`
- `www/blanks.js`
- `www/conjugation-targets.js`
- `www/engine.js`
- `www/focused-practice.js`
- `www/focused-view.js`
- `www/grammar-syllabus.js`
- `www/index.html`
- `www/learning-practice.js`
- `www/mastery.js`
- `www/practice-view.js`
- `www/quiz-view.js`
- `www/recommendations.js`
- `www/screens.js`
- `www/storage.js`
- `www/style.css`

Screenshot files were recaptured from the final runtime; identical PNG bytes remain unchanged in Git. Original fixtures and permanent-identity manifests are unchanged. The final tree/commit and performed gate are linked from BUILD_STATUS and the delivery report.
