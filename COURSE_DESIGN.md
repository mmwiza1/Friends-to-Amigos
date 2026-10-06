# A1.1 curriculum design

This is a course subdivision informed by CEFR can-do principles and the Instituto Cervantes scope guidance documented in [the resource research](docs/resources/WRITTEN.md). It is not CEFR certification. Later-stage targets are plans, not playable content.

## Practical outcomes

Each topic unit centres on something a learner can do with another person. Grammar supports that task rather than naming the unit’s objective.

| Unit | Learner outcome | Grammar in context |
| --- | --- | --- |
| Greetings & introductions | Introduce yourself, ask a name, greet and leave politely | Me llamo, soy + name, te llamas; fixed courtesy phrases |
| About you | Give age, origin and home city; ask basic personal questions | Ser for origin, tener for age, vivo en; hablo; estar for a current state |
| At the café | Order a simple breakfast, express hunger and ask for the bill | Short polite orders, quiero, tener hambre, singular gustar |
| Numbers & prices | Ask a price, understand a small total, specify a quantity | Cuánto cuesta, plural quantities, veintiún before masculine nouns |
| Family & people | Introduce close family and describe someone simply | Ser for descriptions, possessives, adjective and number agreement |
| Everyday objects | Identify an object, describe it and say where it is | Noun–colour order, hay vs identification, estar for location |
| Around town | Ask where a place is and follow a simple direction | Dónde está, near/far, directional phrases, a + el → al |
| Routines & meeting times | Say when an activity happens and agree a meeting time | Es la una vs son las, a la/las, y media, menos cuarto |

## Familiar characters and small situations

There are four recurring people: Ana, an English learner settling into Madrid; Luis, her local friend; Marta, Luis’s sister; and Diego, who works at their neighbourhood café. Ana’s origin and Madrid home remain consistent. Relationships do not change between units.

The 32 original stories form small encounters rather than a complicated plot: introductions at class, completing a form, checking a misheard age, ordering different drinks, correcting dos/doce, reading a price label, meeting Marta, looking at a family photo, finding keys, identifying a phone, checking a direction, and confirming a changed meeting time.

Passages use short present-tense sentences and dialogue. A small glossary explains scenario vocabulary or fixed phrases, such as ficha, aquí tienes or nos vemos. Transfer prompts supply an unfamiliar number where needed instead of silently increasing the vocabulary burden. Vocabulary support can be opened when reading; questions and review retain the complete original passage.

## Rhythm and exercise progression

The existing 72 lesson IDs and their order remain unchanged:

Discover → Story 1 → Build confidence → Story 2 → Use it → Story 3 → Write in Spanish → Checkpoint → Story 4.

Each of the three regular lessons has five questions: a model/recognition or dialogue choice; controlled completion; recall from memory; a contextual interpretation/response choice; and a short Spanish response in a changed situation. The eight writing activities each have five practical requests. A situation constrains the response enough for authored answer checking: for example, ordering tea rather than coffee, introducing a named sister, or suggesting a particular meeting time.

Checkpoints contain nine questions, including four Spanish-production items. Their deliberate reuse of earlier tasks tests retrieval after intervening activities. Completion and capability thresholds remain 80%; records are earned once. Capability wording describes a limited course outcome, not independently assessed conversation or certified proficiency.

Spanish-only production now appears in 120 question slots, compared with 40 before this revision. This count includes checkpoint retrieval. Overall activity and question counts are unchanged: 72 activities and 392 questions.

## Reading comprehension

Every story has three authored choice questions and two short typed questions. Distractors are written for the specific situation, not generated from arbitrary names or a global answer pool. Questions mix explicit facts, meaning in context, matching information to a speaker, a suitable reply, the next event, simple transfer and supported inference. Only 40 of the 160 story questions are tagged as literal facts.

Learners read before choosing “Ready for questions”, without a forced timer. They may reread the passage throughout questions and spaced review. Typed comprehension accepts English or Spanish. Choices use English for meaning questions and Spanish for conversational responses; their language follows the task rather than displaying paired translations of every option.

## Answer checking and feedback

Spanish production remains short and constrained. Accepted variants are authored per task: omitted subject pronouns, naturally polite orders, alternative introductions, and relevant regional vocabulary. Matching tolerates case, punctuation, repeated spaces and vowel accents, including canonically equivalent Unicode. Ñ remains distinct from n. No substring or LLM grading is used: a negated version of a request does not pass simply because it contains the example answer.

Feedback explains the pattern or passage evidence. Common misconceptions include tener for age/hunger, ser/estar, gustar, adjective agreement, article gender, false friends, fixed por favor, and al versus a la. Some familiar age/hunger/gustar errors receive a specific explanation; other errors use the concise authored explanation for that task. A valid unlisted paraphrase may still be rejected, so prompts request a word, short phrase or constrained sentence.

TTS pronunciation of a model answer appears after checking, so recall/production cannot reveal their target beforehand. Stories can be read aloud through the existing Spain Spanish TTS. Synthetic speech is labelled as TTS; it is not recorded listening practice.

## European Spanish

Spain vocabulary and pronunciation remain the default: móvil, ordenador, vosotros/vosotras and es-ES speech. Two brief unit notes explain móvil/celular, ordenador/computadora, and vosotros/ustedes. Relevant regional responses can still be accepted in writing. These notes are reference support, not an extra dialect curriculum for beginners.

## Original material and references

This revision follows phase 1 of [the integration guide](docs/resources/INTEGRATION_GUIDE.md): original material informed by the documented CEFR/Cervantes scope and communicative, contextual design principles associated with Semillas and the other OER notes. No external exercise, story, translation or recording was imported or closely adapted. [The reference record](docs/resources/CURRICULUM_REFERENCE.md) distinguishes design references from incorporated assets.

Future verbatim or close adaptations require exact item-level licence checks and the [attribution template](docs/resources/ATTRIBUTION_TEMPLATE.md). No share-alike content has been introduced through this rewrite. No audio corpus was downloaded. Recorded listening, provenance tooling and curated human voices remain a separate future phase.

## Saved progress

Stable lesson IDs, tuple-style units, the version-1 storage key and export format remain supported. Completed IDs, streaks, achievements and capabilities are not rewritten. Active lessons and review questions are saved snapshots: old attempts, even historical two-question lessons, finish using the original content. The previous length-based replacement of active questions is removed because replacing a passage or answer mid-attempt can invalidate saved answers. Starting a new attempt uses the revised course. Import clears the current in-memory quiz before resuming the imported snapshot.

## Stage progression and authoring metadata

`Curriculum.stageInfo` defines an explicit goal, three practical tasks, language support, language focus and playable/planned status for each subdivision. `Curriculum.stages` remains the original ordered string API. The Learn screen displays those targets; future stages have no launchable lessons.

| Stage | Practical progression | Language focus |
| --- | --- | --- |
| A1.1 | First meetings, breakfast, prices, family, objects, directions and meeting times | Present-tense chunks, agreement and basic questions |
| A1.2 | Outings, clothes shopping, home and routines | Present consolidation, reflexive routines, near-future plans, simple connectors |
| A2.1 | Recent experiences, travel choices and health needs | Common past events, comparison and plans |
| A2.2 | Routine problems, changed habits and practical requests | Event/background contrast, polite requests and sequence |
| B1.1 | Connected narratives, reasons and main-point summaries | Past narration and everyday opinions |
| B1.2 | Discuss options, negotiate solutions and write coherent complaints | Advice, wishes, common subjunctive contexts and cohesion |
| B2.1 | Compare perspectives, develop arguments and adjust register | Qualification, complex clauses and formal requests |
| B2.2 | Interpret stance, synthesize accounts and defend proposals | Nuance, concession, counterfactuals and sustained cohesion |

These are provisional authoring targets informed by the documented references, not official CEFR descriptors. A1/A2 comprehension can accept English or Spanish; later stages should progressively use Spanish with support. Longer B1/B2 production needs a reviewed assessment design before implementation. The current finite short-answer grader is not claimed to assess extended writing.

Every playable lesson carries its unit goal, stable outcome ID and an original-authorship reference record. Goals appear during regular questions and story reading; older saved snapshots fall back to the existing unit index without replacing their questions. No migration or storage-version change is required. The shared tuple units API, lesson IDs and review prompt keys remain stable.
