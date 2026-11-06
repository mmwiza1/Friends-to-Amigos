# Friends to Amigos v1.10.0

A Material 3-inspired visual consistency release for the existing A1.1–B2.2 app. Teal identity, mascot and the familiar five-tab journey remain, with clearer selection, larger controls, scalable text and consistent shapes.

All eleven Practice activities, offline content, dictionary, historical progress and conservative writing/speaking behaviour remain. No new learning mode, account or cloud service was added.

## Download the application

When published as a GitHub Release, download the attached Android APK under **Assets**. The validated CI debug APK is also suitable for testing. Minimum Android remains 8.0 / API 26.

## Installation and first launch

Progress retains schema v2 and the existing key; no migration or new permission is required. Keep an exported backup when changing installations. If Android rejects a debug APK because its signing key differs, preserve that backup before uninstalling. No account or downloaded font is needed.

## New in v1.10.0

### Material design consistency

- Shared light/dark colour roles, scalable typography and shape/spacing tokens preserve the teal-led identity.
- Rounded filled actions, tonal secondary controls, readable outlines and distinct feedback surfaces work across lessons, Practice, Review and Profile.
- Five-tab navigation gains an active icon capsule and programmatic current-page state without changing destinations.

### Accessibility and Android

- Primary and ordinary controls share a 48px touch minimum; inline dictionary words retain their reading-friendly exception.
- Focus, selected, pressed and disabled states remain explicit. Web status messages announce politely without stealing focus.
- Native confirmation accents now use readable teal in both themes, including Android 12+ resources. Existing keyboard, Back and edge-to-edge handling is preserved.

### Permanent quality standards

- A mandatory repository design contract governs future UI development and releases.
- Existing audits now check more contrast pairs, missing roles, undefined tokens, shared shapes and touch minima. Real-browser checks cover navigation semantics, accessible names and sizing alongside all existing flows.
- Final-source showcase images and release validation remain required.

### Validated source build

The full source gate passed 2,242 JavaScript tests, 17 browser layouts / 60,645 assertions, Android build and 15 JVM tests. Lint has zero errors and the same twelve existing warnings. All 93 packaged web assets match source; all fifteen current showcase images were visually reviewed. The release report links the evidence and distinguishes simulations from pending physical-device/TalkBack checks.

## Previous release highlights

### New in v1.9

Explicit controllers, state/dependency boundaries, historical equivalence coverage and semantic colour foundations for safer maintenance.

## Known issues and limitations

This is a custom Material-inspired WebView implementation, not Material certification. Wallpaper-derived dynamic colour is deferred; branded light/dark colours work offline. Browser and JVM checks do not prove physical-device/TalkBack compliance. Real Android/OEM font, native prompt and assistive-technology review remain required. Existing Android warnings are reported accurately in the build report. Speaking remains self-assessed and arbitrary prose is not automatically graded.
