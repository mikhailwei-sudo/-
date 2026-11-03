# 3D models — verified provenance (CMIT 2026)

File-level verification completed 2026-11-03 by inspecting the `asset.extras` metadata embedded in the exact GLB files present in the competition archive.

## Models actually included in the 3D museum

| Deployed model | Embedded author | Embedded source | Embedded license |
|---|---|---|---|
| `v4/assets/models/camel-authentic.glb` | **omarme37** | https://sketchfab.com/3d-models/camel-44ef2ea4b50a49e395e5e3ebbdc99f98 | **CC BY 4.0** |
| `v4/assets/models/samovar-authentic.glb` | **dashkilya** | https://sketchfab.com/3d-models/samovar-a23c0a57a019400d8643b80dc5118bd9 | **CC BY 4.0** |

License: https://creativecommons.org/licenses/by/4.0/ — credit the author, original work link, license, and modifications if made. Preserve attribution on the website and in any distributed archive.

SHA256 file fingerprints:
- camel-authentic.glb: `33910f24d9d795071eec1c14adf2e34cd19af497a52d05c7cc3276fa2e7d74c8`
- samovar-authentic.glb: `08a248604024324f0332c3d585390dfd2a7da55bcb6b481411a5adac1e19aca2`

These are not the LynxAbraxas camel or Nikolay Fedorov samovar shown in old candidate-link sections. Those are distinct Sketchfab objects and must not be named as authors of the deployed GLB files.

## Other assets

- `assets/models/camel-poly-pizza.glb`: prior documentation traces a model to jeremy / Poly Pizza via billcookie/Pax-Atlas under CC BY 3.0. Its GLB contains only `obj2gltf` generator metadata; the exact model must be cross-matched before definitively applying that attribution.
- `v4/assets/models/chinese-hall.fbx`, `v4/assets/models/teaset.glb`, `v4/assets/models/crate/model.dae`: delivered as user-supplied archives; original creator and license are **not proven by the existing file metadata**. Their Blender/Assimp export metadata is not authorship or permission.
- Historical photos and icon sources are listed separately in `v4/assets/refs/loc-sources.json` and `v4/assets/refs/IMAGE-SOURCES.md`.

## Copyright and submission

The CC BY 4.0 terms for the two Sketchfab-derived models are traceable to their embedded source metadata, but this alone does not certify every other model, texture or video in the project. Obtain source/permission for unknown assets or replace them before claiming the entire submission is rights-cleared.
