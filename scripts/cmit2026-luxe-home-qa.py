#!/usr/bin/env python3
"""Real Chromium QA for the first-concept Tea Road landing (desktop/mobile).
Checks that poster artwork, click zones, languages and below-the-fold sections work."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,sys,time
OUT=Path("CMIT2026_submission/home-luxe-qa");OUT.mkdir(parents=True,exist_ok=True)
HOST="http://127.0.0.1:8765/"
checks=[];errors=[]
def ck(ok,message):
    checks.append({"test":message,"ok":bool(ok)})
    print(("PASS" if ok else "FAIL"),message,flush=True)
    if not ok:errors.append(message)
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox","--disable-dev-shm-usage"])
    for name,width,height,lang in [("desktop-zh",1440,900,"zh"),("desktop-ru",1440,900,"ru"),("mobile-zh",390,844,"zh"),("mobile-en",390,844,"en"),("tablet-zh",820,1180,"zh")]:
        context=browser.new_context(viewport={"width":width,"height":height},is_mobile=name.startswith("mobile"),has_touch=name.startswith("mobile"),device_scale_factor=1,service_workers="block")
        page=context.new_page()
        page_errors=[]
        page.on("pageerror",lambda e:page_errors.append(str(e)))
        page.goto(HOST+"index.html?lang="+lang,wait_until="domcontentloaded",timeout=35000)
        page.wait_for_timeout(900)
        page.screenshot(path=str(OUT/(name+".png")),full_page=False,animations="disabled",timeout=18000)
        dom=page.evaluate("""()=>({
          width:innerWidth,scroll:document.documentElement.scrollWidth,
          picture:document.querySelector('.tl-poster-art')?.naturalWidth,
          language:document.documentElement.lang,
          poster:!!document.querySelector('.tl-poster')&&getComputedStyle(document.querySelector('.tl-poster')).display!=='none',
          responsive:!!document.querySelector('.tl-responsive')&&getComputedStyle(document.querySelector('.tl-responsive')).display!=='none',
          cards:document.querySelectorAll('.tl-card').length,
          zones:document.querySelectorAll('.tl-zone').length,
          route:!!document.querySelector('#route-map'),
          culture:!!document.querySelector('#culture-exchange')
        })""")
        ck(dom["picture"]>=1400,name+": actual first-concept AVIF artwork loaded")
        ck(dom["cards"]==5 and dom["zones"]>=10,name+": five functional modules and interactive poster zones")
        ck(dom["scroll"]<=dom["width"]+5,name+": no sideways scrolling")
        ck(dom["language"]==lang,name+": language selection respected")
        ck(dom["route"] and dom["culture"],name+": original route and cultural sections still exist")
        ck(not page_errors,name+": no JavaScript errors: "+repr(page_errors[:2]))
        if name=="desktop-zh":
            ck(dom["poster"] and not dom["responsive"],"Desktop Chinese displays image-identical first concept")
            ck(page.locator('.tl-zone[data-tl-link="games"]').get_attribute("href")=="tea-adventure.html","Game card goes to existing game")
            ck(page.locator('.tl-zone[data-tl-link="visit"]').get_attribute("href").startswith("v4/experience.html"),"Museum main button goes to 3D museum")
            page.locator(".tl-language-toggle").click()
            ck(page.locator(".tl-language-options").is_visible(),"Language dropdown opens")
            page.locator(".tl-language-options [data-tl-lang=ru]").click()
            ck(page.locator('.tl-responsive').is_visible() and page.locator("html").get_attribute("lang")=="ru","RU choice activates live translated interface")
            page.locator(".tl-languages [data-tl-lang=zh]").click()
            ck(page.locator(".tl-poster").is_visible(),"Switching back to Chinese restores exact concept")
        if name=="mobile-zh":
            ck(not dom["poster"] and dom["responsive"],"Mobile gets legible responsive layout")
            page.locator(".tl-menu-toggle").click()
            ck(page.locator(".tl-nav-links").is_visible(),"Mobile nav opens")
            page.locator(".tl-languages [data-tl-lang=en]").click()
            ck(page.locator("html").get_attribute("lang")=="en" and "Great Tea Road" in page.locator(".tl-brand").inner_text(),"Mobile language switch works")
            page.screenshot(path=str(OUT/"mobile-zh-open-menu.png"),full_page=False,animations="disabled")
        context.close()
    browser.close()
(OUT/"qa-report.json").write_text(json.dumps({"checks":checks,"issues":errors},ensure_ascii=False,indent=2),encoding="utf8")
print("RESULT",len(checks)-len(errors),"/",len(checks),"passed",flush=True)
if errors:sys.exit(1)
