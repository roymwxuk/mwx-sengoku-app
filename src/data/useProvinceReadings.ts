import { useEffect, useState } from 'react'
import { fetchJson } from './fetchJson'

/** Hiragana by province name */
export type ProvinceReadings = ReadonlyMap<string, string>

interface ProvinceFile {
  features: { properties: { name_ja?: string; reading?: string } }[]
}

const NO_READINGS: ProvinceReadings = new Map()

/**
 * Empty until loaded, and if loading fails: the app works without readings.
 * The map loads the same file, so it normally comes from the browser's cache.
 */
export function useProvinceReadings(): ProvinceReadings {
  const [readings, setReadings] = useState(NO_READINGS)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    async function load() {
      try {
        const { features } = await fetchJson<ProvinceFile>(
          'provinces.geojson',
          signal,
        )
        const loaded = new Map<string, string>()
        for (const { properties } of features) {
          const { name_ja, reading } = properties
          if (name_ja && reading) loaded.set(name_ja, reading)
        }
        setReadings(loaded)
      } catch (error) {
        if (signal.aborted) return
        console.error('Could not load the province readings', error)
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  return readings
}
