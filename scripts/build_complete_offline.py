#!/usr/bin/env python3
"""Reproducibly package the CURRENT GitHub checkout, not a stale competition export.
No internet needed to serve the resulting self-contained static website.
"""
from __future__ import annotations
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import zipfile

REPO = Path(__file__).resolve().parents[1]
DEST = REPO / ".offline-build"
FOLDER = DEST / "Tea_Road_2026_COMPLETE_OFFLINE"
ARCHIVE = DEST / "Tea_Road_2026_COMPLETE_OFFLINE.zip"

ROOT_EXTS = {".html",".css",".js",".json",".txt",".md",".webmanifest",".svg",".ico",".png",".jpg",".webp",".avif"}
DIRS = ["assets","game-assets","v4","docs"]
REQUIRED = ["index.html","tea-home-editorial.js","tea-home-editorial.css",
 "site-navigation.js","tea-dictionary.html","culture-dialogue.html",
 "tea-adventure.html","tea-maze.html","tea-packing.html","tea-caravan.html",
 "v4/experience.html","v4/experience.js","v4/collection.html",
 "v4/archive-concept.html","v4/vendor/three.module.js",
 "v4/vendor/addons/loaders/GLTFLoader.js",
 "v4/vendor/addons/loaders/FBXLoader.js",
 "v4/vendor/addons/loaders/ColladaLoader.js",
 "v4/vendor/addons/libs/fflate.module.js",
 "game-assets/tea-cutscene-1.mp4","game-assets/tea-cutscene-2.mp4",
 "game-assets/tea-cutscene-3-new.mp4","game-assets/nik-portrait.png",
 "game-assets/chaer-portrait.png",
 "v4/assets/models/camel-authentic.glb","v4/assets/models/samovar-authentic.glb",
 "v4/assets/models/chinese-hall.fbx","v4/assets/models/teaset.glb",
 "v4/assets/models/crate/model.dae",
 "v4/assets/refs/loc/museum-01.webp","v4/audio/ru/0.mp3",
 "v4/audio/zh/0.mp3","v4/audio/en/0.mp3"]
SW_INLINE = re.compile(r"""<script\b[^>]*>\s*if\s*\(\s*['"]serviceWorker['"]\s+in\s+navigator\s*\)[\s\S]*?</script>""",re.I)
REMOTE_FONT_IMPORT = re.compile(r"""@import\s+(?:url\()?['"]?https?://(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^;]+;""",re.I)

def sha256(p:Path)->str:
 h=hashlib.sha256()
 with p.open("rb") as f:
  for part in iter(lambda:f.read(1024*1024),b""):h.update(part)
 return h.hexdigest()

def main():
 DEST.mkdir(parents=True,exist_ok=True)
 if FOLDER.exists(): shutil.rmtree(FOLDER)
 FOLDER.mkdir()
 for src in REPO.iterdir():
  if src.is_file() and (src.suffix.lower() in ROOT_EXTS or src.name==".nojekyll"):
   shutil.copy2(src,FOLDER/src.name)
 for name in DIRS:
  if not (REPO/name).exists(): raise RuntimeError("Missing source folder: "+name)
  shutil.copytree(REPO/name,FOLDER/name,ignore=shutil.ignore_patterns("__pycache__","*.pyc",".DS_Store"))
 for rel in REQUIRED:
  if not (FOLDER/rel).is_file(): raise FileNotFoundError(rel)
 # Safari, Firefox and Chrome prohibit file:// module imports, thus serve via localhost.
 # Never register SW in this distributable: it can return an OLD homepage from browser cache.
 removed=0
 for p in FOLDER.rglob("*"):
  if not p.is_file() or p.suffix.lower() not in (".html",".css"):continue
  s=p.read_text(encoding="utf-8")
  s,n=SW_INLINE.subn("",s);removed+=n
  s=REMOTE_FONT_IMPORT.sub("",s)
  p.write_text(s,encoding="utf-8")
 # Guard exact runtime imports, not external attribution hyperlinks.
 sources=[FOLDER/"v4/experience.js",FOLDER/"museum3d.js",
          FOLDER/"artifact-lab.js",FOLDER/"experience.js",FOLDER/"museum.js"]
 for f in sources:
  if re.search(r"""import\s*\(\s*['"]https?://""", f.read_text(encoding="utf-8")):
   raise RuntimeError("Runtime still imports network code: "+str(f))
 # Local manifests and hard assertions.
 audio=list((FOLDER/"v4/audio").glob("*/*.mp3"))
 if len(audio)!=42:raise RuntimeError(f"Expected 42 self-contained museum MP3s, got {len(audio)}")
 videos=list((FOLDER/"game-assets").glob("tea-cutscene-*.mp4"))
 if len(videos)<3: raise RuntimeError("Missing cutscene videos")
 # Keep the actual current homepage and every game. No competition report in the runtime folder.
 home=(FOLDER/"index.html").read_text(encoding="utf-8")
 if "tea-home-editorial.js" not in home or "editorial-nov3-d" not in home:
  raise RuntimeError("Homepage is not the current editorial homepage")
 rev=subprocess.check_output(["git","rev-parse","HEAD"],cwd=REPO,text=True).strip()
 files=[p for p in FOLDER.rglob("*") if p.is_file()]
 manifest={"release":"2026-11-03","git_revision":rev,
   "site":"Great Tea Road · 万里茶道","site_files":len(files),
   "offline_museum_mp3":len(audio),"cutscene_videos":len(videos),
   "disabled_service_worker_registrations":removed,
   "required_files_checked":len(REQUIRED),
   "files":{p.relative_to(FOLDER).as_posix():{"sha256":sha256(p),"size":p.stat().st_size}
            for p in sorted(files)}}
 (FOLDER/"OFFLINE_MANIFEST.json").write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
 if (DEST/"offline-qa-report.json").is_file():
  shutil.copy2(DEST/"offline-qa-report.json",FOLDER/"OFFLINE_QA_REPORT.json")
 runner='''#!/usr/bin/env python3
"""Serve local files only. No internet connection; random port prevents stale browser caches."""
from __future__ import annotations
import http.server
from pathlib import Path
import os
import webbrowser
os.chdir(Path(__file__).resolve().parent)
class Handler(http.server.SimpleHTTPRequestHandler):
 def end_headers(self):
  self.send_header("Cache-Control","no-store,max-age=0")
  self.send_header("Pragma","no-cache")
  super().end_headers()
with http.server.ThreadingHTTPServer(("127.0.0.1",0),Handler) as server:
 url=f"http://127.0.0.1:{server.server_port}/index.html"
 print("Great Tea Road · FULL OFFLINE SITE",flush=True)
 print("Open in browser:",url,flush=True)
 print("Keep this window open. Press Ctrl+C to stop.",flush=True)
 try:webbrowser.open(url,new=2)
 except Exception:pass
 try:server.serve_forever()
 except KeyboardInterrupt:pass
'''
 (FOLDER/"run_offline.py").write_text(runner,encoding="utf-8")
 (FOLDER/"START_WINDOWS.bat").write_text('''@echo off
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 run_offline.py
) else (
  python run_offline.py
)
if errorlevel 1 echo Install Python 3 from python.org and run again.
pause
''',encoding="utf-8")
 (FOLDER/"START_LINUX_MAC.command").write_text('''#!/bin/sh
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
 python3 run_offline.py
else
 python run_offline.py
fi
''',encoding="utf-8")
 (FOLDER/"START_LINUX_MAC.command").chmod(0o755)
 (FOLDER/"README_START_HERE.txt").write_text('''GREAT TEA ROAD · FULL OFFLINE EDITION — Nov 3, 2026
ВАЖНО: НЕ запускайте index.html двойным нажатием.
Браузеры блокируют JavaScript ES-модули и Three.js с адресов file://.
Сайт полностью локальный — интернет НЕ НУЖЕН, но нужен локальный HTTP-сервер.

Windows: дважды щёлкните START_WINDOWS.bat (требуется Python 3).
Linux / macOS: запустите START_LINUX_MAC.command, либо: python3 run_offline.py
В открывшемся браузере появится НОВАЯ главная страница.
Должны работать: пять разделов, карта, 3D-музей, архив, словарь,
три игры с переходами, Ника/Чаэр, катсцены, 42 MP3, языки 中/RU/EN.
Если браузер не запустился сам, откройте адрес из окна терминала.
Всё работает на адресе 127.0.0.1, никакие файлы в интернет не отправляются.
Не закрывайте окно терминала, пока пользуетесь сайтом.
Для остановки нажмите Ctrl+C.

Windows requires Python 3. Open START_WINDOWS.bat, not index.html.
Linux / Mac: python3 run_offline.py.
Do not use file://; WebGL modules and navigation require localhost.
中文：不要直接打开index.html；请运行启动脚本，离线浏览器地址为127.0.0.1。
外部史料来源链接仅供阅读参考，打开这些来源网站需要联网。
''',encoding="utf-8")
 (FOLDER/"OPEN_ME.html").write_text('''<!doctype html><html lang="ru"><meta charset="utf-8"><title>Great Tea Road Offline · Запуск</title><style>body{font:17px/1.7 system-ui;background:#102b25;color:#efdfbd;max-width:780px;margin:11vh auto;padding:24px}code{color:#f6ca7b}a{color:#f2c989}</style><h1>Полный офлайн-сайт Великого чайного пути</h1><p>Это инструкция запуска. <b>Не открывайте index.html двойным щелчком</b> — браузер не загрузит локальные ES-модули 3D-музея.</p><p><b>Windows:</b> START_WINDOWS.bat<br><b>Linux/macOS:</b> START_LINUX_MAC.command или <code>python3 run_offline.py</code></p><p>После запуска автоматически откроется новый сайт на <code>http://127.0.0.1:PORT/index.html</code>. Интернет не требуется.</p><p>中文：启动脚本后，在本地浏览器打开站点，不能直接用 file:// 。</p></html>''',encoding="utf-8")
 if ARCHIVE.exists(): ARCHIVE.unlink()
 with zipfile.ZipFile(ARCHIVE,"w",zipfile.ZIP_DEFLATED,compresslevel=6,allowZip64=True) as z:
  for p in sorted(FOLDER.rglob("*")):
   if p.is_file(): z.write(p,arcname=FOLDER.name+"/"+p.relative_to(FOLDER).as_posix())
 with zipfile.ZipFile(ARCHIVE) as z:
  assert z.testzip() is None
  assert len(z.namelist())>=len(files)+5
 print("OFFLINE_BUILD_OK",rev, len(files),len(audio),len(videos),
       "removed SW",removed, "zip",ARCHIVE,"bytes",ARCHIVE.stat().st_size,flush=True)

if __name__=="__main__":main()
