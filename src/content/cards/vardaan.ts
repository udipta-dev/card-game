import type { Card } from '@engine/types';

// Vardaan: the gifts of the gods and the great mothers, granted at a shrine
// between battles rather than built into a deck. Every one is ONE-SHOT: it bans
// itself for the rest of the run the moment it is spent, so a gift is a moment
// you choose, not a card you draw again.
//
// Some are offered with a shrap bound to them (see run/shrine.ts). Nothing the
// gods give is free, which is the whole point of the epic.
export const VARDAAN_CARDS: Card[] = [
  {
    id: 'gandhari_gaze',
    name: 'Gandhari’s Gaze',
    house: 'neutral',
    type: 'boon',
    basePower: 0,
    provision: 12,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence:
        'She unbinds her blindfold once. What her eyes fall upon turns adamant, and no weapon may fell it.',
    },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'own' } },
        actions: [
          { kind: 'addFlag', flag: 'diamond-body' },
          { kind: 'buff', amount: 2 },
        ],
      },
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'banFromRun', card: 'gandhari_gaze' }] },
    ],
    flavor: 'Blindfolded for a lifetime, so that the one look she spent would be worth a kingdom.',
  },
  {
    id: 'kunti_invocation',
    name: 'Kunti’s Invocation',
    house: 'neutral',
    type: 'curse',
    basePower: 0,
    provision: 13,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence: 'She speaks the mantra Durvasa gave her. A god answers, and the mightiest foe falls.',
    },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'highestEnemyUnit' },
        actions: [{ kind: 'destroy' }],
      },
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'banFromRun', card: 'kunti_invocation' }] },
    ],
    flavor: 'The mantra that could summon any god at will. She spoke it once too early, and the sun answered.',
  },
  {
    id: 'surya_kavacha',
    name: 'Surya’s Kavacha',
    house: 'neutral',
    type: 'boon',
    basePower: 0,
    provision: 10,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'Armour born of the sun. The warrior it clothes is greatly strengthened.' },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'own' } },
        actions: [{ kind: 'buff', amount: 5 }],
      },
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'banFromRun', card: 'surya_kavacha' }] },
    ],
    flavor: 'The gift Karna was born wearing, and gave away to a beggar who was Indra.',
  },
  {
    id: 'ashwins_draught',
    name: 'The Ashwins’ Draught',
    house: 'neutral',
    type: 'curse',
    basePower: 0,
    provision: 10,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'The physicians of the gods walk your lines. Every warrior you field is restored.' },
    effects: [
      { on: 'onPlay', target: { pick: 'allOwnUnits' }, actions: [{ kind: 'buff', amount: 2 }] },
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'banFromRun', card: 'ashwins_draught' }] },
    ],
    flavor: 'Twin healers of heaven, fathers of Nakula and Sahadeva.',
  },
  {
    id: 'vayu_fury',
    name: 'The Fury of Vayu',
    house: 'neutral',
    type: 'curse',
    basePower: 0,
    provision: 11,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'The wind god answers his son. A gale tears through every enemy on the field.' },
    effects: [
      { on: 'onPlay', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'damage', amount: 3 }] },
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'banFromRun', card: 'vayu_fury' }] },
    ],
    flavor: 'Father of Bhima and Hanuman both. When he rises, no line holds.',
  },
  {
    id: 'yama_summons',
    name: 'Yama’s Summons',
    house: 'neutral',
    type: 'curse',
    basePower: 0,
    provision: 11,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'The lord of the dead calls the roll. The enemy host withers before him.' },
    effects: [
      { on: 'onPlay', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'buff', amount: -2 }] },
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'banFromRun', card: 'yama_summons' }] },
    ],
    flavor: 'Dharma himself, who fathered Yudhishthira and once tested him at a lake.',
  },
];
