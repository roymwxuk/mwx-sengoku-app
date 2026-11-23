import { useCastles } from './data/useCastles'
import { JapanMap } from './map/JapanMap'

function App() {
  const state = useCastles()

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-sea font-serif text-sumi">
      <JapanMap castles={state.status === 'ready' ? state.castles : null} />
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
