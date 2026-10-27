# Local beta diagnostics — schema 1

Optional local technical evidence for manual beta evaluation; not analytics sent to a provider, a KPI/OKR system or a formal participant-study programme.

Storage key: `friends-to-amigos-beta-diagnostics-v1`, separate from schema-v2 learner progress. Default is local recording; Profile → Settings → Data & backup → Beta diagnostics explains the scope and offers export, pause/resume and reset. Export is explicitly user initiated. Android uses the existing document-export mechanism with a dedicated filename; browser export downloads JSON. No automatic upload or new network/device permission exists.

Root: `{schemaVersion:1, enabled:boolean, events:[]}`. Export adds `format:friends-to-amigos-beta-diagnostics-v1` and current appVersion. A maximum of 500 events and 30 days is retained. Invalid/oversized local records default safely; storage failure leaves temporary in-memory diagnostics and never blocks learning. Diagnostics embedded in imported progress are ignored; they cannot replace this independent store.

## Event allowlist

`lesson_opened`, `lesson_completed`, `activity_left`, `answer_checked`, `support_used`, `dictionary_opened`, `review_started`, `review_completed`, `practice_opened`, `practice_completed`, `stage_progressed`, `session_duration`.

Allowlisted fields: timestamp; numeric release version for each newly recorded event (the export root also names the current release); known playable stage; bounded unit; existing course activity/question IDs; enumerated mode/skill/support and resume flag; correctness/assistance/self-assessment/completed booleans; bounded duration/wrongCount. Dynamic game/question IDs and arbitrary strings are omitted. No event contains a learner name, typed answer, free-writing text, dictionary search, message, recording, microphone data, device ID or sensitive device information. The module sanitizes even its own writes. Practice skill tags distinguish the eleven activities without storing learner text. Resuming course/focused/skill/grammar sessions records an opened event with resumed:true. Pausing/resetting clears pending sampled diagnostic time; paused intervals are not accumulated. Reset deletes only diagnostic events; pausing does not erase existing events. Progress reset/import deliberately does not reinterpret diagnostics.

`activity_left` means an interrupted/saved attempt, not proof of permanent abandonment. `lesson_completed` describes the end of an attempt, with `completed` distinguishing a passed activity. Speaking and unverified writing carry selfAssessed, not verified pronunciation/grammar accuracy. Duration is sampled active time from the existing idle/background-aware timer; it is not exact wall-clock attention. Counters are evidence to inspect, not product success thresholds.

Progress backups and separately opted-in answer reports can contain the learner’s writing by design; diagnostic export does not. Never merge those formats or upload learner text implicitly.
