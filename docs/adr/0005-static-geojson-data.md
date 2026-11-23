# ADR-0005: Store castle and province data as static GeoJSON

- **Status:** Proposed
- **Date:** 2026-11-23

## Context

There is no backend. Data includes castles (points), 令制国 provinces (polygons), and clans (metadata). The data needs to be easy to edit by hand, reviewable in git, and loadable directly by MapLibre.

## Options considered

1. **Static GeoJSON / JSON in `public/data/`** — MapLibre reads GeoJSON natively; diffs are readable in git; easy to validate.
2. **Data embedded in TypeScript modules** — type-checked, but bundled into the JS (bigger initial load) and awkward to edit for non-developers.
3. **Spreadsheet / CSV converted at build time** — nice for bulk editing, but adds a build step; can be added later as a source for option 1.
4. **SQLite / a hosted API** — needs a backend or WASM runtime; out of scope.

## Decision

Keep data as static files in `public/data/`: `castles.geojson`, `provinces.geojson`, `clans.json`. Define the schema in TypeScript with Zod and validate it in CI.

## Consequences

- Data loads lazily over HTTP and is cached by the browser.
- A future backend can serve the same shapes, so the frontend barely changes.
- Large datasets may need splitting or vector tiles (revisit in M7).
- Data sources and licences must be tracked in `docs/data-sources.md`, especially for province boundaries.
