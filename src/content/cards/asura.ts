import type { Card } from '@engine/types';

// The Asura host: daityas, danavas, and rakshasa lords drawn from across canon
// (Ramayana, the Puranas, the Devi Mahatmya). Identity: sticky boon-armoured
// bodies, night-growth, and clan bonds. A cross-epic guest faction, tuned by the
// balance lab to sit level with the Pandavas and Kauravas.
export const ASURA_CARDS: Card[] = [
  // ---- Lanka (Ramayana) ----
  {
    id: 'ravana',
    name: 'Ravana',
    house: 'asura',
    type: 'unit',
    tier: 'maharathi',
    // 10. He was set to 9 earlier by preference, and the reason for moving him
    // is better than the reason he was moved down: Brahma's boon made him
    // unkillable by gods, danavas, gandharvas, yakshas and rakshasas, and he
    // did not trouble to ask about men. So Vishnu had to be BORN as one. Every
    // other 10 in this set dies to a mortal with a bow. Bhishma falls to Arjuna
    // behind Shikhandi, Karna to Arjuna outright. Ravana needed an avatar.
    basePower: 10,
    rows: ['ratha'],
    keywords: [{ kind: 'armor', amount: 3 }],
    tags: ['rakshasa'],
    astraMastery: 2,
    ability: {
      name: 'Arrow Rain',
      text: 'Darkens the sky over the enemy host (-2 to every foe). Once per battle.',
      charges: 1,
      target: { pick: 'allEnemyUnits' },
      actions: [{ kind: 'damage', amount: 2 }],
    },
    effects: [],
    flavor: 'The ten-headed lord of Lanka, whose penance armoured him against the gods.',
  },
  {
    id: 'kumbhakarna',
    name: 'Kumbhakarna',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    // 8. Rama's whole host emptied itself into him and he kept walking: they
    // broke his weapon, then he fought with a rock, then bare-handed, and it
    // took Rama severing both arms, then both legs, then the head. Nobody else
    // in this deck absorbs a war like that.
    basePower: 8,
    rows: ['gaja'],
    keywords: [{ kind: 'nightGrowth', amount: 1 }],
    tags: ['rakshasa'],
    effects: [{ on: 'onPlay', target: { pick: 'highestEnemyUnit' }, actions: [{ kind: 'damage', amount: 2 }] }],
    flavor: 'The mountain that sleeps half the year and wakes to devour armies.',
  },
  {
    id: 'indrajit',
    name: 'Indrajit',
    house: 'asura',
    type: 'unit',
    tier: 'maharathi',
    // 10. His NAME is a trophy taken off a god: Indrajit, conqueror of Indra,
    // the only being who beat the king of the devas in open battle. He fought
    // from inside his own invisibility, felled Lakshmana twice, and could not
    // be killed until his unfinished sacrifice was broken up. Level with
    // Ravana: the father needed a boon to be unkillable, the son simply could
    // not be caught.
    basePower: 10,
    rows: ['ratha'],
    keywords: [],
    tags: ['rakshasa'],
    astraMastery: 2,
    knownAstras: ['vaishnavastra'],
    // HE FIGHTS UNSEEN, which is the only reason Rama's army could not answer
    // him: he loosed from inside his own maya and there was nothing to shoot
    // back at. Lakshmana could only kill him by breaking up the sacrifice that
    // renewed it.
    //
    // Measured problem this fixes: Indrajit was a vanilla 10 with no effect and
    // he measured 41.3% against Pandava, BELOW his own deck's base rate. A 10
    // that does nothing is simply the fattest target on the board, and Pandava's
    // whole kit is single-target removal: Krishna's counsel takes the highest
    // enemy warrior, and Asura is the most top-heavy deck in the game. Being
    // untargetable is both the canon-true trait and the exact answer to it.
    effects: [
      {
        on: 'onPlay',
        target: { pick: 'self' },
        actions: [{ kind: 'addFlag', flag: 'hidden' }],
      },
    ],
    flavor:
      'Meghnad, the only being to defeat Indra. He fought Rama’s host from inside his own illusion, and there was nothing to shoot back at.',
  },

  // ---- The great daityas (Puranic) ----
  {
    id: 'hiranyakashipu',
    name: 'Hiranyakashipu',
    house: 'asura',
    type: 'unit',
    tier: 'maharathi',
    // 9, on the same standard that just took Ravana to 10: an avatar had to be
    // invented for him. Brahma's boon closed off man and beast, day and night,
    // indoors and outdoors, ground and air and water, and every weapon. So
    // Vishnu came as neither man nor beast, at dusk which is neither day nor
    // night, on a threshold which is neither in nor out, and used no weapon.
    // He is one below Ravana because he ruled the three worlds and Ravana took
    // them from the gods who held them.
    basePower: 9,
    rows: ['ratha'],
    keywords: [{ kind: 'armor', amount: 2 }],
    tags: ['daitya'],
    // Mastery 2. The Asura deck carried FOUR tier-2 astras and had exactly two
    // men in thirteen who could fire any of them, against four of twelve for the
    // Pandavas and four of thirteen for the Kauravas. The faction whose entire
    // identity is mythical weapons was the worst in the game at casting them,
    // and four of its six astras sat dead in hand unless you drew Ravana or
    // Indrajit. Mastery is not priced into provisions, so this costs nothing.
    //
    // He ruled the three worlds behind a boon and took the devas' places from
    // them. Reading him as untrained in the Brahma line was never defensible.
    astraMastery: 2,
    effects: [],
    flavor: 'The boon-warded king, slain only in the loophole of his own wish.',
  },
  {
    id: 'hiranyaksha',
    name: 'Hiranyaksha',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['gaja'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 1 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'Who dragged the earth beneath the sea, until the Boar rose.',
  },
  {
    id: 'bali',
    name: 'Bali',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'deathless' }],
    tags: ['daitya'],
    effects: [],
    flavor: 'The generous king, deathless in the underworld he was granted.',
  },
  {
    // NOT A VILLAIN, and he was carrying the most generic card in the game: a
    // power-4 body with a clan bond and no effects, handed to the least generic
    // character in the set. Worse, the bond REWARDED him for standing with
    // other daityas, when refusing to do that is his entire story.
    //
    // Krishna names him in the Gita, in the chapter listing the forms the
    // divine itself takes: "I am Vasuki among serpents... I am Prahlada among
    // the Daityas... I am Rama among wielders of weapons" (Bhishma P. XXXIV).
    // He is the divine presence inside the demon race.
    //
    // His father had him poisoned, thrown from cliffs, trampled by elephants,
    // burned, and bound and cast into the sea. Every attempt failed because
    // Vishnu preserved him, and Narasimha was finally born to kill the father
    // and save the son.
    //
    // So he is the exception to the one structural weakness the Asura host has.
    // Vishnu's weapons were made to end asuras (the shrine refuses to teach
    // Narayana or Vaishnava to that house at all), and they will not touch the
    // man Vishnu came in person to protect. While he stands, his host is spared
    // them. A five-year-old with folded hands who blanks the thing designed to
    // beat his faction, without holding a weapon himself.
    id: 'prahlada',
    name: 'Prahlada',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['padati'],
    keywords: [],
    tags: ['daitya'],
    effects: [],
    flavor:
      'The devotee-prince. Poison, fire, the cliff, the elephants and the sea all refused him, and at the last a lion came out of a pillar for his sake.',
  },
  {
    id: 'narakasura',
    name: 'Narakasura',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 1 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'The demon of Pragjyotisha, born of the earth herself.',
  },

  // ---- The Devi's foes (Devi Mahatmya) ----
  {
    id: 'mahishasura',
    name: 'Mahishasura',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['gaja'],
    keywords: [],
    tags: ['asura-lord'],
    // Mastery 2: he broke the combined armies of the gods and held heaven, and
    // fought Durga through nine days and a shifting sequence of forms.
    astraMastery: 2,
    effects: [],
    flavor: 'The buffalo-demon who shifted shape faster than any blade could fall.',
  },
  {
    id: 'shumbha',
    name: 'Shumbha',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'asura-lord', amount: 1 }],
    tags: ['asura-lord'],
    effects: [],
    flavor: 'One of the brother-kings who claimed the three worlds.',
  },
  {
    id: 'nishumbha',
    name: 'Nishumbha',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'asura-lord', amount: 1 }],
    tags: ['asura-lord'],
    effects: [],
    flavor: 'The other brother, never seen apart from Shumbha.',
  },
  {
    id: 'raktabija',
    name: 'Raktabija',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'nightGrowth', amount: 2 }, { kind: 'unwoundable' }],
    tags: ['daitya'],
    // Every drop of his blood that touched the ground stood up as another of
    // him, and the gods could not fight him because hurting him MADE more of
    // him. Durga's answer was Kali, drinking the blood before it landed.
    //
    // This was an onRoundStart buff, which fires AFTER the board is wiped and
    // therefore never once fired in any game. The comment even claimed it had
    // lifted him off 42.6%; the lab still had him at 43.3%, because nothing had
    // happened. 'unwoundable' says the same thing through the floor instead:
    // damage cannot move him at all, and removal is the only answer. Which is
    // the actual story, since Kali did not wound him either.
    effects: [],
    flavor: 'From every drop of his blood, a thousand more of him rose. Wounding him was how you lost.',
  },

  // ---- Vedic / elder ----
  {
    id: 'vritra',
    name: 'Vritra',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'nightGrowth', amount: 1 }],
    tags: ['serpent'],
    // Mastery 1, not 2. Raising all three of Vritra, Mahishasura and
    // Hiranyakashipu put the host at five tier-2 wielders in thirteen against
    // four in twelve for the Pandavas, and it flipped Asura from worst deck to
    // best in one step (44.4% -> 51.7%). Vritra gives the point back: he is the
    // Vedic adversary of Indra, but he fights as a devouring serpent and a
    // drought, not as a man reciting mantras over a bow. The other two ruled
    // the three worlds as kings and are the better readings.
    astraMastery: 1,
    effects: [],
    flavor: 'The drought-serpent who swallowed the rivers, until the Vajra fell.',
  },
  {
    id: 'tarakasura',
    name: 'Tarakasura',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 1 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'Whom no one could slay but a son of Shiva, not yet born.',
  },

  // ---- Levy ----
  {
    id: 'asura_horde',
    name: 'Asura Horde',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 2,
    rows: ['padati'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 1 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'The numberless danava rank-and-file.',
  },

  // ---- The rakshasas of the Mahabharata itself ----
  //
  // This host was sixteen cards against Pandava's thirty-two and Kaurava's
  // thirty, so it had visibly fewer choices at the muster and its deck was
  // nearly forced. Everything added below is attested, and most of it is from
  // the Mahabharata rather than the Puranas, which the roster was thin on: the
  // asuras present were almost all cosmic figures from other stories, and the
  // rakshasas the Pandavas actually fought in the forest were missing.
  {
    id: 'hidimba',
    name: 'Hidimba',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['gaja'],
    keywords: [{ kind: 'nightGrowth', amount: 2 }, { kind: 'bond', tag: 'rakshasa', amount: 2 }],
    tags: ['rakshasa'],
    effects: [],
    flavor:
      'The man-eater of the forest by Varanavata, who smelled the Pandavas sleeping and sent his sister to fetch them. Bhima broke him instead.',
  },
  {
    id: 'hidimbi',
    name: 'Hidimbi',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha', 'gaja'],
    keywords: [{ kind: 'bond', tag: 'rakshasa', amount: 2 }],
    tags: ['rakshasa'],
    // She took the side of the man who killed her brother, and their son
    // Ghatotkacha died for the Pandavas. A rakshasi who rallies her own kind is
    // the whole of her: she brought the forest into that war.
    effects: [
      { on: 'onPlay', target: { pick: 'chosen', filter: { side: 'own' } }, actions: [{ kind: 'buff', amount: 2 }] },
    ],
    flavor:
      'Sent to lure the sleepers, she chose Bhima instead, and bore him Ghatotkacha. The rakshasi who took the other side.',
  },
  {
    id: 'bakasura',
    name: 'Baka',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['gaja'],
    keywords: [],
    tags: ['rakshasa'],
    // Ekachakra fed him a cartload of rice and a man every week. Bhima ate the
    // cartload on the road and killed him with it still in him.
    effects: [
      { on: 'onPlay', target: { pick: 'lowestEnemyUnit' }, actions: [{ kind: 'destroy' }] },
    ],
    flavor:
      'The eater of Ekachakra, who took a cartload of food and one villager a week, until the village sent Bhima with the cart.',
  },
  {
    id: 'kirmira',
    name: 'Kirmira',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['padati', 'gaja'],
    keywords: [{ kind: 'nightGrowth', amount: 2 }, { kind: 'bond', tag: 'rakshasa', amount: 2 }],
    tags: ['rakshasa'],
    effects: [],
    flavor:
      'Baka’s brother, who barred the road into Kamyaka at dusk and fought in darkness of his own making, to avenge him.',
  },
  {
    id: 'jatasura',
    name: 'Jatasura',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['padati'],
    keywords: [],
    tags: ['rakshasa'],
    // He lived among them disguised as a brahmana for months, waiting for the
    // day Bhima went hunting, then carried off four of the five and Draupadi.
    effects: [
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'denyPlay', count: 1 }] },
    ],
    flavor:
      'Who ate at their fire as a brahmana until Bhima went hunting, then picked up four Pandavas and Draupadi and ran.',
  },

  // ---- Ravana's captains ----
  {
    id: 'prahasta',
    name: 'Prahasta',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 7,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'rakshasa', amount: 2 }],
    tags: ['rakshasa'],
    effects: [],
    flavor: 'Ravana’s commander, who led the first sortie out of Lanka and did not come back through the gate.',
  },
  {
    id: 'atikaya',
    name: 'Atikaya',
    house: 'asura',
    type: 'unit',
    tier: 'atirathi',
    basePower: 8,
    rows: ['ratha'],
    // Brahma's own armour, which no ordinary shaft could pierce: Lakshmana had
    // to use the Brahmastra on him in the end.
    keywords: [{ kind: 'armor', amount: 3 }],
    tags: ['rakshasa'],
    effects: [],
    flavor:
      'Ravana’s son by Dhanyamalini, cased in armour Brahma gave him. Nothing short of a Brahma weapon would open it.',
  },
  {
    id: 'trishira',
    name: 'Trishira',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'rakshasa', amount: 2 }],
    tags: ['rakshasa'],
    // Three heads, and Rama took all three.
    effects: [
      { on: 'onPlay', target: { pick: 'allEnemyUnits' }, actions: [{ kind: 'damage', amount: 1 }] },
    ],
    flavor: 'The three-headed son of Ravana, who fought with three faces turned to the field at once.',
  },
  {
    id: 'maricha',
    name: 'Maricha',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['padati'],
    keywords: [],
    tags: ['rakshasa'],
    // The golden deer. He knew it would kill him and he did it anyway, because
    // he was more afraid of Ravana than of Rama.
    effects: [
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'denyPlay', count: 2, sparingStrongest: true }] },
    ],
    flavor:
      'Who took the shape of a golden deer to draw Rama away, knowing exactly what it would cost him, because Ravana asked.',
  },

  // ---- The older danavas ----
  {
    id: 'mayasura',
    name: 'Maya',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 4,
    rows: ['padati'],
    keywords: [],
    tags: ['danava'],
    // Not a fighter. The architect Arjuna spared at Khandava, who built the
    // Pandavas the hall of illusions that Duryodhana fell into.
    effects: [
      { on: 'onPlay', target: { pick: 'self' }, actions: [{ kind: 'addFlag', flag: 'hidden' }] },
      { on: 'onPlay', target: { pick: 'chosen', filter: { side: 'own' } }, actions: [{ kind: 'buff', amount: 3 }] },
    ],
    flavor:
      'The danava architect Arjuna spared from the burning of Khandava. He repaid it with the hall where water looked like floor.',
  },
  {
    id: 'namuchi',
    name: 'Namuchi',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['padati'],
    // Indra swore not to kill him with anything wet or dry, so he used sea
    // foam. A promise is not a shield, but it takes a trick to get around one.
    keywords: [{ kind: 'armor', amount: 2 }, { kind: 'bond', tag: 'danava', amount: 2 }],
    tags: ['danava'],
    effects: [],
    flavor:
      'Whom Indra swore to kill with nothing wet and nothing dry, and then killed with the foam of the sea.',
  },
  {
    id: 'virochana',
    name: 'Virochana',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 6,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'daitya', amount: 2 }],
    tags: ['daitya'],
    effects: [],
    flavor: 'Prahlada’s son and Bali’s father, who gave away his own life when a brahmana asked for it.',
  },
  {
    id: 'shambara',
    name: 'Shambara',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['ratha'],
    keywords: [{ kind: 'bond', tag: 'danava', amount: 2 }],
    tags: ['danava'],
    // Ninety-nine forts, and a hundred illusions to hold them.
    effects: [
      { on: 'onPlay', target: { pick: 'chosen', filter: { side: 'own' } }, actions: [{ kind: 'addFlag', flag: 'hidden' }] },
    ],
    flavor: 'Master of a hundred illusions and ninety-nine hill forts, who stole Pradyumna out of his cradle.',
  },
  {
    id: 'kalanemi',
    name: 'Kalanemi',
    house: 'asura',
    type: 'unit',
    tier: 'rathi',
    basePower: 5,
    rows: ['padati'],
    keywords: [{ kind: 'bond', tag: 'danava', amount: 2 }],
    tags: ['danava'],
    // Sent to delay Hanuman on the errand that would save Lakshmana's life. He
    // did not fight him; he tried to waste his time.
    effects: [
      { on: 'onPlay', target: { pick: 'none' }, actions: [{ kind: 'denyPlay', count: 1 }] },
    ],
    flavor:
      'Sent in a hermit’s robe to hold Hanuman with hospitality while a man lay dying for want of the herb he carried.',
  },
];
