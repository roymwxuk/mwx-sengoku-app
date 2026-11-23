import { useEffect, useState } from 'react'
import type { CastleCollection } from './castleSchema'

type CastlesState =
  | { status: 'loading' }
  | { status: 'ready'; castles: CastleCollection }
  | { status: 'error' }

export function useCastles(): CastlesState {
  const [state, setState] = useState<CastlesState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/castles.geojson`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        setState({ status: 'ready', castles: await response.json() })
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('Could not load castles', error)
        setState({ status: 'error' })
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  return state
}
