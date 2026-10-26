# Permanent GitHub showcase release gate

Base main: `37761ab9e8375f6476dbb950f83918f589b8d5f2`. This is a repository/capture-process correction for the current **1.7.0 / Android 18 UI**, not an app-version or curriculum expansion.

## Implementation

AGENTS.md retains release-note requirements and adds a permanent showcase gate. SCREENSHOT_POLICY.md documents source/version provenance, 10–15 meaningful images, regeneration versus unchanged-UI retention, actual visible tab names, and honest browser-simulation claims. The capture pass is separate from all existing native-inset/keyboard stress scenarios: zero synthetic system bars, real CSS/actions, stable seeded fixtures, reduced motion, settled fonts, semantic scroll anchors and complete card/control boundaries. Profile is captured through its Vocabulary card with the real opaque navigation flush to the usable viewport bottom.

The schema-v1 manifest binds current package/Android versions, generated timestamp, actual capture commit (or null), deterministic UI/source fingerprint, image bytes/dimensions, per-screen metadata and explicit manual review. It replaces a hard-coded version/run test with a reusable validator and negative regression coverage. Documentation-only/internal algorithm changes do not mandate pixel changes. Version-only retention requires unchanged UI inputs and a recorded reason; an actual UI-input change requires new capture.

CI explicitly validates screenshots in checks before the dependent Android build. npm run check includes the validator; check:release preserves the existing audits/tests/browser checks. The regular browser suite keeps all 17 profiles and adds the clean public capture and stronger visible-label/Home/Profile checks.

## Current image review and performed validation

Pending current capture, inspection and complete validation. No result or manual/physical-device review is claimed yet. This section will be replaced by the actual capture/review record before main promotion.
