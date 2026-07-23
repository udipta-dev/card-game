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
  if (t.pick === 'unitByCard') checkCardRef(card.id, t.card, 'unitByCard.card', errs);
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
  return errs;
}
