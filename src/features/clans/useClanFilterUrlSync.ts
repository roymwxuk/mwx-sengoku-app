import { useEffect } from 'react'
import type { Clan } from '../../data/clanSchema'
import { useClanFilter } from './clanFilterStore'
import { clanIdFromUrl, putClanIdInUrl } from './clanFilterUrl'

/** Keeps the clan filter and the URL in step, in both directions. */
export function useClanFilterUrlSync(clans: Clan[] | null) {
  const clanId = useClanFilter((s) => s.clanId)
  const setClanId = useClanFilter((s) => s.setClanId)

  useEffect(() => putClanIdInUrl(clanId), [clanId])

  useEffect(() => {
    const onPopState = () => setClanId(clanIdFromUrl())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [setClanId])

  // A link to a clan that doesn't exist
  useEffect(() => {
    if (!clans || !clanId) return
    if (!clans.some((clan) => clan.id === clanId)) setClanId(null)
  }, [clans, clanId, setClanId])
}
