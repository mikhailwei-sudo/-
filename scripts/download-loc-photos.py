#!/usr/bin/env python3
"""Download individually sourced historic photos to GitHub Pages local assets.
Source catalogue: v4/assets/refs/loc-sources.json. No external image URLs are used by site visitors.
"""
import json, pathlib, urllib.request, urllib.parse, time, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((ROOT/"v4/assets/refs/loc-sources.json").read_text())
def load(url):
    req=urllib.request.Request(url,headers={"User-Agent":"GreatTeaRoadMuseum/1.0 (source: github.com/mikhailwei-sudo/-)","Accept":"application/json, image/jpeg, */*"})
    with urllib.request.urlopen(req,timeout=35) as r:return r.read(),r.headers.get("content-type","")
def find_url(item):
    data,_=load("https://www.loc.gov/item/"+item["locId"]+"/?fo=json")
    rec=json.loads(data)
    arr=[]
    for resource in rec.get("resources",[]):
        if not isinstance(resource,dict):continue
        for field in ("image","files"):
            values=resource.get(field,[])
            for v in values if isinstance(values,list) else [values]:
                if isinstance(v,str):arr.append(v)
                elif isinstance(v,dict):
                    arr.extend(str(w) for w in v.values() if isinstance(w,str))
    arr.extend(rec.get("item",{}).get("image_url",[]))
    jpg=[u for u in arr if "http" in u and any(ext in u.lower() for ext in (".jpg",".jpeg"))]
    if not jpg:raise ValueError("No downloadable JPEG in LOC record "+item["locId"])
    return jpg[-1]
ok=0
for item in data["items"]:
    target=ROOT/item["file"];target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists() and target.stat().st_size>4096:
        print("Existing",target);ok+=1;continue
    try:
        url=find_url(item)
        raw,ct=load(url)
        if len(raw)<4096 or raw[:3]!=b"\xff\xd8\xff":raise ValueError("Image response is not JPEG")
        target.write_bytes(raw)
        ok+=1
        print("Saved",target,len(raw),"from",item["source"])
    except Exception as exc:
        print("FAILED",item["name"],item["source"],str(exc),file=sys.stderr)
    time.sleep(.25)
print("Saved/verified",ok,"of",len(data["items"]))
if ok==0:sys.exit(1)
