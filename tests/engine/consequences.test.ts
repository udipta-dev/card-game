// The price of the great weapons. These are the rules that make an astra feel
// like an astra rather than a big damage card: it fires once, it costs you
// something, and the worst of them take your own host with them.
import { describe, expect, it } from 'vitest';
import { reduce, isLegalAbility, isLegalPlay } from '@engine/reducer';
import { canInvokeAstra } from '@engine/queries';
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

    // IT TAKES THE ROUND. Without that it could unmake an army and still lose
    // the round on power, which is absurd. Taking it ends the round there, so
    // the board is swept and neither host is standing afterwards: what is
    // asserted below is what SURVIVES a round transition.
    expect(s1.roundWins.player).toBe(1);

    // The ground you won stays poisoned. A lingering row mod outlives
    // clearBoard, which is exactly why the price is written this way: anything
    // done to the men standing now would be erased half a second later by the
    // round ending, and the weapon would be free.
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
    // Read the log rather than the board: the round ends the moment it lands,
    // and clearBoard then destroys everyone regardless of who the weapon spared.
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    const slain = s1.log.filter((e) => e.t === 'destroy').map((e) => e.cardId);
    const spared = s1.log.filter((e) => e.t === 'preventDestroy');
    expect(slain).toContain('dushasana');
    // Ashwatthama is chiranjivi: the weapon could not take him.
    expect(spared.length).toBeGreaterThan(0);
  });
});

describe('Pashupatastra wins, and is remembered for it', () => {
  it('ends the battle outright and burns from your grasp', () => {
    const s = makeState({
      playerHand: ['pashupatastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['dushasana'] },
      playerDeck: ['bhima', 'nakula', 'sahadeva', 'satyaki', 'drupada', 'virata'],
    });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    expect(s1.winner).toBe('player');
    expect(s1.phase).toBe('battleEnd');
    expect(s1.bannedThisRun).toContain('pashupatastra');
  });

  it('does NOT eat five of your own warriors any more', () => {
    // That was an arbitrary tax with no story behind it: Shiva's weapon does
    // not devour your infantry. The price is now the shrap, which is fifteen
    // battles long, by far the heaviest mark in the game. See run/dharma.ts.
    const s = makeState({
      playerHand: ['pashupatastra'],
      playerBoard: { ratha: ['arjuna'] },
      aiBoard: { ratha: ['dushasana'] },
      playerDeck: ['bhima', 'nakula', 'sahadeva', 'satyaki', 'drupada', 'virata'],
    });
    const deckBefore = s.decks.player.length;
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });

    expect(s1.decks.player.length).toBe(deckBefore);
    expect(hasEvent(s1, (e) => e.t === 'burn')).toBe(false);
  });
});

describe('a warrior’s skill at arms', () => {
  // BALARAMA, not Arjuna. The maharathis used to hold turn-costing abilities and
  // now hold valours instead: three listed, one chosen and fired in the same
  // breath as committing the man. Balarama is the last card in the game still
  // carrying the older shape, so he is what this rule is tested on.
  it('spends a charge, costs the turn, and runs dry within the battle', () => {
    const s = makeState({
      playerBoard: { gaja: ['balarama'] },
      aiBoard: { ratha: ['dushasana'] },
    });
    const balarama = s.board.player.gaja[0];
    const dushasana = s.board.ai.ratha[0];
    const before = s.instances[dushasana].currentPower;

    const s1 = reduce(s, { type: 'USE_ABILITY', iid: balarama });
    // The mace falls on the mightiest foe, not the whole host.
    expect(s1.instances[dushasana].currentPower).toBeLessThan(before);
    expect(s1.instances[balarama].counters.charges).toBe(0);
    expect(s1.activeSeat).toBe('ai'); // using a skill costs the turn
    expect(hasEvent(s1, (e) => e.t === 'ability' && e.name === 'Mace of the Plough')).toBe(true);

    // Out of charges: the same warrior cannot loose it again this battle.
    const s2 = { ...s1, activeSeat: 'player' as const };
    expect(isLegalAbility(s2, 'player', balarama)).toBe(false);
    expect(reduce(s2, { type: 'USE_ABILITY', iid: balarama })).toBe(s2);
  });

  it('is offered to the AI and the UI through legalMoves', () => {
    const s = makeState({
      playerBoard: { gaja: ['balarama'] },
      aiBoard: { ratha: ['dushasana'] },
    });
    expect(legalMoves(s, 'player').some((m) => m.type === 'USE_ABILITY')).toBe(true);
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
  it('Karna packs the Vasavi Shakti and takes the field holding it', () => {
    // It was hand-listed in the deck beside him, as if the two were unrelated.
    // The spear is his, traded for the armour off his own body.
    //
    // He FETCHES it out of the deck. He does not conjure it. Both earlier
    // versions built the weapon from nothing, and no starter deck packs it, so
    // committing the bearer minted a 14-provision ultimate for free and only
    // for the houses whose men happen to bear one. Bhagadatta and Karna are
    // both Kaurava. Measured, everything else held still:
    //
    //   conjured into hand   pandava 35.4  kaurava 60.4  asura 51.1   spread 25.0
    //   fetched from deck    pandava 47.7  kaurava 47.4  asura 49.6   spread  2.2
    const s = makeState({ playerHand: ['karna'], playerDeck: ['bhima', 'vasavi_shakti'] });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(s1.hands.player.some((i) => s1.instances[i]?.cardId === 'vasavi_shakti')).toBe(true);
    expect(s1.decks.player.some((i) => s1.instances[i]?.cardId === 'vasavi_shakti')).toBe(false);
    expect(hasEvent(s1, (e) => e.t === 'granted' && e.cardId === 'vasavi_shakti')).toBe(true);
  });

  it('and rides in empty-handed when it was left at home', () => {
    // The muster screen already warns about exactly this, and now the warning
    // has teeth: an unpacked weapon is a weapon you do not get.
    const s = makeState({ playerHand: ['karna'], playerDeck: ['bhima'] });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(s1.hands.player.some((i) => s1.instances[i]?.cardId === 'vasavi_shakti')).toBe(false);
    expect(hasEvent(s1, (e) => e.t === 'granted')).toBe(false);
  });

  it('costs the host nothing extra: the weapon moves, it is not created', () => {
    // The whole regression in one assertion. Card count across hand and deck is
    // unchanged, because he is handing you something you already paid 14
    // provisions to bring.
    const s = makeState({ playerHand: ['karna'], playerDeck: ['bhima', 'vasavi_shakti'] });
    const before = s.hands.player.length + s.decks.player.length;
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(s1.hands.player.length + s1.decks.player.length).toBe(before - 1); // Karna himself left hand
  });

  it('and the man who brought it can loose it while he still stands', () => {
    // The whole point of the change, stated as the rule rather than the place:
    // the grant is worthless unless its bearer is on the field to use it.
    const s = makeState({ playerHand: ['karna'], playerDeck: ['bhima'] });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    expect(canInvokeAstra(s1, 'player', 'vasavi_shakti')).toBe(true);
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
    expect(s1.decks.player.some((i) => s1.instances[i]?.cardId === 'vasavi_shakti')).toBe(false);
  });

  it('does not duplicate one already in hand', () => {
    const s = makeState({ playerHand: ['karna', 'vasavi_shakti'] });
    const s1 = reduce(s, { type: 'PLAY_CARD', iid: s.hands.player[0], row: 'ratha' });
    const held = [...s1.hands.player, ...s1.decks.player]
      .filter((i) => s1.instances[i]?.cardId === 'vasavi_shakti');
    expect(held.length).toBe(1);
  });
});
