import type { StyleSpecification } from 'maplibre-gl'

// Keep in sync with the theme tokens in src/index.css (ADR-0007).
const SEA = '#dae3df'
export const WASHI = '#faf6ea'
export const SUMI = '#2b2622'
export const SHU = '#9b2d1f'

// Fonts on the viewer's device: without a glyph server, MapLibre draws text
// with these (ADR-0010). Keep in sync with --font-serif in src/index.css.
export const MAP_FONT = [
  'Hiragino Mincho ProN',
  'Yu Mincho',
  'Noto Serif JP',
  'serif',
]

// The title in brush strokes, in the Sea of Japan. The image is 4:1; keep the
// corners so on the map (Web Mercator), or it will look stretched.
const LOGO = { west: 129, east: 137.4, north: 40.502, south: 38.886 }

export const mapStyle: StyleSpecification = {
  version: 8,
  sources: {
    basemap: {
      type: 'geojson',
      data: `${import.meta.env.BASE_URL}data/basemap.geojson`,
      attribution:
        '<a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Made with Natural Earth</a>',
    },
    logo: {
      type: 'image',
      url: `${import.meta.env.BASE_URL}logo.webp`,
      coordinates: [
        [LOGO.west, LOGO.north],
        [LOGO.east, LOGO.north],
        [LOGO.east, LOGO.south],
        [LOGO.west, LOGO.south],
      ],
    },
  },
  layers: [
    { id: 'sea', type: 'background', paint: { 'background-color': SEA } },
    {
      id: 'logo', // under the land
      type: 'raster',
      source: 'logo',
      paint: { 'raster-opacity': 0.85, 'raster-fade-duration': 0 },
    },
    {
      id: 'land',
      type: 'fill',
      source: 'basemap',
      filter: ['==', ['get', 'kind'], 'land'],
      paint: { 'fill-color': WASHI },
    },
    {
      id: 'lake',
      type: 'fill',
      source: 'basemap',
      filter: ['==', ['get', 'kind'], 'lake'],
      paint: { 'fill-color': SEA },
    },
    {
      id: 'shoreline',
      type: 'line',
      source: 'basemap',
      layout: { 'line-join': 'round' },
      paint: {
        'line-color': SUMI,
        'line-opacity': 0.6,
        'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.6, 10, 1.6],
      },
    },
  ],
}
