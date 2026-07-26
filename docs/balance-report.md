# Balance report

Measured over 2,400 battles and 2,000 full runs across eight shrine policies,
plus an audit of who can wield what. Every number here carries a confidence
interval; nothing is claimed that the sample does not support.

Reproduce with `npm run analyze` and `npx vite-node sim/scenarios.ts 250`.

---

## Executive summary

Your instinct is right, and the data is blunter than the instinct. **A tier-3
penance has never once paid out.** Across 147 attempts, the weapon was fired
zero times.

But the cause is not that the price is too low. It is that two mechanisms are
broken, and underneath them the effort economy has no shape: every tier is
bought with the same currency, differing only in how many battles it costs.
That is exactly the "three round break" problem you named. A world-ender should
not be a longer errand, it should be a different kind of undertaking.

Four things, in the order I would fix them:

1. **The shrine lies about its odds.** It displays 50% and delivers 0%. A bug.
2. **A weapon earned cannot be used.** Firing it needs a two-card combo. A bug.
3. **The effort economy is flat.** Tiers differ only in duration. A design gap.
4. **Runs are faction-imbalanced** even though single battles are not.

---

## 1. The shrine displays odds it cannot honour — FIXED

**Was: high severity bug. Now fixed and locked with regression tests.**

All three starting decks contain the Brahma-Astra. Brahma's tier-2 domain
contains only the Brahma-Astra. `rollPenanceOutcome` filters out anything you
already hold, so that slot is always empty, and the roll silently returns
nothing.

`effectiveOdds`, which produces the numbers shown on the shrine card, does not
apply that same filter.

```
Brahma, 2 battles, holding the Brahma-Astra
  shown to the player : 50% a great weapon, 50% nothing
  actually delivers   :  0.0% success over 2,000 rolls
```

Observed in play: **39 tier-2 penances taken, 14 warriors returned, 0 astras.**
If the true rate were the advertised 50%, zero successes in fourteen returns has
a probability under 0.01%.

**Fixed.** `effectiveOdds` now takes the held set and `stepDown` walks past any
tier whose every weapon the host already owns, so display and roll consult
exactly the same information. The existing viability filter, correct in intent
and merely blind to inventory, now sees the truth.

**Result:** tier-2 wagers have disappeared from the offer pool entirely. Where
Brahma cannot deliver, he is no longer asked. That is the correct behaviour: an
offer that cannot pay is not a wager, it is a lie.

---

## 2. A weapon earned through penance cannot be fired — FIXED

**Was: high severity bug. Now fixed and locked with regression tests.**

`canInvokeAstra` requires the granted warrior to be **on the board**. So using
a penance-earned astra is a two-card combo: draw the warrior *and* draw the
astra, from an eighteen-card deck, in the same battle. The reward has already
been paid for, in advance, with the warrior's absence.

Collection rate, by the highest tier a wager could return:

| Policy | Taken | Returned | Won an astra | **Ever fired** | Collected |
| --- | --- | --- | --- | --- | --- |
| tier 1 | 175 | 103 | 80 | 23 | **13.1%** |
| tier 2 | 39 | 14 | 0 | 0 | **0.0%** |
| tier 3 | 147 | 20 | 9 | **0** | **0.0%** |
| any | 254 | 30 | 42 | 6 | 2.4% |

Read the tier-3 row again. One hundred and forty-seven investments of your best
warrior, nine weapons actually earned, **and not one of them ever reached the
table.**

**Fixed.** `canInvokeAstra` no longer demands the granting warrior on the
board. He went, he learned it, he brought it back to the host. Someone must
still be on the field to loose it, so an empty board cannot fire anything.

**Result:** tier-1 collection rose from **13.1% to 21.8%**.

**Tier 3 remains at zero, and this turned out NOT to be a bug.** Instrumenting
it further: across 400 runs, twelve battles were fought while holding an earned
tier-3 astra and it reached hand zero times. Not a legality problem, not the AI
refusing it. The cause is LADDER GEOMETRY. Shrines stand before rungs 2 and 4
of a six-rung ladder, so a three-battle penance taken at the first shrine
returns the warrior at rung 5, leaving exactly one battle to draw the weapon
and fire it. Verified directly: the astra is in the roster, in the fielded
roster, unbanned, and in the deck handed to the battle. There is simply almost
no run left in which to use it.

That is a design parameter, not a defect, and it belongs with the tiering
question below: either shrines move earlier, the ladder grows, or a tier-3
weapon arrives by a route other than waiting.

---

## 3. The effort economy is flat, which is the real problem

**Severity: high. This is the design issue you identified.**

Today every tier is bought with the same currency and gated the same way. Only
two numbers move:

| | Gate | Price | Odds |
| --- | --- | --- | --- |
| Tier 1 | standing >= 8 | 1 battle absent | high |
| Tier 2 | standing >= 9, 2+ battles | 2 battles absent | medium |
| Tier 3 | standing >= 12, 3+ battles | 3 battles absent | ~29% |

So the Pashupat-Astra costs "three battles instead of one". That is a longer
errand, not a greater undertaking, and it is why it reads cheap.

The roster audit shows the *qualification* side is closer to right than the
price side:

| Tier | Warriors who can wield it | Share of roster |
| --- | --- | --- |
| 1 | 15 | 19% |
| 2 | 11 | 14% |
| 3 | **6** | **7%** |

Six for the ultimates is close to your "three or four in the books". Tier 2 at
eleven is loose for the Brahma line.

### Recommendation: make each tier a different kind of undertaking

Not bigger numbers. Different gates.

**Tier 1, the elemental weapons. Make this genuinely worth taking.**
Any standing-8 warrior, one battle, high success. This should be the reliable,
attractive choice that makes a shrine feel like a reward. Once collection is
fixed (item 2), it becomes the workhorse.

**Tier 2, the Brahma line. A considered investment.**
Require `astraMastery >= 2` outright rather than a standing threshold, which is
the trained-astra-master gate the tier already implies. Two battles, roughly
even odds. Narrows the pool from eleven toward the handful who were actually
taught.

**Tier 3, the ultimates. A campaign, not a purchase.**
Add gates of a *different kind* rather than a bigger number:
- the warrior must already have completed a tapasya (a chain, so the ultimates
  sit at the end of a path rather than at a price),
- **and** standing 13 or more,
- **and** three or more battles,
- **and** the god must appear, which is already uncommon.

**Pashupat-Astra. Vanity, and it should feel like it.**
Shiva alone, plus standing 14 (Arjuna, Bhishma, Karna only), plus the warrior
must already bear a tier-3 astra, plus a long penance, at low odds. It already
wins the battle outright and burns five warriors out of your deck, so it is
best understood as a trophy with a story attached rather than a strategy.

**A canon note worth fixing while you are in there.** Ravana and Indrajit both
sit at standing 13 and therefore qualify for Shiva, which means an asura host
can currently earn the Pashupat-Astra. A `houses` restriction on a deity would
close that, and would also let Surya and Parashurama be written later as
Karna-only paths.

---

## 4. Runs are faction-imbalanced, though single battles are not

**Severity: medium. New, and invisible to the old lab.**

Single-battle balance is level. All three intervals straddle 50%:

| Deck | Win rate | 95% interval |
| --- | --- | --- |
| Pandava | 48.7% | 43.8 - 53.7 |
| Kaurava | 52.8% | 47.9 - 57.7 |
| Asura | 48.5% | 43.5 - 53.4 |

Run completion is not:

| House | Runs completed | Average depth |
| --- | --- | --- |
| Pandava | **7.2% ±4.6** | 2.36 |
| Kaurava | 12.8% ±5.9 | 2.94 |
| Asura | **20.0% ±7.0** | 3.28 |

An Asura run is nearly **three times** more likely to finish than a Pandava
one, from decks that are level in a single fight. Balancing one battle does not
balance six, because attrition, the spent arsenal and the ladder's fixed
opponents all compound across a run. Worth re-tuning against run completion,
not just battle win rate.

---

## 5. Every shrine option still loses to walking past it

Measured AFTER both fixes. Tier-2 now exactly matches walking because the
policy no longer finds an offer to take, which is the fix working as intended.

| Policy | Completed | Avg depth | vs walking |
| --- | --- | --- | --- |
| **Walk past** | 15.6% ±4.5 | **3.02** | baseline |
| Tier-2 penance | 15.6% ±4.5 | 3.02 | +0.00 (no longer offered) |
| Free vardaan | 14.4% ±4.4 | 2.96 | -0.06 |
| Tier-1 penance | 12.4% ±4.1 | 2.90 | -0.12 |
| Tier-3 penance | 11.2% ±3.9 | 2.79 | -0.23 |
| Greedy best | 10.8% ±3.9 | 2.77 | -0.25 |

Note the free vardaan also loses, by a small margin. Taking a free card should
not cost you anything, which points at **deck dilution**: a situational one-shot
displaces a warrior in an eighteen-card deck, so it thins every draw for the
rest of the run. Worth watching after the collection fix; if it persists, the
answer is fewer, stronger vardaan rather than more of them.

---

## 6. Brahma-Astra is underpriced

It lifts every deck that holds it, by the same margin, in all three:

| Deck | Lift when played | Sample |
| --- | --- | --- |
| Asura | +24.2 pts | 280 |
| Pandava | +18.5 pts | 367 |
| Kaurava | +17.5 pts | 390 |

One deck could be variance. The same result in three, at these sample sizes, is
a card that is simply too strong for eleven provisions. Either raise the cost or
soften the effect.

---

## Method notes

**Card strength is measured as lift**, meaning win rate when played minus the
card's own deck win rate. Raw win rate is confounded by deck strength: a
mediocre Asura card looked strong purely because the Asura deck wins more.

**Cheap filler reads misleadingly negative.** Kaurava Footmen show -20 points,
but a four-provision card gets played *because* the good cards are gone or the
round is already lost. That is the situation choosing the card, not the card
losing the game.

**The noise floor is real.** An A/B harness running an AI against an identical
copy of itself scored 48.5%, so anything inside about 1.5 points is not a
finding. This is why every rate here carries an interval.

**Three plausible hypotheses were tested and rejected**, which is worth
recording so they are not retried: penalising curses in the AI evaluation
(43% against the unmodified AI), valuing unspent ability charges (47%), and
two-ply lookahead (worse the deeper it went, because the hidden-hand
determinization leaves the opponent with no cards to reply with). A longer
nine-rung ladder also failed to rescue penance.
