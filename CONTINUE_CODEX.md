# v1.10 Material release checkpoint

This is a task record, not a standing request to redo the implementation. Read AGENTS.md and docs/DESIGN_SYSTEM.md.

Implementation is complete. Baseline main: b0c46adf5bf665d77abdf481ec1367c601884fbd. Release: 1.10.0 / Android 21. No content/domain/schema or native inset/Back changes. Wallpaper colour is intentionally deferred. All 15 final-source showcase images were captured, individually reviewed and adopted (source 3bc063eba9d9587548632e1824d3708735a4ddb1).

Complete source gate: commit 4f36efef3dfb818e1770a2132282e087be7c4b89, run 42219350998: 2242 JS tests, 17 browser profiles / 60645 assertions, 15 Android unit tests, 0 lint errors / same 12 warnings, all 93 APK assets match. See docs/release/V1_10_REPORT.md for actual results and manual limitations.

The commit containing this final checkpoint records evidence and tightens dictionary close bounds / native-token parity tests without changing shipped runtime assets. Its complete workflow on codex/material-v110 must pass before main promotion. If resuming: inspect current Git/main and that branch's latest workflow. If this release commit is already on main with green validation, the task is complete; do not repeat it. Otherwise finish the workflow/APK verification, fetch main again and safely fast-forward only after green (never force). Preserve newer work. Local full-suite logs are /tmp/m3-*.log; hosted evidence is authoritative. Physical-device/TalkBack/extreme font scaling remain manual checks, not release claims.
