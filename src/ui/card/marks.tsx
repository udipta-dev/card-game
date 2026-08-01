// Marks: the drawn stand-in for card art.
//
// Every card used to show an emoji. Emoji are somebody else's illustrations,
// rendered in somebody else's colour, at a weight nothing else on the card
// shares, and beside painted gouache they read as a placeholder left in by
// accident. These are line marks on a 32x32 grid, stroked in currentColor at a
// single weight, so a wall of cards reads as one drawn set.
//
// The vocabulary is attributes rather than portraits: a weapon, an emblem, a
// yantra. That is how this tradition identifies a figure anyway, and it also
// avoids 40 hand-drawn animal heads, which is a good way to make 40 bad icons.
//
// These are placeholders. Any card that gets a real painting in
// src/assets/art/cards/ stops using its mark entirely, so the set can stay
// coarse: it exists to look deliberate while the art is being made.

export interface MarkProps {
  size?: number;
  className?: string;
}

function M({ size = 32, className, children }: MarkProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

type Mark = (p: MarkProps) => JSX.Element;

/* ------------------------------------------------------------------ weapons */

/** The bow, nocked. Gandiva, and every archer after it. */
const Dhanus: Mark = (p) => (
  <M {...p}>
    <path d="M10 4q13 12 0 24" />
    <path d="M10 4v24" />
    <path d="M8 16h17" />
    <path d="m25 16-4.4-2.8M25 16l-4.4 2.8" />
  </M>
);

/** The mace. Weight on a short haft: Bhima's argument. */
const Gada: Mark = (p) => (
  <M {...p}>
    <circle cx="16" cy="10" r="7.8" fill="currentColor" stroke="none" />
    <path d="M11.2 17.8h9.6" strokeWidth="2" />
    <path d="M16 19.2v9.2" strokeWidth="1.8" />
    <path d="M12.8 28.4h6.4" />
  </M>
);

/** The straight blade, with a disc pommel. */
const Khadga: Mark = (p) => (
  <M {...p}>
    <path d="M16 3.2 19.2 9v11.6h-6.4V9z" />
    <path d="M9.6 20.6h12.8" />
    <path d="M16 20.6v5" />
    <circle cx="16" cy="27.4" r="2.2" />
  </M>
);

/** The axe of Parashurama, and of his pupils. */
const Parashu: Mark = (p) => (
  <M {...p}>
    <path d="M14 4v25" />
    <path d="M14 5.5q9-1.5 11 6.5-6 4-11 2.5z" />
  </M>
);

/** The trident. Shiva's, and so his weapons'. */
const Trishula: Mark = (p) => (
  <M {...p}>
    <path d="M16 30V11" />
    <path d="M7 20V9.5M25 20V9.5" />
    <path d="M7 20q0-8 9-8t9 8" />
    <path d="m16 11-2.4-3.6L16 3l2.4 4.4z" />
    <path d="M11.5 21.5h9" />
  </M>
);

/** The vajra: the adamantine bolt, prongs at both ends. */
const Vajra: Mark = (p) => (
  <M {...p}>
    <path d="M13.4 13.4h5.2v5.2h-5.2z" fill="currentColor" stroke="none" />
    <path d="M10.6 13.4h10.8M10.6 18.6h10.8" />
    <path d="M16 13.4V2M8.4 13.4Q6.6 5.4 16 2M23.6 13.4Q25.4 5.4 16 2" />
    <path d="M16 18.6V30M8.4 18.6Q6.6 26.6 16 30M23.6 18.6Q25.4 26.6 16 30" />
  </M>
);

/** The elephant goad. Stands for the elephant line. */
const Ankusha: Mark = (p) => (
  <M {...p}>
    <path d="M16 30V11" />
    <path d="M16 11q0-6 5-6t5 5" />
    <path d="m16 11-4.6 4.4" />
    <path d="M13 30h6" />
  </M>
);

/** The hammer. Blunt, and unsubtle about it. */
const Mudgara: Mark = (p) => (
  <M {...p}>
    <path d="M9 3.6h17v9H9z" fill="currentColor" stroke="none" />
    <path d="M13.6 3.6v9M21.4 3.6v9" stroke="var(--pal-base, #000)" strokeWidth="1.5" />
    <path d="M17.4 12.6 8 29.4" />
    <path d="m5.6 27.4 4.8 2.8" />
  </M>
);

/* ------------------------------------------------------------------ emblems */

/** The tiered crown of a king. */
const Mukuta: Mark = (p) => (
  <M {...p}>
    <path d="M7.5 27.5h17v-3.4h-17z" />
    <path d="M10 24.1q0-11 6-15.4 6 4.4 6 15.4" />
    <path d="M13 18.6h6" />
    <circle cx="16" cy="5.4" r="1.9" fill="currentColor" stroke="none" />
  </M>
);

/** The lotus, open. Purity standing clear of the water it grew in. */
const Padma: Mark = (p) => (
  <M {...p}>
    <path d="M16 26q-9 0-11-8 5-1 8 1.6" />
    <path d="M16 26q9 0 11-8-5-1-8 1.6" />
    <path d="M16 26q-5-4-4-11 4 1 5.4 4M16 26q5-4 4-11-4 1-5.4 4" />
    <path d="M16 26q-2-8 0-13.4 2 5.4 0 13.4z" />
  </M>
);

/** The sun disc. Surya, and everything he fathered. */
const Surya: Mark = (p) => (
  <M {...p}>
    <circle cx="16" cy="16" r="6.4" />
    {Array.from({ length: 12 }, (_, i) => {
      const a = (i * Math.PI) / 6;
      return (
        <line
          key={i}
          x1={16 + Math.cos(a) * 9}
          y1={16 + Math.sin(a) * 9}
          x2={16 + Math.cos(a) * 12.6}
          y2={16 + Math.sin(a) * 12.6}
        />
      );
    })}
  </M>
);

/** The crescent. Night, and the houses that move by it. */
const Chandra: Mark = (p) => (
  <M {...p}>
    <path d="M22.4 5.4a12 12 0 1 0 4.6 16.8A13 13 0 0 1 22.4 5.4z" />
  </M>
);

/** A star. */
const Tara: Mark = (p) => (
  <M {...p}>
    <path d="M16 3.5 19 12l8.5 3-8.5 3-3 8.5-3-8.5L4.5 15l8.5-3z" />
  </M>
);

/** The conch. Blown to open a war, and to end one. */
const Shankha: Mark = (p) => (
  <M {...p}>
    <path
      d="M22.6 4.4q3.6 4.4 3.6 11 0 10-9.6 12.6Q6 26.4 6 18.6q0-6.4 6.4-6.4 5 0 5 4.2 0 3-3.2 3.4"
      fill="currentColor"
      fillOpacity=".85"
      stroke="none"
    />
    <path d="M22.6 4.4q3.6 4.4 3.6 11 0 10-9.6 12.6Q6 26.4 6 18.6q0-6.4 6.4-6.4 5 0 5 4.2 0 3-3.2 3.4" />
    <path d="m22.6 4.4 5.8-2.6-1 6.4" />
  </M>
);

/** The wheel. Dharma, and the chariot both. */
const ChakraMark: Mark = (p) => (
  <M {...p}>
    <circle cx="16" cy="16" r="12.2" />
    <circle cx="16" cy="16" r="4" />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return (
        <line
          key={i}
          x1={16 + Math.cos(a) * 4}
          y1={16 + Math.sin(a) * 4}
          x2={16 + Math.cos(a) * 12.2}
          y2={16 + Math.sin(a) * 12.2}
        />
      );
    })}
  </M>
);

/** The syllable, drawn as a yantra rather than as type. */
const Bindu: Mark = (p) => (
  <M {...p}>
    <circle cx="16" cy="16" r="12" />
    <path d="M16 4.4 26.4 22.4H5.6z" />
    <path d="M16 27.6 5.6 9.6h20.8" opacity=".45" />
    <circle cx="16" cy="17.6" r="1.8" fill="currentColor" stroke="none" />
  </M>
);

/** The scales. Judgement, and those who tried to hold to it. */
const Tula: Mark = (p) => (
  <M {...p}>
    <path d="M16 5v22M11 27.6h10" />
    <path d="M5 10h22" />
    <path d="M5 10 1.6 17.4h6.8zM27 10l-3.4 7.4h6.8z" />
  </M>
);

/* --------------------------------------------------------------- creatures */

/** The coiled serpent. The naga line, and the arrow that was one. */
const Naga: Mark = (p) => (
  <M {...p}>
    <path
      d="M16 2.4q9 0 9 7.8 0 6.2-9 10.4-9-4.2-9-10.4 0-7.8 9-7.8z"
      fill="currentColor"
      stroke="none"
    />
    <circle cx="13.2" cy="9.4" r="1.2" fill="var(--pal-base, #000)" stroke="none" />
    <circle cx="18.8" cy="9.4" r="1.2" fill="var(--pal-base, #000)" stroke="none" />
    <path d="M16 20.6C9 23 7.6 30 14 30h12" strokeWidth="1.9" />
  </M>
);

/** A rakshasa mask: horns, tusks, and no interest in your rules. */
const Rakshasa: Mark = (p) => (
  <M {...p}>
    <path d="M6.6 9.4Q1.4 6.6 1.6 1.2q6 1 9 6.6M25.4 9.4q5.2-2.8 5-8.2-6 1-9 6.6" />
    <path
      d="M3.6 13.4q0-8 12.4-8t12.4 8q0 13.6-12.4 13.6T3.6 13.4z"
      fill="currentColor"
      stroke="none"
    />
    <g fill="var(--pal-base, #000)" stroke="none">
      <path d="m9.2 12.6 5.6 2.6-5.6 2z" />
      <path d="m22.8 12.6-5.6 2.6 5.6 2z" />
      <path d="M9.6 20h12.8l-1.8 2.4-1.8-1.4-1.6 2-1.6-2-1.8 1.4z" />
    </g>
  </M>
);

/** Horns. The buffalo, and what wore its head. */
const Shringa: Mark = (p) => (
  <M {...p}>
    <path d="M16 27q-7 0-7-7 0-5 7-5t7 5q0 7-7 7z" />
    <path d="M9.6 17.6Q3 17 2.6 9.6 8 10.4 10.4 15M22.4 17.6Q29 17 29.4 9.6 24 10.4 21.6 15" />
  </M>
);

/** Wings. Garuda, and the astra named for him. */
const Paksha: Mark = (p) => (
  <M {...p}>
    <path d="M16 10v18" />
    <path d="M16 12Q8 6 2.6 9.4 6 13 9 13.6 5 15 3.6 18.4 9 20 16 16z" />
    <path d="M16 12q8-6 13.4-2.6Q26 13 23 13.6q4 1.4 5.4 4.8Q23 20 16 16z" />
  </M>
);

/** A fish. The kingdom that hid the Pandavas wore one on its banner. */
const Matsya: Mark = (p) => (
  <M {...p}>
    <path d="M4 16q7-8 14-8t10 8q-3 8-10 8T4 16z" />
    <path d="m28 16 3.4-5v10z" opacity=".5" />
    <circle cx="10.6" cy="14.4" r="1.1" fill="currentColor" stroke="none" />
  </M>
);

/* ------------------------------------------------------------- the elements */

/** Flame. */
const Agni: Mark = (p) => (
  <M {...p}>
    <path
      d="M17.4 2q-1 5.6-5.4 9.4-4.6 4-4.6 9.4A8.6 8.6 0 0 0 24.6 21q0-4.6-3.4-7.6.6 3.4-2 4.6 1.4-6.6-1.8-16z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M16.4 14.6q-3.2 2.8-3.2 6a3.2 3.2 0 0 0 6.4.2q0-2.8-3.2-6.2z"
      fill="var(--pal-base, #000)"
      stroke="none"
    />
  </M>
);

/** Water, running. */
const Jala: Mark = (p) => (
  <M {...p}>
    <path d="M2.6 11q4.5-4 6.7 0t6.7 0 6.7 0 6.7 0" />
    <path d="M2.6 18q4.5-4 6.7 0t6.7 0 6.7 0 6.7 0" />
    <path d="M2.6 25q4.5-4 6.7 0t6.7 0 6.7 0 6.7 0" />
  </M>
);

/** The rain cloud. Indra's answer to a dry field. */
const Megha: Mark = (p) => (
  <M {...p}>
    <path d="M9 19q-5 0-5-4.4T9 10q1-4.6 6-4.6t6 5q5-.6 5 4t-5 4.6z" />
    <path d="M10.6 23v3.4M16 23.6v4.4M21.4 23v3.4" />
  </M>
);

/** Wind, turning. */
const Vayu: Mark = (p) => (
  <M {...p}>
    <path d="M3.6 11h13a4 4 0 1 0-4-4" />
    <path d="M3.6 17h18a4 4 0 1 1-4 4" />
    <path d="M3.6 23h9a3.4 3.4 0 1 1-3.4 3.4" />
  </M>
);

/** A drop. */
const Rakta: Mark = (p) => (
  <M {...p}>
    <path d="M16 3.6q9 11 9 16.4a9 9 0 0 1-18 0Q7 14.6 16 3.6z" />
    <path d="M12.4 19.4q0 4 3.6 4.6" opacity=".55" />
  </M>
);

/* ------------------------------------------------------------------ objects */

/** The palm-leaf manuscript. Counsel, law, and letters. */
const Pothi: Mark = (p) => (
  <M {...p}>
    <path d="M16 9.4Q10.6 6 3.6 7.2v16.4q7-1.2 12.4 2.2 5.4-3.4 12.4-2.2V7.2Q21.4 6 16 9.4z" />
    <path d="M16 9.4v16.4" />
    <path d="M7.4 12.4h5M7.4 16.4h5M19.6 12.4h5M19.6 16.4h5" opacity=".5" />
  </M>
);

/** The shield. */
const Phalaka: Mark = (p) => (
  <M {...p}>
    <path d="M16 3.4 27 7v9.4q0 8.6-11 12.2Q5 25 5 16.4V7z" />
    <circle cx="16" cy="14.6" r="3.4" />
  </M>
);

/** The dice. Every disaster in this story starts with these. */
const Aksha: Mark = (p) => (
  <M {...p}>
    <path d="M5.4 9.6h13.2v13.2H5.4z" />
    <path d="m18.6 22.8 8-4.4V5.2l-8 4.4" />
    <path d="m5.4 9.6 8-4.4h13.2" />
    <circle cx="12" cy="16.2" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="8.6" cy="12.8" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="15.4" cy="19.6" r="1.3" fill="currentColor" stroke="none" />
  </M>
);

/** Prayer beads. The brahmins who nonetheless took the field. */
const Akshamala: Mark = (p) => (
  <M {...p}>
    {Array.from({ length: 9 }, (_, i) => {
      const a = (i * 2 * Math.PI) / 9 - Math.PI / 2;
      return <circle key={i} cx={16 + Math.cos(a) * 9.6} cy={14 + Math.sin(a) * 9.6} r="2.5" />;
    })}
    <circle cx="16" cy="26.4" r="2.9" fill="currentColor" stroke="none" />
    <path d="M16 29.4v1.6" />
  </M>
);

/** A lit lamp. The devotee, and the man who would not fight back. */
const Dipa: Mark = (p) => (
  <M {...p}>
    <path
      d="M16.6 4.4q-.6 4.4-3.4 6.8t-2.8 5.2a5.6 5.6 0 0 0 11.2 0q0-3-2.6-5 .4 2.4-1.4 3.2 1-4.6-1-10.2z"
      fill="currentColor"
      stroke="none"
    />
    <path d="M4.4 20.6h23.2q-1.4 7.6-11.6 7.6T4.4 20.6z" />
    <path d="M16 28.2v2.2M9 24.4h14" opacity=".5" />
  </M>
);

/** The staff. Age, office, and the right to speak first. */
const Danda: Mark = (p) => (
  <M {...p}>
    <path d="M13 29 20 6" />
    <path d="M20 6q4-2 5 1.6t-3.4 3.6" />
    <path d="M10 29h7" />
  </M>
);

/** Battlements. A fort, and the kings who were one. */
const Prakara: Mark = (p) => (
  <M {...p}>
    <path d="M4 27V12h3.4V8.6h4V12h5.2V8.6h4V12H28v15z" />
    <path d="M13.4 27v-7.4h5.2V27" />
  </M>
);

/** A gateway, barred. One man held one of these for a whole afternoon. */
const Dvara: Mark = (p) => (
  <M {...p}>
    <path d="M6.6 29V12q0-8 9.4-8t9.4 8v17" />
    <path d="M11.6 29V13.6q0-4.4 4.4-4.4t4.4 4.4V29" />
    <path d="M3 29h26" />
  </M>
);

/** The pillar. Hiranyakashipu asked what could be inside one. */
const Stambha: Mark = (p) => (
  <M {...p}>
    <path d="M6.6 29h18.8M8.6 25.4h14.8" />
    <path d="M11 25.4V8.6h10v16.8" />
    <path d="M8.6 8.6h14.8M7 5h18" />
  </M>
);

/** The plough. The brother who walked away and went on pilgrimage instead. */
const Hala: Mark = (p) => (
  <M {...p}>
    <path d="M27 4.6 12.6 19" />
    <path d="M12.6 19q-6 6-1.4 9.4t9-2.4" />
    <path d="M5 12.6h8.4" />
  </M>
);

/** The skull. */
const Kapala: Mark = (p) => (
  <M {...p}>
    <path d="M16 4q9 0 9 9.4 0 5-3 7v3.4h-12v-3.4q-3-2-3-7Q7 4 16 4z" />
    <circle cx="12.4" cy="14" r="2.4" />
    <circle cx="19.6" cy="14" r="2.4" />
    <path d="M14 27.8v-4M18 27.8v-4" />
  </M>
);

/** Closed eyes. Sleep, laid on the willing and the unwilling alike. */
const Nidra: Mark = (p) => (
  <M {...p}>
    <path d="M4.6 14q11-9 22.8 0" />
    <path d="M4.6 14q11 9 22.8 0" opacity=".4" />
    <path d="M9 12.6 6.6 10M16 11V8M23 12.6 25.4 10" />
    <path d="M12 22h7l-7 5h7" />
  </M>
);

/** A radiating burst. The Brahma line: everything at once, and no taking it back. */
const BrahmaBurst: Mark = (p) => (
  <M {...p}>
    <circle cx="16" cy="16" r="3.4" fill="currentColor" stroke="none" />
    {Array.from({ length: 6 }, (_, i) => {
      const a = (i * Math.PI) / 3 - Math.PI / 2;
      return (
        <path
          key={i}
          d={`M${16 + Math.cos(a) * 5.4} ${16 + Math.sin(a) * 5.4} L${16 + Math.cos(a - 0.28) * 13.4} ${16 + Math.sin(a - 0.28) * 13.4} L${16 + Math.cos(a + 0.28) * 13.4} ${16 + Math.sin(a + 0.28) * 13.4} z`}
        />
      );
    })}
  </M>
);

/** The coiled array. A formation you can enter and cannot leave. */
const VyuhaMark: Mark = (p) => (
  <M {...p}>
    <path d="M16 16a2.6 2.6 0 1 1 2.6 2.6A5.6 5.6 0 0 1 13 13a8.6 8.6 0 0 1 8.6-8.6" />
    <path d="M16 16a2.6 2.6 0 1 0-2.6-2.6M16 16a5.6 5.6 0 0 0 5.6 5.6 8.6 8.6 0 0 0 6-2.4" />
    <circle cx="16" cy="16" r="13.4" strokeDasharray="1.6 3" />
  </M>
);

/** A disc split down the middle, one half filled. Two lives in one body. */
const Ardha: Mark = (p) => (
  <M {...p}>
    <circle cx="16" cy="16" r="12" />
    <path
      d="M16 4q3.6 6 0 12t0 12A12 12 0 0 1 16 4z"
      fill="currentColor"
      fillOpacity=".8"
      stroke="none"
    />
    <path d="M16 4q3.6 6 0 12t0 12" />
  </M>
);

/** The fist. Wrestlers, and men who needed no weapon. */
const Mushti: Mark = (p) => (
  <M {...p}>
    <path d="M9.4 15.6q0-3.2 3-3.2t3-3.2q0-3 3.2-3t3.2 3.2q3 0 3 3.2v4.6q0 7.4-7.6 7.4h-2q-5.8 0-5.8-5.8z" />
    <path d="M9.4 18.6q-3.8.6-3.8 3.4t3.8 3" />
    <path d="M15.4 12.4v3.2M21.6 12.6v3" opacity=".5" />
  </M>
);

/** The flute. It never killed anyone, and it decided the war. */
const Bansuri: Mark = (p) => (
  <M {...p}>
    <path d="M3.6 12.4h24.8q2 0 2 3.6t-2 3.6H3.6q-2 0-2-3.6t2-3.6z" />
    <circle cx="7.4" cy="16" r="1.7" />
    <circle cx="14" cy="16" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="18.4" cy="16" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="22.8" cy="16" r="1.4" fill="currentColor" stroke="none" />
  </M>
);

/** Two marks side by side. Brothers who are never named apart. */
const Yugma: Mark = (p) => (
  <M {...p}>
    <circle cx="11" cy="11.6" r="4.4" />
    <circle cx="21" cy="11.6" r="4.4" />
    <path d="M3.4 27.4q0-7 7.6-7t7.6 7" opacity=".55" />
    <path d="M13.4 27.4q0-7 7.6-7t7.6 7" />
  </M>
);

/* ------------------------------------------------------- the named weapons */

/**
 * Chandrahasa, "moon-laughter": the sword Shiva gave Ravana.
 *
 * Two drafts of this were a curved sabre and both read as a leaf, which is the
 * same trap the flame and the conch fell into. Built instead out of two shapes
 * that already survive at card size, a blade and a crescent, with the moon
 * standing in for the pommel. It reads as a sword first and a moon second,
 * which is the right order.
 */
const Asidhara: Mark = (p) => (
  <M {...p}>
    <path d="M16 2.6 19.4 8.8v11.4h-6.8V8.8z" fill="currentColor" stroke="none" />
    <path d="M9 20.6h14" strokeWidth="2" />
    <path d="M16 20.6v2.2" />
    <path d="M18.3 22.2a4.32 4.32 0 1 0 1.66 6.05A4.68 4.68 0 0 1 18.3 22.2z" />
  </M>
);

/** Three arrows. Barbarika needed exactly this many to end any war. */
const TriShara: Mark = (p) => (
  <M {...p}>
    <path d="M16 29V4.4M16 4.4l-2.8 3.6M16 4.4l2.8 3.6" />
    <path d="M7.6 29 11 6.6M11 6.6 7.4 9.4M11 6.6l3.2 2.2" opacity=".85" />
    <path d="M24.4 29 21 6.6M21 6.6l3.6 2.8M21 6.6l-3.2 2.2" opacity=".85" />
  </M>
);

/* ------------------------------------------------------- states of the mind */

/**
 * A target, struck. Ekalavya taught himself in front of a clay statue and
 * still outshot the man it was made of.
 */
const Lakshya: Mark = (p) => (
  <M {...p}>
    <circle cx="14" cy="18" r="11.4" />
    <circle cx="14" cy="18" r="6.6" />
    <circle cx="14" cy="18" r="2.2" fill="currentColor" stroke="none" />
    <path d="M29.4 2.6 16.4 15.6" />
    <path d="m29.4 2.6-5 .8M29.4 2.6l-.8 5" />
  </M>
);

/** An open eye. Insight, and the astra that grants it. */
const Netra: Mark = (p) => (
  <M {...p}>
    <path d="M1.6 16Q8.4 6.6 16 6.6T30.4 16Q23.6 25.4 16 25.4T1.6 16z" />
    <circle cx="16" cy="16" r="4.8" fill="currentColor" stroke="none" />
    <path d="M16 6.6V3M6.2 9.6 4 6.6M25.8 9.6 28 6.6" opacity=".5" />
  </M>
);

/** A bell. What wakes a field that has been put to sleep. */
const Ghanta: Mark = (p) => (
  <M {...p}>
    <path
      d="M16 6.4q6.8 1.8 6.8 10.6 0 3.6 1.6 5.4H7.6q1.6-1.8 1.6-5.4 0-8.8 6.8-10.6z"
      fill="currentColor"
      stroke="none"
    />
    <circle cx="16" cy="4" r="2" />
    <path d="M6 22.4h20" />
    <path d="M16 24v2" />
    <circle cx="16" cy="27.6" r="2.2" fill="currentColor" stroke="none" />
  </M>
);

/**
 * Half a form, half nothing. Antardhana is the vanishing, and it is also how
 * Indrajit fought: the enemy could not see where the arrows were coming from.
 */
const Antardhana: Mark = (p) => (
  <M {...p}>
    <path
      d="M16 3.6a12.4 12.4 0 0 0 0 24.8z"
      fill="currentColor"
      fillOpacity=".85"
      stroke="none"
    />
    <path d="M16 3.6a12.4 12.4 0 0 1 0 24.8" strokeDasharray="2.2 3.2" />
    <path d="M16 3.6v24.8" opacity=".45" />
  </M>
);

/**
 * The same shape, three times over. Tvashtra fills the field with foes that
 * are not there, and the enemy spends the battle fighting them.
 */
const Bahurupa: Mark = (p) => (
  <M {...p}>
    <path d="M16 3.6 24.4 14H7.6z" fill="currentColor" stroke="none" />
    <path d="M16 11.6 24.4 22H7.6z" opacity=".6" />
    <path d="M16 19.6 24.4 30H7.6z" opacity=".3" />
  </M>
);

/**
 * Spiralling eyes. Sammohana kills nobody: it takes an army's wits and leaves
 * it standing on the field with nothing to do.
 */
const Moha: Mark = (p) => (
  <M {...p}>
    <path d="M10 17.4a1.6 1.6 0 1 0 1.6-1.6 3.8 3.8 0 1 0-3.8 3.8 6 6 0 1 0 6-6" />
    <path d="M22 17.4a1.6 1.6 0 1 1-1.6-1.6 3.8 3.8 0 1 1 3.8 3.8 6 6 0 1 1-6-6" />
  </M>
);

/* ----------------------------------------------------------------- the map */

// One mark per card. Cards not named here fall through to their type mark,
// which is why a new card never renders blank.
const BY_ID: Record<string, Mark> = {
  // Pandavas
  arjuna: Dhanus,
  bhima: Gada,
  yudhishthira: Mukuta,
  abhimanyu: VyuhaMark,
  ghatotkacha: Rakshasa,
  dhrishtadyumna: Agni,
  nakula: Khadga,
  sahadeva: Pothi,
  shikhandi: Ardha,
  pandava_infantry: Phalaka,
  krishna_charioteer: Bansuri,

  // Kauravas
  bhishma: Trishula,
  drona: Dhanus,
  karna: Surya,
  duryodhana: Gada,
  ashwatthama: Chandra,
  dushasana: Mushti,
  shakuni: Aksha,
  jayadratha: Dvara,
  kaurava_infantry: Khadga,

  // Astras and tricks
  nagastra: Naga,
  brahmastra: BrahmaBurst,
  brahmashirsha: BrahmaBurst,
  pashupatastra: Trishula,
  vaishnavastra: ChakraMark,
  narayanastra: Shankha,
  ashwatthama_elephant: Ankusha,
  vasavi_shakti: Vajra,
  aindrastra: Megha,
  bhargavastra: Parashu,
  vayavyastra: Vayu,
  sammohana: Moha,
  agneyastra: Agni,
  varunastra: Jala,
  sauparna: Paksha,

  // Pandava allies
  iravan: Naga,
  anjanaparvan: Rakshasa,
  drupada: Prakara,
  satyaki: Khadga,
  virata: Matsya,
  sweta: Vajra,
  sankha: Shankha,
  uttara: Dhanus,
  chekitana: Phalaka,
  dhrishtaketu: Trishula,
  kekaya_brothers: Yugma,
  kuntibhoja: Padma,
  yuyutsu: Tula,
  yudhamanyu: ChakraMark,
  uttamaujas: ChakraMark,
  prativindhya: Agni,
  sutasoma: Agni,
  shrutakarma: Agni,
  shatanika: Agni,
  shrutasena: Agni,

  // Kaurava allies
  shalya: ChakraMark,
  kripa: Akshamala,
  kritavarma: Chandra,
  bhurishravas: Dipa,
  bahlika: Danda,
  somadatta: Khadga,
  vikarna: Tula,
  chitrasena: Dhanus,
  vivimsati: Dhanus,
  durmukha: Mushti,
  uluka: Pothi,
  vinda: Yugma,
  anuvinda: Yugma,
  susharma: Kapala,
  sudakshina: Prakara,
  srutayudha: Mudgara,
  jalasandha: Ankusha,
  alambusha: Rakshasa,
  alayudha: Rakshasa,
  vrishasena: Surya,

  // Asuras
  ravana: Mukuta,
  kumbhakarna: Nidra,
  indrajit: Antardhana, // he fought unseen; that is the whole of him
  hiranyakashipu: Stambha,
  hiranyaksha: Shringa,
  bali: Mukuta,
  prahlada: Dipa,
  narakasura: Khadga,
  mahishasura: Shringa,
  shumbha: Yugma,
  nishumbha: Yugma,
  raktabija: Rakta,
  vritra: Naga,
  tarakasura: Tara,
  asura_horde: Rakshasa,

  // Vardaan: gifts of the gods
  brahmas_bargain: Padma,
  kunti_invocation: Bindu,
  surya_kavacha: Surya,
  ashwins_draught: Akshamala,
  vayu_fury: Vayu,
  yama_summons: Danda,

  // Those who stood apart
  barbarika: TriShara, // three arrows were enough for any war
  jarasandha: Mushti,
  balarama: Hala,
  ekalavya: Lakshya,
  shishupala: Aksha,
  rukmi: Dhanus,

  // These twelve had no entry and fell through to a type-generic mark, so six
  // named weapons all rendered as the same plain sword. Three of them are not
  // even swords: Gandiva is Arjuna's bow, Kaumodaki is Vishnu's mace, Parasu
  // is an axe. Every mark below already existed; they were simply never wired.
  bhagadatta: Ankusha, // the great elephant king, who rode Supratika
  gandiva: Dhanus,
  kaumodaki: Gada,
  vajra: Vajra,
  parasu: Parashu,
  asi: Khadga, // the first sword, so it keeps the archetypal one
  chandrahasa: Asidhara,
  praswapa: Nidra,
  tvashtra: Bahurupa,
  samvodhana: Ghanta,
  prajna: Netra,
  antardhana: Antardhana,
};

const BY_TYPE: Record<string, Mark> = {
  unit: Khadga,
  astra: BrahmaBurst,
  shastra: Khadga,
  boon: Padma,
  curse: Kapala,
  stratagem: Aksha,
};

/** The drawn mark for a card, as a component. Never returns undefined. */
export function markFor(id: string, type: string): Mark {
  return BY_ID[id] ?? BY_TYPE[type] ?? Khadga;
}
