// Ornament: the drawn vocabulary of the interface.
//
// Everything here is inline SVG. No network, no icon font, nothing the service
// worker has to fetch, and every mark inherits `currentColor` so a single CSS
// custom property colours it. That matters for a PWA that has to work offline.
//
// The shapes are borrowed from real Indian visual tradition rather than generic
// fantasy, because the card art is painted gouache and emoji beside it reads as
// a placeholder somebody forgot to remove:
//
//   Chakra    the Konark chariot wheel, which is also the dharmachakra
//   Tusks     the elephant line, from temple relief
//   Spears    the foot, crossed
//   Kalasha   the finial that tops a temple spire. Tiers mark rank, exactly as
//             a taller spire marks a greater shrine
//   Torana    the ornamental gateway arch, used to frame a heading
//   Jali      the pierced stone screen, used as a texture
//   Rosette   the lotus, used where a bullet would otherwise go
//   Abhaya    the open palm, the gesture of "do not fear". It means STOP and it
//             means protection, which is precisely what passing does here
//
// All glyphs are drawn on a 24x24 grid so they line up with each other.

interface GlyphProps {
  size?: number;
  className?: string;
  title?: string;
}

function Svg({
  size = 24,
  className,
  title,
  children,
}: GlyphProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}

/** The chariot wheel. Ratha row, and the mark of the chariot-warrior. */
export function Chakra(p: GlyphProps) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return (
      <line
        key={i}
        x1={12 + Math.cos(a) * 3.2}
        y1={12 + Math.sin(a) * 3.2}
        x2={12 + Math.cos(a) * 8.4}
        y2={12 + Math.sin(a) * 8.4}
      />
    );
  });
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9.2" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      {spokes}
    </Svg>
  );
}

/** Paired tusks. The Gaja row. */
export function Tusks(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M10.5 4c-3 2.6-5 6.2-5 10 0 3.2 1.6 5.4 3.4 5.4 1.3 0 2.1-1 2.1-2.4 0-3.6-.5-9.4-.5-13z" />
      <path d="M13.5 4c3 2.6 5 6.2 5 10 0 3.2-1.6 5.4-3.4 5.4-1.3 0-2.1-1-2.1-2.4 0-3.6.5-9.4.5-13z" />
    </Svg>
  );
}

/** Crossed spears. The Padati row. */
export function Spears(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M5 21 19 5" />
      <path d="M19 5.2 15.6 4.2 16.6 7.6z" fill="currentColor" />
      <path d="M19 21 5 5" />
      <path d="M5 5.2 8.4 4.2 7.4 7.6z" fill="currentColor" />
    </Svg>
  );
}

/**
 * The temple finial. One tier for a rathi, two for an atirathi, three for a
 * maharathi: a greater shrine simply carries a taller spire, so rank reads as
 * height without needing a legend.
 */
export function Kalasha({ tiers = 1, ...p }: GlyphProps & { tiers?: 1 | 2 | 3 }) {
  const rows = [
    { y: 18, w: 7 },
    { y: 14, w: 5.2 },
    { y: 10, w: 3.6 },
  ].slice(0, tiers);
  return (
    <Svg {...p}>
      <line x1="4" y1="21.4" x2="20" y2="21.4" />
      {rows.map((r, i) => (
        <path key={i} d={`M${12 - r.w} ${r.y + 3.2} L${12 - r.w * 0.72} ${r.y} h${r.w * 1.44} L${12 + r.w} ${r.y + 3.2} z`} />
      ))}
      <circle cx="12" cy={rows[rows.length - 1].y - 2.1} r="1.5" fill="currentColor" stroke="none" />
      <line x1="12" y1={rows[rows.length - 1].y - 3.6} x2="12" y2={rows[rows.length - 1].y - 5.4} />
    </Svg>
  );
}

/** The lotus rosette. Used where a bullet or a marker is wanted. */
export function Rosette({ petals = 8, ...p }: GlyphProps & { petals?: number }) {
  const arms = Array.from({ length: petals }, (_, i) => {
    const a = (i * 2 * Math.PI) / petals;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return (
      <path
        key={i}
        d={`M12 12 Q${12 + c * 5 - s * 3.1} ${12 + s * 5 + c * 3.1} ${12 + c * 9.6} ${12 + s * 9.6} Q${12 + c * 5 + s * 3.1} ${12 + s * 5 - c * 3.1} 12 12z`}
      />
    );
  });
  return (
    <Svg {...p}>
      {arms}
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** The open palm. Abhaya mudra: "do not fear". It reads as stop and as shelter. */
export function Abhaya(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M8.4 20.4v-4.2c0-1.4-2-3-2-4.8 0-.9.7-1.4 1.4-1.4.9 0 1.5.7 2 1.7" />
      <path d="M9.8 11.4V5.6c0-.8.6-1.4 1.3-1.4s1.3.6 1.3 1.4v5.2" />
      <path d="M12.4 11V6.2c0-.8.6-1.4 1.3-1.4s1.3.6 1.3 1.4V11" />
      <path d="M15 11.4V7.8c0-.8.6-1.4 1.3-1.4s1.3.6 1.3 1.4v6.4c0 3.6-1.8 6.2-4.4 6.2H8.4" />
    </Svg>
  );
}

/** A coiled formation. The vyuha: the array you cannot walk out of. */
export function Vyuha(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M12 12a2.4 2.4 0 1 1 2.4 2.4A4.8 4.8 0 0 1 9.6 9.6 7.2 7.2 0 0 1 16.8 2.4" />
      <path d="M12 12a2.4 2.4 0 1 0-2.4-2.4M12 12a4.8 4.8 0 0 0 4.8 4.8 7.2 7.2 0 0 0 4.8-2" transform="rotate(180 12 12)" />
      <circle cx="12" cy="12" r="10.4" strokeDasharray="1.4 2.6" />
    </Svg>
  );
}

/**
 * Three oil lamps, two of them lit. Best of three.
 *
 * The first drawing put all three inside a 24-grid with 4px bowls, and at the
 * 22px this actually renders at it read as one faint horizontal line. Fewer
 * strokes, larger bowls, and the flames carried well above the rim.
 */
export function Lamps(p: GlyphProps) {
  const lamp = (x: number, lit: boolean) => (
    <g key={x} opacity={lit ? 1 : 0.4}>
      {lit && <path d={`M${x} 9.4c1.9 1.8 1.9 4.2 0 5.2c-1.9-1-1.9-3.4 0-5.2z`} fill="currentColor" stroke="none" />}
      <path d={`M${x - 3.4} 16.4h6.8a3.4 3.4 0 0 1-6.8 0z`} fill={lit ? 'currentColor' : 'none'} />
    </g>
  );
  return (
    <Svg {...p}>
      {lamp(5, true)}
      {lamp(12, true)}
      {lamp(19, false)}
    </Svg>
  );
}

/** Two turned cards, alternating. Whose move it is. */
export function Alternating(p: GlyphProps) {
  return (
    <Svg {...p}>
      <rect x="3" y="6.4" width="8" height="11.2" rx="1.2" />
      <rect x="13" y="6.4" width="8" height="11.2" rx="1.2" strokeDasharray="1.6 1.8" />
      <path d="M6.2 10.4h1.6M6.2 13h1.6" />
    </Svg>
  );
}

/** A drawn bow. The ordinary skill at arms, as against a divine weapon. */
export function Bow(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M7 3.4a13 13 0 0 1 0 17.2" />
      <path d="M7 3.4 6 12l1 8.6" />
      <path d="M4.6 12H20" />
      <path d="M20 12l-3 -2M20 12l-3 2" />
    </Svg>
  );
}

/** The three lines of an army, stacked. */
export function Lines(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M3.6 6.6h16.8M3.6 12h16.8M3.6 17.4h16.8" />
      <circle cx="6.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="17.6" cy="17.4" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** A conch. Guarded, sheltered, spoken for. */
export function Conch(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M15.4 4.2c2.6 1.8 4 5 4 8.2 0 4.2-2.8 7.2-6.6 7.2-3.4 0-6-2.4-6-5.6 0-2.6 1.8-4.6 4-4.6 1.8 0 3.2 1.3 3.2 3 0 1.3-1 2.3-2.2 2.3" />
      <path d="M15.4 4.2 19 3l-.7 3.4" />
    </Svg>
  );
}

/** A shield boss. Armour still standing. */
export function Boss(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.2 20 6v6.4c0 4.4-3.4 7.4-8 8.4-4.6-1-8-4-8-8.4V6z" />
      <circle cx="12" cy="11.4" r="2.6" />
    </Svg>
  );
}

/** A faceted stone. The adamantine body. */
export function Adamant(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M12 3 21 9.6 12 21 3 9.6z" />
      <path d="M3 9.6h18M12 3l-3.4 6.6L12 21l3.4-11.4z" />
    </Svg>
  );
}

/** A wheel half-swallowed by the ground. Karna at the last. */
export function SunkWheel(p: GlyphProps) {
  return (
    <Svg {...p}>
      <path d="M3.4 17.4h17.2" />
      <path d="M4.6 17.4a7.4 7.4 0 0 1 14.8 0" />
      <path d="M12 10v7.4M7.4 12.2l9.2 5.2M16.6 12.2l-9.2 5.2" />
    </Svg>
  );
}

/**
 * The gateway arch: two pillars, a stepped lintel, a finial.
 *
 * Drawn at a FIXED size and centred, never stretched. The first version was one
 * wide path with preserveAspectRatio="none", and at panel width that squashed
 * the arch about six times horizontally while leaving its height alone, so the
 * shoulders flattened into a hairline and the whole gate read as a stray rule.
 * An arch is the one shape that cannot survive being stretched.
 *
 * Width comes from `Crown` instead, which runs plain rules out to the edges on
 * either side. A straight rule stretches invisibly; an arch does not.
 */
export function Torana({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 50"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* pillars and their capitals */}
      <path d="M12 50V30M148 50V30" />
      <path d="M7.5 30h9M143.5 30h9" />
      {/* The opening, and its echo. One continuous swell rather than a flat top
          with rounded corners, which read as a box at this width. */}
      <path d="M12 30V26Q12 17 31 15 55 12.5 80 12.5 105 12.5 129 15 148 17 148 26V30" />
      <path d="M18.5 30v-4Q18.5 21.5 34 19.5 56 17.5 80 17.5 104 17.5 126 19.5 141.5 21.5 141.5 26V30" opacity=".45" />
      {/* the lintel plinth, and the finial standing on it */}
      <path d="M71.5 12.4h17l-2.2-3.6H73.7z" />
      <path d="M74.5 8.8 80 3.6l5.5 5.2" />
      <circle cx="80" cy="2" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * A masthead: the gate, with a rule running out to either edge and fading.
 * The gate keeps its proportions; only the rules take up the slack.
 */
export function Crown({ className }: { className?: string }) {
  return (
    <div className={`crown ${className ?? ''}`} aria-hidden="true">
      <span className="crown__rule" />
      <Torana />
      <span className="crown__rule" />
    </div>
  );
}

/** A short run of temple-frieze diamonds, for dividing sections. */
export function Frieze({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth=".7"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 4h34M66 4h34" vectorEffect="non-scaling-stroke" />
      <path d="M42 4 46 1l4 3-4 3zM50 4l4-3 4 3-4 3z" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** A die. Chance, and the one throw this whole story turns on. */
export function Aksha(p: GlyphProps) {
  return (
    <Svg {...p}>
      <rect x="3.4" y="6.6" width="10.6" height="10.6" rx="1.4" />
      <path d="m14 17.2 6.6-3.4V3.2L14 6.6" />
      <path d="m3.4 6.6 6.6-3.4h10.6" />
      <circle cx="8.7" cy="11.9" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="5.9" cy="9.1" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="11.5" cy="14.7" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** A yantra. Stands where a syllable would be set in type. */
export function Bindu(p: GlyphProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="9.4" />
      <path d="M12 3.6 20.2 17.6H3.8z" />
      <circle cx="12" cy="13.2" r="1.5" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** A spread of cards. How many are still in hand. */
export function Fan(p: GlyphProps) {
  return (
    <Svg {...p}>
      <rect x="9.6" y="6.6" width="9.4" height="13" rx="1.2" transform="rotate(-16 14.3 13.1)" />
      <rect x="7.3" y="7.4" width="9.4" height="13" rx="1.2" />
      <rect x="12.8" y="7.4" width="9.4" height="13" rx="1.2" transform="rotate(16 17.5 13.9)" />
    </Svg>
  );
}

/** Row marks, by id, so a card can show where a warrior stands. */
export const ROW_GLYPH = { ratha: Chakra, gaja: Tusks, padati: Spears } as const;
