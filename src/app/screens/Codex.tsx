import { useState } from 'react';
import { allCards } from '@content/cards';
import type { Card, House } from '@engine/types';
import { CardFrame } from '@ui/card/CardFrame';
import { InspectSheet } from '@ui/card/InspectSheet';

const GROUPS: { title: string; house: House }[] = [
  { title: 'The Pandava Host', house: 'pandava' },
  { title: 'The Kaurava Host', house: 'kaurava' },
  { title: 'Astras and Fates', house: 'neutral' },
];

function sortCards(cards: Card[]): Card[] {
  // Units by power (strongest first), then the rest in declared order.
  return [...cards].sort((a, b) => {
    if (a.type === 'unit' && b.type === 'unit') return b.basePower - a.basePower;
    if (a.type === 'unit') return -1;
    if (b.type === 'unit') return 1;
    return 0;
  });
}

export function Codex({ onBack }: { onBack: () => void }) {
  const [inspect, setInspect] = useState<Card | null>(null);
  const all = allCards();

  return (
    <div className="codex">
      <div className="codex__bar">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          ‹ Back
        </button>
        <h2 className="codex__title">Codex</h2>
        <span className="codex__count">{all.length} cards</span>
      </div>

      <div className="codex__scroll">
        {GROUPS.map((g) => {
          const group = sortCards(all.filter((c) => c.house === g.house));
          return (
            <section key={g.house} className="codex__section">
              <h3 className="codex__group">
                {g.title}
                <span className="codex__group-n">{group.length}</span>
              </h3>
              <div className="codex__grid">
                {group.map((c) => (
                  <CardFrame key={c.id} card={c} mini onClick={() => setInspect(c)} />
                ))}
              </div>
            </section>
          );
        })}
        <div className="codex__foot">Tap a card for its full lore and abilities.</div>
      </div>

      {inspect && <InspectSheet card={inspect} onClose={() => setInspect(null)} />}
    </div>
  );
}
