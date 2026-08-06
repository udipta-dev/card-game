import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { getCard, provisionOf } from '@content/cards';
import type { DeckList } from '@content/decks';
import { chooseAction } from '@ai/ai';
import { createMatch } from '@engine/createMatch';
import type { BattleInit } from '@engine/createMatch';
import { isLegalAbility, reduce } from '@engine/reducer';
import { canInvokeAstra, isFinalRound, rowPower, seatPower } from '@engine/queries';
import { cursedAgainstAstras, getCurse } from '@engine/curses';
import { fieldedMastery } from '@engine/clash';
import { legalMoves } from '@engine/selectors';
import { ROWS } from '@engine/types';
import type { Action, Card, GameState, House, InstanceId, Row, Seat } from '@engine/types';
import { CardFrame } from '@ui/card/CardFrame';
import { InspectSheet } from '@ui/card/InspectSheet';
import { FACTION_DOT, FACTION_NAME, ROW_GLOSS, TIER_LABEL, TYPE_LABEL, rulesText } from '@ui/card/cardTheme';
import { Fan, ROW_GLYPH, Rosette } from '@ui/ornament';
import { HowToPlay } from '@ui/HowToPlay';
import { eventText } from './eventText';

const ROW_LABEL: Record<Row, string> = { ratha: 'Ratha', gaja: 'Gaja', padati: 'Padati' };
const AI_DELAY = 700;

type Plan =
  | { mode: 'drop-own'; rows: Row[] }
  | { mode: 'drop-enemy'; rows: Row[] }
  | { mode: 'target-enemy'; candidates: InstanceId[] }
  | { mode: 'target-own'; candidates: InstanceId[] }
  | { mode: 'cast'; row: Row };

interface Props {
  seed: number;
  playerDeck: DeckList;
  aiDeck: DeckList;
  onExit: () => void;
  /** Run mode: carried arsenal/curses seeded into this battle. */
  init?: BattleInit;
  /** Run mode: hand the finished state back to the run instead of exiting. */
  onFinish?: (finalState: GameState) => void;
}

export function MatchView({ seed, playerDeck, aiDeck, onExit, init, onFinish }: Props) {
  // The AI opens (firstMover 'ai') so the human plays second and gets the
  // last-say edge, which keeps a single-player match feeling fair.
  const [state, dispatch] = useReducer(reduce, undefined, () =>
    createMatch(seed, playerDeck, aiDeck, 'ai', init),
  );
  const [selected, setSelected] = useState<InstanceId | null>(null);
  const [mSel, setMSel] = useState<InstanceId[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [inspect, setInspect] = useState<{
    card: Card;
    inst?: GameState['instances'][string];
    onSwap?: () => void;
    onPlay?: () => void;
    blockedReason?: string;
  } | null>(null);
  const [tip, setTip] = useState<{ card: Card; inst?: GameState['instances'][string]; x: number; y: number } | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [awaitingSanction, setAwaitingSanction] = useState<{ action: Action; card: Card } | null>(null);
  const [omen, setOmen] = useState<{ tone: 'curse' | 'burn' | 'clash'; title: string; text: string } | null>(null);
  const [abilityPrompt, setAbilityPrompt] = useState<{ iid: InstanceId; card: Card } | null>(null);
  const roundEndsSeen = useRef(0);
  const logSeen = useRef(0);

  const myTurn = state.phase === 'playing' && state.activeSeat === 'player';
  // Shown in the counter dialog so the curse is never a surprise.
  const myMastery = fieldedMastery(state, 'player');
  const foeMastery = fieldedMastery(state, 'ai');

  // --- AI turns (fires repeatedly while it is the AI's turn) ---
  useEffect(() => {
    const aiToMove =
      (state.phase === 'playing' || state.phase === 'awaitingCounter') && state.activeSeat === 'ai';
    if (aiToMove) {
      const t = setTimeout(() => dispatch(chooseAction(state, 'ai')), AI_DELAY);
      return () => clearTimeout(t);
    }
  }, [state]);

  // --- Auto-mulligan for the AI once the player is done ---
  useEffect(() => {
    if (state.phase === 'mulligan' && state.mulliganDone.player && !state.mulliganDone.ai) {
      dispatch({ type: 'MULLIGAN', seat: 'ai', iids: [] });
    }
  }, [state]);

  // --- Round-transition banner ---
  useEffect(() => {
    const ends = state.log.filter((e) => e.t === 'roundEnd').length;
    if (ends > roundEndsSeen.current) {
      roundEndsSeen.current = ends;
      const last = [...state.log].reverse().find((e) => e.t === 'roundEnd');
      if (last && last.t === 'roundEnd' && state.phase === 'playing') {
        const txt =
          last.winner === 'tie'
            ? 'Round drawn'
            : last.winner === 'player'
              ? 'Round won'
              : 'Round lost';
        setBanner(txt);
        setSelected(null);
      }
    }
  }, [state]);

  // Clear the round banner on its own timer. This MUST be keyed on `banner`, not
  // on `state`: an AI move ~700ms later changes `state`, and if the clear-timeout
  // lived on the state effect its cleanup would cancel the timer and the banner
  // would freeze on screen forever, which reads exactly like the game hanging.
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 1600);
    return () => clearTimeout(t);
  }, [banner]);

  // --- Omens: curses, burnt warriors and clashing weapons announce themselves.
  // These are the consequences of the great astras, and they are the whole
  // point of firing one, so they get a beat of their own rather than a log line.
  useEffect(() => {
    const fresh = state.log.slice(logSeen.current);
    logSeen.current = state.log.length;
    for (const e of fresh) {
      if (e.t === 'afflict') {
        setOmen({
          tone: 'curse',
          title: e.seat === 'player' ? `You are cursed: ${e.name}` : `The enemy is cursed: ${e.name}`,
          text: e.text,
        });
      } else if (e.t === 'burn') {
        const names = e.cardIds.map((c) => getCard(c).name).join(', ');
        setOmen({
          tone: 'burn',
          title: e.seat === 'player' ? 'Torn from your host' : 'Torn from the enemy host',
          text: `${names}. Lost for the rest of the run.`,
        });
      } else if (e.t === 'clash') {
        setOmen({
          tone: 'clash',
          title: 'The weapons meet in the air',
          text:
            `${getCard(e.astra).name} against ${getCard(e.against).name}. Both hosts are scoured for ${e.blast}.` +
            (e.unwithdrawn
              ? ` ${e.unwithdrawn === 'player' ? 'You could not withdraw yours.' : 'The enemy could not withdraw his.'}`
              : ' Both weapons were recalled in time.'),
        });
      }
    }
  }, [state]);

  useEffect(() => {
    if (!omen) return;
    const t = setTimeout(() => setOmen(null), 5200);
    return () => clearTimeout(t);
  }, [omen]);

  const myMoves = useMemo(() => (myTurn ? legalMoves(state, 'player') : []), [state, myTurn]);

  // Dev-only handle on the live match, so a question about what the engine
  // thinks can be answered by asking it rather than by reasoning about it.
  if (import.meta.env?.DEV) (window as unknown as { kuru?: unknown }).kuru = { state, myTurn, myMoves };

  const selectedCard = selected ? getCard(state.instances[selected]!.cardId) : null;
  const plan: Plan | null = useMemo(() => {
    if (!selectedCard || !selected) return null;
    return planFor(selectedCard, selected, myMoves);
  }, [selectedCard, selected, myMoves]);

  // ---- Actions ----
  function play(action: Action) {
    // The great weapons do not go off by a stray tap. Anything that unmakes the
    // field asks once, and says plainly what it will cost you.
    if (action.type === 'PLAY_CARD') {
      const card = getCard(state.instances[action.iid]!.cardId);
      // Any Brahma-line weapon or greater warns before it is fired, so its
      // price is known and chosen, never sprung on you after the fact.
      if (card.type === 'astra' && (card.astraTier ?? 1) >= 2) {
        setAwaitingSanction({ action, card });
        return;
      }
    }
    dispatch(action);
    setSelected(null);
  }
  /** The player has looked Shiva in the eye and gone ahead anyway. */
  function confirmSanction() {
    if (!awaitingSanction) return;
    dispatch(awaitingSanction.action);
    setAwaitingSanction(null);
    setSelected(null);
  }
  function onHandClick(iid: InstanceId) {
    // ALWAYS show the card first. You should never have to commit a warrior or
    // an astra to find out what it does; the play action lives inside the
    // detail sheet, after you have read it.
    const inst = state.instances[iid]!;
    const card = getCard(inst.cardId);
    const canPlay = myTurn && myMoves.some((m) => m.type === 'PLAY_CARD' && m.iid === iid);
    // The once-a-round trade rides in the same sheet as Play: you are already
    // looking at the card you are unsure about, and that is exactly the moment
    // the trade is for.
    const canSwap = myMoves.some((m) => m.type === 'ROUND_SWAP' && m.iid === iid);
    setInspect({
      card,
      inst,
      onPlay: canPlay ? () => { setInspect(null); setSelected(iid); } : undefined,
      onSwap: canSwap
        ? () => { setInspect(null); dispatch({ type: 'ROUND_SWAP', seat: 'player', iid }); }
        : undefined,
      blockedReason: canPlay ? undefined : whyNotPlayable(state, iid, myTurn),
    });
  }
  function onRowClick(seat: Seat, row: Row) {
    if (!plan || !selected) return;
    if (plan.mode === 'drop-own' && seat === 'player' && plan.rows.includes(row)) {
      play(buildUnitPlay(state, selected, row));
    } else if (plan.mode === 'drop-enemy' && seat === 'ai' && plan.rows.includes(row)) {
      play({ type: 'PLAY_CARD', iid: selected, row });
    }
  }
  function onUnitClick(iid: InstanceId) {
    if (!plan || !selected) return;
    const card = getCard(state.instances[selected]!.cardId);
    if (plan.mode === 'target-enemy' && plan.candidates.includes(iid)) {
      play({ type: 'PLAY_CARD', iid: selected, row: card.rows[0], targets: [iid] });
    } else if (plan.mode === 'target-own' && plan.candidates.includes(iid)) {
      play({ type: 'PLAY_CARD', iid: selected, row: card.rows[0], targets: [iid] });
    }
  }

  // ---- Tooltip ----
  const showTip = (card: Card, inst: GameState['instances'][string] | undefined) => (e: MouseEvent) =>
    setTip({ card, inst, x: e.clientX, y: e.clientY });
  const hideTip = () => setTip(null);

  const targetableEnemy = plan?.mode === 'target-enemy' ? plan.candidates : [];
  const targetableOwn = plan?.mode === 'target-own' ? plan.candidates : [];
  const dropOwn = plan?.mode === 'drop-own' ? plan.rows : [];
  const dropEnemy = plan?.mode === 'drop-enemy' ? plan.rows : [];

  const pScore = seatPower(state, 'player');
  const aScore = seatPower(state, 'ai');

  const renderRow = (seat: Seat, row: Row) => {
    const droppable =
      (seat === 'player' && dropOwn.includes(row)) || (seat === 'ai' && dropEnemy.includes(row));
    return (
      <div
        key={`${seat}-${row}`}
        className={[
          'row',
          `row--${row}`,
          seat === 'ai' ? 'row--enemy' : 'row--own',
          droppable ? 'row--droppable' : '',
        ].join(' ')}
        onClick={() => onRowClick(seat, row)}
      >
        <span className="row__label" title={`${ROW_LABEL[row]}: ${ROW_GLOSS[row]}`}>
          {(() => {
            const Glyph = ROW_GLYPH[row];
            return <Glyph size={17} className="row__glyph" />;
          })()}
          <span className="row__words">
            {ROW_LABEL[row]}
            <span className="row__gloss">{ROW_GLOSS[row]}</span>
          </span>
        </span>
        <div className="row__cards">
          {state.board[seat][row].map((iid) => {
            const u = state.instances[iid];
            if (!u) return null;
            const card = getCard(u.cardId);
            const isTargetable =
              (seat === 'ai' && targetableEnemy.includes(iid)) ||
              (seat === 'player' && targetableOwn.includes(iid));
            return (
              <CardFrame
                key={iid}
                mini
                card={card}
                instance={u}
                dead={u.currentPower <= 0}
                stupefied={u.flags.has('stupefied')}
                targetable={isTargetable}
                ready={seat === 'player' && myTurn && isLegalAbility(state, 'player', iid)}
                onClick={() =>
                  isTargetable
                    ? onUnitClick(iid)
                    : seat === 'player' && myTurn && isLegalAbility(state, 'player', iid)
                      ? setAbilityPrompt({ iid, card })
                      : setInspect({ card, inst: u })
                }
                onEnter={showTip(card, u)}
                onLeave={hideTip}
              />
            );
          })}
        </div>
        <span className="row__power">{rowPower(state, seat, row)}</span>
      </div>
    );
  };

  return (
    <div className="match">
      <Topbar
        state={state}
        playerHouse={playerDeck.house}
        aiHouse={aiDeck.house}
        onExit={onExit}
        onHelp={() => setShowHelp(true)}
      />

      <div className="board">
        <div className="board__group">{ROWS.slice().reverse().map((r) => renderRow('ai', r))}</div>
        <div className="score-strip">
          <div className="score-side score-side--ai">
            <span className="score-num score-num--ai">{aScore}</span>
            <span className="score-label">
              Enemy <RoundPips n={state.roundWins.ai} lead={aScore > pScore} />
            </span>
          </div>
          <div className="score-mid">
            <span className={'score-lead ' + (pScore > aScore ? 'score-lead--you' : aScore > pScore ? 'score-lead--foe' : '')}>
              {pScore > aScore ? 'You lead' : aScore > pScore ? 'Enemy leads' : 'Level'}
            </span>
            <span className="score-vs">First to two rounds</span>
          </div>
          <div className="score-side score-side--player">
            <span className="score-num score-num--player">{pScore}</span>
            <span className="score-label">
              You <RoundPips n={state.roundWins.player} lead={pScore > aScore} />
            </span>
          </div>
        </div>
        <div className="board__group">{ROWS.map((r) => renderRow('player', r))}</div>
      </div>

      <div className="hand-tray">
        <div className="hint">
          {state.phase === 'playing' && (
            <>
              <span className={'turn-flag' + (myTurn ? ' turn-flag--you' : '')}>
                <span className="turn-flag__dot" />
                {myTurn ? 'Your turn' : "Enemy's turn"}
              </span>
              <span style={{ opacity: 0.35 }}>{'   ·   '}</span>
            </>
          )}
          <span className={myTurn ? 'hint--act' : ''}>{hintText(state, myTurn, plan, selectedCard)}</span>
        </div>
        <div className="hand">
          {sortedHand(state.hands.player, state).map((iid, i, arr) => {
            const card = getCard(state.instances[iid]!.cardId);
            const playable = myMoves.some((m) => m.type === 'PLAY_CARD' && m.iid === iid);
            // A thin divider where warriors give way to astras/fates in the hand.
            const prev = i > 0 ? getCard(state.instances[arr[i - 1]]!.cardId).type : card.type;
            const groupBreak = handGroup(card.type) !== handGroup(prev);
            return (
              <div className="hand__slot" key={iid}>
                {groupBreak && <span className="hand__divider" aria-hidden="true" />}
                <CardFrame
                  card={card}
                  instance={state.instances[iid]}
                  selected={selected === iid}
                  onClick={() => onHandClick(iid)}
                  dead={myTurn && !playable}
                  onEnter={showTip(card, state.instances[iid])}
                  onLeave={hideTip}
                />
              </div>
            );
          })}
        </div>
        <div className="controls">
          {plan?.mode === 'cast' && selected && (
            <button
              className="btn btn--primary btn--sm"
              onClick={() => play({ type: 'PLAY_CARD', iid: selected, row: (plan as { row: Row }).row })}
            >
              Invoke {selectedCard?.name}
            </button>
          )}
          <button
            className="btn btn--sm"
            disabled={!myTurn}
            title="Stop playing and save your remaining cards for later rounds"
            onClick={() => dispatch({ type: 'PASS', seat: 'player' })}
          >
            Pass, keep my cards{state.passed.ai ? ' (enemy passed)' : ''}
          </button>
        </div>
      </div>

      {tip && <Tooltip {...tip} />}
      <EventFeed state={state} />
      {banner && (
        <div className="overlay" style={{ background: 'transparent', pointerEvents: 'none' }}>
          <div className="banner">{banner}</div>
        </div>
      )}
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
      {omen && (
        <div className={`omen omen--${omen.tone}`} role="status" onClick={() => setOmen(null)}>
          <div className="omen__title">{omen.title}</div>
          <div className="omen__text">{omen.text}</div>
        </div>
      )}
      {abilityPrompt && (
        <div className="overlay" onClick={() => setAbilityPrompt(null)}>
          <div className="panel ability-panel" onClick={(e) => e.stopPropagation()}>
            <div className="ability-panel__who">{abilityPrompt.card.name}</div>
            <h3 className="ability-panel__name">{abilityPrompt.card.ability!.name}</h3>
            <p className="ability-panel__text">{abilityPrompt.card.ability!.text}</p>
            <div className="ability-panel__actions">
              <button className="btn btn--ghost" onClick={() => setAbilityPrompt(null)}>
                Not yet
              </button>
              <button
                className="btn btn--primary"
                onClick={() => {
                  dispatch({ type: 'USE_ABILITY', iid: abilityPrompt.iid });
                  setAbilityPrompt(null);
                  setSelected(null);
                }}
              >
                Use {abilityPrompt.card.ability!.name}
              </button>
            </div>
          </div>
        </div>
      )}
      {awaitingSanction && (
        <SanctionGate
          card={awaitingSanction.card}
          onConfirm={confirmSanction}
          onCancel={() => setAwaitingSanction(null)}
        />
      )}
      {/* An astra is in the air and it is aimed at us. Nothing is spent until
          this is answered: the card, the scouring and the curse are all on the
          other side of this button. */}
      {state.phase === 'awaitingCounter' &&
        state.pendingCounter &&
        state.pendingCounter.firer === 'ai' && (
          <div className="overlay">
            <div className="panel sanction">
              <div className="sanction__who">An astra is in the air</div>
              <h2 className="sanction__name">
                {getCard(state.pendingCounter.astraCardId).name} is fired at your host
              </h2>
              <p className="sanction__warn">
                You hold the {getCard(state.pendingCounter.counterCardId).name}, which answers it.
                Spending it costs you that weapon for the whole campaign, and two great weapons
                meeting is not a clean cancellation: the blast scours <strong>both</strong> hosts,
                and whichever side fields the lesser astra-master is cursed for failing to withdraw
                in time.
              </p>
              {/* THE NUMBERS, ON SCREEN. The curse used to land on whichever
                  side fielded the lesser astra-master, which is a real rule
                  and was completely invisible: in playtesting a player was
                  cursed because Drona carries Brahmashirsha BY NAME and so
                  counted as fully trained, against Abhimanyu's 2. You cannot
                  make a decision about a number you cannot see. */}
              <div className="clash-odds">
                <div className={`clash-odds__side${myMastery > foeMastery ? ' clash-odds__side--safe' : myMastery < foeMastery ? ' clash-odds__side--risk' : ''}`}>
                  <div className="clash-odds__n">{myMastery}</div>
                  <div className="clash-odds__label">your astra-master</div>
                </div>
                <div className="clash-odds__vs">vs</div>
                <div className={`clash-odds__side${foeMastery > myMastery ? ' clash-odds__side--safe' : ''}`}>
                  <div className="clash-odds__n">{foeMastery}</div>
                  <div className="clash-odds__label">theirs</div>
                </div>
              </div>
              <p className="sanction__ask">
                {myMastery < foeMastery
                  ? 'The lesser master cannot withdraw in time. YOU would take the curse.'
                  : myMastery > foeMastery
                    ? 'Theirs is the lesser. THEY would take the curse.'
                    : 'Equally matched. Neither side is cursed.'}
              </p>
              <p className="sanction__ask">Answer it?</p>
              <div className="sanction__actions">
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => dispatch({ type: 'ANSWER_ASTRA', seat: 'player', counter: true })}
                >
                  Answer with the {getCard(state.pendingCounter.counterCardId).name}
                </button>
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => dispatch({ type: 'ANSWER_ASTRA', seat: 'player', counter: false })}
                >
                  Let it strike
                </button>
              </div>
            </div>
          </div>
        )}

      {inspect && (
        <InspectSheet
          card={inspect.card}
          inst={inspect.inst}
          onPlay={inspect.onPlay}
          onSwap={inspect.onSwap}
          blockedReason={inspect.blockedReason}
          onClose={() => setInspect(null)}
        />
      )}
      {state.phase === 'mulligan' && (
        <MulliganOverlay
          state={state}
          mSel={mSel}
          toggle={(iid) =>
            setMSel((cur) =>
              cur.includes(iid) ? cur.filter((x) => x !== iid) : cur.length < 2 ? [...cur, iid] : cur,
            )
          }
          confirm={() => {
            dispatch({ type: 'MULLIGAN', seat: 'player', iids: mSel });
            setMSel([]);
          }}
        />
      )}
      {state.phase === 'battleEnd' && (
        <ResultOverlay state={state} onExit={onExit} onFinish={onFinish} />
      )}
    </div>
  );
}

// ============================================================ sub-components

function Topbar({
  state,
  playerHouse,
  aiHouse,
  onExit,
  onHelp,
}: {
  state: GameState;
  playerHouse: House;
  aiHouse: House;
  onExit: () => void;
  onHelp: () => void;
}) {
  return (
    <div className="topbar">
      <SeatChip
        house={aiHouse}
        name={FACTION_NAME[aiHouse]}
        wins={state.roundWins.ai}
        hand={state.hands.ai.length}
        active={state.activeSeat === 'ai'}
        curses={state.curses?.ai}
      />
      <div className="round-pill">
        <div className="round-pill__n">Round {state.round}/3</div>
        <div className="round-pill__sub">{isFinalRound(state) ? 'Decider' : 'First to two'}</div>
      </div>
      <div className="topbar__right">
        <SeatChip
          house={playerHouse}
          name={FACTION_NAME[playerHouse]}
          wins={state.roundWins.player}
          hand={state.hands.player.length}
          active={state.activeSeat === 'player'}
          curses={state.curses?.player}
        />
        <button className="icon-btn" onClick={onHelp} title="How to play" aria-label="How to play">
          ?
        </button>
        <button className="icon-btn" onClick={onExit} title="Leave match" aria-label="Leave match">
          ✕
        </button>
      </div>
    </div>
  );
}

function SeatChip({
  house,
  name,
  wins,
  hand,
  active,
  curses = [],
}: {
  house: House;
  name: string;
  wins: number;
  hand: number;
  active: boolean;
  curses?: string[];
}) {
  return (
    <div className={'chip' + (active ? ' chip--active' : '')}>
      <span className="chip__dot" style={{ background: FACTION_DOT[house] }} />
      <span className="chip__name">{name}</span>
      <Gems n={wins} />
      <span className="chip__hand" title="cards in hand">
        <Fan size={15} />
        {hand}
      </span>
      {curses.map((id) => {
        const c = getCurse(id);
        return (
          <span key={id} className="curse-chip" title={c?.text ?? id}>
            <Rosette petals={6} size={11} className="glyph glyph--dim" /> {c?.name ?? id}
          </span>
        );
      })}
    </div>
  );
}

function Gems({ n }: { n: number }) {
  return (
    <span className="gems">
      {[0, 1].map((i) => (
        <span key={i} className={'gem' + (i < n ? ' gem--on' : '')} />
      ))}
    </span>
  );
}

function Tooltip({ card, inst, x, y }: { card: Card; inst?: GameState['instances'][string]; x: number; y: number }) {
  const rules = rulesText(card);
  const left = Math.min(x + 16, window.innerWidth - 250);
  const top = Math.min(y + 16, window.innerHeight - 180);
  return (
    <div className="tooltip" style={{ left, top }}>
      <div className="tooltip__name">{card.name}</div>
      <div className="tooltip__meta">
        {TYPE_LABEL[card.type]}
        {card.tier ? ` · ${TIER_LABEL[card.tier]}` : ''}
        {inst ? ` · Power ${inst.currentPower}` : card.basePower ? ` · Power ${card.basePower}` : ''}
        {` · Cost ${provisionOf(card)}`}
      </div>
      {rules.map((r, i) => (
        <div key={i} className="tooltip__rule">
          {r}
        </div>
      ))}
      {card.flavor && <div className="tooltip__flavor">{card.flavor}</div>}
    </div>
  );
}

function EventFeed({ state }: { state: GameState }) {
  // Gathered newest-first because that is the cheap way to take the last four,
  // then REVERSED for display so the column reads top to bottom in the order
  // things happened.
  //
  // It used to render newest at the top, and that read as a bug even to the
  // person who built the game: "the enemy played Duryodhana" sat under
  // "Duryodhana was slain", so a correct Bhima kill looked like a dead man
  // being played again. Nothing on screen said which way the list ran, and
  // top-to-bottom is what anyone assumes.
  const items: string[] = [];
  for (let i = state.log.length - 1; i >= 0 && items.length < 4; i--) {
    const txt = eventText(state, state.log[i]);
    if (txt) items.push(txt);
  }
  items.reverse();
  return (
    <div className="eventlog">
      {items.map((t, i) => (
        <div
          key={state.log.length - (items.length - 1 - i)}
          // Oldest faintest, newest full strength and wearing the brass rule.
          // Two wordless cues that the story runs downward, because the one
          // the feed had before (none) was not enough.
          className={'eventlog__item' + (i === items.length - 1 ? ' eventlog__item--now' : '')}
          style={{ opacity: 0.45 + (0.55 * (i + 1)) / items.length }}
        >
          {t}
        </div>
      ))}
    </div>
  );
}

function MulliganOverlay({
  state,
  mSel,
  toggle,
  confirm,
}: {
  state: GameState;
  mSel: InstanceId[];
  toggle: (iid: InstanceId) => void;
  confirm: () => void;
}) {
  return (
    <div className="overlay">
      <div className="panel">
        <h2>Your opening hand</h2>
        <p className="panel__sub">
          Swap up to two cards you do not want. Whatever you keep stays with you into the first round.
        </p>
        <div className="mulligan__hand">
          {state.hands.player.map((iid) => (
            <CardFrame
              key={iid}
              mini
              card={getCard(state.instances[iid]!.cardId)}
              instance={state.instances[iid]}
              selected={mSel.includes(iid)}
              onClick={() => toggle(iid)}
            />
          ))}
        </div>
        <button className="btn btn--primary" onClick={confirm}>
          {mSel.length ? `Redraw ${mSel.length}` : 'Keep hand'} & begin
        </button>
      </div>
    </div>
  );
}

function ResultOverlay({
  state,
  onExit,
  onFinish,
}: {
  state: GameState;
  onExit: () => void;
  onFinish?: (s: GameState) => void;
}) {
  const won = state.winner === 'player';
  const draw = state.winner === null;
  const cls = draw ? '' : won ? 'result--win' : 'result--lose';
  // In a run, the outcome flows back into the campaign rather than to the menu.
  const inRun = !!onFinish;
  return (
    <div className="overlay">
      <div className={'panel ' + cls}>
        <h2>{draw ? 'Stalemate' : won ? 'Victory' : 'Defeat'}</h2>
        <p className="panel__sub">
          {draw
            ? 'The field is soaked, and neither host yields.'
            : won
              ? 'Dharma holds the field. The conches sound for the Pandavas.'
              : 'The line is broken. Hastinapura’s banners advance.'}
          {' '}Rounds {state.roundWins.player}–{state.roundWins.ai}.
        </p>
        <div className="menu__actions" style={{ margin: '0 auto' }}>
          <button className="btn btn--primary" onClick={() => (inRun ? onFinish!(state) : onExit())}>
            {inRun ? (won ? 'March on' : 'The run ends') : 'Return to the field'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================ helpers

function planFor(card: Card, iid: InstanceId, moves: Action[]): Plan {
  const forCard = moves.filter((m) => m.type === 'PLAY_CARD' && m.iid === iid);
  const rows = [...new Set(forCard.map((m) => (m.type === 'PLAY_CARD' ? m.row : 'ratha')))] as Row[];
  const targets = [
    ...new Set(
      forCard
        .map((m) => (m.type === 'PLAY_CARD' ? m.targets?.[0] : undefined))
        .filter((t): t is InstanceId => !!t),
    ),
  ];

  if (card.type === 'boon') return { mode: 'target-own', candidates: targets };
  if (card.type === 'unit') return { mode: 'drop-own', rows: rows.length ? rows : card.rows };

  // astra / curse
  const hasChosen = card.effects.some((e) => e.target.pick === 'chosen');
  if (hasChosen) return { mode: 'target-enemy', candidates: targets };
  const usesPlayedRow = card.effects.some(
    (e) => e.target.pick === 'enemyRowSameAsPlayed' || e.target.pick === 'ownAdjacentToPlayed',
  );
  if (usesPlayedRow) return { mode: 'drop-enemy', rows: rows.length ? rows : card.rows };
  return { mode: 'cast', row: (rows[0] ?? card.rows[0]) as Row };
}

/** Units with an optional snipe (Bhima) auto-target a valid foe when played. */
function buildUnitPlay(state: GameState, iid: InstanceId, row: Row): Action {
  const card = getCard(state.instances[iid]!.cardId);
  const wantsFlag = card.effects.find((e) => e.condition?.q === 'targetHasFlag');
  if (wantsFlag && wantsFlag.condition?.q === 'targetHasFlag') {
    const flag = wantsFlag.condition.flag;
    for (const seat of ['ai', 'player'] as Seat[]) {
      for (const r of ROWS) {
        for (const uid of state.board[seat][r]) {
          if (state.instances[uid]?.flags.has(flag)) {
            return { type: 'PLAY_CARD', iid, row, targets: [uid] };
          }
        }
      }
    }
  }
  return { type: 'PLAY_CARD', iid, row };
}

/**
 * Shiva stands in the way. Before an ultimate astra is fired, the player is
 * told exactly what it costs and made to say yes. The drama of these weapons
 * comes from choosing the consequence, not from a dice roll springing it.
 */
function SanctionGate({
  card,
  onConfirm,
  onCancel,
}: {
  card: Card;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="overlay sanction" onClick={onCancel}>
      <div className="sanction__box" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className="sanction__eye" aria-hidden="true">
          <span className="sanction__trident">ॐ</span>
        </div>
        <div className="sanction__who">
          {(card.astraTier ?? 1) >= 3 ? 'Shiva stays your hand' : 'Know the price before you fire it'}
        </div>
        <h2 className="sanction__name">{card.name}</h2>
        <p className="sanction__warn">{card.cost?.consequence}</p>
        <p className="sanction__ask">Fire it anyway?</p>
        <div className="sanction__actions">
          <button className="btn btn--ghost" onClick={onCancel} autoFocus>
            Withdraw
          </button>
          <button className="btn btn--danger" onClick={onConfirm}>
            Fire the {card.name}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Warriors read as one block, boons/astras/fates as another. */
function handGroup(type: Card['type']): number {
  return type === 'unit' ? 0 : 1;
}
/** Sort the hand so warriors come first, then boons and astras, stable within. */
function sortedHand(iids: InstanceId[], state: GameState): InstanceId[] {
  return [...iids].sort((a, b) => {
    const ga = handGroup(getCard(state.instances[a]!.cardId).type);
    const gb = handGroup(getCard(state.instances[b]!.cardId).type);
    return ga - gb;
  });
}

/** Two round-win pips (best of three: first to two takes the battle). */
function RoundPips({ n, lead }: { n: number; lead: boolean }) {
  return (
    <span className="pips" title={`${n} of 2 rounds won`}>
      {[0, 1].map((i) => (
        <span key={i} className={'pip' + (i < n ? ' pip--won' : '')} />
      ))}
      {lead && <span className="pip-lead" title="ahead this round">▲</span>}
    </span>
  );
}

function hintText(state: GameState, myTurn: boolean, plan: Plan | null, card: Card | null): string {
  if (state.phase === 'battleEnd') return '';
  if (state.phase === 'mulligan') return '';
  if (!myTurn) return 'The enemy deliberates…';
  if (!plan) return 'Tap a card to see it, tap again to play it. Or pass, and keep the rest of your hand for the next round.';
  switch (plan.mode) {
    case 'drop-own':
      return `Choose a row to deploy ${card?.name}.`;
    case 'drop-enemy':
      return `Choose the enemy row to strike with ${card?.name}.`;
    case 'target-enemy':
      return plan.candidates.length ? `Choose a foe for ${card?.name}.` : `No valid target for ${card?.name}.`;
    case 'target-own':
      return plan.candidates.length ? `Choose an ally to receive ${card?.name}.` : `No valid ally for ${card?.name}.`;
    case 'cast':
      return `Invoke ${card?.name} when ready.`;
  }
}

/**
 * Why a card in hand cannot be played right now, in plain words.
 *
 * The question this exists to answer came from a real playtest: "I don't have
 * anyone above 8, so why is the Brahma-Astra in my deck?" The answer is that
 * POWER is not what gates an astra - training is - and nothing on screen said
 * so. An astra sat greyed out with no reason given, so the only available
 * explanation was that the deck was wrong.
 */
function whyNotPlayable(state: GameState, iid: InstanceId, myTurn: boolean): string | undefined {
  if (!myTurn) return 'Not your turn.';
  const card = getCard(state.instances[iid]!.cardId);
  if (state.bannedThisRun.includes(card.id)) {
    return 'Already spent. A great weapon fires once for the whole campaign.';
  }
  if (card.type === 'astra') {
    if (cursedAgainstAstras(state, 'player')) {
      return 'A curse has stopped your mouth. You can fire no astra this battle.';
    }
    if (!canInvokeAstra(state, 'player', card.id)) {
      const tier = card.astraTier ?? 1;
      const able = state.board.player.ratha
        .concat(state.board.player.gaja, state.board.player.padati)
        .map((i) => getCard(state.instances[i]!.cardId))
        .filter((c) => (c.astraMastery ?? 0) >= tier || (c.knownAstras ?? []).includes(card.id));
      if (able.length) return 'Nothing blocks it. Play a warrior first.';
      // Who in the WHOLE roster could, so the player knows what to field.
      const inDeck = state.decks.player
        .concat(state.hands.player)
        .map((i) => getCard(state.instances[i]!.cardId))
        .filter((c) => c.type === 'unit' && ((c.astraMastery ?? 0) >= tier || (c.knownAstras ?? []).includes(card.id)));
      const names = [...new Set(inDeck.map((c) => c.name))].slice(0, 3);
      return names.length
        ? `No one on the field is trained to fire this. Rank does not decide it: ${names.join(', ')} can.`
        : 'No warrior left in your host is trained to fire this.';
    }
  }
  return undefined;
}
