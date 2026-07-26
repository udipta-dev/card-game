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

/** Rule 8: the frame instruction, with nothing in the prompt fighting it.
 *  Takes the whole subject phrase: "full figure" is wrong on a card that has
 *  no figure, and most astras do not. */
const FRAME = (subject: string) =>
  `Low-angle view, ${subject} inside the frame with clear margin, nothing cropped.`;

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

// Rule 4: held, never in transit. The quiver does the work the drawn bow used
// to fail at.
const WEAPON: Record<string, string> = {
  ratha: 'holding a massive ornate golden bow, a full quiver of arrows on his back',
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
  stance?: string;
  weapon?: string;
  skin?: string;
  face?: string;
  mark?: string;
  metal?: string;
  tunic?: string;
  cloth?: string;
  build?: string;
  scene?: string;
}
const M: Record<string, Marquee> = {
  arjuna: {
    skin: 'Blue-grey skin',
    weapon: 'holding a massive ornate golden bow, a full quiver of arrows on his back',
  },
  bhima: {
    build: 'hyper-muscular',
    metal: 'Engraved black armour hung with heavy gold chains',
    tunic: 'a black tunic', // the blue belongs on the loincloth, not twice over
    mark: 'wild black hair and a thick black beard beneath a spiked golden crown',
    face: 'screaming, teeth bared',
    weapon: 'holding a massive golden gada mace',
    cloth: 'Torn blue loincloth, heavy black boots',
    scene: 'Ruined battlefield, flying dust, rock debris',
  },
  karna: {
    // Sun-born, and the kavacha is golden. The Kaurava dark-iron default put
    // him in the wrong metal on the wrong field, which lost the whole reading.
    metal: 'Engraved gold armour',
    mark: 'long black hair beneath a golden diadem, huge ornate golden earrings',
    weapon: 'holding a massive ornate dark bow, a full quiver of arrows on his back',
    face: 'grim resolute expression',
    scene: 'Dusty battlefield under a low sun, drifting smoke, distant broken chariots',
  },
  bhishma: {
    build: 'tall and straight-backed',
    mark: 'a long white beard beneath a high silver crown',
    face: 'expression heavy with sorrow',
  },
  drona: {
    mark: 'a grey beard, ash marks on his brow, a sacred thread across the armour',
    face: 'cold measuring expression',
  },
  duryodhana: {
    mark: 'long black hair beneath a heavy jewelled crown',
    weapon: 'holding a colossal gold-banded war-mace',
  },
  ashwatthama: {
    mark: 'a burning jewel set into his forehead, blood-flecked armour',
    face: 'wild-eyed and snarling',
  },
  ghatotkacha: {
    build: 'a towering tusked half-rakshasa',
    skin: 'Dark grey skin',
    mark: 'a wild black mane',
    weapon: 'holding an enormous studded iron club',
  },
  abhimanyu: {
    build: 'a beardless youth, slight beside grown men',
    mark: 'bright unscarred golden armour, no crown',
    scene: 'A closing ring of spears and shields on every side',
  },
  shakuni: {
    build: 'lean and stooped',
    metal: 'Rich unarmoured court silks with rings on every finger',
    tunic: 'no armour at all',
    weapon: 'holding a pair of ivory dice and no weapon',
    mark: 'a thin smile, grey hair',
    face: 'smiling, eyes cold with calculation',
  },
  ravana: {
    build: 'a colossal rakshasa king',
    mark: 'ten crowned heads and many arms',
    face: 'all ten faces roaring at once',
  },
  kumbhakarna: {
    build: 'a mountainous tusked giant',
    mark: 'half-shut eyes heavy with sleep',
  },
  indrajit: {
    mark: 'half-dissolved into thundercloud, only his bow solid',
    face: 'serene merciless expression',
  },
  krishna_charioteer: {
    // The peacock feather belongs HERE and nowhere else. Putting it on Arjuna
    // is what produced the calendar art we spent a week blaming on his name.
    metal: 'Flowing yellow silks and no armour',
    tunic: 'no armour at all',
    skin: 'Blue skin',
    mark: 'a peacock feather in his crown',
    weapon: 'holding chariot reins and a white conch, no weapon',
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
    skin: 'Fair skin',
    mark: 'long dark hair, a drinking horn at his belt',
    weapon: 'holding a great iron plough planted upright like a wall',
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
    return `${p}. ${figure}${FRAME('the whole subject')} ${NEG}`;
  }

  const m = M[card.id] ?? {};
  const tier = card.tier ?? 'rathi';
  const row = card.rows[0] ?? 'padati';

  const stance = m.stance ?? 'a wide battle stance';
  const weapon = m.weapon ?? WEAPON[row] ?? WEAPON.padati;
  const skin = m.skin ?? SKIN[card.house] ?? SKIN.neutral;
  const face = m.face ?? FACE[card.house] ?? FACE.neutral;
  const mark = m.mark ?? MARK[tier] ?? MARK.rathi;
  const metal = m.metal ?? METAL[card.house] ?? METAL.neutral;
  const tunic = m.tunic ?? TUNIC[card.house] ?? TUNIC.neutral;
  const cloth = m.cloth ?? CLOTH[card.house] ?? CLOTH.neutral;
  const build = m.build ?? BUILD[tier] ?? BUILD.rathi;
  const scene = m.scene ?? SCENE[card.house] ?? SCENE.neutral;

  // The unarmoured (Shakuni, Krishna, Ekalavya) skip the coverage list, which
  // would otherwise put a breastplate on a man in court silks.
  // Commas, not "with ... with ...". Metals that already carry a "banded with
  // gold" clause were producing a doubled preposition on every armoured card.
  const armour = tunic === 'no armour at all' ? `${metal}.` : `${metal}, ${PLATES}, over ${tunic}.`;

  return (
    `${card.name}, ${build}, in ${stance}, ${weapon}. ` +
    `${skin}, ${face}, ${mark}. ` +
    `${armour} ${cloth}. ${scene}. ` +
    `${FRAME('full figure and entire weapon')} ${NEG}`
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
    out.push(`\`${c.id}.webp\` · ${full.length} chars · ${w} words`);
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
