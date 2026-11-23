import type { MapLayerMouseEvent } from 'react-map-gl/maplibre'
import type { CastleCollection, CastleFeature } from '../../data/castleSchema'

/**
 * The castle closest to the pointer, among those whose hit area it touches.
 * Hit areas overlap when zoomed out, so "the topmost one" would be arbitrary.
 */
export function nearestCastle(
  event: MapLayerMouseEvent,
  castles: CastleCollection,
): CastleFeature | null {
  const hitIds = new Set(event.features?.map((f) => f.properties.id))
  let nearest: CastleFeature | null = null
  let nearestDistance = Infinity

  for (const castle of castles.features) {
    if (!hitIds.has(castle.properties.id)) continue
    const point = event.target.project(castle.geometry.coordinates)
    const distance = point.dist(event.point)
    if (distance < nearestDistance) {
      nearest = castle
      nearestDistance = distance
    }
  }
  return nearest
}
