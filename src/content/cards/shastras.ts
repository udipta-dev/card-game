import type { Card } from '@engine/types';

// SHASTRAS: named physical weapons, carried in the hand.
//
// Distinct from astras, which are invoked by mantra and fly. A shastra is a
// thing you hold, and it attaches to a warrior already on the field.
//
// The research surprise was how RARE these are. A systematic sweep of all
// eighteen books for "sword/mace/discus called X" returns exactly three names:
// Kaumodaki, Sudarsana and Kausika. Add the named bows and a handful of others
// and this is close to the complete set the epic actually gives. Bhima's mace,
// Duryodhana's mace, Bhishma's bow and Drona's bow are NEVER named.
//
// So this is a small, ownable content type rather than a sprawl. Every entry
// below is sourced; nothing is invented to round the list out.
//
// `bearer` restricts a weapon to the man it belongs to. Gandiva in anyone
// else's hands is not Gandiva.
export const SHASTRA_CARDS: Card[] = [
  {
    // Shanti Parva CLXVI, and the best-documented weapon in either epic.
    // Brahman created a dark, keen-toothed BEING from his sacrificial fire -
    // "his name is Asi" - which took the shape of a sword and descended
    // through Rudra, Vishnu, Indra and the Lokapalas to MANU, the first man,
    // with a governance charter attached: "Protect all creatures with this
    // sword... never according to caprice... Loss of limb or death should
    // never be inflicted for slight reasons."
    id: 'asi',
    name: 'Asi, the First Sword',
    house: 'neutral',
    type: 'shastra',
    basePower: 0,
    provision: 9,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence:
        'The first sword, made a Being before it was made a blade. It was given to Manu on terms: protect with it, never strike for a slight reason.',
    },
    effects: [
      { on: 'onPlay', target: { pick: 'chosen', filter: { side: 'own' } }, actions: [{ kind: 'buff', amount: 4 }] },
    ],
    flavor: 'Brahman drew it from his own sacrificial fire, and it was alive before it was steel.',
  },
  {
    // Adi CCXXVII: created by Brahman, owned by Varuna, procured by AGNI at
    // the Khandava burning along with two inexhaustible quivers.
    id: 'gandiva',
    name: 'Gandiva',
    house: 'pandava',
    type: 'shastra',
    basePower: 0,
    provision: 8,
    rows: ['ratha'],
    keywords: [],
    tags: ['bearer:arjuna'],
    cost: { consequence: 'Agni’s gift at Khandava, with two quivers that never empty.' },
    effects: [
      { on: 'onPlay', target: { pick: 'chosen', filter: { side: 'own' } }, actions: [{ kind: 'buff', amount: 3 }] },
      // The inexhaustible quivers: the bow keeps you supplied.
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'draw', count: 1, side: 'own' }] },
    ],
    flavor: 'The highest and largest of all weapons, and it never wants for arrows.',
  },
  {
    // Adi CCXXVII: VARUNA's gift at Khandava, "producing, when hurled, a roar
    // like that of the thunder".
    id: 'kaumodaki',
    name: 'Kaumodaki',
    house: 'neutral',
    type: 'shastra',
    basePower: 0,
    provision: 8,
    rows: ['gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'Varuna’s mace, whose passage sounds like thunder.' },
    effects: [
      { on: 'onPlay', target: { pick: 'chosen', filter: { side: 'own' } }, actions: [{ kind: 'buff', amount: 3 }] },
      { on: 'onPlay', target: { pick: 'lowestEnemyUnit' }, actions: [{ kind: 'damage', amount: 3 }] },
    ],
    flavor: 'It roars going out, and the line it lands in hears it first.',
  },
  {
    // Uttara Kanda 16. Shiva's gift after the Kailasa-lifting, and the
    // condition is a LOYALTY one rather than a target one, which is unusual
    // and very usable: "Never treat this weapon with contempt, if thou dost
    // disregard it, it will assuredly return to me."
    id: 'chandrahasa',
    name: 'Chandrahasa',
    house: 'asura',
    type: 'shastra',
    basePower: 0,
    provision: 7,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence:
        'Shiva gave it on one condition: never hold it in contempt. Disregard it and it goes back to him.',
    },
    effects: [
      { on: 'onPlay', target: { pick: 'chosen', filter: { side: 'own' } }, actions: [{ kind: 'buff', amount: 4 }] },
    ],
    flavor: 'The moon-blade, given by Shiva to the ten-headed king who lifted his mountain.',
  },
  {
    // Vana C-CI: Twashtri forged it from the BONES of the Rishi Dadhicha, who
    // renounced his body for it. Handheld and hurled, not an astra.
    id: 'vajra',
    name: 'Vajra',
    house: 'neutral',
    type: 'shastra',
    basePower: 0,
    provision: 10,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: {
      consequence:
        'Twashtri forged it from the bones of a sage who gave up his body so the gods would have a weapon.',
    },
    effects: [
      { on: 'onPlay', target: { pick: 'chosen', filter: { side: 'own' } }, actions: [{ kind: 'buff', amount: 2 }] },
      { on: 'onPlay', target: { pick: 'highestEnemyUnit' }, actions: [{ kind: 'damage', amount: 5 }] },
    ],
    flavor: 'Indra’s bolt, and a man’s bones. Dadhicha gave them up so it could exist.',
  },
  {
    // Anusasana XIV. Shiva's own axe, and his epithet Khandaparasu
    // commemorates parting with it. Rama exterminated the Kshatriyas with it.
    id: 'parasu',
    name: 'Parasu',
    house: 'neutral',
    type: 'shastra',
    basePower: 0,
    provision: 8,
    rows: ['ratha', 'gaja', 'padati'],
    keywords: [],
    cost: { consequence: 'Shiva’s own axe. He is called Khandaparasu for having given it away.' },
    effects: [
      { on: 'onPlay', target: { pick: 'chosen', filter: { side: 'own' } }, actions: [{ kind: 'buff', amount: 3 }] },
      { on: 'onPlay', target: { pick: 'enemyRowSameAsPlayed' }, actions: [{ kind: 'damage', amount: 2 }] },
    ],
    flavor: 'Twenty-one times it emptied the earth of kings.',
  },
];
