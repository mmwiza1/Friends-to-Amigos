# v1.8 consolidation implementation report

Starting main: `7504f49d740d13fbfd60237e510cf6716f534923`. App 1.8.0 / Android versionCode 19. No new stage, major Practice activity, backend, recruitment programme or KPI/OKR framework.

## A1.1 / Practice

All 72 A1.1 activities / 416 slots are covered by the [structural audit](v18-a1-audit.json), including 32 stories and eight checkpoints. A1.1 retains 116 structured tasks, zero deterministic open textboxes and unchanged checkpoint targets/threshold. Twenty-six authored bilingual models across `u1l0`–`u7l0` make each unit’s first recognition/completion/construction steps explicit, including five fourth-question vocabulary checks. Visible models count as assisted evidence and are hidden during Review/Practice retrieval. Unit 0’s established ramp remains. Later context, transfer, media and checkpoints retain normal demands. Six stale glossary entries were replaced after inspecting all flagged A1 passages; article/ellipsis variants are recognised by linting rather than falsely called missing.

Practice keeps its recommendation first. Early A1.1 gets familiar construction/listening choices (Numbers only once its source is reached), with the full eleven-activity catalogue under a disclosure. Established learners retain the complete catalogue. Real weak signals include their recorded error count and a focus key. Home deep-links its evidenced area. Recommendation-driven grammar uses reached source questions; selecting an advanced manual grammar level cannot widen that default. Inactivity recommends a skill but is not labelled a weakness. No recommendation awards course progress or fabricates verified speaking accuracy.

## Local diagnostics

Separate bounded storage, schema 1, up to 500 events / 30 days; Profile data controls export/pause/reset. Exact event allowlist and privacy contract: [BETA_DIAGNOSTICS.md](../BETA_DIAGNOSTICS.md). All writes are whitelist-sanitized; learner names, answers/free writing, searches, audio, arbitrary strings/device identifiers are excluded. Importing progress cannot adopt diagnostic fields. Storage failure is non-blocking. Duration is sampled active time, not exact attention. Reset never changes learning evidence. Android adds a dedicated export filename through the existing document API, with no new permission.

## Surgical Spanish / continuity

- A: the obsolete Toledo source wording is replaced with natural vivías/vives framing; the already stronger live guided prompt continues allowing personal places/model comparison. Canonical model remains “Antes vivía en Toledo. Ahora vivo en Madrid.”
- B: “Después hemos comido en el café de Diego.” retains present perfect.
- C/D: “¿Una película sobre música?” and “pero hoy también prefiero el cine.”
- E: “Luis le preguntó si había venido a pie”; a glossary explains the fixed reported-past chunk. This explicit requested naturalness exception is documented in the story scope audit; no new paradigm is added.
- F: “antes de que empezara la película” in the live focused listening and Conjugations contexts that still use that cinema scenario. The current course Story Edition has a different everyday-neighbour plot, so it was not replaced with an old story.
- G: “responde a las necesidades de todos”. H: explicit “el método” in the qualified-experience model, with matching English support and diagnostic wrong forms.
- I: existing coger preferences and accepted tomar variants remain. Intentional A2.1 tomar conjugation targets stay tomar; changing the teaching verb would violate identity/objective safety.
- J: no live “hacía … desayuno” model was found; no speculative breakfast rewrite was made.
- Six A1 glossary replacements: más→de nada; juntos→la cuenta; suficiente→libreta; viene→entra; ¿cuál?→en clase; un cambio→nos vemos. Passages/answers stay unchanged for these glossary fixes.

The existing 24 standalone editions, three primary characters and supporting cast remain. Everyday/social/comedy scenarios are preserved alongside strong B2 analysis. Future B additions must consider adult social life; no arbitrary ratio or mass B2 rewrite was imposed. Internal polish is not independent native/educator review.

## Governance / architecture / recommendations

Content review policy distinguishes grammar, naturalness, Spain usage, level, fairness and known-language continuity. `audit:language` checks positive-model corruption, normalised options/answers, exact accepted duplicates, structures, source/stage/prerequisites and curated lemmas. Duplicates are grouped inventories; glossary/Spain-preference issues are review flags, not automatic rewrites or claims of comprehensive grammar checking.

Fourteen existing starter pairs now have a canonical record schema; Practice derives the same bank/IDs. The whole-course registry is a reference view, not duplicated authored data. Remaining JS content stays in place for incremental migration. The live amendment layer is separate from historical compatibility inverses; schema-v2 storage never invokes it. All saves, reviews, active attempts, writing, games, Saved Words and source identities retain their contracts.

All 30 recommendations add provider, lastVerified and verification-source fields while retaining stage range, reason, variety/access and Comfortable/Stretch. Verification dates remain the actual 2026-10-26 review, not a fabricated new live review. Offline audits flag stale verification, missing metadata, invalid ranges, unsupported Steam language claims and unstable YouTube references. Optional network diagnostics distinguish request failure/bot blocking from disappearance; no runtime fetch was added.

## Performed validation / visual acceptance

Pending final candidate checks, current screenshots and deliberate image inspection. No physical-device, TalkBack, external beginner study or independent language review is claimed. Exact completed results will replace this paragraph before main promotion.
