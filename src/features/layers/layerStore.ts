import { create } from 'zustand'

interface LayerState {
  provinces: boolean
  clanColors: boolean
  toggle: (layer: 'provinces' | 'clanColors') => void
}

export const useLayers = create<LayerState>()((set) => ({
  provinces: true,
  clanColors: true,
  toggle: (layer) => set((state) => ({ [layer]: !state[layer] })),
}))
