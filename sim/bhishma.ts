// Who actually has an answer to Bhishma?
//
// The three hot cards were assumed to share a cause, because they share an
// ability: Arrow Rain, -2 to every enemy, one maharathi per house. That was
// wrong, and the A/B was flat. Cutting it to -1, or to the single rank he
// faces, moved all three by about a point and left the spread at 28:
//
//     now: -2 every foe      Ravana 53.8   Arjuna 50.0   Bhishma 77.9
//     -1 every foe                  51.5          48.4           77.0
//     -2 the rank he faces          54.6          48.4           77.9
//
// The ability is not the problem. The gap between Bhishma and the other two is,
// and the thing only Bhishma has is icchamrityu: he cannot be destroyed, and
// cannot be worn below a third of his strength, until Shikhandi takes the
// field. Shikhandi is a PANDAVA card. So one house in three owns the only
// answer to him, and against the other two he is a 10-power body that cannot
// be removed by anything in the game.
//
// This measures that asymmetry directly: Bhishma's record split by who he is
// facing, with and without the keyword.
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import { getCard } from '@content/cards';
import type { GameState, Seat, CardId } from '@engine/types';

const FOES = [
  ['Pandava (holds Shikhandi)', PANDAVA_DECK],
  ['Kaurava (no answer)', KAURAVA_DECK],
  ['Asura (no answer)', ASURA_DECK],
] as const;
const GAMES = Number(process.argv[2] ?? 300);

/** Bhishma's record when committed, against one opposing deck. */
function record(foeIndex: number, card: CardId): { played: number; won: number } {
  let played = 0;
  let won = 0;
  for (let g = 0; g < GAMES; g++) {
    // Kaurava always brings Bhishma. Alternate the seat so the going-second
    // edge cannot be mistaken for the keyword's value.
    const first: Seat = g % 2 ? 'ai' : 'player';
    let s: GameState = createMatch(g * 7919 + 13, KAURAVA_DECK, FOES[foeIndex][1], first);
    s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
    s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });
    for (let i = 0; i < 800 && s.phase !== 'battleEnd'; i++) {
      const next = reduce(s, chooseAction(s, s.activeSeat));
      if (next === s) break;
      s = next;
    }
    const by = s.log.find((e) => e.t === 'play' && e.cardId === card);
    if (!by || by.t !== 'play') continue;
    played++;
    if (s.winner === by.seat) won++;
  }
  return { played, won };
}

function table(label: string): void {
  console.log(`\n  ${label}`);
  for (let i = 0; i < FOES.length; i++) {
    const r = record(i, 'bhishma');
    if (!r.played) throw new Error(`no Bhishma plays vs ${FOES[i][0]}: the harness is broken`);
    console.log(
      `    vs ${FOES[i][0].padEnd(26)} ${((r.won / r.played) * 100).toFixed(1).padStart(5)}%   (${r.played} plays)`,
    );
  }
}

console.log(`\nBHISHMA AND HIS ONE ANSWER   ${GAMES} games per matchup\n`);
table('as shipped: cannot be slain until Shikhandi stands');

// Strip the keyword and run the identical seeds again. The difference is what
// icchamrityu is worth, per opponent.
const kept = getCard('bhishma').keywords.slice();
getCard('bhishma').keywords = kept.filter((k) => k.kind !== 'icchamrityu');
table('control: keyword removed entirely');
getCard('bhishma').keywords = kept;
console.log('');
