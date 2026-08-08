// What a level was worth, shown at the moment it is won.
//
// A ladder that only moves a number is a ladder nobody climbs. Most rises are
// one rung and one more provision, which this states plainly and gets out of
// the way of. Roughly one rise in five crosses a STEP, and that is the moment
// the whole progression exists for: a band of cards you could not afford
// yesterday walks through the door, and it should feel like a door.
//
// Shown after a run ends rather than as its own screen, because a run IS a
// level attempt and this is the result of it.
import { getCard } from '@content/cards';
import { poolFor } from '@content/muster';
import { STEPS, budgetAt, capAt, stepAt } from '@run/ladder';
import type { Standing } from '@run/ladder';
import { artFor } from '@ui/card/cardArt';
import { Lintel } from '@ui/frame';
import type { CardId, House } from '@engine/types';

interface Props {
  house: House;
  before: Standing;
  after: Standing;
  onDone: () => void;
}

/**
 * What this rise put within reach.
 *
 * Measured against the HIGH-WATER MARK, not the level, which is the whole point
 * of tracking two numbers: a card you have unlocked stays unlocked when you
 * fall, so a demotion costs provisions and never a name.
 */
export function unlockedBy(house: House, before: Standing, after: Standing): CardId[] {
  const wasCap = capAt(before.highWater);
  const nowCap = capAt(after.highWater);
  if (nowCap <= wasCap) return [];
  return poolFor(house)
    .filter((c) => {
      const p = c.provision ?? c.basePower + 2;
      return p > wasCap && p <= nowCap;
    })
    .map((c) => c.id);
}

export function Ascend({ house, before, after, onDone }: Props) {
  const rose = after.level > before.level;
  const opened = unlockedBy(house, before, after);
  const step = stepAt(after.highWater);
  const nextAt = STEPS.find((s) => s.level > after.highWater);
  const gained = budgetAt(after.level) - budgetAt(before.level);

  return (
    <div className="codex ascend">
      <header className="codex__bar">
        <h2 className="codex__title">{rose ? 'You rise' : 'You fall back'}</h2>
        <span className="codex__count">
          Level {before.level} → {after.level}
        </span>
      </header>

      <div className="codex__scroll">
        <p className="ascend__line">
          {rose ? (
            <>
              The march is yours. You stand at <strong>level {after.level}</strong>, and your army
              may spend <strong>{budgetAt(after.level)} provisions</strong>
              {gained > 0 ? <>, {gained} more than before</> : null}.
            </>
          ) : (
            <>
              The march is lost. You fall to <strong>level {after.level}</strong> and muster on{' '}
              <strong>{budgetAt(after.level)} provisions</strong>. Nothing you have earned is taken:
              you may still field anything up to {capAt(after.highWater)}.
            </>
          )}
        </p>

        {opened.length > 0 && (
          <section className="ascend__unlocks">
            {/* Named after a card YOU just gained, not the canonical name for
                the price band, which may belong to another army entirely. */}
            <Lintel count={`${opened.length} cards`}>
              Up to {step.cap} provisions · {getCard(opened[0]).name}
            </Lintel>
            <p className="ascend__cap">
              A band you could not afford yesterday. These may take the field from here on.
            </p>
            <div className="codex__shelf">
              {opened.map((id) => {
                const card = getCard(id);
                const art = artFor(card);
                return (
                  <figure key={id} className="ladder-card is-new" title={card.name}>
                    {art ? (
                      <img src={art} alt="" loading="lazy" draggable={false} />
                    ) : (
                      <span className="ladder-card__blank" aria-hidden="true" />
                    )}
                    <figcaption>{card.name}</figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {nextAt && (
          <p className="ascend__next">
            Next door at <strong>level {nextAt.level}</strong>: cards up to {nextAt.cap}{' '}
            provisions.
          </p>
        )}

        <button className="btn btn--primary ascend__go" onClick={onDone}>
          March on
        </button>
      </div>
    </div>
  );
}
