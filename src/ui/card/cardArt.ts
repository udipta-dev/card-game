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

const ART: Record<string, string> = {};
for (const [path, url] of Object.entries(FILES)) {
  const file = path.split('/').pop() ?? '';
  const id = file.replace(/\.(webp|png|jpe?g|avif)$/i, '');
  ART[id] = url;
}

/** The image for a card, or undefined to fall back to the placeholder glyph. */
export function artFor(card: Card): string | undefined {
  // An explicit `art` on the card always wins, for one-off overrides.
  return card.art ?? ART[card.id];
}

/** How many cards currently have art. Used by the art-status report. */
export function artIds(): string[] {
  return Object.keys(ART);
}
