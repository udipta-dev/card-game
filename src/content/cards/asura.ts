import type { Card } from '@engine/types';

// The Asura host: daityas, danavas, and rakshasa lords drawn from across canon
// (Ramayana, the Puranas, the Devi Mahatmya). Identity: sticky boon-armoured
// bodies, night-growth, and clan bonds. A cross-epic guest faction, tuned by the
// balance lab to sit level with the Pandavas and Kauravas.
export const ASURA_CARDS: Card[] = [
  // ---- Lanka (Ramayana) ----
  {
    id: 'ravana',
    name: 'Ravana',
    house: 'asura',
    type: 'unit',
    tier: 'maharathi',
    // 10. He was set to 9 earlier by preference, and the reason for moving him
    // is better than the reason he was moved down: Brahma's boon made him
    // unkillable by gods, danavas, gandharvas, yakshas and rakshasas, and he
    // did not trouble to ask about men. So Vishnu had to be BORN as one. Every
    // other 10 in this set dies to a mortal with a bow. Bhishma falls to Arjuna
    // behind Shikhandi, Karna to Arjuna outright. Ravana needed an avatar.
    basePower: 10,
    rows: ['ratha'],
    keywords: [{ kind: 'armor', amount: 3 }],
    tags: ['rakshasa'],
    astraMastery: 2,
    ability: {
      name: 'Arrow Rain',
      text: 'Darkens the sky over the enemy host (-2 to every foe). Once per battle.',
      charges: 1,
      target: { pick: 'allEnemyUnits' },
      actions: [{ kind: 'damage', amount: 2 }],
    },
    effects: [],
    flavor: 'The ten-headed lord of Lanka, whose penance armoured him against the gods.',
  },
  {
    id: 'kumbhakarna',
    name: 'Kumbhakarna',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    // 8. Rama's whole host emptied itself into him and he kept walking: they
    // broke his weapon, then he fought with a rock, then bare-handed, and it
    // took Rama severing both arms, then both legs, then the head. Nobody else
    // in this deck absorbs a war like that.
    basePower: 8,
    rows: ['gaja'],
    keywords: [{ kind: 'nightGrowth', amount: 1 }],
    tags: ['rakshasa'],
    effects: [{ on: 'onPlay', target: { pick: 'highestEnemyUnit' }, actions: [{ kind: 'damage', amount: 2 }] }],
    flavor: 'The mountain that sleeps half the year and wakes to devour armies.',
  },
  {
    id: 'indrajit',
    name: 'Indrajit',
    house: 'asura',
    type: 'unit',
    tier: 'maharathi',
    // 10. His NAME is a trophy taken off a god: Indrajit, conqueror of Indra,
    // the only being who beat the king of the devas in open battle. He fought
    // from inside his own invisibility, felled Lakshmana twice, and could not
    // be killed until his unfinished sacrifice was broken up. Level with
    // Ravana: the father needed a boon to be unkillable, the son simply could
    // not be caught.
    basePower: 10,
    rows: ['ratha'],
    keywords: [],
    tags: ['rakshasa'],
    astraMastery: 2,
    knownAstras: ['vaishnavastra'],
    effects: [],
    flavor: 'Meghnad, the only being to defeat Indra, master of every astra.',
  },

  // ---- The great daityas (Puranic) ----
  {
    id: 'hiranyakashipu',
    name: 'Hiranyakashipu',
    house: 'asura',
    type: 'unit',
    tier: 'maharathi',
    // 9, on the same standard that just took Ravana to 10: an avatar had to be
    // invented for him. Brahma's boon closed off man and beast, day and night,
    // indoors and outdoors, ground and air and water, and every weapon. So
    // Vishnu came as neither man nor beast, at dusk which is neither day nor
    // night, on a threshold which is neither in nor out, and used no weapon.
    // He is one below Ravana because he ruled the three worlds and Ravana took
    // them from the gods who held them.
    basePower: 9,
    rows: ['ratha'],
    keywords: [{ kind: 'armor', amount: 2 }],
    tags: ['daitya'],
    // Mastery 2. The Asura deck carried FOUR tier-2 astras and had exactly two
    // men in thirteen who could fire any of them, against four of twelve for the
    // Pandavas and four of thirteen for the Kauravas. The faction whose entire
    // identity is mythical weapons was the worst in the game at casting them,
    // and four of its six astras sat dead in hand unless you drew Ravana or
    // Indrajit. Mastery is not priced into provisions, so this costs nothing.
    //
    // He ruled the three worlds behind a boon and took the devas' places from
    // them. Reading him as untrained in the Brahma line was never defensible.
    astraMastery: 2,
    effects: [],
    flavor: 'The boon-warded king, slain only in the loophole of his own wish.',
  },
  {
    id: 'hiranyaksha',
    name: 'Hiranyaksha',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['gaja'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 1 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'Who dragged the earth beneath the sea, until the Boar rose.',
  },
  {
    id: 'bali',
    name: 'Bali',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'deathless' }],
    tags: ['daitya'],
    effects: [],
    flavor: 'The generous king, deathless in the underworld he was granted.',
  },
  {
    // NOT A VILLAIN, and he was carrying the most generic card in the game: a
    // power-4 body with a clan bond and no effects, handed to the least generic
    // character in the set. Worse, the bond REWARDED him for standing with
    // other daityas, when refusing to do that is his entire story.
    //
    // Krishna names him in the Gita, in the chapter listing the forms the
    // divine itself takes: "I am Vasuki among serpents... I am Prahlada among
    // the Daityas... I am Rama among wielders of weapons" (Bhishma P. XXXIV).
    // He is the divine presence inside the demon race.
    //
    // His father had him poisoned, thrown from cliffs, trampled by elephants,
    // burned, and bound and cast into the sea. Every attempt failed because
    // Vishnu preserved him, and Narasimha was finally born to kill the father
    // and save the son.
    //
    // So he is the exception to the one structural weakness the Asura host has.
    // Vishnu's weapons were made to end asuras (the shrine refuses to teach
    // Narayana or Vaishnava to that house at all), and they will not touch the
    // man Vishnu came in person to protect. While he stands, his host is spared
    // them. A five-year-old with folded hands who blanks the thing designed to
    // beat his faction, without holding a weapon himself.
    id: 'prahlada',
    name: 'Prahlada',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['padati'],
    keywords: [],
    tags: ['daitya'],
    effects: [],
    flavor:
      'The devotee-prince. Poison, fire, the cliff, the elephants and the sea all refused him, and at the last a lion came out of a pillar for his sake.',
  },
  {
    id: 'narakasura',
    name: 'Narakasura',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 1 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'The demon of Pragjyotisha, born of the earth herself.',
  },

  // ---- The Devi's foes (Devi Mahatmya) ----
  {
    id: 'mahishasura',
    name: 'Mahishasura',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['gaja'],
    keywords: [],
    tags: ['asura-lord'],
    // Mastery 2: he broke the combined armies of the gods and held heaven, and
    // fought Durga through nine days and a shifting sequence of forms.
    astraMastery: 2,
    effects: [],
    flavor: 'The buffalo-demon who shifted shape faster than any blade could fall.',
  },
  {
    id: 'shumbha',
    name: 'Shumbha',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'asura-lord', amount: 1 }],
    tags: ['asura-lord'],
    effects: [],
    flavor: 'One of the brother-kings who claimed the three worlds.',
  },
  {
    id: 'nishumbha',
    name: 'Nishumbha',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'asura-lord', amount: 1 }],
    tags: ['asura-lord'],
    effects: [],
    flavor: 'The other brother, never seen apart from Shumbha.',
  },
  {
    id: 'raktabija',
    name: 'Raktabija',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'nightGrowth', amount: 2 }],
    tags: ['daitya'],
    // Every drop of his blood that touched the ground stood up as another of
    // him, and the gods could not fight him because hurting him MADE more of
    // him. Durga's answer was Kali, drinking the blood before it landed.
    //
    // The true version is a spawn-on-damage trigger and the engine has no
    // onDamage event, so this is the closest thing the existing triggers allow:
    // he swells every round he is still standing. Not the mechanic, but the
    // right shape, and it stops him being a vanilla 5 that measured 42.6%.
    effects: [
      {
        on: 'onRoundStart',
        target: { pick: 'self' },
        actions: [{ kind: 'buff', amount: 3 }],
      },
    ],
    flavor: 'From every drop of his blood, a thousand more of him rose. Wounding him was how you lost.',
  },

  // ---- Vedic / elder ----
  {
    id: 'vritra',
    name: 'Vritra',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'nightGrowth', amount: 1 }],
    tags: ['serpent'],
    // Mastery 1, not 2. Raising all three of Vritra, Mahishasura and
    // Hiranyakashipu put the host at five tier-2 wielders in thirteen against
    // four in twelve for the Pandavas, and it flipped Asura from worst deck to
    // best in one step (44.4% -> 51.7%). Vritra gives the point back: he is the
    // Vedic adversary of Indra, but he fights as a devouring serpent and a
    // drought, not as a man reciting mantras over a bow. The other two ruled
    // the three worlds as kings and are the better readings.
    astraMastery: 1,
    effects: [],
    flavor: 'The drought-serpent who swallowed the rivers, until the Vajra fell.',
  },
  {
    id: 'tarakasura',
    name: 'Tarakasura',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 1 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'Whom no one could slay but a son of Shiva, not yet born.',
  },

  // ---- Levy ----
  {
    id: 'asura_horde',
    name: 'Asura Horde',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 2,
    rows: ['padati'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 1 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'The numberless danava rank-and-file.',
  },
];
