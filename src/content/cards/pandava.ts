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
    // THE MEN HE ACTUALLY KILLED, which is a much longer list than one.
    //
    // This was "destroy a chosen enemy who has the diamond body", and only one
    // card in the game has that flag, so the effect fired in 2% of the games he
    // was played in. His entire card was a vow that never came due.
    //
    // Bhima is the executioner of the epic. He kills Hidimba in the forest by
    // Varanavata, Baka at Ekachakra, Kirmira in Kamyaka, Jatasura after the
    // brahmana disguise, Jarasandha by tearing him in two, Dushasana at the
    // promise about the blood, and Duryodhana with the thigh. Seven named men,
    // and every one of them is a card in this game.
    //
    // The diamond-body strip stays because Duryodhana is armoured and would
    // otherwise be the one man on the list the vow could not touch. It is
    // harmless against the other six.
    effects: [
      {
        on: 'onPlay',
        // ONE OF THEM, CHOSEN, not all of them at once.
        //
        // This took EVERY one of the seven who happened to be standing, so two
        // 9-power men could die to a single card with nobody making a decision
        // anywhere. Now the game offers whichever of the seven are reachable
        // and you pick which promise to collect, which is a read of the board
        // rather than a windfall.
        //
        // It stays a TRAIT rather than one of his three valours, because
        // Duryodhana's card says "Answered by: Bhima, and by no one else", and
        // an answer you might choose not to give is not an answer.
        target: {
          pick: 'chosen',
          filter: {
            side: 'enemy',
            cards: [
              'duryodhana',
              'dushasana',
              'hidimba',
              'bakasura',
              'kirmira',
              'jatasura',
              'jarasandha',
            ],
          },
        },
        actions: [{ kind: 'removeFlag', flag: 'diamond-body' }, { kind: 'destroy' }],
      },
    ],
    flavor:
      'His vows, and he kept every one of them: the thigh of Duryodhana, the blood of Dushasana, and before the war, the man-eaters of the forest.',
  },
  {
    id: 'yudhishthira',
    name: 'Yudhishthira',
    house: 'pandava',
    type: 'unit',
    tier: 'atirathi',
    // 6, not 7. He pays a point of his own for what he now gives everyone else.
    basePower: 6,
    rows: ['ratha'],
    keywords: [],
    tags: ['pandava-brother'],
    // THE KING LIFTS THE WHOLE ARMY, not one rank of foot.
    //
    // He was the weakest card in his own house and it was backwards: the eldest
    // Pandava, the man the entire war is nominally about, did strictly less
    // than either twin and cost more. Nakula rallies AND steadied a line;
    // Sahadeva rallies, kills Shakuni outright AND withers the enemy. Both at 8
    // provisions against Yudhishthira's 9.
    //
    // A row modifier is also flat in this engine: +2 to a rank is +2 whether
    // one man stands there or five. So his old effect was worth exactly 2, ever.
    // A per-man +1 across the whole host is worth what your army is worth,
    // which is the right shape for a king and gives the same "hold him until
    // the field is full" decision the rallies have.
    //
    // ANANTAVIJAYA, "endless victory". The conch is named in the Gita's opening
    // roll-call and the text says the blare "rent the hearts of the
    // Dhartarashtras" (Bhishma P. XXV). That is the whole army hearing it, not
    // the infantry.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'allOwnUnits' },
        actions: [{ kind: 'buff', amount: 1 }],
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
    // HE DOES NOT KILL ANYONE. That is the whole change, and it is the most
    // canonical thing about him: Krishna never lifts a weapon in that war. He
    // took a vow not to fight and kept it. He drives, he counsels, and every
    // man he undoes is undone by something other than his hand.
    //
    // The card used to carry FIVE jobs: a shield, a +1, an astra answer, a
    // final-round execution, and the Jarasandha exception to that execution. A
    // card doing five things cannot be read at a glance or balanced at all, and
    // the execution was the least defensible of them: it never fired when you
    // expected it (final round only, and not while Jarasandha stood), so the
    // card promised a kill and delivered +1. That is exactly how it played.
    //
    // Two jobs now. He guards, and he lifts the whole host. The Vishwaroop is
    // its own card, because showing the universal form is its own moment and
    // deserves to be, and because it is Vishnu doing it rather than the
    // charioteer.
    effects: [
      // THE SHIELD. One warrior he stands beside cannot be taken by a weapon:
      // this is the Vaishnava on his own chest, and it covers "protect Arjuna"
      // and "stop the Vaishnava" as one rule rather than two.
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'own', rows: ['ratha'] } },
        actions: [{ kind: 'addFlag', flag: 'krishna-guarded' }],
      },
      // AND THE WHOLE HOST STANDS BETTER FOR HIM BEING THERE. He is the reason
      // other people's power works, so his effect is other people's power.
      //
      // A third effect was tried and dropped: stripping the greatest man
      // opposite of his protections, which is very close to what Krishna
      // actually does in the epic (Shikhandi, the lie, the wheel). It measured
      // ZERO change over 2400 games, because stripping is setup and the AI does
      // not follow through, and it put a third role back on the card the whole
      // rework existed to simplify. Worth revisiting if it ever gets a
      // follow-through, not worth carrying as decoration.
      {
        on: 'onPlay',
        target: { pick: 'allOwnUnits' },
        actions: [{ kind: 'buff', amount: 1 }],
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
    // A FLOOR, by the rule the bottom-tier pass established: a purely
    // situational card is worse than a blank one, because it costs a commitment
    // in every game where its condition never arrives. Shikhandi answers exactly
    // one warrior and did nothing at all otherwise, and he measured -7.8pp
    // against Asura, who field no Bhishma and never will.
    //
    // The floor is his own story rather than a number: Bhishma would not raise
    // his bow to Amba reborn, and neither would most men, so the first blow
    // aimed at him does not land. His purpose is untouched - Bhishma's
    // icchamrityu still lifts the moment Shikhandi takes the field, which needs
    // no effect on this card at all.
    keywords: [{ kind: 'armor', amount: 2 }],
    tags: ['panchala'],
    effects: [],
    flavor: 'Amba reborn, before whom Bhishma would not raise his bow, and few others cared to.',
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
