# Hyper Sonic: Frontiers-inspired combat

This is a creative adaptation of **Super Sonic's Sonic Frontiers combat language** onto the existing knight's **Hyper Sonic** power-up. Hyper Sonic does not appear in Frontiers. The knight stays silver/white with cyan, pink and pale violet accents; it does not become Frontiers' golden Super Sonic. The persistent original body and helmet remain visible.

Primary references checked:

- [SEGA / Sonic the Hedgehog: Combat & Upgrades trailer](https://www.youtube.com/watch?v=I2tysfV9X18): official skill and combat showcase, including kick shockwaves, combo chaining, Cyloop and counters.
- [SEGA Sonic Frontiers action overview](https://asia.sega.com/SonicFrontiers/en/action/): speed, circling opponents and linked combat attacks.
- [Official Xbox Wire combat overview](https://news.xbox.com/en-us/2022/10/13/master-your-unique-battle-style-with-sonic-frontiers-evolved-combat-system/): identifies Wild Rush as a fast zigzag attack and explains the skill tree, projectile kicks, Cyloop and parry counters.
- [SEGA launch release](https://www.sega.co.jp/en/release/221108_1.html?category=1&page=1&year=2022): Super Sonic fights Titans with advanced aerial combos.
- [SEGA online manual](https://manual.sega.jp/sonicfrontiers/switch2/en/): official skill-tree explanation and Sonic Boom's kick-generated shockwaves. Some browsers receive a support notice from this manual.
- The **Sonic Frontiers in-game skill menu** supplies the named techniques. Its descriptions are transcribed in the [skill reference](https://sega.fandom.com/wiki/Skill_(Sonic_Frontiers)) and [Cross Slash reference](https://sonic.fandom.com/wiki/Cross_Slash), used as secondary checks for projectile shapes, the closing loop, the sphere volley and the accelerating kick. These labels describe the inspiration, not a claim of a separate official Hyper move set.
- The menu descriptions and visuals for [Cyclone Kick](https://sonic.fandom.com/wiki/Cyclone_Kick) and [Spin Slash](https://sonic.fandom.com/wiki/Spin_Slash) were checked through these secondary references: the former is an ascending multi-hit cyclone, the latter a ball-like spinning attack that creates a surrounding circular shockwave. The knight's cyclone rises locally as an effect; the actor continues along the bottom rather than copying the game's large vertical launch.
- [SEGA Sonic Origins manual](https://manuals.sega.com/wp-content/uploads/2022/06/SM_Sonic_Origin_En_220617.pdf): original emerald transformation context; the existing Hyper visual adaptation retains its prismatic presentation.

| Knight technique | Frontiers inspiration and visible adaptation |
| --- | --- |
| Hyper Sonic Boom | Rapid kicks emit **three separated crescent shockwaves**, staggered rather than rendered as a continuous laser. |
| Hyper Cross Slash | **Three crossed X shockwaves** travel forward with cyan and pink opposing edges. |
| Hyper Quick Cyloop | A cyan/pink **open light trail circles and closes**, followed by a white enclosure ring. Root actor dash remains along the bottom lane. |
| Hyper Homing Shot | **Five luminous energy spheres** gather at distinct positions and launch in a staggered volley. |
| Hyper Loop Kick | An **accelerating curved heel trail**, a visible glowing boot and a brief contact burst. The knight's travel stays on the bottom lane. |
| Hyper Grand Slam | Frontiers' powerful counterattack language becomes an **oversized translucent silver glove**, a contact ring and outward speed marks. This compact fist effect is an adaptation, not an exact reproduction of every Titan-specific finisher. |
| Hyper Parry Counter | A **held shield silhouette** catches a contact spark, then releases a short white retaliation streak. Separates defensive anticipation from the counter. |
| Hyper Wild Rush | A **white, cyan and pink zigzag trail** follows a high-speed dash, with successive upper and lower contact rings. |
| Hyper Cyclone Kick | **Three rising electric wind rings** surround a rotating heel and finish in a small elevated contact spark. Distinct from the single Loop Kick arc. |
| Hyper Spin Slash | A **compact silver energy spin ball orbits through circular cutting rings**, followed by a contact mark. The original knight stays visible underneath. |

The repertoire now contains **exactly ten techniques**. Each move is one short 940–1160 ms vignette; the battle engine still chooses 1–3 moves at a time. Sonic Boom, Cross Slash and Homing Shot visibly emit projectiles that travel away from the knight before fading. All geometry stays within the companion's local attack lane, including the original mobile reserve. Motion uses only transform and opacity, existing easing tokens, and no camera shake or full-screen flash. Pausing the companion also freezes these effects; reduced motion hides decorative attack shapes.
