#!/usr/bin/env python3
"""Generate optional offline neural museum narration with Piper TTS.

No paid API is used. Each downloaded Piper model has its own MODEL_CARD/license:
check it before publishing generated audio.

Example:
 python tools/generate_audio.py \
   --voices ru=voices/ru_RU-irina-medium.onnx \
            zh=voices/zh_CN-huayan-medium.onnx \
            en=voices/en_US-lessac-medium.onnx
Requires: piper executable in PATH; ffmpeg optional for smaller mp3 files.
"""
import argparse
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SCRIPTS = ROOT / "audio-guide-scripts.json"
LANGS = ("ru", "zh", "en")

def main():
    parser = argparse.ArgumentParser(description="Build free neural audio for Great Tea Road")
    parser.add_argument("--scripts", type=Path, default=DEFAULT_SCRIPTS)
    parser.add_argument("--output", type=Path, default=ROOT / "audio")
    parser.add_argument("--voices", metavar="LANG=FILE", nargs="+", required=True,
                        help="Example: ru=voices/ru_RU-irina-medium.onnx")
    args = parser.parse_args()
    model_paths = {}
    for assignment in args.voices:
        lang, sep, path = assignment.partition("=")
        if not sep or lang not in LANGS:
            parser.error("Each --voices value must be ru=..., zh=..., or en=...")
        model = Path(path).resolve()
        if not model.is_file():
            parser.error(f"Voice model not found: {model}")
        config = Path(str(model) + ".json")
        if not config.is_file():
            parser.error(f"Voice config missing: {config}")
        model_paths[lang] = model
    if not shutil.which("piper"):
        parser.error("Piper is not installed or is not in PATH.")
    scripts = json.loads(args.scripts.read_text(encoding="utf-8"))["items"]
    args.output.mkdir(parents=True, exist_ok=True)
    manifest = {}
    for lang, model in model_paths.items():
        manifest[lang] = {}
        folder = args.output / lang
        folder.mkdir(exist_ok=True)
        for index, exhibit in enumerate(scripts):
            text = exhibit[lang].strip()
            if not text:
                continue
            wav = folder / f"{index}.wav"
            print(f"[{lang}] {index + 1}/{len(scripts)}: {exhibit['id']}")
            subprocess.run(["piper", "--model", str(model), "--output_file", str(wav)],
                           input=(text + "\n").encode("utf-8"), check=True)
            asset = wav
            if shutil.which("ffmpeg"):
                mp3 = folder / f"{index}.mp3"
                subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error",
                                "-y", "-i", str(wav), "-codec:a", "libmp3lame",
                                "-qscale:a", "5", str(mp3)], check=True)
                wav.unlink()
                asset = mp3
            manifest[lang][str(index)] = "./audio/" + lang + "/" + asset.name
    target = ROOT / "audio-guide-manifest.json"
    target.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Created {target} with {sum(map(len, manifest.values()))} tracks.")

if __name__ == "__main__":
    main()
