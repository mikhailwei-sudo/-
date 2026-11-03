# CMIT 2026 — audit of third-party media and models (2026-11-03)

**Purpose:** file-specific source verification for the competition work 《万里茶道》. **Not** an authorization letter, assignment of rights, or warranty from third-party creators. Source citation and SHA256 alone are not a use license.

## Verified / source-supported

| File(s) | Evidence | Finding |
|---|---|---|
| `v4/assets/models/camel-authentic.glb` | GLB `asset.extras` + SHA256 `33910f24d9d795071eec1c14adf2e34cd19af497a52d05c7cc3276fa2e7d74c8` | **omarme37**, Sketchfab `44ef2ea4b50a49e395e5e3ebbdc99f98`, embedded license **CC BY 4.0**; attribution required |
| `v4/assets/models/samovar-authentic.glb` | GLB `asset.extras` + SHA256 `08a248604024324f0332c3d585390dfd2a7da55bcb6b481411a5adac1e19aca2` | **dashkilya**, Sketchfab `a23c0a57a019400d8643b80dc5118bd9`, embedded license **CC BY 4.0**; attribution required |
| `v4/audio/{ru,zh,en}/` (42 MP3) | `audio-guide-manifest.json`, `v4/tools/download_selected_voices.py`, `v4/tools/generate_audio.py`, GitHub workflow | **Piper TTS**; model IDs `ru_RU-dmitri-medium`, `zh_CN-chaowen-medium`, `en_US-kristin-medium`. `MODEL_CARD`: Dmitri and Chaowen source datasets CC0; Kristin source dataset LibriVox public domain. Preserve attribution and copies of source model cards |
| `v4/assets/refs/loc/*.jpg` + WebP derivatives | `v4/assets/refs/loc-sources.json` (15 catalog IDs), WDL/Library of Congress rights statement | Collection `Russian-Chinese Cross-Border Trade` hosted via Library of Congress / World Digital Library: **no known restrictions**, not a blanket copyright warranty. Cite individual item and original Kyakhta museum collection |
| `v4/assets/refs/r1-teaset-01.jpg` | Cleveland Museum of Art object `1955.299` | Official Open Access notice allows copying, modification and distribution |
| `v4/vendor/three.module.js` + dependencies | `v4/vendor/THREE_LICENSE.txt` and upstream Three.js repository | MIT-licensed library (subject to corresponding file/source match) |

Reference rights: https://creativecommons.org/licenses/by/4.0/ ; https://www.loc.gov/collections/world-digital-library/about-this-collection/rights-and-access/ ; https://www.clevelandart.org/art/1955.299 ; https://huggingface.co/rhasspy/piper-voices

## Not independently authorized — **do not mark licensed or original without further records**

| File | SHA256 | Why a link or metadata is insufficient |
|---|---|---|
| `v4/assets/models/chinese-hall.fbx` | `e10ae39d7dbf6f665965d7a95a5088b8b3b7ae4a879e627a4ebabd18680002af` | FBX identifies Blender as exporter, a local `E:\Models\MoonlightModels\HZ\HZ116\` texture path, but **no author or distribution license**. Cannot infer grant from vendor folder name |
| `v4/assets/models/teaset.glb` | `2b62b02eff97e311929775f8db4ae2d5993f7378aeeb38488df260c7f41f5189` | glTF lists Blender exporter only; no original artist or license |
| `v4/assets/models/crate/model.dae` | `19c75f0cdecba86e8be06c1566f957afecfb0891993efd46dff9f46c0987cf87` | COLLADA metadata identifies **Assimp Exporter**, not the creator or use rights. Many similarly named crates on the web; none identified as exact match |
| `assets/models/camel-poly-pizza.glb` | `42954d643daf1ec51532ba4c005f1e27243582ef521f5755e74c92f356c1bec8` | Repository commit claims a CC BY 3.0 source but internal GLB records only `obj2gltf`; cannot confirm the **exact original model** from file metadata |
| `game-assets/tea-cutscene-1.mp4` | `c48628c7fef53e7688cec72697118193302b5315ba1cadf0c6a2d42e16fe3b5b` | Git history only `Add files via upload`; `encoder=Google` is **not** proof of video generator, author, source, ownership, or license |
| `game-assets/tea-cutscene-2.mp4` | `6033d26f821b01f45ebdb3d2b6799dd883c4360f86a8d0c2dc2e8fd5d0084506` | Same |
| `game-assets/tea-cutscene-3.mp4` | `c39e53c73fcfd5e53b4b4f6b4a73824598f7e94a17097a1b78839747a2d032b3` | Same; currently unused in active game, but was present in contest package |
| `game-assets/tea-cutscene-3-new.mp4` | `46c0d7a093df5186118d603844d1de2d615dfd2f16d380a3b8aec6f1d8d8a3a7` | Same |

Additional media: Wellcome Collection works and Swedish Museum of Ethnography samovar images have listed source links, **but no item-specific license confirmed** by this file audit; a general institutional policy is not enough. Original/AI-assisted character artwork lacks complete generator/creation rights evidence in submitted materials.

## Before claiming a rights-cleared competition package

1. For each unresolved model/video/illustration, supply its original project/source page showing authorship and allowed use/redistribution **or** the creator's written authorization; retain the record (PDF, license, invoice, download history).
2. If no permission or source record exists, replace or remove that exact asset from the submission and its live demo; do not silently label it `CC0` or `原创`.
3. Preserve appropriate CC BY author and source attribution with links and modification notes.
4. Do not invent an application number, school, team roster or a signed competition pledge. The official registration portal generates the unique application and the official pledge.
