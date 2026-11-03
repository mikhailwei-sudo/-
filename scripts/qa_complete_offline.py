#!/usr/bin/env python3
"""On GitHub Actions: browser QA for the distributable ZIP's exact extracted site,
with all non-local network requests blocked (no CDN, no maps, no remote fonts).
"""
from __future__ import annotations
from functools import partial
import http.server
import json
from pathlib import Path
import threading
import urllib.parse
from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout

ROOT=Path(__file__).resolve().parents[1]/".offline-build"/"Tea_Road_2026_COMPLETE_OFFLINE"
if not ROOT.is_dir(): raise RuntimeError("Build first: python scripts/build_complete_offline.py")
server=http.server.ThreadingHTTPServer(("127.0.0.1",8765),
 partial(http.server.SimpleHTTPRequestHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
ORIGIN="http://127.0.0.1:8765/"
report={"origin":ORIGIN,"checks":[],"remote_requests":[],"pageerrors":[],"missing_local":[]}
def check(ok,message):
 report["checks"].append({"ok":bool(ok),"check":message})
 print(("PASS " if ok else "FAIL ")+message,flush=True)
 if not ok: raise AssertionError(message)
def blocked_route(route):
 url=route.request.url
 host=urllib.parse.urlsplit(url).hostname
 if host not in ("127.0.0.1","localhost"):
  report["remote_requests"].append(url)
  route.abort("internetdisconnected")
 else:route.continue_()
def open_page(page,path):
 page.goto(ORIGIN+path,wait_until="domcontentloaded",timeout=30000)
 page.wait_for_timeout(450)
 return page
try:
 with sync_playwright() as playwright:
  browser=playwright.chromium.launch(headless=True,args=[
   "--no-sandbox","--disable-dev-shm-usage","--enable-webgl",
   "--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
  ctx=browser.new_context(viewport={"width":1366,"height":870},device_scale_factor=1,service_workers="block")
  ctx.route("**/*",blocked_route)
  page=ctx.new_page()
  page.on("pageerror",lambda e:report["pageerrors"].append({"url":page.url,"error":str(e)[:400]}))
  page.on("response",lambda r:report["missing_local"].append({"url":r.url,"status":r.status}) if r.status>=400 and r.url.startswith(ORIGIN) else None)
  open_page(page,"index.html")
  page.locator("#teaEditorialHome .eh-feature").first.wait_for(timeout=10000)
  check(page.locator("#teaEditorialHome .eh-feature").count()==5,"New editorial homepage shows all five feature cards")
  check(page.locator("#teaEditorialHome .eh-game-portrait-slot img").count()==2,"Full-quality Nik and Chaer portraits displayed")
  image_load=page.locator("#teaEditorialHome .eh-game-portrait-slot img").evaluate_all("els=>els.every(e=>e.complete && e.naturalWidth>0)")
  check(image_load,"Both mascots load from local assets")
  for lang,wanted in [("zh","3D博物馆"),("ru","3D-музей"),("en","3D Museum")]:
   page.locator(f'#teaEditorialHome [data-eh-lang="{lang}"]').click()
   check(wanted in page.locator('#teaEditorialHome [data-e-feature="museum"]').inner_text(),f"Homepage language {lang}")
  for key,dest in [("culture","culture-dialogue.html"),("dictionary","tea-dictionary.html"),("games","tea-adventure.html"),("archive","v4/collection.html"),("museum","v4/experience.html")]:
   open_page(page,"index.html")
   if key=="archive":
    page.locator('#teaEditorialHome .eh-nav [data-editorial-text="archive"]').click()
   else:page.locator(f'#teaEditorialHome [data-e-feature="{key}"]').click()
   page.wait_for_timeout(350)
   check(dest in page.url,f"Clickable homepage {key} opens {dest}")
  open_page(page,"index.html")
  page.locator('#teaEditorialHome [data-e-feature="route"]').click()
  check("route-map" in page.url,"Route card opens the actual local map section")
  # Museum: Three.js, modules and imported models are all served from this bundle.
  open_page(page,"v4/experience.html")
  page.locator("#renderStage canvas").first.wait_for(timeout=28000)
  check(page.locator("#renderStage canvas").count()>0,"3D museum WebGL canvas initializes without a CDN")
  page.wait_for_timeout(10000)
  check(not any("vendor/addons/" in r["url"] for r in report["missing_local"]),"All local Three.js addon modules resolve")
  check(not any("/assets/models/" in r["url"] for r in report["missing_local"]),"All imported GLB/FBX/DAE model files resolve")
  open_page(page,"v4/collection.html")
  page.locator("#entries .entry").first.wait_for(timeout=10000)
  check(page.locator("#entries .entry").count()>=8,"Historical archive entries render")
  open_page(page,"culture-dialogue.html")
  check(page.locator(".stage img").count()==3,"Culture dialogue renders three local photographs")
  check(page.locator(".stage img").evaluate_all("imgs=>imgs.every(x=>x.complete && x.naturalWidth>0)"),"All dialogue photos loaded without internet")
  open_page(page,"tea-dictionary.html")
  page.locator(".langs [data-lang='en']").click()
  check(page.locator("#flashDirection").input_value()=="en-zh","English flashcards start on the English side")
  open_page(page,"tea-adventure.html")
  page.locator("iframe#stage").first.wait_for(timeout=12000)
  check("tea-maze.html" in page.locator("iframe#stage").get_attribute("src"),"Three-stage game starts with the maze")
  open_page(page,"tea-maze.html")
  page.locator("#start").click(timeout=5000)
  check(page.locator("canvas").count()>0,"Maze game starts offline")
  open_page(page,"tea-packing.html")
  page.locator("#play").click(timeout=5000)
  check(page.locator("#overlay").get_attribute("hidden") is not None,"Packing game starts offline")
  open_page(page,"tea-caravan.html")
  page.locator("#start").click(timeout=5000)
  page.wait_for_timeout(1200)
  check(page.locator("canvas").count()>0,"Caravan game starts offline")
  open_page(page,"v4/archive-concept.html")
  check(len(page.title())>3,"Historical archive prototype opens")
  open_page(page,"artifact-lab.html")
  page.wait_for_timeout(1000)
  check(not any("cdn.jsdelivr.net" in u for u in report["remote_requests"]),"Artifact lab uses local Three.js")
  open_page(page,"museum.html")
  page.wait_for_timeout(1000)
  check(not any("three@0.170.0" in u for u in report["remote_requests"]),"Old museum viewer also uses local Three.js")
  # Touch form factor.
  mobile=browser.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,service_workers="block")
  mobile.route("**/*",blocked_route)
  mob=mobile.new_page()
  open_page(mob,"index.html")
  mob.locator("#teaEditorialHome").first.wait_for(timeout=10000)
  check(mob.locator("#teaEditorialHome").is_visible(),"Mobile current homepage visible")
  check(mob.evaluate("document.documentElement.scrollWidth<=window.innerWidth+5"),"Mobile homepage has no horizontal clipping")
  mob.locator("#teaEditorialHome .eh-menu-toggle").click()
  check(mob.locator("#teaEditorialHome").evaluate("(el)=>el.classList.contains('eh-menu-open')"),"Mobile menu opens offline")
  mob.locator('#teaEditorialHome .eh-nav [data-editorial-text="dictionary"]').click()
  check("tea-dictionary.html" in mob.url,"Mobile menu navigates to dictionary")
  mobile.close()
  check(len(report["remote_requests"])==0,"Site makes zero network requests outside localhost")
  check(len(report["pageerrors"])==0,"No uncaught JavaScript errors in exercised pages")
  check(len(report["missing_local"])==0,"No local 404s in exercised pages")
  ctx.close()
  browser.close()
finally:
 server.shutdown();server.server_close()
ROOT.parent.joinpath("offline-qa-report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
print("COMPLETE_OFFLINE_QA_PASS",len(report["checks"]),"checks; external calls",len(report["remote_requests"]),flush=True)
