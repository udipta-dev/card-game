// The drifting atmosphere behind a screen.
//
// Six clips, and only six. Everything else that was going to be generated
// footage (gods, astras, endings, battle beats) is animated in code out of the
// paintings we already ship, because a generated Agni is not OUR Agni and would
// mismatch the art beside it. What survives here is the one thing code cannot
// fake and video is genuinely good at: weather with no object in it.
//
// THE LOOP IS THE WHOLE PROBLEM. These clips do not loop seamlessly, and no
// generator produces ones that do, so playing a single <video loop> shows a
// visible cut every eight seconds. Two copies run instead, offset by half the
// duration, crossfading into each other. On slow drifting haze the seam is
// invisible; it would be obvious on anything that moved quickly, which is why
// the prompts asked for motion where the first and last frames match.
import { useEffect, useRef, useState } from 'react';

const FILES = import.meta.glob('../assets/video/ambient-*.mp4', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** Which drifting scene sits behind a given screen. */
export type Scene = 'menu-dawn' | 'menu-dusk' | 'board-haze' | 'map-road' | 'shrine' | 'codex';

function sourceFor(scene: Scene): string | undefined {
  const key = Object.keys(FILES).find((p) => p.endsWith(`ambient-${scene}.mp4`));
  return key ? FILES[key] : undefined;
}

/** Seconds. Every clip is eight, and the crossfade starts at the halfway mark. */
const CLIP_SECS = 8;
const FADE_MS = 1400;

interface Props {
  scene: Scene;
  /**
   * How far to sink it behind the content. These are backgrounds, and a
   * background that competes with the text on top of it has failed at its job.
   */
  opacity?: number;
}

export function Ambient({ scene, opacity = 0.34 }: Props) {
  const src = sourceFor(scene);
  const [front, setFront] = useState(true);
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);

  // Nobody who asked not to be moved should be handed eight seconds of drifting
  // smoke. They get the first frame, which still carries the colour and the
  // texture without any of the motion.
  const still =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!src || still) return;
    // MUTED HAS TO BE SET ON THE ELEMENT, not just in JSX. React assigns it as a
    // property after the element exists, so the browser's autoplay policy sees
    // an unmuted video at the moment it decides, and silently refuses to play
    // it. The clips loaded fine and simply sat there paused.
    for (const el of [a.current, b.current]) {
      if (!el) continue;
      el.muted = true;
      // A rejected play() is not an error worth surfacing: some browsers refuse
      // until the user has interacted, and the background is decorative.
      void el.play().catch(() => {});
    }
    // Start the trailing copy halfway through, so its own fade-in lands where
    // the leading copy runs out.
    if (b.current) b.current.currentTime = CLIP_SECS / 2;

    // AND TRY AGAIN ON THE FIRST TOUCH. Muted inline autoplay is allowed by
    // every current browser, but not by all of them in every configuration, and
    // a page that has had no interaction yet is exactly the case they refuse.
    // Verified refused-then-allowed in the preview: the clips loaded, sat at
    // readyState 4, and only played once something had been clicked.
    const retry = () => {
      for (const el of [a.current, b.current]) void el?.play().catch(() => {});
    };
    window.addEventListener('pointerdown', retry, { once: true });
    window.addEventListener('keydown', retry, { once: true });

    const swap = setInterval(() => setFront((f) => !f), (CLIP_SECS / 2) * 1000);
    return () => {
      clearInterval(swap);
      window.removeEventListener('pointerdown', retry);
      window.removeEventListener('keydown', retry);
    };
  }, [src, still]);

  if (!src) return null;

  const common = {
    className: 'ambient__clip',
    src,
    muted: true,
    playsInline: true,
    autoPlay: !still,
    loop: true,
    // Decorative. A screen reader announcing "video" over every screen would be
    // noise, and there is nothing here to describe.
    'aria-hidden': true as const,
    tabIndex: -1,
  };

  return (
    <div className="ambient" style={{ opacity }} aria-hidden="true">
      {still ? (
        <video {...common} autoPlay={false} loop={false} ref={a} />
      ) : (
        <>
          <video {...common} ref={a} style={{ opacity: front ? 1 : 0 }} />
          <video {...common} ref={b} style={{ opacity: front ? 0 : 1 }} />
        </>
      )}
      <style>{`.ambient__clip{transition:opacity ${FADE_MS}ms linear}`}</style>
    </div>
  );
}
