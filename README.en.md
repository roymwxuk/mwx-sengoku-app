# 戦国城地図 — Sengoku Castle Map

[日本語](README.md) | **English**

An interactive map of 戦国時代 Japan for finding and exploring castles.

**Live site: <https://roymwxuk.github.io/mwx-sengoku-app/>**

[![The app showing central Japan in 1553, with 室町御所 in the detail panel](docs/app-screenshot.png)](https://roymwxuk.github.io/mwx-sengoku-app/)

Links can open a castle directly, e.g. [吉田郡山城](https://roymwxuk.github.io/mwx-sengoku-app/?castle=yoshida-koriyama).

## Current status

_As of 2026-11-23._ The map, castles, detail panel, castle list and search work, with 65 castles. The interface is in Japanese.

| Milestone                        | Status                                      |
| -------------------------------- | ------------------------------------------- |
| M0 Foundations                   | Done, except deferred items                 |
| M1 Map of Japan                  | Done                                        |
| M2 Castles on the map            | Done, except deferred items                 |
| M3 Detail panel, shareable links | Done, except deferred items                 |
| M4 Provinces (令制国) and clans  | Done                                        |
| M5 Timeline 1467–1615            | In progress: 1553–1600 switch done          |
| M6 Search and filters            | In progress: search done                    |
| M7 Data growth                   | In progress: 65 castles                     |
| M8 Sengoku look and polish       | In progress: castle list, links, icons done |
| M9 v1.0 release                  | In progress: about dialog done              |

Deferred for now: unit and component tests (Vitest), and CI checks. See the [roadmap](docs/ROADMAP.md) for details.

### What works today

- Pan and zoom a map of Japan on desktop and phone
- Hover over a castle for its name; click or tap it for details
- Tell a castle's type (山城, 平山城, 平城 or 館) from the shape of its icon
- See province borders and names, and who held each castle in 1553 (just before 川中島), 1560 (just before 桶狭間), 1583 or 1600 (just before 関ヶ原); both can be turned off (凡例, top right)
- Search for a castle in kanji, kana or romaji (城を検索), by current or former name; small typos are fine
- See a castle under its former name in the years it was used (大坂城 is 石山御坊 in 1560)
- Choose a castle from the list (城一覧, bottom left) by mouse, touch or keyboard
- Open a castle's place in Google Maps, its Wikipedia article, or its official site
- See credits, licences and a link to GitHub (概要, bottom left)
- Share a castle as a link, and step through castles with back and forward

### Known limits

- The coastline is modern and simplified, so it looks angular up close
- No terrain yet, and clan colours show 1553, 1560, 1583 and 1600 only
- Province borders are late-Edo
- Castle data still needs a historical review; see [data sources](docs/data-sources.md)

## Development

Vite, React, TypeScript, Tailwind CSS, MapLibre GL JS and Zustand. There is no backend; all data is static files. The deploy build uses Node.js 24.

```sh
npm ci
npm run dev
```

| Command                  | What it does                               |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | Start the dev server                       |
| `npm run build`          | Type-check and build for production        |
| `npm run preview`        | Serve the production build locally         |
| `npm run format`         | Format the code with Prettier              |
| `npm run format:check`   | Check the formatting                       |
| `npm run data:check`     | Validate the castle and clan data          |
| `npm run data:basemap`   | Rebuild the map outline from Natural Earth |
| `npm run data:provinces` | Rebuild the province borders from CODH     |

Every push to `master` is published to GitHub Pages.

## Licence

- **Code:** [MIT](LICENSE)
- **Data:** each file has its own licence; see [`public/data/LICENSE.md`](public/data/LICENSE.md)

The province borders (`public/data/provinces.geojson`) are CC BY-NC 4.0, so **the app with this data may not be used commercially**: 『旧国・旧郡境界データセット』（CODH作成）「幕末明治地勢地図境界データ」（人間文化研究機構作成）を加工.

## Docs

- [Roadmap](docs/ROADMAP.md)
- [Architecture decisions](docs/adr/README.md)
- [Data sources and licences](docs/data-sources.md)
