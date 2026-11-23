# ADR-0006: Client state with Zustand, shareable state in the URL

- **Status:** Proposed
- **Date:** 2026-11-23

## Context

Several parts of the UI share state: selected castle, current year, filters, layer toggles. Some of it (selected castle, year) should be shareable as a link and work with the browser back button.

## Options considered

1. **Zustand + URL query params** — tiny, no boilerplate, works outside React components (useful for map event handlers).
2. **React Context + useReducer** — no dependency, but causes broad re-renders and gets verbose.
3. **Redux Toolkit** — powerful but heavy for this size of app.
4. **URL only** — simple, but awkward for transient state (hover, panel animation).

## Decision

Use Zustand for app state. Sync `castle`, `year`, and active filters to URL query params.

## Consequences

- Links like `?castle=azuchi&year=1575` reproduce a view exactly.
- Need a small sync layer between the store and the URL (and tests for it).
