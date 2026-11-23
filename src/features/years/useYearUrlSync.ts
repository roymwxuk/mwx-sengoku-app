import { useEffect } from 'react'
import { useYear } from './yearStore'
import { putYearViewInUrl, yearViewFromUrl } from './yearUrl'

/** Keeps the year and the URL in step, in both directions. */
export function useYearUrlSync() {
  const view = useYear((s) => s.view)
  const setView = useYear((s) => s.setView)

  useEffect(() => putYearViewInUrl(view), [view])

  useEffect(() => {
    const onPopState = () => setView(yearViewFromUrl())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [setView])
}
