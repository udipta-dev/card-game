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
  // The AI DOES use the trade now, and the history is the point of these tests.
  //
  // The first heuristic asked one question, "is this astra dead?". Correct
  // play, and unevenly available: over 60 matches Pandava traded 0 times and
  // won 35%, Kaurava traded 19 and won 65%, because every Pandava astra keeps
  // a possible wielder while the other houses carry weapons tied to one named
  // man. Deck spread went 3.0 -> 15.7 points and the flag was turned off.
  //
  // hand.ts judges every card in hand on one scale instead, so the guard here
  // is no longer "never trade". It is "trade for a reason, and let every house
  // do it".
  it('throws a weapon that nobody left alive can fire', () => {
    // Uluka is no astra-master and knows nothing, so the Pashupata in this
    // hand is a brick and the trade is free value.
    const s = intoRoundTwo({
      aiHand: ['pashupatastra', 'uluka'],
      aiDeck: ['durmukha', 'vinda', 'anuvinda', 'susharma', 'jalasandha'],
      playerHand: ['nakula'],
      playerDeck: ['sahadeva'],
    });
    s.activeSeat = 'ai';
    const move = chooseAction(s, 'ai');
    expect(move.type).toBe('ROUND_SWAP');
    if (move.type === 'ROUND_SWAP')
      expect(s.instances[move.iid]?.cardId, 'traded the wrong card').toBe('pashupatastra');
  });

  it('keeps a weapon its own man can still fire', () => {
    // Same weapon, but Arjuna is in the deck and he bears the Pashupata. A
    // rule that threw this away is the one that read the board instead of the
    // whole host, and it cost the lab 3.0 -> 8.6 points of spread.
    const s = intoRoundTwo({
      aiHand: ['pashupatastra', 'uluka'],
      aiDeck: ['arjuna', 'vinda', 'anuvinda', 'susharma', 'jalasandha'],
      playerHand: ['nakula'],
      playerDeck: ['sahadeva'],
    });
    s.activeSeat = 'ai';
    const move = chooseAction(s, 'ai');
    if (move.type === 'ROUND_SWAP')
      expect(s.instances[move.iid]?.cardId, 'threw away a usable weapon').not.toBe('pashupatastra');
  });

  it('never trades a card for one it values less', () => {
    // A hand of good cards is left alone. Cycling a fine card for an unknown
    // one is a coin flip, not a play, and an AI that trades every round out of
    // habit is the "lottery decides matches" failure the old flag guarded.
    const s = intoRoundTwo({
      aiHand: ['bhishma', 'drona'],
      aiDeck: ['durmukha', 'uluka', 'shakuni'],
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
