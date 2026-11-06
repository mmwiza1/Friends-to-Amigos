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

All previous test cases and immutable fixtures remain. The older dictionary navigation comparison now asserts that aria-current moves Home → Profile while preserving every destination/badge; its equality comparison excludes only that intentional current state. The frozen v1.8 orchestration comparison normalises only the two newly added navigation accessibility attributes; state, quiz, progress, diagnostics and all other markup remain compared. Frozen CSS comparisons intentionally change from pixel identity to horizontal containment (tile controls explicitly gain up to four pixels for the 48px target) and non-shrinking vertical/type readability, with the explicit 80px navigation exception. New Material checks enforce actual control size, accessible names, focus, current destination and overflow. Increased touch assertions replace 44px expectations with 48px; contrast coverage increases from 38 to 50 pairs. This is an intentional UI change, not relaxation of learning/snapshot requirements.

## Android and dynamic colour

Native day/night/API-31 accents now match the web primary; splash/background/system-icon appearance is retained. Target SDK 35, minSdk 26, Back, IME, edge-to-edge/cutout and pause/resume logic are unchanged. Wallpaper-derived colour is deferred: raw OS accents are not a complete contrast-safe WebView scheme; a native palette bridge/lifecycle/preferences and real-device validation would outweigh this incremental benefit. No dynamic-colour capability is claimed.

## Validation

Pending focused/full JS, browser, final showcase review/adoption and Android build/lint/unit/asset checks. Local browser socket restrictions require the established hosted Chromium/Android environment. No physical-device, TalkBack, native/educator validation or Material certification is claimed.

## Recorded final showcase visual acceptance

All fifteen exact PNGs were individually inspected by the agent from final web source commit `3bc063eba9d9587548632e1824d3708735a4ddb1`, run 42218488931. The new pill actions, legible normal-weight descriptions, outlined choices/fields, active destination capsule, light/dark surfaces, word popup, story reading, feedback and completion were approved. No clipping, horizontal overflow, navigation overlap, fake OS gaps or misleading framing was observed. All images were freshly captured; none was relabelled from v1.9. These are clean Chromium simulations at 384 CSS px / DPR 1 and semantic recorded heights, not physical-device images. Capture passed 191 semantic/geometry assertions.

<!-- showcase-review: 6a711d4547181120b6fa2783104744871b50678b365be891a1e388500ab5c91a -->

| Image | Theme | Viewport | Reviewed SHA-256 |
| --- | --- | --- | --- |
| `home.png` | dark | 384 × 1059 | `0902aea98d43b2ee0f8e1a1bbb8432379facda79be465646a0b9c9c9ef3aa9c6` |
| `learn.png` | light | 384 × 887 | `db3f0b41727f12529aca9c65e030f6e1a0cff60a429c627a2e1586e45e01542d` |
| `beginner.png` | light | 384 × 915 | `aeb30c56509a9bb9154a59712b6919accd8a3f8f98543375a50ea995d8fb174c` |
| `cloze.png` | dark | 384 × 1490 | `c2a83c13184a1756dfb87d19f131ba67503c850bda0592d85311e7ef6128ece5` |
| `sentence-building.png` | light | 384 × 966 | `c87f421e3833365bb740067e61bed9bbf1797948d68ae69ea3760c856d3de9a6` |
| `dictionary.png` | light | 384 × 980 | `cf6e99d747eb7e76120a04d6892a69b2f994c90b5d238455cd6d6fbc3422848d` |
| `story.png` | light | 384 × 1287 | `54c78069f9dfe3119a2c1e2ee43c59a77e57d4dea1106afebcf54703046f2948` |
| `feedback.png` | dark | 384 × 1500 | `873e7ec0370da846ed2bfd01122150f271a5c6f2d36967ed3f6ddd4e57bf607a` |
| `games.png` | light | 384 × 988 | `adc107855eafcb62d47fe02a7ed88961781c0f6eb6fdd980763a11376b8df12c` |
| `conjugations.png` | dark | 384 × 767 | `5ea2f825187fc12081d69e443d537038756484909be79bf1bc0ffb7f73b645f8` |
| `review.png` | light | 384 × 890 | `9b647aa3273b65fd3096a52b4c607ce768c7738a345805429b78888df1c25598` |
| `profile.png` | dark | 384 × 1151 | `d5997260a945edefc6e97ab221a9da99eb27a27aeadc8dc18454ee6f31d6b486` |
| `saved-words.png` | light | 384 × 745 | `14e671922406062d5f3906a909a4aa80512fefda8312a05f4d3e93e66a492012` |
| `recommendations.png` | light | 384 × 957 | `e7653abe84078abcdcb019457b4933ae44a6600d5330649814a41949ca19d496` |
| `lesson-complete.png` | dark | 384 × 909 | `7ed19837465411ed4c65998006f2ba06cbe0ef5bb82ac61de7059b1e3d5a3561` |
