import type { Card } from '@engine/types';

// The Kaurava host. Identity: overwhelming numbers and top-tier maharathis,
// each shielded by a canonical boon/curse that must be answered, not out-muscled.
export const KAURAVA_CARDS: Card[] = [
  {
    id: 'bhishma',
    name: 'Bhishma',
    house: 'kaurava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 10,
    rows: ['ratha'],
    // Icchamrityu: death only at his own will. Cannot be removed by any effect
    // until Shikhandi stands on the board.
    keywords: [{ kind: 'icchamrityu', unlessCardOnBoard: 'shikhandi' }],
    effects: [],
    flavor: 'Granted the boon to choose the hour of his own death.',
  },
  {
    id: 'drona',
    name: 'Drona',
    house: 'kaurava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 9,
    rows: ['ratha'],
    // Immune while armed. Only the false news of Ashwatthama's death — the
    // 'ashwatthama_elephant' deception — makes him lay down his bow (power → 0).
    keywords: [{ kind: 'immuneUntilPlayed', card: 'ashwatthama_elephant', thenSetPower: 0 }],
    effects: [],
    flavor: 'The war-guru; unbeatable until grief unstrung his bow.',
  },
  {
    id: 'karna',
    name: 'Karna',
    house: 'kaurava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 10,
    rows: ['ratha'],
    // Kavacha-Kundala: born-armour absorbs the first removal aimed at him.
    // Parashurama's curse: he cannot invoke astras in the final round.
    keywords: [
      { kind: 'armor', amount: 4 },
      { kind: 'noAstrasInFinalRound' },
    ],
    // Bhoomi's curse: if he is deployed in the deciding round, his chariot
    // wheel sinks — power collapses to 0. (Strategic tension: play the armoured
    // Karna early, or risk the decider.)
    effects: [
      {
        on: 'onPlay',
        condition: { q: 'isFinalRound' },
        target: { pick: 'self' },
        actions: [{ kind: 'setPower', value: 0 }, { kind: 'addFlag', flag: 'wheel-sunk' }],
      },
    ],
    flavor: 'Son of the Sun; undone by two curses at the last.',
  },
  {
    id: 'duryodhana',
    name: 'Duryodhana',
    house: 'kaurava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    // Gandhari's gaze hardened his body to diamond — except the thighs.
    // The 'diamond-body' flag makes him immune to removal until Bhima strikes.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'self' },
        actions: [{ kind: 'addFlag', flag: 'diamond-body' }],
      },
    ],
    flavor: 'Adamantine but for the thighs his mother never saw.',
  },
  {
    id: 'ashwatthama',
    name: 'Ashwatthama',
    house: 'kaurava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    flavor: "Drona's son, cursed to wander deathless and unhealing.",
  },
  {
    id: 'dushasana',
    name: 'Dushasana',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 6,
    rows: ['ratha', 'gaja'],
    keywords: [],
    effects: [],
    flavor: 'Whose hands at the dice-hall sealed the war.',
  },
  {
    id: 'shakuni',
    name: 'Shakuni',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 3,
    rows: ['padati'],
    keywords: [],
    // The loaded dice: weaken the strongest enemy unit.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'highestEnemyUnit' },
        actions: [{ kind: 'damage', amount: 3 }],
      },
    ],
    flavor: 'His dice never rolled true for anyone but him.',
  },
  {
    id: 'jayadratha',
    name: 'Jayadratha',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    // Shiva's boon: for one day he held the whole Pandava host at the gate.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [
          {
            kind: 'debuffRow',
            amount: -2,
            rows: [{ side: 'enemy', row: 'padati' }],
            duration: 'round',
          },
        ],
      },
    ],
    flavor: 'The gate-keeper who sealed Abhimanyu inside the wheel.',
  },
  {
    id: 'kaurava_infantry',
    name: 'Kaurava Footmen',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 2,
    rows: ['padati'],
    keywords: [],
    effects: [],
    flavor: 'Eleven akshauhinis marched for Hastinapura.',
  },
];
