// What a victory offers. Recruit a new warrior into your host, or, if a curse
// clings to you, cleanse it. Choices are drawn deterministically from the seed.
import { allCards, getCard } from '@content/cards';
import { nextRandom, shuffle } from '@engine/ids';
import type { CardId, House } from '@engine/types';
import type { RewardOption, RunState } from './types';

/**
 * What a victory can offer: a warrior for your host, or a NAMED WEAPON found on
 * the field.
 *
 * The shastras were unreachable before this. All six of them - Gandiva, Vajra,
 * Chandrahasa, Asi, Kaumodaki, Parasu - sat in no starter deck, no shrine pool
 * and no reward list, so six finished cards existed that no player could ever
 * obtain. The run layer had no shastra path at all.
 *
 * A found weapon is the right home for them. They are objects rather than
 * mantras: things that changed hands, were taken from a field, or were given.
 * Bows and maces and swords are what a victory yields.
 */
function recruitPool(house: House, roster: CardId[]): CardId[] {
  const have = new Set(roster);
  return allCards()
    .filter((c) => !have.has(c.id))
    .filter((c) =>
      c.type === 'unit'
        ? c.house === house || c.house === 'legend'
        : c.type === 'shastra' && (c.house === house || c.house === 'neutral'),
    )
    .map((c) => c.id);
}

/**
 * Three choices after a win. Recruits are weighted toward the player's own
 * host; a legend shows up now and then as the rarer prize. If the player is
 * cursed, one slot becomes a cleanse instead.
 */
export function rollRewards(run: RunState): RewardOption[] {
  const pool = recruitPool(run.house, run.roster);
  const [shuffled] = shuffle(pool, mixSeed(run.seed, run.index));
  const picks = shuffled.slice(0, 3);

  const options: RewardOption[] = picks.map((id) => {
    const c = getCard(id);
    return {
      kind: 'recruit',
      cardId: id,
      label: c.name,
      text:
        c.type === 'shastra'
          ? `${c.name} is yours to put in a warrior's hands. ${c.flavor ?? ''}`.trim()
          : c.house === 'legend'
            ? `A legend joins your host. ${c.flavor ?? ''}`.trim()
            : `Recruit ${c.name} (power ${c.basePower}) to your host.`,
    };
  });

  if (run.pendingCurses.length && options.length) {
    options[options.length - 1] = {
      kind: 'cleanse',
      label: 'Rites of Absolution',
      text: 'A priest lifts the curse clinging to you before the next battle.',
    };
  }
  return options;
}

/** Deterministic per-reward seed so the same run offers the same choices. */
export function mixSeed(seed: number, index: number): number {
  const [s] = nextRandom((seed ^ (index * 0x9e3779b1)) >>> 0);
  return s;
}
