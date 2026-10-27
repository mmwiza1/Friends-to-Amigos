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

Pending final candidate checks, current screenshots and deliberate image inspection. No physical-device, TalkBack, external beginner study or independent language review is claimed. Exact completed results will replace this paragraph before main promotion.

## Recorded GitHub showcase visual review

All fifteen current 1.8.0 / Android 19 images were regenerated by run 40536864998, capture commit `795814634b207850f4f109c9bb6f1409bd90bca4`. Capture passed 191 semantic/geometry assertions. Every exact PNG was individually visually inspected: nine final images are byte-identical to the inspected prior 1.8 candidate; Learn, tiles, dictionary, story, Review and completion were re-inspected from the final capture. All approved: meaningful framing, readable text, current visible navigation, no clipping, overflow, fake system bands or nav overlap. Profile, dictionary and completion retain clean boundaries. The Practice image shows the established full-catalogue state; beginner disclosure is separately covered by browser checks/stress captures. No image was merely relabelled from a prior release. These are 384 CSS px / DPR 1 Chromium app viewports with explicit light/dark themes and recorded heights, not physical Android captures.

<!-- showcase-review: f96a160c10db2902218e5183d48e605645566e12f4cd5f05fbb4d7f582002fdd -->

| Image | Theme | Viewport | Reviewed PNG SHA-256 |
| --- | --- | --- | --- |
| `home.png` | dark | 384 × 1012 | `c50f945b142514dff7079ae4cd6dda8c6b0c42322e214909d084ef47ded855ae` |
| `learn.png` | light | 384 × 839 | `ae122c50c78b8200a1c67c07966c2a51f020a80072814c0df1765ac41ab5e8ad` |
| `beginner.png` | light | 384 × 888 | `703da7a732a92c87bbadbe4af3d47905eff2aa58a53f22ae8a338d20235f46bb` |
| `cloze.png` | dark | 384 × 1421 | `ed7d85d7a7aa3ffe02680e56272fc125bcd9f45a57c1bbfd3173323665594934` |
| `sentence-building.png` | light | 384 × 943 | `b3d1a8320f3941de3b644ab9aaa2094e81ce59ab0bc625295bbdfc50e4c1b60f` |
| `dictionary.png` | light | 384 × 953 | `ed0f22c77951699588050f4dca6cd61bc26bc062c949d746f650c6eac8786279` |
| `story.png` | light | 384 × 1271 | `32370db568e10d16319cf3bed3f6a8292d7ea91a8eec64278bfd9c075e84d793` |
| `feedback.png` | dark | 384 × 1439 | `8e361420655f1b9ad878a5d2767690c0ac1e546b5dcbd56da48e75edb20fecba` |
| `games.png` | light | 384 × 982 | `20184ec8ce6fe36b58d99d86d898b5bb897415a2fab523955c365af6f91475c0` |
| `conjugations.png` | dark | 384 × 743 | `d9cc4d0c1b7510302686e35ebe261487e17fc814232d75400b4fa84a0ae6a1b8` |
| `review.png` | light | 384 × 862 | `6c16db3686a9edd00983c4d3f051bea42d5a02bb8f53bbd6ceac5e10147ec7f5` |
| `profile.png` | dark | 384 × 1099 | `a06bc340077495b9c4036d2cc6dd7d396d3f9ab830b2da5f930dfe40a8293539` |
| `saved-words.png` | light | 384 × 703 | `6769b5d51beea16c2c8bc1118469ad9abb43b6fa18f4a6782d6bacb007740b33` |
| `recommendations.png` | light | 384 × 925 | `c9f765331746c8b13169db8ecb91b035c00586797e546561dd81188e8fa63421` |
| `lesson-complete.png` | dark | 384 × 871 | `92005f98d64230d8fb31f5d87745c2de459ad8c9c5f536414de382b02348c373` |
