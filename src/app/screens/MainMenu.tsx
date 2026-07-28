import { useEffect, useState } from 'react';
import { HowToPlay } from '@ui/HowToPlay';
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

  // First-time visitors get the rules once, automatically.
  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) {
      setShowHelp(true);
      localStorage.setItem(SEEN_KEY, '1');
    }
  }, []);

  return (
    <div className="menu">
      <div className="menu__devanagari">कुरुक्षेत्र</div>
      <h1 className="menu__title">Kurukshetra</h1>
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
        <button className="btn btn--ghost" onClick={() => setShowHelp(true)}>
          How to play
        </button>
      </div>
      <p className="menu__sub" style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
        Campaign: carry one host up a ladder of battles. Win what you keep, lose it all in one defeat.
        {meta.bestDepth > 0 && ` · Best run: ${meta.bestDepth} won`}
      </p>
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
    </div>
  );
}
