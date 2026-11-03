#!/usr/bin/env python3
"""Derive text-free decorative crops from the already-approved first-concept art.

These assets are visual details only. Navigation, titles, captions and buttons
must always be genuine localized HTML, never invisible hotspots or baked labels.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/"assets/home-luxe-first-design.avif"
TARGET=ROOT/"assets"
if not SOURCE.is_file():
    raise FileNotFoundError("Expected approved first-concept image at "+str(SOURCE))

with Image.open(SOURCE) as source:
    src=source.convert("RGB")
    if src.size != (1672,941):
        raise ValueError("Unexpected concept dimensions: "+str(src.size))

    crops={
        # Include artefacts/architecture; avoid large Chinese headlines or navigation.
        "home-luxe-hero-left.webp": (0,282,515,501),
        "home-luxe-hero-right.webp": (1201,201,1672,501),
        # Five distinct regions below the headings, with no labels built in.
        "home-luxe-card-route.webp": (54,605,347,784),
        "home-luxe-card-culture.webp": (376,610,659,783),
        "home-luxe-card-museum.webp": (682,610,984,781),
        "home-luxe-card-games.webp": (996,606,1300,782),
        "home-luxe-card-dictionary.webp": (1308,607,1609,783),
        "home-luxe-border.webp": (0,885,1672,941),
    }

    for name, rect in crops.items():
        img=src.crop(rect)
        if name == "home-luxe-border.webp":
            # Keep the ornate bottom silhouette but cap the image size.
            img=ImageOps.contain(img,(1500,90),Image.Resampling.LANCZOS)
        elif "hero" in name:
            img=ImageOps.contain(img,(840,500),Image.Resampling.LANCZOS)
        else:
            img=ImageOps.contain(img,(600,360),Image.Resampling.LANCZOS)
        path=TARGET/name
        img.save(path,"WEBP",quality=84,method=6)
        print(f"ART {path.relative_to(ROOT)}  {img.size}  {path.stat().st_size} bytes",flush=True)
