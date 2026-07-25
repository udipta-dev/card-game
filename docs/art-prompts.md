# Kurukshetra: card art prompts

Generated from the live card data. 103 images, one per card.
Regenerate with `npx vite-node sim/build-art-prompts.ts`.

## The rules that actually keep 100+ images consistent

1. **Paste the style anchor verbatim every time.** Never reword it, never summarise it. Consistency comes from this sentence being byte-identical across every generation, not from describing each card well.
2. **One light direction, always upper-left.** It is in the anchor. Do not let a prompt override it.
3. **Framing is fixed by card type**, not chosen per card. Warriors are chest-up three-quarter portraits; astras have no human figure; fates are objects.
4. **Aspect ratio 5:7 vertical.** This matches the card frames in the game exactly.
5. **No text in the image.** Image models garble Devanagari badly, and the card frame supplies the name anyway.
6. **Test three first** (Arjuna, Karna, Ravana) and view them at 46px wide before committing to the rest. If the silhouette does not read at that size, the style needs more contrast, not more detail.

## The style anchor

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition.
```

## Palette by house

| House | Atmosphere |
| --- | --- |
| pandava | Atmosphere tinted deep indigo blue. |
| kaurava | Atmosphere tinted dark crimson. |
| asura | Atmosphere tinted venomous green. |
| legend | Atmosphere tinted cold teal. |
| neutral | Atmosphere tinted antique gold. |

## All 103 in one table

Prepend the style anchor and the framing rule to each subject line.

| # | Card | Type | House | Subject |
| --- | --- | --- | --- | --- |
| 1 | Arjuna | unit | pandava | a lean, calm archer drawing the great bow Gandiva, peacock feather in his hair, unhurried and exact |
| 2 | Bhima | unit | pandava | a huge-shouldered warrior resting an iron mace on one shoulder, wild-haired, openly furious |
| 3 | Yudhishthira | unit | pandava | an ascetic-faced king in plain white, holding a spear he does not want to use |
| 4 | Nakula | unit | pandava | the handsomest of the brothers, sword drawn, groomed and precise |
| 5 | Sahadeva | unit | pandava | the youngest brother, quiet and watchful, holding a sword and a palm-leaf almanac |
| 6 | Abhimanyu | unit | pandava | a boy of sixteen in bright armour, bow raised, surrounded by the shadow of a closing spiral formation |
| 7 | Ghatotkacha | unit | pandava | a towering rakshasa with tusks and dark skin, half-giant, iron club in hand, night behind him |
| 8 | Iravan | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Ulupi’s serpent-son, who fought the sky itself before he fell |
| 9 | Anjanaparvan | unit | pandava | a seasoned warrior in good scaled armour, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the indigo and silver of the Pandavas. Ghatotkacha’s son, and Ashwatthama’s kill |
| 10 | Prativindhya | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Eldest of the five princes, son of Yudhishthira |
| 11 | Sutasoma | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Bhima, of the fire-born queen’s line |
| 12 | Shrutakarma | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Arjuna, cut down asleep |
| 13 | Shatanika | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Nakula, of the unbroken line |
| 14 | Shrutasena | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Youngest son of Sahadeva |
| 15 | Dhrishtadyumna | unit | pandava | a warrior born from sacrificial fire, flame still clinging to his armour, eyes fixed |
| 16 | Shikhandi | unit | pandava | a warrior of ambiguous aspect, bow lowered, standing with terrible stillness |
| 17 | Drupada | unit | pandava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The king whose broken friendship lit the whole war |
| 18 | Yudhamanyu | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. One of the two who guarded Arjuna’s wheels to the last |
| 19 | Uttamaujas | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The other guardian of Arjuna’s chariot-wheels |
| 20 | Virata | unit | pandava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The king who hid the Pandavas, then died for them |
| 21 | Sweta | unit | pandava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Virata’s eldest, who raged through the van and fell on the first day |
| 22 | Sankha | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Second of Virata’s fallen sons |
| 23 | Uttara | unit | pandava | a lightly armoured fighter, plain and hard-used, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The boy prince who found his courage behind Brihannala |
| 24 | Satyaki | unit | pandava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Arjuna’s disciple, the one Vrishni who chose the right side |
| 25 | Chekitana | unit | pandava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. A Vrishni lord, commander of a Pandava division |
| 26 | Dhrishtaketu | unit | pandava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Shishupala’s son, who fought beside his father’s killer |
| 27 | The Kekaya Brothers | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Five brothers of Kekaya, kin against kin |
| 28 | Kuntibhoja | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The house that raised Kunti, come to fight for her sons |
| 29 | Yuyutsu | unit | pandava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The brother who changed sides before the conch, and lived |
| 30 | Pandava Footmen | unit | pandava | a lightly armoured fighter, plain and hard-used, a foot soldier of the line, spear and shield, in the indigo and silver of the Pandavas. The uncounted spears of the Panchala levy |
| 31 | Bhishma | unit | kaurava | an ancient white-bearded patriarch in silver mail, bow in hand, unbowed and sorrowful |
| 32 | Drona | unit | kaurava | a grey-bearded brahmin-warrior in armour, bow held loosely, teacher and killer at once |
| 33 | Karna | unit | kaurava | a golden-armoured archer with sun-bright kavacha at his chest and heavy earrings, proud and alone |
| 34 | Shalya | unit | kaurava | a kingly charioteer holding reins, mouth set in quiet betrayal |
| 35 | Duryodhana | unit | kaurava | a broad crowned prince, mace across his knees, body faintly gleaming like adamant |
| 36 | Dushasana | unit | kaurava | a cruel-mouthed prince with a raised, grasping hand |
| 37 | Vikarna | unit | kaurava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The only brother who named the wrong a wrong |
| 38 | Chitrasena | unit | kaurava | a lightly armoured fighter, plain and hard-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. One of the hundred, cut down in Bhima’s vow |
| 39 | Vivimsati | unit | kaurava | a lightly armoured fighter, plain and hard-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. A steadier hand than most of his hundred brothers |
| 40 | Durmukha | unit | kaurava | a lightly armoured fighter, plain and hard-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. Fierce of face, as his name is read |
| 41 | Ashwatthama | unit | kaurava | a wild-eyed warrior with a jewel set into his forehead, blood-flecked, unable to die |
| 42 | Kripa | unit | kaurava | a serene old brahmin-warrior, prayer beads at his wrist, bow across his back |
| 43 | Kritavarma | unit | kaurava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Yadava who took the army, not the god |
| 44 | Shakuni | unit | kaurava | a lean smiling schemer rolling dice in his palm, no armour, all cunning |
| 45 | Uluka | unit | kaurava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He carried the message that made peace impossible |
| 46 | Bahlika | unit | kaurava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. An elder of Shantanu’s own blood, fighting past his years |
| 47 | Somadatta | unit | kaurava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. Heir of Bahlika, marked by an ancient feud |
| 48 | Bhurishravas | unit | kaurava | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He laid down arms to die in prayer, and was struck down at it |
| 49 | Jayadratha | unit | kaurava | a hard-faced king holding a gate-bar like a weapon, boon-light at his back |
| 50 | Bhagadatta | unit | kaurava | an aged king seated on a war elephant, hook in hand, cloth binding his eyelids up |
| 51 | Vinda | unit | kaurava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. One half of the Avanti brothers, never seen apart |
| 52 | Anuvinda | unit | kaurava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The other half of the Avanti brothers |
| 53 | Susharma | unit | kaurava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He swore to kill Arjuna or never leave the field |
| 54 | Sudakshina | unit | kaurava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Kamboja king and his tide of northern horse |
| 55 | Srutayudha | unit | kaurava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. His own boon-mace turned back and slew him |
| 56 | Jalasandha | unit | kaurava | a seasoned warrior in good scaled armour, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the crimson and gold of the Kauravas. The Magadha lord who rode into Satyaki’s path |
| 57 | Alambusha | unit | kaurava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The night-demon who killed Arjuna’s serpent-son |
| 58 | Alayudha | unit | kaurava | a great champion in richly ornamented armour, bearing himself like a king, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the crimson and gold of the Kauravas. He came to avenge his kin, and lost his head to Bhima’s son |
| 59 | Vrishasena | unit | kaurava | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Sun-son’s son, cut down before his father’s eyes |
| 60 | Kaurava Footmen | unit | kaurava | a lightly armoured fighter, plain and hard-used, a foot soldier of the line, spear and shield, in the crimson and gold of the Kauravas. Eleven akshauhinis marched for Hastinapura |
| 61 | Ravana | unit | asura | a ten-headed rakshasa king crowned in gold, many arms, arrogant and magnificent |
| 62 | Kumbhakarna | unit | asura | a mountainous sleeping giant just waking, eyes half-open, monstrous and calm |
| 63 | Indrajit | unit | asura | a rakshasa prince mid-vanishing into cloud, bow drawn, conqueror of heaven |
| 64 | Hiranyakashipu | unit | asura | an asura king whose body is armoured by a boon, throat bared in contempt |
| 65 | Hiranyaksha | unit | asura | a seasoned warrior in good scaled armour, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. Who dragged the earth beneath the sea, until the Boar rose |
| 66 | Bali | unit | asura | a noble asura king offering water in his palms, deathless and generous |
| 67 | Prahlada | unit | asura | a lightly armoured fighter, plain and hard-used, a foot soldier of the line, spear and shield, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The devotee-prince, virtue born inside the demon line |
| 68 | Narakasura | unit | asura | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The demon of Pragjyotisha, born of the earth herself |
| 69 | Mahishasura | unit | asura | a buffalo-headed demon lord mid-shapeshift, horns lowered |
| 70 | Shumbha | unit | asura | a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. One of the brother-kings who claimed the three worlds |
| 71 | Nishumbha | unit | asura | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The other brother, never seen apart from Shumbha |
| 72 | Raktabija | unit | asura | an asura from whose falling blood small identical figures are rising |
| 73 | Vritra | unit | asura | a vast drought-serpent coiled around a dry riverbed, scales like cracked earth |
| 74 | Tarakasura | unit | asura | a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. Whom no one could slay but a son of Shiva, not yet born |
| 75 | Asura Horde | unit | asura | a lightly armoured fighter, plain and hard-used, a foot soldier of the line, spear and shield, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The numberless danava rank-and-file |
| 76 | Barbarika | unit | legend | a young archer with three arrows, seated in meditation, his own severed head watching from a hilltop |
| 77 | Jarasandha | unit | legend | a king whose body shows a faint vertical seam from crown to groin, immensely strong |
| 78 | Balarama | unit | legend | a fair-skinned elder brother leaning on a plough, drinking horn at his belt, refusing the war |
| 79 | Ekalavya | unit | legend | a forest-born archer of the Nishada, right thumb missing, bow held in an altered grip |
| 80 | Shishupala | unit | legend | a proud king mid-insult, a faint discus-light already circling his neck |
| 81 | Rukmi | unit | legend | an arrogant prince with an ornate unused bow, standing apart from both armies |
| 82 | Brahmastra | astra | neutral | a single arrow blooming into a column of white fire, the ground beneath already ash |
| 83 | Brahmashirsha | astra | neutral | a four-faced pillar of fire rising from a scorched horizon, the air itself burning |
| 84 | Pashupatastra | astra | neutral | a single unbearable eye of white fire opening in the sky, the world beneath it thinning to nothing |
| 85 | Narayanastra | astra | neutral | a sky filled edge to edge with descending divine weapons, discs and spears without number |
| 86 | Vaishnavastra | astra | neutral | a discus of blue-white light travelling with impossible certainty toward its mark |
| 87 | Vasavi Shakti | astra | neutral | a single blazing spear of Indra hanging in the dark, thrown once and never again |
| 88 | Aindrastra | astra | neutral | a sky-blackening rain of arrows falling in a solid sheet |
| 89 | Agneyastra | astra | neutral | a wall of unquenchable flame advancing across a rank of soldiers |
| 90 | Varunastra | astra | neutral | a rising wall of black water swallowing fire |
| 91 | Vayavyastra | astra | neutral | a screaming spiral of wind tearing a battle line apart |
| 92 | Nagastra | astra | neutral | a serpent of living arrow-fire striking through smoke, hood spread |
| 93 | Garudastra | astra | neutral | the shadow of a vast eagle falling across a field, serpents scattering beneath it |
| 94 | Bhargavastra | astra | neutral | countless arrows loosed at once from a single point, a fan of fire |
| 95 | Sammohanastra | astra | neutral | the weapon of sleep arjuna loosed on the kuru host at virata |
| 96 | Krishna, the Charioteer | boon | pandava | a blue-skinned charioteer holding reins and a conch, not a weapon, serene and knowing |
| 97 | "Ashwatthama is Dead" | curse | neutral | a war elephant falling in smoke, a lie taking shape above it |
| 98 | Gandhari’s Gaze | boon | neutral | a blindfolded queen lifting the cloth from her eyes for the first time, terrible light beneath it |
| 99 | Kunti’s Invocation | curse | neutral | a woman speaking a mantra with her eyes closed, a god half-formed in the air above her |
| 100 | Surya’s Kavacha | boon | neutral | golden armour and earrings glowing with sunlight, worn by no one, floating |
| 101 | The Ashwins’ Draught | curse | neutral | twin physician-gods pouring a luminous draught, horses behind them |
| 102 | The Fury of Vayu | curse | neutral | a gale tearing across a battlefield, banners and men going over together |
| 103 | Yama’s Summons | curse | neutral | a dark lord of death holding a noose and a ledger, tallying the field |

---

## Ready-to-paste prompts

### The Pandava Host (30)

**1. Arjuna**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Arjuna, a lean, calm archer drawing the great bow Gandiva, peacock feather in his hair, unhurried and exact.
```

**2. Bhima**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Bhima, a huge-shouldered warrior resting an iron mace on one shoulder, wild-haired, openly furious.
```

**3. Yudhishthira**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Yudhishthira, an ascetic-faced king in plain white, holding a spear he does not want to use.
```

**4. Nakula**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Nakula, the handsomest of the brothers, sword drawn, groomed and precise.
```

**5. Sahadeva**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Sahadeva, the youngest brother, quiet and watchful, holding a sword and a palm-leaf almanac.
```

**6. Abhimanyu**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Abhimanyu, a boy of sixteen in bright armour, bow raised, surrounded by the shadow of a closing spiral formation.
```

**7. Ghatotkacha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Ghatotkacha, a towering rakshasa with tusks and dark skin, half-giant, iron club in hand, night behind him.
```

**8. Iravan**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Iravan, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Ulupi’s serpent-son, who fought the sky itself before he fell.
```

**9. Anjanaparvan**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Anjanaparvan, a seasoned warrior in good scaled armour, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the indigo and silver of the Pandavas. Ghatotkacha’s son, and Ashwatthama’s kill.
```

**10. Prativindhya**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Prativindhya, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Eldest of the five princes, son of Yudhishthira.
```

**11. Sutasoma**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Sutasoma, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Bhima, of the fire-born queen’s line.
```

**12. Shrutakarma**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Shrutakarma, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Arjuna, cut down asleep.
```

**13. Shatanika**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Shatanika, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Nakula, of the unbroken line.
```

**14. Shrutasena**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Shrutasena, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Youngest son of Sahadeva.
```

**15. Dhrishtadyumna**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Dhrishtadyumna, a warrior born from sacrificial fire, flame still clinging to his armour, eyes fixed.
```

**16. Shikhandi**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Shikhandi, a warrior of ambiguous aspect, bow lowered, standing with terrible stillness.
```

**17. Drupada**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Drupada, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The king whose broken friendship lit the whole war.
```

**18. Yudhamanyu**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Yudhamanyu, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. One of the two who guarded Arjuna’s wheels to the last.
```

**19. Uttamaujas**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Uttamaujas, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The other guardian of Arjuna’s chariot-wheels.
```

**20. Virata**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Virata, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The king who hid the Pandavas, then died for them.
```

**21. Sweta**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Sweta, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Virata’s eldest, who raged through the van and fell on the first day.
```

**22. Sankha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Sankha, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Second of Virata’s fallen sons.
```

**23. Uttara**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Uttara, a lightly armoured fighter, plain and hard-used, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The boy prince who found his courage behind Brihannala.
```

**24. Satyaki**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Satyaki, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Arjuna’s disciple, the one Vrishni who chose the right side.
```

**25. Chekitana**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Chekitana, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. A Vrishni lord, commander of a Pandava division.
```

**26. Dhrishtaketu**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Dhrishtaketu, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Shishupala’s son, who fought beside his father’s killer.
```

**27. The Kekaya Brothers**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: The Kekaya Brothers, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Five brothers of Kekaya, kin against kin.
```

**28. Kuntibhoja**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Kuntibhoja, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The house that raised Kunti, come to fight for her sons.
```

**29. Yuyutsu**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Yuyutsu, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The brother who changed sides before the conch, and lived.
```

**30. Pandava Footmen**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted deep indigo blue. Subject: Pandava Footmen, a lightly armoured fighter, plain and hard-used, a foot soldier of the line, spear and shield, in the indigo and silver of the Pandavas. The uncounted spears of the Panchala levy.
```

### The Kaurava Host (30)

**31. Bhishma**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Bhishma, an ancient white-bearded patriarch in silver mail, bow in hand, unbowed and sorrowful.
```

**32. Drona**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Drona, a grey-bearded brahmin-warrior in armour, bow held loosely, teacher and killer at once.
```

**33. Karna**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Karna, a golden-armoured archer with sun-bright kavacha at his chest and heavy earrings, proud and alone.
```

**34. Shalya**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Shalya, a kingly charioteer holding reins, mouth set in quiet betrayal.
```

**35. Duryodhana**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Duryodhana, a broad crowned prince, mace across his knees, body faintly gleaming like adamant.
```

**36. Dushasana**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Dushasana, a cruel-mouthed prince with a raised, grasping hand.
```

**37. Vikarna**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Vikarna, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The only brother who named the wrong a wrong.
```

**38. Chitrasena**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Chitrasena, a lightly armoured fighter, plain and hard-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. One of the hundred, cut down in Bhima’s vow.
```

**39. Vivimsati**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Vivimsati, a lightly armoured fighter, plain and hard-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. A steadier hand than most of his hundred brothers.
```

**40. Durmukha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Durmukha, a lightly armoured fighter, plain and hard-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. Fierce of face, as his name is read.
```

**41. Ashwatthama**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Ashwatthama, a wild-eyed warrior with a jewel set into his forehead, blood-flecked, unable to die.
```

**42. Kripa**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Kripa, a serene old brahmin-warrior, prayer beads at his wrist, bow across his back.
```

**43. Kritavarma**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Kritavarma, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Yadava who took the army, not the god.
```

**44. Shakuni**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Shakuni, a lean smiling schemer rolling dice in his palm, no armour, all cunning.
```

**45. Uluka**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Uluka, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He carried the message that made peace impossible.
```

**46. Bahlika**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Bahlika, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. An elder of Shantanu’s own blood, fighting past his years.
```

**47. Somadatta**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Somadatta, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. Heir of Bahlika, marked by an ancient feud.
```

**48. Bhurishravas**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Bhurishravas, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He laid down arms to die in prayer, and was struck down at it.
```

**49. Jayadratha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Jayadratha, a hard-faced king holding a gate-bar like a weapon, boon-light at his back.
```

**50. Bhagadatta**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Bhagadatta, an aged king seated on a war elephant, hook in hand, cloth binding his eyelids up.
```

**51. Vinda**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Vinda, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. One half of the Avanti brothers, never seen apart.
```

**52. Anuvinda**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Anuvinda, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The other half of the Avanti brothers.
```

**53. Susharma**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Susharma, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He swore to kill Arjuna or never leave the field.
```

**54. Sudakshina**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Sudakshina, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Kamboja king and his tide of northern horse.
```

**55. Srutayudha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Srutayudha, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. His own boon-mace turned back and slew him.
```

**56. Jalasandha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Jalasandha, a seasoned warrior in good scaled armour, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the crimson and gold of the Kauravas. The Magadha lord who rode into Satyaki’s path.
```

**57. Alambusha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Alambusha, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The night-demon who killed Arjuna’s serpent-son.
```

**58. Alayudha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Alayudha, a great champion in richly ornamented armour, bearing himself like a king, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the crimson and gold of the Kauravas. He came to avenge his kin, and lost his head to Bhima’s son.
```

**59. Vrishasena**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Vrishasena, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Sun-son’s son, cut down before his father’s eyes.
```

**60. Kaurava Footmen**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted dark crimson. Subject: Kaurava Footmen, a lightly armoured fighter, plain and hard-used, a foot soldier of the line, spear and shield, in the crimson and gold of the Kauravas. Eleven akshauhinis marched for Hastinapura.
```

### The Asura Host (15)

**61. Ravana**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Ravana, a ten-headed rakshasa king crowned in gold, many arms, arrogant and magnificent.
```

**62. Kumbhakarna**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Kumbhakarna, a mountainous sleeping giant just waking, eyes half-open, monstrous and calm.
```

**63. Indrajit**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Indrajit, a rakshasa prince mid-vanishing into cloud, bow drawn, conqueror of heaven.
```

**64. Hiranyakashipu**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Hiranyakashipu, an asura king whose body is armoured by a boon, throat bared in contempt.
```

**65. Hiranyaksha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Hiranyaksha, a seasoned warrior in good scaled armour, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. Who dragged the earth beneath the sea, until the Boar rose.
```

**66. Bali**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Bali, a noble asura king offering water in his palms, deathless and generous.
```

**67. Prahlada**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Prahlada, a lightly armoured fighter, plain and hard-used, a foot soldier of the line, spear and shield, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The devotee-prince, virtue born inside the demon line.
```

**68. Narakasura**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Narakasura, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The demon of Pragjyotisha, born of the earth herself.
```

**69. Mahishasura**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Mahishasura, a buffalo-headed demon lord mid-shapeshift, horns lowered.
```

**70. Shumbha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Shumbha, a great champion in richly ornamented armour, bearing himself like a king, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. One of the brother-kings who claimed the three worlds.
```

**71. Nishumbha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Nishumbha, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The other brother, never seen apart from Shumbha.
```

**72. Raktabija**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Raktabija, an asura from whose falling blood small identical figures are rising.
```

**73. Vritra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Vritra, a vast drought-serpent coiled around a dry riverbed, scales like cracked earth.
```

**74. Tarakasura**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Tarakasura, a seasoned warrior in good scaled armour, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. Whom no one could slay but a son of Shiva, not yet born.
```

**75. Asura Horde**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted venomous green. Subject: Asura Horde, a lightly armoured fighter, plain and hard-used, a foot soldier of the line, spear and shield, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The numberless danava rank-and-file.
```

### Those Who Stood Apart (6)

**76. Barbarika**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted cold teal. Subject: Barbarika, a young archer with three arrows, seated in meditation, his own severed head watching from a hilltop.
```

**77. Jarasandha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted cold teal. Subject: Jarasandha, a king whose body shows a faint vertical seam from crown to groin, immensely strong.
```

**78. Balarama**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted cold teal. Subject: Balarama, a fair-skinned elder brother leaning on a plough, drinking horn at his belt, refusing the war.
```

**79. Ekalavya**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted cold teal. Subject: Ekalavya, a forest-born archer of the Nishada, right thumb missing, bow held in an altered grip.
```

**80. Shishupala**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted cold teal. Subject: Shishupala, a proud king mid-insult, a faint discus-light already circling his neck.
```

**81. Rukmi**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge. Atmosphere tinted cold teal. Subject: Rukmi, an arrogant prince with an ornate unused bow, standing apart from both armies.
```

### Astras (divine weapons) (14)

**82. Brahmastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Brahmastra, a single arrow blooming into a column of white fire, the ground beneath already ash.
```

**83. Brahmashirsha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Brahmashirsha, a four-faced pillar of fire rising from a scorched horizon, the air itself burning.
```

**84. Pashupatastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Pashupatastra, a single unbearable eye of white fire opening in the sky, the world beneath it thinning to nothing.
```

**85. Narayanastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Narayanastra, a sky filled edge to edge with descending divine weapons, discs and spears without number.
```

**86. Vaishnavastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Vaishnavastra, a discus of blue-white light travelling with impossible certainty toward its mark.
```

**87. Vasavi Shakti**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Vasavi Shakti, a single blazing spear of Indra hanging in the dark, thrown once and never again.
```

**88. Aindrastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Aindrastra, a sky-blackening rain of arrows falling in a solid sheet.
```

**89. Agneyastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Agneyastra, a wall of unquenchable flame advancing across a rank of soldiers.
```

**90. Varunastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Varunastra, a rising wall of black water swallowing fire.
```

**91. Vayavyastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Vayavyastra, a screaming spiral of wind tearing a battle line apart.
```

**92. Nagastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Nagastra, a serpent of living arrow-fire striking through smoke, hood spread.
```

**93. Garudastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Garudastra, the shadow of a vast eagle falling across a field, serpents scattering beneath it.
```

**94. Bhargavastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Bhargavastra, countless arrows loosed at once from a single point, a fan of fire.
```

**95. Sammohanastra**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Sammohanastra, the weapon of sleep arjuna loosed on the kuru host at virata.
```

### Vardaan and Fates (8)

**96. Krishna, the Charioteer**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. A single figure in the act of blessing, or the gift itself, centred and radiant. Atmosphere tinted deep indigo blue. Subject: Krishna, the Charioteer, a blue-skinned charioteer holding reins and a conch, not a weapon, serene and knowing.
```

**97. "Ashwatthama is Dead"**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: "Ashwatthama is Dead", a war elephant falling in smoke, a lie taking shape above it.
```

**98. Gandhari’s Gaze**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. A single figure in the act of blessing, or the gift itself, centred and radiant. Atmosphere tinted antique gold. Subject: Gandhari’s Gaze, a blindfolded queen lifting the cloth from her eyes for the first time, terrible light beneath it.
```

**99. Kunti’s Invocation**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: Kunti’s Invocation, a woman speaking a mantra with her eyes closed, a god half-formed in the air above her.
```

**100. Surya’s Kavacha**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. A single figure in the act of blessing, or the gift itself, centred and radiant. Atmosphere tinted antique gold. Subject: Surya’s Kavacha, golden armour and earrings glowing with sunlight, worn by no one, floating.
```

**101. The Ashwins’ Draught**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: The Ashwins’ Draught, twin physician-gods pouring a luminous draught, horses behind them.
```

**102. The Fury of Vayu**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: The Fury of Vayu, a gale tearing across a battlefield, banners and men going over together.
```

**103. Yama’s Summons**

```
Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition: confident black ink linework, flat saturated gouache colour, ornamental detail in cloth, jewellery and armour. One warm light source from the upper left; the subject emerges from a smoky near-black ground. Limited palette, deep shadow, no rendered photorealism. No text, no lettering, no signature, no watermark. Vertical 5:7 composition. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: Yama’s Summons, a dark lord of death holding a noose and a ledger, tallying the field.
```
