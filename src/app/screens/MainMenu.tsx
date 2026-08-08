import { useEffect, useState } from 'react';
import { HowToPlay } from '@ui/HowToPlay';
import { Ambient } from '@ui/Ambient';
import { Crown } from '@ui/ornament';
import { loadMeta } from '@run/meta';

interface Props {
  onPlay: () => void;
  onCampaign: () => void;
  onCodex: () => void;
}

const SEEN_KEY = 'kuru_seen_help';

export function MainMenu({ onPlay, onCampaign, onCodex }: Props) {
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
      <div className="menu__actions">
        <button className="btn btn--primary" onClick={onCampaign}>
          Begin a Campaign
        </button>
        <button className="btn btn--ghost" onClick={onPlay}>
          Quickplay · a single battle
        </button>
        <button className="btn btn--ghost" onClick={onCodex}>
          Codex · browse all cards
        </button>
        <button
          className={`btn btn--ghost${firstVisit ? ' btn--beckon' : ''}`}
          onClick={openHelp}
        >
          How to play
        </button>
      </div>
      <p className="menu__sub" style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
        Campaign: carry one army up a ladder of battles. Win what you keep, lose it all in one defeat.
        {meta.bestDepth > 0 && ` · Best run: ${meta.bestDepth} won`}
      </p>
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
    </div>
  );
}
