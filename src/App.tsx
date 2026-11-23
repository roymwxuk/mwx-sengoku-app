import { useCallback, useMemo, useRef } from 'react'
import { useMapData } from './data/useMapData'
import { CastleList } from './features/castles/CastleList'
import { CastlePanel } from './features/castles/CastlePanel'
import { useSelection } from './features/castles/selectionStore'
import { useCastleUrlSync } from './features/castles/useCastleUrlSync'
import {
  ownershipIn,
  REFERENCE_YEAR,
  type Ownership,
} from './features/clans/ownership'
import { LegendPanel } from './features/layers/LegendPanel'
import { JapanMap } from './map/JapanMap'

const NO_OWNERSHIP: Ownership = new Map()

function App() {
  const state = useMapData()
  const data = state.status === 'ready' ? state.data : null
  const castles = data?.castles ?? null
  useCastleUrlSync(castles)

  const ownership = useMemo(
    () =>
      data
        ? ownershipIn(REFERENCE_YEAR, data.castles, data.clans)
        : NO_OWNERSHIP,
    [data],
  )

  const panelRef = useRef<HTMLElement>(null)
  const selectedCastleId = useSelection((s) => s.selectedCastleId)
  const selectCastle = useSelection((s) => s.selectCastle)
  const closePanel = useCallback(() => selectCastle(null), [selectCastle])

  const selected =
    castles?.features.find((c) => c.properties.id === selectedCastleId) ?? null

  return (
    <main
      data-panel-open={selected ? '' : undefined}
      className="relative h-dvh w-full overflow-hidden bg-sea font-serif text-sumi"
    >
      <JapanMap
        castles={castles}
        ownership={ownership}
        selected={selected}
        panelRef={panelRef}
      />
      {castles && <CastleList castles={castles} />}
      {data && (
        <LegendPanel
          clans={data.clans}
          ownership={ownership}
          hasUnowned={ownership.size < data.castles.features.length}
        />
      )}
      {selected && (
        <CastlePanel
          ref={panelRef}
          feature={selected}
          clan={ownership.get(selected.properties.id)}
          onClose={closePanel}
        />
      )}
      <h1 className="pointer-events-none absolute top-3 left-3 border-l-4 border-shu bg-washi/90 px-3 py-2 text-xl tracking-widest shadow-sm">
        戦国城地図
      </h1>
      {state.status === 'error' && (
        <p
          role="alert"
          className="absolute bottom-14 left-1/2 w-max max-w-[90%] -translate-x-1/2 bg-washi px-4 py-2 shadow-md"
        >
          城のデータを読み込めませんでした。
        </p>
      )}
    </main>
  )
}

export default App
