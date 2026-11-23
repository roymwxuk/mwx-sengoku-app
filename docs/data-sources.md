# Data sources

| File | Source | Licence | How to rebuild |
|---|---|---|---|
| `public/data/basemap.geojson` | [Natural Earth](https://www.naturalearthdata.com/) v5.1.2, 1:10m: Japan (`ne_10m_admin_0_countries`) and Lake Biwa (`ne_10m_lakes`) | Public domain; credit not required, but shown on the map | `npm run data:basemap` |
| `public/data/castles.geojson` | Coordinates: [Wikidata](https://www.wikidata.org/) (P625). Names, types and dates: facts from [Japanese Wikipedia](https://ja.wikipedia.org/) infoboxes and articles, compared with Wikidata. Retrieved 2026-11-23 | Wikidata: CC0. Wikipedia: CC BY-SA 4.0 (facts only, no text copied) | Edited by hand; check with `npm run data:check` |
| `public/data/provinces.geojson` | 『旧国・旧郡境界データセット』（CODH作成）「幕末明治地勢地図境界データ」（人間文化研究機構作成）を加工, [doi:10.20676/00000454](https://geoshape.ex.nii.ac.jp/kg/). Retrieved 2026-11-23. Merged, simplified and clipped | **CC BY-NC 4.0: credit required, non-commercial only** (ADR-0009) | `npm run data:provinces` |
| `public/data/clans.json` | Written for this project | — | Edited by hand; check with `npm run data:check` |

## Notes on castle data

- Descriptions are original Japanese text written from the same sources; English is planned with the language toggle (M8).
- Dates are ranges where sources disagree (see ADR-0005). For example, 岐阜城 was abandoned in 1600 or 1601.
- 春日山城: the source only says 南北朝時代, so `built` is 1336–1392.
- 岐阜城: 1201 is the traditional date of the first fort (砦) on the site.
- 躑躅ヶ崎館: Wikipedia classes its structure as 連郭式平城; we use 館.
- 吉田郡山城: the source says the construction date is unknown, so `built` is null (Wikidata gives 1336). `abandoned` is 1591–1600: the Mōri moved to 広島城 in 1591, and other accounts say about 1600. It was demolished after 1615.
- 府内城 and 八王子城: added 2026-11-23 from infobox facts supplied by the project owner, with owners and descriptions from the Japanese Wikipedia articles. 府内城: the article's lead says 平山城, but its infobox and overview say 平城. 八王子城: `built` is 1587 as supplied; the article says 氏照 began it in 1571, or more likely 1578, and made it his base in 1587.
- 姫路城 and 江戸城: `abandoned` is null. Wikidata gives 1869 as the end date for 江戸城, when it became the imperial residence.
- Provinces (令制国) were filled in from general knowledge where the source didn't state them.

## Notes on castle owners

- Owners come from the same Japanese Wikipedia articles. `from` and `to` are years; in a year of change, the later owner counts.
- Retainers' castles are listed under the ruling house where the article treats them so (e.g., 甲斐 under 河尻秀隆 is 織田氏). 織田氏 at 清洲城 covers both the 守護代 family and 信長's; 松平氏 is listed as 徳川氏, and 長尾氏 as 上杉氏.
- 小田原城: the Hōjō took it between 1495 and 1501; 1501 is used.
- 春日山城: 上杉氏 (with 長尾氏) is listed from 1392, the end of its construction range.
- 吉田郡山城: 毛利氏 is listed from 1467, the start of the app's period; they held it earlier.
- 江戸城: the article's infobox gives 太田氏 for 1561–1577; we list 後北条氏 throughout 1524–1590. Needs checking.
- 大坂城: the Okudaira (松平忠明) years, 1615–1619, are left out.
- 府内城: 福原氏 lost it in 1599 and 竹中氏 in 1634 (both years from general knowledge); owners after 1634 are left out.
- Known gaps: 岐阜城 before 1533; 岡崎城 before 1531, and Imagawa control around 1550–1560; 躑躅ヶ崎館 after 1590.
- From general knowledge: 大久保氏 at 小田原城 from 1590; that 田中氏 left 岡崎城 in 1601; and clan readings and English names.
