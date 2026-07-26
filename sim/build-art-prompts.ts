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

/** Rule 8: framing, kept in a separate sentence from the camera because the two
 *  genuinely fight. A low angle wants to crop the feet or the crown, so the
 *  guard has to be explicit about the extremities rather than saying "nothing
 *  cropped" and hoping. Takes the subject phrase: "full figure" is wrong on a
 *  card that has no figure, and most astras do not. */
const FRAME = (subject: string) => `${subject} inside the frame, clear margin, nothing cropped.`;

/** Rule 5: qualities only. Never negate an object. */
const NEG = 'No photorealism, no 3D rendering, no glossy surfaces, no bloom.';

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
  ekalavya: 'holding a bow, drawing with the remaining fingers of a thumbless hand',

  // --- Not from the epic's own catalogue, but unmistakable and uncontested.
  karna: 'holding a massive ornate dark bow, a full quiver of arrows on his back',
  ghatotkacha: 'holding a huge blazing spear upraised overhead',
  shakuni: 'holding a pair of ivory dice and no weapon',
  balarama: 'holding a great iron plough planted upright like a wall',
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

// ------------------------------------------------------- marquee characters
// Only what DIFFERS from the house default. Every override costs words against
// rule 1, so anything the house look already handles is left alone.
interface Marquee {
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
  uttara: {
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
    // Son of an Ashwin, the twin horsemen of dawn.
    scene: 'Battlefield at first light, low dawn mist',
    build: 'lithe and handsome',
  },
  yudhishthira: {
    // Son of Dharma/Yama: no wind, no drama, judgement.
    scene: 'Still grey battlefield, falling ash, dead air',
    face: 'calm sorrowful expression',
  },
  bhagadatta: {
    // Supratika is named in the epic (Bhishma XCVI); his BANNER device never is.
    mount: 'the great war-elephant Supratika beside him, its head and tusks filling one side',
  },
  arjuna: {
    skin: 'Blue-grey skin',
  },
  bhima: {
    build: 'hyper-muscular',
    metal: 'Engraved black armour hung with heavy gold chains',
    tunic: 'a black tunic', // the blue belongs on the loincloth, not twice over
    mark: 'wild black hair and a thick black beard beneath a spiked golden crown',
    face: 'screaming, teeth bared',
    cloth: 'Torn blue loincloth, heavy black boots',
    scene: 'Ruined battlefield, flying dust, rock debris',
  },
  karna: {
    // Sun-born, and the kavacha is golden. The Kaurava dark-iron default put
    // him in the wrong metal on the wrong field, which lost the whole reading.
    metal: 'Engraved gold armour',
    mark: 'long black hair beneath a golden diadem, huge ornate golden earrings',
    face: 'grim resolute expression',
    scene: 'Dusty battlefield under a low sun, drifting smoke, distant broken chariots',
  },
  bhishma: {
    scene: 'Battlefield beside a wide river, drifting mist',
    camera: 'Slightly low camera angle, grave and monumental.',
    build: 'tall and straight-backed',
    mark: 'a long white beard beneath a high silver crown',
    face: 'expression heavy with sorrow',
  },
  drona: {
    camera: 'Eye-level camera.',
    mark: 'a grey beard, ash marks on his brow, a sacred thread across the armour',
    face: 'cold measuring expression',
  },
  duryodhana: {
    mark: 'long black hair beneath a heavy jewelled crown',
  },
  ashwatthama: {
    mark: 'a burning jewel set into his forehead, blood-flecked armour',
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
    mark: 'bright unscarred golden armour, no crown',
    scene: 'A closing ring of spears and shields on every side',
  },
  shakuni: {
    mount: '',
    camera: 'Eye-level camera, close and conspiratorial.',
    build: 'lean and stooped',
    metal: 'Rich unarmoured court silks with rings on every finger',
    tunic: 'no armour at all',
    mark: 'a thin smile, grey hair',
    face: 'smiling, eyes cold with calculation',
  },
  ravana: {
    build: 'a colossal rakshasa king',
    mark: 'ten crowned heads and many arms',
    face: 'all ten faces roaring at once',
  },
  kumbhakarna: {
    mount: '',
    build: 'a mountainous tusked giant',
    mark: 'half-shut eyes heavy with sleep',
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
    mark: 'a faint vertical seam running the length of his body',
  },
  balarama: {
    mount: '',
    skin: 'Fair skin',
    mark: 'long dark hair, a drinking horn at his belt',
    face: 'turned away, refusing the field',
  },
  ekalavya: {
    metal: 'Plain forest dress and no armour',
    tunic: 'no armour at all',
    mark: 'the right thumb missing from his draw hand',
    face: 'unbowed, jaw set',
  },
};

// ------------------------------------------------------------ astras & fates
// No figure, so these get the whole budget for the phenomenon itself.
const PHENOMENON: Record<string, string> = {
  pashupatastra: 'A single unbearable eye of white fire opening in a black sky, the world thinning to nothing beneath it',
  brahmashirsha: 'A four-faced pillar of fire rising from a scorched horizon',
  brahmastra: 'A single arrow blooming into a column of white fire, the ground beneath already ash',
  narayanastra: 'A sky filled edge to edge with descending divine weapons, discs and spears without number',
  vaishnavastra: 'A discus of blue-white light crossing a dark field with impossible certainty',
  vasavi_shakti: 'A single blazing spear hanging in the dark, thrown once and never again',
  nagastra: 'A serpent of living arrow-fire striking through smoke, hood spread wide',
  garudastra: 'The shadow of a vast eagle falling across a field, serpents scattering beneath it',
  agneyastra: 'A wall of unquenchable flame advancing across a rank of soldiers',
  varunastra: 'A rising wall of black water swallowing fire',
  vayavyastra: 'A screaming spiral of wind tearing a battle line apart',
  aindrastra: 'A sky-blackening rain of arrows falling in a solid sheet',
  bhargavastra: 'Countless arrows loosed at once from a single point, a fan of fire',
  sammohana: 'A soft grey haze rolling over an army, weapons falling from slack hands',
  gandhari_gaze: 'A blindfold lifted from a queen’s eyes for the first time, terrible light beneath it',
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
  'gandhari_gaze',
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
    return `${p}. ${figure}${CAMERA_SCENE} ${FRAME('Whole subject')} ${NEG}`;
  }

  const m = M[card.id] ?? {};
  const tier = card.tier ?? 'rathi';
  const row = card.rows[0] ?? 'padati';

  const camera = m.camera ?? CAMERA[tier] ?? CAMERA.rathi;
  const stance = m.stance ?? 'a wide battle stance';
  const weapon =
    WEAPON_BY_ID[card.id] ?? WEAPON_FALLBACK[row] ?? WEAPON_FALLBACK.padati;
  const skin = m.skin ?? SKIN[card.house] ?? SKIN.neutral;
  const face = m.face ?? FACE[card.house] ?? FACE.neutral;
  const mark = m.mark ?? MARK[tier] ?? MARK.rathi;
  const metal = m.metal ?? METAL[card.house] ?? METAL.neutral;
  const tunic = m.tunic ?? TUNIC[card.house] ?? TUNIC.neutral;
  const cloth = m.cloth ?? CLOTH[card.house] ?? CLOTH.neutral;
  const build = m.build ?? BUILD[tier] ?? BUILD.rathi;
  const scene = m.scene ?? SCENE[card.house] ?? SCENE.neutral;
  const emblem = BANNER[card.id];
  const banner = emblem
    ? `A tall war-standard bearing ${emblem}`
    : (HOUSE_BANNER[card.house] ?? HOUSE_BANNER.neutral);
  const mount = m.mount ?? MOUNT[row] ?? '';

  // The unarmoured (Shakuni, Krishna, Ekalavya) skip the coverage list, which
  // would otherwise put a breastplate on a man in court silks.
  // Commas, not "with ... with ...". Metals that already carry a "banded with
  // gold" clause were producing a doubled preposition on every armoured card.
  const armour = tunic === 'no armour at all' ? `${metal}.` : `${metal}, ${PLATES}, over ${tunic}.`;

  return (
    `${card.name}, ${build}, in ${stance}, ${weapon}. ` +
    `${skin}, ${face}, ${mark}. ` +
    `${armour} ${cloth}. ${scene}. ` +
    `${banner}${mount ? `, and ${mount}` : ''}. ` +
    `${camera} ${FRAME('Full figure from head to feet, entire weapon')} ${NEG}`
  );
}

const cards = allCards() as U[];
const GROUPS: { title: string; match: (c: U) => boolean }[] = [
  { title: 'The Pandava Host', match: (c) => c.type === 'unit' && c.house === 'pandava' },
  { title: 'The Kaurava Host', match: (c) => c.type === 'unit' && c.house === 'kaurava' },
  { title: 'The Asura Host', match: (c) => c.type === 'unit' && c.house === 'asura' },
  { title: 'Those Who Stood Apart', match: (c) => c.type === 'unit' && c.house === 'legend' },
  { title: 'Astras', match: (c) => c.type === 'astra' },
  { title: 'Vardaan and Fates', match: (c) => c.type === 'boon' || c.type === 'curse' },
];

const out: string[] = [];
let longest = 0;
let longestWords = 0;
let overWords = 0;

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

for (const g of GROUPS) {
  const group = cards.filter(g.match);
  if (!group.length) continue;
  out.push(`## ${g.title} (${group.length})`);
  out.push('');
  for (const c of group) {
    const body = bodyOf(c);
    const full = `${STYLE} ${body}`;
    const w = wordsIn(full);
    longest = Math.max(longest, full.length);
    longestWords = Math.max(longestWords, w);
    if (w > 110) overWords++;
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
  `docs/art-prompts.md written: ${cards.length} prompts, longest ${longest} chars / ${longestWords} words, ${overWords} over the 110-word budget`,
);
