# Manual accessibility acceptance

Record platform/device, build, method, result and limitations separately from automated browser assertions. No full accessibility certification is claimed.

- [ ] On an actual Android device with TalkBack: navigate each primary tab; check reading order, accessible names, progress/status announcements and headings.
- [ ] Answer choices expose radio state; arrow/Home/End keyboard operation is sensible; dictionary words do not choose an answer.
- [ ] Sentence tiles, word banks and cloze blanks have meaningful labels, reachable add/remove/reset controls and logical focus after changes.
- [ ] Dictionary/modal opens with readable content, keyboard focus stays usable, Escape/Back dismisses and focus returns to its invoker.
- [ ] Large system fonts/display scale: text is readable and hierarchy useful, not merely inside geometric bounds.
- [ ] Touch targets, contrast, non-colour states, long writing, on-screen keyboard, portrait/landscape, gesture/three-button insets remain usable.
- [ ] Review, beginner Practice disclosure and diagnostics data controls have clear next actions and no inaccessible hidden state.

The repository browser suite exercises real DOM keyboard/focus, wrapping, controls, modal dismissal and geometry across existing profiles. It does not run TalkBack or validate a physical Samsung/Pixel keyboard. Actual-device TalkBack and manual motor/vision testing remain required beta checks until a recorded result exists.
