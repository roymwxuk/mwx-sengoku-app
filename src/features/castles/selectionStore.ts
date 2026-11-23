import { create } from 'zustand'
import { castleIdFromUrl } from './castleUrl'

interface SelectionState {
  selectedCastleId: string | null
  selectCastle: (id: string | null) => void
}

export const useSelection = create<SelectionState>()((set) => ({
  selectedCastleId: castleIdFromUrl(),
  selectCastle: (id) => set({ selectedCastleId: id }),
}))
