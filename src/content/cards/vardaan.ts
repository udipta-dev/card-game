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
    // VISHNU, NOT KRISHNA, and that distinction is the reason this is a card at
    // all rather than a fourth line on the charioteer.
    //
    // What Arjuna is shown at Kurukshetra is the universal form: Krishna is the
    // mouth it speaks through, not the thing itself. Putting it on the Krishna
    // card made him a five-job card nobody could read; giving it its own card
    // lets the biggest moment in the Gita be a moment.
    //
    // It does not kill. Arjuna does not watch anyone die, he watches everything
    // that is going to die ALREADY dead inside the form, and he puts his palms
    // together and asks it to stop. So the card takes something off every man
    // on the other side and takes nothing off the field.
    id: 'vishwaroop',
    name: 'Vishwaroop',
    house: 'neutral',
    type: 'boon',
    basePower: 0,
    // 14: above every other vardaan, below the Brahmashirsha at 16. It answers
    // a whole host rather than one man, which nothing else at this price does.
    provision: 14,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence:
        'The universal form, shown once. Every warrior facing it is diminished by the sight, and no weapon is raised: nothing here strikes, and nothing here dies. Then it is gone, for the rest of the run.',
    },
    effects: [
      { on: 'onPlay', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'buff', amount: -1 }] },
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'banFromRun', card: 'vishwaroop' }] },
    ],
    flavor:
      'Arjuna asked to see him as he was. He saw every man on both sides already dead in that mouth, and begged him to put the shape away.',
  },
  {
    // WAS Gandhari's Gaze, which is not in the Mahabharata. Zero hits across all
    // four Ganguli volumes for the episode where Duryodhana comes to his mother
    // naked and she hardens his body with a look. What IS there: she blindfolds
    // herself at her MARRIAGE out of devotion, and her one gaze-power scene
    // turns Yudhishthira's toe. The vajra-torso claim is spoken by the Danavas
    // talking Duryodhana out of suicide, not by the narrator.
    //
    // Replaced with the best-sourced invulnerability boon in the epic, and the
    // best mechanic in it: Brahma REFUSES Sunda and Upasunda immortality and
    // makes them name their own death clause, so they choose to fear nothing
    // "except only from each other" (Adi CCXI-CCXIV). Tilottama exists purely
    // to trigger it. The loophole IS the card.
    id: 'brahmas_bargain',
    name: 'Brahma’s Bargain',
    house: 'neutral',
    type: 'boon',
    basePower: 0,
    provision: 12,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence:
        'Brahma will not grant immortality. He makes you name your own death: this warrior fears nothing in the three worlds, save what stands beside him in his own host.',
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
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'banFromRun', card: 'brahmas_bargain' }] },
    ],
    flavor: 'They asked to fear nothing that lives. Brahma made them add: except each other.',
  },
  {
    id: 'kunti_invocation',
    name: 'Kunti’s Invocation',
    house: 'neutral',
    type: 'boon',
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
    cost: {
      consequence:
        'Armour born of the sun. Blows turn aside from the warrior it clothes, and no weapon reaches him until it is cut through.',
    },
    // ARMOUR, NOT +5 POWER, because that is what a kavacha is. It turns blows
    // aside; it does not make the man bigger.
    //
    // This also closes a loop that was left open. Karna's card used to carry
    // armour 4, the largest in the game, and an ablation found it was the
    // single biggest thing holding his whole house above everyone else
    // (Kaurava 58.3% -> 53.8% when stripped). It is also not his to have at
    // Kurukshetra: he GAVE the Kavacha-Kundala away, to Indra begging in a
    // brahmana's disguise, in exchange for the Vasavi Shakti, and fights the
    // entire war without it.
    //
    // So he starts the war without it, and this is how you give it back to
    // him. Or to anyone else: it is a boon in every house's muster pool, it
    // rides whichever warrior you put it on, and it is spent for the run once
    // used. The gift he threw away is a thing you can win.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'chosen', filter: { side: 'own' } },
        actions: [{ kind: 'armour', amount: 4 }],
      },
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'banFromRun', card: 'surya_kavacha' }] },
    ],
    flavor: 'The gift Karna was born wearing, and gave away to a beggar who was Indra.',
  },
  {
    id: 'ashwins_draught',
    name: 'The Ashwins’ Draught',
    house: 'neutral',
    type: 'boon',
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
    type: 'boon',
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
    type: 'boon',
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
