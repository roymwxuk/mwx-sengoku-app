import type { Castle, CastleCollection } from '../../data/castleSchema'
import type { Clan } from '../../data/clanSchema'
import type { YearView } from '../years/yearViews'

/** castle id -> the clan that held it */
export type Ownership = ReadonlyMap<string, Clan>

function ownerIdIn(castle: Castle, { year, at }: YearView): string | undefined {
  const owners = castle.owners.filter(
    ({ from, to, after_honnoji }) =>
      from <= year &&
      (to === null || year <= to) &&
      !(at === 'honnoji' && after_honnoji),
  )
  return owners.at(at === 'start' ? 0 : -1)?.clan
}

export function ownershipIn(
  view: YearView,
  castles: CastleCollection,
  clans: Clan[],
): Ownership {
  const ownership = new Map<string, Clan>()
  for (const { properties: castle } of castles.features) {
    const ownerId = ownerIdIn(castle, view)
    const clan = clans.find((c) => c.id === ownerId)
    if (clan) ownership.set(castle.id, clan)
  }
  return ownership
}
