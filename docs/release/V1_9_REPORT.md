# v1.9 foundations implementation report

Starting main: `0820c40f981531b4c923c68c40fada6d84e1ccae`, app 1.8.0 / Android 19. Selected release: **1.9.0 / Android 20**. Remote main was inspected through the GitHub connector because the local Git proxy endpoint is unavailable. Existing work was preserved. No new learner activity, stage, account/backend, cloud/AI/ASR, microphone or gamification system.

## Architecture and state

The [architecture contract](../ARCHITECTURE.md) records the pre-change map, module responsibilities, authoritative state, dependency direction, loading order, code placement and remaining debt. App.js began at 59,509 bytes / 238 dense lines. Its final size is **14,869 bytes / 144 lines** (about 75% fewer bytes); it now owns bootstrap, live state/dependency wiring and top-level render/start, with thin compatibility hooks.

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

All twelve baseline lint findings were inspected. No speculative production/native change is retained. Removing the redundant API-26 qualifier introduced two IconXmlAndPng findings, so the original qualifier and identical resources are retained. The existing launcher tests keep every original assertion and add an explicit minSdk floor check.

Retained intentionally: the redundant API qualifier (removal causes new overlap warnings); OldTargetApi (target upgrade needs platform QA); UnusedAttribute for API-33 Back opt-in; SetJavaScriptEnabled (local JS is the app, with existing navigation policy); DataExtractionRules (backup deliberately disabled); five IconLauncherShape findings (existing brand artwork needs deliberate design/device review); two base MonochromeLauncherIcon warnings (API-33 variants already supply the monochrome layer). No suppression was added. Final totals are recorded below after validation.

## Validation / release gate

Pending final source, hosted browser/native execution, showcase recapture/adoption and visual inspection. Local Chromium cannot start under the executor sandbox (EPERM socket operation); the established GitHub Actions environment provides real Chromium and Android validation. No physical-device, TalkBack, emulator, acoustic, independent native/educator or external learner-study validation is claimed.

## Recorded showcase visual review

All fifteen official images were freshly captured from the final v1.9 runtime, commit `9fce254d4e3d513e8b969a5fc67b9bb011f1ddaf`, run 42210217352. Capture passed 191 semantic/geometry assertions. The agent individually inspected all fifteen exact PNGs after the final semantic-theme cleanup and explicit completion-policy wiring: cream/navy hierarchy, restrained teal, Practice pastels, light/dark surfaces, error feedback and current public navigation. No clipped controls/text, horizontal overflow, fake system-bar gaps or navigation overlap were observed. Dictionary fits before answering; Profile ends above navigation; completion keeps Continue prominent. These are Chromium simulations at 384 CSS px / DPR 1 with recorded heights, not physical-device captures. All were recaptured; Beginner and Saved Words are byte-identical to the immediately preceding reviewed candidate; other images differ only in the four-pixel native browser scrollbar strip, verified by pixel comparison and re-inspected visually. No old release screenshot was merely relabelled.

<!-- showcase-review: 5db7a5cd20e9b9ea60b37aba9b21d37490d4332ba5e9ad41dbe73cf6748051f9 -->

| Image | Theme | Viewport | Reviewed PNG SHA-256 |
| --- | --- | --- | --- |
| `home.png` | dark | 384 × 1012 | `4dc6a04f38c8649c52b951af69b341ea00451251ad3e773346007de078fffb58` |
| `learn.png` | light | 384 × 839 | `23a19567055ea80314da46e3f805e6247dc8cdc2e0855820854c0cb8ed2596fe` |
| `beginner.png` | light | 384 × 888 | `8b871ba285ea4afe3f35d096778db5ddc56cdb83003008fc5990200599dfb224` |
| `cloze.png` | dark | 384 × 1421 | `b1769bb816a31b12014eaec09c6608b9430e0006fc4db9cc009855411e073dfb` |
| `sentence-building.png` | light | 384 × 943 | `599852ad1b25e9de8706712e8b8a7addf709ecd80dc7d406006940f6d2d57fec` |
| `dictionary.png` | light | 384 × 953 | `04ce9851872c3075eb7687812bc1c1eb1bd64fad07d57c18f2fc8378386eff11` |
| `story.png` | light | 384 × 1271 | `6b960218ce6e1148b323a7d840bcf5a54be81969bb1b122901f530af06e619b1` |
| `feedback.png` | dark | 384 × 1439 | `6f93ff7a9bc8c14a2d42af19e304e57226a9a72fde95f6159c5bf98bb3648980` |
| `games.png` | light | 384 × 982 | `a8de66c8f806989b304ec6c655e6baef29aa9ffe59136019c075035d74174300` |
| `conjugations.png` | dark | 384 × 743 | `47cb6e843f052497d56eb4f2662dba5ac0ca7c7d52f7cacfcce47064196d1f4a` |
| `review.png` | light | 384 × 862 | `0965bd6203de1c2423573323482a06ad8b1ed6d740d07dd6961a59a5a08fd394` |
| `profile.png` | dark | 384 × 1099 | `225af8bac0d86f34e72ace170cfbc37b2bf4660516d21c0eed4328c40bdf053b` |
| `saved-words.png` | light | 384 × 703 | `cf4a05d3f8b1b05e8742f56667889c4975cb97a3e693880924990db14b12dbca` |
| `recommendations.png` | light | 384 × 925 | `9f74ce86cf0d30f858e3a3335735a63b288ed2e10558d5efde4767c4660fe039` |
| `lesson-complete.png` | dark | 384 × 871 | `1ee497d291020a7446acac5a9ffea96c6060f89a9b40bc8d3ab18daebd9f563e` |

## Additional rendered acceptance and compatibility

The agent inspected final-runtime stress captures from run 42208680105: narrow-light-buttons Practice (320px), Galaxy S25 dark large-text/cutout Practice, Galaxy S24 dark gesture/overlay-IME writing, Galaxy S25 light landscape/cutout dictionary, Galaxy S22 light three-button Profile, S24 dark large-text diagnostics, and Galaxy S25 landscape Home. Text/control wrapping, primary action emphasis and theme hierarchy were checked. These stress views deliberately include simulated reserved system/keyboard space; they are separate from the clean public showcase. Scroll/reachability and exact inset handling are additionally exercised by the full browser matrix. This is agent visual review of rendered images, not actual OS/IME/TalkBack validation.

Behaviour is characterised against the frozen v1.8 orchestration, while all existing historical payload/identity/save tests remain. ProgressStore schema v2/key, permanent IDs, active attempts, Review snapshots, all eleven Practice engines, placement, mastery and Saved Words retain their contracts. Diagnostics stay in their own bounded schema/store; import does not adopt diagnostic fields. Optional accents remain accepted and ñ remains distinct; writing and speaking retain conservative capability claims. Core learning adds no network dependency.

## Remaining debt and external checks

Classical global-script loading, the central live dependency adapter, large Practice coordination and the large browser interaction phase remain documented debt. Snapshot cloning and existing indexing are deliberately retained; no unsupported performance claim is made. The next dedicated engineering change can assess ES modules after these boundaries prove stable. Actual Android Back/IME/TTS, pause/resume, export/import and TalkBack still need physical-device checks. Independent native/educator review of wording/glossaries and learner usability validation remain outstanding; no such approval is implied by zero audit flags.

## Files added and materially changed

### Added

`docs/ARCHITECTURE.md`, `docs/architecture/runtime-layers.json`, `docs/release/V1_9_MANUAL_QA.md`, `docs/release/V1_9_RELEASE_NOTES.md`, `docs/release/V1_9_REPORT.md`, `docs/release/v19-editorial-corrections.json`, `scripts/audit-architecture.cjs`, `scripts/audit-style.cjs`, `scripts/browser/devtools.cjs`, `scripts/browser/foundations-checks.cjs`, `scripts/browser/interaction-assertions.cjs`, `scripts/browser/profiles.cjs`, `scripts/browser/stress-captures.cjs`, `scripts/content/foundations-support.cjs`, `scripts/lib/css.cjs`, `tests/app-data.test.cjs`, `tests/app-platform.test.cjs`, `tests/app-practice.test.cjs`, `tests/fixtures/v18-app.js`, `tests/fixtures/v18-characterization.json`, `tests/fixtures/v18-dictionary.css`, `tests/fixtures/v18-style.css`, `tests/foundations.test.cjs`, `tests/helpers/app-scenarios.cjs`, `tests/helpers/css.cjs`, `www/completion-view.js`, `www/controllers/data-controller.js`, `www/controllers/diagnostics-controller.js`, `www/controllers/input-controller.js`, `www/controllers/lesson-controller.js`, `www/controllers/lifecycle-controller.js`, `www/controllers/navigation-controller.js`, `www/controllers/practice-controller.js`, `www/controllers/profile-controller.js`, `www/controllers/quiz-controller.js`, `www/controllers/runtime-context.js`, `www/practice-recommendation.js`, `www/tokens.css`.

### Changed

`.github/workflows/android.yml`, `AGENTS.md`, `BUILD_STATUS.md`, `COURSE_DESIGN.md`, `README.md`, `android/app/build.gradle`, `android/app/src/test/java/com/friendstoamigos/app/LauncherResourcesTest.java`, `docs/BETA_DIAGNOSTICS.md`, `docs/CONSOLIDATION_STRATEGY.md`, `docs/CONTENT_REVIEW_POLICY.md`, `docs/LINGUISTIC_CONTENT_SCHEMA.md`, `docs/MANUAL_ACCESSIBILITY.md`, `docs/STATE_AND_QUESTIONS.md`, `docs/resources/CODEX_REFERENCE.md`, `docs/screenshots/beginner.png`, `docs/screenshots/cloze.png`, `docs/screenshots/conjugations.png`, `docs/screenshots/dictionary.png`, `docs/screenshots/feedback.png`, `docs/screenshots/games.png`, `docs/screenshots/home.png`, `docs/screenshots/learn.png`, `docs/screenshots/lesson-complete.png`, `docs/screenshots/manifest.json`, `docs/screenshots/profile.png`, `docs/screenshots/recommendations.png`, `docs/screenshots/review.png`, `docs/screenshots/saved-words.png`, `docs/screenshots/sentence-building.png`, `docs/screenshots/story.png`, `package.json`, `scripts/audit-language.cjs`, `scripts/browser-check.cjs`, `scripts/content/build-learner-dictionary.cjs`, `scripts/content/experience-support.cjs`, `scripts/showcase/config.cjs`, `tests/app.test.cjs`, `tests/helpers/app.cjs`, `tests/icon.test.cjs`, `tests/mobile.test.cjs`, `tests/quality-release.test.cjs`, `tests/samsung-responsive.test.cjs`, `tests/screenshots.test.cjs`, `tests/viewport.test.cjs`, `www/app.js`, `www/b21-data.js`, `www/b22-data.js`, `www/beta-diagnostics.js`, `www/consolidation.js`, `www/dictionary.css`, `www/index.html`, `www/linguistic-content.js`, `www/practice-hub.js`, `www/style.css`.

### Native resources

Original launcher resources and qualifiers are retained unchanged.
