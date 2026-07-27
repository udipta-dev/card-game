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
    name: 'Brahma-Astra',
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
        'It devastates the line it is aimed at, and it does not care whose men stand in it. Where it falls no rain will come for twelve years. Loosing it is an act of adharma: a curse follows you for it. Only another Brahma-Astra can answer it.',
    },
    effects: [
      // AIMED AT A LINE, AND IT DOES NOT CARE WHOSE LINE IT IS. This measured
      // 66.6% win / 44.9% played, by far the strongest card in the game, for
      // one reason: it was the only great weapon that did not hurt you. Six
      // damage to the enemy row and a scratch to your own adjacent ranks is
      // not a decision, it is free value, so it was the only ultimate anyone
      // ever fired.
      //
      // A divyastra devastates a formation. The chariots burn, whoever's
      // chariots they are. Now the question is which line you can afford to
      // lose men in, which is a real choice and a canonical one: the whole
      // horror of these weapons is that they do not discriminate.
      { on: 'onPlay', target: { pick: 'lineBothSidesSameAsPlayed' }, actions: [{ kind: 'damage', amount: 6 }] },
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [
          {
            // No rain for twelve years, on both sides of the line.
            kind: 'debuffRow',
            amount: -3,
            rows: [
              { side: 'enemy', sameAsPlayed: true },
              { side: 'own', sameAsPlayed: true },
            ],
            duration: 'lingering',
          },
        ],
      },
      // The weapon wins you the line. The adharma of loosing it stays with you.
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'afflict', side: 'own', pool: ADHARMA }] },
    ],
    flavor: 'Brahma’s weapon; where it strikes, no rain falls for twelve years.',
  },
  {
    id: 'brahmashirsha',
    name: 'Brahmashirsha-Astra',
    house: 'neutral',
    type: 'astra',
    astraTier: 3,
    basePower: 0,
    // 16, not 9. A world-ender was the CHEAPEST great weapon in the game, less
    // than the tier-2 Brahma-Astra at 11.
    provision: 16,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    counteredBy: ['brahmashirsha', 'brahmastra'],
    cost: {
      consequence:
        'The four-headed weapon takes the enemy host entire. Only the deathless walk out of it. The land it touched is poisoned: your own lines wither for the rest of the battle, and the one who loosed it is cursed for the act.',
    },
    effects: [
      // WAS: destroy allUnits, both hosts. It measured a 17.2% win rate, the
      // worst card in the game, and the reason is structural rather than a
      // tuning error: a SYMMETRIC board wipe destroys cards that were already
      // played, so it changes nobody's hand size. You simply spent a card and
      // the enemy did not. It cost a card to reset to nothing.
      //
      // Now it takes the enemy host and bills you afterwards instead: the
      // aftermath is the price, not instant friendly fire. That is closer to
      // the epic anyway - twelve years of barren land, not your own men
      // dropping dead beside you.
      { on: 'onPlay', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'destroy' }] },
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [
          {
            // The land is poisoned. Your OWN lines, for the rest of the battle.
            kind: 'debuffRow',
            amount: -3,
            rows: [
              { side: 'own', row: 'ratha' },
              { side: 'own', row: 'gaja' },
              { side: 'own', row: 'padati' },
            ],
            duration: 'lingering',
          },
        ],
      },
    ],
    flavor: 'The four-headed weapon. Brahma warned Drona never to loose it.',
  },
  {
    id: 'pashupatastra',
    name: 'Pashupat-Astra',
    house: 'neutral',
    type: 'astra',
    astraTier: 3,
    basePower: 0,
    provision: 18,
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
    name: 'Narayan-Astra',
    house: 'neutral',
    type: 'astra',
    astraTier: 3,
    basePower: 0,
    provision: 15,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence:
        'It rains death on every foe. In legend only surrender survives it, and the one who looses it is cursed for the act.',
    },
    effects: [{ on: 'onPlay', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'damage', amount: 5 }] }],
    flavor: 'Vishnu’s storm of weapons, fiercer the harder you fight it.',
  },
  {
    id: 'vaishnavastra',
    name: 'Vaishnav-Astra',
    house: 'neutral',
    type: 'astra',
    astraTier: 3,
    basePower: 0,
    provision: 14,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence:
        'Never misses its chosen mark, save the shield of Krishna. Loosing it is an act of adharma: a curse follows you for it.',
    },
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
    provision: 14,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence:
        'Indra’s unerring dart. Loosed only once, then gone forever, and a curse follows you for the act. Karna spent it on Ghatotkacha and had nothing left for Arjuna.',
    },
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
    name: 'Aindra-Astra',
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
    name: 'Agney-Astra',
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
    name: 'Varun-Astra',
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
    name: 'Vayavya-Astra',
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
    name: 'Nag-Astra',
    house: 'neutral',
    type: 'astra',
    // BINDS, does not kill, and is tier 2 rather than 1.
    //
    // There is no "nagastra" in the Mahabharata. Karna's famous serpent-arrow
    // is the snake Aswasena hiding inside an ordinary shaft, and Shalya tells
    // him to pick a different arrow. The weapon the epic calls Naga BINDS THE
    // LEGS (Karna P. 53) - snakes encircle the lower limbs. And the arrow that
    // was meant for Arjuna's head took his crown instead, because Krishna
    // pressed the chariot into the earth. He survived, diminished.
    //
    // So: reduce to 1. That is the crown, not the head. Hard removal at tier 1
    // left the ultimates nothing to escalate to.
    astraTier: 2,
    basePower: 0,
    provision: 9,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    counteredBy: ['sauparna'],
    cost: { consequence: 'The serpents take him by the legs. Sauparna is their bane, and Krishna his shield.' },
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'highestEnemyUnit' },
        condition: { q: 'not', c: { q: 'targetHasBoon', boon: 'krishna_charioteer' } },
        actions: [{ kind: 'reduceTo', value: 1 }],
      },
    ],
    flavor: 'It was loosed at his head, and Krishna gave it his crown instead.',
  },
  {
    id: 'sauparna',
    name: 'Sauparn-Astra',
    house: 'neutral',
    type: 'astra',
    astraTier: 1,
    basePower: 0,
    provision: 5,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'The eagle devours serpents. Hold it to answer a Nagastra.' },
    effects: [{ on: 'onPlay', target: { pick: 'highestEnemyUnit' }, actions: [{ kind: 'damage', amount: 5 }] }],
    flavor: 'Birds descend and devour the serpents. The bane of the Naga weapon.',
  },

  // ---- Parashurama's line + disablers ----
  {
    id: 'bhargavastra',
    name: 'Bhargav-Astra',
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
    name: 'Sammohan-Astra',
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
    type: 'stratagem',
    basePower: 0,
    provision: 4,
    rows: ['ratha'],
    keywords: [],
    cost: { consequence: 'A half-truth: the elephant, not the man.' },
    effects: [{ on: 'onPlay', target: { pick: 'none' }, actions: [] }],
    flavor: 'Naro va kunjaro va, the man, or the elephant.',
  },
];
