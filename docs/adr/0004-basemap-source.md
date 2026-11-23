# ADR-0004: Basemap tile source

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

MapLibre needs a basemap (land, coastlines, terrain). Modern features (roads, railways, city names) would break the Sengoku atmosphere, so we want a minimal or heavily restyled base. It should be free and need no backend.

## Options considered

1. **No tiles — Japan outline as GeoJSON only** — simplest, smallest, fully "period" look. No terrain detail; zooming in shows nothing but our own layers.
2. **Protomaps PMTiles (self-hosted file)** — one static file covering Japan, hosted next to the app; full styling control, no API key. Need to generate/download the extract (size depends on max zoom).
3. **OpenFreeMap / other free public vector tiles** — zero setup, but depend on a third party's uptime and terms; include modern features we'd need to hide.
4. **Commercial tiles (MapTiler, Stadia)** — reliable, free tier, but needs an API key and has usage limits.

## Decision

Use **option 1**: no tiles, only a Japan outline and Lake Biwa as GeoJSON, taken from Natural Earth 1:10m (public domain). If terrain or hillshade is wanted in M8, write a new ADR for **option 2**.

## Consequences

- No API key, tile server or third-party uptime to depend on; the file is about 130 KB.
- `scripts/build-basemap.mjs` rebuilds the file from a pinned Natural Earth version (`npm run data:basemap`).
- The coastline looks angular when zoomed in, and small islands and inlets are simplified. Maximum zoom is limited to 12.
- The coastline is modern: reclaimed land (e.g., Osaka Bay, Edo) differs from the Sengoku period.
- Only land that Natural Earth assigns to Japan is drawn, so neighbouring countries and the Kuril Islands appear as sea.
- No glyph source is configured, so the map can't show text labels yet. Decide on one before adding labels (province labels in M4).
