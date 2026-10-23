# Portfolio guide sprite

The chat guide uses two original characters from **16x16 DungeonTileset II v1.7**, created by **0x72 (Robert)**. The default portfolio shows the **male knight**, whose pale cyan armor and warm plume read against the navy palette. Activating the Zelda-inspired theme transforms the guide into the **male elf**, a green-clad woodland adventurer with blonde hair and pointed ears. It accompanies the Wayfinder personality and the green-and-gold palette.

- Original creator and download page: <https://0x72.itch.io/dungeontileset-ii>
- Source archive: `0x72_DungeonTilesetII_v1.7.zip` (downloaded from the creator's official itch.io download flow, October 23, 2026, Asia/Manila).
- Asset license: **Creative Commons Zero v1.0 Universal (CC0 1.0)**, as identified in the creator page's “Asset license” field. The creator explicitly permits reuse and says credit is optional. The page lists a separate MIT code license; these PNG assets use CC0.
- License: <https://creativecommons.org/publicdomain/zero/1.0/>
- Full license text: [`CC0-1.0.txt`](./CC0-1.0.txt).
- Archive README preserved as [`SOURCE-README.txt`](./SOURCE-README.txt).
- Source archive SHA-256: `a5b23341ebc831d7798bfb9666d864a08c079bb7aed18e3cf023a27d517c1512`.

These are the creator's original PNGs, without recoloring, resampling, or redrawing. Both characters are original 0x72 artwork, not Nintendo sprites.

## Files and frame geometry

`dungeon-tileset.png` is an unchanged copy of `0x72_DungeonTilesetII_v1.7.png`. It is **512 × 512 pixels**, with transparency. Both characters' frames are **16 × 28 pixels** and face right.

| Character / animation | Sheet y | Frame x coordinates | Individual original files |
| --- | --- | --- | --- |
| Knight idle | 100 | 128, 144, 160, 176 | `knight_m_idle_anim_f0.png` through `knight_m_idle_anim_f3.png` |
| Knight walk | 100 | 192, 208, 224, 240 | `knight_m_run_anim_f0.png` through `knight_m_run_anim_f3.png` |
| Elf idle | 36 | 128, 144, 160, 176 | `elf_m_idle_anim_f0.png` through `elf_m_idle_anim_f3.png` |
| Elf walk | 36 | 192, 208, 224, 240 | `elf_m_run_anim_f0.png` through `elf_m_run_anim_f3.png` |

“Walk” uses the source's four-frame `run` cycle. Each individual PNG is also **16 × 28 pixels**. Exact source archive paths for these are `0x72_DungeonTilesetII_v1.7/frames/<filename>`.

The sheet coordinates above come from the archive's `tile_list_v1.7` and were checked against the original art. Only the sheet and sixteen guide frames are bundled; the other archive files are omitted.

## Rendering

Use `image-rendering: pixelated` and an integer scale. At **3×** the visible sprite is **48 × 84 CSS pixels**. Set the background image to `/sprites/dungeon-tileset.png`, `background-size: 1536px 1536px`, and the viewport to `48px × 84px`.

- Idle: animate `background-position` from `-384px -300px` to `-576px -300px` using `steps(4)`.
- Walk: animate from `-576px -300px` to `-768px -300px` using `steps(4)`.
- The elf uses the same x positions with **y = `-108px`** for both idle and walking. The companion's `data-persona="zelda"` selectors choose this row.
- A 560–700 ms walk cycle is a comfortable starting point; the idle cycle can run more slowly.
- Use a wrapping element's `transform: scaleX(-1)` when traveling left.
- Keep the first idle frame visible and stop both walking and frame cycling for reduced-motion preferences.

The animation endpoint is one frame beyond the last shown frame, so `steps(4)` displays the four intended frames before each loop resets. Separate individual PNGs are provided if the UI prefers selecting each frame directly.
