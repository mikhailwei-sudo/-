#!/usr/bin/env python3
"""Build a reproducible CMIT2026 submission package from THIS checked-out website.
No mock screenshots; source is copied from the checked-out repository. Mascot assets are never changed.
"""
from __future__ import annotations
from pathlib import Path
from datetime import date
from collections import Counter
import hashlib, json, os, shutil, subprocess, zipfile, sys

from PIL import Image
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from docx import Document
from docx.shared import Pt as DocPt, Inches as DocInches, RGBColor as DocColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

REPO = Path(__file__).resolve().parents[1]
BUILD = REPO / ".cmit2026-build"
PACK = BUILD / "万里茶道_CMIT2026_正式材料待签章"
PREVIEW = REPO / "CMIT2026_submission" / "2026-refresh"
OUTNAME = "Wanli_Tea_Road_CMIT2026_Updated_2026-11-03.zip"
SCREENSHOT_SOURCES = [
    ("01_网站首页.png",       "site-design-qa/01_home.png"),
    ("02_万里茶道路线.png",   "site-design-qa/04b_route_map.png"),
    ("03_跨文化对话.png",     "site-design-qa/03_culture_dialogue.png"),
    ("04_3D数字博物馆.png",  "site-design-qa/05_museum.png"),
    ("05_展品与历史来源.png", "site-design-qa/06_museum_sources.png"),
    ("06_第一关茶园迷宫.png", "site-design-qa/07_maze.png"),
    ("07_第二关包装工坊.png", "site-design-qa/08_packing.png"),
    ("08_第三关商队远行.png", "caravan-qa/02_third_game_after_skip.png"),
    ("09_三语词典与卡片.png", "site-design-qa/10_dictionary.png"),
    ("10_历史数字档案.png",   "site-design-qa/06b_archive.png"),
]
JADE = RGBColor(14,36,34)
JADE2 = RGBColor(27,61,55)
BLACK = RGBColor(9,23,22)
BRASS = RGBColor(214,181,125)
WHITE = RGBColor(247,241,230)
MUTED = RGBColor(194,211,200)
PALE = RGBColor(239,227,207)
FONT = "Noto Sans CJK SC"

def sha256(p: Path):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(4 * 1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def check_report(path, minimum):
    data=json.loads(path.read_text(encoding="utf8"))
    if data.get("errors") or data.get("issues"):
        raise RuntimeError(f"QA errors in {path.name}: {data.get('errors') or data.get('issues')}")
    checks=data.get("checks",[])
    usable=[c for c in checks if "test" in c or "check" in c]
    passed=sum(bool(c.get("ok",c.get("passed",False))) for c in usable)
    if passed < minimum or passed!=len(usable):
        raise RuntimeError(f"QA failed {path}: {passed}/{len(usable)}")
    return passed

def text_shape(sl, x, y, w, h, words, size=16, color=WHITE, bold=False, align=None):
    sh=sl.shapes.add_textbox(Inches(x), Inches(y), Inches(w), Inches(h))
    tf=sh.text_frame; tf.clear(); tf.word_wrap=True
    tf.margin_top=Inches(0.03);tf.margin_bottom=0
    tf.margin_left=Inches(0.03);tf.margin_right=Inches(0.03)
    for idx,line in enumerate(words if isinstance(words,list) else [words]):
        p=tf.paragraphs[0] if idx==0 else tf.add_paragraph()
        p.space_after=Pt(8 if idx>0 else 3)
        if align: p.alignment=align
        r=p.add_run();r.text=line;r.font.name=FONT;r.font.size=Pt(size)
        r.font.bold=bold if idx==0 else False
        r.font.color.rgb=color
    return sh

def rectangle(sl,x,y,w,h,color,border=None,rad=MSO_SHAPE.RECTANGLE):
    sh=sl.shapes.add_shape(rad, Inches(x), Inches(y), Inches(w), Inches(h))
    sh.fill.solid();sh.fill.fore_color.rgb=color
    if border:sh.line.color.rgb=border;sh.line.width=Pt(1)
    else:sh.line.fill.background()
    return sh

def fit_pic(sl, file, x,y,w,h, frame=True):
    file=Path(file)
    if not file.exists(): raise FileNotFoundError(str(file))
    if frame: rectangle(sl,x,y,w,h,RGBColor(21,47,43),RGBColor(87,105,91),MSO_SHAPE.ROUNDED_RECTANGLE)
    im=Image.open(file)
    aw=max(.12,w-.20);ah=max(.12,h-.20)
    scale=min(aw/im.width,ah/im.height)
    ww=im.width*scale;hh=im.height*scale
    sh=sl.shapes.add_picture(str(file),Inches(x+(w-ww)/2),Inches(y+(h-hh)/2),width=Inches(ww),height=Inches(hh))
    sh.name=f"完整图片 · {file.name}"
    return sh

def slide(prs,number,title,tag):
    sl=prs.slides.add_slide(prs.slide_layouts[6])
    rectangle(sl,0,0,13.333,7.5,JADE)
    rectangle(sl,0,0,13.333,.10,BRASS)
    text_shape(sl,.45,.30,10.8,.36,tag,11,BRASS,True)
    text_shape(sl,.45,.75,12.1,.66,title,29,WHITE,True)
    rectangle(sl,.45,6.99,12.4,.015,RGBColor(80,111,98))
    text_shape(sl,.46,7.05,10,.25,"万里茶道  |  国际中文教育 · 数字文旅 · 跨文化交际",9,MUTED)
    text_shape(sl,12.26,7.04,.55,.28,f"{number:02d} / 15",9,BRASS)
    return sl

def label_box(sl,x,y,w,h,title,description,heading_size=17,body_size=13):
    rectangle(sl,x,y,w,h,JADE2,RGBColor(76,110,94),MSO_SHAPE.ROUNDED_RECTANGLE)
    text_shape(sl,x+.16,y+.15,w-.32,.36,title,heading_size,BRASS,True)
    text_shape(sl,x+.16,y+.66,w-.32,h-.77,description,body_size,WHITE)

def create_pptx(filename,sc):
    prs=Presentation()
    prs.slide_width=Inches(13.333);prs.slide_height=Inches(7.5)
    r=REPO / "v4/assets/refs"
    brick=r/"r1-brick-01.jpg"; camel=r/"r2-camel-01.jpg";samovar=r/"r4-samovar-01.jpg"
    # 01
    sl=slide(prs,1,"万里茶道｜跨文化数字文旅体验平台","CMIT 2026 · 国际专项赛作品展示")
    text_shape(sl,.7,2.0,7.2,1.10,"从一片茶叶，看见三地文化的相遇",30,WHITE,True)
    text_shape(sl,.7,3.15,6.7,.9,"历史文献 × 三维展馆 × 连续游戏 × 多语言学习",18,BRASS)
    text_shape(sl,.7,4.22,6.5,1.22,["以中国、蒙古、俄罗斯的茶叶贸易为线索，","让文化遗产可阅读、可探索、可参与。"],16,MUTED)
    fit_pic(sl,brick,8.2,1.66,4.45,4.7)
    # 02
    sl=slide(prs,2,"创意来源：让历史从文字走向体验","01 / 项目定位")
    fit_pic(sl,camel,.55,1.6,6.0,4.85)
    label_box(sl,6.76,1.63,5.93,1.40,"文化来源","以万里茶道的中俄茶叶贸易史为核心叙事。")
    label_box(sl,6.76,3.18,5.93,1.40,"学习难点","路线长、信息散、文化差异不易直观理解。")
    label_box(sl,6.76,4.75,5.93,1.40,"作品方法","把“认识—体验—理解”连接成完整网页旅程。")
    # 03
    sl=slide(prs,3,"互动路线：从中国出发，连接三地","02 / 地理信息与贸易脉络")
    fit_pic(sl,sc["02_万里茶道路线.png"],.52,1.62,8.25,4.98)
    label_box(sl,8.99,1.67,3.76,1.45,"空间阅读","用交互地图理解贸易网络。")
    label_box(sl,8.99,3.30,3.76,1.45,"节点叙事","沿线城市、商品与运输方式相互关联。")
    label_box(sl,8.99,4.93,3.76,1.45,"历史依据","配合档案图像与参考来源。")
    # 04
    sl=slide(prs,4,"网页进入顺序：一条清晰的用户旅程","03 / 用户体验设计")
    steps=[("01","打开首页","建立文化主题"),("02","探索地图","了解贸易线路"),("03","进入3D展馆","观察器物与史料"),("04","完成三关游戏","体验采集、包装、运输"),("05","词卡与文化对话","巩固多语言理解")]
    for i,(n,t,d) in enumerate(steps):
        x=.48+(i%3)*4.17; y=1.78+(i//3)*2.22
        label_box(sl,x,y,3.94,1.92,n+"  "+t,d,19,14)
    # 05
    sl=slide(prs,5,"首页：专业的数字文化展示入口","04 / 品牌与功能入口")
    fit_pic(sl,sc["01_网站首页.png"],.50,1.58,8.35,5.00)
    label_box(sl,9.07,1.69,3.68,1.36,"视觉语言","深墨绿、金色点缀与清晰留白。")
    label_box(sl,9.07,3.23,3.68,1.36,"明确导航","地图、展馆、游戏与词典分区。")
    label_box(sl,9.07,4.76,3.68,1.36,"跨语言入口","中 / 俄 / 英；切换后保持学习位置。")
    # 06
    sl=slide(prs,6,"跨文化交际：不止是翻译页面","05 / 国际赛道核心价值")
    fit_pic(sl,sc["03_跨文化对话.png"],.50,1.60,8.0,5.00)
    label_box(sl,8.72,1.70,4.07,1.35,"看见差异","茶砖、运输商队、俄式茶炊。")
    label_box(sl,8.72,3.20,4.07,1.35,"找到共通","茶叶贸易促进交流和待客文化。")
    label_box(sl,8.72,4.70,4.07,1.35,"参与理解","文化比较与互动理解题。")
    # 07
    sl=slide(prs,7,"中俄茶文化对照：同一种茶，不同的生活","06 / 对照学习")
    fit_pic(sl,brick,.55,1.72,5.9,3.0)
    fit_pic(sl,samovar,6.85,1.72,5.9,3.0)
    label_box(sl,.57,4.90,5.87,1.45,"中国：生产与外销","以砖茶、包装和远途贸易为线索。")
    label_box(sl,6.87,4.90,5.87,1.45,"俄罗斯：生活与本土化","以茶炊和家庭饮茶习惯为切入。")
    # 08
    sl=slide(prs,8,"3D数字展馆：从看图到沉浸探索","07 / 虚拟展陈")
    fit_pic(sl,sc["04_3D数字博物馆.png"],.50,1.60,8.35,5.0)
    label_box(sl,9.06,1.69,3.72,1.35,"空间体验","通过浏览器进入三维展厅。")
    label_box(sl,9.06,3.20,3.72,1.35,"展品交互","点击展柜获取历史和用途信息。")
    label_box(sl,9.06,4.70,3.72,1.35,"三语导览","让不同文化背景用户共同参观。")
    # 09
    sl=slide(prs,9,"博物馆的可信度：展品、来源与复原说明","08 / 学术与资料规范")
    fit_pic(sl,sc["05_展品与历史来源.png"],.52,1.63,6.18,4.20)
    fit_pic(sl,sc["10_历史数字档案.png"],6.89,1.63,5.86,4.20)
    text_shape(sl,.65,5.99,12.0,.72,"将历史照片、典型器物与数字重建明确区分，保留资料链接，不把概念图当作真实馆藏。",15,PALE)
    # 10
    sl=slide(prs,10,"玩法创新：让贸易过程变成一条游戏线","09 / 叙事化游戏设计")
    for i,(num,head,body) in enumerate([
        ("①","茶园迷宫","采集茶叶、规划路线"),
        ("②","包装工坊","分拣、称重、包装、发货"),
        ("③","商队远行","跨境运送、应对障碍")]):
        x=.66+i*4.20
        label_box(sl,x,2.0,3.90,3.64,num+" "+head,[body,"从任务中理解茶的商品化旅程。"],21,15)
    text_shape(sl,1.14,6.25,11.2,.4,"三个关卡相连，并配有过场动画；可跳过视频继续完成下一关。",16,BRASS)
    # 11
    sl=slide(prs,11,"第一关：茶园迷宫","10 / 采集与探索")
    fit_pic(sl,sc["06_第一关茶园迷宫.png"],.52,1.58,8.4,5.06)
    label_box(sl,9.08,1.89,3.68,1.70,"任务目标","收集茶叶、避开障碍、找到出口。")
    label_box(sl,9.08,4.00,3.68,1.70,"知识对应","认识贸易起点与路线规划。")
    # 12
    sl=slide(prs,12,"第二关：包装工坊","11 / 茶叶加工与商品化")
    fit_pic(sl,sc["07_第二关包装工坊.png"],.52,1.58,8.4,5.06)
    label_box(sl,9.08,1.89,3.68,1.70,"操作流程","订单 → 分拣 → 包装 → 发货。")
    label_box(sl,9.08,4.00,3.68,1.70,"玩法目标","让玩家在操作中理解工艺与流通。")
    # 13
    sl=slide(prs,13,"第三关：商队运输","12 / 跨地域运输与游戏衔接")
    fit_pic(sl,sc["08_第三关商队远行.png"],.52,1.58,8.4,5.06)
    label_box(sl,9.08,1.89,3.68,1.70,"商队玩法","穿越三地景观，躲避障碍与收集奖励。")
    label_box(sl,9.08,4.00,3.68,1.70,"稳定性验证","已验证第二段过场跳过后的启动与三语切换。")
    # 14
    sl=slide(prs,14,"三语词典与卡片挑战","13 / 游戏化学习闭环")
    fit_pic(sl,sc["09_三语词典与卡片.png"],.52,1.58,8.4,5.06)
    label_box(sl,9.08,1.89,3.68,1.70,"中 / 俄 / 英","词汇、独立语音和文化解释。")
    label_box(sl,9.08,4.00,3.68,1.70,"记忆挑战","三轮词卡，积分与学习反馈。")
    # 15
    sl=slide(prs,15,"项目创新与国际赛道价值","14 / 总结")
    for i,(head,body) in enumerate([
      ("文化内容","以历史资料支撑跨文化叙事。"),
      ("数字技术","3D展陈与浏览器交互融合。"),
      ("玩法设计","三关对应贸易的三个阶段。"),
      ("国际传播","三语内容与中俄文化对照。")]):
        x=.60+(i%2)*6.29; y=1.70+(i//2)*2.23
        label_box(sl,x,y,5.93,1.87,head,body,21,15)
    text_shape(sl,1.24,6.30,11.2,.45,"让文化遗产不仅被看见，也被体验、理解与分享。",19,BRASS,True,PP_ALIGN.CENTER)
    filename.parent.mkdir(parents=True,exist_ok=True)
    prs.save(filename)
    if len(Presentation(filename).slides)!=15: raise AssertionError("PowerPoint must contain exactly 15 slides")
    # Slide-level geometry test and inclusion of all un-cropped screenshots.
    p=Presentation(filename)
    for i,sl in enumerate(p.slides,1):
      for sh in sl.shapes:
        if sh.left < -1000 or sh.top < -1000 or sh.left+sh.width > p.slide_width+2000 or sh.top+sh.height > p.slide_height+2000:
          raise RuntimeError(f"Slide {i}, out-of-bounds shape: {sh.name!r}")
    print("PPTX_OK 15 slides, all shapes inside slide bounds",flush=True)

def set_east_asian(run,font=FONT):
    run.font.name=font
    rPr=run._element.get_or_add_rPr()
    rFonts=rPr.rFonts
    if rFonts is None:
        rFonts=OxmlElement('w:rFonts');rPr.insert(0,rFonts)
    rFonts.set(qn('w:eastAsia'),font)

def docx_file(path,title,sections):
    d=Document()
    sec=d.sections[0];sec.top_margin=DocInches(.75);sec.bottom_margin=DocInches(.75)
    sec.left_margin=DocInches(.8);sec.right_margin=DocInches(.8)
    normal=d.styles['Normal'];normal.font.name=FONT;normal.font.size=DocPt(10.5)
    normal.paragraph_format.space_after=DocPt(6)
    h=d.add_heading(title,0)
    for r in h.runs:set_east_asian(r);r.font.size=DocPt(19);r.font.color.rgb=DocColor(24,77,67)
    for heading,lines in sections:
        h=d.add_heading(heading,level=1)
        for r in h.runs:set_east_asian(r);r.font.size=DocPt(13);r.font.color.rgb=DocColor(56,99,87)
        for line in lines:
            p=d.add_paragraph()
            for run in [p.add_run(line)]:set_east_asian(run);run.font.size=DocPt(10.5)
    path.parent.mkdir(parents=True,exist_ok=True)
    d.save(path)

def write_utf8(path,content):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(content.strip()+"\n",encoding="utf-8")

def build():
    qa1=REPO/"CMIT2026_submission/site-design-qa/qa-report.json"
    qa2=REPO/"CMIT2026_submission/caravan-qa/probe-report.json"
    n1=check_report(qa1,24);n2=check_report(qa2,17)
    if BUILD.exists(): shutil.rmtree(BUILD)
    PACK.mkdir(parents=True)
    folders=[PACK/x for x in ["01_作品截图","02_作品汇报PPT","03_作品说明","04_参赛打包文件","05_报名信息与承诺书","06_测试证据","07_解说稿"]]
    for p in folders:p.mkdir(exist_ok=True)
    sc={}
    for name,reference in SCREENSHOT_SOURCES:
        orig=REPO/"CMIT2026_submission"/reference
        if not orig.is_file(): raise FileNotFoundError("Missing genuine Chromium screenshot: "+str(orig))
        with Image.open(orig) as im:im.verify()
        dest=folders[0]/name
        shutil.copy2(orig,dest);sc[name]=dest
    assert len(list(folders[0].glob("*.png")))==10

    ppt=folders[1]/"万里茶道_CMIT2026_更新版_15页_中文PPT.pptx"
    create_pptx(ppt,sc)
    # Reproducible PowerPoint-to-PDF rendering; include a read-only judge preview.
    soffice=shutil.which("libreoffice") or shutil.which("soffice")
    if soffice:
        command=[soffice,"-env:UserInstallation=file:///tmp/cmit2026-lo-profile","--headless",
                 "--convert-to","pdf","--outdir",str(ppt.parent),str(ppt)]
        output=subprocess.run(command,capture_output=True,text=True,timeout=180)
        if output.returncode!=0 or not ppt.with_suffix(".pdf").is_file():
            raise RuntimeError("PPT PDF export failed: "+output.stderr[-600:])
        info=subprocess.run(["pdfinfo",str(ppt.with_suffix(".pdf"))],capture_output=True,text=True)
        if info.returncode!=0 or not any(line.lstrip().startswith("Pages:") and line.split(":")[1].strip()=="15" for line in info.stdout.splitlines()):
            raise RuntimeError("Exported PPT PDF is not 15 pages")
    docx_file(folders[2]/"作品介绍_中文.docx","《万里茶道》作品介绍（2026年11月更新）",[
      ("作品定位",["本项目围绕数字文旅、虚拟展陈、跨文化交际与游戏化学习，构建中、俄、英三语互动网站。以中国—蒙古—俄罗斯的茶叶贸易故事为线索，将文献、路线、展品、小游戏与语言学习融于一体。"]),
      ("网页使用顺序",["打开首页 → 探索历史路线 → 进入“中俄茶文化对话” → 参观3D博物馆与史料档案 → 体验茶园迷宫、包装工坊、商队远行 → 通过词卡复习。"]),
      ("国际赛道与跨文化创新",["茶砖（中国生产及外销）→ 商队（跨地域运输与接触）→ 茶炊（俄罗斯家庭及社交生活）：三件代表性器物构成从生产到文化本土化的解释链。中文、俄文和英文信息独立呈现，并配合交互问答，展示共性与差异。"]),
      ("沉浸式展陈",["采用浏览器端三维展示，用户可浏览展区、观察茶砖与茶具等展品，了解历史背景、器物功能及来源。历史图像与现代数字复原以不同方式注明，避免混淆。"]),
      ("玩法创新",["第一关：茶园迷宫——收集茶叶与规划路径。第二关：茶叶包装——按订单完成加工和发货。第三关：商队运输——穿越多区域景观并应对障碍。三关以过场视频连接，支持跳过视频进入下一关。"]),
      ("语言学习",["词汇模块支持中文、俄文、英语学习与独立发音。记忆卡片采用三轮各十五题的结构，并结合积分与反馈。"]),
      ("技术与性能",["网站采用HTML、CSS、JavaScript、Canvas与Three.js/WebGL等浏览器技术。针对中国网络环境尽量使用本地静态资源，并对电脑与手机端分别优化布局与控制。"]),
      ("版本与测试",["本次更新保留尼克与茶儿的原始素材与游戏动画；修复第三关场景索引越界引起的渲染异常，完善过场视频跳过逻辑及三语言同步。提交前通过桌面、移动端自动测试与复核。"])
    ])
    docx_file(folders[2]/"素材来源与AI使用说明_待核对.docx","素材来源与人工智能使用说明（供申报核对）",[
      ("声明原则",["本文件用于协助填写赛事要求，不代表已经获得所有第三方素材的使用许可。请根据最终实际采用的素材逐项核对出处、署名、授权范围与许可协议。"]),
      ("生成式AI参与环节",["项目曾使用生成式AI辅助创意讨论、角色概念图与部分视觉方案探索；在最终作品材料中应区分概念设计、实际网页画面与程序运行截图。部分文字、代码方案及演示材料也使用了AI协助，须如实说明。"]),
      ("第三方资源与开源库",["部分历史图片、器物参考、3D模型、音频与外部图像来自第三方或公共文化机构；应保留各自来源及许可说明。主要渲染与页面技术包括Three.js/WebGL等。"]),
      ("可追溯文件",["请查阅源码包中的 v4/assets/refs/IMAGE-SOURCES.md、docs/3D_MODEL_ATTRIBUTION.md 以及相关素材说明文件。"]),
      ("个人确认",["提交人需确认作品原创性声明符合参赛规则，并对任何人工智能辅助或第三方材料作准确披露。"])
    ])
    docx_file(folders[4]/"报名信息_请填写.docx","CMIT 2026 报名信息（待填写）",[
      ("项目信息",["作品名称：万里茶道——跨文化数字文旅互动平台","作品类别：国际专项赛 / 智慧文旅与跨文化体验（以报名系统最终类别为准）","网站地址：https://mikhailwei-sudo.github.io/-/","作品源码：https://github.com/mikhailwei-sudo/-"]),
      ("团队与学校",["学校（中文正式名称）：________________","团队名称：________________","成员姓名与学号：________________","指导教师及所属单位：________________","联系方式：________________"]),
      ("项目概述",["以万里茶道为文化载体，结合互动路线、三维展馆、连贯的小游戏和中俄英三语词卡，探索面向不同文化背景受众的数字文化传播。"]),
      ("确认",["以上信息由报名负责人确认后，填入赛事官方报名系统。不得由本模板推断或替代真实个人资料。"])
    ])
    docx_file(folders[4]/"参赛承诺书_请下载官方模板并签章.docx","参赛承诺书办理提示（非官方表格）",[
      ("重要提醒",["此文件只是办理提示，不是组委会官方参赛承诺书，不能替代官方签署文件。请从报名系统下载现行官方承诺书。"]),
      ("办理顺序",["1. 按官方模板填入真实姓名、学校、作品信息与指导老师。","2. 逐项核对原创性、AI辅助、第三方版权等声明。","3. 由要求的责任人签字，并按组委会要求加盖真实公章。","4. 扫描或拍照为清晰PDF/图像，再上传报名系统。"])
    ])
    docx_file(folders[6]/"视频讲解台词_中文_更新版.docx","《万里茶道》作品展示视频中文解说稿（约4分50秒）",[
      ("00:00–00:25 进入首页",["大家好，欢迎来到《万里茶道》跨文化数字文旅体验平台。今天我们将以一名真实用户的视角，探索这条连接中国、蒙古与俄罗斯的历史贸易道路。"]),
      ("00:25–00:55 首页与设计",["首页采用深绿色与金色的博物馆式视觉语言，导航清晰呈现地图、展馆、游戏、词典与文化对话。网站提供中、俄、英三种语言入口。"]),
      ("00:55–01:20 互动地图",["用户可以通过交互地图理解茶叶从中国出发、经蒙古草原、进入俄罗斯的贸易网络；沿线城市、物品和史料可进一步探索。"]),
      ("01:20–01:55 跨文化对话",["这里是新增的核心模块：从中国砖茶的生产和包装，经商队运输，到俄式茶炊所代表的家庭饮茶生活，观察同一种商品如何在不同文化中获得新的意义。页面还提供小问题，让知识转化为理解。"]),
      ("01:55–02:35 三维博物馆",["进入3D数字博物馆，我们可以查看茶砖、运输器具、俄式茶器等展品，阅读来源说明。历史照片、参考器物与现代数字模型有不同的性质，所以分别标明，增强内容的可信度。"]),
      ("02:35–03:00 第一关游戏",["在茶园迷宫中，玩家收集茶叶、避开障碍、完成探索，了解茶叶贸易的起点。"]),
      ("03:00–03:25 第二关游戏",["在包装工坊中，玩家根据订单完成分拣、称重、包装与发货，让知识融入实际操作。"]),
      ("03:25–03:50 第三关游戏",["茶叶装箱后，商队穿过中国、蒙古和俄罗斯，玩家躲避路障与天气风险。三关之间的视频支持跳过，不会阻断进度。"]),
      ("03:50–04:20 词典与卡片",["学习区提供三语词汇、独立语音和记忆卡片，围绕茶砖、茶炊和路线等主题进行三轮学习与积分反馈。"]),
      ("04:20–04:50 创新与价值",["我们希望通过专业的数字展陈、历史依据、游戏机制和跨语言文化对照，推动万里茶道文化传播。它不仅可以被看见，也可以被体验、理解与分享。感谢观看！"])
    ])
    # Include current source of the working site, not just a link or placeholder.
    source=folders[3]/"万里茶道_网站完整源码"
    OMIT={".git",".github",".cmit2026-build","CMIT2026_submission","node_modules","__pycache__",".idea",".vscode"}
    def ignore(directory,names):
        return [n for n in names if n in OMIT or n.endswith((".zip",".pyc",".log")) or n==".DS_Store"]
    shutil.copytree(REPO,source,ignore=ignore,dirs_exist_ok=True)
    for check in ("index.html","culture-dialogue.html","tea-adventure.html","tea-packing.html","tea-caravan.html","tea-maze.html","tea-dictionary.html","v4/experience.html","game-assets/tea-cutscene-3-new.mp4"):
        if not (source/check).is_file(): raise RuntimeError("Missing actual site source file "+check)

    # QA reports, desktop and mobile proof and screenshot provenance.
    shutil.copy2(qa1,folders[5]/"网站桌面手机质量验证.json")
    shutil.copy2(qa2,folders[5]/"第三关视频跳过及语言回归测试.json")
    for name in ("03_mobile_caravan_after_skip.png","02_third_game_after_skip.png"):
        shutil.copy2(REPO/"CMIT2026_submission/caravan-qa"/name,folders[5]/name)
    write_utf8(folders[5]/"测试记录_说明.txt",f"""
真实网页 Chromium / Playwright 自动化测试：
常规网站桌面与手机：{n1} 项通过。
第三关过场动画跳过、持续渲染、三语同步：{n2} 项通过。
相关截图仅来自当前 GitHub 仓库网页在浏览器中的运行状态，不是概念绘图。
实际运行页面和源码、浏览器和硬件可能造成个别渲染表现差异。
GitHub Actions 记录：https://github.com/mikhailwei-sudo/-/actions
""")

    readme=f"""
CMIT2026 · 《万里茶道》国际专项赛材料包（更新于2026-11-03）
项目地址：https://mikhailwei-sudo.github.io/-/
源码地址：https://github.com/mikhailwei-sudo/-
源码提交：{os.getenv('GITHUB_SHA','unknown')}

【文件夹】
01_作品截图：10张真正从运行中的网站截取的PNG。供平台作品截图字段上传。
02_作品汇报PPT：中文15页演示PPT，反映新的网站、跨文化模块和修复后的第三关。
03_作品说明：中文作品介绍、素材来源及AI使用说明（需报名人核对）。
04_参赛打包文件：完整网站源码，包含Three.js/脚本/素材/角色/三关游戏/本地媒体。
05_报名信息与承诺书：仅可编辑待填资料及提醒，绝非已签署/盖章的官方文件。
06_测试证据：真实桌面/手机自动测试与修复后的第三关截图。
07_解说稿：对应新版网站的中文录屏讲解。

【2026-11-03 新版变更】
新增中俄茶文化对话；完善主页面与博物馆的历史来源/多语说明；
修复第三关跳过第二段视频后的场景背景渲染错误；保持语言在主游戏和子游戏间一致；
保留尼克和茶儿的原有素材和动画，不修改角色设计。

【提交提醒】
1. 必须按赛事要求从官方报名系统下载承诺书，并用真实签名及盖章完成。
2. 仍需确认所有报名信息、学校/队伍/指导老师、AI参与与第三方素材许可。
3. 当前包含PPT而不包含最终录制的视频；视频与PPT的提交选择以官方系统要求为准。
4. 本网站作品为数字化创作和教育展示；历史参考图与现当代3D复原不应混为实物扫描。
5. 本ZIP没有假冒官方签名、印章或提供虚构个人数据。
""".strip()
    write_utf8(PACK/"00_提交说明_请先阅读.txt",readme)
    # Manifest: exact provenance and checksums for judging repeatability.
    mani={"project":"万里茶道","date":"2026-11-03","repository":"mikhailwei-sudo/-",
         "commit":os.getenv("GITHUB_SHA","unknown"),"screenshot_count":len(sc),
         "screenshots":[{"name":name,"origin":ref,"sha256":sha256(sc[name])} for name,ref in SCREENSHOT_SOURCES],
         "source_files":sum(1 for f in source.rglob("*") if f.is_file()),
         "source_bytes":sum(f.stat().st_size for f in source.rglob("*") if f.is_file()),
         "pptx_pages":15,"pptx_sha256":sha256(ppt),
         "qa_site_passed":n1,"qa_caravan_passed":n2,
         "notes":"Official original signed pledge and personal registration must be supplied by entrant."}
    write_utf8(PACK/"manifest.json",json.dumps(mani,ensure_ascii=False,indent=2))
    BUILD.mkdir(exist_ok=True)
    dest=BUILD/OUTNAME
    with zipfile.ZipFile(dest,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=5,allowZip64=True) as z:
        for f in sorted(PACK.rglob("*")):
            if f.is_file(): z.write(f,str(f.relative_to(BUILD)).replace(os.sep,"/"))
    with zipfile.ZipFile(dest) as z:
        bad=z.testzip()
        if bad:raise RuntimeError(f"CRC failed {bad}")
        names=z.namelist()
        if not any(x.endswith("game-assets/tea-cutscene-3-new.mp4") for x in names):
            raise RuntimeError("Current cinematic missing")
        if not any(x.endswith("culture-dialogue.html") for x in names):
            raise RuntimeError("New intercultural module missing")
        if len([n for n in names if "/01_作品截图/" in n and n.endswith(".png")])!=10:
            raise RuntimeError("Screenshot count mismatch")
    PREVIEW.mkdir(parents=True,exist_ok=True)
    (PREVIEW/"build-manifest.json").write_text(json.dumps({**mani,"archive_name":OUTNAME,
                          "archive_bytes":dest.stat().st_size,"archive_sha256":sha256(dest)},
                          ensure_ascii=False,indent=2),encoding="utf-8")
    # contact-sheet of all ten genuine screenshots, for visual inspection
    thumbs=[]
    for name in sc:
        im=Image.open(sc[name]).convert("RGB")
        im.thumbnail((550,350))
        tile=Image.new("RGB",(570,380),"#0e2422")
        tile.paste(im,((570-im.width)//2,8))
        thumbs.append(tile)
    sheet=Image.new("RGB",(570*2,380*5),"#0e2422")
    for i,im in enumerate(thumbs):sheet.paste(im,((i%2)*570,(i//2)*380))
    sheet.save(PREVIEW/"all-ten-screenshots.jpg",quality=83,optimize=True)
    # copies of generated editable artifacts for GitHub Actions release upload
    shutil.copy2(ppt,BUILD/"Wanli_Tea_Road_CMIT2026_Updated_15slides.pptx")
    print("BUILD_OK",dest,"bytes",dest.stat().st_size,"sources",mani["source_files"],flush=True)
    print("BUNDLE_SHA256",sha256(dest),flush=True)

if __name__=="__main__":
    build()
