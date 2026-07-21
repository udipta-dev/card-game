import { useState } from 'react';
import { KAURAVA_DECK, PANDAVA_DECK } from '@content/decks';
import type { DeckList } from '@content/decks';
import { MatchView } from '@ui/match/MatchView';
import { MainMenu } from './screens/MainMenu';

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

  const startQuickplay = (side: 'pandava' | 'kaurava') => {
    const playerDeck = side === 'pandava' ? PANDAVA_DECK : KAURAVA_DECK;
    const aiDeck = side === 'pandava' ? KAURAVA_DECK : PANDAVA_DECK;
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
      ) : (
        <MainMenu onQuickplay={startQuickplay} />
      )}
    </div>
  );
}
