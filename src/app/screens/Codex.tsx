import { useState } from 'react';
import { allCards } from '@content/cards';
import type { Card, House } from '@engine/types';
import { Ambient } from '@ui/Ambient';
import { Lintel } from '@ui/frame';
import { CardFrame } from '@ui/card/CardFrame';
import { InspectSheet } from '@ui/card/InspectSheet';
import { HelpButton } from '@ui/HelpButton';

/**
 * A section of the codex: either a whole house, or one kind of card within the
 * neutral pile.
 *
 * The neutral pile used to be a single heading, "Astras and Fates", holding the
 * divine weapons, the named weapons, the shrine gifts and the stratagems all
 * mixed together. Those are four different things that are acquired in
 * different ways and played in different ways, and lumping them made the
 * largest section of the codex the least navigable.
 */
interface Group {
  title: string;
  /** Plain English, for anyone meeting the word for the first time. */
  gloss?: string;
  house?: House;
  types?: Card['type'][];
  /** Astra rank, so the hierarchy the game runs on is visible in the codex. */
  tier?: number;
}

const GROUPS: Group[] = [
  { title: 'The Pandava Army', house: 'pandava' },
  { title: 'The Kaurava Army', house: 'kaurava' },
  { title: 'The Asura Army', house: 'asura' },
  {
    // "Those Who Stood Apart" is a nice phrase and tells a new player nothing.
    // These are the warriors who fought for neither side, so the heading now
    // says that and the old line survives as the gloss.
    title: 'Neutral Warriors',
    gloss: 'who took neither side',
    house: 'legend',
  },
  {
    title: 'Ultimate Astras',
    gloss: 'the world-enders, borne by one man or earned through penance',
    house: 'neutral',
    types: ['astra'],
    tier: 3,
  },
  {
    title: 'Great Astras',
    gloss: 'the Brahma line, for a warrior trained to it',
    house: 'neutral',
    types: ['astra'],
    tier: 2,
  },
  {
    title: 'Elemental Astras',
    gloss: 'fire, water and wind, for any astra-trained warrior',
    house: 'neutral',
    types: ['astra'],
    tier: 1,
  },
  {
    title: 'Shastras',
    gloss: 'named weapons, carried in the hand',
    house: 'neutral',
    types: ['shastra'],
  },
  {
    title: 'Vardaan',
    gloss: 'divine gifts, earned at a shrine',
    house: 'neutral',
    types: ['boon'],
  },
  {
    title: 'Fates',
    gloss: 'tricks of war, and curses',
    house: 'neutral',
    types: ['stratagem', 'curse'],
  },
];

/**
 * Warriors strongest first; weapons by rank, mightiest first.
 *
 * Astras used to fall through to declared order, so the Pashupata sat wherever
 * it happened to be written and the tiers were invisible. They have a canonical
 * hierarchy (tier 3 are the ultimates, tier 1 the elementals) and the codex is
 * where a player goes to learn it, so it leads with the ones that end battles.
 */
function sortCards(cards: Card[]): Card[] {
  return [...cards].sort((a, b) => {
    if (a.type === 'unit' && b.type === 'unit') return b.basePower - a.basePower;
    if (a.type === 'unit') return -1;
    if (b.type === 'unit') return 1;
    const at = a.astraTier ?? 0;
    const bt = b.astraTier ?? 0;
    if (at !== bt) return bt - at;
    return a.name.localeCompare(b.name);
  });
}

export function Codex({ onBack }: { onBack: () => void }) {
  const [inspect, setInspect] = useState<Card | null>(null);
  // The run the open card belongs to, so the sheet can flick straight through
  // it. Held separately from `inspect` because following a link out of a card's
  // rules can land you in a different army, and the pager should follow.
  const [run, setRun] = useState<Card[]>([]);
  const all = allCards();

  return (
    <div className="codex">
      <Ambient scene="codex" opacity={0.4} />
      <div className="codex__bar">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          ‹ Back
        </button>
        <h2 className="codex__title">Codex</h2>
        <span className="codex__count">
          {all.length} cards <HelpButton className="btn btn--ghost btn--sm" />
        </span>
      </div>

      <div className="codex__scroll">
        {GROUPS.map((g) => {
          const group = sortCards(
            all.filter(
              (c) =>
                c.house === g.house &&
                (!g.types || g.types.includes(c.type)) &&
                (g.tier === undefined || (c.astraTier ?? 1) === g.tier),
            ),
          );
          if (!group.length) return null;
          return (
            <section key={g.title} className="codex__section">
              {/* A DRAWN heading rather than a larger one. A section with a
                  lintel and a garland over it reads as a place you have arrived
                  at; the same words at 1.1rem read as a table row. */}
              <Lintel count={group.length}>
                {g.title}
                {g.gloss && <span className="codex__gloss">{g.gloss}</span>}
              </Lintel>
              {/* A SHELF, not a wrapping grid. Thirty-two Pandava cards wrapped
                  into eight rows of four pushed every other army below the
                  fold, so the codex read as one endless pile rather than as
                  three armies you could compare. A rail keeps each army to one
                  line you scan sideways, and the next army is always visible
                  underneath. */}
              <div className="codex__shelf">
                {group.map((c) => (
                  <CardFrame
                    key={c.id}
                    card={c}
                    mini
                    onClick={() => {
                      setRun(group);
                      setInspect(c);
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
        <div className="codex__foot">
          Swipe each row sideways for the rest of that army. Tap a card for its full lore
          and abilities.
        </div>
      </div>

      {/* Tapping a card named in the rules opens THAT card, which is the whole
          point of the codex: follow the thread rather than remember the name
          and come back for it. */}
      {inspect && (
        <InspectSheet
          card={inspect}
          onClose={() => setInspect(null)}
          onPeek={(c) => {
            // A card reached by following a name may not be in the run you were
            // flicking through. Re-home the pager on the army it belongs to, so
            // "7 of 32" never lies about where you are.
            setRun(all.filter((x) => x.house === c.house));
            setInspect(c);
          }}
          siblings={run}
          onNavigate={setInspect}
        />
      )}
    </div>
  );
}
