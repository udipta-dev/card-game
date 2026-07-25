// What a victory offers. Recruit a new warrior into your host, or, if a curse
// clings to you, cleanse it. Choices are drawn deterministically from the seed.
import { allCards, getCard } from '@content/cards';
import { nextRandom, shuffle } from '@engine/ids';
import type { CardId, House } from '@engine/types';
import type { RewardOption, RunState } from './types';

/** Units the player could still recruit: their own host, plus rarer legends. */
function recruitPool(house: House, roster: CardId[]): CardId[] {
  const have = new Set(roster);
  return allCards()
    .filter((c) => c.type === 'unit' && !have.has(c.id))
    .filter((c) => c.house === house || c.house === 'legend')
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
        c.house === 'legend'
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
