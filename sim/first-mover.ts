// How much is it worth to move SECOND?
//
// The lab reports a first-mover win rate of 42.7% over 9000 games, which means
// whoever moves second wins 57.3%. That is a 14.6-point swing decided before
// anyone plays a card.
//
// For the single-player game this is deliberate and fine: createMatch is called
// with firstMover 'ai' precisely so the human gets the last say. For the ranked
// multiplayer this is aimed at, it is not fine at all, because the coin flip
// would be worth more than most of the deck.
//
// MEASURED, and the obvious explanation is wrong. "Last say" does not do it:
// the seat that acts last in a round WINS only 25.5% of them, because the seat
// still playing after the other has passed is usually the one who was behind
// and kept spending cards. Rounds themselves are near-even, 51.3% to whoever
// opened them.
//
// So the edge is at MATCH level rather than round level, and the mechanism is
// the opening commitment: moving first means showing your hand first in round
// one, with no compensation, and rounds.ts then hands the NEXT round's opening
// to whoever just won. That is deliberate rubber-banding for rounds 2 and 3 and
// it works, but nothing pays back the very first opener.
import { reduce } from '@engine/reducer';
import { createMatch } from '@engine/createMatch';
import { chooseAction } from '@ai/ai';
import { PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK } from '@content/decks';
import type { GameState, Seat } from '@engine/types';

const DECKS = [PANDAVA_DECK, KAURAVA_DECK, ASURA_DECK];
const GAMES = Number(process.argv[2] ?? 1200);

interface Tally {
  n: number;
  firstWins: number;
  draws: number;
  /** Rounds won by the seat that moved first this round. */
  roundsToLeader: number;
  roundsPlayed: number;
}
const overall: Tally = { n: 0, firstWins: 0, draws: 0, roundsToLeader: 0, roundsPlayed: 0 };
/** Split by who took the LAST action of each round. */
let lastActorWonRound = 0;
let roundsScored = 0;

for (let g = 0; g < GAMES; g++) {
  const a = DECKS[g % 3];
  const b = DECKS[(g + 1 + (g % 2)) % 3];
  // Alternate who opens so deck strength cannot masquerade as a turn-order edge.
  const opener: Seat = g % 2 === 0 ? 'player' : 'ai';
  let s: GameState = createMatch(g * 6151 + 17, a, b, opener);
  s = reduce(s, { type: 'MULLIGAN', seat: 'player', iids: [] });
  s = reduce(s, { type: 'MULLIGAN', seat: 'ai', iids: [] });

  let lastActor: Seat = opener;
  let roundOpener: Seat = opener;
  for (let step = 0; step < 800 && s.phase !== 'battleEnd'; step++) {
    const acting = s.activeSeat;
    const before = s.round;
    const next = reduce(s, chooseAction(s, acting));
    if (next === s) break;
    // Whoever moved last before the round resolved.
    const ended = next.log.filter((e) => e.t === 'roundEnd').length;
    const wasEnded = s.log.filter((e) => e.t === 'roundEnd').length;
    if (ended > wasEnded) {
      const ev = [...next.log].reverse().find((e) => e.t === 'roundEnd');
      if (ev && ev.t === 'roundEnd' && ev.winner !== 'tie') {
        roundsScored++;
        if (ev.winner === lastActor) lastActorWonRound++;
        overall.roundsPlayed++;
        if (ev.winner === roundOpener) overall.roundsToLeader++;
      }
      roundOpener = next.activeSeat;
    }
    lastActor = acting;
    s = next;
    if (before !== s.round) lastActor = acting;
  }

  overall.n++;
  if (s.winner === null) overall.draws++;
  else if (s.winner === opener) overall.firstWins++;
}

const decided = overall.n - overall.draws;
console.log(`\nTURN ORDER   ${GAMES} games, opener alternated\n`);
console.log(`moving FIRST wins : ${((overall.firstWins / decided) * 100).toFixed(1)}%`);
console.log(`moving SECOND wins: ${(((decided - overall.firstWins) / decided) * 100).toFixed(1)}%`);
console.log(`draws             : ${((overall.draws / overall.n) * 100).toFixed(1)}%`);
console.log();
console.log(`rounds won by the seat that OPENED the round : ${((overall.roundsToLeader / overall.roundsPlayed) * 100).toFixed(1)}%`);
console.log(`rounds won by the seat that acted LAST in it : ${((lastActorWonRound / roundsScored) * 100).toFixed(1)}%`);
console.log(`\n(if the edge is "last say", the second figure is the one that is high)`);
