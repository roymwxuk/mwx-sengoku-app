// The selected castle is kept in the URL as ?castle=<id> (ADR-0006).
const PARAM = 'castle'

export function castleIdFromUrl(): string | null {
  return new URLSearchParams(window.location.search).get(PARAM) || null
}

function urlFor(castleId: string | null): URL {
  const url = new URL(window.location.href)
  if (castleId) url.searchParams.set(PARAM, castleId)
  else url.searchParams.delete(PARAM)
  return url
}

export function pushCastleToUrl(castleId: string | null) {
  window.history.pushState(null, '', urlFor(castleId))
}

export function removeCastleFromUrl() {
  window.history.replaceState(null, '', urlFor(null))
}
