# Friends to Amigos design system

This is the mandatory UI contract for all changes from main: features, fixes, refactors and releases. Reuse the WebView architecture and existing components. Material 3 guides decisions; this custom implementation does not claim certification or a native Material Components implementation.

## Current guidance and scope

Reviewed 2026-11-06 against Google's [colour roles](https://m3.material.io/styles/color/the-color-system), [typography](https://m3.material.io/styles/typography/applying-type), [navigation bar](https://m3.material.io/components/navigation-bar/overview), [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive), [Android accessibility](https://developer.android.com/guide/topics/ui/accessibility/apps), [edge-to-edge Views](https://developer.android.com/develop/ui/views/layout/edge-to-edge) and [dynamic colour](https://developer.android.com/develop/ui/views/theming/dynamic-colors). Some Material pages require client JavaScript; official indexed guidance and Android's accessible documentation supplement them. Recheck applicable official guidance when introducing a reusable pattern; do not assume an old release permanently defines Google's current recommendations.

Preserve the teal identity, cream/navy surfaces, mascot, course and eleven Practice activities. Expressive emphasis means clear hierarchy, rounded primary actions, active indicators and meaningful milestones. It does not mean constant motion, new gamification or competing accent colours.

## Tokens and themes

`www/tokens.css` is the sole web colour/type/shape/spacing authority. Both themes must work. Use roles, not hex values or a colour named after one component. The existing aliases remain for compatibility.

| Material role | Project use |
| --- | --- |
| primary / on-primary | Teal learning action with contrasting label; hover/pressed variants |
| primary-container / on-primary-container | Selected navigation and low-emphasis interaction |
| secondary / secondary-container | Terracotta attention; on-secondary-container for normal text |
| tertiary / tertiary-container | Gold milestones; on-tertiary-container for normal text |
| surface-container-low / container / high | Cards, navigation/neutral grouping, popovers |
| on-surface / on-surface-variant | Main and supporting text |
| outline / outline-variant | Input/choice boundaries versus subtle card dividers |
| error / error-container / on-error-container | Genuine mistakes/danger; always accompanied by words/icons/state |
| success / success-surface | Positive feedback, distinct from error |

Keep the four repeating Practice pastel families. Do not invent an activity-specific palette. Native `brand_primary` resources mirror primary in light/dark and are regression-tested. Legacy `brand_coral` is retained for resource compatibility, not used as the dialog accent.

## Typography

Use system fonts; no external downloads. CSS rem values scale with text settings. Role utilities `.type-display`, `.type-headline`, `.type-title`, `.type-body`, `.type-label` are available; existing semantic headings and exercise components already consume these tokens.

| Role | Default size / line height | Use |
| --- | --- | --- |
| display | 38px / 1.15 | Brand/display heading |
| headline | 23px / 1.3 | Screen/section headings |
| title | 18px / 1.4 | Card headings |
| body | 16px / 1.5 | Ordinary learner text |
| label | 14px / 1.35 | Instructions/control support |
| question / reading | 25px / existing 1.3; 20px / existing reading rhythm | Spanish question and story emphasis |

These are Material-inspired roles adapted to the existing narrow learning UI, not a copy of every native sp value. Supporting sizes are body-small 15px, meta 13px, label-small 12px. Navigation has a deliberate 11px scalable label token so five full destination names remain readable at narrow widths/large fonts. No ellipsis or single-letter wrapping. Never shrink lesson text to make a layout pass. Keep clear labels, generous line height and wrapping; complex writing remains multiline.

## Shape, spacing and surfaces

Shape roles: xs 4px, small 12px (fields/status), medium 16px (choices/tiles), large 24px (cards), xl 28px, full 999px (filled/pill buttons and selected navigation), popover 20px (compact anchored dictionary). Circles/clock geometry use percentages where appropriate; they are not new component shapes. Do not add raw px/rem corner radii to component CSS.

Spacing tokens follow 4px steps through 32px. Reuse them. The 22px optical screen margin and some existing compact field/internal offsets are deliberate compatibility exceptions; inset and viewport geometry stay in platform tokens. Never substitute a static space token for a safe area. Cards have subtle outlines/shadows; clickable cards remain real controls with a focus state, not clickable divs with hidden behaviour.

## Components and states

- `.primary`: filled teal, full shape, clear action text, 48px or greater touch area. `.pill`: tonal secondary action. `.plain`/`.back`: text action with a full touch target. Preserve one strongest action per screen.
- Native buttons have at least 48px height/width; controls and choice selectors share `--target-min`. Dictionary inline words are an approved inline-text exception: dotted underline, keyboard focus and separate card selection. Do not enlarge each inline word to a 48px box and break reading.
- Inputs/selectors: labelled, outlined with `--outline`, readable surfaces and visible focus. Errors need text, not only border colour. Keep textarea semantics and existing IME/Enter policy.
- Choices: selected border/container plus radio indicator and aria-checked. Word lookup stays separate from answer selection; no nested buttons.
- Chips: text and aria-pressed/current state, not colour alone. Preserve full keyboard behaviour and selected outline.
- Feedback/results: show the chosen response, natural answer and concise explanation where supported; retain deeper disclosure. Success/error words and semantic state remain. A single round is not proof of mastery.
- Progress: keep native progress semantics/value, teal fill and visible track; no fabricated certainty.
- Dictionary popover: existing dialog/focus restoration/dismissal and viewport positioning; do not replace the tested interaction with a decorative overlay.
- Native/browser confirmation prompts remain platform dialogs. This approved exception avoids a risky custom focus/Back implementation just for shape consistency.
- Web status messages use role=status, polite live announcement and atomic text without stealing focus. Native Toast/TTS errors remain OS-managed.
- Pressed, selected, focus and disabled states must exist. Never remove focus outlines without an equivalent. Hover supplements touch; it is never required. Motion is short and gated by prefers-reduced-motion; no new looping decoration.

## Navigation and Android

Keep **Home · Learn · Practice · Review · Profile**, exactly in order. Internal Games is a persistence-compatible route, not a public label. Use one aria-current=page destination and an icon capsule plus readable label, not colour alone. The navigation container has an 80px minimum with flexible growth for text. No new primary tab or relocation of features.

ViewportTools/native insets continue owning cutouts, system bars and keyboard space. Navigation clears system insets and hides for IME as before; content remains scrollable above primary actions. Preserve current Back/pause/resume/adjustResize logic and system light/dark integration. Target SDK stays 35; SDK upgrades require a separate compatibility change. Do not fake OS bars in README screenshots.

### Dynamic colour decision

Wallpaper-derived colour is **not implemented**. Official DynamicColors targets native Material themes; a custom WebView needs a palette bridge, refresh lifecycle and a tested on-colour/contrast mapping. Applying raw Android accent resources alone is not a complete accessible scheme and could replace the recognisable teal action. No new native UI dependency or preference/schema is justified for this incremental release. Branded light/dark is the reliable fallback on every supported version, including Android 12+. A future opt-in proposal must keep brand identity, both themes, readable role pairs, no wallpaper data export and real-device tests.

## Accessibility and responsive acceptance

WCAG 2.2 AA is the baseline target where applicable, not a certification claim. Text normally needs 4.5:1; meaningful control boundaries/focus need 3:1 against their surface. Do not rely solely on colour. Prefer 48×48 CSS px Android targets, with documented inline-text exceptions. Keep semantic buttons, accessible names, radio arrows/Home/End, tile keyboard operations, modal focus/return and usable reading order.

Validate 320px, Samsung S22/S24/S25, Pixel-class widths, large text, landscape, light/dark, gesture/three-button/cutout and keyboard profiles. Reflow rather than clip. Automated geometry cannot judge comfortable hierarchy; inspect representative final renders and every showcase image. Actual TalkBack, native prompts, OEM text/display scaling, dynamic system bars and TTS need physical-device review in [MANUAL_ACCESSIBILITY.md](MANUAL_ACCESSIBILITY.md).

## Enforcement and examples

Run existing `audit:style`, `audit:architecture`, JS tests, browser checks, showcase gate and Android gates. Style audit checks roles, duplicate declarations, token references, colour literals, shape ownership, important contrast and touch minima. Browser tests check names, current navigation, targets, focus, overflow and the existing full interaction matrix. This is bounded enforcement, not a full CSS/type/accessibility proof. The v1.8 baseline fixture remains immutable; v1.10 intentionally permits increased vertical space/scalable type while retaining horizontal containment and non-shrinking readability.

Good: `background:var(--primary);color:var(--on-primary);border-radius:var(--shape-full)` on a labelled native button.

Bad: a clickable div with `background:#00aa99`, no focus/name, 32px hit area, or a hardcoded light-only override.

New reusable patterns must update this document and add appropriate regression tests. Existing release-note, screenshot freshness, historical snapshot and offline-first contracts remain mandatory. No design change authorises modifying grading or learner data.
