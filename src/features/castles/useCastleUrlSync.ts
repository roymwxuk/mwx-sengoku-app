import { useEffect } from 'react'
import type { CastleCollection } from '../../data/castleSchema'
import {
  castleIdFromUrl,
  pushCastleToUrl,
  removeCastleFromUrl,
} from './castleUrl'
import { useSelection } from './selectionStore'

/** Keeps the selected castle and the URL in step, in both directions. */
export function useCastleUrlSync(castles: CastleCollection | null) {
  const selectedCastleId = useSelection((s) => s.selectedCastleId)
  const selectCastle = useSelection((s) => s.selectCastle)

  useEffect(() => {
    // After back/forward the URL already matches, so nothing is pushed.
    const unsubscribe = useSelection.subscribe(({ selectedCastleId }) => {
      if (selectedCastleId !== castleIdFromUrl()) {
        pushCastleToUrl(selectedCastleId)
      }
    })
    const onPopState = () => selectCastle(castleIdFromUrl())
    window.addEventListener('popstate', onPopState)

    return () => {
      unsubscribe()
      window.removeEventListener('popstate', onPopState)
    }
  }, [selectCastle])

  // A link to a castle that doesn't exist: drop it without a history entry.
  useEffect(() => {
    if (!castles || !selectedCastleId) return
    const exists = castles.features.some(
      (castle) => castle.properties.id === selectedCastleId,
    )
    if (exists) return
    removeCastleFromUrl()
    selectCastle(null)
  }, [castles, selectedCastleId, selectCastle])
}
