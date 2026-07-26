# Deploying

The repo builds for two hosts without any manual editing. `vite.config.ts` picks
the base path from the `CF_PAGES` environment variable, which Cloudflare sets
during its build and GitHub does not:

| Host | URL shape | base |
| --- | --- | --- |
| GitHub Pages (project site) | `https://user.github.io/card-game/` | `/card-game/` |
| Cloudflare Pages | `https://<project>.pages.dev/` | `/` |

Get this wrong and every asset 404s, which is the single most common way a
working build looks broken after a host change.

## Cloudflare Pages, keeping the repo private

GitHub Pages will not serve a **private** repo unless the account has GitHub
Pro. Cloudflare Pages will, on its free tier, which is why the project moves
there when the source goes private.

Do this **before** flipping the repo to private, so there is never a window
with no live site.

1. Sign in at <https://dash.cloudflare.com> and go to **Workers & Pages** ->
   **Create** -> **Pages** -> **Connect to Git**.
2. Authorise GitHub for the **udipta-dev** account and pick `card-game`.
   Cloudflare keeps working after the repo goes private, because the
   authorisation is per-account, not per-visibility.
3. Build settings:

   | Setting | Value |
   | --- | --- |
   | Framework preset | None |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Node version | 20 or newer (set `NODE_VERSION=20` under Variables if it defaults lower) |

4. Deploy, then open the `*.pages.dev` URL and confirm the game loads, the
   Codex opens, and a battle starts. If assets 404, `CF_PAGES` was not set and
   the base path is wrong.
5. Only once that is green: GitHub -> Settings -> General -> Danger Zone ->
   **Change visibility** -> Private.
6. Push any commit and confirm Cloudflare rebuilds from the private repo.

No client-side routing is used (screens are state, not routes), so no
`_redirects` file is needed.

## What going private does and does not do

It hides the **source**: no readable code, no commit history, no design docs,
no card data anyone can fork in a click.

It does **not** stop anyone copying the game. The built JavaScript is served
publicly to every visitor, and can be downloaded and re-hosted. Minification is
not protection. For a fully client-side game the practical moat is the content
and the rate of iteration, not the secrecy of the bundle.

## GitHub Pages (current, while the repo is public)

`.github/workflows/deploy.yml` runs on every push to `main`: it installs, runs
the tests, builds, and publishes `dist` to Pages. Keep it after the Cloudflare
move and both hosts stay in sync; delete it if the Pages site is retired.
