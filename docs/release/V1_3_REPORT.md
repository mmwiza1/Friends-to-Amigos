# Friends to Amigos 1.3.0 learner-experience release

Baseline: main `3af8d73b0a25c40bc8802122c4ad068ba0ebf6c8`, version 1.2.0 / Android code 13. Candidate: 1.3.0 / code 14. Storage remains schema v2 under the same discovery key. This is an interaction/UX release; it adds no course stage, changes no unit/activity ordering and retains all canonical course targets and stories.

## Assessment progression

A textbox means expression. A finite target uses a controlled interaction.

- A1.1: visible models, recognition, supported gaps and word-bank sentence building. No new graded open textboxes. The first five questions remain confidence-building; later construction, reading, listening and self-assessed speaking retain the practical targets.
- A1.2: sentence/phrase construction, contextual cloze and dialogue response rather than deterministic recall/transfer typing.
- A2.1: more connected cloze, two/three gaps, phrase construction and contextual controlled responses.
- A2.2: structured work alongside 23 guided-writing slots. The first guided task invites the learner's own places; models are examples, not the only valid response.
- B1/B2: each stage retains 80 guided/free writing slots; narrow reproduction becomes structured. The existing conservative writing engine still coaches uncertain alternatives and never claims automatic essay/pronunciation certification.

`www/assessment-policy.js` adapts the current authored catalogue after its existing generators run. `www/structured.js` implements reusable word/phrase tiles and contextual multi-gap data, validation, construction, answer checking and accessible rendering. Original Spanish models, goals, explanations, passages, permanent IDs and order are retained. Phrase chunks follow clause/connective/punctuation boundaries, with bounded prepositional splitting for long clauses. Duplicate tiles have distinct snapshot positions. The full supplied bank must be assembled; removal/reset is available. Narrow safe temporal-adjunct alternates are accepted for short single clauses; negation and ñ remain protected.

Single-word thanks are contextual reply choices, not builders that disclose their sole answer. Cloze distractors prefer the same verb/person or lexical family, filtered to canonical forms present in the current/earlier curriculum; the original taught gap form is prioritised. Per-gap feedback identifies wrong-person forms where reliable. Factual comprehension uses controlled responses with reviewed person/time/place/number distractor families and existing authored responses. Time-of-day/day/clock-time requests are made more precise; obsolete typed-format instructions are removed. The café example explicitly asks for the time of day. No story is regenerated.

The [assessment audit](v13-assessment-audit.json) records per-stage counts and every adaptation's before/after hash. [The main contract](v13-main-contract.json) was captured from the exact pre-change main source; the audit verifies original payloads before adaptation, all stable ordering/targets, every structured model and recommendation quotas. The existing 15-anchor A1 exposure audit still runs; remaining literal gaps are author-review prompts, not mastery claims. Models and natural recycling from v1.2 are retained.

## Snapshot safety

Historical v1/v2 text questions still render, check, resume and review using their saved payloads. No source-bank replacement occurs during import/load. New snapshots persist bounded `tiles`, `tileKind`, optional phrase `solution`, or `cloze` segments/blanks/options with the existing question ID. Partial/checked selections are validated; damaged imports cannot overwrite valid state. The storage version/key and learner progress fields do not change.

A new structured success cannot clear an older typed review. Structured scheduled-success credit also requires equivalent scaffolding: shuffled tile banks are equivalent; a different gap target or easier phrase bank is not. Id-less fallback signatures include the structural contract. Legacy raw focused-media content stays stable; only newly built finite-answer listening sessions are adapted to controlled responses. Old focused text snapshots remain usable. Review intervals, correction counters and completion deduplication are unchanged.

The original test cases remain explicit v1.2 compatibility coverage using `tests/helpers/v12-course.cjs` / `v12-app.cjs` against the new runtime; historical fixture files remain unchanged. Live v1.3 tests separately validate every interaction and complete every current activity. New-model tests never use the compatibility helper. Deliberately renamed completion actions are asserted under their new labels.

## Lesson flow and UI

Passed course results preview the actual next required activity and offer Continue directly into it, including stories, checkpoints, next units and stages. Finish for now returns Home. Required path/start-stage, completed IDs and Today remain authoritative. Failed lessons offer retry/mistake practice instead of forward progression; final paths route to existing review/maintenance.

Home groups Continue Learning, Today, Needs Attention and Practice in that order. Continue is visually primary; Today groups streak, due review and minutes. Milestones report actual personal completions, assumed foundations and earned capabilities. Profile groups summary, level/streak, capabilities, Content for Your Level, Saved Words, progress, and lower-priority placement/data/reset. Existing period stats, all eight measures, the seven-day chart and achievements remain reachable; period filters keep their panel open. Needs Attention also surfaces shared game/table/media weaknesses. The five tabs remain Home / Learn / Games / Review / Profile.

Light mode uses warm off-white and pale blue-grey surfaces. Dark mode uses warm navy/charcoal and softer cards. Teal/mint is primary, terracotta indicates attention, gold supports streaks/milestones and red stays for errors/destructive controls. Native backgrounds follow the same light/dark surfaces. Existing bull/launcher assets are unchanged.

Visible Spanish stays dictionary-enabled before answering, including tile-bank words and cloze text/options. Add/Choose/Remove buttons are siblings of vocabulary controls. Lookup cannot add a tile, fill a blank, mark a hint, score, record evidence or advance. Existing phrase lookup, Hear, More, Saved Words and discovery preference are retained.

## Content for Your Level

`www/recommendations.js` is an offline curated catalogue: 30 editorial entries / 29 unique external URLs, with 15 visible entries per stage (three per category). Beginner A1.1–A2.2 and intermediate B1.1–B2.2 ranges allow deliberate reuse. Comfortable/Stretch is relative editorial advice, not an official CEFR label. Profile/current path determines the displayed stage; completing the full path retains B2.2 recommendations.

Each card explains why to try it, access/audio/subtitle/variety limits and opens in an external browser. No media is embedded/downloaded and no new Android permission is requested. HTTPS provider allowlists exist in JavaScript and native policy; external pages never load inside the privileged app WebView. See [source verification](V1_3_RECOMMENDATIONS.md).

## Quantified interaction change

| Stage | Previous text slots | Current text slots | Sentence/phrase builders | Contextual cloze |
| --- | ---: | ---: | ---: | ---: |
| A1.1 | 193 | 0 | 108 | 5 |
| A1.2 | 193 | 0 | 95 | 25 |
| A2.1 | 192 | 0 | 95 | 25 |
| A2.2 | 192 | 23 | 72 | 25 |
| B1.1 | 192 | 80 | 27 | 13 |
| B1.2 | 192 | 80 | 29 | 11 |
| B2.1 | 192 | 80 | 25 | 15 |
| B2.2 | 192 | 80 | 26 | 14 |

A total of 1,195 course text-slot representations are replaced: 585 become controlled comprehension/reply choices; 610 become construction/cloze. This includes 18 early guided-labelled tasks whose finite models benefit from structured use; 1,177 were strictly finite tasks. Another 11 Numbers/Time tasks use sentence building, and 133 finite listening tasks become controlled choices only when new focused sessions are generated. The catalogue itself keeps its permanent IDs and old snapshot semantics. Across course and special practice there are 488 tile banks and 133 cloze tasks; 343 genuine writing slots remain (23 A2.2 plus 80 in each B stage).

The opening IDs remain `u0l0`, `u0l1`, `u0l2`, with their intervening stories in the same course order. The first teaching activity retains its five meaning-first model/recognition/completion items. The second replaces its first finite typed recall with a word bank; the third uses contextual construction and supported role transfer. Independent expression begins in the A2.2 bridge rather than an exact-string A1 textbox. Later Unit 0 construction/transfer, all original checkpoints and final targets remain. The café time-of-day prompt is clarified without changing its accepted underlying meaning. No original story, objective or Spanish model is rewritten.

The recurrence audit covers 15 anchors over 16 A1 units. Its eight literal-form gaps remain visible in the retained report for educator judgement; visible banks/cloze additionally re-expose the same canonical language. No artificial repeated sentence is inserted merely to raise a count.

## File and test architecture

Added product modules: `www/structured.js`, `www/assessment-policy.js`, `www/recommendations.js`. The existing controller, quiz view, screens, engine, storage, focused-session construction and retrieval modules integrate them without a framework/dependency or backend. Source generators stay unchanged behind the adapter; future authored content should preferably declare its structured target directly.

Added validation: `tests/structured-release.test.cjs`, `tests/product-v13.test.cjs`, explicit `tests/helpers/v12-course.cjs` / `v12-app.cjs`, `scripts/learner-release-audit.cjs`, the captured main contract and current audit. Existing compatibility cases use original question data against the new runtime; the live suites separately exercise current questions, completion, malformed imports, structured feedback, responsive interaction and recommendation safety. Android native policy gains an external-browser allowlist regression test.

## Validation and screenshots

The complete code gate passed in [run 40257313103](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40257313103): 1,505 JavaScript cases (0 failed/skipped), 28,556 rendered assertions across all 15 layouts, and successful Android assemble/lint/unit tasks. Native XML reports 14 tests passed with no failures/errors/skips, and lint 0 errors / 12 warnings. Local syntax, course/recycling audits and 30 file-isolated suites passed independently. [BUILD_STATUS.md](../../BUILD_STATUS.md) records exact evidence and limits. The README showcase adds one asset-integrity test; the combined JavaScript run now reports 1,506 passes (0 failures/skips), with all 838 original cases retained. Local Node 24 passes 31 file-isolated suites. The validation branch repeats the complete gate before main promotion.

Fifteen unmodified final-UI screenshots are in `docs/screenshots/`, with source run, capture profile, image hashes and all 67 runtime-asset hashes in the manifest. README uses a compact three-column grid. The APK contains exactly those validated 67 assets. Developer inspection covered opening lessons/story, A1.2 construction, A2.1 cloze, A2.2/B writing, Home/Profile, recommendations, completion, dictionary, Saved Words, games and Review, including light/dark, large text, landscape/cutouts and simulated keyboard. No original launcher/mascot resource is altered.

No physical-device, emulator, acoustic TTS or native-speaker review has occurred during this release. Samsung S22/S24/S25 profiles simulate viewport/inset/IME/text conditions, not device hardware. The release retains offline synthetic es-ES speech, self-assessed speaking, optional input vowel accents/opening punctuation, distinct ñ, and Spain-first language. No cloud grader, ASR, microphone, account, backend or runtime dependency is added.
