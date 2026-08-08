import { getCard } from '@content/cards';
// Adharma has a price. Loosing a Brahma-line weapon wins you the field and
// then marks you: the curse lands on the one who fired, not the one who was
// struck. Curses are data + a small pure payload, resolved like every other
// mechanic in this engine, never a bespoke branch in the reducer.
import { nextRandom } from './ids';
import { lowerPower } from './keywords';
import { highestUnit, isFinalRound, unitsOf } from './queries';
import { ROWS } from './types';
import type { CurseId, GameState, Seat, CardInstance } from './types';

export interface CurseDef {
  id: CurseId;
  name: string;
  /** Shown to the player when it lands. Written from their side of the screen. */
  text: string;
  /** One-shot mechanical payload, applied the moment the curse takes hold. */
  onAfflict?: (state: GameState, seat: Seat, by?: string) => void;
  /**
   * While carried, this seat cannot invoke astras: either for the whole battle,
   * or only when it actually matters.
   *
   * The second mode exists because the text is specific and we were not.
   * Parashurama's curse on Karna is not a blanket ban, it is a delayed-action
   * one: "in consequence of the deception by which thou hast obtained this
   * weapon, it will never, AT THE TIME OF NEED, WHEN THE HOUR OF THY DEATH
   * COMES, occur to thy memory" (Karna P. XLII). Karna keeps his weapons all
   * war and loses them at the one moment he needs them.
   */
  barsAstras?: 'battle' | 'finalRound';
}

/**
 * The warrior most likely to have loosed a weapon on this side.
 *
 * Nothing records who fired: canInvokeAstra asks whether ANY standing man
 * could, and the reducer never picks one. Rather than thread a firer through
 * every path an astra can take (played, countered, drawn onto a rod, resolved
 * out of a pending counter), the price falls on the man who most plausibly
 * spoke the mantra: the deepest-trained warrior on the field, and a named
 * bearer ahead of him, since for an ultimate he is the only one who could.
 */
function likelyInvoker(s: GameState, seat: Seat, astraId?: string): CardInstance | undefined {
  const own = unitsOf(s, seat);
  if (astraId) {
    const bearer = own.find((u) => getCard(u.cardId).knownAstras?.includes(astraId));
    if (bearer) return bearer;
  }
  return own
    .slice()
    .sort(
      (a, b) =>
        (getCard(b.cardId).astraMastery ?? 0) - (getCard(a.cardId).astraMastery ?? 0) ||
        b.currentPower - a.currentPower,
    )[0];
}

const DEFS: CurseDef[] = [
  {
    // THE PRICE FALLS ON THE MAN WHO PAID IT, not on his whole army.
    //
    // Every other curse here scours the host: rows withered, every warrior
    // weakened, the mightiest man's bowstring cut. That reads as the game
    // punishing you for using the content it gave you, and it is not what the
    // epic describes either. A divine weapon costs its INVOKER: the mantra is
    // spent, the merit is gone, and he cannot call another.
    //
    // A quarter of his strength rather than a flat number, so it costs a
    // maharathi more than it costs a footman, and it can never take a man to
    // nothing.
    id: 'invokers_price',
    name: 'The Invoker’s Price',
    text: 'The man who spoke the mantra pays for it: a quarter of his strength, and he will call no other weapon.',
    onAfflict: (s, seat, by) => {
      const u = likelyInvoker(s, seat, by);
      if (!u) return;
      lowerPower(s, u, Math.max(1, Math.round(u.currentPower / 4)));
      // Spent for the battle: canInvokeAstra skips him from here on.
      u.flags.add('mantra-spent');
    },
  },
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
      if (u) lowerPower(s, u, 4);
    },
  },
  {
    id: 'withered_host',
    name: 'Withered Host',
    text: 'The weapon’s ash settles on your own army. Every warrior you hold weakens (-1).',
    onAfflict: (s, seat) => {
      for (const u of unitsOf(s, seat)) lowerPower(s, u, 1);
    },
  },
  {
    id: 'shivas_gaze',
    name: 'Shiva’s Gaze',
    text: 'The three-eyed god has seen what you did. You may loose no astra for the rest of this battle.',
    barsAstras: 'battle',
  },
  {
    // WAS a flat battle-long ban, which is Shiva's Gaze with different words on
    // it. Parashurama cursed Karna far more precisely than that: the weapon
    // fails "at the time of need, when the hour of thy death comes". So the
    // mantras answer you all battle and desert you in the round that decides
    // it, which is both the sourced reading and the more frightening card.
    id: 'forgotten_mantra',
    name: 'The Forgotten Mantra',
    text: 'As Karna was cursed, the words come when you do not need them. In the deciding round you will reach for an astra and find nothing, and your mightiest falters now (-2).',
    barsAstras: 'finalRound',
    onAfflict: (s, seat) => {
      const u = highestUnit(s, seat);
      if (u) lowerPower(s, u, 2);
    },
  },
  {
    // Gandhari to Krishna over the bodies of her hundred sons, Stri Parva
    // XXV: "thou shalt be the slayer of thy own kinsmen!" She curses him for
    // standing by, and the Vrishnis end by killing each other.
    //
    // Canonically it detonates in the thirty-sixth year, and a battle has no
    // thirty-sixth year, so what carries over is the kin-slaying rather than
    // the delay: the strongest man in your host turns on the next strongest.
    id: 'kin_slayer',
    name: 'The Kin-Slayer’s Curse',
    text: 'As Gandhari cursed Krishna for standing by: you shall be the slayer of your own kinsmen. Your mightiest warrior turns on the next mightiest (-5).',
    onAfflict: (s, seat) => {
      const first = highestUnit(s, seat);
      if (!first) return;
      const rest = unitsOf(s, seat).filter((u) => u.iid !== first.iid);
      if (!rest.length) return;
      const second = rest.reduce((a, b) => (b.currentPower > a.currentPower ? b : a));
      lowerPower(s, second, 5);
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
export function afflict(state: GameState, seat: Seat, pool: CurseId[], by?: string): CurseDef | undefined {
  if (!state.curses) state.curses = { player: [], ai: [] };
  const available = pool.filter((id) => CURSES[id] && !state.curses[seat].includes(id));
  if (!available.length) return undefined;
  const [nextSeed, roll] = nextRandom(state.seed);
  state.seed = nextSeed;
  const curse = CURSES[available[Math.floor(roll * available.length)]];
  state.curses[seat].push(curse.id);
  curse.onAfflict?.(state, seat, by);
  state.log.push({ t: 'afflict', seat, curse: curse.id, name: curse.name, text: curse.text, by });
  return curse;
}

/** Is this seat barred from invoking astras by something it carries? */
export function cursedAgainstAstras(state: GameState, seat: Seat): boolean {
  return (state.curses?.[seat] ?? []).some((id) => {
    const bars = CURSES[id]?.barsAstras;
    if (!bars) return false;
    return bars === 'battle' || isFinalRound(state);
  });
}
