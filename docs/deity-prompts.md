# Kurukshetra: deity art prompts

The eight gods who preside over shrines (`DEITIES` in `src/run/shrine.ts`). None of
them has art today.

## Where the files go

```
src/assets/art/deities/<deity_id>.png
```

`png`, `webp`, `jpg` and `avif` all work. **This folder does not exist yet and
nothing loads from it**, unlike `art/cards`, which resolves by convention. Dropping
files here does nothing until the shrine screen is pointed at them; that is a small
change and is not done.

Ids, exactly: `agni`, `varuna`, `vayu`, `indra`, `brahma`, `parashurama`,
`narayana`, `shiva`.

## Framing

**4:5 portrait**, same as the cards. Assume the bottom may be cropped on small
screens, so keep the face and the emblem in the upper two thirds and let the loss
fall on the feet.

## Rules carried over from the card prompts

These cost real generations. The full reasoning is in `art-prompts.md`.

- **Enumerate armour by its proper term**: breastplate, pauldrons, vambraces,
  greaves, belt. This is what ended the bare-chested renders.
- **Never a weapon in transit, and never assign hands.** No mid-throw, no drawn
  bow. List what the god holds and let the model place the limbs.
- **Negate qualities, never objects.** "No glossy surfaces" is safe. "No sword"
  hands you a sword.
- **One global palette instruction** beats per-item colour discipline.
- **No hue on air.** A value on a named weather object is fine.
- **Naming the god is safe**, so long as no slot is left blank.
- **Around 110 words.**

## The one rule that inverts here

The weapon prompts are built on *"the sign, never the god"*, because a face
glaring out of a lotus is a cartoon. **These are portraits, so the god appears.**
The guard that replaces it is **serene, never snarling**: the terror of these
figures is composure, not a grimace. Brahma's four faces are correct and canonical
on Brahma himself; it was putting them on a weapon that produced the abomination.

## The style sentence

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro.
```

---

## agni

> Agni, lord of fire, god of the sacrificial flame. Ink-and-gouache fantasy
> illustration, bold black linework, opaque gouache brushwork, muted earthy
> palette, dramatic chiaroscuro. Dark red skin, two calm faces, hair and beard of
> living flame, seven tongues of fire rising from his shoulders. Four arms bearing
> a flaming spear, a long-handled sacrificial ladle, a string of beads and a
> water vessel. Golden breastplate, pauldrons, vambraces, a heavy jewelled belt,
> deep red silk about the legs. He sits astride a black ram with heavy curled
> horns. Behind him a tall banner of dark smoke. Embers drift across the frame.
> Deep reds and soot black against warm gold. Full figure, centred, calm and
> unblinking. No glossy surfaces, no modern detail, serene rather than snarling.

## varuna

> Varuna, lord of the waters and of binding oaths. Ink-and-gouache fantasy
> illustration, bold black linework, opaque gouache brushwork, muted earthy
> palette, dramatic chiaroscuro. Pale sea-green skin, a still face, long white
> hair and beard moving as if underwater. Four arms bearing a coiled noose of
> braided rope, a conch, a lotus and a water vessel. Golden breastplate,
> pauldrons, vambraces, a jewelled belt, wet dark blue silk clinging about the
> legs. He rides a great scaled makara, part crocodile and part fish, breaking
> from black water. Behind him a wall of slow standing waves. Muted teal and
> slate against tarnished gold. Full figure, centred. No glossy surfaces, no
> modern detail, serene rather than snarling.

## vayu

> Vayu, the wind, father of Bhima. Ink-and-gouache fantasy illustration, bold
> black linework, opaque gouache brushwork, muted earthy palette, dramatic
> chiaroscuro. Lean and weathered, dusk-grey skin, a hard calm face, long hair and
> beard streaming sideways in a gale. Two arms bearing a tall banner-staff and a
> goad. Golden breastplate, pauldrons, vambraces, a plain belt, coarse pale silk
> about the legs whipping hard to one side. He stands braced on the back of a
> running antelope. Behind him torn dark storm-cloud and a column of dust and
> flying leaves. Everything in the frame leans one way. Muted grey-green and
> bone against dull gold. Full figure, centred. No glossy surfaces, no modern
> detail, serene rather than snarling.

## indra

> Indra, king of the devas. Ink-and-gouache fantasy illustration, bold black
> linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro.
> Golden-brown skin marked all over with faint eye-shapes, a proud still face,
> heavy dark moustache, a tall jewelled crown. Four arms bearing the vajra, a
> hooked goad, a conch and a lotus. Ornate golden breastplate, pauldrons,
> vambraces, greaves, a broad jewelled belt, saffron silk about the legs. He is
> seated on Airavata, an enormous white elephant with four tusks. Behind him dark
> thunderclouds split by a distant bolt. Muted ivory and storm-grey against deep
> gold. Full figure, centred, imperious. No glossy surfaces, no modern detail,
> serene rather than snarling.

## brahma

> Brahma, the creator. Ink-and-gouache fantasy illustration, bold black linework,
> opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. An aged
> serene sage, warm ochre skin, four faces looking outward to four directions,
> each with a long white beard and calm lowered eyes, all four crowned as one.
> Four arms bearing a palm-leaf manuscript, a string of beads, a water vessel and
> a long-handled sacrificial ladle. Simple undyed cloth over one shoulder, a plain
> sacred thread, a jewelled belt, no armour. He sits cross-legged on an open lotus
> above still water, a white swan beside him. Muted ochre and parchment against
> pale gold. Full figure, centred, perfectly composed. No glossy surfaces, no
> modern detail, no open mouths, serene rather than snarling.

## parashurama

> Parashurama, the axe-bearer, brahmin and warrior, who taught Karna. Ink-and-
> gouache fantasy illustration, bold black linework, opaque gouache brushwork,
> muted earthy palette, dramatic chiaroscuro. A powerfully built ascetic, dark
> weathered skin, matted hair bound high, a heavy black beard, a hard and patient
> face. Two arms, one resting a huge long-handled battle-axe head-down against the
> ground, a great bow slung across his back. Bare chested with a plain sacred
> thread, coarse bark-cloth about the legs, a simple belt, rudraksha beads at the
> throat and wrists. He stands on bare rock above a dry riverbed. Behind him a
> single blasted tree. Muted umber and ash against dull bronze. Full figure,
> centred. No glossy surfaces, no modern detail, serene rather than snarling.

## narayana

> Narayana, Vishnu, who preserves. Ink-and-gouache fantasy illustration, bold
> black linework, opaque gouache brushwork, muted earthy palette, dramatic
> chiaroscuro. Deep blue-black skin, a young unlined face, calm half-closed eyes,
> a tall jewelled crown, heavy earrings. Four arms bearing a spoked discus, a
> conch, a mace and a lotus. Ornate golden breastplate, pauldrons, vambraces, a
> broad jewelled belt, yellow silk about the legs, a long garland of forest
> flowers to the knee. He stands before the coiled white serpent Shesha, whose
> many hoods spread behind him like a canopy. Muted indigo and cream against warm
> gold. Full figure, centred, entirely still. No glossy surfaces, no modern
> detail, serene rather than snarling.

## shiva

> Shiva, the destroyer, who tests those who dare seek him. Ink-and-gouache
> fantasy illustration, bold black linework, opaque gouache brushwork, muted
> earthy palette, dramatic chiaroscuro. Ash-pale skin streaked with grey, matted
> hair piled high with a crescent moon set in it and a thin stream of water
> falling from the coils, a closed vertical third eye on the forehead, a calm
> unreadable face. Four arms bearing a tall trident, a small hand drum, a string
> of beads and a begging bowl. Bare chested, a live serpent about the throat, a
> tiger skin about the waist, no armour. He sits cross-legged on the tiger skin on
> bare mountain rock. Muted ash-grey and bone against cold gold. Full figure,
> centred. No glossy surfaces, no modern detail, serene rather than snarling.
