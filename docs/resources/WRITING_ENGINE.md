# Writing assessment and feedback resources

Last reviewed: 2026-10-07

This document records external open-source resources that could improve Friends to Amigos writing exercises without introducing cloud grading or LLM-based marking.

The target architecture remains **offline-first, deterministic and pedagogically cautious**. External libraries should help diagnose spelling, morphology and likely learner misconceptions; they should not be allowed to confidently reject valid Spanish simply because it differs from one model answer.

## Recommended architecture

Use a layered checker rather than one all-or-nothing grader:

1. **Friends to Amigos normalisation** — case, punctuation, whitespace and the project's existing accent policy.
2. **Exact authored variants** — the highest-confidence acceptance path.
3. **Near-miss comparison** — small edit-distance checks for obvious typos.
4. **Spell diagnosis** — optional `nspell` + Spanish dictionary.
5. **Verb morphology** — Spanish conjugation lookup to explain wrong person/tense forms.
6. **Curated learner-error rules** — Friends to Amigos rules informed by Spanish teaching experience and LanguageTool-style patterns.
7. **Intent/task recognition** — optional NLP.js support for guided/free responses; never sufficient by itself to mark correctness.
8. **Feedback composer** — distinguish "correct", "understood but improve this", and "not yet" where confidence allows.
9. **Fallback** — when the checker is uncertain, show a model answer and coaching rather than falsely declaring valid Spanish wrong.

The pedagogical goal is to tell learners *why* something is wrong whenever we have high confidence.

---

## 1. `ehoogerbeets/conjugator` — preferred integration

- Repository: https://github.com/ehoogerbeets/conjugator
- Licence: **Apache-2.0**.
- Language: TypeScript / compiled JavaScript.
- Spanish variety support includes `castillano` as the default and supports informal Spain forms such as `tú` and `vosotros`, plus several Latin-American pronoun styles.

### Why it fits Friends to Amigos

This is the strongest immediate candidate because verb-form mistakes are common, highly teachable, and deterministic.

Potential examples:

- `yo habla` → identify `habla` as third-person singular while the prompt requires first-person `hablo`.
- `nosotros come` → identify person/number mismatch and provide `comemos`.
- `vosotros tienen` → explain that Spain-informal plural requires `tenéis` in the relevant present-tense context.

### Recommended use

Use conjugation data as a **diagnostic helper**, not as the sole sentence grader.

Suggested API wrapper inside Friends to Amigos:

```js
analyseVerbForm({
  lemma: 'hablar',
  learnerForm: 'habla',
  expectedPerson: 'first',
  expectedNumber: 'singular',
  tense: 'present',
  mood: 'indicative',
  variety: 'castillano'
})
```

Return structured feedback such as:

```js
{
  category: 'verb-person',
  understood: true,
  expected: 'hablo',
  explanation: 'Habla is the él/ella/usted form. With yo, hablar becomes hablo.'
}
```

### Integration status

**Preferred candidate for future implementation.** Before vendoring or packaging the library, preserve Apache-2.0 notices and confirm bundle size/WebView compatibility.

---

## 2. `nspell` — preferred spelling engine, conditional dictionary integration

- Repository: https://github.com/wooorm/nspell
- Licence for `nspell`: **MIT**.
- Description: Hunspell-compatible spell checker in plain JavaScript.
- API includes `correct`, `suggest`, `spell`, custom-word addition and dictionary loading.

### Spanish dictionary

Recommended source:

- Repository: https://github.com/wooorm/dictionaries
- Package: `dictionary-es`
- Source locale: `es_ES`.
- Dictionary/affix licence: **GPL-3.0-or-later OR LGPL-3.0-or-later OR MPL-1.1-or-later**; the surrounding packaging project is MIT.

The dictionary is a separate licensed work. Do not assume nspell's MIT licence applies to the Spanish `.dic`/`.aff` files.

### Why it fits Friends to Amigos

It can distinguish likely spelling errors from grammar errors:

- `tiengo` → likely typo/suggestion near `tengo`.
- `quero` → likely spelling error near `quiero`.
- unknown proper nouns can be added to a course-specific personal dictionary.

The app should continue treating its own accent policy separately. A valid word missing a teaching accent may be marked understandable/correct under the current lesson rules while still receiving a gentle accent note.

### Recommended use

Do not run every token through the spellchecker and automatically fail unknown words. Names, inflected forms, regional words and learner-level vocabulary can create false positives.

Use spell checking to generate **diagnostic hints**, e.g.:

```js
{
  category: 'spelling',
  token: 'quero',
  suggestion: 'quiero',
  confidence: 'high'
}
```

### Licence decision required before shipping

If the Spanish dictionary is bundled in a future APK, explicitly choose and comply with one of its offered licences and add the required notices/source obligations. This document is not legal advice.

### Integration status

**nspell: preferred integration.**

**Spanish dictionary: conditional integration pending explicit licence/compliance decision.**

---

## 3. Friends to Amigos learner-error rules — strongly recommended

This should be first-party code/content, not a copied third-party grammar engine.

Create a compact deterministic rule bank for mistakes learners actually make in the course.

Suggested categories:

- `ser-vs-estar`
- `tener-age`
- `tener-hambre`
- `gustar-structure`
- `article-gender`
- `adjective-gender`
- `adjective-number`
- `subject-verb-person`
- `a-el-al`
- `de-el-del`
- `literal-english-order`
- `missing-reflexive-pronoun`
- `por-vs-para` at stages where it is taught
- past-tense choice at later levels
- subjunctive triggers only once the relevant stage teaches them

Example authored rule:

```js
{
  id: 'AGE_USES_TENER',
  pattern: /^soy\s+(.+)\s+años$/i,
  stage: ['A1.1', 'A1.2', 'A2.1', 'A2.2'],
  feedback: {
    category: 'tener-age',
    explanation: 'Spanish uses tener to express age. Use tengo … años, not soy … años.'
  }
}
```

Rules should be tied to taught material. Do not criticise a learner for advanced stylistic choices they have not been taught.

### Integration status

**Highest-priority first-party implementation.** This offers the best pedagogical value with the lowest technical/licensing risk.

---

## 4. LanguageTool — reference first, full engine not recommended for the current app

- Repository: https://github.com/languagetool-org/languagetool
- Licence: **LGPL-2.1-or-later** for the open-source project/rule infrastructure; verify exact files before reuse.
- Spanish support: substantial grammar/spelling infrastructure and rule patterns.
- Runtime: primarily Java/JVM; the standalone application is much heavier than Friends to Amigos' current offline WebView architecture.

### Why it is valuable

LanguageTool demonstrates a mature pattern-based approach:

`token/POS pattern → detected issue → replacement/suggestion → explanatory message`

That model is useful when designing our own learner-specific rules.

### Recommended use

Use LanguageTool primarily as:

- an engineering reference for rule design,
- a source of ideas for error categories,
- a comparison tool during development/testing,
- a possible future optional service only after deliberate architecture/licensing review.

Do **not** copy large Spanish rule sets into the app without a specific licence/compliance review, and do not embed the full Java engine merely to solve A1/A2 writing feedback.

### Integration status

**Reference / development evaluation. Not recommended as an embedded dependency in the current architecture.**

---

## 5. NLP.js — optional guided/free-writing experiment

- Repository: https://github.com/axa-group/nlp.js
- Licence: **MIT**.
- Features relevant here: Levenshtein similarity, tokenisation/stemming, named entities and intent classification; language support is modular in v4.

### Potential use

For a prompt such as:

> You are in a café. Politely order a coffee.

valid learner answers may include:

- `Un café, por favor.`
- `Quiero un café, por favor.`
- `Quisiera un café, por favor.` (if already taught/allowed)

An intent layer could recognise that several structurally different answers all attempt the target communicative act `ORDER_DRINK`.

### Critical limitation

Intent recognition **must not equal grammatical correctness**.

`Yo café querer` might contain the right concepts while remaining unacceptable Spanish. Therefore an intent classifier should only contribute evidence such as:

```js
{
  intendedMeaning: 'ORDER_DRINK',
  intentConfidence: 0.92
}
```

Grammar/morphology/authored-variant checks still determine whether the response can be confidently accepted.

### Recommended use

Prototype only after the deterministic writing engine is reliable. Train only on original Friends to Amigos examples or properly licensed data. Keep models small and offline.

### Integration status

**Optional future experiment; useful for Guided/Free mode, not required for Controlled writing.**

---

## 6. Apertium Spanish — research/reference

- Repository: https://github.com/apertium/apertium-spa
- Licence: **GPL-2.0** in the repository's COPYING file.
- Capability: Spanish morphological analysis/generation and linguistic data as part of the Apertium ecosystem.

### Why it is interesting

A morphological analyser can identify a surface form such as `voy` as belonging to `ir` with specific grammatical features. This could theoretically provide very strong diagnostics for advanced writing.

### Why it is not recommended now

- Heavier integration than the project's current needs.
- GPL obligations require deliberate consideration before embedding/distributing it as part of the app.
- Requires more of the Apertium toolchain than a small JavaScript helper.

### Integration status

**Reference/research only unless a future architecture and licence review explicitly approves it.**

---

# Proposed writing modes

## Controlled writing

Use when there is a narrow expected target.

Marking order:

1. exact/normalised accepted variant,
2. authored equivalent variants,
3. obvious near-miss diagnosis,
4. verb/grammar diagnostic,
5. retry with teaching feedback.

This mode may confidently mark correct/incorrect when the task is sufficiently constrained.

## Guided writing

The task has a clear communicative purpose but multiple valid answers.

Suggested outcome states:

- `correct-natural`
- `correct-acceptable`
- `meaning-clear-needs-fix`
- `uncertain-show-model`
- `off-task`

Avoid a hard failure when the engine cannot prove the learner is wrong.

## Free writing

Do not present the deterministic engine as an authoritative essay grader.

Instead provide:

- detected spelling issues,
- high-confidence grammar observations,
- model phrases relevant to already-taught material,
- optional self-comparison,
- no claim that an undetected sentence is fully correct.

A future LLM-based tutor, if ever added, should be an explicitly separate optional feature rather than silently changing deterministic course scoring.

---

# Feedback UX recommendation

For a wrong/near-miss written response, prefer three layers:

### Immediate

`Almost — I understood the idea, but the verb form needs changing.`

### Model

`You wrote: Yo habla español.`

`Natural model: Yo hablo español.`

### Why?

Expandable explanation:

`Habla is used with él/ella/usted. With yo, hablar becomes hablo.`

A "Why?" disclosure keeps normal lessons quick while allowing learners to request deeper instruction.

---

# Safety against false marking

For language learning, a false rejection of valid Spanish is particularly damaging. Apply these rules:

- Exact authored variants can be marked correct with high confidence.
- A diagnostic tool may explain an error but should not automatically invalidate an otherwise accepted answer unless the rule is known to be safe in context.
- Spell suggestions are suggestions, not proof.
- Intent classification is evidence of meaning, not proof of grammaticality.
- Grammar rules should be level-aware and context-aware.
- If uncertainty remains, show a natural model and say the answer could not be confidently assessed rather than claiming it is wrong.

---

# Suggested implementation phases

## Phase 1 — no new dependency required

- Formalise answer normalisation.
- Add structured misconception/error codes to authored writing questions.
- Add first-party deterministic learner-error rules.
- Add "You wrote / Natural model / Why?" feedback.
- Add targeted tests for common valid variants and known errors.

## Phase 2 — verb intelligence

- Evaluate/bundle `ehoogerbeets/conjugator` or adapt it behind a small internal interface.
- Diagnose person/number/tense errors only where the prompt provides enough grammatical context.
- Preserve Apache-2.0 notices if shipped.

## Phase 3 — spelling diagnostics

- Evaluate `nspell`.
- Decide explicitly whether/how to ship the `dictionary-es` data under one of its available licences.
- Keep a Friends to Amigos allow-list for names, course vocabulary and accepted regional forms.

## Phase 4 — guided meaning

- Prototype a small NLP.js intent classifier against original course-authored examples.
- Measure false acceptance and false rejection before enabling it for scored lessons.
- Initially use it only for coaching, not pass/fail scoring.

## Phase 5 — advanced research

- Compare behaviour against LanguageTool and Apertium during development.
- Do not embed these engines without a separate architecture/licence decision.

---

# Test requirements for any future writing-engine release

At minimum include regression cases for:

- all existing accepted writing answers,
- punctuation/case/space normalisation,
- the project's accent policy and preservation of `ñ`,
- valid alternative wordings,
- wrong verb person,
- wrong number/gender agreement,
- ser/estar confusion,
- tener age/hunger errors,
- gustar structure,
- spelling near misses,
- proper nouns and course vocabulary,
- Spain-first forms such as `vosotros`,
- permitted Latin-American variants where intentionally accepted,
- cases where the engine must return `uncertain` rather than falsely reject.

Track false rejections as a release-blocking quality metric.

---

# Codex instruction

When a future task concerns writing assessment, Codex should read this file and `writing-tools.json` before choosing dependencies or changing grading behaviour.

Do not automatically install every resource listed here. The preferred sequence is:

1. first-party deterministic rules,
2. Conjugator,
3. nspell + explicitly reviewed Spanish dictionary licence,
4. optional NLP.js prototype,
5. LanguageTool/Apertium as reference unless separately approved.
