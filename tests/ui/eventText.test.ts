// The battle log has to say what happened.
//
// Sixteen event types fell through to the default case and rendered nothing.
// The engine was raising them and the feed was dropping them, so a player
// watched curses land, weapons clash, warriors be barred from the field and
// abilities fire, with no line explaining any of it. Same failure mode as the
// rules panel: an unhandled case returns null, null is filtered out, and
// nothing anywhere says so.
import { describe, expect, it } from 'vitest';
import { eventText } from '@ui/match/eventText';
import { makeState } from '../engine/helpers';
import type { GameEvent } from '@engine/types';

/** Every event kind the engine declares, taken from the union in types.ts. */
const SAMPLES: GameEvent[] = [
  { t: 'ability', iid: 'x', cardId: 'arjuna', name: 'Arrow Rain', left: 0 },
  { t: 'armour', iid: 'x', cardId: 'karna', amount: 4 },
  { t: 'afflict', seat: 'player', curse: 'c', name: 'A curse', text: 'It bites.' },
  { t: 'clash', astra: 'brahmastra', against: 'brahmashirsha', blast: 5, unwithdrawn: null },
  { t: 'cleanse', seat: 'player', cleared: 2 },
  { t: 'denied', seat: 'player', cardId: 'bhima' },
  { t: 'draw', seat: 'player', cardId: 'bhima' },
  { t: 'burn', seat: 'player', cardIds: ['bhima'] },
  { t: 'hazard', kind: 'narayana', seat: 'ai' },
  { t: 'mulligan', seat: 'player', count: 2 },
  { t: 'suspended', cardId: 'brahmastra' },
  { t: 'unanswered', astra: 'brahmastra', seat: 'ai' },
  { t: 'battleEnd', winner: 'player', reason: 'rounds' },
];

describe('every event the player should see has words', () => {
  it.each(SAMPLES.map((e) => [e.t, e]))('%s renders a line', (_t, ev) => {
    const s = makeState({});
    const line = eventText(s, ev as GameEvent);
    expect(line, `${(ev as GameEvent).t} renders nothing`).toBeTruthy();
    expect(String(line).trim().length).toBeGreaterThan(0);
  });

  it('names the ability that fired, which is the whole point of the feed', () => {
    const s = makeState({});
    expect(eventText(s, { t: 'ability', iid: 'x', cardId: 'ravana', name: 'Arrow Rain', left: 0 }))
      .toMatch(/Ravana.*Arrow Rain/);
  });

  it('never names a card in the enemy hand', () => {
    // 'denied' marks a specific card in a hand. Naming the enemy's would leak
    // hidden information straight into the feed.
    const s = makeState({});
    const line = eventText(s, { t: 'denied', seat: 'ai', cardId: 'bhishma' });
    expect(line).not.toMatch(/Bhishma/);
  });

  it('and does not name the enemy’s draws either', () => {
    const s = makeState({});
    expect(eventText(s, { t: 'draw', seat: 'ai', cardId: 'bhishma' })).toBeNull();
  });
});
