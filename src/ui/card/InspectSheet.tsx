import { useCallback, useEffect, useRef } from 'react';
import { provisionOf } from '@content/cards';
import { allCards } from '@content/cards';
import type { Card, CardInstance } from '@engine/types';
import { CardFrame } from './CardFrame';
import { artFor } from './cardArt';
import { ROW_GLOSS, TIER_GLOSS, TIER_LABEL, TYPE_GLOSS, TYPE_LABEL, rulesText } from './cardTheme';

const ROW_LABEL_OF: Record<string, string> = { ratha: 'Ratha', gaja: 'Gaja', padati: 'Padati' };

/**
 * Every card NAMED in a rules line becomes tappable.
 *
 * "Bears the Pashupat-Astra, Brahmashirsha-Astra" is a promise the player cannot
 * check without leaving the card, closing it, opening the codex and finding two
 * weapons by name. Now the names are buttons.
 *
 * Longest name first, so "Brahma-Astra" cannot match inside
 * "Brahmashirsha-Astra" and leave a stray fragment behind.
 */
const LINKABLE = allCards()
  .map((c) => c.name)
  .sort((a, b) => b.length - a.length);

function linkCards(line: string, onPeek?: (card: Card) => void): React.ReactNode {
  if (!onPeek) return line;
  const pattern = new RegExp(`(${LINKABLE.map(escapeForRegExp).join('|')})`, 'g');
  const parts = line.split(pattern);
  if (parts.length === 1) return line;
  return parts.map((part, i) => {
    const card = allCards().find((c) => c.name === part);
    return card ? (
      <button key={i} type="button" className="sheet__link" onClick={() => onPeek(card)}>
        {part}
      </button>
    ) : (
      part
    );
  });
}

const escapeForRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Wounded, raised, or as printed. Colour carries it; the number states it. */
function powerClass(now: number, printed: number): string {
  if (now < printed) return 'sheet__power sheet__power--hurt';
  if (now > printed) return 'sheet__power sheet__power--raised';
  return 'sheet__power';
}

/**
 * Every flag a warrior can be carrying, in words rather than engine names.
 *
 * A card could be stupefied, disarmed, denied, guarded by Krishna or standing
 * hidden, and its detail sheet said none of it. The player was told the number
 * and left to infer the reason, which is exactly the complaint: "if the card on
 * deck is hit by an astra or a curse it should show up on their card".
 */
const FLAG_WORDS: Record<string, { label: string; tone: 'good' | 'bad'; text: string }> = {
  'diamond-body': {
    label: 'Adamant body',
    tone: 'good',
    text: 'Cannot be slain, and cannot be worn below a third of his strength.',
  },
  'krishna-guarded': {
    label: 'Guarded by Krishna',
    tone: 'good',
    text: 'A killing weapon aimed at him is turned aside.',
  },
  hidden: {
    label: 'Unseen',
    tone: 'good',
    text: 'He fights from cover. Nothing can be aimed at him directly.',
  },
  stupefied: {
    label: 'Stupefied',
    tone: 'bad',
    text: 'Senseless on the field, and no use to anyone this round.',
  },
  disarmed: {
    label: 'Disarmed',
    tone: 'bad',
    text: 'His guard is broken, and what protected him no longer does.',
  },
  stripped: {
    label: 'Stripped',
    tone: 'bad',
    text: 'His protections have been counselled away and no longer apply.',
  },
  denied: {
    label: 'Denied',
    tone: 'bad',
    text: 'Barred from taking the field this round.',
  },
  'wheel-sunk': {
    label: 'Wheel sunk',
    tone: 'bad',
    text: 'His chariot is fast in the earth.',
  },
};

/** Wounds, boons and afflictions currently riding on a fielded card. */
function InstanceState({ inst, card }: { inst: CardInstance; card: Card }) {
  const flags = [...inst.flags].filter((f) => FLAG_WORDS[f]);
  const wounded = inst.currentPower < card.basePower;
  const armor = inst.counters?.armor ?? 0;
  if (!flags.length && !wounded && !armor && !inst.boons?.length) return null;
  return (
    <div className="sheet__state">
      {wounded && (
        <span className="state-chip state-chip--bad" title="Damage taken this battle">
          Wounded −{card.basePower - inst.currentPower}
        </span>
      )}
      {armor > 0 && (
        <span className="state-chip state-chip--good" title="Absorbs the next strike">
          Armour {armor}
        </span>
      )}
      {flags.map((f) => (
        <span
          key={f}
          className={`state-chip state-chip--${FLAG_WORDS[f].tone}`}
          title={FLAG_WORDS[f].text}
        >
          {FLAG_WORDS[f].label}
        </span>
      ))}
    </div>
  );
}

/**
 * How far a flick must travel before it counts as "next card", in pixels.
 *
 * Generous, because this gesture competes with scrolling and losing your place
 * in a card you were reading is far more annoying than a flick that did not
 * take. Only fires at a scroll boundary anyway.
 */
const FLICK = 70;

// A tap-to-inspect card detail sheet, shared by the match view and the codex.
export function InspectSheet({
  card,
  inst,
  onClose,
  onPlay,
  onSwap,
  blockedReason,
  onPeek,
  siblings,
  onNavigate,
}: {
  card: Card;
  inst?: CardInstance;
  onClose: () => void;
  /** Present when this card can be played from here. */
  onPlay?: () => void;
  /** Present when the once-a-round trade is available for this card. */
  onSwap?: () => void;
  /** Why it cannot be, if it cannot. Shown instead of the play button. */
  blockedReason?: string;
  /** Open another card named in this one's rules. */
  onPeek?: (card: Card) => void;
  /**
   * The run of cards this one sits in, for flicking straight through them.
   *
   * The codex passes the army you opened the card from. The match view does
   * not pass anything, because there is no "next card" when you are inspecting
   * a man standing on the field.
   */
  siblings?: readonly Card[];
  onNavigate?: (card: Card) => void;
}) {
  const rules = rulesText(card);
  // The board card crops the art to a square. This is the one place the whole
  // picture is shown, uncropped, at a size worth the effort of making it.
  const art = artFor(card);

  const scroller = useRef<HTMLDivElement | null>(null);
  const at = siblings ? siblings.findIndex((c) => c.id === card.id) : -1;
  const paging = at >= 0 && !!onNavigate && siblings!.length > 1;
  const go = useCallback(
    (by: number) => {
      if (!paging) return;
      const next = siblings![at + by];
      if (!next) return;
      // Back to the top, or you land halfway down a card you have not read.
      if (scroller.current) scroller.current.scrollTop = 0;
      onNavigate!(next);
    },
    [paging, siblings, at, onNavigate],
  );

  // Arrow keys and Escape. A sheet you can only leave by aiming at a small ✕ is
  // a sheet that is annoying on a desktop, and this is the one screen a player
  // reads at length.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (!paging) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, go, paging]);

  /**
   * Flick to the next card, WITHOUT breaking the ability to read this one.
   *
   * A plain vertical swipe would fight the sheet's own scrolling, and these
   * sheets are long. So a vertical flick only counts at the scroll boundary:
   * push up from the bottom for the next card, pull down from the top for the
   * previous one. A horizontal flick always counts, because nothing else on
   * this sheet uses horizontal movement.
   */
  const from = useRef<{ x: number; y: number; top: number; bottom: boolean } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    const el = scroller.current;
    if (!el) return;
    from.current = {
      x: e.clientX,
      y: e.clientY,
      top: el.scrollTop,
      bottom: el.scrollTop + el.clientHeight >= el.scrollHeight - 2,
    };
  };
  const onUp = (e: React.PointerEvent) => {
    const start = from.current;
    from.current = null;
    if (!start || !paging) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx <= -FLICK) go(1);
      else if (dx >= FLICK) go(-1);
      return;
    }
    if (dy <= -FLICK && start.bottom) go(1);
    else if (dy >= FLICK && start.top <= 0) go(-1);
  };

  return (
    <div
      className="overlay"
      onClick={onClose}
      ref={scroller}
      onPointerDown={onDown}
      onPointerUp={onUp}
    >
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
            {/* WHAT HAS BEEN DONE TO HIM, not just where he ended up. A warrior
                printed at 10 and standing at 4 used to render a flat "Power 4",
                which is indistinguishable from a card that was always a 4. You
                could not tell a wounded giant from a small man. */}
            {inst ? (
              <>
                {' · Power '}
                <span className={powerClass(inst.currentPower, card.basePower)}>
                  {inst.currentPower}
                </span>
                {inst.currentPower !== card.basePower && (
                  <span className="sheet__was"> (printed {card.basePower})</span>
                )}
              </>
            ) : card.basePower ? (
              ` · Power ${card.basePower}`
            ) : (
              ''
            )}
            {/* "Cost" reads as a cost to PLAY, which does not exist in this
                game: there is no per-turn or per-round pool of anything. It is
                the price the card charges when you are building your army, and
                it does nothing at all once the battle starts. */}
            {` · ${provisionOf(card)} provisions to muster`}
          </div>
          {/* Everything currently riding on him: wounds, boons, curses, bans. */}
          {inst && <InstanceState inst={inst} card={card} />}
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
              {linkCards(r, onPeek)}
            </div>
          ))}
          {card.flavor && <div className="sheet__flavor">{card.flavor}</div>}
          {/* You should never have to commit a card to find out what it does.
              The play action lives HERE, after you have read it. */}
          {blockedReason && <div className="sheet__blocked">{blockedReason}</div>}
          {onSwap && (
            <button
              className="btn btn--sm sheet__close"
              title="Return this card to the deck and draw another. Once per round, before you play."
              onClick={onSwap}
            >
              Trade back for a new card
            </button>
          )}
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

        {/* THE PAGER. The flick is the point, and a gesture with no visible
            control is a gesture nobody discovers, so the same move is also two
            buttons and the arrow keys. The counter is what tells you the flick
            exists at all. */}
        {paging && (
          <div className="sheet__pager">
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => go(-1)}
              disabled={at === 0}
              aria-label="Previous card"
            >
              ‹
            </button>
            <span className="sheet__pager-count">
              {at + 1} of {siblings!.length}
            </span>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => go(1)}
              disabled={at === siblings!.length - 1}
              aria-label="Next card"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
