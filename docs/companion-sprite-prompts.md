# Personalized companion art direction and imagegen concepts

The personalized character experiments below were rejected by the user. They are **not used by the live companion**. The original 0x72 knight and its equipment layers are restored. Only the Zelda base hero uses the one-row `public/sprites/companion-variants.svg`, a derivative of the original CC0 elf’s pixel grids authored by `scripts/build-companion-sprites.cjs`. All fifteen powers preserve their persona’s original body and add researched equipment, clothing, marks, and effects in CSS; none selects a replacement face or character sheet. See the [current sprite documentation](../public/sprites/README.md) and [appearance references](companion-move-references.md).

The built-in imagegen tool produced the following higher-detail concepts before the user’s clarification. Their original PNG outputs remain in the Codex generated-images folder. The exact prompts are preserved below as development provenance; none of the personalized PNG or SVG experiments are shipped.

## Core

Discarded concept name: `reggie-core.png`.

```text
Use case: identity-preserve. Asset type: production pixel-art animation atlas for a small website companion.
Input image 1 is ONLY the face/identity reference: Reggie from his portfolio portrait. Preserve his recognizable warm medium skin tone, dark center-parted black hair, thick eyebrows, brown eyes, friendly smile and small moustache. Make a handsome friendly 16-bit chibi pixel-art version of THIS PERSON, not a generic knight. Strong clean 2D pixel art, chunky intentional square pixels, no photoreal shading, no anti-aliasing or smooth 3D.
OUTPUT: ONE transparent-background PNG sprite atlas, exactly square, 1024x1024, strict invisible 4-column by 4-row grid. Every cell is exactly 256x256. No cell borders, labels, letters, icons, shadows on ground or backdrop. All sixteen full-body sprites must be separate, complete, centered within their own cells, no clipping, no objects crossing cells. Align feet to y=240 inside EVERY cell, top of head around y=20, central character x=128. Character width around110px, height220px. No external aura or energy effects; clothing and equipment only. Every pose faces to the RIGHT in a three-quarter front view so his face is visible. Keep exact same character proportions, scale, face and feet baseline for all frames.
Each ROW is a different outfit of Reggie. Each COLUMN is one animation frame: column1 relaxed standing idle; column2 same standing with subtly relaxed arms and blink; column3 walking stride right, right leg forward; column4 walking stride right, left leg forward. Walking feet still use the same floor baseline, no jumping. Only arms/legs change; don't move the head location or body scale.
ROW1: Reggie as himself, white short-sleeved button-up shirt from reference, charcoal trousers, simple dark sneakers. No weapon.
ROW2: the SAME Reggie as a Breath of the Wild Link-inspired adventurer: iconic bright blue Champion's Tunic with small white chest embroidery, beige fitted trousers, brown boots, leather forearm bracers, crossbody belt, small sheathed sword and bow on back. Keep Reggie's BLACK center-parted hair and face, with subtly pointed ears; do not turn him into blonde Link.
ROW3: the SAME Reggie in Naruto Sage Mode: black hair, metal forehead protector, red open sage cloak with black flame trim over orange-and-black ninja outfit, black sandals, orange eye markings, large scroll strapped behind shoulders. Preserve his face, confident friendly expression.
ROW4: the SAME Reggie in Sasuke Six Paths eye power: charcoal high-collar ninja outfit, gray wrap top, purple rope belt, dark trousers and boots, sheathed katana at hip, one tiny purple Rinnegan eye and one tiny red Sharingan eye. Keep Reggie's center-parted black hair, eyebrows and face. No giant aura.
This must be a mechanically usable sprite sheet with precise equal grid spacing and perfect alpha transparency, not a presentation board.
```

## Powered

Discarded concept name: `reggie-powered.png`.

```text
Use case: identity-preserve. Asset type: production pixel-art animation atlas for a website companion.
Input 1 is Reggie's actual portfolio portrait, the identity reference. Input 2 is the APPROVED sprite atlas, the exact style/proportions/face/animation-grid reference. Make the SAME personalized Reggie chibi sprite with the same medium warm skin, eyebrows, smile, center-parted black hair when the power permits, and no generic replacement face. Match input2's crisp 16-bit chunky pixel art and face. Outfit variations must be visually distinct and complete.
OUTPUT ONE transparent PNG sprite atlas, strict invisible grid with FOUR equal columns. No text, labels, tile borders, ground shadows or backdrop. Each full-body character stays centered in its own cell at identical size and feet baseline, no clipping or overlap. Use the SAME normalized head/feet placement and body scale as input2. Face RIGHT in three-quarter front view throughout so face is visible. Every row's four columns are: relaxed idle; same idle blinking/subtly relaxed arms; walking stride right leg forward; walking stride left leg forward. Feet never jump and head never changes cell position or scale. Keep all gear INSIDE the cell. No external auras, sparks, particles or background effects: these will be animated separately in code.
EXACT GRID: 4 columns by 4 rows, square canvas. FOUR different powered versions of Reggie, one per row.
ROW1: SIX PATHS KCM NARUTO-inspired Reggie: vivid golden chakra cloak with black flame hem, black collar, six black magatama beads on chest, bold black circle/sun emblem on abdomen, black shinobi trousers and sandals, subtle orange cheek whisker lines, tiny golden cross-shaped pupils without orange Sage eye paint. Hair is Reggie's black center part edged with gold chakra glow, not a generic blonde Naruto face. Black staff strapped behind. Do NOT draw floating truth-seeking balls; those are separate code layers.
ROW2: BARYON MODE Reggie: black hair with fierce red-orange fox-ear-shaped side tufts, bold black markings sweeping from outer eyes up toward the hair, red-orange mantle over black-and-orange ninja clothing, dark black magatama details and compact layered red-orange chakra tails behind hips. Tails fit inside cell. Preserve Reggie's smile/face but focused heroic brows. This must look distinctly different from golden KCM.
ROW3: FINAL WAR DEKU / ONE FOR ALL OVERDRIVE-inspired Reggie: dark green curly/tousled hair retaining Reggie's face, torn deep teal/green hero jumpsuit with black panels and light reinforced shoulder details, thick red utility belt/pouches, dark neck guard/scarf, large white-gray reinforced combat gloves, red high armored boots. His face is visible, no full face mask. Light turquoise lightning details may be on costume seams but no external electricity. Determined expression. Not the adult tech suit.
ROW4: SUPER SONIC-inspired transformation of the SAME HUMAN Reggie: bright GOLD upward swept quill-shaped hair, golden fitted hero outfit with light chest, unmistakable large white gloves and iconic red shoes with bold white straps. Tiny red irises, keep Reggie's warm human face and smile and dark eyebrows. This is a personalized human Super Sonic-inspired form, not a separate unrelated hedgehog mascot. No external golden aura; draw only the transformed body.
Use approved input2 style and mechanical grid alignment exactly.
```

## Black Clover

Discarded concept name: `reggie-clover.png`.

```text
Use case: identity-preserve. Asset type: production pixel-art animation atlas for a website companion.
Input 1 is Reggie's actual portfolio portrait, the identity reference. Input 2 is the APPROVED sprite atlas, the exact style/proportions/face/animation-grid reference. Make the SAME personalized Reggie chibi sprite with the same medium warm skin, eyebrows, smile, center-parted black hair when the power permits, and no generic replacement face. Match input2's crisp 16-bit chunky pixel art and face. Outfit variations must be visually distinct and complete.
OUTPUT ONE transparent PNG sprite atlas, strict invisible grid with FOUR equal columns. No text, labels, tile borders, ground shadows or backdrop. Each full-body character stays centered in its own cell at identical size and feet baseline, no clipping or overlap. Use the SAME normalized head/feet placement and body scale as input2. Face RIGHT in three-quarter front view throughout so face is visible. Every row's four columns are: relaxed idle; same idle blinking/subtly relaxed arms; walking stride right leg forward; walking stride left leg forward. Feet never jump and head never changes cell position or scale. Keep all gear INSIDE the cell. No external auras, sparks, particles or background effects: these will be animated separately in code.
EXACT GRID: 4 columns by 4 rows, square canvas. Four Black Clover-inspired versions of the SAME Reggie.
ROW1: ASTA ZETTEN Reggie: black hair and dark red-accent headband, short dark training robe over black battle clothing, red sash, dark boots, muscular compact armored forearms, Demon-Slasher-style katana sheathed at side, confident concentrated look. Black and deep wine palette, NO magic aura.
ROW2: ASTA DEVIL UNION Reggie: a full black anti-magic armored suit with vivid dark red lines and prominent red chest star, four small black horns, black hair, one compact pair of jagged black bat wings behind shoulders, oversized black greatsword strapped at back, black boots and gauntlets. Face visible and recognizable. More armored/demonic than Zetten. Gear fits cell.
ROW3: YUNO STAR MAGIC Reggie: black hair with neat center part, high-collar dark navy royal-mage uniform with gold embroidery, elegant navy cloak, gold trim and shoulder clasp, dark pants and boots, compact open grimoire held at hip. Four small gold star motifs on clothing, no floating stars outside body.
ROW4: YUNO SPIRIT DIVE Reggie: same face and hair edged with emerald green, elegant green-and-gold spirit mage armor, a half golden spirit crown, one emerald translucent fairy-like wing compact behind shoulder, one green armored arm/gauntlet, pale green cloak details, dark fitted pants and boots. Spirit sword sheathed on hip. Face remains fully recognizable and visible.
All four full costumes distinct from each other, exact input2 scale/face and four-frame row animation alignment.
```

## Original fantasy forms

Discarded concept name: `reggie-elements.png`.

```text
Use case: identity-preserve. Asset type: production pixel-art animation atlas for a website companion.
Input 1 is Reggie's actual portfolio portrait, the identity reference. Input 2 is the APPROVED sprite atlas, the exact style/proportions/face/animation-grid reference. Make the SAME personalized Reggie chibi sprite with the same medium warm skin, eyebrows, smile, center-parted black hair when the power permits, and no generic replacement face. Match input2's crisp 16-bit chunky pixel art and face. Outfit variations must be visually distinct and complete.
OUTPUT ONE transparent PNG sprite atlas, strict invisible grid with FOUR equal columns. No text, labels, tile borders, ground shadows or backdrop. Each full-body character stays centered in its own cell at identical size and feet baseline, no clipping or overlap. Use the SAME normalized head/feet placement and body scale as input2. Face RIGHT in three-quarter front view throughout so face is visible. Every row's four columns are: relaxed idle; same idle blinking/subtly relaxed arms; walking stride right leg forward; walking stride left leg forward. Feet never jump and head never changes cell position or scale. Keep all gear INSIDE the cell. No external auras, sparks, particles or background effects: these will be animated separately in code.
EXACT GRID: 4 columns by FIVE equal rows, portrait canvas with width:height exactly4:5. Five original fantasy transformations of the SAME Reggie, one per row. Each cell same square shape as input2.
ROW1: SWORD ADVENTURER Reggie: dark hair and visible face, fitted white shirt under brown leather sword vest, steel shoulder guard, brown belt, dark pants, sturdy leather boots, drawn slender steel sword held safely close inside own cell. Brave smile.
ROW2: LIGHTNING Reggie: dark hair with a few ice-blue tips, navy and bright blue fitted battle jacket with silver bolt motif, steel-blue bracers, dark pants, cyan-accent boots. No electricity outside body.
ROW3: PHOENIX FIRE Reggie: dark hair with red tips, red and burnt-orange feather-trimmed short cloak, dark fitted chest armor with ember-colored accents, dark pants, red armored boots. No flames outside body.
ROW4: FROST ARMOR Reggie: dark hair and recognizable face, pale blue crystalline shoulder armor and bracers, compact blue crystal circlet, silver-blue cape, navy trousers, frost-white boots. Sharp faceted ice motifs on costume, no external crystals.
ROW5: SHADOW Reggie: center-parted black hair, deep violet scarf and hood lowered behind head so face visible, violet-black stealth outfit, short purple cape, dark pants and ninja boots, small belt pouches. Quiet violet trim, no external duplicate figures.
Keep the exact same Reggie face, body proportions and grid precision as approved input2.
```


