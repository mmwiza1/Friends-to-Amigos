# A2.1 and connected practice — implementation record

Baseline reviewed: main `877dbcd9b0486b33b5e5c0e7aa218baa23c7e269` (0.6.0).
The original 144 A1 activities, all Spanish targets, accepted answers, stories, permanent question IDs and ordering are protected by full activity hashes and existing identity fixtures. A2.1 is appended; A2.2 and every B stage remain planned.

## A2.1 scope

| Unit | Practical outcome | New/supporting language |
| --- | --- | --- |
| This week so far | Share a recent experience | Haber + participle, -ado/-ido, hecho; open recent periods |
| Last weekend | Explain a finished outing | Regular -AR completed-event endings; fui/fuimos and hice/hizo; ayer vs hoy/esta semana |
| Choosing the journey | Compare transport and buy a ticket | Más/menos… que, tan… como, departure/duration, ida y vuelta |
| Booking a place to stay | Confirm room, guests, dates and services | Reservar, por noche, para + guests/dates, estar incluido |
| Arriving and solving a problem | Check in and get a simple repair | Llegué/llegó, a nombre de, no funciona, help/repetition requests |
| How you feel | Explain basic symptoms and a continuing need | Me duele/duelen, tener fiebre/sed, desde, necesitar + infinitive |
| Asking for health help | Find a pharmacy and request an appointment | Tener que, repair/confirmation chunks, recent necesitado |
| A useful travel message | Link experience, reason and next intention | Vuelto, tomé, sequencing, porque/por eso, ir a consolidation |

There are 72 activities / 416 question slots: 24 teaching activities, 32 stories, eight writing activities and eight nine-question checkpoints. Each unit has two teaching listens plus one checkpoint listen and one self-assessed spoken chunk. There are 120 Spanish-production slots. Five-question writing activities are constrained by supplied information; their finite models do not grade arbitrary paragraphs. Checkpoints require four distinct Spanish responses and keep the 80% threshold.

The cast continues with Ana, Luis, Marta and Diego. Stories contain three choices and two bilingual short responses, with supporting glossaries, transparent facts and light inference/context/sequence. Rereading survives reviews and saved attempts. Surface-token lengths average 63.4 words (57–70), versus A1.2's 48.4. This is a pacing description, not a level measurement. Perfect and selected preterite forms are introduced in separate early units; background/imperfect contrast is deliberately left for A2.2. Other recognised past forms in a story receive glosses and do not become independent production targets.

Health dialogues teach communication and checking an instruction. The sample instruction is a comprehension task, not medication advice or a dosage recommendation. No product or diagnosis is prescribed.

## Conjugation Blanks

The original 208 A1 sentence questions are preserved; 64 original A2.1 situations now extend Conjugations to the selected grammar ceiling. Blanks is a separate six-person table activity: yo, tú, él/ella/usted, nosotros/as, vosotros/as, ellos/ellas/ustedes.

A curated local dataset contains **35 verb/tense targets: 10 A1.1, 14 A1.2, 11 A2.1**. Every target names a course source activity, stage/unit, six correct forms, accepted forms, pattern and teaching notes. Selected grammar level controls access to current and earlier targets, even with zero course completions. Course sources are provenance and recommendation signals. Game scores never change the course path or selected ceiling. Full paradigms extend familiar present-tense patterns through an explicit guide: encountering a verb alone is not treated as mastery. Gustar, hay and doler stay contextual rather than misleading six-person tables.

Each unit has a curated set of relevant verbs plus eligible earlier retrieval. Comparison, prices and symptoms deliberately recycle prior patterns rather than add five arbitrary new paradigms to meet a quota. The catalogue is intentionally smaller than a generic conjugation textbook. Recommended and unit prioritisation weight useful course material without hard gating. Current level filters target stage; All up to current level includes all available targets. Custom filters select a level and present/reflexive/perfect/selected-preterite grammar within the ceiling.

Normal games contain exactly three tables. Four successful phases per current course unit use 2, 3, 4 and 5 missing cells; the later phases require typed retrieval. Blank positions/options rotate, recent targets are deprioritised and weak forms are weighted. A six-blank table additionally requires each form to have at least three unassisted spaced recalls and a low recent error rate. Practice offers 3/5/10/15/20 tables and either selectable forms or memory recall; 20 is the maximum. Small eligible pools necessarily repeat a target, with different blank positions. Mistake practice focuses on the actual missed verb/tense. There are no lives/lockouts.

Feedback evaluates cells separately, retaining the learner's choice/text, the model and a person/pattern explanation. Another valid form is identified by person; regular endings explain stem + ending, while stem changes, irregular yo forms and irregular participles use curated notes. Written grading reuses the existing case/punctuation/whitespace/vowel-accent tolerance and protects ñ and negation.

## Shared evidence and review

`mastery.js` records concept/outcome, verb, tense, person, pattern and verb-tense-person form keys. These support a future heatmap without another migration. Evidence is transparent, local and approximate, not a proficiency score:

- Unassisted Spanish typed recall weighs more than recognition. Hints and self-assessed speaking weigh less. Difficulty/blank density give modest bounded adjustments.
- Duplicate item evidence in a session is ignored; positive strength grows at most once per concept/session. Spaced recall requires a new calendar day and at least 20 hours. Repeating forms for five minutes cannot create spaced mastery.
- Recent errors raise practice priority. Successful retrieval reduces frequency without removing items forever. Existing fixed review due dates/correction counters are untouched.
- Course form evidence uses conservative positive Spanish predicates; English comprehension, distractors and noun `trabajo`/comparison `como` are not treated as form recall. Broader course topic/outcome evidence still applies. Ambiguous/open production remains outside the model.
- Existing sentence Conjugations records recognition evidence for the same verb/person keys. Table recall/weakness influences eligible practice selection across surfaces. No practice evidence completes a course activity or checkpoint.

Today’s Review selects up to eight due historical mistake snapshots, up to two older completed-course retrieval items (four when there are no due mistakes), and an optional short weak-target follow-up. Advanced provisional-placement questions are not promoted into this daily taught-material session; their old records remain preserved. The existing Today guided lesson session is retained independently.

Weak Areas shows readable “Needs practice”, “Improving” or “Strong across spaced practice” labels and launches eligible table/focused review. Existing learner mistakes remain visible even without new mastery data. Game results say “Strong today”, not permanent mastery. Table results show both tables and forms, assistance and person-level signals.

## Progress and navigation

Schema stays v2. Optional `mastery` and `blanks` namespaces safely default when absent; existing `games` records remain intact. Sanitisation bounds evidence/history, validates known targets, rows, options and answers; valid saved higher-level attempts are retained and paused if the selected ceiling is lower and quarantines damaged local attempts. Unsafe imports reject before replacing valid progress. Exports include the additive data. Saved course questions/passages are never regenerated; the old storage key and v1 migration/backup remain.

Table Back saves to Games; Weak Areas Back returns Review. Table text Go submits only a populated complete table once, or moves to the next missing input. Existing course Go, Back, native insets, keyboard layout, dark theme, launcher and listening speeds remain in place.

A1 completion remains an accurate milestone. Continue now offers A2.1 after the required A1 path, without forcing placement learners backwards or fabricating skipped completions. Finishing A2.1 offers review/listening maintenance, never A2.2. Placement stays an eight-question provisional recognition screen; its recommendation is clamped to a playable starting choice and is not certification or a listening/speaking assessment.

## Authorship and limits

All new texts, dialogues, questions, forms and explanations are original Friends to Amigos material informed by the documented CEFR/Cervantes/OER references. No third-party exercise or recording was copied/adapted and no dataset was downloaded. There are no new runtime dependencies, services or accounts.

Listening remains synthetic es-ES; speaking is self-assessed without recording or pronunciation scoring. Finite accepted-answer lists can reject natural unlisted paraphrases. The evidence model cannot diagnose arbitrary grammar or prove communicative mastery. Health/travel register, alternatives, A2 pacing and table-to-course scaffolding need a Spanish educator/native-speaker review. Actual S24/TalkBack/IME/audio and backup-upgrade checks remain physical release gates. A2.2 should wait for that review and learner evidence; green builds alone are insufficient.

The 0.9.0 amendment adds Spanish-first A1.2/A2.1 tasks with optional English support and level-based grammar access. See [the shipped policy and validation report](SPANISH_FIRST_AND_GRAMMAR_LEVEL.md).
