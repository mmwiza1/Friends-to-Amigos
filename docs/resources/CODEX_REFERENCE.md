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
