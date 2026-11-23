# Roadmap — Sengoku Castle Map

A frontend-only web app showing a map of 戦国時代 Japan where users can find and select castles.

- **Scope:** frontend only. No backend; all data is static files bundled or served alongside the app.
- **Decisions:** recorded as ADRs in [`docs/adr/`](adr/README.md). Steps that depend on an undecided ADR are marked 🔸.
- **How to use:** each step is small (roughly ≤ half a day) and has a clear "done when". Tick the box when it's merged.

---

## M0 — Foundations

Goal: an empty but deployable project, with key decisions written down.

- [x] Review and accept/reject ADRs 0002–0007
- [x] `git init`, add `.gitignore`, first commit
- [x] Scaffold Vite + React + TypeScript (`npm create vite@latest`) — *done when* `npm run dev` shows the starter page
- [x] Add Prettier, `npm run format:check` passes (ESLint dropped)
- [ ] *(deferred)* Add Vitest with one trivial test — *done when* `npm test` passes
- [x] Add Tailwind — *done when* a utility class visibly styles the page
- [x] Set up folder layout: `src/map/`, `src/features/`, `src/data/`, `public/data/`
- [ ] *(deferred)* CI (GitHub Actions): format check + test + build on every push (the deploy workflow only builds `master`)
- [x] Deploy the app to GitHub Pages (ADR-0008) — *done when* a public URL loads

## M1 — Map shell

Goal: a full-screen, pannable, zoomable map of Japan.

- [x] 🔸 Choose the basemap source (ADR-0004)
- [x] Install `maplibre-gl` + `react-map-gl`; render a full-screen map
- [x] Set initial view on Japan; restrict panning (map centre stays near Japan) and min/max zoom
- [x] Add navigation controls (zoom buttons, compass reset)
- [x] Make the layout responsive (map fills viewport on desktop and phone)
- [x] Add attribution for the map data
- *Milestone done when:* the deployed URL shows Japan and you can pan and zoom smoothly on desktop and mobile.

## M2 — Castles on the map

Goal: castles appear as points and can be selected.

- [x] Define the `Castle` TypeScript type and GeoJSON schema (id, name_ja, name_en, reading, former_names, lat/lng, province, built, abandoned, owners, type 山城/平山城/平城/館)
- [x] Create `public/data/castles.geojson` with ~10 famous castles (安土, 大坂, 小田原, 春日山, 姫路, 岐阜, 躑躅ヶ崎館, 清洲, 岡崎, 江戸)
- [x] Add a schema-check script (Zod) that fails on bad data: `npm run data:check` (add to CI later)
- [x] Load the GeoJSON and render it as a circle layer
- [x] Hover: cursor change + tooltip showing the castle name
- [x] Click: store `selectedCastleId` in Zustand; highlight the selected marker
- [x] Click on empty map clears the selection
- [ ] *(deferred with Vitest)* Unit test: data loader + selection store
- *Milestone done when:* clicking any of the 10 castles highlights it, and clicking elsewhere deselects.

## M3 — Castle detail panel & shareable state

Goal: selecting a castle shows its details, and the selection can be shared as a link.

- [x] Side panel (desktop) / bottom sheet (mobile) showing the selected castle
- [x] Fields: names, reading, former names, type, built/abandoned years, province, short description
- [x] "Fly to" animation when a castle is selected
- [x] Close button + `Esc` key closes the panel
- [x] Sync selection to the URL (`?castle=azuchi`); opening the URL restores it
- [x] Browser back/forward moves through selection history
- [ ] *(deferred with Vitest)* Component tests for the panel
- *Milestone done when:* sharing a URL opens the app with the same castle selected and the panel open.

## M4 — Provinces (令制国) and clans

Goal: historical context on the map.

- [x] 🔸 Find a licensed source for 令制国 boundary data (ADR-0005); record the source and licence in `docs/data-sources.md`
- [x] Simplify the polygons (mapshaper) to keep the file small (target < 500 KB; result 110 KB)
- [x] Render province borders + labels
- [x] Add `clans.json` (id, name, colour, one-kanji mark; 家紋 icon later)
- [x] Fill in `owners` for castles; colour markers by clan (in 1583, until the timeline in M5)
- [x] Legend showing clan colours
- [x] Layer toggle: provinces on/off, clan colours on/off
- *Milestone done when:* provinces are visible and castles are coloured by their owning clan.

## M5 — Timeline

Goal: see how the map changes from 1467 to 1615.

- [ ] Check that `owners` covers 1467–1615 for every castle (the schema is already in place, ADR-0005); fill the gaps listed in `docs/data-sources.md`
- [x] Choose colours for more clans: each has its own, from a palette of 160 (`scripts/clan-palette.json`)
- [x] Switch between 1553 (just before the first 川中島), 1560 (just before 桶狭間), 1583, 1600 (just before 関ヶ原) and 1614 (just before 大坂冬の陣), in the URL as `?year=1600`; castles not built yet are dotted circles, abandoned ones ✕; the slider will replace the switch
- [ ] Year slider UI (1467–1615) stored in Zustand + URL (`?year=1560`)
- [x] Show a castle's former name in the years it was used (大坂城 is 石山御坊 in 1553 and 1560), in the panel, tooltip and list
- [ ] Filter castles by year (exists between `built` and `abandoned`)
- [ ] Colour castles by their owner in the selected year
- [ ] Optional: colour provinces by their dominant clan
- [ ] Play/pause button to animate through the years
- [ ] Highlight key events (桶狭間 1560, 本能寺 1582, 関ヶ原 1600) on the slider
- *Milestone done when:* moving the slider visibly changes which castles exist and who owns them.

## M6 — Search & filters

Goal: find castles quickly.

- [x] Search box with fuzzy match on kanji, kana reading, and romaji
- [x] Selecting a result flies to and selects the castle
- [ ] Filter by castle type, clan, province
- [ ] Marker clustering at low zoom (needed once the dataset grows)
- [x] Keyboard navigation for search results
- *Milestone done when:* typing "おだわら" or "odawara" finds 小田原城.

## M7 — Data growth

Goal: move from 10 to hundreds of castles without breaking anything.

- [ ] Write `docs/data-sources.md` (sources, licences, how to add a castle)
- [ ] Add castles in batches (e.g., by region), each batch validated by CI
- [ ] Measure load time; split or lazy-load data if `castles.geojson` > 1 MB
- [ ] Add images (public-domain/CC only) with credit lines
- *Milestone done when:* 200+ castles load in under 2 s on a mid-range phone over 4G.

## M8 — Sengoku look & polish

Goal: it looks and feels like the Sengoku era, and works for everyone.

- [ ] Custom map style: washi-paper background, muted terrain, sumi-ink borders
- [x] Castle icons by type (山城 / 平山城 / 平城, and 館) instead of circles; castles not standing in the year shown keep the dotted circle or ✕
- [ ] i18n: Japanese / English toggle
- [x] Castle list: all castles in a list; choosing one selects it on the map. A button at the bottom left shows and hides the list — *done when* every castle can be chosen from the list by mouse, touch and keyboard, and the button works on desktop and phone
- [x] Link to Google Maps in the detail panel, built from the castle's coordinates (no API key) — *done when* every castle's link opens Google Maps at its location in a new tab
- [x] Link to Wikipedia in the detail panel; store each castle's article title in `castles.geojson` (Japanese article; add English with the toggle) — *done when* every castle's link opens the right article in a new tab
- [ ] Accessibility: keyboard selection of castles, screen-reader labels, contrast check
- [ ] Lighthouse score ≥ 90 for performance and accessibility
- [ ] E2E tests (Playwright): select castle, share URL, timeline, search

## M9 — v1.0 release

- [x] About dialog (概要, bottom left) with data credits, licences and a link to GitHub
- [ ] Error boundary + "data failed to load" state
- [ ] Tag `v1.0.0`, write release notes

---

## Later / ideas (not planned)

- Battles and campaign routes as animated lines
- Daimyō profiles and clan family trees
- 家紋 icons for clans
- Backend: API for data, user favourites, contributions (would need new ADRs)
