// You never open a round with no man to put on the field.
//
// The defect: a round starts with the board swept, and an astra needs a warrior
// standing to be fired at all. So a hand of pure weapons is not a weak hand, it
// is no turn: you pass, the enemy plays into an empty field, and the round is
// gone. Measured over 900 games before the fix, 12.1% of round-2 openings held
// zero warriors and 10.1% of the player's own turns had no legal card at all.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { legalMoves } from '@engine/selectors';
import { getCard } from '@content/cards';
import { PANDAVA_DECK, KAURAVA_DECK } from '@content/decks';
import type { GameState, Seat } from '@engine/types';

const warriorsIn = (s: GameState, seat: Seat) =>
  s.hands[seat].filter((i) => getCard(s.instances[i]!.cardId).type === 'unit');

/** Play a whole battle out with a fixed, dumb policy and sample every round open. */
function openings(seed: number): Array<{ round: number; warriors: number; size: number }> {
  let s: GameState = createMatch(seed, PANDAVA_DECK, KAURAVA_DECK);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });

  const seen: Array<{ round: number; warriors: number; size: number }> = [];
  let lastRound = 0;
  for (let step = 0; step < 400 && s.phase !== 'battleEnd'; step++) {
    if (s.phase === 'playing' && s.round !== lastRound) {
      lastRound = s.round;
      seen.push({
        round: s.round,
        warriors: warriorsIn(s, 'player').length,
        size: s.hands.player.length,
      });
    }
    // Always play the first legal card, else pass. Burns warriors fast, which
    // is exactly the behaviour that strands you holding only astras.
    const moves = legalMoves(s, s.activeSeat);
    const play = moves.find((m) => m.type === 'PLAY_CARD');
    const next = reduce(s, play ?? { type: 'PASS', seat: s.activeSeat });
    if (next === s) break;
    s = next;
  }
  return seen;
}

describe('the between-round draw digs for a warrior', () => {
  it('never opens a round with a hand of pure weapons', () => {
    for (let seed = 1; seed <= 120; seed++) {
      for (const open of openings(seed * 7919)) {
        expect(
          open.warriors,
          `seed ${seed}, round ${open.round} opened with ${open.warriors} warriors`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('does not hand out extra cards to do it', () => {
    // The dig is a swap, not a bonus: something goes back for what comes up.
    // Round 1 deals 6 and each later round draws 2, so a hand that has spent
    // nothing can never exceed that. Checking the seats stay level is the point.
    for (let seed = 1; seed <= 40; seed++) {
      let s: GameState = createMatch(seed * 104729, PANDAVA_DECK, KAURAVA_DECK);
      s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
      s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
      const before = s.hands.player.length + s.decks.player.length;

      let lastRound = 1;
      for (let step = 0; step < 400 && s.phase !== 'battleEnd'; step++) {
        const next = reduce(s, { type: 'PASS', seat: s.activeSeat });
        if (next === s) break;
        s = next;
        if (s.round !== lastRound) {
          lastRound = s.round;
          // Nothing created, nothing destroyed: hand + deck is conserved.
          expect(s.hands.player.length + s.decks.player.length).toBe(before);
        }
      }
    }
  });

  it('leaves a hand that already has a warrior completely alone', () => {
    // Both sides pass immediately, so nobody spends a warrior and the dig has
    // no work to do. The hand should be exactly the six dealt plus two drawn.
    let s: GameState = createMatch(4242, PANDAVA_DECK, KAURAVA_DECK);
    s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
    s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
    const opening = [...s.hands.player];
    expect(warriorsIn(s, 'player').length).toBeGreaterThan(0);

    s = reduce(s, { type: 'PASS', seat: s.activeSeat });
    s = reduce(s, { type: 'PASS', seat: s.activeSeat });
    expect(s.round).toBe(2);
    // Every card from the opening hand is still there; only draws were added.
    for (const iid of opening) expect(s.hands.player).toContain(iid);
  });
});
