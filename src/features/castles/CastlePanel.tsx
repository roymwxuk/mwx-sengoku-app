import { useEffect, type ReactNode, type Ref } from 'react'
import type { CastleFeature } from '../../data/castleSchema'
import type { Clan } from '../../data/clanSchema'
import { REFERENCE_YEAR } from '../clans/ownership'
import { googleMapsUrl, wikipediaUrl } from './castleLinks'
import { formatYears } from './formatYears'

interface Props {
  feature: CastleFeature
  /** The owner in the reference year */
  clan?: Clan
  onClose: () => void
  ref: Ref<HTMLElement>
}

/** Side panel on wide screens, bottom sheet on phones. */
export function CastlePanel({ feature, clan, onClose, ref }: Props) {
  const castle = feature.properties

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
        <p className="pr-12 text-sm">{castle.reading}</p>
        <h2
          id="castle-name"
          className="pr-12 text-3xl leading-tight tracking-wide"
        >
          {castle.name_ja}
        </h2>
        <p className="mt-1 text-sm">{castle.name_en}</p>

        <p className="mt-4 leading-relaxed">{castle.description}</p>

        <ul className="mt-2 flex flex-wrap gap-x-5">
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
        </ul>

        <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-t border-sumi/20 pt-4">
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
              {clan.name_ja}（{REFERENCE_YEAR}年）
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

function ExternalLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-h-11 items-center gap-1 text-shu underline underline-offset-4 hover:text-sumi focus-visible:outline-2 focus-visible:outline-shu"
    >
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">（新しいタブで開く）</span>
    </a>
  )
}
