import type { Castle, CastleCollection } from '../../data/castleSchema'
import type { Clan } from '../../data/clanSchema'

/** The year shown until the timeline exists (M5). Most castles existed then. */
export const REFERENCE_YEAR = 1583

/** castle id -> the clan that held it */
export type Ownership = ReadonlyMap<string, Clan>

function ownerIdIn(castle: Castle, year: number): string | undefined {
  return castle.owners.findLast(
    ({ from, to }) => from <= year && (to === null || year <= to),
  )?.clan
}

export function ownershipIn(
  year: number,
  castles: CastleCollection,
  clans: Clan[],
): Ownership {
  const ownership = new Map<string, Clan>()
  for (const { properties: castle } of castles.features) {
    const ownerId = ownerIdIn(castle, year)
    const clan = clans.find((c) => c.id === ownerId)
    if (clan) ownership.set(castle.id, clan)
  }
  return ownership
}
