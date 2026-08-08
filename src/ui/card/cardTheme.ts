import { allCards, getCard } from '@content/cards';
import { BOND_OTHERS } from '@engine/keywords';
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

/**
 * What a bond's kinship is called on the card face.
 *
 * The rules line used to say "of the same banner", which tells the player
 * nothing about who actually counts. Naming the kindred lets them look at their
 * own board and work it out.
 */
const BOND_WORD: Record<string, string> = {
  daitya: 'fellow daitya',
  'asura-lord': 'fellow asura lord',
  rakshasa: 'fellow rakshasa',
  twin: 'twin',
  upapandava: 'son of Draupadi',
  'kaurava-brother': 'brother of Hastinapura',
  avanti: 'brother of Avanti',
  matsya: 'man of Matsya',
  panchala: 'man of Panchala',
  'sun-line': 'child of the sun',
  'wheel-guard': 'wheel-guard',
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
/**
 * Who an effect lands on, in words a player already knows.
 *
 * The generator used to hard-code the target into each sentence, which is why
 * only a handful of (action, target) pairs had any wording at all and the rest
 * printed nothing. Naming the target separately means a new action needs one
 * line rather than one line per target it might be paired with.
 */
function whom(t: Card['effects'][number]['target']): string {
  switch (t.pick) {
    case 'self': return 'himself';
    case 'highestEnemyUnit': return 'the mightiest foe';
    case 'lowestEnemyUnit': return 'the weakest foe';
    case 'allEnemyUnits': return 'every foe';
    case 'allOwnUnits': return 'every ally';
    case 'allUnits': return 'everyone on the field';
    case 'chosen': return t.filter?.side === 'own' ? 'a chosen ally' : 'a chosen foe';
    case 'unitByCard': {
      const ids = t.cards ?? (t.card ? [t.card] : []);
      const names = ids.map(nameOf);
      if (names.length <= 1) return names[0] ?? 'a named foe';
      return `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]}`;
    }
    case 'enemyRow':
    case 'enemyRowSameAsPlayed': return 'the struck enemy rank';
    case 'lineBothSides':
    case 'lineBothSidesSameAsPlayed': return 'that rank on both sides of the field';
    case 'ownAdjacentToPlayed': return 'your neighbouring ranks';
    case 'ownRowSameAsPlayed': return 'the rank he joins';
    default: return 'the field';
  }
}

/**
 * The possessive form of a target, which `whom` cannot give you.
 *
 * "Sinks himself's chariot in the earth" is what you get by gluing an
 * apostrophe-s onto whom(), and that is what Karna's card printed. Any flag or
 * action that owns something needs this instead.
 */
function whose(t: Card['effects'][number]['target']): string {
  return t.pick === 'self' ? 'his own' : `${whom(t)}'s`;
}

function conditionText(c: Card['effects'][number]['condition']): string | null {
  if (!c) return null;
  if (c.q === 'isFinalRound') return 'In the round that decides the battle:';
  if (c.q === 'behindOnPower') return 'While you are losing the field:';
  if (c.q === 'cardOnBoard')
    return `While ${nameOf(c.card)} stands${c.side === 'enemy' ? ' against you' : ''}:`;
  if (c.q === 'targetHasFlag' && c.flag === 'diamond-body') return 'Against an armoured foe:';
  // An unhandled clause returns null, and inside an `and` it is silently
  // dropped rather than failing loudly, so the card renders a HALF-condition
  // that reads as the whole rule. The Vaishnava is turned aside by two things,
  // Krishna's shield and Prahlada's presence, and it was printing only
  // Prahlada, which made Krishna's entire purpose invisible on the one card he
  // exists to stop.
  if (c.q === 'targetHasBoon') return `While ${nameOf(c.boon)} guards your mark:`;
  if (c.q === 'and') {
    // ONE SENTENCE, not two glued together. Each clause returns its own
    // colon-terminated fragment, and joining them with a space produced
    // "In the round that decides the battle: Unless while jarasandha stands
    // against you:" on Krishna's card, which is not English. Strip the inner
    // colons, join with "and", and punctuate once at the end.
    const parts = (c.cs.map(conditionText).filter(Boolean) as string[]).map((p) =>
      p.replace(/:$/, ''),
    );
    if (!parts.length) return null;
    const joined =
      parts.length === 1
        ? parts[0]
        : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
    return `${joined}:`;
  }
  if (c.q === 'not') {
    const inner = conditionText(c.c);
    if (!inner) return null;
    const bare = inner.replace(/:$/, '');
    // A NEGATION HAS TO NEGATE, and the pretty rewrite must not be trusted to
    // notice when it failed to.
    //
    // This read `bare.replace(/^While /, 'so long as ').replace(/ stands/, ' does
    // not stand')` and took "the string changed" as proof the negation had
    // landed. On "While Krishna, the Charioteer guards your mark" the first
    // replace fired and the second found nothing to match, so the string had
    // changed, and the Vaishnava printed "so long as Krishna guards your mark,
    // slays a chosen foe": the exact inverse of the rule, on the single clause
    // that decides whether the weapon kills.
    //
    // Each rewrite now has to match the WHOLE clause or not at all, so a
    // half-match can no longer pass itself off as a success. Anything unmatched
    // falls through to "unless ...", which is plainer but always true.
    const NEGATIONS: [RegExp, string][] = [
      [/^While (.+) stands against you$/, 'so long as $1 does not stand against you'],
      [/^While (.+) stands$/, 'so long as $1 does not stand'],
      [/^While (.+) guards your mark$/, 'so long as $1 does not guard your mark'],
    ];
    for (const [pattern, into] of NEGATIONS) {
      if (pattern.test(bare)) return `${bare.replace(pattern, into)}:`;
    }
    return `unless ${bare[0].toLowerCase()}${bare.slice(1)}:`;
  }
  return null;
}

/**
 * What adding a flag means, in words. Takes who it lands on, because the same
 * flag reads differently on yourself and on an enemy.
 *
 * Every flag a card can apply needs an entry. A card that silently applies one
 * is a card whose rules panel is lying by omission, and it also strands any
 * condition attached to it, since the condition is joined to the sentence its
 * actions produce.
 */
const FLAG_LINE: Record<string, (target: string) => string> = {
  'diamond-body': () =>
    'A body of adamant: cannot be slain, and cannot be worn below a third of his strength, until a vow strips it from him.',
  'krishna-guarded': (t) => `Shields ${t}: a killing weapon aimed at him is turned aside.`,
  stupefied: (t) => `Stupefies ${t}: senseless, and worth nothing this round.`,
  stripped: (t) => `Strips ${t} of his protections, so an ordinary weapon can reach him.`,
  hidden: (t) => `Hides ${t}: nothing can be aimed at him while he is unseen.`,
  'wheel-sunk': (t) => `Sinks ${t} chariot in the earth.`,
  disarmed: (t) => `Disarms ${t}.`,
  'mantra-spent': (t) => `${cap(t)} has spent his mantra, and will call no other weapon.`,
  denied: (t) => `Bars ${t} from taking the field this round.`,
};

/** Sentence-case the first letter, for a clause that may arrive lowercased. */
const cap = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

export function rulesText(card: Card): string[] {
  const lines: string[] = [];
  // Eight of the twelve keywords in the game used to say nothing here, so a
  // player could not learn from the card that Ashwatthama cannot be killed, or
  // that half the Asura roster lands harder the longer you hold it. Worse, the
  // half floor is silent by nature: a player grinding Bhishma watches him stop
  // at 5 for no stated reason and reasonably concludes the game is broken.
  for (const kw of card.keywords) {
    if (kw.kind === 'icchamrityu')
      lines.push(
        `Icchamrityu: cannot be slain, and cannot be worn below a third of his strength, until ${nameOf(kw.unlessCardOnBoard)} takes the field.`,
      );
    if (kw.kind === 'immuneUntilPlayed')
      lines.push(
        `Cannot be slain, and cannot be worn below a third of his strength, until ${nameOf(kw.card)} is played. Then he falls.`,
      );
    if (kw.kind === 'deathless')
      lines.push('Chiranjivi: nothing in the world can slay him. He can still be worn down to 1.');
    if (kw.kind === 'unwoundable')
      lines.push(
        'Damage cannot lower him. Not reduced, ignored: every drop of blood spilled raises another of him. Only removal answers him.',
      );
    if (kw.kind === 'nightGrowth')
      lines.push(
        `Night-strength: arrives +${kw.amount} for every round already fought. Hold him back and he lands harder.`,
      );
    if (kw.kind === 'bond')
      // Says who is raised, by how much, and when. The old line ("+N for each
      // ally of the same banner already on the field") named none of the three,
      // and read as if it buffed allies when it buffed himself.
      lines.push(
        kw.amount > BOND_OTHERS
          ? `Rallies the rank he joins: every ally already standing in that row gains +${BOND_OTHERS}, and each ${BOND_WORD[kw.tag] ?? kw.tag} gains +${kw.amount}. He gains nothing himself, so place him last.`
          : `Rallies the rank he joins: every ally already standing in that row gains +${kw.amount}. He gains nothing himself, so place him last.`,
      );
    if (kw.kind === 'drawsAstra')
      lines.push('A lightning rod: an enemy astra aimed at your host strikes him instead.');
    // NOT "Kavacha-Kundala" on everyone. That is Karna's armour specifically,
    // born onto his body and given by Surya, and the line was hardcoded, so
    // Shikhandi and Prahlada were both being told they wore it. It also said
    // "the first strike" whatever the amount, which is wrong for any armour
    // above 1.
    if (kw.kind === 'armor')
      lines.push(
        card.id === 'karna'
          ? `Kavacha-Kundala: the armour he was born in turns aside the first ${kw.amount} of harm.`
          : `Armoured: turns aside the first ${kw.amount} of harm.`,
      );
    if (kw.kind === 'noAstrasInFinalRound') lines.push(`His curse bars astras in the final round.`);
  }
  for (const eff of card.effects) {
    // WHEN it happens, before what happens. No card in the game showed its
    // conditions, so Karna read as a plain 10 and turned to nothing if you held
    // him for the deciding round: the information existed only in the source.
    // A drawback the player cannot see is a trap, not a decision.
    // The condition JOINS the sentence it governs. Pushed as its own line it
    // read as a dangling fragment: Karna's card said "In the round that decides
    // the battle:" and then, as a separate paragraph, "He takes -4 himself".
    // Two half-sentences stacked, which is most of what "the text is nonsense"
    // was pointing at.
    const when = conditionText(eff.condition);
    const before = lines.length;
    for (const a of eff.actions) {
      if (a.kind === 'winBattle') lines.push('Wins the battle outright.');
      if (a.kind === 'banFromRun') lines.push('Then lost for the rest of the run.');
      if (a.kind === 'destroy' && eff.target.pick === 'highestEnemyUnit')
        lines.push('Slays the mightiest foe.');
      if (a.kind === 'destroy' && eff.target.pick === 'lowestEnemyUnit')
        lines.push('Slays the weakest foe.');
      if (a.kind === 'destroy' && eff.target.pick === 'chosen')
        lines.push('Slays a chosen foe.');
      if (a.kind === 'destroy' && eff.target.pick === 'unitByCard')
        lines.push(`Slays ${whom(eff.target)}, wherever he stands.`);
      if (a.kind === 'destroy' && eff.target.pick === 'allEnemyUnits')
        lines.push('Slays every foe.');
      if (a.kind === 'destroy' && eff.target.pick === 'self')
        lines.push('And falls with them: he is spent doing it.');
      if (a.kind === 'destroy' && eff.target.pick === 'allOwnUnits')
        lines.push('Slays every one of your own.');
      // ANY target, not the three that happened to be written. Sweta and
      // Barbarika both deal damage and both rendered a blank card, because
      // 'highestEnemyUnit' and 'allUnits' had no sentence of their own.
      if (a.kind === 'damage')
        lines.push(
          eff.target.pick === 'self'
            ? `He takes −${a.amount} himself.`
            : `Strikes ${whom(eff.target)} for −${a.amount}.`,
        );
      // EVERY flag, not just the adamant body. Only diamond-body had wording,
      // so Krishna's shield rendered nothing at all on Krishna's own card, and
      // Vinda's bowstring rendered nothing either, which left his condition
      // ("While Anuvinda stands:") dangling on its own as a fragment.
      if (a.kind === 'addFlag') {
        const said = FLAG_LINE[a.flag]?.(a.flag === 'wheel-sunk' ? whose(eff.target) : whom(eff.target));
        if (said) lines.push(said);
      }
      if (a.kind === 'cleanse') lines.push('Lifts every penalty from your own lines.');
      if (a.kind === 'dismount') lines.push('Puts a chariot-warrior on foot (−2).');

      // EVERYTHING BELOW HAD NO WORDS AT ALL, and the gaps were not obscure:
      // `buff` alone is used by fourteen cards, so Krishna's +1 and Gandiva's
      // +3 were both invisible on their own cards. Seven cards rendered a
      // completely empty rules panel (Shakuni, Jayadratha, Yudhishthira, Sweta,
      // Shalya, Barbarika, Balarama): the player was shown a number, a tier and
      // a flavour line, and the entire card was hidden.
      // A negative buff is a real thing in the data: Shalya's whole card is
      // that he weakens the man he drives for. "+-3" was what that printed.
      if (a.kind === 'buff')
        lines.push(
          a.amount >= 0
            ? `Raises ${whom(eff.target)} by +${a.amount}.`
            : `Weakens ${whom(eff.target)} by ${a.amount}.`,
        );
      // Armour granted by a card, as opposed to armour a man was born in. Both
      // land in the same counter, so both must read the same way.
      if (a.kind === 'restore')
        lines.push(`Restores ${whom(eff.target)} to full strength.`);
      if (a.kind === 'armour')
        lines.push(`Clothes ${whom(eff.target)} in armour: turns aside the first ${a.amount} of harm.`);
      if (a.kind === 'debuffRow') {
        const own = a.rows.some((r) => r.side === 'own');
        const foe = a.rows.some((r) => r.side === 'enemy');
        const whose = own && foe ? 'both hosts' : own ? 'your own' : 'the enemy';
        const lasts = a.duration === 'lingering' ? ' for the rest of the battle' : ' this round';
        lines.push(
          a.amount >= 0
            ? `Steadies ${whose} line (+${a.amount})${lasts}.`
            : `Withers ${whose} line (${a.amount})${lasts}.`,
        );
      }
      if (a.kind === 'discard' && a.side === 'enemy')
        lines.push(`The enemy loses ${a.count} card${a.count === 1 ? '' : 's'} from hand, at random.`);
      if (a.kind === 'discard' && a.side === 'own')
        lines.push(`You lose ${a.count} card${a.count === 1 ? '' : 's'} from your own hand, at random.`);
      if (a.kind === 'discard' && a.side === 'both')
        lines.push(`Both hands lose ${a.count} card${a.count === 1 ? '' : 's'}, at random.`);
      if (a.kind === 'draw' && a.side === 'own')
        lines.push(`Draw ${a.count} card${a.count === 1 ? '' : 's'}.`);
      if (a.kind === 'draw' && a.side === 'enemy')
        lines.push(`The enemy draws ${a.count}.`);
      if (a.kind === 'denyPlay')
        lines.push(
          `Bars ${a.count} enemy card${a.count === 1 ? '' : 's'} from being played this round` +
            (a.sparingStrongest ? ', sparing their strongest.' : '.'),
        );
      if (a.kind === 'setPower') lines.push(`Sets ${whom(eff.target)} to ${a.value}.`);
      if (a.kind === 'reduceTo') lines.push(`Binds ${whom(eff.target)} down to ${a.value}.`);
      if (a.kind === 'burnOwnDeck')
        lines.push(`Tears ${a.count} of your own warriors out of the run, for good.`);
      if (a.kind === 'afflict' && a.side === 'own')
        lines.push('A shrap binds itself to you for the act.');
      if (a.kind === 'afflict' && a.side === 'enemy')
        lines.push('A shrap binds itself to the enemy.');
      if (a.kind === 'hazard' && a.hazard === 'narayana')
        lines.push('Hangs over their host and strikes again every round, harder each time. Passing lifts it.');
    }
    if (when && lines.length > before) {
      // Lower-case the first letter of the consequence so the joined sentence
      // reads as one: "In the round that decides the battle, he takes -4."
      const first = lines[before];
      lines[before] = `${cap(when).replace(/:$/, '')}, ${first[0].toLowerCase()}${first.slice(1)}`;
    } else if (when) {
      lines.push(cap(when));
    }
  }
  // A SKILL AT ARMS, spent on its own turn rather than triggered by playing him.
  // Every one of these already carried player-facing prose in the card data and
  // none of it was ever rendered, so Balarama's card was blank and nothing told
  // you he had a button at all. The text says its own charge cost.
  if (card.ability) lines.push(`${card.ability.name}: ${card.ability.text}`);
  // THE MENU, listed in full on the card face. A player choosing one of three
  // as he commits the man needs to have read all three before he gets there,
  // not discover them in a popup at the moment of the decision.
  if (card.valours?.length) {
    lines.push(
      card.valours.length > 1
        ? `As he takes the field he does one of these ${card.valours.length}.`
        : 'As he takes the field.',
    );
    for (const v of card.valours) lines.push(`${v.name}: ${v.text}`);
  }

  if (card.type === 'astra') {
    const tier = card.astraTier ?? 1;
    // EVERY SANSKRIT WORD IS GLOSSED THE FIRST TIME IT APPEARS, and the rank
    // lines are where a player meets most of them. "An elemental astra" told
    // nobody anything; "a divya-astra (a divine weapon)" tells them what kind of
    // thing they are holding before it tells them who may hold it.
    if (tier >= 3) {
      const holders = astraWielders(card.id);
      lines.push(
        `An ultimate divya-astra (divine weapon). ${
          holders.length ? `Borne by ${holders.join(' and ')}` : 'Given only by a god'
        }, or by any warrior who earns it through tapasya (penance at a shrine).`,
      );
    } else if (tier === 2) {
      lines.push(
        'A great divya-astra (divine weapon), of the Brahma line. Only a warrior ' +
          'trained to that rank can speak its mantra, or one who earns it through ' +
          'tapasya (penance at a shrine).',
      );
    } else {
      lines.push(
        'An elemental astra (a weapon of fire, water or wind). Any astra-trained ' +
          'warrior can loose it.',
      );
    }
  }
  // OUTSIDE the astra branch. This was nested inside it, so a warrior's answer
  // was accepted by the type, stored, validated, and then silently never shown.
  // Duryodhana's own card said his armour holds "until a vow strips it from
  // him", which tells you a vow exists and not whose, and the answer lived only
  // on Bhima's card where a Kaurava player would never look.
  if (card.counteredBy?.length)
    lines.push(
      card.type === 'astra'
        ? `Answered by: ${card.counteredBy.map(nameOf).join(', ')} in the enemy hand.`
        : `Answered by: ${card.counteredBy.map(nameOf).join(', ')}, and by no one else.`,
    );
  if (card.astraMastery)
    lines.push(`An astra-master, trained to tier ${card.astraMastery}.`);
  if (card.knownAstras?.length)
    lines.push(`Bears the ${card.knownAstras.map(nameOf).join(', ')}.`);
  if (card.cost?.consequence) lines.push(card.cost.consequence);
  return lines;
}

/**
 * The DISPLAYED name of a card, from the card itself.
 *
 * titleize() turns an id into title case, which is right for a word like
 * shikhandi and wrong the moment a name and an id differ: Drona's card told
 * the player to look for "Ashwatthama Elephant", and the card is called
 * "Ashwatthama is Dead". Sending a player hunting for a card that does not
 * exist is worse than saying nothing.
 */
function nameOf(id: string): string {
  try {
    return getCard(id).name;
  } catch {
    return titleize(id);
  }
}

function titleize(id: string): string {
  return id
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
