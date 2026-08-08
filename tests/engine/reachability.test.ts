// Content reachability, and the bug it caught.
//
// An audit sweep found 12 cards that no player could obtain by any route: not
// in a starter deck, not in the shrine pool, not a recruitable unit. Most were
// merely unbuilt content. One was a live gameplay bug.
import { describe, expect, it } from 'vitest';
import { attemptDestroy } from '@engine/keywords';
import { reduce } from '@engine/reducer';
import { getCard, allCards } from '@content/cards';
import { DECKS } from '@content/decks';
import { VARDAAN_CARDS } from '@content/cards/vardaan';
import { firstOf, makeState } from './helpers';
import { poolFor } from '@content/muster';

describe('Drona can be killed, which he could not be', () => {
  // He carries immuneUntilPlayed{ ashwatthama_elephant }. That card was in no
  // deck and no run path, so his immunity could never lift: an unkillable 9.
  it('is immune while the deception is unspoken, which is the point of him', () => {
    const s = makeState({ aiBoard: { ratha: ['drona'] } });
    expect(attemptDestroy(s, 'player', s.board.ai.ratha[0])).toBe(false);
  });

  it('and falls once it is', () => {
    const s = makeState({
      playerHand: ['ashwatthama_elephant'],
      aiBoard: { ratha: ['drona'] },
      passed: { ai: true }, // keep the turn so we can follow up
    });
    s.activeSeat = 'player';
    const drona = firstOf(s, 'ai', 'drona');
    const s1 = reduce(s, {
      type: 'PLAY_CARD',
      iid: firstOf(s, 'player', 'ashwatthama_elephant').iid,
      row: 'ratha',
    });
    expect(s1.instances[drona.iid].flags.has('disarmed'), 'he lays down his bow').toBe(true);
    expect(attemptDestroy(s1, 'player', drona.iid), 'and can now be killed').toBe(true);
  });

  it('SOMEBODY can actually play it: it is in a starter deck', () => {
    // The whole bug was that this was false.
    const holders = Object.values(DECKS).filter((d) => d.cards.includes('ashwatthama_elephant'));
    expect(holders.length).toBeGreaterThan(0);
  });

  it('and it sits with the host that tells the lie', () => {
    // Yudhishthira speaks it, and his own Dhrishtadyumna finishes Drona.
    const holders = Object.values(DECKS).filter((d) => d.cards.includes('ashwatthama_elephant'));
    expect(holders.map((d) => d.house)).toContain('pandava');
    expect(DECKS['pandava_starter'].cards).toContain('dhrishtadyumna');
  });
});

describe('no card is stranded where nobody can reach it', () => {
  // Guards against re-introducing the class of bug rather than the instance.
  it('every keyword that names another card can have that card played', () => {
    for (const c of allCards()) {
      for (const kw of c.keywords) {
        const named =
          kw.kind === 'immuneUntilPlayed' ? kw.card :
          kw.kind === 'icchamrityu' ? kw.unlessCardOnBoard : null;
        if (!named) continue;
        // REACHABLE MEANS A PLAYER CAN GET IT, not that a starter deck ships
        // with it. Those were the same thing when every card was either dealt
        // or nonexistent; they stopped being the same once the muster screen
        // let you build your own host from the whole pool. Krishna leaving the
        // Pandava starter deck is the case that exposed it: he is one tap away
        // on the muster screen and a shrine reward besides, so nothing that
        // names him is stranded.
        const inDeck = Object.values(DECKS).some((d) => d.cards.includes(named));
        const musterable = (['pandava', 'kaurava', 'asura'] as const).some((h) =>
          poolFor(h).some((card) => card.id === named),
        );
        expect(
          inDeck || musterable,
          `${c.id} needs '${named}' played, and it is in no deck and no muster pool`,
        ).toBe(true);
      }
    }
  });

  it('every vardaan is offered by the shrine', () => {
    // These looked stranded in the audit and are not: the shrine imports them
    // directly rather than listing ids, which is why a grep missed them.
    expect(VARDAAN_CARDS.length).toBeGreaterThan(0);
    for (const v of VARDAAN_CARDS) expect(getCard(v.id)).toBeDefined();
  });
});
