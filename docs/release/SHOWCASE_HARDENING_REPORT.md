# Permanent GitHub showcase release gate

Base main: `37761ab9e8375f6476dbb950f83918f589b8d5f2`. This is a repository/capture-process correction for the current **1.7.0 / Android 18 UI**, not an app-version or curriculum expansion.

## Implementation

AGENTS.md retains release-note requirements and adds a permanent showcase gate. SCREENSHOT_POLICY.md documents source/version provenance, 10–15 meaningful images, regeneration versus unchanged-UI retention, actual visible tab names, and honest browser-simulation claims. The capture pass is separate from all existing native-inset/keyboard stress scenarios: zero synthetic system bars, real CSS/actions, stable seeded fixtures, reduced motion, settled fonts, semantic scroll anchors and complete card/control boundaries. Profile is captured through its Vocabulary card with the real opaque navigation flush to the usable viewport bottom.

The schema-v1 manifest binds current package/Android versions, generated timestamp, actual capture commit (or null), deterministic UI/source fingerprint, image bytes/dimensions, per-screen metadata and explicit manual review. It replaces a hard-coded version/run test with a reusable validator and negative regression coverage. Documentation-only/internal algorithm changes do not mandate pixel changes. Version-only retention requires unchanged UI inputs and a recorded reason; an actual UI-input change requires new capture.

CI explicitly validates screenshots in checks before the dependent Android build. npm run check includes the validator; check:release preserves the existing audits/tests/browser checks. The regular browser suite keeps all 17 profiles and adds the clean public capture and stronger visible-label/Home/Profile checks.

## Current image review and performed validation

All 15 images were regenerated from the current 1.7.0 / Android 18 UI. No old release PNG was retained. Capture source: `f2e469c0a8093e8defb9e69524b78ff02a121142`, hosted workflow `40423162466`. The deterministic fingerprint below binds the actual UI and capture inputs; later documentation/validator-only commits do not pretend to be the capture commit.

<!-- showcase-review: 432935d3c942e69813cb821b67b6e7fc6f6063a3d39f4ccfc204b0827769415e -->

Agent visual inspection approved every complete image: readable text, meaningful scenario, current visible navigation where present, complete primary controls/cards, sensible framing, no horizontal overflow, clipping, keyboard overlap or fake system-bar strip. The initial candidate's dictionary/feedback/completion framing was rejected and recaptured; these final images were inspected again. Profile ends after the complete Vocabulary card with the real navigation flush to the viewport edge. Home and Saved Words matched already inspected candidate bytes exactly. All other final images were individually inspected.

These are Chromium browser simulations at 384 CSS px / DPR 1, light and dark themes, with per-screen viewport heights chosen at complete content boundaries. No Samsung system UI, physical-device, emulator, acoustic TTS or external human review is claimed. Illustration data is seeded; it does not claim actual learner performance. Capture passed 176 semantic/geometry assertions.

| Image | Theme | Viewport | Reviewed PNG SHA-256 |
| --- | --- | --- | --- |
| `home.png` | dark | 384 × 1012 | `c50f945b142514dff7079ae4cd6dda8c6b0c42322e214909d084ef47ded855ae` |
| `learn.png` | light | 384 × 839 | `2f571af6abc3913fda73a64d48194febdfc5d923f81c5a2386c9acf7634bf7ff` |
| `beginner.png` | light | 384 × 888 | `f40038c790e68c3220b2071383a591f6c93fb51514df33de92b6599b34807204` |
| `cloze.png` | dark | 384 × 1421 | `46624abbdc108ef8b855526fc715688fff276a62ec4d6910197d63e9de78eb52` |
| `sentence-building.png` | light | 384 × 943 | `ee9e8a347ec133eb55332cb6518a43cbc2bcce1ebbcaa8727e751cb48c2f0968` |
| `dictionary.png` | light | 384 × 953 | `ed0f22c77951699588050f4dca6cd61bc26bc062c949d746f650c6eac8786279` |
| `story.png` | light | 384 × 1271 | `32370db568e10d16319cf3bed3f6a8292d7ea91a8eec64278bfd9c075e84d793` |
| `feedback.png` | dark | 384 × 1439 | `dd8cfa195cdd9b8d3052898f3b659c42aba2aa971dbe260a52d26e424a2a719f` |
| `games.png` | light | 384 × 982 | `cff609c6f51c15d94acba7b3407aec586c4a7e78a649a3463ded5f08e44223ce` |
| `conjugations.png` | dark | 384 × 743 | `fe1bcc77a25c18d80e2682d43ce36baaf6863cb2836e3f4aed170a8a488d485d` |
| `review.png` | light | 384 × 862 | `89b661222006fe9de3b18416ef13db60ef4284bc4c4618cf6d4fe824d1fa1543` |
| `profile.png` | dark | 384 × 1099 | `a06bc340077495b9c4036d2cc6dd7d396d3f9ab830b2da5f930dfe40a8293539` |
| `saved-words.png` | light | 384 × 703 | `6769b5d51beea16c2c8bc1118469ad9abb43b6fa18f4a6782d6bacb007740b33` |
| `recommendations.png` | light | 384 × 925 | `fa1386ae41113956e67508fb489e2a401bc5f57d563cd395964eb5fba48c2100` |
| `lesson-complete.png` | dark | 384 × 871 | `f06442e86341d44aced6432de7ce28e2410c87a9e66a0ee3c72ee655455c5d72` |

## Full validation

Pending the complete gate against the adopted manifest; results will be recorded before main promotion.
