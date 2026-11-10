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

## Metric definitions and data window

The current aggregate snapshot covers listening events from **27 January 2016 through 17 May 2026**. Year charts group events by UTC calendar year, which makes 2026 a partial year. The snapshot was generated on 8 November 2026.

- **Listening hours** sum logged music-play duration after the archive is prepared, convert milliseconds to hours, then round displayed annual values independently to one decimal place. The visible year bars can therefore differ slightly from the all-time total.
- **Artist and track counts** use the canonical identities in the prepared aggregate. Distinct Spotify recording IDs and grouping by track, artist, and album can give different counts for reissues, alternate versions, and collaborations.
- **Artist discovery** counts an artist as new in the first year they appear in this archive and returning in a later year where they appear again. It means first observed in this export, not first ever listened to.
- **Genre trends** use artist-level enrichment because genres are not part of the listening event records. Tags can overlap, so genre shares are not mutually exclusive.
- **Featured tracks** are narrative highlights from the aggregate snapshot. They are presented without rank or per-track hour claims because the ranking lineage is not included in this public repository.

Only aggregate values are shipped to the public site. Raw listening events and credentials stay local. Run the consistency checks against the included aggregate snapshot with:

```sh
python3 scripts/validate_snapshot.py
```

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
