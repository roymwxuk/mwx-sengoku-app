# Data sources

| File | Source | Licence | How to rebuild |
|---|---|---|---|
| `public/data/basemap.geojson` | [Natural Earth](https://www.naturalearthdata.com/) v5.1.2, 1:10m: Japan (`ne_10m_admin_0_countries`) and Lake Biwa (`ne_10m_lakes`) | Public domain; credit not required, but shown on the map | `npm run data:basemap` |
| `public/data/castles.geojson` | Coordinates: [Wikidata](https://www.wikidata.org/) (P625). Names, types and dates: facts from [Japanese Wikipedia](https://ja.wikipedia.org/) infoboxes and articles, compared with Wikidata. Retrieved 2026-11-23 | Wikidata: CC0. Wikipedia: CC BY-SA 4.0 (facts only, no text copied) | Edited by hand; check with `npm run data:check` |

## Notes on castle data

- Descriptions are original Japanese text written from the same sources; English is planned with the language toggle (M8).
- Dates are ranges where sources disagree (see ADR-0005). For example, 岐阜城 was abandoned in 1600 or 1601.
- 春日山城: the source only says 南北朝時代, so `built` is 1336–1392.
- 岐阜城: 1201 is the traditional date of the first fort (砦) on the site.
- 躑躅ヶ崎館: Wikipedia classes its structure as 連郭式平城; we use 館.
- 吉田郡山城: the source says the construction date is unknown, so `built` is null (Wikidata gives 1336). `abandoned` is 1591–1600: the Mōri moved to 広島城 in 1591, and other accounts say about 1600. It was demolished after 1615.
- 姫路城 and 江戸城: `abandoned` is null. Wikidata gives 1869 as the end date for 江戸城, when it became the imperial residence.
- Provinces (令制国) were filled in from general knowledge where the source didn't state them.
