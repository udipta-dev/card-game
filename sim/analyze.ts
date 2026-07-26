// Deep balance analysis. Reports findings, not a data dump.
//   npm run analyze            (default sample)
//   npm run analyze 3000 300   (battles, runs-per-policy)
import { findings, simulateBattles, simulateRuns } from '@ai/balanceReport';
import type { ShrinePolicy } from '@ai/balanceReport';
import { samplesNeeded } from '@ai/stats';

const battles = Number(process.argv[2] ?? 1500);
const runsEach = Number(process.argv[3] ?? 150);

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const pad = (s: string, n: number) => s.padEnd(n).slice(0, n);

console.log(`\nKURUKSHETRA BALANCE ANALYSIS`);
console.log('='.repeat(72));
console.log(`${battles} battles, ${runsEach} runs per shrine policy`);
console.log(
  `At this battle count a real gap of 2 points needs ~${samplesNeeded(0.02)} games to resolve; ` +
    `1 point needs ~${samplesNeeded(0.01)}.`,
);

const t0 = Date.now();
const b = simulateBattles(battles);
const runs = (['vardaan', 'penance-long', 'penance-short', 'walk'] as ShrinePolicy[]).map((p) =>
  simulateRuns(runsEach, p),
);
const secs = ((Date.now() - t0) / 1000).toFixed(1);

console.log(`\nFACTIONS                 win rate         95% interval     games`);
for (const d of b.decks) {
  console.log(
    `  ${pad(d.name, 22)} ${pad(pct(d.overall.rate), 16)} ${pad(
      `${pct(d.overall.lo)} - ${pct(d.overall.hi)}`,
      17,
    )}${d.overall.n}`,
  );
}
console.log(
  `\n  Moving first: ${pct(b.firstMover.rate)} (±${pct(b.firstMover.moe)}). Draws ${pct(b.drawRate)}.`,
);

console.log(`\nSTRONGEST CARDS BY LIFT   (win rate when played, minus the deck's own rate)`);
for (const c of b.cards.filter((c) => c.played.n >= 40).slice(0, 8)) {
  console.log(
    `  ${pad(c.name, 24)} ${pad(`${c.lift > 0 ? '+' : ''}${(c.lift * 100).toFixed(1)}pts`, 10)} ${pad(
      `${c.provision}p`,
      5,
    )} played ${pct(c.playRate)}  n=${c.played.n}`,
  );
}
console.log(`\nWEAKEST CARDS BY LIFT`);
console.log(`  Read cheap filler here with suspicion: a 4-provision card gets played`);
console.log(`  BECAUSE the good cards are gone or the round is already lost, so negative`);
console.log(`  lift can be the situation choosing the card, not the card losing the game.`);
for (const c of b.cards.filter((c) => c.played.n >= 40).slice(-8).reverse()) {
  console.log(
    `  ${pad(c.name, 24)} ${pad(`${c.lift > 0 ? '+' : ''}${(c.lift * 100).toFixed(1)}pts`, 10)} ${pad(
      `${c.provision}p`,
      5,
    )} played ${pct(c.playRate)}  n=${c.played.n}`,
  );
}

console.log(`\nRUN LAYER                completed        avg depth   deaths by rung`);
for (const r of runs) {
  console.log(
    `  ${pad(r.policy, 22)} ${pad(pct(r.completed.rate), 16)} ${pad(r.avgDepth.toFixed(2), 12)}[${r.deathsByRung.join(', ')}]`,
  );
}

const found = findings(b, runs);
console.log(`\nFINDINGS  (${found.length}, ranked; nothing listed unless the interval supports it)`);
console.log('='.repeat(72));
for (const f of found) {
  console.log(`  [${f.severity.toUpperCase().padEnd(6)}] ${f.area.padEnd(10)} ${f.text}`);
}
if (!found.length) console.log('  Nothing significant at this sample size.');

console.log(`\nAnalysed in ${secs}s.\n`);
