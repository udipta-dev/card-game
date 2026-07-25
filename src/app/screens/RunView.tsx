import { useMemo, useState } from 'react';
import { getCard } from '@content/cards';
import type { GameState } from '@engine/types';
import { getCurse } from '@engine/curses';
import { MatchView } from '@ui/match/MatchView';
import { FACTION_NAME } from '@ui/card/cardTheme';
import { chooseReward, chooseShrineOffer, currentEncounter, fieldedRoster, planBattle, resolveBattle } from '@run/run';
import { getDeity } from '@run/shrine';
import type { PenanceOffer, ShrineOffer, VardaanOffer } from '@run/shrine';
import type { RewardOption, RunState } from '@run/types';
import { recordRunEnd } from '@run/meta';

interface Props {
  run: RunState;
  onExit: () => void;
}

/**
 * Drives one run: the map between battles, the battle itself, the reward after
 * a win, and the end screens. The run reducer is the source of truth; this is
 * the thin shell that renders each phase and dispatches the pure transitions.
 */
export function RunView({ run: initial, onExit }: Props) {
  const [run, setRun] = useState<RunState>(initial);
  const [inBattle, setInBattle] = useState(false);
  const [recorded, setRecorded] = useState(false);

  const plan = useMemo(() => (inBattle ? planBattle(run) : null), [inBattle, run]);

  // Record the outcome to cross-run progress exactly once when the run ends.
  if ((run.phase === 'won' || run.phase === 'lost') && !recorded) {
    recordRunEnd(run.phase === 'won', run.depth);
    setRecorded(true);
  }

  if (inBattle && plan) {
    return (
      <MatchView
        key={`${run.index}-${plan.seed}`}
        seed={plan.seed}
        playerDeck={plan.playerDeck}
        aiDeck={plan.aiDeck}
        init={plan.init}
        onExit={onExit}
        onFinish={(finalState: GameState) => {
          setInBattle(false);
          setRun((r) => resolveBattle(r, finalState));
        }}
      />
    );
  }

  if (run.phase === 'reward') {
    return <RewardScreen run={run} onChoose={(opt) => setRun((r) => chooseReward(r, opt))} />;
  }
  if (run.phase === 'shrine') {
    return <ShrineScreen run={run} onChoose={(o) => setRun((r) => chooseShrineOffer(r, o))} />;
  }
  if (run.phase === 'won' || run.phase === 'lost') {
    return <RunEndScreen run={run} onExit={onExit} />;
  }
  return <MapScreen run={run} onBattle={() => setInBattle(true)} onExit={onExit} />;
}

// ---------------------------------------------------------------- Map screen
function MapScreen({
  run,
  onBattle,
  onExit,
}: {
  run: RunState;
  onBattle: () => void;
  onExit: () => void;
}) {
  const enc = currentEncounter(run);
  const roster = fieldedRoster(run);
  return (
    <div className="run">
      <header className="run__top">
        <button className="btn btn--ghost btn--sm" onClick={onExit}>
          ‹ Abandon
        </button>
        <div className="run__title">The Campaign</div>
        <div className="run__depth">Won {run.depth}</div>
      </header>

      <ol className="run__ladder">
        {run.ladder.map((e, i) => {
          const state = i < run.index ? 'done' : i === run.index ? 'now' : 'ahead';
          return (
            <li key={e.id} className={`rung rung--${state}`}>
              <span className="rung__dot" />
              <span className="rung__name">
                {e.name}
                {e.boss && <span className="rung__boss">boss</span>}
              </span>
              <span className="rung__foe">{FACTION_NAME[e.house]}</span>
            </li>
          );
        })}
      </ol>

      {run.returned && run.returned.length > 0 && (
        <div className="run__returned">
          {run.returned.map((p) => (
            <div key={p.warrior} className="run__returned-line">
              <strong>{getCard(p.warrior).name}</strong> returns from {getDeity(p.deityId)?.name},
              bearing the <strong>{getCard(p.astra).name}</strong>.
            </div>
          ))}
        </div>
      )}

      {run.away.length > 0 && (
        <div className="run__away">
          {run.away.map((p) => (
            <span key={p.warrior} className="away-chip" title={`Returns before rung ${p.returnsAt + 1}`}>
              🕉 {getCard(p.warrior).name} at penance
            </span>
          ))}
          <span className="run__curses-note">absent until the tapasya is complete</span>
        </div>
      )}

      {run.pendingCurses.length > 0 && (
        <div className="run__curses">
          {run.pendingCurses.map((id) => {
            const c = getCurse(id);
            return (
              <span key={id} className="curse-chip" title={c?.text ?? id}>
                ✦ {c?.name ?? id}
              </span>
            );
          })}
          <span className="run__curses-note">carries into the next battle</span>
        </div>
      )}

      <div className="run__next">
        <div className="run__next-label">Next</div>
        <div className="run__next-name">{enc.name}</div>
        <div className="run__next-sub">
          {FACTION_NAME[enc.house]} · {enc.deckCards.length} cards · your host: {roster.length}
        </div>
        <button className="btn btn--primary run__march" onClick={onBattle}>
          March to battle
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------------- Reward screen
function RewardScreen({
  run,
  onChoose,
}: {
  run: RunState;
  onChoose: (opt: RewardOption) => void;
}) {
  const choices = run.rewardChoices ?? [];
  return (
    <div className="run reward">
      <header className="run__top run__top--center">
        <div className="run__title">The field is yours</div>
        <div className="run__depth">Battle {run.depth} won</div>
      </header>
      <p className="reward__lede">Take one to your host before you march on.</p>
      <div className="reward__grid">
        {choices.map((opt, i) => (
          <button key={i} className={`reward__card reward__card--${opt.kind}`} onClick={() => onChoose(opt)}>
            <div className="reward__kind">{opt.kind === 'cleanse' ? 'Absolution' : 'Recruit'}</div>
            <div className="reward__name">{opt.label}</div>
            {opt.cardId && (
              <div className="reward__power">Power {getCard(opt.cardId).basePower}</div>
            )}
            <div className="reward__text">{opt.text}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------- Shrine screen
/**
 * The gods between battles. Both doors are the same bargain in different
 * clothes: take a gift now and pay its bound price, or invest a warrior in
 * tapasya and go without him until he returns bearing a divine weapon.
 */
function ShrineScreen({
  run,
  onChoose,
}: {
  run: RunState;
  onChoose: (offer: ShrineOffer | null) => void;
}) {
  const offers = run.shrineOffers ?? [];
  return (
    <div className="run shrine">
      <header className="run__top run__top--center">
        <div className="shrine__om" aria-hidden="true">ॐ</div>
        <div className="run__title">A shrine on the road</div>
      </header>
      <p className="reward__lede">
        The gods ask what you are willing to pay. Nothing here is given freely.
      </p>

      <div className="shrine__grid">
        {offers.map((offer) =>
          offer.kind === 'vardaan' ? (
            <VardaanCard key={offer.id} offer={offer} onChoose={onChoose} />
          ) : (
            <PenanceCard key={offer.id} offer={offer} onChoose={onChoose} />
          ),
        )}
      </div>

      <button className="btn btn--ghost shrine__walk" onClick={() => onChoose(null)}>
        Walk on, and ask nothing
      </button>
    </div>
  );
}

function VardaanCard({
  offer,
  onChoose,
}: {
  offer: VardaanOffer;
  onChoose: (o: ShrineOffer) => void;
}) {
  const card = getCard(offer.cardId);
  return (
    <button className="shrine__card shrine__card--vardaan" onClick={() => onChoose(offer)}>
      <div className="shrine__kind">Vardaan · a gift</div>
      <div className="shrine__name">{card.name}</div>
      <div className="shrine__text">{card.cost?.consequence ?? card.flavor}</div>
      <div className="shrine__foot">
        {offer.shrap ? (
          <span className="shrine__price">Shrap: {offer.shrap.text}</span>
        ) : (
          <span className="shrine__free">Freely given</span>
        )}
      </div>
    </button>
  );
}

function PenanceCard({
  offer,
  onChoose,
}: {
  offer: PenanceOffer;
  onChoose: (o: ShrineOffer) => void;
}) {
  const deity = getDeity(offer.deityId);
  const warrior = getCard(offer.warrior);
  const astra = getCard(offer.astra);
  return (
    <button className="shrine__card shrine__card--penance" onClick={() => onChoose(offer)}>
      <div className="shrine__kind">Tapasya · penance</div>
      <div className="shrine__name">{deity?.name}</div>
      <div className="shrine__text">
        Send <strong>{warrior.name}</strong> to {deity?.epithet}. He leaves your host for{' '}
        {offer.battles} {offer.battles === 1 ? 'battle' : 'battles'} and returns bearing the{' '}
        <strong>{astra.name}</strong>.
      </div>
      <div className="shrine__foot">
        <span className="shrine__price">
          You fight {offer.battles} {offer.battles === 1 ? 'battle' : 'battles'} without him.
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------- End screen
function RunEndScreen({ run, onExit }: { run: RunState; onExit: () => void }) {
  const won = run.phase === 'won';
  return (
    <div className="run run--end">
      <div className={'panel ' + (won ? 'result--win' : 'result--lose')}>
        <h2>{won ? 'The war is won' : 'The run ends'}</h2>
        <p className="panel__sub">
          {won
            ? 'You carried your host through every rung of the ladder. Dharma prevails.'
            : `Your host is broken after ${run.depth} ${run.depth === 1 ? 'victory' : 'victories'}. The next run begins anew, a little wiser.`}
        </p>
        <div className="menu__actions" style={{ margin: '0 auto' }}>
          <button className="btn btn--primary" onClick={onExit}>
            Return to the field
          </button>
        </div>
      </div>
    </div>
  );
}
