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

// Ground colours, ground pigments. These were still the retired neon set long
// after tokens.css moved to indigo/lac/terre verte, so the board glowed royal
// blue under cards painted in gouache. Each base is the token colour taken
// down to something a lamp could plausibly light, and every edge is brass:
// house is carried by the ground, never by five competing metals.
export const HOUSE_PALETTE: Record<House, HousePalette> = {
  pandava: { base: '#141d2e', edge: '#a98c45', ink: '#e6ecf6', glow: 'rgba(91,123,168,0.45)' },
  kaurava: { base: '#2b120f', edge: '#a98c45', ink: '#f6e7e4', glow: 'rgba(176,87,74,0.45)' },
  neutral: { base: '#211c2c', edge: '#a98c45', ink: '#efeaf6', glow: 'rgba(136,120,171,0.45)' },
  asura: { base: '#15201a', edge: '#a98c45', ink: '#e6f1e9', glow: 'rgba(106,144,112,0.42)' },
  legend: { base: '#132225', edge: '#a98c45', ink: '#e4f2f4', glow: 'rgba(95,143,149,0.42)' },
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

// The placeholder art is a drawn mark now, and lives in ./marks. The emoji
// table that used to sit here mapped 117 card ids onto somebody else's
// illustrations, in somebody else's colour, at a weight nothing else on the
// card shared.

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
