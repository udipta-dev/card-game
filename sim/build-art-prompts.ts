// Build docs/art-prompts.md: one image prompt per card, generated from the live
// card data so nothing is missed and it can be regenerated as cards change.
//   npx vite-node sim/build-art-prompts.ts
import fs from 'node:fs';
import { allCards } from '@content/cards';
import type { Card } from '@engine/types';

// The style anchor is pasted VERBATIM into every prompt. Consistency across a
// hundred images comes from never rewording this, not from clever per-card text.
const STYLE = [
  'Ink-and-gouache illustration in the Indian miniature and Kalamkari tradition:',
  'confident black ink linework, flat saturated gouache colour, ornamental detail',
  'in cloth, jewellery and armour. One warm light source from the upper left; the',
  'subject emerges from a smoky near-black ground. Limited palette, deep shadow,',
  'no rendered photorealism. No text, no lettering, no signature, no watermark.',
  'Vertical 5:7 composition.',
].join(' ');

const TINT: Record<string, string> = {
  pandava: 'Atmosphere tinted deep indigo blue.',
  kaurava: 'Atmosphere tinted dark crimson.',
  asura: 'Atmosphere tinted venomous green.',
  legend: 'Atmosphere tinted cold teal.',
  neutral: 'Atmosphere tinted antique gold.',
};

const FRAMING: Record<Card['type'], string> = {
  unit: 'Chest-up portrait, three-quarter turn, gaze off-frame, weapon entering frame at the edge.',
  astra: 'No human figure. The weapon itself as a phenomenon of light and force filling the frame.',
  boon: 'A single figure in the act of blessing, or the gift itself, centred and radiant.',
  curse: 'A symbolic omen object, centred, ominous, no human figure.',
};

// Hand-written for the marquee cards, where the epic gives something specific to
// draw. Everything else falls back to its flavour line, which already carries
// the one detail that makes the character legible.
const DESC: Record<string, string> = {
  arjuna: 'a lean, calm archer drawing the great bow Gandiva, peacock feather in his hair, unhurried and exact',
  bhima: 'a huge-shouldered warrior resting an iron mace on one shoulder, wild-haired, openly furious',
  yudhishthira: 'an ascetic-faced king in plain white, holding a spear he does not want to use',
  nakula: 'the handsomest of the brothers, sword drawn, groomed and precise',
  sahadeva: 'the youngest brother, quiet and watchful, holding a sword and a palm-leaf almanac',
  abhimanyu: 'a boy of sixteen in bright armour, bow raised, surrounded by the shadow of a closing spiral formation',
  ghatotkacha: 'a towering rakshasa with tusks and dark skin, half-giant, iron club in hand, night behind him',
  dhrishtadyumna: 'a warrior born from sacrificial fire, flame still clinging to his armour, eyes fixed',
  shikhandi: 'a warrior of ambiguous aspect, bow lowered, standing with terrible stillness',
  krishna_charioteer: 'a blue-skinned charioteer holding reins and a conch, not a weapon, serene and knowing',
  bhishma: 'an ancient white-bearded patriarch in silver mail, bow in hand, unbowed and sorrowful',
  drona: 'a grey-bearded brahmin-warrior in armour, bow held loosely, teacher and killer at once',
  karna: 'a golden-armoured archer with sun-bright kavacha at his chest and heavy earrings, proud and alone',
  duryodhana: 'a broad crowned prince, mace across his knees, body faintly gleaming like adamant',
  dushasana: 'a cruel-mouthed prince with a raised, grasping hand',
  ashwatthama: 'a wild-eyed warrior with a jewel set into his forehead, blood-flecked, unable to die',
  shakuni: 'a lean smiling schemer rolling dice in his palm, no armour, all cunning',
  jayadratha: 'a hard-faced king holding a gate-bar like a weapon, boon-light at his back',
  shalya: 'a kingly charioteer holding reins, mouth set in quiet betrayal',
  kripa: 'a serene old brahmin-warrior, prayer beads at his wrist, bow across his back',
  bhagadatta: 'an aged king seated on a war elephant, hook in hand, cloth binding his eyelids up',
  ravana: 'a ten-headed rakshasa king crowned in gold, many arms, arrogant and magnificent',
  kumbhakarna: 'a mountainous sleeping giant just waking, eyes half-open, monstrous and calm',
  indrajit: 'a rakshasa prince mid-vanishing into cloud, bow drawn, conqueror of heaven',
  hiranyakashipu: 'an asura king whose body is armoured by a boon, throat bared in contempt',
  mahishasura: 'a buffalo-headed demon lord mid-shapeshift, horns lowered',
  raktabija: 'an asura from whose falling blood small identical figures are rising',
  vritra: 'a vast drought-serpent coiled around a dry riverbed, scales like cracked earth',
  bali: 'a noble asura king offering water in his palms, deathless and generous',
  barbarika: 'a young archer with three arrows, seated in meditation, his own severed head watching from a hilltop',
  jarasandha: 'a king whose body shows a faint vertical seam from crown to groin, immensely strong',
  balarama: 'a fair-skinned elder brother leaning on a plough, drinking horn at his belt, refusing the war',
  ekalavya: 'a forest-born archer of the Nishada, right thumb missing, bow held in an altered grip',
  shishupala: 'a proud king mid-insult, a faint discus-light already circling his neck',
  rukmi: 'an arrogant prince with an ornate unused bow, standing apart from both armies',
  // Astras
  pashupatastra: 'a single unbearable eye of white fire opening in the sky, the world beneath it thinning to nothing',
  brahmashirsha: 'a four-faced pillar of fire rising from a scorched horizon, the air itself burning',
  brahmastra: 'a single arrow blooming into a column of white fire, the ground beneath already ash',
  narayanastra: 'a sky filled edge to edge with descending divine weapons, discs and spears without number',
  vaishnavastra: 'a discus of blue-white light travelling with impossible certainty toward its mark',
  vasavi_shakti: 'a single blazing spear of Indra hanging in the dark, thrown once and never again',
  nagastra: 'a serpent of living arrow-fire striking through smoke, hood spread',
  garudastra: 'the shadow of a vast eagle falling across a field, serpents scattering beneath it',
  agneyastra: 'a wall of unquenchable flame advancing across a rank of soldiers',
  varunastra: 'a rising wall of black water swallowing fire',
  vayavyastra: 'a screaming spiral of wind tearing a battle line apart',
  aindrastra: 'a sky-blackening rain of arrows falling in a solid sheet',
  bhargavastra: 'countless arrows loosed at once from a single point, a fan of fire',
  sammohanastra: 'a soft grey haze rolling over an army, weapons falling from slack hands',
  // Boons and fates
  gandhari_gaze: 'a blindfolded queen lifting the cloth from her eyes for the first time, terrible light beneath it',
  kunti_invocation: 'a woman speaking a mantra with her eyes closed, a god half-formed in the air above her',
  surya_kavacha: 'golden armour and earrings glowing with sunlight, worn by no one, floating',
  ashwins_draught: 'twin physician-gods pouring a luminous draught, horses behind them',
  vayu_fury: 'a gale tearing across a battlefield, banners and men going over together',
  yama_summons: 'a dark lord of death holding a noose and a ledger, tallying the field',
  ashwatthama_elephant: 'a war elephant falling in smoke, a lie taking shape above it',
};

// Flavour text is narrative, not visual: "second of Virata's fallen sons" gives
// an image model nothing to draw. So the fallback is composed from what the card
// actually IS, rank and battlefield role, with the lore hook appended as colour.
const BEARING: Record<string, string> = {
  maharathi: 'a great champion in richly ornamented armour, bearing himself like a king',
  atirathi: 'a seasoned warrior in good scaled armour',
  rathi: 'a lightly armoured fighter, plain and hard-used',
};
const ROLE: Record<string, string> = {
  ratha: 'a chariot-borne archer, bow in hand',
  gaja: 'a heavy warrior of the elephant corps, tusked mount shouldering into frame behind him',
  padati: 'a foot soldier of the line, spear and shield',
};
const DRESS: Record<string, string> = {
  pandava: 'in the indigo and silver of the Pandavas',
  kaurava: 'in the crimson and gold of the Kauravas',
  asura: 'an asura, dark-skinned and tusked, in barbaric green-lacquered plate',
  legend: 'in the plain dress of one who fought for neither host',
  neutral: '',
};

function subjectOf(card: Card): string {
  if (DESC[card.id]) return DESC[card.id];

  const flavor = ((card as { flavor?: string }).flavor ?? '').split(/(?<=\.)\s/)[0] ?? '';
  const hook = flavor.replace(/\s+/g, ' ').trim().replace(/\.$/, '');

  if (card.type !== 'unit') return hook.toLowerCase() || card.name;

  const tier = (card as { tier?: string }).tier ?? 'rathi';
  const row = card.rows[0] ?? 'padati';
  const parts = [BEARING[tier] ?? BEARING.rathi, ROLE[row] ?? ROLE.padati, DRESS[card.house] ?? ''];
  const visual = parts.filter(Boolean).join(', ');
  return hook ? `${visual}. ${hook}` : visual;
}

function promptFor(card: Card): string {
  const tint = TINT[card.house] ?? TINT.neutral;
  return `${STYLE} ${FRAMING[card.type]} ${tint} Subject: ${card.name}, ${subjectOf(card)}.`;
}

const cards = allCards();
const GROUPS: { title: string; match: (c: Card) => boolean }[] = [
  { title: 'The Pandava Host', match: (c) => c.type === 'unit' && c.house === 'pandava' },
  { title: 'The Kaurava Host', match: (c) => c.type === 'unit' && c.house === 'kaurava' },
  { title: 'The Asura Host', match: (c) => c.type === 'unit' && c.house === 'asura' },
  { title: 'Those Who Stood Apart', match: (c) => c.type === 'unit' && c.house === 'legend' },
  { title: 'Astras (divine weapons)', match: (c) => c.type === 'astra' },
  { title: 'Vardaan and Fates', match: (c) => c.type === 'boon' || c.type === 'curse' },
];

let n = 0;
const out: string[] = [];
out.push('# Kurukshetra: card art prompts');
out.push('');
out.push(`Generated from the live card data. ${cards.length} images, one per card.`);
out.push('Regenerate with `npx vite-node sim/build-art-prompts.ts`.');
out.push('');
out.push('## The rules that actually keep 100+ images consistent');
out.push('');
out.push('1. **Paste the style anchor verbatim every time.** Never reword it, never summarise it. Consistency comes from this sentence being byte-identical across every generation, not from describing each card well.');
out.push('2. **One light direction, always upper-left.** It is in the anchor. Do not let a prompt override it.');
out.push('3. **Framing is fixed by card type**, not chosen per card. Warriors are chest-up three-quarter portraits; astras have no human figure; fates are objects.');
out.push('4. **Aspect ratio 5:7 vertical.** This matches the card frames in the game exactly.');
out.push('5. **No text in the image.** Image models garble Devanagari badly, and the card frame supplies the name anyway.');
out.push('6. **Test three first** (Arjuna, Karna, Ravana) and view them at 46px wide before committing to the rest. If the silhouette does not read at that size, the style needs more contrast, not more detail.');
out.push('');
out.push('## The style anchor');
out.push('');
out.push('```');
out.push(STYLE);
out.push('```');
out.push('');
out.push('## Palette by house');
out.push('');
out.push('| House | Atmosphere |');
out.push('| --- | --- |');
for (const [h, t] of Object.entries(TINT)) out.push(`| ${h} | ${t} |`);
out.push('');

// Two formats, because there are two ways you will actually use this. The table
// is for handing the whole set to a model at once: paste the anchor, then the
// rows. The full prompts below are for generating one card at a time.
out.push('## All 103 in one table');
out.push('');
out.push('Prepend the style anchor and the framing rule to each subject line.');
out.push('');
out.push('| # | Card | Type | House | Subject |');
out.push('| --- | --- | --- | --- | --- |');
for (const g of GROUPS) {
  for (const c of cards.filter(g.match)) {
    n += 1;
    out.push(`| ${n} | ${c.name} | ${c.type} | ${c.house} | ${subjectOf(c).replace(/\|/g, '/')} |`);
  }
}
out.push('');
out.push('---');
out.push('');
out.push('## Ready-to-paste prompts');
out.push('');

n = 0;
for (const g of GROUPS) {
  const group = cards.filter(g.match);
  if (!group.length) continue;
  out.push(`### ${g.title} (${group.length})`);
  out.push('');
  for (const c of group) {
    n += 1;
    out.push(`**${n}. ${c.name}**`);
    out.push('');
    out.push('```');
    out.push(promptFor(c));
    out.push('```');
    out.push('');
  }
}

fs.writeFileSync('docs/art-prompts.md', out.join('\n'));
console.log(`docs/art-prompts.md written: ${n} prompts across ${GROUPS.length} groups`);
