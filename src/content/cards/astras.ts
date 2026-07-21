import type { Card } from '@engine/types';

// Divine weapons. Astras are 0-power bombs whose value is entirely their effect.
// Two new rules make them a system rather than free spells:
//   1. Invocation: an astra can only be played while a warrior who knows it
//      (see knownAstras on the warriors) stands on your board.
//   2. The counter-web: if the defender holds a countering astra in hand when
//      this resolves, theirs is spent and this one fizzles.
export const ASTRA_CARDS: Card[] = [
  {
    id: 'nagastra',
    name: 'Nagastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    provision: 8,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    counteredBy: ['garudastra'],
    cost: { consequence: 'The serpent-arrow seeks the head. Garuda is its bane, and Krishna its shield.' },
    // Destroy the highest-power enemy unit, unless Krishna-as-charioteer guards it.
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
    basePower: 0,
    provision: 5,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    // Its true worth is defensive: hold it to devour a Nagastra. Loosed, it strikes.
    cost: { consequence: 'The eagle devours serpents. Hold it to answer a Nagastra.' },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'highestEnemyUnit' },
        actions: [{ kind: 'damage', amount: 5 }],
      },
    ],
    flavor: 'Vishnu’s eagle, whose shadow scatters every naga.',
  },
  {
    id: 'agneyastra',
    name: 'Agneyastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    provision: 6,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    counteredBy: ['varunastra'],
    cost: { consequence: 'Unquenchable fire, until the waters of Varuna rise against it.' },
    // Sweep the struck enemy row with fire.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'enemyRowSameAsPlayed' },
        actions: [{ kind: 'damage', amount: 4 }],
      },
    ],
    flavor: 'Agni’s weapon, a wall of flame no armour turns.',
  },
  {
    id: 'varunastra',
    name: 'Varunastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    provision: 5,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    // Its worth is defensive: hold it to quench an Agneyastra. Loosed, it floods.
    cost: { consequence: 'The flood that drowns fire. Hold it to answer an Agneyastra.' },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'highestEnemyUnit' },
        actions: [{ kind: 'damage', amount: 4 }],
      },
    ],
    flavor: 'Varuna’s deluge, that puts out even divine flame.',
  },
  {
    id: 'brahmastra',
    name: 'Brahmastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    provision: 11,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    counteredBy: ['brahmastra'],
    cost: {
      consequence: 'Scorches the land where it falls, and singes your own adjacent ranks. Only another Brahmastra can answer it.',
    },
    // Devastate the struck enemy row, scorch it for the battle, singe your own adjacent rows.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'enemyRowSameAsPlayed' },
        actions: [{ kind: 'damage', amount: 6 }],
      },
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [
          {
            kind: 'debuffRow',
            amount: -3,
            rows: [{ side: 'enemy', sameAsPlayed: true }],
            duration: 'lingering',
          },
        ],
      },
      {
        on: 'onPlay',
        target: { pick: 'ownAdjacentToPlayed' },
        actions: [{ kind: 'damage', amount: 2 }],
      },
    ],
    flavor: 'Brahma’s weapon; where it strikes, no rain falls for twelve years.',
  },
  {
    id: 'narayanastra',
    name: 'Narayanastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    provision: 13,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    // Canonically answered only by laying down arms. That submission-counter is
    // a future card; for now it is a devastating board strike.
    cost: { consequence: 'It rains death on every foe. In legend, only surrender survives it.' },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'allEnemyUnits' },
        actions: [{ kind: 'damage', amount: 5 }],
      },
    ],
    flavor: 'Vishnu’s storm of weapons, fiercer the harder you fight it.',
  },
  {
    id: 'vaishnavastra',
    name: 'Vaishnavastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    provision: 10,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'Never misses its mark.' },
    // Destroy one chosen enemy unit. Even this bows to a greater boon
    // (icchamrityu / immuneUntilPlayed still intercept).
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'enemy' } },
        actions: [{ kind: 'destroy' }],
      },
    ],
    flavor: 'Loosed once, it seeks the life it was named for.',
  },
  {
    id: 'pashupatastra',
    name: 'Pashupatastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    provision: 15,
    rows: ['ratha'],
    keywords: [],
    cost: {
      consequence: 'Wins the battle outright, then burns from your grasp for the rest of the run. No astra can answer it.',
    },
    // Shiva's ultimate. Instant battle win, then self-bans for the run.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [{ kind: 'winBattle' }, { kind: 'banFromRun', card: 'pashupatastra' }],
      },
    ],
    flavor: 'The weapon that could unmake creation, won by Arjuna from Shiva.',
  },

  // Battlefield trick (not an astra, needs no invoker).
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
    // Its mere play disarms Drona via his immuneUntilPlayed keyword.
    effects: [{ on: 'onPlay', target: { pick: 'none' }, actions: [] }],
    flavor: 'Naro va kunjaro va, the man, or the elephant.',
  },
];
