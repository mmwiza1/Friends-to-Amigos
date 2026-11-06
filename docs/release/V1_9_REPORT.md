# v1.9 foundations implementation report

Starting main: `0820c40f981531b4c923c68c40fada6d84e1ccae`, app 1.8.0 / Android 19. Selected release: **1.9.0 / Android 20**. Remote main was inspected through the GitHub connector because the local Git proxy endpoint is unavailable. Existing work was preserved. No new learner activity, stage, account/backend, cloud/AI/ASR, microphone or gamification system.

## Architecture and state

The [architecture contract](../ARCHITECTURE.md) records the pre-change map, module responsibilities, authoritative state, dependency direction, loading order, code placement and remaining debt. App.js began at 59,509 bytes / 238 dense lines. Its final size is **14,818 bytes / 143 lines** (about 75% fewer bytes); it now owns bootstrap, live state/dependency wiring and top-level render/start, with thin compatibility hooks.

Ten controller/support modules cover capability wiring, navigation/Back, lesson/Today, quiz, Practice, Profile, data transfer, diagnostics, input and lifecycle. Completion markup is a view; recommendation policy is a pure domain separate from hub markup. Factories receive only declared live capabilities; no duplicated progress store. Import/reset replacements propagate through getters. Diagnostics receive only a narrow observation context and their own bounded store; they do not drive learning. Input/lifecycle mount/dispose is explicit and idempotent.

No schema bump, ES-module migration, framework, runtime npm dependency or broad folder shuffle occurred. Existing domain algorithms and snapshot/save boundaries are retained. A small layer/capability audit protects actual boundaries, not arbitrary line counts.

## Visual foundation

`tokens.css` defines semantic light/dark colours. Primary teal is modestly stronger; terracotta supports attention, gold supports milestones, success is distinct from destructive/error red, and Practice repeats mint/pale blue/pale gold/pale terracotta. Primary Practice buttons share teal instead of the former separate blue CTA system. CSS retains layout/native-inset ownership and compatibility aliases.

The first cleanup removed 118 superseded declarations/dead rules and merged 63 repeated selectors. Dead pre-hub games-grid/game-primary/grammar-picker styles were removed after checking consumers. Important colour pairs are tested against current tokens; this found and fixed insufficient attention/milestone contrast in the light theme. The current 38 important light/dark contrast pairs pass; the minimum text-pair ratio is 4.79:1. Six additional dead conditional properties were removed after baseline layout comparisons exposed the old narrow-button override. A final contextual pass removed 41 redundant component dark-theme declarations, normalised legacy aliases in component styles and corrected the attention-surface role; all theme colours now come from tokens.css. This preserves the original effective sizes instead of loosening the comparison. Injected Window services preserve their native receiver, protected by regression tests. Full rendered matrix totals are recorded after the hosted gate.

## Canonical content and editorial queue

Twenty-six existing A1 introduction models moved unchanged from consolidation.js into canonical records with stable source question/activity, intended task and actual editorial status. The fourteen starter records remain, for 40 bounded records. No new practice content was added. Consolidation remains transitional and compatibility-aware, not a future content dumping ground.

The ten v1.8 flags were inspected against actual title, passage and glossary. Six are valid visible title vocabulary (`el grupo`, `distintos`, `tamaños`, `sin prisa`, `turno`, `equivocada`); one is the valid ordered discontinuous `dejar… para otro día`. They remain unchanged. Three genuinely stale B glosses were corrected at canonical source:

| Activity | Before | After |
| --- | --- | --- |
| b21u3story3 | desde mi punto de vista / from my point of view | acortarla / shorten it |
| b22u5story0 | desde mi punto de vista / from my point of view | a cualquier coste / at any cost |
| b22u7story1 | desde mi punto de vista / from my point of view | extensión voluntaria / optional extension |

Passages, teaching targets, IDs/order and valid answers are unchanged. Shared checkpoint readings receive the same glossary correction. [Exact before/after provenance](v19-editorial-corrections.json) and a strict **developer-only** inverse preserve historical content audits; storage never loads that inverse or live amendments. Old saved passages/glossaries retain their own values. Language audit now recognises title/discontinuous support without blessing missing/reversed fragments. Internal contextual review is not native approval.

## Test architecture and equivalence

All 117 original app test bodies are preserved, grouped into course (50), Practice (18), platform (37) and data (12), with scenario helpers. Browser CDP transport, 17 profiles, interaction assertions and stress-capture recipes are separated without deleting cases. A frozen v1.8 orchestration fixture, fixed clock and seeded randomness compare observable markup, progress, attempts, diagnostics and navigation across old/new implementations. Baseline CSS additionally supports real-browser layout comparison. Guard tests exercise dependency/capability, view, diagnostics, bootstrap and colour failures.

## Android warning review

All twelve baseline lint findings were inspected. The redundant `mipmap-anydpi-v26` qualifier is removed safely because minSdk is 26; the same two XML files now live in `mipmap-anydpi`, and API-33 monochrome resources remain unchanged. Existing resource tests retain all assertions and follow the equivalent path.

Retained intentionally: OldTargetApi (target upgrade requires separate platform QA); UnusedAttribute for API-33 Back opt-in (correct on supported systems); SetJavaScriptEnabled (local JS is the app, with existing navigation/WebView policy); DataExtractionRules (backup policy is deliberately disabled; no speculative migration); five IconLauncherShape findings (existing brand artwork needs deliberate design/device review); two base MonochromeLauncherIcon warnings (the API-33 variants already supply the actual monochrome layer). No warning suppression was added. Exact final lint/native totals remain pending validation.

## Validation / release gate

Pending final source, hosted browser/native execution, showcase recapture/adoption and visual inspection. Local Chromium cannot start under the executor sandbox (EPERM socket operation); the established GitHub Actions environment provides real Chromium and Android validation. No physical-device, TalkBack, emulator, acoustic, independent native/educator or external learner-study validation is claimed.

## Recorded showcase visual review

All fifteen official images were regenerated from the v1.9 UI, commit `4ed91f72d530ce9b09c70588df0882ef2d09b2e9`, run 42204239693. Capture passed 191 semantic/geometry assertions. Every exact PNG was individually inspected by the agent: cream/navy hierarchy, modest stronger teal, four Practice pastels, readable light/dark surfaces, clear error feedback and unchanged public navigation. Approved: no clipped card/control/text, horizontal overflow, fake system-bar space, navigation overlap or misleading framing. Profile ends cleanly above navigation; dictionary fits without selecting an answer; completion keeps Continue prominent. All images are real Chromium simulations at 384 CSS px / DPR 1 with recorded semantic heights; no physical-device capture is claimed. No old release image was merely relabelled.

<!-- showcase-review: ed197160413ac7cf259b368c495482dba38d655684f407c6924e33121c632efa -->

| Image | Theme | Viewport | Reviewed PNG SHA-256 |
| --- | --- | --- | --- |
| `home.png` | dark | 384 × 1012 | `4dc6a04f38c8649c52b951af69b341ea00451251ad3e773346007de078fffb58` |
| `learn.png` | light | 384 × 839 | `a0f52bde36e431c2e4ea2c8773c55b968dcb58f0b88df73fb25c7a438cf1e9b9` |
| `beginner.png` | light | 384 × 888 | `873ffdef9b55ac3cc12c98293eb18ec10d07bc75260c7f4aba6ef69048a7853a` |
| `cloze.png` | dark | 384 × 1421 | `b17e4ea6f0315c194b8b13f434380b260d55bed9ca2523f1ed8c8d3aaef06268` |
| `sentence-building.png` | light | 384 × 943 | `57afc2d40bde396a7aa953b640784df1af959eb02cad49d34ca0173673250f4f` |
| `dictionary.png` | light | 384 × 953 | `af4393c5a8f84dcc002c455f7af92abacbe96ea75bc10238d4e9d44bf5da45cf` |
| `story.png` | light | 384 × 1271 | `5426f271a0b816a0a469e9ff51bf514ea4e1471258d1d82914a5f1832e86c54a` |
| `feedback.png` | dark | 384 × 1439 | `837e906b9678a8a651283dbed59ab6cb415d92dc918993eefd03c0e949164d9e` |
| `games.png` | light | 384 × 982 | `9f393f976a917302c092059166a0d3a6f3becb5e23ab9020d9cb6a0bbd3b1993` |
| `conjugations.png` | dark | 384 × 743 | `0b9e0555d05206f2141d7385f5e556d693f180b67adc01771556bffeb138769c` |
| `review.png` | light | 384 × 862 | `3eb4df08885f1024f9bcfbd0444c9a0ed5e1bc3871e12d459d6735d3abf4e78e` |
| `profile.png` | dark | 384 × 1099 | `e4d8f95b9bdc85ae703bd7ae3660b0b575210eccb9100806d1739733771210b8` |
| `saved-words.png` | light | 384 × 703 | `cf4a05d3f8b1b05e8742f56667889c4975cb97a3e693880924990db14b12dbca` |
| `recommendations.png` | light | 384 × 925 | `33455a574a96f7feaabb3fa0ba4ccc56db49900d5a4b480585eb5e7d2ba42707` |
| `lesson-complete.png` | dark | 384 × 871 | `295153b0b8244f7d662655f5e066ebdcf0eafa1c6f67fb8a569ec34952fd13ac` |
