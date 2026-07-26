# Kurukshetra: card art prompts

103 prompts, generated from the live card data. Regenerate with `npx vite-node sim/build-art-prompts.ts`.

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

## The Pandava Host (30)

### Arjuna

`arjuna.png` · 964 chars · 139 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Arjuna, powerfully built, in a wide battle stance, turned three-quarters to his left, holding Gandiva, a huge golden-backed longbow, a full quiver on his back. Blue-grey skin, calm focused expression, curly black hair beneath a golden diadem, forearms scarred by the bowstring. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing a golden ape with a lion’s tail, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Arjuna, powerfully built, in a wide battle stance, turned three-quarters to his left, holding Gandiva, a huge golden-backed longbow, a full quiver on his back. Blue-grey skin, calm focused expression, curly black hair beneath a golden diadem, forearms scarred by the bowstring. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing a golden ape with a lion’s tail, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhima

`bhima.png` · 961 chars · 142 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhima, hyper-muscular, in a wide battle stance, turned three-quarters to his right, holding a heavy gold-decked iron mace in both hands. Deep bronze skin, screaming, teeth bared, tall as a sala tree, long-armed, bitten lip and three deep furrows across his brow. Engraved black armour hung with heavy gold chains, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn blue loincloth, heavy black boots. Ruined battlefield, flying dust, rock debris. A tall war-standard bearing a giant silver lion with lapis-blue eyes, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhima, hyper-muscular, in a wide battle stance, turned three-quarters to his right, holding a heavy gold-decked iron mace in both hands. Deep bronze skin, screaming, teeth bared, tall as a sala tree, long-armed, bitten lip and three deep furrows across his brow. Engraved black armour hung with heavy gold chains, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn blue loincloth, heavy black boots. Ruined battlefield, flying dust, rock debris. A tall war-standard bearing a giant silver lion with lapis-blue eyes, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yudhishthira

`yudhishthira.png` · 954 chars · 138 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Yudhishthira, tall and slender, in a wide battle stance, turned three-quarters to his left, holding a long gold-hafted spear hung with bells. Pale gold complexion, calm sorrowful expression, a prominent nose, large eyes, long black hair beneath a golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Still grey battlefield, falling ash, dead air. A tall war-standard bearing a golden moon circled by planets, two kettledrums lashed to the staff, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Yudhishthira, tall and slender, in a wide battle stance, turned three-quarters to his left, holding a long gold-hafted spear hung with bells. Pale gold complexion, calm sorrowful expression, a prominent nose, large eyes, long black hair beneath a golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Still grey battlefield, falling ash, dead air. A tall war-standard bearing a golden moon circled by planets, two kettledrums lashed to the staff, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Nakula

`nakula.png` · 900 chars · 132 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Nakula, lithe and handsome, in a wide battle stance, turned three-quarters to his right, holding a straight steel sword and a shield decked with a thousand stars. Coppery dark skin, calm focused expression, a leonine neck, red eyes, the handsomest man on the field. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Battlefield at first light, low dawn mist. A tall war-standard bearing a gold-backed sarabha, the eight-legged beast, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Nakula, lithe and handsome, in a wide battle stance, turned three-quarters to his right, holding a straight steel sword and a shield decked with a thousand stars. Coppery dark skin, calm focused expression, a leonine neck, red eyes, the handsomest man on the field. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Battlefield at first light, low dawn mist. A tall war-standard bearing a gold-backed sarabha, the eight-legged beast, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sahadeva

`sahadeva.png` · 841 chars · 124 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sahadeva, lithe and watchful, in a wide battle stance, turned three-quarters to his right, holding a broad curved scimitar and a shield. Deep bronze skin, quiet knowing expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Battlefield at first light, low dawn mist. A tall war-standard bearing a silver swan hung with small bells, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sahadeva, lithe and watchful, in a wide battle stance, turned three-quarters to his right, holding a broad curved scimitar and a shield. Deep bronze skin, quiet knowing expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Battlefield at first light, low dawn mist. A tall war-standard bearing a silver swan hung with small bells, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Abhimanyu

`abhimanyu.png` · 958 chars · 143 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Abhimanyu, a beardless youth, slight beside grown men, in a wide battle stance, turned three-quarters to his left, raising a chariot wheel overhead in both arms. Deep bronze skin, calm focused expression, a boy's moon-round face, raven-black lashes, three conch-lines on his neck. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. A closing ring of spears and shields on every side. A tall war-standard bearing a karnikara flower in pure gold, and a war-chariot behind him. High camera angle looking down at him, hemmed in and overwhelmed. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Abhimanyu, a beardless youth, slight beside grown men, in a wide battle stance, turned three-quarters to his left, raising a chariot wheel overhead in both arms. Deep bronze skin, calm focused expression, a boy's moon-round face, raven-black lashes, three conch-lines on his neck. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. A closing ring of spears and shields on every side. A tall war-standard bearing a karnikara flower in pure gold, and a war-chariot behind him. High camera angle looking down at him, hemmed in and overwhelmed. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Ghatotkacha

`ghatotkacha.png` · 821 chars · 113 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ghatotkacha, a towering tusked half-rakshasa, in a wide battle stance, turned three-quarters to his left, holding a huge blazing spear upraised overhead. Dark grey skin, calm focused expression, a wild black mane. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing a vulture. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ghatotkacha, a towering tusked half-rakshasa, in a wide battle stance, turned three-quarters to his left, holding a huge blazing spear upraised overhead. Dark grey skin, calm focused expression, a wild black mane. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing a vulture. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Iravan

`iravan.png` · 794 chars · 112 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Iravan, wiry, in a wide battle stance, squarely facing the viewer, holding a sword and a battle-axe. Deep bronze skin, calm focused expression, a diadem and heavy ear-rings, handsome and young. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Iravan, wiry, in a wide battle stance, squarely facing the viewer, holding a sword and a battle-axe. Deep bronze skin, calm focused expression, a diadem and heavy ear-rings, handsome and young. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Anjanaparvan

`anjanaparvan.png` · 860 chars · 121 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Anjanaparvan, hill-huge, in a wide battle stance, turned three-quarters to his right, holding a scimitar decked with golden stars. Jet-black skin, calm focused expression, hill-huge, jet black as a mass of antimony. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Anjanaparvan, hill-huge, in a wide battle stance, turned three-quarters to his right, holding a scimitar decked with golden stars. Jet-black skin, calm focused expression, hill-huge, jet black as a mass of antimony. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Prativindhya

`prativindhya.png` · 812 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Prativindhya, wiry, in a wide battle stance, turned three-quarters to his right, holding a drawn bow, arrows nocked. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of Dharma, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Prativindhya, wiry, in a wide battle stance, turned three-quarters to his right, holding a drawn bow, arrows nocked. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of Dharma, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sutasoma

`sutasoma.png` · 867 chars · 127 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sutasoma, wiry, in a wide battle stance, turned three-quarters to his right, holding an uplifted sword, a lance in his other hand. Deep bronze skin, calm focused expression, a boy, a blue-lotus scimitar with an ivory handle at his belt. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of Marut, lord of winds, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sutasoma, wiry, in a wide battle stance, turned three-quarters to his right, holding an uplifted sword, a lance in his other hand. Deep bronze skin, calm focused expression, a boy, a blue-lotus scimitar with an ivory handle at his belt. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of Marut, lord of winds, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shrutakarma

`shrutakarma.png` · 815 chars · 116 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shrutakarma, wiry, in a wide battle stance, squarely facing the viewer, holding a spiked iron bludgeon. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of Sakra, lord of thunder, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shrutakarma, wiry, in a wide battle stance, squarely facing the viewer, holding a spiked iron bludgeon. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of Sakra, lord of thunder, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shatanika

`shatanika.png` · 852 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shatanika, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, the youngest-looking of five brothers, still a boy. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of an Ashwin horseman, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shatanika, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, the youngest-looking of five brothers, still a boy. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of an Ashwin horseman, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shrutasena

`shrutasena.png` · 833 chars · 119 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shrutasena, wiry, in a wide battle stance, turned three-quarters to his left, holding a drawn bow, pouring showers of arrows. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of an Ashwin horseman, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shrutasena, wiry, in a wide battle stance, turned three-quarters to his left, holding a drawn bow, pouring showers of arrows. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing the image of an Ashwin horseman, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Dhrishtadyumna

`dhrishtadyumna.png` · 871 chars · 121 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Dhrishtadyumna, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a drawn sword, the blade that took Drona’s head. Fire-hued skin, calm focused expression, round cheeks, huge eyes, steel armour he was born wearing. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Dhrishtadyumna, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a drawn sword, the blade that took Drona’s head. Fire-hued skin, calm focused expression, round cheeks, huge eyes, steel armour he was born wearing. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shikhandi

`shikhandi.png` · 800 chars · 113 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shikhandi, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow, sun-hued arrows nocked. Deep bronze skin, calm focused expression, a powerful man, no softness in the face. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shikhandi, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow, sun-hued arrows nocked. Deep bronze skin, calm focused expression, a powerful man, no softness in the face. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Drupada

`drupada.png` · 849 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Drupada, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a gold-decked iron dart, his bow cut away. Deep bronze skin, calm focused expression, an old king, white-bearded and straight-backed. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Drupada, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a gold-decked iron dart, his bow cut away. Deep bronze skin, calm focused expression, an old king, white-bearded and straight-backed. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yudhamanyu

`yudhamanyu.png` · 788 chars · 111 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Yudhamanyu, wiry, in a wide battle stance, squarely facing the viewer, holding a bow and gold-decked arrows. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Yudhamanyu, wiry, in a wide battle stance, squarely facing the viewer, holding a bow and gold-decked arrows. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Uttamaujas

`uttamaujas.png` · 795 chars · 112 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Uttamaujas, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow and gold-decked arrows. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Uttamaujas, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow and gold-decked arrows. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Virata

`virata.png` · 825 chars · 116 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Virata, hard-muscled, in a wide battle stance, turned three-quarters to his left, holding a sheaf of ten lances. Deep bronze skin, calm focused expression, an old king beneath a white umbrella. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Virata, hard-muscled, in a wide battle stance, turned three-quarters to his left, holding a sheaf of ten lances. Deep bronze skin, calm focused expression, an old king beneath a white umbrella. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sweta

`sweta.png` · 850 chars · 120 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sweta, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a gold-decked dart, his bow left behind on the car. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sweta, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a gold-decked dart, his bow left behind on the car. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sankha

`sankha.png` · 827 chars · 119 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sankha, wiry, in a wide battle stance, turned three-quarters to his right, holding a bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, burnished steel mail studded with a hundred golden eyes. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sankha, wiry, in a wide battle stance, turned three-quarters to his right, holding a bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, burnished steel mail studded with a hundred golden eyes. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Uttara

`uttara.png` · 856 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Uttara, a slight young prince, in a wide battle stance, squarely facing the viewer, holding an elephant-hook and a lance. Deep bronze skin, calm focused expression, a frightened boy prince in heavy ear-rings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing a lion, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Uttara, a slight young prince, in a wide battle stance, squarely facing the viewer, holding an elephant-hook and a lance. Deep bronze skin, calm focused expression, a frightened boy prince in heavy ear-rings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing a lion, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Satyaki

`satyaki.png` · 868 chars · 125 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Satyaki, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a great bow tall as a sala tree, a full quiver on his back. Deep bronze skin, calm focused expression, long hair loose to the shoulder, heavy ear-rings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Satyaki, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a great bow tall as a sala tree, a full quiver on his back. Deep bronze skin, calm focused expression, long hair loose to the shoulder, heavy ear-rings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Chekitana

`chekitana.png` · 828 chars · 114 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Chekitana, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a hero-slaying iron mace. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Chekitana, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a hero-slaying iron mace. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Dhrishtaketu

`dhrishtaketu.png` · 861 chars · 122 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Dhrishtaketu, of giant stature, in a wide battle stance, turned three-quarters to his right, holding an iron dart with a golden staff. Deep bronze skin, calm focused expression, of giant stature, long fair locks and big earrings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Dhrishtaketu, of giant stature, in a wide battle stance, turned three-quarters to his right, holding an iron dart with a golden staff. Deep bronze skin, calm focused expression, of giant stature, long fair locks and big earrings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### The Kekaya Brothers

`kekaya_brothers.png` · 857 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. The Kekaya Brothers, wiry, in a wide battle stance, squarely facing the viewer, holding bows, a full quiver each on their backs. Deep red skin, calm focused expression, five alike in scarlet mail, red weapons, skin red as cochineal. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing five red standards together, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
The Kekaya Brothers, wiry, in a wide battle stance, squarely facing the viewer, holding bows, a full quiver each on their backs. Deep red skin, calm focused expression, five alike in scarlet mail, red weapons, skin red as cochineal. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall war-standard bearing five red standards together, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kuntibhoja

`kuntibhoja.png` · 810 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kuntibhoja, wiry, in a wide battle stance, turned three-quarters to his right, holding a bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kuntibhoja, wiry, in a wide battle stance, turned three-quarters to his right, holding a bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yuyutsu

`yuyutsu.png` · 799 chars · 113 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Yuyutsu, wiry, in a wide battle stance, turned three-quarters to his right, holding a bow, a broad-headed arrow nocked. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Yuyutsu, wiry, in a wide battle stance, turned three-quarters to his right, holding a bow, a broad-headed arrow nocked. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Pandava Footmen

`pandava_infantry.png` · 782 chars · 111 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Pandava Footmen, wiry, in a wide battle stance, turned three-quarters to his right, holding an iron spear and a round bossed shield. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Pandava Footmen, wiry, in a wide battle stance, turned three-quarters to his right, holding an iron spear and a round bossed shield. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. A tall plain white war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## The Kaurava Host (30)

### Bhishma

`bhishma.png` · 983 chars · 147 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhishma, tall and straight-backed, in a wide battle stance, squarely facing the viewer, head slightly turned, holding a huge longbow six cubits long, an arrow nocked. Pale skin, expression heavy with sorrow, dressed wholly in white, white turban and white mail, an old man. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Battlefield beside a wide river, drifting mist. A tall war-standard bearing a golden palmyra palm and five stars on a silver staff, and a war-chariot behind him. Slightly low camera angle, grave and monumental. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhishma, tall and straight-backed, in a wide battle stance, squarely facing the viewer, head slightly turned, holding a huge longbow six cubits long, an arrow nocked. Pale skin, expression heavy with sorrow, dressed wholly in white, white turban and white mail, an old man. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Battlefield beside a wide river, drifting mist. A tall war-standard bearing a golden palmyra palm and five stars on a silver staff, and a war-chariot behind him. Slightly low camera angle, grave and monumental. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Drona

`drona.png` · 947 chars · 138 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Drona, powerfully built, in a wide battle stance, squarely facing the viewer, holding a bow, worn leather fences encasing his fingers. Dark skin, cold measuring expression, eighty-five years old, white locks to his ears, a grabbable topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a golden altar with a water-pot and bow, a black deerskin waving from the top, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Drona, powerfully built, in a wide battle stance, squarely facing the viewer, holding a bow, worn leather fences encasing his fingers. Dark skin, cold measuring expression, eighty-five years old, white locks to his ears, a grabbable topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a golden altar with a water-pot and bow, a black deerskin waving from the top, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Karna

`karna.png` · 1023 chars · 148 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Karna, broad-chested, arms like elephant trunks, in a wide battle stance, turned three-quarters to his right, holding a massive ornate dark bow, a full quiver of arrows on his back. Sun-gold skin, unscarred, grim resolute expression, leonine eyes, bull shoulders, huge ornate golden earrings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Dusty battlefield under a low sun, drifting smoke, distant broken chariots. A tall war-standard bearing a gold elephant-girth rope set with pearls, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Karna, broad-chested, arms like elephant trunks, in a wide battle stance, turned three-quarters to his right, holding a massive ornate dark bow, a full quiver of arrows on his back. Sun-gold skin, unscarred, grim resolute expression, leonine eyes, bull shoulders, huge ornate golden earrings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Dusty battlefield under a low sun, drifting smoke, distant broken chariots. A tall war-standard bearing a gold elephant-girth rope set with pearls, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shalya

`shalya.png` · 952 chars · 135 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shalya, hard-muscled, in a wide battle stance, turned three-quarters to his left, holding an iron mace wrapped in a cloth of gold. Deep bronze skin, hard contemptuous expression, a smooth moon-like face, lotus-petal eyes, brow drawn into three lines. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing the corn-goddess with a golden ploughshare, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shalya, hard-muscled, in a wide battle stance, turned three-quarters to his left, holding an iron mace wrapped in a cloth of gold. Deep bronze skin, hard contemptuous expression, a smooth moon-like face, lotus-petal eyes, brow drawn into three lines. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing the corn-goddess with a golden ploughshare, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Duryodhana

`duryodhana.png` · 983 chars · 139 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Duryodhana, powerfully built, in a wide battle stance, turned three-quarters to his left, holding a colossal gold-banded war-mace. Deep bronze skin, hard contemptuous expression, enormous thighs like plantain stems, a heavy jewelled crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing an elephant worked in gems, tinkling with a hundred bells, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Duryodhana, powerfully built, in a wide battle stance, turned three-quarters to his left, holding a colossal gold-banded war-mace. Deep bronze skin, hard contemptuous expression, enormous thighs like plantain stems, a heavy jewelled crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing an elephant worked in gems, tinkling with a hundred bells, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Dushasana

`dushasana.png` · 856 chars · 122 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Dushasana, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, tawny yellow-brown eyes, handsome, massive arms. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Dushasana, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, tawny yellow-brown eyes, handsome, massive arms. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vikarna

`vikarna.png` · 881 chars · 126 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vikarna, a youth, in a wide battle stance, turned three-quarters to his left, holding a bow, his palm cased in a scarred leather fence. Deep bronze skin, hard contemptuous expression, the youngest-looking, his bow-palm scarred inside a leather fence. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vikarna, a youth, in a wide battle stance, turned three-quarters to his left, holding a bow, his palm cased in a scarred leather fence. Deep bronze skin, hard contemptuous expression, the youngest-looking, his bow-palm scarred inside a leather fence. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Chitrasena

`chitrasena.png` · 825 chars · 119 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Chitrasena, wiry, in a wide battle stance, squarely facing the viewer, holding a bow, the model of all bowmen. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Chitrasena, wiry, in a wide battle stance, squarely facing the viewer, holding a bow, the model of all bowmen. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vivimsati

`vivimsati.png` · 862 chars · 124 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vivimsati, wiry, in a wide battle stance, squarely facing the viewer, holding a sword and a shield, his horse gone. Deep bronze skin, hard contemptuous expression, a smiling moon face, fine nose and fair brows, conspicuously young. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vivimsati, wiry, in a wide battle stance, squarely facing the viewer, holding a sword and a shield, his horse gone. Deep bronze skin, hard contemptuous expression, a smiling moon face, fine nose and fair brows, conspicuously young. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Durmukha

`durmukha.png` · 864 chars · 124 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Durmukha, wiry, in a wide battle stance, turned three-quarters to his right, holding a large bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, handsome despite his name, which means foul-faced. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Durmukha, wiry, in a wide battle stance, turned three-quarters to his right, holding a large bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, handsome despite his name, which means foul-faced. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Ashwatthama

`ashwatthama.png` · 947 chars · 136 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ashwatthama, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a gold-hilted celestial sword and a shield of a thousand moons. Pale lotus-coloured skin, wild-eyed and snarling, a jewel-like growth on his brow he was born with, a leonine neck. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a golden lion’s tail, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ashwatthama, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a gold-hilted celestial sword and a shield of a thousand moons. Pale lotus-coloured skin, wild-eyed and snarling, a jewel-like growth on his brow he was born with, a leonine neck. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a golden lion’s tail, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kripa

`kripa.png` · 916 chars · 132 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kripa, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, an old brahmana, white-haired, a sacred thread over the armour. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a great bovine bull, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kripa, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, an old brahmana, white-haired, a sacred thread over the armour. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a great bovine bull, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kritavarma

`kritavarma.png` · 892 chars · 125 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kritavarma, hard-muscled, in a wide battle stance, turned three-quarters to his right, holding a formidable bow, its staff decked with gold. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kritavarma, hard-muscled, in a wide battle stance, turned three-quarters to his right, holding a formidable bow, its staff decked with gold. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shakuni

`shakuni.png` · 751 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shakuni, lean and sharp-featured, in a wide battle stance, turned three-quarters to his right, holding a pair of ivory dice and no weapon. Deep bronze skin, smiling, eyes cold with calculation, a thin smile, grey hair. Rich unarmoured court silks with rings on every finger. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard. Eye-level camera, close and conspiratorial. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shakuni, lean and sharp-featured, in a wide battle stance, turned three-quarters to his right, holding a pair of ivory dice and no weapon. Deep bronze skin, smiling, eyes cold with calculation, a thin smile, grey hair. Rich unarmoured court silks with rings on every finger. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard. Eye-level camera, close and conspiratorial. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Uluka

`uluka.png` · 827 chars · 121 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Uluka, wiry, in a wide battle stance, squarely facing the viewer, holding a bow slung and a message in his hand. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Uluka, wiry, in a wide battle stance, squarely facing the viewer, holding a bow slung and a message in his hand. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bahlika

`bahlika.png` · 851 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bahlika, wiry, in a wide battle stance, squarely facing the viewer, holding a great bow and a gold-decked iron dart. Deep bronze skin, hard contemptuous expression, the eldest man on the field, his face still unwithered. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bahlika, wiry, in a wide battle stance, squarely facing the viewer, holding a great bow and a gold-decked iron dart. Deep bronze skin, hard contemptuous expression, the eldest man on the field, his face still unwithered. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Somadatta

`somadatta.png` · 850 chars · 124 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Somadatta, wiry, in a wide battle stance, turned three-quarters to his right, holding a large bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Somadatta, wiry, in a wide battle stance, turned three-quarters to his right, holding a large bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhurishravas

`bhurishravas.png` · 918 chars · 128 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhurishravas, hard-muscled, in a wide battle stance, turned three-quarters to his right, holding an upraised sword. Deep bronze skin, hard contemptuous expression, his right arm hacked away, blue-black locks, eyes red as a pigeon's. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a golden sacrificial stake, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhurishravas, hard-muscled, in a wide battle stance, turned three-quarters to his right, holding an upraised sword. Deep bronze skin, hard contemptuous expression, his right arm hacked away, blue-black locks, eyes red as a pigeon's. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a golden sacrificial stake, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Jayadratha

`jayadratha.png` · 932 chars · 138 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Jayadratha, wiry, in a wide battle stance, turned three-quarters to his right, holding a sword and a peacock shield hung with a hundred small bells. Deep bronze skin, hard contemptuous expression, his head shaved bald but for five tufts of hair. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a silver boar on a silver staff, decked with golden chains, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Jayadratha, wiry, in a wide battle stance, turned three-quarters to his right, holding a sword and a peacock shield hung with a hundred small bells. Deep bronze skin, hard contemptuous expression, his head shaved bald but for five tufts of hair. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a silver boar on a silver staff, decked with golden chains, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhagadatta

`bhagadatta.png` · 958 chars · 137 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhagadatta, hard-muscled, in a wide battle stance, turned three-quarters to his left, holding an iron elephant-hook, the ankusa. Deep bronze skin, hard contemptuous expression, very old, a cloth turban over white hair, a gold garland on it. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and the great war-elephant Supratika beside him, its head and tusks filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhagadatta, hard-muscled, in a wide battle stance, turned three-quarters to his left, holding an iron elephant-hook, the ankusa. Deep bronze skin, hard contemptuous expression, very old, a cloth turban over white hair, a gold garland on it. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and the great war-elephant Supratika beside him, its head and tusks filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vinda

`vinda.png` · 876 chars · 128 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vinda, wiry, in a wide battle stance, turned three-quarters to his left, holding a great bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, bull-like eyes, gold armour and gold Angadas, twin to his brother. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vinda, wiry, in a wide battle stance, turned three-quarters to his left, holding a great bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, bull-like eyes, gold armour and gold Angadas, twin to his brother. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Anuvinda

`anuvinda.png` · 868 chars · 124 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Anuvinda, wiry, in a wide battle stance, turned three-quarters to his left, holding a mace, his car destroyed beneath him. Deep bronze skin, hard contemptuous expression, bull-like eyes, gold armour and gold Angadas, twin to his brother. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Anuvinda, wiry, in a wide battle stance, turned three-quarters to his left, holding a mace, his car destroyed beneath him. Deep bronze skin, hard contemptuous expression, bull-like eyes, gold armour and gold Angadas, twin to his brother. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Susharma

`susharma.png` · 852 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Susharma, wiry, in a wide battle stance, squarely facing the viewer, holding a bow, his bowstring worn as a girdle over kusa-grass robes. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Susharma, wiry, in a wide battle stance, squarely facing the viewer, holding a bow, his bowstring worn as a girdle over kusa-grass robes. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sudakshina

`sudakshina.png` · 885 chars · 126 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sudakshina, young and thick-necked, in a wide battle stance, squarely facing the viewer, holding a bow and an iron dart decked with bells. Deep bronze skin, hard contemptuous expression, young and bull-necked, arms like spiked maces, smeared with sandal. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sudakshina, young and thick-necked, in a wide battle stance, squarely facing the viewer, holding a bow and an iron dart decked with bells. Deep bronze skin, hard contemptuous expression, young and bull-necked, arms like spiked maces, smeared with sandal. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Srutayudha

`srutayudha.png` · 840 chars · 119 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Srutayudha, wiry, in a wide battle stance, turned three-quarters to his left, holding the mace Varuna gave him, hero-slaying. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Srutayudha, wiry, in a wide battle stance, turned three-quarters to his left, holding the mace Varuna gave him, hero-slaying. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Jalasandha

`jalasandha.png` · 947 chars · 137 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Jalasandha, wiry, in a wide battle stance, turned three-quarters to his right, holding a scimitar and a bull’s-hide shield decked with a hundred moons. Deep bronze skin, hard contemptuous expression, body smeared with red sandal-paste, a blazing gold chain round his head. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Jalasandha, wiry, in a wide battle stance, turned three-quarters to his right, holding a scimitar and a bull’s-hide shield decked with a hundred moons. Deep bronze skin, hard contemptuous expression, body smeared with red sandal-paste, a blazing gold chain round his head. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Alambusha

`alambusha.png` · 851 chars · 122 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Alambusha, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow and the sword that beheaded Iravan. Jet-black skin, hard contemptuous expression, a heaped mass of black antimony, huge and dark. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Alambusha, wiry, in a wide battle stance, turned three-quarters to his left, holding a bow and the sword that beheaded Iravan. Jet-black skin, hard contemptuous expression, a heaped mass of black antimony, huge and dark. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Alayudha

`alayudha.png` · 955 chars · 132 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Alayudha, hard-muscled, in a wide battle stance, turned three-quarters to his right, holding a gigantic iron-bound parigha club. Elephant-hide black skin, hard contemptuous expression, strikingly handsome for a rakshasa, jewelled armlets and diadem. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a great war-elephant beside him, its head and trunk filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Alayudha, hard-muscled, in a wide battle stance, turned three-quarters to his right, holding a gigantic iron-bound parigha club. Elephant-hide black skin, hard contemptuous expression, strikingly handsome for a rakshasa, jewelled armlets and diadem. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard, and a great war-elephant beside him, its head and trunk filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vrishasena

`vrishasena.png` · 907 chars · 130 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vrishasena, a young man, in a wide battle stance, turned three-quarters to his right, holding a bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, youthful, barely past boyhood. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a golden peacock caught mid-cry, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vrishasena, a young man, in a wide battle stance, turned three-quarters to his right, holding a bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, youthful, barely past boyhood. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall war-standard bearing a golden peacock caught mid-cry, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kaurava Footmen

`kaurava_infantry.png` · 816 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kaurava Footmen, wiry, in a wide battle stance, turned three-quarters to his left, holding an iron spear and a round bossed shield. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kaurava Footmen, wiry, in a wide battle stance, turned three-quarters to his left, holding an iron spear and a round bossed shield. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. A tall plain gold war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## The Asura Host (15)

### Ravana

`ravana.png` · 998 chars · 147 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ravana, a colossal rakshasa king, in a wide battle stance, turned three-quarters to his right, holding a great bow, the curved sword Chandrahasa at his belt. Dark lapis-blue skin chased with gold, all ten faces roaring at once, ten crowned heads and twenty arms, white teeth, chest gouged by an elephant's tusk. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ravana, a colossal rakshasa king, in a wide battle stance, turned three-quarters to his right, holding a great bow, the curved sword Chandrahasa at his belt. Dark lapis-blue skin chased with gold, all ten faces roaring at once, ten crowned heads and twenty arms, white teeth, chest gouged by an elephant's tusk. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kumbhakarna

`kumbhakarna.png` · 882 chars · 126 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kumbhakarna, a mountainous tusked giant, in a wide battle stance, turned three-quarters to his right, holding a huge sharp iron pike, a shula. Ashen grey skin, teeth bared in a snarl, half-shut eyes heavy with sleep, nostrils a man could crawl through. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kumbhakarna, a mountainous tusked giant, in a wide battle stance, turned three-quarters to his right, holding a huge sharp iron pike, a shula. Ashen grey skin, teeth bared in a snarl, half-shut eyes heavy with sleep, nostrils a man could crawl through. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Indrajit

`indrajit.png` · 925 chars · 127 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Indrajit, powerfully built, in a wide battle stance, turned three-quarters to his left, holding a gold-adorned bow, serpent-arrows nocked. Ashen grey skin, serene merciless expression, half-dissolved into thundercloud, only his bow solid. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Indrajit, powerfully built, in a wide battle stance, turned three-quarters to his left, holding a gold-adorned bow, serpent-arrows nocked. Ashen grey skin, serene merciless expression, half-dissolved into thundercloud, only his bow solid. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Hiranyakashipu

`hiranyakashipu.png` · 866 chars · 122 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Hiranyakashipu, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a heavy mace. Molten-gold skin, teeth bared in a snarl, limbs of molten gold, skin still pitted where ants ate him. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Hiranyakashipu, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a heavy mace. Molten-gold skin, teeth bared in a snarl, limbs of molten gold, skin still pitted where ants ate him. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Hiranyaksha

`hiranyaksha.png` · 873 chars · 126 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Hiranyaksha, wiry, in a wide battle stance, turned three-quarters to his left, holding a massive mace. Ashen grey skin, teeth bared in a snarl, brown hair standing out stiff like swords, gold anklets. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Hiranyaksha, wiry, in a wide battle stance, turned three-quarters to his left, holding a massive mace. Ashen grey skin, teeth bared in a snarl, brown hair standing out stiff like swords, gold anklets. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a great war-elephant beside him, its head and trunk filling one side. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bali

`bali.png` · 874 chars · 126 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bali, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a water-pot, poised to pour the water of the gift. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bali, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a water-pot, poised to pour the water of the gift. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Prahlada

`prahlada.png` · 526 chars · 76 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Prahlada, a boy of five, squarely facing the viewer. Warm brown skin, serene, wholly unafraid, empty palms pressed together at his chest. Plain undyed cloth and no armour. Simple white dhoti, bare feet. A pillared hall, lamps guttering. Eye-level camera, quiet and close. Whole figure inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Prahlada, a boy of five, squarely facing the viewer. Warm brown skin, serene, wholly unafraid, empty palms pressed together at his chest. Plain undyed cloth and no armour. Simple white dhoti, bare feet. A pillared hall, lamps guttering. Eye-level camera, quiet and close. Whole figure inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Narakasura

`narakasura.png` · 890 chars · 127 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Narakasura, hard-muscled, in a wide battle stance, turned three-quarters to his right, holding a spear. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a great war-elephant beside him, its head and tusks filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Narakasura, hard-muscled, in a wide battle stance, turned three-quarters to his right, holding a spear. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a great war-elephant beside him, its head and tusks filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Mahishasura

`mahishasura.png` · 950 chars · 141 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Mahishasura, a huge warrior emerging from the neck of a slain buffalo, in a wide battle stance, squarely facing the viewer, holding a sword and shield. Ashen grey skin, teeth bared in a snarl, half issuing from the mouth of a great black buffalo. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a great war-elephant beside him, its head and trunk filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Mahishasura, a huge warrior emerging from the neck of a slain buffalo, in a wide battle stance, squarely facing the viewer, holding a sword and shield. Ashen grey skin, teeth bared in a snarl, half issuing from the mouth of a great black buffalo. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a great war-elephant beside him, its head and trunk filling one side. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shumbha

`shumbha.png` · 880 chars · 126 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shumbha, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a scimitar and a shield blazoned with a hundred moons. Ashen grey skin, teeth bared in a snarl, eight arms lifted high, filling the sky. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shumbha, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a scimitar and a shield blazoned with a hundred moons. Ashen grey skin, teeth bared in a snarl, eight arms lifted high, filling the sky. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Nishumbha

`nishumbha.png` · 851 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Nishumbha, wiry, in a wide battle stance, turned three-quarters to his right, holding a sharp scimitar and a glittering shield. Ashen grey skin, teeth bared in a snarl, a second armed man bursting out of his pierced chest. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Nishumbha, wiry, in a wide battle stance, turned three-quarters to his right, holding a sharp scimitar and a glittering shield. Ashen grey skin, teeth bared in a snarl, a second armed man bursting out of his pierced chest. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Raktabija

`raktabija.png` · 845 chars · 122 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Raktabija, wiry, in a wide battle stance, turned three-quarters to his left, holding a heavy iron club. Ashen grey skin, teeth bared in a snarl, blood running from many wounds, each fallen drop rising as a duplicate. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Raktabija, wiry, in a wide battle stance, turned three-quarters to his left, holding a heavy iron club. Ashen grey skin, teeth bared in a snarl, blood running from many wounds, each fallen drop rising as a duplicate. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vritra

`vritra.png` · 874 chars · 128 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vritra, a mountain-shaped giant, vast beyond any man, in a wide battle stance, turned three-quarters to his left, holding a great trident. Ashen grey skin, jaws parted, eyes cold, a mouth wide enough to swallow a god whole. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. A withheld storm over dry riverbeds, no rain falling. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vritra, a mountain-shaped giant, vast beyond any man, in a wide battle stance, turned three-quarters to his left, holding a great trident. Ashen grey skin, jaws parted, eyes cold, a mouth wide enough to swallow a god whole. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. A withheld storm over dry riverbeds, no rain falling. A tall ragged black war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Tarakasura

`tarakasura.png` · 799 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Tarakasura, wiry, in a wide battle stance, squarely facing the viewer, holding a great spear. Ashen grey skin, teeth bared in a snarl, long black hair bound in a topknot. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Tarakasura, wiry, in a wide battle stance, squarely facing the viewer, holding a great spear. Ashen grey skin, teeth bared in a snarl, long black hair bound in a topknot. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Asura Horde

`asura_horde.png` · 804 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Asura Horde, wiry, in a wide battle stance, turned three-quarters to his right, holding an iron spear and a round bossed shield. Ashen grey skin, teeth bared in a snarl, long black hair bound in a topknot. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Asura Horde, wiry, in a wide battle stance, turned three-quarters to his right, holding an iron spear and a round bossed shield. Ashen grey skin, teeth bared in a snarl, long black hair bound in a topknot. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. A tall ragged black war-standard. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## Those Who Stood Apart (6)

### Barbarika

`barbarika.png` · 895 chars · 131 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Barbarika, powerfully built, in a wide battle stance, turned three-quarters to his left, holding a bow with three arrows and nothing else in his quiver. Deep bronze skin, calm, already resigned, three arrows and nothing else in his quiver. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Barbarika, powerfully built, in a wide battle stance, turned three-quarters to his left, holding a bow with three arrows and nothing else in his quiver. Deep bronze skin, calm, already resigned, three arrows and nothing else in his quiver. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Jarasandha

`jarasandha.png` · 899 chars · 131 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Jarasandha, immense and thick-limbed, in a wide battle stance, turned three-quarters to his right, holding a heavy iron mace in both hands. Deep bronze skin, level unreadable expression, his crown set aside, hair bound up in a wrestler’s knot. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Jarasandha, immense and thick-limbed, in a wide battle stance, turned three-quarters to his right, holding a heavy iron mace in both hands. Deep bronze skin, level unreadable expression, his crown set aside, hair bound up in a wrestler’s knot. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Balarama

`balarama.png` · 852 chars · 122 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Balarama, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a plough in one hand and a heavy pestle-club in the other. Fair skin, turned away, refusing the field, fair-skinned in blue silk, eyes red-rimmed with wine. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall war-standard bearing a palmyra palm. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Balarama, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a plough in one hand and a heavy pestle-club in the other. Fair skin, turned away, refusing the field, fair-skinned in blue silk, eyes red-rimmed with wine. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall war-standard bearing a palmyra palm. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Ekalavya

`ekalavya.png` · 782 chars · 114 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ekalavya, hard-muscled, in a wide battle stance, turned three-quarters to his right, drawing a bow, fingers cased in a leather guard, right thumb gone. Dark skin, unbowed, jaw set, dark-skinned, body caked in filth, matted locks, black rags. Plain forest dress and no armour. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ekalavya, hard-muscled, in a wide battle stance, turned three-quarters to his right, drawing a bow, fingers cased in a leather guard, right thumb gone. Dark skin, unbowed, jaw set, dark-skinned, body caked in filth, matted locks, black rags. Plain forest dress and no armour. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shishupala

`shishupala.png` · 858 chars · 120 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shishupala, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a great bow he strains at and cannot string. Deep bronze skin, level unreadable expression, ordinary and two-armed, eyes copper-red with rage. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shishupala, hard-muscled, in a wide battle stance, squarely facing the viewer, holding a great bow he strains at and cannot string. Deep bronze skin, level unreadable expression, ordinary and two-armed, eyes copper-red with rage. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Rukmi

`rukmi.png` · 807 chars · 114 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Rukmi, wiry, in a wide battle stance, turned three-quarters to his left, holding an ornate golden celestial longbow, unstrung. Deep bronze skin, level unreadable expression, long black hair bound in a topknot. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Rukmi, wiry, in a wide battle stance, turned three-quarters to his left, holding an ornate golden celestial longbow, unstrung. Deep bronze skin, level unreadable expression, long black hair bound in a topknot. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. A tall plain grey war-standard, and a war-chariot behind him. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## Astras (14)

### Brahma-Astra

`brahmastra.png` · 413 chars · 60 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A single arrow blooming into a column of white fire, the ground beneath already ash. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A single arrow blooming into a column of white fire, the ground beneath already ash. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Brahmashirsha-Astra

`brahmashirsha.png` · 388 chars · 55 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A four-faced pillar of fire rising from a scorched horizon. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A four-faced pillar of fire rising from a scorched horizon. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Pashupat-Astra

`pashupatastra.png` · 432 chars · 64 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A single unbearable eye of white fire opening in a black sky, the world thinning to nothing beneath it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A single unbearable eye of white fire opening in a black sky, the world thinning to nothing beneath it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Narayan-Astra

`narayanastra.png` · 419 chars · 60 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A sky filled edge to edge with descending divine weapons, discs and spears without number. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A sky filled edge to edge with descending divine weapons, discs and spears without number. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vaishnav-Astra

`vaishnavastra.png` · 406 chars · 57 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A discus of blue-white light crossing a dark field with impossible certainty. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A discus of blue-white light crossing a dark field with impossible certainty. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vasavi Shakti

`vasavi_shakti.png` · 401 chars · 58 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A single blazing spear hanging in the dark, thrown once and never again. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A single blazing spear hanging in the dark, thrown once and never again. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Aindra-Astra

`aindrastra.png` · 386 chars · 55 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A sky-blackening rain of arrows falling in a solid sheet. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A sky-blackening rain of arrows falling in a solid sheet. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Agney-Astra

`agneyastra.png` · 394 chars · 56 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A wall of unquenchable flame advancing across a rank of soldiers. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A wall of unquenchable flame advancing across a rank of soldiers. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Varun-Astra

`varunastra.png` · 374 chars · 53 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A rising wall of black water swallowing fire. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A rising wall of black water swallowing fire. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vayavya-Astra

`vayavyastra.png` · 384 chars · 55 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A screaming spiral of wind tearing a battle line apart. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A screaming spiral of wind tearing a battle line apart. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Nag-Astra

`nagastra.png` · 401 chars · 56 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A serpent of living arrow-fire striking through smoke, hood spread wide. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A serpent of living arrow-fire striking through smoke, hood spread wide. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Garud-Astra

`garudastra.png` · 411 chars · 59 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. The shadow of a vast eagle falling across a field, serpents scattering beneath it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
The shadow of a vast eagle falling across a field, serpents scattering beneath it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhargav-Astra

`bhargavastra.png` · 396 chars · 58 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Countless arrows loosed at once from a single point, a fan of fire. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Countless arrows loosed at once from a single point, a fan of fire. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sammohan-Astra

`sammohana.png` · 401 chars · 58 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A soft grey haze rolling over an army, weapons falling from slack hands. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A soft grey haze rolling over an army, weapons falling from slack hands. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## Vardaan and Fates (8)

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

### Gandhari’s Gaze

`gandhari_gaze.png` · 397 chars · 57 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A blindfold lifted from a queen’s eyes for the first time, terrible light beneath it. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A blindfold lifted from a queen’s eyes for the first time, terrible light beneath it. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
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
