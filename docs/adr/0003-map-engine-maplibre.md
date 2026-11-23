# ADR-0003: Use MapLibre GL JS as the map engine

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

The core feature is a map of Japan where users select castles. Castles have real locations. We also want province polygons, clan colouring, clustering, a timeline, and eventually a custom "Sengoku" visual style.

## Options considered

1. **MapLibre GL JS (+ `react-map-gl`)** — open source, WebGL vector rendering, smooth zoom, built-in click/hover on layers, clustering, data-driven styling (colour by clan/year), fully custom styles. No API key required.
2. **Leaflet** — simple and well known, but raster/DOM-based; slower with thousands of markers and harder to style deeply.
3. **Mapbox GL JS** — similar to MapLibre but requires a paid token and has a restrictive licence.
4. **Custom SVG + d3-geo / PixiJS (illustrated game-style map)** — total artistic control, but we'd build zoom, hit-testing, clustering and labels ourselves.

## Decision

Use MapLibre GL JS via `react-map-gl` for a geographically accurate map, with a custom style to give it a Sengoku look.

## Consequences

- Castle positions are real latitude/longitude, so data from public sources can be used directly.
- Clan colours and timeline filters can be done with MapLibre style expressions instead of re-rendering React.
- Purely illustrated, game-like art is harder; if we later want that, write a new ADR (option 4).
- Requires WebGL (supported by all modern browsers).
