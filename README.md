# Malique Spooner Wrapped

Source for the Spotify listening story at **https://maliquespooner.com/wrapped/**.

The site is a Next.js static export mounted at `/wrapped` and served by the Malique Spooner domain.

## Run locally

```sh
cd frontend
npm ci
npm run dev
```

Create the static export with:

```sh
npm run build
```

The public-facing aggregate snapshot used by the site is included. Raw Spotify exports, row-level listening history, credentials, and local generated datasets are not part of this repository.

## Spotify connection

The live library view uses Spotify Authorization Code with PKCE. It requests read-only scopes for saved tracks and albums, private playlists, and currently playing status. Tokens are kept in the connecting browser's local storage; use **Disconnect Spotify** in the page to clear them. Each visitor must connect their own Spotify account, and Spotify development-mode apps only permit accounts enabled in Spotify Developer Dashboard.

The production callback is `https://maliquespooner.com/wrapped/` and is registered on the existing Spotify app. The static frontend is served by a path-scoped Cloudflare Worker so the root portfolio and other routes remain on the existing Worker.

## Deploy to the Wrapped route

```sh
cd frontend
npm ci
npm run build
npm run prepare:cloudflare
cd ..
npx wrangler whoami
npx wrangler deploy
```

The deploy preparation step places the export under the actual `/wrapped` directory so Cloudflare serves the page and its Next.js route assets at their public URLs. The Worker routes remain limited to `/wrapped`, leaving the rest of `maliquespooner.com` untouched.
