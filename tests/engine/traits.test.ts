import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { firstOf, makeState } from './helpers';

describe('Shalya, the poison tongue', () => {
  it('saps a friendly Karna when fielded', () => {
    const s0 = makeState({ playerBoard: { ratha: ['karna'] }, playerHand: ['shalya'] });
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'shalya').iid, row: 'ratha' });
    expect(firstOf(s1, 'player', 'karna').currentPower).toBe(7); // 10 - 3
  });
});

describe('Dhrishtadyumna, born to slay Drona', () => {
  it('cannot fell an armed Drona', () => {
    const s0 = makeState({ playerHand: ['dhrishtadyumna'], aiBoard: { ratha: ['drona'] } });
    const drona = firstOf(s0, 'ai', 'drona');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'dhrishtadyumna').iid, row: 'ratha' });
    expect(s1.instances[drona.iid]).toBeDefined(); // immune while armed
  });

  it('slays a disarmed Drona', () => {
    const s0 = makeState({
      playerHand: ['ashwatthama_elephant', 'dhrishtadyumna'],
      aiBoard: { ratha: ['drona'] },
      passed: { ai: true },
    });
    const drona = firstOf(s0, 'ai', 'drona');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'ashwatthama_elephant').iid, row: 'ratha' });
    const s2 = reduce(s1, { type: 'PLAY_CARD', iid: firstOf(s1, 'player', 'dhrishtadyumna').iid, row: 'ratha' });
    expect(s2.instances[drona.iid]).toBeUndefined(); // the vow is fulfilled
  });
});

describe('Sahadeva, sworn to Shakuni', () => {
  it('cuts down the dice-master on sight', () => {
    const s0 = makeState({ playerHand: ['sahadeva'], aiBoard: { padati: ['shakuni'] } });
    const shakuni = firstOf(s0, 'ai', 'shakuni');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'sahadeva').iid, row: 'ratha' });
    expect(s1.instances[shakuni.iid]).toBeUndefined();
  });
});
