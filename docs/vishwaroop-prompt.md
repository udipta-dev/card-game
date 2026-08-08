# Vishwaroop: the art prompt

For the card being split off Krishna. You are right that it is **Vishnu, not
Krishna**: what Arjuna is shown on the field at Kurukshetra is the universal
form, and Krishna is the mouth it speaks through. The prompt is written that
way, so the card can carry Vishnu's iconography rather than the cowherd's.

Save as `src/assets/art/cards/vishwaroop.png` (or `.webp`). Art resolves by
convention, so the file appearing in that folder is the whole of the wiring.

## Why this one is the hardest prompt in the set

Every rule in `art-prompts.md` exists because something went wrong, and this
subject walks straight into three of them at once.

**Rule 0 said "the sign, never the god", and the reason was Brahmashirsha coming
back as four screaming heads stacked in a column.** That rule is about weapons.
Here the god IS the subject, so it inverts, exactly as it does for the deity
portraits. But the failure mode it was guarding against is far more dangerous
here than anywhere else, because Vishwaroop is *literally* the many-headed,
many-armed form. Ask for that plainly and the model will give you the
abomination on purpose.

So the guard is **stillness**. The terror in the Gita passage is not that the
form is writhing; it is that it is vast, calm, and does not stop. Arjuna puts
his palms together and asks it to go back. Every count word below is paired with
a word that holds it still.

**Rule 8: never ask for both an oversized subject and a full-frame fit.** They
fight and the subject loses. Framing wins here, deliberately: a Vishwaroop that
does not fit the frame is the correct picture, so this is the one card in the
set where the subject is allowed to run out of the top of the image.

**Rule 5: negate qualities, never objects.** "No extra heads" would hand you
extra heads. The count is stated positively instead and then bounded.

## The prompt

Standalone, with the style sentence:

```
Ink-and-gouache fantasy illustration, bold black linework, opaque gouache brushwork, muted earthy palette, dramatic chiaroscuro. Vishnu revealed in the universal form on a battlefield at dusk. One enormous serene central face, dark blue-black, eyes half closed, utterly still, with a tall jewelled crown. Behind it three more faces in profile, calm and unmoving, fading into shadow. Many arms spread wide and symmetrical, each holding one emblem: a spoked discus, a conch, a mace, a lotus, a bow, a flame. Ornate golden breastplate, pauldrons, vambraces, a broad jewelled belt, yellow silk. A small armoured archer kneels at the bottom edge with his palms together, tiny against it. Muted indigo and ash against deep gold. The form fills the frame and continues past the top edge. No glossy surfaces, no modern detail, no open mouths, no writhing, serene rather than snarling.
```

With an approved image as style reference, drop the first sentence.

## The lines doing the work, and why

| phrase | what it prevents |
|---|---|
| `one enormous serene central face` | fixes a single focal point before any count is mentioned |
| `three more faces in profile, calm and unmoving` | bounded and turned away, so they read as depth rather than a stack |
| `each holding one emblem` then a list of six | names the arms by what they carry, so the count is derived and never becomes a tangle |
| `spread wide and symmetrical` | symmetry is what makes many arms read as divine instead of insectile |
| `a small armoured archer kneels at the bottom edge` | Arjuna. The scale cue that makes the form vast without asking for "enormous" twice |
| `continues past the top edge` | rule 8, inverted on purpose: not fitting IS the picture |
| `no open mouths, no writhing` | quality negations, per rule 5. Never "no extra heads" |

## If the first pass fails

The likely failure is a symmetrical tangle of limbs with no focal point. The fix
is to cut the arm list from six emblems to four and add *"the central face is
the only face fully lit"*. Do not reduce the face count first: the faces are the
subject and the arms are the decoration.
