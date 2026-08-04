import type { CSSProperties, MouseEvent } from 'react';
import { Adamant, Boss, Conch, SunkWheel } from '../ornament';
import type { Card, CardInstance } from '@engine/types';
import { HOUSE_PALETTE, TIER_LABEL, TYPE_LABEL, tierMark } from './cardTheme';
import { markFor } from './marks';

/** Weapon art is generated on pure black and screen-blended, so the card shows
 *  the weapon's light on the card's own ground instead of a black rectangle.
 *  See the ON_BLACK note in sim/build-art-prompts.ts. */
const EMISSIVE = new Set(['astra', 'shastra']);
import { artFor } from './cardArt';

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
  const art = artFor(card);
  const Mark = markFor(card.id, card.type);
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
    // Rank rides on the FRAME, not on colour: house already owns colour, so
    // layering rank as weight and ornament keeps both readable at once, and
    // keeps working at 51px where the tier chevron is far too small to see.
    card.tier ? `card--${card.tier}` : '',
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

      <div className={'card__art' + (art && EMISSIVE.has(card.type) ? ' card__art--emissive' : '')}>
        {art ? (
          <img src={art} alt="" loading="lazy" draggable={false} />
        ) : (
          <Mark size={mini ? 26 : 44} className="card__mark" />
        )}
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
        {instance?.flags.has('krishna-guarded') && (
          <Conch size={15} className="glyph" title="Guarded by Krishna" />
        )}
        {instance && (instance.counters.armor ?? 0) > 0 && (
          <Boss size={15} className="glyph" title="Armoured" />
        )}
        {instance?.flags.has('diamond-body') && (
          <Adamant size={15} className="glyph" title="Adamantine body" />
        )}
        {instance?.flags.has('wheel-sunk') && (
          <SunkWheel size={15} className="glyph" title="The earth has his wheel" />
        )}
      </div>
    </div>
  );
}
