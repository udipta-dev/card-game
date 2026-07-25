// Build docs/art-prompts.md: one image prompt per card, generated from the live
// card data.  npx vite-node sim/build-art-prompts.ts
//
// Everything here is derived from what actually worked in testing, not theory.
// The Bhima prompt is the reference implementation: every card clones its
// structure and density and swaps only the character facts.
//
// Rules earned the hard way, each from a specific observed failure:
//  1. DENSE, not minimal. Stripped-back prompts came out worse, because gaps
//     get filled by the model's priors (bare-chested Arjuna, calendar art).
//  2. Armour by COVERAGE ("torso completely enclosed"), never by analogy.
//     "Fused to his skin" produced bare skin.
//  3. Pose must be DEPICTABLE: a weapon held, never in transit. A mace overhead
//     works; a just-released bowstring needs a deformed string plus an absent
//     arrow and comes back as melted geometry.
//  4. The face needs an EMOTION. "Teeth bared in fury" gave Bhima presence;
//     "lean and exact" gave Arjuna a mannequin.
//  5. NEVER name a colour for the air. "Dark indigo air" produced a blue
//     daylight sky. Bhima names only weather and comes back properly dark.
//  6. One item per slot. Stacked elements wrecked the first Karna.
//  7. Never name a thing you do not want: Firefly has no negative-prompt field,
//     so every mention is a request.
//  8. No JSON. It collapses the prompt entirely and returns stock images.
import fs from 'node:fs';
import { allCards } from '@content/cards';
import type { Card } from '@engine/types';

/** Pasted verbatim into every standalone prompt. Never reworded. */
const STYLE =
  'Ink-and-gouache Indian miniature painting: bold black linework, flat saturated colour, ' +
  'deep chiaroscuro, lavish gold.';

type U = Card & { basePower?: number; tier?: string; flavor?: string };

// ---------------------------------------------------------------- house look
// Armour metal differs per house so the set reads as one family while staying
// distinguishable at board size. Tunic colour never touches the AIR (rule 5).
const ARMOUR: Record<string, string> = {
  pandava: 'a sculpted golden cuirass embossed with a sunburst over a deep blue tunic',
  kaurava: 'a lacquered crimson cuirass banded with heavy gold over a black tunic',
  asura: 'a heavy green-lacquered cuirass banded with dark bronze over a black tunic',
  legend: 'a plain steel cuirass chased with silver over a grey tunic',
  neutral: 'a sculpted golden cuirass over a crimson tunic',
};
const PLATES: Record<string, string> = {
  maharathi: 'massive layered shoulder-plates, thick articulated arm-guards, studded war-belt',
  atirathi: 'layered shoulder-plates, articulated arm-guards, jewelled war-belt',
  rathi: 'plain shoulder-plates, leather arm-guards, banded war-belt',
};
const BUILD: Record<string, string> = {
  maharathi: 'broad-shouldered and powerful',
  atirathi: 'hard-muscled and scarred',
  rathi: 'wiry and weather-beaten',
};

// A weapon HELD, per battlefield role. Never in transit (rule 3).
const WEAPON: Record<string, string> = {
  ratha: 'He draws a great recurved war-bow of gold-chased horn, hauled to full draw with a single arrow nocked',
  gaja: 'He levels a long iron war-lance, its head a broad leaf of steel, braced across his body',
  padati: 'He plants a heavy iron spear and a round bossed shield, set to receive a charge',
};

// Every card needs an emotion (rule 4); varying it by house makes the hosts
// read differently before you know who anyone is.
const FACE: Record<string, string> = {
  pandava: 'eyes narrowed in cold fury',
  kaurava: 'jaw set, mouth hard with contempt',
  asura: 'teeth bared, eyes burning',
  legend: 'gaze level and unreadable',
  neutral: 'expression grim',
};

// One scene idea, and no colour named for the air (rule 5).
const SCENE: Record<string, string> = {
  pandava: 'A howling dust-storm, splintered shields spinning through the air',
  kaurava: 'Smoke rolling across a burning field, broken banners spinning through the air',
  asura: 'A night sky torn with lightning, shattered chariots spinning through the air',
  legend: 'Drifting ash over an empty field, a single broken banner turning in the air',
  neutral: 'Darkness lit by distant fires, embers streaming past',
};

const LIGHT = 'Darkness lit by distant fires, deep shadow.';

// ------------------------------------------------------- marquee characters
interface Marquee {
  armour?: string;
  mark?: string;
  weapon?: string;
  face?: string;
  build?: string;
  scene?: string;
}
const M: Record<string, Marquee> = {
  arjuna: {
    mark: 'a tall ornate golden war-crown, long black hair',
    weapon:
      'He draws the Gandiva, a colossal recurved war-bow of gold-chased horn with curling makara-dragon heads, hauled to full draw',
  },
  bhima: {
    armour: 'a dark iron cuirass banded with heavy gold over a deep blue tunic',
    build: 'bull-necked and immense',
    mark: 'wild black hair',
    face: 'teeth bared in fury',
    weapon:
      'He raises the Gada, a colossal iron war-mace, its head a fluted mass of gold-banded metal ringed with spikes, lifted overhead mid-swing',
    scene: 'A howling dust-storm, shattered chariots spinning through the air',
  },
  karna: {
    armour: 'a seamless golden cuirass engraved with sun-rays over a deep crimson tunic',
    mark: 'heavy golden Kundala earrings, long black hair in a topknot',
    weapon: 'He draws the Vijaya, a colossal recurved war-bow of gold-chased horn, hauled to full draw',
    face: 'eyes steady, mouth set in grim resolve',
  },
  bhishma: {
    build: 'immensely tall and straight-backed',
    mark: 'a long white beard, a high silver crown',
    face: 'eyes heavy with sorrow',
  },
  drona: {
    mark: 'a grey beard, ash marks across his brow, a sacred thread over the armour',
    face: 'expression cold and measuring',
  },
  duryodhana: {
    mark: 'a heavy jewelled crown, skin faintly gleaming like struck adamant',
    weapon: 'He raises a colossal gold-banded war-mace, lifted overhead mid-swing',
  },
  ashwatthama: {
    mark: 'a burning jewel set into his forehead, blood-flecked armour',
    face: 'wild-eyed and snarling',
  },
  ghatotkacha: {
    build: 'a towering half-rakshasa, tusked and colossal',
    mark: 'a wild black mane, dark grey skin',
    weapon: 'He raises an enormous studded iron club, lifted overhead mid-swing',
  },
  abhimanyu: {
    build: 'a beardless youth, slight beside the men around him',
    mark: 'bright unscarred golden armour',
    scene: 'A closing spiral of spears and shields hemming him in on every side',
  },
  shakuni: {
    armour: 'rich unarmoured court silks, rings on every finger',
    build: 'lean and stooped',
    mark: 'a thin smile, dice cupped in one palm',
    weapon: 'He carries no weapon at all, only the dice',
    face: 'smiling, eyes cold with calculation',
  },
  ravana: {
    build: 'a colossal ten-headed rakshasa king',
    mark: 'ten crowned heads, many arms',
    face: 'all ten faces roaring at once',
  },
  kumbhakarna: {
    build: 'a mountainous giant, slab-muscled and tusked',
    mark: 'half-shut eyes still heavy with sleep',
  },
  indrajit: {
    mark: 'half-dissolved into thundercloud, only his drawn bow solid',
    face: 'expression serene and merciless',
  },
  krishna_charioteer: {
    armour: 'flowing yellow silks and no armour at all',
    mark: 'blue skin, a peacock feather in his crown',
    weapon: 'He holds chariot reins and a white conch, no weapon',
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
    mark: 'fair skin, a drinking horn at his belt',
    weapon: 'He plants the plough Hala into the ground like a wall',
    face: 'turned away, refusing the field',
  },
  ekalavya: {
    mark: 'forest dress, the right thumb missing from his draw hand',
    face: 'unbowed, jaw set',
  },
};

// ------------------------------------------------------------ astras & fates
const PHENOMENON: Record<string, string> = {
  pashupatastra: 'a single unbearable eye of white fire opening in a black sky, the world thinning to nothing beneath it',
  brahmashirsha: 'a four-faced pillar of fire rising from a scorched horizon, the air itself burning',
  brahmastra: 'a single arrow blooming into a column of white fire, the ground beneath already ash',
  narayanastra: 'a sky filled edge to edge with descending divine weapons, discs and spears without number',
  vaishnavastra: 'a discus of blue-white light travelling with impossible certainty across a dark field',
  vasavi_shakti: 'a single blazing spear hanging in the dark, thrown once and never again',
  nagastra: 'a serpent of living arrow-fire striking through smoke, hood spread wide',
  garudastra: 'the shadow of a vast eagle falling across a field, serpents scattering beneath it',
  agneyastra: 'a wall of unquenchable flame advancing across a rank of soldiers',
  varunastra: 'a rising wall of black water swallowing fire',
  vayavyastra: 'a screaming spiral of wind tearing a battle line apart',
  aindrastra: 'a sky-blackening rain of arrows falling in a solid sheet',
  bhargavastra: 'countless arrows loosed at once from a single point, a fan of fire',
  sammohanastra: 'a soft grey haze rolling over an army, weapons falling from slack hands',
  gandhari_gaze: 'a blindfold lifted from a queen’s eyes for the first time, terrible light beneath it',
  kunti_invocation: 'a woman with closed eyes speaking a mantra, a god half-formed in the air above her',
  surya_kavacha: 'golden armour and earrings glowing with sunlight, worn by no one, floating in darkness',
  ashwins_draught: 'twin physician-gods pouring a luminous draught, horses behind them',
  vayu_fury: 'a gale tearing across a battlefield, banners and men going over together',
  yama_summons: 'a dark lord of death holding a noose and a ledger, tallying the field',
  ashwatthama_elephant: 'a war elephant falling in smoke, a lie taking shape above it',
};

// ------------------------------------------------------------------- builder
function hookOf(card: U): string {
  const flavor = (card.flavor ?? '').split(/(?<=\.)\s/)[0] ?? '';
  return flavor.replace(/\s+/g, ' ').trim().replace(/\.$/, '');
}

/** The character half of a prompt: everything except the style sentence. */
function bodyOf(card: U): string {
  if (card.type !== 'unit') {
    const p = PHENOMENON[card.id] || hookOf(card) || card.name;
    const noFigure =
      card.type === 'astra'
        ? 'No human figure, the weapon itself filling the frame.'
        : 'No human figure.';
    return `${card.name}: ${p}. ${noFigure} ${LIGHT}`;
  }

  const m = M[card.id] ?? {};
  const tier = card.tier ?? 'rathi';
  const row = card.rows[0] ?? 'padati';
  const armour = m.armour ?? ARMOUR[card.house] ?? ARMOUR.neutral;
  const plates = PLATES[tier] ?? PLATES.rathi;
  const build = m.build ?? BUILD[tier] ?? BUILD.rathi;
  const mark = m.mark ?? 'long black hair';
  const face = m.face ?? FACE[card.house] ?? FACE.neutral;
  const weapon = m.weapon ?? WEAPON[row] ?? WEAPON.padati;
  const scene = m.scene ?? SCENE[card.house] ?? SCENE.neutral;

  // Asuras are meant to be inhuman; everyone else must be told they are human,
  // or the model reaches for Krishna's blue skin.
  const skin = card.house === 'asura' ? 'Dark-skinned and inhuman.' : 'Warm bronze-brown skin.';

  const unarmoured = /no armour/.test(armour);
  const armourClause = unarmoured
    ? `${card.name} in ${armour}`
    : `${card.name} in FULL BATTLE ARMOUR, his torso completely enclosed in ${armour}, ${plates}`;

  const cap = build.charAt(0).toUpperCase() + build.slice(1);
  return `${armourClause}. ${cap}, ${mark}, ${face}. ${weapon}. Braced wide, torso torqued. ${skin} ${scene}.`;
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
let over = 0;
let longest = 0;

out.push('# Kurukshetra: card art prompts');
out.push('');
out.push(`${cards.length} prompts, generated from the live card data. Regenerate with \`npx vite-node sim/build-art-prompts.ts\`.`);
out.push('');
out.push('## How to use these');
out.push('');
out.push('Each card gives two forms.');
out.push('');
out.push('- **Standalone** includes the style sentence. Use it when generating from the prompt alone.');
out.push('- **With style reference** omits the style sentence. Use it when an approved image is uploaded as a Firefly Style Reference, because the reference already supplies the style and repeating it in words gives the model two competing instructions.');
out.push('');
out.push('Aspect ratio 4:5, set in the generator rather than the prompt. Firefly caps prompts at 1024 characters and has no negative-prompt field.');
out.push('');
out.push('## What testing taught us');
out.push('');
out.push('1. **Dense beats minimal.** Stripped-back prompts came out worse: gaps get filled by the model\'s own priors, which for these characters means a bare chest and calendar art.');
out.push('2. **Describe armour by coverage**, never by analogy. "Torso completely enclosed" works; "fused to his skin" produced bare skin.');
out.push('3. **The pose must be depictable.** A weapon held is fine, a weapon in transit is not. A mace raised overhead renders cleanly; a just-released bowstring comes back as melted geometry, because it needs a deformed string and an absent arrow.');
out.push('4. **Give the face an emotion.** It is most of what separates a character from a mannequin.');
out.push('5. **Never name a colour for the air.** "Dark indigo air" produced a bright blue daylight sky and killed the chiaroscuro. Name the weather, not the colour.');
out.push('6. **One item per slot.** Stacked elements turned the first Karna into an all-red mess.');
out.push('7. **Never name what you do not want.** With no negative-prompt field, every mention is a request.');
out.push('8. **Do not use JSON.** It collapses the prompt entirely and returns unrelated stock images.');
out.push('');
out.push('## The style sentence');
out.push('');
out.push('```');
out.push(STYLE);
out.push('```');
out.push('');

for (const g of GROUPS) {
  const group = cards.filter(g.match);
  if (!group.length) continue;
  out.push(`## ${g.title} (${group.length})`);
  out.push('');
  for (const c of group) {
    const body = bodyOf(c);
    const full = `${STYLE} ${body}`;
    longest = Math.max(longest, full.length);
    if (full.length > 1024) over++;
    out.push(`### ${c.name}`);
    out.push('');
    out.push(`\`${c.id}.webp\` · ${full.length} chars`);
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
  `docs/art-prompts.md written: ${cards.length} prompts, longest ${longest} chars, ${over} over the 1024 cap`,
);
