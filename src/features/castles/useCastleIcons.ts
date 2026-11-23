import { useEffect, useState } from 'react'
import { useMap } from 'react-map-gl/maplibre'
import { ICON_PIXEL_RATIO, renderIcon } from './castleIcons'

/**
 * Draws castle icons when the map first needs them, as they vary by type and
 * clan colour. True once layers can use them.
 */
export function useCastleIcons(): boolean {
  const { current: mapRef } = useMap()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!mapRef) return
    const map = mapRef.getMap()
    map.setMissingStyleImageResolver((name) => {
      const icon = renderIcon(name)
      if (icon) map.addImage(name, icon, { pixelRatio: ICON_PIXEL_RATIO })
    })
    setReady(true)
  }, [mapRef])

  return ready
}
