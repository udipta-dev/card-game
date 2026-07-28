import { provisionOf } from '@content/cards';
import type { Card, CardInstance } from '@engine/types';
import { CardFrame } from './CardFrame';
import { artFor } from './cardArt';
import { ROW_GLOSS, TIER_GLOSS, TIER_LABEL, TYPE_GLOSS, TYPE_LABEL, rulesText } from './cardTheme';

const ROW_LABEL_OF: Record<string, string> = { ratha: 'Ratha', gaja: 'Gaja', padati: 'Padati' };

// A tap-to-inspect card detail sheet, shared by the match view and the codex.
export function InspectSheet({
  card,
  inst,
  onClose,
  onPlay,
  blockedReason,
}: {
  card: Card;
  inst?: CardInstance;
  onClose: () => void;
  /** Present when this card can be played from here. */
  onPlay?: () => void;
  /** Why it cannot be, if it cannot. Shown instead of the play button. */
  blockedReason?: string;
}) {
  const rules = rulesText(card);
  // The board card crops the art to a square. This is the one place the whole
  // picture is shown, uncropped, at a size worth the effort of making it.
  const art = artFor(card);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        {art ? (
          <div className="sheet__art">
            <img src={art} alt="" />
          </div>
        ) : (
          <div className="sheet__card">
            <CardFrame card={card} instance={inst} />
          </div>
        )}
        <div className="sheet__info">
          <div className="sheet__name">{card.name}</div>
          <div className="sheet__meta">
            {TYPE_LABEL[card.type]}
            {card.tier ? ` · ${TIER_LABEL[card.tier]}` : ''}
            {inst ? ` · Power ${inst.currentPower}` : card.basePower ? ` · Power ${card.basePower}` : ''}
            {` · Cost ${provisionOf(card)}`}
          </div>
          {/* Every Sanskrit term explains itself the first time you meet it. */}
          <div className="sheet__gloss">
            {TYPE_GLOSS[card.type]}
            {card.tier ? ` · ${TIER_LABEL[card.tier]}: ${TIER_GLOSS[card.tier]}` : ''}
          </div>
          {card.rows.length > 0 && card.type === 'unit' && (
            <div className="sheet__gloss">
              Fights in: {card.rows.map((r) => `${ROW_LABEL_OF[r]} (${ROW_GLOSS[r]})`).join(', ')}
            </div>
          )}
          {rules.map((r, i) => (
            <div key={i} className="sheet__rule">
              {r}
            </div>
          ))}
          {card.flavor && <div className="sheet__flavor">{card.flavor}</div>}
          {/* You should never have to commit a card to find out what it does.
              The play action lives HERE, after you have read it. */}
          {blockedReason && <div className="sheet__blocked">{blockedReason}</div>}
          {onPlay && (
            <button className="btn btn--primary btn--sm sheet__close" onClick={onPlay}>
              Play {card.name}
            </button>
          )}
          <button
            className={`btn ${onPlay ? 'btn--ghost' : 'btn--primary'} btn--sm sheet__close`}
            onClick={onClose}
          >
            {onPlay ? 'Back' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
