// The scoreboard must not claim rounds that were never played.
//
// A drawn round awards a round win to BOTH seats, so the pip totals can add up
// to more than the number of rounds fought: a two-round battle can finish 2-2,
// which is four filled pips for two rounds, in a game that stops at three. That
// is exactly how it was reported from play ("it went to 4 once and ended 2-2").
// Measured over 1500 battles: 68 finished with more pips than rounds, 3 of them
// showing 2-2 after only two rounds.
//
// A drawn round now shows hollow on both boards, so the two together read as
// the one round they actually were.
import { describe, expect, it } from 'vitest';
import { pipClasses } from '@ui/match/MatchView';

const kinds = (n: number, drawn: number) =>
  pipClasses(n, drawn).map((c) =>
    c.includes('pip--won') ? 'won' : c.includes('pip--drawn') ? 'drawn' : 'empty',
  );

describe('round pips', () => {
  it('a clean sweep is two filled pips', () => {
    expect(kinds(2, 0)).toEqual(['won', 'won']);
  });

  it('nothing won yet is two empty pips', () => {
    expect(kinds(0, 0)).toEqual(['empty', 'empty']);
  });

  it('one round won outright fills exactly one', () => {
    expect(kinds(1, 0)).toEqual(['won', 'empty']);
  });

  it('a single drawn round shows hollow, not filled', () => {
    // This is the case that made two boards look like two rounds.
    expect(kinds(1, 1)).toEqual(['drawn', 'empty']);
  });

  it('won one and drew one shows one of each', () => {
    expect(kinds(2, 1)).toEqual(['won', 'drawn']);
  });

  it('the 2-2 stalemate is two hollow pips a side, never four filled', () => {
    expect(kinds(2, 2)).toEqual(['drawn', 'drawn']);
  });

  it('never renders more than the two pips a battle can produce', () => {
    for (let n = 0; n <= 4; n++) {
      for (let d = 0; d <= n; d++) expect(pipClasses(n, d)).toHaveLength(2);
    }
  });
});
