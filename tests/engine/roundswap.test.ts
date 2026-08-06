// The round trade: one hand card back into the deck at the start of rounds 2
// and 3, before that seat has played anything.
//
// This exists because the numbers said the coolest cards mostly never fired: a
// 19-card deck shows you 10 cards, so any specific answer is a coin flip and a
// two-card pairing is roughly one in four. The opening mulligan corrects round
// 1; nothing corrected a hand that died with the plan it was drawn for.
import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { resolveRound } from '@engine/rounds';
import { legalMoves } from '@engine/selectors';
import { chooseAction } from '@ai/ai';
import { makeState } from './helpers';
import type { GameState } from '@engine/types';

/** A state moved into round 2 the honest way: both pass, round resolves. */
function intoRoundTwo(spec: Parameters<typeof makeState>[0]): GameState {
  const s = makeState(spec);
  s.passed = { player: true, ai: true };
  resolveRound(s);
  return s;
}

describe('when the trade is offered', () => {
  it('not in round 1: the opening mulligan is that correction', () => {
    const s = makeState({ playerHand: ['nakula'], playerDeck: ['sahadeva'] });
    expect(s.roundSwap.player).toBe(false);
    expect(legalMoves(s, 'player').some((m) => m.type === 'ROUND_SWAP')).toBe(false);
  });

  it('offered at the start of round 2, once, to each seat', () => {
    const s = intoRoundTwo({
      playerHand: ['nakula'],
      playerDeck: ['sahadeva', 'satyaki', 'drupada', 'virata'],
    });
    expect(s.round).toBe(2);
    expect(s.decks.player.length).toBeGreaterThan(0); // depth left after the draw
    expect(s.roundSwap.player).toBe(true);
    expect(s.roundSwap.ai).toBe(true);
  });

  it('withdrawn once the seat has played a card this round', () => {
    const s = intoRoundTwo({
      playerHand: ['nakula', 'sahadeva'],
      playerDeck: ['satyaki', 'drupada', 'virata', 'chekitana'],
    });
    s.activeSeat = 'player';
    const iid = s.hands.player[0];
    const played = reduce(s, { type: 'PLAY_CARD', iid, row: 'ratha' });
    // The swap flag survives, but a swap is no longer among the legal moves
    // for this seat this round: after a commit it would be an information
    // play, not a mulligan.
    expect(played.playedThisRound.player).toBe(true);
    expect(
      legalMoves({ ...played, activeSeat: 'player' } as GameState, 'player').some(
        (m) => m.type === 'ROUND_SWAP',
      ),
    ).toBe(false);
  });
});

describe('what the trade does', () => {
  it('hand size holds, the card leaves, a new one arrives', () => {
    const s = intoRoundTwo({
      playerHand: ['nakula'],
      playerDeck: ['sahadeva', 'satyaki', 'drupada', 'virata'],
    });
    s.activeSeat = 'player';
    const traded = s.hands.player.find(
      (i) => s.instances[i].cardId === 'nakula',
    )!;
    const before = s.hands.player.length;

    const after = reduce(s, { type: 'ROUND_SWAP', seat: 'player', iid: traded });
    expect(after.hands.player.length).toBe(before);
    expect(after.hands.player).not.toContain(traded);
    expect(after.decks.player).toContain(traded);
    // Once only.
    expect(after.roundSwap.player).toBe(false);
    expect(reduce(after, { type: 'ROUND_SWAP', seat: 'player', iid: after.hands.player[0] })).toBe(
      after,
    );
  });

  it('does not pass the turn: you traded, now you still act', () => {
    const s = intoRoundTwo({
      playerHand: ['nakula'],
      playerDeck: ['sahadeva', 'satyaki', 'drupada'],
    });
    s.activeSeat = 'player';
    const after = reduce(s, { type: 'ROUND_SWAP', seat: 'player', iid: s.hands.player[0] });
    expect(after.activeSeat).toBe('player');
    expect(after.phase).toBe('playing');
  });

  it('is deterministic: same state, same insert position', () => {
    const s = intoRoundTwo({
      playerHand: ['nakula'],
      playerDeck: ['sahadeva', 'satyaki', 'drupada', 'virata'],
    });
    s.activeSeat = 'player';
    const a = reduce(s, { type: 'ROUND_SWAP', seat: 'player', iid: s.hands.player[0] });
    const b = reduce(s, { type: 'ROUND_SWAP', seat: 'player', iid: s.hands.player[0] });
    expect(a.decks.player).toEqual(b.decks.player);
    expect(a.hands.player).toEqual(b.hands.player);
  });
});

describe('the AI and the trade', () => {
  // The AI does NOT use the trade. The heuristic exists and is correct play,
  // but it is unevenly available: measured over 60 matches Pandava traded 0
  // times and won 35%, Kaurava traded 19 and won 65%, because Pandava astras
  // always keep a possible wielder while the other decks carry astras tied to
  // one named man. Deck spread went 3.0 -> 15.7 points. See AI_USES_ROUND_SWAP.
  it('leaves the trade alone, so the lottery cannot decide matches', () => {
    const s = intoRoundTwo({
      aiHand: ['pashupatastra', 'uluka'],
      aiDeck: ['durmukha', 'vinda', 'anuvinda', 'susharma', 'jalasandha'],
      playerHand: ['nakula'],
      playerDeck: ['sahadeva'],
    });
    s.activeSeat = 'ai';
    expect(chooseAction(s, 'ai').type).not.toBe('ROUND_SWAP');
  });

  it('but the move is still legal, because a human may take it', () => {
    const s = intoRoundTwo({
      aiHand: ['pashupatastra', 'uluka'],
      aiDeck: ['durmukha', 'vinda', 'anuvinda', 'susharma'],
      playerHand: ['nakula'],
      playerDeck: ['sahadeva'],
    });
    s.activeSeat = 'ai';
    expect(legalMoves(s, 'ai').some((m) => m.type === 'ROUND_SWAP')).toBe(true);
  });
});
