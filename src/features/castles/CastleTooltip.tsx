import { Popup } from 'react-map-gl/maplibre'
import type { CastleFeature } from '../../data/castleSchema'

export function CastleTooltip({ castle }: { castle: CastleFeature }) {
  const [longitude, latitude] = castle.geometry.coordinates
  const { name_ja, reading, name_en } = castle.properties

  return (
    <Popup
      key={castle.properties.id}
      className="castle-tooltip"
      longitude={longitude}
      latitude={latitude}
      offset={14}
      closeButton={false}
      closeOnClick={false}
      focusAfterOpen={false}
    >
      <p className="font-serif text-xs">{reading}</p>
      <p className="font-serif text-lg leading-tight">{name_ja}</p>
      <p className="font-serif text-xs">{name_en}</p>
    </Popup>
  )
}
