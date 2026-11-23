// Validates public/data/castles.geojson. Run with: npm run data:check
import { readFile } from 'node:fs/promises'
import { z } from 'zod'
import { castleCollection } from '../src/data/castleSchema.ts'

const file =
  process.argv[2] ?? new URL('../public/data/castles.geojson', import.meta.url)
const result = castleCollection.safeParse(
  JSON.parse(await readFile(file, 'utf8')),
)

if (result.success) {
  console.log(`castles.geojson: ${result.data.features.length} castles, valid`)
} else {
  console.error(`castles.geojson is invalid:\n${z.prettifyError(result.error)}`)
  process.exitCode = 1
}
