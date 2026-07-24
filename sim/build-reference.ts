// Build docs/reference.html — the canon reference (astras by tier, warriors by
// power) straight from the live card data. Regenerate after balance changes:
//   npx vite-node sim/build-reference.ts
import fs from 'node:fs';
import { allCards, provisionOf } from '@content/cards';
import type { Card } from '@engine/types';

const FONT_DIR = 'node_modules/@fontsource/cinzel/files';
const b64 = (p: string) => fs.readFileSync(p).toString('base64');
const cinzel400 = b64(`${FONT_DIR}/cinzel-latin-400-normal.woff2`);
const cinzel700 = b64(`${FONT_DIR}/cinzel-latin-700-normal.woff2`);

const esc = (s: unknown) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

type U = Card & {
  house?: string;
  basePower?: number;
  tier?: string;
  astraTier?: number;
  astraMastery?: number;
  knownAstras?: string[];
  counteredBy?: string[];
  flavor?: string;
};
const cards = allCards() as U[];
const byName = (id: string) => cards.find((c) => c.id === id)?.name ?? id;
const astras = cards.filter((c) => c.type === 'astra');
const units = cards.filter((c) => c.type === 'unit');

function keywordsOf(c: U): string[] {
  return (c.keywords ?? []).map((k) => k.kind);
}

const RANK: Record<string, string> = { maharathi: 'Maharathi', atirathi: 'Atirathi', rathi: 'Rathi' };
const RANKMARK: Record<string, string> = { maharathi: '≡', atirathi: '=', rathi: '–' };
const FACTION: Record<string, string> = { pandava: 'Pandava', kaurava: 'Kaurava', asura: 'Asura' };

// ---- Astras ----
const ASTRA_TEXT: Record<string, string> = {
  pashupatastra: 'Wins the battle outright, then burns from your hand for the rest of the run.',
  brahmashirsha: 'Ravages the struck row (−8) and lingers (−4); scars your own adjacent line (−3).',
  narayanastra: 'A storm of −5 loosed across every enemy on the field.',
  vaishnavastra: 'Slays one chosen foe. It never misses its mark.',
  vasavi_shakti: 'Slays the mightiest foe, then is spent, gone for the rest of the run.',
  brahmastra: 'Ravages the struck row (−6) and lingers (−3); collateral (−2) to your own line.',
  bhargavastra: '−3 rained upon every enemy at once.',
  sammohanastra: 'A weapon of sleep: −2 across the struck row.',
  aindrastra: 'Indra’s shower: −4 to the struck row.',
  agneyastra: 'A wall of flame: −4 to the struck row.',
  varunastra: 'Varuna’s deluge: −4 to the mightiest foe; it quenches Agni.',
  vayavyastra: 'Vayu’s gale: −3 to the struck row.',
  nagastra: 'Slays the mightiest foe, unless Garuda answers from the hand.',
  garudastra: '−5 to the mightiest foe; its shadow scatters every naga.',
};
const TIER_META: Record<number, { label: string; name: string; desc: string }> = {
  3: { label: 'Tier III', name: 'Divine Ultimates', desc: 'Loosed only by their named master. No rank alone unlocks them.' },
  2: { label: 'Tier II', name: 'Brahma-line', desc: 'Any Maharathi trained as an astra-master (mastery 2) may loose these.' },
  1: { label: 'Tier I', name: 'Elemental', desc: 'Any astra-adept warrior (mastery 1+) may loose these.' },
};
const ORDER: Record<string, number> = {
  pashupatastra: 0, narayanastra: 1, brahmashirsha: 2, vasavi_shakti: 3, vaishnavastra: 4,
  brahmastra: 0, bhargavastra: 1, sammohanastra: 2,
  nagastra: 0, garudastra: 1, aindrastra: 2, agneyastra: 3, varunastra: 4, vayavyastra: 5,
};

function wielders(a: U): string {
  const named = units.filter((u) => (u.knownAstras || []).includes(a.id)).map((u) => u.name);
  if (a.astraTier === 3) return named.length ? named.join(', ') : 'none';
  const n = units.filter((u) => (u.astraMastery ?? 0) >= (a.astraTier ?? 1)).length;
  return a.astraTier === 2 ? `Any Maharathi astra-master · ${n} in roster` : `Any astra-adept · ${n} in roster`;
}

function astraRows(tier: number): string {
  return astras
    .filter((a) => a.astraTier === tier)
    .sort((x, y) => (ORDER[x.id] ?? 9) - (ORDER[y.id] ?? 9))
    .map((a) => {
      const counter = (a.counteredBy || []).filter((c) => c !== a.id).map(byName);
      const mirror = (a.counteredBy || []).includes(a.id);
      const counterTxt = counter.length ? counter.join(', ') : mirror ? 'Only its own kind' : 'none';
      return `<tr>
        <td class="c-name"><span class="glyphdot t${tier}"></span>${esc(a.name)}</td>
        <td class="c-eff">${esc(ASTRA_TEXT[a.id] || '')}</td>
        <td class="c-cost"><span class="prov">${provisionOf(a)}</span></td>
        <td class="c-wield">${esc(wielders(a))}</td>
        <td class="c-counter">${esc(counterTxt)}</td>
      </tr>`;
    })
    .join('\n');
}
function tierBlock(tier: number): string {
  const m = TIER_META[tier];
  return `<section class="tierband t${tier}">
    <header class="tierhead">
      <div class="tierbadge">${m.label}</div>
      <div class="tiernames"><h3>${m.name}</h3><p>${m.desc}</p></div>
    </header>
    <div class="tablewrap"><table class="astratable">
      <thead><tr><th>Astra</th><th>What it does</th><th>Cost</th><th>Who may loose it</th><th>Answered by</th></tr></thead>
      <tbody>${astraRows(tier)}</tbody>
    </table></div>
  </section>`;
}

// ---- Warriors ----
const SIG: Record<string, string> = {
  arjuna: 'Bearer of the Gandiva; looses the Pashupatastra.',
  bhishma: 'Icchamrityu: cannot fall until Shikhandi stands.',
  karna: 'Kavacha-armour, but the wheel-curse and vow bind him in the end.',
  bhima: 'Vowed to break Dushasana and Duryodhana.',
  drona: 'Untouchable until the elephant-lie is told.',
  duryodhana: 'Gandhari’s gaze turned his body to adamant.',
  abhimanyu: 'Trapped in the chakravyuha, he dies where he is caught.',
  dhrishtadyumna: 'Born from fire to slay Drona.',
  sweta: 'Looses a bolt at the mightiest foe.',
  satyaki: 'Krishna’s pupil, a Maharathi astra-master.',
  shalya: 'Karna’s own charioteer, sapping his spirit from within.',
  ashwatthama: 'Chiranjivi; looses the Narayanastra.',
  bhagadatta: 'Rides Supratika; hurls the Vaishnavastra.',
  bhurishravas: 'Yupadhwaja, felled with his sword-arm raised.',
  ravana: 'Ten-headed lord of Lanka, armoured by tapasya.',
  indrajit: 'Conqueror of Indra; bears the Vaishnavastra.',
  yudhishthira: 'The Dharma king steadies his line.',
  ghatotkacha: 'Rakshasa night-strength; grows as the war drags on.',
  nakula: 'Fairest of the five; stronger beside his brothers.',
  sahadeva: 'Knower of all things; slays Shakuni on sight.',
  shikhandi: 'The turn of fate that unmakes Bhishma.',
  kripa: 'Chiranjivi guru of the Kuru house.',
  kritavarma: 'Night-strength; one of the three dawn survivors.',
  jayadratha: 'Shiva’s boon holds the Pandavas back a day.',
  kumbhakarna: 'Wakes to devour; a night-strength titan.',
  hiranyakashipu: 'Brahma’s boon: slain by neither man nor beast.',
  bali: 'Deathless until Vishnu’s third step.',
  mahishasura: 'The buffalo-demon; strength swells through the night.',
  vritra: 'The drought-serpent; regrows what is cut.',
  raktabija: 'Every drop of blood springs a new foe.',
  shakuni: 'The dice-master; strikes at the mightiest by guile.',
  yuyutsu: 'Chiranjivi; the one son who crossed to dharma.',
};
const KW_LABEL: Record<string, string> = {
  deathless: 'Chiranjivi: cannot be slain.',
  armor: 'Armoured against the first strike.',
  nightGrowth: 'Night-strength: grows each round.',
  icchamrityu: 'Icchamrityu: unslayable until his fate-card appears.',
  immuneUntilPlayed: 'Untouchable until the trap is sprung.',
  bond: 'Bond: stronger beside its clan.',
};
function sigFor(u: U): string {
  if (SIG[u.id]) return SIG[u.id];
  const kws = keywordsOf(u);
  for (const k of ['icchamrityu', 'immuneUntilPlayed', 'deathless', 'armor', 'nightGrowth']) {
    if (kws.includes(k)) return KW_LABEL[k];
  }
  if (kws.includes('bond')) return KW_LABEL.bond;
  return '';
}
function masteryBadge(u: U): string {
  if ((u.knownAstras || []).length) return `<span class="mst mst-t3" title="Bears a named ultimate astra">◆ ultimate</span>`;
  if ((u.astraMastery ?? 0) >= 2) return `<span class="mst mst-t2" title="Brahma-line astra-master">◆ Brahma-line</span>`;
  if ((u.astraMastery ?? 0) >= 1) return `<span class="mst mst-t1" title="Elemental astra-adept">◆ elemental</span>`;
  return '';
}
function powerBlock(p: number): string {
  const g = units.filter((u) => u.basePower === p);
  if (!g.length) return '';
  const cols = (['pandava', 'kaurava', 'asura'] as const)
    .map((h) => {
      const list = g.filter((u) => u.house === h);
      const items = list
        .map((u) => {
          const sig = sigFor(u);
          const ab = (u as { ability?: { name: string; text: string } }).ability;
          return `<li class="unit">
            <span class="uname"><span class="rankmark" title="${RANK[u.tier ?? ''] || ''}">${RANKMARK[u.tier ?? ''] || ''}</span>${esc(u.name)}${masteryBadge(u)}${ab ? `<span class="mst mst-ab" title="${esc(ab.text)}">${esc(ab.name)}</span>` : ''}</span>
            ${sig ? `<span class="usig">${esc(sig)}</span>` : ''}</li>`;
        })
        .join('');
      return `<div class="fcol f-${h}">
        <div class="fcolhead"><span class="fdot f-${h}"></span>${FACTION[h]}<span class="fcount">${list.length}</span></div>
        <ul class="unitlist">${items || '<li class="empty">none</li>'}</ul>
      </div>`;
    })
    .join('');
  const rankHint = p >= 9 ? 'Maharathi' : p >= 7 ? 'Maharathi / Atirathi' : p >= 5 ? 'Atirathi / Rathi' : 'Rathi / levy';
  return `<section class="powerband">
    <div class="prail"><div class="pnum">${p}</div><div class="pof">/ 10</div><div class="phint">${rankHint}</div><div class="pcount">${g.length} warrior${g.length > 1 ? 's' : ''}</div></div>
    <div class="pcols">${cols}</div>
  </section>`;
}
const powerBands: string[] = [];
for (let p = 10; p >= 1; p--) {
  const b = powerBlock(p);
  if (b) powerBands.push(b);
}

// ---- Mastery ladder ----
const ladderNamed = units.filter((u) => (u.knownAstras || []).length);
const ladderT2 = units.filter((u) => (u.astraMastery ?? 0) >= 2 && !(u.knownAstras || []).length);
const ladderT1only = units.filter((u) => (u.astraMastery ?? 0) === 1 && !(u.knownAstras || []).length);
const namedLine = ladderNamed.map((u) => `${u.name} <em>(${u.knownAstras!.map(byName).join(', ')})</em>`).join(' · ');

const CSS = fs.readFileSync('sim/reference.css', 'utf8')
  .replace('__CINZEL400__', cinzel400)
  .replace('__CINZEL700__', cinzel700);

const html = `<title>Kurukshetra: Canon Reference</title>
<style>${CSS}</style>
<div class="wrap"><div class="sheet">
  <header class="mast">
    <div class="deva">कुरुक्षेत्र</div>
    <h1>Canon Reference</h1>
    <p class="sub">The fixed ground beneath every mode: which astras exist and who may loose them, and where each warrior stands in raw power. Base power is only a starting number. Vows, curses, and boons decide the rest.</p>
  </header>
  <nav class="nav">
    <a href="#astras">The Astras</a><a href="#ladder">Astra Mastery</a><a href="#warriors">The Warriors</a>
  </nav>
  <section id="astras">
    <h2 class="secttitle">The Astras <span class="en">divine weapons, ranked by tier</span></h2>
    <p class="lede">Every astra carries a tier. The higher the tier, the fewer hands that can wield it. Tier III cannot be unlocked by rank at all, only by the warrior it belongs to in the epic.</p>
    ${tierBlock(3)}${tierBlock(2)}${tierBlock(1)}
    <div class="legend" style="margin-top:12px;">
      <span class="item"><span class="glyphdot t3" style="transform:rotate(45deg)"></span>Tier III · ultimate</span>
      <span class="item"><span class="glyphdot t2" style="transform:rotate(45deg)"></span>Tier II · Brahma-line</span>
      <span class="item"><span class="glyphdot t1" style="transform:rotate(45deg)"></span>Tier I · elemental</span>
      <span class="item">Cost = deck provisions (of 170)</span>
    </div>
  </section>
  <section id="ladder">
    <h2 class="secttitle">Astra Mastery <span class="en">who may loose what</span></h2>
    <p class="lede">Rank grants the common weapons; the ultimates stay locked to their mythic owners. This ladder is the bridge between the two tables: a warrior's mastery decides which astras above they can actually fire.</p>
    <div class="ladder">
      <div class="lrow l3"><div class="lk">Named bearers<small>Tier III ultimates, by boon</small></div><div class="lv">${namedLine}</div></div>
      <div class="lrow l2"><div class="lk">Brahma-line masters<small>Mastery 2 · Tier II &amp; below</small></div><div class="lv">${ladderT2.map((u) => u.name).join(' · ')}</div></div>
      <div class="lrow l1"><div class="lk">Elemental adepts<small>Mastery 1 · Tier I only</small></div><div class="lv">${ladderT1only.map((u) => u.name).join(' · ')}<em> (plus every Brahma-line master above)</em></div></div>
    </div>
  </section>
  <section id="warriors">
    <h2 class="secttitle">The Warriors <span class="en">ranked by base power</span></h2>
    <p class="lede">Raw power maps to the canon ranking of the Bhishma Parva: Maharathi at the peak, then Atirathi, then Rathi and levies. The rank mark <span class="rankmark">≡</span> Maharathi · <span class="rankmark">=</span> Atirathi · <span class="rankmark">–</span> Rathi sits before each name.</p>
    <div class="legend">
      <span class="item"><span class="fdot f-pandava"></span>Pandava</span>
      <span class="item"><span class="fdot f-kaurava"></span>Kaurava</span>
      <span class="item"><span class="fdot f-asura"></span>Asura</span>
      <span class="item"><span class="mst mst-t3">◆ ultimate</span> bears a named astra</span>
      <span class="item"><span class="mst mst-t2">◆ Brahma-line</span> mastery 2</span>
      <span class="item"><span class="mst mst-t1">◆ elemental</span> mastery 1</span>
    </div>
    ${powerBands.join('\n')}
  </section>
  <footer class="foot"><div class="rule"></div>
    Generated from the live card data: ${units.length} warriors, ${astras.length} astras. Numbers here are the balance-tuned values in play, not lore estimates.
  </footer>
</div></div>`;

fs.writeFileSync('docs/reference.html', html);
console.log(`docs/reference.html written (${(html.length / 1024).toFixed(0)}kb) — ${units.length} warriors, ${astras.length} astras, ${powerBands.length} power bands`);
