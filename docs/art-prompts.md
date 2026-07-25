# Kurukshetra: card art prompts

103 prompts, generated from the live card data. Regenerate with `npx vite-node sim/build-art-prompts.ts`.

## How to use these

Each card gives two forms.

- **Standalone** includes the style sentence. Use it when generating from the prompt alone.
- **With style reference** omits the style sentence. Use it when an approved image is uploaded as a Firefly Style Reference, because the reference already supplies the style and repeating it in words gives the model two competing instructions.

Aspect ratio 4:5, set in the generator rather than the prompt. Firefly caps prompts at 1024 characters and has no negative-prompt field.

## What testing taught us

1. **Dense beats minimal.** Stripped-back prompts came out worse: gaps get filled by the model's own priors, which for these characters means a bare chest and calendar art.
2. **Describe armour by coverage**, never by analogy. "Torso completely enclosed" works; "fused to his skin" produced bare skin.
3. **The pose must be depictable.** A weapon held is fine, a weapon in transit is not. A mace raised overhead renders cleanly; a just-released bowstring comes back as melted geometry, because it needs a deformed string and an absent arrow.
4. **Give the face an emotion.** It is most of what separates a character from a mannequin.
5. **Never name a colour for the air.** "Dark indigo air" produced a bright blue daylight sky and killed the chiaroscuro. Name the weather, not the colour.
6. **One item per slot.** Stacked elements turned the first Karna into an all-red mess.
7. **Never name what you do not want.** With no negative-prompt field, every mention is a request.
8. **Do not use JSON.** It collapses the prompt entirely and returns unrelated stock images.

## The style sentence

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold.
```

## The Pandava Host (30)

### Arjuna

`arjuna.webp` · 688 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Arjuna in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, a tall ornate golden war-crown, long black hair, eyes narrowed in cold fury. He draws the Gandiva, a colossal recurved war-bow of gold-chased horn with curling makara-dragon heads, hauled to full draw. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Arjuna in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, a tall ornate golden war-crown, long black hair, eyes narrowed in cold fury. He draws the Gandiva, a colossal recurved war-bow of gold-chased horn with curling makara-dragon heads, hauled to full draw. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Bhima

`bhima.webp` · 646 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Bhima in FULL BATTLE ARMOUR, his torso completely enclosed in a dark iron cuirass banded with heavy gold over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Bull-necked and immense, wild black hair, teeth bared in fury. He raises the Gada, a colossal iron war-mace, its head a fluted mass of gold-banded metal ringed with spikes, lifted overhead mid-swing. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, shattered chariots spinning through the air.
```

With style reference:

```
Bhima in FULL BATTLE ARMOUR, his torso completely enclosed in a dark iron cuirass banded with heavy gold over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Bull-necked and immense, wild black hair, teeth bared in fury. He raises the Gada, a colossal iron war-mace, its head a fluted mass of gold-banded metal ringed with spikes, lifted overhead mid-swing. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, shattered chariots spinning through the air.
```

### Yudhishthira

`yudhishthira.webp` · 640 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Yudhishthira in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Yudhishthira in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Nakula

`nakula.webp` · 616 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Nakula in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Nakula in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Sahadeva

`sahadeva.webp` · 618 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Sahadeva in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Sahadeva in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Abhimanyu

`abhimanyu.webp` · 676 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Abhimanyu in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. A beardless youth, slight beside the men around him, bright unscarred golden armour, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A closing spiral of spears and shields hemming him in on every side.
```

With style reference:

```
Abhimanyu in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. A beardless youth, slight beside the men around him, bright unscarred golden armour, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A closing spiral of spears and shields hemming him in on every side.
```

### Ghatotkacha

`ghatotkacha.webp` · 625 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Ghatotkacha in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. A towering half-rakshasa, tusked and colossal, a wild black mane, dark grey skin, eyes narrowed in cold fury. He raises an enormous studded iron club, lifted overhead mid-swing. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Ghatotkacha in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. A towering half-rakshasa, tusked and colossal, a wild black mane, dark grey skin, eyes narrowed in cold fury. He raises an enormous studded iron club, lifted overhead mid-swing. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Iravan

`iravan.webp` · 616 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Iravan in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Iravan in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Anjanaparvan

`anjanaparvan.webp` · 608 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Anjanaparvan in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Anjanaparvan in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Prativindhya

`prativindhya.webp` · 622 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Prativindhya in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Prativindhya in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Sutasoma

`sutasoma.webp` · 618 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Sutasoma in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Sutasoma in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Shrutakarma

`shrutakarma.webp` · 621 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Shrutakarma in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Shrutakarma in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Shatanika

`shatanika.webp` · 619 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Shatanika in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Shatanika in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Shrutasena

`shrutasena.webp` · 620 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Shrutasena in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Shrutasena in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Dhrishtadyumna

`dhrishtadyumna.webp` · 642 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Dhrishtadyumna in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Dhrishtadyumna in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Shikhandi

`shikhandi.webp` · 619 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Shikhandi in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Shikhandi in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Drupada

`drupada.webp` · 635 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Drupada in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Drupada in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Yudhamanyu

`yudhamanyu.webp` · 620 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Yudhamanyu in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Yudhamanyu in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Uttamaujas

`uttamaujas.webp` · 620 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Uttamaujas in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Uttamaujas in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Virata

`virata.webp` · 634 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Virata in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Virata in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Sweta

`sweta.webp` · 633 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Sweta in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Sweta in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Sankha

`sankha.webp` · 616 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Sankha in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Sankha in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Uttara

`uttara.webp` · 607 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Uttara in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Uttara in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Satyaki

`satyaki.webp` · 635 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Satyaki in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Satyaki in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Chekitana

`chekitana.webp` · 637 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Chekitana in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Chekitana in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Dhrishtaketu

`dhrishtaketu.webp` · 640 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Dhrishtaketu in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Dhrishtaketu in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### The Kekaya Brothers

`kekaya_brothers.webp` · 629 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. The Kekaya Brothers in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
The Kekaya Brothers in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Kuntibhoja

`kuntibhoja.webp` · 620 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Kuntibhoja in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Kuntibhoja in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Yuyutsu

`yuyutsu.webp` · 617 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Yuyutsu in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Yuyutsu in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, eyes narrowed in cold fury. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

### Pandava Footmen

`pandava_infantry.webp` · 594 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Pandava Footmen in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, eyes narrowed in cold fury. He plants a heavy iron spear and a round bossed shield, set to receive a charge. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

With style reference:

```
Pandava Footmen in FULL BATTLE ARMOUR, his torso completely enclosed in a sculpted golden cuirass embossed with a sunburst over a deep blue tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, eyes narrowed in cold fury. He plants a heavy iron spear and a round bossed shield, set to receive a charge. Braced wide, torso torqued. Warm bronze-brown skin. A howling dust-storm, splintered shields spinning through the air.
```

## The Kaurava Host (30)

### Bhishma

`bhishma.webp` · 668 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Bhishma in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Immensely tall and straight-backed, a long white beard, a high silver crown, eyes heavy with sorrow. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Bhishma in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Immensely tall and straight-backed, a long white beard, a high silver crown, eyes heavy with sorrow. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Drona

`drona.webp` · 701 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Drona in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, a grey beard, ash marks across his brow, a sacred thread over the armour, expression cold and measuring. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Drona in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, a grey beard, ash marks across his brow, a sacred thread over the armour, expression cold and measuring. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Karna

`karna.webp` · 690 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Karna in FULL BATTLE ARMOUR, his torso completely enclosed in a seamless golden cuirass engraved with sun-rays over a deep crimson tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, heavy golden Kundala earrings, long black hair in a topknot, eyes steady, mouth set in grim resolve. He draws the Vijaya, a colossal recurved war-bow of gold-chased horn, hauled to full draw. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Karna in FULL BATTLE ARMOUR, his torso completely enclosed in a seamless golden cuirass engraved with sun-rays over a deep crimson tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, heavy golden Kundala earrings, long black hair in a topknot, eyes steady, mouth set in grim resolve. He draws the Vijaya, a colossal recurved war-bow of gold-chased horn, hauled to full draw. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Shalya

`shalya.webp` · 649 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Shalya in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Shalya in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Duryodhana

`duryodhana.webp` · 670 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Duryodhana in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, a heavy jewelled crown, skin faintly gleaming like struck adamant, jaw set, mouth hard with contempt. He raises a colossal gold-banded war-mace, lifted overhead mid-swing. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Duryodhana in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, a heavy jewelled crown, skin faintly gleaming like struck adamant, jaw set, mouth hard with contempt. He raises a colossal gold-banded war-mace, lifted overhead mid-swing. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Dushasana

`dushasana.webp` · 634 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Dushasana in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Dushasana in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Vikarna

`vikarna.webp` · 632 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Vikarna in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Vikarna in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Chitrasena

`chitrasena.webp` · 626 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Chitrasena in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Chitrasena in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Vivimsati

`vivimsati.webp` · 625 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Vivimsati in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Vivimsati in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Durmukha

`durmukha.webp` · 624 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Durmukha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Durmukha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Ashwatthama

`ashwatthama.webp` · 687 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Ashwatthama in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, a burning jewel set into his forehead, blood-flecked armour, wild-eyed and snarling. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Ashwatthama in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, a burning jewel set into his forehead, blood-flecked armour, wild-eyed and snarling. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Kripa

`kripa.webp` · 648 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Kripa in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Kripa in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Kritavarma

`kritavarma.webp` · 653 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Kritavarma in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Kritavarma in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Shakuni

`shakuni.webp` · 562 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Shakuni in FULL BATTLE ARMOUR, his torso completely enclosed in rich unarmoured court silks, rings on every finger, plain shoulder-plates, leather arm-guards, banded war-belt. Lean and stooped, a thin smile, dice cupped in one palm, smiling, eyes cold with calculation. He carries no weapon at all, only the dice. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Shakuni in FULL BATTLE ARMOUR, his torso completely enclosed in rich unarmoured court silks, rings on every finger, plain shoulder-plates, leather arm-guards, banded war-belt. Lean and stooped, a thin smile, dice cupped in one palm, smiling, eyes cold with calculation. He carries no weapon at all, only the dice. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Uluka

`uluka.webp` · 630 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Uluka in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Uluka in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Bahlika

`bahlika.webp` · 650 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Bahlika in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Bahlika in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Somadatta

`somadatta.webp` · 652 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Somadatta in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Somadatta in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Bhurishravas

`bhurishravas.webp` · 655 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Bhurishravas in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Bhurishravas in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Jayadratha

`jayadratha.webp` · 635 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Jayadratha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Jayadratha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Bhagadatta

`bhagadatta.webp` · 639 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Bhagadatta in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Bhagadatta in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Vinda

`vinda.webp` · 630 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Vinda in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Vinda in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Anuvinda

`anuvinda.webp` · 633 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Anuvinda in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Anuvinda in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Susharma

`susharma.webp` · 633 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Susharma in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Susharma in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Sudakshina

`sudakshina.webp` · 635 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Sudakshina in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Sudakshina in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Srutayudha

`srutayudha.webp` · 635 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Srutayudha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Srutayudha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Jalasandha

`jalasandha.webp` · 621 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Jalasandha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Jalasandha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Alambusha

`alambusha.webp` · 634 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Alambusha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Alambusha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Alayudha

`alayudha.webp` · 637 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Alayudha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Alayudha in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, jaw set, mouth hard with contempt. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Vrishasena

`vrishasena.webp` · 635 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Vrishasena in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Vrishasena in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, jaw set, mouth hard with contempt. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

### Kaurava Footmen

`kaurava_infantry.webp` · 609 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Kaurava Footmen in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, jaw set, mouth hard with contempt. He plants a heavy iron spear and a round bossed shield, set to receive a charge. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

With style reference:

```
Kaurava Footmen in FULL BATTLE ARMOUR, his torso completely enclosed in a lacquered crimson cuirass banded with heavy gold over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, jaw set, mouth hard with contempt. He plants a heavy iron spear and a round bossed shield, set to receive a charge. Braced wide, torso torqued. Warm bronze-brown skin. Smoke rolling across a burning field, broken banners spinning through the air.
```

## The Asura Host (15)

### Ravana

`ravana.webp` · 670 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Ravana in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. A colossal ten-headed rakshasa king, ten crowned heads, many arms, all ten faces roaring at once. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Ravana in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. A colossal ten-headed rakshasa king, ten crowned heads, many arms, all ten faces roaring at once. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Kumbhakarna

`kumbhakarna.webp` · 675 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Kumbhakarna in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. A mountainous giant, slab-muscled and tusked, half-shut eyes still heavy with sleep, teeth bared, eyes burning. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Kumbhakarna in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. A mountainous giant, slab-muscled and tusked, half-shut eyes still heavy with sleep, teeth bared, eyes burning. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Indrajit

`indrajit.webp` · 698 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Indrajit in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, half-dissolved into thundercloud, only his drawn bow solid, expression serene and merciless. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Indrajit in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, half-dissolved into thundercloud, only his drawn bow solid, expression serene and merciless. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Hiranyakashipu

`hiranyakashipu.webp` · 655 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Hiranyakashipu in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Hiranyakashipu in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Hiranyaksha

`hiranyaksha.webp` · 620 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Hiranyaksha in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, teeth bared, eyes burning. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Hiranyaksha in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, teeth bared, eyes burning. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Bali

`bali.webp` · 645 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Bali in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Bali in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Prahlada

`prahlada.webp` · 600 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Prahlada in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, teeth bared, eyes burning. He plants a heavy iron spear and a round bossed shield, set to receive a charge. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Prahlada in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, teeth bared, eyes burning. He plants a heavy iron spear and a round bossed shield, set to receive a charge. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Narakasura

`narakasura.webp` · 651 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Narakasura in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Narakasura in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Mahishasura

`mahishasura.webp` · 638 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Mahishasura in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Mahishasura in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He levels a long iron war-lance, its head a broad leaf of steel, braced across his body. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Shumbha

`shumbha.webp` · 648 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Shumbha in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Shumbha in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Nishumbha

`nishumbha.webp` · 632 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Nishumbha in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Nishumbha in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Raktabija

`raktabija.webp` · 632 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Raktabija in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Raktabija in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Vritra

`vritra.webp` · 647 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Vritra in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Vritra in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Tarakasura

`tarakasura.webp` · 633 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Tarakasura in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Tarakasura in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, teeth bared, eyes burning. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

### Asura Horde

`asura_horde.webp` · 603 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Asura Horde in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, teeth bared, eyes burning. He plants a heavy iron spear and a round bossed shield, set to receive a charge. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

With style reference:

```
Asura Horde in FULL BATTLE ARMOUR, his torso completely enclosed in a heavy green-lacquered cuirass banded with dark bronze over a black tunic, plain shoulder-plates, leather arm-guards, banded war-belt. Wiry and weather-beaten, long black hair, teeth bared, eyes burning. He plants a heavy iron spear and a round bossed shield, set to receive a charge. Braced wide, torso torqued. Dark-skinned and inhuman. A night sky torn with lightning, shattered chariots spinning through the air.
```

## Those Who Stood Apart (6)

### Barbarika

`barbarika.webp` · 656 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Barbarika in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, three arrows and nothing else in his quiver, calm, already resigned. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

With style reference:

```
Barbarika in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, three arrows and nothing else in his quiver, calm, already resigned. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

### Jarasandha

`jarasandha.webp` · 664 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Jarasandha in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Immense and thick-limbed, a faint vertical seam running the length of his body, gaze level and unreadable. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

With style reference:

```
Jarasandha in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Immense and thick-limbed, a faint vertical seam running the length of his body, gaze level and unreadable. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

### Balarama

`balarama.webp` · 611 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Balarama in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, fair skin, a drinking horn at his belt, turned away, refusing the field. He plants the plough Hala into the ground like a wall. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

With style reference:

```
Balarama in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, massive layered shoulder-plates, thick articulated arm-guards, studded war-belt. Broad-shouldered and powerful, fair skin, a drinking horn at his belt, turned away, refusing the field. He plants the plough Hala into the ground like a wall. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

### Ekalavya

`ekalavya.webp` · 644 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Ekalavya in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, forest dress, the right thumb missing from his draw hand, unbowed, jaw set. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

With style reference:

```
Ekalavya in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, forest dress, the right thumb missing from his draw hand, unbowed, jaw set. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

### Shishupala

`shishupala.webp` · 614 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Shishupala in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, gaze level and unreadable. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

With style reference:

```
Shishupala in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, gaze level and unreadable. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

### Rukmi

`rukmi.webp` · 609 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Rukmi in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, gaze level and unreadable. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

With style reference:

```
Rukmi in FULL BATTLE ARMOUR, his torso completely enclosed in a plain steel cuirass chased with silver over a grey tunic, layered shoulder-plates, articulated arm-guards, jewelled war-belt. Hard-muscled and scarred, long black hair, gaze level and unreadable. He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked. Braced wide, torso torqued. Warm bronze-brown skin. Drifting ash over an empty field, a single broken banner turning in the air.
```

## Astras (14)

### Brahma-Astra

`brahmastra.webp` · 314 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Brahma-Astra: a single arrow blooming into a column of white fire, the ground beneath already ash. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Brahma-Astra: a single arrow blooming into a column of white fire, the ground beneath already ash. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Brahmashirsha-Astra

`brahmashirsha.webp` · 320 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Brahmashirsha-Astra: a four-faced pillar of fire rising from a scorched horizon, the air itself burning. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Brahmashirsha-Astra: a four-faced pillar of fire rising from a scorched horizon, the air itself burning. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Pashupat-Astra

`pashupatastra.webp` · 335 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Pashupat-Astra: a single unbearable eye of white fire opening in a black sky, the world thinning to nothing beneath it. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Pashupat-Astra: a single unbearable eye of white fire opening in a black sky, the world thinning to nothing beneath it. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Narayan-Astra

`narayanastra.webp` · 321 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Narayan-Astra: a sky filled edge to edge with descending divine weapons, discs and spears without number. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Narayan-Astra: a sky filled edge to edge with descending divine weapons, discs and spears without number. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Vaishnav-Astra

`vaishnavastra.webp` · 318 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Vaishnav-Astra: a discus of blue-white light travelling with impossible certainty across a dark field. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Vaishnav-Astra: a discus of blue-white light travelling with impossible certainty across a dark field. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Vasavi Shakti

`vasavi_shakti.webp` · 303 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Vasavi Shakti: a single blazing spear hanging in the dark, thrown once and never again. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Vasavi Shakti: a single blazing spear hanging in the dark, thrown once and never again. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Aindra-Astra

`aindrastra.webp` · 287 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Aindra-Astra: a sky-blackening rain of arrows falling in a solid sheet. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Aindra-Astra: a sky-blackening rain of arrows falling in a solid sheet. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Agney-Astra

`agneyastra.webp` · 294 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Agney-Astra: a wall of unquenchable flame advancing across a rank of soldiers. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Agney-Astra: a wall of unquenchable flame advancing across a rank of soldiers. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Varun-Astra

`varunastra.webp` · 274 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Varun-Astra: a rising wall of black water swallowing fire. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Varun-Astra: a rising wall of black water swallowing fire. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Vayavya-Astra

`vayavyastra.webp` · 286 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Vayavya-Astra: a screaming spiral of wind tearing a battle line apart. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Vayavya-Astra: a screaming spiral of wind tearing a battle line apart. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Nag-Astra

`nagastra.webp` · 299 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Nag-Astra: a serpent of living arrow-fire striking through smoke, hood spread wide. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Nag-Astra: a serpent of living arrow-fire striking through smoke, hood spread wide. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Garud-Astra

`garudastra.webp` · 311 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Garud-Astra: the shadow of a vast eagle falling across a field, serpents scattering beneath it. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Garud-Astra: the shadow of a vast eagle falling across a field, serpents scattering beneath it. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Bhargav-Astra

`bhargavastra.webp` · 298 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Bhargav-Astra: countless arrows loosed at once from a single point, a fan of fire. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Bhargav-Astra: countless arrows loosed at once from a single point, a fan of fire. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

### Sammohan-Astra

`sammohana.webp` · 293 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Sammohan-Astra: The weapon of sleep Arjuna loosed on the Kuru host at Virata. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Sammohan-Astra: The weapon of sleep Arjuna loosed on the Kuru host at Virata. No human figure, the weapon itself filling the frame. Darkness lit by distant fires, deep shadow.
```

## Vardaan and Fates (8)

### Krishna, the Charioteer

`krishna_charioteer.webp` · 257 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Krishna, the Charioteer: He would not fight, he would only drive, and counsel. No human figure. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Krishna, the Charioteer: He would not fight, he would only drive, and counsel. No human figure. Darkness lit by distant fires, deep shadow.
```

### "Ashwatthama is Dead"

`ashwatthama_elephant.webp` · 263 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. "Ashwatthama is Dead": a war elephant falling in smoke, a lie taking shape above it. No human figure. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
"Ashwatthama is Dead": a war elephant falling in smoke, a lie taking shape above it. No human figure. Darkness lit by distant fires, deep shadow.
```

### Gandhari’s Gaze

`gandhari_gaze.webp` · 281 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Gandhari’s Gaze: a blindfold lifted from a queen’s eyes for the first time, terrible light beneath it. No human figure. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Gandhari’s Gaze: a blindfold lifted from a queen’s eyes for the first time, terrible light beneath it. No human figure. Darkness lit by distant fires, deep shadow.
```

### Kunti’s Invocation

`kunti_invocation.webp` · 282 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Kunti’s Invocation: a woman with closed eyes speaking a mantra, a god half-formed in the air above her. No human figure. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Kunti’s Invocation: a woman with closed eyes speaking a mantra, a god half-formed in the air above her. No human figure. Darkness lit by distant fires, deep shadow.
```

### Surya’s Kavacha

`surya_kavacha.webp` · 283 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Surya’s Kavacha: golden armour and earrings glowing with sunlight, worn by no one, floating in darkness. No human figure. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Surya’s Kavacha: golden armour and earrings glowing with sunlight, worn by no one, floating in darkness. No human figure. Darkness lit by distant fires, deep shadow.
```

### The Ashwins’ Draught

`ashwins_draught.webp` · 268 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. The Ashwins’ Draught: twin physician-gods pouring a luminous draught, horses behind them. No human figure. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
The Ashwins’ Draught: twin physician-gods pouring a luminous draught, horses behind them. No human figure. Darkness lit by distant fires, deep shadow.
```

### The Fury of Vayu

`vayu_fury.webp` · 270 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. The Fury of Vayu: a gale tearing across a battlefield, banners and men going over together. No human figure. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
The Fury of Vayu: a gale tearing across a battlefield, banners and men going over together. No human figure. Darkness lit by distant fires, deep shadow.
```

### Yama’s Summons

`yama_summons.webp` · 265 chars

Standalone:

```
Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, deep chiaroscuro, lavish gold. Yama’s Summons: a dark lord of death holding a noose and a ledger, tallying the field. No human figure. Darkness lit by distant fires, deep shadow.
```

With style reference:

```
Yama’s Summons: a dark lord of death holding a noose and a ledger, tallying the field. No human figure. Darkness lit by distant fires, deep shadow.
```
