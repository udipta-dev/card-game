import { useEffect, useState } from 'react';
import { HowToPlay } from '@ui/HowToPlay';
import { Ambient } from '@ui/Ambient';
import { Abhaya, Chakra, Crown, Kalasha, Spears } from '@ui/ornament';
import { loadMeta } from '@run/meta';

interface Props {
  onPlay: () => void;
  onCampaign: () => void;
  onCodex: () => void;
  onLadder: () => void;
}

const SEEN_KEY = 'kuru_seen_help';

export function MainMenu({ onPlay, onCampaign, onCodex, onLadder }: Props) {
  const [showHelp, setShowHelp] = useState(false);
  const meta = loadMeta();

  // A FIRST-TIMER IS OFFERED THE RULES, NOT AMBUSHED BY THEM.
  //
  // This opened HowToPlay automatically, and HowToPlay is a modal whose
  // backdrop closes it on click. So a new player's very first tap on "Quickplay"
  // landed on the backdrop, dismissed the overlay, and left them looking at the
  // menu again. Reported as "I click a menu to play and it goes back to the
  // homescreen", which is exactly what it looks like from the outside.
  //
  // The button glows for them instead. Nothing is stolen, nothing is covered,
  // and the rules are one obvious tap away.
  const [firstVisit, setFirstVisit] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) setFirstVisit(true);
  }, []);

  function openHelp() {
    setShowHelp(true);
    // Marked seen on OPEN rather than on show, so a player who never opens it
    // keeps being offered it, and one who reads it is not offered it forever.
    localStorage.setItem(SEEN_KEY, '1');
    setFirstVisit(false);
  }

  return (
    <div className="menu">
      {/* Dawn for a first visit, dusk once you have played. A returning player
          should not be greeted by the same morning forever. */}
      <Ambient scene={meta.runsStarted > 0 ? 'menu-dusk' : 'menu-dawn'} />
      <div className="menu__devanagari">कुरुक्षेत्र</div>
      {/* "18 Days" leads because "Kurukshetra" alone means nothing to anyone
          who does not already know the epic, and the whole point of the name is
          that a stranger can remember it. Eighteen is the war's real length and
          needs no explanation. Kurukshetra stays underneath, in brass, because
          it is what the game actually is. */}
      <h1 className="menu__title">
        18 Days
        <span className="menu__title-sub">Kurukshetra</span>
      </h1>
      <Crown />
      <p className="menu__sub">
        A card battler of the Mahabharata. Marshal maharathis, fire divine astras, and turn the
        tide with curses and boons across three rounds of war. Raw power is never destiny. The right
        vow undoes the mightiest warrior.
      </p>
      {/* PLAQUES, not buttons in a column. Each carries a mark, a name and a
          line saying what it is, which is the difference between a menu you
          read and a menu you scan past. The primary action keeps its lit
          treatment so the eye still lands somewhere first. */}
      <div className="menu__actions">
        <button className="plaque plaque--lit" onClick={onCampaign}>
          <Chakra size={26} className="plaque__mark" />
          <span className="plaque__body">
            <span className="plaque__title">Campaign</span>
            <span className="plaque__sub">Carry one army up a ladder of battles</span>
          </span>
        </button>
        <button className="plaque" onClick={onPlay}>
          <Spears size={26} className="plaque__mark" />
          <span className="plaque__body">
            <span className="plaque__title">Quickplay</span>
            <span className="plaque__sub">A single battle, nothing carried</span>
          </span>
        </button>
        <button className="plaque" onClick={onLadder}>
          <Kalasha size={26} tiers={3} className="plaque__mark" />
          <span className="plaque__body">
            <span className="plaque__title">The Long March</span>
            <span className="plaque__sub">Fifty levels, and what waits on each</span>
          </span>
        </button>
        <button className="plaque" onClick={onCodex}>
          <Kalasha size={26} className="plaque__mark" />
          <span className="plaque__body">
            <span className="plaque__title">Codex</span>
            <span className="plaque__sub">Every card, and what it does</span>
          </span>
        </button>
        <button
          className={`plaque${firstVisit ? ' btn--beckon' : ''}`}
          onClick={openHelp}
        >
          <Abhaya size={26} className="plaque__mark" />
          <span className="plaque__body">
            <span className="plaque__title">How to play</span>
            <span className="plaque__sub">Three rounds, first to two</span>
          </span>
        </button>
      </div>
      <p className="menu__sub" style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
        Win what you keep, lose it all in one defeat.
        {meta.bestDepth > 0 && ` · Best run: ${meta.bestDepth} won`}
      </p>
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
    </div>
  );
}
