#!/usr/bin/env python3
"""Fetch three selected free Piper voice models, verify their declared dataset
licenses, and prepare their ONNX files for the museum MP3 generator.

Models are downloaded only during the GitHub Action. The museum serves
compressed *audio*, never ~190 MB of ONNX models to visitors.
"""
import argparse
import sys
import urllib.request
from pathlib import Path

BASE = "https://huggingface.co/rhasspy/piper-voices/resolve/main/"
VOICES = {
    "ru": ("ru/ru_RU/dmitri/medium/", "ru_RU-dmitri-medium", ("CC0",)),
    "zh": ("zh/zh_CN/chaowen/medium/", "zh_CN-chaowen-medium", ("CC0",)),
    "en": ("en/en_US/kristin/medium/", "en_US-kristin-medium", ("public domain",)),
}
def download(url, output):
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.is_file() and output.stat().st_size > 0:
        return
    print("Downloading", url, flush=True)
    req=urllib.request.Request(url,headers={"User-Agent":"GreatTeaRoad-AudioBuild/1.0"})
    with urllib.request.urlopen(req,timeout=180) as src,output.open("wb") as dst:
        while True:
            chunk=src.read(1024*1024)
            if not chunk:break
            dst.write(chunk)
    print("Saved",output,output.stat().st_size,flush=True)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--output",default="v4/voices")
    args=ap.parse_args()
    out=Path(args.output)
    opts=[]
    for lang,(folder,name,license_tokens) in VOICES.items():
        url=BASE+folder
        card=out/(name+".MODEL_CARD")
        download(url+"MODEL_CARD",card)
        cardtext=card.read_text(encoding="utf-8").lower()
        if not any(x.lower() in cardtext for x in license_tokens):
            raise SystemExit("STOP: license does not match reviewed source: "+name+"\n"+cardtext)
        model=out/(name+".onnx")
        download(url+name+".onnx",model)
        download(url+name+".onnx.json",Path(str(model)+".json"))
        if model.stat().st_size<50000000:
            raise SystemExit("Model file unexpectedly small: "+str(model))
        opts.append(lang+"="+str(model.resolve()))
    print("\n".join(opts))
    (out/"selected-voices.txt").write_text("\n".join(opts)+"\n",encoding="utf-8")

if __name__=="__main__":
    main()
