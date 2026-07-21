interface Props {
  onQuickplay: (side: 'pandava' | 'kaurava') => void;
}

export function MainMenu({ onQuickplay }: Props) {
  return (
    <div className="menu">
      <div className="menu__devanagari">कुरुक्षेत्र</div>
      <h1 className="menu__title">Kurukshetra</h1>
      <p className="menu__sub">
        A card battler of the Mahabharata. Marshal maharathis, loose divine astras, and turn the
        tide with curses and boons across three rounds of war. Raw power is never destiny — the
        right vow undoes the mightiest warrior.
      </p>
      <div className="menu__actions">
        <button className="btn btn--primary" onClick={() => onQuickplay('pandava')}>
          Lead the Pandavas
        </button>
        <button className="btn" onClick={() => onQuickplay('kaurava')}>
          Lead the Kauravas
        </button>
        <button className="btn btn--ghost" disabled>
          18-Day Campaign · coming soon
        </button>
      </div>
      <p className="menu__sub" style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>
        Quickplay vs the AI · best of three · first to two rounds
      </p>
    </div>
  );
}
