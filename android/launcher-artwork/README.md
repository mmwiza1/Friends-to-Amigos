# Mascot launcher artwork

The normal launcher uses the happy chibi bull face derived from the existing
`www/images/lesson-bulls.webp` mascot. The original sprite sheet is unchanged.
The head-only colour and monochrome derivatives were prepared with the image
editing tool, then reviewed and resampled into Android resources.

`scripts/package-launcher.py` reproduces density assets and the preview from the
reviewed source PNGs. It requires Pillow only for optional development packaging;
Android builds use the committed resources and need no Python dependency.

The full-colour bull is used by normal launchers. Android 13+ launchers may opt
into the separately supplied monochrome layer when the user enables themed
icons. A fixed cream background retains the same appearance in light/dark mode.

Meaningful foreground pixels fit within a 64dp diameter circle, leaving margin
inside Android's 66dp adaptive safe zone. Horns, ears and hair remain visible
under circle, rounded-square and representative Samsung-style squircle masks.
`launcher-preview.png` is a packaging review illustration, not a device capture;
actual launcher rendering should still be checked on a physical Samsung device.
