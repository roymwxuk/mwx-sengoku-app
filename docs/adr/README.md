# Architecture Decision Records

We record significant decisions as ADRs, using the [Michael Nygard format](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions).

- One file per decision: `NNNN-short-title.md`, numbered in order.
- Copy [`template.md`](template.md) to start a new one.
- Status is one of: **Proposed** → **Accepted** / **Rejected**, later **Deprecated** or **Superseded by ADR-NNNN**.
- Don't rewrite accepted ADRs. If a decision changes, write a new ADR that supersedes the old one, and update the old one's status line.

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](0002-frontend-only-static-spa.md) | Frontend-only static SPA (Vite + React + TypeScript) | Accepted |
| [0003](0003-map-engine-maplibre.md) | Use MapLibre GL JS as the map engine | Accepted |
| [0004](0004-basemap-source.md) | Basemap tile source | Accepted |
| [0005](0005-static-geojson-data.md) | Store castle and province data as static GeoJSON | Accepted |
| [0006](0006-state-zustand-and-url.md) | Client state with Zustand, shareable state in the URL | Accepted |
| [0007](0007-styling-tailwind.md) | Styling with Tailwind CSS | Accepted |
| [0008](0008-hosting-github-pages.md) | Host on GitHub Pages | Accepted |
