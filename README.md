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
