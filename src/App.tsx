import { JapanMap } from './map/JapanMap'

function App() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-sea font-serif text-sumi">
      <JapanMap />
      <h1 className="pointer-events-none absolute top-3 left-3 border-l-4 border-shu bg-washi/90 px-3 py-2 text-xl tracking-widest shadow-sm">
        戦国城地図
      </h1>
    </main>
  )
}

export default App
