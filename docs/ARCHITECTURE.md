# Runtime architecture and code placement

## Baseline inspection — before extraction

Starting main `0820c40f981531b4c923c68c40fada6d84e1ccae`, app 1.8.0 / Android 19. `app.js` is 59,509 bytes / 238 densely formatted lines. It owns bootstrap and learner state, navigation, quiz/Today/completion, eleven Practice integrations, Profile/search/data transfer, diagnostics orchestration, DOM events, timers and native Back/pause. Existing domain/view/platform modules already provide most algorithms; extraction must preserve their calls, argument order and snapshot semantics.

Content/data (curriculum generators, permanent IDs, Story Editions, dictionaries, canonical records) feeds domain logic (Engine, Structured, Writing, Mastery, LearningPractice/Quality, PracticeSkills, focused/game/table selection). Controllers coordinate those domains and platform services. Views format state but do not grade, schedule or complete. Bootstrap owns authoritative progress and transient UI state and injects capabilities into controllers. Storage owns migration/validation; speech and viewport own platform transients. Dependencies never flow from domain/storage into controllers.

## State ownership contract

| State | Authority |
| --- | --- |
| Learner progress, course completions, placement, streak/session data | One bootstrap `state`, validated/persisted by ProgressStore schema v2 / existing key |
| Live course attempt | In-memory `quiz`; persisted snapshot `state.active` at existing save boundaries |
| Review | `state.reviews` owns historical question/passage/model/schedule snapshots; active retrieval is `quiz` |
| Practice Hub | `state.practiceHub.active/history/recent`; no course completion |
| Verb in Context | `state.games.active/history/bests`; existing engine |
| Verb Trainer | `state.blanks.active/history`; existing engine |
| Focused Listening/Speaking/Shadowing | `state.focused.active/history`; existing evidence distinctions |
| Mastery | `state.mastery`, mutated by existing learning domains only |
| Saved Words | `state.savedWords`, validated local dictionary records |
| Dictionary/search/popups | UI query/filter variables and DictionaryUI transient state |
| Navigation/results/Today/return destinations | Bootstrap transient variables accessed through injected properties; never a second progress store |
| Speech | SpeechTools instance, request tokens and playback state |
| Keyboard/native insets | ViewportTools and native inset callbacks |
| Diagnostics | Separate BetaDiagnostics schema 1/key, bounded 500 events / 30 days; never ProgressStore input |

Diagnostics observe; they cannot drive mastery, completion, placement, SRS or recommendations. Current live editorial amendments never run from storage migration or reinterpret old snapshots. Recommended Practice respects reached sources; manual grammar freedom is a separate policy. Review remains scheduled retrieval, separate from on-demand remediation.

Extraction/module contracts, load order, placement rules and guardrails are recorded below as each coherent responsibility is moved. No ES-module/framework migration or bulk content migration belongs in this release.

## Extracted responsibilities

| Module | Responsibility / dependencies |
| --- | --- |
| `controllers/runtime-context.js` | Select declared live accessors; reject missing capabilities and duplicate actions |
| `navigation-controller.js` | Tabs, safe return destinations, native Back priority; public Practice vs internal Games |
| `lesson-controller.js` | Onboarding/placement, course/Today/review launch and seamless next required activity |
| `quiz-controller.js` | Attempt creation/persistence, answer/support/media/reflection lifecycle, existing domain calls and completion |
| `practice-controller.js` | Existing game/table/focused/skill engines, settings/resume/results/remediation coordination |
| `profile-controller.js` | Vocabulary/Saved Words/search, reference/recommendation navigation and learner disclosures |
| `data-controller.js` | Validated progress import, protected export, explicit reset, local editorial-report export and download platform bridge |
| `diagnostics-controller.js` | Narrow observation context, private sampled duration, independent diagnostics export/pause/reset; **no progress capability** |
| `input-controller.js` | DOM delegation, keyboard/IME/focus coordination; import delegates to data transfer |
| `lifecycle-controller.js` | Idle-aware time sampling, pause/resume/page visibility, listeners/timer disposal |
| `completion-view.js` | Pure completion/next-card markup; controller supplies score/pass result and domains retain progression rules |
| `practice-recommendation.js` | Existing deterministic eligibility/evidence policy, moved unchanged out of hub rendering |

Factories receive explicit dependencies. `RuntimeContext.inject` preserves live getters/setters; spreading/destructuring mutable state into a controller would silently create stale state after import/reset. There is **one** bootstrap state object binding, not ten controller stores. Controller-local subscription lists, duration counters and once-per-attempt guards are transient service bookkeeping. Native Back remains `window.FriendsToAmigos.handleBack`; the existing `tick` inspection hook forwards to the lifecycle implementation.

Controller cooperation uses injected callbacks/action registry, not controller-to-controller imports. Mounting input/lifecycle is idempotent; disposal removes exactly the registered listeners/timer. Views may call read-only selectors, such as `CoursePath.complete`, but must not call `Engine.complete`, answer/SRS recording or mastery mutation. A view does not infer verified accuracy from speaking or open-writing reflection.

## Script loading and future ES modules

`www/index.html` remains the authoritative classical-script order. The machine-readable [runtime layer inventory](architecture/runtime-layers.json) enumerates every runtime JS file. Phases are: authored content/IDs → language/Story Editions/canonical registry/transitional consolidation → curriculum/assessment/domain banks → mastery/practice/dictionary domains → storage/platform/views → controller definitions/capability wiring → **app bootstrap last**. The registry precedes consolidation because introduction models now come from canonical records. Controller factories do not execute application actions while definitions load; all aliases/services exist before mount/render.

No full ES-module migration occurred. Each new module has one factory/export, explicit capabilities and no runtime code generation. A dedicated future release can replace the small browser/CommonJS bridge with imports, then make bootstrap state handles explicit types. Do not mix that conversion into a content or palette edit.

## Where future work belongs

| Change | Home |
| --- | --- |
| Authored Spanish, examples, glossaries, source provenance | Canonical content/data; bounded incremental records, reviewed sources |
| Answer normalization, finite structures, cautious writing diagnosis | Structured / assessment / writing domains |
| Course completion and SRS | Engine / CoursePath |
| Learning evidence and weakness | Mastery / LearningPractice / LearningQuality |
| Practice selection/generation | PracticeSkills, PracticeNumbers, FocusedPractice, existing grammar engines |
| Adaptive Practice recommendation | PracticeRecommendation; never diagnostics |
| External curated content | Recommendations catalogue/audit; no runtime fetch |
| Rendering | Existing views / CompletionView; no grading or progress ownership |
| Navigation, sessions, results, data controls | Relevant controller, injected dependencies |
| Persistence/migration | ProgressStore; preserve snapshots and schema v2 |
| TTS/audio / native geometry | SpeechTools / ViewportTools / native wrapper |
| Optional diagnostics | BetaDiagnostics and narrow DiagnosticsController |
| Required compatibility editorial overlay | Consolidation only under the containment policy below |

## Transitional consolidation policy

`consolidation.js` is a **controlled transitional live amendment layer**, not the default authoring location for every future correction. It retains the v1.8 approved amendments and exact compatibility signatures. Its 26 introduction models now derive from canonical records without changing runtime values. The three v1.9 glossary corrections were made in their actual source data, with a separate developer-only inverse/review record. No bulk migration was attempted.

For a future correction: identify the canonical source/target, compare permanent identities and current vs historical model contracts, make a surgical source edit where safe, record before/after/provenance, add snapshot tests and strict developer inverses if needed. Only use a live amendment when the current architecture genuinely requires it. Never call an inverse or amendment from storage migration. Never replace an active/review question with a live canonical lookup.

## Design ownership

`tokens.css` owns semantic light/dark colours and compatibility aliases. `style.css` owns component/layout rules; `dictionary.css` owns explorer-specific layout. Native safe-area/keyboard geometry variables remain viewport/platform responsibilities. Semantic roles: primary teal (slightly stronger), terracotta attention, restrained gold milestones, distinct success and red error/danger, warm neutrals and four repeated Practice pastels. Primary actions now share teal throughout; no separate blue CTA system. Disabled/selected/error/success keep semantic HTML, text/icons and borders, not only colour.

The CSS audit protects one token definition per theme, no new one-off colour literals in component styles, no duplicate selector/property within an identical condition and measured important colour pairs. It is not a general CSS validator or accessibility certificate. Browser checks compare actual layout metrics with frozen v1.8 CSS on the same DOM; changed colour is intentional, accidental geometry change is not.

## Guardrails and tests

Run `audit:architecture`, `audit:style`, all course/language/compatibility gates and the full browser/native release gate. The layer audit rejects domain→controller imports, undeclared capabilities, implicit app-state globals, view learning mutations, storage/editorial coupling and new unreviewed bootstrap responsibilities. It intentionally uses bounded source checks rather than pretending to provide a full type system. There is no arbitrary file line limit.

The immutable `tests/fixtures/v18-app.js` is pre-extraction orchestration at the recorded baseline SHA, not a second curriculum. Differential tests run it and current orchestration against the same domains, seeded randomness and fixed clock, comparing markup, progress, attempts and private diagnostic output. Frozen CSS is developer-only layout evidence. Existing 117 app tests were moved without changing their bodies into course, practice, platform and data groups with shared scenario helpers. Browser transport, profiles, interaction assertions, stress capture recipes and new foundations checks have separate ownership. Historical fixtures remain immutable.

## Inspected performance / remaining debt

No general speed-up is claimed. Snapshot JSON cloning is retained where it protects owned attempts; source indexes in storage/dictionary/mastery remain in their existing domains. No new per-question curriculum copy/index or DOM listener is introduced. Capability selection is once per controller bootstrap; event registration is bounded/idempotent. Recommendation algorithms and render/save timing are preserved rather than optimized speculatively.

Remaining debt: classical globals/load order; a central live capability adapter; a large Practice coordinator and a large browser interaction phase; existing mixed catalogue/read-only-render modules; legacy aliases for CSS and internal Games routes. Bootstrap still dispatches top-level render routes. These are explicit future migration boundaries, not reasons to add a framework or rewrite storage/content now.
