// The price of a divine weapon falls on the man who spoke the mantra.
//
// Every other adharma curse scours the whole host: rows withered, every warrior
// weakened, the mightiest man's bowstring cut. That reads as the game punishing
// you for using the content it gave you, and it is not what the epic describes
// either. A divyastra costs its INVOKER. The mantra is spent, and he cannot call
// another.
import { describe, expect, it } from 'vitest';
import { afflict } from '@engine/curses';
import { canInvokeAstra } from '@engine/queries';
import { firstOf, makeState } from './helpers';

describe('the invoker pays, not the army', () => {
  it('takes a quarter off the man who could have fired it', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'], padati: ['pandava_infantry'] } });
    const before = firstOf(s, 'player', 'arjuna').currentPower;
    afflict(s, 'player', ['invokers_price'], 'brahmastra');
    // A quarter of ten, so three off a man of ten. Proportional on purpose: it
    // costs a maharathi more than a footman and can never take one to nothing.
    expect(firstOf(s, 'player', 'arjuna').currentPower).toBe(before - 3);
  });

  it('leaves the rest of the host alone, which is the whole point', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'], padati: ['pandava_infantry'] } });
    const footman = firstOf(s, 'player', 'pandava_infantry').currentPower;
    afflict(s, 'player', ['invokers_price'], 'brahmastra');
    expect(firstOf(s, 'player', 'pandava_infantry').currentPower).toBe(footman);
    expect(s.rowMods.filter((m) => m.source === 'adharma')).toEqual([]);
  });

  it('and he calls no other weapon', () => {
    // Without the check in canInvokeAstra this curse would print a sentence and
    // change nothing at all.
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    expect(canInvokeAstra(s, 'player', 'agneyastra')).toBe(true);
    afflict(s, 'player', ['invokers_price'], 'brahmastra');
    expect(canInvokeAstra(s, 'player', 'agneyastra')).toBe(false);
  });

  it('falls on the named bearer ahead of the deepest-trained man', () => {
    // For an ultimate the bearer is the only one who could have loosed it, so he
    // is the one who pays even with a higher-mastery warrior beside him.
    const s = makeState({ playerBoard: { gaja: ['bhagadatta'], ratha: ['arjuna'] } });
    const arjuna = firstOf(s, 'player', 'arjuna').currentPower;
    afflict(s, 'player', ['invokers_price'], 'vaishnavastra');
    expect(firstOf(s, 'player', 'arjuna').currentPower, 'Arjuna should not pay').toBe(arjuna);
    expect(firstOf(s, 'player', 'bhagadatta').flags.has('mantra-spent')).toBe(true);
  });

  it('never takes a man to nothing', () => {
    const s = makeState({ playerBoard: { padati: ['pandava_infantry'] } });
    afflict(s, 'player', ['invokers_price'], 'agneyastra');
    expect(firstOf(s, 'player', 'pandava_infantry').currentPower).toBeGreaterThan(0);
  });
});
