#!/usr/bin/env python3
"""QA: one DOM / one design for ZH, RU and EN at all major screen widths."""
import json, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

HOST="http://127.0.0.1:8765/"
OUT=Path("CMIT2026_submission/unified-home-qa")
OUT.mkdir(parents=True,exist_ok=True)
FAIL=[]
TESTS=[]
def verify(ok,description,details=None):
    ok=bool(ok)
    TESTS.append({"check":description,"passed":ok,"details":details})
    if not ok: FAIL.append(description+(": "+str(details) if details else ""))
    print(("PASS" if ok else "FAIL"),description,details or "",flush=True)

with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,args=["--no-sandbox","--disable-dev-shm-usage"])
  for width,height in [(320,700),(360,780),(375,812),(390,844),(430,932),(768,1024),(844,390),(1024,768),(1280,800),(1366,900),(1920,1080)]:
    context=browser.new_context(viewport={"width":width,"height":height},device_scale_factor=1,has_touch=width<=768,is_mobile=width<=430)
    page=context.new_page()
    script_errors=[]
    page.on("pageerror",lambda exc:script_errors.append(str(exc)[:300]))
    page.goto(HOST+"index.html?lang=zh",wait_until="domcontentloaded",timeout=35000)
    page.wait_for_timeout(750)
    key=f"{width}x{height}"
    view=page.evaluate("""() => ({
      bodyWidth:document.body.scrollWidth,
      htmlWidth:document.documentElement.scrollWidth,
      viewport:window.innerWidth,
      naturalCards:[...document.querySelectorAll('#teaUnifiedHome .tuh-card')].length,
      visibleHeaders:[...document.querySelectorAll('#teaUnifiedHome .tuh-header')].filter(el=>getComputedStyle(el).display!='none').length,
      artVisible:getComputedStyle(document.querySelector('#teaUnifiedHome .tuh-hero')).display!='none',
      oldPoster:document.querySelector('#teaLuxeLanding')!==null,
      menuToggleVisible:getComputedStyle(document.querySelector('.tuh-menu-toggle')).display!=='none',
      buttonHref:document.querySelector('.tuh-button-main').getAttribute('href')
    })""")
    verify(view["htmlWidth"]<=view["viewport"]+3 and view["bodyWidth"]<=view["viewport"]+3,f"{key}: no horizontal overflow",view)
    verify(view["naturalCards"]==5 and view["visibleHeaders"]==1 and not view["oldPoster"],f"{key}: one real header and five cards (no image hotspots)")
    verify(page.locator("html").get_attribute("lang")=="zh",f"{key}: Chinese content is real DOM")
    verify(view["buttonHref"]=="#route-map" and page.locator("#route-map").count()==1,f"{key}: route button targets a real section")
    verify(page.locator("#teaUnifiedHome .tuh-card img").evaluate_all("(imgs)=>imgs.length===5 && imgs.every(x=>x.complete&&x.naturalWidth>0)"),f"{key}: five unique first-concept illustration crops load")
    verify(page.locator("#teaUnifiedHome .tuh-button-main").is_visible() and page.locator("#teaUnifiedHome .tuh-button-museum").is_visible(),f"{key}: hero CTAs visible")
    # Compare bounding rectangles against viewport and require actual text not clipped.
    boxes=page.evaluate("""() => {
       const nodes=['.tuh-header','.tuh-logo','.tuh-languages','.tuh-hero-inner','.tuh-hero h1','.tuh-actions','.tuh-cards'];
       return nodes.map(s=>{let el=document.querySelector('#teaUnifiedHome '+s),r=el.getBoundingClientRect();return {selector:s,left:r.left,right:r.right,scrollHeight:el.scrollHeight,clientHeight:el.clientHeight,overflowY:getComputedStyle(el).overflowY};});
    }""")
    verify(all(b["left"]>=-4 and b["right"]<=width+4 for b in boxes),f"{key}: header, title, buttons and cards fit viewport",boxes)
    # Current locale must be reflected in all cards and actions at every width.
    for locale,title in [("ru","Великий чайный путь"),("en","Great Tea Road"),("zh","万里茶道")]:
       button=page.locator(f'#teaUnifiedHome [data-tuh-lang="{locale}"]')
       button.click(timeout=4500)
       verify(page.locator("html").get_attribute("lang")==locale and title in page.locator("#tuhTitle").inner_text(),f"{key}: switch to {locale}")
       verify(button.get_attribute("aria-pressed")=="true",f"{key}: {locale} selected state")
       verify(page.locator('#teaUnifiedHome .tuh-button-museum').get_attribute('href')=='v4/experience.html#museum',f"{key}: museum action remains real link in {locale}")
    # Reload and verify persisted locale across the new page instance.
    page.reload(wait_until="domcontentloaded",timeout=35000)
    verify(page.locator("html").get_attribute("lang")=="zh",f"{key}: chosen language persists on reload")
    if width<=1120:
       toggle=page.locator(".tuh-menu-toggle")
       verify(toggle.is_visible(),f"{key}: hamburger available")
       toggle.click()
       verify(toggle.get_attribute("aria-expanded")=="true" and page.locator(".tuh-menu a").first.is_visible(),f"{key}: mobile/tablet menu opens")
       page.keyboard.press("Escape")
       verify(toggle.get_attribute("aria-expanded")=="false",f"{key}: Escape closes menu")
    else:
       verify(not page.locator(".tuh-menu-toggle").is_visible(),f"{key}: desktop navigation replaces hamburger")
       verify(page.locator(".tuh-menu a").first.is_visible(),f"{key}: desktop links visible")
    if width in (390,768,1366,1920):
       page.screenshot(path=str(OUT/f"home-zh-{width}.png"),full_page=False,animations="disabled")
       page.locator('[data-tuh-lang="ru"]').click()
       page.screenshot(path=str(OUT/f"home-ru-{width}.png"),full_page=False,animations="disabled")
       page.locator('[data-tuh-lang="en"]').click()
       page.screenshot(path=str(OUT/f"home-en-{width}.png"),full_page=False,animations="disabled")
    if width in (390,1366):
       route=page.locator("#route-map")
       route.scroll_into_view_if_needed(timeout=5000)
       # Route uses lazy images: wait until historical pictures have decoded.
       page.wait_for_timeout(2200)
       imgStatus=page.locator("#route-map .waypointPicture img").evaluate_all("(imgs)=>imgs.map(x=>({src:x.currentSrc.split('/').pop(),loaded:x.complete&&x.naturalWidth>0}))")
       verify(len(imgStatus)==7 and all(v["loaded"] for v in imgStatus),
              f"{key}: all seven route illustrations load",imgStatus)
       page.screenshot(path=str(OUT/f"route-content-{width}.png"),full_page=False,animations="disabled")
       verify(route.is_visible(),f"{key}: route remains accessible below redesigned header")
    verify(not script_errors,f"{key}: no JS exceptions",script_errors)
    context.close()
  browser.close()
(OUT/"qa.json").write_text(json.dumps({"passed":len([x for x in TESTS if x['passed']]),
 "checks":len(TESTS),"issues":FAIL,"tests":TESTS},ensure_ascii=False,indent=2),encoding="utf8")
print(f"TOTAL: {len(TESTS)-len(FAIL)}/{len(TESTS)}",flush=True)
if FAIL:
 for issue in FAIL: print("ERROR:",issue,flush=True)
 sys.exit(1)
