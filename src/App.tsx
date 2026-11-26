import { useCallback, useMemo, useRef } from 'react'
import { useMapData } from './data/useMapData'
import { useProvinceReadings } from './data/useProvinceReadings'
import { AboutDialog } from './features/about/AboutDialog'
import { CastleList } from './features/castles/CastleList'
import { CastlePanel } from './features/castles/CastlePanel'
import { statusesIn, type Statuses } from './features/castles/castleStatus'
import { useSelection } from './features/castles/selectionStore'
import { useCastleUrlSync } from './features/castles/useCastleUrlSync'
import { useClanFilter } from './features/clans/clanFilterStore'
import { filterByClan } from './features/clans/filterByClan'
import { ownershipIn, type Ownership } from './features/clans/ownership'
import { useClanFilterUrlSync } from './features/clans/useClanFilterUrlSync'
import { LegendPanel } from './features/layers/LegendPanel'
import { CastleSearch } from './features/search/CastleSearch'
import { useYearUrlSync } from './features/years/useYearUrlSync'
import { YearSwitch } from './features/years/YearSwitch'
import { useYear } from './features/years/yearStore'
import { JapanMap } from './map/JapanMap'

const NO_OWNERSHIP: Ownership = new Map()
const NO_STATUSES: Statuses = new Map()

function App() {
  const state = useMapData()
  const data = state.status === 'ready' ? state.data : null
  const castles = data?.castles ?? null
  const provinceReadings = useProvinceReadings()
  useCastleUrlSync(castles)
  useYearUrlSync()
  useClanFilterUrlSync(data?.clans ?? null)

  const view = useYear((s) => s.view)

  const ownership = useMemo(
    () => (data ? ownershipIn(view, data.castles, data.clans) : NO_OWNERSHIP),
    [data, view],
  )

  const panelRef = useRef<HTMLElement>(null)
  const legendRef = useRef<HTMLDivElement>(null)
  const bottomBarRef = useRef<HTMLDivElement>(null)
  const selectedCastleId = useSelection((s) => s.selectedCastleId)
  const selectCastle = useSelection((s) => s.selectCastle)
  const closePanel = useCallback(() => selectCastle(null), [selectCastle])

  const statuses = useMemo(
    () => (castles ? statusesIn(view.year, castles) : NO_STATUSES),
    [castles, view],
  )

  const clanId = useClanFilter((s) => s.clanId)
  const shownCastles = useMemo(
    () => castles && filterByClan(castles, clanId, ownership, selectedCastleId),
    [castles, clanId, ownership, selectedCastleId],
  )

  const selected =
    castles?.features.find((c) => c.properties.id === selectedCastleId) ?? null

  return (
    <main
      data-panel-open={selected ? '' : undefined}
      className="relative h-dvh w-full overflow-hidden bg-sea font-serif text-sumi"
    >
      <JapanMap
        castles={shownCastles}
        view={view}
        ownership={ownership}
        statuses={statuses}
        selected={selected}
        panelRef={panelRef}
        legendRef={legendRef}
        bottomBarRef={bottomBarRef}
      />
      {data && (
        <LegendPanel
          clans={data.clans}
          view={view}
          ownership={ownership}
          statuses={statuses}
          ref={legendRef}
        />
      )}
      {selected && (
        <CastlePanel
          ref={panelRef}
          feature={selected}
          clan={ownership.get(selected.properties.id)}
          provinceReading={provinceReadings.get(selected.properties.province)}
          view={view}
          onClose={closePanel}
        />
      )}
      <h1 className="pointer-events-none absolute top-3 left-3 border-l-4 border-shu bg-washi/90 px-3 py-2 text-xl tracking-widest shadow-sm">
        戦国城地図
      </h1>
      <YearSwitch />
      <div
        ref={bottomBarRef}
        className="bottom-bar pointer-events-none absolute left-3 flex gap-2 *:pointer-events-auto"
      >
        {shownCastles && <CastleList castles={shownCastles} view={view} />}
        <AboutDialog />
      </div>
      {castles && <CastleSearch castles={castles} />}
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
