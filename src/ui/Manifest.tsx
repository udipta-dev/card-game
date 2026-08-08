// A god arriving, animated out of the painting we already have of him.
//
// This was going to be eight generated clips, one per deity. It should not have
// been: a generated Agni is not OUR Agni, and it would have sat next to the
// painting on the shrine screen contradicting it. The paintings exist, they are
// good, and light moving across one is more convincing than a video of a
// different figure.
//
// Same argument as AstraReveal, and the same advantage: it cannot mismatch the
// art because it IS the art.
import { useEffect, useState } from 'react';

interface Props {
  /** Already-resolved art url. The caller knows which god; this only paints. */
  src: string;
  name: string;
  epithet?: string;
  /** Held until dismissed when absent, so a shrine can show it while you decide. */
  onDone?: () => void;
}

const BEAT_MS = 2100;

export function Manifest({ src, name, epithet, onDone }: Props) {
  const [lit, setLit] = useState(false);

  useEffect(() => {
    // Mounted-then-lit, so the transition has a frame to start from. Setting the
    // final state in the same paint produces no animation at all.
    const on = requestAnimationFrame(() => setLit(true));
    const off = onDone ? setTimeout(onDone, BEAT_MS) : undefined;
    return () => {
      cancelAnimationFrame(on);
      if (off) clearTimeout(off);
    };
  }, [src, onDone]);

  return (
    <div
      className={`manifest${lit ? ' is-lit' : ''}`}
      role="status"
      aria-live="polite"
      onClick={onDone}
    >
      <div className="manifest__halo" aria-hidden="true" />
      <div className="manifest__frame">
        <img className="manifest__art" src={src} alt="" draggable={false} />
        {/* The sweep is a band of light crossing the painting once, which is
            what makes a still image read as a figure resolving out of the dark
            rather than a picture being faded in. */}
        <span className="manifest__sweep" aria-hidden="true" />
      </div>
      <div className="manifest__name">{name}</div>
      {epithet && <div className="manifest__epithet">{epithet}</div>}
    </div>
  );
}
