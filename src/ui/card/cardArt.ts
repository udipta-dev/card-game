import { allCards as allCardsForArt } from '@content/cards';
import type { Card } from '@engine/types';

/**
 * Card art resolves BY CONVENTION: drop a file named after the card id into
 * src/assets/art/cards/ and it appears on that card. No data change, no
 * registration step, nothing to remember.
 *
 *   src/assets/art/cards/arjuna.webp        -> the Arjuna card
 *   src/assets/art/cards/vasavi_shakti.webp -> the Vasavi Shakti card
 *
 * Vite discovers these at build time, so a card with no art never fires a
 * request that 404s, and every file that IS present gets content-hashed and
 * cached properly. Anything missing simply keeps its placeholder glyph, which
 * means a half-finished art set degrades quietly instead of showing broken
 * images.
 */
const FILES = import.meta.glob('../../assets/art/cards/*.{webp,png,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/**
 * Match on a SQUASHED key: lowercase, letters and digits only.
 *
 * The lookup used to be the raw filename, which meant it was case sensitive
 * and punctuation sensitive, and 69 finished paintings sat in a folder being
 * ignored because they were named Alambusha.webp and the card id is
 * alambusha. That is the computer's problem to solve, not a person's, and
 * making someone rename 69 files by hand to satisfy a string comparison is
 * the wrong end of it entirely.
 *
 * Squashing makes every sane variant land on the same card:
 *
 *   Alambusha.webp        Vasavi Shakti.webp      Krishna, the Charioteer.webp
 *   alambusha.webp        vasavi_shakti.webp      krishna_charioteer.webp
 *   ALAMBUSHA.WEBP        Vasavi-Shakti.webp
 *
 * Card NAMES are accepted as well as ids, since that is the other obvious
 * thing to call a file. Verified safe: across all 114 cards no two ids squash
 * together, no two names squash together, and no name squashes onto a
 * different card's id, so a match is never ambiguous.
 */
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const ART: Record<string, string> = {};
/** Files that matched no card at all. Surfaced in dev; see below. */
const ORPHANS: string[] = [];

{
  const wanted = new Map<string, string>(); // squashed id or name -> card id
  for (const c of allCardsForArt()) {
    wanted.set(squash(c.id), c.id);
    wanted.set(squash(c.name), c.id);
  }
  for (const [path, url] of Object.entries(FILES)) {
    const file = path.split('/').pop() ?? '';
    const stem = file.replace(/\.(webp|png|jpe?g|avif)$/i, '');
    const cardId = wanted.get(squash(stem));
    if (!cardId) {
      ORPHANS.push(file);
      continue;
    }
    // First file wins, so a leftover .png cannot silently displace the .webp
    // that replaced it.
    if (!ART[cardId]) ART[cardId] = url;
  }
}

// A file that matches nothing is invisible: the card keeps its placeholder and
// nobody finds out until someone goes looking for art that was delivered
// months ago. Say so, once, in dev.
if (import.meta.env?.DEV && ORPHANS.length) {
  console.warn(
    `[art] ${ORPHANS.length} file(s) in src/assets/art/cards/ match no card and will never be shown:\n  ` +
      ORPHANS.join('\n  ') +
      `\nRun: npx vite-node sim/art-check.ts src/assets/art/cards`,
  );
}

/** The image for a card, or undefined to fall back to the placeholder mark. */
export function artFor(card: Card): string | undefined {
  // An explicit `art` on the card always wins, for one-off overrides.
  return card.art ?? ART[card.id];
}

/** How many cards currently have art. Used by the art-status report. */
export function artIds(): string[] {
  return Object.keys(ART);
}
