# Exploration findings

~43,000 games across three sampling strategies. Method in
[exploration-method.md](exploration-method.md); rerun with `npm run explore 4`.

---

## 1. Going first costs about six points, and it is not the cards

The cleanest result in the run, because it comes from **mirror matches**: two
identical decks, so the only thing that differs is who commits first.

| deck vs itself | first mover wins | penalty |
|---|---|---|
| Pandava | 41.7% (+/-2.7) | **-8.3** |
| Asura | 44.9% (+/-2.6) | **-5.1** |
| Kaurava | 45.7% (+/-2.6) | **-4.3** |
| | | mean **-5.9** |

All three intervals sit clear of 50%, so this is not noise. **A player handed
the first move loses about six points of win rate before a card is played.**

It also varies by deck, which is the interesting part. Pandava is punished
nearly twice as hard as Kaurava, and the likely reason is Krishna: his counsel
only fires in the deciding round, so a Pandava player wants to hold him, and
moving first means committing before seeing what to hold him for.

The balance lab had hinted at this (43.0% first-mover overall) but could not
separate "going first is bad" from "the decks are uneven", because it never
played a deck against itself. Mirrors settle it.

**Caveat before acting:** one card of hand advantage was measured earlier at
about +16 points, so the lever is far coarser than the 6-point gap. Any
compensation has to be finer than a card.

---

## 2. Averaging hid a lopsided matchup

Correcting each pairing for side order (a deck's true rate against another is
the mean of its first-mover rate and one minus the opponent's):

| matchup | true head-to-head |
|---|---|
| Pandava vs Kaurava | 49.2 / 50.8 — even |
| Kaurava vs Asura | 51.3 / 48.7 — even |
| **Pandava vs Asura** | **56.8 / 43.2 — lopsided** |

Not a rock-paper-scissors triangle, which is what I was looking for. Something
less obvious: **one badly uneven pairing, invisible in the aggregate** because
Asura's decent showing against Kaurava averages it away. `npm run sim` reports
these three decks within 1.8 points of each other and it is not wrong; it is
just answering a coarser question.

A player picking Asura and repeatedly drawing Pandava opponents is losing 57/43
and no aggregate number would ever tell them why.

---

## 3. The curated decks are genuinely good

**0 of 120 randomly generated legal decks beat the curated field** with a Wilson
interval clear of 50%.

| house | best random | median | mean | worst |
|---|---|---|---|---|
| Pandava | 46.3% | 23.3% | 26.0% | 7.9% |
| Kaurava | 56.3% | 28.3% | 31.2% | 16.3% |
| Asura | 50.0% | 21.7% | 23.4% | 7.9% |

The median random deck wins about a quarter of its games. Every sample was
legal: inside the 170 budget and holding no astra it could not invoke.

Two things follow. The curation is doing real work rather than three arbitrary
piles happening to be even. And there is no obviously broken build sitting
unassembled in the same provisions, which is the failure mode that would make
the balance work pointless.

The one to watch is that best Kaurava sample at **56.3%**, which failed the
significance test only marginally. Worth a longer look before assuming the
Kaurava list is optimal.

---

## 4. Pair "synergy" was measuring the wrong thing

The first pass ranked pairs by raw lift and produced this:

```
+22.2pp  kumbhakarna + ravana
+22.0pp  hiranyakashipu + ravana
+21.8pp  mahishasura + ravana
+21.2pp  narakasura + ravana
```

Four of the top six were Ravana pairs at near-identical lift. That is not four
synergies. That is Ravana, whose presence lifts any pair he is in.

The lab now reports **excess lift**: pair lift minus each card's own solo lift.
That isolates the interaction from the ingredients, and every Ravana pair
drops out of the ranking.

### Genuine synergies

| excess | pair | note |
|---|---|---|
| +6.7pp | Ashwatthama + Bahlika | |
| **+6.5pp** | **Hiranyakashipu + Mahishasura** | both raised to astra-mastery 2 today |
| +6.1pp | Drupada + Ghatotkacha | |
| +6.0pp | Mahishasura + Vritra | |
| +5.9pp | Bhagadatta + Duryodhana | |

The Hiranyakashipu/Mahishasura result is today's mastery change showing up as a
measured interaction: two wielders means the deck's four tier-2 astras are
reliably castable rather than stranded.

### Genuine anti-synergies, and the pattern in them

| excess | pair | solo lifts |
|---|---|---|
| -9.3pp | **Bhishma + Drona** | +11 / +3 |
| -9.0pp | **Arjuna + Shikhandi** | +14 / -2 |
| -8.0pp | Dhrishtadyumna + Sahadeva | +10 / -1 |
| -7.2pp | Raktabija + Tarakasura | 0 / -6 |
| -6.9pp | Dhrishtadyumna + Dhrishtaketu | +10 / -1 |
| -6.7pp | Bhishma + Jayadratha | +11 / +6 |

**Four of the six worst pairs contain a top card.** Bhishma and Drona are the
two strongest Kaurava warriors and together they underperform by 9 points.

That is overcommitment, and it means the game has the card economy it was
supposed to have. A round only needs to be won by one point; two big cards in
the same round win it by twelve and waste the surplus, in a format where the
cards you keep decide the next round. The right play is to win narrowly and
bank, and both the AI and any player will lose value by stacking strength.

Arjuna + Shikhandi is the sharpest case. Arjuna alone is +14. Add Shikhandi and
the pair is +2.6. Shikhandi exists to answer Bhishma and does almost nothing
otherwise, so spending a turn on him beside Arjuna throws away a commitment.

---

## What I would do with this

1. **Pandava vs Asura at 56.8/43.2** is the one real balance problem the run
   found, and it was invisible before. Fix that pairing rather than the
   aggregate.
2. **Leave the first-mover gap alone until the lever gets finer.** It is real
   and it is six points, but the only compensation measured so far is worth
   sixteen.
3. **Shikhandi needs a floor**, the same lesson the bottom-tier pass produced:
   a purely situational card is worse than a blank one, because it costs a
   commitment in the games where its condition never arrives.
4. **Re-examine the best random Kaurava deck** at 56.3% before treating the
   curated list as settled.

## Known limits of this run

- Pair data comes from first-mover games only (`played` records one seat), so
  the interaction numbers carry the first-mover bias described above.
- Random decks are sampled uniformly from the legal region, which is not how a
  player builds. It answers "is there an obvious broken deck", not "what is the
  best deck".
- Everything here is one-ply greedy AI against itself. It measures the decks,
  not the fun.
