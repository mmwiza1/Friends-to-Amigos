# Codex resource reference

Last reviewed: 2026-10-13

For future curriculum, writing, listening or learning-engine work, inspect the relevant files in this directory before choosing third-party dependencies or designing new behaviour.

## Core resource documents

- `README.md` — overall external-resource shortlist, status key and implementation history.
- `WRITTEN.md` — curriculum/written-learning references.
- `AUDIO.md` — audio sources and redistribution cautions.
- `INTEGRATION_GUIDE.md` — provenance/licensing/integration rules.
- `ATTRIBUTION_TEMPLATE.md` — attribution record format.
- `WRITING_ENGINE.md` — recommended architecture for deterministic Spanish writing assessment and feedback.
- `writing-tools.json` — machine-readable writing-tool shortlist, licence/status and intended role.

## Writing-engine priority

For writing-related tasks, do not automatically install every researched tool.

Preferred sequence:

1. First-party Friends to Amigos learner-error rules and structured feedback.
2. `ehoogerbeets/conjugator` for deterministic verb-form diagnostics.
3. `nspell` for spelling diagnostics, only after an explicit licence decision for the Spanish `dictionary-es` data.
4. NLP.js as an optional experiment for guided-writing intent/meaning recognition.
5. LanguageTool and Apertium primarily as design/development references unless a later task explicitly approves their heavier architecture/licence implications.

The app should remain offline-first. Avoid introducing cloud dependencies or LLM grading unless a future product decision explicitly changes that policy.

When assessment is uncertain, prefer a model answer and coaching over falsely rejecting valid Spanish.


## Learner dictionary and navigation contract

The implemented first-party [learner dictionary](../LEARNER_DICTIONARY.md) is separate from the writing checker. Read that document before changing vocabulary data, phrase recognition or Saved Words. Rebuild from curated definitions and explicit original bilingual course glossaries; never invent token translations from a whole-sentence pair or silently add licensed dictionary data. Dictionary uncertainty must remain visible.

Preserve the five tabs **Home / Learn / Games / Review / Profile**, including Review access and exact order. Saved Words belongs inside Profile; contextual popups stay inside the existing learning flow. Feature references are not navigation redesign instructions. Visible Spanish, including conservative mixed-language fragments and Spanish answer-option text, is explorable before answering. Tap a word for vocabulary help; tap the sibling radio/card/padding to select. Never nest token buttons inside an answer button, inspect hidden correctness metadata or reveal a hidden transcript/model.

Dictionary interactions are not hints, answers, review evidence or progress events. Storage stays v2 with optional validated `savedWords` and true-only `dictionaryTipSeen`; historical snapshots and stable IDs remain authoritative. Visible `teachingModel` and Spanish-fragment metadata must survive validated snapshots without replacing old content on resume.

The first three A1.1 Unit 0 teaching activities deliberately ramp recognition → supported completion → easy recall → contextual use → transfer. Meaning comes before grammar labels at the start. Later A1 checkpoints/learning objectives remain intact. Recycle familiar anchor language when communicatively natural; [the recurrence audit](../release/a1-anchor-recurrence.json) flags exposure gaps for review, not mandatory counts or mastery. Responsive Samsung profiles exercise CSS viewport/inset/keyboard/text variations, not model-specific resolution hacks.

Typed-input tolerance for vowel accents/ü/punctuation is unchanged; authored Spanish stays canonical and ñ is distinct. See the [explicit Spanish QA manifest](../release/dictionary-content-corrections.json): requested carrier/instruction/native-alternative fixes are whitelisted against immutable historical fixtures, rather than weakening preservation tests.

## v1.3 authoring / product contracts

A textbox means genuine expression. For a finite target prefer reusable cloze, word/phrase banks, sentence building or contextual choices. A1.1–A2.1 new course attempts have no graded open text; A2.2 bridges into guided writing and B1/B2 retain genuine guided/free response. Current generators are adapted through `assessment-policy.js`; do not apply that adapter to historical snapshots. Original answer targets and permanent IDs remain protected by the v1.3 main contract.

Home hierarchy is Continue Learning / Today / Needs Attention / Practice. Profile groups summary, level/streak, capabilities, Content for Your Level, Saved Words, progress and lower-priority settings/data. Teal/mint is primary; warm attention and gold accents complement soft surfaces. Do not change the five tabs. Recommendations are editorial, local and externally opened; no media licences are implied by linking to a resource. The current v1.3 assessment audit supersedes historical interaction counts in older reports.

## v1.4 quality implementation

Use the central 44-concept syllabus and `learning-quality.js` / `quality-view.js` for reference, short refreshers, support selection and shared practice routing. Keep content eligibility and assistance separate. Do not infer mastery from selected level, repeated same-session success or self-assessed imitation. Spanish support, English support and optional uncertainty have different evidence weights without changing objective scores. Dictionary lookup is not assistance for grading/mastery. Preserve schema-v2 snapshot safety and the permanent curated table identities.

Run `npm run audit:learning` and `npm run audit:recommendations` with the existing release gate. The latter is offline metadata QA; `--network` is optional developer diagnostics, never app startup. Current first-party verification, partial access caveats and replacements are recorded in [the 1.4 recommendation review](../release/V1_4_RECOMMENDATIONS.md). All new explanations are original; no external exercise/audio corpus has been incorporated. Human educator/native-speaker and real learner validation remain separate from automated checks.
