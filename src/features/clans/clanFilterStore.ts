import { create } from 'zustand'
import { castleIdFromUrl } from '../castles/castleUrl'
import { clanIdFromUrl } from './clanFilterUrl'

interface ClanFilterState {
  /** Show only this clan's castles. null: show all */
  clanId: string | null
  setClanId: (id: string | null) => void
  /** Goes up to fit the map to the clan's castles again. */
  fits: number
  /** Shows only the clan's castles and fits the map to them. */
  focusClan: (id: string) => void
}

const initialClanId = clanIdFromUrl()

export const useClanFilter = create<ClanFilterState>()((set) => ({
  clanId: initialClanId,
  setClanId: (id) => set({ clanId: id }),
  // A link to a clan fits the map to it, unless it also names a castle to fly to.
  fits: initialClanId && !castleIdFromUrl() ? 1 : 0,
  focusClan: (id) => set((s) => ({ clanId: id, fits: s.fits + 1 })),
}))
