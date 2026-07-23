import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { seatPower } from '@engine/queries';
import type { GameState } from '@engine/types';
import { attachBoon, firstOf, hasEvent, makeState } from './helpers';

const preventReasons = (s: GameState) =>
  s.log.filter((e) => e.t === 'preventDestroy').map((e) => (e.t === 'preventDestroy' ? e.reason : ''));

describe('Bhishma — icchamrityu', () => {
  it('survives removal while Shikhandi is absent', () => {
    const s0 = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] }, // Karna lets the player invoke Nagastra
      aiBoard: { ratha: ['bhishma'] },
    });
    const bhishma = firstOf(s0, 'ai', 'bhishma');
    const nagastra = firstOf(s0, 'player', 'nagastra');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: nagastra.iid, row: 'ratha' });
    expect(s1.instances[bhishma.iid]).toBeDefined();
    expect(preventReasons(s1)).toContain('icchamrityu');
  });

  it('dies once Shikhandi stands on the board', () => {
    const s0 = makeState({
      playerHand: ['nagastra'],
      playerBoard: { ratha: ['shikhandi', 'karna'] }, // Karna invokes, Shikhandi unlocks Bhishma
      aiBoard: { ratha: ['bhishma'] },
    });
    const bhishma = firstOf(s0, 'ai', 'bhishma');
    const nagastra = firstOf(s0, 'player', 'nagastra');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: nagastra.iid, row: 'ratha' });
    expect(s1.instances[bhishma.iid]).toBeUndefined();
    expect(hasEvent(s1, (e) => e.t === 'destroy' && e.cardId === 'bhishma')).toBe(true);
  });
});

describe('Nagastra — Krishna redirect', () => {
  it('destroys the highest enemy unit', () => {
    const s0 = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] },
      aiBoard: { ratha: ['arjuna'] },
    });
    const arjuna = firstOf(s0, 'ai', 'arjuna');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'nagastra').iid, row: 'ratha' });
    expect(s1.instances[arjuna.iid]).toBeUndefined();
  });

  it('fizzles against a Krishna-guarded unit', () => {
    const s0 = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] },
      aiBoard: { ratha: ['arjuna'] },
    });
    const arjuna = firstOf(s0, 'ai', 'arjuna');
    attachBoon(s0, arjuna.iid, 'krishna_charioteer');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'nagastra').iid, row: 'ratha' });
    expect(s1.instances[arjuna.iid]).toBeDefined();
    expect(hasEvent(s1, (e) => e.t === 'redirected' && e.source === 'nagastra')).toBe(true);
  });
});

describe('Brahmastra — row devastation + collateral', () => {
  it('damages the struck enemy row, scorches it, and singes own adjacent row', () => {
    const s0 = makeState({
      playerHand: ['brahmastra'],
      // gaja is adjacent to ratha -> collateral. Dhrishtadyumna invokes Brahmastra.
      playerBoard: { gaja: ['bhima'], padati: ['dhrishtadyumna'] },
      aiBoard: { ratha: ['arjuna', 'kaurava_infantry'] },
    });
    const arjuna = firstOf(s0, 'ai', 'arjuna');
    const bhima = firstOf(s0, 'player', 'bhima');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'brahmastra').iid, row: 'ratha' });
    // Enemy ratha units took 6 damage.
    expect(s1.instances[arjuna.iid].currentPower).toBe(4); // 10 - 6
    // Lingering scorch on enemy ratha (-3 row mod).
    expect(s1.rowMods.some((m) => m.seat === 'ai' && m.row === 'ratha' && m.amount === -3)).toBe(true);
    // Own adjacent gaja unit took 2 collateral.
    expect(s1.instances[bhima.iid].currentPower).toBe(7); // 9 - 2
  });
});

describe('Pashupatastra — instant win + self-ban', () => {
  it('ends the battle and bans itself for the run', () => {
    const s0 = makeState({ playerHand: ['pashupatastra'], playerBoard: { ratha: ['arjuna'] } });
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'pashupatastra').iid, row: 'ratha' });
    expect(s1.phase).toBe('battleEnd');
    expect(s1.winner).toBe('player');
    expect(s1.bannedThisRun).toContain('pashupatastra');
  });
});

describe('Karna — chariot-wheel curse in the final round', () => {
  it('keeps full power when deployed early', () => {
    const s0 = makeState({ round: 1, playerHand: ['karna'] });
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'karna').iid, row: 'ratha' });
    expect(firstOf(s1, 'player', 'karna').currentPower).toBe(10);
  });

  it('collapses to 0 power when deployed in the decider', () => {
    const s0 = makeState({ round: 3, playerHand: ['karna'] });
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'karna').iid, row: 'ratha' });
    const karna = firstOf(s1, 'player', 'karna');
    expect(karna.currentPower).toBe(0);
    expect(karna.flags.has('wheel-sunk')).toBe(true);
  });
});

describe('Drona — disarmed only by the elephant deception', () => {
  it('is immune to Vaishnavastra until "Ashwatthama is dead" is played', () => {
    // ai passed so the player keeps the turn across multiple plays.
    const s0 = makeState({
      playerHand: ['vaishnavastra', 'ashwatthama_elephant'],
      playerBoard: { padati: ['bhagadatta'] }, // Bhagadatta invokes Vaishnavastra
      aiBoard: { ratha: ['drona'] },
      passed: { ai: true },
    });
    const drona = firstOf(s0, 'ai', 'drona');
    const vaish = firstOf(s0, 'player', 'vaishnavastra');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: vaish.iid, row: 'ratha', targets: [drona.iid] });
    expect(s1.instances[drona.iid]).toBeDefined(); // immune
    expect(preventReasons(s1)).toContain('immuneUntilPlayed');

    const elephant = firstOf(s1, 'player', 'ashwatthama_elephant');
    const s2 = reduce(s1, { type: 'PLAY_CARD', iid: elephant.iid, row: 'ratha' });
    const dronaAfter = firstOf(s2, 'ai', 'drona');
    expect(dronaAfter.currentPower).toBe(0); // disarmed
    expect(dronaAfter.flags.has('disarmed')).toBe(true);
  });
});

describe('Duryodhana — diamond body answered only by Bhima', () => {
  it('is immune to Vaishnavastra but falls to Bhima’s thigh-strike', () => {
    const s0 = makeState({
      playerHand: ['vaishnavastra', 'bhima'],
      playerBoard: { padati: ['bhagadatta'] }, // Bhagadatta invokes Vaishnavastra
      aiBoard: { ratha: ['duryodhana'] },
      passed: { ai: true },
    });
    const dury = firstOf(s0, 'ai', 'duryodhana');
    expect(dury.flags.has('diamond-body')).toBe(true);
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'vaishnavastra').iid, row: 'ratha', targets: [dury.iid] });
    expect(s1.instances[dury.iid]).toBeDefined(); // diamond body holds
    expect(preventReasons(s1)).toContain('diamond-body');

    const s2 = reduce(s1, { type: 'PLAY_CARD', iid: firstOf(s1, 'player', 'bhima').iid, row: 'ratha', targets: [dury.iid] });
    expect(s2.instances[dury.iid]).toBeUndefined(); // vow fulfilled
  });
});

describe('Abhimanyu — sealed in the Chakravyuha by Jayadratha', () => {
  it('dies at round end when Jayadratha holds the enemy board, losing the round', () => {
    const s0 = makeState({
      playerBoard: { ratha: ['abhimanyu'] }, // 8 power, would win
      aiBoard: { ratha: ['jayadratha'] }, // 6 power
      passed: { player: true },
      activeSeat: 'ai',
    });
    // Player already passed; AI passes -> round resolves.
    const s1 = reduce(s0, { type: 'PASS', seat: 'ai' });
    expect(hasEvent(s1, (e) => e.t === 'destroy' && e.cardId === 'abhimanyu')).toBe(true);
    // Abhimanyu (8) died before scoring, so the Kaurava 6 takes the round.
    expect(s1.roundWins.ai).toBe(1);
    expect(s1.roundWins.player).toBe(0);
  });

  it('survives when Jayadratha is absent', () => {
    const s0 = makeState({
      playerBoard: { ratha: ['abhimanyu'] },
      aiBoard: { ratha: ['dushasana'] },
      passed: { player: true },
      activeSeat: 'ai',
    });
    const abhi = firstOf(s0, 'player', 'abhimanyu');
    const s1 = reduce(s0, { type: 'PASS', seat: 'ai' });
    // Board clears after the round; assert via the round result instead.
    expect(s1.roundWins.player).toBe(1); // 8 > 6, no trap
    void abhi;
  });
});

describe('seatPower + row mods', () => {
  it('floors a heavily scorched row at zero', () => {
    const s = makeState({ playerBoard: { ratha: ['pandava_infantry'] } });
    s.rowMods.push({ seat: 'player', row: 'ratha', amount: -10, duration: 'lingering', source: 'x' });
    expect(seatPower(s, 'player')).toBe(0);
  });
});
