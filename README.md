# 万里茶道 · Great Tea Road · Великий чайный путь

**中 / RU / EN · Digital heritage, cross-cultural learning and interactive storytelling**

This repository contains the source code for a multilingual digital cultural tourism project about the historical Tea Road between China, Mongolia and Russia.

**Live website:** https://mikhailwei-sudo.github.io/-/

## Start here

| Module | Page | What it does |
|---|---|---|
| 首页 / Home | [index.html](index.html) | Historical route, archival collection, exhibition entry and project overview |
| 跨文化对话 / Cultural dialogue | [culture-dialogue.html](culture-dialogue.html) | Interactive comparison of compressed tea, caravan transport and the Russian samovar; Chinese / Russian / English with comprehension question |
| 3D数字展馆 / 3D Museum | [v4/experience.html](v4/experience.html) | Seven virtual themed rooms, exhibit captions, audio guides and source labels |
| 史料目录 / Archive | [v4/collection.html](v4/collection.html) | Twelve themed object/reference entries with museum citations and reconstruction labels |
| 互动游戏 / Games | [tea-adventure.html](tea-adventure.html) | Three stages: tea maze → packing workshop → caravan journey |
| 三语词典 / Dictionary | [tea-dictionary.html](tea-dictionary.html) | Trilingual tea-related terms, pronunciation controls, flashcard rounds and points |

## Editorial and design rules

- Main website: professionally styled heritage archive, dark jade green, brass detail, clean typography and readable historical imagery.
- Original mascots **Nik / 尼克** and **Chaer / 茶儿** belong primarily to guided interactions and games. Their image and sprite assets are preserved as-is.
- The same article in different languages should carry equivalent information, not just the same interface labels.
- The cultural dialogue introduces **production → transportation → local adaptation** as a route from Chinese tea bricks through cross-border caravan trade toward Russian tea-drinking practices.
- Sources and object status distinguish historical photographs, source references, typological analogues and contemporary 3D reconstructions. Procedural representations are **not** original museum scans.

## Run locally

This is a static site with HTML, CSS, JavaScript, local images and museum 3D resources. No build command is required.

```bash
python -m http.server 8765
```

Then open http://localhost:8765/index.html. For the interactive museum, use a modern browser with WebGL. Media and large 3D assets can take longer to load on slow networks.

## Contest evidence and QA

- [CMIT 2026 screenshot folder](CMIT2026_submission/screenshots/) — real screenshots from a local Chromium browser.
- [Screenshot workflow](.github/workflows/cmit2026-screenshots.yml) — reproduces real screens from the current code.
- [Desktop/mobile interaction QA](scripts/cmit2026-site-qa.py) — checks routes, trilingual culture dialogue, museum source captions, all three games, dictionary and mobile-width overflow.
- [Official past-winner comparison and redesign analysis](docs/CMIT2026_WINNER_BENCHMARK_AND_REDESIGN.md).

### Limitations and responsible sourcing

This is an educational digital reconstruction. It is **not** a single definitive geo-historical route, a collection of authenticated 3D scans, or a claim of ownership over linked archival images. The historical object images and third-party assets must keep their individual provenance and license notes, such as [museum sources](v4/assets/refs/IMAGE-SOURCES.md) and [model attributions](docs/3D_MODEL_ATTRIBUTION.md).

Competition packages must accurately credit any use of generative AI, 3D libraries, and archival imagery. Do not present concept art as real screenshots.
