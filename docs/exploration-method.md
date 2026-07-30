# How the exploration lab samples

`npm run sim` answers one question well: *are the three curated decks even?* It
is blind to three others, and each blind spot needs a different sampling
strategy, because the dimensions have different shapes.

Run it with `npm run explore [scale]`. Scale 1 is a smoke test (~40s), scale 4
is the real thing.

---

## The three blind spots

**Mirrors were excluded.** `balanceLab.ts` line 64 reads `if (a !== b)`, so a
deck has never been played against itself. That number is the noise floor: two
identical decks must land at 50%, and any gap is caused by something other than
the cards.

**Results were aggregated over opponents.** Each deck's win rate was averaged
across both rivals, which makes a rock-paper-scissors triangle invisible. Three
decks at 50% overall can still be A > B > C > A, and that plays completely
differently from three genuinely even decks.

**Only three decks were ever played.** The lab could not say whether the curated
decks are *good*, only whether they are even with each other. Three equally
mediocre decks look identical to three equally strong ones.

---

## Why not brute force

The composition space is roughly 80 cards choose 19 under a provision cap. That
is on the order of 10^18 decks before you count matchups, orderings and
shuffles. Enumeration is not on the table at any budget, so each experiment gets
a strategy fitted to its own question.

---

## 1. Matchup matrix: adaptive racing allocation

**Question:** who actually beats whom, including each deck against itself.

Uniform allocation wastes games. A cell already measured at 50.0 +/- 1.5 gains
almost nothing from another 500 games, while a cell at 47 +/- 6 is still
undecided. So after a warm-up batch on all nine cells, the lab repeatedly hands
the next batch to whichever cell currently has the **widest Wilson interval**.

That is the standard racing / sequential-analysis idea: spend the budget where
the uncertainty is, not where the schedule says.

**Wilson rather than the normal approximation**, because cells are deliberately
evaluated at small n, where `p +/- 1.96*sqrt(p(1-p)/n)` can run past 0 or 1 and
produces intervals that are not merely wrong but impossible.

## 2. Deck composition: Monte Carlo over the legal region

**Question:** are the curated decks any good, or is a stronger build sitting
unbuilt in the same 170 provisions?

Sample uniformly at random from the **legal** region: inside the provision cap,
and holding no astra the deck cannot invoke. That second constraint is
`checkDeckAstras`, the same rule the content tests enforce, so a sampled deck is
one a player could legitimately build rather than an arbitrary pile of cards.

Every sampled deck plays all three curated decks in **both orientations**, so
side order cannot flatter a sample.

A deck counts as beating the field only when its Wilson **lower bound clears
50%**. The first pass reported a random deck at "61.1%", which was eleven wins
in eighteen games and statistically a coin. Raw rates at low n are how you talk
yourself into a finding that is not there.

## 3. Card interactions: pairwise coverage

**Question:** which cards actually work together?

All-pairs is the standard answer to combinatorial explosion: exercising every
*pair* catches the large majority of interaction faults for a tiny fraction of
the cost of every combination. We do not need to construct a covering array,
because the shuffle already samples pairs for us. We only have to watch which
pairs actually landed together and score them.

**Lift** = win rate in games where both cards were committed, minus that deck's
base win rate. Positive lift is synergy, negative is anti-synergy.

The first run set the threshold at 15 co-occurrences after a pass at 40 returned
literally nothing: a specific pair of units lands together in only a fraction of
games, so the bar has to be low enough that any pair clears it.

---

## Reading the output honestly

- **Cells report `+/-` and `n`.** A 5-point difference on a 5-point interval is
  not a difference.
- **Mirror rows are the control.** If a mirror is not ~50%, the seat is worth
  something and every other number in the table carries that same bias.
- **Random-deck rows are a distribution, not a leaderboard.** The useful figure
  is where the curated deck sits in it, not which random pile came first.
