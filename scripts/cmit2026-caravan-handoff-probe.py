#!/usr/bin/env python3
"""Reproduce skip-second-cutscene -> caravan and language switching in Chromium."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json, sys
OUT=Path("CMIT2026_submission/caravan-qa")
OUT.mkdir(parents=True,exist_ok=True)
ORIGIN="http://127.0.0.1:8765/"
allchecks=[]
issues=[]
def logcheck(ok,text):
    allchecks.append({"ok":bool(ok),"test":text})
    if not ok: issues.append(text)
    print(("PASS" if ok else "FAIL"),text,flush=True)
def diagnostic(page,tag):
    payload=page.evaluate("""() => {
const f=document.querySelector('#stage'),w=f?.contentWindow,doc=f?.contentDocument;
const $=id=>doc?.getElementById(id);
let vars={}; for(let key of ['mode','elapsed','language','frame','teaFrameErrorShown']){
 try{ vars[key]=w.eval(key)}catch(e){vars[key]='Error: '+e.message}
}
return {
parentURL:location.href, frameURL:w?.location?.href, readyState:doc?.readyState,
cutStage:window.cutStage, current:window.current,
transitionShown:document.querySelector('#transition')?.classList.contains('show'),
iframeClass:f?.className,iframeRect:(()=>{let r=f?.getBoundingClientRect();return {x:r?.x,y:r?.y,w:r?.width,h:r?.height}})(),
gameLang:doc?.documentElement?.lang,parentLang:document.documentElement.lang,
header:doc?.querySelector('header h1')?.textContent,
languageFlagRU:$('languageToolbar')?.querySelector('[data-lang="ru"]')?.getAttribute('aria-pressed'),
select:$('language')?.value,overlayHidden:$('overlay')?.hidden,
canvasW:$('game')?.width,canvasH:$('game')?.height,vars
};
}""")
    print("STATE",tag,json.dumps(payload,ensure_ascii=False),flush=True)
    return payload
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,args=["--no-sandbox","--disable-dev-shm-usage"])
    context=browser.new_context(viewport={"width":1366,"height":850})
    page=context.new_page()
    jsErrors=[]
    consoleErrors=[]
    page.on("pageerror",lambda e:jsErrors.append({"url":page.url,"message":str(e)[:400]}))
    page.on("console",lambda m:consoleErrors.append({"url":page.url,"message":m.text[:400]}) if m.type=="error" else None)
    page.goto(ORIGIN+"tea-dictionary.html",wait_until="domcontentloaded")
    page.evaluate("()=>{sessionStorage.setItem('teaAdventureStage','2');sessionStorage.setItem('teaAdventureLanguage','zh');localStorage.setItem('gtr-lang','zh')}")
    page.goto(ORIGIN+"tea-adventure.html",wait_until="domcontentloaded")
    page.wait_for_timeout(1700)
    before=diagnostic(page,"stage2-before-cut")
    page.evaluate("startCut(2)")
    page.wait_for_timeout(550)
    logcheck(page.locator("#transition.show").count()==1,"Second cutscene opens")
    page.screenshot(path=str(OUT/"01_second_cutscene.png"))
    page.locator("#enterWorkshop").click(timeout=5000)
    page.wait_for_timeout(5000)
    after=diagnostic(page,"stage3-after-skip")
    page.screenshot(path=str(OUT/"02_third_game_after_skip.png"))
    logcheck("tea-caravan.html" in (after["frameURL"] or ""),"Skip switches iframe to caravan")
    logcheck(after["overlayHidden"] is True,"Caravan is running, splash overlay hidden")
    logcheck(not after["transitionShown"],"Cutscene overlay dismissed")
    logcheck(after["vars"].get("mode")=="playing","Caravan internal state is playing")
    logcheck(after["vars"].get("teaFrameErrorShown") is False,"Caravan never encounters a rendering exception")
    elapsed1=after["vars"].get("elapsed",0)
    page.wait_for_timeout(1250)
    after2=diagnostic(page,"stage3-running")
    logcheck(isinstance(elapsed1,(int,float)) and isinstance(after2["vars"].get("elapsed"),(float,int)) and after2["vars"]["elapsed"]>elapsed1+0.5,"Caravan game clock advances")
    page.locator("#adventureLang").select_option("ru")
    page.wait_for_timeout(650)
    ru=diagnostic(page,"parent-switched-ru")
    logcheck(ru["gameLang"]=="ru" and "караван" in (ru["header"] or "").lower(),"Parent RU selector changes caravan UI")
    page.locator("#adventureLang").select_option("zh")
    page.wait_for_timeout(650)
    zh=diagnostic(page,"parent-switched-zh")
    logcheck(zh["gameLang"] in ("zh","zh-CN") and "万里" in (zh["header"] or ""),"Parent Chinese selector changes caravan UI")
    try:
        frame=page.frame_locator("iframe#stage")
        frame.locator('.flagLanguages [data-lang="en"]').click(timeout=3000)
        page.wait_for_timeout(500)
        en=diagnostic(page,"caravan-switched-en")
        logcheck(en["gameLang"]=="en" and "Caravan" in (en["header"] or ""),"Caravan EN selector changes caravan UI")
        logcheck(page.locator("#adventureLang").input_value()=="en","In-game language switch syncs parent selector")
    logcheck(en["parentLang"]=="en","Parent page also displays English after in-game switch")
    except Exception as ex:
        issues.append("Game language button exception: "+str(ex))
    logcheck(not any("Caravan frame error" in entry["message"] for entry in consoleErrors),
             "No carousel frame exceptions: "+str(consoleErrors[:2]))
    logcheck(len(jsErrors)==0,"No uncaught page JS errors: "+str(jsErrors))
    # Verify the same handoff on a touch device, where skip controls are often obscured.
    mobile=browser.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True)
    touch=mobile.new_page()
    touch.goto(ORIGIN+"tea-dictionary.html",wait_until="domcontentloaded")
    touch.evaluate("()=>{sessionStorage.setItem('teaAdventureStage','2');sessionStorage.setItem('teaAdventureLanguage','zh');localStorage.setItem('gtr-lang','zh')}")
    touch.goto(ORIGIN+"tea-adventure.html",wait_until="domcontentloaded")
    touch.wait_for_timeout(1700)
    touch.evaluate("startCut(2)")
    skip=touch.locator("#enterWorkshop")
    logcheck(skip.is_visible() and skip.bounding_box() is not None,"Mobile skip video button visible")
    skip.click(timeout=7000)
    touch.wait_for_timeout(3400)
    st=diagnostic(touch,"mobile-game3-after-skip")
    touch.screenshot(path=str(OUT/"03_mobile_caravan_after_skip.png"))
    logcheck("tea-caravan.html" in (st["frameURL"] or ""),"Mobile skip transitions into third game")
    logcheck(st["vars"].get("mode")=="playing" and not st["vars"].get("teaFrameErrorShown",True),"Mobile caravan renders without a frame crash")
    mobile.close()
    print("CONSOLE_ERRORS",json.dumps(consoleErrors[:10],ensure_ascii=False),flush=True)
    browser.close()
(OUT/"probe-report.json").write_text(json.dumps({"checks":allchecks,"issues":issues,"pageErrors":jsErrors,"consoleErrors":consoleErrors},ensure_ascii=False,indent=2))
print("ISSUES",json.dumps(issues,ensure_ascii=False),flush=True)
sys.exit(0 if not issues else 1)
