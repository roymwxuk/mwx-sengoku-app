import type { CastleCollection } from '../../data/castleSchema'
import type { Ownership } from './ownership'

/**
 * The castles the clan holds in the year shown, and the selected castle, so
 * that the one in the detail panel is always on the map.
 */
export function filterByClan(
  castles: CastleCollection,
  clanId: string | null,
  ownership: Ownership,
  selectedId: string | null,
): CastleCollection {
  if (!clanId) return castles
  return {
    ...castles,
    features: castles.features.filter(
      ({ properties: { id } }) =>
        ownership.get(id)?.id === clanId || id === selectedId,
    ),
  }
}
