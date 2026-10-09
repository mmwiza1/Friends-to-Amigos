# 1.1.0 dictionary and Spanish QA quality report

Baseline: main `baa70640135207a1a44f20cdfef355348d3c6028`, version 1.0.0/code 11. Release: 1.1.0/code 12. Storage remains v2.

## Implemented

- Reusable offline first-party dictionary with 936 word entries, 276 phrases/chunks and 1,564 known form mappings.
- Contextual expression priority, known conjugation/lemma metadata, conservative ambiguity/unknown handling and existing es-ES pronunciation.
- Small accessible popup, More, save/deduplication and clear persistence/capacity feedback; Android keyboard/inset-safe positioning and dismiss/resume behaviour.
- Profile Saved Words with count, Spanish/English search, All/Words/Phrases/Recently saved, audio, More and removal. Existing five-tab navigation and Review remain exactly in place.
- Optional validated minimal savedWords state, v1/v2 defaults and preserved historical attempts, SRS, hints, score, games, Today and conservative writing assessment.

No network dictionary or third-party lexical/audio corpus was imported. Original glossary/phrase pairs are reused intact; no individual translations are inferred from aligned sentences. Unknown vocabulary is deliberately shown as unavailable. Exposure coverage is documented in [dictionary-coverage.json](dictionary-coverage.json); it is not a claim of exhaustive translation accuracy or mastery. B-stage coverage remains partial.

## Selective Spanish changes

The exact [before/after manifest](dictionary-content-corrections.json) records **six A1 game carriers**, **18 compiled question payloads across 13 activities**, and **three unit notes**, plus the UI table note. All 208 A1 game carriers were inspected; merely stylistic alternatives were left unchanged.

- Natural café requests, contextual money possession, meaningful contrast and venir's destination context retain the original verb targets/options/difficulty.
- A2.1's instruction unambiguously addresses several friends; ¿Habéis comido? stays the response.
- Natural M/S and clothing-shop alternatives preserve the requested size/fit and verb targets.
- Coger is preferred in suitable Spain transport-plan models; every old tomar alternative remains accepted. The regular Tomé targets and table/game conjugations are preserved.
- Touched explanations now refer to the displayed language. Vosotros/as is accurately qualified as usual informal plural in most of Spain, with helpful Latin-American notes retained.

No stories, stage structures, activity order or learning objectives were rewritten. Canonical Spanish retains accents/punctuation; learner typed-input tolerance and distinct ñ remain. Historical snapshots keep their original wording rather than being silently changed on resume/review.

## Verification and limits

The final release gate uses full syntax/course/ID checks, npm tests, audit, rendered browser/mobile journeys and Android assemble/lint/unit validation. Exact final results and links are recorded in [BUILD_STATUS.md](../../BUILD_STATUS.md).

Representative manual lookup review covered Tengo hambre; Tengo que trabajar; Me gustan los libros; Voy a ir al cine; Quedamos a las seis; Me duele la garganta; He hecho la compra; Ayer fui al parque; ¿Habéis comido?, together with A1.1/A1.2/A2.1 stories, writing models and Conjugations contexts. This is developer inspection, not native-speaker validation.

Intentionally unchanged: choice-button interactions, hidden listening transcripts/unrevealed speaking models, learner-written response analysis, original navigation, broad curriculum content, game/table mechanics and the existing conservative writing grader. The dictionary is a bounded vocabulary explorer, not an academic dictionary, general translation system or grammar grader. Human device/acoustic/Spanish-educator checks remain necessary before wider release.
