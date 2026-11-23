# ADR-0009: Province boundaries from CODH (CC BY-NC)

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

M4 shows 令制国 borders and names. ADR-0005 requires a licensed source.

## Options considered

1. **CODH 『旧国・旧郡境界データセット』** — late-Edo province borders as GeoJSON, ready to use, carefully made. CC BY-NC 4.0: credit required, no commercial use without permission from 人間文化研究機構.
2. **MLIT 国土数値情報 行政区域 1920** — commercial use allowed (商用可), but has districts, not provinces: every district would have to be assigned to a province by hand, and 1920 borders differ in places.
3. **CODH 『幕末期近世村領域データセット』** — CC BY-SA 4.0. Built from modern farm settlements, so borders may differ from the period; its page offers no direct download.
4. **Others** — an ESRI-sourced shapefile (restricted), and Harvard's Japan HGIS (terms not confirmed).

## Decision

Use option 1. `scripts/build-provinces.mjs` merges the Meiji-era divisions back to 陸奥, 出羽 and 蝦夷地, simplifies the borders, clips them to the basemap's coastline, and writes `public/data/provinces.geojson`.

## Consequences

- The app may not be used commercially (e.g., ads or sales) while it includes this file, unless permission is obtained.
- The required credit is shown in the legend, with a short one on the map.
- The data is one file behind one layer, so switching to option 2 later is contained.
- Borders are late-Edo, not Sengoku; some moved between the two. Only inner borders are kept, not province areas.
- `mapshaper` runs through `npx` when rebuilding, so it isn't a dependency.
