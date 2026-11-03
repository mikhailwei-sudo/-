#!/usr/bin/env python3
"""Capture real, current CMIT 2026 web evidence. Only local website/browser screenshots."""
from __future__ import annotations

import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "CMIT2026_submission" / "2026-refresh" / "live-qa"
URL = "http://127.0.0.1:8765"
OUT.mkdir(parents=True, exist_ok=True)
report = {"source": "live Chromium/Playwright; current checkout", "screenshots": [], "checks": {}}

def serve_if_needed():
    try:
        urllib.request.urlopen(URL + "/index.html", timeout=2).read(20)
        return None
    except Exception:
        proc = subprocess.Popen([sys.executable, "-m", "http.server", "8765",
            "--bind", "127.0.0.1"], cwd=ROOT, stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL)
        for _ in range(40):
            try:
                urllib.request.urlopen(URL + "/index.html", timeout=1).read(20)
                return proc
            except Exception:
                time.sleep(.2)
        proc.terminate()
        raise RuntimeError("Local source server failed to start")

def snap(page, name):
    path = OUT / name
    page.screenshot(path=str(path), full_page=False, animations="disabled")
    report["screenshots"].append(name)

proc = serve_if_needed()
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=["--no-sandbox"])
        page = browser.new_page(viewport={"width": 1440, "height": 1024}, device_scale_factor=1)
        page.goto(URL + "/index.html", wait_until="domcontentloaded")
        page.locator("#teaEditorialHome .eh-feature").first.wait_for(timeout=25000)
        page.evaluate("document.fonts.ready")
        expected = {
          "zh": ["茶道路线", "3D博物馆", "文化对话", "互动游戏", "茶路词典"],
          "ru": ["Маршрут", "3D-музей", "Диалог культур", "Игры", "Словарь"],
          "en": ["Tea Route", "3D Museum", "Cultural Dialogue", "Games", "Dictionary"],
        }
        for lang in ("zh", "ru", "en"):
            page.locator(f'#teaEditorialHome [data-eh-lang="{lang}"]').click()
            page.wait_for_timeout(150)
            titles = page.locator("#teaEditorialHome .eh-feature h3").all_text_contents()
            if titles != expected[lang]:
                raise AssertionError(f"Homepage {lang} card titles: {titles!r}")
            report["checks"][f"home_cards_{lang}"] = titles
            snap(page, f"home-{lang}-1440.png")
        imgs = page.locator("#teaEditorialHome .eh-feature .eh-image img")
        failures = imgs.evaluate_all("""imgs=>imgs.filter(x=>!x.complete || !x.naturalWidth).map(x=>x.getAttribute('src'))""")
        if failures: raise AssertionError(f"Broken homepage images: {failures}")
        report["checks"]["homepage_images_loaded"] = imgs.count()
        photo_paths = page.locator("#teaEditorialHome .eh-feature .eh-image-photo img").evaluate_all(
          "imgs=>imgs.map(x=>x.getAttribute('src'))")
        if len(photo_paths) != len(set(photo_paths)):
            raise AssertionError("Duplicate photo covers")
        report["checks"]["unique_historical_cover_photos"] = photo_paths
        mascot_paths = page.locator("#teaEditorialHome .eh-image-games img").evaluate_all(
          "imgs=>imgs.map(x=>x.getAttribute('src'))")
        assert mascot_paths == ["game-assets/nik-portrait.png", "game-assets/chaer-portrait.png"], mascot_paths
        report["checks"]["approved_mascot_assets"] = mascot_paths

        page.set_viewport_size({"width": 390, "height": 844})
        page.locator('#teaEditorialHome [data-eh-lang="zh"]').click()
        snap(page, "home-zh-mobile-390.png")
        report["checks"]["mobile_horizontal_overflow"] = page.evaluate(
          "document.documentElement.scrollWidth>window.innerWidth+2")
        if report["checks"]["mobile_horizontal_overflow"]:
            raise AssertionError("Mobile page overflows horizontally")

        page.set_viewport_size({"width": 1440, "height": 1024})
        page.goto(URL + "/tea-dictionary.html", wait_until="domcontentloaded")
        page.locator("#flashMain").wait_for(timeout=25000)
        for lang in ("en", "zh", "ru"):
            page.locator(f'.langs [data-lang="{lang}"]').click()
            direction = page.locator("#flashDirection").input_value()
            expected_dir = {"en":"en-zh","zh":"zh-ru","ru":"ru-zh"}[lang]
            if direction != expected_dir:
                raise AssertionError(f"Dictionary {lang} direction: {direction} != {expected_dir}")
            score = page.locator("#fgPointsLabel").inner_text()
            expected_score = {"en":"Points","zh":"积分","ru":"Очки"}[lang]
            if score != expected_score:
                raise AssertionError(f"Dictionary {lang} score label: {score}")
            face = page.locator("#flashMain").inner_text()
            if not face.strip(): raise AssertionError(f"Empty {lang} flash card")
            report["checks"][f"dictionary_{lang}"] = {"front":face, "direction":direction, "score":score}
            page.locator("#flashCard").click()
            if page.locator("#flashTranslations").is_hidden():
                raise AssertionError(f"Third-language translation hidden in {lang}")
            snap(page, f"dictionary-{lang}-1440.png")
            page.locator("#flashCard").click()
        browser.close()
finally:
    if proc:
        proc.terminate()
        proc.wait(timeout=8)
(OUT / "live-qa-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
print("CMIT_LIVE_QA_PASS", len(report["screenshots"]), "screenshots and", len(report["checks"]), "checks")
