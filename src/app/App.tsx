import { useState } from 'react';
import { ASURA_DECK, KAURAVA_DECK, PANDAVA_DECK } from '@content/decks';
import type { DeckList } from '@content/decks';
import type { House } from '@engine/types';
import { MatchView } from '@ui/match/MatchView';
import { Codex } from './screens/Codex';
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
  const [showCodex, setShowCodex] = useState(false);

  const startQuickplay = (side: House) => {
    const byHouse: Partial<Record<House, DeckList>> = {
      pandava: PANDAVA_DECK,
      kaurava: KAURAVA_DECK,
      asura: ASURA_DECK,
    };
    const others = (['pandava', 'kaurava', 'asura'] as House[]).filter((h) => h !== side);
    const aiHouse = others[Math.floor(Math.random() * others.length)];
    setShowCodex(false);
    setMatch({ seed: makeSeed(), playerDeck: byHouse[side]!, aiDeck: byHouse[aiHouse]! });
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
      ) : showCodex ? (
        <Codex onBack={() => setShowCodex(false)} />
      ) : (
        <MainMenu onQuickplay={startQuickplay} onCodex={() => setShowCodex(true)} />
      )}
    </div>
  );
}
