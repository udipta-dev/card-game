import type { Card } from '@engine/types';

// The Kaurava host and its allies at Kurukshetra. Top-tier maharathis shielded
// by canonical boons and curses, the Bahlika elders, allied kings, and the
// rakshasa night-fighters. Tags drive bond/synergy.
export const KAURAVA_CARDS: Card[] = [
  // ---- The four commanders ----
  {
    id: 'bhishma',
    name: 'Bhishma',
    house: 'kaurava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 10,
    rows: ['ratha'],
    keywords: [{ kind: 'icchamrityu', unlessCardOnBoard: 'shikhandi' }],
    ability: {
      name: 'Arrow Rain',
      text: 'Darkens the sky over the enemy host (-2 to every foe). Once per battle.',
      charges: 1,
      target: { pick: 'allEnemyUnits' },
      actions: [{ kind: 'damage', amount: 2 }],
    },
    effects: [],
    astraMastery: 2,
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
    keywords: [{ kind: 'immuneUntilPlayed', card: 'ashwatthama_elephant', thenSetPower: 0 }],
    effects: [],
    astraMastery: 2,
    knownAstras: ['brahmashirsha'],
    flavor: 'The war-guru, unbeatable until grief unstrung his bow.',
  },
  {
    id: 'karna',
    name: 'Karna',
    house: 'kaurava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 10,
    rows: ['ratha'],
    keywords: [{ kind: 'armor', amount: 4 }, { kind: 'noAstrasInFinalRound' }],
    tags: ['sun-line'],
    astraMastery: 2,
    knownAstras: ['vasavi_shakti'],
    effects: [
      {
        on: 'onPlay',
        condition: { q: 'isFinalRound' },
        target: { pick: 'self' },
        actions: [{ kind: 'setPower', value: 0 }, { kind: 'addFlag', flag: 'wheel-sunk' }],
      },
    ],
    flavor: 'Son of the Sun, undone by two curses at the last.',
  },
  {
    id: 'shalya',
    name: 'Shalya',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    // The poison tongue: fielding Shalya saps your own Karna (his secret sabotage).
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'unitByCard', side: 'own', card: 'karna' },
        actions: [{ kind: 'buff', amount: -3 }],
      },
    ],
    flavor: 'The Madra king who steered Karna’s chariot and his ruin.',
  },

  // ---- The Kuru princes ----
  {
    id: 'duryodhana',
    name: 'Duryodhana',
    house: 'kaurava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 9,
    rows: ['ratha'],
    keywords: [],
    tags: ['kaurava-brother'],
    // The mechanic was right and the story on it was wrong. Gandhari hardening
    // her son's body with one unbandaged look is NOT in Ganguli: searched all
    // four volumes, and her only demonstrated gaze-power is turning the nail
    // of Yudhishthira's toe sore through the folds of the cloth (Stri P. XV).
    //
    // His invulnerability is real and much better sourced than the myth. It is
    // ARMOUR, tied on him by Drona, and Arjuna gives its full chain of custody
    // (Virata P. LXI): Indra to Angiras to Vrihaspati to Indra to Arjuna.
    // "This armour is not capable of being pierced by my weapons. Maghavat
    // himself cannot pierce it with his thunder." Then the contempt that makes
    // the card: "He weareth it only like a woman."
    effects: [{ on: 'onPlay', target: { pick: 'self' }, actions: [{ kind: 'addFlag', flag: 'diamond-body' }] }],
    flavor: 'Cased by Drona in mail that Indra’s own thunder could not pierce. He wore it like a man borrowing a coat.',
  },
  {
    id: 'dushasana',
    name: 'Dushasana',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha', 'gaja'],
    keywords: [],
    tags: ['kaurava-brother'],
    effects: [],
    flavor: 'Whose hands at the dice-hall sealed the war.',
  },
  {
    id: 'vikarna',
    name: 'Vikarna',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [],
    tags: ['kaurava-brother'],
    effects: [],
    flavor: 'The only brother who named the wrong a wrong.',
  },
  {
    id: 'chitrasena',
    name: 'Chitrasena',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'kaurava-brother', amount: 1 }],
    tags: ['kaurava-brother'],
    effects: [],
    flavor: 'One of the hundred, cut down in Bhima’s vow.',
  },
  {
    id: 'vivimsati',
    name: 'Vivimsati',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'kaurava-brother', amount: 1 }],
    tags: ['kaurava-brother'],
    effects: [],
    flavor: 'A steadier hand than most of his hundred brothers.',
  },
  {
    id: 'durmukha',
    name: 'Durmukha',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'kaurava-brother', amount: 1 }],
    tags: ['kaurava-brother'],
    effects: [],
    flavor: 'Fierce of face, as his name is read.',
  },

  // ---- The inner circle (gurus and kin) ----
  {
    id: 'ashwatthama',
    name: 'Ashwatthama',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [{ kind: 'deathless' }],
    astraMastery: 2,
    knownAstras: ['narayanastra', 'brahmashirsha'],
    effects: [],
    flavor: 'Drona’s son, cursed to wander deathless and unhealing.',
  },
  {
    id: 'kripa',
    name: 'Kripa',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'deathless' }],
    astraMastery: 2,
    effects: [],
    flavor: 'The deathless teacher who outlived the war he fought.',
  },
  {
    id: 'kritavarma',
    name: 'Kritavarma',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'nightGrowth', amount: 2 }],
    tags: ['vrishni'],
    effects: [],
    flavor: 'The Yadava who took the army, not the god.',
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
    // THE WAGER, not a debuff. He was a generic -1 to every enemy, which is
    // any cheap sapper with the art swapped. Shakuni did not beat the Pandavas
    // in the field: he got them to play a game they should never have agreed
    // to, and they staked everything on it.
    //
    // So both sides stake, and the dice are LOADED: they lose two, he loses
    // one. A clean symmetrical wager measured 38.8%, worse than the debuff it
    // replaced, because a fair game gives the man who proposed it no edge -
    // and Shakuni's whole character is that he never proposed a fair one.
    // "His dice never rolled true for anyone but him."
    effects: [
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'discard', count: 2, side: 'enemy' }] },
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'discard', count: 1, side: 'own' }] },
    ],
    flavor: 'Weak in battle, without equal in cunning. His dice never rolled true for anyone but him.',
  },
  {
    id: 'uluka',
    name: 'Uluka',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    flavor: 'He carried the message that made peace impossible.',
  },

  // ---- The Bahlika line ----
  {
    id: 'bahlika',
    name: 'Bahlika',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    flavor: 'An elder of Shantanu’s own blood, fighting past his years.',
  },
  {
    id: 'somadatta',
    name: 'Somadatta',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    flavor: 'Heir of Bahlika, marked by an ancient feud.',
  },
  {
    id: 'bhurishravas',
    name: 'Bhurishravas',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    flavor: 'He laid down arms to die in prayer, and was struck down at it.',
  },

  // ---- Allied kings ----
  {
    id: 'jayadratha',
    name: 'Jayadratha',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    // WAS a -2 to the enemy infantry row, which is any sapper in the game with
    // his name on it, and which had nothing to do with the one thing he is
    // remembered for: holding the gate while Abhimanyu died inside it.
    //
    // Shiva's boon, granted in a dream and quoted exactly (Drona P. XLI):
    // "Except Dhananjaya, the son of Pritha, thou shalt in battle check the
    // four other sons of Pandu." He asked to stop all five and was told he
    // could stop four. So he holds four warriors out of the enemy's hand for
    // the round, and their best man walks through the gate regardless.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [{ kind: 'denyPlay', count: 4, sparingStrongest: true }],
      },
    ],
    flavor:
      'He begged Shiva for all five and was granted four. The gate held for a day, and Abhimanyu died behind it.',
  },
  {
    id: 'bhagadatta',
    name: 'Bhagadatta',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    // 9, not 8. Bhishma runs through the whole host assigning every man a rank,
    // Ratha or Atiratha or Maharatha, and when he reaches Bhagadatta he does
    // not assign one: he says the man fights "like Vasava among the celestials,
    // fighting from his Airavata", that he held Arjuna "for days together",
    // and that he is the foremost elephant-fighter alive (Udyoga P. CLXVIII).
    // Being compared to Indra instead of being graded is not a lower rating.
    //
    // And he put Bhima on the floor of his own car in a swoon with a single
    // shaft to the chest, which took Ghatotkacha to undo (Bhishma P. LXIV).
    // Bhima is a 9 here. The man who felled him should not have been an 8.
    basePower: 9,
    rows: ['gaja'],
    keywords: [],
    // Mastery 1, though he carries a tier-3 weapon: he did not train for the
    // Vaishnava, he INHERITED it, Vishnu to Bhumi to Naraka to his son.
    astraMastery: 1,
    knownAstras: ['vaishnavastra'],
    effects: [{ on: 'onPlay', target: { pick: 'highestEnemyUnit' }, actions: [{ kind: 'damage', amount: 2 }] }],
    flavor:
      'The aged lord of Pragjyotisha, astride Supratika. His eyelids sank with age, so he bound them up with a cloth to see, and fought Arjuna to a standstill for days.',
  },
  {
    id: 'vinda',
    name: 'Vinda',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'avanti', amount: 2 }],
    tags: ['avanti'],
    effects: [],
    flavor: 'One half of the Avanti brothers, never seen apart.',
  },
  {
    id: 'anuvinda',
    name: 'Anuvinda',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'avanti', amount: 2 }],
    tags: ['avanti'],
    effects: [],
    flavor: 'The other half of the Avanti brothers.',
  },
  {
    id: 'susharma',
    name: 'Susharma',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    tags: ['samshaptaka'],
    effects: [],
    flavor: 'He swore to kill Arjuna or never leave the field.',
  },
  {
    id: 'sudakshina',
    name: 'Sudakshina',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    flavor: 'The Kamboja king and his tide of northern horse.',
  },
  {
    id: 'srutayudha',
    name: 'Srutayudha',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    flavor: 'His own boon-mace turned back and slew him.',
  },
  {
    id: 'jalasandha',
    name: 'Jalasandha',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['gaja'],
    keywords: [],
    effects: [],
    flavor: 'The Magadha lord who rode into Satyaki’s path.',
  },

  // ---- The rakshasa night-fighters ----
  {
    id: 'alambusha',
    name: 'Alambusha',
    house: 'kaurava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [{ kind: 'nightGrowth', amount: 2 }, { kind: 'bond', tag: 'rakshasa', amount: 1 }],
    tags: ['rakshasa'],
    effects: [],
    flavor: 'The night-demon who killed Arjuna’s serpent-son.',
  },
  {
    id: 'alayudha',
    name: 'Alayudha',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['gaja'],
    keywords: [{ kind: 'nightGrowth', amount: 3 }, { kind: 'bond', tag: 'rakshasa', amount: 1 }],
    tags: ['rakshasa'],
    effects: [],
    flavor: 'He came to avenge his kin, and lost his head to Bhima’s son.',
  },

  // ---- Karna's house ----
  {
    id: 'vrishasena',
    name: 'Vrishasena',
    house: 'kaurava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'sun-line', amount: 2 }],
    tags: ['sun-line'],
    effects: [],
    flavor: 'The Sun-son’s son, cut down before his father’s eyes.',
  },

  // ---- Levy ----
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
