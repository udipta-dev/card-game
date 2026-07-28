// The price of the great weapons. These are the rules that make an astra feel
// like an astra rather than a big damage card: it fires once, it costs you
// something, and the worst of them take your own host with them.
import { describe, expect, it } from 'vitest';
import { reduce, isLegalAbility, isLegalPlay } from '@engine/reducer';
import { canInvokeAstra, unitsOf } from '@engine/queries';
import { legalMoves } from '@engine/selectors';
import { hasEvent, makeState } from './helpers';

describe('a great astra fires only once', () => {
  it('bans itself for the run and is then unplayable', () => {
    const s = makeState({
      playerHand: ['brahmastra', 'brahmastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { gaja: ['dushasana'] },
    });
    const first = s.hands.player[0];
    const second = s.hands.player[1];
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: first, row: 'gaja' });

    expect(s1.bannedThisRun).toContain('brahmastra');
    // The second copy is now dead in hand: the arsenal is empty.
    expect(isLegalPlay(s1, 'player', second, 'gaja')).toBe(false);
  });

  it('leaves elemental astras alone, they are common enough to carry', () => {
    const s = makeState({
      playerHand: ['agneyastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { gaja: ['dushasana'] },
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'gaja' });
    expect(s1.bannedThisRun).not.toContain('agneyastra');
  });
});

describe('Brahmastra is an act of adharma', () => {
  it('curses the one who looses it, not the one it strikes', () => {
    const s = makeState({
      playerHand: ['brahmastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { gaja: ['dushasana'] },
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'gaja' });
    expect(s1.curses.player.length).toBe(1);
    expect(s1.curses.ai.length).toBe(0);
    expect(hasEvent(s1, (e) => e.t === 'afflict' && e.seat === 'player')).toBe(true);
  });
});

describe('Brahmashirsha is utter destruction', () => {
  it('takes the enemy host entire, and poisons the ground you keep', () => {
    const s = makeState({
      playerHand: ['brahmashirsha'],
      playerBoard: { ratha: ['arjuna'], gaja: ['bhima'] },
      aiBoard: { ratha: ['dushasana'], gaja: ['jayadratha'] },
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    // The enemy host is gone.
    expect(unitsOf(s1, 'ai').length).toBe(0);
    // WAS: our own host died too. That was a symmetric wipe, which destroys
    // cards already played and so changes nobody's hand size: it cost a card
    // to reset the board to nothing, and measured a 17.2% win rate, the worst
    // in the game. The price is now paid AFTERWARDS instead.
    expect(unitsOf(s1, 'player').length).toBeGreaterThan(0);
    // Every one of our lines withers for the rest of the battle...
    const withered = s1.rowMods.filter((m) => m.seat === 'player' && m.amount < 0);
    expect(withered.length).toBe(3); // all three of our own lines
    expect(withered.every((m) => m.duration === 'lingering')).toBe(true);
    // ...and the firer still wears the curse.
    expect(s1.curses.player.length).toBe(1);
  });

  it('the deathless walk out of it, as they did the Sauptika night', () => {
    const s = makeState({
      playerHand: ['brahmashirsha'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['ashwatthama'], gaja: ['dushasana'] },
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    const survivors = unitsOf(s1, 'ai').map((u) => u.cardId);
    expect(survivors).toContain('ashwatthama'); // chiranjivi
    expect(survivors).not.toContain('dushasana');
  });
});

describe('Pashupatastra wins, but at a price', () => {
  it('ends the battle and tears warriors out of your own deck forever', () => {
    const s = makeState({
      playerHand: ['pashupatastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['dushasana'] },
      playerDeck: ['bhima', 'nakula', 'sahadeva', 'satyaki', 'drupada', 'virata'],
    });
    const deckBefore = s.decks.player.length;
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    expect(s1.winner).toBe('player');
    expect(s1.phase).toBe('battleEnd');
    // Five warriors are gone from the deck, and gone for the run.
    expect(s1.decks.player.length).toBe(deckBefore - 5);
    expect(hasEvent(s1, (e) => e.t === 'burn' && e.seat === 'player')).toBe(true);
    const burn = s1.log.find((e) => e.t === 'burn');
    expect(burn && burn.t === 'burn' && burn.cardIds.length).toBe(5);
    for (const id of (burn as { cardIds: string[] }).cardIds) {
      expect(s1.bannedThisRun).toContain(id);
    }
  });
});

describe('a warrior’s skill at arms', () => {
  it('spends a charge, costs the turn, and runs dry within the battle', () => {
    const s = makeState({
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['dushasana'], gaja: ['jayadratha'] },
    });
    const arjuna = s.board.player.ratha[0];
    const dushasana = s.board.ai.ratha[0];
    const jayadratha = s.board.ai.gaja[0];
    const before = [s.instances[dushasana].currentPower, s.instances[jayadratha].currentPower];

    const s1 = reduce(s, { type: 'USE_ABILITY', iid: arjuna });
    // Arrow Rain falls on the whole enemy host, not one target.
    expect(s1.instances[dushasana].currentPower).toBe(before[0] - 2);
    expect(s1.instances[jayadratha].currentPower).toBe(before[1] - 2);
    expect(s1.instances[arjuna].counters.charges).toBe(0);
    expect(s1.activeSeat).toBe('ai'); // using a skill costs the turn
    expect(hasEvent(s1, (e) => e.t === 'ability' && e.name === 'Arrow Rain')).toBe(true);

    // Out of charges: the same warrior cannot loose it again this battle.
    const s2 = { ...s1, activeSeat: 'player' as const };
    expect(isLegalAbility(s2, 'player', arjuna)).toBe(false);
    expect(reduce(s2, { type: 'USE_ABILITY', iid: arjuna })).toBe(s2);
  });

  it('is offered to the AI and the UI through legalMoves', () => {
    const s = makeState({
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['dushasana'] },
    });
    const moves = legalMoves(s, 'player');
    expect(moves.some((m) => m.type === 'USE_ABILITY')).toBe(true);
  });
});

describe('an astra earned through tapasya is the host’s, not one man’s', () => {
  // Regression: canInvokeAstra required the GRANTED warrior on the board, which
  // turned a reward already paid for with his absence into a two-card combo out
  // of an eighteen-card deck. Measured collection was 13% at tier 1 and exactly
  // zero at tiers 2 and 3, across 147 tier-3 penances.
  it('can be loosed while the warrior who fetched it is not on the field', () => {
    const s = makeState({ playerBoard: { padati: ['pandava_infantry'] } });
    s.astraGrants.player = { bhima: ['vayavyastra'] };
    // Bhima is nowhere on the board, and a footman knows no astras at all.
    expect(canInvokeAstra(s, 'player', 'vayavyastra')).toBe(true);
  });

  it('is not loosed by a host that has been wiped from the field', () => {
    const s = makeState({});
    s.astraGrants.player = { bhima: ['vayavyastra'] };
    expect(canInvokeAstra(s, 'player', 'vayavyastra')).toBe(false);
  });

  it('grants nothing beyond the weapon actually learned', () => {
    const s = makeState({ playerBoard: { padati: ['pandava_infantry'] } });
    s.astraGrants.player = { bhima: ['vayavyastra'] };
    expect(canInvokeAstra(s, 'player', 'pashupatastra')).toBe(false);
    expect(canInvokeAstra(s, 'player', 'agneyastra')).toBe(false);
  });

  it('leaves the ordinary rules alone: no grant, no astra without a wielder', () => {
    const s = makeState({ playerBoard: { padati: ['pandava_infantry'] } });
    expect(canInvokeAstra(s, 'player', 'agneyastra')).toBe(false);
    const withMaster = makeState({ playerBoard: { ratha: ['arjuna'] } });
    expect(canInvokeAstra(withMaster, 'player', 'agneyastra')).toBe(true);
  });
});

describe('a maharathi who completes tapasya may loose what he earned', () => {
  // The whole point of the penance system: ANY warrior who goes and comes back
  // bearing an ultimate can fire it, whether or not the epic gave it to him.
  // Narayana's canonical wielder is Ashwatthama and Vaishnava's is Bhagadatta,
  // both Kauravas, so without this a Pandava host could never use either
  // however long it sat in penance.
  it('lets a Pandava host fire Narayana, whose wielder is a Kaurava', () => {
    const s = makeState({ playerBoard: { ratha: ['arjuna'] } });
    expect(canInvokeAstra(s, 'player', 'narayanastra')).toBe(false); // not his
    s.astraGrants.player = { arjuna: ['narayanastra'] };
    expect(canInvokeAstra(s, 'player', 'narayanastra')).toBe(true);
  });

  it('and Vaishnava, whose wielder is Bhagadatta', () => {
    const s = makeState({ playerBoard: { ratha: ['bhima'] } });
    expect(canInvokeAstra(s, 'player', 'vaishnavastra')).toBe(false);
    // Bhima himself went, untrained in the mantras though he is.
    s.astraGrants.player = { bhima: ['vaishnavastra'] };
    expect(canInvokeAstra(s, 'player', 'vaishnavastra')).toBe(true);
  });

  it('grants the HOST the weapon, not just the man who fetched it', () => {
    // He paid for it with his absence. Someone else may loose it.
    const s = makeState({ playerBoard: { ratha: ['yudhishthira'] } });
    s.astraGrants.player = { arjuna: ['pashupatastra'] };
    expect(canInvokeAstra(s, 'player', 'pashupatastra')).toBe(true);
  });
});

describe('a named astra arrives with its warrior', () => {
  it('Karna takes the field and the Vasavi Shakti comes to hand', () => {
    // It was hand-listed in the deck beside him, as if the two were unrelated.
    // The spear is his, traded for the armour off his own body.
    const s = makeState({ playerHand: ['karna'] });
    expect(s.hands.player.some((i) => s.instances[i]?.cardId === 'vasavi_shakti')).toBe(false);
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(s1.hands.player.some((i) => s1.instances[i]?.cardId === 'vasavi_shakti')).toBe(true);
    expect(hasEvent(s1, (e) => e.t === 'granted' && e.cardId === 'vasavi_shakti')).toBe(true);
  });

  it('a warrior with no named astra brings nothing', () => {
    const s = makeState({ playerHand: ['nakula'] });
    const before = s.hands.player.length;
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(s1.hands.player.length).toBe(before - 1); // just the card he spent
  });

  it('does not hand it back once it has been spent for the run', () => {
    const s = makeState({ playerHand: ['karna'] });
    s.bannedThisRun.push('vasavi_shakti');
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(s1.hands.player.some((i) => s1.instances[i]?.cardId === 'vasavi_shakti')).toBe(false);
  });

  it('does not duplicate one already in hand', () => {
    const s = makeState({ playerHand: ['karna', 'vasavi_shakti'] });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    const held = s1.hands.player.filter((i) => s1.instances[i]?.cardId === 'vasavi_shakti');
    expect(held.length).toBe(1);
  });
});
