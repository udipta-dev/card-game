import { useEffect, useState } from 'react';
import type { DeckList } from '@content/decks';
import type { House } from '@engine/types';
import { MatchView } from '@ui/match/MatchView';
import { createRun } from '@run/run';
import { recordRunStart } from '@run/meta';
import { clearRun, loadRun, saveRun } from '@run/savedRun';
import type { RunState } from '@run/types';
import { Codex } from './screens/Codex';
import { MainMenu } from './screens/MainMenu';
import { RunView } from './screens/RunView';
import { Setup } from './screens/Setup';
import { Muster } from './screens/Muster';
import { loadMuster, saveMuster } from '@content/savedMuster';

/**
 * Quickplay is one battle with nothing carried in or out, so the weapon that
 * simply WINS one has no cost in it at all: no run to be marked for, no penance
 * to walk, no arsenal to empty. The Pashupata is therefore not in the arsenal
 * here. It stays a campaign weapon, which is also the only place its fifteen
 * battles of shrap can mean anything, and being unavailable is most of what
 * gives it an aura.
 *
 * `banned` is the same list a run uses for a spent weapon, so this needs no
 * special case anywhere in the engine.
 */
const QUICKPLAY_INIT = { banned: ['pashupatastra'] };

interface MatchConfig {
  seed: number;
  playerDeck: DeckList;
  aiDeck: DeckList;
}

type Screen = 'menu' | 'quickSetup' | 'campaignSetup' | 'codex' | 'muster';

function makeSeed(): number {
  // ?seed=17 replays an exact match. Every match is deterministic from its
  // seed, so this is how you reproduce a battle you want to look at again.
  const forced = new URLSearchParams(window.location.search).get('seed');
  if (forced && /^\d+$/.test(forced)) return Number(forced) >>> 0;
  return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
}

export function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [match, setMatch] = useState<MatchConfig | null>(null);
  // Resume whatever campaign was in progress. A run is long and a reload is
  // cheap to trigger by accident, so losing one to a refresh is not acceptable.
  const [run, setRun] = useState<RunState | null>(() => loadRun());
  /** Which house the muster screen is editing, and where to return to. */
  const [mustering, setMustering] = useState<{ house: House; back: Screen } | null>(null);

  // Persist on every change rather than at checkpoints, because the moments a
  // player actually loses a tab (sleep, crash, update) are not checkpoints.
  useEffect(() => {
    if (run) saveRun(run);
    else clearRun();
  }, [run]);

  const startQuickplay = (playerDeck: DeckList, aiDeck: DeckList) => {
    setScreen('menu');
    setMatch({ seed: makeSeed(), playerDeck, aiDeck });
  };

  const startCampaign = (playerDeck: DeckList) => {
    recordRunStart();
    setScreen('menu');
    // playerDeck is the host mustered on the setup screen. Passing only the
    // house threw that choice away and started every campaign on the starter list.
    setRun(createRun(makeSeed(), playerDeck.house as House, playerDeck.cards));
  };

  if (match) {
    return (
      <div className="app">
        <MatchView
          key={match.seed}
          seed={match.seed}
          playerDeck={match.playerDeck}
          aiDeck={match.aiDeck}
          init={QUICKPLAY_INIT}
          onExit={() => setMatch(null)}
        />
      </div>
    );
  }

  if (run) {
    return (
      <div className="app">
        <RunView run={run} onExit={() => setRun(null)} />
      </div>
    );
  }

  return (
    <div className="app">
      {mustering ? (
        <Muster
          house={mustering.house}
          initial={loadMuster(mustering.house)}
          onBack={() => {
            setScreen(mustering.back);
            setMustering(null);
          }}
          onConfirm={(ids) => {
            saveMuster(mustering.house, ids);
            setScreen(mustering.back);
            setMustering(null);
          }}
        />
      ) : screen === 'quickSetup' ? (
        <Setup
          mode="quickplay"
          onStart={startQuickplay}
          onMuster={(house) => setMustering({ house, back: 'quickSetup' })}
          onBack={() => setScreen('menu')}
        />
      ) : screen === 'campaignSetup' ? (
        <Setup
          mode="campaign"
          onStartHost={startCampaign}
          onMuster={(house) => setMustering({ house, back: 'campaignSetup' })}
          onBack={() => setScreen('menu')}
        />
      ) : screen === 'codex' ? (
        <Codex onBack={() => setScreen('menu')} />
      ) : (
        <MainMenu
          onPlay={() => setScreen('quickSetup')}
          onCampaign={() => setScreen('campaignSetup')}
          onCodex={() => setScreen('codex')}
        />
      )}
    </div>
  );
}
