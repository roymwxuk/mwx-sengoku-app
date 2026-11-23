import { create } from 'zustand'
import { castleIdFromUrl } from './castleUrl'

interface SelectionState {
  selectedCastleId: string | null
  selectCastle: (id: string | null) => void
  /** Goes up to fly to the castle again when it's already selected. */
  flights: number
  /** Selects the castle and flies to it, even if it's already selected. */
  flyToCastle: (id: string) => void
}

export const useSelection = create<SelectionState>()((set) => ({
  selectedCastleId: castleIdFromUrl(),
  selectCastle: (id) => set({ selectedCastleId: id }),
  flights: 0,
  flyToCastle: (id) =>
    set((s) => ({ selectedCastleId: id, flights: s.flights + 1 })),
}))
