import type { Castle, CastleCollection } from '../../data/castleSchema'
import { foldJapanese, foldRomaji } from './foldText'
import { typoDistance } from './typoDistance'

type Name = Pick<Castle, 'name_ja' | 'reading' | 'name_en'>

/** A folded spelling. `base` is the part before じょう, Castle etc. */
interface Term {
  full: string
  base: string
}

interface IndexedName {
  name_ja: string
  japanese: Term[]
  romaji: Term[]
}

interface IndexedCastle {
  castle: Castle
  /** The current name, then former names */
  names: IndexedName[]
}

export type SearchIndex = IndexedCastle[]

export interface SearchResult {
  castle: Castle
  /** Set if the castle was found by this former name */
  formerName: string | null
}

const READING_SUFFIX = /(じょう|やかた)$/
const ENGLISH_SUFFIX = / (Castle|Residence)$/
const ROMAJI_SUFFIX: Record<string, string> = { じょう: 'jo', やかた: 'yakata' }

// What people type after the name, once folded
const JAPANESE_QUERY_SUFFIX = /(城|館|じょ|やかた)$/
const ROMAJI_QUERY_SUFFIX = new RegExp(
  `(${['jo', 'yakata', 'castle', 'residence'].map(foldRomaji).join('|')})$`,
)

function indexName({ name_ja, reading, name_en }: Name): IndexedName {
  const kanji = foldJapanese(name_ja)
  const readingSuffix = READING_SUFFIX.exec(reading)?.[0] ?? ''
  const readingBase = reading.slice(0, reading.length - readingSuffix.length)
  const english = name_en.replace(ENGLISH_SUFFIX, '')
  const base = foldRomaji(english)
  return {
    name_ja,
    japanese: [
      // Not split: typing only 城 finds every castle.
      { full: kanji, base: kanji },
      { full: foldJapanese(reading), base: foldJapanese(readingBase) },
    ],
    romaji: [
      { full: foldRomaji(name_en), base },
      {
        full: foldRomaji(english + (ROMAJI_SUFFIX[readingSuffix] ?? '')),
        base,
      },
    ],
  }
}

export function buildIndex(castles: CastleCollection): SearchIndex {
  return castles.features.map(({ properties: castle }) => ({
    castle,
    names: [castle, ...castle.former_names].map(indexName),
  }))
}

/** Lower is better; null is no match. */
type Score = (term: Term) => number | null

/** A match must start before the suffix, or "jo" would find every castle. */
const containing =
  (query: string): Score =>
  ({ full, base }) => {
    const at = full.indexOf(query)
    if (at < 0 || at >= base.length) return null
    if (at > 0) return 2
    return query.length >= base.length ? 0 : 1
  }

const resembling =
  (query: string, allowed: number): Score =>
  ({ base }) => {
    const typos = typoDistance(query, base)
    return typos <= allowed ? typos : null
  }

/** Short words are one typo away from too many others. */
function allowedTypos(length: number, isRomaji: boolean): number {
  if (length < (isRomaji ? 5 : 4)) return 0
  return length < 8 ? 1 : 2
}

function findAll(
  index: SearchIndex,
  isRomaji: boolean,
  scoreOf: Score,
): SearchResult[] {
  const found: (SearchResult & { score: number })[] = []
  for (const { castle, names } of index) {
    let best = Infinity
    let formerName: string | null = null
    for (const [i, name] of names.entries()) {
      for (const term of isRomaji ? name.romaji : name.japanese) {
        const score = scoreOf(term)
        if (score === null || score >= best) continue
        best = score
        formerName = i > 0 ? name.name_ja : null
      }
    }
    if (best < Infinity) found.push({ castle, formerName, score: best })
  }
  return found.sort(
    (a, b) =>
      a.score - b.score ||
      a.castle.reading.localeCompare(b.castle.reading, 'ja'),
  )
}

/** Best matches first. Allows typos only if nothing matches without them. */
export function searchCastles(
  input: string,
  index: SearchIndex,
): SearchResult[] {
  // A Japanese input method shows おだw on the way to おだわ.
  const typed = input
    .normalize('NFKC')
    .replace(/(?<=[\p{Script=Hiragana}\p{Script=Katakana}ー])[a-z]+$/iu, '')
  const isRomaji =
    !/[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u.test(typed)
  const query = isRomaji ? foldRomaji(typed) : foldJapanese(typed)
  if (!query) return []

  const matches = findAll(index, isRomaji, containing(query))
  if (matches.length > 0) return matches

  const base = query.replace(
    isRomaji ? ROMAJI_QUERY_SUFFIX : JAPANESE_QUERY_SUFFIX,
    '',
  )
  const allowed = allowedTypos(base.length, isRomaji)
  return allowed > 0 ? findAll(index, isRomaji, resembling(base, allowed)) : []
}
