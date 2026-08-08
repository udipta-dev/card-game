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

RETIMED on 2026-08-09 against the card set that actually exists. The costs are
not spread evenly and never were:

| cost | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| cards | 4 | 6 | 5 | 24 | 27 | 20 | 17 | 10 | 7 | 3 | 3 | 1 | 1 | 1 |

120 of 129 cards cost twelve or less. The first cut of this table reached cap 12
at level 26, which spent the first half of the ladder on those 120 and the second
half on the remaining nine: everything a player could be given had been given by
the halfway point. Worse per house, past level 26 no army gained a single card of
its OWN, because the only house cards above twelve are Bhishma and Bali.

| level | cap | budget | what walks through the door | cards |
|---|---|---|---|---|
| 1 | 7 | 120 | the rathi bulk. A wide, cheap host | 16-19 |
| 6 | 8 | 130 | **Nakula and Sahadeva** | 10 |
| 12 | 9 | 142 | **Ghatotkacha** | 10 |
| 19 | 10 | 157 | **Ashwatthama** | 10 |
| 26 | 11 | 171 | **Bhima** | 4 |
| 33 | 12 | 185 | **Karna**, **Arjuna**, **Ravana** | 3 |
| 38 | 13 | 196 | **Bhishma**, **Bali** | 1-2 |
| 42 | 14 | 204 | **Vasavi Shakti**, **Vishwaroop** | 3 |
| 45 | 15 | 210 | **Narayan-Astra** | 1 |
| 47 | 16 | 214 | **Brahmashirsha-Astra** | 1 |
| 50 | 18 | 220 | **Pashupat-Astra** | 1 |

Budget between the steps is linear: `120 + round((level - 1) * 100 / 49)`.

The dense bands now run across the first two thirds, and the last stretch is the
world-enders one at a time, which is the right shape for a top end: rare, named,
worth the climb.

### What this does not fix

There are still only nine cards above cost twelve, and only two of them belong to
a house. From level 42 up, no army gains a card of its own; every unlock is a
neutral astra. Retiming spreads the pacing, it does not create content.

Two ways out, and the second needs a decision rather than a measurement:

1. **Content.** Three or four house cards priced 13 to 15 each, so the top of the
   ladder has a Pandava, a Kaurava and an Asura face on it.
2. **Repricing the marquee warriors.** Arjuna, Karna, Ravana and Indrajit all sit
   at 12 and are the greatest warriors in the epic; at 13 to 14 they would fill
   the late ladder with house cards and arguably be priced closer to what they
   do. This is a balance change: the three armies currently sit within 3.0 points
   of each other and that was expensive to reach, so it wants a lab session and
   an explicit yes before anyone touches it.

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
