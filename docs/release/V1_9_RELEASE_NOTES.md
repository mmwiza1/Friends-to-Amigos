# Friends to Amigos v1.9.0

A foundations release for the existing A1.1–B2.2 experience. The interface keeps its familiar structure with clearer teal actions, consistent Practice pastels and readable semantic colours. Underneath, explicit controllers and state boundaries make future maintenance safer.

The same eleven Practice activities, course outcomes, offline dictionary, Review, stories and conservative writing/speaking systems remain. No new level, game, account or cloud feature was added.

## Download the application

When this version is published as a GitHub Release, download its attached Android APK under **Assets**. CI also provides a debug test APK; a successful build does not imply physical-device validation. Minimum Android remains 8.0 / API 26.

## Installation and first launch

Progress keeps schema v2 and the existing storage key. No account or microphone permission is needed. Export a progress backup before changing installations; if Android requires uninstalling because debug signing differs, preserve that backup first. Diagnostics remain in their separate optional local store, with explicit pause/reset/export controls.

## New in v1.9.0

### Visual consistency and accessibility

- A slightly stronger primary teal makes learning actions easier to identify across lessons and Practice.
- A shared light/dark token system keeps cream/navy surfaces, terracotta attention, restrained gold milestones and red for genuine errors/danger.
- Practice uses four repeating pastel families rather than unrelated activity colours. Existing layout, navigation and touch/keyboard behaviour are preserved.
- Semantic contrast checks and before/after browser layout comparisons supplement the existing mobile/accessibility matrix.

### Reliability and maintainability

- Lesson/quiz/Practice coordination, navigation/Back, Profile/data transfer, diagnostics and DOM/native lifecycle now have explicit controller responsibilities.
- Imported/reset progress remains a single authoritative state; controllers receive live dependencies rather than stale copies.
- Diagnostics still observe locally and cannot drive mastery, Review or recommendations. Event mounting is idempotent.
- Content, domain, controller, view and platform boundaries are documented and checked. The global-script system remains; ES-module/framework migration is deferred.
- Existing A1 introduction models now come from the canonical linguistic registry. Historical attempts are never regenerated from changed sources.

### Content and bug fixes

- Three stale B-level glossary entries now explain expressions actually used in their passages.
- Glossary validation recognises visible title vocabulary and valid discontinuous phrases, retaining correct learner support instead of rewriting it automatically.
- Superseded CSS definitions and obsolete game-card styles were consolidated; final-source showcase screenshots are required by the existing release gate.
- Redundant API-26 launcher resource qualification is removed while keeping the same adaptive icons and API-33 monochrome overrides.

## Previous release highlights

### New in v1.8

Meaning-first support across A1.1, simpler beginner Practice discovery, reached-source recommendations, surgical Spanish polish and optional private diagnostics.

## Known issues and limitations

Browser/inset/keyboard simulations are not physical Android or TalkBack testing. Automated/agent review is not independent native-speaker or educator approval. The app does not grade pronunciation or arbitrary prose, and CEFR certification is not claimed. Existing Android warnings that require target-platform, backup-policy or launcher-art changes are retained rather than suppressed or changed speculatively. External recommendation links need connectivity; core learning remains offline.
