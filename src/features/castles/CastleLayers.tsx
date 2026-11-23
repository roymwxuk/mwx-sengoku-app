import type { ExpressionSpecification } from 'maplibre-gl'
import { Layer, Source } from 'react-map-gl/maplibre'
import type { CastleCollection } from '../../data/castleSchema'
import { MAP_FONT, SHU, SUMI, WASHI } from '../../map/mapStyle'
import { NO_CLAN_COLOR, textColorOn } from '../clans/colors'
import type { Clan } from '../../data/clanSchema'
import type { Ownership } from '../clans/ownership'
import { typeIcon } from './castleIcons'
import { idsWith, type Statuses } from './castleStatus'
import { StatusIconLayer } from './StatusIconLayer'
import { useCastleIcons } from './useCastleIcons'

/** Invisible layer, larger than the icons, so castles are easy to hit by touch. */
export const CASTLE_HIT_LAYER = 'castle-hits'

const SOURCE = 'castles'

/** Centres the clan's mark in the widest part of the shape, in ems */
const MARK_OFFSET: ExpressionSpecification = [
  'match',
  ['get', 'type'],
  '山城',
  ['literal', [0, 0.2]],
  ['平山城', '館'],
  ['literal', [0, 0.1]],
  ['literal', [0, 0]],
]

interface Props {
  castles: CastleCollection
  /** null: don't show clans */
  ownership: Ownership | null
  statuses: Statuses
  hoveredId: string | null
  selectedId: string | null
}

const isCastle = (id: string | null): ExpressionSpecification => [
  '==',
  ['get', 'id'],
  id ?? '',
]

const isOneOf = (ids: string[]): ExpressionSpecification => [
  'in',
  ['get', 'id'],
  ['literal', ids],
]

/** Looks up a value by the castle's owner. */
function byOwner(
  ownership: Ownership | null,
  value: (clan: Clan) => string,
  fallback: string,
): ExpressionSpecification | string {
  if (!ownership || ownership.size === 0) return fallback
  const cases = [...ownership].flatMap(([id, clan]) => [id, value(clan)])
  // The spec's type can't describe a list of cases built at run time.
  return [
    'match',
    ['get', 'id'],
    ...cases,
    fallback,
  ] as unknown as ExpressionSpecification
}

/** 1 for castles with a known owner, otherwise 0 */
const hasOwner = (ownership: Ownership): ExpressionSpecification => [
  'case',
  isOneOf([...ownership.keys()]),
  1,
  0,
]

export function CastleLayers({
  castles,
  ownership,
  statuses,
  hoveredId,
  selectedId,
}: Props) {
  const ready = useCastleIcons()
  if (!ready) return null

  const selected = isCastle(selectedId)
  const hovered = isCastle(hoveredId)
  const isPlanned = isOneOf(idsWith('planned', statuses))
  const isRuin = isOneOf(idsWith('ruin', statuses))
  const isStanding = isOneOf(idsWith('standing', statuses))
  const size = (base: number): ExpressionSpecification => [
    'case',
    selected,
    base * 1.35,
    hovered,
    base * 1.2,
    base,
  ]

  return (
    <Source id={SOURCE} type="geojson" data={castles}>
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
          'circle-radius': ownership
            ? ['interpolate', ['linear'], ['zoom'], 5, 15, 7, 22]
            : 16,
          'circle-color': SHU,
          'circle-opacity': 0.25,
          'circle-stroke-color': SHU,
          'circle-stroke-width': 1.5,
        }}
      />
      <StatusIconLayer
        source={SOURCE}
        isPlanned={isPlanned}
        isRuin={isRuin}
        selected={selected}
        hovered={hovered}
      />
      <Layer
        id="castle-icons"
        type="symbol"
        filter={isStanding}
        layout={{
          'icon-image': ownership
            ? typeIcon(
                byOwner(ownership, (clan) => clan.color, NO_CLAN_COLOR),
                SUMI,
              )
            : typeIcon(['case', selected, SHU, SUMI], WASHI),
          'icon-size': ownership
            ? ['interpolate', ['linear'], ['zoom'], 5, size(0.6), 7, size(0.95)]
            : size(0.65),
          // Castles with an owner go above those without.
          'symbol-sort-key': [
            'case',
            selected,
            3,
            hovered,
            2,
            ownership ? hasOwner(ownership) : 0,
          ],
          'icon-allow-overlap': true,
          'icon-padding': 4, // keeps province names away
        }}
      />
      {ownership && (
        <Layer
          id="castle-marks"
          type="symbol"
          filter={isStanding}
          minzoom={6}
          layout={{
            'text-field': byOwner(ownership, (clan) => clan.mark, ''),
            'text-font': MAP_FONT,
            'text-size': ['interpolate', ['linear'], ['zoom'], 6, 10, 7, 13],
            'text-offset': MARK_OFFSET,
            'text-allow-overlap': true,
          }}
          paint={{
            'text-color': byOwner(
              ownership,
              (clan) => textColorOn(clan.color),
              WASHI,
            ),
          }}
        />
      )}
    </Source>
  )
}
