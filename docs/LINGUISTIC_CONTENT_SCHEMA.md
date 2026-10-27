# Incremental linguistic content schema — version 1

The current JS generators, permanent question manifests and historical snapshots remain authoritative. This is an incremental path, not a replacement migration.

`www/linguistic-content.js` supplies the existing fourteen greeting/name starter records as the first safe canonical area. PracticeSkills derives its former exact Spanish/English pairs from those records, preserving all existing generated skill IDs and starter coverage. The existing dictionary supplies lemma meanings; no third-party corpus was imported. `course(C)` is a lightweight reference view over current authored questions, not a competing copied bank.

| Field | Contract |
| --- | --- |
| id | Stable canonical identity; never inferred from changing prose |
| stage / unit | Existing playable stage, zero-based unit |
| sourceActivity / sourceQuestionId | Permanent provenance; references must resolve |
| topic / communicativeGoal | Useful learner outcome and context |
| grammarConcept | Central syllabus ID, or explicit null for foundational chunks |
| canonicalSpanish / naturalAlternatives | Authored positive model and validated alternatives |
| englishSupport / explanation | Authored support; never invented runtime translation |
| prerequisites | Earlier/reached source activities; empty for foundational starter chunks |
| dictionaryLemmas / vocabulary | Curated dictionary links; proper names are not invented lemmas |
| spainPreferredForm / regionalAlternatives | Preference without rejecting valid Spanish |
| eligiblePracticeModes / storyReferences | Existing consumers/episodes; not automatic course completion |
| editorialStatus | Actual review state; independent review may be pending |

Future migration should move one bounded canonical area at a time, derive consumers, compare original identities/models and keep explicit compatibility fixtures. Do not maintain a second independently edited translation/model in every consumer. Do not put the entire curriculum into a single monolithic file.

Never re-resolve an active lesson, old Practice question or Review snapshot against this registry. Snapshots own their saved questions, passage, grading contract and original identity. New live wording cannot silently clear an older different model/passage. Schema v2, course progress, placement, streaks, Saved Words and existing exports/imports remain unchanged.
