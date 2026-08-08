import type {
  Card,
  CardId,
  Condition,
  EffectAction,
  Keyword,
  TargetSelector,
} from '@engine/types';
import { EFFECT_ACTION_KINDS } from '@engine/effects/handlers';
import { CARD_DB, allCards } from './cards';
import { DECKS } from './decks';

// Runtime guardrail: every card references only real CardIds and known effect
// action kinds. Runs as a unit test so a malformed card fails CI, not a match.

export interface ContentError {
  cardId: CardId;
  message: string;
}

function checkCardRef(id: CardId, ref: CardId, ctx: string, errs: ContentError[]): void {
  if (!CARD_DB[ref]) errs.push({ cardId: id, message: `${ctx} references unknown card '${ref}'` });
}

function checkKeyword(card: Card, kw: Keyword, errs: ContentError[]): void {
  switch (kw.kind) {
    case 'icchamrityu':
      checkCardRef(card.id, kw.unlessCardOnBoard, 'icchamrityu.unlessCardOnBoard', errs);
      break;
    case 'immuneUntilPlayed':
      checkCardRef(card.id, kw.card, 'immuneUntilPlayed.card', errs);
      break;
    case 'armor':
    case 'trapped':
    case 'noAstrasInFinalRound':
    case 'deathless':
    case 'nightGrowth':
    case 'bond':
    // Names no other card, so there is no reference to validate: it only makes
    // the card carrying it the thing an enemy astra lands on.
    case 'drawsAstra':
    // Names no other card either: it is a floor, expressed on the card itself.
    case 'unwoundable':
      break;
    default: {
      const _exhaustive: never = kw;
      void _exhaustive;
    }
  }
}

function checkCondition(card: Card, c: Condition, errs: ContentError[]): void {
  switch (c.q) {
    case 'cardOnBoard':
      checkCardRef(card.id, c.card, 'condition.cardOnBoard', errs);
      break;
    case 'targetHasBoon':
      checkCardRef(card.id, c.boon, 'condition.targetHasBoon', errs);
      break;
    case 'not':
      checkCondition(card, c.c, errs);
      break;
    case 'and':
    case 'or':
      c.cs.forEach((sub) => checkCondition(card, sub, errs));
      break;
    case 'isFinalRound':
    case 'targetHasFlag':
      break;
  }
}

function checkTarget(card: Card, t: TargetSelector, errs: ContentError[]): void {
  if (t.pick === 'chosen' && t.filter.rows) {
    for (const r of t.filter.rows) {
      if (!['ratha', 'gaja', 'padati'].includes(r))
        errs.push({ cardId: card.id, message: `chosen.filter references bad row '${r}'` });
    }
  }
  if (t.pick === 'unitByCard') {
    // Either form, and at least one of them: a selector naming nobody would
    // silently target nothing, which is the class of bug this file exists for.
    const named = t.cards ?? (t.card ? [t.card] : []);
    if (!named.length)
      errs.push({ cardId: card.id, message: 'unitByCard names neither card nor cards' });
    for (const id of named) checkCardRef(card.id, id, 'unitByCard', errs);
  }
}

function checkAction(card: Card, a: EffectAction, errs: ContentError[]): void {
  if (!EFFECT_ACTION_KINDS.has(a.kind))
    errs.push({ cardId: card.id, message: `unknown effect action kind '${a.kind}'` });
  if (a.kind === 'banFromRun') checkCardRef(card.id, a.card, 'banFromRun.card', errs);
}

export function validateContent(): ContentError[] {
  const errs: ContentError[] = [];
  for (const card of allCards()) {
    if (card.basePower < 0 || card.basePower > 10)
      errs.push({ cardId: card.id, message: `basePower ${card.basePower} out of range 0..10` });
    if (card.rows.length === 0)
      errs.push({ cardId: card.id, message: 'card has no legal rows' });
    card.keywords.forEach((kw) => checkKeyword(card, kw, errs));
    // onRoundStart runs AFTER the board has been wiped for the new round, so a
    // warrior standing there when it fires is a warrior who does not exist. It
    // is not a weak trigger, it is an unreachable one, and Raktabija carried an
    // effect on it that never fired in any game ever played. onRoundEnd is the
    // one that works: it runs while the field is still standing.
    for (const eff of card.effects)
      if (eff.on === 'onRoundStart')
        errs.push({
          cardId: card.id,
          message:
            'effect uses onRoundStart, which fires after the board is cleared and can never see this card. Use onRoundEnd.',
        });
    for (const a of card.knownAstras ?? []) {
      if (!CARD_DB[a]) errs.push({ cardId: card.id, message: `knownAstras references unknown card '${a}'` });
      else if (CARD_DB[a].type !== 'astra')
        errs.push({ cardId: card.id, message: `knownAstras '${a}' is not an astra` });
    }
    for (const a of card.counteredBy ?? []) {
      if (!CARD_DB[a]) errs.push({ cardId: card.id, message: `counteredBy references unknown card '${a}'` });
    }
    for (const eff of card.effects) {
      checkTarget(card, eff.target, errs);
      if (eff.condition) checkCondition(card, eff.condition, errs);
      eff.actions.forEach((a) => checkAction(card, a, errs));
    }
  }
  errs.push(...checkDecksCanWieldTheirAstras());
  return errs;
}

/**
 * NO ASTRA WITHOUT A WIELDER.
 *
 * An astra is not a spell. It has to be loosed by a warrior trained to its
 * tier, or by one who holds it by name. So a deck containing the Brahma-Astra
 * and nobody who can invoke it is holding a brick: the card can never be
 * played, and the deck is quietly a card short all game.
 *
 * Every starter satisfies this today, but by luck rather than by rule, and
 * nothing stopped the next deck edit from breaking it silently. Two are only
 * one warrior deep already: Vasavi Shakti needs Karna and Vaishnava needs
 * Indrajit, so losing that one man bricks the card.
 *
 * NOTE the deliberate gap: this checks the DECK, not the hand. Drawing an
 * astra while its wielder is still in the deck is a real risk and it is
 * supposed to be. This only rules out the deck that could never work at all.
 */
export function checkDeckAstras(deck: { id: string; cards: CardId[] }): ContentError[] {
  const errs: ContentError[] = [];
  {
    const units = deck.cards.map((id) => CARD_DB[id]).filter((c) => c?.type === 'unit');
    for (const id of deck.cards) {
      const card = CARD_DB[id];
      if (!card || card.type !== 'astra') continue;
      const tier = card.astraTier ?? 1;
      const canWield = units.some(
        (u) => (u.astraMastery ?? 0) >= tier || (u.knownAstras ?? []).includes(id),
      );
      if (!canWield) {
        errs.push({
          cardId: id,
          message: `deck '${deck.id}' holds ${card.name} (tier ${tier}) but no warrior in it can invoke it`,
        });
      }
    }
  }
  return errs;
}

export function checkDecksCanWieldTheirAstras(): ContentError[] {
  return Object.values(DECKS).flatMap((d) => checkDeckAstras(d));
}
