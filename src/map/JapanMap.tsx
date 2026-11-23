import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { TransformConstrainFunction } from 'maplibre-gl'
import { Map, NavigationControl } from 'react-map-gl/maplibre'
import { mapStyle } from './mapStyle'

/** Kyushu to Hokkaido: what the first view shows. [west, south, east, north] */
const MAIN_ISLANDS: [number, number, number, number] = [128.5, 30, 146, 45.7]

/** The map centre must stay inside this box, so you can't drift far from Japan. */
const CENTER_LIMITS = { west: 123, south: 24, east: 146, north: 45.7 }

const MIN_ZOOM = 3
const MAX_ZOOM = 12

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

// Used instead of maxBounds, which limits the viewport's edges: on tall phone
// screens those limits have to be so loose that they do nothing on desktop.
const constrainToJapan: TransformConstrainFunction = (lngLat, zoom) => {
  const { west, south, east, north } = CENTER_LIMITS
  const center = lngLat.wrap() // a copy
  center.lng = clamp(center.lng, west, east)
  center.lat = clamp(center.lat, south, north)
  return { center, zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM) }
}

const LOCALE = {
  'Map.Title': '日本地図',
  'NavigationControl.ZoomIn': '拡大',
  'NavigationControl.ZoomOut': '縮小',
  'NavigationControl.ResetBearing': '北を上に戻す',
  'AttributionControl.ToggleAttribution': '出典を表示',
}

export function JapanMap() {
  return (
    <Map
      workerUrl={workerUrl}
      mapStyle={mapStyle}
      initialViewState={{
        bounds: MAIN_ISLANDS,
        fitBoundsOptions: { padding: 24 },
      }}
      transformConstrain={constrainToJapan}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      maxPitch={0}
      renderWorldCopies={false}
      locale={LOCALE}
    >
      <NavigationControl position="top-right" />
    </Map>
  )
}
