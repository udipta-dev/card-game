import type { Card } from '@engine/types';

// Divine weapons and battlefield tricks. Astras are 0-power bombs whose value
// is entirely in their effect + consequence. Neutral house = playable by both
// sides in Quickplay.
export const ASTRA_CARDS: Card[] = [
  {
    id: 'nagastra',
    name: 'Nagastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'The serpent-arrow flies true — unless Krishna drives the chariot.' },
    // Destroy the highest-power enemy unit, UNLESS Krishna-as-charioteer is
    // attached to it (the arrow strikes the crown, not the head).
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'highestEnemyUnit' },
        condition: { q: 'not', c: { q: 'targetHasBoon', boon: 'krishna_charioteer' } },
        actions: [{ kind: 'destroy' }],
      },
    ],
    flavor: "Ashwakarna's serpent-son, sworn to Arjuna's ruin.",
  },
  {
    id: 'brahmastra',
    name: 'Brahmastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence: 'Scorches the land where it falls — and singes your own adjacent ranks.',
    },
    // Devastate the enemy row it lands in, scorch it for the rest of the battle,
    // and take collateral damage on your own adjacent rows.
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
    id: 'pashupatastra',
    name: 'Pashupatastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    rows: ['ratha'],
    keywords: [],
    cost: {
      consequence: 'Wins the battle outright — then burns from your grasp for the rest of the run.',
    },
    // Shiva's ultimate. Instant battle win, then self-bans for the run. Never
    // to be loosed upon a lesser foe.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [{ kind: 'winBattle' }, { kind: 'banFromRun', card: 'pashupatastra' }],
      },
    ],
    flavor: 'The weapon that could unmake creation, won by Arjuna from Shiva.',
  },
  {
    id: 'vaishnavastra',
    name: 'Vaishnavastra',
    house: 'neutral',
    type: 'astra',
    basePower: 0,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'Never misses its mark.' },
    // Vishnu's weapon: destroy one chosen enemy unit, ignoring armour/immunity
    // is intentionally NOT granted here (icchamrityu/immuneUntilPlayed still
    // intercept) — canon fidelity: even this bows to a greater boon.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'enemy' } },
        actions: [{ kind: 'destroy' }],
      },
    ],
    flavor: 'Loosed once, it seeks the life it was named for.',
  },

  // ---- Battlefield tricks (deception / vow enablers) ----
  {
    id: 'ashwatthama_elephant',
    name: '"Ashwatthama is Dead"',
    house: 'neutral',
    type: 'curse',
    basePower: 0,
    rows: ['ratha'],
    keywords: [],
    cost: { consequence: 'A half-truth: the elephant, not the man.' },
    // The deception that disarms Drona. Its mere presence satisfies his
    // 'immuneUntilPlayed' keyword; the setPower→0 is applied by that keyword.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [],
      },
    ],
    flavor: 'Naro va kunjaro va — the man, or the elephant.',
  },
];
