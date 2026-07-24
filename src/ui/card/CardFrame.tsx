import type { CSSProperties, MouseEvent } from 'react';
import type { Card, CardInstance } from '@engine/types';
import { HOUSE_PALETTE, TIER_LABEL, TYPE_LABEL, cardGlyph, tierMark } from './cardTheme';

interface Props {
  card: Card;
  instance?: CardInstance;
  mini?: boolean;
  selected?: boolean;
  targetable?: boolean;
  /** A fielded warrior with an unspent skill at arms this battle. */
  ready?: boolean;
  dead?: boolean;
  onClick?: () => void;
  onEnter?: (e: MouseEvent) => void;
  onLeave?: () => void;
}

export function CardFrame({
  card,
  instance,
  mini,
  selected,
  targetable,
  ready,
  dead,
  onClick,
  onEnter,
  onLeave,
}: Props) {
  const pal = HOUSE_PALETTE[card.house];
  const style = {
    '--pal-base': pal.base,
    '--pal-edge': pal.edge,
    '--pal-ink': pal.ink,
    '--pal-glow': pal.glow,
  } as CSSProperties;

  const power = instance ? instance.currentPower : card.basePower;
  const buffed = instance && power > card.basePower;
  const damaged = instance && power < card.basePower;
  const isUnit = card.type === 'unit';

  const classes = [
    'card',
    mini ? 'card--mini' : '',
    onClick ? 'card--hand' : '',
    selected ? 'card--selected' : '',
    targetable ? 'card--targetable' : '',
    ready ? 'card--ready' : '',
    dead ? 'card--dead' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={style}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="card__head">
        <span className="card__name">{card.name}</span>
        {card.tier && (
          <span className="card__tier" title={TIER_LABEL[card.tier]}>
            {tierMark(card.tier)}
          </span>
        )}
      </div>

      <div className="card__art">
        {card.art ? <img src={card.art} alt={card.name} /> : <span>{cardGlyph(card)}</span>}
      </div>

      <div className="card__foot">
        <span className="card__type">{TYPE_LABEL[card.type]}</span>
      </div>

      {isUnit && (
        <div
          className={
            'card__power' +
            (buffed ? ' card__power--buffed' : damaged ? ' card__power--damaged' : '')
          }
        >
          {power}
        </div>
      )}

      <div className="card__badges">
        {instance?.flags.has('krishna-guarded') && <span title="Guarded by Krishna">🪈</span>}
        {instance && (instance.counters.armor ?? 0) > 0 && <span title="Armoured">🛡️</span>}
        {instance?.flags.has('diamond-body') && <span title="Diamond body">💎</span>}
        {instance?.flags.has('wheel-sunk') && <span title="Chariot wheel sunk">🛞</span>}
      </div>
    </div>
  );
}
