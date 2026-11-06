# Material 3 release continuation

Task: current user Material 3 modernisation and permanent standards. Baseline main b0c46adf5bf665d77abdf481ec1367c601884fbd, 1.9.0/20. Preparing 1.10.0/21. Preserve all current changes; do not restart.

Implemented: tokens for Material colour/type/shape/spacing roles, 48px controls, nav capsule + aria-current/name, status announcements, native teal accent in day/night/API31; DESIGN_SYSTEM.md + mandatory AGENTS policy; expanded style audit and Material/browser/unit tests. Wallpaper dynamic colour intentionally deferred/documented; no SDK/inset/Back/domain/content/schema changes.

Focused validation logs /tmp/m3-*.log; final focused tests and all full gates still required. Existing browser baseline CSS checks intentionally permit larger vertical/type measurements while preserving horizontal geometry. Historical data fixtures remain untouched; only new nav accessibility attrs normalised in orchestration HTML comparison. Read V1_10_REPORT.md for details.

Next: finish focused tests, diagnose actual failures; publish candidate to validation branch via existing GitHub connector workflow (local Git proxy/browser sandbox unavailable); capture final showcase, inspect/adopt all PNGs; run full JS/browser/audits/Android gate, verify lint has no new warnings and 93 APK assets equal source. Record exact results in report/build status. Never claim physical/TalkBack/Material certification. Do not publish main with failing checks. Update this file with candidate SHAs/run IDs if interrupted.
