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

The final release gate passed: **754 JavaScript cases**, **14,531 browser assertions / 11 layouts**, **11 Android unit tests**, debug assembly and lint (**0 errors / 12 existing warnings**). Local `npm run check` and `npm run audit` passed. The five added feature suites contain **105 new cases**. Exact results, runner differences, the validated source SHA and workflow link are recorded in [BUILD_STATUS.md](../../BUILD_STATUS.md). The downloaded APK was checked to contain the exact offline dictionary assets.

Rendered validation initially caught the page’s English language ancestor incorrectly suppressing Spanish word decoration. The fix respects the nearest explicit language, retains inner English glosses, and leaves undeclared-language story titles untouched; dedicated regressions protect this boundary. The browser fixture also needed to initialise optional game/table fields after its fresh-profile dictionary journey before taking pre-existing screenshots. The landscape fixture scrolls the Saved Words More control into the usable viewport before its synthetic click, as a real tap would require. No product assertion was removed. The complete gate was rerun after both fixes.

Representative manual lookup review covered Tengo hambre; Tengo que trabajar; Me gustan los libros; Voy a ir al cine; Quedamos a las seis; Me duele la garganta; He hecho la compra; Ayer fui al parque; ¿Habéis comido?, together with A1.1/A1.2/A2.1 stories, writing models and Conjugations contexts. This is developer inspection, not native-speaker validation.

Intentionally unchanged: choice-button interactions, hidden listening transcripts/unrevealed speaking models, learner-written response analysis, original navigation, broad curriculum content, game/table mechanics and the existing conservative writing grader. The dictionary is a bounded vocabulary explorer, not an academic dictionary, general translation system or grammar grader. Human device/acoustic/Spanish-educator checks remain necessary before wider release.

## File inventory

48 tracked files in this release (17 added, 31 modified).

### Added

- `docs/LEARNER_DICTIONARY.md`
- `docs/release/DICTIONARY_REPORT.md`
- `docs/release/dictionary-content-corrections.json`
- `docs/release/dictionary-coverage.json`
- `scripts/content/audit-learner-dictionary.cjs`
- `scripts/content/build-learner-dictionary.cjs`
- `scripts/content/learner-dictionary-source.cjs`
- `tests/dictionary-app.test.cjs`
- `tests/dictionary-storage.test.cjs`
- `tests/dictionary-ui.test.cjs`
- `tests/dictionary.test.cjs`
- `tests/helpers/content-corrections.cjs`
- `tests/spanish-polish.test.cjs`
- `www/dictionary-ui.js`
- `www/dictionary.css`
- `www/learner-dictionary-data.js`
- `www/learner-dictionary.js`

### Modified

- `BUILD_STATUS.md`
- `COURSE_DESIGN.md`
- `README.md`
- `android/app/build.gradle`
- `docs/resources/CODEX_REFERENCE.md`
- `docs/resources/README.md`
- `docs/resources/WRITING_ENGINE.md`
- `package.json`
- `scripts/browser-check.cjs`
- `scripts/check-course.cjs`
- `tests/a22.test.cjs`
- `tests/b-course.test.cjs`
- `tests/expansion.test.cjs`
- `tests/focused-practice.test.cjs`
- `tests/mobile.test.cjs`
- `tests/spanish-level.test.cjs`
- `www/a12.js`
- `www/a21-data.js`
- `www/a21.js`
- `www/a22-data.js`
- `www/app.js`
- `www/conjugations-bank.js`
- `www/course-language-data.js`
- `www/curriculum.js`
- `www/engine.js`
- `www/games-view.js`
- `www/index.html`
- `www/practice-view.js`
- `www/quiz-view.js`
- `www/screens.js`
- `www/storage.js`

