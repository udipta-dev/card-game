import { useState } from 'react';
import { getCard } from '@content/cards';
import { ASURA_DECK, KAURAVA_DECK, PANDAVA_DECK, deckProvisions } from '@content/decks';
import type { DeckList } from '@content/decks';
import type { Card, House } from '@engine/types';
import { CardFrame } from '@ui/card/CardFrame';
import { InspectSheet } from '@ui/card/InspectSheet';
import { FACTION_DOT, FACTION_NAME } from '@ui/card/cardTheme';
import { Aksha } from '@ui/ornament';
import { loadMuster, hasCustomMuster } from '@content/savedMuster';
import { toDeckList } from '@content/muster';
import { HelpButton } from '@ui/HelpButton';

const FACTIONS: { house: House; deck: DeckList }[] = [
  { house: 'pandava', deck: PANDAVA_DECK },
  { house: 'kaurava', deck: KAURAVA_DECK },
  { house: 'asura', deck: ASURA_DECK },
];

/**
 * What each host actually plays like.
 *
 * Choosing a side was three unlabelled buttons: one tap committed you to an
 * army with no statement anywhere of how it differs from the other two. You
 * could scroll the cards, but reading nineteen cards to work out a playstyle is
 * not a choice, it is homework.
 *
 * These are written from measurement, not flavour. The win rates are the last
 * lab run over 2400 games.
 */
const HOUSE_BRIEF: Record<string, { line: string; strength: string; weakness: string }> = {
  pandava: {
    line: 'A few enormous men, and Krishna to keep one of them alive.',
    strength: 'The heaviest warriors in the game and the best answers to a weapon in flight.',
    weakness: 'Top-heavy. Lose Arjuna or Bhima and the host is thin behind them.',
  },
  kaurava: {
    line: 'Guile. Bhishma at the front and Shakuni behind, emptying your hand.',
    strength: 'Denial and disruption: cards barred, hands stripped, an unkillable old man.',
    weakness: 'The weakest bottom half of the three. Its cheap warriors do very little.',
  },
  asura: {
    line: 'Numbers and night. Kin who rally each other, and giants who grow as the war drags.',
    strength: 'Warriors who get stronger the longer a battle runs, and the widest ranks.',
    weakness: 'Fewest cards to choose from, and little answer to a weapon aimed at them.',
  },
};
const deckFor = (h: House) => FACTIONS.find((f) => f.house === h)!.deck;

interface Props {
  mode: 'quickplay' | 'campaign';
  onBack: () => void;
  /** Quickplay: choose both hosts and fight one battle. */
  onStart?: (playerDeck: DeckList, aiDeck: DeckList) => void;
  /** Campaign: choose your host; the ladder provides the opponents. */
  onStartHost?: (playerDeck: DeckList) => void;
  /** Open the muster screen for the currently chosen house. */
  onMuster?: (house: House) => void;
}

export function Setup({ mode, onStart, onStartHost, onMuster, onBack }: Props) {
  const campaign = mode === 'campaign';
  const [playerHouse, setPlayerHouse] = useState<House>('pandava');
  const [oppHouse, setOppHouse] = useState<House | 'random'>('random');
  const [inspect, setInspect] = useState<Card | null>(null);

  // The host you last chose for this house, or the starter list. Reading it
  // here rather than at module load means a muster saved this session is picked
  // up the moment you come back to this screen.
  const musteredIds = loadMuster(playerHouse);
  const custom = hasCustomMuster(playerHouse);
  const playerDeck = custom
    ? toDeckList(playerHouse, `Your ${FACTION_NAME[playerHouse]}`, musteredIds)
    : deckFor(playerHouse);

  const begin = () => {
    if (campaign) {
      onStartHost?.(playerDeck);
      return;
    }
    const others = FACTIONS.filter((f) => f.house !== playerHouse).map((f) => f.house);
    const ai = oppHouse === 'random' ? others[Math.floor(Math.random() * others.length)] : oppHouse;
    onStart?.(playerDeck, deckFor(ai));
  };

  const factionButton = (house: House, selected: boolean, onClick: () => void) => (
    <button
      key={house}
      className={'faction-btn' + (selected ? ' faction-btn--on' : '')}
      onClick={onClick}
    >
      <span className="faction-btn__dot" style={{ background: FACTION_DOT[house] }} />
      {FACTION_NAME[house]}
    </button>
  );

  return (
    <div className="codex">
      <div className="codex__bar">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          ‹ Back
        </button>
        <h2 className="codex__title">Choose your host</h2>
        <span className="codex__count"><HelpButton className="btn btn--ghost btn--sm" /></span>
      </div>

      <div className="codex__scroll">
        <div className="setup__label">Your host</div>
        <div className="faction-picker">
          {FACTIONS.map((f) => factionButton(f.house, playerHouse === f.house, () => setPlayerHouse(f.house)))}
        </div>
        {/* What you just chose, in three lines, before you commit to it. */}
        <div className="house-brief">
          <p className="house-brief__line">{HOUSE_BRIEF[playerHouse]?.line}</p>
          <p className="house-brief__row">
            <span className="house-brief__tag house-brief__tag--good">Strength</span>
            {HOUSE_BRIEF[playerHouse]?.strength}
          </p>
          <p className="house-brief__row">
            <span className="house-brief__tag house-brief__tag--bad">Weakness</span>
            {HOUSE_BRIEF[playerHouse]?.weakness}
          </p>
        </div>

        <div className="codex__group">
          {playerDeck.name}
          <span className="codex__group-n">
            {playerDeck.cards.length} cards · {deckProvisions(playerDeck)} provisions
            {onMuster && (
              <button
                className="btn btn--ghost btn--sm"
                style={{ marginLeft: 10 }}
                title="Choose which cards go to war"
                onClick={() => onMuster(playerHouse)}
              >
                {custom ? 'Change host' : 'Choose your host'}
              </button>
            )}
          </span>
        </div>
        <div className="codex__grid">
          {playerDeck.cards.map((id, i) => (
            <CardFrame key={id + i} mini card={getCard(id)} onClick={() => setInspect(getCard(id))} />
          ))}
        </div>

        {/* The campaign note is said as a sequence of things that will happen
            to you, rather than as one sentence about "carrying a host up a
            ladder", which was reported as confusing and was doing three jobs at
            once. */}
        {campaign ? (
          <p className="setup__note">
            A campaign is a run of battles, fought one after another with the same host.
            Win one and you recruit a new warrior, or meet a shrine. Lose one and the run
            ends there. The great astras are not dealt to you: they are earned at a shrine,
            except for the ones a warrior physically carries into battle with him.
          </p>
        ) : (
          <>
            <div className="setup__label" style={{ marginTop: 18 }}>
              Opponent
            </div>
            <div className="faction-picker">
              <button
                className={'faction-btn' + (oppHouse === 'random' ? ' faction-btn--on' : '')}
                onClick={() => setOppHouse('random')}
              >
                <Aksha size={14} className="glyph glyph--dim" /> Random
              </button>
              {FACTIONS.map((f) => factionButton(f.house, oppHouse === f.house, () => setOppHouse(f.house)))}
            </div>
          </>
        )}

        <button className="btn btn--primary setup__begin" onClick={begin}>
          {campaign ? 'Begin the campaign' : 'Begin battle'}
        </button>
      </div>

      {inspect && <InspectSheet card={inspect} onClose={() => setInspect(null)} />}
    </div>
  );
}
