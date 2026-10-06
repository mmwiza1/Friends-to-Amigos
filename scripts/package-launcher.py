#!/usr/bin/env python3
"""Resample reviewed mascot derivatives into local Android launcher resources.

Pillow is only an optional development tool; it is not an app/build dependency.
This does not edit the original lesson sprite sheet or invent new artwork.
"""
from pathlib import Path
import json
import math
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "android/launcher-artwork"
RES = ROOT / "android/app/src/main/res"
BACKGROUND = (255, 249, 239, 255)
DENSITIES = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}


def foreground(source):
    """Place visible artwork inside Android's 66dp safe circle on a 108dp layer."""
    alpha = source.getchannel("A")
    box = alpha.getbbox()
    centre = ((box[0] + box[2]) / 2, (box[1] + box[3]) / 2)
    # Sub-3% alpha edge interpolation is visually negligible. All meaningful
    # pixels, including horns/ears, have a 1dp margin within the 66dp safe zone.
    radius = max(math.hypot(x - centre[0], y - centre[1])
                 for y in range(source.height) for x in range(source.width)
                 if alpha.getpixel((x, y)) >= 8)
    scale = (32 * 4) / radius
    size = tuple(round(n * scale) for n in source.size)
    result = Image.new("RGBA", (432, 432))
    resized = source.resize(size, Image.Resampling.LANCZOS)
    location = (round(216 - centre[0] * scale), round(216 - centre[1] * scale))
    result.alpha_composite(resized, location)
    return result


colour = foreground(Image.open(ART / "bull-face.png").convert("RGBA"))
mono = foreground(Image.open(ART / "bull-face-monochrome.png").convert("RGBA"))
nodpi = RES / "drawable-nodpi"
nodpi.mkdir(parents=True, exist_ok=True)
colour.save(nodpi / "launcher_bull.png", optimize=True)
mono.save(nodpi / "launcher_bull_monochrome.png", optimize=True)

# The visible Android mask covers the central 72dp of a 108dp adaptive layer.
visible = Image.new("RGBA", (288, 288), BACKGROUND)
visible.alpha_composite(colour.crop((72, 72, 360, 360)))
for density, size in DENSITIES.items():
    target = RES / ("mipmap-" + density)
    target.mkdir(parents=True, exist_ok=True)
    legacy = visible.resize((size, size), Image.Resampling.LANCZOS)
    legacy.save(target / "ic_launcher.png", optimize=True)
    mask = Image.new("L", (size * 4, size * 4))
    ImageDraw.Draw(mask).ellipse((0, 0, size * 4 - 1, size * 4 - 1), fill=255)
    legacy.putalpha(mask.resize((size, size), Image.Resampling.LANCZOS))
    legacy.save(target / "ic_launcher_round.png", optimize=True)

# Review-only mask sheet, not packaged into the APK. These are representative
# circle, rounded-square, and Samsung-style superellipse masks, not screenshots.
tile = 224
preview = Image.new("RGBA", (tile * 4, tile + 42), (21, 32, 52, 255))
for index, label in enumerate(("Circle", "Rounded square", "Squircle", "Themed")):
    icon = visible.resize((192, 192), Image.Resampling.LANCZOS)
    mask = Image.new("L", (768, 768))
    draw = ImageDraw.Draw(mask)
    if index in (0, 3):
        draw.ellipse((0, 0, 767, 767), fill=255)
    elif index == 1:
        draw.rounded_rectangle((0, 0, 767, 767), radius=160, fill=255)
    else:
        # Superellipse exponent 4 is representative of common squircle masks.
        for y in range(768):
            for x in range(768):
                if abs((x - 383.5) / 383.5) ** 4 + abs((y - 383.5) / 383.5) ** 4 <= 1:
                    mask.putpixel((x, y), 255)
    if index == 3:
        icon = Image.new("RGBA", (288, 288), (242, 224, 217, 255))
        tint = Image.new("RGBA", (288, 288), (121, 49, 29, 255))
        tint.putalpha(mono.crop((72, 72, 360, 360)).getchannel("A"))
        icon.alpha_composite(tint)
        icon = icon.resize((192, 192), Image.Resampling.LANCZOS)
    icon.putalpha(mask.resize((192, 192), Image.Resampling.LANCZOS))
    preview.alpha_composite(icon, (index * tile + 16, 16))
    ImageDraw.Draw(preview).text((index * tile + 16, 220), label, fill="white")
preview.save(ART / "launcher-preview.png", optimize=True)

geometry = {"adaptiveLayerDp": 108, "visibleMaskDp": 72,
            "safeCircleDiameterDp": 66, "artworkRadiusDp": 32,
            "foregroundPixels": 432, "legacyDensities": DENSITIES}
(ART / "geometry.json").write_text(json.dumps(geometry, indent=2) + "\n")
print("Packaged mascot launcher resources; original lesson artwork unchanged.")
