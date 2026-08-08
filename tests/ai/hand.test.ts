// The AI's hand management, which for a long time did not exist.
//
// It never mulliganed: there was no policy anywhere, so every match in every
// lab run was played by an opponent that kept whatever six cards it was dealt.
// It never traded either, because the only heuristic written for it asked one
// narrow question ("is this astra dead?") that was true far more often for two
// houses than the third, and turning it on blew the deck spread from 3.0 points
// to 15.7.
//
// So these tests guard two different things. That the policy FIRES at all, and
// that it fires for a reason rather than out of habit.
import { describe, expect, it } from 'vitest';
import { chooseAction } from '@ai/ai';
import { cardValue, worstCards } from '@ai/hand';
import { createMatch, MULLIGAN_MAX } from '@engine/createMatch';
import { reduce } from '@engine/reducer';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import { makeState } from '../engine/helpers';

const DECKS = [
  ['pandava', PANDAVA_DECK],
  ['kaurava', KAURAVA_DECK],
  ['asura', ASURA_DECK],
] as const;

describe('what a card in hand is worth', () => {
  it('a warrior is worth his power, because nothing has to go right first', () => {
    const s = makeState({ playerHand: ['bhishma', 'uluka'] });
    const [bhishma, uluka] = s.hands.player;
    expect(cardValue(s, 'player', bhishma)).toBeGreaterThan(cardValue(s, 'player', uluka));
  });

  it('a weapon nobody left can fire is worth less than nothing', () => {
    // Negative rather than zero on purpose: a brick occupies a slot, and every
    // draw that could have replaced it is spent.
    const s = makeState({ playerHand: ['pashupatastra'], playerDeck: ['uluka', 'durmukha'] });
    expect(cardValue(s, 'player', s.hands.player[0])).toBeLessThan(0);
  });

  it('and the same weapon is valuable when its man is still in the deck', () => {
    // The judgement is over the whole host, hand and deck, NOT the board. An
    // earlier version asked the board, and the trade is offered at the start of
    // a round when the board has just been wiped, so every astra looked dead
    // and the AI threw away good weapons every round. Spread went 3.0 -> 8.6.
    const s = makeState({ playerHand: ['pashupatastra'], playerDeck: ['arjuna', 'durmukha'] });
    expect(cardValue(s, 'player', s.hands.player[0])).toBeGreaterThan(0);
  });

  it('a boon is dead when there is no body left to carry it', () => {
    const s = makeState({ playerHand: ['gandiva'], playerDeck: ['agneyastra'] });
    expect(cardValue(s, 'player', s.hands.player[0])).toBeLessThan(0);
  });
});

describe('what the AI throws back', () => {
  it('judges against the deck it would draw from, not a fixed number', () => {
    // A constant threshold was tried and caught nothing: at "throw anything
    // worth less than 3" a six-card opening hand qualified zero cards across
    // 240 matches, because even a footman is a 2. The comparison that matters
    // is against the card you would get back.
    const strong = makeState({
      playerHand: ['uluka'],
      playerDeck: ['bhishma', 'drona', 'karna', 'duryodhana'],
    });
    const weak = makeState({
      playerHand: ['uluka'],
      playerDeck: ['durmukha', 'shakuni', 'vinda', 'anuvinda'],
    });
    // The same card, thrown beside a strong deck and kept beside a weak one.
    expect(worstCards(strong, 'player', 1)).toHaveLength(1);
    expect(worstCards(weak, 'player', 1)).toHaveLength(0);
  });

  it('leaves a hand of good cards alone', () => {
    // An AI that trades every round out of habit is the "lottery decides
    // matches" failure the old flag was protecting against.
    const s = makeState({
      playerHand: ['bhishma', 'drona'],
      playerDeck: ['durmukha', 'uluka', 'shakuni'],
    });
    expect(worstCards(s, 'player', 2)).toEqual([]);
  });

  it('never offers more than it was asked for', () => {
    const s = makeState({
      playerHand: ['uluka', 'durmukha', 'shakuni'],
      playerDeck: ['bhishma', 'drona', 'karna', 'duryodhana'],
    });
    expect(worstCards(s, 'player', 1).length).toBeLessThanOrEqual(1);
    expect(worstCards(s, 'player', MULLIGAN_MAX).length).toBeLessThanOrEqual(MULLIGAN_MAX);
  });

  it('digs for men when the hand has none to commit', () => {
    // A hand with nothing to play cannot act at all, and no weapon or boon in
    // it can be used either, so every non-warrior is a brick in that state
    // whatever it would be worth in a normal hand.
    const s = makeState({
      playerHand: ['agneyastra', 'gandiva'],
      playerDeck: ['arjuna', 'bhima', 'nakula', 'sahadeva'],
    });
    expect(worstCards(s, 'player', 2).length).toBeGreaterThan(0);
  });
});

describe('the AI takes its mulligan', () => {
  it.each(DECKS.map((d) => [d[0], d[1]]))(
    '%s answers the opening mulligan instead of standing there',
    (_name, deck) => {
      const s = createMatch(4242, deck, KAURAVA_DECK);
      expect(s.phase).toBe('mulligan');
      const move = chooseAction(s, s.activeSeat);
      expect(move.type).toBe('MULLIGAN');
    },
  );

  it('and answers for whichever seat still owes one', () => {
    // The phase does not advance until both seats are done, and the usual sim
    // loop only ever calls chooseAction for state.activeSeat. Answering only
    // for that seat would hang the match in the opening phase forever.
    let s = createMatch(4242, PANDAVA_DECK, KAURAVA_DECK);
    for (let i = 0; i < 4 && s.phase === 'mulligan'; i++) s = reduce(s, chooseAction(s, s.activeSeat));
    expect(s.phase, 'the mulligan phase never resolved').not.toBe('mulligan');
    expect(s.mulliganDone.player && s.mulliganDone.ai).toBe(true);
  });

  it('every house actually uses it, which is the whole reason the trade was off', () => {
    // The old rule fired 0 times for Pandava and 19 for Kaurava. Evenness is
    // the property, not the raw count.
    for (const [name, deck] of DECKS) {
      let thrown = 0;
      for (let g = 0; g < 40; g++) {
        const s = createMatch(g * 7919 + 13, deck, KAURAVA_DECK);
        const move = chooseAction(s, 'player');
        if (move.type === 'MULLIGAN') thrown += move.iids.length;
      }
      expect(thrown, `${name} never throws anything back`).toBeGreaterThan(0);
    }
  });
});
