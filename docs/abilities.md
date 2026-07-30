# Sub-astra abilities: giving the bottom tier something to do

**The problem, measured:** 55 warriors at power 7 or below have no effect, no
ability, and nothing but a number. Four warriors in the entire game have an
ability at all, and three of those are the *same* ability ("Arrow Rain", -2 to
every enemy) pasted onto Arjuna, Bhishma and Ravana.

So the bottom half of every deck is interchangeable. This is the catalogue for
fixing that, sourced the same way the astras and the boons were: against the
full four-volume Ganguli, paragraph-level search, quoting rather than
paraphrasing.

**Design rule:** none of these are astras. An astra is a divine weapon invoked
by mantra. An ordinary shower of arrows is a good archer. Keeping that line
sharp is why the astra tiers mean anything, so everything here is an `ability`
(rides on a warrior, costs a turn, no deck slot) or a keyword, never a card.

**Why abilities and not more astra cards:** a deck is 19 slots. A minor weapon
competing with Bhishma for a slot loses every time. An ability rides on a
warrior you were already going to field, which is exactly what makes a
mid-tier warrior worth fielding. Spending a turn on one has to beat playing
another card, and that is what stops everybody having one from becoming noise.

---

## 1. BUFF YOUR OWN SIDE

### The named conches (Bhishma Parva XXV, the Gita's opening)

The single best "each character gets a signature" find in the sweep. Six
warriors, six named conches, one verbatim passage:

> And Hrishikesa blew (the conch called) **Panchajanya** and Dhananjaya (that
> called) **Devadatta**; and Vrikodara of terrible deeds blew the huge conch
> (called) **Paundra**. And Kunti's son king Yudhishthira blew (the conch
> called) **Anantavijaya**; while Nakula and Sahadeva, (those conches called
> respectively) **Sughosa** and **Manipushpaka**... And that blare, loudly
> reverberating through the welkin, and the earth, **rent the hearts of the
> Dhartarashtras**.

The effect is stated in the text: it breaks enemy morale. So a conch is a
**row-scale morale swing**, and each one is a named, non-interchangeable
signature. This alone de-cookie-cutters Nakula, Sahadeva and Yudhishthira.

| warrior | conch | suggested |
|---|---|---|
| Yudhishthira | Anantavijaya, "endless victory" | +2 to your weakest row |
| Nakula | Sughosa, "sweet-sounding" | +1 to your row, +1 more if Sahadeva is fielded |
| Sahadeva | Manipushpaka, "jewel-blossom" | mirror of the above |
| Bhima | Paundra, "the huge conch" | -2 to the enemy infantry row |
| Arjuna | Devadatta, "god-given" | already has Arrow Rain; conch is the alternative |

The twins already carry a `bond: twin` keyword, so the paired conches reinforce
something the cards already do.

### The lion-roar (simhanada)

**110 paragraphs.** The single most frequent act in the entire war and the game
does not have it. Ordinary, repeatable, and belongs to the mid-tier: a roar is
what you do when you have no divine weapon.

Mechanic: small buff to your own row, or a small debuff to the enemy row facing
you. Candidates: **Dhrishtaketu, Chekitana, Sankha, Kuntibhoja, Kekaya
Brothers** (all power 6-7 and currently blank).

---

## 2. NERF THE ENEMY

### "Deprived of his car" (rathaheena)

**69 paragraphs.** The most common *decisive non-kill* outcome in the war. A
warrior loses his chariot and must fight on foot or flee. It is not death, it
is demotion, and the game has three rows to express it with.

Mechanic: **move an enemy from Ratha to Padati**, and cost him 2 for fighting
on foot. BUILT as the `dismount` action, on Chitrasena and Vivimsati.

**It does not pay yet, and the measurement says why.** Bahlika blank measured
47.5%. Given an onPlay dismount he measured **39.3%**, and **42.8%** even after
the demotion was made to cost the victim power. Spending a card to move an
enemy is worse than spending it on nothing.

The cause is structural: **`seatPower` sums all three rows equally**, so a
warrior keeps every point of his power wherever he stands. Worse, shifting him
can HELP him, by carrying him out of a row you have debuffed and into one his
own side has buffed. Yudhishthira's conch buffs his foot row, so dismounting
into it is a gift.

So the prerequisite is real: **rows have to matter before row-movement can.**
Row capacity, row-specific bonuses, or reach. The verb is built, tested and
correct, and it is waiting on that. Recorded here so it is not rebuilt.

### Cutting the bow

**28 paragraphs**, and always the same beat: the bow is cut, the warrior stands
there useless, then "took up another bow" (28 more). It is a delay, not a kill.

Mechanic: the target contributes nothing next round, then recovers. The
`stupefied` flag already does exactly this (a stupefied unit scores 0 without
being hurt) and is currently used by one card.

Candidates: **Vinda and Anuvinda of Avanti** (always named as a pair, both
power 5, both blank), **Sudakshina of the Kambojas**.

### Cutting the standard

6 paragraphs, less common but distinct. A host that cannot see its banner
loses cohesion.

Mechanic: cancel an enemy row's bond/buff bonuses for the round. Aimed
squarely at the bond-heavy Asura and Upapandava lines.

---

## 3. ROW EFFECTS: the vyuhas

The named formations are in the text: **Makara** (crocodile), **Sakata**
(cart), **Krauncha** (heron), and the **Chakra-vyuha** that killed Abhimanyu.

These are the natural home for row-wide modifiers, and the game already has
`debuffRow` with `duration: 'round' | 'lingering'` doing nothing interesting.
A formation card or ability that shapes a whole row is more Gwent than another
point of power, and it is the one place a *low-power commander* can matter more
than a high-power hero.

Candidates: **Drupada, Virata, Kuntibhoja** (kings and commanders, power 6-7,
all blank). Let the kings shape rows and let the champions hit things.

---

## 4. COUNSEL: the ones who never fight

Already scoped in the earlier non-combatant work; this is where it lands
mechanically. The engine grew `discard`, `draw` and `denyPlay` for exactly this
and only Shakuni uses them.

| figure | canonical act | mechanic |
|---|---|---|
| **Uluka** | carried the message engineered to make peace impossible | the enemy cannot pass this round |
| **Sanjaya** | Vyasa's divine sight; narrated the war, unharmable | reveal the enemy hand; cannot be targeted |
| **Vidura** | the coded warning about the lacquer house | negate the next trap or hazard against you |
| **Kunti** | got Karna's promise to spare four of five brothers | name an enemy; he cannot target your other warriors |
| **Vikarna** | the ONE son who called the dice-hall wager void | cancel an enemy stratagem |

**Uluka already exists as a card with `effects: []`.** So does **Rukmi**, and so
does **Yuyutsu**. Three finished cards with good flavour text and nothing
behind them.

---

## 5. BOONS AND CURSES AT THE BOTTOM TIER

This is where the real spice is, because the epic gives *minor* characters
conditional invulnerabilities as readily as major ones.

### Srutayudha: the mace that kills its wielder (Drona Parva XCII)

The best low-tier card in the sweep, and he is a blank power-6 Kaurava today.
His mother begged Varuna to make him unslayable, and Varuna gave him a mace
with one condition, quoted exactly:

> "This mace should not be hurled at one who is not engaged in fight. If
> hurled at such a person, **it will come back and fall upon thyself**. O
> illustrious child, (if so hurled) it will then course in an opposite
> direction and slay the person hurling it."

He hurled it at Krishna, who had vowed not to lift a weapon. It rebounded and
killed him.

Mechanic: **cannot be destroyed, but if he ever targets a non-combatant he
destroys himself instead.** The game already has exactly one non-combatant, and
it is Krishna. A power-6 nobody who is invincible until he makes one specific
mistake is worth more design attention than another 8-power body.

### The Samsaptaka oath (Susharma of Trigarta)

Oath-bound warriors sworn to kill Arjuna or die, who swarmed him in hundreds of
thousands and pinned him away from the real battle:

> Those warriors in hundreds of thousands, approaching Arjuna, seemed to melt
> away like snakes at sight of Garuda. **Though slaughtered in battle, they did
> not still leave the son of Pandu** like insects, O monarch, never receding
> from a blazing fire.

Mechanic: **lock the enemy's strongest warrior.** He cannot use his ability or
be moved while the oath-bound stand. They die; that is the deal. **Susharma** is
power 6 and blank, and this is the only thing he is remembered for.

### Others worth building

- **Kripa**: chiranjivi, one of the immortals. Already has `deathless` in
  spirit but not on the card.
- **Alambusha and Alayudha**: rakshasa night-fighters, already carry
  `nightGrowth`. Give them a maya/illusion ability rather than more growth.
- **Raktabija**: every drop of spilled blood becomes a new demon. He is a
  vanilla power-5 doing nothing, and his legend IS a mechanic: spawn a copy
  when damaged. The single most wasted card in the game.

---

## Suggested build order

1. **The six conches.** Highest ratio of character to work, and it fixes
   Yudhishthira, Nakula and Sahadeva in one pass.
2. **Srutayudha and Susharma.** Two blank power-6 cards that become the most
   interesting cards in the Kaurava deck, with no new engine verbs.
3. **Raktabija's spawn.** Needs an on-damage trigger; the Asura deck's identity
   is illusion and multiplication and neither exists yet.
4. **"Deprived of his car."** Needs a row-move verb, which the engine lacks.
   New mechanic, broadly useful, worth the work.
5. **The counsel set**, starting with Uluka, who is already a card waiting.

Nothing above needs a new card type, and only items 3 and 4 need new engine
verbs. Everything else is data on cards that already exist.
