// Tunable weights for the AI's board evaluation and the thresholds behind its
// pass/bank decisions. Isolated here so difficulty tiers = different numbers.

export const WEIGHTS = {
  /** Value of one point of board-power lead. */
  power: 1,
  /** Value of a round win differential. A round is worth a lot of tempo. */
  round: 40,
  /**
   * Value of a card-in-hand/deck advantage (the Gwent core tension). Set to 0
   * in the final round, where banking is pointless and you spend everything.
   */
  card: 2.5,
};

/** Overwhelming value assigned to a decided battle. */
export const BIG = 1_000_000;
