# ADR-0004: Basemap tile source

- **Status:** Proposed (open — decide during M1)
- **Date:** 2026-11-23

## Context

MapLibre needs a basemap (land, coastlines, terrain). Modern features (roads, railways, city names) would break the Sengoku atmosphere, so we want a minimal or heavily restyled base. It should be free and need no backend.

## Options considered

1. **No tiles — Japan outline as GeoJSON only** — simplest, smallest, fully "period" look. No terrain detail; zooming in shows nothing but our own layers.
2. **Protomaps PMTiles (self-hosted file)** — one static file covering Japan, hosted next to the app; full styling control, no API key. Need to generate/download the extract (size depends on max zoom).
3. **OpenFreeMap / other free public vector tiles** — zero setup, but depend on a third party's uptime and terms; include modern features we'd need to hide.
4. **Commercial tiles (MapTiler, Stadia)** — reliable, free tier, but needs an API key and has usage limits.

## Decision

Not decided. Suggested path: start with **option 1** in M1 (fast, no dependencies), move to **option 2** if terrain/hillshade is wanted in M8.

## Consequences

To be written when the decision is made.
