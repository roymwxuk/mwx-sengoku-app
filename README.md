# 戦国城地図 — Sengoku Castle Map

An interactive map of 戦国時代 Japan for finding and exploring castles.

**Live site: <https://roymwxuk.github.io/mwx-sengoku-app/>**

Links can open a castle directly, e.g. [吉田郡山城](https://roymwxuk.github.io/mwx-sengoku-app/?castle=yoshida-koriyama).

## Current status

_As of 2026-11-23._ The map, castles, detail panel and castle list work, with 11 castles. The interface is in Japanese.

| Milestone                        | Status                        |
| -------------------------------- | ----------------------------- |
| M0 Foundations                   | Done, except deferred items   |
| M1 Map of Japan                  | Done                          |
| M2 Castles on the map            | Done, except deferred items   |
| M3 Detail panel, shareable links | Done, except deferred items   |
| M4 Provinces (令制国) and clans  | Not started                   |
| M5 Timeline 1467–1615            | Not started                   |
| M6 Search and filters            | Not started                   |
| M7 Data growth                   | Not started                   |
| M8 Sengoku look and polish       | In progress: castle list done |
| M9 v1.0 release                  | Not started                   |

Deferred for now: unit and component tests (Vitest), and CI checks. See the [roadmap](docs/ROADMAP.md) for details.

### What works today

- Pan and zoom a map of Japan on desktop and phone
- Hover over a castle for its name; click or tap it for details
- Choose a castle from the list (城一覧, bottom left) by mouse, touch or keyboard
- Share a castle as a link, and step through castles with back and forward

### Known limits

- The coastline is modern and simplified, so it looks angular up close
- No terrain, province borders or clan colours yet
- Castle data still needs a historical review; see [data sources](docs/data-sources.md)

## Development

Vite, React, TypeScript, Tailwind CSS, MapLibre GL JS and Zustand. There is no backend; all data is static files. The deploy build uses Node.js 24.

```sh
npm ci
npm run dev
```

| Command                | What it does                               |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the dev server                       |
| `npm run build`        | Type-check and build for production        |
| `npm run preview`      | Serve the production build locally         |
| `npm run format`       | Format the code with Prettier              |
| `npm run format:check` | Check the formatting                       |
| `npm run data:check`   | Validate `public/data/castles.geojson`     |
| `npm run data:basemap` | Rebuild the map outline from Natural Earth |

Every push to `master` is published to GitHub Pages.

## Docs

- [Roadmap](docs/ROADMAP.md)
- [Architecture decisions](docs/adr/README.md)
- [Data sources and licences](docs/data-sources.md)
