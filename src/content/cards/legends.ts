import type { Card } from '@engine/types';

// The ones who never took the field for either host. Some were kept off it, some
// died before it, some refused it. Every mechanic here reuses an engine
// primitive already tested elsewhere, so the expansion adds no new rules:
//   - Jarasandha reuses icchamrityu (Bhishma's keyword), keyed to Bhima.
//   - Shishupala reuses immuneUntilPlayed (Drona's keyword), keyed to Krishna.
//   - Barbarika reuses allUnits + destroy-self (Brahmashirsha + Abhimanyu).
//   - Balarama reuses the Mace Strike ability shape.
export const LEGEND_CARDS: Card[] = [
  {
    id: 'barbarika',
    name: 'Barbarika',
    house: 'legend',
    type: 'unit',
    tier: 'maharathi',
    basePower: 10,
    rows: ['ratha'],
    keywords: [],
    provision: 12,
    tags: ['rakshasa'],
    // The three infallible arrows would have destroyed both armies, because he
    // had vowed to fight for whichever side was losing. So he looses one storm
    // across the whole field and then takes his own head, to watch from afar.
    effects: [
      { on: 'onPlay', target: { pick: 'allUnits' }, actions: [{ kind: 'damage', amount: 3 }] },
      { on: 'onPlay', target: { pick: 'self' }, actions: [{ kind: 'destroy' }] },
    ],
    flavor:
      'Grandson of Bhima. His three arrows could end the war in a breath, so Krishna asked for his head, and set it on a hill to watch.',
  },
  {
    id: 'jarasandha',
    name: 'Jarasandha',
    house: 'legend',
    type: 'unit',
    tier: 'maharathi',
    basePower: 9,
    rows: ['ratha'],
    // Born in two halves and joined by the demoness Jara. He can be slain only
    // by being torn apart again, and only Bhima ever managed it.
    keywords: [{ kind: 'icchamrityu', unlessCardOnBoard: 'bhima' }],
    provision: 10,
    tags: ['magadha'],
    effects: [],
    flavor:
      'The split-born king of Magadha. No weapon fells him; only Bhima, who can tear the two halves apart, may end him.',
  },
  {
    id: 'balarama',
    name: 'Balarama',
    house: 'legend',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['gaja'],
    keywords: [],
    provision: 9,
    tags: ['yadava'],
    // He taught the mace to Bhima and Duryodhana both, then would raise it for
    // neither, and walked the rivers on pilgrimage while they fought.
    ability: {
      name: 'Mace of the Plough',
      text: 'Brings the gada down on the mightiest foe (-6). Once per battle.',
      charges: 1,
      target: { pick: 'highestEnemyUnit' },
      actions: [{ kind: 'damage', amount: 6 }],
    },
    effects: [],
    flavor:
      'Krishna’s elder brother, wielder of the plough Hala. Master of the mace to both camps, he refused to strike for either.',
  },
  {
    id: 'ekalavya',
    name: 'Ekalavya',
    house: 'legend',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    provision: 7,
    tags: ['nishada'],
    // The equal of Arjuna, self-taught before an idol of Drona. Drona claimed
    // his right thumb as a teacher's fee, so his skill at arms is spent.
    effects: [],
    flavor:
      'Self-taught to rival Arjuna, until Drona claimed his right thumb as a teacher’s due. Krishna felled him before the war he would have turned.',
  },
  {
    id: 'shishupala',
    name: 'Shishupala',
    house: 'legend',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    // Krishna vowed to bear a hundred of his offenses, then no more. Untouchable
    // until Krishna takes the field, and then he falls at once.
    keywords: [{ kind: 'immuneUntilPlayed', card: 'krishna_charioteer', thenSetPower: 0 }],
    provision: 6,
    tags: ['chedi'],
    effects: [],
    flavor:
      'Cousin to Krishna, and cursed that Krishna’s hand would end him. He is beyond harm until the hundredth insult, when the discus takes his head.',
  },
  {
    id: 'rukmi',
    name: 'Rukmi',
    house: 'legend',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    provision: 5,
    tags: ['vidarbha'],
    effects: [],
    flavor:
      'A great bow, offered so arrogantly that the Pandavas and Kauravas each refused him in turn. He watched the war having fought for no one.',
  },
];
