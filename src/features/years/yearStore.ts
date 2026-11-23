import { create } from 'zustand'
import { yearViewFromUrl } from './yearUrl'
import type { YearView } from './yearViews'

interface YearState {
  view: YearView
  setView: (view: YearView) => void
}

export const useYear = create<YearState>()((set) => ({
  view: yearViewFromUrl(),
  setView: (view) => set({ view }),
}))
