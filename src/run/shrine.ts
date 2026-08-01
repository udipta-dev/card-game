// The gods intervene between battles. A shrine offers two doors to the same
// thing: a VARDAAN taken now (a one-shot gift, some with a shrap bound to it),
// or TAPASYA, where a great warrior leaves your host for several battles and
// returns bearing a divyastra. Both are "power, at a price", which is the only
// way the epic ever hands anything out.
import { getCard } from '@content/cards';
import { VARDAAN_CARDS } from '@content/cards/vardaan';
import { nextRandom } from '@engine/ids';
import type { CardId, CurseId, House } from '@engine/types';
import type { RunState } from './types';

/** A god who may be approached, and what tapasya to them yields. */
export interface Deity {
  id: string;
  name: string;
  epithet: string;
  /**
   * What this god may teach, banded by astra tier. A god only gives what is
   * his to give: roll a tier above his reach and he steps down; roll below his
   * least and he gives nothing. Shiva keeps only the Pashupatastra, which is
   * why approaching him is a wager and not an errand.
   */
  domain: Partial<Record<1 | 2 | 3, CardId[]>>;
  /** The least standing this god will even receive. */
  minWorth: number;
  /**
   * Which hosts may approach at all. Omit for "anyone". Used sparingly, and
   * NOT as a blanket deva/asura split: Shiva gave Ravana his boons and the
   * Chandrahasa, and Brahma armed Hiranyakashipu. Only Vishnu's weapons are
   * genuinely closed to the asuras, being the ones made to end them.
   */
  houses?: House[];
  /**
   * A god who will only teach a warrior already bearing an ultimate. This is
   * the chain that makes the greatest weapons the END of a path rather than a
   * purchase: you cannot buy your way to the Pashupat-Astra in one wager,
   * however long you sit.
   */
  requiresPriorTier3?: boolean;
}

export const DEITIES: Deity[] = [
  {
    id: 'agni',
    name: 'Agni',
    epithet: 'lord of fire',
    domain: { 1: ['agneyastra'] },
    minWorth: 8,
  },
  {
    id: 'varuna',
    name: 'Varuna',
    epithet: 'lord of waters',
    domain: { 1: ['varunastra'] },
    minWorth: 8,
  },
  {
    id: 'vayu',
    name: 'Vayu',
    epithet: 'the wind, father of Bhima',
    domain: { 1: ['vayavyastra'] },
    minWorth: 8,
  },
  {
    id: 'indra',
    name: 'Indra',
    epithet: 'king of the devas',
    domain: { 1: ['aindrastra'], 2: ['sammohana'], 3: ['vasavi_shakti'] },
    minWorth: 10,
  },
  {
    id: 'brahma',
    name: 'Brahma',
    epithet: 'the creator',
    // Samvodhana added at tier 1. Praswapa already named it as its counter, but
    // the card was in no deck, no shrine and no reward list, so the answer to a
    // weapon the Kaurava deck actually carries could never be held by anyone.
    // Brahma keeps it because Praswapa is Prajapati's and the two reached
    // Bhishma together, from eight Brahmanas in one dream (Udyoga CLXXXVI).
    domain: { 1: ['samvodhana'], 2: ['brahmastra'], 3: ['brahmashirsha'] },
    minWorth: 11,
  },
  {
    id: 'parashurama',
    name: 'Parashurama',
    epithet: 'the axe-bearer, who taught Karna',
    // Tier 2 had exactly one weapon in any god's gift (the Brahma-Astra), and
    // every starting deck already holds it, so the tier could never pay out:
    // measured at 0% offered across 1200 shrines. The Bhargavastra existed as
    // a card belonging to nobody. It belongs here.
    domain: { 2: ['bhargavastra'] },
    minWorth: 11,
  },
  {
    id: 'narayana',
    name: 'Narayana',
    epithet: 'Vishnu, who preserves',
    // Sauparna at tier 1. It left the Pandava deck to make room for the
    // deception card and would otherwise have been stranded in no deck, no
    // shrine and no reward list, which would have left the Kaurava Nag-Astra
    // with no answer anywhere in the game. Garuda is Vishnu's own mount, and
    // this shrine could previously give nothing but tier 3, so it now has a
    // rung it can actually pay.
    domain: { 1: ['sauparna'], 3: ['narayanastra', 'vaishnavastra'] },
    minWorth: 11,
    // The weapons made to end the asuras are not lent to them.
    houses: ['pandava', 'kaurava', 'legend', 'neutral'],
  },
  {
    id: 'shiva',
    name: 'Shiva',
    epithet: 'the destroyer, who tests those who dare seek him',
    domain: { 3: ['pashupatastra'] },
    // 14, not 13. At 13 both Ravana and Indrajit qualified, and an asura host
    // could earn the Pashupat-Astra. At 14 the door is Arjuna, Bhishma and
    // Karna, which is the "three or four in the books" the tiering is meant to
    // reflect. This is a truer gate than a house rule would be, since Shiva
    // demonstrably DOES give to asuras; it is this one weapon that is not theirs.
    // Standing 14 no longer carries this on its own, and it should never have
    // been asked to. The number was tuned to admit Arjuna, Bhishma and Karna at
    // 14 while excluding Ravana and Indrajit at 13, which encoded a judgement
    // about WHO as a fact about HOW STRONG. The moment Ravana went to 10 he
    // became worth 14 himself and walked straight through, and raising the bar
    // to 15 would have shut out all four.
    //
    // So the canon claim is now stated as one. Shiva's shrine offers exactly one
    // weapon and it is the one weapon of his that no asura ever wields. He gave
    // Ravana boons, and the Chandrahasa, and took his heads as an offering; he
    // did not give him this. Everything else Shiva-flavoured stays open to them.
    houses: ['pandava', 'kaurava', 'neutral', 'legend'],
    minWorth: 14,
    requiresPriorTier3: true,
  },
];

/**
 * What a warrior brings to a god: his rank, and whether he was ever taught to
 * handle divine weapons at all. Arjuna and Bhishma stand at 14; Bhima, mighty
 * but never trained in the mantras, stands at 9.
 */
export function worthOf(cardId: CardId): number {
  const c = getCard(cardId);
  return (c.basePower ?? 0) + (c.astraMastery ?? 0) * 2;
}

export interface PenanceOdds {
  fail: number;
  t1: number;
  t2: number;
  t3: number;
}

/**
 * The wager. Standing and length of penance together decide how high a warrior
 * can reach, and nothing is ever certain. Tier 3 is walled off behind both a
 * true astra-master AND a long absence, so the ultimates stay rare by design
 * rather than by price.
 */
export function penanceOdds(
  warrior: CardId,
  battles: number,
  /** Astras this warrior has ALREADY earned through an earlier tapasya. */
  earned: readonly CardId[] = [],
): PenanceOdds {
  const worth = worthOf(warrior);
  const mastery = getCard(warrior).astraMastery ?? 0;
  // Each tier is now a different KIND of undertaking, not the same errand at a
  // different length. Before this, all three tiers were bought with the same
  // currency and differed only in how many battles they cost, which is exactly
  // what made a world-ender feel like a longer chore.
  //
  // TIER 2, the Brahma line: a TRAINED astra-master, full stop. Standing 9 let
  // through anyone merely strong, so Bhima qualified for weapons he was never
  // taught the mantras for. Mastery is the thing the tier actually implies.
  const canReachTwo = mastery >= 2 && battles >= 2;
  // TIER 3, the ultimates: a CHAIN. Standing and length are necessary but no
  // longer sufficient. The warrior must already have come back from a tapasya
  // bearing something, so the ultimates sit at the end of a path rather than at
  // a price. You cannot buy one in a single wager, however long you sit.
  const canReachThree = worth >= 13 && battles >= 3 && earned.length > 0;

  const w3 = canReachThree ? (worth - 10) * 2 + (battles - 2) * 6 : 0;
  const w2 = canReachTwo ? 10 + battles * 3 : 0;
  const w1 = 14;
  const wFail = Math.max(2, 18 - worth - battles * 3);

  const total = w3 + w2 + w1 + wFail;
  return { t3: w3 / total, t2: w2 / total, t1: w1 / total, fail: wFail / total };
}

/**
 * Odds as this god will ACTUALLY pay them, after his domain and after what the
 * host already owns.
 *
 * `held` is not optional in spirit. Every starting deck carries the
 * Brahma-Astra, and Brahma's tier-2 domain contains only the Brahma-Astra, so
 * without it this function advertised a 50% chance at a weapon the roll could
 * never hand over: 39 penances, 14 returns, zero astras in simulation. Display
 * and roll must consult exactly the same information.
 */
export function effectiveOdds(
  deity: Deity,
  warrior: CardId,
  battles: number,
  held: ReadonlySet<CardId> = new Set(),
  earned: readonly CardId[] = [],
): PenanceOdds {
  const raw = penanceOdds(warrior, battles, earned);
  const out: PenanceOdds = { fail: raw.fail, t1: 0, t2: 0, t3: 0 };
  for (const tier of [3, 2, 1] as const) {
    const share = tier === 3 ? raw.t3 : tier === 2 ? raw.t2 : raw.t1;
    if (share <= 0) continue;
    const given = stepDown(deity, tier, held);
    if (given === null) out.fail += share;
    else if (given === 3) out.t3 += share;
    else if (given === 2) out.t2 += share;
    else out.t1 += share;
  }
  return out;
}

/**
 * Whether this host and this warrior may approach at all, before any odds are
 * computed. Kept separate from the odds so an ineligible pairing is never
 * OFFERED, rather than being offered at zero and reading as bad luck.
 */
export function mayApproach(
  deity: Deity,
  warrior: CardId,
  house: House,
  earned: readonly CardId[] = [],
): boolean {
  if (worthOf(warrior) < deity.minWorth) return false;
  if (deity.houses && !deity.houses.includes(house)) return false;
  if (deity.requiresPriorTier3) {
    // Shiva teaches only a warrior who has already been taught an ultimate.
    if (!earned.some((a) => (getCard(a).astraTier ?? 1) >= 3)) return false;
  }
  return true;
}

/**
 * A god gives what is his AND what you do not already have: the rolled tier, or
 * the greatest lesser one he can still hand over. A tier whose every weapon is
 * already in your host is not something he can give.
 */
function stepDown(deity: Deity, tier: 1 | 2 | 3, held: ReadonlySet<CardId>): 1 | 2 | 3 | null {
  for (let t = tier; t >= 1; t--) {
    const pool = deity.domain[t as 1 | 2 | 3] ?? [];
    if (pool.some((a) => !held.has(a))) return t as 1 | 2 | 3;
  }
  return null;
}

/**
 * Roll what the warrior actually returns bearing. Null means the god was not
 * satisfied and he comes back empty-handed, which is the risk you accepted.
 */
export function rollPenanceOutcome(
  deity: Deity,
  warrior: CardId,
  battles: number,
  seed: number,
  exclude: ReadonlySet<CardId>,
  earned: readonly CardId[] = [],
): { astra: CardId | null; seed: number } {
  const odds = penanceOdds(warrior, battles, earned);
  const [next, roll] = nextRandom(seed);
  let acc = odds.t3;
  let tier: 1 | 2 | 3 | null = null;
  if (roll < acc) tier = 3;
  else if (roll < (acc += odds.t2)) tier = 2;
  else if (roll < acc + odds.t1) tier = 1;

  if (tier === null) return { astra: null, seed: next };
  // Same held-aware walk the displayed odds use, so the two can never disagree.
  const given = stepDown(deity, tier, exclude);
  if (given === null) return { astra: null, seed: next };

  const pool = (deity.domain[given] ?? []).filter((a) => !exclude.has(a));
  if (!pool.length) return { astra: null, seed: next };
  const [chosen, after] = pick(pool, next);
  return { astra: chosen, seed: after };
}

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
  battles: number;
  /** Shown to the player before they commit. The wager is never blind. */
  odds: PenanceOdds;
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

  // The god at this shrine, and the wagers he will entertain. The longest
  // penance is bounded so the warrior can still return before the last rung:
  // commit too late and he would never rejoin the host at all.
  const away = new Set(run.away.map((p) => p.warrior));
  const maxBattles = Math.max(1, run.ladder.length - 1 - run.index);

  const candidates = rosterUnits
    .filter((id) => !away.has(id))
    .sort((a, b) => worthOf(b) - worthOf(a));

  // Gather every god this host could actually reach, then choose among them by
  // seed. Taking the first match in a fixed order let the elemental gods, who
  // receive almost anyone, crowd out Brahma and Shiva entirely.
  // Every gate now runs through mayApproach, so a warrior who cannot satisfy a
  // god is never OFFERED him. An impossible wager shown at zero would read as
  // bad luck rather than as a door that was never open.
  const earnedBy = (id: CardId): readonly CardId[] => run.astraGrants[id] ?? [];
  const reachable = DEITIES.filter((d) => {
    const eligible = candidates.filter((id) => mayApproach(d, id, run.house, earnedBy(id)));
    const teachable = Object.values(d.domain).flat().filter((a) => !held.has(a));
    return eligible.length > 0 && teachable.length > 0;
  });

  for (const deity of seededOrder(reachable, seed)) {
    const eligible = candidates.filter((id) => mayApproach(deity, id, run.house, earnedBy(id)));
    const best = eligible[0];
    const lesser = eligible.find((id) => worthOf(id) < worthOf(best));
    const durations = uniqueNums([maxBattles, Math.ceil(maxBattles / 2), 1]);

    // Two axes the player can actually game: how long, and whom to send.
    const wagers: { warrior: CardId; battles: number }[] = durations.map((b) => ({
      warrior: best,
      battles: b,
    }));
    if (lesser && maxBattles > 1) wagers.push({ warrior: lesser, battles: maxBattles });

    // A god never offers a bargain he cannot honour. Brahma holds nothing at the
    // elemental tier, so a short penance to him would be a guaranteed nothing:
    // that is not a wager, it is a trap, and it does not get shown.
    const viable = wagers
      .map((w) => ({ ...w, odds: effectiveOdds(deity, w.warrior, w.battles, held, earnedBy(w.warrior)) }))
      .filter((w) => w.odds.t1 + w.odds.t2 + w.odds.t3 >= MIN_VIABLE_CHANCE)
      .slice(0, 3);
    if (!viable.length) continue;

    viable.forEach((w, i) =>
      offers.push({
        kind: 'penance',
        id: `p-${run.index}-${i}`,
        deityId: deity.id,
        warrior: w.warrior,
        battles: w.battles,
        odds: w.odds,
      }),
    );
    break;
  }

  return offers;
}

/** Below this chance of any reward, the wager is not worth a player's time. */
const MIN_VIABLE_CHANCE = 0.2;

function uniqueNums(xs: number[]): number[] {
  return [...new Set(xs)].sort((a, b) => b - a);
}

/** A seeded rotation of the gods, so different runs meet different powers. */
function seededOrder(deities: Deity[], seed: number): Deity[] {
  if (!deities.length) return deities;
  const [, roll] = nextRandom(seed);
  const start = Math.floor(roll * deities.length);
  return [...deities.slice(start), ...deities.slice(0, start)];
}

export function getDeity(id: string): Deity | undefined {
  return DEITIES.find((d) => d.id === id);
}
