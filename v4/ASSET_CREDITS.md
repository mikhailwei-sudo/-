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
