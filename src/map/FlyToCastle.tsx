import { useEffect, type RefObject } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import type { CastleFeature } from '../data/castleSchema'

const CLOSE_UP_ZOOM = 7

interface Props {
  castle: CastleFeature
  panelRef: RefObject<HTMLElement | null>
}

/** Flies to the castle, centring it in the part of the map not under the panel. */
export function FlyToCastle({ castle, panelRef }: Props) {
  const { current: map } = useMap()

  useEffect(() => {
    if (!map) return
    map.flyTo({
      center: castle.geometry.coordinates,
      zoom: Math.max(map.getZoom(), CLOSE_UP_ZOOM),
      offset: offsetFor(panelRef.current, map.getContainer()),
    })
  }, [map, castle, panelRef])

  return null
}

function offsetFor(
  panel: HTMLElement | null,
  container: HTMLElement,
): [number, number] {
  if (!panel) return [0, 0]
  const isSheet = panel.offsetWidth >= container.clientWidth
  return isSheet ? [0, -panel.offsetHeight / 2] : [panel.offsetWidth / 2, 0]
}
