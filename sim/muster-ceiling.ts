// What is the best deck a human can bring to quickplay, and does it matter?
//
// The balance lab measures STARTER against STARTER, which is what an AI-vs-AI
// game is. Quickplay is not that. The player may muster a custom deck from the
// whole house pool, and Setup hands the AI `deckFor(ai)`, which is always the
// fixed starter. There is also no per-card cap outside the ladder, only the 170
// total, so nothing stops a human taking the most expensive card in the pool.
//
// That asymmetry is older than any of today's work: every house has cards its
// starter leaves behind. The question promoting five asuras raises is whether it
// moved the CEILING, because Bali went from a 7-power atirathi to a 10-power
// deathless maharathi, and Mahishasura from 7 to 9.
//
// So this builds the deck a player would actually reach for and measures it
// against the starters it would face.
import { runBalance, formatReport } from '@ai/balanceLab';
import { ASURA_DECK, PANDAVA_DECK, KAURAVA_DECK, DECK_BUDGET } from '@content/decks';
import { getCard } from '@content/cards';
import { checkMuster } from '@content/muster';
import type { CardId } from '@engine/types';

const PER_SIDE = Number(process.argv[2] ?? 300);
const prov = (id: CardId) => getCard(id).provision ?? getCard(id).basePower + 2;
const spend = (ids: readonly CardId[]) => ids.reduce((n, id) => n + prov(id), 0);

/** The starter with the two promoted men bought back in, at full price. */
function greedyAsura(): CardId[] {
  const out = ASURA_DECK.cards.filter((c) => c !== 'atikaya' && c !== 'trishira');
  return [...out, 'bali', 'mahishasura'];
}

const built = greedyAsura();
const check = checkMuster(built);
console.log(`\nTHE QUICKPLAY CEILING   ${PER_SIDE} games per side order\n`);
console.log(`  starter asura   ${ASURA_DECK.cards.length} cards, ${spend(ASURA_DECK.cards)} of ${DECK_BUDGET}`);
console.log(`  mustered asura  ${built.length} cards, ${spend(built)} of ${DECK_BUDGET}`);
console.log(`  legal: ${check.ok}${check.ok ? '' : ' -> ' + check.problems.join('; ')}`);
if (!check.ok) process.exit(1);

function spread(report: string): string {
  const rows = [...report.matchAll(/^ {2}(pandava|kaurava|asura)\s+([\d.]+)%/gm)];
  const pct = rows.map((r) => Number(r[2]));
  return (
    rows.map((r, i) => `${r[1]} ${pct[i].toFixed(1)}%`).join('   ') +
    `   |  spread ${(Math.max(...pct) - Math.min(...pct)).toFixed(1)}`
  );
}

console.log(`\n  starters, as the lab always measures them:`);
console.log(`    ${spread(formatReport(runBalance(PER_SIDE)))}`);

// Swap the mustered list in for the duration of the second run. Mutating the
// deck rather than threading a deck argument through runBalance keeps this
// honest: it is the same harness, the same seeds, one deck changed.
const original = ASURA_DECK.cards.slice();
(ASURA_DECK as { cards: CardId[] }).cards = built;
console.log(`\n  with the asura player mustering Bali and Mahishasura back in:`);
console.log(`    ${spread(formatReport(runBalance(PER_SIDE)))}`);
(ASURA_DECK as { cards: CardId[] }).cards = original;

console.log(
  `\n  (Pandava and Kaurava are unchanged in both runs, so any movement in their\n` +
    `   numbers is the asura deck beating them harder, not a change to them.)\n`,
);
void PANDAVA_DECK;
void KAURAVA_DECK;
