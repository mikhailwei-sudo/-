#!/usr/bin/env python3
"""Headless visual smoke test for museum, desktop and mobile.
Run from repo root: python v4/tests/visual_smoke.py
Produces screenshots and machine-readable evidence. No model API keys.
"""
import json
import pathlib
import subprocess
import sys
import time
from playwright.sync_api import sync_playwright

OUT=pathlib.Path("v4/test-results")
OUT.mkdir(parents=True,exist_ok=True)
SERVER=subprocess.Popen([sys.executable,"-m","http.server","8765","--bind","127.0.0.1"],
                        stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
results={}
try:
 time.sleep(2)
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox","--enable-webgl","--use-gl=angle","--use-angle=swiftshader"])
  for mode,size in [("desktop",{"width":1440,"height":900,"device_scale_factor":1}),
                    ("mobile",{"width":390,"height":844,"device_scale_factor":1,"is_mobile":True,"has_touch":True})]:
   config=dict(size)
   config['viewport']={'width':config.pop('width'),'height':config.pop('height')}
   ctx=browser.new_context(**config)
   page=ctx.new_page()
   page.set_default_timeout(25000)
   errors=[]
   page.on("pageerror",lambda e:errors.append("JS: "+str(e)))
   page.on("console",lambda m:errors.append("Console: "+m.text) if m.type=="error" else None)
   try:
    page.goto("http://127.0.0.1:8765/v4/experience.html?diagnostics=1",
              wait_until="domcontentloaded",timeout=60000)
    page.wait_for_function("Boolean(window.__GTR_MUSEUM_AUDIT__)",timeout=75000)
    page.wait_for_timeout(1600)
    screenshots=[]
    for index,name in enumerate(["lobby","china","caravans","kyakhta","russia"]):
     btn=page.get_by_role("button",name=["Холл","Зал 1","Зал 2","Зал 3","Зал 4"][index],exact=True)
     btn.click(timeout=12000)
     page.wait_for_timeout(2700)
     filename=f"{mode}-{name}.png"
     # The diagnostic HUD must not cover real artefacts in review screenshots.
     page.evaluate("""() => {
       for(const el of document.querySelectorAll('.stageCol > div, .stage > div')) {
         if(el.textContent?.includes('GTR · WebGL / mobile QA')) el.style.visibility='hidden';
       }
     }""")
     page.locator(".stage").screenshot(path=str(OUT/filename),animations="disabled",timeout=30000)
     page.evaluate("""() => {for(const el of document.querySelectorAll('.stageCol > div')) if(el.textContent?.includes('GTR · WebGL / mobile QA')) el.style.visibility='visible'}""")
     audit=page.evaluate("window.__GTR_MUSEUM_AUDIT__.getReport()")
     expected='lobby' if index==0 else index
     if audit["selectedRoom"]!=expected:
      errors.append(f"Wrong room: expected {expected}, got {audit['selectedRoom']}")
     if audit["webgl"]["calls"]<1:
      errors.append(f"No WebGL draw calls in {name}")
     screenshots.append({"room":name,"screenshot":filename,"audit":audit})
    results[mode]={"pass":not any(e.startswith(("Wrong room","No WebGL")) for e in errors),
                   "screenshots":screenshots,"errors":errors}
   except Exception as exc:
    page.screenshot(path=str(OUT/f"{mode}-failure.png"),full_page=True)
    results[mode]={"pass":False,"error":str(exc),"errors":errors}
   finally:ctx.close()
  browser.close()
finally:
 SERVER.terminate()
 (OUT/"report.json").write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding="utf-8")
 print(json.dumps({m:{"pass":v["pass"],"errors":v["errors"][:5]} for m,v in results.items()},indent=2,ensure_ascii=False))
if not all(r["pass"] for r in results.values()):sys.exit(1)
