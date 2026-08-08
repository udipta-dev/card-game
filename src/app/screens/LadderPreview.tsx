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
import { useState } from 'react';
import { allCards, getCard } from '@content/cards';
import { poolFor } from '@content/muster';
import { STEPS, capAt, budgetAt, unlockSchedule } from '@run/ladder';
import type { Standing } from '@run/ladder';
import { artFor } from '@ui/card/cardArt';
import { InspectSheet } from '@ui/card/InspectSheet';
import { Lintel } from '@ui/frame';
import { Ambient } from '@ui/Ambient';
import type { Card, House } from '@engine/types';

interface Props {
  house: House;
  standing: Standing;
  onBack: () => void;
  /** Start a campaign, which IS one attempt at the next level. */
  onMarch: () => void;
}

export function LadderPreview({ house, standing, onBack, onMarch }: Props) {
  const schedule = unlockSchedule(poolFor(house).map((c) => c.id));
  const [inspect, setInspect] = useState<Card | null>(null);
  const [run, setRun] = useState<Card[]>([]);

  return (
    <div className="codex ladder-preview">
      <Ambient scene="map-road" opacity={0.3} />
      <header className="codex__bar">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          ‹ Back
        </button>
        <h2 className="codex__title">The Long March</h2>
        <span className="codex__count">
          Level {standing.level} · cap {capAt(standing.highWater)} · {budgetAt(standing.level)} provisions
        </span>
      </header>

      <div className="codex__scroll">
        {/* WHAT THIS PAGE IS. It had no explanation at all, so it read as a
            list of cards grouped by a number nobody had defined. Three
            sentences: what the ladder is, what a level buys, and the one rule
            that makes it safe to attempt. */}
        <p className="ladder-preview__intro">
          Fifty levels, climbed one campaign at a time. Win a campaign and you rise a level;
          lose and you drop one. Each level raises how many provisions your army may spend,
          and every few levels raises the <strong>most any single card may cost</strong>,
          which is how the greatest warriors and weapons come within reach.
        </p>
        <p className="ladder-preview__intro">
          Nothing you unlock is ever taken back. A lost campaign costs you provisions for a
          while, never a card.
        </p>
        <button className="btn btn--primary ladder-preview__march" onClick={onMarch}>
          March on level {standing.level}
        </button>

        {schedule.map(({ step, cards, headline }) => {
          const reached = standing.highWater >= step.level;
          return (
            <section key={step.level} className={`ladder-step${reached ? ' is-reached' : ''}`}>
              {/* Named after a card from YOUR army, never the canonical one for
                  the price band: a Pandava player was being shown "Karna" above
                  a list that could not contain a Kaurava. */}
              <Lintel count={cards.length ? `${cards.length} cards` : undefined}>
                Level {step.level} · up to {step.cap} provisions
              </Lintel>
              <p className="ladder-step__cap">
                {cards.length === 0
                  ? 'Nothing new for this army at this level'
                  : cards.length === 1
                    ? getCard(headline).name
                    : `${getCard(headline).name} and ${cards.length - 1} more`}
                {reached ? ' · yours already' : ''}
              </p>
              <div className="codex__shelf">
                {cards.map((id) => {
                  const card = getCard(id);
                  const art = artFor(card);
                  return (
                    // NAME AND FACE on the shelf. The full sheet is a tap away,
                    // which is what a player expects of a card they can see:
                    // doing nothing on tap read as the page being broken.
                    <button
                      key={id}
                      type="button"
                      className={`ladder-card${reached ? '' : ' is-locked'}`}
                      onClick={() => {
                        setRun(cards.map(getCard));
                        setInspect(card);
                      }}
                      title={reached ? card.name : `${card.name}, at level ${step.level}`}
                    >
                      {art ? (
                        <img src={art} alt="" loading="lazy" draggable={false} />
                      ) : (
                        <span className="ladder-card__blank" aria-hidden="true" />
                      )}
                      <span className="ladder-card__name">{card.name}</span>
                    </button>
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

      {inspect && (
        <InspectSheet
          card={inspect}
          onClose={() => setInspect(null)}
          onPeek={(c) => {
            setRun(allCards().filter((x) => x.house === c.house));
            setInspect(c);
          }}
          siblings={run}
          onNavigate={setInspect}
        />
      )}
    </div>
  );
}

/** Every step, for anything that wants the shape without the screen. */
export { STEPS };
