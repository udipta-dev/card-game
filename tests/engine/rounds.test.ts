import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { firstOf, makeState } from './helpers';
import { MAX_ROUNDS } from '@engine/queries';
import { ROUND_DRAW } from '@engine/createMatch';
import type { CardId, Seat } from '@engine/types';

describe('round loop — vanilla', () => {
  it('higher board power wins the round; battle continues to round 2', () => {
    const s0 = makeState({ playerHand: ['nakula'], aiHand: ['kaurava_infantry'] });
    // player plays a 6, ai plays a 2, both pass.
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'nakula').iid, row: 'ratha' });
    expect(s1.activeSeat).toBe('ai');
    const s2 = reduce(s1, { type: 'PLAY_CARD', iid: firstOf(s1, 'ai', 'kaurava_infantry').iid, row: 'padati' });
    const s3 = reduce(s2, { type: 'PASS', seat: 'player' });
    const s4 = reduce(s3, { type: 'PASS', seat: 'ai' });
    expect(s4.roundWins.player).toBe(1);
    expect(s4.roundWins.ai).toBe(0);
    expect(s4.phase).toBe('playing');
    expect(s4.round).toBe(2);
  });

  it('the round winner leads the next round (rubber-band)', () => {
    const s0 = makeState({ playerHand: ['nakula'], aiHand: ['kaurava_infantry'] });
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'nakula').iid, row: 'ratha' });
    const s2 = reduce(s1, { type: 'PLAY_CARD', iid: firstOf(s1, 'ai', 'kaurava_infantry').iid, row: 'padati' });
    const s3 = reduce(s2, { type: 'PASS', seat: 'player' });
    const s4 = reduce(s3, { type: 'PASS', seat: 'ai' });
    // player won round 1, so player leads round 2 and ai gets last say.
    expect(s4.activeSeat).toBe('player');
  });

  it('a dry pass concedes the round but banks the hand', () => {
    const s0 = makeState({ playerHand: ['arjuna'], aiHand: ['kaurava_infantry'] });
    // player passes immediately, banking Arjuna; ai commits a 2 and the round.
    const s1 = reduce(s0, { type: 'PASS', seat: 'player' });
    const s2 = reduce(s1, { type: 'PLAY_CARD', iid: firstOf(s1, 'ai', 'kaurava_infantry').iid, row: 'padati' });
    const s3 = reduce(s2, { type: 'PASS', seat: 'ai' });
    expect(s3.roundWins.ai).toBe(1);
    // Arjuna is still in hand for the next round.
    expect(s3.hands.player.some((iid) => s3.instances[iid].cardId === 'arjuna')).toBe(true);
  });
});

describe('reinforcements before the last day', () => {
  // The seat that opens the war wins 41.4% of matches, a swing decided before a
  // card is played. It is paid one card, and only in the case the deficit is
  // actually made of. See REINFORCE_OPENER for the eleven payments measured.
  //
  // Driven through PASS rather than by calling endRound, because the rule has to
  // hold on the path the game actually takes, and because the states it fires in
  // are not ones you can simply assign: a decider is only ever reached at one
  // win each (two ends the match, and a tied round pays both seats), so round
  // two has to be genuinely won by the side that was behind.
  const intoDecider = (opts: { firstMover: Seat; dayOneWinner: Seat }) => {
    // Round two, with the day-one loser about to level it by holding the field.
    const leveller = opts.dayOneWinner === 'player' ? 'ai' : 'player';
    const s = makeState({
      round: 2,
      playerHand: Array(8).fill('nakula'),
      aiHand: Array(8).fill('kaurava_infantry'),
      ...(leveller === 'player'
        ? { playerBoard: { ratha: ['nakula'] as CardId[] } }
        : { aiBoard: { padati: ['kaurava_infantry'] as CardId[] } }),
    });
    s.firstMover = opts.firstMover;
    s.roundWins = { player: 0, ai: 0 };
    s.roundWins[opts.dayOneWinner] = 1;
    s.decks = { player: [...s.hands.player], ai: [...s.hands.ai] };
    s.hands = { player: [], ai: [] };
    s.log.push({
      t: 'roundEnd',
      round: 1,
      scores: { player: 0, ai: 0 },
      winner: opts.dayOneWinner,
    });
    const after = reduce(reduce(s, { type: 'PASS', seat: 'player' }), { type: 'PASS', seat: 'ai' });
    // Guard the fixture itself: if this is not a live decider the assertions
    // below would pass for the wrong reason.
    expect(after.round).toBe(MAX_ROUNDS);
    expect(after.roundWins.player).toBe(after.roundWins.ai);
    return after;
  };

  it('pays the opener when he lost the very day he opened', () => {
    const s = intoDecider({ firstMover: 'player', dayOneWinner: 'ai' });
    expect(s.hands.player.length).toBe(ROUND_DRAW + 1);
    expect(s.hands.ai.length).toBe(ROUND_DRAW);
  });

  it('pays nothing when the opener won the day he opened', () => {
    // The difference between this case and the one above is the whole fix:
    // paying every level decider measured 55.5%, which is not a fix, it is the
    // same coin flip the other way up. Paying only this case measured 48.5%.
    const s = intoDecider({ firstMover: 'player', dayOneWinner: 'player' });
    expect(s.hands.player.length).toBe(ROUND_DRAW);
    expect(s.hands.ai.length).toBe(ROUND_DRAW);
  });

  it('pays the seat that actually opened, whichever it is', () => {
    const s = intoDecider({ firstMover: 'ai', dayOneWinner: 'player' });
    expect(s.hands.ai.length).toBe(ROUND_DRAW + 1);
    expect(s.hands.player.length).toBe(ROUND_DRAW);
  });

  it('pays nothing before the decider', () => {
    const s = makeState({
      round: 1,
      playerHand: Array(8).fill('nakula'),
      aiHand: Array(8).fill('kaurava_infantry'),
      playerBoard: { ratha: ['nakula'] as CardId[] },
    });
    s.firstMover = 'player';
    s.decks = { player: [...s.hands.player], ai: [...s.hands.ai] };
    s.hands = { player: [], ai: [] };
    const after = reduce(reduce(s, { type: 'PASS', seat: 'player' }), { type: 'PASS', seat: 'ai' });
    expect(after.round).toBe(2);
    expect(after.hands.player.length).toBe(ROUND_DRAW);
    expect(after.hands.ai.length).toBe(ROUND_DRAW);
  });
});
