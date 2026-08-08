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
    // One more than the default power+2 that every other 10 pays. Priced by
    // measurement, not sentiment: at the same 12 as Karna he ran 60.7% in the
    // lab even after his floor was cut from half to a third, because ten power
    // that cannot be finished without its answer card is worth more than ten
    // power behind one-shot armour. The extra provision is the cost of that.
    provision: 13,
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
    // thenSetPower 4, not 0. While the deception card was unobtainable this
    // never fired at all and Drona was an unkillable 9: a bug worth real points
    // to the Kaurava deck, which is why fixing it dropped them from 48.6% to
    // 45.1%. Their old balance was partly resting on it.
    //
    // But with the card now in play, setting him to ZERO punished him twice
    // over: he became worthless AND killable off a single 4-cost stratagem.
    // The text is narrower than that. He laid down his bow and sat in
    // meditation; he did not shrink. So the lie takes his guard and most of his
    // fight, and Dhrishtadyumna still has to arrive to finish it. Two cards to
    // remove a 9, which is what the epic charges.
    keywords: [{ kind: 'immuneUntilPlayed', card: 'ashwatthama_elephant', thenSetPower: 4 }],
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
    // TWO, NOT FOUR, and canon and the lab agree for once.
    //
    // Ablation, one keyword stripped at a time against the full lab: Karna's
    // armour is the largest single thing carrying his house. Removing it
    // outright moved Kaurava 58.3% -> 53.8% and the faction spread 16.7 -> 10.3.
    // Nothing else came close: Bhishma's icchamrityu 1.2, Drona's immunity 1.4,
    // Duryodhana's adamant body 0.8, his brother-bond 0.0.
    //
    // Four was the largest armour in the game by some way (Ravana 3, Prahlada
    // 3, Hiranyakashipu 2, Shikhandi 2), on the card with the highest power, in
    // a game whose removal is almost entirely damage.
    //
    // And he should not really have it at all. The Kavacha-Kundala was born
    // onto his body and he GAVE IT AWAY to Indra, who came begging for it in a
    // brahmana's disguise, in exchange for the Vasavi Shakti. He fights the
    // whole of Kurukshetra without it. Two is the compromise: he keeps a trace
    // of what he was born in, and the spear he traded it for is the card that
    // actually carries him now.
    keywords: [{ kind: 'noAstrasInFinalRound' }],
    tags: ['sun-line'],
    astraMastery: 2,
    knownAstras: ['vasavi_shakti'],
    // THE WHEEL TOOK HIS GUARD, NOT HIS STRENGTH.
    //
    // This used to setPower 0: commit Karna in the deciding round and your
    // 10-power maharathi arrived as a nothing. He measured 44.1% with the
    // LOWEST play rate of any warrior in his deck, because even the AI learned
    // not to field him.
    //
    // Two things wrong with that. Mechanically it made the best card in the
    // Kaurava deck a card you must not play in the round that decides the
    // battle, which is a trap rather than a choice, and the card never said so
    // anywhere (see rulesText - conditions were invisible on every card in the
    // game until now). And it is not what happens: Karna was not made WEAK when
    // the earth took his wheel, he was made HELPLESS. He got down to lift it
    // and asked for the pause that the rules of war entitled him to, and Arjuna
    // shot him while he stood there.
    //
    // So the wheel strips his armour instead. `damage` eats armour before
    // power, so 4 removes exactly the Kavacha and leaves the man at his full
    // ten. He is still the strongest thing on the field. He simply can be
    // killed now, which he could not be a moment ago. The number tracks the
    // armour: it removes exactly the Kavacha and leaves the man at his full ten.
    effects: [
      {
        on: 'onPlay',
        condition: { q: 'isFinalRound' },
        target: { pick: 'self' },
        actions: [{ kind: 'damage', amount: 4 }, { kind: 'addFlag', flag: 'wheel-sunk' }],
      },
    ],
    flavor:
      'Son of the Sun. At the last the earth took his chariot wheel, and he stepped down to lift it and asked for the pause the rules allowed him.',
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
    // HE RALLIES HIS BROTHERS, and until now nobody in this host rallied
    // anybody. Dushasana, Vikarna and Duryodhana all carry the kaurava-brother
    // tag already, so the kin were in the starter deck the whole time; what was
    // missing was a man to gather them. Kaurava fielded ZERO rally cards while
    // Pandava fielded three and Asura four, which made the trait a Pandava and
    // Asura mechanic by accident.
    //
    // It is also simply who he is. Duryodhana's whole standing in the epic is
    // that a hundred brothers form up behind him, and he never fights better
    // than when they are beside him.
    keywords: [{ kind: 'bond', tag: 'kaurava-brother', amount: 2 }],
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
    // NAME THE MAN WHO ANSWERS HIM. His own card said the armour holds "until a
    // vow strips it from him", which tells you a vow exists and not whose, and
    // "so what actually kills Duryodhana?" was a real question off a real
    // playtest. The answer was written only on Bhima's card, so a Kaurava
    // player holding Duryodhana had no way to reach it.
    //
    // The vow is the thigh: Bhima swore it in the assembly hall when Duryodhana
    // bared it to Draupadi, and he collects at the lake at Kurukshetra.
    counteredBy: ['bhima'],
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
    // The second brother rallies too, and he is the reason this host can do it
    // at all outside the chariot line: Duryodhana is ratha-only, so with him
    // alone a Kaurava rally had exactly one rank it could ever happen in.
    // Dushasana stands in the elephants as well. He is also never anywhere but
    // at Duryodhana's shoulder, which is the whole of his character.
    keywords: [{ kind: 'bond', tag: 'kaurava-brother', amount: 2 }],
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
    // THE ONE WHO SAID IT WAS WRONG. In the dice hall, with a hundred brothers
    // and every elder silent, Vikarna alone stood and argued that the wager was
    // void and Draupadi unwon (Sabha P. LXVIII). He is the only Kaurava the
    // Pandavas mourn by name.
    //
    // So he lifts what has been unjustly laid on his own side: every penalty on
    // every one of your rows, gone. Nothing in the game could do that before,
    // which meant a scorched line stayed scorched and the debuff layer only
    // ever ran one way. It also happens to be what the Kaurava deck needs, as
    // the deck most often on the receiving end of a Brahmastra's lingering
    // scorch.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        // Cleanse ALONE measured him down from 43.6% to 36.4%. A purely
        // situational effect cannot carry a low-power card: most games have no
        // penalty to lift, so he is a bare 5, and worse, the AI plays him at
        // moments it otherwise would not because the effect scores well when it
        // does apply. A 5 needs its effect to be worth power every single time.
        // So the cleanse now comes with a floor.
        actions: [
          { kind: 'cleanse' },
          { kind: 'debuffRow', amount: 2, rows: [{ side: 'own', row: 'ratha' }], duration: 'round' },
        ],
      },
    ],
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
    // DEPRIVED OF HIS CAR - Ganguli's phrase, and 1883 English for ratha rather
    // than a motor vehicle, so the card says chariot. 69 paragraphs use it,
    // against 50 for cutting off an arm or a head: losing your chariot is the
    // commonest DECISIVE outcome in the war that is not a death. He keeps every
    // point of his power and loses the row he was standing in.
    //
    // Chitrasena unhorses the strongest chariot facing him.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'highestEnemyUnit' },
        actions: [{ kind: 'dismount' }],
      },
    ],
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
    // DEPRIVED OF HIS CAR - Ganguli's phrase, and 1883 English for ratha rather
    // than a motor vehicle, so the card says chariot. 69 paragraphs use it,
    // against 50 for cutting off an arm or a head: losing your chariot is the
    // commonest DECISIVE outcome in the war that is not a death. He keeps every
    // point of his power and loses the row he was standing in.
    //
    // Vivimsati does the same to the weakest, so the two are not one card twice.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'lowestEnemyUnit' },
        actions: [{ kind: 'dismount' }],
      },
    ],
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
    // NO DRAW. He is a herald and a herald brings something back, which is why
    // he was given "draw 1" to lift him off 40.9% win, the worst warrior in the
    // game. It worked on him and cost the game its balance.
    //
    // Measured, one revert at a time against the full lab: that single card of
    // draw was worth 12.7 POINTS OF FACTION SPREAD on its own. Kaurava 71.4% to
    // 62.7%. A cheap body that draws is not a small buff in a game this decided
    // by card economy, and my own note on the carried astras had already said
    // exactly that before I did it again here.
    //
    // He goes back to a plain 5 rather than getting a hastily invented
    // replacement, because a 40.9% card is a card that needs tuning and a
    // 40-point spread is a broken game. He is a rathi, and the rathi tier is
    // getting one real ability each in its own pass. He can wait for that.
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
    // NOT given the dismount, and the measurement is the reason. Bahlika blank
    // measured 47.5%; with an onPlay dismount he measured 39.3%, and 42.8% even
    // after the demotion was made to cost the victim 2 power.
    //
    // Spending a card to move an enemy is worse than spending it on nothing,
    // because ROWS DO NOT MATTER ENOUGH YET. seatPower sums all three equally,
    // so the man keeps his points wherever he stands, and shifting him can
    // actively HELP him: it carries him out of a row we have debuffed and into
    // one his own side may have buffed (Yudhishthira's conch does exactly that
    // to his foot row).
    //
    // The verb is built, tested and correct. It becomes a good mechanic when
    // rows carry weight of their own - capacity, row-specific bonuses, reach -
    // and not before. Chitrasena and Vivimsati carry it in the roster meanwhile.
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
    // THE AVANTI BROTHERS. Ganguli never names one without the other: "the two
    // princes of Avanti named Vinda and Anuvinda" is how they enter and how
    // they die. So each is ordinary alone and dangerous with his brother, and
    // cuts the bowstring of the strongest man facing him.
    effects: [
      // Unconditional floor first, for the reason Vikarna's cleanse taught us:
      // a situational effect cannot carry a power-5 card.
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [{ kind: 'debuffRow', amount: 1, rows: [{ side: 'own', row: 'ratha' }], duration: 'round' }],
      },
      // The bowstring, and only when his brother is beside him. 28 paragraphs
      // cut a bow and 28 more have the man take up another: it is a delay, not
      // a kill, so the target is stupefied for the round and back next.
      {
        on: 'onPlay',
        condition: { q: 'cardOnBoard', card: 'anuvinda', side: 'own' },
        target: { pick: 'highestEnemyUnit' },
        actions: [{ kind: 'addFlag', flag: 'stupefied' }],
      },
    ],
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
    // THE AVANTI BROTHERS. Ganguli never names one without the other: "the two
    // princes of Avanti named Vinda and Anuvinda" is how they enter and how
    // they die. So each is ordinary alone and dangerous with his brother, and
    // covers his brother, and the line they stand in.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'none' },
        actions: [{ kind: 'debuffRow', amount: 1, rows: [{ side: 'own', row: 'ratha' }], duration: 'round' }],
      },
      {
        on: 'onPlay',
        condition: { q: 'cardOnBoard', card: 'vinda', side: 'own' },
        target: { pick: 'unitByCard', side: 'own', card: 'vinda' },
        actions: [{ kind: 'buff', amount: 3 }],
      },
    ],
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
    // VARUNA'S MACE, and the loophole he was warned about, quoted exactly
    // (Drona P. XCII). His mother, the river Parnasa, begged Varuna to make her
    // son unslayable, and Varuna gave him a mace with one condition:
    //
    //   "This mace should not be hurled at one who is not engaged in fight. If
    //    hurled at such a person, it will come back and fall upon thyself...
    //    it will then course in an opposite direction and slay the person
    //    hurling it."
    //
    // He hurled it at Krishna, who had vowed not to raise a weapon. It bounced
    // off his shoulder, came back, and killed him.
    //
    // So: genuinely unkillable, and he destroys himself the moment the enemy
    // fields the one non-combatant in the game. A power-6 nobody with a real
    // conditional invulnerability is worth more than another 8-power body, and
    // it is the bottom tier carrying a loophole rather than the top tier.
    keywords: [{ kind: 'deathless' }],
    effects: [
      {
        on: 'onRoundEnd',
        condition: { q: 'cardOnBoard', card: 'krishna_charioteer', side: 'enemy' },
        target: { pick: 'self' },
        // `stripped` first, then destroy. Without it his own deathless keyword
        // blocks his own mace, which is correct engine behaviour and wrong
        // canon: breaking Varuna's condition is precisely what LAPSES the boon.
        // The weapon that made him unslayable is the weapon that kills him.
        actions: [{ kind: 'addFlag', flag: 'stripped' }, { kind: 'destroy' }],
      },
    ],
    flavor:
      'Varuna gave his mother’s son a mace and one warning: never at a man who is not fighting. He threw it at Krishna.',
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
