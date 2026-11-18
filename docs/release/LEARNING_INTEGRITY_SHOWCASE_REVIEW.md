# Learning integrity showcase review (unreleased, app 1.10.0)

Refresh of the fifteen README showcase images after the learning-integrity and maintenance work on branch `claude/project-review-lrfzl1` (Android export/rotation fixes, start-up profiling, Prettier formatting, shuffled choice display, longer review spacing, explanation corrections, Write from Memory and Listen & Write). The app version remains **1.10.0 / Android versionCode 21**; this is not a release, and a version bump with release notes belongs to the release task.

## Capture provenance

- CI run [44301327572](https://github.com/mmwiza1/Friends-to-Amigos/actions/runs/44301327572), job `showcase-capture`, artifact `app-showcase-candidate` (zip SHA-256 `0aa84776ad3bfa5fb84d462f090979e82f6c8893573f257ca385b33650c30664`, matching GitHub's recorded digest).
- Source commit `b89f3b518eb9dc4a54b10e349bfea5d5c60b6d0b`; UI source fingerprint `9d84e1a509e23c63abf3439e675433bc32f2be6d3ca09925d27bbd3d69d9951c`, identical to the fingerprint of the adopting commit (documentation changes only after capture).
- Mode: clean-app-viewport; browser-simulated app viewports with illustrative learner data. No Android system UI, physical-device or TalkBack capture is claimed.

## What changed in the images

Pixel comparison with the previous published set: all app content is unchanged except glyph anti-aliasing of the flag and emoji (newer emoji font on the CI runner; `home`, `learn`, `profile`, `recommendations`, `review`, `saved-words`, `lesson-complete`, `feedback`) and the 4 px scrollbar strip, which also varies between repeat captures of unchanged main. The beginner question's stable shuffled order happens to equal its authored order, so that image is unchanged. The new Practice activities are below the captured region of `games.png`; they were inspected separately in local light and dark captures (hub cards, question, audio-first lock and feedback) and are covered by the browser layout suite (17 layouts, 60,866 assertions).

## Recorded visual acceptance

All fifteen exact PNGs below were individually inspected by the agent (Claude): clean viewports, no clipping, overlap or horizontal overflow, readable light/dark surfaces matching each profile's theme, and the visible navigation labels in order **Home · Learn · Practice · Review · Profile**. Independent human review remains outstanding.

<!-- showcase-review: 9d84e1a509e23c63abf3439e675433bc32f2be6d3ca09925d27bbd3d69d9951c -->

| Image | Theme | Viewport | Reviewed SHA-256 |
| --- | --- | --- | --- |
| `home.png` | dark | 384 × 1059 | `7a4af99d8f3722c1b5df014bfd923f16c1f52fd93817e605998800d5adcc2b90` |
| `learn.png` | light | 384 × 887 | `14dbc05b91edde76c10c51fc6fa654d83bef22ea820ee0232dcef722f14c3c29` |
| `beginner.png` | light | 384 × 915 | `50fcf29d22ee499a32d22fad3950f42ab7f2ed519220bbd08ddb269c8de01d5c` |
| `cloze.png` | dark | 384 × 1490 | `88338ed0f541751856e250a1529521e7d2b77b08c4d76a6d6ec82464ce7b3808` |
| `sentence-building.png` | light | 384 × 966 | `ae7c7749f0d1f5373c40459cdb11cd20ed794fd8b8150a32590d53e4b47fde93` |
| `dictionary.png` | light | 384 × 980 | `932602eef66cc4c1f05942d86c82e612328fb3a43927fbeaec6af04c4ff9c5fa` |
| `story.png` | light | 384 × 1287 | `7fc2603c76080cca9e88055effe4cfa9283c430cf7ed9a36db20a0acee73352b` |
| `feedback.png` | dark | 384 × 1500 | `9d39832292150145c45dedbb05b7f820535b0e6c54a4d74fef0e224d9fc772a2` |
| `games.png` | light | 384 × 988 | `d142da3bd862e6939d2c00d12c2f2ed1da5030ab15f96698d5aa4c4de2cdfbd3` |
| `conjugations.png` | dark | 384 × 767 | `b0ed57e54a992021e96a260816595d7b4d69f0818679a132c355bb01731b1a7a` |
| `review.png` | light | 384 × 890 | `75a11998aff67cde2a6a0075e3fa133fc0e2792845ebb126637ab3957647579a` |
| `profile.png` | dark | 384 × 1151 | `489cf683744a72d2fd17ef3b832b39570bf11a6e6c5871da2b74dab4bbd96bd9` |
| `saved-words.png` | light | 384 × 745 | `43d66058e2be5bdd504b256399b222549a7caf09df63c07009335c01d1524803` |
| `recommendations.png` | light | 384 × 957 | `28bbbfe12e25ce214cc1dbcad5066f050a77d7cbe3881977e266d6c4d7b2cbbe` |
| `lesson-complete.png` | dark | 384 × 909 | `7d358c8961e99b15e03d5235e6e6ac36e77b7f9ca31320e0824786cd72fa1a7c` |

## Limitations

Browser simulation only; native insets, keyboard and TalkBack behaviour are not shown. Agent review is not independent native-speaker, educator or accessibility approval.
