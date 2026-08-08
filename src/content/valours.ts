// What a maharathi does as he takes the field, and which of three you choose.
//
// The top of this game was nearly empty. Eleven maharathis, and eight of them
// had no activated skill at all, including Karna, Drona, Duryodhana and
// Indrajit. The three who did all had the SAME one, Arrow Rain, one per house,
// and those three were the top three win rates in the lab. A tier whose whole
// promise is that these are the champions who fight ten thousand at once was
// mechanically the flattest thing in the set.
//
// THE PRICING RULE, and it is the one thing that decides whether this works.
// Choose-one-of-three is a BUFF unless the menu is weaker than what it
// replaces. Flexibility is power: a Ravana who picks the right answer for the
// board in front of him is stronger than a Ravana who always fires Arrow Rain,
// even though both loose exactly one thing. On top of that, a valour rides
// along with committing the man, where the old ability cost a whole separate
// turn. So every line here is sized well below what a turn-costing ability was
// worth, and Arrow Rain itself is cut from "-2 to every foe" to one rank.
//
// Each man gets one that presses, one that protects, and one that is narrow and
// situational, so the choice is a read of the board rather than a ranking.
import type { Valour } from '@engine/types';

/** Shared shapes, named per man. Same mechanic, different aura, as agreed. */
const strike = (amount: number): Pick<Valour, 'target' | 'actions'> => ({
  target: { pick: 'highestEnemyUnit' },
  actions: [{ kind: 'damage', amount }],
});
const volley = (amount: number): Pick<Valour, 'target' | 'actions'> => ({
  target: { pick: 'enemyRowSameAsPlayed' },
  actions: [{ kind: 'damage', amount }],
});
const rally = (amount: number): Pick<Valour, 'target' | 'actions'> => ({
  target: { pick: 'ownRowSameAsPlayed' },
  actions: [{ kind: 'buff', amount }],
});
/**
 * Every ally, not only the kin.
 *
 * A tag-scoped buff wants a target selector this engine does not have, and
 * inventing one for three cards is worse than shipping the honest version at a
 * lower number. So it is +1 to the whole host, and the text says the whole
 * host, because a card that promises more than it does is the single most
 * common bug in this codebase.
 */
const host = (amount: number): Pick<Valour, 'target' | 'actions'> => ({
  target: { pick: 'allOwnUnits' },
  actions: [{ kind: 'buff', amount }],
});
const steel = (amount: number): Pick<Valour, 'target' | 'actions'> => ({
  target: { pick: 'self' },
  actions: [{ kind: 'armour', amount }],
});

export const VALOURS: Record<string, Valour[]> = {
  // ---- Pandava ----
  arjuna: [
    {
      name: 'Arrow Rain',
      text: 'Darkens the sky over the rank he faces, −2 to each.',
      ...volley(2),
    },
    {
      name: 'Gandiva’s Reach',
      text: 'Picks the mightiest man opposite and takes −3 off him.',
      ...strike(3),
    },
    {
      name: 'Devadatta',
      text: 'Winds the conch he was given at Khandava, and the rank he joins gains +2.',
      ...rally(2),
    },
  ],
  bhima: [
    // His vow is NOT here. It is a trait that always fires, because Duryodhana's
    // card says "Answered by: Bhima, and by no one else", and an answer you
    // might choose not to give is not an answer.
    {
      name: 'Gada of Vayu',
      text: 'Brings the mace down on the mightiest man opposite, −4.',
      ...strike(4),
    },
    {
      name: 'Vrikodara’s Rage',
      text: 'The wolf-belly’s hunger. He fights at +4 this round.',
      target: { pick: 'self' },
      actions: [{ kind: 'buff', amount: 4 }],
    },
    {
      name: 'Uproot the Trees',
      text: 'Tears up the ground before him, −2 to the whole rank he faces.',
      ...volley(2),
    },
  ],

  // ---- Kaurava ----
  bhishma: [
    { name: 'Arrow Rain', text: 'Darkens the sky over the rank he faces, −2 to each.', ...volley(2) },
    {
      name: 'The Commander’s Word',
      text: 'Ten days the generalissimo, and the rank he joins gains +2.',
      ...rally(2),
    },
    {
      name: 'Son of Ganga',
      text: 'The river washes his line clean of every affliction.',
      target: { pick: 'allOwnUnits' },
      actions: [{ kind: 'cleanse' }],
    },
  ],
  drona: [
    {
      name: 'The Teacher’s Eye',
      text: 'He trained both houses. A chosen ally gains +3.',
      target: { pick: 'chosen', filter: { side: 'own' } },
      actions: [{ kind: 'buff', amount: 3 }],
    },
    {
      name: 'Chakravyuha',
      text: 'The wheel formation closes, and the mightiest man opposite is senseless this round.',
      target: { pick: 'highestEnemyUnit' },
      actions: [{ kind: 'addFlag', flag: 'stupefied' }],
    },
    {
      name: 'Acharya’s Volley',
      text: 'The rank he faces takes −2.',
      ...volley(2),
    },
  ],
  karna: [
    {
      name: 'Daanveer',
      // +3 AND NO SELF-COST. It was written as "+4, and he takes -2 for it",
      // which a valour cannot do: it resolves against one mark, so the -2 had
      // nowhere to land and the card would have promised a price it never
      // charged. Lower number, honest text.
      text: 'The giver. A chosen ally gains +3.',
      target: { pick: 'chosen', filter: { side: 'own' } },
      actions: [{ kind: 'buff', amount: 3 }],
    },
    {
      name: 'Anga’s Charge',
      text: 'The king of Anga rides down the mightiest man opposite, −4.',
      ...strike(4),
    },
    {
      name: 'Radheya’s Defiance',
      text: 'The charioteer’s son stands, armoured against what comes.',
      ...steel(3),
    },
  ],
  duryodhana: [
    {
      name: 'The Hundred Brothers',
      text: 'His house forms up behind him, and every ally gains +1.',
      ...host(1),
    },
    {
      name: 'The Gambler’s Court',
      text: 'The dice are his, and the enemy loses a card from hand.',
      target: { pick: 'none' },
      actions: [{ kind: 'discard', count: 1, side: 'enemy' }],
    },
    {
      name: 'Balarama’s Pupil',
      text: 'The mace he was taught by Rama of the plough, −4 to the mightiest foe.',
      ...strike(4),
    },
  ],

  // ---- Asura ----
  ravana: [
    { name: 'Arrow Rain', text: 'Darkens the sky over the rank he faces, −2 to each.', ...volley(2) },
    {
      name: 'Ten Heads',
      text: 'Ten minds turn at once. He fights at +2, and you draw a card.',
      target: { pick: 'self' },
      actions: [{ kind: 'buff', amount: 2 }, { kind: 'draw', count: 1, side: 'own' }],
    },
    {
      name: 'Lord of Lanka',
      text: 'His city stands with him, and every ally gains +1.',
      ...host(1),
    },
  ],
  indrajit: [
    // Antardhana, his vanishing, is a trait on his card and not a choice: it is
    // the only reason Rama's host could not answer him, and making it optional
    // would make him an ordinary 10 two thirds of the time.
    {
      name: 'Nagapasha',
      text: 'The serpent-noose binds the mightiest man opposite, senseless this round.',
      target: { pick: 'highestEnemyUnit' },
      actions: [{ kind: 'addFlag', flag: 'stupefied' }],
    },
    {
      name: 'Conqueror of Indra',
      text: 'The name he took off a god, −3 to the mightiest foe.',
      ...strike(3),
    },
    {
      name: 'Meghnad',
      text: 'He fights from inside the cloud, and the rank he faces takes −2.',
      ...volley(2),
    },
  ],
  hiranyakashipu: [
    {
      name: 'Brahma’s Boon',
      text: 'Not by man nor beast, day nor night. He is armoured against what comes.',
      ...steel(4),
    },
    {
      name: 'Tyrant of the Three Worlds',
      text: 'He held heaven itself, −1 to every foe on the field.',
      target: { pick: 'allEnemyUnits' },
      actions: [{ kind: 'damage', amount: 1 }],
    },
    {
      name: 'Hold Heaven',
      text: 'The daityas rule while he stands, and every ally gains +1.',
      ...host(1),
    },
  ],

  // ---- Neutral ----
  barbarika: [
    // The three arrows stay a trait on his card: they strike everyone and take
    // him with them, which is his whole story and not something to opt out of.
    {
      name: 'The Severed Head',
      // NOT "and he falls": his three arrows already take him, every time, as a
      // trait on his card. Saying it here would read as a price this choice
      // charges when it charges nothing.
      text: 'He gives his head to watch the war, and you draw 2.',
      target: { pick: 'none' },
      actions: [{ kind: 'draw', count: 2, side: 'own' }],
    },
    {
      name: 'Oath to the Weaker Side',
      text: 'He swore to fight for whoever was losing. While you are, the rank he joins gains +4.',
      condition: { q: 'behindOnPower' },
      ...rally(4),
    },
    {
      name: 'The Watcher on the Hill',
      text: 'He saw every blow of it, and the mightiest man opposite takes −3.',
      ...strike(3),
    },
  ],
  jarasandha: [
    {
      name: 'Two Halves Rejoined',
      text: 'What Jara joined, joins again. A chosen ally is restored to full strength.',
      target: { pick: 'chosen', filter: { side: 'own' } },
      actions: [{ kind: 'restore' }],
    },
    {
      name: 'The Captive Kings',
      text: 'Eighty-six kings in his cells. A man in the enemy host cannot be committed this round.',
      target: { pick: 'none' },
      actions: [{ kind: 'denyPlay', count: 1 }],
    },
    {
      name: 'Magadha’s Wrestler',
      text: 'He wrestled Bhima fourteen days, −4 to the mightiest foe.',
      ...strike(4),
    },
  ],
};
