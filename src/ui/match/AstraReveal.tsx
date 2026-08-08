// A divine weapon going off, animated out of the card's own painting.
//
// This was going to be generated footage: 72 clips, five of them ultimates. It
// should not have been, and the reason is written in the video generator's own
// first paragraph, that motion which does not match the cards reads as glued on.
// Every astra in the game already HAS a painting. A generated clip of the
// Brahmastra would not be the Brahmastra in the player's hand, and it is
// guaranteed to mismatch the card it fires from.
//
// So the card art is the animation. It cannot mismatch the card because it is
// the card. It also scales to any screen, costs nothing to ship, honours the
// viewer's theme, and can be interrupted, none of which a video can do.
import { useEffect, useState } from 'react';
import { getCard } from '@content/cards';
import { artFor } from '@ui/card/cardArt';
import type { CardId } from '@engine/types';

interface Props {
  astra: CardId;
  /** Who loosed it, so the line reads from the right side of the field. */
  mine: boolean;
  onDone: () => void;
}

/**
 * How long the whole beat runs.
 *
 * Long enough to land, short enough that a player who has seen it forty times
 * does not resent it. Anything above about two seconds becomes a loading screen,
 * and the tap-to-dismiss below exists for exactly the people who feel that way.
 */
const BEAT_MS = 1900;

export function AstraReveal({ astra, mine, onDone }: Props) {
  const card = getCard(astra);
  const art = artFor(card);
  // Mounted-then-lit, so the CSS transition has a frame to start from. Setting
  // the final state in the same paint gives no animation at all.
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const on = requestAnimationFrame(() => setLit(true));
    const off = setTimeout(onDone, BEAT_MS);
    return () => {
      cancelAnimationFrame(on);
      clearTimeout(off);
    };
  }, [astra, onDone]);

  return (
    <div
      className={`astra-reveal${lit ? ' is-lit' : ''}`}
      role="status"
      aria-live="polite"
      // Tap to skip. A player on their fortieth Agneyastra should never be made
      // to watch it, and a beat you cannot dismiss stops being a flourish.
      onClick={onDone}
    >
      <div className="astra-reveal__glow" aria-hidden="true" />
      <div className="astra-reveal__frame">
        {art ? (
          <img className="astra-reveal__art" src={art} alt="" draggable={false} />
        ) : (
          <div className="astra-reveal__art astra-reveal__art--blank" />
        )}
      </div>
      <div className="astra-reveal__name">{card.name}</div>
      <div className="astra-reveal__who">{mine ? 'You loose it' : 'Loosed against you'}</div>
    </div>
  );
}
