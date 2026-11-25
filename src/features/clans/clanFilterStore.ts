import { create } from 'zustand'
import { clanIdFromUrl } from './clanFilterUrl'

interface ClanFilterState {
  /** Show only this clan's castles. null: show all */
  clanId: string | null
  setClanId: (id: string | null) => void
}

export const useClanFilter = create<ClanFilterState>()((set) => ({
  clanId: clanIdFromUrl(),
  setClanId: (id) => set({ clanId: id }),
}))
