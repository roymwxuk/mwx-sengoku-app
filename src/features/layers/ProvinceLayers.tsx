import { Layer, Source } from 'react-map-gl/maplibre'
import { MAP_FONT, SUMI, WASHI } from '../../map/mapStyle'

/** Short, for the map's corner. The legend has the full credit. */
const CREDIT =
  '<a href="https://geoshape.ex.nii.ac.jp/kg/" target="_blank" rel="noreferrer">旧国境: CODH</a>'

/** 令制国 borders and names. Always mounted, so it stays below the castles. */
export function ProvinceLayers({ visible }: { visible: boolean }) {
  const visibility = visible ? 'visible' : 'none'

  return (
    <Source
      id="provinces"
      type="geojson"
      data={`${import.meta.env.BASE_URL}data/provinces.geojson`}
      attribution={CREDIT}
    >
      <Layer
        id="province-borders"
        type="line"
        filter={['==', ['get', 'kind'], 'border']}
        layout={{ visibility, 'line-join': 'round' }}
        paint={{
          'line-color': SUMI,
          'line-opacity': 0.45,
          'line-dasharray': [3, 2],
          'line-width': ['interpolate', ['linear'], ['zoom'], 4, 0.5, 9, 1.5],
        }}
      />
      <Layer
        id="province-names"
        type="symbol"
        filter={['==', ['get', 'kind'], 'label']}
        layout={{
          visibility,
          'text-field': ['get', 'name_ja'],
          'text-font': MAP_FONT,
          'text-size': ['interpolate', ['linear'], ['zoom'], 5, 11, 8, 20],
          'text-letter-spacing': 0.15,
          'text-variable-anchor': ['center', 'top', 'bottom', 'left', 'right'],
          'text-radial-offset': 0.8,
          'text-justify': 'auto',
        }}
        paint={{
          'text-color': SUMI,
          'text-opacity': 0.7,
          'text-halo-color': WASHI,
          'text-halo-width': 1.5,
        }}
      />
    </Source>
  )
}
