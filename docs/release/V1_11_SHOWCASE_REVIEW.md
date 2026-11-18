# v1.11.0 showcase review

Fifteen README showcase images for **1.11.0 / Android versionCode 22**.

## Capture provenance

- CI run [44309967330](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/44309967330), job `showcase-capture`, artifact `app-showcase-candidate` (zip SHA-256 `63215b9be7dc6202179eeb52a1bfb5f647af901728fe048393f35575cbe835a0`, matching GitHub's recorded digest).
- Source commit `bd36ad5e7d91207b00b4db05981557d64ba327a1`; UI source fingerprint `94de543f91f11d9161cc36cd5b82ecdb64bec0d8036c23760f95dd2f3e5cc733`, identical to the adopting commit's fingerprint.
- Mode: clean-app-viewport; browser-simulated app viewports with illustrative learner data. No Android system UI, physical-device or TalkBack capture is claimed.

## Comparison with the previous published set

Pixel comparison with the set adopted for the learning-integrity work (itself content-identical to v1.10 apart from flag/emoji anti-aliasing): `home`, `learn`, `recommendations` and `saved-words` are pixel-identical, and the other eleven differ only in the 4 px scrollbar strip (x 380–384), which also varies between repeat captures of unchanged source. The beginner question's stable shuffled order equals its authored order. The new Practice activities (Write from Memory, Listen & Write) lie below the captured region of `games.png`; they were inspected in separate local light/dark captures and are covered by the browser layout suite.

## Recorded visual acceptance

All fifteen exact PNGs below were individually inspected by the agent (Claude) against the release showcase checklist: actual current UI and version; visible navigation **Home · Learn · Practice · Review · Profile** in order with the correct active tab; no clipping, overlap, horizontal overflow or content under the navigation; no simulated system bars; readable text in the theme each profile specifies; dictionary popup fits without answering; keyboard absent. Independent human review remains outstanding.

<!-- showcase-review: 94de543f91f11d9161cc36cd5b82ecdb64bec0d8036c23760f95dd2f3e5cc733 -->

| Image | Theme | Viewport | Reviewed SHA-256 |
| --- | --- | --- | --- |
| `home.png` | dark | 384 × 1059 | `7a4af99d8f3722c1b5df014bfd923f16c1f52fd93817e605998800d5adcc2b90` |
| `learn.png` | light | 384 × 887 | `14dbc05b91edde76c10c51fc6fa654d83bef22ea820ee0232dcef722f14c3c29` |
| `beginner.png` | light | 384 × 915 | `1646fe4c36dbdb001552fafb34d44475dd58bfdfaeaed3af1a993e8cd3750e6a` |
| `cloze.png` | dark | 384 × 1490 | `82e8b6b645fd137e56a0aef450ae4c2a8ecc6337d3be56cad575e3b975f375f5` |
| `sentence-building.png` | light | 384 × 966 | `c87f421e3833365bb740067e61bed9bbf1797948d68ae69ea3760c856d3de9a6` |
| `dictionary.png` | light | 384 × 980 | `cf6e99d747eb7e76120a04d6892a69b2f994c90b5d238455cd6d6fbc3422848d` |
| `story.png` | light | 384 × 1287 | `54c78069f9dfe3119a2c1e2ee43c59a77e57d4dea1106afebcf54703046f2948` |
| `feedback.png` | dark | 384 × 1500 | `037bbe7cb1dba74cfae264fb7eca66b519d4c53154522e60bc25b1b1e985cf3d` |
| `games.png` | light | 384 × 988 | `e1100e65ab85ea42daac00f3ffac9a7afc75c84c9456f9b787d08b506480b205` |
| `conjugations.png` | dark | 384 × 767 | `44add8f64aa227b6a70fd37869082da707e4f6df230b625deb115446da831cc4` |
| `review.png` | light | 384 × 890 | `fba24921ab0333c50cc1a0ccc88fd335db0cdaf32b8dbc1f3556c4095cc3cb64` |
| `profile.png` | dark | 384 × 1151 | `2f30c441c308c14c659075cc72800a831c2466c02459195d75c11089b7ce356a` |
| `saved-words.png` | light | 384 × 745 | `43d66058e2be5bdd504b256399b222549a7caf09df63c07009335c01d1524803` |
| `recommendations.png` | light | 384 × 957 | `28bbbfe12e25ce214cc1dbcad5066f050a77d7cbe3881977e266d6c4d7b2cbbe` |
| `lesson-complete.png` | dark | 384 × 909 | `3c8aeaec93300e7b85106122366fac8ca540b57de6b7dbcad8001c63660ba7fc` |

## Limitations

Browser simulation only; native insets, keyboard and TalkBack behaviour are not shown. Agent review is not independent native-speaker, educator or accessibility approval.
