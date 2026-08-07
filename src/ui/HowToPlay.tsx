// A scannable, in-game rules overlay. Reused from the main menu and from within
// a match (the "?" button). No em dashes in any copy, per house style.
//
// The six markers were emoji. Beside painted gouache cards that reads as a
// placeholder somebody forgot to replace, and a pile of mixed-provenance emoji
// is the fastest way to make a hand-made thing look generated. Each is now a
// drawn mark that means something: three lamps for best-of-three, the abhaya
// mudra ("do not fear") for passing, a vyuha spiral for the fold, a chariot
// wheel for the rows.
import { Abhaya, Alternating, Bow, Crown, Frieze, Lamps, Lines, Vyuha } from './ornament';

interface Rule {
  Icon: (p: { size?: number }) => JSX.Element;
  title: string;
  body: string;
}

const RULES: Rule[] = [
  {
    Icon: Lamps,
    title: 'Win two of three rounds',
    // The drawn-round rule was nowhere in the game, so a match that ended 2-2
    // looked like a bug rather than a rule.
    body: 'Each round, whoever has more total power on the board wins it. First side to two round wins takes the war. A round tied on power counts as a win for BOTH sides, so a level fight can end two-all: that is a stalemate, and nobody marches on.',
  },
  {
    Icon: Alternating,
    title: 'Take turns, one card each',
    body: 'You play a card, then the enemy plays one. Click a card in your hand, then click the glowing target: your own row for a warrior, an enemy row or enemy card for an astra.',
  },
  {
    Icon: Abhaya,
    title: 'Passing keeps your cards',
    body: 'You do not get a fresh hand each round. You draw two cards between rounds and may trade one back for a fresh draw, so one hand must last all three. Pass to stop and save your cards. When both sides pass, the round ends.',
  },
  {
    Icon: Vyuha,
    title: 'Folding is the real skill',
    body: 'Sometimes you pass early on purpose, giving up a weak round to keep your best cards, then win the next two. A raw 10 played into a lost round is wasted.',
  },
  {
    Icon: Bow,
    title: 'Power is not destiny',
    body: 'Astras destroy a foe or blast a whole row. Curses and boons bend the rules: Bhishma cannot be slain until Shikhandi appears, and Krishna turns aside a killing arrow.',
  },
  {
    Icon: Lines,
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
        <Crown />
        <h2>How to play</h2>
        <p className="panel__sub">Kurukshetra is a duel of two armies. Outthink the enemy, do not just outmuscle them.</p>
        <div className="howto__grid">
          {RULES.map((r) => (
            <div key={r.title} className="howto__rule">
              <div className="howto__icon rule-mark">
                <r.Icon size={22} />
              </div>
              <div>
                <div className="howto__title">{r.title}</div>
                <div className="howto__body">{r.body}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="howto__close">
          <Frieze className="frieze" />
          <button className="btn btn--primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
