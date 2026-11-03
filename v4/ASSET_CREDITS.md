# Assets and provenance — Great Tea Road 4.0

The following files were provided by the project owner. **Licenses of these assets have not been independently verified**. Check the license and author page for each model before publishing or submitting the museum to a competition.

- `assets/models/chinese-hall.fbx` — extracted from `chinese-hall.zip`, FBX architecture. Seven associated texture images optimized to max 1024×1024 JPEG for mobile; filenames retained with `.tga.jpg` suffix. **Used in the entrance lobby**. No architectural/historical provenance confirmed.
- `assets/models/teaset.glb` — extracted from `free-3d-tea-set.zip`. **Imported as a displayed object in gallery 1**. The GLB includes materials and textures.
- `assets/models/crate/model.dae` — extracted from nested `source/model.zip` in `low-poly-wooden-crate.zip`; supplied textures resized to max 1024 px. **Imported as a displayed object in gallery 2**.
- `camel.zip` — contains `camel.blend`; import deferred because the Blender format requires conversion and verification of the animal species.
- `samovar.zip` — contains `Samovar.rar`; import deferred because the source archive needs extraction, format identification, and conversion. Original procedural samovar remains in gallery 4.
- `green-tea-tile-texture.zip` — PBR source retained unmodified outside this build; not applied without reviewing the appearance and asset license.

Imported models are dynamically fitted within their exhibit bounding boxes. During loading or on failure, gallery's procedural reconstructions remain visible. The Chinese hall model is a modern, generic Chinese-style architectural visualization and **must not be represented as a verified reconstruction of a historical tea-trading building**.

Three.js and FBX/GLTF/Collada loaders are currently loaded from jsDelivr and need internet access. For offline operation, vendor library modules and update the import map.

## 2026-11-03 file-level provenance correction

The deployed `camel-authentic.glb` identifies **omarme37**, Sketchfab https://sketchfab.com/3d-models/camel-44ef2ea4b50a49e395e5e3ebbdc99f98 (CC BY 4.0). The deployed `samovar-authentic.glb` identifies **dashkilya**, Sketchfab https://sketchfab.com/3d-models/samovar-a23c0a57a019400d8643b80dc5118bd9 (CC BY 4.0). These embedded author/rights records supersede any historic candidate links to LynxAbraxas or Nikolay Fedorov. The author/license of the Chinese hall, tea set and crate remain unverified. Attribution does not certify all assets in the scene.
