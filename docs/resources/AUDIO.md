# Audio resources

Last reviewed: 2026-10-06

Friends to Amigos now has 48 genuine audio-first comprehension questions across A1.1/A1.2, including every checkpoint. The Spanish transcript is hidden before an attempt, revealed after checking/skip, replayable, and hidden again in review. Content progresses from one familiar detail to alternatives, plans, fit, sequence and reasons. Both choices and short English/Spanish answers are implemented.

Playback uses synthetic Spain Spanish through installed local Android/browser TTS voices, with explicit unavailable-voice/skip support. Sixteen self-assessed spoken retrieval models also use optional TTS. No automatic pronunciation assessment or recording exists. An optional local recording path with TTS fallback prepares later curated audio without populating it. Existing compressed success/failure sounds remain unchanged.

Every new transcript is original Friends to Amigos material. None of the recordings/corpora below has been downloaded or integrated. Curated human speech, exact-item licences and acoustic review remain future work; no large dataset is approved for bulk repository inclusion. See [COURSE_DESIGN.md](../../COURSE_DESIGN.md) and [the current audit](../A1_STABILITY_REPORT.md).

## 1. FSI Spanish courses

- Source index: https://www.fsi-language-courses.org/spanish/
- Mirror/index with original files: https://fsi-languages.yojik.eu/languages/FSI/Spanish/
- Particularly relevant: **Spanish Headstart for Spain** and **Spanish Basic Course**.
- The available collections include student texts plus many hours of dialogue, pronunciation and drill audio. The Basic Course alone is commonly distributed with 55 units and dozens of hours of recordings.

**Why it is useful**

- Audio was made specifically for language instruction rather than ASR research.
- Strong source for minimal-pair/pronunciation work, repetition, substitution drills and functional dialogue patterns.
- Headstart for Spain is especially relevant to this project's European-Spanish orientation.

**Caveats**

- Recordings and scenarios are old. Language, cultural assumptions and pacing should be reviewed before learner-facing use.
- Prefer extracting/adapting small, useful segments rather than importing whole lessons.
- Treat the underlying U.S. government course material as the reusable work; do not copy third-party site branding, descriptions or wrapper content.
- Keep provenance to the specific source file used.

**Recommendation:** high-priority source for A1/A2 pronunciation and dialogue work.

## 2. Multilingual LibriSpeech (MLS) — Spanish

- OpenSLR: https://www.openslr.org/94/
- Hugging Face mirror/card: https://huggingface.co/datasets/facebook/multilingual_librispeech
- Licence: **CC BY 4.0**.
- Spanish is derived from LibriVox read audiobooks and is aligned with text.
- Montreal Forced Aligner's corpus notes identify the Spanish split as **Peninsular Spanish**, with roughly 938 hours and 126 speakers.

**Why it is useful**

- Clear permissive licence.
- A large pool of natural human speech from Spain.
- Aligned transcripts make it technically convenient to build listening comprehension and dictation.
- Multiple speakers make it better than a single TTS voice for training real listening ability.

**Best Friends to Amigos uses**

- 2–12 second listening clips with a transcript revealed after answering.
- Dictation activities.
- Word/phrase recognition in connected speech.
- B1+ reading-and-listening passages.
- Audio pipeline tests using licence-clear fixtures.

**Caveats**

- Audiobook register is not conversational beginner Spanish.
- Do not assume an utterance is A1 just because it is short; vocabulary and syntax need manual grading.
- Attribution must be preserved for redistributed selections.

**Recommendation:** best large-scale source for Peninsular-Spanish listening audio, especially after A1.

## 3. FLEURS — Spanish (`es_419`)

- Dataset: https://huggingface.co/datasets/google/fleurs
- Licence: **CC BY 4.0**.
- Spanish configuration currently exposed as `es_419`, representing Latin-American Spanish rather than Spain-specific Spanish.

**Why it is useful**

- Clean, transcript-aligned multispeaker speech.
- Useful for deliberately exposing learners to Spanish outside the app's default Spain variety.

**Best use**

Introduce it after the learner is comfortable with European Spanish, for exercises labelled clearly as Latin-American Spanish.

**Recommendation:** good secondary accent-exposure source, not the default A1 voice pool.

## 4. Tatoeba audio

- Downloads: https://tatoeba.org/en/downloads
- Reuse guidance: https://en.wiki.tatoeba.org/articles/show/using-the-tatoeba-corpus

Tatoeba has many sentence recordings, but **audio licensing is per recording/contributor**. Its download metadata includes audio ID, contributor, licence and attribution URL. Some recordings have no reuse licence and must not be taken outside Tatoeba.

**Integration rule**

Only import a clip if all of the following are recorded in our provenance data:

1. Tatoeba sentence ID.
2. Audio ID.
3. Contributor username.
4. Explicit licence.
5. Attribution URL.
6. Exact Spanish sentence.

For a project that may one day be publicly or commercially distributed, prefer **CC0 or CC BY** recordings and avoid `NC` material.

**Why it is useful**

- Short sentence-length audio fits micro-lessons extremely well.
- Easy to pair with translations.
- Large variety of speakers and everyday sentences.

**Caveats**

- Community quality varies.
- Sentence quality and audio quality both need human review.
- Accent/region is not reliably implied by the `es` language code.

**Recommendation:** excellent curated sentence-audio pool once a strict import script and review process exist.

## 5. SpanishPod newbie dialogues via Wikimedia/Wikibooks

- Course index: https://en.wikibooks.org/wiki/Spanish_by_Choice
- Example archived dialogue file: https://en.wikibooks.org/wiki/File:SpanishPod_newbie_lesson_A0027_dialogue.ogg

Wikimedia hosts short SpanishPod beginner-dialogue clips. An example file is explicitly licensed **CC BY 3.0**, with attribution to Praxis Language Ltd. Wikibooks notes that a defined range of SpanishPod newbie lessons from 2007–2008 was published under a Creative Commons licence.

**Why it is useful**

- These are actual beginner-course dialogues, so the register is more useful for A1 than audiobook corpora.
- Clips are short and map naturally to comprehension questions.

**Caveats**

- Verify the licence of **every exact media file** before reuse.
- Written Wikibooks material has different/share-alike licensing from individual audio assets.
- Material is older and should be checked for modern usage.

**Recommendation:** strong source for small numbers of curated beginner dialogues.

## 6. CSS10 Spanish

- Repository: https://github.com/Kyubyong/css10
- Spanish data source: LibriVox audiobooks with aligned text.
- Repository licence: **Apache 2.0**; open-speech catalogues also identify the underlying CSS10 speech data as public-domain-sourced.

**Why it is useful**

- Roughly 24 hours of a consistent Spanish male reader.
- Clean alignment makes it useful for audio tooling, TTS research and listening fixtures.

**Caveats**

- Single speaker.
- Literary, historical source texts rather than everyday conversation.
- Not a sensible foundation for A1 content.

**Recommendation:** engineering/testing and later-level literary listening, not core beginner lessons.

## 7. Mozilla Common Voice

- Dataset catalogue: https://commonvoice.mozilla.org/dav/datasets
- Terms: https://commonvoice.mozilla.org/dav/terms
- Spanish scripted data is currently available under **CC0 1.0**.

Common Voice is attractive because it contains huge amounts of varied human speech. However, current Common Voice terms explicitly ask users not to post, distribute or mirror the dataset, in whole or in part, on other platforms/services, and to have others access it through Mozilla Data Collective.

**Friends to Amigos policy:** use Common Voice for local experiments, evaluation or research where useful, but **do not vendor Common Voice clips into this repository or shipped app by default**. Prefer MLS, FSI, Tatoeba-permitted clips or other sources with clearer redistribution workflows for learner-facing assets.

## Audio selection quality bar

Any shipped human recording should pass all of these checks:

- Correct transcript.
- Native or clearly proficient speaker.
- Accent/region labelled where known.
- No clipped words, background music or disruptive noise.
- Pedagogically appropriate speed for the exercise.
- Vocabulary/grammar manually checked against the target level.
- Licence verified at the **individual asset** level.
- Attribution and modification history stored with the asset.

For A1, prefer short conversational recordings. For B1+, progressively introduce more natural speed, longer turns, inference and accent variation.
