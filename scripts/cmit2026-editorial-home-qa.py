#!/usr/bin/env python3
"""Chromium browser QA for the real responsive CMIT editorial homepage."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,sys,traceback
OUT=Path("CMIT2026_submission/editorial-home-qa")
OUT.mkdir(parents=True, exist_ok=True)
base="http://127.0.0.1:8765/index.html"
widths=[320,360,375,390,414,600,768,820,1024,1280,1440,1920]
langs=["zh","ru","en"]
results=[]
errors=[]
def check(cond,description,meta=None):
  ok=bool(cond)
  results.append({"passed":ok,"check":description,"metadata":meta or {}})
  print(("PASS " if ok else "FAIL ")+description,flush=True)
  if not ok:errors.append(description)
def shot(page,name):
  filename=OUT/(name+".png")
  page.screenshot(path=str(filename),full_page=False,animations="disabled")
  results.append({"screenshot":name+".png","passed":True})
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox","--disable-dev-shm-usage"])
  for lang in langs:
    for width in widths:
      height=844 if width<=768 else 900
      ctx=browser.new_context(viewport={"width":width,"height":height},device_scale_factor=1,
                              is_mobile=width<=600,has_touch=width<=600)
      page=ctx.new_page()
      page_errors=[]
      page.on("pageerror",lambda err,store=page_errors:store.append(str(err)[:300]))
      try:
        page.goto(base+"?lang="+lang+"&v=editorial-nov3-b",wait_until="domcontentloaded",timeout=35000)
        page.locator("#teaEditorialHome .eh-feature").first.wait_for(state="visible",timeout=10000)
        page.wait_for_timeout(400)
        check(page.locator("html").get_attribute("lang")==lang,lang+" "+str(width)+": selected language")
        check(page.locator("#teaEditorialHome .eh-feature").count()==5,lang+" "+str(width)+": five interactive cards")
        check(page.locator("#teaEditorialHome .eh-hero .eh-btn").count()==2,lang+" "+str(width)+": two primary calls to action")
        check(not page.locator("body > header").is_visible(),lang+" "+str(width)+": old header hidden")
        check(page.locator("#teaEditorialHome").is_visible(),lang+" "+str(width)+": new homepage visible")
        check(page.locator("#teaEditorialHome .eh-map-illustration").count()==1,lang+" "+str(width)+": real CSS/SVG map")
        check(not page.locator(".tl-poster").is_visible() if page.locator(".tl-poster").count() else True,lang+" "+str(width)+": no old image hotspots")
        check(not page.locator("#tea-site-nav").is_visible() if page.locator("#tea-site-nav").count() else True,lang+" "+str(width)+": no duplicate floating navigation")
        widths_data=page.evaluate("""() => {
            const d=document.documentElement, h=document.querySelector('.eh-hero-copy'), n=document.querySelector('.eh-topbar');
            const nrect=n?.getBoundingClientRect();
            return {viewport:innerWidth,doc:d.scrollWidth,
                heroWidth:h?.getBoundingClientRect().width,
                heroScroll:h?.scrollWidth,topbarWidth:nrect?.width,
                headerHasOverflow:n?.scrollWidth>nrect?.width+3}
            }""")
        check(widths_data["doc"]<=widths_data["viewport"]+4,
              lang+" "+str(width)+": no document horizontal overflow",widths_data)
        check(not widths_data["headerHasOverflow"],
              lang+" "+str(width)+": header buttons fit",widths_data)
        check(widths_data["heroScroll"]<=widths_data["heroWidth"]+7,
              lang+" "+str(width)+": hero copy fits",widths_data)
        check(page.locator("#teaEditorialHome .eh-hero h1").inner_text().strip()!="",lang+" "+str(width)+": heading present")
        check(not page_errors,lang+" "+str(width)+": no page JavaScript errors",{"errors":page_errors})
        if width in [390,768,1440,1920]:
          imgs=page.locator("#teaEditorialHome .eh-feature img").evaluate_all(
            "(xs)=>xs.map(x=>({url:x.getAttribute('src'),complete:x.complete,loaded:x.naturalWidth>0}))")
          check(all(x["loaded"] for x in imgs),lang+" "+str(width)+": five real images loaded",{"images":imgs})
          shot(page,"homepage-"+lang+"-"+str(width))
        if width<=1024:
          toggle=page.locator("#teaEditorialHome .eh-menu-toggle")
          check(toggle.is_visible(),lang+" "+str(width)+": mobile/tablet menu visible")
          toggle.click()
          check(page.locator("#teaEditorialHome .eh-nav").is_visible(),lang+" "+str(width)+": mobile/tablet menu opens")
          check(toggle.get_attribute("aria-expanded")=="true",lang+" "+str(width)+": menu accessible expanded state")
          page.keyboard.press("Escape")
          check(not page.locator("#teaEditorialHome .eh-nav").is_visible(),lang+" "+str(width)+": Escape closes menu")
        if width==1440:
          for testlang in ["zh","ru","en"]:
            page.locator('[data-eh-lang="'+testlang+'"]').click()
            check(page.locator("html").get_attribute("lang")==testlang,lang+" "+str(width)+": click language -> "+testlang)
            check(page.locator(".eh-hero h1").inner_text().strip()!="",lang+" "+str(width)+": translated hero "+testlang)
          links=page.locator("#teaEditorialHome .eh-feature").evaluate_all("(nodes)=>nodes.map(n=>n.getAttribute('href'))")
          check(links==["#route-map","v4/experience.html#museum","culture-dialogue.html","tea-adventure.html","tea-dictionary.html"],
                 lang+" "+str(width)+": card destinations correct",{"links":links})
      except Exception as exc:
        info=lang+" "+str(width)+": unhandled test exception "+str(exc)[:450]
        errors.append(info)
        print("EXCEPTION "+info,flush=True)
      finally:
        ctx.close()
  browser.close()
(OUT/"report.json").write_text(json.dumps({"summary":{"passed":sum(bool(x.get("passed")) for x in results if "check" in x),"tests":len([x for x in results if "check" in x]),"errors":len(errors)},"results":results,"errors":errors},ensure_ascii=False,indent=2),encoding="utf8")
print("FINAL QA:",len(errors),"errors",flush=True)
for err in errors[:20]:print("QA ERROR",err,flush=True)
sys.exit(0 if not errors else 1)
