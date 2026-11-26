// Writes sitemap.xml into the build, listing the map, each year and each clan
// in the years it held castles. Run by npm run build, after vite build.
import { readFile, writeFile } from 'node:fs/promises'
import { castleCollection, type Castle } from '../src/data/castleSchema.ts'
import { clanList } from '../src/data/clanSchema.ts'
import {
  DEFAULT_VIEW,
  YEAR_VIEWS,
  type YearView,
} from '../src/features/years/yearViews.ts'

const SITE = 'https://roymwxuk.github.io/mwx-sengoku-app/'
const outDir = process.argv[2] ?? 'dist'

const read = async (name: string) =>
  JSON.parse(await readFile(`public/data/${name}`, 'utf8')) as unknown
const castles = castleCollection.parse(await read('castles.geojson'))
const clans = clanList.parse(await read('clans.json'))

// As ownerIdIn in src/features/clans/ownership.ts, which Node can't import.
function ownerIdIn(castle: Castle, { year, at }: YearView) {
  const owners = castle.owners.filter(
    ({ from, to, after_honnoji }) =>
      from <= year &&
      (to === null || year <= to) &&
      !(at === 'honnoji' && after_honnoji),
  )
  return owners.at(at === 'start' ? 0 : -1)?.clan
}

// The same URLs the app writes: ?year= is left out for the default year.
const urlFor = (year: number | null, clan: string | null) => {
  const params = new URLSearchParams()
  if (year !== null) params.set('year', String(year))
  if (clan !== null) params.set('clan', clan)
  const query = params.toString()
  return query ? `${SITE}?${query}` : SITE
}

const urls = [SITE]
for (const view of YEAR_VIEWS) {
  const year = view === DEFAULT_VIEW ? null : view.year
  if (year !== null) urls.push(urlFor(year, null))
  const held = new Set(
    castles.features.map(({ properties }) => ownerIdIn(properties, view)),
  )
  // In clans.json order, so the file only changes where the data does.
  for (const clan of clans) {
    if (held.has(clan.id)) urls.push(urlFor(year, clan.id))
  }
}

const escape = (s: string) => s.replaceAll('&', '&amp;')
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${escape(u)}</loc></url>`).join('\n')}
</urlset>
`
await writeFile(`${outDir}/sitemap.xml`, xml)
console.log(`sitemap: ${urls.length} URLs`)
