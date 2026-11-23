import { DEFAULT_VIEW, YEAR_VIEWS, type YearView } from './yearViews'

// The year is kept in the URL as ?year=<year>, except for the default (ADR-0006).
const PARAM = 'year'

export function yearViewFromUrl(): YearView {
  const year = new URLSearchParams(window.location.search).get(PARAM)
  return YEAR_VIEWS.find((v) => String(v.year) === year) ?? DEFAULT_VIEW
}

/** Replaces the history entry, so changing years doesn't fill the back button. */
export function putYearViewInUrl(view: YearView) {
  const url = new URL(window.location.href)
  if (view === DEFAULT_VIEW) url.searchParams.delete(PARAM)
  else url.searchParams.set(PARAM, String(view.year))
  window.history.replaceState(null, '', url)
}
