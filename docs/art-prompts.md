# Kurukshetra: card art prompts

103 prompts, generated from the live card data. Regenerate with `npx vite-node sim/build-art-prompts.ts`.

Generated for **meta.ai**, which honours negated qualities. Firefly does not, and caps prompts at 1024 characters.

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

`arjuna.webp` · 809 chars · 116 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Arjuna, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Blue-grey skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Arjuna, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Blue-grey skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhima

`bhima.webp` · 795 chars · 116 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhima, hyper-muscular, in a wide battle stance, holding a massive golden gada mace. Deep bronze skin, screaming, teeth bared, wild black hair and a thick black beard beneath a spiked golden crown. Engraved black armour hung with heavy gold chains, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn blue loincloth, heavy black boots. Ruined battlefield, flying dust, rock debris. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhima, hyper-muscular, in a wide battle stance, holding a massive golden gada mace. Deep bronze skin, screaming, teeth bared, wild black hair and a thick black beard beneath a spiked golden crown. Engraved black armour hung with heavy gold chains, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn blue loincloth, heavy black boots. Ruined battlefield, flying dust, rock debris. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yudhishthira

`yudhishthira.webp` · 817 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Yudhishthira, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Yudhishthira, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Nakula

`nakula.webp` · 774 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Nakula, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Nakula, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sahadeva

`sahadeva.webp` · 776 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sahadeva, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sahadeva, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Abhimanyu

`abhimanyu.webp` · 825 chars · 124 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Abhimanyu, a beardless youth, slight beside grown men, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, bright unscarred golden armour, no crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. A closing ring of spears and shields on every side. High camera angle looking down at him, hemmed in and overwhelmed. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Abhimanyu, a beardless youth, slight beside grown men, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, bright unscarred golden armour, no crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. A closing ring of spears and shields on every side. High camera angle looking down at him, hemmed in and overwhelmed. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Ghatotkacha

`ghatotkacha.webp` · 738 chars · 101 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ghatotkacha, a towering tusked half-rakshasa, in a wide battle stance, holding an enormous studded iron club. Dark grey skin, calm focused expression, a wild black mane. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ghatotkacha, a towering tusked half-rakshasa, in a wide battle stance, holding an enormous studded iron club. Dark grey skin, calm focused expression, a wild black mane. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Iravan

`iravan.webp` · 774 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Iravan, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Iravan, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Anjanaparvan

`anjanaparvan.webp` · 760 chars · 104 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Anjanaparvan, hard-muscled, in a wide battle stance, holding a long iron war-lance braced across his body. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Anjanaparvan, hard-muscled, in a wide battle stance, holding a long iron war-lance braced across his body. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Prativindhya

`prativindhya.webp` · 780 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Prativindhya, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Prativindhya, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sutasoma

`sutasoma.webp` · 776 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sutasoma, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sutasoma, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shrutakarma

`shrutakarma.webp` · 779 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shrutakarma, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shrutakarma, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shatanika

`shatanika.webp` · 777 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shatanika, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shatanika, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shrutasena

`shrutasena.webp` · 778 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shrutasena, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shrutasena, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Dhrishtadyumna

`dhrishtadyumna.webp` · 819 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Dhrishtadyumna, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Dhrishtadyumna, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shikhandi

`shikhandi.webp` · 777 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shikhandi, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shikhandi, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Drupada

`drupada.webp` · 812 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Drupada, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Drupada, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yudhamanyu

`yudhamanyu.webp` · 778 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Yudhamanyu, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Yudhamanyu, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Uttamaujas

`uttamaujas.webp` · 778 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Uttamaujas, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Uttamaujas, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Virata

`virata.webp` · 811 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Virata, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Virata, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sweta

`sweta.webp` · 810 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sweta, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sweta, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sankha

`sankha.webp` · 774 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sankha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sankha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Uttara

`uttara.webp` · 729 chars · 105 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Uttara, wiry, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Uttara, wiry, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Satyaki

`satyaki.webp` · 812 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Satyaki, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Satyaki, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Chekitana

`chekitana.webp` · 814 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Chekitana, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Chekitana, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Dhrishtaketu

`dhrishtaketu.webp` · 817 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Dhrishtaketu, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Dhrishtaketu, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath an ornate golden crown. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### The Kekaya Brothers

`kekaya_brothers.webp` · 787 chars · 111 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. The Kekaya Brothers, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
The Kekaya Brothers, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kuntibhoja

`kuntibhoja.webp` · 778 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kuntibhoja, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kuntibhoja, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yuyutsu

`yuyutsu.webp` · 775 chars · 109 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Yuyutsu, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Yuyutsu, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm focused expression, long black hair beneath a golden circlet. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Pandava Footmen

`pandava_infantry.webp` · 713 chars · 101 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Pandava Footmen, wiry, in a wide battle stance, holding an iron spear and a round bossed shield. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Pandava Footmen, wiry, in a wide battle stance, holding an iron spear and a round bossed shield. Deep bronze skin, calm focused expression, long black hair bound in a topknot. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a dark blue tunic. Billowing white battle scarf, white dhoti, gold sandals. Stormy battlefield, dark thunderclouds, lightning. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## The Kaurava Host (30)

### Bhishma

`bhishma.webp` · 829 chars · 121 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhishma, tall and straight-backed, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, expression heavy with sorrow, a long white beard beneath a high silver crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, grave and monumental. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhishma, tall and straight-backed, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, expression heavy with sorrow, a long white beard beneath a high silver crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, grave and monumental. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Drona

`drona.webp` · 809 chars · 119 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Drona, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, cold measuring expression, a grey beard, ash marks on his brow, a sacred thread across the armour. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Drona, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, cold measuring expression, a grey beard, ash marks on his brow, a sacred thread across the armour. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Karna

`karna.webp` · 864 chars · 127 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Karna, powerfully built, in a wide battle stance, holding a massive ornate dark bow, a full quiver of arrows on his back. Deep bronze skin, grim resolute expression, long black hair beneath a golden diadem, huge ornate golden earrings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Dusty battlefield under a low sun, drifting smoke, distant broken chariots. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Karna, powerfully built, in a wide battle stance, holding a massive ornate dark bow, a full quiver of arrows on his back. Deep bronze skin, grim resolute expression, long black hair beneath a golden diadem, huge ornate golden earrings. Engraved gold armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Dusty battlefield under a low sun, drifting smoke, distant broken chariots. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shalya

`shalya.webp` · 847 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shalya, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shalya, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Duryodhana

`duryodhana.webp` · 818 chars · 114 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Duryodhana, powerfully built, in a wide battle stance, holding a colossal gold-banded war-mace. Deep bronze skin, hard contemptuous expression, long black hair beneath a heavy jewelled crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Duryodhana, powerfully built, in a wide battle stance, holding a colossal gold-banded war-mace. Deep bronze skin, hard contemptuous expression, long black hair beneath a heavy jewelled crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Dushasana

`dushasana.webp` · 813 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Dushasana, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Dushasana, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vikarna

`vikarna.webp` · 811 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vikarna, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vikarna, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Chitrasena

`chitrasena.webp` · 769 chars · 111 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Chitrasena, wiry, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Chitrasena, wiry, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vivimsati

`vivimsati.webp` · 768 chars · 111 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vivimsati, wiry, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vivimsati, wiry, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Durmukha

`durmukha.webp` · 767 chars · 111 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Durmukha, wiry, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Durmukha, wiry, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Ashwatthama

`ashwatthama.webp` · 859 chars · 124 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ashwatthama, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, wild-eyed and snarling, a burning jewel set into his forehead, blood-flecked armour. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ashwatthama, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, wild-eyed and snarling, a burning jewel set into his forehead, blood-flecked armour. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kripa

`kripa.webp` · 846 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kripa, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kripa, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kritavarma

`kritavarma.webp` · 851 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kritavarma, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kritavarma, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shakuni

`shakuni.webp` · 676 chars · 99 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shakuni, lean and stooped, in a wide battle stance, holding a pair of ivory dice and no weapon. Deep bronze skin, smiling, eyes cold with calculation, a thin smile, grey hair. Rich unarmoured court silks with rings on every finger. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera, close and conspiratorial. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shakuni, lean and stooped, in a wide battle stance, holding a pair of ivory dice and no weapon. Deep bronze skin, smiling, eyes cold with calculation, a thin smile, grey hair. Rich unarmoured court silks with rings on every finger. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera, close and conspiratorial. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Uluka

`uluka.webp` · 809 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Uluka, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Uluka, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bahlika

`bahlika.webp` · 848 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bahlika, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bahlika, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Somadatta

`somadatta.webp` · 850 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Somadatta, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Somadatta, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhurishravas

`bhurishravas.webp` · 853 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhurishravas, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhurishravas, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Jayadratha

`jayadratha.webp` · 814 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Jayadratha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Jayadratha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhagadatta

`bhagadatta.webp` · 831 chars · 118 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bhagadatta, powerfully built, in a wide battle stance, holding a long iron war-lance braced across his body. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bhagadatta, powerfully built, in a wide battle stance, holding a long iron war-lance braced across his body. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vinda

`vinda.webp` · 809 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vinda, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vinda, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Anuvinda

`anuvinda.webp` · 812 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Anuvinda, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Anuvinda, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Susharma

`susharma.webp` · 812 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Susharma, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Susharma, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sudakshina

`sudakshina.webp` · 814 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Sudakshina, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Sudakshina, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Srutayudha

`srutayudha.webp` · 814 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Srutayudha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Srutayudha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Jalasandha

`jalasandha.webp` · 794 chars · 110 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Jalasandha, hard-muscled, in a wide battle stance, holding a long iron war-lance braced across his body. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Jalasandha, hard-muscled, in a wide battle stance, holding a long iron war-lance braced across his body. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Alambusha

`alambusha.webp` · 813 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Alambusha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Alambusha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Alayudha

`alayudha.webp` · 829 chars · 118 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Alayudha, powerfully built, in a wide battle stance, holding a long iron war-lance braced across his body. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Alayudha, powerfully built, in a wide battle stance, holding a long iron war-lance braced across his body. Deep bronze skin, hard contemptuous expression, long black hair beneath an ornate golden crown. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vrishasena

`vrishasena.webp` · 814 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vrishasena, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vrishasena, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, hard contemptuous expression, long black hair beneath a golden circlet. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kaurava Footmen

`kaurava_infantry.webp` · 749 chars · 107 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kaurava Footmen, wiry, in a wide battle stance, holding an iron spear and a round bossed shield. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kaurava Footmen, wiry, in a wide battle stance, holding an iron spear and a round bossed shield. Deep bronze skin, hard contemptuous expression, long black hair bound in a topknot. Engraved dark iron armour banded with gold, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a deep crimson tunic. Billowing dark ochre battle scarf, white dhoti, gold sandals. Burning battlefield, rolling smoke, broken banners. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## The Asura Host (15)

### Ravana

`ravana.webp` · 836 chars · 124 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ravana, a colossal rakshasa king, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, all ten faces roaring at once, ten crowned heads and many arms. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ravana, a colossal rakshasa king, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, all ten faces roaring at once, ten crowned heads and many arms. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kumbhakarna

`kumbhakarna.webp` · 816 chars · 117 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Kumbhakarna, a mountainous tusked giant, in a wide battle stance, holding a long iron war-lance braced across his body. Ashen grey skin, teeth bared in a snarl, half-shut eyes heavy with sleep. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Kumbhakarna, a mountainous tusked giant, in a wide battle stance, holding a long iron war-lance braced across his body. Ashen grey skin, teeth bared in a snarl, half-shut eyes heavy with sleep. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Indrajit

`indrajit.webp` · 849 chars · 120 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Indrajit, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, serene merciless expression, half-dissolved into thundercloud, only his bow solid. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Indrajit, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, serene merciless expression, half-dissolved into thundercloud, only his bow solid. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Hiranyakashipu

`hiranyakashipu.webp` · 844 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Hiranyakashipu, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Hiranyakashipu, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Hiranyaksha

`hiranyaksha.webp` · 784 chars · 110 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Hiranyaksha, hard-muscled, in a wide battle stance, holding a long iron war-lance braced across his body. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Hiranyaksha, hard-muscled, in a wide battle stance, holding a long iron war-lance braced across his body. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bali

`bali.webp` · 834 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Bali, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Bali, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Prahlada

`prahlada.webp` · 731 chars · 106 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Prahlada, wiry, in a wide battle stance, holding an iron spear and a round bossed shield. Ashen grey skin, teeth bared in a snarl, long black hair bound in a topknot. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Prahlada, wiry, in a wide battle stance, holding an iron spear and a round bossed shield. Ashen grey skin, teeth bared in a snarl, long black hair bound in a topknot. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Narakasura

`narakasura.webp` · 840 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Narakasura, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Narakasura, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Mahishasura

`mahishasura.webp` · 821 chars · 118 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Mahishasura, powerfully built, in a wide battle stance, holding a long iron war-lance braced across his body. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Mahishasura, powerfully built, in a wide battle stance, holding a long iron war-lance braced across his body. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shumbha

`shumbha.webp` · 837 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shumbha, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shumbha, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Nishumbha

`nishumbha.webp` · 802 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Nishumbha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Nishumbha, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Raktabija

`raktabija.webp` · 802 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Raktabija, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Raktabija, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vritra

`vritra.webp` · 836 chars · 123 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vritra, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Vritra, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath an ornate golden crown. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Tarakasura

`tarakasura.webp` · 803 chars · 115 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Tarakasura, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Tarakasura, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Ashen grey skin, teeth bared in a snarl, long black hair beneath a golden circlet. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Asura Horde

`asura_horde.webp` · 734 chars · 107 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Asura Horde, wiry, in a wide battle stance, holding an iron spear and a round bossed shield. Ashen grey skin, teeth bared in a snarl, long black hair bound in a topknot. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Asura Horde, wiry, in a wide battle stance, holding an iron spear and a round bossed shield. Ashen grey skin, teeth bared in a snarl, long black hair bound in a topknot. Engraved blackened bronze armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a black tunic. Torn black battle scarf, dark loincloth, heavy leather sandals. Ruined battlefield at night, drifting embers, shattered stone. Eye-level camera. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## Those Who Stood Apart (6)

### Barbarika

`barbarika.webp` · 808 chars · 118 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Barbarika, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm, already resigned, three arrows and nothing else in his quiver. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Barbarika, powerfully built, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, calm, already resigned, three arrows and nothing else in his quiver. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Jarasandha

`jarasandha.webp` · 831 chars · 121 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Jarasandha, immense and thick-limbed, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, level unreadable expression, a faint vertical seam running the length of his body. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Jarasandha, immense and thick-limbed, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, level unreadable expression, a faint vertical seam running the length of his body. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Balarama

`balarama.webp` · 792 chars · 116 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Balarama, powerfully built, in a wide battle stance, holding a great iron plough planted upright like a wall. Fair skin, turned away, refusing the field, long dark hair, a drinking horn at his belt. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Balarama, powerfully built, in a wide battle stance, holding a great iron plough planted upright like a wall. Fair skin, turned away, refusing the field, long dark hair, a drinking horn at his belt. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Low camera angle looking up at him from below, towering heroic perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Ekalavya

`ekalavya.webp` · 681 chars · 101 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Ekalavya, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, unbowed, jaw set, the right thumb missing from his draw hand. Plain forest dress and no armour. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Ekalavya, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, unbowed, jaw set, the right thumb missing from his draw hand. Plain forest dress and no armour. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Shishupala

`shishupala.webp` · 780 chars · 110 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Shishupala, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, level unreadable expression, long black hair beneath a golden circlet. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Shishupala, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, level unreadable expression, long black hair beneath a golden circlet. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Rukmi

`rukmi.webp` · 775 chars · 110 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Rukmi, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, level unreadable expression, long black hair beneath a golden circlet. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Rukmi, hard-muscled, in a wide battle stance, holding a massive ornate golden bow, a full quiver of arrows on his back. Deep bronze skin, level unreadable expression, long black hair beneath a golden circlet. Engraved silver armour, sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt, over a grey tunic. Billowing grey battle scarf, white dhoti, plain sandals. Empty battlefield, drifting ash, one broken banner. Slightly low camera angle, imposing perspective. Full figure from head to feet, entire weapon inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

## Astras (14)

### Brahma-Astra

`brahmastra.webp` · 413 chars · 60 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A single arrow blooming into a column of white fire, the ground beneath already ash. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A single arrow blooming into a column of white fire, the ground beneath already ash. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Brahmashirsha-Astra

`brahmashirsha.webp` · 388 chars · 55 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A four-faced pillar of fire rising from a scorched horizon. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A four-faced pillar of fire rising from a scorched horizon. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Pashupat-Astra

`pashupatastra.webp` · 432 chars · 64 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A single unbearable eye of white fire opening in a black sky, the world thinning to nothing beneath it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A single unbearable eye of white fire opening in a black sky, the world thinning to nothing beneath it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Narayan-Astra

`narayanastra.webp` · 419 chars · 60 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A sky filled edge to edge with descending divine weapons, discs and spears without number. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A sky filled edge to edge with descending divine weapons, discs and spears without number. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vaishnav-Astra

`vaishnavastra.webp` · 406 chars · 57 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A discus of blue-white light crossing a dark field with impossible certainty. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A discus of blue-white light crossing a dark field with impossible certainty. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vasavi Shakti

`vasavi_shakti.webp` · 401 chars · 58 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A single blazing spear hanging in the dark, thrown once and never again. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A single blazing spear hanging in the dark, thrown once and never again. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Aindra-Astra

`aindrastra.webp` · 386 chars · 55 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A sky-blackening rain of arrows falling in a solid sheet. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A sky-blackening rain of arrows falling in a solid sheet. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Agney-Astra

`agneyastra.webp` · 394 chars · 56 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A wall of unquenchable flame advancing across a rank of soldiers. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A wall of unquenchable flame advancing across a rank of soldiers. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Varun-Astra

`varunastra.webp` · 374 chars · 53 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A rising wall of black water swallowing fire. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A rising wall of black water swallowing fire. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Vayavya-Astra

`vayavyastra.webp` · 384 chars · 55 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A screaming spiral of wind tearing a battle line apart. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A screaming spiral of wind tearing a battle line apart. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Nag-Astra

`nagastra.webp` · 401 chars · 56 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A serpent of living arrow-fire striking through smoke, hood spread wide. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A serpent of living arrow-fire striking through smoke, hood spread wide. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Garud-Astra

`garudastra.webp` · 411 chars · 59 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. The shadow of a vast eagle falling across a field, serpents scattering beneath it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
The shadow of a vast eagle falling across a field, serpents scattering beneath it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Bhargav-Astra

`bhargavastra.webp` · 396 chars · 58 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Countless arrows loosed at once from a single point, a fan of fire. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Countless arrows loosed at once from a single point, a fan of fire. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Sammohan-Astra

`sammohana.webp` · 401 chars · 58 words

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

`krishna_charioteer.webp` · 473 chars · 69 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A blue-skinned charioteer in flowing yellow silks and no armour, a peacock feather in his crown, holding the reins and a white conch, serene and faintly smiling. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A blue-skinned charioteer in flowing yellow silks and no armour, a peacock feather in his crown, holding the reins and a white conch, serene and faintly smiling. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### "Ashwatthama is Dead"

`ashwatthama_elephant.webp` · 390 chars · 57 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A war elephant falling in smoke, a lie taking shape above it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A war elephant falling in smoke, a lie taking shape above it. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Gandhari’s Gaze

`gandhari_gaze.webp` · 397 chars · 57 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A blindfold lifted from a queen’s eyes for the first time, terrible light beneath it. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A blindfold lifted from a queen’s eyes for the first time, terrible light beneath it. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Kunti’s Invocation

`kunti_invocation.webp` · 395 chars · 58 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A woman with closed eyes speaking a mantra, a god half-formed in the air above her. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A woman with closed eyes speaking a mantra, a god half-formed in the air above her. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Surya’s Kavacha

`surya_kavacha.webp` · 416 chars · 59 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Golden armour and earrings glowing with sunlight, worn by no one, floating in darkness. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Golden armour and earrings glowing with sunlight, worn by no one, floating in darkness. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### The Ashwins’ Draught

`ashwins_draught.webp` · 379 chars · 51 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Twin physician-gods pouring a luminous draught, horses behind them. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
Twin physician-gods pouring a luminous draught, horses behind them. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### The Fury of Vayu

`vayu_fury.webp` · 402 chars · 57 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A gale tearing across a battlefield, banners and men going over together. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A gale tearing across a battlefield, banners and men going over together. No human figure. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

### Yama’s Summons

`yama_summons.webp` · 382 chars · 56 words

Standalone:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. A dark lord of death holding a noose and a ledger, tallying the field. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```

With style reference:

```
A dark lord of death holding a noose and a ledger, tallying the field. Low camera angle looking up from below, towering scale. Whole subject inside the frame, clear margin, nothing cropped. No photorealism, no 3D rendering, no glossy surfaces, no bloom.
```
