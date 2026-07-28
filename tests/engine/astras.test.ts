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
  it('an astra in flight STOPS and asks the defender, it does not answer itself', () => {
    // Playtest: a player's Brahma-Astra was spent, his army scoured and his
    // host cursed, all from a card he never chose to play. Answering costs all
    // three of those, so it must never happen without consent.
    const s = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] },
      aiBoard: { ratha: ['arjuna'] },
      aiHand: ['sauparna'],
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'nagastra').iid, row: 'ratha' });
    expect(s1.phase).toBe('awaitingCounter');
    expect(s1.pendingCounter?.astraCardId).toBe('nagastra');
    expect(s1.pendingCounter?.counterCardId).toBe('sauparna');
    // The turn passes to the side being fired at, so every driver can keep
    // asking "whose move?" without knowing this phase exists.
    expect(s1.activeSeat).toBe('ai');
    // Nothing is spent and nothing has resolved yet.
    expect(s1.hands.ai.some((iid) => s1.instances[iid]?.cardId === 'sauparna')).toBe(true);
    expect(s1.bannedThisRun).not.toContain('sauparna');
  });

  it('letting it through spends only the attacker’s weapon, and it resolves', () => {
    const s = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] },
      aiBoard: { ratha: ['arjuna'] },
      aiHand: ['sauparna'],
    });
    const arjuna = firstOf(s, 'ai', 'arjuna');
    let s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'nagastra').iid, row: 'ratha' });
    s1 = reduce(s1, { type: 'ANSWER_ASTRA', seat: 'ai', counter: false });

    expect(s1.phase).toBe('playing');
    expect(hasEvent(s1, (e) => e.t === 'unanswered' && e.astra === 'nagastra')).toBe(true);
    // Nagastra binds: Arjuna is reduced to 1, not killed.
    expect(s1.instances[arjuna.iid].currentPower).toBe(1);
    // The defender KEEPS the answer he chose not to spend.
    expect(s1.hands.ai.some((iid) => s1.instances[iid]?.cardId === 'sauparna')).toBe(true);
    expect(s1.bannedThisRun).toContain('nagastra');
    expect(s1.bannedThisRun).not.toContain('sauparna');
  });

  it('Garudastra in the defender hand answers Nagastra', () => {
    const s = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] }, // invoker
      aiBoard: { ratha: ['arjuna'] }, // target
      aiHand: ['sauparna'], // defender's counter
    });
    const arjuna = firstOf(s, 'ai', 'arjuna');
    let s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'nagastra').iid, row: 'ratha' });
    s1 = reduce(s1, { type: 'ANSWER_ASTRA', seat: 'ai', counter: true });
    expect(s1.instances[arjuna.iid]).toBeDefined(); // survived
    expect(hasEvent(s1, (e) => e.t === 'countered' && e.astra === 'nagastra' && e.by === 'sauparna')).toBe(true);
    expect(s1.hands.ai.some((iid) => s1.instances[iid]?.cardId === 'sauparna')).toBe(false); // spent
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
    let s1 = reduce(s, { type: 'PLAY_CARD', iid: firstOf(s, 'player', 'brahmastra').iid, row: 'ratha' });
    s1 = reduce(s1, { type: 'ANSWER_ASTRA', seat: 'ai', counter: true });

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
    // Nagastra binds rather than kills now: the crown, not the head.
    expect(s1.instances[arjuna.iid].currentPower).toBe(1); // destroyed
  });
});
