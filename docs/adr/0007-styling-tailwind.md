# ADR-0007: Styling with Tailwind CSS

- **Status:** Proposed
- **Date:** 2026-11-23

## Context

The UI around the map (panel, search, slider, legend) needs to be built quickly and work on desktop and mobile. A custom Sengoku visual theme is planned for later (M8).

## Options considered

1. **Tailwind CSS** — fast to build with, responsive utilities, theme tokens (colours, fonts) in one place.
2. **CSS Modules** — plain CSS, scoped; more files and slower to iterate.
3. **Component library (MUI, Mantine)** — ready-made components, but a strong look of its own that fights a custom Japanese aesthetic.

## Decision

Use Tailwind CSS, with Sengoku theme colours and fonts defined as theme tokens. Use headless components (e.g., Radix) where accessible primitives (dialog, slider) are needed.

## Consequences

- Quick iteration and consistent spacing/colours.
- Map styling is separate (MapLibre style JSON), so theme colours must be kept in sync between Tailwind tokens and the map style.
