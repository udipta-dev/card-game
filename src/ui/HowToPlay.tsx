// A scannable, in-game rules overlay. Reused from the main menu and from within
// a match (the "?" button). No em dashes in any copy, per house style.

interface Rule {
  icon: string;
  title: string;
  body: string;
}

const RULES: Rule[] = [
  {
    icon: '🎯',
    title: 'Win two of three rounds',
    body: 'Each round, whoever has more total power on the board wins it. First side to two round wins takes the war.',
  },
  {
    icon: '🃏',
    title: 'Take turns, one card each',
    body: 'You play a card, then the enemy plays one. Click a card in your hand, then click the glowing target: your own row for a warrior, an enemy row or enemy card for an astra.',
  },
  {
    icon: '✋',
    title: 'Pass to bank your cards',
    body: 'You do not get a fresh hand each round. You draw only two cards between rounds, so one hand must last all three. Pass to stop and save your cards. When both sides pass, the round ends.',
  },
  {
    icon: '🧠',
    title: 'Folding is the real skill',
    body: 'Sometimes you pass early on purpose, giving up a weak round to keep your best cards, then win the next two. A raw 10 played into a lost round is wasted.',
  },
  {
    icon: '⚔️',
    title: 'Power is not destiny',
    body: 'Astras destroy a foe or blast a whole row. Curses and boons bend the rules: Bhishma cannot be slain until Shikhandi appears, and Krishna turns aside a killing arrow.',
  },
  {
    icon: '🏇',
    title: 'The three rows',
    body: 'Ratha are chariots and heroes, Gaja are elephants, Padati are foot soldiers. Most warriors pick a row; some astras strike a whole row at once.',
  },
];

export function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="panel howto" onClick={(e) => e.stopPropagation()}>
        <button className="dialog-x" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2>How to play</h2>
        <p className="panel__sub">Kurukshetra is a duel of two armies. Outthink the enemy, do not just outmuscle them.</p>
        <div className="howto__grid">
          {RULES.map((r) => (
            <div key={r.title} className="howto__rule">
              <div className="howto__icon">{r.icon}</div>
              <div>
                <div className="howto__title">{r.title}</div>
                <div className="howto__body">{r.body}</div>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn--primary" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}
