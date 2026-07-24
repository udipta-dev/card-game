import { ADHARMA_CURSES as ADHARMA } from '@engine/clash';
import type { Card } from '@engine/types';

// Divine weapons. Astras are 0-power bombs whose value is entirely their effect.
// Rules: an astra is only playable while a warrior who knows it (knownAstras on
// the wielders) is on your board; and a countering astra held in the defender's
// hand is spent to negate an incoming one (the canonical counter-web).
export const ASTRA_CARDS: Card[] = [
  // ---- The Brahma line ----
  {
    id: 'brahmastra',
    name: 'Brahmastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 2,
    basePower: 0,
    provision: 11,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    counteredBy: ['brahmastra'],
    cost: {
      consequence:
        'Scorches the land where it falls and singes your own adjacent ranks. Loosing it is an act of adharma: a curse follows you for it. Only another Brahmastra can answer it.',
    },
    effects: [
      { on: 'onPlay', target: { pick: 'enemyRowSameAsPlayed' }, actions: [{ kind: 'damage', amount: 6 }] },
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [
          { kind: 'debuffRow', amount: -3, rows: [{ side: 'enemy', sameAsPlayed: true }], duration: 'lingering' },
        ],
      },
      { on: 'onPlay', target: { pick: 'ownAdjacentToPlayed' }, actions: [{ kind: 'damage', amount: 2 }] },
      // The weapon wins you the row. The adharma of loosing it stays with you.
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'afflict', side: 'own', pool: ADHARMA }] },
    ],
    flavor: 'Brahma’s weapon; where it strikes, no rain falls for twelve years.',
  },
  {
    id: 'brahmashirsha',
    name: 'Brahmashirsha',
    house: 'neutral',
    type: 'astra',
    astraTier: 3,
    basePower: 0,
    provision: 13,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    counteredBy: ['brahmashirsha', 'brahmastra'],
    cost: {
      consequence:
        'Utter destruction. Every warrior on the field falls, yours among them. Only the deathless walk out of it, and the one who loosed it is cursed for the act.',
    },
    effects: [
      // Brahma himself told Drona this should never be loosed. It takes the
      // whole field: both hosts. The chiranjivis (Ashwatthama, Kripa, Bali)
      // survive it, exactly as they survived the night of the Sauptika Parva.
      { on: 'onPlay', target: { pick: 'allUnits' }, actions: [{ kind: 'destroy' }] },
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [
          {
            kind: 'debuffRow',
            amount: -3,
            rows: [
              { side: 'enemy', row: 'ratha' },
              { side: 'enemy', row: 'gaja' },
              { side: 'enemy', row: 'padati' },
              { side: 'own', row: 'ratha' },
              { side: 'own', row: 'gaja' },
              { side: 'own', row: 'padati' },
            ],
            duration: 'lingering',
          },
        ],
      },
      // And the price falls on the one who fired.
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'afflict', side: 'own', pool: ADHARMA }] },
    ],
    flavor: 'The four-headed weapon. Brahma warned Drona never to loose it.',
  },
  {
    id: 'pashupatastra',
    name: 'Pashupatastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 3,
    basePower: 0,
    provision: 15,
    rows: ['ratha'],
    keywords: [],
    cost: {
      consequence:
        'You win this battle the instant it is loosed. Then five warriors are torn out of your deck forever, and the weapon burns from your grasp. Nothing answers it. Nothing survives it.',
    },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [
          { kind: 'winBattle' },
          { kind: 'banFromRun', card: 'pashupatastra' },
          // Won at what cost. Five of your own are unmade along with the field.
          { kind: 'burnOwnDeck', count: 5 },
        ],
      },
    ],
    flavor: 'The weapon that could unmake creation, won by Arjuna from Shiva.',
  },

  // ---- Vishnu line ----
  {
    id: 'narayanastra',
    name: 'Narayanastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 3,
    basePower: 0,
    provision: 13,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'It rains death on every foe. In legend, only surrender survives it.' },
    effects: [{ on: 'onPlay', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'damage', amount: 5 }] }],
    flavor: 'Vishnu’s storm of weapons, fiercer the harder you fight it.',
  },
  {
    id: 'vaishnavastra',
    name: 'Vaishnavastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 3,
    basePower: 0,
    provision: 10,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'Never misses its chosen mark, save the shield of Krishna.' },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'enemy' } },
        condition: { q: 'not', c: { q: 'targetHasBoon', boon: 'krishna_charioteer' } },
        actions: [{ kind: 'destroy' }],
      },
    ],
    flavor: 'Loosed once by Bhagadatta, caught by Krishna as a garland.',
  },

  // ---- Indra's gifts ----
  {
    id: 'vasavi_shakti',
    name: 'Vasavi Shakti',
    house: 'neutral',
    type: 'astra',
    astraTier: 3,
    basePower: 0,
    provision: 12,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'Indra’s unerring dart, but it can be loosed only once, then it is gone.' },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'highestEnemyUnit' },
        actions: [{ kind: 'destroy' }, { kind: 'banFromRun', card: 'vasavi_shakti' }],
      },
    ],
    flavor: 'The spear Karna traded his armour for, spent on Ghatotkacha.',
  },
  {
    id: 'aindrastra',
    name: 'Aindrastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 1,
    basePower: 0,
    provision: 9,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'A sky-blackening rain of arrows on a whole rank.' },
    effects: [{ on: 'onPlay', target: { pick: 'enemyRowSameAsPlayed' }, actions: [{ kind: 'damage', amount: 4 }] }],
    flavor: 'Indra’s shower, loosed by his son Arjuna.',
  },

  // ---- Elemental line + counters ----
  {
    id: 'agneyastra',
    name: 'Agneyastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 1,
    basePower: 0,
    provision: 6,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    counteredBy: ['varunastra'],
    cost: { consequence: 'Unquenchable fire, until the waters of Varuna rise against it.' },
    effects: [{ on: 'onPlay', target: { pick: 'enemyRowSameAsPlayed' }, actions: [{ kind: 'damage', amount: 4 }] }],
    flavor: 'Agni’s weapon, a wall of flame no armour turns.',
  },
  {
    id: 'varunastra',
    name: 'Varunastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 1,
    basePower: 0,
    provision: 5,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'The flood that drowns fire. Hold it to answer an Agneyastra.' },
    effects: [{ on: 'onPlay', target: { pick: 'highestEnemyUnit' }, actions: [{ kind: 'damage', amount: 4 }] }],
    flavor: 'Varuna’s deluge, that puts out even divine flame.',
  },
  {
    id: 'vayavyastra',
    name: 'Vayavyastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 1,
    basePower: 0,
    provision: 6,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'A gale that scatters a rank like chaff.' },
    effects: [{ on: 'onPlay', target: { pick: 'enemyRowSameAsPlayed' }, actions: [{ kind: 'damage', amount: 3 }] }],
    flavor: 'Vayu’s wind, that Bhima’s father lends the Gandiva.',
  },
  {
    id: 'nagastra',
    name: 'Nagastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 1,
    basePower: 0,
    provision: 8,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    counteredBy: ['garudastra'],
    cost: { consequence: 'The serpent-arrow seeks the head. Garuda is its bane, and Krishna its shield.' },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'highestEnemyUnit' },
        condition: { q: 'not', c: { q: 'targetHasBoon', boon: 'krishna_charioteer' } },
        actions: [{ kind: 'destroy' }],
      },
    ],
    flavor: "Ashwasena's serpent-son, sworn to Arjuna's ruin.",
  },
  {
    id: 'garudastra',
    name: 'Garudastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 1,
    basePower: 0,
    provision: 5,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'The eagle devours serpents. Hold it to answer a Nagastra.' },
    effects: [{ on: 'onPlay', target: { pick: 'highestEnemyUnit' }, actions: [{ kind: 'damage', amount: 5 }] }],
    flavor: 'Vishnu’s eagle, whose shadow scatters every naga.',
  },

  // ---- Parashurama's line + disablers ----
  {
    id: 'bhargavastra',
    name: 'Bhargavastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 2,
    basePower: 0,
    provision: 9,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'Parashurama’s endless volley falls on every foe.' },
    effects: [{ on: 'onPlay', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'damage', amount: 3 }] }],
    flavor: 'Learned from Parashurama, the pride of Karna.',
  },
  {
    id: 'sammohana',
    name: 'Sammohanastra',
    house: 'neutral',
    type: 'astra',
    astraTier: 2,
    basePower: 0,
    provision: 8,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'A stupor that unstrings the whole enemy line for the round.' },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [
          {
            kind: 'debuffRow',
            amount: -2,
            rows: [
              { side: 'enemy', row: 'ratha' },
              { side: 'enemy', row: 'gaja' },
              { side: 'enemy', row: 'padati' },
            ],
            duration: 'round',
          },
        ],
      },
    ],
    flavor: 'The weapon of sleep Arjuna loosed on the Kuru host at Virata.',
  },

  // ---- Battlefield trick (not an astra, needs no invoker) ----
  {
    id: 'ashwatthama_elephant',
    name: '"Ashwatthama is Dead"',
    house: 'neutral',
    type: 'curse',
    basePower: 0,
    provision: 4,
    rows: ['ratha'],
    keywords: [],
    cost: { consequence: 'A half-truth: the elephant, not the man.' },
    effects: [{ on: 'onPlay', target: { pick: 'none' }, actions: [] }],
    flavor: 'Naro va kunjaro va, the man, or the elephant.',
  },
];
