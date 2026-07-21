import type { Card, House, Tier } from '@engine/types';

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
  vaishnavastra: '🌪️',
  ashwatthama_elephant: '🐘',
};

const TYPE_FALLBACK: Record<Card['type'], string> = {
  unit: '⚔️',
  astra: '✴️',
  boon: '🪷',
  curse: '🕯️',
};

export function cardGlyph(card: Card): string {
  return GLYPHS[card.id] ?? TYPE_FALLBACK[card.type];
}

export const TYPE_LABEL: Record<Card['type'], string> = {
  unit: 'Warrior',
  astra: 'Astra',
  boon: 'Boon',
  curse: 'Fate',
};

/** Short human-readable rules text derived from a card's keywords/effects. */
export function rulesText(card: Card): string[] {
  const lines: string[] = [];
  for (const kw of card.keywords) {
    if (kw.kind === 'icchamrityu')
      lines.push(`Icchamrityu: cannot be slain while ${titleize(kw.unlessCardOnBoard)} stands.`);
    if (kw.kind === 'immuneUntilPlayed')
      lines.push(`Immune until "${titleize(kw.card)}" is played, then falls.`);
    if (kw.kind === 'armor') lines.push(`Kavacha-Kundala: armour absorbs the first strike.`);
    if (kw.kind === 'noAstrasInFinalRound') lines.push(`His curse bars astras in the final round.`);
  }
  for (const eff of card.effects) {
    for (const a of eff.actions) {
      if (a.kind === 'winBattle') lines.push('Wins the battle outright.');
      if (a.kind === 'banFromRun') lines.push('Then lost for the rest of the run.');
      if (a.kind === 'destroy' && eff.target.pick === 'highestEnemyUnit')
        lines.push('Slays the mightiest foe.');
      if (a.kind === 'destroy' && eff.target.pick === 'chosen')
        lines.push('Slays a chosen foe.');
      if (a.kind === 'damage' && eff.target.pick === 'enemyRowSameAsPlayed')
        lines.push(`Devastates the struck row (−${a.amount}).`);
    }
  }
  if (card.cost?.consequence) lines.push(card.cost.consequence);
  return lines;
}

function titleize(id: string): string {
  return id
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
