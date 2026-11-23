// Builds public/data/basemap.geojson from Natural Earth (public domain).
// Run with: npm run data:basemap
import { writeFile } from 'node:fs/promises'

const VERSION = 'v5.1.2'
const BASE = `https://raw.githubusercontent.com/nvkelso/natural-earth-vector/${VERSION}/geojson`
const OUTPUT = new URL('../public/data/basemap.geojson', import.meta.url)
const DECIMALS = 4 // about 10 m, finer than the source data

async function load(name) {
  const response = await fetch(`${BASE}/${name}.geojson`)
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
  return (await response.json()).features
}

function find(features, test, label) {
  const matches = features.filter((f) => f.geometry && test(f.properties))
  if (matches.length !== 1) {
    throw new Error(`${label}: expected 1 feature, found ${matches.length}`)
  }
  return matches[0]
}

function round(coordinates) {
  return typeof coordinates === 'number'
    ? Number(coordinates.toFixed(DECIMALS))
    : coordinates.map(round)
}

function feature(kind, { geometry }) {
  return {
    type: 'Feature',
    properties: { kind },
    geometry: { type: geometry.type, coordinates: round(geometry.coordinates) },
  }
}

const [countries, lakes] = await Promise.all([
  load('ne_10m_admin_0_countries'),
  load('ne_10m_lakes'),
])

const basemap = {
  type: 'FeatureCollection',
  features: [
    feature(
      'land',
      find(countries, (p) => p.ADM0_A3 === 'JPN', 'Japan'),
    ),
    feature(
      'lake',
      find(lakes, (p) => p.name?.startsWith('Biwa'), 'Lake Biwa'),
    ),
  ],
}

const json = JSON.stringify(basemap) + '\n'
await writeFile(OUTPUT, json)
console.log(`Wrote basemap.geojson (${Math.round(json.length / 1024)} KB)`)
