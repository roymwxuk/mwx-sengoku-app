// The clan filter is kept in the URL as ?clan=<id> (ADR-0006).
const PARAM = 'clan'

export function clanIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get(PARAM) || null
}

/** Replaces the history entry, so filtering doesn't fill the back button. */
export function putClanIdInUrl(clanId: string | null) {
  const url = new URL(window.location.href)
  if (clanId) url.searchParams.set(PARAM, clanId)
  else url.searchParams.delete(PARAM)
  window.history.replaceState(null, '', url)
}
