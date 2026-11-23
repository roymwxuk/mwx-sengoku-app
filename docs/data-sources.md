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
- 岡城: the one in 豊後; its id is `bungo-oka`, as other castles share the name. 1185 is the traditional date. The article also gives a 1334 expansion by 志賀貞朝, but 『豊後国志』 puts the 志賀氏 in 直入郡 only from 1369. The official site is from Wikidata.
- 観音寺城: `built` is 1335–1487: 『太平記』 has a fort there in 1335, and the infobox gives 応仁・文明年間 (1467–1487). Wikidata's 1468 falls within that.
- 小谷城: `built` is 1516–1525: 『浅井三代記』 gives 1516, the article prefers 1523–1524, and it stood by 1525. Wikidata only says the 1520s.
- 佐倉城: `built` is 1532–1610: the infobox suggests 天文年間, but that work was left unfinished, and the article also mentions a 後北条氏 castle of 1585. 土井利勝 began the present castle in 1610. `abandoned` is the infobox's 1873, when the buildings were cleared for the army.
- 弘前城: 高岡城 is the former name until 1628. `abandoned` is the infobox's 1871, though the article says it was probably treated as kept in 1873, and the keep survives.
- 竹田城: the one in 但馬 (たけだ), not 豊後竹田城 (たけた), which is 岡城. `built` is 1431–1443: the infobox gives 1431, and the article's text and Wikidata 1443, both traditional. Coordinates are from the Japanese Wikipedia article, as Wikidata's are given to about 1 km. The official site is the one in both the article and Wikidata.
- 伊賀上野城: the article is 上野城. `built` is 1585–1596: 筒井定次 arrived in 1585, and 『伊水温故』 says it was finished in 文禄年間 (1592–1596). 仁木氏's residence and 滝川雄利's fort stood on the site before. Its official site is http only, so it isn't listed.
- 高遠城: `built` is null, as the article doesn't give it; 1547 is the Takeda rebuilding, per 『甲陽軍鑑』.
- 鹿児島城: `built` is 1601–1604, begun to finished; the infobox gives 1602. 上山城 stood on the hill behind it before. The article is flagged as needing more citations. `abandoned` is the infobox's 1872.
- 甲府城: `built` is 1583–1585: 家康 is said to have planned it in 1583, and 『甲斐国志』 gives 1585. Most building came later.
- 一乗谷城: part of the article 一乗谷朝倉氏遺跡. `built` is 1336–1392 because the source only says 南北朝時代. Wikidata's coordinates are for the site as a whole, to about 1 km.
- 韮山城: the construction date is uncertain. `built` is 1469–1500: 『北条五代記』 says it was begun in 文明年間 (1469–1486), and it was complete by about 1500.
- 松山城: the one in 伊予; its id is `iyo-matsuyama`, as other castles share the name. The official site was supplied by the project owner.
- 二条城: the Tokugawa castle, which still stands, not the earlier castles of that name (足利, 織田 and 豊臣). `built` is 1601–1603; `abandoned` is null, as it was kept in 1873.
- 和歌山城: Wikidata's coordinates are given to about 1 km.
- 高松城: the one in 讃岐; its id is `sanuki-takamatsu`, as other castles share the name. `built` is 1588 (begun) to 1590 (finished). Wikidata's coordinates are given to about 1 km.
- 湯築城: coordinates are from the Japanese Wikipedia article, which are more precise than Wikidata's.
- 姫路城 and 江戸城: `abandoned` is null. Wikidata gives 1869 as the end date for 江戸城, when it became the imperial residence.
- Provinces (令制国) were filled in from general knowledge where the source didn't state them.

## Notes on castle owners

- Owners come from the same Japanese Wikipedia articles. `from` and `to` are years; in a year of change, the view decides: 1583 shows the last owner; 1560 and 1600 show the first, just before 桶狭間 and 関ヶ原.
- Retainers' castles are listed under the ruling house where the article treats them so (e.g., 甲斐 under 河尻秀隆 is 織田氏). 織田氏 at 清洲城 covers both the 守護代 family and 信長's; 松平氏 is listed as 徳川氏, and 長尾氏 as 上杉氏.
- 小田原城: the Hōjō took it between 1495 and 1501; 1501 is used.
- 春日山城: 上杉氏 (with 長尾氏) is listed from 1392, the end of its construction range.
- 吉田郡山城: 毛利氏 is listed from 1467, the start of the app's period (they held it earlier), to 1600, the end of its abandonment range: they held 安芸 until 関ヶ原, though their base moved to 広島城 in 1591.
- 江戸城: the article's infobox gives 太田氏 for 1561–1577; we list 後北条氏 throughout 1524–1590. Needs checking.
- 大坂城: the Okudaira (松平忠明) years, 1615–1619, are left out.
- 府内城: 福原氏 lost it in 1599 and 竹中氏 in 1634 (both years from general knowledge); owners after 1634 are left out.
- 岡城: 志賀氏 is listed from 1467, the start of the app's period (they were retainers of 大友氏), to 1593. The year 1871 for 中川氏 is from the article 岡藩.
- 観音寺城: 六角氏 is listed throughout 1467–1568, although it fell to 京極氏 briefly in 1468 and was given up to the shogun's armies in 1489 and 1491. Possible 織田氏 use after 1568 is left out.
- 小谷城: 浅井氏 is listed from 1525, the end of its construction range; 亮政 fled it for a time in 1538. 豊臣氏 in 1573–1575 is 羽柴秀吉, before he moved to 長浜城. 浅井氏 is marked 井, as 浅野氏 has 浅. The reading あざい is from general knowledge (also あさい).
- 新田金山城: 横瀬氏, who took the name 由良 in 1565, are listed as 由良氏 from 1528. They surrendered to 後北条氏 in 1584 and left in 1585.
- 佐倉城: 千葉氏 is listed from 1555, the end of 天文年間, though the castle was unfinished. Owners in 1590–1610 are left out: the holders of 佐倉 in those years are given in the article 佐倉藩, and they may have used 本佐倉城. Owners after 1633 (the year is from 佐倉藩) are left out.
- 竹田城: 太田垣氏, retainers of 山名氏, are listed from 1443, the end of its construction range. 荻野直正 held it briefly in 1575, left out. 豊臣氏 in 1577–1579 and 1580–1585 is 羽柴秀長, then 桑山重晴. 赤松氏 from 1585 is 赤松広秀 (斎村政広).
- 伊賀上野城: 新庄氏 took it briefly in 1600, left out. Both castellans and lords in 1608–1871 were 藤堂氏; the year 1871 is the infobox's end of the castle.
- 高遠城: 高遠氏 is listed from 1541, the article's first date. 織田氏 in 1582 is uncertain, as the article says its lord then is unknown; 後北条氏's brief hold that year is left out. 保科氏 in 1582–1590 served 徳川氏 (from late 1582). From general knowledge: 1590, when 保科氏 left for 下総; 京極氏 in 1593–1600 (高知, based at 飯田城). 毛利秀頼 in 1590–1593, not of the 毛利氏 of 安芸, is left out, as are owners after 1636 (a year from the article 高遠藩).
- 鹿児島城: the year 1871 for 島津氏 is 廃藩置県.
- 甲府城: 加藤氏 (1591–1593) and the year 1593 for 浅野氏 are from general knowledge. 徳川氏 covers 義直 and direct rule; owners after 1616 are left out.
- 一乗谷城: 朝倉氏 is listed from 1392, the end of its construction range. 織田氏 in 1573–1574 is 桂田長俊, 信長's governor (from general knowledge).
- 韮山城: 後北条氏 is listed from 1491, following the article (伊勢盛時). 徳川氏 in 1590–1601 is 家康's retainer 内藤信成.
- 加藤氏 at 甲府城 (光泰) and 松山城 (嘉明) are different families.
- 松山城: owners after 1627 are left out.
- 岡崎城: 今川氏 is listed from 1549, when 松平広忠 died, to 1560. They ruled through castellans; recent research sees the young 竹千代 (家康) as the formal lord.
- 姫路城 in 1560: 黒田氏 were retainers of 小寺氏.
- 和歌山城: 豊臣氏 in 1585–1600 covers 秀長 and the castellans 桑山重晴 and 一晴. 浅野氏 arrived after 関ヶ原.
- 高松城: owners after 1639 are left out.
- 湯築城: 河野氏 is listed throughout 1335–1585, although the castle changed hands at times in the 14th century.
- Known gaps: 岐阜城 before 1533; 岡崎城 before 1531; 躑躅ヶ崎館 after 1590.
- From general knowledge: 大久保氏 at 小田原城 from 1590; that 田中氏 left 岡崎城 in 1601; and clan readings and English names.
