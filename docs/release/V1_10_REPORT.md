# v1.10 Material 3 implementation and acceptance

Starting main: `b0c46adf5bf665d77abdf481ec1367c601884fbd`, app 1.9.0 / Android 20. Selected release: 1.10.0 / Android 21. Main/worktree inspected clean; latest remote confirmed through the GitHub connector. No framework, Compose, runtime dependency, educational-content/assessment change or learner-schema change.

## Gap assessment and before/after matrix

| Area | v1.9 baseline | Implemented v1.10 |
| --- | --- | --- |
| Colour | Semantic teal light/dark already present | Preserved; added Material container/on-colour/outline role aliases and measured pair checks |
| Type | Many scattered px/rem values | Central display/headline/title/body/label and learning/support roles; scalable headings and supporting text |
| Shapes/spacing | Numerous literal radii, repeated spacing | Shared role tokens; filled pill actions, card/choice/field/popover distinction; retained optical/inset exceptions |
| Navigation | Five correct labels; colour/bold selection | Same routes/destinations with current-page semantics and 32px icon capsule inside an 80px-minimum bar |
| Touch/focus | Many 44px controls | Shared 48px minimum and visible outlines; inline dictionary-word exception documented |
| Fields | Subtle borders | Higher-contrast outline role, retained labels and keyboard policy |
| Status | Visual web toast | Polite atomic status announcement without focus movement |
| Native theme | Accent resource matched background | Branded teal accent in day/night and API-31 themes; no inset/lifecycle/SDK changes |
| Dynamic colour | Not implemented | Investigated and explicitly deferred; no unverified palette bridge |
| Governance | Colour audit + architecture/showcase gates | Mandatory design contract in AGENTS; undefined-role, shared-shape, touch and role/contrast checks |

The [design contract](../DESIGN_SYSTEM.md) records current official sources, implementation patterns, exceptions and future obligations. Expressive use is restrained hierarchy/shape/state emphasis; existing reduced-motion gating remains. No constant animation or unrelated feature was introduced.

## Coverage and compatibility

Shared changes cover Home, Learn, all lesson/story/listening/speaking/writing surfaces, all eleven Practice modes, Review/weak areas, Profile, dictionary/Saved Words, recommendations, completion, feedback and empty states. Existing view/domain/controller ownership remains. Inline dictionary lookup retains separate selection and focus behaviour. Course/SRS/Practice/placement/mastery/Saved Words/schema v2 and private diagnostics contracts are unchanged.

All previous test cases and immutable fixtures remain. The frozen v1.8 orchestration comparison normalises only the two newly added navigation accessibility attributes; state, quiz, progress, diagnostics and all other markup remain compared. Frozen CSS comparisons intentionally change from pixel identity to horizontal containment (tile controls explicitly gain up to four pixels for the 48px target) and non-shrinking vertical/type readability, with the explicit 80px navigation exception. New Material checks enforce actual control size, accessible names, focus, current destination and overflow. Increased touch assertions replace 44px expectations with 48px; contrast coverage increases from 38 to 50 pairs. This is an intentional UI change, not relaxation of learning/snapshot requirements.

## Android and dynamic colour

Native day/night/API-31 accents now match the web primary; splash/background/system-icon appearance is retained. Target SDK 35, minSdk 26, Back, IME, edge-to-edge/cutout and pause/resume logic are unchanged. Wallpaper-derived colour is deferred: raw OS accents are not a complete contrast-safe WebView scheme; a native palette bridge/lifecycle/preferences and real-device validation would outweigh this incremental benefit. No dynamic-colour capability is claimed.

## Validation

Pending focused/full JS, browser, final showcase review/adoption and Android build/lint/unit/asset checks. Local browser socket restrictions require the established hosted Chromium/Android environment. No physical-device, TalkBack, native/educator validation or Material certification is claimed.
