// The rest of the ladder: two valours for every atirathi, one for every rathi.
//
// The maharathi pass alone skewed the game badly, and the cause was structural
// rather than a number. Maharathis per starter deck: kaurava 4, asura 3,
// pandava 2, and the win rates came out in exactly that order (61.3 / 50.1 /
// 35.9). A maharathi-only buff is a Kaurava buff by construction.
//
// Finishing the ladder is what fixes it, because the decks are built differently
// all the way down:
//
//   pandava  2x3 + 8x2 + 3x1 = 25 slots
//   kaurava  4x3 + 4x2 + 5x1 = 25 slots
//   asura    3x3 + 5x2 + 5x1 = 24 slots
//
// Pandava is by far the most atirathi-heavy host in the game, which is why this
// file is worth more to them than to anyone else.
//
// RANK BUYS CHOICE, NOT SIZE, and that came out of measurement rather than
// taste. The first cut scaled the numbers by tier as well as the count, so a
// maharathi's valour was worth roughly twice an atirathi's. It measured
// pandava 38.6 / kaurava 56.3 / asura 51.9, a 17.7-point spread, because the
// houses do not field ranks evenly: pandava carries 8 atirathis and 2
// maharathis, kaurava exactly the reverse at 4 and 4. Scaling by tier is
// therefore a Kaurava buff wearing a design principle as a hat.
//
// Flattening the sizes and letting rank decide only HOW MANY options a man is
// offered took it to pandava 43.6 / kaurava 52.8 / asura 51.1, a 9.2-point
// spread, with one change. It is also the better rule to say out loud: a
// maharathi is not a man whose blows land harder, he is a man with more ways to
// fight.
//
// A rathi is offered ONE, so he makes no choice: his valour simply happens. The
// tier exists to give him a line of text and a reason to be looked at, not a
// decision. The decisions start at atirathi.
import type { Valour } from '@engine/types';
import { daze, rally, steel, strike, surge, volley } from './valours';

/**
 * Two apiece. One presses, one holds, so the choice reads off the board.
 *
 * BALARAMA IS NOT HERE, on purpose. He is the one card in the game still
 * carrying the older shape: a turn-costing ability with charges, spent on a
 * later turn rather than chosen as he arrives. Giving him valours would have
 * deleted the Mace of the Plough, and the two models are worth keeping side by
 * side while one of them is this new. He walked away from the war; he can walk
 * away from this too.
 */
export const ATIRATHI_VALOURS: Record<string, Valour[]> = {
  // ---- Pandava ----
  yudhishthira: [
    { name: 'The Word of the Just', text: 'His word steadies the rank he joins, +1 to each.', ...rally(2) },
    { name: 'Dharma Holds', text: 'He plants himself and will not be moved, armoured against what comes.', ...steel(3) },
  ],
  abhimanyu: [
    { name: 'Into the Wheel', text: 'The boy goes in alone and takes −2 off the mightiest man opposite.', ...strike(3) },
    { name: 'Sixteen Years', text: 'Everything he has, all at once. He fights at +3 this round.', ...surge(3) },
  ],
  ghatotkacha: [
    { name: 'Night Shape', text: 'The rakshasa swells in the dark, −2 to the rank he faces.', ...volley(3) },
    { name: 'Hidimba’s Son', text: 'He plants himself before the host, armoured against what comes.', ...steel(3) },
  ],
  dhrishtadyumna: [
    { name: 'Born of Fire', text: 'The fire he came out of still burns, +2 to himself.', ...surge(3) },
    { name: 'Panchala Rallies', text: 'His father’s men close up around him, +1 to the rank he joins.', ...rally(2) },
  ],
  drupada: [
    { name: 'The Old Grudge', text: 'Forty years of it, −2 off the mightiest man opposite.', ...strike(3) },
    { name: 'King of Panchala', text: 'His court forms up, +1 to the rank he joins.', ...rally(2) },
  ],
  virata: [
    { name: 'The Matsya Standard', text: 'His fish-banner goes up, +1 to the rank he joins.', ...rally(2) },
    { name: 'Host of Virata', text: 'The kingdom that hid them stands, armoured against what comes.', ...steel(3) },
  ],
  sweta: [
    { name: 'First Blood', text: 'He rode at Bhishma on the first day, −2 to the mightiest man opposite.', ...strike(3) },
    { name: 'The Charge', text: 'He goes forward and does not stop, +3 to himself.', ...surge(3) },
  ],
  satyaki: [
    { name: 'The Vrishni Bow', text: 'Krishna’s own pupil, −2 to the mightiest man opposite.', ...strike(3) },
    { name: 'Guard the Chariot', text: 'He stands over Arjuna’s wheel, +1 to the rank he joins.', ...rally(2) },
  ],
  chekitana: [
    { name: 'The Vrishni Line', text: 'He brings his clan up, +1 to the rank he joins.', ...rally(2) },
    { name: 'Hold the Flank', text: 'He digs in where he stands, armoured against what comes.', ...steel(3) },
  ],
  dhrishtaketu: [
    { name: 'Chedi Answers', text: 'The son of the man Krishna killed, −2 to the mightiest man opposite.', ...strike(3) },
    { name: 'The Chedi Host', text: 'His kingdom forms up behind him, +1 to the rank he joins.', ...rally(2) },
  ],

  // ---- Kaurava ----
  shalya: [
    { name: 'The Madra King', text: 'A king in his own right, +2 to himself.', ...surge(3) },
    { name: 'The Poison Tongue', text: 'He talks the mightiest man opposite out of his nerve, −2.', ...strike(3) },
  ],
  ashwatthama: [
    { name: 'The Night Raid', text: 'What he did to the camp while it slept, −2 to the rank he faces.', ...volley(3) },
    { name: 'Drona’s Son', text: 'He cannot be killed, and he will not be moved either.', ...steel(3) },
  ],
  kripa: [
    { name: 'The Old Teacher', text: 'He taught them all, +1 to the rank he joins.', ...rally(2) },
    { name: 'Chiranjivi', text: 'One of the deathless, and he stands like it.', ...steel(3) },
  ],
  kritavarma: [
    { name: 'The Vrishni Turncoat', text: 'He chose the other side, −2 to the mightiest man opposite.', ...strike(3) },
    { name: 'Night Guard', text: 'He watched the door while it was done, armoured against what comes.', ...steel(3) },
  ],
  bhurishravas: [
    { name: 'The Severed Arm', text: 'He fought on after it, +3 to himself.', ...surge(3) },
    { name: 'Kuru Rites', text: 'Old blood, formed up, +1 to the rank he joins.', ...rally(2) },
  ],
  bhagadatta: [
    { name: 'Supratika', text: 'The elephant goes through the line, −2 to the rank he faces.', ...volley(3) },
    { name: 'The Bound Eyelids', text: 'He ties them up to see, and takes −2 off the mightiest man opposite.', ...strike(3) },
  ],
  alayudha: [
    { name: 'Night Hunger', text: 'The rakshasa feeds after dark, +2 to himself.', ...surge(3) },
    { name: 'Baka’s Kin', text: 'He came for the debt, −2 to the mightiest man opposite.', ...strike(3) },
  ],
  vrishasena: [
    { name: 'Karna’s Son', text: 'His father’s bow, −2 to the mightiest man opposite.', ...strike(3) },
    { name: 'The Sun Line', text: 'The children of the sun close up, +1 to the rank he joins.', ...rally(2) },
  ],

  // ---- Asura ----
  kumbhakarna: [
    { name: 'Six Months’ Sleep', text: 'He wakes hungry and takes −2 off the rank he faces.', ...volley(3) },
    { name: 'The Mountain', text: 'An army emptied itself into him once, armoured against what comes.', ...steel(3) },
  ],
  // BALI, MAHISHASURA AND VRITRA are maharathis now, so three each. All three
  // were men the existing gods could not answer: Bali had to be tricked out of
  // the three worlds, the Devi had to be created to remove Mahishasura, and
  // killing Vritra cost Indra the vajra and his own throne for a while.
  bali: [
    { name: 'Three Paces', text: 'He gave away the world and kept his word, +1 to the rank he joins.', ...rally(2) },
    { name: 'King Below', text: 'Deathless in the realm he was granted, and he stands like it.', ...steel(3) },
    { name: 'Lord of Three Worlds', text: 'He has held all of them at once, and fights at +3.', ...surge(3) },
  ],
  narakasura: [
    { name: 'Born of the Earth', text: 'The ground itself holds him up, +2 to himself.', ...surge(3) },
    { name: 'Pragjyotisha', text: 'His city marches, +1 to the rank he joins.', ...rally(2) },
  ],
  mahishasura: [
    { name: 'The Shifting Form', text: 'Buffalo, lion, man. The mightiest opposite is senseless this round.', ...daze() },
    { name: 'Nine Nights', text: 'He held the goddess nine days, armoured against what comes.', ...steel(3) },
    { name: 'He Took Heaven', text: 'The devas’ own armies broke on him, −2 to the rank he faces.', ...volley(3) },
  ],
  shumbha: [
    { name: 'Lord of Asuras', text: 'The lords form up behind him, +1 to the rank he joins.', ...rally(2) },
    { name: 'The Challenge', text: 'He calls out the mightiest man opposite, −2.', ...strike(3) },
  ],
  vritra: [
    { name: 'The Drought', text: 'He holds the rivers back, −2 to the rank he faces.', ...volley(3) },
    { name: 'Coils of the Serpent', text: 'Neither wet nor dry could kill him, armoured against what comes.', ...steel(3) },
    { name: 'Indra’s Enemy', text: 'It took the vajra and a sage’s bones, −3 off the mightiest man opposite.', ...strike(3) },
  ],
  hidimba: [
    { name: 'The Forest Ambush', text: 'He takes them in the trees, −2 off the mightiest man opposite.', ...strike(3) },
    { name: 'Night Strength', text: 'The dark doubles him, +2 to himself.', ...surge(3) },
  ],
  bakasura: [
    { name: 'The Cart of Rice', text: 'He eats first and fights after, +3 to himself.', ...surge(3) },
    { name: 'Ekachakra’s Toll', text: 'A village a week, −2 to the rank he faces.', ...volley(3) },
  ],
  prahasta: [
    { name: 'Lanka’s General', text: 'He commanded the whole city, +1 to the rank he joins.', ...rally(2) },
    { name: 'The Last Charge', text: 'He went out to meet them, −2 off the mightiest man opposite.', ...strike(3) },
  ],
  atikaya: [
    { name: 'Ravana’s Son', text: 'His father’s armour and his own, doubled against what comes.', ...steel(3) },
    { name: 'The Brahma Arrow', text: 'Only one weapon could reach him, −2 to the mightiest man opposite.', ...strike(3) },
  ],

  // TARAKASURA AND RAKTABIJA moved up from rathi, so they get a choice now.
  // Taraka's boon meant only a son of Shiva could end him, which is the reason
  // Kartikeya was born at all; Raktabija could not be wounded without making
  // more of himself, and Kali had to drink the blood out of the air.
  tarakasura: [
    { name: 'Only a Child Could', text: 'A boy of seven was the only answer, +2 to himself.', ...surge(3) },
    { name: 'The Boon Holds', text: 'No grown man may end him, armoured against what comes.', ...steel(3) },
  ],
  raktabija: [
    { name: 'Every Drop', text: 'Each one that falls stands up again, +2 to himself.', ...surge(3) },
    { name: 'The Field Fills', text: 'More of him than there is room for, −2 to the rank he faces.', ...volley(3) },
  ],

  // ---- Neutral ----
  ekalavya: [
    { name: 'The Thumb He Gave', text: 'He learned it again without one, +3 to himself.', ...surge(3) },
    { name: 'Self-Taught', text: 'No teacher and no permission, −2 off the mightiest man opposite.', ...strike(3) },
  ],
  shishupala: [
    { name: 'The Hundred Insults', text: 'He counts them out loud, −2 off the mightiest man opposite.', ...strike(3) },
    { name: 'Chedi’s King', text: 'His court closes around him, +1 to the rank he joins.', ...rally(2) },
  ],
};

/** One apiece, and no choice in it: a rathi's valour simply happens. */
export const RATHI_VALOURS: Record<string, Valour[]> = {
  // ---- Pandava ----
  iravan: [{ name: 'The Naga’s Son', text: 'Arjuna’s son by the serpent princess, +1 to the rank he joins.', ...rally(2) }],
  anjanaparvan: [{ name: 'Ghatotkacha’s Son', text: 'Third of the line, +2 to himself.', ...surge(3) }],
  prativindhya: [{ name: 'Eldest of Five', text: 'Draupadi’s first, +1 to the rank he joins.', ...rally(2) }],
  sutasoma: [{ name: 'Bhima’s Son', text: 'His father’s weight behind him, +2 to himself.', ...surge(3) }],
  shrutakarma: [{ name: 'Arjuna’s Son', text: 'His father’s eye, −1 off the mightiest man opposite.', ...strike(1) }],
  shatanika: [{ name: 'Nakula’s Son', text: 'Quick as the twin who fathered him, +2 to himself.', ...surge(3) }],
  shrutasena: [{ name: 'Sahadeva’s Son', text: 'He reads the field, +1 to the rank he joins.', ...rally(2) }],
  shikhandi: [{ name: 'Amba Reborn', text: 'The face no man will raise a bow to, armoured against what comes.', ...steel(3) }],
  yudhamanyu: [{ name: 'Left Wheel', text: 'He guards the chariot’s left, +1 to the rank he joins.', ...rally(2) }],
  uttamaujas: [{ name: 'Right Wheel', text: 'He guards the chariot’s right, +1 to the rank he joins.', ...rally(2) }],
  sankha: [{ name: 'Virata’s Son', text: 'The prince rides out, +2 to himself.', ...surge(3) }],
  uttara: [{ name: 'The Boy Who Ran', text: 'He came back, and stands, armoured against what comes.', ...steel(3) }],
  kekaya_brothers: [{ name: 'Five Together', text: 'They came as one, +1 to the rank they join.', ...rally(2) }],
  kuntibhoja: [{ name: 'Kunti’s Father', text: 'The old king holds his line, +1 to the rank he joins.', ...rally(2) }],
  yuyutsu: [{ name: 'The Brother Who Crossed', text: 'He walked over before it began, +2 to himself.', ...surge(3) }],
  pandava_infantry: [{ name: 'The Line Holds', text: 'Footmen close the gap, +1 to the rank they join.', ...rally(2) }],

  // ---- Kaurava ----
  dushasana: [{ name: 'The Hand in the Hall', text: 'The one Bhima swore for, −1 off the mightiest man opposite.', ...strike(1) }],
  durmukha: [{ name: 'Foul-Mouth', text: 'He goads the mightiest man opposite into a mistake, −1.', ...strike(1) }],
  uluka: [
    // HIS OWN LINE AT LAST. He was the worst warrior in the game at 40.9%, and
    // the "draw 1" written to fix that was worth 12.7 points of faction spread
    // by itself, so it was taken back off him with a note that he was owed one.
    // This is it: no card economy, just the message he actually carried.
    { name: 'The Herald’s Message', text: 'The words that ended the talking, −1 off the mightiest man opposite.', ...strike(1) },
  ],
  bahlika: [{ name: 'The Elder’s Weight', text: 'Oldest man on the field, +1 to the rank he joins.', ...rally(2) }],
  somadatta: [{ name: 'The Old Quarrel', text: 'He remembers who started it, +2 to himself.', ...surge(3) }],
  susharma: [{ name: 'The Samshaptakas', text: 'The sworn men, who win or die, +1 to the rank he joins.', ...rally(2) }],
  sudakshina: [{ name: 'The Kamboja Horse', text: 'His riders go through, −1 to the rank he faces.', ...volley(1) }],
  srutayudha: [{ name: 'Varuna’s Mace', text: 'The gift that killed its owner, −1 off the mightiest man opposite.', ...strike(1) }],
  jalasandha: [{ name: 'Magadha’s Elephant', text: 'He rides it into the line, −1 to the rank he faces.', ...volley(1) }],
  alambusha: [{ name: 'Night Fighter', text: 'The dark is his, +2 to himself.', ...surge(3) }],
  kaurava_infantry: [{ name: 'The Line Holds', text: 'Footmen close the gap, +1 to the rank they join.', ...rally(2) }],

  // ---- Asura ----
  hiranyaksha: [{ name: 'The Earth Dragged Under', text: 'He takes the ground with him, −1 to the rank he faces.', ...volley(1) }],
  prahlada: [{ name: 'The Five Refusals', text: 'Nothing his father tried would land, armoured against what comes.', ...steel(3) }],
  nishumbha: [{ name: 'The Other Brother', text: 'Never seen apart from Shumbha, +1 to the rank he joins.', ...rally(2) }],
  asura_horde: [{ name: 'The Swarm', text: 'They come on together, +1 to the rank they join.', ...rally(2) }],
  kirmira: [{ name: 'Kamyaka Wood', text: 'He takes them among the trees, −1 off the mightiest man opposite.', ...strike(1) }],
  namuchi: [{ name: 'Neither Wet Nor Dry', text: 'No weapon of the kind he was promised, armoured against what comes.', ...steel(3) }],
  virochana: [{ name: 'Prahlada’s Son', text: 'He gave his own head away, +2 to himself.', ...surge(3) }],

  // ---- Neutral ----
  rukmi: [{ name: 'Refused by Both', text: 'Neither host would take him, so he stands alone, +2 to himself.', ...surge(3) }],
};
