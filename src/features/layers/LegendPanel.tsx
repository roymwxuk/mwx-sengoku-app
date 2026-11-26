import { useRef, useState, type ReactNode, type RefObject } from 'react'
import type { Clan } from '../../data/clanSchema'
import { useClanFilter } from '../clans/clanFilterStore'
import { NO_CLAN_COLOR, textColorOn } from '../clans/colors'
import { CASTLE_SHAPES, SHAPE_SIZE } from '../castles/castleShapes'
import { wikipediaUrl } from '../castles/castleLinks'
import { idsWith, type Statuses } from '../castles/castleStatus'
import { useSelection } from '../castles/selectionStore'
import type { Ownership } from '../clans/ownership'
import type { YearView } from '../years/yearViews'
import { useLayers } from './layerStore'

const PANEL_ID = 'legend'

/** Wide, tall screens have room for the legend from the start. */
const ROOM_FOR_LEGEND = '(width >= 64rem) and (height >= 40rem)'

interface Props {
  clans: Clan[]
  view: YearView
  ownership: Ownership
  statuses: Statuses
  /** So the map can keep castles out from under the legend */
  ref: RefObject<HTMLDivElement | null>
}

export function LegendPanel({ clans, view, ownership, statuses, ref }: Props) {
  const [open, setOpen] = useState(
    () => window.matchMedia(ROOM_FOR_LEGEND).matches,
  )
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { provinces, clanColors, toggle } = useLayers()
  const { clanId, setClanId, focusClan } = useClanFilter()
  const filterClan = clans.find((clan) => clan.id === clanId)

  const present = new Set(ownership.values())
  const hasUnowned = idsWith('standing', statuses).some(
    (id) => !ownership.has(id),
  )
  const hasPlanned = idsWith('planned', statuses).length > 0
  const hasRuins = idsWith('ruin', statuses).length > 0

  function toggleFilter(clan: Clan) {
    if (clan.id === clanId) {
      setClanId(null)
      return
    }
    // Otherwise another clan's castle would stay on the map.
    const { selectedCastleId, selectCastle } = useSelection.getState()
    if (selectedCastleId && ownership.get(selectedCastleId) !== clan) {
      selectCastle(null)
    }
    focusClan(clan.id)
  }

  return (
    <div
      ref={ref}
      data-filtered={filterClan ? '' : undefined}
      className="legend pointer-events-none absolute top-28 right-2.5 flex flex-col items-end gap-2 *:pointer-events-auto"
    >
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={PANEL_ID}
        onClick={() => setOpen(!open)}
        className="h-11 cursor-pointer border-r-4 border-shu bg-washi px-4 shadow-md hover:text-shu focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu"
      >
        凡例{' '}
        <span
          aria-hidden="true"
          className={`inline-block ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>

      {filterClan && (
        <FilterChip
          clan={filterClan}
          count={[...ownership.values()].filter((c) => c === filterClan).length}
          onClear={() => {
            setClanId(null)
            toggleRef.current?.focus() // the chip is about to disappear
          }}
        />
      )}

      <section
        id={PANEL_ID}
        aria-label="凡例"
        hidden={!open}
        className="legend-items w-48 overflow-y-auto overscroll-contain bg-washi px-4 py-2 shadow-lg"
      >
        <Toggle
          label="国境・国名"
          checked={provinces}
          onChange={() => toggle('provinces')}
        />
        <Toggle
          label="大名家の色"
          checked={clanColors}
          onChange={() => toggle('clanColors')}
        />

        <h2 className="mt-1 border-t border-sumi/20 pt-2 text-sm">城の種類</h2>
        <ul className="grid grid-cols-2 py-1">
          {Object.entries(CASTLE_SHAPES).map(([type, path]) => (
            <li key={type} className="flex items-center gap-2 py-1">
              <svg
                aria-hidden="true"
                viewBox={`0 0 ${SHAPE_SIZE} ${SHAPE_SIZE}`}
                className="size-5 shrink-0 fill-sumi"
              >
                <path d={path} />
              </svg>
              {type}
            </li>
          ))}
        </ul>

        {clanColors && (
          <>
            <h2 className="mt-1 border-t border-sumi/20 pt-2 text-sm">
              {view.year}年の大名家
            </h2>
            {view.note && <p className="text-xs">{view.note}</p>}
            <ul className="py-1">
              {clans
                .filter((clan) => present.has(clan))
                .map((clan) => (
                  <li key={clan.id} className="-mx-2 flex items-center">
                    <button
                      type="button"
                      aria-pressed={clan === filterClan}
                      onClick={() => toggleFilter(clan)}
                      className="flex grow cursor-pointer items-center gap-2 px-2 py-1 text-left hover:text-shu focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shu aria-pressed:bg-shu/10 aria-pressed:text-shu"
                    >
                      <ClanMark color={clan.color} mark={clan.mark} />
                      {clan.name_ja}
                    </button>
                    {clan.wikipedia_ja && (
                      <a
                        href={wikipediaUrl(clan.wikipedia_ja)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${clan.name_ja}（Wikipedia、新しいタブで開く）`}
                        className="px-2 py-1 hover:text-shu focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shu"
                      >
                        <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </li>
                ))}
              {hasUnowned && (
                <li className="flex items-center gap-2 py-1">
                  <ClanMark color={NO_CLAN_COLOR} />
                  城主不明
                </li>
              )}
            </ul>
          </>
        )}
        {(hasPlanned || hasRuins) && (
          <ul className="border-t border-sumi/20 py-1">
            {hasPlanned && (
              <StatusItem label="築城前">
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  strokeWidth="2.6"
                  strokeDasharray="0 5.0265"
                />
              </StatusItem>
            )}
            {hasRuins && (
              <StatusItem label="廃城">
                <path d="M7 7 17 17M17 7 7 17" strokeWidth="3" />
              </StatusItem>
            )}
          </ul>
        )}

        {provinces && (
          <p className="border-t border-sumi/20 py-2 text-xs leading-relaxed">
            国境:
            『旧国・旧郡境界データセット』（CODH作成）「幕末明治地勢地図境界データ」（人間文化研究機構作成）を加工（
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.ja"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-shu"
            >
              CC BY-NC 4.0
            </a>
            ）
          </p>
        )}
      </section>
    </div>
  )
}

interface FilterChipProps {
  clan: Clan
  /** How many castles it holds in the year shown */
  count: number
  onClear: () => void
}

/** Says that castles are hidden, even while the legend is closed. */
function FilterChip({ clan, count, onClear }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-label={`${clan.name_ja}のみ表示中、${count}城。すべての城を表示`}
      onClick={onClear}
      className="flex h-11 cursor-pointer items-center gap-2 bg-washi px-3 whitespace-nowrap shadow-md hover:text-shu focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu"
    >
      <ClanMark color={clan.color} mark={clan.mark} />
      {clan.name_ja}のみ（{count}城）
      <span aria-hidden="true" className="text-2xl leading-none">
        ×
      </span>
    </button>
  )
}

function StatusItem({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <li className="flex items-center gap-2 py-1">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        className="size-6 shrink-0 fill-none stroke-sumi"
      >
        {children}
      </svg>
      {label}
    </li>
  )
}

function ClanMark({ color, mark }: { color: string; mark?: string }) {
  return (
    <span
      aria-hidden="true"
      className="grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] border-sumi text-sm leading-none"
      style={{ backgroundColor: color, color: textColorOn(color) }}
    >
      {mark}
    </span>
  )
}

interface ToggleProps {
  label: string
  checked: boolean
  onChange: () => void
}

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-5 cursor-pointer accent-shu"
      />
      {label}
    </label>
  )
}
