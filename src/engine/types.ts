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

// 'legend' holds the figures who never took the field for either host, whether
// they were kept off it (Barbarika, beheaded before the war), died before it
// (Jarasandha, Ekalavya, Shishupala), or refused it (Balarama, Rukmi).
export type House = 'pandava' | 'kaurava' | 'neutral' | 'asura' | 'legend';

/**
 * Warrior rank. Drives base power AND deck cost, via TIER_PROVISION.
 *
 * DELIBERATELY NOT THE EPIC'S LADDER, and this is not a bug to be fixed.
 * Bhishma's enumeration (Udyoga Parva CLXVI-CLXXIII, not Bhishma Parva as this
 * comment used to say) counts in three grades: ardharatha < ratha < atiratha.
 * He closes by naming exactly those: "The Rathas and Atirathas, according to
 * their precedence, have now been declared by me to thee, and they also that
 * are half Rathas."
 *
 * MAHARATHA IS NEVER A COUNTING TIER THERE. Bhishma uses it as loose praise and
 * applies it to 22 people, including several obscure Panchala nobles, while
 * reserving ATIRATHA for only 8: Kritavarma, Shalya and Bahlika on one side,
 * Dhrishtadyumna, Satyajit, Srenimat, king Vasudeva and Kuntibhoja on the
 * other. Neither Bhishma, Drona, Karna nor Arjuna is among them. Karna he rates
 * ardharatha, half a ratha, which is the famous insult; Drona concurs, and
 * Sanjaya later retorts that Karna "is equal to two Maharathas". Arjuna he
 * refuses to grade at all, saying no such car-warrior was ever born or will be.
 * The one exchange rate the text gives is "equal to eight Rathas... he is an
 * Atiratha".
 *
 * We use rathi < atirathi < maharathi because that is what every modern reader
 * and retelling means by the words. Matching the epic here would invert player
 * expectation for a subtlety almost nobody knows. Recorded so it is not
 * "corrected" later.
 */
export type Tier = 'rathi' | 'atirathi' | 'maharathi';

/**
 * What a card IS. The taxonomy was three types doing five jobs: the 'curse'
 * type held five cards of which four were boons and one was a stratagem, and
 * there were no real curse cards at all (curses live in the run layer, in
 * engine/curses.ts).
 *
 *  unit      a warrior on the field
 *  astra     a missile invoked by mantra. Deity- or effect-named
 *  shastra   a NAMED physical weapon carried by hand: Gandiva, Asi, Sudarsana.
 *            Rarer than astras: a sweep of the whole epic for "sword/mace/
 *            discus called X" returns only three names
 *  boon      a vardaan, a divine gift taken at a shrine
 *  curse     a shrap bound to a card. Reserved; nothing uses it yet
 *  stratagem a trick rather than a weapon: "Ashwatthama is dead"
 */
export type CardType = 'unit' | 'astra' | 'shastra' | 'boon' | 'curse' | 'stratagem';

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
   * TAUGHT or CARRIED.
   *
   * Most divyastras are knowledge: a mantra, learned from a god or a master.
   * Arjuna does not carry the Pashupata about, he KNOWS it, so there is no
   * object to hand him and knowing it is already enough (see canInvokeAstra).
   *
   * A few are physical things that changed hands. Karna's Vasavi is a dart
   * Indra gave him in exchange for the armour off his body. Bhagadatta's
   * Vaishnava was hurled as an ankusha and came down to him by inheritance.
   * Those, and only those, arrive with their bearer.
   *
   * Without the distinction, committing Arjuna put a battle-winning Pashupata
   * on top of his own deck and he measured 64.1% win when played.
   */
  carried?: boolean;
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
  // Raktabija: wounding him is how you lose. Damage cannot lower him at all,
  // so the only answer is to remove him outright.
  | { kind: 'unwoundable' }
  // +power for each other allied unit sharing a tag (squads, clans).
  | { kind: 'bond'; tag: string; amount: number }
  // The lightning rod. While he stands, an enemy astra that gets through takes
  // HIM instead of what it was aimed at, and the weapon is spent doing it.
  //
  // This is the whole of Ghatotkacha. Indra built him "as a fit antagonist of
  // Karna, IN CONSEQUENCE OF THE DART he had given unto Karna" (Adi CLV): the
  // boy exists to make that weapon miss Arjuna. Krishna danced on the terrace
  // of his own chariot when it worked, because "the man does not exist in this
  // world that could not stay before Karna armed with that dart" (Drona CLXXX).
  // The weapon was not wasted on a lesser target by accident. That was the plan.
  | { kind: 'drawsAstra' };

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

/**
 * Events the engine actually dispatches. Nothing else belongs here.
 *
 * 'onDestroyAttempt' and 'onTurnStart' used to sit in this list with no
 * dispatcher behind either, so a card could declare an effect on them, pass
 * typecheck, pass content validation, and silently never fire. That is the same
 * failure that made Drona unkillable and left twelve cards unobtainable: legal
 * but unreachable. Removing them turns a silent no-op into a compile error.
 *
 * Destroy interception is real, but it lives in keywords (attemptDestroy), not
 * in the effect system. If an effect-driven version is ever wanted, add the
 * trigger AND the dispatcher in the same change.
 */
export type TriggerEvent = 'onPlay' | 'onRoundStart' | 'onRoundEnd';

export type EffectAction =
  | { kind: 'damage'; amount: number }
  | { kind: 'setPower'; value: number }
  // Lowers only, never raises, and respects the undying floor. The Naga weapon
  // binds a great warrior down; it cannot make a weak one stronger.
  | { kind: 'reduceTo'; value: number }
  // Leaves a standing threat on the enemy side rather than resolving now.
  | { kind: 'hazard'; hazard: 'narayana' }
  // ---- GUILE: the hand and the deck, not the board -----------------------
  // Every action above operates on warriors standing on the field, which is
  // why every schemer in the game collapsed into a debuff: reducing enemy
  // power was the only thing the engine could express. The epic's answer to
  // strength is almost never more strength - it is a disarm, a legalism or a
  // targeting restriction. Krishna calls his own engineered kills
  // "the employment of means" (Drona CLXXXI).
  | { kind: 'discard'; count: number; side: 'own' | 'enemy' | 'both' }
  | { kind: 'draw'; count: number; side: 'own' | 'enemy' }
  // Deny a specific enemy warrior for the rest of the round: he cannot be
  // committed. The targeting restriction, not damage.
  //
  // `sparingStrongest` never denies the enemy's best card, which is Shiva's
  // boon to Jayadratha word for word: "Except Dhananjaya, the son of Pritha,
  // thou shalt in battle check the four other sons of Pandu" (Drona P. XLI).
  // A blocker with a named hole in it is a different card from a blocker.
  | { kind: 'denyPlay'; count: number; sparingStrongest?: boolean }
  // DISMOUNT: put a chariot-warrior on his feet. Not damage and not removal,
  // he keeps every point of his power and loses the row he was standing in,
  // along with anything that row was carrying.
  //
  // "Deprived of his car" is the single most common DECISIVE non-kill outcome
  // in the war: 69 paragraphs, against 50 for cutting off an arm or a head. A
  // rathi who loses his chariot is not dead, he is demoted, and a game with
  // three rows has somewhere to put him. (Ganguli says "car" throughout; that
  // is 1883 English for ratha, not a motor vehicle.)
  | { kind: 'dismount' }
  // CLEANSE: strip every penalty laid on your own rows. Nothing in the game
  // could undo a row debuff, so scorching a line was permanent by default and
  // the whole `debuffRow` layer was one-directional. Gwent has had a card that
  // clears hazards since the beginning, for the same reason.
  | { kind: 'cleanse' }
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
  // A divyastra devastates a LINE, and it does not care whose line it is: the
  // chariots burn, whoever's chariots they are. This is what makes an astra a
  // real decision (which formation can I afford to lose men in?) rather than a
  // targeted spell.
  | { pick: 'lineBothSides'; row: Row }
  | { pick: 'lineBothSidesSameAsPlayed' }
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

export type Phase =
  | 'mulligan'
  | 'playing'
  /**
   * An astra is in the air and the defender holds something that answers it.
   * The battle STOPS here and asks. Spending a counter costs the card, scours
   * both hosts, and may curse you, so it must never happen without consent.
   */
  | 'awaitingCounter'
  | 'roundEnd'
  | 'battleEnd';

/**
 * A weapon that does not resolve and end, but STAYS on the field.
 *
 * The Narayanastra is the only thing in either epic that works like this: it
 * grows stronger the more you resist it, and Krishna's order was to drop every
 * weapon and lie down, because "if you stand weaponless on the earth, this
 * weapon will not slay you" (Drona Parva CC). Bhima refused, kept fighting,
 * and was mauled.
 *
 * So it is not damage. It is a standing threat with a published way out that
 * costs you the round.
 */
export interface Hazard {
  kind: 'narayana';
  /** The side it hangs over. */
  victim: Seat;
  /** How many times it has already struck. Damage climbs with each. */
  struck: number;
}

/** An astra in flight, waiting on the defender's decision. */
export interface PendingCounter {
  /** The astra that was played. */
  astraIid: InstanceId;
  astraCardId: CardId;
  /** Who fired it. */
  firer: Seat;
  /** The card in the defender's hand that could answer. */
  counterHid: InstanceId;
  counterCardId: CardId;
  /** The row it was played into, needed to resolve effects if not countered. */
  row: Row;
}

export interface GameState {
  seed: number; // PRNG state, advances deterministically
  phase: Phase;
  /** Set while phase === 'awaitingCounter'. */
  pendingCounter?: PendingCounter;
  /** Weapons still hanging over the field. See Hazard. */
  hazards: Hazard[];
  activeSeat: Seat;
  /** The seat that moved first in round 1 (gets a catch-up draw). */
  firstMover: Seat;
  round: number; // 1..3
  totalRounds: number; // best-of, default 3 (win 2)
  roundWins: Record<Seat, number>;
  passed: Record<Seat, boolean>;
  /** One trade-back per seat per round, rounds 2 and 3 only. */
  roundSwap: Record<Seat, boolean>;
  /** Set once a seat has played a card this round; a swap after that would be
   *  an information play, not a mulligan. */
  playedThisRound: Record<Seat, boolean>;
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
  /**
   * Astras SUSPENDED rather than spent: banned like the above, but returned to
   * the arsenal the next time a warrior comes home from penance. A weapon that
   * Ghatotkacha drew onto himself was not used up, it was wasted, and going
   * back up the mountain is how you recover from that.
   *
   * Always a subset of bannedThisRun, so nothing has to check two lists to
   * decide whether a card is playable right now.
   */
  suspendedThisRun: CardId[];
  /** Transient: an astra just drawn onto a lightning rod, awaiting suspension. */
  wastedAstra?: CardId;
  /** Curses each seat carries from its own acts of adharma. */
  curses: Record<Seat, CurseId[]>;
  /**
   * Astras a warrior has LEARNED during a run (warrior card id -> astra ids),
   * beyond what their card data grants. This is how tapasya pays out: Bhima
   * returns from Vayu bearing a weapon Bhima never started with.
   */
  astraGrants: Record<Seat, Record<CardId, CardId[]>>;
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
  | { type: 'MULLIGAN'; seat: Seat; iids: InstanceId[] }
  /**
   * Trade one hand card back into the deck at the start of rounds 2 and 3,
   * before this seat has played anything. The Gwent move: the card you banked
   * for a plan that died goes back, and a fresh draw takes its place. This is
   * the release valve for the dead-combo hand, and it does NOT pass the turn.
   */
  | { type: 'ROUND_SWAP'; seat: Seat; iid: InstanceId }
  /** The defender answers an astra in flight, or lets it through. */
  | { type: 'ANSWER_ASTRA'; seat: Seat; counter: boolean };

export type GameEvent =
  | { t: 'roundStart'; round: number }
  | { t: 'play'; seat: Seat; iid: InstanceId; cardId: CardId; row: Row }
  | { t: 'pass'; seat: Seat }
  | { t: 'mulligan'; seat: Seat; count: number }
  | { t: 'roundSwap'; seat: Seat; cardId: CardId }
  | { t: 'damage'; iid: InstanceId; amount: number; power: number }
  | { t: 'setPower'; iid: InstanceId; value: number }
  | { t: 'buff'; iid: InstanceId; amount: number; power: number }
  | { t: 'destroy'; iid: InstanceId; cardId: CardId }
  | { t: 'preventDestroy'; iid: InstanceId; reason: string }
  | { t: 'redirected'; source: CardId; reason: string }
  | { t: 'countered'; astra: CardId; by: CardId; seat: Seat }
  /** The defender held an answer and chose not to spend it. */
  | { t: 'unanswered'; astra: CardId; seat: Seat }
  /** A warrior took the field and brought the astra that is his by name. */
  | { t: 'granted'; seat: Seat; cardId: CardId; by: CardId }
  | { t: 'hazard'; kind: string; seat: Seat; iid?: InstanceId; amount?: number }
  | { t: 'hazardLifted'; kind: string; seat: Seat; reason: string }
  | { t: 'discard'; seat: Seat; cardId: CardId }
  | { t: 'draw'; seat: Seat; cardId: CardId }
  | { t: 'denied'; seat: Seat; cardId: CardId }
  | { t: 'debuffRow'; seat: Seat; row: Row; amount: number }
  | { t: 'attach'; boon: InstanceId; to: InstanceId }
  | { t: 'ban'; cardId: CardId }
  // Unhorsed: he keeps his power and loses his chariot.
  | { t: 'dismount'; iid: InstanceId; cardId: CardId; from: Row }
  // Penalties lifted off your own lines.
  | { t: 'cleanse'; seat: Seat; cleared: number }
  // Krishna's counsel: this warrior's protections no longer apply.
  | { t: 'stripped'; iid: InstanceId; cardId: CardId }
  // Ghatotkacha stepped in front of it. `cardId` is the man, `astra` the weapon.
  | { t: 'drewAstra'; astra: CardId; cardId: CardId; seat: Seat }
  // Banned, but recoverable: the next warrior home from penance brings it back.
  | { t: 'suspended'; cardId: CardId }
  | { t: 'ability'; iid: InstanceId; cardId: CardId; name: string; left: number }
  | { t: 'afflict'; seat: Seat; curse: CurseId; name: string; text: string }
  | { t: 'burn'; seat: Seat; cardIds: CardId[] }
  // Two great astras meet. Both hosts are scoured; the wielder who never
  // learned to withdraw his weapon pays the greater price.
  | { t: 'clash'; astra: CardId; against: CardId; blast: number; unwithdrawn: Seat | null }
  | { t: 'flag'; iid: InstanceId; flag: string; on: boolean }
  | { t: 'roundEnd'; round: number; scores: Record<Seat, number>; winner: Seat | 'tie' }
  | { t: 'battleEnd'; winner: Seat; reason: string };
