# Resource integration guide

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

The documented CEFR/Cervantes scope and OER pedagogical recommendations now inform original A1.1 material: eight can-do units, 32 contextual stories, short Spanish recall/production, dialogue and transfer tasks, teaching feedback, glossary/rereading support, and limited regional notes. Lesson metadata connects each activity to its unit outcome and an original-authorship reference record. Stage metadata defines separate A1.1–B2.2 targets; A1.1 and A1.2 are playable. Tests protect stable IDs and historical progress snapshots. No third-party exercise was imported or closely adapted.

### Phase 2 — real listening MVP: future

Add a new question model that can reference a local audio asset and optionally hide/reveal its transcript. Start with a very small hand-curated set (for example 10–20 clips), not a corpus import.

Ideal exercise modes:

- listen and choose meaning;
- listen and choose the phrase heard;
- listen and type one missing word;
- dictation;
- listen to dialogue, then answer an inference question;
- replay at normal speed rather than artificially slowing every clip.

### Phase 3 — curated audio pool: future

Create a lightweight import process for Tatoeba/MLS/other permitted sources that emits both the audio asset and its provenance sidecar. Reject items without an allowed licence automatically.

### Phase 4 — accent exposure: future

After the Spain-first foundation is stable, intentionally add labelled Latin-American speakers and tasks. FLEURS can help here, alongside individually licensed short recordings.

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

When recorded listening is added, tests should cover:

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

## A1.2 implementation update

A1.2 is now playable: eight practical units, 72 activities, 32 original stories and 392 question slots. Its connected-language progression covers preferences, invitations, future plans, clothes shopping, home and reflexive routines. `www/a12.js` and `www/a12-stories.js` follow the same original-authorship/reference policy as A1.1. No third-party wording or recording was imported or closely adapted. A2.1–B2.2 remain planned; curated human listening and exact-item asset attribution remain future work. All 54 automated tests pass, with preserved A1.1 content, saved snapshots and export/import.
