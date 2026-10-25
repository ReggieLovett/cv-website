# Portfolio companion sprites

The default companion is the original **male knight** from **16x16 DungeonTileset II v1.7** by **0x72 (Robert)**. All thirteen power forms keep that original body and animation frames: clothing, weapons, eye details, aura, and attack effects are CSS layers. A power-up never selects a replacement character row. The same rule applies when a power form is active in the Zelda persona.

The only alternate base artwork is the Zelda-inspired **Champion's Tunic elf** in [`companion-variants.svg`](./companion-variants.svg). It derives directly from the bundled original male elf poses. The original blond hair, skin colors, eyes, face profile, and frame cadence are preserved. The derivative changes the clothes to a blue tunic, beige trousers, and leather details, with a rear sword. It is fan-made and is not a Nintendo sprite extraction.

Earlier `reggie-*.svg` character sheets and generated PNG concepts are not live character artwork. The discarded concept prompts remain in [`docs/companion-sprite-prompts.md`](../../docs/companion-sprite-prompts.md).

## Original source and license

`dungeon-tileset.png` is an unchanged **512 × 512 pixel** copy of `0x72_DungeonTilesetII_v1.7.png`. The bundled `knight_m_*` and `elf_m_*` PNGs are the creator's original **16 × 28 pixel** frames. The Zelda SVG is a local clothing derivative of those CC0 elf frames.

- Creator and download page: <https://0x72.itch.io/dungeontileset-ii>.
- Source archive: `0x72_DungeonTilesetII_v1.7.zip`, downloaded through the creator's official itch.io flow on October 23, 2026, Asia/Manila.
- Asset license: **Creative Commons Zero v1.0 Universal (CC0 1.0)**, as identified by the creator's “Asset license” field. The separate MIT license on the source page applies to code.
- License: <https://creativecommons.org/publicdomain/zero/1.0/>; full text in [`CC0-1.0.txt`](./CC0-1.0.txt).
- Source README: [`SOURCE-README.txt`](./SOURCE-README.txt).
- Source archive SHA-256: `a5b23341ebc831d7798bfb9666d864a08c079bb7aed18e3cf023a27d517c1512`.
- Original archive frame paths: `0x72_DungeonTilesetII_v1.7/frames/<filename>`.

## Frame geometry and rendering

Both bodies use the original **16 × 28 pixel** grid and face right. CSS flips the whole character when facing left. At **3×** scale, each frame is **48 × 84 CSS pixels**; use `image-rendering: pixelated`.

| Original sheet animation | Source y | Source frame x positions |
| --- | --- | --- |
| Knight idle | 100 | 128, 144, 160, 176 |
| Knight run | 100 | 192, 208, 224, 240 |
| Elf idle | 36 | 128, 144, 160, 176 |
| Elf run | 36 | 192, 208, 224, 240 |

For `dungeon-tileset.png`, use a **1536 × 1536 CSS pixel** background at 3×. Knight idle runs from `-384px -300px` to `-576px -300px` with `steps(4)`. Knight run starts at `-576px -300px` and ends at `-768px -300px`. The untouched elf uses the same x positions and y = `-108px`.

`companion-variants.svg` has **one row and eight columns**, measuring **128 × 28 logical pixels**. Columns 0–3 contain the four original idle poses; columns 4–7 contain the four original run poses. The builder normalizes each pose to the same bottom foot baseline at native y = 27 without replacing its source animation.

Display this Zelda sheet at **384 × 84 CSS pixels**. Idle runs from x = `0px` to `-192px` with `steps(4)`; run starts at `-192px` and ends at `-384px`. The row offset is always `0px`. Animation endpoints are one frame beyond the last displayed pose. Reduced motion keeps the first idle frame.

[`lib/companion-sprite.ts`](../../lib/companion-sprite.ts) selects the original base sheet or the Zelda clothing derivative; CSS owns the animation and all power costumes.

## Rebuilding the Zelda derivative

Run `node scripts/build-companion-sprites.cjs` to rebuild the one-row SVG. Edit [`scripts/build-companion-sprites.cjs`](../../scripts/build-companion-sprites.cjs), not the generated file. The builder uses a dependency-free PNG decoder to read the original elf frames, remaps clothing colors, and writes bounded integer-coordinate SVG rectangles. It embeds no raster images, filters, scripts, or external assets.

Run `node --test tests/companion-variants-builder.test.cjs` to verify the source decoder, all eight source poses, unchanged original face/skin/hair pixels, a shared foot baseline, the single-row geometry, and deterministic shipped output. There are no power-form rows in this SVG.
