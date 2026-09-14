import { existsSync } from 'node:fs';
import path from 'node:path';
import { Console } from '@/components/console';

/**
 * The sword sound is an optional asset — see public/sounds/README.md for why
 * it is not shipped. Checking for it here, on the server, means the crest only
 * ever points an `<audio>` element at a file that actually exists. Checking in
 * the browser would cost every visitor a 404 request to find out.
 *
 * This runs at build time for the static page, so dropping the file in and
 * rebuilding is all it takes to switch the crest over.
 */
const SWORD_SOUND = '/sounds/master-sword-unsheath.mp3';

export default function Home() {
  const hasSwordSound = existsSync(path.join(process.cwd(), 'public', SWORD_SOUND));
  return <Console swordSoundSrc={hasSwordSound ? SWORD_SOUND : null} />;
}
