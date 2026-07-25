// Tunable weights for the AI's board evaluation and the thresholds behind its
// pass/bank decisions. Isolated here so difficulty tiers = different numbers.

export interface Weights {
  power: number;
  round: number;
  card: number;
  curse: number;
  curseBarred: number;
  charge: number;
}

export const WEIGHTS: Weights = {
  /** Value of one point of board-power lead. */
  power: 1,
  /** Value of a round win differential. A round is worth a lot of tempo. */
  round: 40,
  /**
   * Value of a card-in-hand/deck advantage (the Gwent core tension). Set to 0
   * in the final round, where banking is pointless and you spend everything.
   */
  card: 2.5,
  /**
   * MEASURED AT ZERO ON PURPOSE. Penalising curses seemed obviously right and
   * made the AI measurably worse (43% against the unmodified AI over 400
   * games). The reason: a curse's real cost, scorched rows and lost power, is
   * already visible to the search through seatPower after reduce(). An extra
   * penalty double-counts it and makes the AI decline astras worth far more
   * than the curse. Kept as a dial, proven not to want turning up.
   */
  curse: 0,
  /** Also measured: even alone, penalising the astra-bar did not beat control. */
  curseBarred: 0,
  /**
   * Also zero by measurement. Hoarding charges costs more than it saves: the
   * search already sees an ability's board swing, which beats its latent value.
   */
  charge: 0,
};

/** The old weights, for head-to-head testing that a change is an improvement. */
export const LEGACY_WEIGHTS: Weights = {
  ...WEIGHTS,
  curse: 0,
  curseBarred: 0,
  charge: 0,
};

/** Overwhelming value assigned to a decided battle. */
export const BIG = 1_000_000;
