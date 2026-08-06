// The run layer sits ABOVE the battle engine. A run is a sequence of battles
// fought by one persistent host: what you win you keep, what you spend is gone,
// and a single defeat ends it. The battle engine is untouched; the run just
// builds each GameState from the current roster and folds the result back in.
//
// Like the engine, this file is PURE: no React, no DOM, no storage.
import type { CardId, CurseId, House } from '@engine/types';

/** One fight on the ladder: who you face and how strong they are. */
export interface Encounter {
  id: string;
  name: string;
  house: House;
  /** The opponent's deck for this fight, already scaled for difficulty. */
  deckCards: CardId[];
  boss?: boolean;
}

export type RunPhase = 'map' | 'reward' | 'shrine' | 'won' | 'lost';

/** A warrior away at tapasya, and what they will return bearing. */
export interface Penance {
  warrior: CardId;
  deityId: string;
  /**
   * Rolled the moment the wager is accepted, so the run stays deterministic and
   * replayable, but not revealed until he returns. Null means the god was not
   * satisfied and he comes back empty-handed.
   */
  astra: CardId | null;
  battles: number;
  /** Ladder index at which they rejoin the host. */
  returnsAt: number;
}

/** A choice offered after a victory. */
export interface RewardOption {
  kind: 'recruit' | 'cleanse';
  label: string;
  text: string;
  cardId?: CardId; // for 'recruit'
}

export interface RunState {
  seed: number;
  /** The player's chosen host. */
  house: House;
  /** The persistent card pool. Grows by recruiting, shrinks when spent or burnt. */
  roster: CardId[];
  /** The escalating sequence of fights. */
  ladder: Encounter[];
  /** Index of the next fight to face. */
  index: number;
  phase: RunPhase;
  /** Cards spent for the whole run: great astras loosed, warriors burnt. */
  banned: CardId[];
  /**
   * Astras drawn onto a lightning rod rather than spent on a target. Banned
   * like the rest, but the next warrior home from penance brings them back.
   * Always a subset of `banned`.
   */
  suspended: CardId[];
  /** A curse earned last battle, clinging to the player through the next one. */
  pendingCurses: CurseId[];
  /** Battles won this run. */
  depth: number;
  /** The three choices offered after the last win, if we are in 'reward'. */
  rewardChoices?: RewardOption[];
  /** Warriors currently away at penance. They do not fight while absent. */
  away: Penance[];
  /**
   * The cards chosen to march in the next battle, if the player has chosen.
   *
   * Absent means "field everything available", which is what the run always
   * did and what makes winning WORSE: the roster grows by one card per victory
   * while the opening hand stays at six, so a specific card went from 53% to
   * appear at the start to 40% by the sixth battle. Choosing caps the deck, so
   * a card you win replaces one you cut instead of diluting the ones you have.
   */
  marching?: CardId[];
  /** Astras learned through tapasya (warrior card id -> astra ids). */
  astraGrants: Record<CardId, CardId[]>;
  /** Warriors who returned from penance since the last map view, for the UI. */
  returned?: Penance[];
  /** What the shrine offers, if we are in 'shrine'. */
  shrineOffers?: import('./shrine').ShrineOffer[];
}
