import { provisionOf } from '@content/cards';
import type { Card, CardInstance } from '@engine/types';
import { CardFrame } from './CardFrame';
import { TIER_LABEL, TYPE_LABEL, rulesText } from './cardTheme';

// A tap-to-inspect card detail sheet, shared by the match view and the codex.
export function InspectSheet({
  card,
  inst,
  onClose,
}: {
  card: Card;
  inst?: CardInstance;
  onClose: () => void;
}) {
  const rules = rulesText(card);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet__card">
          <CardFrame card={card} instance={inst} />
        </div>
        <div className="sheet__info">
          <div className="sheet__name">{card.name}</div>
          <div className="sheet__meta">
            {TYPE_LABEL[card.type]}
            {card.tier ? ` · ${TIER_LABEL[card.tier]}` : ''}
            {inst ? ` · Power ${inst.currentPower}` : card.basePower ? ` · Power ${card.basePower}` : ''}
            {` · Cost ${provisionOf(card)}`}
          </div>
          {rules.map((r, i) => (
            <div key={i} className="sheet__rule">
              {r}
            </div>
          ))}
          {card.flavor && <div className="sheet__flavor">{card.flavor}</div>}
          <button className="btn btn--primary btn--sm sheet__close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
