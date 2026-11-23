# ADR-0010: Draw map labels with local fonts

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

Province names and clan marks are the first text on the map. MapLibre normally loads glyphs from a server, which ADR-0004 avoided.

## Options considered

1. **Local fonts** — without a `glyphs` URL, MapLibre draws all text with fonts on the viewer's device. No downloads.
2. **Self-hosted glyph files** — the same look everywhere, but Japanese glyph sets are large.
3. **HTML markers** — full CSS control, but no collision handling, and slow for many labels.

## Decision

Use option 1, with the font list `MAP_FONT` in `src/map/mapStyle.ts`.

## Consequences

- No extra files, and any characters work, including for the English toggle (M8).
- Labels look slightly different between devices. A web font for headings (M8) won't change map labels unless it is also loaded for the map.
