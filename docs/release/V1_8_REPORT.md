# v1.8 consolidation implementation report

Starting main: `7504f49d740d13fbfd60237e510cf6716f534923`. App 1.8.0 / Android versionCode 19. No new stage, major Practice activity, backend, recruitment programme or KPI/OKR framework.

## A1.1 / Practice

All 72 A1.1 activities / 416 slots are covered by the [structural audit](v18-a1-audit.json), including 32 stories and eight checkpoints. A1.1 retains 116 structured tasks, zero deterministic open textboxes and unchanged checkpoint targets/threshold. Twenty-six authored bilingual models across `u1l0`–`u7l0` make each unit’s first recognition/completion/construction steps explicit, including five fourth-question vocabulary checks. Visible models count as assisted evidence and are hidden during Review/Practice retrieval. Unit 0’s established ramp remains. Later context, transfer, media and checkpoints retain normal demands. Six stale glossary entries were replaced after inspecting all flagged A1 passages; article/ellipsis variants are recognised by linting rather than falsely called missing.

Practice keeps its recommendation first. Early A1.1 gets familiar construction/listening choices (Numbers only once its source is reached), with the full eleven-activity catalogue under a disclosure. Established learners retain the complete catalogue. Real weak signals include their recorded error count and a focus key. Home deep-links its evidenced area. Recommendation-driven grammar uses reached source questions; selecting an advanced manual grammar level cannot widen that default. Inactivity recommends a skill but is not labelled a weakness. No recommendation awards course progress or fabricates verified speaking accuracy.

## Local diagnostics

Separate bounded storage, schema 1, up to 500 events / 30 days; Profile data controls export/pause/reset. Exact event allowlist and privacy contract: [BETA_DIAGNOSTICS.md](../BETA_DIAGNOSTICS.md). All writes are whitelist-sanitized; learner names, answers/free writing, searches, audio, arbitrary strings/device identifiers are excluded. Importing progress cannot adopt diagnostic fields. Storage failure is non-blocking; optional diagnostics are discarded before retrying a quota-blocked progress write. Backwards clock changes cannot subtract learning time. Duration is sampled active time, not exact attention. Reset never changes learning evidence. Android adds a dedicated export filename through the existing document API, with no new permission.

## Surgical Spanish / continuity

- A: the obsolete Toledo source wording is replaced with natural vivías/vives framing; the already stronger live guided prompt continues allowing personal places/model comparison. Canonical model remains “Antes vivía en Toledo. Ahora vivo en Madrid.”
- B: “Después hemos comido en el café de Diego.” retains present perfect.
- C/D: “¿Una película sobre música?” and “pero hoy también prefiero el cine.”
- E: “Luis le preguntó si había venido a pie”; a glossary explains the fixed reported-past chunk. This explicit requested naturalness exception is documented in the story scope audit; no new paradigm is added.
- F: “antes de que empezara la película” in the live focused listening and Conjugations contexts that still use that cinema scenario. The current course Story Edition has a different everyday-neighbour plot, so it was not replaced with an old story.
- G: “responde a las necesidades de todos”. H: explicit “el método” in the qualified-experience model, with matching English support and diagnostic wrong forms.
- I: two additional modal carriers (`a22u2check-q9`, `a22u7l1-q6`) prefer coger, with every previous tomar answer retained and a note explaining both are valid. Existing coger preferences remain. Intentional A2.1 tomar conjugation targets stay tomar; changing the teaching verb would violate identity/objective safety.
- J: no live “hacía … desayuno” model was found; no speculative breakfast rewrite was made.
- Six A1 glossary replacements: más→de nada; juntos→la cuenta; suficiente→libreta; viene→entra; ¿cuál?→en clase; un cambio→nos vemos. Passages/answers stay unchanged for these glossary fixes.

The surgical overlay amends 79 existing question slots, preserving identities/order. The existing 24 standalone editions, three primary characters and supporting cast remain. Everyday/social/comedy scenarios are preserved alongside strong B2 analysis. Future B additions must consider adult social life; no arbitrary ratio or mass B2 rewrite was imposed. Internal polish is not independent native/educator review.

## Governance / architecture / recommendations

Content review policy distinguishes grammar, naturalness, Spain usage, level, fairness and known-language continuity. `audit:language` checks positive-model corruption, normalised options/answers, exact accepted duplicates, structures, source/stage/prerequisites and curated lemmas. Duplicates are grouped inventories; glossary/Spain-preference issues are review flags, not automatic rewrites or claims of comprehensive grammar checking.

Fourteen existing starter pairs now have a canonical record schema; Practice derives the same bank/IDs. The whole-course registry is a reference view, not duplicated authored data. Remaining JS content stays in place for incremental migration. The live amendment layer is separate from historical compatibility inverses; schema-v2 storage never invokes it. All saves, reviews, active attempts, writing, games, Saved Words and source identities retain their contracts.

All 30 recommendations add provider, lastVerified and verification-source fields while retaining stage range, reason, variety/access and Comfortable/Stretch. Verification dates remain the actual 2026-10-26 review, not a fabricated new live review. Offline audits flag stale verification, missing metadata, invalid ranges, unsupported Steam language claims and unstable YouTube references. Optional network diagnostics distinguish request failure/bot blocking from disappearance; no runtime fetch was added.

## Performed validation / visual acceptance

Validated runtime/showcase commit `dbbb3a3e77a111d8ada1c1a1bc4a8e1770ef90e9`: [complete hosted gate 40546823245](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/40546823245), checks/capture/Android all successful. The documentation-only final commit repeats the complete gate before promotion; the runtime and reviewed UI fingerprint remain unchanged.

- `npm run check` and `check:screenshots`: passed, 576 activities / 3,328 course questions / 3,367 permanent IDs, 592 game questions, 896 focused items, dictionary 1,230 entries / 1,564 form mappings; 15 current showcase images.
- `npm test` (hosted Node 22): **2,189 passed, 0 failed/cancelled/skipped/todo**. All 2,116 previous cases remain, with 73 consolidation cases. Local Node 24 reports the same run as **37 passing file-isolated suites**, no failures/skips; targeted consolidation plus historical compatibility: 83 individual tests passed.
- `npm run audit`, `audit:language`, `audit:recommendations`, `audit:learning`, `audit:stories`, `audit:practice-depth` and `node scripts/learner-release-audit.cjs`: passed. Language: zero blocking errors, ten glossary flags triaged below. Recommendations: zero warnings; actual verification date remains 2026-10-26. Story audit covers 256 stories; learning-load audit covers 360 later-stage activities / 160 stories. Heavy replay retains 4,800 served questions across the three depth activities/eight stages; no new Practice bank was added.
- `npm run check:browser`: **17 layouts / 39,497 assertions, zero failed layouts**; retains all existing profiles and adds beginner disclosure, diagnostics controls and targeted stress images. Public capture: **15 images / 191 assertions**. Visible Home / Learn / Practice / Review / Profile order, dictionary-before-answer, structured controls, keyboard/focus, large text, narrow/landscape and simulated Android insets remain covered.
- `gradle -p android assembleDebug lintDebug testDebugUnitTest`: **BUILD SUCCESSFUL in 22s; 47 tasks executed** in established hosted Android tooling. Downloaded JUnit XML: **15 tests, 0 failures/errors/skips** (launcher 2, native insets 8, native policy 5). Downloaded lint XML: **0 errors/fatal issues / 12 existing warnings**. CI action deprecation warnings are separate from app lint.
- Downloaded debug APK: **all 80 web assets byte-identical to current source**, SHA-256 `cc7ff290fb3058128ea1488c674296545225f508bfca78aa62c10cb45ce8ac7b`. It is ready for physical-device beta checks, not proof those occurred.
- Historical v1/v2 imports, current schema, active attempts, question ordering/payload inverses, Review snapshots, Saved Words, writing/games and accent/ñ contracts passed. No immutable historical fixture was regenerated. Full diff/whitespace checks passed; temporary logs/artifacts remain outside tracked release files.

No physical-device, emulator, TalkBack, acoustic, external beginner study or independent native/educator validation occurred. Manual keyboard/focus actions in Chromium and agent image/content inspection are reported separately; they are not accessibility certification. Core content, diagnostics and recommendations catalogue stay local/offline. No new network dependency, microphone, ASR, LLM, account/backend, participant recruitment or KPI framework was introduced.

## Editorial triage and additional rendered review

The final language audit reports zero blocking errors and ten glossary flags, with 210 repeated-prompt groups and 509 repeated-model groups inventoried rather than rejected (recognition, retrieval and checkpoints intentionally reuse language). The museum phrase `dejar… para otro día` is a discontinuous phrase actually present in the passage; `sin prisa` is a useful related expression for `no tengo prisa`. Eight remaining non-verbatim glossary entries in `a12u1story3`, `a12u2story2`, `a12u3story1`, `a22u0story1`, `a22u3story2`, `b21u3story3`, `b22u5story0`, `b22u7story1` are retained as an explicit follow-up editorial queue, not silently treated as native-approved. They do not change grading; the six A1 onboarding mismatches were fixed in this release.

An additional agent inspection of real Chromium stress images (run 40536864998, with final-source Practice/diagnostics/Toledo rechecked from run 40546823245) covered S22 light/three-button mid-A1 teaching and checkpoint; S24 dark Toledo guided writing, first story and resized-keyboard writing; S25 large-text Practice and diagnostics; narrow Practice/cloze; large-text tiles; landscape dictionary, diagnostics and B2 story; B1 and B2 writing. Text wraps and primary actions remain usable by scrolling; diagnostic controls are deliberately below the learner-facing Profile sections. Short landscape/large-text viewports necessarily show portions of long content. Native-inset stress captures deliberately reserve simulated insets and are not public showcase images. This visual review is agent inspection of browser renders, not physical keyboard/TalkBack, acoustic or independent human language validation. Existing browser assertions separately check reachability and focus/dismissal behavior; the manual accessibility checklist remains outstanding on actual Android devices.

## Recorded GitHub showcase visual review

All fifteen current 1.8.0 / Android 19 images were regenerated by run 40546362976, capture commit `716b2756c4b6d377647ce758f4c963de05c88e8b`. Capture passed 191 semantic/geometry assertions. Every exact PNG was visually reviewed: five images are byte-identical to the individually inspected preceding candidate; all ten changed images were re-inspected from this final-source capture. All approved: meaningful framing, readable text, current visible navigation, no clipping, overflow, fake system bands or navigation overlap. Profile, dictionary and completion retain clean boundaries. The Practice image shows the established full-catalogue state; beginner disclosure is separately covered by browser checks/stress captures. No image was merely relabelled from a prior release. These are 384 CSS px / DPR 1 Chromium app viewports with explicit light/dark themes and recorded heights, not physical Android captures.

<!-- showcase-review: 2f5bb251e7a5cc799a57b3b51b49d17979f20a061bbc2a9f8dcd84060b22b736 -->

| Image | Theme | Viewport | Reviewed PNG SHA-256 |
| --- | --- | --- | --- |
| `home.png` | dark | 384 × 1012 | `c50f945b142514dff7079ae4cd6dda8c6b0c42322e214909d084ef47ded855ae` |
| `learn.png` | light | 384 × 839 | `4fab9ee66dab083515a7df20f32c47202db1461f91cf53931f147b5563010e44` |
| `beginner.png` | light | 384 × 888 | `cbff37926dc9b220eeb65e76a8e7ba5577515549a2745eb6662cdbb04dd1148f` |
| `cloze.png` | dark | 384 × 1421 | `0d0977aa61c5a5e7282b037f35fdd8c5152edbd1ac75c5050d6887b3a0bed6b5` |
| `sentence-building.png` | light | 384 × 943 | `35116c022c205fa4c676c0442e434255f1584ddf3c82dfdc44d4cda417a8a999` |
| `dictionary.png` | light | 384 × 953 | `3129d762f2ca8116dd352b15f0614bb2d03ed9261510bc4cdfb6df49c8fb7dc5` |
| `story.png` | light | 384 × 1271 | `b549e90e58d9fbaadb7358225eb4ce0b893a30556875d4557ce7bf4e79349382` |
| `feedback.png` | dark | 384 × 1439 | `8e361420655f1b9ad878a5d2767690c0ac1e546b5dcbd56da48e75edb20fecba` |
| `games.png` | light | 384 × 982 | `20184ec8ce6fe36b58d99d86d898b5bb897415a2fab523955c365af6f91475c0` |
| `conjugations.png` | dark | 384 × 743 | `fe1bcc77a25c18d80e2682d43ce36baaf6863cb2836e3f4aed170a8a488d485d` |
| `review.png` | light | 384 × 862 | `89b661222006fe9de3b18416ef13db60ef4284bc4c4618cf6d4fe824d1fa1543` |
| `profile.png` | dark | 384 × 1099 | `a06bc340077495b9c4036d2cc6dd7d396d3f9ab830b2da5f930dfe40a8293539` |
| `saved-words.png` | light | 384 × 703 | `6769b5d51beea16c2c8bc1118469ad9abb43b6fa18f4a6782d6bacb007740b33` |
| `recommendations.png` | light | 384 × 925 | `3e7ebde0c4e8cb4328b69f55720a66aedf37edd9c7b69918aaebf61053990264` |
| `lesson-complete.png` | dark | 384 × 871 | `1f2bf5be21c335433e73910d0372915710abd1017d689114e6ace0fd5224703d` |

## Principal files

Runtime: `www/consolidation.js`, `beta-diagnostics.js`, `linguistic-content.js`, `app.js`, `practice-hub.js`, `practice-skills.js`, `quiz-view.js`, `screens.js`, `recommendations.js` and their existing bank/bootstrap/style integrations. Native: Android version metadata and the existing MainActivity export bridge. Governance: AGENTS, content/schema/diagnostics/accessibility/consolidation policies, A1 audit, release notes/manual QA, README/showcase manifest/images and architecture/build references. Validation: `audit-language.cjs`, recommendation/story audits, strict historical inverse/dictionary-build helpers, browser/capture fixtures, CI/local release gate and consolidation/compatibility tests.
