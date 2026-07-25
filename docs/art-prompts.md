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
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background.
```

## The exclude list

Put this in the generator's **Exclude** / negative-prompt field, not in the prompt itself. Naming a thing in order to forbid it tends to summon it, which is how the first test came back covered in garbled Devanagari.

```
blue skin, peacock feather, flute, Krishna, Vishnu, text, letters, writing, script, calligraphy, watermark, signature, caption, tribal, primitive, rustic, folk art, crude, modern clothing, bare chest, unarmoured, plain wooden bow, static pose, stiff, posed portrait
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
| 1 | Arjuna | unit | pandava | He wields the Gandiva, an immense divine war-bow of gold-chased horn with curling makara-head finials, glowing faintly along the grip. Golden lamellar armour with a sunburst-embossed breastplate, and the Kiritin, the tall golden crown given him by Indra |
| 2 | Bhima | unit | pandava | a huge-shouldered warrior resting an iron mace on one shoulder, wild-haired, openly furious |
| 3 | Yudhishthira | unit | pandava | an ascetic-faced king in plain white, holding a spear he does not want to use |
| 4 | Nakula | unit | pandava | the handsomest of the brothers, sword drawn, groomed and precise |
| 5 | Sahadeva | unit | pandava | the youngest brother, quiet and watchful, holding a sword and a palm-leaf almanac |
| 6 | Abhimanyu | unit | pandava | a boy of sixteen in bright armour, bow raised, surrounded by the shadow of a closing spiral formation |
| 7 | Ghatotkacha | unit | pandava | a towering rakshasa with tusks and dark skin, half-giant, iron club in hand, night behind him |
| 8 | Iravan | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Ulupi’s serpent-son, who fought the sky itself before he fell |
| 9 | Anjanaparvan | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the indigo and silver of the Pandavas. Ghatotkacha’s son, and Ashwatthama’s kill |
| 10 | Prativindhya | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Eldest of the five princes, son of Yudhishthira |
| 11 | Sutasoma | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Bhima, of the fire-born queen’s line |
| 12 | Shrutakarma | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Arjuna, cut down asleep |
| 13 | Shatanika | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Nakula, of the unbroken line |
| 14 | Shrutasena | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Youngest son of Sahadeva |
| 15 | Dhrishtadyumna | unit | pandava | a warrior born from sacrificial fire, flame still clinging to his armour, eyes fixed |
| 16 | Shikhandi | unit | pandava | a warrior of ambiguous aspect, bow lowered, standing with terrible stillness |
| 17 | Drupada | unit | pandava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The king whose broken friendship lit the whole war |
| 18 | Yudhamanyu | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. One of the two who guarded Arjuna’s wheels to the last |
| 19 | Uttamaujas | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The other guardian of Arjuna’s chariot-wheels |
| 20 | Virata | unit | pandava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The king who hid the Pandavas, then died for them |
| 21 | Sweta | unit | pandava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Virata’s eldest, who raged through the van and fell on the first day |
| 22 | Sankha | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Second of Virata’s fallen sons |
| 23 | Uttara | unit | pandava | a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The boy prince who found his courage behind Brihannala |
| 24 | Satyaki | unit | pandava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Arjuna’s disciple, the one Vrishni who chose the right side |
| 25 | Chekitana | unit | pandava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. A Vrishni lord, commander of a Pandava division |
| 26 | Dhrishtaketu | unit | pandava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Shishupala’s son, who fought beside his father’s killer |
| 27 | The Kekaya Brothers | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Five brothers of Kekaya, kin against kin |
| 28 | Kuntibhoja | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The house that raised Kunti, come to fight for her sons |
| 29 | Yuyutsu | unit | pandava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The brother who changed sides before the conch, and lived |
| 30 | Pandava Footmen | unit | pandava | a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a foot soldier of the line, spear and shield, in the indigo and silver of the Pandavas. The uncounted spears of the Panchala levy |
| 31 | Bhishma | unit | kaurava | an ancient white-bearded patriarch in silver mail, bow in hand, unbowed and sorrowful |
| 32 | Drona | unit | kaurava | a grey-bearded brahmin-warrior in armour, bow held loosely, teacher and killer at once |
| 33 | Karna | unit | kaurava | a golden-armoured archer with sun-bright kavacha at his chest and heavy earrings, proud and alone |
| 34 | Shalya | unit | kaurava | a kingly charioteer holding reins, mouth set in quiet betrayal |
| 35 | Duryodhana | unit | kaurava | a broad crowned prince, mace across his knees, body faintly gleaming like adamant |
| 36 | Dushasana | unit | kaurava | a cruel-mouthed prince with a raised, grasping hand |
| 37 | Vikarna | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The only brother who named the wrong a wrong |
| 38 | Chitrasena | unit | kaurava | a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. One of the hundred, cut down in Bhima’s vow |
| 39 | Vivimsati | unit | kaurava | a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. A steadier hand than most of his hundred brothers |
| 40 | Durmukha | unit | kaurava | a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. Fierce of face, as his name is read |
| 41 | Ashwatthama | unit | kaurava | a wild-eyed warrior with a jewel set into his forehead, blood-flecked, unable to die |
| 42 | Kripa | unit | kaurava | a serene old brahmin-warrior, prayer beads at his wrist, bow across his back |
| 43 | Kritavarma | unit | kaurava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Yadava who took the army, not the god |
| 44 | Shakuni | unit | kaurava | a lean smiling schemer rolling dice in his palm, no armour, all cunning |
| 45 | Uluka | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He carried the message that made peace impossible |
| 46 | Bahlika | unit | kaurava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. An elder of Shantanu’s own blood, fighting past his years |
| 47 | Somadatta | unit | kaurava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. Heir of Bahlika, marked by an ancient feud |
| 48 | Bhurishravas | unit | kaurava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He laid down arms to die in prayer, and was struck down at it |
| 49 | Jayadratha | unit | kaurava | a hard-faced king holding a gate-bar like a weapon, boon-light at his back |
| 50 | Bhagadatta | unit | kaurava | an aged king seated on a war elephant, hook in hand, cloth binding his eyelids up |
| 51 | Vinda | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. One half of the Avanti brothers, never seen apart |
| 52 | Anuvinda | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The other half of the Avanti brothers |
| 53 | Susharma | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He swore to kill Arjuna or never leave the field |
| 54 | Sudakshina | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Kamboja king and his tide of northern horse |
| 55 | Srutayudha | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. His own boon-mace turned back and slew him |
| 56 | Jalasandha | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the crimson and gold of the Kauravas. The Magadha lord who rode into Satyaki’s path |
| 57 | Alambusha | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The night-demon who killed Arjuna’s serpent-son |
| 58 | Alayudha | unit | kaurava | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the crimson and gold of the Kauravas. He came to avenge his kin, and lost his head to Bhima’s son |
| 59 | Vrishasena | unit | kaurava | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Sun-son’s son, cut down before his father’s eyes |
| 60 | Kaurava Footmen | unit | kaurava | a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a foot soldier of the line, spear and shield, in the crimson and gold of the Kauravas. Eleven akshauhinis marched for Hastinapura |
| 61 | Ravana | unit | asura | a ten-headed rakshasa king crowned in gold, many arms, arrogant and magnificent |
| 62 | Kumbhakarna | unit | asura | a mountainous sleeping giant just waking, eyes half-open, monstrous and calm |
| 63 | Indrajit | unit | asura | a rakshasa prince mid-vanishing into cloud, bow drawn, conqueror of heaven |
| 64 | Hiranyakashipu | unit | asura | an asura king whose body is armoured by a boon, throat bared in contempt |
| 65 | Hiranyaksha | unit | asura | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. Who dragged the earth beneath the sea, until the Boar rose |
| 66 | Bali | unit | asura | a noble asura king offering water in his palms, deathless and generous |
| 67 | Prahlada | unit | asura | a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a foot soldier of the line, spear and shield, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The devotee-prince, virtue born inside the demon line |
| 68 | Narakasura | unit | asura | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The demon of Pragjyotisha, born of the earth herself |
| 69 | Mahishasura | unit | asura | a buffalo-headed demon lord mid-shapeshift, horns lowered |
| 70 | Shumbha | unit | asura | a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. One of the brother-kings who claimed the three worlds |
| 71 | Nishumbha | unit | asura | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The other brother, never seen apart from Shumbha |
| 72 | Raktabija | unit | asura | an asura from whose falling blood small identical figures are rising |
| 73 | Vritra | unit | asura | a vast drought-serpent coiled around a dry riverbed, scales like cracked earth |
| 74 | Tarakasura | unit | asura | a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. Whom no one could slay but a son of Shiva, not yet born |
| 75 | Asura Horde | unit | asura | a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a foot soldier of the line, spear and shield, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The numberless danava rank-and-file |
| 76 | Barbarika | unit | legend | a young archer with three arrows, seated in meditation, his own severed head watching from a hilltop |
| 77 | Jarasandha | unit | legend | a king whose body shows a faint vertical seam from crown to groin, immensely strong |
| 78 | Balarama | unit | legend | a fair-skinned elder brother leaning on a plough, drinking horn at his belt, refusing the war |
| 79 | Ekalavya | unit | legend | a forest-born archer of the Nishada, right thumb missing, bow held in an altered grip |
| 80 | Shishupala | unit | legend | a proud king mid-insult, a faint discus-light already circling his neck |
| 81 | Rukmi | unit | legend | an arrogant prince with an ornate unused bow, standing apart from both armies |
| 82 | Brahma-Astra | astra | neutral | a single arrow blooming into a column of white fire, the ground beneath already ash |
| 83 | Brahmashirsha-Astra | astra | neutral | a four-faced pillar of fire rising from a scorched horizon, the air itself burning |
| 84 | Pashupat-Astra | astra | neutral | a single unbearable eye of white fire opening in the sky, the world beneath it thinning to nothing |
| 85 | Narayan-Astra | astra | neutral | a sky filled edge to edge with descending divine weapons, discs and spears without number |
| 86 | Vaishnav-Astra | astra | neutral | a discus of blue-white light travelling with impossible certainty toward its mark |
| 87 | Vasavi Shakti | astra | neutral | a single blazing spear of Indra hanging in the dark, thrown once and never again |
| 88 | Aindra-Astra | astra | neutral | a sky-blackening rain of arrows falling in a solid sheet |
| 89 | Agney-Astra | astra | neutral | a wall of unquenchable flame advancing across a rank of soldiers |
| 90 | Varun-Astra | astra | neutral | a rising wall of black water swallowing fire |
| 91 | Vayavya-Astra | astra | neutral | a screaming spiral of wind tearing a battle line apart |
| 92 | Nag-Astra | astra | neutral | a serpent of living arrow-fire striking through smoke, hood spread |
| 93 | Garud-Astra | astra | neutral | the shadow of a vast eagle falling across a field, serpents scattering beneath it |
| 94 | Bhargav-Astra | astra | neutral | countless arrows loosed at once from a single point, a fan of fire |
| 95 | Sammohan-Astra | astra | neutral | the weapon of sleep arjuna loosed on the kuru host at virata |
| 96 | Krishna, the Charioteer | boon | pandava | a blue-skinned god serving as charioteer, peacock feather in his crown, holding reins and a conch rather than a weapon, serene and knowing |
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
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Arjuna, in the instant of loosing an arrow, string drawn back past his ear, bow arm locked, body torqued into the shot. He wields the Gandiva, an immense divine war-bow of gold-chased horn with curling makara-head finials, glowing faintly along the grip. Golden lamellar armour with a sunburst-embossed breastplate, and the Kiritin, the tall golden crown given him by Indra. A human warrior with warm bronze-brown human skin (not blue).
```

**2. Bhima**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Bhima, mid-swing, the great iron mace coming around in a killing arc, shoulders wrenched with the effort. a huge-shouldered warrior resting an iron mace on one shoulder, wild-haired, openly furious. A human warrior with warm bronze-brown human skin (not blue).
```

**3. Yudhishthira**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Yudhishthira, lowering his spear to halt his own line, hand raised, refusing the charge. an ascetic-faced king in plain white, holding a spear he does not want to use. A human warrior with warm bronze-brown human skin (not blue).
```

**4. Nakula**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Nakula, twisting into a fast sword cut, blade a bright line across the frame. the handsomest of the brothers, sword drawn, groomed and precise. A human warrior with warm bronze-brown human skin (not blue).
```

**5. Sahadeva**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Sahadeva, turning sharply, sword coming up, having seen what no one else saw. the youngest brother, quiet and watchful, holding a sword and a palm-leaf almanac. A human warrior with warm bronze-brown human skin (not blue).
```

**6. Abhimanyu**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Abhimanyu, spinning to loose an arrow behind him, hemmed in on every side, alone. a boy of sixteen in bright armour, bow raised, surrounded by the shadow of a closing spiral formation. A human warrior with warm bronze-brown human skin (not blue).
```

**7. Ghatotkacha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Ghatotkacha, dropping out of the night sky, club raised overhead, enormous. a towering rakshasa with tusks and dark skin, half-giant, iron club in hand, night behind him. A human warrior with warm bronze-brown human skin (not blue).
```

**8. Iravan**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Iravan, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Ulupi’s serpent-son, who fought the sky itself before he fell. A human warrior with warm bronze-brown human skin (not blue).
```

**9. Anjanaparvan**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Anjanaparvan, braced and shouting as his war elephant surges forward beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the indigo and silver of the Pandavas. Ghatotkacha’s son, and Ashwatthama’s kill. A human warrior with warm bronze-brown human skin (not blue).
```

**10. Prativindhya**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Prativindhya, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Eldest of the five princes, son of Yudhishthira. A human warrior with warm bronze-brown human skin (not blue).
```

**11. Sutasoma**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Sutasoma, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Bhima, of the fire-born queen’s line. A human warrior with warm bronze-brown human skin (not blue).
```

**12. Shrutakarma**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Shrutakarma, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Arjuna, cut down asleep. A human warrior with warm bronze-brown human skin (not blue).
```

**13. Shatanika**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Shatanika, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Son of Nakula, of the unbroken line. A human warrior with warm bronze-brown human skin (not blue).
```

**14. Shrutasena**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Shrutasena, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Youngest son of Sahadeva. A human warrior with warm bronze-brown human skin (not blue).
```

**15. Dhrishtadyumna**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Dhrishtadyumna, lunging forward through fire, blade levelled at one man only. a warrior born from sacrificial fire, flame still clinging to his armour, eyes fixed. A human warrior with warm bronze-brown human skin (not blue).
```

**16. Shikhandi**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Shikhandi, raising the bow with terrible stillness while everything else moves. a warrior of ambiguous aspect, bow lowered, standing with terrible stillness. A human warrior with warm bronze-brown human skin (not blue).
```

**17. Drupada**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Drupada, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The king whose broken friendship lit the whole war. A human warrior with warm bronze-brown human skin (not blue).
```

**18. Yudhamanyu**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Yudhamanyu, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. One of the two who guarded Arjuna’s wheels to the last. A human warrior with warm bronze-brown human skin (not blue).
```

**19. Uttamaujas**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Uttamaujas, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The other guardian of Arjuna’s chariot-wheels. A human warrior with warm bronze-brown human skin (not blue).
```

**20. Virata**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Virata, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The king who hid the Pandavas, then died for them. A human warrior with warm bronze-brown human skin (not blue).
```

**21. Sweta**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Sweta, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Virata’s eldest, who raged through the van and fell on the first day. A human warrior with warm bronze-brown human skin (not blue).
```

**22. Sankha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Sankha, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Second of Virata’s fallen sons. A human warrior with warm bronze-brown human skin (not blue).
```

**23. Uttara**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Uttara, at full draw, arrow nocked, chariot rail rocking beneath him. a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The boy prince who found his courage behind Brihannala. A human warrior with warm bronze-brown human skin (not blue).
```

**24. Satyaki**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Satyaki, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Arjuna’s disciple, the one Vrishni who chose the right side. A human warrior with warm bronze-brown human skin (not blue).
```

**25. Chekitana**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Chekitana, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. A Vrishni lord, commander of a Pandava division. A human warrior with warm bronze-brown human skin (not blue).
```

**26. Dhrishtaketu**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Dhrishtaketu, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Shishupala’s son, who fought beside his father’s killer. A human warrior with warm bronze-brown human skin (not blue).
```

**27. The Kekaya Brothers**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: The Kekaya Brothers, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. Five brothers of Kekaya, kin against kin. A human warrior with warm bronze-brown human skin (not blue).
```

**28. Kuntibhoja**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Kuntibhoja, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The house that raised Kunti, come to fight for her sons. A human warrior with warm bronze-brown human skin (not blue).
```

**29. Yuyutsu**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Yuyutsu, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the indigo and silver of the Pandavas. The brother who changed sides before the conch, and lived. A human warrior with warm bronze-brown human skin (not blue).
```

**30. Pandava Footmen**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted deep indigo blue. Subject: Pandava Footmen, driving in behind a levelled spear, shield up, feet churning. a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a foot soldier of the line, spear and shield, in the indigo and silver of the Pandavas. The uncounted spears of the Panchala levy. A human warrior with warm bronze-brown human skin (not blue).
```

### The Kaurava Host (30)

**31. Bhishma**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Bhishma, loosing arrows in every direction at once, unhurried, a wall of shafts blooming around him. an ancient white-bearded patriarch in silver mail, bow in hand, unbowed and sorrowful. A human warrior with warm bronze-brown human skin (not blue).
```

**32. Drona**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Drona, raising an open hand mid-mantra, an astra kindling white at his fingertips. a grey-bearded brahmin-warrior in armour, bow held loosely, teacher and killer at once. A human warrior with warm bronze-brown human skin (not blue).
```

**33. Karna**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Karna, drawing with terrible calm as his chariot wheel sinks and the earth swallows it. a golden-armoured archer with sun-bright kavacha at his chest and heavy earrings, proud and alone. A human warrior with warm bronze-brown human skin (not blue).
```

**34. Shalya**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Shalya, hauling the reins hard over, chariot slewing, mouth set in quiet betrayal. a kingly charioteer holding reins, mouth set in quiet betrayal. A human warrior with warm bronze-brown human skin (not blue).
```

**35. Duryodhana**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Duryodhana, striding in, mace swung back for the blow, body gleaming like struck adamant. a broad crowned prince, mace across his knees, body faintly gleaming like adamant. A human warrior with warm bronze-brown human skin (not blue).
```

**36. Dushasana**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Dushasana, lunging with a grasping hand outstretched, mouth open. a cruel-mouthed prince with a raised, grasping hand. A human warrior with warm bronze-brown human skin (not blue).
```

**37. Vikarna**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Vikarna, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The only brother who named the wrong a wrong. A human warrior with warm bronze-brown human skin (not blue).
```

**38. Chitrasena**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Chitrasena, at full draw, arrow nocked, chariot rail rocking beneath him. a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. One of the hundred, cut down in Bhima’s vow. A human warrior with warm bronze-brown human skin (not blue).
```

**39. Vivimsati**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Vivimsati, at full draw, arrow nocked, chariot rail rocking beneath him. a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. A steadier hand than most of his hundred brothers. A human warrior with warm bronze-brown human skin (not blue).
```

**40. Durmukha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Durmukha, at full draw, arrow nocked, chariot rail rocking beneath him. a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. Fierce of face, as his name is read. A human warrior with warm bronze-brown human skin (not blue).
```

**41. Ashwatthama**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Ashwatthama, wheeling around with a snarl, blade up, the jewel in his brow blazing. a wild-eyed warrior with a jewel set into his forehead, blood-flecked, unable to die. A human warrior with warm bronze-brown human skin (not blue).
```

**42. Kripa**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Kripa, drawing an arrow with weary practised calm, prayer beads swinging at his wrist. a serene old brahmin-warrior, prayer beads at his wrist, bow across his back. A human warrior with warm bronze-brown human skin (not blue).
```

**43. Kritavarma**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Kritavarma, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Yadava who took the army, not the god. A human warrior with warm bronze-brown human skin (not blue).
```

**44. Shakuni**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Shakuni, casting the dice underhand and already watching them fall, unbothered by the war. a lean smiling schemer rolling dice in his palm, no armour, all cunning. A human warrior with warm bronze-brown human skin (not blue).
```

**45. Uluka**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Uluka, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He carried the message that made peace impossible. A human warrior with warm bronze-brown human skin (not blue).
```

**46. Bahlika**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Bahlika, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. An elder of Shantanu’s own blood, fighting past his years. A human warrior with warm bronze-brown human skin (not blue).
```

**47. Somadatta**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Somadatta, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. Heir of Bahlika, marked by an ancient feud. A human warrior with warm bronze-brown human skin (not blue).
```

**48. Bhurishravas**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Bhurishravas, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He laid down arms to die in prayer, and was struck down at it. A human warrior with warm bronze-brown human skin (not blue).
```

**49. Jayadratha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Jayadratha, bracing a gate-bar overhead against a press of men, holding the line alone. a hard-faced king holding a gate-bar like a weapon, boon-light at his back. A human warrior with warm bronze-brown human skin (not blue).
```

**50. Bhagadatta**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Bhagadatta, leaning from the neck of his war elephant, hook raised, as it tramples forward. an aged king seated on a war elephant, hook in hand, cloth binding his eyelids up. A human warrior with warm bronze-brown human skin (not blue).
```

**51. Vinda**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Vinda, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. One half of the Avanti brothers, never seen apart. A human warrior with warm bronze-brown human skin (not blue).
```

**52. Anuvinda**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Anuvinda, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The other half of the Avanti brothers. A human warrior with warm bronze-brown human skin (not blue).
```

**53. Susharma**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Susharma, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. He swore to kill Arjuna or never leave the field. A human warrior with warm bronze-brown human skin (not blue).
```

**54. Sudakshina**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Sudakshina, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Kamboja king and his tide of northern horse. A human warrior with warm bronze-brown human skin (not blue).
```

**55. Srutayudha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Srutayudha, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. His own boon-mace turned back and slew him. A human warrior with warm bronze-brown human skin (not blue).
```

**56. Jalasandha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Jalasandha, braced and shouting as his war elephant surges forward beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the crimson and gold of the Kauravas. The Magadha lord who rode into Satyaki’s path. A human warrior with warm bronze-brown human skin (not blue).
```

**57. Alambusha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Alambusha, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The night-demon who killed Arjuna’s serpent-son. A human warrior with warm bronze-brown human skin (not blue).
```

**58. Alayudha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Alayudha, braced and shouting as his war elephant surges forward beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, in the crimson and gold of the Kauravas. He came to avenge his kin, and lost his head to Bhima’s son. A human warrior with warm bronze-brown human skin (not blue).
```

**59. Vrishasena**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Vrishasena, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, in the crimson and gold of the Kauravas. The Sun-son’s son, cut down before his father’s eyes. A human warrior with warm bronze-brown human skin (not blue).
```

**60. Kaurava Footmen**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted dark crimson. Subject: Kaurava Footmen, driving in behind a levelled spear, shield up, feet churning. a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a foot soldier of the line, spear and shield, in the crimson and gold of the Kauravas. Eleven akshauhinis marched for Hastinapura. A human warrior with warm bronze-brown human skin (not blue).
```

### The Asura Host (15)

**61. Ravana**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Ravana, all ten heads roaring at once, many arms bringing up many weapons together. a ten-headed rakshasa king crowned in gold, many arms, arrogant and magnificent.
```

**62. Kumbhakarna**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Kumbhakarna, rising to his full impossible height, shaking sleep off like water. a mountainous sleeping giant just waking, eyes half-open, monstrous and calm.
```

**63. Indrajit**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Indrajit, loosing an arrow from inside a thundercloud, half-dissolved into vapour. a rakshasa prince mid-vanishing into cloud, bow drawn, conqueror of heaven.
```

**64. Hiranyakashipu**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Hiranyakashipu, throwing his arms wide in contempt, daring the world to strike him. an asura king whose body is armoured by a boon, throat bared in contempt.
```

**65. Hiranyaksha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Hiranyaksha, braced and shouting as his war elephant surges forward beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. Who dragged the earth beneath the sea, until the Boar rose.
```

**66. Bali**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Bali, pouring the water of a vow from his palms, calm while the world tilts. a noble asura king offering water in his palms, deathless and generous.
```

**67. Prahlada**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Prahlada, driving in behind a levelled spear, shield up, feet churning. a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a foot soldier of the line, spear and shield, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The devotee-prince, virtue born inside the demon line.
```

**68. Narakasura**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Narakasura, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The demon of Pragjyotisha, born of the earth herself.
```

**69. Mahishasura**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Mahishasura, mid-shapeshift, buffalo horns lowering into a charge. a buffalo-headed demon lord mid-shapeshift, horns lowered.
```

**70. Shumbha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Shumbha, at full draw, arrow nocked, chariot rail rocking beneath him. a great champion in magnificent golden lamellar war-armour: sculpted embossed breastplate, layered pauldrons, engraved vambraces, jewelled war-belt and ornate helm, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. One of the brother-kings who claimed the three worlds.
```

**71. Nishumbha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Nishumbha, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The other brother, never seen apart from Shumbha.
```

**72. Raktabija**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Raktabija, struck and bleeding, small identical figures already rising from every falling drop. an asura from whose falling blood small identical figures are rising.
```

**73. Vritra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Vritra, uncoiling upward, jaws opening over a cracked dry riverbed. a vast drought-serpent coiled around a dry riverbed, scales like cracked earth.
```

**74. Tarakasura**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Tarakasura, at full draw, arrow nocked, chariot rail rocking beneath him. a seasoned warrior in fine gilded scale armour with shoulder guards, bracers and an ornamented war-belt, a chariot-borne archer, bow in hand, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. Whom no one could slay but a son of Shiva, not yet born.
```

**75. Asura Horde**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted venomous green. Subject: Asura Horde, driving in behind a levelled spear, shield up, feet churning. a hardened line-fighter in banded bronze cuirass and leather bracers, scarred and well-used, a foot soldier of the line, spear and shield, an asura, dark-skinned and tusked, in barbaric green-lacquered plate. The numberless danava rank-and-file.
```

### Those Who Stood Apart (6)

**76. Barbarika**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted cold teal. Subject: Barbarika, nocking the first of three arrows, wind rising, everything about to end. a young archer with three arrows, seated in meditation, his own severed head watching from a hilltop. A human warrior with warm bronze-brown human skin (not blue).
```

**77. Jarasandha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted cold teal. Subject: Jarasandha, seizing an opponent two-handed, the faint seam down his body showing. a king whose body shows a faint vertical seam from crown to groin, immensely strong. A human warrior with warm bronze-brown human skin (not blue).
```

**78. Balarama**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted cold teal. Subject: Balarama, planting the plough into the ground like a wall, turning his back on the war. a fair-skinned elder brother leaning on a plough, drinking horn at his belt, refusing the war. A human warrior with warm bronze-brown human skin (not blue).
```

**79. Ekalavya**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted cold teal. Subject: Ekalavya, loosing an arrow in an altered grip, right thumb missing, unbowed. a forest-born archer of the Nishada, right thumb missing, bow held in an altered grip. A human warrior with warm bronze-brown human skin (not blue).
```

**80. Shishupala**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted cold teal. Subject: Shishupala, mid-insult, arm flung out, a discus-light already circling his throat. a proud king mid-insult, a faint discus-light already circling his neck. A human warrior with warm bronze-brown human skin (not blue).
```

**81. Rukmi**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. Dynamic half-figure, waist-up, caught mid-action on a strong diagonal, cloth and hair whipping in the wind. Atmosphere tinted cold teal. Subject: Rukmi, lowering an ornate unused bow, jaw tight, refused by both armies. an arrogant prince with an ornate unused bow, standing apart from both armies. A human warrior with warm bronze-brown human skin (not blue).
```

### Astras (divine weapons) (14)

**82. Brahma-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Brahma-Astra,. a single arrow blooming into a column of white fire, the ground beneath already ash.
```

**83. Brahmashirsha-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Brahmashirsha-Astra,. a four-faced pillar of fire rising from a scorched horizon, the air itself burning.
```

**84. Pashupat-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Pashupat-Astra,. a single unbearable eye of white fire opening in the sky, the world beneath it thinning to nothing.
```

**85. Narayan-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Narayan-Astra,. a sky filled edge to edge with descending divine weapons, discs and spears without number.
```

**86. Vaishnav-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Vaishnav-Astra,. a discus of blue-white light travelling with impossible certainty toward its mark.
```

**87. Vasavi Shakti**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Vasavi Shakti,. a single blazing spear of Indra hanging in the dark, thrown once and never again.
```

**88. Aindra-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Aindra-Astra,. a sky-blackening rain of arrows falling in a solid sheet.
```

**89. Agney-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Agney-Astra,. a wall of unquenchable flame advancing across a rank of soldiers.
```

**90. Varun-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Varun-Astra,. a rising wall of black water swallowing fire.
```

**91. Vayavya-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Vayavya-Astra,. a screaming spiral of wind tearing a battle line apart.
```

**92. Nag-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Nag-Astra,. a serpent of living arrow-fire striking through smoke, hood spread.
```

**93. Garud-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Garud-Astra,. the shadow of a vast eagle falling across a field, serpents scattering beneath it.
```

**94. Bhargav-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Bhargav-Astra,. countless arrows loosed at once from a single point, a fan of fire.
```

**95. Sammohan-Astra**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. No human figure. The weapon itself as a phenomenon of light and force filling the frame. Atmosphere tinted antique gold. Subject: Sammohan-Astra,. the weapon of sleep arjuna loosed on the kuru host at virata.
```

### Vardaan and Fates (8)

**96. Krishna, the Charioteer**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. A single figure in the act of blessing, or the gift itself, centred and radiant. Atmosphere tinted deep indigo blue. Subject: Krishna, the Charioteer,. a blue-skinned god serving as charioteer, peacock feather in his crown, holding reins and a conch rather than a weapon, serene and knowing.
```

**97. "Ashwatthama is Dead"**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: "Ashwatthama is Dead",. a war elephant falling in smoke, a lie taking shape above it.
```

**98. Gandhari’s Gaze**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. A single figure in the act of blessing, or the gift itself, centred and radiant. Atmosphere tinted antique gold. Subject: Gandhari’s Gaze,. a blindfolded queen lifting the cloth from her eyes for the first time, terrible light beneath it.
```

**99. Kunti’s Invocation**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: Kunti’s Invocation,. a woman speaking a mantra with her eyes closed, a god half-formed in the air above her.
```

**100. Surya’s Kavacha**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. A single figure in the act of blessing, or the gift itself, centred and radiant. Atmosphere tinted antique gold. Subject: Surya’s Kavacha,. golden armour and earrings glowing with sunlight, worn by no one, floating.
```

**101. The Ashwins’ Draught**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: The Ashwins’ Draught,. twin physician-gods pouring a luminous draught, horses behind them.
```

**102. The Fury of Vayu**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: The Fury of Vayu,. a gale tearing across a battlefield, banners and men going over together.
```

**103. Yama’s Summons**

```
Ink-and-gouache painting in the Indian miniature tradition, heroic epic grandeur: confident black linework beneath flat saturated colour, opulent gold detailing, fine filigree, jewelled ornament, many layered silks. Imperial and lavish, never rustic. Dramatic storm light from the upper left; the subject surges out of a smoky near-black ground. Deep chiaroscuro, limited palette, dust and sparks in the air. Vertical 4:5 composition. Clean unmarked background. A symbolic omen object, centred, ominous, no human figure. Atmosphere tinted antique gold. Subject: Yama’s Summons,. a dark lord of death holding a noose and a ledger, tallying the field.
```
