# Resource integration guide


## Current shipped design: full-course user-testing release

All eight stages A1.1–B2.2 are playable: 576 activities, 3,328 slots, 64 practical units and 256 original stories. Focused Listening and Speaking each have 448 items (56 per stage); sentence Conjugations has 592 contexts and Tables has 82 curated targets. Earlier content/IDs/snapshots are protected. New text, dialogues, exercises, glossaries and rules are original Friends to Amigos material; no external text/audio corpus or third-party exercise was imported.

CEFR can-do, Cervantes scope and documented OER principles informed communication, contextual grammar, retrieval, reflection and recycling. The writing resources were implemented as first-party conservative rules, curated morphology and Controlled/Guided/Free task handling; unsafe or licence-gated dependencies were not silently added. See [WRITING_ENGINE.md](WRITING_ENGINE.md) for dependency decisions, [the release report](../release/V1_REPORT.md) and [BUILD_STATUS.md](../../BUILD_STATUS.md) for actual validation. Open writing admits uncertainty; speaking is self-assessed; TTS is synthetic es-ES. No CEFR certification, microphone, ASR, accounts, LLM, cloud grading or C1/C2 content is introduced.
Last reviewed: 2026-10-06

This guide defines how external Spanish-learning resources should enter Friends to Amigos.

## Principles

1. **Curate, do not bulk-import.** The product should remain a coherent authored course, not a mirror of external corpora.
2. **Provenance is mandatory.** Every third-party text or audio item must have source and licence metadata before it is committed.
3. **Prefer permissive licences.** Public domain, CC0 and CC BY are simplest. Treat CC BY-SA as a deliberate project-level decision. Avoid NC/ND/unclear content for shipped assets.
4. **Check the exact item.** A collection's headline licence may not apply to every embedded image, recording or passage.
5. **Pedagogy beats corpus size.** A 5-second natural café exchange that fits A1 is more valuable than hours of ungraded speech.
6. **Spain-first, not Spain-only.** Default beginner pronunciation/usage to European Spanish; label other varieties intentionally.

## Proposed repository layout

Do not add large corpora directly to Git. When learner-facing third-party assets are eventually selected, use a structure like:

```text
www/
  audio/
    learning/
      a1/
        cafe/
          clip-id.ogg
          clip-id.json

docs/
  resources/
    README.md
    AUDIO.md
    WRITTEN.md
    INTEGRATION_GUIDE.md
    ATTRIBUTION_TEMPLATE.md
```

The JSON sidecar should travel with the audio file so provenance cannot become separated from the asset.

## Suggested asset metadata

```json
{
  "id": "a1-cafe-example-001",
  "sourceName": "Example source",
  "sourceUrl": "https://example.org/item/123",
  "sourceItemId": "123",
  "creator": "Creator name or username",
  "licence": "CC BY 4.0",
  "licenceUrl": "https://creativecommons.org/licenses/by/4.0/",
  "attribution": "Required attribution text",
  "originalText": "Un café con leche, por favor.",
  "courseText": "Un café con leche, por favor.",
  "modified": false,
  "variety": "es-ES",
  "speakerRegion": "Spain",
  "cefrReviewed": "A1",
  "reviewedBy": "project author",
  "reviewDate": "2026-10-06"
}
```

For adapted written material, record the same fields in a content manifest or source note associated with the lesson.

## Import checklist

Before a third-party item is included in a release, confirm:

- [ ] Source URL still resolves or an archived provenance URL exists.
- [ ] Exact asset creator/contributor is known where required.
- [ ] Licence permits the intended redistribution and modification.
- [ ] Attribution wording is captured.
- [ ] No `NC` restriction conflicts with future distribution plans.
- [ ] No `ND` restriction blocks the transformation being made.
- [ ] Share-alike obligations have been consciously accepted if applicable.
- [ ] Transcript has been checked by a human.
- [ ] Spanish variety and register are appropriate/labeled.
- [ ] Vocabulary and grammar fit the intended stage.
- [ ] Audio is clean enough for a learner exercise.
- [ ] The exercise tests a course capability, not merely recognition of trivia.
- [ ] Third-party content is listed in the app/repository attribution notice.

## Implementation status and future sequence

### Phase 1 — curriculum reference: implemented

The documented CEFR/Cervantes scope and OER pedagogical recommendations now inform original A1.1/A1.2 material: 16 can-do units, 64 contextual stories, short Spanish recall/production, dialogue and transfer tasks, teaching feedback, glossary/rereading support, and limited regional notes. Lesson metadata connects each activity to its unit outcome and an original-authorship reference record. Stage metadata defines separate A1.1–B2.2 targets; A1.1, A1.2 and A2.1 are playable. Tests protect stable IDs and historical progress snapshots. No third-party exercise was imported or closely adapted.

### Phase 2 — audio-first listening and retrieval: implemented with TTS

48 original choice/typed comprehension questions hide the transcript before attempting, reveal it after checking/explicit skip, allow replay and preserve metadata in spaced review. Vocabulary is familiar and difficulty progresses across A1.1/A1.2. Sixteen selected speaking chunks require an aloud attempt, deliberate model reveal and explicit self-assessment; Needs practice enters review. Speaking is excluded from scored accuracy and is not automatic pronunciation assessment.

The small media model supports a future local `listening.audio` path and falls back to TTS if it fails. No recordings populate that path. Only synthetic es-ES speech and original transcripts are currently integrated. Tests cover DOM transcript hiding/reveal, playback paths, replay/skip, historical/resumable media state and self-assessment. Human multi-speaker listening and exact-item provenance remain the next curated-audio phase.

### Phase 3 — curated audio pool: future

Create a lightweight selection/provenance process for individually cleared recordings that emits both the audio asset and its provenance sidecar. Reject items without an allowed licence automatically.

### Phase 4 — accent exposure: future

After the Spain-first foundation is stable, consider deliberately labelled Latin-American speakers/tasks using individually cleared short recordings. No bulk FLEURS or other dataset integration is approved by this guide.

## Resource-specific rules

### FSI

- Prefer original U.S. government course files.
- Keep source title/unit/track provenance.
- Modernise learner-facing context where necessary; don't assume old cultural scenarios are appropriate today.

### MLS

- Preserve CC BY 4.0 attribution.
- Record speaker/chapter/utterance identifiers where available.
- Manually grade every selected passage for course level.

### Tatoeba

- Never infer an audio licence from the sentence licence.
- Require explicit per-audio licence metadata.
- Prefer CC0/CC BY recordings.

### Wikimedia/Wikibooks

- Check the file's own description page, not just the containing lesson page.
- Preserve creator/source attribution and stated licence.

### Common Voice

- Do not vendor dataset clips into this project by default under the current service terms.
- Use for local evaluation/research only unless redistribution conditions are re-reviewed.

## Testing implications

Current TTS tests already cover hiding/reveal, replay, review metadata, explicit failure/skip and no cloud dependency. When curated recordings are added, also verify:

- lesson data rejects missing audio paths;
- provenance sidecars exist for third-party audio;
- transcript can be hidden until answer/reveal state;
- replay works offline;
- review questions retain their associated audio;
- app gracefully handles missing/corrupt media;
- accessibility: transcript/caption becomes available after the listening attempt;
- no exercise depends on network access.

## Definition of done for an integrated external asset

An external asset is not “integrated” because the file exists in the repo. It is integrated only when:

1. the licence/provenance record exists;
2. its language quality has been reviewed;
3. it has a clear learning objective;
4. it is wired into a playable exercise;
5. it works offline;
6. tests cover the new behaviour;
7. attribution is visible wherever the licence requires it.

## Current verification

Both A1 stages are playable with 832 course question slots; 48 use original audio-first TTS and 16 are self-assessed spoken retrieval. Stable question identity and validated v1/v2 progress support are implemented. See [BUILD_STATUS.md](../../BUILD_STATUS.md) for tests and the unperformed native build/device gates. No researched recording/corpus is shipped.

## Connected practice and A2.1 implementation (0.7.0)

A2.1 now ships eight practical units, 72 activities, 416 question slots and 32 original stories. The whole course has 216 activities / 1,248 slots. The original A1 payloads/IDs remain unchanged. Curated Conjugation Blanks, 3–20-table practice, hints, shared mastery evidence, Today’s Review and Weak Areas are implemented offline. [The implementation record](../A2_AND_PRACTICE.md) describes progression, unlocks, finite grading and limitations. CEFR/Cervantes/OER sources remain pedagogical references: no third-party text was copied or closely adapted. Future reuse still requires item-level licence/attribution verification. No recording corpus was imported. At that release, A2.2 and B stages remained unavailable.

## Implemented focused-media release (0.8.0)

Listening and Speaking each ship 56 original Friends to Amigos items per A1.1/A1.2/A2.1 stage (168 per mode), in balanced ten-item taught-material sessions. The banks combine 248 newly authored scenarios/prompts and 88 carefully reused original course items with independent stable practice identities/source-question provenance. Mistakes feed existing review and shared topic/outcome evidence; speaking remains self-assessed. Synthetic es-ES TTS, playback-start checks, .75×/1× replay and hidden transcripts/models are retained. First-use guidance has compact repeat-use presentation.

CEFR/Cervantes/OER resources remain pedagogical references only. No external text/audio was copied or closely adapted, so no new third-party attribution entry is required. Large corpora and curated human recordings remain future work; no download, microphone, ASR or cloud grading was added. The four A2.1 corrections and full status are recorded in [the quality report](../LISTENING_SPEAKING_QUALITY.md); [BUILD_STATUS](../../BUILD_STATUS.md) contains actual validation results.

### Implemented language/access amendment (0.9.0)

A1.2/A2.1 now use original Spanish-first task instructions with optional English help. Hint-assisted successes remain correct but provide weaker evidence. Both grammar games are immediately available by selected level (current and earlier), with course sources serving provenance and recommendation weighting rather than access gates. The 35 curated paradigms remain unchanged; 64 original A2.1 sentence contexts extend the preserved 208 A1 game items. No external text/audio was copied, adapted or downloaded. See [the quality record](../SPANISH_FIRST_AND_GRAMMAR_LEVEL.md).

## Historical implementation: A2.2 quality expansion (0.10.0)

At release 0.10.0, A1.1–A2.2 were playable and B stages were planned. The whole course has 288 activities / 1,664 slots / 128 original stories. A2.2 adds 72 activities / 416 slots / eight practical units, original past-background/event and routine-problem scenarios, Spanish-first tasks and optional English support. Listening and Speaking each have 224 items (56 per stage); Conjugations has 336 contexts; curated tables have 55 targets. The previous 216 course activities, 272 game items, 35 table targets and 336 focused items are payload-frozen.

All new writing, stories, distractors and explanations are original Friends to Amigos material. CEFR, Cervantes and documented OER inform design; no third-party passage or exercise was copied/closely adapted. No recording/text corpus was downloaded. Listening remains synthetic es-ES; speaking is self-assessed without recording, microphone permission or ASR. Exact-item attribution rules still apply to any future external asset. See [the A2.2 quality record](../A22_QUALITY_RELEASE.md) and [BUILD_STATUS.md](../../BUILD_STATUS.md) for validation boundaries.
