// ============================================================================
// Kurukshetra rules engine, core data model.
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

export type House = 'pandava' | 'kaurava' | 'neutral' | 'asura';

/** Canon warrior ranking from the Bhishma Parva. Drives base power tiers. */
export type Tier = 'rathi' | 'atirathi' | 'maharathi';

export type CardType = 'unit' | 'astra' | 'boon' | 'curse';

/** Stable content id, e.g. 'bhishma'. */
export type CardId = string;
/** Stable curse id, e.g. 'kin_slayer'. See engine/curses.ts. */
export type CurseId = string;
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
  /**
   * Deck-building power budget cost (Gwent-style provisions). Higher = stronger.
   * Used to keep decks balanced and to weight the balance lab's readouts.
   */
  provision?: number;
  /**
   * For astras: the canonical power tier. 1 = elemental (Agneya, Varuna, Naga...),
   * 2 = the Brahma line and great weapons, 3 = the ultimates (Pashupata,
   * Narayana, Vaishnava, Brahmashirsha, Vasavi Shakti).
   */
  astraTier?: number;
  /**
   * For warriors: the highest astra tier they were trained to invoke (0..2).
   * Rank grants the common weapons (tiers 1 and 2). The tier-3 ultimates are
   * never granted by rank, only by a named boon in `knownAstras`.
   */
  astraMastery?: number;
  /**
   * For warriors: specific astras granted by a named boon regardless of rank
   * (Arjuna's Pashupata, Karna's Vasavi, Ashwatthama's Narayana, Bhagadatta's
   * Vaishnava). This is how the tier-3 ultimates are unlocked.
   */
  knownAstras?: CardId[];
  /**
   * For astras: the astra ids that negate this one. If the defender holds any
   * of them in hand when this resolves, theirs is spent and this one fizzles
   * (the canonical counter-web: Naga vs Garuda, Agni vs Varuna, Brahma vs Brahma).
   */
  counteredBy?: CardId[];
  /**
   * A warrior's ordinary skill at arms: arrow rain, a mace strike, a firebolt.
   * Limited uses per battle, replenished the next battle. These exist so that
   * making the divyastras rare does not leave an ordinary battle flat, and so
   * that a maharathi still feels like one with no astra in hand.
   */
  ability?: Ability;
  /** Free-form tags for bond/synergy (clan, squad, "rakshasa", "vrishni", ...). */
  tags?: string[];
  /** Path under public/art/cards/. Undefined => placeholder frame. */
  art?: string;
  flavor?: string;
}

// ---------------------------------------------------------------------------
// Keywords, sticky, always-on abilities. Generic mechanics, card-specific data.
// ---------------------------------------------------------------------------

/** A repeatable, limited-use skill a fielded warrior may spend a turn on. */
export interface Ability {
  name: string;
  /** Shown on the card and in the ability button. */
  text: string;
  /** Uses per battle. Refreshed when the next battle begins, not each round. */
  charges: number;
  target: TargetSelector;
  actions: EffectAction[];
}

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
  | { kind: 'noAstrasInFinalRound' }
  // Chiranjivi (Ashwatthama, Kripa, Kritavarma, ...): cannot be destroyed at all.
  | { kind: 'deathless' }
  // Grows in strength each round it survives (rakshasa night-strength, etc.).
  | { kind: 'nightGrowth'; amount: number }
  // +power for each other allied unit sharing a tag (squads, clans).
  | { kind: 'bond'; tag: string; amount: number };

export type KeywordKind = Keyword['kind'];

// ---------------------------------------------------------------------------
// Effects, data descriptors resolved by the registry.
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
  // The price of an adharmic weapon: permanently burn `count` cards out of the
  // firer's own deck. Pashupatastra wins the battle, but at this cost.
  | { kind: 'burnOwnDeck'; count: number }
  // Loosing a Brahma-line weapon is an act of adharma. Draws one curse at
  // random from `pool` onto the firer. See engine/curses.ts.
  | { kind: 'afflict'; pool: CurseId[]; side: 'own' | 'enemy' }
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
  // Every unit the actor owns. Brahmashirsha consumes its wielder's host too.
  | { pick: 'allOwnUnits' }
  // Every unit on the field, both hosts. Utter destruction.
  | { pick: 'allUnits' }
  | { pick: 'enemyRow'; row: Row }
  // Enemy units in the row this astra was played into.
  | { pick: 'enemyRowSameAsPlayed' }
  // Own units in the row(s) adjacent to where this astra was played.
  | { pick: 'ownAdjacentToPlayed' }
  // A specific named card on a given side (Shalya finds Karna, Dhrishtadyumna finds Drona).
  | { pick: 'unitByCard'; side: 'own' | 'enemy'; card: CardId }
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
// Whole-match state, the reducer's value. Fully serializable & deterministic.
// ---------------------------------------------------------------------------

export type Phase = 'mulligan' | 'playing' | 'roundEnd' | 'battleEnd';

export interface GameState {
  seed: number; // PRNG state, advances deterministically
  phase: Phase;
  activeSeat: Seat;
  /** The seat that moved first in round 1 (gets a catch-up draw). */
  firstMover: Seat;
  round: number; // 1..3
  totalRounds: number; // best-of, default 3 (win 2)
  roundWins: Record<Seat, number>;
  passed: Record<Seat, boolean>;
  board: Record<Seat, Record<Row, InstanceId[]>>;
  instances: Record<InstanceId, CardInstance>;
  hands: Record<Seat, InstanceId[]>;
  decks: Record<Seat, InstanceId[]>;
  rowMods: RowModifier[];
  /**
   * Cards spent for the rest of the run. A great astra fires once: the arsenal
   * empties. Enforced in isLegalPlay, so a banned card can never be played again.
   */
  bannedThisRun: CardId[];
  /** Curses each seat carries from its own acts of adharma. */
  curses: Record<Seat, CurseId[]>;
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
  | { type: 'USE_ABILITY'; iid: InstanceId; targets?: InstanceId[] }
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
  | { t: 'countered'; astra: CardId; by: CardId; seat: Seat }
  | { t: 'debuffRow'; seat: Seat; row: Row; amount: number }
  | { t: 'attach'; boon: InstanceId; to: InstanceId }
  | { t: 'ban'; cardId: CardId }
  | { t: 'ability'; iid: InstanceId; cardId: CardId; name: string; left: number }
  | { t: 'afflict'; seat: Seat; curse: CurseId; name: string; text: string }
  | { t: 'burn'; seat: Seat; cardIds: CardId[] }
  // Two great astras meet. Both hosts are scoured; the wielder who never
  // learned to withdraw his weapon pays the greater price.
  | { t: 'clash'; astra: CardId; against: CardId; blast: number; unwithdrawn: Seat | null }
  | { t: 'flag'; iid: InstanceId; flag: string; on: boolean }
  | { t: 'roundEnd'; round: number; scores: Record<Seat, number>; winner: Seat | 'tie' }
  | { t: 'battleEnd'; winner: Seat; reason: string };
