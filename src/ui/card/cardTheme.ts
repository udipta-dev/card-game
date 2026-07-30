import { allCards } from '@content/cards';
import type { Card, House, Tier } from '@engine/types';

/** Names of the warriors who can invoke a given astra. */
export function astraWielders(astraId: string): string[] {
  return allCards()
    .filter((c) => c.knownAstras?.includes(astraId))
    .map((c) => c.name);
}

// The placeholder design system: house palettes, tier accents, and a symbolic
// glyph per card that stands in for AI art. When `card.art` is set, CardFrame
// shows the image instead, this is the swappable slot.

export interface HousePalette {
  base: string;
  edge: string;
  ink: string;
  glow: string;
}

export const HOUSE_PALETTE: Record<House, HousePalette> = {
  pandava: { base: '#16265c', edge: '#e8b923', ink: '#eaf0ff', glow: 'rgba(120,160,255,0.55)' },
  kaurava: { base: '#4a0f14', edge: '#c9a227', ink: '#ffeaea', glow: 'rgba(220,80,80,0.55)' },
  neutral: { base: '#2c1a4d', edge: '#8b7bd8', ink: '#f0eaff', glow: 'rgba(160,120,240,0.55)' },
  asura: { base: '#152b1c', edge: '#57b06e', ink: '#e6ffe9', glow: 'rgba(90,200,120,0.5)' },
  legend: { base: '#12313a', edge: '#54b7c4', ink: '#e6fbff', glow: 'rgba(84,183,196,0.5)' },
};

/** Short display name and dot colour per house, for chips and the picker. */
export const FACTION_NAME: Record<House, string> = {
  pandava: 'Pandavas',
  kaurava: 'Kauravas',
  asura: 'Asuras',
  neutral: 'Neutral',
  legend: 'Legends',
};
export const FACTION_DOT: Record<House, string> = {
  pandava: 'var(--pandava)',
  kaurava: 'var(--kaurava)',
  asura: 'var(--asura)',
  neutral: 'var(--neutral)',
  legend: 'var(--legend)',
};

export const TIER_LABEL: Record<Tier, string> = {
  rathi: 'Rathi',
  atirathi: 'Atirathi',
  maharathi: 'Maharathi',
};

/** Chevrons denoting the canon warrior rank. */
export function tierMark(tier?: Tier): string {
  if (tier === 'maharathi') return '≡';
  if (tier === 'atirathi') return '=';
  if (tier === 'rathi') return '–';
  return '';
}

// Signature glyphs, a light touch of character for the placeholder art.
const GLYPHS: Record<string, string> = {
  // Pandavas
  arjuna: '🏹',
  bhima: '🪓',
  yudhishthira: '👑',
  abhimanyu: '🌀',
  ghatotkacha: '👹',
  dhrishtadyumna: '🔥',
  nakula: '🗡️',
  sahadeva: '📜',
  shikhandi: '☯️',
  pandava_infantry: '🛡️',
  krishna_charioteer: '🪈',
  // Kauravas
  bhishma: '🏵️',
  drona: '🎯',
  karna: '☀️',
  duryodhana: '💎',
  ashwatthama: '🐎',
  dushasana: '✋',
  shakuni: '🎲',
  jayadratha: '🚪',
  kaurava_infantry: '⚔️',
  // Astras & tricks
  nagastra: '🐍',
  brahmastra: '☢️',
  pashupatastra: '🔱',
  vaishnavastra: '🌀',
  ashwatthama_elephant: '🐘',
  brahmashirsha: '☄️',
  vasavi_shakti: '⚡',
  aindrastra: '🌧️',
  bhargavastra: '🪓',
  vayavyastra: '🌪️',
  sammohana: '💤',
  agneyastra: '🔥',
  varunastra: '🌊',
  sauparna: '🦅',
  narayanastra: '🌀',
  // Pandava allies
  iravan: '🐍',
  anjanaparvan: '👹',
  drupada: '🏰',
  satyaki: '🗡️',
  virata: '🐟',
  sweta: '⚡',
  sankha: '🐚',
  uttara: '🐎',
  chekitana: '🛡️',
  dhrishtaketu: '🔱',
  kekaya_brothers: '👬',
  kuntibhoja: '🏵️',
  yuyutsu: '🕊️',
  yudhamanyu: '🛞',
  uttamaujas: '🛞',
  prativindhya: '🔥',
  sutasoma: '🔥',
  shrutakarma: '🔥',
  shatanika: '🔥',
  shrutasena: '🔥',
  // Kaurava allies
  shalya: '🐎',
  kripa: '📿',
  kritavarma: '🌙',
  bhurishravas: '🙏',
  bahlika: '👴',
  somadatta: '⚔️',
  vikarna: '⚖️',
  chitrasena: '🏹',
  vivimsati: '🏹',
  durmukha: '😠',
  uluka: '✉️',
  vinda: '⚔️',
  anuvinda: '⚔️',
  susharma: '💀',
  sudakshina: '🐎',
  srutayudha: '🔨',
  jalasandha: '🐘',
  alambusha: '👺',
  alayudha: '👺',
  vrishasena: '☀️',
  // Asuras
  ravana: '👺',
  kumbhakarna: '😴',
  indrajit: '🏹',
  hiranyakashipu: '💪',
  hiranyaksha: '🐗',
  bali: '👑',
  prahlada: '🙏',
  narakasura: '🗡️',
  mahishasura: '🐃',
  shumbha: '😈',
  nishumbha: '😈',
  raktabija: '🩸',
  vritra: '🐉',
  tarakasura: '⭐',
  asura_horde: '👹',
  // Vardaan: gifts of the gods
  brahmas_bargain: '🪷',
  kunti_invocation: '🕉️',
  surya_kavacha: '🌞',
  ashwins_draught: '⚕️',
  vayu_fury: '🌪️',
  yama_summons: '⚖️',
  // Those who stood apart
  barbarika: '🏹',
  jarasandha: '🤼',
  balarama: '🌾',
  ekalavya: '🎯',
  shishupala: '💯',
  rukmi: '🏹',
};

const TYPE_FALLBACK: Record<Card['type'], string> = {
  unit: '⚔️',
  astra: '✴️',
  shastra: '🗡️',
  boon: '🪷',
  curse: '🕯️',
  stratagem: '🎭',
};

export function cardGlyph(card: Card): string {
  return GLYPHS[card.id] ?? TYPE_FALLBACK[card.type];
}

export const TYPE_LABEL: Record<Card['type'], string> = {
  unit: 'Warrior',
  astra: 'Astra',
  shastra: 'Shastra',
  boon: 'Vardaan',
  curse: 'Shrap',
  stratagem: 'Stratagem',
};

// The game keeps its Sanskrit names, and explains every one of them in plain
// English the first time you meet it. A player who has never heard of a
// Maharathi should never be blocked by the word, and a player who has should
// never see it watered down.
export const TYPE_GLOSS: Record<Card['type'], string> = {
  unit: 'a warrior of the host',
  astra: 'a divine weapon invoked by mantra',
  shastra: 'a named weapon, carried in the hand',
  boon: 'a divine gift, granted at a shrine',
  curse: 'a curse bound to a gift',
  stratagem: 'a trick of war, not a weapon',
};

export const TIER_GLOSS: Record<Tier, string> = {
  maharathi: 'a champion able to fight ten thousand at once',
  atirathi: 'a warrior able to fight ten thousand in turn',
  rathi: 'a chariot-warrior, the line of the army',
};

/** The Chaturanga rows, in English, for anyone meeting the words for the first time. */
export const ROW_GLOSS: Record<string, string> = {
  ratha: 'Chariots',
  gaja: 'Elephants',
  padati: 'Infantry',
};

/** Short human-readable rules text derived from a card's keywords/effects. */
/** Plain-language gloss for the conditions a card's effects are gated on. */
function conditionText(c: Card['effects'][number]['condition']): string | null {
  if (!c) return null;
  if (c.q === 'isFinalRound') return 'In the round that decides the battle:';
  if (c.q === 'cardOnBoard')
    return `While ${titleize(c.card)} stands${c.side === 'enemy' ? ' against you' : ''}:`;
  if (c.q === 'targetHasFlag' && c.flag === 'diamond-body') return 'Against an armoured foe:';
  if (c.q === 'and') {
    const parts = c.cs.map(conditionText).filter(Boolean) as string[];
    return parts.length ? parts.join(' ') : null;
  }
  if (c.q === 'not') {
    const inner = conditionText(c.c);
    return inner ? `Unless ${inner.replace(/:$/, '').toLowerCase()}:` : null;
  }
  return null;
}

export function rulesText(card: Card): string[] {
  const lines: string[] = [];
  for (const kw of card.keywords) {
    if (kw.kind === 'icchamrityu')
      lines.push(`Icchamrityu: cannot be slain until ${titleize(kw.unlessCardOnBoard)} takes the field.`);
    if (kw.kind === 'immuneUntilPlayed')
      lines.push(`Immune until "${titleize(kw.card)}" is played, then falls.`);
    if (kw.kind === 'armor') lines.push(`Kavacha-Kundala: armour absorbs the first strike.`);
    if (kw.kind === 'noAstrasInFinalRound') lines.push(`His curse bars astras in the final round.`);
  }
  for (const eff of card.effects) {
    // WHEN it happens, before what happens. No card in the game showed its
    // conditions, so Karna read as a plain 10 and turned to nothing if you held
    // him for the deciding round: the information existed only in the source.
    // A drawback the player cannot see is a trap, not a decision.
    const when = conditionText(eff.condition);
    if (when) lines.push(when);
    for (const a of eff.actions) {
      if (a.kind === 'winBattle') lines.push('Wins the battle outright.');
      if (a.kind === 'banFromRun') lines.push('Then lost for the rest of the run.');
      if (a.kind === 'destroy' && eff.target.pick === 'highestEnemyUnit')
        lines.push('Slays the mightiest foe.');
      if (a.kind === 'destroy' && eff.target.pick === 'chosen')
        lines.push('Slays a chosen foe.');
      if (a.kind === 'destroy' && eff.target.pick === 'allEnemyUnits')
        lines.push('Strikes every foe.');
      if (a.kind === 'damage' && eff.target.pick === 'enemyRowSameAsPlayed')
        lines.push(`Devastates the struck row (−${a.amount}).`);
      if (a.kind === 'damage' && eff.target.pick === 'allEnemyUnits')
        lines.push(`Rains −${a.amount} on every foe.`);
      if (a.kind === 'damage' && eff.target.pick === 'self')
        lines.push(`He takes −${a.amount} himself, armour first.`);
      if (a.kind === 'cleanse') lines.push('Lifts every penalty from your own lines.');
      if (a.kind === 'dismount') lines.push('Puts a chariot-warrior on foot (−2).');
    }
  }
  if (card.type === 'astra') {
    const tier = card.astraTier ?? 1;
    if (tier >= 3) {
      const holders = astraWielders(card.id);
      lines.push(
        `An ultimate astra. Only ${holders.length ? holders.join(', ') : 'a warrior granted it by a god'} can fire it.`,
      );
    } else if (tier === 2) {
      lines.push('A great astra. Only a warrior trained in the Brahma line can fire it.');
    } else {
      lines.push('An elemental astra. Any astra-trained warrior can fire it.');
    }
    if (card.counteredBy?.length)
      lines.push(`Answered by: ${card.counteredBy.map(titleize).join(', ')} in the enemy hand.`);
  }
  if (card.astraMastery)
    lines.push(`An astra-master, trained to tier ${card.astraMastery}.`);
  if (card.knownAstras?.length)
    lines.push(`Bears the ${card.knownAstras.map(titleize).join(', ')}.`);
  if (card.cost?.consequence) lines.push(card.cost.consequence);
  return lines;
}

function titleize(id: string): string {
  return id
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
