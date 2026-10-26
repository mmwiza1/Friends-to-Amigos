# Friends to Amigos v1.7.0

Deeper practice, without another activity or course level. Sentence Builder reconstructs more of the Spanish you have reached, Spot the Mistake teaches the same rules through different situations, and Numbers & Time uses deterministic Spanish rather than a small static deck.

## Download the application

When an APK is attached to a GitHub Release, download the Android APK under **Assets**. A source-code ZIP is not an installer. Android 8.0 or newer remains required. This document prepares release notes; it does not mean a GitHub Release has been published.

## Installation and first launch

Update in place when the APK signing key matches the installed app. Progress stays on the device with schema-v2 compatibility. CI debug signing keys can differ: export a backup before any necessary uninstall. Android may ask permission for the installer to install unknown apps. No microphone, account or new runtime network permission is required.

## New in v1.7.0

### Deeper reconstruction and correction

- Sentence Builder draws on existing reached tile exercises, controlled models and short story sentences. Original Spanish and course objectives stay intact; reconstructing one model does not claim that it is the only possible free-writing response.
- Spot the Mistake grows from 51 to 185 explicitly authored contrasts: 30 A1.1, 25 each A1.2/A2.1/A2.2, and 20 each B1.1/B1.2/B2.1/B2.2. Explanations contrast persons, agreement, useful chunks, tense, condition and register.
- Mixed rounds rotate exact models before reusing them, favour meaningful weaknesses and recent course material, and balance concepts. Related challenges can return later in a round after an error, with a different sentence/value.

### Numbers & Time

- Local tested number rules cover 0–9,999, with a lower ceiling at earlier stages, correct accents, cien/ciento and noun agreement.
- Five-minute clock practice includes accessible SVG clocks and normal/quarter/half/menos forms. Dates explicitly use Spain's day/month order and valid non-leap month lengths.
- Realistic prices use integer cents and natural euro/céntimo agreement. Visual, Spanish-to-value and audio-first directions share stable value-based identities.
- Mixed rounds cover available categories and include one listening item; dates and clock/price categories appear only after their course prerequisites. Very new learners start with 0–20.

### Reliability and feedback

- A bounded 300-item recent history, exact-model deduplication and category evidence improve repeat practice without turning one correct answer into mastery.
- Numbers, clock times, prices and dates appear separately in results and weakness evidence. Recommendations can point to the relevant activity without being biased by bank size.
- Old unfinished practice and Review snapshots keep their stored questions and IDs. Required lessons/checkpoints, placement, speaking self-assessment and existing games are unchanged.

## Previous release highlights

### New in v1.6

The Practice hub brought eleven optional activities together while keeping Learn and spaced Review separate. v1.7 deepens three of those activities rather than adding another mode.

## Known issues and limitations

- A fresh learner has a deliberately small safe pool. The full depth grows with reached lessons; 30 A1.1 error scenarios cannot supply 200 distinct A1.1 correction items.
- Reconstruction tests one authored arrangement plus validated alternatives, not arbitrary Spanish syntax. Some story excerpts are short and literal rather than new communicative prompts.
- Dates exclude 29 February because this mode has no year context. Clocks use an explicitly labelled 12-hour display; the formatter also accepts 24-hour input.
- Speech is synthetic, offline voice availability depends on the device, and a playback acknowledgement does not prove acoustic quality. No automatic pronunciation assessment exists.
- Internal content review is not independent native-speaker/educator review. Physical-device validation remains a separate step; see the implementation report for performed automated results.
