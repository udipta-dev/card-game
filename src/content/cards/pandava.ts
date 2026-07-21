import type { Card } from '@engine/types';

// The Pandava host. Identity: synergy, protection, and the Krishna toolbox.
// Base powers map to the canon rathi/atirathi/maharathi ranking.
export const PANDAVA_CARDS: Card[] = [
  {
    id: 'arjuna',
    name: 'Arjuna',
    house: 'pandava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 10,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    knownAstras: ['brahmastra', 'pashupatastra', 'vaishnavastra', 'agneyastra', 'varunastra', 'garudastra'],
    flavor: 'The finest archer of the age, wielder of the Gandiva.',
  },
  {
    id: 'bhima',
    name: 'Bhima',
    house: 'pandava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 9,
    rows: ['ratha', 'gaja'],
    keywords: [],
    // Vow of the thigh-strike: destroy an enemy unit marked 'diamond-body'
    // (Duryodhana), whose Gandhari-boon otherwise makes it immune.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'enemy' } },
        condition: { q: 'targetHasFlag', flag: 'diamond-body' },
        actions: [{ kind: 'removeFlag', flag: 'diamond-body' }, { kind: 'destroy' }],
      },
    ],
    flavor: 'His mace-vow: to break the thigh of Duryodhana.',
  },
  {
    id: 'yudhishthira',
    name: 'Yudhishthira',
    house: 'pandava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [],
    // Dharmaraja: steadies the line, buff own infantry row.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [
          {
            kind: 'debuffRow',
            amount: 2,
            rows: [{ side: 'own', row: 'padati' }],
            duration: 'round',
          },
        ],
      },
    ],
    flavor: 'The king of righteousness; his word never broke, but once.',
  },
  {
    id: 'abhimanyu',
    name: 'Abhimanyu',
    house: 'pandava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 8,
    rows: ['ratha'],
    // Knows how to enter the Chakravyuha, but not to leave it: if Jayadratha,     // who sealed the formation, stands on the enemy board, Abhimanyu is lost
    // at round's end (before scoring).
    keywords: [],
    effects: [
      {
        on: 'onRoundEnd',
        condition: { q: 'cardOnBoard', card: 'jayadratha', side: 'enemy' },
        target: { pick: 'self' },
        actions: [{ kind: 'destroy' }],
      },
    ],
    flavor: 'Sixteen, and alone inside the wheel formation.',
  },
  {
    id: 'ghatotkacha',
    name: 'Ghatotkacha',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['gaja'],
    keywords: [],
    // The bait: a towering rakshasa. Deployed as a big body that forces the
    // enemy to spend removal (canon: Karna wasted his one Arjuna-kill on him).
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'self' },
        actions: [{ kind: 'buff', amount: 2 }],
      },
    ],
    flavor: 'The rakshasa son of Bhima, Karna spent his one arrow on him.',
  },
  {
    id: 'dhrishtadyumna',
    name: 'Dhrishtadyumna',
    house: 'pandava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    knownAstras: ['agneyastra', 'brahmastra'],
    flavor: 'Born of fire to be the slayer of Drona.',
  },
  {
    id: 'nakula',
    name: 'Nakula',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 6,
    rows: ['ratha', 'padati'],
    keywords: [],
    effects: [],
    flavor: 'Twin of the Ashvins, matchless with the sword.',
  },
  {
    id: 'sahadeva',
    name: 'Sahadeva',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 6,
    rows: ['ratha', 'padati'],
    keywords: [],
    effects: [],
    flavor: 'The wisest of the five, who knew what was to come.',
  },
  {
    id: 'shikhandi',
    name: 'Shikhandi',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [],
    // Presence alone answers Bhishma's icchamrityu, handled by that keyword's
    // `unlessCardOnBoard` check. No effect needed here.
    effects: [],
    flavor: 'Amba reborn; before whom Bhishma would not raise his bow.',
  },
  {
    id: 'pandava_infantry',
    name: 'Pandava Footmen',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 2,
    rows: ['padati'],
    keywords: [],
    effects: [],
    flavor: 'The uncounted spears of the Panchala levy.',
  },

  // ---- Boons ----
  {
    id: 'krishna_charioteer',
    name: 'Krishna, the Charioteer',
    house: 'pandava',
    type: 'boon',
    basePower: 0,
    provision: 10,
    rows: ['ratha'],
    keywords: [],
    // Attaches to a chosen own unit: +3 and the Nagastra-redirect (checked by
    // the astra's condition `targetHasBoon: krishna_charioteer`).
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'own', rows: ['ratha'] } },
        actions: [{ kind: 'buff', amount: 3 }, { kind: 'addFlag', flag: 'krishna-guarded' }],
      },
    ],
    flavor: 'He would not fight, he would only drive, and counsel.',
  },
];
