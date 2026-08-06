# Kurukshetra: card art prompts

114 prompts, generated from the live card data. Regenerate with `npx vite-node sim/build-art-prompts.ts`.

Generated for **meta.ai**, which honours negated qualities. Firefly does not, and caps prompts at 1024 characters.

## Where the files go

Save each image as the card id shown above its prompt, into:

```
src/assets/art/cards/<card_id>.png
```

So Arjuna is `src/assets/art/cards/arjuna.png`. `png`, `webp`, `jpg` and `avif` all work. Art resolves by convention, so a file dropped in that folder appears on its card with no code change and nothing to register. A card with no file keeps its placeholder glyph, so a half-finished set degrades quietly.

**Aspect ratio: 4:5 portrait.** Measured, not assumed: the art slot is `flex: 1`, so its shape is whatever is left after the card header and footer, and that varies with card size. It is 35x43.8 (exactly 4:5, nothing cropped) on a codex card and 51x50 (square, 20% of the height cropped) on a hand card. Where it does crop, the loss is biased downward so it falls on the legs rather than the crown. Tapping a card shows the whole image uncropped at 192x240.

## Banners

The dhvaja is what stops 67 chariot archers looking like the same man. Every emblem used here is attested in the Kisari Mohan Ganguli translation, from the passages where the epic inventories standards: Virata Parva LV and LVII-LVIII, Bhishma Parva XVI-XVII, and Drona Parva XXIII (Pandava side) and CIV (Kaurava side), where Dhritarashtra asks outright to have the standards described.

Anyone the epic gives no device gets a plain house standard instead of a plausible guess. Dushasana's standard is cut down repeatedly and never described; the same is true of Bhagadatta, though his elephant Supratika **is** named.

One trap worth recording: **Duryodhana's serpent banner is not in the epic.** It is everywhere in fan wikis and folk art, and all three catalogue passages give him a jewelled elephant instead.

## What testing taught us

Three of these corrected an earlier rule that was wrong. The corrections cost real generations, so they are recorded rather than quietly dropped.

1. **The failure mode is unfamiliar gesture, not length.** A 177-word Karna rendered every armour piece, the earrings, the scarf, the dhoti, the low sun and the distant broken chariots. The single thing it dropped was "his right hand rests on the arrow at his hip", and it put the bow in the wrong hand as well. Keep prompts near 110 words anyway, for consistency across 103 cards and because sprawl makes a failure hard to attribute, but do not expect trimming to rescue an instruction the model cannot draw. *This replaces "dense beats minimal" and also replaces "length is the constraint". The first blamed sparseness, the second blamed size; the culprit was neither.*
2. **Naming the character is safe** so long as no slot is left blank. The prior fills gaps, not names. The original Krishna-looking Arjuna came from a peacock feather that was in our own prompt text. *We blamed the name for something we asked for.*
3. **Enumerate armour by its proper term:** breastplate, pauldrons, vambraces, greaves, belt. Those nouns already imply the region they cover, which is what finally ended the bare-chested renders. Better than "torso completely enclosed", and far better than any analogy.
4. **Never a weapon in transit, and never assign hands.** No mid-swing, no loosed bowstring: that needs a deformed string and an absent arrow, and returns melted geometry. Naming which hand holds what fails too, in both directions: it ignores the assignment and it mangles whatever the free hand was given. Say "holding a massive ornate golden bow, a full quiver of arrows on his back" and let the model place the limbs. That renders cleanly and still reads as action.
5. **Negate qualities, never objects.** "No glossy surfaces" is a free bet: if the negation fails you get gloss, which was the default anyway. "No sword" hands you a sword. *This replaces "never name what you do not want", which was true only for Firefly.*
6. **One global palette instruction** beats per-item colour discipline. "Muted earthy palette" solves the all-red Karna outright.
7. **No hue on air.** "Dark indigo air" produced a blue daylight sky. A value on a named weather object, like "dark thunderclouds", is fine.
8. **Never ask for both** an oversized foreground weapon and a full-frame fit. They fight, and the weapon loses. Framing wins: drama is cheaper to add back than a severed bow.
9. **Do not use JSON.** It collapses the prompt entirely and returns unrelated stock images.

## The style sentence

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro.
```

Each card below gives two forms. **Standalone** includes the style sentence; use it when generating from the prompt alone. **With style reference** omits it, for when an approved image is uploaded as a style reference and repeating the style in words would give the model two competing instructions.


## Weapons carry their god

Four rounds of real generation went into this section. Every rule below cost images, so they are written down rather than quietly folded in.

**0. The sign, never the god.** This is the rule the whole section is built on and it was still got wrong once. Naming a god invites the model to draw him, and the first Brahmashirsha came back as four screaming heads stacked into a column: grotesque, and wrong on its own terms, because the line being quoted is about *signs*. Menace comes from the emblem being a weapon, not from a face glaring out of it. A lotus whose petals are blades is frightening; a lotus with a man screaming in the middle of it is a cartoon. Every weapon prompt carries an explicit guard: show the emblem alone, the god never appears.

**0b. Check how the weapon is actually delivered.** Almost every astra is an arrow shot from a bow, and the epic says so plainly. Two are not, and drawing those as arrows is wrong rather than merely off-style.

| Astra | Delivery | Ganguli |
|---|---|---|
| Brahmastra | arrow, transformed by mantra, shot | *"that violent arrow transformed by Rama, with proper mantras into a Brahma weapon ... Then Rama shot that terrible weapon"* |
| Nagastra | one snake-mouthed shaft on the string | *"fixed on his bow-string that foe-killing, exceedingly keen, snake-mouthed, blazing, and fierce shaft"* |
| Varunastra | fixed on the bow-string | *"the Kuru chief fixed the Varuna weapon on his bow-string"* |
| Aindrastra | from the bow, thousands of shafts flow out | *"fixed them on the bow-string ... Hundreds and thousands of blazing shafts ... flowed from it"* |
| Tvashtra | shot from Gandiva | *"grasped Gandiva ... and then he shot the weapon called Tvashtra"* |
| Praswapa | shot | *"desirous of speedily shooting the Praswapa weapon"* |
| Antardhana | shot; Shiva used it on Tripura | *"this was the weapon which he shot"* |
| **Vasavi Shakti** | **hurled by hand, once** | *"the celestial Sakti given by Indra ... caused to be hurled upon Rakshasa Ghatotkacha"* |
| **Vaishnavastra** | **hurled by hand** | Bhagadatta *"with Mantras, turned his hook into the Vaishnava weapon and hurled it at Arjuna's breast"* |
| **Pashupata** | **any of four ways** | *"it may be hurled by the mind, by the eye, by words, and by the bow"* |

Sauparna, Sammohana, Prajna and Samvodhana have no narrated discharge I could find, so their prompts do not claim one.

**0c. Keep the fletching.** The first merge rule banned the arrowhead to stop the emblem reading as a separate object being struck. It worked, and it went too far: it deleted the arrow's identity along with the seam, and the render stopped looking like anything fired. An arrow is recognised from its nock and fletching, not from its point. Those stay; only the head dissolves.

**1. Name the weapon and name the god.** "A Brahmastra, the weapon of Brahma, bearing his sign the lotus" lands where a description of fire and petals does not. This is rule 2 again from the other direction: naming is safe, and here it is what tells the model which iconography to reach for. The epic supplies the mapping in the argument over whose sign is greatest: *"Brahma has for his sign the lotus, Vishnu has for his the discus, Indra has for his sign the thunder-bolt."*

**2. An arrow AND an emblem returns two objects.** Described as both, it comes back as an arrow *striking* a sphere, with a hard contact line. Deleting the arrowhead is not enough on its own; the shaft still meets the emblem at a seam and looks glued. What works is making the transition itself the subject: wood, then embers, then streaming light, then the emblem, no boundary anywhere. The arrowhead must be named as absent or it gets drawn. Only the seven weapons in `MERGES` carry this; a mace is one object already.

**3. Half the frame, not all of it.** At full size the emblem crowds its own detail and eats the black margin, which is the margin the screen composite needs to feather into the board. An earlier draft ended "Enormous, close, and terrible" and fought this rule outright. Dread comes from the faces and eyes in the subject, not from filling the card.

**4. Do not let the weapons go monochrome.** An earlier pass set them in "incandescent white and gold", which read as clean but detached them from the roster entirely. They now burn in the same ground pigments as the character art, lac red and indigo and terre verte and brass. Still one global palette instruction, so rule 6 holds; only the value changed.

**Arrows rise.** Nothing falls, descends or rains down. It reads better on a portrait card, and it reads as a weapon being loosed rather than as weather.

Weapons also drop `no bloom`, which earns its place on a painted warrior but forbids the entire subject on a thing made of light. The corona is what feathers the composite into the board instead of ending it at a hard edge.

## The Pandava Host (30)

### Arjuna

`arjuna.png` · 1065 chars · 153 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Arjuna, powerfully built, one foot set on a broken chariot wheel, squarely facing the viewer, holding Gandiva, a huge golden-backed longbow, a full quiver on his back. Blue-grey skin, lips parted, breathing hard, curly black hair beneath a golden diadem, forearms scarred by the bowstring. Blue-lacquered armour banded with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a slate-grey tunic. A gold-bordered uttariya wound across the torso, ochre dhoti, jewelled sandals with silver straps, toes visible. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing a golden ape with a lion’s tail, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Arjuna, powerfully built, one foot set on a broken chariot wheel, squarely facing the viewer, holding Gandiva, a huge golden-backed longbow, a full quiver on his back. Blue-grey skin, lips parted, breathing hard, curly black hair beneath a golden diadem, forearms scarred by the bowstring. Blue-lacquered armour banded with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a slate-grey tunic. A gold-bordered uttariya wound across the torso, ochre dhoti, jewelled sandals with silver straps, toes visible. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing a golden ape with a lion’s tail, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhima

`bhima.png` · 1008 chars · 147 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhima, hyper-muscular, standing square and unmoving, squarely facing the viewer, holding a heavy gold-decked iron mace in both hands. Deep bronze skin, screaming, teeth bared, tall as a sala tree, long-armed, bitten lip and three deep furrows across his brow. Engraved black armour hung with heavy gold chains, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a black tunic. Torn blue loincloth, heavy leather paduka sandals with dark straps, toes visible. Ruined battlefield, flying dust, rock debris. A tall war-standard bearing a giant silver lion with lapis-blue eyes, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhima, hyper-muscular, standing square and unmoving, squarely facing the viewer, holding a heavy gold-decked iron mace in both hands. Deep bronze skin, screaming, teeth bared, tall as a sala tree, long-armed, bitten lip and three deep furrows across his brow. Engraved black armour hung with heavy gold chains, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a black tunic. Torn blue loincloth, heavy leather paduka sandals with dark straps, toes visible. Ruined battlefield, flying dust, rock debris. A tall war-standard bearing a giant silver lion with lapis-blue eyes, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yudhishthira

`yudhishthira.png` · 978 chars · 143 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Yudhishthira, tall and slender, mid-stride, advancing, head lowered, eyes up at the viewer, holding a long gold-hafted spear hung with bells. Pale gold complexion, calm sorrowful expression, a prominent nose, large eyes, long black hair beneath a golden crown. Engraved gold armour, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a dark blue tunic. White dhoti, leather paduka sandals with plain straps, toes visible. Still grey battlefield, falling ash, dead air. A tall war-standard bearing a golden moon circled by planets, two kettledrums lashed to the staff, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Yudhishthira, tall and slender, mid-stride, advancing, head lowered, eyes up at the viewer, holding a long gold-hafted spear hung with bells. Pale gold complexion, calm sorrowful expression, a prominent nose, large eyes, long black hair beneath a golden crown. Engraved gold armour, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a dark blue tunic. White dhoti, leather paduka sandals with plain straps, toes visible. Still grey battlefield, falling ash, dead air. A tall war-standard bearing a golden moon circled by planets, two kettledrums lashed to the staff, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Nakula

`nakula.png` · 993 chars · 148 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Nakula, lithe and handsome, leaning forward, shoulders set, turned three-quarters to his left, holding a straight steel sword and a shield decked with a thousand stars. Coppery dark skin, eyes narrowed in cold anger, a leonine neck, red eyes, the handsomest man on the field. Bright bronze armour inlaid with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a cream tunic. A billowing white battle scarf, deep red dhoti, leather paduka sandals with plain straps, toes visible. Battlefield at first light, low dawn mist. A tall war-standard bearing a gold-backed sarabha, the eight-legged beast, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Nakula, lithe and handsome, leaning forward, shoulders set, turned three-quarters to his left, holding a straight steel sword and a shield decked with a thousand stars. Coppery dark skin, eyes narrowed in cold anger, a leonine neck, red eyes, the handsomest man on the field. Bright bronze armour inlaid with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a cream tunic. A billowing white battle scarf, deep red dhoti, leather paduka sandals with plain straps, toes visible. Battlefield at first light, low dawn mist. A tall war-standard bearing a gold-backed sarabha, the eight-legged beast, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sahadeva

`sahadeva.png` · 942 chars · 140 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sahadeva, lithe and watchful, leaning forward, shoulders set, in near profile, gaze off to one side, holding a broad curved scimitar and a shield. Deep bronze skin, quiet knowing expression, long black hair bound in a topknot. Polished silver-white armour chased with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a deep indigo tunic. Dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Battlefield at first light, low dawn mist. A tall war-standard bearing a silver swan hung with small bells, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sahadeva, lithe and watchful, leaning forward, shoulders set, in near profile, gaze off to one side, holding a broad curved scimitar and a shield. Deep bronze skin, quiet knowing expression, long black hair bound in a topknot. Polished silver-white armour chased with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a deep indigo tunic. Dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Battlefield at first light, low dawn mist. A tall war-standard bearing a silver swan hung with small bells, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Abhimanyu

`abhimanyu.png` · 976 chars · 149 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Abhimanyu, a beardless youth, slight beside grown men, in a low crouch, ready to spring, squarely facing the viewer, head slightly turned, raising a chariot wheel overhead in both arms. Deep bronze skin, calm focused expression, a boy's moon-round face, raven-black lashes, three conch-lines on his neck. Engraved gold armour, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a dark blue tunic. Dark blue dhoti, bare feet. A closing ring of spears and shields on every side. A tall war-standard bearing a karnikara flower in pure gold, and a war-chariot behind him. High camera angle looking down at him, hemmed in and overwhelmed. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Abhimanyu, a beardless youth, slight beside grown men, in a low crouch, ready to spring, squarely facing the viewer, head slightly turned, raising a chariot wheel overhead in both arms. Deep bronze skin, calm focused expression, a boy's moon-round face, raven-black lashes, three conch-lines on his neck. Engraved gold armour, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a dark blue tunic. Dark blue dhoti, bare feet. A closing ring of spears and shields on every side. A tall war-standard bearing a karnikara flower in pure gold, and a war-chariot behind him. High camera angle looking down at him, hemmed in and overwhelmed. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Ghatotkacha

`ghatotkacha.png` · 919 chars · 129 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ghatotkacha, a towering tusked half-rakshasa, standing at his full height, feet apart, turned three-quarters to his right, holding a huge blazing spear upraised overhead. Dark grey skin, lips parted, breathing hard, a wild black mane. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. A coarse wool shawl over one shoulder, saffron dhoti, jewelled sandals with silver straps, toes visible. A howling dust-storm, splintered shields in the air. A tall war-standard bearing a vulture. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ghatotkacha, a towering tusked half-rakshasa, standing at his full height, feet apart, turned three-quarters to his right, holding a huge blazing spear upraised overhead. Dark grey skin, lips parted, breathing hard, a wild black mane. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. A coarse wool shawl over one shoulder, saffron dhoti, jewelled sandals with silver straps, toes visible. A howling dust-storm, splintered shields in the air. A tall war-standard bearing a vulture. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Iravan

`iravan.png` · 869 chars · 125 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Iravan, wiry, mid-stride, advancing, squarely facing the viewer, holding a sword and a battle-axe. Deep bronze skin, calm focused expression, a diadem and heavy ear-rings, handsome and young. Blue-lacquered armour banded with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a slate-grey tunic. A coarse wool shawl over one shoulder, deep red dhoti, jewelled sandals with silver straps, toes visible. Dawn mist over a wide river, reeds bent flat. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Iravan, wiry, mid-stride, advancing, squarely facing the viewer, holding a sword and a battle-axe. Deep bronze skin, calm focused expression, a diadem and heavy ear-rings, handsome and young. Blue-lacquered armour banded with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a slate-grey tunic. A coarse wool shawl over one shoulder, deep red dhoti, jewelled sandals with silver straps, toes visible. Dawn mist over a wide river, reeds bent flat. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Anjanaparvan

`anjanaparvan.png` · 947 chars · 138 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Anjanaparvan, hill-huge, half-turned, weight on his back foot, turned three-quarters to his right, holding a scimitar decked with golden stars. Jet-black skin, eyes narrowed in cold anger, hill-huge, jet black as a mass of antimony. Blue-lacquered armour banded with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a slate-grey tunic. Undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A field of tall grass flattened by wind. A tall plain white war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Anjanaparvan, hill-huge, half-turned, weight on his back foot, turned three-quarters to his right, holding a scimitar decked with golden stars. Jet-black skin, eyes narrowed in cold anger, hill-huge, jet black as a mass of antimony. Blue-lacquered armour banded with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a slate-grey tunic. Undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A field of tall grass flattened by wind. A tall plain white war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Prativindhya

`prativindhya.png` · 913 chars · 135 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Prativindhya, wiry, half-turned, weight on his back foot, turned three-quarters to his right, holding a drawn bow, arrows nocked. Deep bronze skin, a grave, steady look, long black hair bound in a topknot. Polished silver-white armour chased with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a deep indigo tunic. A crimson uttariya thrown back over one shoulder, deep red dhoti, jewelled sandals with silver straps, toes visible. A field of tall grass flattened by wind. A tall war-standard bearing the image of Dharma, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Prativindhya, wiry, half-turned, weight on his back foot, turned three-quarters to his right, holding a drawn bow, arrows nocked. Deep bronze skin, a grave, steady look, long black hair bound in a topknot. Polished silver-white armour chased with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a deep indigo tunic. A crimson uttariya thrown back over one shoulder, deep red dhoti, jewelled sandals with silver straps, toes visible. A field of tall grass flattened by wind. A tall war-standard bearing the image of Dharma, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sutasoma

`sutasoma.png` · 914 chars · 137 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sutasoma, wiry, in a low crouch, ready to spring, in near profile, gaze off to one side, holding an uplifted sword, a lance in his other hand. Deep bronze skin, a grave, steady look, a boy, a blue-lotus scimitar with an ivory handle at his belt. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. Dark blue dhoti, jewelled sandals with silver straps, toes visible. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of Marut, lord of winds, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sutasoma, wiry, in a low crouch, ready to spring, in near profile, gaze off to one side, holding an uplifted sword, a lance in his other hand. Deep bronze skin, a grave, steady look, a boy, a blue-lotus scimitar with an ivory handle at his belt. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. Dark blue dhoti, jewelled sandals with silver straps, toes visible. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of Marut, lord of winds, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shrutakarma

`shrutakarma.png` · 845 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shrutakarma, wiry, mid-stride, advancing, turned three-quarters to his right, holding a spiked iron bludgeon. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Polished silver-white armour chased with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a deep indigo tunic. Saffron dhoti, plain wooden paduka, bare toes. A field of tall grass flattened by wind. A tall war-standard bearing the image of Sakra, lord of thunder, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shrutakarma, wiry, mid-stride, advancing, turned three-quarters to his right, holding a spiked iron bludgeon. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Polished silver-white armour chased with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a deep indigo tunic. Saffron dhoti, plain wooden paduka, bare toes. A field of tall grass flattened by wind. A tall war-standard bearing the image of Sakra, lord of thunder, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shatanika

`shatanika.png` · 879 chars · 135 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shatanika, wiry, in a low crouch, ready to spring, turned three-quarters to his left, holding a bow, a full quiver of arrows on his back. Deep bronze skin, jaw set and unafraid, the youngest-looking of five brothers, still a boy. Bright bronze armour inlaid with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a cream tunic. Dark blue dhoti, leather paduka sandals with plain straps, toes visible. A field of tall grass flattened by wind. A tall war-standard bearing the image of an Ashwin horseman, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shatanika, wiry, in a low crouch, ready to spring, turned three-quarters to his left, holding a bow, a full quiver of arrows on his back. Deep bronze skin, jaw set and unafraid, the youngest-looking of five brothers, still a boy. Bright bronze armour inlaid with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a cream tunic. Dark blue dhoti, leather paduka sandals with plain straps, toes visible. A field of tall grass flattened by wind. A tall war-standard bearing the image of an Ashwin horseman, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shrutasena

`shrutasena.png` · 852 chars · 125 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shrutasena, wiry, standing at his full height, feet apart, squarely facing the viewer, head slightly turned, holding a drawn bow, pouring showers of arrows. Deep bronze skin, jaw set and unafraid, long black hair bound in a topknot. Engraved gold armour, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a dark blue tunic. Undyed dhoti, bare feet. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of an Ashwin horseman, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shrutasena, wiry, standing at his full height, feet apart, squarely facing the viewer, head slightly turned, holding a drawn bow, pouring showers of arrows. Deep bronze skin, jaw set and unafraid, long black hair bound in a topknot. Engraved gold armour, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a dark blue tunic. Undyed dhoti, bare feet. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of an Ashwin horseman, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Dhrishtadyumna

`dhrishtadyumna.png` · 956 chars · 141 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Dhrishtadyumna, hard-muscled, in a wide battle stance, in near profile, gaze off to one side, holding a drawn sword, the blade that took Drona’s head. Fire-hued skin, lips parted, breathing hard, round cheeks, huge eyes, steel armour he was born wearing. Polished silver-white armour chased with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a deep indigo tunic. A long sash knotted at the hip, ends flying, cream dhoti, plain wooden paduka, bare toes. A howling dust-storm, splintered shields in the air. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Dhrishtadyumna, hard-muscled, in a wide battle stance, in near profile, gaze off to one side, holding a drawn sword, the blade that took Drona’s head. Fire-hued skin, lips parted, breathing hard, round cheeks, huge eyes, steel armour he was born wearing. Polished silver-white armour chased with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a deep indigo tunic. A long sash knotted at the hip, ends flying, cream dhoti, plain wooden paduka, bare toes. A howling dust-storm, splintered shields in the air. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shikhandi

`shikhandi.png` · 905 chars · 129 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shikhandi, wiry, in a planted, braced stance, squarely facing the viewer, holding a bow, sun-hued arrows nocked. Deep bronze skin, jaw set and unafraid, a powerful man, no softness in the face. Blue-lacquered armour banded with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a slate-grey tunic. A billowing white battle scarf, ochre dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shikhandi, wiry, in a planted, braced stance, squarely facing the viewer, holding a bow, sun-hued arrows nocked. Deep bronze skin, jaw set and unafraid, a powerful man, no softness in the face. Blue-lacquered armour banded with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a slate-grey tunic. A billowing white battle scarf, ochre dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Drupada

`drupada.png` · 950 chars · 138 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Drupada, old but straight-backed, in a planted, braced stance, in near profile, gaze off to one side, holding a gold-decked iron dart, his bow cut away. Deep bronze skin, jaw set and unafraid, an old king, white-bearded and straight-backed. Blue-lacquered armour banded with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a slate-grey tunic. A crimson uttariya thrown back over one shoulder, white dhoti, jewelled sandals with silver straps, toes visible. Heavy rain, the ground churned to mud. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Drupada, old but straight-backed, in a planted, braced stance, in near profile, gaze off to one side, holding a gold-decked iron dart, his bow cut away. Deep bronze skin, jaw set and unafraid, an old king, white-bearded and straight-backed. Blue-lacquered armour banded with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a slate-grey tunic. A crimson uttariya thrown back over one shoulder, white dhoti, jewelled sandals with silver straps, toes visible. Heavy rain, the ground churned to mud. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yudhamanyu

`yudhamanyu.png` · 838 chars · 121 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Yudhamanyu, wiry, standing square and unmoving, turned three-quarters to his right, holding a bow and gold-decked arrows. Deep bronze skin, jaw set and unafraid, long black hair bound in a topknot. Polished silver-white armour chased with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a deep indigo tunic. Dark blue dhoti, jewelled sandals with silver straps, toes visible. Heavy rain, the ground churned to mud. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Yudhamanyu, wiry, standing square and unmoving, turned three-quarters to his right, holding a bow and gold-decked arrows. Deep bronze skin, jaw set and unafraid, long black hair bound in a topknot. Polished silver-white armour chased with gold, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a deep indigo tunic. Dark blue dhoti, jewelled sandals with silver straps, toes visible. Heavy rain, the ground churned to mud. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Uttamaujas

`uttamaujas.png` · 902 chars · 129 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Uttamaujas, wiry, half-turned, weight on his back foot, turned three-quarters to his right, holding a bow and gold-decked arrows. Deep bronze skin, eyes narrowed in cold anger, long black hair bound in a topknot. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. A gold-bordered uttariya wound across the torso, dark blue dhoti, jewelled sandals with silver straps, toes visible. A howling dust-storm, splintered shields in the air. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Uttamaujas, wiry, half-turned, weight on his back foot, turned three-quarters to his right, holding a bow and gold-decked arrows. Deep bronze skin, eyes narrowed in cold anger, long black hair bound in a topknot. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. A gold-bordered uttariya wound across the torso, dark blue dhoti, jewelled sandals with silver straps, toes visible. A howling dust-storm, splintered shields in the air. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Virata

`virata.png` · 903 chars · 133 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Virata, old and heavy-set, standing square and unmoving, squarely facing the viewer, holding a sheaf of ten lances. Deep bronze skin, jaw set and unafraid, an old king beneath a white umbrella. Blue-lacquered armour banded with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a slate-grey tunic. Dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Dawn mist over a wide river, reeds bent flat. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Virata, old and heavy-set, standing square and unmoving, squarely facing the viewer, holding a sheaf of ten lances. Deep bronze skin, jaw set and unafraid, an old king beneath a white umbrella. Blue-lacquered armour banded with gold, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a slate-grey tunic. Dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Dawn mist over a wide river, reeds bent flat. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sweta

`sweta.png` · 921 chars · 138 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sweta, hard-muscled, in a planted, braced stance, turned three-quarters to his left, holding a gold-decked dart, his bow left behind on the car. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a dark blue tunic. A billowing white battle scarf, ochre dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A field of tall grass flattened by wind. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sweta, hard-muscled, in a planted, braced stance, turned three-quarters to his left, holding a gold-decked dart, his bow left behind on the car. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a dark blue tunic. A billowing white battle scarf, ochre dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A field of tall grass flattened by wind. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sankha

`sankha.png` · 857 chars · 131 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sankha, wiry, in a planted, braced stance, head lowered, eyes up at the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, burnished steel mail studded with a hundred golden eyes. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a dark blue tunic. Saffron dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. Dawn mist over a wide river, reeds bent flat. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sankha, wiry, in a planted, braced stance, head lowered, eyes up at the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, burnished steel mail studded with a hundred golden eyes. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a dark blue tunic. Saffron dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. Dawn mist over a wide river, reeds bent flat. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Uttara

`uttara.png` · 971 chars · 145 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Uttara, a slight young prince, leaning forward, shoulders set, in near profile, gaze off to one side, holding an elephant-hook and a lance. Deep bronze skin, a grave, steady look, a frightened boy prince in heavy ear-rings. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. A coarse wool shawl over one shoulder, undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A field of tall grass flattened by wind. A tall war-standard bearing a lion, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Uttara, a slight young prince, leaning forward, shoulders set, in near profile, gaze off to one side, holding an elephant-hook and a lance. Deep bronze skin, a grave, steady look, a frightened boy prince in heavy ear-rings. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. A coarse wool shawl over one shoulder, undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A field of tall grass flattened by wind. A tall war-standard bearing a lion, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Satyaki

`satyaki.png` · 937 chars · 142 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Satyaki, hard-muscled, in a planted, braced stance, squarely facing the viewer, head slightly turned, holding a great bow tall as a sala tree, a full quiver on his back. Deep bronze skin, lips parted, breathing hard, long hair loose to the shoulder, heavy ear-rings. Engraved gold armour, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a dark blue tunic. Ochre dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A field of tall grass flattened by wind. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Satyaki, hard-muscled, in a planted, braced stance, squarely facing the viewer, head slightly turned, holding a great bow tall as a sala tree, a full quiver on his back. Deep bronze skin, lips parted, breathing hard, long hair loose to the shoulder, heavy ear-rings. Engraved gold armour, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a dark blue tunic. Ochre dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A field of tall grass flattened by wind. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Chekitana

`chekitana.png` · 913 chars · 134 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Chekitana, hard-muscled, one foot set on a broken chariot wheel, turned three-quarters to his left, holding a hero-slaying iron mace. Deep bronze skin, jaw set and unafraid, long black hair beneath a golden circlet. Bright bronze armour inlaid with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a cream tunic. Saffron dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A howling dust-storm, splintered shields in the air. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Chekitana, hard-muscled, one foot set on a broken chariot wheel, turned three-quarters to his left, holding a hero-slaying iron mace. Deep bronze skin, jaw set and unafraid, long black hair beneath a golden circlet. Bright bronze armour inlaid with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a cream tunic. Saffron dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A howling dust-storm, splintered shields in the air. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Dhrishtaketu

`dhrishtaketu.png` · 882 chars · 133 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Dhrishtaketu, of giant stature, in a wide battle stance, turned three-quarters to his left, holding an iron dart with a golden staff. Deep bronze skin, a grave, steady look, of giant stature, long fair locks and big earrings. Bright bronze armour inlaid with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a cream tunic. Deep red dhoti, leather paduka sandals with plain straps, toes visible. Dawn mist over a wide river, reeds bent flat. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Dhrishtaketu, of giant stature, in a wide battle stance, turned three-quarters to his left, holding an iron dart with a golden staff. Deep bronze skin, a grave, steady look, of giant stature, long fair locks and big earrings. Bright bronze armour inlaid with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a cream tunic. Deep red dhoti, leather paduka sandals with plain straps, toes visible. Dawn mist over a wide river, reeds bent flat. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### The Kekaya Brothers

`kekaya_brothers.png` · 862 chars · 131 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. The Kekaya Brothers, wiry, in a planted, braced stance, turned three-quarters to his left, holding bows, a full quiver each on their backs. Deep red skin, a grave, steady look, five alike in scarlet mail, red weapons, skin red as cochineal. Bright bronze armour inlaid with gold, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a cream tunic. Deep red dhoti, bare feet. A howling dust-storm, splintered shields in the air. A tall war-standard bearing five red standards together, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
The Kekaya Brothers, wiry, in a planted, braced stance, turned three-quarters to his left, holding bows, a full quiver each on their backs. Deep red skin, a grave, steady look, five alike in scarlet mail, red weapons, skin red as cochineal. Bright bronze armour inlaid with gold, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a cream tunic. Deep red dhoti, bare feet. A howling dust-storm, splintered shields in the air. A tall war-standard bearing five red standards together, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kuntibhoja

`kuntibhoja.png` · 877 chars · 127 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kuntibhoja, wiry, in a wide battle stance, squarely facing the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, jaw set and unafraid, long black hair bound in a topknot. Polished silver-white armour chased with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a deep indigo tunic. Cream dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kuntibhoja, wiry, in a wide battle stance, squarely facing the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, jaw set and unafraid, long black hair bound in a topknot. Polished silver-white armour chased with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a deep indigo tunic. Cream dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yuyutsu

`yuyutsu.png` · 838 chars · 127 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Yuyutsu, wiry, one foot set on a broken chariot wheel, head lowered, eyes up at the viewer, holding a bow, a broad-headed arrow nocked. Deep bronze skin, lips parted, breathing hard, long black hair bound in a topknot. Bright bronze armour inlaid with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a cream tunic. Saffron dhoti, leather paduka sandals with plain straps, toes visible. A field of tall grass flattened by wind. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Yuyutsu, wiry, one foot set on a broken chariot wheel, head lowered, eyes up at the viewer, holding a bow, a broad-headed arrow nocked. Deep bronze skin, lips parted, breathing hard, long black hair bound in a topknot. Bright bronze armour inlaid with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a cream tunic. Saffron dhoti, leather paduka sandals with plain straps, toes visible. A field of tall grass flattened by wind. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Pandava Footmen

`pandava_infantry.png` · 896 chars · 134 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Pandava Footmen, wiry, half-turned, weight on his back foot, in near profile, gaze off to one side, holding an iron spear and a round bossed shield. Deep bronze skin, a grave, steady look, long black hair bound in a topknot. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. A coarse wool shawl over one shoulder, dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Heavy rain, the ground churned to mud. A tall plain white war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Pandava Footmen, wiry, half-turned, weight on his back foot, in near profile, gaze off to one side, holding an iron spear and a round bossed shield. Deep bronze skin, a grave, steady look, long black hair bound in a topknot. Blue-lacquered armour banded with gold, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a slate-grey tunic. A coarse wool shawl over one shoulder, dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Heavy rain, the ground churned to mud. A tall plain white war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## The Kaurava Host (30)

### Bhishma

`bhishma.png` · 951 chars · 142 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhishma, tall and straight-backed, straight-backed and still, squarely facing the viewer, head slightly turned, holding a huge longbow six cubits long, an arrow nocked. Pale skin, expression heavy with sorrow, dressed wholly in white, white turban and white mail, an old man. Blackened steel armour chased with copper, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a black tunic. Ochre dhoti, bare feet. Battlefield beside a wide river, drifting mist. A tall war-standard bearing a golden palmyra palm and five stars on a silver staff, and a war-chariot behind him. Slightly low camera angle, grave and monumental. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhishma, tall and straight-backed, straight-backed and still, squarely facing the viewer, head slightly turned, holding a huge longbow six cubits long, an arrow nocked. Pale skin, expression heavy with sorrow, dressed wholly in white, white turban and white mail, an old man. Blackened steel armour chased with copper, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a black tunic. Ochre dhoti, bare feet. Battlefield beside a wide river, drifting mist. A tall war-standard bearing a golden palmyra palm and five stars on a silver staff, and a war-chariot behind him. Slightly low camera angle, grave and monumental. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Drona

`drona.png` · 1051 chars · 160 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Drona, lean and old, still upright, half-turned, weight on his back foot, turned three-quarters to his left, holding a bow, worn leather fences encasing his fingers. Dark skin, cold measuring expression, eighty-five years old, white locks to his ears, a grabbable topknot. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. A billowing dark ochre battle scarf, cream dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A field of broken chariots and dead horses. A tall war-standard bearing a golden altar with a water-pot and bow, a black deerskin waving from the top, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Drona, lean and old, still upright, half-turned, weight on his back foot, turned three-quarters to his left, holding a bow, worn leather fences encasing his fingers. Dark skin, cold measuring expression, eighty-five years old, white locks to his ears, a grabbable topknot. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. A billowing dark ochre battle scarf, cream dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A field of broken chariots and dead horses. A tall war-standard bearing a golden altar with a water-pot and bow, a black deerskin waving from the top, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Karna

`karna.png` · 1021 chars · 146 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Karna, broad-chested, arms like elephant trunks, leaning forward, shoulders set, turned three-quarters to his right, holding a massive ornate dark bow, a full quiver of arrows on his back. Sun-gold skin, unscarred, grim resolute expression, leonine eyes, bull shoulders, huge ornate golden earrings. Engraved gold armour, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a maroon tunic. White dhoti, plain wooden paduka, bare toes. Dusty battlefield under a low sun, drifting smoke, distant broken chariots. A tall war-standard bearing a gold elephant-girth rope set with pearls, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Karna, broad-chested, arms like elephant trunks, leaning forward, shoulders set, turned three-quarters to his right, holding a massive ornate dark bow, a full quiver of arrows on his back. Sun-gold skin, unscarred, grim resolute expression, leonine eyes, bull shoulders, huge ornate golden earrings. Engraved gold armour, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a maroon tunic. White dhoti, plain wooden paduka, bare toes. Dusty battlefield under a low sun, drifting smoke, distant broken chariots. A tall war-standard bearing a gold elephant-girth rope set with pearls, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shalya

`shalya.png` · 930 chars · 140 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shalya, hard-muscled, one foot set on a broken chariot wheel, turned three-quarters to his left, holding an iron mace wrapped in a cloth of gold. Deep bronze skin, a curled sneer, a smooth moon-like face, lotus-petal eyes, brow drawn into three lines. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. White dhoti, bare feet. A field of broken chariots and dead horses. A tall war-standard bearing the corn-goddess with a golden ploughshare, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shalya, hard-muscled, one foot set on a broken chariot wheel, turned three-quarters to his left, holding an iron mace wrapped in a cloth of gold. Deep bronze skin, a curled sneer, a smooth moon-like face, lotus-petal eyes, brow drawn into three lines. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. White dhoti, bare feet. A field of broken chariots and dead horses. A tall war-standard bearing the corn-goddess with a golden ploughshare, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Duryodhana

`duryodhana.png` · 978 chars · 142 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Duryodhana, powerfully built, in a planted, braced stance, squarely facing the viewer, holding a colossal gold-banded war-mace. Deep bronze skin, cold and measuring, enormous thighs like plantain stems, a heavy jewelled crown. Heavy bronze armour darkened with age, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a burnt-orange tunic. Dark blue dhoti, jewelled sandals with silver straps, toes visible. Night field lit by torches, long shadows. A tall war-standard bearing an elephant worked in gems, tinkling with a hundred bells, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Duryodhana, powerfully built, in a planted, braced stance, squarely facing the viewer, holding a colossal gold-banded war-mace. Deep bronze skin, cold and measuring, enormous thighs like plantain stems, a heavy jewelled crown. Heavy bronze armour darkened with age, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a burnt-orange tunic. Dark blue dhoti, jewelled sandals with silver straps, toes visible. Night field lit by torches, long shadows. A tall war-standard bearing an elephant worked in gems, tinkling with a hundred bells, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Dushasana

`dushasana.png` · 911 chars · 139 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Dushasana, wiry, standing square and unmoving, head lowered, eyes up at the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, a curled sneer, tawny yellow-brown eyes, handsome, massive arms. Engraved dark iron armour banded with gold, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a deep crimson tunic. A coarse wool shawl over one shoulder, white dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. Night field lit by torches, long shadows. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Dushasana, wiry, standing square and unmoving, head lowered, eyes up at the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, a curled sneer, tawny yellow-brown eyes, handsome, massive arms. Engraved dark iron armour banded with gold, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a deep crimson tunic. A coarse wool shawl over one shoulder, white dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. Night field lit by torches, long shadows. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vikarna

`vikarna.png` · 953 chars · 140 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vikarna, a youth, leaning forward, shoulders set, squarely facing the viewer, head slightly turned, holding a bow, his palm cased in a scarred leather fence. Deep bronze skin, proud and unsmiling, the youngest-looking, his bow-palm scarred inside a leather fence. Blackened steel armour chased with copper, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a black tunic. A heavy dark angavastram draped across the chest, ochre dhoti, leather paduka sandals with plain straps, toes visible. Ash falling steadily on a still field. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vikarna, a youth, leaning forward, shoulders set, squarely facing the viewer, head slightly turned, holding a bow, his palm cased in a scarred leather fence. Deep bronze skin, proud and unsmiling, the youngest-looking, his bow-palm scarred inside a leather fence. Blackened steel armour chased with copper, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a black tunic. A heavy dark angavastram draped across the chest, ochre dhoti, leather paduka sandals with plain straps, toes visible. Ash falling steadily on a still field. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Chitrasena

`chitrasena.png` · 861 chars · 128 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Chitrasena, wiry, half-turned, weight on his back foot, squarely facing the viewer, head slightly turned, holding a bow, the model of all bowmen. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Blackened steel armour chased with copper, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a black tunic. A billowing white battle scarf, white dhoti, bare feet. A field of broken chariots and dead horses. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Chitrasena, wiry, half-turned, weight on his back foot, squarely facing the viewer, head slightly turned, holding a bow, the model of all bowmen. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Blackened steel armour chased with copper, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a black tunic. A billowing white battle scarf, white dhoti, bare feet. A field of broken chariots and dead horses. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vivimsati

`vivimsati.png` · 877 chars · 127 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vivimsati, wiry, leaning forward, shoulders set, turned three-quarters to his left, holding a sword and a shield, his horse gone. Deep bronze skin, a curled sneer, a smiling moon face, fine nose and fair brows, conspicuously young. Blackened steel armour chased with copper, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a black tunic. White dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vivimsati, wiry, leaning forward, shoulders set, turned three-quarters to his left, holding a sword and a shield, his horse gone. Deep bronze skin, a curled sneer, a smiling moon face, fine nose and fair brows, conspicuously young. Blackened steel armour chased with copper, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a black tunic. White dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Durmukha

`durmukha.png` · 954 chars · 139 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Durmukha, wiry, standing square and unmoving, turned three-quarters to his right, holding a large bow, a full quiver of arrows on his back. Deep bronze skin, proud and unsmiling, handsome despite his name, which means foul-faced. Deep crimson-lacquered armour with brass fittings, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a maroon tunic. A heavy dark angavastram draped across the chest, undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ash falling steadily on a still field. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Durmukha, wiry, standing square and unmoving, turned three-quarters to his right, holding a large bow, a full quiver of arrows on his back. Deep bronze skin, proud and unsmiling, handsome despite his name, which means foul-faced. Deep crimson-lacquered armour with brass fittings, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a maroon tunic. A heavy dark angavastram draped across the chest, undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ash falling steadily on a still field. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Ashwatthama

`ashwatthama.png` · 992 chars · 147 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ashwatthama, hard-muscled, in a planted, braced stance, in near profile, gaze off to one side, holding a gold-hilted celestial sword and a shield of a thousand moons. Pale lotus-coloured skin, wild-eyed and snarling, a jewel-like growth on his brow he was born with, a leonine neck. Heavy bronze armour darkened with age, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a burnt-orange tunic. A heavy dark angavastram draped across the chest, dark blue dhoti, plain wooden paduka, bare toes. Night field lit by torches, long shadows. A tall war-standard bearing a golden lion’s tail, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ashwatthama, hard-muscled, in a planted, braced stance, in near profile, gaze off to one side, holding a gold-hilted celestial sword and a shield of a thousand moons. Pale lotus-coloured skin, wild-eyed and snarling, a jewel-like growth on his brow he was born with, a leonine neck. Heavy bronze armour darkened with age, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a burnt-orange tunic. A heavy dark angavastram draped across the chest, dark blue dhoti, plain wooden paduka, bare toes. Night field lit by torches, long shadows. A tall war-standard bearing a golden lion’s tail, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kripa

`kripa.png` · 1008 chars · 150 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kripa, old and spare, standing at his full height, feet apart, squarely facing the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, proud and unsmiling, an old brahmana, white-haired, a sacred thread over the armour. Deep crimson-lacquered armour with brass fittings, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a maroon tunic. A coarse wool shawl over one shoulder, ochre dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A field of broken chariots and dead horses. A tall war-standard bearing a great bovine bull, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kripa, old and spare, standing at his full height, feet apart, squarely facing the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, proud and unsmiling, an old brahmana, white-haired, a sacred thread over the armour. Deep crimson-lacquered armour with brass fittings, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a maroon tunic. A coarse wool shawl over one shoulder, ochre dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A field of broken chariots and dead horses. A tall war-standard bearing a great bovine bull, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kritavarma

`kritavarma.png` · 869 chars · 126 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kritavarma, hard-muscled, mid-stride, advancing, turned three-quarters to his left, holding a formidable bow, its staff decked with gold. Deep bronze skin, brows drawn, furious, long black hair beneath a golden circlet. Blackened steel armour chased with copper, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a black tunic. A billowing white battle scarf, ochre dhoti, bare feet. A low red sun through haze, dust hanging. A tall plain gold war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kritavarma, hard-muscled, mid-stride, advancing, turned three-quarters to his left, holding a formidable bow, its staff decked with gold. Deep bronze skin, brows drawn, furious, long black hair beneath a golden circlet. Blackened steel armour chased with copper, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a black tunic. A billowing white battle scarf, ochre dhoti, bare feet. A low red sun through haze, dust hanging. A tall plain gold war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shakuni

`shakuni.png` · 786 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shakuni, lean and sharp-featured, leaning forward, shoulders set, turned three-quarters to his right, holding a pair of ivory dice and no weapon. Deep bronze skin, smiling, eyes cold with calculation, a thin smile, grey hair. Rich unarmoured court silks with rings on every finger. White dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A low red sun through haze, dust hanging. A tall plain gold war-standard. Eye-level camera, close and conspiratorial. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shakuni, lean and sharp-featured, leaning forward, shoulders set, turned three-quarters to his right, holding a pair of ivory dice and no weapon. Deep bronze skin, smiling, eyes cold with calculation, a thin smile, grey hair. Rich unarmoured court silks with rings on every finger. White dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A low red sun through haze, dust hanging. A tall plain gold war-standard. Eye-level camera, close and conspiratorial. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Uluka

`uluka.png` · 886 chars · 134 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Uluka, wiry, leaning forward, shoulders set, turned three-quarters to his left, holding a bow slung and a message in his hand. Deep bronze skin, cold and measuring, long black hair bound in a topknot. Blackened steel armour chased with copper, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a black tunic. A crimson uttariya thrown back over one shoulder, white dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A low red sun through haze, dust hanging. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Uluka, wiry, leaning forward, shoulders set, turned three-quarters to his left, holding a bow slung and a message in his hand. Deep bronze skin, cold and measuring, long black hair bound in a topknot. Blackened steel armour chased with copper, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a black tunic. A crimson uttariya thrown back over one shoulder, white dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A low red sun through haze, dust hanging. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bahlika

`bahlika.png` · 928 chars · 142 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bahlika, the eldest man on the field, still unbent, in a planted, braced stance, turned three-quarters to his left, holding a great bow and a gold-decked iron dart. Deep bronze skin, a curled sneer, the eldest man on the field, his face still unwithered. Blackened steel armour chased with copper, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a black tunic. A billowing dark ochre battle scarf, undyed dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A low red sun through haze, dust hanging. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bahlika, the eldest man on the field, still unbent, in a planted, braced stance, turned three-quarters to his left, holding a great bow and a gold-decked iron dart. Deep bronze skin, a curled sneer, the eldest man on the field, his face still unwithered. Blackened steel armour chased with copper, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a black tunic. A billowing dark ochre battle scarf, undyed dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A low red sun through haze, dust hanging. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Somadatta

`somadatta.png` · 928 chars · 142 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Somadatta, wiry, one foot set on a broken chariot wheel, turned three-quarters to his left, holding a large bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a deep crimson tunic. A gold-bordered uttariya wound across the torso, dark blue dhoti, leather paduka sandals with plain straps, toes visible. A field of broken chariots and dead horses. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Somadatta, wiry, one foot set on a broken chariot wheel, turned three-quarters to his left, holding a large bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a deep crimson tunic. A gold-bordered uttariya wound across the torso, dark blue dhoti, leather paduka sandals with plain straps, toes visible. A field of broken chariots and dead horses. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhurishravas

`bhurishravas.png` · 1006 chars · 146 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhurishravas, hard-muscled, half-turned, weight on his back foot, squarely facing the viewer, head slightly turned, holding an upraised sword. Deep bronze skin, proud and unsmiling, his right arm hacked away, blue-black locks, eyes red as a pigeon's. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. A heavy dark angavastram draped across the chest, white dhoti, leather paduka sandals with plain straps, toes visible. Night field lit by torches, long shadows. A tall war-standard bearing a golden sacrificial stake, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhurishravas, hard-muscled, half-turned, weight on his back foot, squarely facing the viewer, head slightly turned, holding an upraised sword. Deep bronze skin, proud and unsmiling, his right arm hacked away, blue-black locks, eyes red as a pigeon's. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. A heavy dark angavastram draped across the chest, white dhoti, leather paduka sandals with plain straps, toes visible. Night field lit by torches, long shadows. A tall war-standard bearing a golden sacrificial stake, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Jayadratha

`jayadratha.png` · 963 chars · 148 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Jayadratha, wiry, half-turned, weight on his back foot, squarely facing the viewer, holding a sword and a peacock shield hung with a hundred small bells. Deep bronze skin, cold and measuring, his head shaved bald but for five tufts of hair. Heavy bronze armour darkened with age, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a burnt-orange tunic. A crimson uttariya thrown back over one shoulder, dark blue dhoti, plain wooden paduka, bare toes. Ash falling steadily on a still field. A tall war-standard bearing a silver boar on a silver staff, decked with golden chains, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Jayadratha, wiry, half-turned, weight on his back foot, squarely facing the viewer, holding a sword and a peacock shield hung with a hundred small bells. Deep bronze skin, cold and measuring, his head shaved bald but for five tufts of hair. Heavy bronze armour darkened with age, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a burnt-orange tunic. A crimson uttariya thrown back over one shoulder, dark blue dhoti, plain wooden paduka, bare toes. Ash falling steadily on a still field. A tall war-standard bearing a silver boar on a silver staff, decked with golden chains, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhagadatta

`bhagadatta.png` · 978 chars · 142 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhagadatta, very old, still broad, in a planted, braced stance, turned three-quarters to his right, holding an iron elephant-hook, the ankusa. Deep bronze skin, a curled sneer, very old, a cloth turban over white hair, a gold garland on it. Deep crimson-lacquered armour with brass fittings, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a maroon tunic. Ochre dhoti, jewelled sandals with silver straps, toes visible. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and the great war-elephant Supratika beside him, its head and tusks filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhagadatta, very old, still broad, in a planted, braced stance, turned three-quarters to his right, holding an iron elephant-hook, the ankusa. Deep bronze skin, a curled sneer, very old, a cloth turban over white hair, a gold garland on it. Deep crimson-lacquered armour with brass fittings, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a maroon tunic. Ochre dhoti, jewelled sandals with silver straps, toes visible. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and the great war-elephant Supratika beside him, its head and tusks filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vinda

`vinda.png` · 914 chars · 141 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vinda, wiry, one foot set on a broken chariot wheel, squarely facing the viewer, head slightly turned, holding a great bow, a full quiver of arrows on his back. Deep bronze skin, a curled sneer, bull-like eyes, gold armour and gold Angadas, twin to his brother. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. Saffron dhoti, leather paduka sandals with plain straps, toes visible. A low red sun through haze, dust hanging. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vinda, wiry, one foot set on a broken chariot wheel, squarely facing the viewer, head slightly turned, holding a great bow, a full quiver of arrows on his back. Deep bronze skin, a curled sneer, bull-like eyes, gold armour and gold Angadas, twin to his brother. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. Saffron dhoti, leather paduka sandals with plain straps, toes visible. A low red sun through haze, dust hanging. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Anuvinda

`anuvinda.png` · 926 chars · 139 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Anuvinda, wiry, half-turned, weight on his back foot, head lowered, eyes up at the viewer, holding a mace, his car destroyed beneath him. Deep bronze skin, proud and unsmiling, bull-like eyes, gold armour and gold Angadas, twin to his brother. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. A billowing white battle scarf, cream dhoti, leather paduka sandals with plain straps, toes visible. Night field lit by torches, long shadows. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Anuvinda, wiry, half-turned, weight on his back foot, head lowered, eyes up at the viewer, holding a mace, his car destroyed beneath him. Deep bronze skin, proud and unsmiling, bull-like eyes, gold armour and gold Angadas, twin to his brother. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. A billowing white battle scarf, cream dhoti, leather paduka sandals with plain straps, toes visible. Night field lit by torches, long shadows. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Susharma

`susharma.png` · 846 chars · 125 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Susharma, wiry, standing square and unmoving, squarely facing the viewer, head slightly turned, holding a bow, his bowstring worn as a girdle over kusa-grass robes. Deep bronze skin, brows drawn, furious, long black hair bound in a topknot. Blackened steel armour chased with copper, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a black tunic. A billowing white battle scarf, cream dhoti, bare feet. Ash falling steadily on a still field. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Susharma, wiry, standing square and unmoving, squarely facing the viewer, head slightly turned, holding a bow, his bowstring worn as a girdle over kusa-grass robes. Deep bronze skin, brows drawn, furious, long black hair bound in a topknot. Blackened steel armour chased with copper, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a black tunic. A billowing white battle scarf, cream dhoti, bare feet. Ash falling steadily on a still field. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sudakshina

`sudakshina.png` · 878 chars · 129 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sudakshina, young and thick-necked, in a wide battle stance, in near profile, gaze off to one side, holding a bow and an iron dart decked with bells. Deep bronze skin, hard contemptuous expression, young and bull-necked, arms like spiked maces, smeared with sandal. Heavy bronze armour darkened with age, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a burnt-orange tunic. Cream dhoti, plain wooden paduka, bare toes. Night field lit by torches, long shadows. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sudakshina, young and thick-necked, in a wide battle stance, in near profile, gaze off to one side, holding a bow and an iron dart decked with bells. Deep bronze skin, hard contemptuous expression, young and bull-necked, arms like spiked maces, smeared with sandal. Heavy bronze armour darkened with age, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a burnt-orange tunic. Cream dhoti, plain wooden paduka, bare toes. Night field lit by torches, long shadows. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Srutayudha

`srutayudha.png` · 837 chars · 124 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Srutayudha, wiry, half-turned, weight on his back foot, squarely facing the viewer, head slightly turned, holding the mace Varuna gave him, hero-slaying. Deep bronze skin, brows drawn, furious, long black hair bound in a topknot. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. Ochre dhoti, bare feet. A field of broken chariots and dead horses. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Srutayudha, wiry, half-turned, weight on his back foot, squarely facing the viewer, head slightly turned, holding the mace Varuna gave him, hero-slaying. Deep bronze skin, brows drawn, furious, long black hair bound in a topknot. Engraved dark iron armour banded with gold, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a deep crimson tunic. Ochre dhoti, bare feet. A field of broken chariots and dead horses. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Jalasandha

`jalasandha.png` · 1032 chars · 153 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Jalasandha, wiry, standing square and unmoving, turned three-quarters to his right, holding a scimitar and a bull’s-hide shield decked with a hundred moons. Deep bronze skin, brows drawn, furious, body smeared with red sandal-paste, a blazing gold chain round his head. Heavy bronze armour darkened with age, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a burnt-orange tunic. A long sash knotted at the hip, ends flying, dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A field of broken chariots and dead horses. A tall plain gold war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Jalasandha, wiry, standing square and unmoving, turned three-quarters to his right, holding a scimitar and a bull’s-hide shield decked with a hundred moons. Deep bronze skin, brows drawn, furious, body smeared with red sandal-paste, a blazing gold chain round his head. Heavy bronze armour darkened with age, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a burnt-orange tunic. A long sash knotted at the hip, ends flying, dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. A field of broken chariots and dead horses. A tall plain gold war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Alambusha

`alambusha.png` · 837 chars · 120 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Alambusha, wiry, standing square and unmoving, turned three-quarters to his left, holding a bow and the sword that beheaded Iravan. Jet-black skin, hard contemptuous expression, a heaped mass of black antimony, huge and dark. Blackened steel armour chased with copper, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a black tunic. Dark blue dhoti, bare feet. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Alambusha, wiry, standing square and unmoving, turned three-quarters to his left, holding a bow and the sword that beheaded Iravan. Jet-black skin, hard contemptuous expression, a heaped mass of black antimony, huge and dark. Blackened steel armour chased with copper, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a black tunic. Dark blue dhoti, bare feet. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Alayudha

`alayudha.png` · 998 chars · 138 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Alayudha, hard-muscled, leaning forward, shoulders set, turned three-quarters to his right, holding a gigantic iron-bound parigha club. Elephant-hide black skin, brows drawn, furious, strikingly handsome for a rakshasa, jewelled armlets and diadem. Deep crimson-lacquered armour with brass fittings, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a maroon tunic. Dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ash falling steadily on a still field. A tall plain gold war-standard, and a great war-elephant beside him, its head and trunk filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Alayudha, hard-muscled, leaning forward, shoulders set, turned three-quarters to his right, holding a gigantic iron-bound parigha club. Elephant-hide black skin, brows drawn, furious, strikingly handsome for a rakshasa, jewelled armlets and diadem. Deep crimson-lacquered armour with brass fittings, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a maroon tunic. Dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ash falling steadily on a still field. A tall plain gold war-standard, and a great war-elephant beside him, its head and trunk filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vrishasena

`vrishasena.png` · 920 chars · 136 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vrishasena, a young man, mid-stride, advancing, squarely facing the viewer, head slightly turned, holding a bow, a full quiver of arrows on his back. Deep bronze skin, proud and unsmiling, youthful, barely past boyhood. Blackened steel armour chased with copper, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a black tunic. A billowing dark ochre battle scarf, dark blue dhoti, bare feet. A field of broken chariots and dead horses. A tall war-standard bearing a golden peacock caught mid-cry, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vrishasena, a young man, mid-stride, advancing, squarely facing the viewer, head slightly turned, holding a bow, a full quiver of arrows on his back. Deep bronze skin, proud and unsmiling, youthful, barely past boyhood. Blackened steel armour chased with copper, embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt, over a black tunic. A billowing dark ochre battle scarf, dark blue dhoti, bare feet. A field of broken chariots and dead horses. A tall war-standard bearing a golden peacock caught mid-cry, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kaurava Footmen

`kaurava_infantry.png` · 819 chars · 122 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kaurava Footmen, wiry, in a planted, braced stance, in near profile, gaze off to one side, holding an iron spear and a round bossed shield. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Deep crimson-lacquered armour with brass fittings, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a maroon tunic. Saffron dhoti, plain wooden paduka, bare toes. A field of broken chariots and dead horses. A tall plain gold war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kaurava Footmen, wiry, in a planted, braced stance, in near profile, gaze off to one side, holding an iron spear and a round bossed shield. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Deep crimson-lacquered armour with brass fittings, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a maroon tunic. Saffron dhoti, plain wooden paduka, bare toes. A field of broken chariots and dead horses. A tall plain gold war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## The Asura Host (15)

### Ravana

`ravana.png` · 1052 chars · 158 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ravana, a colossal rakshasa king, leaning forward, shoulders set, in near profile, gaze off to one side, holding a great bow, the curved sword Chandrahasa at his belt. Dark lapis-blue skin chased with gold, all ten faces roaring at once, ten crowned heads and twenty arms, white teeth, chest gouged by an elephant's tusk. Green-lacquered armour banded with dark iron, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a black tunic. Undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Smoke pouring from a fissure in the ground. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ravana, a colossal rakshasa king, leaning forward, shoulders set, in near profile, gaze off to one side, holding a great bow, the curved sword Chandrahasa at his belt. Dark lapis-blue skin chased with gold, all ten faces roaring at once, ten crowned heads and twenty arms, white teeth, chest gouged by an elephant's tusk. Green-lacquered armour banded with dark iron, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a black tunic. Undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Smoke pouring from a fissure in the ground. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kumbhakarna

`kumbhakarna.png` · 981 chars · 144 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kumbhakarna, a mountainous tusked giant, leaning forward, shoulders set, squarely facing the viewer, holding a huge sharp iron pike, a shula. Ashen grey skin, teeth bared in a snarl, half-shut eyes heavy with sleep, nostrils a man could crawl through. Green-lacquered armour banded with dark iron, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a black tunic. A crimson uttariya thrown back over one shoulder, dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Smoke pouring from a fissure in the ground. A tall ragged black war-standard. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kumbhakarna, a mountainous tusked giant, leaning forward, shoulders set, squarely facing the viewer, holding a huge sharp iron pike, a shula. Ashen grey skin, teeth bared in a snarl, half-shut eyes heavy with sleep, nostrils a man could crawl through. Green-lacquered armour banded with dark iron, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a black tunic. A crimson uttariya thrown back over one shoulder, dark blue dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Smoke pouring from a fissure in the ground. A tall ragged black war-standard. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Indrajit

`indrajit.png` · 1048 chars · 152 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Indrajit, powerfully built, in a low crouch, ready to spring, in near profile, gaze off to one side, holding a gold-adorned bow, serpent-arrows nocked. Ashen grey skin, serene merciless expression, half-dissolved into thundercloud, only his bow solid. Ash-grey iron armour with bone fittings, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a dark green tunic. A long sash knotted at the hip, ends flying, deep red dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Indrajit, powerfully built, in a low crouch, ready to spring, in near profile, gaze off to one side, holding a gold-adorned bow, serpent-arrows nocked. Ashen grey skin, serene merciless expression, half-dissolved into thundercloud, only his bow solid. Ash-grey iron armour with bone fittings, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a dark green tunic. A long sash knotted at the hip, ends flying, deep red dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Hiranyakashipu

`hiranyakashipu.png` · 1006 chars · 147 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Hiranyakashipu, powerfully built, in a wide battle stance, in near profile, gaze off to one side, holding a heavy mace. Molten-gold skin, roaring, mouth wide open, limbs of molten gold, skin still pitted where ants ate him. Ash-grey iron armour with bone fittings, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a rust-brown tunic. A billowing dark ochre battle scarf, deep red dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Hiranyakashipu, powerfully built, in a wide battle stance, in near profile, gaze off to one side, holding a heavy mace. Molten-gold skin, roaring, mouth wide open, limbs of molten gold, skin still pitted where ants ate him. Ash-grey iron armour with bone fittings, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a rust-brown tunic. A billowing dark ochre battle scarf, deep red dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Hiranyaksha

`hiranyaksha.png` · 886 chars · 131 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Hiranyaksha, wiry, in a wide battle stance, squarely facing the viewer, holding a massive mace. Ashen grey skin, roaring, mouth wide open, brown hair standing out stiff like swords, gold anklets. Green-lacquered armour banded with dark iron, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a black tunic. A billowing white battle scarf, dark blue dhoti, plain wooden paduka, bare toes. Smoke pouring from a fissure in the ground. A tall ragged black war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Hiranyaksha, wiry, in a wide battle stance, squarely facing the viewer, holding a massive mace. Ashen grey skin, roaring, mouth wide open, brown hair standing out stiff like swords, gold anklets. Green-lacquered armour banded with dark iron, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a black tunic. A billowing white battle scarf, dark blue dhoti, plain wooden paduka, bare toes. Smoke pouring from a fissure in the ground. A tall ragged black war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bali

`bali.png` · 902 chars · 133 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bali, hard-muscled, in a wide battle stance, squarely facing the viewer, head slightly turned, holding a water-pot, poised to pour the water of the gift. Ashen grey skin, roaring, mouth wide open, long black hair beneath a golden circlet. Rough unpolished dark scale armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a rust-brown tunic. Undyed dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A cracked plain under a starless sky. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bali, hard-muscled, in a wide battle stance, squarely facing the viewer, head slightly turned, holding a water-pot, poised to pour the water of the gift. Ashen grey skin, roaring, mouth wide open, long black hair beneath a golden circlet. Rough unpolished dark scale armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a rust-brown tunic. Undyed dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A cracked plain under a starless sky. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Prahlada

`prahlada.png` · 537 chars · 80 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Prahlada, a boy of five, in near profile, gaze off to one side. Warm brown skin, serene, wholly unafraid, empty palms pressed together at his chest. Plain undyed cloth and no armour. Simple white dhoti, bare feet. A pillared hall, lamps guttering. Eye-level camera, quiet and close. Whole figure inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Prahlada, a boy of five, in near profile, gaze off to one side. Warm brown skin, serene, wholly unafraid, empty palms pressed together at his chest. Plain undyed cloth and no armour. Simple white dhoti, bare feet. A pillared hall, lamps guttering. Eye-level camera, quiet and close. Whole figure inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Narakasura

`narakasura.png` · 877 chars · 127 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Narakasura, hard-muscled, in a planted, braced stance, squarely facing the viewer, holding a spear. Ashen grey skin, roaring, mouth wide open, long black hair beneath a golden circlet. Green-lacquered armour banded with dark iron, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a black tunic. Undyed dhoti, plain wooden paduka, bare toes. Smoke pouring from a fissure in the ground. A tall ragged black war-standard, and a great war-elephant beside him, its head and tusks filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Narakasura, hard-muscled, in a planted, braced stance, squarely facing the viewer, holding a spear. Ashen grey skin, roaring, mouth wide open, long black hair beneath a golden circlet. Green-lacquered armour banded with dark iron, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a black tunic. Undyed dhoti, plain wooden paduka, bare toes. Smoke pouring from a fissure in the ground. A tall ragged black war-standard, and a great war-elephant beside him, its head and tusks filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Mahishasura

`mahishasura.png` · 1029 chars · 155 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Mahishasura, a huge warrior emerging from the neck of a slain buffalo, standing square and unmoving, squarely facing the viewer, head slightly turned, holding a sword and shield. Ashen grey skin, teeth bared in a snarl, half issuing from the mouth of a great black buffalo. Rough unpolished dark scale armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a rust-brown tunic. A gold-bordered uttariya wound across the torso, cream dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A cracked plain under a starless sky. A tall ragged black war-standard, and a great war-elephant beside him, its head and trunk filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Mahishasura, a huge warrior emerging from the neck of a slain buffalo, standing square and unmoving, squarely facing the viewer, head slightly turned, holding a sword and shield. Ashen grey skin, teeth bared in a snarl, half issuing from the mouth of a great black buffalo. Rough unpolished dark scale armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a rust-brown tunic. A gold-bordered uttariya wound across the torso, cream dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A cracked plain under a starless sky. A tall ragged black war-standard, and a great war-elephant beside him, its head and trunk filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shumbha

`shumbha.png` · 953 chars · 136 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shumbha, hard-muscled, leaning forward, shoulders set, turned three-quarters to his left, holding a scimitar and a shield blazoned with a hundred moons. Ashen grey skin, eyes burning, jaw clenched, eight arms lifted high, filling the sky. Engraved blackened bronze armour, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a rust-brown tunic. A gold-bordered uttariya wound across the torso, saffron dhoti, leather paduka sandals with plain straps, toes visible. A burnt forest, black trunks still standing. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shumbha, hard-muscled, leaning forward, shoulders set, turned three-quarters to his left, holding a scimitar and a shield blazoned with a hundred moons. Ashen grey skin, eyes burning, jaw clenched, eight arms lifted high, filling the sky. Engraved blackened bronze armour, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a rust-brown tunic. A gold-bordered uttariya wound across the torso, saffron dhoti, leather paduka sandals with plain straps, toes visible. A burnt forest, black trunks still standing. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Nishumbha

`nishumbha.png` · 893 chars · 131 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Nishumbha, wiry, in a wide battle stance, squarely facing the viewer, holding a sharp scimitar and a glittering shield. Ashen grey skin, roaring, mouth wide open, a second armed man bursting out of his pierced chest. Ash-grey iron armour with bone fittings, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a rust-brown tunic. A long sash knotted at the hip, ends flying, saffron dhoti, plain wooden paduka, bare toes. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Nishumbha, wiry, in a wide battle stance, squarely facing the viewer, holding a sharp scimitar and a glittering shield. Ashen grey skin, roaring, mouth wide open, a second armed man bursting out of his pierced chest. Ash-grey iron armour with bone fittings, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over a rust-brown tunic. A long sash knotted at the hip, ends flying, saffron dhoti, plain wooden paduka, bare toes. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Raktabija

`raktabija.png` · 932 chars · 136 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Raktabija, wiry, in a wide battle stance, turned three-quarters to his right, holding a heavy iron club. Ashen grey skin, eyes burning, jaw clenched, blood running from many wounds, each fallen drop rising as a duplicate. Ash-grey iron armour with bone fittings, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a rust-brown tunic. A heavy dark angavastram draped across the chest, deep red dhoti, jewelled sandals with silver straps, toes visible. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Raktabija, wiry, in a wide battle stance, turned three-quarters to his right, holding a heavy iron club. Ashen grey skin, eyes burning, jaw clenched, blood running from many wounds, each fallen drop rising as a duplicate. Ash-grey iron armour with bone fittings, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a rust-brown tunic. A heavy dark angavastram draped across the chest, deep red dhoti, jewelled sandals with silver straps, toes visible. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vritra

`vritra.png` · 955 chars · 142 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vritra, a mountain-shaped giant, vast beyond any man, standing square and unmoving, squarely facing the viewer, head slightly turned, holding a great trident. Ashen grey skin, jaws parted, eyes cold, a mouth wide enough to swallow a god whole. Engraved blackened bronze armour, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a dark green tunic. A coarse wool shawl over one shoulder, cream dhoti, leather paduka sandals with plain straps, toes visible. A withheld storm over dry riverbeds, no rain falling. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vritra, a mountain-shaped giant, vast beyond any man, standing square and unmoving, squarely facing the viewer, head slightly turned, holding a great trident. Ashen grey skin, jaws parted, eyes cold, a mouth wide enough to swallow a god whole. Engraved blackened bronze armour, lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt, over a dark green tunic. A coarse wool shawl over one shoulder, cream dhoti, leather paduka sandals with plain straps, toes visible. A withheld storm over dry riverbeds, no rain falling. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Tarakasura

`tarakasura.png` · 871 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Tarakasura, wiry, standing square and unmoving, squarely facing the viewer, holding a great spear. Ashen grey skin, eyes burning, jaw clenched, long black hair bound in a topknot. Ash-grey iron armour with bone fittings, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a dark green tunic. Undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Tarakasura, wiry, standing square and unmoving, squarely facing the viewer, holding a great spear. Ashen grey skin, eyes burning, jaw clenched, long black hair bound in a topknot. Ash-grey iron armour with bone fittings, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over a dark green tunic. Undyed dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Asura Horde

`asura_horde.png` · 877 chars · 135 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Asura Horde, wiry, in a planted, braced stance, in near profile, gaze off to one side, holding an iron spear and a round bossed shield. Ashen grey skin, eyes burning, jaw clenched, long black hair bound in a topknot. Green-lacquered armour banded with dark iron, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a dark green tunic. A long sash knotted at the hip, ends flying, saffron dhoti, jewelled sandals with silver straps, toes visible. Smoke pouring from a fissure in the ground. A tall ragged black war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Asura Horde, wiry, in a planted, braced stance, in near profile, gaze off to one side, holding an iron spear and a round bossed shield. Ashen grey skin, eyes burning, jaw clenched, long black hair bound in a topknot. Green-lacquered armour banded with dark iron, quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt, over a dark green tunic. A long sash knotted at the hip, ends flying, saffron dhoti, jewelled sandals with silver straps, toes visible. Smoke pouring from a fissure in the ground. A tall ragged black war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## Those Who Stood Apart (6)

### Barbarika

`barbarika.png` · 963 chars · 143 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Barbarika, powerfully built, in a wide battle stance, in near profile, gaze off to one side, holding a bow with three arrows and nothing else in his quiver. Deep bronze skin, calm, already resigned, three arrows and nothing else in his quiver. Plain burnished steel armour, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over an undyed linen tunic. A billowing white battle scarf, saffron dhoti, jewelled sandals with silver straps, toes visible. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Barbarika, powerfully built, in a wide battle stance, in near profile, gaze off to one side, holding a bow with three arrows and nothing else in his quiver. Deep bronze skin, calm, already resigned, three arrows and nothing else in his quiver. Plain burnished steel armour, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over an undyed linen tunic. A billowing white battle scarf, saffron dhoti, jewelled sandals with silver straps, toes visible. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Jarasandha

`jarasandha.png` · 1013 chars · 152 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Jarasandha, immense and thick-limbed, one foot set on a broken chariot wheel, squarely facing the viewer, holding a heavy iron mace in both hands. Deep bronze skin, calm to the point of coldness, his crown set aside, hair bound up in a wrestler’s knot. Engraved silver armour, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over an undyed linen tunic. A crimson uttariya thrown back over one shoulder, saffron dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Still water and reeds, nothing moving. A tall plain grey war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Jarasandha, immense and thick-limbed, one foot set on a broken chariot wheel, squarely facing the viewer, holding a heavy iron mace in both hands. Deep bronze skin, calm to the point of coldness, his crown set aside, hair bound up in a wrestler’s knot. Engraved silver armour, scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt, over an undyed linen tunic. A crimson uttariya thrown back over one shoulder, saffron dhoti, open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves. Still water and reeds, nothing moving. A tall plain grey war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Balarama

`balarama.png` · 947 chars · 140 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Balarama, hard-muscled, one foot set on a broken chariot wheel, in near profile, gaze off to one side, holding a plough in one hand and a heavy pestle-club in the other. Fair skin, turned away, refusing the field, fair-skinned in blue silk, eyes red-rimmed with wine. Plain burnished steel armour, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over an undyed linen tunic. A heavy dark angavastram draped across the chest, saffron dhoti, jewelled sandals with silver straps, toes visible. Still water and reeds, nothing moving. A tall war-standard bearing a palmyra palm. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Balarama, hard-muscled, one foot set on a broken chariot wheel, in near profile, gaze off to one side, holding a plough in one hand and a heavy pestle-club in the other. Fair skin, turned away, refusing the field, fair-skinned in blue silk, eyes red-rimmed with wine. Plain burnished steel armour, banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt, over an undyed linen tunic. A heavy dark angavastram draped across the chest, saffron dhoti, jewelled sandals with silver straps, toes visible. Still water and reeds, nothing moving. A tall war-standard bearing a palmyra palm. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Ekalavya

`ekalavya.png` · 797 chars · 122 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ekalavya, hard-muscled, in a wide battle stance, squarely facing the viewer, head slightly turned, drawing a bow, fingers cased in a leather guard, right thumb gone. Dark skin, unbowed, jaw set, dark-skinned, body caked in filth, matted locks, black rags. Plain forest dress and no armour. A long sash knotted at the hip, ends flying, white dhoti, bare feet. A cold mountain pass, snow on the rocks. A tall plain grey war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ekalavya, hard-muscled, in a wide battle stance, squarely facing the viewer, head slightly turned, drawing a bow, fingers cased in a leather guard, right thumb gone. Dark skin, unbowed, jaw set, dark-skinned, body caked in filth, matted locks, black rags. Plain forest dress and no armour. A long sash knotted at the hip, ends flying, white dhoti, bare feet. A cold mountain pass, snow on the rocks. A tall plain grey war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shishupala

`shishupala.png` · 892 chars · 130 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shishupala, hard-muscled, standing square and unmoving, head lowered, eyes up at the viewer, holding a great bow he strains at and cannot string. Deep bronze skin, level unreadable expression, ordinary and two-armed, eyes copper-red with rage. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a grey tunic. Deep red dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A cold mountain pass, snow on the rocks. A tall plain grey war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shishupala, hard-muscled, standing square and unmoving, head lowered, eyes up at the viewer, holding a great bow he strains at and cannot string. Deep bronze skin, level unreadable expression, ordinary and two-armed, eyes copper-red with rage. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a grey tunic. Deep red dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A cold mountain pass, snow on the rocks. A tall plain grey war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Rukmi

`rukmi.png` · 870 chars · 127 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Rukmi, wiry, standing square and unmoving, squarely facing the viewer, head slightly turned, holding an ornate golden celestial longbow, unstrung. Deep bronze skin, weary but resolute, long black hair bound in a topknot. Weathered grey-green bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a grey tunic. A billowing white battle scarf, deep red dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A bare plain at first light. A tall plain grey war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Rukmi, wiry, standing square and unmoving, squarely facing the viewer, head slightly turned, holding an ornate golden celestial longbow, unstrung. Deep bronze skin, weary but resolute, long black hair bound in a topknot. Weathered grey-green bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt, over a grey tunic. A billowing white battle scarf, deep red dhoti, sandals laced with crossed leather thongs to the ankle, toes visible. A bare plain at first light. A tall plain grey war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## Astras (19)

### Brahma-Astra

`brahmastra.png` · 1293 chars · 223 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Brahmastra, the weapon of Brahma, carrying his sign the lotus: a rising arrow becoming one great open lotus of deep saffron and rose, every petal edged like a blade, a ring of white fire turning behind it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Brahmastra, the weapon of Brahma, carrying his sign the lotus: a rising arrow becoming one great open lotus of deep saffron and rose, every petal edged like a blade, a ring of white fire turning behind it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Brahmashirsha-Astra

`brahmashirsha.png` · 1297 chars · 221 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Brahmashirsha, the Brahmastra raised past recall: four lotuses of saffron and gold fused into a single flower facing the four quarters, every petal a blade, a column of white fire driven up through its centre. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Brahmashirsha, the Brahmastra raised past recall: four lotuses of saffron and gold fused into a single flower facing the four quarters, every petal a blade, a column of white fire driven up through its centre. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Pashupat-Astra

`pashupatastra.png` · 1056 chars · 173 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Pashupatastra, the weapon of Shiva, carrying his signs: a great three-pronged trident standing alone, a thin silver crescent caught between its prongs, green-black serpents coiled down its haft, ash-white fire along every edge. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Pashupatastra, the weapon of Shiva, carrying his signs: a great three-pronged trident standing alone, a thin silver crescent caught between its prongs, green-black serpents coiled down its haft, ash-white fire along every edge. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Narayan-Astra

`narayanastra.png` · 1096 chars · 185 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Narayanastra, the weapon of Vishnu, carrying his sign the discus: one blazing indigo and gold discus at the centre, arrows streaming outward from it in every direction and each turning into a different weapon as it goes, discs and spears and maces, all trailing fire. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Narayanastra, the weapon of Vishnu, carrying his sign the discus: one blazing indigo and gold discus at the centre, arrows streaming outward from it in every direction and each turning into a different weapon as it goes, discs and spears and maces, all trailing fire. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Vaishnav-Astra

`vaishnavastra.png` · 1134 chars · 196 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Vaishnavastra, the weapon of Vishnu, carrying his sign the discus: an elephant-goad of deep indigo and gold held aloft, a burning discus opening out of its hook, its rim a ring of curved blades. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. A weapon held and thrown by hand, not an arrow: no bowstring, no fletching, no shaft of any kind in the frame. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Vaishnavastra, the weapon of Vishnu, carrying his sign the discus: an elephant-goad of deep indigo and gold held aloft, a burning discus opening out of its hook, its rim a ring of curved blades. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. A weapon held and thrown by hand, not an arrow: no bowstring, no fletching, no shaft of any kind in the frame. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Vasavi Shakti

`vasavi_shakti.png` · 1150 chars · 198 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Vasavi Shakti, the dart Indra gave for one throw only, carrying his sign the thunderbolt: a single short barbed javelin of amber and brass, its grip a braided vajra, arcs of lightning leaping between the barbs. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. A weapon held and thrown by hand, not an arrow: no bowstring, no fletching, no shaft of any kind in the frame. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Vasavi Shakti, the dart Indra gave for one throw only, carrying his sign the thunderbolt: a single short barbed javelin of amber and brass, its grip a braided vajra, arcs of lightning leaping between the barbs. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. A weapon held and thrown by hand, not an arrow: no bowstring, no fletching, no shaft of any kind in the frame. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Aindra-Astra

`aindrastra.png` · 1273 chars · 219 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. An Aindrastra, the weapon of Indra: a dense sheaf of arrows rising point-upward in a solid column, every shaft a thread of white lightning, an amber vajra burning at the core of the mass. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
An Aindrastra, the weapon of Indra: a dense sheaf of arrows rising point-upward in a solid column, every shaft a thread of white lightning, an amber vajra burning at the core of the mass. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Agney-Astra

`agneyastra.png` · 1019 chars · 174 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. An Agneyastra, the weapon of Agni: a wall of orange and white-hot fire rising, its crest breaking into seven distinct tongues, a pair of spiralling ram horns of white flame in the heart of it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
An Agneyastra, the weapon of Agni: a wall of orange and white-hot fire rising, its crest breaking into seven distinct tongues, a pair of spiralling ram horns of white flame in the heart of it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Varun-Astra

`varunastra.png` · 1295 chars · 222 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Varunastra, the weapon of Varuna, carrying his sign the noose: a rising coil of deep blue-green water lit from within, a great noose of white foam turning at its heart, the whole column crested and breaking. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Varunastra, the weapon of Varuna, carrying his sign the noose: a rising coil of deep blue-green water lit from within, a great noose of white foam turning at its heart, the whole column crested and breaking. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Vayavya-Astra

`vayavyastra.png` · 980 chars · 166 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Vayavyastra, the weapon of Vayu: a rising funnel of pale grey-green wind, its walls scored into blade-edges, a torn banner whipping at the crown of it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Vayavyastra, the weapon of Vayu: a rising funnel of pale grey-green wind, its walls scored into blade-edges, a torn banner whipping at the crown of it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Nag-Astra

`nagastra.png` · 1249 chars · 214 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Nagastra, the serpent weapon: a rising arrow whose head is a single great cobra of green-black and amber, hood spread wide, the shaft scaled like a snake’s back. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Nagastra, the serpent weapon: a rising arrow whose head is a single great cobra of green-black and amber, hood spread wide, the shaft scaled like a snake’s back. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Sauparn-Astra

`sauparna.png` · 1245 chars · 213 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Sauparna, the Garuda weapon: a rising arrow becoming a vast pair of outspread wings of white and copper fire, talons closing on a green serpent beneath them. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Sauparna, the Garuda weapon: a rising arrow becoming a vast pair of outspread wings of white and copper fire, talons closing on a green serpent beneath them. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Bhargav-Astra

`bhargavastra.png` · 1255 chars · 214 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Bhargavastra, the weapon of Parashurama of the Bhrigus: a rising arrow becoming countless arrows in a widening fan, a great red-gold axe burning at the origin of them. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Bhargavastra, the weapon of Parashurama of the Bhrigus: a rising arrow becoming countless arrows in a widening fan, a great red-gold axe burning at the origin of them. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Sammohan-Astra

`sammohana.png` · 1014 chars · 173 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Sammohana, the weapon that leaves an army standing and dreaming: a slow spiral of pale indigo light turning in on itself, ring within ring, each ring drifting out of true with the next. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Sammohana, the weapon that leaves an army standing and dreaming: a slow spiral of pale indigo light turning in on itself, ring within ring, each ring drifting out of true with the next. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Tvashtra-Astra

`tvashtra.png` · 1273 chars · 217 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Tvashtra, the weapon of the divine artificer: one rising arrow becoming three identical arrows, and those three becoming nine, each rank fainter and cooler than the rank in front of it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Tvashtra, the weapon of the divine artificer: one rising arrow becoming three identical arrows, and those three becoming nine, each rank fainter and cooler than the rank in front of it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Praswapa-Astra

`praswapa.png` · 1240 chars · 212 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Praswapa, the sleep Prajapati gave: one great lotus of pale gold closed tight for the night, eight small flames standing motionless in a ring around it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Praswapa, the sleep Prajapati gave: one great lotus of pale gold closed tight for the night, eight small flames standing motionless in a ring around it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Samvodhan-Astra

`samvodhana.png` · 1011 chars · 170 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Samvodhana, the waking Prajapati gave alongside the sleep: a great brass bell struck and still ringing, hard rings of sound breaking outward from its lip, a lotus opening beneath it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Samvodhana, the waking Prajapati gave alongside the sleep: a great brass bell struck and still ringing, hard rings of sound breaking outward from its lip, a lotus opening beneath it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Prajna-Astra

`prajna.png` · 1010 chars · 173 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. A Prajna, the weapon of wakefulness that no stupor can close: a single tall lamp of white and brass fire that will not gutter, rings of small burning script in orbit around its flame. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
A Prajna, the weapon of wakefulness that no stupor can close: a single tall lamp of white and brass fire that will not gutter, rings of small burning script in orbit around its flame. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Antardhan-Astra

`antardhana.png` · 1284 chars · 217 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. An Antardhana, the arrow Shiva loosed to unmake the three cities: a rising shaft strung with three burning fortress-cities like beads, a thin silver crescent above them where the arrowhead would be. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
An Antardhana, the arrow Shiva loosed to unmake the three cities: a rising shaft strung with three burning fortress-cities like beads, a thin silver crescent above them where the arrowhead would be. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The lower shaft is plainly an arrow, its nock and fletching clear at the base. No arrowhead, and no seam or contact line: partway up the shaft breaks into embers and streaming light and flows into the emblem, becoming it. One single object, not two touching. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

## The Named Weapons (6)

### Asi, the First Sword

`asi.png` · 987 chars · 165 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. Asi, the first sword ever forged: a single straight double-edged blade rising point-upward, lac-red fire running its length, a ring of white flame at the guard. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
Asi, the first sword ever forged: a single straight double-edged blade rising point-upward, lac-red fire running its length, a ring of white flame at the guard. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Gandiva

`gandiva.png` · 1024 chars · 174 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. Gandiva, the bow Varuna gave: a single immense war bow held upright and strung, its limbs bound in gold and silver and carved with running water, one arrow of white fire nocked and pointing upward. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
Gandiva, the bow Varuna gave: a single immense war bow held upright and strung, its limbs bound in gold and silver and carved with running water, one arrow of white fire nocked and pointing upward. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Kaumodaki

`kaumodaki.png` · 1032 chars · 174 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. Kaumodaki, the mace Varuna gave Krishna: a single heavy mace standing upright, its head a fluted globe banded in brass and indigo, a peal of thunder drawn as hard concentric rings breaking outward from it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
Kaumodaki, the mace Varuna gave Krishna: a single heavy mace standing upright, its head a fluted globe banded in brass and indigo, a peal of thunder drawn as hard concentric rings breaking outward from it. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Chandrahasa

`chandrahasa.png` · 1045 chars · 173 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. Chandrahasa, the moon-laughter sword Shiva gave Ravana: a single curved blade rising point-upward, a thin silver crescent set into the pommel, cold blue-white light along the cutting edge, a serpent coiled at the grip. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
Chandrahasa, the moon-laughter sword Shiva gave Ravana: a single curved blade rising point-upward, a thin silver crescent set into the pommel, cold blue-white light along the cutting edge, a serpent coiled at the grip. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Vajra

`vajra.png` · 1033 chars · 177 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. Vajra, the thunderbolt cut from the bones of Dadhichi: a single bolt held upright, a ribbed grip of white bone flaring into a cage of curved prongs at each end, arcs of amber light leaping between the tips. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
Vajra, the thunderbolt cut from the bones of Dadhichi: a single bolt held upright, a ribbed grip of white bone flaring into a cage of curved prongs at each end, arcs of amber light leaping between the tips. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

### Parasu

`parasu.png` · 1034 chars · 177 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, burning against black in the same ground pigments as the rest of the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro. Parasu, the axe Shiva gave Parashurama: a single great battle-axe rising upright, a broad crescent blade of lac red and brass on a long haft, the edge burning white, a trident cut into the flat of the blade. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

With style reference:

```
Parasu, the axe Shiva gave Parashurama: a single great battle-axe rising upright, a broad crescent blade of lac red and brass on a long haft, the edge burning white, a trident cut into the flat of the blade. Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image. Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black. The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size. A hard rim of white light around the subject and a wide burning corona beyond it. No photorealism, no 3D rendering, no glossy surfaces.
```

## Stratagems (1)

### "Ashwatthama is Dead"

`ashwatthama_elephant.png` · 390 chars · 57 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A war elephant falling in smoke, a lie taking shape above it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A war elephant falling in smoke, a lie taking shape above it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## Vardaan and Fates (7)

### Krishna, the Charioteer

`krishna_charioteer.png` · 473 chars · 69 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A blue-skinned charioteer in flowing yellow silks and no armour, a peacock feather in his crown, holding the reins and a white conch, serene and faintly smiling. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A blue-skinned charioteer in flowing yellow silks and no armour, a peacock feather in his crown, holding the reins and a white conch, serene and faintly smiling. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Brahma’s Bargain

`brahmas_bargain.png` · 420 chars · 59 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Two asura brothers kneeling before a four-faced god, one boon between them, each already watching the other. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Two asura brothers kneeling before a four-faced god, one boon between them, each already watching the other. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kunti’s Invocation

`kunti_invocation.png` · 395 chars · 58 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A woman with closed eyes speaking a mantra, a god half-formed in the air above her. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A woman with closed eyes speaking a mantra, a god half-formed in the air above her. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Surya’s Kavacha

`surya_kavacha.png` · 416 chars · 59 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Golden armour and earrings glowing with sunlight, worn by no one, floating in darkness. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Golden armour and earrings glowing with sunlight, worn by no one, floating in darkness. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### The Ashwins’ Draught

`ashwins_draught.png` · 379 chars · 51 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Twin physician-gods pouring a luminous draught, horses behind them. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Twin physician-gods pouring a luminous draught, horses behind them. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### The Fury of Vayu

`vayu_fury.png` · 402 chars · 57 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A gale tearing across a battlefield, banners and men going over together. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A gale tearing across a battlefield, banners and men going over together. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yama’s Summons

`yama_summons.png` · 382 chars · 56 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A dark lord of death holding a noose and a ledger, tallying the field. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A dark lord of death holding a noose and a ledger, tallying the field. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```
