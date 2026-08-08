// What you are climbing towards, shown as faces rather than as a table.
//
// The point is ANTICIPATION, not information. Every unlock across the fifty
// levels is visible from the first minute, as a name and a painting and nothing
// else: no power, no provisions, no rules text. You can see the Pashupat-Astra
// waiting at the top without knowing what it does, which is the whole feeling
// the ladder is for.
//
// It also answers a question the game could not previously answer at all:
// "what am I climbing towards?" A progress bar says how far. This says what.
import { getCard } from '@content/cards';
import { poolFor } from '@content/muster';
import { STEPS, capAt, budgetAt, unlockSchedule } from '@run/ladder';
import type { Standing } from '@run/ladder';
import { artFor } from '@ui/card/cardArt';
import { Lintel } from '@ui/frame';
import { Ambient } from '@ui/Ambient';
import type { House } from '@engine/types';

interface Props {
  house: House;
  standing: Standing;
  onBack: () => void;
}

export function LadderPreview({ house, standing, onBack }: Props) {
  const schedule = unlockSchedule(poolFor(house).map((c) => c.id));

  return (
    <div className="codex ladder-preview">
      <Ambient scene="map-road" opacity={0.3} />
      <header className="codex__top">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          ‹ Back
        </button>
        <h2 className="codex__title">The Long March</h2>
        <span className="codex__count">
          Level {standing.level} · cap {capAt(standing.highWater)} · {budgetAt(standing.level)} provisions
        </span>
      </header>

      <div className="codex__scroll">
        {schedule.map(({ step, cards }) => {
          const reached = standing.highWater >= step.level;
          const headline = getCard(step.headline);
          return (
            <section key={step.level} className={`ladder-step${reached ? ' is-reached' : ''}`}>
              <Lintel count={cards.length ? `${cards.length} cards` : undefined}>
                Level {step.level} · {headline.name}
              </Lintel>
              <p className="ladder-step__cap">
                Cards up to {step.cap} provisions{reached ? ' · yours' : ' · not yet'}
              </p>
              <div className="ladder-step__cards">
                {cards.map((id) => {
                  const card = getCard(id);
                  const art = artFor(card);
                  return (
                    // NAME AND FACE, NOTHING ELSE. No power, no cost, no rules.
                    // A locked card you can read the stats of is a spoiler; one
                    // you can only look at is a promise.
                    <figure
                      key={id}
                      className={`ladder-card${reached ? '' : ' is-locked'}`}
                      title={reached ? card.name : `${card.name}, at level ${step.level}`}
                    >
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
          );
        })}
        <p className="ladder-preview__foot">
          Fifty levels. Win a level and you rise, lose one and you fall, but what you have
          already earned is yours to keep.
        </p>
      </div>
    </div>
  );
}

/** Every step, for anything that wants the shape without the screen. */
export { STEPS };
