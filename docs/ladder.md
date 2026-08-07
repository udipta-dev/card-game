# The ladder: levels 1 to 50

**For review. Nothing here is built.** The shape was settled in conversation and
is recorded in `progression.md`; this file is the numbers.

## Recap of the shape

A level attempt is a short run. Win the run and you go up one; lose it and you
go down one. Two numbers are tracked, not one:

- **Rank** — moves both ways. Drives matchmaking, the leaderboard, and your
  total deck budget.
- **High-water mark** — the best rank you have ever held. Never falls. Drives
  your per-card cap, and therefore what you own.

So a demotion costs you budget, never a card.

## The two currencies

**Per-card cap.** The most any single card may cost. This is the gate, and it is
worn as an economy rather than a rule: the game never says "you may not have
Karna", it says "you cannot afford a card that big yet".

**Total budget.** What the whole host may cost, the number that exists today at
170.

They bind at opposite ends of the game, which is the good part. Early the cap
binds and the budget is slack: at cap 7 a full 19-card host costs at most 133,
so what limits you is that there are no giants to buy. Late the cap is wide open
and the budget bites: at cap 18 you can afford Pashupata OR Bhishma and Arjuna,
not all three. Early game is "I have no big cards". Late game is "I cannot bring
all my big cards", which is a much better problem.

## Where the cards actually sit

Measured from the live set, 114 playable cards:

| cost | cards | who arrives |
|---|---|---|
| 4-6 | 14 | levies, Shakuni, the cheap elemental astras |
| 7 | 21 | the rathi bulk |
| 8 | 21 | Nakula, Sahadeva, Iravan, Sankha |
| 9 | 21 | Yudhishthira, Ghatotkacha, Drupada, Virata |
| 10 | 15 | Abhimanyu, Dhrishtadyumna, Sweta, Satyaki, Ashwatthama |
| 11 | 8 | Bhima, Drona, Duryodhana, Bhagadatta, Brahma-Astra |
| 12 | 7 | Arjuna, Karna, Krishna, Ravana, Indrajit |
| 13 | 2 | **Bhishma** |
| 14 | 2 | Vaishnav-Astra, Vasavi Shakti |
| 15 | 1 | Narayan-Astra |
| 16 | 1 | Brahmashirsha-Astra |
| 18 | 1 | **Pashupat-Astra** |

Eleven bands, so ten unlock moments across fifty levels. That is one ceremony
roughly every five levels, which is about the right rhythm: often enough to keep
the next one visible, rare enough that it still lands.

## The schedule

| level | cap | budget | what walks through the door |
|---|---|---|---|
| 1 | 7 | 120 | the rathi bulk. A wide, cheap host |
| 5 | 8 | 128 | **Nakula and Sahadeva** |
| 10 | 9 | 138 | **Ghatotkacha** |
| 15 | 10 | 149 | **Ashwatthama** |
| 20 | 11 | 159 | **Bhima** |
| 26 | 12 | 171 | **Karna** |
| 32 | 13 | 183 | **Bhishma** |
| 38 | 14 | 196 | **Vasavi Shakti**, Karna's spear |
| 42 | 15 | 204 | **Narayan-Astra** |
| 46 | 16 | 212 | **Brahmashirsha-Astra** |
| 50 | 18 | 220 | **Pashupat-Astra** |

Budget between the steps is linear: `120 + round((level - 1) * 100 / 49)`.

Note that level 26 is where the game today begins: cap 12, budget 171, which is
within a point of the 170 the starter decks spend now. Everything below 26 is
new territory that no one has played, and everything above is the part that has
never had cards big enough to need it.

The last five bands are the three world-enders and the two carried spears. You
finish the ladder by earning the weapons, which is the right ending for this
game and answers the "the great astras should feel earned" note directly.

## One headline name per step, not a list

Crossing into cap 12 makes seven cards legal at once. Announcing seven is mush;
announcing **Karna** is a moment. The others arrive quietly in the muster
screen. One ceremony, one name, one face, and because progression is linear the
next name is always visible and always one step away.

## The AI, which is the actual build

A ladder to 50 is only worth climbing if the opponent at 40 plays differently
from the one at 4. Today the AI has one setting. Two dials, in order of how much
they matter:

**1. Its deck is built to your level.** This is most of the difficulty curve and
costs almost nothing: at level 3 it fields 7-cost warriors because that is all
it can afford either. No hand-tuned ladder of decks to maintain.

**2. How well it plays.** The engine already carries the machinery:

| levels | search | worlds | round trade |
|---|---|---|---|
| 1-10 | greedy, best immediate value | 1 | no |
| 11-30 | one ply | 2 | no |
| 31-50 | full determinized search | 4 | yes |

`WORLDS` and the round-trade flag both exist in `src/ai/ai.ts` already
(`AI_USES_ROUND_SWAP` is switched off by measurement today).

## Open questions I could not settle alone

1. **Does a lost run pay anything at all?** A demotion is the whole penalty as
   written, which is clean. But fifty levels of pure win-up/lose-down at a 50%
   win rate is a random walk that never arrives. Either the AI must be beatable
   above 50% at every rung, or a loss needs to pay something. I lean toward
   tuning the AI to sit around 45% so climbing is slow but real.
2. **Run length.** Three battles per level attempt means ~150 battles to reach
   50. Five means ~250. I lean toward three early and five past level 30, so the
   commitment grows with the stakes.
3. **What a brand-new player sees.** Level 1 with cap 7 is a genuinely different
   game from the one that exists now, and nobody has played it. It may be dull.
   It needs a session in the lab before it is built for real.
