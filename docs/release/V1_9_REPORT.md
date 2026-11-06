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

All fifteen official images were freshly captured from the final v1.9 runtime, commit `a4b21f0d983d808081866c19fe4cd5bf6d1daa1f`, run 42208680105. Capture passed 191 semantic/geometry assertions. The agent individually inspected all fifteen exact PNGs after the final semantic-theme cleanup: cream/navy hierarchy, restrained teal, Practice pastels, light/dark surfaces, error feedback and current public navigation. No clipped controls/text, horizontal overflow, fake system-bar gaps or navigation overlap were observed. Dictionary fits before answering; Profile ends above navigation; completion keeps Continue prominent. These are Chromium simulations at 384 CSS px / DPR 1 with recorded heights, not physical-device captures. All were recaptured; Saved Words happens to be byte-identical to the earlier candidate. No old release screenshot was merely relabelled.

<!-- showcase-review: 722676a15a8f2d7b8a415f5619af01e3687b54e6b4d20683426338c1e5b2ceda -->

| Image | Theme | Viewport | Reviewed PNG SHA-256 |
| --- | --- | --- | --- |
| `home.png` | dark | 384 × 1012 | `64600e2c170881ba5129ff915e50c2dc5a3f54646dc3c62c6c168eea89345f76` |
| `learn.png` | light | 384 × 839 | `cb098c2ea381931c6ad8df4200ea0f4d5b9976f63a7eed666371030f5c83920c` |
| `beginner.png` | light | 384 × 888 | `8b871ba285ea4afe3f35d096778db5ddc56cdb83003008fc5990200599dfb224` |
| `cloze.png` | dark | 384 × 1421 | `f497d9645342ccceac25e8c4fa3817ab8ab03ae4d7f08d3eb987dac582666e79` |
| `sentence-building.png` | light | 384 × 943 | `7c7af1c4258f620aafe801b2561bdaa2e1162cd5c64d3e961ef2a6a77cb9cf9f` |
| `dictionary.png` | light | 384 × 953 | `a1faa3a2a5833cd21d672918cc0fb45c1c5bb0d0b07de7c3cd68738d9016875e` |
| `story.png` | light | 384 × 1271 | `b27dcc15efba6f52486d8b68dde85359f1f18b881955a6146bad1c27faccabfa` |
| `feedback.png` | dark | 384 × 1439 | `f8f4436087b8906b9ce660fc55b560cdc9cedebf8a4ac059a865939494047ef0` |
| `games.png` | light | 384 × 982 | `fecc5def753a7304373c7c3d37e496df58c5f4dd7860c60c51931062170df6b1` |
| `conjugations.png` | dark | 384 × 743 | `e03a1793db9031be113eb0f93332e702bf375409fc03984e1c6952aeb6ade4a0` |
| `review.png` | light | 384 × 862 | `846954a9f0738a8d513fc0e687732b6a74fb52af044a16a50bffff4f4c4d8f1b` |
| `profile.png` | dark | 384 × 1099 | `c77e8134d728db0dd5b91f593c275bb79bad14c4bf56d003967663cd728f5713` |
| `saved-words.png` | light | 384 × 703 | `cf4a05d3f8b1b05e8742f56667889c4975cb97a3e693880924990db14b12dbca` |
| `recommendations.png` | light | 384 × 925 | `4ab9512f6efec17e9986a5a40de1584469e13b4c4284b415c0ff7521c6bb1cf3` |
| `lesson-complete.png` | dark | 384 × 871 | `69235538d29a37768c12552ce35ca41409cb9499c7455f6c8bd9c2bfb69f7ad1` |
