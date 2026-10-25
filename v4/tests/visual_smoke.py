#!/usr/bin/env python3
"""Headless visual smoke test for museum, desktop and mobile.
Run from repo root: python v4/tests/visual_smoke.py
Produces screenshots and machine-readable evidence. No model API keys.
"""
import json
import base64
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
   cdp=ctx.new_cdp_session(page)
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
    for index,(name,caption,expected) in enumerate([("lobby","Холл","lobby"),("china","Китай",1),("caravans","Караваны",2),("geography","География",5),("kyakhta","Кяхта",3),("russia","Россия",4),("merchants","Купцы",6),("cultures","Культуры",7)]):
     btn=page.get_by_role("button",name=caption,exact=True)
     btn.click(timeout=12000)
     page.wait_for_function(
      "() => {const r=window.__GTR_MUSEUM_AUDIT__.getReport();return Math.abs(r.camera.x-r.camera.targetX)<0.8}",
      timeout=30000)
     page.wait_for_timeout(350)
     filename=f"{mode}-{name}.png"
     page.locator(".museum-qa-overlay").evaluate("(el) => el.style.visibility='hidden'")
     # The WebGL stage continuously animates; Playwright's element screenshot
     # waits for a stable layout indefinitely on desktop. Capture the rendered
     # viewport through Chromium directly, without that stability prerequisite.
     page.evaluate("""() => document.getElementById('renderStage').scrollIntoView({
         behavior:'instant',block:'center',inline:'nearest'
     })""")
     page.wait_for_timeout(500)
     shot=cdp.send("Page.captureScreenshot",{"format":"png","captureBeyondViewport":False})
     (OUT/filename).write_bytes(base64.b64decode(shot["data"]))
     page.locator(".museum-qa-overlay").evaluate("(el) => el.style.visibility='visible'")
     audit=page.evaluate("window.__GTR_MUSEUM_AUDIT__.getReport()")
     if audit["selectedRoom"]!=expected:
      errors.append(f"Wrong room: expected {expected}, got {audit['selectedRoom']}")
     if audit["webgl"]["calls"]<1:
      errors.append(f"No WebGL draw calls in {name}")
     screenshots.append({"room":name,"screenshot":filename,"audit":audit})
    results[mode]={"pass":not any(e.startswith(("Wrong room","No WebGL")) for e in errors),
                   "screenshots":screenshots,"errors":errors}
   except Exception as exc:
    try:
     page.screenshot(path=str(OUT/f"{mode}-failure.png"),full_page=False,timeout=5000,animations="disabled")
    except Exception as screenshot_error:
     errors.append("Failure screenshot unavailable: "+str(screenshot_error)[:180])
    results[mode]={"pass":False,"error":str(exc),"errors":errors}
   finally:ctx.close()
  browser.close()
finally:
 SERVER.terminate()
 (OUT/"report.json").write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding="utf-8")
 print(json.dumps({m:{"pass":v["pass"],"errors":v["errors"][:5]} for m,v in results.items()},indent=2,ensure_ascii=False))
if not all(r["pass"] for r in results.values()):sys.exit(1)
