import { Popup } from 'react-map-gl/maplibre'
import type { CastleFeature } from '../../data/castleSchema'
import type { Clan } from '../../data/clanSchema'

import type { YearView } from '../years/yearViews'
import { nameIn } from './castleName'

interface Props {
  castle: CastleFeature
  clan?: Clan
  view: YearView
}

export function CastleTooltip({ castle, clan, view }: Props) {
  const [longitude, latitude] = castle.geometry.coordinates
  const { name_ja, reading, name_en } = nameIn(view, castle.properties)

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
      {clan && (
        <p className="mt-1 border-t border-sumi/20 pt-1 font-serif text-sm">
          {clan.name_ja}
        </p>
      )}
    </Popup>
  )
}
