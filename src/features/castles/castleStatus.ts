import type { Castle, CastleCollection } from '../../data/castleSchema'

export type CastleStatus = 'planned' | 'standing' | 'ruin'

function statusIn(castle: Castle, year: number): CastleStatus {
  if (castle.built && year < castle.built.earliest) return 'planned'
  if (castle.abandoned && castle.abandoned.latest < year) return 'ruin'
  return 'standing'
}

/** castle id -> whether it's not built yet, standing or abandoned */
export type Statuses = ReadonlyMap<string, CastleStatus>

export function statusesIn(year: number, castles: CastleCollection): Statuses {
  return new Map(
    castles.features.map(({ properties }) => [
      properties.id,
      statusIn(properties, year),
    ]),
  )
}

export function idsWith(status: CastleStatus, statuses: Statuses): string[] {
  return [...statuses].filter(([, s]) => s === status).map(([id]) => id)
}
