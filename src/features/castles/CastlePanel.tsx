import { useEffect, type ReactNode, type Ref } from 'react'
import { ExternalLink } from '../../components/ExternalLink'
import type { CastleFeature } from '../../data/castleSchema'
import type { Clan } from '../../data/clanSchema'
import { ClanName } from '../clans/ClanName'
import type { YearView } from '../years/yearViews'
import { googleMapsUrl, wikipediaUrl } from './castleLinks'
import { nameIn } from './castleName'
import { formatYears } from './formatYears'

interface Props {
  feature: CastleFeature
  /** The owner in the year shown */
  clan?: Clan
  view: YearView
  onClose: () => void
  ref: Ref<HTMLElement>
}

/** Side panel on wide screens, bottom sheet on phones. */
export function CastlePanel({ feature, clan, view, onClose, ref }: Props) {
  const castle = feature.properties
  const name = nameIn(view, castle)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <aside
      ref={ref}
      aria-labelledby="castle-name"
      className="absolute inset-x-0 bottom-0 h-(--sheet-height) border-t-4 border-shu bg-washi shadow-lg sm:inset-y-0 sm:right-auto sm:h-auto sm:w-80 sm:border-t-0 sm:border-r"
    >
      {/* Keyed so that a new castle starts scrolled to the top. */}
      <div
        key={castle.id}
        className="h-full overflow-y-auto px-5 pt-4 pb-6 sm:pt-20"
      >
        <p className="pr-12 text-sm">{name.reading}</p>
        <h2
          id="castle-name"
          className="pr-12 text-3xl leading-tight tracking-wide"
        >
          {name.name_ja}
        </h2>
        <p className="mt-1 text-sm">{name.name_en}</p>

        <p className="mt-4 leading-relaxed">{castle.description}</p>

        <ul className="mt-2 flex flex-wrap gap-x-4">
          <li>
            <ExternalLink href={googleMapsUrl(feature.geometry.coordinates)}>
              Googleマップ
            </ExternalLink>
          </li>
          {castle.wikipedia_ja && (
            <li>
              <ExternalLink href={wikipediaUrl(castle.wikipedia_ja)}>
                Wikipedia
              </ExternalLink>
            </li>
          )}
          {castle.official_url && (
            <li>
              <ExternalLink href={castle.official_url}>公式サイト</ExternalLink>
            </li>
          )}
        </ul>

        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-t border-sumi/20 pt-4">
          {name !== castle && (
            <Row label="後の名">
              {castle.name_ja}（{castle.reading}）
            </Row>
          )}
          {castle.former_names.length > 0 && (
            <Row label="旧名">
              {castle.former_names.map((former) => (
                <p key={former.name_ja}>
                  {former.name_ja}（{former.reading}）
                  {former.until && ` 〜${former.until}年`}
                </p>
              ))}
            </Row>
          )}
          {clan && (
            <Row label="城主">
              <ClanName clan={clan} />（{view.year}年）
            </Row>
          )}
          <Row label="国">{castle.province}国</Row>
          <Row label="種類">{castle.type}</Row>
          <Row label="築城">
            {castle.built ? formatYears(castle.built) : '不明'}
          </Row>
          {castle.abandoned && (
            <Row label="廃城">{formatYears(castle.abandoned)}</Row>
          )}
        </dl>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="閉じる"
        className="absolute top-2 right-2 grid size-11 cursor-pointer place-items-center text-2xl leading-none hover:text-shu sm:top-16"
      >
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-shu">{label}</dt>
      <dd>{children}</dd>
    </>
  )
}
