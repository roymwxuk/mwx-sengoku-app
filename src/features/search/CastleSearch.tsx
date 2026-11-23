import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'
import type { CastleCollection } from '../../data/castleSchema'
import { useSelection } from '../castles/selectionStore'
import { buildIndex, searchCastles } from './searchCastles'

const LIST_ID = 'search-results'
const optionId = (castleId: string) => `search-result-${castleId}`

/** Search box with a list of results (the ARIA combobox pattern). */
export function CastleSearch({ castles }: { castles: CastleCollection }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const activeRef = useRef<HTMLLIElement>(null)
  const flyToCastle = useSelection((s) => s.flyToCastle)

  const index = useMemo(() => buildIndex(castles), [castles])
  const results = useMemo(() => searchCastles(query, index), [query, index])
  const showResults = open && query.trim() !== ''
  const active = showResults ? results[activeIndex] : undefined

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' })
  }, [active])

  // Not closed on every blur: hiding a phone's keyboard also blurs the box.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function onBlur({ relatedTarget }: FocusEvent) {
    if (relatedTarget && !rootRef.current?.contains(relatedTarget)) {
      setOpen(false)
    }
  }

  function search(text: string) {
    setQuery(text)
    setActiveIndex(0)
    setOpen(true)
  }

  function choose(id: string) {
    flyToCastle(id)
    setQuery('')
    setOpen(false)
    // Hides the keyboard, which would cover the castle.
    if (window.matchMedia('(pointer: coarse)').matches) inputRef.current?.blur()
  }

  function move(step: 1 | -1) {
    setOpen(true)
    if (results.length === 0) return
    setActiveIndex(
      showResults ? (activeIndex + step + results.length) % results.length : 0,
    )
  }

  function onKeyDown(event: KeyboardEvent) {
    // These keys belong to the input method while it converts kana to kanji.
    // Safari ends the conversion first, and reports only the key code 229.
    if (event.nativeEvent.isComposing || event.keyCode === 229) {
      event.stopPropagation()
      return
    }
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        move(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        move(-1)
        break
      case 'Enter':
        if (active) choose(active.castle.id)
        break
      case 'Escape':
        if (!query) break // closes the panel
        event.stopPropagation()
        event.preventDefault()
        search('')
        break
    }
  }

  return (
    <div
      ref={rootRef}
      role="search"
      onBlur={onBlur}
      className="castle-search absolute left-3 w-64"
    >
      <input
        ref={inputRef}
        type="search"
        role="combobox"
        aria-label="城を検索"
        aria-expanded={showResults && results.length > 0}
        aria-controls={LIST_ID}
        aria-autocomplete="list"
        aria-activedescendant={active && optionId(active.castle.id)}
        placeholder="城を検索"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="search"
        value={query}
        onChange={(event) => search(event.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="h-11 w-full border-l-4 border-shu bg-washi px-3 text-base shadow-md placeholder:text-sumi/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu"
      />

      <div className="castle-search-results absolute inset-x-0 top-full mt-1 overflow-y-auto overscroll-contain bg-washi shadow-lg">
        <ul
          id={LIST_ID}
          role="listbox"
          aria-label="検索結果"
          hidden={!showResults || results.length === 0}
        >
          {showResults &&
            results.map(({ castle, nameLabel }, i) => (
              <li
                key={castle.id}
                ref={i === activeIndex ? activeRef : undefined}
                id={optionId(castle.id)}
                role="option"
                aria-selected={i === activeIndex}
                // Keeps the focus in the search box.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(castle.id)}
                className="cursor-pointer border-b border-l-4 border-b-sumi/15 border-l-transparent px-3 py-2 last:border-b-0 hover:bg-sumi/5 aria-selected:border-l-shu aria-selected:bg-shu/10"
              >
                <span className="block text-xs">{castle.reading}</span>
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-lg leading-tight">
                    {castle.name_ja}
                  </span>
                  <span className="text-sm">{castle.province}国</span>
                </span>
                {nameLabel && (
                  <span className="block text-xs">{nameLabel}</span>
                )}
              </li>
            ))}
        </ul>
        <p role="status" className={results.length > 0 ? 'sr-only' : undefined}>
          {showResults &&
            (results.length > 0 ? (
              `${results.length}件`
            ) : (
              <span className="block px-4 py-3">城が見つかりません</span>
            ))}
        </p>
      </div>
    </div>
  )
}
