import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { TransformConstrainFunction } from 'maplibre-gl'
import { useState, type RefObject } from 'react'
import {
  Map,
  NavigationControl,
  type MapLayerMouseEvent,
} from 'react-map-gl/maplibre'
import type { CastleCollection, CastleFeature } from '../data/castleSchema'
import {
  CASTLE_HIT_LAYER,
  CastleLayers,
} from '../features/castles/CastleLayers'
import type { Statuses } from '../features/castles/castleStatus'
import { CastleTooltip } from '../features/castles/CastleTooltip'
import { nearestCastle } from '../features/castles/nearestCastle'
import type { Ownership } from '../features/clans/ownership'
import { ProvinceLayers } from '../features/layers/ProvinceLayers'
import { useLayers } from '../features/layers/layerStore'
import { useSelection } from '../features/castles/selectionStore'
import type { YearView } from '../features/years/yearViews'
import { FitToClan } from './FitToClan'
import { FlyToCastle } from './FlyToCastle'
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

interface Props {
  /** Those to show. null while loading */
  castles: CastleCollection | null
  view: YearView
  ownership: Ownership
  statuses: Statuses
  selected: CastleFeature | null
  panelRef: RefObject<HTMLElement | null>
  legendRef: RefObject<HTMLElement | null>
  bottomBarRef: RefObject<HTMLElement | null>
}

export function JapanMap({
  castles,
  view,
  ownership,
  statuses,
  selected,
  panelRef,
  legendRef,
  bottomBarRef,
}: Props) {
  const [hovered, setHovered] = useState<CastleFeature | null>(null)
  const showProvinces = useLayers((s) => s.provinces)
  const showClans = useLayers((s) => s.clanColors)
  const selectCastle = useSelection((s) => s.selectCastle)

  const castleAt = (event: MapLayerMouseEvent) =>
    castles && nearestCastle(event, castles)

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
      interactiveLayerIds={[CASTLE_HIT_LAYER]}
      cursor={hovered ? 'pointer' : undefined}
      onMouseMove={(event) => setHovered(castleAt(event))}
      onMouseOut={() => setHovered(null)}
      onMoveStart={() => setHovered(null)}
      onClick={(event) => selectCastle(castleAt(event)?.properties.id ?? null)}
    >
      <ProvinceLayers visible={showProvinces} />
      {castles && (
        <CastleLayers
          castles={castles}
          ownership={showClans ? ownership : null}
          statuses={statuses}
          hoveredId={hovered?.properties.id ?? null}
          selectedId={selected?.properties.id ?? null}
        />
      )}
      {/* The panel already names the selected castle. */}
      {hovered &&
        hovered !== selected &&
        castles?.features.includes(hovered) && (
          <CastleTooltip
            castle={hovered}
            view={view}
            clan={showClans ? ownership.get(hovered.properties.id) : undefined}
          />
        )}
      {selected && <FlyToCastle castle={selected} panelRef={panelRef} />}
      {castles && (
        <FitToClan
          castles={castles}
          panelRef={panelRef}
          legendRef={legendRef}
          bottomBarRef={bottomBarRef}
        />
      )}
      <NavigationControl position="top-right" />
    </Map>
  )
}
