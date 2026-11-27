import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import type { CastleCollection } from '../../data/castleSchema'
import type { YearView } from '../years/yearViews'
import { nameIn } from './castleName'
import { useSelection } from './selectionStore'

/** Below this width the open list could cover the castle that was chosen. */
const ROOM_FOR_LIST = '(width >= 64rem)'

const LIST_ID = 'castle-list'

interface Props {
  castles: CastleCollection
  view: YearView
}

export function CastleList({ castles, view }: Props) {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const currentRef = useRef<HTMLButtonElement>(null)
  const selectedCastleId = useSelection((s) => s.selectedCastleId)
  const selectCastle = useSelection((s) => s.selectCastle)

  const sorted = useMemo(
    () =>
      castles.features
        .map((feature) => feature.properties)
        .sort((a, b) => a.reading.localeCompare(b.reading, 'ja')),
    [castles],
  )

  useEffect(() => {
    if (open) currentRef.current?.scrollIntoView({ block: 'nearest' })
  }, [open, selectedCastleId])

  function close() {
    setOpen(false)
    toggleRef.current?.focus() // the focused item is about to disappear
  }

  function choose(id: string) {
    selectCastle(id)
    if (!window.matchMedia(ROOM_FOR_LIST).matches) close()
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !open) return
    event.stopPropagation() // close only the list, not the panel as well
    close()
  }

  return (
    <div onKeyDown={onKeyDown} className="relative">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={LIST_ID}
        onClick={() => setOpen(!open)}
        className="h-11 cursor-pointer border-l-4 border-shu bg-washi px-4 shadow-md hover:text-shu focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu"
      >
        城一覧 <span className="text-sm tabular-nums">{sorted.length}城</span>{' '}
        <span
          aria-hidden="true"
          className={`inline-block ${open ? '' : 'rotate-180'}`}
        >
          ▾
        </span>
      </button>

      <nav
        id={LIST_ID}
        aria-label="城一覧"
        hidden={!open}
        className="castle-list-items absolute bottom-full left-0 mb-2 w-64 overflow-y-auto overscroll-contain bg-washi shadow-lg"
      >
        {sorted.length === 0 && <p className="px-4 py-3">城がありません</p>}
        <ul>
          {sorted.map((castle) => {
            const name = nameIn(view, castle)
            const current = castle.id === selectedCastleId
            return (
              <li
                key={castle.id}
                className="border-b border-sumi/15 last:border-b-0"
              >
                <button
                  ref={current ? currentRef : undefined}
                  type="button"
                  aria-current={current ? 'true' : undefined}
                  onClick={() => choose(castle.id)}
                  className="w-full cursor-pointer border-l-4 border-transparent px-4 py-2 text-left hover:bg-sumi/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-shu aria-[current]:border-shu aria-[current]:bg-shu/10"
                >
                  <span className="block text-xs">{castle.reading}</span>
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="text-lg leading-tight">
                      {castle.name_ja}
                    </span>
                    <span className="text-sm">{castle.province}国</span>
                  </span>
                  {name !== castle && (
                    <span className="block text-xs">
                      {view.year}年の名 {name.name_ja}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
