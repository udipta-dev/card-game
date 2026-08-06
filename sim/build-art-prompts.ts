// Build docs/art-prompts.md: one image prompt per card, generated from the live
// card data.  npx vite-node sim/build-art-prompts.ts
//
// Everything here is derived from generations we actually looked at, not theory.
// Three of the previous eight rules turned out to be wrong and are corrected
// below; the corrections cost real images to learn, so they are written down.
//
//  1. THE FAILURE MODE IS UNFAMILIAR GESTURE, NOT LENGTH. A 177-word Karna
//     rendered every armour piece, the earrings, the scarf, the dhoti, the low
//     sun and the broken chariots. The one thing it dropped was "his right hand
//     rests on the arrow at his hip", an unusual hand placement, and it put the
//     bow in the wrong hand too. Length was not the problem; the gesture was.
//     Keep prompts near 110 words anyway, for consistency across 103 cards and
//     because sprawl makes failures hard to attribute. But do not expect
//     trimming to rescue an instruction the model cannot draw.
//     WAS: "dense beats minimal", then briefly "length is the constraint".
//     Both overstated. The first blamed sparseness, the second blamed size.
//  2. NAMING THE CHARACTER IS SAFE, so long as no slot is left blank. The prior
//     fills gaps, not names. The original Krishna disaster came from a peacock
//     feather that was literally in our own prompt text.
//     WAS: nothing. We wrongly blamed the name.
//  3. ENUMERATE ARMOUR BY ITS PROPER TERM: breastplate, pauldrons, vambraces,
//     greaves, belt. Real armour nouns already imply the region they cover, and
//     this is what finally killed the bare-chested renders. Better than the old
//     "torso completely enclosed", and much better than any analogy.
//  4. NEVER A WEAPON IN TRANSIT. No mid-swing, no loosed bowstring: it needs a
//     deformed string plus an absent arrow and returns melted geometry.
//     Complex two-hand gestures also fail. A weapon HELD plus a quiver worn on
//     the back reads as action and renders cleanly.
//  5. NEGATE QUALITIES, NEVER OBJECTS. "No glossy surfaces" is a free bet: if
//     the negation fails you get gloss, which was the default anyway. "No
//     sword" hands you a sword.
//     WAS: "never name what you do not want". True for Firefly, which has no
//     negative field. False for meta.ai, which handles negated qualities.
//  6. ONE GLOBAL PALETTE INSTRUCTION beats per-item colour discipline. "Muted
//     earthy palette" solves the all-red Karna outright.
//  7. NO HUE ON AIR. "Dark indigo air" produced a blue daylight sky. A VALUE on
//     a named weather object ("dark thunderclouds") is fine.
//  8. NEVER ASK FOR BOTH an oversized foreground weapon and a full-frame fit.
//     They fight, and the weapon gets cropped. Framing wins; drama is cheaper
//     to add back than a severed bow.
//  9. NO JSON. It collapses the prompt entirely and returns stock images.
import fs from 'node:fs';
import { allCards } from '@content/cards';
import type { Card } from '@engine/types';

/** Five terms, not nine. Brushwork/painterly/hand-painted were one instruction
 *  written three ways, and "matte finish" is already covered by the negations. */
const STYLE =
  'Ink-and-gouache fantasy illustration, bold black linework, opaque gouache ' +
  'brushwork, muted earthy palette, dramatic chiaroscuro.';

/** Same hand, same medium, different palette. Rule 6 still applies: this is
 *  one global palette instruction, not per-item colour discipline. It just
 *  cannot be the earthy one, which was quietly instructing the model to
 *  desaturate a weapon whose entire subject is light. */
const STYLE_EMISSIVE =
  'Ink-and-gouache fantasy illustration, bold black linework, opaque gouache ' +
  'brushwork, burning against black in the same ground pigments as the rest of ' +
  'the set, lac red and indigo and terre verte and brass, dramatic chiaroscuro.';

/** The camera gets its own sentence, because a bare "Low-angle view" tucked
 *  into the framing clause did not land and Karna came back near eye-level.
 *  But it must NOT be universal: a worm's-eye view says "this one towers over
 *  you", which is true of Bhima and false of Shakuni, who schemes at your
 *  elbow. Default by rank, override per character. */
const CAMERA: Record<string, string> = {
  maharathi: 'Low camera angle looking up at him from below, towering heroic perspective.',
  atirathi: 'Slightly low camera angle, imposing perspective.',
  rathi: 'Eye-level camera.',
};
/** Same idea where there is no "him" to look up at. */
const CAMERA_SCENE = 'Low camera angle looking up from below, towering scale.';

/**
 * Weapons are generated on pure black and composited with `mix-blend-mode:
 * screen`, so the card shows the weapon's own light on the card's own ground
 * rather than a black rectangle punched into the grid. The same file then
 * seeds the invocation clip, which has to be black anyway: no video format
 * carries an alpha channel in every browser, so screen-over-black is how an
 * effect gets to sit on the board without a box around it.
 *
 * Everything here exists to protect the black. Haze, grain, a lifted vignette
 * and volumetric smoke all survive a screen blend as a grey veil, and a dark
 * bronze shaft disappears into the ground entirely, because screen can only
 * add light. What you want visible has to be luminous.
 */
const ON_BLACK =
  'Isolated on pure black, lit only by its own light. No ground, horizon, sky, landscape, smoke, haze, fog, vignette or film grain. Strong modelling, but no part of the subject may fall to near-black.';

/**
 * The lesson that cost the most generations. An astra described as "an arrow
 * AND an emblem" comes back as two separate objects with a hard contact line,
 * and it reads as an arrow *striking* a sphere rather than an arrow that IS
 * one. Three passes to find it: deleting the arrowhead was not enough on its
 * own, because the shaft still met the emblem at a seam and looked glued.
 *
 * What works is describing the transition itself as the subject. Wood, then
 * embers, then streaming light, then the emblem, with no boundary anywhere.
 * The arrowhead has to be named as absent or the model draws one.
 */
const MERGE =
  'No arrowhead anywhere in the frame, and no seam or contact line: the shaft breaks into embers and streaming light partway up and flows into the emblem, becoming it. One single object, not two touching.';

/**
 * Also learned by generating: at full size the emblem crowds its own detail
 * and the black margin disappears, which is exactly the margin the screen
 * composite needs to feather into the board. Roughly half the frame height,
 * detail held crisp.
 */
const FRAME_EMISSIVE =
  'The subject fills about half the frame height and no more, generous black margin on every side, nothing cropped, every detail crisp at that size.';

/** Card types generated on black. Vardaans are the obvious next candidates if
 *  the look is wanted for them; they are left as scenes for now because they
 *  are gifts rather than light. */
const EMISSIVE_TYPES = new Set(['astra', 'shastra']);

/** Weapons whose subject is an arrow BECOMING something. Only these get the
 *  merge rule; a mace is already one object and warning it about seams is
 *  noise that crowds out instructions that matter. */
const MERGES = new Set([
  'brahmastra',
  'brahmashirsha',
  'pashupatastra',
  'nagastra',
  'bhargavastra',
  'sauparna',
  'antardhana',
]);

// ------------------------------------------------------------------- facing
// Nothing in the prompt said which way anyone faced, so the model fell back to
// the same default every time and the whole set looked away to its left. That
// reads as a template, which is exactly the fatigue it produces.
//
// Deterministic, not random: a stable hash of the card id, so regenerating a
// prompt never changes the picture you already made from it, and the spread is
// designed rather than noisy. Square-on is the most confrontational and is
// reserved by weighting for the ranks that should feel that way.
const FACING = [
  'turned three-quarters to his right',
  'squarely facing the viewer',
  'turned three-quarters to his left',
  'squarely facing the viewer, head slightly turned',
];
function hashOf(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function facingOf(card: U): string {
  // Maharathis skew square-on: the greatest should meet your eye.
  const pool = card.tier === 'maharathi' ? FACING : [FACING[0], FACING[2], FACING[1]];
  return pool[hashOf(card.id) % pool.length];
}

/** Rule 8: framing, kept in a separate sentence from the camera because the two
 *  genuinely fight. A low angle wants to crop the feet or the crown, so the
 *  guard has to be explicit about the extremities rather than saying "nothing
 *  cropped" and hoping. Takes the subject phrase: "full figure" is wrong on a
 *  card that has no figure, and most astras do not. */
const FRAME = (subject: string) => `${subject} inside the frame, clear margin, nothing cropped.`;

/** Rule 5: qualities only. Never negate an object. */
const NEG = 'No photorealism, no 3D rendering, no glossy surfaces, no bloom.';

/** Weapons keep the photographic negations but lose "no bloom": these things
 *  are made of light, and the glow is the point. Screen compositing rewards it
 *  too, since the corona is what feathers the effect into the board instead of
 *  ending it at a hard edge. */
const NEG_EMISSIVE = 'No photorealism, no 3D rendering, no glossy surfaces.';

/** Rule 8 again, aimed at menace. The first pass produced pretty light and
 *  nothing frightening, because nothing in the frame was looking back. It used
 *  to end "Enormous, close, and terrible", which fought the scale rule
 *  outright: you cannot be told to crowd the frame and to leave a generous
 *  margin in the same breath. The dread has to come from the faces and eyes
 *  in the subject, not from filling the card. */
const RIM =
  'A hard rim of white light around the subject and a wide burning corona beyond it.';

/**
 * The god is named in every weapon prompt, and naming him invites the model to
 * draw him. The first Brahmashirsha came back as four screaming heads stacked
 * into a column: grotesque, and wrong on its own terms, because the line this
 * whole section is built on is about signs and not faces.
 *
 * Menace has to come from the emblem being a weapon, not from something with a
 * face glaring out of it. A lotus whose petals are blades is frightening. A
 * lotus with a man screaming in the middle of it is a cartoon.
 */
const EMBLEM_ONLY =
  'Show the emblem alone. The god himself never appears: no face, no head, no human figure, no eyes anywhere in the image.';

type U = Card & { basePower?: number; tier?: string; flavor?: string };

// ---------------------------------------------------------------- house look
// Rule 3. The coverage list is CONSTANT across the roster: it is the thing that
// keeps chests covered, so no card gets to opt out of it. Only the metal and
// the tunic vary, which is enough to tell the hosts apart at board size.
const PLATES = 'sculpted breastplate, layered pauldrons, vambraces, greaves and jewelled belt';

const METAL: Record<string, string> = {
  pandava: 'Engraved gold armour',
  kaurava: 'Engraved dark iron armour banded with gold',
  asura: 'Engraved blackened bronze armour',
  legend: 'Engraved silver armour',
  neutral: 'Engraved bronze armour',
};
const TUNIC: Record<string, string> = {
  pandava: 'a dark blue tunic',
  kaurava: 'a deep crimson tunic',
  asura: 'a black tunic',
  legend: 'a grey tunic',
  neutral: 'a russet tunic',
};
// Cloth is its own short sentence. It carries the motion that the pose no
// longer asks for, since a billowing scarf is static geometry the model can
// actually draw.
const CLOTH: Record<string, string> = {
  pandava: 'Billowing white battle scarf, white dhoti, gold sandals',
  kaurava: 'Billowing dark ochre battle scarf, white dhoti, gold sandals',
  asura: 'Torn black battle scarf, dark loincloth, heavy leather sandals',
  legend: 'Billowing grey battle scarf, white dhoti, plain sandals',
  neutral: 'Billowing russet battle scarf, white dhoti, leather sandals',
};
const BUILD: Record<string, string> = {
  maharathi: 'powerfully built',
  atirathi: 'hard-muscled',
  rathi: 'wiry',
};
// Headwear by rank, so standing reads before you know who anyone is.
const MARK: Record<string, string> = {
  maharathi: 'long black hair beneath an ornate golden crown',
  atirathi: 'long black hair beneath a golden circlet',
  rathi: 'long black hair bound in a topknot',
};

// ------------------------------------------------------------------ weapons
// A weapon is a CHARACTER fact. The board row is a MECHANICS category saying
// where a card fights, and the two are not the same thing. Keying weapons off
// the row put the identical bow in the hands of 64 of 81 warriors, including
// Yudhishthira, who carries a spear, and the twins, who carry swords.
//
// Rule 4 still applies to every entry: HELD, never in transit.
const WEAPON_BY_ID: Record<string, string> = {
  // --- Sourced against the Ganguli text (Project Gutenberg 12058/15474/15476).
  // The bow is UNIVERSAL in the epic: the Virata Parva shami-tree inventory
  // gives every Pandava both a bow and a sword. So a man's default loadout
  // cannot distinguish him. What can is his signature KILL or epithet, which is
  // how Yudhishthira's spear surfaced: Adi Parva calls him only a car-warrior,
  // but in Shalya Parva he kills Shalya with a golden-handled dart Tvashtri
  // forged. That is the drawable fact.
  arjuna: 'holding Gandiva, a huge golden-backed longbow, a full quiver on his back',
  bhima: 'holding a heavy gold-decked iron mace in both hands',
  yudhishthira: 'holding a long gold-hafted spear hung with bells',
  // The twins' blades differ in the text, so they can differ in the picture.
  nakula: 'holding a straight steel sword and a shield decked with a thousand stars',
  sahadeva: 'holding a broad curved scimitar and a shield',
  duryodhana: 'holding a colossal gold-banded war-mace',
  // He shoots on after paying the tuition-fee, so: a bow AND the maimed hand.
  ekalavya: 'drawing a bow, fingers cased in a leather guard, right thumb gone',

  // --- Not from the epic's own catalogue, but unmistakable and uncontested.
  karna: 'holding a massive ornate dark bow, a full quiver of arrows on his back',
  ghatotkacha: 'holding a huge blazing spear upraised overhead',
  shakuni: 'holding a pair of ivory dice and no weapon',
  balarama: 'holding a plough in one hand and a heavy pestle-club in the other',
  krishna_charioteer: 'holding chariot reins and a white conch, no weapon',
  // Ashwatthama is deliberately ABSENT. The only thing sourced for him is that
  // he excelled in "the science of arms", which is astra mastery, not an object
  // an illustrator can draw. He takes the fallback until that is settled.
  // --- Pandava allies, verified verbatim against Ganguli (PG 15474-15476).
  // Only three of the fifteen have a genuinely distinctive weapon. Four more
  // have a memorable dart or lance thrown AFTER their bow is cut, which is the
  // standard Ganguli combat beat and differentiates them without invention.
  dhrishtadyumna: 'holding a drawn sword, the blade that took Drona’s head',
  chekitana: 'holding a hero-slaying iron mace',
  uttara: 'holding an elephant-hook and a lance',
  shikhandi: 'holding a bow, sun-hued arrows nocked',
  satyaki: 'holding a great bow tall as a sala tree, a full quiver on his back',
  yuyutsu: 'holding a bow, a broad-headed arrow nocked',
  drupada: 'holding a gold-decked iron dart, his bow cut away',
  virata: 'holding a sheaf of ten lances',
  sweta: 'holding a gold-decked dart, his bow left behind on the car',
  dhrishtaketu: 'holding an iron dart with a golden staff',
  kekaya_brothers: 'holding bows, a full quiver each on their backs',
  // Bow is genuinely all the text supports for these. Their identity has to
  // come from elsewhere: the two below are stationed at Arjuna's chariot
  // wheels, which is their canonical role.
  yudhamanyu: 'holding a bow and gold-decked arrows',
  uttamaujas: 'holding a bow and gold-decked arrows',
  sankha: 'holding a bow, a full quiver of arrows on his back',
  kuntibhoja: 'holding a bow, a full quiver of arrows on his back',
  // --- Pandava core and the Upapandavas. Sauptika Parva 8 is the only place in
  // the epic that individuates Draupadi's five sons by weapon, and it is
  // unusually explicit, so all five come from that one night.
  abhimanyu: 'raising a chariot wheel overhead in both arms',
  iravan: 'holding a sword and a battle-axe',
  anjanaparvan: 'holding a scimitar decked with golden stars',
  prativindhya: 'holding a drawn bow, arrows nocked',
  sutasoma: 'holding an uplifted sword, a lance in his other hand',
  shrutakarma: 'holding a spiked iron bludgeon',
  // Sauptika has Shatanika lift a car-wheel too, but Abhimanyu's wheel is THE
  // image of the epic and two wheel cards would read as a duplicate. He keeps
  // the bow his brothers carry, which the text also supports.
  shatanika: 'holding a bow, a full quiver of arrows on his back',
  shrutasena: 'holding a drawn bow, pouring showers of arrows',

  // --- Kaurava allies. Several have the Ganguli beat of a dart or mace taken
  // up once the bow or the car is gone, which is what makes them drawable.
  bhagadatta: 'holding an iron elephant-hook, the ankusa',
  srutayudha: 'holding the mace Varuna gave him, hero-slaying',
  alayudha: 'holding a gigantic iron-bound parigha club',
  anuvinda: 'holding a mace, his car destroyed beneath him',
  jalasandha: 'holding a scimitar and a bull’s-hide shield decked with a hundred moons',
  jayadratha: 'holding a sword and a peacock shield hung with a hundred small bells',
  bhurishravas: 'holding an upraised sword',
  alambusha: 'holding a bow and the sword that beheaded Iravan',
  bahlika: 'holding a great bow and a gold-decked iron dart',
  sudakshina: 'holding a bow and an iron dart decked with bells',
  susharma: 'holding a bow, his bowstring worn as a girdle over kusa-grass robes',
  somadatta: 'holding a large bow, a full quiver of arrows on his back',
  vinda: 'holding a great bow, a full quiver of arrows on his back',
  vrishasena: 'holding a bow, a full quiver of arrows on his back',

  // --- Kaurava core.
  bhishma: 'holding a huge longbow six cubits long, an arrow nocked',
  // Gandhari over his corpse, Stri XXIII: "The handle of the bow is yet in his
  // grasp. The leathern fences, O Madhava, still encase his fingers."
  drona: 'holding a bow, worn leather fences encasing his fingers',
  // Sauptika VI-VIII, the night raid: Mahadeva enters him and gives him the
  // sword. This is far better than the bow I had left him without.
  ashwatthama: 'holding a gold-hilted celestial sword and a shield of a thousand moons',
  // Shalya IX: "The mace of Shalya, wrapped round with a resplendent cloth of
  // gold that looked like a sheet of fire."
  shalya: 'holding an iron mace wrapped in a cloth of gold',
  kritavarma: 'holding a formidable bow, its staff decked with gold',
  kripa: 'holding a bow, a full quiver of arrows on his back',
  // Stri XIX, Gandhari: his broad palm "cased in leathern fence, and scarred by
  // constant wielding of the bow".
  vikarna: 'holding a bow, his palm cased in a scarred leather fence',
  chitrasena: 'holding a bow, the model of all bowmen',
  // Drona XIV gives him shield and sword once unhorsed, which is the only thing
  // that separates him from three identical brothers.
  vivimsati: 'holding a sword and a shield, his horse gone',
  durmukha: 'holding a large bow, a full quiver of arrows on his back',
  dushasana: 'holding a bow, a full quiver of arrows on his back',
  // Udyoga CLXI is literally the Uluka Dutagamana Parva. He is the herald.
  uluka: 'holding a bow slung and a message in his hand',

  // --- Asuras, from the Ramayana, the Devi Mahatmya and the Puranas.
  ravana: 'holding a great bow, the curved sword Chandrahasa at his belt',
  kumbhakarna: 'holding a huge sharp iron pike, a shula',
  indrajit: 'holding a gold-adorned bow, serpent-arrows nocked',
  hiranyakashipu: 'holding a heavy mace',
  hiranyaksha: 'holding a massive mace',
  mahishasura: 'holding a sword and shield',
  shumbha: 'holding a scimitar and a shield blazoned with a hundred moons',
  nishumbha: 'holding a sharp scimitar and a glittering shield',
  raktabija: 'holding a heavy iron club',
  tarakasura: 'holding a great spear',
  narakasura: 'holding a spear',
  // Bali's war gear is a scattergun (bow, shakti, shula, prasa). His ICONIC
  // image is the other moment: pouring the water of the gift that undoes him.
  bali: 'holding a water-pot, poised to pour the water of the gift',
  // Rig Veda 1.32.7: "Footless and handless still he challenged Indra." The
  // Vedic Vritra has no hands to hold anything. The vajra is INDRA'S, not his.
  vritra: 'holding a great trident',
  // A devotee, not a combatant. Bhagavata 7.9.4 has him prostrate with folded
  // palms. Arming him would be the single most wrong thing on this card.
  prahlada: '',

  // --- Legend tier.
  // The epic says outright that if Jarasandha had held his mace, "the very gods
  // with Indra at their head could not have slain him" (Drona CLXXX). He is
  // wrestled to death only because he had already been parted from it.
  jarasandha: 'holding a heavy iron mace in both hands',
  // Ganguli gives Balarama ONLY the plough, ten times over, as a formula:
  // "the hero having the plough for his weapon". The pestle is Bhagavata
  // 10.79.5, where he uses both in a single action. He carries both.
  rukmi: 'holding an ornate golden celestial longbow, unstrung',
  // NOT canon, and knowingly so. Barbarika does not appear in the Mahabharata
  // at all (zero hits across all four Ganguli volumes); he is Skanda Purana,
  // Kaumarika-khanda 60-66, where he has a bow, inexhaustible quivers and a
  // sword from the goddess. The THREE ARROWS are not in that text either: they
  // are Rajasthani Khatushyamji devotional tradition. Kept anyway, because it
  // is the iconography a viewer will actually recognise, but labelled.
  barbarika: 'holding a bow with three arrows and nothing else in his quiver',
  // LOW: he has no signature weapon. He never lifts one at the Rajasuya and is
  // unarmed when Krishna beheads him; his only weapon scene is failing to
  // string the bow at Draupadi's svayamvara. His real cue is the vestigial
  // third eye, so the weapon stays plain on purpose.
  shishupala: 'holding a great bow he strains at and cannot string',
};

// Last resort, for the two generic infantry cards and anyone the epic never
// arms explicitly. A chariot-fighter with a bow is a reasonable default; it is
// just not a substitute for knowing.
const WEAPON_FALLBACK: Record<string, string> = {
  ratha: 'holding a war-bow, a full quiver of arrows on his back',
  gaja: 'holding a long iron war-lance braced across his body',
  padati: 'holding an iron spear and a round bossed shield',
};

const FACE: Record<string, string> = {
  pandava: 'calm focused expression',
  kaurava: 'hard contemptuous expression',
  asura: 'teeth bared in a snarl',
  legend: 'level unreadable expression',
  neutral: 'grim expression',
};

// Rule 7: three elements, no hue on air. Values on named weather objects only.
const SCENE: Record<string, string> = {
  pandava: 'Stormy battlefield, dark thunderclouds, lightning',
  kaurava: 'Burning battlefield, rolling smoke, broken banners',
  asura: 'Ruined battlefield at night, drifting embers, shattered stone',
  legend: 'Empty battlefield, drifting ash, one broken banner',
  neutral: 'Dusty battlefield, drifting smoke, distant fires',
};

// ------------------------------------------------------------------ banners
// The dhvaja is the best fix for a roster where 67 of 81 units are chariot
// archers who would otherwise all hold the same bow. Every emblem below is
// attested in the Ganguli translation, from the three passages where the epic
// systematically inventories standards: Virata Parva LV/LVII-LVIII, Bhishma
// Parva XVI-XVII, and Drona Parva XXIII (Pandava) and CIV (Kaurava), where
// Dhritarashtra asks outright to have the standards described.
//
// NOT INVENTED. Anyone the epic does not give a device falls back to a house
// standard rather than getting a plausible guess. Dushasana's standard is cut
// down repeatedly and never described; Bhagadatta's likewise, though his
// elephant Supratika IS named.
//
// Duryodhana's serpent banner, which is all over fan wikis and folk art, is
// NOT in the epic. All three catalogue passages give him a jewelled elephant.
const BANNER: Record<string, string> = {
  arjuna: 'a golden ape with a lion’s tail',
  bhishma: 'a golden palmyra palm and five stars on a silver staff',
  yudhishthira: 'a golden moon circled by planets, two kettledrums lashed to the staff',
  bhima: 'a giant silver lion with lapis-blue eyes',
  nakula: 'a gold-backed sarabha, the eight-legged beast',
  sahadeva: 'a silver swan hung with small bells',
  karna: 'a gold elephant-girth rope set with pearls',
  duryodhana: 'an elephant worked in gems, tinkling with a hundred bells',
  drona: 'a golden altar with a water-pot and bow, a black deerskin waving from the top',
  ashwatthama: 'a golden lion’s tail',
  kripa: 'a great bovine bull',
  abhimanyu: 'a karnikara flower in pure gold',
  jayadratha: 'a silver boar on a silver staff, decked with golden chains',
  bhurishravas: 'a golden sacrificial stake',
  vrishasena: 'a golden peacock caught mid-cry',
  ghatotkacha: 'a vulture',
  uttara: 'a lion',
  balarama: 'a palmyra palm',
  kekaya_brothers: 'five red standards together',
  // MEDIUM. Drona CIV gives Shalya "an image like the presiding goddess of
  // corn"; the golden ploughshare in the adjacent sentence is Ganguli's
  // punctuation, but plough and furrow-goddess pair naturally.
  shalya: 'the corn-goddess with a golden ploughshare',
  // Draupadi's five sons carry images of Dharma, Marut, Sakra and the twin
  // Ashwins (Drona XXIII). The epic names the group, not who carries which;
  // this follows the standard father-order and is an INFERENCE, not canon.
  prativindhya: 'the image of Dharma',
  sutasoma: 'the image of Marut, lord of winds',
  shrutakarma: 'the image of Sakra, lord of thunder',
  shatanika: 'the image of an Ashwin horseman',
  shrutasena: 'the image of an Ashwin horseman',
};
// Full phrases, not emblems: "a war-standard bearing the gold standard" reads
// as a standard carrying a standard. These slot in whole.
const HOUSE_BANNER: Record<string, string> = {
  pandava: 'A tall plain white war-standard',
  kaurava: 'A tall plain gold war-standard',
  asura: 'A tall ragged black war-standard',
  legend: 'A tall plain grey war-standard',
  neutral: 'A tall plain war-standard',
};

// -------------------------------------------------------------------- mounts
// Beside or behind, never ridden. The board's rows are literally chariot,
// elephant and infantry, so the mount reinforces the game's own structure, but
// a man ON an elephant at 51px is a speck. Put the animal's head in frame and
// keep his face readable.
const MOUNT: Record<string, string> = {
  ratha: 'a war-chariot behind him',
  gaja: 'a great war-elephant beside him, its head and trunk filling one side',
  padati: '',
};

const SKIN: Record<string, string> = {
  pandava: 'Deep bronze skin',
  kaurava: 'Deep bronze skin',
  asura: 'Ashen grey skin',
  legend: 'Deep bronze skin',
  neutral: 'Deep bronze skin',
};


// ============================================================================
// VARIATION
//
// One prompt per card produced one LOOK per card: every warrior in the same
// stance, the same scarf, the same white dhoti, under the same thunderstorm.
// At 103 cards that reads as a template with the names swapped.
//
// So the incidental slots draw from pools instead of constants. Two rules make
// it safe:
//
//   1. DETERMINISTIC, never random. The pick is a hash of (card id + slot
//      name), so regenerating this file never changes a prompt you have
//      already made art from, and two slots on the same card do not correlate.
//   2. CANON ALWAYS WINS. Anything in the marquee table overrides the pool.
//      Age, build, complexion and distinguishing marks are NOT varied at all:
//      Ghatotkacha stays bald and rotund, Bhishma stays white-bearded, Drona
//      stays eighty-five. Only the incidentals move.
//
// House still constrains the palettes, so a Kaurava does not come back in
// Pandava blue. Variety WITHIN identity, not instead of it.
// ============================================================================

/** Stable hash of a card id plus a slot name, so slots decorrelate. */
function vary<T>(id: string, slot: string, pool: readonly T[]): T {
  let h = 2166136261;
  const key = `${id}:${slot}`;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return pool[(h >>> 0) % pool.length];
}

const STANCE_POOL = [
  'in a wide battle stance',
  'in a planted, braced stance',
  'mid-stride, advancing',
  'one foot set on a broken chariot wheel',
  'standing at his full height, feet apart',
  'half-turned, weight on his back foot',
  'in a low crouch, ready to spring',
  'standing square and unmoving',
  'leaning forward, shoulders set',
] as const;

/** An eighty-five-year-old Drona does not crouch ready to spring. Stance has to
 *  respect the age the canon slots already fixed, or the variation contradicts
 *  the very thing it is forbidden to touch. */
const ELDER_STANCE_POOL = [
  'standing square and unmoving',
  'standing at his full height, feet apart',
  'in a planted, braced stance',
  'straight-backed and still',
  'half-turned, weight on his back foot',
] as const;
const YOUTH_STANCE_POOL = [
  'mid-stride, advancing',
  'in a low crouch, ready to spring',
  'leaning forward, shoulders set',
  'in a wide battle stance',
  'one foot set on a broken chariot wheel',
] as const;
const AGED = /\bold\b|aged|eighty|venerable|white-bearded|white beard|grey beard|eldest/i;
const YOUNG = /\bboy\b|youth|youthful|child|young|beardless/i;

const FACING_POOL = [
  'turned three-quarters to his right',
  'turned three-quarters to his left',
  'squarely facing the viewer',
  'squarely facing the viewer, head slightly turned',
  'in near profile, gaze off to one side',
  'head lowered, eyes up at the viewer',
] as const;

/** Expression stays house-flavoured: a Kaurava should not smile like a Pandava. */
const FACE_POOL: Record<string, readonly string[]> = {
  pandava: ['calm focused expression', 'eyes narrowed in cold anger', 'jaw set and unafraid',
            'a grave, steady look', 'lips parted, breathing hard'],
  kaurava: ['hard contemptuous expression', 'a curled sneer', 'cold and measuring',
            'brows drawn, furious', 'proud and unsmiling'],
  asura: ['teeth bared in a snarl', 'roaring, mouth wide open', 'a wide cruel grin',
          'eyes burning, jaw clenched', 'silent and hungry'],
  legend: ['level unreadable expression', 'looking past you into the distance',
           'weary but resolute', 'calm to the point of coldness'],
  neutral: ['grim expression', 'set and watchful'],
};

const METAL_POOL: Record<string, readonly string[]> = {
  pandava: ['Engraved gold armour', 'Polished silver-white armour chased with gold',
            'Bright bronze armour inlaid with gold', 'Blue-lacquered armour banded with gold'],
  kaurava: ['Engraved dark iron armour banded with gold', 'Deep crimson-lacquered armour with brass fittings',
            'Blackened steel armour chased with copper', 'Heavy bronze armour darkened with age'],
  asura: ['Engraved blackened bronze armour', 'Green-lacquered armour banded with dark iron',
          'Rough unpolished dark scale armour', 'Ash-grey iron armour with bone fittings'],
  legend: ['Engraved silver armour', 'Plain burnished steel armour', 'Weathered grey-green bronze armour'],
  neutral: ['Engraved bronze armour', 'Plain iron armour'],
};

/** The COVERAGE is what keeps chests covered (rule 3), so every variant still
 *  names chest, shoulders, forearms and shins. Only the construction changes. */
const PLATES_POOL = [
  'sculpted breastplate, layered pauldrons, vambraces, greaves and a jewelled belt',
  'scale-mail cuirass, broad shoulder-guards, forearm bracers, shin-plates and a wide war-belt',
  'lamellar corselet laced with cord, heavy pauldrons, vambraces, greaves and a studded belt',
  'banded chest-plate, ridged shoulder-cops, arm-guards, greaves and a knotted sash-belt',
  'embossed cuirass with a lion-face boss, layered shoulder-plates, bracers, greaves and a gem-set belt',
  'quilted coat sewn with iron plates, shoulder-guards, vambraces, greaves and a leather war-belt',
] as const;

const TUNIC_POOL: Record<string, readonly string[]> = {
  pandava: ['a dark blue tunic', 'a deep indigo tunic', 'a cream tunic', 'a slate-grey tunic'],
  kaurava: ['a deep crimson tunic', 'a maroon tunic', 'a black tunic', 'a burnt-orange tunic'],
  asura: ['a black tunic', 'a dark green tunic', 'a rust-brown tunic'],
  legend: ['a grey tunic', 'an undyed linen tunic'],
  neutral: ['a russet tunic', 'a dun tunic'],
};

/** Empty entries are deliberate and weighted: most warriors wear NO scarf.
 *  Everyone billowing the same white scarf was half the cookie-cutter look. */
const DRAPE_POOL = [
  '', '', '', '', '', '',
  'A billowing white battle scarf',
  'A billowing dark ochre battle scarf',
  // Indian drape, not European. A cloak clasped at the throat is the same
  // wrong-civilisation error as the boots were.
  'A crimson uttariya thrown back over one shoulder',
  'A heavy dark angavastram draped across the chest',
  'A long sash knotted at the hip, ends flying',
  'A coarse wool shawl over one shoulder',
  'A gold-bordered uttariya wound across the torso',
] as const;

const DHOTI_POOL = ['white dhoti', 'cream dhoti', 'saffron dhoti', 'deep red dhoti',
                    'undyed dhoti', 'dark blue dhoti', 'ochre dhoti'] as const;

/** NO BOOTS. "Heavy boots" and "shin-boots" are European kit and the model drew
 *  exactly that: an ancient Indian warrior in medieval footwear. Ancient India
 *  wore the paduka and the open sandal. "Toes visible" is the load-bearing
 *  phrase - without it the model reverts to a boot whatever noun you use. */
const FOOT_POOL = [
  'open-toed Indian warrior sandals with golden straps, toes visible beneath the greaves',
  'leather paduka sandals with plain straps, toes visible',
  'jewelled sandals with silver straps, toes visible',
  'sandals laced with crossed leather thongs to the ankle, toes visible',
  'plain wooden paduka, bare toes',
  'bare feet',
] as const;

/** Rule 7 still holds inside every one of these: no hue is ever named for the
 *  air. Weather objects and values only. */
const SCENE_POOL: Record<string, readonly string[]> = {
  pandava: ['Stormy battlefield, dark thunderclouds, lightning',
            'Dawn mist over a wide river, reeds bent flat',
            'A howling dust-storm, splintered shields in the air',
            'Heavy rain, the ground churned to mud',
            'A field of tall grass flattened by wind'],
  kaurava: ['Burning battlefield, rolling smoke, broken banners',
            'Night field lit by torches, long shadows',
            'A low red sun through haze, dust hanging',
            'A field of broken chariots and dead horses',
            'Ash falling steadily on a still field'],
  asura: ['Ruined battlefield at night, drifting embers, shattered stone',
          'A cracked plain under a starless sky',
          'Smoke pouring from a fissure in the ground',
          'A burnt forest, black trunks still standing'],
  legend: ['Empty battlefield, drifting ash, one broken banner',
           'A bare plain at first light',
           'Still water and reeds, nothing moving',
           'A cold mountain pass, snow on the rocks'],
  neutral: ['Dusty battlefield, drifting smoke, distant fires',
            'A trampled field under a flat grey sky'],
};

// ------------------------------------------------------- marquee characters
// Only what DIFFERS from the house default. Every override costs words against
// rule 1, so anything the house look already handles is left alone.
interface Marquee {
  banner?: string;
  facing?: string;
  camera?: string;
  mount?: string;
  stance?: string;
  skin?: string;
  face?: string;
  mark?: string;
  metal?: string;
  tunic?: string;
  cloth?: string;
  build?: string;
  scene?: string;
}
// Each Pandava's sky is his divine father's. Costs nothing, because `scene` is
// already a slot, and it makes five brothers in near-identical armour read as
// five different men.
const M: Record<string, Marquee> = {
  nishumbha: {
    mark: 'a second armed man bursting out of his pierced chest',
  },
  hiranyaksha: {
    mark: 'brown hair standing out stiff like swords, gold anklets',
  },
  hiranyakashipu: {
    skin: 'Molten-gold skin',
    mark: 'limbs of molten gold, skin still pitted where ants ate him',
  },
  durmukha: {
    mark: 'handsome despite his name, which means foul-faced',
  },
  kripa: {
    build: 'old and spare',
    mark: 'an old brahmana, white-haired, a sacred thread over the armour',
  },
  vivimsati: {
    mark: 'a smiling moon face, fine nose and fair brows, conspicuously young',
  },
  vikarna: {
    build: 'a youth',
    mark: 'the youngest-looking, his bow-palm scarred inside a leather fence',
  },
  dushasana: {
    mark: 'tawny yellow-brown eyes, handsome, massive arms',
  },
  shalya: {
    mark: 'a smooth moon-like face, lotus-petal eyes, brow drawn into three lines',
  },
  bahlika: {
    build: 'the eldest man on the field, still unbent',
    mark: 'the eldest man on the field, his face still unwithered',
  },
  vrishasena: {
    build: 'a young man',
    mark: 'youthful, barely past boyhood',
  },
  alayudha: {
    skin: 'Elephant-hide black skin',
    // Drona CLXXVI: "In form, he was more handsome than Ghatotkacha".
    // Contradicts the standard fanged-monster rakshasa depiction.
    mark: 'strikingly handsome for a rakshasa, jewelled armlets and diadem',
  },
  alambusha: {
    skin: 'Jet-black skin',
    mark: 'a heaped mass of black antimony, huge and dark',
  },
  jalasandha: {
    mark: 'body smeared with red sandal-paste, a blazing gold chain round his head',
  },
  sudakshina: {
    build: 'young and thick-necked',
    mark: 'young and bull-necked, arms like spiked maces, smeared with sandal',
  },
  anuvinda: {
    mark: 'bull-like eyes, gold armour and gold Angadas, twin to his brother',
  },
  vinda: {
    mark: 'bull-like eyes, gold armour and gold Angadas, twin to his brother',
  },
  jayadratha: {
    mark: 'his head shaved bald but for five tufts of hair',
  },
  bhurishravas: {
    mark: 'his right arm hacked away, blue-black locks, eyes red as a pigeon\'s',
  },
  sutasoma: {
    mark: 'a boy, a blue-lotus scimitar with an ivory handle at his belt',
  },
  shatanika: {
    mark: 'the youngest-looking of five brothers, still a boy',
  },
  iravan: {
    mark: 'a diadem and heavy ear-rings, handsome and young',
  },
  shikhandi: {
    mark: 'a powerful man, no softness in the face',
  },
  kekaya_brothers: {
    skin: 'Deep red skin',
    mark: 'five alike in scarlet mail, red weapons, skin red as cochineal',
  },
  dhrishtaketu: {
    build: 'of giant stature',
    mark: 'of giant stature, long fair locks and big earrings',
  },
  satyaki: {
    mark: 'long hair loose to the shoulder, heavy ear-rings',
  },
  sankha: {
    mark: 'burnished steel mail studded with a hundred golden eyes',
  },
  virata: {
    build: 'old and heavy-set',
    mark: 'an old king beneath a white umbrella',
  },
  drupada: {
    build: 'old but straight-backed',
    mark: 'an old king, white-bearded and straight-backed',
  },
  anjanaparvan: {
    build: 'hill-huge',
    skin: 'Jet-black skin',
    mark: 'hill-huge, jet black as a mass of antimony',
  },
  dhrishtadyumna: {
    skin: 'Fire-hued skin',
    mark: 'round cheeks, huge eyes, steel armour he was born wearing',
  },
  vritra: {
    // TWO TRADITIONS, and I had picked the wrong one for this game. Rig Veda
    // 1.32.7 has him "footless and handless", a serpent on the mountain, which
    // is what I built. But Mahabharata Santi Parva CCLXXXI has a humanoid
    // asura "like a mountain, full five hundred Yojanas in height and three
    // hundred in circumference" who whirls Indra and swallows him whole. This
    // is a Mahabharata game, so the Mahabharata Vritra wins, and he has hands.
    build: 'a mountain-shaped giant, vast beyond any man',
    mark: 'a mouth wide enough to swallow a god whole',
    face: 'jaws parted, eyes cold',
    scene: 'A withheld storm over dry riverbeds, no rain falling',
  },
  prahlada: {
    banner: '',
    skin: 'Warm brown skin',
    build: 'a boy of five',
    metal: 'Plain undyed cloth and no armour',
    tunic: 'no armour at all',
    cloth: 'Simple white dhoti, bare feet',
    mark: 'empty palms pressed together at his chest',
    face: 'serene, wholly unafraid',
    mount: '',
    camera: 'Eye-level camera, quiet and close.',
    scene: 'A pillared hall, lamps guttering',
  },
  mahishasura: {
    // The Mahishasuramardini composition: half out of the severed buffalo neck.
    build: 'a huge warrior emerging from the neck of a slain buffalo',
    mark: 'half issuing from the mouth of a great black buffalo',
  },
  raktabija: {
    mark: 'blood running from many wounds, each fallen drop rising as a duplicate',
  },
  narakasura: {
    // Bhagavata 10.59: Krishna beheads him while he rides an elephant.
    mount: 'a great war-elephant beside him, its head and tusks filling one side',
  },
  shumbha: {
    mark: 'eight arms lifted high, filling the sky',
  },
  shishupala: {
    // Sabha XLII: born with three eyes and four arms, which fall away in
    // Krishna's lap. The remnants are what make him drawable.
    // Sabha XLII: the third eye and two extra arms fall away in infancy on
    // Krishna's lap. The adult is an ordinary two-armed man, so the only
    // drawable cue is the copper-red eyes he shows in rage (Sabha XXXVII).
    mark: 'ordinary and two-armed, eyes copper-red with rage',
  },
  uttara: {
    mark: 'a frightened boy prince in heavy ear-rings',
    // Bhishma XLVII has him on a tusker, killed by Shalya's dart and falling
    // from the elephant's neck. The game files him under Ratha; canon wins here.
    mount: 'a great war-elephant beside him, its head and trunk filling one side',
    build: 'a slight young prince',
  },
  sahadeva: {
    scene: 'Battlefield at first light, low dawn mist',
    build: 'lithe and watchful',
    face: 'quiet knowing expression',
  },
  nakula: {
    skin: 'Coppery dark skin',
    mark: 'a leonine neck, red eyes, the handsomest man on the field',
    // Son of an Ashwin, the twin horsemen of dawn.
    scene: 'Battlefield at first light, low dawn mist',
    build: 'lithe and handsome',
  },
  yudhishthira: {
    // Vana Parva: "a complexion like that of pure gold, possessed of a
    // prominent nose and large eyes, and endued with a slender make".
    // He is the LEAST muscular of the five, not a broad heroic build.
    build: 'tall and slender',
    skin: 'Pale gold complexion',
    mark: 'a prominent nose, large eyes, long black hair beneath a golden crown',
    // Son of Dharma/Yama: no wind, no drama, judgement.
    scene: 'Still grey battlefield, falling ash, dead air',
    face: 'calm sorrowful expression',
  },
  bhagadatta: {
    build: 'very old, still broad',
    mark: 'very old, a cloth turban over white hair, a gold garland on it',
    // Supratika is named in the epic (Bhishma XCVI); his BANNER device never is.
    mount: 'the great war-elephant Supratika beside him, its head and tusks filling one side',
  },
  arjuna: {
    mark: 'curly black hair beneath a golden diadem, forearms scarred by the bowstring',
    skin: 'Blue-grey skin',
  },
  bhima: {
    build: 'hyper-muscular',
    metal: 'Engraved black armour hung with heavy gold chains',
    tunic: 'a black tunic', // the blue belongs on the loincloth, not twice over
    mark: 'tall as a sala tree, long-armed, bitten lip and three deep furrows across his brow',
    face: 'screaming, teeth bared',
    cloth: 'Torn blue loincloth, heavy leather paduka sandals with dark straps, toes visible',
    scene: 'Ruined battlefield, flying dust, rock debris',
  },
  karna: {
    build: 'broad-chested, arms like elephant trunks',
    skin: 'Sun-gold skin, unscarred',
    // Sun-born, and the kavacha is golden. The Kaurava dark-iron default put
    // him in the wrong metal on the wrong field, which lost the whole reading.
    metal: 'Engraved gold armour',
    mark: 'leonine eyes, bull shoulders, huge ornate golden earrings',
    face: 'grim resolute expression',
    scene: 'Dusty battlefield under a low sun, drifting smoke, distant broken chariots',
  },
  bhishma: {
    skin: 'Pale skin',
    scene: 'Battlefield beside a wide river, drifting mist',
    camera: 'Slightly low camera angle, grave and monumental.',
    build: 'tall and straight-backed',
    mark: 'dressed wholly in white, white turban and white mail, an old man',
    face: 'expression heavy with sorrow',
  },
  drona: {
    build: 'lean and old, still upright',
    skin: 'Dark skin',
    camera: 'Eye-level camera.',
    mark: 'eighty-five years old, white locks to his ears, a grabbable topknot',
    face: 'cold measuring expression',
  },
  duryodhana: {
    mark: 'enormous thighs like plantain stems, a heavy jewelled crown',
  },
  ashwatthama: {
    skin: 'Pale lotus-coloured skin',
    // Adi Parva calls it "the jewel-like excrescence on his head": a growth
    // he was born with, not a jewel someone set into him.
    mark: 'a jewel-like growth on his brow he was born with, a leonine neck',
    face: 'wild-eyed and snarling',
  },
  ghatotkacha: {
    mount: '',
    build: 'a towering tusked half-rakshasa',
    skin: 'Dark grey skin',
    mark: 'a wild black mane',
  },
  abhimanyu: {
    camera: 'High camera angle looking down at him, hemmed in and overwhelmed.',
    build: 'a beardless youth, slight beside grown men',
    mark: 'a boy\'s moon-round face, raven-black lashes, three conch-lines on his neck',
    scene: 'A closing ring of spears and shields on every side',
  },
  shakuni: {
    mount: '',
    camera: 'Eye-level camera, close and conspiratorial.',
    // Ganguli gives Shakuni no physical description whatsoever, and the
    // famous limp is NOT in it: zero hits for lame/limp/crooked/deformed
    // near his name across all four volumes. That is the TV serial. He
    // fights normally from a chariot. 'Lean' is a design choice, not canon.
    build: 'lean and sharp-featured',
    metal: 'Rich unarmoured court silks with rings on every finger',
    tunic: 'no armour at all',
    mark: 'a thin smile, grey hair',
    face: 'smiling, eyes cold with calculation',
  },
  ravana: {
    skin: 'Dark lapis-blue skin chased with gold',
    build: 'a colossal rakshasa king',
    mark: 'ten crowned heads and twenty arms, white teeth, chest gouged by an elephant\'s tusk',
    face: 'all ten faces roaring at once',
  },
  kumbhakarna: {
    mount: '',
    build: 'a mountainous tusked giant',
    mark: 'half-shut eyes heavy with sleep, nostrils a man could crawl through',
  },
  indrajit: {
    mark: 'half-dissolved into thundercloud, only his bow solid',
    face: 'serene merciless expression',
  },
  krishna_charioteer: {
    mount: '',
    camera: 'Eye-level camera, calm and steady.',
    // The peacock feather belongs HERE and nowhere else. Putting it on Arjuna
    // is what produced the calendar art we spent a week blaming on his name.
    metal: 'Flowing yellow silks and no armour',
    tunic: 'no armour at all',
    skin: 'Blue skin',
    mark: 'a peacock feather in his crown',
    face: 'serene, faintly smiling',
  },
  barbarika: {
    mark: 'three arrows and nothing else in his quiver',
    face: 'calm, already resigned',
  },
  jarasandha: {
    build: 'immense and thick-limbed',
    // Sabha XXIII. The two halves are the INFANT; no seam is ever described
    // on the adult. The seam I had here was invented.
    mark: 'his crown set aside, hair bound up in a wrestler’s knot',
  },
  balarama: {
    mount: '',
    skin: 'Fair skin',
    mark: 'fair-skinned in blue silk, eyes red-rimmed with wine',
    face: 'turned away, refusing the field',
  },
  ekalavya: {
    skin: 'Dark skin',
    metal: 'Plain forest dress and no armour',
    tunic: 'no armour at all',
    mark: 'dark-skinned, body caked in filth, matted locks, black rags',
    face: 'unbowed, jaw set',
  },
};

// ------------------------------------------------------------ astras & fates
// No figure, so these get the whole budget for the phenomenon itself.
const PHENOMENON: Record<string, string> = {
  // The named weapons. Objects, not events: each one is a thing a hand holds,
  // so it is described as a thing rather than as something happening.
  asi: 'Asi, the first sword ever forged: a single straight double-edged blade rising point-upward, lac-red fire running its length, a ring of white flame at the guard',
  gandiva: 'Gandiva, the bow Varuna gave: a single immense war bow held upright and strung, its limbs bound in gold and silver and carved with running water, one arrow of white fire nocked and pointing upward',
  kaumodaki: 'Kaumodaki, the mace Varuna gave Krishna: a single heavy mace standing upright, its head a fluted globe banded in brass and indigo, a peal of thunder drawn as hard concentric rings breaking outward from it',
  chandrahasa: 'Chandrahasa, the moon-laughter sword Shiva gave Ravana: a single curved blade rising point-upward, a thin silver crescent set into the pommel, cold blue-white light along the cutting edge, a serpent coiled at the grip',
  vajra: 'Vajra, the thunderbolt cut from the bones of Dadhichi: a single bolt held upright, a ribbed grip of white bone flaring into a cage of curved prongs at each end, arcs of amber light leaping between the tips',
  parasu: 'Parasu, the axe Shiva gave Parashurama: a single great battle-axe rising upright, a broad crescent blade of lac red and brass on a long haft, the edge burning white, a trident cut into the flat of the blade',
  praswapa: 'A Praswapa, the sleep Prajapati gave: one great lotus of pale gold closed tight for the night, eight small flames standing motionless in a ring around it',
  samvodhana: 'A Samvodhana, the waking Prajapati gave alongside the sleep: a great brass bell struck and still ringing, hard rings of sound breaking outward from its lip, a lotus opening beneath it',
  prajna: 'A Prajna, the weapon of wakefulness that no stupor can close: a single tall lamp of white and brass fire that will not gutter, rings of small burning script in orbit around its flame',
  tvashtra: 'A Tvashtra, the weapon of the divine artificer: one rising arrow becoming three identical arrows, and those three becoming nine, each rank fainter and cooler than the rank in front of it',
  antardhana: 'An Antardhana, the arrow Shiva loosed to unmake the three cities: a rising shaft strung with three burning fortress-cities like beads, a thin silver crescent above them where the arrowhead would be',
  pashupatastra: 'A Pashupatastra, the weapon of Shiva, carrying his signs: a rising arrow becoming a great three-pronged trident, a thin silver crescent caught between its prongs, green-black serpents coiled down the shaft, ash-white fire along every edge',
  brahmashirsha: 'A Brahmashirsha, the Brahmastra raised past recall: four lotuses of saffron and gold fused into a single flower facing the four quarters, every petal a blade, a column of white fire driven up through its centre',
  brahmastra: 'A Brahmastra, the weapon of Brahma, carrying his sign the lotus: a rising arrow becoming one great open lotus of deep saffron and rose, every petal edged like a blade, a ring of white fire turning behind it',
  narayanastra: 'A Narayanastra, the weapon of Vishnu, carrying his sign the discus: one blazing indigo and gold discus at the centre, innumerable smaller discs and spears streaming outward from it in every direction, each trailing fire',
  vaishnavastra: 'A Vaishnavastra, the weapon of Vishnu: one immense discus seen edge-on, deep indigo at the hub and white-hot at the rim, that rim a continuous ring of curved blades, a gold lotus at its centre, spinning fast enough to blur',
  vasavi_shakti: 'A Vasavi Shakti, the dart Indra gave for one throw only, carrying his sign the thunderbolt: a single barbed spear rising point-upward, its shaft a braided vajra of amber lightning, arcs leaping between the barbs',
  nagastra: 'A Nagastra, the serpent weapon: a rising arrow becoming a mass of green-black serpents, hoods spread wide, amber-scaled, coiled hard around one another',
  sauparna: 'A Sauparna, the Garuda weapon: a rising arrow becoming a vast pair of outspread wings of white and copper fire, talons closing on a green serpent beneath them',
  agneyastra: 'An Agneyastra, the weapon of Agni: a wall of orange and white-hot fire rising, its crest breaking into seven distinct tongues, a pair of spiralling ram horns of white flame in the heart of it',
  varunastra: 'A Varunastra, the weapon of Varuna, carrying his sign the noose: a rising coil of deep blue-green water lit from within, a great noose of white foam turning at its heart, the whole column crested and breaking',
  vayavyastra: 'A Vayavyastra, the weapon of Vayu: a rising funnel of pale grey-green wind, its walls scored into blade-edges, a torn banner whipping at the crown of it',
  aindrastra: 'An Aindrastra, the weapon of Indra: a dense sheaf of arrows rising point-upward in a solid column, every shaft a thread of white lightning, an amber vajra burning at the core of the mass',
  bhargavastra: 'A Bhargavastra, the weapon of Parashurama of the Bhrigus: a rising arrow becoming countless arrows in a widening fan, a great red-gold axe burning at the origin of them',
  sammohana: 'A Sammohana, the weapon that leaves an army standing and dreaming: a slow spiral of pale indigo light turning in on itself, ring within ring, each ring drifting out of true with the next',
  brahmas_bargain: 'Two asura brothers kneeling before a four-faced god, one boon between them, each already watching the other',
  kunti_invocation: 'A woman with closed eyes speaking a mantra, a god half-formed in the air above her',
  surya_kavacha: 'Golden armour and earrings glowing with sunlight, worn by no one, floating in darkness',
  ashwins_draught: 'Twin physician-gods pouring a luminous draught, horses behind them',
  vayu_fury: 'A gale tearing across a battlefield, banners and men going over together',
  yama_summons: 'A dark lord of death holding a noose and a ledger, tallying the field',
  ashwatthama_elephant: 'A war elephant falling in smoke, a lie taking shape above it',
  // A boon, not a unit, so the marquee table above never sees him. The peacock
  // feather belongs here and on no other card in the set.
  krishna_charioteer:
    'A blue-skinned charioteer in flowing yellow silks and no armour, a peacock ' +
    'feather in his crown, holding the reins and a white conch, serene and faintly smiling',
};

/** Cards whose subject IS a person. "No human figure" was being stamped on a
 *  queen, a woman speaking a mantra, twin gods and a lord of death. */
const HAS_FIGURE = new Set([
  'krishna_charioteer',
  'brahmas_bargain',
  'kunti_invocation',
  'ashwins_draught',
  'yama_summons',
]);

// ------------------------------------------------------------------- builder
function hookOf(card: U): string {
  const flavor = (card.flavor ?? '').split(/(?<=\.)\s/)[0] ?? '';
  return flavor.replace(/\s+/g, ' ').trim().replace(/\.$/, '');
}

/** The character half of a prompt: everything except the style sentence. */
function bodyOf(card: U): string {
  if (card.type !== 'unit') {
    const p = PHENOMENON[card.id] || hookOf(card) || card.name;
    const figure = HAS_FIGURE.has(card.id) ? '' : 'No human figure. ';
    const emissive = EMISSIVE_TYPES.has(card.type);
    const merge = MERGES.has(card.id) ? ` ${MERGE}` : '';
    if (emissive) {
      // One framing sentence, not two. FRAME's "clear margin, nothing cropped"
      // and the scale rule's "generous black margin" were saying the same
      // thing twice in the same prompt.
      return `${p}. ${EMBLEM_ONLY} ${ON_BLACK}${merge} ${FRAME_EMISSIVE} ${RIM} ${NEG_EMISSIVE}`;
    }
    return `${p}. ${figure}${CAMERA_SCENE} ${FRAME('Whole subject')} ${NEG}`;
  }

  const m = M[card.id] ?? {};
  const tier = card.tier ?? 'rathi';
  const row = card.rows[0] ?? 'padati';

  const camera = m.camera ?? CAMERA[tier] ?? CAMERA.rathi;
  // Resolve build and mark FIRST: the stance pool depends on how old the canon
  // says he is. Varying stance blind put a white-bearded king in a crouch.
  const build0 = m.build ?? BUILD[tier] ?? BUILD.rathi;
  const mark0 = m.mark ?? MARK[tier] ?? MARK.rathi;
  const age = `${build0} ${mark0}`;
  const stancePool = AGED.test(age) ? ELDER_STANCE_POOL : YOUNG.test(age) ? YOUTH_STANCE_POOL : STANCE_POOL;
  const stance = m.stance ?? vary(card.id, 'stance', stancePool);
  const facing = m.facing ?? vary(card.id, 'facing', FACING_POOL);
  const weapon: string =
    WEAPON_BY_ID[card.id] ?? WEAPON_FALLBACK[row] ?? WEAPON_FALLBACK.padati;
  // An explicit '' means the character canonically holds nothing.
  const skin = m.skin ?? SKIN[card.house] ?? SKIN.neutral;
  const face = m.face ?? vary(card.id, 'face', FACE_POOL[card.house] ?? FACE_POOL.neutral);
  const mark = mark0;
  const metal = m.metal ?? vary(card.id, 'metal', METAL_POOL[card.house] ?? METAL_POOL.neutral);
  const tunic = m.tunic ?? vary(card.id, 'tunic', TUNIC_POOL[card.house] ?? TUNIC_POOL.neutral);
  // Drape is often nothing at all. Dhoti and footwear vary independently, so
  // two men in the same armour still read as different people.
  const drape = vary(card.id, 'drape', DRAPE_POOL);
  const cloth =
    m.cloth ??
    [drape, `${vary(card.id, 'dhoti', DHOTI_POOL)}`, vary(card.id, 'foot', FOOT_POOL)]
      .filter(Boolean)
      .join(', ')
      .replace(/^([a-z])/, (c) => c.toUpperCase());
  const build = build0;
  const scene = m.scene ?? vary(card.id, 'scene', SCENE_POOL[card.house] ?? SCENE_POOL.neutral);
  const emblem = BANNER[card.id];
  const banner =
    m.banner !== undefined
      ? m.banner
      : emblem
        ? `A tall war-standard bearing ${emblem}`
        : (HOUSE_BANNER[card.house] ?? HOUSE_BANNER.neutral);
  const mount = m.mount ?? MOUNT[row] ?? '';

  // The unarmoured (Shakuni, Krishna, Ekalavya) skip the coverage list, which
  // would otherwise put a breastplate on a man in court silks.
  // Commas, not "with ... with ...". Metals that already carry a "banded with
  // gold" clause were producing a doubled preposition on every armoured card.
  const plates = vary(card.id, 'plates', PLATES_POOL);
  const armour = tunic === 'no armour at all' ? `${metal}.` : `${metal}, ${plates}, over ${tunic}.`;

  // A few characters canonically hold nothing (Vritra has no hands at all;
  // Prahlada has his palms together). They must not inherit a battle stance, a
  // war-standard, or a frame guard promising a weapon that is not there.
  const opening = weapon
    ? `${card.name}, ${build}, ${stance}, ${facing}, ${weapon}.`
    : `${card.name}, ${build}, ${facing}.`;
  const bannerClause = [banner, mount].filter(Boolean).join(', and ');
  return (
    `${opening} ` +
    `${skin}, ${face}, ${mark}. ` +
    `${armour} ${cloth}. ${scene}. ` +
    (bannerClause ? `${bannerClause}. ` : '') +
    `${camera} ` +
    `${FRAME(weapon ? 'Full figure from head to feet, entire weapon' : 'Whole figure')} ${NEG}`
  );
}

const cards = allCards() as U[];
const GROUPS: { title: string; match: (c: U) => boolean }[] = [
  { title: 'The Pandava Host', match: (c) => c.type === 'unit' && c.house === 'pandava' },
  { title: 'The Kaurava Host', match: (c) => c.type === 'unit' && c.house === 'kaurava' },
  { title: 'The Asura Host', match: (c) => c.type === 'unit' && c.house === 'asura' },
  { title: 'Those Who Stood Apart', match: (c) => c.type === 'unit' && c.house === 'legend' },
  { title: 'Astras', match: (c) => c.type === 'astra' },
  { title: 'The Named Weapons', match: (c) => c.type === 'shastra' },
  { title: 'Stratagems', match: (c) => c.type === 'stratagem' },
  { title: 'Vardaan and Fates', match: (c) => c.type === 'boon' || c.type === 'curse' },
];

// Every card must land in exactly one group. Six shastras and one stratagem
// had no group and vanished from the document, while the header went on
// claiming all 114 were present, because the count came from the card list
// rather than from what was written. A card silently missing its prompt is
// invisible until someone goes looking for art that was never commissioned.
const uncovered = cards.filter((c) => !GROUPS.some((g) => g.match(c)));
if (uncovered.length) {
  throw new Error(
    `${uncovered.length} card(s) match no group in GROUPS, so they would emit no prompt: ` +
      uncovered.map((c) => `${c.id} [${c.type}]`).join(', '),
  );
}

const out: string[] = [];
let longest = 0;
let longestWords = 0;
let overWords = 0;
let emitted = 0;

const wordsIn = (s: string) => s.trim().split(/\s+/).length;

out.push('# Kurukshetra: card art prompts');
out.push('');
out.push(`${cards.length} prompts, generated from the live card data. Regenerate with \`npx vite-node sim/build-art-prompts.ts\`.`);
out.push('');
out.push('Generated for **meta.ai**, which honours negated qualities. Firefly does not, and caps prompts at 1024 characters.');
out.push('');
out.push('## Where the files go');
out.push('');
out.push('Save each image as the card id shown above its prompt, into:');
out.push('');
out.push('```');
out.push('src/assets/art/cards/<card_id>.png');
out.push('```');
out.push('');
out.push('So Arjuna is `src/assets/art/cards/arjuna.png`. `png`, `webp`, `jpg` and `avif` all work. Art resolves by convention, so a file dropped in that folder appears on its card with no code change and nothing to register. A card with no file keeps its placeholder glyph, so a half-finished set degrades quietly.');
out.push('');
out.push('**Aspect ratio: 4:5 portrait.** Measured, not assumed: the art slot is `flex: 1`, so its shape is whatever is left after the card header and footer, and that varies with card size. It is 35x43.8 (exactly 4:5, nothing cropped) on a codex card and 51x50 (square, 20% of the height cropped) on a hand card. Where it does crop, the loss is biased downward so it falls on the legs rather than the crown. Tapping a card shows the whole image uncropped at 192x240.');
out.push('');
out.push('## Banners');
out.push('');
out.push('The dhvaja is what stops 67 chariot archers looking like the same man. Every emblem used here is attested in the Kisari Mohan Ganguli translation, from the passages where the epic inventories standards: Virata Parva LV and LVII-LVIII, Bhishma Parva XVI-XVII, and Drona Parva XXIII (Pandava side) and CIV (Kaurava side), where Dhritarashtra asks outright to have the standards described.');
out.push('');
out.push('Anyone the epic gives no device gets a plain house standard instead of a plausible guess. Dushasana\'s standard is cut down repeatedly and never described; the same is true of Bhagadatta, though his elephant Supratika **is** named.');
out.push('');
out.push('One trap worth recording: **Duryodhana\'s serpent banner is not in the epic.** It is everywhere in fan wikis and folk art, and all three catalogue passages give him a jewelled elephant instead.');
out.push('');
out.push('## What testing taught us');
out.push('');
out.push('Three of these corrected an earlier rule that was wrong. The corrections cost real generations, so they are recorded rather than quietly dropped.');
out.push('');
out.push('1. **The failure mode is unfamiliar gesture, not length.** A 177-word Karna rendered every armour piece, the earrings, the scarf, the dhoti, the low sun and the distant broken chariots. The single thing it dropped was "his right hand rests on the arrow at his hip", and it put the bow in the wrong hand as well. Keep prompts near 110 words anyway, for consistency across 103 cards and because sprawl makes a failure hard to attribute, but do not expect trimming to rescue an instruction the model cannot draw. *This replaces "dense beats minimal" and also replaces "length is the constraint". The first blamed sparseness, the second blamed size; the culprit was neither.*');
out.push('2. **Naming the character is safe** so long as no slot is left blank. The prior fills gaps, not names. The original Krishna-looking Arjuna came from a peacock feather that was in our own prompt text. *We blamed the name for something we asked for.*');
out.push('3. **Enumerate armour by its proper term:** breastplate, pauldrons, vambraces, greaves, belt. Those nouns already imply the region they cover, which is what finally ended the bare-chested renders. Better than "torso completely enclosed", and far better than any analogy.');
out.push('4. **Never a weapon in transit, and never assign hands.** No mid-swing, no loosed bowstring: that needs a deformed string and an absent arrow, and returns melted geometry. Naming which hand holds what fails too, in both directions: it ignores the assignment and it mangles whatever the free hand was given. Say "holding a massive ornate golden bow, a full quiver of arrows on his back" and let the model place the limbs. That renders cleanly and still reads as action.');
out.push('5. **Negate qualities, never objects.** "No glossy surfaces" is a free bet: if the negation fails you get gloss, which was the default anyway. "No sword" hands you a sword. *This replaces "never name what you do not want", which was true only for Firefly.*');
out.push('6. **One global palette instruction** beats per-item colour discipline. "Muted earthy palette" solves the all-red Karna outright.');
out.push('7. **No hue on air.** "Dark indigo air" produced a blue daylight sky. A value on a named weather object, like "dark thunderclouds", is fine.');
out.push('8. **Never ask for both** an oversized foreground weapon and a full-frame fit. They fight, and the weapon loses. Framing wins: drama is cheaper to add back than a severed bow.');
out.push('9. **Do not use JSON.** It collapses the prompt entirely and returns unrelated stock images.');
out.push('');
out.push('## The style sentence');
out.push('');
out.push('```');
out.push(STYLE);
out.push('```');
out.push('');
out.push('Each card below gives two forms. **Standalone** includes the style sentence; use it when generating from the prompt alone. **With style reference** omits it, for when an approved image is uploaded as a style reference and repeating the style in words would give the model two competing instructions.');
out.push('');

out.push('');
out.push('## Weapons carry their god');
out.push('');
out.push(
  'Four rounds of real generation went into this section. Every rule below cost ' +
  'images, so they are written down rather than quietly folded in.'
);
out.push('');
out.push(
  '**0. The sign, never the god.** This is the rule the whole section is built ' +
  'on and it was still got wrong once. Naming a god invites the model to draw ' +
  'him, and the first Brahmashirsha came back as four screaming heads stacked ' +
  'into a column: grotesque, and wrong on its own terms, because the line being ' +
  'quoted is about *signs*. Menace comes from the emblem being a weapon, not ' +
  'from a face glaring out of it. A lotus whose petals are blades is ' +
  'frightening; a lotus with a man screaming in the middle of it is a cartoon. ' +
  'Every weapon prompt carries an explicit guard: show the emblem alone, the god ' +
  'never appears.'
);
out.push('');
out.push(
  '**1. Name the weapon and name the god.** "A Brahmastra, the weapon of Brahma, ' +
  'bearing his sign the lotus" lands where a description of fire and petals does ' +
  'not. This is rule 2 again from the other direction: naming is safe, and here ' +
  'it is what tells the model which iconography to reach for. The epic supplies ' +
  'the mapping in the argument over whose sign is greatest: *"Brahma has for his ' +
  'sign the lotus, Vishnu has for his the discus, Indra has for his sign the ' +
  'thunder-bolt."*'
);
out.push('');
out.push(
  '**2. An arrow AND an emblem returns two objects.** Described as both, it comes ' +
  'back as an arrow *striking* a sphere, with a hard contact line. Deleting the ' +
  'arrowhead is not enough on its own; the shaft still meets the emblem at a seam ' +
  'and looks glued. What works is making the transition itself the subject: wood, ' +
  'then embers, then streaming light, then the emblem, no boundary anywhere. The ' +
  'arrowhead must be named as absent or it gets drawn. Only the seven weapons in ' +
  '`MERGES` carry this; a mace is one object already.'
);
out.push('');
out.push(
  '**3. Half the frame, not all of it.** At full size the emblem crowds its own ' +
  'detail and eats the black margin, which is the margin the screen composite ' +
  'needs to feather into the board. An earlier draft ended "Enormous, close, and ' +
  'terrible" and fought this rule outright. Dread comes from the faces and eyes ' +
  'in the subject, not from filling the card.'
);
out.push('');
out.push(
  '**4. Do not let the weapons go monochrome.** An earlier pass set them in ' +
  '"incandescent white and gold", which read as clean but detached them from the ' +
  'roster entirely. They now burn in the same ground pigments as the character ' +
  'art, lac red and indigo and terre verte and brass. Still one global palette ' +
  'instruction, so rule 6 holds; only the value changed.'
);
out.push('');
out.push(
  '**Arrows rise.** Nothing falls, descends or rains down. It reads better on a ' +
  'portrait card, and it reads as a weapon being loosed rather than as weather.'
);
out.push('');
out.push(
  'Weapons also drop `no bloom`, which earns its place on a painted warrior but ' +
  'forbids the entire subject on a thing made of light. The corona is what ' +
  'feathers the composite into the board instead of ending it at a hard edge.'
);
out.push('');

for (const g of GROUPS) {
  const group = cards.filter(g.match);
  if (!group.length) continue;
  out.push(`## ${g.title} (${group.length})`);
  out.push('');
  for (const c of group) {
    const body = bodyOf(c);
    const full = `${EMISSIVE_TYPES.has(c.type) ? STYLE_EMISSIVE : STYLE} ${body}`;
    const w = wordsIn(full);
    longest = Math.max(longest, full.length);
    longestWords = Math.max(longestWords, w);
    if (w > 110) overWords++;
    emitted++;
    out.push(`### ${c.name}`);
    out.push('');
    out.push(`\`${c.id}.png\` · ${full.length} chars · ${w} words`);
    out.push('');
    out.push('Standalone:');
    out.push('');
    out.push('```');
    out.push(full);
    out.push('```');
    out.push('');
    out.push('With style reference:');
    out.push('');
    out.push('```');
    out.push(body);
    out.push('```');
    out.push('');
  }
}

fs.writeFileSync('docs/art-prompts.md', out.join('\n'));
console.log(
  `docs/art-prompts.md written: ${emitted} prompts, longest ${longest} chars / ${longestWords} words, ${overWords} over the 110-word budget`,
);
