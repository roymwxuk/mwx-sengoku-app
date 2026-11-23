# ADR-0002: Frontend-only static SPA (Vite + React + TypeScript)

- **Status:** Proposed
- **Date:** 2026-11-23

## Context

The project is frontend only for now. It needs an interactive map, a detail panel, a timeline, and search. It should deploy as static files and be easy to add a backend to later.

## Options considered

1. **Vite + React + TypeScript** — biggest ecosystem of map wrappers (`react-map-gl`), many examples; fast dev server; static build.
2. **Next.js** — good, but its server features (SSR, API routes) aren't needed yet and add complexity.
3. **Vite + Svelte/SvelteKit** — smaller bundles and simpler code, but fewer map integrations and examples.
4. **Plain TypeScript, no framework** — lightest, but the panel, search, and timeline UI would become hard to manage.

## Decision

Build a single-page app with Vite, React and TypeScript, deployed as static files.

## Consequences

- Hosting is free or cheap (Vercel, Netlify, GitHub Pages).
- No SSR, so SEO for individual castle pages is limited. Acceptable for v1; revisit if SEO matters.
- A future backend can be added as a separate service the SPA calls, without restructuring the frontend.
