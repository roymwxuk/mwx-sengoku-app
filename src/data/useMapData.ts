import { useEffect, useState } from 'react'
import type { CastleCollection } from './castleSchema'
import type { Clan } from './clanSchema'

export interface MapData {
  castles: CastleCollection
  clans: Clan[]
}

type MapDataState =
  | { status: 'loading' }
  | { status: 'ready'; data: MapData }
  | { status: 'error' }

async function fetchJson<T>(name: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}`, {
    signal,
  })
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`)
  return response.json()
}

export function useMapData(): MapDataState {
  const [state, setState] = useState<MapDataState>({ status: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function load() {
      try {
        const [castles, clans] = await Promise.all([
          fetchJson<CastleCollection>('castles.geojson', signal),
          fetchJson<Clan[]>('clans.json', signal),
        ])
        setState({ status: 'ready', data: { castles, clans } })
      } catch (error) {
        if (signal.aborted) return
        console.error('Could not load the castle data', error)
        setState({ status: 'error' })
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  return state
}
