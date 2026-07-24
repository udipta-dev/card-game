import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { canInvokeAstra } from '@engine/queries';
import { legalMoves } from '@engine/selectors';
import { firstOf, hasEvent, makeState } from './helpers';

const canPlay = (s: ReturnType<typeof makeState>, iid: string) =>
  legalMoves(s, 'player').some((m) => m.type === 'PLAY_CARD' && m.iid === iid);

describe('Astra invocation needs a warrior who knows it', () => {
  it('is unplayable with no knowing warrior on board', () => {
    const s = makeState({ playerHand: ['brahmastra'], aiBoard: { ratha: ['dushasana'] } });
    const brahma = firstOf(s, 'player', 'brahmastra');
    expect(canInvokeAstra(s, 'player', 'brahmastra')).toBe(false);
    expect(canPlay(s, brahma.iid)).toBe(false);
    // The reducer rejects the illegal play, returning the state untouched.
    expect(reduce(s, { type: 'PLAY_CARD', iid: brahma.iid, row: 'ratha' })).toBe(s);
  });

  it('becomes playable once its wielder is fielded', () => {
    const s = makeState({
      playerHand: ['brahmastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['dushasana'] },
    });
    expect(canInvokeAstra(s, 'player', 'brahmastra')).toBe(true);
    expect(canPlay(s, firstOf(s, 'player', 'brahmastra').iid)).toBe(true);
  });
});

describe('Astra counter-web', () => {
  it('Garudastra in the defender hand answers Nagastra', () => {
    const s = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] }, // invoker
      aiBoard: { ratha: ['arjuna'] }, // target
      aiHand: ['garudastra'], // defender's counter
    });
    const arjuna = firstOf(s, 'ai', 'arjuna');
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'nagastra').iid, row: 'ratha' });
    expect(s1.instances[arjuna.iid]).toBeDefined(); // survived
    expect(hasEvent(s1, (e) => e.t === 'countered' && e.astra === 'nagastra' && e.by === 'garudastra')).toBe(true);
    expect(s1.hands.ai.some((iid) => s1.instances[iid]?.cardId === 'garudastra')).toBe(false); // spent
  });

  it('Brahmastra answering Brahmastra scours both hosts, and only the untrained side is cursed', () => {
    const s = makeState({
      playerHand: ['brahmastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['dushasana'] },
      aiHand: ['brahmastra'],
    });
    const dushasana = firstOf(s, 'ai', 'dushasana');
    const arjuna = firstOf(s, 'player', 'arjuna');
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'brahmastra').iid, row: 'ratha' });

    expect(hasEvent(s1, (e) => e.t === 'countered' && e.astra === 'brahmastra')).toBe(true);
    // Two Brahma-line weapons meeting is not a clean cancellation: blast 2 to all.
    expect(hasEvent(s1, (e) => e.t === 'clash' && e.blast === 2 && e.unwithdrawn === 'ai')).toBe(true);
    expect(s1.instances[arjuna.iid].currentPower).toBe(arjuna.currentPower - 2);
    // Dushasana takes the blast; the AI fields no astra-master, so it could not
    // withdraw its weapon and carries the curse for it (Vyasa's intervention).
    expect(s1.instances[dushasana.iid].currentPower).toBeLessThan(6 - 2 + 1);
    expect(s1.curses.ai.length).toBe(1);
    expect(s1.curses.player.length).toBe(0);
    // Both weapons are spent for the run.
    expect(s1.bannedThisRun).toContain('brahmastra');
  });

  it('resolves normally when the defender holds no counter', () => {
    const s = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] },
      aiBoard: { ratha: ['arjuna'] },
    });
    const arjuna = firstOf(s, 'ai', 'arjuna');
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'nagastra').iid, row: 'ratha' });
    expect(s1.instances[arjuna.iid]).toBeUndefined(); // destroyed
  });
});
