// Build docs/video-prompts.md: every place in the game that wants a short
// motion graphic, with a ready-to-paste prompt for each.
//
// Generated rather than hand-kept for the same reason the card prompts are:
// one STYLE anchor, applied identically everywhere. Motion that does not match
// the card art reads as glued on, and that is the single fastest way to make a
// hand-made game look cheap.
//
// Usage: npm run video:prompts
import fs from 'node:fs';

// The exact anchor from sim/build-art-prompts.ts. Do not drift from it.
const STYLE =
  'Ink-and-gouache fantasy illustration, bold black linework, opaque gouache ' +
  'brushwork, muted earthy palette, dramatic chiaroscuro.';

// Motion direction shared by everything. Veo will happily produce a glossy 3D
// camera move that looks nothing like a painted card, so this has to be said.
const MOTION =
  'Hand-painted animation feel, subtle grain, no camera fly-through, no 3D ' +
  'render, no lens flare, no photorealism. Slow and deliberate.';

type Tier = 1 | 2 | 3 | 4 | 5;

interface Clip {
  id: string;
  where: string;
  /** Seconds. UI beats stay short; set pieces earn length. */
  secs: string;
  loop: boolean;
  /** How the clip is composited over the page. */
  comp: 'background' | 'screen' | 'multiply' | 'card';
  tier: Tier;
  body: string;
}

const clips: Clip[] = [
  // -----------------------------------------------------------------------
  // TIER 1 - ambient loops. Highest value per clip in the whole list: they are
  // on screen in every session, for minutes at a time, so one good loop is
  // worth more than a dozen one-shots nobody sees twice.
  // -----------------------------------------------------------------------
  {
    id: 'ambient-menu-dawn', where: 'Main menu, behind the title', secs: '8', loop: true,
    comp: 'background', tier: 1,
    body: 'The empty field of Kurukshetra at first light, before either army has ' +
      'formed up. Tall dry grass moving in a slow wind, banners on distant poles ' +
      'stirring, thin dust drifting low across the ground. No people. Wide, still, ' +
      'the horizon low in frame. Almost nothing happens.',
  },
  {
    id: 'ambient-menu-dusk', where: 'Main menu, alternate (returning players)', secs: '8', loop: true,
    comp: 'background', tier: 1,
    body: 'The same empty field at last light, after the day is over. Smoke rising ' +
      'thin and straight from somewhere out of frame, broken spear shafts standing ' +
      'in the ground, a slow drift of ash. No people. Wide and quiet.',
  },
  {
    id: 'ambient-board-haze', where: 'Behind the battle board, all match long', secs: '8', loop: true,
    comp: 'background', tier: 1,
    body: 'Battlefield air seen very close: fine dust and ash turning slowly in ' +
      'shafts of low sun. Abstract, almost no detail, nothing recognisable. Dark ' +
      'and warm. This sits behind the whole board and must never pull the eye.',
  },
  {
    id: 'ambient-map-road', where: 'Run map, between battles', secs: '8', loop: true,
    comp: 'background', tier: 1,
    body: 'A dirt road climbing away between low hills under a heavy sky, seen from ' +
      'the traveller\'s side. Dust moving across it. Empty, no figures. The sense of ' +
      'a march that has not finished.',
  },
  {
    id: 'ambient-shrine', where: 'Shrine screen', secs: '8', loop: true,
    comp: 'background', tier: 1,
    body: 'A small weathered stone shrine in deep shade, oil lamps guttering, ' +
      'incense smoke rising and curling. Marigolds gone dry on the step. Nobody ' +
      'present. Very little motion beyond the smoke and the flame.',
  },
  {
    id: 'ambient-codex', where: 'Codex / card browser', secs: '8', loop: true,
    comp: 'background', tier: 1,
    body: 'Palm-leaf manuscript pages stacked and bound with cord, lit by a single ' +
      'lamp, the edges lifting very slightly in a draught. Dust in the light. ' +
      'Scholarly and quiet, no writing legible.',
  },

  // -----------------------------------------------------------------------
  // TIER 2 - the gods. Eight of them, seen only at a shrine, and they should be
  // the moment the player screenshots. Worth the most generous length.
  // -----------------------------------------------------------------------
  {
    id: 'god-agni', where: 'Shrine: Agni', secs: '5', loop: false, comp: 'screen', tier: 2,
    body: 'Agni, lord of fire, manifesting: a seated figure of flame with two faces ' +
      'and seven tongues of fire rising from him, riding a ram. He resolves out of ' +
      'a cooking fire and settles. Deep reds and gold on black.',
  },
  {
    id: 'god-varuna', where: 'Shrine: Varuna', secs: '5', loop: false, comp: 'screen', tier: 2,
    body: 'Varuna, lord of waters, manifesting: a crowned figure astride a makara ' +
      'sea-creature, holding a coiled noose of water. Water rises around him rather ' +
      'than falling. Deep blue-greens on black.',
  },
  {
    id: 'god-vayu', where: 'Shrine: Vayu', secs: '5', loop: false, comp: 'screen', tier: 2,
    body: 'Vayu, the wind, manifesting: a figure of moving air made visible only by ' +
      'the dust and leaves it carries, a banner streaming from his hand. Pale greys ' +
      'and dry ochre on black.',
  },
  {
    id: 'god-indra', where: 'Shrine: Indra', secs: '6', loop: false, comp: 'screen', tier: 2,
    body: 'Indra, king of the devas, manifesting: a crowned figure on the white ' +
      'elephant Airavata, the vajra thunderbolt held across his body, storm light ' +
      'behind. Rain begins. Gold and storm-grey on black.',
  },
  {
    id: 'god-brahma', where: 'Shrine: Brahma', secs: '6', loop: false, comp: 'screen', tier: 2,
    body: 'Brahma the creator manifesting: a four-faced seated figure on an open ' +
      'lotus, four arms, one holding a water pot and one a manuscript. Utterly ' +
      'still while lotus petals open around him. Warm white and rose on black.',
  },
  {
    id: 'god-parashurama', where: 'Shrine: Parashurama', secs: '5', loop: false, comp: 'screen', tier: 2,
    body: 'Parashurama the axe-bearer manifesting: a matted-haired ascetic with a ' +
      'great axe over one shoulder, standing rather than seated, entirely calm. ' +
      'Blood-dark and ash on black.',
  },
  {
    id: 'god-narayana', where: 'Shrine: Narayana (Vishnu)', secs: '6', loop: false, comp: 'screen', tier: 2,
    body: 'Vishnu manifesting as Narayana: a blue-skinned four-armed figure reclining ' +
      'on the coils of a many-hooded serpent, the discus turning slowly above one ' +
      'palm. Ocean beneath. Deep blue and gold on black.',
  },
  {
    id: 'god-shiva', where: 'Shrine: Shiva', secs: '7', loop: false, comp: 'screen', tier: 2,
    body: 'Shiva manifesting, and this is the largest of the eight: an ash-smeared ' +
      'figure seated in stillness, matted hair, a serpent at the throat, the third ' +
      'eye closed. It does not open. Everything around him is motionless. Ash-white ' +
      'and deep indigo on black.',
  },

  // -----------------------------------------------------------------------
  // TIER 3 - the five ultimates. These are the peaks of the game, fired maybe
  // once in a run, and they are what a player tells someone else about.
  // -----------------------------------------------------------------------
  {
    id: 'astra-brahmashirsha', where: 'Brahmashirsha-Astra fires', secs: '7', loop: false, comp: 'screen', tier: 3,
    body: 'The Brahmashirsha loosed: a single arrow rising, and four faces of flame ' +
      'opening around its head as it climbs. The light goes white. Everything below ' +
      'is lit from above like an eclipse in reverse.',
  },
  {
    id: 'astra-pashupata', where: 'Pashupat-Astra fires', secs: '8', loop: false, comp: 'screen', tier: 3,
    body: 'The Pashupata loosed: not a projectile but an opening eye of white fire ' +
      'in the sky, immense, with the whole horizon reflected in it. Everything ' +
      'beneath goes to silhouette. The most violent image in the set.',
  },
  {
    id: 'astra-narayana', where: 'Narayan-Astra hangs over the field', secs: '8', loop: true, comp: 'screen', tier: 3,
    body: 'A standing storm that does not break: a churning ceiling of dark cloud ' +
      'shot with discus shapes and blades turning inside it, hanging low and ' +
      'waiting. It never discharges. This one loops, because the weapon stays.',
  },
  {
    id: 'astra-vaishnava', where: 'Vaishnav-Astra fires', secs: '6', loop: false, comp: 'screen', tier: 3,
    body: 'The Vaishnava hurled: a golden hooked weapon spinning across the frame, ' +
      'leaving a burning arc. Absolutely straight, absolutely certain, no ' +
      'wavering. Gold on deep blue-black.',
  },
  {
    id: 'astra-vasavi', where: 'Vasavi Shakti fires', secs: '6', loop: false, comp: 'screen', tier: 3,
    body: 'Indra\'s dart thrown: a single spear of white lightning leaving the hand, ' +
      'the air around it tearing. One throw, one line, no spread. It can only be ' +
      'used once and the clip should feel like that.',
  },

  // -----------------------------------------------------------------------
  // TIER 4 - the other fourteen astras. Shorter, cheaper, still distinct.
  // -----------------------------------------------------------------------
  { id: 'astra-brahmastra', where: 'Brahma-Astra fires', secs: '5', loop: false, comp: 'screen', tier: 4,
    body: 'A single arrow rising and blooming into a column of white fire that ' +
      'scorches the ground in a ring beneath it.' },
  { id: 'astra-naga', where: 'Nag-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'Serpents pouring out low across the ground and coiling around a warrior\'s ' +
      'legs, binding him where he stands. They bind, they do not bite.' },
  { id: 'astra-sauparna', where: 'Sauparn-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A host of great birds stooping out of the sky and taking serpents off the ' +
      'ground in their claws. The answer to the snakes, in one motion.' },
  { id: 'astra-sammohana', where: 'Sammohan-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A soundless ring spreading outward, and every weapon in its path falling ' +
      'from the hands that held it. Nobody is hurt. Everything is dropped.' },
  { id: 'astra-praswapa', where: 'Praswapa-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A slow fall of pale dust settling over a line of standing figures, who ' +
      'sink where they stand into sleep. Nobody dies.' },
  { id: 'astra-samvodhana', where: 'Samvodhan-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A clear ringing wave of light passing over sleeping figures, and each one ' +
      'lifting his head. The waking, the exact reverse of the sleep.' },
  { id: 'astra-tvashtra', where: 'Tvashtra-Astra fires', secs: '5', loop: false, comp: 'screen', tier: 4,
    body: 'One figure becoming two, then eight, then a crowd of identical copies ' +
      'fanning outward, each holding the same weapon at the same angle.' },
  { id: 'astra-antardhana', where: 'Antardhan-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A line of warriors thinning to outline and then to nothing, leaving only ' +
      'the dust their feet had lifted, still hanging.' },
  { id: 'astra-bhargava', where: 'Bhargav-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'Arrows in impossible number filling the whole frame edge to edge, a solid ' +
      'weight of them rather than a volley.' },
  { id: 'astra-prajna', where: 'Prajna-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A cold clear light spreading and burning off a fog, and dazed figures ' +
      'within it coming back to themselves. Wakefulness as a weapon.' },
  { id: 'astra-agneya', where: 'Agney-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A sheet of fire rolling forward low and fast across the ground.' },
  { id: 'astra-varuna', where: 'Varun-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'Black water rising in a wall and coming down, drowning fire as it lands.' },
  { id: 'astra-vayavya', where: 'Vayavya-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A wind that tears banners off their poles and drives dust in a flat sheet ' +
      'across the whole frame.' },
  { id: 'astra-aindra', where: 'Aindra-Astra fires', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A dense fall of lightning, many bolts at once, striking a line of ground.' },

  // -----------------------------------------------------------------------
  // TIER 4 - what happens to an astra. These are the game's best moments and
  // none of them currently has a visual at all.
  // -----------------------------------------------------------------------
  { id: 'astra-clash', where: 'Two astras meet (countered)', secs: '5', loop: false, comp: 'screen', tier: 4,
    body: 'Two burning weapons meeting head-on in mid-air and neither winning: the ' +
      'light bursts sideways and scours the ground on BOTH sides of the frame.' },
  { id: 'astra-absorbed', where: 'Krishna takes the Vaishnava', secs: '5', loop: false, comp: 'screen', tier: 4,
    body: 'A burning golden weapon striking a standing figure in the chest and ' +
      'becoming a garland of flowers around his neck. It does not explode. It ' +
      'simply stops being a weapon.' },
  { id: 'astra-drawn', where: 'Ghatotkacha draws the astra', secs: '5', loop: false, comp: 'screen', tier: 4,
    body: 'A huge rakshasa stepping deliberately into the path of an incoming spear ' +
      'of light, arms wide, taking it instead of the man behind him.' },
  { id: 'astra-lifted', where: 'The Narayana is called off', secs: '4', loop: false, comp: 'screen', tier: 4,
    body: 'A standing storm unwinding upward and thinning to clear sky, and weapons ' +
      'lying dropped on the ground beneath it.' },

  // -----------------------------------------------------------------------
  // TIER 5 - battle beats. Short, frequent, small on screen. Cheap to make and
  // they are what gives the board life between the big moments.
  // -----------------------------------------------------------------------
  { id: 'beat-deploy', where: 'A warrior takes the field', secs: '2', loop: false, comp: 'screen', tier: 5,
    body: 'Dust thrown up in a short ring as a heavy figure plants his feet.' },
  { id: 'beat-destroy', where: 'A warrior falls', secs: '2', loop: false, comp: 'screen', tier: 5,
    body: 'A banner and a broken spear going down together into dust.' },
  { id: 'beat-buff', where: 'A warrior is strengthened', secs: '2', loop: false, comp: 'screen', tier: 5,
    body: 'A brief upward wash of warm gold light, rising and gone.' },
  { id: 'beat-debuff', where: 'A warrior is weakened', secs: '2', loop: false, comp: 'screen', tier: 5,
    body: 'A downward drain of grey ash, falling and gone.' },
  { id: 'beat-stupefied', where: 'Stupefied: weapons drop', secs: '2', loop: false, comp: 'screen', tier: 5,
    body: 'A sword, a bow and a mace falling out of frame and hitting the ground.' },
  { id: 'beat-dismount', where: 'Deprived of his chariot', secs: '3', loop: false, comp: 'screen', tier: 5,
    body: 'A chariot wheel shearing off and rolling away, the car tipping, a man ' +
      'stepping down into the dust on foot.' },
  { id: 'beat-hidden', where: 'A warrior vanishes into maya', secs: '2', loop: false, comp: 'screen', tier: 5,
    body: 'An outline thinning to smoke and holding its shape for a moment before ' +
      'the wind takes it.' },
  { id: 'beat-stripped', where: 'Protections are stripped', secs: '2', loop: false, comp: 'screen', tier: 5,
    body: 'A shell of golden armour cracking open along one line and falling away.' },
  { id: 'beat-armor-break', where: 'The Kavacha shatters', secs: '2', loop: false, comp: 'screen', tier: 5,
    body: 'A breastplate of sun-gold splitting and the pieces spinning off.' },
  { id: 'beat-conch', where: 'Round begins', secs: '3', loop: false, comp: 'screen', tier: 5,
    body: 'A great white conch raised and blown, and the air visibly moving out from ' +
      'its mouth in a ring.' },
  { id: 'beat-pass', where: 'A host lays down arms', secs: '3', loop: false, comp: 'screen', tier: 5,
    body: 'Weapons laid down deliberately on the ground in a row, hands opening.' },

  // -----------------------------------------------------------------------
  // TIER 3 - outcomes. Seen at the end of every battle and every run, so they
  // matter more than their count suggests.
  // -----------------------------------------------------------------------
  { id: 'end-victory', where: 'Battle won', secs: '4', loop: false, comp: 'background', tier: 3,
    body: 'Banners going up against a clearing sky, dust settling rather than ' +
      'rising. Restrained, not triumphal: this war has no winners and the art ' +
      'should know it.' },
  { id: 'end-defeat', where: 'Battle lost', secs: '4', loop: false, comp: 'background', tier: 3,
    body: 'A standard leaning and then falling into the dust, the field going dark ' +
      'around it.' },
  { id: 'end-run-won', where: 'Run won', secs: '6', loop: false, comp: 'background', tier: 3,
    body: 'The field at evening, entirely empty, weapons standing in the ground ' +
      'where they were left. Nobody in frame. The end of a war rather than a ' +
      'celebration.' },
  { id: 'end-run-lost', where: 'Run lost', secs: '5', loop: false, comp: 'background', tier: 3,
    body: 'Ash falling steadily over a broken chariot until the shape of it is ' +
      'almost gone.' },

  // -----------------------------------------------------------------------
  // TIER 4 - the run layer. Rarer than battle beats but they carry the roguelike.
  // -----------------------------------------------------------------------
  { id: 'run-reward', where: 'Reward offered after a win', secs: '3', loop: false, comp: 'screen', tier: 4,
    body: 'Three shapes rising slowly out of dark and settling into a row, lit from ' +
      'below.' },
  { id: 'run-recruit', where: 'A warrior joins the host', secs: '3', loop: false, comp: 'screen', tier: 4,
    body: 'A single figure walking in from the edge of frame and turning to stand ' +
      'with the others.' },
  { id: 'run-shastra', where: 'A named weapon is found', secs: '3', loop: false, comp: 'screen', tier: 4,
    body: 'A weapon lifted out of the dust of a battlefield, the dirt falling off it ' +
      'to show the work underneath.' },
  { id: 'run-penance-go', where: 'A warrior leaves for tapasya', secs: '4', loop: false, comp: 'background', tier: 4,
    body: 'A lone figure walking away uphill toward mountains, seen from behind, ' +
      'getting smaller. He does not look back.' },
  { id: 'run-penance-return', where: 'A warrior returns bearing a weapon', secs: '4', loop: false, comp: 'background', tier: 4,
    body: 'A figure coming down out of the mountains toward the viewer, thin and ' +
      'weathered, carrying something that catches the light.' },

  // -----------------------------------------------------------------------
  // TIER 4 - the six curses. Each is a distinct visual idea already.
  // -----------------------------------------------------------------------
  { id: 'curse-scorched', where: 'Curse: Scorched Earth', secs: '3', loop: false, comp: 'multiply', tier: 4,
    body: 'Green ground going brown and then black outward from a centre, cracking ' +
      'as it dries.' },
  { id: 'curse-bowstring', where: 'Curse: Broken Bowstring', secs: '2', loop: false, comp: 'screen', tier: 4,
    body: 'A drawn bowstring parting at full tension and whipping back.' },
  { id: 'curse-withered', where: 'Curse: Withered Host', secs: '3', loop: false, comp: 'multiply', tier: 4,
    body: 'Pale ash settling over a whole line of standing figures until they are ' +
      'the colour of the ground.' },
  { id: 'curse-shiva-gaze', where: "Curse: Shiva's Gaze", secs: '3', loop: false, comp: 'screen', tier: 4,
    body: 'A third eye opening a fraction in the dark, and closing again. Almost ' +
      'nothing happens and it should still be frightening.' },
  { id: 'curse-forgotten', where: 'Curse: The Forgotten Mantra', secs: '3', loop: false, comp: 'screen', tier: 4,
    body: 'Written syllables on a palm leaf fading out of the surface one at a time ' +
      'until the leaf is blank.' },
  { id: 'curse-kinslayer', where: "Curse: The Kin-Slayer's Curse", secs: '3', loop: false, comp: 'screen', tier: 4,
    body: 'Two shadows of warriors on a wall turning to face each other and raising ' +
      'weapons.' },
  { id: 'curse-cleanse', where: 'Rites of Absolution', secs: '3', loop: false, comp: 'screen', tier: 4,
    body: 'Water poured from a copper vessel over open hands, running clean.' },

  // -----------------------------------------------------------------------
  // TIER 2 - faction stings. Played on the host picker and before a battle, so
  // they are seen constantly for how cheap they are.
  // -----------------------------------------------------------------------
  { id: 'sting-pandava', where: 'Pandava chosen', secs: '3', loop: false, comp: 'screen', tier: 2,
    body: 'A blue-white banner unrolling and catching the wind, five spear points ' +
      'rising behind it.' },
  { id: 'sting-kaurava', where: 'Kaurava chosen', secs: '3', loop: false, comp: 'screen', tier: 2,
    body: 'A deep red banner with a serpent device unrolling, a great many spear ' +
      'points rising behind it, more than can be counted.' },
  { id: 'sting-asura', where: 'Asura chosen', secs: '3', loop: false, comp: 'screen', tier: 2,
    body: 'A dark banner unrolling in low green firelight, tusks and horned ' +
      'silhouettes massing behind it.' },

  // -----------------------------------------------------------------------
  // TIER 2 - transitions. Cover the page change and the app stops feeling like
  // a website. Cheap, short, reused constantly.
  // -----------------------------------------------------------------------
  { id: 'trans-to-setup', where: 'Menu to host picker', secs: '2', loop: false, comp: 'screen', tier: 2,
    body: 'A curtain of drifting dust crossing the frame left to right and clearing.' },
  { id: 'trans-to-battle', where: 'Host picker to battle', secs: '3', loop: false, comp: 'screen', tier: 2,
    body: 'Conches sounding: rings of moving air crossing the frame and dust rising ' +
      'to meet them, ending in a wall of dust.' },
  { id: 'trans-to-result', where: 'Battle to result', secs: '2', loop: false, comp: 'screen', tier: 2,
    body: 'Dust settling downward out of frame to reveal clear ground.' },
  { id: 'trans-to-shrine', where: 'Map to shrine', secs: '2', loop: false, comp: 'screen', tier: 2,
    body: 'Incense smoke rising to fill the frame and thinning again.' },
  { id: 'trans-next-rung', where: 'On to the next battle', secs: '2', loop: false, comp: 'screen', tier: 2,
    body: 'A road moving past underfoot, seen looking down, and slowing to a stop.' },
];

// ---------------------------------------------------------------------------

const TIER_NAME: Record<Tier, string> = {
  1: 'Ambient loops — on screen constantly, highest value per clip',
  2: 'Gods, factions and transitions — seen every session',
  3: 'The ultimates and the endings — the moments players talk about',
  4: 'Astras, curses and the run layer — the body of the work',
  5: 'Battle beats — short, cheap, and what gives the board life',
};

const out: string[] = [];
out.push('# Video prompts: every place in the game that wants motion');
out.push('');
out.push('Generated by `npm run video:prompts`. Do not hand-edit.');
out.push('');
out.push(`**${clips.length} clips.** Every prompt carries the same STYLE anchor as the card`);
out.push('art, because motion that does not match the cards reads as glued on.');
out.push('');
out.push('## Before generating anything');
out.push('');
out.push('**Composite mode matters more than the prompt.** Veo will not give you an');
out.push('alpha channel, so anything that sits *over* the board has to be generated on');
out.push('pure black and composited with `mix-blend-mode: screen`, which drops the black');
out.push('and keeps the light. That is why every fire, lightning and light effect below');
out.push('says "on black". Darkening effects (ash, withering, scorch) are the reverse:');
out.push('generate on white, composite with `multiply`.');
out.push('');
out.push('| comp | how it is used | generate on |');
out.push('|---|---|---|');
out.push('| `background` | full-bleed behind a screen | any ground |');
out.push('| `screen` | glow/fire/light over the board | **pure black** |');
out.push('| `multiply` | ash/shadow/scorch over the board | **white** |');
out.push('| `card` | inside a card frame | any ground |');
out.push('');
out.push('**Loops will not loop.** Veo does not produce seamless loops. For the six');
out.push('ambient clips, pick slow drifting motion where the first and last frames are');
out.push('similar, then run two `<video>` elements offset by half the duration and');
out.push('crossfade. A hard cut is visible on fast motion and invisible on drifting dust.');
out.push('');
out.push('**Sizes.** The PWA precaches what it ships, so keep the whole video set under');
out.push('roughly 15 MB. Ambient at 720p, overlays at 480p, beats at 360p. WebM/VP9 first');
out.push('with an MP4/H.264 fallback for Safari. Short beats can be 12 fps without');
out.push('anyone noticing, and hand-painted animation looks *better* at a lower rate.');
out.push('');
out.push('**Portrait.** The game is mobile-first. The six ambient backgrounds want a 9:16');
out.push('variant as well as 16:9; everything else can be centre-safe 16:9.');
out.push('');
out.push('**Order of work.** If credits run short, tiers 1 and 2 alone (20 clips) carry');
out.push('the whole feel of the game. Tier 5 is the least missed.');
out.push('');

for (const tier of [1, 2, 3, 4, 5] as Tier[]) {
  const group = clips.filter((c) => c.tier === tier);
  const secs = group.reduce((s, c) => s + Number(c.secs), 0);
  out.push('---');
  out.push('');
  out.push(`## Tier ${tier} — ${TIER_NAME[tier]}`);
  out.push('');
  out.push(`${group.length} clips, ${secs}s of footage.`);
  out.push('');
  for (const c of group) {
    out.push(`### \`${c.id}\``);
    out.push('');
    out.push(`**Where:** ${c.where}  `);
    out.push(`**Length:** ${c.secs}s · ${c.loop ? 'LOOPS' : 'one-shot'} · composite \`${c.comp}\``);
    out.push('');
    out.push('```');
    const ground =
      c.comp === 'screen' ? ' Entirely on a pure black background, nothing but the effect itself.'
      : c.comp === 'multiply' ? ' Entirely on a flat white background, nothing but the effect itself.'
      : '';
    out.push(`${STYLE} ${c.body}${ground} ${MOTION}`);
    out.push('```');
    out.push('');
  }
}

const total = clips.reduce((s, c) => s + Number(c.secs), 0);
out.push('---');
out.push('');
out.push(`**Totals.** ${clips.length} clips, ${total}s of footage, ` +
  `${clips.filter((c) => c.loop).length} of them loops.`);
out.push('');

fs.writeFileSync('docs/video-prompts.md', out.join('\n'));
// eslint-disable-next-line no-console
console.log(
  `docs/video-prompts.md written: ${clips.length} clips, ${total}s total, ` +
    `${clips.filter((c) => c.loop).length} loops`,
);
