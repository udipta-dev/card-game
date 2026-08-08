/**
 * Deity art resolves BY CONVENTION, exactly like card art: drop a file named
 * after the deity id into src/assets/art/deities/ and it appears wherever that
 * god does. No data change, no registration step.
 *
 *   src/assets/art/deities/shiva.webp  -> Shiva
 *
 * Vite discovers these at build time, so a god with no art never fires a
 * request that 404s, and every file present is content-hashed and cached. A
 * missing one simply renders no portrait, so a half-finished set degrades
 * quietly rather than showing a broken image.
 */
const FILES = import.meta.glob('../../assets/art/deities/*.{webp,png,jpg,jpeg,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** Lowercase, letters and digits only, so casing and punctuation never matter. */
const squash = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const BY_KEY = new Map<string, string>();
for (const [path, url] of Object.entries(FILES)) {
  const stem = path.split('/').pop()!.replace(/\.[a-z]+$/i, '');
  BY_KEY.set(squash(stem), url);
}

export function deityArt(deityId: string): string | undefined {
  return BY_KEY.get(squash(deityId));
}
