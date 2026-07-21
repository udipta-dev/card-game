// ============================================================================
// Kurukshetra rules engine — core data model.
//
// This file is PURE: no React, no DOM, no network. Everything the engine and
// the AI operate on is defined here. The central idea: card behaviour is DATA
// (serializable effect descriptors + keyword tags), resolved by a small set of
// pure handlers. No card gets a bespoke branch in the engine.
// ============================================================================

export type Seat = 'player' | 'ai';

/** The Chaturanga (four-fold army) rows. */
export type Row = 'ratha' | 'gaja' | 'padati';
export const ROWS: Row[] = ['ratha', 'gaja', 'padati'];

export type House = 'pandava' | 'kaurava' | 'neutral';

/** Canon warrior ranking from the Bhishma Parva. Drives base power tiers. */
export type Tier = 'rathi' | 'atirathi' | 'maharathi';

export type CardType = 'unit' | 'astra' | 'boon' | 'curse';

/** Stable content id, e.g. 'bhishma'. */
export type CardId = string;
/** Unique per placed/held card instance. */
export type InstanceId = string;

// ---------------------------------------------------------------------------
// Static card definition (lives in content/, never mutated)
// ---------------------------------------------------------------------------

export interface Card {
  id: CardId;
  name: string;
  house: House;
  type: CardType;
  tier?: Tier;
  /** Base power 1..10. Astras/boons are typically 0. */
  basePower: number;
  /** Legal rows this card may be played to. Astras that hit anywhere list all. */
  rows: Row[];
  /** Always-on ability tags evaluated generically by the engine. */
  keywords: Keyword[];
  /** Triggered/one-shot effects. */
  effects: EffectDef[];
  /** Astra invocation cost/consequence. */
  cost?: InvocationCost;
  /** Path under public/art/cards/. Undefined => placeholder frame. */
  art?: string;
  flavor?: string;
}

// ---------------------------------------------------------------------------
// Keywords — sticky, always-on abilities. Generic mechanics, card-specific data.
// ---------------------------------------------------------------------------

export type Keyword =
  // Bhishma: cannot be removed until `unlessCardOnBoard` is on the board.
  | { kind: 'icchamrityu'; unlessCardOnBoard: CardId }
  // Drona: immune until `card` is played, then power is set to `thenSetPower`.
  | { kind: 'immuneUntilPlayed'; card: CardId; thenSetPower: number }
  // Karna's Kavacha-Kundala: absorbs the next `amount` of removal/damage.
  | { kind: 'armor'; amount: number }
  // Abhimanyu: once trapped (flag set), cannot be withdrawn and will die.
  | { kind: 'trapped' }
  // Karna's curse: this card cannot invoke astras during the final round.
  | { kind: 'noAstrasInFinalRound' };

export type KeywordKind = Keyword['kind'];

// ---------------------------------------------------------------------------
// Effects — data descriptors resolved by the registry.
// ---------------------------------------------------------------------------

export interface EffectDef {
  on: TriggerEvent;
  /** Optional gate, evaluated against the resolved target + state. */
  condition?: Condition;
  target: TargetSelector;
  /** Ordered mutations applied to each resolved target. */
  actions: EffectAction[];
}

export type TriggerEvent =
  | 'onPlay'
  | 'onRoundStart'
  | 'onRoundEnd'
  | 'onDestroyAttempt'
  | 'onTurnStart';

export type EffectAction =
  | { kind: 'damage'; amount: number }
  | { kind: 'setPower'; value: number }
  | { kind: 'buff'; amount: number }
  | { kind: 'destroy' }
  | {
      kind: 'debuffRow';
      amount: number;
      rows: RowRef[];
      duration: 'round' | 'lingering';
    }
  | { kind: 'banFromRun'; card: CardId }
  | { kind: 'winBattle' }
  | { kind: 'addFlag'; flag: string }
  | { kind: 'removeFlag'; flag: string }
  | { kind: 'preventDestroy'; reason: string };

export type EffectActionKind = EffectAction['kind'];

/** A row reference relative to the acting card's owner. */
export type RowRef =
  | { side: 'enemy' | 'own'; row: Row }
  // The row the acting card was played into (astras land in a row).
  | { side: 'enemy' | 'own'; sameAsPlayed: true }
  // Rows adjacent (by index) to where the acting card was played.
  | { side: 'enemy' | 'own'; adjacentToPlayed: true };

export type TargetSelector =
  | { pick: 'self' }
  | { pick: 'none' }
  | { pick: 'highestEnemyUnit' }
  | { pick: 'lowestEnemyUnit' }
  | { pick: 'allEnemyUnits' }
  | { pick: 'enemyRow'; row: Row }
  // Enemy units in the row this astra was played into.
  | { pick: 'enemyRowSameAsPlayed' }
  // Own units in the row(s) adjacent to where this astra was played.
  | { pick: 'ownAdjacentToPlayed' }
  | { pick: 'chosen'; filter: UnitFilter };

export interface UnitFilter {
  side?: 'enemy' | 'own' | 'any';
  rows?: Row[];
  type?: CardType;
}

export type Condition =
  | { q: 'cardOnBoard'; card: CardId; side?: 'own' | 'enemy' | 'any' }
  | { q: 'isFinalRound' }
  | { q: 'targetHasBoon'; boon: CardId }
  | { q: 'targetHasFlag'; flag: string }
  | { q: 'not'; c: Condition }
  | { q: 'and'; cs: Condition[] }
  | { q: 'or'; cs: Condition[] };

export interface InvocationCost {
  /** Cards discarded from hand to invoke. */
  discardCards?: number;
  /** Human-readable consequence, shown in UI. */
  consequence?: string | null;
}

// ---------------------------------------------------------------------------
// Runtime instance on the board / in hand
// ---------------------------------------------------------------------------

export interface CardInstance {
  iid: InstanceId;
  cardId: CardId;
  owner: Seat;
  /** null while in hand or deck. */
  row: Row | null;
  /** Current power after buffs/debuffs/setPower. */
  currentPower: number;
  /** Absorbed the base power once played, so buffs stack correctly. */
  flags: Set<string>;
  /** Attached boon instance ids (e.g. Krishna-charioteer). */
  boons: InstanceId[];
  /** If this instance is a boon, which unit it is attached to. */
  attachedTo?: InstanceId;
  counters: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Row-level lingering modifiers (Brahmastra scorched earth, etc.)
// ---------------------------------------------------------------------------

export interface RowModifier {
  seat: Seat;
  row: Row;
  amount: number; // negative = debuff
  duration: 'round' | 'lingering';
  source: CardId;
}

// ---------------------------------------------------------------------------
// Whole-match state — the reducer's value. Fully serializable & deterministic.
// ---------------------------------------------------------------------------

export type Phase = 'mulligan' | 'playing' | 'roundEnd' | 'battleEnd';

export interface GameState {
  seed: number; // PRNG state — advances deterministically
  phase: Phase;
  activeSeat: Seat;
  round: number; // 1..3
  totalRounds: number; // best-of, default 3 (win 2)
  roundWins: Record<Seat, number>;
  passed: Record<Seat, boolean>;
  board: Record<Seat, Record<Row, InstanceId[]>>;
  instances: Record<InstanceId, CardInstance>;
  hands: Record<Seat, InstanceId[]>;
  decks: Record<Seat, InstanceId[]>;
  rowMods: RowModifier[];
  bannedThisRun: CardId[];
  /** Set when a card forces an immediate battle result (Pashupatastra). */
  forcedWinner: Seat | null;
  winner: Seat | null;
  mulliganDone: Record<Seat, boolean>;
  log: GameEvent[];
}

// ---------------------------------------------------------------------------
// Actions (player/AI inputs) & events (engine outputs, drive UI + tests)
// ---------------------------------------------------------------------------

export type Action =
  | { type: 'PLAY_CARD'; iid: InstanceId; row: Row; targets?: InstanceId[] }
  | { type: 'PASS'; seat: Seat }
  | { type: 'MULLIGAN'; seat: Seat; iids: InstanceId[] };

export type GameEvent =
  | { t: 'roundStart'; round: number }
  | { t: 'play'; seat: Seat; iid: InstanceId; cardId: CardId; row: Row }
  | { t: 'pass'; seat: Seat }
  | { t: 'mulligan'; seat: Seat; count: number }
  | { t: 'damage'; iid: InstanceId; amount: number; power: number }
  | { t: 'setPower'; iid: InstanceId; value: number }
  | { t: 'buff'; iid: InstanceId; amount: number; power: number }
  | { t: 'destroy'; iid: InstanceId; cardId: CardId }
  | { t: 'preventDestroy'; iid: InstanceId; reason: string }
  | { t: 'redirected'; source: CardId; reason: string }
  | { t: 'debuffRow'; seat: Seat; row: Row; amount: number }
  | { t: 'attach'; boon: InstanceId; to: InstanceId }
  | { t: 'ban'; cardId: CardId }
  | { t: 'flag'; iid: InstanceId; flag: string; on: boolean }
  | { t: 'roundEnd'; round: number; scores: Record<Seat, number>; winner: Seat | 'tie' }
  | { t: 'battleEnd'; winner: Seat; reason: string };
