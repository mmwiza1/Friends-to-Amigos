# GitHub application showcase policy

**The README showcase should allow someone visiting the repository to understand what they would actually install.** It is a release artefact, not an archive or a device-testing claim.

## Content and location

Publish approximately **10–15 strong, representative images** under `docs/screenshots/`, in a compact README grid. Show the actual current product: Home, Learn, supported learning, controlled production, dictionary-before-answer, reading, teaching feedback, Practice, a useful practice activity, Review, Profile, Saved Words, recommendations and completion where useful. Prefer a meaningful image over filling a quota. The current capture plan contains fifteen; retired images are removed on adoption and remain available in Git history.

Learner-visible navigation is **Home · Learn · Practice · Review · Profile**. `Games` remains an internal compatibility route and a section inside Practice, not a public tab. Tests inspect rendered button text without decorative icons or badge counts.

## Generation workflow

1. Finish and validate the intended UI. Read AGENTS.md and the release-note template.
2. Run `npm run capture:showcase` (requires Chromium) or the existing CI browser job. The regular browser suite retains all native-inset/keyboard stress profiles and also captures the public showcase separately. Candidate PNGs and `manifest.json` are written to `browser-reports/showcase/`.
3. Inspect **every** candidate using the [release checklist](RELEASE_SHOWCASE_CHECKLIST.md). Download CI's browser artefact if local Chromium is unavailable. Do not treat passing bridge calls, snapshots or pixel hashes as physical-device or acoustic testing.
4. Record the UI fingerprint, version, profiles, all filenames, acceptance results and limitations in `docs/release/NAME.md`, including `<!-- showcase-review: SHA256 -->` for the candidate fingerprint.
5. Adopt only those reviewed bytes: `npm run showcase:adopt -- --from browser-reports/showcase --reviewer "NAME / agent" --review-report docs/release/NAME.md`. An external absolute candidate directory is also accepted. Adoption verifies the candidate's current UI fingerprint, image hashes and review record; copies the original PNGs, updates the manifest/README grid and removes retired PNGs. It does not edit pixels.
6. Run `npm run check:screenshots`, then `npm run check:release` and Android validation. Do not promote main until all gates pass. If capture-relevant code changes while fixing failures, capture/review again.

## Clean capture, without fake Android chrome

Public images are **usable browser app viewports**, not simulated Samsung status/navigation bars. The separate showcase pass uses zero system insets, no keyboard, scale 1, normal text, reduced motion, settled fonts and explicit light/dark themes. Real app CSS, actual actions, real content and illustrative local learner data are used. No product CSS is injected to hide cards or alter navigation.

The viewport ends at a meaningful complete card/control boundary, with the real fixed app navigation flush to its bottom when present. Long activities may use a documented semantic scroll anchor such as feedback or the question. Never capture a full scrolling page with a fixed navigation bar marooned in its middle. Do not expose page content in an artificial blank system-navigation band. Do not fake Samsung UI, paste a fake status bar, erase clipped content, use arbitrary scroll positions, or capture mid-animation. A tall responsive browser viewport is labelled with its actual dimensions; it is not claimed as a specific physical phone.

Stress captures with cutouts, keyboard overlap or simulated native system spaces remain valuable test evidence in `browser-reports/`, but are not automatically published as showcase PNGs.

## Manifest / provenance

`docs/screenshots/manifest.json` schemaVersion **1** records:

- `appVersion`, `androidVersionCode`, actual `generatedAt`, nullable `sourceCommit` and optional CI `validationRun`;
- `captureMode`, exact learner-visible `navigationLabels`, `screenshotCount`;
- `sourceFingerprint`: SHA-256 of an ordered source-file/hash map covering UI renderers, styles, navigation, content and the capture recipes/tool;
- per-image filename, screen, description, theme, actual viewport/profile/insets, simulation flag, PNG SHA-256, first-generation/refreshed/reviewed-for versions and observed layout checks;
- approved manual-review author/date, release version, matching fingerprint and a repository review report.

The deterministic **release version + UI source fingerprint** is authoritative for freshness. A CI capture records the actual `GITHUB_SHA` that rendered it. Local captures without trustworthy commit provenance record `sourceCommit: null`. Never invent the future final commit SHA. A later documentation/manifest-only commit legitimately has the same captured UI fingerprint. A different UI fingerprint cannot be adopted as if it had been captured.

## Regeneration and legitimate retention

Regenerate affected screens whenever Home, Learn, Practice, Review, Profile, lesson rendering, navigation, colours/cards, dictionary, recommendations, major interactions or their displayed content materially changes. The default plan regenerates all fifteen together, preventing partial stale galleries. Capture source inputs automatically include `www` content/assets and rendering files plus the recipe/tool. The small documented exemption list in `scripts/showcase/config.cjs` contains internal algorithms/storage; moving visible rendering or labels there requires updating that list. Do not use an exemption to conceal a material UI change.

A documentation-only change with the same app version and UI fingerprint needs no new image. Backend/internal changes that leave showcased UI inputs unchanged also need no binary change. For a version-only/internal release, inspect the existing images against the unchanged actual UI and record why retention is valid. Then use `npm run showcase:adopt -- --retain-reason "Specific unchanged-UI reason..." --reviewer "NAME" --review-report docs/release/NAME.md`. This requires the **unchanged** captured fingerprint. It preserves original generation date/commit and refresh version, updates the reviewed-for release, and records the reason. It never pretends old images were newly captured. A changed UI fingerprint requires capture, not a retention override.

Byte-identical fresh recaptures are legitimate: copying a newly rendered PNG may create no Git binary diff. Freshness is proven by provenance/fingerprints and the review record, not by demanding every image change bytes.

## Acceptance and CI

Images must have readable text, correct themes/visible navigation, coherent data, useful content, sensible scroll positions, settled motion and no horizontal overflow, clipping, modal overlap or fake system-bar artefacts. Main-page cards and primary controls must clear opaque app navigation. Refer to the checklist for visual judgement.

`npm run check:screenshots` fails with actionable errors for stale versions/prose, invalid/missing/duplicate references, out-of-policy counts, malformed/blank/corrupt PNGs, implausible dimensions, changed UI inputs, wrong navigation metadata, failed capture geometry, missing/stale review or an unexplained retained image. `npm run check` includes it; `npm run check:release` includes the full local gate. `.github/workflows/android.yml` explicitly runs it in `checks`, and Android `build` depends on checks succeeding. Browser checks assert actual visible navigation and Home/Profile semantics/order/geometry; capture separately asserts clean viewport edges and card/control boundaries.

CI cannot prove artistic quality, honesty of an authored manual review, every Spanish interpretation, or physical-device behaviour. Do not reduce manual review to a checkbox or claim these capabilities.

## Release reporting

Always report: screenshot count and manifest app version; regenerated/retained filenames and reasons; profiles/themes/simulation status; automated validator result; manual review result/report; exact browser/native checks and remaining judgement/device limitations. A release is incomplete until the showcase gate and visual review pass.
