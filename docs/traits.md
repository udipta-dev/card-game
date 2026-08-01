# Character traits: the frame, and the first tranche

Every warrior gets a trait drawn from something he actually did. The greater
ones get several and you **choose one when you commit him**. This document is
the frame plus the first twelve; the remaining sixty-nine follow the same rules.

---

## 1. Why modal is the right design, and not just a nice one

Three measurements this week produced a hard rule:

| card | blank | given a situational trait | with a floor under it |
|---|---|---|---|
| Bahlika | 47.5% | **39.3%** | 42.8% |
| Vikarna | 43.6% | **36.4%** | 44.3% |
| Nakula | 38.2% | n/a (unconditional) | **51.3%** |

A situational trait made a card **worse than blank**. Not useless, worse: a game
runs 2.45 rounds so you never get to wait for the moment, and the AI played the
card at times it otherwise would not because the trait scored well in the
minority of games where it applied.

**Choosing the trait at deploy dissolves that.** A trait that only matters
against Bhishma is never *chosen* in a game with no Bhishma; you take the other
mode instead. So the whole class of card that measurement rejected becomes
buildable, and the sharp, specific, deeply canonical traits are exactly the ones
that were previously unshippable.

That is the real prize here. Not flavour. It unlocks the good half of the lore.

## 2. The budget

**Options are themselves power.** Three modes beat one mode even when every mode
is individually identical, because you always take the best one available. So
the count scales with rank and each individual mode stays modest.

| power | modes | each mode worth about |
|---|---|---|
| 9-10 | 3 | a small effect |
| 7-8 | 2 | a small effect |
| 5-6 | 1 | a small effect |
| 2-4 | 1 | a marginal effect |

A mode on Arjuna should NOT be bigger than a mode on Shikhandi. Arjuna's
advantage is that he has three of them and always gets to pick the right one.
Getting this backwards is how a top-tier card becomes unanswerable.

**What each already carries counts against the budget.** Karna is full at 3/3
(armour, the final-round curse, the wheel). Ghatotkacha is full at 2/2. The
audit table in the commit for this doc lists all 81 with their current load.

## 3. The classes

- **DEPLOY** fires once on arrival. Most traits.
- **STANDING** is always on while he lives. Armour, deathless, growth.
- **VOW** is conditional on a named foe or moment. The class modality unlocks.
- **GUARD** protects himself or his line rather than attacking.
- **COUNSEL** touches hands and decks rather than the board.

---

## 4. Tranche one: the twelve at power 9 and 10

Each entry lists what the card already has, then the candidate modes. Every one
is sourced; nothing here is invented.

### Bhishma — 10, has icchamrityu + Arrow Rain (2/3)

**He will not raise his bow to a woman.** Duryodhana's own message to Shikhandi,
verbatim: *"Ganga's son will not slay thee, knowing thee to be only a female.
Fight now without any fear."* His existing icchamrityu covers being unkillable;
this is the other half, and it is a **VOW**: he cannot damage a named enemy.

### Drona — 9, has immuneUntilPlayed (1/3)

**Preceptor of both hosts.** *"He that is a preceptor of both Vedic lore and
bowmanship... that commander of armies."* He taught every warrior on both sides,
which is a real mechanic: a **VOW** that he will not strike a warrior he
trained, or a **DEPLOY** that weakens one.

**The chakravyuha.** He built the formation nobody could leave. A row-shaping
**DEPLOY**, and the natural partner to Abhimanyu's existing trap.

### Karna — 10, FULL at 3/3

Armour, Parashurama's curse, the wheel. No room, and he does not need it.

### Arjuna — 10, has Arrow Rain (1/3)

**Brihannala.** *"I shall appear as one of the third sex, Vrihannala by name...
and thus conceal myself."* A year hidden in plain sight in Virata's palace. A
**GUARD**: he cannot be targeted the round he arrives.

**The Kirata combat.** He fought Shiva to a standstill in disguise and was given
the Pashupata for it. A **VOW** against the strongest enemy.

### Bhima — 9, has the thigh vow (1/3)

**The strength of ten thousand elephants**, stated in those words. A **STANDING**
trait: he is not reduced below a floor, or he grows in the elephant row.

**The vow of the blood.** He swore to drink Dushasana's, and did. A **VOW**
keyed to that one enemy, which is exactly the modal case: dead against Asura,
decisive against Kaurava.

### Duryodhana — 9, has diamond-body (1/3)

**Balarama's pupil at the mace**, the equal of Bhima, which is why their duel had
to be settled by a foul. A **VOW**: in a mace duel he beats anyone but Bhima.

### Bhagadatta — 9, has a deploy strike (1/3)

**His eyelids bound up with a cloth** so age would not blind him, and Arjuna
killed him by cutting the band. A **STANDING** trait with a written weakness,
which is the loophole shape the Asura research recommends.

**Supratika**, the great elephant. A **GUARD** in the Gaja row.

### Ravana — 10, has armour + Arrow Rain (2/3)

**The ten heads**, cut off and regrown as fast as Rama could take them. A
**STANDING** regeneration, and the single most recognisable thing about him.

### Indrajit — 10, has invisibility (1/3)

**Conqueror of Indra**, the only being who beat the king of the devas. A **VOW**
against divine weapons.

**The unfinished sacrifice.** He could not be killed until Lakshmana broke up the
rite that renewed him. A **GUARD** with a condition.

### Hiranyakashipu — 9, has armour (1/3)

**The boon**, in full: not man nor beast, not day nor night, not indoors nor out,
on no ground, by no weapon. The purest loophole in either epic. A **STANDING**
invulnerability with a named exception, and the template for the whole class.

### Jarasandha — 9, has icchamrityu-vs-Bhima (1/3)

**Made of two halves.** *"Jarasandha had been made up of two halves of one child.
And because it was Jara that had united those two halves..."* Bhima killed him by
tearing him apart and throwing the pieces in opposite directions. A **STANDING**
trait: he reassembles unless split.

### Barbarika — 10, has a deploy (1/3)

**Three arrows** that would end any war, and Krishna took his head as charity so
he would not have to use them. He watched the whole battle from a hill. A
**COUNSEL** or a **GUARD**: present, seeing everything, forbidden to act.

---

## 5. What this needs from the engine

A **modal deploy**: the card offers its modes when committed and the player picks
one. That is new. The pieces exist (`PLAY_CARD` already carries `targets`, and
the astra counter-prompt already suspends play for a decision), so the shape is
a `mode` field on the action plus a chooser in the UI.

Until that exists, none of this can ship, because the whole design rests on the
choice. Building traits first and the chooser later would reproduce exactly the
situational-card problem the measurements rejected.

## 6. How the remaining sixty-nine get done

Same order as this tranche: highest power first, decks before roster, and one
sourced quotation per trait or it does not go in. The audit table gives each
warrior's current load and remaining budget, so the work is bounded and can stop
and resume cleanly.

---

## Appendix: the whole roster, with room remaining

Generated, not hand-kept. `have` counts keywords + effects + ability.

| power | warrior | in a deck | has | budget | room |
|---|---|---|---|---|---|
| 10 | arjuna | yes | 1 | 3 | **2** |
| 10 | barbarika | - | 1 | 3 | **2** |
| 10 | bhishma | yes | 2 | 3 | **1** |
| 10 | indrajit | yes | 1 | 3 | **2** |
| 10 | karna | yes | 3 | 3 | 0 |
| 10 | ravana | yes | 2 | 3 | **1** |
| 9 | bhagadatta | yes | 1 | 3 | **2** |
| 9 | bhima | yes | 1 | 3 | **2** |
| 9 | drona | yes | 1 | 3 | **2** |
| 9 | duryodhana | yes | 1 | 3 | **2** |
| 9 | hiranyakashipu | yes | 1 | 3 | **2** |
| 9 | jarasandha | - | 1 | 3 | **2** |
| 8 | abhimanyu | yes | 1 | 2 | **1** |
| 8 | ashwatthama | yes | 1 | 2 | **1** |
| 8 | balarama | - | 1 | 2 | **1** |
| 8 | bhurishravas | yes | 0 | 2 | **2** |
| 8 | dhrishtadyumna | yes | 1 | 2 | **1** |
| 8 | ekalavya | - | 0 | 2 | **2** |
| 8 | kumbhakarna | yes | 2 | 2 | 0 |
| 8 | satyaki | yes | 0 | 2 | **2** |
| 8 | shalya | yes | 1 | 2 | **1** |
| 8 | sweta | yes | 1 | 2 | **1** |
| 7 | alayudha | - | 2 | 2 | 0 |
| 7 | bali | yes | 1 | 2 | **1** |
| 7 | chekitana | - | 0 | 2 | **2** |
| 7 | dhrishtaketu | - | 0 | 2 | **2** |
| 7 | drupada | yes | 1 | 2 | **1** |
| 7 | ghatotkacha | yes | 2 | 2 | 0 |
| 7 | kripa | - | 1 | 2 | **1** |
| 7 | kritavarma | - | 1 | 2 | **1** |
| 7 | mahishasura | yes | 0 | 2 | **2** |
| 7 | narakasura | yes | 1 | 2 | **1** |
| 7 | shishupala | - | 1 | 2 | **1** |
| 7 | shumbha | yes | 1 | 2 | **1** |
| 7 | virata | - | 1 | 2 | **1** |
| 7 | vrishasena | - | 1 | 2 | **1** |
| 7 | vritra | yes | 1 | 2 | **1** |
| 7 | yudhishthira | yes | 1 | 2 | **1** |
| 6 | alambusha | - | 2 | 1 | 0 |
| 6 | bahlika | yes | 0 | 1 | **1** |
| 6 | dushasana | yes | 0 | 1 | **1** |
| 6 | hiranyaksha | yes | 1 | 1 | 0 |
| 6 | iravan | - | 0 | 1 | **1** |
| 6 | jalasandha | - | 0 | 1 | **1** |
| 6 | jayadratha | yes | 1 | 1 | 0 |
| 6 | kekaya_brothers | - | 0 | 1 | **1** |
| 6 | kuntibhoja | - | 0 | 1 | **1** |
| 6 | nakula | yes | 2 | 1 | 0 |
| 6 | nishumbha | - | 1 | 1 | 0 |
| 6 | rukmi | - | 0 | 1 | **1** |
| 6 | sahadeva | yes | 2 | 1 | 0 |
| 6 | sankha | - | 1 | 1 | 0 |
| 6 | somadatta | - | 0 | 1 | **1** |
| 6 | srutayudha | - | 2 | 1 | 0 |
| 6 | sudakshina | - | 0 | 1 | **1** |
| 6 | susharma | - | 0 | 1 | **1** |
| 6 | tarakasura | yes | 1 | 1 | 0 |
| 5 | anjanaparvan | - | 2 | 1 | 0 |
| 5 | anuvinda | - | 2 | 1 | 0 |
| 5 | chitrasena | - | 2 | 1 | 0 |
| 5 | durmukha | - | 1 | 1 | 0 |
| 5 | prahlada | yes | 0 | 1 | **1** |
| 5 | prativindhya | - | 1 | 1 | 0 |
| 5 | raktabija | yes | 2 | 1 | 0 |
| 5 | shatanika | - | 1 | 1 | 0 |
| 5 | shikhandi | yes | 1 | 1 | 0 |
| 5 | shrutakarma | - | 1 | 1 | 0 |
| 5 | shrutasena | - | 1 | 1 | 0 |
| 5 | sutasoma | - | 1 | 1 | 0 |
| 5 | uluka | - | 0 | 1 | **1** |
| 5 | uttamaujas | - | 1 | 1 | 0 |
| 5 | vikarna | yes | 1 | 1 | 0 |
| 5 | vinda | - | 2 | 1 | 0 |
| 5 | vivimsati | - | 2 | 1 | 0 |
| 5 | yudhamanyu | - | 1 | 1 | 0 |
| 5 | yuyutsu | - | 1 | 1 | 0 |
| 4 | uttara | - | 1 | 1 | 0 |
| 3 | shakuni | yes | 1 | 1 | 0 |
| 2 | asura_horde | - | 1 | 1 | 0 |
| 2 | kaurava_infantry | - | 0 | 1 | **1** |
| 2 | pandava_infantry | - | 0 | 1 | **1** |

**48 of 81 warriors have room for at least one more trait.**
