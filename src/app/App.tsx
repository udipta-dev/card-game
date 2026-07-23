import { useState } from 'react';
import type { DeckList } from '@content/decks';
import { MatchView } from '@ui/match/MatchView';
import { Codex } from './screens/Codex';
import { MainMenu } from './screens/MainMenu';
import { Setup } from './screens/Setup';

interface MatchConfig {
  seed: number;
  playerDeck: DeckList;
  aiDeck: DeckList;
}

function makeSeed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
}

export function App() {
  const [match, setMatch] = useState<MatchConfig | null>(null);
  const [showCodex, setShowCodex] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const startMatch = (playerDeck: DeckList, aiDeck: DeckList) => {
    setShowSetup(false);
    setShowCodex(false);
    setMatch({ seed: makeSeed(), playerDeck, aiDeck });
  };

  return (
    <div className="app">
      {match ? (
        <MatchView
          key={match.seed}
          seed={match.seed}
          playerDeck={match.playerDeck}
          aiDeck={match.aiDeck}
          onExit={() => setMatch(null)}
        />
      ) : showSetup ? (
        <Setup onStart={startMatch} onBack={() => setShowSetup(false)} />
      ) : showCodex ? (
        <Codex onBack={() => setShowCodex(false)} />
      ) : (
        <MainMenu onPlay={() => setShowSetup(true)} onCodex={() => setShowCodex(true)} />
      )}
    </div>
  );
}
