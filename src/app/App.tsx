import { useState } from 'react';
import type { DeckList } from '@content/decks';
import type { House } from '@engine/types';
import { MatchView } from '@ui/match/MatchView';
import { createRun } from '@run/run';
import { recordRunStart } from '@run/meta';
import type { RunState } from '@run/types';
import { Codex } from './screens/Codex';
import { MainMenu } from './screens/MainMenu';
import { RunView } from './screens/RunView';
import { Setup } from './screens/Setup';

interface MatchConfig {
  seed: number;
  playerDeck: DeckList;
  aiDeck: DeckList;
}

type Screen = 'menu' | 'quickSetup' | 'campaignSetup' | 'codex';

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
  const [run, setRun] = useState<RunState | null>(null);

  const startQuickplay = (playerDeck: DeckList, aiDeck: DeckList) => {
    setScreen('menu');
    setMatch({ seed: makeSeed(), playerDeck, aiDeck });
  };

  const startCampaign = (playerDeck: DeckList) => {
    recordRunStart();
    setScreen('menu');
    setRun(createRun(makeSeed(), playerDeck.house as House));
  };

  if (match) {
    return (
      <div className="app">
        <MatchView
          key={match.seed}
          seed={match.seed}
          playerDeck={match.playerDeck}
          aiDeck={match.aiDeck}
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
      {screen === 'quickSetup' ? (
        <Setup mode="quickplay" onStart={startQuickplay} onBack={() => setScreen('menu')} />
      ) : screen === 'campaignSetup' ? (
        <Setup mode="campaign" onStartHost={startCampaign} onBack={() => setScreen('menu')} />
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
