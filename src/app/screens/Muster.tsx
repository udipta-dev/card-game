// Choosing your host, card by card.
//
// Reuses the codex layout and the card frames rather than inventing a second
// visual language for cards: a card you are picking should look exactly like
// the card you will play.
import { useMemo, useState } from 'react';
import { getCard, provisionOf } from '@content/cards';
import { DECK_BUDGET } from '@content/decks';
import {
  MUSTER_MAX,
  MUSTER_MIN,
  advise,
  applyAdvisory,
  autoMuster,
  checkMuster,
  poolFor,
  whyNotAdd,
} from '@content/muster';
import type { Card, CardId, House } from '@engine/types';
import { CardFrame } from '@ui/card/CardFrame';
import { InspectSheet } from '@ui/card/InspectSheet';
import { FACTION_NAME } from '@ui/card/cardTheme';
import { HelpButton } from '@ui/HelpButton';

interface Props {
  house: House;
  /** Cards this player may choose from. Defaults to the whole house pool. */
  pool?: CardId[];
  /** Where the muster starts: last saved, the starter deck, or a run roster. */
  initial: CardId[];
  title?: string;
  onBack: () => void;
  onConfirm: (ids: CardId[]) => void;
}

export function Muster({ house, pool, initial, title, onBack, onConfirm }: Props) {
  const available = useMemo(
    () => (pool ? pool.map(getCard) : poolFor(house)),
    [pool, house],
  );
  const [chosen, setChosen] = useState<CardId[]>(initial);
  const [inspect, setInspect] = useState<Card | null>(null);
  /** What the last auto-fix did, so a deck never changes silently under you. */
  const [lastFix, setLastFix] = useState<string | null>(null);

  const check = checkMuster(chosen);
  // The loading station. A weapon nobody can fire is a real fault; a weapon one
  // of your men bears and you have not packed is an opportunity. Neither ever
  // blocks you from marching.
  const advisories = advise(chosen, available.map((c) => c.id));
  const left = DECK_BUDGET - check.provisions;
  const chosenSet = new Set(chosen);

  const toggle = (id: CardId) => {
    if (chosenSet.has(id)) {
      setChosen(chosen.filter((c) => c !== id));
      return;
    }
    if (whyNotAdd(chosen, id) === null) setChosen([...chosen, id]);
  };

  return (
    <div className="codex">
      <div className="codex__bar">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          ‹ Back
        </button>
        <h2 className="codex__title">{title ?? `Muster the ${FACTION_NAME[house]}`}</h2>
        <span className="codex__count"><HelpButton className="btn btn--ghost btn--sm" /></span>
      </div>

      {/* The two numbers that decide everything, always on screen. Sticky
          because the pool is long and a budget you have to scroll to is a
          budget you will overspend. */}
      <div className={'muster__bar' + (check.ok ? ' muster__bar--ok' : '')}>
        <span className="muster__stat">
          <b>{check.count}</b>
          <span className="muster__unit">/ {MUSTER_MAX} cards</span>
        </span>
        <span className="muster__stat">
          <b>{check.provisions}</b>
          <span className="muster__unit">/ {DECK_BUDGET} provisions</span>
        </span>
        <span className="muster__problems">
          {check.ok ? 'Ready to march' : check.problems.join(' · ')}
        </span>
        <button
          className="btn btn--ghost btn--sm"
          title="Fill the army automatically, best value first"
          onClick={() => setChosen(autoMuster(available.map((c) => c.id)))}
        >
          Auto
        </button>
        <button className="btn btn--primary btn--sm" disabled={!check.ok} onClick={() => onConfirm(chosen)}>
          Take the field
        </button>
      </div>

      {advisories.length > 0 && (
        <div className="advice">
          {advisories.map((a) => (
            <div
              key={`${a.kind}-${a.astra}`}
              className={'advice__row' + (a.kind === 'orphan-weapon' ? ' advice__row--bad' : '')}
            >
              <span className="advice__text">{a.text}</span>
              {a.suggest && (
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    const { cards, dropped } = applyAdvisory(chosen, a);
                    setChosen(cards);
                    setLastFix(
                      dropped.length
                        ? `Added ${getCard(a.suggest!).name}, dropped ${dropped
                            .map((d) => getCard(d).name)
                            .join(', ')}.`
                        : `Added ${getCard(a.suggest!).name}.`,
                    );
                  }}
                >
                  Add {getCard(a.suggest).name}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {lastFix && <div className="advice__done">{lastFix}</div>}

      <div className="codex__scroll">
        <div className="codex__group">
          Your army
          <span className="codex__group-n">
            {check.count} of {MUSTER_MIN}–{MUSTER_MAX} · {left} provisions unspent
          </span>
        </div>
        <div className="codex__grid">
          {chosen.map((id) => (
            <div key={`in-${id}`} className="muster__slot muster__slot--in">
              <CardFrame
                mini
                card={getCard(id)}
                onClick={() => toggle(id)}
                onEnter={undefined}
                onLeave={undefined}
              />
              <span className="muster__cost">{provisionOf(getCard(id))}</span>
            </div>
          ))}
          {chosen.length === 0 && (
            <p className="setup__note">Nobody mustered yet. Tap a card below, or press Auto.</p>
          )}
        </div>

        <div className="codex__group">
          Left behind
          <span className="codex__group-n">{available.length - chosen.length} available</span>
        </div>
        <div className="codex__grid">
          {available
            .filter((c) => !chosenSet.has(c.id))
            .map((c) => {
              const why = whyNotAdd(chosen, c.id);
              return (
                <div key={`out-${c.id}`} className="muster__slot" title={why ?? 'Add to your army'}>
                  <CardFrame
                    mini
                    card={c}
                    dead={why !== null}
                    onClick={() => (why === null ? toggle(c.id) : setInspect(c))}
                  />
                  <span className="muster__cost">{provisionOf(c)}</span>
                </div>
              );
            })}
        </div>
      </div>

      {inspect && <InspectSheet card={inspect} onClose={() => setInspect(null)} />}
    </div>
  );
}
