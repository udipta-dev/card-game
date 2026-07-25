// The gods intervene between battles. A shrine offers two doors to the same
// thing: a VARDAAN taken now (a one-shot gift, some with a shrap bound to it),
// or TAPASYA, where a great warrior leaves your host for several battles and
// returns bearing a divyastra. Both are "power, at a price", which is the only
// way the epic ever hands anything out.
import { getCard } from '@content/cards';
import { VARDAAN_CARDS } from '@content/cards/vardaan';
import { nextRandom } from '@engine/ids';
import type { CardId, CurseId } from '@engine/types';
import type { RunState } from './types';

/** A god who may be approached, and what tapasya to them yields. */
export interface Deity {
  id: string;
  name: string;
  epithet: string;
  /** Astras this god may teach. */
  teaches: CardId[];
  /** Battles the warrior is absent. Greater weapons cost longer penance. */
  battles: number;
  /** Only warriors this strong may approach. */
  minPower: number;
  /** Only warriors trained this far may approach (astra mastery). */
  minMastery: number;
}

export const DEITIES: Deity[] = [
  {
    id: 'agni',
    name: 'Agni',
    epithet: 'lord of fire',
    teaches: ['agneyastra'],
    battles: 1,
    minPower: 8,
    minMastery: 0,
  },
  {
    id: 'varuna',
    name: 'Varuna',
    epithet: 'lord of waters',
    teaches: ['varunastra'],
    battles: 1,
    minPower: 8,
    minMastery: 0,
  },
  {
    id: 'vayu',
    name: 'Vayu',
    epithet: 'the wind, father of Bhima',
    teaches: ['vayavyastra'],
    battles: 1,
    minPower: 8,
    minMastery: 0,
  },
  {
    id: 'indra',
    name: 'Indra',
    epithet: 'king of the devas',
    teaches: ['aindrastra', 'vasavi_shakti'],
    battles: 2,
    minPower: 9,
    minMastery: 1,
  },
  {
    id: 'brahma',
    name: 'Brahma',
    epithet: 'the creator',
    teaches: ['brahmastra', 'brahmashirsha'],
    battles: 2,
    minPower: 9,
    minMastery: 2,
  },
  {
    id: 'shiva',
    name: 'Shiva',
    epithet: 'the destroyer, who tests those who dare seek him',
    teaches: ['pashupatastra'],
    battles: 3,
    minPower: 10,
    minMastery: 2,
  },
];

/** The price bound to a gift. Nothing the gods give is free. */
export type Shrap =
  | { kind: 'curse'; curse: CurseId; text: string }
  | { kind: 'sacrifice'; warrior: CardId; text: string };

export interface VardaanOffer {
  kind: 'vardaan';
  id: string;
  cardId: CardId;
  /** Bound price, if this gift carries one. */
  shrap?: Shrap;
}

export interface PenanceOffer {
  kind: 'penance';
  id: string;
  deityId: string;
  warrior: CardId;
  astra: CardId;
  battles: number;
}

export type ShrineOffer = VardaanOffer | PenanceOffer;

/** Shrines stand before these rungs of the ladder. */
export const SHRINE_BEFORE = [2, 4];

export function isShrineIndex(index: number): boolean {
  return SHRINE_BEFORE.includes(index);
}

function mix(seed: number, salt: number): number {
  const [s] = nextRandom((seed ^ (salt * 0x27d4eb2d)) >>> 0);
  return s;
}
function pick<T>(items: T[], seed: number): [T, number] {
  const [next, roll] = nextRandom(seed);
  return [items[Math.floor(roll * items.length)], next];
}

const BOUND_CURSES: CurseId[] = ['scorched_earth', 'withered_host', 'broken_bowstring'];

/**
 * What this shrine offers. Deterministic on the run seed and ladder position,
 * so the same run always meets the same gods with the same terms.
 */
export function rollShrine(run: RunState): ShrineOffer[] {
  let seed = mix(run.seed, run.index + 101);
  const offers: ShrineOffer[] = [];

  const held = new Set([...run.roster, ...run.banned]);
  const gifts = VARDAAN_CARDS.filter((c) => !held.has(c.id)).map((c) => c.id);
  const rosterUnits = run.roster.filter((id) => getCard(id).type === 'unit');

  // Two gifts. The second carries a shrap: the greater the gift, the greater
  // the price, and the player sees exactly what it costs before accepting.
  for (let i = 0; i < 2 && gifts.length; i++) {
    const [cardId, s1] = pick(gifts, seed);
    seed = s1;
    gifts.splice(gifts.indexOf(cardId), 1);

    let shrap: Shrap | undefined;
    if (i === 1) {
      const [roll, s2] = [nextRandom(seed)[1], nextRandom(seed)[0]];
      seed = s2;
      if (roll < 0.5 && rosterUnits.length > 4) {
        // A life for a gift, as Karna traded his armour away.
        const [warrior, s3] = pick(rosterUnits, seed);
        seed = s3;
        shrap = {
          kind: 'sacrifice',
          warrior,
          text: `${getCard(warrior).name} leaves your host forever.`,
        };
      } else {
        const [curse, s3] = pick(BOUND_CURSES, seed);
        seed = s3;
        shrap = { kind: 'curse', curse, text: 'A shrap binds itself to you for the next battle.' };
      }
    }
    offers.push({ kind: 'vardaan', id: `v-${run.index}-${i}`, cardId, shrap });
  }

  // One penance, if any warrior in the host is worthy of the god who is here.
  const away = new Set(run.away.map((p) => p.warrior));
  for (const deity of shuffledDeities(run, seed)) {
    const worthy = rosterUnits.filter((id) => {
      if (away.has(id)) return false;
      const c = getCard(id);
      return (c.basePower ?? 0) >= deity.minPower && (c.astraMastery ?? 0) >= deity.minMastery;
    });
    const teachable = deity.teaches.filter((a) => !held.has(a));
    if (!worthy.length || !teachable.length) continue;

    const [warrior, s1] = pick(worthy, seed);
    seed = s1;
    const [astra] = pick(teachable, seed);
    offers.push({
      kind: 'penance',
      id: `p-${run.index}`,
      deityId: deity.id,
      warrior,
      astra,
      battles: deity.battles,
    });
    break;
  }

  return offers;
}

/** Deities in a seeded order, greatest first when the host can reach them. */
function shuffledDeities(run: RunState, seed: number): Deity[] {
  const [, roll] = nextRandom(seed ^ run.index);
  const start = Math.floor(roll * DEITIES.length);
  // Rotate so different runs meet different gods, then prefer the greatest the
  // host actually qualifies for by walking from the strongest down.
  const rotated = [...DEITIES.slice(start), ...DEITIES.slice(0, start)];
  return rotated.sort((a, b) => b.battles - a.battles);
}

export function getDeity(id: string): Deity | undefined {
  return DEITIES.find((d) => d.id === id);
}
