# Offline learner dictionary and Saved Words

The dictionary is a vocabulary explorer, separate from scoring, hints, writing assessment and spaced review. Home / Learn / Games / Review / Profile, in that exact order, remain the five main tabs. Saved Words is a secondary screen inside Profile. Do not use feature mockups to redesign navigation or remove Review.

## Data and build

- `scripts/content/learner-dictionary-source.cjs`: original concise definitions, important constructions, regional notes and selected known forms.
- `scripts/content/build-learner-dictionary.cjs`: combines that source with explicit bilingual course story glossaries and unit phrase banks. Curated table targets provide verified form/person/tense metadata. Additional original regular/irregular mappings are explicit and tested.
- `www/learner-dictionary-data.js`: generated local asset; no network request or runtime dependency.
- `www/learner-dictionary.js`: pure lookup, contextual phrase matching, saved-list validation/search and state adapters.
- `www/dictionary-ui.js` and `www/dictionary.css`: reusable token decoration, anchored popup and Saved Words renderer.

Current inventory: **1,230 entries: 954 words and 276 expressions, plus 1,564 known form mappings**. Definitions/meanings come from original Friends to Amigos material; no third-party dictionary, Hunspell data, commercial service or text/audio corpus is bundled. A phrase translation is not split into invented individual word translations. Proper names and unknown words can have no entry.

```sh
node scripts/content/build-learner-dictionary.cjs
node scripts/content/audit-learner-dictionary.cjs
npm run check
npm test
```

Build output must be deterministic. Review new data and run the integrity tests before committing regenerated output. Existing `lex-word-*` / `lex-phrase-*` identities must stay stable: prefer adding aliases/forms over renaming a lemma. A saved entry whose current definition is unavailable retains its validated minimal snapshot.

Entries have `id`, `kind`, `lemma`, `pos`, `meaning`, `aliases`, up to three additional `senses`, short `examples`, `notes` and first-party `sources`. Forms link `surface` to `entry`, `lemma`, `tense`, `person` and source metadata. All displayed Spanish uses canonical accents and punctuation.

## Context and conservative analysis

Lookup receives the tapped surface, full visible sentence, character offset and course stage. Offset identifies the actual occurrence when a word repeats. Priority is:

1. A known construction containing that occurrence: tener hambre/sed/que, me gusta/gustan, ir a + a known infinitive, quedar con, me duele/duelen, hacer la compra, or an explicit authored expression.
2. A confidently recognised conjugated form and its base.
3. A known word and a matching authored sense.
4. A neutral unavailable-entry message, without guessed meaning or grammatical analysis.

Phrase/compound matching cannot cross hard sentence punctuation. Going **to a place** is not diagnosed as future intention. `fui` is resolved to ir with a clear destination, to ser with a safe identity cue, and otherwise retains ir/ser ambiguity. Shared persons/tenses and noun/verb homographs do not receive invented certainty. Additional senses are stage-filtered during contextual lookup. More contains a few uses/examples and known forms rather than a full grammar syllabus.

Dictionary lookup respects exact written accents first so si/sí, el/él, tu/tú and esta/está stay distinct. A conservative unambiguous folded fallback aids search. This does **not** change assessment: typed answers still tolerate vowel accents, ü, case, spaces and punctuation, including ¿/¡. **Ñ remains a separate letter.** Negation and the current conservative writing outcomes are unchanged.

## UI and pronunciation

Already-visible Spanish receives token lookups before submission: story passages/glossaries, Spanish course instructions, Spanish fragments within English prompts, Spanish answer-option text, teaching models, revealed models/transcripts, canonical Spanish feedback and Conjugations sentences. Learner-entered text, input/radio controls, hidden listening transcripts and unrevealed speaking models remain excluded. The dictionary sees visible text and context only; it never receives correctness metadata or tells the learner which answer to choose.

`www/spanish-fragments.js` provides a reusable visible-text boundary. Authored `spanishFragments` and per-option `optionSpanishFragments` may contain exact strings or `{text, start}` references; `optionsLanguage` / `optionLanguages` may explicitly declare Spanish. Otherwise the helper conservatively recognises Spanish quotations and inverted question/exclamation boundaries using known lexical/function-word evidence. Clearly Spanish standalone options may be recognised as a whole. Ordinary English homographs such as **me**, **no**, **he**, **has**, **plan** or **hotel** cannot by themselves establish Spanish. Ambiguous text should use explicit metadata rather than an increasingly permissive heuristic. The surrounding English is escaped and remains plain text. Completion options follow their existing Spanish task contract.

The choice card is a non-interactive container with a dedicated 44px radio button and sibling option text. A dictionary token is never nested inside that radio button. Tapping the radio/card/padding selects the answer; tapping a decorated Spanish word opens the dictionary without selecting. Capture-phase delegation stops click and Enter/Space propagation from tokens. Radios retain full-option accessible names, `aria-checked`, roving focus, arrows and Home/End; word controls retain their own keyboard access. Closing a popup returns to the same unanswered state. Dotted underlines remain subtle; longer Spanish options wrap beside the aligned radio.

An early Unit 0 product tip says “Tip: Tap any Spanish word for help.” A successful known-entry lookup acknowledges it, including lookup elsewhere in the app; a failed lookup does not. It disappears without changing lesson hint state, score, mastery, Review or streak. Read-only protection remains authoritative. Old saves show the tip until successfully acknowledged.

The popup stays outside the quiz controller. Opening, More, pronunciation, saving and dismissal neither answer a question nor change the snapshot, score, hint flag, review evidence or streak. It repositions on page scroll, visual viewport and native inset changes, respects cutouts/overlay keyboards, and scrolls longer More content. Outside tap, Escape, close and Android Back dismiss it; a second Back retains the existing save-and-leave behaviour. Backgrounding/navigation closes it and cancels speech through the existing lifecycle.

Hear uses the established Spanish (Spain) TTS layer. It is synthetic pronunciation, not recorded human audio or an acoustic quality guarantee. Controls have keyboard access, labels, visible focus and 44px touch targets. Named Samsung-style browser profiles test responsive CSS, native-inset bridge values, resized/overlay keyboard viewports, portrait/landscape, light/dark and large text. They do not identify a device model or prove real Samsung keyboard/acoustic behaviour; physical-device validation remains necessary.

## Persistence and Profile

Dictionary learner state remains additive: optional `savedWords` and optional true-only `dictionaryTipSeen`; storage stays **schema v2**, with the same key and v1→v2 migration. Old saves default to an empty saved list and unacknowledged discovery. A row stores only:

```js
{ id: 'lex-word-tener', kind: 'word', lemma: 'tener',
  display: 'Tengo', meaning: 'to have', savedAt: 1234, context: 'optional short note' }
```

Known expressions save the canonical useful phrase. Entries deduplicate by dictionary ID. Validation caps the list at 1,000, bounds strings/timestamps and safely discards malformed optional rows. A full list produces clear guidance, not false success. Unknown but valid historical dictionary IDs retain their meaning. Protected read-only progress cannot be changed; unavailable storage is explicitly described as session-only, with export guidance.

Profile shows the saved count and opens search (Spanish/English), All / Words / Phrases / Recently saved, Hear, More and Remove. Recent sorts by saved timestamp; other lists sort by Spanish lemma. Search preserves ñ and accepts accentless vowel queries. Composition input is retained until committed. Export/import includes the list alongside existing historical lesson/review snapshots.

Saved question snapshots may retain validated optional `teachingModel` (`spanish`, `meaning`) and Spanish-fragment/language metadata. These render already-visible scaffolding without replacing historical questions from the current bank. Missing metadata remains valid; malformed optional metadata is ignored safely. The first three teaching activities intentionally change for new attempts, while existing active attempts and reviews keep their originally saved types, prompts and passages.

An easier revised task cannot clear a historical review merely because it shares the same permanent question ID. Scheduled-success credit requires the task type and normalised canonical target to match that saved review. Correctly answering the original review snapshot still follows the existing 1/3/7-day schedule; harmless wording, punctuation and accent changes remain compatible. No review snapshot or identity is rewritten.

## Extending coverage safely

When adding course vocabulary, supply a clear original bilingual glossary/phrase pair or a reviewed curated entry. For new forms, verify irregularity, spelling changes, accents, person/tense and ambiguity. Add construction rules only when the context can be identified reliably. Test both a positive example and misleading near contexts. Inspect the exposure report, but do not interpret coverage as translation accuracy, mastery or complete Spanish understanding.

This is intentionally a bounded learner dictionary, not a general translator, spellchecker, sentence parser or grammar grader. Unknown vocabulary and unlisted constructions remain possible. Device acoustic quality and native-speaker review still require human testing.

## v1.3 structured practice

Word/phrase bank text and visible cloze passages/options use the same pre-answer dictionary boundary. Vocabulary spans and Add/Choose/Remove controls are siblings, so lookup never constructs or scores a response. Historical typed snapshots still retain their original interaction. Structural review contracts prevent easier replacement scaffolding from correcting older reviews. The five tabs and Profile Saved Words are unchanged.

## v1.4 preservation

Grammar Reference and refresher examples use the existing bounded contextual dictionary. Pre-answer Spanish lookup, sibling answer-card controls, Saved Words and es-ES pronunciation remain. Looking up a word never sets Spanish Help/English Hint/scaffolding/confidence, scores, review events or mastery. Optional instructional support is a separate learner action. Hidden listening transcripts and unrevealed speaking/shadowing models remain unavailable to lookup.

## v1.5 searchable learner dictionary

Profile → Vocabulary now exposes Dictionary and Saved Words; neither is a new tab or buried in Settings. `learner-experience.js` searches the 1,230 entries (all 1,212 existing entries plus 18 original episode nouns) in either language, ranks exact/whole-term matches and returns up to 40 entries. Vowel-folded search retains ñ. Ambiguous English queries can show multiple analyses; original saber/conocer contrast notes explain facts/skills versus familiarity. Thirty common noun notes provide gender/examples without renaming IDs or changing historical Saved Words. Existing senses, form metadata, region notes and the popup More/Hear/Save paths remain. Unknown results are explicitly unavailable; this is not an exhaustive/cloud dictionary.

The discovery tip is acknowledged by lookup or dismissal and otherwise bounded to three early question views. Those preferences never count as a hint, grade or learning event. New optional state defaults safely for older saves. The pronunciation primer uses existing synthetic es-ES speech with no microphone or acoustic assessment.

The original generated lexical asset is retained. `story-vocabulary.js` idempotently appends 18 original episode nouns with explicit gender, examples and aliases; it does not rename/remove old entries. The developer builder seeds historical glossary identities from the reviewed content manifest before current episode vocabulary is appended at runtime. Rebuild coverage checks that all previous lexical IDs remain available.
