import type { ExpressionSpecification } from 'maplibre-gl'
import { Layer, Source } from 'react-map-gl/maplibre'
import type { CastleCollection } from '../../data/castleSchema'
import { SHU, SUMI, WASHI } from '../../map/mapStyle'

/** Invisible layer, larger than the dots, so castles are easy to hit by touch. */
export const CASTLE_HIT_LAYER = 'castle-hits'

interface Props {
  castles: CastleCollection
  hoveredId: string | null
  selectedId: string | null
}

const isCastle = (id: string | null): ExpressionSpecification => [
  '==',
  ['get', 'id'],
  id ?? '',
]

export function CastleLayers({ castles, hoveredId, selectedId }: Props) {
  const selected = isCastle(selectedId)
  const hovered = isCastle(hoveredId)

  return (
    <Source id="castles" type="geojson" data={castles}>
      <Layer
        id={CASTLE_HIT_LAYER}
        type="circle"
        paint={{ 'circle-radius': 16, 'circle-opacity': 0 }}
      />
      <Layer
        id="castle-halo"
        type="circle"
        filter={selected}
        paint={{
          'circle-radius': 15,
          'circle-color': SHU,
          'circle-opacity': 0.25,
          'circle-stroke-color': SHU,
          'circle-stroke-width': 1.5,
        }}
      />
      <Layer
        id="castle-dots"
        type="circle"
        layout={{ 'circle-sort-key': ['case', selected, 2, hovered, 1, 0] }}
        paint={{
          'circle-radius': ['case', selected, 8, hovered, 7, 5],
          'circle-color': ['case', selected, SHU, SUMI],
          'circle-stroke-color': WASHI,
          'circle-stroke-width': 1.5,
        }}
      />
    </Source>
  )
}
