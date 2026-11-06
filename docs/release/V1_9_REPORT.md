# v1.9 foundations implementation report

Starting main: `0820c40f981531b4c923c68c40fada6d84e1ccae`, app 1.8.0 / Android 19. Selected release: **1.9.0 / Android 20**. Remote main was inspected through the GitHub connector because the local Git proxy endpoint is unavailable. Existing work was preserved. No new learner activity, stage, account/backend, cloud/AI/ASR, microphone or gamification system.

## Architecture and state

The [architecture contract](../ARCHITECTURE.md) records the pre-change map, module responsibilities, authoritative state, dependency direction, loading order, code placement and remaining debt. App.js began at 59,509 bytes / 238 dense lines. Its final size is recorded after source freeze; it now owns bootstrap, live state/dependency wiring and top-level render/start, with thin compatibility hooks.

Ten controller/support modules cover capability wiring, navigation/Back, lesson/Today, quiz, Practice, Profile, data transfer, diagnostics, input and lifecycle. Completion markup is a view; recommendation policy is a pure domain separate from hub markup. Factories receive only declared live capabilities; no duplicated progress store. Import/reset replacements propagate through getters. Diagnostics receive only a narrow observation context and their own bounded store; they do not drive learning. Input/lifecycle mount/dispose is explicit and idempotent.

No schema bump, ES-module migration, framework, runtime npm dependency or broad folder shuffle occurred. Existing domain algorithms and snapshot/save boundaries are retained. A small layer/capability audit protects actual boundaries, not arbitrary line counts.

## Visual foundation

`tokens.css` defines semantic light/dark colours. Primary teal is modestly stronger; terracotta supports attention, gold supports milestones, success is distinct from destructive/error red, and Practice repeats mint/pale blue/pale gold/pale terracotta. Primary Practice buttons share teal instead of the former separate blue CTA system. CSS retains layout/native-inset ownership and compatibility aliases.

The first cleanup removed 118 superseded declarations/dead rules and merged 63 repeated selectors. Dead pre-hub games-grid/game-primary/grammar-picker styles were removed after checking consumers. Important colour pairs are tested against current tokens; this found and fixed insufficient attention/milestone contrast in the light theme. Final rendered review/contrast/geometry results are recorded after the hosted gate.

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
