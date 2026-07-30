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
    basePower: 9,
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
    astraMastery: 1,
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
    id: 'prahlada',
    name: 'Prahlada',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 4,
    rows: ['padati'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 1 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'The devotee-prince, virtue born inside the demon line.',
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
    astraMastery: 1,
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
    effects: [],
    flavor: 'From every drop of his blood, a thousand more of him rose.',
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
