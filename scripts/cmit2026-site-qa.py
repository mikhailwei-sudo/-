#!/usr/bin/env python3
"""CMIT 2026 QA for the actual local GitHub Pages checkout; no concept art or mock screenshots."""
from __future__ import annotations
from playwright.sync_api import sync_playwright
from pathlib import Path
import json, sys

ROOT = "http://127.0.0.1:8765/"
OUT = Path("CMIT2026_submission/site-design-qa")
OUT.mkdir(parents=True, exist_ok=True)
results = []
errors = []

def check(condition, message):
    if not condition:
        errors.append(message)
    results.append({"check": message, "passed": bool(condition)})

def capture(page, name, path, *, scroll=None, click=None, pause=650):
    url = ROOT + path
    try:
        page.goto(url, wait_until="domcontentloaded", timeout=45000)
        page.wait_for_timeout(1500)
        if click:
            loc = page.locator(click)
            if loc.count():
                page.evaluate("(s)=>document.querySelector(s)?.click()", click)
                page.wait_for_timeout(900)
        if scroll:
            loc = page.locator(scroll)
            if loc.count():
                loc.first.scroll_into_view_if_needed(timeout=6000)
                page.wait_for_timeout(pause)
        pathout = OUT / (name + ".png")
        page.screenshot(path=str(pathout), full_page=False, animations="disabled", timeout=25000)
        results.append({"screenshot": pathout.name, "source": path, "status": "captured"})
        print("CAPTURED", name, flush=True)
        return True
    except Exception as exc:
        msg = f"{name}: {str(exc)[:300]}"
        errors.append(msg)
        results.append({"screenshot": name + ".png", "source": path, "status": "failed", "reason": msg})
        print("FAILED", msg, flush=True)
        return False

with sync_playwright() as play:
    browser = play.chromium.launch(headless=True, args=["--no-sandbox", "--disable-dev-shm-usage"])
    context = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    page = context.new_page()
    script_errors = []
    page.on("pageerror", lambda exc: script_errors.append({"url": page.url, "error": str(exc)[:600]}))

    if capture(page, "01_home", "index.html"):
        check(page.locator("#culture-exchange").count() == 1, "Homepage has cultural-exchange section")
        check(page.locator("#grid .card").count() >= 8, "Homepage historical museum collection renders with shared data")
        check(page.locator("#navCulture").count() == 1, "Homepage cultural dialogue navigation exists")
        check(page.locator("html").get_attribute("lang") == "zh", "First-visit language Chinese on homepage")
        check("culture-dialogue.html" in page.locator("#navCulture").get_attribute("href"), "Homepage link points to culture dialogue")
        capture(page, "02_home_culture_section", "index.html", scroll="#culture-exchange")
        capture(page, "04b_route_map", "index.html", scroll="#route-map")

    if capture(page, "03_culture_dialogue", "culture-dialogue.html"):
        check(page.locator("#title").count() == 1 and "茶叶" in page.locator("#title").inner_text(), "Cultural dialogue displays Chinese content")
        check(page.locator(".stage img").count() == 3, "Three cross-cultural historical objects present")
        check(page.locator(".stage img").evaluate_all("(imgs)=>imgs.every(x=>x.complete&&x.naturalWidth>0)"), "All cross-cultural object images load")
        page.locator('[data-answer="1"]').click()
        check("正确" in page.locator("#feedback").inner_text(), "Cultural interaction shows explanation after correct answer")
        page.locator('.lang [data-lang="ru"]').click()
        check("диалог" in page.locator("#title").inner_text().lower(), "Culture dialogue switches to Russian")
        page.locator('.lang [data-lang="zh"]').click()
        capture(page, "04_culture_comparison", "culture-dialogue.html", scroll="#compareTitle")

    if capture(page, "05_museum", "v4/experience.html", scroll="#museum"):
        check(page.locator("#museum-cultural-dialogue").count() == 1, "Museum includes cultural exchange continuation")
        check("史料" in page.locator(".museumArchiveHeader h2").inner_text() or "来源" in page.locator(".museumArchiveHeader h2").inner_text(), "Museum provenance section localized to Chinese")
        capture(page, "06_museum_sources", "v4/experience.html", scroll=".museumArchiveRail")

    if capture(page, "06b_archive", "v4/collection.html"):
        check(page.locator("#entries .entry").count() >= 8, "Archive catalogue renders with its own source cards")
        check(page.locator("html").get_attribute("lang").startswith("zh"), "Archive follows Chinese selection")

    if capture(page, "07_maze", "tea-maze.html", click="#start"):
        check(page.locator("html").get_attribute("lang").startswith("zh"), "Maze respects Chinese initial language")

    if capture(page, "08_packing", "tea-packing.html", click="#play"):
        check(page.locator("html").get_attribute("lang").startswith("zh"), "Packaging respects Chinese initial language")
        check(page.locator("#overlay").evaluate("(el)=>el.hasAttribute('hidden')"), "Packaging enters game after Play")

    if capture(page, "09_caravan", "tea-caravan.html", click="#start"):
        check(page.locator("html").get_attribute("lang").startswith("zh"), "Caravan respects Chinese initial language")

    if capture(page, "10_dictionary", "tea-dictionary.html", scroll="#flashGame"):
        check(page.locator("html").get_attribute("lang").startswith("zh"), "Dictionary respects Chinese initial language")
        check(page.locator("#flashGame").count() == 1, "Dictionary memory-game section is available")

    mcontext = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=1, is_mobile=True, has_touch=True)
    mobile = mcontext.new_page()
    for label, route in [("11_mobile_home", "index.html"), ("12_mobile_culture", "culture-dialogue.html"), ("13_mobile_museum", "v4/experience.html")]:
        if capture(mobile, label, route):
            widths = mobile.evaluate("({viewport: innerWidth, document: document.documentElement.scrollWidth, body: document.body.scrollWidth})")
            check(widths["document"] <= widths["viewport"] + 7, f"{label}: page has no horizontal overflow ({widths})")

    check(len(script_errors) == 0, "Desktop pages have no uncaught JS errors (" + str(script_errors[:3]) + ")")
    context.close()
    mcontext.close()
    browser.close()

(OUT / "qa-report.json").write_text(json.dumps({"checks": results, "errors": errors}, indent=2, ensure_ascii=False), encoding="utf-8")
print("RESULT:", len(errors), "errors", flush=True)
if errors:
    for err in errors:
        print("QA ERROR:", err, flush=True)
    sys.exit(1)
