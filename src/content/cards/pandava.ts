import type { Card } from '@engine/types';

// The Pandava host and its allies at Kurukshetra. Base powers map to the canon
// rathi/atirathi/maharathi ranking. Tags drive bond/synergy.
export const PANDAVA_CARDS: Card[] = [
  // ---- The five Pandavas ----
  {
    id: 'arjuna',
    name: 'Arjuna',
    house: 'pandava',
    type: 'unit',
    tier: 'maharathi',
    basePower: 10,
    rows: ['ratha'],
    keywords: [],
    ability: {
      name: 'Arrow Rain',
      text: 'Darkens the sky over the enemy host (-2 to every foe). Once per battle.',
      charges: 1,
      target: { pick: 'allEnemyUnits' },
      actions: [{ kind: 'damage', amount: 2 }],
    },
    effects: [],
    tags: ['pandava-brother'],
    astraMastery: 2,
    knownAstras: ['pashupatastra', 'brahmashirsha'],
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
    tags: ['pandava-brother'],
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
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [],
    tags: ['pandava-brother'],
    // ANANTAVIJAYA, "endless victory". He already had this effect and it was
    // anonymous; the conch is named in the Gita's opening roll-call and the
    // text states what the blare does: it "rent the hearts of the
    // Dhartarashtras" (Bhishma P. XXV). A king rallying his foot is exactly
    // what that passage describes him doing.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [{ kind: 'debuffRow', amount: 2, rows: [{ side: 'own', row: 'padati' }], duration: 'round' }],
      },
    ],
    flavor: 'The king of righteousness. He blew Anantavijaya, endless victory, and the foot-soldiers stood straighter.',
  },
  {
    id: 'nakula',
    name: 'Nakula',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha', 'padati'],
    keywords: [{ kind: 'bond', tag: 'twin', amount: 2 }],
    tags: ['pandava-brother', 'twin'],
    // SUGHOSA, "sweet-sounding", named in the Gita roll-call beside his twin's
    // Manipushpaka (Bhishma P. XXV). He was a blank 6: a bond keyword and a
    // number. The conches are the highest-value fix in the whole bottom tier
    // because they are named, textual, and different for every brother, so the
    // cards stop being interchangeable without inventing anything.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [{ kind: 'debuffRow', amount: 2, rows: [{ side: 'own', row: 'ratha' }], duration: 'round' }],
      },
    ],
    flavor: 'Twin of the Ashvins, matchless with the sword. His conch Sughosa answers his brother’s across the line.',
  },
  {
    id: 'sahadeva',
    name: 'Sahadeva',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha', 'padati'],
    keywords: [{ kind: 'bond', tag: 'twin', amount: 2 }],
    tags: ['pandava-brother', 'twin'],
    // Sworn to kill Shakuni: cuts down the dice-master on sight.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'unitByCard', side: 'enemy', card: 'shakuni' },
        actions: [{ kind: 'destroy' }],
      },
      // MANIPUSHPAKA, "jewel-blossom", the answering half of Sughosa. Deliberately
      // the enemy side of the ledger where Nakula's is the friendly one, so the
      // twins read as a pair without being the same card twice.
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [{ kind: 'debuffRow', amount: -1, rows: [{ side: 'enemy', row: 'ratha' }], duration: 'round' }],
      },
    ],
    flavor: 'The wisest of the five, who knew what was to come. His conch Manipushpaka sounds where his brother’s answers.',
  },

  // ---- Krishna (does not fight) ----
  {
    // KRISHNA IS NOT A NUMBER, and that was the whole problem. He was a +3
    // attachment for 10 provisions and measured 36.5%, the worst card in the
    // game, because no power value is right for Vishnu incarnate: anything fair
    // is an insult and anything true decides the battle on sight.
    //
    // So he adds almost nothing and changes the rules instead, which is what he
    // actually does in the epic. He never lifts a weapon. He drives, and he
    // knows things, and at the crisis he tells someone how to win.
    //
    // He answers THREE weapons, all sourced, none invented:
    //   Naga      - he pressed the chariot into the ground, so it took the crown
    //               instead of the head (see nagastra's condition)
    //   Vaishnava - Vishnu's own weapon will not harm Vishnu; he took it on his
    //               chest and it became a garland (see vaishnavastra)
    //   Narayana  - "lay down your weapons, all of you, and alight from your
    //               vehicles" (Drona CC). Everyone else buys that escape by
    //               passing and losing the round. With him it is free, because
    //               he is the one who knew the terms. See rounds.ts tickHazards.
    id: 'krishna_charioteer',
    name: 'Krishna, the Charioteer',
    house: 'pandava',
    type: 'boon',
    basePower: 0,
    provision: 12,
    rows: ['ratha'],
    keywords: [],
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'own', rows: ['ratha'] } },
        actions: [{ kind: 'buff', amount: 1 }, { kind: 'addFlag', flag: 'krishna-guarded' }],
      },
      // THE EMPLOYMENT OF MEANS, and it happens the moment he arrives, not as a
      // separate move. This was a once-per-battle ability gated to the deciding
      // round, and it fired ZERO times in 300 simulated matches, for a reason
      // that had nothing to do with the design: clearBoard destroys every unit
      // at the end of each round and removeInstance takes attached boons with
      // it, so Krishna never survives the round he is played in. The ability
      // therefore needed a two-turn combo (commit him, live, then act) that a
      // one-ply search will never plan and a human should not have to pay for.
      //
      // As an onPlay it is one card and one turn, and it is a real decision:
      // commit him early for the shield and the three answers, or hold him for
      // the deciding round and take the greatest man on the other side with him.
      // Drona put down his bow, the thigh broke, the head came off. None of them
      // died to a better weapon.
      //
      // AND HE WILL NOT DO IT WHILE JARASANDHA STANDS. Krishna fled that man
      // seventeen times and never once beat him in the field; the name Ranchhod,
      // "he who left the battlefield", is from exactly this. He finally had the
      // king killed by sending Bhima to wrestle him and hinting at how to tear
      // the two halves apart, rather than face him. So Jarasandha is the one
      // hard answer to Krishna in the game, and it is sourced rather than
      // invented. The shield and the three astra answers still hold: Krishna
      // still drives. He just will not make a move against that host.
      {
        on: 'onPlay',
        condition: {
          q: 'and',
          cs: [
            { q: 'isFinalRound' },
            { q: 'not', c: { q: 'cardOnBoard', card: 'jarasandha', side: 'enemy' } },
          ],
        },
        target: { pick: 'highestEnemyUnit' },
        actions: [{ kind: 'addFlag', flag: 'stripped' }, { kind: 'destroy' }],
      },
    ],
    flavor:
      'He would not fight. He drove, and he counselled, and every man he undid was undone by something other than a weapon.',
  },

  // ---- Divine-born and next-generation sons ----
  {
    id: 'abhimanyu',
    name: 'Abhimanyu',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    astraMastery: 2,
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
    // nightGrowth was 3, which took him to 13 by the deciding round: past
    // Arjuna, Bhishma and Karna, all of whom are flat 10s. He measured 56.4%,
    // the fourth best card in the game, off a printed 7 that told the player
    // none of that. Now +1, so 7/8/9, and his weight moved into `drawsAstra`
    // where it belongs. He is not supposed to out-muscle Arjuna. He is
    // supposed to be the reason Arjuna is still alive.
    keywords: [{ kind: 'nightGrowth', amount: 1 }, { kind: 'drawsAstra' }],
    tags: ['rakshasa'],
    effects: [],
    flavor:
      'Indra made him to be Karna’s match, because of the dart. When he fell, Krishna danced on the terrace of his chariot: the weapon meant for Arjuna had been spent on somebody else.',
  },
  {
    id: 'iravan',
    name: 'Iravan',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    tags: ['naga'],
    effects: [],
    flavor: 'Ulupi’s serpent-son, who fought the sky itself before he fell.',
  },
  {
    id: 'anjanaparvan',
    name: 'Anjanaparvan',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['gaja'],
    keywords: [{ kind: 'nightGrowth', amount: 2 }, { kind: 'bond', tag: 'rakshasa', amount: 2 }],
    tags: ['rakshasa'],
    effects: [],
    flavor: 'Ghatotkacha’s son, and Ashwatthama’s kill.',
  },

  // The five Upapandavas (sons of Draupadi), a bonded line
  {
    id: 'prativindhya',
    name: 'Prativindhya',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'upapandava', amount: 1 }],
    tags: ['upapandava'],
    effects: [],
    flavor: 'Eldest of the five princes, son of Yudhishthira.',
  },
  {
    id: 'sutasoma',
    name: 'Sutasoma',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'upapandava', amount: 1 }],
    tags: ['upapandava'],
    effects: [],
    flavor: 'Son of Bhima, of the fire-born queen’s line.',
  },
  {
    id: 'shrutakarma',
    name: 'Shrutakarma',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'upapandava', amount: 1 }],
    tags: ['upapandava'],
    effects: [],
    flavor: 'Son of Arjuna, cut down asleep.',
  },
  {
    id: 'shatanika',
    name: 'Shatanika',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'upapandava', amount: 1 }],
    tags: ['upapandava'],
    effects: [],
    flavor: 'Son of Nakula, of the unbroken line.',
  },
  {
    id: 'shrutasena',
    name: 'Shrutasena',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'upapandava', amount: 1 }],
    tags: ['upapandava'],
    effects: [],
    flavor: 'Youngest son of Sahadeva.',
  },

  // ---- Panchala (Draupadi's house) ----
  {
    id: 'dhrishtadyumna',
    name: 'Dhrishtadyumna',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    tags: ['panchala'],
    astraMastery: 2,
    // Born to slay Drona: strikes him down once he has laid down his bow
    // (Drona's immunity holds until the "Ashwatthama is dead" deception disarms him).
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'unitByCard', side: 'enemy', card: 'drona' },
        actions: [{ kind: 'destroy' }],
      },
    ],
    flavor: 'Born of fire to be the slayer of Drona.',
  },
  {
    id: 'shikhandi',
    name: 'Shikhandi',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [],
    tags: ['panchala'],
    effects: [],
    flavor: 'Amba reborn, before whom Bhishma would not raise his bow.',
  },
  {
    id: 'drupada',
    name: 'Drupada',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'panchala', amount: 1 }],
    tags: ['panchala'],
    effects: [],
    flavor: 'The king whose broken friendship lit the whole war.',
  },
  {
    id: 'yudhamanyu',
    name: 'Yudhamanyu',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'wheel-guard', amount: 2 }],
    tags: ['panchala', 'wheel-guard'],
    effects: [],
    flavor: 'One of the two who guarded Arjuna’s wheels to the last.',
  },
  {
    id: 'uttamaujas',
    name: 'Uttamaujas',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'wheel-guard', amount: 2 }],
    tags: ['panchala', 'wheel-guard'],
    effects: [],
    flavor: 'The other guardian of Arjuna’s chariot-wheels.',
  },

  // ---- Matsya (Virata's house) ----
  {
    id: 'virata',
    name: 'Virata',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'matsya', amount: 1 }],
    tags: ['matsya'],
    effects: [],
    flavor: 'The king who hid the Pandavas, then died for them.',
  },
  {
    id: 'sweta',
    name: 'Sweta',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    tags: ['matsya'],
    effects: [{ on: 'onPlay', target: { pick: 'highestEnemyUnit' }, actions: [{ kind: 'damage', amount: 3 }] }],
    flavor: 'Virata’s eldest, who raged through the van and fell on the first day.',
  },
  {
    id: 'sankha',
    name: 'Sankha',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'matsya', amount: 1 }],
    tags: ['matsya'],
    effects: [],
    flavor: 'Second of Virata’s fallen sons.',
  },
  {
    id: 'uttara',
    name: 'Uttara',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 4,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'matsya', amount: 1 }],
    tags: ['matsya'],
    effects: [],
    flavor: 'The boy prince who found his courage behind Brihannala.',
  },

  // ---- Yadava, Chedi, Kekaya, and allied kings ----
  {
    id: 'satyaki',
    name: 'Satyaki',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['ratha'],
    keywords: [],
    tags: ['vrishni'],
    astraMastery: 2,
    effects: [],
    flavor: 'Arjuna’s disciple, the one Vrishni who chose the right side.',
  },
  {
    id: 'chekitana',
    name: 'Chekitana',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [],
    tags: ['vrishni'],
    effects: [],
    flavor: 'A Vrishni lord, commander of a Pandava division.',
  },
  {
    id: 'dhrishtaketu',
    name: 'Dhrishtaketu',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [],
    tags: ['chedi'],
    effects: [],
    flavor: 'Shishupala’s son, who fought beside his father’s killer.',
  },
  {
    id: 'kekaya_brothers',
    name: 'The Kekaya Brothers',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    tags: ['kekaya'],
    effects: [],
    flavor: 'Five brothers of Kekaya, kin against kin.',
  },
  {
    id: 'kuntibhoja',
    name: 'Kuntibhoja',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    effects: [],
    flavor: 'The house that raised Kunti, come to fight for her sons.',
  },
  {
    id: 'yuyutsu',
    name: 'Yuyutsu',
    house: 'pandava',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'deathless' }],
    effects: [],
    flavor: 'The brother who changed sides before the conch, and lived.',
  },

  // ---- Levy ----
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
];
