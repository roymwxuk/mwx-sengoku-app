import { create } from 'zustand'

interface SelectionState {
  selectedCastleId: string | null
  selectCastle: (id: string | null) => void
}

export const useSelection = create<SelectionState>()((set) => ({
  selectedCastleId: null,
  selectCastle: (id) => set({ selectedCastleId: id }),
}))
