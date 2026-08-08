// The architecture of the interface: torans, banners, plaques and parchment.
//
// ornament.tsx holds the GLYPHS, drawn on a 24x24 grid, the marks that stand in
// for icons. This holds the STRUCTURE: the pieces that frame a screen rather
// than label a thing. They are separate because they scale differently. A glyph
// is always small and always square; a toran is as wide as whatever it crowns.
//
// Still inline SVG for the same reasons as ornament.tsx: no network, nothing the
// service worker has to fetch, every stroke inherits `currentColor`, and it
// stays sharp at any size on any screen. Raster ornament at this density would
// be several hundred kilobytes and would go soft on a phone.
//
// The vocabulary is from temple architecture rather than generic fantasy, and
// each piece has a job:
//
//   Toran     the hanging garland strung across a doorway at a festival. Used
//             to crown a section, which is exactly what it does on a door.
//   Lintel    a heading set into a carved lintel, with the garland beneath
//   Plaque    a slab of cut stone, used for anything you press
//   Parchment a leaf of palm-manuscript, used for anything you read

interface Props {
  className?: string;
}

/**
 * The hanging garland, drawn as wide as its container.
 *
 * `preserveAspectRatio="none"` on the swag and a fixed set of bells rather than
 * a stretched pattern: stretching the bells with the width is what makes cheap
 * ornament look cheap, because the further from centre the more oval they go.
 */
export function Toran({ className }: Props) {
  const bells = [8, 20, 32, 44, 56, 68, 80, 92];
  return (
    <svg
      className={className}
      viewBox="0 0 100 18"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.4"
      aria-hidden="true"
      focusable="false"
    >
      {/* The swag: a shallow curve, deepest at the middle, as a hung cord is. */}
      <path d="M0 2 Q50 11 100 2" />
      <path d="M0 3.4 Q50 12.4 100 3.4" opacity="0.55" />
      {bells.map((x) => {
        // Bells hang lower toward the centre, following the cord rather than
        // sitting on a straight line, which is the detail that sells it.
        const drop = 2 + 8.2 * Math.sin((x / 100) * Math.PI);
        return (
          <g key={x}>
            <path d={`M${x} ${drop} v2.2`} />
            <path d={`M${x - 1.5} ${drop + 4.4} a1.5 1.6 0 0 1 3 0 z`} fill="currentColor" stroke="none" />
          </g>
        );
      })}
    </svg>
  );
}

/**
 * Corner filigree. Four of them frame a panel; one marks a lone corner.
 *
 * Drawn once pointing top-left and rotated by CSS, so the four corners are one
 * path rather than four that can drift out of step with each other.
 */
export function Corner({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 12 V4 a2 2 0 0 1 2-2 h8" />
      <path d="M5 15 V7 a2 2 0 0 1 2-2 h8" opacity="0.6" />
      {/* A lotus bud where the two arms meet. */}
      <path d="M4 4 q4 1 5 5 q-4 -1 -5 -5 z" fill="currentColor" stroke="none" opacity="0.8" />
      <path d="M12 2 q5 2 6 6" opacity="0.35" />
    </svg>
  );
}

/**
 * A section heading set in a lintel, with the garland hung beneath it.
 *
 * The mockups use this everywhere and it is the single biggest reason they read
 * as a game rather than a list: a heading that is DRAWN rather than merely
 * larger tells you the section beneath it is a place.
 */
export function Lintel({
  children,
  count,
  toran = true,
}: {
  children: React.ReactNode;
  /** Shown at the right, for "32 cards" style counts. */
  count?: React.ReactNode;
  toran?: boolean;
}) {
  return (
    <div className="lintel">
      <div className="lintel__rule" aria-hidden="true" />
      <h2 className="lintel__title">{children}</h2>
      {count != null && <span className="lintel__count">{count}</span>}
      <div className="lintel__rule" aria-hidden="true" />
      {toran && <Toran className="lintel__toran" />}
    </div>
  );
}
