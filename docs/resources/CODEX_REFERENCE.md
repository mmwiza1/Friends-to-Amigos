# Codex resource reference

Last reviewed: 2026-10-07

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
