# Content review policy

Authoring → automated validation → native-language/editorial review → learner-experience review → release.

Each meaningful model needs six distinct judgements: grammatical correctness, naturalness, appropriateness in Spain, stage suitability, task fairness and consistency with taught language. Passing a deterministic checker answers only its explicitly supported structural questions. It is never native-speaker or educator validation. If independent review has not happened, record it as pending; do not relabel an agent pass as external human approval.

Use the existing syllabus and permanent sources. A textbox means genuine expression; a finite target normally uses cloze, tiles, word banks, controlled choices or dialogue completion. Keep open-writing diagnosis conservative and uncertain when needed. Missing vowel accents/opening punctuation may remain acceptable learner input; ñ is distinct. Display canonical spelling. Prefer Spain vocabulary and vosotros/as; keep valid regional alternatives such as tomar el autobús rather than declaring them wrong.

Use familiar language to carry new grammar, and familiar grammar to carry new vocabulary. A1.1 is onboarding throughout: recognise, understand, complete, construct, recall, use. Initial support must return later as retrieval, context and transfer; checkpoints retain their targets and threshold. A story glossary should help with words actually in the episode or clearly marked useful related forms.

Read STORY_BIBLE.md for Ana, Luis and Marta and supporting Diego, Elena and Clara. Stories stay standalone, with locally understandable callbacks. Preserve the everyday/social/comedy editions. Retain strong B2 analytical work; future edits/additions must also consider adult social life, housing, relationships, travel, complaints, humour and compromise. Do not impose an arbitrary ratio or mass-rewrite good content.

## Review record

Record stable source/activity/question ID, before/after, objective, reason, alternatives, prerequisites, reviewer role, methods and unresolved concerns. The v1.8 amendments live in `www/consolidation.js`; `Curriculum.consolidationAudit` exposes exact original/live question objects. Historical compatibility tools explicitly reverse this overlay; storage never does. The v1.5 edition/archive contracts remain separate.

Run `npm run audit:language`, all established content/tests/audits, visual and accessibility checks, screenshot validation and Android gates. Errors block; flags require contextual editorial triage, not automatic rewriting. Duplicate prompt/model inventories identify intentional retrieval/checkpoint reuse as well as possible overuse. Do not erase valid historical variants just to silence a flag.

Independent native/educator review remains a release-report limitation until actually performed. Full accessibility certification, CEFR certification, arbitrary prose grading, acoustic pronunciation verification and human audio are not implied.
