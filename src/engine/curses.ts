// Adharma has a price. Loosing a Brahma-line weapon wins you the field and
// then marks you: the curse lands on the one who fired, not the one who was
// struck. Curses are data + a small pure payload, resolved like every other
// mechanic in this engine, never a bespoke branch in the reducer.
import { nextRandom } from './ids';
import { highestUnit, unitsOf } from './queries';
import { ROWS } from './types';
import type { CurseId, GameState, Seat } from './types';

export interface CurseDef {
  id: CurseId;
  name: string;
  /** Shown to the player when it lands. Written from their side of the screen. */
  text: string;
  /** One-shot mechanical payload, applied the moment the curse takes hold. */
  onAfflict?: (state: GameState, seat: Seat) => void;
  /** While carried, this seat cannot invoke astras for the rest of the battle. */
  barsAstras?: boolean;
}

const DEFS: CurseDef[] = [
  {
    id: 'scorched_earth',
    name: 'Scorched Earth',
    text: 'Where your weapon struck, no rain will fall. Every one of your rows withers (-2).',
    onAfflict: (s, seat) => {
      for (const row of ROWS) {
        s.rowMods.push({ seat, row, amount: -2, duration: 'lingering', source: 'adharma' });
      }
    },
  },
  {
    id: 'broken_bowstring',
    name: 'Broken Bowstring',
    text: 'Your mightiest warrior falters, his bowstring snapping at the draw (-4).',
    onAfflict: (s, seat) => {
      const u = highestUnit(s, seat);
      if (u) u.currentPower = Math.max(0, u.currentPower - 4);
    },
  },
  {
    id: 'withered_host',
    name: 'Withered Host',
    text: 'The weapon’s ash settles on your own army. Every warrior you hold weakens (-1).',
    onAfflict: (s, seat) => {
      for (const u of unitsOf(s, seat)) u.currentPower = Math.max(0, u.currentPower - 1);
    },
  },
  {
    id: 'shivas_gaze',
    name: 'Shiva’s Gaze',
    text: 'The three-eyed god has seen what you did. You may loose no astra for the rest of this battle.',
    barsAstras: true,
  },
  {
    id: 'forgotten_mantra',
    name: 'The Forgotten Mantra',
    text: 'As Karna was cursed, the words flee you when you reach for them. No astra this battle, and your mightiest falters (-2).',
    barsAstras: true,
    onAfflict: (s, seat) => {
      const u = highestUnit(s, seat);
      if (u) u.currentPower = Math.max(0, u.currentPower - 2);
    },
  },
];

export const CURSES: Record<CurseId, CurseDef> = Object.freeze(
  DEFS.reduce<Record<CurseId, CurseDef>>((db, c) => {
    db[c.id] = c;
    return db;
  }, {}),
);

/** Every curse id, for content validation. */
export const CURSE_IDS: ReadonlySet<CurseId> = new Set(DEFS.map((c) => c.id));

export function getCurse(id: CurseId): CurseDef | undefined {
  return CURSES[id];
}

/**
 * Draw one curse at random from `pool` and lay it on `seat`. Advances the
 * state seed, so the draw stays deterministic and replayable. A seat never
 * carries the same curse twice.
 */
export function afflict(state: GameState, seat: Seat, pool: CurseId[]): CurseDef | undefined {
  if (!state.curses) state.curses = { player: [], ai: [] };
  const available = pool.filter((id) => CURSES[id] && !state.curses[seat].includes(id));
  if (!available.length) return undefined;
  const [nextSeed, roll] = nextRandom(state.seed);
  state.seed = nextSeed;
  const curse = CURSES[available[Math.floor(roll * available.length)]];
  state.curses[seat].push(curse.id);
  curse.onAfflict?.(state, seat);
  state.log.push({ t: 'afflict', seat, curse: curse.id, name: curse.name, text: curse.text });
  return curse;
}

/** Is this seat barred from invoking astras by something it carries? */
export function cursedAgainstAstras(state: GameState, seat: Seat): boolean {
  return (state.curses?.[seat] ?? []).some((id) => CURSES[id]?.barsAstras);
}
