// Validates the files in public/data/. Run with: npm run data:check
import { access, readFile } from 'node:fs/promises'
import { z } from 'zod'
import { castleCollection } from '../src/data/castleSchema.ts'
import { clanList } from '../src/data/clanSchema.ts'
import palette from './clan-palette.json' with { type: 'json' }

const directory = process.argv[2] ?? 'public/data'
const problems: string[] = []

async function load(name: string): Promise<unknown> {
  return JSON.parse(await readFile(`${directory}/${name}`, 'utf8'))
}

async function check<T>(name: string, schema: z.ZodType<T>) {
  const result = schema.safeParse(await load(name))
  if (result.success) return result.data
  problems.push(`${name}:\n${z.prettifyError(result.error)}`)
  return null
}

const provinceLabels = z.object({
  features: z.array(
    z.object({
      properties: z.discriminatedUnion('kind', [
        z.object({ kind: z.literal('border') }),
        z.object({
          kind: z.literal('label'),
          name_ja: z.string().min(1),
          reading: z.string().regex(/^[ぁ-んー]+$/, 'must be hiragana'),
        }),
      ]),
    }),
  ),
})

const castles = await check('castles.geojson', castleCollection)
const clans = await check('clans.json', clanList)
const provinces = await check('provinces.geojson', provinceLabels)

if (clans) {
  const used = new Set(clans.map((c) => c.color))
  const unused = palette.filter((color) => !used.has(color))
  for (const clan of clans) {
    if (!palette.includes(clan.color)) {
      problems.push(
        `clan "${clan.id}": ${clan.color} is not in clan-palette.json; unused: ${unused.join(', ')}`,
      )
    }
  }
}

if (castles && clans && provinces) {
  const clanIds = new Set(clans.map((c) => c.id))
  const provinceNames = new Set(
    provinces.features.flatMap(({ properties }) =>
      properties.kind === 'label' ? [properties.name_ja] : [],
    ),
  )
  for (const { properties: castle } of castles.features) {
    for (const { clan } of castle.owners) {
      if (!clanIds.has(clan)) {
        problems.push(`castle "${castle.id}": unknown clan "${clan}"`)
      }
    }
    if (!provinceNames.has(castle.province)) {
      problems.push(
        `castle "${castle.id}": unknown province "${castle.province}"`,
      )
    }
    if (castle.image) {
      await access(`${directory}/../image/${castle.image}`).catch(() =>
        problems.push(`castle "${castle.id}": no image "${castle.image}"`),
      )
    }
  }
}

if (problems.length > 0) {
  console.error(problems.join('\n'))
  process.exitCode = 1
} else {
  console.log(
    `data: ${castles?.features.length} castles, ${clans?.length} clans, valid`,
  )
}
