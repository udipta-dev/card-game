# Kurukshetra — a Mahabharata card battler

A Gwent-like card game built on the lore of the Mahabharata. Base power (1–10,
mapped to the canon *rathi / atirathi / maharathi* ranks) is only a starting
number — **astras, curses, and boons decide the outcome**. A raw-10 Arjuna played
naked loses to a weaker board with the right vow.

Best of three rounds, first to two. Highest total board power wins a round.
Deploy warriors across the three Chaturanga rows (Ratha / Gaja / Padati), loose
divine astras, and turn fate with curses and boons. Quickplay vs an AI today; an
18-Day narrative Campaign is planned.

## Run it

```bash
npm install
npm run dev        # play at http://localhost:5173/card-game/
npm test           # engine unit tests + 1000-match AI-vs-AI fuzz
npm run build      # production build (static, PWA) into dist/
npm run preview    # serve the production build
```

Installable as an app (PWA, offline-capable). Deploys as a static site to GitHub
Pages — the workflow in `.github/workflows/deploy.yml` builds, tests, and
publishes `dist/` on push to `main`.

## How it's built

The engine is **pure and data-driven** — no React, no DOM, no network — so it is
fully unit-testable and the AI simulates through the exact same `reduce()` the
player uses. Card behaviour is **data**, not code: each card is a bundle of
serializable effect descriptors (`{on, condition, target, actions}`) plus keyword
tags, resolved by a small set of tested handlers. Every marquee card (Bhishma's
*icchamrityu*, Karna's chariot-wheel curse, Drona's deception, Nagastra vs
Krishna, Brahmastra's collateral, Pashupatastra's self-ban) is expressed this way
— there are **no card-specific branches in the engine**. The one mechanism behind
all the "you can't remove me (yet)" cards is an interceptable `onDestroyAttempt`.

```
src/
  engine/     pure rules engine — types, reducer, events, effects, keywords, rounds, ai-facing selectors
  content/    data-driven card definitions + decks + a validateContent guard
  ai/         heuristic opponent: one-ply search over reduce() + a pass/bank policy
  ui/         React presentation — card frame (art is a swappable slot), board, match view
  app/        menu + app shell
tests/engine/ vitest — one file per concern, incl. a seeded self-play fuzz invariant
```

### Art

Cards render with a typographic/house-colour/glyph design system today. `Card.art`
is a swappable field: drop an illustration into `public/art/cards/` and set
`art` on the card definition — no code changes.

## Design notes

- Going second carries a slight edge (a Gwent-style "coin" asymmetry) — a
  first-player compensation is a known tuning item, not shipped in the MVP.
- Faction expansion (Deva / Asura-Daitya / Rishi, cross-epic canon), PvP, and the
  Campaign are additive on top of the same engine.
