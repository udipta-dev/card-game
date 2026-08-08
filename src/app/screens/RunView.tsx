import { useEffect, useMemo, useRef, useState } from 'react';
import { getCard } from '@content/cards';
import type { GameState } from '@engine/types';
import { getCurse } from '@engine/curses';
import { battlesLeftText } from '@run/dharma';
import { deityArt } from '@ui/card/deityArt';
import { MatchView } from '@ui/match/MatchView';
import { FACTION_NAME } from '@ui/card/cardTheme';
import { chooseReward, chooseShrineOffer, currentEncounter, fieldedRoster, marchingCards, planBattle, resolveBattle } from '@run/run';
import { MUSTER_MAX } from '@content/muster';
import { Muster } from './Muster';
import { getDeity, worthOf } from '@run/shrine';
import type { PenanceOffer, ShrineOffer, VardaanOffer } from '@run/shrine';
import type { RewardOption, RunState } from '@run/types';
import { recordRunEnd } from '@run/meta';
import { Ambient } from '@ui/Ambient';
import { Bindu, Rosette } from '@ui/ornament';

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
  const [mustering, setMustering] = useState(false);
  const recorded = useRef(false);

  const plan = useMemo(() => (inBattle ? planBattle(run) : null), [inBattle, run]);

  // Record the outcome to cross-run progress exactly once when the run ends.
  //
  // IN AN EFFECT, AND GUARDED BY A REF. This was a bare `if` in the render body
  // writing to localStorage, guarded by a useState flag set in the same pass.
  // React.StrictMode renders every component twice in development, and both
  // passes see the old `false`, so every finished run was filed twice: lifetime
  // wins and best depth were quietly doubled. A write to the outside world is a
  // side effect and belongs in an effect; a ref updates immediately, so the
  // second pass sees the guard already closed.
  useEffect(() => {
    if (run.phase !== 'won' && run.phase !== 'lost') return;
    if (recorded.current) return;
    recorded.current = true;
    recordRunEnd(run.phase === 'won', run.depth);
  }, [run.phase, run.depth]);

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
  if (mustering) {
    return (
      <Muster
        house={run.house}
        // The run's own roster, not the whole house: you fight with what you
        // have earned, and only with warriors who are not spent or at penance.
        pool={fieldedRoster(run)}
        initial={marchingCards(run)}
        title="Choose who marches"
        onBack={() => setMustering(false)}
        onConfirm={(ids) => {
          setRun((r) => ({ ...r, marching: ids }));
          setMustering(false);
        }}
      />
    );
  }
  return (
    <MapScreen
      run={run}
      onBattle={() => setInBattle(true)}
      onMuster={() => setMustering(true)}
      onExit={onExit}
    />
  );
}

// ---------------------------------------------------------------- Map screen
function MapScreen({
  run,
  onBattle,
  onExit,
  onMuster,
}: {
  run: RunState;
  onBattle: () => void;
  onExit: () => void;
  onMuster: () => void;
}) {
  const enc = currentEncounter(run);
  const roster = fieldedRoster(run);
  const marching = marchingCards(run);
  // Only worth offering once there is a real decision: below the cap, every
  // card marches anyway and a "choose your host" button is a button that
  // changes nothing.
  const canChoose = roster.length > MUSTER_MAX;
  return (
    <div className="run">
      <Ambient scene="map-road" opacity={0.34} />
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
              {p.astra ? (
                <>
                  <strong>{getCard(p.warrior).name}</strong> returns from {getDeity(p.deityId)?.name},
                  bearing the <strong>{getCard(p.astra).name}</strong>.
                </>
              ) : (
                <>
                  <strong>{getCard(p.warrior).name}</strong> returns from {getDeity(p.deityId)?.name}{' '}
                  empty-handed. The god was not satisfied.
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {run.away.length > 0 && (
        <div className="run__away">
          {run.away.map((p) => (
            <span key={p.warrior} className="away-chip" title={`Returns before rung ${p.returnsAt + 1}`}>
              <Bindu size={13} className="glyph glyph--dim" /> {getCard(p.warrior).name} at penance
            </span>
          ))}
          <span className="run__curses-note">absent until the tapasya is complete</span>
        </div>
      )}

      {/* WHAT YOU ARE CARRYING, AND FOR HOW LONG. A curse used to be a name
          with no stated end, so the one thing a player needs in order to decide
          whether to fire another great weapon (how long am I already marked?)
          was the one thing nowhere on screen. Long marks are counted in battles
          and count down; a shrine's bound shrap still lasts a single battle. */}
      {(run.pendingCurses.length > 0 || Object.keys(run.curseClock ?? {}).length > 0) && (
        <div className="run__curses">
          {Object.entries(run.curseClock ?? {}).map(([id, left]) => {
            const c = getCurse(id);
            return (
              <span
                key={id}
                className="curse-chip curse-chip--long"
                title={`${c?.text ?? id} Lifts after ${battlesLeftText(left)}.`}
              >
                <Rosette petals={6} size={11} className="glyph glyph--dim" /> {c?.name ?? id}
                <b className="curse-chip__left">{left}</b>
              </span>
            );
          })}
          {run.pendingCurses.map((id) => {
            const c = getCurse(id);
            return (
              <span key={id} className="curse-chip" title={c?.text ?? id}>
                <Rosette petals={6} size={11} className="glyph glyph--dim" /> {c?.name ?? id}
              </span>
            );
          })}
          <span className="run__curses-note">
            {Object.keys(run.curseClock ?? {}).length
              ? 'the number is how many more battles it holds'
              : 'carries into the next battle'}
          </span>
        </div>
      )}

      <div className="run__next">
        <div className="run__next-label">Next</div>
        <div className="run__next-name">{enc.name}</div>
        <div className="run__next-sub">
          {FACTION_NAME[enc.house]} · {enc.deckCards.length} cards · your host:{' '}
          {canChoose ? `${marching.length} of ${roster.length}` : roster.length}
        </div>
        {canChoose && (
          <button className="btn btn--ghost btn--sm run__muster" onClick={onMuster}>
            {run.marching?.length ? 'Change who marches' : 'Choose who marches'}
          </button>
        )}
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
      <p className="reward__lede">Take one to your army before you march on.</p>
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
      <Ambient scene="shrine" opacity={0.4} />
      <header className="run__top run__top--center">
        <div className="shrine__om" aria-hidden="true">ॐ</div>
        <div className="run__title">A shrine on the road</div>
      </header>
      {/* WHAT THIS PAGE IS FOR, before the poetry. "The gods ask what you are
          willing to pay" is atmosphere and told the player nothing about what
          the screen actually does, which was the complaint: "shrine on the road
          is confusing, what does this page do?" There are exactly two kinds of
          offer here and they work completely differently, so both are named. */}
      <p className="reward__lede">
        Two kinds of bargain, and you may refuse both. A <b>vardaan</b> is a gift you take
        now, sometimes at a price paid immediately. A <b>tapasya</b> sends one of your
        warriors away to a god: he cannot fight for the battles named on the card, and
        he comes back bearing a divine weapon, or bearing nothing.
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

const pct = (n: number) => `${Math.round(n * 100)}%`;

/**
 * A wager, not an errand. The player sees exactly what standing and length buy
 * them before committing, so choosing a longer penance or a worthier warrior is
 * a real decision rather than a hidden roll.
 */
function PenanceCard({
  offer,
  onChoose,
}: {
  offer: PenanceOffer;
  onChoose: (o: ShrineOffer) => void;
}) {
  const deity = getDeity(offer.deityId);
  const art = deityArt(offer.deityId);
  const warrior = getCard(offer.warrior);
  const o = offer.odds;
  const bands: { label: string; share: number; cls: string }[] = [
    { label: 'An ultimate', share: o.t3, cls: 'odds--t3' },
    { label: 'A great weapon', share: o.t2, cls: 'odds--t2' },
    { label: 'An elemental', share: o.t1, cls: 'odds--t1' },
    { label: 'Nothing', share: o.fail, cls: 'odds--fail' },
  ].filter((b) => b.share > 0.004);

  return (
    <button className="shrine__card shrine__card--penance" onClick={() => onChoose(offer)}>
      {/* EVERY SANSKRIT WORD GLOSSED WHERE IT APPEARS. "Tapasya · 3 battles"
          told a player who does not already know the word precisely nothing,
          and this is the screen where they meet it. */}
      <div className="shrine__kind">
        Tapasya <span className="shrine__gloss">(penance)</span> ·{' '}
        {offer.battles} {offer.battles === 1 ? 'battle' : 'battles'}
      </div>
      {/* The god you would be sending a man to. This is one of exactly two
          places a deity is ever seen, and until now it was a name and nothing
          else: you were asked to give up a warrior for several battles by a
          line of text. */}
      <div className="shrine__deity">
        {art && <img className="shrine__deity-img" src={art} alt="" loading="lazy" />}
        <div className="shrine__name">{deity?.name}</div>
      </div>
      {/* "standing 14" was a number with no unit and no meaning. It is the
          card's provision cost, which is the game's own measure of how great a
          man is, so it says that instead of naming an internal scale. */}
      <div className="shrine__text">
        Send <strong>{warrior.name}</strong> to {deity?.epithet}, and sit in penance.
        <span className="shrine__worth">
          A warrior worth {worthOf(offer.warrior)} provisions. The greater the man and the
          longer he sits, the higher the weapon he may return with.
        </span>
      </div>

      <div className="odds">
        <div className="odds__bar">
          {bands.map((b) => (
            <span key={b.label} className={`odds__seg ${b.cls}`} style={{ flexGrow: b.share }} />
          ))}
        </div>
        <ul className="odds__list">
          {bands.map((b) => (
            <li key={b.label} className={b.cls}>
              <span className="odds__dot" />
              {b.label}
              <span className="odds__pct">{pct(b.share)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="shrine__foot">
        <span className="shrine__price">
          He fights in none of the next {offer.battles}{' '}
          {offer.battles === 1 ? 'battle' : 'battles'}, and he may return with nothing.
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------- End screen
function RunEndScreen({ run, onExit }: { run: RunState; onExit: () => void }) {
  const won = run.phase === 'won';
  const drew = run.endedBy === 'stalemate';
  // "after N victories" read as "after 0 victories" on a first-battle loss, and
  // called a stalemate a broken host. Both now say what actually happened.
  const record =
    run.depth === 0 ? 'at the first rung' : `after ${run.depth} ${run.depth === 1 ? 'victory' : 'victories'}`;
  return (
    <div className="run run--end">
      <div className={'panel ' + (won ? 'result--win' : drew ? '' : 'result--lose')}>
        <h2>{won ? 'The war is won' : drew ? 'Neither army yields' : 'The run ends'}</h2>
        <p className="panel__sub">
          {won
            ? 'You carried your army through every rung of the ladder. Dharma prevails.'
            : drew
              ? `The field was level ${record}, and a drawn battle carries no one forward. The next run begins anew.`
              : `Your army is broken ${record}. The next run begins anew, a little wiser.`}
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
