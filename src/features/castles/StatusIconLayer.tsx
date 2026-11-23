import type { ExpressionSpecification } from 'maplibre-gl'
import { Layer } from 'react-map-gl/maplibre'

interface Props {
  source: string
  isPlanned: ExpressionSpecification
  isRuin: ExpressionSpecification
  selected: ExpressionSpecification
  hovered: ExpressionSpecification
}

/** Castles not standing in the year shown: dotted if not built yet, ✕ if abandoned */
export function StatusIconLayer({
  source,
  isPlanned,
  isRuin,
  selected,
  hovered,
}: Props) {
  const scale = (base: number): ExpressionSpecification => [
    'case',
    ['any', selected, hovered],
    base * 1.2,
    base,
  ]

  return (
    <Layer
      id="castle-status"
      type="symbol"
      source={source} // not set by <Source>, which only reaches direct children
      filter={['any', isPlanned, isRuin]}
      layout={{
        'icon-image': [
          'case',
          isRuin,
          ['case', selected, 'ruin-selected', 'ruin'],
          ['case', selected, 'planned-selected', 'planned'],
        ],
        'icon-size': [
          'interpolate',
          ['linear'],
          ['zoom'],
          5,
          scale(0.8),
          7,
          scale(1.1),
        ],
        // Higher is drawn on top.
        'symbol-sort-key': ['case', selected, 2, isRuin, 1, 0],
        'icon-allow-overlap': true,
        'icon-padding': 4,
      }}
    />
  )
}
