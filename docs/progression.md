# Progression: levels, budget, unlocks

Design settled in conversation, not yet built. Nothing in this file exists in
code. It is written down so the reasoning survives the session it came from.

Today there is no level, no XP and no unlock. The whole roster is available
immediately, the deck budget is a fixed 170, and the only cross-run memory is
three integers in `src/run/meta.ts` (`runsStarted`, `runsWon`, `bestDepth`).

## The shape

One ladder. You start at level 1, a win moves you up, a loss moves you down.
Your level lives in memory between sessions, and the leaderboard ranks it. That
is the whole loop, and it is why climbing to 100 is plausible: nobody is
grinding a 100-battle run, they are playing short battles that move a number.

A loss costing exactly one level is the entire loss penalty. It is enough,
because it is immediate and legible, and it lets you fight straight back.

## TWO numbers, not one

This is the load-bearing decision and it is worth stating plainly, because a
single level number breaks the design.

| | Follows | Moves down on a loss? | Governs |
|---|---|---|---|
| **Rank** | current standing | yes | matchmaking, the leaderboard, total deck budget |
| **High-water mark** | best rank ever reached | **no** | the per-card point cap, and therefore what you own |

If both were one number, losing would take cards out of your collection: fall
from 12 to 11 and Karna disappears from your muster. That is the one failure
mode that makes people quit a ladder, because it reads as theft rather than as
a setback.

Splitting them keeps the pressure and removes the theft. **You lose ground; you
never lose your army.**

## What a level actually gives you

Two levers, and they are deliberately different in kind.

**1. A cap on the points any SINGLE card may cost.** Not a list of locked cards.
At a low cap you simply cannot afford a giant, so you field many small warriors;
as the cap rises the giants become legal one band at a time. This is better than
a lock list for one reason: it never tells the player "you may not have this",
it tells them "you cannot afford something that big yet", which is the same gate
worn as an economy rather than a rule.

The cap follows the **high-water mark**, so it never falls.

**2. The total deck budget**, which follows **rank** and therefore does fall.

The interaction between the two is the good part, and it is what makes a demotion
interesting rather than punishing. Drop from 12 to 9 and you still own Karna, but
your budget is tighter, so bringing him means fielding fewer or smaller men around
him. He becomes a real decision instead of an obvious yes. And owning him is the
reason you believe you can climb back.

## Unlocks should be an event, not a drip

The trap in a pure cap system: when the cap goes 11 to 12, every 12-cost card in
the game becomes legal at once. Six cards arriving together is mush. Nobody
remembers it.

The model to copy is Angry Birds handing you one new bird at a known moment: you
can see it coming, and when it lands it is a specific named thing with a face.

So each cap step is announced as **one headline warrior**, not a list. Crossing
into 12 is "Karna joins your host", presented with the card, a glow and a sound.
The other 12-cost cards come with him, quietly, in the muster screen. One
ceremony, one name, one face.

Progression is linear, so the next name is always visible and always one step
away.

## Open, not yet decided

- The exact cap and budget curve. Rough intent: budget grows slowly (170 toward
  maybe 220 by level 50) and the per-card cap does the heavy lifting.
- Whether a lost run still pays anything toward rank beyond the one-level drop.
- AI strength per level. This is the real build: a ladder to 100 is only worth
  climbing if the opponent at 40 plays differently from the opponent at 4, and
  the AI currently has one setting.
- Where any of this is stored. Browser today; multiplayer and a leaderboard need
  a server and accounts.
