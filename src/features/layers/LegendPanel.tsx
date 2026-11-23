import { useState } from 'react'
import type { Clan } from '../../data/clanSchema'
import { NO_CLAN_COLOR, textColorOn } from '../clans/colors'
import { REFERENCE_YEAR, type Ownership } from '../clans/ownership'
import { useLayers } from './layerStore'

const PANEL_ID = 'legend'

/** Wide, tall screens have room for the legend from the start. */
const ROOM_FOR_LEGEND = '(width >= 64rem) and (height >= 40rem)'

interface Props {
  clans: Clan[]
  ownership: Ownership
  /** Some castles have no owner in the year shown */
  hasUnowned: boolean
}

export function LegendPanel({ clans, ownership, hasUnowned }: Props) {
  const [open, setOpen] = useState(
    () => window.matchMedia(ROOM_FOR_LEGEND).matches,
  )
  const { provinces, clanColors, toggle } = useLayers()

  const present = new Set(ownership.values())

  return (
    <div className="legend pointer-events-none absolute top-28 right-2.5 flex flex-col items-end gap-2 *:pointer-events-auto">
      <button
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

        {clanColors && (
          <>
            <h2 className="mt-1 border-t border-sumi/20 pt-2 text-sm">
              {REFERENCE_YEAR}年の大名家
            </h2>
            <ul className="py-1">
              {clans
                .filter((clan) => present.has(clan))
                .map((clan) => (
                  <li key={clan.id} className="flex items-center gap-2 py-1">
                    <ClanMark color={clan.color} mark={clan.mark} />
                    {clan.name_ja}
                  </li>
                ))}
              {hasUnowned && (
                <li className="flex items-center gap-2 py-1">
                  <ClanMark color={NO_CLAN_COLOR} />
                  築城前・不明
                </li>
              )}
            </ul>
          </>
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
