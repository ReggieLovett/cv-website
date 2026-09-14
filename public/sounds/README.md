# Sounds

## `master-sword-unsheath.mp3` — not included

The anniversary crest (components/zelda-emblem.tsx) plays this file when pressed.

It is deliberately **not** in the repository. The Master Sword unsheathing sound
from *The Legend of Zelda: Breath of the Wild* is Nintendo's copyrighted
recording, and a public site cannot redistribute it.

If you have a clip you are licensed to use, save it here with exactly this name:

    public/sounds/master-sword-unsheath.mp3

It is detected at build time (app/page.tsx) — rebuild or redeploy and the crest
uses it. No code change needed.

Until then the crest plays `blade`, an original sound synthesised at runtime by
lib/sounds.ts, so the press is never silent.
