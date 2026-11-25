import type { Castle } from '../../data/castleSchema'
import type { YearView } from '../years/yearViews'

export type CastleName = Pick<Castle, 'name_ja' | 'reading' | 'name_en'>

/**
 * What the castle was called in the year shown. Former names without an end
 * date are never chosen. If several fit, the first one listed is.
 */
export function nameIn({ year, at }: YearView, castle: Castle): CastleName {
  if (castle.built && year < castle.built.earliest) return castle
  const former = castle.former_names.find(
    ({ until }) =>
      until !== null && (at === 'end' ? year < until : year <= until),
  )
  return former ?? castle
}
