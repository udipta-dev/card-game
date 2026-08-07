import { describe, expect, it } from 'vitest';
import { reduce } from '@engine/reducer';
import { seatPower } from '@engine/queries';
import type { GameState } from '@engine/types';
import { attachBoon, firstOf, hasEvent, makeState } from './helpers';

const preventReasons = (s: GameState) =>
  s.log.filter((e) => e.t === 'preventDestroy').map((e) => (e.t === 'preventDestroy' ? e.reason : ''));

describe('Bhishma — icchamrityu', () => {
  // These used Nagastra as a convenient destroy. It binds rather than kills
  // now, so they use Vasavi Shakti, which really does destroy the highest.
  it('survives removal while Shikhandi is absent', () => {
    const s0 = makeState({
      playerHand: ['vasavi_shakti'],
      playerBoard: { padati: ['karna'] }, // Karna is the one who may loose it
      aiBoard: { ratha: ['bhishma'] },
    });
    const bhishma = firstOf(s0, 'ai', 'bhishma');
    const shakti = firstOf(s0, 'player', 'vasavi_shakti');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: shakti.iid, row: 'ratha' });
    expect(s1.instances[bhishma.iid]).toBeDefined();
    expect(preventReasons(s1)).toContain('icchamrityu');
  });

  it('dies once Shikhandi stands on the board', () => {
    const s0 = makeState({
      playerHand: ['vasavi_shakti'],
      playerBoard: { ratha: ['shikhandi', 'karna'] },
      aiBoard: { ratha: ['bhishma'] },
    });
    const bhishma = firstOf(s0, 'ai', 'bhishma');
    const shakti = firstOf(s0, 'player', 'vasavi_shakti');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: shakti.iid, row: 'ratha' });
    expect(s1.instances[bhishma.iid]).toBeUndefined();
    expect(hasEvent(s1, (e) => e.t === 'destroy' && e.cardId === 'bhishma')).toBe(true);
  });

  it('can be worn down to a third, but never past it', () => {
    // The other half of unkillable: he must not become a 0-power ornament, and
    // he must not be reducible to a 1-power one either, or the answer card that
    // takes the remaining half is worth nothing.
    const s0 = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] },
      aiBoard: { ratha: ['bhishma'] },
    });
    const bhishma = firstOf(s0, 'ai', 'bhishma');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'nagastra').iid, row: 'ratha' });
    // The Naga weapon binds him down to 1 on paper; the floor holds him at 3.
    expect(s1.instances[bhishma.iid].currentPower).toBe(3);
  });
});

describe('Nagastra — binds, and Krishna redirects', () => {
  it('reduces the mightiest foe to 1 rather than killing him', () => {
    const s0 = makeState({
      playerHand: ['nagastra'],
      playerBoard: { padati: ['karna'] },
      aiBoard: { ratha: ['arjuna'] },
    });
    const arjuna = firstOf(s0, 'ai', 'arjuna');
    expect(s0.instances[arjuna.iid].currentPower).toBeGreaterThan(1);
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'nagastra').iid, row: 'ratha' });
    // It was loosed at his head; Krishna gave it his crown instead.
    expect(s1.instances[arjuna.iid]).toBeDefined();
    expect(s1.instances[arjuna.iid].currentPower).toBe(1);
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

describe('Brahmastra takes the whole enemy host', () => {
  it('strikes every enemy standing, in every rank, not one line', () => {
    // It used to hit one line, and the UI silently chose that line for the
    // human. It now takes the whole host, so there is nothing to aim.
    const s0 = makeState({
      playerHand: ['brahmastra'],
      playerBoard: { gaja: ['bhima'], padati: ['dhrishtadyumna'] },
      aiBoard: { ratha: ['arjuna', 'kaurava_infantry'] },
    });
    const arjuna = firstOf(s0, 'ai', 'arjuna');
    // Dhrishtadyumna (8), NOT Bhima (9). Firing a tier-2 weapon also earns an
    // adharma curse, and every curse in that pool bites your MIGHTIEST warrior,
    // so asserting on him would be measuring the curse as well as the blast.
    const dd = firstOf(s0, 'player', 'dhrishtadyumna');
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'brahmastra').iid, row: 'ratha' });

    // Every enemy, in every rank: 10 - 5.
    expect(s1.instances[arjuna.iid].currentPower).toBe(5);
    // Your own men take no blast. They take the SICKNESS afterwards instead: a
    // quarter of 8, rounded up, is 2.
    //
    // Symmetric damage was tried and measured 24.8% win / 12.4% played, near
    // unplayable, because hitting both sides equally and then paying a
    // one-sided penalty on top is strictly worse than not firing at all. The
    // blast falls on them; the sickness falls on you.
    expect(s1.instances[dd.iid].currentPower).toBe(6);
  });

  it('and your own host sickens afterwards, in proportion', () => {
    // Proportional, not flat: a flat number is a scratch on a maharathi and
    // ruin on a levy, and the aftermath is not supposed to discriminate.
    const s0 = makeState({
      playerHand: ['brahmastra'],
      playerBoard: { gaja: ['bhima'], padati: ['dhrishtadyumna'] },
      aiBoard: { ratha: ['arjuna'] },
    });
    const dd = firstOf(s0, 'player', 'dhrishtadyumna');
    const printed = s0.instances[dd.iid].currentPower;
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'brahmastra').iid, row: 'ratha' });
    // Again the non-mightiest man, so the adharma curse is not in the sum.
    // Proportional, so it costs the great and the small alike in proportion.
    expect(s1.instances[dd.iid].currentPower).toBe(printed - Math.ceil(printed * 0.25));
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

  it('loses his armour, not his strength, in the decider', () => {
    // WAS: collapses to 0. Deliberately changed. Zeroing him made the best card
    // in the Kaurava deck one you must not play in the round that decides the
    // battle, and the card never said so, so it read as a trap rather than a
    // choice: he measured 44.1% with the lowest play rate of any warrior there.
    // He was not made weak when the earth took his wheel, he was made helpless.
    // See tests/engine/karna.test.ts for the full behaviour.
    const s0 = makeState({ round: 3, playerHand: ['karna'] });
    const s1 = reduce(s0, { type: 'PLAY_CARD', iid: firstOf(s0, 'player', 'karna').iid, row: 'ratha' });
    const karna = firstOf(s1, 'player', 'karna');
    expect(karna.currentPower, 'still the strongest man on the field').toBe(10);
    expect(karna.counters.armor ?? 0, 'but the Kavacha is gone').toBe(0);
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
    // Deliberately 4, not 0: the deception takes his guard and most of his
    // fight, and Dhrishtadyumna still has to arrive. Zeroing him punished a
    // 9 twice over off one 4-cost stratagem.
    expect(dronaAfter.currentPower).toBe(4);
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
