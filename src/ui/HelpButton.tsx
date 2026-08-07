// A way into the rules from wherever you are standing.
//
// How to Play existed on exactly two screens: the main menu and the battle.
// Everywhere a new player is most likely to be stuck (choosing a host, reading
// a shrine, browsing the codex) there was no way to ask what anything meant
// without backing all the way out to the menu and losing your place.
//
// It is the same overlay in every case. The point is that the door exists on
// every screen, not that each screen gets its own tutorial.
import { useState } from 'react';
import { HowToPlay } from './HowToPlay';

export function HelpButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className={className ?? 'icon-btn'}
        onClick={() => setOpen(true)}
        title="How to play"
        aria-label="How to play"
      >
        ?
      </button>
      {open && <HowToPlay onClose={() => setOpen(false)} />}
    </>
  );
}
