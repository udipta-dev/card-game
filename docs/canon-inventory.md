# Canon inventory: what exists, what we have, what we invented

Sourced against Ganguli's Mahabharata (Gutenberg 15474-15477, the complete
four-volume set) and Valmiki's Ramayana (valmikiramayan.net Sanskrit + gloss,
cross-checked against Griffith, Gutenberg 24869). Both grepped in full locally.
No wikis, no listicles: those are exactly where invented astras come from.

Status: **astras done. shastras done. boons and curses done** (section 9).

> **Method note, and it matters.** Ganguli's text is hard-wrapped at ~72
> columns, so a plain `grep 'Gandhari' | grep 'curse'` finds almost nothing:
> the two words land on different physical lines. An earlier pass concluded
> Gandhari's curse on Krishna "returns zero hits across all four volumes". It
> is in fact right there in Stri Parva XXV, quoted in full below. Anything
> researched with line-oriented grep on this corpus should be assumed wrong
> until re-run. The corpus is now rebuilt one-paragraph-per-line first
> (`tr -d '\r'` then awk `RS=""`, since the files are CRLF and paragraph mode
> silently collapses otherwise), and searched with proximity queries.

---

## 1. Corrections to the 14 astras we already ship

Four of these matter enough to change cards.

### Nag-Astra does not exist under that name

There is no "nagastra" in the Mahabharata. Karna's famous serpent-arrow is the
snake **Aswasena** hiding inside an ordinary shaft, and Shalya tells him to pick
a different arrow. The weapon the epic actually calls **Naga** *binds the legs*
(Karna Parva 53) - snakes encircle the lower limbs. It does not fly at one target
and kill him.

**So a snake card should bind, not burn.** This independently confirms the
instinct that hard removal was too high-tier for it.

### Garud-Astra does not exist either

Not a name in either epic. The real weapon is **Sauparna**, and it is the
textual answer to Naga: birds descend and devour the snakes. In the Ramayana,
**Garuda arrives in person** to free Rama and Lakshmana - the bird is the
answer, not a weapon.

### Sammohan-Astra: right family, wrong effect and wrong owner

It is **Indra's** (Virata Parva LXV), and it *stupefies* - the enemy's weapons
drop from their hands. It is not sleep.

Sleep is **Praswapa**, a different weapon owned by Prajapati and forged by
Twashtri, and it has a named waking counterpart, **Samvodhana**. Bhishma
received both from eight Brahmanas in a dream.

There are in fact three separate stupefaction weapons, not one word:
Mahabharata **Sanmohana** (Indra), Mahabharata **Pramohana**, Ramayana
**Mohana** (Gandharva-presided).

### Vasavi Shakti has a real, textual drawback we are not using

Indra states that if Karna hurls it while he still has other weapons and his
life is not in immediate peril, **"it will fall even on thyself."**

That is a ready-made mechanic straight from the text: fire it early and it
kills you instead.

### Smaller corrections

- **Brahmashirsha** came to Drona from **Agastya**, not Brahma directly, and the
  standing order is that it is never to be used against human beings.
- **Narayanastra**'s strength scales with resistance. Standing still and
  disarmed is total immunity; fighting back is certain death.
- **Pashupata** is also called **Raudra** at the moment Shiva grants it. Shiva's
  restriction: never against anyone of small energy, or it consumes the universe.
- **Vaishnava** was hurled as a **hook** (ankusha), and it is not countered so
  much as *absorbed* - Krishna takes it on his chest, where it becomes a garland.

Everything else in our 14 checks out.

---

## 2. The counter web, entirely sourced

A rock-paper-scissors layer the text hands us for free.

| attack | answer | citation |
|---|---|---|
| Naga (leg-binding) | **Sauparna** (birds eat the snakes) | Karna P. 53 |
| Agneya | Varuna | Drona P. XCVII, Karna P. 91 |
| Varuna's clouds and darkness | Vayavya | Karna P. 91 |
| Vayavya | **Guhyaka** (Kubera's) | Udyoga P. CLXXXIII |
| Brahmastra | Aindra, or another Brahmastra | Karna P. 90 |
| Pramohana | **Prajna** (restores the senses) | Bhishma P. LXXVII |
| Sammohana | Prajna | Virata P. LXV + n.101 |
| Praswapa (sleep) | **Samvodhana** (waking) | Udyoga P. CLXXXVI |
| **Narayanastra** | **submission** - drop every weapon and dismount. Resisting even in thought kills you | Drona P. CC |
| everything, including Brahmastra | **Brahma-danda**, Vasishtha's staff, swallows them all | Ram. Bala K. 56 |
| everything | **Pashupata**, "superior to the Brahma, the Narayana, the Aindra, the Agneya, and the Varuna weapons" | Anusasana P. XIV |

---

## 3. Five ways a mortal earns a weapon, all textual

Our game has exactly one route (tapasya). The epic has five, and they are all
mechanically distinct.

| verb | example |
|---|---|
| **taught by a master** | Brahmashira: Drona to Arjuna. Bhargava: Parashurama to Karna. Brahmashira: Agastya to Drona |
| **won in a duel** | Pashupata: Shiva, after the Kirata combat |
| **pilgrimage / audience** | Yama's mace, Varuna's nooses, Kubera's Antardhana - Arjuna on Himavat |
| **traded** | Vasavi Shakti: Karna's armour and earrings to Indra |
| **received in a dream** | Praswapa and Samvodhana: eight Brahmanas to Bhishma |
| **inherited** | Vaishnava: Vishnu to Bhumi to Naraka to Bhagadatta |

---

## 4. Mahabharata astras we do NOT have

Every one HIGH confidence unless marked.

| name | source | effect |
|---|---|---|
| **Vajra** | Indra | thunderbolt; shatters a conjured mountain |
| **Twashtra** | Twashtri | spawns thousands of duplicates; foes kill each other |
| **Praswapa** | Prajapati, forged by Twashtri | sleep without killing |
| **Samvodhana** | paired | wakes whoever Praswapa felled |
| **Prajna** | - | restores consciousness, dispels bewildering illusion |
| **Pramohana** | - | warriors swoon |
| **Antardhana** | **Kubera** | vanishing (Adi P.) / sleep (Vana P.) - Ganguli contradicts himself |
| **Guhyaka** | Kubera's Guhyakas | quenches Vayavya |
| **Yamya** | Yama | in Drona's volleys |
| **Yama's mace** | Yama, to Arjuna | "incapable of being baffled" |
| **Varuna's nooses** | Varuna, to Arjuna | bind; thousands of Daityas seized |
| **Raudra** | Rudra | Ashwatthama kills with it |
| **Sauparna** | Garuda | birds devour serpents |
| **Gandharva** | the Gandharva **Tumvuru** | user appears as one, then a hundred, then a thousand |
| **Aishika** | Brahmashira on a blade of grass | strikes the embryo in Uttara's womb |
| **Sthunakarna** | - | destroys a weapon in flight |
| **Jyotishka** | - | dispels magical darkness |
| **Aditya** | Surya | dries up conjured water |
| **Saura / Savitra** | Surya / Savitr | |
| **Saumya** | Soma | |
| **Parjanya** | rain-god | creates clouds |
| **Bhauma** | Earth | creates land |
| **Parvatya** | - | brings mountains into being |
| **Asmavarsha** (MED) | - | shower of stones |
| **Prajapatya** | Prajapati | |
| **Indrajala** (MED) | Indra | illusion-net |
| **Saiva** (MED) | Shiva | named only in a boast |

---

## 5. The Ramayana catalogue (Bala Kanda 27)

Vishvamitra's bestowal on Rama - the densest astra list in either epic, ~60
names. Verified name-for-name between the Sanskrit and Griffith.

**Discs:** Danda, Dharma, Kala, Vishnu, Aindra chakras.
**Nooses:** Dharma-pasha, Kala-pasha, Varuna-pasha.
**Paired bolts:** Shushka (drier) and Ardra (drencher).
**Maces:** Modaki, Shikhari, Kankala, Kapala, Kankana.
**State-changers:** Mohana, **Prasvapana**, **Prashamana**, **Varshana**,
Shoshana, Santapana, Vilapana, **Madana** (Kama's), **Manava** (Manu's),
Paishacha, Tamasa, Saumana, Samvarta, Mausala, Satya, Mayamaya.
**Luminaries:** Teja-prabha (steals brilliance), **Shishira** (Moon's, cooler).
**Others:** Hayashira, Krauncha, two Shaktis, Vaidyadhara, the sword Nandana,
Tvashtra/Sudamana, Bhaga's missile, Shiteshu.

**Bala Kanda 28** is the *withdrawal* set: fifty "sons of Krishashva" whose
whole job is to check and recall the above. That is a counter-deck, not an
offensive list.

**Bala Kanda 55-56:** Vishvamitra hurls the same arsenal at Vasishtha, and the
Sanskrit explicitly includes **paashupata** - so Pashupata *is* in the Ramayana,
which a Griffith-only search would miss.

---

## 6a. POLICY: three buckets, not one refuse list

The original framing conflated "this is miscategorised" with "this is fake".
Those are different problems and only one of them is a reason to leave a thing
out.

**Bucket 1 - USE, as a shastra.** Real, important, just not mantra-invoked
missiles. All three belong in the game.

| thing | what it actually is |
|---|---|
| **Anjalika** | the broad-headed arrow that **beheads Karna**. One of the epic's decisive moments. It is an arrow, not an astra, so it is a shastra card |
| **Sudarshana** | summoned by thought, thrown by hand, returns to the hand. Handheld |
| **Nagapasha** | Indrajit's serpent-noose. Real, just Ramayana-only rather than Mahabharata |

**Bucket 2 - USE, under the real name.** Every popular invented name has a
genuine weapon behind it. Nothing is lost by using the real word.

| the internet's name | the actual weapon | source |
|---|---|---|
| Suryastra | **Aditya** (dries conjured water), **Saura**, **Savitra** | Drona P. XXVIII |
| Chandrastra / Somastra | **Saumya**; Ramayana **Shishira**, the Moon-god's | Vana P. CCXLIII |
| Kaalastra | **Kala-chakra**, **Kala-pasha** | Ram. Bala K. 27 |
| Sailastra | **Parvatya** (raises mountains), **Asmavarsha** (stone-shower) | Adi P. CXXXVII |
| Kandarpastra | **Madana**, of Manmatha | Ram. Bala K. 27 |
| Mrityuastra | **Yamya**, and Yama's mace | Drona P. CLVI |
| Sarpastra | **Naga** (binds the legs) | Karna P. 53 |

**Bucket 3 - DO NOT USE.** Fake name *and* fake effect.

- **Mohini astra.** Zero occurrences in either epic, and the "dispels maya"
  description attached to it online is itself invented.
- **Kartikeya / Skanda has no astra.** Do not invent one for him.

There is no scarcity forcing the issue: ~27 unused Mahabharata astras and ~60
more in the Ramayana are sitting in the sections above. Nothing needs filling
with a made-up name.

If we ever DO adopt a popular name because players will recognise it, that
should be a deliberate call recorded here, the way the maharathi ladder
divergence is recorded on the Tier type - not something that happens by
accident.

---

## 6b. Reference: names absent from both epics

Do not add these, however many results a search returns.

**Mohini astra** (zero hits; the "dispels maya" description is invented),
**Sailastra**, **Kandarpastra**, **Mrityuastra**, **Kaalastra**, **Suryastra**,
**Chandrastra / Somastra**, **Shivastra**, **Sarpastra**, **Adityastra**,
**Indrastra** as a distinct name, and **Nagapasha in the Mahabharata** (it is
Ramayana-only, Indrajit's).

Two specific traps:

- **Anjalikastra is not an astra.** In Ganguli, *anjalika* is a class of
  broad-headed arrow, glossed in his own note as "broad-headed shafts". The
  thing that beheads Karna is an arrow.
- **Sudarshana is not an astra.** It is summoned by thought, thrown by hand, and
  returns to the hand. It belongs with the shastras. (Though Bala Kanda 27 does
  hand Rama a **Vishnu-chakra** as an astra, so disc-as-astra is textual - just
  not under that name.)

**Kartikeya / Skanda has no astra at all.** Zero. Do not invent one.

---

# Boons and curses

Ganguli via Gutenberg 15474-15477, Valmiki via Griffith 24869, all grepped in
full. Every debunk re-checked on whitespace-normalised text, because the corpus
hard-wraps at ~72 chars and that silently breaks phrase searches.

## 7. A card we ship is built on an episode that is not in the epic

**`gandhari_gaze` — Gandhari's adamantine gaze. DENIED.**

Zero hits across all four volumes for adamant, blindfold, bandage, naked, gaze
or loins in that combination. There is no episode where Duryodhana comes to his
mother naked or leaf-clad and she hardens his body with a look.

What *is* there: she blindfolds herself **at her marriage, out of devotion**
(Adi CX), and her single gaze-power scene targets **Yudhishthira's toe** in the
Stri Parva.

The vajra-torso claim is real but comes from **the Danavas' speech** talking
Duryodhana out of suicide (Vana CCL) - it is a character's assertion, not the
narrator's. Combined with Bhima's vow over the bared thigh and **Maitreya's
curse**, that trio is what Krishna himself cites to justify the foul blow. That
is the honest version of the card.

## 8. Two design rules the epic follows, and we do not

**Boons cannot be renegotiated once uttered.** Draupadi, Drupada and Ravana all
ask for an amendment and are refused in near-identical words: *"It will not be
otherwise."* **But a third party can add limits.** Indra caps Urvasi's curse,
Kubera makes Sthuna's swap permanent, the Yakshas negotiate a termination
trigger. That asymmetry is a clean rules primitive we are not using.

**The answer to an invulnerable thing is almost never a bigger weapon.** It is a
disarm, a legalism, or a targeting restriction. Krishna's own list of engineered
kills (Drona CLXXXI) names Jarasandha, Ghatotkacha, Ekalavya and Sisupala
together as removals accomplished *"by the employment of means."*

This cuts directly against an astra arms race. The epic's climaxes are
loopholes, not damage numbers.

## 9. The best loopholes, ranked by how cleanly they become rules

1. **Sunda and Upasunda.** Brahma **refuses** immortality and makes them name
   their own death clause. They choose "no fear from any created thing... except
   only from each other", and Tilottama exists purely to trigger it. The
   Hiranyakashipu archetype, fully inside the Mahabharata. (Adi CCXI-CCXIV)
2. **Ravana.** Immune to Gandharvas, Celestials, Kinnaras, Asuras, Yakshas,
   Rakshasas and Serpents - **humans omitted, out of contempt**. The omission is
   the entire plot.
3. **Bhishma.** Unkillable by boon, so his death attacks the **vow** instead: he
   will not shoot a woman, one formerly a woman, one feminine-named, or one
   feminine-formed. He hands his enemies the exploit himself.
4. **Drona.** Binary. Armed, unslayable by gods; disarmed, "capable of being
   slain even by human beings". The trigger is **social** - bad news "from some
   one of credible speech" - which is why the honest man had to be the liar.
5. **Jarasandha.** Weapon-immune, so the answer is bare hands after his mace is
   taken away.
6. **Duryodhana.** Vajra above, flowers below. Immunity that names its own weak
   point.
7. **Jayadratha.** Checks four Pandavas, **excludes Arjuna**, and in the Vana
   wording only once.
8. **Karna's dart.** One use, auto-kill, returns to Indra. Plus the misfire
   clause: thrown while other weapons remain and his life is not in peril, "it
   will fall even on thyself."
9. **Indrajit.** Invincible only while his daily fire sacrifice is complete.
   Killed in the window, on Vibhishana's insider tip.
10. **Bali.** Undefeatable by force, undone by honouring his own promise.

## 10. Curses that are ongoing STATE, not one-off events

The whole list models as persistent effects rather than instant damage.

| what | shape |
|---|---|
| **Yayati** | the only literally **transferable** curse: "thou mayst transfer this thy decrepitude to whomsoever thou likest". Needs consent, pays the transferee the throne, and he curses each son who refuses. A complete trading mechanic as written |
| **Maitreya on Duryodhana** | conditional and **voidable by an action**: null if he makes peace. An ongoing threat the player can cancel by changing behaviour |
| **Arjuna / Urvasi** | untermed curse, then Indra rewrites it: fixed one year, **deferred activation**, guaranteed expiry, valence flipped. A timed buff disguised as a debuff |
| **Ashwatthama's gem** | removable equipment granting immunity to weapons, disease, hunger, gods, nagas, rakshasas. Physically changes hands to Yudhishthira |
| **Ashwatthama's curse** | **finite: 3,000 years.** Not immortality |
| **Shikhandi / Sthuna** | duration-limited swap with mandatory return, overridden to permanent by Kubera, reverting on death. Three-layer state |
| **Amba** | persists **across death and rebirth with memory intact**, plus a second delay after birth |
| **Karna's two curses** | both dormant, firing on triggers: the hour of death, fear in battle, facing an equal |
| **Gandhari on Krishna** | a 36-year timer |
| **Vrishni iron bolt** | the countermeasure **fails** - ground to powder, it returns as eraka grass. Models as un-dispellable |
| **Kumbhakarna** | a recurring six-off, one-on cycle |
| **Bhishma** | targeting restriction (passive rule) plus death suspended through the solstice, 58 nights on the arrow bed |

## 11. Refuse list, boons and curses

All re-verified on normalised text.

- **Gandhari's adamantine gaze** (see above)
- **Barbarika / Khatushyam and the three arrows** - zero occurrences of the name
- **Shakuni's dice made from his father's bones**, or any dice boon. Ganguli
  gives plain skill: *"I am skillful at dice. There is none equal to me."*
- **Draupadi's "blind son of a blind man."** Zero. In Sabha XLVI it is Bhima,
  Arjuna, the twins and the servants who laugh. Draupadi is not even present
- **Abhimanyu learned the chakravyuha in the womb.** Not in Ganguli - flat
  statement that the lesson was incomplete
- **Ashwatthama immortal / chiranjivi.** The curse is finite
- **Kripa's immortality.** Not found
- **Kunti's mantra usable four times.** **No number exists in Ganguli.** The cap
  is social, imposed by Kunti on Madri
- **Karna cursed by the Earth goddess.** Earth is only the instrument of the
  brahmana's curse
- **Jarasandha: throw the halves apart or they rejoin.** Not in Ganguli
- **Vali's half-strength boon.** Not in Griffith or Ganguli
- **Arjuna chose which year to spend the curse.** Indra fixes the timing
- **Saraswati twisting Kumbhakarna's tongue.** Only in Griffith's prose
  *appendix*, not the Valmiki verse
- **Hiranyakashipu's loophole is real but PURANIC** (Bhagavata 7.3), not epic.
  Label it rather than presenting it as Mahabharata

---

## 12. Parked for later

**The dharma system.** A morality layer - acts of adharma carrying weight beyond
a single battle. Nothing built yet. The material for it is already in this
document: the Brahmastra as an act of adharma, Karna's chariot-wheel curse
firing on fear, Maitreya's curse voidable by making peace, Bhishma's targeting
vows, and Krishna's own list of kills accomplished "by the employment of means".
The epic's whole moral architecture is a rules system waiting to be written.

---

# Shastras: the named physical weapons

Full Ganguli (15474-15477), Griffith's Ramayana (24869) and Wilson's Vishnu
Purana, grepped locally with a script resolving every line number to its
Book/Section heading.

## 13. The surprise: named weapons are RARE

A systematic sweep for "mace/discus/sword/dart **called** X" across all
eighteen books returns exactly **three**: Kaumodaki, Sudarsana, Kausika. Add
the named bows and the handful below and you have close to the complete set.

We assumed this list would be long. It is not. Which is good news: a dozen
legendary named arms is a clean, ownable content type, not a sprawl.

| weapon | type | owner | how obtained |
|---|---|---|---|
| **Gandiva** | bow | Arjuna | created by Brahman, owned by Varuna, procured by **Agni** at Khandava with two inexhaustible quivers |
| **Vijaya** | bow | **Karna** (disputed, see below) | Viswakarman made it for Indra, Indra to Parashurama, Parashurama to Karna |
| **Sarnga** | bow | Vishnu, held by Krishna | won when he slew Naraka |
| **Pinaka** | bow | Shiva | **no origin given anywhere.** Explicitly distinct from his trident |
| **Ajagava** | bow | Prithu, later Mandhata | appeared spontaneously the day Mandhata gained all knowledge |
| **Asi** | **the primordial sword** | Manu, then a 30-king succession down to the Pandavas | see below |
| **Nandaka** | sword | Vishnu | taken from the demon Loha, whose body became the material of earthly weapons (Agni P.) |
| **Chandrahasa** | sword | Ravana | Shiva, after the Kailasa-lifting. **Uttara Kanda 16** - absent from Griffith, who omits that book entirely |
| **Kausika** | sword | Sahadeva | no origin; snatched back from Jatasura |
| **Sudarsana** | discus | Krishna | **handheld and thrown, returns to the hand.** Agni at Khandava; Shiva claims to have made it (Anusasana XIV); Vishvakarman ground it from the Sun (VP 3.2) |
| **Kaumodaki** | mace | Krishna | **Varuna** at Khandava; "a roar like that of the thunder" |
| **Parasu** | axe | Shiva to Parashurama | Shiva's own axe. His epithet **Khandaparasu** commemorates parting with it |
| **Vajra** | **handheld and hurled, not an astra** | Indra | **Twashtri forged it from the bones of the Rishi Dadhicha**, who renounced his body for it |
| **Antarddhana** | named weapon | Kubera to **Arjuna** | Kubera's own favourite; what Shiva shot to destroy Tripura |
| **Saunanda** | club | Balarama | Puranas only; summoned at will |
| **Panchajanya** / **Devadatta** | conches | Krishna / Arjuna | from the sea / from Varuna |

**Bhima's mace, Duryodhana's mace, Bhishma's bow and Drona's bow are never
named** in any of the eighteen books.

## 14. Asi, the primordial sword, has a full origin myth

Shanti Parva CLXVI, and it is the best single card in this entire document.

Brahman created a dark, keen-toothed **Being** from his sacrificial fire -
*"his name is Asi"* - which then took the shape of a sword. It descends:
Brahman, Rudra, Vishnu, Marichi, the Rishis, Indra, the Lokapalas, then **Manu,
the first man**, with a governance charter attached:

> *"Protect all creatures with this sword... they should be protected
> conformably to the ordinances but never according to caprice... Loss of limb
> or death should never be inflicted for slight reasons."*

Eight secret names, a constellation (Krittika), a deity (Agni), a preceptor
(Rudra). Then a thirty-king succession down through Bharadwaja to Drona to
Kripa to the Pandavas.

The same section states that **the bow was first created by Prithu son of Vena**.

## 15. Conditions of use: the best mechanics in the corpus

Every one verbatim.

**Srutayudha's mace** is the model conditional weapon (Drona XCI). Varuna's
terms: *"This mace should not be hurled at one who is not engaged in fight. If
hurled at such a person, it will come back and fall upon thyself."* He throws it
at Krishna, who is **driving, not fighting** - and it rebounds and kills him.
The narrator spells the moral out.

**Karna's Vasavi dart** carries two stacked clauses. One use: *"it will slay
only one powerful enemy of thine... it will, roaring and blazing, return to
me."* And misuse: *"if, maddened by wrath, thou hurlest this dart, while there
are still other weapons with thee, and when thy life also is not in imminent
peril, it will fall even on thyself."* In Indra's own hand it kills by hundreds
and returns - the nerf is specific to the mortal holder.

**Narayana astra** has the richest rule-set in the epic: never in haste, never
against those who abandon weapons or seek quarter, a **published**
countermeasure ordained by Narayana himself, strictly one use, and *"if brought
back, it will without doubt slay the person calling it back."*

**Pashupata**: *"This must never be hurled at mortals... And when all thy
weapons have been completely baffled, thou mayst hurl it."* A weapon of last
resort with a target-class restriction.

**Chandrahasa** has a loyalty condition rather than a target one, which is
unusual and very usable: *"Never treat this weapon with contempt, if thou dost
disregard it, it will assuredly return to me."*

**Sudarsana** can be **arrested by a rival god's prior boon** - Krishna: *"Since
you, Sankara, have given a boon unto Bana, let him live... my discus is
arrested"* - and dispatches itself autonomously to protect a devotee.

## 16. THE two-card mechanic, sitting in the text

The **mantras for hurling and withdrawing** are consistently a *separate
transferable asset* from the weapon itself. Every Lokapala grants his arm
"along with the mysteries of hurling and withdrawing it" (Vana XLI).

So: you can hold a weapon and **not know how to use it**, or know the mantra and
lack the weapon. That is a ready-made two-card combo the epic hands us, and it
is a far better gate than a standing threshold.

## 17. How mortals earn arms, with the price stated

| who | what | the price |
|---|---|---|
| **Arjuna** | Pashupata, Yama's mace, Varuna's nooses, Kubera's Antarddhana | penance, then **fighting Shiva in single combat** while Shiva was disguised as a Kirata |
| **Karna** | Vasavi dart | **cut his natural armour and earrings off his living flesh** without flinching |
| **Parashurama** | Shiva's axe | adored Shiva for years, then fought the Daityas **unarmed at Shiva's order** and took wounds |
| **Srutayudha** | Varuna's mace | **his mother petitioned for him.** Granted invincibility-by-object, explicitly not immortality: *"No man can have immortality"* |
| **Rama** | Vishnu's bow, Indra's shaft, endless quiver | given by **Agastya, a sage not a god**, as a guest-gift |
| **Ambarisha** | Sudarsana | pure devotion, no feat at all |

## 18. Shastra refuse list

- **Kodanda: 0 occurrences.** Rama's bow is never named in Griffith
- **Vidyudabhi: 0 occurrences** anywhere. Parashurama's axe is simply *parasu*.
  A wiki artifact
- **Trishula as a proper name** - not attested. It is the common noun for trident
- **Musala as Balarama's weapon: 0 in Ganguli.** The Mausala Parva's iron bolt is
  Samba's curse-born club that destroys the Vrishnis, a different object. His
  club is **Saunanda**, and only in the Puranas
- **Halayudha is an epithet** ("plough-armed"), not a weapon name

**Vijaya's disputed owner**, settled by weight: Karna claims it in six passages
across his own Parva; Rukmi gets one genealogical aside. Both root it in Indra
but the transmission chains are irreconcilable. Note also that "Vijaya" is one of
Arjuna's ten names AND the name of Shiva's trident in the Shiva Purana - three
unrelated referents.

---

## 9. Boons and curses

Same treatment as the astras: every entry below was pulled from the paragraph
corpus and is quoted, not paraphrased. Citations are Ganguli's section numbers.

### 9a. REFUTED: Gandhari's gaze does not make Duryodhana invulnerable

The single most repeated Mahabharata story that is not in the Mahabharata.
Duryodhana comes to his blindfolded mother, she unbinds her eyes to make his
body adamant, Krishna shames him into covering his loins, and the thighs stay
mortal for Bhima's mace.

Searched all four volumes for the episode and every component of it. It is not
there. Her gaze DOES have power, and the text demonstrates it exactly once, at
a much smaller scale (Stri XV):

> the Kuru queen ... directed her eyes, from within the folds of the cloth that
> covered them, to the tip of Yudhishthira's toe ... the king, whose nails had
> before this been all very beautiful, came to have a sore nail on his toe.

A sore toenail. That is the whole demonstrated range of it.

**The invulnerability is real; the cause is different and better.** It is
armour, and Arjuna gives the full chain of custody (Virata LXI):

> I think, O Krishna, that this armour hath been put on Duryodhana's body by
> Drona ... This armour is not capable of being pierced by my weapons. Maghavat
> himself, O Govinda, cannot pierce it with his thunder.

Indra to Angiras to Vrihaspati to Indra to Arjuna, and Drona ties it on
Duryodhana. Arjuna then lands the contempt that makes the card: *"He weareth it
only like a woman."* A man wearing the best armour in the three worlds who does
not know what to do in it.

We keep the `diamond-body` mechanic and re-source the story on it.

### 9b. VERIFIED and now shipping

| what | source | quoted |
|---|---|---|
| **Parashurama's curse on Karna** | Karna XLII | "it will never, **at the time of need, when the hour of thy death comes**, occur to thy memory" |
| **Gandhari's curse on Krishna** | Stri XXV | "thou shalt be **the slayer of thy own kinsmen**! In the thirty-sixth year ... perish by disgusting means in the wilderness" |
| **Shiva's boon to Jayadratha** | Drona XLI | "**Except Dhananjaya**, the son of Pritha, thou shalt in battle **check the four other sons of Pandu**" |
| **Bhishma's death-at-will** | Anusasana (Yudhishthira to Bhishma) | "In consequence of the boon granted to thee by thy sire, the righteous Santanu, **thy death depends on thy own will**" |
| **Krishna's curse on Ashwatthama** | Sauptika XVI | "For **3,000 years** thou shalt wander over this earth, without a companion ... The stench of pus and blood shall emanate from thee" |
| **Krishna's boon re Sisupala** | Sabha XL | "even when he will deserve to be slain, I will **pardon an hundred offences** of his" |
| **Kindama's curse on Pandu** | Adi CXVIII | "death shall certainly overtake thee **as soon as thou feelest the influence of sexual desire**" |
| **Indra's loophole on Vritra** | Vana (Indra-Vritra) | "This is **neither dry, nor wet, nor is it a weapon**" — and "it is neither day, nor night" |

Two of these changed cards immediately.

**Parashurama's curse is not a blanket ban.** We had `forgotten_mantra` barring
astras for the whole battle, which made it Shiva's Gaze with different flavour
text. The text is precise: the weapon answers Karna all war and deserts him at
the hour it decides things. It now bars astras **in the deciding round only**.
Karna's own card already had `noAstrasInFinalRound`, so the curse and the man it
is named for finally agree with each other.

Worth recording that **Indra sent the worm himself**, "wishing to benefit
Phalguna" (Karna XLII). Karna's greatest curse is a targeted operation by
Arjuna's father, not bad luck.

**Jayadratha was a -2 to the enemy infantry row**, which is any sapper in the
game with his name on it. He now does the one thing he is remembered for. He
asked Shiva to stop all five Pandavas and was granted four, so he holds four
warriors out of the enemy hand and their best man walks through the gate. That
is `denyPlay { sparingStrongest: true }`, and the exemption IS the card.

### 9c. The loophole is the dominant mechanic and we underuse it

Neither epic grants clean invulnerability. It is granted with a hole in it, and
the story is the hole:

- **Sunda and Upasunda** — Brahma refuses immortality outright, so they name
  their own death clause and choose each other (Adi CCXI). Already shipping as
  Brahma's Bargain.
- **Jayadratha** — four of five, never Arjuna.
- **Sisupala** — a hundred offences, then the discus.
- **Vritra** — neither wet nor dry, neither day nor night, and no weapon. Indra
  kills him with sea-foam at dusk.
- **Duryodhana** — armour no thunderbolt can pierce, worn by a man who does not
  know how to use it.

Five instances, one implemented. This is the richest unmined vein in the
research so far, and it is mechanically ideal for a card game because a
loophole is a *condition*, which is the one thing this engine is built to
express.

### 9d. Still open

- **Sisupala's hundred offences** wants a real charge counter on
  `onDestroyAttempt`. His card currently promises "beyond harm until the
  hundredth insult" in flavour text and delivers "immune until Krishna is
  played", which is a trigger, not a count.
- **Ashwatthama's 3,000 years** is the price of his `deathless` keyword and is
  not represented at all. He is unkillable for free.
- **Kunti's Invocation** destroys the highest enemy unit. Durvasa's mantra
  *summons a god*; it does not kill anybody. Mis-mechanic'd, not mis-sourced.
- **Gandhari's curse detonates in the thirty-sixth year.** A battle has no
  thirty-sixth year, so we ship the kin-slaying and drop the delay. The run
  layer has `pendingCurses` and could carry the real version across battles.
