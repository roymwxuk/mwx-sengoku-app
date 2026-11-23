// Builds public/data/provinces.geojson: 令制国 borders and label points.
// Run with: npm run data:provinces (after data:basemap)
//
// Source: 『旧国・旧郡境界データセット』（CODH作成）「幕末明治地勢地図境界データ」
// （人間文化研究機構作成）を加工. doi:10.20676/00000454, CC BY-NC 4.0.
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

// Run through npx: it's large, and only needed to rebuild this file.
const MAPSHAPER = 'mapshaper@0.8.7'

const SOURCE = 'https://geoshape.ex.nii.ac.jp/kg/geojson'
const BASEMAP = new URL('../public/data/basemap.geojson', import.meta.url)
const OUTPUT = new URL('../public/data/provinces.geojson', import.meta.url)
const COUNT = 85

// The source has the Meiji-era divisions. Merge them back to the older ones.
const MERGED = [
  { from: 27, to: 31, name_ja: '陸奥', reading: 'むつ' },
  { from: 32, to: 33, name_ja: '出羽', reading: 'でわ' },
  { from: 75, to: 85, name_ja: '蝦夷地', reading: 'えぞち' },
]
// Old character forms in the source.
const RENAMED = { 對馬: '対馬' }

async function loadProvince(number) {
  const id = `K${String(number).padStart(2, '0')}`
  const response = await fetch(`${SOURCE}/${id}.geojson`)
  if (!response.ok) throw new Error(`${id}: HTTP ${response.status}`)
  const merged = MERGED.find((m) => number >= m.from && number <= m.to)
  const { features } = await response.json()
  return features.map(({ geometry, properties }) => ({
    type: 'Feature',
    properties: {
      name_ja: merged?.name_ja ?? RENAMED[properties.name] ?? properties.name,
      reading: merged?.reading ?? properties.yomi,
    },
    geometry,
  }))
}

const features = []
for (let number = 1; number <= COUNT; number++) {
  features.push(...(await loadProvince(number)))
  await sleep(300) // be gentle with the server
}

const basemap = JSON.parse(await readFile(BASEMAP, 'utf8'))
const land = basemap.features.filter((f) => f.properties.kind === 'land')

const collection = (list) =>
  JSON.stringify({ type: 'FeatureCollection', features: list })

const dir = await mkdtemp(join(tmpdir(), 'provinces-'))
try {
  await writeFile(join(dir, 'provinces.json'), collection(features))
  await writeFile(join(dir, 'land.json'), collection(land))

  const commands = [
    ['-i', 'provinces.json', 'snap', 'snap-interval=0.0005'],
    ['-clean'],
    ['-dissolve', 'name_ja', 'copy-fields=reading'],
    ['-simplify', 'weighted', 'interval=400', 'keep-shapes'],
    ['-clean'],
    ['-clip', 'land.json'], // same coastline as the basemap
    ['-each', 'kind = "label"'],
    ['-points', 'inner', '+', 'name=labels'],
    ['-target', 'provinces'],
    ['-innerlines'],
    ['-dissolve'],
    ['-each', 'kind = "border"'],
    ['-o', 'out.json', 'target=provinces,labels', 'combine-layers'],
    ['force', 'precision=0.0001', 'format=geojson'],
  ]
  execFileSync('npx', ['--yes', MAPSHAPER, ...commands.flat()], {
    cwd: dir,
    stdio: 'inherit',
  })

  const json = await readFile(join(dir, 'out.json'), 'utf8')
  await writeFile(OUTPUT, json)
  console.log(`Wrote provinces.geojson (${Math.round(json.length / 1024)} KB)`)
} finally {
  await rm(dir, { recursive: true })
}
