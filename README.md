# Friends to Amigos

An offline-first Android Spanish-learning app in a vanilla HTML/CSS/JavaScript WebView. European Spanish is the primary variety, including vosotros/as. No account, backend, runtime API, cloud grader or runtime npm dependency is required.

## Full course for user testing

**A1.1, A1.2, A2.1, A2.2, B1.1, B1.2, B2.1 and B2.2 are playable.** The course contains **576 activities, 3,328 question slots, 64 practical units and 256 original stories**. No C1/C2 stage is offered. This is a course milestone, not formal CEFR certification or independent proof of proficiency.

| Stage | Activities | Slots | Stories | Focused Listening / Speaking | Conjugations | Table targets |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| A1.1 | 72 | 416 | 32 | 56 / 56 | 104 | 10 |
| A1.2 | 72 | 416 | 32 | 56 / 56 | 104 | 14 |
| A2.1 | 72 | 416 | 32 | 56 / 56 | 64 | 11 |
| A2.2 | 72 | 416 | 32 | 56 / 56 | 64 | 20 |
| B1.1 | 72 | 416 | 32 | 56 / 56 | 64 | 8 |
| B1.2 | 72 | 416 | 32 | 56 / 56 | 64 | 7 |
| B2.1 | 72 | 416 | 32 | 56 / 56 | 64 | 6 |
| B2.2 | 72 | 416 | 32 | 56 / 56 | 64 | 6 |

Each stage has eight units, three core lessons, four stories, a writing activity and a checkpoint per unit. Recognition → controlled completion → recall → contextual response → transfer remains the learning progression. All activity/question IDs, ordering, learning objectives and historical snapshots remain stable. The 1.1.0 dictionary release makes only the explicitly documented Spanish QA edits and adds accepted clothing/transport alternatives; every earlier accepted response remains valid. See the [correction manifest](docs/release/dictionary-content-corrections.json).

B1 introduces connected narratives, practical advice, changes, viewpoints and limited wishes/necessity. B2 develops chronology, cause versus evidence, qualification, register, reported information, imagined conditions and integrated proposals. New material is original Friends to Amigos content; pedagogical references inform design without copied exercises.

## Writing that can admit uncertainty

- **Controlled**: narrow authored retrieval and named details use exact accepted variants. Case, punctuation, spacing, vowel accents and ü are tolerant; ñ and negation remain meaningful. No substring grading.
- **Guided**: accepted formulations can be verified. Other natural formulations survive as uncertain/model comparison, rather than automatic incorrect answers. Task-coverage evidence is not proof of grammar.
- **Free**: independent connected responses receive conservative coaching, model comparison and reflection. Even an exact model match is not automatically essay-graded.

Twenty-three first-party, level/unit-aware rules explain taught errors. The curated verb adapter can diagnose wrong-person or explicitly requested wrong-tense forms, including Spain vosotros. Near-model spelling comparison is a limited diagnostic, not a dictionary or general grammar checker. Authored accepted variants and misconception feedback take precedence.

Open writing uses multiline fields (up to 6,000 characters), model pronunciation, **Why?**, revision before reflection, and “I compared / revised” or “Needs practice”. Enter creates a newline; short controlled inputs retain keyboard Go submission. Revising after seeing a model counts as assisted. Unverified reflections never count as verified accuracy or clear a scheduled review. A positive reflection may defer a due open item by one day without increasing verified successes. Negative evidence saves the response/model/context for later practice. The checkpoint threshold remains **80% of objective items**; all required reflections must still be completed. Completion is not certification of open-writing grammar.

See [writing resources and implementation decisions](docs/resources/WRITING_ENGINE.md), the [160-item A1–A2 writing audit](docs/release/a1-a2-writing-audit.json), and [release quality report](docs/release/V1_REPORT.md).

## Listening, speaking and daily retrieval

Focused Listening and Speaking each contain **448 items**, 56 per stage. Normal sessions select ten unique items, avoid a bounded recent 30-item history, target weaknesses and balance topics. Where sufficient material exists, six current-stage items recycle two from the preceding stage and one each from two earlier stages; at early stages the smaller previous-stage set receives the remainder. Insufficient inventories fill from eligible earlier material, never future material.

Focused media require taught core lessons. B narrative clips and retelling prompts additionally require their source story, so learners are not asked to recall an unknown scenario. Accepted placement assumes earlier foundations; current-stage material still requires teaching. Historical saved question/passage snapshots remain authoritative on resume.

Listening is audio-first: answers stay locked until actual recording/TTS start; failed recordings can fall back to TTS; failure offers skip-to-review. Transcripts appear after attempt/skip. Slow 0.75× and Normal 1× replay remain. Speech uses **synthetic Spanish (Spain)** and an installed local offline voice. No human-speaker datasets are bundled, and bridge tests do not validate acoustic quality.

Speaking is **self-assessed**. Say the response, reveal one possible model, optionally hear it, choose “I got it” / “Needs practice”. The app does not request a microphone, record, transcribe or assess pronunciation. Weak items/concepts return later, and same-session repetition cannot manufacture spaced mastery. First-use explanations become compact after successful use; accessible information remains available.

Today resumes unfinished work first, then guides due review, the next required lesson and short media retrieval. Today’s Review combines due SRS mistakes and eligible weak/older practice. Weak Areas translates evidence into useful labels and launches eligible targeted practice. Normal passed lessons offer Continue learning; failed lessons offer retry/mistake review without skipping ahead.

## Games and grammar levels

Games contains **Conjugations** (592 original sentence contexts, ten-question rounds) and **Conjugation Tables / Blanks** (82 curated verb/tense targets, normal three-table rounds). The established independent grammar-level selector controls the practice ceiling; source activities document where material is taught. Course progress and weaknesses recommend content, while game success never completes lessons, checkpoints, stages or placement.

Conjugations balances concepts/persons/verbs, shuffles questions/options, avoids recent items and weights weak evidence. Mistake and Challenge modes use only the selected grammar ceiling. Feedback evaluates each blank separately and teaches distractor-specific person/tense patterns. Homographic nouns/connectors are excluded from new B-bank matching, and ambiguous shared forms do not generate artificial person mastery.

Tables retain six Spain-first rows, varied blank positions, hints, typed recall, mastery-gated full blank tables and mistake practice. Practice supports 3/5/10/15/20 tables, Recommended/Current level/All up to current level and simple custom grammar filters. Curated targets avoid misleading constructions such as a generic doler/gustar paradigm. Taught B targets add future, conditional, subjunctive and compound forms; -ra and -se past-subjunctive alternatives retain the nosotros accent.

## Explore Spanish and save vocabulary

Tap visible Spanish in stories, glossaries, Spanish prompts, revealed models/transcripts, feedback or Conjugations sentences to open a compact contextual dictionary. Known expressions take priority; common verb forms link to their infinitive/person/tense. Ambiguous and unknown forms are handled conservatively. Hear uses the existing es-ES TTS; More offers a few useful senses/examples. Lookup and saving do not count as hints or affect course scores, review, mastery or progress.

The offline bank contains **936 word entries, 276 expressions and 1,564 known form mappings**, compiled from original course glossaries/phrase banks and curated first-party definitions. No commercial dictionary service or third-party corpus is used. **Saved Words is inside Profile**, with count, search, All/Words/Phrases/Recently saved, pronunciation, More and Remove. Word forms deduplicate to the base; useful constructions save as phrases. See [dictionary architecture and coverage limits](docs/LEARNER_DICTIONARY.md).

## Mobile and learner data

Home / Learn / Games / Review / Profile remain. Android Back saves lessons and returns secondary modes to their parent; main tabs return Home; Home backgrounds normally. Native WindowInsets are the sole safe-area source. Fixed navigation, final controls, status-bar spacing, cutouts, keyboard overlap and toasts retain the S24 protections. Input focus hides app navigation while the keyboard is open. Choice cards remain clear accessible radios. Light and system dark themes, the coral/teal identity and bull-face launcher assets are preserved.

Storage remains **schema v2** under `friends-to-amigos-v1`. The optional `savedWords` list defaults safely for old saves, deduplicates and exports/imports without changing historical attempts or review records. V1 migration, recovery/read-only protection, malformed import rejection and untouched historical snapshots remain. Optional question `writing`/`previousResponse` and active `writingResponses` fields default safely; no completion history is fabricated. Pending comparison, revised response and reflection resume/export/import. A later starting path assumes foundations without awarding skipped completions; actual completion statistics remain accurate.

## Development and release validation

```sh
npm run check
npm test
npm run check:browser
node scripts/release-audit.cjs
```

```sh
gradle -p android assembleDebug lintDebug testDebugUnitTest
```

No new dependencies are needed. The established GitHub Actions workflow runs static, JS, rendered browser and Android build/lint/unit checks and uploads `friends-to-amigos-android` and reports. See [BUILD_STATUS.md](BUILD_STATUS.md) for exact performed results and limits, and the [user-testing checklist](docs/release/USER_TESTING.md) before wider distribution.

Preserve signing keys for in-place upgrades. A fresh CI debug key may differ from an installed APK: verify an exported backup before any uninstall. Local Chromium file navigation is blocked by this execution environment, so rendered browser and native validation use CI. No physical-device, emulator, acoustic TTS or native-speaker validation is claimed for this release.

## Limits and next step

The tiny placement screen is provisional and cannot establish CEFR speaking/writing competence. Finite controlled/comprehension matching can reject unlisted valid paraphrases; open writing deliberately admits uncertainty. The curated morphology/rules do not implement arbitrary Spanish parsing, general spellchecking or authoritative essay grading. The learner dictionary is a separate bounded vocabulary explorer. Listening lacks human-speaker variation; speaking is self-assessed. All eight stages should now undergo real learner and Spanish educator review, especially B-level pacing, naturalness, task ambiguity and false acceptance/rejection. Freeze expansion for user testing rather than begin C1/C2.
