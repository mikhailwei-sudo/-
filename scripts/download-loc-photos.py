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
def find_urls(item):
    """LOC API metadata stores image_url in item and resource; try several sizes."""
    data,_=load("https://www.loc.gov/item/"+item["locId"]+"/?fo=json")
    rec=json.loads(data)
    candidates=[]
    def collect(value):
        if isinstance(value,str):
            if value.startswith("http") and (".jpg" in value.lower() or ".jpeg" in value.lower()):
                candidates.append(value)
        elif isinstance(value,list):
            for v in value:collect(v)
        elif isinstance(value,dict):
            for key,v in value.items():
                if key in ("image_url","url","href","image","files","resources"):collect(v)
    collect(rec.get("item",{}).get("image_url",[]))
    collect(rec.get("resources",[]))
    collect(rec.get("image_url",[]))
    # Select medium/high-res previews first, avoid iiif master TIFFs.
    unique=list(dict.fromkeys(candidates))
    unique.sort(key=lambda u:(0 if "service" not in u else 1, -len(u)))
    if not unique:raise ValueError("No JPEG source in LOC record "+item["locId"])
    return unique

ok=0
for item in data["items"]:
    target=ROOT/item["file"];target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists() and target.stat().st_size>4096:
        print("Existing",target);ok+=1;continue
    try:
        errors=[]
        for url in find_urls(item):
            try:
                raw,ct=load(url)
                if len(raw)<4096 or raw[:3]!=b"\xff\xd8\xff":
                    raise ValueError("Response was not a usable JPEG")
                target.write_bytes(raw)
                ok+=1
                print("Saved",target,len(raw),"from",item["source"])
                break
            except Exception as image_error:
                errors.append(str(image_error))
        else:
            raise ValueError("No usable JPEG: "+"; ".join(errors[:3]))
    except Exception as exc:
        print("FAILED",item["name"],item["source"],str(exc),file=sys.stderr)
    time.sleep(.25)
print("Saved/verified",ok,"of",len(data["items"]))
if ok==0:sys.exit(1)
